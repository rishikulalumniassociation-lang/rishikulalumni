"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Users,
  Calendar,
  CreditCard,
  Building2,
  UserCheck,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: GraduationCap },
    { name: "Alumni Directory", href: "/directory", icon: Users },
    { name: "Digital ID & Membership", href: "/membership", icon: CreditCard },
    { name: "Events & Reunions", href: "/events", icon: Calendar },
    { name: "Heritage & About", href: "/about", icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C5A059]/20 bg-[#FAF7F2]/95 backdrop-blur-md transition-all">
      {/* Top Heritage Ribbon */}
      <div className="bg-[#0F172A] text-[#FAF7F2] text-[11px] sm:text-xs py-1.5 px-4 tracking-wider uppercase flex justify-between items-center border-b border-[#C5A059]/30">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
          <span className="font-medium text-[#C5A059]">ESTD. 1919</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            Rishikul Govt Ayurvedic College, Haridwar
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px]">
          <span className="text-amber-200">ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Dual-Script Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] bg-[#0F172A] flex items-center justify-center text-[#FAF7F2] shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-serif-heading text-2xl text-[#C5A059] font-bold">
                ऋ
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif-heading text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] leading-none group-hover:text-[#2D5A43] transition-colors">
                RISHIKUL
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] tracking-wider uppercase mt-0.5">
                Snatak Evam Snatkottar Association
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "text-[#0F172A] bg-[#C5A059]/15 font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3ECE2]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Register CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#0F172A] text-[#FAF7F2] hover:bg-[#2D5A43] hover:shadow-md transition-all duration-200 border border-[#C5A059]/40"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              Join Alumni Network
            </Link>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/register"
              className="px-3 py-1.5 text-xs font-semibold uppercase bg-[#0F172A] text-[#FAF7F2] rounded-md border border-[#C5A059]/40"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F172A] hover:bg-[#F3ECE2] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C5A059]/20 bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0F172A] text-[#FAF7F2]"
                    : "text-[#0F172A] hover:bg-[#F3ECE2]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#C5A059]" : "text-[#2D5A43]"
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
