import React from "react";
import { Link } from "react-router-dom";
import LegalPage, { Callout, DataTable, List } from "../shared/LegalPage";
import { BRAND, CONTACT, DELHI, PUNE, SITE_URL } from "@shared/config/site";

/*
 * Privacy policy under India's Digital Personal Data Protection Act, 2023.
 *
 * NEEDS INPUT before legal sign-off (audit G01, G05):
 *   - Registered legal entity name and type (company, LLP, proprietorship).
 *   - Registered postal address and city.
 *   - Named Grievance Officer (a person, not only an inbox).
 *   - Retention periods (proposed below: 24 months for enquiries, 12 months
 *     for uploaded decks). Supabase's purge function defaults to 24 months;
 *     uploaded decks need their own clean-up job.
 * Have a lawyer review this page before outreach relies on it.
 */

const LAST_UPDATED = "13 October 2026";
const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

const FORMS = [
  ["Contact (home page and /contact)", "Name, email, who you are reaching out as, your message", "To reply to you"],
  [
    "Partner or sponsor (/partner)",
    "Name, email, phone or WhatsApp (optional), company or college, website, partnership type, goals, event of interest, budget band, timeline, your message, and an optional deck (PDF or PowerPoint, up to 3 MB)",
    "To understand and answer a sponsorship or partnership enquiry",
  ],
  [
    "Collaborate (/collaborate)",
    "Name, email, phone or WhatsApp (optional), organisation or event, type of collaboration, website, your message",
    "To discuss co-hosting, judging, mentoring or listing your event",
  ],
  [
    "Join the crew (/careers)",
    "Name, email, phone, the area you want to work in, experience, portfolio link, your message",
    "To consider you for volunteer or paid work at our events",
  ],
  [
    `${DELHI.name} interest (${DELHI.path})`,
    "Name, email, phone, college or organisation, city, tracks you care about, whether you have a team",
    `To tell you when registration for ${DELHI.name} opens`,
  ],
  [
    `Certificates (${PUNE.certificatePath})`,
    "The email and phone you registered with",
    "To check them against the participant list and issue your certificate. We do not keep a copy of what you type",
  ],
];

const PROCESSORS = [
  ["Vercel", "Hosts the website and runs the server functions that receive forms", "May process data outside India"],
  ["Supabase", "Database and private file storage for form submissions and uploaded decks", "May process data outside India"],
  ["Google (Workspace, Sheets, Drive)", "Team email and a working copy of form submissions", "May process data outside India"],
  ["Hostinger", `Hosts the mailbox for ${CONTACT.email}`, "Email provider for our domain"],
  ["Resend", "Sends the team a notification email when a form arrives (if enabled)", "May process data outside India"],
  ["PostHog", "Optional analytics, only after you click Accept", "May process data outside India"],
];

const SECTIONS = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          {BRAND.name} (&ldquo;Genesis&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the website at{" "}
          <strong>{DOMAIN}</strong>. {BRAND.description}
        </p>
        <p>
          For the purposes of the Digital Personal Data Protection Act, 2023 (the &ldquo;DPDP Act&rdquo;), Genesis Hacks
          decides why and how the personal data described here is used, so we are the Data Fiduciary for it. You are the
          Data Principal.
        </p>
        <Callout>
          <strong>The short version.</strong> We collect what you type into our forms so we can reply to you, we never
          sell it, analytics stay off unless you accept them, and you can ask us to see, correct or delete your data at
          any time by writing to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </Callout>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect, form by form",
    content: (
      <>
        <p>We only collect what each form asks for. Fields marked optional on a form can be left empty.</p>
        <DataTable
          caption="Personal data collected by each form"
          columns={["Form", "What it collects", "Why"]}
          rows={FORMS}
        />
        <h3>Collected automatically</h3>
        <List>
          <li>
            <strong>Security and spam control.</strong> When you send a form we store a one-way, salted hash of your IP
            address and your browser&rsquo;s user agent, so we can block repeated or automated submissions. We cannot
            turn the hash back into your IP address.
          </li>
          <li>
            <strong>Server logs.</strong> Our hosting provider keeps short-lived technical logs (IP address, time,
            page requested) to run and protect the site.
          </li>
          <li>
            <strong>Analytics, only with your consent.</strong> If you click Accept on the cookie banner, PostHog
            records the pages you visit, device type, approximate region and where you came from. If you click Reject,
            or do nothing, no analytics load.
          </li>
        </List>
        <p>
          We do not ask for sensitive information such as financial details, health data or identity documents through
          this site. Please do not include them in a message or upload.
        </p>
      </>
    ),
  },
  {
    id: "why-and-legal-basis",
    title: "Why we use it, and on what basis",
    content: (
      <>
        <p>We use your personal data to:</p>
        <List>
          <li>reply to your message or enquiry and keep the conversation going;</li>
          <li>assess sponsorship, partnership and collaboration requests and match them to events;</li>
          <li>tell you about the event you registered interest in, such as {DELHI.name};</li>
          <li>consider crew applications;</li>
          <li>issue certificates to registered participants;</li>
          <li>keep the site secure and free of spam; and</li>
          <li>with your consent, understand which pages are useful.</li>
        </List>
        <p>
          <strong>Consent.</strong> Sending a form is a clear, affirmative act: you give us your data for the purpose
          shown on that form. Analytics run only on your separate consent through the cookie banner.
        </p>
        <p>
          <strong>Legitimate uses.</strong> Some processing relies on the legitimate uses allowed by section 7 of the
          DPDP Act, for example using data you gave us voluntarily for the purpose you gave it, or keeping records a
          law requires us to keep.
        </p>
        <p>
          We do not sell personal data, we do not use it for advertising, and we do not make automated decisions about
          you.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>
          A small number of service providers (Data Processors) handle data on our behalf, under contract and only to
          provide their service to us:
        </p>
        <DataTable
          caption="Service providers that process personal data for Genesis Hacks"
          columns={["Provider", "What it does for us", "Note"]}
          rows={PROCESSORS}
        />
        <p>
          Some of these providers store data outside India. The DPDP Act allows this unless the Government of India
          restricts transfers to a particular country, and we will follow any such restriction.
        </p>
        <p>
          We share your details with a sponsor or event partner only when you ask us to (for example, to make an
          introduction) or when you agreed to it on an event&rsquo;s own registration form. If you register for an
          event on another platform, such as HackCulture or Luma, that platform&rsquo;s privacy policy applies to the
          data you give it.
        </p>
        <p>We may also disclose data if the law requires it, or to protect our rights or someone&rsquo;s safety.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <>
        <List>
          <li>
            <strong>Enquiries</strong> (contact, partner, collaborate, crew applications, event interest): up to 24
            months after our last exchange with you, then deleted.
          </li>
          <li>
            <strong>Uploaded decks and files:</strong> up to 12 months, then deleted.
          </li>
          <li>
            <strong>Certificate checks:</strong> not stored. The participant list itself is kept as one-way hashes of
            each registered email and phone pair.
          </li>
          <li>
            <strong>Analytics:</strong> kept by PostHog in line with its retention settings, and only if you accepted.
          </li>
        </List>
        <p>
          We delete data sooner if you ask us to and no law requires us to keep it, or once the purpose you gave it for
          is complete.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Under the DPDP Act you can:</p>
        <List>
          <li>ask for a summary of the personal data we hold about you and how we use it;</li>
          <li>ask us to correct, complete or update it;</li>
          <li>ask us to erase it;</li>
          <li>withdraw your consent at any time;</li>
          <li>have a grievance about our handling of your data addressed; and</li>
          <li>nominate another person to exercise these rights for you if you die or become unable to.</li>
        </List>
        <p>
          To use any of these rights, email <a href={`mailto:${CONTACT.email}?subject=Data%20request`}>{CONTACT.email}</a>{" "}
          with the subject &ldquo;Data request&rdquo;. We reply {CONTACT.replyTime}. We may ask you to confirm it is
          really you before we act.
        </p>
        <p>
          If you are not satisfied with our response, you can complain to the Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "consent-and-cookies",
    title: "Withdrawing consent and cookies",
    content: (
      <>
        <p>
          Withdrawing consent is as easy as giving it. Use <strong>Cookie settings</strong> at the bottom of any page to
          change your analytics choice, or email us to withdraw consent for anything else. Withdrawal does not affect
          processing that already happened.
        </p>
        <p>The site stores a few small items in your browser:</p>
        <List>
          <li>
            <strong>Your consent choice</strong> (essential), so we remember whether you accepted or rejected
            analytics.
          </li>
          <li>
            <strong>Intro seen</strong> (essential, this browser session only), so the opening animation plays once.
          </li>
          <li>
            <strong>PostHog cookies and storage</strong>, only after you click Accept.
          </li>
        </List>
      </>
    ),
  },
  {
    id: "children",
    title: "Children’s data",
    content: (
      <>
        <p>
          The DPDP Act treats anyone under 18 as a child, and processing a child&rsquo;s data needs verifiable consent
          from a parent or lawful guardian.
        </p>
        <List>
          <li>
            The forms on this site are meant for adults. If you are under 18, please ask a parent or guardian to contact
            us for you.
          </li>
          <li>
            Registration for student events such as Hackers Occupied needs verifiable consent from a parent or guardian
            for any participant under 18.
          </li>
          <li>We do not track children, monitor their behaviour or show them targeted advertising.</li>
          <li>
            If we learn that we hold a child&rsquo;s data without that consent, we delete it. Parents and guardians can
            write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> at any time.
          </li>
        </List>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <>
        <List>
          <li>The whole site runs over HTTPS.</li>
          <li>
            Form submissions and decks are stored in a private database and a private storage bucket that the public
            cannot read. Only our server functions hold the access key, and it never reaches your browser.
          </li>
          <li>IP addresses are stored only as salted hashes.</li>
          <li>Access to submissions is limited to the Genesis team members who need it.</li>
        </List>
        <p>
          No system is perfectly secure. If a breach affects your personal data, we will inform you and the Data
          Protection Board of India as the DPDP Act requires.
        </p>
      </>
    ),
  },
  {
    id: "grievance-officer",
    title: "Grievance Officer and contact",
    content: (
      <>
        {/* NEEDS INPUT: the Grievance Officer's name, and the registered postal address of the legal entity. */}
        <p>
          <strong>Grievance Officer, Genesis Hacks</strong>
          <br />
          Email: <a href={`mailto:${CONTACT.email}?subject=Grievance`}>{CONTACT.email}</a>
          <br />
          Phone: <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        </p>
        <p>
          We reply to every grievance {CONTACT.replyTime} and keep you updated until it is resolved. See also our{" "}
          <Link to="/terms">terms of service</Link>.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        When we change this policy we update the date at the top of the page. If a change affects how we use data you
        already gave us, we will tell you before it takes effect and ask for consent again where the law requires it.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      type="privacy"
      title="Privacy policy"
      intro="What we collect through this site, why, who helps us process it, and how to see, correct or delete your data."
      sections={SECTIONS}
      lastUpdated={LAST_UPDATED}
    />
  );
}
