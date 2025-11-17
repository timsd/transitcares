const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY as string | undefined
const endpoint = import.meta.env.VITE_FIRECRAWL_URL || 'https://api.firecrawl.dev/v1/crawl'

export async function crawlUrl(url: string) {
  if (!apiKey) throw new Error('Missing Firecrawl API key')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Firecrawl request failed')
  return res.json()
}
