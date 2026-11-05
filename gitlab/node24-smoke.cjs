const assert = require("node:assert/strict")
const vm = require("isolated-vm")
const bcrypt = require("bcrypt")

const isolate = new vm.Isolate({ memoryLimit: 32 })
try {
  assert.equal(isolate.createContextSync().evalSync("21 * 2"), 42)
} finally {
  isolate.dispose()
}

const hash = bcrypt.hashSync("gravity-node24-smoke", 4)
assert.equal(bcrypt.compareSync("gravity-node24-smoke", hash), true)
console.log(`Native module smoke checks passed on ${process.version}/${process.arch}`)
