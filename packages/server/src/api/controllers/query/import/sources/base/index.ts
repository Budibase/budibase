import { Query, QueryParameter } from "../../../../../../definitions/datasource"
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

  constructQuery = (
    datasourceId: string,
    name: string,
    method: string,
    path: string,
    url: URL | null,
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
      path = `${url.origin}/${path}`
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
    const verb = (<any>MethodToVerb)[method]
    if (!verb) {
      throw new Error(`Unsupported method: ${method}`)
    }
    return verb
  }

  processPath = (path: string): string => {
    if (path?.startsWith("/")) {
      path = path.substring(1)
    }

    // add extra braces around params for binding
    path = path.replace(/[{]/g, "{{")
    path = path.replace(/[}]/g, "}}")

    return path
  }

  processQuery = (queryString: string): string => {
    if (queryString?.startsWith("?")) {
      return queryString.substring(1)
    }

    return queryString
  }
}
