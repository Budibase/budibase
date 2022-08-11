/**
 * Module dependencies.
 */
var webfinger = require('webfinger').webfinger;
var NoOpenIDError = require('./errors/no_openid_error');

var REL = 'http://openid.net/specs/connect/1.0/issuer';
// var REL = 'http://specs.openid.net/auth/2.0/provider';

/**
 * Discover OpenID Connect provider configuration using WebFinger.
 *
 * This discovery mechanism uses WebFinger to discover the issuer for a
 * user-supplied identifier.  Once the issuer is known, it's configuration is
 * loaded.
 *
 * Note: Prior to draft 12, OpenID Connect Discovery used Simple Web Discovery
 *       rather than WebFinger.  At the time of writing, many provider
 *       implementations continue to implement SWD.
 *
 * References:
 *   - [OpenID Connect Discovery 1.0 - draft 12](http://openid.net/specs/openid-connect-discovery-1_0.html)
 *   - [WebFinger](http://tools.ietf.org/html/draft-ietf-appsawg-webfinger-08)
 *
 * @return {Function}
 * @api public
 */
function Resolver() {
}

Resolver.prototype.resolve = function (identifier, cb) {
  webfinger(identifier, REL, { webfingerOnly: true }, function (err, jrd) {
    if (err) { return cb(err); }
    if (!jrd.links) { return cb(new NoOpenIDError('No links in resource descriptor', jrd)); }

    var issuer;
    for (var i = 0; i < jrd.links.length; i++) {
      var link = jrd.links[i];
      if (link.rel === REL) {
        issuer = link.href;
        break;
      }
    }

    if (!issuer) {
      return cb(new NoOpenIDError('No OpenID Connect issuer in resource descriptor', jrd));
    }
    return cb(null, issuer);
  });
};

module.exports = Resolver;
