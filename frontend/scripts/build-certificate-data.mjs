#!/usr/bin/env node
/**
 * Builds the certificate lookup table used by /api/certificate.
 *
 * Reads the participant CSV (Team Name, Participant Name, Role, Email, Phone)
 * and writes api/_data/<event>.json keyed by sha256(email|last-10-phone-digits),
 * so no raw emails or phone numbers are deployed.
 *
 * Run: npm run build:certificates
 *   or node scripts/build-certificate-data.mjs <csv> <event-slug>
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, "..", "..");

const csvPath = path.resolve(process.argv[2] || path.join(REPO, "HOP_Certificate", "participants_data.csv"));
const eventSlug = process.argv[3] || "hackers-occupied-pune";
const outPath = path.join(REPO, "api", "_data", `${eventSlug}.json`);

// Must stay in sync with api/certificate.js
const normEmail = (v) => String(v || "").trim().toLowerCase();
const normPhone = (v) => String(v || "").replace(/\D/g, "").slice(-10);
const keyFor = (email, phone) =>
  crypto.createHash("sha256").update(`${normEmail(email)}|${normPhone(phone)}`).digest("hex");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows;
}

// "KRUSHNANSH MEHER" -> "Krushnansh Meher"; mixed-case words are left alone.
function tidyName(name) {
  return String(name)
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) =>
      w === w.toUpperCase() || w === w.toLowerCase()
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w
    )
    .join(" ");
}

const [header, ...records] = parseCsv(fs.readFileSync(csvPath, "utf8").replace(/^﻿/, ""));
const col = (name) => {
  const idx = header.findIndex((h) => h.trim().toLowerCase() === name);
  if (idx === -1) throw new Error(`Missing "${name}" column in ${csvPath}`);
  return idx;
};
const iName = col("participant name");
const iEmail = col("email");
const iPhone = col("phone");

const out = {};
const skipped = [];
for (const r of records) {
  const name = tidyName(r[iName] || "");
  const email = normEmail(r[iEmail]);
  const phone = normPhone(r[iPhone]);
  if (!name || !email || phone.length !== 10) {
    skipped.push(r.join(","));
    continue;
  }
  const key = keyFor(email, phone);
  if (out[key] && out[key] !== name) {
    console.warn(`Duplicate email+phone with different names: ${out[key]} / ${name}`);
  }
  out[key] = name;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${Object.keys(out).length} participants to ${path.relative(REPO, outPath)}`);
if (skipped.length) {
  console.warn(`Skipped ${skipped.length} incomplete row(s):\n  ${skipped.join("\n  ")}`);
}
