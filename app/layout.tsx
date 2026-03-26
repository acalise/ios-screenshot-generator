import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Screenshot Studio — Free App Store Screenshot Generator",
  description:
    "Create beautiful App Store and Google Play screenshots for free. Upload your screenshots, customize colors and text, and download ready-to-submit images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
