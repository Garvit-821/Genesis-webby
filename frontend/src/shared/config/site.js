/**
 * Single source of truth for every public fact on the site.
 *
 * Numbers, contact details and positioning live here so no page can drift
 * from another (audit C03, D01, P04). Change a fact once, here.
 * Items marked NEEDS_CONFIRMATION came from the October 2026 audit's
 * reference facts and still want a human sign-off before outreach.
 */

export const SITE_URL = "https://www.genesishacks.com";

export const BRAND = {
  name: "Genesis Hacks",
  shortName: "Genesis",
  tagline: "Reach India's student builders at hackathons.",
  /** One description, used everywhere (audit register 7, rewrite 1). */
  description:
    "Genesis connects companies with India's student hackathon and builder community. We curate brand partnerships with independent hackathons and run our own series, Hackers Occupied.",
  shortDescription:
    "Hackathon partnerships in India. We connect companies with student builders at independent hackathons and our own series, Hackers Occupied.",
};

export const CONTACT = {
  email: "partner@genesishacks.com",
  phone: "+91 70433 88006",
  phoneHref: "tel:+917043388006",
  /** One reply-time promise, used on every form and policy (audit C15). */
  replyTime: "within 2 business days",
};

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/genesishacks/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/genesishacks/" },
];

/** Deck figures (audit C03). NEEDS_CONFIRMATION: how 140+ is counted. */
export const STATS = {
  attendees: 21699,
  attendeesLabel: "21,699",
  events: 140,
  eventsLabel: "140+",
  women: 7664,
  men: 14035,
  /** 7,664 of 21,699 attendees. */
  womenShareLabel: "35%",
};

/** Our own series. */
export const SERIES = {
  name: "Hackers Occupied",
};

export const DELHI = {
  slug: "hackers-occupied-delhi",
  path: "/events/hackers-occupied-delhi",
  name: "Hackers Occupied Delhi",
  edition: "2027",
  /** NEEDS_CONFIRMATION: dates and venue. */
  when: "Mid-January 2027 (tentative)",
  startDate: "2027-01-15",
  where: "Delhi NCR",
  venue: "Venue to be announced",
  tracks: ["AI", "Web3", "FinTech", "Agro", "Healthcare", "CyberSecurity"],
  teams: 100,
  teamSize: "3 to 5",
  /** A projection, never a result. Always shown with that label. */
  projectedRegistrations: "4,000+",
};

export const PUNE = {
  slug: "hackers-occupied-pune",
  path: "/events/hackers-occupied-pune",
  name: "Hackers Occupied Pune",
  when: "22–23 August 2026",
  where: "Vishwakarma Institute of Technology (VIT), Pune",
  shortWhere: "VIT Pune",
  certificatePath: "/certificates/hackers-occupied-pune",
};

/**
 * The four strongest proof points. Genesis was Event Partner at each
 * (audit C07, C08). Keep the role visible wherever these appear.
 */
export const PROOF_EVENTS = [
  {
    name: "Hackaccino 4.0",
    venue: "Bennett University, Greater Noida",
    role: "Event Partner",
    fact: "1,500 participants, 36 hours offline",
  },
  {
    name: "Innovate 4.0",
    venue: "IIT Delhi",
    role: "Event Partner",
    fact: "Hackathon at IIT Delhi",
  },
  {
    name: "CodeClash 2.0",
    venue: "Google Office, Gurugram",
    role: "Event Partner",
    fact: "Hackathon hosted at Google's Gurugram office",
  },
  {
    name: "0xGenIgnite",
    venue: "NIT Goa",
    role: "Event Partner",
    fact: "Web3 hackathon, 11–12 October 2025",
  },
];

/**
 * What a sponsor can do with Genesis. These are formats on offer, not
 * results. NEEDS_CONFIRMATION: packages and pricing.
 */
export const SPONSOR_OUTCOMES = [
  {
    key: "reach",
    title: "Reach",
    line: "Put your product in front of student developers at the events they already go to.",
    formats: ["Title and track sponsorship", "Booths and demo tables", "Swag and credits"],
  },
  {
    key: "talent",
    title: "Talent",
    line: "Meet builders while they build, not after they have sent a CV.",
    formats: ["Judging and mentoring", "Hiring challenges", "Shortlists from winning teams"],
  },
  {
    key: "adoption",
    title: "Adoption",
    line: "Get your API, SDK or chain used in real projects over a weekend.",
    formats: ["Sponsor tracks and bounties", "Workshops on day one", "Office hours with your team"],
  },
];

/** How a partnership runs. NEEDS_CONFIRMATION: wording of each step. */
export const PARTNER_STEPS = [
  {
    n: "01",
    title: "Tell us the goal",
    line: "Hiring, developer adoption or brand. One call, 30 minutes.",
  },
  {
    n: "02",
    title: "We shortlist events",
    line: "Hackers Occupied or independent hackathons that match your audience, city and budget.",
  },
  {
    n: "03",
    title: "Show up on the day",
    line: "Tracks, judging, booths or workshops. We handle the organisers.",
  },
  {
    n: "04",
    title: "Hear what happened",
    line: "We follow up with what your team saw and what came out of it.",
  },
];

/** Chapters on the home page, in order. ChapterRail and section ids read this. */
export const HOME_CHAPTERS = [
  { id: "hero", n: "00", label: "Start" },
  { id: "sponsors", n: "01", label: "For sponsors" },
  { id: "proof", n: "02", label: "Proof" },
  { id: "series", n: "03", label: "Hackers Occupied" },
  { id: "events", n: "04", label: "Events" },
  { id: "contact", n: "05", label: "Contact" },
];
