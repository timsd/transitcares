import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { days: v.optional(v.number()), op: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const days = args.days ?? 28
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
    const all = await ctx.db.query("metrics_rollup").collect()
    const filtered = all.filter((r: any) => r.date >= sinceDate && (!args.op || r.op === args.op))
    return filtered.sort((a: any, b: any) => a.date.localeCompare(b.date))
  },
})

export const addDaily = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const dayStart = new Date(args.date)
    const nextDay = new Date(dayStart)
    nextDay.setDate(dayStart.getDate() + 1)
    const m = await ctx.db.query("metrics").collect()
    const dayMetrics = m.filter((x: any) => {
      const t = new Date(x.created_at).getTime()
      return t >= dayStart.getTime() && t < nextDay.getTime()
    })
    const ops = Array.from(new Set(dayMetrics.map((x: any) => x.op)))
    for (const op of ops) {
      const list = dayMetrics.filter((x: any) => x.op === op)
      const count = list.length
      const avg = count ? Math.round(list.reduce((a: number, b: any) => a + Number(b.duration_ms || 0), 0) / count) : 0
      const errors = list.filter((x: any) => x.status === 'error').length
      await ctx.db.insert("metrics_rollup", { date: args.date, op, avg_ms: avg, count, errors })
    }
  },
})

