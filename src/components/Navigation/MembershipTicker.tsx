"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { getMembershipSettings } from "@/lib/store";

export default function MembershipTicker() {
  const [fee, setFee] = useState<number>(3100);

  useEffect(() => {
    const settings = getMembershipSettings();
    if (settings && settings.lifetimeFee) {
      setFee(settings.lifetimeFee);
    }

    const handleSettingsUpdate = () => {
      const s = getMembershipSettings();
      if (s && s.lifetimeFee) setFee(s.lifetimeFee);
    };

    window.addEventListener("membership_settings_updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("membership_settings_updated", handleSettingsUpdate);
    };
  }, []);

  const TickerItem = ({ keyIndex }: { keyIndex: number }) => (
    <span
      key={keyIndex}
      className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 text-[11px] sm:text-[12.5px] font-semibold tracking-wide text-amber-100 whitespace-nowrap"
    >
      <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
        <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300/80 shrink-0" />
        <span className="underline decoration-amber-400/50 underline-offset-2">आजीवन सदस्य बनें</span>
      </span>
      <span className="text-white/95 font-medium">अपनी मातृ संस्था को सहयोग करें</span>
      <span className="text-amber-400/80 font-bold">•</span>
      <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold border border-amber-400/40">
        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
        आजीवन सदस्यता शुल्क ₹{fee.toLocaleString("en-IN")}
      </span>
      <span className="text-amber-400/80 font-bold">•</span>
      <span className="text-amber-300 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
        <span>सदस्यता लें</span>
        <ArrowRight className="w-3 h-3" />
      </span>
      <span className="text-amber-500/60 font-mono text-[10px] ml-2">✦</span>
    </span>
  );

  return (
    <Link
      href="/membership/permanent"
      aria-label="आजीवन सदस्य बनें - विवरण व ऑनलाइन आवेदन"
      className="group block w-full bg-gradient-to-r from-[#173022] via-[#2D5A43] to-[#173022] border-b border-[#C5A059]/40 hover:bg-[#234734] transition-colors overflow-hidden py-1.5 cursor-pointer shadow-xs"
    >
      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee-infinite flex shrink-0 items-center">
          {[1, 2, 3, 4].map((i) => (
            <TickerItem key={`set1-${i}`} keyIndex={i} />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <TickerItem key={`set2-${i}`} keyIndex={i} />
          ))}
        </div>
      </div>
    </Link>
  );
}
