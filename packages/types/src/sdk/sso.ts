import {
  OAuth2,
  SSOProfileJson,
  SSOProviderType,
  SSOUser,
  User,
} from "../documents"
import { SaveUserOpts } from "./user"

export interface JwtClaims {
  preferred_username?: string
  email?: string
  email_verified?: boolean
}

export interface SSOAuthDetails {
  oauth2: OAuth2
  provider: string
  providerType: SSOProviderType
  userId: string
  email?: string
  emailVerified?: boolean
  profile?: SSOProfile
}

export interface SSOProfile {
  id: string
  name?: {
    givenName?: string
    familyName?: string
  }
  _json: SSOProfileJson
  provider?: string
}

export type SaveSSOUserFunction = (
  user: SSOUser,
  opts: SaveUserOpts
) => Promise<User>
