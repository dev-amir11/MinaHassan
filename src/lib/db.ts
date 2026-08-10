import { getSupabaseAdmin } from "@/lib/supabase";

export function db() {
  return getSupabaseAdmin();
}

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  fabrics: string | null;
  delivery_timeline: string | null;
  disclaimer: string | null;
  size_guide: string | null;
  images: string[] | string;
  video_url: string | null;
  is_featured: boolean;
  is_new: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type QuoteRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string | null;
  city: string | null;
  event_date: string | null;
  occasion: string | null;
  size_note: string | null;
  message: string | null;
  status: string;
  product_id: string | null;
  product_name: string | null;
  product_slug: string | null;
  created_at: string;
  updated_at: string;
};

export type TrackOrderRow = {
  id: string;
  order_number: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  notes: string | null;
  timeline: unknown;
  product_name: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};

export type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
};

export function asImageArray(images: ProductRow["images"]): string[] {
  if (Array.isArray(images)) return images.map(String);
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Shape used by existing ProductCard / ProductDetails components */
export function toProductView(
  product: ProductRow,
  categories: { category: { id?: string; name: string; slug: string } }[] = []
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    fabrics: product.fabrics,
    deliveryTimeline: product.delivery_timeline,
    disclaimer: product.disclaimer,
    sizeGuide: product.size_guide,
    images: JSON.stringify(asImageArray(product.images)),
    videoUrl: product.video_url,
    isFeatured: product.is_featured,
    isNew: product.is_new,
    isPublished: product.is_published,
    sortOrder: product.sort_order,
    categories,
  };
}

export async function getProductCategoryLinks(productId: string) {
  const { data, error } = await db()
    .from("product_categories")
    .select("category_id, categories(id, name, slug)")
    .eq("product_id", productId);

  if (error) throw error;
  return (data || []).map((row) => {
    const category = Array.isArray(row.categories)
      ? row.categories[0]
      : row.categories;
    return {
      categoryId: row.category_id as string,
      category: category as { id: string; name: string; slug: string },
    };
  });
}

export async function setProductCategories(productId: string, categoryIds: string[]) {
  await db().from("product_categories").delete().eq("product_id", productId);
  if (!categoryIds.length) return;
  const { error } = await db().from("product_categories").insert(
    categoryIds.map((category_id) => ({
      product_id: productId,
      category_id,
    }))
  );
  if (error) throw error;
}

export async function touchUpdatedAt(table: string, id: string) {
  const { error } = await db()
    .from(table)
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
