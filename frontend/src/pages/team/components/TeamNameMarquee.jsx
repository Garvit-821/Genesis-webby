import React from 'react';
import { TEAM_MEMBERS } from '@shared/data/teamMembers';
import { VelocityMarquee } from '@shared/motion';

/** Decorative: names already appear in the roster, so this is hidden from assistive tech. */
export function TeamNameMarquee() {
  return (
    <section aria-hidden="true" className="relative overflow-hidden border-y border-[var(--border)] py-10 sm:py-14">
      <VelocityMarquee baseVelocity={-1.6} copies={4} itemClassName="gap-8 pr-8 sm:gap-14 sm:pr-14">
        {TEAM_MEMBERS.map((member, i) => (
          <React.Fragment key={member.id}>
            <span
              className={`font-display text-[clamp(2.5rem,7vw,6rem)] leading-none ${i % 2 ? 'text-outline' : 'text-[var(--heading)]'}`}
            >
              {member.name}
            </span>
            <span className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" style={{ background: member.color }} />
          </React.Fragment>
        ))}
      </VelocityMarquee>
    </section>
  );
}
