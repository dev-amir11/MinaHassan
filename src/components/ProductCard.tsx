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
        <div className="product-media relative aspect-[3/4]">
          <Link href={`/products/${product.slug}`} className="block h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute bottom-3 left-3 right-3 rounded-md bg-slate-900 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          >
            Get Quote
          </button>
        </div>
        <div className="mt-4">
          {categoryName && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {categoryName}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-medium text-slate-700 transition group-hover:text-[var(--brand)]">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.shortDescription}</p>
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
