function Registrar(options) {
  options = options || {};
  
  this._getClientCb = options.getClientCallback;
  if (!this._getClientCb) {
    throw new Error('OpenID Connect authentication requires getClientCallback option');
  }
}

Registrar.prototype.resolve = function(issuer, cb) {
  this._getClientCb(issuer, function(err, client) {
    if (err) { return cb(err); }
    if (!client) { return cb(new Error('No client able to interact with OpenID provider: ' + issuer)); }
    return cb(null, client);
  });
}


module.exports = Registrar;
