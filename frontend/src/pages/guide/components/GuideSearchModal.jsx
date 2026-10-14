import React, { useEffect, useMemo, useRef, useState } from "react";
import { ALL_GUIDE_ARTICLES } from "@/features/guide/guideData";

export default function GuideSearchModal({ isOpen, onClose, onSelectArticle }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const returnFocus = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_GUIDE_ARTICLES;
    return ALL_GUIDE_ARTICLES.filter((art) => {
      const sections = art.content?.sections || [];
      return (
        art.title.toLowerCase().includes(q) ||
        art.desc.toLowerCase().includes(q) ||
        art.categoryTitle.toLowerCase().includes(q) ||
        sections.some((s) => s.title.toLowerCase().includes(q) || (s.text || "").toLowerCase().includes(q))
      );
    });
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Move focus in on open and back to whatever opened it on close.
  useEffect(() => {
    if (isOpen) {
      returnFocus.current = document.activeElement;
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else if (returnFocus.current) {
      returnFocus.current.focus?.();
      returnFocus.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        onSelectArticle(selected.categoryId, selected.slug);
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectArticle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/80 px-4 pt-16 backdrop-blur-md sm:pt-24">
      <button type="button" aria-label="Close search" className="fixed inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the guide"
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden border border-white/20 bg-[#131518] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#181a1f] px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            aria-label="Search guide topics"
            aria-controls="guide-search-results"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, checklists, budgets"
            className="min-h-[44px] flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/50"
          />
          <button type="button" onClick={onClose} className="min-h-[36px] border border-white/15 px-2 font-mono text-[12px] text-white/75 hover:text-white">
            Esc
          </button>
        </div>

        <ul id="guide-search-results" className="max-h-96 divide-y divide-white/5 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="p-8 text-center text-[15px] text-white/60">No guide topics match &ldquo;{query}&rdquo;.</li>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li key={`${item.categoryId}-${item.slug}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectArticle(item.categoryId, item.slug);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition-colors ${
                      isSelected ? "border-l-2 border-[var(--heading)] bg-[var(--heading)]/[0.12]" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="min-w-0 space-y-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[12px] uppercase text-[#c4b5fd]">{item.categoryTitle}</span>
                        <span className="truncate text-[15px] text-white">{item.navTitle || item.title}</span>
                      </span>
                      <span className="block truncate text-[13px] text-white/60">{item.desc}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[12px] text-white/50">{item.readTime}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-white/10 bg-[#0c0d0e] px-4 py-2 font-mono text-[12px] text-white/55">
          <span>↑ ↓ to move, Enter to open</span>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
