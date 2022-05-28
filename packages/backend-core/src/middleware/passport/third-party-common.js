const env = require("../../environment")
const jwt = require("jsonwebtoken")
const { generateGlobalUserID } = require("../../db/utils")
const { authError } = require("./utils")
const { newid } = require("../../hashing")
const { createASession } = require("../../security/sessions")
const users = require("../../users")
const { getGlobalDB, getTenantId } = require("../../tenancy")
const fetch = require("node-fetch")

/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
exports.authenticateThirdParty = async function (
  thirdPartyUser,
  requireLocalAccount = true,
  done,
  saveUserFn
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
  } catch (err) {
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
    await saveUserFn(dbUser, false, false)
  } catch (err) {
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

async function syncProfilePicture(user, thirdPartyUser) {
  const pictureUrl = thirdPartyUser.profile._json.picture
  if (pictureUrl) {
    const response = await fetch(pictureUrl)

    if (response.status === 200) {
      const type = response.headers.get("content-type")
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
async function syncUser(user, thirdPartyUser) {
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
