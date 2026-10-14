import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { CONTACT, DELHI } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal, useMediaQuery } from "@shared/motion";
import WorkWithUsForm from "@/features/forms/WorkWithUsForm";
import useHashScroll, { scrollToId } from "@/features/forms/useHashScroll";

/**
 * Areas people can help with. Plain descriptions of the work; no
 * employment type, pay or perks are claimed (audit C17).
 */
const AREAS = [
  {
    value: "events",
    title: "Event operations",
    line: "Venues, run of show, check-in, food, Wi-Fi and the hundred small things that make a hackathon work on the day.",
    youWill: ["Plan schedules and floor layouts", "Run check-in and help desks", "Keep the event on time"],
  },
  {
    value: "partnerships",
    title: "Partnerships",
    line: "Find sponsors, write proposals and look after partners before, during and after an event.",
    youWill: ["Research companies that fit an event", "Draft proposals and follow up", "Be the sponsor's contact on the day"],
  },
  {
    value: "design",
    title: "Design",
    line: "Event identities, posters, decks, stage graphics and the website you are on.",
    youWill: ["Design event branding", "Make social and print assets", "Work on genesishacks.com"],
  },
  {
    value: "engineering",
    title: "Engineering",
    line: "Internal tools like the certificate download, the forms that reach our team, and this website.",
    youWill: ["Build and fix internal tools", "Ship website features", "Keep forms and data safe"],
  },
  {
    value: "community",
    title: "Community and campus",
    line: "Bring builders from your college to events and help first-timers find a team.",
    youWill: ["Share events on your campus", "Help run meetups", "Welcome first-time hackers"],
  },
];

function AreaDetail({ area, onApply }) {
  return (
    <div>
      <p className="max-w-[46ch] text-xl leading-snug text-[var(--text)] md:text-2xl">{area.line}</p>
      <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">You might</p>
      <ul className="mt-3 border-t border-[var(--border)]">
        {area.youWill.map((w) => (
          <li key={w} className="flex items-center gap-3 border-b border-[var(--border)] py-3 text-base text-[var(--text-dim)]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-[var(--heading)]" />
            {w}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onApply(area.value)} className="btn-cinema mt-8">
        Apply for {area.title.toLowerCase()} <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/** Desktop: hover or focus a name to swap the panel. Mobile: stacked cards. */
function Areas({ onApply }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);

  if (!isDesktop) {
    return (
      <ul className="space-y-4">
        {AREAS.map((area, i) => (
          <Reveal as="li" key={area.value} delay={i * 0.05} className="border border-[var(--border)] p-6">
            <h3 className="font-display text-[2rem] leading-none text-[var(--heading)]">{area.title}</h3>
            <div className="mt-5">
              <AreaDetail area={area} onApply={onApply} />
            </div>
          </Reveal>
        ))}
      </ul>
    );
  }

  const current = AREAS[active];
  return (
    <div className="grid grid-cols-12 gap-12">
      <ul className="col-span-6 border-t border-[var(--border-strong)]">
        {AREAS.map((area, i) => {
          const on = i === active;
          return (
            <li key={area.value} className="border-b border-[var(--border-strong)]">
              <button
                type="button"
                aria-pressed={on}
                aria-controls="area-panel"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={`font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[0.95] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    on ? "translate-x-4 text-[var(--heading)]" : "text-white/45 group-hover:text-white/80"
                  }`}
                >
                  {area.title}
                </span>
                <span
                  aria-hidden
                  className={`font-mono text-[13px] transition-colors ${on ? "text-[var(--heading)]" : "text-white/40"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div id="area-panel" aria-live="polite" className="sticky top-32 col-span-6 self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.value}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="border border-[var(--border)] p-10"
          >
            <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--heading)]">{current.title}</h3>
            <div className="mt-6">
              <AreaDetail area={current} onApply={onApply} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CareersPage() {
  useHashScroll();
  const [area, setArea] = useState("");

  const applyFor = (value) => {
    setArea(value);
    window.setTimeout(() => {
      scrollToId("apply");
      document.getElementById("crew-name")?.focus({ preventScroll: true });
    }, 60);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Join the crew"
        title="Join the Genesis crew"
        lines={["Join the", "crew."]}
        intro={`Help run hackathons across India. Tell us what you want to work on and we reply ${CONTACT.replyTime}.`}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Magnetic strength={0.25}>
            <a href="#apply" className="btn-cinema w-full justify-center sm:w-auto">
              Apply now <span aria-hidden>↓</span>
            </a>
          </Magnetic>
          <a href="#areas" className="btn-ghost w-full justify-center sm:w-auto">
            Areas of work
          </a>
        </motion.div>
      </PageHero>

      <section id="areas" aria-labelledby="areas-title" className="scroll-mt-28 border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
                <span className="overline">Where you can help</span>
              </div>
              <h2 id="areas-title" className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)]">
                Areas of work
              </h2>
            </div>
            <p className="max-w-[44ch] text-lg leading-relaxed text-[var(--text-dim)]">
              If there is a fit for an upcoming event, we set up a call and tell you what the work involves and how much time it takes.
            </p>
          </div>
          <Areas onApply={applyFor} />
        </div>
      </section>

      <section aria-labelledby="delhi-crew-title" className="border-t border-[var(--border)] px-5 py-16 md:px-12">
        <Reveal className="mx-auto flex max-w-[90rem] flex-col gap-6 border border-[var(--heading)]/50 bg-[var(--heading)]/[0.06] p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--heading)]">Next event</p>
            <h2 id="delhi-crew-title" className="mt-3 font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] text-[var(--heading)]">
              Want to help at {DELHI.name} {DELHI.edition}?
            </h2>
            <p className="mt-3 max-w-[56ch] text-base text-[var(--text-dim)]">
              {DELHI.where}, {DELHI.when}. Pick event operations in the form and mention Delhi.
            </p>
          </div>
          <button type="button" onClick={() => applyFor("events")} className="btn-cinema shrink-0">
            Apply for Delhi <span aria-hidden>→</span>
          </button>
        </Reveal>
      </section>

      <section id="apply" aria-labelledby="apply-title" className="scroll-mt-28 border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[90rem] items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
              <span className="overline">Apply</span>
            </div>
            <h2 id="apply-title" className="mt-6 font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.9] text-[var(--heading)]">
              Tell us about you
            </h2>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-[var(--text-dim)]">
              Questions first? Email{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-[var(--heading)] underline underline-offset-4">
                {CONTACT.email}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-7">
            <WorkWithUsForm area={area} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
