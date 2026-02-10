import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Check if keys are present
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: 'Supabase keys are missing in environment variables.' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ 
        error: error.message, 
        hint: 'Please check your RLS policies in Supabase dashboard.' 
      });
    }

    const formatted = (data || []).map((item: any) => ({
      id: item.id?.toString(),
      name: item.name || 'Untitled',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedat || new Date().toISOString(),
      clicks: parseInt(item.clicks) || 0
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    console.error('API Server Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}