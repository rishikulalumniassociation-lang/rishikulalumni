import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import MobileNav from "@/components/Navigation/MobileNav";
import Footer from "@/components/Navigation/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F172A",
};

export const metadata: Metadata = {
  title: "Rishikul Snatak Evam Snatkottar Association | Alumni Portal",
  description:
    "Official Alumni Association Portal for Rishikul Government Ayurvedic College, Haridwar, Uttarakhand. Connecting generations of Ayurvedic doctors and scholars since 1919.",
  keywords: [
    "Rishikul Alumni",
    "Rishikul Ayurvedic College Haridwar",
    "BAMS Alumni",
    "Ayurveda Doctors Directory",
    "Rishikul Snatak Snatkottar Association",
    "Haridwar Ayurveda",
  ],
  authors: [{ name: "Rishikul Alumni Association" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0F172A] selection:bg-[#C5A059]/30 selection:text-[#0F172A]">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content View with mobile bottom nav padding */}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Mobile First Bottom Sticky Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
