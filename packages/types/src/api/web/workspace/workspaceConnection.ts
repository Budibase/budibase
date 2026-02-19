import { Document } from "../../../documents/document"
import { RestTemplateId } from "../../../ui"
import { RestAuthConfig, OAuth2Config } from "../../../documents"

export enum ApiKeyLocation {
  HEADER = "header",
  QUERY = "query",
  // This is a new one, just explicitly mentioned now
  // Should be interpreted as a header["cookie"]
  COOKIE = "cookie",
}

export interface ApiKeyAuthConfig {
  _id: string
  name: string
  type: "apiKey"
  config: {
    location: ApiKeyLocation
    key: string
    value: string
  }
}

export interface OAuth2AuthConfig extends OAuth2Config {
  type: "oauth2"
}

export type WorkspaceAuthConfig =
  | RestAuthConfig
  | ApiKeyAuthConfig
  | OAuth2AuthConfig

export interface WorkspaceConnectionProps {
  headers?: Record<string, string>
  query?: Record<string, string>
  staticVariables?: Record<string, string>
}

export enum WorkspaceConnectionType {
  WORKSPACE_CONNECTION = "workspace_connection",
}

export interface WorkspaceConnection extends Document {
  name: string
  type: WorkspaceConnectionType
  templateId?: RestTemplateId
  templateVersion?: string
  baseUrl?: string

  // Typed auth configs (can have multiple, user selects per query)
  auth: WorkspaceAuthConfig[]
  props: WorkspaceConnectionProps
}

export type WorkspaceConnectionResponse = WorkspaceConnection

export interface FetchWorkspaceConnectionsResponse {
  connections: WorkspaceConnectionResponse[]
}

export interface CreateWorkspaceConnectionRequest {
  name: string
  type: WorkspaceConnectionType
  templateId?: RestTemplateId
  templateVersion?: string
  baseUrl?: string
  auth: WorkspaceAuthConfig[]
  props: WorkspaceConnectionProps
}

export interface CreateWorkspaceConnectionResponse {
  connection: WorkspaceConnectionResponse
}

export interface UpdateWorkspaceConnectionRequest
  extends CreateWorkspaceConnectionRequest {
  _id: string
  _rev: string
}
