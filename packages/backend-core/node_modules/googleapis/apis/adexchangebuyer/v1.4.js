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
 * var adexchangebuyer = google.adexchangebuyer('v1.4');
 *
 * @namespace adexchangebuyer
 * @type {Function}
 * @version v1.4
 * @variation v1.4
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
     * @memberOf! adexchangebuyer(v1.4)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/accounts/{id}',
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
     * @memberOf! adexchangebuyer(v1.4)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/accounts',
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
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.confirmUnsafeAccountChange Confirmation for erasing bidder and cookie matching urls.
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.4).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/accounts/{id}',
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
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.confirmUnsafeAccountChange Confirmation for erasing bidder and cookie matching urls.
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.4).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/accounts/{id}',
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

  self.billingInfo = {

    /**
     * adexchangebuyer.billingInfo.get
     *
     * @desc Returns the billing information for one account specified by account ID.
     *
     * @alias adexchangebuyer.billingInfo.get
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The account id.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/billinginfo/{accountId}',
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
     * adexchangebuyer.billingInfo.list
     *
     * @desc Retrieves a list of billing information for all accounts of the authenticated user.
     *
     * @alias adexchangebuyer.billingInfo.list
     * @memberOf! adexchangebuyer(v1.4)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/billinginfo',
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

  self.budget = {

    /**
     * adexchangebuyer.budget.get
     *
     * @desc Returns the budget information for the adgroup specified by the accountId and billingId.
     *
     * @alias adexchangebuyer.budget.get
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to get the budget information for.
     * @param {string} params.billingId The billing id to get the budget information for.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/billinginfo/{accountId}/{billingId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId', 'billingId'],
        pathParams: ['accountId', 'billingId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.budget.patch
     *
     * @desc Updates the budget amount for the budget of the adgroup specified by the accountId and billingId, with the budget amount in the request. This method supports patch semantics.
     *
     * @alias adexchangebuyer.budget.patch
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id associated with the budget being updated.
     * @param {string} params.billingId The billing id associated with the budget being updated.
     * @param {adexchangebuyer(v1.4).Budget} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/billinginfo/{accountId}/{billingId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['accountId', 'billingId'],
        pathParams: ['accountId', 'billingId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.budget.update
     *
     * @desc Updates the budget amount for the budget of the adgroup specified by the accountId and billingId, with the budget amount in the request.
     *
     * @alias adexchangebuyer.budget.update
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id associated with the budget being updated.
     * @param {string} params.billingId The billing id associated with the budget being updated.
     * @param {adexchangebuyer(v1.4).Budget} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/billinginfo/{accountId}/{billingId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['accountId', 'billingId'],
        pathParams: ['accountId', 'billingId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creatives = {

    /**
     * adexchangebuyer.creatives.addDeal
     *
     * @desc Add a deal id association for the creative.
     *
     * @alias adexchangebuyer.creatives.addDeal
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The id for the account that will serve this creative.
     * @param {string} params.buyerCreativeId The buyer-specific id for this creative.
     * @param {string} params.dealId The id of the deal id to associate with this creative.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addDeal: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives/{accountId}/{buyerCreativeId}/addDeal/{dealId}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['accountId', 'buyerCreativeId', 'dealId'],
        pathParams: ['accountId', 'buyerCreativeId', 'dealId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.creatives.get
     *
     * @desc Gets the status for a single creative. A creative will be available 30-40 minutes after submission.
     *
     * @alias adexchangebuyer.creatives.get
     * @memberOf! adexchangebuyer(v1.4)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives/{accountId}/{buyerCreativeId}',
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
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {adexchangebuyer(v1.4).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives',
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
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.accountId When specified, only creatives for the given account ids are returned.
     * @param {string=} params.buyerCreativeId When specified, only creatives for the given buyer creative ids are returned.
     * @param {string=} params.dealsStatusFilter When specified, only creatives having the given deals status are returned.
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
     * @param {string=} params.openAuctionStatusFilter When specified, only creatives having the given open auction status are returned.
     * @param {string=} params.pageToken A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives',
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
     * adexchangebuyer.creatives.listDeals
     *
     * @desc Lists the external deal ids associated with the creative.
     *
     * @alias adexchangebuyer.creatives.listDeals
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The id for the account that will serve this creative.
     * @param {string} params.buyerCreativeId The buyer-specific id for this creative.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listDeals: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives/{accountId}/{buyerCreativeId}/listDeals',
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
     * adexchangebuyer.creatives.removeDeal
     *
     * @desc Remove a deal id associated with the creative.
     *
     * @alias adexchangebuyer.creatives.removeDeal
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The id for the account that will serve this creative.
     * @param {string} params.buyerCreativeId The buyer-specific id for this creative.
     * @param {string} params.dealId The id of the deal id to disassociate with this creative.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeDeal: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/creatives/{accountId}/{buyerCreativeId}/removeDeal/{dealId}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['accountId', 'buyerCreativeId', 'dealId'],
        pathParams: ['accountId', 'buyerCreativeId', 'dealId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.marketplacedeals = {

    /**
     * adexchangebuyer.marketplacedeals.delete
     *
     * @desc Delete the specified deals from the proposal
     *
     * @alias adexchangebuyer.marketplacedeals.delete
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposalId to delete deals from.
     * @param {adexchangebuyer(v1.4).DeleteOrderDealsRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/deals/delete',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.marketplacedeals.insert
     *
     * @desc Add new deals for the specified proposal
     *
     * @alias adexchangebuyer.marketplacedeals.insert
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId proposalId for which deals need to be added.
     * @param {adexchangebuyer(v1.4).AddOrderDealsRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/deals/insert',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.marketplacedeals.list
     *
     * @desc List all the deals for a given proposal
     *
     * @alias adexchangebuyer.marketplacedeals.list
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.pqlQuery Query string to retrieve specific deals.
     * @param {string} params.proposalId The proposalId to get deals for. To search across all proposals specify order_id = '-' as part of the URL.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/deals',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.marketplacedeals.update
     *
     * @desc Replaces all the deals in the proposal with the passed in deals
     *
     * @alias adexchangebuyer.marketplacedeals.update
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposalId to edit deals on.
     * @param {adexchangebuyer(v1.4).EditAllOrderDealsRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/deals/update',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.marketplacenotes = {

    /**
     * adexchangebuyer.marketplacenotes.insert
     *
     * @desc Add notes to the proposal
     *
     * @alias adexchangebuyer.marketplacenotes.insert
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposalId to add notes for.
     * @param {adexchangebuyer(v1.4).AddOrderNotesRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/notes/insert',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.marketplacenotes.list
     *
     * @desc Get all the notes associated with a proposal
     *
     * @alias adexchangebuyer.marketplacenotes.list
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.pqlQuery Query string to retrieve specific notes. To search the text contents of notes, please use syntax like "WHERE note.note = "foo" or "WHERE note.note LIKE "%bar%"
     * @param {string} params.proposalId The proposalId to get notes for. To search across all proposals specify order_id = '-' as part of the URL.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/notes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.marketplaceprivateauction = {

    /**
     * adexchangebuyer.marketplaceprivateauction.updateproposal
     *
     * @desc Update a given private auction proposal
     *
     * @alias adexchangebuyer.marketplaceprivateauction.updateproposal
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.privateAuctionId The private auction id to be updated.
     * @param {adexchangebuyer(v1.4).UpdatePrivateAuctionProposalRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateproposal: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/privateauction/{privateAuctionId}/updateproposal',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['privateAuctionId'],
        pathParams: ['privateAuctionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.performanceReport = {

    /**
     * adexchangebuyer.performanceReport.list
     *
     * @desc Retrieves the authenticated user's list of performance metrics.
     *
     * @alias adexchangebuyer.performanceReport.list
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to get the reports.
     * @param {string} params.endDateTime The end time of the report in ISO 8601 timestamp format using UTC.
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
     * @param {string=} params.pageToken A continuation token, used to page through performance reports. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
     * @param {string} params.startDateTime The start time of the report in ISO 8601 timestamp format using UTC.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/performancereport',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId', 'endDateTime', 'startDateTime'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pretargetingConfig = {

    /**
     * adexchangebuyer.pretargetingConfig.delete
     *
     * @desc Deletes an existing pretargeting config.
     *
     * @alias adexchangebuyer.pretargetingConfig.delete
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to delete the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to delete.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}/{configId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['accountId', 'configId'],
        pathParams: ['accountId', 'configId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.pretargetingConfig.get
     *
     * @desc Gets a specific pretargeting configuration
     *
     * @alias adexchangebuyer.pretargetingConfig.get
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to get the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to retrieve.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}/{configId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId', 'configId'],
        pathParams: ['accountId', 'configId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.pretargetingConfig.insert
     *
     * @desc Inserts a new pretargeting configuration.
     *
     * @alias adexchangebuyer.pretargetingConfig.insert
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to insert the pretargeting config for.
     * @param {adexchangebuyer(v1.4).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}',
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
     * adexchangebuyer.pretargetingConfig.list
     *
     * @desc Retrieves a list of the authenticated user's pretargeting configurations.
     *
     * @alias adexchangebuyer.pretargetingConfig.list
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to get the pretargeting configs for.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}',
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
     * adexchangebuyer.pretargetingConfig.patch
     *
     * @desc Updates an existing pretargeting config. This method supports patch semantics.
     *
     * @alias adexchangebuyer.pretargetingConfig.patch
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to update the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to update.
     * @param {adexchangebuyer(v1.4).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}/{configId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['accountId', 'configId'],
        pathParams: ['accountId', 'configId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.pretargetingConfig.update
     *
     * @desc Updates an existing pretargeting config.
     *
     * @alias adexchangebuyer.pretargetingConfig.update
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to update the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to update.
     * @param {adexchangebuyer(v1.4).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/pretargetingconfigs/{accountId}/{configId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['accountId', 'configId'],
        pathParams: ['accountId', 'configId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.products = {

    /**
     * adexchangebuyer.products.get
     *
     * @desc Gets the requested product by id.
     *
     * @alias adexchangebuyer.products.get
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId The id for the product to get the head revision for.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/products/{productId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['productId'],
        pathParams: ['productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.products.search
     *
     * @desc Gets the requested product.
     *
     * @alias adexchangebuyer.products.search
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.pqlQuery The pql query used to query for products.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/products/search',
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

  self.proposals = {

    /**
     * adexchangebuyer.proposals.get
     *
     * @desc Get a proposal given its id
     *
     * @alias adexchangebuyer.proposals.get
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId Id of the proposal to retrieve.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.proposals.insert
     *
     * @desc Create the given list of proposals
     *
     * @alias adexchangebuyer.proposals.insert
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {adexchangebuyer(v1.4).CreateOrdersRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/insert',
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
     * adexchangebuyer.proposals.patch
     *
     * @desc Update the given proposal. This method supports patch semantics.
     *
     * @alias adexchangebuyer.proposals.patch
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposal id to update.
     * @param {string} params.revisionNumber The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
     * @param {string} params.updateAction The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
     * @param {adexchangebuyer(v1.4).Proposal} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/{revisionNumber}/{updateAction}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['proposalId', 'revisionNumber', 'updateAction'],
        pathParams: ['proposalId', 'revisionNumber', 'updateAction'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.proposals.search
     *
     * @desc Search for proposals using pql query
     *
     * @alias adexchangebuyer.proposals.search
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.pqlQuery Query string to retrieve specific proposals.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/search',
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
     * adexchangebuyer.proposals.setupcomplete
     *
     * @desc Update the given proposal to indicate that setup has been completed.
     *
     * @alias adexchangebuyer.proposals.setupcomplete
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposal id for which the setup is complete
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setupcomplete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/setupcomplete',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['proposalId'],
        pathParams: ['proposalId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * adexchangebuyer.proposals.update
     *
     * @desc Update the given proposal
     *
     * @alias adexchangebuyer.proposals.update
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.proposalId The proposal id to update.
     * @param {string} params.revisionNumber The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
     * @param {string} params.updateAction The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
     * @param {adexchangebuyer(v1.4).Proposal} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/proposals/{proposalId}/{revisionNumber}/{updateAction}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['proposalId', 'revisionNumber', 'updateAction'],
        pathParams: ['proposalId', 'revisionNumber', 'updateAction'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pubprofiles = {

    /**
     * adexchangebuyer.pubprofiles.list
     *
     * @desc Gets the requested publisher profile(s) by publisher accountId.
     *
     * @alias adexchangebuyer.pubprofiles.list
     * @memberOf! adexchangebuyer(v1.4)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.accountId The accountId of the publisher to get profiles for.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.4/publisher/{accountId}/profiles',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId'],
        pathParams: ['accountId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Account
 * @memberOf! adexchangebuyer(v1.4)
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
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Account[]} items A list of accounts.
 * @property {string} kind Resource type.
 */
/**
 * @typedef AddOrderDealsRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals The list of deals to add
 * @property {string} proposalRevisionNumber The last known proposal revision number.
 * @property {string} updateAction Indicates an optional action to take on the proposal
 */
/**
 * @typedef AddOrderDealsResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals List of deals added (in the same proposal as passed in the request)
 * @property {string} proposalRevisionNumber The updated revision number for the proposal.
 */
/**
 * @typedef AddOrderNotesRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceNote[]} notes The list of notes to add.
 */
/**
 * @typedef AddOrderNotesResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceNote[]} notes 
 */
/**
 * @typedef BillingInfo
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {integer} accountId Account id.
 * @property {string} accountName Account name.
 * @property {string[]} billingId A list of adgroup IDs associated with this particular account. These IDs may show up as part of a realtime bidding BidRequest, which indicates a bid request for this account.
 * @property {string} kind Resource type.
 */
/**
 * @typedef BillingInfoList
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).BillingInfo[]} items A list of billing info relevant for your account.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Budget
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} accountId The id of the account. This is required for get and update requests.
 * @property {string} billingId The billing id to determine which adgroup to provide budget information for. This is required for get and update requests.
 * @property {string} budgetAmount The daily budget amount in unit amount of the account currency to apply for the billingId provided. This is required for update requests.
 * @property {string} currencyCode The currency code for the buyer. This cannot be altered here.
 * @property {string} id The unique id that describes this item.
 * @property {string} kind The kind of the resource, i.e. &quot;adexchangebuyer#budget&quot;.
 */
/**
 * @typedef Buyer
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} accountId Adx account id of the buyer.
 */
/**
 * @typedef ContactInformation
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} email Email address of the contact.
 * @property {string} name The name of the contact.
 */
/**
 * @typedef CreateOrdersRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Proposal[]} proposals The list of proposals to create.
 * @property {string} webPropertyCode Web property id of the seller creating these orders
 */
/**
 * @typedef CreateOrdersResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Proposal[]} proposals The list of proposals successfully created.
 */
/**
 * @typedef Creative
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} HTMLSnippet The HTML snippet that displays the ad when inserted in the web page. If set, videoURL should not be set.
 * @property {integer} accountId Account id.
 * @property {string} adChoicesDestinationUrl The link to the Ad Preferences page. This is only supported for native ads.
 * @property {string[]} advertiserId Detected advertiser id, if any. Read-only. This field should not be set in requests.
 * @property {string} advertiserName The name of the company being advertised in the creative.
 * @property {string} agencyId The agency id for this creative.
 * @property {string} apiUploadTimestamp The last upload timestamp of this creative if it was uploaded via API. Read-only. The value of this field is generated, and will be ignored for uploads. (formatted RFC 3339 timestamp).
 * @property {integer[]} attribute All attributes for the ads that may be shown from this snippet.
 * @property {string} buyerCreativeId A buyer-specific id identifying the creative in this ad.
 * @property {string[]} clickThroughUrl The set of destination urls for the snippet.
 * @property {object[]} corrections Shows any corrections that were applied to this creative. Read-only. This field should not be set in requests.
 * @property {string} dealsStatus Top-level deals status. Read-only. This field should not be set in requests. If disapproved, an entry for auctionType=DIRECT_DEALS (or ALL) in servingRestrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case it may be preferable to read from servingRestrictions directly.
 * @property {string[]} detectedDomains Detected domains for this creative. Read-only. This field should not be set in requests.
 * @property {object} filteringReasons The filtering reasons for the creative. Read-only. This field should not be set in requests.
 * @property {integer} height Ad height.
 * @property {string[]} impressionTrackingUrl The set of urls to be called to record an impression.
 * @property {string} kind Resource type.
 * @property {string[]} languages Detected languages for this creative. Read-only. This field should not be set in requests.
 * @property {object} nativeAd If nativeAd is set, HTMLSnippet and the videoURL outside of nativeAd should not be set. (The videoURL inside nativeAd can be set.)
 * @property {string} openAuctionStatus Top-level open auction status. Read-only. This field should not be set in requests. If disapproved, an entry for auctionType=OPEN_AUCTION (or ALL) in servingRestrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case it may be preferable to read from ServingRestrictions directly.
 * @property {integer[]} productCategories Detected product categories, if any. Read-only. This field should not be set in requests.
 * @property {integer[]} restrictedCategories All restricted categories for the ads that may be shown from this snippet.
 * @property {integer[]} sensitiveCategories Detected sensitive categories, if any. Read-only. This field should not be set in requests.
 * @property {object[]} servingRestrictions The granular status of this ad in specific contexts. A context here relates to where something ultimately serves (for example, a physical location, a platform, an HTTPS vs HTTP request, or the type of auction). Read-only. This field should not be set in requests.
 * @property {integer[]} vendorType All vendor types for the ads that may be shown from this snippet.
 * @property {integer} version The version for this creative. Read-only. This field should not be set in requests.
 * @property {string} videoURL The URL to fetch a video ad. If set, HTMLSnippet and the nativeAd should not be set. Note, this is different from resource.native_ad.video_url above.
 * @property {integer} width Ad width.
 */
/**
 * @typedef CreativeDealIds
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {object[]} dealStatuses A list of external deal ids and ARC approval status.
 * @property {string} kind Resource type.
 */
/**
 * @typedef CreativesList
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Creative[]} items A list of creatives.
 * @property {string} kind Resource type.
 * @property {string} nextPageToken Continuation token used to page through creatives. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef DealServingMetadata
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).DealServingMetadataDealPauseStatus} dealPauseStatus Tracks which parties (if any) have paused a deal. (readonly, except via PauseResumeOrderDeals action)
 */
/**
 * @typedef DealServingMetadataDealPauseStatus
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} buyerPauseReason 
 * @property {string} firstPausedBy If the deal is paused, records which party paused the deal first.
 * @property {boolean} hasBuyerPaused 
 * @property {boolean} hasSellerPaused 
 * @property {string} sellerPauseReason 
 */
/**
 * @typedef DealTerms
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} brandingType Visibilty of the URL in bid requests.
 * @property {string} crossListedExternalDealIdType Indicates that this ExternalDealId exists under at least two different AdxInventoryDeals. Currently, the only case that the same ExternalDealId will exist is programmatic cross sell case.
 * @property {string} description Description for the proposed terms of the deal.
 * @property {adexchangebuyer(v1.4).Price} estimatedGrossSpend Non-binding estimate of the estimated gross spend for this deal Can be set by buyer or seller.
 * @property {string} estimatedImpressionsPerDay Non-binding estimate of the impressions served per day Can be set by buyer or seller.
 * @property {adexchangebuyer(v1.4).DealTermsGuaranteedFixedPriceTerms} guaranteedFixedPriceTerms The terms for guaranteed fixed price deals.
 * @property {adexchangebuyer(v1.4).DealTermsNonGuaranteedAuctionTerms} nonGuaranteedAuctionTerms The terms for non-guaranteed auction deals.
 * @property {adexchangebuyer(v1.4).DealTermsNonGuaranteedFixedPriceTerms} nonGuaranteedFixedPriceTerms The terms for non-guaranteed fixed price deals.
 * @property {adexchangebuyer(v1.4).DealTermsRubiconNonGuaranteedTerms} rubiconNonGuaranteedTerms The terms for rubicon non-guaranteed deals.
 * @property {string} sellerTimeZone For deals with Cost Per Day billing, defines the timezone used to mark the boundaries of a day (buyer-readonly)
 */
/**
 * @typedef DealTermsGuaranteedFixedPriceTerms
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).DealTermsGuaranteedFixedPriceTermsBillingInfo} billingInfo External billing info for this Deal. This field is relevant when external billing info such as price has a different currency code than DFP/AdX.
 * @property {adexchangebuyer(v1.4).PricePerBuyer[]} fixedPrices Fixed price for the specified buyer.
 * @property {string} guaranteedImpressions Guaranteed impressions as a percentage. This is the percentage of guaranteed looks that the buyer is guaranteeing to buy.
 * @property {string} guaranteedLooks Count of guaranteed looks. Required for deal, optional for product. For CPD deals, buyer changes to guaranteed_looks will be ignored.
 * @property {string} minimumDailyLooks Count of minimum daily looks for a CPD deal. For CPD deals, buyer should negotiate on this field instead of guaranteed_looks.
 */
/**
 * @typedef DealTermsGuaranteedFixedPriceTermsBillingInfo
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} currencyConversionTimeMs The timestamp (in ms since epoch) when the original reservation price for the deal was first converted to DFP currency. This is used to convert the contracted price into advertiser&#39;s currency without discrepancy.
 * @property {string} dfpLineItemId The DFP line item id associated with this deal. For features like CPD, buyers can retrieve the DFP line item for billing reconciliation.
 * @property {string} originalContractedQuantity The original contracted quantity (# impressions) for this deal. To ensure delivery, sometimes the publisher will book the deal with a impression buffer, such that guaranteed_looks is greater than the contracted quantity. However clients are billed using the original contracted quantity.
 * @property {adexchangebuyer(v1.4).Price} price The original reservation price for the deal, if the currency code is different from the one used in negotiation.
 */
/**
 * @typedef DealTermsNonGuaranteedAuctionTerms
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {boolean} autoOptimizePrivateAuction True if open auction buyers are allowed to compete with invited buyers in this private auction (buyer-readonly).
 * @property {adexchangebuyer(v1.4).PricePerBuyer[]} reservePricePerBuyers Reserve price for the specified buyer.
 */
/**
 * @typedef DealTermsNonGuaranteedFixedPriceTerms
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).PricePerBuyer[]} fixedPrices Fixed price for the specified buyer.
 */
/**
 * @typedef DealTermsRubiconNonGuaranteedTerms
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Price} priorityPrice Optional price for Rubicon priority access in the auction.
 * @property {adexchangebuyer(v1.4).Price} standardPrice Optional price for Rubicon standard access in the auction.
 */
/**
 * @typedef DeleteOrderDealsRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string[]} dealIds List of deals to delete for a given proposal
 * @property {string} proposalRevisionNumber The last known proposal revision number.
 * @property {string} updateAction Indicates an optional action to take on the proposal
 */
/**
 * @typedef DeleteOrderDealsResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals List of deals deleted (in the same proposal as passed in the request)
 * @property {string} proposalRevisionNumber The updated revision number for the proposal.
 */
/**
 * @typedef DeliveryControl
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} creativeBlockingLevel 
 * @property {string} deliveryRateType 
 * @property {adexchangebuyer(v1.4).DeliveryControlFrequencyCap[]} frequencyCaps 
 */
/**
 * @typedef DeliveryControlFrequencyCap
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {integer} maxImpressions 
 * @property {integer} numTimeUnits 
 * @property {string} timeUnitType 
 */
/**
 * @typedef Dimension
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} dimensionType 
 * @property {adexchangebuyer(v1.4).DimensionDimensionValue[]} dimensionValues 
 */
/**
 * @typedef DimensionDimensionValue
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {integer} id Id of the dimension.
 * @property {string} name Name of the dimension mainly for debugging purposes, except for the case of CREATIVE_SIZE. For CREATIVE_SIZE, strings are used instead of ids.
 * @property {integer} percentage Percent of total impressions for a dimension type. e.g. {dimension_type: &#39;GENDER&#39;, [{dimension_value: {id: 1, name: &#39;MALE&#39;, percentage: 60}}]} Gender MALE is 60% of all impressions which have gender.
 */
/**
 * @typedef EditAllOrderDealsRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals List of deals to edit. Service may perform 3 different operations based on comparison of deals in this list vs deals already persisted in database: 1. Add new deal to proposal If a deal in this list does not exist in the proposal, the service will create a new deal and add it to the proposal. Validation will follow AddOrderDealsRequest. 2. Update existing deal in the proposal If a deal in this list already exist in the proposal, the service will update that existing deal to this new deal in the request. Validation will follow UpdateOrderDealsRequest. 3. Delete deals from the proposal (just need the id) If a existing deal in the proposal is not present in this list, the service will delete that deal from the proposal. Validation will follow DeleteOrderDealsRequest.
 * @property {adexchangebuyer(v1.4).Proposal} proposal If specified, also updates the proposal in the batch transaction. This is useful when the proposal and the deals need to be updated in one transaction.
 * @property {string} proposalRevisionNumber The last known revision number for the proposal.
 * @property {string} updateAction Indicates an optional action to take on the proposal
 */
/**
 * @typedef EditAllOrderDealsResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals List of all deals in the proposal after edit.
 * @property {string} orderRevisionNumber The latest revision number after the update has been applied.
 */
/**
 * @typedef GetOffersResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Product[]} products The returned list of products.
 */
/**
 * @typedef GetOrderDealsResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceDeal[]} deals List of deals for the proposal
 */
/**
 * @typedef GetOrderNotesResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).MarketplaceNote[]} notes The list of matching notes. The notes for a proposal are ordered from oldest to newest. If the notes span multiple proposals, they will be grouped by proposal, with the notes for the most recently modified proposal appearing first.
 */
/**
 * @typedef GetOrdersResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Proposal[]} proposals The list of matching proposals.
 */
/**
 * @typedef GetPublisherProfilesByAccountIdResponse
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).PublisherProfileApiProto[]} profiles Profiles for the requested publisher
 */
/**
 * @typedef MarketplaceDeal
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).PrivateData} buyerPrivateData Buyer private data (hidden from seller).
 * @property {string} creationTimeMs The time (ms since epoch) of the deal creation. (readonly)
 * @property {string} creativePreApprovalPolicy Specifies the creative pre-approval policy (buyer-readonly)
 * @property {string} creativeSafeFrameCompatibility Specifies whether the creative is safeFrame compatible (buyer-readonly)
 * @property {string} dealId A unique deal-id for the deal (readonly).
 * @property {adexchangebuyer(v1.4).DealServingMetadata} dealServingMetadata Metadata about the serving status of this deal (readonly, writes via custom actions)
 * @property {adexchangebuyer(v1.4).DeliveryControl} deliveryControl The set of fields around delivery control that are interesting for a buyer to see but are non-negotiable. These are set by the publisher. This message is assigned an id of 100 since some day we would want to model this as a protobuf extension.
 * @property {string} externalDealId The external deal id assigned to this deal once the deal is finalized. This is the deal-id that shows up in serving/reporting etc. (readonly)
 * @property {string} flightEndTimeMs Proposed flight end time of the deal (ms since epoch) This will generally be stored in a granularity of a second. (updatable)
 * @property {string} flightStartTimeMs Proposed flight start time of the deal (ms since epoch) This will generally be stored in a granularity of a second. (updatable)
 * @property {string} inventoryDescription Description for the deal terms. (buyer-readonly)
 * @property {boolean} isRfpTemplate Indicates whether the current deal is a RFP template. RFP template is created by buyer and not based on seller created products.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;adexchangebuyer#marketplaceDeal&quot;.
 * @property {string} lastUpdateTimeMs The time (ms since epoch) when the deal was last updated. (readonly)
 * @property {string} name The name of the deal. (updatable)
 * @property {string} productId The product-id from which this deal was created. (readonly, except on create)
 * @property {string} productRevisionNumber The revision number of the product that the deal was created from (readonly, except on create)
 * @property {string} programmaticCreativeSource Specifies the creative source for programmatic deals, PUBLISHER means creative is provided by seller and ADVERTISR means creative is provided by buyer. (buyer-readonly)
 * @property {string} proposalId 
 * @property {adexchangebuyer(v1.4).ContactInformation[]} sellerContacts Optional Seller contact information for the deal (buyer-readonly)
 * @property {adexchangebuyer(v1.4).SharedTargeting[]} sharedTargetings The shared targeting visible to buyers and sellers. Each shared targeting entity is AND&#39;d together. (updatable)
 * @property {string} syndicationProduct The syndication product associated with the deal. (readonly, except on create)
 * @property {adexchangebuyer(v1.4).DealTerms} terms The negotiable terms of the deal. (updatable)
 * @property {string} webPropertyCode 
 */
/**
 * @typedef MarketplaceDealParty
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Buyer} buyer The buyer/seller associated with the deal. One of buyer/seller is specified for a deal-party.
 * @property {adexchangebuyer(v1.4).Seller} seller The buyer/seller associated with the deal. One of buyer/seller is specified for a deal party.
 */
/**
 * @typedef MarketplaceLabel
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} accountId The accountId of the party that created the label.
 * @property {string} createTimeMs The creation time (in ms since epoch) for the label.
 * @property {adexchangebuyer(v1.4).MarketplaceDealParty} deprecatedMarketplaceDealParty Information about the party that created the label.
 * @property {string} label The label to use.
 */
/**
 * @typedef MarketplaceNote
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} creatorRole The role of the person (buyer/seller) creating the note. (readonly)
 * @property {string} dealId Notes can optionally be associated with a deal. (readonly, except on create)
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;adexchangebuyer#marketplaceNote&quot;.
 * @property {string} note The actual note to attach. (readonly, except on create)
 * @property {string} noteId The unique id for the note. (readonly)
 * @property {string} proposalId The proposalId that a note is attached to. (readonly)
 * @property {string} proposalRevisionNumber If the note is associated with a proposal revision number, then store that here. (readonly, except on create)
 * @property {string} timestampMs The timestamp (ms since epoch) that this note was created. (readonly)
 */
/**
 * @typedef PerformanceReport
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {number} bidRate The number of bid responses with an ad.
 * @property {number} bidRequestRate The number of bid requests sent to your bidder.
 * @property {any[]} calloutStatusRate Rate of various prefiltering statuses per match. Please refer to the callout-status-codes.txt file for different statuses.
 * @property {any[]} cookieMatcherStatusRate Average QPS for cookie matcher operations.
 * @property {any[]} creativeStatusRate Rate of ads with a given status. Please refer to the creative-status-codes.txt file for different statuses.
 * @property {number} filteredBidRate The number of bid responses that were filtered due to a policy violation or other errors.
 * @property {any[]} hostedMatchStatusRate Average QPS for hosted match operations.
 * @property {number} inventoryMatchRate The number of potential queries based on your pretargeting settings.
 * @property {string} kind Resource type.
 * @property {number} latency50thPercentile The 50th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
 * @property {number} latency85thPercentile The 85th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
 * @property {number} latency95thPercentile The 95th percentile round trip latency(ms) as perceived from Google servers for the duration period covered by the report.
 * @property {number} noQuotaInRegion Rate of various quota account statuses per quota check.
 * @property {number} outOfQuota Rate of various quota account statuses per quota check.
 * @property {number} pixelMatchRequests Average QPS for pixel match requests from clients.
 * @property {number} pixelMatchResponses Average QPS for pixel match responses from clients.
 * @property {number} quotaConfiguredLimit The configured quota limits for this account.
 * @property {number} quotaThrottledLimit The throttled quota limits for this account.
 * @property {string} region The trading location of this data.
 * @property {number} successfulRequestRate The number of properly formed bid responses received by our servers within the deadline.
 * @property {string} timestamp The unix timestamp of the starting time of this performance data.
 * @property {number} unsuccessfulRequestRate The number of bid responses that were unsuccessful due to timeouts, incorrect formatting, etc.
 */
/**
 * @typedef PerformanceReportList
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} kind Resource type.
 * @property {adexchangebuyer(v1.4).PerformanceReport[]} performanceReport A list of performance reports relevant for the account.
 */
/**
 * @typedef PretargetingConfig
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} billingId The id for billing purposes, provided for reference. Leave this field blank for insert requests; the id will be generated automatically.
 * @property {string} configId The config id; generated automatically. Leave this field blank for insert requests.
 * @property {string} configName The name of the config. Must be unique. Required for all requests.
 * @property {string[]} creativeType List must contain exactly one of PRETARGETING_CREATIVE_TYPE_HTML or PRETARGETING_CREATIVE_TYPE_VIDEO.
 * @property {object[]} dimensions Requests which allow one of these (width, height) pairs will match. All pairs must be supported ad dimensions.
 * @property {string[]} excludedContentLabels Requests with any of these content labels will not match. Values are from content-labels.txt in the downloadable files section.
 * @property {string[]} excludedGeoCriteriaIds Requests containing any of these geo criteria ids will not match.
 * @property {object[]} excludedPlacements Requests containing any of these placements will not match.
 * @property {string[]} excludedUserLists Requests containing any of these users list ids will not match.
 * @property {string[]} excludedVerticals Requests containing any of these vertical ids will not match. Values are from the publisher-verticals.txt file in the downloadable files section.
 * @property {string[]} geoCriteriaIds Requests containing any of these geo criteria ids will match.
 * @property {boolean} isActive Whether this config is active. Required for all requests.
 * @property {string} kind The kind of the resource, i.e. &quot;adexchangebuyer#pretargetingConfig&quot;.
 * @property {string[]} languages Request containing any of these language codes will match.
 * @property {integer} minimumViewabilityDecile Requests where the predicted viewability is below the specified decile will not match. E.g. if the buyer sets this value to 5, requests from slots where the predicted viewability is below 50% will not match. If the predicted viewability is unknown this field will be ignored.
 * @property {string[]} mobileCarriers Requests containing any of these mobile carrier ids will match. Values are from mobile-carriers.csv in the downloadable files section.
 * @property {string[]} mobileDevices Requests containing any of these mobile device ids will match. Values are from mobile-devices.csv in the downloadable files section.
 * @property {string[]} mobileOperatingSystemVersions Requests containing any of these mobile operating system version ids will match. Values are from mobile-os.csv in the downloadable files section.
 * @property {object[]} placements Requests containing any of these placements will match.
 * @property {string[]} platforms Requests matching any of these platforms will match. Possible values are PRETARGETING_PLATFORM_MOBILE, PRETARGETING_PLATFORM_DESKTOP, and PRETARGETING_PLATFORM_TABLET.
 * @property {string[]} supportedCreativeAttributes Creative attributes should be declared here if all creatives corresponding to this pretargeting configuration have that creative attribute. Values are from pretargetable-creative-attributes.txt in the downloadable files section.
 * @property {string[]} userIdentifierDataRequired Requests containing the specified type of user data will match. Possible values are HOSTED_MATCH_DATA, which means the request is cookie-targetable and has a match in the buyer&#39;s hosted match table, and COOKIE_OR_IDFA, which means the request has either a targetable cookie or an iOS IDFA.
 * @property {string[]} userLists Requests containing any of these user list ids will match.
 * @property {string[]} vendorTypes Requests that allow any of these vendor ids will match. Values are from vendors.txt in the downloadable files section.
 * @property {string[]} verticals Requests containing any of these vertical ids will match.
 * @property {object[]} videoPlayerSizes Video requests satisfying any of these player size constraints will match.
 */
/**
 * @typedef PretargetingConfigList
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).PretargetingConfig[]} items A list of pretargeting configs
 * @property {string} kind Resource type.
 */
/**
 * @typedef Price
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {number} amountMicros The price value in micros.
 * @property {string} currencyCode The currency code for the price.
 * @property {number} expectedCpmMicros In case of CPD deals, the expected CPM in micros.
 * @property {string} pricingType The pricing type for the deal/product.
 */
/**
 * @typedef PricePerBuyer
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} auctionTier Optional access type for this buyer.
 * @property {adexchangebuyer(v1.4).Buyer} buyer The buyer who will pay this price. If unset, all buyers can pay this price (if the advertisers match, and there&#39;s no more specific rule matching the buyer).
 * @property {adexchangebuyer(v1.4).Price} price The specified price
 */
/**
 * @typedef PrivateData
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} referenceId 
 * @property {string} referencePayload 
 */
/**
 * @typedef Product
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} creationTimeMs Creation time in ms. since epoch (readonly)
 * @property {adexchangebuyer(v1.4).ContactInformation[]} creatorContacts Optional contact information for the creator of this product. (buyer-readonly)
 * @property {adexchangebuyer(v1.4).DeliveryControl} deliveryControl The set of fields around delivery control that are interesting for a buyer to see but are non-negotiable. These are set by the publisher. This message is assigned an id of 100 since some day we would want to model this as a protobuf extension.
 * @property {string} flightEndTimeMs The proposed end time for the deal (ms since epoch) (buyer-readonly)
 * @property {string} flightStartTimeMs Inventory availability dates. (times are in ms since epoch) The granularity is generally in the order of seconds. (buyer-readonly)
 * @property {boolean} hasCreatorSignedOff If the creator has already signed off on the product, then the buyer can finalize the deal by accepting the product as is. When copying to a proposal, if any of the terms are changed, then auto_finalize is automatically set to false.
 * @property {string} inventorySource What exchange will provide this inventory (readonly, except on create).
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;adexchangebuyer#product&quot;.
 * @property {adexchangebuyer(v1.4).MarketplaceLabel[]} labels Optional List of labels for the product (optional, buyer-readonly).
 * @property {string} lastUpdateTimeMs Time of last update in ms. since epoch (readonly)
 * @property {string} legacyOfferId Optional legacy offer id if this offer is a preferred deal offer.
 * @property {string} marketplacePublisherProfileId Marketplace publisher profile Id. This Id differs from the regular publisher_profile_id in that 1. This is a new id, the old Id will be deprecated in 2017. 2. This id uniquely identifies a publisher profile by itself.
 * @property {string} name The name for this product as set by the seller. (buyer-readonly)
 * @property {string} privateAuctionId Optional private auction id if this offer is a private auction offer.
 * @property {string} productId The unique id for the product (readonly)
 * @property {string} publisherProfileId Id of the publisher profile for a given seller. A (seller.account_id, publisher_profile_id) pair uniquely identifies a publisher profile. Buyers can call the PublisherProfiles::List endpoint to get a list of publisher profiles for a given seller.
 * @property {adexchangebuyer(v1.4).PublisherProvidedForecast} publisherProvidedForecast Publisher self-provided forecast information.
 * @property {string} revisionNumber The revision number of the product. (readonly)
 * @property {adexchangebuyer(v1.4).Seller} seller Information about the seller that created this product (readonly, except on create)
 * @property {adexchangebuyer(v1.4).SharedTargeting[]} sharedTargetings Targeting that is shared between the buyer and the seller. Each targeting criteria has a specified key and for each key there is a list of inclusion value or exclusion values. (buyer-readonly)
 * @property {string} state The state of the product. (buyer-readonly)
 * @property {string} syndicationProduct The syndication product associated with the deal. (readonly, except on create)
 * @property {adexchangebuyer(v1.4).DealTerms} terms The negotiable terms of the deal (buyer-readonly)
 * @property {string} webPropertyCode The web property code for the seller. This field is meant to be copied over as is when creating deals.
 */
/**
 * @typedef Proposal
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Buyer} billedBuyer Reference to the buyer that will get billed for this proposal. (readonly)
 * @property {adexchangebuyer(v1.4).Buyer} buyer Reference to the buyer on the proposal. (readonly, except on create)
 * @property {adexchangebuyer(v1.4).ContactInformation[]} buyerContacts Optional contact information of the buyer. (seller-readonly)
 * @property {adexchangebuyer(v1.4).PrivateData} buyerPrivateData Private data for buyer. (hidden from seller).
 * @property {string[]} dbmAdvertiserIds IDs of DBM advertisers permission to this proposal.
 * @property {boolean} hasBuyerSignedOff When an proposal is in an accepted state, indicates whether the buyer has signed off. Once both sides have signed off on a deal, the proposal can be finalized by the seller. (seller-readonly)
 * @property {boolean} hasSellerSignedOff When an proposal is in an accepted state, indicates whether the buyer has signed off Once both sides have signed off on a deal, the proposal can be finalized by the seller. (buyer-readonly)
 * @property {string} inventorySource What exchange will provide this inventory (readonly, except on create).
 * @property {boolean} isRenegotiating True if the proposal is being renegotiated (readonly).
 * @property {boolean} isSetupComplete True, if the buyside inventory setup is complete for this proposal. (readonly, except via OrderSetupCompleted action)
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;adexchangebuyer#proposal&quot;.
 * @property {adexchangebuyer(v1.4).MarketplaceLabel[]} labels List of labels associated with the proposal. (readonly)
 * @property {string} lastUpdaterOrCommentorRole The role of the last user that either updated the proposal or left a comment. (readonly)
 * @property {string} name The name for the proposal (updatable)
 * @property {string} negotiationId Optional negotiation id if this proposal is a preferred deal proposal.
 * @property {string} originatorRole Indicates whether the buyer/seller created the proposal.(readonly)
 * @property {string} privateAuctionId Optional private auction id if this proposal is a private auction proposal.
 * @property {string} proposalId The unique id of the proposal. (readonly).
 * @property {string} proposalState The current state of the proposal. (readonly)
 * @property {string} revisionNumber The revision number for the proposal (readonly).
 * @property {string} revisionTimeMs The time (ms since epoch) when the proposal was last revised (readonly).
 * @property {adexchangebuyer(v1.4).Seller} seller Reference to the seller on the proposal. (readonly, except on create)
 * @property {adexchangebuyer(v1.4).ContactInformation[]} sellerContacts Optional contact information of the seller (buyer-readonly).
 */
/**
 * @typedef PublisherProfileApiProto
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} accountId The account id of the seller.
 * @property {string} audience Publisher provided info on its audience.
 * @property {string} buyerPitchStatement A pitch statement for the buyer
 * @property {string} directContact Direct contact for the publisher profile.
 * @property {string} exchange Exchange where this publisher profile is from. E.g. AdX, Rubicon etc...
 * @property {string} googlePlusLink Link to publisher&#39;s Google+ page.
 * @property {boolean} isParent True, if this is the parent profile, which represents all domains owned by the publisher.
 * @property {boolean} isPublished True, if this profile is published. Deprecated for state.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;adexchangebuyer#publisherProfileApiProto&quot;.
 * @property {string} logoUrl The url to the logo for the publisher.
 * @property {string} mediaKitLink The url for additional marketing and sales materials.
 * @property {string} name 
 * @property {string} overview Publisher provided overview.
 * @property {integer} profileId The pair of (seller.account_id, profile_id) uniquely identifies a publisher profile for a given publisher.
 * @property {string} programmaticContact Programmatic contact for the publisher profile.
 * @property {string[]} publisherDomains The list of domains represented in this publisher profile. Empty if this is a parent profile.
 * @property {string} publisherProfileId Unique Id for publisher profile.
 * @property {adexchangebuyer(v1.4).PublisherProvidedForecast} publisherProvidedForecast Publisher provided forecasting information.
 * @property {string} rateCardInfoLink Link to publisher rate card
 * @property {string} samplePageLink Link for a sample content page.
 * @property {adexchangebuyer(v1.4).Seller} seller Seller of the publisher profile.
 * @property {string} state State of the publisher profile.
 * @property {string[]} topHeadlines Publisher provided key metrics and rankings.
 */
/**
 * @typedef PublisherProvidedForecast
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).Dimension[]} dimensions Publisher provided dimensions. E.g. geo, sizes etc...
 * @property {string} weeklyImpressions Publisher provided weekly impressions.
 * @property {string} weeklyUniques Publisher provided weekly uniques.
 */
/**
 * @typedef Seller
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} accountId The unique id for the seller. The seller fills in this field. The seller account id is then available to buyer in the product.
 * @property {string} subAccountId Optional sub-account id for the seller.
 */
/**
 * @typedef SharedTargeting
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).TargetingValue[]} exclusions The list of values to exclude from targeting. Each value is AND&#39;d together.
 * @property {adexchangebuyer(v1.4).TargetingValue[]} inclusions The list of value to include as part of the targeting. Each value is OR&#39;d together.
 * @property {string} key The key representing the shared targeting criterion.
 */
/**
 * @typedef TargetingValue
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).TargetingValueCreativeSize} creativeSizeValue The creative size value to exclude/include.
 * @property {adexchangebuyer(v1.4).TargetingValueDayPartTargeting} dayPartTargetingValue The daypart targeting to include / exclude. Filled in when the key is GOOG_DAYPART_TARGETING.
 * @property {string} longValue The long value to exclude/include.
 * @property {string} stringValue The string value to exclude/include.
 */
/**
 * @typedef TargetingValueCreativeSize
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).TargetingValueSize[]} companionSizes For video size type, the list of companion sizes.
 * @property {string} creativeSizeType The Creative size type.
 * @property {adexchangebuyer(v1.4).TargetingValueSize} size For regular or video creative size type, specifies the size of the creative.
 * @property {string} skippableAdType The skippable ad type for video size.
 */
/**
 * @typedef TargetingValueDayPartTargeting
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {adexchangebuyer(v1.4).TargetingValueDayPartTargetingDayPart[]} dayParts 
 * @property {string} timeZoneType 
 */
/**
 * @typedef TargetingValueDayPartTargetingDayPart
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} dayOfWeek 
 * @property {integer} endHour 
 * @property {integer} endMinute 
 * @property {integer} startHour 
 * @property {integer} startMinute 
 */
/**
 * @typedef TargetingValueSize
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {integer} height The height of the creative.
 * @property {integer} width The width of the creative.
 */
/**
 * @typedef UpdatePrivateAuctionProposalRequest
 * @memberOf! adexchangebuyer(v1.4)
 * @type object
 * @property {string} externalDealId The externalDealId of the deal to be updated.
 * @property {adexchangebuyer(v1.4).MarketplaceNote} note Optional note to be added.
 * @property {string} proposalRevisionNumber The current revision number of the proposal to be updated.
 * @property {string} updateAction The proposed action on the private auction proposal.
 */
module.exports = Adexchangebuyer;
