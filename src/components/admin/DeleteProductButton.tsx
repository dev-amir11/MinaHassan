"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      className="text-red-700 underline disabled:opacity-50"
      disabled={loading}
      onClick={async () => {
        if (!confirm("Delete this product?")) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Failed to delete");
          success("Product deleted");
          router.refresh();
        } catch (err) {
          toastError(err instanceof Error ? err.message : "Failed to delete");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
