import { query } from "../_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { user_id: v.optional(v.string()), op: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    let q = ctx.db.query("metrics")
    if (args.user_id) q = q.withIndex("by_user", (x) => x.eq("user_id", args.user_id as string))
    const all = await q.collect()
    if (args.op) return all.filter((m: any) => m.op === args.op)
    return all
  },
})

export const summary = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days ?? 7
    const since = Date.now() - days * 24 * 60 * 60 * 1000
    const all = await ctx.db.query("metrics").collect()
    const recent = all.filter((m: any) => new Date(m.created_at).getTime() >= since)
    const byOp = (op: string) => recent.filter((m: any) => m.op === op)
    const avg = (list: any[]) => list.length ? Math.round(list.reduce((a, b) => a + Number(b.duration_ms || 0), 0) / list.length) : 0
    const payments = byOp('payments:record')
    const claims = byOp('claims:create')
    return {
      windowDays: days,
      payments: { avgMs: avg(payments), errors: payments.filter((m: any) => m.status === 'error').length, count: payments.length },
      claims: { avgMs: avg(claims), errors: claims.filter((m: any) => m.status === 'error').length, count: claims.length },
      total: recent.length,
    }
  },
})
