import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nekits — art",
  description: "Terminal-aesthetic art portfolio by nekits",
  openGraph: {
    title: "nekits — art",
    description: "Terminal-aesthetic art portfolio",
    type: "website",
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
