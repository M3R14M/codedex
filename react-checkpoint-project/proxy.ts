/**
 * Proxy server to forward requests to the Quotable API using https://val.town.
 * This to bypass the current invalid SSL certificate on the Quotable API.
 * Deployed at https://m3r14m-quotable.web.val.run/
 */

export default async function server(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.slice(1); // Remove leading slash
  const searchParams = url.searchParams.toString();

  const quotableUrl = `http://api.quotable.io/${path}${searchParams ? '?' + searchParams : ''}`;
  // If no path or query parameters are present, redirect to the Quotable GitHub page
  if (!path && !searchParams) {
    return new Response(null, {
      status: 302,
      headers: { Location: "https://github.com/lukePeavey/quotable/" }
    });
  }
  try {
    const response = await fetch(quotableUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch from Quotable API' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}