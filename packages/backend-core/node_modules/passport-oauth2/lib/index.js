// Load modules.
var Strategy = require('./strategy')
  , AuthorizationError = require('./errors/authorizationerror')
  , TokenError = require('./errors/tokenerror')
  , InternalOAuthError = require('./errors/internaloautherror');


// Expose Strategy.
exports = module.exports = Strategy;

// Exports.
exports.Strategy = Strategy;

exports.AuthorizationError = AuthorizationError;
exports.TokenError = TokenError;
exports.InternalOAuthError = InternalOAuthError;
