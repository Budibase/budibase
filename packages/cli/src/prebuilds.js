const os = require("os")
const { join } = require("path")
const fs = require("fs")
const PREBUILDS = "prebuilds"
const ARCH = `${os.platform()}-${os.arch()}`
const PREBUILD_DIR = join(process.execPath, "..", PREBUILDS, ARCH)

checkForBinaries()

function checkForBinaries() {
  if (fs.existsSync(PREBUILD_DIR)) {
    return
  }
  const readDir = join(__filename, "..", "..", PREBUILDS, ARCH)
  const natives = fs.readdirSync(readDir)
  if (fs.existsSync(readDir)) {
    fs.mkdirSync(PREBUILD_DIR, { recursive: true })
    for (let native of natives) {
      const filename = `${native.split(".fake")[0]}.node`
      fs.cpSync(join(readDir, native), join(PREBUILD_DIR, filename))
    }
  }
}

process.on("exit", () => {
  if (fs.existsSync(PREBUILD_DIR)) {
    fs.rmSync(PREBUILD_DIR, { recursive: true })
  }
})
