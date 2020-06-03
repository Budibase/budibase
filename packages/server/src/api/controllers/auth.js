const jwt = require("jsonwebtoken")
const CouchDB = require("../../db")
const ClientDb = require("../../db/clientDb")
const bcrypt = require("../../utilities/bcrypt")
const env = require("../../environment")

exports.authenticate = async ctx => {
  const { username, password } = ctx.request.body

  if (!username) ctx.throw(400, "Username Required.")
  if (!password) ctx.throw(400, "Password Required")

  // find the instance that the user is associated with
  const db = new CouchDB(ClientDb.name(env.CLIENT_ID))
  const app = await db.get(ctx.params.appId)
  const instanceId = app.userInstanceMap[username]

  if (!instanceId)
    ctx.throw(500, "User is not associated with an instance of app", appId)

  // Check the user exists in the instance DB by username
  const instanceDb = new CouchDB(instanceId)

  let dbUser
  try {
    dbUser = await instanceDb.get(`user_${username}`)
  } catch (_) {
    // do not want to throw a 404 - as this could be
    // used to dtermine valid usernames
    ctx.throw(401, "Invalid Credentials")
  }

  // authenticate
  if (await bcrypt.compare(password, dbUser.password)) {
    const payload = {
      userId: dbUser._id,
      accessLevelId: dbUser.accessLevelId,
      instanceId: instanceId,
    }

    const token = jwt.sign(payload, ctx.config.jwtSecret, {
      expiresIn: "1 day",
    })

    const ONE_DAY_FROM_NOW = new Date(Date.now() + 24 * 3600)

    ctx.cookies.set("budibase:token", token, { expires: ONE_DAY_FROM_NOW })

    ctx.body = {
      token,
      ...dbUser,
    }
  } else {
    ctx.throw(401, "Invalid credentials.")
  }
}
