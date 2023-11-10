import {
  AdminUser,
  AdminOnlyUser,
  BuilderUser,
  SSOAuthDetails,
  SSOUser,
  User,
} from "@budibase/types"
import { authDetails } from "./sso"
import { uuid } from "./common"
import { generator } from "./generator"
import { tenant } from "."

export const newEmail = () => {
  return `${uuid()}@test.com`
}

export const user = (userProps?: Partial<Omit<User, "userId">>): User => {
  const userId = userProps?._id
  return {
    _id: userId,
    userId,
    email: newEmail(),
    password: "test",
    roles: { app_test: "admin" },
    firstName: generator.first(),
    lastName: generator.last(),
    pictureUrl: "http://test.com",
    tenantId: tenant.id(),
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

export const adminOnlyUser = (userProps?: any): AdminOnlyUser => {
  return {
    ...user(userProps),
    admin: {
      global: true,
    },
  }
}

export const builderUser = (userProps?: Partial<User>): BuilderUser => {
  return {
    ...user(userProps),
    builder: {
      global: true,
    },
  }
}

export const appBuilderUser = (appId: string, userProps?: any): BuilderUser => {
  return {
    ...user(userProps),
    builder: {
      apps: [appId],
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
