import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const { error } = await db().from("newsletter_subscribers").upsert(
      { email: email.toLowerCase() },
      { onConflict: "email" }
    );

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
