
import { createClient } from '@supabase/supabase-js';

// Vercel Serverless functions (Backend) میں process.env ہی استعمال ہوتا ہے
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return res.status(500).json({ error: 'Supabase URL is not defined in Backend environment.' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) throw error;

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
    return res.status(500).json({ error: err.message });
  }
}
