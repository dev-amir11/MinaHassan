import { ProductForm } from "@/components/admin/ProductForm";
import { CategoryRow, db } from "@/lib/db";

export default async function NewProductPage() {
  const { data } = await db().from("categories").select("*").order("name");
  const categories = ((data || []) as CategoryRow[]).map((c) => ({
    id: c.id,
    name: c.name,
    parentId: c.parent_id,
  }));
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
