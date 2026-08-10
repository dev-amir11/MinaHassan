"use client";

import { useState } from "react";
import { GetQuoteModal } from "@/components/GetQuoteModal";
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
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"description" | "delivery" | "disclaimer" | "size">(
    "description"
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div>
        <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active] || "/placeholder-product.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActive(i)}
                className={`aspect-square overflow-hidden rounded-[var(--radius-sm)] border-2 transition ${
                  active === i ? "border-[var(--brand)]" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.categories[0] && (
          <p className="eyebrow">{product.categories[0].category.name}</p>
        )}
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
        {product.shortDescription && (
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        <button type="button" onClick={() => setOpen(true)} className="btn-primary mt-8 w-full">
          Get Quote
        </button>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Submit the form and we&apos;ll also open WhatsApp with your request.
        </p>

        <div className="mt-10 flex flex-wrap gap-2 rounded-[var(--radius-md)] bg-[var(--surface)]/70 p-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
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
              className={`rounded-[var(--radius-sm)] px-3 py-2.5 transition ${
                tab === key
                  ? "bg-[var(--surface-elevated)] text-[var(--brand)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
          {tab === "description" && (
            <>
              <p>{product.description}</p>
              {product.fabrics && (
                <p className="mt-4">
                  <strong className="text-[var(--foreground)]">Fabrics</strong>
                  {"\n"}
                  {product.fabrics}
                </p>
              )}
            </>
          )}
          {tab === "delivery" && (product.deliveryTimeline || "Contact us for timeline.")}
          {tab === "size" &&
            (product.sizeGuide ||
              "Custom sizing available. Mention your measurements in the quote form.")}
          {tab === "disclaimer" && (product.disclaimer || "Colors may vary by device.")}
        </div>
      </div>

      <GetQuoteModal
        open={open}
        onClose={() => setOpen(false)}
        product={{ id: product.id, name: product.name, slug: product.slug }}
      />
    </div>
  );
}
