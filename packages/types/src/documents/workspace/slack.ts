import type { Document } from "../document"

export interface SlackAppConfig extends Document {
  configToken: string
  refreshToken?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
