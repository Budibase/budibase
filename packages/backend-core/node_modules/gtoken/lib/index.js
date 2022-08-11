var gp12pem = require('google-p12-pem');
var request = require('request');
var mime = require('mime');
var jws = require('jws');
var fs = require('fs');

var GOOGLE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var GOOGLE_REVOKE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/revoke?token=';

/**
 * Create a GoogleToken.
 *
 * @param {object}   options  Configuration object.
 */
function GoogleToken(options) {
  if (!(this instanceof GoogleToken)) {
    return new GoogleToken(options);
  }
  this._configure(options);
}

GoogleToken.prototype._mime = mime;

/**
 * Returns whether the token has expired.
 *
 * @return {Boolean} true if the token has expired, false otherwise.
 */
GoogleToken.prototype.hasExpired = function() {
  var now = (new Date()).getTime();
  if (this.token && this.expires_at) {
    return now >= this.expires_at;
  } else {
    return true;
  }
};

GoogleToken.prototype._gp12pem = gp12pem;

/**
 * Returns a cached token or retrieves a new one from Google.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype.getToken = function(callback) {
  var self = this;

  if (!this.hasExpired()) {
    return callback(null, this.token);
  } else {
    if (!this.key && !this.keyFile) {
      callback(new Error('No key or keyFile set.'));
      return;
    } else if (!this.key && this.keyFile) {
      var mimeType = this._mime.lookup(this.keyFile);
      if (mimeType === 'application/json') {
        // json file
        fs.readFile(this.keyFile, handleJSONKey);
      } else {
        // Must be a .p12 file or .pem key
        if (!self.iss) {
          var error = new Error('email is required.');
          error.code = 'MISSING_CREDENTIALS';
          callback(error);
          return;
        }

        if (mimeType === 'application/x-pkcs12') {
          // convert to .pem on the fly
          self._gp12pem(this.keyFile, handleKey);
        } else {
          // assume .pem key otherwise
          fs.readFile(this.keyFile, handleKey);
        }
      }
    } else {
      return this._requestToken(callback);
    }
  }

  function handleJSONKey(err, key) {
    if (err) {
      callback(err);
      return;
    }
    try {
      var body = JSON.parse(key);
      self.key = body.private_key;
      self.iss = body.client_email;
    } catch (e) {
      callback(e);
      return;
    }

    if (!self.key || !self.iss) {
      var error = new Error('private_key and client_email are required.');
      error.code = 'MISSING_CREDENTIALS';
      callback(error);
      return;
    }

    self._requestToken(callback);
  }

  function handleKey(err, key) {
    if (err) {
      callback(err);
      return;
    }
    self.key = key;
    self._requestToken(callback);
  }
};

/**
 * Revoke the token if one is set.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype.revokeToken = function(callback) {
  var self = this;
  if (this.token) {
    this._request(GOOGLE_REVOKE_TOKEN_URL + this.token, function(err, res) {
      if (err) {
        callback(err);
        return;
      }
      self._configure({
        email: self.iss,
        sub: self.sub,
        key: self.key,
        keyFile: self.keyFile,
        scope: self.scope
      });
      callback();
    });
  } else {
    callback(new Error('No token to revoke.'));
  }
};

/**
 * Configure the GoogleToken for re-use.
 * @param  {object} options Configuration object.
 */
GoogleToken.prototype._configure = function(options) {
  var self = this;
  options = options || {};
  this.keyFile = options.keyFile;
  this.key = options.key;
  this._request = request;
  this.token = this.expires_at = this.raw_token = null;
  this.iss = options.email || options.iss;

  if (options.sub) {
    this.sub = options.sub;
  }

  if (typeof options.scope === 'object') {
    this.scope = options.scope.join(' ');
  } else {
    this.scope = options.scope;
  }
};

/**
 * Request the token from Google.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype._requestToken = function(callback) {
  var self = this;
  var iat = Math.floor(new Date().getTime() / 1000);
  var payload = {
    iss: this.iss,
    scope: this.scope,
    aud: GOOGLE_TOKEN_URL,
    exp: iat + 3600, // 3600 seconds = 1 hour
    iat: iat
  };

  if (this.sub) {
    payload.sub = this.sub;
  }

  var toSign = {
    header: {
      alg: 'RS256',
      typ: 'JWT'
    },
    payload: payload,
    secret: this.key
  };

  return this._signJWT(toSign, function(err, signedJWT) {
    if (err) {
      callback(err, null);
      return;
    }

    return self._request({
      method: 'post',
      url: GOOGLE_TOKEN_URL,
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJWT
      }
    }, function(err, res, body) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }

      err = err || body.error && new Error(body.error +
          (body.error_description ? ': ' + body.error_description : ''));

      if (err) {
        self.token = null;
        self.token_expires = null;
        callback(err, null);
        return;
      }

      self.raw_token = body;
      self.token = body.access_token;
      self.expires_at = (iat + body.expires_in) * 1000;
      return callback(null, self.token);
    });
  });
};

/**
 * Sign the JWT object, returning any errors in the callback.
 *
 * @param  {object}   opts     The configuration object.
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype._signJWT = function(opts, callback) {
  try {
    var signedJWT = jws.sign(opts);
    return callback(null, signedJWT);
  } catch (err) {
    callback(err, null);
  }
};

module.exports = GoogleToken;
