/**
 * Copyright 2014 Google Inc. All Rights Reserved.
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

var JWTClient = require('./jwtclient.js');
var ComputeClient = require('./computeclient.js');
var exec = require('child_process').exec;
var fs = require('fs');
var os = require('os');
var path = require('path');
var util = require('util');
var DefaultTransporter = require('../transporters.js');

/**
 * GoogleAuth account manager.
 *
 * @constructor
 */
function GoogleAuth() {
  this.JWTClient = JWTClient;
  this.ComputeClient = ComputeClient;
  this._cachedCredential = null;
}

// Executes the given callback if it is not null.
function callback(c) {
  if (c) {
    return c.apply(null, Array.prototype.slice.call(arguments, 1));
  }
}

// Creates an Error containing the given message, and includes the message from the optional err
// passed in.
function createError(message, err) {
  var s = message || '';
  if (err) {
    var errorMessage = String(err);
    if (errorMessage && errorMessage.length > 0) {
      if (s.length > 0) {
        s += ' ';
      }
      s += errorMessage;
    }
  }
  return Error(s);
}

/**
 * Convenience field mapping in the IAM credential type.
 */
GoogleAuth.prototype.IAMAuth = require('./iam.js');

/**
 * Convenience field mapping in the Compute credential type.
 */
GoogleAuth.prototype.Compute = require('./computeclient.js');

/**
 * Convenience field mapping in the JWT credential type.
 */
GoogleAuth.prototype.JWT = require('./jwtclient.js');

/**
 * Convenience field mapping in the JWT Access credential type.
 */
GoogleAuth.prototype.JWTAccess = require('./jwtaccess.js');

/**
 * Convenience field mapping in the OAuth2 credential type.
 */
GoogleAuth.prototype.OAuth2 = require('./oauth2client.js');

/**
 * Convenience field mapping to the UserRefreshClient credential type.
 */
GoogleAuth.prototype.UserRefreshClient = require('./refreshclient.js');

/**
 * Caches a value indicating whether the auth layer is running on Google Compute Engine.
 * @private
 */
GoogleAuth.prototype._isGCE = false;

/**
 * Caches a value indicating whether we've checked whether the auth layer is running on
 * Google Compute Engine.
 * @private
 */
GoogleAuth.prototype._checked_isGCE = false;

/**
 * Obtains the default project ID for the application..
 * @param {function=} opt_callback Optional callback.
 */
GoogleAuth.prototype.getDefaultProjectId = function(opt_callback) {
  var that = this;

  // In implicit case, supports three environments. In order of precedence, the
  // implicit environments are:
  //
  // * GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variable
  // * GOOGLE_APPLICATION_CREDENTIALS JSON file
  // * Get default service project from
  //  ``$ gcloud beta auth application-default login``
  // * Google App Engine application ID (Not implemented yet)
  // * Google Compute Engine project ID (from metadata server) (Not implemented yet)

  if (that._cachedProjectId) {
    process.nextTick(function() {
      callback(opt_callback, null, that._cachedProjectId);
    });
  } else {
    var my_callback = function(err, projectId) {
      if (!err && projectId) {
        that._cachedprojectId = projectId;
      }
      process.nextTick(function() {
        callback(opt_callback, err, projectId);
      });
    };

    // environment variable
    if (that._getProductionProjectId(my_callback)) {
      return;
    }

    // json file
    that._getFileProjectId(function(err, projectId) {
      if (err || projectId) {
        my_callback(err, projectId);
        return;
      }

      // Google Cloud SDK default project id
      that._getDefaultServiceProjectId(function(err, projectId) {
        if (err || projectId) {
          my_callback(err, projectId);
          return;
        }

        // Get project ID from Compute Engine metadata server
        that._getGCEProjectId(my_callback);
      });
    });
  }
};

/**
 * Loads the project id from environment variables.
 * @param {function} _callback Callback.
 * @api private
 */
GoogleAuth.prototype._getProductionProjectId = function(_callback) {
  var projectId = this._getEnv('GCLOUD_PROJECT') || this._getEnv('GOOGLE_CLOUD_PROJECT');
  if (projectId) {
    process.nextTick(function() {
      callback(_callback, null, projectId);
    });
  }
  return projectId;
};

/**
 * Loads the project id from the GOOGLE_APPLICATION_CREDENTIALS json file.
 * @param {function} _callback Callback.
 * @api private
 */
GoogleAuth.prototype._getFileProjectId = function(_callback) {
  var that = this;
  if (that._cachedCredential) {
    // Try to read the project ID from the cached credentials file
    process.nextTick(function() {
      callback(_callback, null, that._cachedCredential.projectId);
    });
    return;
  }

  // Try to load a credentials file and read its project ID
  var pathExists = that._tryGetApplicationCredentialsFromEnvironmentVariable(function(err, result) {
    if (!err && result) {
      callback(_callback, null, result.projectId);
      return;
    }
    callback(_callback, err);
  });

  if (!pathExists) {
    callback(_callback, null);
  }
};

/**
 * Loads the default project of the Google Cloud SDK.
 * @param {function} _callback Callback.
 * @api private
 */
GoogleAuth.prototype._getDefaultServiceProjectId = function(_callback) {
  this._getSDKDefaultProjectId(function(err, stdout) {
    var projectId;
    if (!err && stdout) {
      try {
        projectId = JSON.parse(stdout).core.project;
      } catch (err) {
        projectId = null;
      }
    }
    // Ignore any errors
    callback(_callback, null, projectId);
  });
};

/**
 * Run the Google Cloud SDK command that prints the default project ID
 * @param {function} _callback Callback.
 * @api private
 */
GoogleAuth.prototype._getSDKDefaultProjectId = function(_callback) {
  exec('gcloud -q config list core/project --format=json', _callback);
};

/**
 * Gets the Compute Engine project ID if it can be inferred.
 * Uses 169.254.169.254 for the metadata server to avoid request
 * latency from DNS lookup.
 * See https://cloud.google.com/compute/docs/metadata#metadataserver
 * for information about this IP address. (This IP is also used for
 * Amazon EC2 instances, so the metadata flavor is crucial.)
 * See https://github.com/google/oauth2client/issues/93 for context about
 * DNS latency.
 *
 * @param {function} _callback Callback.
 * @api private
 */
GoogleAuth.prototype._getGCEProjectId = function(_callback) {
  if (!this.transporter) {
    this.transporter = new DefaultTransporter();
  }
  this.transporter.request({
    method: 'GET',
    uri: 'http://169.254.169.254/computeMetadata/v1/project/project-id',
    headers: {
      'Metadata-Flavor': 'Google'
    }
  }, function(err, body, res) {
    if (err || !res || res.statusCode !== 200 || !body) {
      callback(_callback, null);
      return;
    }
    // Ignore any errors
    callback(_callback, null, body);
  });
};

/**
 * Obtains the default service-level credentials for the application..
 * @param {function=} opt_callback Optional callback.
 */
GoogleAuth.prototype.getApplicationDefault = function(opt_callback) {
  var that = this;

  // If we've already got a cached credential, just return it.
  if (that._cachedCredential) {
    process.nextTick(function() {
      callback(opt_callback, null, that._cachedCredential, that._cachedProjectId);
    });
  } else {
    // Inject our own callback routine, which will cache the credential once it's been created.
    // It also allows us to ensure that the ultimate callback is always async.
    var my_callback = function(err, result) {
      if (!err && result) {
        that._cachedCredential = result;
        that.getDefaultProjectId(function(err, projectId) {
          process.nextTick(function() {
            // Ignore default project error
            callback(opt_callback, null, result, projectId);
          });
        });
      } else {
        process.nextTick(function() {
          callback(opt_callback, err, result);
        });
      }
    };
    // Check for the existence of a local environment variable pointing to the
    // location of the credential file. This is typically used in local developer scenarios.
    if (that._tryGetApplicationCredentialsFromEnvironmentVariable(my_callback)) {
      return;
    }

    // Look in the well-known credential file location.
    if (that._tryGetApplicationCredentialsFromWellKnownFile(my_callback)) {
      return;
    }

    // Determine if we're running on GCE.
    that._checkIsGCE(function(gce) {
      if (gce) {
        // For GCE, just return a default ComputeClient. It will take care of the rest.
        my_callback(null, new that.ComputeClient());
      } else {
        // We failed to find the default credentials. Bail out with an error.
        my_callback(new Error('Could not load the default credentials. Browse to ' +
          'https://developers.google.com/accounts/docs/application-default-credentials for ' +
          'more information.'));
      }
    });
  }
};

/**
 * Determines whether the auth layer is running on Google Compute Engine.
 * @param {function=} callback The callback.
 * @api private
 */
GoogleAuth.prototype._checkIsGCE = function(callback) {
  var that = this;
  if (that._checked_isGCE) {
    callback(that._isGCE);
  } else {
    if (!that.transporter) {
      that.transporter = new DefaultTransporter();
    }
    that.transporter.request({
      method: 'GET',
      uri: 'http://metadata.google.internal',
      json: true
    }, function(err, body, res) {
      if (!err && res && res.headers) {
        that._isGCE = res.headers['metadata-flavor'] === 'Google';
      }
      that._checked_isGCE = true;
      callback(that._isGCE);
    });
  }
};

/**
 * Attempts to load default credentials from the environment variable path..
 * @param {function=} opt_callback Optional callback.
 * @return {boolean} Returns true if the callback has been executed; false otherwise.
 * @api private
 */
GoogleAuth.prototype._tryGetApplicationCredentialsFromEnvironmentVariable =
  function(opt_callback) {

    var that = this;
    var credentialsPath = that._getEnv('GOOGLE_APPLICATION_CREDENTIALS');
    if (!credentialsPath || credentialsPath.length === 0) {
      return false;
    }
    that._getApplicationCredentialsFromFilePath(credentialsPath, function(err, result) {
      var wrappedError = null;
      if (err) {
        wrappedError = createError(
            'Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS ' +
            'environment variable.',
          err);
      }
      callback(opt_callback, wrappedError, result);
    });
    return true;
  };

/**
 * Attempts to load default credentials from a well-known file location
 * @param {function=} opt_callback Optional callback.
 * @return {boolean} Returns true if the callback has been executed; false otherwise.
 * @api private
 */
GoogleAuth.prototype._tryGetApplicationCredentialsFromWellKnownFile =
  function(opt_callback) {

    var that = this;
    // First, figure out the location of the file, depending upon the OS type.
    var location = null;
    if (that._isWindows()) {
      // Windows
      location = that._getEnv('APPDATA');
    } else {
      // Linux or Mac
      var home = that._getEnv('HOME');
      if (home) {
        location = that._pathJoin(home, '.config');
      }
    }
    // If we found the root path, expand it.
    if (location) {
      location = that._pathJoin(location, 'gcloud');
      location = that._pathJoin(location, 'application_default_credentials.json');
      location = that._mockWellKnownFilePath(location);
      // Check whether the file exists.
      if (!that._fileExists(location)) {
        location = null;
      }
    }
    // The file does not exist.
    if (!location) {
      return false;
    }
    // The file seems to exist. Try to use it.
    this._getApplicationCredentialsFromFilePath(location, opt_callback);
    return true;
  };

/**
 * Attempts to load default credentials from a file at the given path..
 * @param {string=} filePath The path to the file to read.
 * @param {function=} opt_callback Optional callback.
 * @api private
 */
GoogleAuth.prototype._getApplicationCredentialsFromFilePath =
  function(filePath, opt_callback) {

    var that = this;
    var error = null;
    // Make sure the path looks like a string.
    if (!filePath || filePath.length === 0) {
      error = new Error('The file path is invalid.');
    }

    // Make sure there is a file at the path. lstatSync will throw if there is nothing there.
    if (!error) {
      try {
        // Resolve path to actual file in case of symlink. Expect a thrown error if not resolvable.
        filePath = fs.realpathSync(filePath);

        if (!fs.lstatSync(filePath).isFile()) {
          throw '';
        }
      } catch (err) {
        error = createError(util.format('The file at %s does not exist, or it is not a file.',
          filePath), err);
      }
    }
    // Now open a read stream on the file, and parse it.
    if (!error) {
      try {
        var stream = that._createReadStream(filePath);
        that.fromStream(stream, opt_callback);
      } catch (err) {
        error = createError(util.format('Unable to read the file at %s.', filePath), err);
      }
    }
    if (error) {
      callback(opt_callback, error);
    }
  };

/**
 * Create a credentials instance using the given input options.
 * @param {object=} json The input object.
 * @param {function=} opt_callback Optional callback.
 */
GoogleAuth.prototype.fromJSON = function(json, opt_callback) {
  var that = this;
  var client;
  if (!json) {
    callback(opt_callback, new Error(
      'Must pass in a JSON object containing the Google auth settings.'));
    return;
  }
  if (json.type === 'authorized_user') {
    client = new that.UserRefreshClient();
  } else {
    client = new that.JWTClient();
  }
  client.fromJSON(json, function(err) {
    if (err) {
      callback(opt_callback, err);
    } else {
      callback(opt_callback, null, client);
    }
  });
};

/**
 * Create a credentials instance using the given input stream.
 * @param {object=} stream The input stream.
 * @param {function=} opt_callback Optional callback.
 */
GoogleAuth.prototype.fromStream = function(stream, opt_callback) {
  var that = this;
  if (!stream) {
    process.nextTick(function() {
      callback(opt_callback, new Error(
          'Must pass in a stream containing the Google auth settings.'));
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
      callback(opt_callback, err);
    }
  });
};

/**
 * Determines whether the current operating system is Windows.
 * @api private
 * */
GoogleAuth.prototype._isWindows = function() {
  var sys = this._osPlatform();
  if (sys && sys.length >= 3) {
    if (sys.substring(0, 3).toLowerCase() === 'win') {
      return true;
    }
  }
  return false;
};

/**
 * Creates a file stream. Allows mocking.
 * @api private
 * */
GoogleAuth.prototype._createReadStream = function(filePath) {
  return fs.createReadStream(filePath);
};

/**
 * Gets the value of the environment variable with the given name. Allows mocking.
 * @api private
 * */
GoogleAuth.prototype._getEnv = function(name) {
  return process.env[name];
};

/**
 * Gets the current operating system platform. Allows mocking.
 * @api private
 * */
GoogleAuth.prototype._osPlatform = function() {
  return os.platform();
};

/**
 * Determines whether a file exists. Allows mocking.
 * @api private
 * */
GoogleAuth.prototype._fileExists = function(filePath) {
  return fs.existsSync(filePath);
};

/**
 * Joins two parts of a path. Allows mocking.
 * @api private
 * */
GoogleAuth.prototype._pathJoin = function(item1, item2) {
  return path.join(item1, item2);
};

/**
 * Allows mocking of the path to a well-known file.
 * @api private
 * */
GoogleAuth.prototype._mockWellKnownFilePath = function(filePath) {
  return filePath;
};

/**
 * Export GoogleAuth.
 */
module.exports = GoogleAuth;
