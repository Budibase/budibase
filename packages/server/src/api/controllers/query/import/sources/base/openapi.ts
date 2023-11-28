import { ImportSource } from "."
import SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

const yaml = require("js-yaml")

export abstract class OpenAPISource extends ImportSource {
  parseData = async (data: string): Promise<OpenAPI.Document> => {
    let json: OpenAPI.Document
    try {
      json = JSON.parse(data)
    } catch (jsonErr) {
      // couldn't parse json
      // try to convert yaml -> json
      try {
        json = yaml.load(data)
      } catch (yamlErr) {
        // couldn't parse yaml
        throw new Error("Could not parse JSON or YAML")
      }
    }

    return SwaggerParser.validate(json, {})
  }
}
