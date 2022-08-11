// Copyright 2014-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var generatorUtils = require('./generator_utils');
var DefaultTransporter = generatorUtils.DefaultTransporter;
var buildurl = generatorUtils.buildurl;
var handleError = generatorUtils.handleError;
var async = require('async');
var fs = require('fs');
var url = require('url');
var util = require('util');
var createAPIRequest = require('./apirequest');

var transporter = new DefaultTransporter();

function getPathParams (params) {
  var pathParams = [];
  if (typeof params !== 'object') {
    params = {};
  }
  Object.keys(params).forEach(function (key) {
    if (params[key].location === 'path') {
      pathParams.push(key);
    }
  });
  return pathParams;
}

/**
 * Given a method schema, add a method to a target.
 *
 * @private
 * @param {object} target The target to which to add the method.
 * @param {object} schema The top-level schema that contains the rootUrl, etc.
 * @param {object} method The method schema from which to generate the method.
 * @param {object} context The context to add to the method.
 */
function makeMethod (schema, method, context) {
  return function (params, callback) {
    var url = buildurl(schema.rootUrl + schema.servicePath + method.path);

    var parameters = {
      options: {
        url: url.substring(1, url.length - 1),
        method: method.httpMethod
      },
      params: params,
      requiredParams: method.parameterOrder || [],
      pathParams: getPathParams(method.parameters),
      context: context
    };

    if (method.mediaUpload && method.mediaUpload.protocols &&
      method.mediaUpload.protocols.simple &&
      method.mediaUpload.protocols.simple.path) {
      var mediaUrl = buildurl(
        schema.rootUrl +
        method.mediaUpload.protocols.simple.path
      );
      parameters.mediaUrl = mediaUrl.substring(1, mediaUrl.length - 1);
    }

    return createAPIRequest(parameters, callback);
  };
}

/**
 * Given a schema, add methods to a target.
 *
 * @private
 * @param {object} target The target to which to apply the methods.
 * @param {object} rootSchema The top-level schema, so we don't lose track of it
 * during recursion.
 * @param {object} schema The current schema from which to extract methods.
 * @param {object} context The context to add to each method.
 */
function applyMethodsFromSchema (target, rootSchema, schema, context) {
  if (schema.methods) {
    for (var name in schema.methods) {
      var method = schema.methods[name];
      target[name] = makeMethod(rootSchema, method, context);
    }
  }
}

/**
 * Given a schema, add methods and resources to a target.
 *
 * @private
 * @param {object} target The target to which to apply the schema.
 * @param {object} rootSchema The top-level schema, so we don't lose track of it
 * during recursion.
 * @param {object} schema The current schema from which to extract methods and
 * resources.
 * @param {object} context The context to add to each method.
 */
function applySchema (target, rootSchema, schema, context) {
  applyMethodsFromSchema(target, rootSchema, schema, context);

  if (schema.resources) {
    for (var resourceName in schema.resources) {
      var resource = schema.resources[resourceName];
      if (!target[resourceName]) {
        target[resourceName] = {};
      }
      applySchema(target[resourceName], rootSchema, resource, context);
    }
  }
}

/**
 * Generate and Endpoint from an endpoint schema object.
 *
 * @private
 * @param {object} schema The schema from which to generate the Endpoint.
 * @return Function The Endpoint.
 */
function makeEndpoint (schema) {
  var Endpoint = function (options) {
    var self = this;
    self._options = options || {};

    applySchema(self, schema, schema, self);
  };
  return Endpoint;
}

/**
 * Discovery for discovering API endpoints
 *
 * @private
 * @param {object} options Options for discovery
 * @this {Discovery}
 */
function Discovery (options) {
  this.options = options || {};
}

/**
 * Log output of generator
 * Works just like console.log
 */
Discovery.prototype.log = function () {
  if (this.options && this.options.debug) {
    console.log.apply(this, arguments);
  }
};

/**
 * Generate all APIs and return as in-memory object.
 *
 * @param {function} callback Callback when all APIs have been generated
 * @throws {Error} If there is an error generating any of the APIs
 */
Discovery.prototype.discoverAllAPIs = function (discoveryUrl, callback) {
  var self = this;
  var headers = this.options.includePrivate ? {} : { 'X-User-Ip': '0.0.0.0' };
  transporter.request({
    uri: discoveryUrl,
    headers: headers
  }, function (err, resp) {
    if (err) {
      return handleError(err, callback);
    }

    async.parallel(resp.items.map(function (api) {
      return function (cb) {
        self.discoverAPI(api.discoveryRestUrl, function (err, _api) {
          if (err) {
            return cb(err);
          }
          api.api = _api;
          cb(null, api);
        });
      };
    }), function (err, apis) {
      if (err) {
        return callback(err);
      }

      var versionIndex = {};
      var apisIndex = {};

      apis.forEach(function (api) {
        if (!apisIndex[api.name]) {
          versionIndex[api.name] = {};
          apisIndex[api.name] = function (options) {
            var type = typeof options;
            var version;
            if (type === 'string') {
              version = options;
              options = {};
            } else if (type === 'object') {
              version = options.version;
              delete options.version;
            } else {
              throw new Error('Argument error: Accepts only string or object');
            }
            try {
              var Endpoint = versionIndex[api.name][version];
              var ep = new Endpoint(options);
              ep.google = this; // for drive.google.transporter
              return Object.freeze(ep); // create new & freeze
            } catch (e) {
              throw new Error(util.format('Unable to load endpoint %s("%s"): %s',
                api.name, version, e.message));
            }
          };
        }
        versionIndex[api.name][api.version] = api.api;
      });

      return callback(null, apisIndex);
    });
  });
};

/**
 * Generate API file given discovery URL
 *
 * @param  {String} apiDiscoveryUrl URL or filename of discovery doc for API
 * @param {function} callback Callback when successful write of API
 * @throws {Error} If there is an error generating the API.
 */
Discovery.prototype.discoverAPI = function (apiDiscoveryUrl, callback) {
  function _generate (err, resp) {
    if (err) {
      return handleError(err, callback);
    }
    return callback(null, makeEndpoint(resp));
  }

  if (typeof apiDiscoveryUrl === 'string') {
    var parts = url.parse(apiDiscoveryUrl);

    if (apiDiscoveryUrl && !parts.protocol) {
      this.log('Reading from file ' + apiDiscoveryUrl);
      try {
        return fs.readFile(apiDiscoveryUrl, {
          encoding: 'utf8'
        }, function (err, file) {
          _generate(err, JSON.parse(file));
        });
      } catch (err) {
        return handleError(err, callback);
      }
    } else {
      this.log('Requesting ' + apiDiscoveryUrl);
      transporter.request({
        uri: apiDiscoveryUrl
      }, _generate);
    }
  } else {
    var options = apiDiscoveryUrl;
    this.log('Requesting ' + options.url);
    var parameters = {
      options: {
        url: options.url,
        method: 'GET'
      },
      requiredParams: [],
      pathParams: [],
      context: {
        google: {
          _options: {}
        },
        _options: {}
      }
    };
    delete options.url;
    parameters.params = options;
    createAPIRequest(parameters, _generate);
  }
};

/**
 * Export the Discovery object
 * @type {Discovery}
 */
module.exports = Discovery;
