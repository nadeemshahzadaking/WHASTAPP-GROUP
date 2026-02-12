
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bczjcuykdlobvdbcawxz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map((item: any) => ({
      id: item.id?.toString(),
      name: item.name || 'Untitled Group',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedat || new Date().toISOString(),
      clicks: parseInt(item.clicks) || 0,
      image_url: item.image_url || '',
      custom_color: item.custom_color || ''
    }));

    return res.status(200).send(JSON.stringify(formatted));
  } catch (err: any) {
    return res.status(500).send(JSON.stringify({ error: 'Database connection failed', details: err.message }));
  }
}
