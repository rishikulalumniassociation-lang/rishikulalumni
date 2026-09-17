"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import EditorialHero from "@/components/Hero/EditorialHero";
import FounderHeritageSection from "@/components/Hero/FounderHeritageSection";
import AlumniCard from "@/components/Directory/AlumniCard";
import { EXECUTIVE_MEMBERS } from "@/lib/mockData";
import { getAlumniList, getLifetimeAchievers, getShradhanjaliList, getEvents, getCommunityPosts } from "@/lib/store";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Sparkles,
  Cake,
  Heart,
  Flower,
  Star,
  Users2,
  ChevronRight,
  Flag,
  Camera,
  Play,
  FileText
} from "lucide-react";
import { AlumniProfile, LifetimeAchiever, ShradhanjaliRecord, AssociationEvent, CommunityPost } from "@/types";

export default function HomePage() {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [achievers, setAchievers] = useState<LifetimeAchiever[]>([]);
  const [shradhanjali, setShradhanjali] = useState<ShradhanjaliRecord[]>([]);
  const [eventsList, setEventsList] = useState<AssociationEvent[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    Promise.all([
      getAlumniList(),
      getLifetimeAchievers(),
      getShradhanjaliList(),
      getEvents(),
      getCommunityPosts(),
    ]).then(([alumni, achieversData, shradhanjaliData, eventsData, postsData]) => {
      setAlumniList(alumni);
      setAchievers(achieversData);
      setShradhanjali(shradhanjaliData);
      setEventsList(eventsData);
      setCommunityPosts(postsData);
    });
  }, []);

  // Compute Today's Birthday count
  const today = new Date();
  const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todaysBirthdays = alumniList.filter((a) => {
    if (!a.dateOfBirth) return false;
    const parts = a.dateOfBirth.split("-");
    return parts.length >= 3 && `${parts[1]}-${parts[2]}` === todayMonthDay;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Immersive Editorial Hero */}
      <EditorialHero />

      {/* 2. Urgent Community Notification Banner: Birthday Radar & Memorials */}
      <div className="bg-[#FAF7F2] border-b border-[#C5A059]/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-[#0F172A] flex items-center gap-1">
              <Cake className="w-3.5 h-3.5 text-[#C5A059]" />
              Today's Birthday Radar:
            </span>
            <span className="text-slate-600">
              {todaysBirthdays.length > 0
                ? `${todaysBirthdays.map((b) => b.fullName).join(", ")} celebrating today!`
                : "Check upcoming alumni birthdays for this week."}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/community"
              className="font-bold text-[#C5A059] bg-[#0F172A] px-2.5 py-1 rounded-full hover:bg-[#2D5A43] hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ऋषिकुल गैलरी (Gallery)</span>
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link
              href="/birthdays"
              className="font-bold text-[#2D5A43] hover:underline flex items-center gap-1"
            >
              <span>Wish Batchmates</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/shradhanjali"
              className="text-slate-600 hover:text-[#0F172A] flex items-center gap-1 font-medium"
            >
              <Flower className="w-3 h-3 text-[#C5A059]" />
              <span>Shradhanjali Memorials</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. FOUNDER & MARTYR STUDENT HERITAGE PILLARS (Malaviya Ji & Shaheed Jagdish Vats) */}
      <FounderHeritageSection />

      {/* 4. LIFETIME ACHIEVERS (Admin Updated Section) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                National Laurels & Distinguished Veterans
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
                Lifetime Achievers of Rishikul
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                Honoring our alumni who have received Padma awards, founded major hospital chains, authored pharmacopeias, or shaped global AYUSH healthcare.
              </p>
            </div>

            <Link
              href="/achievers"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#2D5A43] transition-colors"
            >
              <span>View All Lifetime Achievers</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>

          {achievers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievers.slice(0, 3).map((achiever) => (
                <div
                  key={achiever.id}
                  className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={achiever.photoUrl}
                        alt={achiever.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C5A059] text-[#0F172A]">
                        Batch {achiever.batchYear}
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-serif-heading text-xl font-bold text-white leading-tight">
                          {achiever.name}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-semibold text-[#2D5A43] block mb-2">
                        {achiever.title}
                      </span>
                      <p className="text-xs text-slate-600 line-clamp-3 italic mb-3">
                        "{achiever.citation}"
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">{achiever.currentRole}</span>
                    <span className="font-bold text-[#0F172A] ml-2">{achiever.degree}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#C5A059]/30 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-2">
                विशिष्ट विभूतियाँ एवं संरक्षक मंडल
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                ऋषिकुल के जिन पूर्व छात्रों ने राष्ट्रीय स्तर पर विशिष्ट कीर्तिमान स्थापित किए हैं अथवा जो एसोसिएशन के संरक्षक मंडल (Patrons) से जुड़े हैं, उन्हें सम्मानित करने हेतु यह विशेष खंड समर्पित है।
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/achievers"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  <span>Hall of Fame & Patrons देखें</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-[#C5A059]/40 text-[#0F172A] text-xs font-semibold hover:bg-amber-50/50 transition-colors"
                >
                  <span>संरक्षक सदस्यता विवरण</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. TODAY'S & UPCOMING BIRTHDAYS TEASER SECTION */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059] flex items-center gap-1.5">
                <Cake className="w-3.5 h-3.5" />
                Alumni Birthday Radar
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-1">
                Celebrating Our Batchmates Today
              </h2>
            </div>
            <Link
              href="/birthdays"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline"
            >
              <span>View All Birthdays & Upcoming Week</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {alumniList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.slice(0, 3).map((alumnus) => (
                <div
                  key={alumnus.id}
                  className="bg-slate-900/80 rounded-2xl p-5 border border-[#C5A059]/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={alumnus.avatarUrl}
                      alt={alumnus.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-[#C5A059]"
                    />
                    <div>
                      <h4 className="font-serif-heading text-lg font-bold text-white">
                        {alumnus.fullName}
                      </h4>
                      <p className="text-xs text-amber-200">
                        {alumnus.ugBatchYear ? `UG:${alumnus.ugBatchYear} ` : ""}{alumnus.pgBatchYear ? `PG:${alumnus.pgBatchYear}` : ""} • {alumnus.city}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        DOB: {alumnus.dateOfBirth || "Recorded"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/birthdays"
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#0F172A] transition-colors"
                    title="Wish Happy Birthday"
                  >
                    <Cake className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto">
              <Cake className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
              <p className="text-xs text-slate-300">
                Newly registered alumni dates of birth will appear here on their birthdays.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. SHRADHANJALI SECTION (Admin Updated Memorial including Amar Shaheed Jagdish Vats) */}
      <section className="py-16 md:py-20 bg-[#FAF7F2] border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <Flower className="w-3.5 h-3.5 text-[#C5A059]" />
                श्रद्धांजलि एवं स्मृति शेष
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
                Shradhanjali: Departed Souls of Rishikul
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                Dedicated memorial page updated by the Association Administration remembering our departed mentors, late batchmates, and martyr Jagdish Vats.
              </p>
            </div>

            <Link
              href="/shradhanjali"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#2D5A43] transition-colors"
            >
              <span>Visit Shradhanjali Hall & Offer Flowers</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shradhanjali.slice(0, 2).map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#C5A059] transition-colors"
              >
                <img
                  src={record.photoUrl}
                  alt={record.name}
                  className="w-20 h-20 rounded-2xl object-cover grayscale border border-slate-300 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Demise Date: {record.dateOfDemise} • Batch {record.batchYear}
                  </span>
                  <h4 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    {record.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 italic">
                    "{record.tribute}"
                  </p>
                  <Link
                    href="/shradhanjali"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D5A43] mt-3 hover:underline"
                  >
                    <Flower className="w-3 h-3 text-[#C5A059]" />
                    <span>Offer Flowers & View Condolences ({record.condolencesCount})</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RISHIKUL COMMUNITY SHOWCASE & GALLERY (Cloudinary Powered) */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#FAF7F2] to-white border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                स्मृति पटल एवं रचनात्मक संगम
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
                Rishikul Community Gallery & Showcase
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                Alumni memories, historical photographs, clinical research, Ayurvedic poetry, artwork, and articles shared directly by our verified community.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/community?action=new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors shadow-sm"
              >
                <span>+ Share Post / अपलोड करें</span>
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors"
              >
                <span>Explore Gallery ({communityPosts.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </Link>
            </div>
          </div>

          {communityPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityPosts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/community?post=${post.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    {post.fileUrl && (post.contentType === "photo" || post.contentType === "artwork") ? (
                      <img
                        src={post.thumbnailUrl || post.fileUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : post.fileUrl && post.contentType === "video" ? (
                      <div className="relative w-full h-full">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <Play className="w-10 h-10 text-[#C5A059]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#0F172A] flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FAF7F2] to-amber-100/50 flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-10 h-10 text-[#C5A059] mb-2" />
                        <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">
                          {post.contentType}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {post.category || post.contentType}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-heading text-base font-bold text-[#0F172A] group-hover:text-[#2D5A43] transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      {post.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-light">
                          {post.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium truncate max-w-[120px]">
                        {post.authorName}
                      </span>
                      {post.authorBatch && (
                        <span className="text-[#C5A059] font-bold text-[10px]">
                          Batch {post.authorBatch}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#C5A059]/30 text-center max-w-xl mx-auto">
              <Camera className="w-10 h-10 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-1">
                ऋषिकुल गैलरी में अपनी यादें व रचनाएं साझा करें
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                पुरातन तस्वीरें, कॉलेज जीवन की यादें, शोध पत्र, कविताएं एवं लेख सीधे क्लाउडिनरी स्टोरेज पर अपलोड करें।
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/community?action=new"
                  className="px-5 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#234734] transition-colors"
                >
                  Share with Rishikul (+ पोस्ट करें)
                </Link>
                <Link
                  href="/community"
                  className="px-5 py-2 rounded-xl bg-white border border-[#C5A059] text-[#0F172A] text-xs font-bold hover:bg-amber-50"
                >
                  गैलरी देखें
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Upcoming Reunions & Conclaves */}
      <section className="py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059]">
                Gatherings & Conferences
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-1">
                Upcoming Alumni Conclaves
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {eventsList.length === 0 ? (
              <div className="col-span-full bg-slate-900/60 rounded-3xl p-8 border border-slate-800 text-center space-y-3">
                <Calendar className="w-10 h-10 text-[#C5A059] mx-auto opacity-70" />
                <h3 className="font-serif-heading text-lg font-bold text-white">
                  वर्तमान में कोई आगामी महासम्मेलन निर्धारित नहीं है
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  आगामी आयोजनों की सूचना जल्द ही यहाँ प्रकाशित की जाएगी। नया आयोजन देखने या जोड़ने हेतु इवेंट्स पेज पर जाएं।
                </p>
                <div className="pt-2">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#234734] transition-colors"
                  >
                    <span>इवेंट्स पेज देखें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              eventsList.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5A43] text-white">
                        {event.eventType}
                      </span>
                      <span className="text-xs font-medium text-[#C5A059]">
                        {event.attendeesCount}+ Registered
                      </span>
                    </div>

                    <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4 font-light">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Fee: <strong className="text-white">{event.registrationFee}</strong>
                    </span>
                    <Link
                      href="/events"
                      className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors"
                    >
                      RSVP / Register
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="py-16 bg-[#FAF7F2] text-[#0F172A] border-t border-[#C5A059]/30 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A]">
            Are You a Graduate of Rishikul?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
            Submit your membership application to join the official directory. Stay notified of batchmate birthdays, receive your verified digital smart card, and stay connected with your alma mater.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-lg"
            >
              Join the Alumni Association
            </Link>
            <Link
              href="/directory"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-slate-300 text-slate-800 font-semibold text-xs uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
            >
              Search Batchmates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
