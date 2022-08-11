/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Riptide Cloud
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (module, passport, util, gapi) {
    'use strict';

    var requiredArgs = [
            {
                name: 'clientId',
                type: 'string'
            },
            {
                name: 'clientSecret',
                type: 'string'
            },
            {
                name: 'callbackURL',
                type: 'string'
            }
        ],
        optionalArgs = [
            {
                name: 'accessType',
                type: 'string'
            },
            {
                name: 'skipUserProfile',
                type: 'boolean'
            },
            {
                name: 'passReqToCallback',
                type: 'boolean'
            }
        ];

    /**
     * Creates an instance of `GoogleOAuth2Strategy`.
     *
     * The Google OAuth 2.0  authentication strategy authenticates requests by delegating
     * to Google's OAuth 2.0 authentication implementation in their Node.JS API.
     *
     * OAuth 2.0 provides a facility for delegated authentication, whereby users can
     * authenticate using a third-party service such as Facebook.  Delegating in
     * this manner involves a sequence of events, including redirecting the user to
     * the third-party service for authorization.  Once authorization has been
     * granted, the user is redirected back to the application and an authorization
     * code can be used to obtain credentials.
     *
     * Applications must supply a `verify` callback, for which the function
     * signature is:
     *
     *     function(accessToken, refreshToken, profile, done) { ... }
     *
     * The verify callback is responsible for finding or creating the user, and
     * invoking `done` with the following arguments:
     *
     *     done(err, user, info);
     *
     * `user` should be set to `false` to indicate an authentication failure.
     * Additional `info` can optionally be passed as a third argument, typically
     * used to display informational messages.  If an exception occured, `err`
     * should be set.
     *
     * Options:
     *   - `clientId`          `String` identifies the client to the service provider **Required**
     *   - `clientSecret`      `String` secret used to establish ownershup of the client identifier **Required**
     *   - `callbackURL`       `String` URL to which the service provider will redirect the user after obtaining authorization. **Required**
     *   - `accessType`        `String` Type of access to be requested from the service provider. Can be `online` (default) or `offline` (gets refresh_token) _Optional_
     *   - `scope`             `String` or `Array` representing the permission scopes to request access to. (default: `https://www.googleapis.com/auth/userinfo.email`) _Optional_
     *   - `skipUserProfile`   `Boolean` If set to false, profile information will be retrieved from Google+. (default: `true`) _Optional_
     *   - `passReqToCallback` `Boolean` When `true`, `req` is the first argument to the verify callback (default: `false`)
     *
     * Examples:
     *     passport.use(new GoogleOAuth2Strategy({
     *         clientID: '123-456-789',
     *         clientSecret: 'shhh-its-a-secret',
     *         callbackURL: 'https://www.example.com/auth/example/callback'
     *       },
     *       function(accessToken, refreshToken, profile, done) {
     *         User.findOrCreate(..., function (err, user) {
     *           done(err, user);
     *         });
     *       }
     *     ));
     *
     * @constructor
     * @param {Object} options
     * @param {Function} verify
     * @api public
     */
    function GoogleOAuth2Strategy(options, verify) {
        var self = this;

        if (typeof options === 'function') {
            verify = options;
            options = {};
        }
        if (!verify) {
            throw new Error('GoogleOAuth2Strategy requires a verify callback');
        }

        requiredArgs.forEach(function (arg) {
            if (!options[arg.name]) {
                throw new Error(util.format('GoogleOAuth2Strategy requires a [%s]', arg.name));
            } else if (typeof options[arg.name] !== arg.type) {
                throw new Error(util.format('GoogleOAuth2Strategy expects [%s] to be a [%s] but it was a [%s]', arg.name, arg.type, typeof options[arg.name]));
            }
            // If we've passed the checks, go ahead and set it in the current object.
            self[arg.name] = options[arg.name];
        });

        optionalArgs.forEach(function (arg) {
            if (options[arg.name] && typeof options[arg.name] !== arg.type) {
                throw new Error(util.format('GoogleOAuth2Strategy expects [%s] to be a [%s] but it was a [%s]', arg.name, arg.type, typeof options[arg.name]));
            }
            // If we've passed the checks, go ahead and set it in the current object.
            self[arg.name] = options[arg.name];
        });

        if (options.scope && (typeof options.scope !== 'string' && !Array.isArray(options.scope))) {
            throw new Error(util.format('GoogleOAuth2Strategy expects [%s] to be a [%s] but it was a [%s]', 'scope', 'array or string', typeof options.scope));
        }

        self.scope = options.scope || 'https://www.googleapis.com/auth/userinfo.email';

        passport.Strategy.call(self);
        self.name = 'google';
        self.verify = verify;

        if (!self.skipUserProfile) {
            self.googlePlus = gapi.plus('v1');
        }
    }

    /**
     * Inherit from `passport.Strategy`.
     */
    util.inherits(GoogleOAuth2Strategy, passport.Strategy);

    /**
     * Authenticate request by delegating to Google service provider using OAuth 2.0.
     *
     * @param {Object} req
     * @param {Object} options
     * @api protected
     */
    GoogleOAuth2Strategy.prototype.authenticate = function (req, options) {
        options = options || {};

        var self = this,
            scope = options.scope || self.scope,
            accessType = options.accessType || self.accessType,
            url,
            oauth2Client = new gapi.auth.OAuth2(self.clientId, self.clientSecret, self.callbackURL);

        if (req.query && req.query.code) {
            // If we are handling a callback with an auth code.
            oauth2Client.getToken(req.query.code, function (err, tokens) {
                if (err) {
                    return self.error(new Error('Failed to obtain access token ' + err.message));
                }

                /* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
                /* jshint camelcase: false */
                self.loadUserProfile(tokens.access_token, tokens.refresh_token, function (err, profile) {
                    /* jscs: enable requireCamelCaseOrUpperCaseIdentifiers */
                    /* jshint camelcase: true */
                    if (err) {
                        return self.error(new Error('Failed to retrieve user profile ' + err.message));
                    }

                    function verified(err, user, info) {
                        if (err) {
                            return self.error(err);
                        }
                        if (!user) {
                            return self.fail(info);
                        }
                        user.provider = self.name;
                        self.success(user, info);
                    }

                    try {
                        if (self.passReqToCallback) {
                            /* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
                            /* jshint camelcase: false */
                            self.verify(req, tokens.access_token, tokens.refresh_token, profile, verified);
                            /* jscs: enab;e requireCamelCaseOrUpperCaseIdentifiers */
                            /* jshint camelcase: true */
                        } else {
                            /* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
                            /* jshint camelcase: false */
                            self.verify(tokens.access_token, tokens.refresh_token, profile, verified);
                            /* jscs: enable requireCamelCaseOrUpperCaseIdentifiers */
                            /* jshint camelcase: true */
                        }
                    } catch (err) {
                        self.error(err);
                    }
                });
            });
        } else {
            // If we haven't yet delegated the user to Google's authentication do so.
            url = oauth2Client.generateAuthUrl(
                {
                    /* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
                    /* jshint camelcase: false */
                    access_type: accessType,
                    /* jscs: enable requireCamelCaseOrUpperCaseIdentifiers */
                    /* jshint camelcase: true */
                    scope: scope
                }
            );
            return self.redirect(url);
        }

    };

    /**
     * Load user profile, contingent upon options.
     *
     * @param accessToken
     * @param refreshToken
     * @param done
     * @api private
     */
    GoogleOAuth2Strategy.prototype.loadUserProfile = function (accessToken, refreshToken, done) {
        var self = this,
            oauth2Client = new gapi.auth.OAuth2(self.clientId, self.clientSecret, self.callbackURL);

        /* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
        /* jshint camelcase: false */
        oauth2Client.setCredentials(
            {
                access_token: accessToken,
                refresh_token: refreshToken
            }
        );
        /* jscs: enable requireCamelCaseOrUpperCaseIdentifiers */
        /* jshint camelcase: true */

        if (self.skipUserProfile) {
            return done(null);
        }

        self.googlePlus.people.get(
            {
                userId: 'me',
                auth: oauth2Client
            }, function (err, response) {
                done(err, response);
            }
        );
    };

    /**
     * Expose `GoogleOAuth2Strategy` directly from package.
     */
    module.exports = GoogleOAuth2Strategy;
}(module, require('passport-strategy'), require('util'), require('googleapis')));
