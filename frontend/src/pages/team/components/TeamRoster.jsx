import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrambleText } from '@widgets/layout/useScrambleText';
import { TEAM_MEMBERS, TEAM_COUNT } from '@shared/data/teamMembers';

const EASE = [0.16, 1, 0.3, 1];

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
      className="group relative overflow-hidden border-b border-white/10 scroll-mt-28"
      style={{ '--accent': member.color }}
    >
      {/* Accent fill sweeps in on hover */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-10 py-8 sm:py-12 px-2 sm:px-6">
        <motion.span
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
          className="self-start sm:self-center font-mono text-xs text-[var(--accent)] group-hover:text-black transition-colors duration-500"
        >
          {member.id}
        </motion.span>

        <div className="overflow-hidden min-w-0">
          <motion.h3
            variants={{ hidden: { y: '105%' }, visible: { y: 0 } }}
            transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
            className="font-display uppercase tracking-tighter leading-[0.9] text-[clamp(2.25rem,7vw,6.5rem)]"
          >
            <span className="block text-white group-hover:text-black transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 sm:group-hover:translate-x-6">
              <span aria-hidden>{scrambled}</span>
              <span className="sr-only">{member.name}</span>
            </span>
          </motion.h3>
        </div>

        <motion.div
          aria-hidden
          variants={{ hidden: { opacity: 0, scale: 0.6 }, visible: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.7, delay: 0.25 + index * 0.08, ease: EASE }}
          className="w-12 h-12 sm:w-20 sm:h-20 shrink-0 rounded-2xl border border-white/15 bg-white/[0.03] flex items-center justify-center font-display text-base sm:text-2xl transition-all duration-500 group-hover:rotate-6 group-hover:border-black/30 group-hover:bg-black/10"
        >
          <span className="text-[var(--accent)] group-hover:text-black transition-colors duration-500">{member.initials}</span>
        </motion.div>
      </div>
    </motion.li>
  );
}

export function TeamRoster() {
  return (
    <section id="roster" className="relative bg-[#070709] border-t border-white/10 py-20 sm:py-28">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8">
        <div className="mb-10 sm:mb-14 flex items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">Roster</span>
            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight mt-2">Core Team</h2>
          </div>
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">{TEAM_COUNT} Members</span>
        </div>

        <ol className="border-t border-white/10">
          {TEAM_MEMBERS.map((member, index) => (
            <RosterRow key={member.id} member={member} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
