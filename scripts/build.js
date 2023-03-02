const start = Date.now()

const glob = require("glob")
const fs = require("fs")
var path = require("path")

const { build } = require("esbuild")
const sveltePlugin = require("esbuild-svelte")

const { default: NodeResolve } = require("@esbuild-plugins/node-resolve")

const sharedConfig = {
  entryPoints: [`./src/index.ts`],
  bundle: true,
  minify: true,
  tsconfig: `tsconfig.build.json`,
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
}

build({
  ...sharedConfig,
  platform: "node",
  outfile: "dist/index.js",
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
