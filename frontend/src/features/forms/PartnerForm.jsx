import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CONTACT, DELHI } from "@shared/config/site";
import { submitFormToSheets } from "@shared/services/formSubmissionService";
import { buildMailtoHref, isValidEmail } from "@/features/contact/submitContactLead";
import {
  ChoiceGroup,
  FORM_CARD,
  FieldError,
  FloatingField,
  FormAlert,
  FormNotice,
  Honeypot,
  SelectField,
  SubmitButton,
  SuccessPanel,
  fileExtension,
  focusFirstInvalid,
  readAsBase64,
  readHoneypot,
} from "./FormKit";

const EVENT_OPTIONS = [
  { value: "delhi", label: `${DELHI.name} ${DELHI.edition}` },
  { value: "independent", label: "Independent hackathons" },
  { value: "not_sure", label: "Not sure yet" },
];

/** ?event= values other pages can link with to preselect the event. */
const EVENT_FROM_QUERY = {
  [DELHI.slug]: "delhi",
  delhi: "delhi",
  independent: "independent",
};

const GOAL_OPTIONS = [
  { value: "hiring", label: "Hiring" },
  { value: "adoption", label: "Developer adoption" },
  { value: "brand", label: "Brand visibility" },
  { value: "other", label: "Other" },
];

const TYPE_OPTIONS = [
  { value: "sponsorship", label: "Event sponsorship" },
  { value: "campus_partner", label: "Campus or college chapter" },
  { value: "community_partner", label: "Community partnership" },
  { value: "in_kind", label: "Product, credits or perks" },
];

// NEEDS_CONFIRMATION: budget bands should match the sponsorship packages.
const BUDGET_OPTIONS = [
  { value: "", label: "Choose a range" },
  { value: "under_1l", label: "Under ₹1 lakh" },
  { value: "1_5l", label: "₹1–5 lakh" },
  { value: "5_15l", label: "₹5–15 lakh" },
  { value: "15l_plus", label: "₹15 lakh+" },
  { value: "not_decided", label: "Not decided" },
];

const TIMELINE_OPTIONS = [
  { value: "", label: "Choose a timeline" },
  { value: "this_month", label: "This month" },
  { value: "1_3m", label: "1–3 months" },
  { value: "3_6m", label: "3–6 months" },
  { value: "exploring", label: "Exploring" },
];

const ATTACH_TYPES = ["sponsorship", "community_partner"];
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024; // stays under Vercel's 4.5 MB body limit once base64-encoded
const ATTACHMENT_EXTENSIONS = ["pdf", "ppt", "pptx"];

const ORDER = ["partner-name", "partner-email", "partner-org", "partner-goals", "partner-message", "partner-file"];

const labelOf = (options, value) => options.find((o) => o.value === value)?.label || "";

function initialForm(eventValue) {
  return {
    name: "",
    email: "",
    organization: "",
    phone: "",
    eventOfInterest: eventValue || "delhi",
    goals: [],
    partnershipType: "sponsorship",
    budget: "",
    timeline: "",
    website: "",
    proposal: "",
  };
}

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors["partner-name"] = "Tell us your name.";
  if (!form.email.trim()) errors["partner-email"] = "Add a work email so we can reply.";
  else if (!isValidEmail(form.email)) errors["partner-email"] = "That email address does not look right.";
  if (!form.organization.trim()) errors["partner-org"] = "Which company or college is this for?";
  if (!form.goals.length) errors["partner-goals"] = "Pick at least one goal.";
  if (!form.proposal.trim()) errors["partner-message"] = "A line or two about what you have in mind helps.";
  return errors;
}

function Step({ n, title, children }) {
  return (
    <div className="border-t border-white/10 pt-7 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono text-[12px] text-[#e2efba]">{n}</span>
        <h4 className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/75">{title}</h4>
      </div>
      {children}
    </div>
  );
}

/** Sponsor intake. Asks what the team needs to qualify a sponsor on first contact (audit K02). */
export default function PartnerForm() {
  const [params] = useSearchParams();
  const queryEvent = EVENT_FROM_QUERY[params.get("event") || ""];
  const [form, setForm] = useState(() => initialForm(queryEvent));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [alert, setAlert] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileRef = useRef(null);

  // Links like /partner?event=hackers-occupied-delhi preselect the event.
  useEffect(() => {
    if (queryEvent) setForm((f) => ({ ...f, eventOfInterest: queryEvent }));
  }, [queryEvent]);

  const clearError = (id) => {
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const update = (key, id) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (id) clearError(id);
  };

  const showAttachment = ATTACH_TYPES.includes(form.partnershipType);

  const clearAttachment = () => {
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    clearError("partner-file");
    if (!file) {
      setAttachment(null);
      return;
    }
    if (!ATTACHMENT_EXTENSIONS.includes(fileExtension(file.name))) {
      setErrors((prev) => ({ ...prev, "partner-file": "Upload a PDF or PowerPoint file (.pdf, .ppt, .pptx)." }));
      clearAttachment();
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrors((prev) => ({ ...prev, "partner-file": "That file is over 3 MB. Upload a smaller one or paste a link in the message." }));
      clearAttachment();
      return;
    }
    setAttachment(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const honeypot = readHoneypot(e);
    setAlert("");
    const found = validate(form);
    if (errors["partner-file"]) found["partner-file"] = errors["partner-file"];
    setErrors(found);
    if (Object.keys(found).length) {
      setAlert("Please fix the highlighted fields.");
      focusFirstInvalid(found, ORDER);
      return;
    }

    setStatus("submitting");
    // Keys are the contract with /api/submit-form; keep them stable.
    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      organization: form.organization.trim(),
      website: form.website.trim(),
      proposal: form.proposal.trim(),
      partnershipType: labelOf(TYPE_OPTIONS, form.partnershipType),
      eventOfInterest: labelOf(EVENT_OPTIONS, form.eventOfInterest),
      goals: form.goals.map((g) => labelOf(GOAL_OPTIONS, g)),
      budgetBand: form.budget ? labelOf(BUDGET_OPTIONS, form.budget) : "",
      timeline: form.timeline ? labelOf(TIMELINE_OPTIONS, form.timeline) : "",
      company_website_confirm: honeypot,
    };
    if (showAttachment && attachment) {
      try {
        data.attachmentName = attachment.name;
        data.attachmentData = await readAsBase64(attachment);
      } catch {
        setStatus("error");
        setAlert("We could not read that file. Try again or remove it.");
        return;
      }
    }

    const result = await submitFormToSheets({ formType: "partner", data });
    if (result.ok) {
      setStatus("success");
      setForm(initialForm(queryEvent));
      clearAttachment();
      return;
    }
    setStatus("error");
    setAlert(result.message);
    setMailtoHref(
      buildMailtoHref({
        name: form.name,
        email: form.email,
        role: `Sponsor, ${data.organization}`,
        message: `${form.proposal}\n\nEvent: ${data.eventOfInterest}\nGoals: ${data.goals.join(", ")}\nBudget: ${data.budgetBand || "Not given"}\nTimeline: ${data.timeline || "Not given"}`,
        subject: `Sponsorship enquiry: ${data.organization}`,
      }),
    );
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <SuccessPanel
        title="Request received"
        body={`Thanks. Someone from the Genesis team will reply ${CONTACT.replyTime} with events that fit your goals and budget.`}
        onReset={() => setStatus("idle")}
        resetLabel="Send another request"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="partner-form-title" className={FORM_CARD}>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative space-y-8">
        <Honeypot />
        <div className="flex items-baseline justify-between gap-4">
          <h3 id="partner-form-title" className="font-display text-2xl text-white md:text-3xl">
            Sponsorship request
          </h3>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">* required</span>
        </div>

        <Step n="01" title="About you">
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatingField id="partner-name" name="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name", "partner-name")} error={errors["partner-name"]} disabled={submitting} />
            <FloatingField id="partner-email" name="email" type="email" inputMode="email" label="Work email" autoComplete="email" required value={form.email} onChange={update("email", "partner-email")} error={errors["partner-email"]} disabled={submitting} />
            <FloatingField id="partner-org" name="organization" label="Company or college" autoComplete="organization" required value={form.organization} onChange={update("organization", "partner-org")} error={errors["partner-org"]} disabled={submitting} />
            <FloatingField id="partner-phone" name="phone" type="tel" inputMode="tel" label="Phone or WhatsApp" autoComplete="tel" value={form.phone} onChange={update("phone")} disabled={submitting} />
          </div>
        </Step>

        <Step n="02" title="What you are after">
          <div className="space-y-7">
            <ChoiceGroup
              id="partner-event"
              legend="Event of interest"
              name="eventOfInterest"
              type="radio"
              options={EVENT_OPTIONS}
              value={form.eventOfInterest}
              onChange={(v) => setForm((f) => ({ ...f, eventOfInterest: v }))}
            />
            <ChoiceGroup
              id="partner-goals"
              legend="Goals"
              hint="Pick all that apply."
              name="goals"
              options={GOAL_OPTIONS}
              value={form.goals}
              required
              error={errors["partner-goals"]}
              onChange={(v) => {
                setForm((f) => ({ ...f, goals: v }));
                clearError("partner-goals");
              }}
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <SelectField id="partner-type" name="partnershipType" label="Type" value={form.partnershipType} onChange={update("partnershipType")} options={TYPE_OPTIONS} disabled={submitting} />
              <SelectField id="partner-budget" name="budget" label="Budget band" value={form.budget} onChange={update("budget")} options={BUDGET_OPTIONS} disabled={submitting} />
              <SelectField id="partner-timeline" name="timeline" label="Timeline" value={form.timeline} onChange={update("timeline")} options={TIMELINE_OPTIONS} disabled={submitting} />
            </div>
          </div>
        </Step>

        <Step n="03" title="Details">
          <div className="space-y-5">
            <FloatingField id="partner-website" name="website" type="url" inputMode="url" label="Website or social link" autoComplete="url" value={form.website} onChange={update("website")} disabled={submitting} />
            <FloatingField
              id="partner-message"
              name="proposal"
              as="textarea"
              label="What do you have in mind?"
              hint="Audience you want to reach, what you would offer (prizes, credits, mentors) and any dates."
              required
              value={form.proposal}
              onChange={update("proposal", "partner-message")}
              error={errors["partner-message"]}
              disabled={submitting}
            />
            {showAttachment ? (
              <div>
                <label htmlFor="partner-file" className="mb-2 block font-mono text-[12px] uppercase tracking-[0.14em] text-white/70">
                  Brochure or deck (optional)
                </label>
                <input
                  id="partner-file"
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={onFile}
                  disabled={submitting}
                  aria-invalid={errors["partner-file"] ? "true" : undefined}
                  aria-describedby={`partner-file-note${errors["partner-file"] ? " partner-file-error" : ""}`}
                  className="block w-full cursor-pointer border border-dashed border-white/25 bg-white/[0.03] p-4 text-[15px] text-white/80 transition-colors hover:border-white/50 file:mr-4 file:cursor-pointer file:border-0 file:bg-[#e2efba] file:px-4 file:py-2 file:font-mono file:text-[12px] file:uppercase file:tracking-[0.12em] file:text-[#181818]"
                />
                {/* NEEDS_CONFIRMATION: retention period for uploaded files. */}
                <p id="partner-file-note" className="mt-2 text-[13px] leading-snug text-white/65">
                  PDF or PowerPoint, up to 3 MB. Decks are stored privately, seen only by the Genesis team and used only to reply to you. We delete them after 12 months.
                </p>
                <FieldError id="partner-file" error={errors["partner-file"]} />
              </div>
            ) : null}
          </div>
        </Step>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <FormNotice />
          <SubmitButton submitting={submitting} label="Send request" />
        </div>

        <FormAlert message={alert}>
          {mailtoHref ? (
            <a href={mailtoHref} className="mt-2 inline-flex min-h-[44px] items-center text-white underline underline-offset-4">
              Email the request to {CONTACT.email} instead →
            </a>
          ) : null}
        </FormAlert>
      </div>
    </form>
  );
}
