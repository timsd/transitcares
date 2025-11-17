# Platform Setup Guide (Step by Step)

Use this as a checklist to connect our app to each service. Fill in the environment variables, then build and test.

## 1) GitHub Repository
- Repo: `git@github.com:timsd/transitcares.git`
- Ensure secrets are not committed:
  - `.gitignore` includes `.env` and `dist` (already added)
  - Keep all secrets only in platform environment settings

## 2) Cloudflare (Workers + R2)
### What we use
- `workers/auth-jwt.ts`: issues JWT tokens for login/signup
- `workers/r2-upload.ts`: uploads claim invoices to an R2 bucket
- `wrangler.toml`: binds R2 and stores Worker environment variables

### Steps
1. Sign in to Cloudflare and select Workers
2. Link the GitHub repo `timsd/transitcares`
3. Create two Worker projects:
   - Auth: point to `workers/auth-jwt.ts`
   - Uploads: point to `workers/r2-upload.ts`
4. In the Worker settings → Variables:
   - `API_TOKEN`: strong random string
   - `AUTH_JWT_SECRET`: strong random string
   - `ADMIN_EMAILS`: comma-separated admin emails
5. Add R2 bucket:
   - Create bucket named `ajo-safe-ride-uploads`
   - Bind it in `wrangler.toml` as `R2_BUCKET`
6. Deploy Workers from Cloudflare UI or run `wrangler deploy` locally
7. In the app `.env`:
   - `VITE_R2_WORKER_URL="https://<your-worker>.workers.dev"`
   - Do NOT set a token in client env; uploads use the user JWT (Authorization: Bearer `<auth_token>`)

## 3) Convex (Data & Functions)
### What we use
- Tables and functions are defined in `convex/`

### Steps
1. In `.env`, set `VITE_CONVEX_URL="https://proficient-lynx-386.convex.cloud"`
2. In Netlify env, set:
   - `CONVEX_DEPLOYMENT=proficient-lynx-386`
   - `CONVEX_DEPLOYMENT_KEY=eyJ2MiI6ImQzY...`
   - Optional: set `SECRETS_SCAN_OMIT_KEYS` to ignore public `VITE_*` URLs
3. Local typed API (optional):
   - `npx convex dev --configure=existing --team timothy-3dd5f --project transitcares`
   - `npx convex codegen`
4. After codegen, use typed hooks: `useQuery(api.claims.list, ...)`, `useMutation(api.withdrawals.create)`, etc.

## 4) Netlify (Hosting)
### Steps
1. Connect repository `timsd/transitcares` on Netlify
2. Site settings → Environment variables, add:
   - `VITE_CONVEX_URL`
   - `VITE_R2_WORKER_URL`
   - `VITE_PAYSTACK_PUBLIC_KEY`
   - `VITE_SENTRY_DSN`
   - `CONVEX_DEPLOYMENT`, `CONVEX_DEPLOYMENT_KEY`
3. Build command: `npm run build`
4. Publish directory: `dist/client`
5. Deploy and test

## 5) Paystack (Payments)
### Steps
1. Get your public key from Paystack dashboard
2. In `.env`, set `VITE_PAYSTACK_PUBLIC_KEY="<your key>"`
3. Test a top-up or registration payment on the dashboard page

## 6) Sentry (Monitoring)
### Steps
1. Create a Sentry project; copy the DSN
2. In `.env`, set `VITE_SENTRY_DSN="<your dsn>"`
3. Build and verify events appear in Sentry after navigation/actions

## 7) Firecrawl (Optional)
### Steps
1. In `wrangler.toml`, set `FIRECRAWL_API_KEY` and `FIRECRAWL_URL`
2. Deploy proxy Worker (if used) and test any crawl endpoints

## 8) CodeRabbit (PR Reviews)
### Steps
1. Enable CodeRabbit for your GitHub organization
2. Ensure `.coderabbit.yml` exists in the repo
3. Open a PR and verify CodeRabbit posts a review

## 9) TanStack Start (Routing & SSR)
### Steps
1. Already configured in `vite.config.ts` with `tanstackStart()`
2. Pages live under `src/routes/*`; the root shell is `src/routes/__root.tsx`
3. Build with `npm run build` and deploy on Netlify

## Testing Checklist
- Login and signup (JWT Worker)
- Update profile and plan tier
- Upload invoice and submit claim (R2 + Convex)
- Top-up via Paystack and record payment
- Admin: list items, filter, approve claim, migrate local data
- Verify Sentry receives events
