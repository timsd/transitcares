import { ConvexReactClient } from 'convex/react'

const url = import.meta.env.VITE_CONVEX_URL as string | undefined
export const convexClient = url ? new ConvexReactClient(url) : undefined

export function applyAuthFromLocal() {
  if (!convexClient) return
  const token = localStorage.getItem('auth_token')
  if (token) {
    convexClient.setAuth(() => token)
  } else {
    convexClient.setAuth(() => null as any)
  }
}
