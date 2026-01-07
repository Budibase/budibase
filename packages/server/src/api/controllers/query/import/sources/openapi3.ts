import { GetQueriesOptions, ImportInfo } from "./base"
import {
  BodyType,
  Query,
  QueryParameter,
  RestTemplateQueryMetadata,
} from "@budibase/types"
import { QueryVerbToHttpMethod } from "../../../../../constants"
import { OpenAPI, OpenAPIV3 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"
import {
  GeneratedRequestBody,
  buildSerializableRequestBody,
  generateRequestBodyFromExample,
  generateRequestBodyFromSchema,
  buildKeyValueRequestBody,
} from "./utils/requestBody"

type ServerObject = OpenAPIV3.ServerObject
type ServerVariableObject = OpenAPIV3.ServerVariableObject

const isReferenceObject = (
  value: unknown
): value is OpenAPIV3.ReferenceObject => {
  return (
    value != null &&
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "$ref")
  )
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

/**
 * OpenAPI Version 3.0
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.0.md
 */
export class OpenAPI3 extends OpenAPISource {
  document!: OpenAPIV3.Document
  serverVariableBindings: Record<string, string> = {}
  private securityHeaders: Map<string, string> = new Map()

  private resolveRef<T>(ref: string): T | undefined {
    if (!ref || !ref.startsWith("#/")) {
      return undefined
    }
    const parts = ref
      .slice(2)
      .split("/")
      .map(part => part.replace(/~1/g, "/").replace(/~0/g, "~"))

    let current: any = this.document
    for (let part of parts) {
      if (current == null || typeof current !== "object") {
        return undefined
      }
      current = current[part]
    }
    return current as T | undefined
  }

  private resolveMaybeRef<T>(
    value: T | OpenAPIV3.ReferenceObject | undefined
  ): T | undefined {
    if (!value) {
      return undefined
    }
    if (isReferenceObject(value)) {
      return this.resolveRef<T>(value.$ref)
    }
    return value as T
  }

  private normalizeParameters(
    params?: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[]
  ): OpenAPIV3.ParameterObject[] {
    if (!Array.isArray(params)) {
      return []
    }
    const resolved: OpenAPIV3.ParameterObject[] = []
    for (const param of params) {
      const normalized = this.resolveMaybeRef<OpenAPIV3.ParameterObject>(param)
      if (normalized) {
        resolved.push(normalized)
      }
    }
    return resolved
  }

  private getMimeTypes(operation: OpenAPIV3.OperationObject): string[] {
    const request = this.resolveMaybeRef<OpenAPIV3.RequestBodyObject>(
      operation.requestBody
    )
    if (request?.content) {
      return Object.keys(request.content)
    }
    return []
  }

  private getRequestBody(
    operation: OpenAPIV3.OperationObject,
    bindingRoot: string,
    mimeTypeOverride?: string
  ): GeneratedRequestBody | undefined {
    const request = this.resolveMaybeRef<OpenAPIV3.RequestBodyObject>(
      operation.requestBody
    )
    if (!request) {
      return undefined
    }
    const supportedMimeTypes = this.getMimeTypes(operation)
    const mimeType = mimeTypeOverride || supportedMimeTypes[0]
    if (!mimeType) {
      return undefined
    }
    const content = request.content[mimeType]
    if (!content) {
      return undefined
    }
    if (content.example) {
      return generateRequestBodyFromExample(content.example, bindingRoot)
    }
    const schema = this.resolveMaybeRef<OpenAPIV3.SchemaObject>(content.schema)
    if (!schema) {
      return undefined
    }
    if (schema.example) {
      return generateRequestBodyFromExample(schema.example, bindingRoot)
    }
    return generateRequestBodyFromSchema(schema, bindingRoot)
  }

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
    parameters: QueryParameter[],
    bodyType?: BodyType
  ): RestTemplateQueryMetadata => {
    const metadata: RestTemplateQueryMetadata = {
      operationId: operation.operationId,
      docsUrl: this.getDocsUrl(operation),
      description: operation.description || operation.summary,
      originalPath: path,
    }

    let parsedBody = buildSerializableRequestBody(requestBody?.body)
    if (
      parsedBody !== undefined &&
      bodyType &&
      (bodyType === BodyType.FORM_DATA || bodyType === BodyType.ENCODED)
    ) {
      parsedBody = buildKeyValueRequestBody(parsedBody)
    }
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

  private shouldAddBaseUrlBinding = (server?: ServerObject): boolean => {
    const url = server?.url
    if (!url) {
      return true
    }
    return url.trim().length === 0
  }

  private setServerVariableBindings = (server?: ServerObject) => {
    this.serverVariableBindings = {}
    const variables = server?.variables || {}
    for (let [variableName, variable] of Object.entries(variables)) {
      this.serverVariableBindings[variableName] = variable?.default || ""
    }
  }

  private setSecurityHeaders = () => {
    this.securityHeaders = new Map()
    const securitySchemes = this.document.components?.securitySchemes
    if (!securitySchemes) {
      return
    }
    for (const scheme of Object.values(securitySchemes)) {
      const resolvedScheme =
        this.resolveMaybeRef<OpenAPIV3.SecuritySchemeObject>(
          scheme as OpenAPIV3.SecuritySchemeObject | OpenAPIV3.ReferenceObject
        )
      const headerName = this.getSecuritySchemeHeader(resolvedScheme)
      if (headerName) {
        this.securityHeaders.set(headerName.toLowerCase(), headerName)
      }
    }
  }

  private getSecuritySchemeHeader(
    scheme?: OpenAPIV3.SecuritySchemeObject
  ): string | undefined {
    if (!scheme) {
      return undefined
    }
    if (scheme.type === "apiKey" && scheme.in === "header" && scheme.name) {
      return scheme.name
    }
    return undefined
  }

  private isSecurityHeader(name?: string): boolean {
    if (!name) {
      return false
    }
    return this.securityHeaders.has(name.toLowerCase())
  }

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document = await this.parseData(data)
      if (isOpenAPI3(document)) {
        this.document = document
        this.serverVariableBindings = {}
        this.setSecurityHeaders()
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  getServerVariableBindings = () => {
    const primaryServer = this.getPrimaryServer()
    if (!Object.keys(this.serverVariableBindings).length) {
      this.setServerVariableBindings(primaryServer)
    }
    const bindings = { ...this.serverVariableBindings }
    if (this.shouldAddBaseUrlBinding(primaryServer)) {
      bindings.baseUrl = bindings.baseUrl ?? ""
    }
    return bindings
  }

  getSecurityHeaders(): string[] {
    return Array.from(new Set(this.securityHeaders.values()))
  }

  private getEndpoints = async (): Promise<ImportInfo["endpoints"]> => {
    const queries = await this.getQueries("")
    const endpoints: ImportInfo["endpoints"] = []

    for (const query of queries) {
      const metadata = query.restTemplateMetadata
      if (!metadata) {
        continue
      }

      const path = metadata.originalPath || query.fields.path || ""
      const method = QueryVerbToHttpMethod[query.queryVerb]

      if (!this.isSupportedMethod(method)) {
        continue
      }

      endpoints.push({
        id: this.buildEndpointId(method || "", path),
        name: query.name,
        method: method?.toUpperCase() || "",
        path,
        description: metadata.description,
        queryVerb: query.queryVerb,
        operationId: metadata.operationId,
        docsUrl: metadata.docsUrl,
        originalPath: metadata.originalPath,
        originalRequestBody: metadata.originalRequestBody,
        defaultBindings: metadata.defaultBindings,
        bodyType: query.fields.bodyType,
        headers:
          query.fields.headers && Object.keys(query.fields.headers).length > 0
            ? query.fields.headers
            : undefined,
        queryString: query.fields.queryString || undefined,
      })
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
      endpoints: await this.getEndpoints(),
      securityHeaders: this.getSecurityHeaders(),
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
    const serverUrl = primaryServer?.url
    const useBaseUrlBinding = this.shouldAddBaseUrlBinding(primaryServer)
    if (primaryServer) {
      serverVariables = primaryServer.variables || {}
      if (serverUrl) {
        url = serverUrl
      }
    }
    this.setServerVariableBindings(primaryServer)
    if (useBaseUrlBinding) {
      url = "{baseUrl}"
    }

    const queries: Query[] = []
    const filterIds = options?.filterIds
    const staticVariables = options?.staticVariables || {}

    for (let [path, pathItemObject] of Object.entries(this.document.paths)) {
      if (!pathItemObject) {
        continue
      }
      const pathItem = pathItemObject as OpenAPIV3.PathItemObject
      const pathParams = this.normalizeParameters(pathItem.parameters)

      for (let [methodName, maybeOperation] of Object.entries(pathItem)) {
        if (!isOperation(methodName, maybeOperation)) {
          continue
        }
        const operation = maybeOperation as OpenAPIV3.OperationObject
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
        const setHeader = (headerName: string, value: unknown) => {
          if (!headerName) {
            return
          }
          const normalized = headerName.toLowerCase()
          const existingKey = Object.keys(headers).find(
            existing => existing.toLowerCase() === normalized
          )
          headers[existingKey || headerName] = value
        }
        const mimeTypes = this.getMimeTypes(operation)
        const primaryMimeType = mimeTypes[0]

        const requestBody = this.methodHasRequestBody(methodName)
          ? this.getRequestBody(
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
          setHeader("Content-Type", primaryMimeType)
        }

        // combine the path parameters with the operation parameters
        const operationParams = this.normalizeParameters(operation.parameters)
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          let skipParameterBinding = false
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
              if (this.isSecurityHeader(param.name)) {
                skipParameterBinding = true
                break
              }
              setHeader(param.name, `{{${param.name}}}`)
              break
            case "path":
              // do nothing: param is already in the path
              break
            case "formData":
              // future enhancement
              break
          }

          if (
            !skipParameterBinding &&
            ["query", "header", "path"].includes(param.in)
          ) {
            let defaultValue = ""
            const schema = this.resolveMaybeRef<OpenAPIV3.SchemaObject>(
              param.schema
            )
            if (schema?.default !== undefined) {
              defaultValue = String(schema.default)
            }
            ensureParameter(param.name, defaultValue)
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

        const bodyType =
          mimeTypes.length > 0
            ? this.bodyTypeFromMimeType(primaryMimeType)
            : undefined

        const restTemplateMetadata = this.buildRestTemplateMetadata(
          operation,
          path,
          requestBody,
          parameters,
          bodyType
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
          bodyType,
          restTemplateMetadata
        )
        queries.push(query)
      }
    }

    return queries
  }
}
