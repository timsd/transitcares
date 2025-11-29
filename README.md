# TransitCares

## Local Development

- Prerequisites: Node 22, npm
- Install: `npm ci`
- Run dev: `npm run dev`
- Convex dev (optional): `npx convex dev`

## Environment Variables

Create `.env.local` with:

- `VITE_CONVEX_URL=https://<your-convex-deployment>.convex.cloud`
- `VITE_PAYSTACK_PUBLIC_KEY=pk_test_...`
- `VITE_SENTRY_DSN=https://<key>@<host>/<project>`
- `VITE_R2_WORKER_URL=https://<your-worker>.workers.dev`

Cloudflare Worker (secrets):

- `SENTRY_DSN=https://<key>@<host>/<project>`
- `PAYSTACK_SECRET_KEY=sk_test_...`
- `AUTH_JWT_SECRET=<random>`
- `FIRECRAWL_URL=https://api.firecrawl.dev/v1/crawl`
- `FIRECRAWL_API_KEY=fc_...`

Netlify (site env):

- `VITE_CONVEX_URL`
- `VITE_SENTRY_DSN`
- `VITE_R2_WORKER_URL` (optional)
- `CONVEX_DEPLOY_KEY` (build)

## Key Features

- Reactive Convex hooks with auth guards
- Convex actions: Paystack verify & Firecrawl
- Convex storage uploads via `generateUploadUrl`
- Sentry SSR init, tunnel via Worker, source maps via CI
- Netlify scheduled metrics summary

## Testing

- Manual: visit `/admin` and `/profile`, exercise payments and claims flows
- Metrics: Admin shows average latencies and error counts (last 7 days)

