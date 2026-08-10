import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { db, setProductCategories } from "@/lib/db";
import { getErrorMessage } from "@/lib/errors";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  fabrics: z.string().optional(),
  deliveryTimeline: z.string().optional(),
  disclaimer: z.string().optional(),
  sizeGuide: z.string().optional(),
  images: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().optional(),
  categoryIds: z.array(z.string()).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = productSchema.parse(await req.json());
    const slug = body.slug?.trim() || slugify(body.name);

    const { data: product, error } = await db()
      .from("products")
      .update({
        name: body.name,
        slug,
        short_description: body.shortDescription || null,
        description: body.description || null,
        fabrics: body.fabrics || null,
        delivery_timeline: body.deliveryTimeline || null,
        disclaimer: body.disclaimer || null,
        size_guide: body.sizeGuide || null,
        images: body.images || [],
        video_url: body.videoUrl || null,
        is_featured: body.isFeatured ?? false,
        is_new: body.isNew ?? false,
        is_published: body.isPublished ?? true,
        sort_order: body.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    await setProductCategories(id, body.categoryIds || []);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed") }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { error } = await db().from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
