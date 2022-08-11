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
 * var adexchangeseller = google.adexchangeseller('v1');
 *
 * @namespace adexchangeseller
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Adexchangeseller
 */
function Adexchangeseller(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.adclients = {

    /**
     * adexchangeseller.adclients.list
     *
     * @desc List all ad clients in this Ad Exchange account.
     *
     * @alias adexchangeseller.adclients.list
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients',
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
     * adexchangeseller.adunits.get
     *
     * @desc Gets the specified ad unit in the specified ad client.
     *
     * @alias adexchangeseller.adunits.get
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/adunits/{adUnitId}',
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
     * adexchangeseller.adunits.list
     *
     * @desc List all ad units in the specified ad client for this Ad Exchange account.
     *
     * @alias adexchangeseller.adunits.list
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/adunits',
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
       * adexchangeseller.adunits.customchannels.list
       *
       * @desc List all custom channels which the specified ad unit belongs to.
       *
       * @alias adexchangeseller.adunits.customchannels.list
       * @memberOf! adexchangeseller(v1)
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
            url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/adunits/{adUnitId}/customchannels',
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

  self.customchannels = {

    /**
     * adexchangeseller.customchannels.get
     *
     * @desc Get the specified custom channel from the specified ad client.
     *
     * @alias adexchangeseller.customchannels.get
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/customchannels/{customChannelId}',
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
     * adexchangeseller.customchannels.list
     *
     * @desc List all custom channels in the specified ad client for this Ad Exchange account.
     *
     * @alias adexchangeseller.customchannels.list
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/customchannels',
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
       * adexchangeseller.customchannels.adunits.list
       *
       * @desc List all ad units in the specified custom channel.
       *
       * @alias adexchangeseller.customchannels.adunits.list
       * @memberOf! adexchangeseller(v1)
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
            url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/customchannels/{customChannelId}/adunits',
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

  self.reports = {

    /**
     * adexchangeseller.reports.generate
     *
     * @desc Generate an Ad Exchange report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
     *
     * @alias adexchangeseller.reports.generate
     * @memberOf! adexchangeseller(v1)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/reports',
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
       * adexchangeseller.reports.saved.generate
       *
       * @desc Generate an Ad Exchange report based on the saved report ID sent in the query parameters.
       *
       * @alias adexchangeseller.reports.saved.generate
       * @memberOf! adexchangeseller(v1)
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
            url: 'https://www.googleapis.com/adexchangeseller/v1/reports/{savedReportId}',
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
       * adexchangeseller.reports.saved.list
       *
       * @desc List all saved reports in this Ad Exchange account.
       *
       * @alias adexchangeseller.reports.saved.list
       * @memberOf! adexchangeseller(v1)
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
            url: 'https://www.googleapis.com/adexchangeseller/v1/reports/saved',
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

  self.urlchannels = {

    /**
     * adexchangeseller.urlchannels.list
     *
     * @desc List all URL channels in the specified ad client for this Ad Exchange account.
     *
     * @alias adexchangeseller.urlchannels.list
     * @memberOf! adexchangeseller(v1)
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
          url: 'https://www.googleapis.com/adexchangeseller/v1/adclients/{adClientId}/urlchannels',
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
 * @typedef AdClient
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {boolean} arcOptIn Whether this ad client is opted in to ARC.
 * @property {string} id Unique identifier of this ad client.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#adClient.
 * @property {string} productCode This ad client&#39;s product code, which corresponds to the PRODUCT_CODE report dimension.
 * @property {boolean} supportsReporting Whether this ad client supports being reported on.
 */
/**
 * @typedef AdClients
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v1).AdClient[]} items The ad clients returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#adClients.
 * @property {string} nextPageToken Continuation token used to page through ad clients. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdUnit
 * @memberOf! adexchangeseller(v1)
 * @type object
* @property {string} code Identity code of this ad unit, not necessarily unique across ad clients.
* @property {string} id Unique identifier of this ad unit. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
* @property {string} kind Kind of resource this is, in this case adexchangeseller#adUnit.
* @property {string} name Name of this ad unit.
* @property {string} status Status of this ad unit. Possible values are:
NEW: Indicates that the ad unit was created within the last seven days and does not yet have any activity associated with it.

ACTIVE: Indicates that there has been activity on this ad unit in the last seven days.

INACTIVE: Indicates that there has been no activity on this ad unit in the last seven days.
*/
/**
 * @typedef AdUnits
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v1).AdUnit[]} items The ad units returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#adUnits.
 * @property {string} nextPageToken Continuation token used to page through ad units. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef CustomChannel
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} code Code of this custom channel, not necessarily unique across ad clients.
 * @property {string} id Unique identifier of this custom channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#customChannel.
 * @property {string} name Name of this custom channel.
 * @property {object} targetingInfo The targeting information of this custom channel, if activated.
 */
/**
 * @typedef CustomChannels
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v1).CustomChannel[]} items The custom channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#customChannels.
 * @property {string} nextPageToken Continuation token used to page through custom channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef Report
 * @memberOf! adexchangeseller(v1)
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
 * @typedef SavedReport
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} id Unique identifier of this saved report.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#savedReport.
 * @property {string} name This saved report&#39;s name.
 */
/**
 * @typedef SavedReports
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v1).SavedReport[]} items The saved reports returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#savedReports.
 * @property {string} nextPageToken Continuation token used to page through saved reports. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef UrlChannel
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} id Unique identifier of this URL channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adexchangeseller#urlChannel.
 * @property {string} urlPattern URL Pattern of this URL channel. Does not include &quot;http://&quot; or &quot;https://&quot;. Example: www.example.com/home
 */
/**
 * @typedef UrlChannels
 * @memberOf! adexchangeseller(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adexchangeseller(v1).UrlChannel[]} items The URL channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adexchangeseller#urlChannels.
 * @property {string} nextPageToken Continuation token used to page through URL channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
module.exports = Adexchangeseller;
