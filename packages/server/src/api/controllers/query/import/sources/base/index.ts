import {
  BodyType,
  Query,
  QueryParameter,
  QueryVerb,
  RestTemplateQueryMetadata,
} from "@budibase/types"
import { URL } from "url"
import {
  buildKeyValueRequestBody,
  serialiseRequestBody,
} from "../utils/requestBody"

export interface ImportInfo {
  name: string
  url?: string
  docsUrl?: string
  endpoints: ImportEndpoint[]
}

export interface ImportEndpoint {
  id: string
  name: string
  method?: string
  path?: string
  description?: string
  queryVerb?: QueryVerb
}

enum MethodToVerb {
  get = "read",
  post = "create",
  put = "update",
  patch = "patch",
  delete = "delete",
}

export interface GetQueriesOptions {
  filterIds?: Set<string>
  staticVariables?: Record<string, string>
}

export abstract class ImportSource {
  abstract isSupported(data: string): Promise<boolean>
  abstract getInfo(): Promise<ImportInfo>
  abstract getQueries(
    datasourceId: string,
    options?: GetQueriesOptions
  ): Promise<Query[]>
  abstract getImportSource(): string

  protected buildEndpointId = (method: string, path: string): string => {
    const normalized = this.normalizeMethod(method) || method.toLowerCase()
    return `${normalized}::${path}`
  }

  protected convertPathVariables = (value: string): string => {
    if (!value) {
      return value
    }

    return value.replace(/\{([^{}]+)\}/g, (_match, token) => {
      const variable = token.trim()
      const sanitized = variable.match(/^[A-Za-z0-9._-]+/)
      const name = sanitized ? sanitized[0] : variable
      return `{{${name}}}`
    })
  }

  protected normalizeMethod = (method?: string): string | undefined => {
    if (!method) {
      return undefined
    }
    return method.toLowerCase()
  }

  protected isSupportedMethod = (method: string): boolean => {
    const normalized = this.normalizeMethod(method)
    if (!normalized) {
      return false
    }
    return Object.prototype.hasOwnProperty.call(MethodToVerb, normalized)
  }

  protected methodHasRequestBody = (method: string): boolean => {
    const normalized = this.normalizeMethod(method)
    if (!normalized) {
      return false
    }
    return ["post", "put", "patch"].includes(normalized)
  }

  protected bodyTypeFromMimeType = (mimeType?: string): BodyType => {
    if (!mimeType) {
      return BodyType.JSON
    }

    const normalized = mimeType.split(";")[0].trim().toLowerCase()

    if (normalized === "application/x-www-form-urlencoded") {
      return BodyType.ENCODED
    }

    if (normalized === "multipart/form-data") {
      return BodyType.FORM_DATA
    }

    if (normalized === "text/plain" || normalized.startsWith("text/")) {
      return BodyType.TEXT
    }

    if (
      normalized === "application/xml" ||
      normalized === "text/xml" ||
      normalized.endsWith("+xml")
    ) {
      return BodyType.XML
    }

    if (normalized.endsWith("+json") || normalized === "application/json") {
      return BodyType.JSON
    }

    return BodyType.JSON
  }

  constructQuery = (
    datasourceId: string,
    name: string,
    method: string,
    path: string,
    url: URL | string | undefined,
    queryString: string,
    headers: object = {},
    parameters: QueryParameter[] = [],
    body: unknown = undefined,
    bodyBindings: Record<string, string> = {},
    explicitBodyType?: BodyType,
    restTemplateMetadata?: RestTemplateQueryMetadata
  ): Query => {
    const readable = true
    const queryVerb = this.verbFromMethod(method)
    const transformer = "return data"
    const schema = {}
    path = this.processPath(path)
    if (url) {
      if (typeof url === "string") {
        let base = this.convertPathVariables(url)
        if (base.endsWith("/")) {
          base = base.slice(0, -1)
        }
        path = path ? `${base}/${path}` : base
      } else {
        let href = url.href
        if (href.endsWith("/")) {
          href = href.slice(0, -1)
        }
        path = path ? `${href}/${path}` : href
      }
    }
    queryString = this.processQuery(queryString)
    const combinedParameters = [...parameters]
    for (const [name, defaultValue] of Object.entries(bodyBindings)) {
      if (!name) {
        continue
      }
      const existing = combinedParameters.find(
        parameter => parameter.name === name
      )
      if (existing) {
        continue
      }
      combinedParameters.push({ name, default: defaultValue })
    }

    let requestBody: string | Record<string, string> | undefined
    let resolvedBodyType: BodyType

    const isKeyValueBodyType = (type: BodyType | undefined) => {
      return type === BodyType.FORM_DATA || type === BodyType.ENCODED
    }

    if (isKeyValueBodyType(explicitBodyType)) {
      requestBody = buildKeyValueRequestBody(body)
      if ((!requestBody || Object.keys(requestBody).length === 0) && body) {
        requestBody = Object.keys(bodyBindings).reduce<Record<string, string>>(
          (acc, key) => {
            acc[key] = `{{ ${key} }}`
            return acc
          },
          {}
        )
      }
      resolvedBodyType = explicitBodyType as BodyType
    } else {
      requestBody = serialiseRequestBody(body)
      resolvedBodyType = explicitBodyType
        ? (explicitBodyType as BodyType)
        : requestBody
          ? BodyType.JSON
          : BodyType.NONE
    }

    if (
      (!requestBody ||
        (typeof requestBody === "object" &&
          Object.keys(requestBody).length === 0)) &&
      isKeyValueBodyType(explicitBodyType)
    ) {
      requestBody = undefined
    }

    if (requestBody === undefined) {
      resolvedBodyType = BodyType.NONE
    }

    const query: Query = {
      datasourceId,
      name,
      parameters: combinedParameters,
      fields: {
        headers,
        queryString,
        path,
        requestBody,
        bodyType: resolvedBodyType,
      },
      transformer,
      schema,
      readable,
      queryVerb,
    }

    if (restTemplateMetadata) {
      query.restTemplateMetadata = restTemplateMetadata
    }

    return query
  }

  verbFromMethod = (method: string): QueryVerb => {
    const normalized = this.normalizeMethod(method)
    if (!normalized) {
      throw new Error(`Unsupported method: ${method}`)
    }
    return MethodToVerb[normalized as keyof typeof MethodToVerb]
  }

  processPath = (path: string): string => {
    if (path?.startsWith("/")) {
      path = path.substring(1)
    }

    path = this.convertPathVariables(path)

    return path
  }

  processQuery = (queryString: string): string => {
    if (queryString?.startsWith("?")) {
      return queryString.substring(1)
    }

    return queryString
  }

  protected buildDefaultBindings(
    parameters: QueryParameter[],
    extraBindings?: Record<string, string>
  ): Record<string, string> | undefined {
    const defaults: Record<string, string> = {}

    for (const parameter of parameters) {
      if (!parameter?.name) {
        continue
      }
      defaults[parameter.name] = `${parameter.default ?? ""}`
    }

    if (extraBindings) {
      for (const [key, value] of Object.entries(extraBindings)) {
        if (!key) {
          continue
        }
        defaults[key] = value
      }
    }

    return Object.keys(defaults).length ? defaults : undefined
  }
}
