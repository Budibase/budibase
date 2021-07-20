const jwt = require("jsonwebtoken")
const { UserStatus, DEFAULT_TENANT_ID } = require("../../constants")
const { compare } = require("../../hashing")
const env = require("../../environment")
const { getGlobalUserByEmail } = require("../../utils")
const { authError } = require("./utils")
const { newid } = require("../../hashing")
const { createASession } = require("../../security/sessions")

const INVALID_ERR = "Invalid Credentials"

exports.options = {
  passReqToCallback: true,
}

/**
 * Passport Local Authentication Middleware.
 * @param {*} ctx the request structure
 * @param {*} email username to login with
 * @param {*} password plain text password to log in with
 * @param {*} done callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
exports.authenticate = async function (ctx, email, password, done) {
  if (!email) return authError(done, "Email Required")
  if (!password) return authError(done, "Password Required")
  const params = ctx.params || {}

  // use the request to find the tenantId
  let tenantId = params.tenantId || DEFAULT_TENANT_ID
  const dbUser = await getGlobalUserByEmail(email, tenantId)
  if (dbUser == null) {
    return authError(done, "User not found")
  }

  // check that the user is currently inactive, if this is the case throw invalid
  if (dbUser.status === UserStatus.INACTIVE) {
    return authError(done, INVALID_ERR)
  }

  // authenticate
  if (await compare(password, dbUser.password)) {
    const sessionId = newid()
    await createASession(dbUser._id, { sessionId, tenantId })

    dbUser.token = jwt.sign(
      {
        userId: dbUser._id,
        sessionId,
        tenantId,
      },
      env.JWT_SECRET
    )
    // Remove users password in payload
    delete dbUser.password

    return done(null, dbUser)
  } else {
    return authError(done, INVALID_ERR)
  }
}
