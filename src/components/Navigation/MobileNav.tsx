"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Award,
  Cake,
  Heart,
  UserPlus,
  Camera
} from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Directory", href: "/directory", icon: Users },
    { label: "Gallery", href: "/community", icon: Camera },
    { label: "Join", href: "/register", icon: UserPlus, highlight: true },
    { label: "Birthdays", href: "/birthdays", icon: Cake },
    { label: "Memorials", href: "/shradhanjali", icon: Heart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#C5A059]/30 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (tab.highlight) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center -mt-5 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
                    isActive
                      ? "bg-[#2D5A43] text-[#FAF7F2] ring-2 ring-[#C5A059]"
                      : "bg-[#0F172A] text-[#FAF7F2] hover:bg-[#2D5A43]"
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <span className="text-[10px] font-semibold text-[#0F172A] mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-colors ${
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
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
