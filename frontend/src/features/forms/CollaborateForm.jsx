import React from "react";
import InquiryForm from "./InquiryForm";

export const COLLABORATE_OPTIONS = [
  { value: "cohost", label: "Co-host a hackathon" },
  { value: "track", label: "Run a track or challenge" },
  { value: "member_event", label: "List my event with Genesis" },
  { value: "speaker_mentor", label: "Speak, judge or mentor" },
];

export default function CollaborateForm() {
  return (
    <InquiryForm
      formType="collaborate"
      title="Collaboration request"
      scopeLabel="How would you like to collaborate?"
      scopeOptions={COLLABORATE_OPTIONS}
      organizationLabel="Club, company or event"
      messageLabel="Tell us about the idea"
      messageHint="What you want to do together, expected dates and audience size."
      submitLabel="Send request"
    />
  );
}
