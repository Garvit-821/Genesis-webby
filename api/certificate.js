/**
 * Vercel serverless certificate verification.
 * POST { event, email, phone } -> { ok: true, name } when the pair matches a participant.
 *
 * Participant tables live in api/_data/<event>.json and are generated from the
 * CSV by `npm run build:certificates` in frontend/.
 */

const crypto = require("crypto");

// Explicit requires so Vercel bundles the data files with the function.
const EVENTS = {
  "hackers-occupied-pune": () => require("./_data/hackers-occupied-pune.json"),
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function json(res, status, data) {
  res.statusCode = status;
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
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
    json(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  if (throttled(ip)) {
    json(res, 429, { ok: false, error: "too_many_attempts" });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (err) {
    json(res, 400, { ok: false, error: err.message || "bad_request" });
    return;
  }

  const loadEvent = EVENTS[String(payload.event || "")];
  if (!loadEvent) {
    json(res, 404, { ok: false, error: "unknown_event" });
    return;
  }

  const email = normEmail(payload.email);
  const phone = normPhone(payload.phone);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length !== 10) {
    json(res, 400, { ok: false, error: "validation_failed" });
    return;
  }

  const name = loadEvent()[keyFor(email, phone)];
  if (!name) {
    json(res, 404, { ok: false, error: "not_found" });
    return;
  }

  json(res, 200, { ok: true, name });
};
