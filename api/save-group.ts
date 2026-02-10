
import { supabase } from '../utils/supabase';

/**
 * 📥 SAVE GROUP API
 * Inserts a new group into the 'whatsapp_groups' table.
 */
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Robust body parsing for different server environments
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { name, link, category, description, addedAt } = body;

    // Validation
    if (!name || !link || !category) {
      return res.status(400).json({ error: 'Required fields missing: name, link, or category.' });
    }

    if (!link.startsWith('https://chat.whatsapp.com/')) {
      return res.status(400).json({ error: 'Invalid link. Must be a valid WhatsApp group link.' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .insert([
        { 
          name: name.trim(), 
          link: link.trim(), 
          category, 
          description: description?.trim() || '', 
          addedAt: addedAt || new Date().toISOString(),
          clicks: 0
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Duplicate link error (Unique constraint)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This group link is already in our directory.' });
      }

      return res.status(500).json({ 
        error: 'DATABASE_INSERT_FAILED', 
        details: error.message,
        code: error.code 
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('API Exception:', err);
    return res.status(500).json({ 
      error: 'SERVER_EXCEPTION', 
      message: err.message 
    });
  }
}
