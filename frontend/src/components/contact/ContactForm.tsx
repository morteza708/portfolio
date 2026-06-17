"use client";

import { FormEvent, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { sendContactMessage, type ContactFormErrors } from "@/lib/api";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setFieldErrors({});

    const formData = new FormData(form);

    try {
      await sendContactMessage({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error instanceof Error && "fieldErrors" in error) {
        setFieldErrors((error as Error & { fieldErrors: ContactFormErrors }).fieldErrors);
      }
    }
  }

  function fieldError(name: keyof ContactFormErrors) {
    const messages = fieldErrors[name];
    if (!messages?.length) {
      return null;
    }

    return (
      <p className="text-xs text-red-400" role="alert">
        {messages.join(" ")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-5 p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={nameId} className="text-sm font-medium">
            {t("name")}
          </label>
          <input id={nameId} name="name" required className="input-field" />
          {fieldError("name")}
        </div>
        <div className="space-y-2">
          <label htmlFor={emailId} className="text-sm font-medium">
            {t("email")}
          </label>
          <input id={emailId} name="email" type="email" required className="input-field" />
          {fieldError("email")}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={subjectId} className="text-sm font-medium">
          {t("subject")}
        </label>
        <input id={subjectId} name="subject" className="input-field" />
        {fieldError("subject")}
      </div>

      <div className="space-y-2">
        <label htmlFor={messageId} className="text-sm font-medium">
          {t("message")}
        </label>
        <textarea id={messageId} name="message" required rows={6} className="input-field resize-y" />
        {fieldError("message")}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? t("sending") : t("send")}
      </button>

      <div aria-live="polite" aria-atomic="true">
        {status === "success" ? (
          <p className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-accent" role="status">
            {t("success")}
          </p>
        ) : null}
        {status === "error" && Object.keys(fieldErrors).length === 0 ? (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
            {t("error")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
