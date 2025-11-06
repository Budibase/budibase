import { BodyType, Query, QueryParameter, QueryVerb } from "@budibase/types"
import { URL } from "url"
import { serialiseRequestBody } from "../utils/requestBody"

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

export abstract class ImportSource {
  abstract isSupported(data: string): Promise<boolean>
  abstract getInfo(): Promise<ImportInfo>
  abstract getQueries(
    datasourceId: string,
    options?: { filterIds?: Set<string> }
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
    explicitBodyType?: BodyType
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
    const requestBody = serialiseRequestBody(body)

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

    const resolvedBodyType = explicitBodyType
      ? explicitBodyType
      : requestBody
        ? BodyType.JSON
        : BodyType.NONE

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
}
