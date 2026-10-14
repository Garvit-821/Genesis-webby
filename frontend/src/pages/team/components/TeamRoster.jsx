import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrambleText } from '@widgets/layout/useScrambleText';
import { TEAM_MEMBERS, TEAM_COUNT } from '@shared/data/teamMembers';
import { EASE_OUT } from '@shared/motion';

function RosterRow({ member, index }) {
  const [active, setActive] = useState(false);
  const scrambled = useScrambleText(member.name, { active, duration: 520 });

  return (
    <motion.li
      id={`member-${member.id}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="group relative scroll-mt-32 overflow-hidden border-b border-[var(--border)]"
      style={{ '--accent': member.color }}
    >
      {/* Accent fill sweeps in on hover */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 px-2 py-8 sm:gap-10 sm:px-6 sm:py-12">
        <motion.span
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
          className="self-start font-mono text-[13px] text-[var(--accent)] transition-colors duration-500 group-hover:text-black sm:self-center"
          aria-hidden
        >
          {member.id}
        </motion.span>

        <div className="min-w-0 overflow-hidden">
          <motion.h3
            variants={{ hidden: { y: '105%' }, visible: { y: 0 } }}
            transition={{ duration: 0.9, delay: index * 0.08, ease: EASE_OUT }}
            className="font-display text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.9]"
          >
            <span className="block text-white transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-black sm:group-hover:translate-x-6">
              <span aria-hidden>{scrambled}</span>
              <span className="sr-only">{member.name}</span>
            </span>
          </motion.h3>
        </div>

        <motion.div
          aria-hidden
          variants={{ hidden: { opacity: 0, scale: 0.6 }, visible: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.7, delay: 0.25 + index * 0.08, ease: EASE_OUT }}
          className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/20 bg-white/[0.03] font-display text-base transition-all duration-500 group-hover:rotate-6 group-hover:border-black/30 group-hover:bg-black/10 sm:h-20 sm:w-20 sm:text-2xl"
        >
          <span className="text-[var(--accent)] transition-colors duration-500 group-hover:text-black">{member.initials}</span>
        </motion.div>
      </div>
    </motion.li>
  );
}

export function TeamRoster() {
  return (
    <section id="roster" aria-labelledby="roster-title" className="relative border-t border-[var(--border)] py-20 sm:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-12">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
          <div>
            <span className="overline">Core team</span>
            <h2 id="roster-title" className="mt-2 font-display text-3xl text-[var(--heading)] sm:text-5xl">
              Who you will work with
            </h2>
          </div>
          <span className="font-mono text-[13px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
            {TEAM_COUNT} people
          </span>
        </div>

        <ol className="border-t border-[var(--border)]">
          {TEAM_MEMBERS.map((member, index) => (
            <RosterRow key={member.id} member={member} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
