import { GetQueriesOptions, ImportInfo } from "./base"
import {
  BodyType,
  Query,
  QueryParameter,
  RestTemplateQueryMetadata,
} from "@budibase/types"
import { QueryVerbToHttpMethod } from "../../../../../constants"
import { OpenAPIV2 } from "openapi-types"
import { OpenAPISource } from "./base/openapi"
import { URL } from "url"
import {
  GeneratedRequestBody,
  buildRequestBodyFromFormDataParameters,
  buildSerializableRequestBody,
  generateRequestBodyFromExample,
  generateRequestBodyFromSchema,
  buildKeyValueRequestBody,
  type FormDataParameter,
} from "./utils/requestBody"

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

const OPERATION_ID_MAX_LENGTH = 60
const ACTION_SEGMENTS: Record<string, string> = {
  search: "Search",
  read: "Read",
  create: "Create",
  update: "Update",
  upsert: "Upsert",
  delete: "Delete",
  archive: "Archive",
  restore: "Restore",
  merge: "Merge",
}
const METHOD_ACTIONS: Record<string, string> = {
  get: "Get",
  post: "Create",
  put: "Update",
  patch: "Update",
  delete: "Delete",
}
const CONTEXT_SEGMENTS = new Set([
  "account",
  "auth",
  "automation",
  "business",
  "communication",
  "conversations",
  "crm",
  "cms",
  "events",
  "files",
  "marketing",
  "meta",
  "scheduler",
  "settings",
  "webhooks",
])
const WORD_REPLACEMENTS: Record<string, string> = {
  api: "API",
  cms: "CMS",
  crm: "CRM",
  id: "ID",
  oauth: "OAuth",
  scim: "SCIM",
  ui: "UI",
  url: "URL",
}

const isSimpleOperationId = (operationId?: string): boolean => {
  if (!operationId) {
    return false
  }
  const trimmed = operationId.trim()
  if (!trimmed) {
    return false
  }
  if (trimmed.length > OPERATION_ID_MAX_LENGTH) {
    return false
  }
  if (/[{}]/.test(trimmed)) {
    return false
  }
  return !trimmed.includes("/")
}

const getShortText = (value?: string): string | undefined => {
  if (!value) {
    return undefined
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const firstLine = trimmed
    .split(/\r?\n/)
    .map(line => line.trim())
    .find(line => line.length > 0)
  if (!firstLine) {
    return undefined
  }
  const maxLength = 80
  if (firstLine.length > maxLength) {
    return `${firstLine.slice(0, maxLength - 3).trim()}...`
  }
  return firstLine
}

const isVersionSegment = (segment: string): boolean => {
  const lower = segment.toLowerCase()
  return (
    /^v\d+$/.test(lower) ||
    /^\d{4}-\d{2}(-\d{2})?$/.test(lower) ||
    /^\d+$/.test(lower)
  )
}

const isPathParamSegment = (segment: string): boolean => {
  return segment.startsWith("{") && segment.endsWith("}")
}

const humanizeSegment = (segment: string): string => {
  const spaced = segment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map(word => {
      const lower = word.toLowerCase()
      const replacement = WORD_REPLACEMENTS[lower]
      if (replacement) {
        return replacement
      }
      return `${word[0].toUpperCase()}${word.slice(1)}`
    })
    .join(" ")
}

const buildResourceName = (segments: string[]): string => {
  if (!segments.length) {
    return ""
  }
  let selected = segments
  if (segments.length > 2 && CONTEXT_SEGMENTS.has(segments[0].toLowerCase())) {
    selected = [segments[0], ...segments.slice(-2)]
  } else if (segments.length > 2) {
    selected = segments.slice(-2)
  }
  return selected.map(humanizeSegment).join(" ")
}

const buildFallbackName = (methodName: string, path: string): string => {
  const normalizedMethod = methodName.toLowerCase()
  let segments = path.split("/").filter(Boolean)
  segments = segments.filter(
    segment => !isVersionSegment(segment) && !isPathParamSegment(segment)
  )
  const isBatch = segments.some(segment => segment.toLowerCase() === "batch")
  segments = segments.filter(segment => segment.toLowerCase() !== "batch")
  let action = METHOD_ACTIONS[normalizedMethod] || "Call"
  const last = segments[segments.length - 1]
  if (last) {
    const actionLabel = ACTION_SEGMENTS[last.toLowerCase()]
    if (actionLabel) {
      action = actionLabel
      segments = segments.slice(0, -1)
    }
  }
  if (isBatch && action !== "Batch") {
    action = `Batch ${action}`
  }
  const resource = buildResourceName(segments)
  if (!resource) {
    return action
  }
  return `${action} ${resource}`
}

const buildEndpointName = (
  operation: OpenAPIV2.OperationObject,
  methodName: string,
  path: string
): string => {
  if (isSimpleOperationId(operation.operationId)) {
    return operation.operationId?.trim() || path
  }
  const summary = getShortText(operation.summary)
  if (summary) {
    return summary
  }
  const description = getShortText(operation.description)
  if (description) {
    return description
  }
  return buildFallbackName(methodName, path)
}

/**
 * OpenAPI Version 2.0 - aka "Swagger"
 * https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md
 */
export class OpenAPI2 extends OpenAPISource {
  document!: OpenAPIV2.Document
  private securityHeaders: Map<string, string> = new Map()

  private getDocsUrl = (
    operation: OpenAPIV2.OperationObject
  ): string | undefined => {
    return (
      operation.externalDocs?.url ||
      this.document.externalDocs?.url ||
      this.document.info?.termsOfService ||
      this.document.info?.contact?.url
    )
  }

  private setSecurityHeaders = () => {
    this.securityHeaders = new Map()
    const securityDefinitions = this.document.securityDefinitions
    if (!securityDefinitions) {
      return
    }
    for (const scheme of Object.values(securityDefinitions)) {
      const headerName = this.getSecuritySchemeHeader(scheme)
      if (headerName) {
        this.securityHeaders.set(headerName.toLowerCase(), headerName)
      }
    }
  }

  private getSecuritySchemeHeader(
    scheme?: OpenAPIV2.SecuritySchemeObject
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

  private buildRestTemplateMetadata = (
    operation: OpenAPIV2.OperationObject,
    path: string,
    requestBody: GeneratedRequestBody | undefined,
    parameters: QueryParameter[],
    bodyType?: BodyType
  ): RestTemplateQueryMetadata => {
    const metadata: RestTemplateQueryMetadata = {
      operationId: operation.operationId,
      docsUrl: this.getDocsUrl(operation),
      description: operation.summary || operation.description,
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

  isSupported = async (data: string): Promise<boolean> => {
    try {
      const document: any = await this.parseData(data)
      if (isOpenAPI2(document)) {
        this.document = document
        this.setSecurityHeaders()
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  getUrl = (): URL | undefined => {
    const scheme = this.document.schemes?.includes("https") ? "https" : "http"
    const basePath = this.document.basePath || ""
    const host = this.document.host

    if (!host) {
      return undefined
    }

    const normalizedBasePath = basePath
      ? basePath.startsWith("/")
        ? basePath
        : `/${basePath}`
      : ""
    try {
      return new URL(`${scheme}://${host}${normalizedBasePath}`)
    } catch (_err) {
      return undefined
    }
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
    const name = this.document.info.title || "Swagger Import"
    const rawUrl = this.getUrl()?.href
    const url = rawUrl ? this.convertPathVariables(rawUrl) : undefined
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

  getSecurityHeaders(): string[] {
    return Array.from(new Set(this.securityHeaders.values()))
  }

  getImportSource(): string {
    return "openapi2.0"
  }

  getQueries = async (
    datasourceId: string,
    options?: GetQueriesOptions
  ): Promise<Query[]> => {
    const url = this.getUrl()
    const queries = []
    const filterIds = options?.filterIds

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
        if (!this.isSupportedMethod(methodName)) {
          continue
        }
        const endpointId = this.buildEndpointId(methodName, path)
        if (filterIds && !filterIds.has(endpointId)) {
          continue
        }
        const name = buildEndpointName(operation, methodName, path)
        let queryString = ""
        const headers: Record<string, unknown> = {}
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
        let primaryMimeType: string | undefined
        let requestBody: GeneratedRequestBody | undefined = undefined
        const parameters: QueryParameter[] = []

        if (operation.consumes) {
          primaryMimeType = operation.consumes[0]
          setHeader("Content-Type", primaryMimeType)
        }

        const formDataParams: FormDataParameter[] = []

        // combine the path parameters with the operation parameters
        const operationParams = operation.parameters || []
        const allParams = [...pathParams, ...operationParams]

        for (let param of allParams) {
          if (parameterNotRef(param)) {
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
                formDataParams.push({
                  ...(param as OpenAPIV2.ParameterObject),
                  in: "formData",
                } as FormDataParameter)
                break
              case "body": {
                let bodyParam: OpenAPIV2.InBodyParameterObject =
                  param as OpenAPIV2.InBodyParameterObject
                const schema = bodyParam.schema as OpenAPIV2.SchemaObject
                if (schema) {
                  if (schema.example !== undefined) {
                    requestBody = generateRequestBodyFromExample(
                      schema.example,
                      bodyParam.name || "body"
                    )
                  } else {
                    const generated = generateRequestBodyFromSchema(
                      schema,
                      bodyParam.name || "body"
                    )
                    if (generated !== undefined) {
                      requestBody = generated
                    }
                  }
                }
                break
              }
            }

            // add the parameter if it can be bound in our config
            if (
              !skipParameterBinding &&
              ["query", "header", "path", "formData"].includes(param.in)
            ) {
              const defaultValue =
                param.default !== undefined ? String(param.default) : ""
              parameters.push({
                name: param.name,
                default: defaultValue,
              })
            }
          }
        }

        if (!requestBody && formDataParams.length > 0) {
          const formDataBody =
            buildRequestBodyFromFormDataParameters(formDataParams)
          if (formDataBody) {
            requestBody = formDataBody
            if (!primaryMimeType) {
              primaryMimeType = formDataParams.some(
                param => param.type === "file"
              )
                ? "multipart/form-data"
                : "application/x-www-form-urlencoded"
            }
            if (primaryMimeType) {
              setHeader("Content-Type", primaryMimeType)
            }
          }
        }

        const bodyType = primaryMimeType
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
