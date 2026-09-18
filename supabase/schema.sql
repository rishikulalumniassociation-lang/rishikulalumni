-- ==============================================================================
-- Rishikul Sangam (ऋषिकुल संगम) - Complete Production Database Schema for Supabase
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New query -> RUN
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. Alumni Profiles Table (पंजीकृत पूर्व छात्र)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('alumni-' || floor(extract(epoch from now()) * 1000)::text),
    full_name TEXT NOT NULL,
    full_name_hindi TEXT,
    username TEXT UNIQUE NOT NULL, -- Login username (Mobile Number)
    password_hash TEXT NOT NULL,
    email TEXT,
    mobile TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT DEFAULT 'Male',
    avatar_url TEXT,

    -- Rishikul Education (UG / PG / Both)
    rishikul_education TEXT NOT NULL CHECK (rishikul_education IN ('UG', 'PG', 'BOTH')),
    ug_batch_year INTEGER,
    ug_passout_year INTEGER,
    ug_degree TEXT DEFAULT 'BAMS',
    pg_batch_year INTEGER,
    pg_passout_year INTEGER,
    pg_degree TEXT,
    specialization TEXT,

    -- Ayurveda Clinical Expertise & Guru-Shishya
    is_expert BOOLEAN DEFAULT FALSE,
    disease_specialty TEXT,
    specialty_description TEXT,
    accepting_shishya BOOLEAN DEFAULT FALSE,
    shishya_requirement TEXT,

    -- Professional Details
    job_type TEXT NOT NULL CHECK (job_type IN ('Private Practice', 'Govt Job', 'Retired', 'Teaching / Academia', 'Corporate / Industry', 'Other')),
    designation TEXT,
    workplace TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    country TEXT DEFAULT 'India',

    -- Bio & Achievements
    bio TEXT,
    blood_group TEXT,
    achievements TEXT[],
    special_achievements JSONB DEFAULT '[]'::jsonb,

    -- Extended Social & Network Relations
    work_history JSONB DEFAULT '[]'::jsonb,
    family_alumni_relations JSONB DEFAULT '[]'::jsonb,
    teacher_alumni_ids TEXT[] DEFAULT '{}',
    connected_alumni_ids TEXT[] DEFAULT '{}',

    -- Deceased / Shradhanjali Tracking
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

-- Ensure columns exist even if table was created in an earlier migration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name_hindi TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_expert BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS disease_specialty TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialty_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accepting_shishya BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shishya_requirement TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS special_achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS teacher_alumni_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS connected_alumni_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_deceased BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_demise DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS demise_tribute TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Male';

-- Drop NOT NULL constraint on specialization (for UG alumni who do not have PG specialization)
ALTER TABLE public.profiles ALTER COLUMN specialization DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN specialization SET DEFAULT 'General Ayurvedic Practice';

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile);
CREATE INDEX IF NOT EXISTS idx_profiles_approval ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_dob ON public.profiles(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_profiles_expert ON public.profiles(is_expert) WHERE is_expert = TRUE;

-- ==============================================================================
-- 3. Lifetime Achievers Table (हॉल ऑफ फेम)
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
-- 4. Shradhanjali Memorials Table (श्रद्धांजलि एवं स्मृति शेष)
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
-- 5. Shradhanjali Flower Offerings Table (पुष्पांजलि अर्पण ट्रैकिंग)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.shradhanjali_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shradhanjali_id TEXT NOT NULL REFERENCES public.shradhanjali(id) ON DELETE CASCADE,
    alumni_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    offered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(shradhanjali_id, alumni_id)
);

-- ==============================================================================
-- 6. Password Reset Requests Table (पासवर्ड रीसेट अनुरोध)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
    id TEXT PRIMARY KEY DEFAULT ('reset-' || floor(extract(epoch from now()) * 1000)::text),
    alumni_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    new_password_assigned TEXT
);

-- ==============================================================================
-- 7. Achiever Nominations Table (लाइफटाइम अचीवर नामांकन)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.nominations (
    id TEXT PRIMARY KEY DEFAULT ('nom-' || floor(extract(epoch from now()) * 1000)::text),
    nominee_name TEXT NOT NULL,
    nominee_name_hindi TEXT,
    nominee_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    nominee_batch_year INTEGER,
    nominee_degree TEXT,
    nominee_photo_url TEXT,
    nominee_workplace TEXT,
    nominee_city TEXT,
    achievement_title TEXT NOT NULL,
    citation TEXT NOT NULL,
    awards TEXT[] DEFAULT '{}',
    nominator_id TEXT NOT NULL,
    nominator_name TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_remarks TEXT
);

-- ==============================================================================
-- 8. Community Achievements Table (पूर्व छात्र उपलब्धि पटल)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_achievements (
    id TEXT PRIMARY KEY DEFAULT ('achieve-' || floor(extract(epoch from now()) * 1000)::text),
    alumni_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    alumni_name TEXT NOT NULL,
    alumni_batch TEXT,
    alumni_city TEXT,
    alumni_avatar TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    details TEXT NOT NULL,
    date_posted DATE DEFAULT CURRENT_DATE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.achievement_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_id TEXT NOT NULL REFERENCES public.community_achievements(id) ON DELETE CASCADE,
    alumni_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(achievement_id, alumni_id)
);

-- ==============================================================================
-- 9. Association Events Table (कार्यक्रम एवं अधिवेशन)
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
-- 10. Admin Users Table (सुरक्षित एडमिन क्रेडेंशियल्स)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT ('admin-' || floor(extract(epoch from now()) * 1000)::text),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    "role" TEXT DEFAULT 'Super Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 11. Row Level Security (RLS) & Access Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifetime_achievers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shradhanjali ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shradhanjali_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Anyone can register" ON public.profiles;
    DROP POLICY IF EXISTS "Enable update profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Enable delete profiles" ON public.profiles;

    DROP POLICY IF EXISTS "Public read achievers" ON public.lifetime_achievers;
    DROP POLICY IF EXISTS "Enable all achievers" ON public.lifetime_achievers;

    DROP POLICY IF EXISTS "Public read shradhanjali" ON public.shradhanjali;
    DROP POLICY IF EXISTS "Enable all shradhanjali" ON public.shradhanjali;

    DROP POLICY IF EXISTS "Public read offerings" ON public.shradhanjali_offerings;
    DROP POLICY IF EXISTS "Enable all offerings" ON public.shradhanjali_offerings;

    DROP POLICY IF EXISTS "Enable all reset requests" ON public.password_reset_requests;

    DROP POLICY IF EXISTS "Enable all nominations" ON public.nominations;

    DROP POLICY IF EXISTS "Public read achievements" ON public.community_achievements;
    DROP POLICY IF EXISTS "Enable all achievements" ON public.community_achievements;

    DROP POLICY IF EXISTS "Public read likes" ON public.achievement_likes;
    DROP POLICY IF EXISTS "Enable all likes" ON public.achievement_likes;

    DROP POLICY IF EXISTS "Public can read events" ON public.events;
    DROP POLICY IF EXISTS "Enable all events" ON public.events;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can register" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Enable delete profiles" ON public.profiles FOR DELETE USING (true);

-- Achievers Policies
CREATE POLICY "Public read achievers" ON public.lifetime_achievers FOR SELECT USING (true);
CREATE POLICY "Enable all achievers" ON public.lifetime_achievers FOR ALL USING (true);

-- Shradhanjali Policies
CREATE POLICY "Public read shradhanjali" ON public.shradhanjali FOR SELECT USING (true);
CREATE POLICY "Enable all shradhanjali" ON public.shradhanjali FOR ALL USING (true);

-- Offerings Policies
CREATE POLICY "Public read offerings" ON public.shradhanjali_offerings FOR SELECT USING (true);
CREATE POLICY "Enable all offerings" ON public.shradhanjali_offerings FOR ALL USING (true);

-- Reset Requests Policies
CREATE POLICY "Enable all reset requests" ON public.password_reset_requests FOR ALL USING (true);

-- Nominations Policies
CREATE POLICY "Enable all nominations" ON public.nominations FOR ALL USING (true);

-- Community Achievements Policies
CREATE POLICY "Public read achievements" ON public.community_achievements FOR SELECT USING (true);
CREATE POLICY "Enable all achievements" ON public.community_achievements FOR ALL USING (true);

-- Achievement Likes Policies
CREATE POLICY "Public read likes" ON public.achievement_likes FOR SELECT USING (true);
CREATE POLICY "Enable all likes" ON public.achievement_likes FOR ALL USING (true);

-- Admin Users Policies
CREATE POLICY "Public read admin_users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Enable all admin_users" ON public.admin_users FOR ALL USING (true);

-- Events Policies
CREATE POLICY "Public can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable all events" ON public.events FOR ALL USING (true);

-- ==============================================================================
-- 12. Helper RPC: increment condolences count atomically
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.increment_condolences(record_id TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.shradhanjali
  SET condolences_count = condolences_count + 1
  WHERE id = record_id;
END;
$$;

-- ==============================================================================
-- 13. Seed Data: Jagdish Vats Shradhanjali (अमर शहीद जगदीश वत्स) & Default Admin
-- ==============================================================================
INSERT INTO public.shradhanjali (id, name, name_hindi, batch_year, degree, photo_url, date_of_demise, tribute, condolences_count, posted_by)
VALUES (
    'shradhanjali-martyr',
    'Amar Shaheed Jagdish Vats (अमर शहीद जगदीश वत्स)',
    'अमर शहीद जगदीश वत्स',
    1942,
    'छात्र, ऋषिकुल आयुर्वेदिक कॉलेज (1942)',
    '/images/jagdish-vats.png',
    '1942-08-14',
    '17 वर्षीय तेजस्वी छात्र जगदीश वत्स ने 14 अगस्त 1942 को भारत छोड़ो आंदोलन के दौरान हरिद्वार रेलवे स्टेशन और सुभाष घाट पर ब्रिटिश यूनियन जैक उतारकर तिरंगा फहराया। अंग्रेजी पुलिस की गोलियाँ लगने के बाद भी धोती से हाथ बाँधकर डाकघर पर तिरंगा फहराया और सीने पर गोली खाकर वीरगति को प्राप्त हुए। वे हरिद्वार के प्रथम अमर शहीद हैं।',
    0,
    'ऋषिकुल एल्युमनाई एसोसिएशन एवं संपूर्ण पुरातन छात्र परिवार'
) ON CONFLICT (id) DO NOTHING;

-- Seed default Admin credentials with SHA-256 encrypted passwords
-- "admin" password "rishikul1919" -> a0e94867fe2adf28d7e932e69b99204fc145a0376dad77348cffe9f6cfa2dc84
-- "secretary" password "admin123" -> 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO public.admin_users (id, username, password_hash, "role")
VALUES 
    ('admin-1', 'admin', 'a0e94867fe2adf28d7e932e69b99204fc145a0376dad77348cffe9f6cfa2dc84', 'Super Admin'),
    ('admin-2', 'secretary', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'General Secretary')
ON CONFLICT (username) DO NOTHING;

-- ==============================================================================
-- 14. Community Showcase / Gallery Posts (ऋषिकुल संगम पटल) - Additive
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY DEFAULT ('post-' || floor(extract(epoch from now()) * 1000)::text),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_batch TEXT,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL DEFAULT 'photo',
    category TEXT NOT NULL DEFAULT 'Photos',
    file_url TEXT,
    thumbnail_url TEXT,
    cloudinary_public_id TEXT,
    external_url TEXT,
    file_name TEXT,
    mime_type TEXT,
    file_size BIGINT,
    related_batch TEXT,
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    pin_order INTEGER DEFAULT 0,
    pinned_at TIMESTAMP WITH TIME ZONE,
    pinned_by TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    reports_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_posts_pinned ON public.community_posts(is_pinned, pin_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);

-- Community Post Reports (अनुचित सामग्री रिपोर्टिंग)
CREATE TABLE IF NOT EXISTS public.community_post_reports (
    id TEXT PRIMARY KEY DEFAULT ('report-' || floor(extract(epoch from now()) * 1000)::text),
    post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    reporter_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reporter_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community Post Likes (लाइक्स)
CREATE TABLE IF NOT EXISTS public.community_post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- RLS & Policies for Community Showcase
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read community_posts" ON public.community_posts;
    DROP POLICY IF EXISTS "Enable all community_posts" ON public.community_posts;

    DROP POLICY IF EXISTS "Public read community_post_reports" ON public.community_post_reports;
    DROP POLICY IF EXISTS "Enable all community_post_reports" ON public.community_post_reports;

    DROP POLICY IF EXISTS "Public read community_post_likes" ON public.community_post_likes;
    DROP POLICY IF EXISTS "Enable all community_post_likes" ON public.community_post_likes;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public read community_posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Enable all community_posts" ON public.community_posts FOR ALL USING (true);

CREATE POLICY "Public read community_post_reports" ON public.community_post_reports FOR SELECT USING (true);
CREATE POLICY "Enable all community_post_reports" ON public.community_post_reports FOR ALL USING (true);

CREATE POLICY "Public read community_post_likes" ON public.community_post_likes FOR SELECT USING (true);
CREATE POLICY "Enable all community_post_likes" ON public.community_post_likes FOR ALL USING (true);

