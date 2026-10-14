import React from "react";
import { Link } from "react-router-dom";
import { PageShell, PageHero } from "@widgets/layout";
import { CONTACT, DELHI } from "@shared/config/site";
import Contact from "@/features/contact/Contact";

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Contact Genesis"
        lines={["Contact", "Genesis."]}
        intro={`Sponsors and partners: email ${CONTACT.email} or call ${CONTACT.phone}. Students and campus communities: use the form below. We reply ${CONTACT.replyTime}.`}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/partner" className="btn-cinema">
            Sponsor an event <span aria-hidden>→</span>
          </Link>
          <Link to={DELHI.path} className="btn-ghost">
            {DELHI.name} {DELHI.edition}
          </Link>
        </div>
      </PageHero>
      <Contact />
    </PageShell>
  );
}
