import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import useLenis from '@shared/hooks/useLenis';
import { Navbar, Footer } from '@widgets/layout';
import { TeamHero } from './components/TeamHero';
import { TeamRoster } from './components/TeamRoster';
import { TeamNameMarquee } from './components/TeamNameMarquee';
import WorkWithUsForm from '@/features/forms/WorkWithUsForm';

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[var(--brand)] via-white to-[var(--heading)] z-[100] origin-left shadow-[0_0_15px_var(--brand)]"
    />
  );
}

export default function TeamPage() {
  // Activate Lenis smooth scrolling for buttery scroll choreography
  useLenis();

  const [isWorkFormOpen, setIsWorkFormOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#08080b] text-white overflow-x-hidden selection:bg-[var(--brand)] selection:text-black">
      <style>{TEAM_PAGE_CSS}</style>

      {/* Smooth scroll top progress bar */}
      <ScrollProgressBar />

      {/* Global Navigation */}
      <Navbar />

      {/* 1. Editorial Hero */}
      <TeamHero />

      {/* 2. Core Team Roster */}
      <TeamRoster />

      {/* 3. Name Marquee */}
      <TeamNameMarquee />

      {/* 4. Join the Collective Call-to-Action */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-8 py-24 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/12 bg-white/[0.02] hover:border-white/25 transition-all p-10 sm:p-20 text-center overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)] group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(196,181,253,0.12),transparent)] pointer-events-none" />
          <div className="absolute inset-0 team-grid-bg opacity-20 pointer-events-none" />

          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
            Join The Movement
          </span>

          <h2 className="font-display text-3xl sm:text-6xl text-white uppercase tracking-tight mt-3 mb-4">
            We&apos;re Always
            <br />
            Looking for Builders
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/55 max-w-lg mx-auto leading-relaxed mb-8 font-light">
            If you&apos;re passionate about developer communities, cutting-edge software, and creating unforgettably sleek experiences, we&apos;d love to build together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsWorkFormOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_40px_rgba(196,181,253,0.35)] group-hover:scale-105 cursor-pointer"
            >
              Work With Us (Join Team) ↗
            </button>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-mono text-xs uppercase font-bold tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              Explore Open Roles
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Work With Us Form Modal */}
      <WorkWithUsForm
        isOpen={isWorkFormOpen}
        onClose={() => setIsWorkFormOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

const TEAM_PAGE_CSS = `
  .team-grid-bg {
    background-image:
      linear-gradient(rgba(196,181,253,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(196,181,253,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
`;
