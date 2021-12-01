import { ImportInfo, QueryParameter, Query } from "./base"
import { OpenAPIV2 } from "openapi-types"
import { OpenAPISource } from "./base/openapi";

const isBodyParameter = (param: OpenAPIV2.Parameter): param is OpenAPIV2.InBodyParameterObject => {
  return param.in === "body"
}

const isParameter = (param: OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject): param is OpenAPIV2.Parameter => {
  // we can guarantee this is not a reference object
  // due to the deferencing done by the parser library
  return true
}

const isOpenAPI2 = (document: any): document is OpenAPIV2.Document => {
  if (document.swagger === "2.0") {
    return true
  } else {
    return false
  }
}

/**
 * OpenAPI Version 2.0 - aka "Swagger"
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md
 */
export class OpenAPI2 extends OpenAPISource {
  document!: OpenAPIV2.Document
  
  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document: any = await this.parseData(data)
      if (isOpenAPI2(document)) {
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
    const scheme = this.document.schemes?.includes("https") ? "https" : "http"
    const basePath = this.document.basePath || ""
    const host = this.document.host || "<host>"
    const url = `${scheme}://${host}${basePath}`
    const name = this.document.info.title || "Swagger Import"
  
    return {
      url: url,
      name: name,
    }
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    const queries = []
  
    let pathName: string
    let path: OpenAPIV2.PathItemObject
  
    for ([pathName, path] of Object.entries(this.document.paths)) {
      for (let [methodName, op] of Object.entries(path)) {
        let operation = op as OpenAPIV2.OperationObject
  
        const name = operation.operationId || pathName
        const queryString = ""
        const headers = {}
        let requestBody = undefined
        const parameters: QueryParameter[] = []
  
        if (operation.parameters) {
          for (let param of operation.parameters) { 
            if (isParameter(param)) {
              if (isBodyParameter(param)) {
                requestBody = {}
              } else {
                parameters.push({
                  name: param.name,
                  default: "",
                })
              }
            }
          }
        }
  
        const query = this.constructQuery(
          datasourceId,
          name,
          methodName,
          pathName,
          queryString,
          headers,
          parameters,
          requestBody
        )
        queries.push(query)
      }
    }
  
    return queries
  }
}
