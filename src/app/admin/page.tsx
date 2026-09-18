"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Award,
  Heart,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  LogOut,
  Star,
  Check,
  AlertTriangle,
  AlertCircle,
  Key,
  KeyRound,
  Lock,
  GraduationCap,
  Briefcase,
  Flower,
  Trophy,
  Medal,
  RefreshCw,
  Camera,
  Pin,
  Eye,
  EyeOff,
  Flag,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Crown,
  QrCode,
  Settings
} from "lucide-react";
import {
  getAlumniList,
  saveAlumniList,
  updateAlumniProfile,
  markAlumnusAsDeceased,
  getLifetimeAchievers,
  saveLifetimeAchievers,
  getShradhanjaliList,
  saveShradhanjaliList,
  getPasswordResetRequests,
  savePasswordResetRequests,
  isAdminAuthenticated,
  setAdminAuthenticated,
  getAchieverNominations,
  approveAchieverNomination,
  rejectAchieverNomination,
  hashPassword,
  getCommunityPosts,
  deleteCommunityPost,
  pinCommunityPost,
  unpinCommunityPost,
  hideCommunityPost,
  getCommunityPostReports,
  reviewCommunityPostReport,
  getMembershipSettings,
  updateMembershipSettings,
  getMembershipPayments,
  reviewMembershipPayment,
  LifetimeMembershipSettings,
  MembershipPaymentSubmission
} from "@/lib/store";
import { AlumniProfile, LifetimeAchiever, ShradhanjaliRecord, MembershipTier, PasswordResetRequest, AchieverNomination, CommunityPost, CommunityPostReport } from "@/types";
import MediaLightbox from "@/components/Community/MediaLightbox";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"approvals" | "nominations" | "all_registered" | "password_resets" | "patrons" | "achievers" | "shradhanjali" | "showcase" | "membership_settings">("approvals");

  // State
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [achieversList, setAchieversList] = useState<LifetimeAchiever[]>([]);
  const [shradhanjaliList, setShradhanjaliList] = useState<ShradhanjaliRecord[]>([]);
  const [nominationsList, setNominationsList] = useState<AchieverNomination[]>([]);
  const [nominationFilter, setNominationFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [nominationSearch, setNominationSearch] = useState("");

  // Lifetime Membership Settings & Payments state
  const [membershipSettings, setMembershipSettings] = useState<LifetimeMembershipSettings>(getMembershipSettings());
  const [membershipPaymentsList, setMembershipPaymentsList] = useState<MembershipPaymentSubmission[]>([]);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Showcase state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityPostReport[]>([]);
  const [showcaseSubTab, setShowcaseSubTab] = useState<"posts" | "reports">("posts");
  const [showcaseSearch, setShowcaseSearch] = useState("");
  const [showcaseFilter, setShowcaseFilter] = useState<"all" | "pinned" | "hidden" | "visible">("all");
  const [lightboxPost, setLightboxPost] = useState<CommunityPost | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Mark Expired / Deceased Modal State
  const [activeDeceasedAlumnus, setActiveDeceasedAlumnus] = useState<AlumniProfile | null>(null);
  const [demiseDateInput, setDemiseDateInput] = useState<string>("2026-03-01");
  const [demiseTributeInput, setDemiseTributeInput] = useState<string>("");

  // Password reset execution modal
  const [activeResetModalReq, setActiveResetModalReq] = useState<PasswordResetRequest | null>(null);
  const [newPasswordToAssign, setNewPasswordToAssign] = useState("rishikul2026");

  // Reject candidate confirmation modal
  const [rejectCandidate, setRejectCandidate] = useState<AlumniProfile | null>(null);

  // Modals for creating new Achiever & Shradhanjali
  const [showAchieverModal, setShowAchieverModal] = useState(false);
  const [newAchiever, setNewAchiever] = useState<Partial<LifetimeAchiever>>({
    name: "",
    nameHindi: "",
    batchYear: 1980,
    degree: "MD (Ayurveda)",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
    title: "",
    citation: "",
    awards: [],
    currentRole: "",
  });

  const [showShradhanjaliModal, setShowShradhanjaliModal] = useState(false);
  const [newShradhanjali, setNewShradhanjali] = useState<Partial<ShradhanjaliRecord>>({
    name: "",
    nameHindi: "",
    batchYear: 1970,
    degree: "BAMS",
    photoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop",
    dateOfDemise: "2026-01-01",
    tribute: "",
    postedBy: "Association Executive Committee",
  });

  useEffect(() => {
    setMounted(true);
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    loadAllData();

    // Listen for new registrations and profile updates
    const handleAlumniUpdate = () => {
      getAlumniList().then(list => setAlumniList(list));
    };

    const handleNomUpdate = () => {
      Promise.all([getAchieverNominations(), getLifetimeAchievers()]).then(([noms, ach]) => {
        setNominationsList(noms);
        setAchieversList(ach);
      });
    };

    const handleResetUpdate = () => {
      getPasswordResetRequests().then(r => setResetRequests(r));
    };

    const handleMembershipUpdate = () => {
      setMembershipSettings(getMembershipSettings());
      setMembershipPaymentsList(getMembershipPayments());
    };

    window.addEventListener("alumni_updated", handleAlumniUpdate);
    window.addEventListener("nominations_updated", handleNomUpdate);
    window.addEventListener("achievers_updated", handleNomUpdate);
    window.addEventListener("password_reset_updated", handleResetUpdate);
    window.addEventListener("membership_settings_updated", handleMembershipUpdate);
    window.addEventListener("membership_payments_updated", handleMembershipUpdate);

    return () => {
      window.removeEventListener("alumni_updated", handleAlumniUpdate);
      window.removeEventListener("nominations_updated", handleNomUpdate);
      window.removeEventListener("achievers_updated", handleNomUpdate);
      window.removeEventListener("password_reset_updated", handleResetUpdate);
      window.removeEventListener("membership_settings_updated", handleMembershipUpdate);
      window.removeEventListener("membership_payments_updated", handleMembershipUpdate);
    };
  }, [router]);

  const loadAllData = async () => {
    const [alumni, resets, achievers, shradhanjali, nominations, posts, reports] = await Promise.all([
      getAlumniList(),
      getPasswordResetRequests(),
      getLifetimeAchievers(),
      getShradhanjaliList(),
      getAchieverNominations(),
      getCommunityPosts({ includeHidden: true }),
      getCommunityPostReports(),
    ]);
    setAlumniList(alumni);
    setResetRequests(resets);
    setAchieversList(achievers);
    setShradhanjaliList(shradhanjali);
    setNominationsList(nominations);
    setCommunityPosts(posts);
    setCommunityReports(reports);
    setMembershipSettings(getMembershipSettings());
    setMembershipPaymentsList(getMembershipPayments());
  };

  const handleAdminTogglePin = async (post: CommunityPost) => {
    if (post.isPinned) {
      const res = await unpinCommunityPost(post.id);
      if (res.success) {
        setCommunityPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPinned: false, pinOrder: 0 } : p))
        );
      }
    } else {
      const order = prompt("Enter pin priority order (1 is top):", "1");
      const num = parseInt(order || "1", 10);
      const res = await pinCommunityPost(post.id, isNaN(num) ? 1 : num);
      if (res.success) {
        setCommunityPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPinned: true, pinOrder: isNaN(num) ? 1 : num } : p))
        );
      }
    }
  };

  const handleAdminToggleHide = async (post: CommunityPost) => {
    const nextHidden = !post.isHidden;
    const res = await hideCommunityPost(post.id, nextHidden);
    if (res.success) {
      setCommunityPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isHidden: nextHidden } : p))
      );
    }
  };

  const handleAdminDeletePost = async (post: CommunityPost) => {
    if (!confirm(`Are you sure you want to permanently delete "${post.title}"?`)) return;
    const res = await deleteCommunityPost(post.id);
    if (res.success) {
      setCommunityPosts((prev) => prev.filter((p) => p.id !== post.id));
    } else {
      alert(res.error || "Failed to delete post.");
    }
  };

  const handleResolveReport = async (reportId: string, status: "reviewed" | "dismissed", postId?: string) => {
    const res = await reviewCommunityPostReport(reportId, status, postId);
    if (res.success) {
      setCommunityReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      if (postId) {
        setCommunityPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isHidden: true } : p))
        );
      }
    } else {
      alert(res.error || "Failed to process report.");
    }
  };

  const handleApproveNomination = async (nomId: string) => {
    if (!confirm("क्या आप इस पूर्व स्नातक / स्नातकोत्तर का नामांकन स्वीकृत कर हॉल ऑफ फेम (Lifetime Achievers) में सम्मिलित करना चाहते हैं?")) return;
    await approveAchieverNomination(nomId);
    const [noms, ach] = await Promise.all([getAchieverNominations(), getLifetimeAchievers()]);
    setNominationsList(noms);
    setAchieversList(ach);
    alert("नामांकन सफलतापूर्वक स्वीकृत हो गया और पूर्व स्नातक / स्नातकोत्तर को 'हॉल ऑफ फेम' में जोड़ दिया गया है!");
  };

  const handleRejectNomination = async (nomId: string) => {
    if (!confirm("क्या आप इस नामांकन को अस्वीकार करना चाहते हैं?")) return;
    await rejectAchieverNomination(nomId);
    getAchieverNominations().then(noms => setNominationsList(noms));
  };

  if (!mounted) return null;

  // 1. APPROVE ALUMNI WITH SPECIFIC MEMBERSHIP TIER
  const handleApproveAlumni = async (id: string, tier: MembershipTier) => {
    await updateAlumniProfile(id, { isVerified: true, approvalStatus: 'approved', membershipTier: tier });
    getAlumniList().then(list => setAlumniList(list));
  };

  const handleRejectAlumni = async (id: string) => {
    const candidate = alumniList.find((a) => a.id === id);
    await updateAlumniProfile(id, { isVerified: false, approvalStatus: 'rejected' });
    getAlumniList().then(list => setAlumniList(list));
    if (candidate) {
      alert(`Dr. ${candidate.fullName} का रजिस्ट्रेशन अस्वीकार (Reject) कर दिया गया है।`);
    }
  };

  const handleChangeTier = async (id: string, newTier: MembershipTier) => {
    await updateAlumniProfile(id, { membershipTier: newTier });
    getAlumniList().then(list => setAlumniList(list));
  };

  // 2. MARK ALUMNUS AS EXPIRED / DECEASED (Automatically adds to Shradhanjali)
  const handleConfirmMarkExpired = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDeceasedAlumnus) return;

    await markAlumnusAsDeceased(activeDeceasedAlumnus.id, demiseDateInput, demiseTributeInput);
    await loadAllData();
    alert(`Dr. ${activeDeceasedAlumnus.fullName} has been marked as Expired. Their tribute is now live in the Shradhanjali Hall!`);
    setActiveDeceasedAlumnus(null);
  };

  // 3. RESOLVE PASSWORD RESET REQUEST
  const handleExecutePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResetModalReq || !newPasswordToAssign) return;

    const hashedNewPassword = await hashPassword(newPasswordToAssign);
    const updatedAlumni = alumniList.map((a) => {
      if (a.id === activeResetModalReq.alumniId || a.username === activeResetModalReq.username) {
        return {
          ...a,
          passwordHash: hashedNewPassword,
        };
      }
      return a;
    });
    setAlumniList(updatedAlumni);
    await saveAlumniList(updatedAlumni);

    const updatedRequests = resetRequests.map((r) => {
      if (r.id === activeResetModalReq.id) {
        return {
          ...r,
          status: "resolved" as const,
          newPasswordAssigned: newPasswordToAssign,
        };
      }
      return r;
    });
    setResetRequests(updatedRequests);
    await savePasswordResetRequests(updatedRequests);

    alert(`Password for ${activeResetModalReq.fullName} (${activeResetModalReq.username}) has been updated to: ${newPasswordToAssign}`);
    setActiveResetModalReq(null);
  };


  // Achievers & Shradhanjali handlers
  const handleAddAchiever = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchiever.name || !newAchiever.title) return;
    const item: LifetimeAchiever = {
      id: `achiever-${Date.now()}`,
      name: newAchiever.name || "",
      nameHindi: newAchiever.nameHindi,
      batchYear: Number(newAchiever.batchYear) || 1980,
      degree: newAchiever.degree || "BAMS",
      photoUrl: newAchiever.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
      title: newAchiever.title || "",
      citation: newAchiever.citation || "",
      awards: typeof newAchiever.awards === "string" ? (newAchiever.awards as string).split(",").map((s) => s.trim()) : (newAchiever.awards || []),
      currentRole: newAchiever.currentRole || "",
      orderIndex: achieversList.length + 1,
    };
    const updated = [item, ...achieversList];
    setAchieversList(updated);
    await saveLifetimeAchievers(updated);
    setShowAchieverModal(false);
  };

  const handleDeleteAchiever = async (id: string) => {
    if (confirm("Are you sure you want to remove this Lifetime Achiever?")) {
      const updated = achieversList.filter((a) => a.id !== id);
      setAchieversList(updated);
      await saveLifetimeAchievers(updated);
    }
  };

  const handleAddShradhanjali = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShradhanjali.name || !newShradhanjali.tribute) return;
    const record: ShradhanjaliRecord = {
      id: `shradhanjali-${Date.now()}`,
      name: newShradhanjali.name || "",
      nameHindi: newShradhanjali.nameHindi,
      batchYear: Number(newShradhanjali.batchYear) || 1970,
      degree: newShradhanjali.degree || "BAMS",
      photoUrl: newShradhanjali.photoUrl || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop",
      dateOfDemise: newShradhanjali.dateOfDemise || "2026-01-01",
      tribute: newShradhanjali.tribute || "",
      condolencesCount: 0,
      postedBy: newShradhanjali.postedBy || "Association Executive Committee",
    };
    const updated = [record, ...shradhanjaliList];
    setShradhanjaliList(updated);
    await saveShradhanjaliList(updated);
    setShowShradhanjaliModal(false);
  };

  const handleDeleteShradhanjali = async (id: string) => {
    if (confirm("Are you sure you want to remove this tribute?")) {
      const updated = shradhanjaliList.filter((s) => s.id !== id);
      setShradhanjaliList(updated);
      await saveShradhanjaliList(updated);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push("/admin/login");
  };

  const pendingAlumni = alumniList.filter((a) => a.approvalStatus === "pending" && !a.isDeceased);
  const pendingPasswordResets = resetRequests.filter((r) => r.status === "pending");
  const patronMembers = alumniList.filter((a) => a.membershipTier === "Patron Member" && !a.isDeceased);

  const pendingNominations = nominationsList.filter((n) => n.status === "pending");
  const approvedNominations = nominationsList.filter((n) => n.status === "approved");
  const rejectedNominations = nominationsList.filter((n) => n.status === "rejected");
  const pendingReports = communityReports.filter((r) => r.status === "pending");

  const filteredNominations = nominationsList.filter((nom) => {
    if (nominationFilter !== "all" && nom.status !== nominationFilter) return false;
    if (!nominationSearch.trim()) return true;
    const q = nominationSearch.toLowerCase().trim();
    return (
      nom.nomineeName.toLowerCase().includes(q) ||
      (nom.nomineeNameHindi || "").toLowerCase().includes(q) ||
      nom.achievementTitle.toLowerCase().includes(q) ||
      nom.nominatorName.toLowerCase().includes(q) ||
      (nom.nomineeCity || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C5A059]/30 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Administrative Governance Center
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Association Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Approve registrations, review Hall of Fame nominations, assign tiers, mark deceased alumni into Shradhanjali, and resolve password reset requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#C5A059]/40 text-[#2D5A43] text-xs font-bold uppercase tracking-wider hover:bg-[#F3ECE2] transition-colors shadow-sm relative"
              title="Refresh data from localStorage"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
              {pendingAlumni.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingAlumni.length}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout Admin
            </button>
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Approvals
            </span>
            <div className="text-3xl font-serif-heading font-bold text-amber-600 mt-1">
              {pendingAlumni.length}
            </div>
            <span className="text-[11px] text-slate-500">New registration requests</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Achiever Nominations
            </span>
            <div className="text-3xl font-serif-heading font-bold text-[#C5A059] mt-1">
              {pendingNominations.length}
            </div>
            <span className="text-[11px] text-slate-500">Pending review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Registered Alumni
            </span>
            <div className="text-3xl font-serif-heading font-bold text-[#0F172A] mt-1">
              {alumniList.length}
            </div>
            <span className="text-[11px] text-slate-500">In database</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Password Reset Requests
            </span>
            <div className="text-3xl font-serif-heading font-bold text-red-600 mt-1">
              {pendingPasswordResets.length}
            </div>
            <span className="text-[11px] text-slate-500">Pending admin action</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shradhanjali Records
            </span>
            <div className="text-3xl font-serif-heading font-bold text-slate-800 mt-1">
              {shradhanjaliList.length}
            </div>
            <span className="text-[11px] text-slate-500">Departed alumni tributes</span>
          </div>
        </div>

        {/* Tab Navigation - Crystal Clear Presentation with Active Glow & Indicators */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              Admin Management Modules / एडमिन विभाग
            </span>
            <span className="text-[11px] text-slate-400 font-medium sm:hidden flex items-center gap-1">
              Scroll for more <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
              {[
                { id: "approvals", label: "Approvals", count: pendingAlumni.length, countColor: "bg-amber-500 text-white", icon: Users },
                { id: "nominations", label: "Nominations", count: pendingNominations.length, countColor: "bg-[#C5A059] text-white", icon: Trophy },
                { id: "showcase", label: "Gallery & Reports", count: pendingReports.length > 0 ? `${pendingReports.length} Flagged` : communityPosts.length, countColor: pendingReports.length > 0 ? "bg-rose-500 text-white animate-pulse" : "bg-slate-200 text-slate-700", icon: Camera },
                { id: "all_registered", label: "All Alumni", count: alumniList.length, countColor: "bg-slate-200 text-slate-700", icon: Users },
                { id: "password_resets", label: "Resets", count: pendingPasswordResets.length, countColor: pendingPasswordResets.length > 0 ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700", icon: KeyRound },
                { id: "patrons", label: "Patrons", count: patronMembers.length, countColor: "bg-amber-100 text-amber-900 border border-amber-300", icon: Star },
                { id: "achievers", label: "Achievers", count: achieversList.length, countColor: "bg-slate-200 text-slate-700", icon: Award },
                { id: "shradhanjali", label: "Shradhanjali", count: shradhanjaliList.length, countColor: "bg-slate-200 text-slate-700", icon: Heart },
                {
                  id: "membership_settings",
                  label: "Lifetime Membership & UPI",
                  count: membershipPaymentsList.filter((p) => p.status === "pending").length > 0 ? `${membershipPaymentsList.filter((p) => p.status === "pending").length} New` : undefined,
                  countColor: "bg-emerald-600 text-white animate-pulse",
                  icon: Crown,
                },
              ].map(({ id, label, count, countColor, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? "bg-[#0F172A] text-white shadow-md ring-2 ring-[#C5A059] scale-[1.02]"
                        : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#C5A059]" : "text-slate-400"}`} />
                    <span>{label}</span>
                    {count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${countColor}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB 1: PENDING APPROVALS */}
        {activeTab === "approvals" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
              New Member Verification & Tier Assignment
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Review submitted data and assign official membership tier (Non-Paid, Lifetime, or Patron Member).
            </p>

            {pendingAlumni.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                All alumni registration requests have been approved!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAlumni.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-slate-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={alumnus.avatarUrl}
                        alt={alumnus.fullName}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                            {alumnus.fullName}
                          </h3>
                          <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                            @{alumnus.username}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 my-1">
                          {alumnus.ugBatchYear && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-[#C5A059]/60 text-[#0F172A]">
                              UG Batch: {alumnus.ugBatchYear}
                            </span>
                          )}
                          {alumnus.pgBatchYear && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-[#2D5A43]">
                              PG Batch: {alumnus.pgBatchYear} ({alumnus.pgDegree || "MD"})
                            </span>
                          )}
                          {alumnus.rishikulEducation !== "UG" && alumnus.specialization && alumnus.specialization !== "General Ayurvedic Practice" && (
                            <span className="text-[11px] text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100">
                              {alumnus.specialization}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600">
                          <strong>Job:</strong> {alumnus.jobType} • {alumnus.designation} at {alumnus.workplace} ({alumnus.city}, {alumnus.state})
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Mobile: <strong>{alumnus.mobile}</strong> | DOB: <strong>{alumnus.dateOfBirth}</strong> | Email: {alumnus.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApproveAlumni(alumnus.id, "Non-Paid Member")}
                        className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-colors"
                      >
                        Approve (Non-Paid)
                      </button>
                      <button
                        onClick={() => handleApproveAlumni(alumnus.id, "Life Member")}
                        className="px-3.5 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors"
                      >
                        Approve (Life Member)
                      </button>
                      <button
                        onClick={() => handleApproveAlumni(alumnus.id, "Patron Member")}
                        className="px-3.5 py-2 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors font-bold"
                      >
                        Approve (Patron)
                      </button>
                      <button
                        onClick={() => setRejectCandidate(alumnus)}
                        className="p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-xs"
                        title="Reject Registration (अस्वीकार करें)"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ACHIEVER NOMINATIONS */}
        {activeTab === "nominations" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#C5A059]" />
                  <span>Hall of Fame Nominations (नामांकन समीक्षा)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review recommendations submitted by alumni for the Lifetime Achievers Hall of Fame.
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: "pending", label: `Pending (${pendingNominations.length})` },
                  { id: "approved", label: `Approved (${approvedNominations.length})` },
                  { id: "rejected", label: `Rejected (${rejectedNominations.length})` },
                  { id: "all", label: `All (${nominationsList.length})` },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNominationFilter(id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      nominationFilter === id
                        ? "bg-[#0F172A] text-[#C5A059] shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by nominee doctor, nominator, or title..."
                value={nominationSearch}
                onChange={(e) => setNominationSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />
            </div>

            {/* List of Nominations */}
            {filteredNominations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No nominations found matching current filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNominations.map((nom) => (
                  <div
                    key={nom.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-slate-300 space-y-4 shadow-xs"
                  >
                    {/* Header: Nominee & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={nom.nomineePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                          alt={nom.nomineeName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059]/40 shadow-xs flex-shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-serif-heading font-bold text-lg text-[#0F172A]">
                              Dr. {nom.nomineeName}
                            </h4>
                            {nom.nomineeNameHindi && (
                              <span className="text-xs text-slate-500">({nom.nomineeNameHindi})</span>
                            )}
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#2D5A43]/10 text-[#2D5A43]">
                              Batch: {nom.nomineeBatchYear} • {nom.nomineeDegree}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {nom.nomineeWorkplace} • {nom.nomineeCity}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {nom.status === "pending" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            लंबित • Pending Review
                          </span>
                        )}
                        {nom.status === "approved" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved & Inducted
                          </span>
                        )}
                        {nom.status === "rejected" && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Achievement Details */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-[#2D5A43] uppercase tracking-wide">
                        🏆 {nom.achievementTitle}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        "{nom.citation}"
                      </p>
                      {nom.awards && nom.awards.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {nom.awards.map((aw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-semibold"
                            >
                              ★ {aw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Nominator Information & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-200">
                      <div>
                        प्रस्तावक (Nominated by): <strong className="text-slate-800">{nom.nominatorName}</strong>
                        {nom.nominatorMobile && ` • 📞 ${nom.nominatorMobile}`}
                        {nom.nominatorEmail && ` • ✉️ ${nom.nominatorEmail}`}
                        {nom.nominatorBatchText && ` (${nom.nominatorBatchText})`}
                        <span className="ml-2 text-slate-400">दिनांक: {nom.submittedAt}</span>
                      </div>

                      {/* Admin Actions */}
                      {nom.status === "pending" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApproveNomination(nom.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors shadow-xs"
                          >
                            Approve & Induct (हॉल ऑफ फेम में जोड़ें)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectNomination(nom.id)}
                            className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-xs uppercase transition-colors"
                          >
                            Reject (अस्वीकार)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL REGISTERED ALUMNI LIST (With "Mark as Expired" option) */}
        {activeTab === "all_registered" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  Complete Registered Alumni Roster ({alumniList.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage memberships, adjust tiers, or mark alumni as expired upon demise (adds to Shradhanjali).
                </p>
              </div>

              <input
                type="text"
                placeholder="Search alumni by name, username, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-xs bg-[#FAF7F2] border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A43] w-full sm:w-64"
              />
            </div>

            <div className="space-y-3">
              {alumniList
                .filter((a) =>
                  searchQuery ? a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || a.username?.toLowerCase().includes(searchQuery.toLowerCase()) || a.city.toLowerCase().includes(searchQuery.toLowerCase()) : true
                )
                .map((a) => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      a.isDeceased
                        ? "bg-slate-100 border-slate-300 opacity-80"
                        : "bg-[#FAF7F2] border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={a.avatarUrl}
                        alt={a.fullName}
                        className={`w-12 h-12 rounded-xl object-cover border ${a.isDeceased ? "grayscale" : ""}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">{a.fullName}</span>
                          <span className="font-mono text-[10px] text-slate-500">@{a.username}</span>
                          
                          {a.isDeceased ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200">
                              स्वर्गवासी (Expired: {a.dateOfDemise})
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                a.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {a.isVerified ? "Approved" : "Pending"}
                            </span>
                          )}

                          {a.specialAchievements && a.specialAchievements.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <Medal className="w-3 h-3 text-amber-600" />
                              {a.specialAchievements.length} Honor{a.specialAchievements.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {a.ugBatchYear ? `UG: ${a.ugBatchYear} ` : ""}
                          {a.pgBatchYear ? `PG: ${a.pgBatchYear} ` : ""}
                          • {a.jobType} ({a.workplace}, {a.city})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={a.membershipTier}
                        disabled={a.isDeceased}
                        onChange={(e) => handleChangeTier(a.id, e.target.value as MembershipTier)}
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none disabled:opacity-50"
                      >
                        <option value="Non-Paid Member">Non-Paid Member</option>
                        <option value="Life Member">Life Member</option>
                        <option value="Patron Member">Patron Member</option>
                        <option value="Annual Member">Annual Member</option>
                      </select>

                      {/* MARK AS EXPIRED / DECEASED BUTTON */}
                      {!a.isDeceased && (
                        <button
                          onClick={() => {
                            setActiveDeceasedAlumnus(a);
                            setDemiseDateInput(new Date().toISOString().split("T")[0]);
                            setDemiseTributeInput(`श्रद्धेय डॉ. ${a.fullName} के असामयिक निधन पर ऋषिकुल स्नातक एवं स्नातकोत्तर परिवार गहरा शोक व्यक्त करता है।`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-black text-[11px] font-bold uppercase transition-colors"
                          title="Mark alumnus as Expired"
                        >
                          <Flower className="w-3.5 h-3.5 text-[#C5A059]" />
                          Mark Expired
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: PASSWORD RESET REQUESTS */}
        {activeTab === "password_resets" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
              Alumni Password Reset Requests
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              बिना अल्युम्नाई की आधिकारिक रिक्वेस्ट के पासवर्ड नहीं बदला जा सकता। जब कोई छात्र 'Forgot Password' सबमिट करता है, तभी यहाँ रिक्वेस्ट आती है।
            </p>

            {resetRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Key className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                No password reset requests currently in queue.
              </div>
            ) : (
              <div className="space-y-3">
                {resetRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      req.status === "pending"
                        ? "bg-amber-50/70 border-amber-200"
                        : "bg-slate-50 border-slate-200 opacity-75"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A]">{req.fullName}</span>
                        <span className="font-mono text-slate-500">(@{req.username})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === "pending"
                              ? "bg-amber-200 text-amber-900"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {req.status === "pending" ? "Action Required" : "Resolved"}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Mobile: <strong>{req.mobile}</strong> | Requested at: {req.requestedAt}
                      </p>
                      {req.newPasswordAssigned && (
                        <p className="text-emerald-700 font-mono mt-0.5">
                          New password assigned: <strong>{req.newPasswordAssigned}</strong>
                        </p>
                      )}
                    </div>

                    {req.status === "pending" && (
                      <button
                        onClick={() => {
                          setActiveResetModalReq(req);
                          setNewPasswordToAssign("rishikul2026");
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
                        Reset Password
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PATRON ROSTER */}
        {activeTab === "patrons" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
              Patron Members Roster ({patronMembers.length})
            </h2>
            <div className="space-y-4 mt-6">
              {patronMembers.map((patron) => (
                <div
                  key={patron.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-white border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={patron.avatarUrl}
                      alt={patron.fullName}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#C5A059]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-heading text-base font-bold text-[#0F172A]">
                          {patron.fullName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059] text-[#0F172A] uppercase">
                          Patron
                        </span>
                      </div>
                      <p className="text-xs text-[#2D5A43]">
                        {patron.ugBatchYear ? `UG: ${patron.ugBatchYear} ` : ""}{patron.pgBatchYear ? `PG: ${patron.pgBatchYear} ` : ""}• {patron.city}
                      </p>
                    </div>
                  </div>

                  <select
                    value={patron.membershipTier}
                    onChange={(e) => handleChangeTier(patron.id, e.target.value as MembershipTier)}
                    className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
                  >
                    <option value="Patron Member">Patron Member</option>
                    <option value="Life Member">Life Member</option>
                    <option value="Non-Paid Member">Non-Paid Member</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LIFETIME ACHIEVERS */}
        {activeTab === "achievers" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  Lifetime Achievers Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update and honor distinguished alumni with their achievements, photo, and batch.
                </p>
              </div>

              <button
                onClick={() => setShowAchieverModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                Add New Achiever
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achieversList.map((achiever) => (
                <div
                  key={achiever.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={achiever.photoUrl}
                        alt={achiever.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#C5A059] flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                          {achiever.name}
                        </h4>
                        <p className="text-xs font-semibold text-[#2D5A43]">
                          Batch of {achiever.batchYear} • {achiever.degree}
                        </p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {achiever.title}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3 italic">
                      "{achiever.citation}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleDeleteAchiever(achiever.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SHRADHANJALI */}
        {activeTab === "shradhanjali" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  Shradhanjali (शोक श्रद्धांजलि) Memorials ({shradhanjaliList.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memorials of departed vaidyas. (You can also mark any registered alumnus as expired from the 'All Registered Alumni' tab).
                </p>
              </div>

              <button
                onClick={() => setShowShradhanjaliModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                Add Memorial Tribute
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shradhanjaliList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300 grayscale flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Batch of {item.batchYear} • {item.degree}
                        </p>
                        <p className="text-xs text-red-600 font-medium mt-0.5">
                          Date of Demise: {item.dateOfDemise}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 italic">
                      "{item.tribute}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Posted by: {item.postedBy}
                    </span>
                    <button
                      onClick={() => handleDeleteShradhanjali(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: COMMUNITY SHOWCASE & MODERATION */}
        {activeTab === "showcase" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
                  Community Showcase & Content Moderation
                </h2>
                <p className="text-xs text-slate-500">
                  Manage alumni posts, pin high-quality contributions to top, hide/unhide posts, and review user reports.
                </p>
              </div>

              {/* Sub-tabs: Posts vs Reports */}
              <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowcaseSubTab("posts")}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    showcaseSubTab === "posts"
                      ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Posts ({communityPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShowcaseSubTab("reports")}
                  className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    showcaseSubTab === "reports"
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  User Reports
                  {pendingReports.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-white text-red-700 rounded-full text-[10px] font-extrabold">
                      {pendingReports.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: POSTS LIST & CONTROLS */}
            {showcaseSubTab === "posts" && (
              <div className="space-y-4">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={showcaseSearch}
                      onChange={(e) => setShowcaseSearch(e.target.value)}
                      placeholder="Search posts by title, author, category..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-slate-300 outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={showcaseFilter}
                      onChange={(e) => setShowcaseFilter(e.target.value as any)}
                      className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-slate-300 outline-none"
                    >
                      <option value="all">All Posts ({communityPosts.length})</option>
                      <option value="pinned">Pinned Only ({communityPosts.filter((p) => p.isPinned).length})</option>
                      <option value="visible">Visible Only ({communityPosts.filter((p) => !p.isHidden).length})</option>
                      <option value="hidden">Hidden Only ({communityPosts.filter((p) => p.isHidden).length})</option>
                    </select>
                  </div>
                </div>

                {/* Posts Table / List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7F2] text-slate-700 uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-3 px-4">Post & Author</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {communityPosts
                        .filter((p) => {
                          if (showcaseFilter === "pinned" && !p.isPinned) return false;
                          if (showcaseFilter === "hidden" && !p.isHidden) return false;
                          if (showcaseFilter === "visible" && p.isHidden) return false;
                          if (!showcaseSearch.trim()) return true;
                          const q = showcaseSearch.toLowerCase().trim();
                          return (
                            p.title.toLowerCase().includes(q) ||
                            p.authorName.toLowerCase().includes(q) ||
                            p.category.toLowerCase().includes(q)
                          );
                        })
                        .map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {post.thumbnailUrl || post.fileUrl ? (
                                  <img
                                    src={post.thumbnailUrl || post.fileUrl}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0 cursor-pointer"
                                    onClick={() => setLightboxPost(post)}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {post.contentType.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p
                                    onClick={() => setLightboxPost(post)}
                                    className="font-bold text-slate-900 truncate max-w-xs hover:text-amber-600 cursor-pointer"
                                  >
                                    {post.title}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    By {post.authorName} {post.authorBatch ? `(Batch ${post.authorBatch})` : ""}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                                {post.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                              {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {post.isPinned && (
                                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                                    <Pin className="w-3 h-3 fill-amber-700" /> Pinned #{post.pinOrder || 1}
                                  </span>
                                )}
                                {post.isHidden ? (
                                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px] flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" /> Hidden
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                                    Live
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdminTogglePin(post)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    post.isPinned
                                      ? "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                  title={post.isPinned ? "Unpin post" : "Pin to top"}
                                >
                                  <Pin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdminToggleHide(post)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    post.isHidden
                                      ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                  title={post.isHidden ? "Unhide post" : "Hide post from public"}
                                >
                                  {post.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdminDeletePost(post)}
                                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                                  title="Delete post permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {communityPosts.length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No posts uploaded yet in the Rishikul Community Showcase.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: USER REPORTS & MODERATION */}
            {showcaseSubTab === "reports" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  The following items have been flagged by alumni members for potential policy violations, copyright infringement, or inappropriate content:
                </p>

                {communityReports.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    No user reports! The showcase is free of flagged content.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {communityReports.map((rep) => {
                      const relatedPost = communityPosts.find((p) => p.id === rep.postId);
                      return (
                        <div
                          key={rep.id}
                          className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            rep.status === "pending"
                              ? "bg-red-50/40 border-red-200"
                              : "bg-slate-50 border-slate-200 opacity-70"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                {rep.reason}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                rep.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : rep.status === "reviewed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-700"
                              }`}>
                                {rep.status.toUpperCase()}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(rep.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-900">
                              Post: <span className="font-bold">"{rep.postTitle || relatedPost?.title || 'Unknown Post'}"</span>
                            </p>

                            {rep.details && (
                              <p className="text-xs text-slate-600 italic bg-white/70 p-2 rounded-lg border border-slate-200 max-w-xl">
                                "{rep.details}"
                              </p>
                            )}

                            <p className="text-[11px] text-slate-500">
                              Reported by: <span className="font-medium">{rep.reporterName}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            {relatedPost && (
                              <button
                                type="button"
                                onClick={() => setLightboxPost(relatedPost)}
                                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Post
                              </button>
                            )}

                            {rep.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleResolveReport(rep.id, "reviewed", rep.postId)}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
                                >
                                  <EyeOff className="w-3.5 h-3.5" /> Hide Post & Resolve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResolveReport(rep.id, "dismissed")}
                                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 9. LIFETIME MEMBERSHIP & UPI SETTINGS TAB */}
        {activeTab === "membership_settings" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Alert / Status */}
            {settingsSavedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>आजीवन सदस्यता सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं!</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configuration Form */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/40 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-[#C5A059]">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                      Membership & UPI Configuration
                    </h3>
                    <p className="text-xs text-slate-500">
                      आजीवन सदस्यता शुल्क, UPI ID, QR कोड एवं संपर्क प्रतिनिधि सेटिंग्स
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMembershipSettings(membershipSettings);
                    setSettingsSavedSuccess(true);
                    setTimeout(() => setSettingsSavedSuccess(false), 3000);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      आजीवन सदस्यता शुल्क (Lifetime Membership Fee in ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={membershipSettings.lifetimeFee}
                      onChange={(e) =>
                        setMembershipSettings({ ...membershipSettings, lifetimeFee: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-bold text-base text-[#0F172A]"
                    />
                    <span className="text-[11px] text-slate-400">पोर्टल पर डिफॉल्ट शुल्क ₹3,100 निर्धारित है।</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      एसोसिएशन आधिकारिक UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipSettings.upiId}
                      onChange={(e) =>
                        setMembershipSettings({ ...membershipSettings, upiId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-mono font-bold text-slate-800"
                    />
                    <span className="text-[11px] text-slate-400">सदस्यों को कॉपी करने व सीधे भुगतान हेतु यह UPI ID दिखेगी।</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      खाता धारक / संस्था नाम (Account Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipSettings.accountName}
                      onChange={(e) =>
                        setMembershipSettings({ ...membershipSettings, accountName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      UPI QR Code Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipSettings.qrImageUrl}
                      onChange={(e) =>
                        setMembershipSettings({ ...membershipSettings, qrImageUrl: e.target.value })
                      }
                      placeholder="/images/sample-upi-qr.png या Cloudinary URL"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-mono text-slate-800"
                    />
                    <span className="text-[11px] text-slate-400">आधिकारिक बैंक UPI QR कोड की छवि का पाथ या वेब लिंक।</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        अधिकृत संपर्क व्यक्ति (Contact Person) *
                      </label>
                      <input
                        type="text"
                        required
                        value={membershipSettings.contactPersonName}
                        onChange={(e) =>
                          setMembershipSettings({ ...membershipSettings, contactPersonName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        संपर्क मोबाइल नंबर (Contact Mobile) *
                      </label>
                      <input
                        type="text"
                        required
                        value={membershipSettings.contactMobile}
                        onChange={(e) =>
                          setMembershipSettings({ ...membershipSettings, contactMobile: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-mono font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp नंबर (Pre-filled Help Link) *
                    </label>
                    <input
                      type="text"
                      required
                      value={membershipSettings.whatsappNumber}
                      onChange={(e) =>
                        setMembershipSettings({ ...membershipSettings, whatsappNumber: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#2D5A43] text-[#C5A059] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 border border-[#C5A059]"
                    >
                      Save Settings (सेटिंग्स सुरक्षित करें)
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Submitted Lifetime Payment Requests */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/40 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                        सदस्यता शुल्क रसीदें (Payment Submissions)
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                      {membershipPaymentsList.length} कुल
                    </span>
                  </div>

                  {membershipPaymentsList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                      अभी तक कोई भुगतान विवरण प्राप्त नहीं हुआ है।
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {membershipPaymentsList.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-[#FAF7F2] space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-[#0F172A]">
                                {payment.fullName}
                              </div>
                              <div className="text-slate-500 font-mono">
                                📞 {payment.mobile} {payment.email ? `• ✉️ ${payment.email}` : ""}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                payment.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : payment.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800 animate-pulse"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Amount:</span>
                              <strong className="text-emerald-700 font-bold">₹{payment.amount}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">UTR / Ref ID:</span>
                              <strong className="font-mono text-slate-800">{payment.transactionReference}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Payment Date:</span>
                              <span>{payment.paymentDate}</span>
                            </div>
                            {payment.screenshotUrl && (
                              <div className="pt-1">
                                <a
                                  href={payment.screenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
                                >
                                  <span>View Receipt Screenshot</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          {payment.status === "pending" && (
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm(`क्या आप ${payment.fullName} का ₹${payment.amount} का भुगतान सत्यापित कर उन्हें Life Member में अपग्रेड करना चाहते हैं?`)) {
                                    await reviewMembershipPayment(payment.id, "approved");
                                    setMembershipPaymentsList(getMembershipPayments());
                                    const refreshedAlumni = await getAlumniList();
                                    setAlumniList(refreshedAlumni);
                                    alert("भुगतान सत्यापित हो गया और पूर्व स्नातक को 'Life Member' में अपग्रेड कर दिया गया!");
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#2D5A43] hover:bg-[#234734] text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify & Approve Life Member</span>
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm(`क्या आप ${payment.fullName} का भुगतान अनुरोध अस्वीकार करना चाहते हैं?`)) {
                                    await reviewMembershipPayment(payment.id, "rejected");
                                    setMembershipPaymentsList(getMembershipPayments());
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: MARK REGISTERED ALUMNUS AS EXPIRED / DECEASED */}
      {activeDeceasedAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-red-400">
            <h3 className="font-serif-heading text-2xl font-bold text-red-800 mb-1 flex items-center gap-2">
              <Flower className="w-6 h-6 text-red-600" />
              Mark Alumnus as Expired
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Marking <strong>Dr. {activeDeceasedAlumnus.fullName}</strong> will automatically generate their tribute memorial in the Shradhanjali Hall and update their registration status to Expired.
            </p>

            <form onSubmit={handleConfirmMarkExpired} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Date of Demise (स्वर्गवास तिथि) *
                </label>
                <input
                  type="date"
                  required
                  value={demiseDateInput}
                  onChange={(e) => setDemiseDateInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Shradhanjali Tribute Words *
                </label>
                <textarea
                  rows={3}
                  required
                  value={demiseTributeInput}
                  onChange={(e) => setDemiseTributeInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDeceasedAlumnus(null)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-800"
                >
                  Confirm & Move to Shradhanjali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Execute Password Reset */}
      {activeResetModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40">
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              Reset Alumnus Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fulfilling password reset requested by <strong>{activeResetModalReq.fullName}</strong> (@{activeResetModalReq.username}).
            </p>

            <form onSubmit={handleExecutePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Assign New Password
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordToAssign}
                  onChange={(e) => setNewPasswordToAssign(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900">
                You can communicate this temporary password to the alumnus via WhatsApp: <strong>{activeResetModalReq.mobile}</strong>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveResetModalReq(null)}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
                >
                  Confirm & Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lifetime Achiever */}
      {showAchieverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              Add Lifetime Achiever
            </h3>
            <form onSubmit={handleAddAchiever} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAchiever.name}
                  onChange={(e) => setNewAchiever({ ...newAchiever, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Batch Year *</label>
                  <input
                    type="number"
                    required
                    value={newAchiever.batchYear}
                    onChange={(e) => setNewAchiever({ ...newAchiever, batchYear: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={newAchiever.degree}
                    onChange={(e) => setNewAchiever({ ...newAchiever, degree: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Honor / Title *</label>
                <input
                  type="text"
                  required
                  value={newAchiever.title}
                  onChange={(e) => setNewAchiever({ ...newAchiever, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Citation *</label>
                <textarea
                  required
                  rows={3}
                  value={newAchiever.citation}
                  onChange={(e) => setNewAchiever({ ...newAchiever, citation: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAchieverModal(false)} className="px-4 py-2 text-xs font-bold uppercase text-slate-500">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase hover:bg-[#2D5A43]">Save Achiever</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shradhanjali */}
      {showShradhanjaliModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              Add Shradhanjali Tribute
            </h3>
            <form onSubmit={handleAddShradhanjali} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Name of Departed Alumnus *</label>
                <input
                  type="text"
                  required
                  value={newShradhanjali.name}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Batch Year *</label>
                  <input
                    type="number"
                    required
                    value={newShradhanjali.batchYear}
                    onChange={(e) => setNewShradhanjali({ ...newShradhanjali, batchYear: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date of Demise *</label>
                  <input
                    type="date"
                    required
                    value={newShradhanjali.dateOfDemise}
                    onChange={(e) => setNewShradhanjali({ ...newShradhanjali, dateOfDemise: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tribute Words *</label>
                <textarea
                  required
                  rows={3}
                  value={newShradhanjali.tribute}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, tribute: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowShradhanjaliModal(false)} className="px-4 py-2 text-xs font-bold uppercase text-slate-500">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase hover:bg-[#2D5A43]">Publish Tribute</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT REGISTRATION CONFIRMATION POPUP MODAL */}
      {rejectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-rose-200 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                  Reject Registration
                </h3>
                <p className="text-xs text-slate-500">
                  पंजीकरण अस्वीकार करने की पुष्टि करें
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={rejectCandidate.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={rejectCandidate.fullName}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-300 shrink-0"
                />
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">
                    Dr. {rejectCandidate.fullName}
                  </div>
                  <div className="text-slate-500">
                    Mobile: <span className="font-mono font-bold text-slate-800">{rejectCandidate.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 text-slate-600 space-y-0.5">
                <div><strong>Education:</strong> {rejectCandidate.rishikulEducation} {rejectCandidate.ugBatchYear ? `(UG: ${rejectCandidate.ugBatchYear})` : ""} {rejectCandidate.pgBatchYear ? `(PG: ${rejectCandidate.pgBatchYear})` : ""}</div>
                <div><strong>Location:</strong> {rejectCandidate.city}, {rejectCandidate.state}</div>
                <div><strong>Workplace:</strong> {rejectCandidate.designation}, {rejectCandidate.workplace}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              क्या आप वाकई <strong className="text-rose-700 font-bold">Dr. {rejectCandidate.fullName}</strong> का पंजीकरण अस्वीकार (Reject) करना चाहते हैं? अस्वीकार करने पर यह आवेदक पेंडिंग सूची से हट जाएगा और पोर्टल में लॉगिन नहीं कर सकेगा।
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectCandidate(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase hover:bg-slate-50 transition-colors"
              >
                Cancel (रद्द करें)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRejectAlumni(rejectCandidate.id);
                  setRejectCandidate(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Yes, Reject (हाँ, अस्वीकार करें)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Lightbox */}
      <MediaLightbox
        post={lightboxPost}
        onClose={() => setLightboxPost(null)}
      />
    </div>
  );
}
