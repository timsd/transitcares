const workerBase = (import.meta.env.VITE_R2_WORKER_URL as string || '').replace(/\/+$/, '')
const endpoint = workerBase ? workerBase + '/crawl' : (import.meta.env.VITE_FIRECRAWL_URL || 'https://api.firecrawl.dev/v1/crawl')

export async function crawlUrl(url: string) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Firecrawl request failed')
  return res.json()
}
