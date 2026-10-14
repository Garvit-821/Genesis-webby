import React from "react";
import { Link } from "react-router-dom";
import { CONTACT } from "@shared/config/site";
import { Magnetic, Reveal, SplitText } from "@shared/motion";

/**
 * Form section for the Partner and Collaborate pages: short context and
 * direct contact details on the left (sticky on desktop), the form on the
 * right. Renders inside a PageShell.
 */
export default function InquiryPageLayout({
  id,
  eyebrow,
  title,
  lines,
  intro,
  points = [],
  altLink,
  children,
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative scroll-mt-28 border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[90rem] items-start gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:sticky lg:top-32 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
            <span className="overline">{eyebrow}</span>
          </div>
          <SplitText
            as="h2"
            id={`${id}-title`}
            text={title}
            lines={lines}
            className="font-display text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.9] text-[var(--heading)]"
          />
          {intro ? <p className="max-w-[46ch] text-lg leading-relaxed text-[var(--text-dim)]">{intro}</p> : null}

          {points.length ? (
            <ul className="space-y-3 border-t border-[var(--border)] pt-6">
              {points.map((point, i) => (
                <Reveal as="li" key={point} delay={i * 0.06} className="flex gap-4 text-base text-[var(--text-dim)]">
                  <span className="font-mono text-[12px] leading-7 text-[var(--heading)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-7">{point}</span>
                </Reveal>
              ))}
            </ul>
          ) : null}

          <div className="space-y-1 border-t border-[var(--border)] pt-6">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Prefer to talk?</p>
            <Magnetic strength={0.15}>
              <a href={`mailto:${CONTACT.email}`} className="link-draw inline-flex min-h-[44px] items-center font-sans text-xl text-[var(--heading)]">
                {CONTACT.email}
              </a>
            </Magnetic>
            <a href={CONTACT.phoneHref} className="flex min-h-[44px] w-fit items-center text-lg text-[var(--text)] underline-offset-4 hover:underline">
              {CONTACT.phone}
            </a>
            <p className="pt-1 text-[15px] text-[var(--text-dim)]">We reply {CONTACT.replyTime}.</p>
          </div>

          {altLink ? (
            <p className="text-[15px] text-[var(--text-dim)]">
              {altLink.prefix}{" "}
              <Link to={altLink.to} className="text-[var(--heading)] underline underline-offset-4">
                {altLink.label}
              </Link>
            </p>
          ) : null}
        </div>

        <div className="lg:col-span-7">{children}</div>
      </div>
    </section>
  );
}
