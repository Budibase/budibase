import { Query, QueryParameter } from "@budibase/types"
import { URL } from "url"

export interface ImportInfo {
  name: string
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
  abstract getQueries(datasourceId: string): Promise<Query[]>
  abstract getImportSource(): string

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

  constructQuery = (
    datasourceId: string,
    name: string,
    method: string,
    path: string,
    url: URL | string | undefined,
    queryString: string,
    headers: object = {},
    parameters: QueryParameter[] = [],
    body: object | undefined = undefined
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
    const requestBody = JSON.stringify(body, null, 2)

    const query: Query = {
      datasourceId,
      name,
      parameters,
      fields: {
        headers,
        queryString,
        path,
        requestBody,
      },
      transformer,
      schema,
      readable,
      queryVerb,
    }

    return query
  }

  verbFromMethod = (method: string) => {
    const normalized = this.normalizeMethod(method)
    if (!normalized) {
      throw new Error(`Unsupported method: ${method}`)
    }
    const verb = (MethodToVerb as Record<string, string>)[normalized]
    if (!verb) {
      throw new Error(`Unsupported method: ${method}`)
    }
    return verb
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
