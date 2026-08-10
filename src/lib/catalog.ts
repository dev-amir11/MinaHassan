import { asImageArray, CategoryRow, db, ProductRow, toProductView } from "@/lib/db";

export type CategoryShowcase = {
  id: string;
  name: string;
  slug: string;
  images: string[];
};

/** Top-level categories with product image slides for home cards. */
export async function getCategoryShowcases(limitImages = 5): Promise<CategoryShowcase[]> {
  const { data: parents, error } = await db()
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const result: CategoryShowcase[] = [];

  for (const parent of (parents || []) as CategoryRow[]) {
    const { data: children } = await db()
      .from("categories")
      .select("id")
      .eq("is_visible", true)
      .eq("parent_id", parent.id);

    const categoryIds = [parent.id, ...((children || []) as { id: string }[]).map((c) => c.id)];

    const images: string[] = [];
    if (parent.image_url) images.push(parent.image_url);

    const { data: links } = await db()
      .from("product_categories")
      .select("product_id")
      .in("category_id", categoryIds)
      .limit(24);

    const productIds = [...new Set((links || []).map((l) => l.product_id as string))];

    if (productIds.length) {
      const { data: products } = await db()
        .from("products")
        .select("images")
        .eq("is_published", true)
        .in("id", productIds)
        .order("is_featured", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(12);

      for (const product of (products || []) as Pick<ProductRow, "images">[]) {
        const first = asImageArray(product.images)[0];
        if (first && !images.includes(first)) images.push(first);
        if (images.length >= limitImages) break;
      }
    }

    result.push({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      images: images.slice(0, limitImages),
    });
  }

  return result;
}

export async function getNavCategories() {
  const { data: parents, error } = await db()
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const result = [];
  for (const parent of (parents || []) as CategoryRow[]) {
    const { data: children, error: childError } = await db()
      .from("categories")
      .select("id, name, slug")
      .eq("is_visible", true)
      .eq("parent_id", parent.id)
      .order("sort_order", { ascending: true });
    if (childError) throw childError;

    result.push({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      children: children || [],
    });
  }
  return result;
}

export async function getCategoryWithDescendants(slug: string) {
  const { data: category, error } = await db()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!category) return null;

  const cat = category as CategoryRow;

  const { data: children, error: childError } = await db()
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .eq("parent_id", cat.id)
    .order("sort_order", { ascending: true });
  if (childError) throw childError;

  let parent = null;
  if (cat.parent_id) {
    const { data: parentRow } = await db()
      .from("categories")
      .select("*")
      .eq("id", cat.parent_id)
      .maybeSingle();
    parent = parentRow;
  }

  const childRows = (children || []) as CategoryRow[];
  const ids = [cat.id, ...childRows.map((c) => c.id)];

  return {
    category: {
      ...cat,
      description: cat.description,
      children: childRows,
      parent,
    },
    ids,
  };
}

export async function getProductsByCategoryIds(categoryIds: string[]) {
  if (!categoryIds.length) return [];

  const { data: links, error } = await db()
    .from("product_categories")
    .select("product_id")
    .in("category_id", categoryIds);
  if (error) throw error;

  const productIds = [...new Set((links || []).map((l) => l.product_id as string))];
  if (!productIds.length) return [];

  const { data: products, error: productError } = await db()
    .from("products")
    .select("*")
    .eq("is_published", true)
    .in("id", productIds)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (productError) throw productError;

  return hydrateProducts((products || []) as ProductRow[]);
}

export async function hydrateProducts(products: ProductRow[]) {
  const views = [];
  for (const product of products) {
    const { data: links } = await db()
      .from("product_categories")
      .select("categories(id, name, slug)")
      .eq("product_id", product.id);

    const categories = (links || []).map((row) => {
      const category = Array.isArray(row.categories)
        ? row.categories[0]
        : row.categories;
      return {
        category: category as { id: string; name: string; slug: string },
      };
    });

    views.push(toProductView(product, categories));
  }
  return views;
}

export async function getPublishedProducts(opts?: {
  featured?: boolean;
  isNew?: boolean;
  take?: number;
}) {
  let query = db().from("products").select("*").eq("is_published", true);

  if (opts?.featured) query = query.eq("is_featured", true);
  if (opts?.isNew) query = query.eq("is_new", true);

  query = query.order(opts?.featured ? "updated_at" : "created_at", {
    ascending: false,
  });

  if (opts?.take) query = query.limit(opts.take);

  const { data, error } = await query;
  if (error) throw error;
  return hydrateProducts((data || []) as ProductRow[]);
}
