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
 * Content API for Shopping
 *
 * Manages product items, inventory, and Merchant Center accounts for Google Shopping.
 *
 * @example
 * var google = require('googleapis');
 * var content = google.content('v2');
 *
 * @namespace content
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Content
 */
function Content(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * content.accounts.authinfo
     *
     * @desc Returns information about the authenticated user.
     *
     * @alias content.accounts.authinfo
     * @memberOf! content(v2)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    authinfo: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/accounts/authinfo',
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
     * content.accounts.custombatch
     *
     * @desc Retrieves, inserts, updates, and deletes multiple Merchant Center (sub-)accounts in a single request.
     *
     * @alias content.accounts.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).AccountsCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/accounts/batch',
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
     * content.accounts.delete
     *
     * @desc Deletes a Merchant Center sub-account. This method can only be called for multi-client accounts.
     *
     * @alias content.accounts.delete
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts/{accountId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounts.get
     *
     * @desc Retrieves a Merchant Center account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accounts.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounts.insert
     *
     * @desc Creates a Merchant Center sub-account. This method can only be called for multi-client accounts.
     *
     * @alias content.accounts.insert
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounts.list
     *
     * @desc Lists the sub-accounts in your Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.accounts.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of accounts to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounts.patch
     *
     * @desc Updates a Merchant Center account. This method can only be called for multi-client accounts. This method supports patch semantics.
     *
     * @alias content.accounts.patch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts/{accountId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounts.update
     *
     * @desc Updates a Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.accounts.update
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounts/{accountId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accountshipping = {

    /**
     * content.accountshipping.custombatch
     *
     * @desc Retrieves and updates the shipping settings of multiple accounts in a single request.
     *
     * @alias content.accountshipping.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).AccountshippingCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/accountshipping/batch',
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
     * content.accountshipping.get
     *
     * @desc Retrieves the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accountshipping.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account shipping settings.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountshipping/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accountshipping.list
     *
     * @desc Lists the shipping settings of the sub-accounts in your Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.accountshipping.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of shipping settings to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountshipping',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accountshipping.patch
     *
     * @desc Updates the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account. This method supports patch semantics.
     *
     * @alias content.accountshipping.patch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account shipping settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).AccountShipping} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountshipping/{accountId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accountshipping.update
     *
     * @desc Updates the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accountshipping.update
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account shipping settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).AccountShipping} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountshipping/{accountId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accountstatuses = {

    /**
     * content.accountstatuses.custombatch
     *
     * 
     *
     * @alias content.accountstatuses.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {content(v2).AccountstatusesCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/accountstatuses/batch',
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
     * content.accountstatuses.get
     *
     * @desc Retrieves the status of a Merchant Center account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accountstatuses.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountstatuses/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accountstatuses.list
     *
     * @desc Lists the statuses of the sub-accounts in your Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.accountstatuses.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of account statuses to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accountstatuses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accounttax = {

    /**
     * content.accounttax.custombatch
     *
     * @desc Retrieves and updates tax settings of multiple accounts in a single request.
     *
     * @alias content.accounttax.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).AccounttaxCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/accounttax/batch',
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
     * content.accounttax.get
     *
     * @desc Retrieves the tax settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accounttax.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account tax settings.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounttax/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounttax.list
     *
     * @desc Lists the tax settings of the sub-accounts in your Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.accounttax.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of tax settings to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounttax',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounttax.patch
     *
     * @desc Updates the tax settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account. This method supports patch semantics.
     *
     * @alias content.accounttax.patch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account tax settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).AccountTax} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounttax/{accountId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.accounttax.update
     *
     * @desc Updates the tax settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.accounttax.update
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update account tax settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).AccountTax} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/accounttax/{accountId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.datafeeds = {

    /**
     * content.datafeeds.custombatch
     *
     * 
     *
     * @alias content.datafeeds.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).DatafeedsCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/datafeeds/batch',
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
     * content.datafeeds.delete
     *
     * @desc Deletes a datafeed from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeeds.delete
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datafeedId 
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId 
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds/{datafeedId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'datafeedId'],
        pathParams: ['datafeedId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeeds.get
     *
     * @desc Retrieves a datafeed from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeeds.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datafeedId 
     * @param {string} params.merchantId 
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds/{datafeedId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'datafeedId'],
        pathParams: ['datafeedId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeeds.insert
     *
     * @desc Registers a datafeed with your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeeds.insert
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId 
     * @param {content(v2).Datafeed} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeeds.list
     *
     * @desc Lists the datafeeds in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeeds.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of products to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeeds.patch
     *
     * @desc Updates a datafeed of your Merchant Center account. This method can only be called for non-multi-client accounts. This method supports patch semantics.
     *
     * @alias content.datafeeds.patch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datafeedId 
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId 
     * @param {content(v2).Datafeed} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds/{datafeedId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'datafeedId'],
        pathParams: ['datafeedId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeeds.update
     *
     * @desc Updates a datafeed of your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeeds.update
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datafeedId 
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId 
     * @param {content(v2).Datafeed} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeeds/{datafeedId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'datafeedId'],
        pathParams: ['datafeedId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.datafeedstatuses = {

    /**
     * content.datafeedstatuses.custombatch
     *
     * 
     *
     * @alias content.datafeedstatuses.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {content(v2).DatafeedstatusesCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/datafeedstatuses/batch',
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
     * content.datafeedstatuses.get
     *
     * @desc Retrieves the status of a datafeed from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeedstatuses.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datafeedId 
     * @param {string} params.merchantId 
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeedstatuses/{datafeedId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'datafeedId'],
        pathParams: ['datafeedId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.datafeedstatuses.list
     *
     * @desc Lists the statuses of the datafeeds in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.datafeedstatuses.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of products to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/datafeedstatuses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.inventory = {

    /**
     * content.inventory.custombatch
     *
     * @desc Updates price and availability for multiple products or stores in a single request. This operation does not update the expiration date of the products. This method can only be called for non-multi-client accounts.
     *
     * @alias content.inventory.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).InventoryCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/inventory/batch',
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
     * content.inventory.set
     *
     * @desc Updates price and availability of a product in your Merchant Center account. This operation does not update the expiration date of the product. This method can only be called for non-multi-client accounts.
     *
     * @alias content.inventory.set
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.productId The ID of the product for which to update price and availability.
     * @param {string} params.storeCode The code of the store for which to update price and availability. Use online to update price and availability of an online product.
     * @param {content(v2).InventorySetRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    set: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/inventory/{storeCode}/products/{productId}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'storeCode', 'productId'],
        pathParams: ['merchantId', 'productId', 'storeCode'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.orders = {

    /**
     * content.orders.acknowledge
     *
     * @desc Marks an order as acknowledged. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.acknowledge
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersAcknowledgeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    acknowledge: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/acknowledge',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.advancetestorder
     *
     * @desc Sandbox only. Moves a test order from state "inProgress" to state "pendingShipment". This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.advancetestorder
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the test order to modify.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    advancetestorder: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/testorders/{orderId}/advance',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.cancel
     *
     * @desc Cancels all line items in an order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.cancel
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order to cancel.
     * @param {content(v2).OrdersCancelRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancel: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.cancellineitem
     *
     * @desc Cancels a line item. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.cancellineitem
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersCancelLineItemRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancellineitem: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/cancelLineItem',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.createtestorder
     *
     * @desc Sandbox only. Creates a test order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.createtestorder
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).OrdersCreateTestOrderRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createtestorder: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/testorders',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.custombatch
     *
     * @desc Retrieves or modifies multiple orders in a single request. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {content(v2).OrdersCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/orders/batch',
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
     * content.orders.get
     *
     * @desc Retrieves an order from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.getbymerchantorderid
     *
     * @desc Retrieves an order using merchant order id. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.getbymerchantorderid
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.merchantOrderId The merchant order id to be looked for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getbymerchantorderid: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/ordersbymerchantid/{merchantOrderId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'merchantOrderId'],
        pathParams: ['merchantId', 'merchantOrderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.gettestordertemplate
     *
     * @desc Sandbox only. Retrieves an order template that can be used to quickly create a new order in sandbox. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.gettestordertemplate
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.templateName The name of the template to retrieve.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    gettestordertemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/testordertemplates/{templateName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'templateName'],
        pathParams: ['merchantId', 'templateName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.list
     *
     * @desc Lists the orders in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledged Obtains orders that match the acknowledgement status. When set to true, obtains orders that have been acknowledged. When false, obtains orders that have not been acknowledged. We recommend using this filter set to false, in conjunction with the acknowledge call, such that only un-acknowledged orders are returned.
     * @param {integer=} params.maxResults The maximum number of orders to return in the response, used for paging. The default value is 25 orders per page, and the maximum allowed value is 250 orders per page. Known issue: All List calls will return all Orders without limit regardless of the value of this field.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.orderBy The ordering of the returned list. The only supported value are placedDate desc and placedDate asc for now, which returns orders sorted by placement date. "placedDate desc" stands for listing orders by placement date, from oldest to most recent. "placedDate asc" stands for listing orders by placement date, from most recent to oldest. In future releases we'll support other sorting criteria.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string=} params.placedDateEnd Obtains orders placed before this date (exclusively), in ISO 8601 format.
     * @param {string=} params.placedDateStart Obtains orders placed after this date (inclusively), in ISO 8601 format.
     * @param {string=} params.statuses Obtains orders that match any of the specified statuses. Multiple values can be specified with comma separation. Additionally, please note that active is a shortcut for pendingShipment and partiallyShipped, and completed is a shortcut for shipped , partiallyDelivered, delivered, partiallyReturned, returned, and canceled.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.refund
     *
     * @desc Refund a portion of the order, up to the full amount paid. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.refund
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order to refund.
     * @param {content(v2).OrdersRefundRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    refund: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/refund',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.returnlineitem
     *
     * @desc Returns a line item. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.returnlineitem
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersReturnLineItemRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    returnlineitem: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/returnLineItem',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.shiplineitems
     *
     * @desc Marks line item(s) as shipped. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.shiplineitems
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersShipLineItemsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    shiplineitems: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/shipLineItems',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.updatemerchantorderid
     *
     * @desc Updates the merchant order ID for a given order. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.updatemerchantorderid
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersUpdateMerchantOrderIdRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updatemerchantorderid: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/updateMerchantOrderId',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.orders.updateshipment
     *
     * @desc Updates a shipment's status, carrier, and/or tracking ID. This method can only be called for non-multi-client accounts.
     *
     * @alias content.orders.updateshipment
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.orderId The ID of the order.
     * @param {content(v2).OrdersUpdateShipmentRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateshipment: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/orders/{orderId}/updateShipment',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'orderId'],
        pathParams: ['merchantId', 'orderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.products = {

    /**
     * content.products.custombatch
     *
     * @desc Retrieves, inserts, and deletes multiple products in a single request. This method can only be called for non-multi-client accounts.
     *
     * @alias content.products.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).ProductsCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/products/batch',
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
     * content.products.delete
     *
     * @desc Deletes a product from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.products.delete
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.productId The ID of the product.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/products/{productId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'productId'],
        pathParams: ['merchantId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.products.get
     *
     * @desc Retrieves a product from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.products.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.productId The ID of the product.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/products/{productId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'productId'],
        pathParams: ['merchantId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.products.insert
     *
     * @desc Uploads a product to your Merchant Center account. If an item with the same channel, contentLanguage, offerId, and targetCountry already exists, this method updates that entry. This method can only be called for non-multi-client accounts.
     *
     * @alias content.products.insert
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).Product} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/products',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.products.list
     *
     * @desc Lists the products in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.products.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.includeInvalidInsertedItems Flag to include the invalid inserted items in the result of the list request. By default the invalid items are not shown (the default value is false).
     * @param {integer=} params.maxResults The maximum number of products to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/products',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.productstatuses = {

    /**
     * content.productstatuses.custombatch
     *
     * @desc Gets the statuses of multiple products in a single request. This method can only be called for non-multi-client accounts.
     *
     * @alias content.productstatuses.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {content(v2).ProductstatusesCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/productstatuses/batch',
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
     * content.productstatuses.get
     *
     * @desc Gets the status of a product from your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.productstatuses.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string} params.productId The ID of the product.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/productstatuses/{productId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'productId'],
        pathParams: ['merchantId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.productstatuses.list
     *
     * @desc Lists the statuses of the products in your Merchant Center account. This method can only be called for non-multi-client accounts.
     *
     * @alias content.productstatuses.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.includeInvalidInsertedItems Flag to include the invalid inserted items in the result of the list request. By default the invalid items are not shown (the default value is false).
     * @param {integer=} params.maxResults The maximum number of product statuses to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/productstatuses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.shippingsettings = {

    /**
     * content.shippingsettings.custombatch
     *
     * @desc Retrieves and updates the shipping settings of multiple accounts in a single request.
     *
     * @alias content.shippingsettings.custombatch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {content(v2).ShippingsettingsCustomBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    custombatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/shippingsettings/batch',
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
     * content.shippingsettings.get
     *
     * @desc Retrieves the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.shippingsettings.get
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update shipping settings.
     * @param {string} params.merchantId The ID of the managing account.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/shippingsettings/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.shippingsettings.getsupportedcarriers
     *
     * @desc Retrieves supported carriers and carrier services for an account.
     *
     * @alias content.shippingsettings.getsupportedcarriers
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.merchantId The ID of the account for which to retrieve the supported carriers.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getsupportedcarriers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/content/v2/{merchantId}/supportedCarriers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.shippingsettings.list
     *
     * @desc Lists the shipping settings of the sub-accounts in your Merchant Center account. This method can only be called for multi-client accounts.
     *
     * @alias content.shippingsettings.list
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of shipping settings to return in the response, used for paging.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/shippingsettings',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['merchantId'],
        pathParams: ['merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.shippingsettings.patch
     *
     * @desc Updates the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account. This method supports patch semantics.
     *
     * @alias content.shippingsettings.patch
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update shipping settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).ShippingSettings} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/shippingsettings/{accountId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * content.shippingsettings.update
     *
     * @desc Updates the shipping settings of the account. This method can only be called for accounts to which the managing account has access: either the managing account itself or sub-accounts if the managing account is a multi-client account.
     *
     * @alias content.shippingsettings.update
     * @memberOf! content(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The ID of the account for which to get/update shipping settings.
     * @param {boolean=} params.dryRun Flag to run the request in dry-run mode.
     * @param {string} params.merchantId The ID of the managing account.
     * @param {content(v2).ShippingSettings} params.resource Request body data
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
          url: 'https://www.googleapis.com/content/v2/{merchantId}/shippingsettings/{accountId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['merchantId', 'accountId'],
        pathParams: ['accountId', 'merchantId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Account
 * @memberOf! content(v2)
 * @type object
 * @property {boolean} adultContent Indicates whether the merchant sells adult content.
 * @property {content(v2).AccountAdwordsLink[]} adwordsLinks List of linked AdWords accounts, active or pending approval. To create a new link request, add a new link with status active to the list. It will remain is state pending until approved or rejected in the AdWords interface. To delete an active link or to cancel a link request, remove it from the list.
 * @property {string} id Merchant Center account ID.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#account&quot;.
 * @property {string} name Display name for the account.
 * @property {string} reviewsUrl URL for individual seller reviews, i.e., reviews for each child account.
 * @property {string} sellerId Client-specific, locally-unique, internal ID for the child account.
 * @property {content(v2).AccountUser[]} users Users with access to the account. Every account (except for subaccounts) must have at least one admin user.
 * @property {string} websiteUrl The merchant&#39;s website.
 */
/**
 * @typedef AccountAdwordsLink
 * @memberOf! content(v2)
 * @type object
 * @property {string} adwordsId Customer ID of the AdWords account.
 * @property {string} status Status of the link between this Merchant Center account and the AdWords account. Upon retrieval, it represents the actual status of the link and can be either active if it was approved in Google AdWords or pending if it&#39;s pending approval. Upon insertion, it represents the intended status of the link. Re-uploading a link with status active when it&#39;s still pending or with status pending when it&#39;s already active will have no effect: the status will remain unchanged. Re-uploading a link with deprecated status inactive is equivalent to not submitting the link at all and will delete the link if it was active or cancel the link request if it was pending.
 */
/**
 * @typedef AccountIdentifier
 * @memberOf! content(v2)
 * @type object
 * @property {string} aggregatorId The aggregator ID, set for aggregators and subaccounts (in that case, it represents the aggregator of the subaccount).
 * @property {string} merchantId The merchant account ID, set for individual accounts and subaccounts.
 */
/**
 * @typedef AccountShipping
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account to which these account shipping settings belong.
 * @property {content(v2).AccountShippingCarrierRate[]} carrierRates Carrier-based shipping calculations.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountShipping&quot;.
 * @property {content(v2).AccountShippingLocationGroup[]} locationGroups Location groups for shipping.
 * @property {content(v2).AccountShippingRateTable[]} rateTables Rate tables definitions.
 * @property {content(v2).AccountShippingShippingService[]} services Shipping services describing shipping fees calculation.
 */
/**
 * @typedef AccountShippingCarrierRate
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier that is responsible for the shipping, such as &quot;UPS&quot;, &quot;FedEx&quot;, or &quot;USPS&quot;.
 * @property {string} carrierService The carrier service, such as &quot;Ground&quot; or &quot;2Day&quot;.
 * @property {content(v2).Price} modifierFlatRate Additive shipping rate modifier.
 * @property {string} modifierPercent Multiplicative shipping rate modifier in percent. Represented as a floating point number without the percentage character.
 * @property {string} name The name of the carrier rate.
 * @property {string} saleCountry The sale country for which this carrier rate is valid, represented as a CLDR territory code.
 * @property {string} shippingOrigin Shipping origin represented as a postal code.
 */
/**
 * @typedef AccountShippingCondition
 * @memberOf! content(v2)
 * @type object
 * @property {string} deliveryLocationGroup Delivery location in terms of a location group name. A location group with this name must be specified among location groups.
 * @property {string} deliveryLocationId Delivery location in terms of a location ID. Can be used to represent administrative areas, smaller country subdivisions, or cities.
 * @property {string} deliveryPostalCode Delivery location in terms of a postal code.
 * @property {content(v2).AccountShippingPostalCodeRange} deliveryPostalCodeRange Delivery location in terms of a postal code range.
 * @property {content(v2).Price} priceMax Maximum shipping price. Forms an interval between the maximum of smaller prices (exclusive) and this price (inclusive).
 * @property {string} shippingLabel Shipping label of the product. The products with the label are matched.
 * @property {content(v2).Weight} weightMax Maximum shipping weight. Forms an interval between the maximum of smaller weight (exclusive) and this weight (inclusive).
 */
/**
 * @typedef AccountShippingLocationGroup
 * @memberOf! content(v2)
 * @type object
* @property {string} country The CLDR territory code of the country in which this location group is.
* @property {string[]} locationIds A location ID (also called criteria ID) representing administrative areas, smaller country subdivisions (counties), or cities.
* @property {string} name The name of the location group.
* @property {content(v2).AccountShippingPostalCodeRange[]} postalCodeRanges A postal code range representing a city or a set of cities.
* @property {string[]} postalCodes A postal code representing a city or a set of cities.  
- A single postal code (e.g., 12345)
- A postal code prefix followed by a star (e.g., 1234*)
*/
/**
 * @typedef AccountShippingPostalCodeRange
 * @memberOf! content(v2)
 * @type object
 * @property {string} end The last (inclusive) postal code or prefix of the range.
 * @property {string} start The first (inclusive) postal code or prefix of the range.
 */
/**
 * @typedef AccountShippingRateTable
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountShippingRateTableCell[]} content One-dimensional table cells define one condition along the same dimension. Bi-dimensional table cells use two dimensions with respectively M and N distinct values and must contain exactly M * N cells with distinct conditions (for each possible value pairs).
 * @property {string} name The name of the rate table.
 * @property {string} saleCountry The sale country for which this table is valid, represented as a CLDR territory code.
 */
/**
 * @typedef AccountShippingRateTableCell
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountShippingCondition} condition Conditions for which the cell is valid. All cells in a table must use the same dimension or pair of dimensions among price, weight, shipping label or delivery location. If no condition is specified, the cell acts as a catch-all and matches all the elements that are not matched by other cells in this dimension.
 * @property {content(v2).Price} rate The rate applicable if the cell conditions are matched.
 */
/**
 * @typedef AccountShippingShippingService
 * @memberOf! content(v2)
 * @type object
 * @property {boolean} active Whether the shipping service is available.
 * @property {content(v2).AccountShippingShippingServiceCalculationMethod} calculationMethod Calculation method for the &quot;simple&quot; case that needs no rules.
 * @property {content(v2).AccountShippingShippingServiceCostRule} costRuleTree Decision tree for &quot;complicated&quot; shipping cost calculation.
 * @property {string} maxDaysInTransit The maximum number of days in transit. Must be a value between 0 and 250 included. A value of 0 means same day delivery.
 * @property {string} minDaysInTransit The minimum number of days in transit. Must be a value between 0 and maxDaysIntransit included. A value of 0 means same day delivery.
 * @property {string} name The name of this shipping service.
 * @property {string} saleCountry The CLDR territory code of the sale country for which this service can be used.
 */
/**
 * @typedef AccountShippingShippingServiceCalculationMethod
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrierRate Name of the carrier rate to use for the calculation.
 * @property {boolean} excluded Delivery is excluded. Valid only within cost rules tree.
 * @property {content(v2).Price} flatRate Fixed price shipping, represented as a floating point number associated with a currency.
 * @property {string} percentageRate Percentage of the price, represented as a floating point number without the percentage character.
 * @property {string} rateTable Name of the rate table to use for the calculation.
 */
/**
 * @typedef AccountShippingShippingServiceCostRule
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountShippingShippingServiceCalculationMethod} calculationMethod Final calculation method to be used only in leaf nodes.
 * @property {content(v2).AccountShippingShippingServiceCostRule[]} children Subsequent rules to be applied, only for inner nodes. The last child must not specify a condition and acts as a catch-all.
 * @property {content(v2).AccountShippingCondition} condition Condition for this rule to be applicable. If no condition is specified, the rule acts as a catch-all.
 */
/**
 * @typedef AccountStatus
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account for which the status is reported.
 * @property {content(v2).AccountStatusDataQualityIssue[]} dataQualityIssues A list of data quality issues.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountStatus&quot;.
 */
/**
 * @typedef AccountStatusDataQualityIssue
 * @memberOf! content(v2)
 * @type object
 * @property {string} country Country for which this issue is reported.
 * @property {string} displayedValue Actual value displayed on the landing page.
 * @property {content(v2).AccountStatusExampleItem[]} exampleItems Example items featuring the issue.
 * @property {string} id Issue identifier.
 * @property {string} lastChecked Last time the account was checked for this issue.
 * @property {integer} numItems Number of items in the account found to have the said issue.
 * @property {string} severity Severity of the problem.
 * @property {string} submittedValue Submitted value that causes the issue.
 */
/**
 * @typedef AccountStatusExampleItem
 * @memberOf! content(v2)
 * @type object
 * @property {string} itemId Unique item ID as specified in the uploaded product data.
 * @property {string} link Landing page of the item.
 * @property {string} submittedValue The item value that was submitted.
 * @property {string} title Title of the item.
 * @property {string} valueOnLandingPage The actual value on the landing page.
 */
/**
 * @typedef AccountTax
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account to which these account tax settings belong.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountTax&quot;.
 * @property {content(v2).AccountTaxTaxRule[]} rules Tax rules. Updating the tax rules will enable US taxes (not reversible). Defining no rules is equivalent to not charging tax at all.
 */
/**
 * @typedef AccountTaxTaxRule
 * @memberOf! content(v2)
 * @type object
 * @property {string} country Country code in which tax is applicable.
 * @property {string} locationId State (or province) is which the tax is applicable, described by its location id (also called criteria id).
 * @property {string} ratePercent Explicit tax rate in percent, represented as a floating point number without the percentage character. Must not be negative.
 * @property {boolean} shippingTaxed If true, shipping charges are also taxed.
 * @property {boolean} useGlobalRate Whether the tax rate is taken from a global tax table or specified explicitly.
 */
/**
 * @typedef AccountUser
 * @memberOf! content(v2)
 * @type object
 * @property {boolean} admin Whether user is an admin.
 * @property {string} emailAddress User&#39;s email address.
 */
/**
 * @typedef AccountsAuthInfoResponse
 * @memberOf! content(v2)
 * @type object
* @property {content(v2).AccountIdentifier[]} accountIdentifiers The account identifiers corresponding to the authenticated user.
- For an individual account: only the merchant ID is defined
- For an aggregator: only the aggregator ID is defined
- For a subaccount of an MCA: both the merchant ID and the aggregator ID are defined.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountsAuthInfoResponse&quot;.
*/
/**
 * @typedef AccountsCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountsCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef AccountsCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Account} account The account to create or update. Only defined if the method is insert or update.
 * @property {string} accountId The ID of the account to get or delete. Only defined if the method is get or delete.
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 */
/**
 * @typedef AccountsCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountsCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountsCustomBatchResponse&quot;.
 */
/**
 * @typedef AccountsCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Account} account The retrieved, created, or updated account. Not defined if the method was delete.
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountsCustomBatchResponseEntry&quot;.
 */
/**
 * @typedef AccountsListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountsListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of accounts.
 * @property {content(v2).Account[]} resources 
 */
/**
 * @typedef AccountshippingCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountshippingCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef AccountshippingCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account for which to get/update account shipping settings.
 * @property {content(v2).AccountShipping} accountShipping The account shipping settings to update. Only defined if the method is update.
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 */
/**
 * @typedef AccountshippingCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountshippingCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountshippingCustomBatchResponse&quot;.
 */
/**
 * @typedef AccountshippingCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountShipping} accountShipping The retrieved or updated account shipping settings.
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountshippingCustomBatchResponseEntry&quot;.
 */
/**
 * @typedef AccountshippingListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountshippingListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of account shipping settings.
 * @property {content(v2).AccountShipping[]} resources 
 */
/**
 * @typedef AccountstatusesCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountstatusesCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef AccountstatusesCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the (sub-)account whose status to get.
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method The method (get).
 */
/**
 * @typedef AccountstatusesCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountstatusesCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountstatusesCustomBatchResponse&quot;.
 */
/**
 * @typedef AccountstatusesCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountStatus} accountStatus The requested account status. Defined if and only if the request was successful.
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 */
/**
 * @typedef AccountstatusesListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accountstatusesListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of account statuses.
 * @property {content(v2).AccountStatus[]} resources 
 */
/**
 * @typedef AccounttaxCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccounttaxCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef AccounttaxCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account for which to get/update account tax settings.
 * @property {content(v2).AccountTax} accountTax The account tax settings to update. Only defined if the method is update.
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 */
/**
 * @typedef AccounttaxCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccounttaxCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accounttaxCustomBatchResponse&quot;.
 */
/**
 * @typedef AccounttaxCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).AccountTax} accountTax The retrieved or updated account tax settings.
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accounttaxCustomBatchResponseEntry&quot;.
 */
/**
 * @typedef AccounttaxListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#accounttaxListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of account tax settings.
 * @property {content(v2).AccountTax[]} resources 
 */
/**
 * @typedef CarrierRate
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrierName Carrier service, such as &quot;UPS&quot; or &quot;Fedex&quot;. The list of supported carriers can be retrieved via the getSupportedCarriers method. Required.
 * @property {string} carrierService Carrier service, such as &quot;ground&quot; or &quot;2 days&quot;. The list of supported services for a carrier can be retrieved via the getSupportedCarriers method. Required.
 * @property {content(v2).Price} flatAdjustment Additive shipping rate modifier. Can be negative. For example { &quot;value&quot;: &quot;1&quot;, &quot;currency&quot; : &quot;USD&quot; } adds $1 to the rate, { &quot;value&quot;: &quot;-3&quot;, &quot;currency&quot; : &quot;USD&quot; } removes $3 from the rate. Optional.
 * @property {string} name Name of the carrier rate. Must be unique per rate group. Required.
 * @property {string} originPostalCode Shipping origin for this carrier rate. Required.
 * @property {string} percentageAdjustment Multiplicative shipping rate modifier as a number in decimal notation. Can be negative. For example &quot;5.4&quot; increases the rate by 5.4%, &quot;-3&quot; decreases the rate by 3%. Optional.
 */
/**
 * @typedef CarriersCarrier
 * @memberOf! content(v2)
 * @type object
 * @property {string} country The CLDR country code of the carrier (e.g., &quot;US&quot;). Always present.
 * @property {string} name The name of the carrier (e.g., &quot;UPS&quot;). Always present.
 * @property {string[]} services A list of supported services (e.g., &quot;ground&quot;) for that carrier. Contains at least one service.
 */
/**
 * @typedef Datafeed
 * @memberOf! content(v2)
 * @type object
 * @property {string} attributeLanguage The two-letter ISO 639-1 language in which the attributes are defined in the data feed.
 * @property {string} contentLanguage The two-letter ISO 639-1 language of the items in the feed. Must be a valid language for targetCountry.
 * @property {string} contentType The type of data feed.
 * @property {content(v2).DatafeedFetchSchedule} fetchSchedule Fetch schedule for the feed file.
 * @property {string} fileName The filename of the feed. All feeds must have a unique file name.
 * @property {content(v2).DatafeedFormat} format Format of the feed file.
 * @property {string} id The ID of the data feed.
 * @property {string[]} intendedDestinations The list of intended destinations (corresponds to checked check boxes in Merchant Center).
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeed&quot;.
 * @property {string} name A descriptive name of the data feed.
 * @property {string} targetCountry The country where the items in the feed will be included in the search index, represented as a CLDR territory code.
 */
/**
 * @typedef DatafeedFetchSchedule
 * @memberOf! content(v2)
 * @type object
 * @property {integer} dayOfMonth The day of the month the feed file should be fetched (1-31).
 * @property {string} fetchUrl The URL where the feed file can be fetched. Google Merchant Center will support automatic scheduled uploads using the HTTP, HTTPS, FTP, or SFTP protocols, so the value will need to be a valid link using one of those four protocols.
 * @property {integer} hour The hour of the day the feed file should be fetched (0-23).
 * @property {integer} minuteOfHour The minute of the hour the feed file should be fetched (0-59). Read-only.
 * @property {string} password An optional password for fetch_url.
 * @property {string} timeZone Time zone used for schedule. UTC by default. E.g., &quot;America/Los_Angeles&quot;.
 * @property {string} username An optional user name for fetch_url.
 * @property {string} weekday The day of the week the feed file should be fetched.
 */
/**
 * @typedef DatafeedFormat
 * @memberOf! content(v2)
 * @type object
 * @property {string} columnDelimiter Delimiter for the separation of values in a delimiter-separated values feed. If not specified, the delimiter will be auto-detected. Ignored for non-DSV data feeds.
 * @property {string} fileEncoding Character encoding scheme of the data feed. If not specified, the encoding will be auto-detected.
 * @property {string} quotingMode Specifies how double quotes are interpreted. If not specified, the mode will be auto-detected. Ignored for non-DSV data feeds.
 */
/**
 * @typedef DatafeedStatus
 * @memberOf! content(v2)
 * @type object
 * @property {string} datafeedId The ID of the feed for which the status is reported.
 * @property {content(v2).DatafeedStatusError[]} errors The list of errors occurring in the feed.
 * @property {string} itemsTotal The number of items in the feed that were processed.
 * @property {string} itemsValid The number of items in the feed that were valid.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeedStatus&quot;.
 * @property {string} lastUploadDate The last date at which the feed was uploaded.
 * @property {string} processingStatus The processing status of the feed.
 * @property {content(v2).DatafeedStatusError[]} warnings The list of errors occurring in the feed.
 */
/**
 * @typedef DatafeedStatusError
 * @memberOf! content(v2)
 * @type object
 * @property {string} code The code of the error, e.g., &quot;validation/invalid_value&quot;.
 * @property {string} count The number of occurrences of the error in the feed.
 * @property {content(v2).DatafeedStatusExample[]} examples A list of example occurrences of the error, grouped by product.
 * @property {string} message The error message, e.g., &quot;Invalid price&quot;.
 */
/**
 * @typedef DatafeedStatusExample
 * @memberOf! content(v2)
 * @type object
 * @property {string} itemId The ID of the example item.
 * @property {string} lineNumber Line number in the data feed where the example is found.
 * @property {string} value The problematic value.
 */
/**
 * @typedef DatafeedsCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).DatafeedsCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef DatafeedsCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {content(v2).Datafeed} datafeed The data feed to insert.
 * @property {string} datafeedId The ID of the data feed to get or delete.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 */
/**
 * @typedef DatafeedsCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).DatafeedsCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeedsCustomBatchResponse&quot;.
 */
/**
 * @typedef DatafeedsCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Datafeed} datafeed The requested data feed. Defined if and only if the request was successful.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 */
/**
 * @typedef DatafeedsListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeedsListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of datafeeds.
 * @property {content(v2).Datafeed[]} resources 
 */
/**
 * @typedef DatafeedstatusesCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).DatafeedstatusesCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef DatafeedstatusesCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} datafeedId The ID of the data feed to get or delete.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 */
/**
 * @typedef DatafeedstatusesCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).DatafeedstatusesCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeedstatusesCustomBatchResponse&quot;.
 */
/**
 * @typedef DatafeedstatusesCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).DatafeedStatus} datafeedStatus The requested data feed status. Defined if and only if the request was successful.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 */
/**
 * @typedef DatafeedstatusesListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#datafeedstatusesListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of datafeed statuses.
 * @property {content(v2).DatafeedStatus[]} resources 
 */
/**
 * @typedef DeliveryTime
 * @memberOf! content(v2)
 * @type object
 * @property {integer} maxTransitTimeInDays Maximum number of business days that is spent in transit. 0 means same day delivery, 1 means next day delivery. Must be greater than or equal to minTransitTimeInDays. Required.
 * @property {integer} minTransitTimeInDays Minimum number of business days that is spent in transit. 0 means same day delivery, 1 means next day delivery. Required.
 */
/**
 * @typedef Error
 * @memberOf! content(v2)
 * @type object
 * @property {string} domain The domain of the error.
 * @property {string} message A description of the error.
 * @property {string} reason The error code.
 */
/**
 * @typedef Errors
 * @memberOf! content(v2)
 * @type object
 * @property {integer} code The HTTP status of the first error in errors.
 * @property {content(v2).Error[]} errors A list of errors.
 * @property {string} message The message of the first error in errors.
 */
/**
 * @typedef Headers
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).LocationIdSet[]} locations A list of location ID sets. Must be non-empty. Can only be set if all other fields are not set.
 * @property {string[]} numberOfItems A list of inclusive number of items upper bounds. The last value can be &quot;infinity&quot;. For example [&quot;10&quot;, &quot;50&quot;, &quot;infinity&quot;] represents the headers &quot;&lt;= 10 items&quot;, &quot; 50 items&quot;. Must be non-empty. Can only be set if all other fields are not set.
 * @property {string[]} postalCodeGroupNames A list of postal group names. The last value can be &quot;all other locations&quot;. Example: [&quot;zone 1&quot;, &quot;zone 2&quot;, &quot;all other locations&quot;]. The referred postal code groups must match the delivery country of the service. Must be non-empty. Can only be set if all other fields are not set.
 * @property {content(v2).Price[]} prices be &quot;infinity&quot;. For example [{&quot;value&quot;: &quot;10&quot;, &quot;currency&quot;: &quot;USD&quot;}, {&quot;value&quot;: &quot;500&quot;, &quot;currency&quot;: &quot;USD&quot;}, {&quot;value&quot;: &quot;infinity&quot;, &quot;currency&quot;: &quot;USD&quot;}] represents the headers &quot;&lt;= $10&quot;, &quot; $500&quot;. All prices within a service must have the same currency. Must be non-empty. Can only be set if all other fields are not set.
 * @property {content(v2).Weight[]} weights be &quot;infinity&quot;. For example [{&quot;value&quot;: &quot;10&quot;, &quot;unit&quot;: &quot;kg&quot;}, {&quot;value&quot;: &quot;50&quot;, &quot;unit&quot;: &quot;kg&quot;}, {&quot;value&quot;: &quot;infinity&quot;, &quot;unit&quot;: &quot;kg&quot;}] represents the headers &quot;&lt;= 10kg&quot;, &quot; 50kg&quot;. All weights within a service must have the same unit. Must be non-empty. Can only be set if all other fields are not set.
 */
/**
 * @typedef Installment
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} amount The amount the buyer has to pay per month.
 * @property {string} months The number of installments the buyer has to pay.
 */
/**
 * @typedef Inventory
 * @memberOf! content(v2)
 * @type object
 * @property {string} availability The availability of the product.
 * @property {content(v2).Installment} installment Number and amount of installments to pay for an item. Brazil only.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#inventory&quot;.
 * @property {content(v2).LoyaltyPoints} loyaltyPoints Loyalty points that users receive after purchasing the item. Japan only.
 * @property {content(v2).InventoryPickup} pickup Store pickup information. Only supported for local inventory. Not setting pickup means &quot;don&#39;t update&quot; while setting it to the empty value ({} in JSON) means &quot;delete&quot;. Otherwise, pickupMethod and pickupSla must be set together, unless pickupMethod is &quot;not supported&quot;.
 * @property {content(v2).Price} price The price of the product.
 * @property {integer} quantity The quantity of the product. Must be equal to or greater than zero. Supported only for local products.
 * @property {content(v2).Price} salePrice The sale price of the product. Mandatory if sale_price_effective_date is defined.
 * @property {string} salePriceEffectiveDate A date range represented by a pair of ISO 8601 dates separated by a space, comma, or slash. Both dates might be specified as &#39;null&#39; if undecided.
 * @property {integer} sellOnGoogleQuantity The quantity of the product that is reserved for sell-on-google ads. Supported only for online products.
 */
/**
 * @typedef InventoryCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).InventoryCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef InventoryCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {content(v2).Inventory} inventory Price and availability of the product.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} productId The ID of the product for which to update price and availability.
 * @property {string} storeCode The code of the store for which to update price and availability. Use online to update price and availability of an online product.
 */
/**
 * @typedef InventoryCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).InventoryCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#inventoryCustomBatchResponse&quot;.
 */
/**
 * @typedef InventoryCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#inventoryCustomBatchResponseEntry&quot;.
 */
/**
 * @typedef InventoryPickup
 * @memberOf! content(v2)
 * @type object
 * @property {string} pickupMethod Whether store pickup is available for this offer and whether the pickup option should be shown as buy, reserve, or not supported. Only supported for local inventory. Unless the value is &quot;not supported&quot;, must be submitted together with pickupSla.
 * @property {string} pickupSla The expected date that an order will be ready for pickup, relative to when the order is placed. Only supported for local inventory. Must be submitted together with pickupMethod.
 */
/**
 * @typedef InventorySetRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} availability The availability of the product.
 * @property {content(v2).Installment} installment Number and amount of installments to pay for an item. Brazil only.
 * @property {content(v2).LoyaltyPoints} loyaltyPoints Loyalty points that users receive after purchasing the item. Japan only.
 * @property {content(v2).InventoryPickup} pickup Store pickup information. Only supported for local inventory. Not setting pickup means &quot;don&#39;t update&quot; while setting it to the empty value ({} in JSON) means &quot;delete&quot;. Otherwise, pickupMethod and pickupSla must be set together, unless pickupMethod is &quot;not supported&quot;.
 * @property {content(v2).Price} price The price of the product.
 * @property {integer} quantity The quantity of the product. Must be equal to or greater than zero. Supported only for local products.
 * @property {content(v2).Price} salePrice The sale price of the product. Mandatory if sale_price_effective_date is defined.
 * @property {string} salePriceEffectiveDate A date range represented by a pair of ISO 8601 dates separated by a space, comma, or slash. Both dates might be specified as &#39;null&#39; if undecided.
 * @property {integer} sellOnGoogleQuantity The quantity of the product that is reserved for sell-on-google ads. Supported only for online products.
 */
/**
 * @typedef InventorySetResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#inventorySetResponse&quot;.
 */
/**
 * @typedef LocationIdSet
 * @memberOf! content(v2)
 * @type object
 * @property {string[]} locationIds A non-empty list of location IDs. They must all be of the same location type (e.g., state).
 */
/**
 * @typedef LoyaltyPoints
 * @memberOf! content(v2)
 * @type object
 * @property {string} name Name of loyalty points program. It is recommended to limit the name to 12 full-width characters or 24 Roman characters.
 * @property {string} pointsValue The retailer&#39;s loyalty points in absolute value.
 * @property {number} ratio The ratio of a point when converted to currency. Google assumes currency based on Merchant Center settings. If ratio is left out, it defaults to 1.0.
 */
/**
 * @typedef Order
 * @memberOf! content(v2)
 * @type object
 * @property {boolean} acknowledged Whether the order was acknowledged.
 * @property {string} channelType The channel type of the order: &quot;purchaseOnGoogle&quot; or &quot;googleExpress&quot;.
 * @property {content(v2).OrderCustomer} customer The details of the customer who placed the order.
 * @property {content(v2).OrderDeliveryDetails} deliveryDetails The details for the delivery.
 * @property {string} id The REST id of the order. Globally unique.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#order&quot;.
 * @property {content(v2).OrderLineItem[]} lineItems Line items that are ordered.
 * @property {string} merchantId 
 * @property {string} merchantOrderId Merchant-provided id of the order.
 * @property {content(v2).Price} netAmount The net amount for the order. For example, if an order was originally for a grand total of $100 and a refund was issued for $20, the net amount will be $80.
 * @property {content(v2).OrderPaymentMethod} paymentMethod The details of the payment method.
 * @property {string} paymentStatus The status of the payment.
 * @property {string} placedDate The date when the order was placed, in ISO 8601 format.
 * @property {content(v2).OrderPromotion[]} promotions The details of the merchant provided promotions applied to the order. More details about the program are  here.
 * @property {content(v2).OrderRefund[]} refunds Refunds for the order.
 * @property {content(v2).OrderShipment[]} shipments Shipments of the order.
 * @property {content(v2).Price} shippingCost The total cost of shipping for all items.
 * @property {content(v2).Price} shippingCostTax The tax for the total shipping cost.
 * @property {string} shippingOption The requested shipping option.
 * @property {string} status The status of the order.
 */
/**
 * @typedef OrderAddress
 * @memberOf! content(v2)
 * @type object
* @property {string} country CLDR country code (e.g. &quot;US&quot;).
* @property {string[]} fullAddress Strings representing the lines of the printed label for mailing the order, for example:
John Smith
1600 Amphitheatre Parkway
Mountain View, CA, 94043
United States
* @property {boolean} isPostOfficeBox Whether the address is a post office box.
* @property {string} locality City, town or commune. May also include dependent localities or sublocalities (e.g. neighborhoods or suburbs).
* @property {string} postalCode Postal Code or ZIP (e.g. &quot;94043&quot;).
* @property {string} recipientName Name of the recipient.
* @property {string} region Top-level administrative subdivision of the country (e.g. &quot;CA&quot;).
* @property {string[]} streetAddress Street-level part of the address.
*/
/**
 * @typedef OrderCancellation
 * @memberOf! content(v2)
 * @type object
 * @property {string} actor The actor that created the cancellation.
 * @property {string} creationDate Date on which the cancellation has been created, in ISO 8601 format.
 * @property {integer} quantity The quantity that was canceled.
 * @property {string} reason The reason for the cancellation. Orders that are cancelled with a noInventory reason will lead to the removal of the product from POG until you make an update to that product. This will not affect your Shopping ads.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderCustomer
 * @memberOf! content(v2)
 * @type object
 * @property {string} email Email address of the customer.
 * @property {boolean} explicitMarketingPreference If set, this indicates the user explicitly chose to opt in or out of providing marketing rights to the merchant. If unset, this indicates the user has already made this choice in a previous purchase, and was thus not shown the marketing right opt in/out checkbox during the checkout flow.
 * @property {string} fullName Full name of the customer.
 */
/**
 * @typedef OrderDeliveryDetails
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).OrderAddress} address The delivery address
 * @property {string} phoneNumber The phone number of the person receiving the delivery.
 */
/**
 * @typedef OrderLineItem
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).OrderCancellation[]} cancellations Cancellations of the line item.
 * @property {string} id The id of the line item.
 * @property {content(v2).Price} price Total price for the line item. For example, if two items for $10 are purchased, the total price will be $20.
 * @property {content(v2).OrderLineItemProduct} product Product data from the time of the order placement.
 * @property {integer} quantityCanceled Number of items canceled.
 * @property {integer} quantityDelivered Number of items delivered.
 * @property {integer} quantityOrdered Number of items ordered.
 * @property {integer} quantityPending Number of items pending.
 * @property {integer} quantityReturned Number of items returned.
 * @property {integer} quantityShipped Number of items shipped.
 * @property {content(v2).OrderLineItemReturnInfo} returnInfo Details of the return policy for the line item.
 * @property {content(v2).OrderReturn[]} returns Returns of the line item.
 * @property {content(v2).OrderLineItemShippingDetails} shippingDetails Details of the requested shipping for the line item.
 * @property {content(v2).Price} tax Total tax amount for the line item. For example, if two items are purchased, and each have a cost tax of $2, the total tax amount will be $4.
 */
/**
 * @typedef OrderLineItemProduct
 * @memberOf! content(v2)
 * @type object
 * @property {string} brand Brand of the item.
 * @property {string} channel The item&#39;s channel (online or local).
 * @property {string} condition Condition or state of the item.
 * @property {string} contentLanguage The two-letter ISO 639-1 language code for the item.
 * @property {string} gtin Global Trade Item Number (GTIN) of the item.
 * @property {string} id The REST id of the product.
 * @property {string} imageLink URL of an image of the item.
 * @property {string} itemGroupId Shared identifier for all variants of the same product.
 * @property {string} mpn Manufacturer Part Number (MPN) of the item.
 * @property {string} offerId An identifier of the item.
 * @property {content(v2).Price} price Price of the item.
 * @property {string} shownImage URL to the cached image shown to the user when order was placed.
 * @property {string} targetCountry The CLDR territory code of the target country of the product.
 * @property {string} title The title of the product.
 * @property {content(v2).OrderLineItemProductVariantAttribute[]} variantAttributes Variant attributes for the item. These are dimensions of the product, such as color, gender, material, pattern, and size. You can find a comprehensive list of variant attributes here.
 */
/**
 * @typedef OrderLineItemProductVariantAttribute
 * @memberOf! content(v2)
 * @type object
 * @property {string} dimension The dimension of the variant.
 * @property {string} value The value for the dimension.
 */
/**
 * @typedef OrderLineItemReturnInfo
 * @memberOf! content(v2)
 * @type object
 * @property {integer} daysToReturn How many days later the item can be returned.
 * @property {boolean} isReturnable Whether the item is returnable.
 * @property {string} policyUrl URL of the item return policy.
 */
/**
 * @typedef OrderLineItemShippingDetails
 * @memberOf! content(v2)
 * @type object
 * @property {string} deliverByDate The delivery by date, in ISO 8601 format.
 * @property {content(v2).OrderLineItemShippingDetailsMethod} method Details of the shipping method.
 * @property {string} shipByDate The ship by date, in ISO 8601 format.
 */
/**
 * @typedef OrderLineItemShippingDetailsMethod
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier for the shipping. Optional.
 * @property {integer} maxDaysInTransit Maximum transit time.
 * @property {string} methodName The name of the shipping method.
 * @property {integer} minDaysInTransit Minimum transit time.
 */
/**
 * @typedef OrderPaymentMethod
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).OrderAddress} billingAddress The billing address.
 * @property {integer} expirationMonth The card expiration month (January = 1, February = 2 etc.).
 * @property {integer} expirationYear The card expiration year (4-digit, e.g. 2015).
 * @property {string} lastFourDigits The last four digits of the card number.
 * @property {string} phoneNumber The billing phone number.
 * @property {string} type The type of instrument (VISA, Mastercard, etc).
 */
/**
 * @typedef OrderPromotion
 * @memberOf! content(v2)
 * @type object
* @property {content(v2).OrderPromotionBenefit[]} benefits 
* @property {string} effectiveDates The date and time frame when the promotion is active and ready for validation review. Note that the promotion live time may be delayed for a few hours due to the validation review.
Start date and end date are separated by a forward slash (/). The start date is specified by the format (YYYY-MM-DD), followed by the letter ?T?, the time of the day when the sale starts (in Greenwich Mean Time, GMT), followed by an expression of the time zone for the sale. The end date is in the same format.
* @property {string} genericRedemptionCode Optional. The text code that corresponds to the promotion when applied on the retailer?s website.
* @property {string} id The unique ID of the promotion.
* @property {string} longTitle The full title of the promotion.
* @property {string} productApplicability Whether the promotion is applicable to all products or only specific products.
* @property {string} redemptionChannel Indicates that the promotion is valid online.
*/
/**
 * @typedef OrderPromotionBenefit
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} discount The discount in the order price when the promotion is applied.
 * @property {string[]} offerIds The OfferId(s) that were purchased in this order and map to this specific benefit of the promotion.
 * @property {string} subType Further describes the benefit of the promotion. Note that we will expand on this enumeration as we support new promotion sub-types.
 * @property {content(v2).Price} taxImpact The impact on tax when the promotion is applied.
 * @property {string} type Describes whether the promotion applies to products (e.g. 20% off) or to shipping (e.g. Free Shipping).
 */
/**
 * @typedef OrderRefund
 * @memberOf! content(v2)
 * @type object
 * @property {string} actor The actor that created the refund.
 * @property {content(v2).Price} amount The amount that is refunded.
 * @property {string} creationDate Date on which the item has been created, in ISO 8601 format.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderReturn
 * @memberOf! content(v2)
 * @type object
 * @property {string} actor The actor that created the refund.
 * @property {string} creationDate Date on which the item has been created, in ISO 8601 format.
 * @property {integer} quantity Quantity that is returned.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrderShipment
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {string} creationDate Date on which the shipment has been created, in ISO 8601 format.
 * @property {string} deliveryDate Date on which the shipment has been delivered, in ISO 8601 format. Present only if status is delievered
 * @property {string} id The id of the shipment.
 * @property {content(v2).OrderShipmentLineItemShipment[]} lineItems The line items that are shipped.
 * @property {string} status The status of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrderShipmentLineItemShipment
 * @memberOf! content(v2)
 * @type object
 * @property {string} lineItemId The id of the line item that is shipped.
 * @property {integer} quantity The quantity that is shipped.
 */
/**
 * @typedef OrdersAcknowledgeRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 */
/**
 * @typedef OrdersAcknowledgeResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersAcknowledgeResponse&quot;.
 */
/**
 * @typedef OrdersAdvanceTestOrderResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersAdvanceTestOrderResponse&quot;.
 */
/**
 * @typedef OrdersCancelLineItemRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} amount Amount to refund for the cancelation. Optional. If not set, Google will calculate the default based on the price and tax of the items involved. The amount must not be larger than the net amount left on the order.
 * @property {string} lineItemId The ID of the line item to cancel.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {integer} quantity The quantity to cancel.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCancelLineItemResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCancelLineItemResponse&quot;.
 */
/**
 * @typedef OrdersCancelRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCancelResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCancelResponse&quot;.
 */
/**
 * @typedef OrdersCreateTestOrderRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} templateName The test order template to use. Specify as an alternative to testOrder as a shortcut for retrieving a template and then creating an order using that template.
 * @property {content(v2).TestOrder} testOrder The test order to create.
 */
/**
 * @typedef OrdersCreateTestOrderResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCreateTestOrderResponse&quot;.
 * @property {string} orderId The ID of the newly created test order.
 */
/**
 * @typedef OrdersCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).OrdersCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef OrdersCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {content(v2).OrdersCustomBatchRequestEntryCancel} cancel Required for cancel method.
 * @property {content(v2).OrdersCustomBatchRequestEntryCancelLineItem} cancelLineItem Required for cancelLineItem method.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} merchantOrderId The merchant order id. Required for updateMerchantOrderId and getByMerchantOrderId methods.
 * @property {string} method The method to apply.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order. Required for all methods beside get and getByMerchantOrderId.
 * @property {string} orderId The ID of the order. Required for all methods beside getByMerchantOrderId.
 * @property {content(v2).OrdersCustomBatchRequestEntryRefund} refund Required for refund method.
 * @property {content(v2).OrdersCustomBatchRequestEntryReturnLineItem} returnLineItem Required for returnLineItem method.
 * @property {content(v2).OrdersCustomBatchRequestEntryShipLineItems} shipLineItems Required for shipLineItems method.
 * @property {content(v2).OrdersCustomBatchRequestEntryUpdateShipment} updateShipment Required for updateShipment method.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryCancel
 * @memberOf! content(v2)
 * @type object
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryCancelLineItem
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} amount Amount to refund for the cancelation. Optional. If not set, Google will calculate the default based on the price and tax of the items involved. The amount must not be larger than the net amount left on the order.
 * @property {string} lineItemId The ID of the line item to cancel.
 * @property {integer} quantity The quantity to cancel.
 * @property {string} reason The reason for the cancellation.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryRefund
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} amount The amount that is refunded.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryReturnLineItem
 * @memberOf! content(v2)
 * @type object
 * @property {string} lineItemId The ID of the line item to return.
 * @property {integer} quantity The quantity to return.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryShipLineItems
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {content(v2).OrderShipmentLineItemShipment[]} lineItems Line items to ship.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrdersCustomBatchRequestEntryUpdateShipment
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier handling the shipment. Not updated if missing.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} status New status for the shipment. Not updated if missing.
 * @property {string} trackingId The tracking id for the shipment. Not updated if missing.
 */
/**
 * @typedef OrdersCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).OrdersCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCustomBatchResponse&quot;.
 */
/**
 * @typedef OrdersCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} executionStatus The status of the execution. Only defined if the method is not get or getByMerchantOrderId and if the request was successful.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersCustomBatchResponseEntry&quot;.
 * @property {content(v2).Order} order The retrieved order. Only defined if the method is get and if the request was successful.
 */
/**
 * @typedef OrdersGetByMerchantOrderIdResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersGetByMerchantOrderIdResponse&quot;.
 * @property {content(v2).Order} order The requested order.
 */
/**
 * @typedef OrdersGetTestOrderTemplateResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersGetTestOrderTemplateResponse&quot;.
 * @property {content(v2).TestOrder} template The requested test order template.
 */
/**
 * @typedef OrdersListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of orders.
 * @property {content(v2).Order[]} resources 
 */
/**
 * @typedef OrdersRefundRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Price} amount The amount that is refunded.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} reason The reason for the refund.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersRefundResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersRefundResponse&quot;.
 */
/**
 * @typedef OrdersReturnLineItemRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} lineItemId The ID of the line item to return.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {integer} quantity The quantity to return.
 * @property {string} reason The reason for the return.
 * @property {string} reasonText The explanation of the reason.
 */
/**
 * @typedef OrdersReturnLineItemResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersReturnLineItemResponse&quot;.
 */
/**
 * @typedef OrdersShipLineItemsRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier handling the shipment.
 * @property {content(v2).OrderShipmentLineItemShipment[]} lineItems Line items to ship.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} trackingId The tracking id for the shipment.
 */
/**
 * @typedef OrdersShipLineItemsResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersShipLineItemsResponse&quot;.
 */
/**
 * @typedef OrdersUpdateMerchantOrderIdRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} merchantOrderId The merchant order id to be assigned to the order. Must be unique per merchant.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 */
/**
 * @typedef OrdersUpdateMerchantOrderIdResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersUpdateMerchantOrderIdResponse&quot;.
 */
/**
 * @typedef OrdersUpdateShipmentRequest
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrier The carrier handling the shipment. Not updated if missing.
 * @property {string} operationId The ID of the operation. Unique across all operations for a given order.
 * @property {string} shipmentId The ID of the shipment.
 * @property {string} status New status for the shipment. Not updated if missing.
 * @property {string} trackingId The tracking id for the shipment. Not updated if missing.
 */
/**
 * @typedef OrdersUpdateShipmentResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} executionStatus The status of the execution.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#ordersUpdateShipmentResponse&quot;.
 */
/**
 * @typedef PostalCodeGroup
 * @memberOf! content(v2)
 * @type object
 * @property {string} country The CLDR territory code of the country the postal code group applies to. Required.
 * @property {string} name The name of the postal code group, referred to in headers. Required.
 * @property {content(v2).PostalCodeRange[]} postalCodeRanges A range of postal codes. Required.
 */
/**
 * @typedef PostalCodeRange
 * @memberOf! content(v2)
 * @type object
 * @property {string} postalCodeRangeBegin A postal code or a pattern of the form prefix* denoting the inclusive lower bound of the range defining the area. Examples values: &quot;94108&quot;, &quot;9410*&quot;, &quot;9*&quot;. Required.
 * @property {string} postalCodeRangeEnd A postal code or a pattern of the form prefix* denoting the inclusive upper bound of the range defining the area. It must have the same length as postalCodeRangeBegin: if postalCodeRangeBegin is a postal code then postalCodeRangeEnd must be a postal code too; if postalCodeRangeBegin is a pattern then postalCodeRangeEnd must be a pattern with the same prefix length. Optional: if not set, then the area is defined as being all the postal codes matching postalCodeRangeBegin.
 */
/**
 * @typedef Price
 * @memberOf! content(v2)
 * @type object
 * @property {string} currency The currency of the price.
 * @property {string} value The price represented as a number.
 */
/**
 * @typedef Product
 * @memberOf! content(v2)
 * @type object
 * @property {string[]} additionalImageLinks Additional URLs of images of the item.
 * @property {string[]} additionalProductTypes Additional categories of the item (formatted as in products feed specification).
 * @property {boolean} adult Set to true if the item is targeted towards adults.
 * @property {string} adwordsGrouping Used to group items in an arbitrary way. Only for CPA%, discouraged otherwise.
 * @property {string[]} adwordsLabels Similar to adwords_grouping, but only works on CPC.
 * @property {string} adwordsRedirect Allows advertisers to override the item URL when the product is shown within the context of Product Ads.
 * @property {string} ageGroup Target age group of the item.
 * @property {content(v2).ProductAspect[]} aspects Specifies the intended aspects for the product.
 * @property {string} availability Availability status of the item.
 * @property {string} availabilityDate The day a pre-ordered product becomes available for delivery, in ISO 8601 format.
 * @property {string} brand Brand of the item.
 * @property {string} channel The item&#39;s channel (online or local).
 * @property {string} color Color of the item.
 * @property {string} condition Condition or state of the item.
 * @property {string} contentLanguage The two-letter ISO 639-1 language code for the item.
 * @property {content(v2).ProductCustomAttribute[]} customAttributes A list of custom (merchant-provided) attributes. It can also be used for submitting any attribute of the feed specification in its generic form (e.g., { &quot;name&quot;: &quot;size type&quot;, &quot;type&quot;: &quot;text&quot;, &quot;value&quot;: &quot;regular&quot; }). This is useful for submitting attributes not explicitly exposed by the API.
 * @property {content(v2).ProductCustomGroup[]} customGroups A list of custom (merchant-provided) custom attribute groups.
 * @property {string} customLabel0 Custom label 0 for custom grouping of items in a Shopping campaign.
 * @property {string} customLabel1 Custom label 1 for custom grouping of items in a Shopping campaign.
 * @property {string} customLabel2 Custom label 2 for custom grouping of items in a Shopping campaign.
 * @property {string} customLabel3 Custom label 3 for custom grouping of items in a Shopping campaign.
 * @property {string} customLabel4 Custom label 4 for custom grouping of items in a Shopping campaign.
 * @property {string} description Description of the item.
 * @property {content(v2).ProductDestination[]} destinations Specifies the intended destinations for the product.
 * @property {string} displayAdsId An identifier for an item for dynamic remarketing campaigns.
 * @property {string} displayAdsLink URL directly to your item&#39;s landing page for dynamic remarketing campaigns.
 * @property {string[]} displayAdsSimilarIds Advertiser-specified recommendations.
 * @property {string} displayAdsTitle Title of an item for dynamic remarketing campaigns.
 * @property {number} displayAdsValue Offer margin for dynamic remarketing campaigns.
 * @property {string} energyEfficiencyClass The energy efficiency class as defined in EU directive 2010/30/EU.
 * @property {string} expirationDate Date on which the item should expire, as specified upon insertion, in ISO 8601 format. The actual expiration date in Google Shopping is exposed in productstatuses as googleExpirationDate and might be earlier if expirationDate is too far in the future.
 * @property {string} gender Target gender of the item.
 * @property {string} googleProductCategory Google&#39;s category of the item (see Google product taxonomy).
 * @property {string} gtin Global Trade Item Number (GTIN) of the item.
 * @property {string} id The REST id of the product.
 * @property {boolean} identifierExists False when the item does not have unique product identifiers appropriate to its category, such as GTIN, MPN, and brand. Required according to the Unique Product Identifier Rules for all target countries except for Canada.
 * @property {string} imageLink URL of an image of the item.
 * @property {content(v2).Installment} installment Number and amount of installments to pay for an item. Brazil only.
 * @property {boolean} isBundle Whether the item is a merchant-defined bundle. A bundle is a custom grouping of different products sold by a merchant for a single price.
 * @property {string} itemGroupId Shared identifier for all variants of the same product.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#product&quot;.
 * @property {string} link URL directly linking to your item&#39;s page on your website.
 * @property {content(v2).LoyaltyPoints} loyaltyPoints Loyalty points that users receive after purchasing the item. Japan only.
 * @property {string} material The material of which the item is made.
 * @property {string} mobileLink Link to a mobile-optimized version of the landing page.
 * @property {string} mpn Manufacturer Part Number (MPN) of the item.
 * @property {string} multipack The number of identical products in a merchant-defined multipack.
 * @property {string} offerId An identifier of the item. Leading and trailing whitespaces are stripped and multiple whitespaces are replaced by a single whitespace upon submission. Only valid unicode characters are accepted. See the products feed specification for details.
 * @property {boolean} onlineOnly Whether an item is available for purchase only online.
 * @property {string} pattern The item&#39;s pattern (e.g. polka dots).
 * @property {content(v2).Price} price Price of the item.
 * @property {string} productType Your category of the item (formatted as in products feed specification).
 * @property {string[]} promotionIds The unique ID of a promotion.
 * @property {content(v2).Price} salePrice Advertised sale price of the item.
 * @property {string} salePriceEffectiveDate Date range during which the item is on sale (see products feed specification).
 * @property {string} sellOnGoogleQuantity The quantity of the product that is reserved for sell-on-google ads.
 * @property {content(v2).ProductShipping[]} shipping Shipping rules.
 * @property {content(v2).ProductShippingDimension} shippingHeight Height of the item for shipping.
 * @property {string} shippingLabel The shipping label of the product, used to group product in account-level shipping rules.
 * @property {content(v2).ProductShippingDimension} shippingLength Length of the item for shipping.
 * @property {content(v2).ProductShippingWeight} shippingWeight Weight of the item for shipping.
 * @property {content(v2).ProductShippingDimension} shippingWidth Width of the item for shipping.
 * @property {string} sizeSystem System in which the size is specified. Recommended for apparel items.
 * @property {string} sizeType The cut of the item. Recommended for apparel items.
 * @property {string[]} sizes Size of the item.
 * @property {string} targetCountry The CLDR territory code for the item.
 * @property {content(v2).ProductTax[]} taxes Tax information.
 * @property {string} title Title of the item.
 * @property {content(v2).ProductUnitPricingBaseMeasure} unitPricingBaseMeasure The preference of the denominator of the unit price.
 * @property {content(v2).ProductUnitPricingMeasure} unitPricingMeasure The measure and dimension of an item.
 * @property {string[]} validatedDestinations The read-only list of intended destinations which passed validation.
 * @property {content(v2).Error[]} warnings Read-only warnings.
 */
/**
 * @typedef ProductAspect
 * @memberOf! content(v2)
 * @type object
 * @property {string} aspectName The name of the aspect.
 * @property {string} destinationName The name of the destination. Leave out to apply to all destinations.
 * @property {string} intention Whether the aspect is required, excluded or should be validated.
 */
/**
 * @typedef ProductCustomAttribute
 * @memberOf! content(v2)
 * @type object
 * @property {string} name The name of the attribute. Underscores will be replaced by spaces upon insertion.
 * @property {string} type The type of the attribute.
 * @property {string} unit Free-form unit of the attribute. Unit can only be used for values of type INT or FLOAT.
 * @property {string} value The value of the attribute.
 */
/**
 * @typedef ProductCustomGroup
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ProductCustomAttribute[]} attributes The sub-attributes.
 * @property {string} name The name of the group. Underscores will be replaced by spaces upon insertion.
 */
/**
 * @typedef ProductDestination
 * @memberOf! content(v2)
 * @type object
 * @property {string} destinationName The name of the destination.
 * @property {string} intention Whether the destination is required, excluded or should be validated.
 */
/**
 * @typedef ProductShipping
 * @memberOf! content(v2)
 * @type object
 * @property {string} country The CLDR territory code of the country to which an item will ship.
 * @property {string} locationGroupName The location where the shipping is applicable, represented by a location group name.
 * @property {string} locationId The numeric id of a location that the shipping rate applies to as defined in the AdWords API.
 * @property {string} postalCode The postal code range that the shipping rate applies to, represented by a postal code, a postal code prefix followed by a * wildcard, a range between two postal codes or two postal code prefixes of equal length.
 * @property {content(v2).Price} price Fixed shipping price, represented as a number.
 * @property {string} region The geographic region to which a shipping rate applies (e.g. zip code).
 * @property {string} service A free-form description of the service class or delivery speed.
 */
/**
 * @typedef ProductShippingDimension
 * @memberOf! content(v2)
 * @type object
* @property {string} unit The unit of value.

Acceptable values are:  
- &quot;cm&quot; 
- &quot;in&quot;
* @property {number} value The dimension of the product used to calculate the shipping cost of the item.
*/
/**
 * @typedef ProductShippingWeight
 * @memberOf! content(v2)
 * @type object
 * @property {string} unit The unit of value.
 * @property {number} value The weight of the product used to calculate the shipping cost of the item.
 */
/**
 * @typedef ProductStatus
 * @memberOf! content(v2)
 * @type object
 * @property {string} creationDate Date on which the item has been created, in ISO 8601 format.
 * @property {content(v2).ProductStatusDataQualityIssue[]} dataQualityIssues A list of data quality issues associated with the product.
 * @property {content(v2).ProductStatusDestinationStatus[]} destinationStatuses The intended destinations for the product.
 * @property {string} googleExpirationDate Date on which the item expires in Google Shopping, in ISO 8601 format.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productStatus&quot;.
 * @property {string} lastUpdateDate Date on which the item has been last updated, in ISO 8601 format.
 * @property {string} link The link to the product.
 * @property {string} productId The id of the product for which status is reported.
 * @property {string} title The title of the product.
 */
/**
 * @typedef ProductStatusDataQualityIssue
 * @memberOf! content(v2)
 * @type object
 * @property {string} detail A more detailed error string.
 * @property {string} fetchStatus The fetch status for landing_page_errors.
 * @property {string} id The id of the data quality issue.
 * @property {string} location The attribute name that is relevant for the issue.
 * @property {string} severity The severity of the data quality issue.
 * @property {string} timestamp The time stamp of the data quality issue.
 * @property {string} valueOnLandingPage The value of that attribute that was found on the landing page
 * @property {string} valueProvided The value the attribute had at time of evaluation.
 */
/**
 * @typedef ProductStatusDestinationStatus
 * @memberOf! content(v2)
 * @type object
 * @property {string} approvalStatus The destination&#39;s approval status.
 * @property {string} destination The name of the destination
 * @property {string} intention Whether the destination is required, excluded, selected by default or should be validated.
 */
/**
 * @typedef ProductTax
 * @memberOf! content(v2)
 * @type object
 * @property {string} country The country within which the item is taxed, specified as a CLDR territory code.
 * @property {string} locationId The numeric id of a location that the tax rate applies to as defined in the AdWords API.
 * @property {string} postalCode The postal code range that the tax rate applies to, represented by a ZIP code, a ZIP code prefix using * wildcard, a range between two ZIP codes or two ZIP code prefixes of equal length. Examples: 94114, 94*, 94002-95460, 94*-95*.
 * @property {number} rate The percentage of tax rate that applies to the item price.
 * @property {string} region The geographic region to which the tax rate applies.
 * @property {boolean} taxShip Set to true if tax is charged on shipping.
 */
/**
 * @typedef ProductUnitPricingBaseMeasure
 * @memberOf! content(v2)
 * @type object
 * @property {string} unit The unit of the denominator.
 * @property {string} value The denominator of the unit price.
 */
/**
 * @typedef ProductUnitPricingMeasure
 * @memberOf! content(v2)
 * @type object
 * @property {string} unit The unit of the measure.
 * @property {number} value The measure of an item.
 */
/**
 * @typedef ProductsCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ProductsCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef ProductsCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 * @property {content(v2).Product} product The product to insert. Only required if the method is insert.
 * @property {string} productId The ID of the product to get or delete. Only defined if the method is get or delete.
 */
/**
 * @typedef ProductsCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ProductsCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productsCustomBatchResponse&quot;.
 */
/**
 * @typedef ProductsCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors defined if and only if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productsCustomBatchResponseEntry&quot;.
 * @property {content(v2).Product} product The inserted product. Only defined if the method is insert and if the request was successful.
 */
/**
 * @typedef ProductsListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productsListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of products.
 * @property {content(v2).Product[]} resources 
 */
/**
 * @typedef ProductstatusesCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ProductstatusesCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef ProductstatusesCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 * @property {string} productId The ID of the product whose status to get.
 */
/**
 * @typedef ProductstatusesCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ProductstatusesCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productstatusesCustomBatchResponse&quot;.
 */
/**
 * @typedef ProductstatusesCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry this entry responds to.
 * @property {content(v2).Errors} errors A list of errors, if the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productstatusesCustomBatchResponseEntry&quot;.
 * @property {content(v2).ProductStatus} productStatus The requested product status. Only defined if the request was successful.
 */
/**
 * @typedef ProductstatusesListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#productstatusesListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of products statuses.
 * @property {content(v2).ProductStatus[]} resources 
 */
/**
 * @typedef RateGroup
 * @memberOf! content(v2)
 * @type object
 * @property {string[]} applicableShippingLabels A list of shipping labels defining the products to which this rate group applies to. This is a disjunction: only one of the labels has to match for the rate group to apply. May only be empty for the last rate group of a service. Required.
 * @property {content(v2).CarrierRate[]} carrierRates A list of carrier rates that can be referred to by mainTable or singleValue.
 * @property {content(v2).Table} mainTable A table defining the rate group, when singleValue is not expressive enough. Can only be set if singleValue is not set.
 * @property {content(v2).Value} singleValue The value of the rate group (e.g. flat rate $10). Can only be set if mainTable and subtables are not set.
 * @property {content(v2).Table[]} subtables A list of subtables referred to by mainTable. Can only be set if mainTable is set.
 */
/**
 * @typedef Row
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Value[]} cells The list of cells that constitute the row. Must have the same length as columnHeaders for two-dimensional tables, a length of 1 for one-dimensional tables. Required.
 */
/**
 * @typedef Service
 * @memberOf! content(v2)
 * @type object
 * @property {boolean} active A boolean exposing the active status of the shipping service. Required.
 * @property {string} currency The CLDR code of the currency to which this service applies. Must match that of the prices in rate groups.
 * @property {string} deliveryCountry The CLDR territory code of the country to which the service applies. Required.
 * @property {content(v2).DeliveryTime} deliveryTime Time spent in various aspects from order to the delivery of the product. Required.
 * @property {string} name Free-form name of the service. Must be unique within target account. Required.
 * @property {content(v2).RateGroup[]} rateGroups Shipping rate group definitions. Only the last one is allowed to have an empty applicableShippingLabels, which means &quot;everything else&quot;. The other applicableShippingLabels must not overlap.
 */
/**
 * @typedef ShippingSettings
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account to which these account shipping settings belong. Ignored upon update, always present in get request responses.
 * @property {content(v2).PostalCodeGroup[]} postalCodeGroups A list of postal code groups that can be referred to in services. Optional.
 * @property {content(v2).Service[]} services The target account&#39;s list of services. Optional.
 */
/**
 * @typedef ShippingsettingsCustomBatchRequest
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ShippingsettingsCustomBatchRequestEntry[]} entries The request entries to be processed in the batch.
 */
/**
 * @typedef ShippingsettingsCustomBatchRequestEntry
 * @memberOf! content(v2)
 * @type object
 * @property {string} accountId The ID of the account for which to get/update account shipping settings.
 * @property {integer} batchId An entry ID, unique within the batch request.
 * @property {string} merchantId The ID of the managing account.
 * @property {string} method 
 * @property {content(v2).ShippingSettings} shippingSettings The account shipping settings to update. Only defined if the method is update.
 */
/**
 * @typedef ShippingsettingsCustomBatchResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).ShippingsettingsCustomBatchResponseEntry[]} entries The result of the execution of the batch requests.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#shippingsettingsCustomBatchResponse&quot;.
 */
/**
 * @typedef ShippingsettingsCustomBatchResponseEntry
 * @memberOf! content(v2)
 * @type object
 * @property {integer} batchId The ID of the request entry to which this entry responds.
 * @property {content(v2).Errors} errors A list of errors defined if, and only if, the request failed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#shippingsettingsCustomBatchResponseEntry&quot;.
 * @property {content(v2).ShippingSettings} shippingSettings The retrieved or updated account shipping settings.
 */
/**
 * @typedef ShippingsettingsGetSupportedCarriersResponse
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).CarriersCarrier[]} carriers A list of supported carriers. May be empty.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#shippingsettingsGetSupportedCarriersResponse&quot;.
 */
/**
 * @typedef ShippingsettingsListResponse
 * @memberOf! content(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#shippingsettingsListResponse&quot;.
 * @property {string} nextPageToken The token for the retrieval of the next page of shipping settings.
 * @property {content(v2).ShippingSettings[]} resources 
 */
/**
 * @typedef Table
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).Headers} columnHeaders Headers of the table&#39;s columns. Optional: if not set then the table has only one dimension.
 * @property {string} name Name of the table. Required for subtables, ignored for the main table.
 * @property {content(v2).Headers} rowHeaders Headers of the table&#39;s rows. Required.
 * @property {content(v2).Row[]} rows The list of rows that constitute the table. Must have the same length as rowHeaders. Required.
 */
/**
 * @typedef TestOrder
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).TestOrderCustomer} customer The details of the customer who placed the order.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;content#testOrder&quot;.
 * @property {content(v2).TestOrderLineItem[]} lineItems Line items that are ordered. At least one line item must be provided.
 * @property {content(v2).TestOrderPaymentMethod} paymentMethod The details of the payment method.
 * @property {string} predefinedDeliveryAddress Identifier of one of the predefined delivery addresses for the delivery.
 * @property {content(v2).OrderPromotion[]} promotions The details of the merchant provided promotions applied to the order. More details about the program are  here.
 * @property {content(v2).Price} shippingCost The total cost of shipping for all items.
 * @property {content(v2).Price} shippingCostTax The tax for the total shipping cost.
 * @property {string} shippingOption The requested shipping option.
 */
/**
 * @typedef TestOrderCustomer
 * @memberOf! content(v2)
 * @type object
 * @property {string} email Email address of the customer.
 * @property {boolean} explicitMarketingPreference If set, this indicates the user explicitly chose to opt in or out of providing marketing rights to the merchant. If unset, this indicates the user has already made this choice in a previous purchase, and was thus not shown the marketing right opt in/out checkbox during the checkout flow. Optional.
 * @property {string} fullName Full name of the customer.
 */
/**
 * @typedef TestOrderLineItem
 * @memberOf! content(v2)
 * @type object
 * @property {content(v2).TestOrderLineItemProduct} product Product data from the time of the order placement.
 * @property {integer} quantityOrdered Number of items ordered.
 * @property {content(v2).OrderLineItemReturnInfo} returnInfo Details of the return policy for the line item.
 * @property {content(v2).OrderLineItemShippingDetails} shippingDetails Details of the requested shipping for the line item.
 * @property {content(v2).Price} unitTax Unit tax for the line item.
 */
/**
 * @typedef TestOrderLineItemProduct
 * @memberOf! content(v2)
 * @type object
 * @property {string} brand Brand of the item.
 * @property {string} channel The item&#39;s channel.
 * @property {string} condition Condition or state of the item.
 * @property {string} contentLanguage The two-letter ISO 639-1 language code for the item.
 * @property {string} gtin Global Trade Item Number (GTIN) of the item. Optional.
 * @property {string} imageLink URL of an image of the item.
 * @property {string} itemGroupId Shared identifier for all variants of the same product. Optional.
 * @property {string} mpn Manufacturer Part Number (MPN) of the item. Optional.
 * @property {string} offerId An identifier of the item.
 * @property {content(v2).Price} price The price for the product.
 * @property {string} targetCountry The CLDR territory code of the target country of the product.
 * @property {string} title The title of the product.
 * @property {content(v2).OrderLineItemProductVariantAttribute[]} variantAttributes Variant attributes for the item. Optional.
 */
/**
 * @typedef TestOrderPaymentMethod
 * @memberOf! content(v2)
 * @type object
 * @property {integer} expirationMonth The card expiration month (January = 1, February = 2 etc.).
 * @property {integer} expirationYear The card expiration year (4-digit, e.g. 2015).
 * @property {string} lastFourDigits The last four digits of the card number.
 * @property {string} predefinedBillingAddress The billing address.
 * @property {string} type The type of instrument. Note that real orders might have different values than the four values accepted by createTestOrder.
 */
/**
 * @typedef Value
 * @memberOf! content(v2)
 * @type object
 * @property {string} carrierRateName The name of a carrier rate referring to a carrier rate defined in the same rate group. Can only be set if all other fields are not set.
 * @property {content(v2).Price} flatRate A flat rate. Can only be set if all other fields are not set.
 * @property {boolean} noShipping If true, then the product can&#39;t ship. Must be true when set, can only be set if all other fields are not set.
 * @property {string} pricePercentage A percentage of the price represented as a number in decimal notation (e.g., &quot;5.4&quot;). Can only be set if all other fields are not set.
 * @property {string} subtableName The name of a subtable. Can only be set in table cells (i.e., not for single values), and only if all other fields are not set.
 */
/**
 * @typedef Weight
 * @memberOf! content(v2)
 * @type object
 * @property {string} unit The weight unit.
 * @property {string} value The weight represented as a number.
 */
module.exports = Content;
