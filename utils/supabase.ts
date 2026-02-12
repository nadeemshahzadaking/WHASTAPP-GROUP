
import { createClient } from '@supabase/supabase-js';

// Consistent URL and Key across the entire application
const SUPABASE_URL = 'https://bczjcuykdlobvdbcawxz.supabase.co'.trim();
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k'.trim();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { 'x-application-name': 'whatsapp-hub-2026' },
  },
});
