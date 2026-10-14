/**
 * Contact helpers. The address comes from shared/config/site.js, the
 * one place the site's email is defined (audit D01).
 */

import { CONTACT } from "@shared/config/site";

const CONTACT_EMAIL = CONTACT.email;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || "").trim());
}

/** mailto: link with the visitor's message prefilled, used when a submit fails. */
export function buildMailtoHref({ name = "", email = "", role = "", message = "", subject } = {}) {
  const subj = encodeURIComponent(subject || `Genesis enquiry${role ? `: ${role}` : ""}${name ? ` (${name})` : ""}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}${role ? `\nReaching out as: ${role}` : ""}\n\n${message}\n\nSent from genesishacks.com`,
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subj}&body=${body}`;
}

export { CONTACT_EMAIL };
