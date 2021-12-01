import { ImportInfo, Query } from "./base"
import { OpenAPISource } from "./base/openapi"
import { OpenAPIV3 } from "openapi-types"

const isOpenAPI3 = (document: any): document is OpenAPIV3.Document => {
  return document.openapi === "3.0.0" 
}

/**
 * OpenAPI Version 3.0.0
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md
 */
export class OpenAPI3 extends OpenAPISource {
  document!: OpenAPIV3.Document

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document: any = await this.parseData(data)
      if (isOpenAPI3(document)) {
        this.document = document
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  getInfo = async (): Promise<ImportInfo> => {
    return {
      url: "http://localhost:3000",
      name: "swagger",
    }
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    return []
  }
}
