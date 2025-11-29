import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'

async function main() {
  const url = process.env.VITE_CONVEX_URL || process.env.CONVEX_SITE_URL
  if (!url) {
    console.error('Missing Convex URL env')
    process.exit(1)
  }
  const client = new ConvexHttpClient(url)
  const summary = await client.query(api.functions.metrics.summary, { days: 7 })
  if (!summary || !summary.payments || !summary.claims) {
    console.error('Invalid summary response')
    process.exit(1)
  }
  console.log('Summary ok', JSON.stringify(summary))
}

main().catch((e) => { console.error(e); process.exit(1) })

