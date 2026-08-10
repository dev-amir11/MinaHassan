import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfitHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Mina Hasan — Luxury Bridal & Designer Wear",
    template: "%s — Mina Hasan",
  },
  description:
    "Luxury bridal and occasion wear by Mina Hasan. Request a personal quote for every piece.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${outfitHeading.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased text-foreground bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
