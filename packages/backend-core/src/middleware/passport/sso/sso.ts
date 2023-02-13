import { generateGlobalUserID } from "../../../db"
import { authError } from "../utils"
import * as users from "../../../users"
import * as context from "../../../context"
import fetch from "node-fetch"
import { SSOAuthDetails, SSOUser, User } from "@budibase/types"

type SaveUserOpts = {
  requirePassword?: boolean
  hashPassword?: boolean
  currentUserId?: string
}

export type SaveUserFunction = (
  user: SSOUser,
  opts: SaveUserOpts
) => Promise<any>

/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
export async function authenticate(
  details: SSOAuthDetails,
  requireLocalAccount: boolean = true,
  done: any,
  saveUserFn?: SaveUserFunction
) {
  if (!saveUserFn) {
    throw new Error("Save user function must be provided")
  }
  if (!details.provider) {
    return authError(done, "sso user provider required")
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

  // fallback to loading by email
  if (!dbUser) {
    dbUser = await users.getGlobalUserByEmail(details.email)
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
    }
  }

  const ssoUser = await syncUser(dbUser, details)
  // never prompt for password reset
  ssoUser.forceResetPassword = false

  // create or sync the user
  try {
    await saveUserFn(ssoUser, { hashPassword: false, requirePassword: false })
  } catch (err: any) {
    return authError(done, err)
  }

  // now that we're sure user exists, load them from the db
  dbUser = await users.getById(dbUser._id!)

  return done(null, dbUser)
}

async function syncProfilePicture(user: User, details: SSOAuthDetails) {
  const pictureUrl = details.profile?._json.picture
  if (pictureUrl) {
    const response = await fetch(pictureUrl)
    if (response.status === 200) {
      const type = response.headers.get("content-type") as string
      if (type.startsWith("image/")) {
        return pictureUrl
      }
    }
  }
}

/**
 * @returns a user that has been sync'd with third party information
 */
async function syncUser(user: User, details: SSOAuthDetails): Promise<SSOUser> {
  let firstName
  let lastName
  let pictureUrl
  let oauth2
  let thirdPartyProfile

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

    pictureUrl = await syncProfilePicture(user, details)

    thirdPartyProfile = {
      ...profile._json,
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
    thirdPartyProfile,
    pictureUrl,
    oauth2,
  }
}
