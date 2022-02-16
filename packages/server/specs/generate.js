const swaggerJsdoc = require("swagger-jsdoc")
const { join } = require("path")
const { writeFileSync } = require("fs")

const FILE_NAME = "openapi.json"
const VARIABLES = {
  prefixV1: "api/public/v1",
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Budibase API",
      description: "The public API for Budibase apps and its services.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://budibase.app/api",
        description: "Budibase Cloud API",
      },
    ],
  },
  format: "json",
  apis: [join(__dirname, "..", "src", "api", "routes", "public", "*.js")],
}

const output = swaggerJsdoc(options)
try {
  const path = join(__dirname, FILE_NAME)
  let spec = JSON.stringify(output, null, 2)
  for (let [key, replacement] of Object.entries(VARIABLES)) {
    spec = spec.replace(new RegExp(`{${key}}`, "g"), replacement)
  }
  // input the static variables
  writeFileSync(path, spec)
  console.log(`Wrote spec to ${path}`)
} catch (err) {
  console.error(err)
}
