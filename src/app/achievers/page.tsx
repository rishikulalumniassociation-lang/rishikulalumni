"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Sparkles, Trophy, Star, ChevronRight, Users, ShieldAlert } from "lucide-react";
import { getLifetimeAchievers, isAdminAuthenticated } from "@/lib/store";
import { LifetimeAchiever } from "@/types";

export default function AchieversPage() {
  const [achievers, setAchievers] = useState<LifetimeAchiever[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setAchievers(getLifetimeAchievers());
    setIsAdmin(isAdminAuthenticated());
    const handleUpdate = () => setAchievers(getLifetimeAchievers());
    window.addEventListener("achievers_updated", handleUpdate);
    return () => window.removeEventListener("achievers_updated", handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Fame & National Laurels</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Lifetime Achievers
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              Honoring illustrious alumni of Rishikul whose monumental contributions to clinical Ayurveda, public health policymaking, surgery, and research have brought global glory to our alma mater.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm self-start"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Edit Achievers in Admin
            </Link>
          )}
        </div>

        {/* Achievers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievers.map((achiever) => (
            <div
              key={achiever.id}
              className="bg-white rounded-3xl overflow-hidden border-2 border-[#C5A059]/30 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={achiever.photoUrl}
                    alt={achiever.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#C5A059] text-[#0F172A] shadow-md">
                      <Star className="w-3 h-3 fill-[#0F172A]" />
                      Batch of {achiever.batchYear}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif-heading text-2xl font-bold text-white drop-shadow-md">
                      {achiever.name}
                    </h3>
                    {achiever.nameHindi && (
                      <p className="text-xs text-amber-200/90 font-medium">
                        {achiever.nameHindi}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="inline-block text-xs font-semibold text-[#2D5A43] bg-[#2D5A43]/10 px-2.5 py-1 rounded-md mb-3">
                    {achiever.title}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4 font-light">
                    "{achiever.citation}"
                  </p>

                  {/* Awards / Decorations */}
                  {achiever.awards && achiever.awards.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Major Decorations & Honors
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {achiever.awards.map((award, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-[#C5A059]" />
                            {award}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">
                  {achiever.currentRole || "Distinguished Faculty & Physician"}
                </span>
                <span className="text-xs font-semibold text-[#0F172A] whitespace-nowrap ml-2">
                  {achiever.degree}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
