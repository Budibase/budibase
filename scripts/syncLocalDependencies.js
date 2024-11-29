const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Get the version argument from the command line
const version = process.argv[2]
if (!version) {
  console.error("Usage: node update-workspace-dependencies.js <version>")
  process.exit(1)
}

// Get the list of workspaces with mismatched dependencies
const output = execSync("yarn --silent workspaces info --json", {
  encoding: "utf-8",
})
const data = JSON.parse(output)

const workspaces = Object.keys(data).filter(key => {
  return data[key].mismatchedWorkspaceDependencies?.length
})

// Loop through each workspace and update the dependencies
workspaces.forEach(workspace => {
  const dependencies = data[workspace].mismatchedWorkspaceDependencies

  // Loop through each dependency and update its version in package.json
  const packageJsonPath = path.join(data[workspace].location, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
  let hasChanges = false

  dependencies.forEach(dependency => {
    if (packageJson.dependencies?.[dependency]) {
      packageJson.dependencies[dependency] = version
      hasChanges = true
    }
    if (packageJson.devDependencies?.[dependency]) {
      packageJson.devDependencies[dependency] = version
      hasChanges = true
    }
    if (packageJson.peerDependencies?.[dependency]) {
      packageJson.peerDependencies[dependency] = version
      hasChanges = true
    }
  })

  // Write changes to package.json if there are any
  if (hasChanges) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    )
  }
})

const rootPackageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"))
delete rootPackageJson["resolutions"]
fs.writeFileSync(
  "package.json",
  JSON.stringify(rootPackageJson, null, 2) + "\n"
)
