
export default async function handler(req: any, res: any) {
  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    return res.status(500).json({ error: 'SHEET_URL is missing in Vercel settings.' });
  }

  try {
    const response = await fetch(sheetUrl, { method: 'GET' });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch groups', details: error.message });
  }
}
