import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import alias from "@rollup/plugin-alias"
import svelte from "rollup-plugin-svelte"
import { terser } from "rollup-plugin-terser"
import postcss from "rollup-plugin-postcss"
import svg from "rollup-plugin-svg"
import image from "@rollup/plugin-image"
import json from "rollup-plugin-json"
import nodePolyfills from "rollup-plugin-polyfill-node"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"

const production = !process.env.ROLLUP_WATCH
const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
]

const devPaths = production
  ? []
  : [
      {
        find: "@budibase/shared-core",
        replacement: path.resolve("../shared-core/dist/index"),
      },
      {
        find: "@budibase/types",
        replacement: path.resolve("../types/dist/index"),
      },
    ]

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: false,
      format: "iife",
      file: `./dist/budibase-client.js`,
    },
  ],
  onwarn(warning, warn) {
    if (
      warning.code === "THIS_IS_UNDEFINED" ||
      warning.code === "CIRCULAR_DEPENDENCY"
    ) {
      return
    }
    warn(warning)
  },
  plugins: [
    alias({
      entries: [
        {
          find: "manifest.json",
          replacement: path.resolve("./manifest.json"),
        },
        {
          find: "api",
          replacement: path.resolve("./src/api"),
        },
        {
          find: "components",
          replacement: path.resolve("./src/components"),
        },
        {
          find: "stores",
          replacement: path.resolve("./src/stores"),
        },
        {
          find: "utils",
          replacement: path.resolve("./src/utils"),
        },
        {
          find: "constants",
          replacement: path.resolve("./src/constants"),
        },
        {
          find: "sdk",
          replacement: path.resolve("./src/sdk"),
        },
        ...devPaths,
      ],
    }),
    svelte({
      emitCss: true,
      onwarn: (warning, handler) => {
        // Ignore some warnings
        if (!ignoredWarnings.includes(warning.code)) {
          handler(warning)
        }
      },
    }),
    postcss(),
    commonjs(),
    nodePolyfills(),
    resolve({
      preferBuiltins: true,
      browser: true,
      dedupe: ["svelte", "svelte/internal"],
    }),
    svg(),
    image({
      exclude: "**/*.svg",
    }),
    json(),
    production && terser(),
    !production && visualizer(),
  ],
  watch: {
    clearScreen: false,
  },
}
