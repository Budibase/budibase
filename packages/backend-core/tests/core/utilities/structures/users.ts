import {
  AdminUser,
  BuilderUser,
  SSOAuthDetails,
  SSOUser,
} from "@budibase/types"
import { user } from "./shared"
import { authDetails } from "./sso"

export { user, newEmail } from "./shared"

export const adminUser = (userProps?: any): AdminUser => {
  return {
    ...user(userProps),
    admin: {
      global: true,
    },
    builder: {
      global: true,
    },
  }
}

export const builderUser = (userProps?: any): BuilderUser => {
  return {
    ...user(userProps),
    builder: {
      global: true,
    },
  }
}

export function ssoUser(
  opts: { user?: any; details?: SSOAuthDetails } = {}
): SSOUser {
  const base = user(opts.user)
  delete base.password

  if (!opts.details) {
    opts.details = authDetails(base)
  }

  return {
    ...base,
    forceResetPassword: false,
    oauth2: opts.details?.oauth2,
    provider: opts.details?.provider!,
    providerType: opts.details?.providerType!,
    thirdPartyProfile: {
      email: base.email,
      picture: base.pictureUrl,
    },
  }
}
