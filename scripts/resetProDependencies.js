const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Get the list of workspaces with mismatched dependencies
const output = execSync("yarn --silent workspaces info --json", {
  encoding: "utf-8",
})
const data = JSON.parse(output)

const packageJsonPath = path.join(
  data["@budibase/pro"].location,
  "package.json"
)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

let hasChanges = false

const dependencies = data["@budibase/pro"].workspaceDependencies
dependencies.forEach(dependency => {
  if (packageJson.dependencies?.[dependency]) {
    packageJson.dependencies[dependency] = "0.0.1"
    hasChanges = true
  }
  if (packageJson.devDependencies?.[dependency]) {
    packageJson.devDependencies[dependency] = "0.0.1"
    hasChanges = true
  }
  if (packageJson.peerDependencies?.[dependency]) {
    packageJson.peerDependencies[dependency] = "0.0.1"
    hasChanges = true
  }
})

// Write changes to package.json if there are any
if (hasChanges) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
}
