/**
 * Vercel serverless certificate verification.
 * POST { event, email, phone } -> { ok: true, name } when the pair matches a participant.
 *
 * Participant tables live in api/_data/<event>.json and are generated from the
 * CSV by `npm run build:certificates` in frontend/.
 *
 * Privacy (audit D11): a wrong pair and a malformed pair get the same
 * answer, so the endpoint cannot be used to learn who attended. Attempts
 * are throttled per IP.
 */

const crypto = require("crypto");

// Explicit requires so Vercel bundles the data files with the function.
const EVENTS = {
  "hackers-occupied-pune": () => require("./_data/hackers-occupied-pune.json"),
};

const ALLOWED_ORIGINS = new Set(["https://www.genesishacks.com", "https://genesishacks.com"]);
const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const NOT_VERIFIED = { ok: false, error: "not_verified", message: "We could not verify those details." };

function json(req, res, status, data) {
  res.statusCode = status;
  const origin = String((req.headers && req.headers.origin) || "");
  if (ALLOWED_ORIGINS.has(origin) || DEV_ORIGIN_RE.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
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
      if (raw.length > 1e4) reject(new Error("body_too_large"));
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

// Must stay in sync with frontend/scripts/build-certificate-data.mjs
const normEmail = (v) => String(v || "").trim().toLowerCase();
const normPhone = (v) => String(v || "").replace(/\D/g, "").slice(-10);
const keyFor = (email, phone) =>
  crypto.createHash("sha256").update(`${normEmail(email)}|${normPhone(phone)}`).digest("hex");

// Best-effort per-instance throttle to slow down guessing.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 15;
const attempts = new Map();

function throttled(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    json(req, res, 204, null);
    return;
  }

  if (req.method !== "POST") {
    json(req, res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  if (throttled(ip)) {
    json(req, res, 429, {
      ok: false,
      error: "too_many_attempts",
      message: "Too many attempts. Please try again in a few minutes.",
    });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    json(req, res, 400, NOT_VERIFIED);
    return;
  }

  const loadEvent = EVENTS[String(payload.event || "")];
  if (!loadEvent) {
    json(req, res, 404, { ok: false, error: "unknown_event" });
    return;
  }

  const email = normEmail(payload.email);
  const phone = normPhone(payload.phone);
  const wellFormed = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && phone.length === 10;
  const name = wellFormed ? loadEvent()[keyFor(email, phone)] : null;

  // Same status and body for "malformed" and "no match" (audit D11).
  if (!name) {
    json(req, res, 404, NOT_VERIFIED);
    return;
  }

  json(req, res, 200, { ok: true, name });
};
