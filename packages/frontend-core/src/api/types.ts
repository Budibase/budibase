export enum HTTPMethod {
  POST = "POST",
  PATCH = "PATCH",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type APIClientConfig = {
  enableCaching?: boolean
  attachHeaders?: Function
  onError?: Function
  onMigrationDetected?: Function
}

export type APICallConfig = {
  method: HTTPMethod
  url: string
  json: boolean
  external: boolean
  suppressErrors: boolean
  cache: boolean
  body?: any
  parseResponse?: <T>(response: Response) => Promise<T>
}

export type APICallParams = Pick<APICallConfig, "url"> & Partial<APICallConfig>

export type APIClient = {
  post: <T>(params: APICallParams) => Promise<T>
  get: <T>(params: APICallParams) => Promise<T>
  put: <T>(params: APICallParams) => Promise<T>
  delete: <T>(params: APICallParams) => Promise<T>
  patch: <T>(params: APICallParams) => Promise<T>
  [key: string]: any
}
