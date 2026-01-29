import { defineConfig } from "vite"
import path from "path"

export default defineConfig(() => {
  return {
    test: {
      globals: true,
      include: ["src/**/*.test.*", "src/**/*.spec.*"],
    },
    resolve: {
      alias: [
        {
          find: "@budibase/types",
          replacement: path.resolve("../types/src"),
        },
        {
          find: "@budibase/shared-core",
          replacement: path.resolve("../shared-core/src"),
        },
      ],
    },
  }
})
