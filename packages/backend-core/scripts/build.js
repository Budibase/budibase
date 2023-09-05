#!/usr/bin/node
const coreBuild = require("../../../scripts/build")
const { exec } = require("child_process")

coreBuild("./src/plugin/index.ts", "./dist/plugins.js")
coreBuild("./src/index.ts", "./dist/index.js")

const child = exec(
  `esbuild ./tests/*.[tj]s ./tests/**/*.[tj]s --outdir=./dist/tests`
)
child.stdout.on("data", data => {
  console.log(`stdout: ${data}`)
})
child.stderr.on("data", data => {
  console.error(`stderr: ${data}`)
})
child.on("close", code => {
  console.log(`esbuild process exited with code ${code}`)
})
