import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <InfoPage
      title="Privacy Policy"
      paragraphs={[
        "Saira Virk respects your privacy. Information collected through quote forms, contact forms, and newsletter signups is used only to respond to your inquiries and improve our services.",
        "We do not sell your personal data. Contact details may be shared with our internal sales and production teams to fulfill quote and order requests.",
        "For privacy questions, email info@sairavirk.com or WhatsApp +92 324 341 7213.",
      ]}
    />
  );
}
