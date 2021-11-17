const fs = require("fs")
const { join } = require("path")
const { spawnSync } =require("child_process")

const DONT_RUN_PKG = ["bbui"]
const PACKAGES_PATH = join(__dirname, "..", "packages")

function getPackages() {
  return fs.readdirSync(PACKAGES_PATH)
}

function deleteFile(path) {
  try {
    fs.unlinkSync(path)
  } catch (err) {
    // don't error, it just doesn't exist
  }
}

function removeModules(path) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true })
  }
}

function executeInPackage(packageName) {
  if (DONT_RUN_PKG.includes(packageName)) {
    return
  }
  const dir = join(PACKAGES_PATH, packageName)
  if (!fs.existsSync(join(dir, "package.json"))) {
    console.error(`SKIPPING ${packageName} directory, no package.json`)
    return
  }
  const packageLockLoc = join(dir, "package-lock.json")
  const modulesLoc = join(dir, "node_modules")
  deleteFile(join(dir, "yarn.lock"))
  deleteFile(packageLockLoc)
  removeModules(modulesLoc)
  const opts = { cwd: dir, stdio: "inherit", shell: true }
  spawnSync("npm", ["i", "--package-lock-only"], opts)
  spawnSync("npm", ["audit", "fix"], opts)
  spawnSync("yarn", ["import"], opts)
  deleteFile(packageLockLoc)
  removeModules(modulesLoc)
}

const packages = getPackages()
for (let pkg of packages) {
  executeInPackage(pkg)
}

spawnSync("yarn", ["bootstrap"], { cwd: join(__dirname, ".."), stdio: "inherit", shell: true })

