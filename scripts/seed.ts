import "dotenv/config";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function upsertCategory(row: {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  sort_order: number;
}) {
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", row.slug)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: row.name,
        description: row.description || null,
        parent_id: row.parent_id ?? null,
        sort_order: row.sort_order,
        is_visible: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: row.name,
      slug: row.slug,
      description: row.description || null,
      parent_id: row.parent_id ?? null,
      sort_order: row.sort_order,
      is_visible: true,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@sairavirk.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  const { data: existingAdmin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingAdmin) {
    await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash, name: "Admin", updated_at: new Date().toISOString() })
      .eq("id", existingAdmin.id);
  } else {
    const { error } = await supabase.from("admin_users").insert({
      email,
      password_hash: passwordHash,
      name: "Admin",
    });
    if (error) throw error;
  }

  const events = await upsertCategory({
    name: "Events",
    slug: "events",
    description: "Bridal event wear crafted for every celebration.",
    sort_order: 1,
  });

  for (const child of [
    { name: "Mehndi", slug: "mehndi", sort_order: 1 },
    { name: "Barat", slug: "barat", sort_order: 2 },
    { name: "Walima", slug: "walima", sort_order: 3 },
    { name: "Mayio", slug: "mayio", sort_order: 4 },
  ]) {
    await upsertCategory({
      ...child,
      description: `${child.name} collection`,
      parent_id: events.id,
    });
  }

  for (const cat of [
    { name: "Formal", slug: "formal", sort_order: 2 },
    { name: "Western", slug: "western", sort_order: 3 },
    { name: "Unstitched", slug: "unstitched", sort_order: 4 },
  ]) {
    await upsertCategory({
      ...cat,
      description: `${cat.name} collection`,
    });
  }

  const { data: barat } = await supabase.from("categories").select("id").eq("slug", "barat").single();
  const { data: mehndi } = await supabase.from("categories").select("id").eq("slug", "mehndi").single();
  const { data: formal } = await supabase.from("categories").select("id").eq("slug", "formal").single();

  const sampleProducts = [
    {
      name: "Durainaz",
      slug: "durainaz",
      short_description:
        "A breathtaking bridal design marrying contemporary style with traditional elegance.",
      description:
        "This breathtaking Saira Virk bridal design masterfully marries contemporary style with traditional elegance.",
      fabrics: "Shirt: Silk Net\nLehenga: Raw Silk\nDupatta: Silk Net",
      delivery_timeline: "Made-to-order. Typical production timeline is 8–12 weeks.",
      disclaimer: "Colors may vary from one device to another.",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80",
      ],
      is_featured: true,
      is_new: true,
      categoryIds: [barat?.id].filter(Boolean) as string[],
    },
    {
      name: "Golnar",
      slug: "golnar",
      short_description: "A vibrant mehndi ensemble celebrating color and craftsmanship.",
      description: "This exquisite Saira Virk mehndi ensemble is a celebration of vibrant color.",
      fabrics: "Shirt: Organza\nLehenga: Raw Silk\nDupatta: Net",
      delivery_timeline: "Made-to-order. Typical production timeline is 6–10 weeks.",
      disclaimer: "Handmade details may vary slightly.",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
      ],
      is_featured: true,
      is_new: true,
      categoryIds: [mehndi?.id].filter(Boolean) as string[],
    },
    {
      name: "Robina",
      slug: "robina",
      short_description: "An enchanting formal pishwas blending tradition and glamour.",
      description: "This enchanting magenta pishwas is a perfect blend of tradition and glamour.",
      fabrics: "Pishwas: Indian Silk\nPants: Indian Raw Silk\nDupatta: Chiffon",
      delivery_timeline: "Made-to-order. Typical production timeline is 4–8 weeks.",
      disclaimer: "Colors may vary from one device to another.",
      images: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=80",
      ],
      is_featured: false,
      is_new: true,
      categoryIds: [formal?.id].filter(Boolean) as string[],
    },
  ];

  for (const product of sampleProducts) {
    const { categoryIds, ...row } = product;
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", row.slug)
      .maybeSingle();

    let productId = existing?.id as string | undefined;
    if (existing) {
      const { error } = await supabase
        .from("products")
        .update({ ...row, is_published: true, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({ ...row, is_published: true })
        .select("id")
        .single();
      if (error) throw error;
      productId = data.id;
    }

    if (productId) {
      await supabase.from("product_categories").delete().eq("product_id", productId);
      if (categoryIds.length) {
        const { error } = await supabase.from("product_categories").insert(
          categoryIds.map((category_id) => ({
            product_id: productId,
            category_id,
          }))
        );
        if (error) throw error;
      }
    }
  }

  const { data: existingOrder } = await supabase
    .from("track_orders")
    .select("id")
    .eq("order_number", "SV-1001")
    .maybeSingle();

  if (!existingOrder) {
    const { error } = await supabase.from("track_orders").insert({
      order_number: "SV-1001",
      customer_name: "Sample Customer",
      customer_email: "bride@example.com",
      customer_phone: "+92 300 0000000",
      status: "In Production",
      product_name: "Durainaz",
      notes: "Custom sizing confirmed",
      timeline: [
        {
          status: "Received",
          note: "Order received and measurements confirmed",
          at: new Date().toISOString(),
        },
        {
          status: "In Production",
          note: "Handwork started",
          at: new Date().toISOString(),
        },
      ],
    });
    if (error) throw error;
  }

  console.log("Seed complete.");
  console.log(`Admin: ${email} / ${password}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
