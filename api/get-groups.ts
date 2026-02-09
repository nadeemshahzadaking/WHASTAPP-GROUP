
export default async function handler(req: any, res: any) {
  const sheetUrl = process.env.SHEET_URL?.trim();

  if (!sheetUrl) {
    return res.status(500).json({ 
      error: 'CONFIG_ERROR',
      message: 'SHEET_URL is missing in environment variables.' 
    });
  }

  try {
    // Robust URL construction
    const url = new URL(sheetUrl);
    url.searchParams.set('t', Date.now().toString());

    const response = await fetch(url.toString(), { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      redirect: 'follow'
    });

    const responseText = await response.text();
    const cleanText = responseText.trim();

    // Check if Google returned a 404 or other error page
    if (!response.ok || response.status === 404 || cleanText.includes("404") || cleanText.includes("File not found")) {
      return res.status(response.status === 200 ? 404 : response.status).json({
        error: 'SOURCE_NOT_FOUND',
        message: 'Google Script URL returned a 404 or Error Page. Check if the script is Deployed as Web App and set to "Anyone".',
        debug: cleanText.substring(0, 100)
      });
    }

    try {
      const data = JSON.parse(cleanText);
      const groups = Array.isArray(data) ? data : (data.data || data.rows || []);
      return res.status(200).json(groups);
    } catch (parseError) {
      return res.status(502).json({ 
        error: 'PARSE_ERROR', 
        message: 'Data source returned invalid JSON.',
        raw: cleanText.substring(0, 50)
      });
    }
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'NETWORK_ERROR', 
      message: error.message 
    });
  }
}
