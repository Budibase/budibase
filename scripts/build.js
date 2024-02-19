#!/usr/bin/node

const start = Date.now()

const glob = require("glob")
const fs = require("fs")
const path = require("path")

const { build, context } = require("esbuild")

const {
  default: TsconfigPathsPlugin,
} = require("@esbuild-plugins/tsconfig-paths")
const { nodeExternalsPlugin } = require("esbuild-node-externals")

var { argv } = require("yargs")

function runBuild(entry, outfile) {
  const isDev = process.env.NODE_ENV !== "production"
  const tsconfig = argv["p"] || `tsconfig.build.json`
  const tsconfigPathPluginContent = JSON.parse(
    fs.readFileSync(tsconfig, "utf-8")
  )

  if (
    !fs.existsSync(path.join(__dirname, "../packages/pro/src")) &&
    tsconfigPathPluginContent.compilerOptions?.paths
  ) {
    // If we don't have pro, we cannot bundle backend-core.
    // Otherwise, the main context will not be shared between libraries
    delete tsconfigPathPluginContent?.compilerOptions?.paths?.[
      "@budibase/backend-core"
    ]
    delete tsconfigPathPluginContent?.compilerOptions?.paths?.[
      "@budibase/backend-core/*"
    ]
  }

  const sharedConfig = {
    entryPoints: [entry],
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    format: argv["format"],
    tsconfig,
    plugins: [
      TsconfigPathsPlugin({ tsconfig: tsconfigPathPluginContent }),
      nodeExternalsPlugin(),
    ],
    preserveSymlinks: true,
    loader: {
      ".svelte": "copy",
      ".ivm.bundle.js": "text",
    },
    metafile: true,
    external: [
      "deasync",
      "mock-aws-s3",
      "nock",
      "bull",
      "pouchdb",
      "bcrypt",
      "bcryptjs",
      "graphql/*",
      "bson",
    ],
  }

  const watch = argv["watch"]
  const platform = argv["platform"] || "node"

  const func = watch ? context : build
  func({
    ...sharedConfig,
    platform,
    outfile,
  }).then(result => {
    glob(`${process.cwd()}/src/**/*.hbs`, {}, (err, files) => {
      for (const file of files) {
        fs.copyFileSync(file, `${process.cwd()}/dist/${path.basename(file)}`)
      }

      console.log(
        "\x1b[32m%s\x1b[0m",
        `Build successfully in ${(Date.now() - start) / 1000} seconds`
      )
    })

    if (watch) {
      result.watch().then(() => {
        console.log("Watching...")
      })
    } else {
      fs.writeFileSync(
        `dist/${path.basename(outfile)}.meta.json`,
        JSON.stringify(result.metafile)
      )
    }
  })
}

if (require.main === module) {
  const entry = argv["e"] || "./src/index.ts"
  const outfile =
    argv["o"] || `dist/${entry.split("/").pop().replace(".ts", ".js")}`
  runBuild(entry, outfile)
} else {
  module.exports = runBuild
}
