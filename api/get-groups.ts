
import { supabase } from '../utils/supabase';

/**
 * 📊 GET GROUPS API
 */
export default async function handler(req: any, res: any) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedAt', { ascending: false });

    if (error) {
      // If table doesn't exist, Supabase returns error code '42P01'
      if (error.code === '42P01') {
        console.warn("Table 'whatsapp_groups' not found. Returning empty list.");
        return res.status(200).json([]);
      }
      
      console.error('Supabase Error:', error);
      return res.status(500).json({ 
        error: 'DATABASE_ERROR',
        details: error.message,
        code: error.code
      });
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
    console.error('System Error:', err);
    return res.status(500).json({ error: 'SERVER_EXCEPTION', message: err.message });
  }
}
