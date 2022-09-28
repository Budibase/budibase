const os = require("os")
const { join } = require("path")
const fs = require("fs")
const { error } = require("./utils")
const PREBUILDS = "prebuilds"
const ARCH = `${os.platform()}-${os.arch()}`
const PREBUILD_DIR = join(process.execPath, "..", PREBUILDS, ARCH)

// running as built CLI pkg bundle
if (!process.argv[0].includes("node")) {
  checkForBinaries()
}

function checkForBinaries() {
  const readDir = join(__filename, "..", "..", PREBUILDS, ARCH)
  if (fs.existsSync(PREBUILD_DIR) || !fs.existsSync(readDir)) {
    return
  }
  const natives = fs.readdirSync(readDir)
  if (fs.existsSync(readDir)) {
    fs.mkdirSync(PREBUILD_DIR, { recursive: true })
    for (let native of natives) {
      const filename = `${native.split(".fake")[0]}.node`
      fs.cpSync(join(readDir, native), join(PREBUILD_DIR, filename))
    }
  }
}

function cleanup(evt) {
  if (!isNaN(evt)) {
    return
  }
  if (evt) {
    console.error(
      error(
        "Failed to run CLI command - please report with the following message:"
      )
    )
    console.error(error(evt))
  }
  if (fs.existsSync(PREBUILD_DIR)) {
    fs.rmSync(PREBUILD_DIR, { recursive: true })
  }
}

const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"]
events.forEach(event => {
  process.on(event, cleanup)
})
