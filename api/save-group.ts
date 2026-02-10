import { supabase } from '../utils/supabase';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'INVALID_JSON' }); }
    }

    const { name, link, category, description, addedAt } = body;

    if (!name || !link || !category) {
      return res.status(400).json({ error: 'REQUIRED_FIELDS_MISSING' });
    }

    // Insert into Supabase table
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert([
        { 
          name: name.trim(), 
          link: link.trim(), 
          category, 
          description: description?.trim() || '', 
          addedat: addedAt || new Date().toISOString(),
          clicks: 0
        }
      ])
      .select();

    if (error) {
      console.error('Save Error:', error.message);
      if (error.code === '23505') return res.status(409).json({ error: 'DUPLICATE_LINK' });
      return res.status(500).json({ error: 'SAVE_ERROR', details: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('API Save Crash:', err.message);
    return res.status(500).json({ error: 'SERVER_CRASH', message: err.message });
  }
}
