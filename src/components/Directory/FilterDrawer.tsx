"use client";

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { SPECIALIZATION_OPTIONS, BATCH_YEARS } from "@/lib/mockData";
import { DirectoryFilterState } from "@/types";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DirectoryFilterState;
  onFilterChange: (key: keyof DirectoryFilterState, value: string) => void;
  onReset: () => void;
  totalResults: number;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#C5A059]/25 flex items-center justify-between bg-[#0F172A] text-white">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif-heading text-xl font-bold">Filter Directory</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Batch Year Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
              Graduation Batch
            </label>
            <select
              value={filters.batchYear}
              onChange={(e) => onFilterChange("batchYear", e.target.value)}
              className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:ring-2 focus:ring-[#2D5A43] focus:border-transparent outline-none transition-all"
            >
              {BATCH_YEARS.map((year) => (
                <option key={year} value={year === "All Batches" ? "" : year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
              Ayurvedic Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => onFilterChange("specialization", e.target.value)}
              className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:ring-2 focus:ring-[#2D5A43] focus:border-transparent outline-none transition-all"
            >
              {SPECIALIZATION_OPTIONS.map((spec) => (
                <option key={spec} value={spec === "All Specializations" ? "" : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* State / Region Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
              State / Region
            </label>
            <input
              type="text"
              placeholder="e.g. Uttarakhand, Delhi, Uttar Pradesh"
              value={filters.state}
              onChange={(e) => onFilterChange("state", e.target.value)}
              className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-[#2D5A43] outline-none"
            />
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Haridwar, Dehradun, Rishikesh"
              value={filters.city}
              onChange={(e) => onFilterChange("city", e.target.value)}
              className="w-full bg-white border border-[#C5A059]/40 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:ring-2 focus:ring-[#2D5A43] outline-none"
            />
          </div>

          {/* Membership Tier Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
              Membership Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["All", "Life Member", "Patron Member", "Annual Member"].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => onFilterChange("membershipTier", tier === "All" ? "" : tier)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                    (tier === "All" && !filters.membershipTier) ||
                    filters.membershipTier === tier
                      ? "bg-[#2D5A43] text-white border-[#2D5A43]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-[#F3ECE2]"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#C5A059]/25 bg-white/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors text-center"
          >
            Show {totalResults} Alumni
          </button>
        </div>
      </div>
    </div>
  );
}
