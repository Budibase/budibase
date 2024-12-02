import { AIEndpoints } from "./ai"
import { AnalyticsEndpoints } from "./analytics"
import { AppEndpoints } from "./app"
import { AttachmentEndpoints } from "./attachments"
import { AuditLogEndpoints } from "./auditLogs"
import { AuthEndpoints } from "./auth"
import { AutomationEndpoints } from "./automations"
import { BackupEndpoints } from "./backups"
import { ConfigEndpoints } from "./configs"
import { DatasourceEndpoints } from "./datasources"
import { EnvironmentVariableEndpoints } from "./environmentVariables"
import { EventEndpoints } from "./events"
import { FlagEndpoints } from "./flags"

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

export type APICallConfig<RequestT = null, ResponseT = void> = {
  method: HTTPMethod
  url: string
  body: RequestT
  json: boolean
  external: boolean
  suppressErrors: boolean
  cache: boolean
  parseResponse?: (response: Response) => Promise<ResponseT> | ResponseT
}

export type APICallParams<
  RequestT = null,
  ResponseT = void
> = RequestT extends null
  ? Pick<APICallConfig<RequestT, ResponseT>, "url"> &
      Partial<APICallConfig<RequestT, ResponseT>>
  : Pick<APICallConfig<RequestT, ResponseT>, "url" | "body"> &
      Partial<APICallConfig<RequestT, ResponseT>>

export type BaseAPIClient = {
  post: <RequestT = null, ResponseT = void>(
    params: APICallParams<RequestT, ResponseT>
  ) => Promise<ResponseT>
  get: <ResponseT = void>(
    params: APICallParams<undefined | null, ResponseT>
  ) => Promise<ResponseT>
  put: <RequestT = null, ResponseT = void>(
    params: APICallParams<RequestT, ResponseT>
  ) => Promise<ResponseT>
  delete: <RequestT = null, ResponseT = void>(
    params: APICallParams<RequestT, ResponseT>
  ) => Promise<ResponseT>
  patch: <RequestT = null, ResponseT = void>(
    params: APICallParams<RequestT, ResponseT>
  ) => Promise<ResponseT>
  error: (message: string) => void
  invalidateCache: () => void
  getAppID: () => string
}

export type APIClient = BaseAPIClient &
  AIEndpoints &
  AnalyticsEndpoints &
  AppEndpoints &
  AttachmentEndpoints &
  AuditLogEndpoints &
  AuthEndpoints &
  AutomationEndpoints &
  BackupEndpoints &
  ConfigEndpoints &
  DatasourceEndpoints &
  EnvironmentVariableEndpoints &
  EventEndpoints &
  FlagEndpoints
