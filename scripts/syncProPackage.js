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
const output = execSync("yarn --silent workspaces info --json", {
  encoding: "utf-8",
})
const data = JSON.parse(output)

// Loop through each workspace and update the dependencies
Object.keys(data).forEach(workspace => {
  // Loop through each dependency and update its version in package.json
  const packageJsonPath = path.join(data[workspace].location, "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
  if (packageJson.version !== "0.0.0") {
    // Don't change if we are not using local versions
    return
  }

  let hasChanges = false

  if (packageJson.dependencies && packageJson.dependencies["@budibase/pro"]) {
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
