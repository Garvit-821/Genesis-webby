import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageShell } from '@widgets/layout';
import { CONTACT } from '@shared/config/site';
import { EASE_OUT, Magnetic, SplitText } from '@shared/motion';
import { TeamHero } from './components/TeamHero';
import { TeamRoster } from './components/TeamRoster';
import { TeamNameMarquee } from './components/TeamNameMarquee';

export default function TeamPage() {
  return (
    <PageShell>
      <TeamHero />
      <TeamRoster />
      <TeamNameMarquee />

      <section aria-labelledby="team-cta-title" className="mx-auto max-w-[90rem] px-5 py-24 md:px-12 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="relative overflow-hidden border border-[var(--border)] p-8 text-center sm:p-16"
        >
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
          <span className="overline relative">Join the crew</span>
          <SplitText
            as="h2"
            id="team-cta-title"
            lines={['Want to help', 'run events?']}
            className="relative mt-4 font-display text-[clamp(2.25rem,6vw,5rem)] leading-[0.92] text-[var(--heading)]"
          />
          <p className="relative mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--text-dim)] sm:text-lg">
            We need people for event operations, partnerships, design, engineering and campus work. See what is open and tell us what you want to do.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic strength={0.25}>
              <Link to="/careers" className="btn-cinema">
                See open roles <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <a href={`mailto:${CONTACT.email}`} className="btn-ghost">
              Email the team
            </a>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
