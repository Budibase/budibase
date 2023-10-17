var util = require('./util');

// browser specific modules
util.crypto.lib = require('./browserCryptoLib');
util.Buffer = require('buffer/').Buffer;
util.url = require('url/');
util.querystring = require('querystring/');
util.realClock = require('./realclock/browserClock');
util.environment = 'js';
util.createEventStream = require('./event-stream/buffered-create-event-stream').createEventStream;
util.isBrowser = function() { return true; };
util.isNode = function() { return false; };

var AWS = require('./core');

/**
 * @api private
 */
module.exports = AWS;

require('./credentials');
require('./credentials/credential_provider_chain');
require('./credentials/temporary_credentials');
require('./credentials/chainable_temporary_credentials');
require('./credentials/web_identity_credentials');
require('./credentials/cognito_identity_credentials');
require('./credentials/saml_credentials');

// Load the DOMParser XML parser
AWS.XML.Parser = require('./xml/browser_parser');

// Load the XHR HttpClient
require('./http/xhr');

if (typeof process === 'undefined') {
  var process = {
    browser: true
  };
}
