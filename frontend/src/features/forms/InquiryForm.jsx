import React, { useState } from "react";
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

/**
 * General inquiry form: name, email, organisation, phone, a scope select,
 * a link and a message. Used by the Collaborate page; the Partner page has
 * its own longer sponsor form.
 */
export default function InquiryForm({
  formType,
  title,
  scopeLabel,
  scopeOptions,
  organizationLabel,
  organizationRequired = false,
  messageLabel,
  messageHint,
  submitLabel,
  successTitle = "Request received",
  successBody = `Thanks. Someone from the Genesis team will reply ${CONTACT.replyTime}.`,
}) {
  const id = (key) => `${formType}-${key}`;
  const empty = {
    name: "",
    email: "",
    organization: "",
    phone: "",
    partnershipType: scopeOptions[0].value,
    website: "",
    proposal: "",
  };
  const order = [id("name"), id("email"), id("org"), id("message")];

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [alert, setAlert] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

  const update = (key, fieldId) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldId && errors[fieldId]) setErrors((prev) => ({ ...prev, [fieldId]: undefined }));
  };

  const validate = () => {
    const found = {};
    if (!form.name.trim()) found[id("name")] = "Tell us your name.";
    if (!form.email.trim()) found[id("email")] = "Add an email so we can reply.";
    else if (!isValidEmail(form.email)) found[id("email")] = "That email address does not look right.";
    if (organizationRequired && !form.organization.trim()) found[id("org")] = "Add your organisation.";
    if (!form.proposal.trim()) found[id("message")] = "Tell us a little about the idea.";
    return found;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const honeypot = readHoneypot(e);
    setAlert("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setAlert("Please fix the highlighted fields.");
      focusFirstInvalid(found, order);
      return;
    }
    setStatus("submitting");
    const scope = scopeOptions.find((o) => o.value === form.partnershipType)?.label || form.partnershipType;
    const result = await submitFormToSheets({
      formType,
      data: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        website: form.website.trim(),
        partnershipType: scope,
        proposal: form.proposal.trim(),
        company_website_confirm: honeypot,
      },
    });
    if (result.ok) {
      setStatus("success");
      setForm(empty);
      return;
    }
    setStatus("error");
    setAlert(result.message);
    setMailtoHref(
      buildMailtoHref({
        name: form.name,
        email: form.email,
        role: scope,
        message: form.proposal,
      }),
    );
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return <SuccessPanel title={successTitle} body={successBody} onReset={() => setStatus("idle")} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={id("title")} className={FORM_CARD}>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />
      <div className="relative">
        <Honeypot />
        <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
          <h3 id={id("title")} className="font-display text-2xl text-white md:text-3xl">
            {title}
          </h3>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">* required</span>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <FloatingField id={id("name")} name="name" label="Full name" autoComplete="name" required value={form.name} onChange={update("name", id("name"))} error={errors[id("name")]} disabled={submitting} />
          <FloatingField id={id("email")} name="email" type="email" inputMode="email" label="Email" autoComplete="email" required value={form.email} onChange={update("email", id("email"))} error={errors[id("email")]} disabled={submitting} />
          <FloatingField id={id("org")} name="organization" label={organizationLabel} autoComplete="organization" required={organizationRequired} value={form.organization} onChange={update("organization", id("org"))} error={errors[id("org")]} disabled={submitting} />
          <FloatingField id={id("phone")} name="phone" type="tel" inputMode="tel" label="Phone or WhatsApp" autoComplete="tel" value={form.phone} onChange={update("phone")} disabled={submitting} />
          <SelectField id={id("scope")} name="partnershipType" label={scopeLabel} value={form.partnershipType} onChange={update("partnershipType")} options={scopeOptions} disabled={submitting} />
          <FloatingField id={id("website")} name="website" type="url" inputMode="url" label="Website or social link" autoComplete="url" value={form.website} onChange={update("website")} disabled={submitting} />
        </div>

        <FloatingField
          id={id("message")}
          name="proposal"
          as="textarea"
          label={messageLabel}
          hint={messageHint}
          className="mt-5"
          required
          value={form.proposal}
          onChange={update("proposal", id("message"))}
          error={errors[id("message")]}
          disabled={submitting}
        />

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <FormNotice />
          <SubmitButton submitting={submitting} label={submitLabel} />
        </div>

        <div className="mt-6">
          <FormAlert message={alert}>
            {mailtoHref ? (
              <a href={mailtoHref} className="mt-2 inline-flex min-h-[44px] items-center text-white underline underline-offset-4">
                Email us instead →
              </a>
            ) : null}
          </FormAlert>
        </div>
      </div>
    </form>
  );
}
