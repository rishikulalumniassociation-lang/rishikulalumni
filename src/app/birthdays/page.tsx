"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Cake, Sparkles, Gift, MessageCircle, Calendar, Users, HeartHandshake, Lock, Crown, ChevronRight } from "lucide-react";
import { getAlumniList, getLoggedInAlumni, isAdminAuthenticated } from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function BirthdaysPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [wishedIds, setWishedIds] = useState<string[]>([]);

  useEffect(() => {
    const checkAuthAndLoad = () => {
      const user = getLoggedInAlumni();
      const admin = isAdminAuthenticated();
      const isPending = Boolean(user && user.approvalStatus === "pending");
      const authorized = Boolean(admin || (user && !isPending));

      setCurrentUser(user);
      setIsAuthorized(authorized);
      setIsPendingApproval(isPending);
      setIsAuthChecked(true);

      // Exclusively fetch alumni list when authorized — never for public visitors
      if (authorized) {
        getAlumniList().then((list) => setAlumni(list));
      } else {
        setAlumni([]);
      }
    };

    checkAuthAndLoad();

    const handleUpdate = () => {
      checkAuthAndLoad();
    };

    window.addEventListener("alumni_updated", handleUpdate);
    window.addEventListener("user_auth_changed", handleUpdate);
    window.addEventListener("admin_auth_changed", handleUpdate);
    return () => {
      window.removeEventListener("alumni_updated", handleUpdate);
      window.removeEventListener("user_auth_changed", handleUpdate);
      window.removeEventListener("admin_auth_changed", handleUpdate);
    };
  }, []);

  // Compute Today's Month-Day
  const today = new Date();
  const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Current calendar month (1-12) and today's day of the month
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentMonthName = today.toLocaleDateString("en-US", { month: "long" });

  // Filter today's birthdays
  const todaysBirthdays = alumni.filter((a) => {
    if (!a.dateOfBirth) return false;
    const parts = a.dateOfBirth.split("-");
    if (parts.length < 3) return false;
    const mDay = `${parts[1]}-${parts[2]}`;
    return mDay === todayMonthDay;
  });

  // Birthdays this month that are today or upcoming in this current month (excluding past dates before today)
  const thisMonthBirthdays = alumni
    .filter((a) => {
      if (!a.dateOfBirth) return false;
      const parts = a.dateOfBirth.split("-");
      if (parts.length < 3) return false;
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      return m === currentMonth && d >= currentDay;
    })
    .sort((a, b) => {
      const partsA = a.dateOfBirth.split("-");
      const partsB = b.dateOfBirth.split("-");
      const dayA = parseInt(partsA[2], 10);
      const dayB = parseInt(partsB[2], 10);
      return dayA - dayB;
    });

  const handleSendWish = (alumnus: AlumniProfile) => {
    if (!wishedIds.includes(alumnus.id)) {
      setWishedIds([...wishedIds, alumnus.id]);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#C5A059", "#2D5A43", "#DFBE7B"],
        });
      } catch (e) {}
    }
  };

  const getBatchText = (a: AlumniProfile) => {
    if (a.ugBatchYear && a.pgBatchYear) return `UG: ${a.ugBatchYear} | PG: ${a.pgBatchYear}`;
    if (a.ugBatchYear) return `UG Batch: ${a.ugBatchYear}`;
    if (a.pgBatchYear) return `PG Batch: ${a.pgBatchYear}`;
    return `Batch: ${a.batchYear || ""}`;
  };

  // 1. Loading state while checking local session auth
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">सुरक्षा जांच की जा रही है...</span>
        </div>
      </div>
    );
  }

  // 2. Member Authorization Gate: Protect alumni birthdays from public viewing
  if (!isAuthorized) {
    if (isPendingApproval && currentUser) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                पंजीकरण सत्यापन प्रक्रियाधीन • Verification Pending
              </span>

              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
                खाता अनुमोदन की प्रतीक्षा है
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                नमस्ते <strong className="text-[#0F172A]">{currentUser.fullName}</strong> जी! आपका ऋषिकुल पूर्व छात्र पंजीकरण प्राप्त हो चुका है। पूर्व छात्रों के जन्मदिवस व संपर्क सूत्रों की सुरक्षा हेतु एक्सेस व्यवस्थापक (Admin) द्वारा अनुमोदन के उपरांत ही सक्रिय होता है।
              </p>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-left text-xs text-slate-600 mb-6 space-y-1.5">
                <p><strong>यूज़रनेम:</strong> {currentUser.username}</p>
                <p><strong>मोबाइल:</strong> {currentUser.mobile}</p>
                <p><strong>बैच:</strong> {currentUser.ugBatchYear ? `UG ${currentUser.ugBatchYear}` : ""} {currentUser.pgBatchYear ? `PG ${currentUser.pgBatchYear}` : ""}</p>
                <p className="text-amber-800 font-medium pt-1">अनुमोदन सामान्यतः 24-48 घंटों के भीतर पूर्ण हो जाता है।</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/profile"
                  className="px-6 py-3 rounded-xl bg-[#0F172A] text-white hover:bg-[#2D5A43] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  मेरी प्रोफ़ाइल देखें
                </Link>
                <Link
                  href="/about-association"
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  संस्था से संपर्क करें
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Public / Unauthenticated Guest screen
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#C5A059]/40 shadow-xl relative overflow-hidden text-center">
            {/* Heritage Lock Badge */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#2D5A43] text-[#C5A059] flex items-center justify-center mx-auto mb-6 border-2 border-[#C5A059] shadow-lg">
              <Cake className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider mb-4">
              <span>🔒 केवल सत्यापित सदस्यों के लिए • Members Only Access</span>
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
              ऋषिकुल एल्युमनाई जन्मदिन रडार
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
              गोपनीयता, डेटा सुरक्षा एवं हमारे पूर्व छात्रों की व्यक्तिगत जानकारी की रक्षा हेतु जन्मदिन उत्सव, सहपाठियों की सूची एवं शुभकामनाएं भेजने की सुविधा केवल <strong>सत्यापित लॉग-इन सदस्यों</strong> के लिए ही उपलब्ध है।
            </p>

            {/* Privacy highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">आज के जन्मदिवस</span>
                  <span className="text-slate-500 text-[11px]">सहपाठियों को मंगलकामनाएं प्रेषित करें</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#2D5A43] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">इस माह के सभी जन्मदिन</span>
                  <span className="text-slate-500 text-[11px]">माहवार आगामी जन्मदिन सूची</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">WhatsApp बधाई संदेश</span>
                  <span className="text-slate-500 text-[11px]">एक क्लिक में सीधे शुभकामनाएं भेजें</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0F172A] block">बैचमेट्स व गुरुजन जुड़ाव</span>
                  <span className="text-slate-500 text-[11px]">ऋषिकुल परिवार से निरंतर संपर्क</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/login?redirect=/birthdays"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0F172A] hover:bg-[#2D5A43] text-[#C5A059] hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>सदस्य लॉगिन करें (Member Login)</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C5A059] hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>नया पंजीकरण करें (Register)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-400">
              एसोसिएशन व्यवस्थापक हैं?{" "}
              <Link href="/admin/login" className="text-[#2D5A43] font-semibold hover:underline">
                एडमिन लॉगिन यहाँ करें
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <Cake className="w-3.5 h-3.5" />
            <span>जन्मदिन शुभकामनाएं • Birthday Celebrations</span>
          </div>
          <h1 className="font-serif-heading text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight">
            Alumni Birthday Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Stay close to your batchmates! Check whose birthday is today, see upcoming birthdays this month, and send warm wishes and blessings directly.
          </p>
        </div>

        {/* SECTION 1: TODAY'S BIRTHDAYS */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Today's Birthday Celebrations ({todaysBirthdays.length})
            </h2>
          </div>

          {todaysBirthdays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todaysBirthdays.map((alumnus) => {
                const hasWished = wishedIds.includes(alumnus.id);

                return (
                  <div
                    key={alumnus.id}
                    className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059] shadow-xl flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={alumnus.avatarUrl}
                            alt={alumnus.fullName}
                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#C5A059] shadow-md"
                          />
                          <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#0F172A] text-white shadow-md">
                            🎂
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] block">
                            Today's Birthday!
                          </span>
                          <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#0F172A]">
                            {alumnus.fullName}
                          </h3>
                          <p className="text-xs text-[#2D5A43] font-semibold">
                            {getBatchText(alumnus)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {alumnus.workplace}, {alumnus.city}
                          </p>
                        </div>
                      </div>

                      {alumnus.membershipTier === "Life Member" ? (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-500 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-xs border border-amber-300">
                          <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
                          Life Member
                        </span>
                      ) : alumnus.membershipTier === "Patron Member" ? (
                        <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] font-extrabold flex items-center gap-1 shadow-xs border border-[#C5A059]">
                          <Crown className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
                          Patron Member
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#2D5A43] text-white text-[11px] font-bold">
                          {alumnus.membershipTier}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#C5A059]/30 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleSendWish(alumnus)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                          hasWished
                            ? "bg-amber-200 text-amber-950 cursor-default"
                            : "bg-[#0F172A] text-white hover:bg-[#2D5A43]"
                        }`}
                      >
                        <Gift className="w-4 h-4 text-[#C5A059]" />
                        <span>{hasWished ? "Wished! 🎉" : "Send Birthday Blessings"}</span>
                      </button>

                      {alumnus.whatsappNumber && currentUser && alumnus.id !== currentUser.id && (currentUser.connectedAlumniIds || []).includes(alumnus.id) && (
                        <a
                          href={`https://wa.me/${alumnus.whatsappNumber}?text=${encodeURIComponent(
                            `Happy Birthday, ${alumnus.fullName}! Warm wishes and blessings from your fellow Rishikul alumnus.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold"
                          title="Wish on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">WhatsApp Wish</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-slate-500 max-w-md">
              <Cake className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
              No alumni birthdays recorded for today. See the upcoming birthdays list below!
            </div>
          )}
        </div>

        {/* SECTION 2: THIS MONTH'S BIRTHDAYS */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-[#2D5A43]" />
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Birthday This Month ({thisMonthBirthdays.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {thisMonthBirthdays.map((alumnus) => {
              const formattedDate = (() => {
                if (!alumnus.dateOfBirth) return "";
                const parts = alumnus.dateOfBirth.split("-");
                if (parts.length < 3) return "";
                const d = new Date(2000, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              })();

              return (
                <div
                  key={alumnus.id}
                  className="bg-white rounded-2xl p-5 border border-[#C5A059]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={alumnus.avatarUrl}
                      alt={alumnus.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                        Birthday: {formattedDate}
                      </span>
                      <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                        {alumnus.fullName}
                      </h4>
                      <p className="text-xs text-[#2D5A43]">
                        {getBatchText(alumnus)}
                      </p>
                      <p className="text-[11px] text-slate-500">{alumnus.city}, {alumnus.state}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {alumnus.membershipTier === "Life Member" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        <Crown className="w-2.5 h-2.5 text-amber-700 fill-amber-700" />
                        Life Member
                      </span>
                    ) : alumnus.membershipTier === "Patron Member" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-400">
                        <Crown className="w-2.5 h-2.5 text-amber-900 fill-amber-900" />
                        Patron
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[10px]">
                        {alumnus.membershipTier}
                      </span>
                    )}
                    <Link
                      href={`/directory?id=${alumnus.id}`}
                      className="text-[#2D5A43] font-semibold hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
