import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GUIDE_CATEGORIES } from "@/features/guide/guideData";

function articlePath(categoryId, slug) {
  return categoryId === "introduction" && slug === "overview" ? "/guide" : `/guide/${categoryId}/${slug}`;
}

/** Topic tree. Real links, so every article is crawlable and can open in a new tab. */
export default function GuideSidebar({ currentCatId, currentSlug, onNavigate, onOpenSearch }) {
  const [collapsed, setCollapsed] = useState({});

  return (
    <aside className="flex h-full w-full flex-col bg-[#121214] text-white/90">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4">
        <span className="font-display text-sm uppercase tracking-[0.08em] text-[var(--heading)]">Organiser guide</span>
        <button
          type="button"
          onClick={onOpenSearch}
          className="group flex min-h-[44px] w-full items-center justify-between border border-white/15 bg-white/[0.04] px-3 text-[14px] text-white/75 transition-colors hover:border-white/35 hover:text-white"
        >
          <span>Search the guide</span>
          <kbd className="hidden border border-white/20 px-1.5 py-0.5 font-mono text-[12px] text-white/60 sm:inline">Ctrl K</kbd>
        </button>
      </div>

      <nav aria-label="Guide topics" className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {GUIDE_CATEGORIES.map((cat) => {
          const isCollapsed = collapsed[cat.id];
          const listId = `guide-cat-${cat.id}`;
          return (
            <div key={cat.id} className="space-y-1">
              <button
                type="button"
                aria-expanded={!isCollapsed}
                aria-controls={listId}
                onClick={() => setCollapsed((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                className="flex min-h-[40px] w-full items-center justify-between px-2 text-left font-mono text-[12px] uppercase tracking-[0.14em] text-[#c4b5fd] hover:text-white"
              >
                {cat.title}
                <span aria-hidden className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}>
                  ↓
                </span>
              </button>
              {!isCollapsed ? (
                <ul id={listId} className="ml-3 space-y-0.5 border-l border-white/10 pl-2">
                  {cat.articles.map((art) => {
                    const isActive = cat.id === currentCatId && art.slug === currentSlug;
                    return (
                      <li key={art.slug}>
                        <Link
                          to={articlePath(cat.id, art.slug)}
                          onClick={onNavigate}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex min-h-[36px] items-center justify-between gap-2 px-2.5 py-1.5 text-[14px] transition-colors ${
                            isActive
                              ? "-ml-px border-l-2 border-[var(--heading)] bg-[var(--heading)]/[0.12] text-[var(--heading)]"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{art.navTitle || art.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
