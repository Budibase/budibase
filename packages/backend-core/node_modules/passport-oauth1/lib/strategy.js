// Load modules.
var passport = require('passport-strategy')
  , url = require('url')
  , util = require('util')
  , utils = require('./utils')
  , OAuth = require('oauth').OAuth
  , TokenStore = require('./requesttoken/session')
  , StateStore = require('./requesttoken/state')
  , InternalOAuthError = require('./errors/internaloautherror');


/**
 * Creates an instance of `OAuthStrategy`.
 *
 * The OAuth authentication strategy authenticates requests using the OAuth
 * protocol.
 *
 * OAuth provides a facility for delegated authentication, whereby users can
 * authenticate using a third-party service such as Twitter.  Delegating in this
 * manner involves a sequence of events, including redirecting the user to the
 * third-party service for authorization.  Once authorization has been obtained,
 * the user is redirected back to the application and a token can be used to
 * obtain credentials.
 *
 * Applications must supply a `verify` callback, for which the function
 * signature is:
 *
 *     function(token, tokenSecret, profile, cb) { ... }
 *
 * The verify callback is responsible for finding or creating the user, and
 * invoking `cb` with the following arguments:
 *
 *     done(err, user, info);
 *
 * `user` should be set to `false` to indicate an authentication failure.
 * Additional `info` can optionally be passed as a third argument, typically
 * used to display informational messages.  If an exception occured, `err`
 * should be set.
 *
 * Options:
 *
 *   - `requestTokenURL`       URL used to obtain an unauthorized request token
 *   - `accessTokenURL`        URL used to exchange a user-authorized request token for an access token
 *   - `userAuthorizationURL`  URL used to obtain user authorization
 *   - `consumerKey`           identifies client to service provider
 *   - `consumerSecret`        secret used to establish ownership of the consumer key
 *   - 'signatureMethod'       signature method used to sign the request (default: 'HMAC-SHA1')
 *   - `callbackURL`           URL to which the service provider will redirect the user after obtaining authorization
 *   - `passReqToCallback`     when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new OAuthStrategy({
 *         requestTokenURL: 'https://www.example.com/oauth/request_token',
 *         accessTokenURL: 'https://www.example.com/oauth/access_token',
 *         userAuthorizationURL: 'https://www.example.com/oauth/authorize',
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/example/callback'
 *       },
 *       function(token, tokenSecret, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function OAuthStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = undefined;
  }
  options = options || {};
  
  if (!verify) { throw new TypeError('OAuthStrategy requires a verify callback'); }
  if (!options.requestTokenURL) { throw new TypeError('OAuthStrategy requires a requestTokenURL option'); }
  if (!options.accessTokenURL) { throw new TypeError('OAuthStrategy requires a accessTokenURL option'); }
  if (!options.userAuthorizationURL) { throw new TypeError('OAuthStrategy requires a userAuthorizationURL option'); }
  if (!options.consumerKey) { throw new TypeError('OAuthStrategy requires a consumerKey option'); }
  if (options.consumerSecret === undefined) { throw new TypeError('OAuthStrategy requires a consumerSecret option'); }
  
  passport.Strategy.call(this);
  this.name = 'oauth';
  this._verify = verify;
  
  // NOTE: The _oauth property is considered "protected".  Subclasses are
  //       allowed to use it when making protected resource requests to retrieve
  //       the user profile.
  this._oauth = new OAuth(options.requestTokenURL, options.accessTokenURL,
                          options.consumerKey,  options.consumerSecret,
                          '1.0', null, options.signatureMethod || 'HMAC-SHA1',
                          null, options.customHeaders);
  
  this._userAuthorizationURL = options.userAuthorizationURL;
  this._callbackURL = options.callbackURL;
  this._key = options.sessionKey || 'oauth';
  var store = options.store || options.requestTokenStore;
  if (store && typeof store == 'object') {
    this._requestTokenStore = store;
  } else if (store) {
    this._requestTokenStore = new StateStore({ key: this._key })
  } else {
    this._requestTokenStore = new TokenStore({ key: this._key });
  }
  this._trustProxy = options.proxy;
  this._passReqToCallback = options.passReqToCallback;
  this._skipUserProfile = (options.skipUserProfile === undefined) ? false : options.skipUserProfile;
}

// Inherit from `passport.Strategy`.
util.inherits(OAuthStrategy, passport.Strategy);


/**
 * Authenticate request by delegating to a service provider using OAuth.
 *
 * @param {Object} req
 * @api protected
 */
OAuthStrategy.prototype.authenticate = function(req, options) {
  options = options || {};
  
  var self = this;
  var meta = {
    requestTokenURL: this._oauth._requestUrl,
    accessTokenURL: this._oauth._accessUrl,
    userAuthorizationURL:  this._userAuthorizationURL,
    consumerKey: this._oauth._consumerKey
  }
  
  if (req.query && req.query.oauth_token) {
    // The request being authenticated contains an oauth_token parameter in the
    // query portion of the URL.  This indicates that the service provider has
    // redirected the user back to the application, after authenticating the
    // user and obtaining their authorization.
    //
    // The value of the oauth_token parameter is the request token.  Together
    // with knowledge of the token secret (stored in the session), the request
    // token can be exchanged for an access token and token secret.
    //
    // This access token and token secret, along with the optional ability to
    // fetch profile information from the service provider, is sufficient to
    // establish the identity of the user.
    var oauthToken = req.query.oauth_token;
    
    function loaded(err, oauthTokenSecret, state) {
      if (err) { return self.error(err); }
      if (!oauthTokenSecret) {
        return self.fail(state, 403);
      }
    
      // NOTE: The oauth_verifier parameter will be supplied in the query portion
      //       of the redirect URL, if the server supports OAuth 1.0a.
      var oauthVerifier = req.query.oauth_verifier || null;
    
      self._oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, function(err, token, tokenSecret, params) {
        if (err) { return self.error(self._createOAuthError('Failed to obtain access token', err)); }
      
        function destroyed(err) {
          if (err) { return self.error(err); }
      
          self._loadUserProfile(token, tokenSecret, params, function(err, profile) {
            if (err) { return self.error(err); }
        
            function verified(err, user, info) {
              if (err) { return self.error(err); }
              if (!user) { return self.fail(info); }
              
              info = info || {};
              if (state) { info.state = state; }
              self.success(user, info);
            }
        
            try {
              if (self._passReqToCallback) {
                var arity = self._verify.length;
                if (arity == 6) {
                  self._verify(req, token, tokenSecret, params, profile, verified);
                } else { // arity == 5
                  self._verify(req, token, tokenSecret, profile, verified);
                }
              } else {
                var arity = self._verify.length;
                if (arity == 5) {
                  self._verify(token, tokenSecret, params, profile, verified);
                } else { // arity == 4
                  self._verify(token, tokenSecret, profile, verified);
                }
              }
            } catch (ex) {
              return self.error(ex);
            }
          });
        }
      
        // The request token has been exchanged for an access token.  Since the
        // request token is a single-use token, that data can be removed from the
        // store.
        try {
          var arity = self._requestTokenStore.destroy.length;
          if (arity == 4) {
            self._requestTokenStore.destroy(req, oauthToken, meta, destroyed);
          } else { // arity == 3
            self._requestTokenStore.destroy(req, oauthToken, destroyed);
          }
        } catch (ex) {
          return self.error(ex);
        }
      });
    }
    
    try {
      var arity = self._requestTokenStore.get.length;
      if (arity == 4) {
        this._requestTokenStore.get(req, oauthToken, meta, loaded);
      } else { // arity == 3
        this._requestTokenStore.get(req, oauthToken, loaded);
      }
    } catch (ex) {
      return this.error(ex);
    }
  } else {
    // In order to authenticate via OAuth, the application must obtain a request
    // token from the service provider and redirect the user to the service
    // provider to obtain their authorization.  After authorization has been
    // approved the user will be redirected back the application, at which point
    // the application can exchange the request token for an access token.
    //
    // In order to successfully exchange the request token, its corresponding
    // token secret needs to be known.  The token secret will be temporarily
    // stored in the session, so that it can be retrieved upon the user being
    // redirected back to the application.
    
    var params = this.requestTokenParams(options);
    var callbackURL = options.callbackURL || this._callbackURL;
    if (callbackURL) {
      var parsed = url.parse(callbackURL);
      if (!parsed.protocol) {
        // The callback URL is relative, resolve a fully qualified URL from the
        // URL of the originating request.
        callbackURL = url.resolve(utils.originalURL(req, { proxy: this._trustProxy }), callbackURL);
      }
    }
    params.oauth_callback = callbackURL;
    
    this._oauth.getOAuthRequestToken(params, function(err, token, tokenSecret, params) {
      if (err) { return self.error(self._createOAuthError('Failed to obtain request token', err)); }
      
      // NOTE: params will contain an oauth_callback_confirmed property set to
      //       true, if the server supports OAuth 1.0a.
      //       { oauth_callback_confirmed: 'true' }

      var state = options.state;

      function stored(err) {
        if (err) { return self.error(err); }

        var parsed = url.parse(self._userAuthorizationURL, true);
        parsed.query.oauth_token = token;
        if (!params.oauth_callback_confirmed && callbackURL) {
          // NOTE: If oauth_callback_confirmed=true is not present when issuing a
          //       request token, the server does not support OAuth 1.0a.  In this
          //       circumstance, `oauth_callback` is passed when redirecting the
          //       user to the service provider.
          parsed.query.oauth_callback = callbackURL;
        }
        utils.merge(parsed.query, self.userAuthorizationParams(options));
        delete parsed.search;
        var location = url.format(parsed);
        self.redirect(location);
      }

      try {
        var arity = self._requestTokenStore.set.length;
        if (arity == 6) {
          self._requestTokenStore.set(req, token, tokenSecret, state, meta, stored);
        } else if (arity == 5) {
          self._requestTokenStore.set(req, token, tokenSecret, meta, stored);
        } else { // arity == 4
          self._requestTokenStore.set(req, token, tokenSecret, stored);
        }
      } catch (ex) {
        return self.error(ex);
      }
    });
  }
};

/**
 * Retrieve user profile from service provider.
 *
 * OAuth-based authentication strategies can overrride this function in order to
 * load the user's profile from the service provider.  This assists applications
 * (and users of those applications) in the initial registration process by
 * automatically submitting required information.
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
OAuthStrategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  return done(null, {});
};

/**
 * Return extra parameters to be included in the request token request.
 *
 * Some OAuth providers require additional parameters to be included when
 * issuing a request token.  Since these parameters are not standardized by the
 * OAuth specification, OAuth-based authentication strategies can overrride this
 * function in order to populate these parameters as required by the provider.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
OAuthStrategy.prototype.requestTokenParams = function(options) {
  return {};
};

/**
 * Return extra parameters to be included in the user authorization request.
 *
 * Some OAuth providers allow additional, non-standard parameters to be included
 * when requesting authorization.  Since these parameters are not standardized
 * by the OAuth specification, OAuth-based authentication strategies can
 * overrride this function in order to populate these parameters as required by
 * the provider.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
OAuthStrategy.prototype.userAuthorizationParams = function(options) {
  return {};
};

/**
 * Parse error response from OAuth endpoint.
 *
 * OAuth-based authentication strategies can overrride this function in order to
 * parse error responses received from the request token and access token
 * endpoints, allowing the most informative message to be displayed.
 *
 * If this function is not overridden, a generic error will be thrown.
 *
 * @param {String} body
 * @param {Number} status
 * @return {Error}
 * @api protected
 */
OAuthStrategy.prototype.parseErrorResponse = function(body, status) {
  return null;
};

/**
 * Load user profile, contingent upon options.
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api private
 */
OAuthStrategy.prototype._loadUserProfile = function(token, tokenSecret, params, done) {
  var self = this;
  
  function loadIt() {
    return self.userProfile(token, tokenSecret, params, done);
  }
  function skipIt() {
    return done(null);
  }
  
  if (typeof this._skipUserProfile == 'function' && this._skipUserProfile.length > 1) {
    // async
    this._skipUserProfile(token, tokenSecret, function(err, skip) {
      if (err) { return done(err); }
      if (!skip) { return loadIt(); }
      return skipIt();
    });
  } else {
    var skip = (typeof this._skipUserProfile == 'function') ? this._skipUserProfile() : this._skipUserProfile;
    if (!skip) { return loadIt(); }
    return skipIt();
  }
};

/**
 * Create an OAuth error.
 *
 * @param {String} message
 * @param {Object|Error} err
 * @api private
 */
OAuthStrategy.prototype._createOAuthError = function(message, err) {
  var e;
  if (err.statusCode && err.data) {
    try {
      e = this.parseErrorResponse(err.data, err.statusCode);
    } catch (_) {}
  }
  if (!e) { e = new InternalOAuthError(message, err); }
  return e;
};


// Expose constructor.
module.exports = OAuthStrategy;
