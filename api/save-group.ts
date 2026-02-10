
import { supabase } from '../utils/supabase';

/**
 * 📥 SAVE GROUP API
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Robust body parsing
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { name, link, category, description, addedAt } = body;

    if (!name || !link || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name: !!name, link: !!link, category: !!category }
      });
    }

    // Basic URL validation
    if (!link.includes('chat.whatsapp.com')) {
      return res.status(400).json({ error: 'Invalid WhatsApp link format. Links must start with https://chat.whatsapp.com/' });
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
      console.error('Supabase Insertion Error:', error);
      
      // Handle unique constraint (Link already exists)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This group link is already in our directory.' });
      }

      return res.status(500).json({ 
        error: 'DATABASE_INSERT_FAILED', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('API Server Exception:', err);
    return res.status(500).json({ 
      error: 'API_INTERNAL_ERROR', 
      message: err.message 
    });
  }
}
