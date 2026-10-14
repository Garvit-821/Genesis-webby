import React from "react";
import { PageShell, PageHero } from "@widgets/layout";

/**
 * Inner page: shared chrome, animated hero, then the page body.
 */
export default function InnerPage({
  eyebrow = "Genesis",
  title,
  lines,
  intro,
  children,
  cta,
  seo,
}) {
  return (
    <PageShell seo={seo}>
      <PageHero eyebrow={eyebrow} title={title} lines={lines} intro={intro} />
      <section className="mx-auto max-w-[90rem] px-5 pb-24 md:px-12 md:pb-32">
        <div className="w-full text-base leading-relaxed text-[var(--text-dim)] md:text-lg">
          {children}
        </div>
        {cta ? (
          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
            {cta}
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
