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

