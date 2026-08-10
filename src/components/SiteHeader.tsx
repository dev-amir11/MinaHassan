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
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--announcement)] px-4 py-2.5 text-center text-[0.68rem] font-medium tracking-[0.18em] text-[#f7f2ee] uppercase">
        Formals &amp; Bridals — Request a personal quote
      </div>
      <div className="border-b border-[var(--border)] bg-[rgba(255,252,250,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:py-5">
          <button
            type="button"
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--surface)] lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="block h-0.5 w-4 rounded-full bg-[var(--foreground)]" />
            <span className="block h-0.5 w-4 rounded-full bg-[var(--foreground)]" />
            <span className="block h-0.5 w-4 rounded-full bg-[var(--foreground)]" />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="/" className="nav-link">
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
                  className="absolute left-0 top-full z-50 mt-4 min-w-64 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-lift)]"
                  onMouseLeave={() => setCollectionsOpen(false)}
                >
                  {categories.map((cat) => (
                    <div key={cat.id} className="mb-3 last:mb-0">
                      <Link
                        href={`/collections/${cat.slug}`}
                        className="block font-serif text-xl text-[var(--foreground)] transition hover:text-[var(--brand)]"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/collections/${child.slug}`}
                          className="mt-1.5 block pl-3 text-sm text-[var(--muted)] transition hover:text-[var(--brand)]"
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
          </nav>

          <Link href="/" className="brand-mark text-[1.35rem] md:text-2xl">
            MINA HASAN
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary hidden !px-4 !py-2.5 sm:inline-flex"
            >
              WhatsApp
            </a>
            <Link href="/track-order" className="nav-link">
              Track
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--background)] lg:hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <span className="brand-mark text-lg">MINA HASAN</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--muted)]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-5 p-6">
            <Link href="/" onClick={() => setOpen(false)} className="nav-link block">
              Home
            </Link>
            <div>
              <p className="eyebrow mb-3">Collections</p>
              {categories.map((cat) => (
                <div key={cat.id} className="mb-3">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block py-1 font-serif text-2xl"
                  >
                    {cat.name}
                  </Link>
                  {cat.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/collections/${child.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-1 pl-4 text-sm text-[var(--muted)]"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Link href="/about" onClick={() => setOpen(false)} className="nav-link block">
              About Us
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="nav-link block">
              Contact Us
            </Link>
            <Link href="/faqs" onClick={() => setOpen(false)} className="nav-link block">
              FAQs
            </Link>
            <Link href="/track-order" onClick={() => setOpen(false)} className="nav-link block">
              Track Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
