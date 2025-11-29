import { describe, it, expect } from 'vitest'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api'

describe('Convex functions', () => {
  const url = process.env.VITE_CONVEX_URL || process.env.CONVEX_SITE_URL
  it('metrics summary returns expected shape', async () => {
    expect(url).toBeTruthy()
    const client = new ConvexHttpClient(url as string)
    const summary = await client.query(api.functions.metrics.summary, { days: 7 } as any)
    expect(summary).toHaveProperty('payments')
    expect(summary).toHaveProperty('claims')
  })
})

