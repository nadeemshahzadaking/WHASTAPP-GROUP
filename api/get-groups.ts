
import { supabase } from '../utils/supabase';

/**
 * 📊 GET GROUPS API - Supabase Edition
 */
export default async function handler(req: any, res: any) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedAt', { ascending: false });

    if (error) {
      return res.status(500).json({ 
        error: 'SUPABASE_FETCH_FAILED',
        message: error.message 
      });
    }

    // Map data to match existing frontend interface
    const groups = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name || 'Untitled Group',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedAt || new Date().toISOString(),
      clicks: parseInt(item.clicks) || 0
    }));

    return res.status(200).json(groups);
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'NETWORK_ERROR', 
      message: error.message 
    });
  }
}
