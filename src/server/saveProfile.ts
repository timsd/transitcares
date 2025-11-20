import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const ProfileSchema = z.object({
  user_id: z.string(),
  full_name: z.string().min(2),
  phone: z.string().min(7),
  vehicle_type: z.string().min(3),
  vehicle_id: z.string().min(3),
  vehicle_color: z.string().min(3),
  chassis_number: z.string().min(3),
  designated_route: z.string().min(3),
  plan_tier: z.enum(['bronze', 'silver', 'gold']),
  vehicle_photo_key: z.string().nullable().optional(),
})

export const saveProfile = createServerFn('POST', async (payload: unknown) => {
  const parsed = ProfileSchema.parse(payload)
  return { ok: true, data: parsed }
})

