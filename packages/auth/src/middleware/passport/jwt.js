exports.options = {
  secretOrKey: process.env.JWT_SECRET,
}

exports.authenticate = async function(jwt, done) {
  try {
    return done(null, jwt)
  } catch (err) {
    return done(new Error("JWT invalid."), false)
  }
}
