import { AlumniProfile, AssociationEvent, ExecutiveMember, LifetimeAchiever, ShradhanjaliRecord } from "@/types";

export const MOCK_ALUMNI: AlumniProfile[] = [];


export const INITIAL_ACHIEVERS: LifetimeAchiever[] = [];

export const INITIAL_SHRADHANJALI: ShradhanjaliRecord[] = [
  {
    id: "shradhanjali-martyr",
    name: "Amar Shaheed Jagdish Vats (अमर शहीद जगदीश वत्स)",
    nameHindi: "अमर शहीद जगदीश वत्स",
    batchYear: 1942,
    degree: "छात्र, ऋषिकुल आयुर्वेदिक कॉलेज (1942)",
    photoUrl: "/images/jagdish-vats.png",
    dateOfDemise: "1942-08-14",
    tribute: "17 वर्षीय तेजस्वी छात्र जगदीश वत्स ने 14 अगस्त 1942 को भारत छोड़ो आंदोलन के दौरान हरिद्वार रेलवे स्टेशन और सुभाष घाट पर ब्रिटिश यूनियन जैक उतारकर तिरंगा फहराया। अंग्रेजी पुलिस की गोलियाँ लगने के बाद भी धोती से हाथ बाँधकर डाकघर पर तिरंगा फहराया और सीने पर गोली खाकर वीरगति को प्राप्त हुए। वे हरिद्वार के प्रथम अमर शहीद हैं।",
    condolencesCount: 0,
    postedBy: "ऋषिकुल स्नातक एवं स्नातकोत्तर एसोसिएशन एवं संपूर्ण पूर्व स्नातक / स्नातकोत्तर परिवार"
  }
];

export const MOCK_EVENTS: AssociationEvent[] = [];

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
  "Roganidan evum Vikriti Vigyan (Pathology & Diagnostics)",
  "Sharir Kriya (Physiology)",
  "Sharir Rachana (Anatomy)",
  "Samhita & Siddhanta",
  "Swasthavritta & Yoga",
  "Agada Tantra evum Vidhi Vaidyaka (Toxicology & Medical Jurisprudence)",
  "General Ayurvedic Practice"
];

export const BATCH_YEARS = [
  "All Batches",
  ...Array.from({ length: 2026 - 1950 + 1 }, (_, i) => String(2026 - i))
];
