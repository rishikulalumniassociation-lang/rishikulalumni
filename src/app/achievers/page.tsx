"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Sparkles,
  Trophy,
  Star,
  ShieldAlert,
  Crown,
  HeartHandshake,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
} from "lucide-react";
import { getLifetimeAchievers, getAlumniList, isAdminAuthenticated } from "@/lib/store";
import { LifetimeAchiever, AlumniProfile } from "@/types";

export default function AchieversPage() {
  const [activeTab, setActiveTab] = useState<"achievers" | "patrons">("achievers");
  const [achievers, setAchievers] = useState<LifetimeAchiever[]>([]);
  const [patronMembers, setPatronMembers] = useState<AlumniProfile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadData();
    setIsAdmin(isAdminAuthenticated());

    const handleUpdate = () => loadData();
    window.addEventListener("achievers_updated", handleUpdate);
    window.addEventListener("alumni_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("achievers_updated", handleUpdate);
      window.removeEventListener("alumni_data_updated", handleUpdate);
    };
  }, []);

  const loadData = () => {
    setAchievers(getLifetimeAchievers());
    const allAlumni = getAlumniList();
    const patrons = allAlumni.filter(
      (a) => a.membershipTier === "Patron Member" && a.approvalStatus === "approved" && !a.isDeceased
    );
    setPatronMembers(patrons);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Fame, Laurels & Patrons</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Hall of Fame & Patrons
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              ऋषिकुल राजकीय आयुर्वेद महाविद्यालय के गौरवशाली पूर्व छात्रों एवं संरक्षक मंडल (Patrons) का आधिकारिक सम्मान पटल।
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm self-start"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Manage in Admin Portal
            </Link>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#C5A059]/30 mb-10 gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("achievers")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "achievers"
                ? "border-[#C5A059] text-[#0F172A] bg-white shadow-sm font-bold"
                : "border-transparent text-slate-500 hover:text-[#0F172A] hover:bg-white/50"
            }`}
          >
            <Trophy className="w-4 h-4 text-[#C5A059]" />
            <span>Lifetime Achievers (विशिष्ट विभूतियाँ)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {achievers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("patrons")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
              activeTab === "patrons"
                ? "border-[#C5A059] text-[#0F172A] bg-white shadow-sm font-bold"
                : "border-transparent text-slate-500 hover:text-[#0F172A] hover:bg-white/50"
            }`}
          >
            <Crown className="w-4 h-4 text-[#C5A059]" />
            <span>Patrons (संरक्षक मंडल)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F172A] text-amber-200">
              {patronMembers.length + 1}
            </span>
          </button>
        </div>

        {/* ================= TAB 1: LIFETIME ACHIEVERS ================= */}
        {activeTab === "achievers" && (
          <div>
            {achievers.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#C5A059]/30 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-[#C5A059]">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-2">
                  Lifetime Achievers Hall of Fame
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  ऋषिकुल राजकीय आयुर्वेद महाविद्यालय के जिन सम्मानित पूर्व छात्रों ने राष्ट्रीय अथवा अंतरराष्ट्रीय स्तर पर पद्म सम्मान, राजकीय पुरस्कार, ग्रंथ लेखन अथवा विशिष्ट चिकित्सा अनुसंधान में अभूतपूर्व योगदान दिया है, उनकी अधिकृत प्रविष्टियां एसोसिएशन एडमिन द्वारा सत्यापित कर यहाँ प्रदर्शित की जाती हैं।
                </p>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-xs text-slate-700 mb-6 text-left space-y-1.5">
                  <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>नामांकन एवं सत्यापन प्रक्रिया:</span>
                  </div>
                  <p className="text-slate-600">
                    यदि आप या आपके सहपाठी किसी विशिष्ट राष्ट्रीय/अंतरराष्ट्रीय उपलब्धि से अलंकृत हुए हैं, तो विवरण एसोसिएशन समिति को भेजें।
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-md"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>एडमिन पैनल में अचीवर जोड़ें (+ Add Achiever)</span>
                    </Link>
                  ) : (
                    <a
                      href="https://wa.me/919412070000?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%88%E0%A4%82%20%E0%A4%8B%E0%A4%B7%E0%A4%BF%E0%A4%95%E0%A5%81%E0%A4%B2%20%E0%A4%B9%E0%A5%89%E0%A4%B2%20%E0%A4%91%E0%A4%AB%20%E0%A4%AB%E0%A5%87%E0%A4%AE%20%E0%A4%B9%E0%A5%87%E0%A4%A4%E0%A5%81%20%E0%A4%85%E0%A4%9A%E0%A5%80%E0%A4%B5%E0%A4%B0%20%E0%A4%95%E0%A4%BE%20%E0%A4%A8%E0%A4%BE%E0%A4%AE%20%E0%A4%B8%E0%A5%81%E0%A4%9D%E0%A4%BE%E0%A4%A8%E0%A4%BE%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A4%BE%20%E0%A4%B9%E0%A5%82%E0%A4%81%E0%A5%A4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-md"
                    >
                      <Mail className="w-4 h-4 text-[#C5A059]" />
                      <span>विशिष्ट विभूति का नाम सुझाएं (Nominate)</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PATRONS (संरक्षक मंडल) ================= */}
        {activeTab === "patrons" && (
          <div className="space-y-12">
            {/* Banner Statement */}
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-amber-200 text-xs font-semibold mb-3">
                  <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                  संरक्षक मंडल • Council of Patrons
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-white mb-2">
                  ऋषिकुल एल्युमनाई संरक्षक मंडल
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  ऋषिकुल एल्युमनाई एसोसिएशन का संरक्षक मंडल संस्थान के मार्गदर्शन, दीर्घकालिक संवर्धन और विकास का मुख्य आधार स्तंभ है। इसमें हमारे पूज्य संस्थापक महामना जी की प्रेरणा और वे सभी सम्मानित पूर्व छात्र व वरिष्ठ चिकित्सक सम्मिलित हैं, जिन्होंने संरक्षक के रूप में संस्थान को अपना अमूल्य सहयोग प्रदान किया है।
                </p>
              </div>
            </div>

            {/* 1. FOUNDING PATRON PILLAR */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                  मुख्य प्रेरणास्रोत एवं संस्थापक संरक्षक
                </h3>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-[#C5A059] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-bl-full pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Portrait */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-lg flex-shrink-0 bg-slate-900 relative">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Madan_Mohan_Malviya.jpg/480px-Madan_Mohan_Malviya.jpg"
                      alt="Mahamana Pandit Madan Mohan Malaviya"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#C5A059] text-[#0F172A] text-[10px] font-bold">
                      भारत रत्न
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
                      <Crown className="w-3 h-3" />
                      संस्थापक एवं प्रधान संरक्षक • Founder Visionary & Patron (1919)
                    </div>
                    <h4 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mb-1">
                      महामना पं. मदन मोहन मालवीय
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-[#2D5A43] mb-4">
                      Bharat Ratna Mahamana Pandit Madan Mohan Malaviya (1861–1946)
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      महामना मालवीय जी ने वर्ष 1919 में हरिद्वार में पावन गंगा तट पर ऋषिकुल आयुर्वेदिक कॉलेज की स्थापना कर भारत की प्राचीनतम वैदिक आयुर्वेद चिकित्सा पद्धति को पुनर्जीवित करने का ऐतिहासिक संकल्प लिया। वे ऋषिकुल के शाश्वत प्रेरणास्रोत एवं प्रधान संरक्षक हैं।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">संस्थापना वर्ष</span>
                        <span className="font-bold text-[#0F172A]">1919 ईस्वी</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">राष्ट्रीय उपाधि</span>
                        <span className="font-bold text-[#0F172A]">भारत रत्न (सर्वोच्च नागरिक सम्मान)</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">आदर्श वाक्य</span>
                        <span className="font-bold text-[#0F172A]">सत्यमेव जयते • सेवा परमो धर्मः</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. REGISTERED PATRON MEMBERS ROSTER */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                    एसोसिएशन के सम्मानित संरक्षक सदस्य (Patron Members)
                  </h3>
                  <p className="text-xs text-slate-500">
                    एसोसिएशन एडमिन द्वारा सत्यापित एवं अनुमोदित संरक्षक सदस्य (Patron Membership Tier)
                  </p>
                </div>

                <Link
                  href="/membership"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:text-[#0F172A] transition-colors self-start sm:self-auto"
                >
                  <span>संरक्षक सदस्यता नियम देखें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {patronMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patronMembers.map((patron) => (
                    <div
                      key={patron.id}
                      className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 hover:border-[#C5A059] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Patron Card Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={patron.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                            alt={patron.fullName}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059] shadow-sm flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                              <Crown className="w-3 h-3 text-[#C5A059]" />
                              Patron Member
                            </span>
                            <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] truncate">
                              {patron.fullName}
                            </h4>
                            {patron.fullNameHindi && (
                              <p className="text-xs text-[#C5A059] truncate font-medium">
                                {patron.fullNameHindi}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badges & Batch Info */}
                        <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                            <span>
                              {patron.ugBatchYear ? `UG: ${patron.ugBatchYear}` : ""}{" "}
                              {patron.pgBatchYear ? `• PG: ${patron.pgBatchYear}` : ""}{" "}
                              ({patron.specialization || "Ayurveda"})
                            </span>
                          </div>
                          {patron.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                              <span>
                                {patron.city}, {patron.state}
                              </span>
                            </div>
                          )}
                          {patron.workplace && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                              <span className="truncate">{patron.workplace}</span>
                            </div>
                          )}
                        </div>

                        {patron.bio && (
                          <p className="text-xs text-slate-600 line-clamp-3 italic mb-4 font-light">
                            "{patron.bio}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          सत्यापित संरक्षक
                        </span>
                        {(patron.whatsappNumber || patron.mobile) && (
                          <a
                            href={`https://wa.me/${(patron.whatsappNumber || patron.mobile).replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#2D5A43] hover:underline font-medium text-[11px]"
                          >
                            <span>WhatsApp</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C5A059]/30 text-center max-w-2xl mx-auto shadow-sm">
                  <Crown className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
                  <h4 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-2">
                    संरक्षक सदस्यता (Patron Membership)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    ऋषिकुल एल्युमनाई एसोसिएशन के संरक्षक सदस्य के रूप में जुड़कर आप संस्थान के विकास, छात्र कल्याण और प्राचीन आयुर्वेदिक विरासत के संरक्षण में अमूल्य योगदान दे सकते हैं।
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/membership"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                    >
                      <span>संरक्षक सदस्यता विवरण देखें</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-[#C5A059] text-[#0F172A] font-semibold text-xs hover:bg-amber-50/50 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>पंजीकरण करें</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
