'use strict';

const AuthTokenRefresh = {};

AuthTokenRefresh._strategies = {};

/**
 * Register a passport strategy so it can refresh an access token,
 * with optional `name`, overridding the strategy's default name.
 *
 * A third optional options parameter is available, which can be
 * used to create a custom OAuth2 adapter, or modify the one
 * which is automatically created. This is useful if the
 * strategy does not expose its internal OAuth2 adapter, or
 * customizes the adapter in some way that needs to be replicated.
 *
 * Examples:
 *
 *     refresh.use(strategy);
 *     refresh.use('facebook', strategy);
 *     refresh.use('activedirectory', strategy, {
 *       setRefreshOAuth2() {
 *         return new OAuth2(...);
 *       }
 *     });
 *
 * @param {String|Strategy} name
 * @param {Strategy} passport strategy
 * @param {Object} options
 * @param {OAuth2} options.setRefreshOAuth2 a callback to modify the oauth2 adapter. Should return the oauth2 adapter to use when refreshing the token.
 */
AuthTokenRefresh.use = function (name, strategy, options) {
  if (typeof name !== 'string') {
    // Infer name from strategy
    options = strategy;
    strategy = name;
    name = strategy && strategy.name;
  }

  if (strategy == null) {
    throw new Error('Cannot register: strategy is null');
  }

  if (!name) {
    throw new Error(
      'Cannot register: name must be specified, or strategy must include name',
    );
  }

  options = options || {};

  let refreshOAuth2 = undefined;

  if (strategy._oauth2) {
    // Try to use the internal oauth2 adapter, setting some sane defaults.
    // Use the strategy's OAuth2 object, since it might have been overwritten.
    // https://github.com/fiznool/passport-oauth2-refresh/issues/3
    const OAuth2 = strategy._oauth2.constructor;

    // Generate our own oauth2 object for use later.
    // Use the strategy's _refreshURL, if defined,
    // otherwise use the regular accessTokenUrl.
    refreshOAuth2 = new OAuth2(
      strategy._oauth2._clientId,
      strategy._oauth2._clientSecret,
      strategy._oauth2._baseSite,
      strategy._oauth2._authorizeUrl,
      strategy._refreshURL || strategy._oauth2._accessTokenUrl,
      strategy._oauth2._customHeaders,
    );

    // Some strategies overwrite the getOAuthAccessToken function to set headers
    // https://github.com/fiznool/passport-oauth2-refresh/issues/10
    refreshOAuth2.getOAuthAccessToken = strategy._oauth2.getOAuthAccessToken;
  }

  // See if we need to customise the OAuth2 object any further
  if (typeof options.setRefreshOAuth2 === 'function') {
    refreshOAuth2 = options.setRefreshOAuth2({
      strategyOAuth2: strategy._oauth2,
      refreshOAuth2,
    });
  }

  if (!refreshOAuth2) {
    throw new Error(
      'The OAuth2 adapter used to refresh the token is not configured correctly. Use the setRefreshOAuth2 option to return a OAuth 2.0 adapter.',
    );
  }

  // Set the strategy and oauth2 adapter for use later
  AuthTokenRefresh._strategies[name] = {
    strategy,
    refreshOAuth2,
  };
};

/**
 * Check if a strategy is registered for refreshing.
 * @param  {String}  name Strategy name
 * @return {Boolean}
 */
AuthTokenRefresh.has = function (name) {
  return !!AuthTokenRefresh._strategies[name];
};

/**
 * Request a new access token, using the passed refreshToken,
 * for the given strategy.
 * @param  {String}   name         Strategy name. Must have already
 *                                 been registered.
 * @param  {String}   refreshToken Refresh token to be sent to request
 *                                 a new access token.
 * @param  {Object}   params       (optional) an object containing additional
 *                                 params to use when requesting the token.
 * @param  {Function} done         Callback when all is done.
 */
AuthTokenRefresh.requestNewAccessToken = function (
  name,
  refreshToken,
  params,
  done,
) {
  if (arguments.length === 3) {
    done = params;
    params = {};
  }

  // Send a request to refresh an access token, and call the passed
  // callback with the result.
  const strategy = AuthTokenRefresh._strategies[name];
  if (!strategy) {
    return done(new Error('Strategy was not registered to refresh a token'));
  }

  params = params || {};
  params.grant_type = 'refresh_token';

  strategy.refreshOAuth2.getOAuthAccessToken(refreshToken, params, done);
};

module.exports = AuthTokenRefresh;
