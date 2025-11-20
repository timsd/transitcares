import { createFileRoute, redirect } from '@tanstack/react-router'
import Profile from '@/pages/Profile'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (!token) throw redirect({ to: '/auth' })
    }
  },
  component: () => <Profile />,
})
