import * as path from "path"
import svelte from "rollup-plugin-svelte-hot"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import copy from "rollup-plugin-copy"
import hmr from "rollup-plugin-hot"
import del from "rollup-plugin-delete"
import postcss from "rollup-plugin-postcss-hot"
import { plugin as Svench } from "svench/rollup"
import builtins from "rollup-plugin-node-builtins"

import pkg from "./package.json"

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, m => m.toUpperCase())
  .replace(/-\w/g, m => m[1].toUpperCase())

const WATCH = !!process.env.ROLLUP_WATCH
const SVENCH = !!process.env.SVENCH
const HOT = WATCH
const PRODUCTION = !WATCH

const svench = Svench({
  // The root dir that Svench will parse and watch.
  //
  // NOTE Watching the root of the project, to let Svench render *.md for us.
  //
  // NOTE By default, `node_modules` and `.git` dirs are ignored. This can be
  // customized by passing a function to `ignore` option. Default ignore is:
  //
  //     ignore: path => /(?:^|\/)(?:node_modules|\.git)\//.test(path),
  //
  dir: ".",

  // Make `src` dir a section (that is, it will always be "expanded" in the
  // menu).
  autoSections: ["src"],

  // Use custom index.html
  index: {
    source: "public/index.html",
  },

  extensions: [".svench", ".svench.svelte", ".svench.svx", ".md"],

  serve: WATCH && {
    host: "0.0.0.0",
    port: 4242,
    public: "public",
    nollup: "0.0.0.0:42421",
  },
})

// NOTE configs are in function form to avoid instantiating plugins of the
// config that is not used for nothing (in particular, the HMR plugin launches
// a dev server on startup, this is not desired when just building for prod)
const configs = {
  svench: () => ({
    input: ".svench/svench.js",
    output: {
      format: "es",
      dir: "public/svench",
    },
    plugins: [
      builtins(),

      // NOTE cleaning old builds is required to avoid serving stale static
      // files from a previous build instead of in-memory files from the dev/hmr
      // server
      del({
        targets: "public/svench/*",
        runOnce: true,
      }),

      postcss({
        hot: HOT,
        extract: path.resolve("public/svench/theme.css"),
        sourceMap: true,
      }),

      svench,

      svelte({
        dev: !PRODUCTION,
        extensions: [".svelte", ".svench", ".svx", ".md"],
        // Svench's "combined" preprocessor wraps both Mdsvex preprocessors
        // (configured for Svench), and its own preprocessor (for static
        // analysis -- eg extract source from views)
        preprocess: svench.$.preprocess,
        hot: HOT && {
          optimistic: true,
          noPreserveState: false,
        },
      }),

      resolve({ browser: true }),

      commonjs(),
      json(),

      HOT &&
        hmr({
          host: "0.0.0.0",
          public: "public",
          inMemory: true,
          compatModuleHot: !HOT, // for terser
        }),
    ],

    watch: {
      clearScreen: false,
      // buildDelay is needed to ensure Svench's code (routes) generator will
      // pick file changes before Rollup and prevent a double build (if Rollup
      // first sees a change to src/Foo.svench, then to Svench's routes.js)
      buildDelay: 100,
    },
  }),

  lib: () => ({
    input: "src/index.js",
    output: [
      { file: pkg.module, format: "es" },
      { file: pkg.main, format: "umd", name },
    ],
    plugins: [
      postcss(),

      svelte({
        dev: !PRODUCTION,
        css: css => {
          css.write("dist/bundle.css")
        },
        extensions: [".svelte"],
      }),
      copy({
        targets: [
          {
            src: ".svench/svench.css",
            dest: "dist",
            rename: "bbui.css",
          },
        ],
      }),
      copy({
        targets: [
          {
            src: ".svench/svench.css",
            dest: "public",
            rename: "global.css",
          },
        ],
      }),

      resolve(),

      commonjs(),
      json(),
    ],
  }),
}

export default configs[SVENCH ? "svench" : "lib"]()
