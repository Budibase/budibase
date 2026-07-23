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

  // first time creation
  if (!dbUser) {
    const assignments = pendingInvite
      ? users.deriveUserFieldsFromInvite(pendingInvite.info)
      : { roles: {} }
    // setup a blank user using the third party id, applying any access
    // granted by a matching pending invite
    dbUser = {
      _id: userId,
      email: details.email,
      tenantId: pendingInvite?.info.tenantId || context.getTenantId(),
      ...assignments,
    }
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

  if (pendingInvite) {
    await consumePendingInvite(pendingInvite, ssoUser)
  }

  return done(null, ssoUser)
}

async function consumePendingInvite(invite: InviteWithCode, user: SSOUser) {
  await locks.doWithLock(
    {
      type: LockType.AUTO_EXTEND,
      name: LockName.PROCESS_USER_INVITE,
      resource: invite.code,
      systemLock: true,
    },
    async () => {
      try {
        // re-validate under lock in case another login already consumed it
        await cache.invite.getCode(invite.code, invite.info.tenantId)
      } catch {
        return
      }
      await cache.invite.deleteCode(invite.code, invite.info.tenantId)
      await events.user.inviteAccepted(user)
    }
  )
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
