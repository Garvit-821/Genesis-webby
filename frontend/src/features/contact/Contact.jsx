import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LANDING } from "@shared/constants/testIds";
import { CONTACT, DELHI, SOCIALS } from "@shared/config/site";
import { Magnetic, Reveal, SplitText } from "@shared/motion";
import { submitFormToSheets } from "@shared/services/formSubmissionService";
import {
  FORM_CARD,
  FloatingField,
  FormAlert,
  FormNotice,
  Honeypot,
  SelectField,
  SubmitButton,
  SuccessPanel,
  focusFirstInvalid,
  readHoneypot,
} from "@/features/forms/FormKit";
import { buildMailtoHref, isValidEmail } from "./submitContactLead";

/** Brands first: the audience this page exists for (audit P05). */
const ROLE_OPTIONS = [
  { value: "brand", label: "Company / brand" },
  { value: "student", label: "Student or campus community" },
  { value: "organiser", label: "Organiser of a hackathon" },
  { value: "other", label: "Other" },
];

const EMPTY = { name: "", email: "", role: "brand", message: "" };
const ORDER = ["contact-name", "contact-email", "contact-message"];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors["contact-name"] = "Tell us your name.";
  if (!form.email.trim()) errors["contact-email"] = "Add an email so we can reply.";
  else if (!isValidEmail(form.email)) errors["contact-email"] = "That email address does not look right.";
  if (!form.message.trim()) errors["contact-message"] = "Write a short message.";
  return errors;
}

/**
 * Contact section, used on the home page and on /contact.
 * Sponsors get the direct line; students and campus groups get the form.
 */
export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [alert, setAlert] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    const id = `contact-${key}`;
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const honeypot = readHoneypot(e);
    setAlert("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setAlert("Please fix the highlighted fields.");
      focusFirstInvalid(found, ORDER);
      return;
    }

    setStatus("submitting");
    const roleLabel = ROLE_OPTIONS.find((o) => o.value === form.role)?.label || form.role;
    const result = await submitFormToSheets({
      formType: "contact",
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        role: roleLabel,
        message: form.message.trim(),
        company_website_confirm: honeypot,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }
    setMailtoHref(buildMailtoHref({ ...form, role: roleLabel }));
    setStatus("error");
    setAlert(result.message);
  };

  const submitting = status === "submitting";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-[3] border-t border-[var(--border)] py-24 md:py-36"
    >
      <div className="mx-auto max-w-[90rem] px-5 md:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="block h-px w-10 bg-[var(--heading)] opacity-50" />
              <span className="overline">Contact</span>
            </div>
            <SplitText
              as="h2"
              id="contact-title"
              lines={["Talk to", "Genesis."]}
              className="mt-6 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)]"
            />

            <Reveal delay={0.1} className="mt-10 space-y-8">
              <div>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Sponsors and partners
                </h3>
                <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-[var(--text-dim)]">
                  Email or call us directly. If you are looking at {DELHI.name} {DELHI.edition}, say so and we will send the details.
                </p>
                <div className="mt-4 flex flex-col gap-1">
                  <Magnetic strength={0.15}>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="link-draw inline-flex min-h-[44px] items-center font-sans text-[clamp(1.35rem,2.4vw,2rem)] tracking-[-0.01em] text-[var(--heading)]"
                      data-cursor
                      data-cursor-label="Email"
                    >
                      {CONTACT.email}
                    </a>
                  </Magnetic>
                  <a
                    href={CONTACT.phoneHref}
                    className="inline-flex min-h-[44px] w-fit items-center font-sans text-lg text-[var(--text)] underline-offset-4 hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Students and campus communities
                </h3>
                <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-[var(--text-dim)]">
                  Use the form. We reply {CONTACT.replyTime}.
                </p>
              </div>

              <div>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Follow</h3>
                <ul className="mt-2 flex flex-wrap gap-x-6">
                  {SOCIALS.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-draw inline-flex min-h-[44px] items-center gap-1 text-lg text-[var(--text)]"
                      >
                        {s.label}
                        <span aria-hidden className="text-sm">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[15px] text-[var(--text-dim)]">
                Planning a sponsorship?{" "}
                <Link to="/partner" className="text-[var(--heading)] underline underline-offset-4">
                  Use the partner form
                </Link>{" "}
                to share budget and timeline.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {status === "success" ? (
              <SuccessPanel
                title="Message received"
                body={`Thanks for writing. Someone from the Genesis team will reply ${CONTACT.replyTime}.`}
                onReset={() => setStatus("idle")}
              />
            ) : (
              <Reveal variant="up">
                <form
                  data-testid={LANDING.contactForm}
                  onSubmit={onSubmit}
                  noValidate
                  aria-labelledby="contact-form-title"
                  className={FORM_CARD}
                >
                  <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />
                  <div className="relative">
                    <Honeypot />
                    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
                      <h3 id="contact-form-title" className="font-display text-2xl text-white md:text-3xl">
                        Send a message
                      </h3>
                      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">
                        * required
                      </span>
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <FloatingField
                        id="contact-name"
                        name="name"
                        label="Name"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={update("name")}
                        error={errors["contact-name"]}
                        disabled={submitting}
                        data-testid={LANDING.contactName}
                      />
                      <FloatingField
                        id="contact-email"
                        name="email"
                        type="email"
                        label="Email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        value={form.email}
                        onChange={update("email")}
                        error={errors["contact-email"]}
                        disabled={submitting}
                        data-testid={LANDING.contactEmail}
                      />
                    </div>

                    <SelectField
                      id="contact-role"
                      name="role"
                      label="I am reaching out as"
                      className="mt-5"
                      value={form.role}
                      onChange={update("role")}
                      options={ROLE_OPTIONS}
                      disabled={submitting}
                      data-testid={LANDING.contactRole}
                    />

                    <FloatingField
                      id="contact-message"
                      name="message"
                      as="textarea"
                      label="Your message"
                      className="mt-5"
                      required
                      value={form.message}
                      onChange={update("message")}
                      error={errors["contact-message"]}
                      disabled={submitting}
                      data-testid={LANDING.contactMessage}
                    />

                    <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <FormNotice />
                      <SubmitButton submitting={submitting} label="Send message" />
                    </div>

                    <div className="mt-6">
                      <FormAlert message={alert}>
                        {mailtoHref ? (
                          <a href={mailtoHref} className="mt-2 inline-flex min-h-[44px] items-center text-white underline underline-offset-4">
                            Email us your message instead →
                          </a>
                        ) : null}
                      </FormAlert>
                    </div>
                  </div>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
