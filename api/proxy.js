export default async function handler(request, response) {
  const { url } = request.query;

  if (!url) {
    return response.status(400).send('Error: Please provide a "url" query parameter.');
  }

  try {
    const fetchResponse = await fetch(url, { headers: { 'User-Agent': 'Vercel-Proxy/1.0' } });
    
    // Set CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    
    // Stream the response body
    return fetchResponse.body.pipe(response);
    
  } catch (error) {
    return response.status(500).send(`Error fetching the URL: ${error.message}`);
  }
}
