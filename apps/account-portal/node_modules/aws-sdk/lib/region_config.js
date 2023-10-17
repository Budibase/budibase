var util = require('./util');
var regionConfig = require('./region_config_data.json');

function generateRegionPrefix(region) {
  if (!region) return null;
  if (isFipsRegion(region)) {
    if (isFipsCnRegion(region)) return 'fips-cn-*';
    if (isFipsUsGovRegion(region)) return 'fips-us-gov-*';
    if (region.startsWith('fips-accesspoint-')) return 'fips-accesspoint-*';
    return 'fips-*';
  }

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
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!key) continue;

    if (Object.prototype.hasOwnProperty.call(regionConfig.rules, key)) {
      var config = regionConfig.rules[key];
      if (typeof config === 'string') {
        config = regionConfig.patterns[config];
      }

      // set dualstack endpoint
      if (service.config.useDualstack && util.isDualstackAvailable(service)) {
        config = util.copy(config);
        config.endpoint = config.endpoint.replace(
          /{service}\.({region}\.)?/,
          '{service}.dualstack.{region}.'
        );
      }

      // set FIPS signingRegion and endpoint.
      if (isFipsRegion(service.config.region)) {
        config = util.copy(config);
        service.signingRegion = getRealRegion(service.config.region);
      }

      // set global endpoint
      service.isGlobalEndpoint = !!config.globalEndpoint;
      if (config.signingRegion) {
        service.signingRegion = config.signingRegion;
      }

      // signature version
      if (!config.signatureVersion) config.signatureVersion = 'v4';

      // merge config
      applyConfig(service, config);
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

function isFipsRegion(region) {
  return region && (region.startsWith('fips-') || region.endsWith('-fips'));
}

function isFipsUsGovRegion(region) {
  return (
    region &&
    region.startsWith('fips-us-gov-') ||
    (region.startsWith('us-gov-') && region.endsWith('-fips'))
  );
}

function isFipsCnRegion(region) {
  return (
    region &&
    region.startsWith('fips-cn-') ||
    (region.startsWith('cn-') && region.endsWith('-fips'))
  );
}

function getRealRegion(region) {
  return isFipsRegion(region)
    ? ['fips-aws-global', 'aws-fips'].includes(region)
      ? 'us-east-1'
      : region === 'fips-aws-us-gov-global'
      ? 'us-gov-west-1'
      : region.replace(/fips-(dkr-|prod-|accesspoint-)?|-fips/, '')
    : region;
}

/**
 * @api private
 */
module.exports = {
  configureEndpoint: configureEndpoint,
  getEndpointSuffix: getEndpointSuffix,
  getRealRegion: getRealRegion,
};
