/**
 * Copyright 2013 Google Inc. All Rights Reserved.
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

var Auth2Client = require('./oauth2client.js');
var gToken = require('gtoken');
var JWTAccess = require('./jwtaccess.js');
var noop = require('lodash.noop');
var util = require('util');


/**
 * JWT service account credentials.
 *
 * Retrieve access token using gtoken.
 *
 * @param {string=} email service account email address.
 * @param {string=} keyFile path to private key file.
 * @param {string=} key value of key
 * @param {(string|array)=} scopes list of requested scopes or a single scope.
 * @param {string=} subject impersonated account's email address.
 * @constructor
 */
function JWT(email, keyFile, key, scopes, subject) {
  JWT.super_.call(this);
  this.email = email;
  this.keyFile = keyFile;
  this.key = key;
  this.scopes = scopes;
  this.subject = subject;
  this.gToken = gToken;

  this.credentials = {
    refresh_token: 'jwt-placeholder',
    expiry_date: 1
  };
}

/**
 * Inherit from Auth2Client.
 */
util.inherits(JWT, Auth2Client);

/**
 * Creates a copy of the credential with the specified scopes.
 * @param {(string|array)=} scopes List of requested scopes or a single scope.
 * @return {object} The cloned instance.
 */
JWT.prototype.createScoped = function(scopes) {
  return new JWT(this.email, this.keyFile, this.key, scopes, this.subject);
};

/**
 * Obtains the metadata to be sent with the request.
 *
 * @param {string} opt_uri the URI being authorized.
 * @param {function} metadataCb
 */
JWT.prototype.getRequestMetadata = function(opt_uri, metadataCb) {
  if (this.createScopedRequired() && opt_uri) {
    // no scopes have been set, but a uri has been provided.  Use JWTAccess credentials.
    var alt = new JWTAccess(this.email, this.key);
    return alt.getRequestMetadata(opt_uri, metadataCb);
  } else {
    return JWT.super_.prototype.getRequestMetadata.call(
        this, opt_uri, metadataCb);
  }
};

/**
 * Indicates whether the credential requires scopes to be created by calling createdScoped before
 * use.
 * @return {boolean} false if createScoped does not need to be called.
 */
JWT.prototype.createScopedRequired = function() {
  // If scopes is null, always return true.
  if (this.scopes) {
    // For arrays, check the array length.
    if (this.scopes instanceof Array) {
      return this.scopes.length === 0;
    }

    // For others, convert to a string and check the length.
    return String(this.scopes).length === 0;
  }

  return true;
};

/**
 * Get the initial access token using gToken.
 * @param {function=} opt_callback Optional callback.
 */
JWT.prototype.authorize = function(opt_callback) {
  var that = this;
  var done = opt_callback || noop;

  that.refreshToken_(null, function(err, result) {
    if (!err) {
      that.credentials = result;
      that.credentials.refresh_token = 'jwt-placeholder';
      that.key = that.gtoken.key;
      that.email = that.gtoken.iss;
    }
    done(err, result);
  });
};


/**
 * Refreshes the access token.
 * @param {object=} ignored_
 * @param {function=} opt_callback Optional callback.
 * @private
 */
JWT.prototype.refreshToken_ = function(ignored_, opt_callback) {
  var done = opt_callback || noop;

  return this._createGToken(function(err, gToken) {
    if (err) {
      return done(err);
    } else {
      return gToken.getToken(function (err, token) {
        return done(err, {
          access_token: token,
          token_type: 'Bearer',
          expiry_date: gToken.expires_at
        });
      });
    }
  });
};


/**
 * Create a JWT credentials instance using the given input options.
 * @param {object=} json The input object.
 * @param {function=} opt_callback Optional callback.
 */
JWT.prototype.fromJSON = function(json, opt_callback) {
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
 * Create a JWT credentials instance using the given input stream.
 * @param {object=} stream The input stream.
 * @param {function=} opt_callback Optional callback.
 */
JWT.prototype.fromStream = function(stream, opt_callback) {
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
 * Creates the gToken instance if it has not been created already.
 * @param {function=} callback Callback.
 * @private
 */
JWT.prototype._createGToken = function(callback) {
  if (this.gtoken) {
    return callback(null, this.gtoken);
  } else {
    this.gtoken = this.gToken({
      iss: this.email,
      sub: this.subject,
      scope: this.scopes,
      keyFile: this.keyFile,
      key: this.key
    });
    return callback(null, this.gtoken);
  }
};

/**
 * Export JWT.
 */
module.exports = JWT;
