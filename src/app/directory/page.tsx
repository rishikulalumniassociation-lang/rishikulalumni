"use client";

import React, { useState, useEffect, useMemo } from "react";
import AlumniCard from "@/components/Directory/AlumniCard";
import FilterDrawer from "@/components/Directory/FilterDrawer";
import StaggerReveal from "@/components/Motion/StaggerReveal";
import { SPECIALIZATION_OPTIONS, BATCH_YEARS, JOB_TYPE_OPTIONS } from "@/lib/mockData";
import {
  getAlumniList,
  getLoggedInAlumni,
  isAdminAuthenticated,
  toggleAlumniConnection,
  sendConnectionRequest,
  cancelConnectionRequest,
  acceptConnectionRequest,
  getConnectionStateSync,
  isBatchmate,
  getEffectiveConnectedAlumni
} from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlumniProfile, DirectoryFilterState } from "@/types";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  Users,
  MapPin,
  X,
  UserCheck,
  Building,
  Phone,
  Mail,
  Share2,
  ExternalLink,
  Users2,
  Cake,
  Briefcase,
  Heart,
  Sparkles,
  Lock,
  ChevronRight,
  Stethoscope,
  Medal,
  Trophy,
  Crown,
  MessageCircle
} from "lucide-react";

export default function DirectoryPage() {
  const router = useRouter();
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [modalTab, setModalTab] = useState<"info" | "achievements" | "connections" | "teachers" | "family" | "specialty" | "work">("info");

  useEffect(() => {
    const checkAuthAndLoad = () => {
      const user = getLoggedInAlumni();
      const admin = isAdminAuthenticated();
      const isPending = Boolean(user && user.approvalStatus === "pending");
      const authorized = Boolean(admin || (user && !isPending));

      setCurrentUser(user);
      setIsAuthorized(authorized);
      setIsPendingApproval(isPending);
      setIsAuthChecked(true);

      // Exclusively fetch alumni list when authorized — never for public visitors
      if (authorized) {
        getAlumniList().then((list) => setAlumniList(list));
      } else {
        setAlumniList([]);
      }
    };

    checkAuthAndLoad();

    const handleUpdate = () => {
      checkAuthAndLoad();
    };

    const handleReqUpdate = () => {
      checkAuthAndLoad();
    };

    window.addEventListener("alumni_updated", handleUpdate);
    window.addEventListener("user_auth_changed", handleUpdate);
    window.addEventListener("admin_auth_changed", handleUpdate);
    window.addEventListener("connection_requests_updated", handleReqUpdate);
    return () => {
      window.removeEventListener("alumni_updated", handleUpdate);
      window.removeEventListener("user_auth_changed", handleUpdate);
      window.removeEventListener("admin_auth_changed", handleUpdate);
      window.removeEventListener("connection_requests_updated", handleReqUpdate);
    };
  }, []);

  const [filters, setFilters] = useState<DirectoryFilterState>({
    searchQuery: "",
    educationFilter: "ALL",
    ugBatchYear: "",
    pgBatchYear: "",
    specialization: "",
    jobType: "",
    state: "",
    city: "",
    membershipTier: "",
  });

  const handleFilterChange = (key: keyof DirectoryFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: "",
      educationFilter: "ALL",
      ugBatchYear: "",
      pgBatchYear: "",
      specialization: "",
      jobType: "",
      state: "",
      city: "",
      membershipTier: "",
    });
  };

  // Only display verified alumni approved by Admin
  const verifiedAlumni = useMemo(() => {
    return alumniList.filter((a) => a.approvalStatus !== "rejected" && a.approvalStatus !== "pending");
  }, [alumniList]);

  // Comprehensive Filter logic
  const filteredAlumni = useMemo(() => {
    return verifiedAlumni.filter((alumni) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          alumni.fullName.toLowerCase().includes(q) ||
          (alumni.fullNameHindi && alumni.fullNameHindi.includes(q)) ||
          alumni.designation.toLowerCase().includes(q) ||
          alumni.workplace.toLowerCase().includes(q) ||
          alumni.city.toLowerCase().includes(q) ||
          (alumni.specialization && alumni.specialization.toLowerCase().includes(q)) ||
          (alumni.diseaseSpecialty && alumni.diseaseSpecialty.toLowerCase().includes(q)) ||
          (alumni.ugBatchYear && alumni.ugBatchYear.toString().includes(q)) ||
          (alumni.pgBatchYear && alumni.pgBatchYear.toString().includes(q));

        if (!matchesSearch) return false;
      }

      // 2. Education Filter (ALL / UG / PG / BOTH)
      if (filters.educationFilter !== "ALL") {
        if (filters.educationFilter === "BOTH" && alumni.rishikulEducation !== "BOTH") return false;
        if (filters.educationFilter === "UG" && alumni.rishikulEducation !== "UG" && alumni.rishikulEducation !== "BOTH") return false;
        if (filters.educationFilter === "PG" && alumni.rishikulEducation !== "PG" && alumni.rishikulEducation !== "BOTH") return false;
      }

      // 3. UG Batch Year Match
      if (filters.ugBatchYear && alumni.ugBatchYear) {
        if (filters.ugBatchYear.includes("-")) {
          const [start, end] = filters.ugBatchYear.split("-").map(Number);
          if (alumni.ugBatchYear < start || alumni.ugBatchYear > end) return false;
        } else if (filters.ugBatchYear.startsWith("Before")) {
          const year = parseInt(filters.ugBatchYear.replace(/\D/g, ""), 10);
          if (alumni.ugBatchYear >= year) return false;
        } else {
          if (alumni.ugBatchYear !== Number(filters.ugBatchYear)) return false;
        }
      } else if (filters.ugBatchYear && !alumni.ugBatchYear) {
        return false;
      }

      // 4. PG Batch Year Match
      if (filters.pgBatchYear && alumni.pgBatchYear) {
        if (filters.pgBatchYear.includes("-")) {
          const [start, end] = filters.pgBatchYear.split("-").map(Number);
          if (alumni.pgBatchYear < start || alumni.pgBatchYear > end) return false;
        } else if (filters.pgBatchYear.startsWith("Before")) {
          const year = parseInt(filters.pgBatchYear.replace(/\D/g, ""), 10);
          if (alumni.pgBatchYear >= year) return false;
        } else {
          if (alumni.pgBatchYear !== Number(filters.pgBatchYear)) return false;
        }
      } else if (filters.pgBatchYear && !alumni.pgBatchYear) {
        return false;
      }

      // 5. Job Type Match
      if (filters.jobType && alumni.jobType !== filters.jobType) {
        return false;
      }

      // 6. Specialization Match
      if (filters.specialization && alumni.specialization !== filters.specialization) {
        return false;
      }

      // 7. State Match
      if (filters.state && !alumni.state.toLowerCase().includes(filters.state.toLowerCase())) {
        return false;
      }

      // 8. City Match
      if (filters.city && !alumni.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // 9. Membership Tier Match
      if (filters.membershipTier && alumni.membershipTier !== filters.membershipTier) {
        return false;
      }

      return true;
    });
  }, [verifiedAlumni, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.educationFilter !== "ALL") count++;
    if (filters.ugBatchYear) count++;
    if (filters.pgBatchYear) count++;
    if (filters.jobType) count++;
    if (filters.specialization) count++;
    if (filters.state) count++;
    if (filters.city) count++;
    if (filters.membershipTier) count++;
    return count;
  }, [filters]);

  // 1. Loading state while checking local session auth
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">सुरक्षा जांच की जा रही है...</span>
        </div>
      </div>
    );
  }

  // 2. Member Authorization Gate: Protect alumni directory and cards from public viewing
  if (!isAuthorized) {
    if (isPendingApproval && currentUser) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                पंजीकरण सत्यापन प्रक्रियाधीन • Verification Pending
              </span>

              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
                खाता अनुमोदन की प्रतीक्षा है
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                नमस्ते <strong className="text-[#0F172A]">{currentUser.fullName}</strong> जी! आपका ऋषिकुल पूर्व छात्र पंजीकरण प्राप्त हो चुका है। पूर्व छात्रों की निजता एवं संपर्क सूत्रों की सुरक्षा हेतु डायरेक्टरी का एक्सेस व्यवस्थापक (Admin) द्वारा अनुमोदन के उपरांत ही सक्रिय होता है।
              </p>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-left text-xs text-slate-600 mb-6 space-y-1.5">
                <p><strong>यूज़रनेम:</strong> {currentUser.username}</p>
                <p><strong>मोबाइल:</strong> {currentUser.mobile}</p>
                <p><strong>बैच:</strong> {currentUser.ugBatchYear ? `UG ${currentUser.ugBatchYear}` : ""} {currentUser.pgBatchYear ? `PG ${currentUser.pgBatchYear}` : ""}</p>
                <p className="text-amber-800 font-medium pt-1">अनुमोदन सामान्यतः 24-48 घंटों के भीतर पूर्ण हो जाता है।</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#2D5A43] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  मेरी प्रोफ़ाइल देखें
                </Link>
                <Link
                  href="/about-association"
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  संस्था से संपर्क करें
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Public / Unauthenticated Guest screen
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#C5A059]/40 shadow-xl relative overflow-hidden text-center">
            {/* Heritage Lock Badge */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#2D5A43] text-[#C5A059] flex items-center justify-center mx-auto mb-6 border-2 border-[#C5A059] shadow-lg">
              <Lock className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider mb-4">
              <span>🔒 केवल सत्यापित सदस्यों के लिए • Members Only Access</span>
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
              ऋषिकुल एल्युमनाई डायरेक्टरी
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
              गोपनीयता, डेटा सुरक्षा एवं हमारे सम्मानित वैद्यों व डॉक्टरों के व्यक्तिगत संपर्क सूत्रों की रक्षा हेतु पूर्व छात्र डायरेक्टरी, उनके कार्ड एवं विवरण केवल <strong>सत्यापित लॉग-इन सदस्यों</strong> के लिए ही उपलब्ध हैं।
            </p>

            {/* Privacy & Member Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#2D5A43] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">1950 से अब तक के बैच</span>
                  <span className="text-slate-500 text-[11px]">समस्त UG एवं PG पूर्व छात्र समूह</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">विशेषज्ञता अनुसार खोज</span>
                  <span className="text-slate-500 text-[11px]">चिकित्सा पद्धति एवं शहर फ़िल्टर</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">बैचमेट्स व गुरुजन नेटवर्क</span>
                  <span className="text-slate-500 text-[11px]">सहपाठियों एवं शिक्षकों से जुड़ाव</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">सत्यापित पूर्व छात्र कार्ड</span>
                  <span className="text-slate-500 text-[11px]">डिजिटल पहचान व सुरक्षित संवाद</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/login?redirect=/directory"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0F172A] hover:bg-[#2D5A43] text-[#C5A059] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>सदस्य लॉगिन करें (Member Login)</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C5A059] hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>नया पंजीकरण करें (Register)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-400">
              एसोसिएशन व्यवस्थापक हैं?{" "}
              <Link href="/admin/login" className="text-[#2D5A43] font-semibold hover:underline">
                एडमिन लॉगिन यहाँ करें
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>ऋषिकुल पूर्व स्नातक / स्नातकोत्तर डायरेक्टरी</span>
            <span>•</span>
            <span>UG & PG Alumni Network</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Alumni Directory & Network
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-2xl leading-relaxed">
            Search verified graduates of Rishikul across <strong>UG Batches</strong>, <strong>PG Batches</strong>, job sectors (Private Practice, Govt Job, Retired), and clinical specialties.
          </p>
        </div>

        {/* Mobile Search & Filter Toolbar */}
        <div className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name, UG batch, PG batch, hospital, city..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="w-full bg-white border border-[#C5A059]/40 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-[#2D5A43] outline-none shadow-sm transition-all"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => handleFilterChange("searchQuery", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#C5A059]/40 text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-[#F3ECE2] transition-colors shadow-sm flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2D5A43]" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#2D5A43] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Degree Filter Pills (UG / PG / Both) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            {[
              { id: "ALL", label: "All Alumni" },
              { id: "UG", label: "UG (BAMS) Batches" },
              { id: "PG", label: "PG (MD/MS) Batches" },
              { id: "BOTH", label: "Both UG + PG" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleFilterChange("educationFilter", item.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  filters.educationFilter === item.id
                    ? "bg-[#0F172A] text-[#C5A059]"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-[#F3ECE2]"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="text-slate-300">|</span>

            {["Private Practice", "Govt Job", "Retired"].map((job) => (
              <button
                key={job}
                onClick={() => handleFilterChange("jobType", filters.jobType === job ? "" : job)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  filters.jobType === job
                    ? "bg-[#2D5A43] text-white font-medium"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-[#F3ECE2]"
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-white/80 backdrop-blur-sm p-2.5 rounded-2xl border border-[#C5A059]/25 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Active Filters:
            </span>
            {filters.ugBatchYear && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300 shadow-xs">
                🎓 UG Batch: {filters.ugBatchYear}
                <button
                  type="button"
                  onClick={() => handleFilterChange("ugBatchYear", "")}
                  className="hover:text-rose-600 rounded-full p-0.5"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.pgBatchYear && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] text-xs font-bold border border-[#2D5A43]/30 shadow-xs">
                🎓 PG Batch: {filters.pgBatchYear}
                <button
                  type="button"
                  onClick={() => handleFilterChange("pgBatchYear", "")}
                  className="hover:text-rose-600 rounded-full p-0.5"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.jobType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-300">
                💼 {filters.jobType}
                <button
                  type="button"
                  onClick={() => handleFilterChange("jobType", "")}
                  className="hover:text-rose-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.specialization && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-300">
                🩺 {filters.specialization}
                <button
                  type="button"
                  onClick={() => handleFilterChange("specialization", "")}
                  className="hover:text-rose-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-300">
                📍 {filters.city}
                <button
                  type="button"
                  onClick={() => handleFilterChange("city", "")}
                  className="hover:text-rose-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 font-semibold hover:underline ml-auto pr-1"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#64748B] mb-6">
          <span>
            Showing <strong className="text-[#0F172A]">{filteredAlumni.length}</strong> verified doctors
          </span>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[#2D5A43] hover:underline font-semibold"
            >
              Clear all filters ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Directory Grid */}
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                allAlumni={alumniList}
                currentAlumniId={currentUser?.id}
                onSelect={(selected) => setSelectedProfile(selected)}
                onConnectionToggle={() => {
                  getAlumniList().then((list) => setAlumniList(list));
                  setCurrentUser(getLoggedInAlumni());
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-[#C5A059]/30 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              No Alumni Found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find any verified doctor matching your criteria. Try resetting UG/PG batch or job type filters.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalResults={filteredAlumni.length}
      />

      {/* Profile Detail Modal */}
      {selectedProfile && (() => {
        const connectedList = getEffectiveConnectedAlumni(selectedProfile, alumniList);

        const teacherList = (selectedProfile.teacherAlumniIds || [])
          .map((id) => alumniList.find((a) => a.id === id))
          .filter(Boolean) as AlumniProfile[];

        const familyList = (selectedProfile.familyAlumniRelations || [])
          .map((rel) => {
            const person = alumniList.find((a) => a.id === rel.relatedAlumniId);
            return person ? { ...rel, person } : null;
          })
          .filter(Boolean) as { relatedAlumniId: string; relationType: string; person: AlumniProfile }[];

        const getFamilyRelationLabel = (rel: string) => {
          switch (rel) {
            case "Spouse": return "Spouse (पति / पत्नी)";
            case "Brother": return "Brother (भाई)";
            case "Sister": return "Sister (बहन)";
            case "Father": return "Father (पिताजी)";
            case "Mother": return "Mother (माताजी)";
            case "Son": return "Son (पुत्र)";
            case "Daughter": return "Daughter (पुत्री)";
            default: return "Family Relative (रिश्तेदार)";
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Profile Card Top Section */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 pr-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C5A059] bg-slate-100 flex-shrink-0 shadow-md">
                  <img
                    src={selectedProfile.avatarUrl}
                    alt={selectedProfile.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  {selectedProfile.membershipTier === "Life Member" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-500 text-slate-950 px-3 py-1 rounded-full border border-amber-300 shadow-xs mb-1.5">
                      <Crown className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                      Paid Life Member • आजीवन सदस्य
                    </span>
                  ) : selectedProfile.membershipTier === "Patron Member" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider bg-slate-900 text-amber-300 px-3 py-1 rounded-full border border-[#C5A059] shadow-xs mb-1.5">
                      <Crown className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                      Patron Member • संरक्षक सदस्य
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mb-1">
                      {selectedProfile.membershipTier} • Verified
                    </span>
                  )}
                  <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] leading-tight">
                    {selectedProfile.fullName}
                  </h3>
                  {selectedProfile.fullNameHindi && (
                    <p className="text-xs sm:text-sm text-[#C5A059] font-semibold mt-0.5">
                      {selectedProfile.fullNameHindi}
                    </p>
                  )}
                  
                  {/* UG / PG badges in modal */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedProfile.ugBatchYear && (() => {
                      const ugEnd = selectedProfile.ugPassoutYear || (selectedProfile.ugBatchYear ? selectedProfile.ugBatchYear + 5 : null);
                      return (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-300">
                          UG: {selectedProfile.ugBatchYear}{ugEnd ? `-${ugEnd}` : ""} ({selectedProfile.ugDegree || "BAMS"})
                        </span>
                      );
                    })()}
                    {selectedProfile.pgBatchYear && (() => {
                      const pgEnd = selectedProfile.pgPassoutYear || (selectedProfile.pgBatchYear ? selectedProfile.pgBatchYear + 3 : null);
                      return (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#2D5A43] text-[11px] font-bold border border-emerald-200">
                          PG: {selectedProfile.pgBatchYear}{pgEnd ? `-${pgEnd}` : ""} ({selectedProfile.pgDegree || "MD"})
                        </span>
                      );
                    })()}
                    {selectedProfile.rishikulEducation !== "UG" && selectedProfile.specialization && selectedProfile.specialization !== "General Ayurvedic Practice" && (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                        PG Specialization: {selectedProfile.specialization}
                      </span>
                    )}
                    {selectedProfile.specialAchievements && selectedProfile.specialAchievements.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 flex items-center gap-1 shadow-xs">
                        <Medal className="w-3.5 h-3.5 text-amber-600" />
                        {selectedProfile.specialAchievements.length} Special Honor{selectedProfile.specialAchievements.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs in Modal */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-5 overflow-x-auto scrollbar-none text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setModalTab("info")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    modalTab === "info" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Overview
                </button>
                {selectedProfile.specialAchievements && selectedProfile.specialAchievements.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setModalTab("achievements")}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      modalTab === "achievements" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-amber-800 bg-amber-50/70 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <Medal className="w-3.5 h-3.5 text-amber-600" />
                    <span>Honors & Medals ({selectedProfile.specialAchievements.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalTab("connections")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    modalTab === "connections" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span>Connections ({connectedList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("teachers")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    modalTab === "teachers" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Teachers ({teacherList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("family")}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    modalTab === "family" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Family ({familyList.length})</span>
                </button>
                {(selectedProfile.diseaseSpecialty || selectedProfile.acceptingShishya) && (
                  <button
                    type="button"
                    onClick={() => setModalTab("specialty")}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      modalTab === "specialty" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Specialty & Shishya</span>
                  </button>
                )}
                {selectedProfile.workHistory && selectedProfile.workHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setModalTab("work")}
                    className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      modalTab === "work" ? "bg-[#0F172A] text-[#C5A059] shadow-xs font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Timeline ({selectedProfile.workHistory.length})</span>
                  </button>
                )}
              </div>

              {/* TAB 1: OVERVIEW */}
              {modalTab === "info" && (
                <div className="space-y-3.5 text-xs text-slate-600 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200">
                    <div>
                      <strong className="text-slate-800 block text-[11px] uppercase font-bold">Job Type</strong>
                      <span>{selectedProfile.jobType}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] uppercase font-bold">Designation & Workplace</strong>
                      <span>{selectedProfile.designation} at {selectedProfile.workplace}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11px] uppercase font-bold">Location</strong>
                      <span>{selectedProfile.city}, {selectedProfile.state}</span>
                    </div>
                    {selectedProfile.bloodGroup && (
                      <div>
                        <strong className="text-slate-800 block text-[11px] uppercase font-bold">Blood Group</strong>
                        <span className="font-bold text-rose-700">{selectedProfile.bloodGroup}</span>
                      </div>
                    )}
                    {selectedProfile.dateOfBirth && (() => {
                      let dobFormatted = "";
                      const parts = selectedProfile.dateOfBirth.split("-");
                      if (parts.length >= 3) {
                        const dateObj = new Date(2000, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        dobFormatted = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
                      }
                      if (!dobFormatted) return null;
                      return (
                        <div>
                          <strong className="text-slate-800 block text-[11px] uppercase font-bold">Birthday</strong>
                          <span className="flex items-center gap-1 text-amber-800 font-medium">
                            <Cake className="w-3.5 h-3.5 text-[#C5A059]" />
                            {dobFormatted}
                          </span>
                        </div>
                      );
                    })()}
                    {selectedProfile.address && (
                      <div>
                        <strong className="text-slate-800 block text-[11px] uppercase font-bold">Address</strong>
                        <span>{selectedProfile.address}</span>
                      </div>
                    )}
                  </div>

                  {selectedProfile.bio && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200">
                      <strong className="text-slate-800 block text-xs font-bold mb-1">Biography / परिचय:</strong>
                      <p className="italic leading-relaxed text-slate-600 font-light">{selectedProfile.bio}</p>
                    </div>
                  )}

                  {selectedProfile.specialAchievements && selectedProfile.specialAchievements.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border border-amber-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] uppercase font-bold text-amber-900 flex items-center gap-1.5">
                          <Medal className="w-4 h-4 text-amber-600" />
                          Academic Medals & Special Honors (विशिष्ट उपलब्धियां व पदक)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                          {selectedProfile.specialAchievements.length} Honors
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                        {selectedProfile.specialAchievements.map((item) => (
                          <div key={item.id} className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-start gap-2">
                            <Medal className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                              {item.subjectOrField && (
                                <div className="text-[11px] text-[#2D5A43] font-semibold">Subject: {item.subjectOrField}</div>
                              )}
                              {item.year && <span className="text-[10px] text-slate-500">Year: {item.year}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Network Summary Chips */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setModalTab("connections")}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition-colors"
                    >
                      <span className="font-bold text-sm text-[#0F172A] block">{connectedList.length}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Connections</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("teachers")}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition-colors"
                    >
                      <span className="font-bold text-sm text-[#0F172A] block">{teacherList.length}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Teachers</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("family")}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition-colors"
                    >
                      <span className="font-bold text-sm text-rose-700 block">{familyList.length}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Family</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: ACHIEVEMENTS & MEDALS */}
              {modalTab === "achievements" && (
                <div className="mb-6 space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedProfile.specialAchievements && selectedProfile.specialAchievements.length > 0 ? (
                    selectedProfile.specialAchievements.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-100/30 border-2 border-amber-300 shadow-xs flex items-start gap-3.5"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                          <Medal className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                              {item.type}
                            </span>
                            {item.year && (
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                {item.year}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif-heading text-base font-bold text-[#0F172A]">
                            {item.title}
                          </h4>
                          {item.subjectOrField && (
                            <p className="text-xs font-semibold text-[#2D5A43] mt-0.5">
                              Subject / Field: {item.subjectOrField}
                            </p>
                          )}
                          {item.awardedBy && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              Awarded by: {item.awardedBy}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-xs text-slate-600 mt-1.5 italic font-light">
                              "{item.description}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      कोई विशेष उपलब्धि उपलब्ध नहीं है।
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONNECTIONS */}
              {modalTab === "connections" && (
                <div className="mb-6">
                  {!currentUser ? (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-[#C5A059]/40 text-center">
                      <Lock className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-[#0F172A] mb-1">लॉगिन आवश्यक है (Login Required)</h4>
                      <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto">
                        पूर्व स्नातक / स्नातकोत्तरों के आपसी कनेक्शन्स व बैचमेट नेटवर्क देखने के लिए कृपया अपने एल्युमनाई खाते से लॉगिन करें।
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push("/login?redirect=/directory")}
                        className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] shadow-md transition-colors"
                      >
                        Login to View Connections
                      </button>
                    </div>
                  ) : (
                    <div>
                      {connectedList.length > 0 ? (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {connectedList.map((conn) => (
                            <div
                              key={conn.id}
                              onClick={() => {
                                setSelectedProfile(conn);
                                setModalTab("info");
                              }}
                              className="p-3 rounded-2xl bg-[#FAF7F2] border border-slate-200 hover:border-[#C5A059] cursor-pointer flex items-center justify-between gap-3 group transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={conn.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                  alt={conn.fullName}
                                  className="w-11 h-11 rounded-xl object-cover border border-slate-300 group-hover:border-[#C5A059] flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <h5 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2D5A43] truncate">
                                    {conn.fullName} {conn.fullNameHindi && <span className="text-xs text-[#C5A059]">({conn.fullNameHindi})</span>}
                                  </h5>
                                  <p className="text-xs text-slate-500 truncate">
                                    {conn.ugBatchYear ? `UG: ${conn.ugBatchYear}` : ""}{conn.pgBatchYear ? ` • PG: ${conn.pgBatchYear}` : ""} • {conn.city}
                                  </p>
                                  {conn.designation && (
                                    <p className="text-[11px] text-slate-600 truncate">{conn.designation}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-center text-xs text-slate-500">
                          <Users2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <span>इस पूर्व स्नातक / स्नातकोत्तर के अभी कोई सार्वजनिक कनेक्शन्स नहीं हैं।</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TEACHERS */}
              {modalTab === "teachers" && (
                <div className="mb-6">
                  {!currentUser ? (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-[#C5A059]/40 text-center">
                      <Lock className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-[#0F172A] mb-1">लॉगिन आवश्यक है (Login Required)</h4>
                      <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto">
                        ऋषिकुल के पूज्य गुरुजन एवं प्रोफेसरों की सूची देखने के लिए कृपया लॉगिन करें।
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push("/login?redirect=/directory")}
                        className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] shadow-md transition-colors"
                      >
                        Login to View Teachers
                      </button>
                    </div>
                  ) : (
                    <div>
                      {teacherList.length > 0 ? (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {teacherList.map((teacher) => (
                            <div
                              key={teacher.id}
                              onClick={() => {
                                setSelectedProfile(teacher);
                                setModalTab("info");
                              }}
                              className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 hover:border-[#C5A059] cursor-pointer flex items-center justify-between gap-3 group transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={teacher.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                  alt={teacher.fullName}
                                  className="w-11 h-11 rounded-xl object-cover border border-[#C5A059] flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold uppercase text-[#C5A059] block">
                                    पूज्य गुरुजन • Revered Faculty
                                  </span>
                                  <h5 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2D5A43] truncate">
                                    {teacher.fullName}
                                  </h5>
                                  <p className="text-xs text-slate-600 truncate font-medium">
                                    {teacher.designation} • {teacher.workplace}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-center text-xs text-slate-500">
                          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <span>अभी इस प्रोफाइल पर किसी गुरुजन को अंकित नहीं किया गया है।</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FAMILY */}
              {modalTab === "family" && (
                <div className="mb-6">
                  {!currentUser ? (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-[#C5A059]/40 text-center">
                      <Lock className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-[#0F172A] mb-1">लॉगिन आवश्यक है (Login Required)</h4>
                      <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto">
                        ऋषिकुल परिवार के पूर्व स्नातक / स्नातकोत्तर सदस्यों (पति/पत्नी, भाई, माता-पिता, संतान) के संबंध देखने हेतु कृपया लॉगिन करें।
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push("/login?redirect=/directory")}
                        className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] shadow-md transition-colors"
                      >
                        Login to View Family
                      </button>
                    </div>
                  ) : (
                    <div>
                      {familyList.length > 0 ? (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {familyList.map((rel, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedProfile(rel.person);
                                setModalTab("info");
                              }}
                              className="p-3 rounded-2xl bg-rose-50/40 border border-rose-200 hover:border-rose-400 cursor-pointer flex items-center justify-between gap-3 group transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={rel.person.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                  alt={rel.person.fullName}
                                  className="w-11 h-11 rounded-xl object-cover border border-rose-300 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 inline-block mb-0.5">
                                    {getFamilyRelationLabel(rel.relationType)}
                                  </span>
                                  <h5 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2D5A43] truncate">
                                    {rel.person.fullName}
                                  </h5>
                                  <p className="text-xs text-slate-500 truncate">
                                    {rel.person.ugBatchYear ? `UG:${rel.person.ugBatchYear}` : `PG:${rel.person.pgBatchYear}`} • {rel.person.city}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-slate-200 text-center text-xs text-slate-500">
                          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                          <span>अभी इस प्रोफाइल पर परिवार का कोई पूर्व स्नातक / स्नातकोत्तर सदस्य लिंक नहीं है।</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SPECIALTY & SHISHYA */}
              {modalTab === "specialty" && (
                <div className="space-y-4 text-xs text-slate-600 mb-6">
                  {selectedProfile.diseaseSpecialty && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block mb-1">
                        Ayurveda Clinical Specialty (रोग विशेषता)
                      </span>
                      <h4 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-2">
                        {selectedProfile.diseaseSpecialty}
                      </h4>
                      {selectedProfile.specialtyDescription && (
                        <p className="leading-relaxed text-slate-700 italic font-light">
                          "{selectedProfile.specialtyDescription}"
                        </p>
                      )}
                    </div>
                  )}

                  {selectedProfile.acceptingShishya && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#C5A059] shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-[#C5A059]" />
                        <h4 className="font-bold text-sm text-[#0F172A]">
                          गुरु-शिष्य परंपरा • Accepting Shishya (शिष्य स्वीकार्य)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mb-3">
                        यह वैद्य अपनी क्लिनिकल विशेषता को इच्छुक युवा चिकित्सकों व इंटर्न्स को सिखाने के लिए तैयार हैं।
                      </p>
                      {selectedProfile.shishyaRequirement && (
                        <div className="p-3 bg-white/80 rounded-xl border border-amber-200 mb-3 text-slate-700">
                          <strong className="block text-[11px] font-bold text-amber-950 mb-0.5">
                            शिष्य हेतु नियम व मार्गदर्शन:
                          </strong>
                          <span>{selectedProfile.shishyaRequirement}</span>
                        </div>
                      )}
                      {selectedProfile.whatsappNumber && (!currentUser || selectedProfile.id !== currentUser.id) && (
                        currentUser ? (
                          <a
                            href={`https://wa.me/${selectedProfile.whatsappNumber}?text=${encodeURIComponent(`सादर प्रणाम वैद्य जी, मैंने ऋषिकुल एल्युमनाई पोर्टल पर आपकी विशेषज्ञता देखी और आपके मार्गदर्शन में शिष्य रूप में आयुर्वेद सीखना चाहता हूँ।`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            <span>Connect as Shishya on WhatsApp</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => router.push("/login?redirect=/directory")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs uppercase hover:bg-[#2D5A43] transition-colors shadow-xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Login to Connect on WhatsApp</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CAREER TIMELINE */}
              {modalTab === "work" && selectedProfile.workHistory && (
                <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
                  {selectedProfile.workHistory.map((work) => (
                    <div
                      key={work.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold flex-shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#0F172A]">{work.designation}</h5>
                        <p className="text-xs font-semibold text-[#2D5A43]">{work.institution}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {work.fromYear} – {work.toYear} • {work.location}
                        </p>
                        {work.description && (
                          <p className="text-xs text-slate-600 mt-1 italic font-light">
                            "{work.description}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Bottom Actions */}
              {(() => {
                const isBatchmateWithMe = Boolean(
                  currentUser && selectedProfile && isBatchmate(currentUser, selectedProfile)
                );
                const modalConnStatus = currentUser && selectedProfile
                  ? (isBatchmateWithMe ? "connected" : getConnectionStateSync(currentUser.id, selectedProfile.id, alumniList))
                  : "none";

                const handleModalConnectClick = () => {
                  if (!currentUser) {
                    router.push("/login?redirect=/directory");
                    return;
                  }
                  if (isBatchmateWithMe) {
                    // Always connected batchmates
                    return;
                  }
                  if (modalConnStatus === "connected") {
                    toggleAlumniConnection(currentUser.id, selectedProfile.id).then(() => {
                      getAlumniList().then((list) => setAlumniList(list));
                      setCurrentUser(getLoggedInAlumni());
                    });
                    return;
                  }
                  if (modalConnStatus === "pending_sent") {
                    cancelConnectionRequest(currentUser.id, selectedProfile.id).then(() => {
                      getAlumniList().then((list) => setAlumniList(list));
                    });
                    return;
                  }
                  if (modalConnStatus === "pending_received") {
                    acceptConnectionRequest(selectedProfile.id, currentUser.id).then(() => {
                      getAlumniList().then((list) => setAlumniList(list));
                      setCurrentUser(getLoggedInAlumni());
                    });
                    return;
                  }
                  // None -> send request
                  sendConnectionRequest(currentUser.id, selectedProfile.id).then(() => {
                    getAlumniList().then((list) => setAlumniList(list));
                  });
                };

                return (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {currentUser && selectedProfile.id !== currentUser.id && (
                        <button
                          type="button"
                          onClick={handleModalConnectClick}
                          className={`w-full sm:flex-1 py-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                            isBatchmateWithMe
                              ? "bg-[#2D5A43] text-white border border-emerald-700 shadow-xs"
                              : modalConnStatus === "connected"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                              : modalConnStatus === "pending_sent"
                              ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                              : modalConnStatus === "pending_received"
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                              : "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                          }`}
                          title={
                            isBatchmateWithMe
                              ? "आप दोनों सहपाठी (Batchmates) हैं - सीधे जुड़े हुए हैं"
                              : modalConnStatus === "connected"
                              ? "क्लिक करके कनेक्शन हटाएं (Disconnect)"
                              : modalConnStatus === "pending_sent"
                              ? "रिक्वेस्ट भेजी गई है (क्लिक करके कैंसिल करें)"
                              : modalConnStatus === "pending_received"
                              ? "कनेक्शन रिक्वेस्ट स्वीकार करें (Accept Request)"
                              : "कनेक्शन रिक्वेस्ट भेजें"
                          }
                        >
                          <Users2 className="w-4 h-4" />
                          <span>
                            {isBatchmateWithMe
                              ? "Batchmate ✓"
                              : modalConnStatus === "connected"
                              ? "Connected ✓"
                              : modalConnStatus === "pending_sent"
                              ? "Request Sent ⏳"
                              : modalConnStatus === "pending_received"
                              ? "Accept Request ✓"
                              : "Connect"}
                          </span>
                        </button>
                      )}
                      {!currentUser && (
                        <button
                          type="button"
                          onClick={() => router.push("/login?redirect=/directory")}
                          className="w-full sm:flex-1 py-3 text-center rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Users2 className="w-4 h-4 text-[#C5A059]" />
                          <span>Login to Connect</span>
                        </button>
                      )}
                      {/* WhatsApp Connect - visible when mutually connected or batchmates */}
                      {selectedProfile.whatsappNumber && (!currentUser || selectedProfile.id !== currentUser.id) && (modalConnStatus === "connected" || isBatchmateWithMe) && (
                        <a
                          href={`https://wa.me/${selectedProfile.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:flex-1 py-3 text-center rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Connect</span>
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedProfile(null)}
                        className="w-full sm:w-28 py-3 text-center rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    {/* Helper text under Connect button */}
                    {currentUser && selectedProfile.id !== currentUser.id && modalConnStatus !== "connected" && !isBatchmateWithMe && (
                      <p className="w-full text-center text-[11px] text-slate-500 italic mt-2.5">
                        जब रिक्वेस्ट एक्सेप्ट होगी, तब आप WhatsApp पर कनेक्ट कर सकते हैं
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
