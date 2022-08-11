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
 * Resource Views API
 *
 * The Resource View API allows users to create and manage logical sets of Google Compute Engine instances.
 *
 * @example
 * var google = require('googleapis');
 * var resourceviews = google.resourceviews('v1beta1');
 *
 * @namespace resourceviews
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Resourceviews
 */
function Resourceviews(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.regionViews = {

    /**
     * resourceviews.regionViews.addresources
     *
     * @desc Add resources to the view.
     *
     * @alias resourceviews.regionViews.addresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {resourceviews(v1beta1).RegionViewsAddResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews/{resourceViewName}/addResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region', 'resourceViewName'],
        pathParams: ['projectName', 'region', 'resourceViewName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.delete
     *
     * @desc Delete a resource view.
     *
     * @alias resourceviews.regionViews.delete
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews/{resourceViewName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region', 'resourceViewName'],
        pathParams: ['projectName', 'region', 'resourceViewName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.get
     *
     * @desc Get the information of a resource view.
     *
     * @alias resourceviews.regionViews.get
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews/{resourceViewName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region', 'resourceViewName'],
        pathParams: ['projectName', 'region', 'resourceViewName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.insert
     *
     * @desc Create a resource view.
     *
     * @alias resourceviews.regionViews.insert
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {resourceviews(v1beta1).ResourceView} params.resource Request body data
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region'],
        pathParams: ['projectName', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.list
     *
     * @desc List resource views.
     *
     * @alias resourceviews.regionViews.list
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region'],
        pathParams: ['projectName', 'region'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.listresources
     *
     * @desc List the resources in the view.
     *
     * @alias resourceviews.regionViews.listresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews/{resourceViewName}/resources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region', 'resourceViewName'],
        pathParams: ['projectName', 'region', 'resourceViewName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.regionViews.removeresources
     *
     * @desc Remove resources from the view.
     *
     * @alias resourceviews.regionViews.removeresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.region The region name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {resourceviews(v1beta1).RegionViewsRemoveResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/regions/{region}/resourceViews/{resourceViewName}/removeResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'region', 'resourceViewName'],
        pathParams: ['projectName', 'region', 'resourceViewName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.zoneViews = {

    /**
     * resourceviews.zoneViews.addresources
     *
     * @desc Add resources to the view.
     *
     * @alias resourceviews.zoneViews.addresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta1).ZoneViewsAddResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews/{resourceViewName}/addResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'resourceViewName'],
        pathParams: ['projectName', 'resourceViewName', 'zone'],
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
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews/{resourceViewName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'resourceViewName'],
        pathParams: ['projectName', 'resourceViewName', 'zone'],
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
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews/{resourceViewName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'resourceViewName'],
        pathParams: ['projectName', 'resourceViewName', 'zone'],
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
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta1).ResourceView} params.resource Request body data
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone'],
        pathParams: ['projectName', 'zone'],
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
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.projectName The project name of the resource view.
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
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone'],
        pathParams: ['projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.listresources
     *
     * @desc List the resources of the resource view.
     *
     * @alias resourceviews.zoneViews.listresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 5000, inclusive. (Default: 5000)
     * @param {string=} params.pageToken Specifies a nextPageToken returned by a previous list request. This token can be used to request the next page of results from a previous list request.
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews/{resourceViewName}/resources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'resourceViewName'],
        pathParams: ['projectName', 'resourceViewName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * resourceviews.zoneViews.removeresources
     *
     * @desc Remove resources from the view.
     *
     * @alias resourceviews.zoneViews.removeresources
     * @memberOf! resourceviews(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project name of the resource view.
     * @param {string} params.resourceViewName The name of the resource view.
     * @param {string} params.zone The zone name of the resource view.
     * @param {resourceviews(v1beta1).ZoneViewsRemoveResourcesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeresources: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/resourceviews/v1beta1/projects/{projectName}/zones/{zone}/resourceViews/{resourceViewName}/removeResources',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'resourceViewName'],
        pathParams: ['projectName', 'resourceViewName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Label
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string} key Key of the label.
 * @property {string} value Value of the label.
 */
/**
 * @typedef RegionViewsAddResourcesRequest
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} resources The list of resources to be added.
 */
/**
 * @typedef RegionViewsInsertResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {resourceviews(v1beta1).ResourceView} resource The resource view object inserted.
 */
/**
 * @typedef RegionViewsListResourcesResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} members The resources in the view.
 * @property {string} nextPageToken A token used for pagination.
 */
/**
 * @typedef RegionViewsListResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string} nextPageToken A token used for pagination.
 * @property {resourceviews(v1beta1).ResourceView[]} resourceViews The list of resource views that meet the criteria.
 */
/**
 * @typedef RegionViewsRemoveResourcesRequest
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} resources The list of resources to be removed.
 */
/**
 * @typedef ResourceView
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string} creationTime The creation time of the resource view.
 * @property {string} description The detailed description of the resource view.
 * @property {string} id [Output Only] The ID of the resource view.
 * @property {string} kind Type of the resource.
 * @property {resourceviews(v1beta1).Label[]} labels The labels for events.
 * @property {string} lastModified The last modified time of the view. Not supported yet.
 * @property {string[]} members A list of all resources in the resource view.
 * @property {string} name The name of the resource view.
 * @property {integer} numMembers The total number of resources in the resource view.
 * @property {string} selfLink [Output Only] A self-link to the resource view.
 */
/**
 * @typedef ZoneViewsAddResourcesRequest
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} resources The list of resources to be added.
 */
/**
 * @typedef ZoneViewsInsertResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {resourceviews(v1beta1).ResourceView} resource The resource view object that has been inserted.
 */
/**
 * @typedef ZoneViewsListResourcesResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} members The full URL of resources in the view.
 * @property {string} nextPageToken A token used for pagination.
 */
/**
 * @typedef ZoneViewsListResponse
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string} nextPageToken A token used for pagination.
 * @property {resourceviews(v1beta1).ResourceView[]} resourceViews The result that contains all resource views that meet the criteria.
 */
/**
 * @typedef ZoneViewsRemoveResourcesRequest
 * @memberOf! resourceviews(v1beta1)
 * @type object
 * @property {string[]} resources The list of resources to be removed.
 */
module.exports = Resourceviews;
