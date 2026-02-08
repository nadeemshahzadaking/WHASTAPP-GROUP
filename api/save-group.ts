
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the URL from Vercel Environment Variables
  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    console.error("");
    return res.status(500).json({ 
      error: 'SHEET_URL is missing',
      details: 'Please go to Vercel Settings > Environment Variables and add SHEET_URL with your Google Apps Script Link.'
    });
  }

  try {
    // Forward the request to Google Apps Script
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      redirect: 'follow', // Crucial for Google Apps Script redirects
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ 
        error: 'Google Sheet error', 
        details: result.error || 'Unknown error from script' 
      });
    }
  } catch (error: any) {
    console.error('Submission Error:', error);
    return res.status(500).json({ 
      error: 'Connection failed', 
      details: error.message 
    });
  }
}
