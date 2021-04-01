// const GoogleStrategy = require("passport-google-auth").Strategy

exports.options = {
  clientId: "your-client-id",
  clientSecret: "your-secret",
  callbackURL:
    "http://localhost:" + (process.env.PORT || 3000) + "/auth/google/callback",
}

exports.authenticate = async function(token, tokenSecret, profile, done) {
  // retrieve user ...
  // fetchUser().then(user => done(null, user))
}
