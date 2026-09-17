"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Award,
  Cake,
  Heart,
  UserPlus,
  Camera,
  UserCheck,
  Stethoscope,
  Sparkles,
  Calendar
} from "lucide-react";
import { getLoggedInAlumni } from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function MobileNav() {
  const pathname = usePathname();
  const [loggedInUser, setLoggedInUser] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    setLoggedInUser(getLoggedInAlumni());
    const handleAuth = () => setLoggedInUser(getLoggedInAlumni());
    window.addEventListener("user_auth_changed", handleAuth);
    return () => window.removeEventListener("user_auth_changed", handleAuth);
  }, []);

  interface TabItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    avatar?: string;
  }

  // When user is logged in, show Profile button instead of Join
  const centerAction: TabItem = loggedInUser
    ? {
        label: "Profile",
        href: "/profile",
        icon: UserCheck,
        highlight: true,
        avatar: loggedInUser.avatarUrl,
      }
    : {
        label: "Join",
        href: "/register",
        icon: UserPlus,
        highlight: true,
      };

  const mainTabs: TabItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Directory", href: "/directory", icon: Users },
    centerAction,
    { label: "Gallery", href: "/community", icon: Camera },
    { label: "Birthdays", href: "/birthdays", icon: Cake },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#C5A059]/30 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (tab.highlight) {
            return (
              <div key={tab.label} className="flex justify-center items-center">
                <Link
                  href={tab.href}
                  className="flex flex-col items-center -mt-5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 overflow-hidden border-2 ${
                      isActive
                        ? "bg-[#2D5A43] text-[#FAF7F2] border-[#C5A059] ring-2 ring-[#C5A059]"
                        : "bg-[#0F172A] text-[#FAF7F2] border-[#C5A059]/60 hover:bg-[#2D5A43]"
                    }`}
                  >
                    {"avatar" in tab && tab.avatar ? (
                      <img
                        src={tab.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-5 h-5 text-[#C5A059]" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[#0F172A] mt-1 whitespace-nowrap">
                    {tab.label}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-[#0F172A] font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#2D5A43] stroke-[2.5]" : "text-[#64748B]"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
