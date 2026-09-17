import { AlumniProfile, AssociationEvent, ExecutiveMember, LifetimeAchiever, ShradhanjaliRecord } from "@/types";

export const MOCK_ALUMNI: AlumniProfile[] = [
  {
    id: "alumni-001",
    fullName: "Vaidya Dr. Ramesh Chandra Joshi",
    fullNameHindi: "वैद्य डॉ. रमेश चंद्र जोशी",
    username: "rcjoshi",
    passwordHash: "pass123",
    email: "rc.joshi@ayurmed.org",
    mobile: "+91 98971 23456",
    whatsappNumber: "919897123456",
    dateOfBirth: "1960-09-17", // Today's Birthday!
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    
    // Both UG & PG at Rishikul
    rishikulEducation: "BOTH",
    ugBatchYear: 1979,
    ugDegree: "BAMS",
    pgBatchYear: 1984,
    pgDegree: "MD (Kayachikitsa)",
    specialization: "Kayachikitsa (Internal Medicine)",
    
    // Profession
    jobType: "Govt Job",
    designation: "Former Director General of AYUSH, Uttarakhand",
    workplace: "Charak Ayurvedic Super Specialty Center",
    
    // Address
    city: "Dehradun",
    state: "Uttarakhand",
    address: "14, Rajpur Road, Dehradun",
    country: "India",
    
    bio: "Over 38 years in clinical research and AYUSH policymaking. Proud alumnus of both BAMS and MD batches of Rishikul.",
    membershipId: "RISHI-PAT-0012",
    membershipTier: "Patron Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2018-04-12",
    bloodGroup: "O+",
    connectedAlumniIds: ["alumni-002", "alumni-003", "alumni-005"]
  },
  {
    id: "alumni-002",
    fullName: "Dr. Ananya Sharma (Bhardwaj)",
    fullNameHindi: "डॉ. अनन्या शर्मा (भारद्वाज)",
    username: "ananya.sharma",
    passwordHash: "pass123",
    email: "dr.ananya@panchakarmawellness.in",
    mobile: "+91 98110 54321",
    whatsappNumber: "919811054321",
    dateOfBirth: "1975-09-19", // Upcoming Birthday (in 2 days)
    avatarUrl: "https://images.unsplash.com/photo-1594824813593-18151624c96a?q=80&w=400&auto=format&fit=crop",
    
    // UG only at Rishikul
    rishikulEducation: "UG",
    ugBatchYear: 1998,
    ugDegree: "BAMS",
    specialization: "Panchakarma",
    
    jobType: "Private Practice",
    designation: "Founder & Chief Physician",
    workplace: "Gangotri Panchakarma & Mind-Body Retreat",
    
    city: "Rishikesh",
    state: "Uttarakhand",
    address: "Tapovan, Badrinath Highway, Rishikesh",
    country: "India",
    
    bio: "Pioneering authentic Kerala and Himalayan Panchakarma protocols in Uttarakhand.",
    membershipId: "RISHI-LM-0145",
    membershipTier: "Life Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2020-01-15",
    bloodGroup: "B+",
    connectedAlumniIds: ["alumni-001", "alumni-004", "alumni-006"]
  },
  {
    id: "alumni-003",
    fullName: "Dr. Mahendra Pratap Singh",
    fullNameHindi: "डॉ. महेंद्र प्रताप सिंह",
    username: "mpsingh",
    passwordHash: "pass123",
    email: "dr.mpsingh@shalyasurgical.com",
    mobile: "+91 94120 78901",
    whatsappNumber: "919412078901",
    dateOfBirth: "1968-09-22", // Upcoming Birthday
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    
    // PG only at Rishikul (came for MS Shalya Tantra)
    rishikulEducation: "PG",
    pgBatchYear: 1991,
    pgDegree: "MS (Shalya Tantra)",
    specialization: "Shalya Tantra (Surgery)",
    
    jobType: "Private Practice",
    designation: "Senior Consultant Surgeon & Executive Body Member",
    workplace: "Sushruta Ano-Rectal Surgical Hospital",
    
    city: "Haridwar",
    state: "Uttarakhand",
    address: "Jwalapur Road, Haridwar",
    country: "India",
    
    bio: "Dedicated 30+ years to the development of Shalya Tantra at Rishikul. Over 15,000 successful Ksharasutra procedures.",
    membershipId: "RISHI-LM-0089",
    membershipTier: "Life Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2015-08-20",
    bloodGroup: "A+",
    connectedAlumniIds: ["alumni-001", "alumni-005"]
  },
  {
    id: "alumni-004",
    fullName: "Dr. Priya Nautiyal",
    fullNameHindi: "डॉ. प्रिया नौटियाल",
    username: "priyan",
    passwordHash: "pass123",
    email: "priya.nautiyal@delhiayush.gov.in",
    mobile: "+91 98730 65432",
    whatsappNumber: "919873065432",
    dateOfBirth: "1985-09-17", // Today's Birthday!
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    
    // Both UG and PG at Rishikul
    rishikulEducation: "BOTH",
    ugBatchYear: 2003,
    ugDegree: "BAMS",
    pgBatchYear: 2008,
    pgDegree: "MD (Prasuti Tantra)",
    specialization: "Prasuti & Stri Roga (Obstetrics & Gynecology)",
    
    jobType: "Govt Job",
    designation: "Senior Medical Officer",
    workplace: "Directorate of AYUSH, Govt of NCT Delhi",
    
    city: "New Delhi",
    state: "Delhi",
    address: "Sector 12, RK Puram, New Delhi",
    country: "India",
    
    bio: "Specialist in Ayurvedic reproductive health and integrative maternal care.",
    membershipId: "RISHI-LM-0412",
    membershipTier: "Life Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2021-06-10",
    bloodGroup: "AB+",
    connectedAlumniIds: ["alumni-002", "alumni-006"]
  },
  {
    id: "alumni-005",
    fullName: "Dr. Vikramaditya Rawat",
    fullNameHindi: "डॉ. विक्रमादित्य रावत",
    username: "vrawat",
    passwordHash: "pass123",
    email: "v.rawat@ayurvedicbotanicals.co.uk",
    mobile: "+44 7700 900123",
    whatsappNumber: "447700900123",
    dateOfBirth: "1978-09-24", // Upcoming Birthday
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    
    // PG only at Rishikul
    rishikulEducation: "PG",
    pgBatchYear: 2002,
    pgDegree: "MD (Dravyaguna)",
    specialization: "Dravyaguna (Pharmacology)",
    
    jobType: "Corporate / Industry",
    designation: "Global Research Consultant & Pharmacognosist",
    workplace: "Himalayan Herbals UK & European AYUSH Forum",
    
    city: "London",
    state: "England",
    country: "United Kingdom",
    
    bio: "Promoting authentic Ayurvedic pharmacology across Europe. International Alumni Chapter Lead.",
    membershipId: "RISHI-PAT-0044",
    membershipTier: "Patron Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2019-11-04",
    bloodGroup: "O-",
    connectedAlumniIds: ["alumni-001", "alumni-003"]
  },
  {
    id: "alumni-006",
    fullName: "Dr. Ashutosh Dwivedi",
    fullNameHindi: "डॉ. आशुतोष द्विवेदी",
    username: "ashu.dwivedi",
    passwordHash: "pass123",
    email: "dr.ashutosh@dwivediayurveda.com",
    mobile: "+91 94561 22334",
    whatsappNumber: "919456122334",
    dateOfBirth: "1992-11-04",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    
    // UG only at Rishikul
    rishikulEducation: "UG",
    ugBatchYear: 2016,
    ugDegree: "BAMS",
    specialization: "General Ayurvedic Practice",
    
    jobType: "Private Practice",
    designation: "Medical Director",
    workplace: "Dwivedi Arogya Mandir",
    
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Aliganj, Lucknow",
    country: "India",
    
    bio: "3rd-generation Ayurvedic physician. Youth wing coordinator for Rishikul alumni.",
    membershipId: "RISHI-LM-0782",
    membershipTier: "Life Member",
    isVerified: true,
    approvalStatus: "approved",
    joinedDate: "2022-03-18",
    bloodGroup: "B+",
    connectedAlumniIds: ["alumni-002", "alumni-004"]
  },
  {
    id: "alumni-pending-01",
    fullName: "Dr. Kavita Upadhyay",
    fullNameHindi: "डॉ. कविता उपाध्याय",
    username: "kavita.u",
    passwordHash: "kavita123",
    email: "kavita.upadhyay@ayurcare.org",
    mobile: "+91 97561 88990",
    whatsappNumber: "919756188990",
    dateOfBirth: "1988-03-14",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    
    // Both UG and PG
    rishikulEducation: "BOTH",
    ugBatchYear: 2005,
    ugDegree: "BAMS",
    pgBatchYear: 2010,
    pgDegree: "MD (Kaumarbhritya)",
    specialization: "Kaumarbhritya (Pediatrics)",
    
    jobType: "Govt Job",
    designation: "Consultant Pediatrician",
    workplace: "Govt Hospital Roorkee",
    
    city: "Roorkee",
    state: "Uttarakhand",
    country: "India",
    
    membershipId: "RISHI-PEN-9011",
    membershipTier: "Life Member",
    isVerified: false,
    approvalStatus: "pending",
    joinedDate: "2026-09-15",
    bloodGroup: "O+",
    connectedAlumniIds: []
  },
  {
    id: "alumni-pending-02",
    fullName: "Dr. Deepak Semwal",
    fullNameHindi: "डॉ. दीपक सेमवाल",
    username: "deepak.s",
    passwordHash: "deepak123",
    email: "deepak.semwal@himalayaayur.com",
    mobile: "+91 94111 34567",
    whatsappNumber: "919411134567",
    dateOfBirth: "1972-07-20",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    
    // UG only
    rishikulEducation: "UG",
    ugBatchYear: 1995,
    ugDegree: "BAMS",
    specialization: "Dravyaguna (Pharmacology)",
    
    jobType: "Corporate / Industry",
    designation: "Senior Plant Extract Scientist",
    workplace: "Himalaya Wellness Herbs",
    
    city: "Dehradun",
    state: "Uttarakhand",
    country: "India",
    
    membershipId: "RISHI-PEN-9012",
    membershipTier: "Non-Paid Member",
    isVerified: false,
    approvalStatus: "pending",
    joinedDate: "2026-09-16",
    bloodGroup: "A+",
    connectedAlumniIds: []
  }
];

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
