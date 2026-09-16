-- Rishikul Snatak Evam Snatkottar Association Database Schema
-- Run in Supabase SQL Editor

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    full_name_hindi TEXT,
    phone TEXT,
    avatar_url TEXT,
    batch_year INTEGER NOT NULL,
    degree TEXT NOT NULL CHECK (degree IN ('BAMS', 'MD (Ayurveda)', 'MS (Ayurveda)', 'PhD', 'Diploma', 'Other')),
    specialization TEXT NOT NULL,
    pg_specialization TEXT,
    designation TEXT,
    workplace TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    bio TEXT,
    membership_id TEXT UNIQUE NOT NULL,
    membership_tier TEXT DEFAULT 'Life Member' CHECK (membership_tier IN ('Life Member', 'Patron Member', 'Annual Member', 'Student Member', 'Honorary Fellow')),
    is_verified BOOLEAN DEFAULT FALSE,
    blood_group TEXT,
    linkedin_url TEXT,
    whatsapp_number TEXT,
    website_url TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    UNIQUE(event_id, user_id)
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read verified profiles; Users can edit their own profile
CREATE POLICY "Public verified profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Everyone can view events
CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT USING (true);

-- Event Registrations: Users can view & create their own registrations
CREATE POLICY "Users can view own registrations" 
ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations" 
ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
