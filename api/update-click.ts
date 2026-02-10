
import { supabase } from '../utils/supabase';

/**
 * 🖱️ UPDATE CLICK API
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { link } = body;

    if (!link) return res.status(400).json({ error: 'Link is required' });

    // Atomic increment using rpc (if configured) or standard update
    // For simplicity, we fetch and update here
    const { data: current, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('clicks')
      .eq('link', link)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!current) return res.status(404).json({ error: 'Group not found' });

    const newClicks = (Number(current.clicks) || 0) + 1;

    const { error: updateError } = await supabase
      .from('whatsapp_groups')
      .update({ clicks: newClicks })
      .eq('link', link);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, clicks: newClicks });
  } catch (error: any) {
    console.error('Click Update Error:', error);
    return res.status(500).json({ error: 'FAILED_TO_UPDATE_CLICK', details: error.message });
  }
}
