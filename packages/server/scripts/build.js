#!/usr/bin/node
const { join } = require("path")
const fs = require("fs")
const coreBuild = require("../../../scripts/build")

const dir = join(__dirname, "..")
const entryPath = join(dir, "src")
const outfilePath = join(dir, "dist")

/**
 * The reasoning for this is that now our built version is simple
 * dist/index.js - any kind of threaded approach in Node.js requires
 * a runner file to work from - I played around with a lot of
 * different methods, but we really want to be able to use forks.
 *
 * Rather than trying to rewrite so that forks run the whole system,
 * I instead went down a path of building the individual threads so
 * that we have runner files for each of them e.g. dist/automations.js
 * and dist/query.js - these can be ran totally independently and then
 * the parent process can pass down data for processing to them.
 *
 * The ignoring is simply to remove the files which really don't need
 * to be built - they could be built and it wouldn't cause any issues,
 * but this just means if any further threads are added in future
 * they will naturally work (rather than including, which would mean
 * adjustments to the build files).
 */
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
