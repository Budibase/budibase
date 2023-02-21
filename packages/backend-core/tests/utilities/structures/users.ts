import { generator } from "../"
import {
  AdminUser,
  BuilderUser,
  SSOAuthDetails,
  SSOUser,
  User,
} from "@budibase/types"
import { v4 as uuid } from "uuid"
import * as sso from "./sso"

export const newEmail = () => {
  return `${uuid()}@test.com`
}

export const user = (userProps?: any): User => {
  return {
    email: newEmail(),
    password: "test",
    roles: { app_test: "admin" },
    firstName: generator.first(),
    lastName: generator.last(),
    pictureUrl: "http://test.com",
    ...userProps,
  }
}

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
    opts.details = sso.authDetails(base)
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
