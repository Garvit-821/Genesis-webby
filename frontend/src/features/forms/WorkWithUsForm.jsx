import React, { useEffect, useState } from "react";
import { CONTACT } from "@shared/config/site";
import { submitFormToSheets } from "@shared/services/formSubmissionService";
import { buildMailtoHref, isValidEmail } from "@/features/contact/submitContactLead";
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
} from "./FormKit";

export const CREW_AREAS = [
  { value: "events", label: "Event operations" },
  { value: "partnerships", label: "Partnerships" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "community", label: "Community and campus" },
  { value: "other", label: "Something else" },
];

const EXPERIENCE = [
  { value: "student", label: "Student" },
  { value: "0-2", label: "0–2 years working" },
  { value: "3-5", label: "3–5 years working" },
  { value: "5+", label: "5+ years working" },
];

const ORDER = ["crew-name", "crew-email", "crew-message"];

const empty = (area) => ({
  name: "",
  email: "",
  phone: "",
  area: area || "events",
  experience: "student",
  city: "",
  portfolio: "",
  message: "",
});

/**
 * "Join the crew" application. Inline on /careers. `area` preselects the
 * area of work when someone picks it from a card.
 */
export default function WorkWithUsForm({ area }) {
  const [form, setForm] = useState(() => empty(area));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [alert, setAlert] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

  useEffect(() => {
    if (area) setForm((f) => ({ ...f, area }));
  }, [area]);

  const update = (key, id) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (id && errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const honeypot = readHoneypot(e);
    setAlert("");
    const found = {};
    if (!form.name.trim()) found["crew-name"] = "Tell us your name.";
    if (!form.email.trim()) found["crew-email"] = "Add an email so we can reply.";
    else if (!isValidEmail(form.email)) found["crew-email"] = "That email address does not look right.";
    if (!form.message.trim()) found["crew-message"] = "Tell us what you would like to work on.";
    setErrors(found);
    if (Object.keys(found).length) {
      setAlert("Please fix the highlighted fields.");
      focusFirstInvalid(found, ORDER);
      return;
    }

    setStatus("submitting");
    const areaLabel = CREW_AREAS.find((a) => a.value === form.area)?.label || form.area;
    const experienceLabel = EXPERIENCE.find((x) => x.value === form.experience)?.label || form.experience;
    const result = await submitFormToSheets({
      formType: "work_with_us",
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: areaLabel,
        experience: experienceLabel,
        portfolio: form.portfolio.trim(),
        message: form.message.trim(),
        city: form.city.trim(),
        company_website_confirm: honeypot,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm(empty(form.area));
      return;
    }
    setStatus("error");
    setAlert(result.message);
    setMailtoHref(
      buildMailtoHref({
        name: form.name,
        email: form.email,
        role: `Crew application, ${areaLabel}`,
        message: form.message,
        subject: `Crew application: ${areaLabel}`,
      }),
    );
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <SuccessPanel
        title="Application received"
        body={`Thanks for putting your hand up. We reply to every application ${CONTACT.replyTime}, and if there is a fit for an upcoming event we will set up a call.`}
        onReset={() => setStatus("idle")}
        resetLabel="Send another"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="crew-form-title" className={FORM_CARD}>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative">
        <Honeypot />
        <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
          <h3 id="crew-form-title" className="font-display text-2xl text-white md:text-3xl">
            Apply to the crew
          </h3>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">* required</span>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <FloatingField id="crew-name" name="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name", "crew-name")} error={errors["crew-name"]} disabled={submitting} />
          <FloatingField id="crew-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email" required value={form.email} onChange={update("email", "crew-email")} error={errors["crew-email"]} disabled={submitting} />
          <SelectField id="crew-area" name="area" label="Area of work" value={form.area} onChange={update("area")} options={CREW_AREAS} disabled={submitting} />
          <SelectField id="crew-experience" name="experience" label="Experience" value={form.experience} onChange={update("experience")} options={EXPERIENCE} disabled={submitting} />
          <FloatingField id="crew-phone" name="phone" type="tel" inputMode="tel" label="Phone or WhatsApp" autoComplete="tel" value={form.phone} onChange={update("phone")} disabled={submitting} />
          <FloatingField id="crew-city" name="city" label="City" autoComplete="address-level2" value={form.city} onChange={update("city")} disabled={submitting} />
        </div>

        <FloatingField
          id="crew-portfolio"
          name="portfolio"
          type="url"
          inputMode="url"
          label="Portfolio, GitHub or LinkedIn"
          autoComplete="url"
          className="mt-5"
          value={form.portfolio}
          onChange={update("portfolio")}
          disabled={submitting}
        />

        <FloatingField
          id="crew-message"
          name="message"
          as="textarea"
          label="What would you like to work on?"
          hint="Events you have helped run, things you have built, and how much time you can give."
          className="mt-5"
          required
          value={form.message}
          onChange={update("message", "crew-message")}
          error={errors["crew-message"]}
          disabled={submitting}
        />

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <FormNotice />
          <SubmitButton submitting={submitting} label="Send application" />
        </div>

        <div className="mt-6">
          <FormAlert message={alert}>
            {mailtoHref ? (
              <a href={mailtoHref} className="mt-2 inline-flex min-h-[44px] items-center text-white underline underline-offset-4">
                Email your application instead →
              </a>
            ) : null}
          </FormAlert>
        </div>
      </div>
    </form>
  );
}
