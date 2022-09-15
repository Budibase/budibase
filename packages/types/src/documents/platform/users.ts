import { Document } from "../document"

/**
 * doc id is user email
 */
export interface PlatformUserByEmail extends Document {
  tenantId: string
  userId: string
}

/**
 * doc id is userId
 */
export interface PlatformUserById extends Document {
  tenantId: string
}

export type PlatformUser = PlatformUserByEmail | PlatformUserById
