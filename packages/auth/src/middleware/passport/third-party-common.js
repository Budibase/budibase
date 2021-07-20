const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const { StaticDatabases, generateGlobalUserID } = require("../../db/utils")
const { authError } = require("./utils")
const { newid } = require("../../hashing")
const { createASession } = require("../../security/sessions")
const { getGlobalUserByEmail } = require("../../utils")

/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
exports.authenticateThirdParty = async function (
  thirdPartyUser,
  requireLocalAccount = true,
  done
) {
  if (!thirdPartyUser.provider)
    return authError(done, "third party user provider required")
  if (!thirdPartyUser.userId)
    return authError(done, "third party user id required")
  if (!thirdPartyUser.email)
    return authError(done, "third party user email required")

  const db = database.getDB(StaticDatabases.GLOBAL.name)

  let dbUser

  // use the third party id
  const userId = generateGlobalUserID(thirdPartyUser.userId)

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
    dbUser = await getGlobalUserByEmail(thirdPartyUser.email)
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
      roles: {},
    }
  }

  dbUser = syncUser(dbUser, thirdPartyUser)

  // create or sync the user
  const response = await db.post(dbUser)
  dbUser._rev = response.rev

  // authenticate
  const sessionId = newid()
  await createASession(dbUser._id, sessionId)

  dbUser.token = jwt.sign(
    {
      userId: dbUser._id,
      sessionId,
    },
    env.JWT_SECRET
  )

  return done(null, dbUser)
}

/**
 * @returns a user that has been sync'd with third party information
 */
function syncUser(user, thirdPartyUser) {
  // provider
  user.provider = thirdPartyUser.provider
  user.providerType = thirdPartyUser.providerType

  // email
  user.email = thirdPartyUser.email

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
