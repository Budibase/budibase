import {
  GoogleInnerConfig,
  JwtClaims,
  OIDCInnerConfig,
  OIDCWellKnownConfig,
  SSOAuthDetails,
  SSOProfile,
  SSOProviderType,
  User,
} from "@budibase/types"
import { uuid, generator, users, email } from "./index"
import _ from "lodash"

export function providerType(): SSOProviderType {
  return _.sample(Object.values(SSOProviderType)) as SSOProviderType
}

export function ssoProfile(user?: User): SSOProfile {
  if (!user) {
    user = users.user()
  }
  return {
    id: user._id!,
    name: {
      givenName: user.firstName,
      familyName: user.lastName,
    },
    _json: {
      email: user.email,
      picture: "http://test.com",
    },
    provider: generator.string(),
  }
}

export function authDetails(user?: User): SSOAuthDetails {
  if (!user) {
    user = users.user()
  }

  const userId = user._id || uuid()
  const provider = generator.string()

  const profile = ssoProfile(user)
  profile.provider = provider
  profile.id = userId

  return {
    email: user.email,
    oauth2: {
      refreshToken: generator.string(),
      accessToken: generator.string(),
    },
    profile,
    provider,
    providerType: providerType(),
    userId,
  }
}

// OIDC

export function oidcConfig(): OIDCInnerConfig {
  return {
    uuid: uuid(),
    activated: true,
    logo: "",
    name: generator.string(),
    configUrl: "http://someconfigurl",
    clientID: generator.string(),
    clientSecret: generator.string(),
    scopes: [],
  }
}

// response from .well-known/openid-configuration
export function oidcWellKnownConfig(): OIDCWellKnownConfig {
  return {
    issuer: generator.string(),
    authorization_endpoint: generator.url(),
    token_endpoint: generator.url(),
    userinfo_endpoint: generator.url(),
  }
}

export function jwtClaims(): JwtClaims {
  return {
    email: email(),
    preferred_username: email(),
  }
}

// GOOGLE

export function googleConfig(): GoogleInnerConfig {
  return {
    activated: true,
    clientID: generator.string(),
    clientSecret: generator.string(),
  }
}
