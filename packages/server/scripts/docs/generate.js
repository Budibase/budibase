const fs = require("fs")
const { join } = require("path")
const { createDoc } = require("apidoc")
const packageJson = require("../../package.json")
const toSwagger = require("./toSwagger")
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
  const options = {
    src: [srcPath],
    dest: assetsPath,
    filters: {
      main: {
        postFilter: filter,
      },
    },
    config: configPath,
  }
  const doc = createDoc(options)
  if (typeof doc !== "boolean") {
    const swagger = toSwagger(JSON.parse(doc.data), JSON.parse(doc.project))
    fs.writeFileSync(join(assetsPath, "swagger.json"), JSON.stringify(swagger))
    fs.writeFileSync(join(assetsPath, "apidoc.json"), doc.data)
    fs.writeFileSync(join(assetsPath, "project.json"), doc.project)
    console.log(
      `Docs generated successfully, find in ${assetsPath}, swagger.json, apidoc.json and project.json`
    )
  } else {
    throw "Unable to generate docs."
  }
  // delete the temporary config file
  fs.unlinkSync(configPath)
  setTimeout(async () => {
    if (shouldOpen === "open") {
      await open(join(assetsPath, "index.html"), { wait: false })
    }
  }, 2000)
}

generate().catch(err => {
  console.error(err)
})
