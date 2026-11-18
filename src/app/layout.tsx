import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMPANION — Meaningful Company, Thoughtfully Matched",
  description:
    "Discover verified companions for conversations, coffee, city exploration, photography walks, dining, cultural events and shared interests. A curated platform for platonic social experiences.",
  keywords: [
    "companion",
    "social experiences",
    "platonic companionship",
    "Kolkata",
    "city exploration",
    "verified companions",
  ],
};

import CustomSidebar from "@/components/CustomSidebar";
import SmoothScroll from "@/components/SmoothScroll";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <SmoothScroll />
        {children}
        <CustomSidebar />
      </body>
    </html>
  );
}
