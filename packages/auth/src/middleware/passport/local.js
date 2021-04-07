const jwt = require("jsonwebtoken")
const { UserStatus } = require("../../constants")
const CouchDB = require("../../db")
const { StaticDatabases, generateUserID } = require("../../db/utils")
const { compare } = require("../../hashing")

const INVALID_ERR = "Invalid Credentials"

exports.options = {}

/**
 * Passport Local Authentication Middleware.
 * @param {*} username - username to login with
 * @param {*} password - plain text password to log in with
 * @param {*} done - callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
exports.authenticate = async function(username, password, done) {
  if (!username) return done(null, false, "Email Required.")
  if (!password) return done(null, false, "Password Required.")

  // Check the user exists in the instance DB by email
  const db = new CouchDB(StaticDatabases.USER.name)

  let dbUser
  try {
    dbUser = await db.get(generateUserID(username))
  } catch (err) {
    console.error("User not found", err)
    return done(null, false, { message: "User not found" })
  }

  // check that the user is currently inactive, if this is the case throw invalid
  if (dbUser.status === UserStatus.INACTIVE) {
    return done(null, false, { message: INVALID_ERR })
  }

  // authenticate
  if (await compare(password, dbUser.password)) {
    const payload = {
      _id: dbUser._id,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1 day",
    })

    dbUser.token = token
    // Remove users password in payload
    delete dbUser.password

    return done(null, dbUser)
  } else {
    done(new Error(INVALID_ERR), false)
  }
}
