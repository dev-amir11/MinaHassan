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
    <footer className="mt-auto bg-slate-900 py-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 block font-heading text-2xl font-bold tracking-tight text-white">
              Mina Hasan
              <span className="text-[var(--accent)]">.</span>
            </Link>
            <p className="text-sm text-slate-400">
              Luxury bridal and occasion wear, crafted with love. Request a personal quote for
              every piece.
            </p>
            <p className="mt-4 space-y-1 text-sm text-slate-400">
              <a href={`tel:${phoneTel}`} className="block transition hover:text-white">
                {phone}
              </a>
              <a href={`mailto:${email}`} className="block transition hover:text-white">
                {email}
              </a>
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/about", "About Us"],
                ["/contact", "Contact Us"],
                ["/faqs", "FAQs"],
                ["/track-order", "Track Order"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Policies</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/privacy-policy", "Privacy Policy"],
                ["/terms-and-conditions", "Terms & Conditions"],
                ["/return-exchange-policy", "Return/Exchange Policy"],
                ["/shipping-and-handling", "Shipping & Handling"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Stay in the loop</h4>
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border-none bg-slate-800 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--brand)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-hover)] disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Subscribe"}
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
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Mina Hasan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
