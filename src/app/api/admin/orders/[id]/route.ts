import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { db, TrackOrderRow } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";
import { ORDER_STATUSES } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

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

export async function PUT(req: Request, { params }: Params) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = schema.parse(await req.json());

    const { data: existing, error: findError } = await db()
      .from("track_orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (findError) throw findError;
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const current = existing as TrackOrderRow;
    const status = body.status || current.status;
    if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const timeline = Array.isArray(current.timeline)
      ? [...(current.timeline as { status: string; note?: string; at: string }[])]
      : [];

    if (status !== current.status || body.timelineNote) {
      timeline.push({
        status,
        note: body.timelineNote || `Status updated to ${status}`,
        at: new Date().toISOString(),
      });
    }

    const { data, error } = await db()
      .from("track_orders")
      .update({
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
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed") }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { error } = await db().from("track_orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
