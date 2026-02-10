
import { supabase } from '../utils/supabase';

/**
 * 📊 GET GROUPS API
 */
export default async function handler(req: any, res: any) {
  try {
    // Verify configuration
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not initialized' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedAt', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ 
        error: 'DATABASE_ERROR',
        details: error.message,
        code: error.code,
        hint: 'Check if the "whatsapp_groups" table exists in your Supabase project.'
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
    console.error('System Exception:', err);
    return res.status(500).json({ 
      error: 'SERVER_EXCEPTION', 
      message: err.message 
    });
  }
}
