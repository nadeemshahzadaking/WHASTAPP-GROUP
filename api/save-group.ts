
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sheetUrl = process.env.SHEET_URL;

  if (!sheetUrl) {
    return res.status(500).json({ 
      error: 'SHEET_URL is missing',
      details: 'Please add SHEET_URL in Vercel Environment Variables.'
    });
  }

  try {
    // Ensuring we send clean data to Google Sheets
    const payload = {
      ...req.body,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow', 
    });

    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      if (response.ok || response.status === 302) {
        return res.status(200).json({ status: 'success' });
      }
      throw new Error("Invalid response from Google: " + responseText);
    }
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('API Save Error:', error);
    return res.status(500).json({ 
      error: 'Submission failed', 
      details: error.message 
    });
  }
}
