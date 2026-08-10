"use client";

import Link from "next/link";
import { useState } from "react";
import { GetQuoteModal } from "@/components/GetQuoteModal";
import { parseJsonArray } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    images: string;
    categories?: { category: { name: string } }[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const images = parseJsonArray(product.images);
  const image = images[0] || "/placeholder-product.svg";
  const categoryName = product.categories?.[0]?.category.name;

  return (
    <>
      <article className="group">
        <div className="product-media relative aspect-[3/4] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
          <Link href={`/products/${product.slug}`} className="block h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-4 left-4 right-4 translate-y-3 rounded-[var(--radius-md)] bg-[rgba(255,252,250,0.92)] px-4 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand)] opacity-0 shadow-[var(--shadow-soft)] backdrop-blur-md transition duration-400 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Get Quote
          </button>
        </div>
        <div className="mt-5 space-y-1.5 px-1">
          {categoryName && <p className="eyebrow !text-[var(--muted)]">{categoryName}</p>}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-[1.65rem] tracking-[-0.02em] text-[var(--foreground)] transition group-hover:text-[var(--brand)]">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
              {product.shortDescription}
            </p>
          )}
        </div>
      </article>
      <GetQuoteModal
        open={open}
        onClose={() => setOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
        }}
      />
    </>
  );
}
