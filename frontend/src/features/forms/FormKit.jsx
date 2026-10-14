import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE_OUT, Magnetic } from "@shared/motion";

/**
 * Shared building blocks for every Genesis form.
 *
 * Forms sit on their own dark card, so these use a fixed dark palette and
 * stay legible whatever band the form is placed on. Every control has a
 * visible <label> (audit A04), a 2px focus ring (A05), and errors are tied
 * to fields with aria-invalid + aria-describedby (A06).
 */

export const FORM_CARD =
  "relative overflow-hidden border border-white/15 bg-[#121214] p-5 text-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:p-8 md:p-10";

const BOX =
  "peer block w-full border bg-white/[0.035] px-4 pb-2.5 pt-7 text-base text-white outline-none transition-[border-color,background-color] duration-300 placeholder:text-transparent hover:border-white/35 focus:border-[#e2efba] focus:bg-white/[0.06] disabled:opacity-60";

const FLOAT_LABEL =
  "pointer-events-none absolute left-4 top-2.5 origin-left font-mono text-[12px] uppercase tracking-[0.14em] text-white/70 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:font-sans peer-placeholder-shown:text-[16px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:font-mono peer-focus:text-[12px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-[#e2efba]";

function errorId(id) {
  return `${id}-error`;
}

function borderFor(error) {
  return error ? "border-[#ff9b9b]" : "border-white/15";
}

export function FieldError({ id, error }) {
  if (!error) return null;
  return (
    <p id={errorId(id)} className="mt-2 inline-flex items-start gap-2 text-[14px] leading-snug text-[#ffb4b4]">
      <span aria-hidden className="mt-[0.35em] h-1.5 w-1.5 shrink-0 bg-[#ff9b9b]" />
      {error}
    </p>
  );
}

/** Text input or textarea with a label that floats up on focus or input. */
export function FloatingField({
  id,
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  as = "input",
  type = "text",
  rows = 5,
  hint,
  className = "",
  ...rest
}) {
  const Control = as;
  const describedBy = [error ? errorId(id) : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
      <div className="relative">
        <Control
          id={id}
          name={name}
          type={as === "input" ? type : undefined}
          rows={as === "textarea" ? rows : undefined}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy || undefined}
          className={`${BOX} ${borderFor(error)} ${as === "textarea" ? "min-h-[9rem] resize-y" : "min-h-[3.75rem]"}`}
          {...rest}
        />
        <label htmlFor={id} className={FLOAT_LABEL}>
          {label}
          {required ? <span aria-hidden> *</span> : null}
        </label>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#e2efba] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
        />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[13px] leading-snug text-white/65">
          {hint}
        </p>
      ) : null}
      <FieldError id={id} error={error} />
    </div>
  );
}

/** Native select with a fixed small label (selects have no placeholder state). */
export function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  className = "",
  ...rest
}) {
  return (
    <div className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId(id) : undefined}
          className={`${BOX} ${borderFor(error)} min-h-[3.75rem] cursor-pointer appearance-none pr-10`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#16161b] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white/70 peer-focus:text-[#e2efba]"
        >
          {label}
          {required ? <span aria-hidden> *</span> : null}
        </label>
        <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
          ↓
        </span>
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}

/**
 * Checkbox or radio options rendered as toggle chips. The real inputs stay
 * in the DOM (visually hidden), so keyboard and screen reader use is native.
 */
export function ChoiceGroup({
  id,
  legend,
  name,
  type = "checkbox",
  options,
  value,
  onChange,
  error,
  required = false,
  hint,
  className = "",
}) {
  const selected = type === "checkbox" ? value || [] : value;
  const toggle = (optValue) => {
    if (type === "checkbox") {
      const next = selected.includes(optValue)
        ? selected.filter((v) => v !== optValue)
        : [...selected, optValue];
      onChange(next);
    } else {
      onChange(optValue);
    }
  };
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={[error ? errorId(id) : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined}
      className={`min-w-0 focus:outline-none ${className}`}
    >
      <legend className="mb-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white/70">
        {legend}
        {required ? <span aria-hidden> *</span> : null}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 mb-3 text-[13px] leading-snug text-white/65">
          {hint}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = type === "checkbox" ? selected.includes(opt.value) : selected === opt.value;
          const inputId = `${id}-${opt.value}`;
          return (
            <span key={opt.value} className="relative">
              <input
                id={inputId}
                type={type}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className={`flex min-h-[44px] cursor-pointer select-none items-center gap-2 border px-4 py-2 text-[15px] transition-all duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#e2efba] ${
                  checked
                    ? "border-[#e2efba] bg-[#e2efba] text-[#181818]"
                    : "border-white/20 bg-white/[0.03] text-white/85 hover:border-white/45 hover:text-white"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 transition-colors ${
                    checked ? "bg-[#181818]" : type === "radio" ? "rounded-full border border-white/50" : "border border-white/50"
                  }`}
                />
                {opt.label}
              </label>
            </span>
          );
        })}
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

export const HONEYPOT_NAME = "company_website_confirm";

/**
 * Spam trap. People never see or reach it (off-screen, aria-hidden, out of
 * the tab order, autocomplete off); bots that fill every field do. The
 * server rejects submissions where it is not empty.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={`${HONEYPOT_NAME}-field`}>Leave this field empty</label>
      <input
        id={`${HONEYPOT_NAME}-field`}
        type="text"
        name={HONEYPOT_NAME}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/** Read the honeypot from a submit event. Call before any await. */
export function readHoneypot(event) {
  const field = event?.currentTarget?.elements?.namedItem?.(HONEYPOT_NAME);
  return field && "value" in field ? field.value : "";
}

/** Collection notice shown on every form (audit G03). */
export function FormNotice({ className = "" }) {
  return (
    <p className={`max-w-[46ch] text-[13px] leading-relaxed text-white/70 ${className}`}>
      We use these details only to reply to you. See our{" "}
      <Link to="/privacy" className="text-white underline underline-offset-4 hover:text-[#e2efba]">
        Privacy policy
      </Link>
      .
    </p>
  );
}

/** Summary message announced to screen readers when a submit fails. */
export function FormAlert({ message, children }) {
  if (!message) return null;
  return (
    <div role="alert" className="border border-[#ff9b9b]/40 bg-[#2a1416] p-4 text-[15px] leading-relaxed text-[#ffc9c9]">
      <p>{message}</p>
      {children}
    </div>
  );
}

export function SubmitButton({ submitting, label, submittingLabel = "Sending…" }) {
  return (
    <Magnetic strength={0.2}>
      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting || undefined}
        data-cursor
        data-cursor-label="Send"
        className="btn-cinema w-full justify-center disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        <span>{submitting ? submittingLabel : label}</span>
        {submitting ? (
          <span aria-hidden className="inline-flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 bg-current"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </span>
        ) : (
          <span aria-hidden>→</span>
        )}
      </button>
    </Magnetic>
  );
}

/** Staggered confirmation panel. Focus moves here so the result is announced. */
export function SuccessPanel({ title, body, onReset, resetLabel = "Send another", children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  const item = {
    hidden: { opacity: 0, y: 18 },
    shown: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      initial="hidden"
      animate="shown"
      transition={{ staggerChildren: 0.09 }}
      className={`${FORM_CARD} focus:outline-none`}
    >
      <motion.div variants={item} transition={{ duration: 0.7, ease: EASE_OUT }} className="grid w-fit grid-cols-3 gap-1" aria-hidden>
        {[1, 0, 1, 0, 1, 1, 1, 1, 0].map((on, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: on ? 1 : 0.35 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE_OUT }}
            className={`block h-3 w-3 ${on ? "bg-[#e2efba]" : "bg-white/15"}`}
          />
        ))}
      </motion.div>
      <motion.h3 variants={item} transition={{ duration: 0.7, ease: EASE_OUT }} className="mt-8 font-display text-3xl text-[#e2efba] md:text-4xl">
        {title}
      </motion.h3>
      <motion.p variants={item} transition={{ duration: 0.7, ease: EASE_OUT }} className="mt-4 max-w-[48ch] text-base leading-relaxed text-white/80">
        {body}
      </motion.p>
      {children ? (
        <motion.div variants={item} transition={{ duration: 0.7, ease: EASE_OUT }} className="mt-6">
          {children}
        </motion.div>
      ) : null}
      {onReset ? (
        <motion.div variants={item} transition={{ duration: 0.7, ease: EASE_OUT }}>
          <button type="button" onClick={onReset} className="btn-ghost mt-8">
            {resetLabel}
          </button>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

/** Move keyboard focus to the first field that failed validation. */
export function focusFirstInvalid(errors, order) {
  const first = order.find((key) => errors[key]);
  if (!first) return;
  const el = document.getElementById(first);
  if (el) {
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 0.8 });
    else window.scrollTo({ top, behavior: "smooth" });
  }
}

export function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function fileExtension(name) {
  return String(name).split(".").pop().toLowerCase();
}
