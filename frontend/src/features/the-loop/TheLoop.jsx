import React from "react";
import { motion } from "framer-motion";

const LOOP_PILLARS = [
  {
    number: "01",
    title: "FORGE",
    subtitle: "Ideate & Construct",
    description:
      "Transform ambitious concepts into functional high-performance code. Access edge tooling, hardware crates, and 1-on-1 mentor guidance.",
    tags: ["36H Hackathon", "Hardware Crates", "Mentor Support"],
    details: [
      "24/7 dedicated engineering mentors from top tech leaders",
      "Free cloud compute credits, hardware sensors & dev boards",
      "Rapid prototyping workshops & production template boilerplates",
    ],
  },
  {
    number: "02",
    title: "LAUNCH",
    subtitle: "Ship to Production",
    description:
      "Deploy live applications directly in front of thousands of peers, industry leaders, and venture capitalists under real pressure.",
    tags: ["Live Stage Pitch", "VC Judging Panel", "Public Showcase"],
    details: [
      "Direct 5-minute mainstage pitch for top finalist projects",
      "Instant deployment pipelines & custom staging environment allocation",
      "Real-time feedback from accredited seed investors & tech founders",
    ],
  },
  {
    number: "03",
    title: "SCALE",
    subtitle: "Accelerate & Monetize",
    description:
      "Turn hackathon prototypes into funded startups. Secure equity-free grant funding, accelerator admission, and high-tier engineering roles.",
    tags: ["$50,000+ Prizes", "VC Incubation", "Career Pathways"],
    details: [
      "Fast-tracked admission into premier incubator & accelerator cohorts",
      "Non-dilutive cash grants and sponsor bounty prize distributions",
      "Direct recruiter matching with top AI, Web3 & cloud engineering firms",
    ],
  },
];

// Same easing as the About cards: 1 - 2^(-10t).
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function PillarCard({ pillar, index }) {
  return (
    <motion.article
      initial={{ opacity: 0.0001, y: "2.5vw", scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 2, delay: index * 0.12, ease: expoOut }}
      className={[
        "relative flex w-full flex-col justify-between border border-white bg-[#181818] p-6 sm:p-8 -mt-px first:mt-0",
        "lg:mt-0 lg:-ml-px lg:first:ml-0 lg:flex-1 lg:min-h-[36vw] lg:p-[1.667vw]",
      ].join(" ")}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="tick text-sm text-[var(--heading)]">{pillar.number}</span>
          <span className="overline !text-[var(--heading)] opacity-70">
            {pillar.subtitle}
          </span>
        </div>

        <h3
          style={{ fontFamily: '"Aeonik", sans-serif' }}
          className="mt-8 text-5xl sm:text-6xl lg:mt-[2.5vw] lg:text-[clamp(2.75rem,4.2vw,5rem)] leading-[0.85] tracking-[-0.05em] text-[var(--heading)] uppercase"
        >
          {pillar.title}
        </h3>

        <p className="mt-6 max-w-[40ch] text-base leading-snug text-[var(--heading)] lg:mt-[1.667vw]">
          {pillar.description}
        </p>
      </div>

      <div className="mt-10 lg:mt-[2.5vw]">
        <ul className="border-t border-white/25">
          {pillar.details.map((detail) => (
            <li
              key={detail}
              className="flex gap-3 border-b border-white/25 py-3 text-sm leading-snug text-[var(--heading)] opacity-80"
            >
              <span aria-hidden className="shrink-0">—</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {pillar.tags.map((tag) => (
            <span
              key={tag}
              className="border border-white/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--heading)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Chapter 02 — the Forge / Launch / Scale builder loop,
 * styled to match the About chapter (bordered dark cards, Aeonik display type).
 */
export default function TheLoop() {
  return (
    <section
      id="loop"
      className="relative z-[3] bg-[#181818] py-16 text-[var(--heading)] md:py-[8vw]"
      aria-label="The Loop"
    >
      <div className="mx-auto w-full px-5 md:w-[80vw] md:px-0 lg:w-[70vw]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: expoOut }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-[4vw]"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-px w-10 bg-[var(--heading)] opacity-40" />
              <span className="overline !text-[var(--heading)] opacity-70">
                Chapter 02 · The Loop
              </span>
            </div>

            <h2
              style={{ fontFamily: '"Aeonik", sans-serif' }}
              className="mt-6 text-5xl sm:text-6xl lg:mt-[1.667vw] lg:text-[clamp(3.5rem,6vw,7rem)] leading-[0.9] tracking-[-0.05em] text-[var(--heading)] uppercase"
            >
              Build <span className="opacity-35">/</span> Ship{" "}
              <span className="opacity-35">/</span> Scale.
            </h2>
          </div>

          <p className="max-w-[36ch] text-xl leading-[1.3] tracking-[-0.02em] text-[var(--heading)] lg:text-[1.45vw] lg:leading-[1.35]">
            The continuous execution loop for builders who turn code into
            reality.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col lg:mt-[5vw] lg:flex-row">
          {LOOP_PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.number} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
