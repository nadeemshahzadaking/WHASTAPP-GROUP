
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bczjcuykdlobvdbcawxz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjempjdXlrZGxvYnZkYmNhd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2OTk2NTUsImV4cCI6MjA4NjI3NTY1NX0.bv-F1JKK0U6TaPM1_qnBv4qeNjkdoN-YuIB69reie1k'
);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, link, category, description, addedAt } = body;

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert([
        { 
          name: name.trim(), 
          link: link.trim(), 
          category: category, 
          description: description?.trim() || '', 
          addedat: addedAt || new Date().toISOString(),
          clicks: 0
        }
      ]);

    if (error) return res.status(200).json({ isError: true, details: error.message });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ isError: true, msg: err.message });
  }
}
