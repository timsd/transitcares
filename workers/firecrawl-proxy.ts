export default {
  async fetch(request: Request, env: { FIRECRAWL_URL: string; FIRECRAWL_API_KEY: string }) {
    const url = new URL(request.url)
    if (url.pathname !== '/crawl') {
      return new Response('Not Found', { status: 404 })
    }
    const body = await request.json()
    const res = await fetch(env.FIRECRAWL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify(body),
    })
    return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
  }
}
