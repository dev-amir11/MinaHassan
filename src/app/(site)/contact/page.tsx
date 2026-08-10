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
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-slate-500">
            <a href="/" className="hover:text-slate-900">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-slate-900">Contact</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-16">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Reach out for quotes, custom sizing, or appointment inquiries.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <p>
              WhatsApp:{" "}
              <a
                className="font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
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
                className="font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
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

        <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="font-heading text-xl font-bold text-slate-900">Send a message</h2>
          <input name="fullName" required placeholder="Full name" className="input-field" />
          <input name="email" type="email" required placeholder="Email" className="input-field" />
          <input name="phone" required placeholder="Phone / WhatsApp" className="input-field" />
          <textarea name="message" required rows={5} placeholder="Message" className="input-field" />
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Submit & WhatsApp"}
          </button>
          {sent && (
            <p className="text-sm text-green-600">Message sent. WhatsApp opened.</p>
          )}
        </form>

        <GetQuoteModal open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
