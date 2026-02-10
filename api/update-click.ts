
import { supabase } from '../utils/supabase';

/**
 * 🖱️ UPDATE CLICK API
 * Increments the click counter for a specific group link.
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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { link } = body;
    if (!link) {
      return res.status(400).json({ error: 'Link parameter is missing' });
    }

    // 1. Fetch current clicks
    const { data: current, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('clicks')
      .eq('link', link)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!current) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // 2. Increment and update
    const newClicks = (Number(current.clicks) || 0) + 1;
    const { error: updateError } = await supabase
      .from('whatsapp_groups')
      .update({ clicks: newClicks })
      .eq('link', link);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, clicks: newClicks });
  } catch (err: any) {
    console.error('Click tracking error:', err);
    return res.status(500).json({ 
      error: 'CLICK_UPDATE_FAILED', 
      message: err.message 
    });
  }
}
