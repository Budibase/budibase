const { Cookies } = require("../../constants")
const env = require("../../environment")
const { authError } = require("./utils")

exports.options = {
  secretOrKey: env.JWT_SECRET,
  jwtFromRequest: function (ctx) {
    return ctx.cookies.get(Cookies.Auth)
  },
}

exports.authenticate = async function (jwt, done) {
  try {
    return done(null, jwt)
  } catch (err) {
    return authError(done, "JWT invalid", err)
  }
}
