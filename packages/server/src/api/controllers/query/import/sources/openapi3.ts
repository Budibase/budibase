import { Query, QueryParameter, RestQueryImportOption } from "@budibase/types"
import { OpenAPI, OpenAPIV3 } from "openapi-types"
import { GetQueriesOptions } from "./base"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"

type ServerObject = OpenAPIV3.ServerObject
type ServerVariableObject = OpenAPIV3.ServerVariableObject

const parameterNotRef = (
  param: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject
): param is OpenAPIV3.ParameterObject => {
  // all refs are deferenced by parser library
  return true
}

const requestBodyNotRef = (
  param: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject | undefined
): param is OpenAPIV3.RequestBodyObject => {
  // all refs are deferenced by parser library
  return param !== undefined
}

const schemaNotRef = (
  param: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined
): param is OpenAPIV3.SchemaObject => {
  // all refs are deferenced by parser library
  return param !== undefined
}

const isOpenAPI3 = (
  document: OpenAPI.Document
): document is OpenAPIV3.Document => {
  if (!("openapi" in document)) {
    return false
  }
  const { openapi } = document as { openapi: string }
  return openapi.startsWith("3.")
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
  if (requestBodyNotRef(operation.requestBody)) {
    const request: OpenAPIV3.RequestBodyObject = operation.requestBody
    const supportedMimeTypes = getMimeTypes(operation)
    if (supportedMimeTypes.length > 0) {
      const mimeType = supportedMimeTypes[0]

      // try get example from request
      const content = request.content[mimeType]
      if (content.example) {
        return content.example
      }

      // try get example from schema
      if (schemaNotRef(content.schema)) {
        const schema = content.schema
        if (schema.example) {
          return schema.example
        }
      }
    }
  }
  return undefined
}

const getMimeTypes = (operation: OpenAPIV3.OperationObject): string[] => {
  if (requestBodyNotRef(operation.requestBody)) {
    const request: OpenAPIV3.RequestBodyObject = operation.requestBody
    return Object.keys(request.content)
  }
  return []
}

/**
 * OpenAPI Version 3.0
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md
 */
export class OpenAPI3 extends OpenAPISource {
  document!: OpenAPIV3.Document

  private buildQueryId = (method: string, path: string) => {
    const normalisedMethod = method.toUpperCase()
    return `${normalisedMethod} ${path}`
  }

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document = await this.parseData(data)
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

  getInfo = async () => {
    const name = this.document.info.title || "OpenAPI Import"
    const info: { name: string; url?: string } = {
      name,
    }
    const server = this.document.servers?.[0]
    if (server?.url) {
      info.url = server.url
    }
    return info
  }

  getImportSource(): string {
    return "openapi3.0"
  }

  async listQueries(): Promise<RestQueryImportOption[]> {
    const options: RestQueryImportOption[] = []
    for (let [path, pathItemObject] of Object.entries(this.document.paths)) {
      if (!pathItemObject) {
        continue
      }

      for (let [key, opOrParams] of Object.entries(pathItemObject)) {
        if (isParameter(key, opOrParams)) {
          continue
        }

        const methodName = key
        if (!this.isSupportedMethod(methodName)) {
          continue
        }

        const operation = opOrParams as OpenAPIV3.OperationObject
        const id = this.buildQueryId(methodName, path)
        const name =
          operation.summary || operation.operationId || `${methodName.toUpperCase()} ${path}`

        options.push({
          id,
          name,
          method: methodName.toUpperCase(),
          path,
          description: operation.description,
          tags: operation.tags,
        })
      }
    }

    return options
  }

  getQueries = async (
    datasourceId: string,
    options?: GetQueriesOptions
  ): Promise<Query[]> => {
    let url: string | URL | undefined
    let serverVariables: Record<string, ServerVariableObject> = {}
    if (this.document.servers?.length) {
      const server = this.document.servers[0] as ServerObject
      url = server.url
      serverVariables = server.variables || {}
    }

    const queries: Query[] = []
    const selected = options?.selectedQueryIds

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
        if (!this.isSupportedMethod(methodName)) {
          continue
        }
        const queryId = this.buildQueryId(methodName, path)
        if (selected && !selected.has(queryId)) {
          continue
        }
        const name = operation.operationId || path
        let queryString = ""
        const headers: any = {}
        let requestBody = getRequestBody(operation)
        const parameters: QueryParameter[] = []
        const ensureParameter = (paramName: string, defaultValue = "") => {
          if (!parameters.some(parameter => parameter.name === paramName)) {
            parameters.push({
              name: paramName,
              default: defaultValue,
            })
          }
        }
        const mimeTypes = getMimeTypes(operation)

        if (mimeTypes.length > 0) {
          headers["Content-Type"] = mimeTypes[0]
        }

        // combine the path parameters with the operation parameters
        const operationParams = operation.parameters || []
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          if (parameterNotRef(param)) {
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
              ensureParameter(param.name)
            }
          }
        }

        for (let [variableName, variable] of Object.entries(serverVariables)) {
          const defaultValue = variable?.default || ""
          ensureParameter(variableName, defaultValue)
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
        query.fields.method = methodName.toUpperCase()
        queries.push(query)
      }
    }

    return queries
  }
}
