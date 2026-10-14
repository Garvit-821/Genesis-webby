import React from "react";
import { motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { CONTACT, DELHI } from "@shared/config/site";
import { EASE_OUT, Magnetic } from "@shared/motion";
import PartnerForm from "@/features/forms/PartnerForm";
import useHashScroll from "@/features/forms/useHashScroll";
import InquiryPageLayout from "./InquiryPageLayout";
import DelhiSpotlight from "./components/DelhiSpotlight";
import OutcomeStack from "./components/OutcomeStack";
import StepsTimeline from "./components/StepsTimeline";
import ProofList from "./components/ProofList";
import StatStrip from "./components/StatStrip";

/**
 * Sponsor landing page. Outreach links here, so it answers in order:
 * what Genesis does, what is on sale now (Delhi 2027), what a sponsor
 * gets, how it works, proof, then the form (audit P06, P07, K02).
 */
export default function PartnerPage() {
  useHashScroll();

  return (
    <PageShell>
      <PageHero
        eyebrow="For sponsors"
        title="Partner with Genesis"
        lines={["Partner with", "Genesis."]}
        intro={`Sponsor ${DELHI.name} ${DELHI.edition} or independent student hackathons across India. Tell us your goal, budget and timeline and we shortlist events that fit.`}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic strength={0.25}>
            <a href="#partner-form" className="btn-cinema w-full justify-center sm:w-auto" data-cursor data-cursor-label="Start">
              Start a sponsorship <span aria-hidden>↓</span>
            </a>
          </Magnetic>
          <a href={`mailto:${CONTACT.email}`} className="btn-ghost w-full justify-center sm:w-auto">
            {CONTACT.email}
          </a>
        </motion.div>
        <StatStrip className="mt-16" />
      </PageHero>

      <DelhiSpotlight />
      <OutcomeStack />
      <StepsTimeline />
      <ProofList
        intro="Hackathons where Genesis was Event Partner. Each was run by its own organising team."
      />

      <InquiryPageLayout
        id="partner-form"
        eyebrow="Start here"
        title="Tell us what you need"
        lines={["Tell us what", "you need."]}
        intro="Five minutes. The more you share about goals, budget and timing, the better the first shortlist."
        points={[
          `${DELHI.name} ${DELHI.edition}: title, track and booth sponsorships`,
          "Independent hackathons matched to your audience and city",
          "Campus chapters, community partnerships and in-kind credits",
        ]}
        altLink={{
          prefix: "Want to co-host, judge or mentor instead?",
          to: "/collaborate",
          label: "Collaborate with us",
        }}
      >
        <PartnerForm />
      </InquiryPageLayout>
    </PageShell>
  );
}
