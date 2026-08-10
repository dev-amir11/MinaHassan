import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createAdminSession } from "@/lib/auth";
import { AdminUserRow, db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    const { data, error } = await db()
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    const admin = data as AdminUserRow | null;

    if (!admin || !(await verifyPassword(password, admin.password_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createAdminSession(admin.id, admin.email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
