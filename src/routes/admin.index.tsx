import { createFileRoute } from '@tanstack/react-router'
import Admin from '@/pages/Admin'

export const Route = createFileRoute('/admin/')({
  loader: async () => {
    return { serverTime: new Date().toISOString() }
  },
  component: Admin,
})

