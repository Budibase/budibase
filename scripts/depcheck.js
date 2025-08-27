#!/usr/bin/node

const depcheck = require("depcheck")
const fs = require("fs")
const path = require("path")

function filterResults(missing) {
  if (missing.src) {
    delete missing.src
  }
  return missing
}

function printMissing(missing) {
  for (let [key, value] of Object.entries(filterResults(missing))) {
    console.log(`Package ${key} missing in: ${value.join(", ")}`)
  }
}

function mergePackageJson(rootPath, packagePath) {
  const rootPkgPath = path.join(rootPath, "package.json")
  const pkgPath = path.join(packagePath, "package.json")

  let rootPkg = {}
  let pkg = {}

  if (fs.existsSync(rootPkgPath)) {
    rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"))
  }

  if (fs.existsSync(pkgPath) && rootPkgPath !== pkgPath) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
  }

  return {
    dependencies: { ...rootPkg.dependencies, ...pkg.dependencies },
    devDependencies: { ...rootPkg.devDependencies, ...pkg.devDependencies },
    peerDependencies: { ...rootPkg.peerDependencies, ...pkg.peerDependencies },
    optionalDependencies: {
      ...rootPkg.optionalDependencies,
      ...pkg.optionalDependencies,
    },
  }
}

const rootPath = path.resolve(__dirname, "..")
const mergedPackage = mergePackageJson(rootPath, process.cwd())

depcheck(process.cwd(), {
  ignorePatterns: ["dist"],
  skipMissing: false,
  package: mergedPackage,
}).then(results => {
  if (Object.values(filterResults(results.missing)).length > 0) {
    printMissing(results.missing)
    console.error("Missing packages found - stopping.")
    process.exit(-1)
  } else {
    console.log("No missing dependencies.")
  }
})
