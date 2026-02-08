
export default async function handler(req: any, res: any) {
  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    return res.status(500).json({ 
      error: 'SHEET_URL is missing in Vercel settings.',
      help: 'Go to Vercel Dashboard > Settings > Environment Variables and add SHEET_URL.' 
    });
  }

  try {
    // Add a unique timestamp to prevent caching from Google's side
    const cacheBuster = `?t=${Date.now()}`;
    const targetUrl = sheetUrl.includes('?') ? `${sheetUrl}&t=${Date.now()}` : `${sheetUrl}${cacheBuster}`;

    const response = await fetch(targetUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ 
        error: 'Google Sheets API error', 
        details: text 
      });
    }

    const data = await response.json();
    
    // Ensure data is an array
    const groups = Array.isArray(data) ? data : (data.data || []);
    
    return res.status(200).json(groups);
  } catch (error: any) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to Google Sheets', 
      details: error.message 
    });
  }
}
