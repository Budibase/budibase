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
 * var adexchangebuyer = google.adexchangebuyer('v1.3');
 *
 * @namespace adexchangebuyer
 * @type {Function}
 * @version v1.3
 * @variation v1.3
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/accounts/{id}',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/accounts',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.3).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/accounts/{id}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.id The account id
     * @param {adexchangebuyer(v1.3).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/accounts/{id}',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/billinginfo/{accountId}',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/billinginfo',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/billinginfo/{accountId}/{billingId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id associated with the budget being updated.
     * @param {string} params.billingId The billing id associated with the budget being updated.
     * @param {adexchangebuyer(v1.3).Budget} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/billinginfo/{accountId}/{billingId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id associated with the budget being updated.
     * @param {string} params.billingId The billing id associated with the budget being updated.
     * @param {adexchangebuyer(v1.3).Budget} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/billinginfo/{accountId}/{billingId}',
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
     * adexchangebuyer.creatives.get
     *
     * @desc Gets the status for a single creative. A creative will be available 30-40 minutes after submission.
     *
     * @alias adexchangebuyer.creatives.get
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/creatives/{accountId}/{buyerCreativeId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {adexchangebuyer(v1.3).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/creatives',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.accountId When specified, only creatives for the given account ids are returned.
     * @param {string=} params.buyerCreativeId When specified, only creatives for the given buyer creative ids are returned.
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/creatives',
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

  self.directDeals = {

    /**
     * adexchangebuyer.directDeals.get
     *
     * @desc Gets one direct deal by ID.
     *
     * @alias adexchangebuyer.directDeals.get
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The direct deal id
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/directdeals/{id}',
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
     * adexchangebuyer.directDeals.list
     *
     * @desc Retrieves the authenticated user's list of direct deals.
     *
     * @alias adexchangebuyer.directDeals.list
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/directdeals',
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

  self.performanceReport = {

    /**
     * adexchangebuyer.performanceReport.list
     *
     * @desc Retrieves the authenticated user's list of performance metrics.
     *
     * @alias adexchangebuyer.performanceReport.list
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/performancereport',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}/{configId}',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}/{configId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to insert the pretargeting config for.
     * @param {adexchangebuyer(v1.3).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}',
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
     * @memberOf! adexchangebuyer(v1.3)
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to update the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to update.
     * @param {adexchangebuyer(v1.3).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}/{configId}',
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
     * @memberOf! adexchangebuyer(v1.3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The account id to update the pretargeting config for.
     * @param {string} params.configId The specific id of the configuration to update.
     * @param {adexchangebuyer(v1.3).PretargetingConfig} params.resource Request body data
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
          url: 'https://www.googleapis.com/adexchangebuyer/v1.3/pretargetingconfigs/{accountId}/{configId}',
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
}

/**
 * @typedef Account
 * @memberOf! adexchangebuyer(v1.3)
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
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {adexchangebuyer(v1.3).Account[]} items A list of accounts.
 * @property {string} kind Resource type.
 */
/**
 * @typedef BillingInfo
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {integer} accountId Account id.
 * @property {string} accountName Account name.
 * @property {string[]} billingId A list of adgroup IDs associated with this particular account. These IDs may show up as part of a realtime bidding BidRequest, which indicates a bid request for this account.
 * @property {string} kind Resource type.
 */
/**
 * @typedef BillingInfoList
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {adexchangebuyer(v1.3).BillingInfo[]} items A list of billing info relevant for your account.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Budget
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {string} accountId The id of the account. This is required for get and update requests.
 * @property {string} billingId The billing id to determine which adgroup to provide budget information for. This is required for get and update requests.
 * @property {string} budgetAmount The daily budget amount in unit amount of the account currency to apply for the billingId provided. This is required for update requests.
 * @property {string} currencyCode The currency code for the buyer. This cannot be altered here.
 * @property {string} id The unique id that describes this item.
 * @property {string} kind The kind of the resource, i.e. &quot;adexchangebuyer#budget&quot;.
 */
/**
 * @typedef Creative
 * @memberOf! adexchangebuyer(v1.3)
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
 * @property {object} nativeAd If nativeAd is set, HTMLSnippet and videoURL should not be set.
 * @property {integer[]} productCategories Detected product categories, if any. Read-only. This field should not be set in requests.
 * @property {integer[]} restrictedCategories All restricted categories for the ads that may be shown from this snippet.
 * @property {integer[]} sensitiveCategories Detected sensitive categories, if any. Read-only. This field should not be set in requests.
 * @property {string} status Creative serving status. Read-only. This field should not be set in requests.
 * @property {integer[]} vendorType All vendor types for the ads that may be shown from this snippet.
 * @property {integer} version The version for this creative. Read-only. This field should not be set in requests.
 * @property {string} videoURL The URL to fetch a video ad. If set, HTMLSnippet and the nativeAd should not be set.
 * @property {integer} width Ad width.
 */
/**
 * @typedef CreativesList
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {adexchangebuyer(v1.3).Creative[]} items A list of creatives.
 * @property {string} kind Resource type.
 * @property {string} nextPageToken Continuation token used to page through creatives. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; value to this.
 */
/**
 * @typedef DirectDeal
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {integer} accountId The account id of the buyer this deal is for.
 * @property {string} advertiser The name of the advertiser this deal is for.
 * @property {boolean} allowsAlcohol Whether the publisher for this deal is eligible for alcohol ads.
 * @property {string} buyerAccountId The account id that this deal was negotiated for. It is either the buyer or the client that this deal was negotiated on behalf of.
 * @property {string} currencyCode The currency code that applies to the fixed_cpm value. If not set then assumed to be USD.
 * @property {string} dealTier The deal type such as programmatic reservation or fixed price and so on.
 * @property {string} endTime End time for when this deal stops being active. If not set then this deal is valid until manually disabled by the publisher. In seconds since the epoch.
 * @property {string} fixedCpm The fixed price for this direct deal. In cpm micros of currency according to currency_code. If set, then this deal is eligible for the fixed price tier of buying (highest priority, pay exactly the configured fixed price).
 * @property {string} id Deal id.
 * @property {string} kind Resource type.
 * @property {string} name Deal name.
 * @property {string} privateExchangeMinCpm The minimum price for this direct deal. In cpm micros of currency according to currency_code. If set, then this deal is eligible for the private exchange tier of buying (below fixed price priority, run as a second price auction).
 * @property {boolean} publisherBlocksOverriden If true, the publisher has opted to have their blocks ignored when a creative is bid with for this deal.
 * @property {string} sellerNetwork The name of the publisher offering this direct deal.
 * @property {string} startTime Start time for when this deal becomes active. If not set then this deal is active immediately upon creation. In seconds since the epoch.
 */
/**
 * @typedef DirectDealsList
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {adexchangebuyer(v1.3).DirectDeal[]} directDeals A list of direct deals relevant for your account.
 * @property {string} kind Resource type.
 */
/**
 * @typedef PerformanceReport
 * @memberOf! adexchangebuyer(v1.3)
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
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {string} kind Resource type.
 * @property {adexchangebuyer(v1.3).PerformanceReport[]} performanceReport A list of performance reports relevant for the account.
 */
/**
 * @typedef PretargetingConfig
 * @memberOf! adexchangebuyer(v1.3)
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
 * @property {string[]} mobileCarriers Requests containing any of these mobile carrier ids will match. Values are from mobile-carriers.csv in the downloadable files section.
 * @property {string[]} mobileDevices Requests containing any of these mobile device ids will match. Values are from mobile-devices.csv in the downloadable files section.
 * @property {string[]} mobileOperatingSystemVersions Requests containing any of these mobile operating system version ids will match. Values are from mobile-os.csv in the downloadable files section.
 * @property {object[]} placements Requests containing any of these placements will match.
 * @property {string[]} platforms Requests matching any of these platforms will match. Possible values are PRETARGETING_PLATFORM_MOBILE, PRETARGETING_PLATFORM_DESKTOP, and PRETARGETING_PLATFORM_TABLET.
 * @property {string[]} supportedCreativeAttributes Creative attributes should be declared here if all creatives corresponding to this pretargeting configuration have that creative attribute. Values are from pretargetable-creative-attributes.txt in the downloadable files section.
 * @property {string[]} userLists Requests containing any of these user list ids will match.
 * @property {string[]} vendorTypes Requests that allow any of these vendor ids will match. Values are from vendors.txt in the downloadable files section.
 * @property {string[]} verticals Requests containing any of these vertical ids will match.
 */
/**
 * @typedef PretargetingConfigList
 * @memberOf! adexchangebuyer(v1.3)
 * @type object
 * @property {adexchangebuyer(v1.3).PretargetingConfig[]} items A list of pretargeting configs
 * @property {string} kind Resource type.
 */
module.exports = Adexchangebuyer;
