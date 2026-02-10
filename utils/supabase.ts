
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * ------------------------------
 * This utility connects to your database using the keys provided in .env.local
 * 
 * IMPORTANT: You must create the table in your Supabase SQL Editor:
 * 
 * create table whatsapp_groups (
 *   id bigint primary key generated always as identity,
 *   name text not null,
 *   link text not null unique,
 *   category text not null,
 *   description text,
 *   addedAt timestamp with time zone default now(),
 *   clicks bigint default 0
 * );
 */

const getEnvVar = (key: string): string => {
  // Try Vercel/Node process.env first
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Try Vite/Meta fallback
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || import.meta.env[`VITE_${key}`] || '';
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Debugging logs for server-side (Vercel Logs)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Supabase keys are missing! Check Vercel Environment Variables or .env.local");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
