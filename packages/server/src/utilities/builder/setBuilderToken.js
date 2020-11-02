const { BUILDER_LEVEL_ID } = require("../accessLevels")
const env = require("../../environment")
const CouchDB = require("../../db")
const jwt = require("jsonwebtoken")
const { DocumentTypes, SEPARATOR } = require("../../db/utils")
const { getCookieName } = require("../index")
const APP_PREFIX = DocumentTypes.APP + SEPARATOR

module.exports = async (ctx, appId, version) => {
  const builderUser = {
    userId: "BUILDER",
    accessLevelId: BUILDER_LEVEL_ID,
    appId,
    version,
  }
  if (env.BUDIBASE_API_KEY) {
    builderUser.apiKey = env.BUDIBASE_API_KEY
  }
  const token = jwt.sign(builderUser, ctx.config.jwtSecret, {
    expiresIn: "30 days",
  })

  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)
  // set the builder token
  ctx.cookies.set(getCookieName(), token, {
    expires: expiry,
    httpOnly: false,
    overwrite: true,
  })
  // need to clear all app tokens or else unable to use the app in the builder
  let allDbNames = await CouchDB.allDbs()
  allDbNames.map(dbName => {
    if (dbName.startsWith(APP_PREFIX)) {
      ctx.cookies.set(getCookieName(dbName), "", {
        overwrite: true,
      })
    }
  })
}
