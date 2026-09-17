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
  AlertTriangle
} from "lucide-react";
import {
  getAlumniList,
  saveAlumniList,
  getLifetimeAchievers,
  saveLifetimeAchievers,
  getShradhanjaliList,
  saveShradhanjaliList,
  isAdminAuthenticated,
  setAdminAuthenticated
} from "@/lib/store";
import { AlumniProfile, LifetimeAchiever, ShradhanjaliRecord, MembershipTier } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"approvals" | "achievers" | "shradhanjali" | "patrons">("approvals");

  // State
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [achieversList, setAchieversList] = useState<LifetimeAchiever[]>([]);
  const [shradhanjaliList, setShradhanjaliList] = useState<ShradhanjaliRecord[]>([]);

  // Search filter inside admin
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [router]);

  const loadAllData = () => {
    setAlumniList(getAlumniList());
    setAchieversList(getLifetimeAchievers());
    setShradhanjaliList(getShradhanjaliList());
  };

  if (!mounted) return null;

  // Actions for Alumni Approvals
  const handleApproveAlumni = (id: string, tier?: MembershipTier) => {
    const updated = alumniList.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          isVerified: true,
          approvalStatus: "approved" as const,
          membershipTier: tier || a.membershipTier,
        };
      }
      return a;
    });
    setAlumniList(updated);
    saveAlumniList(updated);
  };

  const handleRejectAlumni = (id: string) => {
    const updated = alumniList.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          isVerified: false,
          approvalStatus: "rejected" as const,
        };
      }
      return a;
    });
    setAlumniList(updated);
    saveAlumniList(updated);
  };

  const handleChangeTier = (id: string, newTier: MembershipTier) => {
    const updated = alumniList.map((a) => {
      if (a.id === id) {
        return { ...a, membershipTier: newTier };
      }
      return a;
    });
    setAlumniList(updated);
    saveAlumniList(updated);
  };

  // Actions for Lifetime Achievers
  const handleAddAchiever = (e: React.FormEvent) => {
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
    saveLifetimeAchievers(updated);
    setShowAchieverModal(false);
  };

  const handleDeleteAchiever = (id: string) => {
    if (confirm("Are you sure you want to remove this Lifetime Achiever?")) {
      const updated = achieversList.filter((a) => a.id !== id);
      setAchieversList(updated);
      saveLifetimeAchievers(updated);
    }
  };

  // Actions for Shradhanjali
  const handleAddShradhanjali = (e: React.FormEvent) => {
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
    saveShradhanjaliList(updated);
    setShowShradhanjaliModal(false);
  };

  const handleDeleteShradhanjali = (id: string) => {
    if (confirm("Are you sure you want to remove this tribute?")) {
      const updated = shradhanjaliList.filter((s) => s.id !== id);
      setShradhanjaliList(updated);
      saveShradhanjaliList(updated);
    }
  };

  // Logout
  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push("/admin/login");
  };

  // Pending approval alumni
  const pendingAlumni = alumniList.filter((a) => a.approvalStatus === "pending" || !a.isVerified);
  // Patron members
  const patronMembers = alumniList.filter((a) => a.membershipTier === "Patron Member");

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C5A059]/30 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Administrative Governance Panel
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A]">
              Rishikul Alumni Admin Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Approve new registrations, manage Patron lists, update Lifetime Achievers & Shradhanjali memorials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stat Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pending Approvals
            </span>
            <div className="text-3xl font-serif-heading font-bold text-amber-600 mt-1">
              {pendingAlumni.length}
            </div>
            <span className="text-[11px] text-slate-500">Requires verification</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Patrons
            </span>
            <div className="text-3xl font-serif-heading font-bold text-[#C5A059] mt-1">
              {patronMembers.length}
            </div>
            <span className="text-[11px] text-slate-500">Tier 3 VIP Donors</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Lifetime Achievers
            </span>
            <div className="text-3xl font-serif-heading font-bold text-[#2D5A43] mt-1">
              {achieversList.length}
            </div>
            <span className="text-[11px] text-slate-500">Hall of Fame vaidyas</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shradhanjali Records
            </span>
            <div className="text-3xl font-serif-heading font-bold text-[#0F172A] mt-1">
              {shradhanjaliList.length}
            </div>
            <span className="text-[11px] text-slate-500">Departed alumni tributes</span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200">
          {[
            { id: "approvals", label: `Member Approvals (${pendingAlumni.length})`, icon: Users },
            { id: "patrons", label: `Patron Directory (${patronMembers.length})`, icon: Star },
            { id: "achievers", label: `Lifetime Achievers (${achieversList.length})`, icon: Award },
            { id: "shradhanjali", label: `Shradhanjali Memorials (${shradhanjaliList.length})`, icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-[#F3ECE2]"
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === id ? "text-[#C5A059]" : "text-slate-400"}`} />
              {label}
            </button>
          ))}
        </div>

        {/* TAB 1: Member Approvals */}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
              <h2 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-1">
                Pending Verification Requests
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Review submitted BAMS/MD alumni registrations. You can verify and approve them directly as Life Member or Patron Member.
              </p>

              {pendingAlumni.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  All alumni applications are up to date! No pending registrations.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAlumni.map((alumnus) => (
                    <div
                      key={alumnus.id}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={alumnus.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"}
                          alt={alumnus.fullName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                              {alumnus.fullName}
                            </h3>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              Applied: {alumnus.membershipTier}
                            </span>
                          </div>
                          <p className="text-xs text-[#2D5A43] font-medium">
                            {alumnus.degree} • Batch of {alumnus.batchYear} • {alumnus.specialization}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Workplace: {alumnus.designation} at {alumnus.workplace} ({alumnus.city}, {alumnus.state})
                          </p>
                          {alumnus.dateOfBirth && (
                            <p className="text-[11px] text-slate-500">
                              DOB: <strong>{alumnus.dateOfBirth}</strong> | Email: {alumnus.email} | Phone: {alumnus.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApproveAlumni(alumnus.id, "Life Member")}
                          className="px-3.5 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors"
                        >
                          Approve as Life Member
                        </button>
                        <button
                          onClick={() => handleApproveAlumni(alumnus.id, "Patron Member")}
                          className="px-3.5 py-2 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors"
                        >
                          Approve as Patron
                        </button>
                        <button
                          onClick={() => handleRejectAlumni(alumnus.id)}
                          className="p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Patron Management */}
        {activeTab === "patrons" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  Patron Members Roster
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Promote existing members to Patron status or adjust their membership tiers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
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
                        {patron.degree} • Batch of {patron.batchYear} • {patron.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={patron.membershipTier}
                      onChange={(e) => handleChangeTier(patron.id, e.target.value as MembershipTier)}
                      className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 font-medium outline-none"
                    >
                      <option value="Patron Member">Patron Member</option>
                      <option value="Life Member">Life Member</option>
                      <option value="Annual Member">Annual Member</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Lifetime Achievers Management */}
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

                    <div className="flex flex-wrap gap-1 mb-4">
                      {achiever.awards.map((award, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-semibold"
                        >
                          {award}
                        </span>
                      ))}
                    </div>
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

        {/* TAB 4: Shradhanjali Management */}
        {activeTab === "shradhanjali" && (
          <div className="bg-white rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  Shradhanjali (शोक श्रद्धांजलि) Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish heartfelt memorials and condolences for departed vaidyas and batchmates.
                </p>
              </div>

              <button
                onClick={() => setShowShradhanjaliModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" />
                Add Shradhanjali Tribute
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
      </div>

      {/* Modal: Add Lifetime Achiever */}
      {showAchieverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              Add Lifetime Achiever
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter alumnus accomplishments, batch, and portrait photo.
            </p>

            <form onSubmit={handleAddAchiever} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Padma Shri Dr. Ram Prakash"
                  value={newAchiever.name}
                  onChange={(e) => setNewAchiever({ ...newAchiever, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Graduation Batch Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={newAchiever.batchYear}
                    onChange={(e) => setNewAchiever({ ...newAchiever, batchYear: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={newAchiever.degree}
                    onChange={(e) => setNewAchiever({ ...newAchiever, degree: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Title / Distinguishing Honor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Pulse Diagnosis & Herbal Chemist"
                  value={newAchiever.title}
                  onChange={(e) => setNewAchiever({ ...newAchiever, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newAchiever.photoUrl}
                  onChange={(e) => setNewAchiever({ ...newAchiever, photoUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Citation / Notable Achievements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contributions to Ayurveda, government policies, books published..."
                  value={newAchiever.citation}
                  onChange={(e) => setNewAchiever({ ...newAchiever, citation: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Awards (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Padma Shri, Dhanvantari Award, AYUSH Ratna"
                  value={Array.isArray(newAchiever.awards) ? newAchiever.awards.join(", ") : newAchiever.awards}
                  onChange={(e) => setNewAchiever({ ...newAchiever, awards: e.target.value as any })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAchieverModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  Save Achiever
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Shradhanjali Tribute */}
      {showShradhanjaliModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              Add Shradhanjali Memorial (शोक श्रद्धांजलि)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Memorialize late alumni doctors and colleagues with their demise date and heartfelt tribute.
            </p>

            <form onSubmit={handleAddShradhanjali} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name of Departed Alumnus *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Late Dr. Birendra Singh"
                  value={newShradhanjali.name}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Graduation Batch Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={newShradhanjali.batchYear}
                    onChange={(e) => setNewShradhanjali({ ...newShradhanjali, batchYear: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Date of Demise (स्वर्गवास तिथि) *
                  </label>
                  <input
                    type="date"
                    required
                    value={newShradhanjali.dateOfDemise}
                    onChange={(e) => setNewShradhanjali({ ...newShradhanjali, dateOfDemise: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Memorial Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newShradhanjali.photoUrl}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, photoUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Heartfelt Tribute / Memorial Words *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Memories, medical service to society, batches they studied with..."
                  value={newShradhanjali.tribute}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, tribute: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Posted On Behalf Of
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch of 1977 / Executive Committee"
                  value={newShradhanjali.postedBy}
                  onChange={(e) => setNewShradhanjali({ ...newShradhanjali, postedBy: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowShradhanjaliModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  Publish Tribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
