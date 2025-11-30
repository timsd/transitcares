"use node"
import { action } from "../_generated/server"
import { api } from "../_generated/api"
import { v } from "convex/values"

export const verifyAndRecord = action({
  args: { user_id: v.string(), amount: v.number(), payment_type: v.string(), plan_tier: v.optional(v.string()), reference: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")
    if (identity.subject !== args.user_id) throw new Error("Forbidden")
    const key = process.env.PAYSTACK_SECRET_KEY || ""
    let verified = false
    if (key) {
      try {
        const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(args.reference)}`, { headers: { Authorization: `Bearer ${key}` } })
        const body = await res.json().catch(() => ({}))
        verified = Boolean(body?.data?.status === 'success')
      } catch (e) {
        verified = false
      }
    }
    await ctx.runMutation(api.functions.payments.record, {
      user_id: args.user_id,
      amount: args.amount,
      payment_type: args.payment_type,
      plan_tier: args.plan_tier,
      reference: args.reference,
      payment_status: verified ? 'verified' : 'pending',
    })
    return { status: verified ? 'verified' : 'pending' }
  },
})
