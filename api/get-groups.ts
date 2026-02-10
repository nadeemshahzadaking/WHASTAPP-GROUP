import { supabase } from '../utils/supabase';

export default async function handler(req: any, res: any) {
  // Set CORS Headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error.message);
      return res.status(500).json({ 
        error: 'DATABASE_FETCH_FAILED', 
        details: error.message 
      });
    }

    // Convert Database fields (snake_case/lowercase) to Frontend fields (camelCase)
    const formattedGroups = (data || []).map((item: any) => ({
      id: item.id?.toString(),
      name: item.name || 'No Name',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedat || new Date().toISOString(),
      clicks: parseInt(item.clicks) || 0
    }));

    return res.status(200).json(formattedGroups);
  } catch (err: any) {
    console.error('API Handler Crash:', err.message);
    return res.status(500).json({ 
      error: 'SERVER_ERROR', 
      message: err.message 
    });
  }
}
