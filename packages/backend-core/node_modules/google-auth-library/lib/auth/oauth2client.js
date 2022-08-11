/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var AuthClient = require('./authclient.js');
var LoginTicket = require('./loginticket.js');
var noop = require('lodash.noop');
var PemVerifier = require('./../pemverifier.js');
var querystring = require('querystring');
var util = require('util');

var certificateCache = null;
var certificateExpiry = null;

/**
 * Handles OAuth2 flow for Google APIs.
 *
 * @param {string} clientId The authentication client ID.
 * @param {string} clientSecret The authentication client secret.
 * @param {string} redirectUri The URI to redirect to after completing the auth request.
 * @param {Object} opt_opts optional options for overriding the given parameters.
 * @constructor
 */
function OAuth2Client(clientId, clientSecret, redirectUri, opt_opts) {
  OAuth2Client.super_.call(this);

  this.clientId_ = clientId;
  this.clientSecret_ = clientSecret;
  this.redirectUri_ = redirectUri;
  this.opts = opt_opts || {};
  this.credentials = {};
}

/**
 * Inherit from AuthClient.
 */
util.inherits(OAuth2Client, AuthClient);

/**
 * The base URL for auth endpoints.
 * @const
 * @private
 */
OAuth2Client.GOOGLE_OAUTH2_AUTH_BASE_URL_ =
  'https://accounts.google.com/o/oauth2/auth';

/**
 * The base endpoint for token retrieval.
 * @const
 * @private
 */
OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_ =
  'https://accounts.google.com/o/oauth2/token';

/**
 * The base endpoint to revoke tokens.
 * @const
 * @private
 */
OAuth2Client.GOOGLE_OAUTH2_REVOKE_URL_ =
  'https://accounts.google.com/o/oauth2/revoke';

/**
 * Google Sign on certificates.
 * @const
 * @private
 */
OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_CERTS_URL_ =
  'https://www.googleapis.com/oauth2/v1/certs';

/**
 * Clock skew - five minutes in seconds
 * @const
 * @private
 */
OAuth2Client.CLOCK_SKEW_SECS_ = 300;

/**
 * Max Token Lifetime is one day in seconds
 * @const
 * @private
 */
OAuth2Client.MAX_TOKEN_LIFETIME_SECS_ = 86400;

/**
 * The allowed oauth token issuers.
 * @const
 * @private
 */
OAuth2Client.ISSUERS_ = ['accounts.google.com', 'https://accounts.google.com'];

/**
 * Generates URL for consent page landing.
 * @param {object=} opt_opts Options.
 * @return {string} URL to consent page.
 */
OAuth2Client.prototype.generateAuthUrl = function(opt_opts) {
  var opts = opt_opts || {};
  opts.response_type = opts.response_type || 'code';
  opts.client_id = opts.client_id || this.clientId_;
  opts.redirect_uri = opts.redirect_uri || this.redirectUri_;

  // Allow scopes to be passed either as array or a string
  if (opts.scope instanceof Array) {
    opts.scope = opts.scope.join(' ');
  }

  var rootUrl = this.opts.authBaseUrl ||
    OAuth2Client.GOOGLE_OAUTH2_AUTH_BASE_URL_;

  return rootUrl + '?' + querystring.stringify(opts);
};

/**
 * Gets the access token for the given code.
 * @param {string} code The authorization code.
 * @param {function=} opt_callback Optional callback fn.
 */
OAuth2Client.prototype.getToken = function(code, opt_callback) {
  var uri = this.opts.tokenUrl || OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_;
  var values = {
    code: code,
    client_id: this.clientId_,
    client_secret: this.clientSecret_,
    redirect_uri: this.redirectUri_,
    grant_type: 'authorization_code'
  };

  this.transporter.request({
    method: 'POST',
    uri: uri,
    form: values,
    json: true
  }, function(err, tokens, response) {
    if (!err && tokens && tokens.expires_in) {
      tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
      delete tokens.expires_in;
    }
    var done = opt_callback || noop;
    done(err, tokens, response);
  });
};

/**
 * Refreshes the access token.
 * @param {string} refresh_token Existing refresh token.
 * @param {function=} opt_callback Optional callback.
 * @private
 */
OAuth2Client.prototype.refreshToken_ = function(refresh_token, opt_callback) {
  var uri = this.opts.tokenUrl || OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_;
  var values = {
    refresh_token: refresh_token,
    client_id: this.clientId_,
    client_secret: this.clientSecret_,
    grant_type: 'refresh_token'
  };

  // request for new token
  return this.transporter.request({
    method: 'POST',
    uri: uri,
    form: values,
    json: true
  }, function(err, tokens, response) {
    if (!err && tokens && tokens.expires_in) {
      tokens.expiry_date = ((new Date()).getTime() + (tokens.expires_in * 1000));
      delete tokens.expires_in;
    }
    var done = opt_callback || noop;
    done(err, tokens, response);
  });
};

/**
 * Retrieves the access token using refresh token
 *
 * @deprecated use getRequestMetadata instead.
 * @param {function} callback callback
 */
OAuth2Client.prototype.refreshAccessToken = function(callback) {
  var that = this;

  if (!this.credentials.refresh_token) {
    callback(new Error('No refresh token is set.'), null);
    return;
  }

  this.refreshToken_(this.credentials.refresh_token, function(err, result, response) {
    if (err) {
      callback(err, null, response);
    } else {
      var tokens = result;
      tokens.refresh_token = that.credentials.refresh_token;
      that.credentials = tokens;
      callback(null, that.credentials, response);
    }
  });
};

/**
 * Get a non-expired access token, after refreshing if necessary
 *
 * @param {function} callback Callback to call with the access token
 */
OAuth2Client.prototype.getAccessToken = function(callback) {
  var credentials = this.credentials;
  var expiryDate = credentials.expiry_date;

  // if no expiry time, assume it's not expired
  var isTokenExpired = expiryDate ? expiryDate <= (new Date()).getTime() : false;

  if (!credentials.access_token && !credentials.refresh_token) {
    return callback(new Error('No access or refresh token is set.'), null);
  }

  var shouldRefresh = !credentials.access_token || isTokenExpired;
  if (shouldRefresh && credentials.refresh_token) {
    if (!this.credentials.refresh_token) {
      return callback(new Error('No refresh token is set.'), null);
    }

    this.refreshAccessToken(function(err, tokens, response) {
      if (err) {
        return callback(err, null, response);
      }
      if (!tokens || (tokens && !tokens.access_token)) {
        return callback(new Error('Could not refresh access token.'), null, response);
      }
      return callback(null, tokens.access_token, response);
    });
  } else {
    return callback(null, credentials.access_token, null);
  }
};

/**
 * getRequestMetadata obtains auth metadata to be used by requests.
 *
 * getRequestMetadata is the main authentication interface.  It takes an
 * optional uri which when present is the endpoint being accessed, and a
 * callback func(err, metadata_obj, response) where metadata_obj contains
 * authorization metadata fields and response is an optional response object.
 *
 * In OAuth2Client, metadata_obj has the form.
 *
 * {Authorization: 'Bearer <access_token_value>'}
 *
 * @param {string} opt_uri the Uri being authorized
 * @param {function} metadataCb the func described above
 */
OAuth2Client.prototype.getRequestMetadata = function(opt_uri, metadataCb) {
  var that = this;
  var thisCreds = this.credentials;

  if (!thisCreds.access_token && !thisCreds.refresh_token) {
    return metadataCb(new Error('No access or refresh token is set.'), null);
  }

  // if no expiry time, assume it's not expired
  var expiryDate = thisCreds.expiry_date;
  var isTokenExpired = expiryDate ? expiryDate <= (new Date()).getTime() : false;

  if (thisCreds.access_token && !isTokenExpired) {
    thisCreds.token_type = thisCreds.token_type || 'Bearer';
    var headers = {'Authorization': thisCreds.token_type + ' ' + thisCreds.access_token };
    return metadataCb(null, headers , null);
  }

  return this.refreshToken_(thisCreds.refresh_token, function(err, tokens, response) {
    if (err) {
      return metadataCb(err, null, response);
    } else {
      if (!tokens || (tokens && !tokens.access_token)) {
        return metadataCb(new Error('Could not refresh access token.'), null, response);
      }

      var credentials = that.credentials;
      credentials.token_type = credentials.token_type || 'Bearer';
      tokens.refresh_token = credentials.refresh_token;
      that.credentials = tokens;
      var headers = {'Authorization': credentials.token_type + ' ' + tokens.access_token };
      return metadataCb(err, headers , response);
    }
  });
};

/**
 * Revokes the access given to token.
 * @param {string} token The existing token to be revoked.
 * @param {function=} opt_callback Optional callback fn.
 */
OAuth2Client.prototype.revokeToken = function(token, opt_callback) {
  this.transporter.request({
    uri: OAuth2Client.GOOGLE_OAUTH2_REVOKE_URL_ +
      '?' + querystring.stringify({ token: token }),
    json: true
  }, opt_callback);
};

/**
 * Revokes access token and clears the credentials object
 * @param  {Function=} callback callback
 */
OAuth2Client.prototype.revokeCredentials = function(callback) {
  var token = this.credentials.access_token;
  this.credentials = {};
  if (token) {
    this.revokeToken(token, callback);
  } else {
    callback(new Error('No access token to revoke.'), null);
  }
};

/**
 * Provides a request implementation with OAuth 2.0 flow.
 * If credentials have a refresh_token, in cases of HTTP
 * 401 and 403 responses, it automatically asks for a new
 * access token and replays the unsuccessful request.
 * @param {object} opts Request options.
 * @param {function} callback callback.
 * @return {Request} Request object
 */
OAuth2Client.prototype.request = function(opts, callback) {
  /* jshint latedef:false */
  var that = this;

  // Callbacks will close over this to ensure that we only retry once
  var retry = true;

  // Hook the callback routine to call the _postRequest method.
  var postRequestCb = function(err, body, resp) {
    var statusCode = resp && resp.statusCode;
    // Automatically retry 401 and 403 responses
    // if err is set and is unrelated to response
    // then getting credentials failed, and retrying won't help
    if (retry && (statusCode === 401 || statusCode === 403) &&
        (!err || err.code === statusCode)) {
      /* It only makes sense to retry once, because the retry is intended to
       * handle expiration-related failures. If refreshing the token does not
       * fix the failure, then refreshing again probably won't help */
      retry = false;
      // Force token refresh
      that.refreshAccessToken(function() {
        that.getRequestMetadata(unusedUri, authCb);
      });
    } else {
      that._postRequest(err, body, resp, callback);
    }
  };

  var authCb = function(err, headers, response) {
    if (err) {
      postRequestCb(err, null, response);
    } else {
      if (headers) {
        opts.headers = opts.headers || {};
        opts.headers.Authorization = headers.Authorization;
      }
      return that._makeRequest(opts, postRequestCb);
    }
  };

  var unusedUri = null;
  return this.getRequestMetadata(unusedUri, authCb);
};

/**
 * Makes a request without paying attention to refreshing or anything
 * Assumes that all credentials are set correctly.
 * @param  {object}   opts     Options for request
 * @param  {Function} callback callback function
 * @return {Request}           The request object created
 */
OAuth2Client.prototype._makeRequest = function(opts, callback) {
  return this.transporter.request(opts, callback);
};

/**
 * Allows inheriting classes to inspect and alter the request result.
 * @param {object} err Error result.
 * @param {object} result The result.
 * @param {object} result The HTTP response.
 * @param {Function} callback The callback.
 * @private
 */
OAuth2Client.prototype._postRequest = function(err, result, response, callback) {
  callback(err, result, response);
};

/**
 * Verify id token is token by checking the certs and audience
 * @param {string} idToken ID Token.
 * @param {(string|Array.<string>)} audience The audience to verify against the ID Token
 * @param {function=} callback Callback supplying GoogleLogin if successful
 */
OAuth2Client.prototype.verifyIdToken = function(idToken, audience, callback) {
  if (!idToken || !callback) {
    throw new Error('The verifyIdToken method requires both ' +
      'an ID Token and a callback method');
  }

  this.getFederatedSignonCerts(function(err, certs) {
    if (err) {
      callback(err, null);
    }
    var login;
    try {
      login = this.verifySignedJwtWithCerts(idToken, certs, audience,
        OAuth2Client.ISSUERS_);
    } catch (err) {
      callback(err);
      return;
    }

    callback(null, login);
  }.bind(this));
};

/**
 * Gets federated sign-on certificates to use for verifying identity tokens.
 * Returns certs as array structure, where keys are key ids, and values
 * are PEM encoded certificates.
 * @param {function=} callback Callback supplying the certificates
 */
OAuth2Client.prototype.getFederatedSignonCerts = function(callback) {
  var nowTime = (new Date()).getTime();
  if (certificateExpiry && (nowTime < certificateExpiry.getTime())) {
    callback(null, certificateCache);
    return;
  }

  this.transporter.request({
    method: 'GET',
    uri: OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_CERTS_URL_,
    json: true
  }, function(err, body, response) {
    if (err) {
      callback('Failed to retrieve verification certificates: ' + err, null, response);
      return;
    }

    var cacheControl = response.headers['cache-control'];
    var cacheAge = -1;
    if (cacheControl) {
      var pattern = new RegExp('max-age=([0-9]*)');
      var regexResult = pattern.exec(cacheControl);
      if (regexResult.length === 2) {
        // Cache results with max-age (in seconds)
        cacheAge = regexResult[1] * 1000; // milliseconds
      }
    }

    var now = new Date();
    certificateExpiry = cacheAge === -1 ? null : new Date(now.getTime() + cacheAge);
    certificateCache = body;
    callback(null, body, response);
  });
};

/**
 * Verify the id token is signed with the correct certificate
 * and is from the correct audience.
 * @param {string} jwt The jwt to verify (The ID Token in this case).
 * @param {array} certs The array of certs to test the jwt against.
 * @param {(string|Array.<string>)} requiredAudience The audience to test the jwt against.
 * @param {array} issuers The allowed issuers of the jwt (Optional).
 * @param {string} maxExpiry The max expiry the certificate can be (Optional).
 * @return {LoginTicket} Returns a LoginTicket on verification.
 */
OAuth2Client.prototype.verifySignedJwtWithCerts =
  function(jwt, certs, requiredAudience, issuers, maxExpiry) {

    if (!maxExpiry) {
      maxExpiry = OAuth2Client.MAX_TOKEN_LIFETIME_SECS_;
    }

    var segments = jwt.split('.');
    if (segments.length !== 3) {
      throw new Error('Wrong number of segments in token: ' + jwt);
    }
    var signed = segments[0] + '.' + segments[1];

    var signature = segments[2];

    var envelope, payload;
    try {
      envelope = JSON.parse(this.decodeBase64(segments[0]));
    } catch (err) { }

    if (!envelope) {
      throw new Error('Can\'t parse token envelope: ' + segments[0]);
    }

    try {
      payload = JSON.parse(this.decodeBase64(segments[1]));
    } catch (err) { }
    if (!payload) {
      throw new Error('Can\'t parse token payload: ' + segments[1]);
    }

    if (!certs.hasOwnProperty(envelope.kid)) {
      // If this is not present, then there's no reason to attempt verification
      throw new Error('No pem found for envelope: ' + JSON.stringify(envelope));
    }
    var pem = certs[envelope.kid];
    var pemVerifier = new PemVerifier();
    var verified = pemVerifier.verify(pem, signed, signature, 'base64');

    if (!verified) {
      throw new Error('Invalid token signature: ' + jwt);
    }

    if (!payload.iat) {
      throw new Error('No issue time in token: ' + JSON.stringify(payload));
    }

    if (!payload.exp) {
      throw new Error('No expiration time in token: ' + JSON.stringify(payload));
    }

    var iat = parseInt(payload.iat, 10);
    var exp = parseInt(payload.exp, 10);
    var now = new Date().getTime() / 1000;

    if (exp >= now + maxExpiry) {
      throw new Error('Expiration time too far in future: ' +
        JSON.stringify(payload));
    }

    var earliest = iat - OAuth2Client.CLOCK_SKEW_SECS_;
    var latest = exp + OAuth2Client.CLOCK_SKEW_SECS_;

    if (now < earliest) {
      throw new Error('Token used too early, ' + now + ' < ' + earliest + ': ' +
        JSON.stringify(payload));
    }

    if (now > latest) {
      throw new Error('Token used too late, ' + now + ' > ' + latest + ': ' +
        JSON.stringify(payload));
    }

    if (issuers && issuers.indexOf(payload.iss) < 0) {
      throw new Error('Invalid issuer, expected one of [' + issuers +
          '], but got ' + payload.iss);
    }

    // Check the audience matches if we have one
    if (typeof requiredAudience !== 'undefined' && requiredAudience !== null) {
      var aud = payload.aud;
      var audVerified = false;
      //If the requiredAudience is an array, check if it contains token audience
      if(requiredAudience.constructor === Array)
      {
          audVerified = (requiredAudience.indexOf(aud) > -1);
      }
      else{
          audVerified = (aud === requiredAudience);
      }
      if (!audVerified) {
         throw new Error('Wrong recipient, payload audience != requiredAudience');
      }
    }

    return new LoginTicket(envelope, payload);
  };

/**
 * This is a utils method to decode a base64 string
 * @param {string} b64String The string to base64 decode
 * @return {string} The decoded string
 */
OAuth2Client.prototype.decodeBase64 = function(b64String) {
  var buffer = new Buffer(b64String, 'base64');
  return buffer.toString('utf8');
};

/**
 * Export OAuth2Client.
 */
module.exports = OAuth2Client;
