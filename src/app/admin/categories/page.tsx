import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { CategoryRow, db } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const { data, error } = await db()
    .from("categories")
    .select("*, parent:categories!parent_id(name)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  const categories = ((data || []) as Array<CategoryRow & { parent?: { name: string } | null }>).map(
    (c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: c.parent_id,
      sortOrder: c.sort_order,
      isVisible: c.is_visible,
      parent: c.parent ? { name: c.parent.name } : null,
    })
  );

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
