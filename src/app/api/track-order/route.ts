import { NextResponse } from "next/server";
import { db, TrackOrderRow } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();

  if (!orderNumber) {
    return NextResponse.json({ error: "Order number required" }, { status: 400 });
  }

  const { data, error } = await db()
    .from("track_orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to lookup order" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = data as TrackOrderRow;
  const timeline = Array.isArray(order.timeline) ? order.timeline : [];

  return NextResponse.json({
    orderNumber: order.order_number,
    status: order.status,
    productName: order.product_name,
    customerName: order.customer_name,
    notes: order.notes,
    timeline,
    updatedAt: order.updated_at,
  });
}
