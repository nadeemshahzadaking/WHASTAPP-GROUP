import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * Designed for Vercel Serverless Functions and Vite Client
 */

const getSupabaseConfig = () => {
  // Try to get from process.env (Node.js/Vercel)
  const url = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 
              (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
              'https://bczjcuykdlobvdbcawxz.supabase.co';
  
  const key = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || 
              (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Fallback for Vite client-side (import.meta.env)
  // @ts-ignore
  const viteUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL;
  // @ts-ignore
  const viteKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY;

  return {
    url: url || viteUrl || 'https://bczjcuykdlobvdbcawxz.supabase.co',
    key: key || viteKey || ''
  };
};

const config = getSupabaseConfig();

if (!config.key) {
  console.error("CRITICAL: SUPABASE_ANON_KEY is missing! The API will return 500 errors until this is fixed in Vercel settings.");
}

export const supabase = createClient(config.url, config.key);
