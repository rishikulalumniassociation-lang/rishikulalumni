import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wybwvitlaaubiyssbgev.supabase.co";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!supabaseServiceRoleKey && process.env.NODE_ENV === "production") {
  console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY environment variable is missing on server.");
}

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
