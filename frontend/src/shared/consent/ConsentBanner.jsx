import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  getConsent,
  setConsent,
  startAnalyticsIfAllowed,
  stopAnalytics,
  CONSENT_EVENT,
  CONSENT_OPEN_EVENT,
} from "./consent";

/**
 * Consent bar. Analytics stay off until Accept, and the footer's
 * "Cookie settings" reopens it so a choice can be changed as easily as it
 * was given.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const existing = getConsent();
    setCurrent(existing?.status || null);
    if (!existing) setVisible(true);
    else if (existing.status === "accepted") startAnalyticsIfAllowed();

    const onChange = () => setCurrent(getConsent()?.status || null);
    const onOpen = () => setVisible(true);
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const accept = () => {
    setConsent("accepted");
    setVisible(false);
    startAnalyticsIfAllowed();
  };

  const reject = () => {
    setConsent("rejected");
    setVisible(false);
    stopAnalytics();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-label="Cookie and analytics consent"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur-xl md:px-8"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-white/80">
              We use optional analytics (PostHog) to see which pages help. The site works fully without them.
              {current ? ` Your current choice: ${current}.` : ""} See our{" "}
              <Link to="/privacy" className="text-[var(--heading)] underline underline-offset-2">
                Privacy policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={reject}
                className="min-h-[44px] border border-white/30 px-5 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-white/85 transition-colors hover:border-white/60 hover:text-white"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={accept}
                className="min-h-[44px] bg-white px-5 py-2 font-mono text-[12px] uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
