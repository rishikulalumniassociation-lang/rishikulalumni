import { AlumniProfile, AssociationEvent, ExecutiveMember } from "@/types";

export const MOCK_ALUMNI: AlumniProfile[] = [
  {
    id: "alumni-001",
    fullName: "Vaidya Dr. Ramesh Chandra Joshi",
    fullNameHindi: "वैद्य डॉ. रमेश चंद्र जोशी",
    email: "rc.joshi@ayurmed.org",
    phone: "+91 98971 23456",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    batchYear: 1984,
    degree: "MD (Ayurveda)",
    specialization: "Kayachikitsa (Internal Medicine)",
    pgSpecialization: "Rasayana & Chronic Disorders",
    designation: "Former Director General of AYUSH, Uttarakhand",
    workplace: "Charak Ayurvedic Super Specialty Center",
    city: "Dehradun",
    state: "Uttarakhand",
    country: "India",
    bio: "Over 38 years in clinical research, geriatric ayurvedic care, and healthcare policymaking. Proud alumnus of the 1984 batch of Rishikul Govt Ayurvedic College.",
    membershipId: "RISHI-PAT-0012",
    membershipTier: "Patron Member",
    isVerified: true,
    joinedDate: "2018-04-12",
    achievements: [
      "National Dhanwantari Ratna Award (2019)",
      "Published 34 Peer-Reviewed Research Papers",
      "Key contributor to Uttarakhand AYUSH Herbal Policy"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "919897123456",
    websiteUrl: "https://charakayur.org",
    bloodGroup: "O+"
  },
  {
    id: "alumni-002",
    fullName: "Dr. Ananya Sharma (Bhardwaj)",
    fullNameHindi: "डॉ. अनन्या शर्मा (भारद्वाज)",
    email: "dr.ananya@panchakarmawellness.in",
    phone: "+91 98110 54321",
    avatarUrl: "https://images.unsplash.com/photo-1594824813593-18151624c96a?q=80&w=400&auto=format&fit=crop",
    batchYear: 1998,
    degree: "BAMS",
    specialization: "Panchakarma",
    pgSpecialization: "Traditional Detoxification & Neurological Rehab",
    designation: "Founder & Chief Physician",
    workplace: "Gangotri Panchakarma & Mind-Body Retreat",
    city: "Rishikesh",
    state: "Uttarakhand",
    country: "India",
    bio: "Pioneering authentic Kerala and Himalayan Panchakarma protocols in Uttarakhand. Mentoring young Rishikul graduates in entrepreneurial clinic setup.",
    membershipId: "RISHI-LM-0145",
    membershipTier: "Life Member",
    isVerified: true,
    joinedDate: "2020-01-15",
    achievements: [
      "Best Panchakarma Center in Northern India (AYUSH Conclave 2022)",
      "Trained 100+ Panchakarma therapists worldwide"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "919811054321",
    websiteUrl: "https://gangotriayur.com",
    bloodGroup: "B+"
  },
  {
    id: "alumni-003",
    fullName: "Dr. Mahendra Pratap Singh",
    fullNameHindi: "डॉ. महेंद्र प्रताप सिंह",
    email: "dr.mpsingh@shalyasurgical.com",
    phone: "+91 94120 78901",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    batchYear: 1991,
    degree: "MS (Ayurveda)",
    specialization: "Shalya Tantra (Surgery)",
    pgSpecialization: "Ksharasutra Therapy & Ano-Rectal Surgery",
    designation: "Professor & Head of Department, Shalya Tantra",
    workplace: "Rishikul Govt Ayurvedic College & Hospital",
    city: "Haridwar",
    state: "Uttarakhand",
    country: "India",
    bio: "Dedicated 30+ years to the academic and clinical development of Shalya Tantra at Rishikul. Over 15,000 successful Ksharasutra procedures.",
    membershipId: "RISHI-LM-0089",
    membershipTier: "Life Member",
    isVerified: true,
    joinedDate: "2015-08-20",
    achievements: [
      "Sushruta Gold Medal for Excellence in Surgery",
      "Executive Committee Member, Rishikul Alumni Association"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "919412078901",
    bloodGroup: "A+"
  },
  {
    id: "alumni-004",
    fullName: "Dr. Priya Nautiyal",
    fullNameHindi: "डॉ. प्रिया नौटियाल",
    email: "priya.nautiyal@delhiayush.gov.in",
    phone: "+91 98730 65432",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    batchYear: 2008,
    degree: "MD (Ayurveda)",
    specialization: "Prasuti & Stri Roga (Obstetrics & Gynecology)",
    designation: "Senior Medical Officer",
    workplace: "Directorate of AYUSH, Govt of NCT Delhi",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    bio: "Specialist in Ayurvedic reproductive health, Garbh Sanskar protocols, and integrative maternal wellbeing.",
    membershipId: "RISHI-LM-0412",
    membershipTier: "Life Member",
    isVerified: true,
    joinedDate: "2021-06-10",
    achievements: [
      "AYUSH Woman Leadership Award 2023",
      "Author of 'Ayurvedic Garbhadhana Vidhi' handbook"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "919873065432",
    bloodGroup: "AB+"
  },
  {
    id: "alumni-005",
    fullName: "Dr. Vikramaditya Rawat",
    fullNameHindi: "डॉ. विक्रमादित्य रावत",
    email: "v.rawat@ayurvedicbotanicals.co.uk",
    phone: "+44 7700 900123",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    batchYear: 2002,
    degree: "MD (Ayurveda)",
    specialization: "Dravyaguna (Pharmacology)",
    pgSpecialization: "Himalayan Medicinal Herb Preservation",
    designation: "Global Research Consultant & Pharmacognosist",
    workplace: "Himalayan Herbals UK & European AYUSH Forum",
    city: "London",
    state: "England",
    country: "United Kingdom",
    bio: "Promoting authentic Ayurvedic pharmacology and international quality standardization across Europe and the UK. Active Rishikul International Alumni Chapter Lead.",
    membershipId: "RISHI-PAT-0044",
    membershipTier: "Patron Member",
    isVerified: true,
    joinedDate: "2019-11-04",
    achievements: [
      "Advisor to European Ayurveda Medical Association",
      "Established UK-Uttarakhand Medicinal Plants Exchange"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "447700900123",
    websiteUrl: "https://ayurvedicbotanicals.co.uk",
    bloodGroup: "O-"
  },
  {
    id: "alumni-006",
    fullName: "Dr. Ashutosh Dwivedi",
    fullNameHindi: "डॉ. आशुतोष द्विवेदी",
    email: "dr.ashutosh@dwivediayurveda.com",
    phone: "+91 94561 22334",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    batchYear: 2016,
    degree: "BAMS",
    specialization: "General Ayurvedic Practice",
    designation: "Medical Director",
    workplace: "Dwivedi Arogya Mandir",
    city: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    bio: "3rd-generation Ayurvedic physician continuing family lineage blended with modern clinical documentation. Youth wing coordinator for Rishikul alumni.",
    membershipId: "RISHI-LM-0782",
    membershipTier: "Life Member",
    isVerified: true,
    joinedDate: "2022-03-18",
    achievements: [
      "Young Vaidya Innovator Award 2024",
      "Free medical camps in rural Tehri Garhwal"
    ],
    linkedinUrl: "https://linkedin.com",
    whatsappNumber: "919456122334",
    bloodGroup: "B+"
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
    venue: "Main Auditorium, Rishikul Ayurvedic College Campus, Haridwar",
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
    message: "Rishikul is not just our alma mater; it is the spiritual crucible where our medical consciousness was born under the blessing of the Holy Ganges."
  },
  {
    id: "exec-2",
    name: "Dr. Sunita Pant",
    role: "General Secretary",
    batch: "Batch of 1993",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    location: "Rishikesh",
    message: "We are committed to building an institutional bridge uniting senior stalwarts with vibrant young graduates across India and abroad."
  },
  {
    id: "exec-3",
    name: "Dr. Harish Chandra Nautiyal",
    role: "Treasurer",
    batch: "Batch of 1989",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    location: "Haridwar",
    message: "Transparency and alumni welfare funds remain our top fiduciary priority, sponsoring poor patients and scholarship programs."
  },
  {
    id: "exec-4",
    name: "Dr. Arvind Bhatt",
    role: "Vice President",
    batch: "Batch of 1982",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    location: "New Delhi",
    message: "Bridging government policies with clinical field reality through the collective strength of thousands of Rishikul graduates."
  }
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
