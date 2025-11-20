import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  profiles: defineTable({
    user_id: v.string(),
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
    payment_days: v.optional(v.array(v.string())),
    auto_payment_enabled: v.optional(v.boolean()),
  }).index("by_user", ["user_id"]),
  claims: defineTable({
    user_id: v.string(),
    claim_type: v.string(),
    claim_amount: v.number(),
    claim_status: v.string(),
    description: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["user_id"]),
  withdrawals: defineTable({
    user_id: v.string(),
    amount: v.number(),
    bank_name: v.string(),
    account_number: v.string(),
    account_name: v.string(),
    status: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["user_id"]),
  payments: defineTable({
    user_id: v.string(),
    amount: v.number(),
    payment_type: v.string(),
    reference: v.optional(v.string()),
    payment_status: v.optional(v.string()),
    created_at: v.string(),
  }).index("by_user", ["user_id"]),
})
