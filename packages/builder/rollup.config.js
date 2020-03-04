import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import url from "rollup-plugin-url"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import builtins from "rollup-plugin-node-builtins"
import nodeglobals from "rollup-plugin-node-globals"
import copy from "rollup-plugin-copy"
import browsersync from "rollup-plugin-browsersync"
import proxy from "http-proxy-middleware"
import replace from "rollup-plugin-replace"

const target = "http://localhost:4001"
const _builderProxy = proxy("/_builder", {
  target: "http://localhost:3000",
  pathRewrite: { "^/_builder": "" },
})

const apiProxy = proxy(
  ["/_builder/assets/**", "/_builder/api/**", "/_builder/**/componentlibrary"],
  {
    target,
    logLevel: "debug",
    changeOrigin: true,
    cookieDomainRewrite: true,
    onProxyReq(proxyReq) {
      if (proxyReq.getHeader("origin")) {
        proxyReq.setHeader("origin", target)
      }
    },
  }
)

const production = !process.env.ROLLUP_WATCH

const lodash_fp_exports = [
  "union",
  "reduce",
  "isUndefined",
  "cloneDeep",
  "split",
  "some",
  "map",
  "filter",
  "isEmpty",
  "countBy",
  "includes",
  "last",
  "find",
  "constant",
  "take",
  "first",
  "intersection",
  "mapValues",
  "isNull",
  "has",
  "isInteger",
  "isNumber",
  "isString",
  "isBoolean",
  "isDate",
  "isArray",
  "isObject",
  "clone",
  "values",
  "keyBy",
  "isNaN",
  "keys",
  "orderBy",
  "concat",
  "reverse",
  "difference",
  "merge",
  "flatten",
  "each",
  "pull",
  "join",
  "defaultCase",
  "uniqBy",
  "every",
  "uniqWith",
  "isFunction",
  "groupBy",
  "differenceBy",
  "intersectionBy",
  "isEqual",
  "max",
  "sortBy",
  "assign",
  "uniq",
  "trimChars",
  "trimCharsStart",
  "isObjectLike",
  "flattenDeep",
  "indexOf",
  "isPlainObject",
  "toNumber",
  "takeRight",
  "toPairs",
]

const lodash_exports = [
  "flow",
  "join",
  "replace",
  "trim",
  "dropRight",
  "takeRight",
  "head",
  "reduce",
  "tail",
  "startsWith",
  "findIndex",
  "merge",
  "assign",
  "each",
  "find",
  "orderBy",
  "union",
]

const outputpath = "../server/builder"

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
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `${outputpath}/bundle.js`,
  },
  plugins: [
    copy({
      targets: [
        { src: "src/index.html", dest: outputpath },
        { src: "src/favicon.png", dest: outputpath },
        { src: "src/assets", dest: outputpath },
        {
          src: "node_modules/@budibase/client/dist/budibase-client.esm.mjs",
          dest: outputpath,
        },
      ],
    }),

    replace({
      "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development")
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      include: "src/**/*.svelte",
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(`${outputpath}/bundle.css`)
      },
    }),

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
    url({
      limit: 0,
      include: ["**/*.woff2", "**/*.png"],
      fileName: "[dirname][name][extname]",
      emitFiles: true,
    }),
    url({
      limit: 0,
      include: ["**/*.css"],
      fileName: "[name][extname]",
      emitFiles: true,
    }),
    builtins(),
    nodeglobals(),

    // Watch the `dist` directory and refresh the
    // browser on changes when not in production
    !production && livereload(outputpath),
    !production &&
      browsersync({
        server: outputpath,
        middleware: [apiProxy, _builderProxy],
      }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
