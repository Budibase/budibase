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
import { GroupEndpoints } from "./groups"
import { LayoutEndpoints } from "./layouts"
import { LicensingEndpoints } from "./licensing"
import { LogEndpoints } from "./logs"
import { MigrationEndpoints } from "./migrations"
import { OtherEndpoints } from "./other"
import { PermissionEndpoints } from "./permissions"
import { PluginEndpoins } from "./plugins"
import { QueryEndpoints } from "./queries"
import { RelationshipEndpoints } from "./relationships"
import { RoleEndpoints } from "./roles"
import { RouteEndpoints } from "./routes"
import { RowActionEndpoints } from "./rowActions"
import { RowEndpoints } from "./rows"
import { ScreenEndpoints } from "./screens"
import { SelfEndpoints } from "./self"
import { TableEndpoints } from "./tables"
import { TemplateEndpoints } from "./templates"
import { UserEndpoints } from "./user"
import { ViewEndpoints } from "./views"
import { ViewV2Endpoints } from "./viewsV2"

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
