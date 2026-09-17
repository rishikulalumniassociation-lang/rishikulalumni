import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import MobileNav from "@/components/Navigation/MobileNav";
import Footer from "@/components/Navigation/Footer";
import PWARegistration from "@/components/Common/PWARegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F172A",
};

export const metadata: Metadata = {
  title: "RISHIKUL SANGAM | Official Alumni Network",
  description:
    "Official Alumni Network of Rishikul Government Ayurvedic College, Haridwar. एक ऋषिकुल • अनेक पीढ़ियाँ • एक परिवार",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RISHIKUL SANGAM",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: [
    "RISHIKUL SANGAM",
    "Rishikul Alumni",
    "Rishikul Government Ayurvedic College Haridwar",
    "BAMS Alumni",
    "MD Ayurveda Alumni",
    "Ayurveda Doctors Directory",
    "एक ऋषिकुल अनेक पीढ़ियाँ एक परिवार",
    "Haridwar Ayurveda",
  ],
  authors: [{ name: "Rishikul Snatak Evam Snatkottar Association" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RISHIKUL SANGAM" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0F172A] selection:bg-[#C5A059]/30 selection:text-[#0F172A]">
        <PWARegistration />
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
