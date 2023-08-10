import { svelte } from "@sveltejs/vite-plugin-svelte"
import replace from "@rollup/plugin-replace"
import { defineConfig, loadEnv } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import path from "path"

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
]

const copyFonts = dest =>
  viteStaticCopy({
    targets: [
      {
        src: "../../node_modules/@fontsource/source-sans-pro",
        dest,
      },
      {
        src: "../../node_modules/remixicon/fonts/*",
        dest,
      },
    ],
  })

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"
  const env = loadEnv(mode, process.cwd())

  // Plugins to only run in dev
  const devOnlyPlugins = [
    // Copy fonts to an additional path so that svelte's automatic
    // prefixing of the base URL path can still resolve assets
    copyFonts("builder/fonts"),
  ]

  return {
    test: {
      setupFiles: ["./vitest.setup.js"],
      globals: true,
      environment: "jsdom",
    },
    server: {
      fs: {
        strict: false,
      },
      hmr: {
        protocol: env.VITE_HMR_PROTOCOL || "ws",
        clientPort: env.VITE_HMR_CLIENT_PORT || 3000,
        path: env.VITE_HMR_PATH || "/",
      },
      port: 3000,
    },
    base: "/builder/",
    build: {
      minify: isProduction,
      outDir: "../server/builder",
      sourcemap: !isProduction,
    },
    plugins: [
      svelte({
        hot: !isProduction,
        emitCss: true,
        onwarn: (warning, handler) => {
          // Ignore some warnings
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning)
          }
        },
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.POSTHOG_TOKEN": JSON.stringify(process.env.POSTHOG_TOKEN),
        "process.env.INTERCOM_TOKEN": JSON.stringify(
          process.env.INTERCOM_TOKEN
        ),
        "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
      }),
      copyFonts("fonts"),
      ...(isProduction ? [] : devOnlyPlugins),
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
          find: "api",
          replacement: path.resolve("./src/api.js"),
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
