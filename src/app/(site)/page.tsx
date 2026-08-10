import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryShowcases, getPublishedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [featured, newest, categories] = await Promise.all([
    getPublishedProducts({ featured: true, take: 8 }),
    getPublishedProducts({ isNew: true, take: 8 }),
    getCategoryShowcases(5),
  ]);

  return (
    <div className="bg-white text-slate-600 antialiased">
      {/* Hero — Lumina split layout */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-slate-50 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Bridals crafted with </span>
                  <span className="block text-[var(--brand)] xl:inline">love</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  Luxurious occasion wear for Mehndi, Barat, Walima and beyond. Every piece is
                  quote-based — tailored to your celebration.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/collections/events"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-[var(--brand)] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[var(--brand-hover)] md:py-4 md:text-lg"
                    >
                      Explore Bridals
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/contact"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-[var(--brand-soft)] px-8 py-3 text-base font-medium text-[var(--brand-hover)] transition-colors hover:bg-[var(--brand-muted)] md:py-4 md:text-lg"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80"
            alt="Bridal fashion"
          />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-heading text-2xl font-bold text-slate-900">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                href={`/collections/${cat.slug}`}
                name={cat.name}
                images={cat.images}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-slate-900">New Arrivals</h2>
            <Link
              href="/collections/events"
              className="flex items-center gap-1 font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
            >
              View all <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Featured Looks</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo band */}
      <section className="bg-[var(--brand)] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="mb-6 text-center md:mb-0 md:text-left">
            <h2 className="mb-2 font-heading text-2xl font-bold text-white">
              We would love to be a part of your special day
            </h2>
            <p className="text-[var(--brand-soft)]">
              No online prices — every bridal and formal piece begins with a personal quote.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-md bg-white px-8 py-3 font-bold text-[var(--brand)] shadow-lg transition-colors hover:bg-slate-100"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
