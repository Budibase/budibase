import { License } from "@budibase/types"

export interface CachedLicense extends License {
  refreshedAt?: string
}

// Middleware

export interface LicenseMiddlewareOptions {
  checkUsersLimit: boolean
  licensingCheck?: (ctx: any) => boolean
}
