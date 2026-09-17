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
  User,
  Lock,
  LogIn,
  AlertCircle
} from "lucide-react";

export default function MembershipPage() {
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = getLoggedInAlumni();
    if (loggedIn) {
      // Re-fetch fresh profile from list
      const list = getAlumniList();
      const freshUser = list.find((a) => a.id === loggedIn.id) || loggedIn;
      setCurrentUser(freshUser);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Emblem */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] overflow-hidden flex items-center justify-center mx-auto mb-3 shadow-md bg-white">
            <img
              src="/images/rishikul-sangam-logo.jpg"
              alt="RISHIKUL SANGAM"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-1">
            <span>RISHIKUL SANGAM</span>
            <span>•</span>
            <span>Official Digital Smart ID</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            Alumni Digital Identity Card
          </h1>
          <p className="text-xs font-semibold text-[#2D5A43] mt-1">
            एक ऋषिकुल • अनेक पीढ़ियाँ • एक परिवार
          </p>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            यह पहचान पत्र केवल पंजीकृत एवं सत्यापित पुरातन छात्रों (Verified Alumni) को उनके व्यक्तिगत लॉगिन के उपरांत ही उपलब्ध होता है।
          </p>
        </div>

        {/* If user is NOT logged in: Show Login / Register Prompt */}
        {!currentUser ? (
          <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#C5A059]/40 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-2">
              लॉगिन आवश्यक है (Login Required)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              डिजिटल पहचान पत्र (Digital Smart ID Card) आपकी व्यक्तिगत व आधिकारिक पहचान है। अपना आईडी कार्ड देखने और डाउनलोड करने के लिए कृपया अपने एल्युमनाई खाते से लॉगिन करें।
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link
                href="/login?redirect=/membership"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#2D5A43] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4 text-[#C5A059]" />
                <span>Login to View My ID Card</span>
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <UserCheck className="w-4 h-4 text-[#2D5A43]" />
                <span>New Registration</span>
              </Link>
            </div>
          </div>
        ) : (
          /* When Logged In: Strictly display their OWN ID Card */
          <div>
            {!currentUser.isVerified && (
              <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>सत्यापन प्रक्रियाधीन (Under Verification):</strong> आपकी सदस्यता का आवेदन अभी एसोसिएशन एडमिन द्वारा समीक्षा में है। एडमिन द्वारा अनुमोदन (Approval) के पश्चात आपका स्थायी सदस्यता क्रमांक (Membership ID) सक्रिय हो जाएगा।
                </div>
              </div>
            )}

            {/* Main Grid: Card & Privileges for Current User */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full">
                  <DigitalIdCard alumni={currentUser} />
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
    )}
  </div>
</div>
  );
}
