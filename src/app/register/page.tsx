"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  User,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { SPECIALIZATION_OPTIONS } from "@/lib/mockData";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [generatedMembershipId, setGeneratedMembershipId] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    fullNameHindi: "",
    email: "",
    phone: "",
    bloodGroup: "O+",

    // Step 2: Academic
    degree: "BAMS",
    batchYear: "2015",
    specialization: "Kayachikitsa (Internal Medicine)",
    rollNumberOrRegNo: "",

    // Step 3: Professional
    designation: "",
    workplace: "",
    city: "",
    state: "Uttarakhand",
    country: "India",
    whatsappNumber: "",
    bio: "",

    // Step 4: Membership Tier
    membershipTier: "Life Member",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate generation of official membership ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const memId = `RISHI-LM-${randomNum}`;
    setGeneratedMembershipId(memId);
    setSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#2D5A43", "#0F172A"],
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2">
            <span>ऋषिकुल सदस्यता आवेदन</span>
            <span>•</span>
            <span>Official Onboarding</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Join the Alumni Association
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Open exclusively to graduates & postgraduates of Rishikul Govt Ayurvedic College Haridwar.
          </p>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        {!submitted && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-0" />
              {[
                { s: 1, label: "Personal", icon: User },
                { s: 2, label: "Academic", icon: GraduationCap },
                { s: 3, label: "Practice", icon: Briefcase },
                { s: 4, label: "Category", icon: ShieldCheck },
              ].map(({ s, label, icon: Icon }) => (
                <div key={s} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      step === s
                        ? "bg-[#0F172A] text-[#C5A059] ring-4 ring-[#C5A059]/30"
                        : step > s
                        ? "bg-[#2D5A43] text-white"
                        : "bg-white text-slate-400 border border-slate-200"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-1.5 uppercase tracking-wider ${
                      step >= s ? "text-[#0F172A]" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Card / Steps */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/30 shadow-xl">
          {submitted ? (
            /* Success View */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#2D5A43] border-2 border-[#2D5A43] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  Membership Application Received!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Welcome aboard, <strong className="text-[#0F172A]">{formData.fullName}</strong>. Your application has been logged into the Association records.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 max-w-sm mx-auto text-left">
                <div className="text-[10px] uppercase font-bold text-[#C5A059] mb-1">
                  Provisional Alumni ID
                </div>
                <div className="font-mono text-xl font-bold text-[#0F172A]">
                  {generatedMembershipId}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Tier: {formData.membershipTier} • Batch of {formData.batchYear}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link
                  href="/membership"
                  className="px-6 py-3.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  View Digital ID Card
                </Link>
                <Link
                  href="/directory"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                >
                  Explore Batchmates
                </Link>
              </div>
            </div>
          ) : (
            /* Multi-Step Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 1: Personal Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Name (as per Degree Certificate) *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Name in Hindi / Devanagari (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      name="fullNameHindi"
                      placeholder="उदा. डॉ. राजेश कुमार शर्मा"
                      value={formData.fullNameHindi}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="doctor@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98971 00000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Academic Details */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 2: Rishikul Academic History
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Degree Obtained *
                      </label>
                      <select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      >
                        {["BAMS", "MD (Ayurveda)", "MS (Ayurveda)", "PhD", "Diploma", "Other"].map((deg) => (
                          <option key={deg} value={deg}>{deg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Graduation Batch Year *
                      </label>
                      <input
                        type="number"
                        name="batchYear"
                        required
                        min="1940"
                        max="2026"
                        placeholder="e.g. 1996"
                        value={formData.batchYear}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Primary Clinical Specialty *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    >
                      {SPECIALIZATION_OPTIONS.filter((s) => s !== "All Specializations").map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      College Roll No / State Medical Council Reg No
                    </label>
                    <input
                      type="text"
                      name="rollNumberOrRegNo"
                      placeholder="e.g. UKMC-AYUR-4821 or 1996/BAMS/42"
                      value={formData.rollNumberOrRegNo}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Professional Practice */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 3: Professional Practice & Location
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Current Designation *
                      </label>
                      <input
                        type="text"
                        name="designation"
                        required
                        placeholder="e.g. Senior Medical Officer / Founder"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Clinic / Hospital / Organization *
                      </label>
                      <input
                        type="text"
                        name="workplace"
                        required
                        placeholder="e.g. Patanjali Yogpeeth / Self Practice"
                        value={formData.workplace}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Haridwar"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        placeholder="e.g. Uttarakhand"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      WhatsApp Number (for Alumni directory connects)
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      placeholder="919876543210"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Brief Bio / Clinical Focus (Optional)
                    </label>
                    <textarea
                      name="bio"
                      rows={2}
                      placeholder="Special focus areas, hospital ties, research interests..."
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Membership Category */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 4: Select Membership Category
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        tier: "Life Member",
                        cost: "₹3,100 (One Time)",
                        badge: "Most Popular",
                        desc: "Lifetime voting rights, official Digital ID card, directory listing, discount on reunion and CME registrations.",
                      },
                      {
                        tier: "Patron Member",
                        cost: "₹11,000 (One Time)",
                        badge: "Patron",
                        desc: "All Life Member benefits plus VIP seating at Annual Conclaves, donor roll honor, and advisory invitations.",
                      },
                      {
                        tier: "Annual Member",
                        cost: "₹500 / year",
                        desc: "1-year access to directory, newsletters, and association webinars.",
                      },
                    ].map((plan) => (
                      <label
                        key={plan.tier}
                        className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.membershipTier === plan.tier
                            ? "border-[#2D5A43] bg-[#2D5A43]/5 shadow-sm"
                            : "border-slate-200 hover:border-[#C5A059]/60 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="membershipTier"
                              value={plan.tier}
                              checked={formData.membershipTier === plan.tier}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#2D5A43] focus:ring-[#2D5A43]"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A]">
                                  {plan.tier}
                                </span>
                                {plan.badge && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#C5A059] text-[#0F172A]">
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {plan.desc}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#0F172A] whitespace-nowrap">
                            {plan.cost}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Note:</strong> Membership fee payments can be made via UPI / Bank Transfer directly to the official association account upon verification.
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
