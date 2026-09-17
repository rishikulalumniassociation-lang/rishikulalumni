"use client";

import React, { useState, useEffect, useMemo } from "react";
import AlumniCard from "@/components/Directory/AlumniCard";
import FilterDrawer from "@/components/Directory/FilterDrawer";
import { SPECIALIZATION_OPTIONS, BATCH_YEARS, JOB_TYPE_OPTIONS } from "@/lib/mockData";
import { getAlumniList, getLoggedInAlumni, toggleAlumniConnection } from "@/lib/store";
import { useRouter } from "next/navigation";
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
  Briefcase
} from "lucide-react";

export default function DirectoryPage() {
  const router = useRouter();
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    setAlumniList(getAlumniList());
    setCurrentUser(getLoggedInAlumni());

    const handleUpdate = () => {
      setAlumniList(getAlumniList());
      setCurrentUser(getLoggedInAlumni());
    };
    window.addEventListener("alumni_updated", handleUpdate);
    window.addEventListener("user_auth_changed", handleUpdate);
    return () => {
      window.removeEventListener("alumni_updated", handleUpdate);
      window.removeEventListener("user_auth_changed", handleUpdate);
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
    return alumniList.filter((a) => a.isVerified && a.approvalStatus !== "rejected");
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>ऋषिकुल पुरातन छात्र डायरेक्टरी</span>
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
              Clear filters ({activeFiltersCount})
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
                  setAlumniList(getAlumniList());
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
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#C5A059] bg-slate-100 flex-shrink-0">
                <img
                  src={selectedProfile.avatarUrl}
                  alt={selectedProfile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                  {selectedProfile.membershipTier} • Verified
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  {selectedProfile.fullName}
                </h3>
                {selectedProfile.fullNameHindi && (
                  <p className="text-xs text-[#64748B] font-medium">
                    {selectedProfile.fullNameHindi}
                  </p>
                )}
                
                {/* UG / PG badges in modal */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedProfile.ugBatchYear && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] text-[11px] font-bold border">
                      UG Batch: {selectedProfile.ugBatchYear} ({selectedProfile.ugDegree || "BAMS"})
                    </span>
                  )}
                  {selectedProfile.pgBatchYear && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#2D5A43] text-[11px] font-bold border border-emerald-200">
                      PG Batch: {selectedProfile.pgBatchYear} ({selectedProfile.pgDegree || "MD"})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-b border-slate-100 py-4 mb-6">
              <div>
                <strong className="text-slate-800">Job Type:</strong> {selectedProfile.jobType}
              </div>
              <div>
                <strong className="text-slate-800">Designation & Workplace:</strong> {selectedProfile.designation} at {selectedProfile.workplace}
              </div>
              <div>
                <strong className="text-slate-800">Specialization:</strong> {selectedProfile.specialization}
              </div>
              <div>
                <strong className="text-slate-800">City & State:</strong> {selectedProfile.city}, {selectedProfile.state}
              </div>
              {selectedProfile.address && (
                <div>
                  <strong className="text-slate-800">Address:</strong> {selectedProfile.address}
                </div>
              )}
              {selectedProfile.dateOfBirth && (
                <div className="flex items-center gap-1.5 text-amber-800">
                  <Cake className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span><strong>Date of Birth:</strong> {selectedProfile.dateOfBirth}</span>
                </div>
              )}
              {selectedProfile.bio && (
                <div>
                  <strong className="text-slate-800">Biography:</strong>
                  <p className="mt-1 italic leading-relaxed text-slate-500">{selectedProfile.bio}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {currentUser && selectedProfile.id !== currentUser.id && (
                <button
                  type="button"
                  onClick={() => {
                    toggleAlumniConnection(currentUser.id, selectedProfile.id);
                    const freshList = getAlumniList();
                    setAlumniList(freshList);
                    const freshProfile = freshList.find((a) => a.id === selectedProfile.id);
                    if (freshProfile) setSelectedProfile(freshProfile);
                    setCurrentUser(getLoggedInAlumni());
                  }}
                  className={`w-full sm:flex-1 py-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                    (selectedProfile.connectedAlumniIds || []).includes(currentUser.id)
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                      : "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                  }`}
                >
                  <Users2 className="w-4 h-4" />
                  <span>
                    {(selectedProfile.connectedAlumniIds || []).includes(currentUser.id)
                      ? "Connected ✓"
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
              {selectedProfile.whatsappNumber && (
                <a
                  href={`https://wa.me/${selectedProfile.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 text-center rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  WhatsApp Connect
                </a>
              )}
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-full sm:w-28 py-3 text-center rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
