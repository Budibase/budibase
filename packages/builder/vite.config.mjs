import { svelte } from "@sveltejs/vite-plugin-svelte"
import replace from "@rollup/plugin-replace"
import { defineConfig, loadEnv } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"
import path from "path"
import typescript from "@rollup/plugin-typescript"

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
      typescript({ outDir: "../server/builder/dist" }),
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
      }),
      copyFonts("fonts"),
      ...(isProduction ? [] : devOnlyPlugins),
    ],
    optimizeDeps: {
      exclude: ["@roxi/routify", "fsevents"],
    },
    resolve: {
      dedupe: ["@roxi/routify"],
      alias: {
        "@budibase/types": path.resolve(__dirname, "../types/src"),
        "@budibase/shared-core": path.resolve(__dirname, "../shared-core/src"),
        "@budibase/bbui": path.resolve(__dirname, "../bbui/src"),
        "@": path.resolve(__dirname, "src"),
        assets: path.resolve(__dirname, "assets"),
      },
    },
  }
})
