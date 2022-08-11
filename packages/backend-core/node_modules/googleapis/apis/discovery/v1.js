/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

/**
 * APIs Discovery Service
 *
 * Provides information about other Google APIs, such as what APIs are available, the resource, and method details for each API.
 *
 * @example
 * var google = require('googleapis');
 * var discovery = google.discovery('v1');
 *
 * @namespace discovery
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Discovery
 */
function Discovery(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.apis = {

    /**
     * discovery.apis.getRest
     *
     * @desc Retrieve the description of a particular version of an api.
     *
     * @alias discovery.apis.getRest
     * @memberOf! discovery(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.api The name of the API.
     * @param {string} params.version The version of the API.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getRest: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/discovery/v1/apis/{api}/{version}/rest',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['api', 'version'],
        pathParams: ['api', 'version'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * discovery.apis.list
     *
     * @desc Retrieve the list of APIs supported at this endpoint.
     *
     * @alias discovery.apis.list
     * @memberOf! discovery(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.name Only include APIs with the given name.
     * @param {boolean=} params.preferred Return only the preferred version of an API.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    list: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/discovery/v1/apis',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef DirectoryList
 * @memberOf! discovery(v1)
 * @type object
 * @property {string} discoveryVersion Indicate the version of the Discovery API used to generate this doc.
 * @property {object[]} items The individual directory entries. One entry per api/version pair.
 * @property {string} kind The kind for this response.
 */
/**
 * @typedef JsonSchema
 * @memberOf! discovery(v1)
 * @type object
 * @property {string} $ref A reference to another schema. The value of this property is the &quot;id&quot; of another schema.
 * @property {discovery(v1).JsonSchema} additionalProperties If this is a schema for an object, this property is the schema for any additional properties with dynamic keys on this object.
 * @property {object} annotations Additional information about this property.
 * @property {string} default The default value of this property (if one exists).
 * @property {string} description A description of this object.
 * @property {string[]} enum Values this parameter may take (if it is an enum).
 * @property {string[]} enumDescriptions The descriptions for the enums. Each position maps to the corresponding value in the &quot;enum&quot; array.
 * @property {string} format An additional regular expression or key that helps constrain the value. For more details see: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.23
 * @property {string} id Unique identifier for this schema.
 * @property {discovery(v1).JsonSchema} items If this is a schema for an array, this property is the schema for each element in the array.
 * @property {string} location Whether this parameter goes in the query or the path for REST requests.
 * @property {string} maximum The maximum value of this parameter.
 * @property {string} minimum The minimum value of this parameter.
 * @property {string} pattern The regular expression this parameter must conform to. Uses Java 6 regex format: http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html
 * @property {object} properties If this is a schema for an object, list the schema for each property of this object.
 * @property {boolean} readOnly The value is read-only, generated by the service. The value cannot be modified by the client. If the value is included in a POST, PUT, or PATCH request, it is ignored by the service.
 * @property {boolean} repeated Whether this parameter may appear multiple times.
 * @property {boolean} required Whether the parameter is required.
 * @property {string} type The value type for this schema. A list of values can be found here: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1
 * @property {object} variant In a variant data type, the value of one property is used to determine how to interpret the entire entity. Its value must exist in a map of descriminant values to schema names.
 */
/**
 * @typedef RestDescription
 * @memberOf! discovery(v1)
 * @type object
 * @property {object} auth Authentication information.
 * @property {string} basePath [DEPRECATED] The base path for REST requests.
 * @property {string} baseUrl [DEPRECATED] The base URL for REST requests.
 * @property {string} batchPath The path for REST batch requests.
 * @property {string} canonicalName Indicates how the API name should be capitalized and split into various parts. Useful for generating pretty class names.
 * @property {string} description The description of this API.
 * @property {string} discoveryVersion Indicate the version of the Discovery API used to generate this doc.
 * @property {string} documentationLink A link to human readable documentation for the API.
 * @property {string} etag The ETag for this response.
 * @property {boolean} exponentialBackoffDefault Enable exponential backoff for suitable methods in the generated clients.
 * @property {string[]} features A list of supported features for this API.
 * @property {object} icons Links to 16x16 and 32x32 icons representing the API.
 * @property {string} id The ID of this API.
 * @property {string} kind The kind for this response.
 * @property {string[]} labels Labels for the status of this API, such as labs or deprecated.
 * @property {object} methods API-level methods for this API.
 * @property {string} name The name of this API.
 * @property {string} ownerDomain The domain of the owner of this API. Together with the ownerName and a packagePath values, this can be used to generate a library for this API which would have a unique fully qualified name.
 * @property {string} ownerName The name of the owner of this API. See ownerDomain.
 * @property {string} packagePath The package of the owner of this API. See ownerDomain.
 * @property {object} parameters Common parameters that apply across all apis.
 * @property {string} protocol The protocol described by this document.
 * @property {object} resources The resources in this API.
 * @property {string} revision The version of this API.
 * @property {string} rootUrl The root URL under which all API services live.
 * @property {object} schemas The schemas for this API.
 * @property {string} servicePath The base path for all REST requests.
 * @property {string} title The title of this API.
 * @property {string} version The version of this API.
 * @property {boolean} version_module 
 */
/**
 * @typedef RestMethod
 * @memberOf! discovery(v1)
 * @type object
 * @property {string} description Description of this method.
 * @property {boolean} etagRequired Whether this method requires an ETag to be specified. The ETag is sent as an HTTP If-Match or If-None-Match header.
 * @property {string} httpMethod HTTP method used by this method.
 * @property {string} id A unique ID for this method. This property can be used to match methods between different versions of Discovery.
 * @property {object} mediaUpload Media upload parameters.
 * @property {string[]} parameterOrder Ordered list of required parameters, serves as a hint to clients on how to structure their method signatures. The array is ordered such that the &quot;most-significant&quot; parameter appears first.
 * @property {object} parameters Details for all parameters in this method.
 * @property {string} path The URI path of this REST method. Should be used in conjunction with the basePath property at the api-level.
 * @property {object} request The schema for the request.
 * @property {object} response The schema for the response.
 * @property {string[]} scopes OAuth 2.0 scopes applicable to this method.
 * @property {boolean} supportsMediaDownload Whether this method supports media downloads.
 * @property {boolean} supportsMediaUpload Whether this method supports media uploads.
 * @property {boolean} supportsSubscription Whether this method supports subscriptions.
 * @property {boolean} useMediaDownloadService Indicates that downloads from this method should use the download service URL (i.e. &quot;/download&quot;). Only applies if the method supports media download.
 */
/**
 * @typedef RestResource
 * @memberOf! discovery(v1)
 * @type object
 * @property {object} methods Methods on this resource.
 * @property {object} resources Sub-resources on this resource.
 */
module.exports = Discovery;
