
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ UNIVERSAL SUPABASE CLIENT
 * ----------------------------
 * یہ فائل چیک کرتی ہے کہ کیا ہم Vite (Frontend) میں ہیں یا Node (Backend) میں۔
 * یہ آپ کی .env.local فائل سے ویلیوز اٹھائے گی۔
 */

// Vite کے لیے import.meta.env اور Node/Vercel کے لیے process.env استعمال ہوتا ہے
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return '';
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase Keys missing! Check your .env.local file or Vercel Environment Variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
