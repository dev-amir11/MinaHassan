export const metadata = { title: "FAQs" };

const faqs = [
  {
    q: "Where is Saira Virk based?",
    a: "Saira Virk is based in Pakistan and ships worldwide.",
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
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-slate-500">
            <a href="/" className="hover:text-slate-900">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-slate-900">FAQs</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">FAQs</h1>
        <div className="mt-8 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-lg border border-slate-200 bg-white p-4 open:bg-slate-50"
            >
              <summary className="cursor-pointer font-medium text-slate-900">{item.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
