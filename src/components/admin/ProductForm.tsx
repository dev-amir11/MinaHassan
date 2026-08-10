"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { parseJsonArray } from "@/lib/utils";

type Category = { id: string; name: string; parentId: string | null };
type Product = {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  fabrics?: string | null;
  deliveryTimeline?: string | null;
  disclaimer?: string | null;
  sizeGuide?: string | null;
  images: string;
  videoUrl?: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isPublished: boolean;
  sortOrder: number;
  categoryIds: string[];
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Product;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(parseJsonArray(initial?.images));
  const [selected, setSelected] = useState<string[]>(initial?.categoryIds || []);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
      success(
        uploaded.length === 1
          ? "Image uploaded"
          : `${uploaded.length} images uploaded`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      toastError(message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((item) => item !== url));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      shortDescription: String(form.get("shortDescription") || ""),
      description: String(form.get("description") || ""),
      fabrics: String(form.get("fabrics") || ""),
      deliveryTimeline: String(form.get("deliveryTimeline") || ""),
      disclaimer: String(form.get("disclaimer") || ""),
      sizeGuide: String(form.get("sizeGuide") || ""),
      videoUrl: String(form.get("videoUrl") || ""),
      images,
      isFeatured: form.get("isFeatured") === "on",
      isNew: form.get("isNew") === "on",
      isPublished: form.get("isPublished") === "on",
      sortOrder: Number(form.get("sortOrder") || 0),
      categoryIds: selected,
    };

    try {
      const res = await fetch(
        initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products",
        {
          method: initial?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      success(initial?.id ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save";
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 border border-black/10 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required defaultValue={initial?.name} placeholder="Name" className="border px-3 py-2 text-sm" />
        <input name="slug" defaultValue={initial?.slug} placeholder="Slug (optional)" className="border px-3 py-2 text-sm" />
      </div>
      <textarea name="shortDescription" defaultValue={initial?.shortDescription || ""} placeholder="Short description" rows={2} className="w-full border px-3 py-2 text-sm" />
      <textarea name="description" defaultValue={initial?.description || ""} placeholder="Full description" rows={5} className="w-full border px-3 py-2 text-sm" />
      <textarea name="fabrics" defaultValue={initial?.fabrics || ""} placeholder="Fabrics" rows={3} className="w-full border px-3 py-2 text-sm" />
      <textarea name="deliveryTimeline" defaultValue={initial?.deliveryTimeline || ""} placeholder="Delivery timeline" rows={2} className="w-full border px-3 py-2 text-sm" />
      <textarea name="sizeGuide" defaultValue={initial?.sizeGuide || ""} placeholder="Size guide" rows={2} className="w-full border px-3 py-2 text-sm" />
      <textarea name="disclaimer" defaultValue={initial?.disclaimer || ""} placeholder="Disclaimer" rows={2} className="w-full border px-3 py-2 text-sm" />

      <div className="space-y-3 border border-black/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Images</p>
            <p className="text-xs text-neutral-500">Upload to Supabase Storage, or paste URLs below.</p>
          </div>
          <label className="cursor-pointer border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white">
            {uploading ? "Uploading..." : "Upload images"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                void uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 bg-black/70 px-1.5 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={images.join("\n")}
          onChange={(e) =>
            setImages(
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder="Or paste image URLs (one per line)"
          rows={3}
          className="w-full border px-3 py-2 text-sm"
        />
      </div>

      <input name="videoUrl" defaultValue={initial?.videoUrl || ""} placeholder="Video URL (optional)" className="w-full border px-3 py-2 text-sm" />
      <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} className="w-40 border px-3 py-2 text-sm" />

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-neutral-500">Categories</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(cat.id)}
                onChange={(e) => {
                  setSelected((prev) =>
                    e.target.checked
                      ? [...prev, cat.id]
                      : prev.filter((id) => id !== cat.id)
                  );
                }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input name="isPublished" type="checkbox" defaultChecked={initial?.isPublished ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input name="isFeatured" type="checkbox" defaultChecked={initial?.isFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input name="isNew" type="checkbox" defaultChecked={initial?.isNew} />
          New
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading || uploading} className="rounded-xl bg-black px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50">
        {loading ? "Saving..." : uploading ? "Wait for upload..." : "Save product"}
      </button>
    </form>
  );
}
