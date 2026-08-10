"use client";

import { FormEvent, useState } from "react";
import { GetQuoteModal } from "@/components/GetQuoteModal";
import { useToast } from "@/components/ToastProvider";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 307 447 4467";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@minahasan.com";

export default function ContactPage() {
  const { success, error: toastError } = useToast();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          occasion: "General inquiry",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      setSent(true);
      success("Message sent — opening WhatsApp");
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
      formEl.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-2 font-serif text-4xl italic md:text-5xl">Contact Us</h1>
        <div className="divider-gold my-5 max-w-24" />
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Reach out for quotes, custom sizing, or appointment inquiries.
        </p>
        <div className="mt-8 space-y-3 text-sm text-[var(--muted)]">
          <p>
            WhatsApp:{" "}
            <a
              className="text-[var(--brand)] underline decoration-[var(--accent)] underline-offset-4"
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
            >
              {phone}
            </a>
          </p>
          <p>
            Email:{" "}
            <a
              className="text-[var(--brand)] underline decoration-[var(--accent)] underline-offset-4"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary mt-8">
          Request a Quote
        </button>
      </div>

      <form onSubmit={onSubmit} className="card-surface space-y-3 p-7">
        <h2 className="font-serif text-3xl italic">Send a message</h2>
        <input name="fullName" required placeholder="Full name" className="input-field" />
        <input name="email" type="email" required placeholder="Email" className="input-field" />
        <input name="phone" required placeholder="Phone / WhatsApp" className="input-field" />
        <textarea name="message" required rows={5} placeholder="Message" className="input-field" />
        {error && (
          <p className="rounded-[var(--radius-md)] bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Sending..." : "Submit & WhatsApp"}
        </button>
        {sent && (
          <p className="text-sm text-[var(--success)]">Message sent. WhatsApp opened.</p>
        )}
      </form>

      <GetQuoteModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
