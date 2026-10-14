import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell } from "@widgets/layout";
import { EASE_OUT } from "@shared/motion";
import GuideSidebar from "./components/GuideSidebar";
import GuideToc from "./components/GuideToc";
import GuideContent from "./components/GuideContent";
import GuideSearchModal from "./components/GuideSearchModal";
import { getGuideArticle } from "@/features/guide/guideData";

export default function GuidePage() {
  const { category: paramCategory, slug: paramSlug } = useParams();
  const navigate = useNavigate();
  const isOverview = !paramCategory;
  const activeCategory = paramCategory || "introduction";
  const activeSlug = paramSlug || "overview";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const articleData = getGuideArticle(activeCategory, activeSlug);

  // /guide is the canonical overview; /guide/introduction/overview is a duplicate.
  useEffect(() => {
    if (paramCategory === "introduction" && paramSlug === "overview") {
      navigate("/guide", { replace: true });
    }
  }, [paramCategory, paramSlug, navigate]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelectArticle = (catId, slug) => {
    setIsDrawerOpen(false);
    navigate(catId === "introduction" && slug === "overview" ? "/guide" : `/guide/${catId}/${slug}`);
  };

  let seo;
  if (!articleData) {
    seo = { title: "Guide topic not found | Genesis Hacks", noindex: true };
  } else if (!isOverview) {
    seo = {
      title: `${articleData.article.title} | Genesis Hacks guide`,
      description: articleData.article.desc,
    };
  }

  return (
    <PageShell seo={seo}>
      <div className="mx-auto w-full max-w-[90rem] pt-[120px] md:pt-[132px]">
        {/* Mobile topic + search bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-expanded={isDrawerOpen}
            aria-controls="guide-drawer"
            className="flex min-h-[44px] items-center gap-2 border border-white/15 px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--heading)]"
          >
            Topics
          </button>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex min-h-[44px] items-center gap-2 border border-white/15 px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-white/80"
          >
            Search
          </button>
        </div>

        <div className="relative flex">
          <div className="sticky top-24 hidden h-[calc(100vh-6rem)] w-72 shrink-0 border-r border-white/10 md:block">
            <GuideSidebar
              currentCatId={activeCategory}
              currentSlug={activeSlug}
              onNavigate={() => setIsDrawerOpen(false)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          </div>

          <AnimatePresence>
            {isDrawerOpen ? (
              <div className="fixed inset-0 z-[60] flex md:hidden" id="guide-drawer">
                <motion.button
                  type="button"
                  aria-label="Close topics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setIsDrawerOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Guide topics"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col bg-[#121214] shadow-2xl"
                >
                  <div className="flex justify-end border-b border-white/10 p-3">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="min-h-[44px] px-4 font-mono text-[12px] uppercase tracking-[0.14em] text-white/80"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <GuideSidebar
                      currentCatId={activeCategory}
                      currentSlug={activeSlug}
                      onNavigate={() => setIsDrawerOpen(false)}
                      onOpenSearch={() => {
                        setIsDrawerOpen(false);
                        setIsSearchOpen(true);
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <div className="flex min-w-0 flex-1 justify-center">
            {articleData ? (
              <GuideContent
                key={`${activeCategory}/${activeSlug}`}
                category={articleData.category}
                article={articleData.article}
              />
            ) : (
              <div className="space-y-6 px-5 py-24 text-center">
                <h1 className="font-display text-4xl text-[var(--heading)]">Topic not found</h1>
                <p className="text-base text-[var(--text-dim)]">This guide page does not exist or has moved.</p>
                <Link to="/guide" className="btn-cinema">
                  Back to the guide
                </Link>
              </div>
            )}
          </div>

          <GuideToc key={`toc-${activeCategory}/${activeSlug}`} sections={articleData?.article?.content?.sections || []} />
        </div>
      </div>

      <GuideSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectArticle={handleSelectArticle} />
    </PageShell>
  );
}
