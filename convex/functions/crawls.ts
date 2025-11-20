import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { user_id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    const q = ctx.db.query("crawls")
    if (args.user_id) {
      if (args.user_id !== identity.subject) throw new Error('Forbidden')
      return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id as string)).collect()
    }
    return await q.collect()
  },
})

export const record = mutation({
  args: { user_id: v.string(), url: v.string(), status: v.string(), data: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')
    return await ctx.db.insert("crawls", {
      user_id: args.user_id,
      url: args.url,
      status: args.status,
      data: args.data,
      created_at: new Date().toISOString(),
    })
  },
})

