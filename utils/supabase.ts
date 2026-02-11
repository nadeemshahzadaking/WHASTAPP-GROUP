import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ UNIVERSAL SUPABASE CLIENT
 * ----------------------------
 * Initializes the Supabase client using environment variables with hardcoded fallbacks
 * to ensure the application remains functional even if environment injection fails.
 */

const getEnv = (key: string): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const viteKey = key.startsWith('VITE_') ? key : `VITE_${key.replace('NEXT_PUBLIC_', '')}`;
      // @ts-ignore
      const value = import.meta.env[viteKey] || import.meta.env[key];
      if (value) return value;
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env) {
      const value = process.env[key] || process.env[`VITE_${key.replace('NEXT_PUBLIC_', '')}`];
      if (value) return value;
    }
  } catch (e) {}

  return '';
};

// Hardcoded fallbacks from the project configuration
const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || 'https://bczjcuykdlobvdbcawxz.supabase.co';
const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
