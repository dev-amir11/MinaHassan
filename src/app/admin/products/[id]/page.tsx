import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { asImageArray, CategoryRow, db, getProductCategoryLinks, ProductRow } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [{ data: product }, { data: categories }] = await Promise.all([
    db().from("products").select("*").eq("id", id).maybeSingle(),
    db().from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();
  const p = product as ProductRow;
  const links = await getProductCategoryLinks(p.id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Edit product</h1>
      <ProductForm
        categories={((categories || []) as CategoryRow[]).map((c) => ({
          id: c.id,
          name: c.name,
          parentId: c.parent_id,
        }))}
        initial={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.short_description,
          description: p.description,
          fabrics: p.fabrics,
          deliveryTimeline: p.delivery_timeline,
          disclaimer: p.disclaimer,
          sizeGuide: p.size_guide,
          images: JSON.stringify(asImageArray(p.images)),
          videoUrl: p.video_url,
          isFeatured: p.is_featured,
          isNew: p.is_new,
          isPublished: p.is_published,
          sortOrder: p.sort_order,
          categoryIds: links.map((l) => l.categoryId),
        }}
      />
    </div>
  );
}
