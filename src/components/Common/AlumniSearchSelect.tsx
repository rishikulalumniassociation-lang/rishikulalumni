"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, User } from "lucide-react";
import { AlumniProfile } from "@/types";

interface AlumniSearchSelectProps {
  alumniList: AlumniProfile[];
  excludeIds?: string[];
  selectedId: string;
  onSelect: (alumniId: string) => void;
  placeholder?: string;
}

export default function AlumniSearchSelect({
  alumniList,
  excludeIds = [],
  selectedId,
  onSelect,
  placeholder = "नाम, बैच, शहर या पद टाइप करके खोजें...",
}: AlumniSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out excluded IDs
  const availableAlumni = alumniList.filter((a) => !excludeIds.includes(a.id));

  // Find currently selected alumni
  const selectedAlumnus = alumniList.find((a) => a.id === selectedId);

  // Filter by search query
  const filtered = availableAlumni.filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    const matchName = (a.fullName || "").toLowerCase().includes(q);
    const matchHindi = (a.fullNameHindi || "").toLowerCase().includes(q);
    const matchCity = (a.city || "").toLowerCase().includes(q);
    const matchUg = a.ugBatchYear ? a.ugBatchYear.toString().includes(q) : false;
    const matchPg = a.pgBatchYear ? a.pgBatchYear.toString().includes(q) : false;
    const matchDesig = (a.designation || "").toLowerCase().includes(q);
    const matchWork = (a.workplace || "").toLowerCase().includes(q);
    return matchName || matchHindi || matchCity || matchUg || matchPg || matchDesig || matchWork;
  });

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {selectedAlumnus ? (
        // Selected Pill / Card
        <div className="flex items-center justify-between gap-3 p-2.5 bg-amber-50/90 border-2 border-[#C5A059] rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedAlumnus.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt={selectedAlumnus.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-[#C5A059] flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-[#0F172A] truncate">
                  {selectedAlumnus.fullName}
                </span>
                {selectedAlumnus.fullNameHindi && (
                  <span className="text-[11px] text-[#C5A059] truncate hidden sm:inline">
                    ({selectedAlumnus.fullNameHindi})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 truncate">
                {selectedAlumnus.ugBatchYear ? `UG: ${selectedAlumnus.ugBatchYear}` : ""}{" "}
                {selectedAlumnus.pgBatchYear ? `• PG: ${selectedAlumnus.pgBatchYear}` : ""} •{" "}
                {selectedAlumnus.city} {selectedAlumnus.designation ? `(${selectedAlumnus.designation})` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelect("");
              setQuery("");
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
            title="Clear Selection / बदलें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Search Input Field
        <div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="w-full bg-white border border-slate-300 focus:border-[#C5A059] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm outline-none shadow-xs transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-[#C5A059]/40 rounded-2xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.slice(0, 15).map((alumnus) => (
                  <button
                    key={alumnus.id}
                    type="button"
                    onClick={() => {
                      onSelect(alumnus.id);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="w-full text-left p-2.5 sm:p-3 hover:bg-amber-50/60 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={alumnus.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                        alt={alumnus.fullName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 group-hover:border-[#C5A059] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-[#0F172A] truncate group-hover:text-[#2D5A43]">
                          {alumnus.fullName}{" "}
                          {alumnus.fullNameHindi && (
                            <span className="text-[11px] text-[#C5A059] font-normal">
                              ({alumnus.fullNameHindi})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded">
                            {alumnus.ugBatchYear ? `UG: ${alumnus.ugBatchYear}` : ""}{" "}
                            {alumnus.pgBatchYear ? `PG: ${alumnus.pgBatchYear}` : ""}
                          </span>
                          <span>•</span>
                          <span>{alumnus.city || alumnus.state}</span>
                          {alumnus.designation && (
                            <>
                              <span>•</span>
                              <span className="truncate">{alumnus.designation}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      चुनें +
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  <User className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span>कोई एल्युमनाई नहीं मिला। कृपया नाम, बैच या शहर बदलकर खोजें।</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
