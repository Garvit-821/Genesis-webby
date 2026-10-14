import React from "react";
import { Link } from "react-router-dom";
import LegalPage, { Callout, List } from "../shared/LegalPage";
import { BRAND, CONTACT, DELHI, PUNE, SITE_URL } from "@shared/config/site";

/*
 * Terms of service for genesishacks.com.
 *
 * NEEDS INPUT before legal sign-off (audit G05):
 *   - Registered legal entity name, type and postal address.
 *   - City whose courts have jurisdiction (currently "courts in India").
 * Have a lawyer review this page.
 */

const LAST_UPDATED = "13 October 2026";
const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

const SECTIONS = [
  {
    id: "about-these-terms",
    title: "About these terms",
    content: (
      <>
        <p>
          These terms apply when you use <strong>{DOMAIN}</strong> (the &ldquo;site&rdquo;), which is run by{" "}
          {BRAND.name}, India (&ldquo;Genesis&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you agree
          to them. If you do not agree, please do not use the site.
        </p>
        <Callout>
          <strong>In plain words.</strong> Use the site honestly, do not try to break it, and know that a sponsorship or
          event place is only confirmed once we both sign a separate written agreement or you receive a confirmed
          registration.
        </Callout>
      </>
    ),
  },
  {
    id: "what-the-site-is-for",
    title: "What the site is for",
    content: (
      <>
        <p>The site lets you:</p>
        <List>
          <li>learn what Genesis does for companies and for student builders;</li>
          <li>read about our own series, Hackers Occupied, and events we have run or partnered on;</li>
          <li>send us a sponsorship, partnership, collaboration or crew enquiry;</li>
          <li>register interest in upcoming events such as {DELHI.name}; and</li>
          <li>download a certificate if you took part in {PUNE.name}.</li>
        </List>
        <p>
          Each event has its own registration process, rules and code of conduct, which apply alongside these terms
          when you take part.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Using the site properly",
    content: (
      <>
        <p>When you use the site, you agree not to:</p>
        <List>
          <li>send false, misleading or someone else&rsquo;s details through a form;</li>
          <li>use the certificate tool to look up, or try to guess, other people&rsquo;s details;</li>
          <li>upload files that contain malware or that you have no right to share;</li>
          <li>try to break, overload, scan or get around the site&rsquo;s security;</li>
          <li>scrape the site in a way that harms its performance; or</li>
          <li>use the site for anything unlawful.</li>
        </List>
        <p>We may block access or ignore submissions that break these rules.</p>
      </>
    ),
  },
  {
    id: "enquiries-and-agreements",
    title: "Enquiries, sponsorships and agreements",
    content: (
      <>
        <p>
          Sending a form does not create a contract. Prices, packages and deliverables for a sponsorship or partnership
          are agreed separately, in writing, before any payment or commitment.
        </p>
        <p>
          You confirm that what you send us is accurate and that you are allowed to share it, including any deck or
          document you upload. We treat sponsor decks as confidential and handle them as our{" "}
          <Link to="/privacy">privacy policy</Link> describes.
        </p>
        <p>We reply to genuine enquiries {CONTACT.replyTime}.</p>
      </>
    ),
  },
  {
    id: "events",
    title: "Events, dates and changes",
    content: (
      <>
        <p>
          Event details on the site, such as dates, venues, tracks and team sizes, can change. Where we mark something
          as tentative (for example, the dates of {DELHI.name}), it is a plan, not a promise. Figures marked as
          projections are estimates, not results.
        </p>
        <p>
          Photos and videos are taken at Genesis events and may appear on this site and our social channels. If you
          appear in one and want it removed, email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will
          take it down.
        </p>
      </>
    ),
  },
  {
    id: "other-brands",
    title: "Other companies' names and logos",
    content: (
      <p>
        Names and logos of other companies belong to their owners. When a brand appears on the site, it means the
        brand sponsored or took part in an event that Genesis ran or partnered on. It does not mean that brand endorses
        Genesis. If you represent a brand and want its name or logo changed or removed, email us.
      </p>
    ),
  },
  {
    id: "our-content",
    title: "Our content",
    content: (
      <p>
        The site&rsquo;s text, design, photos and the Genesis name and logo belong to Genesis or are used with
        permission. You may share links to the site and quote short passages with credit. Please ask before reusing
        anything else.
      </p>
    ),
  },
  {
    id: "certificates",
    title: "Certificates",
    content: (
      <p>
        Certificates are issued only to registered participants, using the email and phone they registered with. A
        certificate confirms participation in the named event. Altering a certificate or presenting someone else&rsquo;s
        as your own is not allowed, and we may confirm or deny a certificate&rsquo;s authenticity if asked.
      </p>
    ),
  },
  {
    id: "other-sites",
    title: "Links to other sites",
    content: (
      <p>
        The site links to other services, such as event registration platforms and social networks. We do not control
        them, and their own terms and privacy policies apply when you use them.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimers and liability",
    content: (
      <>
        <p>
          We work to keep the site accurate and available, but we provide it &ldquo;as is&rdquo;, without guarantees
          that it will always be error-free or online.
        </p>
        <p>
          To the extent the law allows, Genesis is not liable for indirect or consequential loss arising from your use
          of the site. Nothing in these terms limits liability that cannot be limited under Indian law.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of India, and disputes about them are subject to the jurisdiction of the
        courts in India. {/* NEEDS INPUT: name the city whose courts have jurisdiction. */}
      </p>
    ),
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    content: (
      <>
        <p>
          We may update these terms. When we do, we change the date at the top of this page. Continuing to use the site
          after a change means you accept the updated terms.
        </p>
        <p>
          Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or{" "}
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>. We reply {CONTACT.replyTime}.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      type="terms"
      title="Terms of service"
      intro="The rules for using genesishacks.com, sending us enquiries and taking part in Genesis events."
      sections={SECTIONS}
      lastUpdated={LAST_UPDATED}
    />
  );
}
