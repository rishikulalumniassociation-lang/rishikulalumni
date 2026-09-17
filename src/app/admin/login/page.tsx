"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { setAdminAuthenticated, verifyAdminCredentials } from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isValid = await verifyAdminCredentials(username, password);
      if (isValid) {
        setAdminAuthenticated(true);
        router.push("/admin");
      } else {
        setError("अमान्य एडमिन क्रेडेंशियल्स (Invalid administrative credentials)। कृपया पुनः प्रयास करें।");
        setLoading(false);
      }
    } catch (err) {
      setError("लॉगिन सत्यापन में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#C5A059]/40 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] overflow-hidden flex items-center justify-center mx-auto mb-3 shadow-md bg-white">
            <img
              src="/images/rishikul-sangam-logo.jpg"
              alt="RISHIKUL SANGAM"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Executive Association Portal
          </div>
          <h2 className="font-serif-heading text-3xl font-bold text-[#0F172A]">
            RISHIKUL SANGAM Admin
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Authorized access to approve alumni registrations, manage Lifetime Achievers, Patrons, and Shradhanjali tributes.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0F172A] hover:bg-[#2D5A43] transition-colors shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Admin Dashboard"}
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>
      </div>
    </div>
  );
}
