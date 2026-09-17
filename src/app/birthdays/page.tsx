"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Cake, Sparkles, Gift, MessageCircle, Calendar, Users, HeartHandshake, Lock } from "lucide-react";
import { getAlumniList, getLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function BirthdaysPage() {
  const router = useRouter();
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [wishedIds, setWishedIds] = useState<string[]>([]);

  useEffect(() => {
    getAlumniList().then((list) => setAlumni(list));
    setCurrentUser(getLoggedInAlumni());
  }, []);

  // Compute Today's Month-Day
  const today = new Date();
  const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Filter today's birthdays
  const todaysBirthdays = alumni.filter((a) => {
    if (!a.dateOfBirth) return false;
    const parts = a.dateOfBirth.split("-");
    if (parts.length < 3) return false;
    const mDay = `${parts[1]}-${parts[2]}`;
    return mDay === todayMonthDay;
  });

  // Upcoming in next 7 days
  const upcomingBirthdays = alumni.filter((a) => {
    if (!a.dateOfBirth) return false;
    const parts = a.dateOfBirth.split("-");
    if (parts.length < 3) return false;
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);

    const bdayThisYear = new Date(today.getFullYear(), m, d);
    const diffTime = bdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 && diffDays <= 7;
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
            Stay close to your batchmates! Check whose birthday is today, see upcoming birthdays in the coming week, and send warm wishes and blessings directly.
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

                      <span className="px-3 py-1 rounded-full bg-[#2D5A43] text-white text-[11px] font-bold">
                        {alumnus.membershipTier}
                      </span>
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

                      {alumnus.whatsappNumber && (!currentUser || alumnus.id !== currentUser.id) && (
                        currentUser ? (
                          <a
                            href={`https://wa.me/${alumnus.whatsappNumber}?text=${encodeURIComponent(
                              `Happy Birthday, Dr. ${alumnus.fullName}! Warm wishes and blessings from your fellow Rishikul alumnus.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold"
                            title="Wish on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp Wish</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => router.push("/login?redirect=/birthdays")}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-850 transition-colors shadow-sm flex items-center gap-1 text-xs font-bold"
                            title="Login to Wish on WhatsApp"
                          >
                            <Lock className="w-4 h-4 text-amber-700" />
                            <span className="hidden sm:inline">Login to Wish</span>
                          </button>
                        )
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

        {/* SECTION 2: UPCOMING BIRTHDAYS */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-[#2D5A43]" />
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Upcoming Birthdays in Next 7 Days ({upcomingBirthdays.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBirthdays.map((alumnus) => {
              const bdayDate = alumnus.dateOfBirth ? new Date(alumnus.dateOfBirth) : null;
              const formattedDate = bdayDate
                ? bdayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "";

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
                        Upcoming: {formattedDate}
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
                    <span className="text-slate-400 font-mono text-[10px]">
                      {alumnus.membershipTier}
                    </span>
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
