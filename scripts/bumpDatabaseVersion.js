const fs = require("fs")
const semver = require("semver")

const filePath = "../hosting/couchdb/VERSION"
const versionBump = process.argv[2] || "minor"

if (!["minor", "major"].includes(versionBump)) {
  console.error("Usage: node bumpDatabaseVersion.js [minor|major]")
  process.exit(1)
}

const currentVersion = fs.readFileSync(filePath, "utf8").trim()
const newVersion = semver.inc(currentVersion, versionBump)

fs.writeFileSync(filePath, newVersion + "\n")

console.log(`Updated database version from ${currentVersion} to ${newVersion}`)
