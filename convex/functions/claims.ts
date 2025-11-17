import { query, mutation } from "convex/server"

export const list = query({
  args: { user_id: "string?" },
  handler: async (ctx, args) => {
    const q = ctx.db.query("claims")
    if (args.user_id) return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id)).collect()
    return await q.collect()
  },
})

export const create = mutation({
  args: {
    user_id: "string",
    claim_type: "string",
    claim_amount: "number",
    description: "string",
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    return await ctx.db.insert("claims", {
      user_id: args.user_id,
      claim_type: args.claim_type,
      claim_amount: args.claim_amount,
      claim_status: "pending",
      description: args.description,
      created_at: now,
      updated_at: now,
    })
  },
})

export const updateStatus = mutation({
  args: { id: "id", status: "string", notes: "string?" },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { claim_status: args.status, updated_at: new Date().toISOString() })
  },
})
