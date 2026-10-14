/**
 * Form submission. Every form posts to /api/submit-form, which stores the
 * submission (Supabase) and reports back honestly.
 *
 * - { ok: true }            → success
 * - 429                     → rate limited, try again later
 * - 502 / 503 / network     → error; the form offers a mailto fallback
 * - 404                     → the function is not running (plain `npm start`
 *                             without `vercel dev`): fall back to the Google
 *                             Sheets web app, if one is configured
 *
 * Nothing is ever reported as sent unless an endpoint confirmed it. There
 * is no no-cors "fire and forget" path.
 *
 * Payload keys are a contract with the server (see
 * supabase/migrations/20261013120000_form_submissions.sql); keep them stable.
 */

const API_URL = "/api/submit-form";
const SHEETS_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || "";

export const SUBMIT_MESSAGES = {
  rate_limited: "Too many submissions from this connection. Please try again in a few minutes.",
  invalid: "Some details did not pass our checks. Check the form and try again, or email us directly.",
  unavailable: "We could not save your message just now. Please try again, or email us directly.",
  network: "We could not reach our server. Check your connection and try again, or email us directly.",
};

function sheetsConfigured() {
  return Boolean(SHEETS_URL) && !SHEETS_URL.startsWith("%");
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Dev fallback only: the Apps Script web app confirms with { result: "success" }. */
async function postToSheets(payload) {
  try {
    const response = await fetch(SHEETS_URL, {
      method: "POST",
      // text/plain skips the CORS preflight Apps Script cannot answer.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const body = response.ok ? await readJson(response) : null;
    if (body && body.result === "success") return { ok: true };
    return { ok: false, code: "unavailable", message: SUBMIT_MESSAGES.unavailable };
  } catch {
    return { ok: false, code: "network", message: SUBMIT_MESSAGES.network };
  }
}

/**
 * @param {Object} params
 * @param {'contact'|'work_with_us'|'partner'|'collaborate'|'delhi_interest'} params.formType
 * @param {Object} params.data  Form fields, using the agreed key names.
 * @returns {Promise<{ ok: true } | { ok: false, code: string, message: string }>}
 */
export async function submitFormToSheets({ formType, data }) {
  const payload = {
    ...data,
    formType,
    page: typeof window !== "undefined" ? window.location.pathname : "",
  };

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, code: "network", message: SUBMIT_MESSAGES.network };
  }

  if (response.status === 404) {
    return sheetsConfigured()
      ? postToSheets(payload)
      : { ok: false, code: "unavailable", message: SUBMIT_MESSAGES.unavailable };
  }

  if (response.status === 429) {
    return { ok: false, code: "rate_limited", message: SUBMIT_MESSAGES.rate_limited };
  }

  const body = await readJson(response);
  if (response.ok && body && body.ok === true) {
    return { ok: true };
  }
  if (response.status === 400 || response.status === 422) {
    return { ok: false, code: "invalid", message: SUBMIT_MESSAGES.invalid };
  }
  return { ok: false, code: "unavailable", message: SUBMIT_MESSAGES.unavailable };
}

/** Alias with a clearer name; existing imports keep working. */
export const submitForm = submitFormToSheets;
