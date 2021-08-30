const WechatStrategy = require("passport-wechat").Strategy

const { authenticateThirdParty } = require("./third-party-common")

async function authenticate(accessToken, refreshToken, profile, done) {
  const thirdPartyUser = {
    provider: profile.provider, // should always be 'wechat'
    providerType: "wechat",
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
    false, // require local accounts to exist
    done
  )
}

/**
 * Create an instance of the wechat passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Wechat Strategy
 */
exports.strategyFactory = async function (config, callbackURL) {
  try {
    const { appID, appSecret } = config

    if (!appID || !appSecret) {
      throw new Error(
        "Configuration invalid. Must contain wechat appID and appSecret"
      )
    }

    return new WechatStrategy(
      {
        appID,
        appSecret,
        client: config.client,
        callbackURL,
        scope: config.scope,
        state: config.state,
        getToken: config.getToken,
        saveToken: config.saveToken,
      },
      authenticate
    )
  } catch (err) {
    console.error(err)
    throw new Error("Error constructing wechat authentication strategy", err)
  }
}
// expose for testing
exports.authenticate = authenticate
