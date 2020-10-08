const { BUILDER_LEVEL_ID } = require("../accessLevels")
const jwt = require("jsonwebtoken")

module.exports = (ctx, appId, instanceId) => {
  const builderUser = {
    userId: "BUILDER",
    accessLevelId: BUILDER_LEVEL_ID,
    instanceId,
    appId,
  }
  if (process.env.BUDIBASE_API_KEY) {
    builderUser.apiKey = process.env.BUDIBASE_API_KEY
  }
  const token = jwt.sign(builderUser, ctx.config.jwtSecret, {
    expiresIn: "30 days",
  })

  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)
  ctx.cookies.set("builder:token", token, { expires: expiry, httpOnly: false })
}
