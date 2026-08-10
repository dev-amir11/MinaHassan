"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import {
  ClothingGuide,
  DEFAULT_CLOTHING_GUIDE,
  DEFAULT_CLOTHING_SIZES,
  EMPTY_SIZE_ROW,
  parseClothingGuide,
  serializeClothingGuide,
  SizeChartRow,
} from "@/lib/product-options";
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

const CHART_COLUMNS: { key: keyof SizeChartRow; label: string }[] = [
  { key: "size", label: "Size" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "length", label: "Length" },
];

function initialGuide(sizeGuide?: string | null): ClothingGuide {
  const { guide, plainText } = parseClothingGuide(sizeGuide);
  if (guide) {
    return {
      ...guide,
      sizes: guide.sizes.length ? guide.sizes : [...DEFAULT_CLOTHING_SIZES],
    };
  }
  return {
    ...DEFAULT_CLOTHING_GUIDE,
    notes: plainText || DEFAULT_CLOTHING_GUIDE.notes,
  };
}

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
  const [guide, setGuide] = useState<ClothingGuide>(() => initialGuide(initial?.sizeGuide));
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [customSize, setCustomSize] = useState("");

  const sizePresets = useMemo(() => [...DEFAULT_CLOTHING_SIZES], []);

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

  function updateRow(index: number, key: keyof SizeChartRow, value: string) {
    setGuide((prev) => ({
      ...prev,
      rows: prev.rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));
  }

  function addColor() {
    const name = colorName.trim();
    if (!name) return;
    if (guide.colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toastError("Color already added");
      return;
    }
    setGuide((prev) => ({
      ...prev,
      colors: [...prev.colors, { name, hex: colorHex || "#000000" }],
    }));
    setColorName("");
  }

  function toggleSize(size: string) {
    setGuide((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  }

  function addCustomSize() {
    const size = customSize.trim();
    if (!size) return;
    if (!guide.sizes.includes(size)) {
      setGuide((prev) => ({ ...prev, sizes: [...prev.sizes, size] }));
    }
    setCustomSize("");
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
      sizeGuide: serializeClothingGuide(guide),
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
    <form onSubmit={onSubmit} className="max-w-4xl space-y-4 border border-black/10 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required defaultValue={initial?.name} placeholder="Name" className="border px-3 py-2 text-sm" />
        <input name="slug" defaultValue={initial?.slug} placeholder="Slug (optional)" className="border px-3 py-2 text-sm" />
      </div>
      <textarea name="shortDescription" defaultValue={initial?.shortDescription || ""} placeholder="Short description" rows={2} className="w-full border px-3 py-2 text-sm" />
      <textarea name="description" defaultValue={initial?.description || ""} placeholder="Full description" rows={5} className="w-full border px-3 py-2 text-sm" />
      <textarea name="fabrics" defaultValue={initial?.fabrics || ""} placeholder="Fabrics" rows={3} className="w-full border px-3 py-2 text-sm" />
      <textarea name="deliveryTimeline" defaultValue={initial?.deliveryTimeline || ""} placeholder="Delivery timeline" rows={2} className="w-full border px-3 py-2 text-sm" />
      <textarea name="disclaimer" defaultValue={initial?.disclaimer || ""} placeholder="Disclaimer" rows={2} className="w-full border px-3 py-2 text-sm" />

      {/* Variants */}
      <div className="space-y-4 border border-black/10 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Variants</p>
          <p className="text-xs text-neutral-500">Add available colors and sizes for this clothing piece.</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Colors</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {guide.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() =>
                  setGuide((prev) => ({
                    ...prev,
                    colors: prev.colors.filter((c) => c.name !== color.name),
                  }))
                }
                className="inline-flex items-center gap-2 rounded border border-black/10 px-2.5 py-1.5 text-sm"
                title="Remove color"
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/20"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
                <span className="text-neutral-400">×</span>
              </button>
            ))}
            {guide.colors.length === 0 && (
              <p className="text-sm text-neutral-500">No colors yet.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="h-9 w-12 cursor-pointer border bg-white p-1"
              aria-label="Color swatch"
            />
            <input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Color name (e.g. Ivory)"
              className="min-w-[160px] flex-1 border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addColor}
              className="border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white"
            >
              Add color
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Sizes</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {sizePresets.map((size) => {
              const active = guide.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`rounded border px-3 py-1.5 text-sm ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-neutral-600"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.sizes
              .filter((s) => !sizePresets.includes(s as (typeof DEFAULT_CLOTHING_SIZES)[number]))
              .map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="rounded border border-black bg-black px-3 py-1.5 text-sm text-white"
                  title="Remove size"
                >
                  {size} ×
                </button>
              ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom size label"
              className="min-w-[160px] flex-1 border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addCustomSize}
              className="border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white"
            >
              Add size
            </button>
          </div>
        </div>
      </div>

      {/* Clothing size guide */}
      <div className="space-y-4 border border-black/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Clothing size guide</p>
            <p className="text-xs text-neutral-500">
              Bust, waist, hips, shoulder, sleeve, and length for each size.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-500">Unit</span>
            <select
              value={guide.unit}
              onChange={(e) =>
                setGuide((prev) => ({
                  ...prev,
                  unit: e.target.value === "cm" ? "cm" : "in",
                }))
              }
              className="border px-2 py-1.5"
            >
              <option value="in">Inches</option>
              <option value="cm">Centimeters</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setGuide((prev) => ({
                  ...DEFAULT_CLOTHING_GUIDE,
                  colors: prev.colors,
                  sizes: prev.sizes.length ? prev.sizes : DEFAULT_CLOTHING_GUIDE.sizes,
                }))
              }
              className="border border-black/20 px-2 py-1.5 text-xs uppercase tracking-widest"
            >
              Load defaults
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left">
                {CHART_COLUMNS.map((col) => (
                  <th key={col.key} className="border border-black/10 px-2 py-2 font-medium">
                    {col.label}
                    {col.key !== "size" ? ` (${guide.unit})` : ""}
                  </th>
                ))}
                <th className="border border-black/10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {guide.rows.map((row, index) => (
                <tr key={index}>
                  {CHART_COLUMNS.map((col) => (
                    <td key={col.key} className="border border-black/10 p-1">
                      <input
                        value={row[col.key]}
                        onChange={(e) => updateRow(index, col.key, e.target.value)}
                        className="w-full min-w-[4rem] px-2 py-1.5 outline-none"
                      />
                    </td>
                  ))}
                  <td className="border border-black/10 px-2 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setGuide((prev) => ({
                          ...prev,
                          rows: prev.rows.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() =>
            setGuide((prev) => ({
              ...prev,
              rows: [...prev.rows, { ...EMPTY_SIZE_ROW }],
            }))
          }
          className="border border-black px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white"
        >
          Add size row
        </button>

        <textarea
          value={guide.notes}
          onChange={(e) => setGuide((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Size guide notes (fit tips, custom sizing, etc.)"
          rows={3}
          className="w-full border px-3 py-2 text-sm"
        />
      </div>

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
