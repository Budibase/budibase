
import { ImportSource } from "."
import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPI } from "openapi-types";

export abstract class OpenAPISource extends ImportSource {

  parseData = async (data: string): Promise<OpenAPI.Document> => {
    const json = JSON.parse(data)
    return SwaggerParser.validate(json, {})
  }

}
