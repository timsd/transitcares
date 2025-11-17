import { query, mutation } from "convex/server"

export const list = query({
  args: { user_id: "string?" },
  handler: async (ctx, args) => {
    const q = ctx.db.query("payments")
    if (args.user_id) return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id)).collect()
    return await q.collect()
  },
})

export const record = mutation({
  args: { user_id: "string", amount: "number", payment_type: "string", plan_tier: "string?" },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      user_id: args.user_id,
      amount: args.amount,
      payment_type: args.payment_type,
      created_at: new Date().toISOString(),
    })
  },
})
