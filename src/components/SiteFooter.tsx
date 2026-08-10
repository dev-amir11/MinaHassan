"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useToast } from "@/components/ToastProvider";

const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 307 447 4467";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@minahasan.com";
const phoneTel = phone.replace(/[^\d+]/g, "");

export function SiteFooter() {
  const { success, error: toastError } = useToast();
  const [emailValue, setEmailValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage("Thank you for subscribing.");
      setEmailValue("");
      success("Subscribed to newsletter");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus("error");
      setMessage(msg);
      toastError(msg);
    }
  }

  return (
    <footer className="mt-auto overflow-hidden bg-[var(--footer)] text-[#f7f2ee]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-3 md:py-20">
        <div>
          <p className="brand-mark text-2xl text-[#f7f2ee]">MINA HASAN</p>
          <div className="divider-gold my-6 max-w-28" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
            Luxury bridal and occasion wear, crafted with love. Request a personal
            quote for every piece.
          </p>
          <p className="mt-6 space-y-2 text-sm text-[var(--footer-muted)]">
            <a href={`tel:${phoneTel}`} className="block transition hover:text-[#f7f2ee]">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="block transition hover:text-[#f7f2ee]">
              {email}
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-3">
            <p className="eyebrow !text-[var(--accent)]">Explore</p>
            {[
              ["/about", "About Us"],
              ["/contact", "Contact Us"],
              ["/faqs", "FAQs"],
              ["/track-order", "Track Order"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="block text-[var(--footer-muted)] transition hover:text-[#f7f2ee]"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <p className="eyebrow !text-[var(--accent)]">Policies</p>
            {[
              ["/privacy-policy", "Privacy Policy"],
              ["/terms-and-conditions", "Terms & Conditions"],
              ["/return-exchange-policy", "Return/Exchange Policy"],
              ["/shipping-and-handling", "Shipping & Handling"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="block text-[var(--footer-muted)] transition hover:text-[#f7f2ee]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="font-serif text-2xl italic text-[#f7f2ee]">Newsletter</h3>
          <p className="mt-2 text-sm text-[var(--footer-muted)]">
            Join our mailing list for latest updates.
          </p>
          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Email Address"
              className="w-full rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#f7f2ee] outline-none placeholder:text-[var(--footer-muted)] focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-[var(--radius-md)] bg-[var(--brand)] px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#fffcfa] transition hover:bg-[var(--brand-hover)] disabled:opacity-50"
            >
              {status === "loading" ? "Saving..." : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-3 text-xs ${status === "error" ? "text-red-300" : "text-emerald-300"}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-white/8 px-4 py-5 text-center text-xs text-[var(--footer-muted)]">
        Copyright © {new Date().getFullYear()} Mina Hasan. All rights reserved.
      </div>
    </footer>
  );
}
