type QuoteWhatsAppPayload = {
  fullName: string;
  email: string;
  phone: string;
  country?: string | null;
  city?: string | null;
  eventDate?: string | null;
  occasion?: string | null;
  sizeNote?: string | null;
  selectedColor?: string | null;
  selectedSize?: string | null;
  message?: string | null;
  productName?: string | null;
  productSlug?: string | null;
};

export function getWhatsAppNumber() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    "923243417213"
  );
}

export function buildQuoteWhatsAppUrl(data: QuoteWhatsAppPayload) {
  const lines = [
    "Hello Mina Hasan,",
    "I would like to request a quote.",
    "",
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
  ];

  if (data.country || data.city) {
    lines.push(`Location: ${[data.city, data.country].filter(Boolean).join(", ")}`);
  }
  if (data.eventDate) lines.push(`Event date: ${data.eventDate}`);
  if (data.occasion) lines.push(`Occasion: ${data.occasion}`);
  if (data.productName) {
    lines.push(`Product: ${data.productName}`);
    if (data.productSlug) {
      lines.push(`Product link: /products/${data.productSlug}`);
    }
  }
  if (data.selectedColor) lines.push(`Color: ${data.selectedColor}`);
  if (data.selectedSize) lines.push(`Size: ${data.selectedSize}`);
  if (data.sizeNote) lines.push(`Size notes: ${data.sizeNote}`);
  if (data.message) lines.push(`Message: ${data.message}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}

export function buildGeneralWhatsAppUrl(message?: string) {
  const text = encodeURIComponent(
    message || "Hello, I have a query regarding Mina Hasan."
  );
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}
