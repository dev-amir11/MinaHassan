import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getPublishedProducts } from "@/lib/catalog";
import { CategoryRow, db } from "@/lib/db";

export default async function HomePage() {
  const [featured, newest, categoriesResult] = await Promise.all([
    getPublishedProducts({ featured: true, take: 8 }),
    getPublishedProducts({ isNew: true, take: 8 }),
    db()
      .from("categories")
      .select("*")
      .eq("is_visible", true)
      .is("parent_id", null)
      .order("sort_order", { ascending: true }),
  ]);

  const categories = (categoriesResult.data || []) as CategoryRow[];

  return (
    <div>
      <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-[var(--footer)] text-[#f7f2ee]">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-80"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--footer)] via-[var(--footer)]/45 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-44">
          <p className="eyebrow !text-[var(--accent)]">New season · Bridals</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl italic leading-[1.05] text-[#f7f2ee] md:text-7xl lg:text-8xl">
            Bridals crafted with love
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f7f2ee]/80 md:text-lg">
            Luxurious occasion wear for Mehndi, Barat, Walima and beyond. Every
            piece is quote-based — tailored to your celebration.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/collections/events" className="btn-ghost">
              Explore Bridals
            </Link>
            <Link href="/contact" className="btn-light">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">Shop by Category</h2>
          </div>
          <p className="max-w-md text-sm text-[var(--muted)] md:text-right">
            Events, Formal, Western and Unstitched — curated for every celebration.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group relative flex min-h-56 items-end overflow-hidden rounded-[var(--radius-xl)] bg-[var(--brand)] p-6 shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--footer)]/85 via-[var(--brand)]/40 to-[var(--accent)]/20 transition duration-500 group-hover:from-[var(--footer)]/90" />
              <div className="relative text-[#f7f2ee]">
                <h3 className="font-serif text-3xl italic">{cat.name}</h3>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#f7f2ee]/70 transition group-hover:text-[#f7f2ee]">
                  View collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-soft py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="eyebrow">Just arrived</p>
          <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">New Arrivals</h2>
          <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <p className="eyebrow">Editor&apos;s picks</p>
        <h2 className="mt-2 font-serif text-4xl italic md:text-5xl">Featured Looks</h2>
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="relative mx-4 mb-10 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--footer)] px-6 py-20 text-center text-[#f7f2ee] md:mx-8 md:py-24">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[var(--brand)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <p className="eyebrow relative !text-[var(--accent)]">Mina Hasan</p>
        <h2 className="relative mx-auto mt-4 max-w-2xl font-serif text-4xl italic text-[#f7f2ee] md:text-5xl">
          We would love to be a part of your special day
        </h2>
        <div className="divider-gold relative mx-auto my-7 max-w-40" />
        <p className="relative mx-auto max-w-xl text-sm text-[var(--footer-muted)] md:text-base">
          No online prices — every bridal and formal piece begins with a personal
          quote.
        </p>
        <Link href="/contact" className="btn-ghost relative mt-9 inline-flex">
          Get in touch
        </Link>
      </section>
    </div>
  );
}
