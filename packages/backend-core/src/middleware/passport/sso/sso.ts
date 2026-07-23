import { generateGlobalUserID } from "../../../db"
import { authError } from "../utils"
import * as users from "../../../users"
import * as context from "../../../context"
import * as cache from "../../../cache"
import * as events from "../../../events"
import * as locks from "../../../redis/redlockImpl"
import {
  InviteWithCode,
  LockName,
  LockType,
  SaveSSOUserFunction,
  SSOAuthDetails,
  SSOUser,
  User,
} from "@budibase/types"

// no-op function for user save
// - this allows datasource auth and access token refresh to work correctly
// - prefer no-op over an optional argument to ensure function is provided to login flows
export const ssoSaveUserNoOp: SaveSSOUserFunction = (user: SSOUser) =>
  Promise.resolve(user)

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

  // use the third party id
  const userId = generateGlobalUserID(details.userId)

  let dbUser: User | undefined

  // try to load by id
  try {
    dbUser = await users.getById(userId)
  } catch (err: any) {
    // abort when not 404 error
    if (!err.status || err.status !== 404) {
      return authError(
        done,
        "Unexpected error when retrieving existing user",
        err
      )
    }
  }

  // fallback to loading by email - only when the email has been verified by the
  // identity provider.
  if (!dbUser && (details.emailVerified || allowUnverifiedEmailLinking)) {
    dbUser = await users.getGlobalUserByEmail(details.email)
  }

  let pendingInvite: InviteWithCode | undefined
  if (!dbUser) {
    const invites = await cache.invite.getExistingInvites([details.email])
    pendingInvite = invites[0]
  }

  // exit early if there is still no user/invite and auto creation is disabled
  if (!dbUser && !pendingInvite && requireLocalAccount) {
    return authError(
      done,
      "Email does not yet exist. You must set up your local budibase account first."
    )
  }

  let ssoUser: SSOUser
  try {
    if (pendingInvite) {
      ssoUser = await claimInviteAndSaveUser(
        pendingInvite,
        userId,
        details,
        saveUserFn
      )
    } else {
      if (!dbUser) {
        // first time creation - no invite or existing account to draw from
        dbUser = {
          _id: userId,
          email: details.email,
          tenantId: context.getTenantId(),
          roles: {},
        }
      }
      ssoUser = await syncAndSaveUser(dbUser, details, saveUserFn)
    }
  } catch (err: any) {
    return authError(done, "Error saving user", err)
  }

  return done(null, ssoUser)
}

async function syncAndSaveUser(
  user: User,
  details: SSOAuthDetails,
  saveUserFn: SaveSSOUserFunction
): Promise<SSOUser> {
  const ssoUser = await syncUser(user, details)
  // never prompt for password reset
  ssoUser.forceResetPassword = false
  // don't try to re-save any existing password
  delete ssoUser.password
  // create or sync the user
  return (await saveUserFn(ssoUser, {
    hashPassword: false,
    requirePassword: false,
  })) as SSOUser
}

async function claimInviteAndSaveUser(
  invite: InviteWithCode,
  userId: string,
  details: SSOAuthDetails,
  saveUserFn: SaveSSOUserFunction
): Promise<SSOUser> {
  const { result } = await locks.doWithLock(
    {
      type: LockType.AUTO_EXTEND,
      name: LockName.PROCESS_USER_INVITE,
      resource: invite.code,
      systemLock: true,
    },
    async () => {
      try {
        await cache.invite.getCode(invite.code, invite.info.tenantId)
      } catch (err: any) {
        // could be a concurrent claim by this same identity, or an
        // expired/revoked/unreadable invite - only reuse if positively
        // confirmed, otherwise fail closed
        let concurrentUser: User | undefined
        try {
          concurrentUser = await users.getById(userId)
        } catch (getByIdErr: any) {
          if (!getByIdErr.status || getByIdErr.status !== 404) {
            throw getByIdErr
          }
        }
        if (!concurrentUser) {
          throw err
        }
        return await syncAndSaveUser(concurrentUser, details, saveUserFn)
      }

      // set up a blank user using the third party id, applying any access
      // granted by the matching pending invite
      const user: User = {
        _id: userId,
        email: details.email!,
        tenantId: invite.info.tenantId || context.getTenantId(),
        ...users.deriveUserFieldsFromInvite(invite.info),
      }

      const ssoUser = await syncAndSaveUser(user, details, saveUserFn)

      await cache.invite.deleteCode(invite.code, invite.info.tenantId)
      await events.user.inviteAccepted(ssoUser)

      return ssoUser
    }
  )
  return result
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
