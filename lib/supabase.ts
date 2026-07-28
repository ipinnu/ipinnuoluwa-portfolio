import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<Database>(
  supabaseUrl ?? "https://unconfigured.supabase.co",
  supabaseAnonKey ?? "unconfigured-anon-key",
);
