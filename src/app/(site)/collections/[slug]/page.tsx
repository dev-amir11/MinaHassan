import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryWithDescendants, getProductsByCategoryIds } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryWithDescendants(slug);
  if (!data) return { title: "Collection" };
  return { title: data.category.name };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryWithDescendants(slug);
  if (!data) notFound();

  const { category, ids } = data;
  const products = await getProductsByCategoryIds(ids);

  return (
    <div>
      <section className="border-b border-[var(--border)] section-soft px-4 py-16 text-center md:py-20">
        <p className="eyebrow">Collection</p>
        <h1 className="mt-3 font-serif text-5xl italic md:text-6xl">{category.name}</h1>
        {category.description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--muted)] md:text-base">
            {category.description}
          </p>
        )}
        {category.children.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/collections/${child.slug}`}
                className="btn-secondary !px-4 !py-2.5"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {products.length === 0 ? (
          <p className="text-center text-neutral-500">No products in this collection yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
