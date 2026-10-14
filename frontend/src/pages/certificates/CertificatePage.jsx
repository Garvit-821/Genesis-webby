import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { DELHI, PUNE } from "@shared/config/site";
import { EASE_OUT, Magnetic } from "@shared/motion";
import "./certificates.css";

const INPUT_CLASS =
  "h-12 w-full border border-white/25 bg-black/40 px-4 text-base text-white placeholder:text-white/50 transition-colors focus:border-[var(--heading)] focus:outline-none disabled:opacity-60 aria-[invalid=true]:border-[#ff9b9b]";

const LABEL_CLASS = "mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-white/75";

// Name placement is in template pixels (template is 2000 x 1414).
const EVENT = {
  slug: PUNE.slug,
  title: PUNE.name,
  template: "/certificates/hackers-occupied-pune.png",
  name: { x: 1000, baseline: 860, maxWidth: 1100, fontSize: 88, minFontSize: 48 },
};

// The API answers every failed match the same way, so the form never
// confirms who registered (audit D11). Throttling gets its own message.
const ERRORS = {
  generic: "We could not verify those details. Use the same email and phone number you registered with.",
  invalid: "Enter a valid email and a 10-digit phone number.",
  throttled: "Too many attempts. Please try again in a few minutes.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (v) => String(v || "").replace(/\D/g, "").slice(-10);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("template_failed"));
    img.src = src;
  });
}

async function renderCertificate(canvas, name) {
  const { x, baseline, maxWidth, fontSize, minFontSize } = EVENT.name;
  const [img] = await Promise.all([
    loadImage(EVENT.template),
    document.fonts?.load(`${fontSize}px Aeonik`).catch(() => null),
  ]);

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  let size = fontSize;
  ctx.font = `${size}px Aeonik, sans-serif`;
  while (ctx.measureText(name).width > maxWidth && size > minFontSize) {
    size -= 2;
    ctx.font = `${size}px Aeonik, sans-serif`;
  }
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(name, x, baseline, maxWidth);
}

/** A burst of lime pixels when verification succeeds. */
function PixelBurst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 90 + ((i * 37) % 80);
        return {
          dx: `${Math.round(Math.cos(angle) * dist)}px`,
          dy: `${Math.round(Math.sin(angle) * dist)}px`,
          size: 6 + (i % 3) * 3,
          delay: (i % 5) * 30,
        };
      }),
    [],
  );
  return (
    <span aria-hidden className="cert-burst pointer-events-none absolute left-1/2 top-1/2">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute block bg-[var(--heading)]"
          style={{ width: b.size, height: b.size, "--dx": b.dx, "--dy": b.dy, animationDelay: `${b.delay}ms` }}
        />
      ))}
    </span>
  );
}

export default function CertificatePage() {
  const canvasRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const headingRef = useRef(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | ready
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState({ email: false, phone: false });
  const [name, setName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => downloadUrl && URL.revokeObjectURL(downloadUrl), [downloadUrl]);

  useEffect(() => {
    if (status !== "ready" || !canvasRef.current) return undefined;
    let cancelled = false;
    const canvas = canvasRef.current;
    headingRef.current?.focus();
    renderCertificate(canvas, name)
      .then(() => new Promise((resolve) => canvas.toBlob(resolve, "image/png")))
      .then((blob) => {
        if (!cancelled && blob) setDownloadUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't load the certificate template. Please refresh and try again.");
          setStatus("idle");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [status, name]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const badEmail = !EMAIL_RE.test(email.trim());
    const badPhone = digits(phone).length !== 10;
    setInvalid({ email: badEmail, phone: badPhone });
    if (badEmail || badPhone) {
      setError(ERRORS.invalid);
      (badEmail ? emailRef : phoneRef).current?.focus();
      return;
    }

    setStatus("verifying");
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ event: EVENT.slug, email: email.trim(), phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429 || data.error === "too_many_attempts") {
        setError(ERRORS.throttled);
        setStatus("idle");
        return;
      }
      if (!res.ok || !data.ok) {
        setError(data.message || ERRORS.generic);
        setStatus("idle");
        emailRef.current?.focus();
        return;
      }
      setName(data.name);
      setStatus("ready");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("idle");
    }
  }

  function reset() {
    setStatus("idle");
    setName("");
    setDownloadUrl("");
    setEmail("");
    setPhone("");
    setError("");
  }

  const fileName = `Genesis-${EVENT.slug}-certificate-${name.replace(/[^a-z0-9]+/gi, "-")}.png`;
  const verifying = status === "verifying";

  return (
    <PageShell>
      <PageHero
        eyebrow={`${EVENT.title} · Certificates`}
        title="Download your certificate"
        lines={["Download your", "certificate"]}
        intro={`Took part in ${EVENT.title} on ${PUNE.when}? Verify with the email and phone number you registered with.`}
      />

      <section className="mx-auto max-w-[90rem] px-5 pb-24 md:px-12 md:pb-32">
        <AnimatePresence mode="wait">
          {status !== "ready" ? (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="max-w-2xl border border-white/15 bg-[#121214] p-6 sm:p-10"
              aria-describedby="cert-notice"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="cert-email" className={LABEL_CLASS}>
                    Registered email
                  </label>
                  <input
                    ref={emailRef}
                    id="cert-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={verifying}
                    aria-invalid={invalid.email}
                    aria-describedby={error ? "cert-error" : undefined}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="cert-phone" className={LABEL_CLASS}>
                    Registered phone
                  </label>
                  <input
                    ref={phoneRef}
                    id="cert-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    disabled={verifying}
                    aria-invalid={invalid.phone}
                    aria-describedby={error ? "cert-error" : undefined}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {error ? (
                <p id="cert-error" role="alert" className="field-error mt-5">
                  {error}
                </p>
              ) : null}

              <p id="cert-notice" className="mt-6 text-[14px] leading-relaxed text-white/70">
                We use these two details only to find your registration and put your name on the certificate. They are
                not saved. See the{" "}
                <Link to="/privacy" className="text-[var(--heading)] underline underline-offset-2">
                  Privacy policy
                </Link>
                .
              </p>

              <button type="submit" className="btn-cinema mt-8" disabled={verifying}>
                {verifying ? "Checking…" : "Verify and create certificate"}
                <span aria-hidden>→</span>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <PixelBurst />
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="relative font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] text-[var(--heading)] focus:outline-none"
                >
                  Verified. Well done, {name}.
                </h2>
              </div>
              {error ? (
                <p role="alert" className="field-error">
                  {error}
                </p>
              ) : null}
              <motion.div
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT }}
                className="max-w-5xl border border-white/10"
              >
                <canvas ref={canvasRef} className="block h-auto w-full" role="img" aria-label={`Certificate of participation for ${name}`} />
              </motion.div>
              <div className="flex flex-wrap items-center gap-4">
                {downloadUrl ? (
                  <Magnetic strength={0.25}>
                    <a href={downloadUrl} download={fileName} className="btn-cinema">
                      Download certificate <span aria-hidden>↓</span>
                    </a>
                  </Magnetic>
                ) : (
                  <span className="btn-ghost opacity-70" aria-live="polite">
                    Preparing your file…
                  </span>
                )}
                <button type="button" onClick={reset} className="btn-ghost">
                  Verify someone else
                </button>
                <Link to={PUNE.path} className="inline-flex min-h-[44px] items-center px-2 text-[15px] text-white/80 underline-offset-4 hover:text-white hover:underline">
                  Back to the Pune recap
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          to={DELHI.path}
          className="group mt-20 flex max-w-5xl flex-col justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center"
        >
          <span>
            <span className="block font-mono text-[12px] uppercase tracking-[0.16em] text-white/65">Next up</span>
            <span className="mt-2 block font-display text-3xl leading-none text-white group-hover:text-[var(--heading)]">
              {DELHI.name} {DELHI.edition}
            </span>
          </span>
          <span className="text-[15px] text-white/75">
            {DELHI.where} · {DELHI.when} <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </section>
    </PageShell>
  );
}
