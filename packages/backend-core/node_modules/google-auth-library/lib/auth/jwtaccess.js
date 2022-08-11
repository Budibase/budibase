/**
 * Copyright 2015 Google Inc. All Rights Reserved.
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

var jws = require('jws');
var noop = require('lodash.noop');

/**
 * JWTAccess service account credentials.
 *
 * Create a new access token by using the credential to create a new JWT token
 * that's recognized as the access token.
 *
 * @param {string=} email the service account email address.
 * @param {string=} key the private key that will be used to sign the token.
 * @constructor
 */
function JWTAccess(email, key) {
  this.email = email;
  this.key = key;
}

/**
 * Indicates whether the credential requires scopes to be created by calling
 * createdScoped before use.
 *
 * @return {boolean} always false
 */
JWTAccess.prototype.createScopedRequired = function() {
  // JWT Header authentication does not use scopes.
  return false;
};

/**
 * Get a non-expired access token, after refreshing if necessary
 *
 * @param {string} authURI the URI being authorized
 * @param {function} metadataCb a callback invoked with the jwt
 *                   request metadata.
 */
JWTAccess.prototype.getRequestMetadata = function(authURI, metadataCb) {
  var iat = Math.floor(new Date().getTime() / 1000);
  var exp = iat + 3600; // 3600 seconds = 1 hour

  // The payload used for signed JWT headers has:
  // iss == sub == <client email>
  // aud == <the authorization uri>
  var payload = {
    iss: this.email,
    sub: this.email,
    aud: authURI,
    exp: exp,
    iat: iat
  };
  var assertion = {
    header: {
      alg: 'RS256',
      typ: 'JWT'
    },
    payload: payload,
    secret: this.key
  };

  // Sign the jwt and invoke metadataCb with it.
  return this._signJWT(assertion, function(err, signedJWT) {
    if (!err) {
      return metadataCb(null, {'Authorization': 'Bearer ' + signedJWT});
    } else {
      return metadataCb(err, null);
    }
  });
};

/**
 * Create a JWTAccess credentials instance using the given input options.
 * @param {object=} json The input object.
 * @param {function=} opt_callback Optional callback.
 */
JWTAccess.prototype.fromJSON = function(json, opt_callback) {
  var that = this;
  var done = opt_callback || noop;
  if (!json) {
    done(new Error(
      'Must pass in a JSON object containing the service account auth settings.'));
    return;
  }
  if (!json.client_email) {
    done(new Error(
      'The incoming JSON object does not contain a client_email field'));
    return;
  }
  if (!json.private_key) {
    done(new Error(
      'The incoming JSON object does not contain a private_key field'));
    return;
  }
  // Extract the relevant information from the json key file.
  that.email = json.client_email;
  that.key = json.private_key;
  that.projectId = json.project_id;
  done();
};

/**
 * Create a JWTAccess credentials instance using the given input stream.
 * @param {object=} stream The input stream.
 * @param {function=} opt_callback Optional callback.
 */
JWTAccess.prototype.fromStream = function(stream, opt_callback) {
  var that = this;
  var done = opt_callback || noop;
  if (!stream) {
    process.nextTick(function() {
        done(
            new Error('Must pass in a stream containing the service account auth settings.'));
    });
    return;
  }
  var s = '';
  stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    s += chunk;
  });
  stream.on('end', function () {
    try {
      var data = JSON.parse(s);
      that.fromJSON(data, opt_callback);
    } catch (err) {
      done(err);
    }
  });
};

/**
 * Sign the JWT object, returning any errors in the callback.
 *
 * signedJwtFn is a callback function(err, signedJWT); it is called with an
 * error if there is an exception during signing.
 *
 * @param  {object}   assertion   The assertion to sign
 * @param  {Function} signedJwtFn  fn(err, signedJWT)
 */
JWTAccess.prototype._signJWT = function(assertion, signedJwtFn) {
  try {
    return signedJwtFn(null, jws.sign(assertion));
  } catch (err) {
    return signedJwtFn(err);
  }
};

/**
 * Export JWTAccess.
 */
module.exports = JWTAccess;
