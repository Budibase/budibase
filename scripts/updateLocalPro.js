const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Get the version argument from the command line
let version = process.argv[2]
if (!version) {
  console.error("Usage: node updateLocalPro.js <develop|latest|local>")
  process.exit(1)
}

if (version === "local") {
  version = "0.0.1"
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
