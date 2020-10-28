const { join } = require("path")
const { homedir } = require("os")

const initialiseBudibase = require("../src/utilities/initialiseBudibase")
const DIRECTORY = "~/.budibase"

function run() {
  let opts = {}
  let dir = DIRECTORY
  opts.quiet = true
  opts.dir = dir.startsWith("~") ? join(homedir(), dir.substring(1)) : dir
  return initialiseBudibase(opts)
}

run().then(() => {
  console.log("Init complete.")
})
