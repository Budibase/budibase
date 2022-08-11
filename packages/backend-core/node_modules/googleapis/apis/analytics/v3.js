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
 * var analytics = google.analytics('v3');
 *
 * @namespace analytics
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Analytics
 */
function Analytics(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.data = {

    ga: {

      /**
       * analytics.data.ga.get
       *
       * @desc Returns Analytics data for a view (profile).
       *
       * @alias analytics.data.ga.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.dimensions A comma-separated list of Analytics dimensions. E.g., 'ga:browser,ga:city'.
       * @param {string} params.end-date End date for fetching Analytics data. Request can should specify an end date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default value is yesterday.
       * @param {string=} params.filters A comma-separated list of dimension or metric filters to be applied to Analytics data.
       * @param {string} params.ids Unique table ID for retrieving Analytics data. Table ID is of the form ga:XXXX, where XXXX is the Analytics view (profile) ID.
       * @param {boolean=} params.include-empty-rows The response will include empty rows if this parameter is set to true, the default is true
       * @param {integer=} params.max-results The maximum number of entries to include in this feed.
       * @param {string} params.metrics A comma-separated list of Analytics metrics. E.g., 'ga:sessions,ga:pageviews'. At least one metric must be specified.
       * @param {string=} params.output The selected format for the response. Default format is JSON.
       * @param {string=} params.samplingLevel The desired sampling level.
       * @param {string=} params.segment An Analytics segment to be applied to data.
       * @param {string=} params.sort A comma-separated list of dimensions or metrics that determine the sort order for Analytics data.
       * @param {string} params.start-date Start date for fetching Analytics data. Requests can specify a start date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default value is 7daysAgo.
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
            url: 'https://www.googleapis.com/analytics/v3/data/ga',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['ids', 'start-date', 'end-date', 'metrics'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    mcf: {

      /**
       * analytics.data.mcf.get
       *
       * @desc Returns Analytics Multi-Channel Funnels data for a view (profile).
       *
       * @alias analytics.data.mcf.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.dimensions A comma-separated list of Multi-Channel Funnels dimensions. E.g., 'mcf:source,mcf:medium'.
       * @param {string} params.end-date End date for fetching Analytics data. Requests can specify a start date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default value is 7daysAgo.
       * @param {string=} params.filters A comma-separated list of dimension or metric filters to be applied to the Analytics data.
       * @param {string} params.ids Unique table ID for retrieving Analytics data. Table ID is of the form ga:XXXX, where XXXX is the Analytics view (profile) ID.
       * @param {integer=} params.max-results The maximum number of entries to include in this feed.
       * @param {string} params.metrics A comma-separated list of Multi-Channel Funnels metrics. E.g., 'mcf:totalConversions,mcf:totalConversionValue'. At least one metric must be specified.
       * @param {string=} params.samplingLevel The desired sampling level.
       * @param {string=} params.sort A comma-separated list of dimensions or metrics that determine the sort order for the Analytics data.
       * @param {string} params.start-date Start date for fetching Analytics data. Requests can specify a start date formatted as YYYY-MM-DD, or as a relative date (e.g., today, yesterday, or 7daysAgo). The default value is 7daysAgo.
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
            url: 'https://www.googleapis.com/analytics/v3/data/mcf',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['ids', 'start-date', 'end-date', 'metrics'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    realtime: {

      /**
       * analytics.data.realtime.get
       *
       * @desc Returns real time data for a view (profile).
       *
       * @alias analytics.data.realtime.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.dimensions A comma-separated list of real time dimensions. E.g., 'rt:medium,rt:city'.
       * @param {string=} params.filters A comma-separated list of dimension or metric filters to be applied to real time data.
       * @param {string} params.ids Unique table ID for retrieving real time data. Table ID is of the form ga:XXXX, where XXXX is the Analytics view (profile) ID.
       * @param {integer=} params.max-results The maximum number of entries to include in this feed.
       * @param {string} params.metrics A comma-separated list of real time metrics. E.g., 'rt:activeUsers'. At least one metric must be specified.
       * @param {string=} params.sort A comma-separated list of dimensions or metrics that determine the sort order for real time data.
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
            url: 'https://www.googleapis.com/analytics/v3/data/realtime',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['ids', 'metrics'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.management = {

    accountSummaries: {

      /**
       * analytics.management.accountSummaries.list
       *
       * @desc Lists account summaries (lightweight tree comprised of accounts/properties/profiles) to which the user has access.
       *
       * @alias analytics.management.accountSummaries.list
       * @memberOf! analytics(v3)
       *
       * @param {object=} params Parameters for request
       * @param {integer=} params.max-results The maximum number of account summaries to include in this response, where the largest acceptable value is 1000.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accountSummaries',
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

    accountUserLinks: {

      /**
       * analytics.management.accountUserLinks.delete
       *
       * @desc Removes a user from the given account.
       *
       * @alias analytics.management.accountUserLinks.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the user link for.
       * @param {string} params.linkId Link ID to delete the user link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/entityUserLinks/{linkId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'linkId'],
          pathParams: ['accountId', 'linkId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.accountUserLinks.insert
       *
       * @desc Adds a new user to the given account.
       *
       * @alias analytics.management.accountUserLinks.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/entityUserLinks',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.accountUserLinks.list
       *
       * @desc Lists account-user links for a given account.
       *
       * @alias analytics.management.accountUserLinks.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve the user links for.
       * @param {integer=} params.max-results The maximum number of account-user links to include in this response.
       * @param {integer=} params.start-index An index of the first account-user link to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/entityUserLinks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.accountUserLinks.update
       *
       * @desc Updates permissions for an existing user on the given account.
       *
       * @alias analytics.management.accountUserLinks.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to update the account-user link for.
       * @param {string} params.linkId Link ID to update the account-user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/entityUserLinks/{linkId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'linkId'],
          pathParams: ['accountId', 'linkId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    accounts: {

      /**
       * analytics.management.accounts.list
       *
       * @desc Lists all accounts to which the user has access.
       *
       * @alias analytics.management.accounts.list
       * @memberOf! analytics(v3)
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts',
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

    customDataSources: {

      /**
       * analytics.management.customDataSources.list
       *
       * @desc List custom data sources to which the user has access.
       *
       * @alias analytics.management.customDataSources.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account Id for the custom data sources to retrieve.
       * @param {integer=} params.max-results The maximum number of custom data sources to include in this response.
       * @param {integer=} params.start-index A 1-based index of the first custom data source to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property Id for the custom data sources to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources',
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

    customDimensions: {

      /**
       * analytics.management.customDimensions.get
       *
       * @desc Get a custom dimension to which the user has access.
       *
       * @alias analytics.management.customDimensions.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom dimension to retrieve.
       * @param {string} params.customDimensionId The ID of the custom dimension to retrieve.
       * @param {string} params.webPropertyId Web property ID for the custom dimension to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
          pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customDimensions.insert
       *
       * @desc Create a new custom dimension.
       *
       * @alias analytics.management.customDimensions.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom dimension to create.
       * @param {string} params.webPropertyId Web property ID for the custom dimension to create.
       * @param {analytics(v3).CustomDimension} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customDimensions.list
       *
       * @desc Lists custom dimensions to which the user has access.
       *
       * @alias analytics.management.customDimensions.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom dimensions to retrieve.
       * @param {integer=} params.max-results The maximum number of custom dimensions to include in this response.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID for the custom dimensions to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customDimensions.patch
       *
       * @desc Updates an existing custom dimension. This method supports patch semantics.
       *
       * @alias analytics.management.customDimensions.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom dimension to update.
       * @param {string} params.customDimensionId Custom dimension ID for the custom dimension to update.
       * @param {boolean=} params.ignoreCustomDataSourceLinks Force the update and ignore any warnings related to the custom dimension being linked to a custom data source / data set.
       * @param {string} params.webPropertyId Web property ID for the custom dimension to update.
       * @param {analytics(v3).CustomDimension} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
          pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customDimensions.update
       *
       * @desc Updates an existing custom dimension.
       *
       * @alias analytics.management.customDimensions.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom dimension to update.
       * @param {string} params.customDimensionId Custom dimension ID for the custom dimension to update.
       * @param {boolean=} params.ignoreCustomDataSourceLinks Force the update and ignore any warnings related to the custom dimension being linked to a custom data source / data set.
       * @param {string} params.webPropertyId Web property ID for the custom dimension to update.
       * @param {analytics(v3).CustomDimension} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
          pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    customMetrics: {

      /**
       * analytics.management.customMetrics.get
       *
       * @desc Get a custom metric to which the user has access.
       *
       * @alias analytics.management.customMetrics.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom metric to retrieve.
       * @param {string} params.customMetricId The ID of the custom metric to retrieve.
       * @param {string} params.webPropertyId Web property ID for the custom metric to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
          pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customMetrics.insert
       *
       * @desc Create a new custom metric.
       *
       * @alias analytics.management.customMetrics.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom metric to create.
       * @param {string} params.webPropertyId Web property ID for the custom dimension to create.
       * @param {analytics(v3).CustomMetric} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customMetrics.list
       *
       * @desc Lists custom metrics to which the user has access.
       *
       * @alias analytics.management.customMetrics.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom metrics to retrieve.
       * @param {integer=} params.max-results The maximum number of custom metrics to include in this response.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID for the custom metrics to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customMetrics.patch
       *
       * @desc Updates an existing custom metric. This method supports patch semantics.
       *
       * @alias analytics.management.customMetrics.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom metric to update.
       * @param {string} params.customMetricId Custom metric ID for the custom metric to update.
       * @param {boolean=} params.ignoreCustomDataSourceLinks Force the update and ignore any warnings related to the custom metric being linked to a custom data source / data set.
       * @param {string} params.webPropertyId Web property ID for the custom metric to update.
       * @param {analytics(v3).CustomMetric} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
          pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.customMetrics.update
       *
       * @desc Updates an existing custom metric.
       *
       * @alias analytics.management.customMetrics.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the custom metric to update.
       * @param {string} params.customMetricId Custom metric ID for the custom metric to update.
       * @param {boolean=} params.ignoreCustomDataSourceLinks Force the update and ignore any warnings related to the custom metric being linked to a custom data source / data set.
       * @param {string} params.webPropertyId Web property ID for the custom metric to update.
       * @param {analytics(v3).CustomMetric} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
          pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    experiments: {

      /**
       * analytics.management.experiments.delete
       *
       * @desc Delete an experiment.
       *
       * @alias analytics.management.experiments.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the experiment belongs
       * @param {string} params.experimentId ID of the experiment to delete
       * @param {string} params.profileId View (Profile) ID to which the experiment belongs
       * @param {string} params.webPropertyId Web property ID to which the experiment belongs
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'experimentId'],
          pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.experiments.get
       *
       * @desc Returns an experiment to which the user has access.
       *
       * @alias analytics.management.experiments.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve the experiment for.
       * @param {string} params.experimentId Experiment ID to retrieve the experiment for.
       * @param {string} params.profileId View (Profile) ID to retrieve the experiment for.
       * @param {string} params.webPropertyId Web property ID to retrieve the experiment for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'experimentId'],
          pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.experiments.insert
       *
       * @desc Create a new experiment.
       *
       * @alias analytics.management.experiments.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the experiment for.
       * @param {string} params.profileId View (Profile) ID to create the experiment for.
       * @param {string} params.webPropertyId Web property ID to create the experiment for.
       * @param {analytics(v3).Experiment} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.experiments.list
       *
       * @desc Lists experiments to which the user has access.
       *
       * @alias analytics.management.experiments.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve experiments for.
       * @param {integer=} params.max-results The maximum number of experiments to include in this response.
       * @param {string} params.profileId View (Profile) ID to retrieve experiments for.
       * @param {integer=} params.start-index An index of the first experiment to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID to retrieve experiments for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.experiments.patch
       *
       * @desc Update an existing experiment. This method supports patch semantics.
       *
       * @alias analytics.management.experiments.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID of the experiment to update.
       * @param {string} params.experimentId Experiment ID of the experiment to update.
       * @param {string} params.profileId View (Profile) ID of the experiment to update.
       * @param {string} params.webPropertyId Web property ID of the experiment to update.
       * @param {analytics(v3).Experiment} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'experimentId'],
          pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.experiments.update
       *
       * @desc Update an existing experiment.
       *
       * @alias analytics.management.experiments.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID of the experiment to update.
       * @param {string} params.experimentId Experiment ID of the experiment to update.
       * @param {string} params.profileId View (Profile) ID of the experiment to update.
       * @param {string} params.webPropertyId Web property ID of the experiment to update.
       * @param {analytics(v3).Experiment} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'experimentId'],
          pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    filters: {

      /**
       * analytics.management.filters.delete
       *
       * @desc Delete a filter.
       *
       * @alias analytics.management.filters.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the filter for.
       * @param {string} params.filterId ID of the filter to be deleted.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters/{filterId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'filterId'],
          pathParams: ['accountId', 'filterId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.filters.get
       *
       * @desc Returns a filters to which the user has access.
       *
       * @alias analytics.management.filters.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve filters for.
       * @param {string} params.filterId Filter ID to retrieve filters for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters/{filterId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'filterId'],
          pathParams: ['accountId', 'filterId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.filters.insert
       *
       * @desc Create a new filter.
       *
       * @alias analytics.management.filters.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create filter for.
       * @param {analytics(v3).Filter} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.filters.list
       *
       * @desc Lists all filters for an account
       *
       * @alias analytics.management.filters.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve filters for.
       * @param {integer=} params.max-results The maximum number of filters to include in this response.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.filters.patch
       *
       * @desc Updates an existing filter. This method supports patch semantics.
       *
       * @alias analytics.management.filters.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the filter belongs.
       * @param {string} params.filterId ID of the filter to be updated.
       * @param {analytics(v3).Filter} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters/{filterId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'filterId'],
          pathParams: ['accountId', 'filterId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.filters.update
       *
       * @desc Updates an existing filter.
       *
       * @alias analytics.management.filters.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the filter belongs.
       * @param {string} params.filterId ID of the filter to be updated.
       * @param {analytics(v3).Filter} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/filters/{filterId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'filterId'],
          pathParams: ['accountId', 'filterId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    goals: {

      /**
       * analytics.management.goals.get
       *
       * @desc Gets a goal to which the user has access.
       *
       * @alias analytics.management.goals.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve the goal for.
       * @param {string} params.goalId Goal ID to retrieve the goal for.
       * @param {string} params.profileId View (Profile) ID to retrieve the goal for.
       * @param {string} params.webPropertyId Web property ID to retrieve the goal for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
          pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.goals.insert
       *
       * @desc Create a new goal.
       *
       * @alias analytics.management.goals.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the goal for.
       * @param {string} params.profileId View (Profile) ID to create the goal for.
       * @param {string} params.webPropertyId Web property ID to create the goal for.
       * @param {analytics(v3).Goal} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.goals.list
       *
       * @desc Lists goals to which the user has access.
       *
       * @alias analytics.management.goals.list
       * @memberOf! analytics(v3)
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.goals.patch
       *
       * @desc Updates an existing goal. This method supports patch semantics.
       *
       * @alias analytics.management.goals.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to update the goal.
       * @param {string} params.goalId Index of the goal to be updated.
       * @param {string} params.profileId View (Profile) ID to update the goal.
       * @param {string} params.webPropertyId Web property ID to update the goal.
       * @param {analytics(v3).Goal} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
          pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.goals.update
       *
       * @desc Updates an existing goal.
       *
       * @alias analytics.management.goals.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to update the goal.
       * @param {string} params.goalId Index of the goal to be updated.
       * @param {string} params.profileId View (Profile) ID to update the goal.
       * @param {string} params.webPropertyId Web property ID to update the goal.
       * @param {analytics(v3).Goal} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
          pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    profileFilterLinks: {

      /**
       * analytics.management.profileFilterLinks.delete
       *
       * @desc Delete a profile filter link.
       *
       * @alias analytics.management.profileFilterLinks.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the profile filter link belongs.
       * @param {string} params.linkId ID of the profile filter link to delete.
       * @param {string} params.profileId Profile ID to which the filter link belongs.
       * @param {string} params.webPropertyId Web property Id to which the profile filter link belongs.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileFilterLinks.get
       *
       * @desc Returns a single profile filter link.
       *
       * @alias analytics.management.profileFilterLinks.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve profile filter link for.
       * @param {string} params.linkId ID of the profile filter link.
       * @param {string} params.profileId Profile ID to retrieve filter link for.
       * @param {string} params.webPropertyId Web property Id to retrieve profile filter link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileFilterLinks.insert
       *
       * @desc Create a new profile filter link.
       *
       * @alias analytics.management.profileFilterLinks.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create profile filter link for.
       * @param {string} params.profileId Profile ID to create filter link for.
       * @param {string} params.webPropertyId Web property Id to create profile filter link for.
       * @param {analytics(v3).ProfileFilterLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileFilterLinks.list
       *
       * @desc Lists all profile filter links for a profile.
       *
       * @alias analytics.management.profileFilterLinks.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve profile filter links for.
       * @param {integer=} params.max-results The maximum number of profile filter links to include in this response.
       * @param {string} params.profileId Profile ID to retrieve filter links for. Can either be a specific profile ID or '~all', which refers to all the profiles that user has access to.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property Id for profile filter links for. Can either be a specific web property ID or '~all', which refers to all the web properties that user has access to.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileFilterLinks.patch
       *
       * @desc Update an existing profile filter link. This method supports patch semantics.
       *
       * @alias analytics.management.profileFilterLinks.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which profile filter link belongs.
       * @param {string} params.linkId ID of the profile filter link to be updated.
       * @param {string} params.profileId Profile ID to which filter link belongs
       * @param {string} params.webPropertyId Web property Id to which profile filter link belongs
       * @param {analytics(v3).ProfileFilterLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileFilterLinks.update
       *
       * @desc Update an existing profile filter link.
       *
       * @alias analytics.management.profileFilterLinks.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which profile filter link belongs.
       * @param {string} params.linkId ID of the profile filter link to be updated.
       * @param {string} params.profileId Profile ID to which filter link belongs
       * @param {string} params.webPropertyId Web property Id to which profile filter link belongs
       * @param {analytics(v3).ProfileFilterLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    profileUserLinks: {

      /**
       * analytics.management.profileUserLinks.delete
       *
       * @desc Removes a user from the given view (profile).
       *
       * @alias analytics.management.profileUserLinks.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the user link for.
       * @param {string} params.linkId Link ID to delete the user link for.
       * @param {string} params.profileId View (Profile) ID to delete the user link for.
       * @param {string} params.webPropertyId Web Property ID to delete the user link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks/{linkId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileUserLinks.insert
       *
       * @desc Adds a new user to the given view (profile).
       *
       * @alias analytics.management.profileUserLinks.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the user link for.
       * @param {string} params.profileId View (Profile) ID to create the user link for.
       * @param {string} params.webPropertyId Web Property ID to create the user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileUserLinks.list
       *
       * @desc Lists profile-user links for a given view (profile).
       *
       * @alias analytics.management.profileUserLinks.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID which the given view (profile) belongs to.
       * @param {integer=} params.max-results The maximum number of profile-user links to include in this response.
       * @param {string} params.profileId View (Profile) ID to retrieve the profile-user links for. Can either be a specific profile ID or '~all', which refers to all the profiles that user has access to.
       * @param {integer=} params.start-index An index of the first profile-user link to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web Property ID which the given view (profile) belongs to. Can either be a specific web property ID or '~all', which refers to all the web properties that user has access to.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profileUserLinks.update
       *
       * @desc Updates permissions for an existing user on the given view (profile).
       *
       * @alias analytics.management.profileUserLinks.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to update the user link for.
       * @param {string} params.linkId Link ID to update the user link for.
       * @param {string} params.profileId View (Profile ID) to update the user link for.
       * @param {string} params.webPropertyId Web Property ID to update the user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks/{linkId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    profiles: {

      /**
       * analytics.management.profiles.delete
       *
       * @desc Deletes a view (profile).
       *
       * @alias analytics.management.profiles.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the view (profile) for.
       * @param {string} params.profileId ID of the view (profile) to be deleted.
       * @param {string} params.webPropertyId Web property ID to delete the view (profile) for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profiles.get
       *
       * @desc Gets a view (profile) to which the user has access.
       *
       * @alias analytics.management.profiles.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve the view (profile) for.
       * @param {string} params.profileId View (Profile) ID to retrieve the view (profile) for.
       * @param {string} params.webPropertyId Web property ID to retrieve the view (profile) for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profiles.insert
       *
       * @desc Create a new view (profile).
       *
       * @alias analytics.management.profiles.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the view (profile) for.
       * @param {string} params.webPropertyId Web property ID to create the view (profile) for.
       * @param {analytics(v3).Profile} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profiles.list
       *
       * @desc Lists views (profiles) to which the user has access.
       *
       * @alias analytics.management.profiles.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID for the view (profiles) to retrieve. Can either be a specific account ID or '~all', which refers to all the accounts to which the user has access.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profiles.patch
       *
       * @desc Updates an existing view (profile). This method supports patch semantics.
       *
       * @alias analytics.management.profiles.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the view (profile) belongs
       * @param {string} params.profileId ID of the view (profile) to be updated.
       * @param {string} params.webPropertyId Web property ID to which the view (profile) belongs
       * @param {analytics(v3).Profile} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.profiles.update
       *
       * @desc Updates an existing view (profile).
       *
       * @alias analytics.management.profiles.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the view (profile) belongs
       * @param {string} params.profileId ID of the view (profile) to be updated.
       * @param {string} params.webPropertyId Web property ID to which the view (profile) belongs
       * @param {analytics(v3).Profile} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    remarketingAudience: {

      /**
       * analytics.management.remarketingAudience.get
       *
       * @desc Gets a remarketing audience to which the user has access.
       *
       * @alias analytics.management.remarketingAudience.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The account ID of the remarketing audience to retrieve.
       * @param {string} params.remarketingAudienceId The ID of the remarketing audience to retrieve.
       * @param {string} params.webPropertyId The web property ID of the remarketing audience to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
          pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.remarketingAudience.insert
       *
       * @desc Creates a new remarketing audience.
       *
       * @alias analytics.management.remarketingAudience.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The account ID for which to create the remarketing audience.
       * @param {string} params.webPropertyId Web property ID for which to create the remarketing audience.
       * @param {analytics(v3).RemarketingAudience} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.remarketingAudience.list
       *
       * @desc Lists remarketing audiences to which the user has access.
       *
       * @alias analytics.management.remarketingAudience.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The account ID of the remarketing audiences to retrieve.
       * @param {integer=} params.max-results The maximum number of remarketing audiences to include in this response.
       * @param {integer=} params.start-index An index of the first entity to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string=} params.type 
       * @param {string} params.webPropertyId The web property ID of the remarketing audiences to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.remarketingAudience.patch
       *
       * @desc Updates an existing remarketing audience. This method supports patch semantics.
       *
       * @alias analytics.management.remarketingAudience.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The account ID of the remarketing audience to update.
       * @param {string} params.remarketingAudienceId The ID of the remarketing audience to update.
       * @param {string} params.webPropertyId The web property ID of the remarketing audience to update.
       * @param {analytics(v3).RemarketingAudience} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
          pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.remarketingAudience.update
       *
       * @desc Updates an existing remarketing audience.
       *
       * @alias analytics.management.remarketingAudience.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The account ID of the remarketing audience to update.
       * @param {string} params.remarketingAudienceId The ID of the remarketing audience to update.
       * @param {string} params.webPropertyId The web property ID of the remarketing audience to update.
       * @param {analytics(v3).RemarketingAudience} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
          pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    segments: {

      /**
       * analytics.management.segments.list
       *
       * @desc Lists segments to which the user has access.
       *
       * @alias analytics.management.segments.list
       * @memberOf! analytics(v3)
       *
       * @param {object=} params Parameters for request
       * @param {integer=} params.max-results The maximum number of segments to include in this response.
       * @param {integer=} params.start-index An index of the first segment to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
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
            url: 'https://www.googleapis.com/analytics/v3/management/segments',
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

    unsampledReports: {

      /**
       * analytics.management.unsampledReports.delete
       *
       * @desc Deletes an unsampled report.
       *
       * @alias analytics.management.unsampledReports.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the unsampled report for.
       * @param {string} params.profileId View (Profile) ID to delete the unsampled report for.
       * @param {string} params.unsampledReportId ID of the unsampled report to be deleted.
       * @param {string} params.webPropertyId Web property ID to delete the unsampled reports for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports/{unsampledReportId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'unsampledReportId'],
          pathParams: ['accountId', 'profileId', 'unsampledReportId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.unsampledReports.get
       *
       * @desc Returns a single unsampled report.
       *
       * @alias analytics.management.unsampledReports.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve unsampled report for.
       * @param {string} params.profileId View (Profile) ID to retrieve unsampled report for.
       * @param {string} params.unsampledReportId ID of the unsampled report to retrieve.
       * @param {string} params.webPropertyId Web property ID to retrieve unsampled reports for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports/{unsampledReportId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId', 'unsampledReportId'],
          pathParams: ['accountId', 'profileId', 'unsampledReportId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.unsampledReports.insert
       *
       * @desc Create a new unsampled report.
       *
       * @alias analytics.management.unsampledReports.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the unsampled report for.
       * @param {string} params.profileId View (Profile) ID to create the unsampled report for.
       * @param {string} params.webPropertyId Web property ID to create the unsampled report for.
       * @param {analytics(v3).UnsampledReport} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'profileId'],
          pathParams: ['accountId', 'profileId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.unsampledReports.list
       *
       * @desc Lists unsampled reports to which the user has access.
       *
       * @alias analytics.management.unsampledReports.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve unsampled reports for. Must be a specific account ID, ~all is not supported.
       * @param {integer=} params.max-results The maximum number of unsampled reports to include in this response.
       * @param {string} params.profileId View (Profile) ID to retrieve unsampled reports for. Must be a specific view (profile) ID, ~all is not supported.
       * @param {integer=} params.start-index An index of the first unsampled report to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID to retrieve unsampled reports for. Must be a specific web property ID, ~all is not supported.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports',
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

    uploads: {

      /**
       * analytics.management.uploads.deleteUploadData
       *
       * @desc Delete data associated with a previous upload.
       *
       * @alias analytics.management.uploads.deleteUploadData
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account Id for the uploads to be deleted.
       * @param {string} params.customDataSourceId Custom data source Id for the uploads to be deleted.
       * @param {string} params.webPropertyId Web property Id for the uploads to be deleted.
       * @param {analytics(v3).AnalyticsDataimportDeleteUploadDataRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      deleteUploadData: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/deleteUploadData',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
          pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.uploads.get
       *
       * @desc List uploads to which the user has access.
       *
       * @alias analytics.management.uploads.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account Id for the upload to retrieve.
       * @param {string} params.customDataSourceId Custom data source Id for upload to retrieve.
       * @param {string} params.uploadId Upload Id to retrieve.
       * @param {string} params.webPropertyId Web property Id for the upload to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads/{uploadId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId', 'uploadId'],
          pathParams: ['accountId', 'customDataSourceId', 'uploadId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.uploads.list
       *
       * @desc List uploads to which the user has access.
       *
       * @alias analytics.management.uploads.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account Id for the uploads to retrieve.
       * @param {string} params.customDataSourceId Custom data source Id for uploads to retrieve.
       * @param {integer=} params.max-results The maximum number of uploads to include in this response.
       * @param {integer=} params.start-index A 1-based index of the first upload to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property Id for the uploads to retrieve.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
          pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.uploads.uploadData
       *
       * @desc Upload data for a custom data source.
       *
       * @alias analytics.management.uploads.uploadData
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account Id associated with the upload.
       * @param {string} params.customDataSourceId Custom data source Id to which the data being uploaded belongs.
       * @param {string} params.webPropertyId Web property UA-string associated with the upload.
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      uploadData: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads',
          requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
          pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    webPropertyAdWordsLinks: {

      /**
       * analytics.management.webPropertyAdWordsLinks.delete
       *
       * @desc Deletes a web property-AdWords link.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the account which the given web property belongs to.
       * @param {string} params.webPropertyAdWordsLinkId Web property AdWords link ID.
       * @param {string} params.webPropertyId Web property ID to delete the AdWords link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'webPropertyAdWordsLinkId'],
          pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webPropertyAdWordsLinks.get
       *
       * @desc Returns a web property-AdWords link to which the user has access.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the account which the given web property belongs to.
       * @param {string} params.webPropertyAdWordsLinkId Web property-AdWords link ID.
       * @param {string} params.webPropertyId Web property ID to retrieve the AdWords link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'webPropertyAdWordsLinkId'],
          pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webPropertyAdWordsLinks.insert
       *
       * @desc Creates a webProperty-AdWords link.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the Google Analytics account to create the link for.
       * @param {string} params.webPropertyId Web property ID to create the link for.
       * @param {analytics(v3).EntityAdWordsLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webPropertyAdWordsLinks.list
       *
       * @desc Lists webProperty-AdWords links for a given web property.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the account which the given web property belongs to.
       * @param {integer=} params.max-results The maximum number of webProperty-AdWords links to include in this response.
       * @param {integer=} params.start-index An index of the first webProperty-AdWords link to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web property ID to retrieve the AdWords links for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webPropertyAdWordsLinks.patch
       *
       * @desc Updates an existing webProperty-AdWords link. This method supports patch semantics.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the account which the given web property belongs to.
       * @param {string} params.webPropertyAdWordsLinkId Web property-AdWords link ID.
       * @param {string} params.webPropertyId Web property ID to retrieve the AdWords link for.
       * @param {analytics(v3).EntityAdWordsLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'webPropertyAdWordsLinkId'],
          pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webPropertyAdWordsLinks.update
       *
       * @desc Updates an existing webProperty-AdWords link.
       *
       * @alias analytics.management.webPropertyAdWordsLinks.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId ID of the account which the given web property belongs to.
       * @param {string} params.webPropertyAdWordsLinkId Web property-AdWords link ID.
       * @param {string} params.webPropertyId Web property ID to retrieve the AdWords link for.
       * @param {analytics(v3).EntityAdWordsLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'webPropertyAdWordsLinkId'],
          pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    webproperties: {

      /**
       * analytics.management.webproperties.get
       *
       * @desc Gets a web property to which the user has access.
       *
       * @alias analytics.management.webproperties.get
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to retrieve the web property for.
       * @param {string} params.webPropertyId ID to retrieve the web property for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webproperties.insert
       *
       * @desc Create a new property if the account has fewer than 20 properties. Web properties are visible in the Google Analytics interface only if they have at least one profile.
       *
       * @alias analytics.management.webproperties.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the web property for.
       * @param {analytics(v3).Webproperty} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webproperties.list
       *
       * @desc Lists web properties to which the user has access.
       *
       * @alias analytics.management.webproperties.list
       * @memberOf! analytics(v3)
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webproperties.patch
       *
       * @desc Updates an existing web property. This method supports patch semantics.
       *
       * @alias analytics.management.webproperties.patch
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the web property belongs
       * @param {string} params.webPropertyId Web property ID
       * @param {analytics(v3).Webproperty} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webproperties.update
       *
       * @desc Updates an existing web property.
       *
       * @alias analytics.management.webproperties.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to which the web property belongs
       * @param {string} params.webPropertyId Web property ID
       * @param {analytics(v3).Webproperty} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    webpropertyUserLinks: {

      /**
       * analytics.management.webpropertyUserLinks.delete
       *
       * @desc Removes a user from the given web property.
       *
       * @alias analytics.management.webpropertyUserLinks.delete
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to delete the user link for.
       * @param {string} params.linkId Link ID to delete the user link for.
       * @param {string} params.webPropertyId Web Property ID to delete the user link for.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks/{linkId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webpropertyUserLinks.insert
       *
       * @desc Adds a new user to the given web property.
       *
       * @alias analytics.management.webpropertyUserLinks.insert
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to create the user link for.
       * @param {string} params.webPropertyId Web Property ID to create the user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webpropertyUserLinks.list
       *
       * @desc Lists webProperty-user links for a given web property.
       *
       * @alias analytics.management.webpropertyUserLinks.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID which the given web property belongs to.
       * @param {integer=} params.max-results The maximum number of webProperty-user Links to include in this response.
       * @param {integer=} params.start-index An index of the first webProperty-user link to retrieve. Use this parameter as a pagination mechanism along with the max-results parameter.
       * @param {string} params.webPropertyId Web Property ID for the webProperty-user links to retrieve. Can either be a specific web property ID or '~all', which refers to all the web properties that user has access to.
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId'],
          pathParams: ['accountId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * analytics.management.webpropertyUserLinks.update
       *
       * @desc Updates permissions for an existing user on the given web property.
       *
       * @alias analytics.management.webpropertyUserLinks.update
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account ID to update the account-user link for.
       * @param {string} params.linkId Link ID to update the account-user link for.
       * @param {string} params.webPropertyId Web property ID to update the account-user link for.
       * @param {analytics(v3).EntityUserLink} params.resource Request body data
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
            url: 'https://www.googleapis.com/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks/{linkId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'webPropertyId', 'linkId'],
          pathParams: ['accountId', 'linkId', 'webPropertyId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.metadata = {

    columns: {

      /**
       * analytics.metadata.columns.list
       *
       * @desc Lists all columns for a report type
       *
       * @alias analytics.metadata.columns.list
       * @memberOf! analytics(v3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.reportType Report type. Allowed Values: 'ga'. Where 'ga' corresponds to the Core Reporting API
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
            url: 'https://www.googleapis.com/analytics/v3/metadata/{reportType}/columns',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['reportType'],
          pathParams: ['reportType'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.provisioning = {

    /**
     * analytics.provisioning.createAccountTicket
     *
     * @desc Creates an account ticket.
     *
     * @alias analytics.provisioning.createAccountTicket
     * @memberOf! analytics(v3)
     *
     * @param {object} params Parameters for request
     * @param {analytics(v3).AccountTicket} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createAccountTicket: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/analytics/v3/provisioning/createAccountTicket',
          method: 'POST'
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
 * @typedef Account
 * @memberOf! analytics(v3)
 * @type object
 * @property {object} childLink Child link for an account entry. Points to the list of web properties for this account.
 * @property {string} created Time the account was created.
 * @property {string} id Account ID.
 * @property {string} kind Resource type for Analytics account.
 * @property {string} name Account name.
 * @property {object} permissions Permissions the user has for this account.
 * @property {string} selfLink Link for this account.
 * @property {boolean} starred Indicates whether this account is starred or not.
 * @property {string} updated Time the account was last modified.
 */
/**
 * @typedef AccountRef
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} href Link for this account.
 * @property {string} id Account ID.
 * @property {string} kind Analytics account reference.
 * @property {string} name Account name.
 */
/**
 * @typedef AccountSummaries
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).AccountSummary[]} items A list of AccountSummaries.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this AccountSummary collection.
 * @property {string} previousLink Link to previous page for this AccountSummary collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef AccountSummary
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} id Account ID.
 * @property {string} kind Resource type for Analytics AccountSummary.
 * @property {string} name Account name.
 * @property {boolean} starred Indicates whether this account is starred or not.
 * @property {analytics(v3).WebPropertySummary[]} webProperties List of web properties under this account.
 */
/**
 * @typedef AccountTicket
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Account} account Account for this ticket.
 * @property {string} id Account ticket ID used to access the account ticket.
 * @property {string} kind Resource type for account ticket.
 * @property {analytics(v3).Profile} profile View (Profile) for the account.
 * @property {string} redirectUri Redirect URI where the user will be sent after accepting Terms of Service. Must be configured in APIs console as a callback URL.
 * @property {analytics(v3).Webproperty} webproperty Web property for the account.
 */
/**
 * @typedef Accounts
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Account[]} items A list of accounts.
 * @property {integer} itemsPerPage The maximum number of entries the response can contain, regardless of the actual number of entries returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Next link for this account collection.
 * @property {string} previousLink Previous link for this account collection.
 * @property {integer} startIndex The starting index of the entries, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef AdWordsAccount
 * @memberOf! analytics(v3)
 * @type object
 * @property {boolean} autoTaggingEnabled True if auto-tagging is enabled on the AdWords account. Read-only after the insert operation.
 * @property {string} customerId Customer ID. This field is required when creating an AdWords link.
 * @property {string} kind Resource type for AdWords account.
 */
/**
 * @typedef AnalyticsDataimportDeleteUploadDataRequest
 * @memberOf! analytics(v3)
 * @type object
 * @property {string[]} customDataImportUids A list of upload UIDs.
 */
/**
 * @typedef Column
 * @memberOf! analytics(v3)
 * @type object
 * @property {object} attributes Map of attribute name and value for this column.
 * @property {string} id Column id.
 * @property {string} kind Resource type for Analytics column.
 */
/**
 * @typedef Columns
 * @memberOf! analytics(v3)
 * @type object
 * @property {string[]} attributeNames List of attributes names returned by columns.
 * @property {string} etag Etag of collection. This etag can be compared with the last response etag to check if response has changed.
 * @property {analytics(v3).Column[]} items List of columns for a report type.
 * @property {string} kind Collection type.
 * @property {integer} totalResults Total number of columns returned in the response.
 */
/**
 * @typedef CustomDataSource
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this custom data source belongs.
 * @property {object} childLink 
 * @property {string} created Time this custom data source was created.
 * @property {string} description Description of custom data source.
 * @property {string} id Custom data source ID.
 * @property {string} importBehavior 
 * @property {string} kind Resource type for Analytics custom data source.
 * @property {string} name Name of this custom data source.
 * @property {object} parentLink Parent link for this custom data source. Points to the web property to which this custom data source belongs.
 * @property {string[]} profilesLinked IDs of views (profiles) linked to the custom data source.
 * @property {string} selfLink Link for this Analytics custom data source.
 * @property {string} type Type of the custom data source.
 * @property {string} updated Time this custom data source was last modified.
 * @property {string} uploadType 
 * @property {string} webPropertyId Web property ID of the form UA-XXXXX-YY to which this custom data source belongs.
 */
/**
 * @typedef CustomDataSources
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).CustomDataSource[]} items Collection of custom data sources.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this custom data source collection.
 * @property {string} previousLink Link to previous page for this custom data source collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef CustomDimension
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID.
 * @property {boolean} active Boolean indicating whether the custom dimension is active.
 * @property {string} created Time the custom dimension was created.
 * @property {string} id Custom dimension ID.
 * @property {integer} index Index of the custom dimension.
 * @property {string} kind Kind value for a custom dimension. Set to &quot;analytics#customDimension&quot;. It is a read-only field.
 * @property {string} name Name of the custom dimension.
 * @property {object} parentLink Parent link for the custom dimension. Points to the property to which the custom dimension belongs.
 * @property {string} scope Scope of the custom dimension: HIT, SESSION, USER or PRODUCT.
 * @property {string} selfLink Link for the custom dimension
 * @property {string} updated Time the custom dimension was last modified.
 * @property {string} webPropertyId Property ID.
 */
/**
 * @typedef CustomDimensions
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).CustomDimension[]} items Collection of custom dimensions.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this custom dimension collection.
 * @property {string} previousLink Link to previous page for this custom dimension collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef CustomMetric
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID.
 * @property {boolean} active Boolean indicating whether the custom metric is active.
 * @property {string} created Time the custom metric was created.
 * @property {string} id Custom metric ID.
 * @property {integer} index Index of the custom metric.
 * @property {string} kind Kind value for a custom metric. Set to &quot;analytics#customMetric&quot;. It is a read-only field.
 * @property {string} max_value Max value of custom metric.
 * @property {string} min_value Min value of custom metric.
 * @property {string} name Name of the custom metric.
 * @property {object} parentLink Parent link for the custom metric. Points to the property to which the custom metric belongs.
 * @property {string} scope Scope of the custom metric: HIT or PRODUCT.
 * @property {string} selfLink Link for the custom metric
 * @property {string} type Data type of custom metric.
 * @property {string} updated Time the custom metric was last modified.
 * @property {string} webPropertyId Property ID.
 */
/**
 * @typedef CustomMetrics
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).CustomMetric[]} items Collection of custom metrics.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this custom metric collection.
 * @property {string} previousLink Link to previous page for this custom metric collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef EntityAdWordsLink
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).AdWordsAccount[]} adWordsAccounts A list of AdWords client accounts. These cannot be MCC accounts. This field is required when creating an AdWords link. It cannot be empty.
 * @property {object} entity Web property being linked.
 * @property {string} id Entity AdWords link ID
 * @property {string} kind Resource type for entity AdWords link.
 * @property {string} name Name of the link. This field is required when creating an AdWords link.
 * @property {string[]} profileIds IDs of linked Views (Profiles) represented as strings.
 * @property {string} selfLink URL link for this Google Analytics - Google AdWords link.
 */
/**
 * @typedef EntityAdWordsLinks
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).EntityAdWordsLink[]} items A list of entity AdWords links.
 * @property {integer} itemsPerPage The maximum number of entries the response can contain, regardless of the actual number of entries returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Next link for this AdWords link collection.
 * @property {string} previousLink Previous link for this AdWords link collection.
 * @property {integer} startIndex The starting index of the entries, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 */
/**
 * @typedef EntityUserLink
 * @memberOf! analytics(v3)
 * @type object
 * @property {object} entity Entity for this link. It can be an account, a web property, or a view (profile).
 * @property {string} id Entity user link ID
 * @property {string} kind Resource type for entity user link.
 * @property {object} permissions Permissions the user has for this entity.
 * @property {string} selfLink Self link for this resource.
 * @property {analytics(v3).UserRef} userRef User reference.
 */
/**
 * @typedef EntityUserLinks
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).EntityUserLink[]} items A list of entity user links.
 * @property {integer} itemsPerPage The maximum number of entries the response can contain, regardless of the actual number of entries returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Next link for this account collection.
 * @property {string} previousLink Previous link for this account collection.
 * @property {integer} startIndex The starting index of the entries, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 */
/**
 * @typedef Experiment
 * @memberOf! analytics(v3)
 * @type object
* @property {string} accountId Account ID to which this experiment belongs. This field is read-only.
* @property {string} created Time the experiment was created. This field is read-only.
* @property {string} description Notes about this experiment.
* @property {boolean} editableInGaUi If true, the end user will be able to edit the experiment via the Google Analytics user interface.
* @property {string} endTime The ending time of the experiment (the time the status changed from RUNNING to ENDED). This field is present only if the experiment has ended. This field is read-only.
* @property {boolean} equalWeighting Boolean specifying whether to distribute traffic evenly across all variations. If the value is False, content experiments follows the default behavior of adjusting traffic dynamically based on variation performance. Optional -- defaults to False. This field may not be changed for an experiment whose status is ENDED.
* @property {string} id Experiment ID. Required for patch and update. Disallowed for create.
* @property {string} internalWebPropertyId Internal ID for the web property to which this experiment belongs. This field is read-only.
* @property {string} kind Resource type for an Analytics experiment. This field is read-only.
* @property {integer} minimumExperimentLengthInDays An integer number in [3, 90]. Specifies the minimum length of the experiment. Can be changed for a running experiment. This field may not be changed for an experiments whose status is ENDED.
* @property {string} name Experiment name. This field may not be changed for an experiment whose status is ENDED. This field is required when creating an experiment.
* @property {string} objectiveMetric The metric that the experiment is optimizing. Valid values: &quot;ga:goal(n)Completions&quot;, &quot;ga:adsenseAdsClicks&quot;, &quot;ga:adsenseAdsViewed&quot;, &quot;ga:adsenseRevenue&quot;, &quot;ga:bounces&quot;, &quot;ga:pageviews&quot;, &quot;ga:sessionDuration&quot;, &quot;ga:transactions&quot;, &quot;ga:transactionRevenue&quot;. This field is required if status is &quot;RUNNING&quot; and servingFramework is one of &quot;REDIRECT&quot; or &quot;API&quot;.
* @property {string} optimizationType Whether the objectiveMetric should be minimized or maximized. Possible values: &quot;MAXIMUM&quot;, &quot;MINIMUM&quot;. Optional--defaults to &quot;MAXIMUM&quot;. Cannot be specified without objectiveMetric. Cannot be modified when status is &quot;RUNNING&quot; or &quot;ENDED&quot;.
* @property {object} parentLink Parent link for an experiment. Points to the view (profile) to which this experiment belongs.
* @property {string} profileId View (Profile) ID to which this experiment belongs. This field is read-only.
* @property {string} reasonExperimentEnded Why the experiment ended. Possible values: &quot;STOPPED_BY_USER&quot;, &quot;WINNER_FOUND&quot;, &quot;EXPERIMENT_EXPIRED&quot;, &quot;ENDED_WITH_NO_WINNER&quot;, &quot;GOAL_OBJECTIVE_CHANGED&quot;. &quot;ENDED_WITH_NO_WINNER&quot; means that the experiment didn&#39;t expire but no winner was projected to be found. If the experiment status is changed via the API to ENDED this field is set to STOPPED_BY_USER. This field is read-only.
* @property {boolean} rewriteVariationUrlsAsOriginal Boolean specifying whether variations URLS are rewritten to match those of the original. This field may not be changed for an experiments whose status is ENDED.
* @property {string} selfLink Link for this experiment. This field is read-only.
* @property {string} servingFramework The framework used to serve the experiment variations and evaluate the results. One of:  
- REDIRECT: Google Analytics redirects traffic to different variation pages, reports the chosen variation and evaluates the results.
- API: Google Analytics chooses and reports the variation to serve and evaluates the results; the caller is responsible for serving the selected variation.
- EXTERNAL: The variations will be served externally and the chosen variation reported to Google Analytics. The caller is responsible for serving the selected variation and evaluating the results.
* @property {string} snippet The snippet of code to include on the control page(s). This field is read-only.
* @property {string} startTime The starting time of the experiment (the time the status changed from READY_TO_RUN to RUNNING). This field is present only if the experiment has started. This field is read-only.
* @property {string} status Experiment status. Possible values: &quot;DRAFT&quot;, &quot;READY_TO_RUN&quot;, &quot;RUNNING&quot;, &quot;ENDED&quot;. Experiments can be created in the &quot;DRAFT&quot;, &quot;READY_TO_RUN&quot; or &quot;RUNNING&quot; state. This field is required when creating an experiment.
* @property {number} trafficCoverage A floating-point number in (0, 1]. Specifies the fraction of the traffic that participates in the experiment. Can be changed for a running experiment. This field may not be changed for an experiments whose status is ENDED.
* @property {string} updated Time the experiment was last modified. This field is read-only.
* @property {object[]} variations Array of variations. The first variation in the array is the original. The number of variations may not change once an experiment is in the RUNNING state. At least two variations are required before status can be set to RUNNING.
* @property {string} webPropertyId Web property ID to which this experiment belongs. The web property ID is of the form UA-XXXXX-YY. This field is read-only.
* @property {number} winnerConfidenceLevel A floating-point number in (0, 1). Specifies the necessary confidence level to choose a winner. This field may not be changed for an experiments whose status is ENDED.
* @property {boolean} winnerFound Boolean specifying whether a winner has been found for this experiment. This field is read-only.
*/
/**
 * @typedef Experiments
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Experiment[]} items A list of experiments.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this experiment collection.
 * @property {string} previousLink Link to previous page for this experiment collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of resources in the result.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef Filter
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this filter belongs.
 * @property {object} advancedDetails Details for the filter of the type ADVANCED.
 * @property {string} created Time this filter was created.
 * @property {analytics(v3).FilterExpression} excludeDetails Details for the filter of the type EXCLUDE.
 * @property {string} id Filter ID.
 * @property {analytics(v3).FilterExpression} includeDetails Details for the filter of the type INCLUDE.
 * @property {string} kind Resource type for Analytics filter.
 * @property {object} lowercaseDetails Details for the filter of the type LOWER.
 * @property {string} name Name of this filter.
 * @property {object} parentLink Parent link for this filter. Points to the account to which this filter belongs.
 * @property {object} searchAndReplaceDetails Details for the filter of the type SEARCH_AND_REPLACE.
 * @property {string} selfLink Link for this filter.
 * @property {string} type Type of this filter. Possible values are INCLUDE, EXCLUDE, LOWERCASE, UPPERCASE, SEARCH_AND_REPLACE and ADVANCED.
 * @property {string} updated Time this filter was last modified.
 * @property {object} uppercaseDetails Details for the filter of the type UPPER.
 */
/**
 * @typedef FilterExpression
 * @memberOf! analytics(v3)
 * @type object
* @property {boolean} caseSensitive Determines if the filter is case sensitive.
* @property {string} expressionValue Filter expression value
* @property {string} field Field to filter. Possible values:  
- Content and Traffic  
- PAGE_REQUEST_URI, 
- PAGE_HOSTNAME, 
- PAGE_TITLE, 
- REFERRAL, 
- COST_DATA_URI (Campaign target URL), 
- HIT_TYPE, 
- INTERNAL_SEARCH_TERM, 
- INTERNAL_SEARCH_TYPE, 
- SOURCE_PROPERTY_TRACKING_ID,   
- Campaign or AdGroup  
- CAMPAIGN_SOURCE, 
- CAMPAIGN_MEDIUM, 
- CAMPAIGN_NAME, 
- CAMPAIGN_AD_GROUP, 
- CAMPAIGN_TERM, 
- CAMPAIGN_CONTENT, 
- CAMPAIGN_CODE, 
- CAMPAIGN_REFERRAL_PATH,   
- E-Commerce  
- TRANSACTION_COUNTRY, 
- TRANSACTION_REGION, 
- TRANSACTION_CITY, 
- TRANSACTION_AFFILIATION (Store or order location), 
- ITEM_NAME, 
- ITEM_CODE, 
- ITEM_VARIATION, 
- TRANSACTION_ID, 
- TRANSACTION_CURRENCY_CODE, 
- PRODUCT_ACTION_TYPE,   
- Audience/Users  
- BROWSER, 
- BROWSER_VERSION, 
- BROWSER_SIZE, 
- PLATFORM, 
- PLATFORM_VERSION, 
- LANGUAGE, 
- SCREEN_RESOLUTION, 
- SCREEN_COLORS, 
- JAVA_ENABLED (Boolean Field), 
- FLASH_VERSION, 
- GEO_SPEED (Connection speed), 
- VISITOR_TYPE, 
- GEO_ORGANIZATION (ISP organization), 
- GEO_DOMAIN, 
- GEO_IP_ADDRESS, 
- GEO_IP_VERSION,   
- Location  
- GEO_COUNTRY, 
- GEO_REGION, 
- GEO_CITY,   
- Event  
- EVENT_CATEGORY, 
- EVENT_ACTION, 
- EVENT_LABEL,   
- Other  
- CUSTOM_FIELD_1, 
- CUSTOM_FIELD_2, 
- USER_DEFINED_VALUE,   
- Application  
- APP_ID, 
- APP_INSTALLER_ID, 
- APP_NAME, 
- APP_VERSION, 
- SCREEN, 
- IS_APP (Boolean Field), 
- IS_FATAL_EXCEPTION (Boolean Field), 
- EXCEPTION_DESCRIPTION,   
- Mobile device  
- IS_MOBILE (Boolean Field, Deprecated. Use DEVICE_CATEGORY=mobile), 
- IS_TABLET (Boolean Field, Deprecated. Use DEVICE_CATEGORY=tablet), 
- DEVICE_CATEGORY, 
- MOBILE_HAS_QWERTY_KEYBOARD (Boolean Field), 
- MOBILE_HAS_NFC_SUPPORT (Boolean Field), 
- MOBILE_HAS_CELLULAR_RADIO (Boolean Field), 
- MOBILE_HAS_WIFI_SUPPORT (Boolean Field), 
- MOBILE_BRAND_NAME, 
- MOBILE_MODEL_NAME, 
- MOBILE_MARKETING_NAME, 
- MOBILE_POINTING_METHOD,   
- Social  
- SOCIAL_NETWORK, 
- SOCIAL_ACTION, 
- SOCIAL_ACTION_TARGET,   
- Custom dimension  
- CUSTOM_DIMENSION (See accompanying field index),
* @property {integer} fieldIndex The Index of the custom dimension. Set only if the field is a is CUSTOM_DIMENSION.
* @property {string} kind Kind value for filter expression
* @property {string} matchType Match type for this filter. Possible values are BEGINS_WITH, EQUAL, ENDS_WITH, CONTAINS, or MATCHES. GEO_DOMAIN, GEO_IP_ADDRESS, PAGE_REQUEST_URI, or PAGE_HOSTNAME filters can use any match type; all other filters must use MATCHES.
*/
/**
 * @typedef FilterRef
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this filter belongs.
 * @property {string} href Link for this filter.
 * @property {string} id Filter ID.
 * @property {string} kind Kind value for filter reference.
 * @property {string} name Name of this filter.
 */
/**
 * @typedef Filters
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Filter[]} items A list of filters.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1,000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this filter collection.
 * @property {string} previousLink Link to previous page for this filter collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef GaData
 * @memberOf! analytics(v3)
 * @type object
 * @property {object[]} columnHeaders Column headers that list dimension names followed by the metric names. The order of dimensions and metrics is same as specified in the request.
 * @property {boolean} containsSampledData Determines if Analytics data contains samples.
 * @property {string} dataLastRefreshed The last refreshed time in seconds for Analytics data.
 * @property {object} dataTable 
 * @property {string} id Unique ID for this data response.
 * @property {integer} itemsPerPage The maximum number of rows the response can contain, regardless of the actual number of rows returned. Its value ranges from 1 to 10,000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Resource type.
 * @property {string} nextLink Link to next page for this Analytics data query.
 * @property {string} previousLink Link to previous page for this Analytics data query.
 * @property {object} profileInfo Information for the view (profile), for which the Analytics data was requested.
 * @property {object} query Analytics data request query parameters.
 * @property {array[]} rows Analytics data rows, where each row contains a list of dimension values followed by the metric values. The order of dimensions and metrics is same as specified in the request.
 * @property {string} sampleSize The number of samples used to calculate the result.
 * @property {string} sampleSpace Total size of the sample space from which the samples were selected.
 * @property {string} selfLink Link to this page.
 * @property {integer} totalResults The total number of rows for the query, regardless of the number of rows in the response.
 * @property {object} totalsForAllResults Total values for the requested metrics over all the results, not just the results returned in this response. The order of the metric totals is same as the metric order specified in the request.
 */
/**
 * @typedef Goal
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this goal belongs.
 * @property {boolean} active Determines whether this goal is active.
 * @property {string} created Time this goal was created.
 * @property {object} eventDetails Details for the goal of the type EVENT.
 * @property {string} id Goal ID.
 * @property {string} internalWebPropertyId Internal ID for the web property to which this goal belongs.
 * @property {string} kind Resource type for an Analytics goal.
 * @property {string} name Goal name.
 * @property {object} parentLink Parent link for a goal. Points to the view (profile) to which this goal belongs.
 * @property {string} profileId View (Profile) ID to which this goal belongs.
 * @property {string} selfLink Link for this goal.
 * @property {string} type Goal type. Possible values are URL_DESTINATION, VISIT_TIME_ON_SITE, VISIT_NUM_PAGES, AND EVENT.
 * @property {string} updated Time this goal was last modified.
 * @property {object} urlDestinationDetails Details for the goal of the type URL_DESTINATION.
 * @property {number} value Goal value.
 * @property {object} visitNumPagesDetails Details for the goal of the type VISIT_NUM_PAGES.
 * @property {object} visitTimeOnSiteDetails Details for the goal of the type VISIT_TIME_ON_SITE.
 * @property {string} webPropertyId Web property ID to which this goal belongs. The web property ID is of the form UA-XXXXX-YY.
 */
/**
 * @typedef Goals
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Goal[]} items A list of goals.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this goal collection.
 * @property {string} previousLink Link to previous page for this goal collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of resources in the result.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef IncludeConditions
 * @memberOf! analytics(v3)
 * @type object
 * @property {integer} daysToLookBack The look-back window lets you specify a time frame for evaluating the behavior that qualifies users for your audience. For example, if your filters include users from Central Asia, and Transactions Greater than 2, and you set the look-back window to 14 days, then any user from Central Asia whose cumulative transactions exceed 2 during the last 14 days is added to the audience.
 * @property {boolean} isSmartList Boolean indicating whether this segment is a smart list. https://support.google.com/analytics/answer/4628577
 * @property {string} kind Resource type for include conditions.
 * @property {integer} membershipDurationDays Number of days (in the range 1 to 540) a user remains in the audience.
 * @property {string} segment The segment condition that will cause a user to be added to an audience.
 */
/**
 * @typedef LinkedForeignAccount
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this linked foreign account belongs.
 * @property {boolean} eligibleForSearch Boolean indicating whether this is eligible for search.
 * @property {string} id Entity ad account link ID.
 * @property {string} internalWebPropertyId Internal ID for the web property to which this linked foreign account belongs.
 * @property {string} kind Resource type for linked foreign account.
 * @property {string} linkedAccountId The foreign account ID. For example the an AdWords `linkedAccountId` has the following format XXX-XXX-XXXX.
 * @property {string} remarketingAudienceId Remarketing audience ID to which this linked foreign account belongs.
 * @property {string} status The status of this foreign account link.
 * @property {string} type The type of the foreign account. For example `ADWORDS_LINKS`.
 * @property {string} webPropertyId Web property ID of the form UA-XXXXX-YY to which this linked foreign account belongs.
 */
/**
 * @typedef McfData
 * @memberOf! analytics(v3)
 * @type object
 * @property {object[]} columnHeaders Column headers that list dimension names followed by the metric names. The order of dimensions and metrics is same as specified in the request.
 * @property {boolean} containsSampledData Determines if the Analytics data contains sampled data.
 * @property {string} id Unique ID for this data response.
 * @property {integer} itemsPerPage The maximum number of rows the response can contain, regardless of the actual number of rows returned. Its value ranges from 1 to 10,000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Resource type.
 * @property {string} nextLink Link to next page for this Analytics data query.
 * @property {string} previousLink Link to previous page for this Analytics data query.
 * @property {object} profileInfo Information for the view (profile), for which the Analytics data was requested.
 * @property {object} query Analytics data request query parameters.
 * @property {array[]} rows Analytics data rows, where each row contains a list of dimension values followed by the metric values. The order of dimensions and metrics is same as specified in the request.
 * @property {string} sampleSize The number of samples used to calculate the result.
 * @property {string} sampleSpace Total size of the sample space from which the samples were selected.
 * @property {string} selfLink Link to this page.
 * @property {integer} totalResults The total number of rows for the query, regardless of the number of rows in the response.
 * @property {object} totalsForAllResults Total values for the requested metrics over all the results, not just the results returned in this response. The order of the metric totals is same as the metric order specified in the request.
 */
/**
 * @typedef Profile
 * @memberOf! analytics(v3)
 * @type object
* @property {string} accountId Account ID to which this view (profile) belongs.
* @property {boolean} botFilteringEnabled Indicates whether bot filtering is enabled for this view (profile).
* @property {object} childLink Child link for this view (profile). Points to the list of goals for this view (profile).
* @property {string} created Time this view (profile) was created.
* @property {string} currency The currency type associated with this view (profile), defaults to USD. The supported values are:
USD, JPY, EUR, GBP, AUD, KRW, BRL, CNY, DKK, RUB, SEK, NOK, PLN, TRY, TWD, HKD, THB, IDR, ARS, MXN, VND, PHP, INR, CHF, CAD, CZK, NZD, HUF, BGN, LTL, ZAR, UAH, AED, BOB, CLP, COP, EGP, HRK, ILS, MAD, MYR, PEN, PKR, RON, RSD, SAR, SGD, VEF, LVL
* @property {string} defaultPage Default page for this view (profile).
* @property {boolean} eCommerceTracking Indicates whether ecommerce tracking is enabled for this view (profile).
* @property {boolean} enhancedECommerceTracking Indicates whether enhanced ecommerce tracking is enabled for this view (profile). This property can only be enabled if ecommerce tracking is enabled.
* @property {string} excludeQueryParameters The query parameters that are excluded from this view (profile).
* @property {string} id View (Profile) ID.
* @property {string} internalWebPropertyId Internal ID for the web property to which this view (profile) belongs.
* @property {string} kind Resource type for Analytics view (profile).
* @property {string} name Name of this view (profile).
* @property {object} parentLink Parent link for this view (profile). Points to the web property to which this view (profile) belongs.
* @property {object} permissions Permissions the user has for this view (profile).
* @property {string} selfLink Link for this view (profile).
* @property {string} siteSearchCategoryParameters Site search category parameters for this view (profile).
* @property {string} siteSearchQueryParameters The site search query parameters for this view (profile).
* @property {boolean} starred Indicates whether this view (profile) is starred or not.
* @property {boolean} stripSiteSearchCategoryParameters Whether or not Analytics will strip search category parameters from the URLs in your reports.
* @property {boolean} stripSiteSearchQueryParameters Whether or not Analytics will strip search query parameters from the URLs in your reports.
* @property {string} timezone Time zone for which this view (profile) has been configured. Time zones are identified by strings from the TZ database.
* @property {string} type View (Profile) type. Supported types: WEB or APP.
* @property {string} updated Time this view (profile) was last modified.
* @property {string} webPropertyId Web property ID of the form UA-XXXXX-YY to which this view (profile) belongs.
* @property {string} websiteUrl Website URL for this view (profile).
*/
/**
 * @typedef ProfileFilterLink
 * @memberOf! analytics(v3)
 * @type object
* @property {analytics(v3).FilterRef} filterRef Filter for this link.
* @property {string} id Profile filter link ID.
* @property {string} kind Resource type for Analytics filter.
* @property {analytics(v3).ProfileRef} profileRef View (Profile) for this link.
* @property {integer} rank The rank of this profile filter link relative to the other filters linked to the same profile.
For readonly (i.e., list and get) operations, the rank always starts at 1.
For write (i.e., create, update, or delete) operations, you may specify a value between 0 and 255 inclusively, [0, 255]. In order to insert a link at the end of the list, either don&#39;t specify a rank or set a rank to a number greater than the largest rank in the list. In order to insert a link to the beginning of the list specify a rank that is less than or equal to 1. The new link will move all existing filters with the same or lower rank down the list. After the link is inserted/updated/deleted all profile filter links will be renumbered starting at 1.
* @property {string} selfLink Link for this profile filter link.
*/
/**
 * @typedef ProfileFilterLinks
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).ProfileFilterLink[]} items A list of profile filter links.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1,000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this profile filter link collection.
 * @property {string} previousLink Link to previous page for this profile filter link collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef ProfileRef
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this view (profile) belongs.
 * @property {string} href Link for this view (profile).
 * @property {string} id View (Profile) ID.
 * @property {string} internalWebPropertyId Internal ID for the web property to which this view (profile) belongs.
 * @property {string} kind Analytics view (profile) reference.
 * @property {string} name Name of this view (profile).
 * @property {string} webPropertyId Web property ID of the form UA-XXXXX-YY to which this view (profile) belongs.
 */
/**
 * @typedef ProfileSummary
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} id View (profile) ID.
 * @property {string} kind Resource type for Analytics ProfileSummary.
 * @property {string} name View (profile) name.
 * @property {boolean} starred Indicates whether this view (profile) is starred or not.
 * @property {string} type View (Profile) type. Supported types: WEB or APP.
 */
/**
 * @typedef Profiles
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Profile[]} items A list of views (profiles).
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this view (profile) collection.
 * @property {string} previousLink Link to previous page for this view (profile) collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef RealtimeData
 * @memberOf! analytics(v3)
 * @type object
 * @property {object[]} columnHeaders Column headers that list dimension names followed by the metric names. The order of dimensions and metrics is same as specified in the request.
 * @property {string} id Unique ID for this data response.
 * @property {string} kind Resource type.
 * @property {object} profileInfo Information for the view (profile), for which the real time data was requested.
 * @property {object} query Real time data request query parameters.
 * @property {array[]} rows Real time data rows, where each row contains a list of dimension values followed by the metric values. The order of dimensions and metrics is same as specified in the request.
 * @property {string} selfLink Link to this page.
 * @property {integer} totalResults The total number of rows for the query, regardless of the number of rows in the response.
 * @property {object} totalsForAllResults Total values for the requested metrics over all the results, not just the results returned in this response. The order of the metric totals is same as the metric order specified in the request.
 */
/**
 * @typedef RemarketingAudience
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this remarketing audience belongs.
 * @property {object} audienceDefinition The simple audience definition that will cause a user to be added to an audience.
 * @property {string} audienceType The type of audience, either SIMPLE or STATE_BASED.
 * @property {string} created Time this remarketing audience was created.
 * @property {string} description The description of this remarketing audience.
 * @property {string} id Remarketing Audience ID.
 * @property {string} internalWebPropertyId Internal ID for the web property to which this remarketing audience belongs.
 * @property {string} kind Collection type.
 * @property {analytics(v3).LinkedForeignAccount[]} linkedAdAccounts The linked ad accounts associated with this remarketing audience. A remarketing audience can have only one linkedAdAccount currently.
 * @property {string[]} linkedViews The views (profiles) that this remarketing audience is linked to.
 * @property {string} name The name of this remarketing audience.
 * @property {object} stateBasedAudienceDefinition A state based audience definition that will cause a user to be added or removed from an audience.
 * @property {string} updated Time this remarketing audience was last modified.
 * @property {string} webPropertyId Web property ID of the form UA-XXXXX-YY to which this remarketing audience belongs.
 */
/**
 * @typedef RemarketingAudiences
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).RemarketingAudience[]} items A list of remarketing audiences.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this remarketing audience collection.
 * @property {string} previousLink Link to previous page for this view (profile) collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef Segment
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} created Time the segment was created.
 * @property {string} definition Segment definition.
 * @property {string} id Segment ID.
 * @property {string} kind Resource type for Analytics segment.
 * @property {string} name Segment name.
 * @property {string} segmentId Segment ID. Can be used with the &#39;segment&#39; parameter in Core Reporting API.
 * @property {string} selfLink Link for this segment.
 * @property {string} type Type for a segment. Possible values are &quot;BUILT_IN&quot; or &quot;CUSTOM&quot;.
 * @property {string} updated Time the segment was last modified.
 */
/**
 * @typedef Segments
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Segment[]} items A list of segments.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type for segments.
 * @property {string} nextLink Link to next page for this segment collection.
 * @property {string} previousLink Link to previous page for this segment collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef UnsampledReport
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this unsampled report belongs.
 * @property {object} cloudStorageDownloadDetails Download details for a file stored in Google Cloud Storage.
 * @property {string} created Time this unsampled report was created.
 * @property {string} dimensions The dimensions for the unsampled report.
 * @property {string} downloadType The type of download you need to use for the report data file. Possible values include `GOOGLE_DRIVE` and `GOOGLE_CLOUD_STORAGE`. If the value is `GOOGLE_DRIVE`, see the `driveDownloadDetails` field. If the value is `GOOGLE_CLOUD_STORAGE`, see the `cloudStorageDownloadDetails` field.
 * @property {object} driveDownloadDetails Download details for a file stored in Google Drive.
 * @property {string} end-date The end date for the unsampled report.
 * @property {string} filters The filters for the unsampled report.
 * @property {string} id Unsampled report ID.
 * @property {string} kind Resource type for an Analytics unsampled report.
 * @property {string} metrics The metrics for the unsampled report.
 * @property {string} profileId View (Profile) ID to which this unsampled report belongs.
 * @property {string} segment The segment for the unsampled report.
 * @property {string} selfLink Link for this unsampled report.
 * @property {string} start-date The start date for the unsampled report.
 * @property {string} status Status of this unsampled report. Possible values are PENDING, COMPLETED, or FAILED.
 * @property {string} title Title of the unsampled report.
 * @property {string} updated Time this unsampled report was last modified.
 * @property {string} webPropertyId Web property ID to which this unsampled report belongs. The web property ID is of the form UA-XXXXX-YY.
 */
/**
 * @typedef UnsampledReports
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).UnsampledReport[]} items A list of unsampled reports.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this unsampled report collection.
 * @property {string} previousLink Link to previous page for this unsampled report collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of resources in the result.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef Upload
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account Id to which this upload belongs.
 * @property {string} customDataSourceId Custom data source Id to which this data import belongs.
 * @property {string[]} errors Data import errors collection.
 * @property {string} id A unique ID for this upload.
 * @property {string} kind Resource type for Analytics upload.
 * @property {string} status Upload status. Possible values: PENDING, COMPLETED, FAILED, DELETING, DELETED.
 */
/**
 * @typedef Uploads
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Upload[]} items A list of uploads.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this upload collection.
 * @property {string} previousLink Link to previous page for this upload collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of resources in the result.
 */
/**
 * @typedef UserRef
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} email Email ID of this user.
 * @property {string} id User ID.
 * @property {string} kind 
 */
/**
 * @typedef WebPropertyRef
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this web property belongs.
 * @property {string} href Link for this web property.
 * @property {string} id Web property ID of the form UA-XXXXX-YY.
 * @property {string} internalWebPropertyId Internal ID for this web property.
 * @property {string} kind Analytics web property reference.
 * @property {string} name Name of this web property.
 */
/**
 * @typedef WebPropertySummary
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} id Web property ID of the form UA-XXXXX-YY.
 * @property {string} internalWebPropertyId Internal ID for this web property.
 * @property {string} kind Resource type for Analytics WebPropertySummary.
 * @property {string} level Level for this web property. Possible values are STANDARD or PREMIUM.
 * @property {string} name Web property name.
 * @property {analytics(v3).ProfileSummary[]} profiles List of profiles under this web property.
 * @property {boolean} starred Indicates whether this web property is starred or not.
 * @property {string} websiteUrl Website url for this web property.
 */
/**
 * @typedef Webproperties
 * @memberOf! analytics(v3)
 * @type object
 * @property {analytics(v3).Webproperty[]} items A list of web properties.
 * @property {integer} itemsPerPage The maximum number of resources the response can contain, regardless of the actual number of resources returned. Its value ranges from 1 to 1000 with a value of 1000 by default, or otherwise specified by the max-results query parameter.
 * @property {string} kind Collection type.
 * @property {string} nextLink Link to next page for this web property collection.
 * @property {string} previousLink Link to previous page for this web property collection.
 * @property {integer} startIndex The starting index of the resources, which is 1 by default or otherwise specified by the start-index query parameter.
 * @property {integer} totalResults The total number of results for the query, regardless of the number of results in the response.
 * @property {string} username Email ID of the authenticated user
 */
/**
 * @typedef Webproperty
 * @memberOf! analytics(v3)
 * @type object
 * @property {string} accountId Account ID to which this web property belongs.
 * @property {object} childLink Child link for this web property. Points to the list of views (profiles) for this web property.
 * @property {string} created Time this web property was created.
 * @property {string} defaultProfileId Default view (profile) ID.
 * @property {string} id Web property ID of the form UA-XXXXX-YY.
 * @property {string} industryVertical The industry vertical/category selected for this web property.
 * @property {string} internalWebPropertyId Internal ID for this web property.
 * @property {string} kind Resource type for Analytics WebProperty.
 * @property {string} level Level for this web property. Possible values are STANDARD or PREMIUM.
 * @property {string} name Name of this web property.
 * @property {object} parentLink Parent link for this web property. Points to the account to which this web property belongs.
 * @property {object} permissions Permissions the user has for this web property.
 * @property {integer} profileCount View (Profile) count for this web property.
 * @property {string} selfLink Link for this web property.
 * @property {boolean} starred Indicates whether this web property is starred or not.
 * @property {string} updated Time this web property was last modified.
 * @property {string} websiteUrl Website url for this web property.
 */
module.exports = Analytics;
