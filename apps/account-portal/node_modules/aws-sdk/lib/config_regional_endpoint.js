var AWS = require('./core');
/**
 * @api private
 */
function validateRegionalEndpointsFlagValue(configValue, errorOptions) {
  if (typeof configValue !== 'string') return undefined;
  else if (['legacy', 'regional'].indexOf(configValue.toLowerCase()) >= 0) {
    return configValue.toLowerCase();
  } else {
    throw AWS.util.error(new Error(), errorOptions);
  }
}

/**
 * Resolve the configuration value for regional endpoint from difference sources: client
 * config, environmental variable, shared config file. Value can be case-insensitive
 * 'legacy' or 'reginal'.
 * @param originalConfig user-supplied config object to resolve
 * @param options a map of config property names from individual configuration source
 *  - env: name of environmental variable that refers to the config
 *  - sharedConfig: name of shared configuration file property that refers to the config
 *  - clientConfig: name of client configuration property that refers to the config
 *
 * @api private
 */
function resolveRegionalEndpointsFlag(originalConfig, options) {
  originalConfig = originalConfig || {};
  //validate config value
  var resolved;
  if (originalConfig[options.clientConfig]) {
    resolved = validateRegionalEndpointsFlagValue(originalConfig[options.clientConfig], {
      code: 'InvalidConfiguration',
      message: 'invalid "' + options.clientConfig + '" configuration. Expect "legacy" ' +
      ' or "regional". Got "' + originalConfig[options.clientConfig] + '".'
    });
    if (resolved) return resolved;
  }
  if (!AWS.util.isNode()) return resolved;
  //validate environmental variable
  if (Object.prototype.hasOwnProperty.call(process.env, options.env)) {
    var envFlag = process.env[options.env];
    resolved = validateRegionalEndpointsFlagValue(envFlag, {
      code: 'InvalidEnvironmentalVariable',
      message: 'invalid ' + options.env + ' environmental variable. Expect "legacy" ' +
      ' or "regional". Got "' + process.env[options.env] + '".'
    });
    if (resolved) return resolved;
  }
  //validate shared config file
  var profile = {};
  try {
    var profiles = AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader);
    profile = profiles[process.env.AWS_PROFILE || AWS.util.defaultProfile];
  } catch (e) {};
  if (profile && Object.prototype.hasOwnProperty.call(profile, options.sharedConfig)) {
    var fileFlag = profile[options.sharedConfig];
    resolved = validateRegionalEndpointsFlagValue(fileFlag, {
      code: 'InvalidConfiguration',
      message: 'invalid ' + options.sharedConfig + ' profile config. Expect "legacy" ' +
      ' or "regional". Got "' + profile[options.sharedConfig] + '".'
    });
    if (resolved) return resolved;
  }
  return resolved;
}

module.exports = resolveRegionalEndpointsFlag;
