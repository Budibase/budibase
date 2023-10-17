var AWS = require('../core');

var Endpoint = require('./get_endpoint')();
var EndpointMode = require('./get_endpoint_mode')();

var ENDPOINT_CONFIG_OPTIONS = require('./get_endpoint_config_options')();
var ENDPOINT_MODE_CONFIG_OPTIONS = require('./get_endpoint_mode_config_options')();

var getMetadataServiceEndpoint = function() {
  var endpoint = AWS.util.loadConfig(ENDPOINT_CONFIG_OPTIONS);
  if (endpoint !== undefined) return endpoint;

  var endpointMode = AWS.util.loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS);
  switch (endpointMode) {
    case EndpointMode.IPv4:
      return Endpoint.IPv4;
    case EndpointMode.IPv6:
      return Endpoint.IPv6;
    default:
      throw new Error('Unsupported endpoint mode: ' + endpointMode);
  }
};

module.exports = getMetadataServiceEndpoint;
