const fs = require("fs")
const path = require("path")

const MONOREPO_ROOT = "packages"

const packages = getPackages()

function getPackages() {
  if (fs.existsSync(MONOREPO_ROOT)) {
    return fs.readdirSync(MONOREPO_ROOT).map(pkg => path.join(MONOREPO_ROOT, pkg))
  } else {
    return ["./"]
  }
}

function pinDeps(dependencies) {
  for (let dependency in dependencies) {
    if (dependency.startsWith("@budibase")) {
      dependencies[dependency] = dependencies[dependency].replace("^", "")
    }
  }
  return dependencies
}

// iterate over the monorepo packages
for (let pkgPath of packages) {
  // only directories
  if (fs.statSync(pkgPath).isDirectory()) {
    // get the package JSON file
    const pkgJsonPath = path.join(pkgPath, "package.json")
    if (!fs.existsSync(pkgJsonPath)) {
      continue
    }
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath))
    

    // find any budibase dependencies, and pin them
    pkgJson.dependencies = pinDeps(pkgJson.dependencies)
    pkgJson.devDependencies = pinDeps(pkgJson.devDependencies)

    // update the package JSON files
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
  }
}

console.log("Pinned dev versions for budibase packages successfully.")
