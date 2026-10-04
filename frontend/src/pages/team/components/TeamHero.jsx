import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useSectionScroll } from '@shared/hooks/useSectionScroll';
import { TEAM_MEMBERS, TEAM_COUNT } from '@shared/data/teamMembers';

const EASE = [0.16, 1, 0.3, 1];

export function TeamHero() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useSectionScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const countY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '-60px']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden px-4 sm:px-8 pt-36 pb-14 sm:pb-20 bg-[#08080b]"
    >
      {/* Ambient grid & glow */}
      <div className="absolute inset-0 team-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_15%,rgba(196,181,253,0.10),transparent_70%)] pointer-events-none" />

      {/* Giant outlined member count */}
      <motion.span
        aria-hidden
        style={{ y: countY, color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.07)' }}
        className="absolute -right-[3vw] top-[10vh] font-display leading-none text-[46vw] sm:text-[34vw] select-none pointer-events-none"
      >
        {TEAM_COUNT}
      </motion.span>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-[1300px] w-full mx-auto"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          Genesis Hacks // Core Team
        </motion.span>

        <h1 className="mt-6 font-display uppercase tracking-tighter leading-[0.9] text-[clamp(2.75rem,9vw,8rem)]">
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span
              className="block text-white"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
            >
              The Minds
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span
              className="block text-transparent"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.45)' }}
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.28, ease: EASE }}
            >
              Behind Genesis
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end"
        >
          <p className="max-w-md font-sans text-sm sm:text-base text-white/55 font-light leading-relaxed">
            The core team behind Genesis Hacks — builders obsessed with creating high-octane experiences for developers.
          </p>

          {/* Index of members — jumps to their roster row */}
          <ol className="font-mono text-xs uppercase tracking-wider">
            {TEAM_MEMBERS.map((member) => (
              <li key={member.id}>
                <a
                  href={`#member-${member.id}`}
                  className="group flex items-center gap-4 py-1.5 text-white/50 hover:text-white transition-colors"
                >
                  <span style={{ color: member.color }}>{member.id}</span>
                  <span className="h-px w-6 bg-white/20 group-hover:w-10 group-hover:bg-white/60 transition-all duration-300" />
                  {member.name}
                </a>
              </li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}
