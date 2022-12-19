import { ImportInfo } from "./base"
import { Query, QueryParameter } from "@budibase/types"
import { OpenAPIV2 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"

const parameterNotRef = (
  param: OpenAPIV2.Parameter | OpenAPIV2.ReferenceObject
): param is OpenAPIV2.Parameter => {
  // all refs are deferenced by parser library
  return true
}

const isOpenAPI2 = (document: any): document is OpenAPIV2.Document => {
  if (document.swagger === "2.0") {
    return true
  } else {
    return false
  }
}

const methods: string[] = Object.values(OpenAPIV2.HttpMethods)

const isOperation = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV2.OperationObject => {
  return methods.includes(key)
}

const isParameter = (
  key: string,
  pathItem: any
): pathItem is OpenAPIV2.Parameter => {
  return !isOperation(key, pathItem)
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

  getUrl = (): URL => {
    const scheme = this.document.schemes?.includes("https") ? "https" : "http"
    const basePath = this.document.basePath || ""
    const host = this.document.host || "<host>"
    return new URL(`${scheme}://${host}${basePath}`)
  }

  getInfo = async (): Promise<ImportInfo> => {
    const name = this.document.info.title || "Swagger Import"
    return {
      name,
    }
  }

  getImportSource(): string {
    return "openapi2.0"
  }

  getQueries = async (datasourceId: string): Promise<Query[]> => {
    const url = this.getUrl()
    const queries = []

    for (let [path, pathItem] of Object.entries(this.document.paths)) {
      // parameters that apply to every operation in the path
      let pathParams: OpenAPIV2.Parameter[] = []

      for (let [key, opOrParams] of Object.entries(pathItem)) {
        if (isParameter(key, opOrParams)) {
          const pathParameters = opOrParams as OpenAPIV2.Parameter[]
          pathParams.push(...pathParameters)
          continue
        }
        // can not be a parameter, must be an operation
        const operation = opOrParams as OpenAPIV2.OperationObject

        const methodName = key
        const name = operation.operationId || path
        let queryString = ""
        const headers: any = {}
        let requestBody = undefined
        const parameters: QueryParameter[] = []

        if (operation.consumes) {
          headers["Content-Type"] = operation.consumes[0]
        }

        // combine the path parameters with the operation parameters
        const operationParams = operation.parameters || []
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          if (parameterNotRef(param)) {
            switch (param.in) {
              case "query":
                let prefix = ""
                if (queryString) {
                  prefix = "&"
                }
                queryString = `${queryString}${prefix}${param.name}={{${param.name}}}`
                break
              case "header":
                headers[param.name] = `{{${param.name}}}`
                break
              case "path":
                // do nothing: param is already in the path
                break
              case "formData":
                // future enhancement
                break
              case "body":
                // set the request body to the example provided
                // future enhancement: generate an example from the schema
                let bodyParam: OpenAPIV2.InBodyParameterObject =
                  param as OpenAPIV2.InBodyParameterObject
                if (param.schema.example) {
                  const schema = bodyParam.schema as OpenAPIV2.SchemaObject
                  requestBody = schema.example
                }
                break
            }

            // add the parameter if it can be bound in our config
            if (["query", "header", "path"].includes(param.in)) {
              parameters.push({
                name: param.name,
                default: param.default || "",
              })
            }
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
