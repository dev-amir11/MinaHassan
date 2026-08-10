"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/ToastProvider";

type TrackResult = {
  orderNumber: string;
  status: string;
  productName?: string | null;
  customerName?: string | null;
  notes?: string | null;
  timeline: { status: string; note?: string; at: string }[];
  updatedAt: string;
};

export default function TrackOrderPage() {
  const { success, error: toastError } = useToast();
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/track-order?orderNumber=${encodeURIComponent(orderNumber.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setResult(data);
      success("Order found");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="eyebrow">Orders</p>
      <h1 className="mt-2 font-serif text-4xl italic md:text-5xl">Track Order</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Enter the order number shared with you after confirmation.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex gap-2">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          placeholder="e.g. MH-1001"
          className="input-field"
        />
        <button type="submit" disabled={loading} className="btn-primary !px-5">
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>
      {error && (
        <p className="mt-4 rounded-[var(--radius-md)] bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <div className="card-surface mt-8 p-6">
          <p className="eyebrow">{result.orderNumber}</p>
          <h2 className="mt-2 font-serif text-3xl italic text-[var(--brand)]">
            {result.status}
          </h2>
          {result.productName && (
            <p className="mt-2 text-sm text-[var(--muted)]">Product: {result.productName}</p>
          )}
          {result.notes && (
            <p className="mt-2 text-sm text-[var(--muted)]">{result.notes}</p>
          )}
          <div className="mt-6 space-y-3">
            <h3 className="eyebrow">Timeline</h3>
            {result.timeline?.length ? (
              result.timeline.map((entry, i) => (
                <div
                  key={i}
                  className="border-l-2 border-[var(--brand)] pl-3 text-sm"
                >
                  <p className="font-medium text-[var(--foreground)]">{entry.status}</p>
                  {entry.note && <p className="text-[var(--muted)]">{entry.note}</p>}
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(entry.at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">No timeline updates yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
