"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DigitalIdCard from "@/components/Membership/DigitalIdCard";
import { getAlumniList, getLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";
import {
  CreditCard,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  Check,
  UserCheck,
  HelpCircle,
  User
} from "lucide-react";

const SAMPLE_FALLBACK_CARD: AlumniProfile = {
  id: "sample-id",
  fullName: "Dr. Member Name",
  username: "9897100000",
  email: "alumni@rishikul.org",
  mobile: "9897100000",
  whatsappNumber: "9897100000",
  dateOfBirth: "1990-01-01",
  avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop",
  rishikulEducation: "BOTH",
  ugBatchYear: 1995,
  ugDegree: "BAMS",
  pgBatchYear: 2000,
  pgDegree: "MD (Kayachikitsa)",
  specialization: "Kayachikitsa (Internal Medicine)",
  jobType: "Private Practice",
  designation: "Senior Ayurvedic Consultant",
  workplace: "Rishikul Alumni Network",
  city: "Haridwar",
  state: "Uttarakhand",
  country: "India",
  membershipId: "RISHI-LM-SAMPLE",
  membershipTier: "Life Member",
  isVerified: true,
  approvalStatus: "approved",
  joinedDate: "2026-01-01"
};

export default function MembershipPage() {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [activeAlumni, setActiveAlumni] = useState<AlumniProfile>(SAMPLE_FALLBACK_CARD);

  useEffect(() => {
    const list = getAlumniList();
    const current = getLoggedInAlumni();
    setAlumniList(list);
    if (current) {
      setActiveAlumni(current);
    } else if (list.length > 0) {
      setActiveAlumni(list[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>डिजिटल पहचान पत्र एवं सदस्यता</span>
            <span>•</span>
            <span>Official Alumni ID</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Digital Membership & Identity Card
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Every approved and verified member of the Rishikul Snatak Evam Snatkottar Association receives a cryptographically verifiable digital smart card with official QR validation.
          </p>
        </div>

        {/* Member Selector if multiple alumni registered */}
        {alumniList.length > 1 && (
          <div className="bg-white rounded-2xl p-4 border border-[#C5A059]/30 mb-10 max-w-xl mx-auto shadow-sm">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Select Alumni Member:
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {alumniList.slice(0, 5).map((alumnus) => (
                <button
                  key={alumnus.id}
                  onClick={() => setActiveAlumni(alumnus)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-center transition-all truncate ${
                    activeAlumni.id === alumnus.id
                      ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                      : "bg-[#FAF7F2] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {alumnus.fullName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid: Card & Privileges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full">
              <DigitalIdCard alumni={activeAlumni} />
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              💡 Tap or click the card to interact. You can export a high-resolution PNG for your mobile wallet.
            </p>
            <div className="w-full mt-4 flex items-center justify-center">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-[#C5A059] hover:bg-[#2D5A43] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Update My Profile (अपनी प्रोफाइल अपडेट करें)</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-md">
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2D5A43]" />
                Security & Association Privileges
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#2D5A43] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#0F172A]">Tamper-Proof QR Code:</strong> Scanned at CME events and national conferences for instant credentials check.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#2D5A43] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#0F172A]">Lifelong Directory Recognition:</strong> Verified blue checkmark badge in the official alumni roster.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#2D5A43] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#0F172A]">Association Voting Privileges:</strong> Eligible to vote and contest in Executive Committee elections.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#2D5A43] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#0F172A]">Alma Mater Access:</strong> Guest house reservation concessions and library access at Rishikul Campus.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Admin Assignment:</strong> Official membership categories (Non-Paid Member, Life Member, Patron Member) are assigned by the Association Administrator upon approval.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
