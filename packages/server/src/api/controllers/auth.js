const jwt = require("jsonwebtoken")
const CouchDB = require("../../db")
const ClientDb = require("../../db/clientDb")
const bcrypt = require("../../utilities/bcrypt")

exports.authenticate = async ctx => {
  if (!ctx.user.appId) ctx.throw(400, "No appId")

  const { username, password } = ctx.request.body

  if (!username) ctx.throw(400, "Username Required.")
  if (!password) ctx.throw(400, "Password Required")

  const masterDb = new CouchDB("client_app_lookup")

  const { clientId } = await masterDb.get(ctx.user.appId)

  if (!clientId) {
    ctx.throw(400, "ClientId not supplied")
  }
  // find the instance that the user is associated with
  const db = new CouchDB(ClientDb.name(clientId))
  const app = await db.get(ctx.user.appId)
  const instanceId = app.userInstanceMap[username]

  if (!instanceId)
    ctx.throw(
      500,
      "User is not associated with an instance of app",
      ctx.user.appId
    )

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
      appId: ctx.user.appId,
      instanceId,
    }

    const token = jwt.sign(payload, ctx.config.jwtSecret, {
      expiresIn: "1 day",
    })

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)

    ctx.cookies.set("budibase:token", token, {
      expires,
      path: "/",
      httpOnly: false,
    })

    ctx.body = {
      token,
      ...dbUser,
    }
  } else {
    ctx.throw(401, "Invalid credentials.")
  }
}
