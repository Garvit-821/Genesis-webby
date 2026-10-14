import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useSectionScroll } from '@shared/hooks/useSectionScroll';
import { TEAM_MEMBERS, TEAM_COUNT } from '@shared/data/teamMembers';
import { EASE_OUT, ScrambleText, SplitText } from '@shared/motion';

export function TeamHero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useSectionScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const countY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '-60px']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="team-title"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-14 pt-40 md:px-12 md:pb-20"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 80% 15%, rgba(196,181,253,0.12), transparent 70%)' }}
      />

      {/* Giant outlined member count */}
      <motion.span
        aria-hidden
        style={{ y: countY }}
        className="text-outline pointer-events-none absolute -right-[3vw] top-[10vh] select-none font-display text-[46vw] leading-none opacity-30 sm:text-[34vw]"
      >
        {TEAM_COUNT}
      </motion.span>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 mx-auto w-full max-w-[90rem]">
        <div className="flex items-center gap-3">
          <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
          <ScrambleText text="Team" className="overline" />
        </div>

        <SplitText
          as="h1"
          id="team-title"
          lines={['The people', 'who run Genesis.']}
          trigger="mount"
          delay={0.15}
          stagger={0.08}
          className="mt-6 font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.9] text-[var(--heading)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE_OUT }}
          className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 sm:mt-16 md:grid-cols-[1fr_auto] md:items-end"
        >
          <p className="max-w-md text-base leading-relaxed text-[var(--text-dim)] sm:text-lg">
            Genesis is run by a small core team. These are the people you will talk to about sponsorships, events and partnerships.
          </p>

          <nav aria-label="Team members">
            <ol className="font-mono text-[13px] uppercase tracking-[0.12em]">
              {TEAM_MEMBERS.map((member) => (
                <li key={member.id}>
                  <a
                    href={`#member-${member.id}`}
                    className="group flex min-h-[40px] items-center gap-4 text-[var(--text-dim)] transition-colors hover:text-white"
                  >
                    <span style={{ color: member.color }}>{member.id}</span>
                    <span className="h-px w-6 bg-white/25 transition-all duration-300 group-hover:w-10 group-hover:bg-white/60" aria-hidden />
                    {member.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </motion.div>
      </motion.div>
    </section>
  );
}
