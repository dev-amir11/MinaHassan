import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [
    products,
    categories,
    quotes,
    orders,
    subscribers,
  ] = await Promise.all([
    db().from("products").select("*", { count: "exact", head: true }),
    db().from("categories").select("*", { count: "exact", head: true }),
    db()
      .from("quote_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    db().from("track_orders").select("*", { count: "exact", head: true }),
    db()
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Products", value: products.count || 0, href: "/admin/products" },
    { label: "Categories", value: categories.count || 0, href: "/admin/categories" },
    { label: "New Quotes", value: quotes.count || 0, href: "/admin/quotes" },
    { label: "Track Orders", value: orders.count || 0, href: "/admin/orders" },
    { label: "Newsletter", value: subscribers.count || 0, href: "/admin/newsletter" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">Manage Mina Hasan catalog and leads.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-black/10 bg-white p-5 hover:border-black"
          >
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              {card.label}
            </p>
            <p className="mt-3 font-serif text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
