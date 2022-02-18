const swaggerJsdoc = require("swagger-jsdoc")
const { join } = require("path")
const { writeFileSync } = require("fs")
const examples = require("./examples")
const parameters = require("./parameters")
const security = require("./security")

const VARIABLES = {}

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
        url: "http://budibase.app/api/public/v1",
        description: "Budibase Cloud API",
      },
      {
        url: "{protocol}://{hostname}:10000/api/public/v1",
        description: "Budibase self hosted API",
      },
    ],
    components: {
      parameters: {
        ...parameters,
      },
      examples: {
        ...examples,
      },
      securitySchemes: {
        ...security,
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  format: ".json",
  apis: [join(__dirname, "..", "src", "api", "routes", "public", "*.js")],
}

function writeFile(output, { isJson } = {}) {
  try {
    const filename = isJson ? "openapi.json" : "openapi.yaml"
    const path = join(__dirname, filename)
    let spec = output
    if (isJson) {
      spec = JSON.stringify(output, null, 2)
    }
    // input the static variables
    for (let [key, replacement] of Object.entries(VARIABLES)) {
      spec = spec.replace(new RegExp(`{${key}}`, "g"), replacement)
    }
    writeFileSync(path, spec)
    console.log(`Wrote spec to ${path}`)
  } catch (err) {
    console.error(err)
  }
}

const outputJSON = swaggerJsdoc(options)
options.format = ".yaml"
const outputYAML = swaggerJsdoc(options)
writeFile(outputJSON, { isJson: true })
writeFile(outputYAML)
