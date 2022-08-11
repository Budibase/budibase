/**
 * `UserInfoError` error.
 *
 * @constructor
 * @param {string} [message]
 * @param {string} [code]
 * @access public
 */
function UserInfoError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'UserInfoError';
  this.message = message;
  this.code = code;
}

// Inherit from `Error`.
UserInfoError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = UserInfoError;
