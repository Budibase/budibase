var AWS = require('../core');
var regionUtil = require('../region_config');

var s3util = {
  /**
   * @api private
   */
  isArnInParam: function isArnInParam(req, paramName) {
    var inputShape = (req.service.api.operations[req.operation] || {}).input || {};
    var inputMembers = inputShape.members || {};
    if (!req.params[paramName] || !inputMembers[paramName]) return false;
    return AWS.util.ARN.validate(req.params[paramName]);
  },

  /**
   * Validate service component from ARN supplied in Bucket parameter
   */
  validateArnService: function validateArnService(req) {
    var parsedArn = req._parsedArn;

    if (parsedArn.service !== 's3'
      && parsedArn.service !== 's3-outposts'
      && parsedArn.service !== 's3-object-lambda') {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'expect \'s3\' or \'s3-outposts\' or \'s3-object-lambda\' in ARN service component'
      });
    }
  },

  /**
   * Validate account ID from ARN supplied in Bucket parameter is a valid account
   */
  validateArnAccount: function validateArnAccount(req) {
    var parsedArn = req._parsedArn;

    if (!/[0-9]{12}/.exec(parsedArn.accountId)) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'ARN accountID does not match regex "[0-9]{12}"'
      });
    }
  },

  /**
   * Validate ARN supplied in Bucket parameter is a valid access point ARN
   */
  validateS3AccessPointArn: function validateS3AccessPointArn(req) {
    var parsedArn = req._parsedArn;

    //can be ':' or '/'
    var delimiter = parsedArn.resource['accesspoint'.length];

    if (parsedArn.resource.split(delimiter).length !== 2) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Access Point ARN should have one resource accesspoint/{accesspointName}'
      });
    }

    var accessPoint = parsedArn.resource.split(delimiter)[1];
    var accessPointPrefix = accessPoint + '-' + parsedArn.accountId;
    if (!s3util.dnsCompatibleBucketName(accessPointPrefix) || accessPointPrefix.match(/\./)) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Access point resource in ARN is not DNS compatible. Got ' + accessPoint
      });
    }

    //set parsed valid access point
    req._parsedArn.accessPoint = accessPoint;
  },

  /**
   * Validate Outposts ARN supplied in Bucket parameter is a valid outposts ARN
   */
  validateOutpostsArn: function validateOutpostsArn(req) {
    var parsedArn = req._parsedArn;

    if (
      parsedArn.resource.indexOf('outpost:') !== 0 &&
      parsedArn.resource.indexOf('outpost/') !== 0
    ) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'ARN resource should begin with \'outpost/\''
      });
    }

    //can be ':' or '/'
    var delimiter = parsedArn.resource['outpost'.length];
    var outpostId = parsedArn.resource.split(delimiter)[1];
    var dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
    if (!dnsHostRegex.test(outpostId)) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Outpost resource in ARN is not DNS compatible. Got ' + outpostId
      });
    }
    req._parsedArn.outpostId = outpostId;
  },

  /**
   * Validate Outposts ARN supplied in Bucket parameter is a valid outposts ARN
   */
  validateOutpostsAccessPointArn: function validateOutpostsAccessPointArn(req) {
    var parsedArn = req._parsedArn;

    //can be ':' or '/'
    var delimiter = parsedArn.resource['outpost'.length];

    if (parsedArn.resource.split(delimiter).length !== 4) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Outposts ARN should have two resources outpost/{outpostId}/accesspoint/{accesspointName}'
      });
    }

    var accessPoint = parsedArn.resource.split(delimiter)[3];
    var accessPointPrefix = accessPoint + '-' + parsedArn.accountId;
    if (!s3util.dnsCompatibleBucketName(accessPointPrefix) || accessPointPrefix.match(/\./)) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Access point resource in ARN is not DNS compatible. Got ' + accessPoint
      });
    }

    //set parsed valid access point
    req._parsedArn.accessPoint = accessPoint;
  },

  /**
   * Validate region field in ARN supplied in Bucket parameter is a valid region
   */
  validateArnRegion: function validateArnRegion(req, options) {
    if (options === undefined) {
      options = {};
    }

    var useArnRegion = s3util.loadUseArnRegionConfig(req);
    var regionFromArn = req._parsedArn.region;
    var clientRegion = req.service.config.region;
    var useFipsEndpoint = req.service.config.useFipsEndpoint;
    var allowFipsEndpoint = options.allowFipsEndpoint || false;

    if (!regionFromArn) {
      var message = 'ARN region is empty';
      if (req._parsedArn.service === 's3') {
        message = message + '\nYou may want to use multi-regional ARN. The feature is not supported in current SDK. ' +
        'You should consider switching to V3(https://github.com/aws/aws-sdk-js-v3).';
      }
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: message
      });
    }

    if (useFipsEndpoint && !allowFipsEndpoint) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'ARN endpoint is not compatible with FIPS region'
      });
    }

    if (regionFromArn.indexOf('fips') >= 0) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'FIPS region not allowed in ARN'
      });
    }

    if (!useArnRegion && regionFromArn !== clientRegion) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'Configured region conflicts with access point region'
      });
    } else if (
      useArnRegion &&
      regionUtil.getEndpointSuffix(regionFromArn) !== regionUtil.getEndpointSuffix(clientRegion)
    ) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'Configured region and access point region not in same partition'
      });
    }

    if (req.service.config.useAccelerateEndpoint) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'useAccelerateEndpoint config is not supported with access point ARN'
      });
    }

    if (req._parsedArn.service === 's3-outposts' && req.service.config.useDualstackEndpoint) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'Dualstack is not supported with outposts access point ARN'
      });
    }
  },

  loadUseArnRegionConfig: function loadUseArnRegionConfig(req) {
    var envName = 'AWS_S3_USE_ARN_REGION';
    var configName = 's3_use_arn_region';
    var useArnRegion = true;
    var originalConfig = req.service._originalConfig || {};
    if (req.service.config.s3UseArnRegion !== undefined) {
      return req.service.config.s3UseArnRegion;
    } else if (originalConfig.s3UseArnRegion !== undefined) {
      useArnRegion = originalConfig.s3UseArnRegion === true;
    } else if (AWS.util.isNode()) {
      //load from environmental variable AWS_USE_ARN_REGION
      if (process.env[envName]) {
        var value = process.env[envName].trim().toLowerCase();
        if (['false', 'true'].indexOf(value) < 0) {
          throw AWS.util.error(new Error(), {
            code: 'InvalidConfiguration',
            message: envName + ' only accepts true or false. Got ' + process.env[envName],
            retryable: false
          });
        }
        useArnRegion = value === 'true';
      } else {  //load from shared config property use_arn_region
        var profiles = {};
        var profile = {};
        try {
          profiles = AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader);
          profile = profiles[process.env.AWS_PROFILE || AWS.util.defaultProfile];
        } catch (e) {}
        if (profile[configName]) {
          if (['false', 'true'].indexOf(profile[configName].trim().toLowerCase()) < 0) {
            throw AWS.util.error(new Error(), {
              code: 'InvalidConfiguration',
              message: configName + ' only accepts true or false. Got ' + profile[configName],
              retryable: false
            });
          }
          useArnRegion = profile[configName].trim().toLowerCase() === 'true';
        }
      }
    }
    req.service.config.s3UseArnRegion = useArnRegion;
    return useArnRegion;
  },

  /**
   * Validations before URI can be populated
   */
  validatePopulateUriFromArn: function validatePopulateUriFromArn(req) {
    if (req.service._originalConfig && req.service._originalConfig.endpoint) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'Custom endpoint is not compatible with access point ARN'
      });
    }

    if (req.service.config.s3ForcePathStyle) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidConfiguration',
        message: 'Cannot construct path-style endpoint with access point'
      });
    }
  },

  /**
   * Returns true if the bucket name is DNS compatible.  Buckets created
   * outside of the classic region MUST be DNS compatible.
   *
   * @api private
   */
  dnsCompatibleBucketName: function dnsCompatibleBucketName(bucketName) {
    var b = bucketName;
    var domain = new RegExp(/^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/);
    var ipAddress = new RegExp(/(\d+\.){3}\d+/);
    var dots = new RegExp(/\.\./);
    return (b.match(domain) && !b.match(ipAddress) && !b.match(dots)) ? true : false;
  },
};

/**
 * @api private
 */
module.exports = s3util;
