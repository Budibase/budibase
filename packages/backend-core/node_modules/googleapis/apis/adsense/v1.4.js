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
 * AdSense Management API
 *
 * Accesses AdSense publishers&#39; inventory and generates performance reports.
 *
 * @example
 * var google = require('googleapis');
 * var adsense = google.adsense('v1.4');
 *
 * @namespace adsense
 * @type {Function}
 * @version v1.4
 * @variation v1.4
 * @param {object=} options Options for Adsense
 */
function Adsense(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * adsense.accounts.get
     *
     * @desc Get information about the selected AdSense account.
     *
     * @alias adsense.accounts.get
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId Account to get information about.
     * @param {boolean=} params.tree Whether the tree of sub accounts should be returned.
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
          url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}',
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
     * adsense.accounts.list
     *
     * @desc List all accounts available to this AdSense account.
     *
     * @alias adsense.accounts.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of accounts to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through accounts. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/accounts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    adclients: {

      /**
       * adsense.accounts.adclients.list
       *
       * @desc List all ad clients in the specified account.
       *
       * @alias adsense.accounts.adclients.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account for which to list ad clients.
       * @param {integer=} params.maxResults The maximum number of ad clients to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    adunits: {

      /**
       * adsense.accounts.adunits.get
       *
       * @desc Gets the specified ad unit in the specified ad client for the specified account.
       *
       * @alias adsense.accounts.adunits.get
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
       * @param {string} params.adClientId Ad client for which to get the ad unit.
       * @param {string} params.adUnitId Ad unit to retrieve.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId', 'adUnitId'],
          pathParams: ['accountId', 'adClientId', 'adUnitId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.accounts.adunits.getAdCode
       *
       * @desc Get ad code for the specified ad unit.
       *
       * @alias adsense.accounts.adunits.getAdCode
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
       * @param {string} params.adClientId Ad client with contains the ad unit.
       * @param {string} params.adUnitId Ad unit to get the code for.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getAdCode: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}/adcode',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId', 'adUnitId'],
          pathParams: ['accountId', 'adClientId', 'adUnitId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.accounts.adunits.list
       *
       * @desc List all ad units in the specified ad client for the specified account.
       *
       * @alias adsense.accounts.adunits.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
       * @param {string} params.adClientId Ad client for which to list ad units.
       * @param {boolean=} params.includeInactive Whether to include inactive ad units. Default: true.
       * @param {integer=} params.maxResults The maximum number of ad units to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through ad units. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/adunits',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      customchannels: {

        /**
         * adsense.accounts.adunits.customchannels.list
         *
         * @desc List all custom channels which the specified ad unit belongs to.
         *
         * @alias adsense.accounts.adunits.customchannels.list
         * @memberOf! adsense(v1.4)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account to which the ad client belongs.
         * @param {string} params.adClientId Ad client which contains the ad unit.
         * @param {string} params.adUnitId Ad unit for which to list custom channels.
         * @param {integer=} params.maxResults The maximum number of custom channels to include in the response, used for paging.
         * @param {string=} params.pageToken A continuation token, used to page through custom channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
              url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}/customchannels',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'adClientId', 'adUnitId'],
            pathParams: ['accountId', 'adClientId', 'adUnitId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    alerts: {

      /**
       * adsense.accounts.alerts.delete
       *
       * @desc Dismiss (delete) the specified alert from the specified publisher AdSense account.
       *
       * @alias adsense.accounts.alerts.delete
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad unit.
       * @param {string} params.alertId Alert to delete.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/alerts/{alertId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'alertId'],
          pathParams: ['accountId', 'alertId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.accounts.alerts.list
       *
       * @desc List the alerts for the specified AdSense account.
       *
       * @alias adsense.accounts.alerts.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account for which to retrieve the alerts.
       * @param {string=} params.locale The locale to use for translating alert messages. The account locale will be used if this is not supplied. The AdSense default (English) will be used if the supplied locale is invalid or unsupported.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/alerts',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    customchannels: {

      /**
       * adsense.accounts.customchannels.get
       *
       * @desc Get the specified custom channel from the specified ad client for the specified account.
       *
       * @alias adsense.accounts.customchannels.get
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
       * @param {string} params.adClientId Ad client which contains the custom channel.
       * @param {string} params.customChannelId Custom channel to retrieve.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/customchannels/{customChannelId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId', 'customChannelId'],
          pathParams: ['accountId', 'adClientId', 'customChannelId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.accounts.customchannels.list
       *
       * @desc List all custom channels in the specified ad client for the specified account.
       *
       * @alias adsense.accounts.customchannels.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
       * @param {string} params.adClientId Ad client for which to list custom channels.
       * @param {integer=} params.maxResults The maximum number of custom channels to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through custom channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/customchannels',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      adunits: {

        /**
         * adsense.accounts.customchannels.adunits.list
         *
         * @desc List all ad units in the specified custom channel.
         *
         * @alias adsense.accounts.customchannels.adunits.list
         * @memberOf! adsense(v1.4)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account to which the ad client belongs.
         * @param {string} params.adClientId Ad client which contains the custom channel.
         * @param {string} params.customChannelId Custom channel for which to list ad units.
         * @param {boolean=} params.includeInactive Whether to include inactive ad units. Default: true.
         * @param {integer=} params.maxResults The maximum number of ad units to include in the response, used for paging.
         * @param {string=} params.pageToken A continuation token, used to page through ad units. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
              url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/customchannels/{customChannelId}/adunits',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'adClientId', 'customChannelId'],
            pathParams: ['accountId', 'adClientId', 'customChannelId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    payments: {

      /**
       * adsense.accounts.payments.list
       *
       * @desc List the payments for the specified AdSense account.
       *
       * @alias adsense.accounts.payments.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account for which to retrieve the payments.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/payments',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    reports: {

      /**
       * adsense.accounts.reports.generate
       *
       * @desc Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
       *
       * @alias adsense.accounts.reports.generate
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account upon which to report.
       * @param {string=} params.currency Optional currency to use when reporting on monetary metrics. Defaults to the account's currency if not set.
       * @param {string=} params.dimension Dimensions to base the report on.
       * @param {string} params.endDate End of the date range to report on in "YYYY-MM-DD" format, inclusive.
       * @param {string=} params.filter Filters to be run on the report.
       * @param {string=} params.locale Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
       * @param {integer=} params.maxResults The maximum number of rows of report data to return.
       * @param {string=} params.metric Numeric columns to include in the report.
       * @param {string=} params.sort The name of a dimension or metric to sort the resulting report on, optionally prefixed with "+" to sort ascending or "-" to sort descending. If no prefix is specified, the column is sorted ascending.
       * @param {string} params.startDate Start of the date range to report on in "YYYY-MM-DD" format, inclusive.
       * @param {integer=} params.startIndex Index of the first row of report data to return.
       * @param {boolean=} params.useTimezoneReporting Whether the report should be generated in the AdSense account's local timezone. If false default PST/PDT timezone will be used.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      generate: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/reports',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'startDate', 'endDate'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      saved: {

        /**
         * adsense.accounts.reports.saved.generate
         *
         * @desc Generate an AdSense report based on the saved report ID sent in the query parameters.
         *
         * @alias adsense.accounts.reports.saved.generate
         * @memberOf! adsense(v1.4)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account to which the saved reports belong.
         * @param {string=} params.locale Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
         * @param {integer=} params.maxResults The maximum number of rows of report data to return.
         * @param {string} params.savedReportId The saved report to retrieve.
         * @param {integer=} params.startIndex Index of the first row of report data to return.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        generate: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/reports/{savedReportId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'savedReportId'],
            pathParams: ['accountId', 'savedReportId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * adsense.accounts.reports.saved.list
         *
         * @desc List all saved reports in the specified AdSense account.
         *
         * @alias adsense.accounts.reports.saved.list
         * @memberOf! adsense(v1.4)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account to which the saved reports belong.
         * @param {integer=} params.maxResults The maximum number of saved reports to include in the response, used for paging.
         * @param {string=} params.pageToken A continuation token, used to page through saved reports. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
              url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/reports/saved',
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
    },

    savedadstyles: {

      /**
       * adsense.accounts.savedadstyles.get
       *
       * @desc List a specific saved ad style for the specified account.
       *
       * @alias adsense.accounts.savedadstyles.get
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account for which to get the saved ad style.
       * @param {string} params.savedAdStyleId Saved ad style to retrieve.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/savedadstyles/{savedAdStyleId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'savedAdStyleId'],
          pathParams: ['accountId', 'savedAdStyleId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.accounts.savedadstyles.list
       *
       * @desc List all saved ad styles in the specified account.
       *
       * @alias adsense.accounts.savedadstyles.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account for which to list saved ad styles.
       * @param {integer=} params.maxResults The maximum number of saved ad styles to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through saved ad styles. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/savedadstyles',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    urlchannels: {

      /**
       * adsense.accounts.urlchannels.list
       *
       * @desc List all URL channels in the specified ad client for the specified account.
       *
       * @alias adsense.accounts.urlchannels.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
       * @param {string} params.adClientId Ad client for which to list URL channels.
       * @param {integer=} params.maxResults The maximum number of URL channels to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through URL channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/accounts/{accountId}/adclients/{adClientId}/urlchannels',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.adclients = {

    /**
     * adsense.adclients.list
     *
     * @desc List all ad clients in this AdSense account.
     *
     * @alias adsense.adclients.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of ad clients to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients',
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

  self.adunits = {

    /**
     * adsense.adunits.get
     *
     * @desc Gets the specified ad unit in the specified ad client.
     *
     * @alias adsense.adunits.get
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client for which to get the ad unit.
     * @param {string} params.adUnitId Ad unit to retrieve.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/adunits/{adUnitId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'adUnitId'],
        pathParams: ['adClientId', 'adUnitId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsense.adunits.getAdCode
     *
     * @desc Get ad code for the specified ad unit.
     *
     * @alias adsense.adunits.getAdCode
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client with contains the ad unit.
     * @param {string} params.adUnitId Ad unit to get the code for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAdCode: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/adunits/{adUnitId}/adcode',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'adUnitId'],
        pathParams: ['adClientId', 'adUnitId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsense.adunits.list
     *
     * @desc List all ad units in the specified ad client for this AdSense account.
     *
     * @alias adsense.adunits.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client for which to list ad units.
     * @param {boolean=} params.includeInactive Whether to include inactive ad units. Default: true.
     * @param {integer=} params.maxResults The maximum number of ad units to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through ad units. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/adunits',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    customchannels: {

      /**
       * adsense.adunits.customchannels.list
       *
       * @desc List all custom channels which the specified ad unit belongs to.
       *
       * @alias adsense.adunits.customchannels.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.adClientId Ad client which contains the ad unit.
       * @param {string} params.adUnitId Ad unit for which to list custom channels.
       * @param {integer=} params.maxResults The maximum number of custom channels to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through custom channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/adunits/{adUnitId}/customchannels',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['adClientId', 'adUnitId'],
          pathParams: ['adClientId', 'adUnitId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.alerts = {

    /**
     * adsense.alerts.delete
     *
     * @desc Dismiss (delete) the specified alert from the publisher's AdSense account.
     *
     * @alias adsense.alerts.delete
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.alertId Alert to delete.
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
          url: 'https://www.googleapis.com/adsense/v1.4/alerts/{alertId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['alertId'],
        pathParams: ['alertId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsense.alerts.list
     *
     * @desc List the alerts for this AdSense account.
     *
     * @alias adsense.alerts.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.locale The locale to use for translating alert messages. The account locale will be used if this is not supplied. The AdSense default (English) will be used if the supplied locale is invalid or unsupported.
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
          url: 'https://www.googleapis.com/adsense/v1.4/alerts',
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

  self.customchannels = {

    /**
     * adsense.customchannels.get
     *
     * @desc Get the specified custom channel from the specified ad client.
     *
     * @alias adsense.customchannels.get
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client which contains the custom channel.
     * @param {string} params.customChannelId Custom channel to retrieve.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/customchannels/{customChannelId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'customChannelId'],
        pathParams: ['adClientId', 'customChannelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsense.customchannels.list
     *
     * @desc List all custom channels in the specified ad client for this AdSense account.
     *
     * @alias adsense.customchannels.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client for which to list custom channels.
     * @param {integer=} params.maxResults The maximum number of custom channels to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through custom channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/customchannels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    adunits: {

      /**
       * adsense.customchannels.adunits.list
       *
       * @desc List all ad units in the specified custom channel.
       *
       * @alias adsense.customchannels.adunits.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.adClientId Ad client which contains the custom channel.
       * @param {string} params.customChannelId Custom channel for which to list ad units.
       * @param {boolean=} params.includeInactive Whether to include inactive ad units. Default: true.
       * @param {integer=} params.maxResults The maximum number of ad units to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through ad units. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/customchannels/{customChannelId}/adunits',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['adClientId', 'customChannelId'],
          pathParams: ['adClientId', 'customChannelId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.metadata = {

    dimensions: {

      /**
       * adsense.metadata.dimensions.list
       *
       * @desc List the metadata for the dimensions available to this AdSense account.
       *
       * @alias adsense.metadata.dimensions.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object=} params Parameters for request
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
            url: 'https://www.googleapis.com/adsense/v1.4/metadata/dimensions',
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

    metrics: {

      /**
       * adsense.metadata.metrics.list
       *
       * @desc List the metadata for the metrics available to this AdSense account.
       *
       * @alias adsense.metadata.metrics.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object=} params Parameters for request
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
            url: 'https://www.googleapis.com/adsense/v1.4/metadata/metrics',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.payments = {

    /**
     * adsense.payments.list
     *
     * @desc List the payments for this AdSense account.
     *
     * @alias adsense.payments.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/adsense/v1.4/payments',
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

  self.reports = {

    /**
     * adsense.reports.generate
     *
     * @desc Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
     *
     * @alias adsense.reports.generate
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.accountId Accounts upon which to report.
     * @param {string=} params.currency Optional currency to use when reporting on monetary metrics. Defaults to the account's currency if not set.
     * @param {string=} params.dimension Dimensions to base the report on.
     * @param {string} params.endDate End of the date range to report on in "YYYY-MM-DD" format, inclusive.
     * @param {string=} params.filter Filters to be run on the report.
     * @param {string=} params.locale Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
     * @param {integer=} params.maxResults The maximum number of rows of report data to return.
     * @param {string=} params.metric Numeric columns to include in the report.
     * @param {string=} params.sort The name of a dimension or metric to sort the resulting report on, optionally prefixed with "+" to sort ascending or "-" to sort descending. If no prefix is specified, the column is sorted ascending.
     * @param {string} params.startDate Start of the date range to report on in "YYYY-MM-DD" format, inclusive.
     * @param {integer=} params.startIndex Index of the first row of report data to return.
     * @param {boolean=} params.useTimezoneReporting Whether the report should be generated in the AdSense account's local timezone. If false default PST/PDT timezone will be used.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adsense/v1.4/reports',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['startDate', 'endDate'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    saved: {

      /**
       * adsense.reports.saved.generate
       *
       * @desc Generate an AdSense report based on the saved report ID sent in the query parameters.
       *
       * @alias adsense.reports.saved.generate
       * @memberOf! adsense(v1.4)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.locale Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
       * @param {integer=} params.maxResults The maximum number of rows of report data to return.
       * @param {string} params.savedReportId The saved report to retrieve.
       * @param {integer=} params.startIndex Index of the first row of report data to return.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      generate: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/adsense/v1.4/reports/{savedReportId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['savedReportId'],
          pathParams: ['savedReportId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsense.reports.saved.list
       *
       * @desc List all saved reports in this AdSense account.
       *
       * @alias adsense.reports.saved.list
       * @memberOf! adsense(v1.4)
       *
       * @param {object=} params Parameters for request
       * @param {integer=} params.maxResults The maximum number of saved reports to include in the response, used for paging.
       * @param {string=} params.pageToken A continuation token, used to page through saved reports. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
            url: 'https://www.googleapis.com/adsense/v1.4/reports/saved',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.savedadstyles = {

    /**
     * adsense.savedadstyles.get
     *
     * @desc Get a specific saved ad style from the user's account.
     *
     * @alias adsense.savedadstyles.get
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.savedAdStyleId Saved ad style to retrieve.
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
          url: 'https://www.googleapis.com/adsense/v1.4/savedadstyles/{savedAdStyleId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['savedAdStyleId'],
        pathParams: ['savedAdStyleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsense.savedadstyles.list
     *
     * @desc List all saved ad styles in the user's account.
     *
     * @alias adsense.savedadstyles.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of saved ad styles to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through saved ad styles. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/savedadstyles',
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

  self.urlchannels = {

    /**
     * adsense.urlchannels.list
     *
     * @desc List all URL channels in the specified ad client for this AdSense account.
     *
     * @alias adsense.urlchannels.list
     * @memberOf! adsense(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client for which to list URL channels.
     * @param {integer=} params.maxResults The maximum number of URL channels to include in the response, used for paging.
     * @param {string=} params.pageToken A continuation token, used to page through URL channels. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/adsense/v1.4/adclients/{adClientId}/urlchannels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Account
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} creation_time 
 * @property {string} id Unique identifier of this account.
 * @property {string} kind Kind of resource this is, in this case adsense#account.
 * @property {string} name Name of this account.
 * @property {boolean} premium Whether this account is premium.
 * @property {adsense(v1.4).Account[]} subAccounts Sub accounts of the this account.
 * @property {string} timezone AdSense timezone of this account.
 */
/**
 * @typedef Accounts
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).Account[]} items The accounts returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#accounts.
 * @property {string} nextPageToken Continuation token used to page through accounts. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdClient
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {boolean} arcOptIn Whether this ad client is opted in to ARC.
 * @property {string} id Unique identifier of this ad client.
 * @property {string} kind Kind of resource this is, in this case adsense#adClient.
 * @property {string} productCode This ad client&#39;s product code, which corresponds to the PRODUCT_CODE report dimension.
 * @property {boolean} supportsReporting Whether this ad client supports being reported on.
 */
/**
 * @typedef AdClients
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).AdClient[]} items The ad clients returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#adClients.
 * @property {string} nextPageToken Continuation token used to page through ad clients. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdCode
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} adCode The ad code snippet.
 * @property {string} kind Kind this is, in this case adsense#adCode.
 */
/**
 * @typedef AdStyle
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {object} colors The colors which are included in the style. These are represented as six hexadecimal characters, similar to HTML color codes, but without the leading hash.
 * @property {string} corners The style of the corners in the ad (deprecated: never populated, ignored).
 * @property {object} font The font which is included in the style.
 * @property {string} kind Kind this is, in this case adsense#adStyle.
 */
/**
 * @typedef AdUnit
 * @memberOf! adsense(v1.4)
 * @type object
* @property {string} code Identity code of this ad unit, not necessarily unique across ad clients.
* @property {object} contentAdsSettings Settings specific to content ads (AFC) and highend mobile content ads (AFMC - deprecated).
* @property {adsense(v1.4).AdStyle} customStyle Custom style information specific to this ad unit.
* @property {object} feedAdsSettings Settings specific to feed ads (AFF) - deprecated.
* @property {string} id Unique identifier of this ad unit. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
* @property {string} kind Kind of resource this is, in this case adsense#adUnit.
* @property {object} mobileContentAdsSettings Settings specific to WAP mobile content ads (AFMC) - deprecated.
* @property {string} name Name of this ad unit.
* @property {string} savedStyleId ID of the saved ad style which holds this ad unit&#39;s style information.
* @property {string} status Status of this ad unit. Possible values are:
NEW: Indicates that the ad unit was created within the last seven days and does not yet have any activity associated with it.

ACTIVE: Indicates that there has been activity on this ad unit in the last seven days.

INACTIVE: Indicates that there has been no activity on this ad unit in the last seven days.
*/
/**
 * @typedef AdUnits
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).AdUnit[]} items The ad units returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#adUnits.
 * @property {string} nextPageToken Continuation token used to page through ad units. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdsenseReportsGenerateResponse
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string[]} averages The averages of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {string} endDate The requested end date in yyyy-mm-dd format.
 * @property {object[]} headers The header information of the columns requested in the report. This is a list of headers; one for each dimension in the request, followed by one for each metric in the request.
 * @property {string} kind Kind this is, in this case adsense#report.
 * @property {array[]} rows The output rows of the report. Each row is a list of cells; one for each dimension in the request, followed by one for each metric in the request. The dimension cells contain strings, and the metric cells contain numbers.
 * @property {string} startDate The requested start date in yyyy-mm-dd format.
 * @property {string} totalMatchedRows The total number of rows matched by the report request. Fewer rows may be returned in the response due to being limited by the row count requested or the report row limit.
 * @property {string[]} totals The totals of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {string[]} warnings Any warnings associated with generation of the report.
 */
/**
 * @typedef Alert
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} id Unique identifier of this alert. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {boolean} isDismissible Whether this alert can be dismissed.
 * @property {string} kind Kind of resource this is, in this case adsense#alert.
 * @property {string} message The localized alert message.
 * @property {string} severity Severity of this alert. Possible values: INFO, WARNING, SEVERE.
 * @property {string} type Type of this alert. Possible values: SELF_HOLD, MIGRATED_TO_BILLING3, ADDRESS_PIN_VERIFICATION, PHONE_PIN_VERIFICATION, CORPORATE_ENTITY, GRAYLISTED_PUBLISHER, API_HOLD.
 */
/**
 * @typedef Alerts
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {adsense(v1.4).Alert[]} items The alerts returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#alerts.
 */
/**
 * @typedef CustomChannel
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} code Code of this custom channel, not necessarily unique across ad clients.
 * @property {string} id Unique identifier of this custom channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adsense#customChannel.
 * @property {string} name Name of this custom channel.
 * @property {object} targetingInfo The targeting information of this custom channel, if activated.
 */
/**
 * @typedef CustomChannels
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).CustomChannel[]} items The custom channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#customChannels.
 * @property {string} nextPageToken Continuation token used to page through custom channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef Metadata
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {adsense(v1.4).ReportingMetadataEntry[]} items 
 * @property {string} kind Kind of list this is, in this case adsense#metadata.
 */
/**
 * @typedef Payment
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} id Unique identifier of this Payment.
 * @property {string} kind Kind of resource this is, in this case adsense#payment.
 * @property {string} paymentAmount The amount to be paid.
 * @property {string} paymentAmountCurrencyCode The currency code for the amount to be paid.
 * @property {string} paymentDate The date this payment was/will be credited to the user, or none if the payment threshold has not been met.
 */
/**
 * @typedef Payments
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {adsense(v1.4).Payment[]} items The list of Payments for the account. One or both of a) the account&#39;s most recent payment; and b) the account&#39;s upcoming payment.
 * @property {string} kind Kind of list this is, in this case adsense#payments.
 */
/**
 * @typedef ReportingMetadataEntry
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string[]} compatibleDimensions For metrics this is a list of dimension IDs which the metric is compatible with, for dimensions it is a list of compatibility groups the dimension belongs to.
 * @property {string[]} compatibleMetrics The names of the metrics the dimension or metric this reporting metadata entry describes is compatible with.
 * @property {string} id Unique identifier of this reporting metadata entry, corresponding to the name of the appropriate dimension or metric.
 * @property {string} kind Kind of resource this is, in this case adsense#reportingMetadataEntry.
 * @property {string[]} requiredDimensions The names of the dimensions which the dimension or metric this reporting metadata entry describes requires to also be present in order for the report to be valid. Omitting these will not cause an error or warning, but may result in data which cannot be correctly interpreted.
 * @property {string[]} requiredMetrics The names of the metrics which the dimension or metric this reporting metadata entry describes requires to also be present in order for the report to be valid. Omitting these will not cause an error or warning, but may result in data which cannot be correctly interpreted.
 * @property {string[]} supportedProducts The codes of the projects supported by the dimension or metric this reporting metadata entry describes.
 */
/**
 * @typedef SavedAdStyle
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {adsense(v1.4).AdStyle} adStyle The AdStyle itself.
 * @property {string} id Unique identifier of this saved ad style. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adsense#savedAdStyle.
 * @property {string} name The user selected name of this SavedAdStyle.
 */
/**
 * @typedef SavedAdStyles
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).SavedAdStyle[]} items The saved ad styles returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#savedAdStyles.
 * @property {string} nextPageToken Continuation token used to page through ad units. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef SavedReport
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} id Unique identifier of this saved report.
 * @property {string} kind Kind of resource this is, in this case adsense#savedReport.
 * @property {string} name This saved report&#39;s name.
 */
/**
 * @typedef SavedReports
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).SavedReport[]} items The saved reports returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#savedReports.
 * @property {string} nextPageToken Continuation token used to page through saved reports. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef UrlChannel
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} id Unique identifier of this URL channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adsense#urlChannel.
 * @property {string} urlPattern URL Pattern of this URL channel. Does not include &quot;http://&quot; or &quot;https://&quot;. Example: www.example.com/home
 */
/**
 * @typedef UrlChannels
 * @memberOf! adsense(v1.4)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsense(v1.4).UrlChannel[]} items The URL channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsense#urlChannels.
 * @property {string} nextPageToken Continuation token used to page through URL channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
module.exports = Adsense;
