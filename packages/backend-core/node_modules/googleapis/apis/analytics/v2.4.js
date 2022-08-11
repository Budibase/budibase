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
 * Google Analytics API
 *
 * Views and manages your Google Analytics data.
 *
 * @example
 * var google = require('googleapis');
 * var analytics = google.analytics('v2.4');
 *
 * @namespace analytics
 * @type {Function}
 * @version v2.4
 * @variation v2.4
 * @param {object=} options Options for Analytics
 */
function Analytics(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.data = {

    /**
     * analytics.data.get
     *
     * @desc Returns Analytics report data for a view (profile).
     *
     * @alias analytics.data.get
     * @memberOf! analytics(v2.4)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.dimensions A comma-separated list of Analytics dimensions. E.g., 'ga:browser,ga:city'.
     * @param {string} params.end-date End date for fetching report data. All requests should specify an end date formatted as YYYY-MM-DD.
     * @param {string=} params.filters A comma-separated list of dimension or metric filters to be applied to the report data.
     * @param {string} params.ids Unique table ID for retrieving report data. Table ID is of the form ga:XXXX, where XXXX is the Analytics view (profile) ID.
     * @param {integer=} params.max-results The maximum number of entries to include in this feed.
     * @param {string} params.metrics A comma-separated list of Analytics metrics. E.g., 'ga:sessions,ga:pageviews'. At least one metric must be specified to retrieve a valid Analytics report.
     * @param {string=} params.segment An Analytics advanced segment to be applied to the report data.
     * @param {string=} params.sort A comma-separated list of dimensions or metrics that determine the sort order for the report data.
     * @param {string} params.start-date Start date for fetching report data. All requests should specify a start date formatted as YYYY-MM-DD.
     * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
          url: 'https://www.googleapis.com/analytics/v2.4/data',
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

  self.management = {

    accounts: {

      /**
       * analytics.management.accounts.list
       *
       * @desc Lists all accounts to which the user has access.
       *
       * @alias analytics.management.accounts.list
       * @memberOf! analytics(v2.4)
       *
       * @param {object=} params Parameters for request
       * @param {integer=} params.max-results The maximum number of accounts to include in this response.
       * @param {integer=} params.start-index An index of the first account to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
            url: 'https://www.googleapis.com/analytics/v2.4/management/accounts',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    goals: {

      /**
       * analytics.management.goals.list
       *
       * @desc Lists goals to which the user has access.
       *
       * @alias analytics.management.goals.list
       * @memberOf! analytics(v2.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve goals for. Can either be a specific account ID or '~all', which refers to all the accounts that user has access to.
       * @param {integer=} params.max-results The maximum number of goals to include in this response.
       * @param {string} params.profileId View (Profile) ID to retrieve goals for. Can either be a specific view (profile) ID or '~all', which refers to all the views (profiles) that user has access to.
       * @param {integer=} params.start-index An index of the first goal to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID to retrieve goals for. Can either be a specific web property ID or '~all', which refers to all the web properties that user has access to.
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
            url: 'https://www.googleapis.com/analytics/v2.4/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    profiles: {

      /**
       * analytics.management.profiles.list
       *
       * @desc Lists views (profiles) to which the user has access.
       *
       * @alias analytics.management.profiles.list
       * @memberOf! analytics(v2.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the views (profiles) to retrieve. Can either be a specific account ID or '~all', which refers to all the accounts to which the user has access.
       * @param {integer=} params.max-results The maximum number of views (profiles) to include in this response.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID for the views (profiles) to retrieve. Can either be a specific web property ID or '~all', which refers to all the web properties to which the user has access.
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
            url: 'https://www.googleapis.com/analytics/v2.4/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    segments: {

      /**
       * analytics.management.segments.list
       *
       * @desc Lists advanced segments to which the user has access.
       *
       * @alias analytics.management.segments.list
       * @memberOf! analytics(v2.4)
       *
       * @param {object=} params Parameters for request
       * @param {integer=} params.max-results The maximum number of advanced segments to include in this response.
       * @param {integer=} params.start-index An index of the first advanced segment to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
            url: 'https://www.googleapis.com/analytics/v2.4/management/segments',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    webproperties: {

      /**
       * analytics.management.webproperties.list
       *
       * @desc Lists web properties to which the user has access.
       *
       * @alias analytics.management.webproperties.list
       * @memberOf! analytics(v2.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve web properties for. Can either be a specific account ID or '~all', which refers to all the accounts that user has access to.
       * @param {integer=} params.max-results The maximum number of web properties to include in this response.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
            url: 'https://www.googleapis.com/analytics/v2.4/management/accounts/{accountId}/webproperties',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

module.exports = Analytics;
