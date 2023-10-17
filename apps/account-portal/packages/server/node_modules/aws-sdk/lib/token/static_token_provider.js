var AWS = require('../core');

/**
 * Represents the simplest token provider. It returns a static token string
 * and has an optional expireTime.
 */
AWS.StaticTokenProvider = AWS.util.inherit(AWS.Token, {

  /**
   * Creates a new StaticTokenProvider class with a given {token} and
   * optional {expireTime}.
   *
   * ```javascript
   * var staticTokenProvider = new AWS.StaticTokenProvider({
   *   token: 'token'
   * });
   * staticTokenProvider.token == 'token' // from constructor
   * ```
   *
   * @option options token [String] represents the literal token string.
   * @option options expireTime [Date] optional field representing the time at which
   *   the token expires.
   */
  constructor: function StaticTokenProvider(options) {
    AWS.Token.call(this, options);
  }
});
