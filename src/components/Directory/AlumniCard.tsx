"use client";

import React, { useState } from "react";
import { AlumniProfile } from "@/types";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Share2,
  Users2,
  Cake,
  Building,
  Medal
} from "lucide-react";
import { toggleAlumniConnection } from "@/lib/store";
import { useRouter } from "next/navigation";

interface AlumniCardProps {
  alumni: AlumniProfile;
  allAlumni?: AlumniProfile[];
  currentAlumniId?: string;
  onSelect?: (alumni: AlumniProfile) => void;
  onConnectionToggle?: () => void;
}

export default function AlumniCard({
  alumni,
  allAlumni = [],
  currentAlumniId,
  onSelect,
  onConnectionToggle
}: AlumniCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const isConnectedWithMe = Boolean(currentAlumniId && (alumni.connectedAlumniIds || []).includes(currentAlumniId));
  const totalConnectionsCount = (alumni.connectedAlumniIds || []).length;
  const isSelf = Boolean(currentAlumniId && currentAlumniId === alumni.id);

  const connectedPeople = (alumni.connectedAlumniIds || [])
    .map((id) => allAlumni.find((a) => a.id === id))
    .filter(Boolean) as AlumniProfile[];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Dr. ${alumni.fullName} - Rishikul Alumni: ${window.location.origin}/directory?id=${alumni.id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAlumniId) {
      router.push("/login?redirect=/directory");
      return;
    }
    toggleAlumniConnection(currentAlumniId, alumni.id);
    if (onConnectionToggle) onConnectionToggle();
  };

  // Render UG / PG batch badges dynamically
  const renderBatchBadges = () => {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {alumni.ugBatchYear && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF7F2] text-[#0F172A] border border-[#C5A059]/50">
            UG Batch: {alumni.ugBatchYear}
          </span>
        )}
        {alumni.pgBatchYear && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/30">
            PG Batch: {alumni.pgBatchYear}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelect && onSelect(alumni)}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-[#C5A059]/30 hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Header with Photo, Verified Badge, and Membership Tier */}
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
                title="Verified by Association Admin"
                className="absolute -bottom-1 -right-1 bg-[#2D5A43] text-white p-1 rounded-full shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {renderBatchBadges()}
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
              {alumni.membershipTier}
            </span>
          </div>
        </div>

        {/* Doctor Name & Degree */}
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

        {/* Education Tag & Specialization */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0F172A]/5 text-[#0F172A]">
            <GraduationCap className="w-3 h-3 text-[#C5A059]" />
            {alumni.rishikulEducation === "BOTH"
              ? "UG (BAMS) + PG (MD/MS)"
              : alumni.rishikulEducation === "PG"
              ? "PG (MD/MS)"
              : "UG (BAMS)"}
          </span>
          {alumni.specialization && (
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#2D5A43]/10 text-[#2D5A43] line-clamp-1">
              PG: {alumni.specialization}
            </span>
          )}
          {alumni.specialAchievements && alumni.specialAchievements.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
              <Medal className="w-3 h-3 text-amber-600" />
              <span>
                {alumni.specialAchievements[0].type.includes("Gold")
                  ? "Gold Medalist"
                  : alumni.specialAchievements[0].title}
                {alumni.specialAchievements.length > 1 && ` (+${alumni.specialAchievements.length - 1})`}
              </span>
            </span>
          )}
        </div>

        {/* Job Type, Workplace & Designation */}
        <div className="space-y-1.5 text-xs text-[#64748B] mb-3">
          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-[#0F172A] font-medium">
              {alumni.designation} • {alumni.workplace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-600 font-medium">{alumni.jobType}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A059]" />
              {alumni.city}, {alumni.state}
            </span>
          </div>
        </div>

        {/* Mutual Alumni Network indicator */}
        <div className="pt-2.5 pb-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {connectedPeople.slice(0, 3).map((conn, idx) => (
                <img
                  key={idx}
                  src={conn.avatarUrl}
                  alt={conn.fullName}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                  title={conn.fullName}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalConnectionsCount > 0
                ? `${totalConnectionsCount} Alumni Connection${totalConnectionsCount > 1 ? "s" : ""}`
                : "No connections yet"}
            </span>
          </div>

          {isSelf ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
              You (स्वयं)
            </span>
          ) : (
            <button
              onClick={handleConnectClick}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
                isConnectedWithMe
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                  : currentAlumniId
                  ? "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                  : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-[#0F172A] hover:text-white"
              }`}
              title={
                !currentAlumniId
                  ? "कनेक्ट करने के लिए कृपया पहले लॉगिन करें"
                  : isConnectedWithMe
                  ? "क्लिक करके कनेक्शन हटाएं (Disconnect)"
                  : "अपने बैचमेट से कनेक्ट करें"
              }
            >
              <Users2 className="w-3 h-3" />
              <span>
                {isConnectedWithMe
                  ? "Connected ✓"
                  : currentAlumniId
                  ? "Connect"
                  : "Login to Connect"}
              </span>
            </button>
          )}
        </div>
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
