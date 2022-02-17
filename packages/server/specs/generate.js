const swaggerJsdoc = require("swagger-jsdoc")
const { join } = require("path")
const { writeFileSync } = require("fs")

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
      examples: {
        row: {
          value: {
            _id: "ro_ta_5b1649e42a5b41dea4ef7742a36a7a70_e6dc7e38cf1343b2b56760265201cda4",
            type: "row",
            tableId: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
            name: "Mike",
            age: 30,
            relationship: [
              {
                primaryDisplay: "Joe",
                _id: "ro_ta_...",
              },
            ],
          },
        },
        table: {
          value: {
            _id: "ta_5b1649e42a5b41dea4ef7742a36a7a70",
            name: "People",
            schema: {
              name: {
                type: "string",
                name: "name",
              },
              age: {
                type: "number",
                name: "age",
              },
              relationship: {
                type: "link",
                name: "relationship",
                tableId: "ta_...",
                fieldName: "relatedColumn",
                relationshipType: "many-to-many",
              },
            },
          },
        },
      },
    },
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
