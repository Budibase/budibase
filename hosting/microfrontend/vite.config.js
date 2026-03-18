import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const budibaseTarget = "http://localhost:10000"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: budibaseTarget,
        changeOrigin: true,
      },
      "/socket": {
        target: budibaseTarget,
        changeOrigin: true,
        ws: true,
      },
      "/worker": {
        target: budibaseTarget,
        changeOrigin: true,
      },
      "/builder": {
        target: budibaseTarget,
        changeOrigin: true,
      },
      "/app": {
        target: budibaseTarget,
        changeOrigin: true,
      },
      "/app_": {
        target: budibaseTarget,
        changeOrigin: true,
      },
    },
  },
})
