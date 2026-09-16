"use client";

import React, { useState, useMemo } from "react";
import AlumniCard from "@/components/Directory/AlumniCard";
import FilterDrawer from "@/components/Directory/FilterDrawer";
import { MOCK_ALUMNI, SPECIALIZATION_OPTIONS, BATCH_YEARS } from "@/lib/mockData";
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
  ExternalLink
} from "lucide-react";

export default function DirectoryPage() {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);

  const [filters, setFilters] = useState<DirectoryFilterState>({
    searchQuery: "",
    batchYear: "",
    specialization: "",
    state: "",
    city: "",
    membershipTier: "",
  });

  const handleFilterChange = (key: keyof DirectoryFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: "",
      batchYear: "",
      specialization: "",
      state: "",
      city: "",
      membershipTier: "",
    });
  };

  // Filter logic
  const filteredAlumni = useMemo(() => {
    return MOCK_ALUMNI.filter((alumni) => {
      // Search query (name, hindi name, designation, workplace, city)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          alumni.fullName.toLowerCase().includes(q) ||
          (alumni.fullNameHindi && alumni.fullNameHindi.includes(q)) ||
          alumni.designation.toLowerCase().includes(q) ||
          alumni.workplace.toLowerCase().includes(q) ||
          alumni.city.toLowerCase().includes(q) ||
          alumni.specialization.toLowerCase().includes(q);

        if (!matchesSearch) return false;
      }

      // Batch year match
      if (filters.batchYear) {
        if (filters.batchYear.includes("-")) {
          const [start, end] = filters.batchYear.split("-").map(Number);
          if (alumni.batchYear < start || alumni.batchYear > end) return false;
        } else if (filters.batchYear.startsWith("Before")) {
          const year = parseInt(filters.batchYear.replace(/\D/g, ""), 10);
          if (alumni.batchYear >= year) return false;
        } else {
          if (alumni.batchYear !== Number(filters.batchYear)) return false;
        }
      }

      // Specialization match
      if (filters.specialization && alumni.specialization !== filters.specialization) {
        return false;
      }

      // State match
      if (
        filters.state &&
        !alumni.state.toLowerCase().includes(filters.state.toLowerCase())
      ) {
        return false;
      }

      // City match
      if (
        filters.city &&
        !alumni.city.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false;
      }

      // Membership tier
      if (filters.membershipTier && alumni.membershipTier !== filters.membershipTier) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.batchYear) count++;
    if (filters.specialization) count++;
    if (filters.state) count++;
    if (filters.city) count++;
    if (filters.membershipTier) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>ऋषिकुल डायरेक्टरी</span>
            <span>•</span>
            <span>Worldwide Network</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-2xl">
            Search verified graduates of Rishikul Government Ayurvedic College across batches, clinical specialties, and global locations.
          </p>
        </div>

        {/* Mobile-first Search & Filter Bar */}
        <div className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, hospital, city..."
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

            {/* Mobile Filter Drawer Trigger Button */}
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

          {/* Quick Filter Pills (Horizontal Scroll for Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
            <button
              onClick={() => handleFilterChange("specialization", "")}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                !filters.specialization
                  ? "bg-[#0F172A] text-white font-medium"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              All Specialties
            </button>
            {["Kayachikitsa (Internal Medicine)", "Panchakarma", "Shalya Tantra (Surgery)", "General Ayurvedic Practice"].map((spec) => (
              <button
                key={spec}
                onClick={() => handleFilterChange("specialization", spec)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  filters.specialization === spec
                    ? "bg-[#2D5A43] text-white font-medium"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-[#F3ECE2]"
                }`}
              >
                {spec.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Active Filters Display */}
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
                onSelect={(selected) => setSelectedProfile(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-[#C5A059]/30 max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
              No Alumni Found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find any doctor matching your search filters. Try adjusting your batch year or specialty.
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

      {/* Filter Drawer Component */}
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
                  {selectedProfile.membershipTier}
                </span>
                <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  {selectedProfile.fullName}
                </h3>
                {selectedProfile.fullNameHindi && (
                  <p className="text-xs text-[#64748B] font-medium">
                    {selectedProfile.fullNameHindi}
                  </p>
                )}
                <p className="text-xs text-[#2D5A43] font-semibold mt-1">
                  {selectedProfile.degree} • Batch of {selectedProfile.batchYear}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-b border-slate-100 py-4 mb-6">
              <div>
                <strong className="text-slate-800">Specialization:</strong> {selectedProfile.specialization}
              </div>
              <div>
                <strong className="text-slate-800">Current Workplace:</strong> {selectedProfile.designation} at {selectedProfile.workplace}
              </div>
              <div>
                <strong className="text-slate-800">Location:</strong> {selectedProfile.city}, {selectedProfile.state}, {selectedProfile.country}
              </div>
              {selectedProfile.bio && (
                <div>
                  <strong className="text-slate-800">Biography:</strong>
                  <p className="mt-1 italic leading-relaxed text-slate-500">{selectedProfile.bio}</p>
                </div>
              )}
              {selectedProfile.achievements && selectedProfile.achievements.length > 0 && (
                <div>
                  <strong className="text-slate-800">Key Distinctions:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500">
                    {selectedProfile.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {selectedProfile.whatsappNumber && (
                <a
                  href={`https://wa.me/${selectedProfile.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-center rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                >
                  WhatsApp Connect
                </a>
              )}
              <button
                onClick={() => setSelectedProfile(null)}
                className="flex-1 py-3 text-center rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-colors"
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
