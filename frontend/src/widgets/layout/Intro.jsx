import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "/images/logo.png";
const SEEN_KEY = "genesis_hacks_intro_seen";
// How long the logo holds before the curtains split open.
const HOLD_MS = 850;
const CURTAIN_EASE = [0.7, 0, 0.3, 1];

function shouldPlay() {
    try {
        if (sessionStorage.getItem(SEEN_KEY)) return false;
    } catch {
        /* storage blocked — still play once */
    }
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Variants propagate to children, so AnimatePresence waits for the
// curtains to finish opening before it unmounts the overlay.
const content = {
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: "easeIn" } },
};
const curtainLeft = {
    exit: { x: "-100%", transition: { duration: 0.75, ease: CURTAIN_EASE } },
};
const curtainRight = {
    exit: { x: "100%", transition: { duration: 0.75, ease: CURTAIN_EASE } },
};

export default function Intro({ onDone }) {
    const [show, setShow] = useState(shouldPlay);

    useEffect(() => {
        if (!show) {
            onDone?.();
            return undefined;
        }
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
            /* ignore */
        }

        const html = document.documentElement;
        const prev = html.style.overflow;
        html.style.overflow = "hidden";

        const t = setTimeout(() => {
            html.style.overflow = prev;
            setShow(false);
        }, HOLD_MS);

        return () => {
            clearTimeout(t);
            html.style.overflow = prev;
        };
        // Runs once on mount; `show` only ever flips true → false.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AnimatePresence onExitComplete={() => onDone?.()}>
            {show && (
                <motion.div
                    key="intro"
                    className="fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden"
                    exit="exit"
                    aria-hidden="true"
                >
                    <motion.div
                        variants={curtainLeft}
                        className="absolute inset-y-0 left-0 w-1/2 bg-[var(--bg)]"
                    />
                    <motion.div
                        variants={curtainRight}
                        className="absolute inset-y-0 right-0 w-1/2 bg-[var(--bg)]"
                    />

                    <motion.div
                        variants={content}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <motion.img
                            src={LOGO_URL}
                            alt=""
                            className="h-20 w-20 md:h-28 md:w-28"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-5 font-display text-3xl tracking-tight text-[var(--heading)] md:text-5xl"
                        >
                            Genesis
                        </motion.div>
                        <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: HOLD_MS / 1000, ease: "easeInOut" }}
                                style={{
                                    transformOrigin: "left center",
                                    backgroundImage: "linear-gradient(90deg, var(--brand), var(--heading))",
                                }}
                                className="h-full"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
