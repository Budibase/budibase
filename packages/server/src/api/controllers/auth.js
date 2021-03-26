const jwt = require("jsonwebtoken")
const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const env = require("../../environment")
const { getAPIKey } = require("../../utilities/usageQuota")
const { generateUserID } = require("../../db/utils")
const { setCookie } = require("../../utilities")
const { outputProcessing } = require("../../utilities/rowProcessor")
const { ViewNames } = require("../../db/utils")
const { UserStatus } = require("../../constants")

const INVALID_ERR = "Invalid Credentials"

exports.authenticate = async ctx => {
  const appId = ctx.appId
  if (!appId) ctx.throw(400, "No appId")

  const { email, password } = ctx.request.body

  if (!email) ctx.throw(400, "Email Required.")
  if (!password) ctx.throw(400, "Password Required.")

  // Check the user exists in the instance DB by email
  const db = new CouchDB(appId)
  const app = await db.get(appId)

  let dbUser
  try {
    dbUser = await db.get(generateUserID(email))
  } catch (_) {
    // do not want to throw a 404 - as this could be
    // used to determine valid emails
    ctx.throw(401, INVALID_ERR)
  }

  // check that the user is currently inactive, if this is the case throw invalid
  if (dbUser.status === UserStatus.INACTIVE) {
    ctx.throw(401, INVALID_ERR)
  }

  // authenticate
  if (await bcrypt.compare(password, dbUser.password)) {
    const payload = {
      userId: dbUser._id,
      roleId: dbUser.roleId,
      version: app.version,
    }
    // if in prod add the user api key, unless self hosted
    /* istanbul ignore next */
    if (env.isProd() && !env.SELF_HOSTED) {
      const { apiKey } = await getAPIKey(ctx.user.appId)
      payload.apiKey = apiKey
    }

    const token = jwt.sign(payload, ctx.config.jwtSecret, {
      expiresIn: "1 day",
    })

    setCookie(ctx, token, appId)

    delete dbUser.password
    ctx.body = {
      token,
      ...dbUser,
      appId,
    }
  } else {
    ctx.throw(401, INVALID_ERR)
  }
}

exports.fetchSelf = async ctx => {
  const { userId, appId } = ctx.user
  /* istanbul ignore next */
  if (!userId || !appId) {
    ctx.body = {}
    return
  }
  const db = new CouchDB(appId)
  const user = await db.get(userId)
  const userTable = await db.get(ViewNames.USERS)
  if (user) {
    delete user.password
  }
  // specifically needs to make sure is enriched
  ctx.body = await outputProcessing(appId, userTable, user)
}
