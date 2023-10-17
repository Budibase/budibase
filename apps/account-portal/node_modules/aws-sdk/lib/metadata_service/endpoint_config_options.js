var ENV_ENDPOINT_NAME = 'AWS_EC2_METADATA_SERVICE_ENDPOINT';
var CONFIG_ENDPOINT_NAME = 'ec2_metadata_service_endpoint';

var ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env) { return env[ENV_ENDPOINT_NAME]; },
  configFileSelector: function(profile) { return profile[CONFIG_ENDPOINT_NAME]; },
  default: undefined,
};

module.exports = {
  ENV_ENDPOINT_NAME: ENV_ENDPOINT_NAME,
  CONFIG_ENDPOINT_NAME: CONFIG_ENDPOINT_NAME,
  ENDPOINT_CONFIG_OPTIONS: ENDPOINT_CONFIG_OPTIONS
};
