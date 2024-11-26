#!/usr/bin/node

const depcheck = require("depcheck")

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

depcheck(process.cwd(), {
  ignorePatterns: ["dist"],
  skipMissing: false,
}).then(results => {
  if (Object.values(filterResults(results.missing)).length > 0) {
    printMissing(results.missing)
    console.error("Missing packages found - stopping.")
    process.exit(-1)
  } else {
    console.log("No missing dependencies.")
  }
})
