async function verifyHS256(token: string, secret: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, s] = parts
  const data = `${h}.${p}`
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const sig = Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  const ok = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data))
  if (!ok) return null
  try {
    const payload = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)
    const bearer = request.headers.get('Authorization')?.replace('Bearer ', '')
    const payload = bearer ? await verifyHS256(bearer, env.AUTH_JWT_SECRET) : null
    if (!payload) return new Response('Unauthorized', { status: 401 })

    if (request.method === 'POST' && url.pathname === '/upload') {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) return new Response('No file', { status: 400 })
      // Basic validation: allow PDFs and images up to 10MB
      const allowed = file.type.startsWith('image/') || file.type === 'application/pdf'
      const buf = await file.arrayBuffer()
      if (!allowed) return new Response('Unsupported file type', { status: 415 })
      if (buf.byteLength > 10 * 1024 * 1024) return new Response('File too large', { status: 413 })
      const key = `${payload.sub || 'anon'}-${Date.now()}-${crypto.randomUUID()}-${file.name}`
      await env.R2_BUCKET.put(key, buf, { httpMetadata: { contentType: file.type } })
      return new Response(JSON.stringify({ key }), { headers: { 'Content-Type': 'application/json' } })
    }

    return new Response('Not found', { status: 404 })
  }
}
