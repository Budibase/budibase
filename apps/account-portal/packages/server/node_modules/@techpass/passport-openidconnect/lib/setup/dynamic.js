var request = require('request');
var Resolver = require('../resolver');
var Registrar = require('../registrar');

var __resolver;
var __registrar;


exports = module.exports = function(options) {
  var resolver = options.resolver;
  var registrar = options.registrar;
  
  if (!resolver) {
    // Construct and use singleton resolver.
    __resolver = __resolver || new Resolver(options);
    resolver = __resolver;
  }
  if (!registrar) {
    // Construct and use singleton registrar.
    __registrar = __registrar || new Registrar(options);
    registrar = __registrar;
  }
  
  
  return function dynamic(identifier, cb) {

    resolver.resolve(identifier, function(err, issuer) {
      if (err) { return cb(err); }
      
      
      // TODO: Check if path already ends in "/"
      var url = issuer + '/.well-known/openid-configuration';
      
      // TODO: Pass accept header correctly
      /*
      headers['Accept'] = 'application/json';
  
      var options = {
        host: parsed.hostname,
        port: parsed.port,
        path: path,
        method: 'GET',
        headers: headers
      };
      */
      
      request.get(url, function(err, res, body) {
        if (err) { return cb(err); }
        if (res.statusCode !== 200) {
          return cb(new Error("Unexpected status code from OpenID provider configuration: " + res.statusCode));
        }
      
        var config = {};
      
        try {
          var json = JSON.parse(body);
        
          config.issuer = json.issuer;
          config.authorizationURL = json.authorization_endpoint;
          config.tokenURL = json.token_endpoint;
          config.userInfoURL = json.userinfo_endpoint;
          config.registrationURL = json.registration_endpoint;
        
          config._raw = json;
        
          //cb(null, config);
        } catch(ex) {
          return cb(new Error('Failed to parse OpenID provider configuration'));
        }
      
        // TODO: Pass registrationURL here.
        registrar.resolve(config.issuer, function(err, client) {
          if (err) { return cb(null, err); }
          config.clientID = client.id;
          config.clientSecret = client.secret;
          if (client.redirectURIs) {
            config.callbackURL = client.redirectURIs[0];
          }
          return cb(null, config);
        });
      });
    });
  };
};
