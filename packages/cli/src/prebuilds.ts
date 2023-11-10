import os from "os"
import { join } from "path"
import fs from "fs"
import { error } from "./utils"

const PREBUILDS = "prebuilds"
const ARCH = `${os.platform()}-${os.arch()}`
const PREBUILD_DIR = join(process.execPath, "..", "cli", PREBUILDS, ARCH)

// running as built CLI pkg bundle
if (!process.argv[0].includes("node")) {
  checkForBinaries()
}

function localPrebuildPath() {
  return join(process.execPath, "..", PREBUILDS)
}

function checkForBinaries() {
  const readDir = join(__filename, "..", "..", "..", "cli", PREBUILDS, ARCH)
  if (fs.existsSync(PREBUILD_DIR) || !fs.existsSync(readDir)) {
    return
  }
  const natives = fs.readdirSync(readDir)
  if (fs.existsSync(readDir)) {
    const writePath = join(localPrebuildPath(), ARCH)
    fs.mkdirSync(writePath, { recursive: true })
    for (let native of natives) {
      const filename = `${native.split(".fake")[0]}.node`
      fs.cpSync(join(readDir, native), join(writePath, filename))
    }
  }
}

function cleanup(evt?: number) {
  // cleanup prebuilds first
  const path = localPrebuildPath()
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true })
  }
  if (evt && !isNaN(evt)) {
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
}

const events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"]
events.forEach(event => {
  process.on(event, cleanup)
})
