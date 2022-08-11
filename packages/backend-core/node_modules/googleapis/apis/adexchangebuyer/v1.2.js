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
 * Ad Exchange Buyer API
 *
 * Accesses your bidding-account information, submits creatives for validation, finds available direct deals, and retrieves performance reports.
 *
 * @example
 * var google = require('googleapis');
 * var adexchangebuyer = google.adexchangebuyer('v1.2');
 *
 * @namespace adexchangebuyer
 * @type {Function}
 * @version v1.2
 * @variation v1.2
 * @param {object=} options Options for Adexchangebuyer
 */
function Adexchangebuyer(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * adexchangebuyer.accounts.get
     *
     * @desc Gets one account by ID.
     *
     * @alias adexchangebuyer.accounts.get
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.id The account id
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/accounts/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.accounts.list
     *
     * @desc Retrieves the authenticated user's list of accounts.
     *
     * @alias adexchangebuyer.accounts.list
     * @memberOf! adexchangebuyer(v1.2)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/accounts',
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
     * adexchangebuyer.accounts.patch
     *
     * @desc Updates an existing account. This method supports patch semantics.
     *
     * @alias adexchangebuyer.accounts.patch
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.2).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/accounts/{id}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.accounts.update
     *
     * @desc Updates an existing account.
     *
     * @alias adexchangebuyer.accounts.update
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.2).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/accounts/{id}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creatives = {

    /**
     * adexchangebuyer.creatives.get
     *
     * @desc Gets the status for a single creative. A creative will be available 30-40 minutes after submission.
     *
     * @alias adexchangebuyer.creatives.get
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The id for the account that will serve this creative.
     * @param {string} params.buyerCreativeId The buyer-specific id for this creative.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/creatives/{accountId}/{buyerCreativeId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId', 'buyerCreativeId'],
        pathParams: ['accountId', 'buyerCreativeId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.creatives.insert
     *
     * @desc Submit a new creative.
     *
     * @alias adexchangebuyer.creatives.insert
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object} params Parameters for request
     * @param {adexchangebuyer(v1.2).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/creatives',
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
     * adexchangebuyer.creatives.list
     *
     * @desc Retrieves a list of the authenticated user's active creatives. A creative will be available 30-40 minutes after submission.
     *
     * @alias adexchangebuyer.creatives.list
     * @memberOf! adexchangebuyer(v1.2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
     * @param {string=} params.pageToken A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
     * @param {string=} params.statusFilter When specified, only creatives having the given status are returned.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.2/creatives',
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
}

/**
 * @typedef Account
 * @memberOf! adexchangebuyer(v1.2)
 * @type object
 * @property {object[]} bidderLocation Your bidder locations that have distinct URLs.
 * @property {string} cookieMatchingNid The nid parameter value used in cookie match requests. Please contact your technical account manager if you need to change this.
 * @property {string} cookieMatchingUrl The base URL used in cookie match requests.
 * @property {integer} id Account id.
 * @property {string} kind Resource type.
 * @property {integer} maximumActiveCreatives The maximum number of active creatives that an account can have, where a creative is active if it was inserted or bid with in the last 30 days. Please contact your technical account manager if you need to change this.
 * @property {integer} maximumTotalQps The sum of all bidderLocation.maximumQps values cannot exceed this. Please contact your technical account manager if you need to change this.
 * @property {integer} numberActiveCreatives The number of creatives that this account inserted or bid with in the last 30 days.
 */
/**
 * @typedef AccountsList
 * @memberOf! adexchangebuyer(v1.2)
 * @type object
 * @property {adexchangebuyer(v1.2).Account[]} items A list of accounts.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Creative
 * @memberOf! adexchangebuyer(v1.2)
 * @type object
 * @property {string} HTMLSnippet The HTML snippet that displays the ad when inserted in the web page. If set, videoURL should not be set.
 * @property {integer} accountId Account id.
 * @property {string[]} advertiserId Detected advertiser id, if any. Read-only. This field should not be set in requests.
 * @property {string} advertiserName The name of the company being advertised in the creative.
 * @property {string} agencyId The agency id for this creative.
 * @property {string} apiUploadTimestamp The last upload timestamp of this creative if it was uploaded via API. Read-only. The value of this field is generated, and will be ignored for uploads. (formatted RFC 3339 timestamp).
 * @property {integer[]} attribute All attributes for the ads that may be shown from this snippet.
 * @property {string} buyerCreativeId A buyer-specific id identifying the creative in this ad.
 * @property {string[]} clickThroughUrl The set of destination urls for the snippet.
 * @property {object[]} corrections Shows any corrections that were applied to this creative. Read-only. This field should not be set in requests.
 * @property {object[]} disapprovalReasons The reasons for disapproval, if any. Note that not all disapproval reasons may be categorized, so it is possible for the creative to have a status of DISAPPROVED with an empty list for disapproval_reasons. In this case, please reach out to your TAM to help debug the issue. Read-only. This field should not be set in requests.
 * @property {object} filteringReasons The filtering reasons for the creative. Read-only. This field should not be set in requests.
 * @property {integer} height Ad height.
 * @property {string[]} impressionTrackingUrl The set of urls to be called to record an impression.
 * @property {string} kind Resource type.
 * @property {integer[]} productCategories Detected product categories, if any. Read-only. This field should not be set in requests.
 * @property {integer[]} restrictedCategories All restricted categories for the ads that may be shown from this snippet.
 * @property {integer[]} sensitiveCategories Detected sensitive categories, if any. Read-only. This field should not be set in requests.
 * @property {string} status Creative serving status. Read-only. This field should not be set in requests.
 * @property {integer[]} vendorType All vendor types for the ads that may be shown from this snippet.
 * @property {integer} version The version for this creative. Read-only. This field should not be set in requests.
 * @property {string} videoURL The url to fetch a video ad. If set, HTMLSnippet should not be set.
 * @property {integer} width Ad width.
 */
/**
 * @typedef CreativesList
 * @memberOf! adexchangebuyer(v1.2)
 * @type object
 * @property {adexchangebuyer(v1.2).Creative[]} items A list of creatives.
 * @property {string} kind Resource type.
 * @property {string} nextPageToken Continuation token used to page through creatives. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
module.exports = Adexchangebuyer;
