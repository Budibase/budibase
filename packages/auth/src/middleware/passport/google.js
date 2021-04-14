const env = require("../../environment")

exports.options = {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_AUTH_CALLBACK_URL,
}

exports.authenticate = async function(token, tokenSecret, profile, done) {
  // retrieve user ...
  // fetchUser().then(user => done(null, user))
}
