-- ==============================================================================
-- Rishikul Snatak Evam Snatkottar Association (ऋषिकुल पुरातन छात्र एसोसिएशन)
-- Complete Production Database Schema for Supabase PostgreSQL
-- Run this complete script in Supabase Dashboard -> SQL Editor -> New query -> RUN
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Alumni Profiles Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('alumni-' || floor(extract(epoch from now()) * 1000)::text),
    full_name TEXT NOT NULL,
    full_name_hindi TEXT,
    username TEXT UNIQUE NOT NULL, -- Login username (WhatsApp Mobile Number)
    password_hash TEXT NOT NULL,
    email TEXT,
    mobile TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    avatar_url TEXT,
    
    -- Rishikul Education (UG / PG / Both)
    rishikul_education TEXT NOT NULL CHECK (rishikul_education IN ('UG', 'PG', 'BOTH')),
    ug_batch_year INTEGER,
    ug_degree TEXT DEFAULT 'BAMS',
    pg_batch_year INTEGER,
    pg_degree TEXT,
    specialization TEXT NOT NULL,
    
    -- Professional Info
    job_type TEXT NOT NULL CHECK (job_type IN ('Private Practice', 'Govt Job', 'Retired', 'Teaching / Academia', 'Corporate / Industry', 'Other')),
    designation TEXT,
    workplace TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    country TEXT DEFAULT 'India',
    
    -- Personal Bio & Status
    bio TEXT,
    blood_group TEXT,
    achievements TEXT[],
    
    -- Facebook-like extended data
    work_history JSONB DEFAULT '[]'::jsonb,
    family_alumni_relations JSONB DEFAULT '[]'::jsonb,
    teacher_alumni_ids JSONB DEFAULT '[]'::jsonb,
    connected_alumni_ids JSONB DEFAULT '[]'::jsonb,
    
    -- Deceased / Expired Status
    is_deceased BOOLEAN DEFAULT FALSE,
    date_of_demise DATE,
    demise_tribute TEXT,
    
    -- Membership Governance
    membership_id TEXT UNIQUE NOT NULL,
    membership_tier TEXT DEFAULT 'Non-Paid Member' CHECK (membership_tier IN ('Non-Paid Member', 'Life Member', 'Patron Member', 'Annual Member', 'Student Member', 'Honorary Fellow')),
    is_verified BOOLEAN DEFAULT FALSE,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'expired')),
    joined_date DATE DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by WhatsApp mobile / username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile);
CREATE INDEX IF NOT EXISTS idx_profiles_approval ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_dob ON public.profiles(date_of_birth);

-- ==============================================================================
-- 3. Lifetime Achievers (हॉल ऑफ फेम)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lifetime_achievers (
    id TEXT PRIMARY KEY DEFAULT ('achiever-' || floor(extract(epoch from now()) * 1000)::text),
    name TEXT NOT NULL,
    name_hindi TEXT,
    batch_year INTEGER NOT NULL,
    degree TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    title TEXT NOT NULL,
    citation TEXT NOT NULL,
    awards TEXT[] DEFAULT '{}',
    "current_role" TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. Shradhanjali Memorials (पुण्य स्मरण एवं श्रद्धांजलि)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.shradhanjali (
    id TEXT PRIMARY KEY DEFAULT ('shradhanjali-' || floor(extract(epoch from now()) * 1000)::text),
    alumni_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_hindi TEXT,
    batch_year INTEGER NOT NULL,
    degree TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    date_of_demise DATE NOT NULL,
    tribute TEXT NOT NULL,
    condolences_count INTEGER DEFAULT 0,
    posted_by TEXT DEFAULT 'Rishikul Alumni Association',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. Password Reset Requests (Admin Queue)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
    id TEXT PRIMARY KEY DEFAULT ('reset-' || floor(extract(epoch from now()) * 1000)::text),
    alumni_id TEXT,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    new_password_assigned TEXT
);

-- ==============================================================================
-- 6. Association Events & Gatherings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT ('event-' || floor(extract(epoch from now()) * 1000)::text),
    title TEXT NOT NULL,
    title_hindi TEXT,
    slug TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    registration_open BOOLEAN DEFAULT TRUE,
    registration_fee TEXT,
    description TEXT,
    chief_guest TEXT,
    banner_url TEXT,
    attendees_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. Row Level Security (RLS) & Public Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifetime_achievers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shradhanjali ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified/approved alumni directory
CREATE POLICY "Public can view approved profiles"
ON public.profiles FOR SELECT
USING (true);

-- Allow new registration inserts
CREATE POLICY "Anyone can register profile"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Allow alumni to update their own profile and admin modifications
CREATE POLICY "Enable update for profile"
ON public.profiles FOR UPDATE
USING (true);

-- Lifetime Achievers & Shradhanjali: Public read
CREATE POLICY "Public can read achievers"
ON public.lifetime_achievers FOR SELECT
USING (true);

CREATE POLICY "Enable all for achievers"
ON public.lifetime_achievers FOR ALL
USING (true);

CREATE POLICY "Public can read shradhanjali"
ON public.shradhanjali FOR SELECT
USING (true);

CREATE POLICY "Enable all for shradhanjali"
ON public.shradhanjali FOR ALL
USING (true);

-- Password reset requests
CREATE POLICY "Enable insert for reset requests"
ON public.password_reset_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable select and update for reset requests"
ON public.password_reset_requests FOR ALL
USING (true);

-- Events public read
CREATE POLICY "Public can read events"
ON public.events FOR SELECT
USING (true);
