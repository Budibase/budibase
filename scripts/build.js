#!/usr/bin/node

const start = Date.now()

const fs = require("fs")
const { cp, readdir, copyFile, mkdir } = require("node:fs/promises")
const path = require("path")

const { build } = require("esbuild")
const { compile } = require("svelte/compiler")

const {
  default: TsconfigPathsPlugin,
} = require("@esbuild-plugins/tsconfig-paths")
const { nodeExternalsPlugin } = require("esbuild-node-externals")

const svelteCompilePlugin = {
  name: "svelteCompile",
  setup(build) {
    // Compiles `.svelte` files into JS classes so that they can be directly imported into our
    // Typescript packages
    build.onLoad({ filter: /\.svelte$/ }, async args => {
      const source = await fs.promises.readFile(args.path, "utf8")
      const dir = path.dirname(args.path)

      try {
        const { js } = compile(source, { css: "injected", generate: "ssr" })

        return {
          // The code placed in the generated file
          contents: js.code,
          // The loader this is passed to, basically how the above provided content is "treated",
          // the contents provided above will be transpiled and bundled like any other JS file.
          loader: "js",
          // Where to resolve any imports present in the loaded file
          resolveDir: dir,
        }
      } catch (e) {
        return { errors: [JSON.stringify(e)] }
      }
    })
  },
}

var { argv } = require("yargs")

async function runBuild(entry, outfile) {
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
    tsconfig,
    plugins: [
      svelteCompilePlugin,
      TsconfigPathsPlugin({ tsconfig: tsconfigPathPluginContent }),
      nodeExternalsPlugin({
        allowList: ["@budibase/frontend-core", "svelte"],
      }),
    ],
    preserveSymlinks: true,
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
      "better-sqlite3",
      "sqlite3",
      "mysql",
      "mysql2",
      "oracle",
      "oracledb",
      "pg",
      "pg-query-stream",
      "pg-native",
    ],
  }

  await mkdir("dist", { recursive: true })

  const hbsFiles = (async () => {
    const dir = await readdir("./", { recursive: true })
    const files = dir.filter(
      entry => entry.endsWith(".hbs") || entry.endsWith("ivm.bundle.js")
    )
    const fileCopyPromises = files.map(file =>
      copyFile(file, `dist/${path.basename(file)}`)
    )

    await Promise.all(fileCopyPromises)
  })()

  const oldClientVersions = (async () => {
    try {
      await cp("./build/oldClientVersions", "./dist/oldClientVersions", {
        recursive: true,
      })
    } catch (e) {
      if (e.code !== "EEXIST" && e.code !== "ENOENT") {
        throw e
      }
    }
  })()

  const mainBuild = build({
    ...sharedConfig,
    platform: "node",
    outfile,
  })

  await Promise.all([hbsFiles, mainBuild, oldClientVersions])

  fs.writeFileSync(
    `dist/${path.basename(outfile)}.meta.json`,
    JSON.stringify((await mainBuild).metafile)
  )

  console.log(
    "\x1b[32m%s\x1b[0m",
    `Build successfully in ${(Date.now() - start) / 1000} seconds`
  )
}

if (require.main === module) {
  const entry = argv["e"] || "./src/index.ts"
  const outfile = `dist/${entry.split("/").pop().replace(".ts", ".js")}`
  runBuild(entry, outfile)
} else {
  module.exports = runBuild
}
