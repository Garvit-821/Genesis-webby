import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { CONTACT, DELHI } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal } from "@shared/motion";

/** Plain, checkable rules. No slogans (audit register 7, #25, #26). */
const TENETS = [
  {
    title: "Working builds over slides",
    text: "Judges at events we run score what a team built during the event. A demo that works beats a polished pitch deck.",
  },
  {
    title: "Build in public",
    text: "We encourage teams to share their code, write up what broke, and keep their projects online after the event.",
  },
  {
    title: "Open to anyone who builds",
    text: "You do not need a computer science degree or a famous college. First-timers, designers and self-taught developers are welcome at every event we run.",
  },
  {
    title: "Numbers we can back up",
    text: "We only publish figures we can source, and we say when a number is a projection rather than a result.",
  },
  {
    title: "Help each other",
    text: "Mentors, organisers and other teams are there to get you unstuck. Asking early is encouraged.",
  },
  {
    title: "Leave it better",
    text: "We respect venues, mentors' time and other people's work, and we clean up after ourselves.",
  },
];

const CONDUCT = [
  {
    title: "Credit other people's work",
    text: "Name the libraries, APIs and teammates you used. Submitting someone else's work as your own is not allowed.",
  },
  {
    title: "Critique the work, not the person",
    text: "Challenge ideas and code directly, and stay kind to the people behind them.",
  },
  {
    title: "Say when you do not know",
    text: "Nobody knows everything at 3 AM. Asking is how teams finish.",
  },
  {
    title: "No harassment, ever",
    text: "Harassment, discrimination and gatekeeping are not tolerated at any Genesis event, online or offline.",
  },
];

function Tenet({ tenet, index }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <li className="group grid gap-6 border-b border-[var(--border)] py-10 md:grid-cols-12 md:gap-10 md:py-14">
      <div aria-hidden className="relative md:col-span-3">
        <span className="block font-display text-[clamp(5rem,11vw,10rem)] leading-[0.8] text-outline opacity-50">{n}</span>
        <motion.span
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.3, ease: EASE_OUT }}
          className="absolute left-0 top-0 block font-display text-[clamp(5rem,11vw,10rem)] leading-[0.8] text-[var(--heading)]"
        >
          {n}
        </motion.span>
      </div>
      <Reveal className="md:col-span-9 md:pt-3">
        <h3 className="font-display text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[0.95] text-[var(--heading)]">
          {tenet.title}
        </h3>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-[var(--text-dim)]">{tenet.text}</p>
      </Reveal>
    </li>
  );
}

export default function ValuesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Values"
        title="How we run events"
        lines={["How we run", "events."]}
        intro="The rules we hold ourselves to when we run a hackathon or partner on one. Hold us to them."
      />

      <section aria-labelledby="tenets-title" className="px-5 pb-24 md:px-12">
        <div className="mx-auto max-w-[90rem]">
          <h2 id="tenets-title" className="sr-only">
            Our six rules
          </h2>
          <ol className="border-t border-[var(--border-strong)]">
            {TENETS.map((t, i) => (
              <Tenet key={t.title} tenet={t} index={i} />
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="conduct-title" className="border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
              <span className="overline">At every event</span>
            </div>
            <h2 id="conduct-title" className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[var(--heading)]">
              Code of conduct
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {CONDUCT.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 0.08} className="border border-[var(--border)] p-6 md:p-8">
                  <h3 className="font-display text-2xl leading-tight text-[var(--heading)]">{c.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--text-dim)]">{c.text}</p>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2} className="mt-6 border border-[var(--heading)]/50 bg-[var(--heading)]/[0.06] p-6 md:p-8">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--heading)]">Report a problem</h3>
              <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-[var(--text)]">
                At an event, tell any organiser straight away. Afterwards, email{" "}
                <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
                  {CONTACT.email}
                </a>{" "}
                or call{" "}
                <a href={CONTACT.phoneHref} className="underline underline-offset-4">
                  {CONTACT.phone}
                </a>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-next-title" className="border-t border-[var(--border)] px-5 py-20 md:px-12">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="values-next-title" className="max-w-[18ch] font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] text-[var(--heading)]">
            See it in practice at {DELHI.name} {DELHI.edition}.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Magnetic strength={0.2}>
              <Link to={DELHI.path} className="btn-cinema">
                About Delhi {DELHI.edition} <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link to="/about" className="btn-ghost">About Genesis</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
