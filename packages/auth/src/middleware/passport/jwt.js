const { Cookies } = require("../../constants")

exports.options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: function(ctx) {
    return ctx.cookies.get(Cookies.Auth)
  },
}

exports.authenticate = async function(jwt, done) {
  try {
    return done(null, jwt)
  } catch (err) {
    return done(new Error("JWT invalid."), false)
  }
}
