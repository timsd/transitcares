import { query, mutation } from "convex/server"

export const get = query({
  args: { user_id: "string" },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()
  },
})

export const upsert = mutation({
  args: {
    user_id: "string",
    data: {
      full_name: "string",
      phone: "string",
      vehicle_id: "string",
      plan_tier: "string",
      wallet_balance: "number",
      registration_status: "string",
    },
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, args.data as any)
      return existing._id
    }
    return await ctx.db.insert("profiles", { user_id: args.user_id, ...(args.data as any) })
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").collect()
  },
})
