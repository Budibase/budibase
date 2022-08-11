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
 * Google Compute Engine Instance Groups API
 *
 * The Resource View API allows users to create and manage logical sets of Google Compute Engine instances.
 *
 * @example
 * var google = require('googleapis');
 * var resourceviews = google.resourceviews('v1beta2');
 *
 * @namespace resourceviews
 * @type {Function}
 * @version v1beta2
 * @variation v1beta2
 * @param {object=} options Options for Resourceviews
 */
function Resourceviews(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.zoneOperations = {

    /**
     * resourceviews.zoneOperations.get
     *
     * @desc Retrieves the specified zone-specific operation resource.
     *
     * @alias resourceviews.zoneOperations.get
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the operation resource to return.
     * @param {string} params.project Name of the project scoping this request.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/operations/{operation}',
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
     * resourceviews.zoneOperations.list
     *
     * @desc Retrieves the list of operation resources contained within the specified zone.
     *
     * @alias resourceviews.zoneOperations.list
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Optional. Filter expression for filtering listed resources.
     * @param {integer=} params.maxResults Optional. Maximum count of results to be returned. Maximum value is 500 and default value is 500.
     * @param {string=} params.pageToken Optional. Tag returned by a previous list request truncated by maxResults. Used to continue a previous list request.
     * @param {string} params.project Name of the project scoping this request.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/operations',
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

  self.zoneViews = {

    /**
     * resourceviews.zoneViews.addResources
     *
     * @desc Add resources to the view.
     *
     * @alias resourceviews.zoneViews.addResources
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta2).ZoneViewsAddResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addResources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}/addResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.delete
     *
     * @desc Delete a resource view.
     *
     * @alias resourceviews.zoneViews.delete
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.get
     *
     * @desc Get the information of a zonal resource view.
     *
     * @alias resourceviews.zoneViews.get
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.getService
     *
     * @desc Get the service information of a resource view or a resource.
     *
     * @alias resourceviews.zoneViews.getService
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string=} params.resourceName The name of the resource if user wants to get the service information of the resource.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getService: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}/getService',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.insert
     *
     * @desc Create a resource view.
     *
     * @alias resourceviews.zoneViews.insert
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta2).ResourceView} params.resource Request body data
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews',
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
     * resourceviews.zoneViews.list
     *
     * @desc List resource views.
     *
     * @alias resourceviews.zoneViews.list
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews',
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
     * resourceviews.zoneViews.listResources
     *
     * @desc List the resources of the resource view.
     *
     * @alias resourceviews.zoneViews.listResources
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.format The requested format of the return value. It can be URL or URL_PORT. A JSON object will be included in the response based on the format. The default format is NONE, which results in no JSON in the response.
     * @param {string=} params.listState The state of the instance to list. By default, it lists all instances.
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string=} params.serviceName The service name to return in the response. It is optional and if it is not set, all the service end points will be returned.
     * @param {string} params.zone The zone name of the resource view.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listResources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}/resources',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.removeResources
     *
     * @desc Remove resources from the view.
     *
     * @alias resourceviews.zoneViews.removeResources
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta2).ZoneViewsRemoveResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeResources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}/removeResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.setService
     *
     * @desc Update the service information of a resource view or a resource.
     *
     * @alias resourceviews.zoneViews.setService
     * @memberOf! resourceviews(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project name of the resource view.
     * @param {string} params.resourceView The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta2).ZoneViewsSetServiceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setService: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta2/projects/{project}/zones/{zone}/resourceViews/{resourceView}/setService',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'resourceView'],
        pathParams: ['project', 'resourceView', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Label
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string} key Key of the label.
 * @property {string} value Value of the label.
 */
/**
 * @typedef ListResourceResponseItem
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {object} endpoints The list of service end points on the resource.
 * @property {string} resource The full URL of the resource.
 */
/**
 * @typedef Operation
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string} clientOperationId [Output only] An optional identifier specified by the client when the mutation was initiated. Must be unique for all operation resources in the project.
 * @property {string} creationTimestamp [Output Only] The time that this operation was requested, in RFC3339 text format.
 * @property {string} endTime [Output Only] The time that this operation was completed, in RFC3339 text format.
 * @property {object} error [Output Only] If errors occurred during processing of this operation, this field will be populated.
 * @property {string} httpErrorMessage [Output only] If operation fails, the HTTP error message returned.
 * @property {integer} httpErrorStatusCode [Output only] If operation fails, the HTTP error status code returned.
 * @property {string} id [Output Only] Unique identifier for the resource, generated by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested, in RFC3339 text format.
 * @property {string} kind [Output only] Type of the resource.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType [Output only] Type of the operation. Operations include insert, update, and delete.
 * @property {integer} progress [Output only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess at when the operation will be complete. This number should be monotonically increasing as the operation progresses.
 * @property {string} region [Output Only] URL of the region where the operation resides. Only available when performing regional operations.
 * @property {string} selfLink [Output Only] Server-defined fully-qualified URL for this resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server, in RFC3339 text format.
 * @property {string} status [Output Only] Status of the operation.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] Unique target ID which identifies a particular incarnation of the target.
 * @property {string} targetLink [Output only] URL of the resource the operation is mutating.
 * @property {string} user [Output Only] User who requested the operation, for example: user@example.com.
 * @property {object[]} warnings [Output Only] If there are issues with this operation, a warning is returned.
 * @property {string} zone [Output Only] URL of the zone where the operation resides. Only available when performing per-zone operations.
 */
/**
 * @typedef OperationList
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {resourceviews(v1beta2).Operation[]} items The operation resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken A token used to continue a truncated list request (output only).
 * @property {string} selfLink Server defined URL for this resource (output only).
 */
/**
 * @typedef ResourceView
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string} creationTimestamp The creation time of the resource view.
 * @property {string} description The detailed description of the resource view.
 * @property {resourceviews(v1beta2).ServiceEndpoint[]} endpoints Services endpoint information.
 * @property {string} fingerprint The fingerprint of the service endpoint information.
 * @property {string} id [Output Only] The ID of the resource view.
 * @property {string} kind Type of the resource.
 * @property {resourceviews(v1beta2).Label[]} labels The labels for events.
 * @property {string} name The name of the resource view.
 * @property {string} network The URL of a Compute Engine network to which the resources in the view belong.
 * @property {string[]} resources A list of all resources in the resource view.
 * @property {string} selfLink [Output Only] A self-link to the resource view.
 * @property {integer} size The total number of resources in the resource view.
 */
/**
 * @typedef ServiceEndpoint
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string} name The name of the service endpoint.
 * @property {integer} port The port of the service endpoint.
 */
/**
 * @typedef ZoneViewsAddResourcesRequest
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string[]} resources The list of resources to be added.
 */
/**
 * @typedef ZoneViewsGetServiceResponse
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {resourceviews(v1beta2).ServiceEndpoint[]} endpoints The service information.
 * @property {string} fingerprint The fingerprint of the service information.
 */
/**
 * @typedef ZoneViewsList
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {resourceviews(v1beta2).ResourceView[]} items The result that contains all resource views that meet the criteria.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken A token used for pagination.
 * @property {string} selfLink Server defined URL for this resource (output only).
 */
/**
 * @typedef ZoneViewsListResourcesResponse
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {resourceviews(v1beta2).ListResourceResponseItem[]} items The formatted JSON that is requested by the user.
 * @property {string} network The URL of a Compute Engine network to which the resources in the view belong.
 * @property {string} nextPageToken A token used for pagination.
 */
/**
 * @typedef ZoneViewsRemoveResourcesRequest
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {string[]} resources The list of resources to be removed.
 */
/**
 * @typedef ZoneViewsSetServiceRequest
 * @memberOf! resourceviews(v1beta2)
 * @type object
 * @property {resourceviews(v1beta2).ServiceEndpoint[]} endpoints The service information to be updated.
 * @property {string} fingerprint Fingerprint of the service information; a hash of the contents. This field is used for optimistic locking when updating the service entries.
 * @property {string} resourceName The name of the resource if user wants to update the service information of the resource.
 */
module.exports = Resourceviews;
