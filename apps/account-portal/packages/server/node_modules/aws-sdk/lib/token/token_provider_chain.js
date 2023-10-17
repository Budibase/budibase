var AWS = require('../core');

/**
 * Creates a token provider chain that searches for token in a list of
 * token providers specified by the {providers} property.
 *
 * By default, the chain will use the {defaultProviders} to resolve token.
 *
 * ## Setting Providers
 *
 * Each provider in the {providers} list should be a function that returns
 * a {AWS.Token} object, or a hardcoded token object. The function
 * form allows for delayed execution of the Token construction.
 *
 * ## Resolving Token from a Chain
 *
 * Call {resolve} to return the first valid token object that can be
 * loaded by the provider chain.
 *
 * For example, to resolve a chain with a custom provider that checks a file
 * on disk after the set of {defaultProviders}:
 *
 * ```javascript
 * var diskProvider = new FileTokenProvider('./token.json');
 * var chain = new AWS.TokenProviderChain();
 * chain.providers.push(diskProvider);
 * chain.resolve();
 * ```
 *
 * The above code will return the `diskProvider` object if the
 * file contains token and the `defaultProviders` do not contain
 * any token.
 *
 * @!attribute providers
 *   @return [Array<AWS.Token, Function>]
 *     a list of token objects or functions that return token
 *     objects. If the provider is a function, the function will be
 *     executed lazily when the provider needs to be checked for valid
 *     token. By default, this object will be set to the {defaultProviders}.
 *   @see defaultProviders
 */
AWS.TokenProviderChain = AWS.util.inherit(AWS.Token, {

  /**
   * Creates a new TokenProviderChain with a default set of providers
   * specified by {defaultProviders}.
   */
  constructor: function TokenProviderChain(providers) {
    if (providers) {
      this.providers = providers;
    } else {
      this.providers = AWS.TokenProviderChain.defaultProviders.slice(0);
    }
    this.resolveCallbacks = [];
  },

  /**
   * @!method  resolvePromise()
   *   Returns a 'thenable' promise.
   *   Resolves the provider chain by searching for the first token in {providers}.
   *
   *   Two callbacks can be provided to the `then` method on the returned promise.
   *   The first callback will be called if the promise is fulfilled, and the second
   *   callback will be called if the promise is rejected.
   *   @callback fulfilledCallback function(token)
   *     Called if the promise is fulfilled and the provider resolves the chain
   *     to a token object
   *     @param token [AWS.Token] the token object resolved by the provider chain.
   *   @callback rejectedCallback function(error)
   *     Called if the promise is rejected.
   *     @param err [Error] the error object returned if no token is found.
   *   @return [Promise] A promise that represents the state of the `resolve` method call.
   *   @example Calling the `resolvePromise` method.
   *     var promise = chain.resolvePromise();
   *     promise.then(function(token) { ... }, function(err) { ... });
   */

  /**
   * Resolves the provider chain by searching for the first token in {providers}.
   *
   * @callback callback function(err, token)
   *   Called when the provider resolves the chain to a token object
   *   or null if no token can be found.
   *
   *   @param err [Error] the error object returned if no token is found.
   *   @param token [AWS.Token] the token object resolved by the provider chain.
   * @return [AWS.TokenProviderChain] the provider, for chaining.
   */
  resolve: function resolve(callback) {
    var self = this;
    if (self.providers.length === 0) {
      callback(new Error('No providers'));
      return self;
    }

    if (self.resolveCallbacks.push(callback) === 1) {
      var index = 0;
      var providers = self.providers.slice(0);

      function resolveNext(err, token) {
        if ((!err && token) || index === providers.length) {
          AWS.util.arrayEach(self.resolveCallbacks, function (callback) {
            callback(err, token);
          });
          self.resolveCallbacks.length = 0;
          return;
        }

        var provider = providers[index++];
        if (typeof provider === 'function') {
          token = provider.call();
        } else {
          token = provider;
        }

        if (token.get) {
          token.get(function (getErr) {
            resolveNext(getErr, getErr ? null : token);
          });
        } else {
          resolveNext(null, token);
        }
      }

      resolveNext();
    }

    return self;
  }
});

/**
 * The default set of providers used by a vanilla TokenProviderChain.
 *
 * In the browser:
 *
 * ```javascript
 * AWS.TokenProviderChain.defaultProviders = []
 * ```
 *
 * In Node.js:
 *
 * ```javascript
 * AWS.TokenProviderChain.defaultProviders = [
 *   function () { return new AWS.SSOTokenProvider(); },
 * ]
 * ```
 */
AWS.TokenProviderChain.defaultProviders = [];

/**
 * @api private
 */
AWS.TokenProviderChain.addPromisesToClass = function addPromisesToClass(PromiseDependency) {
  this.prototype.resolvePromise = AWS.util.promisifyMethod('resolve', PromiseDependency);
};

/**
 * @api private
 */
AWS.TokenProviderChain.deletePromisesFromClass = function deletePromisesFromClass() {
  delete this.prototype.resolvePromise;
};

AWS.util.addPromises(AWS.TokenProviderChain);
