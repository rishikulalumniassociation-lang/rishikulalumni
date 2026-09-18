"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogIn,
  Stethoscope,
  Sparkles,
  Camera,
  Crown
} from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated, getLoggedInAlumni, setLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleLogout = () => {
    setLoggedInAlumni(null);
    setLoggedInUser(null);
    if (pathname === "/profile" || pathname.startsWith("/membership")) {
      router.push("/login");
    } else {
      router.refresh();
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: GraduationCap },
    { name: "Directory", href: "/directory", icon: Users },
    { name: "Gallery / गैलरी", href: "/community", icon: Camera },
    { name: "Lifetime Member", href: "/membership/permanent", icon: Crown },
    { name: "Ayurveda Experts", href: "/experts", icon: Stethoscope },
    { name: "Achievements", href: "/achievements", icon: Sparkles },
    { name: "Hall of Fame", href: "/achievers", icon: Award },
    { name: "Shradhanjali", href: "/shradhanjali", icon: Heart },
    { name: "Birthdays", href: "/birthdays", icon: Cake },
    { name: "Events", href: "/events", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C5A059]/20 bg-[#FAF7F2]/95 backdrop-blur-md transition-all">
      {/* Top Heritage Ribbon */}
      <div className="bg-[#0F172A] text-[#FAF7F2] text-[11px] sm:text-xs py-1.5 px-4 tracking-wider flex justify-between items-center border-b border-[#C5A059]/30">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
          <span className="font-medium text-[#C5A059] uppercase">ESTD. 1919</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार, उत्तराखण्ड
          </span>
          <span className="hidden lg:inline text-amber-200 font-mono text-[10px]">
            (पंजी. संख्या: UK06803112023012256)
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px]">
          <span className="text-amber-200 md:hidden truncate max-w-[200px]">
            ऋषिकुल एसोसिएशन (UK06803112023012256)
          </span>
          <span className="text-slate-500 md:hidden">|</span>
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
          {/* Logo & Brand Name: ऋषिकुल संगम */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 mr-1 sm:mr-2">
            <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full border-2 border-[#C5A059] overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 bg-white">
              <img
                src="/images/rishikul-sangam-logo.jpg"
                alt="ऋषिकुल संगम"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-serif-heading text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#0F172A] leading-tight group-hover:text-[#2D5A43] transition-colors whitespace-nowrap">
                ऋषिकुल संगम
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-[#64748B] tracking-normal mt-0.5 whitespace-nowrap">
                Verified Alumni Network • Haridwar
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
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 bg-white hover:bg-amber-50/60 border-2 border-[#C5A059] py-1.5 px-3.5 rounded-full shadow-sm transition-all group"
                  title="Open and Update Profile"
                >
                  <img
                    src={loggedInUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={loggedInUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-[#C5A059]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2D5A43] truncate max-w-[130px] leading-tight">
                      Dr. {loggedInUser.fullName.split(" ")[1] || loggedInUser.fullName}
                    </span>
                    <span className="text-[10px] text-[#2D5A43] font-bold">
                      प्रोफाइल अपडेट करें ✏️
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-xs"
                  title="Logout Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-white border border-slate-300 hover:bg-[#FAF7F2] transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#0F172A] text-[#FAF7F2] hover:bg-[#2D5A43] hover:shadow-md transition-all duration-200 border border-[#C5A059]/40"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  Join Alumni
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            {loggedInUser ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-[#FAF7F2] hover:bg-amber-50 border-2 border-[#C5A059] rounded-lg text-[#0F172A] shrink-0"
                  title="Profile"
                >
                  <img
                    src={loggedInUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={loggedInUser.fullName}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs font-bold leading-none">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 py-1 text-xs font-bold uppercase bg-white border border-slate-300 rounded-md text-[#0F172A] shrink-0"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-2 py-1 text-xs font-bold uppercase bg-[#0F172A] text-[#FAF7F2] rounded-md border border-[#C5A059]/40 shrink-0"
                >
                  Join
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#0F172A] hover:bg-[#F3ECE2] transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C5A059]/20 bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {loggedInUser && (
            <div className="p-3 bg-white rounded-2xl border-2 border-[#C5A059]/40 mb-3 flex items-center justify-between shadow-xs">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 min-w-0"
              >
                <img
                  src={loggedInUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  alt={loggedInUser.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#C5A059] shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#0F172A] truncate">
                    Dr. {loggedInUser.fullName}
                  </div>
                  <div className="text-[11px] text-[#2D5A43] font-bold">
                    प्रोफाइल अपडेट करें / Edit Profile →
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 shrink-0 ml-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}
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
