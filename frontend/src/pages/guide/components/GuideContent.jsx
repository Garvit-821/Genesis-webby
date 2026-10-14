import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CONTACT } from "@shared/config/site";
import { Reveal, SplitText } from "@shared/motion";
import { getAdjacentArticles } from "@/features/guide/guideData";

const CALLOUT_STYLES = {
  warning: "border-[#ff9b9b]/40 bg-[#2a1416] text-[#ffd0d0]",
  important: "border-amber-300/40 bg-amber-300/[0.08] text-amber-100",
  tip: "border-[#e2efba]/40 bg-[#e2efba]/[0.08] text-[#eef5d6]",
  note: "border-[#c4b5fd]/40 bg-[#c4b5fd]/[0.08] text-[#e7e1ff]",
};

function articlePath(categoryId, slug) {
  return categoryId === "introduction" && slug === "overview" ? "/guide" : `/guide/${categoryId}/${slug}`;
}

export default function GuideContent({ category, article }) {
  const [checked, setChecked] = useState({});

  if (!article || !category) return null;
  const { prev, next } = getAdjacentArticles(category.id, article.slug);

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <article className="min-w-0 max-w-3xl flex-1 space-y-10 px-5 py-10 text-white/90 sm:px-8 md:py-14">
      <nav aria-label="Breadcrumb" className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/guide" className="hover:text-white">Guide</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-[#c4b5fd]">{category.title}</li>
        </ol>
      </nav>

      <header className="space-y-5 border-b border-white/10 pb-8">
        <SplitText
          as="h1"
          text={article.title}
          trigger="mount"
          stagger={0.04}
          className="font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] text-[var(--heading)]"
        />
        {article.content?.subtitle ? (
          <p className="text-lg leading-relaxed text-white/75">{article.content.subtitle}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] uppercase tracking-[0.12em] text-white/60">
          <span>Updated {article.lastUpdated}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
          <span aria-hidden>·</span>
          <button type="button" onClick={copyPageLink} className="min-h-[32px] uppercase underline-offset-4 hover:text-white hover:underline">
            Copy link
          </button>
        </div>
        <p className="text-[13px] leading-relaxed text-white/60">
          Structure adapted from the{" "}
          <a href="https://guide.mlh.io" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
            MLH Hackathon Organizer Guide (guide.mlh.io)
          </a>
          .
        </p>
      </header>

      {article.content?.heroText ? (
        <Reveal className="border-l-2 border-[var(--heading)] pl-5 text-lg leading-relaxed text-white/90">
          {article.content.heroText}
        </Reveal>
      ) : null}

      <div className="space-y-12">
        {article.content?.sections?.map((sec) => (
          <Reveal as="section" key={sec.id} id={sec.id} aria-labelledby={`${sec.id}-title`} className="scroll-mt-32 space-y-4">
            <h2 id={`${sec.id}-title`} className="group flex items-center gap-2 font-display text-2xl leading-tight text-[var(--heading)]">
              {sec.title}
              <a
                href={`#${sec.id}`}
                aria-label={`Link to ${sec.title}`}
                className="font-mono text-sm text-white/40 opacity-0 transition-opacity hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
              >
                #
              </a>
            </h2>

            {sec.text ? <p className="whitespace-pre-line text-base leading-relaxed text-white/80 sm:text-[17px]">{sec.text}</p> : null}

            {sec.callout ? (
              <div className={`space-y-1 border p-4 text-[15px] leading-relaxed ${CALLOUT_STYLES[sec.callout.type] || CALLOUT_STYLES.note}`}>
                <div className="font-mono text-[12px] uppercase tracking-[0.14em]">{sec.callout.title}</div>
                <div>{sec.callout.text}</div>
              </div>
            ) : null}

            {sec.checklist ? (
              <fieldset className="space-y-2 border border-white/10 bg-white/[0.03] p-4">
                <legend className="px-1 font-mono text-[12px] uppercase tracking-[0.14em] text-[#c4b5fd]">Checklist</legend>
                {sec.checklist.map((item) => {
                  const id = `${sec.id}-${item.id}`;
                  const isChecked = Boolean(checked[id]);
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#e2efba]"
                      />
                      <label htmlFor={id} className={`cursor-pointer text-[15px] leading-relaxed ${isChecked ? "text-white/45 line-through" : "text-white/90"}`}>
                        {item.text}
                      </label>
                    </div>
                  );
                })}
              </fieldset>
            ) : null}
          </Reveal>
        ))}
      </div>

      <p className="border-t border-white/10 pt-8 text-[15px] text-white/70">
        Something missing or wrong?{" "}
        <a href={`mailto:${CONTACT.email}`} className="text-white underline underline-offset-4">
          Email {CONTACT.email}
        </a>
        .
      </p>

      <nav aria-label="Guide pages" className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            to={articlePath(prev.categoryId, prev.slug)}
            className="group space-y-1 border border-white/10 p-4 transition-colors hover:border-white/30 hover:bg-white/[0.04]"
          >
            <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">← Previous</span>
            <span className="block truncate text-base text-white group-hover:text-[var(--heading)]">{prev.navTitle || prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={articlePath(next.categoryId, next.slug)}
            className="group space-y-1 border border-white/10 p-4 text-right transition-colors hover:border-white/30 hover:bg-white/[0.04]"
          >
            <span className="block font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">Next →</span>
            <span className="block truncate text-base text-white group-hover:text-[var(--heading)]">{next.navTitle || next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
