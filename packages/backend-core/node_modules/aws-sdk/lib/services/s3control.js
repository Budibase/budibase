var AWS = require('../core');
var s3util = require('./s3util');
var regionUtil = require('../region_config');

AWS.util.update(AWS.S3Control.prototype, {
  /**
   * @api private
   */
  setupRequestListeners: function setupRequestListeners(request) {
    request.addListener('extractError', this.extractHostId);
    request.addListener('extractData', this.extractHostId);
    request.addListener('validate', this.validateAccountId);

    var isArnInBucket = s3util.isArnInParam(request, 'Bucket');
    var isArnInName = s3util.isArnInParam(request, 'Name');

    if (isArnInBucket) {
      request._parsedArn = AWS.util.ARN.parse(request.params['Bucket']);
      request.addListener('validate', this.validateOutpostsBucketArn);
      request.addListener('validate', s3util.validateOutpostsArn);
      request.addListener('afterBuild', this.addOutpostIdHeader);
    } else if (isArnInName) {
      request._parsedArn = AWS.util.ARN.parse(request.params['Name']);
      request.addListener('validate', s3util.validateOutpostsAccessPointArn);
      request.addListener('validate', s3util.validateOutpostsArn);
      request.addListener('afterBuild', this.addOutpostIdHeader);
    }

    if (isArnInBucket || isArnInName) {
      request.addListener('validate', this.validateArnRegion);
      request.addListener('validate', this.validateArnAccountWithParams, true);
      request.addListener('validate', s3util.validateArnAccount);
      request.addListener('validate', s3util.validateArnService);
      request.addListener('build', this.populateParamFromArn, true);
      request.addListener('build', this.populateUriFromArn);
      request.addListener('build', s3util.validatePopulateUriFromArn);
    }

    if (request.params.OutpostId &&
        (request.operation === 'createBucket' ||
          request.operation === 'listRegionalBuckets')) {
      request.addListener('build', this.populateEndpointForOutpostId);
    }
  },

  /**
   * Adds outpostId header
   */
  addOutpostIdHeader: function addOutpostIdHeader(req) {
    req.httpRequest.headers['x-amz-outpost-id'] = req._parsedArn.outpostId;
  },

  /**
   * Validate Outposts ARN supplied in Bucket parameter is a valid bucket name
   */
  validateOutpostsBucketArn: function validateOutpostsBucketArn(req) {
    var parsedArn = req._parsedArn;

    //can be ':' or '/'
    var delimiter = parsedArn.resource['outpost'.length];

    if (parsedArn.resource.split(delimiter).length !== 4) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Bucket ARN should have two resources outpost/{outpostId}/bucket/{accesspointName}'
      });
    }

    var bucket = parsedArn.resource.split(delimiter)[3];
    if (!s3util.dnsCompatibleBucketName(bucket) || bucket.match(/\./)) {
      throw AWS.util.error(new Error(), {
        code: 'InvalidARN',
        message: 'Bucket ARN is not DNS compatible. Got ' + bucket
      });
    }

    //set parsed valid bucket
    req._parsedArn.bucket = bucket;
  },

  /**
   * @api private
   */
  populateParamFromArn: function populateParamFromArn(req) {
    var parsedArn = req._parsedArn;
    if (s3util.isArnInParam(req, 'Bucket')) {
      req.params.Bucket = parsedArn.bucket;
    } else if (s3util.isArnInParam(req, 'Name')) {
      req.params.Name = parsedArn.accessPoint;
    }
  },

  /**
   * Populate URI according to the ARN
   */
  populateUriFromArn: function populateUriFromArn(req) {
    var parsedArn = req._parsedArn;

    var endpoint = req.httpRequest.endpoint;
    var useArnRegion = req.service.config.s3UseArnRegion;
    var useFipsEndpoint = req.service.config.useFipsEndpoint;

    endpoint.hostname = [
      's3-outposts' + (useFipsEndpoint ? '-fips': ''),
      useArnRegion ? parsedArn.region : req.service.config.region,
      'amazonaws.com'
    ].join('.');
    endpoint.host = endpoint.hostname;
  },

  /**
   * @api private
   */
  populateEndpointForOutpostId: function populateEndpointForOutpostId(req) {
    var endpoint = req.httpRequest.endpoint;
    var useFipsEndpoint = req.service.config.useFipsEndpoint;
    endpoint.hostname = [
      's3-outposts' + (useFipsEndpoint ? '-fips': ''),
      req.service.config.region,
      'amazonaws.com'
    ].join('.');
    endpoint.host = endpoint.hostname;
  },

  /**
   * @api private
   */
  extractHostId: function(response) {
    var hostId = response.httpResponse.headers ? response.httpResponse.headers['x-amz-id-2'] : null;
    response.extendedRequestId = hostId;
    if (response.error) {
      response.error.extendedRequestId = hostId;
    }
  },

  /**
   * @api private
   */
  validateArnRegion: function validateArnRegion(req) {
    s3util.validateArnRegion(req, { allowFipsEndpoint: true });
  },

  /**
   * @api private
   */
  validateArnAccountWithParams: function validateArnAccountWithParams(req) {
    var params = req.params;
    var inputModel = req.service.api.operations[req.operation].input;
    if (inputModel.members.AccountId) {
      var parsedArn = req._parsedArn;
      if (parsedArn.accountId) {
        if (params.AccountId) {
          if (params.AccountId !== parsedArn.accountId) {
            throw AWS.util.error(
              new Error(),
              {code: 'ValidationError', message: 'AccountId in ARN and request params should be same.'}
            );
          }
        } else {
          // Store accountId from ARN in params
          params.AccountId = parsedArn.accountId;
        }
      }
    }
  },

  /**
   * @api private
   */
  validateAccountId: function(request) {
    var params = request.params;
    if (!Object.prototype.hasOwnProperty.call(params, 'AccountId')) return;
    var accountId = params.AccountId;
    //validate type
    if (typeof accountId !== 'string') {
      throw AWS.util.error(
        new Error(),
        {code: 'ValidationError', message: 'AccountId must be a string.'}
      );
    }
    //validate length
    if (accountId.length < 1 || accountId.length > 63) {
      throw AWS.util.error(
        new Error(),
        {code: 'ValidationError', message: 'AccountId length should be between 1 to 63 characters, inclusive.'}
      );
    }
    //validate pattern
    var hostPattern = /^[a-zA-Z0-9]{1}$|^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$/;
    if (!hostPattern.test(accountId)) {
      throw AWS.util.error(new Error(),
        {code: 'ValidationError', message: 'AccountId should be hostname compatible. AccountId: ' + accountId});
    }
  },

  /**
   * @api private
   */
  getSigningName: function getSigningName(req) {
    var _super = AWS.Service.prototype.getSigningName;
    if (req && req._parsedArn && req._parsedArn.service) {
      return req._parsedArn.service;
    } else if (req.params.OutpostId &&
      (req.operation === 'createBucket' ||
        req.operation === 'listRegionalBuckets')) {
      return 's3-outposts';
    } else {
      return _super.call(this, req);
    }
  },
});
