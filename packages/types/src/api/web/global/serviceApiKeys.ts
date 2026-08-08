import {
  ServiceApiKeyAccessLevel,
  ServiceApiKeySummary,
  ServiceApiKeyWorkspaceAccess,
} from "../../../documents"

export interface CreateServiceApiKeyRequest {
  name: string
  accessLevel: ServiceApiKeyAccessLevel
  workspaceAccess: ServiceApiKeyWorkspaceAccess
  tenantAdmin: boolean
}

export interface CreateServiceApiKeyResponse {
  apiKey: string
  serviceApiKey: ServiceApiKeySummary
}

export interface FetchServiceApiKeysResponse {
  serviceApiKeys: ServiceApiKeySummary[]
}
