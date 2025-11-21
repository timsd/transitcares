import { action } from "../_generated/server"
import { v } from "convex/values"

export const start = action({
  args: { user_id: v.string(), url: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthorized")
    if (identity.subject !== args.user_id) throw new Error("Forbidden")
    const endpoint = process.env.FIRECRAWL_URL || "https://api.firecrawl.dev/v1/crawl"
    const key = process.env.FIRECRAWL_API_KEY || ""
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ url: args.url }),
    })
    const data = await res.json().catch(() => ({}))
    await ctx.runMutation("crawls:record", { user_id: args.user_id, url: args.url, status: res.ok ? "completed" : "failed", data: JSON.stringify(data).slice(0, 5000) })
    return { ok: res.ok, data }
  },
})

