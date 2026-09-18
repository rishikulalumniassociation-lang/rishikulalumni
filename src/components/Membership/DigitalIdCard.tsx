"use client";

import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { Download, Share2, ShieldCheck, Award, Sparkles, RefreshCw, GraduationCap, Crown } from "lucide-react";
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

  // Compute batch labels with admission and passout years
  const ugEnd = alumni.ugPassoutYear || (alumni.ugBatchYear ? alumni.ugBatchYear + 5 : null);
  const pgEnd = alumni.pgPassoutYear || (alumni.pgBatchYear ? alumni.pgBatchYear + 3 : null);

  const batchLabel = [
    alumni.ugBatchYear ? `UG: ${alumni.ugBatchYear}${ugEnd ? `-${ugEnd}` : ""}` : null,
    alumni.pgBatchYear ? `PG: ${alumni.pgBatchYear}${pgEnd ? `-${pgEnd}` : ""}` : null,
  ]
    .filter(Boolean)
    .join(" | ") || `Batch ${alumni.batchYear || ""}`;

    const isLifeMember = alumni.membershipTier === "Life Member";
    const isPatronMember = alumni.membershipTier === "Patron Member";

    return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Interactive Card Flip Preview */}
      <div className="relative w-full aspect-[1.586/1] mb-6 perspective">
        <div
          ref={cardRef}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-full rounded-2xl p-5 sm:p-6 shadow-2xl transition-transform duration-500 cursor-pointer select-none relative overflow-hidden flex flex-col justify-between border-3 ${
            isPatronMember
              ? "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1D] border-[#E5C158] text-white shadow-[0_15px_40px_rgba(15,23,42,0.6)]"
              : isLifeMember
              ? "bg-gradient-to-br from-[#042017] via-[#0B3524] to-[#031811] border-[#E5C158] text-white shadow-[0_18px_45px_rgba(197,160,89,0.4)]"
              : "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-slate-600 text-white shadow-xl"
          }`}
        >
          {/* Top Gold Shimmer Stripe for Life Member & Patron */}
          {(isLifeMember || isPatronMember) && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-[#E5C158] to-amber-500 shadow-sm" />
          )}

          {/* Subtle Background Ayurvedic Mandala & Watermark */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-[12px] border-[#C5A059]/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-[6px] border-[#C5A059]/15 pointer-events-none" />
          {isLifeMember && (
            <div className="absolute right-4 bottom-14 opacity-10 pointer-events-none select-none text-amber-300">
              <Crown className="w-32 h-32" />
            </div>
          )}

          {/* Card Top Header */}
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
                  ऋषिकुल संगम
                </h4>
                <p className="text-[8.5px] font-semibold text-amber-200 leading-tight">
                  ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन
                </p>
                <p className="text-[7.5px] font-mono text-[#C5A059]">
                  पंजी. संख्या: UK06803112023012256
                </p>
                <p className="text-[7.5px] text-slate-300">
                  Verified Alumni • Govt Ayurvedic College, Haridwar
                </p>
              </div>
            </div>

            <div className="text-right">
              {isLifeMember ? (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-400 via-[#E5C158] to-amber-500 text-slate-950 shadow-md border border-amber-200">
                    <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
                    Paid Life Member
                  </span>
                  <span className="text-[8px] font-bold text-amber-300 tracking-wider mt-0.5 uppercase">
                    स्थायी आजीवन सदस्य
                  </span>
                  <p className="text-[9px] font-mono text-amber-200 font-bold mt-0.5">
                    {alumni.membershipId}
                  </p>
                </div>
              ) : isPatronMember ? (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 shadow-md border border-white/40">
                    <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
                    Patron Member
                  </span>
                  <span className="text-[8px] font-bold text-amber-200 tracking-wider mt-0.5 uppercase">
                    संरक्षक सदस्य
                  </span>
                  <p className="text-[9px] font-mono text-slate-300 font-bold mt-0.5">
                    {alumni.membershipId}
                  </p>
                </div>
              ) : (
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-700 text-slate-200 border border-slate-600 shadow-sm">
                    {alumni.membershipTier}
                  </span>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">
                    {alumni.membershipId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card Middle: Photo, Full Name (up to 2 lines), Degree, Batch */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-2">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md relative ${
              isLifeMember
                ? "border-2 border-[#E5C158] ring-2 ring-amber-400/50 bg-amber-950/40"
                : isPatronMember
                ? "border-2 border-[#C5A059] ring-2 ring-amber-300/40 bg-slate-900"
                : "border-2 border-[#C5A059] bg-slate-800"
            }`}>
              <img
                src={alumni.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"}
                alt={alumni.fullName}
                className="w-full h-full object-cover"
              />
              {isLifeMember && (
                <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-sm" title="Paid Life Member">
                  <Crown className="w-2.5 h-2.5 fill-slate-950" />
                </div>
              )}
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
              {alumni.rishikulEducation !== "UG" && alumni.specialization && alumni.specialization !== "General Ayurvedic Practice" && (
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
                {isLifeMember ? (
                  <span className="text-amber-300 font-semibold">
                    Permanent<br />Life Credential
                  </span>
                ) : isPatronMember ? (
                  <span className="text-amber-200 font-semibold">
                    Patron<br />Life Credential
                  </span>
                ) : (
                  <>Official<br />Digital Credential</>
                )}
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
