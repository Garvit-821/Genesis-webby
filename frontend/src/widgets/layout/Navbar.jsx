import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LANDING } from "@shared/constants/testIds";
import { usePageScroll } from "@shared/hooks/useSectionScroll";
import { CONTACT, DELHI } from "@shared/config/site";
import { EASE_OUT, EASE_SNAP, Magnetic } from "@shared/motion";
import { NAV_MENUS } from "./navMegaData";
import { useScrambleText } from "./useScrambleText";

const LOGO_URL = "/images/logo-mark.webp";
/** Nav chrome accent: Genesis lime (matches --heading). */
const NAV_ACCENT = "#e2efba";
const NAV_ACCENT_INK = "#181818";

function PlusIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] ${open ? "rotate-45" : "rotate-0"}`}
    >
      <path
        d="M5.49609 10.001H4.49609V5.91895H5.49609V10.001ZM10 4.49512V5.49512H5.91797V4.49512H10ZM4.08203 5.49512H0V4.49512H4.08203V5.49512ZM5.49609 4.08301H4.49609V0.000976562L5.49609 0V4.08301Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center text-white/90" aria-hidden>
      <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
        <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" fill="currentColor" />
      </svg>
    </span>
  );
}

function ScrambleLabel({ text, active }) {
  const display = useScrambleText(text, { active });
  return (
    <span className="pointer-events-none whitespace-nowrap text-[1.05rem] font-normal leading-none tracking-[-0.01em] text-white" aria-hidden>
      {display}
    </span>
  );
}

/** Top strip: the one event we are selling right now. */
function AnnouncementBar({ hidden }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: hidden ? 0 : "auto", opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35, ease: EASE_SNAP }}
      className="overflow-hidden bg-[var(--heading)] text-[#181818]"
    >
      <Link
        to={DELHI.path}
        data-testid="nav-announcement"
        className="group flex min-h-[36px] items-center justify-center gap-3 px-4 py-2 text-center font-mono text-[12px] uppercase tracking-[0.14em]"
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping bg-[#181818] opacity-60" />
          <span className="relative inline-flex h-2 w-2 bg-[#181818]" />
        </span>
        <span>
          <span className="hidden sm:inline">Next up · </span>
          {DELHI.name} {DELHI.edition}
          <span className="hidden md:inline"> · {DELHI.where} · {DELHI.when}</span>
        </span>
        <span className="hidden items-center gap-1 border-l border-[#181818]/30 pl-3 sm:inline-flex">
          Sponsor slots open
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  );
}

function MegaItem({ item, onNavigate }) {
  const inner = (
    <>
      <GridIcon />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-1.5 text-[0.95rem] leading-tight tracking-[-0.01em] text-white">
          {item.title}
          {item.href ? <span aria-hidden className="text-xs opacity-70">↗</span> : null}
        </span>
        <span className="text-[0.8rem] leading-[1.4] tracking-[-0.01em] text-[#a7aeb9] transition-colors duration-150 group-hover:text-white/85">
          {item.desc}
        </span>
      </span>
    </>
  );
  const cls =
    "group flex min-h-[44px] w-full items-start gap-3 px-3 py-3 text-left transition-colors duration-300 hover:bg-white/[0.05] focus-visible:bg-white/[0.05]";
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls} data-testid={item.testid} onClick={onNavigate}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={item.to} className={cls} data-testid={item.testid} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

function MegaFeature({ feature, onNavigate }) {
  return (
    <Link
      to={feature.to}
      onClick={onNavigate}
      className="group relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden border border-[#343940] bg-[#181818] p-5 transition-colors duration-300 hover:border-[var(--heading)]/60"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-30 transition-transform duration-700 group-hover:scale-125"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(226,239,186,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,239,186,0.5) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className="inline-flex w-fit items-center gap-2 bg-[var(--heading)] px-2 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-[#181818]">
        <span className="h-1.5 w-1.5 animate-pulse bg-[#181818]" aria-hidden />
        {feature.badge}
      </span>
      <span className="relative mt-6 block">
        <span className="block font-display text-[1.7rem] leading-[0.95] text-[var(--heading)]">{feature.title}</span>
        <span className="mt-3 block text-[0.85rem] leading-[1.45] text-[#a7aeb9]">{feature.desc}</span>
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-white">
          {feature.cta}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </span>
    </Link>
  );
}

function MegaPanel({ menu, onNavigate }) {
  if (!menu) return null;
  const hasFeature = Boolean(menu.feature);
  const columns = menu.columns.length + (hasFeature ? 1 : 0);

  return (
    <motion.div
      key={menu.id}
      id={`mega-${menu.id}`}
      initial={{ opacity: 0, y: -12, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.32, ease: EASE_SNAP }}
      className="relative z-40 px-3 pb-3 pt-1 md:px-6"
    >
      <div
        className="mx-auto grid w-full max-w-[72.5em] gap-0 overflow-hidden border-2 border-[#222529] bg-[#131518] p-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {hasFeature ? <MegaFeature feature={menu.feature} onNavigate={onNavigate} /> : null}
        {menu.columns.map((col, colIdx) => (
          <div
            key={col.category}
            className={`flex min-h-[16rem] flex-col px-1 pb-4 ${colIdx > 0 || hasFeature ? "border-l border-dashed border-[#343940]" : ""}`}
          >
            <div className="mb-2 w-full shrink-0 bg-[#222529] px-3 py-2 font-mono text-[12px] uppercase leading-tight tracking-[-0.02em] text-[#b4bac4]">
              {col.category}
            </div>
            <div className="flex flex-col divide-y divide-dashed divide-[#343940]">
              {col.items.map((item) => (
                <MegaItem key={item.title} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose }) {
  const groups = NAV_MENUS.map((m) => ({
    label: m.label,
    items: m.columns.flatMap((c) => c.items),
  }));
  let index = 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          key="mobile-menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="fixed inset-x-0 bottom-0 top-0 z-40 overflow-y-auto bg-[#0b0b0c] px-5 pb-10 pt-[124px] md:hidden"
        >
          <nav aria-label="Mobile">
            {groups.map((g) => (
              <div key={g.label} className="mb-8">
                <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.2em] text-white/55">{g.label}/</div>
                <ul className="border-t border-white/10">
                  {g.items.map((item) => {
                    const i = index++;
                    return (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.035, duration: 0.6, ease: EASE_OUT }}
                        className="border-b border-white/10"
                      >
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className="flex min-h-[56px] items-center justify-between gap-4 py-3"
                        >
                          <span className="font-display text-[1.65rem] leading-none text-[var(--heading)]">{item.title}</span>
                          <span aria-hidden className="text-white/50">→</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-6 grid gap-3">
            <Link to="/partner" onClick={onClose} className="btn-cinema justify-center">
              Partner with us <span aria-hidden>→</span>
            </Link>
            <Link to={DELHI.path} onClick={onClose} className="btn-ghost justify-center">
              {DELHI.name} {DELHI.edition}
            </Link>
          </div>
          <div className="mt-10 space-y-2 text-base text-white/75">
            <a href={`mailto:${CONTACT.email}`} className="block py-2 underline-offset-4 hover:underline">{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="block py-2 underline-offset-4 hover:underline">{CONTACT.phone}</a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [hoverLabelId, setHoverLabelId] = useState(null);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const triggerRefs = useRef({});
  const mobileToggleRef = useRef(null);
  const lastScrollY = useRef(0);
  const logoClicksRef = useRef([]);
  const location = useLocation();
  const { scrollYProgress } = usePageScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const activeMenu = NAV_MENUS.find((m) => m.id === activeId) || null;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (id) => {
    clearCloseTimer();
    setActiveId(id);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setActiveId(null), 140);
  };

  const closeAll = useCallback(() => {
    clearCloseTimer();
    setActiveId(null);
    setMobileOpen(false);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;
      setScrolled(currentY > 24);
      if (currentY < 80) setNavHidden(false);
      else if (delta > 6) {
        setNavHidden(true);
        clearCloseTimer();
        setActiveId(null);
      } else if (delta < -6) setNavHidden(false);
      lastScrollY.current = currentY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc closes the open menu and returns focus to what opened it (audit A10).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (activeId) {
        const trigger = triggerRefs.current[activeId];
        clearCloseTimer();
        setActiveId(null);
        trigger?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, mobileOpen]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!headerRef.current?.contains(e.target)) {
        clearCloseTimer();
        setActiveId(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop?.();
    return () => {
      html.style.overflow = prev;
      window.__lenis?.start?.();
    };
  }, [mobileOpen]);

  // Keyboard focus leaving the header closes the desktop panel.
  const onHeaderBlur = (e) => {
    if (!headerRef.current?.contains(e.relatedTarget)) {
      clearCloseTimer();
      setActiveId(null);
    }
  };

  const handleLogoClick = (e) => {
    const now = Date.now();
    const recent = [...logoClicksRef.current, now].filter((t) => now - t < 2500);
    logoClicksRef.current = recent;
    if (recent.length >= 7) {
      logoClicksRef.current = [];
      window.genesis?.overclock?.();
    }
    closeAll();
    if (location.pathname === "/") {
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const solid = mobileOpen || scrolled || activeId;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        ref={headerRef}
        onMouseLeave={scheduleClose}
        onMouseEnter={clearCloseTimer}
        onBlur={onHeaderBlur}
        className={`fixed left-0 right-0 top-0 z-50 transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${navHidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <AnnouncementBar hidden={scrolled && !mobileOpen} />
        <div
          className={`relative border-b transition-colors duration-300 ${solid ? "border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl" : "border-transparent bg-transparent"}`}
        >
          <div className="relative mx-auto flex h-[72px] max-w-[90rem] items-stretch justify-between px-3 md:px-6">
            <Link
              to="/"
              data-testid={LANDING.navLogo}
              onClick={handleLogoClick}
              className="flex shrink-0 items-center gap-3 px-2 transition-opacity hover:opacity-80 md:px-3"
              aria-label="Genesis Hacks home"
            >
              <span className="block h-8 w-8 overflow-hidden border border-white/20">
                <img src={LOGO_URL} alt="" width="32" height="32" className="h-full w-full object-cover" />
              </span>
              <span className="flex flex-col text-left leading-none">
                <span className="font-display text-[17px] tracking-tight text-white">Genesis</span>
                <span className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.18em] text-white/60">Hacks</span>
              </span>
            </Link>

            <nav aria-label="Main" className="absolute left-1/2 top-0 hidden h-[72px] -translate-x-1/2 items-center justify-center md:flex">
              {NAV_MENUS.map((menu) => {
                const open = activeId === menu.id;
                return (
                  <div
                    key={menu.id}
                    className="relative flex items-stretch"
                    onMouseEnter={() => {
                      setHoverLabelId(menu.id);
                      openMenu(menu.id);
                    }}
                    onMouseLeave={() => setHoverLabelId(null)}
                  >
                    <button
                      type="button"
                      ref={(el) => {
                        triggerRefs.current[menu.id] = el;
                      }}
                      data-testid={menu.testid}
                      aria-expanded={open}
                      aria-controls={`mega-${menu.id}`}
                      onClick={() => (open ? setActiveId(null) : openMenu(menu.id))}
                      className="flex min-h-[44px] items-center gap-2 px-[1.125em] py-[0.375em]"
                    >
                      <span className="sr-only">{menu.label}</span>
                      <ScrambleLabel text={menu.label} active={hoverLabelId === menu.id || open} />
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center p-[0.65em] transition-colors duration-300"
                        style={{
                          backgroundColor: open ? NAV_ACCENT : "#131518",
                          color: open ? NAV_ACCENT_INK : "#fff",
                        }}
                      >
                        <PlusIcon open={open} />
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-3 md:flex">
              <Link
                to={DELHI.path}
                className="hidden items-center gap-2 px-3 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-[var(--heading)] lg:inline-flex"
                data-cursor
                data-cursor-label="Delhi"
              >
                <span className="h-1.5 w-1.5 animate-pulse bg-[var(--heading)]" aria-hidden />
                Delhi &apos;27
              </Link>
              <Magnetic strength={0.25}>
                <Link
                  to="/partner"
                  data-testid={LANDING.navRsvpBtn}
                  data-cursor
                  data-cursor-label="Partner"
                  className="btn-cinema btn-cinema--nav shrink-0"
                >
                  Partner with us
                </Link>
              </Magnetic>
            </div>

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => {
                clearCloseTimer();
                setActiveId(null);
                setMobileOpen((s) => !s);
              }}
              className="flex min-w-[48px] items-center justify-center px-3 text-white md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              data-testid="nav-mobile-toggle"
            >
              <span
                className="flex h-9 w-9 items-center justify-center p-2 transition-colors"
                style={{
                  backgroundColor: mobileOpen ? NAV_ACCENT : "#131518",
                  color: mobileOpen ? NAV_ACCENT_INK : "#fff",
                }}
              >
                <PlusIcon open={mobileOpen} />
              </span>
            </button>
          </div>

          <motion.div style={{ width: barWidth }} className="h-px origin-left bg-[var(--heading)]/60" />

          <div className="pointer-events-none absolute inset-x-0 top-full hidden md:block">
            <div className="pointer-events-auto">
              <AnimatePresence mode="wait">
                {activeMenu ? <MegaPanel menu={activeMenu} onNavigate={closeAll} /> : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
