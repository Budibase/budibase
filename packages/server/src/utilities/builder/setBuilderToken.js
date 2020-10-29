const { BUILDER_LEVEL_ID } = require("../accessLevels")
const env = require("../../environment")
const jwt = require("jsonwebtoken")

module.exports = (ctx, appId, version) => {
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
  // remove the app token
  ctx.cookies.set("budibase:token", "", {
    overwrite: true,
  })
  // set the builder token
  ctx.cookies.set("builder:token", token, {
    expires: expiry,
    httpOnly: false,
    overwrite: true,
  })
}
