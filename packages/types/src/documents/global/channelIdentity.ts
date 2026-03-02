import { Document } from "../../"

export type ChannelIdentityProvider = "discord" | "msteams"

export interface ChannelIdentity extends Document {
  provider: ChannelIdentityProvider
  externalUserId: string
  tenantId?: string
  globalUserId: string
  displayName?: string
  email?: string
  isActive?: boolean
}
