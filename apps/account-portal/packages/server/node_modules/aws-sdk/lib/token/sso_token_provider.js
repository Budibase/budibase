var AWS = require('../core');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var iniLoader = AWS.util.iniLoader;

// Tracking refresh attempt to ensure refresh is not attempted more than once every 30 seconds.
var lastRefreshAttemptTime = 0;

/**
 * Throws error is key is not present in token object.
 *
 * @param token [Object] Object to be validated.
 * @param key [String] The key to be validated on the object.
 */
var validateTokenKey = function validateTokenKey(token, key) {
  if (!token[key]) {
    throw AWS.util.error(
      new Error('Key "' + key + '" not present in SSO Token'),
      { code: 'SSOTokenProviderFailure' }
    );
  }
};

/**
 * Calls callback function with or without error based on provided times in case
 * of unsuccessful refresh.
 *
 * @param currentTime [number] current time in milliseconds since ECMAScript epoch.
 * @param tokenExpireTime [number] token expire time in milliseconds since ECMAScript epoch.
 * @param callback [Function] Callback to call in case of error.
 */
var refreshUnsuccessful = function refreshUnsuccessful(
  currentTime,
  tokenExpireTime,
  callback
) {
  if (tokenExpireTime > currentTime) {
    // Cached token is still valid, return.
    callback(null);
  } else {
    // Token invalid, throw error requesting user to sso login.
    throw AWS.util.error(
      new Error('SSO Token refresh failed. Please log in using "aws sso login"'),
      { code: 'SSOTokenProviderFailure' }
    );
  }
};

/**
 * Represents token loaded from disk derived from the AWS SSO device grant authorication flow.
 *
 * ## Using SSO Token Provider
 *
 * This provider is checked by default in the Node.js environment in TokenProviderChain.
 * To use the SSO Token Provider, simply add your SSO Start URL and Region to the
 * ~/.aws/config file in the following format:
 *
 *     [default]
 *     sso_start_url = https://d-abc123.awsapps.com/start
 *     sso_region = us-east-1
 *
 * ## Using custom profiles
 *
 * The SDK supports loading token for separate profiles. This can be done in two ways:
 *
 * 1. Set the `AWS_PROFILE` environment variable in your process prior to loading the SDK.
 * 2. Directly load the AWS.SSOTokenProvider:
 *
 * ```javascript
 * var ssoTokenProvider = new AWS.SSOTokenProvider({profile: 'myprofile'});
 * ```
 *
 * @!macro nobrowser
 */
AWS.SSOTokenProvider = AWS.util.inherit(AWS.Token, {
  /**
   * Expiry window of five minutes.
   */
  expiryWindow: 5 * 60,

  /**
   * Creates a new token object from cached access token.
   *
   * @param options [map] a set of options
   * @option options profile [String] (AWS_PROFILE env var or 'default')
   *   the name of the profile to load.
   * @option options callback [Function] (err) Token is eagerly loaded
   *   by the constructor. When the callback is called with no error, the
   *   token has been loaded successfully.
   */
  constructor: function SSOTokenProvider(options) {
    AWS.Token.call(this);

    options = options || {};

    this.expired = true;
    this.profile = options.profile || process.env.AWS_PROFILE || AWS.util.defaultProfile;
    this.get(options.callback || AWS.util.fn.noop);
  },

  /**
   * Reads sso_start_url from provided profile, and reads token from
   * ~/.aws/sso/cache/<sha1-of-utf8-encoded-value-from-sso_start_url>.json
   *
   * Throws an error if required fields token and expiresAt are missing.
   * Throws an error if token has expired and metadata to perform refresh is
   * not available.
   * Attempts to refresh the token if it's within 5 minutes before expiry time.
   *
   * @api private
   */
  load: function load(callback) {
    var self = this;
    var profiles = iniLoader.loadFrom({ isConfig: true });
    var profile = profiles[this.profile] || {};

    if (Object.keys(profile).length === 0) {
      throw AWS.util.error(
        new Error('Profile "' + this.profile + '" not found'),
        { code: 'SSOTokenProviderFailure' }
      );
    } else if (!profile['sso_session']) {
      throw AWS.util.error(
        new Error('Profile "' + this.profile + '" is missing required property "sso_session".'),
        { code: 'SSOTokenProviderFailure' }
      );
    }

    var ssoSessionName = profile['sso_session'];
    var ssoSessions = iniLoader.loadSsoSessionsFrom();
    var ssoSession = ssoSessions[ssoSessionName];

    if (!ssoSession) {
      throw AWS.util.error(
        new Error('Sso session "' + ssoSessionName + '" not found'),
        { code: 'SSOTokenProviderFailure' }
      );
    } else if (!ssoSession['sso_start_url']) {
      throw AWS.util.error(
        new Error('Sso session "' + this.profile + '" is missing required property "sso_start_url".'),
        { code: 'SSOTokenProviderFailure' }
      );
    } else if (!ssoSession['sso_region']) {
      throw AWS.util.error(
        new Error('Sso session "' + this.profile + '" is missing required property "sso_region".'),
        { code: 'SSOTokenProviderFailure' }
      );
    }

    var hasher = crypto.createHash('sha1');
    var fileName = hasher.update(ssoSessionName).digest('hex') + '.json';
    var cachePath = path.join(iniLoader.getHomeDir(), '.aws', 'sso', 'cache', fileName);
    var tokenFromCache = JSON.parse(fs.readFileSync(cachePath));

    if (!tokenFromCache) {
      throw AWS.util.error(
        new Error('Cached token not found. Please log in using "aws sso login"'
          + ' for profile "' + this.profile + '".'),
        { code: 'SSOTokenProviderFailure' }
      );
    }

    validateTokenKey(tokenFromCache, 'accessToken');
    validateTokenKey(tokenFromCache, 'expiresAt');

    var currentTime = AWS.util.date.getDate().getTime();
    var adjustedTime = new Date(currentTime + this.expiryWindow * 1000);
    var tokenExpireTime = new Date(tokenFromCache['expiresAt']);

    if (tokenExpireTime > adjustedTime) {
      // Token is valid and not expired.
      self.token = tokenFromCache.accessToken;
      self.expireTime = tokenExpireTime;
      self.expired = false;
      callback(null);
      return;
    }

    // Skip new refresh, if last refresh was done within 30 seconds.
    if (currentTime - lastRefreshAttemptTime < 30 * 1000) {
      refreshUnsuccessful(currentTime, tokenExpireTime, callback);
      return;
    }

    // Token is in expiry window, refresh from SSOOIDC.createToken() call.
    validateTokenKey(tokenFromCache, 'clientId');
    validateTokenKey(tokenFromCache, 'clientSecret');
    validateTokenKey(tokenFromCache, 'refreshToken');

    if (!self.service || self.service.config.region !== ssoSession.sso_region) {
      self.service = new AWS.SSOOIDC({ region: ssoSession.sso_region });
    }

    var params = {
      clientId: tokenFromCache.clientId,
      clientSecret: tokenFromCache.clientSecret,
      refreshToken: tokenFromCache.refreshToken,
      grantType: 'refresh_token',
    };

    lastRefreshAttemptTime = AWS.util.date.getDate().getTime();
    self.service.createToken(params, function(err, data) {
      if (err || !data) {
        refreshUnsuccessful(currentTime, tokenExpireTime, callback);
      } else {
        try {
          validateTokenKey(data, 'accessToken');
          validateTokenKey(data, 'expiresIn');
          self.expired = false;
          self.token = data.accessToken;
          self.expireTime = new Date(Date.now() + data.expiresIn * 1000);
          callback(null);

          try {
            // Write updated token data to disk.
            tokenFromCache.accessToken = data.accessToken;
            tokenFromCache.expiresAt = self.expireTime.toISOString();
            tokenFromCache.refreshToken = data.refreshToken;
            fs.writeFileSync(cachePath, JSON.stringify(tokenFromCache, null, 2));
          } catch (error) {
            // Swallow error if unable to write token to file.
          }
        } catch (error) {
          refreshUnsuccessful(currentTime, tokenExpireTime, callback);
        }
      }
    });
  },

  /**
   * Loads the cached access token from disk.
   *
   * @callback callback function(err)
   *   Called after the AWS SSO process has been executed. When this
   *   callback is called with no error, it means that the token information
   *   has been loaded into the object (as the `token` property).
   *   @param err [Error] if an error occurred, this value will be filled.
   * @see get
   */
  refresh: function refresh(callback) {
    iniLoader.clearCachedFiles();
    this.coalesceRefresh(callback || AWS.util.fn.callback);
  },
});
