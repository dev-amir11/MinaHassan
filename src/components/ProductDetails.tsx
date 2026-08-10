"use client";

import { useEffect, useMemo, useState } from "react";
import { GetQuoteModal } from "@/components/GetQuoteModal";
import { parseClothingGuide } from "@/lib/product-options";
import { parseJsonArray } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  fabrics: string | null;
  deliveryTimeline: string | null;
  disclaimer: string | null;
  sizeGuide: string | null;
  images: string;
  videoUrl: string | null;
  categories: { category: { name: string; slug: string } }[];
};

export function ProductDetails({ product }: { product: Product }) {
  const images = parseJsonArray(product.images);
  const { guide, plainText } = useMemo(
    () => parseClothingGuide(product.sizeGuide),
    [product.sizeGuide]
  );
  const colors = guide?.colors || [];
  const sizes = guide?.sizes || [];

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [tab, setTab] = useState<"description" | "delivery" | "disclaimer" | "size">(
    "description"
  );

  useEffect(() => {
    if (!selectedColor && colors[0]) setSelectedColor(colors[0].name);
    if (!selectedSize && sizes[0]) setSelectedSize(sizes[0]);
  }, [colors, sizes, selectedColor, selectedSize]);

  function openQuote() {
    setOpen(true);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-4">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active] || "/placeholder-product.svg"}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-lg bg-gray-100 transition ${
                  active === i ? "ring-2 ring-[var(--brand)]" : "hover:opacity-75"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover object-center" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.categories[0] && (
          <p className="mb-2 text-sm font-medium text-[var(--brand)]">
            {product.categories[0].category.name}
          </p>
        )}
        <h1 className="mb-2 font-heading text-3xl font-bold text-slate-900">{product.name}</h1>
        {product.shortDescription && (
          <p className="mb-8 leading-relaxed text-slate-600">{product.shortDescription}</p>
        )}

        {colors.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-slate-900">
              Color{selectedColor ? `: ${selectedColor}` : ""}
            </h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const activeColor = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-8 w-8 rounded-full border border-slate-200 transition ${
                      activeColor
                        ? "ring-2 ring-[var(--brand)] ring-offset-2"
                        : "hover:ring-2 hover:ring-slate-300 hover:ring-offset-2"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                );
              })}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const activeSize = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      activeSize
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                        : "border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={openQuote}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-8 py-3 font-bold text-white transition-colors hover:bg-[var(--brand-hover)]"
        >
          Get Quote
        </button>
        <p className="mt-3 text-xs text-slate-500">
          Submit the form and we&apos;ll also open WhatsApp with your request.
        </p>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["description", "Description"],
                ["delivery", "Delivery"],
                ["size", "Size Guide"],
                ["disclaimer", "Disclaimer"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  tab === key
                    ? "bg-[var(--brand)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="text-sm leading-relaxed text-slate-600">
            {tab === "description" && (
              <div className="whitespace-pre-line">
                <p>{product.description}</p>
                {product.fabrics && (
                  <p className="mt-4">
                    <strong className="text-slate-900">Fabrics</strong>
                    {"\n"}
                    {product.fabrics}
                  </p>
                )}
              </div>
            )}
            {tab === "delivery" && (
              <p className="whitespace-pre-line">
                {product.deliveryTimeline || "Contact us for timeline."}
              </p>
            )}
            {tab === "size" && (
              <div className="space-y-4">
                {guide && guide.rows.length > 0 ? (
                  <>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Measurements in {guide.unit === "cm" ? "centimeters" : "inches"}
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-900">
                          <tr>
                            <th className="px-3 py-2 font-semibold">Size</th>
                            <th className="px-3 py-2 font-semibold">Bust</th>
                            <th className="px-3 py-2 font-semibold">Waist</th>
                            <th className="px-3 py-2 font-semibold">Hips</th>
                            <th className="px-3 py-2 font-semibold">Shoulder</th>
                            <th className="px-3 py-2 font-semibold">Sleeve</th>
                            <th className="px-3 py-2 font-semibold">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guide.rows.map((row, i) => (
                            <tr key={`${row.size}-${i}`} className="border-t border-slate-100">
                              <td className="px-3 py-2 font-medium text-slate-900">{row.size}</td>
                              <td className="px-3 py-2">{row.bust}</td>
                              <td className="px-3 py-2">{row.waist}</td>
                              <td className="px-3 py-2">{row.hips}</td>
                              <td className="px-3 py-2">{row.shoulder}</td>
                              <td className="px-3 py-2">{row.sleeve}</td>
                              <td className="px-3 py-2">{row.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="whitespace-pre-line">
                    {plainText ||
                      "Custom sizing available. Mention your measurements in the quote form."}
                  </p>
                )}
                {guide?.notes && (
                  <p className="whitespace-pre-line text-slate-500">{guide.notes}</p>
                )}
              </div>
            )}
            {tab === "disclaimer" && (
              <p className="whitespace-pre-line">
                {product.disclaimer || "Colors may vary by device."}
              </p>
            )}
          </div>
        </div>
      </div>

      <GetQuoteModal
        open={open}
        onClose={() => setOpen(false)}
        product={{ id: product.id, name: product.name, slug: product.slug }}
        selectedColor={selectedColor || undefined}
        selectedSize={selectedSize || undefined}
      />
    </div>
  );
}
