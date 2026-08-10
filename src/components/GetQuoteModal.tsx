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
  selectedColor?: string;
  selectedSize?: string;
};

export function GetQuoteModal({
  open,
  onClose,
  product,
  defaultOccasion,
  selectedColor,
  selectedSize,
}: Props) {
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
      sizeNote: String(form.get("sizeNote") || "").trim(),
      selectedColor: selectedColor || "",
      selectedSize: selectedSize || "",
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
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--brand)]">Inquiry</p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900">Get Quote</h2>
            {product && (
              <p className="mt-2 text-sm text-slate-500">
                For: <span className="font-medium text-slate-900">{product.name}</span>
              </p>
            )}
            {(selectedColor || selectedSize) && (
              <p className="mt-1 text-sm text-slate-500">
                {[selectedColor && `Color ${selectedColor}`, selectedSize && `Size ${selectedSize}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 transition hover:text-slate-900"
          >
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
          <Field
            label="Additional size / custom note"
            name="sizeNote"
            placeholder="e.g. custom bust 38&quot;"
          />
          <div className="sm:col-span-2">
            <label className="label-caps">Message</label>
            <textarea name="message" rows={4} className="input-field" />
          </div>
          {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2 sm:col-span-2">
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
