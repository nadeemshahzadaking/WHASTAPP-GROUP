
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ SECURE SUPABASE CLIENT
 * ----------------------------
 * اب کیز براہ راست کوڈ میں نہیں ہیں، بلکہ انوائرمنٹ سے لی جا رہی ہیں۔
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
