import type { Handler } from '@netlify/functions'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

export const handler: Handler = async () => {
  try {
    const url = process.env.VITE_CONVEX_URL || process.env.CONVEX_SITE_URL
    if (!url) return { statusCode: 200, body: JSON.stringify({ status: 'skip', reason: 'missing convex url' }) }
    const client = new ConvexHttpClient(url as string)
    const summary = await client.query(api.metrics.summary, { days: 7 } as any)
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', summary }) }
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: e?.message || 'metrics failed' }) }
  }
}

