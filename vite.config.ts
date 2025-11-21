import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlifyTanStack from "@netlify/vite-plugin-tanstack-start";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    tanstackStart({ target: 'netlify' }),
    netlifyTanStack(),
    react(),
    ...(mode === 'production' && process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT ? [
      sentryVitePlugin({ org: process.env.SENTRY_ORG as string, project: process.env.SENTRY_PROJECT as string, authToken: process.env.SENTRY_AUTH_TOKEN as string })
    ] : []),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: mode === 'production',
  },
}));
