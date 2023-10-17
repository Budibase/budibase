var util = require('./util');
var regionConfig = require('./region_config_data.json');

function generateRegionPrefix(region) {
  if (!region) return null;
  var parts = region.split('-');
  if (parts.length < 3) return null;
  return parts.slice(0, parts.length - 2).join('-') + '-*';
}

function derivedKeys(service) {
  var region = service.config.region;
  var regionPrefix = generateRegionPrefix(region);
  var endpointPrefix = service.api.endpointPrefix;

  return [
    [region, endpointPrefix],
    [regionPrefix, endpointPrefix],
    [region, '*'],
    [regionPrefix, '*'],
    ['*', endpointPrefix],
    [region, 'internal-*'],
    ['*', '*']
  ].map(function(item) {
    return item[0] && item[1] ? item.join('/') : null;
  });
}

function applyConfig(service, config) {
  util.each(config, function(key, value) {
    if (key === 'globalEndpoint') return;
    if (service.config[key] === undefined || service.config[key] === null) {
      service.config[key] = value;
    }
  });
}

function configureEndpoint(service) {
  var keys = derivedKeys(service);
  var useFipsEndpoint = service.config.useFipsEndpoint;
  var useDualstackEndpoint = service.config.useDualstackEndpoint;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!key) continue;

    var rules = useFipsEndpoint
      ? useDualstackEndpoint
        ? regionConfig.dualstackFipsRules
        : regionConfig.fipsRules
      : useDualstackEndpoint
      ? regionConfig.dualstackRules
      : regionConfig.rules;

    if (Object.prototype.hasOwnProperty.call(rules, key)) {
      var config = rules[key];
      if (typeof config === 'string') {
        config = regionConfig.patterns[config];
      }

      // set global endpoint
      service.isGlobalEndpoint = !!config.globalEndpoint;
      if (config.signingRegion) {
        service.signingRegion = config.signingRegion;
      }

      // signature version
      if (!config.signatureVersion) {
        // Note: config is a global object and should not be mutated here.
        // However, we are retaining this line for backwards compatibility.
        // The non-v4 signatureVersion will be set in a copied object below.
        config.signatureVersion = 'v4';
      }

      var useBearer = (service.api && service.api.signatureVersion) === 'bearer';

      // merge config
      applyConfig(service, Object.assign(
        {},
        config,
        { signatureVersion: useBearer ? 'bearer' : config.signatureVersion }
      ));
      return;
    }
  }
}

function getEndpointSuffix(region) {
  var regionRegexes = {
    '^(us|eu|ap|sa|ca|me)\\-\\w+\\-\\d+$': 'amazonaws.com',
    '^cn\\-\\w+\\-\\d+$': 'amazonaws.com.cn',
    '^us\\-gov\\-\\w+\\-\\d+$': 'amazonaws.com',
    '^us\\-iso\\-\\w+\\-\\d+$': 'c2s.ic.gov',
    '^us\\-isob\\-\\w+\\-\\d+$': 'sc2s.sgov.gov'
  };
  var defaultSuffix = 'amazonaws.com';
  var regexes = Object.keys(regionRegexes);
  for (var i = 0; i < regexes.length; i++) {
    var regionPattern = RegExp(regexes[i]);
    var dnsSuffix = regionRegexes[regexes[i]];
    if (regionPattern.test(region)) return dnsSuffix;
  }
  return defaultSuffix;
}

/**
 * @api private
 */
module.exports = {
  configureEndpoint: configureEndpoint,
  getEndpointSuffix: getEndpointSuffix,
};
