
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sheetUrl = process.env.SHEET_URL?.trim();
  if (!sheetUrl) return res.status(500).json({ error: 'SHEET_URL missing' });

  try {
    await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: "click",
        link: req.body.link
      }),
      redirect: 'follow', 
    });
    return res.status(200).json({ status: 'updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Update failed' });
  }
}
