import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { user_id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    const q = ctx.db.query("claims")
    if (args.user_id) {
      if (args.user_id !== identity.subject) throw new Error('Forbidden')
      return await q.withIndex("by_user", (x) => x.eq("user_id", args.user_id as string)).collect()
    }
    return await q.collect()
  },
})

export const create = mutation({
  args: {
    user_id: v.string(),
    claim_type: v.string(),
    claim_amount: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const t0 = Date.now()
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')
    const now = new Date().toISOString()
    try {
      const res = await ctx.db.insert("claims", {
        user_id: args.user_id,
        claim_type: args.claim_type,
        claim_amount: args.claim_amount,
        claim_status: "pending",
        description: args.description,
        created_at: now,
        updated_at: now,
      })
      await ctx.db.insert("metrics", {
        user_id: args.user_id,
        op: "claims:create",
        duration_ms: Date.now() - t0,
        status: "ok",
        created_at: new Date().toISOString(),
        extra: JSON.stringify({ claim_type: args.claim_type }),
      })
      return res
    } catch (e: any) {
      await ctx.db.insert("metrics", {
        user_id: args.user_id,
        op: "claims:create",
        duration_ms: Date.now() - t0,
        status: "error",
        created_at: new Date().toISOString(),
        extra: JSON.stringify({ message: String(e?.message || e) }),
      })
      throw e
    }
  },
})

export const updateStatus = mutation({
  args: { id: v.id("claims"), status: v.string(), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { claim_status: args.status, updated_at: new Date().toISOString() })
  },
})
