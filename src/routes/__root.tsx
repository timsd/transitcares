/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { ConvexProvider } from 'convex/react'
import { convexClient } from '@/integrations/convex/client'
import * as Sentry from '@sentry/react'
import '@/index.css'
import appleTouchIcon from '@/assets/apple-touch-icon.png?url'
import faviconIco from '@/assets/favicon.ico?url'
import siteManifestUrl from '@/assets/site.webmanifest?url'

const queryClient = new QueryClient()

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
const isDev = import.meta.env.MODE === 'development'
const workerUrl = import.meta.env.VITE_R2_WORKER_URL as string | undefined
const tunnel = !isDev && workerUrl
  ? workerUrl.replace(/\/+$/, '') + '/tunnel'
  : undefined
if (typeof window !== 'undefined' && dsn && !isDev) {
  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 0.3,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    tunnel,
    beforeSend: (event) => {
      if (event.user) {
        delete (event.user as any).email
        delete (event.user as any).ip_address
      }
      return event
    },
  })
}
if (typeof window === 'undefined' && dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  })
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TransitCares' },
    ],
    links: [
      { rel: 'apple-touch-icon', href: appleTouchIcon },
      { rel: 'icon', href: faviconIco },
      { rel: 'manifest', href: siteManifestUrl },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Sentry.ErrorBoundary fallback={<div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Something went wrong</h2>
            <p style={{ marginTop: 8 }}>Please refresh the page. If the issue persists, contact support.</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'var(--primary)', color: 'var(--primary-foreground)' }}>Reload</button>
          </div>}>
            {convexClient ? (
              <ConvexProvider client={convexClient}>
                <Outlet />
              </ConvexProvider>
            ) : (
              <Outlet />
            )}
          </Sentry.ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
