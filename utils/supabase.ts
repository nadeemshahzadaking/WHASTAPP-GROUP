import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * ------------------------------
 * یہ فائل ویب سائٹ اور بیک اینڈ دونوں کے لیے مین کنکشن ہے۔
 */

const getEnvVar = (key: string): string => {
  // Try server-side process.env (Vercel/Node)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Try client-side import.meta.env (Vite)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || import.meta.env[`VITE_${key}`] || '';
    }
  } catch (e) {}

  return '';
};

// چیک کریں کہ کیا NEXT_PUBLIC پریفکس کے ساتھ یا بغیر کیز موجود ہیں
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Please check environment variables.");
}

export const supabase = createClient(
  supabaseUrl || 'https://bczjcuykdlobvdbcawxz.supabase.co',
  supabaseAnonKey || ''
);
