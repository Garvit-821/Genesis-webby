/**
 * Minimal Supabase client for Vercel functions, using the REST APIs
 * directly (the root project installs no npm packages).
 *
 * Env (Supabase → Project Settings → API):
 *   SUPABASE_URL                  (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY     (or SUPABASE_SECRET_KEY, sb_secret_…)
 * Optional:
 *   FORM_IP_SALT                  salt for hashing visitor IPs
 *
 * Server-only. The service key bypasses Row Level Security and must never
 * reach the browser.
 */

const crypto = require("crypto");

const TIMEOUT_MS = 8000;

function getConfig() {
  const url = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "").trim();
  if (!url || !key) return null;
  return { url, key };
}

function isConfigured() {
  return Boolean(getConfig());
}

/** New-style secret keys (sb_secret_…) are not JWTs and go in `apikey` only. */
function authHeaders({ key }) {
  const headers = { apikey: key };
  if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`;
  return headers;
}

async function request(path, init = {}) {
  const config = getConfig();
  if (!config) return { ok: false, status: 503, error: "supabase_not_configured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${config.url}${path}`, {
      ...init,
      headers: { ...authHeaders(config), ...(init.headers || {}) },
      signal: controller.signal,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      return { ok: false, status: res.status, error: (data && (data.message || data.error)) || `http_${res.status}` };
    }
    return { ok: true, status: res.status, data, headers: res.headers };
  } catch (err) {
    return { ok: false, status: 504, error: err.name === "AbortError" ? "supabase_timeout" : "supabase_unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

/** Insert one row; returns { ok, id }. */
async function insertRow(table, row) {
  const result = await request(`/rest/v1/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!result.ok) return result;
  const first = Array.isArray(result.data) ? result.data[0] : result.data;
  return { ok: true, id: first && first.id };
}

/**
 * Count rows matching PostgREST filters, e.g.
 * countRows("form_submissions", { ip_hash: "eq.abc", created_at: "gte.2026-10-13T00:00:00Z" })
 */
async function countRows(table, filters) {
  const qs = new URLSearchParams({ select: "id", ...filters });
  const result = await request(`/rest/v1/${table}?${qs.toString()}`, {
    method: "HEAD",
    headers: { Prefer: "count=exact" },
  });
  if (!result.ok) return { ok: false, count: 0, error: result.error };
  const range = result.headers.get("content-range") || "";
  const total = Number(range.split("/")[1]);
  return { ok: true, count: Number.isFinite(total) ? total : 0 };
}

/** Upload bytes to a private bucket; returns { ok, path }. */
async function uploadObject(bucket, objectPath, buffer, contentType) {
  const encoded = objectPath.split("/").map(encodeURIComponent).join("/");
  const result = await request(`/storage/v1/object/${bucket}/${encoded}`, {
    method: "POST",
    headers: { "Content-Type": contentType || "application/octet-stream", "x-upsert": "false" },
    body: buffer,
  });
  if (!result.ok) return result;
  return { ok: true, path: objectPath };
}

function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.FORM_IP_SALT || "genesis-hacks-forms";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

module.exports = { isConfigured, insertRow, countRows, uploadObject, hashIp };
