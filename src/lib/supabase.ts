import { createClient } from '@supabase/supabase-js';

// Production project configuration with default fallback for client-side queries
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wybwvitlaaubiyssbgev.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ynd2aXRsYWF1Yml5c3NiZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NzUzMDEsImV4cCI6MjEwNjA1MTMwMX0.fdNKIqpvTAjq_dQQkSh3w4dJD-S8bzfcmk9t4s9W8pU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => true;
