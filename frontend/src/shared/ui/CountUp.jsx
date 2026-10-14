import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

// Animated number counter that scrubs to target when scrolled into view.
export default function CountUp({ value = 100, suffix = "", duration = 2, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState("0");

    useEffect(() => {
        if (!inView) return;
        const controls = animate(mv, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                const n = Math.round(latest);
                setDisplay(n.toLocaleString("en-IN"));
            },
        });
        return () => controls.stop();
    }, [inView, value, duration, mv]);

    // Assistive tech reads the final figure; the ticking digits are visual only.
    return (
        <span ref={ref} className={className}>
            <span className="sr-only">
                {value.toLocaleString("en-IN")}
                {suffix}
            </span>
            <span aria-hidden="true">
                {display}
                {suffix}
            </span>
        </span>
    );
}
