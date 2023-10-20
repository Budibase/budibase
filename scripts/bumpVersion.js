const fs = require("fs")
const semver = require("semver")

const filePath = "../lerna.json"
const versionBump = process.argv[2] || "patch"

// Read and parse lerna.json file
const fileData = fs.readFileSync(filePath)
const lernaData = JSON.parse(fileData)

const currentVersion = lernaData.version

const newVersion = semver.inc(currentVersion, versionBump, "alpha")

// Update lerna.json file with new version
lernaData.version = newVersion
const updatedData = JSON.stringify(lernaData, null, 2)
fs.writeFileSync(filePath, updatedData)

console.log(`Updated version from ${currentVersion} to ${newVersion}`)
