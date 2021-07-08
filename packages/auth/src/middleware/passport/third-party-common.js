const env = require("../../environment")
const jwt = require("jsonwebtoken")
const database = require("../../db")
const {
  StaticDatabases,
  generateGlobalUserID,
  ViewNames,
} = require("../../db/utils")
const { authError } = require("./utils")

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
    const users = await db.query(`database/${ViewNames.USER_BY_EMAIL}`, {
      key: thirdPartyUser.email,
      include_docs: true,
    })

    if (users.rows.length > 0) {
      dbUser = users.rows[0].doc
    }
  }

  // exit early if there is still no user and auto creation is disabled
  if (!dbUser && requireLocalAccount ) {
    if (requireLocalAccount) {
      return authError(
        done,
        "Email does not yet exist. You must set up your local budibase account first."
      )
    }
  }

  let user
  // first time creation
  if (!dbUser) {
    user = constructNewUser(userId, thirdPartyUser)
  } else {
  // existing user
    user = constructMergedUser(userId, dbUser, thirdPartyUser)
    await db.remove(dbUser._id, dbUser._rev)
  }

  // create or sync the user
  const response = await db.post(user)
  dbUser = user
  dbUser._rev = response.rev

  // authenticate
  const payload = {
    userId: dbUser._id,
    builder: dbUser.builder,
    email: dbUser.email,
  }

  dbUser.token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1 day",
  })

  return done(null, dbUser)
}

/**
 * @returns a user object constructed from existing and third party information
 */
function constructMergedUser(userId, existing, thirdPartyUser) {
  // sync third party fields
  const user = constructNewUser(userId, thirdPartyUser)

  // merge existing fields
  user.roles = existing.roles
  user.builder = existing.builder
  user.admin = existing.admin

  return user
}

/**
 * @returns a user object constructed from third party information
 */
function constructNewUser(userId, thirdPartyUser) {
  const user = {
    _id: userId,
    provider: thirdPartyUser.provider,
    providerType: thirdPartyUser.providerType,
    email: thirdPartyUser.email,
    roles: {},
  }

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
    // @reviewers: Historically stored at the root level of the user
    //             Nest to prevent conflicts with future fields
    //             Is this okay to change?
    user.thirdPartyProfile = {
      ...profile._json,
    }
  }

  // persist oauth tokens for future use
  if (thirdPartyUser.oauth2) {
    user.oauth2 = {
      ...thirdPartyUser.oauth2,
    }
  }

  return user
}
