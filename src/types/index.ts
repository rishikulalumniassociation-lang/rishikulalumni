export type DegreeType = 'BAMS' | 'MD (Ayurveda)' | 'MS (Ayurveda)' | 'PhD' | 'Diploma' | 'Other';

export type MembershipTier = 'Life Member' | 'Patron Member' | 'Annual Member' | 'Student Member' | 'Honorary Fellow';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type Specialization = 
  | 'Kayachikitsa (Internal Medicine)'
  | 'Panchakarma'
  | 'Shalya Tantra (Surgery)'
  | 'Shalakya Tantra (ENT & Ophthalmology)'
  | 'Prasuti & Stri Roga (Obstetrics & Gynecology)'
  | 'Kaumarbhritya (Pediatrics)'
  | 'Dravyaguna (Pharmacology)'
  | 'Rasa Shastra & Bhaishajya Kalpana'
  | 'Sharir Kriya (Physiology)'
  | 'Sharir Rachana (Anatomy)'
  | 'Samhita & Siddhanta'
  | 'Swasthavritta & Yoga'
  | 'Agada Tantra (Toxicology)'
  | 'General Ayurvedic Practice';

export interface AlumniProfile {
  id: string;
  fullName: string;
  fullNameHindi?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD for birthday tracking
  avatarUrl?: string;
  batchYear: number;
  degree: DegreeType;
  specialization: Specialization;
  pgSpecialization?: string;
  designation: string;
  workplace: string;
  city: string;
  state: string;
  country: string;
  bio?: string;
  membershipId: string;
  membershipTier: MembershipTier;
  isVerified: boolean;
  approvalStatus: ApprovalStatus;
  joinedDate: string;
  achievements?: string[];
  linkedinUrl?: string;
  whatsappNumber?: string;
  websiteUrl?: string;
  bloodGroup?: string;
  connectedAlumniIds?: string[]; // IDs of batchmates/colleagues connected
}

export interface LifetimeAchiever {
  id: string;
  name: string;
  nameHindi?: string;
  batchYear: number;
  degree: string;
  photoUrl: string;
  title: string;
  citation: string;
  awards: string[];
  currentRole: string;
  orderIndex: number;
}

export interface ShradhanjaliRecord {
  id: string;
  name: string;
  nameHindi?: string;
  batchYear: number;
  degree: string;
  photoUrl: string;
  dateOfDemise: string; // YYYY-MM-DD
  tribute: string;
  condolencesCount: number;
  postedBy?: string;
}

export interface AssociationEvent {
  id: string;
  title: string;
  titleHindi?: string;
  slug: string;
  eventType: 'Annual Reunion' | 'CME Conference' | 'Silver Jubilee' | 'Webinar' | 'General Body Meeting';
  date: string;
  time: string;
  venue: string;
  city: string;
  isOnline: boolean;
  registrationOpen: boolean;
  registrationFee: string;
  description: string;
  chiefGuest?: string;
  bannerUrl: string;
  attendeesCount: number;
  schedule?: { time: string; activity: string }[];
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  batch: string;
  photo: string;
  location: string;
  message?: string;
}

export interface DirectoryFilterState {
  searchQuery: string;
  batchYear: string;
  specialization: string;
  state: string;
  city: string;
  membershipTier: string;
}
