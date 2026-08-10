import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";
import { ORDER_STATUSES } from "@/lib/utils";

const schema = z.object({
  orderNumber: z.string().min(1),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  productName: z.string().optional(),
  timelineNote: z.string().optional(),
});

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await db()
    .from("track_orders")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = schema.parse(await req.json());
    const status = body.status || "Received";
    if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const timeline = [
      {
        status,
        note: body.timelineNote || "Order created",
        at: new Date().toISOString(),
      },
    ];
    const { data, error } = await db()
      .from("track_orders")
      .insert({
        order_number: body.orderNumber.trim(),
        customer_name: body.customerName || null,
        customer_email: body.customerEmail || null,
        customer_phone: body.customerPhone || null,
        status,
        notes: body.notes || null,
        product_name: body.productName || null,
        timeline,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed") }, { status: 400 });
  }
}
