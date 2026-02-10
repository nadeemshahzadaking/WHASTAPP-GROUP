
import { supabase } from '../utils/supabase';

/**
 * 🖱️ CLICK TRACKER API - Supabase Edition
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { link } = req.body;

  try {
    // First get current clicks
    const { data: current, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('clicks')
      .eq('link', link)
      .single();

    if (fetchError || !current) {
       return res.status(404).json({ error: 'Group not found' });
    }

    // Update clicks
    const { error: updateError } = await supabase
      .from('whatsapp_groups')
      .update({ clicks: (current.clicks || 0) + 1 })
      .eq('link', link);

    if (updateError) {
       return res.status(500).json({ error: 'Update failed', details: updateError.message });
    }

    return res.status(200).json({ status: 'updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Update failed' });
  }
}
