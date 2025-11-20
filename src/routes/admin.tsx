import { createFileRoute, redirect } from '@tanstack/react-router'
import Admin from '@/pages/Admin'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      const role = localStorage.getItem('role') || ''
      if (!token || role !== 'admin') throw redirect({ to: '/auth' })
    }
  },
  component: () => <Admin />,
})
