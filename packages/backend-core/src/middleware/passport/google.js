const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const { ssoCallbackUrl } = require("./utils")
const { authenticateThirdParty } = require("./third-party-common")
const { Config } = require("../../../constants")

const buildVerifyFn = saveUserFn => {
  return (accessToken, refreshToken, profile, done) => {
    const thirdPartyUser = {
      provider: profile.provider, // should always be 'google'
      providerType: "google",
      userId: profile.id,
      profile: profile,
      email: profile._json.email,
      oauth2: {
        accessToken,
        refreshToken,
      },
    }

    return authenticateThirdParty(
      thirdPartyUser,
      true, // require local accounts to exist
      done,
      saveUserFn
    )
  }
}

/**
 * Create an instance of the google passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Google Strategy
 */
exports.strategyFactory = async function (config, callbackUrl, saveUserFn) {
  try {
    const { clientID, clientSecret } = config

    if (!clientID || !clientSecret) {
      throw new Error(
        "Configuration invalid. Must contain google clientID and clientSecret"
      )
    }

    const verify = buildVerifyFn(saveUserFn)
    return new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: callbackUrl,
      },
      verify
    )
  } catch (err) {
    console.error(err)
    throw new Error(
      `Error constructing google authentication strategy: ${err}`,
      err
    )
  }
}

exports.getCallbackUrl = async function (db, config) {
  return ssoCallbackUrl(db, config, Config.GOOGLE)
}

// expose for testing
exports.buildVerifyFn = buildVerifyFn
