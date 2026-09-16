import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#FAF7F2] border-t border-[#C5A059]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#C5A059] bg-[#FAF7F2]/10 flex items-center justify-center text-[#C5A059] font-serif-heading font-bold text-xl">
                ऋ
              </div>
              <div>
                <h3 className="font-serif-heading text-lg font-bold tracking-tight text-white">
                  RISHIKUL
                </h3>
                <p className="text-xs text-[#C5A059]">Snatak Evam Snatkottar Association</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Serving the lineage of Rishikul Government Ayurvedic College, Haridwar (est. 1919).
              Uniting thousands of vaidyas, researchers, and practitioners worldwide.
            </p>
            <div className="text-[11px] text-amber-200/80 font-medium">
              ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन • हरिद्वार (उत्तराखंड)
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif-heading text-base font-semibold text-[#C5A059] mb-4 tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/directory" className="text-slate-300 hover:text-white transition-colors">
                  Alumni Directory & Search
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-300 hover:text-white transition-colors">
                  New Member Registration
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-slate-300 hover:text-white transition-colors">
                  Digital ID Card & Tiers
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-300 hover:text-white transition-colors">
                  Conclaves & Reunions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  Executive Body & Bylaws
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Association Chapters */}
          <div>
            <h4 className="font-serif-heading text-base font-semibold text-[#C5A059] mb-4 tracking-wider uppercase">
              Alumni Chapters
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Haridwar Central Chapter (HQ)</li>
              <li>• Dehradun & Garhwal Chapter</li>
              <li>• Delhi NCR Chapter</li>
              <li>• Lucknow & UP Chapter</li>
              <li>• International Chapter (UK, US, Gulf)</li>
            </ul>
          </div>

          {/* Column 4: Contact & Secretariat */}
          <div className="space-y-3">
            <h4 className="font-serif-heading text-base font-semibold text-[#C5A059] mb-4 tracking-wider uppercase">
              Secretariat
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <span>
                Association Office, Rishikul Ayurvedic College Campus,
                Haridwar, Uttarakhand - 249401, India
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
              <span>+91 1334 227000 / +91 94120 78901</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
              <span>contact@rishikulalumni.org</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Rishikul Snatak Evam Snatkottar Association. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Preserving 100+ years of Ayurvedic excellence</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
