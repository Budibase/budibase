const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

const { authenticateThirdParty } = require("./third-party-common")

async function authenticate(accessToken, refreshToken, profile, done) {
  const thirdPartyUser = {
    provider: profile.provider, // should always be 'google'
    providerType: "google",
    userId: profile.id,
    profile: profile,
    email: profile._json.email,
    oauth2: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  }

  return authenticateThirdParty(
    thirdPartyUser,
    true, // require local accounts to exist
    done
  )
}

/**
 * Create an instance of the google passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Google Strategy
 */
exports.strategyFactory = async function (config) {
  try {
    const { clientID, clientSecret, callbackURL } = config

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        "Configuration invalid. Must contain google clientID, clientSecret and callbackURL"
      )
    }

    return new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      authenticate
    )
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing google authentication strategy", err)
  }
}
// expose for testing
exports.authenticate = authenticate
