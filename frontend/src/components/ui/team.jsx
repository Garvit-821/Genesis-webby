import React from 'react';
import { TEAM_MEMBERS } from '@shared/data/teamMembers';

/**
 * Simple team grid. Reads the real roster only; the old template version
 * listed invented people with stock photos and has been replaced.
 * Not used by any page at the moment (the /team page has its own roster).
 */
export default function TeamSection({ members = TEAM_MEMBERS, title = 'Team' }) {
  return (
    <section className="py-12 md:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {title ? (
          <h2 className="mb-10 font-display text-4xl text-[var(--heading)] md:text-5xl">{title}</h2>
        ) : null}
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {members.map((member) => (
            <li key={member.id} className="flex flex-col items-start gap-3 border border-[var(--border)] p-4">
              <span
                aria-hidden
                className="flex h-16 w-16 items-center justify-center border border-white/20 font-display text-xl"
                style={{ color: member.color }}
              >
                {member.initials}
              </span>
              <span className="text-base text-white">{member.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
