import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nekits@art — BURNING CALM",
  description:
    "Тріптіх, створений під час масованого обстрілу Києва. Три макрознімки побутових тканин — кольорові поля, що відсилають до Ротко. Палаючий спокій посеред хаосу.",
  openGraph: {
    title: "nekits@art — BURNING CALM",
    description:
      "Тріптіх, створений під час блекауту в Києві. Три погляди на один стан: коли зовнішній хаос зникає, залишається тільки тепло, текстура, лінія.",
    type: "website",
    images: [
      {
        url: "/og/og-final.png",
        width: 2752,
        height: 1536,
        alt: "nekits@art — BURNING CALM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nekits@art — BURNING CALM",
    description:
      "Тріптіх, створений під час блекауту в Києві. Кольорові поля тканин як медитація посеред війни.",
    images: ["/og/og-final.png"],
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
