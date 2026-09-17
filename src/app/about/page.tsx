import React from "react";
import Link from "next/link";
import FounderHeritageSection from "@/components/Hero/FounderHeritageSection";
import { EXECUTIVE_MEMBERS } from "@/lib/mockData";
import {
  Building2,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Flag,
  Heart
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heritage Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] overflow-hidden flex items-center justify-center shadow-md bg-white shrink-0">
              <img
                src="/images/rishikul-sangam-logo.jpg"
                alt="RISHIKUL SANGAM"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] block">
                RISHIKUL SANGAM
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#2D5A43]">
                एक ऋषिकुल • अनेक पीढ़ियाँ • एक परिवार
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>महाविद्यालय एवं एसोसिएशन का गौरवशाली इतिहास</span>
            <span>•</span>
            <span>Estd. 1919</span>
          </div>
          <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tight leading-tight">
            A Century of Ayurvedic Mastery, Patriotism & Fellowship
          </h1>
          <p className="text-sm sm:text-base text-slate-700 mt-4 leading-relaxed font-light">
            Founded during the Indian freedom movement by revered scholars and visionaries led by Bharat Ratna Mahamana Pandit Madan Mohan Malaviya, Rishikul Ayurvedic College emerged as an immortal seat preserving Dhanvantari's eternal science.
          </p>
        </div>

        {/* FOUNDER & MARTYR STUDENT HERO COMPONENT */}
        <div className="mb-16 -mx-4 sm:mx-0">
          <FounderHeritageSection />
        </div>

        {/* Historical Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/30 shadow-md">
            <div className="text-[#C5A059] font-serif-heading text-4xl font-bold mb-2">1919</div>
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-2">Sacred Genesis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Established in Haridwar under the patronship of Mahamana Pandit Madan Mohan Malaviya ji to revive pure classical Ayurveda in a traditional Gurukula ambiance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-md">
            <div className="text-red-600 font-serif-heading text-4xl font-bold mb-2">1942</div>
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-2">Supreme Martyrdom</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              17-year-old student Jagdish Vats sacrificed his life hoisting the Tricolor at Haridwar during the Quit India movement, becoming Haridwar's first freedom martyr.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0F172A]/40 shadow-md">
            <div className="text-[#0F172A] font-serif-heading text-4xl font-bold mb-2">Present</div>
            <h3 className="font-serif-heading text-xl font-bold text-[#0F172A] mb-2">Global Alumni Guild</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              Uniting over 12,000 alumni across 35 countries leading research institutes, super-specialty surgical centers, and healthcare directorates.
            </p>
          </div>
        </div>

        {/* Executive Committee Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
              Association Leadership
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
              The Executive Council
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              The governing committee dedicated to alumni welfare, educational symposiums, and mutual fellowship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-xs text-slate-600 italic">
                      "{member.message}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Association Bylaws & Core Mission */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/30 shadow-xl max-w-4xl mx-auto mb-16">
          <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mb-6">
            Aims & Objects of the Association
          </h3>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Alumni Fellowship:</strong> To establish and maintain a bond of brotherhood and professional solidarity among all graduates and postgraduates of Rishikul.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Academic Upliftment:</strong> To organize regular Continuing Medical Education (CME) seminars, clinical conferences, workshops, and research symposiums.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Student Support & Scholarships:</strong> To award merit-cum-means scholarships and guidance to undergraduate BAMS and MD/MS students of Rishikul.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#2D5A43] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Alumni Welfare Fund:</strong> To provide emergency medical and financial assistance to alumni or their dependents in times of critical adversity.
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0F172A] text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#2D5A43] transition-colors shadow-lg"
          >
            <span>Register as an Association Member</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
