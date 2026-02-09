
export default async function handler(req: any, res: any) {
  const sheetUrl = process.env.SHEET_URL?.trim();

  if (!sheetUrl) {
    return res.status(500).json({ 
      error: 'CONFIG_ERROR',
      message: 'SHEET_URL is missing in environment variables.' 
    });
  }

  try {
    const response = await fetch(sheetUrl, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      redirect: 'follow'
    });

    const cleanText = (await response.text()).trim();

    if (!response.ok || cleanText.includes("404")) {
      return res.status(404).json({ error: 'SOURCE_NOT_FOUND' });
    }

    try {
      const data = JSON.parse(cleanText);
      // Map sheet headers (lowercase) back to component expectations
      const groups = data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        name: item.name || 'Untitled Group',
        link: item.link || '',
        category: item.category || 'Other',
        description: item.description || '',
        addedAt: item.addedat || new Date().toISOString(),
        clicks: parseInt(item.clicks) || 0
      }));
      return res.status(200).json(groups);
    } catch (parseError) {
      return res.status(502).json({ error: 'PARSE_ERROR', raw: cleanText.substring(0, 50) });
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'NETWORK_ERROR', message: error.message });
  }
}
