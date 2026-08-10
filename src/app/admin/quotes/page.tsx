import { QuotesTable } from "@/components/admin/QuotesTable";
import { db, QuoteRow } from "@/lib/db";

export default async function AdminQuotesPage() {
  const { data, error } = await db()
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const quotes = ((data || []) as QuoteRow[]).map((q) => ({
    id: q.id,
    fullName: q.full_name,
    email: q.email,
    phone: q.phone,
    country: q.country,
    city: q.city,
    eventDate: q.event_date,
    occasion: q.occasion,
    sizeNote: q.size_note,
    message: q.message,
    status: q.status,
    productName: q.product_name,
    createdAt: q.created_at,
  }));

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Get Quote submissions</h1>
      <QuotesTable quotes={quotes} />
    </div>
  );
}
