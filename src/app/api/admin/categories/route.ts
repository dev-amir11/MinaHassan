import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  isVisible: z.boolean().optional(),
});

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await db()
    .from("categories")
    .select("*, parent:categories!parent_id(id, name)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = schema.parse(await req.json());
    const { data, error } = await db()
      .from("categories")
      .insert({
        name: body.name,
        slug: body.slug?.trim() || slugify(body.name),
        description: body.description || null,
        image_url: body.imageUrl || null,
        parent_id: body.parentId || null,
        sort_order: body.sortOrder ?? 0,
        is_visible: body.isVisible ?? true,
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
