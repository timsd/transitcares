type Session = { user: { id: string; email: string }; token: string } | null

const listeners: Array<(session: Session) => void> = []

const decodeToken = (token: string | null) => {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

const getSession = (): Session => {
  const token = localStorage.getItem('auth_token')
  const payload = decodeToken(token)
  if (!token || !payload) return null
  return { user: { id: payload.sub, email: payload.email }, token }
}

const setToken = (token: string | null) => {
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
  const s = getSession()
  listeners.forEach((l) => l(s))
}

export const authClient = {
  onAuthStateChange(cb: (session: Session) => void) {
    listeners.push(cb)
    cb(getSession())
    return () => {
      const i = listeners.indexOf(cb)
      if (i >= 0) listeners.splice(i, 1)
    }
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const url = (import.meta.env.VITE_R2_WORKER_URL as string || '') + '/auth/login'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    setToken(data.token)
  },
  async signUp({ email, password, full_name }: { email: string; password: string; full_name?: string }) {
    const url = (import.meta.env.VITE_R2_WORKER_URL as string || '') + '/auth/signup'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    })
    if (!res.ok) throw new Error('Signup failed')
    const data = await res.json()
    const id = decodeToken(data.token)?.sub
    if (id) localStorage.setItem('profile:' + id, JSON.stringify({ user_id: id, full_name }))
    setToken(data.token)
  },
  async signOut() {
    setToken(null)
  },
  getSession,
}
