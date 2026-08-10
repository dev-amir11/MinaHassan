import { db, NewsletterRow } from "@/lib/db";

export default async function AdminNewsletterPage() {
  const { data, error } = await db()
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const subscribers = (data || []) as NewsletterRow[];

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Newsletter</h1>
      <div className="border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[#f7f5f2] text-xs uppercase">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-black/5">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-xs text-neutral-500">
                  {new Date(s.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
