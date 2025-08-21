import { Document } from "../document"

/**
 * doc id is user email
 */
export interface PlatformUserByEmail extends Document {
  /**
   * @deprecated - multi-tenancy means that there is a one email to many tenant ids relationship
   */
  tenantId: string
  userId: string
}

/**
 * doc id is userId
 */
export interface PlatformUserById extends Document {
  tenantId: string
  email?: string
  ssoId?: string
}

/**
 * doc id is a unique SSO provider ID for the user
 */
export interface PlatformUserBySsoId extends Document {
  tenantId: string
  userId: string
  email: string
  ssoId?: string
}

export type PlatformUser =
  | PlatformUserByEmail
  | PlatformUserById
  | PlatformUserBySsoId
