/**
 * `AuthorizationError` error.
 *
 * AuthorizationError represents an error in response to an authorization
 * request.  For details, refer to RFC 6749, section 4.1.2.1.
 *
 * References:
 *   - [The OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749)
 *
 * @constructor
 * @param {String} [message]
 * @param {String} [code]
 * @param {String} [uri]
 * @param {Number} [status]
 * @api public
 */
function AuthorizationError(message, code, uri, status) {
  if (!status) {
    switch (code) {
      case 'access_denied': status = 403; break;
      case 'server_error': status = 502; break;
      case 'temporarily_unavailable': status = 503; break;
    }
  }

  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.code = code || 'server_error';
  this.uri = uri;
  this.status = status || 500;
}

/**
 * Inherit from `Error`.
 */
AuthorizationError.prototype.__proto__ = Error.prototype;


/**
 * Expose `AuthorizationError`.
 */
module.exports = AuthorizationError;
