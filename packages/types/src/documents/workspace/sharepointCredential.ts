import type { Document } from "../document"

export interface DelegatedOAuthCredentialDoc extends Document {
  authConfigId: string
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
}
