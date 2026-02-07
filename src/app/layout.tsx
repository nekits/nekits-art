import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nekits@art",
  description:
    "Terminal-aesthetic art portfolio. Фотографії, кураторські тексти, критика — все згенеровано ШІ, крім фото.",
  openGraph: {
    title: "nekits@art — WHITE RITUAL",
    description:
      "Веймаранер Руна в дівствінному снігу. Квінтесенція свободи — насолоджуватись зимою, а не виживати.",
    type: "website",
    images: [
      {
        url: "/og/og-white-ritual.png",
        width: 2752,
        height: 1536,
        alt: "nekits@art — WHITE RITUAL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nekits@art — WHITE RITUAL",
    description:
      "Веймаранер Руна в дівствінному снігу. Свобода какати спокійно, коли нікого поруч і чуєш тільки сніжинки.",
    images: ["/og/og-white-ritual.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={mono.variable}>
      <body>{children}</body>
    </html>
  );
}
