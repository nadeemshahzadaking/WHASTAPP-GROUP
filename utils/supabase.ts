
import { createClient } from '@supabase/supabase-js';

/**
 * 🛠️ DIRECT SUPABASE CONNECTION
 * ----------------------------
 * ہم یہاں آپ کی پبلک کیز (Public Keys) براہ راست شامل کر رہے ہیں 
 * تاکہ ورسل (Vercel) کے انوائرمنٹ ویری ایبلز کا مسئلہ ختم ہو جائے۔
 */

const SUPABASE_URL = 'https://bczjcuykdlobvdbcawxz.supabase.co';

// یہ وہی کی (Key) ہے جو آپ نے .env.local میں دی تھی
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k';

// کلائنٹ بنانا
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// یہ چیک کرنے کے لیے کہ کیا کنکشن درست ہے
console.log("⚡ Supabase Direct Client Initialized");
