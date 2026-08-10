"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/ToastProvider";

type ProductRef = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  product?: ProductRef | null;
  defaultOccasion?: string;
};

export function GetQuoteModal({ open, onClose, product, defaultOccasion }: Props) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      country: String(form.get("country") || ""),
      city: String(form.get("city") || ""),
      eventDate: String(form.get("eventDate") || ""),
      occasion: String(form.get("occasion") || defaultOccasion || ""),
      sizeNote: String(form.get("sizeNote") || ""),
      message: String(form.get("message") || ""),
      productId: product?.id,
      productName: product?.name,
      productSlug: product?.slug,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit quote");

      success("Quote submitted — opening WhatsApp");
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--footer)]/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] p-7 shadow-[var(--shadow-lift)] sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Inquiry</p>
            <h2 className="mt-1 font-serif text-3xl italic">Get Quote</h2>
            {product && (
              <p className="mt-2 text-sm text-[var(--muted)]">
                For: <span className="text-[var(--foreground)]">{product.name}</span>
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[var(--muted)]">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name *" name="fullName" required />
          <Field label="Email *" name="email" type="email" required />
          <Field label="Phone / WhatsApp *" name="phone" required />
          <Field label="Country" name="country" />
          <Field label="City" name="city" />
          <Field label="Event date" name="eventDate" type="date" />
          <Field
            label="Occasion"
            name="occasion"
            defaultValue={defaultOccasion}
            placeholder="Mehndi, Barat, Walima..."
          />
          <Field label="Size / custom note" name="sizeNote" />
          <div className="sm:col-span-2">
            <label className="label-caps">Message</label>
            <textarea name="message" rows={4} className="input-field" />
          </div>
          {error && (
            <p className="sm:col-span-2 text-sm text-[var(--danger)]">{error}</p>
          )}
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Submitting..." : "Submit & WhatsApp"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label-caps">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
