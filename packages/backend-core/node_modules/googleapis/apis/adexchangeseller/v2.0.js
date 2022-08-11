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
 * Ad Exchange Seller API
 *
 * Accesses the inventory of Ad Exchange seller users and generates reports.
 *
 * @example
 * var google = require('googleapis');
 * var adexchangeseller = google.adexchangeseller('v2.0');
 *
 * @namespace adexchangeseller
 * @type {Function}
 * @version v2.0
 * @variation v2.0
 * @param {object=} options Options for Adexchangeseller
 */
function Adexchangeseller(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * adexchangeseller.accounts.get
     *
     * @desc Get information about the selected Ad Exchange account.
     *
     * @alias adexchangeseller.accounts.get
     * @memberOf! adexchangeseller(v2.0)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId Account to get information about. Tip: 'myaccount' is a valid ID.
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
          url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}',
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
     * adexchangeseller.accounts.list
     *
     * @desc List all accounts available to this Ad Exchange account.
     *
     * @alias adexchangeseller.accounts.list
     * @memberOf! adexchangeseller(v2.0)
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
          url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts',
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
       * adexchangeseller.accounts.adclients.list
       *
       * @desc List all ad clients in this Ad Exchange account.
       *
       * @alias adexchangeseller.accounts.adclients.list
       * @memberOf! adexchangeseller(v2.0)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account to which the ad client belongs.
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/adclients',
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

    alerts: {

      /**
       * adexchangeseller.accounts.alerts.list
       *
       * @desc List the alerts for this Ad Exchange account.
       *
       * @alias adexchangeseller.accounts.alerts.list
       * @memberOf! adexchangeseller(v2.0)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account owning the alerts.
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/alerts',
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
       * adexchangeseller.accounts.customchannels.get
       *
       * @desc Get the specified custom channel from the specified ad client.
       *
       * @alias adexchangeseller.accounts.customchannels.get
       * @memberOf! adexchangeseller(v2.0)
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/adclients/{adClientId}/customchannels/{customChannelId}',
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
       * adexchangeseller.accounts.customchannels.list
       *
       * @desc List all custom channels in the specified ad client for this Ad Exchange account.
       *
       * @alias adexchangeseller.accounts.customchannels.list
       * @memberOf! adexchangeseller(v2.0)
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/adclients/{adClientId}/customchannels',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    metadata: {

      dimensions: {

        /**
         * adexchangeseller.accounts.metadata.dimensions.list
         *
         * @desc List the metadata for the dimensions available to this AdExchange account.
         *
         * @alias adexchangeseller.accounts.metadata.dimensions.list
         * @memberOf! adexchangeseller(v2.0)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account with visibility to the dimensions.
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
              url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/metadata/dimensions',
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

      metrics: {

        /**
         * adexchangeseller.accounts.metadata.metrics.list
         *
         * @desc List the metadata for the metrics available to this AdExchange account.
         *
         * @alias adexchangeseller.accounts.metadata.metrics.list
         * @memberOf! adexchangeseller(v2.0)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account with visibility to the metrics.
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
              url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/metadata/metrics',
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

    preferreddeals: {

      /**
       * adexchangeseller.accounts.preferreddeals.get
       *
       * @desc Get information about the selected Ad Exchange Preferred Deal.
       *
       * @alias adexchangeseller.accounts.preferreddeals.get
       * @memberOf! adexchangeseller(v2.0)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account owning the deal.
       * @param {string} params.dealId Preferred deal to get information about.
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/preferreddeals/{dealId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'dealId'],
          pathParams: ['accountId', 'dealId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adexchangeseller.accounts.preferreddeals.list
       *
       * @desc List the preferred deals for this Ad Exchange account.
       *
       * @alias adexchangeseller.accounts.preferreddeals.list
       * @memberOf! adexchangeseller(v2.0)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account owning the deals.
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/preferreddeals',
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
       * adexchangeseller.accounts.reports.generate
       *
       * @desc Generate an Ad Exchange report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
       *
       * @alias adexchangeseller.accounts.reports.generate
       * @memberOf! adexchangeseller(v2.0)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which owns the generated report.
       * @param {string=} params.dimension Dimensions to base the report on.
       * @param {string} params.endDate End of the date range to report on in "YYYY-MM-DD" format, inclusive.
       * @param {string=} params.filter Filters to be run on the report.
       * @param {string=} params.locale Optional locale to use for translating report output to a local language. Defaults to "en_US" if not specified.
       * @param {integer=} params.maxResults The maximum number of rows of report data to return.
       * @param {string=} params.metric Numeric columns to include in the report.
       * @param {string=} params.sort The name of a dimension or metric to sort the resulting report on, optionally prefixed with "+" to sort ascending or "-" to sort descending. If no prefix is specified, the column is sorted ascending.
       * @param {string} params.startDate Start of the date range to report on in "YYYY-MM-DD" format, inclusive.
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/reports',
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
         * adexchangeseller.accounts.reports.saved.generate
         *
         * @desc Generate an Ad Exchange report based on the saved report ID sent in the query parameters.
         *
         * @alias adexchangeseller.accounts.reports.saved.generate
         * @memberOf! adexchangeseller(v2.0)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account owning the saved report.
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
              url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/reports/{savedReportId}',
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
         * adexchangeseller.accounts.reports.saved.list
         *
         * @desc List all saved reports in this Ad Exchange account.
         *
         * @alias adexchangeseller.accounts.reports.saved.list
         * @memberOf! adexchangeseller(v2.0)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId Account owning the saved reports.
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
              url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/reports/saved',
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

    urlchannels: {

      /**
       * adexchangeseller.accounts.urlchannels.list
       *
       * @desc List all URL channels in the specified ad client for this Ad Exchange account.
       *
       * @alias adexchangeseller.accounts.urlchannels.list
       * @memberOf! adexchangeseller(v2.0)
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
            url: 'https://www.googleapis.com/adexchangeseller/v2.0/accounts/{accountId}/adclients/{adClientId}/urlchannels',
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
}

/**
 * @typedef Account
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} id Unique identifier of this account.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#account.
 * @property {string} name Name of this account.
 */
/**
 * @typedef Accounts
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v2.0).Account[]} items The accounts returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#accounts.
 * @property {string} nextPageToken Continuation token used to page through accounts. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdClient
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {boolean} arcOptIn Whether this ad client is opted in to ARC.
 * @property {string} id Unique identifier of this ad client.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#adClient.
 * @property {string} productCode This ad client&#39;s product code, which corresponds to the PRODUCT_CODE report dimension.
 * @property {boolean} supportsReporting Whether this ad client supports being reported on.
 */
/**
 * @typedef AdClients
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v2.0).AdClient[]} items The ad clients returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#adClients.
 * @property {string} nextPageToken Continuation token used to page through ad clients. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef Alert
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} id Unique identifier of this alert. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#alert.
 * @property {string} message The localized alert message.
 * @property {string} severity Severity of this alert. Possible values: INFO, WARNING, SEVERE.
 * @property {string} type Type of this alert. Possible values: SELF_HOLD, MIGRATED_TO_BILLING3, ADDRESS_PIN_VERIFICATION, PHONE_PIN_VERIFICATION, CORPORATE_ENTITY, GRAYLISTED_PUBLISHER, API_HOLD.
 */
/**
 * @typedef Alerts
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {adexchangeseller(v2.0).Alert[]} items The alerts returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#alerts.
 */
/**
 * @typedef CustomChannel
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} code Code of this custom channel, not necessarily unique across ad clients.
 * @property {string} id Unique identifier of this custom channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#customChannel.
 * @property {string} name Name of this custom channel.
 * @property {object} targetingInfo The targeting information of this custom channel, if activated.
 */
/**
 * @typedef CustomChannels
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v2.0).CustomChannel[]} items The custom channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#customChannels.
 * @property {string} nextPageToken Continuation token used to page through custom channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef Metadata
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {adexchangeseller(v2.0).ReportingMetadataEntry[]} items 
 * @property {string} kind Kind of list this is, in this case adexchangeseller#metadata.
 */
/**
 * @typedef PreferredDeal
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} advertiserName The name of the advertiser this deal is for.
 * @property {string} buyerNetworkName The name of the buyer network this deal is for.
 * @property {string} currencyCode The currency code that applies to the fixed_cpm value. If not set then assumed to be USD.
 * @property {string} endTime Time when this deal stops being active in seconds since the epoch (GMT). If not set then this deal is valid until manually disabled by the publisher.
 * @property {string} fixedCpm The fixed price for this preferred deal. In cpm micros of currency according to currencyCode. If set, then this preferred deal is eligible for the fixed price tier of buying (highest priority, pay exactly the configured fixed price).
 * @property {string} id Unique identifier of this preferred deal.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#preferredDeal.
 * @property {string} startTime Time when this deal becomes active in seconds since the epoch (GMT). If not set then this deal is active immediately upon creation.
 */
/**
 * @typedef PreferredDeals
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {adexchangeseller(v2.0).PreferredDeal[]} items The preferred deals returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#preferredDeals.
 */
/**
 * @typedef Report
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string[]} averages The averages of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {object[]} headers The header information of the columns requested in the report. This is a list of headers; one for each dimension in the request, followed by one for each metric in the request.
 * @property {string} kind Kind this is, in this case adexchangeseller#report.
 * @property {array[]} rows The output rows of the report. Each row is a list of cells; one for each dimension in the request, followed by one for each metric in the request. The dimension cells contain strings, and the metric cells contain numbers.
 * @property {string} totalMatchedRows The total number of rows matched by the report request. Fewer rows may be returned in the response due to being limited by the row count requested or the report row limit.
 * @property {string[]} totals The totals of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {string[]} warnings Any warnings associated with generation of the report.
 */
/**
 * @typedef ReportingMetadataEntry
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string[]} compatibleDimensions For metrics this is a list of dimension IDs which the metric is compatible with, for dimensions it is a list of compatibility groups the dimension belongs to.
 * @property {string[]} compatibleMetrics The names of the metrics the dimension or metric this reporting metadata entry describes is compatible with.
 * @property {string} id Unique identifier of this reporting metadata entry, corresponding to the name of the appropriate dimension or metric.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#reportingMetadataEntry.
 * @property {string[]} requiredDimensions The names of the dimensions which the dimension or metric this reporting metadata entry describes requires to also be present in order for the report to be valid. Omitting these will not cause an error or warning, but may result in data which cannot be correctly interpreted.
 * @property {string[]} requiredMetrics The names of the metrics which the dimension or metric this reporting metadata entry describes requires to also be present in order for the report to be valid. Omitting these will not cause an error or warning, but may result in data which cannot be correctly interpreted.
 * @property {string[]} supportedProducts The codes of the projects supported by the dimension or metric this reporting metadata entry describes.
 */
/**
 * @typedef SavedReport
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} id Unique identifier of this saved report.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#savedReport.
 * @property {string} name This saved report&#39;s name.
 */
/**
 * @typedef SavedReports
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v2.0).SavedReport[]} items The saved reports returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#savedReports.
 * @property {string} nextPageToken Continuation token used to page through saved reports. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef UrlChannel
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} id Unique identifier of this URL channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#urlChannel.
 * @property {string} urlPattern URL Pattern of this URL channel. Does not include &quot;http://&quot; or &quot;https://&quot;. Example: www.example.com/home
 */
/**
 * @typedef UrlChannels
 * @memberOf! adexchangeseller(v2.0)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v2.0).UrlChannel[]} items The URL channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#urlChannels.
 * @property {string} nextPageToken Continuation token used to page through URL channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
module.exports = Adexchangeseller;
