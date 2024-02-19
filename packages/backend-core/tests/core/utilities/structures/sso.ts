import {
  ConfigType,
  GoogleConfig,
  GoogleInnerConfig,
  JwtClaims,
  OAuth2,
  OIDCInnerConfig,
  OIDCWellKnownConfig,
  SSOAuthDetails,
  SSOProfile,
  SSOProviderType,
  User,
} from "@budibase/types"
import { generator } from "./generator"
import { email, uuid } from "./common"
import * as users from "./users"
import sample from "lodash/sample"

export function OAuth(): OAuth2 {
  return {
    refreshToken: generator.string(),
    accessToken: generator.string(),
  }
}

export function authDetails(userDoc?: User): SSOAuthDetails {
  if (!userDoc) {
    userDoc = users.user()
  }

  const userId = userDoc._id || uuid()
  const provider = generator.string()

  const profile = ssoProfile(userDoc)
  profile.provider = provider
  profile.id = userId

  return {
    email: userDoc.email,
    oauth2: OAuth(),
    profile,
    provider,
    providerType: providerType(),
    userId,
  }
}

export function providerType(): SSOProviderType {
  return sample(Object.values(SSOProviderType)) as SSOProviderType
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
      picture: "http://example.com",
    },
    provider: generator.string(),
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

export function googleConfigDoc(): GoogleConfig {
  return {
    _id: "config_google",
    type: ConfigType.GOOGLE,
    config: googleConfig(),
  }
}
