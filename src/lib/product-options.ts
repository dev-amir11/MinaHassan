export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductVariants = {
  colors: ProductColor[];
  sizes: string[];
};

export type SizeChartRow = {
  size: string;
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  sleeve: string;
  length: string;
};

/** Structured clothing size guide + variant options (stored in products.size_guide as JSON). */
export type ClothingGuide = {
  unit: "in" | "cm";
  rows: SizeChartRow[];
  notes: string;
  colors: ProductColor[];
  sizes: string[];
};

export const DEFAULT_CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"] as const;

export const EMPTY_SIZE_ROW: SizeChartRow = {
  size: "",
  bust: "",
  waist: "",
  hips: "",
  shoulder: "",
  sleeve: "",
  length: "",
};

export const DEFAULT_CLOTHING_GUIDE: ClothingGuide = {
  unit: "in",
  notes:
    "Measurements are garment body measurements. For custom sizing, share your bust, waist, hips, and height in the quote form.",
  colors: [],
  sizes: [...DEFAULT_CLOTHING_SIZES],
  rows: [
    { size: "XS", bust: "32", waist: "26", hips: "34", shoulder: "13.5", sleeve: "21", length: "40" },
    { size: "S", bust: "34", waist: "28", hips: "36", shoulder: "14", sleeve: "21.5", length: "41" },
    { size: "M", bust: "36", waist: "30", hips: "38", shoulder: "14.5", sleeve: "22", length: "42" },
    { size: "L", bust: "38", waist: "32", hips: "40", shoulder: "15", sleeve: "22.5", length: "43" },
    { size: "XL", bust: "40", waist: "34", hips: "42", shoulder: "15.5", sleeve: "23", length: "44" },
    { size: "XXL", bust: "42", waist: "36", hips: "44", shoulder: "16", sleeve: "23.5", length: "45" },
  ],
};

function normalizeColors(value: unknown): ProductColor[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const item = c as Record<string, unknown>;
      const name = String(item.name || "").trim();
      if (!name) return null;
      return {
        name,
        hex: String(item.hex || "#000000").trim() || "#000000",
      };
    })
    .filter(Boolean) as ProductColor[];
}

function normalizeSizes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((s) => String(s).trim()).filter(Boolean);
}

function normalizeRows(value: unknown): SizeChartRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => {
    const r = (row || {}) as Record<string, unknown>;
    return {
      size: String(r.size || ""),
      bust: String(r.bust || ""),
      waist: String(r.waist || ""),
      hips: String(r.hips || ""),
      shoulder: String(r.shoulder || ""),
      sleeve: String(r.sleeve || ""),
      length: String(r.length || ""),
    };
  });
}

export function parseClothingGuide(value: string | null | undefined): {
  guide: ClothingGuide | null;
  plainText: string;
} {
  if (!value?.trim()) {
    return { guide: null, plainText: "" };
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.rows)) {
      return {
        guide: {
          unit: parsed.unit === "cm" ? "cm" : "in",
          notes: String(parsed.notes || ""),
          rows: normalizeRows(parsed.rows),
          colors: normalizeColors(parsed.colors),
          sizes: normalizeSizes(parsed.sizes),
        },
        plainText: "",
      };
    }
  } catch {
    // plain text fallback
  }

  return { guide: null, plainText: value };
}

export function serializeClothingGuide(guide: ClothingGuide): string {
  return JSON.stringify({
    unit: guide.unit,
    notes: guide.notes,
    rows: guide.rows,
    colors: guide.colors,
    sizes: guide.sizes,
  });
}

export function getVariantsFromGuide(
  sizeGuide: string | null | undefined
): ProductVariants {
  const { guide } = parseClothingGuide(sizeGuide);
  if (!guide) return { colors: [], sizes: [] };
  return { colors: guide.colors, sizes: guide.sizes };
}
