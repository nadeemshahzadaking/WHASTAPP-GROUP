
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: any, res: any) {
  // تمام ضروری ہیڈرز ایک ہی بار سیٹ کریں
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: 'Supabase keys are missing in environment variables.' });
    }

    const { data, error } = await supabase
      .from('whatsapp_groups')
      .select('*')
      .order('addedat', { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map((item: any) => ({
      id: item.id?.toString(),
      name: item.name || 'Untitled Group',
      link: item.link || '',
      category: item.category || 'Other',
      description: item.description || '',
      addedAt: item.addedat || new Date().toISOString(),
      clicks: parseInt(item.clicks) || 0
    }));

    // ڈیٹا کو سٹرنگ بنا کر بھیجیں تاکہ کوئی ابہام نہ رہے
    return res.status(200).send(JSON.stringify(formatted));
  } catch (err: any) {
    console.error('Fetch Error:', err.message);
    return res.status(500).send(JSON.stringify({ error: 'Database connection failed', details: err.message }));
  }
}
