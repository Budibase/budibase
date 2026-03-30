import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const budibaseTarget = "http://localhost:10000"

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
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
      "/builder": {
        target: budibaseTarget,
        changeOrigin: true,
      },
    },
  },
})
