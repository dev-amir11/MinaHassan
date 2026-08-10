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

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await db()
    .from("products")
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
    const body = productSchema.parse(await req.json());
    const slug = body.slug?.trim() || slugify(body.name);
    const now = new Date().toISOString();

    const { data: product, error } = await db()
      .from("products")
      .insert({
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
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) throw error;
    await setProductCategories(product.id, body.categoryIds || []);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed") }, { status: 400 });
  }
}
