import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Shipping & Handling" };

export default function Page() {
  return (
    <InfoPage
      title="Shipping & Handling"
      paragraphs={[
        "Saira Virk partners with logistics providers for domestic and international deliveries. Dispatch timelines vary because pieces are predominantly made-to-order.",
        "Estimated production and delivery timelines are shared during the quote process and may appear on each product page.",
        "Shipping charges, duties, and courier timelines for international orders are confirmed before finalizing your order.",
        "For delivery questions, WhatsApp +92 324 341 7213 or email info@sairavirk.com.",
      ]}
    />
  );
}
