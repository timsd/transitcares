import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { user_id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const q = ctx.db.query("payments")
    if (args.user_id) return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id)).collect()
    return await q.collect()
  },
})

export const record = mutation({
  args: { user_id: v.string(), amount: v.number(), payment_type: v.string(), plan_tier: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      user_id: args.user_id,
      amount: args.amount,
      payment_type: args.payment_type,
      created_at: new Date().toISOString(),
    })
  },
})
