
import { supabase } from '../utils/supabase';

/**
 * 📥 SAVE GROUP API - Supabase Edition
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, link, category, description, addedAt } = req.body;

    if (!name || !link || !category) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert([
        { 
          name, 
          link, 
          category, 
          description: description || '', 
          addedAt: addedAt || new Date().toISOString(),
          clicks: 0
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Insert Error:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'This group link already exists in our directory.' });
      }
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    return res.status(200).json({ status: 'success', data });
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
