import { query, mutation } from "convex/server"

export const list = query({
  args: { user_id: "string?" },
  handler: async (ctx, args) => {
    const q = ctx.db.query("withdrawals")
    if (args.user_id) return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id)).collect()
    return await q.collect()
  },
})

export const create = mutation({
  args: {
    user_id: "string",
    amount: "number",
    bank_name: "string",
    account_number: "string",
    account_name: "string",
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
  args: { id: "id", status: "string", admin_notes: "string?", approved_by: "string?" },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updated_at: new Date().toISOString() })
  },
})
