"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

type Quote = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string | null;
  city: string | null;
  eventDate: string | null;
  occasion: string | null;
  sizeNote: string | null;
  message: string | null;
  status: string;
  productName: string | null;
  createdAt: string | Date;
};

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      success(`Marked as ${status}`);
      router.refresh();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {quotes.map((q) => (
        <article key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl">{q.fullName}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {q.email} · {q.phone}
              </p>
              {(q.city || q.country) && (
                <p className="text-sm text-neutral-600">
                  {[q.city, q.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <select
              value={q.status}
              disabled={updatingId === q.id}
              onChange={(e) => setStatus(q.id, e.target.value)}
              className="rounded-lg border px-2 py-1 text-xs uppercase disabled:opacity-50"
            >
              <option value="new">new</option>
              <option value="contacted">contacted</option>
              <option value="closed">closed</option>
            </select>
          </div>
          <div className="mt-3 grid gap-1 text-sm">
            {q.productName && <p>Product: {q.productName}</p>}
            {q.occasion && <p>Occasion: {q.occasion}</p>}
            {q.eventDate && <p>Event date: {q.eventDate}</p>}
            {q.sizeNote && <p>Size: {q.sizeNote}</p>}
            {q.message && <p className="text-neutral-700">{q.message}</p>}
            <p className="text-xs text-neutral-400">
              {new Date(q.createdAt).toLocaleString()}
            </p>
          </div>
        </article>
      ))}
      {quotes.length === 0 && (
        <p className="text-sm text-neutral-500">No quote requests yet.</p>
      )}
    </div>
  );
}
