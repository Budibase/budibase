var util = require('./util');

var region_utils = require('./region/utils');
var isFipsRegion = region_utils.isFipsRegion;
var getRealRegion = region_utils.getRealRegion;

util.isBrowser = function() { return false; };
util.isNode = function() { return true; };

// node.js specific modules
util.crypto.lib = require('crypto');
util.Buffer = require('buffer').Buffer;
util.domain = require('domain');
util.stream = require('stream');
util.url = require('url');
util.querystring = require('querystring');
util.environment = 'nodejs';
util.createEventStream = util.stream.Readable ?
  require('./event-stream/streaming-create-event-stream').createEventStream : require('./event-stream/buffered-create-event-stream').createEventStream;
util.realClock = require('./realclock/nodeClock');
util.clientSideMonitoring = {
  Publisher: require('./publisher').Publisher,
  configProvider: require('./publisher/configuration'),
};
util.iniLoader = require('./shared-ini').iniLoader;
util.getSystemErrorName = require('util').getSystemErrorName;

util.loadConfig = function(options) {
  var envValue = options.environmentVariableSelector(process.env);
  if (envValue !== undefined) {
    return envValue;
  }

  var configFile = {};
  try {
    configFile = util.iniLoader ? util.iniLoader.loadFrom({
      isConfig: true,
      filename: process.env[util.sharedConfigFileEnv]
    }) : {};
  } catch (e) {}
  var sharedFileConfig = configFile[
    process.env.AWS_PROFILE || util.defaultProfile
  ] || {};
  var configValue = options.configFileSelector(sharedFileConfig);
  if (configValue !== undefined) {
    return configValue;
  }

  if (typeof options.default === 'function') {
    return options.default();
  }
  return options.default;
};

var AWS;

/**
 * @api private
 */
module.exports = AWS = require('./core');

require('./credentials');
require('./credentials/credential_provider_chain');
require('./credentials/temporary_credentials');
require('./credentials/chainable_temporary_credentials');
require('./credentials/web_identity_credentials');
require('./credentials/cognito_identity_credentials');
require('./credentials/saml_credentials');
require('./credentials/process_credentials');

// Load the xml2js XML parser
AWS.XML.Parser = require('./xml/node_parser');

// Load Node HTTP client
require('./http/node');

require('./shared-ini/ini-loader');

// Load custom credential providers
require('./credentials/token_file_web_identity_credentials');
require('./credentials/ec2_metadata_credentials');
require('./credentials/remote_credentials');
require('./credentials/ecs_credentials');
require('./credentials/environment_credentials');
require('./credentials/file_system_credentials');
require('./credentials/shared_ini_file_credentials');
require('./credentials/process_credentials');
require('./credentials/sso_credentials');

// Setup default providers for credentials chain
// If this changes, please update documentation for
// AWS.CredentialProviderChain.defaultProviders in
// credentials/credential_provider_chain.js
AWS.CredentialProviderChain.defaultProviders = [
  function () { return new AWS.EnvironmentCredentials('AWS'); },
  function () { return new AWS.EnvironmentCredentials('AMAZON'); },
  function () { return new AWS.SsoCredentials(); },
  function () { return new AWS.SharedIniFileCredentials(); },
  function () { return new AWS.ECSCredentials(); },
  function () { return new AWS.ProcessCredentials(); },
  function () { return new AWS.TokenFileWebIdentityCredentials(); },
  function () { return new AWS.EC2MetadataCredentials(); }
];

// Load custom token providers
require('./token');
require('./token/token_provider_chain');
require('./token/sso_token_provider');

// Setup default providers for token chain
// If this changes, please update documentation for
// AWS.TokenProviderChain.defaultProviders in
// token/token_provider_chain.js
AWS.TokenProviderChain.defaultProviders = [
  function () { return new AWS.SSOTokenProvider(); },
];

var getRegion = function() {
  var env = process.env;
  var region = env.AWS_REGION || env.AMAZON_REGION;
  if (env[AWS.util.configOptInEnv]) {
    var toCheck = [
      {filename: env[AWS.util.sharedCredentialsFileEnv]},
      {isConfig: true, filename: env[AWS.util.sharedConfigFileEnv]}
    ];
    var iniLoader = AWS.util.iniLoader;
    while (!region && toCheck.length) {
      var configFile = {};
      var fileInfo = toCheck.shift();
      try {
        configFile = iniLoader.loadFrom(fileInfo);
      } catch (err) {
        if (fileInfo.isConfig) throw err;
      }
      var profile = configFile[env.AWS_PROFILE || AWS.util.defaultProfile];
      region = profile && profile.region;
    }
  }
  return region;
};

var getBooleanValue = function(value) {
  return value === 'true' ? true: value === 'false' ? false: undefined;
};

var USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env) {
    return getBooleanValue(env['AWS_USE_FIPS_ENDPOINT']);
  },
  configFileSelector: function(profile) {
    return getBooleanValue(profile['use_fips_endpoint']);
  },
  default: false,
};

var USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: function(env) {
    return getBooleanValue(env['AWS_USE_DUALSTACK_ENDPOINT']);
  },
  configFileSelector: function(profile) {
    return getBooleanValue(profile['use_dualstack_endpoint']);
  },
  default: false,
};

// Update configuration keys
AWS.util.update(AWS.Config.prototype.keys, {
  credentials: function () {
    var credentials = null;
    new AWS.CredentialProviderChain([
      function () { return new AWS.EnvironmentCredentials('AWS'); },
      function () { return new AWS.EnvironmentCredentials('AMAZON'); },
      function () { return new AWS.SharedIniFileCredentials({ disableAssumeRole: true }); }
    ]).resolve(function(err, creds) {
      if (!err) credentials = creds;
    });
    return credentials;
  },
  credentialProvider: function() {
    return new AWS.CredentialProviderChain();
  },
  logger: function () {
    return process.env.AWSJS_DEBUG ? console : null;
  },
  region: function() {
    var region = getRegion();
    return region ? getRealRegion(region): undefined;
  },
  tokenProvider: function() {
    return new AWS.TokenProviderChain();
  },
  useFipsEndpoint: function() {
    var region = getRegion();
    return isFipsRegion(region)
      ? true
      : util.loadConfig(USE_FIPS_ENDPOINT_CONFIG_OPTIONS);
  },
  useDualstackEndpoint: function() {
    return util.loadConfig(USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS);
  }
});

// Reset configuration
AWS.config = new AWS.Config();
