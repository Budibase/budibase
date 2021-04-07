const { Cookies } = require("../../constants")

exports.options = {
  jwtFromRequest: function(ctx) {
    return ctx.cookies.get(Cookies.Auth)
  },
  secretOrKey: process.env.JWT_SECRET,
}

exports.authenticate = async function(jwt, done) {
  try {
    return done(null, jwt)
  } catch (err) {
    return done(new Error("JWT invalid."), false)
  }
}
