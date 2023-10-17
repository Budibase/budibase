var AWS = require('./core');

AWS.util.isBrowser = function() { return true; };
AWS.util.isNode = function() { return false; };

// react-native specific modules
AWS.util.crypto.lib = require('./browserCryptoLib');
AWS.util.Buffer = require('buffer/').Buffer;
AWS.util.url = require('url/');
AWS.util.querystring = require('querystring/');
AWS.util.realClock = require('./realclock/browserClock');
AWS.util.environment = 'js-react-native';
AWS.util.createEventStream = require('./event-stream/buffered-create-event-stream').createEventStream;

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
AWS.XML.Parser = require('./xml/node_parser');

// Load the XHR HttpClient
require('./http/xhr');

// add custom request event handlers
var addContentType = require('./react-native/add-content-type').addContentType;
AWS.EventListeners.Core.addNamedListeners(function(add) {
  add('ADD_CONTENT_TYPE', 'afterBuild', addContentType);
});

if (typeof process === 'undefined') {
  process = {};
}
process.browser = true;
