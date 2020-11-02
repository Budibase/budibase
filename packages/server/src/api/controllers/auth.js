const jwt = require("jsonwebtoken")
const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const env = require("../../environment")
const { getAPIKey } = require("../../utilities/usageQuota")
const { generateUserID } = require("../../db/utils")

exports.authenticate = async ctx => {
  const appId = ctx.user.appId
  if (!appId) ctx.throw(400, "No appId")

  const { username, password } = ctx.request.body

  if (!username) ctx.throw(400, "Username Required.")
  if (!password) ctx.throw(400, "Password Required.")

  // Check the user exists in the instance DB by username
  const db = new CouchDB(appId)
  const app = await db.get(appId)

  let dbUser
  try {
    dbUser = await db.get(generateUserID(username))
  } catch (_) {
    // do not want to throw a 404 - as this could be
    // used to determine valid usernames
    ctx.throw(401, "Invalid Credentials")
  }

  // authenticate
  if (await bcrypt.compare(password, dbUser.password)) {
    const payload = {
      userId: dbUser._id,
      accessLevelId: dbUser.accessLevelId,
      version: app.version,
      appId,
    }
    // if in cloud add the user api key
    if (env.CLOUD) {
      const { apiKey } = await getAPIKey(ctx.user.appId)
      payload.apiKey = apiKey
    }

    const token = jwt.sign(payload, ctx.config.jwtSecret, {
      expiresIn: "1 day",
    })

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    ctx.cookies.set(`budibase:token`, token, {
      expires,
      path: "/",
      httpOnly: false,
      overwrite: true,
    })

    ctx.body = {
      token,
      ...dbUser,
    }
  } else {
    ctx.throw(401, "Invalid credentials.")
  }
}
