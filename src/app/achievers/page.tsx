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
  X,
  Search,
  AlertTriangle,
  Copy,
  Check,
  MessageCircle,
  Plus,
  User
} from "lucide-react";
import {
  getLifetimeAchievers,
  getAlumniList,
  isAdminAuthenticated,
  getLoggedInAlumni,
  submitAchieverNomination
} from "@/lib/store";
import { LifetimeAchiever, AlumniProfile, AchieverNomination } from "@/types";

const SUGGESTED_TITLES = [
  "पद्म पुरस्कार / राष्ट्रीय अलंकरण",
  "कुलपति / निदेशक / वरिष्ठ डीन",
  "विशिष्ट अनुसंधान व शास्त्र ग्रंथ लेखक",
  "शल्य व क्षारसूत्र चिकित्सा में कीर्तिमान",
  "अंतरराष्ट्रीय स्तर पर आयुर्वेद प्रसारक",
  "राष्ट्रीय धन्वंतरि पुरस्कार से सम्मानित"
];

export default function AchieversPage() {
  const [activeTab, setActiveTab] = useState<"achievers" | "patrons">("achievers");
  const [achievers, setAchievers] = useState<LifetimeAchiever[]>([]);
  const [patronMembers, setPatronMembers] = useState<AlumniProfile[]>([]);
  const [allAlumni, setAllAlumni] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Nomination Modal State
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [searchAlumniQuery, setSearchAlumniQuery] = useState("");
  const [selectedNominee, setSelectedNominee] = useState<AlumniProfile | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [nominationSuccessMsg, setNominationSuccessMsg] = useState("");

  // Nomination Form State
  const [nomForm, setNomForm] = useState({
    achievementTitle: "",
    citation: "",
    awards: "",
    nominatorName: "",
    nominatorMobile: "",
    nominatorEmail: "",
    nominatorBatchText: "",
  });

  useEffect(() => {
    loadData();
    setIsAdmin(isAdminAuthenticated());
    const user = getLoggedInAlumni();
    setCurrentUser(user);
    if (user) {
      setNomForm((prev) => ({
        ...prev,
        nominatorName: `Dr. ${user.fullName}`,
        nominatorMobile: user.whatsappNumber || user.mobile,
        nominatorEmail: user.email,
        nominatorBatchText: user.ugBatchYear ? `UG: ${user.ugBatchYear}` : `PG: ${user.pgBatchYear || ""}`,
      }));
    }

    const handleUpdate = () => loadData();
    window.addEventListener("achievers_updated", handleUpdate);
    window.addEventListener("alumni_data_updated", handleUpdate);
    window.addEventListener("alumni_updated", handleUpdate);
    return () => {
      window.removeEventListener("achievers_updated", handleUpdate);
      window.removeEventListener("alumni_data_updated", handleUpdate);
      window.removeEventListener("alumni_updated", handleUpdate);
    };
  }, []);

  const loadData = async () => {
    const [achieversList, list] = await Promise.all([
      getLifetimeAchievers(),
      getAlumniList(),
    ]);
    setAchievers(achieversList);
    setAllAlumni(list);
    const patrons = list.filter(
      (a) => a.membershipTier === "Patron Member" && a.approvalStatus === "approved" && !a.isDeceased
    );
    setPatronMembers(patrons);
  };

  // Filter alumni for nomination search
  const filteredAlumni = allAlumni.filter((a) => {
    if (!searchAlumniQuery.trim()) return false;
    const q = searchAlumniQuery.toLowerCase().trim();
    return (
      (a.fullName || "").toLowerCase().includes(q) ||
      (a.fullNameHindi || "").toLowerCase().includes(q) ||
      (a.city || "").toLowerCase().includes(q) ||
      (a.workplace || "").toLowerCase().includes(q) ||
      (a.ugBatchYear ? a.ugBatchYear.toString().includes(q) : false) ||
      (a.pgBatchYear ? a.pgBatchYear.toString().includes(q) : false)
    );
  });

  const handleOpenNomination = () => {
    setSearchAlumniQuery("");
    setSelectedNominee(null);
    setNominationSuccessMsg("");
    setIsNominateModalOpen(true);
  };

  const handleSubmitNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNominee) {
      alert("कृपया पहले किसी पंजीकृत पूर्व छात्र का चयन करें।");
      return;
    }
    if (!nomForm.achievementTitle.trim() || !nomForm.citation.trim()) {
      alert("कृपया उपलब्धि का शीर्षक एवं प्रशस्ति (Citation) अवश्य भरें।");
      return;
    }

    const awardsArr = nomForm.awards
      ? nomForm.awards.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      await submitAchieverNomination({
        nomineeId: selectedNominee.id,
        nomineeName: selectedNominee.fullName,
        nomineeNameHindi: selectedNominee.fullNameHindi,
        nomineeDegree: selectedNominee.ugDegree || selectedNominee.pgDegree || "BAMS",
        nomineeBatchYear: selectedNominee.ugBatchYear || selectedNominee.pgBatchYear || 1980,
        nomineeWorkplace: selectedNominee.workplace,
        nomineeCity: selectedNominee.city,
        nomineePhotoUrl: selectedNominee.avatarUrl,
        achievementTitle: nomForm.achievementTitle.trim(),
        citation: nomForm.citation.trim(),
        awards: awardsArr,
        nominatorId: currentUser?.id || "guest",
        nominatorName: nomForm.nominatorName.trim() || (currentUser ? `Dr. ${currentUser.fullName}` : "ऋषिकुल एलुमनाई"),
        nominatorEmail: nomForm.nominatorEmail.trim(),
        nominatorMobile: nomForm.nominatorMobile.trim(),
        nominatorBatchText: nomForm.nominatorBatchText.trim(),
      });

      setNominationSuccessMsg(
        `डॉ. ${selectedNominee.fullName} का नामांकन एसोसिएशन एडमिन समिति को सफलतापूर्वक भेज दिया गया है। समिति के सत्यापन के उपरांत यह नाम 'हॉल ऑफ फेम' में सम्मिलित किया जाएगा।`
      );
    } catch (err) {
      alert("नामांकन सबमिट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#C5A059]/30 pb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Hall of Fame, Laurels & Patrons</span>
            </div>
            <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
              Hall of Fame & Patrons
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
              ऋषिकुल राजकीय आयुर्वेद महाविद्यालय के गौरवशाली पूर्व छात्रों एवं संरक्षक मंडल (Patrons) का आधिकारिक सम्मान पटल।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenNomination}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              <span>Nominate an Alumnus (नाम सुझाएं)</span>
            </button>

            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Manage in Admin
              </Link>
            )}
          </div>
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
              <div>
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

                {/* Bottom Nomination Banner */}
                <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>क्या आप किसी अन्य विशिष्ट विभूति का नाम सुझाना चाहते हैं?</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      यदि ऋषिकुल के किसी पंजीकृत पूर्व छात्र ने राष्ट्रीय अथवा अंतरराष्ट्रीय स्तर पर असाधारण योगदान दिया है, तो उनका नाम समिति के पास नामांकित करें।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNomination}
                    className="px-6 py-3 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm whitespace-nowrap active:scale-95"
                  >
                    Nominate an Alumnus
                  </button>
                </div>
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
                    यदि आप या आपके सहपाठी किसी विशिष्ट राष्ट्रीय/अंतरराष्ट्रीय उपलब्धि से अलंकृत हुए हैं, तो नीचे दिए गए बटन द्वारा उनका नाम सीधे एडमिन समिति को सुझाएं।
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenNomination}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-[#C5A059]" />
                    <span>विशिष्ट विभूति का नाम सुझाएं (Nominate for Hall of Fame)</span>
                  </button>
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

              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059] shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#C5A059] flex-shrink-0 shadow-md bg-amber-50">
                  <img
                    src="/images/madan-mohan-malviya.webp"
                    alt="Mahamana Pandit Madan Mohan Malaviya"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase mb-2">
                    <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                    संस्थापक प्रेरणापुरुष (1861 – 1946)
                  </div>
                  <h4 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
                    भारत रत्न महामना पंडित मदन मोहन मालवीय जी
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-[#2D5A43] mt-1 mb-4">
                    संस्थापक: ऋषिकुल ब्रह्मचर्याश्रम एवं ऋषिकुल आयुर्वेद महाविद्यालय, हरिद्वार (स्थापना वर्ष 1919)
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light mb-4">
                    "आयुर्वेद केवल चिकित्सा पद्धति नहीं अपितु संपूर्ण जीवन का विज्ञान है।" महामना जी ने भारतीय ज्ञान परंपरा, वैदिक संस्कृति और आयुर्वेद के संरक्षण हेतु हरिद्वार की पुण्यभूमि पर ऋषिकुल की स्थापना की। समस्त ऋषिकुल एल्युमनाई परिवार उनके पावन संकल्प एवं उच्च आदर्शों के प्रति नतमस्तक है।
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <span>सदा स्मरणीय संस्थापक संरक्षक</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PATRON MEMBERS ROSTER */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#C5A059]" />
                    <span>संरक्षक सदस्य गण (Patron Members)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    वे विशिष्ट पूर्व छात्र जिन्होंने 'Patron Member' सदस्यता ग्रहण कर संस्थान के संरक्षण में सहभागिता की है।
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#0F172A] text-[#C5A059] self-start">
                  कुल संरक्षक: {patronMembers.length}
                </span>
              </div>

              {patronMembers.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-xl mx-auto space-y-3">
                  <Crown className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                    संरक्षक सदस्यता प्रविष्टियाँ
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    वर्तमान में संरक्षक सदस्यता हेतु आवेदन प्रक्रियाधीन हैं। यदि आप संरक्षक मंडल में सम्मिलित होना चाहते हैं तो सदस्यता नियमों का अवलोकन करें।
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/membership"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D5A43] hover:underline"
                    >
                      <span>संरक्षक सदस्यता नियम देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patronMembers.map((patron) => (
                    <div
                      key={patron.id}
                      className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/40 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={patron.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                            alt={patron.fullName}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059] shadow-sm flex-shrink-0"
                          />
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] uppercase mb-1">
                              <Crown className="w-3 h-3 text-[#C5A059]" />
                              Patron Member
                            </span>
                            <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] leading-tight">
                              Dr. {patron.fullName}
                            </h4>
                            {patron.fullNameHindi && (
                              <p className="text-xs text-slate-500 mt-0.5">{patron.fullNameHindi}</p>
                            )}
                            <p className="text-xs text-[#2D5A43] font-semibold mt-1">
                              {patron.ugBatchYear ? `UG Batch: ${patron.ugBatchYear}` : ""}{" "}
                              {patron.pgBatchYear ? `• PG: ${patron.pgBatchYear}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-[#FAF7F2] p-3 rounded-xl border border-slate-200">
                          <p className="font-medium text-[#0F172A]">{patron.designation}</p>
                          <p className="text-slate-500">{patron.workplace}</p>
                          <p className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {patron.city}, {patron.state}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">
                          {patron.specialization || patron.ugDegree || "BAMS"}
                        </span>
                        <Link
                          href={`/directory?search=${encodeURIComponent(patron.fullName)}`}
                          className="text-xs font-bold text-[#2D5A43] hover:underline flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= NOMINATE ACHIEVER MODAL ================= */}
        {isNominateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#C5A059] shadow-2xl my-8 relative">
              <button
                type="button"
                onClick={() => setIsNominateModalOpen(false)}
                className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
                  Hall of Fame Alumnus Nomination
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                  विशिष्ट विभूति का नाम सुझाएं (Nominate an Alumnus)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  हॉल ऑफ फेम हेतु केवल वही पूर्व छात्र नामांकित हो सकते हैं जो इस पोर्टल पर पंजीकृत हैं। नामांकन सीधे एडमिन समिति को भेजा जाएगा।
                </p>
              </div>

              {/* SUCCESS MESSAGE */}
              {nominationSuccessMsg ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-300 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-heading text-lg font-bold text-emerald-950">
                    नामांकन सफलतापूर्वक प्राप्त हुआ!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                    {nominationSuccessMsg}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsNominateModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
                  >
                    Close (बंद करें)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitNomination} className="space-y-5">
                  {/* STEP 1: SELECT REGISTERED ALUMNUS */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-[#2D5A43]" />
                      <span>1. पूर्व छात्र खोजें एवं चुनें (Search Registered Alumnus) *</span>
                    </label>

                    {selectedNominee ? (
                      // Selected Candidate Card
                      <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-[#C5A059] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={selectedNominee.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                            alt={selectedNominee.fullName}
                            className="w-14 h-14 rounded-xl object-cover border border-[#C5A059] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2D5A43] text-white">
                              पंजीकृत पूर्व छात्र ✓
                            </span>
                            <h5 className="font-serif-heading font-bold text-base text-[#0F172A] mt-1 truncate">
                              Dr. {selectedNominee.fullName} {selectedNominee.fullNameHindi && `(${selectedNominee.fullNameHindi})`}
                            </h5>
                            <p className="text-xs text-slate-600 truncate">
                              {selectedNominee.ugBatchYear ? `UG: ${selectedNominee.ugBatchYear}` : ""}{" "}
                              {selectedNominee.pgBatchYear ? `• PG: ${selectedNominee.pgBatchYear}` : ""} •{" "}
                              {selectedNominee.city}, {selectedNominee.state}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {selectedNominee.designation} • {selectedNominee.workplace}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedNominee(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-red-700 hover:bg-white rounded-lg border border-slate-300 font-semibold shrink-0"
                        >
                          बदलें (Change)
                        </button>
                      </div>
                    ) : (
                      // Search Input & Results
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="डॉक्टर का नाम, बैच वर्ष, या शहर टाइप करके खोजें..."
                            value={searchAlumniQuery}
                            onChange={(e) => setSearchAlumniQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                          />
                        </div>

                        {/* Search Matches Dropdown */}
                        {searchAlumniQuery.trim().length > 0 && filteredAlumni.length > 0 && (
                          <div className="max-h-52 overflow-y-auto bg-white border-2 border-[#C5A059]/40 rounded-2xl shadow-lg divide-y divide-slate-100">
                            {filteredAlumni.slice(0, 8).map((alumnus) => (
                              <button
                                key={alumnus.id}
                                type="button"
                                onClick={() => {
                                  setSelectedNominee(alumnus);
                                  setSearchAlumniQuery("");
                                }}
                                className="w-full text-left p-3 hover:bg-amber-50/60 transition-colors flex items-center justify-between gap-3 group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={alumnus.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                    alt={alumnus.fullName}
                                    className="w-10 h-10 rounded-xl object-cover border flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs sm:text-sm text-[#0F172A] truncate group-hover:text-[#2D5A43]">
                                      Dr. {alumnus.fullName}{" "}
                                      {alumnus.fullNameHindi && (
                                        <span className="text-[11px] text-[#C5A059] font-normal">
                                          ({alumnus.fullNameHindi})
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {alumnus.ugBatchYear ? `UG: ${alumnus.ugBatchYear}` : ""}{" "}
                                      {alumnus.pgBatchYear ? `PG: ${alumnus.pgBatchYear}` : ""} • {alumnus.city} • {alumnus.designation}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[11px] font-bold text-[#C5A059] group-hover:underline shrink-0">
                                  चुनें +
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* NOT FOUND WARNING CARD */}
                        {searchAlumniQuery.trim().length > 0 && filteredAlumni.length === 0 && (
                          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-2.5 animate-in fade-in">
                            <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>पूर्व छात्र पोर्टल पर पंजीकृत नहीं हैं (Alumnus Not Registered)!</span>
                            </div>
                            <p className="leading-relaxed">
                              आप जिस पूर्व छात्र <strong>"{searchAlumniQuery}"</strong> का नाम सुझाना चाहते हैं, वे अभी तक इस पोर्टल पर पंजीकृत नहीं हैं। 
                              हॉल ऑफ फेम नामांकन हेतु पूर्व छात्र का पोर्टल पर पंजीकृत होना अनिवार्य है।
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/register`);
                                  setCopiedLink(true);
                                  setTimeout(() => setCopiedLink(false), 2000);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white font-bold text-[11px] hover:bg-[#2D5A43] transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>{copiedLink ? "पंजीकरण लिंक कॉपी हो गया ✓" : "पंजीकरण लिंक कॉपी करें"}</span>
                              </button>
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(`सादर प्रणाम! कृपया ऋषिकुल राजकीय आयुर्वेद कॉलेज एलुमनाई एसोसिएशन पोर्टल पर अपना पंजीकरण करें ताकि आपको लाइफटाइम अचीवर / हॉल ऑफ फेम हेतु नामांकित किया जा सके: ${typeof window !== 'undefined' ? window.location.origin : ''}/register`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>व्हाट्सएप पर पंजीकरण लिंक भेजें</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* STEP 2: ACHIEVEMENT DETAILS */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        उपलब्धि / अलंकरण का शीर्षक (Achievement Title) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. पद्मश्री अलंकृत / राष्ट्रीय आयुर्वेद गौरव / प्रख्यात शोधकर्ता व लेखक"
                        value={nomForm.achievementTitle}
                        onChange={(e) => setNomForm({ ...nomForm, achievementTitle: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[11px] text-slate-400 self-center mr-1">सुझाव:</span>
                        {SUGGESTED_TITLES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNomForm({ ...nomForm, achievementTitle: t })}
                            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-[#C5A059]/20 hover:text-[#0F172A] text-slate-600 transition-colors"
                          >
                            + {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        नामांकन प्रशस्ति व प्रमुख उपलब्धियां (Citation & Notable Contributions) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="संस्थान एवं समाज के प्रति इनका क्या विशिष्ट योगदान रहा है? क्यों इन्हें हॉल ऑफ फेम में सम्मिलित किया जाना चाहिए..."
                        value={nomForm.citation}
                        onChange={(e) => setNomForm({ ...nomForm, citation: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        प्रमुख पुरस्कार व अलंकरण (Major Awards & Year - अल्पविराम से अलग करें)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. पद्मश्री (2019), धन्वंतरि पुरस्कार (2021), सीसीआरएएस विशिष्ट शोध सम्मान"
                        value={nomForm.awards}
                        onChange={(e) => setNomForm({ ...nomForm, awards: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                      />
                    </div>
                  </div>

                  {/* STEP 3: NOMINATOR DETAILS */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-bold uppercase text-slate-700 block">
                      प्रस्तावक का विवरण (Nominator Details)
                    </span>

                    {currentUser ? (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          प्रस्तावक: <strong>Dr. {currentUser.fullName}</strong> (बैच: {currentUser.ugBatchYear || currentUser.pgBatchYear || "Alumnus"}) • स्वतः सत्यापित
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="आपका पूरा नाम *"
                            value={nomForm.nominatorName}
                            onChange={(e) => setNomForm({ ...nomForm, nominatorName: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="आपका मोबाइल / व्हाट्सएप नंबर *"
                            value={nomForm.nominatorMobile}
                            onChange={(e) => setNomForm({ ...nomForm, nominatorMobile: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsNominateModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedNominee}
                      className="px-6 py-2.5 rounded-xl bg-[#0F172A] disabled:bg-slate-300 text-[#C5A059] disabled:text-slate-500 hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Submit Nomination to Admin
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
