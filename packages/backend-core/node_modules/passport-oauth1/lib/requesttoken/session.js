function SessionStore(options) {
  if (!options.key) { throw new TypeError('Session-based request token store requires a session key'); }
  this._key = options.key;
}

SessionStore.prototype.get = function(req, token, cb) {
  if (!req.session) { return cb(new Error('OAuth authentication requires session support. Did you forget to use express-session middleware?')); }
  
  // Bail if the session does not contain the request token and corresponding
  // secret.  If this happens, it is most likely caused by initiating OAuth
  // from a different host than that of the callback endpoint (for example:
  // initiating from 127.0.0.1 but handling callbacks at localhost).
  if (!req.session[this._key]) { return cb(new Error('Failed to find request token in session')); }
  
  var tokenSecret = req.session[this._key].oauth_token_secret;
  return cb(null, tokenSecret);
};

SessionStore.prototype.set = function(req, token, tokenSecret, cb) {
  if (!req.session) { return cb(new Error('OAuth authentication requires session support. Did you forget to use express-session middleware?')); }
  
  if (!req.session[this._key]) { req.session[this._key] = {}; }
  req.session[this._key].oauth_token = token;
  req.session[this._key].oauth_token_secret = tokenSecret;
  cb();
};

SessionStore.prototype.destroy = function(req, token, cb) {
  delete req.session[this._key].oauth_token;
  delete req.session[this._key].oauth_token_secret;
  if (Object.keys(req.session[this._key]).length === 0) {
    delete req.session[this._key];
  }
  cb();
};


module.exports = SessionStore;
