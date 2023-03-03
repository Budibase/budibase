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
      },
      {
        url: "{protocol}://{hostname}/api/public/v1",
        description: "Budibase self hosted API",
        variables: {
          protocol: {
            default: "http",
            description:
              "Whether HTTP or HTTPS should be used to communicate with your Budibase instance.",
          },
          hostname: {
            default: "localhost:10000",
            description: "The URL of your Budibase instance.",
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
    console.error(err)
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
