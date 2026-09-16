"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Award, Sparkles, HeartHandshake } from "lucide-react";

export default function EditorialHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0F172A] text-white">
      {/* Background Video with Fallback Poster */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-35 scale-105" : "opacity-0"
          }`}
          poster="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop"
        >
          <source
            src="https://designerstephen.github.io/public-assets/videos/serene-art-hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* Ambient Gradient Overlays for Cinematic Contrast & Editorial Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0F172A]/50 to-[#0F172A]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center flex flex-col items-center">
        {/* Heritage Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/10 border border-[#C5A059]/40 backdrop-blur-md mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-200">
            Centenary Heritage • Haridwar Since 1919
          </span>
        </div>

        {/* Dual Script Editorial Branding */}
        <div className="space-y-2 mb-4">
          <h2 className="text-sm sm:text-base md:text-lg font-medium tracking-widest text-[#C5A059] uppercase font-sans">
            ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन
          </h2>
          <h1 className="font-serif-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#FAF7F2] leading-[0.95] drop-shadow-sm">
            RISHIKUL
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-200 tracking-wide">
            Snatak Evam Snatkottar Association
          </p>
        </div>

        {/* Editorial Statement */}
        <p className="font-serif-heading text-2xl sm:text-3xl text-amber-100/90 italic font-normal max-w-2xl mt-2 mb-4">
          “Connecting generations of Rishikul.”
        </p>

        {/* Supporting Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          Reconnect with your batchmates, discover the esteemed Rishikul alumni fraternity,
          forge clinical collaborations, and uphold the legacy of Ayurveda and our beloved alma mater on the banks of the Ganges.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md sm:max-w-lg mb-12">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#C5A059] text-[#0F172A] font-bold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-[#C5A059]/20 hover:bg-[#dfbe7b] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Join the Alumni Network</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/directory"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 text-white font-medium text-sm sm:text-base backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 active:scale-[0.98] transition-all"
          >
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>Find Your Batchmates</span>
          </Link>
        </div>

        {/* Quick Trust Badges / Stats Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-6 border-t border-slate-700/60 text-left">
          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-[#C5A059]/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Foundation</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">1919 AD</div>
            <div className="text-[11px] text-slate-400">Over 106 years of legacy</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-[#C5A059]/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Alumni Base</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">12,000+</div>
            <div className="text-[11px] text-slate-400">Vaidyas across 35 nations</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-[#C5A059]/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Degrees</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">BAMS & MD</div>
            <div className="text-[11px] text-slate-400">14 Specializations</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-[#C5A059]/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Association</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">Active Body</div>
            <div className="text-[11px] text-slate-400">Reunions, CMEs & Welfare</div>
          </div>
        </div>
      </div>
    </section>
  );
}
