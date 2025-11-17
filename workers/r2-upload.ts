export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url)
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!env.API_TOKEN || token !== env.API_TOKEN) return new Response('Unauthorized', { status: 401 })

    if (request.method === 'POST' && url.pathname === '/upload') {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) return new Response('No file', { status: 400 })
      const key = `${Date.now()}-${crypto.randomUUID()}-${file.name}`
      await env.R2_BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })
      return new Response(JSON.stringify({ key }), { headers: { 'Content-Type': 'application/json' } })
    }

    return new Response('Not found', { status: 404 })
  }
}
