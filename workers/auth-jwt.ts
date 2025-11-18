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

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || '*'
    const allowedOrigin = (env.ALLOWED_ORIGIN as string) || origin

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method === 'POST' && url.pathname === '/auth/login') {
      const { email, password } = await request.json()
      if (!email || !password) return new Response('Bad request', { status: 400 })
      const sub = btoa(email).slice(0, 12)
      const adminEmails = (env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim())
      const role = adminEmails.includes(email) ? 'admin' : 'user'
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
      const jwt = await signHS256({ sub, email, role, exp, iss: 'ajo-safe-ride' }, env.AUTH_JWT_SECRET)
      return new Response(JSON.stringify({ token: jwt }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    if (request.method === 'POST' && url.pathname === '/auth/signup') {
      const { email, password, full_name } = await request.json()
      if (!email || !password) return new Response('Bad request', { status: 400 })
      const sub = btoa(email).slice(0, 12)
      const role = 'user'
      const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
      const jwt = await signHS256({ sub, email, role, exp, iss: 'ajo-safe-ride' }, env.AUTH_JWT_SECRET)
      return new Response(JSON.stringify({ token: jwt }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } })
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  }
}
