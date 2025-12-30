// Vercel serverless function to proxy requests to football-data.org
// This solves CORS issues in production

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the API key from environment variable
    // Try both VITE_FOOTBALL_DATA_KEY (for Vercel) and FOOTBALL_DATA_KEY
    const API_KEY = process.env.VITE_FOOTBALL_DATA_KEY || process.env.FOOTBALL_DATA_KEY;
    
    if (!API_KEY) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Get the endpoint from query parameter
    const { endpoint } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Build the API URL
    const apiUrl = `https://api.football-data.org/v4/${endpoint}`;
    
    // Make the request to football-data.org
    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'API request failed',
        status: response.status,
        message: errorText 
      });
    }

    const data = await response.json();
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

