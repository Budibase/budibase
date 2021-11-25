const fs = require("fs")
const { join } = require("path")
const { createDoc } = require("apidoc")
const packageJson = require("../../package.json")
const open = require("open")

const config = {
  name: "Budibase API",
  version: packageJson.version,
  description: "Documenting the Budibase backend API",
  title: "Budibase app service API",
}

const shouldOpen = process.argv[2]
const disallowed = []

function filter(parsedRouteFiles) {
  const tagToSearch = "url"
  for (let routeFile of parsedRouteFiles) {
    for (let route of routeFile) {
      let routeInfo = route["local"]
      if (disallowed.includes(routeInfo[tagToSearch])) {
        const idx = routeFile.indexOf(route)
        routeFile.splice(idx, 1)
      }
    }
  }
}

async function generate() {
  // start by writing a config file
  const configPath = join(__dirname, "config.json")
  fs.writeFileSync(configPath, JSON.stringify(config))
  const mainPath = join(__dirname, "..", "..")
  const srcPath = join(mainPath, "src", "api", "routes")
  const assetsPath = join(mainPath, "builder", "assets", "docs")
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true })
  }
  const doc = createDoc({
    src: [srcPath],
    dest: assetsPath,
    filters: {
      main: {
        postFilter: filter,
      },
    },
    config: configPath,
  })
  if (typeof doc !== "boolean") {
    console.log("Docs generated successfully.")
  } else {
    console.error("Unable to generate docs.")
  }
  // delete the temporary config file
  fs.unlinkSync(configPath)
  if (shouldOpen === "open") {
    await open(join(assetsPath, "index.html"), { wait: false })
  }
}

generate()
