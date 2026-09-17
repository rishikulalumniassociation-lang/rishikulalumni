"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Sparkles, ShieldAlert, Flower, LogIn } from "lucide-react";
import { getShradhanjaliList, saveShradhanjaliList, isAdminAuthenticated, getLoggedInAlumni } from "@/lib/store";
import { ShradhanjaliRecord } from "@/types";

export default function ShradhanjaliPage() {
  const [records, setRecords] = useState<ShradhanjaliRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Per-user, per-record offered tracking stored in localStorage
  const [offeredIds, setOfferedIds] = useState<string[]>([]);

  useEffect(() => {
    const user = getLoggedInAlumni();
    setIsLoggedIn(!!user);
    setCurrentUserId(user?.id || null);
    setIsAdmin(isAdminAuthenticated());

    // Load offered flowers from localStorage (per-user key)
    if (user) {
      const storedOffered = localStorage.getItem(`shradhanjali_offered_${user.id}`);
      if (storedOffered) {
        try {
          setOfferedIds(JSON.parse(storedOffered));
        } catch {
          setOfferedIds([]);
        }
      }
    }

    setRecords(getShradhanjaliList());

    const handleUpdate = () => setRecords(getShradhanjaliList());
    window.addEventListener("shradhanjali_updated", handleUpdate);
    return () => window.removeEventListener("shradhanjali_updated", handleUpdate);
  }, []);

  const handleOfferFlower = (id: string) => {
    if (!isLoggedIn || !currentUserId) {
      // Redirect to login if not logged in
      window.location.href = "/login?redirect=/shradhanjali";
      return;
    }

    // Already offered — no double counting
    if (offeredIds.includes(id)) return;

    const newOffered = [...offeredIds, id];
    setOfferedIds(newOffered);

    // Persist per-user offered set in localStorage
    localStorage.setItem(`shradhanjali_offered_${currentUserId}`, JSON.stringify(newOffered));

    const updated = records.map((r) => {
      if (r.id === id) {
        return { ...r, condolencesCount: (r.condolencesCount || 0) + 1 };
      }
      return r;
    });
    setRecords(updated);
    saveShradhanjaliList(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Memorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <Flower className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>श्रद्धांजलि एवं स्मृति शेष • In Loving Memory</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Shradhanjali: Departed Souls of Rishikul
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              We solemnly remember and celebrate our esteemed professors, mentors, and batchmates who dedicated their lives to healing and Ayurveda. Their sacred legacy remains immortal in our hearts.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm self-start"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Manage Tributes in Admin
            </Link>
          )}
        </div>

        {/* Memorial Quotes / Vedic Shloka */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-700 mb-12 text-center max-w-2xl mx-auto">
          <p className="font-serif-heading text-lg sm:text-xl text-amber-200/90 italic">
            "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।<br />
            तथा शरीराणि विहाय जीर्णा-न्यन्यानि संयाति नवानि देही॥"
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Just as a person casts off worn-out garments and puts on new ones, so the soul casts off the worn-out body and enters into another new one. — Bhagavad Gita (2.22)
          </p>
        </div>

        {/* Login prompt for guest visitors */}
        {!isLoggedIn && (
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center gap-3">
            <LogIn className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed flex-1">
              <strong>श्रद्धांजलि अर्पित करने के लिए लॉगिन करें।</strong> पुष्पांजलि (Offer Flowers) बटन केवल लॉगिन किए हुए पूर्व छात्रों के लिए उपलब्ध है।{" "}
              <Link href="/login?redirect=/shradhanjali" className="underline font-semibold text-[#2D5A43]">
                लॉगिन करें →
              </Link>
            </p>
          </div>
        )}

        {/* Shradhanjali Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {records.map((record) => {
            const hasOffered = offeredIds.includes(record.id);

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md flex flex-col sm:flex-row hover:border-[#C5A059] transition-all"
              >
                {/* Photo (Grayscale & Soft Vignette) */}
                <div className="sm:w-48 relative bg-slate-800 flex-shrink-0 min-h-[220px] sm:min-h-full">
                  <img
                    src={record.photoUrl}
                    alt={record.name}
                    className="w-full h-full object-cover grayscale opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-slate-200 border border-white/20">
                      Batch {record.batchYear}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-1">
                      स्वर्गवास तिथि: {record.dateOfDemise}
                    </span>
                    <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                      {record.name}
                    </h3>
                    {record.nameHindi && (
                      <p className="text-xs text-slate-500 font-medium mb-3">
                        {record.nameHindi} • {record.degree}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                      "{record.tribute}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Tribute by: {record.postedBy}
                    </span>

                    {/* Offer Flowers / Condolence Button */}
                    <button
                      onClick={() => handleOfferFlower(record.id)}
                      title={!isLoggedIn ? "श्रद्धांजलि अर्पित करने के लिए लॉगिन करें" : hasOffered ? "आपने पुष्पांजलि अर्पित कर दी है" : "पुष्पांजलि अर्पित करें"}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        hasOffered
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : !isLoggedIn
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70"
                          : "bg-slate-100 text-slate-700 hover:bg-[#FAF7F2] border border-slate-200"
                      }`}
                    >
                      <Flower className={`w-3.5 h-3.5 ${hasOffered ? "text-[#C5A059]" : "text-slate-400"}`} />
                      <span>
                        {hasOffered
                          ? "पुष्पांजलि अर्पित"
                          : !isLoggedIn
                          ? "Login to Offer"
                          : "Offer Flowers"}
                        {" "}
                        {record.condolencesCount > 0 && (
                          <span className="font-semibold">({record.condolencesCount})</span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {records.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Flower className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">कोई श्रद्धांजलि रिकॉर्ड अभी उपलब्ध नहीं है।</p>
          </div>
        )}
      </div>
    </div>
  );
}
