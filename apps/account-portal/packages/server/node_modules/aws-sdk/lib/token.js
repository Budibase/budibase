var AWS = require('./core');

/**
 * Represents AWS token object, which contains {token}, and optional
 * {expireTime}.
 * Creating a `Token` object allows you to pass around your
 * token to configuration and service objects.
 *
 * Note that this class typically does not need to be constructed manually,
 * as the {AWS.Config} and {AWS.Service} classes both accept simple
 * options hashes with the two keys. The token from this object will be used
 * automatically in operations which require them.
 *
 * ## Expiring and Refreshing Token
 *
 * Occasionally token can expire in the middle of a long-running
 * application. In this case, the SDK will automatically attempt to
 * refresh the token from the storage location if the Token
 * class implements the {refresh} method.
 *
 * If you are implementing a token storage location, you
 * will want to create a subclass of the `Token` class and
 * override the {refresh} method. This method allows token to be
 * retrieved from the backing store, be it a file system, database, or
 * some network storage. The method should reset the token attributes
 * on the object.
 *
 * @!attribute token
 *   @return [String] represents the literal token string. This will typically
 *     be a base64 encoded string.
 * @!attribute expireTime
 *   @return [Date] a time when token should be considered expired. Used
 *     in conjunction with {expired}.
 * @!attribute expired
 *   @return [Boolean] whether the token is expired and require a refresh. Used
 *     in conjunction with {expireTime}.
 */
AWS.Token = AWS.util.inherit({
  /**
   * Creates a Token object with a given set of information in options hash.
   * @option options token [String] represents the literal token string.
   * @option options expireTime [Date] field representing the time at which
   *   the token expires.
   * @example Create a token object
   *   var token = new AWS.Token({ token: 'token' });
   */
  constructor: function Token(options) {
    // hide token from being displayed with util.inspect
    AWS.util.hideProperties(this, ['token']);

    this.expired = false;
    this.expireTime = null;
    this.refreshCallbacks = [];
    if (arguments.length === 1) {
      var options = arguments[0];
      this.token = options.token;
      this.expireTime = options.expireTime;
    }
  },

  /**
   * @return [Integer] the number of seconds before {expireTime} during which
   *   the token will be considered expired.
   */
  expiryWindow: 15,

  /**
   * @return [Boolean] whether the Token object should call {refresh}
   * @note Subclasses should override this method to provide custom refresh
   *   logic.
   */
  needsRefresh: function needsRefresh() {
    var currentTime = AWS.util.date.getDate().getTime();
    var adjustedTime = new Date(currentTime + this.expiryWindow * 1000);

    if (this.expireTime && adjustedTime > this.expireTime)
      return true;

    return this.expired || !this.token;
  },

  /**
   * Gets the existing token, refreshing them if they are not yet loaded
   * or have expired. Users should call this method before using {refresh},
   * as this will not attempt to reload token when they are already
   * loaded into the object.
   *
   * @callback callback function(err)
   *   When this callback is called with no error, it means either token
   *   do not need to be refreshed or refreshed token information has
   *   been loaded into the object (as the `token` property).
   *   @param err [Error] if an error occurred, this value will be filled
   */
  get: function get(callback) {
    var self = this;
    if (this.needsRefresh()) {
      this.refresh(function(err) {
        if (!err) self.expired = false; // reset expired flag
        if (callback) callback(err);
      });
    } else if (callback) {
      callback();
    }
  },

  /**
   * @!method  getPromise()
   *   Returns a 'thenable' promise.
   *   Gets the existing token, refreshing it if it's not yet loaded
   *   or have expired. Users should call this method before using {refresh},
   *   as this will not attempt to reload token when it's already
   *   loaded into the object.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function()
   *     Called if the promise is fulfilled. When this callback is called, it means
   *     either token does not need to be refreshed or refreshed token information
   *     has been loaded into the object (as the `token` property).
   *   @callback rejectedCallback function(err)
   *     Called if the promise is rejected.
   *     @param err [Error] if an error occurred, this value will be filled.
   *   @return [Promise] A promise that represents the state of the `get` call.
   *   @example Calling the `getPromise` method.
   *     var promise = tokenProvider.getPromise();
   *     promise.then(function() { ... }, function(err) { ... });
   */

  /**
   * @!method  refreshPromise()
   *   Returns a 'thenable' promise.
   *   Refreshes the token. Users should call {get} before attempting
   *   to forcibly refresh token.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function()
   *     Called if the promise is fulfilled. When this callback is called, it
   *     means refreshed token information has been loaded into the object
   *     (as the `token` property).
   *   @callback rejectedCallback function(err)
   *     Called if the promise is rejected.
   *     @param err [Error] if an error occurred, this value will be filled.
   *   @return [Promise] A promise that represents the state of the `refresh` call.
   *   @example Calling the `refreshPromise` method.
   *     var promise = tokenProvider.refreshPromise();
   *     promise.then(function() { ... }, function(err) { ... });
   */

  /**
   * Refreshes the token. Users should call {get} before attempting
   * to forcibly refresh token.
   *
   * @callback callback function(err)
   *   When this callback is called with no error, it means refreshed
   *   token information has been loaded into the object (as the
   *   `token` property).
   *   @param err [Error] if an error occurred, this value will be filled
   * @note Subclasses should override this class to reset the
   *   {token} on the token object and then call the callback with
   *   any error information.
   * @see get
   */
  refresh: function refresh(callback) {
    this.expired = false;
    callback();
  },

  /**
   * @api private
   * @param callback
   */
  coalesceRefresh: function coalesceRefresh(callback, sync) {
    var self = this;
    if (self.refreshCallbacks.push(callback) === 1) {
      self.load(function onLoad(err) {
        AWS.util.arrayEach(self.refreshCallbacks, function(callback) {
          if (sync) {
            callback(err);
          } else {
            // callback could throw, so defer to ensure all callbacks are notified
            AWS.util.defer(function () {
              callback(err);
            });
          }
        });
        self.refreshCallbacks.length = 0;
      });
    }
  },

  /**
   * @api private
   * @param callback
   */
  load: function load(callback) {
    callback();
  }
});

/**
 * @api private
 */
AWS.Token.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
  this.prototype.getPromise = AWS.util.promisifyMethod('get', PromiseDependency);
  this.prototype.refreshPromise = AWS.util.promisifyMethod('refresh', PromiseDependency);
};

/**
 * @api private
 */
AWS.Token.deletePromisesFromClass = function deletePromisesFromClass() {
  delete this.prototype.getPromise;
  delete this.prototype.refreshPromise;
};

AWS.util.addPromises(AWS.Token);
