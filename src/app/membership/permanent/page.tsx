"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Send,
  Building,
  GraduationCap,
  FileCheck,
  ExternalLink
} from "lucide-react";
import {
  getMembershipSettings,
  LifetimeMembershipSettings,
  submitMembershipPayment,
  getAlumniList,
  getLoggedInAlumni
} from "@/lib/store";
import { AlumniProfile } from "@/types";

export default function PermanentMembershipPage() {
  const [settings, setSettings] = useState<LifetimeMembershipSettings>(getMembershipSettings());
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(3100);
  const [txnRef, setTxnRef] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Copy states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Directory filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const loadedSettings = getMembershipSettings();
    setSettings(loadedSettings);
    setAmount(loadedSettings.lifetimeFee || 3100);

    const logged = getLoggedInAlumni();
    setCurrentUser(logged);
    if (logged) {
      setFullName(logged.fullName || "");
      setMobile(logged.mobile || "");
      setEmail(logged.email || "");
    }

    getAlumniList().then((list) => {
      setAlumniList(list);
    });

    const handleSettingsUpdate = () => {
      const s = getMembershipSettings();
      setSettings(s);
      setAmount(s.lifetimeFee || 3100);
    };

    window.addEventListener("membership_settings_updated", handleSettingsUpdate);
    return () => window.removeEventListener("membership_settings_updated", handleSettingsUpdate);
  }, []);

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.contactMobile);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !txnRef.trim()) {
      alert("कृपया नाम, मोबाइल नंबर और UTR / Transaction ID भरें।");
      return;
    }

    setFormSubmitting(true);
    try {
      submitMembershipPayment({
        alumniId: currentUser?.id,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        membershipType: "Life Member",
        amount: Number(amount),
        transactionReference: txnRef.trim(),
        paymentDate: paymentDate || new Date().toISOString().split("T")[0],
        screenshotUrl: screenshotUrl.trim() || undefined,
      });
      setFormSubmitted(true);
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // WhatsApp Pre-filled text
  const whatsappText = encodeURIComponent(
    `नमस्ते Prof. Vineet Kumar Agnihotri जी,\n\nमैं ऋषिकुल राजकीय आयुर्वेद कॉलेज का पूर्व छात्र/छात्रा हूँ। मैं ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन की आजीवन सदस्यता (Lifetime Membership) शुल्क ₹${settings.lifetimeFee} के संबंध में संपर्क कर रहा हूँ।\n\nकृपया भुगतान सत्यापन एवं सदस्यता मार्गदर्शन प्रदान करें।`
  );
  const whatsappUrl = `https://wa.me/91${settings.whatsappNumber.replace(/\D/g, "")}?text=${whatsappText}`;

  // UPI Deep Link for Mobile (Google Pay, PhonePe, Paytm, BHIM)
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
    settings.accountName
  )}&am=${settings.lifetimeFee}&cu=INR&tn=${encodeURIComponent("Lifetime Membership Fee - Rishikul Alumni")}`;

  // Filter Life Members
  const lifeMembers = alumniList.filter(
    (a) => a.membershipTier === "Life Member" && !a.isDeceased
  );

  // Available batches for filtering
  const batches = Array.from(
    new Set(
      lifeMembers
        .map((a) => (a.ugBatchYear ? `UG ${a.ugBatchYear}` : a.pgBatchYear ? `PG ${a.pgBatchYear}` : null))
        .filter(Boolean)
    )
  ).sort() as string[];

  // Filtered members list
  const filteredLifeMembers = lifeMembers.filter((alumnus) => {
    if (selectedBatch !== "all") {
      const matchUg = alumnus.ugBatchYear && `UG ${alumnus.ugBatchYear}` === selectedBatch;
      const matchPg = alumnus.pgBatchYear && `PG ${alumnus.pgBatchYear}` === selectedBatch;
      if (!matchUg && !matchPg) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = alumnus.fullName.toLowerCase().includes(q) || (alumnus.fullNameHindi || "").toLowerCase().includes(q);
      const matchCity = (alumnus.city || "").toLowerCase().includes(q) || (alumnus.state || "").toLowerCase().includes(q);
      const matchDegree = (alumnus.degree || alumnus.ugDegree || alumnus.pgDegree || "").toLowerCase().includes(q);
      const matchWorkplace = (alumnus.workplace || "").toLowerCase().includes(q);
      return matchName || matchCity || matchDegree || matchWorkplace;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredLifeMembers.length / pageSize) || 1;
  const paginatedMembers = filteredLifeMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================================ */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन, हरिद्वार</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            आजीवन सदस्यता (Lifetime Membership)
          </h1>
          <p className="font-serif-heading text-lg sm:text-xl text-[#C5A059] font-bold mt-2">
            आजन्म सदस्य बनें और अपनी संस्था को बढ़ाने में सहयोग करें।
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            ऋषिकुल एक • पीढ़ियाँ अनेक • कुटुंब एक • विचार अनेक (UK06803112023012256)
          </p>

          {/* Prominent Fee Card */}
          <div className="mt-8 max-w-md mx-auto bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E2] to-[#F4E6CC] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-600" />
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#2D5A43]">
              एकमुश्त आजीवन सदस्यता शुल्क
            </div>
            <div className="text-4xl sm:text-5xl font-serif-heading font-black text-[#0F172A] my-2">
              ₹{settings.lifetimeFee.toLocaleString("en-IN")}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>जीवनभर के लिए वैध (No Recurring Annual Fee)</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. 3-STEP VISUAL PROCESS */}
        {/* ============================================================ */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
              आजीवन सदस्यता प्राप्ति की सरल प्रक्रिया
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              मात्र 3 आसान चरणों में अपनी आजीवन सदस्यता सुनिश्चित करें
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/30 shadow-md flex flex-col items-center text-center relative overflow-hidden group hover:border-[#C5A059] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-serif-heading text-xl font-bold mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-2">
                चरण 1: शुल्क भुगतान
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                आधिकारिक UPI ID अथवा QR Code स्कैन करके ₹{settings.lifetimeFee} का शुल्क ट्रांसफर करें और UTR / Transaction No. नोट करें।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/30 shadow-md flex flex-col items-center text-center relative overflow-hidden group hover:border-[#C5A059] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#2D5A43]/10 border border-[#2D5A43]/30 flex items-center justify-center text-[#2D5A43] font-serif-heading text-xl font-bold mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-2">
                चरण 2: विवरण प्रेषण
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                नीचे दिए गए फॉर्म में अपना नाम, मोबाइल नंबर और Transaction UTR दर्ज करें या सीधे WhatsApp पर रसीद भेजें।
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#C5A059]/30 shadow-md flex flex-col items-center text-center relative overflow-hidden group hover:border-[#C5A059] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 font-serif-heading text-xl font-bold mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-serif-heading text-lg font-bold text-[#0F172A] mb-2">
                चरण 3: एडमिन सत्यापन
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                एसोसिएशन कोषाध्यक्ष / एडमिन द्वारा बैंक मिलान के उपरांत आपका खाता <strong>👑 Life Member</strong> में अपग्रेड हो जाएगा।
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. PAYMENT SECTION (UPI + QR + WARNING + WHATSAPP) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Left: UPI & QR Code */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/40 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C5A059]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                    UPI द्वारा सीधा भुगतान (Pay via UPI)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Google Pay, PhonePe, Paytm, BHIM या किसी भी बैंकिंग UPI ऐप से भुगतान करें
                  </p>
                </div>
              </div>

              {/* UPI ID Card */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Official Association UPI ID
                </span>
                <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#0F172A] break-all select-all">
                    {settings.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#C5A059] hover:text-white text-xs font-bold text-slate-700 transition-colors shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                {/* Mobile Pay Link */}
                <div className="mt-3 text-center sm:text-left">
                  <a
                    href={upiDeepLink}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>मोबाइल UPI ऐप से भुगतान करें (Tap to Pay)</span>
                  </a>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-amber-50/60 to-white p-5 rounded-2xl border border-amber-200">
                <div className="w-40 h-40 bg-white p-2 rounded-2xl border-2 border-[#C5A059] shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={settings.qrImageUrl || "/images/rishikul-sangam-logo.jpg"}
                    alt="Official UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 text-amber-900 text-[11px] font-bold">
                    <QrCode className="w-3 h-3 text-[#C5A059]" />
                    <span>Scan & Pay via any UPI App</span>
                  </div>
                  <h4 className="font-serif-heading text-base font-bold text-[#0F172A]">
                    आधिकारिक क्यूआर कोड (Official QR)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    मोबाइल कैमरे या UPI ऐप स्कैनर से स्कैन कर सीधे ₹{settings.lifetimeFee} का भुगतान करें।
                  </p>
                  <p className="text-[11px] text-amber-900 font-semibold">
                    खाता धारक नाम: <strong>{settings.accountName}</strong>
                  </p>
                </div>
              </div>

              {/* Bank Details (Optional/Supplemental) */}
              {settings.bankName && (
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-[#0F172A]">NEFT / RTGS / IMPS बैंक विवरण:</div>
                  <div>बैंक: <strong>{settings.bankName}</strong> | खाता नाम: <strong>{settings.accountName}</strong></div>
                  <div>खाता संख्या: <span className="font-mono">{settings.accountNumber}</span> | IFSC: <span className="font-mono">{settings.ifscCode}</span></div>
                </div>
              )}
            </div>

            {/* CRITICAL PAYMENT VERIFICATION WARNING */}
            <div className="bg-amber-50/90 rounded-3xl p-6 border-2 border-amber-400 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-800" />
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-amber-950">
                  <h4 className="font-serif-heading text-sm font-bold uppercase tracking-wider text-amber-900">
                    अति आवश्यक भुगतान निर्देश (Payment Verification Notice)
                  </h4>
                  <p>
                    कृपया शुल्क भुगतान केवल <strong>"{settings.accountName}"</strong> के आधिकारिक खाते में ही करें।
                  </p>
                  <p className="bg-white/80 p-3 rounded-xl border border-amber-300">
                    भुगतान के पश्चात अथवा किसी भी संशय/पुष्टि हेतु केवल संस्था के अधिकृत प्रतिनिधि <strong>{settings.contactPersonName}</strong> (मोबाइल: <strong>{settings.contactMobile}</strong>) से ही संपर्क करें।
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact Section */}
            <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-heading text-base font-bold text-emerald-950">
                    सीधे WhatsApp पर संपर्क करें
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {settings.contactPersonName} • +91 {settings.contactMobile}
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Receipt</span>
              </a>
            </div>
          </div>

          {/* Right: Payment Submission Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C5A059]/40 shadow-xl sticky top-24">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-serif-heading text-xl font-bold text-[#0F172A]">
                  भुगतान सूचना दर्ज करें
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                शुल्क भुगतान के पश्चात नीचे अपनी रसीद या UTR विवरण भरें ताकि एडमिन इसे तुरंत सत्यापित कर सके।
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-heading text-lg font-bold text-emerald-950">
                    भुगतान विवरण सफलतापूर्वक प्राप्त हुआ!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    आपके द्वारा प्रेषित UTR क्रमांक <strong>{txnRef}</strong> एसोसिएशन के सत्यापन हेतु सुरक्षित दर्ज कर लिया गया है। बैंक मिलान के पश्चात आपकी प्रोफ़ाइल <strong>Life Member</strong> में सक्रिय हो जाएगी।
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setTxnRef("");
                      setScreenshotUrl("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:underline pt-2"
                  >
                    <span>दूसरा विवरण दर्ज करें</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      पूर्व स्नातक / स्नातकोत्तर का नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. Dr. Vineet Agnihotri"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      मोबाइल नंबर (Mobile Number) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="उदा. 9897284154"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ईमेल पता (Email Address - Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alumni@rishikul.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        सदस्यता प्रकार
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Lifetime Member"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        जमा राशि (Amount)
                      </label>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      बैंक UTR / UPI Transaction Reference No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={txnRef}
                      onChange={(e) => setTxnRef(e.target.value)}
                      placeholder="उदा. 425619284739 या UPI Ref ID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none font-mono text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      भुगतान की तिथि (Date of Payment) *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      रसीद / स्क्रीनशॉट लिंक (Image URL - Optional)
                    </label>
                    <input
                      type="url"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="https://... (Drive or Image Link)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#2D5A43] hover:from-[#2D5A43] hover:to-[#0F172A] text-[#C5A059] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{formSubmitting ? "जमा किया जा रहा है..." : "सत्यापन हेतु विवरण भेजें (Submit)"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. LIFETIME MEMBER BENEFITS */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#C5A059]/30 shadow-xl mb-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Special Privileges & Honor
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
              आजीवन सदस्यता के विशेष लाभ व अधिकार
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              ऋषिकुल स्नातक एवं स्नातकोत्तर संघ के आजीवन सदस्य के रूप में आपको प्राप्त होने वाले विशेषाधिकार
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                👑
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">विशेष गोल्डन प्रोफाइल व पहचान</strong>
                पोर्टल एवं आधिकारिक डायरेक्टरी में आपकी प्रोफ़ाइल सुनहरे आभा (Gold Distinction) एवं "👑 Life Member" बैज के साथ प्रदर्शित होगी।
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                💳
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">विशिष्ट डिजिटल स्मार्ट आईडी कार्ड</strong>
                गहरे एमराल्ड व स्वर्णिम बॉर्डर वाला Tamper-proof डिजिटल पहचान पत्र जिसे आप डाउनलोड व प्रिंट कर सकते हैं।
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                🗳️
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">कार्यकारिणी में मताधिकार व चुनाव</strong>
                एसोसिएशन की आम सभा (General Body) में मतदान करने एवं प्रबंध कार्यकारिणी के पदों हेतु चुनाव लड़ने का पूर्ण अधिकार।
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                🏛️
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">ऋषिकुल परिसर व गेस्ट हाउस प्राथमिकता</strong>
                हरिद्वार आगमन पर ऋषिकुल परिसर, पुस्तकालय एवं अतिथि गृह आरक्षण में प्राथमिकता व विशेष सत्कार।
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                📚
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">CME व सम्मेलनों में रियायत</strong>
                एसोसिएशन द्वारा आयोजित राष्ट्रीय/अंतर्राष्ट्रीय आयुर्वेद संगोष्ठियों, CME एवं सम्मेलनों में विशेष छूट।
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                🤝
              </div>
              <div>
                <strong className="text-slate-900 block text-sm mb-1">संस्था विकास में स्थाई योगदान</strong>
                आपकी सदस्यता राशि सीधे संस्था के सामाजिक, शैक्षणिक एवं संगठनात्मक उत्थान में उपयोग की जाती है।
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. LIFETIME MEMBERS DIRECTORY (Public Showcase without Phone/Email) */}
        {/* ============================================================ */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>ऋषिकुल आजन्म सदस्य गौरव सूची</span>
              </div>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A]">
                हमारे सम्मानित आजीवन सदस्य ({lifeMembers.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                जिन्होंने संस्था को आजीवन सशक्त बनाने में अपना अमूल्य सहयोग प्रदान किया है
              </p>
            </div>

            {/* Search & Batch Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="नाम, शहर या डिग्री से खोजें..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:border-[#C5A059] outline-none text-slate-800 w-48 sm:w-60 shadow-xs"
                />
              </div>

              {batches.length > 0 && (
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 outline-none shadow-xs"
                >
                  <option value="all">सभी बैच ({lifeMembers.length})</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Members Grid */}
          {paginatedMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E2] to-[#F4E6CC] rounded-3xl p-6 border-2 border-[#C5A059] shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#C5A059] to-amber-600" />
                  
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-sm bg-white shrink-0">
                        <img
                          src={member.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 shadow-xs">
                          <Crown className="w-3 h-3 fill-slate-950" />
                          Life Member
                        </span>
                        {member.ugBatchYear && (
                          <span className="text-[10px] font-bold text-slate-600">
                            UG: {member.ugBatchYear}
                          </span>
                        )}
                        {member.pgBatchYear && (
                          <span className="text-[10px] font-bold text-[#2D5A43]">
                            PG: {member.pgBatchYear}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif-heading text-lg font-bold text-[#0F172A] line-clamp-1">
                      {member.fullName}
                    </h3>
                    {member.fullNameHindi && (
                      <div className="text-xs text-amber-900 font-medium line-clamp-1">
                        {member.fullNameHindi}
                      </div>
                    )}
                    <div className="text-xs font-semibold text-[#2D5A43] mt-1 line-clamp-1">
                      {member.degree || member.ugDegree || "BAMS"} {member.specialization ? `• ${member.specialization}` : ""}
                    </div>

                    {member.designation && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                        {member.designation} {member.workplace ? `at ${member.workplace}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#C5A059]/30 flex items-center justify-between text-[11px] text-slate-500">
                    <span>📍 {member.city ? `${member.city}, ${member.state}` : member.state || "India"}</span>
                    <span className="font-mono text-[10px] text-amber-800 font-bold">
                      {member.membershipId || "LM-VERIFIED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-serif-heading text-lg font-bold text-slate-700">
                कोई आजीवन सदस्य नहीं मिला
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                कृपया अन्य खोज शब्द या बैच फ़िल्टर का चयन करें।
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
