import { federation } from "@module-federation/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Base URL for remote chunks so the host loads them from Budibase, not from host origin
const budibasePublicUrl = (
  process.env.BUDIBASE_PUBLIC_URL ||
  process.env.PLATFORM_URL ||
  "http://localhost:10000"
).replace(/\/?$/, "/")

export default defineConfig({
  root: __dirname,
  base: budibasePublicUrl,
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: false,
    target: "chrome89",
    rollupOptions: {
      input: path.resolve(__dirname, "index.federation.html"),
    },
  },
  plugins: [
    react(),
    federation({
      name: "budibaseApp",
      filename: "remoteEntry.js",
      exposes: {
        "./BudibaseAppScriptLoader":
          "./src/microfrontend/BudibaseAppScriptLoader.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
      // So remote chunks (e.g. /assets/*.js) load from Budibase origin, not host origin
      getPublicPath: `function() { return "${budibasePublicUrl.replace(/"/g, '\\"')}"; }`,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
