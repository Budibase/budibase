#!/usr/bin/node

const start = Date.now()

const glob = require("glob")
const fs = require("fs")
const path = require("path")

const { build } = require("esbuild")
const sveltePlugin = require("esbuild-svelte")

const { default: NodeResolve } = require("@esbuild-plugins/node-resolve")

var argv = require("minimist")(process.argv.slice(2))

function runBuild(entry, outfile) {
  const isDev = process.env.NODE_ENV !== "production"
  const tsconfig = argv["p"] || `tsconfig.build.json`

  const tsconfigContent = require(`${process.cwd()}/${tsconfig}`)

  const sharedConfig = {
    entryPoints: [entry],
    bundle: true,
    minify: !isDev,
    tsconfig,
    plugins: [
      sveltePlugin(),
      NodeResolve({
        extensions: [".ts", ".js"],
        onResolved: resolved => {
          if (resolved.includes("node_modules")) {
            return {
              external: true,
            }
          }
          return resolved
        },
      }),
    ],
    target: "node14",
    preserveSymlinks: true,
    external: isDev ? ["@budibase/client"] : [],
  }

  const outdir = tsconfigContent.compilerOptions?.outDir
  build({
    ...sharedConfig,
    platform: "node",
    outdir,
    outfile,
  }).then(() => {
    glob(`${process.cwd()}/src/**/*.hbs`, {}, (err, files) => {
      for (const file of files) {
        fs.copyFileSync(file, `${process.cwd()}/dist/${path.basename(file)}`)
      }

      console.log(
        "\x1b[32m%s\x1b[0m",
        `Build successfully in ${(Date.now() - start) / 1000} seconds`
      )
    })
  })
}

if (require.main === module) {
  const entry = argv["e"] || "./src/index.ts"
  runBuild(entry)
} else {
  module.exports = runBuild
}
