import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlifyTanStack from "@netlify/vite-plugin-tanstack-start";
import path from "path";

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
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
