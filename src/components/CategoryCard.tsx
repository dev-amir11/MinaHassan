"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  href: string;
  name: string;
  images: string[];
};

export function CategoryCard({ href, name, images }: Props) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <Link
      href={href}
      className="group relative block h-64 overflow-hidden rounded-lg bg-slate-200"
    >
      {slides.length > 0 ? (
        slides.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:scale-105 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-slate-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        {slides.length > 1 && (
          <div className="mt-3 flex gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
