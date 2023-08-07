const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

let version = "0.0.0"
const localPro = fs.existsSync("packages/pro/src")
if (!localPro) {
  const branchName = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim()
  if (branchName === "master") {
    version = "latest"
  } else {
    version = "develop"
  }
}

// Get the list of workspaces with mismatched dependencies
const output = execSync("yarn workspaces list --verbose --json", {
  encoding: "utf-8",
})

const workspaces = output
  .split("\n")
  .filter(x => !!x)
  .map(l => JSON.parse(l))

// Loop through each workspace and update the dependencies
workspaces.forEach(workspace => {
  // Loop through each dependency and update its version in package.json
  const packageJsonPath = path.join(workspace.location, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
  if (packageJson.version !== "0.0.0") {
    // Don't change if we are not using local versions
    return
  }

  let hasChanges = false

  if (packageJson.dependencies["@budibase/pro"]) {
    packageJson.dependencies["@budibase/pro"] = version
    hasChanges = true
  }

  // Write changes to package.json if there are any
  if (hasChanges) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    )
  }
})
