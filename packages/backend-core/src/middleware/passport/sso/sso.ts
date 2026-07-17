import { generateGlobalUserID } from "../../../db"
import { authError } from "../utils"
import * as users from "../../../users"
import * as context from "../../../context"
import * as crypto from "crypto"
import {
  SaveSSOUserFunction,
  SSOAuthDetails,
  SSOIdentity,
  SSOUser,
  User,
  UserSSO,
} from "@budibase/types"

// no-op function for user save
// - this allows datasource auth and access token refresh to work correctly
// - prefer no-op over an optional argument to ensure function is provided to login flows
export const ssoSaveUserNoOp: SaveSSOUserFunction = (user: SSOUser) =>
  Promise.resolve(user)

const buildIdentity = (details: SSOAuthDetails): SSOIdentity => ({
  provider: details.provider,
  providerType: details.providerType,
  userId: details.userId,
})

type StoredUser = User & Partial<UserSSO>

const identitiesMatch = (left: SSOIdentity, right: SSOIdentity) =>
  left.provider === right.provider &&
  left.providerType === right.providerType &&
  left.userId === right.userId

const hasIdentity = (user: StoredUser, identity: SSOIdentity) =>
  user.ssoIdentities?.some(existing => identitiesMatch(existing, identity)) ===
  true

const canMigrateLegacyIdentity = (user: StoredUser, identity: SSOIdentity) =>
  !user.ssoIdentities?.length &&
  user.provider === identity.provider &&
  user.providerType === identity.providerType

const generateSSOUserID = (identity: SSOIdentity) => {
  const identityHash = crypto
    .createHash("sha256")
    .update(
      [identity.providerType, identity.provider, identity.userId].join("\0")
    )
    .digest("hex")
  return generateGlobalUserID(identityHash)
}

const getUserById = async (userId: string) => {
  try {
    return await users.getById(userId)
  } catch (err: any) {
    if (err.status === 404) {
      return undefined
    }
    throw err
  }
}

/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
export async function authenticate(
  details: SSOAuthDetails,
  requireLocalAccount = true,
  done: any,
  saveUserFn: SaveSSOUserFunction,
  allowUnverifiedEmailLinking = false
) {
  if (!saveUserFn) {
    throw new Error("Save user function must be provided")
  }
  if (!details.userId) {
    return authError(done, "sso user id required")
  }
  if (!details.email) {
    return authError(done, "sso user email required")
  }

  const identity = buildIdentity(details)
  const userId = generateSSOUserID(identity)

  let dbUser: StoredUser | undefined

  try {
    // New SSO users use an issuer-scoped deterministic id. Existing local
    // users are resolved through their persisted SSO identity.
    dbUser = await getUserById(userId)
    if (!dbUser) {
      dbUser = await users.getGlobalUserBySSOIdentity(identity)
    }

    // Users created before SSO identities were persisted were keyed by the
    // provider subject alone. Only accept that legacy key when its stored
    // provider still matches the authenticating issuer.
    if (!dbUser) {
      const legacyUser = await getUserById(generateGlobalUserID(details.userId))
      if (legacyUser && canMigrateLegacyIdentity(legacyUser, identity)) {
        dbUser = legacyUser
      }
    }
  } catch (err: any) {
    return authError(
      done,
      "Unexpected error when retrieving existing user",
      err
    )
  }

  if (dbUser && !hasIdentity(dbUser, identity)) {
    if (!canMigrateLegacyIdentity(dbUser, identity)) {
      return authError(done, "SSO identity does not match existing user")
    }
    dbUser.ssoIdentities = [identity]
  }

  if (!dbUser) {
    let emailUser: StoredUser | undefined
    try {
      emailUser = await users.getGlobalUserByEmail(details.email)
    } catch (err: any) {
      return authError(
        done,
        "Unexpected error when retrieving existing user",
        err
      )
    }

    if (emailUser) {
      const canLink =
        hasIdentity(emailUser, identity) ||
        details.emailVerified === true ||
        allowUnverifiedEmailLinking ||
        canMigrateLegacyIdentity(emailUser, identity)

      if (!canLink) {
        return authError(done, "SSO identity cannot be linked to existing user")
      }

      dbUser = emailUser
    }
  }

  // exit early if there is still no user and auto creation is disabled
  if (!dbUser && requireLocalAccount) {
    return authError(
      done,
      "Email does not yet exist. You must set up your local budibase account first."
    )
  }

  // first time creation
  if (!dbUser) {
    // setup a blank user using the third party id
    dbUser = {
      _id: userId,
      email: details.email,
      roles: {},
      tenantId: context.getTenantId(),
      ssoIdentities: [identity],
    }
  } else if (!hasIdentity(dbUser, identity)) {
    dbUser.ssoIdentities = [...(dbUser.ssoIdentities || []), identity]
  }

  let ssoUser = await syncUser(dbUser, details)
  // never prompt for password reset
  ssoUser.forceResetPassword = false

  try {
    // don't try to re-save any existing password
    delete ssoUser.password
    // create or sync the user
    ssoUser = (await saveUserFn(ssoUser, {
      hashPassword: false,
      requirePassword: false,
    })) as SSOUser
  } catch (err: any) {
    return authError(done, "Error saving user", err)
  }

  return done(null, ssoUser)
}

/**
 * @returns a user that has been sync'd with third party information
 */
async function syncUser(user: User, details: SSOAuthDetails): Promise<SSOUser> {
  let firstName
  let lastName
  let oauth2

  if (details.profile) {
    const profile = details.profile

    if (profile.name) {
      const name = profile.name
      // first name
      if (name.givenName) {
        firstName = name.givenName
      }
      // last name
      if (name.familyName) {
        lastName = name.familyName
      }
    }
  }

  // oauth tokens for future use
  if (details.oauth2) {
    oauth2 = {
      ...details.oauth2,
    }
  }

  return {
    ...user,
    provider: details.provider,
    providerType: details.providerType,
    firstName,
    lastName,
    oauth2,
  }
}
