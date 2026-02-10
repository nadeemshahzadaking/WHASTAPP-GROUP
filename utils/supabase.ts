
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SUPABASE CONNECTION UTILITY
 * ------------------------------
 * This client is used by both the frontend and the backend API routes.
 * 
 * REQUIRED SQL (Execute in Supabase SQL Editor):
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
 * 
 * -- Enable RLS
 * alter table whatsapp_groups enable row level security;
 * 
 * -- Create Policies
 * create policy "Public Access" on whatsapp_groups for select using (true);
 * create policy "Public Insert" on whatsapp_groups for insert with check (true);
 * create policy "Public Update Clicks" on whatsapp_groups for update using (true);
 */

const getEnvVar = (key: string): string => {
  // 1. Try process.env (Server-side/Node.js/Vercel)
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

// Check for both NEXT_PUBLIC prefix (common in Vercel/Next.js) and plain keys
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Supabase credentials not found. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
