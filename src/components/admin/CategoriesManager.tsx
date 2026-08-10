"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isVisible: boolean;
  parent?: { name: string } | null;
};

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [editing, setEditing] = useState<Category | null>(null);
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
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      description: String(form.get("description") || ""),
      parentId: String(form.get("parentId") || "") || null,
      sortOrder: Number(form.get("sortOrder") || 0),
      isVisible: form.get("isVisible") === "on",
    };

    try {
      const res = await fetch(
        editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      success(editing ? "Category updated" : "Category created");
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
    if (!confirm("Delete category? Child categories will also be deleted.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      success("Category deleted");
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
        <h2 className="font-serif text-2xl">{editing ? "Edit category" : "Add category"}</h2>
        <input name="name" required defaultValue={editing?.name} key={editing?.id + "-name"} placeholder="Name" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input name="slug" defaultValue={editing?.slug} key={editing?.id + "-slug"} placeholder="Slug (optional)" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <textarea name="description" defaultValue={editing?.description || ""} key={editing?.id + "-desc"} placeholder="Description" rows={3} className="w-full rounded-xl border px-3 py-2 text-sm" />
        <select name="parentId" defaultValue={editing?.parentId || ""} key={editing?.id + "-parent"} className="w-full rounded-xl border px-3 py-2 text-sm">
          <option value="">No parent (top level)</option>
          {categories
            .filter((c) => c.id !== editing?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <input name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} key={editing?.id + "-sort"} className="w-full rounded-xl border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input name="isVisible" type="checkbox" defaultChecked={editing?.isVisible ?? true} key={editing?.id + "-vis"} />
          Visible
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-4 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setEditing(null)}
              className="rounded-xl border px-4 py-2.5 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#f7f5f2] text-xs uppercase">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Parent</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-black/5">
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-neutral-500">/{c.slug}</div>
                </td>
                <td className="p-3 text-xs">{c.parent?.name || "—"}</td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs">
                    <button type="button" className="underline" onClick={() => setEditing(c)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-700 underline disabled:opacity-50"
                      disabled={deletingId === c.id}
                      onClick={() => onDelete(c.id)}
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
