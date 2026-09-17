"use client";

import React, { useState, useEffect } from "react";
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
  Award,
  Heart,
  Cake,
  ShieldAlert,
  Lock,
  LogOut,
  LogIn
} from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated, getLoggedInAlumni, setLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    setLoggedInUser(getLoggedInAlumni());

    const handleAdminAuth = () => setIsAdmin(isAdminAuthenticated());
    const handleUserAuth = () => setLoggedInUser(getLoggedInAlumni());

    window.addEventListener("admin_auth_changed", handleAdminAuth);
    window.addEventListener("user_auth_changed", handleUserAuth);
    return () => {
      window.removeEventListener("admin_auth_changed", handleAdminAuth);
      window.removeEventListener("user_auth_changed", handleUserAuth);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: GraduationCap },
    { name: "Alumni Directory", href: "/directory", icon: Users },
    { name: "Lifetime Achievers", href: "/achievers", icon: Award },
    { name: "Shradhanjali", href: "/shradhanjali", icon: Heart },
    { name: "Birthdays", href: "/birthdays", icon: Cake },
    { name: "Digital ID", href: "/membership", icon: CreditCard },
    { name: "Events", href: "/events", icon: Calendar },
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
            Alumni Association of Rishikul Govt Ayurvedic College
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px]">
          <span className="text-amber-200">ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन</span>
          <span className="text-slate-500">|</span>
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
              >
                <ShieldAlert className="w-3 h-3" />
                Admin Panel
              </Link>
              <button
                onClick={() => setAdminAuthenticated(false)}
                className="text-red-300 hover:text-red-200 flex items-center gap-0.5 ml-1"
                title="Logout Admin"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-200 transition-colors"
            >
              <Lock className="w-3 h-3 text-[#C5A059]" />
              <span>Admin</span>
            </Link>
          )}
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
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all ${
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

          {/* Right Action: Alumni Login / Register CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {loggedInUser ? (
              <div className="flex items-center gap-2 bg-white border border-[#C5A059]/40 py-1.5 px-3 rounded-full shadow-sm">
                <img
                  src={loggedInUser.avatarUrl}
                  alt={loggedInUser.fullName}
                  className="w-6 h-6 rounded-full object-cover border"
                />
                <span className="text-xs font-bold text-[#0F172A] truncate max-w-[120px]">
                  Dr. {loggedInUser.fullName.split(" ")[1] || loggedInUser.fullName}
                </span>
                <button
                  onClick={() => setLoggedInAlumni(null)}
                  className="text-slate-400 hover:text-red-600 p-0.5"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-white border border-slate-300 hover:bg-[#FAF7F2] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                Login
              </Link>
            )}

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#0F172A] text-[#FAF7F2] hover:bg-[#2D5A43] hover:shadow-md transition-all duration-200 border border-[#C5A059]/40"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              Join Alumni
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-2.5 py-1 text-xs font-bold uppercase bg-white border border-slate-300 rounded-md text-[#0F172A]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-2.5 py-1 text-xs font-bold uppercase bg-[#0F172A] text-[#FAF7F2] rounded-md border border-[#C5A059]/40"
            >
              Join
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
        <div className="lg:hidden border-t border-[#C5A059]/20 bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
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

          <div className="pt-2 border-t border-slate-200">
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Go to Admin Panel</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-[#F3ECE2]"
              >
                <Lock className="w-5 h-5 text-[#C5A059]" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
