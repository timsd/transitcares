import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()
  },
})

export const upsert = mutation({
  args: {
    user_id: v.string(),
    data: v.object({
      full_name: v.string(),
      phone: v.string(),
      vehicle_id: v.string(),
      plan_tier: v.string(),
      wallet_balance: v.number(),
      registration_status: v.string(),
      vehicle_color: v.optional(v.string()),
      chassis_number: v.optional(v.string()),
      designated_route: v.optional(v.string()),
      vehicle_photo_key: v.optional(v.string()),
    }),
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
