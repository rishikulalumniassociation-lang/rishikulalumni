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
  Medal,
  Lock,
  Heart,
  Crown
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
  const initialConnected = Boolean(currentAlumniId && (alumni.connectedAlumniIds || []).includes(currentAlumniId));
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [connectionsCount, setConnectionsCount] = useState((alumni.connectedAlumniIds || []).length);

  React.useEffect(() => {
    setIsConnected(Boolean(currentAlumniId && (alumni.connectedAlumniIds || []).includes(currentAlumniId)));
    setConnectionsCount((alumni.connectedAlumniIds || []).length);
  }, [alumni.connectedAlumniIds, currentAlumniId]);

  const isSelf = Boolean(currentAlumniId && currentAlumniId === alumni.id);

  const connectedPeople = (alumni.connectedAlumniIds || [])
    .map((id) => allAlumni.find((a) => a.id === id))
    .filter(Boolean) as AlumniProfile[];

  // Linked family alumni members
  const familyPeople = (alumni.familyAlumniRelations || [])
    .map((rel) => {
      const person = allAlumni.find((a) => a.id === rel.relatedAlumniId);
      return person ? { relationType: rel.relationType, person } : null;
    })
    .filter(Boolean) as { relationType: string; person: AlumniProfile }[];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${alumni.fullName} - Rishikul Alumni: ${window.location.origin}/directory?id=${alumni.id}`
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
    const nextState = !isConnected;
    setIsConnected(nextState);
    setConnectionsCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    toggleAlumniConnection(currentAlumniId, alumni.id).catch((err) => {
      console.error("Failed to toggle connection:", err);
      setIsConnected(!nextState);
      setConnectionsCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    });

    if (onConnectionToggle) onConnectionToggle();
  };

  // Render UG / PG batch badges dynamically
  const renderBatchBadges = () => {
    const ugEnd = alumni.ugPassoutYear || (alumni.ugBatchYear ? alumni.ugBatchYear + 5 : null);
    const pgEnd = alumni.pgPassoutYear || (alumni.pgBatchYear ? alumni.pgBatchYear + 3 : null);

    return (
      <div className="flex flex-col items-end gap-1">
        {alumni.ugBatchYear && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FAF7F2] text-[#0F172A] border border-[#C5A059]/50 shadow-xs whitespace-nowrap">
            UG: {alumni.ugBatchYear}{ugEnd ? `-${ugEnd}` : ""}
          </span>
        )}
        {alumni.pgBatchYear && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/30 shadow-xs whitespace-nowrap">
            PG: {alumni.pgBatchYear}{pgEnd ? `-${pgEnd}` : ""}
          </span>
        )}
      </div>
    );
  };

  const isLifeMember = alumni.membershipTier === "Life Member";
  const isPatronMember = alumni.membershipTier === "Patron Member";

  return (
    <div
      onClick={() => onSelect && onSelect(alumni)}
      className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
        isLifeMember
          ? "bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E2] to-[#F4E6CC] border-2 border-[#C5A059] shadow-md hover:shadow-xl hover:border-amber-500 ring-1 ring-amber-400/40"
          : isPatronMember
          ? "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-slate-100 border-2 border-[#C5A059] shadow-lg hover:shadow-2xl hover:border-amber-400"
          : "bg-white border border-[#C5A059]/30 hover:border-[#C5A059] shadow-sm hover:shadow-md"
      }`}
    >
      {/* Distinction Top Strip */}
      {isLifeMember && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-600 shadow-xs" />
      )}
      {isPatronMember && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F172A] via-[#C5A059] to-[#0F172A] shadow-xs" />
      )}

      {/* Subtle Background Watermark for Life Member */}
      {isLifeMember && (
        <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full border-[10px] border-[#C5A059]/10 pointer-events-none select-none" />
      )}

      <div>
        {/* Header with Photo, Verified Badge, and Membership Tier */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden relative flex-shrink-0 transition-all ${
              isLifeMember
                ? "border-2 border-amber-500 ring-2 ring-[#C5A059]/50 shadow-md bg-amber-50"
                : isPatronMember
                ? "border-2 border-[#C5A059] ring-2 ring-amber-400/50 shadow-md bg-slate-900"
                : "border-2 border-[#C5A059]/40 group-hover:border-[#2D5A43] bg-slate-100"
            }`}>
              <img
                src={alumni.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"}
                alt={alumni.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isLifeMember && (
                <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-sm" title="Life Member">
                  <Crown className="w-2.5 h-2.5 fill-slate-950" />
                </div>
              )}
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
            {isLifeMember ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-500 text-slate-950 shadow-xs border border-amber-300">
                <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
                Life Member
              </span>
            ) : isPatronMember ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-slate-900 to-[#0F172A] text-amber-300 shadow-xs border border-[#C5A059]">
                <Crown className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
                Patron Member
              </span>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                {alumni.membershipTier}
              </span>
            )}
          </div>
        </div>

        {/* Doctor Name & Degree */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className={`font-serif-heading text-lg sm:text-xl font-bold transition-colors line-clamp-1 ${
              isPatronMember ? "text-white group-hover:text-amber-300" : "text-[#0F172A] group-hover:text-[#2D5A43]"
            }`}>
              {alumni.fullName}
            </h3>
            {isLifeMember && (
              <span title="Paid Life Member (आजीवन सदस्य)">
                <Crown className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              </span>
            )}
          </div>
          {alumni.fullNameHindi && (
            <p className={`text-xs font-medium tracking-normal mt-0.5 ${
              isPatronMember ? "text-amber-200/90" : "text-[#64748B]"
            }`}>
              {alumni.fullNameHindi}
            </p>
          )}
        </div>

        {/* Paid Life Member Distinction Banner */}
        {isLifeMember && (
          <div className="mb-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-200/85 via-amber-100 to-amber-200/85 border border-amber-300/90 flex items-center justify-between shadow-2xs">
            <span className="text-[10.5px] font-extrabold text-amber-950 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-800 fill-amber-700" />
              आजीवन सदस्य (Paid Life Member)
            </span>
            <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-300/80 px-1.5 py-0.5 rounded border border-amber-400/70">
              Distinction
            </span>
          </div>
        )}

        {/* Education Tag & Specialization */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
            isPatronMember
              ? "bg-slate-800 text-amber-200 border border-slate-700"
              : "bg-[#0F172A]/5 text-[#0F172A]"
          }`}>
            <GraduationCap className="w-3 h-3 text-[#C5A059]" />
            {alumni.rishikulEducation === "BOTH"
              ? "UG (BAMS) + PG (MD/MS)"
              : alumni.rishikulEducation === "PG"
              ? "PG (MD/MS)"
              : "UG (BAMS)"}
          </span>
          {alumni.rishikulEducation !== "UG" && alumni.specialization && alumni.specialization !== "General Ayurvedic Practice" && (
            <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md line-clamp-1 ${
              isPatronMember
                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/60"
                : "bg-[#2D5A43]/10 text-[#2D5A43]"
            }`}>
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
        <div className={`space-y-1.5 text-xs mb-3 ${
          isPatronMember ? "text-slate-300" : "text-[#64748B]"
        }`}>
          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <span className={`line-clamp-1 font-medium ${
              isPatronMember ? "text-slate-100" : "text-[#0F172A]"
            }`}>
              {alumni.designation} • {alumni.workplace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building className={`w-3.5 h-3.5 flex-shrink-0 ${
              isPatronMember ? "text-slate-400" : "text-slate-400"
            }`} />
            <span className={`font-medium ${
              isPatronMember ? "text-slate-300" : "text-slate-600"
            }`}>{alumni.jobType}</span>
            <span className={isPatronMember ? "text-slate-500" : ""}>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A059]" />
              <span className={isPatronMember ? "text-slate-300" : ""}>
                {alumni.city}, {alumni.state}
              </span>
            </span>
          </div>
        </div>

        {/* Linked Family Relations (Visible to logged-in users / community) */}
        {familyPeople.length > 0 && (
          <div className="mb-3 p-2 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-500/20" />
              <span className="text-[11px] font-medium text-rose-950 truncate">
                <strong className="font-bold">
                  {familyPeople[0].relationType}:
                </strong>{" "}
                {familyPeople[0].person.fullName}
                {familyPeople.length > 1 && ` (+${familyPeople.length - 1} more)`}
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 shrink-0">
              Family
            </span>
          </div>
        )}

        {/* Mutual Alumni Network indicator */}
        <div className={`pt-2.5 pb-3 border-t flex items-center justify-between ${
          isPatronMember ? "border-slate-800" : "border-slate-100"
        }`}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {connectedPeople.slice(0, 3).map((conn, idx) => (
                <img
                  key={idx}
                  src={conn.avatarUrl}
                  alt={conn.fullName}
                  className={`inline-block h-6 w-6 rounded-full ring-2 object-cover ${
                    isPatronMember ? "ring-slate-800" : "ring-white"
                  }`}
                  title={conn.fullName}
                />
              ))}
            </div>
            <span className={`text-[11px] font-medium ${
              isPatronMember ? "text-slate-300" : "text-slate-500"
            }`}>
              {connectionsCount > 0
                ? `${connectionsCount} Alumni Connection${connectionsCount > 1 ? "s" : ""}`
                : "No connections yet"}
            </span>
          </div>

          {isSelf ? (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
              isPatronMember
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}>
              You (स्वयं)
            </span>
          ) : (
            <button
              onClick={handleConnectClick}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
                isConnected
                  ? isPatronMember
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                  : currentAlumniId
                  ? isPatronMember
                    ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                    : "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                  : isPatronMember
                  ? "bg-slate-800 text-slate-100 border border-slate-600 hover:bg-amber-400 hover:text-slate-950"
                  : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-[#0F172A] hover:text-white"
              }`}
              title={
                !currentAlumniId
                  ? "कनेक्ट करने के लिए कृपया पहले लॉगिन करें"
                  : isConnected
                  ? "क्लिक करके कनेक्शन हटाएं (Disconnect)"
                  : "अपने बैचमेट से कनेक्ट करें"
              }
            >
              <Users2 className="w-3 h-3" />
              <span>
                {isConnected
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
      <div className={`pt-3 border-t flex items-center justify-between ${
        isPatronMember ? "border-slate-800" : isLifeMember ? "border-amber-300/70" : "border-[#C5A059]/20"
      }`}>
        <span className={`text-[10px] font-mono ${
          isPatronMember ? "text-slate-300 font-semibold" : isLifeMember ? "text-amber-950 font-bold" : "text-slate-400"
        }`}>
          ID: {alumni.membershipId}
        </span>

        <div className="flex items-center gap-1.5">
          {!isSelf && alumni.whatsappNumber && (
            currentAlumniId ? (
              <a
                href={`https://wa.me/${alumni.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-lg transition-colors ${
                  isPatronMember
                    ? "bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
                title="Connect on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/login?redirect=/directory");
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isPatronMember
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    : "bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-800"
                }`}
                title="लॉगिन करें WhatsApp से संपर्क करने हेतु (Login to message on WhatsApp)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )
          )}
          <button
            type="button"
            onClick={handleShare}
            className={`p-1.5 rounded-lg transition-colors text-xs ${
              isPatronMember
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                : "bg-slate-50 text-slate-600 hover:bg-[#F3ECE2]"
            }`}
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <span className={`text-xs font-semibold ml-1 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${
            isPatronMember ? "text-amber-300 group-hover:text-amber-200" : "text-[#2D5A43]"
          }`}>
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
