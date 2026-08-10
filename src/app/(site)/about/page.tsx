import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <InfoPage
      title="About Us"
      paragraphs={[
        "Welcome to Saira Virk — luxury bridal and occasion wear crafted with timeless style and beauty. Each piece is designed to celebrate your most special moments.",
        "Founded in 2002, the brand has grown to include Bridal, Formal, Western and Unstitched collections. The design house prides itself on using the finest fabrics, quality handwork and fine craftsmanship in each piece.",
        "Every bridal and occasion outfit begins with a personal conversation. Browse our collections and request a quote for the look that speaks to you.",
      ]}
    />
  );
}
