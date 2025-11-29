import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout')({
  loader: async () => {
    return { serverTime: new Date().toISOString() }
  },
  component: () => <Outlet />,
})

