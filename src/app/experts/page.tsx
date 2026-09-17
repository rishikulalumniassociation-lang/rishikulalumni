"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Sparkles,
  Users2,
  Search,
  Filter,
  GraduationCap,
  MapPin,
  Building,
  Phone,
  MessageCircle,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Award,
  ChevronRight
} from "lucide-react";
import { getAlumniList, getLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";

const DISEASE_TAGS = [
  "All",
  "अर्श व क्षारसूत्र",
  "संधिवात / आमवात",
  "सोरायसिस व त्वचा",
  "पंचकर्म",
  "स्त्री रोग व वंध्यत्व",
  "मधुमेह",
  "यकृत व उदर",
  "श्वास व कास",
];

export default function AyurvedaExpertsPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShishya, setOnlyShishya] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    setAlumni(getAlumniList());
    setCurrentUser(getLoggedInAlumni());

    const handleUpdate = () => {
      setAlumni(getAlumniList());
    };
    window.addEventListener("alumni_updated", handleUpdate);
    return () => window.removeEventListener("alumni_updated", handleUpdate);
  }, []);

  // Filter experts
  // An alumnus is considered an expert if they have diseaseSpecialty, or acceptingShishya, or clinical specialization
  const experts = alumni.filter((a) => {
    // Basic filter: only verified/approved alumni, or all in dev
    const hasSpecialty = Boolean(a.diseaseSpecialty || a.specialization);
    if (!hasSpecialty && !a.acceptingShishya) return false;

    if (onlyShishya && !a.acceptingShishya) return false;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      (a.diseaseSpecialty && a.diseaseSpecialty.toLowerCase().includes(q)) ||
      (a.specialization && a.specialization.toLowerCase().includes(q)) ||
      a.city.toLowerCase().includes(q) ||
      a.workplace.toLowerCase().includes(q);

    const matchesTag =
      selectedTag === "All" ||
      (a.diseaseSpecialty && a.diseaseSpecialty.toLowerCase().includes(selectedTag.toLowerCase())) ||
      (a.specialization && a.specialization.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  const shishyaCount = alumni.filter((a) => a.acceptingShishya).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#C5A059]/30 pb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-2 bg-[#2D5A43]/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Guru-Shishya Parampara & Disease-Specific Mastery</span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Ayurveda Clinical Experts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
              ऋषिकुल के अनुभवी वैद्यों की रोग-विशिष्ट क्लिनिकल विशेषता (Disease Specialization) डायरेक्टरी। यहाँ आप अर्श, क्षारसूत्र, संधिवात, पंचकर्म आदि के विशेषज्ञों से जुड़ सकते हैं तथा जो वरिष्ठ वैद्य कनिष्ठों को सिखाने हेतु <strong>शिष्य स्वीकार (Join me as a Shishya)</strong> कर रहे हैं, उनसे मार्गदर्शन प्राप्त कर सकते हैं।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Add My Specialty / Shishya Option</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by doctor name, disease, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />
            </div>

            {/* Shishya Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                type="button"
                onClick={() => setOnlyShishya(!onlyShishya)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  onlyShishya
                    ? "bg-[#2D5A43] text-white border-[#2D5A43] shadow-sm"
                    : "bg-[#FAF7F2] text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Show Only Accepting Shishya (शिष्य स्वीकार्य)</span>
                {shishyaCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${onlyShishya ? "bg-white text-[#2D5A43]" : "bg-[#2D5A43] text-white"}`}>
                    {shishyaCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              रोग वर्ग:
            </span>
            {DISEASE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedTag === tag
                    ? "bg-[#0F172A] text-[#C5A059] font-bold shadow-xs"
                    : "bg-[#FAF7F2] text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Experts Grid */}
        {experts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#2D5A43] flex items-center justify-center mx-auto border border-[#C5A059]/30">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                No Ayurveda Specialists Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                वर्तमान में इस खोज या फ़िल्टर के अनुरूप कोई विशेषज्ञ सूचीबद्ध नहीं है। यदि आप पंजीकृत पूर्व छात्र हैं, तो अपनी प्रोफ़ाइल में अपनी क्लिनिकल विशेषता और शिष्य विकल्प तुरंत जोड़ें।
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors"
              >
                Go to Profile & Add Specialty
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((exp) => {
              const cleanWa = (exp.whatsappNumber || exp.mobile || "").replace(/\D/g, "");
              const waLink = cleanWa
                ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `प्रणाम आदरणीय डॉ. ${exp.fullName} जी! मैं ऋषिकुल एलुमनाई डायरेक्टरी के माध्यम से आपकी विशेषज्ञता (${exp.diseaseSpecialty || exp.specialization || "आयुर्वेद चिकित्सा"}) देखकर संपर्क कर रहा हूँ।`
                  )}`
                : null;

              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/30 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo & Shishya Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                          alt={exp.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C5A059]/40 shadow-sm"
                        />
                        <div>
                          <h4 className="font-serif-heading font-bold text-base text-[#0F172A] leading-tight">
                            Dr. {exp.fullName}
                          </h4>
                          <p className="text-xs text-[#2D5A43] font-semibold mt-0.5">
                            {exp.rishikulEducation === "BOTH"
                              ? `UG:${exp.ugBatchYear || ""}, PG:${exp.pgBatchYear || ""}`
                              : exp.rishikulEducation === "PG"
                              ? `PG:${exp.pgBatchYear || ""} (MD/MS)`
                              : `UG:${exp.ugBatchYear || ""} (BAMS)`}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {exp.city}, {exp.state}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Accepting Shishya Banner */}
                    {exp.acceptingShishya && (
                      <div className="mb-3.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-100/90 to-emerald-100/90 border border-[#C5A059] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <div className="text-[11px] font-bold text-[#0F172A] leading-tight">
                          ✨ Accepting Shishya (शिष्य स्वीकार्य)
                          <span className="block text-[10px] font-normal text-slate-600">
                            कनिष्ठ छात्रों को विशेषता सिखाने हेतु उपलब्ध
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Disease Specialty Highlight Box */}
                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 mb-3 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-[#2D5A43] flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Primary Disease Specialty / रोग विशेषज्ञता:
                      </div>
                      <div className="text-xs font-bold text-[#0F172A] leading-snug">
                        {exp.diseaseSpecialty || exp.specialization || "सामान्य आयुर्वेद चिकित्सा"}
                      </div>
                    </div>

                    {/* Clinical Experience / Approach */}
                    {exp.specialtyDescription && (
                      <div className="text-xs text-slate-600 mb-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-800 text-[11px] block mb-0.5">
                          क्लिनिकल पद्धति व अनुभव:
                        </span>
                        <p className="line-clamp-3">{exp.specialtyDescription}</p>
                      </div>
                    )}

                    {/* Shishya Requirements */}
                    {exp.acceptingShishya && exp.shishyaRequirement && (
                      <div className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 mb-3 leading-relaxed">
                        <span className="font-bold text-[11px] block mb-0.5 text-amber-950">
                          📜 शिष्य हेतु निर्देश व पात्रता:
                        </span>
                        <p className="line-clamp-2 text-[11px]">{exp.shishyaRequirement}</p>
                      </div>
                    )}

                    {/* Practice Workplace */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{exp.designation}, {exp.workplace}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Connect</span>
                      </a>
                    ) : (
                      <div className="flex-1 text-center py-2 text-[11px] text-slate-400 bg-slate-100 rounded-xl">
                        Contact via Portal
                      </div>
                    )}

                    <Link
                      href={`/directory?search=${encodeURIComponent(exp.fullName)}`}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      title="View Full Directory Profile"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
