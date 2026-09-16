"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlumniProfile } from "@/types";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Share2
} from "lucide-react";

interface AlumniCardProps {
  alumni: AlumniProfile;
  onSelect?: (alumni: AlumniProfile) => void;
}

export default function AlumniCard({ alumni, onSelect }: AlumniCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Dr. ${alumni.fullName} (${alumni.degree}, Batch ${alumni.batchYear}) - Rishikul Alumni: ${window.location.origin}/directory?id=${alumni.id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(alumni)}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-[#C5A059]/30 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Header: Avatar, Verified Badge, Batch Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 group-hover:border-[#2D5A43] transition-colors relative bg-slate-100 flex-shrink-0">
              <img
                src={alumni.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"}
                alt={alumni.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {alumni.isVerified && (
              <span
                title="Verified Alumni Member"
                className="absolute -bottom-1 -right-1 bg-[#2D5A43] text-white p-1 rounded-full shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#0F172A] border border-[#C5A059]/40">
              Batch {alumni.batchYear}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
              {alumni.membershipTier}
            </span>
          </div>
        </div>

        {/* Doctor Name & Hindi Name */}
        <div className="mb-2">
          <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-[#2D5A43] transition-colors line-clamp-1">
            {alumni.fullName}
          </h3>
          {alumni.fullNameHindi && (
            <p className="text-xs font-medium text-[#64748B] tracking-normal mt-0.5">
              {alumni.fullNameHindi}
            </p>
          )}
        </div>

        {/* Degree & Specialization Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#2D5A43]/10 text-[#2D5A43]">
            <GraduationCap className="w-3 h-3" />
            {alumni.degree}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0F172A]/5 text-[#0F172A] line-clamp-1">
            {alumni.specialization}
          </span>
        </div>

        {/* Workplace & Designation */}
        <div className="space-y-1.5 text-xs text-[#64748B] mb-4">
          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-[#0F172A] font-medium">
              {alumni.designation} • {alumni.workplace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
            <span>
              {alumni.city}, {alumni.state}
            </span>
          </div>
        </div>

        {/* Bio Snippet */}
        {alumni.bio && (
          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4 italic">
            "{alumni.bio}"
          </p>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-[#C5A059]/20 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">
          ID: {alumni.membershipId}
        </span>

        <div className="flex items-center gap-1.5">
          {alumni.whatsappNumber && (
            <a
              href={`https://wa.me/${alumni.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Connect on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-[#F3ECE2] transition-colors text-xs"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold text-[#2D5A43] ml-1 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>

      {copied && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[11px] py-1 px-3 rounded-full shadow-lg z-20">
          Link copied!
        </div>
      )}
    </div>
  );
}
