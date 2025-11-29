import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const getWeeklyPaymentStatus = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 7))

    const weekStartStr = weekStart.toISOString().split('T')[0]
    const weekEndStr = weekEnd.toISOString().split('T')[0]

    const weeklyPayment = await ctx.db
      .query("weekly_payments")
      .withIndex("by_user", (q) =>
        q.eq("user_id", args.user_id)
         .eq("week_start", weekStartStr)
      )
      .first()

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    const planRates = {
      bronze: 1500,
      silver: 2500,
      gold: 4000
    }

    const weeklyAmount = planRates[profile?.plan_tier as keyof typeof planRates] || 1500
    const isPaid = weeklyPayment?.payment_status === 'paid'

    return {
      weeklyPayment,
      profile,
      weeklyAmount,
      isPaid,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      currentWeekEligible: profile?.current_week_eligible || false
    }
  },
})

export const recordWeeklyPayment = mutation({
  args: {
    user_id: v.string(),
    week_start: v.string(),
    total_amount: v.number(),
    payment_count: v.number(),
    plan_tier: v.string(),
    payment_dates: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    // Check if weekly payment already exists for this week
    const existingPayment = await ctx.db
      .query("weekly_payments")
      .withIndex("by_user", (q) =>
        q.eq("user_id", args.user_id)
         .eq("week_start", args.week_start)
      )
      .first()

    if (existingPayment) {
      throw new Error('Weekly payment already recorded for this week')
    }

    // Record weekly payment
    const paymentId = await ctx.db.insert("weekly_payments", {
      user_id: args.user_id,
      week_start: args.week_start,
      total_amount: args.total_amount,
      payment_count: args.payment_count,
      plan_tier: args.plan_tier,
      payment_status: 'paid',
      payment_dates: args.payment_dates,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Update profile - mark current week as eligible
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    if (profile) {
      await ctx.db.patch(profile._id, {
        current_week_eligible: true,
        last_payment_date: args.payment_dates?.[0] || new Date().toISOString(),
      })
    }

    return paymentId
  },
})

export const updateWeeklyPaymentStatus = mutation({
  args: {
    weekly_payment_id: v.string(),
    payment_status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')

    const weeklyPayment = await ctx.db.get(args.weekly_payment_id as any)
    if (!weeklyPayment) throw new Error('Weekly payment not found')

    // Only allow updates from admins for security
    // const isAdmin = identity.role === 'admin'
    // if (!isAdmin) throw new Error('Forbidden')

    await ctx.db.patch(args.weekly_payment_id as any, {
      payment_status: args.payment_status,
      updated_at: new Date().toISOString(),
    })

    return { success: true }
  },
})