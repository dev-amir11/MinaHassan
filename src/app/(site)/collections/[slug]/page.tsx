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
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              {category.description}
            </p>
          )}
          {category.children.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collections/${child.slug}`}
                  className="rounded-md bg-[var(--brand-soft)] px-4 py-2.5 text-sm font-medium text-[var(--brand-hover)] transition hover:bg-[var(--brand-muted)]"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-center text-slate-500">No products in this collection yet.</p>
        ) : (
          <>
            <p className="mb-8 text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">{products.length}</span> results
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
