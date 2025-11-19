import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { user_id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const q = ctx.db.query("withdrawals")
    if (args.user_id) return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id)).collect()
    return await q.collect()
  },
})

export const create = mutation({
  args: {
    user_id: v.string(),
    amount: v.number(),
    bank_name: v.string(),
    account_number: v.string(),
    account_name: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    return await ctx.db.insert("withdrawals", {
      user_id: args.user_id,
      amount: args.amount,
      bank_name: args.bank_name,
      account_number: args.account_number,
      account_name: args.account_name,
      status: "pending",
      created_at: now,
      updated_at: now,
    })
  },
})

export const updateStatus = mutation({
  args: { id: v.id("withdrawals"), status: v.string(), admin_notes: v.optional(v.string()), approved_by: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updated_at: new Date().toISOString() })
  },
})
