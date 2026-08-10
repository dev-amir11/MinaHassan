import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { db, getProductCategoryLinks, ProductRow } from "@/lib/db";

export default async function AdminProductsPage() {
  const { data, error } = await db()
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  const products = (data || []) as ProductRow[];

  const rows = [];
  for (const p of products) {
    const links = await getProductCategoryLinks(p.id);
    rows.push({
      ...p,
      categoryNames: links.map((l) => l.category.name).join(", "),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black px-4 py-2 text-xs uppercase tracking-widest text-white"
        >
          Add product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b bg-[#f7f5f2] text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Categories</th>
              <th className="p-3">Flags</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-black/5">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-neutral-500">/{p.slug}</div>
                </td>
                <td className="p-3 text-xs">{p.categoryNames || "—"}</td>
                <td className="p-3 text-xs">
                  {[
                    p.is_published ? "Published" : "Draft",
                    p.is_featured ? "Featured" : null,
                    p.is_new ? "New" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs">
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      Edit
                    </Link>
                    <Link href={`/products/${p.slug}`} className="underline" target="_blank">
                      View
                    </Link>
                    <DeleteProductButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
