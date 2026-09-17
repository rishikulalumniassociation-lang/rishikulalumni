"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  Heart,
  Send,
  User,
  GraduationCap,
  BookOpen,
  Filter
} from "lucide-react";
import { getCommunityAchievements, addCommunityAchievement, saveCommunityAchievements, getLoggedInAlumni } from "@/lib/store";
import { CommunityAchievement, AlumniProfile } from "@/types";

const CATEGORIES: CommunityAchievement["category"][] = [
  "Award & Honor",
  "Clinical Breakthrough",
  "Research Publication",
  "Social & Community Service",
  "Book / Literature",
  "Other",
];

export default function CommunityAchievementsPage() {
  const [achievements, setAchievements] = useState<CommunityAchievement[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [successMsg, setSuccessMsg] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState<CommunityAchievement["category"]>("Award & Honor");

  useEffect(() => {
    getCommunityAchievements().then((res) => setAchievements(res));
    setCurrentUser(getLoggedInAlumni());

    const handleUpdate = () => {
      getCommunityAchievements().then((res) => setAchievements(res));
    };
    window.addEventListener("achievements_updated", handleUpdate);
    return () => window.removeEventListener("achievements_updated", handleUpdate);
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("उपलब्धि पोस्ट करने के लिए कृपया पहले लॉग-इन करें।");
      return;
    }
    if (!title.trim() || !details.trim()) {
      alert("कृपया शीर्षक (Heading) एवं विवरण (Details) दोनों भरें।");
      return;
    }

    const batchText =
      currentUser.rishikulEducation === "BOTH"
        ? `UG:${currentUser.ugBatchYear || ""}, PG:${currentUser.pgBatchYear || ""}`
        : currentUser.rishikulEducation === "PG"
        ? `PG:${currentUser.pgBatchYear || ""}`
        : `UG:${currentUser.ugBatchYear || ""}`;

    await addCommunityAchievement({
      alumniId: currentUser.id,
      alumniName: currentUser.fullName,
      alumniBatch: batchText,
      alumniAvatar: currentUser.avatarUrl,
      alumniCity: `${currentUser.city}, ${currentUser.state}`,
      title: title.trim(),
      details: details.trim(),
      category,
    });

    setTitle("");
    setDetails("");
    setCategory("Award & Honor");
    setShowForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const handleLike = async (id: string) => {
    const updated = achievements.map((a) => {
      if (a.id === id) {
        return { ...a, likesCount: (a.likesCount || 0) + 1 };
      }
      return a;
    });
    setAchievements(updated);
    await saveCommunityAchievements(updated);
  };

  // Filtering
  const filtered = achievements.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      (item.alumniName || "").toLowerCase().includes(q) ||
      (item.alumniCity || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#C5A059]/30 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>ऋषिकुलियन गौरव एवं उपलब्धियां • Alumni Community Bulletin</span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              Rishikulian Achievements
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
              ऋषिकुल पुरातन छात्र परिवार के सभी पंजीकृत वैद्य/सदस्य यहाँ अपनी व्यक्तिगत, क्लिनिकल, शोध, सम्मान या सेवा उपलब्धियों को शीर्षक व विवरण के साथ साझा कर सकते हैं।
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              {showForm ? "Close Form" : "Post Your Achievement (उपलब्धि साझा करें)"}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>आपकी उपलब्धि सफलतापूर्वक पोस्ट कर दी गई है! पूरा ऋषिकुल परिवार इसे देख सकता है।</span>
          </div>
        )}

        {/* Post Form (Collapsible / Modal Card) */}
        {showForm && (
          <div className="mb-8 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/40 shadow-xl animate-in slide-in-from-top-4">
            {currentUser ? (
              <form onSubmit={handlePost} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                      alt={currentUser.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        Posting as Dr. {currentUser.fullName}
                      </h4>
                      <p className="text-[11px] text-[#2D5A43]">
                        {currentUser.rishikulEducation} • {currentUser.city}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                    Text Post
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Achievement Heading (उपलब्धि का मुख्य शीर्षक) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. आयुष मंत्रालय द्वारा राष्ट्रीय आयुर्वेद रत्न सम्मान / नई क्लिनिक का उद्घाटन / शोध पत्र प्रकाशन"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category (श्रेणी) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Details & Story (विस्तृत विवरण) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="अपनी इस उपलब्धि का संक्षिप्त या विस्तृत विवरण साझा करें। कब, कहाँ और किस संस्था द्वारा यह सम्मान मिला, या क्लिनिकल सफलता की कहानी..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish Achievement
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0F172A]">
                    कृपया पहले लॉग-इन करें
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    अपनी उपलब्धि साझा करने के लिए आपका ऋषिकुल पुरातन छात्र पोर्टल पर पंजीकृत एवं लॉग-इन होना अनिवार्य है।
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors"
                  >
                    Alumni Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                  >
                    Register New
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements or doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2D5A43]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === "All"
                  ? "bg-[#0F172A] text-[#C5A059] font-bold"
                  : "bg-[#FAF7F2] text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedCategory === c
                    ? "bg-[#0F172A] text-[#C5A059] font-bold"
                    : "bg-[#FAF7F2] text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Feed */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/30">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                No Achievements Posted Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                क्या आपने हाल ही में कोई शोध पत्र लिखा है, नया चिकित्सालय खोला है या कोई राष्ट्रीय/राज्य सम्मान प्राप्त किया है? पहले व्यक्ति बनें और अपनी उपलब्धि साझा करें!
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post First Achievement
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#C5A059]/20 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.alumniAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                      alt={item.alumniName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                        <span>Dr. {item.alumniName}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-[#2D5A43] font-semibold">{item.alumniBatch}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.alumniCity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {item.datePosted}
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0F172A] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Details */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                  {item.details}
                </p>

                {/* Card Footer: Congratulate / Like */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors border border-slate-200"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>बधाई / Congratulate</span>
                    {(item.likesCount || 0) > 0 && (
                      <span className="ml-1 bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full text-[10px]">
                        {item.likesCount}
                      </span>
                    )}
                  </button>

                  <div className="text-[11px] text-slate-400">
                    Rishikul Alumni Network
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
