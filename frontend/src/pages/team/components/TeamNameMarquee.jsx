import React from 'react';
import { TEAM_MEMBERS } from '@shared/data/teamMembers';

// Each half is wider than the viewport, so translating by -50% loops seamlessly.
const HALF = [...TEAM_MEMBERS, ...TEAM_MEMBERS];
const TRACK = [...HALF, ...HALF];

export function TeamNameMarquee() {
  return (
    <section aria-hidden className="relative overflow-hidden border-y border-white/10 bg-[#08080b] py-10 sm:py-14">
      <style>{MARQUEE_CSS}</style>
      <div className="team-name-marquee inline-flex items-center gap-8 sm:gap-14 whitespace-nowrap">
        {TRACK.map((member, i) => (
          <React.Fragment key={`${member.id}-${i}`}>
            <span
              className="font-display uppercase tracking-tighter leading-none text-[clamp(2.5rem,7vw,6rem)]"
              style={i % 2 === 0 ? undefined : { color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}
            >
              {member.name}
            </span>
            <span className="font-display text-2xl sm:text-4xl leading-none" style={{ color: member.color }}>
              ✦
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

const MARQUEE_CSS = `
  .team-name-marquee {
    animation: team-name-marquee 40s linear infinite;
  }
  @keyframes team-name-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .team-name-marquee { animation: none; }
  }
`;
