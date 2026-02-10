
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
      } catch (e) {}
    }

    const { link } = body;
    if (!link) return res.status(400).json({ error: 'Link is missing' });

    // Atomic update using Supabase (fetching current then updating)
    const { data: current, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('clicks')
      .eq('link', link)
      .maybeSingle();

    if (fetchError) throw fetchError;
    
    if (current) {
      const { error: updateError } = await supabase
        .from('whatsapp_groups')
        .update({ clicks: (Number(current.clicks) || 0) + 1 })
        .eq('link', link);
      
      if (updateError) throw updateError;
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Click update error:', err);
    return res.status(500).json({ error: 'CLICK_UPDATE_FAILED', details: err.message });
  }
}
