"use client";

import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { Download, Share2, ShieldCheck, Award, Sparkles, RefreshCw, GraduationCap } from "lucide-react";
import { AlumniProfile } from "@/types";

interface DigitalIdCardProps {
  alumni: AlumniProfile;
}

export default function DigitalIdCard({ alumni }: DigitalIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?id=${alumni.membershipId}&name=${encodeURIComponent(alumni.fullName)}`;
    QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 140,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [alumni]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Rishikul-Alumni-ID-${alumni.membershipId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download digital ID card:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Compute batch labels
  const batchLabel = [
    alumni.ugBatchYear ? `UG: ${alumni.ugBatchYear}` : null,
    alumni.pgBatchYear ? `PG: ${alumni.pgBatchYear}` : null,
  ]
    .filter(Boolean)
    .join(" | ") || `Batch ${alumni.batchYear || ""}`;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Interactive Card Flip Preview */}
      <div className="relative w-full aspect-[1.586/1] mb-6 perspective">
        <div
          ref={cardRef}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-full rounded-2xl p-5 sm:p-6 shadow-2xl transition-transform duration-500 cursor-pointer select-none relative overflow-hidden flex flex-col justify-between border-2 ${
            alumni.membershipTier === "Patron Member"
              ? "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] border-[#C5A059] text-white"
              : alumni.membershipTier === "Life Member"
              ? "bg-gradient-to-br from-[#0F172A] to-[#162A20] border-[#C5A059]/60 text-white"
              : "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-slate-600 text-white"
          }`}
        >
          {/* Subtle Background Ayurvedic Mandala */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-[12px] border-[#C5A059]/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-[6px] border-[#C5A059]/15 pointer-events-none" />

          {/* Card Top Header: RISHIKUL SANGAM */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border border-[#C5A059] bg-white overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                <img
                  src="/images/rishikul-sangam-logo.jpg"
                  alt="RISHIKUL SANGAM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif-heading text-sm font-bold tracking-tight text-white leading-tight">
                  RISHIKUL SANGAM
                </h4>
                <p className="text-[9px] uppercase tracking-wider text-[#C5A059] font-medium">
                  Official Alumni Network
                </p>
                <p className="text-[8px] text-slate-300">
                  Govt Ayurvedic College, Haridwar
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C5A059] text-[#0F172A] shadow-sm">
                {alumni.membershipTier}
              </span>
              <p className="text-[9px] font-mono text-slate-300 mt-1">
                {alumni.membershipId}
              </p>
            </div>
          </div>

          {/* Card Middle: Photo, Full Name (up to 2 lines), Degree, Batch */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-[#C5A059] flex-shrink-0 bg-slate-800 shadow-md">
              <img
                src={alumni.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"}
                alt={alumni.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-start gap-1">
                <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white leading-tight break-words line-clamp-2">
                  {alumni.fullName}
                </h3>
                {alumni.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                )}
              </div>
              {alumni.fullNameHindi && (
                <p className="text-[11px] text-amber-200/90 font-medium truncate">
                  {alumni.fullNameHindi}
                </p>
              )}
              <p className="text-xs text-amber-200 font-semibold mt-0.5">
                {batchLabel}
              </p>
              {alumni.specialization && (
                <p className="text-[11px] text-slate-300 truncate">
                  {alumni.specialization}
                </p>
              )}
              <p className="text-[10px] text-slate-400 truncate">
                {alumni.workplace}, {alumni.city}
              </p>
            </div>
          </div>

          {/* Card Bottom: QR Verification Code & Issue Date */}
          <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between">
            <div className="text-[9px] text-slate-400">
              <p>Blood Group: <span className="text-white font-semibold">{alumni.bloodGroup || "O+"}</span></p>
              <p>DOB: <span className="text-slate-200 font-medium">{alumni.dateOfBirth}</span></p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 text-right leading-tight">
                Official<br />Digital Credential
              </span>
              {qrDataUrl && (
                <div className="p-1 bg-white rounded-lg shadow-sm">
                  <img
                    src={qrDataUrl}
                    alt="Verification QR"
                    className="w-10 h-10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2D5A43] transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isDownloading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
          ) : (
            <Download className="w-4 h-4 text-[#C5A059]" />
          )}
          <span>{isDownloading ? "Generating..." : "Download Digital ID"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${alumni.fullName} - Rishikul Alumni ID`,
                text: `Official Alumni ID Card for Rishikul Government Ayurvedic College Haridwar.`,
                url: window.location.href,
              });
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert("Card link copied to clipboard!");
            }
          }}
          className="p-3 rounded-xl bg-white border border-[#C5A059]/40 text-[#0F172A] hover:bg-[#FAF7F2] transition-colors shadow-sm"
          title="Share Card"
        >
          <Share2 className="w-4 h-4 text-[#2D5A43]" />
        </button>
      </div>
    </div>
  );
}
