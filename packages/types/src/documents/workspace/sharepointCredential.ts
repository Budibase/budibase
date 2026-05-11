import type { Document } from "../document"

export interface DelegatedOAuthCredentialDoc extends Document {
  datasourceId: string
  authConfigId: string
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
}
