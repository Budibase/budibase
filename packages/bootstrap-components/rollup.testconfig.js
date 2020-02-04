import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import json from "rollup-plugin-json"

const production = !process.env.ROLLUP_WATCH

const lodash_fp_exports = [
  "find",
  "isUndefined",
  "split",
  "last",
  "union",
  "reduce",
  "isObject",
  "cloneDeep",
  "some",
  "isArray",
  "map",
  "filter",
  "keys",
  "isFunction",
  "isEmpty",
  "countBy",
  "join",
  "includes",
  "flatten",
  "constant",
  "first",
  "intersection",
  "take",
  "has",
  "mapValues",
  "isString",
  "isBoolean",
  "isNull",
  "isNumber",
  "isObjectLike",
  "isDate",
  "clone",
  "values",
  "keyBy",
  "isNaN",
  "isInteger",
  "toNumber",
]

const lodash_exports = [
  "flow",
  "head",
  "tail",
  "findIndex",
  "startsWith",
  "dropRight",
  "takeRight",
  "trim",
  "split",
  "replace",
  "merge",
  "assign",
]

const coreExternal = [
  "lodash",
  "lodash/fp",
  "date-fns",
  "lunr",
  "safe-buffer",
  "shortid",
  "@nx-js/compiler-util",
]

export default {
  input: "src/Test/testMain.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js",
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write("public/bundle.css")
      },

      hydratable: true,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee => {
        return (
          importee === "svelte" ||
          importee.startsWith("svelte/") ||
          coreExternal.includes(importee)
        )
      },
    }),
    commonjs({
      namedExports: {
        "lodash/fp": lodash_fp_exports,
        lodash: lodash_exports,
        shortid: ["generate"],
      },
    }),
    json(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
