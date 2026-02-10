import { supabase } from '../utils/supabase';

/**
 * 📊 GET GROUPS API
 */
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) {
      console.error('Database Fetch Error:', error);
      return res.status(500).json({ error: 'DATABASE_ERROR', details: error.message });
    }

    // فرنٹ اینڈ کے لیے ڈیٹا کو میپ کریں (addedat -> addedAt)
    const groups = (data || []).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      name: item.name || 'Untitled',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedat || item.addedAt || new Date().toISOString(),
      clicks: Number(item.clicks) || 0
    }));

    return res.status(200).json(groups);
  } catch (err: any) {
    console.error('System Exception:', err);
    return res.status(500).json({ error: 'SERVER_EXCEPTION', message: err.message });
  }
}
