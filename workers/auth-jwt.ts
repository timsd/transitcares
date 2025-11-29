function base64url(input: ArrayBuffer | string) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input)
  let str = btoa(String.fromCharCode(...bytes))
  return str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function signHS256(payload: any, secret: string) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encHeader = base64url(JSON.stringify(header))
  const encPayload = base64url(JSON.stringify(payload))
  const data = `${encHeader}.${encPayload}`
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return `${data}.${base64url(sig)}`
}

function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    return JSON.parse(atob(parts[1]))
  } catch {
    return null
  }
}

// In a real implementation, this would be stored securely in a database
const resetTokens = new Map<string, { email: string; expires: number }>()

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || '*'
    const allowedOrigin = (env.ALLOWED_ORIGIN as string) || origin

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method === 'POST' && url.pathname === '/auth/login') {
      const { email, password } = await request.json()
      if (!email || !password) return new Response('Bad request', { status: 400, headers: corsHeaders })
      const adminEmails = (env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim())
      const isAdmin = adminEmails.includes(email)
      if (isAdmin) {
        const ok = !!env.ADMIN_PASSWORD && password === env.ADMIN_PASSWORD
        if (!ok) return new Response('Unauthorized', { status: 401, headers: corsHeaders })
      } else if (env.DEFAULT_USER_PASSWORD) {
        const ok = password === env.DEFAULT_USER_PASSWORD
        if (!ok) return new Response('Unauthorized', { status: 401, headers: corsHeaders })
      }
      const sub = btoa(email).slice(0, 12)
      const role = isAdmin ? 'admin' : 'user'
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
      const jwt = await signHS256({ sub, email, role, exp, iss: 'transitcares' }, env.AUTH_JWT_SECRET)
      return new Response(JSON.stringify({ token: jwt }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'POST' && url.pathname === '/auth/signup') {
      const { email, password, full_name } = await request.json()
      if (!email || !password) return new Response('Bad request', { status: 400, headers: corsHeaders })
      const sub = btoa(email).slice(0, 12)
      const role = 'user'
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
      const jwt = await signHS256({ sub, email, role, exp, iss: 'transitcares' }, env.AUTH_JWT_SECRET)
      return new Response(JSON.stringify({ token: jwt }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'POST' && url.pathname === '/auth/forgot-password') {
      const { email } = await request.json()
      if (!email) return new Response('Bad request', { status: 400, headers: corsHeaders })

      // Generate reset token (in production, store in database)
      const resetToken = base64url(crypto.getRandomValues(new Uint8Array(32)))
      const expires = Date.now() + 60 * 60 * 1000 // 1 hour
      resetTokens.set(resetToken, { email, expires })

      // In production, you would send an email here
      // For now, just return success with reset token for development
      return new Response(JSON.stringify({
        message: 'Password reset instructions sent to your email',
        resetToken: resetToken // Only for development - remove in production!
      }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'POST' && url.pathname === '/auth/reset-password') {
      const { token, newPassword } = await request.json()
      if (!token || !newPassword) return new Response('Bad request', { status: 400, headers: corsHeaders })

      const resetData = resetTokens.get(token)
      if (!resetData || Date.now() > resetData.expires) {
        return new Response('Invalid or expired reset token', { status: 400, headers: corsHeaders })
      }

      // Remove used reset token
      resetTokens.delete(token)

      // In production, you would update the user's password in the database
      // For now, just return success
      return new Response(JSON.stringify({
        message: 'Password has been reset successfully',
        email: resetData.email
      }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'GET' && url.pathname === '/paystack/verify') {
      const reference = url.searchParams.get('reference')
      if (!reference) return new Response(JSON.stringify({ status: 'error', message: 'Missing reference' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
      try {
        const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: { 'Authorization': `Bearer ${env.PAYSTACK_SECRET_KEY}` },
        })
        const body = await res.json()
        const status = body?.data?.status === 'success' ? 'success' : 'failed'
        return new Response(JSON.stringify({ status, data: body?.data || null }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
      } catch (e: any) {
        return new Response(JSON.stringify({ status: 'error', message: e?.message || 'verify failed' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
      }
    }

    if (request.method === 'POST' && url.pathname === '/sentry/capture') {
      try {
        const dsn = env.SENTRY_DSN as string | undefined
        const body = await request.json().catch(() => ({}))
        if (!dsn) {
          return new Response(JSON.stringify({ status: 'noop' }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
        }
        const m = dsn.match(/^https:\/\/([^@]+)@[^\/]+\/(\d+)/)
        const key = m?.[1]
        const project = m?.[2]
        if (!key || !project) {
          return new Response(JSON.stringify({ status: 'error', message: 'Invalid DSN' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
        }
        const endpoint = `https://sentry.io/api/${project}/store/?sentry_key=${key}&sentry_version=7`
        const payload = {
          message: body?.message || 'Captured error',
          level: body?.level || 'error',
          timestamp: Math.floor(Date.now() / 1000),
          extra: body?.extra || {},
          tags: body?.tags || {},
        }
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        return new Response(JSON.stringify({ status: resp.ok ? 'ok' : 'failed' }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
      } catch (e: any) {
        return new Response(JSON.stringify({ status: 'error', message: e?.message || 'capture failed' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } })
      }
    }

    if (request.method === 'POST' && url.pathname === '/tunnel') {
      try {
        const dsn = env.SENTRY_DSN as string | undefined
        if (!dsn) return new Response('Missing DSN', { status: 200, headers: corsHeaders })
        const m = dsn.match(/^https:\/\/([^@]+)@[^\/]+\/(\d+)/)
        const key = m?.[1]
        const project = m?.[2]
        if (!key || !project) return new Response('Invalid DSN', { status: 400, headers: corsHeaders })
        const endpoint = `https://sentry.io/api/${project}/envelope/?sentry_key=${key}&sentry_version=7`
        const body = await request.arrayBuffer()
        const resp = await fetch(endpoint, { method: 'POST', body })
        return new Response(resp.body, { status: resp.status, headers: { 'Access-Control-Allow-Origin': allowedOrigin } })
      } catch (e: any) {
        return new Response('Tunnel error', { status: 500, headers: corsHeaders })
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  }
}
