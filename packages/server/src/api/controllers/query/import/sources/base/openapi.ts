import { ImportSource } from "."
import SwaggerParser from "@apidevtools/swagger-parser"
import { OpenAPI } from "openapi-types"

export abstract class OpenAPISource extends ImportSource {
  parseData = async (data: string): Promise<OpenAPI.Document> => {
    const baseOptions = {
      resolve: {
        external: false,
      },
    }

    const document = (await SwaggerParser.parse(
      data,
      baseOptions
    )) as OpenAPI.Document

    try {
      return (await SwaggerParser.validate(document)) as OpenAPI.Document
    } catch (err) {
      console.log(
        `[OpenAPI Import] Schema validation failed, continuing without validation`
      )
      return (await SwaggerParser.dereference(
        document,
        baseOptions
      )) as OpenAPI.Document
    }
  }
}
