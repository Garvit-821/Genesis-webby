/**
 * Curated event archive. This file is the source of truth for every event
 * card, map pin and count on the site. It replaces the old auto-generated
 * list (stock photos, one blurb for 48 events, a shared Luma link, Google
 * Sheets URLs in public code, and a localStorage cache that made counts
 * drift between visits).
 *
 * role:
 *   "Organiser"     Genesis ran the event (Hackers Occupied, Genesis Meetup).
 *   "Event Partner" Genesis partnered on an event someone else organised.
 * NEEDS_CONFIRMATION: the role of every row not named in the audit's
 * reference facts defaults to "Event Partner" (the conservative choice).
 * Rows with `confirmed: true` match the reference facts.
 */

import { DELHI, PUNE } from "@shared/config/site";
import { PUNE_STORY } from "./mediaAssets";

/** [id, title, isoStart, display date, venue, city, category, attendees] */
const ARCHIVE_ROWS = [
  ["beyond-the-code", "Beyond the Code", "2024-09-19", "19 Sep 2024", "SRM Institute of Science and Technology", "Chennai", "Meetup", 700],
  ["welcoming-the-founder", "Welcoming the Founder", "2024-09-20", "20 Sep 2024", "SRM Institute of Science and Technology", "Chennai", "Meetup", 200],
  ["how-to-blockchain", "How to Blockchain", "2025-01-15", "15 Jan 2025", "SRM Institute of Science and Technology", "Chennai", "Workshop", 120],
  ["web3-mai-bahut-scope-hai", "Web3 Mai Bahut Scope Hai IRL", "2025-03-28", "28 Mar 2025", "SRM Institute of Science and Technology", "Chennai", "Meetup", 150],
  ["supernova", "Supernova", "2025-05-02", "2–3 May 2025", "GL Bajaj Institute of Technology and Management", "Greater Noida", "Hackathon", null],
  ["hackhaven-2", "HackHaven 2.0", "2025-05-03", "3–4 May 2025", "ABES Engineering College", "Ghaziabad", "Hackathon", null],
  ["hackamania", "Hackamania", "2025-05-23", "23 May 2025", "Microsoft Office", "Gurugram", "Hackathon", null],
  ["codeclash-2", "CodeClash 2.0", "2025-06-20", "20–28 Jun 2025", "Google Office", "Gurugram", "Hackathon", null, { confirmed: true }],
  ["genesis-meetup", "Genesis Meetup", "2025-06-25", "25 Jun 2025", "Microsoft Office", "Noida", "Meetup", 130, { role: "Organiser" }],
  ["hackarena-2025", "HackArena 2025", "2025-06-28", "28–29 Jun 2025", "IIIT Delhi", "New Delhi", "Hackathon", null],
  ["15forteen-meetup", "15Forteen Meetup", "2025-07-05", "5 Jul 2025", "Microsoft Office", "Noida", "Meetup", null],
  ["codecap-meetup", "CodeCap Meetup", "2025-07-13", "13 Jul 2025", "Central Academy International School, Dwarka", "New Delhi", "Meetup", null],
  ["careerverse", "Careerverse", "2025-07-19", "19 Jul 2025", "Thoughtworks Office", "Gurugram", "Meetup", null],
  ["web3-pe-charcha", "Web3 Pe Charcha", "2025-07-26", "26 Jul 2025", "Microsoft Office", "Gurugram", "Meetup", 100],
  ["hackshastra-pre-meetup", "Hackshastra Pre-Meetup", "2025-07-27", "27 Jul 2025", "IIIT Delhi", "New Delhi", "Meetup", null],
  ["tech-masala", "Tech Masala", "2025-08-22", "22 Aug 2025", "Microsoft Office", "Noida", "Meetup", null],
  ["no-agenda-meetup", "No Agenda Meetup", "2025-08-22", "22 Aug 2025", "Microsoft Office", "Gurugram", "Meetup", null],
  ["hack4bihar", "Hack4Bihar", "2025-08-23", "23 Aug 2025", "Thoughtworks Office", "Gurugram", "Hackathon", null],
  ["char-log-kya-kahenge", "Char Log Kya Kahenge", "2025-08-29", "29 Aug 2025", "Microsoft Office", "Noida", "Meetup", 130],
  ["troubleshoot-ideathon", "Troubleshoot Ideathon", "2025-08-30", "30 Aug 2025", "Microsoft Office", "Noida", "Ideathon", null],
  ["hackground-india-2k25", "Hackground India 2K25", "2025-08-30", "30 Aug 2025", "Thoughtworks Office", "Gurugram", "Hackathon", null],
  ["hackquanta", "HackQuanta", "2025-09-05", "5–6 Sep 2025", "JIMS Engineering Management Technical Campus", "Greater Noida", "Hackathon", null],
  ["hackloop-2k25", "HackLoop 2K25", "2025-09-06", "6 Sep 2025", "Thoughtworks Office", "Gurugram", "Meetup", null],
  ["code-veda", "Code Veda", "2025-09-13", "13 Sep 2025", "Microsoft Office", "Gurugram", "Hackathon", null],
  ["google-io-extended", "Google I/O Extended", "2025-09-13", "13 Sep 2025", "Thoughtworks Office", "Gurugram", "Meetup", 250],
  ["0xgenignite-bootcamp", "0xGenIgnite Bootcamp Tour", "2025-09-13", "13 Sep – 5 Oct 2025", "Mumbai, Lucknow, Noida and Bengaluru", "Mumbai", "Bootcamp", null, { cities: ["Mumbai", "Lucknow", "Noida", "Bengaluru"] }],
  ["breach-and-chill", "Breach and Chill", "2025-09-20", "20 Sep 2025", "Microsoft Office", "Noida", "Meetup", null],
  ["hackster", "Hackster", "2025-09-20", "20 Sep 2025", "HMRITM", "New Delhi", "Hackathon", null],
  ["azure-developer-day", "Azure Developer Day", "2025-09-30", "30 Sep 2025", "Microsoft Office", "Noida", "Meetup", null],
  ["ecocode", "EcoCode", "2025-10-08", "8–9 Oct 2025", "BVCOE", "New Delhi", "Hackathon", null],
  ["0xgenignite-nit-goa", "0xGenIgnite", "2025-10-11", "11–12 Oct 2025", "NIT Goa", "Goa", "Hackathon", 51, { confirmed: true }],
  ["vault-heist", "Vault Heist", "2025-10-13", "13–14 Oct 2025", "CGC University", "Mohali", "Hackathon", null],
  ["hardware-hackfest", "Hardware Hackfest", "2025-10-15", "15–16 Oct 2025", "GGSIPU", "New Delhi", "Hackathon", null],
  ["design-a-thon", "Design-A-Thon", "2025-10-27", "27 Oct – 1 Nov 2025", "Manipal University Jaipur", "Jaipur", "Ideathon", null],
  ["monad-blitz-delhi", "Monad Blitz Delhi", "2025-11-01", "1 Nov 2025", "New Delhi", "New Delhi", "Hackathon", null],
  ["techjam-2", "TechJam 2.0", "2025-11-14", "14 Nov 2025", "Microsoft Office", "Noida", "Hackathon", null],
  ["build-with-gemini", "Build with Gemini", "2025-11-20", "20 Nov 2025", "University of Delhi", "New Delhi", "Hackathon", null],
  ["hype", "Hype", "2025-11-21", "21 Nov 2025", "Vivekananda Global University", "Jaipur", "Meetup", null],
  ["nerds-meetup", "Nerds Meetup", "2025-11-22", "22 Nov 2025", "Thoughtworks Office", "Gurugram", "Meetup", null],
  ["synergix-buildstation", "SynergiX Buildstation", "2025-11-29", "29 Nov 2025", "VIPS-TC, Pitampura", "New Delhi", "Hackathon", 300],
  ["mind-the-gap-2", "Mind the Gap 2.0", "2025-11-29", "29 Nov 2025", "ABES Engineering College", "Ghaziabad", "Workshop", null],
  ["vibestate-25", "Vibestate 25", "2025-12-05", "5 Dec 2025", "Online", "Online", "Hackathon", null],
  ["secureverse", "SecureVerse", "2025-12-06", "6 Dec 2025", "Thoughtworks Office", "Gurugram", "Meetup", null],
  ["duality", "Duality", "2025-12-13", "13 Dec 2025", "OpsTree Office", "Gurugram", "Hackathon", 102],
  ["ranchi-hacks", "Ranchi Hacks", "2026-01-17", "17 Jan 2026", "Sarala Birla University", "Ranchi", "Hackathon", null],
  ["escape-da-vinci", "Escape Da Vinci", "2026-02-10", "10–27 Feb 2026", "Chandigarh University", "Mohali", "Meetup", null],
];

function fromRow([id, title, iso, date, venue, city, category, attendees, extra = {}]) {
  return {
    id,
    title,
    iso,
    date,
    year: iso.slice(0, 4),
    venue,
    city,
    category,
    attendees,
    role: extra.role || "Event Partner",
    confirmed: Boolean(extra.confirmed),
    cities: extra.cities || [city],
    status: "past",
    photos: [],
    path: null,
  };
}

/** Partner events from the reference facts. Dates still to be added. */
const PROOF_ROWS = [
  {
    id: "hackaccino-4",
    title: "Hackaccino 4.0",
    iso: null,
    date: null,
    year: null,
    venue: "Bennett University",
    city: "Greater Noida",
    category: "Hackathon",
    attendees: 1500,
    note: "36 hours offline",
  },
  {
    id: "innovate-4",
    title: "Innovate 4.0",
    iso: null,
    date: null,
    year: null,
    venue: "IIT Delhi",
    city: "New Delhi",
    category: "Hackathon",
    attendees: null,
  },
].map((e) => ({
  ...e,
  role: "Event Partner",
  confirmed: true,
  cities: [e.city],
  status: "past",
  photos: [],
  path: null,
}));

const PUNE_EVENT = {
  id: PUNE.slug,
  title: "Hackers Occupied Pune",
  iso: "2026-08-22",
  date: PUNE.when,
  year: "2026",
  venue: "Vishwakarma Institute of Technology (VIT)",
  city: "Pune",
  category: "Hackathon",
  attendees: null,
  role: "Organiser",
  confirmed: true,
  cities: ["Pune"],
  status: "past",
  series: true,
  path: PUNE.path,
  photos: PUNE_STORY.map(({ src, alt, caption }) => ({ src, alt, caption })),
};

const DELHI_EVENT = {
  id: DELHI.slug,
  title: `${DELHI.name} ${DELHI.edition}`,
  iso: DELHI.startDate,
  date: DELHI.when,
  year: DELHI.edition,
  venue: DELHI.venue,
  city: "Delhi NCR",
  category: "Hackathon",
  attendees: null,
  role: "Organiser",
  confirmed: true,
  cities: ["New Delhi"],
  status: "upcoming",
  series: true,
  path: DELHI.path,
  photos: [],
};

const byDateDesc = (a, b) => (b.iso || "0000").localeCompare(a.iso || "0000");

export const UPCOMING_EVENTS = [DELHI_EVENT];

const DATED = [PUNE_EVENT, ...ARCHIVE_ROWS.map(fromRow)].sort(byDateDesc);
// Undated proof events (dates still to be added) sit after this year's events.
const splitAt = DATED.findIndex((e) => e.iso < "2026-01-01");

export const PAST_EVENTS = [
  ...DATED.slice(0, splitAt),
  ...PROOF_ROWS,
  ...DATED.slice(splitAt),
];

export const ALL_EVENTS = [...UPCOMING_EVENTS, ...PAST_EVENTS];

export const EVENT_CATEGORIES = Array.from(new Set(PAST_EVENTS.map((e) => e.category))).sort();

export const EVENT_CITIES = Array.from(
  new Set(PAST_EVENTS.flatMap((e) => e.cities).filter((c) => c !== "Online")),
).sort();

export const EVENT_YEARS = Array.from(
  new Set(PAST_EVENTS.map((e) => e.year).filter(Boolean)),
).sort((a, b) => b.localeCompare(a));

/** Plain one-line summary built only from facts in the row. */
export function eventSummary(e) {
  const kind = e.category.toLowerCase();
  let head;
  if (e.status === "upcoming") head = `Upcoming ${kind} in ${e.city}, ${e.date}.`;
  else if (e.city === "Online") head = `Online ${kind}.`;
  else if (e.cities.length > 1) head = `${e.category} in ${e.venue}.`;
  else if (e.venue === e.city) head = `${e.category} in ${e.city}.`;
  else head = `${e.category} at ${e.venue}, ${e.city}.`;
  const count = e.attendees ? ` ${e.attendees.toLocaleString("en-IN")} attended.` : "";
  const note = e.note ? ` ${e.note}.` : "";
  const role = e.role === "Organiser" ? " Run by Genesis." : " Genesis was Event Partner.";
  return `${head}${count}${note}${role}`;
}

/** Events that count toward a city, including multi-city tours. */
export function eventsInCity(city, list = PAST_EVENTS) {
  return list.filter((e) => e.cities.includes(city));
}

export function getEvent(id) {
  return ALL_EVENTS.find((e) => e.id === id) || null;
}
