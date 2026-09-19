"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Crown, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { getMembershipSettings, getLoggedInAlumni } from "@/lib/store";

export default function LifetimeMembershipPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [fee, setFee] = useState<number>(3100);

  useEffect(() => {
    // If user is already a paid Life Member or Patron Member, don't show
    const user = getLoggedInAlumni();
    if (user && (user.membershipTier === "Life Member" || user.membershipTier === "Patron Member")) {
      return;
    }

    // Skip on admin dashboard and already-opened permanent membership page
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p.startsWith("/admin") || p === "/membership/permanent") {
        return;
      }
    }

    const settings = getMembershipSettings();
    setFee(settings.lifetimeFee || 3100);

    // Show popup only once when the site is initially loaded / reloaded
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;
  if (pathname?.startsWith("/admin") || pathname === "/membership/permanent") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF8] via-[#FAF7F2] to-[#F4E6CC] rounded-3xl shadow-2xl border-2 border-[#C5A059] p-6 sm:p-8 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-600" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heritage Emblem & Badge */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border border-[#C5A059] shadow-md flex items-center justify-center text-amber-700">
              <Crown className="w-8 h-8 fill-amber-500 text-amber-700" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-[#2D5A43] text-white p-1 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Association Subtitle */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-1">
          ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार
        </div>

        {/* Prominent Hindi Title */}
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug mb-1">
          आजीवन सदस्य बनें
        </h2>
        <p className="text-xs sm:text-sm font-medium text-[#2D5A43] mb-4">
          और अपनी संस्था को बढ़ाने में सहयोग करें।
        </p>

        {/* Prominent Fee Display */}
        <div className="my-4 py-3.5 px-6 rounded-2xl bg-white/90 border border-[#C5A059]/40 shadow-sm max-w-xs mx-auto">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            आजीवन सदस्यता शुल्क (One-time Lifetime Fee)
          </span>
          <div className="text-3xl sm:text-4xl font-serif-heading font-extrabold text-[#0F172A] mt-0.5">
            ₹{fee.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
            ★ स्थायी व जीवनभर के लिए मान्य (Lifelong)
          </span>
        </div>

        {/* Key Highlights */}
        <div className="text-left bg-white/60 rounded-2xl p-4 border border-[#C5A059]/20 text-xs text-slate-700 space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
            <span>विशेष <strong>👑 आजीवन सदस्य (Life Member)</strong> विशिष्ट पहचान व कार्ड</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
            <span>संस्था के आयोजनों, सम्मेलनों व कार्यकारिणी में सक्रिय मताधिकार</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A43] shrink-0" />
            <span>ऋषिकुल परिवार की ऐतिहासिक धरोहर व विकास में सीधा योगदान</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/membership/permanent"
            onClick={handleDismiss}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#2D5A43] hover:to-[#1E293B] text-[#C5A059] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#C5A059]"
          >
            <span>अधिक जानकारी व सदस्यता लें</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            बाद में देखें (Dismiss)
          </button>
        </div>
      </div>
    </div>
  );
}
