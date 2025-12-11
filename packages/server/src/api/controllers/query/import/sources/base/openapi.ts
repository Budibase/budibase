import SwaggerParser from "@apidevtools/swagger-parser"
import { load as loadYaml } from "js-yaml"
import isObject from "lodash/isObject"
import { OpenAPI } from "openapi-types"
import { ImportSource } from "."

const isYamlDocument = (loaded: unknown): loaded is OpenAPI.Document => {
  if (isObject(loaded)) {
    return true
  }
  return false
}

const prepareDocument = (raw: string): string | OpenAPI.Document => {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error("Empty OpenAPI document")
  }

  try {
    const yamlDocument = loadYaml(trimmed, {
      // allow duplicate keys so large vendor specs (e.g. Okta) still parse
      json: true,
    })
    if (isYamlDocument(yamlDocument)) {
      return yamlDocument
    }
  } catch (err) {
    // fall through to allow swagger parser to attempt parsing
  }

  return raw
}

export abstract class OpenAPISource extends ImportSource {
  parseData = async (data: string): Promise<OpenAPI.Document> => {
    const baseOptions = {
      resolve: {
        external: false,
      },
    }

    const parsedInput = prepareDocument(data)
    const document = await SwaggerParser.parse(parsedInput, baseOptions)

    try {
      return await SwaggerParser.validate(document)
    } catch (err) {
      console.log(
        `[OpenAPI Import] Schema validation failed, continuing without validation`
      )
      try {
        return await SwaggerParser.dereference(document, baseOptions)
      } catch (dereferenceErr) {
        console.log(
          `[OpenAPI Import] Dereference failed, continuing with parsed document`
        )
        return document as OpenAPI.Document
      }
    }
  }
}
