import React, { useState } from "react";
import { CONTACT, DELHI } from "@shared/config/site";
import { submitFormToSheets } from "@shared/services/formSubmissionService";
import { buildMailtoHref, isValidEmail } from "@/features/contact/submitContactLead";
import {
  ChoiceGroup,
  FORM_CARD,
  FloatingField,
  FormAlert,
  FormNotice,
  Honeypot,
  SubmitButton,
  SuccessPanel,
  focusFirstInvalid,
  readHoneypot,
} from "./FormKit";

const TRACK_OPTIONS = DELHI.tracks.map((t) => ({ value: t, label: t }));

const TEAM_OPTIONS = [
  { value: "full", label: "Yes, full team" },
  { value: "partly", label: "Partly" },
  { value: "looking", label: "Looking for one" },
];

const ORDER = ["delhi-name", "delhi-email", "delhi-org"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  city: "",
  tracks: [],
  team: "looking",
};

/**
 * Register interest in Hackers Occupied Delhi. Not a registration: we
 * email people on this list when registration opens.
 */
export default function DelhiInterestForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [alert, setAlert] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

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
    if (!form.name.trim()) found["delhi-name"] = "Tell us your name.";
    if (!form.email.trim()) found["delhi-email"] = "Add the email we should write to.";
    else if (!isValidEmail(form.email)) found["delhi-email"] = "That email address does not look right.";
    if (!form.organization.trim()) found["delhi-org"] = "Add your college or organisation.";
    setErrors(found);
    if (Object.keys(found).length) {
      setAlert("Please fix the highlighted fields.");
      focusFirstInvalid(found, ORDER);
      return;
    }

    setStatus("submitting");
    const teamLabel = TEAM_OPTIONS.find((t) => t.value === form.team)?.label || form.team;
    const result = await submitFormToSheets({
      formType: "delhi_interest",
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        city: form.city.trim(),
        tracks: form.tracks,
        teamStatus: teamLabel,
        company_website_confirm: honeypot,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }
    setStatus("error");
    setAlert(result.message);
    setMailtoHref(
      buildMailtoHref({
        name: form.name,
        email: form.email,
        role: "Hackers Occupied Delhi interest",
        message: `College or organisation: ${form.organization}\nCity: ${form.city}\nTracks: ${form.tracks.join(", ")}\nTeam: ${teamLabel}`,
        subject: `${DELHI.name} ${DELHI.edition}: register interest`,
      }),
    );
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <SuccessPanel
        title="You're on the list"
        body={`We will email registration details for ${DELHI.name} ${DELHI.edition} as soon as registration opens. This is not a registration yet and does not reserve a place.`}
        onReset={() => setStatus("idle")}
        resetLabel="Add someone else"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="delhi-form-title" className={FORM_CARD}>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative">
        <Honeypot />
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-5">
          <h3 id="delhi-form-title" className="font-display text-2xl text-white md:text-3xl">
            Register interest
          </h3>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">* required</span>
        </div>
        <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-white/75">
          Registration is not open yet. Leave your details and we will email you when it opens. The event is planned for {DELHI.when}, {DELHI.where}.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <FloatingField id="delhi-name" name="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name", "delhi-name")} error={errors["delhi-name"]} disabled={submitting} />
          <FloatingField id="delhi-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email" required value={form.email} onChange={update("email", "delhi-email")} error={errors["delhi-email"]} disabled={submitting} />
          <FloatingField id="delhi-org" name="organization" label="College or organisation" autoComplete="organization" required value={form.organization} onChange={update("organization", "delhi-org")} error={errors["delhi-org"]} disabled={submitting} />
          <FloatingField id="delhi-phone" name="phone" type="tel" inputMode="tel" label="Phone or WhatsApp" autoComplete="tel" value={form.phone} onChange={update("phone")} disabled={submitting} />
          <FloatingField id="delhi-city" name="city" label="City" autoComplete="address-level2" className="sm:col-span-2" value={form.city} onChange={update("city")} disabled={submitting} />
        </div>

        <div className="mt-8 space-y-7">
          <ChoiceGroup
            id="delhi-tracks"
            legend="Tracks you are interested in"
            hint="Pick any. You can change your mind later."
            name="tracks"
            options={TRACK_OPTIONS}
            value={form.tracks}
            onChange={(v) => setForm((f) => ({ ...f, tracks: v }))}
          />
          <ChoiceGroup
            id="delhi-team"
            legend={`Do you have a team? Teams are ${DELHI.teamSize} people.`}
            name="team"
            type="radio"
            options={TEAM_OPTIONS}
            value={form.team}
            onChange={(v) => setForm((f) => ({ ...f, team: v }))}
          />
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <FormNotice />
          <SubmitButton submitting={submitting} label="Keep me posted" />
        </div>

        <div className="mt-6">
          <FormAlert message={alert}>
            {mailtoHref ? (
              <a href={mailtoHref} className="mt-2 inline-flex min-h-[44px] items-center text-white underline underline-offset-4">
                Email {CONTACT.email} instead →
              </a>
            ) : null}
          </FormAlert>
        </div>
      </div>
    </form>
  );
}
