#!/usr/bin/node

const start = Date.now()

const glob = require("glob")
const fs = require("fs")
const path = require("path")

const { build } = require("esbuild")

const { default: NodeResolve } = require("@esbuild-plugins/node-resolve")
const {
  default: TsconfigPathsPlugin,
} = require("@esbuild-plugins/tsconfig-paths")

var argv = require("minimist")(process.argv.slice(2))

function runBuild(entry, outfile) {
  const isDev = process.env.NODE_ENV !== "production"
  const tsconfig = argv["p"] || `tsconfig.build.json`

  const sharedConfig = {
    entryPoints: [entry],
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    tsconfig,
    plugins: [TsconfigPathsPlugin({ tsconfig })],
    target: "node14",
    preserveSymlinks: true,
    loader: {
      ".svelte": "copy",
    },
    external: [
      "deasync",
      "mock-aws-s3",
      "nock",
      "lerna",
      "dd-trace",
      "pg",
      "@bull-board/koa",
      "koa2-ratelimit",
      "fsevents",
      "knex",
    ],
  }

  build({
    ...sharedConfig,
    platform: "node",
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
  const outfile = `dist/${entry.split("/").pop().replace(".ts", ".js")}`
  runBuild(entry, outfile)
} else {
  module.exports = runBuild
}
