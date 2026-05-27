import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// "Awesome Serif SemiBold" from the Figma design — using Cormorant Garamond as the closest web equivalent.
// To use the exact font: add font files to /public/fonts/ and add @font-face rules in globals.css.
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Watch Something Wonderful",
  description: "Discover your next favourite film",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
