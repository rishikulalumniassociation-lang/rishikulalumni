"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  X,
  AlertCircle,
  Edit3,
  Trash2,
  Plus
} from "lucide-react";
import { getAlumniList, getLoggedInAlumni, updateAlumniProfile } from "@/lib/store";
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

const QUICK_SPECIALTY_CHIPS = [
  "अर्श, भगंदर व क्षारसूत्र (Ksharasutra)",
  "संधिवात व आमवात (Arthritis)",
  "सोरायसिस व चर्म रोग (Skin)",
  "मधुमेह एवं जीवनशैली रोग (Diabetes)",
  "स्त्री रोग व वंध्यत्व (Infertility)",
  "पंचकर्म एवं शोधन (Panchakarma)",
  "यकृत एवं उदर विकार (Gastro/Liver)",
  "श्वास एवं कास (Asthma/Respiratory)",
  "शलाक्य तंत्र (Eye/ENT)",
  "बालरोग एवं स्वर्णप्राशन (Pediatrics)",
];

export default function AyurvedaExpertsPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyShishya, setOnlyShishya] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Expert Form Data
  const [formData, setFormData] = useState({
    diseaseSpecialty: "",
    specialtyDescription: "",
    acceptingShishya: false,
    shishyaRequirement: "",
  });

  useEffect(() => {
    refreshData();

    const handleUpdate = () => {
      refreshData();
    };
    window.addEventListener("alumni_updated", handleUpdate);
    return () => window.removeEventListener("alumni_updated", handleUpdate);
  }, []);

  const refreshData = () => {
    const list = getAlumniList();
    const user = getLoggedInAlumni();
    setAlumni(list);
    setCurrentUser(user);

    if (user) {
      setFormData({
        diseaseSpecialty: user.diseaseSpecialty || "",
        specialtyDescription: user.specialtyDescription || "",
        acceptingShishya: !!user.acceptingShishya,
        shishyaRequirement: user.shishyaRequirement || "",
      });
    }
  };

  const handleOpenExpertModal = () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    // Prefill form from current user
    setFormData({
      diseaseSpecialty: currentUser.diseaseSpecialty || "",
      specialtyDescription: currentUser.specialtyDescription || "",
      acceptingShishya: !!currentUser.acceptingShishya,
      shishyaRequirement: currentUser.shishyaRequirement || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.diseaseSpecialty.trim()) {
      alert("कृपया अपनी रोग विशेषज्ञता (Disease Specialty) अवश्य दर्ज करें।");
      return;
    }

    updateAlumniProfile(currentUser.id, {
      isExpert: true,
      diseaseSpecialty: formData.diseaseSpecialty.trim(),
      specialtyDescription: formData.specialtyDescription.trim(),
      acceptingShishya: formData.acceptingShishya,
      shishyaRequirement: formData.acceptingShishya ? formData.shishyaRequirement.trim() : "",
    });

    setIsModalOpen(false);
    setSaveSuccessMsg("आपकी विशेषज्ञता व गुरु जानकारी सफलतापूर्वक प्रकाशित हो गई है!");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
    window.dispatchEvent(new Event("alumni_updated"));
  };

  const handleRemoveFromExperts = () => {
    if (!currentUser) return;
    const confirm = window.confirm("क्या आप वाकई विशेषज्ञ डायरेक्टरी से अपना नाम हटाना चाहते हैं?");
    if (!confirm) return;

    updateAlumniProfile(currentUser.id, {
      isExpert: false,
      diseaseSpecialty: "",
      specialtyDescription: "",
      acceptingShishya: false,
      shishyaRequirement: "",
    });

    setIsModalOpen(false);
    setSaveSuccessMsg("आपको विशेषज्ञ डायरेक्टरी से हटा दिया गया है।");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
    window.dispatchEvent(new Event("alumni_updated"));
  };

  // Filter experts:
  // STRICT RULE: Only show alumni who have explicitly registered as an expert!
  // Do NOT show someone just because they have a PG Specialization (MD/MS degree).
  const experts = alumni.filter((a) => {
    const isRegisteredExpert = Boolean(
      a.isExpert ||
      (a.diseaseSpecialty && a.diseaseSpecialty.trim().length > 0) ||
      a.acceptingShishya
    );
    if (!isRegisteredExpert) return false;

    if (onlyShishya && !a.acceptingShishya) return false;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      (a.diseaseSpecialty && a.diseaseSpecialty.toLowerCase().includes(q)) ||
      a.city.toLowerCase().includes(q) ||
      a.workplace.toLowerCase().includes(q);

    const matchesTag =
      selectedTag === "All" ||
      (a.diseaseSpecialty && a.diseaseSpecialty.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  const shishyaCount = experts.filter((a) => a.acceptingShishya).length;
  const isCurrentUserExpert = currentUser && (
    currentUser.isExpert ||
    (currentUser.diseaseSpecialty && currentUser.diseaseSpecialty.trim().length > 0) ||
    currentUser.acceptingShishya
  );

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
              ऋषिकुल के अनुभवी वैद्यों की रोग-विशिष्ट क्लिनिकल विशेषता (Disease Specialization) डायरेक्टरी। यहाँ केवल वही पूर्व छात्र प्रदर्शित होते हैं जिन्होंने अपनी क्लिनिकल रोग-विशेषज्ञता घोषित की है तथा जो कनिष्ठों को सिखाने हेतु <strong>शिष्य स्वीकार (Join me as a Shishya)</strong> कर रहे हैं।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {isCurrentUserExpert ? (
              <div className="flex flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={handleOpenExpertModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2D5A43] text-white hover:bg-[#1E3D2D] text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <Edit3 className="w-4 h-4 text-[#C5A059]" />
                  <span>Edit My Expert / Guru Details</span>
                </button>
                <span className="text-[11px] font-bold text-[#2D5A43] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  You are listed as an Expert
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenExpertModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Me as an Expert / Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Save Success Alert */}
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
        )}

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
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto leading-relaxed">
                वर्तमान में इस खोज या फ़िल्टर के अनुरूप कोई विशेषज्ञ पंजीकृत नहीं है। केवल वही वैद्य यहाँ प्रदर्शित होते हैं जो लॉगिन करके स्वयं को विशेषज्ञ या गुरु के रूप में जोड़ते हैं।
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenExpertModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Me as an Expert / Guru</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((exp) => {
              const cleanWa = (exp.whatsappNumber || exp.mobile || "").replace(/\D/g, "");
              const waLink = cleanWa
                ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `प्रणाम आदरणीय डॉ. ${exp.fullName} जी! मैं ऋषिकुल एलुमनाई डायरेक्टरी के माध्यम से आपकी रोग विशेषज्ञता (${exp.diseaseSpecialty || "आयुर्वेद चिकित्सा"}) देखकर संपर्क कर रहा हूँ।`
                  )}`
                : null;

              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/30 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo, Name & Degrees */}
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
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="text-[11px] text-[#2D5A43] font-semibold">
                              {exp.rishikulEducation === "BOTH"
                                ? `UG:${exp.ugBatchYear || ""}, PG:${exp.pgBatchYear || ""}`
                                : exp.rishikulEducation === "PG"
                                ? `PG:${exp.pgBatchYear || ""} (MD/MS)`
                                : `UG:${exp.ugBatchYear || ""} (BAMS)`}
                            </span>
                            {exp.specialization && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                PG: {exp.specialization}
                              </span>
                            )}
                          </div>
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

                    {/* Clinical Disease Specialty Highlight Box */}
                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 mb-3 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-[#2D5A43] flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Clinical Disease Specialty / रोग विशिष्टता:
                      </div>
                      <div className="text-xs font-bold text-[#0F172A] leading-snug">
                        {exp.diseaseSpecialty || "सामान्य आयुर्वेद चिकित्सा"}
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

        {/* LOGIN PROMPT MODAL */}
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#C5A059] shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A059] border border-[#C5A059]/40 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                लॉगिन आवश्यक है • Login Required
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                आयुर्वेद विशेषज्ञ डायरेक्टरी में अपना नाम, रोग विशिष्टता एवं शिष्य विकल्प जोड़ने के लिए कृपया पहले अपने ऋषिकुल एलुमनाई खाते में लॉगिन करें।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/login?redirect=/experts")}
                  className="flex-1 py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  Go to Login (लॉगिन करें)
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginPromptOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT EXPERT MODAL */}
        {isModalOpen && currentUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#C5A059] shadow-2xl my-8 relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Join Ayurveda Clinical Experts & Gurujans
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                  रोग विशेषज्ञता एवं गुरु-शिष्य विकल्प दर्ज करें
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  यहाँ अपनी विशिष्ट क्लिनिकल रोग-चिकित्सा दर्ज करें। यह जानकारी 'Ayurveda Experts' डायरेक्टरी में प्रकाशित होगी।
                </p>
              </div>

              {/* Doctor Summary Banner */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex items-center gap-3 mb-5">
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={currentUser.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#C5A059]"
                />
                <div className="text-xs">
                  <strong className="text-sm text-[#0F172A] block font-serif-heading font-bold">
                    Dr. {currentUser.fullName}
                  </strong>
                  <span className="text-[#2D5A43] font-medium">
                    {currentUser.designation} • {currentUser.city}, {currentUser.state}
                  </span>
                  {currentUser.specialization && (
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      PG Specialization: <strong className="text-slate-700">{currentUser.specialization}</strong>
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveExpert} className="space-y-4">
                {/* 1. Disease Specialty Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#2D5A43]" />
                    Clinical Disease Specialty / रोग विशिष्टता *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. अर्श, भगंदर व क्षारसूत्र (Ksharasutra) / सोरायसिस / संधिवात"
                    value={formData.diseaseSpecialty}
                    onChange={(e) => setFormData({ ...formData, diseaseSpecialty: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />

                  {/* Quick Click Chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-slate-400 self-center mr-1">त्वरित चयन:</span>
                    {QUICK_SPECIALTY_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setFormData({ ...formData, diseaseSpecialty: chip })}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#C5A059]/20 hover:text-[#0F172A] text-slate-600 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Clinical Approach & Protocol */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#2D5A43]" />
                    Clinical Approach & Protocol / क्लिनिकल अनुभव व उपचार पद्धति
                  </label>
                  <textarea
                    rows={3}
                    placeholder="उदा. 20+ वर्षों से जटिल अर्श-भगंदर का सफल क्षारसूत्र उपचार। विशेष आयुर्वेदिक रस-औषधि एवं शोधन चिकित्सा..."
                    value={formData.specialtyDescription}
                    onChange={(e) => setFormData({ ...formData, specialtyDescription: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                {/* 3. Guru-Shishya Checkbox */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-[#FAF7F2] border-2 border-[#C5A059]/40 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="shishyaCheckModal"
                      checked={formData.acceptingShishya}
                      onChange={(e) => setFormData({ ...formData, acceptingShishya: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded text-[#2D5A43] focus:ring-[#2D5A43] cursor-pointer"
                    />
                    <label htmlFor="shishyaCheckModal" className="cursor-pointer">
                      <div className="text-xs sm:text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <span>🌟 Join me as a Shishya (शिष्य स्वीकार्य)</span>
                        <span className="text-[10px] bg-[#2D5A43] text-white px-2 py-0.5 rounded-full uppercase font-bold">
                          गुरु-शिष्य परंपरा
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        हाँ, मैं अपनी इस क्लिनिकल विशेषता को ऋषिकुल के कनिष्ठ वैद्यों एवं नए स्नातकों को सिखाने के लिए तैयार हूँ।
                      </p>
                    </label>
                  </div>

                  {formData.acceptingShishya && (
                    <div className="pt-2 pl-7 space-y-2 animate-in fade-in">
                      <label className="block text-[11px] font-bold uppercase text-slate-700">
                        शिष्य हेतु निर्देश व पात्रता (Mentorship Requirements)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="उदा. BAMS फ्रेश ग्रेजुएट / इंटर्न। न्यूनतम 6 माह समय अनिवार्य। ओपीडी समय प्रातः 10:00 से 2:00 बजे..."
                        value={formData.shishyaRequirement}
                        onChange={(e) => setFormData({ ...formData, shishyaRequirement: e.target.value })}
                        className="w-full bg-white border border-[#C5A059]/50 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="w-full sm:w-auto">
                    {isCurrentUserExpert && (
                      <button
                        type="button"
                        onClick={handleRemoveFromExperts}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-semibold transition-colors"
                      >
                        Remove from Experts (विशेषज्ञ सूची से हटें)
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Save & Publish as Expert
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
