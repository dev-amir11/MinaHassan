export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function toJsonArray(items: string[]) {
  return JSON.stringify(items.filter(Boolean));
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const ORDER_STATUSES = [
  "Received",
  "In Production",
  "Quality Check",
  "Shipped",
  "Delivered",
  "On Hold",
] as const;

export const QUOTE_STATUSES = ["new", "contacted", "closed"] as const;

export type TimelineEntry = {
  status: string;
  note?: string;
  at: string;
};
