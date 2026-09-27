import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LANDING } from "@shared/constants/testIds";
import { usePageScroll } from "@shared/hooks/useSectionScroll";
import { NAV_MENUS } from "./navMegaData";
import { useScrambleText } from "./useScrambleText";

const LOGO_URL = "/images/logo.png";
/** Nav chrome accent — Genesis lime (matches --heading) */
const NAV_ACCENT = "#e2efba";
const NAV_ACCENT_INK = "#181818";
/** Temporary: Hackers Occupied Pune certificate CTA. Set to null to remove. */
const CERTIFICATE_CTA = { to: "/certificates/hackers-occupied-pune", label: "Get Certificate" };

function PlusIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={`h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] ${open ? "rotate-45" : "rotate-0"
        }`}
    >
      <path
        d="M5.49609 10.001H4.49609V5.91895H5.49609V10.001ZM10 4.49512V5.49512H5.91797V4.49512H10ZM4.08203 5.49512H0V4.49512H4.08203V5.49512ZM5.49609 4.08301H4.49609V0.000976562L5.49609 0V4.08301Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 7"
      fill="none"
      aria-hidden
      className="mt-0.5 h-2.5 w-2.5 shrink-0 opacity-70"
    >
      <path
        d="M0.0193998 1.17602L1.1814 1.52588e-05L6.04145 0V4.89969L4.86545 6.06169V2.058L0.868 6.06017L0 5.19217L3.99745 1.176L0.0193998 1.17602Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ItemIcon() {
  return (
    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center text-white/90">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-full w-full">
        <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

function ScrambleLabel({ text, active }) {
  const display = useScrambleText(text, { active });
  return (
    <span className="pointer-events-none whitespace-nowrap text-[1.05rem] font-normal leading-none tracking-[-0.01em] text-white">
      {display}
    </span>
  );
}

function MegaItem({ item, onActivate, equal }) {
  return (
    <button
      type="button"
      data-testid={item.testid}
      onClick={() => onActivate(item)}
      className={`group flex w-full items-start gap-3 px-3 py-3 text-left transition-colors duration-300 hover:bg-white/[0.04] ${
        equal ? "min-h-0 flex-1 justify-start" : ""
      }`}
    >
      <ItemIcon />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex items-center gap-1.5 text-[0.875rem] leading-none tracking-[-0.01em] text-white">
          {item.title}
          {item.external ? <ExternalArrow /> : null}
        </span>
        <span className="text-[0.75rem] leading-[1.4] tracking-[-0.01em] text-[#89919f] transition-colors duration-150 group-hover:text-white/80">
          {item.desc}
        </span>
      </span>
    </button>
  );
}

function MegaMajorItem({ item, onActivate, equal }) {
  return (
    <button
      type="button"
      data-testid={item.testid}
      onClick={() => onActivate(item)}
      className={`group flex w-full flex-col justify-between gap-4 border border-[#343940] bg-[#181818] px-4 py-4 text-left transition-colors duration-300 hover:border-white/25 hover:bg-[#1c1c1c] ${equal ? "min-h-0 flex-1" : "min-h-[7.5rem]"
        }`}
    >
      <span className="flex items-start justify-between gap-3">
        <ItemIcon />
        {item.external ? <ExternalArrow /> : null}
      </span>
      <span className="flex min-w-0 flex-col gap-2">
        <span className="font-display text-[1.35rem] leading-none tracking-tight text-white">
          {item.title}
        </span>
        <span className="text-[0.8rem] leading-[1.4] tracking-[-0.01em] text-[#89919f] transition-colors duration-150 group-hover:text-white/80">
          {item.desc}
        </span>
      </span>
    </button>
  );
}

function MegaColumn({ col, colIdx, onActivate, equalFill }) {
  return (
    <div
      className={`flex h-full min-h-[16rem] flex-col px-1 pt-0 ${equalFill ? "pb-4" : "pb-10"
        } ${colIdx > 0 ? "border-l border-dashed border-[#343940]" : ""}`}
    >
      <div className="mb-2 w-full shrink-0 bg-[#222529] px-3 py-2 font-mono text-[0.625rem] uppercase leading-tight tracking-[-0.02em] text-[#a1a7b2]">
        {col.category}
      </div>
      <div
        className={`flex min-h-0 flex-1 flex-col ${col.major ? "gap-3" : equalFill ? "gap-0 divide-y divide-dashed divide-[#343940]" : "gap-1"
          }`}
      >
        {col.items.map((item) =>
          col.major ? (
            <MegaMajorItem
              key={item.title}
              item={item}
              onActivate={onActivate}
              equal={equalFill}
            />
          ) : (
            <MegaItem
              key={item.title}
              item={item}
              onActivate={onActivate}
              equal={equalFill}
            />
          ),
        )}
      </div>
    </div>
  );
}

function MegaPanel({ menu, onActivate }) {
  if (!menu) return null;
  const split = menu.layout === "split-3-2";
  const cols = menu.columns.length;

  return (
    <motion.div
      key={menu.id}
      initial={{ opacity: 0, y: -12, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.32, ease: [0.215, 0.61, 0.355, 1] }}
      className="relative z-40 px-3 pb-3 pt-1 md:px-6"
    >
      <div
        className="mx-auto grid w-full max-w-[72.5em] overflow-hidden border-2 border-[#222529] bg-[#131518]"
        style={{
          gridTemplateColumns: split
            ? "minmax(0, 1fr) minmax(0, 1.15fr)"
            : `repeat(${Math.min(cols, 4)}, minmax(0, 1fr))`,
          minHeight: split ? "18rem" : undefined,
        }}
      >
        {menu.columns.map((col, colIdx) => (
          <MegaColumn
            key={col.category}
            col={col}
            colIdx={colIdx}
            onActivate={onActivate}
            equalFill={split}
          />
        ))}
      </div>
    </motion.div>
  );
}

function NavToggle({ menu, open, hovering, onOpen, onClose, onHoverLabel }) {
  const scramble = hovering || open;

  return (
    <div
      className="relative flex items-stretch"
      onMouseEnter={() => {
        onHoverLabel(menu.id);
        onOpen(menu.id);
      }}
      onMouseLeave={() => onHoverLabel(null)}
    >
      <button
        type="button"
        data-testid={menu.testid}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen(menu.id))}
        className="flex items-center gap-2 px-[1.125em] py-[0.375em]"
      >
        <ScrambleLabel text={menu.label} active={scramble} />
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
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [hoverLabelId, setHoverLabelId] = useState(null);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
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
    closeTimer.current = setTimeout(() => setActiveId(null), 120);
  };

  const closeMenu = () => {
    clearCloseTimer();
    setActiveId(null);
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 24);

      if (currentY < 80) {
        setNavHidden(false);
      } else if (delta > 6) {
        setNavHidden(true);
        setMobileOpen(false);
        clearCloseTimer();
        setActiveId(null);
      } else if (delta < -6) {
        setNavHidden(false);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        clearCloseTimer();
        setActiveId(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  const logoClicksRef = useRef([]);

  const goHome = () => {
    setMobileOpen(false);
    closeMenu();
    if (location.pathname !== "/") navigate("/");
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    const now = Date.now();
    const recent = [...logoClicksRef.current, now].filter((t) => now - t < 2500);
    logoClicksRef.current = recent;

    if (recent.length >= 7) {
      logoClicksRef.current = [];
      if (window.genesis && window.genesis.overclock) {
        window.genesis.overclock();
      }
    }
    goHome();
  };

  const activateItem = (item) => {
    closeMenu();
    setMobileOpen(false);
    if (item?.external || item?.target?.startsWith("http")) {
      window.open(item.target, "_blank", "noopener,noreferrer");
    } else if (item?.target) {
      navigate(item.target);
    }
  };

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onMouseEnter={clearCloseTimer}
      className={`fixed left-0 right-0 top-0 z-50 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${navHidden ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <div
        className={`relative border-b transition-colors duration-300 ${mobileOpen || scrolled || activeId
            ? "border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl"
            : "border-transparent bg-transparent"
          }`}
      >
        <div className="relative mx-auto flex h-[72px] max-w-[90rem] items-stretch justify-between px-3 md:px-6">
          <button
            type="button"
            data-testid={LANDING.navLogo}
            onClick={handleLogoClick}
            className="flex shrink-0 items-center gap-3 px-2 transition-opacity hover:opacity-80 md:px-3"
            aria-label="Genesis India"
          >
            <span className="block h-8 w-8 overflow-hidden border border-white/20">
              <img src={LOGO_URL} alt="Genesis" className="h-full w-full object-cover" />
            </span>
            <span className="flex flex-col text-left leading-none">
              <span className="font-display text-[17px] tracking-tight text-white">Genesis</span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                India
              </span>
            </span>
          </button>

          <nav className="absolute left-1/2 top-0 hidden h-[72px] -translate-x-1/2 items-center justify-center gap-0 md:flex">
            {NAV_MENUS.map((menu) => (
              <NavToggle
                key={menu.id}
                menu={menu}
                open={activeId === menu.id}
                hovering={hoverLabelId === menu.id}
                onOpen={openMenu}
                onClose={closeMenu}
                onHoverLabel={setHoverLabelId}
              />
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
          {CERTIFICATE_CTA ? (
            <Link
              to={CERTIFICATE_CTA.to}
              data-testid="nav-certificate-btn"
              data-cursor
              data-cursor-label="Certificate"
              onClick={() => {
                closeMenu();
                setMobileOpen(false);
              }}
              className="btn-ghost !px-5 !py-3 !text-[12px] !tracking-[0.06em]"
            >
              {CERTIFICATE_CTA.label}
            </Link>
          ) : null}
          <a
            href="https://hackculture.io/hackathons/hackers-occupied-pune"
            target="_blank"
            rel="noopener noreferrer"
            data-testid={LANDING.navRsvpBtn}
            data-cursor
            data-cursor-label="Register"
            onClick={() => {
              closeMenu();
              setMobileOpen(false);
            }}
            className={`btn-cinema btn-cinema--nav shrink-0 ${CERTIFICATE_CTA ? "hidden xl:inline-flex" : "inline-flex"}`}
          >
            Register Now
          </a>
          </div>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              setMobileOpen((s) => !s);
            }}
            className="flex items-center justify-center px-4 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            data-testid="nav-mobile-toggle"
          >
            <span
              className="flex h-8 w-8 items-center justify-center p-2 transition-colors"
              style={{
                backgroundColor: mobileOpen ? NAV_ACCENT : "#131518",
                color: mobileOpen ? NAV_ACCENT_INK : "#fff",
              }}
            >
              <PlusIcon open={mobileOpen} />
            </span>
          </button>
        </div>

        <motion.div style={{ width: barWidth }} className="h-px origin-left bg-white/40" />

        {/* Desktop mega panel — emerges from under the bar */}
        <div className="pointer-events-none absolute inset-x-0 top-full hidden md:block">
          <div className="pointer-events-auto">
            <AnimatePresence mode="wait">
              {activeMenu ? (
                <MegaPanel menu={activeMenu} onActivate={activateItem} />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-b border-white/10 bg-[#0a0a0a] md:hidden"
          >
            <div className="flex max-h-[min(80vh,640px)] flex-col gap-3 overflow-y-auto px-4 py-5">
              {CERTIFICATE_CTA ? (
                <Link
                  to={CERTIFICATE_CTA.to}
                  data-testid="mobile-nav-certificate-btn"
                  onClick={() => setMobileOpen(false)}
                  className="btn-cinema btn-cinema--nav w-full justify-center text-center"
                >
                  {CERTIFICATE_CTA.label}
                </Link>
              ) : null}

              {/* Primary Mobile Register Now CTA in Hamburger Menu */}
              <a
                href="https://hackculture.io/hackathons/hackers-occupied-pune"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="mobile-nav-rsvp-btn-top"
                onClick={() => {
                  setMobileOpen(false);
                }}
                className="btn-cinema btn-cinema--nav w-full justify-center text-center shadow-[0_0_20px_rgba(196,181,253,0.35)]"
              >
                Register Now ↗
              </a>

              <div className="pt-2 border-t border-white/10 space-y-1">
                {NAV_MENUS.map((menu) => {
                  const open = mobileSection === menu.id;
                  return (
                    <div key={menu.id} className="border-b border-white/10 last:border-0">
                      <button
                        type="button"
                        onClick={() => setMobileSection(open ? null : menu.id)}
                        className="flex w-full items-center justify-between py-3"
                      >
                        <span className="text-[1.05rem] text-white">{menu.label}</span>
                        <span
                          className="flex h-7 w-7 items-center justify-center p-1.5 transition-colors"
                          style={{
                            backgroundColor: open ? NAV_ACCENT : "#131518",
                            color: open ? NAV_ACCENT_INK : "#fff",
                          }}
                        >
                          <PlusIcon open={open} />
                        </span>
                      </button>
                      <AnimatePresence>
                        {open ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pb-3"
                          >
                            {menu.columns.map((col) => (
                              <div key={col.category} className="mb-3">
                                <div className="mb-1 bg-[#222529] px-2 py-1.5 font-mono text-[10px] uppercase text-[#a1a7b2]">
                                  {col.category}
                                </div>
                                {col.items.map((item) => (
                                  <MegaItem
                                    key={item.title}
                                    item={item}
                                    onActivate={activateItem}
                                  />
                                ))}
                              </div>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
