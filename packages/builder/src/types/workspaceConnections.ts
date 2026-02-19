import { WorkspaceConnectionResponse, RestAuthType } from "@budibase/types"

export const AUTH_TYPE_OPTIONS: Array<{
  label: string
  value: RestAuthType
}> = [
  { label: "Basic Auth", value: RestAuthType.BASIC },
  { label: "Bearer Token", value: RestAuthType.BEARER },
  { label: "OAuth2", value: RestAuthType.OAUTH2 },
]

export type ConnectionType =
  | "workspace_connection"
  | "unknown"
  // Legacy
  | "oauth2"
  | "datasource"

export interface UIWorkspaceConnection
  extends Partial<WorkspaceConnectionResponse> {
  name: string
  source: ConnectionType
  sourceId: string
  icon?: { type: "asset" | "icon"; value: string }
  auth?: WorkspaceConnectionResponse["auth"]
}
