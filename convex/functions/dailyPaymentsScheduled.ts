import { httpAction } from "../_generated/server"
import { v } from "convex/values"

export const processAllDailyPayments = httpAction(async (ctx, request) => {
  try {
    // Verify this is a valid scheduled request (you'd implement authentication here)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      )
    }

    const result = await ctx.runMutation("dailyPayments.processAllDailyPayments", {})

    return new Response(
      JSON.stringify({
        success: true,
        processed: result.length,
        summary: result.reduce((acc, r) => {
          if (r.status === 'already_paid') acc.paid++
          else if (r.status === 'processed') acc.processed++
          else if (r.status === 'error') acc.errors++
          return acc
        }, { paid: 0, processed: 0, errors: 0 })
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Daily payment processing failed:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
})