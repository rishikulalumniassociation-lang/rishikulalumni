"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Users,
  UserCheck,
  ArrowLeft
} from "lucide-react";
import RevealOnScroll from "@/components/Motion/RevealOnScroll";

// 1. Core Leadership
const PRESIDENT = {
  role: "अध्यक्ष",
  name: "प्रो. (डॉ.) विनीत कुमार अग्निहोत्री",
  mobile: "9897284154",
};

const SECRETARY = {
  role: "सचिव",
  name: "डॉ. वेद भूषण शर्मा",
  mobile: "9045951442",
};

// 2. Patrons
const PATRONS = [
  "डॉ. रमेश चंद गोयल",
  "डॉ. देवेन्द्र शर्माचमोली",
  "डॉ. अशोक पालीवाल",
  "प्रो. (डॉ.) सुनील कुमार जोशी",
];

// 3. Other Office Bearers
const OFFICE_BEARERS = [
  { role: "संयोजक", name: "प्रो. (डॉ.) नरेश चौधरी" },
  { role: "वरिष्ठ उपाध्यक्ष", name: "डॉ. प्रेम प्रकाश सतलेवाल" },
  { role: "उपाध्यक्ष", name: "डॉ. प्रमोद कपूर" },
  { role: "उपाध्यक्ष (महिला)", name: "डॉ. मनीषा दीक्षित" },
  { role: "कोषाध्यक्ष", name: "डॉ. टी.के. गर्ग" },
  { role: "उपसचिव", name: "डॉ. यादवेन्द्र यादव" },
  { role: "उपसचिव (महिला)", name: "डॉ. पारुल शर्मा" },
  { role: "प्रचार मंत्री", name: "डॉ. अवनीश उपाध्याय" },
];

// 4. Executive Members
const EXECUTIVE_MEMBERS = [
  "डॉ. उदय नारायण पाण्डेय",
  "डॉ. वीरेन्द्र नाथ कुमार",
  "डॉ. राजीव कुमार वर्मा",
];

// 5. Special Invitees
const SPECIAL_INVITEES = [
  "डॉ. अरुण कुमार",
  "डॉ. अमन गुप्ता",
];

export default function AboutAssociationPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16 text-[#0F172A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>होमपेज पर लौटें</span>
          </Link>
        </div>

        {/* HERO / HEADING */}
        <RevealOnScroll direction="up" delay={50}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-[#C5A059]/40 text-[#855D10] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>आधिकारिक विवरण • Official Association Registry</span>
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-2 border-[#C5A059] p-1 bg-white shadow-md mb-5">
              <img
                src="/images/rishikul-sangam-logo.jpg"
                alt="ऋषिकुल संगम"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
              ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन
            </h1>
            <p className="text-xs sm:text-sm text-[#2D5A43] font-semibold mt-2">
              ऋषिकुल राजकीय स्नातकोत्तर आयुर्वेद महाविद्यालय एवं चिकित्सालय, हरिद्वार
            </p>
          </div>
        </RevealOnScroll>

        {/* SECTION 1: OFFICIAL ASSOCIATION DETAILS */}
        <RevealOnScroll direction="up" delay={150}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-sm mb-12">
            <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0F172A]">
                संस्था पंजीकरण एवं विवरण
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {/* Registration Type */}
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#FAF7F2]/60 border border-slate-200/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  पंजीकरण
                </span>
                <span className="font-medium text-[#0F172A] text-base">
                  सासाईटी एक्ट के अन्तर्गत पंजीकृत
                </span>
              </div>

              {/* Registration Number */}
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#FAF7F2]/60 border border-slate-200/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  रजि. नं.
                </span>
                <span className="font-mono font-bold text-[#0F172A] text-base tracking-wide">
                  UK06803112023012256
                </span>
              </div>

              {/* Institution */}
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#FAF7F2]/60 border border-slate-200/60 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  संस्थान
                </span>
                <span className="font-medium text-[#0F172A] text-base leading-relaxed">
                  ऋषिकुल राजकीय स्नातकोत्तर आयुर्वेद महाविद्यालय एवं चिकित्सालय, हरिद्वार
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#FAF7F2]/60 border border-slate-200/60 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  ई-मेल
                </span>
                <a
                  href="mailto:sudhakar01919@gmail.com"
                  className="font-medium text-[#2D5A43] hover:text-[#0F172A] text-base hover:underline transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span>sudhakar01919@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* SECTION 2: OFFICE BEARERS (पदाधिकारी) */}
        <div className="mb-12 sm:mb-16">
          <RevealOnScroll direction="up" delay={200}>
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Association Leadership
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
                पदाधिकारी
              </h2>
            </div>
          </RevealOnScroll>

          {/* 1. PRESIDENT & SECRETARY (FEATURED ROW) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* President */}
            <RevealOnScroll direction="up" delay={250}>
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border-2 border-[#C5A059]/40 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43] text-[#FAF7F2] text-xs font-bold mb-3">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{PRESIDENT.role}</span>
                  </div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                    {PRESIDENT.name}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
                  <a
                    href={`tel:${PRESIDENT.mobile}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:text-[#2D5A43] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#2D5A43] group-hover:bg-[#2D5A43] group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>मो. {PRESIDENT.mobile}</span>
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            {/* Secretary */}
            <RevealOnScroll direction="up" delay={300}>
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border-2 border-[#C5A059]/40 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A43] text-[#FAF7F2] text-xs font-bold mb-3">
                    <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{SECRETARY.role}</span>
                  </div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                    {SECRETARY.name}
                  </h3>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C5A059]/20">
                  <a
                    href={`tel:${SECRETARY.mobile}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A] hover:text-[#2D5A43] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#2D5A43] group-hover:bg-[#2D5A43] group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>मो. {SECRETARY.mobile}</span>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* 2. PATRONS (संरक्षक) */}
          <RevealOnScroll direction="up" delay={350}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-[#C5A059]/30 shadow-sm mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 text-[#855D10] text-xs font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>संरक्षक</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {PATRONS.map((name, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF7F2]/80 border border-slate-200/70 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-serif-heading text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-serif-heading font-semibold text-sm text-[#0F172A]">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* 3. OTHER DESIGNATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {OFFICE_BEARERS.map((bearer, idx) => (
              <RevealOnScroll key={idx} direction="up" delay={400 + idx * 40}>
                <div className="bg-white rounded-2xl p-5 border border-[#C5A059]/25 shadow-sm hover:border-[#C5A059]/50 transition-colors h-full flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A43] bg-emerald-50 px-2.5 py-1 rounded-md inline-block w-fit mb-2">
                    {bearer.role}
                  </span>
                  <h4 className="font-serif-heading text-base font-bold text-[#0F172A] leading-snug">
                    {bearer.name}
                  </h4>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* 4. EXECUTIVE COMMITTEE & SPECIAL INVITEES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Executive Committee */}
            <RevealOnScroll direction="up" delay={550}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm h-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-4">
                  <Users className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>कार्यकारिणी सदस्य</span>
                </div>

                <div className="space-y-3 mt-2">
                  {EXECUTIVE_MEMBERS.map((name, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F2]/70 border border-slate-200/60 flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      <span className="font-serif-heading font-semibold text-sm text-[#0F172A]">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Special Invitees */}
            <RevealOnScroll direction="up" delay={600}>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#C5A059]/30 shadow-sm h-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-4">
                  <UserCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>विशेष आमंत्रित सदस्य</span>
                </div>

                <div className="space-y-3 mt-2">
                  {SPECIAL_INVITEES.map((name, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F2]/70 border border-slate-200/60 flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      <span className="font-serif-heading font-semibold text-sm text-[#0F172A]">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* SECTION 3: CONTACT (सम्पर्क विवरण) */}
        <RevealOnScroll direction="up" delay={650}>
          <div className="bg-[#0F172A] text-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-lg">
            <div className="border-b border-slate-800 pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Get in Touch
              </span>
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-white mt-1">
                सम्पर्क
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              {/* Email */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider block">
                  ई-मेल
                </span>
                <a
                  href="mailto:sudhakar01919@gmail.com"
                  className="text-white hover:text-amber-300 font-medium underline underline-offset-4 transition-colors flex items-center gap-2 break-all"
                >
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>sudhakar01919@gmail.com</span>
                </a>
              </div>

              {/* President Contact */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider block">
                  अध्यक्ष: प्रो. (डॉ.) विनीत कुमार अग्निहोत्री
                </span>
                <a
                  href="tel:9897284154"
                  className="text-white hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>मो. 9897284154</span>
                </a>
              </div>

              {/* Secretary Contact */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider block">
                  सचिव: डॉ. वेद भूषण शर्मा
                </span>
                <a
                  href="tel:9045951442"
                  className="text-white hover:text-amber-300 font-medium transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>मो. 9045951442</span>
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
}
