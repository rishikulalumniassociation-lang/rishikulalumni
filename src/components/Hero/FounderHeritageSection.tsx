"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Flag, Heart, Award, Shield, ArrowRight } from "lucide-react";

export default function FounderHeritageSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#C5A059]/30 relative overflow-hidden">
      {/* Subtle Background Ayurvedic Mandala Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#2D5A43]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-[#FAF7F2] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>ऋषिकुल का अमर इतिहास एवं प्रेरणापुंज</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            संस्थापक एवं अमर बलिदानी छात्र
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            भारत रत्न महामना पंडित मदन मोहन मालवीय जी की अमृत दृष्टि और 17 वर्षीय अमर बलिदानी छात्र जगदीश वत्स जी का सर्वोच्च राष्ट्र-समर्पण — ऋषिकुल के प्रत्येक पुरातन छात्र के लिए शाश्वत प्रेरणा है।
          </p>
        </div>

        {/* Two Grand Pillars: Founder & The Martyr Student */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          
          {/* PILLAR 1: Mahamana Pandit Madan Mohan Malaviya */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-[#C5A059]/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#C5A059] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                {/* Photo with Gold Ring */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-lg flex-shrink-0 bg-slate-900 relative">
                  <img
                    src="/images/madan-mohan-malviya.webp"
                    alt="Mahamana Pandit Madan Mohan Malaviya"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold text-amber-200">
                    भारत रत्न
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                    संस्थापक एवं संरक्षक • Founder Visionary
                  </span>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight">
                    महामना पं. मदन मोहन मालवीय
                  </h3>
                  <p className="text-xs text-[#2D5A43] font-semibold mt-1">
                    Mahamana Pandit Madan Mohan Malaviya (1861–1946)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    भारत रत्न, स्वतंत्रता सेनानी एवं प्रणेता, ऋषिकुल आयुर्वेद (1919)
                  </p>
                </div>
              </div>

              {/* Founder Narrative */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-light mb-6">
                <p>
                  हरिद्वार की पावन गंगा के तट पर आयुर्वेद के पुनरुत्थान और भारतीय वैदिक चिकित्सा पद्धति को औपनिवेशिक पराधीनता से मुक्त कर विश्व पटल पर स्थापित करने के लिए महामना ने <strong>सन 1919</strong> में ऋषिकुल की आधारशिला रखी।
                </p>
                <p>
                  मालवीय जी का स्पष्ट स्वप्न था कि यहाँ से ऐसे वैद्य और शल्य-चिकित्सक (Ayurvedic Physicians & Surgeons) तैयार हों जो आधुनिक विज्ञान और चरक-सुश्रुत की प्राचीन सनातन परंपरा दोनों में अद्वितीय हों। आज ऋषिकुल के 12,000+ पूर्व छात्र उसी पावन संकल्प का प्रत्यक्ष विस्तार हैं।
                </p>
              </div>
            </div>

            {/* Founder Quote */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30">
              <blockquote className="font-serif-heading text-sm sm:text-base text-[#0F172A] italic">
                “आयुर्वेद केवल एक चिकित्सा पद्धति नहीं, अपितु सम्पूर्ण मानव जाति के आरोग्य और दीर्घायु का सनातन विज्ञान है।”
              </blockquote>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mt-1">
                — महामना मालवीय जी का ऋषिकुल हेतु संदेश
              </span>
            </div>
          </div>

          {/* PILLAR 2: Martyr Jagdish Vats (Student of Rishikul Ayurvedic College) */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-red-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-red-400 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                {/* Memorial Photo / Badge */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-red-500 shadow-lg flex-shrink-0 bg-slate-800 relative">
                  <img
                    src="/images/jagdish-vats.png"
                    alt="Martyr Jagdish Vats - Student of Rishikul 1942"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold text-red-300 flex items-center gap-1">
                    <Flag className="w-3 h-3 text-red-500" />
                    अमर बलिदानी छात्र
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-400 block mb-1 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    1942 भारत छोड़ो आंदोलन के अमर शहीद
                  </span>
                  <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                    अमर शहीद जगदीश वत्स
                  </h3>
                  <p className="text-xs text-amber-200 font-semibold mt-1">
                    Shaheed Jagdish Vats (1925 – 14 अगस्त 1942)
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    छात्र, ऋषिकुल राजकीय आयुर्वेदिक कॉलेज • हरिद्वार के प्रथम शहीद
                  </p>
                </div>
              </div>

              {/* Martyr Story */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
                <p>
                  ऋषिकुल आयुर्वेदिक कॉलेज के 17 वर्षीय तेजस्वी छात्र <strong>जगदीश वत्स</strong> ने 14 अगस्त 1942 को गांधीजी के 'करो या मरो' आह्वान पर हरिद्वार में क्रांति का बिगुल फूँका। उन्होंने ब्रिटिश हुकूमत का यूनियन जैक उतारकर तिरंगा फहराने का अदम्य साहस दिखाया।
                </p>
                <p>
                  सुभाष घाट और रेलवे स्टेशन पर अंग्रेजी पुलिस ने उन पर गोलियाँ चलाईं। हाथ में गोली लगने के बाद भी इस वीर छात्र ने अपनी धोती से घाव बाँधा, तिरंगे को नीचे नहीं गिरने दिया और आगे बढ़कर डाकघर पर पुनः तिरंगा लहराया, जहाँ सीने में गोलियाँ खाकर उन्होंने देश के लिए अपना सर्वोच्च बलिदान दिया।
                </p>
              </div>
            </div>

            {/* Tribute Ribbon */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-200">
                    हरिद्वार का पहला शहीद स्मारक (भल्ला पार्क)
                  </div>
                  <div className="text-[10px] text-slate-300">
                    ऋषिकुल एल्युमनाई एसोसिएशन अपने इस अमर बलिदानी छात्र को शत-शत नमन करती है।
                  </div>
                </div>
                <Link
                  href="/shradhanjali"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap"
                >
                  श्रद्धांजलि दें
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
