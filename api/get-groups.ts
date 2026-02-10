
import { supabase } from '../utils/supabase';

/**
 * 📊 GET GROUPS API
 * Fetches all groups from the 'whatsapp_groups' table.
 */
export default async function handler(req: any, res: any) {
  // Add CORS headers for cross-origin if needed
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
      // Handle "Table not found" gracefully
      if (error.code === '42P01') {
        console.warn("Table 'whatsapp_groups' does not exist yet.");
        return res.status(200).json([]);
      }
      
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ 
        error: 'DATABASE_ERROR', 
        message: error.message,
        code: error.code 
      });
    }

    // Map database fields to the frontend expected format
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
    console.error('API Error:', err);
    return res.status(500).json({ 
      error: 'SERVER_EXCEPTION', 
      message: err.message 
    });
  }
}
