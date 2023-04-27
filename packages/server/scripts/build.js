#!/usr/bin/node
const { join } = require("path")
const fs = require("fs")
const coreBuild = require("../../../scripts/build")

const dir = join(__dirname, "..")
const entryPath = join(dir, "src")
const outfilePath = join(dir, "dist")

const ignoredFiles = ["definitions", "index", "utils"]
const threadNames = fs
  .readdirSync(join(dir, "src", "threads"))
  .filter(path => !ignoredFiles.find(file => path.includes(file)))
  .map(path => path.replace(".ts", ""))
const files = [
  {
    entry: join(entryPath, "index.ts"),
    out: join(outfilePath, "index.js"),
  },
]
for (let name of threadNames) {
  files.push({
    entry: join(entryPath, "threads", `${name}.ts`),
    out: join(outfilePath, `${name}.js`),
  })
}

for (let file of files) {
  coreBuild(file.entry, file.out)
}
