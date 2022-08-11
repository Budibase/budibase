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
 * YouTube Analytics API
 *
 * Retrieves your YouTube Analytics data.
 *
 * @example
 * var google = require('googleapis');
 * var youtubeAnalytics = google.youtubeAnalytics('v1beta1');
 *
 * @namespace youtubeAnalytics
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Youtubeanalytics
 */
function Youtubeanalytics(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.groupItems = {

    /**
     * youtubeAnalytics.groupItems.delete
     *
     * @desc Removes an item from a group.
     *
     * @alias youtubeAnalytics.groupItems.delete
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube group item ID for the group that is being deleted.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groupItems',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtubeAnalytics.groupItems.insert
     *
     * @desc Creates a group item.
     *
     * @alias youtubeAnalytics.groupItems.insert
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {youtubeAnalytics(v1beta1).GroupItem} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groupItems',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtubeAnalytics.groupItems.list
     *
     * @desc Returns a collection of group items that match the API request parameters.
     *
     * @alias youtubeAnalytics.groupItems.list
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupId The id parameter specifies the unique ID of the group for which you want to retrieve group items.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groupItems',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['groupId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.groups = {

    /**
     * youtubeAnalytics.groups.delete
     *
     * @desc Deletes a group.
     *
     * @alias youtubeAnalytics.groups.delete
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube group ID for the group that is being deleted.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groups',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtubeAnalytics.groups.insert
     *
     * @desc Creates a group.
     *
     * @alias youtubeAnalytics.groups.insert
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {youtubeAnalytics(v1beta1).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtubeAnalytics.groups.list
     *
     * @desc Returns a collection of groups that match the API request parameters. For example, you can retrieve all groups that the authenticated user owns, or you can retrieve one or more groups by their unique IDs.
     *
     * @alias youtubeAnalytics.groups.list
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube group ID(s) for the resource(s) that are being retrieved. In a group resource, the id property specifies the group's YouTube group ID.
     * @param {boolean=} params.mine Set this parameter's value to true to instruct the API to only return groups owned by the authenticated user.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken property identifies the next page that can be retrieved.
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtubeAnalytics.groups.update
     *
     * @desc Modifies a group. For example, you could change a group's title.
     *
     * @alias youtubeAnalytics.groups.update
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {youtubeAnalytics(v1beta1).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/groups',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.reports = {

    /**
     * youtubeAnalytics.reports.query
     *
     * @desc Retrieve your YouTube Analytics reports.
     *
     * @alias youtubeAnalytics.reports.query
     * @memberOf! youtubeAnalytics(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.currency The currency to which financial metrics should be converted. The default is US Dollar (USD). If the result contains no financial metrics, this flag will be ignored. Responds with an error if the specified currency is not recognized.
     * @param {string=} params.dimensions A comma-separated list of YouTube Analytics dimensions, such as views or ageGroup,gender. See the Available Reports document for a list of the reports that you can retrieve and the dimensions used for those reports. Also see the Dimensions document for definitions of those dimensions.
     * @param {string} params.end-date The end date for fetching YouTube Analytics data. The value should be in YYYY-MM-DD format.
     * @param {string=} params.filters A list of filters that should be applied when retrieving YouTube Analytics data. The Available Reports document identifies the dimensions that can be used to filter each report, and the Dimensions document defines those dimensions. If a request uses multiple filters, join them together with a semicolon (;), and the returned result table will satisfy both filters. For example, a filters parameter value of video==dMH0bHeiRNg;country==IT restricts the result set to include data for the given video in Italy.
     * @param {string} params.ids Identifies the YouTube channel or content owner for which you are retrieving YouTube Analytics data. - To request data for a YouTube user, set the ids parameter value to channel==CHANNEL_ID, where CHANNEL_ID specifies the unique YouTube channel ID. - To request data for a YouTube CMS content owner, set the ids parameter value to contentOwner==OWNER_NAME, where OWNER_NAME is the CMS name of the content owner.
     * @param {integer=} params.max-results The maximum number of rows to include in the response.
     * @param {string} params.metrics A comma-separated list of YouTube Analytics metrics, such as views or likes,dislikes. See the Available Reports document for a list of the reports that you can retrieve and the metrics available in each report, and see the Metrics document for definitions of those metrics.
     * @param {string=} params.sort A comma-separated list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The '-' prefix causes descending sort order.
     * @param {string} params.start-date The start date for fetching YouTube Analytics data. The value should be in YYYY-MM-DD format.
     * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter (one-based, inclusive).
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    query: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/analytics/v1beta1/reports',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['ids', 'start-date', 'end-date', 'metrics'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Group
 * @memberOf! youtubeAnalytics(v1beta1)
 * @type object
 * @property {object} contentDetails 
 * @property {string} etag 
 * @property {string} id 
 * @property {string} kind 
 * @property {object} snippet 
 */
/**
 * @typedef GroupItem
 * @memberOf! youtubeAnalytics(v1beta1)
 * @type object
 * @property {string} etag 
 * @property {string} groupId 
 * @property {string} id 
 * @property {string} kind 
 * @property {object} resource 
 */
/**
 * @typedef GroupItemListResponse
 * @memberOf! youtubeAnalytics(v1beta1)
 * @type object
 * @property {string} etag 
 * @property {youtubeAnalytics(v1beta1).GroupItem[]} items 
 * @property {string} kind 
 */
/**
 * @typedef GroupListResponse
 * @memberOf! youtubeAnalytics(v1beta1)
 * @type object
 * @property {string} etag 
 * @property {youtubeAnalytics(v1beta1).Group[]} items 
 * @property {string} kind 
 * @property {string} nextPageToken 
 */
/**
 * @typedef ResultTable
 * @memberOf! youtubeAnalytics(v1beta1)
 * @type object
 * @property {object[]} columnHeaders This value specifies information about the data returned in the rows fields. Each item in the columnHeaders list identifies a field returned in the rows value, which contains a list of comma-delimited data. The columnHeaders list will begin with the dimensions specified in the API request, which will be followed by the metrics specified in the API request. The order of both dimensions and metrics will match the ordering in the API request. For example, if the API request contains the parameters dimensions=ageGroup,gender&amp;metrics=viewerPercentage, the API response will return columns in this order: ageGroup,gender,viewerPercentage.
 * @property {string} kind This value specifies the type of data included in the API response. For the query method, the kind property value will be youtubeAnalytics#resultTable.
 * @property {array[]} rows The list contains all rows of the result table. Each item in the list is an array that contains comma-delimited data corresponding to a single row of data. The order of the comma-delimited data fields will match the order of the columns listed in the columnHeaders field. If no data is available for the given query, the rows element will be omitted from the response. The response for a query with the day dimension will not contain rows for the most recent days.
 */
module.exports = Youtubeanalytics;
