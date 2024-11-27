import { AIEndpoints } from "./ai"
import { AnalyticsEndpoints } from "./analytics"
import { AppEndpoints } from "./app"

export enum HTTPMethod {
  POST = "POST",
  PATCH = "PATCH",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type Headers = Record<string, string>

export type APIClientConfig = {
  enableCaching?: boolean
  attachHeaders?: (headers: Headers) => void
  onError?: (error: any) => void
  onMigrationDetected?: (migration: string) => void
}

export type APICallConfig = {
  method: HTTPMethod
  url: string
  json: boolean
  external: boolean
  suppressErrors: boolean
  cache: boolean
  body?: any
  parseResponse?: <T>(response: Response) => Promise<T> | T
}

export type APICallParams = Pick<APICallConfig, "url"> & Partial<APICallConfig>

export type BaseAPIClient = {
  post: <T>(params: APICallParams) => Promise<T>
  get: <T>(params: APICallParams) => Promise<T>
  put: <T>(params: APICallParams) => Promise<T>
  delete: <T>(params: APICallParams) => Promise<T>
  patch: <T>(params: APICallParams) => Promise<T>
  error: (message: string) => void
  invalidateCache: () => void
  getAppID: () => string
}

export type APIClient = BaseAPIClient &
  AIEndpoints &
  AnalyticsEndpoints &
  AppEndpoints & { [key: string]: any }
