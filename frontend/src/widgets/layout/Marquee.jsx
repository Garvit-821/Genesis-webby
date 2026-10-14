import React from "react";
import { VelocityMarquee } from "@shared/motion";

/**
 * Brands seen at events Genesis has run or partnered on.
 * NEEDS_CONFIRMATION: written approval to show each name (audit C09).
 * Prefer /brand-logos/*.webp; names without a logo render as type.
 */
const BRANDS = [
  { name: "AbhiBus", logo: null },
  { name: "Akai Space", logo: null },
  { name: "AlgoBharat", logo: null },
  { name: "Algorand Foundation", logo: null },
  { name: "Daytona", logo: null },
  { name: "Devfolio", logo: null },
  { name: "Duality AI", logo: "/brand-logos/duality-ai.webp" },
  { name: "EigenCloud", logo: null },
  { name: "Endless Domain", logo: null },
  { name: "ETHIndia", logo: "/brand-logos/ethindia.webp" },
  { name: "GitHub", logo: null },
  { name: "Google", logo: "/brand-logos/google.webp" },
  { name: "HackCulture", logo: null },
  { name: "KodeMaster AI", logo: null },
  { name: "Logitech", logo: null },
  { name: "Microsoft", logo: null },
  { name: "Microsoft Azure", logo: "/brand-logos/microsoft-azure.webp" },
  { name: "Physics Wallah (PW)", logo: "/brand-logos/physics-wallah.webp" },
  { name: "Polygon", logo: null },
  { name: "Reskill", logo: null },
  { name: "Stellar", logo: null },
  { name: "TON", logo: "/brand-logos/ton.webp" },
  { name: "Unstop", logo: null },
  { name: "Vercel", logo: null },
  { name: "Wormhole", logo: null },
];

function BrandMark({ brand }) {
  if (brand.logo) {
    return (
      <span
        role="img"
        aria-label={brand.name}
        className="inline-block h-24 w-36 shrink-0 opacity-90 transition-opacity duration-300 hover:opacity-100 md:h-32 md:w-44"
        style={{
          backgroundColor: "var(--heading)",
          WebkitMaskImage: `url(${brand.logo})`,
          maskImage: `url(${brand.logo})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }
  return (
    <span className="whitespace-nowrap font-display text-3xl leading-none text-[var(--heading)] md:text-5xl">
      {brand.name}
    </span>
  );
}

export default function Marquee() {
  return (
    <section
      aria-labelledby="brand-strip-title"
      className="relative z-[3] overflow-hidden border-y border-white/10 bg-[#181818] py-8 md:py-12"
    >
      <div className="mx-auto mb-4 flex max-w-[90rem] items-center justify-between gap-4 px-5 md:mb-6 md:px-10">
        <h2 id="brand-strip-title" className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
          Brands at events Genesis has run or partnered on
        </h2>
        <span aria-hidden className="hidden font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)] md:inline">
          {BRANDS.length} brands
        </span>
      </div>
      <VelocityMarquee baseVelocity={-1.6} copies={3} itemClassName="gap-12 pr-12 md:gap-16 md:pr-16">
        {BRANDS.map((brand) => (
          <React.Fragment key={brand.name}>
            <BrandMark brand={brand} />
            <span aria-hidden className="font-display text-2xl text-white/25 md:text-4xl">/</span>
          </React.Fragment>
        ))}
      </VelocityMarquee>
    </section>
  );
}
