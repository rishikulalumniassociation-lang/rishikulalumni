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
  Cake,
  Upload,
  Lock,
  Phone,
  Building,
  MapPin
} from "lucide-react";
import { SPECIALIZATION_OPTIONS, JOB_TYPE_OPTIONS } from "@/lib/mockData";
import { getAlumniList, saveAlumniList } from "@/lib/store";
import { compressImageTo50Kb } from "@/lib/imageCompressor";
import { AlumniProfile, RishikulEducationType, JobType } from "@/types";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [generatedMembershipId, setGeneratedMembershipId] = useState("");

  // Photo state with compression info
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [photoSizeKb, setPhotoSizeKb] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Personal & Credentials
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
    whatsappNumber: "",
    dateOfBirth: "",
    bloodGroup: "O+",

    // Step 2: Rishikul Education (UG / PG / BOTH)
    rishikulEducation: "UG" as RishikulEducationType,
    ugBatchYear: "1995",
    ugDegree: "BAMS",
    pgBatchYear: "2000",
    pgDegree: "MD (Ayurveda)",
    specialization: "Kayachikitsa (Internal Medicine)" as any,

    // Step 3: Professional Practice & Address
    jobType: "Private Practice" as JobType,
    designation: "",
    workplace: "", // Hospital / Clinic / Institute name
    city: "",
    state: "Uttarakhand",
    address: "",
    country: "India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const { dataUrl, sizeKb } = await compressImageTo50Kb(file, 50);
      setPhotoDataUrl(dataUrl);
      setPhotoSizeKb(sizeKb);
    } catch (err) {
      alert("Error compressing photo. Please try another image.");
    } finally {
      setIsCompressing(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.password || !formData.mobile || !formData.dateOfBirth) {
        alert("कृपया सभी आवश्यक फ़ील्ड (नाम, व्हाट्सएप मोबाइल नंबर, पासवर्ड, वास्तविक जन्मतिथि) भरें।");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते। कृपया पुनः जांचें।");
        return;
      }
      if (formData.mobile.replace(/\D/g, "").length < 10) {
        alert("कृपया एक मान्य 10 अंकों का व्हाट्सएप मोबाइल नंबर दर्ज करें।");
        return;
      }
    }
    if (step === 2) {
      if ((formData.rishikulEducation === "UG" || formData.rishikulEducation === "BOTH") && !formData.ugBatchYear) {
        alert("कृपया अपना UG (BAMS) प्रवेश बैच वर्ष दर्ज करें।");
        return;
      }
      if ((formData.rishikulEducation === "PG" || formData.rishikulEducation === "BOTH") && !formData.pgBatchYear) {
        alert("कृपया अपना PG (MD/MS) प्रवेश बैच वर्ष दर्ज करें।");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const memId = `RISHI-PEN-${randomNum}`;
    setGeneratedMembershipId(memId);

    const cleanMobile = formData.mobile.trim();
    const newProfile: AlumniProfile = {
      id: `alumni-${Date.now()}`,
      fullName: formData.fullName.trim(),
      username: cleanMobile, // Mobile number is the login username
      passwordHash: formData.password,
      email: formData.email,
      mobile: cleanMobile,
      whatsappNumber: cleanMobile, // Unified WhatsApp mobile
      dateOfBirth: formData.dateOfBirth,
      avatarUrl: photoDataUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
      
      // Rishikul Education
      rishikulEducation: formData.rishikulEducation,
      ugBatchYear: formData.rishikulEducation === "PG" ? undefined : Number(formData.ugBatchYear),
      ugDegree: formData.rishikulEducation === "PG" ? undefined : formData.ugDegree,
      pgBatchYear: formData.rishikulEducation === "UG" ? undefined : Number(formData.pgBatchYear),
      pgDegree: formData.rishikulEducation === "UG" ? undefined : formData.pgDegree,
      specialization: formData.rishikulEducation === "UG" ? undefined : formData.specialization,

      // Job & Address
      jobType: formData.jobType,
      designation: formData.designation,
      workplace: formData.workplace,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      country: formData.country,

      // Admin verification queue
      membershipId: memId,
      membershipTier: "Non-Paid Member", // Default until Admin assigns / approves
      isVerified: false,
      approvalStatus: "pending",
      joinedDate: new Date().toISOString().split("T")[0],
      bloodGroup: formData.bloodGroup,
      connectedAlumniIds: [],
      specialAchievements: [],
    };

    const currentList = getAlumniList();
    saveAlumniList([newProfile, ...currentList]);

    setSubmitted(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#2D5A43", "#0F172A"],
      });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header with Emblem */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] overflow-hidden flex items-center justify-center mx-auto mb-3 shadow-md bg-white">
            <img
              src="/images/rishikul-sangam-logo.jpg"
              alt="RISHIKUL SANGAM"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-1">
            <span>RISHIKUL SANGAM</span>
            <span>•</span>
            <span>पुरातन छात्र पंजीकरण</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Alumni Registration & Account Creation
          </h1>
          <p className="text-xs font-semibold text-[#2D5A43] mt-1">
            एक ऋषिकुल • अनेक पीढ़ियाँ • एक परिवार
          </p>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            पंजीकरण के बाद आपका आवेदन एडमिन द्वारा सत्यापित (Approve) किया जाएगा और आपकी सदस्यता श्रेणी (Non-Paid, Lifetime, Patron) निर्धारित की जाएगी।
          </p>
        </div>

        {/* Multi-Step Wizard Progress */}
        {!submitted && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-0" />
              {[
                { s: 1, label: "Basic & Login", icon: User },
                { s: 2, label: "Rishikul UG / PG", icon: GraduationCap },
                { s: 3, label: "Job & Address", icon: Briefcase },
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

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#C5A059]/30 shadow-xl">
          {submitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#2D5A43] border-2 border-[#2D5A43] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
                  Registration Queued for Admin Approval!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  धन्यवाद, <strong className="text-[#0F172A]">{formData.fullName}</strong>। आपका रजिस्ट्रेशन विवरण एसोसिएशन एडमिन के पास अनुमोदन (Approval) हेतु भेज दिया गया है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 max-w-sm mx-auto text-left space-y-1 text-xs">
                <div><strong>Login ID (WhatsApp Mobile):</strong> <span className="font-mono font-bold text-[#0F172A]">{formData.mobile}</span></div>
                <div><strong>Education:</strong> {formData.rishikulEducation} ({formData.rishikulEducation === "PG" ? `PG: ${formData.pgBatchYear}` : formData.rishikulEducation === "UG" ? `UG: ${formData.ugBatchYear}` : `UG: ${formData.ugBatchYear}, PG: ${formData.pgBatchYear}`})</div>
                <div><strong>Status:</strong> <span className="text-amber-700 font-bold">Pending Admin Approval & Tier Assignment</span></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D5A43] transition-colors"
                >
                  Go to Alumni Login
                </Link>
                <Link
                  href="/directory"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                >
                  Browse Directory
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Basic Data & Login Creation */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 1: Basic Details, Login & Photo Upload
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Full Name (in English) *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  {/* WhatsApp Mobile Number (Used as Login Username) */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-800 mb-1 flex items-center justify-between">
                        <span>WhatsApp Mobile Number (यही आपका लॉगिन यूज़रनेम होगा) *</span>
                        <span className="text-[11px] font-semibold text-[#2D5A43] normal-case bg-emerald-100/70 px-2 py-0.5 rounded">
                          Login Username
                        </span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          name="mobile"
                          required
                          placeholder="e.g. 9897123456"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2D5A43] outline-none font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        कृपया अपना 10 अंकों का सक्रिय व्हाट्सएप मोबाइल नंबर दर्ज करें। इसी नंबर से आप बाद में लॉगिन करेंगे।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Create Password (पासवर्ड बनाएं) *
                        </label>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Confirm Password (पुष्टि करें) *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="doctor@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                        <Cake className="w-3.5 h-3.5 text-[#C5A059]" />
                        Actual Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* PHOTO UPLOAD (Auto compressed to max 50KB) */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-[#C5A059]/60 bg-[#FAF7F2]">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                      Profile Photo (Auto-compressed to Max 50KB)
                    </label>

                    <div className="flex items-center gap-4 mt-2">
                      {photoDataUrl ? (
                        <div className="relative">
                          <img
                            src={photoDataUrl}
                            alt="Uploaded"
                            className="w-16 h-16 rounded-xl object-cover border-2 border-[#2D5A43]"
                          />
                          <span className="text-[10px] bg-[#2D5A43] text-white px-1.5 py-0.5 rounded-full absolute -bottom-2 -right-1">
                            {photoSizeKb} KB
                          </span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}

                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F172A] file:text-white hover:file:bg-[#2D5A43] cursor-pointer"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          {isCompressing ? "Compressing image..." : "किसी भी आकार की फोटो चुनें, सिस्टम उसे 50KB के अंदर ऑटो-कंप्रेस कर देगा।"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Rishikul Education (UG / PG / BOTH) */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 2: Rishikul Education (UG / PG / Both)
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                      ऋषिकुल से आपने क्या किया है? (Select Degree Level at Rishikul) *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "UG", label: "केवल UG (BAMS)" },
                        { id: "PG", label: "केवल PG (MD/MS)" },
                        { id: "BOTH", label: "दोनों (UG + PG)" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, rishikulEducation: item.id as any })}
                          className={`py-3 px-2 rounded-xl text-xs font-bold text-center border-2 transition-all ${
                            formData.rishikulEducation === item.id
                              ? "bg-[#0F172A] text-[#C5A059] border-[#0F172A] shadow-md"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-[#FAF7F2]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UG Details (if UG or BOTH) */}
                  {(formData.rishikulEducation === "UG" || formData.rishikulEducation === "BOTH") && (
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-300 space-y-3">
                      <div className="text-xs font-bold uppercase text-[#2D5A43] flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        Rishikul UG (Undergraduate) Details
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            UG Entrance / Batch Year *
                          </label>
                          <input
                            type="number"
                            name="ugBatchYear"
                            min="1940"
                            max="2026"
                            placeholder="e.g. 1994"
                            value={formData.ugBatchYear}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            disabled
                            value="BAMS"
                            className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PG Details (if PG or BOTH) */}
                  {(formData.rishikulEducation === "PG" || formData.rishikulEducation === "BOTH") && (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-[#C5A059]/40 space-y-3">
                      <div className="text-xs font-bold uppercase text-[#C5A059] flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                        Rishikul PG (Postgraduate) Details
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            PG Entrance / Batch Year *
                          </label>
                          <input
                            type="number"
                            name="pgBatchYear"
                            min="1970"
                            max="2026"
                            placeholder="e.g. 2002"
                            value={formData.pgBatchYear}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A43]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                            PG Degree
                          </label>
                          <select
                            name="pgDegree"
                            value={formData.pgDegree}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none"
                          >
                            <option value="MD (Ayurveda)">MD (Ayurveda)</option>
                            <option value="MS (Ayurveda)">MS (Ayurveda)</option>
                            <option value="PhD">PhD</option>
                            <option value="Diploma">Diploma</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clinical Specialty: In Ayurveda, UG (BAMS) has no clinical specialty. Specialty exists only in PG (MD/MS) */}
                  {(formData.rishikulEducation === "PG" || formData.rishikulEducation === "BOTH") ? (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        PG Specialization / क्लिनिकल विशेषता (MD/MS) *
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      >
                        {SPECIALIZATION_OPTIONS.filter((s) => s !== "All Specializations").map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#2D5A43] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-[#0F172A]">स्नातक (UG / BAMS):</strong> BAMS सामान्य आयुर्वेद चिकित्सा की उपाधि है जिसमें औपचारिक क्लिनिकल स्पेशलाइजेशन नहीं होता। लॉग-इन के बाद आप अपनी क्लिनिकल प्रैक्टिस एवं रोग-विशेषज्ञता (Disease Specialty) प्रोफाइल में जोड़ सकते हैं।
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Job, Workplace & Address Details */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    Step 3: Job Type, Workplace & Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Current Job Type (कार्य का प्रकार) *
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      >
                        {JOB_TYPE_OPTIONS.filter((j) => j !== "All Job Types").map((job) => (
                          <option key={job} value={job}>{job}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Current Designation (पदनाम) *
                      </label>
                      <input
                        type="text"
                        name="designation"
                        required
                        placeholder="e.g. Senior Medical Officer / Consultant"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Institution / Hospital / Organization Name *
                    </label>
                    <input
                      type="text"
                      name="workplace"
                      required
                      placeholder="e.g. Govt Hospital Haridwar / Self Clinic / Patanjali"
                      value={formData.workplace}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
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
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Residential / Clinic Address (पता)
                    </label>
                    <textarea
                      name="address"
                      rows={2}
                      placeholder="House/Clinic No., Street, Colony, Landmark..."
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D5A43] outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <strong>Admin Verification Note:</strong> पंजीकरण सबमिट करने के बाद आपकी सदस्यता श्रेणी (Non-Paid, Lifetime, Patron) एडमिन द्वारा तय और स्वीकृत की जाएगी। बाकी प्रोफाइल विवरण आप लॉगिन अप्रूव होने के बाद भी अपडेट कर सकेंगे।
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

                {step < 3 ? (
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
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C5A059] text-[#0F172A] text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    Submit Registration
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
