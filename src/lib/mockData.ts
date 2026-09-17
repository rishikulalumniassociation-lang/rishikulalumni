import { AlumniProfile, AssociationEvent, ExecutiveMember, LifetimeAchiever, ShradhanjaliRecord } from "@/types";

export const MOCK_ALUMNI: AlumniProfile[] = [];


export const INITIAL_ACHIEVERS: LifetimeAchiever[] = [
  {
    id: "achiever-1",
    name: "Padma Bhushan Vaidya Devendra Triguna",
    nameHindi: "पद्म भूषण वैद्य देवेंद्र त्रिगुणा",
    batchYear: 1971,
    degree: "Ayurvedacharya (BAMS)",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    title: "Legendary Nadi Pariksha Master & National AYUSH Leader",
    citation: "Honored with Padma Shri and Padma Bhushan by the President of India. Renowned globally for pulse diagnosis and representing Ayurveda at WHO.",
    awards: ["Padma Bhushan (2009)", "Padma Shri (1999)", "Dhanvantari Award"],
    currentRole: "President, All India Ayurvedic Congress",
    orderIndex: 1
  },
  {
    id: "achiever-2",
    name: "Prof. (Dr.) Satya Prakash Gupta",
    nameHindi: "प्रो. (डॉ.) सत्य प्रकाश गुप्ता",
    batchYear: 1965,
    degree: "MD (Ayurveda), PhD",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    title: "Doyen of Rasashastra & Ayurvedic Pharmacology",
    citation: "Authored 12 definitive textbook volumes on Bhaishajya Kalpana used across 80+ universities. Mentored over 140 postgraduate scholars and PhDs.",
    awards: ["Rashtriya Vaidya Ratna", "Charak International Scholar Medal"],
    currentRole: "Professor Emeritus & Chair, Herbal Pharmacopoeia Committee",
    orderIndex: 2
  },
  {
    id: "achiever-3",
    name: "Dr. Sunita Pant (Bhardwaj)",
    nameHindi: "डॉ. सुनीता पंत (भारद्वाज)",
    batchYear: 1983,
    degree: "MS (Shalya Tantra)",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    title: "Pioneering Woman Surgeon & Ksharasutra Specialist",
    citation: "One of the earliest women surgeons to master and standardize Ksharasutra technique in Northern India, serving over 25,000 patients without surgery recurrence.",
    awards: ["Uttarakhand Mahila Gaurav Samman", "Sushruta Gold Seal"],
    currentRole: "Director, Ganga Anorectal Surgical Research Institute",
    orderIndex: 3
  }
];

export const INITIAL_SHRADHANJALI: ShradhanjaliRecord[] = [
  {
    id: "shradhanjali-martyr",
    name: "Amar Shaheed Jagdish Vats (अमर शहीद जगदीश वत्स)",
    nameHindi: "अमर शहीद जगदीश वत्स",
    batchYear: 1942,
    degree: "छात्र, ऋषिकुल आयुर्वेदिक कॉलेज (1942)",
    photoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop",
    dateOfDemise: "1942-08-14",
    tribute: "17 वर्षीय तेजस्वी छात्र जगदीश वत्स ने 14 अगस्त 1942 को भारत छोड़ो आंदोलन के दौरान हरिद्वार रेलवे स्टेशन और सुभाष घाट पर ब्रिटिश यूनियन जैक उतारकर तिरंगा फहराया। अंग्रेजी पुलिस की गोलियाँ लगने के बाद भी धोती से हाथ बाँधकर डाकघर पर तिरंगा फहराया और सीने पर गोली खाकर वीरगति को प्राप्त हुए। वे हरिद्वार के प्रथम अमर शहीद हैं।",
    condolencesCount: 540,
    postedBy: "ऋषिकुल एल्युमनाई एसोसिएशन एवं संपूर्ण पुरातन छात्र परिवार"
  },
  {
    id: "shradhanjali-1",
    name: "Late Vaidya Dr. Harish Chandra Sharma",
    nameHindi: "स्व. वैद्य डॉ. हरीश चंद्र शर्मा",
    batchYear: 1962,
    degree: "BAMS (Gold Medalist)",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    dateOfDemise: "2025-11-12",
    tribute: "A stalwart of pure classical Ayurveda who dedicated 55 years of unselfish service at Haridwar. His legendary diagnosis without fees for the needy continues to inspire generations.",
    condolencesCount: 148,
    postedBy: "Association Executive Committee"
  },
  {
    id: "shradhanjali-2",
    name: "Late Dr. Birendra Singh Rawat",
    nameHindi: "स्व. डॉ. बीरेंद्र सिंह रावत",
    batchYear: 1977,
    degree: "MD (Kayachikitsa)",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    dateOfDemise: "2026-02-04",
    tribute: "Former Chief Medical Officer (CMO), Tehri Garhwal. A noble soul who championed free medical relief across disaster-hit Himalayan valleys.",
    condolencesCount: 92,
    postedBy: "Batch of 1977"
  }
];

export const MOCK_EVENTS: AssociationEvent[] = [
  {
    id: "event-001",
    title: "Maha Kumbh 2025 Alumni Conclave & Grand Golden Jubilee Meet",
    titleHindi: "महा कुंभ 2025 पुरातन छात्र महासम्मेलन एवं स्वर्ण जयंती समारोह",
    slug: "maha-kumbh-2025-alumni-conclave",
    eventType: "Annual Reunion",
    date: "November 14-16, 2025",
    time: "09:30 AM - 06:00 PM IST",
    venue: "Main Auditorium, Rishikul Campus, Haridwar",
    city: "Haridwar",
    isOnline: false,
    registrationOpen: true,
    registrationFee: "₹1,500 (Free for Patron Members)",
    description: "The grandest gathering in the history of Rishikul Snatak Evam Snatkottar Association. Felicitating batches from 1950 to 2024, honoring distinguished veteran vaidyas, Ganga Aarti on Malviya Dweep, and special souvenir release.",
    chiefGuest: "Hon'ble Union Minister of AYUSH, Govt. of India & Chief Minister of Uttarakhand",
    bannerUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    attendeesCount: 540,
    schedule: [
      { time: "Day 1 - 09:30 AM", activity: "Traditional Dhanwantari Vandana & Inaugural Lamp Lighting" },
      { time: "Day 1 - 11:30 AM", activity: "Keynote Address: Ayurveda's Global Century & Rishikul's Legacy" },
      { time: "Day 1 - 05:30 PM", activity: "Alumni Holy Ganga Aarti at Har Ki Pauri / Malviya Dweep" },
      { time: "Day 2 - 10:00 AM", activity: "Batch-wise Felicitation (Golden & Silver Jubilee Batches)" },
      { time: "Day 2 - 02:00 PM", activity: "Interactive Clinical Innovations Panel & Career Mentorship" },
      { time: "Day 3 - 11:00 AM", activity: "General Body Meeting & Association Elections" }
    ]
  },
  {
    id: "event-002",
    title: "National CME on Integrative Shalya Tantra & Ksharasutra Advances",
    titleHindi: "राष्ट्रीय सीएमई: एकीकृत शल्य तंत्र एवं क्षारसूत्र उन्नत तकनीक",
    slug: "cme-shalya-tantra-advances",
    eventType: "CME Conference",
    date: "August 22, 2025",
    time: "10:00 AM - 04:30 PM IST",
    venue: "Dhanwantari Seminar Hall, Rishikul Campus & Hybrid Zoom Live",
    city: "Haridwar",
    isOnline: true,
    registrationOpen: true,
    registrationFee: "₹500 (Earn 4 CME Credit Hours)",
    description: "Accredited Continuing Medical Education symposium showcasing surgical protocols, live surgical demonstrations of complicated fistula-in-ano, and paper presentations.",
    chiefGuest: "Padma Shri Vaidya Balendu Prakash",
    bannerUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    attendeesCount: 320
  }
];

export const EXECUTIVE_MEMBERS: ExecutiveMember[] = [
  {
    id: "exec-1",
    name: "Dr. K.P. Joshi",
    role: "President, Alumni Association",
    batch: "Batch of 1978",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    location: "Haridwar / Dehradun",
    message: "Rishikul is our lifelong fraternity uniting thousands of vaidyas across the globe."
  },
  {
    id: "exec-2",
    name: "Dr. Sunita Pant",
    role: "General Secretary",
    batch: "Batch of 1993",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    location: "Rishikesh",
    message: "We are committed to building an institutional bridge uniting senior stalwarts with vibrant young graduates."
  },
  {
    id: "exec-3",
    name: "Dr. Harish Chandra Nautiyal",
    role: "Treasurer",
    batch: "Batch of 1989",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    location: "Haridwar",
    message: "Transparency and alumni welfare funds remain our top fiduciary priority."
  },
  {
    id: "exec-4",
    name: "Dr. Arvind Bhatt",
    role: "Vice President",
    batch: "Batch of 1982",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    location: "New Delhi",
    message: "Bridging healthcare policies with clinical field reality through the collective strength of Rishikul graduates."
  }
];

export const JOB_TYPE_OPTIONS = [
  "All Job Types",
  "Private Practice",
  "Govt Job",
  "Retired",
  "Teaching / Academia",
  "Corporate / Industry",
  "Other"
];

export const SPECIALIZATION_OPTIONS = [
  "All Specializations",
  "Kayachikitsa (Internal Medicine)",
  "Panchakarma",
  "Shalya Tantra (Surgery)",
  "Shalakya Tantra (ENT & Ophthalmology)",
  "Prasuti & Stri Roga (Obstetrics & Gynecology)",
  "Kaumarbhritya (Pediatrics)",
  "Dravyaguna (Pharmacology)",
  "Rasa Shastra & Bhaishajya Kalpana",
  "Sharir Kriya (Physiology)",
  "Sharir Rachana (Anatomy)",
  "Samhita & Siddhanta",
  "Swasthavritta & Yoga",
  "Agada Tantra (Toxicology)",
  "General Ayurvedic Practice"
];

export const BATCH_YEARS = [
  "All Batches",
  "2024", "2023", "2022", "2021", "2020",
  "2019", "2018", "2017", "2016", "2015",
  "2010-2014", "2005-2009", "2000-2004",
  "1990-1999", "1980-1989", "1970-1979", "Before 1970"
];
