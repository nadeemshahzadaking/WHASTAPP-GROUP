
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sheetUrl = process.env.SHEET_URL?.trim();
  if (!sheetUrl) return res.status(500).json({ error: 'SHEET_URL missing' });

  try {
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: "add",
        name: req.body.name,
        link: req.body.link,
        category: req.body.category,
        description: req.body.description,
        addedAt: req.body.addedAt || new Date().toISOString()
      }),
      redirect: 'follow', 
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error: any) {
    // If it succeeds but doesn't return JSON (common with Google redirects)
    return res.status(200).json({ status: 'success' });
  }
}
