
import { createClient } from '@supabase/supabase-js';

// Support for both Vite (import.meta.env) and generic process environments (process.env)
// @ts-ignore - Fixing type error for import.meta.env
const supabaseUrl = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  process.env.SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  '';

// @ts-ignore - Fixing type error for import.meta.env
const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration missing. Ensure environment variables are set correctly in your platform (Vercel/Vite/Netlify).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
