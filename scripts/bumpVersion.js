const fs = require("fs")

const filePath = "lerna.json"
const versionBump = process.argv[2] || "patch"

// Read and parse lerna.json file
const fileData = fs.readFileSync(filePath)
const lernaData = JSON.parse(fileData)

// Get current version and split into major, minor, patch, and alpha components
const currentVersion = lernaData.version
const [versionWithoutPrerelease, prerelease] = currentVersion.split("-")
const [major, minor, patch] = versionWithoutPrerelease.split(".").map(Number)

// Calculate new version based on specified version bump
let newVersion = currentVersion
switch (versionBump) {
  case "major":
    newVersion = `${major + 1}.0.0`
    break
  case "minor":
    newVersion = `${major}.${minor + 1}.0`
    break
  case "patch":
    newVersion = `${major}.${minor}.${patch + 1}`
    break
  case "alpha":
    const newPrerelease = (prerelease || -1) + 1
    newVersion = prerelease
      ? `${versionWithoutPrerelease}-alpha.${newPrerelease}`
      : `${major}.${minor}.${patch}-alpha.${newPrerelease}`
    break
  default:
    console.error(`Invalid version bump '${versionBump}' specified.`)
    process.exit(1)
}

// Update lerna.json file with new version
lernaData.version = newVersion
const updatedData = JSON.stringify(lernaData, null, 2)
fs.writeFileSync(filePath, updatedData)

console.log(`Updated version from ${currentVersion} to ${newVersion}`)
