import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "./ease";

/**
 * Masked word/char reveal that stays readable to assistive tech.
 *
 * Screen readers get the plain sentence once (sr-only); the animated
 * glyphs are aria-hidden, so headings never read as run-together letters
 * (audit A02).
 *
 * `lines` lets a heading break where the design wants it. `renderChar`
 * can restyle single characters (the Gridular-letter-per-word motif).
 * `active` overrides the trigger (e.g. wait for the intro curtain).
 */
export default function SplitText({
  as: Tag = "span",
  text,
  lines,
  by = "word",
  className = "",
  lineClassName = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.045,
  duration = 1.1,
  trigger = "view",
  active,
  once = true,
  renderChar,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const play = active ?? (trigger === "mount" || inView);
  const content = lines && lines.length ? lines : [text];
  const plain = content.join(" ");

  let unit = 0;

  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true" className="contents">
        {content.map((line, li) => {
          const words = String(line).split(" ");
          return (
            <React.Fragment key={`l-${li}`}>
            {li > 0 ? " " : null}
            <span className={`block ${lineClassName}`}>
              {words.map((word, wi) => {
                const wordIndex = unit;
                if (by === "word") unit += 1;
                return (
                  <React.Fragment key={`w-${li}-${wi}`}>
                    <span
                      className={`relative inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top ${wordClassName}`}
                    >
                      {by === "word" ? (
                        <motion.span
                          className="inline-block will-change-transform"
                          initial={{ y: "115%", rotate: 4 }}
                          animate={play ? { y: "0%", rotate: 0 } : undefined}
                          transition={{
                            duration,
                            delay: delay + wordIndex * stagger,
                            ease: EASE_OUT,
                          }}
                        >
                          {renderChar
                            ? word.split("").map((ch, ci) => (
                                <React.Fragment key={ci}>
                                  {renderChar(ch, ci, word, li, wi)}
                                </React.Fragment>
                              ))
                            : word}
                        </motion.span>
                      ) : (
                        word.split("").map((ch, ci) => {
                          const i = unit;
                          unit += 1;
                          return (
                            <motion.span
                              key={ci}
                              className="inline-block will-change-transform"
                              initial={{ y: "115%" }}
                              animate={play ? { y: "0%" } : undefined}
                              transition={{
                                duration,
                                delay: delay + i * stagger,
                                ease: EASE_OUT,
                              }}
                            >
                              {renderChar ? renderChar(ch, ci, word, li, wi) : ch}
                            </motion.span>
                          );
                        })
                      )}
                    </span>
                    {wi < words.length - 1 ? " " : null}
                  </React.Fragment>
                );
              })}
            </span>
            </React.Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
