import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetails } from "@/components/ProductDetails";
import { hydrateProducts } from "@/lib/catalog";
import { db, getProductCategoryLinks, ProductRow, toProductView } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data } = await db()
    .from("products")
    .select("name")
    .eq("slug", slug)
    .maybeSingle();
  return { title: data?.name || "Product" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await db()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || !data.is_published) notFound();

  const productRow = data as ProductRow;
  const links = await getProductCategoryLinks(productRow.id);
  const product = toProductView(
    productRow,
    links.map((l) => ({ category: l.category }))
  );

  const categoryIds = links.map((l) => l.categoryId);
  let related: ReturnType<typeof toProductView>[] = [];

  if (categoryIds.length) {
    const { data: relatedLinks } = await db()
      .from("product_categories")
      .select("product_id")
      .in("category_id", categoryIds)
      .neq("product_id", productRow.id);

    const ids = [...new Set((relatedLinks || []).map((r) => r.product_id as string))].slice(
      0,
      4
    );

    if (ids.length) {
      const { data: relatedProducts } = await db()
        .from("products")
        .select("*")
        .eq("is_published", true)
        .in("id", ids);
      related = await hydrateProducts((relatedProducts || []) as ProductRow[]);
    }
  }

  return (
    <div>
      <ProductDetails product={product} />
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] section-soft py-14">
          <div className="mx-auto max-w-7xl px-4">
            <p className="eyebrow">Continue browsing</p>
            <h2 className="mt-2 font-serif text-3xl">You May Also Like</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
