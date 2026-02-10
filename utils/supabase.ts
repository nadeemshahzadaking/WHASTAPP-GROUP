
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * ------------------------------
 * Required Table Schema:
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
  // Try server-side process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Try client-side import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || import.meta.env[`VITE_${key}`] || '';
    }
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
