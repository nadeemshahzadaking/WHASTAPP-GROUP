
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
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'INVALID_JSON', details: 'The request body must be valid JSON.' });
      }
    }

    const { name, link, category, description, addedAt } = body;

    if (!name || !link || !category) {
      return res.status(400).json({ error: 'MISSING_FIELDS', details: 'Name, Link, and Category are required.' });
    }

    // Server-side link validation
    if (!link.includes('chat.whatsapp.com/')) {
      return res.status(400).json({ error: 'INVALID_LINK', details: 'Please provide a valid WhatsApp chat link.' });
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
      console.error('Supabase save error:', error);
      // Handle unique constraint (duplicate link)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'DUPLICATE_LINK', details: 'This group link is already in our directory.' });
      }
      return res.status(500).json({ 
        error: 'DATABASE_INSERT_ERROR', 
        details: error.message,
        code: error.code 
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('SAVE API Crash:', err);
    return res.status(500).json({ 
      error: 'INTERNAL_SERVER_ERROR', 
      message: err.message 
    });
  }
}
