"use client";

import React, { useState } from "react";
import DigitalIdCard from "@/components/Membership/DigitalIdCard";
import { MOCK_ALUMNI } from "@/lib/mockData";
import { AlumniProfile } from "@/types";
import {
  CreditCard,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  Check,
  HelpCircle
} from "lucide-react";

export default function MembershipPage() {
  // Allow user to toggle preview of different sample alumni cards
  const [activeAlumni, setActiveAlumni] = useState<AlumniProfile>(MOCK_ALUMNI[0]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Branding */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>डिजिटल पहचान पत्र एवं सदस्यता</span>
            <span>•</span>
            <span>Official Credentials</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Digital Membership & Identity Card
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Every verified member of the Rishikul Snatak Evam Snatkottar Association receives a cryptographically verifiable digital smart card with official QR validation.
          </p>
        </div>

        {/* Top Interactive Demo Switcher */}
        <div className="bg-white rounded-2xl p-4 border border-[#C5A059]/30 mb-10 max-w-xl mx-auto shadow-sm">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
            Interactive Preview: Select Alumni Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MOCK_ALUMNI.slice(0, 3).map((alumnus) => (
              <button
                key={alumnus.id}
                onClick={() => setActiveAlumni(alumnus)}
                className={`p-2 rounded-xl text-xs font-semibold text-center transition-all truncate ${
                  activeAlumni.id === alumnus.id
                    ? "bg-[#0F172A] text-[#C5A059] shadow-sm"
                    : "bg-[#FAF7F2] text-slate-700 hover:bg-slate-100"
                }`}
              >
                {alumnus.fullName.split(" ")[1] || alumnus.fullName} ({alumnus.batchYear})
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Digital ID Card Display & Privileges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Interactive Digital Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full">
              <DigitalIdCard alumni={activeAlumni} />
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              💡 Tap or click the card to interact. You can export a high-resolution PNG for your mobile wallet.
            </p>
          </div>

          {/* Right Column: Verification & Security Features */}
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

            {/* Verification Status Card */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Need an official physical laminate card?</strong> Physical membership cards are issued during the Annual Reunion at the Haridwar campus or dispatched via speed post on request to the secretariat.
              </div>
            </div>
          </div>
        </div>

        {/* Membership Tiers Comparison */}
        <div className="mt-12 text-center">
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-8">
            Association Membership Tiers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Tier 1: Annual */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tier 1</span>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mt-1">Annual Member</h3>
                <div className="text-xl font-bold text-[#0F172A] my-3">₹500 <span className="text-xs font-normal text-slate-500">/ year</span></div>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li>• Digital ID card valid for 1 year</li>
                  <li>• Association newsletter subscription</li>
                  <li>• Access to webinars & CME notifications</li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full py-3 rounded-xl border border-slate-300 text-center text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 block"
              >
                Apply for Annual
              </a>
            </div>

            {/* Tier 2: Life Member */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#2D5A43] shadow-lg relative flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-[#2D5A43] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Common
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">Tier 2</span>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mt-1">Life Member</h3>
                <div className="text-xl font-bold text-[#0F172A] my-3">₹3,100 <span className="text-xs font-normal text-slate-500">/ one-time</span></div>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li>• Permanent Digital ID Card with Lifetime validity</li>
                  <li>• Full voting and election candidacy rights</li>
                  <li>• Verified green badge in Alumni Directory</li>
                  <li>• Subsidized reunion registration fee</li>
                  <li>• Access to Alumni Welfare emergency fund</li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full py-3 rounded-xl bg-[#2D5A43] text-white text-center text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors block"
              >
                Become Life Member
              </a>
            </div>

            {/* Tier 3: Patron Member */}
            <div className="bg-[#0F172A] text-white rounded-3xl p-6 border-2 border-[#C5A059] shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Tier 3</span>
                <h3 className="font-serif-heading text-2xl font-bold text-white mt-1">Patron Member</h3>
                <div className="text-xl font-bold text-[#C5A059] my-3">₹11,000 <span className="text-xs font-normal text-slate-400">/ one-time</span></div>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  <li>• Golden Digital Card & VIP citation plaque</li>
                  <li>• VIP guest seating at all Rishikul conclaves</li>
                  <li>• Permanent recognition on Donors' Wall at campus</li>
                  <li>• Advisory seat on Association planning committee</li>
                  <li>• 100% complimentary entry to all CME events</li>
                </ul>
              </div>
              <a
                href="/register"
                className="w-full py-3 rounded-xl bg-[#C5A059] text-[#0F172A] text-center text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors block font-bold"
              >
                Join as Patron
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
