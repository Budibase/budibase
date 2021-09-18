import svelte from "@sveltejs/vite-plugin-svelte"
import replace from "@rollup/plugin-replace"

import path from "path"

export default ({ mode }) => {
  const isProduction = mode === "production"
  return {
    base: "/builder/",
    build: {
      minify: isProduction,
      outDir: "../server/builder",
    },
    plugins: [
      svelte({
        hot: !isProduction,
        emitCss: true,
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.POSTHOG_TOKEN": JSON.stringify(process.env.POSTHOG_TOKEN),
        "process.env.POSTHOG_URL": JSON.stringify(process.env.POSTHOG_URL),
        "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
      }),
    ],
    optimizeDeps: {
      exclude: ["@roxi/routify"],
    },
    resolve: {
      dedupe: ["@roxi/routify"],
      alias: [
        {
          find: "assets",
          replacement: path.resolve("./assets"),
        },
        {
          find: "components",
          replacement: path.resolve("./src/components"),
        },
        {
          find: "builderStore",
          replacement: path.resolve("./src/builderStore"),
        },
        {
          find: "stores",
          replacement: path.resolve("./src/stores"),
        },
        {
          find: "constants",
          replacement: path.resolve("./src/constants"),
        },
        {
          find: "analytics",
          replacement: path.resolve("./src/analytics"),
        },
        {
          find: "actions",
          replacement: path.resolve("./src/actions"),
        },
        {
          find: "helpers",
          replacement: path.resolve("./src/helpers"),
        },
      ],
    },
  }
}
