import { join } from "path"
import { writeFileSync } from "fs"
import { examples, schemas } from "./resources"
import * as parameters from "./parameters"
import * as security from "./security"

const swaggerJsdoc = require("swagger-jsdoc")

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
        url: "https://budibase.app/api/public/v1",
        description: "Budibase Cloud API",
        variables: {
          apiKey: {
            default: "<user API key>",
            description: "The API key of the user to assume for API call.",
          },
          appId: {
            default: "<App ID>",
            description:
              "The ID of the app the calls will be executed within the context of, this should start with app_ (production) or app_dev (development).",
          },
        },
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
      schemas: {
        ...schemas,
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  format: ".json",
  apis: [join(__dirname, "..", "src", "api", "routes", "public", "*.ts")],
}

function writeFile(output: any, filename: string) {
  try {
    const path = join(__dirname, filename)
    let spec = output
    if (filename.endsWith("json")) {
      spec = JSON.stringify(output, null, 2)
    }
    // input the static variables
    for (let [key, replacement] of Object.entries(VARIABLES)) {
      spec = spec.replace(new RegExp(`{${key}}`, "g"), replacement)
    }
    writeFileSync(path, spec)
    console.log(`Wrote spec to ${path}`)
    return path
  } catch (err) {
    console.error("Error writing spec file", err)
  }
}

export function run() {
  const outputJSON = swaggerJsdoc(options)
  options.format = ".yaml"
  const outputYAML = swaggerJsdoc(options)
  writeFile(outputJSON, "openapi.json")
  return writeFile(outputYAML, "openapi.yaml")
}

if (require.main === module) {
  run()
}
