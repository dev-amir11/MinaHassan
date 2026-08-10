import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Terms & Conditions" };

export default function Page() {
  return (
    <InfoPage
      title="Terms & Conditions"
      paragraphs={[
        "By using this website and submitting quote requests, you agree to communicate with Mina Hasan regarding product inquiries and potential orders.",
        "All pieces are predominantly made-to-order. Quotes, timelines, and customization details are confirmed directly after your request.",
        "Product imagery is representative; colors and handmade details may vary slightly from screen to finished garment.",
        "For questions, contact info@minahasan.com or +92 324 341 7213.",
      ]}
    />
  );
}
