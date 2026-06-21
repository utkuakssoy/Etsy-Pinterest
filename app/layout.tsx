import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PinPilot",
  description: "Pinterest SEO and scheduling for Etsy sellers"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
