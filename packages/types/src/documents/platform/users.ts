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

/**
 * doc id is a unique SSO provider ID for the user
 */
export interface PlatformUserBySsoId extends Document {
  tenantId: string
  userId: string
  email: string
}

export type PlatformUser =
  | PlatformUserByEmail
  | PlatformUserById
  | PlatformUserBySsoId
