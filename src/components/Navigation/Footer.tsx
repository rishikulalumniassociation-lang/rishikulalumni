import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart, Lock, Award, Cake, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#FAF7F2] border-t border-[#C5A059]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand & Alumni Fraternity: RISHIKUL SANGAM */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#C5A059] overflow-hidden flex items-center justify-center bg-white shadow-md flex-shrink-0">
                <img
                  src="/images/rishikul-sangam-logo.jpg"
                  alt="ऋषिकुल संगम"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif-heading text-lg font-bold tracking-tight text-white">
                  ऋषिकुल संगम
                </h3>
                <p className="text-xs text-[#C5A059]">Verified Alumni Network</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-200">
                ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार, उत्तराखण्ड
              </p>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                पंजीकरण संख्या: <span className="text-white font-bold">UK06803112023012256</span>
              </p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verified Alumni Network of Rishikul Government Ayurvedic College, Haridwar. Connecting generations of Ayurvedic doctors, vaidyas, and scholars across India and abroad.
            </p>
            <div className="text-[11px] text-amber-200/90 font-medium italic">
              ऋषिकुल एक • पीढ़ियाँ अनेक • कुटुंब एक • विचार अनेक
            </div>
          </div>

          {/* Column 2: Alumni Quick Links */}
          <div>
            <h4 className="font-serif-heading text-base font-semibold text-[#C5A059] mb-4 tracking-wider uppercase">
              Fraternity Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/directory" className="text-slate-300 hover:text-white transition-colors">
                  Alumni Directory & Search
                </Link>
              </li>
              <li>
                <Link href="/birthdays" className="text-slate-300 hover:text-white transition-colors">
                  Today's & Upcoming Birthdays
                </Link>
              </li>
              <li>
                <Link href="/achievers" className="text-slate-300 hover:text-white transition-colors">
                  Lifetime Achievers Hall of Fame
                </Link>
              </li>
              <li>
                <Link href="/shradhanjali" className="text-slate-300 hover:text-white transition-colors">
                  Shradhanjali (Departed Souls)
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-slate-300 hover:text-white transition-colors">
                  Digital Smart ID Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Association Secretariat & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-base font-semibold text-[#C5A059] mb-4 tracking-wider uppercase">
              Secretariat
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span>
                Association Office, Rishikul Campus,
                Haridwar, Uttarakhand - 249401, India
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
              <span>contact@rishikulalumni.org</span>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#C5A059] text-xs font-semibold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Association Admin Login</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार, उत्तराखण्ड. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              Developed by <strong className="text-amber-300 font-semibold">Vd KK Pandey</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <span>Preserving 100+ years of Rishikul alumni fraternity</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
