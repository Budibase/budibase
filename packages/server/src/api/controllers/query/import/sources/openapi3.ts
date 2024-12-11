import { ImportInfo } from "./base"
import { Query, QueryParameter } from "@budibase/types"
import { OpenAPIV3 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"

const isOpenAPI3 = (document: any): document is OpenAPIV3.Document => {
  return document.openapi.includes("3.0")
}

const methods: string[] = Object.values(OpenAPIV3.HttpMethods)

const isOperation = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV3.OperationObject => {
  return methods.includes(key)
}

const isParameter = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV3.ParameterObject => {
  return !isOperation(key, pathItem)
}

const getRequestBody = (operation: OpenAPIV3.OperationObject) => {
  if (!operation.requestBody || "$ref" in operation.requestBody) {
    return undefined
  }

  const mimeType = getMimeTypes(operation)[0]
  if (!mimeType) {
    return undefined
  }

  const content = operation.requestBody.content[mimeType]
  if (content?.example) {
    return content.example
  }

  if (content?.schema && "example" in content.schema) {
    return content.schema.example
  }

  return undefined
}

const getMimeTypes = (operation: OpenAPIV3.OperationObject): string[] => {
  if (!operation.requestBody || "$ref" in operation.requestBody) {
    return []
  }
  return Object.keys(operation.requestBody.content)
}

/**
 * OpenAPI Version 3.0
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
    const name = this.document.info.title || "OpenAPI Import"
    return {
      name,
    }
  }

  getImportSource(): string {
    return "openapi3.0"
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    let url: string | URL | undefined
    const server = this.document.servers?.[0]
    if (server) {
      try {
        url = new URL(server.url)
      } catch (err) {
        // unable to construct url, e.g. with variables
        // proceed with string form of url
      }
    }

    const queries: Query[] = []

    for (let [path, pathItemObject] of Object.entries(this.document.paths)) {
      // parameters that apply to every operation in the path
      let pathParams: OpenAPIV3.ParameterObject[] = []

      // pathItemObject can be undefined
      if (!pathItemObject) {
        continue
      }

      for (let [key, opOrParams] of Object.entries(pathItemObject)) {
        if (isParameter(key, opOrParams)) {
          const pathParameters = opOrParams as OpenAPIV3.ParameterObject[]
          pathParams.push(...pathParameters)
          continue
        }
        // can not be a parameter, must be an operation
        const operation = opOrParams as OpenAPIV3.OperationObject

        const methodName = key
        const name = operation.operationId || path
        let queryString = ""
        const headers: Record<string, string> = {}
        let requestBody = getRequestBody(operation)
        const parameters: QueryParameter[] = []

        const mimeType = getMimeTypes(operation)[0]
        if (mimeType) {
          headers["Content-Type"] = mimeType
        }

        // combine the path parameters with the operation parameters
        const operationParams = operation.parameters || []
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          if (!param || "$ref" in param) {
            continue
          }

          switch (param.in) {
            case "query": {
              let prefix = ""
              if (queryString) {
                prefix = "&"
              }
              queryString = `${queryString}${prefix}${param.name}={{${param.name}}}`
              break
            }
            case "header":
              headers[param.name] = `{{${param.name}}}`
              break
            case "path":
              // do nothing: param is already in the path
              break
            case "formData":
              // future enhancement
              break
          }

          // add the parameter if it can be bound in our config
          if (["query", "header", "path"].includes(param.in)) {
            parameters.push({
              name: param.name,
              default: "",
            })
          }
        }

        const query = this.constructQuery(
          datasourceId,
          name,
          methodName,
          path,
          url,
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
