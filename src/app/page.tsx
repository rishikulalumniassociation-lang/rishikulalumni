"use client";

import React, { useState } from "react";
import Link from "next/link";
import EditorialHero from "@/components/Hero/EditorialHero";
import AlumniCard from "@/components/Directory/AlumniCard";
import { MOCK_ALUMNI, MOCK_EVENTS, EXECUTIVE_MEMBERS } from "@/lib/mockData";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Sparkles,
  BookOpen,
  MapPin,
  Heart,
  ChevronRight
} from "lucide-react";
import { AlumniProfile } from "@/types";

export default function HomePage() {
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Immersive Editorial Hero */}
      <EditorialHero />

      {/* 2. Alma Mater Heritage Statement Section */}
      <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#C5A059]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Statement */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#2D5A43] bg-[#2D5A43]/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Rooted in Rishitulyata & Ganga Pavitrata
              </div>

              <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight">
                Where Traditional Wisdom Meets Clinical Rigor Since 1919.
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light">
                Established by visionary patriots and sages in the sacred city of Haridwar, 
                <strong className="font-medium text-[#0F172A]"> Rishikul Government Ayurvedic College</strong> stands as one of India's earliest and most revered bastions of Ayurvedic pedagogy.
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light">
                The <strong className="font-medium text-[#0F172A]">Rishikul Snatak Evam Snatkottar Association</strong> serves as the lifelong guild for every physician, researcher, academician, and surgeon who walked these sacred corridors.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F172A] hover:text-[#2D5A43] border-b-2 border-[#C5A059] pb-1 transition-colors"
                >
                  <span>Explore 100+ Years College History</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D5A43] hover:text-[#0F172A] border-b-2 border-[#2D5A43] pb-1 transition-colors"
                >
                  <span>Membership Privileges & Digital ID</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Heritage Card / Quote */}
            <div className="lg:col-span-5">
              <div className="relative p-8 rounded-3xl bg-white border-2 border-[#C5A059]/30 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF7F2] rounded-bl-full -mr-8 -mt-8 border-b border-l border-[#C5A059]/20" />
                <span className="text-6xl font-serif-heading text-[#C5A059] block -mb-4">“</span>
                <blockquote className="font-serif-heading text-xl sm:text-2xl text-[#0F172A] italic leading-snug mb-6 relative z-10">
                  न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।<br />
                  <span className="text-sm not-italic font-sans text-[#64748B] block mt-2">
                    "Certainly, there is no purifier in this world like sacred wisdom."
                  </span>
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-serif-heading font-bold text-lg">
                    ऋ
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#0F172A]">Rishikul Tradition</h5>
                    <p className="text-[11px] text-[#64748B]">Sanctum of Ayurvedic Healing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Alumni Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059]">
                Distinguished Fraternity
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mt-1">
                Featured Alumni Across the Globe
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                From pioneering super-specialty hospitals to global pharmacopeia boards, explore the stalwarts shaping contemporary Ayurveda.
              </p>
            </div>

            <Link
              href="/directory"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-[#2D5A43] transition-colors"
            >
              <span>Explore All 12,000+ Alumni</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>

          {/* Grid of Alumni Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ALUMNI.slice(0, 3).map((alumni) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                onSelect={(selected) => setSelectedAlumni(selected)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Upcoming Major Events & Golden Jubilee Banner */}
      <section className="py-16 md:py-20 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#C5A059]">
                Gatherings & Conferences
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                Upcoming Association Conclaves
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#C5A059] transition-colors"
            >
              <span>View All Events & CMEs</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {MOCK_EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 flex flex-col justify-between hover:border-[#C5A059] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D5A43] text-white">
                      {event.eventType}
                    </span>
                    <span className="text-xs font-medium text-[#C5A059]">
                      {event.attendeesCount}+ Registered
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors mb-2">
                    {event.title}
                  </h3>
                  {event.titleHindi && (
                    <p className="text-xs text-slate-400 mb-4">{event.titleHindi}</p>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6 font-light">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A059]" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Fee: <strong className="text-white">{event.registrationFee}</strong>
                  </span>
                  <Link
                    href={`/events`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors"
                  >
                    <span>RSVP / Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Association Executive Council Highlights */}
      <section className="py-16 md:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-wider uppercase text-[#2D5A43]">
            Custodians of the Association
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mt-1 mb-4">
            Executive Committee & Leadership
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl mx-auto mb-12">
            Elected representatives guiding the welfare, legal standing, academic growth, and philanthropic mission of the alumni community.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {EXECUTIVE_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-5 border border-[#C5A059]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border-2 border-[#C5A059]/40 bg-slate-100">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif-heading text-lg font-bold text-[#0F172A]">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#2D5A43] mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3">{member.batch} • {member.location}</p>
                  {member.message && (
                    <p className="text-xs text-slate-600 line-clamp-3 italic">
                      "{member.message}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border-t border-[#C5A059]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Are You a Graduate of Rishikul?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light">
            Claim your official membership, download your verified Digital Alumni ID card, and participate in shaping the future of Ayurvedic healthcare.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5A059] text-[#0F172A] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
            >
              Apply for Association Membership
            </Link>
            <Link
              href="/directory"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-white/20 border border-white/20 transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
