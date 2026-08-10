import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { buildQuoteWhatsAppUrl } from "@/lib/whatsapp";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string().optional(),
  city: z.string().optional(),
  eventDate: z.string().optional(),
  occasion: z.string().optional(),
  sizeNote: z.string().optional(),
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
  message: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  productSlug: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const sizeNote = [
      data.selectedColor ? `Color: ${data.selectedColor}` : "",
      data.selectedSize ? `Size: ${data.selectedSize}` : "",
      data.sizeNote || "",
    ]
      .filter(Boolean)
      .join(" | ");

    const { data: quote, error } = await db()
      .from("quote_requests")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country || null,
        city: data.city || null,
        event_date: data.eventDate || null,
        occasion: data.occasion || null,
        size_note: sizeNote || null,
        message: data.message || null,
        product_id: data.productId || null,
        product_name: data.productName || null,
        product_slug: data.productSlug || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) throw error;

    const whatsappUrl = buildQuoteWhatsAppUrl({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      eventDate: data.eventDate,
      occasion: data.occasion,
      sizeNote: data.sizeNote,
      selectedColor: data.selectedColor,
      selectedSize: data.selectedSize,
      message: data.message,
      productName: data.productName,
      productSlug: data.productSlug,
    });

    return NextResponse.json({ ok: true, id: quote.id, whatsappUrl });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to submit quote" }, { status: 500 });
  }
}
