const fs = require("node:fs")
const assert = require("node:assert/strict")

assert.equal(process.versions.node.split(".")[0], "24")

const manifest = JSON.parse(fs.readFileSync("package.json", "utf8"))
const previous = manifest.engines.node
manifest.engines.node = ">=24.0.0 <25.0.0"
fs.writeFileSync("package.json", `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Gravity build override: engines.node ${previous} -> ${manifest.engines.node}`)
