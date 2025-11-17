import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
  profiles: defineTable({
    user_id: "string",
    full_name: "string",
    phone: "string",
    vehicle_id: "string",
    plan_tier: "string",
    wallet_balance: "number",
    registration_status: "string",
  }).index("by_user", ["user_id"]),
  claims: defineTable({
    user_id: "string",
    claim_type: "string",
    claim_amount: "number",
    claim_status: "string",
    description: "string",
    created_at: "string",
    updated_at: "string",
  }).index("by_user", ["user_id"]),
  withdrawals: defineTable({
    user_id: "string",
    amount: "number",
    bank_name: "string",
    account_number: "string",
    account_name: "string",
    status: "string",
    created_at: "string",
    updated_at: "string",
  }).index("by_user", ["user_id"]),
  payments: defineTable({
    user_id: "string",
    amount: "number",
    payment_type: "string",
    created_at: "string",
  }).index("by_user", ["user_id"]),
})
