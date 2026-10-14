import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BlackHole from "@shared/ui/BlackHole";
import { prefersReducedMotion } from "@shared/hooks/useAnimationLifecycle";
import { openConsentSettings } from "@shared/consent/consent";
import { CONTACT, DELHI, PUNE, SOCIALS, BRAND } from "@shared/config/site";
import { Magnetic, SplitText, Reveal } from "@shared/motion";

const COLUMNS = [
  {
    title: "Events",
    links: [
      { label: `${DELHI.name} ${DELHI.edition}`, to: DELHI.path },
      { label: `${PUNE.name} recap`, to: PUNE.path },
      { label: "Events archive", to: "/events" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "Sponsor an event", to: "/partner" },
      { label: "Co-host, judge or mentor", to: "/collaborate" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Genesis", to: "/about" },
      { label: "How we run events", to: "/values" },
      { label: "Team", to: "/team" },
      { label: "Join the crew", to: "/careers" },
      { label: "Organiser guide", to: "/guide" },
    ],
  },
];

export default function Footer() {
  const { pathname } = useLocation();
  // On the partner page itself the CTA would repeat the page headline.
  const onPartner = pathname === "/partner";
  const footerRef = useRef(null);
  const blackHoleTiltRef = useRef(158);
  const [particleCount, setParticleCount] = useState(520);
  const [enableBlackHole, setEnableBlackHole] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 768px)");
    const saveData = navigator.connection?.saveData;
    const apply = () => {
      setEnableBlackHole(!prefersReducedMotion() && !saveData);
      setParticleCount(narrow.matches ? 280 : 520);
    };
    apply();
    narrow.addEventListener("change", apply);
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionMq.addEventListener?.("change", apply);
    return () => {
      narrow.removeEventListener("change", apply);
      motionMq.removeEventListener?.("change", apply);
    };
  }, []);

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse" || !footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    blackHoleTiltRef.current = 158 + normalizedX * 7;
  };

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        blackHoleTiltRef.current = 158;
      }}
      className="site-footer relative z-[3] flex flex-col border-t border-[var(--border)] text-[var(--text)]"
    >
      {/* Sponsor CTA */}
      <div className="relative z-[2] mx-auto w-full max-w-[90rem] px-5 pt-20 md:px-12 md:pt-28">
        <div className="flex items-center gap-3">
          <span className="block h-px w-10 bg-[var(--heading)]/50" />
          <span className="overline">
            Sponsoring {DELHI.name} {DELHI.edition}?
          </span>
        </div>
        <SplitText
          as="h2"
          key={onPartner ? "partner" : "default"}
          lines={onPartner ? ["Rather talk", "first?"] : ["Partner with", "Genesis."]}
          className="mt-6 font-display text-[clamp(3rem,10vw,9.5rem)] leading-[0.86] text-[var(--heading)]"
          stagger={0.07}
        />
        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <Magnetic strength={0.18}>
              <a
                href={`mailto:${CONTACT.email}`}
                className="footer-mail group relative inline-block text-[clamp(1.5rem,4vw,3.25rem)] leading-tight tracking-[-0.02em] text-white"
                data-cursor
                data-cursor-label="Email"
              >
                {CONTACT.email}
                <span aria-hidden className="footer-mail__line" />
              </a>
            </Magnetic>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex min-h-[44px] w-fit items-center text-lg text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              {CONTACT.phone}
            </a>
            <p className="text-sm text-white/60">We reply {CONTACT.replyTime}.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {onPartner ? null : (
              <Link to="/partner" className="btn-cinema">
                Sponsor an event <span aria-hidden>→</span>
              </Link>
            )}
            <Link to={DELHI.path} className="btn-ghost">
              About Delhi {DELHI.edition}
            </Link>
          </div>
        </div>

        {/* Link columns: real anchors so crawlers and keyboards can follow them */}
        <nav aria-label="Footer" className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[var(--border)] pt-10 md:mt-24 md:grid-cols-4">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.06}>
              <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/55">{col.title}</h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-draw inline-flex min-h-[40px] items-center text-[15px] text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          <Reveal delay={0.18}>
            <h3 className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/55">Follow</h3>
            <ul className="mt-4 space-y-1">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw inline-flex min-h-[40px] items-center gap-1 text-[15px] text-white/85 hover:text-white"
                  >
                    {s.label} <span aria-hidden className="text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </nav>
      </div>

      <div className="flex-1" />

      {/* Wordmark + black hole */}
      <div className="footer-wordmark-stage">
        {enableBlackHole && (
          <div className="footer-blackhole" aria-hidden="true">
            <BlackHole
              particleCount={particleCount}
              particleSize={5}
              colors={["#ffffff", "#f0f0f0", "#d4d4d4"]}
              outerRadius={78}
              tilt={18}
              tiltSideway={158}
              tiltSidewayRef={blackHoleTiltRef}
              trail={48}
              orbitSpeed={3.6}
              pullSpeed={0}
              voidColor="#181818"
              background="transparent"
              centre={{ voidRadius: 74, voidX: 50, voidY: 34 }}
            />
          </div>
        )}
        <div className="footer-wordmark" aria-hidden="true">
          GENESIS
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>
          © {new Date().getFullYear()} {BRAND.name}
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/terms" className="inline-flex min-h-[44px] items-center hover:text-white">Terms</Link>
          <Link to="/privacy" className="inline-flex min-h-[44px] items-center hover:text-white">Privacy</Link>
          <button type="button" onClick={openConsentSettings} className="inline-flex min-h-[44px] items-center uppercase hover:text-white">
            Cookie settings
          </button>
        </div>
      </div>
    </footer>
  );
}
