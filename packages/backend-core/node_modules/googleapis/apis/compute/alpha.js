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
 * Compute Engine API
 *
 * Creates and runs virtual machines on Google Cloud Platform.
 *
 * @example
 * var google = require('googleapis');
 * var compute = google.compute('alpha');
 *
 * @namespace compute
 * @type {Function}
 * @version alpha
 * @variation alpha
 * @param {object=} options Options for Compute
 */
function Compute(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.addresses = {

    /**
     * compute.addresses.aggregatedList
     *
     * @desc Retrieves an aggregated list of addresses.
     *
     * @alias compute.addresses.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/addresses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.addresses.delete
     *
     * @desc Deletes the specified address resource.
     *
     * @alias compute.addresses.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.address Name of the address resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/addresses/{address}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'address'],
        pathParams: ['address', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.addresses.get
     *
     * @desc Returns the specified address resource.
     *
     * @alias compute.addresses.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.address Name of the address resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/addresses/{address}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'address'],
        pathParams: ['address', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.addresses.insert
     *
     * @desc Creates an address resource in the specified project using the data included in the request.
     *
     * @alias compute.addresses.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).Address} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/addresses',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.addresses.list
     *
     * @desc Retrieves a list of addresses contained within the specified region.
     *
     * @alias compute.addresses.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/addresses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.addresses.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.addresses.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/addresses/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.autoscalers = {

    /**
     * compute.autoscalers.aggregatedList
     *
     * @desc Retrieves an aggregated list of autoscalers.
     *
     * @alias compute.autoscalers.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/autoscalers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.delete
     *
     * @desc Deletes the specified autoscaler.
     *
     * @alias compute.autoscalers.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers/{autoscaler}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'autoscaler'],
        pathParams: ['autoscaler', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.get
     *
     * @desc Returns the specified autoscaler resource. Get a list of available autoscalers by making a list() request.
     *
     * @alias compute.autoscalers.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers/{autoscaler}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'autoscaler'],
        pathParams: ['autoscaler', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.insert
     *
     * @desc Creates an autoscaler in the specified project using the data included in the request.
     *
     * @alias compute.autoscalers.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.list
     *
     * @desc Retrieves a list of autoscalers contained within the specified zone.
     *
     * @alias compute.autoscalers.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.patch
     *
     * @desc Updates an autoscaler in the specified project using the data included in the request. This method supports patch semantics.
     *
     * @alias compute.autoscalers.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'autoscaler'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.autoscalers.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.autoscalers.update
     *
     * @desc Updates an autoscaler in the specified project using the data included in the request.
     *
     * @alias compute.autoscalers.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.autoscaler Name of the autoscaler to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/autoscalers',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.backendBuckets = {

    /**
     * compute.backendBuckets.delete
     *
     * @desc Deletes the specified BackendBucket resource.
     *
     * @alias compute.backendBuckets.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendBucket Name of the BackendBucket resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{backendBucket}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'backendBucket'],
        pathParams: ['backendBucket', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.get
     *
     * @desc Returns the specified BackendBucket resource. Get a list of available backend buckets by making a list() request.
     *
     * @alias compute.backendBuckets.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendBucket Name of the BackendBucket resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{backendBucket}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'backendBucket'],
        pathParams: ['backendBucket', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias compute.backendBuckets.getIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.insert
     *
     * @desc Creates a BackendBucket resource in the specified project using the data included in the request.
     *
     * @alias compute.backendBuckets.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendBucket} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.list
     *
     * @desc Retrieves the list of BackendBucket resources available to the specified project.
     *
     * @alias compute.backendBuckets.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.patch
     *
     * @desc Updates the specified BackendBucket resource with the data included in the request. This method supports patch semantics.
     *
     * @alias compute.backendBuckets.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendBucket Name of the BackendBucket resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendBucket} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{backendBucket}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'backendBucket'],
        pathParams: ['backendBucket', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias compute.backendBuckets.setIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.backendBuckets.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendBuckets.update
     *
     * @desc Updates the specified BackendBucket resource with the data included in the request.
     *
     * @alias compute.backendBuckets.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendBucket Name of the BackendBucket resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendBucket} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendBuckets/{backendBucket}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'backendBucket'],
        pathParams: ['backendBucket', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.backendServices = {

    /**
     * compute.backendServices.aggregatedList
     *
     * @desc Retrieves the list of all BackendService resources, regional and global, available to the specified project.
     *
     * @alias compute.backendServices.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Name of the project scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/backendServices',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.delete
     *
     * @desc Deletes the specified BackendService resource.
     *
     * @alias compute.backendServices.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{backendService}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'backendService'],
        pathParams: ['backendService', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.get
     *
     * @desc Returns the specified BackendService resource. Get a list of available backend services by making a list() request.
     *
     * @alias compute.backendServices.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{backendService}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'backendService'],
        pathParams: ['backendService', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.getHealth
     *
     * @desc Gets the most recent health check results for this BackendService.
     *
     * @alias compute.backendServices.getHealth
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to which the queried instance belongs.
     * @param {string} params.project 
     * @param {compute(alpha).ResourceGroupReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getHealth: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{backendService}/getHealth',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'backendService'],
        pathParams: ['backendService', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.insert
     *
     * @desc Creates a BackendService resource in the specified project using the data included in the request. There are several restrictions and guidelines to keep in mind when creating a backend service. Read  Restrictions and Guidelines for more information.
     *
     * @alias compute.backendServices.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.list
     *
     * @desc Retrieves the list of BackendService resources available to the specified project.
     *
     * @alias compute.backendServices.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.patch
     *
     * @desc Updates the specified BackendService resource with the data included in the request. There are several restrictions and guidelines to keep in mind when updating a backend service. Read  Restrictions and Guidelines for more information. This method supports patch semantics.
     *
     * @alias compute.backendServices.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{backendService}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'backendService'],
        pathParams: ['backendService', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.backendServices.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.backendServices.update
     *
     * @desc Updates the specified BackendService resource with the data included in the request. There are several restrictions and guidelines to keep in mind when updating a backend service. Read  Restrictions and Guidelines for more information.
     *
     * @alias compute.backendServices.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/backendServices/{backendService}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'backendService'],
        pathParams: ['backendService', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.clientSslPolicies = {

    /**
     * compute.clientSslPolicies.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.clientSslPolicies.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/clientSslPolicies/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.commitments = {

    /**
     * compute.commitments.aggregatedList
     *
     * @desc Retrieves an aggregated list of commitments.
     *
     * @alias compute.commitments.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/commitments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.get
     *
     * @desc Returns the specified commitment resource. Get a list of available commitments by making a list() request.
     *
     * @alias compute.commitments.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commitment Name of the commitment to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments/{commitment}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'commitment'],
        pathParams: ['commitment', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias compute.commitments.getIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.insert
     *
     * @desc Creates an commitment in the specified project using the data included in the request.
     *
     * @alias compute.commitments.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {compute(alpha).Commitment} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.list
     *
     * @desc Retrieves a list of commitments contained within the specified zone.
     *
     * @alias compute.commitments.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias compute.commitments.setIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.commitments.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.commitments.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/commitments/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.diskTypes = {

    /**
     * compute.diskTypes.aggregatedList
     *
     * @desc Retrieves an aggregated list of disk types.
     *
     * @alias compute.diskTypes.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/diskTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.diskTypes.get
     *
     * @desc Returns the specified disk type. Get a list of available disk types by making a list() request.
     *
     * @alias compute.diskTypes.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.diskType Name of the disk type to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/diskTypes/{diskType}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'diskType'],
        pathParams: ['diskType', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.diskTypes.list
     *
     * @desc Retrieves a list of disk types available to the specified project.
     *
     * @alias compute.diskTypes.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/diskTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.disks = {

    /**
     * compute.disks.aggregatedList
     *
     * @desc Retrieves an aggregated list of persistent disks.
     *
     * @alias compute.disks.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/disks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.createSnapshot
     *
     * @desc Creates a snapshot of a specified persistent disk.
     *
     * @alias compute.disks.createSnapshot
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the persistent disk to snapshot.
     * @param {boolean=} params.guestFlush 
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Snapshot} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createSnapshot: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{disk}/createSnapshot',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'disk'],
        pathParams: ['disk', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.delete
     *
     * @desc Deletes the specified persistent disk. Deleting a disk removes its data permanently and is irreversible. However, deleting a disk does not delete any snapshots previously made from the disk. You must separately delete snapshots.
     *
     * @alias compute.disks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the persistent disk to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{disk}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'disk'],
        pathParams: ['disk', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.get
     *
     * @desc Returns a specified persistent disk. Get a list of available persistent disks by making a list() request.
     *
     * @alias compute.disks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the persistent disk to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{disk}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'disk'],
        pathParams: ['disk', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.insert
     *
     * @desc Creates a persistent disk in the specified project using the data in the request. You can create a disk with a sourceImage, a sourceSnapshot, or create an empty 500 GB data disk by omitting all properties. You can also create a disk that is larger than the default size by specifying the sizeGb property.
     *
     * @alias compute.disks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string=} params.sourceImage Optional. Source image to restore onto a disk.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Disk} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.list
     *
     * @desc Retrieves a list of persistent disks contained within the specified zone.
     *
     * @alias compute.disks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.resize
     *
     * @desc Resizes the specified persistent disk.
     *
     * @alias compute.disks.resize
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk The name of the persistent disk.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).DisksResizeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{disk}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'disk'],
        pathParams: ['disk', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.setLabels
     *
     * @desc Sets the labels on a disk. To learn more about labels, read the Labeling or Tagging Resources documentation.
     *
     * @alias compute.disks.setLabels
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).ZoneSetLabelsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setLabels: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{resource}/setLabels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.disks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.disks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/disks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.firewalls = {

    /**
     * compute.firewalls.delete
     *
     * @desc Deletes the specified firewall.
     *
     * @alias compute.firewalls.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.firewall Name of the firewall rule to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls/{firewall}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'firewall'],
        pathParams: ['firewall', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.get
     *
     * @desc Returns the specified firewall.
     *
     * @alias compute.firewalls.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.firewall Name of the firewall rule to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls/{firewall}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'firewall'],
        pathParams: ['firewall', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.insert
     *
     * @desc Creates a firewall rule in the specified project using the data included in the request.
     *
     * @alias compute.firewalls.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Firewall} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.list
     *
     * @desc Retrieves the list of firewall rules available to the specified project.
     *
     * @alias compute.firewalls.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.patch
     *
     * @desc Updates the specified firewall rule with the data included in the request. This method supports patch semantics.
     *
     * @alias compute.firewalls.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.firewall Name of the firewall rule to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Firewall} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls/{firewall}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'firewall'],
        pathParams: ['firewall', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.firewalls.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.firewalls.update
     *
     * @desc Updates the specified firewall rule with the data included in the request.
     *
     * @alias compute.firewalls.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.firewall Name of the firewall rule to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Firewall} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/firewalls/{firewall}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'firewall'],
        pathParams: ['firewall', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.forwardingRules = {

    /**
     * compute.forwardingRules.aggregatedList
     *
     * @desc Retrieves an aggregated list of forwarding rules.
     *
     * @alias compute.forwardingRules.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/forwardingRules',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.delete
     *
     * @desc Deletes the specified ForwardingRule resource.
     *
     * @alias compute.forwardingRules.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules/{forwardingRule}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.get
     *
     * @desc Returns the specified ForwardingRule resource.
     *
     * @alias compute.forwardingRules.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules/{forwardingRule}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.insert
     *
     * @desc Creates a ForwardingRule resource in the specified project and region using the data included in the request.
     *
     * @alias compute.forwardingRules.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).ForwardingRule} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.list
     *
     * @desc Retrieves a list of ForwardingRule resources available to the specified project and region.
     *
     * @alias compute.forwardingRules.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.setTarget
     *
     * @desc Changes target URL for forwarding rule. The new target should be of the same type as the old target.
     *
     * @alias compute.forwardingRules.setTarget
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource in which target is to be set.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).TargetReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTarget: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules/{forwardingRule}/setTarget',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.forwardingRules.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.forwardingRules.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/forwardingRules/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.globalAddresses = {

    /**
     * compute.globalAddresses.delete
     *
     * @desc Deletes the specified address resource.
     *
     * @alias compute.globalAddresses.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.address Name of the address resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/addresses/{address}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'address'],
        pathParams: ['address', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalAddresses.get
     *
     * @desc Returns the specified address resource. Get a list of available addresses by making a list() request.
     *
     * @alias compute.globalAddresses.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.address Name of the address resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/addresses/{address}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'address'],
        pathParams: ['address', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalAddresses.insert
     *
     * @desc Creates an address resource in the specified project using the data included in the request.
     *
     * @alias compute.globalAddresses.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Address} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/addresses',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalAddresses.list
     *
     * @desc Retrieves a list of global addresses.
     *
     * @alias compute.globalAddresses.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/addresses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalAddresses.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.globalAddresses.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/addresses/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.globalForwardingRules = {

    /**
     * compute.globalForwardingRules.delete
     *
     * @desc Deletes the specified ForwardingRule resource.
     *
     * @alias compute.globalForwardingRules.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules/{forwardingRule}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalForwardingRules.get
     *
     * @desc Returns the specified ForwardingRule resource. Get a list of available forwarding rules by making a list() request.
     *
     * @alias compute.globalForwardingRules.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules/{forwardingRule}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalForwardingRules.insert
     *
     * @desc Creates a ForwardingRule resource in the specified project and region using the data included in the request.
     *
     * @alias compute.globalForwardingRules.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).ForwardingRule} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalForwardingRules.list
     *
     * @desc Retrieves a list of ForwardingRule resources available to the specified project.
     *
     * @alias compute.globalForwardingRules.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalForwardingRules.setTarget
     *
     * @desc Changes target URL for forwarding rule. The new target should be of the same type as the old target.
     *
     * @alias compute.globalForwardingRules.setTarget
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.forwardingRule Name of the ForwardingRule resource in which target is to be set.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).TargetReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTarget: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules/{forwardingRule}/setTarget',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'forwardingRule'],
        pathParams: ['forwardingRule', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalForwardingRules.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.globalForwardingRules.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/forwardingRules/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.globalOperations = {

    /**
     * compute.globalOperations.aggregatedList
     *
     * @desc Retrieves an aggregated list of all operations.
     *
     * @alias compute.globalOperations.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalOperations.delete
     *
     * @desc Deletes the specified Operations resource.
     *
     * @alias compute.globalOperations.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/operations/{operation}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'operation'],
        pathParams: ['operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalOperations.get
     *
     * @desc Retrieves the specified Operations resource. Get a list of operations by making a list() request.
     *
     * @alias compute.globalOperations.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'operation'],
        pathParams: ['operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.globalOperations.list
     *
     * @desc Retrieves a list of Operation resources contained within the specified project.
     *
     * @alias compute.globalOperations.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.healthChecks = {

    /**
     * compute.healthChecks.delete
     *
     * @desc Deletes the specified HealthCheck resource.
     *
     * @alias compute.healthChecks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.healthCheck Name of the HealthCheck resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks/{healthCheck}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'healthCheck'],
        pathParams: ['healthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.get
     *
     * @desc Returns the specified HealthCheck resource. Get a list of available health checks by making a list() request.
     *
     * @alias compute.healthChecks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.healthCheck Name of the HealthCheck resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks/{healthCheck}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'healthCheck'],
        pathParams: ['healthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.insert
     *
     * @desc Creates a HealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.healthChecks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.list
     *
     * @desc Retrieves the list of HealthCheck resources available to the specified project.
     *
     * @alias compute.healthChecks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.patch
     *
     * @desc Updates a HealthCheck resource in the specified project using the data included in the request. This method supports patch semantics.
     *
     * @alias compute.healthChecks.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.healthCheck Name of the HealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks/{healthCheck}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'healthCheck'],
        pathParams: ['healthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.healthChecks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.healthChecks.update
     *
     * @desc Updates a HealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.healthChecks.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.healthCheck Name of the HealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/healthChecks/{healthCheck}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'healthCheck'],
        pathParams: ['healthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.hosts = {

    /**
     * compute.hosts.aggregatedList
     *
     * @desc Retrieves an aggregated list of hosts.
     *
     * @alias compute.hosts.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/hosts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.delete
     *
     * @desc Deletes the specified Host resource.
     *
     * @alias compute.hosts.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.host Name of the Host resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts/{host}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'host'],
        pathParams: ['host', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.get
     *
     * @desc Returns the specified host. Get a list of available hosts by making a list() request.
     *
     * @alias compute.hosts.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.host Name of the host to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts/{host}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'host'],
        pathParams: ['host', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias compute.hosts.getIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.insert
     *
     * @desc Creates a host resource in the specified project using the data included in the request.
     *
     * @alias compute.hosts.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Host} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.list
     *
     * @desc Retrieves a list of hosts available to the specified project.
     *
     * @alias compute.hosts.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias compute.hosts.setIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.hosts.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.hosts.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/hosts/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.httpHealthChecks = {

    /**
     * compute.httpHealthChecks.delete
     *
     * @desc Deletes the specified HttpHealthCheck resource.
     *
     * @alias compute.httpHealthChecks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpHealthCheck Name of the HttpHealthCheck resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks/{httpHealthCheck}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'httpHealthCheck'],
        pathParams: ['httpHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.get
     *
     * @desc Returns the specified HttpHealthCheck resource. Get a list of available HTTP health checks by making a list() request.
     *
     * @alias compute.httpHealthChecks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpHealthCheck Name of the HttpHealthCheck resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks/{httpHealthCheck}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'httpHealthCheck'],
        pathParams: ['httpHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.insert
     *
     * @desc Creates a HttpHealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.httpHealthChecks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.list
     *
     * @desc Retrieves the list of HttpHealthCheck resources available to the specified project.
     *
     * @alias compute.httpHealthChecks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.patch
     *
     * @desc Updates a HttpHealthCheck resource in the specified project using the data included in the request. This method supports patch semantics.
     *
     * @alias compute.httpHealthChecks.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpHealthCheck Name of the HttpHealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks/{httpHealthCheck}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'httpHealthCheck'],
        pathParams: ['httpHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.httpHealthChecks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpHealthChecks.update
     *
     * @desc Updates a HttpHealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.httpHealthChecks.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpHealthCheck Name of the HttpHealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpHealthChecks/{httpHealthCheck}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'httpHealthCheck'],
        pathParams: ['httpHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.httpsHealthChecks = {

    /**
     * compute.httpsHealthChecks.delete
     *
     * @desc Deletes the specified HttpsHealthCheck resource.
     *
     * @alias compute.httpsHealthChecks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpsHealthCheck Name of the HttpsHealthCheck resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks/{httpsHealthCheck}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'httpsHealthCheck'],
        pathParams: ['httpsHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.get
     *
     * @desc Returns the specified HttpsHealthCheck resource. Get a list of available HTTPS health checks by making a list() request.
     *
     * @alias compute.httpsHealthChecks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpsHealthCheck Name of the HttpsHealthCheck resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks/{httpsHealthCheck}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'httpsHealthCheck'],
        pathParams: ['httpsHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.insert
     *
     * @desc Creates a HttpsHealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.httpsHealthChecks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpsHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.list
     *
     * @desc Retrieves the list of HttpsHealthCheck resources available to the specified project.
     *
     * @alias compute.httpsHealthChecks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.patch
     *
     * @desc Updates a HttpsHealthCheck resource in the specified project using the data included in the request. This method supports patch semantics.
     *
     * @alias compute.httpsHealthChecks.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpsHealthCheck Name of the HttpsHealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpsHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks/{httpsHealthCheck}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'httpsHealthCheck'],
        pathParams: ['httpsHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.httpsHealthChecks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.httpsHealthChecks.update
     *
     * @desc Updates a HttpsHealthCheck resource in the specified project using the data included in the request.
     *
     * @alias compute.httpsHealthChecks.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.httpsHealthCheck Name of the HttpsHealthCheck resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).HttpsHealthCheck} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/httpsHealthChecks/{httpsHealthCheck}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'httpsHealthCheck'],
        pathParams: ['httpsHealthCheck', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.images = {

    /**
     * compute.images.delete
     *
     * @desc Deletes the specified image.
     *
     * @alias compute.images.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.image Name of the image resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/{image}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'image'],
        pathParams: ['image', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.deprecate
     *
     * @desc Sets the deprecation status of an image.  If an empty request body is given, clears the deprecation status instead.
     *
     * @alias compute.images.deprecate
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.image Image name.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).DeprecationStatus} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deprecate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/{image}/deprecate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'image'],
        pathParams: ['image', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.get
     *
     * @desc Returns the specified image. Get a list of available images by making a list() request.
     *
     * @alias compute.images.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.image Name of the image resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/{image}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'image'],
        pathParams: ['image', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.getFromFamily
     *
     * @desc Returns the latest image that is part of an image family and is not deprecated.
     *
     * @alias compute.images.getFromFamily
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.family Name of the image family to search for.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getFromFamily: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/family/{family}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'family'],
        pathParams: ['family', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.insert
     *
     * @desc Creates an image in the specified project using the data included in the request.
     *
     * @alias compute.images.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Image} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.list
     *
     * @desc Retrieves the list of private images available to the specified project. Private images are images you create that belong to your project. This method does not get any images that belong to other projects, including publicly-available images, like Debian 8. If you want to get a list of publicly-available images, use this method to make a request to the respective image project, such as debian-cloud or windows-cloud.
     *
     * @alias compute.images.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.setLabels
     *
     * @desc Sets the labels on an image. To learn more about labels, read the Labeling or Tagging Resources documentation.
     *
     * @alias compute.images.setLabels
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).GlobalSetLabelsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setLabels: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/{resource}/setLabels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.images.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.images.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/images/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.instanceGroupManagers = {

    /**
     * compute.instanceGroupManagers.abandonInstances
     *
     * @desc Schedules a group action to remove the specified instances from the managed instance group. Abandoning an instance does not delete the instance, but it does remove the instance from any target pools that are applied by the managed instance group. This method reduces the targetSize of the managed instance group by the number of instances that you abandon. This operation is marked as DONE when the action is scheduled even if the instances have not yet been removed from the group. You must separately verify the status of the abandoning action with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.abandonInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersAbandonInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    abandonInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/abandonInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.aggregatedList
     *
     * @desc Retrieves the list of managed instance groups and groups them by zone.
     *
     * @alias compute.instanceGroupManagers.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/instanceGroupManagers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.delete
     *
     * @desc Deletes the specified managed instance group and all of the instances in that group. Note that the instance group must not belong to a backend service. Read  Deleting an instance group for more information.
     *
     * @alias compute.instanceGroupManagers.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.deleteInstances
     *
     * @desc Schedules a group action to delete the specified instances in the managed instance group. The instances are also removed from any target pools of which they were a member. This method reduces the targetSize of the managed instance group by the number of instances that you delete. This operation is marked as DONE when the action is scheduled even if the instances are still being deleted. You must separately verify the status of the deleting action with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.deleteInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersDeleteInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/deleteInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.get
     *
     * @desc Returns all of the details about the specified managed instance group. Get a list of available managed instance groups by making a list() request.
     *
     * @alias compute.instanceGroupManagers.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.insert
     *
     * @desc Creates a managed instance group using the information that you specify in the request. After the group is created, it schedules an action to create instances in the group using the specified instance template. This operation is marked as DONE when the group is created even if the instances in the group have not yet been created. You must separately verify the status of the individual instances with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where you want to create the managed instance group.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.list
     *
     * @desc Retrieves a list of managed instance groups that are contained within the specified project and zone.
     *
     * @alias compute.instanceGroupManagers.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.listManagedInstances
     *
     * @desc Lists all of the instances in the managed instance group. Each instance in the list has a currentAction, which indicates the action that the managed instance group is performing on the instance. For example, if the group is still creating an instance, the currentAction is CREATING. If a previous action failed, the list displays the errors for that failed action.
     *
     * @alias compute.instanceGroupManagers.listManagedInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter 
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {integer=} params.maxResults 
     * @param {string=} params.order_by 
     * @param {string=} params.pageToken 
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listManagedInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/listManagedInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.patch
     *
     * @desc Updates a managed instance group using the information that you specify in the request. This operation is marked as DONE when the group is updated even if the instances in the group have not yet been updated. You must separately verify the status of the individual instances with the listmanagedinstances method. This method supports patch semantics.
     *
     * @alias compute.instanceGroupManagers.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where you want to create the managed instance group.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.recreateInstances
     *
     * @desc Schedules a group action to recreate the specified instances in the managed instance group. The instances are deleted and recreated using the current instance template for the managed instance group. This operation is marked as DONE when the action is scheduled even if the instances have not yet been recreated. You must separately verify the status of the recreating action with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.recreateInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersRecreateInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    recreateInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/recreateInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.resize
     *
     * @desc Resizes the managed instance group. If you increase the size, the group creates new instances using the current instance template. If you decrease the size, the group deletes instances. The resize operation is marked DONE when the resize actions are scheduled even if the group has not yet added or deleted any instances. You must separately verify the status of the creating or deleting actions with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.resize
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {integer} params.size The number of running instances that the managed instance group should maintain at any given time. The group automatically adds or removes instances to maintain the number of instances specified by this parameter.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager', 'size'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.resizeAdvanced
     *
     * @desc Resizes the managed instance group with advanced configuration options like disabling creation retries. This is an extended version of the resize method.  If you increase the size of the instance group, the group creates new instances using the current instance template. If you decrease the size, the group deletes instances. The resize operation is marked DONE when the resize actions are scheduled even if the group has not yet added or deleted any instances. You must separately verify the status of the creating, creatingWithoutRetries, or deleting actions with the get or listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.resizeAdvanced
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersResizeAdvancedRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resizeAdvanced: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/resizeAdvanced',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.setAutoHealingPolicies
     *
     * @desc Modifies the autohealing policies.
     *
     * @alias compute.instanceGroupManagers.setAutoHealingPolicies
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersSetAutoHealingRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setAutoHealingPolicies: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setAutoHealingPolicies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.setInstanceTemplate
     *
     * @desc Specifies the instance template to use when creating new instances in this group. The templates for existing instances in the group do not change unless you recreate them.
     *
     * @alias compute.instanceGroupManagers.setInstanceTemplate
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersSetInstanceTemplateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setInstanceTemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setInstanceTemplate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.setTargetPools
     *
     * @desc Modifies the target pools to which all instances in this managed instance group are assigned. The target pools automatically apply to all of the instances in the managed instance group. This operation is marked DONE when you make the request even if the instances have not yet been added to their target pools. The change might take some time to apply to all of the instances in the group depending on the size of the group.
     *
     * @alias compute.instanceGroupManagers.setTargetPools
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the managed instance group is located.
     * @param {compute(alpha).InstanceGroupManagersSetTargetPoolsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTargetPools: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setTargetPools',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.instanceGroupManagers.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroupManagers.update
     *
     * @desc Updates a managed instance group using the information that you specify in the request. This operation is marked as DONE when the group is updated even if the instances in the group have not yet been updated. You must separately verify the status of the individual instances with the listmanagedinstances method.
     *
     * @alias compute.instanceGroupManagers.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where you want to create the managed instance group.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.instanceGroups = {

    /**
     * compute.instanceGroups.addInstances
     *
     * @desc Adds a list of instances to the specified instance group. All of the instances in the instance group must be in the same network/subnetwork. Read  Adding instances for more information.
     *
     * @alias compute.instanceGroups.addInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the instance group where you are adding instances.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {compute(alpha).InstanceGroupsAddInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}/addInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.aggregatedList
     *
     * @desc Retrieves the list of instance groups and sorts them by zone.
     *
     * @alias compute.instanceGroups.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/instanceGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.delete
     *
     * @desc Deletes the specified instance group. The instances in the group are not deleted. Note that instance group must not belong to a backend service. Read  Deleting an instance group for more information.
     *
     * @alias compute.instanceGroups.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the instance group to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.get
     *
     * @desc Returns the specified instance group. Get a list of available instance groups by making a list() request.
     *
     * @alias compute.instanceGroups.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.insert
     *
     * @desc Creates an instance group in the specified project using the parameters that are included in the request.
     *
     * @alias compute.instanceGroups.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where you want to create the instance group.
     * @param {compute(alpha).InstanceGroup} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.list
     *
     * @desc Retrieves the list of instance groups that are located in the specified project and zone.
     *
     * @alias compute.instanceGroups.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.listInstances
     *
     * @desc Lists the instances in the specified instance group.
     *
     * @alias compute.instanceGroups.listInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {string} params.instanceGroup The name of the instance group from which you want to generate a list of included instances.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {compute(alpha).InstanceGroupsListInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}/listInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.removeInstances
     *
     * @desc Removes one or more instances from the specified instance group, but does not delete those instances.
     *
     * @alias compute.instanceGroups.removeInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the instance group where the specified instances will be removed.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {compute(alpha).InstanceGroupsRemoveInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}/removeInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.setNamedPorts
     *
     * @desc Sets the named ports for the specified instance group.
     *
     * @alias compute.instanceGroups.setNamedPorts
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the instance group where the named ports are updated.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone where the instance group is located.
     * @param {compute(alpha).InstanceGroupsSetNamedPortsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setNamedPorts: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{instanceGroup}/setNamedPorts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceGroups.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.instanceGroups.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instanceGroups/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.instanceTemplates = {

    /**
     * compute.instanceTemplates.delete
     *
     * @desc Deletes the specified instance template. If you delete an instance template that is being referenced from another instance group, the instance group will not be able to create or recreate virtual machine instances. Deleting an instance template is permanent and cannot be undone.
     *
     * @alias compute.instanceTemplates.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceTemplate The name of the instance template to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/instanceTemplates/{instanceTemplate}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instanceTemplate'],
        pathParams: ['instanceTemplate', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceTemplates.get
     *
     * @desc Returns the specified instance template. Get a list of available instance templates by making a list() request.
     *
     * @alias compute.instanceTemplates.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceTemplate The name of the instance template.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/instanceTemplates/{instanceTemplate}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instanceTemplate'],
        pathParams: ['instanceTemplate', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceTemplates.insert
     *
     * @desc Creates an instance template in the specified project using the data that is included in the request. If you are creating a new template to update an existing instance group, your new instance template must use the same network or, if applicable, the same subnetwork as the original template.
     *
     * @alias compute.instanceTemplates.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).InstanceTemplate} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/instanceTemplates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceTemplates.list
     *
     * @desc Retrieves a list of instance templates that are contained within the specified project and zone.
     *
     * @alias compute.instanceTemplates.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/instanceTemplates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instanceTemplates.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.instanceTemplates.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/instanceTemplates/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.instances = {

    /**
     * compute.instances.addAccessConfig
     *
     * @desc Adds an access config to an instance's network interface.
     *
     * @alias compute.instances.addAccessConfig
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance The instance name for this request.
     * @param {string} params.networkInterface The name of the network interface to add to this instance.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).AccessConfig} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addAccessConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/addAccessConfig',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance', 'networkInterface'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.aggregatedList
     *
     * @desc Retrieves aggregated list of instances.
     *
     * @alias compute.instances.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/instances',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.attachDisk
     *
     * @desc Attaches a Disk resource to an instance.
     *
     * @alias compute.instances.attachDisk
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.forceAttach Whether to force attach the disk even if it's currently attached to another instance. This is only available for regional disks.
     * @param {string} params.instance The instance name for this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).AttachedDisk} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    attachDisk: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/attachDisk',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.delete
     *
     * @desc Deletes the specified Instance resource. For more information, see Stopping or Deleting an Instance.
     *
     * @alias compute.instances.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.deleteAccessConfig
     *
     * @desc Deletes an access config from an instance's network interface.
     *
     * @alias compute.instances.deleteAccessConfig
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accessConfig The name of the access config to delete.
     * @param {string} params.instance The instance name for this request.
     * @param {string} params.networkInterface The name of the network interface.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteAccessConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/deleteAccessConfig',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance', 'accessConfig', 'networkInterface'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.detachDisk
     *
     * @desc Detaches a disk from an instance.
     *
     * @alias compute.instances.detachDisk
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceName Disk device name to detach.
     * @param {string} params.instance Instance name.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    detachDisk: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/detachDisk',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance', 'deviceName'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.get
     *
     * @desc Returns the specified Instance resource. Get a list of available instances by making a list() request.
     *
     * @alias compute.instances.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias compute.instances.getIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.getSerialPortOutput
     *
     * @desc Returns the specified instance's serial port output.
     *
     * @alias compute.instances.getSerialPortOutput
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {integer=} params.port Specifies which COM or serial port to retrieve data from.
     * @param {string} params.project Project ID for this request.
     * @param {string=} params.start For the initial request, leave this field unspecified. For subsequent calls, this field should be set to the next value that was returned in the previous call.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getSerialPortOutput: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/serialPort',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.insert
     *
     * @desc Creates an instance resource in the specified project using the data included in the request.
     *
     * @alias compute.instances.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Instance} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.list
     *
     * @desc Retrieves the list of instances contained within the specified zone.
     *
     * @alias compute.instances.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.reset
     *
     * @desc Performs a hard reset on the instance.
     *
     * @alias compute.instances.reset
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/reset',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setDiskAutoDelete
     *
     * @desc Sets the auto-delete flag for a disk attached to an instance.
     *
     * @alias compute.instances.setDiskAutoDelete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {boolean} params.autoDelete Whether to auto-delete the disk when the instance is deleted.
     * @param {string} params.deviceName The device name of the disk to modify.
     * @param {string} params.instance The instance name.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setDiskAutoDelete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setDiskAutoDelete',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance', 'autoDelete', 'deviceName'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias compute.instances.setIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setLabels
     *
     * @desc Sets labels on an instance. To learn more about labels, read the Labeling or Tagging Resources documentation.
     *
     * @alias compute.instances.setLabels
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).InstancesSetLabelsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setLabels: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setLabels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setMachineType
     *
     * @desc Changes the machine type for a stopped instance to the machine type specified in the request.
     *
     * @alias compute.instances.setMachineType
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).InstancesSetMachineTypeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setMachineType: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setMachineType',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setMetadata
     *
     * @desc Sets metadata for the specified instance to the data included in the request.
     *
     * @alias compute.instances.setMetadata
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Metadata} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setMetadata: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setMetadata',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setScheduling
     *
     * @desc Sets an instance's scheduling options.
     *
     * @alias compute.instances.setScheduling
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Instance name.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Scheduling} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setScheduling: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setScheduling',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setServiceAccount
     *
     * @desc Sets the service account on the instance.
     *
     * @alias compute.instances.setServiceAccount
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance resource to start.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).InstancesSetServiceAccountRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setServiceAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setServiceAccount',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.setTags
     *
     * @desc Sets tags for the specified instance to the data included in the request.
     *
     * @alias compute.instances.setTags
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance scoping this request.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).Tags} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTags: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/setTags',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.start
     *
     * @desc Starts an instance that was stopped using the using the instances().stop method. For more information, see Restart an instance.
     *
     * @alias compute.instances.start
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance resource to start.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    start: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/start',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.startWithEncryptionKey
     *
     * @desc Starts an instance that was stopped using the using the instances().stop method. For more information, see Restart an instance.
     *
     * @alias compute.instances.startWithEncryptionKey
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Name of the instance resource to start.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).InstancesStartWithEncryptionKeyRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    startWithEncryptionKey: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/startWithEncryptionKey',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.stop
     *
     * @desc Stops a running instance, shutting it down cleanly, and allows you to restart the instance at a later time. Stopped instances do not incur per-minute, virtual machine usage charges while they are stopped, but any resources that the virtual machine is using, such as persistent disks and static IP addresses, will continue to be charged until they are deleted. For more information, see Stopping an instance.
     *
     * @alias compute.instances.stop
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.discardLocalSsd If true, discard the contents of any attached localSSD partitions. Default value is false.
     * @param {string} params.instance Name of the instance resource to stop.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/stop',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.suspend
     *
     * @desc This method suspends a running instance, saving its state to persistent storage, and allows you to resume the instance at a later time. Suspended instances incur reduced per-minute, virtual machine usage charges while they are suspended. Any resources the virtual machine is using, such as persistent disks and static IP addresses, will continue to be charged until they are deleted.
     *
     * @alias compute.instances.suspend
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.discardLocalSsd If true, discard the contents of any attached localSSD partitions. Default value is false.
     * @param {string} params.instance Name of the instance resource to suspend.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    suspend: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/suspend',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.instances.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.instances.updateAccessConfig
     *
     * @desc Updates the specified access config from an instance's network interface with the data included in the request.
     *
     * @alias compute.instances.updateAccessConfig
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance The instance name for this request.
     * @param {string} params.networkInterface The name of the network interface where the access config is attached.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).AccessConfig} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateAccessConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/instances/{instance}/updateAccessConfig',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance', 'networkInterface'],
        pathParams: ['instance', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.licenses = {

    /**
     * compute.licenses.get
     *
     * @desc Returns the specified License resource. Get a list of available licenses by making a list() request.
     *
     * @alias compute.licenses.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.license Name of the License resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/licenses/{license}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'license'],
        pathParams: ['license', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.machineTypes = {

    /**
     * compute.machineTypes.aggregatedList
     *
     * @desc Retrieves an aggregated list of machine types.
     *
     * @alias compute.machineTypes.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/machineTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.machineTypes.get
     *
     * @desc Returns the specified machine type. Get a list of available machine types by making a list() request.
     *
     * @alias compute.machineTypes.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.machineType Name of the machine type to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/machineTypes/{machineType}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'machineType'],
        pathParams: ['machineType', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.machineTypes.list
     *
     * @desc Retrieves a list of machine types available to the specified project.
     *
     * @alias compute.machineTypes.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone The name of the zone for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/machineTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.networks = {

    /**
     * compute.networks.addPeering
     *
     * @desc Adds a peering to the specified network.
     *
     * @alias compute.networks.addPeering
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.network Name of the network resource to add peering to.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).NetworksAddPeeringRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addPeering: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{network}/addPeering',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'network'],
        pathParams: ['network', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.delete
     *
     * @desc Deletes the specified network.
     *
     * @alias compute.networks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.network Name of the network to delete.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{network}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'network'],
        pathParams: ['network', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.get
     *
     * @desc Returns the specified network. Get a list of available networks by making a list() request.
     *
     * @alias compute.networks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.network Name of the network to return.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{network}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'network'],
        pathParams: ['network', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.insert
     *
     * @desc Creates a network in the specified project using the data included in the request.
     *
     * @alias compute.networks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Network} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.list
     *
     * @desc Retrieves the list of networks available to the specified project.
     *
     * @alias compute.networks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.removePeering
     *
     * @desc Removes a peering from the specified network.
     *
     * @alias compute.networks.removePeering
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.network Name of the network resource to remove peering from.
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).NetworksRemovePeeringRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removePeering: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{network}/removePeering',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'network'],
        pathParams: ['network', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.switchToCustomMode
     *
     * @desc Switches the network mode from auto subnet mode to custom subnet mode.
     *
     * @alias compute.networks.switchToCustomMode
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.network Name of the network to be updated.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    switchToCustomMode: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{network}/switchToCustomMode',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'network'],
        pathParams: ['network', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.networks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.networks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/networks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.projects = {

    /**
     * compute.projects.disableXpnHost
     *
     * @desc Disable this project as an XPN host project.
     *
     * @alias compute.projects.disableXpnHost
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    disableXpnHost: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/disableXpnHost',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.disableXpnResource
     *
     * @desc Disable an XPN resource associated with this host project.
     *
     * @alias compute.projects.disableXpnResource
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).ProjectsDisableXpnResourceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    disableXpnResource: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/disableXpnResource',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.enableXpnHost
     *
     * @desc Enable this project as an XPN host project.
     *
     * @alias compute.projects.enableXpnHost
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    enableXpnHost: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/enableXpnHost',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.enableXpnResource
     *
     * @desc Enable XPN resource (a.k.a service project or service folder in the future) for a host project, so that subnetworks in the host project can be used by instances in the service project or folder.
     *
     * @alias compute.projects.enableXpnResource
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).ProjectsEnableXpnResourceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    enableXpnResource: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/enableXpnResource',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.get
     *
     * @desc Returns the specified Project resource.
     *
     * @alias compute.projects.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.getXpnHost
     *
     * @desc Get the XPN host project that this project links to. May be empty if no link exists.
     *
     * @alias compute.projects.getXpnHost
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getXpnHost: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/getXpnHost',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.getXpnResources
     *
     * @desc Get XPN resources associated with this host project.
     *
     * @alias compute.projects.getXpnResources
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getXpnResources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/getXpnResources',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.listXpnHosts
     *
     * @desc List all XPN host projects visible to the user in an organization.
     *
     * @alias compute.projects.listXpnHosts
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).ProjectsListXpnHostsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listXpnHosts: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/listXpnHosts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.moveDisk
     *
     * @desc Moves a persistent disk from one zone to another.
     *
     * @alias compute.projects.moveDisk
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).DiskMoveRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    moveDisk: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/moveDisk',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.moveInstance
     *
     * @desc Moves an instance and its attached persistent disks from one zone to another.
     *
     * @alias compute.projects.moveInstance
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).InstanceMoveRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    moveInstance: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/moveInstance',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.setCommonInstanceMetadata
     *
     * @desc Sets metadata common to all instances within the specified project using the data included in the request.
     *
     * @alias compute.projects.setCommonInstanceMetadata
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Metadata} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setCommonInstanceMetadata: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/setCommonInstanceMetadata',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.setDefaultServiceAccount
     *
     * @desc Sets the default service account of the project. The default service account is used when a VM instance is created with the service account email address set to "default".
     *
     * @alias compute.projects.setDefaultServiceAccount
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).ProjectsSetDefaultServiceAccountRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setDefaultServiceAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/setDefaultServiceAccount',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.projects.setUsageExportBucket
     *
     * @desc Enables the usage export feature and sets the usage export bucket where reports are stored. If you provide an empty request body using this method, the usage export feature will be disabled.
     *
     * @alias compute.projects.setUsageExportBucket
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).UsageExportLocation} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setUsageExportBucket: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/setUsageExportBucket',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionAutoscalers = {

    /**
     * compute.regionAutoscalers.delete
     *
     * @desc Deletes the specified autoscaler.
     *
     * @alias compute.regionAutoscalers.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers/{autoscaler}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'autoscaler'],
        pathParams: ['autoscaler', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.get
     *
     * @desc Returns the specified autoscaler.
     *
     * @alias compute.regionAutoscalers.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers/{autoscaler}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'autoscaler'],
        pathParams: ['autoscaler', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.insert
     *
     * @desc Creates an autoscaler in the specified project using the data included in the request.
     *
     * @alias compute.regionAutoscalers.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.list
     *
     * @desc Retrieves a list of autoscalers contained within the specified region.
     *
     * @alias compute.regionAutoscalers.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.patch
     *
     * @desc Updates an autoscaler in the specified project using the data included in the request. This method supports patch semantics.
     *
     * @alias compute.regionAutoscalers.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.autoscaler Name of the autoscaler to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'autoscaler'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.regionAutoscalers.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionAutoscalers.update
     *
     * @desc Updates an autoscaler in the specified project using the data included in the request.
     *
     * @alias compute.regionAutoscalers.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.autoscaler Name of the autoscaler to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).Autoscaler} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/autoscalers',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionBackendServices = {

    /**
     * compute.regionBackendServices.delete
     *
     * @desc Deletes the specified regional BackendService resource.
     *
     * @alias compute.regionBackendServices.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{backendService}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'backendService'],
        pathParams: ['backendService', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.get
     *
     * @desc Returns the specified regional BackendService resource.
     *
     * @alias compute.regionBackendServices.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{backendService}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'backendService'],
        pathParams: ['backendService', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.getHealth
     *
     * @desc Gets the most recent health check results for this regional BackendService.
     *
     * @alias compute.regionBackendServices.getHealth
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to which the queried instance belongs.
     * @param {string} params.project 
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).ResourceGroupReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getHealth: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{backendService}/getHealth',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'backendService'],
        pathParams: ['backendService', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.insert
     *
     * @desc Creates a regional BackendService resource in the specified project using the data included in the request. There are several restrictions and guidelines to keep in mind when creating a regional backend service. Read  Restrictions and Guidelines for more information.
     *
     * @alias compute.regionBackendServices.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.list
     *
     * @desc Retrieves the list of regional BackendService resources available to the specified project in the given region.
     *
     * @alias compute.regionBackendServices.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.patch
     *
     * @desc Updates the specified regional BackendService resource with the data included in the request. There are several restrictions and guidelines to keep in mind when updating a backend service. Read  Restrictions and Guidelines for more information. This method supports patch semantics.
     *
     * @alias compute.regionBackendServices.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{backendService}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'backendService'],
        pathParams: ['backendService', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.regionBackendServices.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionBackendServices.update
     *
     * @desc Updates the specified regional BackendService resource with the data included in the request. There are several restrictions and guidelines to keep in mind when updating a backend service. Read  Restrictions and Guidelines for more information.
     *
     * @alias compute.regionBackendServices.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backendService Name of the BackendService resource to update.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).BackendService} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/backendServices/{backendService}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'backendService'],
        pathParams: ['backendService', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionDiskTypes = {

    /**
     * compute.regionDiskTypes.get
     *
     * @desc Returns the specified regional disk type. Get a list of available disk types by making a list() request.
     *
     * @alias compute.regionDiskTypes.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.diskType Name of the disk type to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/diskTypes/{diskType}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'diskType'],
        pathParams: ['diskType', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDiskTypes.list
     *
     * @desc Retrieves a list of regional disk types available to the specified project.
     *
     * @alias compute.regionDiskTypes.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/diskTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionDisks = {

    /**
     * compute.regionDisks.createSnapshot
     *
     * @desc Creates a snapshot of this regional disk.
     *
     * @alias compute.regionDisks.createSnapshot
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the regional persistent disk to snapshot.
     * @param {boolean=} params.guestFlush 
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).Snapshot} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createSnapshot: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{disk}/createSnapshot',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'disk'],
        pathParams: ['disk', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.delete
     *
     * @desc Deletes the specified regional persistent disk. Deleting a regional disk removes all the replicas of its data permanently and is irreversible. However, deleting a disk does not delete any snapshots previously made from the disk. You must separately delete snapshots.
     *
     * @alias compute.regionDisks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the regional persistent disk to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{disk}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'disk'],
        pathParams: ['disk', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.get
     *
     * @desc Returns a specified regional persistent disk.
     *
     * @alias compute.regionDisks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the regional persistent disk to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{disk}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'disk'],
        pathParams: ['disk', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.insert
     *
     * @desc Creates a persistent regional disk in the specified project using the data included in the request.
     *
     * @alias compute.regionDisks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string=} params.sourceImage Optional. Source image to restore onto a disk.
     * @param {compute(alpha).Disk} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.list
     *
     * @desc Retrieves the list of persistent disks contained within the specified region.
     *
     * @alias compute.regionDisks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.resize
     *
     * @desc Resizes the specified regional persistent disk.
     *
     * @alias compute.regionDisks.resize
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.disk Name of the regional persistent disk.
     * @param {string} params.project The project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).RegionDisksResizeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{disk}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'disk'],
        pathParams: ['disk', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.setLabels
     *
     * @desc Sets the labels on the target regional disk.
     *
     * @alias compute.regionDisks.setLabels
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).RegionSetLabelsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setLabels: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{resource}/setLabels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionDisks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.regionDisks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/disks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionInstanceGroupManagers = {

    /**
     * compute.regionInstanceGroupManagers.abandonInstances
     *
     * @desc Schedules a group action to remove the specified instances from the managed instance group. Abandoning an instance does not delete the instance, but it does remove the instance from any target pools that are applied by the managed instance group. This method reduces the targetSize of the managed instance group by the number of instances that you abandon. This operation is marked as DONE when the action is scheduled even if the instances have not yet been removed from the group. You must separately verify the status of the abandoning action with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.abandonInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersAbandonInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    abandonInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/abandonInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.delete
     *
     * @desc Deletes the specified managed instance group and all of the instances in that group.
     *
     * @alias compute.regionInstanceGroupManagers.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.deleteInstances
     *
     * @desc Schedules a group action to delete the specified instances in the managed instance group. The instances are also removed from any target pools of which they were a member. This method reduces the targetSize of the managed instance group by the number of instances that you delete. This operation is marked as DONE when the action is scheduled even if the instances are still being deleted. You must separately verify the status of the deleting action with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.deleteInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersDeleteInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/deleteInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.get
     *
     * @desc Returns all of the details about the specified managed instance group.
     *
     * @alias compute.regionInstanceGroupManagers.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.insert
     *
     * @desc Creates a managed instance group using the information that you specify in the request. After the group is created, it schedules an action to create instances in the group using the specified instance template. This operation is marked as DONE when the group is created even if the instances in the group have not yet been created. You must separately verify the status of the individual instances with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.list
     *
     * @desc Retrieves the list of managed instance groups that are contained within the specified region.
     *
     * @alias compute.regionInstanceGroupManagers.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.listManagedInstances
     *
     * @desc Lists the instances in the managed instance group and instances that are scheduled to be created. The list includes any current actions that the group has scheduled for its instances.
     *
     * @alias compute.regionInstanceGroupManagers.listManagedInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter 
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {integer=} params.maxResults 
     * @param {string=} params.order_by 
     * @param {string=} params.pageToken 
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listManagedInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/listManagedInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.patch
     *
     * @desc Updates a managed instance group using the information that you specify in the request. This operation is marked as DONE when the group is updated even if the instances in the group have not yet been updated. You must separately verify the status of the individual instances with the listmanagedinstances method. This method supports patch semantics.
     *
     * @alias compute.regionInstanceGroupManagers.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.recreateInstances
     *
     * @desc Schedules a group action to recreate the specified instances in the managed instance group. The instances are deleted and recreated using the current instance template for the managed instance group. This operation is marked as DONE when the action is scheduled even if the instances have not yet been recreated. You must separately verify the status of the recreating action with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.recreateInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersRecreateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    recreateInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/recreateInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.resize
     *
     * @desc Changes the intended size for the managed instance group. If you increase the size, the group schedules actions to create new instances using the current instance template. If you decrease the size, the group schedules delete actions on one or more instances. The resize operation is marked DONE when the resize actions are scheduled even if the group has not yet added or deleted any instances. You must separately verify the status of the creating or deleting actions with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.resize
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {integer} params.size Number of instances that should exist in this instance group manager.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager', 'size'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.setAutoHealingPolicies
     *
     * @desc Modifies the autohealing policy for the instances in this managed instance group.
     *
     * @alias compute.regionInstanceGroupManagers.setAutoHealingPolicies
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersSetAutoHealingRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setAutoHealingPolicies: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/setAutoHealingPolicies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.setInstanceTemplate
     *
     * @desc Sets the instance template to use when creating new instances or recreating instances in this group. Existing instances are not affected.
     *
     * @alias compute.regionInstanceGroupManagers.setInstanceTemplate
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersSetTemplateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setInstanceTemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/setInstanceTemplate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.setTargetPools
     *
     * @desc Modifies the target pools to which all new instances in this group are assigned. Existing instances in the group are not affected.
     *
     * @alias compute.regionInstanceGroupManagers.setTargetPools
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the managed instance group.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupManagersSetTargetPoolsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTargetPools: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}/setTargetPools',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.regionInstanceGroupManagers.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroupManagers.update
     *
     * @desc Updates a managed instance group using the information that you specify in the request. This operation is marked as DONE when the group is updated even if the instances in the group have not yet been updated. You must separately verify the status of the individual instances with the listmanagedinstances method.
     *
     * @alias compute.regionInstanceGroupManagers.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).InstanceGroupManager} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroupManagers/{instanceGroupManager}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionInstanceGroups = {

    /**
     * compute.regionInstanceGroups.get
     *
     * @desc Returns the specified instance group resource.
     *
     * @alias compute.regionInstanceGroups.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup Name of the instance group resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroups/{instanceGroup}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroups.list
     *
     * @desc Retrieves the list of instance group resources contained within the specified region.
     *
     * @alias compute.regionInstanceGroups.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroups.listInstances
     *
     * @desc Lists the instances in the specified instance group and displays information about the named ports. Depending on the specified options, this method can list all instances or only the instances that are running.
     *
     * @alias compute.regionInstanceGroups.listInstances
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {string} params.instanceGroup Name of the regional instance group for which we want to list the instances.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupsListInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroups/{instanceGroup}/listInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroups.setNamedPorts
     *
     * @desc Sets the named ports for the specified regional instance group.
     *
     * @alias compute.regionInstanceGroups.setNamedPorts
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroup The name of the regional instance group where the named ports are updated.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).RegionInstanceGroupsSetNamedPortsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setNamedPorts: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroups/{instanceGroup}/setNamedPorts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'instanceGroup'],
        pathParams: ['instanceGroup', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionInstanceGroups.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.regionInstanceGroups.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/instanceGroups/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regionOperations = {

    /**
     * compute.regionOperations.delete
     *
     * @desc Deletes the specified region-specific Operations resource.
     *
     * @alias compute.regionOperations.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/operations/{operation}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'operation'],
        pathParams: ['operation', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionOperations.get
     *
     * @desc Retrieves the specified region-specific Operations resource.
     *
     * @alias compute.regionOperations.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'operation'],
        pathParams: ['operation', 'project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regionOperations.list
     *
     * @desc Retrieves a list of Operation resources contained within the specified region.
     *
     * @alias compute.regionOperations.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regions = {

    /**
     * compute.regions.get
     *
     * @desc Returns the specified Region resource. Get a list of available regions by making a list() request.
     *
     * @alias compute.regions.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.regions.list
     *
     * @desc Retrieves the list of region resources available to the specified project.
     *
     * @alias compute.regions.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.routers = {

    /**
     * compute.routers.aggregatedList
     *
     * @desc Retrieves an aggregated list of routers.
     *
     * @alias compute.routers.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/routers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.delete
     *
     * @desc Deletes the specified Router resource.
     *
     * @alias compute.routers.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.get
     *
     * @desc Returns the specified Router resource. Get a list of available routers by making a list() request.
     *
     * @alias compute.routers.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.getRouterStatus
     *
     * @desc Retrieves runtime information of the specified router.
     *
     * @alias compute.routers.getRouterStatus
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to query.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getRouterStatus: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}/getRouterStatus',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.insert
     *
     * @desc Creates a Router resource in the specified project and region using the data included in the request.
     *
     * @alias compute.routers.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).Router} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.list
     *
     * @desc Retrieves a list of Router resources available to the specified project.
     *
     * @alias compute.routers.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.patch
     *
     * @desc Updates the specified Router resource with the data included in the request. This method supports patch semantics.
     *
     * @alias compute.routers.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to update.
     * @param {compute(alpha).Router} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.preview
     *
     * @desc Preview fields auto-generated during router create and update operations. Calling this method does NOT create or update the router.
     *
     * @alias compute.routers.preview
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to query.
     * @param {compute(alpha).Router} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    preview: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}/preview',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.routers.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routers.update
     *
     * @desc Updates the specified Router resource with the data included in the request.
     *
     * @alias compute.routers.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.router Name of the Router resource to update.
     * @param {compute(alpha).Router} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/routers/{router}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'router'],
        pathParams: ['project', 'region', 'router'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.routes = {

    /**
     * compute.routes.delete
     *
     * @desc Deletes the specified Route resource.
     *
     * @alias compute.routes.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.route Name of the Route resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/routes/{route}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'route'],
        pathParams: ['project', 'route'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routes.get
     *
     * @desc Returns the specified Route resource. Get a list of available routes by making a list() request.
     *
     * @alias compute.routes.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.route Name of the Route resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/routes/{route}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'route'],
        pathParams: ['project', 'route'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routes.insert
     *
     * @desc Creates a Route resource in the specified project using the data included in the request.
     *
     * @alias compute.routes.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).Route} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/routes',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routes.list
     *
     * @desc Retrieves the list of Route resources available to the specified project.
     *
     * @alias compute.routes.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/routes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.routes.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.routes.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/routes/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.snapshots = {

    /**
     * compute.snapshots.delete
     *
     * @desc Deletes the specified Snapshot resource. Keep in mind that deleting a single snapshot might not necessarily delete all the data on that snapshot. If any data on the snapshot that is marked for deletion is needed for subsequent snapshots, the data will be moved to the next corresponding snapshot.  For more information, see Deleting snaphots.
     *
     * @alias compute.snapshots.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.snapshot Name of the Snapshot resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/snapshots/{snapshot}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'snapshot'],
        pathParams: ['project', 'snapshot'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.snapshots.get
     *
     * @desc Returns the specified Snapshot resource. Get a list of available snapshots by making a list() request.
     *
     * @alias compute.snapshots.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.snapshot Name of the Snapshot resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/snapshots/{snapshot}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'snapshot'],
        pathParams: ['project', 'snapshot'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.snapshots.list
     *
     * @desc Retrieves the list of Snapshot resources contained within the specified project.
     *
     * @alias compute.snapshots.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/snapshots',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.snapshots.setLabels
     *
     * @desc Sets the labels on a snapshot. To learn more about labels, read the Labeling or Tagging Resources documentation.
     *
     * @alias compute.snapshots.setLabels
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).GlobalSetLabelsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setLabels: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/snapshots/{resource}/setLabels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.snapshots.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.snapshots.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/snapshots/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sslCertificates = {

    /**
     * compute.sslCertificates.delete
     *
     * @desc Deletes the specified SslCertificate resource.
     *
     * @alias compute.sslCertificates.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.sslCertificate Name of the SslCertificate resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/sslCertificates/{sslCertificate}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'sslCertificate'],
        pathParams: ['project', 'sslCertificate'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.sslCertificates.get
     *
     * @desc Returns the specified SslCertificate resource. Get a list of available SSL certificates by making a list() request.
     *
     * @alias compute.sslCertificates.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.sslCertificate Name of the SslCertificate resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/sslCertificates/{sslCertificate}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'sslCertificate'],
        pathParams: ['project', 'sslCertificate'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.sslCertificates.insert
     *
     * @desc Creates a SslCertificate resource in the specified project using the data included in the request.
     *
     * @alias compute.sslCertificates.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).SslCertificate} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/sslCertificates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.sslCertificates.list
     *
     * @desc Retrieves the list of SslCertificate resources available to the specified project.
     *
     * @alias compute.sslCertificates.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/sslCertificates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.sslCertificates.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.sslCertificates.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/sslCertificates/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.subnetworks = {

    /**
     * compute.subnetworks.aggregatedList
     *
     * @desc Retrieves an aggregated list of subnetworks.
     *
     * @alias compute.subnetworks.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/subnetworks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.delete
     *
     * @desc Deletes the specified subnetwork.
     *
     * @alias compute.subnetworks.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.subnetwork Name of the Subnetwork resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{subnetwork}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'subnetwork'],
        pathParams: ['project', 'region', 'subnetwork'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.expandIpCidrRange
     *
     * @desc Expands the IP CIDR range of the subnetwork to a specified value.
     *
     * @alias compute.subnetworks.expandIpCidrRange
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.subnetwork Name of the Subnetwork resource to update.
     * @param {compute(alpha).SubnetworksExpandIpCidrRangeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    expandIpCidrRange: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{subnetwork}/expandIpCidrRange',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'subnetwork'],
        pathParams: ['project', 'region', 'subnetwork'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.get
     *
     * @desc Returns the specified subnetwork. Get a list of available subnetworks list() request.
     *
     * @alias compute.subnetworks.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.subnetwork Name of the Subnetwork resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{subnetwork}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'subnetwork'],
        pathParams: ['project', 'region', 'subnetwork'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias compute.subnetworks.getIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.insert
     *
     * @desc Creates a subnetwork in the specified project using the data included in the request.
     *
     * @alias compute.subnetworks.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).Subnetwork} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.list
     *
     * @desc Retrieves a list of subnetworks available to the specified project.
     *
     * @alias compute.subnetworks.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias compute.subnetworks.setIamPolicy
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.setPrivateIpGoogleAccess
     *
     * @desc Set whether VMs in this subnet can access Google services without assigning external IP addresses through Cloudpath.
     *
     * @alias compute.subnetworks.setPrivateIpGoogleAccess
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.subnetwork Name of the Subnetwork resource.
     * @param {compute(alpha).SubnetworksSetPrivateIpGoogleAccessRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setPrivateIpGoogleAccess: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{subnetwork}/setPrivateIpGoogleAccess',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'subnetwork'],
        pathParams: ['project', 'region', 'subnetwork'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.subnetworks.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.subnetworks.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/subnetworks/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetHttpProxies = {

    /**
     * compute.targetHttpProxies.delete
     *
     * @desc Deletes the specified TargetHttpProxy resource.
     *
     * @alias compute.targetHttpProxies.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpProxy Name of the TargetHttpProxy resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpProxies/{targetHttpProxy}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpProxy'],
        pathParams: ['project', 'targetHttpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpProxies.get
     *
     * @desc Returns the specified TargetHttpProxy resource. Get a list of available target HTTP proxies by making a list() request.
     *
     * @alias compute.targetHttpProxies.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpProxy Name of the TargetHttpProxy resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpProxies/{targetHttpProxy}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpProxy'],
        pathParams: ['project', 'targetHttpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpProxies.insert
     *
     * @desc Creates a TargetHttpProxy resource in the specified project using the data included in the request.
     *
     * @alias compute.targetHttpProxies.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).TargetHttpProxy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpProxies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpProxies.list
     *
     * @desc Retrieves the list of TargetHttpProxy resources available to the specified project.
     *
     * @alias compute.targetHttpProxies.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpProxies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpProxies.setUrlMap
     *
     * @desc Changes the URL map for TargetHttpProxy.
     *
     * @alias compute.targetHttpProxies.setUrlMap
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpProxy Name of the TargetHttpProxy to set a URL map for.
     * @param {compute(alpha).UrlMapReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setUrlMap: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/targetHttpProxies/{targetHttpProxy}/setUrlMap',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpProxy'],
        pathParams: ['project', 'targetHttpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpProxies.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetHttpProxies.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpProxies/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetHttpsProxies = {

    /**
     * compute.targetHttpsProxies.delete
     *
     * @desc Deletes the specified TargetHttpsProxy resource.
     *
     * @alias compute.targetHttpsProxies.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpsProxy Name of the TargetHttpsProxy resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpsProxies/{targetHttpsProxy}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpsProxy'],
        pathParams: ['project', 'targetHttpsProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.get
     *
     * @desc Returns the specified TargetHttpsProxy resource. Get a list of available target HTTPS proxies by making a list() request.
     *
     * @alias compute.targetHttpsProxies.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpsProxy Name of the TargetHttpsProxy resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpsProxies/{targetHttpsProxy}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpsProxy'],
        pathParams: ['project', 'targetHttpsProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.insert
     *
     * @desc Creates a TargetHttpsProxy resource in the specified project using the data included in the request.
     *
     * @alias compute.targetHttpsProxies.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).TargetHttpsProxy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpsProxies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.list
     *
     * @desc Retrieves the list of TargetHttpsProxy resources available to the specified project.
     *
     * @alias compute.targetHttpsProxies.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpsProxies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.setSslCertificates
     *
     * @desc Replaces SslCertificates for TargetHttpsProxy.
     *
     * @alias compute.targetHttpsProxies.setSslCertificates
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpsProxy Name of the TargetHttpsProxy resource to set an SslCertificates resource for.
     * @param {compute(alpha).TargetHttpsProxiesSetSslCertificatesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setSslCertificates: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/targetHttpsProxies/{targetHttpsProxy}/setSslCertificates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpsProxy'],
        pathParams: ['project', 'targetHttpsProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.setUrlMap
     *
     * @desc Changes the URL map for TargetHttpsProxy.
     *
     * @alias compute.targetHttpsProxies.setUrlMap
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetHttpsProxy Name of the TargetHttpsProxy resource whose URL map is to be set.
     * @param {compute(alpha).UrlMapReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setUrlMap: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/targetHttpsProxies/{targetHttpsProxy}/setUrlMap',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetHttpsProxy'],
        pathParams: ['project', 'targetHttpsProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetHttpsProxies.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetHttpsProxies.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetHttpsProxies/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetInstances = {

    /**
     * compute.targetInstances.aggregatedList
     *
     * @desc Retrieves an aggregated list of target instances.
     *
     * @alias compute.targetInstances.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/targetInstances',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetInstances.delete
     *
     * @desc Deletes the specified TargetInstance resource.
     *
     * @alias compute.targetInstances.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetInstance Name of the TargetInstance resource to delete.
     * @param {string} params.zone Name of the zone scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/targetInstances/{targetInstance}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'targetInstance'],
        pathParams: ['project', 'targetInstance', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetInstances.get
     *
     * @desc Returns the specified TargetInstance resource. Get a list of available target instances by making a list() request.
     *
     * @alias compute.targetInstances.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetInstance Name of the TargetInstance resource to return.
     * @param {string} params.zone Name of the zone scoping this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/targetInstances/{targetInstance}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'targetInstance'],
        pathParams: ['project', 'targetInstance', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetInstances.insert
     *
     * @desc Creates a TargetInstance resource in the specified project and zone using the data included in the request.
     *
     * @alias compute.targetInstances.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone scoping this request.
     * @param {compute(alpha).TargetInstance} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/targetInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetInstances.list
     *
     * @desc Retrieves a list of TargetInstance resources available to the specified project and zone.
     *
     * @alias compute.targetInstances.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/targetInstances',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetInstances.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetInstances.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {string} params.zone The name of the zone for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/targetInstances/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resource'],
        pathParams: ['project', 'resource', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetPools = {

    /**
     * compute.targetPools.addHealthCheck
     *
     * @desc Adds health check URLs to a target pool.
     *
     * @alias compute.targetPools.addHealthCheck
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the target pool to add a health check to.
     * @param {compute(alpha).TargetPoolsAddHealthCheckRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addHealthCheck: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/addHealthCheck',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.addInstance
     *
     * @desc Adds an instance to a target pool.
     *
     * @alias compute.targetPools.addInstance
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to add instances to.
     * @param {compute(alpha).TargetPoolsAddInstanceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addInstance: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/addInstance',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.aggregatedList
     *
     * @desc Retrieves an aggregated list of target pools.
     *
     * @alias compute.targetPools.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/targetPools',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.delete
     *
     * @desc Deletes the specified target pool.
     *
     * @alias compute.targetPools.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.get
     *
     * @desc Returns the specified target pool. Get a list of available target pools by making a list() request.
     *
     * @alias compute.targetPools.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.getHealth
     *
     * @desc Gets the most recent health check results for each IP for the instance that is referenced by the given target pool.
     *
     * @alias compute.targetPools.getHealth
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to which the queried instance belongs.
     * @param {compute(alpha).InstanceReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getHealth: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/getHealth',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.insert
     *
     * @desc Creates a target pool in the specified project and region using the data included in the request.
     *
     * @alias compute.targetPools.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {compute(alpha).TargetPool} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.list
     *
     * @desc Retrieves a list of target pools available to the specified project and region.
     *
     * @alias compute.targetPools.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.removeHealthCheck
     *
     * @desc Removes health check URL from a target pool.
     *
     * @alias compute.targetPools.removeHealthCheck
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.targetPool Name of the target pool to remove health checks from.
     * @param {compute(alpha).TargetPoolsRemoveHealthCheckRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeHealthCheck: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/removeHealthCheck',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.removeInstance
     *
     * @desc Removes instance URL from a target pool.
     *
     * @alias compute.targetPools.removeInstance
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to remove instances from.
     * @param {compute(alpha).TargetPoolsRemoveInstanceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeInstance: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/removeInstance',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.setBackup
     *
     * @desc Changes a backup target pool's configurations.
     *
     * @alias compute.targetPools.setBackup
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {number=} params.failoverRatio New failoverRatio value for the target pool.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region scoping this request.
     * @param {string} params.targetPool Name of the TargetPool resource to set a backup pool for.
     * @param {compute(alpha).TargetReference} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setBackup: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{targetPool}/setBackup',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetPool'],
        pathParams: ['project', 'region', 'targetPool'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetPools.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetPools.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetPools/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetSslProxies = {

    /**
     * compute.targetSslProxies.delete
     *
     * @desc Deletes the specified TargetSslProxy resource.
     *
     * @alias compute.targetSslProxies.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetSslProxy Name of the TargetSslProxy resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{targetSslProxy}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'targetSslProxy'],
        pathParams: ['project', 'targetSslProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.get
     *
     * @desc Returns the specified TargetSslProxy resource. Get a list of available target SSL proxies by making a list() request.
     *
     * @alias compute.targetSslProxies.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetSslProxy Name of the TargetSslProxy resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{targetSslProxy}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'targetSslProxy'],
        pathParams: ['project', 'targetSslProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.insert
     *
     * @desc Creates a TargetSslProxy resource in the specified project using the data included in the request.
     *
     * @alias compute.targetSslProxies.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).TargetSslProxy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.list
     *
     * @desc Retrieves the list of TargetSslProxy resources available to the specified project.
     *
     * @alias compute.targetSslProxies.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.setBackendService
     *
     * @desc Changes the BackendService for TargetSslProxy.
     *
     * @alias compute.targetSslProxies.setBackendService
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetSslProxy Name of the TargetSslProxy resource whose BackendService resource is to be set.
     * @param {compute(alpha).TargetSslProxiesSetBackendServiceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setBackendService: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{targetSslProxy}/setBackendService',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetSslProxy'],
        pathParams: ['project', 'targetSslProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.setProxyHeader
     *
     * @desc Changes the ProxyHeaderType for TargetSslProxy.
     *
     * @alias compute.targetSslProxies.setProxyHeader
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetSslProxy Name of the TargetSslProxy resource whose ProxyHeader is to be set.
     * @param {compute(alpha).TargetSslProxiesSetProxyHeaderRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setProxyHeader: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{targetSslProxy}/setProxyHeader',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetSslProxy'],
        pathParams: ['project', 'targetSslProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.setSslCertificates
     *
     * @desc Changes SslCertificates for TargetSslProxy.
     *
     * @alias compute.targetSslProxies.setSslCertificates
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetSslProxy Name of the TargetSslProxy resource whose SslCertificate resource is to be set.
     * @param {compute(alpha).TargetSslProxiesSetSslCertificatesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setSslCertificates: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{targetSslProxy}/setSslCertificates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetSslProxy'],
        pathParams: ['project', 'targetSslProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetSslProxies.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetSslProxies.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetSslProxies/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetTcpProxies = {

    /**
     * compute.targetTcpProxies.delete
     *
     * @desc Deletes the specified TargetTcpProxy resource.
     *
     * @alias compute.targetTcpProxies.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetTcpProxy Name of the TargetTcpProxy resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies/{targetTcpProxy}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'targetTcpProxy'],
        pathParams: ['project', 'targetTcpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.get
     *
     * @desc Returns the specified TargetTcpProxy resource. Get a list of available target TCP proxies by making a list() request.
     *
     * @alias compute.targetTcpProxies.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetTcpProxy Name of the TargetTcpProxy resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies/{targetTcpProxy}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'targetTcpProxy'],
        pathParams: ['project', 'targetTcpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.insert
     *
     * @desc Creates a TargetTcpProxy resource in the specified project using the data included in the request.
     *
     * @alias compute.targetTcpProxies.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).TargetTcpProxy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.list
     *
     * @desc Retrieves the list of TargetTcpProxy resources available to the specified project.
     *
     * @alias compute.targetTcpProxies.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.setBackendService
     *
     * @desc Changes the BackendService for TargetTcpProxy.
     *
     * @alias compute.targetTcpProxies.setBackendService
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetTcpProxy Name of the TargetTcpProxy resource whose BackendService resource is to be set.
     * @param {compute(alpha).TargetTcpProxiesSetBackendServiceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setBackendService: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies/{targetTcpProxy}/setBackendService',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetTcpProxy'],
        pathParams: ['project', 'targetTcpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.setProxyHeader
     *
     * @desc Changes the ProxyHeaderType for TargetTcpProxy.
     *
     * @alias compute.targetTcpProxies.setProxyHeader
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.targetTcpProxy Name of the TargetTcpProxy resource whose ProxyHeader is to be set.
     * @param {compute(alpha).TargetTcpProxiesSetProxyHeaderRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setProxyHeader: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies/{targetTcpProxy}/setProxyHeader',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'targetTcpProxy'],
        pathParams: ['project', 'targetTcpProxy'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetTcpProxies.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetTcpProxies.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/targetTcpProxies/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetVpnGateways = {

    /**
     * compute.targetVpnGateways.aggregatedList
     *
     * @desc Retrieves an aggregated list of target VPN gateways.
     *
     * @alias compute.targetVpnGateways.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/targetVpnGateways',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetVpnGateways.delete
     *
     * @desc Deletes the specified target VPN gateway.
     *
     * @alias compute.targetVpnGateways.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.targetVpnGateway Name of the target VPN gateway to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetVpnGateways/{targetVpnGateway}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetVpnGateway'],
        pathParams: ['project', 'region', 'targetVpnGateway'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetVpnGateways.get
     *
     * @desc Returns the specified target VPN gateway. Get a list of available target VPN gateways by making a list() request.
     *
     * @alias compute.targetVpnGateways.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.targetVpnGateway Name of the target VPN gateway to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetVpnGateways/{targetVpnGateway}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'targetVpnGateway'],
        pathParams: ['project', 'region', 'targetVpnGateway'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetVpnGateways.insert
     *
     * @desc Creates a target VPN gateway in the specified project and region using the data included in the request.
     *
     * @alias compute.targetVpnGateways.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).TargetVpnGateway} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetVpnGateways',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetVpnGateways.list
     *
     * @desc Retrieves a list of target VPN gateways available to the specified project and region.
     *
     * @alias compute.targetVpnGateways.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetVpnGateways',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.targetVpnGateways.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.targetVpnGateways.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/targetVpnGateways/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.urlMaps = {

    /**
     * compute.urlMaps.delete
     *
     * @desc Deletes the specified UrlMap resource.
     *
     * @alias compute.urlMaps.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.get
     *
     * @desc Returns the specified UrlMap resource. Get a list of available URL maps by making a list() request.
     *
     * @alias compute.urlMaps.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.insert
     *
     * @desc Creates a UrlMap resource in the specified project using the data included in the request.
     *
     * @alias compute.urlMaps.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {compute(alpha).UrlMap} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.invalidateCache
     *
     * @desc Initiates a cache invalidation operation, invalidating the specified path, scoped to the specified UrlMap.
     *
     * @alias compute.urlMaps.invalidateCache
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap scoping this request.
     * @param {compute(alpha).CacheInvalidationRule} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    invalidateCache: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}/invalidateCache',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.list
     *
     * @desc Retrieves the list of UrlMap resources available to the specified project.
     *
     * @alias compute.urlMaps.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.patch
     *
     * @desc Updates the specified UrlMap resource with the data included in the request. This method supports patch semantics.
     *
     * @alias compute.urlMaps.patch
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap resource to update.
     * @param {compute(alpha).UrlMap} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    patch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.urlMaps.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.update
     *
     * @desc Updates the specified UrlMap resource with the data included in the request.
     *
     * @alias compute.urlMaps.update
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap resource to update.
     * @param {compute(alpha).UrlMap} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.urlMaps.validate
     *
     * @desc Runs static validation for the UrlMap. In particular, the tests of the provided UrlMap will be run. Calling this method does NOT create the UrlMap.
     *
     * @alias compute.urlMaps.validate
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.urlMap Name of the UrlMap resource to be validated as.
     * @param {compute(alpha).UrlMapsValidateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    validate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/global/urlMaps/{urlMap}/validate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'urlMap'],
        pathParams: ['project', 'urlMap'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.vpnTunnels = {

    /**
     * compute.vpnTunnels.aggregatedList
     *
     * @desc Retrieves an aggregated list of VPN tunnels.
     *
     * @alias compute.vpnTunnels.aggregatedList
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    aggregatedList: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/aggregated/vpnTunnels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.vpnTunnels.delete
     *
     * @desc Deletes the specified VpnTunnel resource.
     *
     * @alias compute.vpnTunnels.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.vpnTunnel Name of the VpnTunnel resource to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/vpnTunnels/{vpnTunnel}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'vpnTunnel'],
        pathParams: ['project', 'region', 'vpnTunnel'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.vpnTunnels.get
     *
     * @desc Returns the specified VpnTunnel resource. Get a list of available VPN tunnels by making a list() request.
     *
     * @alias compute.vpnTunnels.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {string} params.vpnTunnel Name of the VpnTunnel resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/vpnTunnels/{vpnTunnel}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'vpnTunnel'],
        pathParams: ['project', 'region', 'vpnTunnel'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.vpnTunnels.insert
     *
     * @desc Creates a VpnTunnel resource in the specified project and region using the data included in the request.
     *
     * @alias compute.vpnTunnels.insert
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
     * @param {compute(alpha).VpnTunnel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/vpnTunnels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.vpnTunnels.list
     *
     * @desc Retrieves a list of VpnTunnel resources contained in the specified project and region.
     *
     * @alias compute.vpnTunnels.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region Name of the region for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/vpnTunnels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'region'],
        pathParams: ['project', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.vpnTunnels.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias compute.vpnTunnels.testIamPermissions
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.region The name of the region for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {compute(alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/regions/{region}/vpnTunnels/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'region', 'resource'],
        pathParams: ['project', 'region', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.zoneOperations = {

    /**
     * compute.zoneOperations.delete
     *
     * @desc Deletes the specified zone-specific Operations resource.
     *
     * @alias compute.zoneOperations.delete
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to delete.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    delete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/operations/{operation}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'operation'],
        pathParams: ['operation', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.zoneOperations.get
     *
     * @desc Retrieves the specified zone-specific Operations resource.
     *
     * @alias compute.zoneOperations.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to return.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'operation'],
        pathParams: ['operation', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.zoneOperations.list
     *
     * @desc Retrieves a list of Operation resources contained within the specified zone.
     *
     * @alias compute.zoneOperations.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.zones = {

    /**
     * compute.zones.get
     *
     * @desc Returns the specified Zone resource. Get a list of available zones by making a list() request.
     *
     * @alias compute.zones.get
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone resource to return.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    get: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones/{zone}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * compute.zones.list
     *
     * @desc Retrieves the list of Zone resources available to the specified project.
     *
     * @alias compute.zones.list
     * @memberOf! compute(alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/compute/alpha/projects/{project}/zones',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AccessConfig
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} dnsName [Output Only] The public DNS domain name for the instance.
 * @property {string} kind [Output Only] Type of the resource. Always compute#accessConfig for access configs.
 * @property {string} name Name of this access configuration.
 * @property {string} natIP An external IP address associated with this instance. Specify an unused static external IP address available to the project or leave this field undefined to use an IP from a shared ephemeral IP address pool. If you specify a static external IP address, it must live in the same region as the zone of the instance.
 * @property {string} networkTier This signifies the networking tier used for configuring this access configuration and can only take the following values: CLOUD_NETWORK_PREMIUM , CLOUD_NETWORK_STANDARD. If this field is not specified, it is assumed to be CLOUD_NETWORK_PREMIUM.
 * @property {string} ptrDomainName The DNS domain name for the public PTR record. This field can only be set when the set_ptr field is enabled.
 * @property {boolean} setPtr Specifies whether a public DNS ?PTR? record should be created to map the external IP address of the instance to a DNS domain name.
 * @property {boolean} setPublicDns Specifies whether a public DNS ?A? record should be created for the external IP address of this access configuration.
 * @property {string} type The type of configuration. The default and only option is ONE_TO_ONE_NAT.
 */
/**
 * @typedef Address
 * @memberOf! compute(alpha)
 * @type object
* @property {string} address The static external IP address represented by this resource.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#address for addresses.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this Address, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve an Address.
* @property {object} labels Labels to apply to this Address resource. These can be later modified by the setLabels method. Each label key/value must comply with RFC1035. Label values may be empty.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} networkTier This signifies the networking tier used for configuring this Address and can only take the following values: CLOUD_NETWORK_PREMIUM , CLOUD_NETWORK_STANDARD. If this field is not specified, it is assumed to be CLOUD_NETWORK_PREMIUM.
* @property {string} region [Output Only] URL of the region where the regional address resides. This field is not applicable to global addresses.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} status [Output Only] The status of the address, which can be either IN_USE or RESERVED. An address that is RESERVED is currently reserved and available to use. An IN_USE address is currently being used by another resource and is not available.
* @property {string[]} users [Output Only] The URLs of the resources that are using this address.
*/
/**
 * @typedef AddressAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {object} items [Output Only] A map of scoped address lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#addressAggregatedList for aggregated lists of addresses.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef AddressList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Address[]} items [Output Only] A list of addresses.
 * @property {string} kind [Output Only] Type of resource. Always compute#addressList for lists of addresses.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef AddressesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Address[]} addresses [Output Only] List of addresses contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of addresses when the list is empty.
 */
/**
 * @typedef AliasIpRange
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} ipCidrRange The IP CIDR range represented by this alias IP range. This IP CIDR range must belong to the specified subnetwork and cannot contain IP addresses reserved by system or used by other network interfaces. This range may be a single IP address (e.g. 10.2.3.4), a netmask (e.g. /24) or a CIDR format string (e.g. 10.1.2.0/24).
 * @property {string} subnetworkRangeName Optional subnetwork secondary range name specifying the secondary range from which to allocate the IP CIDR range for this alias IP range. If left unspecified, the primary range of the subnetwork will be used.
 */
/**
 * @typedef AttachedDisk
 * @memberOf! compute(alpha)
 * @type object
* @property {boolean} autoDelete Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).
* @property {boolean} boot Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.
* @property {string} deviceName Specifies a unique device name of your choice that is reflected into the /dev/disk/by-id/google-* tree of a Linux operating system running within the instance. This name can be used to reference the device for mounting, resizing, and so on, from within the instance.

If not specified, the server chooses a default device name to apply to this disk, in the form persistent-disks-x, where x is a number assigned by Google Compute Engine. This field is only applicable for persistent disks.
* @property {compute(alpha).CustomerEncryptionKey} diskEncryptionKey Encrypts or decrypts a disk using a customer-supplied encryption key.

If you are creating a new disk, this field encrypts the new disk using an encryption key that you provide. If you are attaching an existing disk that is already encrypted, this field decrypts the disk using the customer-supplied encryption key.

If you encrypt a disk using a customer-supplied key, you must provide the same key again when you attempt to use this resource at a later time. For example, you must provide the key when you create a snapshot or an image from the disk or when you attach the disk to a virtual machine instance.

If you do not provide an encryption key, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later.

Instance templates do not store customer-supplied encryption keys, so you cannot use your own keys to encrypt disks in a managed instance group.
* @property {string} diskSizeGb The size of the disk in base-2 GB. This supersedes disk_size_gb in InitializeParams.
* @property {integer} index Assigns a zero-based index to this disk, where 0 is reserved for the boot disk. For example, if you have many disks attached to an instance, each disk would have a unique index number. If not specified, the server will choose an appropriate value.
* @property {compute(alpha).AttachedDiskInitializeParams} initializeParams [Input Only] Specifies the parameters for a new disk that will be created alongside the new instance. Use initialization parameters to create boot disks or local SSDs attached to the new instance.

This property is mutually exclusive with the source property; you can only define one or the other, but not both.
* @property {string} interface Specifies the disk interface to use for attaching this disk, which is either SCSI or NVME. The default is SCSI. Persistent disks must always use SCSI and the request will fail if you attempt to attach a persistent disk in any other format than SCSI. Local SSDs can use either NVME or SCSI. For performance characteristics of SCSI over NVMe, see Local SSD performance.
* @property {string} kind [Output Only] Type of the resource. Always compute#attachedDisk for attached disks.
* @property {string[]} licenses [Output Only] Any valid publicly visible licenses.
* @property {string} mode The mode in which to attach this disk, either READ_WRITE or READ_ONLY. If not specified, the default is to attach the disk in READ_WRITE mode.
* @property {string} source Specifies a valid partial or full URL to an existing Persistent Disk resource. When creating a new instance, one of initializeParams.sourceImage or disks.source is required.

If desired, you can also attach existing non-root persistent disks using this property. This field is only applicable for persistent disks.

Note that for InstanceTemplate, specify the disk name, not the URL for the disk.
* @property {string} type Specifies the type of the disk, either SCRATCH or PERSISTENT. If not specified, the default is PERSISTENT.
*/
/**
 * @typedef AttachedDiskInitializeParams
 * @memberOf! compute(alpha)
 * @type object
* @property {string} diskName Specifies the disk name. If not specified, the default is to use the name of the instance.
* @property {string} diskSizeGb Specifies the size of the disk in base-2 GB.
* @property {string} diskStorageType [Deprecated] Storage type of the disk.
* @property {string} diskType Specifies the disk type to use to create the instance. If not specified, the default is pd-standard, specified using the full URL. For example:

https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/pd-standard 

Other values include pd-ssd and local-ssd. If you define this field, you can provide either the full or partial URL. For example, the following are valid values:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/diskType 
- projects/project/zones/zone/diskTypes/diskType 
- zones/zone/diskTypes/diskType  Note that for InstanceTemplate, this is the name of the disk type, not URL.
* @property {string} sourceImage The source image to create this disk. When creating a new instance, one of initializeParams.sourceImage or disks.source is required.

To create a disk with one of the public operating system images, specify the image by its family name. For example, specify family/debian-8 to use the latest Debian 8 image:

projects/debian-cloud/global/images/family/debian-8 

Alternatively, use a specific version of a public operating system image:

projects/debian-cloud/global/images/debian-8-jessie-vYYYYMMDD 

To create a disk with a private image that you created, specify the image name in the following format:

global/images/my-private-image 

You can also specify a private image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:

global/images/family/my-private-family 

If the source image is deleted later, this field will not be set.
* @property {compute(alpha).CustomerEncryptionKey} sourceImageEncryptionKey The customer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.

Instance templates do not store customer-supplied encryption keys, so you cannot create disks for instances in a managed instance group if the source images are encrypted with your own keys.
*/
/**
 * @typedef AuditConfig
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).AuditLogConfig[]} auditLogConfigs The configuration for each type of logging
 * @property {string[]} exemptedMembers Specifies the identities that are exempted from &quot;data access&quot; audit logging for the `service` specified above. Follows the same format of Binding.members.
 * @property {string} service Specifies a service that will be enabled for audit logging. For example, `resourcemanager`, `storage`, `compute`. `allServices` is a special value that covers all services.
 */
/**
 * @typedef AuditLogConfig
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} exemptedMembers Specifies the identities that are exempted from this type of logging Follows the same format of Binding.members.
 * @property {string} logType The log type that this config enables.
 */
/**
 * @typedef Autoscaler
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).AutoscalingPolicy} autoscalingPolicy The configuration parameters for the autoscaling algorithm. You can define one or more of the policies for an autoscaler: cpuUtilization, customMetricUtilizations, and loadBalancingUtilization.

If none of these are specified, the default will be to autoscale based on cpuUtilization to 0.6 or 60%.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#autoscaler for autoscalers.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} region [Output Only] URL of the region where the instance group resides (for autoscalers living in regional scope).
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} status [Output Only] The status of the autoscaler configuration.
* @property {compute(alpha).AutoscalerStatusDetails[]} statusDetails [Output Only] Human-readable details about the current state of the autoscaler. Read the documentation for Commonly returned status messages for examples of status messages you might encounter.
* @property {string} target URL of the managed instance group that this autoscaler will scale.
* @property {string} zone [Output Only] URL of the zone where the instance group resides (for autoscalers living in zonal scope).
*/
/**
 * @typedef AutoscalerAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items A map of scoped autoscaler lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#autoscalerAggregatedList for aggregated lists of autoscalers.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef AutoscalerList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Autoscaler[]} items A list of Autoscaler resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#autoscalerList for lists of autoscalers.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef AutoscalerStatusDetails
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} message The status message.
 * @property {string} type The type of error returned.
 */
/**
 * @typedef AutoscalersScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Autoscaler[]} autoscalers [Output Only] List of autoscalers contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of autoscalers when the list is empty.
 */
/**
 * @typedef AutoscalingPolicy
 * @memberOf! compute(alpha)
 * @type object
* @property {integer} coolDownPeriodSec The number of seconds that the autoscaler should wait before it starts collecting information from a new instance. This prevents the autoscaler from collecting information when the instance is initializing, during which the collected usage would not be reliable. The default time autoscaler waits is 60 seconds.

Virtual machine initialization times might vary because of numerous factors. We recommend that you test how long an instance may take to initialize. To do this, create an instance and time the startup process.
* @property {compute(alpha).AutoscalingPolicyCpuUtilization} cpuUtilization Defines the CPU utilization policy that allows the autoscaler to scale based on the average CPU utilization of a managed instance group.
* @property {compute(alpha).AutoscalingPolicyCustomMetricUtilization[]} customMetricUtilizations Configuration parameters of autoscaling based on a custom metric.
* @property {compute(alpha).AutoscalingPolicyLoadBalancingUtilization} loadBalancingUtilization Configuration parameters of autoscaling based on load balancer.
* @property {integer} maxNumReplicas The maximum number of instances that the autoscaler can scale up to. This is required when creating or updating an autoscaler. The maximum number of replicas should not be lower than minimal number of replicas.
* @property {integer} minNumReplicas The minimum number of replicas that the autoscaler can scale down to. This cannot be less than 0. If not provided, autoscaler will choose a default value depending on maximum number of instances allowed.
* @property {compute(alpha).AutoscalingPolicyQueueBasedScaling} queueBasedScaling Configuration parameters of autoscaling based on queuing system.
*/
/**
 * @typedef AutoscalingPolicyCpuUtilization
 * @memberOf! compute(alpha)
 * @type object
* @property {number} utilizationTarget The target CPU utilization that the autoscaler should maintain. Must be a float value in the range (0, 1]. If not specified, the default is 0.6.

If the CPU level is below the target utilization, the autoscaler scales down the number of instances until it reaches the minimum number of instances you specified or until the average CPU of your instances reaches the target utilization.

If the average CPU is above the target utilization, the autoscaler scales up until it reaches the maximum number of instances you specified or until the average utilization reaches the target utilization.
*/
/**
 * @typedef AutoscalingPolicyCustomMetricUtilization
 * @memberOf! compute(alpha)
 * @type object
* @property {string} metric The identifier of the Stackdriver Monitoring metric. The metric cannot have negative values and should be a utilization metric, which means that the number of virtual machines handling requests should increase or decrease proportionally to the metric. The metric must also have a label of compute.googleapis.com/resource_id with the value of the instance&#39;s unique ID, although this alone does not guarantee that the metric is valid.

For example, the following is a valid metric:
compute.googleapis.com/instance/network/received_bytes_count
The following is not a valid metric because it does not increase or decrease based on usage:
compute.googleapis.com/instance/cpu/reserved_cores
* @property {number} utilizationTarget Target value of the metric which autoscaler should maintain. Must be a positive value.
* @property {string} utilizationTargetType Defines how target utilization value is expressed for a Stackdriver Monitoring metric. Either GAUGE, DELTA_PER_SECOND, or DELTA_PER_MINUTE. If not specified, the default is GAUGE.
*/
/**
 * @typedef AutoscalingPolicyLoadBalancingUtilization
 * @memberOf! compute(alpha)
 * @type object
 * @property {number} utilizationTarget Fraction of backend capacity utilization (set in HTTP(s) load balancing configuration) that autoscaler should maintain. Must be a positive float value. If not defined, the default is 0.8.
 */
/**
 * @typedef AutoscalingPolicyQueueBasedScaling
 * @memberOf! compute(alpha)
 * @type object
 * @property {number} acceptableBacklogPerInstance Scaling based on the average number of tasks in the queue per each active instance. The autoscaler keeps the average number of tasks per instance below this number, based on data collected in the last couple of minutes. The autoscaler will also take into account incoming tasks when calculating when to scale.
 * @property {compute(alpha).AutoscalingPolicyQueueBasedScalingCloudPubSub} cloudPubSub Configuration for Cloud Pub/Sub subscription queue.
 * @property {number} singleWorkerThroughputPerSec The scaling algorithm will also calculate throughput estimates on its own; if you explicitly provide this value, the autoscaler will take into account your value as well as automatic estimates when deciding how to scale.
 */
/**
 * @typedef AutoscalingPolicyQueueBasedScalingCloudPubSub
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} subscription Cloud Pub/Sub subscription used for scaling. Provide the partial URL (starting with projects/) or just the subscription name. The subscription must be assigned to the topic specified in topicName and must be in a pull configuration. The subscription must belong to the same project as the Autoscaler.
 * @property {string} topic Cloud Pub/Sub topic used for scaling. Provide the partial URL or partial URL (starting with projects/) or just the topic name. The topic must belong to the same project as the Autoscaler resource.
 */
/**
 * @typedef Backend
 * @memberOf! compute(alpha)
 * @type object
* @property {string} balancingMode Specifies the balancing mode for this backend. For global HTTP(S) or TCP/SSL load balancing, the default is UTILIZATION. Valid values are UTILIZATION, RATE (for HTTP(S)) and CONNECTION (for TCP/SSL).

This cannot be used for internal load balancing.
* @property {number} capacityScaler A multiplier applied to the group&#39;s maximum servicing capacity (based on UTILIZATION, RATE or CONNECTION). Default value is 1, which means the group will serve up to 100% of its configured capacity (depending on balancingMode). A setting of 0 means the group is completely drained, offering 0% of its available Capacity. Valid range is [0.0,1.0].

This cannot be used for internal load balancing.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {boolean} failover This field designates whether this is a failover backend. More than one failover backend can be configured for a given BackendService.
* @property {string} group The fully-qualified URL of a zonal Instance Group resource. This instance group defines the list of instances that serve traffic. Member virtual machine instances from each instance group must live in the same zone as the instance group itself. No two backends in a backend service are allowed to use same Instance Group resource.

Note that you must specify an Instance Group resource using the fully-qualified URL, rather than a partial URL.

When the BackendService has load balancing scheme INTERNAL, the instance group must be in a zone within the same region as the BackendService.
* @property {integer} maxConnections The max number of simultaneous connections for the group. Can be used with either CONNECTION or UTILIZATION balancing modes. For CONNECTION mode, either maxConnections or maxConnectionsPerInstance must be set.

This cannot be used for internal load balancing.
* @property {integer} maxConnectionsPerInstance The max number of simultaneous connections that a single backend instance can handle. This is used to calculate the capacity of the group. Can be used in either CONNECTION or UTILIZATION balancing modes. For CONNECTION mode, either maxConnections or maxConnectionsPerInstance must be set.

This cannot be used for internal load balancing.
* @property {integer} maxRate The max requests per second (RPS) of the group. Can be used with either RATE or UTILIZATION balancing modes, but required if RATE mode. For RATE mode, either maxRate or maxRatePerInstance must be set.

This cannot be used for internal load balancing.
* @property {number} maxRatePerInstance The max requests per second (RPS) that a single backend instance can handle.This is used to calculate the capacity of the group. Can be used in either balancing mode. For RATE mode, either maxRate or maxRatePerInstance must be set.

This cannot be used for internal load balancing.
* @property {number} maxUtilization Used when balancingMode is UTILIZATION. This ratio defines the CPU utilization target for the group. The default is 0.8. Valid range is [0.0, 1.0].

This cannot be used for internal load balancing.
*/
/**
 * @typedef BackendBucket
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} bucketName Cloud Storage bucket name.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional textual description of the resource; provided by the client when the resource is created.
 * @property {boolean} enableCdn If true, enable Cloud CDN for this BackendBucket.
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} kind Type of the resource.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef BackendBucketList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {compute(alpha).BackendBucket[]} items A list of BackendBucket resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef BackendSSLPolicy
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} pinnedPeerCertificates List of PEM-encoded peer certificates, from which the public keys are extracted for authenticating the backend service.
 */
/**
 * @typedef BackendService
 * @memberOf! compute(alpha)
 * @type object
* @property {integer} affinityCookieTtlSec Lifetime of cookies in seconds if session_affinity is GENERATED_COOKIE. If set to 0, the cookie is non-persistent and lasts only until the end of the browser session (or equivalent). The maximum allowed value for TTL is one day.

When the load balancing scheme is INTERNAL, this field is not used.
* @property {compute(alpha).BackendSSLPolicy} backendSslPolicy Backend SSL policies to enforce.
* @property {compute(alpha).Backend[]} backends The list of backends that serve this BackendService.
* @property {compute(alpha).BackendServiceCdnPolicy} cdnPolicy Cloud CDN configuration for this BackendService.
* @property {compute(alpha).ConnectionDraining} connectionDraining 
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string[]} customRequestHeaders Headers that the HTTP/S load balancer should add to proxied requests.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {boolean} enableCDN If true, enable Cloud CDN for this BackendService.

When the load balancing scheme is INTERNAL, this field is not used.
* @property {string} fingerprint Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a BackendService. An up-to-date fingerprint must be provided in order to update the BackendService.
* @property {string[]} healthChecks The list of URLs to the HttpHealthCheck or HttpsHealthCheck resource for health checking this BackendService. Currently at most one health check can be specified, and a health check is required.

For internal load balancing, a URL to a HealthCheck resource must be specified instead.
* @property {compute(alpha).BackendServiceIAP} iap 
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of resource. Always compute#backendService for backend services.
* @property {string} loadBalancingScheme 
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {integer} port Deprecated in favor of portName. The TCP port to connect on the backend. The default value is 80.

This cannot be used for internal load balancing.
* @property {string} portName Name of backend port. The same name should appear in the instance groups referenced by this service. Required when the load balancing scheme is EXTERNAL.

When the load balancing scheme is INTERNAL, this field is not used.
* @property {string} protocol The protocol this BackendService uses to communicate with backends.

Possible values are HTTP, HTTPS, HTTP2, TCP and SSL. The default is HTTP.

For internal load balancing, the possible values are TCP and UDP, and the default is TCP.
* @property {string} region [Output Only] URL of the region where the regional backend service resides. This field is not applicable to global backend services.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} sessionAffinity Type of session affinity to use. The default is NONE.

When the load balancing scheme is EXTERNAL, can be NONE, CLIENT_IP, or GENERATED_COOKIE.

When the load balancing scheme is INTERNAL, can be NONE, CLIENT_IP, CLIENT_IP_PROTO, or CLIENT_IP_PORT_PROTO.

When the protocol is UDP, this field is not used.
* @property {integer} timeoutSec How many seconds to wait for the backend before considering it a failed request. Default is 30 seconds.
*/
/**
 * @typedef BackendServiceAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {object} items A map of scoped BackendService lists.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef BackendServiceCdnPolicy
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).CacheKeyPolicy} cacheKeyPolicy The CacheKeyPolicy for this CdnPolicy.
 */
/**
 * @typedef BackendServiceGroupHealth
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).HealthStatus[]} healthStatus 
 * @property {string} kind [Output Only] Type of resource. Always compute#backendServiceGroupHealth for the health of backend services.
 */
/**
 * @typedef BackendServiceIAP
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} enabled 
 * @property {string} oauth2ClientId 
 * @property {string} oauth2ClientSecret 
 * @property {string} oauth2ClientSecretSha256 
 */
/**
 * @typedef BackendServiceList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {compute(alpha).BackendService[]} items A list of BackendService resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#backendServiceList for lists of backend services.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef BackendServicesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).BackendService[]} backendServices List of BackendServices contained in this scope.
 * @property {object} warning Informational warning which replaces the list of backend services when the list is empty.
 */
/**
 * @typedef Binding
 * @memberOf! compute(alpha)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource. `members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google account. For example, `alice@gmail.com` or `joe@example.com`.



* `serviceAccount:{emailid}`: An email address that represents a service account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group. For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the users of that domain. For example, `google.com` or `example.com`.
* @property {string} role Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
*/
/**
 * @typedef CacheInvalidationRule
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} host If set, this invalidation rule will only apply to requests with a Host header matching host.
 * @property {string} path 
 */
/**
 * @typedef CacheKeyPolicy
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} includeHost If true, requests to different hosts will be cached separately.
 * @property {boolean} includeProtocol If true, http and https requests will be cached separately.
 * @property {boolean} includeQueryString If true, include query string parameters in the cache key according to query_string_whitelist and query_string_blacklist. If neither is set, the entire query string will be included. If false, the query string will be excluded from the cache key entirely.
 * @property {string[]} queryStringBlacklist Names of query string parameters to exclude in cache keys. All other parameters will be included. Either specify query_string_whitelist or query_string_blacklist, not both. &#39;&amp;&#39; and &#39;=&#39; will be percent encoded and not treated as delimiters.
 * @property {string[]} queryStringWhitelist Names of query string parameters to include in cache keys. All other parameters will be excluded. Either specify query_string_whitelist or query_string_blacklist, not both. &#39;&amp;&#39; and &#39;=&#39; will be percent encoded and not treated as delimiters.
 */
/**
 * @typedef Commitment
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} endTimestamp [Output Only] Commitment end time in RFC3339 text format.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#commitment for commitments.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} plan The plan for this commitment, which determines duration and discount rate. The currently supported plans are TWELVE_MONTH (1 year), and THIRTY_SIX_MONTH (3 years).
 * @property {compute(alpha).ResourceCommitment[]} resources List of commitment amounts for particular resources. Note that VCPU and MEMORY resource commitments must occur together.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} startTimestamp [Output Only] Commitment start time in RFC3339 text format.
 * @property {string} status [Output Only] Status of the commitment with regards to eventual expiration (each commitment has an end-date defined). One of the following values: NOT_YET_ACTIVE, ACTIVE, EXPIRED.
 * @property {string} statusMessage [Output Only] An optional, human-readable explanation of the status.
 * @property {string} zone [Output Only] URL of the zone where this commitment may be used.
 */
/**
 * @typedef CommitmentAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items Commitments by scope.
 * @property {string} kind [Output Only] Type of resource. Always compute#commitmentAggregatedList for aggregated lists of commitments.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef CommitmentList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Commitment[]} items A list of Commitment resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#commitmentList for lists of commitments.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef CommitmentsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Commitment[]} commitments [Output Only] List of commitments contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of commitments when the list is empty.
 */
/**
 * @typedef Condition
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} iam Trusted attributes supplied by the IAM system.
 * @property {string} op An operator to apply the subject with.
 * @property {string} svc Trusted attributes discharged by the service.
 * @property {string} sys Trusted attributes supplied by any service that owns resources and uses the IAM system for access control.
 * @property {string} value DEPRECATED. Use &#39;values&#39; instead.
 * @property {string[]} values The objects of the condition. This is mutually exclusive with &#39;value&#39;.
 */
/**
 * @typedef ConnectionDraining
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} drainingTimeoutSec Time for which instance will be drained (not accept new connections, but still work to finish started).
 */
/**
 * @typedef CustomerEncryptionKey
 * @memberOf! compute(alpha)
 * @type object
* @property {string} rawKey Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource.
* @property {string} rsaEncryptedKey Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource.

The key must meet the following requirements before you can provide it to Compute Engine:  
- The key is wrapped using a RSA public key certificate provided by Google. 
- After being wrapped, the key must be encoded in RFC 4648 base64 encoding.  Get the RSA public key certificate provided by Google at:
https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem
* @property {string} sha256 [Output only] The RFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.
*/
/**
 * @typedef CustomerEncryptionKeyProtectedDisk
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).CustomerEncryptionKey} diskEncryptionKey Decrypts data associated with the disk with a customer-supplied encryption key.
 * @property {string} source Specifies a valid partial or full URL to an existing Persistent Disk resource. This field is only applicable for persistent disks.
 */
/**
 * @typedef DeprecationStatus
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} deleted An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DELETED. This is only informational and the status will not change unless the client explicitly changes it.
 * @property {string} deprecated An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DEPRECATED. This is only informational and the status will not change unless the client explicitly changes it.
 * @property {string} obsolete An optional RFC3339 timestamp on or after which the state of this resource is intended to change to OBSOLETE. This is only informational and the status will not change unless the client explicitly changes it.
 * @property {string} replacement The URL of the suggested replacement for a deprecated resource. The suggested replacement resource must be the same kind of resource as the deprecated resource.
 * @property {string} state The deprecation state of this resource. This can be DEPRECATED, OBSOLETE, or DELETED. Operations which create a new resource using a DEPRECATED resource will return successfully, but with a warning indicating the deprecated resource and recommending its replacement. Operations which use OBSOLETE or DELETED resources will be rejected and result in an error.
 */
/**
 * @typedef Disk
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {compute(alpha).CustomerEncryptionKey} diskEncryptionKey Encrypts the disk using a customer-supplied encryption key.

After you encrypt a disk with a customer-supplied key, you must provide the same key if you use the disk later (e.g. to create a disk snapshot or an image, or to attach the disk to a virtual machine).

Customer-supplied encryption keys do not protect access to metadata of the disk.

If you do not provide an encryption key when creating the disk, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#disk for disks.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this disk, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve a disk.
* @property {object} labels Labels to apply to this disk. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string} lastAttachTimestamp [Output Only] Last attach timestamp in RFC3339 text format.
* @property {string} lastDetachTimestamp [Output Only] Last detach timestamp in RFC3339 text format.
* @property {string[]} licenses Any applicable publicly visible licenses.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} options Internal use only.
* @property {string} region [Output Only] URL of the region where the disk resides. Only applicable for regional resources.
* @property {string[]} replicaZones URLs of the zones where the disk should be replicated to. Only applicable for regional resources.
* @property {string} selfLink [Output Only] Server-defined fully-qualified URL for this resource.
* @property {string} sizeGb Size of the persistent disk, specified in GB. You can specify this field when creating a persistent disk using the sourceImage or sourceSnapshot parameter, or specify it alone to create an empty persistent disk.

If you specify this field along with sourceImage or sourceSnapshot, the value of sizeGb must not be less than the size of the sourceImage or the size of the snapshot.
* @property {string} sourceImage The source image used to create this disk. If the source image is deleted, this field will not be set.

To create a disk with one of the public operating system images, specify the image by its family name. For example, specify family/debian-8 to use the latest Debian 8 image:

projects/debian-cloud/global/images/family/debian-8 

Alternatively, use a specific version of a public operating system image:

projects/debian-cloud/global/images/debian-8-jessie-vYYYYMMDD 

To create a disk with a private image that you created, specify the image name in the following format:

global/images/my-private-image 

You can also specify a private image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:

global/images/family/my-private-family
* @property {compute(alpha).CustomerEncryptionKey} sourceImageEncryptionKey The customer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.
* @property {string} sourceImageId [Output Only] The ID value of the image used to create this disk. This value identifies the exact image that was used to create this persistent disk. For example, if you created the persistent disk from an image that was later deleted and recreated under the same name, the source image ID would identify the exact version of the image that was used.
* @property {string} sourceSnapshot The source snapshot used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:  
- https://www.googleapis.com/compute/v1/projects/project/global/snapshots/snapshot 
- projects/project/global/snapshots/snapshot 
- global/snapshots/snapshot
* @property {compute(alpha).CustomerEncryptionKey} sourceSnapshotEncryptionKey The customer-supplied encryption key of the source snapshot. Required if the source snapshot is protected by a customer-supplied encryption key.
* @property {string} sourceSnapshotId [Output Only] The unique ID of the snapshot used to create this disk. This value identifies the exact snapshot that was used to create this persistent disk. For example, if you created the persistent disk from a snapshot that was later deleted and recreated under the same name, the source snapshot ID would identify the exact version of the snapshot that was used.
* @property {string} status [Output Only] The status of disk creation.
* @property {string} storageType [Deprecated] Storage type of the persistent disk.
* @property {string} type URL of the disk type resource describing which disk type to use to create the disk. Provide this when creating the disk.
* @property {string[]} users [Output Only] Links to the users of the disk (attached instances) in form: project/zones/zone/instances/instance
* @property {string} zone [Output Only] URL of the zone where the disk resides.
*/
/**
 * @typedef DiskAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped disk lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#diskAggregatedList for aggregated lists of persistent disks.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef DiskList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Disk[]} items [Output Only] A list of persistent disks.
 * @property {string} kind [Output Only] Type of resource. Always compute#diskList for lists of disks.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef DiskMoveRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {string} destinationZone The URL of the destination zone to move the disk. This can be a full or partial URL. For example, the following are all valid URLs to a zone:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone 
- projects/project/zones/zone 
- zones/zone
* @property {string} targetDisk The URL of the target disk to move. This can be a full or partial URL. For example, the following are all valid URLs to a disk:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk 
- projects/project/zones/zone/disks/disk 
- zones/zone/disks/disk
*/
/**
 * @typedef DiskType
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} defaultDiskSizeGb [Output Only] Server-defined default disk size in GB.
 * @property {compute(alpha).DeprecationStatus} deprecated [Output Only] The deprecation status associated with this disk type.
 * @property {string} description [Output Only] An optional description of this resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#diskType for disk types.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} validDiskSize [Output Only] An optional textual description of the valid disk size, such as &quot;10GB-10TB&quot;.
 * @property {string} zone [Output Only] URL of the zone where the disk type resides.
 */
/**
 * @typedef DiskTypeAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped disk type lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#diskTypeAggregatedList.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef DiskTypeList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).DiskType[]} items [Output Only] A list of Disk Type resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#diskTypeList for disk types.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef DiskTypesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).DiskType[]} diskTypes [Output Only] List of disk types contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of disk types when the list is empty.
 */
/**
 * @typedef DisksResizeRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} sizeGb The new size of the persistent disk, which is specified in GB.
 */
/**
 * @typedef DisksScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Disk[]} disks [Output Only] List of disks contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of disks when the list is empty.
 */
/**
 * @typedef Firewall
 * @memberOf! compute(alpha)
 * @type object
* @property {object[]} allowed The list of ALLOW rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {object[]} denied The list of DENY rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string[]} destinationRanges If destination ranges are specified, the firewall will apply only to traffic that has destination IP address in these ranges. These ranges must be expressed in CIDR format.
* @property {string} direction Direction of traffic to which this firewall applies; default is INGRESS. Note: For INGRESS traffic, it is NOT supported to specify destinationRanges; For EGRESS traffic, it is NOT supported to specify sourceRanges OR sourceTags.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Ony] Type of the resource. Always compute#firewall for firewall rules.
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} network URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used:
global/networks/default
If you choose to specify this property, you can specify the network as a full or partial URL. For example, the following are all valid URLs:  
- https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network 
- projects/myproject/global/networks/my-network 
- global/networks/default
* @property {integer} priority Priority for this rule. This is an integer between 0 and 65535, both inclusive. When not specified, the value assumed is 1000. Relative priorities determine precedence of conflicting rules. Lower value of priority implies higher precedence (eg, a rule with priority 0 has higher precedence than a rule with priority 1). DENY rules take precedence over ALLOW rules having equal priority.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string[]} sourceRanges If source ranges are specified, the firewall will apply only to traffic that has source IP address in these ranges. These ranges must be expressed in CIDR format. One or both of sourceRanges and sourceTags may be set. If both properties are set, the firewall will apply to traffic that has source IP address within sourceRanges OR the source IP that belongs to a tag listed in the sourceTags property. The connection does not need to match both properties for the firewall to apply.
* @property {string[]} sourceTags If source tags are specified, the firewall will apply only to traffic with source IP that belongs to a tag listed in source tags. Source tags cannot be used to control traffic to an instance&#39;s external IP address. Because tags are associated with an instance, not an IP address. One or both of sourceRanges and sourceTags may be set. If both properties are set, the firewall will apply to traffic that has source IP address within sourceRanges OR the source IP that belongs to a tag listed in the sourceTags property. The connection does not need to match both properties for the firewall to apply.
* @property {string[]} targetTags A list of instance tags indicating sets of instances located in the network that may make network connections as specified in allowed[]. If no targetTags are specified, the firewall rule applies to all instances on the specified network.
*/
/**
 * @typedef FirewallList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Firewall[]} items [Output Only] A list of Firewall resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#firewallList for lists of firewalls.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef FixedOrPercent
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} calculated [Output Only] Absolute value calculated based on mode: mode = fixed -&gt; calculated = fixed = percent -&gt; calculated = ceiling(percent/100 * base_value)
 * @property {integer} fixed fixed must be non-negative.
 * @property {integer} percent percent must belong to [0, 100].
 */
/**
 * @typedef ForwardingRule
 * @memberOf! compute(alpha)
 * @type object
* @property {string} IPAddress The IP address that this forwarding rule is serving on behalf of.

For global forwarding rules, the address must be a global IP; for regional forwarding rules, the address must live in the same region as the forwarding rule. By default, this field is empty and an ephemeral IP from the same scope (global or regional) will be assigned.

When the load balancing scheme is INTERNAL, this can only be an RFC 1918 IP address belonging to the network/subnetwork configured for the forwarding rule. A reserved address cannot be used. If the field is empty, the IP address will be automatically allocated from the internal IP range of the subnetwork or network configured for this forwarding rule.
* @property {string} IPProtocol The IP protocol to which this rule applies. Valid options are TCP, UDP, ESP, AH, SCTP or ICMP.

When the load balancing scheme is INTERNAL&lt;/code, only TCP and UDP are valid.
* @property {string} backendService This field is not used for external load balancing.

For internal load balancing, this field identifies the BackendService resource to receive the matched traffic.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#forwardingRule for Forwarding Rule resources.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this resource, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve a ForwardingRule.
* @property {object} labels Labels to apply to this resource. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string} loadBalancingScheme This signifies what the ForwardingRule will be used for and can only take the following values: INTERNAL EXTERNAL The value of INTERNAL means that this will be used for Internal Network Load Balancing (TCP, UDP). The value of EXTERNAL means that this will be used for External Load Balancing (HTTP(S) LB, External TCP/UDP LB, SSL Proxy)
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} network This field is not used for external load balancing.

For internal load balancing, this field identifies the network that the load balanced IP should belong to for this Forwarding Rule. If this field is not specified, the default network will be used.
* @property {string} networkTier This signifies the networking tier used for configuring this load balancer and can only take the following values: CLOUD_NETWORK_PREMIUM , CLOUD_NETWORK_STANDARD. If this field is not specified, it is assumed to be CLOUD_NETWORK_PREMIUM.
* @property {string} portRange Applicable only when IPProtocol is TCP, UDP, or SCTP, only packets addressed to ports in the specified range will be forwarded to target. Forwarding rules with the same [IPAddress, IPProtocol] pair must have disjoint port ranges.

This field is not used for internal load balancing.
* @property {string[]} ports This field is not used for external load balancing.

When the load balancing scheme is INTERNAL, a single port or a comma separated list of ports can be configured. Only packets addressed to these ports will be forwarded to the backends configured with this forwarding rule. If the port list is not provided then all ports are allowed to pass through.

You may specify a maximum of up to 5 ports.
* @property {string} region [Output Only] URL of the region where the regional forwarding rule resides. This field is not applicable to global forwarding rules.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} serviceLabel An optional prefix to the service name for this Forwarding Rule. If specified, will be the first label of the fully qualified service name.

The label must be 1-63 characters long, and comply with RFC1035. Specifically, the label must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.

This field is only used for internal load balancing.
* @property {string} serviceName [Output Only] The internal fully qualified service name for this Forwarding Rule.

This field is only used for internal load balancing.
* @property {string} subnetwork This field is not used for external load balancing.

For internal load balancing, this field identifies the subnetwork that the load balanced IP should belong to for this Forwarding Rule.

If the network specified is in auto subnet mode, this field is optional. However, if the network is in custom subnet mode, a subnetwork must be specified.
* @property {string} target The URL of the target resource to receive the matched traffic. For regional forwarding rules, this target must live in the same region as the forwarding rule. For global forwarding rules, this target must be a global TargetHttpProxy or TargetHttpsProxy resource. The forwarded traffic must be of a type appropriate to the target object. For example, TargetHttpProxy requires HTTP traffic, and TargetHttpsProxy requires HTTPS traffic.

This field is not used for internal load balancing.
*/
/**
 * @typedef ForwardingRuleAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items A map of scoped forwarding rule lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#forwardingRuleAggregatedList for lists of forwarding rules.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef ForwardingRuleList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Set by the server.
 * @property {compute(alpha).ForwardingRule[]} items A list of ForwardingRule resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef ForwardingRulesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).ForwardingRule[]} forwardingRules List of forwarding rules contained in this scope.
 * @property {object} warning Informational warning which replaces the list of forwarding rules when the list is empty.
 */
/**
 * @typedef GlobalSetLabelsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} labelFingerprint The fingerprint of the previous set of labels for this resource, used to detect conflicts. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash when updating or changing labels. Make a get() request to the resource to get the latest fingerprint.
 * @property {object} labels A list of labels to apply for this resource. Each label key &amp; value must comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash. For example, &quot;webserver-frontend&quot;: &quot;images&quot;. A label value can also be empty (e.g. &quot;my-label&quot;: &quot;&quot;).
 */
/**
 * @typedef GuestOsFeature
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} type The type of supported feature. Currenty only VIRTIO_SCSI_MULTIQUEUE is supported. For newer Windows images, the server might also populate this property with the value WINDOWS to indicate that this is a Windows image. This value is purely informational and does not enable or disable any features.
 */
/**
 * @typedef HTTP2HealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} host The value of the host header in the HTTP/2 health check request. If left empty (default value), the IP on behalf of which this health check is performed will be used.
 * @property {integer} port The TCP port number for the health check request. The default value is 443.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} requestPath The request path of the HTTP/2 health check request. The default value is /.
 * @property {string} response The string to match anywhere in the first 1024 bytes of the response body. If left empty (the default value), the status code determines health. The response data can only be ASCII.
 */
/**
 * @typedef HTTPHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} host The value of the host header in the HTTP health check request. If left empty (default value), the IP on behalf of which this health check is performed will be used.
 * @property {integer} port The TCP port number for the health check request. The default value is 80.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} requestPath The request path of the HTTP health check request. The default value is /.
 * @property {string} response The string to match anywhere in the first 1024 bytes of the response body. If left empty (the default value), the status code determines health. The response data can only be ASCII.
 */
/**
 * @typedef HTTPSHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} host The value of the host header in the HTTPS health check request. If left empty (default value), the IP on behalf of which this health check is performed will be used.
 * @property {integer} port The TCP port number for the health check request. The default value is 443.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} requestPath The request path of the HTTPS health check request. The default value is /.
 * @property {string} response The string to match anywhere in the first 1024 bytes of the response body. If left empty (the default value), the status code determines health. The response data can only be ASCII.
 */
/**
 * @typedef HealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} checkIntervalSec How often (in seconds) to send a health check. The default value is 5 seconds.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in 3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {integer} healthyThreshold A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.
 * @property {compute(alpha).HTTP2HealthCheck} http2HealthCheck 
 * @property {compute(alpha).HTTPHealthCheck} httpHealthCheck 
 * @property {compute(alpha).HTTPSHealthCheck} httpsHealthCheck 
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind Type of the resource.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {compute(alpha).SSLHealthCheck} sslHealthCheck 
 * @property {compute(alpha).TCPHealthCheck} tcpHealthCheck 
 * @property {integer} timeoutSec How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have greater value than checkIntervalSec.
 * @property {string} type Specifies the type of the healthCheck, either TCP, SSL, HTTP or HTTPS. If not specified, the default is TCP. Exactly one of the protocol-specific health check field must be specified, which must match type field.
 * @property {compute(alpha).UDPHealthCheck} udpHealthCheck 
 * @property {integer} unhealthyThreshold A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.
 */
/**
 * @typedef HealthCheckList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).HealthCheck[]} items A list of HealthCheck resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef HealthCheckReference
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} healthCheck 
 */
/**
 * @typedef HealthStatus
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} healthState Health state of the instance.
 * @property {string} instance URL of the instance resource.
 * @property {string} ipAddress The IP address represented by this resource.
 * @property {integer} port The port on the instance.
 */
/**
 * @typedef Host
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description [Output Only] An optional textual description of the resource.
* @property {string} hostType Full or partial URL of the host type resource to use for this host, in the format: zones/zone/hostTypes/host-type. This is provided by the client when the host is created. For example, the following is a valid partial url to a predefined host type:

zones/us-central1-f/hostTypes/n1-host-64-416
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string[]} instances A list of resource URLs to the virtual machine instances in this host. They must live in zones contained in the same region as this host.
* @property {string} kind [Output Only] The type of the resource. Always compute#host for host.
* @property {string} name The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} status [Output Only] The status of the host. One of the following values: CREATING, READY, REPAIR, and DELETING.
* @property {string} statusMessage [Output Only] An optional, human-readable explanation of the status.
* @property {string} zone [Output Only] The name of the zone where the host resides, such as us-central1-a.
*/
/**
 * @typedef HostAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped host lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#hostAggregatedList for aggregated lists of hosts.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef HostList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Host[]} items [Output Only] A list of Host resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#hostList for lists of hosts.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef HostRule
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string[]} hosts The list of host patterns to match. They must be valid hostnames, except * will match any string of ([a-z0-9-.]*). In that case, * must be the first character and must be followed in the pattern by either - or ..
 * @property {string} pathMatcher The name of the PathMatcher to use to match the path portion of the URL if the hostRule matches the URL&#39;s host portion.
 */
/**
 * @typedef HostsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Host[]} hosts [Output Only] List of hosts contained in this scope.
 * @property {object} warning [Output Only] An informational warning that appears when the host list is empty.
 */
/**
 * @typedef HttpHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} checkIntervalSec How often (in seconds) to send a health check. The default value is 5 seconds.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {integer} healthyThreshold A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.
 * @property {string} host The value of the host header in the HTTP health check request. If left empty (default value), the public IP on behalf of which this health check is performed will be used.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#httpHealthCheck for HTTP health checks.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {integer} port The TCP port number for the HTTP health check request. The default value is 80.
 * @property {string} requestPath The request path of the HTTP health check request. The default value is /.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {integer} timeoutSec How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have greater value than checkIntervalSec.
 * @property {integer} unhealthyThreshold A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.
 */
/**
 * @typedef HttpHealthCheckList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {compute(alpha).HttpHealthCheck[]} items A list of HttpHealthCheck resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef HttpsHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} checkIntervalSec How often (in seconds) to send a health check. The default value is 5 seconds.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {integer} healthyThreshold A so-far unhealthy instance will be marked healthy after this many consecutive successes. The default value is 2.
 * @property {string} host The value of the host header in the HTTPS health check request. If left empty (default value), the public IP on behalf of which this health check is performed will be used.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind Type of the resource.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {integer} port The TCP port number for the HTTPS health check request. The default value is 443.
 * @property {string} requestPath The request path of the HTTPS health check request. The default value is &quot;/&quot;.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {integer} timeoutSec How long (in seconds) to wait before claiming failure. The default value is 5 seconds. It is invalid for timeoutSec to have a greater value than checkIntervalSec.
 * @property {integer} unhealthyThreshold A so-far healthy instance will be marked unhealthy after this many consecutive failures. The default value is 2.
 */
/**
 * @typedef HttpsHealthCheckList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {compute(alpha).HttpsHealthCheck[]} items A list of HttpsHealthCheck resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef Image
 * @memberOf! compute(alpha)
 * @type object
* @property {string} archiveSizeBytes Size of the image tar.gz archive stored in Google Cloud Storage (in bytes).
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {compute(alpha).DeprecationStatus} deprecated The deprecation status associated with this image.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} diskSizeGb Size of the image when restored onto a persistent disk (in GB).
* @property {string} family The name of the image family to which this image belongs. You can create disks by specifying an image family instead of a specific image name. The image family always returns its latest image that is not deprecated. The name of the image family must comply with RFC1035.
* @property {compute(alpha).GuestOsFeature[]} guestOsFeatures A list of features to enable on the guest OS. Applicable for bootable images only. Currently, only one feature can be enabled, VIRTIO_SCSCI_MULTIQUEUE, which allows each virtual CPU to have its own queue. For Windows images, you can only enable VIRTIO_SCSCI_MULTIQUEUE on images with driver version 1.2.0.1621 or higher. Linux images with kernel versions 3.17 and higher will support VIRTIO_SCSCI_MULTIQUEUE.

For new Windows images, the server might also populate this field with the value WINDOWS, to indicate that this is a Windows image. This value is purely informational and does not enable or disable any features.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {compute(alpha).CustomerEncryptionKey} imageEncryptionKey Encrypts the image using a customer-supplied encryption key.

After you encrypt an image with a customer-supplied key, you must provide the same key if you use the image later (e.g. to create a disk from the image).

Customer-supplied encryption keys do not protect access to metadata of the disk.

If you do not provide an encryption key when creating the image, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the image later.
* @property {string} kind [Output Only] Type of the resource. Always compute#image for images.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this image, which is essentially a hash of the labels used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve an image.
* @property {object} labels Labels to apply to this image. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string[]} licenses Any applicable license URI.
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {object} rawDisk The parameters of the raw disk image.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} sourceDisk URL of the source disk used to create this image. This can be a full or valid partial URL. You must provide either this property or the rawDisk.source property but not both to create an image. For example, the following are valid values:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk 
- projects/project/zones/zone/disks/disk 
- zones/zone/disks/disk
* @property {compute(alpha).CustomerEncryptionKey} sourceDiskEncryptionKey The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.
* @property {string} sourceDiskId The ID value of the disk used to create this image. This value may be used to determine whether the image was taken from the current or a previous instance of a given disk name.
* @property {string} sourceType The type of the image used to create this disk. The default and only value is RAW
* @property {string} status [Output Only] The status of the image. An image can be used to create other resources, such as instances, only after the image has been successfully created and the status is set to READY. Possible values are FAILED, PENDING, or READY.
*/
/**
 * @typedef ImageList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Image[]} items [Output Only] A list of Image resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef Instance
 * @memberOf! compute(alpha)
 * @type object
* @property {boolean} canIpForward Allows this instance to send and receive packets with non-matching destination or source IPs. This is required if you plan to use this instance to forward routes. For more information, see Enabling IP Forwarding.
* @property {string} cpuPlatform [Output Only] The CPU platform used by this instance.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {compute(alpha).AttachedDisk[]} disks Array of disks associated with this instance. Persistent disks must be created before you can assign them.
* @property {string} host Full or partial URL of the host resource that the instance should be placed on, in the format: zones/zone/hosts/host.

Optional, Private Host (physical machine) that the instance will be placed on when it&#39;s created. The instance is guaranteed to be placed on the same machine as other instances with the same private host.

The request will be rejected if the private host has run out of resources.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {compute(alpha).CustomerEncryptionKey} instanceEncryptionKey Encrypts or decrypts data for an instance with a customer-supplied encryption key.

If you are creating a new instance, this field encrypts the local SSD and in-memory contents of the instance using a key that you provide.

If you are restarting an instance protected with a customer-supplied encryption key, you must provide the correct key in order to successfully restart the instance.

If you do not provide an encryption key when creating the instance, then the local SSD and in-memory contents will be encrypted using an automatically generated key and you do not need to provide a key to start the instance later.

Instance templates do not store customer-supplied encryption keys, so you cannot use your own keys to encrypt local SSDs and in-memory content in a managed instance group.
* @property {string} kind [Output Only] Type of the resource. Always compute#instance for instances.
* @property {string} labelFingerprint A fingerprint for this request, which is essentially a hash of the metadata&#39;s contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata.

To see the latest fingerprint, make get() request to the instance.
* @property {object} labels Labels to apply to this instance. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string} machineType Full or partial URL of the machine type resource to use for this instance, in the format: zones/zone/machineTypes/machine-type. This is provided by the client when the instance is created. For example, the following is a valid partial url to a predefined machine type:

zones/us-central1-f/machineTypes/n1-standard-1 

To create a custom machine type, provide a URL to a machine type in the following format, where CPUS is 1 or an even number up to 32 (2, 4, 6, ... 24, etc), and MEMORY is the total memory for this instance. Memory must be a multiple of 256 MB and must be supplied in MB (e.g. 5 GB of memory is 5120 MB):

zones/zone/machineTypes/custom-CPUS-MEMORY 

For example: zones/us-central1-f/machineTypes/custom-4-5120 

For a full list of restrictions, read the Specifications for custom machine types.
* @property {compute(alpha).Metadata} metadata The metadata key/value pairs assigned to this instance. This includes custom metadata and predefined keys.
* @property {string} name The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {compute(alpha).NetworkInterface[]} networkInterfaces An array of configurations for this interface. This specifies how this interface is configured to interact with other network services, such as connecting to the internet. Only one interface is supported per instance.
* @property {compute(alpha).Scheduling} scheduling Scheduling options for this instance.
* @property {string} selfLink [Output Only] Server-defined URL for this resource.
* @property {compute(alpha).ServiceAccount[]} serviceAccounts A list of service accounts, with their specified scopes, authorized for this instance. Service accounts generate access tokens that can be accessed through the metadata server and used to authenticate applications on the instance. See Service Accounts for more information.
* @property {string} status [Output Only] The status of the instance. One of the following values: PROVISIONING, STAGING, RUNNING, STOPPING, SUSPENDING, SUSPENDED, and TERMINATED.
* @property {string} statusMessage [Output Only] An optional, human-readable explanation of the status.
* @property {compute(alpha).Tags} tags A list of tags to apply to this instance. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during instance creation. The tags can be later modified by the setTags method. Each tag within the list must comply with RFC1035.
* @property {string} zone [Output Only] URL of the zone where the instance resides.
*/
/**
 * @typedef InstanceAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped instance lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#instanceAggregatedList for aggregated lists of Instance resources.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef InstanceGroup
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] The creation timestamp for this instance group in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} fingerprint [Output Only] The fingerprint of the named ports. The system uses this fingerprint to detect conflicts when multiple users change the named ports concurrently.
* @property {string} id [Output Only] A unique identifier for this instance group, generated by the server.
* @property {string} kind [Output Only] The resource type, which is always compute#instanceGroup for instance groups.
* @property {string} name The name of the instance group. The name must be 1-63 characters long, and comply with RFC1035.
* @property {compute(alpha).NamedPort[]} namedPorts Assigns a name to a port number. For example: {name: &quot;http&quot;, port: 80}

This allows the system to reference ports by the assigned name instead of a port number. Named ports can also contain multiple ports. For example: [{name: &quot;http&quot;, port: 80},{name: &quot;http&quot;, port: 8080}] 

Named ports apply to all instances in this instance group.
* @property {string} network The URL of the network to which all instances in the instance group belong.
* @property {string} region The URL of the region where the instance group is located (for regional resources).
* @property {string} selfLink [Output Only] The URL for this instance group. The server generates this URL.
* @property {integer} size [Output Only] The total number of instances in the instance group.
* @property {string} subnetwork The URL of the subnetwork to which all instances in the instance group belong.
* @property {string} zone [Output Only] The URL of the zone where the instance group is located (for zonal resources).
*/
/**
 * @typedef InstanceGroupAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this aggregated list of instance groups. The server generates this identifier.
 * @property {object} items A map of scoped instance group lists.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupAggregatedList for aggregated lists of instance groups.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this resource type. The server generates this URL.
 */
/**
 * @typedef InstanceGroupList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this list of instance groups. The server generates this identifier.
 * @property {compute(alpha).InstanceGroup[]} items A list of instance groups.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupList for instance group lists.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this resource type. The server generates this URL.
 */
/**
 * @typedef InstanceGroupManager
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceGroupManagerAutoHealingPolicy[]} autoHealingPolicies The autohealing policy for this managed instance group. You can specify only one value.
 * @property {string} baseInstanceName The base instance name to use for instances in this group. The value must be 1-58 characters long. Instances are named by appending a hyphen and a random four-character string to the base instance name. The base instance name must comply with RFC1035.
 * @property {string} creationTimestamp [Output Only] The creation timestamp for this managed instance group in RFC3339 text format.
 * @property {compute(alpha).InstanceGroupManagerActionsSummary} currentActions [Output Only] The list of instance actions and the number of instances in this managed instance group that are scheduled for each of those actions.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} failoverAction The action to perform in case of zone failure. Only one value is supported, NO_FAILOVER. The default is NO_FAILOVER.
 * @property {string} fingerprint [Output Only] The fingerprint of the resource data. You can use this optional field for optimistic locking when you update the resource.
 * @property {string} id [Output Only] A unique identifier for this resource type. The server generates this identifier.
 * @property {string} instanceGroup [Output Only] The URL of the Instance Group resource.
 * @property {string} instanceTemplate The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupManager for managed instance groups.
 * @property {string} name The name of the managed instance group. The name must be 1-63 characters long, and comply with RFC1035.
 * @property {compute(alpha).NamedPort[]} namedPorts Named ports configured for the Instance Groups complementary to this Instance Group Manager.
 * @property {compute(alpha).InstanceGroupManagerPendingActionsSummary} pendingActions [Output Only] The list of instance actions and the number of instances in this managed instance group that are pending for each of those actions.
 * @property {string} region [Output Only] The URL of the region where the managed instance group resides (for regional resources).
 * @property {string} selfLink [Output Only] The URL for this managed instance group. The server defines this URL.
 * @property {string} serviceAccount Service account will be used as credentials for all operations performed by managed instance group on instances. The service accounts needs all permissions required to create and delete instances. When not specified, the service account {projectNumber}@cloudservices.gserviceaccount.com will be used.
 * @property {string[]} targetPools The URLs for all TargetPool resources to which instances in the instanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.
 * @property {integer} targetSize The target number of running instances for this managed instance group. Deleting or abandoning instances reduces this number. Resizing the group changes this number.
 * @property {compute(alpha).InstanceGroupManagerUpdatePolicy} updatePolicy The update policy for this managed instance group.
 * @property {compute(alpha).InstanceGroupManagerVersion[]} versions Versions supported by this IGM. User should set this field if they need fine-grained control over how many instances in each version are run by this IGM. Versions are keyed by instanceTemplate. Every instanceTemplate can appear at most once. This field overrides instanceTemplate field. If both instanceTemplate and versions are set, the user receives a warning. &quot;instanceTemplate: X&quot; is semantically equivalent to &quot;versions [ { instanceTemplate: X } ]&quot;. Exactly one version must have targetSize field left unset. Size of such a version will be calculated automatically.
 * @property {string} zone [Output Only] The URL of the zone where the managed instance group is located (for zonal resources).
 */
/**
 * @typedef InstanceGroupManagerActionsSummary
 * @memberOf! compute(alpha)
 * @type object
* @property {integer} abandoning [Output Only] The total number of instances in the managed instance group that are scheduled to be abandoned. Abandoning an instance removes it from the managed instance group without deleting it.
* @property {integer} creating [Output Only] The number of instances in the managed instance group that are scheduled to be created or are currently being created. If the group fails to create any of these instances, it tries again until it creates the instance successfully.

If you have disabled creation retries, this field will not be populated; instead, the creatingWithoutRetries field will be populated.
* @property {integer} creatingWithoutRetries [Output Only] The number of instances that the managed instance group will attempt to create. The group attempts to create each instance only once. If the group fails to create any of these instances, it decreases the group&#39;s targetSize value accordingly.
* @property {integer} deleting [Output Only] The number of instances in the managed instance group that are scheduled to be deleted or are currently being deleted.
* @property {integer} none [Output Only] The number of instances in the managed instance group that are running and have no scheduled actions.
* @property {integer} recreating [Output Only] The number of instances in the managed instance group that are scheduled to be recreated or are currently being being recreated. Recreating an instance deletes the existing root persistent disk and creates a new disk from the image that is defined in the instance template.
* @property {integer} refreshing [Output Only] The number of instances in the managed instance group that are being reconfigured with properties that do not require a restart or a recreate action. For example, setting or removing target pools for the instance.
* @property {integer} restarting [Output Only] The number of instances in the managed instance group that are scheduled to be restarted or are currently being restarted.
* @property {integer} verifying [Output Only] The number of instances in the managed instance group that are being verified.
*/
/**
 * @typedef InstanceGroupManagerAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this aggregated list of managed instance groups. The server generates this identifier.
 * @property {object} items [Output Only] A map of filtered managed instance group lists.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupManagerAggregatedList for an aggregated list of managed instance groups.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this resource type. The server generates this URL.
 */
/**
 * @typedef InstanceGroupManagerAutoHealingPolicy
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} healthCheck The URL for the health check that signals autohealing.
 * @property {integer} initialDelaySec The number of seconds that the managed instance group waits before it applies autohealing policies to new instances or recently recreated instances. This initial delay allows instances to initialize and run their startup scripts before the instance group determines that they are UNHEALTHY. This prevents the managed instance group from recreating its instances prematurely. This value must be from range [0, 3600].
 * @property {compute(alpha).FixedOrPercent} maxUnavailable Maximum number of instances that can be unavailable when auto-healing. The instance is considered available if all of the following conditions are satisfied: 1. instance&#39;s status is RUNNING 2. instance&#39;s liveness health check result was observed to be HEALTHY at least once By default, a percent value of 100% is used.
 */
/**
 * @typedef InstanceGroupManagerList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this resource type. The server generates this identifier.
 * @property {compute(alpha).InstanceGroupManager[]} items [Output Only] A list of managed instance groups.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupManagerList for a list of managed instance groups.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef InstanceGroupManagerPendingActionsSummary
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} creating [Output Only] The number of instances in the managed instance group that are pending to be created.
 * @property {integer} deleting [Output Only] The number of instances in the managed instance group that are pending to be deleted.
 * @property {integer} recreating [Output Only] The number of instances in the managed instance group that are pending to be recreated.
 * @property {integer} restarting [Output Only] The number of instances in the managed instance group that are pending to be restarted.
 */
/**
 * @typedef InstanceGroupManagerUpdatePolicy
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).FixedOrPercent} maxSurge Maximum number of instances that can be created above the InstanceGroupManager.targetSize during the update process. By default, a fixed value of 1 is used. Using maxSurge &gt; 0 will cause instance names to change during the update process. At least one of { maxSurge, maxUnavailable } must be greater than 0.
 * @property {compute(alpha).FixedOrPercent} maxUnavailable Maximum number of instances that can be unavailable during the update process. The instance is considered available if all of the following conditions are satisfied: 1. instance&#39;s status is RUNNING 2. instance&#39;s liveness health check result was observed to be HEALTHY at least once By default, a fixed value of 1 is used. At least one of { maxSurge, maxUnavailable } must be greater than 0.
 * @property {integer} minReadySec Minimum number of seconds to wait for after a newly created instance becomes available. This value must be from range [0, 3600].
 * @property {string} minimalAction Minimal action to be taken on an instance. The order of action types is: RESTART &lt; REPLACE.
 * @property {string} type 
 */
/**
 * @typedef InstanceGroupManagerVersion
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instanceTemplate 
 * @property {string} tag Tag describing the version. Used to trigger rollout of a target version even if instance_template remains unchanged.
 * @property {compute(alpha).FixedOrPercent} targetSize Intended number of instances that are created from instanceTemplate. The final number of instances created from instanceTemplate will be equal to: * if expressed as fixed number: min(targetSize.fixed, instanceGroupManager.targetSize), * if expressed as percent: ceiling(targetSize.percent * InstanceGroupManager.targetSize). If unset, this version will handle all the remaining instances.
 */
/**
 * @typedef InstanceGroupManagersAbandonInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The URL for one or more instances to abandon from the managed instance group.
 */
/**
 * @typedef InstanceGroupManagersDeleteInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The list of instances to delete from this managed instance group. Specify one or more instance URLs.
 */
/**
 * @typedef InstanceGroupManagersListManagedInstancesResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).ManagedInstance[]} managedInstances [Output Only] The list of instances in the managed instance group.
 */
/**
 * @typedef InstanceGroupManagersRecreateInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The URL for one or more instances to recreate.
 */
/**
 * @typedef InstanceGroupManagersResizeAdvancedRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {boolean} noCreationRetries If this flag is true, the managed instance group attempts to create all instances initiated by this resize request only once. If there is an error during creation, the managed instance group does not retry create this instance, and we will decrease the targetSize of the request instead. If the flag is false, the group attemps to recreate each instance continuously until it succeeds.

This flag matters only in the first attempt of creation of an instance. After an instance is successfully created while this flag is enabled, the instance behaves the same way as all the other instances created with a regular resize request. In particular, if a running instance dies unexpectedly at a later time and needs to be recreated, this mode does not affect the recreation behavior in that scenario.

This flag is applicable only to the current resize request. It does not influence other resize requests in any way.

You can see which instances is being creating in which mode by calling the get or listManagedInstances API.
* @property {integer} targetSize The number of running instances that the managed instance group should maintain at any given time. The group automatically adds or removes instances to maintain the number of instances specified by this parameter.
*/
/**
 * @typedef InstanceGroupManagersScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceGroupManager[]} instanceGroupManagers [Output Only] The list of managed instance groups that are contained in the specified project and zone.
 * @property {object} warning [Output Only] The warning that replaces the list of managed instance groups when the list is empty.
 */
/**
 * @typedef InstanceGroupManagersSetAutoHealingRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceGroupManagerAutoHealingPolicy[]} autoHealingPolicies 
 */
/**
 * @typedef InstanceGroupManagersSetInstanceTemplateRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instanceTemplate The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group.
 */
/**
 * @typedef InstanceGroupManagersSetTargetPoolsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} fingerprint The fingerprint of the target pools information. Use this optional property to prevent conflicts when multiple users change the target pools settings concurrently. Obtain the fingerprint with the instanceGroupManagers.get method. Then, include the fingerprint in your request to ensure that you do not overwrite changes that were applied from another concurrent request.
 * @property {string[]} targetPools The list of target pool URLs that instances in this managed instance group belong to. The managed instance group applies these target pools to all of the instances in the group. Existing instances and new instances in the group all receive these target pool settings.
 */
/**
 * @typedef InstanceGroupsAddInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceReference[]} instances The list of instances to add to the instance group.
 */
/**
 * @typedef InstanceGroupsListInstances
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this list of instances in the specified instance group. The server generates this identifier.
 * @property {compute(alpha).InstanceWithNamedPorts[]} items [Output Only] A list of instances and any named ports that are assigned to those instances.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupsListInstances for the list of instances in the specified instance group.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this list of instances in the specified instance groups. The server generates this URL.
 */
/**
 * @typedef InstanceGroupsListInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instanceState A filter for the state of the instances in the instance group. Valid options are ALL or RUNNING. If you do not specify this parameter the list includes all instances regardless of their state.
 */
/**
 * @typedef InstanceGroupsRemoveInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceReference[]} instances The list of instances to remove from the instance group.
 */
/**
 * @typedef InstanceGroupsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceGroup[]} instanceGroups [Output Only] The list of instance groups that are contained in this scope.
 * @property {object} warning [Output Only] An informational warning that replaces the list of instance groups when the list is empty.
 */
/**
 * @typedef InstanceGroupsSetNamedPortsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} fingerprint The fingerprint of the named ports information for this instance group. Use this optional property to prevent conflicts when multiple users change the named ports settings concurrently. Obtain the fingerprint with the instanceGroups.get method. Then, include the fingerprint in your request to ensure that you do not overwrite changes that were applied from another concurrent request.
 * @property {compute(alpha).NamedPort[]} namedPorts The list of named ports to set for this instance group.
 */
/**
 * @typedef InstanceList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Instance[]} items [Output Only] A list of instances.
 * @property {string} kind [Output Only] Type of resource. Always compute#instanceList for lists of Instance resources.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef InstanceMoveRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {string} destinationZone The URL of the destination zone to move the instance. This can be a full or partial URL. For example, the following are all valid URLs to a zone:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone 
- projects/project/zones/zone 
- zones/zone
* @property {string} targetInstance The URL of the target instance to move. This can be a full or partial URL. For example, the following are all valid URLs to an instance:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance 
- projects/project/zones/zone/instances/instance 
- zones/zone/instances/instance
*/
/**
 * @typedef InstanceProperties
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} canIpForward Enables instances created based on this template to send packets with source IP addresses other than their own and receive packets with destination IP addresses other than their own. If these instances will be used as an IP gateway or it will be set as the next-hop in a Route resource, specify true. If unsure, leave this set to false. See the Enable IP forwarding for instances documentation for more information.
 * @property {string} description An optional text description for the instances that are created from this instance template.
 * @property {compute(alpha).AttachedDisk[]} disks An array of disks that are associated with the instances that are created from this template.
 * @property {object} labels Labels to apply to instances that are created from this template. Each label key/value pair must comply with RFC1035. Label values may be empty.
 * @property {string} machineType The machine type to use for instances that are created from this template.
 * @property {compute(alpha).Metadata} metadata The metadata key/value pairs to assign to instances that are created from this template. These pairs can consist of custom metadata or predefined keys. See Project and instance metadata for more information.
 * @property {compute(alpha).NetworkInterface[]} networkInterfaces An array of network access configurations for this interface.
 * @property {compute(alpha).Scheduling} scheduling Specifies the scheduling options for the instances that are created from this template.
 * @property {compute(alpha).ServiceAccount[]} serviceAccounts A list of service accounts with specified scopes. Access tokens for these service accounts are available to the instances that are created from this template. Use metadata queries to obtain the access tokens for these instances.
 * @property {compute(alpha).Tags} tags A list of tags to apply to the instances that are created from this template. The tags identify valid sources or targets for network firewalls. The setTags method can modify this list of tags. Each tag within the list must comply with RFC1035.
 */
/**
 * @typedef InstanceReference
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instance The URL for a specific instance.
 */
/**
 * @typedef InstanceTemplate
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] The creation timestamp for this instance template in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] A unique identifier for this instance template. The server defines this identifier.
* @property {string} kind [Output Only] The resource type, which is always compute#instanceTemplate for instance templates.
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {compute(alpha).InstanceProperties} properties The instance properties for this instance template.
* @property {string} selfLink [Output Only] The URL for this instance template. The server defines this URL.
* @property {string} sourceInstance The source instance used to create the template. You can provide this as a partial or full URL to the resource. For example, the following are valid values:  
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance 
- projects/project/zones/zone/instances/instance
*/
/**
 * @typedef InstanceTemplateList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] A unique identifier for this instance template. The server defines this identifier.
 * @property {compute(alpha).InstanceTemplate[]} items [Output Only] list of InstanceTemplate resources.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceTemplatesListResponse for instance template lists.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this instance template list. The server defines this URL.
 */
/**
 * @typedef InstanceWithNamedPorts
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instance [Output Only] The URL of the instance.
 * @property {compute(alpha).NamedPort[]} namedPorts [Output Only] The named ports that belong to this instance group.
 * @property {string} status [Output Only] The status of the instance.
 */
/**
 * @typedef InstancesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Instance[]} instances [Output Only] List of instances contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of instances when the list is empty.
 */
/**
 * @typedef InstancesSetLabelsRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {string} labelFingerprint Fingerprint of the previous set of labels for this resource, used to prevent conflicts. Provide the latest fingerprint value when making a request to add or change labels.
* @property {object} labels A list of labels to apply for this instance. Changing instance labels will also change the instance tags.

Each label key &amp; value must comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash. For example, &quot;webserver-frontend&quot;: &quot;images&quot;. A label value can also be empty (e.g. &quot;my-label&quot;: &quot;&quot;).
*/
/**
 * @typedef InstancesSetMachineTypeRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} machineType Full or partial URL of the machine type resource. See Machine Types for a full list of machine types. For example: zones/us-central1-f/machineTypes/n1-standard-1
 */
/**
 * @typedef InstancesSetServiceAccountRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} email Email address of the service account.
 * @property {string[]} scopes The list of scopes to be made available for this service account.
 */
/**
 * @typedef InstancesStartWithEncryptionKeyRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).CustomerEncryptionKeyProtectedDisk[]} disks Array of disks associated with this instance that are protected with a customer-supplied encryption key.

In order to start the instance, the disk url and its corresponding key must be provided.

If the disk is not protected with a customer-supplied encryption key it should not be specified.
* @property {compute(alpha).CustomerEncryptionKey} instanceEncryptionKey Decrypts data associated with an instance that is protected with a customer-supplied encryption key.

If the instance you are starting is protected with a customer-supplied encryption key, the correct key must be provided otherwise the instance start will not succeed.
*/
/**
 * @typedef License
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} chargesUseFee [Output Only] If true, the customer will be charged license fee for running software that contains this license on an instance.
 * @property {string} kind [Output Only] Type of resource. Always compute#license for licenses.
 * @property {string} licenseCode [Output Only] The unique code used to attach this license to images, snapshots, and disks.
 * @property {string} name [Output Only] Name of the resource. The name is 1-63 characters long and complies with RFC1035.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {boolean} transferable If false, licenses will not be copied from the source resource when creating an image from a disk, disk from snapshot, or snapshot from disk.
 */
/**
 * @typedef LogConfig
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).LogConfigCounterOptions} counter Counter options.
 */
/**
 * @typedef LogConfigCounterOptions
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} field The field value to attribute.
 * @property {string} metric The metric to update.
 */
/**
 * @typedef MachineType
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {compute(alpha).DeprecationStatus} deprecated [Output Only] The deprecation status associated with this machine type.
 * @property {string} description [Output Only] An optional textual description of the resource.
 * @property {integer} guestCpus [Output Only] The number of virtual CPUs that are available to the instance.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {boolean} isSharedCpu [Output Only] Whether this machine type has a shared CPU. See Shared-core machine types for more information.
 * @property {string} kind [Output Only] The type of the resource. Always compute#machineType for machine types.
 * @property {integer} maximumPersistentDisks [Output Only] Maximum persistent disks allowed.
 * @property {string} maximumPersistentDisksSizeGb [Output Only] Maximum total persistent disks size (GB) allowed.
 * @property {integer} memoryMb [Output Only] The amount of physical memory available to the instance, defined in MB.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} zone [Output Only] The name of the zone where the machine type resides, such as us-central1-a.
 */
/**
 * @typedef MachineTypeAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped machine type lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#machineTypeAggregatedList for aggregated lists of machine types.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef MachineTypeList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).MachineType[]} items [Output Only] A list of Machine Type resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#machineTypeList for lists of machine types.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef MachineTypesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).MachineType[]} machineTypes [Output Only] List of machine types contained in this scope.
 * @property {object} warning [Output Only] An informational warning that appears when the machine types list is empty.
 */
/**
 * @typedef ManagedInstance
 * @memberOf! compute(alpha)
 * @type object
* @property {string} currentAction [Output Only] The current action that the managed instance group has scheduled for the instance. Possible values: 
- NONE The instance is running, and the managed instance group does not have any scheduled actions for this instance. 
- CREATING The managed instance group is creating this instance. If the group fails to create this instance, it will try again until it is successful. 
- CREATING_WITHOUT_RETRIES The managed instance group is attempting to create this instance only once. If the group fails to create this instance, it does not try again and the group&#39;s targetSize value is decreased instead. 
- RECREATING The managed instance group is recreating this instance. 
- DELETING The managed instance group is permanently deleting this instance. 
- ABANDONING The managed instance group is abandoning this instance. The instance will be removed from the instance group and from any target pools that are associated with this group. 
- RESTARTING The managed instance group is restarting the instance. 
- REFRESHING The managed instance group is applying configuration changes to the instance without stopping it. For example, the group can update the target pool list for an instance without stopping that instance.
* @property {string} id [Output only] The unique identifier for this resource. This field is empty when instance does not exist.
* @property {string} instance [Output Only] The URL of the instance. The URL can exist even if the instance has not yet been created.
* @property {string} instanceStatus [Output Only] The status of the instance. This field is empty when the instance does not exist.
* @property {string} instanceTemplate [Output Only] The intended template of the instance. This field is empty when current_action is one of { DELETING, ABANDONING }.
* @property {compute(alpha).ManagedInstanceLastAttempt} lastAttempt [Output Only] Information about the last attempt to create or delete the instance.
* @property {string} standbyMode [Output Only] Standby mode of the instance. This field is non-empty iff the instance is a standby.
* @property {string} tag [Output Only] Tag describing the version.
*/
/**
 * @typedef ManagedInstanceLastAttempt
 * @memberOf! compute(alpha)
 * @type object
 * @property {object} errors [Output Only] Encountered errors during the last attempt to create or delete the instance.
 */
/**
 * @typedef Metadata
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} fingerprint Specifies a fingerprint for this request, which is essentially a hash of the metadata&#39;s contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata.
 * @property {object[]} items Array of key/value pairs. The total size of all keys and values must be less than 512 KB.
 * @property {string} kind [Output Only] Type of the resource. Always compute#metadata for metadata.
 */
/**
 * @typedef NamedPort
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} name The name for this named port. The name must be 1-63 characters long, and comply with RFC1035.
 * @property {integer} port The port number, which can be a value between 1 and 65535.
 */
/**
 * @typedef Network
 * @memberOf! compute(alpha)
 * @type object
* @property {string} IPv4Range The range of internal addresses that are legal on this network. This range is a CIDR specification, for example: 192.168.0.0/16. Provided by the client when the network is created.
* @property {boolean} autoCreateSubnetworks When set to true, the network is created in &quot;auto subnet mode&quot;. When set to false, the network is in &quot;custom subnet mode&quot;.

In &quot;auto subnet mode&quot;, a newly created network is assigned the default CIDR of 10.128.0.0/9 and it automatically creates one subnetwork per region.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} crossVmEncryption [Output Only] Type of VM-to-VM traffic encryption for this network.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} gatewayIPv4 A gateway address for default routing to other networks. This value is read only and is selected by the Google Compute Engine, typically as the first usable address in the IPv4Range.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#network for networks.
* @property {string} loadBalancerVmEncryption [Output Only] Type of LB-to-VM traffic encryption for this network.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {compute(alpha).NetworkPeering[]} peerings [Output Only] List of network peerings for the resource.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string[]} subnetworks [Output Only] Server-defined fully-qualified URLs for all subnetworks in this network.
*/
/**
 * @typedef NetworkInterface
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).AccessConfig[]} accessConfigs An array of configurations for this interface. Currently, only one access config, ONE_TO_ONE_NAT, is supported. If there are no accessConfigs specified, then this instance will have no external internet access.
* @property {compute(alpha).AliasIpRange[]} aliasIpRanges An array of alias IP ranges for this network interface. Can only be specified for network interfaces on subnet-mode networks.
* @property {string} name [Output Only] The name of the network interface, generated by the server. For network devices, these are eth0, eth1, etc.
* @property {string} network URL of the network resource for this instance. This is required for creating an instance but optional when creating a firewall rule. If not specified when creating a firewall rule, the default network is used:

global/networks/default 

If you specify this property, you can specify the network as a full or partial URL. For example, the following are all valid URLs:  
- https://www.googleapis.com/compute/v1/projects/project/global/networks/network 
- projects/project/global/networks/network 
- global/networks/default
* @property {string} networkIP An IPv4 internal network address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.
* @property {string} subnetwork The URL of the Subnetwork resource for this instance. If the network resource is in legacy mode, do not provide this property. If the network is in auto subnet mode, providing the subnetwork is optional. If the network is in custom subnet mode, then this field should be specified. If you specify this property, you can specify the subnetwork as a full or partial URL. For example, the following are all valid URLs:  
- https://www.googleapis.com/compute/v1/projects/project/regions/region/subnetworks/subnetwork 
- regions/region/subnetworks/subnetwork
*/
/**
 * @typedef NetworkList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Network[]} items [Output Only] A list of Network resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#networkList for lists of networks.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef NetworkPeering
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} autoCreateRoutes Whether full mesh connectivity is created and managed automatically. When it is set to true, Google Compute Engine will automatically create and manage the routes between two networks when the state is ACTIVE. Otherwise, user needs to create routes manually to route packets to peer network.
 * @property {string} name Name of this peering. Provided by the client when the peering is created. The name must comply with RFC1035. Specifically, the name must be 1-63 characters long and match regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all the following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} network The URL of the peer network. It can be either full URL or partial URL. The peer network may belong to a different project. If the partial URL does not contain project, it is assumed that the peer network is in the same project as the current network.
 * @property {string} state [Output Only] State for the peering.
 * @property {string} stateDetails [Output Only] Details about the current state of the peering.
 */
/**
 * @typedef NetworksAddPeeringRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} autoCreateRoutes Whether Google Compute Engine manages the routes automatically.
 * @property {string} name Name of the peering, which should conform to RFC1035.
 * @property {string} peerNetwork URL of the peer network. It can be either full URL or partial URL. The peer network may belong to a different project. If the partial URL does not contain project, it is assumed that the peer network is in the same project as the current network.
 */
/**
 * @typedef NetworksRemovePeeringRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} name Name of the peering, which should conform to RFC1035.
 */
/**
 * @typedef Operation
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} clientOperationId [Output Only] Reserved for future use.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description [Output Only] A textual description of the operation, which is set when the operation is created.
 * @property {string} endTime [Output Only] The time that this operation was completed. This value is in RFC3339 text format.
 * @property {object} error [Output Only] If errors are generated during processing of the operation, this field will be populated.
 * @property {string} httpErrorMessage [Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as NOT FOUND.
 * @property {integer} httpErrorStatusCode [Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a 404 means the resource was not found.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested. This value is in RFC3339 text format.
 * @property {string} kind [Output Only] Type of the resource. Always compute#operation for Operation resources.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType [Output Only] The type of operation, such as insert, update, or delete, and so on.
 * @property {integer} progress [Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.
 * @property {string} region [Output Only] The URL of the region where the operation resides. Only available when performing regional operations.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server. This value is in RFC3339 text format.
 * @property {string} status [Output Only] The status of the operation, which can be one of the following: PENDING, RUNNING, or DONE.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] The unique target ID, which identifies a specific incarnation of the target resource.
 * @property {string} targetLink [Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the persistent disk that the snapshot was created from.
 * @property {string} user [Output Only] User who requested the operation, for example: user@example.com.
 * @property {object[]} warnings [Output Only] If warning messages are generated during processing of the operation, this field will be populated.
 * @property {string} zone [Output Only] The URL of the zone where the operation resides. Only available when performing per-zone operations.
 */
/**
 * @typedef OperationAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped operation lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#operationAggregatedList for aggregated lists of operations.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef OperationList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Operation[]} items [Output Only] A list of Operation resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#operations for Operations resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef OperationsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Operation[]} operations [Output Only] List of operations contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of operations when the list is empty.
 */
/**
 * @typedef PathMatcher
 * @memberOf! compute(alpha)
 * @type object
* @property {string} defaultService The full or partial URL to the BackendService resource. This will be used if none of the pathRules defined by this PathMatcher is matched by the URL&#39;s path portion. For example, the following are all valid URLs to a BackendService resource:  
- https://www.googleapis.com/compute/v1/projects/project/global/backendServices/backendService 
- compute/v1/projects/project/global/backendServices/backendService 
- global/backendServices/backendService
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} name The name to which this PathMatcher is referred by the HostRule.
* @property {compute(alpha).PathRule[]} pathRules The list of path rules.
*/
/**
 * @typedef PathRule
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} paths The list of path patterns to match. Each must start with / and the only place a * is allowed is at the end following a /. The string fed to the path matcher does not include any text after the first ? or #, and those chars are not allowed here.
 * @property {string} service The URL of the BackendService resource if this rule is matched.
 */
/**
 * @typedef Policy
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).AuditConfig[]} auditConfigs Specifies audit logging configs for &quot;data access&quot;. &quot;data access&quot;: generally refers to data reads/writes and admin reads. &quot;admin activity&quot;: generally refers to admin writes.

Note: `AuditConfig` doesn&#39;t apply to &quot;admin activity&quot;, which always enables audit logging.
* @property {compute(alpha).Binding[]} bindings Associates a list of `members` to a `role`. Multiple `bindings` must not be specified for the same `role`. `bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing policy is overwritten blindly.
* @property {boolean} iamOwned 
* @property {compute(alpha).Rule[]} rules If more than one rule is specified, the rules are applied in the following manner: - All matching LOG rules are always applied. - If any DENY/DENY_WITH_LOG rule matches, permission is denied. Logging will be applied if one or more matching rule requires logging. - Otherwise, if any ALLOW/ALLOW_WITH_LOG rule matches, permission is granted. Logging will be applied if one or more matching rule requires logging. - Otherwise, if no rule applies, permission is denied.
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef Project
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Metadata} commonInstanceMetadata Metadata key/value pairs available to all instances contained in this project. See Custom metadata for more information.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} defaultServiceAccount [Output Only] Default service account used by VMs running in this project.
 * @property {string} description An optional textual description of the resource.
 * @property {string[]} enabledFeatures Restricted features enabled for use on this project.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server. This is not the project ID, and is just a unique ID used by Compute Engine to identify resources.
 * @property {string} kind [Output Only] Type of the resource. Always compute#project for projects.
 * @property {string} name The project ID. For example: my-example-project. Use the project ID to make requests to Compute Engine.
 * @property {compute(alpha).Quota[]} quotas [Output Only] Quotas assigned to this project.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {compute(alpha).UsageExportLocation} usageExportLocation The naming prefix for daily usage reports and the Google Cloud Storage bucket where they are stored.
 * @property {string} xpnProjectStatus [Output Only] The role this project has in a Cross Project Network (XPN) configuration. Currently only HOST projects are differentiated.
 */
/**
 * @typedef ProjectsDisableXpnResourceRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).XpnResourceId} xpnResource XPN resource ID.
 */
/**
 * @typedef ProjectsEnableXpnResourceRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).XpnResourceId} xpnResource XPN resource ID.
 */
/**
 * @typedef ProjectsGetXpnResources
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} kind [Output Only] Type of resource. Always compute#projectsGetXpnResources for lists of XPN resources.
 * @property {compute(alpha).XpnResourceId[]} resources XPN resources attached to this project as their XPN host.
 */
/**
 * @typedef ProjectsListXpnHostsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} organization Optional organization ID managed by Cloud Resource Manager, for which to list XPN host projects. If not specified, the organization will be inferred from the project.
 */
/**
 * @typedef ProjectsSetDefaultServiceAccountRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} email Email address of the service account.
 */
/**
 * @typedef Quota
 * @memberOf! compute(alpha)
 * @type object
 * @property {number} limit [Output Only] Quota limit for this metric.
 * @property {string} metric [Output Only] Name of the quota metric.
 * @property {number} usage [Output Only] Current usage of this metric.
 */
/**
 * @typedef Region
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {compute(alpha).DeprecationStatus} deprecated [Output Only] The deprecation status associated with this region.
 * @property {string} description [Output Only] Textual description of the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#region for regions.
 * @property {string} name [Output Only] Name of the resource.
 * @property {compute(alpha).Quota[]} quotas [Output Only] Quotas assigned to this region.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} status [Output Only] Status of the region, either UP or DOWN.
 * @property {string[]} zones [Output Only] A list of zones available in this region, in the form of resource URLs.
 */
/**
 * @typedef RegionAutoscalerList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Autoscaler[]} items A list of autoscalers.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef RegionDiskTypeList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).DiskType[]} items [Output Only] A list of Disk Type resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#regionDiskTypeList for region disk types.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef RegionDisksResizeRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} sizeGb The new size of the regional persistent disk, which is specified in GB.
 */
/**
 * @typedef RegionInstanceGroupList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).InstanceGroup[]} items A list of InstanceGroup resources.
 * @property {string} kind The resource type.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] The URL for this resource type. The server generates this URL.
 */
/**
 * @typedef RegionInstanceGroupManagerList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).InstanceGroupManager[]} items A list of managed instance groups.
 * @property {string} kind [Output Only] The resource type, which is always compute#instanceGroupManagerList for a list of managed instance groups that exist in th regional scope.
 * @property {string} nextPageToken [Output only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output only] The URL for this resource type. The server generates this URL.
 */
/**
 * @typedef RegionInstanceGroupManagersAbandonInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The names of one or more instances to abandon.
 */
/**
 * @typedef RegionInstanceGroupManagersDeleteInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The names of one or more instances to delete.
 */
/**
 * @typedef RegionInstanceGroupManagersListInstancesResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).ManagedInstance[]} managedInstances List of managed instances.
 */
/**
 * @typedef RegionInstanceGroupManagersRecreateRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} instances The URL for one or more instances to recreate.
 */
/**
 * @typedef RegionInstanceGroupManagersSetAutoHealingRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceGroupManagerAutoHealingPolicy[]} autoHealingPolicies 
 */
/**
 * @typedef RegionInstanceGroupManagersSetTargetPoolsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} fingerprint Fingerprint of the target pools information, which is a hash of the contents. This field is used for optimistic locking when you update the target pool entries. This field is optional.
 * @property {string[]} targetPools The URL of all TargetPool resources to which instances in the instanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.
 */
/**
 * @typedef RegionInstanceGroupManagersSetTemplateRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instanceTemplate URL of the InstanceTemplate resource from which all new instances will be created.
 */
/**
 * @typedef RegionInstanceGroupsListInstances
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {compute(alpha).InstanceWithNamedPorts[]} items A list of instances and any named ports that are assigned to those instances.
 * @property {string} kind The resource type.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef RegionInstanceGroupsListInstancesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} instanceState Instances in which state should be returned. Valid options are: &#39;ALL&#39;, &#39;RUNNING&#39;. By default, it lists all instances.
 * @property {string} portName Name of port user is interested in. It is optional. If it is set, only information about this ports will be returned. If it is not set, all the named ports will be returned. Always lists all instances.
 */
/**
 * @typedef RegionInstanceGroupsSetNamedPortsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} fingerprint The fingerprint of the named ports information for this instance group. Use this optional property to prevent conflicts when multiple users change the named ports settings concurrently. Obtain the fingerprint with the instanceGroups.get method. Then, include the fingerprint in your request to ensure that you do not overwrite changes that were applied from another concurrent request.
 * @property {compute(alpha).NamedPort[]} namedPorts The list of named ports to set for this instance group.
 */
/**
 * @typedef RegionList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Region[]} items [Output Only] A list of Region resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#regionList for lists of regions.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef RegionSetLabelsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} labelFingerprint The fingerprint of the previous set of labels for this resource, used to detect conflicts. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels. Make a get() request to the resource to get the latest fingerprint.
 * @property {object} labels The labels to set for this resource.
 */
/**
 * @typedef ResourceCommitment
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} amount The amount of the resource purchased (in a type-dependent unit, such as bytes).
 * @property {string} type Type of resource for which this commitment applies.
 */
/**
 * @typedef ResourceGroupReference
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} group A URI referencing one of the instance groups listed in the backend service.
 */
/**
 * @typedef Route
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} destRange The destination range of outgoing packets that this route applies to.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of this resource. Always compute#routes for Route resources.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} network Fully-qualified URL of the network that this route applies to.
* @property {string} nextHopGateway The URL to a gateway that should handle matching packets. You can only specify the internet gateway using a full or partial valid URL:  projects/&lt;project-id&gt;/global/gateways/default-internet-gateway
* @property {string} nextHopInstance The URL to an instance that should handle matching packets. You can specify this as a full or partial URL. For example:
https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/
* @property {string} nextHopIp The network IP address of an instance that should handle matching packets.
* @property {string} nextHopNetwork The URL of the local network if it should handle matching packets.
* @property {string} nextHopPeering [Output Only] The network peering name that should handle matching packets, which should conform to RFC1035.
* @property {string} nextHopVpnTunnel The URL to a VpnTunnel that should handle matching packets.
* @property {integer} priority The priority of this route. Priority is used to break ties in cases where there is more than one matching route of equal prefix length. In the case of two routes with equal prefix length, the one with the lowest-numbered priority value wins. Default value is 1000. Valid range is 0 through 65535.
* @property {string} selfLink [Output Only] Server-defined fully-qualified URL for this resource.
* @property {string[]} tags A list of instance tags to which this route applies.
* @property {object[]} warnings [Output Only] If potential misconfigurations are detected for this route, this field will be populated with warning messages.
*/
/**
 * @typedef RouteList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {compute(alpha).Route[]} items [Output Only] A list of Route resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef Router
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).RouterBgp} bgp BGP information specific to this router.
 * @property {compute(alpha).RouterBgpPeer[]} bgpPeers BGP information that needs to be configured into the routing stack to establish the BGP peering. It must specify peer ASN and either interface name, IP, or peer IP. Please refer to RFC4273.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).RouterInterface[]} interfaces Router interfaces. Each interface requires either one linked resource (e.g. linkedVpnTunnel), or IP address and IP address range (e.g. ipRange), or both.
 * @property {string} kind [Output Only] Type of resource. Always compute#router for routers.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} network URI of the network to which this router belongs.
 * @property {string} region [Output Only] URI of the region where the router resides.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef RouterAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items A map of scoped router lists.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef RouterBgp
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} asn Local BGP Autonomous System Number (ASN). Must be an RFC6996 private ASN, either 16-bit or 32-bit. The value will be fixed for this router resource. All VPN tunnels that link to this router will have the same local ASN.
 */
/**
 * @typedef RouterBgpPeer
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} advertisedRoutePriority The priority of routes advertised to this BGP peer. In the case where there is more than one matching route of maximum length, the routes with lowest priority value win.
 * @property {string} interfaceName Name of the interface the BGP peer is associated with.
 * @property {string} ipAddress IP address of the interface inside Google Cloud Platform.
 * @property {string} name Name of this BGP peer. The name must be 1-63 characters long and comply with RFC1035.
 * @property {integer} peerAsn Peer BGP Autonomous System Number (ASN). For VPN use case, this value can be different for every tunnel.
 * @property {string} peerIpAddress IP address of the BGP interface outside Google cloud.
 */
/**
 * @typedef RouterInterface
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} ipRange IP address and range of the interface. The IP range must be in the RFC3927 link-local IP space. The value must be a CIDR-formatted string, for example: 169.254.0.1/30. NOTE: Do not truncate the address as it represents the IP address of the interface.
 * @property {string} linkedVpnTunnel URI of linked VPN tunnel. It must be in the same region as the router. Each interface can have at most one linked resource.
 * @property {string} name Name of this interface entry. The name must be 1-63 characters long and comply with RFC1035.
 */
/**
 * @typedef RouterList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Router[]} items A list of Router resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#router for routers.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef RouterStatus
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Route[]} bestRoutes Best routes for this router&#39;s network.
 * @property {compute(alpha).RouterStatusBgpPeerStatus[]} bgpPeerStatus 
 * @property {string} network URI of the network to which this router belongs.
 */
/**
 * @typedef RouterStatusBgpPeerStatus
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Route[]} advertisedRoutes Routes that were advertised to the remote BGP peer
 * @property {string} ipAddress IP address of the local BGP interface.
 * @property {string} linkedVpnTunnel URL of the VPN tunnel that this BGP peer controls.
 * @property {string} name Name of this BGP peer. Unique within the Routers resource.
 * @property {integer} numLearnedRoutes Number of routes learned from the remote BGP Peer.
 * @property {string} peerIpAddress IP address of the remote BGP interface.
 * @property {string} state BGP state as specified in RFC1771.
 * @property {string} status Status of the BGP peer: {UP, DOWN}
 * @property {string} uptime Time this session has been up. Format: 14 years, 51 weeks, 6 days, 23 hours, 59 minutes, 59 seconds
 * @property {string} uptimeSeconds Time this session has been up, in seconds. Format: 145
 */
/**
 * @typedef RouterStatusResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} kind Type of resource.
 * @property {compute(alpha).RouterStatus} result 
 */
/**
 * @typedef RoutersPreviewResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Router} resource Preview of given router.
 */
/**
 * @typedef RoutersScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Router[]} routers List of routers contained in this scope.
 * @property {object} warning Informational warning which replaces the list of routers when the list is empty.
 */
/**
 * @typedef Rule
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} action Required
 * @property {compute(alpha).Condition[]} conditions Additional restrictions that must be met
 * @property {string} description Human-readable description of the rule.
 * @property {string[]} ins If one or more &#39;in&#39; clauses are specified, the rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is in at least one of these entries.
 * @property {compute(alpha).LogConfig[]} logConfigs The config returned to callers of tech.iam.IAM.CheckPolicy for any entries that match the LOG action.
 * @property {string[]} notIns If one or more &#39;not_in&#39; clauses are specified, the rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is in none of the entries.
 * @property {string[]} permissions A permission is a string of form &#39;..&#39; (e.g., &#39;storage.buckets.list&#39;). A value of &#39;*&#39; matches all permissions, and a verb part of &#39;*&#39; (e.g., &#39;storage.buckets.*&#39;) matches all verbs.
 */
/**
 * @typedef SSLHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} port The TCP port number for the health check request. The default value is 443.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} request The application data to send once the SSL connection has been established (default value is empty). If both request and response are empty, the connection establishment alone will indicate health. The request data can only be ASCII.
 * @property {string} response The bytes to match against the beginning of the response data. If left empty (the default value), any response will indicate health. The response data can only be ASCII.
 */
/**
 * @typedef Scheduling
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} automaticRestart Specifies whether the instance should be automatically restarted if it is terminated by Compute Engine (not terminated by a user). You can only set the automatic restart option for standard instances. Preemptible instances cannot be automatically restarted.
 * @property {string} onHostMaintenance Defines the maintenance behavior for this instance. For standard instances, the default behavior is MIGRATE. For preemptible instances, the default and only possible behavior is TERMINATE. For more information, see Setting Instance Scheduling Options.
 * @property {boolean} preemptible Whether the instance is preemptible.
 */
/**
 * @typedef SerialPortOutput
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} contents [Output Only] The contents of the console output.
 * @property {string} kind [Output Only] Type of the resource. Always compute#serialPortOutput for serial port output.
 * @property {string} next [Output Only] The position of the next byte of content from the serial console output. Use this value in the next request as the start parameter.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 * @property {string} start [Output Only] The starting byte position of the output that was returned. This should match the start parameter sent with the request. If the serial console output exceeds the size of the buffer, older output will be overwritten by newer content and the start values will be mismatched.
 */
/**
 * @typedef ServiceAccount
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} email Email address of the service account.
 * @property {string[]} scopes The list of scopes to be made available for this service account.
 */
/**
 * @typedef Snapshot
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} diskSizeGb [Output Only] Size of the snapshot, specified in GB.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of the resource. Always compute#snapshot for Snapshot resources.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this snapshot, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve a snapshot.
* @property {object} labels Labels to apply to this snapshot. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string[]} licenses [Output Only] A list of public visible licenses that apply to this snapshot. This can be because the original image had licenses attached (such as a Windows image).
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {compute(alpha).CustomerEncryptionKey} snapshotEncryptionKey Encrypts the snapshot using a customer-supplied encryption key.

After you encrypt a snapshot using a customer-supplied key, you must provide the same key if you use the image later For example, you must provide the encryption key when you create a disk from the encrypted snapshot in a future request.

Customer-supplied encryption keys do not protect access to metadata of the disk.

If you do not provide an encryption key when creating the snapshot, then the snapshot will be encrypted using an automatically generated key and you do not need to provide a key to use the snapshot later.
* @property {string} sourceDisk [Output Only] The source disk used to create this snapshot.
* @property {compute(alpha).CustomerEncryptionKey} sourceDiskEncryptionKey The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.
* @property {string} sourceDiskId [Output Only] The ID value of the disk used to create this snapshot. This value may be used to determine whether the snapshot was taken from the current or a previous instance of a given disk name.
* @property {string} status [Output Only] The status of the snapshot. This can be CREATING, DELETING, FAILED, READY, or UPLOADING.
* @property {string} storageBytes [Output Only] A size of the the storage used by the snapshot. As snapshots share storage, this number is expected to change with snapshot creation/deletion.
* @property {string} storageBytesStatus [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date.
*/
/**
 * @typedef SnapshotList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Snapshot[]} items [Output Only] A list of Snapshot resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef SslCertificate
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} certificate A local certificate file. The certificate must be in PEM format. The certificate chain must be no greater than 5 certs long. The chain must include at least one intermediate cert.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#sslCertificate for SSL certificates.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} privateKey A write-only private key in PEM format. Only insert requests will include this field.
 * @property {string} selfLink [Output only] Server-defined URL for the resource.
 */
/**
 * @typedef SslCertificateList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {compute(alpha).SslCertificate[]} items A list of SslCertificate resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef Subnetwork
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} gatewayAddress [Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} ipCidrRange The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example, 10.0.0.0/8 or 192.168.0.0/16. Ranges must be unique and non-overlapping within a network.
 * @property {string} kind [Output Only] Type of the resource. Always compute#subnetwork for Subnetwork resources.
 * @property {string} name The name of the resource, provided by the client when initially creating the resource. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} network The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. Only networks that are in the distributed mode can have subnetworks.
 * @property {boolean} privateIpGoogleAccess Whether the VMs in this subnet can access Google services without assigned external IP addresses.
 * @property {string} region URL of the region where the Subnetwork resides.
 * @property {compute(alpha).SubnetworkSecondaryRange[]} secondaryIpRanges An array of configurations for secondary IP ranges for VM instances contained in this subnetwork. The primary IP of such VM must belong to the primary ipCidrRange of the subnetwork. The alias IPs may belong to either primary or secondary ranges.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 */
/**
 * @typedef SubnetworkAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output] A map of scoped Subnetwork lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#subnetworkAggregatedList for aggregated lists of subnetworks.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef SubnetworkList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Subnetwork[]} items The Subnetwork resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#subnetworkList for lists of subnetworks.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef SubnetworkSecondaryRange
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} ipCidrRange The range of IP addresses belonging to this subnetwork secondary range. Provide this property when you create the subnetwork. Ranges must be unique and non-overlapping with all primary and secondary IP ranges within a network.
 * @property {string} rangeName The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance. The name must be 1-63 characters long, and comply with RFC1035. The name must be unique within the subnetwork.
 */
/**
 * @typedef SubnetworksExpandIpCidrRangeRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} ipCidrRange The IP (in CIDR format or netmask) of internal addresses that are legal on this Subnetwork. This range should be disjoint from other subnetworks within this network. This range can only be larger than (i.e. a superset of) the range previously defined before the update.
 */
/**
 * @typedef SubnetworksScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).Subnetwork[]} subnetworks List of subnetworks contained in this scope.
 * @property {object} warning An informational warning that appears when the list of addresses is empty.
 */
/**
 * @typedef SubnetworksSetPrivateIpGoogleAccessRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {boolean} privateIpGoogleAccess 
 */
/**
 * @typedef TCPHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} port The TCP port number for the health check request. The default value is 80.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} request The application data to send once the TCP connection has been established (default value is empty). If both request and response are empty, the connection establishment alone will indicate health. The request data can only be ASCII.
 * @property {string} response The bytes to match against the beginning of the response data. If left empty (the default value), any response will indicate health. The response data can only be ASCII.
 */
/**
 * @typedef Tags
 * @memberOf! compute(alpha)
 * @type object
* @property {string} fingerprint Specifies a fingerprint for this request, which is essentially a hash of the metadata&#39;s contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata.

To see the latest fingerprint, make get() request to the instance.
* @property {string[]} items An array of tags. Each tag must be 1-63 characters long, and comply with RFC1035.
*/
/**
 * @typedef TargetHttpProxy
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetHttpProxy for target HTTP proxies.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} urlMap URL to the UrlMap resource that defines the mapping from URL to the BackendService.
 */
/**
 * @typedef TargetHttpProxyList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetHttpProxy[]} items A list of TargetHttpProxy resources.
 * @property {string} kind Type of resource. Always compute#targetHttpProxyList for lists of target HTTP proxies.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetHttpsProxiesSetSslCertificatesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} sslCertificates New set of SslCertificate resources to associate with this TargetHttpsProxy resource. Currently exactly one SslCertificate resource must be specified.
 */
/**
 * @typedef TargetHttpsProxy
 * @memberOf! compute(alpha)
 * @type object
* @property {string} clientSslPolicy URL to ClientSslPolicy resource which controls the set of allowed SSL versions and ciphers.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} kind [Output Only] Type of resource. Always compute#targetHttpsProxy for target HTTPS proxies.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string[]} sslCertificates URLs to SslCertificate resources that are used to authenticate connections between users and the load balancer. Currently, exactly one SSL certificate must be specified.
* @property {string} urlMap A fully-qualified or valid partial URL to the UrlMap resource that defines the mapping from URL to the BackendService. For example, the following are all valid URLs for specifying a URL map:  
- https://www.googleapis.compute/v1/projects/project/global/urlMaps/url-map 
- projects/project/global/urlMaps/url-map 
- global/urlMaps/url-map
*/
/**
 * @typedef TargetHttpsProxyList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetHttpsProxy[]} items A list of TargetHttpsProxy resources.
 * @property {string} kind Type of resource. Always compute#targetHttpsProxyList for lists of target HTTPS proxies.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetInstance
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string} instance A URL to the virtual machine instance that handles traffic for this target instance. When creating a target instance, you can provide the fully-qualified URL or a valid partial URL to the desired virtual machine. For example, the following are all valid URLs: 
- https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance 
- projects/project/zones/zone/instances/instance 
- zones/zone/instances/instance
* @property {string} kind [Output Only] The type of the resource. Always compute#targetInstance for target instances.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} natPolicy NAT option controlling how IPs are NAT&#39;ed to the instance. Currently only NO_NAT (default value) is supported.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} zone [Output Only] URL of the zone where the target instance resides.
*/
/**
 * @typedef TargetInstanceAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {object} items A map of scoped target instance lists.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetInstanceList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetInstance[]} items A list of TargetInstance resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetInstancesScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).TargetInstance[]} targetInstances List of target instances contained in this scope.
 * @property {object} warning Informational warning which replaces the list of addresses when the list is empty.
 */
/**
 * @typedef TargetPool
 * @memberOf! compute(alpha)
 * @type object
* @property {string} backupPool This field is applicable only when the containing target pool is serving a forwarding rule as the primary pool, and its failoverRatio field is properly set to a value between [0, 1].

backupPool and failoverRatio together define the fallback behavior of the primary target pool: if the ratio of the healthy instances in the primary pool is at or below failoverRatio, traffic arriving at the load-balanced IP will be directed to the backup pool.

In case where failoverRatio and backupPool are not set, or all the instances in the backup pool are unhealthy, the traffic will be directed back to the primary pool in the &quot;force&quot; mode, where traffic will be spread to the healthy instances with the best effort, or to all instances when no instance is healthy.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {number} failoverRatio This field is applicable only when the containing target pool is serving a forwarding rule as the primary pool (i.e., not as a backup pool to some other target pool). The value of the field must be in [0, 1].

If set, backupPool must also be set. They together define the fallback behavior of the primary target pool: if the ratio of the healthy instances in the primary pool is at or below this number, traffic arriving at the load-balanced IP will be directed to the backup pool.

In case where failoverRatio is not set or all the instances in the backup pool are unhealthy, the traffic will be directed back to the primary pool in the &quot;force&quot; mode, where traffic will be spread to the healthy instances with the best effort, or to all instances when no instance is healthy.
* @property {string[]} healthChecks A list of URLs to the HttpHealthCheck resource. A member instance in this pool is considered healthy if and only if all specified health checks pass. An empty list means all member instances will be considered healthy at all times.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {string[]} instances A list of resource URLs to the virtual machine instances serving this pool. They must live in zones contained in the same region as this pool.
* @property {string} kind [Output Only] Type of the resource. Always compute#targetPool for target pools.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} region [Output Only] URL of the region where the target pool resides.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} sessionAffinity Sesssion affinity option, must be one of the following values:
NONE: Connections from the same client IP may go to any instance in the pool.
CLIENT_IP: Connections from the same client IP will go to the same instance in the pool while that instance remains healthy.
CLIENT_IP_PROTO: Connections from the same client IP with the same IP protocol will go to the same instance in the pool while that instance remains healthy.
*/
/**
 * @typedef TargetPoolAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {object} items [Output Only] A map of scoped target pool lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetPoolAggregatedList for aggregated lists of target pools.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetPoolInstanceHealth
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).HealthStatus[]} healthStatus 
 * @property {string} kind [Output Only] Type of resource. Always compute#targetPoolInstanceHealth when checking the health of an instance.
 */
/**
 * @typedef TargetPoolList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Defined by the server.
 * @property {compute(alpha).TargetPool[]} items A list of TargetPool resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetPoolList for lists of target pools.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetPoolsAddHealthCheckRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).HealthCheckReference[]} healthChecks A list of HttpHealthCheck resources to add to the target pool.
 */
/**
 * @typedef TargetPoolsAddInstanceRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).InstanceReference[]} instances A full or partial URL to an instance to add to this target pool. This can be a full or partial URL. For example, the following are valid URLs:  
- https://www.googleapis.com/compute/v1/projects/project-id/zones/zone/instances/instance-name 
- projects/project-id/zones/zone/instances/instance-name 
- zones/zone/instances/instance-name
*/
/**
 * @typedef TargetPoolsRemoveHealthCheckRequest
 * @memberOf! compute(alpha)
 * @type object
* @property {compute(alpha).HealthCheckReference[]} healthChecks Health check URL to be removed. This can be a full or valid partial URL. For example, the following are valid URLs:  
- https://www.googleapis.com/compute/beta/projects/project/global/httpHealthChecks/health-check 
- projects/project/global/httpHealthChecks/health-check 
- global/httpHealthChecks/health-check
*/
/**
 * @typedef TargetPoolsRemoveInstanceRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).InstanceReference[]} instances URLs of the instances to be removed from target pool.
 */
/**
 * @typedef TargetPoolsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).TargetPool[]} targetPools List of target pools contained in this scope.
 * @property {object} warning Informational warning which replaces the list of addresses when the list is empty.
 */
/**
 * @typedef TargetReference
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} target 
 */
/**
 * @typedef TargetSslProxiesSetBackendServiceRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} service The URL of the new BackendService resource for the targetSslProxy.
 */
/**
 * @typedef TargetSslProxiesSetProxyHeaderRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} proxyHeader The new type of proxy header to append before sending data to the backend. NONE or PROXY_V1 are allowed.
 */
/**
 * @typedef TargetSslProxiesSetSslCertificatesRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} sslCertificates New set of URLs to SslCertificate resources to associate with this TargetSslProxy. Currently exactly one ssl certificate must be specified.
 */
/**
 * @typedef TargetSslProxy
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} clientSslPolicy URL to ClientSslPolicy resource which controls the set of allowed SSL versions and ciphers.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#targetSslProxy for target SSL proxies.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} service URL to the BackendService resource.
 * @property {string[]} sslCertificates URLs to SslCertificate resources that are used to authenticate connections to Backends. Currently exactly one SSL certificate must be specified.
 */
/**
 * @typedef TargetSslProxyList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetSslProxy[]} items A list of TargetSslProxy resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetTcpProxiesSetBackendServiceRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} service The URL of the new BackendService resource for the targetTcpProxy.
 */
/**
 * @typedef TargetTcpProxiesSetProxyHeaderRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} proxyHeader The new type of proxy header to append before sending data to the backend. NONE or PROXY_V1 are allowed.
 */
/**
 * @typedef TargetTcpProxy
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#targetTcpProxy for target TCP proxies.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} proxyHeader Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} service URL to the BackendService resource.
 */
/**
 * @typedef TargetTcpProxyList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetTcpProxy[]} items A list of TargetTcpProxy resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetVpnGateway
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string[]} forwardingRules [Output Only] A list of URLs to the ForwardingRule resources. ForwardingRules are created using compute.forwardingRules.insert and associated to a VPN gateway.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetVpnGateway for target VPN gateways.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {string} network URL of the network to which this VPN gateway is attached. Provided by the client when the VPN gateway is created.
 * @property {string} region [Output Only] URL of the region where the target VPN gateway resides.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} status [Output Only] The status of the VPN gateway.
 * @property {string[]} tunnels [Output Only] A list of URLs to VpnTunnel resources. VpnTunnels are created using compute.vpntunnels.insert method and associated to a VPN gateway.
 */
/**
 * @typedef TargetVpnGatewayAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items A map of scoped target vpn gateway lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetVpnGateway for target VPN gateways.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetVpnGatewayList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).TargetVpnGateway[]} items [Output Only] A list of TargetVpnGateway resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#targetVpnGateway for target VPN gateways.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef TargetVpnGatewaysScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).TargetVpnGateway[]} targetVpnGateways [Output Only] List of target vpn gateways contained in this scope.
 * @property {object} warning [Output Only] Informational warning which replaces the list of addresses when the list is empty.
 */
/**
 * @typedef TestFailure
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} actualService 
 * @property {string} expectedService 
 * @property {string} host 
 * @property {string} path 
 */
/**
 * @typedef TestPermissionsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} permissions The set of permissions to check for the &#39;resource&#39;. Permissions with wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed.
 */
/**
 * @typedef TestPermissionsResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
 */
/**
 * @typedef UDPHealthCheck
 * @memberOf! compute(alpha)
 * @type object
 * @property {integer} port The UDP port number for the health check request.
 * @property {string} portName Port name as defined in InstanceGroup#NamedPort#name. If both port and port_name are defined, port takes precedence.
 * @property {string} request Raw data of request to send in payload of UDP packet. It is an error if this is empty. The request data can only be ASCII.
 * @property {string} response The bytes to match against the beginning of the response data. It is an error if this is empty. The response data can only be ASCII.
 */
/**
 * @typedef UrlMap
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} defaultService The URL of the BackendService resource if none of the hostRules match.
 * @property {string} description An optional description of this resource. Provide this property when you create the resource.
 * @property {string} fingerprint Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a UrlMap. An up-to-date fingerprint must be provided in order to update the UrlMap.
 * @property {compute(alpha).HostRule[]} hostRules The list of HostRules to use against the URL.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#urlMaps for url maps.
 * @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 * @property {compute(alpha).PathMatcher[]} pathMatchers The list of named PathMatchers to use against the URL.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {compute(alpha).UrlMapTest[]} tests The list of expected URL mappings. Request to update this UrlMap will succeed only if all of the test cases pass.
 */
/**
 * @typedef UrlMapList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource. Set by the server.
 * @property {compute(alpha).UrlMap[]} items A list of UrlMap resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef UrlMapReference
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} urlMap 
 */
/**
 * @typedef UrlMapTest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} description Description of this test case.
 * @property {string} host Host portion of the URL.
 * @property {string} path Path portion of the URL.
 * @property {string} service Expected BackendService resource the given URL should be mapped to.
 */
/**
 * @typedef UrlMapValidationResult
 * @memberOf! compute(alpha)
 * @type object
 * @property {string[]} loadErrors 
 * @property {boolean} loadSucceeded Whether the given UrlMap can be successfully loaded. If false, &#39;loadErrors&#39; indicates the reasons.
 * @property {compute(alpha).TestFailure[]} testFailures 
 * @property {boolean} testPassed If successfully loaded, this field indicates whether the test passed. If false, &#39;testFailures&#39;s indicate the reason of failure.
 */
/**
 * @typedef UrlMapsValidateRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).UrlMap} resource Content of the UrlMap to be validated.
 */
/**
 * @typedef UrlMapsValidateResponse
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).UrlMapValidationResult} result 
 */
/**
 * @typedef UsageExportLocation
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} bucketName The name of an existing bucket in Cloud Storage where the usage report object is stored. The Google Service Account is granted write access to this bucket. This can either be the bucket name by itself, such as example-bucket, or the bucket name with gs:// or https://storage.googleapis.com/ in front of it, such as gs://example-bucket.
 * @property {string} reportNamePrefix An optional prefix for the name of the usage report object stored in bucketName. If not supplied, defaults to usage. The report is stored as a CSV file named report_name_prefix_gce_YYYYMMDD.csv where YYYYMMDD is the day of the usage according to Pacific Time. If you supply a prefix, it should conform to Cloud Storage object naming conventions.
 */
/**
 * @typedef VpnTunnel
 * @memberOf! compute(alpha)
 * @type object
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional description of this resource. Provide this property when you create the resource.
* @property {string} detailedStatus [Output Only] Detailed status message for the VPN tunnel.
* @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
* @property {integer} ikeVersion IKE protocol version to use when establishing the VPN tunnel with peer VPN gateway. Acceptable IKE versions are 1 or 2. Default version is 2.
* @property {string} kind [Output Only] Type of resource. Always compute#vpnTunnel for VPN tunnels.
* @property {string} labelFingerprint A fingerprint for the labels being applied to this VpnTunnel, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.

To see the latest fingerprint, make a get() request to retrieve a VpnTunnel.
* @property {object} labels Labels to apply to this VpnTunnel. These can be later modified by the setLabels method. Each label key/value pair must comply with RFC1035. Label values may be empty.
* @property {string[]} localTrafficSelector Local traffic selector to use when establishing the VPN tunnel with peer VPN gateway. The value should be a CIDR formatted string, for example: 192.168.0.0/16. The ranges should be disjoint.
* @property {string} name Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {string} peerIp IP address of the peer VPN gateway.
* @property {string} region [Output Only] URL of the region where the VPN tunnel resides.
* @property {string[]} remoteTrafficSelector Remote traffic selectors to use when establishing the VPN tunnel with peer VPN gateway. The value should be a CIDR formatted string, for example: 192.168.0.0/16. The ranges should be disjoint.
* @property {string} router URL of router resource to be used for dynamic routing.
* @property {string} selfLink [Output Only] Server-defined URL for the resource.
* @property {string} sharedSecret Shared secret used to set the secure session between the Cloud VPN gateway and the peer VPN gateway.
* @property {string} sharedSecretHash Hash of the shared secret.
* @property {string} status [Output Only] The status of the VPN tunnel.
* @property {string} targetVpnGateway URL of the VPN gateway with which this VPN tunnel is associated. Provided by the client when the VPN tunnel is created.
*/
/**
 * @typedef VpnTunnelAggregatedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {object} items [Output Only] A map of scoped vpn tunnel lists.
 * @property {string} kind [Output Only] Type of resource. Always compute#vpnTunnel for VPN tunnels.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef VpnTunnelList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).VpnTunnel[]} items [Output Only] A list of VpnTunnel resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#vpnTunnel for VPN tunnels.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef VpnTunnelsScopedList
 * @memberOf! compute(alpha)
 * @type object
 * @property {compute(alpha).VpnTunnel[]} vpnTunnels List of vpn tunnels contained in this scope.
 * @property {object} warning Informational warning which replaces the list of addresses when the list is empty.
 */
/**
 * @typedef XpnHostList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {compute(alpha).Project[]} items [Output Only] A list of XPN host project URLs.
 * @property {string} kind [Output Only] Type of resource. Always compute#xpnHostList for lists of XPN hosts.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef XpnResourceId
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id The ID of the XPN resource. In the case of projects, this field matches the project&#39;s name, not the canonical ID.
 * @property {string} type The type of the XPN resource.
 */
/**
 * @typedef Zone
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {compute(alpha).DeprecationStatus} deprecated [Output Only] The deprecation status associated with this zone.
 * @property {string} description [Output Only] Textual description of the resource.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always compute#zone for zones.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} region [Output Only] Full URL reference to the region which hosts the zone.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} status [Output Only] Status of the zone, either UP or DOWN.
 */
/**
 * @typedef ZoneList
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {compute(alpha).Zone[]} items [Output Only] A list of Zone resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef ZoneSetLabelsRequest
 * @memberOf! compute(alpha)
 * @type object
 * @property {string} labelFingerprint The fingerprint of the previous set of labels for this resource, used to detect conflicts. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels. Make a get() request to the resource to get the latest fingerprint.
 * @property {object} labels The labels to set for this resource.
 */
module.exports = Compute;
