"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Award, Sparkles, HeartHandshake, ChevronLeft, ChevronRight, Camera, Users } from "lucide-react";
import { getAlumniList } from "@/lib/store";
import AnimatedCounter from "@/components/Motion/AnimatedCounter";

const heroSlides = [
  {
    src: "/images/hero/hero-1.jpg",
    title: "पं. मदन मोहन मालवीय भवन - मुख्य परिसर",
    subtitle: "Rishikul State Ayurvedic College - Haridwar",
  },
  {
    src: "/images/hero/hero-2.jpg",
    title: "ऋषिकुल शताब्दी महाद्वार - मुख्य प्रवेश",
    subtitle: "Rishikul Centenary Grand Entrance Gate",
  },
  {
    src: "/images/hero/hero-3.jpg",
    title: "ऋषिकुल परिसर एवं खेल प्रांगण",
    subtitle: "Campus Grounds & Academic Wing",
  },
  {
    src: "/images/hero/hero-4.jpg",
    title: "द्रव्यगुण एवं रसशास्त्र स्नातकोत्तर विभाग",
    subtitle: "P.G. Department of Dravyaguna & Research",
  },
];

interface EditorialHeroProps {
  registeredCount?: number;
}

export default function EditorialHero({ registeredCount: propRegisteredCount }: EditorialHeroProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [registeredCount, setRegisteredCount] = useState<number>(propRegisteredCount ?? 0);

  useEffect(() => {
    if (propRegisteredCount !== undefined) {
      setRegisteredCount(propRegisteredCount);
    } else {
      getAlumniList().then((list) => {
        setRegisteredCount(list.length);
      });
    }

    const handleAlumniUpdate = () => {
      getAlumniList().then((list) => {
        setRegisteredCount(list.length);
      });
    };
    window.addEventListener("alumni_updated", handleAlumniUpdate);
    return () => window.removeEventListener("alumni_updated", handleAlumniUpdate);
  }, [propRegisteredCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative min-h-[92vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#0F172A] text-white">
      {/* 16:9 Slideshow Background with ~65-70% visibility (increased by 25-30% for clear building recognition) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-70 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover object-center aspect-video transition-transform duration-1000"
            />
          </div>
        ))}

        {/* Ambient Gradient Overlays for Cinematic Contrast & Editorial Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-black/30 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0F172A]/35 to-[#0F172A]/80 z-[1]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center flex flex-col items-center">
        {/* Centenary Heritage Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/15 border border-[#C5A059]/50 backdrop-blur-md mb-5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-200">
            Centenary Heritage • Haridwar Since 1919
          </span>
        </div>

        {/* Official Emblem & Dual Script Editorial Branding */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-3 border-[#C5A059] shadow-2xl overflow-hidden bg-white mb-4 p-1">
            <img
              src="/images/rishikul-sangam-logo.jpg"
              alt="RISHIKUL SANGAM Emblem"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h2 className="text-sm sm:text-base md:text-lg font-semibold tracking-widest text-[#C5A059] uppercase font-sans drop-shadow-md">
            ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन
          </h2>
          <h1 className="font-serif-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF7F2] leading-[0.95] drop-shadow-lg mt-1">
            ऋषिकुल संगम
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium text-amber-200 tracking-wide drop-shadow-md mt-2">
            Verified Alumni Network of Rishikul Government Ayurvedic College, Haridwar
          </p>
        </div>

        {/* Sacred Motto */}
        <p className="font-serif-heading text-xl sm:text-2xl md:text-3xl text-amber-100 font-semibold max-w-3xl mt-1 mb-3 drop-shadow-md tracking-wide">
          ऋषिकुल एक • पीढ़ियाँ अनेक • कुटुंब एक • विचार अनेक
        </p>

        {/* Supporting Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-6 font-light drop-shadow">
          Reconnect with your batchmates, discover the esteemed Rishikul alumni fraternity,
          forge clinical collaborations, and uphold the legacy of Ayurveda and our beloved alma mater on the banks of the Ganges.
        </p>

        {/* Slideshow Location / Caption Badge & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-amber-200">
              {heroSlides[currentSlide].title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-6 bg-[#C5A059]" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Primary, Gallery and Directory CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-2xl mb-12">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C5A059] text-[#0F172A] font-bold text-sm sm:text-base tracking-wide uppercase shadow-xl shadow-[#C5A059]/25 hover:bg-[#dfbe7b] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Join Alumni</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/community"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-xl hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>ऋषिकुल गैलरी (Gallery)</span>
          </Link>

          <Link
            href="/directory"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/15 text-white font-medium text-sm sm:text-base backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 active:scale-[0.98] transition-all shadow-lg"
          >
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>Find Batchmates</span>
          </Link>
        </div>

        {/* Quick Trust Badges / Stats Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-6 border-t border-slate-700/60 text-left">
          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-[#C5A059]/30 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Foundation</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
              <AnimatedCounter end={1919} duration={1400} suffix=" AD" />
            </div>
            <div className="text-[11px] text-slate-300">Over 106 years of legacy</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-[#C5A059]/30 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Alumni Registered</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">
              {registeredCount > 0 ? (
                <AnimatedCounter end={registeredCount} duration={1600} />
              ) : (
                "..."
              )}
            </div>
            <div className="text-[11px] text-slate-300">Verified members on portal</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-[#C5A059]/30 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Degrees</span>
            </div>
            <div className="font-serif-heading text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
              BAMS, MD (Ay.), MS (Ay.)
            </div>
            <div className="text-[11px] text-slate-300">14 Specializations</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-[#C5A059]/30 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 text-[#C5A059] mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Association</span>
            </div>
            <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-white">Active Body</div>
            <div className="text-[11px] text-slate-300">Reunions, CMEs & Welfare</div>
          </div>
        </div>
      </div>
    </section>
  );
}
