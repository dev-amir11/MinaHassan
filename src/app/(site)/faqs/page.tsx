export const metadata = { title: "FAQs" };

const faqs = [
  {
    q: "Where is Mina Hasan based?",
    a: "Founded in 2002, Mina Hasan is based in Pakistan and ships worldwide.",
  },
  {
    q: "How do I get a quote?",
    a: "Open any product and click Get Quote. Fill the form — we save your request and open WhatsApp so you can send the details directly.",
  },
  {
    q: "Why are there no prices on the website?",
    a: "Our bridal and occasion pieces are quote-based to account for customization, sizing, and timelines.",
  },
  {
    q: "Do you offer custom sizes?",
    a: "Yes. Mention custom sizing in your quote request and our team will guide you through measurements.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Delivery time and shipping costs vary by location and order type.",
  },
  {
    q: "How can I track my order?",
    a: "Use the Track Order page with the order number shared after your order is confirmed.",
  },
];

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow">Help</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">FAQs</h1>
      <div className="divider-gold my-6 max-w-24" />
      <div className="mt-2 space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="border border-[var(--border)] bg-[var(--surface-elevated)] p-4 open:bg-[var(--surface)]"
          >
            <summary className="cursor-pointer font-medium text-[var(--foreground)]">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
