'use client';

import React from 'react';
import Link from 'next/link';
import { StackingCardsContainer, StackingCardItem } from './StackingCards';
import { ShieldCheck, HeartHandshake, Award, Users, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const whyCards = [
  {
    number: '01',
    title: 'आजीवन पहचान एवं डिजिटल स्मार्ट कार्ड',
    subtitle: 'Official Institutional Identity & Smart Card',
    description:
      'ऋषिकुल राजकीय आयुर्वेदिक महाविद्यालय के प्रत्येक पूर्व छात्र को प्रमाणित आजीवन सदस्यता क्रमांक और आधिकारिक डिजिटल स्मार्ट कार्ड प्रदान किया जाता है।',
    accent: 'from-[#0F172A] to-[#1E293B]',
    border: 'border-[#C5A059]/40',
    icon: ShieldCheck,
    tag: 'Official Credential',
    textColor: 'text-amber-200',
    link: '/membership/permanent',
    linkText: 'आजीवन सदस्यता विवरण',
  },
  {
    number: '02',
    title: 'गुरु-शिष्य परंपरा एवं नैदानिक मार्गदर्शन',
    subtitle: 'Clinical Mentorship & Guru-Shishya Parampara',
    description:
      'वरिष्ठ विशेषज्ञ वैद्यों और कनिष्ठ चिकित्सकों के मध्य शल्य, क्षारसूत्र, पंचकर्म एवं नाड़ी परीक्षा के दुर्लभ चिकित्सीय अनुभव का सीधा आदान-प्रदान।',
    accent: 'from-[#2D5A43] to-[#1E3E2E]',
    border: 'border-emerald-500/40',
    icon: BookOpen,
    tag: 'Ayurveda Heritage',
    textColor: 'text-emerald-200',
    link: '/directory',
    linkText: 'विशेषज्ञ वैद्यों से जुड़ें',
  },
  {
    number: '03',
    title: '1919 से अब तक के बैचमेट्स से संपर्क',
    subtitle: 'Pan-India & Global Alumni Directory',
    description:
      'अपने प्रवेश वर्ष (UG/PG Batch) के सहपाठियों को खोजें, भारत और विदेश में सेवारत ऋषिकुल बंधुओं से सीधे संपर्क सूत्र स्थापित करें।',
    accent: 'from-[#1E293B] to-[#0F172A]',
    border: 'border-slate-600',
    icon: Users,
    tag: 'Verified Network',
    textColor: 'text-sky-200',
    link: '/directory',
    linkText: 'डायरेक्टरी में खोजें',
  },
  {
    number: '04',
    title: 'वार्षिक महासम्मेलन एवं अकादमिक सेमिनार',
    subtitle: 'Annual Reunions, CMEs & Academic Conclaves',
    description:
      'गंगा तट हरिद्वार में आयोजित होने वाले ऐतिहासिक वार्षिक महासम्मेलन, सिल्वर जुबली समारोह और राष्ट्रीय आयुर्वेद संगोष्ठियों में आधिकारिक भागीदारी।',
    accent: 'from-[#2B1B17] to-[#1E1410]',
    border: 'border-[#C5A059]/50',
    icon: Award,
    tag: 'Centenary Gatherings',
    textColor: 'text-amber-200',
    link: '/events',
    linkText: 'आगामी आयोजन देखें',
  },
  {
    number: '05',
    title: 'आपसी सहयोग, जनकल्याण एवं सम्मान',
    subtitle: 'Fraternity Welfare, Shradhanjali & Hall of Fame',
    description:
      'आयुर्वेद संकाय के गौरवशाली विभूतियों को लाइफटाइम अचीवर सम्मान, दिवंगत बंधुओं को कृतज्ञ श्रद्धांजलि, और विपत्ति में परस्पर बंधुत्व-सहयोग।',
    accent: 'from-[#1A2332] to-[#0F172A]',
    border: 'border-[#C5A059]/40',
    icon: HeartHandshake,
    tag: 'One Family • एक परिवार',
    textColor: 'text-amber-200',
    link: '/achievers',
    linkText: 'विशिष्ट विभूतियाँ देखें',
  },
];

export default function WhyRishikulStack() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#C5A059]/25 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-amber-300 border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>ऋषिकुल संगम क्यों आवश्यक है?</span>
          </div>
          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
            संस्था के 5 मूलभूत आधार
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-light">
            एक शताब्दी से अधिक पुरानी विरासत, 12,000+ स्नातक और एक अखंड पारिवारिक सूत्र।
          </p>
        </div>

        {/* Signature Stacking Cards */}
        <StackingCardsContainer className="mt-8">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <StackingCardItem
                key={card.number}
                index={idx}
                totalCards={whyCards.length}
                topOffset={92}
                stepOffset={20}
              >
                <div
                  className={`bg-gradient-to-br ${card.accent} text-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 ${card.border} shadow-2xl transition-all relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#C5A059]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200/90 block">
                          {card.tag}
                        </span>
                        <h3 className="font-serif-heading text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    <div className="font-serif-heading text-4xl sm:text-5xl font-black text-white/15 tracking-tight self-end sm:self-auto">
                      {card.number}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6 max-w-3xl">
                    {card.description}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className={`text-xs font-medium ${card.textColor}`}>
                      {card.subtitle}
                    </span>

                    <Link
                      href={card.link}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-[#C5A059] text-white hover:text-[#0F172A] text-xs font-bold transition-all border border-white/20"
                    >
                      <span>{card.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </StackingCardItem>
            );
          })}
        </StackingCardsContainer>
      </div>
    </section>
  );
}
