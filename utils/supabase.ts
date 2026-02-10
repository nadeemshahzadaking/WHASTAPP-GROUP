
import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables from both Vite (client) 
 * and standard Node.js (API/Server) contexts.
 */
const getEnvVar = (key: string): string => {
  // Check process.env (Node.js / Vercel API routes)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Check import.meta.env (Vite / Client-side)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    // @ts-ignore
    const viteKey = `VITE_${key}`;
    // @ts-ignore
    return (import.meta as any).env[viteKey] || (import.meta as any).env[key] || '';
  }

  return '';
};

const supabaseUrl = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnvVar('SUPABASE_URL') || 
  '';

const supabaseAnonKey = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnvVar('SUPABASE_ANON_KEY') || 
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local or platform environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
