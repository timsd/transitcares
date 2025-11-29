# TransitCares (Ajo Safe Ride) – Simple Guide

This guide explains the project in everyday language. Follow it and you can run or rebuild a working copy.

## What This App Does
- Helps transport operators insure daily vehicle repairs (tricycle, minibus, bus)
- Lets you:
  - Create an account and log in
  - Fill in your vehicle details and choose a plan (Bronze, Silver, Gold)
  - Pay a small daily amount (your “daily premium”)
  - Upload repair invoices to make claims
  - See your wallet history and request withdrawals
  - If you’re an admin, review and approve claims and withdrawals

## What You Need
- A computer with Node.js installed
- Internet connection
- A Paystack public key (for test or live payments)
- Optionally: a simple backend URL if you want real logins and data storage

## How To Run It (on your computer)
1. Open a terminal in the project folder
2. Install packages: `npm install`
3. Start the app: `npm run dev`
4. Open the link shown in the terminal (usually `http://localhost:8080`)

## Set Up Your Secrets (keys)
Create a file named `.env` in the project folder and add:
- `VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key`
- `VITE_R2_WORKER_URL=https://your-backend.example.com` (used for login and error reporting)
- `VITE_CONVEX_URL=https://your-convex.example.com` (optional online database)
- `VITE_SENTRY_DSN=your_sentry_dsn` (optional error tracking)

If you don’t have a backend, the app still works using your browser’s local storage. You can log in with the demo flows and try features.

## Main Screens (how to use)
- Home: The landing page with a big banner, your dashboard, plans, claims, support, and footer
- Login/Signup: Enter your email and password; signup also asks your name
- Registration: Two steps — finish your profile, then pay a one‑time registration fee
- Profile: Fill in your name, phone, vehicle type, plate/ID, color, route, plan, and (optionally) upload a vehicle photo
- Plans: Pick Bronze, Silver, or Gold; each has a daily price and repair coverage range
- Weekly Compliance: Choose up to 4 days in a week to pay your daily premium; this qualifies you for claims
- Claims Center: Upload your mechanic’s invoice and submit a claim; you can see recent claims
- Wallet History: View payments and withdrawals; export to PDF
- Withdrawals: Request money out with bank details
- Admin: See stats, search users, and approve/reject claims and withdrawals

## Payments (simple explanation)
- The app uses Paystack for payments
- You’ll need your Paystack public key in `.env`
- When you click Pay, Paystack collects the money and the app records it
- Payment types:
  - Top up your wallet
  - Daily premium (your per‑day insurance payment)
  - One‑time registration fee

## Making a Claim
1. Make sure you completed your profile and plan
2. Pay your daily premium on the 4 selected days in a week (to qualify)
3. Go to the Claims Center, upload the mechanic’s invoice and submit
4. Track status: pending → processing → paid (or rejected)

## Admin Basics
- Admins can see a dashboard of users, payments, claims
- Admins review and approve/reject claims and withdrawals
- There’s a simple tool to move local demo data to the online database (if configured)

## Design & Look
- The app uses Tailwind CSS and a clean transport theme
- Colors are readable, buttons and cards are consistent, and mobile screens are supported

## Deploying Online (optional)
- You can host this on Netlify or similar
- Make sure to set the same `.env` values in your hosting dashboard
- Build the app locally with `npm run build` and upload the build

## Common Issues
- Payments not working: check your `VITE_PAYSTACK_PUBLIC_KEY`
- Login failing: set `VITE_R2_WORKER_URL` to a real backend endpoint
- Convex errors: remove `VITE_CONVEX_URL` if you don’t have Convex; the app will store data in your browser for demos
- Blank page: run `npm install` and then `npm run dev`

## Rebuild From Scratch (quick recipe)
1. Create a new React + TypeScript app
2. Add Tailwind and basic UI components
3. Add pages: Home, Auth, Registration, Profile, Admin, Mechanics
4. Add Paystack for payments
5. Add simple login and local storage for demo data
6. Optionally connect an online database (Convex) and error tracking (Sentry)
7. Match the look and flow described above

That’s it. With the steps above and your keys in `.env`, you can run the project and use all the main features without needing deep technical knowledge.
