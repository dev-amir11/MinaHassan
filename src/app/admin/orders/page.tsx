import { OrdersManager } from "@/components/admin/OrdersManager";
import { db, TrackOrderRow } from "@/lib/db";

export default async function AdminOrdersPage() {
  const { data, error } = await db()
    .from("track_orders")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const orders = ((data || []) as TrackOrderRow[]).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    status: o.status,
    notes: o.notes,
    productName: o.product_name,
  }));

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Track Orders</h1>
      <OrdersManager orders={orders} />
    </div>
  );
}
