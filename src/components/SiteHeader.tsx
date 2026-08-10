"use client";

import Link from "next/link";
import { useState } from "react";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
};

export function SiteHeader({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  return (
    <header>
      <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
        Formals &amp; Bridals — Request a personal quote
      </div>
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="brand-mark text-2xl tracking-tight text-slate-900">
                Saira Virk
                <span className="text-[var(--brand)]">.</span>
              </Link>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <Link href="/" className="nav-link !text-slate-900">
                Home
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="nav-link"
                  onMouseEnter={() => setCollectionsOpen(true)}
                  onClick={() => setCollectionsOpen((v) => !v)}
                >
                  Collections
                </button>
                {collectionsOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-3 min-w-64 rounded-md border border-slate-100 bg-white p-4 shadow-lg"
                    onMouseLeave={() => setCollectionsOpen(false)}
                  >
                    {categories.map((cat) => (
                      <div key={cat.id} className="mb-3 last:mb-0">
                        <Link
                          href={`/collections/${cat.slug}`}
                          className="block font-heading text-base font-bold text-slate-900 transition hover:text-[var(--brand)]"
                          onClick={() => setCollectionsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/collections/${child.slug}`}
                            className="mt-1.5 block pl-3 text-sm text-slate-500 transition hover:text-[var(--brand)]"
                            onClick={() => setCollectionsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-slate-900 sm:inline"
              >
                WhatsApp
              </a>
              <Link
                href="/track-order"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-900"
              >
                Track
              </Link>
              <button
                type="button"
                className="p-2 text-slate-400 transition-colors hover:text-slate-900 md:hidden"
                aria-label="Open menu"
                onClick={() => setOpen((v) => !v)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="absolute left-0 top-full z-50 flex w-full flex-col gap-4 border-b border-slate-100 bg-white p-4 shadow-lg md:hidden">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block w-full font-medium text-slate-900 transition-colors hover:text-[var(--brand)]"
            >
              Home
            </Link>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                Collections
              </p>
              {categories.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block py-1 font-medium text-slate-900"
                  >
                    {cat.name}
                  </Link>
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/collections/${child.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-1 pl-4 text-sm text-slate-500"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="block w-full font-medium text-slate-500 transition-colors hover:text-[var(--brand)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full font-medium text-slate-500 transition-colors hover:text-[var(--brand)]"
            >
              Contact
            </Link>
            <Link
              href="/faqs"
              onClick={() => setOpen(false)}
              className="block w-full font-medium text-slate-500 transition-colors hover:text-[var(--brand)]"
            >
              FAQs
            </Link>
            <Link
              href="/track-order"
              onClick={() => setOpen(false)}
              className="block w-full font-medium text-slate-500 transition-colors hover:text-[var(--brand)]"
            >
              Track Order
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
