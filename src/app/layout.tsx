import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import MobileNav from "@/components/Navigation/MobileNav";
import Footer from "@/components/Navigation/Footer";
import PWARegistration from "@/components/Common/PWARegistration";
import LifetimeMembershipPopup from "@/components/Membership/LifetimeMembershipPopup";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F172A",
};

export const metadata: Metadata = {
  title: "ऋषिकुल संगम | Verified Alumni Network | ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन",
  description:
    "Verified Alumni Network of Rishikul Government Ayurvedic College, Haridwar. ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार, उत्तराखण्ड (पंजी. संख्या: UK06803112023012256). ऋषिकुल एक • पीढ़ियाँ अनेक • कुटुंब एक • विचार अनेक",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ऋषिकुल संगम",
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
    "ऋषिकुल संगम",
    "RISHIKUL SANGAM",
    "ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन",
    "Rishikul Alumni",
    "Rishikul Government Ayurvedic College Haridwar",
    "BAMS",
    "MD (Ay.)",
    "MS (Ay.)",
    "Ayurveda Doctors Directory",
    "ऋषिकुल एक पीढ़ियाँ अनेक कुटुंब एक विचार अनेक",
    "Haridwar Ayurveda",
  ],
  authors: [{ name: "ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार, उत्तराखण्ड" }],
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
        <meta name="apple-mobile-web-app-title" content="ऋषिकुल संगम" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0F172A] selection:bg-[#C5A059]/30 selection:text-[#0F172A]">
        <PWARegistration />
        <LifetimeMembershipPopup />
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
