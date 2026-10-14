import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  );
}

/**
 * Paragraph whose words light up one by one as it scrolls through the
 * viewport. Readers that skip scroll (and screen readers) get full text.
 */
export default function ScrollHighlight({
  text,
  as: Tag = "p",
  className = "",
  offset = ["start 85%", "end 45%"],
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
    layoutEffect: false,
  });
  const words = String(text).split(" ");

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const start = i / words.length;
          const end = Math.min(1, start + 1.5 / words.length);
          return (
            <React.Fragment key={i}>
              <Word progress={scrollYProgress} range={[start, end]}>
                {w}
              </Word>
              {i < words.length - 1 ? " " : null}
            </React.Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
