
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * ------------------------------
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
  // 1. Try process.env (Server-side/Vercel)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // 2. Try import.meta.env (Client-side/Vite)
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

// Initialize client with fallbacks to prevent crash during build/init
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
