import React from "react";
import { motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { EASE_OUT, Magnetic } from "@shared/motion";
import CollaborateForm from "@/features/forms/CollaborateForm";
import useHashScroll from "@/features/forms/useHashScroll";
import InquiryPageLayout from "./InquiryPageLayout";

const WAYS = [
  {
    title: "Co-host a hackathon",
    line: "Your campus or community runs the event; we help with sponsors, judges and mentors.",
  },
  {
    title: "Run a track",
    line: "Set a challenge with its own brief, judging and prize inside a Genesis event.",
  },
  {
    title: "List your event",
    line: "Running a student hackathon? Tell us about it and we will look at bringing partners in.",
  },
  {
    title: "Judge or mentor",
    line: "Give a weekend to help teams get unstuck, then score what they built.",
  },
];

function WayCard({ way, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: EASE_OUT }}
      className="group relative flex min-h-[18rem] flex-col justify-between overflow-hidden border border-[var(--border)] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[var(--heading)]/60 md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-4 select-none font-display text-[10rem] leading-none text-white/[0.04] transition-transform duration-700 group-hover:-translate-y-3"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-[12px] tracking-[0.18em] text-[var(--text-faint)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative">
        <h3 className="font-display text-[1.9rem] leading-[0.95] text-[var(--heading)]">{way.title}</h3>
        <p className="mt-4 max-w-[32ch] text-base leading-relaxed text-[var(--text-dim)]">{way.line}</p>
      </div>
    </motion.li>
  );
}

export default function CollaboratePage() {
  useHashScroll();

  return (
    <PageShell>
      <PageHero
        eyebrow="Collaborate"
        title="Collaborate with Genesis"
        lines={["Collaborate", "with Genesis."]}
        intro="Co-host a hackathon, run a track, list your event, or join as a judge or mentor."
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
          className="mt-10"
        >
          <Magnetic strength={0.25}>
            <a href="#collaborate-form" className="btn-cinema">
              Send an idea <span aria-hidden>↓</span>
            </a>
          </Magnetic>
        </motion.div>
      </PageHero>

      <section aria-labelledby="ways-title" className="px-5 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="ways-title" className="sr-only">
            Ways to collaborate
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map((w, i) => (
              <WayCard key={w.title} way={w} index={i} />
            ))}
          </ul>
        </div>
      </section>

      <InquiryPageLayout
        id="collaborate-form"
        eyebrow="Start here"
        title="Tell us the idea"
        lines={["Tell us", "the idea."]}
        intro="A few lines is enough. Include dates and expected audience if you have them."
        altLink={{
          prefix: "Looking to sponsor instead?",
          to: "/partner",
          label: "Partner with us",
        }}
      >
        <CollaborateForm />
      </InquiryPageLayout>
    </PageShell>
  );
}
