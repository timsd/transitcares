import { mutation } from "../_generated/server"

export const getUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthorized')
    const url = await ctx.storage.generateUploadUrl()
    return { url }
  },
})

