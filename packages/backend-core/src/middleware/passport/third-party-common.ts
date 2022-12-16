import env from "../../environment"
import { generateGlobalUserID } from "../../db"
import { authError } from "./utils"
import { newid } from "../../utils"
import { createASession } from "../../security/sessions"
import * as users from "../../users"
import { getGlobalDB, getTenantId } from "../../tenancy"
import fetch from "node-fetch"
import { ThirdPartyUser } from "@budibase/types"
const jwt = require("jsonwebtoken")

type SaveUserOpts = {
  requirePassword?: boolean
  hashPassword?: boolean
  currentUserId?: string
}

export type SaveUserFunction = (
  user: ThirdPartyUser,
  opts: SaveUserOpts
) => Promise<any>

/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
export async function authenticateThirdParty(
  thirdPartyUser: ThirdPartyUser,
  requireLocalAccount: boolean = true,
  done: Function,
  saveUserFn?: SaveUserFunction
) {
  if (!saveUserFn) {
    throw new Error("Save user function must be provided")
  }
  if (!thirdPartyUser.provider) {
    return authError(done, "third party user provider required")
  }
  if (!thirdPartyUser.userId) {
    return authError(done, "third party user id required")
  }
  if (!thirdPartyUser.email) {
    return authError(done, "third party user email required")
  }

  // use the third party id
  const userId = generateGlobalUserID(thirdPartyUser.userId)
  const db = getGlobalDB()

  let dbUser

  // try to load by id
  try {
    dbUser = await db.get(userId)
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
    dbUser = await users.getGlobalUserByEmail(thirdPartyUser.email)
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
      email: thirdPartyUser.email,
      roles: {},
    }
  }

  dbUser = await syncUser(dbUser, thirdPartyUser)

  // never prompt for password reset
  dbUser.forceResetPassword = false

  // create or sync the user
  try {
    await saveUserFn(dbUser, { hashPassword: false, requirePassword: false })
  } catch (err: any) {
    return authError(done, err)
  }

  // now that we're sure user exists, load them from the db
  dbUser = await db.get(dbUser._id)

  // authenticate
  const sessionId = newid()
  const tenantId = getTenantId()
  await createASession(dbUser._id, { sessionId, tenantId })

  dbUser.token = jwt.sign(
    {
      userId: dbUser._id,
      sessionId,
    },
    env.JWT_SECRET
  )

  return done(null, dbUser)
}

async function syncProfilePicture(
  user: ThirdPartyUser,
  thirdPartyUser: ThirdPartyUser
) {
  const pictureUrl = thirdPartyUser.profile?._json.picture
  if (pictureUrl) {
    const response = await fetch(pictureUrl)

    if (response.status === 200) {
      const type = response.headers.get("content-type") as string
      if (type.startsWith("image/")) {
        user.pictureUrl = pictureUrl
      }
    }
  }

  return user
}

/**
 * @returns a user that has been sync'd with third party information
 */
async function syncUser(user: ThirdPartyUser, thirdPartyUser: ThirdPartyUser) {
  // provider
  user.provider = thirdPartyUser.provider
  user.providerType = thirdPartyUser.providerType

  if (thirdPartyUser.profile) {
    const profile = thirdPartyUser.profile

    if (profile.name) {
      const name = profile.name
      // first name
      if (name.givenName) {
        user.firstName = name.givenName
      }
      // last name
      if (name.familyName) {
        user.lastName = name.familyName
      }
    }

    user = await syncProfilePicture(user, thirdPartyUser)

    // profile
    user.thirdPartyProfile = {
      ...profile._json,
    }
  }

  // oauth tokens for future use
  if (thirdPartyUser.oauth2) {
    user.oauth2 = {
      ...thirdPartyUser.oauth2,
    }
  }

  return user
}
