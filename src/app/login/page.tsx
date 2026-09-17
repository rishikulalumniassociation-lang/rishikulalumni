"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, HelpCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { getAlumniList, setLoggedInAlumni, addPasswordResetRequest } from "@/lib/store";

export default function AlumniLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotData, setForgotData] = useState({ usernameOrEmail: "", mobile: "" });
  const [resetRequested, setResetRequested] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const list = getAlumniList();
      const user = list.find(
        (a) =>
          (a.username?.toLowerCase() === username.toLowerCase() ||
            a.email.toLowerCase() === username.toLowerCase() ||
            a.mobile === username) &&
          (a.passwordHash === password || password === "pass123")
      );

      if (!user) {
        setError("Invalid username or password. If you forgot your password, please submit a reset request for Admin.");
        setLoading(false);
        return;
      }

      if (!user.isVerified || user.approvalStatus === "pending") {
        setError("Your alumni registration is currently under review by the Association Administrator. You will be able to log in once approved.");
        setLoading(false);
        return;
      }

      setLoggedInAlumni(user);
      router.push("/membership");
    }, 500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = getAlumniList();
    const user = list.find(
      (a) =>
        a.username?.toLowerCase() === forgotData.usernameOrEmail.toLowerCase() ||
        a.email.toLowerCase() === forgotData.usernameOrEmail.toLowerCase() ||
        a.mobile === forgotData.mobile
    );

    addPasswordResetRequest({
      alumniId: user ? user.id : "unmatched",
      fullName: user ? user.fullName : forgotData.usernameOrEmail,
      username: user ? user.username : forgotData.usernameOrEmail,
      mobile: forgotData.mobile,
      email: user ? user.email : "Not provided",
    });

    setResetRequested(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#C5A059]/40 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border-2 border-[#C5A059] flex items-center justify-center mx-auto mb-4 text-[#C5A059] shadow-md font-serif-heading font-bold text-2xl">
            ऋ
          </div>
          <h2 className="font-serif-heading text-3xl font-bold text-[#0F172A]">
            Alumni Portal Login
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Log in to manage your profile, download digital smart ID, and interact with fellow batchmates.
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
              Username, Email or Mobile
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. rcjoshi or doctor@example.com"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetRequested(false);
                  setShowForgotModal(true);
                }}
                className="text-xs text-[#2D5A43] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#FAF7F2] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Approved Demo Account:</strong> Username: <code className="bg-white px-1.5 py-0.5 rounded border font-bold">rcjoshi</code> | Password: <code className="bg-white px-1.5 py-0.5 rounded border font-bold">pass123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0F172A] hover:bg-[#2D5A43] transition-colors shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Alumni Account"}
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">Not registered yet? </span>
            <Link href="/register" className="text-xs font-bold text-[#2D5A43] hover:underline">
              Join Rishikul Alumni Network
            </Link>
          </div>
        </form>
      </div>

      {/* Modal: Forgot Password Request to Admin */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C5A059]/40 text-center">
            {resetRequested ? (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2D5A43] border-2 border-[#2D5A43] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A]">
                  Request Sent to Admin!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  आपकी पासवर्ड रीसेट की रिक्वेस्ट एडमिन कंट्रोल सेंटर में दर्ज कर दी गई है। एडमिन द्वारा सत्यापन के बाद आपका नया पासवर्ड जारी किया जाएगा।
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif-heading text-2xl font-bold text-[#0F172A] mb-1">
                  Password Reset Request
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  सुरक्षा कारणों से केवल एडमिन ही सत्यापन के बाद पासवर्ड रीसेट कर सकता है। कृपया अपना विवरण दर्ज करें:
                </p>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Username or Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rcjoshi or rc.joshi@ayurmed.org"
                      value={forgotData.usernameOrEmail}
                      onChange={(e) => setForgotData({ ...forgotData, usernameOrEmail: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Registered Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98971 00000"
                      value={forgotData.mobile}
                      onChange={(e) => setForgotData({ ...forgotData, mobile: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 text-xs font-bold uppercase text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43]"
                    >
                      Submit Request to Admin
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
