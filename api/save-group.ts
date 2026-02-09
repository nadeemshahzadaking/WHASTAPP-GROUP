
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sheetUrl = process.env.SHEET_URL?.trim();
  if (!sheetUrl) return res.status(500).json({ error: 'SHEET_URL missing' });

  try {
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...req.body, timestamp: new Date().toISOString() }),
      redirect: 'follow', 
    });

    const responseText = await response.text();
    const cleanText = responseText.trim();

    if (!response.ok || cleanText.includes("404")) {
      throw new Error("Data source returned 404 or error");
    }

    try {
      const result = JSON.parse(cleanText);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(200).json({ status: 'success' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Submission failed', message: error.message });
  }
}
