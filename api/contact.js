/**
 * Legacy contact endpoint. Older builds POST { name, email, role, message }
 * here; it now runs the same intake as /api/submit-form (validation, rate
 * limit, Supabase, Google Sheets, optional Resend email to
 * CONTACT_TO_EMAIL, which defaults to partner@genesishacks.com).
 */

const { processSubmission, readBody, send } = require("./submit-form");

module.exports = async function handler(req, res) {
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
    const { status, body } = await processSubmission(req, { ...input, formType: "contact" });
    send(req, res, status, body);
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    send(req, res, 500, { ok: false, error: "server_error" });
  }
};
