
export default async function handler(req: any, res: any) {
  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    return res.status(500).json({ 
      error: 'SHEET_URL is missing in Vercel settings.',
      help: 'Go to Vercel Dashboard > Settings > Environment Variables and add SHEET_URL.' 
    });
  }

  try {
    const response = await fetch(sheetUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ 
        error: 'Google Sheets API responded with an error', 
        details: text 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to Google Sheets', 
      details: error.message 
    });
  }
}
