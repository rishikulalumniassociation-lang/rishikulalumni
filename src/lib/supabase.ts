import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback for immediate local testing & deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-rishikul-alumni.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );
};
