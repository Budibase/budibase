const CouchDB = require("../db")

exports.options = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  // "http://localhost:" + (process.env.PORT || 3000) + "/auth/google/callback",
}

exports.authenticate = async function(token, tokenSecret, profile, done) {
  // retrieve user ...
  // fetchUser().then(user => done(null, user))
}
