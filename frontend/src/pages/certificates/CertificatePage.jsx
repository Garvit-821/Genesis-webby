import React, { useEffect, useRef, useState } from "react";
import InnerPage from "../shared/InnerPage";

const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-60";

const LABEL_CLASS =
  "block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2";

// Name placement is in template pixels (template is 2000 x 1414).
const EVENT = {
  slug: "hackers-occupied-pune",
  title: "Hackers Occupied Pune",
  template: "/certificates/hackers-occupied-pune.png",
  name: { x: 1000, baseline: 860, maxWidth: 1100, fontSize: 88, minFontSize: 48 },
};

const ERRORS = {
  not_found:
    "We couldn't find a participant with that email and phone number. Use the same details you registered with.",
  validation_failed: "Enter a valid email and a 10-digit phone number.",
  too_many_attempts: "Too many attempts. Please wait a few minutes and try again.",
};

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

export default function CertificatePage() {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | ready
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => () => downloadUrl && URL.revokeObjectURL(downloadUrl), [downloadUrl]);

  useEffect(() => {
    if (status !== "ready" || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    renderCertificate(canvas, name)
      .then(
        () =>
          new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
      )
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
    setStatus("verifying");
    try {
      const res = await fetch("/api/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ event: EVENT.slug, email, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(ERRORS[data.error] || "Verification failed. Please try again in a moment.");
        setStatus("idle");
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
  }

  const fileName = `Genesis-${EVENT.slug}-certificate-${name.replace(/[^a-z0-9]+/gi, "-")}.png`;

  return (
    <InnerPage eyebrow={`${EVENT.title} · Certificates`} title="Get your certificate">
      {status !== "ready" ? (
        <>
          <p className="max-w-2xl">
            Took part in {EVENT.title}? Verify with the email and phone number you registered
            with and download your certificate of participation.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-10 max-w-2xl rounded-3xl border border-white/15 bg-[#0d0d11] p-6 sm:p-10 space-y-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="cert-email" className={LABEL_CLASS}>
                  Registered email
                </label>
                <input
                  id="cert-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={status === "verifying"}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="cert-phone" className={LABEL_CLASS}>
                  Registered phone
                </label>
                <input
                  id="cert-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={status === "verifying"}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}
            <button type="submit" className="btn-ghost" disabled={status === "verifying"}>
              {status === "verifying" ? "Verifying…" : "Verify & generate"}
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-6">
          <p>
            Verified. Congratulations, <span className="text-white">{name}</span>. Here&apos;s your
            certificate.
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <canvas
            ref={canvasRef}
            className="block w-full h-auto rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            aria-label={`Certificate of participation for ${name}`}
          />
          <div className="flex flex-wrap gap-4">
            {downloadUrl ? (
              <a href={downloadUrl} download={fileName} className="btn-ghost">
                Download certificate
              </a>
            ) : (
              <span className="btn-ghost opacity-60">Preparing…</span>
            )}
            <button type="button" onClick={reset} className="btn-ghost">
              Verify someone else
            </button>
          </div>
        </div>
      )}
    </InnerPage>
  );
}
