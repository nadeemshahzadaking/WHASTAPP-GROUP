
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bczjcuykdlobvdbcawxz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const { link } = body;

    const { data: current } = await supabase
      .from('whatsapp_groups')
      .select('clicks')
      .eq('link', link)
      .maybeSingle();
    
    if (current) {
      await supabase
        .from('whatsapp_groups')
        .update({ clicks: (Number(current.clicks) || 0) + 1 })
        .eq('link', link);
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'TRACKING_FAILED' });
  }
}
