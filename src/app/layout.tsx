import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

const baseUrl = "https://art.nekits.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "nekits@art",
  description:
    "Terminal-aesthetic art portfolio. Фотографії, кураторські тексти, критика — все згенеровано ШІ, крім фото.",
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
