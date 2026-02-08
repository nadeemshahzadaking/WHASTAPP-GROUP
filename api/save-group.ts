
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the URL from Vercel Environment Variables
  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    console.error("Vercel Deployment Error: SHEET_URL environment variable is missing.");
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
      redirect: 'follow', // Important for Google Apps Script redirects
    });

    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      // If it's not JSON, check if the response was OK anyway
      if (response.ok) {
        return res.status(200).json({ status: 'success', message: 'Data logged successfully' });
      }
      throw new Error("Invalid response from Google: " + responseText);
    }
    
    if (result.status === 'success' || response.ok) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ 
        error: 'Google Sheet error', 
        details: result.error || 'The script returned an error status' 
      });
    }
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ 
      error: 'Connection failed', 
      details: error.message 
    });
  }
}
