import { type UserSSO } from "@budibase/types"

interface SensitiveUserFields extends Partial<UserSSO> {
  password?: string
  thirdPartyProfile?: object
  ssoId?: string
  forceResetPassword?: boolean
}

export function stripSensitiveUserFields<T extends SensitiveUserFields>(
  user: T
): T {
  delete user.password
  delete user.oauth2
  delete user.provider
  delete user.providerType
  delete user.profile
  delete user.thirdPartyProfile
  delete user.ssoId
  delete user.forceResetPassword
  return user
}
