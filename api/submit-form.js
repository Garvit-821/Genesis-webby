/**
 * Vercel Serverless Form Intake -> Google Sheets Webhook Dispatcher
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function json(res, status, data) {
  res.statusCode = status;
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.setHeader("Content-Type", "application/json");
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
      if (raw.length > 1e6) reject(new Error("body_too_large"));
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

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (err) {
    json(res, 400, { ok: false, error: err.message || "bad_request" });
    return;
  }

  const formType = String(payload.formType || "contact").trim();
  const name = String(payload.name || payload.fullName || "").trim();
  const email = String(payload.email || "").trim();

  if (!name || !email) {
    json(res, 400, { ok: false, error: "validation_failed", details: "Name and email are required." });
    return;
  }

  const sheetsWebhookUrl =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL;

  let sheetsSuccess = false;

  if (sheetsWebhookUrl && !sheetsWebhookUrl.startsWith("%")) {
    try {
      const gRes = await fetch(sheetsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          formType,
          submittedAt: new Date().toISOString(),
          ...payload,
        }),
      });

      if (gRes.ok) {
        sheetsSuccess = true;
      }
    } catch (err) {
      console.error("Failed forwarding to Google Sheets script:", err);
    }
  }

  // Also forward to Formspree if set as fallback
  const formspreeId = process.env.FORMSPREE_ID || process.env.REACT_APP_FORMSPREE_ID;
  if (formspreeId && !formspreeId.startsWith("%")) {
    try {
      await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, attachmentData: undefined, _subject: `Genesis ${formType} Form Submission — ${name}` }),
      });
    } catch (e) {
      // Ignore secondary error
    }
  }

  json(res, 200, {
    ok: true,
    formType,
    sheetsForwarded: sheetsSuccess,
    message: "Submission received successfully",
  });
};
