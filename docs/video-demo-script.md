# Ajo Safe Ride – Simple Video Script (Show & Tell)

## What This App Uses
- TanStack Start: pages and SSR
- Convex: our database and server functions
- Cloudflare: Workers for uploads and login, R2 for files
- Paystack: payments (public key only)
- Sentry: error tracking
- Firecrawl: optional web crawl via Worker proxy
- Netlify: hosting
- CodeRabbit: code review in PRs

## 1) Start at the Root (HTML shell)
- Open `src/routes/__root.tsx:1–59`
- Say: “This is the app’s HTML wrapper. Head tags come from `<HeadContent />`. Scripts load with `<Scripts />`. Our providers (Convex, React Query, toasters) wrap `<Outlet />` which renders the current page.”

## 2) Routing
- Open `src/router.tsx:1–8`
- Say: “The router is created here. TanStack Start builds routes from files under `src/routes/*`.”
- Open `src/routes/index.tsx:1–5`
- Say: “This file says: when we’re at `/`, render our home page.”

## 3) Auth (Cloudflare Worker JWT)
- Open `workers/auth-jwt.ts:1–46`
- Say: “This Worker returns a signed token for login and signup. We mark admins by email and include a `role` claim in the token.”
- Open `src/integrations/auth/client.ts:1–80`
- Say: “The frontend calls the Worker, saves the token, and tells Convex to use it.”
- Open `src/integrations/convex/client.ts:1–14`
- Say: “Here we connect to Convex and set the token with `setAuth`.”

## 4) Data (Convex)
- Open `convex/schema.ts:3–38`
- Say: “These are our tables: profiles, claims, withdrawals, payments.”
- Open `convex/functions/claims.ts`, `withdrawals.ts`, `payments.ts`, `profiles.ts`
- Say: “Each file has simple functions to list, create, or update records.”

## 5) Home Page Sections
- Open `src/components/Header.tsx:25–53, 55–79`
- Say: “Brand clicks go home. Buttons navigate and scroll to sections.”
- Open `src/components/HeroSection.tsx:26–34`
- Say: “The main CTA goes to registration. The secondary CTA scrolls to plans.”
- Open `src/components/UserDashboard.tsx:96–105`
- Say: “Daily premium shows based on your plan. Top-up and register use Paystack and record to Convex.”
- Open `src/components/ClaimsCenter.tsx:95–112, 114–165`
- Say: “Upload an invoice to Cloudflare R2 and submit a claim. We gate submission by login and vehicle details.”

## 6) Admin
- Open `src/pages/Admin.tsx:177–215`
- Say: “This button migrates any old local data to Convex.”
- Open `src/pages/Admin.tsx:224–278, 280–340, 342–383`
- Say: “Claims, withdrawals, and users list here with filters and actions. Approving a claim updates it in Convex.”

## 7) Uploads (Cloudflare R2)
- Open `workers/r2-upload.ts:1–18`
- Say: “This Worker accepts a file, stores it in R2, and returns a key. The app shows the key and links it to the claim.”
- Open `wrangler.toml:4–10`
- Say: “Here we bind R2 and set a token for security.”

## 8) Environment
- Open `.env`
- Say: “We set things like `VITE_CONVEX_URL`, the Worker URL and token, Paystack public key, and Sentry DSN.”

## 9) Deploy and Test
- Say: “On Netlify, add the same environment variables. Build with `npm run build`. Test: login, update profile, top-up, upload invoice, submit claim, approve in admin.”

## 10) Why These Tools
- TanStack Start: clean routing and SSR
- Convex: easy database and functions
- Cloudflare Workers + R2: simple, fast uploads and custom auth
- Paystack: straightforward payments
- Sentry: see errors and performance
- Netlify: quick hosting
- CodeRabbit: better PR reviews

