import type { AIEndpoints } from "./ai"
import type { AnalyticsEndpoints } from "./analytics"
import type { AppEndpoints } from "./app"
import type { AttachmentEndpoints } from "./attachments"
import type { AuditLogEndpoints } from "./auditLogs"
import type { AuthEndpoints } from "./auth"
import type { AutomationEndpoints } from "./automations"
import type { BackupEndpoints } from "./backups"
import type { ConfigEndpoints } from "./configs"
import type { DatasourceEndpoints } from "./datasources"
import type { EnvironmentVariableEndpoints } from "./environmentVariables"
import type { EventEndpoints } from "./events"
import type { FlagEndpoints } from "./flags"
import type { GroupEndpoints } from "./groups"
import type { LayoutEndpoints } from "./layouts"
import type { LicensingEndpoints } from "./licensing"
import type { LogEndpoints } from "./logs"
import type { MigrationEndpoints } from "./migrations"
import type { OtherEndpoints } from "./other"
import type { PermissionEndpoints } from "./permissions"
import type { PluginEndpoins } from "./plugins"
import type { QueryEndpoints } from "./queries"
import type { RelationshipEndpoints } from "./relationships"
import type { RoleEndpoints } from "./roles"
import type { RouteEndpoints } from "./routes"
import type { RowActionEndpoints } from "./rowActions"
import type { RowEndpoints } from "./rows"
import type { ScreenEndpoints } from "./screens"
import type { SelfEndpoints } from "./self"
import type { TableEndpoints } from "./tables"
import type { TemplateEndpoints } from "./templates"
import type { UserEndpoints } from "./user"
import type { ViewEndpoints } from "./views"
import type { ViewV2Endpoints } from "./viewsV2"

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
  onError?: (error: APIError) => void
  onMigrationDetected?: (migration: string) => void
}

export type APICallConfig<RequestT, ResponseT> = {
  method: HTTPMethod
  url: string
  json: boolean
  external: boolean
  suppressErrors: boolean
  cache: boolean
  body?: RequestT
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
  invalidateCache: () => void
  getAppID: () => string
}

export type APIError = {
  message?: string
  url: string
  method?: HTTPMethod
  json: any
  status: number
  handled: boolean
  suppressErrors: boolean
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
  FlagEndpoints &
  GroupEndpoints &
  LayoutEndpoints &
  LicensingEndpoints &
  LogEndpoints &
  MigrationEndpoints &
  OtherEndpoints &
  PermissionEndpoints &
  PluginEndpoins &
  QueryEndpoints &
  RelationshipEndpoints &
  RoleEndpoints &
  RouteEndpoints &
  RowEndpoints &
  ScreenEndpoints &
  SelfEndpoints &
  TableEndpoints &
  TemplateEndpoints &
  UserEndpoints &
  ViewEndpoints & { rowActions: RowActionEndpoints; viewV2: ViewV2Endpoints }
