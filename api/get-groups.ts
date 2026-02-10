
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://bczjcuykdlobvdbcawxz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedAt', { ascending: false });

    if (error) {
      console.error('Database Error:', error);
      // If table doesn't exist, return empty array instead of 500
      if (error.code === '42P01') {
        return res.status(200).json([]);
      }
      return res.status(500).json({ error: 'DATABASE_ERROR', details: error.message });
    }

    const groups = (data || []).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      name: item.name || 'Untitled',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedAt || new Date().toISOString(),
      clicks: Number(item.clicks) || 0
    }));

    return res.status(200).json(groups);
  } catch (err: any) {
    console.error('Server Exception:', err);
    return res.status(500).json({ error: 'SERVER_EXCEPTION', message: err.message });
  }
}
