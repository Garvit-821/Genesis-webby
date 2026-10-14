/**
 * Form intake for every form on genesishacks.com.
 *
 * Order of work for each POST:
 *   1. Parse and validate (email format, lengths, known form types).
 *   2. Drop bots that fill the hidden honeypot field.
 *   3. Rate-limit by hashed IP (5 per 10 minutes, via Supabase).
 *   4. Upload a partner deck, if any, to the private "partner-decks" bucket.
 *   5. Store the row in Supabase (public.form_submissions).
 *   6. Forward to the Google Sheets webhook too, when configured.
 *   7. Optionally email the team through Resend.
 *
 * Responds 200 only when at least one store (Supabase or Sheets) accepted
 * the submission. The old handler answered 200 even when nothing was saved,
 * so leads could vanish silently (audit K03, L03).
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FORM_IP_SALT,
 *      GOOGLE_SHEETS_WEBHOOK_URL, RESEND_API_KEY, CONTACT_TO_EMAIL,
 *      CONTACT_FROM_EMAIL.
 */

const crypto = require("crypto");
const { isConfigured, insertRow, countRows, uploadObject, hashIp } = require("./_lib/supabase");

const FORM_TYPES = new Set(["contact", "partner", "collaborate", "work_with_us", "delhi_interest"]);
const FORM_ALIASES = { partner_collaborate: "partner" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HONEYPOT_KEY = "company_website_confirm";

const LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  organization: 200,
  message: 5000,
  payloadString: 2000,
  payloadArrayItems: 20,
  payloadKeys: 40,
  page: 512,
  userAgent: 512,
  attachmentName: 255,
};

const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ATTACHMENT_TYPES = {
  pdf: "application/pdf",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};
const DECK_BUCKET = "partner-decks";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const SHEETS_TIMEOUT_MS = 6000;
const MAX_BODY_BYTES = 4.5 * 1024 * 1024;

/** Keys stored in their own columns, or never stored. */
const RESERVED_KEYS = new Set([
  "name",
  "fullName",
  "email",
  "phone",
  "organization",
  "message",
  "proposal",
  "attachmentData",
  "attachmentName",
  "formType",
  "submittedAt",
  "page",
  HONEYPOT_KEY,
]);

const ALLOWED_ORIGINS = new Set(["https://www.genesishacks.com", "https://genesishacks.com"]);
const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

/* ─── HTTP helpers ─────────────────────────────────────────────── */

function corsHeaders(req) {
  const origin = String((req.headers && req.headers.origin) || "");
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin) || DEV_ORIGIN_RE.test(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function send(req, res, status, data) {
  res.statusCode = status;
  Object.entries(corsHeaders(req)).forEach(([k, v]) => res.setHeader(k, v));
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(status === 204 ? "" : JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const body = req.body;
    if (body && typeof body === "object" && !Buffer.isBuffer(body)) {
      resolve(body);
      return;
    }
    if (typeof body === "string" || Buffer.isBuffer(body)) {
      try {
        resolve(body.length ? JSON.parse(String(body)) : {});
      } catch {
        reject(new Error("invalid_json"));
      }
      return;
    }
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) reject(new Error("body_too_large"));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });
}

function clientIp(req) {
  const fwd = String((req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "");
  const first = fwd.split(",")[0].trim();
  return first || (req.socket && req.socket.remoteAddress) || "";
}

function pathOnly(value) {
  if (!value) return null;
  const s = String(value).trim();
  try {
    const u = new URL(s, "https://www.genesishacks.com");
    return u.pathname.slice(0, LIMITS.page);
  } catch {
    return s.startsWith("/") ? s.split(/[?#]/)[0].slice(0, LIMITS.page) : null;
  }
}

async function fetchWithTimeout(url, init, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ─── Validation and mapping ───────────────────────────────────── */

const str = (v) => (v == null ? "" : String(v).trim());

/** Every other submitted field: strings trimmed and capped, arrays of strings kept. */
function extraPayload(input) {
  const out = {};
  let keys = 0;
  for (const [key, value] of Object.entries(input)) {
    if (keys >= LIMITS.payloadKeys) break;
    if (RESERVED_KEYS.has(key) || key.startsWith("_")) continue;
    if (value == null || value === "") continue;
    if (typeof value === "string") {
      const v = value.trim().slice(0, LIMITS.payloadString);
      if (v) out[key] = v;
    } else if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    } else if (Array.isArray(value)) {
      const items = value
        .filter((item) => typeof item === "string" && item.trim())
        .slice(0, LIMITS.payloadArrayItems)
        .map((item) => item.trim().slice(0, LIMITS.payloadString));
      if (items.length) out[key] = items;
    } else {
      continue;
    }
    keys += 1;
  }
  return out;
}

function sanitiseFileName(name, ext) {
  const base = String(name || "deck")
    .split(/[\\/]/)
    .pop()
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  return `${base || "deck"}.${ext}`;
}

/** Cheap signature check so a renamed executable is not accepted as a deck. */
function looksLike(ext, buf) {
  if (buf.length < 4) return false;
  if (ext === "pdf") return buf.slice(0, 4).toString("latin1") === "%PDF";
  if (ext === "pptx") return buf[0] === 0x50 && buf[1] === 0x4b; // ZIP "PK"
  if (ext === "ppt") return buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0; // OLE
  return false;
}

function decodeAttachment(data, name) {
  const ext = String(name || "").split(".").pop().toLowerCase();
  if (!ATTACHMENT_TYPES[ext]) return { error: "attachment_type" };
  const clean = String(data).replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return { error: "attachment_invalid" };
  // Reject before decoding when the base64 alone proves it is too big.
  if (Math.floor((clean.length * 3) / 4) > MAX_ATTACHMENT_BYTES + 3) return { error: "attachment_too_large" };
  const buffer = Buffer.from(clean, "base64");
  if (buffer.length > MAX_ATTACHMENT_BYTES) return { error: "attachment_too_large" };
  if (!looksLike(ext, buffer)) return { error: "attachment_type" };
  return { buffer, ext, contentType: ATTACHMENT_TYPES[ext] };
}

function validate(input) {
  const rawType = str(input.formType);
  const formType = FORM_ALIASES[rawType] || rawType;
  if (!FORM_TYPES.has(formType)) return { error: "unknown_form" };

  const name = str(input.name || input.fullName);
  const email = str(input.email).toLowerCase();
  const phone = str(input.phone);
  const organization = str(input.organization);
  const message = str(input.message || input.proposal);

  if (!name || name.length > LIMITS.name) return { error: "invalid_name" };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return { error: "invalid_email" };
  if (phone.length > LIMITS.phone) return { error: "invalid_phone" };
  if (organization.length > LIMITS.organization) return { error: "field_too_long" };
  if (message.length > LIMITS.message) return { error: "message_too_long" };

  return { formType, name, email, phone, organization, message };
}

/* ─── Side channels ────────────────────────────────────────────── */

async function forwardToSheets(fields, extras, attachment) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url || url.startsWith("%")) return { configured: false, ok: false };
  // Sheet cells hold text, so lists (goals, tracks) are joined.
  const flat = Object.fromEntries(
    Object.entries(extras).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v]),
  );
  const body = {
    ...flat,
    formType: fields.formType,
    submittedAt: new Date().toISOString(),
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    organization: fields.organization,
    message: fields.message,
    // The Partner / Collaborate tabs read "proposal" for the details column.
    proposal: fields.message,
    page: fields.page,
  };
  if (attachment) {
    body.attachmentName = attachment.name;
    body.attachmentData = attachment.data;
  }
  try {
    const res = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
      },
      SHEETS_TIMEOUT_MS,
    );
    return { configured: true, ok: res.ok };
  } catch (err) {
    console.error("[submit-form] Sheets webhook failed:", err && err.name);
    return { configured: true, ok: false };
  }
}

const FORM_LABELS = {
  contact: "Contact message",
  partner: "Partner inquiry",
  collaborate: "Collaboration request",
  work_with_us: "Crew application",
  delhi_interest: "Delhi 2027 interest",
};

/** Optional team notification. Never blocks or fails the submission. */
async function notifyTeam(fields, extras, attachmentName) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.CONTACT_TO_EMAIL || "partner@genesishacks.com";
  const lines = [
    `Form: ${FORM_LABELS[fields.formType] || fields.formType}`,
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.organization ? `Organisation: ${fields.organization}` : null,
    ...Object.entries(extras).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`),
    attachmentName ? `Attachment: ${attachmentName} (in the partner-decks bucket)` : null,
    fields.page ? `Page: ${fields.page}` : null,
    "",
    fields.message || "",
  ].filter((l) => l !== null);
  try {
    await fetchWithTimeout(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Genesis Hacks <onboarding@resend.dev>",
          to: [to],
          reply_to: fields.email,
          subject: `${FORM_LABELS[fields.formType] || "Form"}: ${fields.name}${fields.organization ? ` (${fields.organization})` : ""}`,
          text: lines.join("\n"),
        }),
      },
      5000,
    );
  } catch (err) {
    console.error("[submit-form] Resend notification failed:", err && err.name);
  }
}

/* ─── Core ─────────────────────────────────────────────────────── */

/**
 * Validates and stores one submission. Shared by /api/submit-form and the
 * legacy /api/contact. Returns { status, body }.
 */
async function processSubmission(req, input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { status: 400, body: { ok: false, error: "bad_request" } };
  }

  // Bots fill every field, including the hidden one. Pretend it worked.
  if (str(input[HONEYPOT_KEY])) {
    return { status: 200, body: { ok: true } };
  }

  const fields = validate(input);
  if (fields.error) return { status: 400, body: { ok: false, error: fields.error } };

  const supabaseOn = isConfigured();
  const ipHash = hashIp(clientIp(req));

  if (supabaseOn && ipHash) {
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const recent = await countRows("form_submissions", { ip_hash: `eq.${ipHash}`, created_at: `gte.${since}` });
    if (recent.ok && recent.count >= RATE_MAX) {
      return { status: 429, body: { ok: false, error: "too_many_submissions" } };
    }
  }

  // Partner decks only. Validated even when no store is configured.
  let deck = null;
  if (fields.formType === "partner" && input.attachmentData) {
    const decoded = decodeAttachment(input.attachmentData, input.attachmentName);
    if (decoded.error) return { status: 400, body: { ok: false, error: decoded.error } };
    deck = {
      ...decoded,
      originalName: str(input.attachmentName).slice(0, LIMITS.attachmentName) || `deck.${decoded.ext}`,
      base64: String(input.attachmentData).replace(/\s+/g, ""),
    };
  }

  fields.page = pathOnly(input.page || (req.headers && req.headers.referer));
  const extras = extraPayload(input);

  let attachmentPath = null;
  if (deck && supabaseOn) {
    const now = new Date();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const objectPath = `${yyyy}/${mm}/${crypto.randomUUID()}-${sanitiseFileName(deck.originalName, deck.ext)}`;
    const upload = await uploadObject(DECK_BUCKET, objectPath, deck.buffer, deck.contentType);
    if (upload.ok) attachmentPath = upload.path;
    else console.error("[submit-form] deck upload failed:", upload.error);
  }

  const stored = { supabase: false, sheets: false };
  let id = null;

  if (supabaseOn) {
    const userAgent = str(req.headers && req.headers["user-agent"]).slice(0, LIMITS.userAgent);
    const row = {
      form_type: fields.formType,
      name: fields.name,
      email: fields.email,
      phone: fields.phone || null,
      organization: fields.organization || null,
      message: fields.message || null,
      payload: extras,
      attachment_path: attachmentPath,
      attachment_name: attachmentPath ? deck.originalName : null,
      page: fields.page,
      user_agent: userAgent || null,
      ip_hash: ipHash,
    };
    const inserted = await insertRow("form_submissions", row);
    if (inserted.ok) {
      stored.supabase = true;
      id = inserted.id || null;
    } else {
      console.error("[submit-form] Supabase insert failed:", inserted.error);
    }
  }

  // Send the deck to Sheets/Drive only if it did not reach Supabase Storage.
  const sheetsAttachment = deck && !attachmentPath ? { name: deck.originalName, data: deck.base64 } : null;
  const sheets = await forwardToSheets(fields, extras, sheetsAttachment);
  stored.sheets = sheets.ok;

  if (!supabaseOn && !sheets.configured) {
    return { status: 503, body: { ok: false, error: "no_provider" } };
  }
  if (!stored.supabase && !stored.sheets) {
    return { status: 502, body: { ok: false, error: "store_failed" } };
  }

  await notifyTeam(fields, extras, attachmentPath ? deck.originalName : null);
  return { status: 200, body: { ok: true, id, formType: fields.formType } };
}

async function handler(req, res) {
  if (req.method === "OPTIONS") {
    send(req, res, 204, null);
    return;
  }
  if (req.method !== "POST") {
    send(req, res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  let input;
  try {
    input = await readBody(req);
  } catch (err) {
    send(req, res, err.message === "body_too_large" ? 413 : 400, { ok: false, error: err.message || "bad_request" });
    return;
  }

  try {
    const { status, body } = await processSubmission(req, input);
    send(req, res, status, body);
  } catch (err) {
    console.error("[submit-form] unexpected error:", err);
    send(req, res, 500, { ok: false, error: "server_error" });
  }
}

module.exports = handler;
module.exports.processSubmission = processSubmission;
module.exports.readBody = readBody;
module.exports.send = send;
