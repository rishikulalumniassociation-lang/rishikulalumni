import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wybwvitlaaubiyssbgev.supabase.co";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Ynd2aXRsYWF1Yml5c3NiZ2V2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDQ3NTMwMSwiZXhwIjoyMTA2MDUxMzAxfQ.gvF388CbQ1mHL7Uavh5WTRHTZku9ipvqSgm1zx1ImbU";

/**
 * Server-only Supabase admin client.
 * MUST NEVER be imported by client-side components.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
