import { createClient } from '@supabase/supabase-js';

// Environment variables with production project fallback for instant deployment & local runtime
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://logewlyfhhbsbgiycjju.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZ2V3bHlmaGhic2JnaXljamp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjQyODksImV4cCI6MjEwNTE0MDI4OX0.MLqIB18tJCfEDPvklqVrGhIcziWNhcUI6HAvnQKqcxw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => true;
