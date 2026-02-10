
import { supabase } from '../utils/supabase';

/**
 * 📥 SAVE GROUP API - Supabase Edition
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, link, category, description, addedAt } = req.body;

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert([
        { 
          name, 
          link, 
          category, 
          description, 
          addedAt: addedAt || new Date().toISOString() 
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'This group link already exists in our directory.' });
      }
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    return res.status(200).json({ status: 'success', data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
