import { query, mutation } from "../_generated/server"
import { v } from "convex/values"

export const getDailyPaymentStatus = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    const today = new Date().toISOString().split('T')[0]
    const dailyPayment = await ctx.db
      .query("daily_payments")
      .withIndex("by_user", (q) =>
        q.eq("user_id", args.user_id)
         .eq("payment_date", today)
      )
      .first()

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    const penalties = await ctx.db
      .query("penalties")
      .withIndex("by_user", (q) =>
        q.eq("user_id", args.user_id)
         .order("desc")
      )
      .collect()

    return {
      dailyPayment,
      profile,
      totalPenalties: penalties?.reduce((sum, p) => sum + p.penalty_amount, 0) || 0,
      activePenalties: penalties?.filter(p => !p.is_waived) || [],
      isSuspended: profile?.is_suspended || false,
      missedPayments: profile?.missed_payments || 0,
    }
  },
})

export const recordDailyPayment = mutation({
  args: {
    user_id: v.string(),
    amount: v.number(),
    plan_tier: v.string(),
    payment_date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    const paymentDate = args.payment_date || new Date().toISOString().split('T')[0]

    // Check if payment already exists for today
    const existingPayment = await ctx.db
      .query("daily_payments")
      .withIndex("by_user", (q) =>
        q.eq("user_id", args.user_id)
         .eq("payment_date", paymentDate)
      )
      .first()

    if (existingPayment) {
      throw new Error('Payment already recorded for today')
    }

    // Record the daily payment
    const paymentId = await ctx.db.insert("daily_payments", {
      user_id: args.user_id,
      payment_date: paymentDate,
      amount: args.amount,
      plan_tier: args.plan_tier,
      payment_status: 'paid',
      due_date: paymentDate,
      created_at: new Date().toISOString(),
    })

    // Update profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    if (profile) {
      await ctx.db.patch(profile._id, {
        last_payment_date: paymentDate,
        missed_payments: 0, // Reset missed payments on successful payment
        is_suspended: false, // Unsuspend if payment is made
      })
    }

    return paymentId
  },
})

export const checkMissedPayments = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    const today = new Date()
    const todayString = today.toISOString().split('T')[0]

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    if (!profile) throw new Error('Profile not found')

    const lastPaymentDate = profile.last_payment_date ? new Date(profile.last_payment_date) : new Date(profile.registration_status === 'completed' ? today.getTime() : 0)
    const daysSinceLastPayment = Math.floor((today.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))

    // Plan pricing per day
    const planRates = {
      bronze: 1500,
      silver: 2500,
      gold: 4000
    }

    const dailyRate = planRates[profile.plan_tier as keyof typeof planRates] || 1500
    const missedDays = Math.max(0, daysSinceLastPayment - 1) // Don't count today

    let totalPenalty = 0
    const penalties: any[] = []

    // Check each missed day and apply penalties
    for (let i = 1; i <= missedDays; i++) {
      const missedDate = new Date(lastPaymentDate)
      missedDate.setDate(missedDate.getDate() + i)
      const missedDateString = missedDate.toISOString().split('T')[0]

      // Check if payment exists for this day
      const existingPayment = await ctx.db
        .query("daily_payments")
        .withIndex("by_user", (q) =>
          q.eq("user_id", args.user_id)
           .eq("payment_date", missedDateString)
        )
        .first()

      if (!existingPayment) {
        // Calculate penalty for missed day
        let penaltyAmount = 0

        if (i <= 3) {
          // First 3 days: 25% penalty
          penaltyAmount = dailyRate * 0.25
        } else if (i <= 7) {
          // Days 4-7: 50% penalty
          penaltyAmount = dailyRate * 0.5
        } else if (i <= 14) {
          // Days 8-14: 75% penalty
          penaltyAmount = dailyRate * 0.75
        } else {
          // Beyond 14 days: 100% penalty + suspension
          penaltyAmount = dailyRate * 1.0

          // Suspend user after 14 days of missed payments
          await ctx.db.patch(profile._id, {
            is_suspended: true,
            missed_payments: missedDays,
          })
        }

        if (penaltyAmount > 0) {
          totalPenalty += penaltyAmount

          // Record penalty
          penalties.push({
            user_id: args.user_id,
            penalty_type: i <= 14 ? 'missed_payment' : 'suspension',
            penalty_amount: penaltyAmount,
            description: `Penalty for missed payment on ${missedDateString}`,
            applied_at: new Date().toISOString(),
            related_payment_date: missedDateString,
            is_waived: false,
          })
        }

        // Record missed payment
        await ctx.db.insert("daily_payments", {
          user_id: args.user_id,
          payment_date: missedDateString,
          amount: dailyRate,
          plan_tier: profile.plan_tier,
          payment_status: 'missed',
          penalty_amount: penaltyAmount,
          due_date: missedDateString,
          created_at: new Date().toISOString(),
        })
      }
    }

    // Update profile with missed payments and penalties
    await ctx.db.patch(profile._id, {
      missed_payments: missedDays,
      total_penalties: (profile.total_penalties || 0) + totalPenalty,
      is_suspended: missedDays > 14,
    })

    // Insert all penalties
    for (const penalty of penalties) {
      await ctx.db.insert("penalties", penalty)
    }

    return {
      missedDays,
      totalPenalty,
      isSuspended: missedDays > 14,
      penalties,
    }
  },
})

export const processAllDailyPayments = mutation({
  args: {},
  handler: async (ctx) => {
    // This function should be called daily by a scheduled job
    const today = new Date().toISOString().split('T')[0]

    // Get all active users (those with completed registration)
    const activeProfiles = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("registration_status"), "completed"))
      .collect()

    const results: any[] = []

    for (const profile of activeProfiles) {
      try {
        // Check if user has already paid today
        const todayPayment = await ctx.db
          .query("daily_payments")
          .withIndex("by_user", (q) =>
            q.eq("user_id", profile.user_id)
             .eq("payment_date", today)
          )
          .first()

        if (!todayPayment) {
          const result = await ctx.runMutation("dailyPayments.checkMissedPayments", {
            user_id: profile.user_id
          })
          results.push({
            user_id: profile.user_id,
            status: 'processed',
            ...result
          })
        } else {
          results.push({
            user_id: profile.user_id,
            status: 'already_paid',
            last_payment_date: profile.last_payment_date,
          })
        }
      } catch (error) {
        results.push({
          user_id: profile.user_id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  },
})

export const waivePenalty = mutation({
  args: {
    user_id: v.string(),
    penalty_id: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    if (identity.subject !== args.user_id) throw new Error('Forbidden')

    const penalty = await ctx.db.get(args.penalty_id as any)
    if (!penalty) throw new Error('Penalty not found')
    if (penalty.user_id !== args.user_id) throw new Error('Penalty does not belong to user')

    // Update penalty to waived
    await ctx.db.patch(args.penalty_id as any, {
      is_waived: true,
    })

    // Update profile total penalties
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first()

    if (profile) {
      const newTotalPenalties = Math.max(0, (profile.total_penalties || 0) - penalty.penalty_amount)
      await ctx.db.patch(profile._id, {
        total_penalties: newTotalPenalties,
      })
    }

    return { success: true, waivedAmount: penalty.penalty_amount }
  },
})