import type { Document } from "../../"

export interface SlackAppConfig extends Document {
  tenantId: string
  configToken: string
  refreshToken?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
