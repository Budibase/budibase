import { GetQueriesOptions, ImportInfo } from "./base"
import {
  Query,
  QueryParameter,
  RestTemplateQueryMetadata,
} from "@budibase/types"
import { OpenAPI, OpenAPIV3 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"
import {
  GeneratedRequestBody,
  buildSerializableRequestBody,
  generateRequestBodyFromExample,
  generateRequestBodyFromSchema,
} from "./utils/requestBody"

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

const getRequestBody = (
  operation: OpenAPIV3.OperationObject,
  bindingRoot: string,
  mimeTypeOverride?: string
): GeneratedRequestBody | undefined => {
  if (requestBodyNotRef(operation.requestBody)) {
    const request: OpenAPIV3.RequestBodyObject = operation.requestBody
    const supportedMimeTypes = getMimeTypes(operation)
    const mimeType = mimeTypeOverride || supportedMimeTypes[0]
    if (mimeType) {
      // try get example from request
      const content = request.content[mimeType]
      if (!content) {
        return undefined
      }
      if (content.example) {
        return generateRequestBodyFromExample(content.example, bindingRoot)
      }

      // try get example from schema
      if (schemaNotRef(content.schema)) {
        const schema = content.schema
        if (schema.example) {
          return generateRequestBodyFromExample(schema.example, bindingRoot)
        }
        return generateRequestBodyFromSchema(schema, bindingRoot)
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
  serverVariableBindings: Record<string, string> = {}

  private getDocsUrl = (
    operation: OpenAPIV3.OperationObject
  ): string | undefined => {
    return (
      operation.externalDocs?.url ||
      this.document.externalDocs?.url ||
      this.document.info?.termsOfService ||
      this.document.info?.contact?.url
    )
  }

  private buildRestTemplateMetadata = (
    operation: OpenAPIV3.OperationObject,
    path: string,
    requestBody: GeneratedRequestBody | undefined,
    parameters: QueryParameter[]
  ): RestTemplateQueryMetadata => {
    const metadata: RestTemplateQueryMetadata = {
      operationId: operation.operationId,
      docsUrl: this.getDocsUrl(operation),
      description: operation.description || operation.summary,
      originalPath: path,
    }

    const parsedBody = buildSerializableRequestBody(requestBody?.body)
    if (parsedBody !== undefined) {
      metadata.originalRequestBody = parsedBody
    }

    const defaultBindings = this.buildDefaultBindings(
      parameters,
      requestBody?.bindings
    )
    if (defaultBindings) {
      metadata.defaultBindings = defaultBindings
    }

    return metadata
  }

  private getPrimaryServer = (): ServerObject | undefined => {
    if (this.document?.servers?.length) {
      return this.document.servers[0] as ServerObject
    }
  }

  private setServerVariableBindings = (server?: ServerObject) => {
    this.serverVariableBindings = {}
    const variables = server?.variables || {}
    for (let [variableName, variable] of Object.entries(variables)) {
      this.serverVariableBindings[variableName] = variable?.default || ""
    }
  }

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document = await this.parseData(data)
      if (isOpenAPI3(document)) {
        this.document = document
        this.serverVariableBindings = {}
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  getServerVariableBindings = () => {
    if (!Object.keys(this.serverVariableBindings).length) {
      this.setServerVariableBindings(this.getPrimaryServer())
    }
    return { ...this.serverVariableBindings }
  }

  private getEndpoints = (): ImportInfo["endpoints"] => {
    const endpoints: ImportInfo["endpoints"] = []
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
        const name = operation.operationId || path
        endpoints.push({
          id: this.buildEndpointId(methodName, path),
          name,
          method: methodName.toUpperCase(),
          path,
          description: operation.summary || operation.description,
          queryVerb: this.verbFromMethod(methodName),
        })
      }
    }
    return endpoints
  }

  getInfo = async (): Promise<ImportInfo> => {
    const name = this.document.info.title || "OpenAPI Import"
    let url: string | undefined
    if (this.document.servers?.length) {
      const serverUrl = (this.document.servers[0] as ServerObject)?.url
      url = serverUrl ? this.convertPathVariables(serverUrl) : undefined
    }
    const docsUrl =
      this.document.externalDocs?.url ||
      this.document.info?.termsOfService ||
      this.document.info?.contact?.url
    return {
      name,
      url,
      docsUrl,
      endpoints: this.getEndpoints(),
    }
  }

  getImportSource(): string {
    return "openapi3.0"
  }

  getQueries = async (
    datasourceId: string,
    options?: GetQueriesOptions
  ): Promise<Query[]> => {
    let url: string | URL | undefined
    let serverVariables: Record<string, ServerVariableObject> = {}
    const primaryServer = this.getPrimaryServer()
    if (primaryServer) {
      url = primaryServer.url
      serverVariables = primaryServer.variables || {}
    }
    this.setServerVariableBindings(primaryServer)

    const queries: Query[] = []
    const filterIds = options?.filterIds
    const staticVariables = options?.staticVariables || {}

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
        const endpointId = this.buildEndpointId(methodName, path)
        if (filterIds && !filterIds.has(endpointId)) {
          continue
        }
        const name = operation.operationId || path
        let queryString = ""
        const headers: { [key: string]: unknown } = {}
        const mimeTypes = getMimeTypes(operation)
        const primaryMimeType = mimeTypes[0]

        const requestBody = this.methodHasRequestBody(methodName)
          ? getRequestBody(
              operation,
              operation.operationId || path,
              primaryMimeType
            )
          : undefined
        const parameters: QueryParameter[] = []
        const ensureParameter = (paramName: string, defaultValue = "") => {
          if (!parameters.some(parameter => parameter.name === paramName)) {
            parameters.push({
              name: paramName,
              default: defaultValue,
            })
          }
        }
        if (primaryMimeType) {
          headers["Content-Type"] = primaryMimeType
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
              let defaultValue = ""
              if (
                schemaNotRef(param.schema) &&
                param.schema.default !== undefined
              ) {
                defaultValue = String(param.schema.default)
              }
              ensureParameter(param.name, defaultValue)
            }
          }
        }

        for (let [variableName, variable] of Object.entries(serverVariables)) {
          const hasStaticVariable = Object.prototype.hasOwnProperty.call(
            staticVariables,
            variableName
          )
          const defaultValue = hasStaticVariable
            ? `{{ ${variableName} }}`
            : (variable?.default ?? "")
          ensureParameter(variableName, defaultValue)
        }

        const restTemplateMetadata = this.buildRestTemplateMetadata(
          operation,
          path,
          requestBody,
          parameters
        )

        const query = this.constructQuery(
          datasourceId,
          name,
          methodName,
          path,
          url,
          queryString,
          headers,
          parameters,
          requestBody?.body,
          requestBody?.bindings ?? {},
          mimeTypes.length > 0
            ? this.bodyTypeFromMimeType(primaryMimeType)
            : undefined,
          restTemplateMetadata
        )
        queries.push(query)
      }
    }

    return queries
  }
}
