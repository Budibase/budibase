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
 * AdSense Host API
 *
 * Generates performance reports, generates ad codes, and provides publisher management capabilities for AdSense Hosts.
 *
 * @example
 * var google = require('googleapis');
 * var adsensehost = google.adsensehost('v4.1');
 *
 * @namespace adsensehost
 * @type {Function}
 * @version v4.1
 * @variation v4.1
 * @param {object=} options Options for Adsensehost
 */
function Adsensehost(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * adsensehost.accounts.get
     *
     * @desc Get information about the selected associated AdSense account.
     *
     * @alias adsensehost.accounts.get
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId Account to get information about.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}',
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
     * adsensehost.accounts.list
     *
     * @desc List hosted accounts associated with this AdSense account by ad client id.
     *
     * @alias adsensehost.accounts.list
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.filterAdClientId Ad clients to list accounts for.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/accounts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['filterAdClientId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    adclients: {

      /**
       * adsensehost.accounts.adclients.get
       *
       * @desc Get information about one of the ad clients in the specified publisher's AdSense account.
       *
       * @alias adsensehost.accounts.adclients.get
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
       * @param {string} params.adClientId Ad client to get.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsensehost.accounts.adclients.list
       *
       * @desc List all hosted ad clients in the specified hosted account.
       *
       * @alias adsensehost.accounts.adclients.list
       * @memberOf! adsensehost(v4.1)
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients',
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
       * adsensehost.accounts.adunits.delete
       *
       * @desc Delete the specified ad unit from the specified publisher AdSense account.
       *
       * @alias adsensehost.accounts.adunits.delete
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad unit.
       * @param {string} params.adClientId Ad client for which to get ad unit.
       * @param {string} params.adUnitId Ad unit to delete.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId', 'adUnitId'],
          pathParams: ['accountId', 'adClientId', 'adUnitId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsensehost.accounts.adunits.get
       *
       * @desc Get the specified host ad unit in this AdSense account.
       *
       * @alias adsensehost.accounts.adunits.get
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad unit.
       * @param {string} params.adClientId Ad client for which to get ad unit.
       * @param {string} params.adUnitId Ad unit to get.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}',
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
       * adsensehost.accounts.adunits.getAdCode
       *
       * @desc Get ad code for the specified ad unit, attaching the specified host custom channels.
       *
       * @alias adsensehost.accounts.adunits.getAdCode
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
       * @param {string} params.adClientId Ad client with contains the ad unit.
       * @param {string} params.adUnitId Ad unit to get the code for.
       * @param {string=} params.hostCustomChannelId Host custom channel to attach to the ad code.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits/{adUnitId}/adcode',
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
       * adsensehost.accounts.adunits.insert
       *
       * @desc Insert the supplied ad unit into the specified publisher AdSense account.
       *
       * @alias adsensehost.accounts.adunits.insert
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which will contain the ad unit.
       * @param {string} params.adClientId Ad client into which to insert the ad unit.
       * @param {adsensehost(v4.1).AdUnit} params.resource Request body data
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsensehost.accounts.adunits.list
       *
       * @desc List all ad units in the specified publisher's AdSense account.
       *
       * @alias adsensehost.accounts.adunits.list
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsensehost.accounts.adunits.patch
       *
       * @desc Update the supplied ad unit in the specified publisher AdSense account. This method supports patch semantics.
       *
       * @alias adsensehost.accounts.adunits.patch
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
       * @param {string} params.adClientId Ad client which contains the ad unit.
       * @param {string} params.adUnitId Ad unit to get.
       * @param {adsensehost(v4.1).AdUnit} params.resource Request body data
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId', 'adUnitId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adsensehost.accounts.adunits.update
       *
       * @desc Update the supplied ad unit in the specified publisher AdSense account.
       *
       * @alias adsensehost.accounts.adunits.update
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Account which contains the ad client.
       * @param {string} params.adClientId Ad client which contains the ad unit.
       * @param {adsensehost(v4.1).AdUnit} params.resource Request body data
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/adclients/{adClientId}/adunits',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'adClientId'],
          pathParams: ['accountId', 'adClientId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    reports: {

      /**
       * adsensehost.accounts.reports.generate
       *
       * @desc Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
       *
       * @alias adsensehost.accounts.reports.generate
       * @memberOf! adsensehost(v4.1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Hosted account upon which to report.
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
            url: 'https://www.googleapis.com/adsensehost/v4.1/accounts/{accountId}/reports',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'startDate', 'endDate'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.adclients = {

    /**
     * adsensehost.adclients.get
     *
     * @desc Get information about one of the ad clients in the Host AdSense account.
     *
     * @alias adsensehost.adclients.get
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client to get.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.adclients.list
     *
     * @desc List all host ad clients in this AdSense account.
     *
     * @alias adsensehost.adclients.list
     * @memberOf! adsensehost(v4.1)
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients',
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

  self.associationsessions = {

    /**
     * adsensehost.associationsessions.start
     *
     * @desc Create an association session for initiating an association with an AdSense user.
     *
     * @alias adsensehost.associationsessions.start
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productCode Products to associate with the user.
     * @param {string=} params.userLocale The preferred locale of the user.
     * @param {string=} params.websiteLocale The locale of the user's hosted website.
     * @param {string} params.websiteUrl The URL of the user's hosted website.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/associationsessions/start',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['productCode', 'websiteUrl'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.associationsessions.verify
     *
     * @desc Verify an association session after the association callback returns from AdSense signup.
     *
     * @alias adsensehost.associationsessions.verify
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.token The token returned to the association callback URL.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verify: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adsensehost/v4.1/associationsessions/verify',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['token'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.customchannels = {

    /**
     * adsensehost.customchannels.delete
     *
     * @desc Delete a specific custom channel from the host AdSense account.
     *
     * @alias adsensehost.customchannels.delete
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client from which to delete the custom channel.
     * @param {string} params.customChannelId Custom channel to delete.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels/{customChannelId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'customChannelId'],
        pathParams: ['adClientId', 'customChannelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.customchannels.get
     *
     * @desc Get a specific custom channel from the host AdSense account.
     *
     * @alias adsensehost.customchannels.get
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client from which to get the custom channel.
     * @param {string} params.customChannelId Custom channel to get.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels/{customChannelId}',
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
     * adsensehost.customchannels.insert
     *
     * @desc Add a new custom channel to the host AdSense account.
     *
     * @alias adsensehost.customchannels.insert
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client to which the new custom channel will be added.
     * @param {adsensehost(v4.1).CustomChannel} params.resource Request body data
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.customchannels.list
     *
     * @desc List all host custom channels in this AdSense account.
     *
     * @alias adsensehost.customchannels.list
     * @memberOf! adsensehost(v4.1)
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.customchannels.patch
     *
     * @desc Update a custom channel in the host AdSense account. This method supports patch semantics.
     *
     * @alias adsensehost.customchannels.patch
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client in which the custom channel will be updated.
     * @param {string} params.customChannelId Custom channel to get.
     * @param {adsensehost(v4.1).CustomChannel} params.resource Request body data
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'customChannelId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.customchannels.update
     *
     * @desc Update a custom channel in the host AdSense account.
     *
     * @alias adsensehost.customchannels.update
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client in which the custom channel will be updated.
     * @param {adsensehost(v4.1).CustomChannel} params.resource Request body data
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/customchannels',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.reports = {

    /**
     * adsensehost.reports.generate
     *
     * @desc Generate an AdSense report based on the report request sent in the query parameters. Returns the result as JSON; to retrieve output in CSV format specify "alt=csv" as a query parameter.
     *
     * @alias adsensehost.reports.generate
     * @memberOf! adsensehost(v4.1)
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/reports',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['startDate', 'endDate'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.urlchannels = {

    /**
     * adsensehost.urlchannels.delete
     *
     * @desc Delete a URL channel from the host AdSense account.
     *
     * @alias adsensehost.urlchannels.delete
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client from which to delete the URL channel.
     * @param {string} params.urlChannelId URL channel to delete.
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/urlchannels/{urlChannelId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['adClientId', 'urlChannelId'],
        pathParams: ['adClientId', 'urlChannelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.urlchannels.insert
     *
     * @desc Add a new URL channel to the host AdSense account.
     *
     * @alias adsensehost.urlchannels.insert
     * @memberOf! adsensehost(v4.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.adClientId Ad client to which the new URL channel will be added.
     * @param {adsensehost(v4.1).UrlChannel} params.resource Request body data
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/urlchannels',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['adClientId'],
        pathParams: ['adClientId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adsensehost.urlchannels.list
     *
     * @desc List all host URL channels in the host AdSense account.
     *
     * @alias adsensehost.urlchannels.list
     * @memberOf! adsensehost(v4.1)
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
          url: 'https://www.googleapis.com/adsensehost/v4.1/adclients/{adClientId}/urlchannels',
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
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} id Unique identifier of this account.
 * @property {string} kind Kind of resource this is, in this case adsensehost#account.
 * @property {string} name Name of this account.
 * @property {string} status Approval status of this account. One of: PENDING, APPROVED, DISABLED.
 */
/**
 * @typedef Accounts
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsensehost(v4.1).Account[]} items The accounts returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsensehost#accounts.
 */
/**
 * @typedef AdClient
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {boolean} arcOptIn Whether this ad client is opted in to ARC.
 * @property {string} id Unique identifier of this ad client.
 * @property {string} kind Kind of resource this is, in this case adsensehost#adClient.
 * @property {string} productCode This ad client&#39;s product code, which corresponds to the PRODUCT_CODE report dimension.
 * @property {boolean} supportsReporting Whether this ad client supports being reported on.
 */
/**
 * @typedef AdClients
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsensehost(v4.1).AdClient[]} items The ad clients returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsensehost#adClients.
 * @property {string} nextPageToken Continuation token used to page through ad clients. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AdCode
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} adCode The ad code snippet.
 * @property {string} kind Kind this is, in this case adsensehost#adCode.
 */
/**
 * @typedef AdStyle
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {object} colors The colors included in the style. These are represented as six hexadecimal characters, similar to HTML color codes, but without the leading hash.
 * @property {string} corners The style of the corners in the ad (deprecated: never populated, ignored).
 * @property {object} font The font which is included in the style.
 * @property {string} kind Kind this is, in this case adsensehost#adStyle.
 */
/**
 * @typedef AdUnit
 * @memberOf! adsensehost(v4.1)
 * @type object
* @property {string} code Identity code of this ad unit, not necessarily unique across ad clients.
* @property {object} contentAdsSettings Settings specific to content ads (AFC) and highend mobile content ads (AFMC - deprecated).
* @property {adsensehost(v4.1).AdStyle} customStyle Custom style information specific to this ad unit.
* @property {string} id Unique identifier of this ad unit. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
* @property {string} kind Kind of resource this is, in this case adsensehost#adUnit.
* @property {object} mobileContentAdsSettings Settings specific to WAP mobile content ads (AFMC - deprecated).
* @property {string} name Name of this ad unit.
* @property {string} status Status of this ad unit. Possible values are:
NEW: Indicates that the ad unit was created within the last seven days and does not yet have any activity associated with it.

ACTIVE: Indicates that there has been activity on this ad unit in the last seven days.

INACTIVE: Indicates that there has been no activity on this ad unit in the last seven days.
*/
/**
 * @typedef AdUnits
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsensehost(v4.1).AdUnit[]} items The ad units returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsensehost#adUnits.
 * @property {string} nextPageToken Continuation token used to page through ad units. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef AssociationSession
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} accountId Hosted account id of the associated publisher after association. Present if status is ACCEPTED.
 * @property {string} id Unique identifier of this association session.
 * @property {string} kind Kind of resource this is, in this case adsensehost#associationSession.
 * @property {string[]} productCodes The products to associate with the user. Options: AFC, AFG, AFV, AFS (deprecated), AFMC (deprecated)
 * @property {string} redirectUrl Redirect URL of this association session. Used to redirect users into the AdSense association flow.
 * @property {string} status Status of the completed association, available once the association callback token has been verified. One of ACCEPTED, REJECTED, or ERROR.
 * @property {string} userLocale The preferred locale of the user themselves when going through the AdSense association flow.
 * @property {string} websiteLocale The locale of the user&#39;s hosted website.
 * @property {string} websiteUrl The URL of the user&#39;s hosted website.
 */
/**
 * @typedef CustomChannel
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} code Code of this custom channel, not necessarily unique across ad clients.
 * @property {string} id Unique identifier of this custom channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adsensehost#customChannel.
 * @property {string} name Name of this custom channel.
 */
/**
 * @typedef CustomChannels
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsensehost(v4.1).CustomChannel[]} items The custom channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsensehost#customChannels.
 * @property {string} nextPageToken Continuation token used to page through custom channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef Report
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string[]} averages The averages of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {object[]} headers The header information of the columns requested in the report. This is a list of headers; one for each dimension in the request, followed by one for each metric in the request.
 * @property {string} kind Kind this is, in this case adsensehost#report.
 * @property {array[]} rows The output rows of the report. Each row is a list of cells; one for each dimension in the request, followed by one for each metric in the request. The dimension cells contain strings, and the metric cells contain numbers.
 * @property {string} totalMatchedRows The total number of rows matched by the report request. Fewer rows may be returned in the response due to being limited by the row count requested or the report row limit.
 * @property {string[]} totals The totals of the report. This is the same length as any other row in the report; cells corresponding to dimension columns are empty.
 * @property {string[]} warnings Any warnings associated with generation of the report.
 */
/**
 * @typedef UrlChannel
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} id Unique identifier of this URL channel. This should be considered an opaque identifier; it is not safe to rely on it being in any particular format.
 * @property {string} kind Kind of resource this is, in this case adsensehost#urlChannel.
 * @property {string} urlPattern URL Pattern of this URL channel. Does not include &quot;http://&quot; or &quot;https://&quot;. Example: www.example.com/home
 */
/**
 * @typedef UrlChannels
 * @memberOf! adsensehost(v4.1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {adsensehost(v4.1).UrlChannel[]} items The URL channels returned in this list response.
 * @property {string} kind Kind of list this is, in this case adsensehost#urlChannels.
 * @property {string} nextPageToken Continuation token used to page through URL channels. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
module.exports = Adsensehost;
