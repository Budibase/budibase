import { Document } from "../document"

export enum ServiceApiKeyAccessLevel {
  READ_ONLY = "read_only",
  READ_WRITE = "read_write",
}

export enum ServiceApiKeyStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

export type ServiceApiKeyWorkspaceAccess =
  | { type: "all" }
  | { type: "selected"; workspaceIds: string[] }

export interface ServiceApiKeyDoc extends Document {
  name: string
  secretHash?: string
  accessLevel: ServiceApiKeyAccessLevel
  workspaceAccess: ServiceApiKeyWorkspaceAccess
  tenantAdmin: boolean
  status: ServiceApiKeyStatus
  createdAt: string
  createdBy: string
  revokedAt?: string
  revokedBy?: string
}

export type ServiceApiKeySummary = Omit<ServiceApiKeyDoc, "secretHash">
