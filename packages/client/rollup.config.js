import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import svelte from "rollup-plugin-svelte"
import { terser } from "rollup-plugin-terser"
import postcss from "rollup-plugin-postcss"
import svg from "rollup-plugin-svg"
import json from "rollup-plugin-json"
import builtins from "rollup-plugin-node-builtins"
import globals from "rollup-plugin-node-globals"

const production = !process.env.ROLLUP_WATCH
const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
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
  plugins: [
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
    globals(),
    builtins(),
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    svg(),
    json(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
