"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { ORDER_STATUSES } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  status: string;
  notes: string | null;
  productName: string | null;
};

export function OrdersManager({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [editing, setEditing] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError("");
    setLoading(true);

    const form = new FormData(formEl);
    const payload = {
      orderNumber: String(form.get("orderNumber") || ""),
      customerName: String(form.get("customerName") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      productName: String(form.get("productName") || ""),
      status: String(form.get("status") || "Received"),
      notes: String(form.get("notes") || ""),
      timelineNote: String(form.get("timelineNote") || ""),
    };

    try {
      const res = await fetch(
        editing ? `/api/admin/orders/${editing.id}` : "/api/admin/orders",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save order");

      success(editing ? "Order updated" : "Order created");
      setEditing(null);
      formEl.reset();
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this order tracking record?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      success("Order deleted");
      if (editing?.id === id) setEditing(null);
      router.refresh();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-serif text-2xl">{editing ? "Update order" : "Add order"}</h2>
        <input name="orderNumber" required defaultValue={editing?.orderNumber} key={editing?.id + "num"} placeholder="Order number" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="customerName" defaultValue={editing?.customerName || ""} key={editing?.id + "name"} placeholder="Customer name" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="customerEmail" defaultValue={editing?.customerEmail || ""} key={editing?.id + "email"} placeholder="Customer email" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="customerPhone" defaultValue={editing?.customerPhone || ""} key={editing?.id + "phone"} placeholder="Customer phone" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="productName" defaultValue={editing?.productName || ""} key={editing?.id + "prod"} placeholder="Product name" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <select name="status" defaultValue={editing?.status || "Received"} key={editing?.id + "status"} className="w-full rounded-xl border px-3 py-2 text-sm">
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <textarea name="notes" defaultValue={editing?.notes || ""} key={editing?.id + "notes"} placeholder="Internal notes" rows={2} className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="timelineNote" placeholder="Timeline note (optional)" className="w-full rounded-xl border px-3 py-2 text-sm" />
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-xl bg-black px-4 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
          {editing && (
            <button type="button" disabled={loading} onClick={() => setEditing(null)} className="rounded-xl border px-4 py-2.5 text-xs uppercase tracking-widest disabled:opacity-50">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-sm text-neutral-600">{o.status}</p>
                <p className="text-xs text-neutral-500">
                  {o.customerName} {o.productName ? `· ${o.productName}` : ""}
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <button type="button" className="underline" onClick={() => setEditing(o)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-700 underline disabled:opacity-50"
                  disabled={deletingId === o.id}
                  onClick={() => onDelete(o.id)}
                >
                  {deletingId === o.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
