import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: [
      {
        find: "@budibase/frontend-core",
        replacement: path.resolve(__dirname, "../frontend-core/src"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
})
