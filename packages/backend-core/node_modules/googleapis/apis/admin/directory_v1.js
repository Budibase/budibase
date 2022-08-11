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
 * Admin Directory API
 *
 * The Admin SDK Directory API lets you view and manage enterprise resources such as users and groups, administrative notifications, security features, and more.
 *
 * @example
 * var google = require('googleapis');
 * var admin = google.admin('directory_v1');
 *
 * @namespace admin
 * @type {Function}
 * @version directory_v1
 * @variation directory_v1
 * @param {object=} options Options for Admin
 */
function Admin(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.asps = {

    /**
     * directory.asps.delete
     *
     * @desc Delete an ASP issued by a user.
     *
     * @alias directory.asps.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.codeId The unique ID of the ASP to be deleted.
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/asps/{codeId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['userKey', 'codeId'],
        pathParams: ['codeId', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.asps.get
     *
     * @desc Get information about an ASP issued by a user.
     *
     * @alias directory.asps.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.codeId The unique ID of the ASP.
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/asps/{codeId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey', 'codeId'],
        pathParams: ['codeId', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.asps.list
     *
     * @desc List the ASPs issued by a user.
     *
     * @alias directory.asps.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/asps',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channels = {

    /**
     * admin.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias admin.channels.stop
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {admin(directory_v1).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/admin/directory_v1/channels/stop',
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

  self.chromeosdevices = {

    /**
     * directory.chromeosdevices.action
     *
     * @desc Take action on Chrome OS Device
     *
     * @alias directory.chromeosdevices.action
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.resourceId Immutable id of Chrome OS Device
     * @param {admin(directory_v1).ChromeOsDeviceAction} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    action: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos/{resourceId}/action',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'resourceId'],
        pathParams: ['customerId', 'resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.chromeosdevices.get
     *
     * @desc Retrieve Chrome OS Device
     *
     * @alias directory.chromeosdevices.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.deviceId Immutable id of Chrome OS Device
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos/{deviceId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId', 'deviceId'],
        pathParams: ['customerId', 'deviceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.chromeosdevices.list
     *
     * @desc Retrieve all Chrome OS Devices of a customer (paginated)
     *
     * @alias directory.chromeosdevices.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100
     * @param {string=} params.orderBy Column to use for sorting results
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {string=} params.query Search string in the format given at http://support.google.com/chromeos/a/bin/answer.py?hl=en&answer=1698333
     * @param {string=} params.sortOrder Whether to return results in ascending or descending order. Only of use when orderBy is also used
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.chromeosdevices.patch
     *
     * @desc Update Chrome OS Device. This method supports patch semantics.
     *
     * @alias directory.chromeosdevices.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.deviceId Immutable id of Chrome OS Device
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {admin(directory_v1).ChromeOsDevice} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos/{deviceId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customerId', 'deviceId'],
        pathParams: ['customerId', 'deviceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.chromeosdevices.update
     *
     * @desc Update Chrome OS Device
     *
     * @alias directory.chromeosdevices.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.deviceId Immutable id of Chrome OS Device
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {admin(directory_v1).ChromeOsDevice} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/chromeos/{deviceId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customerId', 'deviceId'],
        pathParams: ['customerId', 'deviceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.customers = {

    /**
     * directory.customers.get
     *
     * @desc Retrieves a customer.
     *
     * @alias directory.customers.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerKey Id of the customer to be retrieved
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
          url: 'https://www.googleapis.com/admin/directory/v1/customers/{customerKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerKey'],
        pathParams: ['customerKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.customers.patch
     *
     * @desc Updates a customer. This method supports patch semantics.
     *
     * @alias directory.customers.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerKey Id of the customer to be updated
     * @param {admin(directory_v1).Customer} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customers/{customerKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customerKey'],
        pathParams: ['customerKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.customers.update
     *
     * @desc Updates a customer.
     *
     * @alias directory.customers.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerKey Id of the customer to be updated
     * @param {admin(directory_v1).Customer} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customers/{customerKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customerKey'],
        pathParams: ['customerKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.domainAliases = {

    /**
     * directory.domainAliases.delete
     *
     * @desc Deletes a Domain Alias of the customer.
     *
     * @alias directory.domainAliases.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {string} params.domainAliasName Name of domain alias to be retrieved.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domainaliases/{domainAliasName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customer', 'domainAliasName'],
        pathParams: ['customer', 'domainAliasName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domainAliases.get
     *
     * @desc Retrieves a domain alias of the customer.
     *
     * @alias directory.domainAliases.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {string} params.domainAliasName Name of domain alias to be retrieved.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domainaliases/{domainAliasName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer', 'domainAliasName'],
        pathParams: ['customer', 'domainAliasName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domainAliases.insert
     *
     * @desc Inserts a Domain alias of the customer.
     *
     * @alias directory.domainAliases.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {admin(directory_v1).DomainAlias} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domainaliases',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domainAliases.list
     *
     * @desc Lists the domain aliases of the customer.
     *
     * @alias directory.domainAliases.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {string=} params.parentDomainName Name of the parent domain for which domain aliases are to be fetched.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domainaliases',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.domains = {

    /**
     * directory.domains.delete
     *
     * @desc Deletes a domain of the customer.
     *
     * @alias directory.domains.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {string} params.domainName Name of domain to be deleted
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domains/{domainName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customer', 'domainName'],
        pathParams: ['customer', 'domainName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domains.get
     *
     * @desc Retrieves a domain of the customer.
     *
     * @alias directory.domains.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {string} params.domainName Name of domain to be retrieved
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domains/{domainName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer', 'domainName'],
        pathParams: ['customer', 'domainName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domains.insert
     *
     * @desc Inserts a domain of the customer.
     *
     * @alias directory.domains.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {admin(directory_v1).Domains} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domains',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.domains.list
     *
     * @desc Lists the domains of the customer.
     *
     * @alias directory.domains.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/domains',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.groups = {

    /**
     * directory.groups.delete
     *
     * @desc Delete Group
     *
     * @alias directory.groups.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.groups.get
     *
     * @desc Retrieve Group
     *
     * @alias directory.groups.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.groups.insert
     *
     * @desc Create Group
     *
     * @alias directory.groups.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {admin(directory_v1).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups',
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
     * directory.groups.list
     *
     * @desc Retrieve all groups in a domain (paginated)
     *
     * @alias directory.groups.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.customer Immutable id of the Google Apps account. In case of multi-domain, to fetch all groups for a customer, fill this field instead of domain.
     * @param {string=} params.domain Name of the domain. Fill this field to get groups from only this domain. To return all groups in a multi-domain fill customer field instead.
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 200
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.userKey Email or immutable Id of the user if only those groups are to be listed, the given user is a member of. If Id, it should match with id of user object
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups',
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
     * directory.groups.patch
     *
     * @desc Update Group. This method supports patch semantics.
     *
     * @alias directory.groups.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group. If Id, it should match with id of group object
     * @param {admin(directory_v1).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.groups.update
     *
     * @desc Update Group
     *
     * @alias directory.groups.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group. If Id, it should match with id of group object
     * @param {admin(directory_v1).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    aliases: {

      /**
       * directory.groups.aliases.delete
       *
       * @desc Remove a alias for the group
       *
       * @alias directory.groups.aliases.delete
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.alias The alias to be removed
       * @param {string} params.groupKey Email or immutable Id of the group
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
            url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/aliases/{alias}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['groupKey', 'alias'],
          pathParams: ['alias', 'groupKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.groups.aliases.insert
       *
       * @desc Add a alias for the group
       *
       * @alias directory.groups.aliases.insert
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.groupKey Email or immutable Id of the group
       * @param {admin(directory_v1).Alias} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/aliases',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['groupKey'],
          pathParams: ['groupKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.groups.aliases.list
       *
       * @desc List all aliases for a group
       *
       * @alias directory.groups.aliases.list
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.groupKey Email or immutable Id of the group
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
            url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/aliases',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['groupKey'],
          pathParams: ['groupKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.members = {

    /**
     * directory.members.delete
     *
     * @desc Remove membership.
     *
     * @alias directory.members.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
     * @param {string} params.memberKey Email or immutable Id of the member
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members/{memberKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['groupKey', 'memberKey'],
        pathParams: ['groupKey', 'memberKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.members.get
     *
     * @desc Retrieve Group Member
     *
     * @alias directory.members.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
     * @param {string} params.memberKey Email or immutable Id of the member
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members/{memberKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['groupKey', 'memberKey'],
        pathParams: ['groupKey', 'memberKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.members.insert
     *
     * @desc Add user to the specified group.
     *
     * @alias directory.members.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
     * @param {admin(directory_v1).Member} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.members.list
     *
     * @desc Retrieve all members in a group (paginated)
     *
     * @alias directory.members.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 200
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.roles Comma separated role values to filter list results on.
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['groupKey'],
        pathParams: ['groupKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.members.patch
     *
     * @desc Update membership of a user in the specified group. This method supports patch semantics.
     *
     * @alias directory.members.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group. If Id, it should match with id of group object
     * @param {string} params.memberKey Email or immutable Id of the user. If Id, it should match with id of member object
     * @param {admin(directory_v1).Member} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members/{memberKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['groupKey', 'memberKey'],
        pathParams: ['groupKey', 'memberKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.members.update
     *
     * @desc Update membership of a user in the specified group.
     *
     * @alias directory.members.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupKey Email or immutable Id of the group. If Id, it should match with id of group object
     * @param {string} params.memberKey Email or immutable Id of the user. If Id, it should match with id of member object
     * @param {admin(directory_v1).Member} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/groups/{groupKey}/members/{memberKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['groupKey', 'memberKey'],
        pathParams: ['groupKey', 'memberKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.mobiledevices = {

    /**
     * directory.mobiledevices.action
     *
     * @desc Take action on Mobile Device
     *
     * @alias directory.mobiledevices.action
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.resourceId Immutable id of Mobile Device
     * @param {admin(directory_v1).MobileDeviceAction} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    action: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/mobile/{resourceId}/action',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'resourceId'],
        pathParams: ['customerId', 'resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.mobiledevices.delete
     *
     * @desc Delete Mobile Device
     *
     * @alias directory.mobiledevices.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.resourceId Immutable id of Mobile Device
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/mobile/{resourceId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customerId', 'resourceId'],
        pathParams: ['customerId', 'resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.mobiledevices.get
     *
     * @desc Retrieve Mobile Device
     *
     * @alias directory.mobiledevices.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {string} params.resourceId Immutable id of Mobile Device
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/mobile/{resourceId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId', 'resourceId'],
        pathParams: ['customerId', 'resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.mobiledevices.list
     *
     * @desc Retrieve all Mobile Devices of a customer (paginated)
     *
     * @alias directory.mobiledevices.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100
     * @param {string=} params.orderBy Column to use for sorting results
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {string=} params.query Search string in the format given at http://support.google.com/a/bin/answer.py?hl=en&answer=1408863#search
     * @param {string=} params.sortOrder Whether to return results in ascending or descending order. Only of use when orderBy is also used
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/devices/mobile',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.notifications = {

    /**
     * directory.notifications.delete
     *
     * @desc Deletes a notification
     *
     * @alias directory.notifications.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer The unique ID for the customer's Google account. The customerId is also returned as part of the Users resource.
     * @param {string} params.notificationId The unique ID of the notification.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/notifications/{notificationId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customer', 'notificationId'],
        pathParams: ['customer', 'notificationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.notifications.get
     *
     * @desc Retrieves a notification.
     *
     * @alias directory.notifications.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer The unique ID for the customer's Google account. The customerId is also returned as part of the Users resource.
     * @param {string} params.notificationId The unique ID of the notification.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/notifications/{notificationId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer', 'notificationId'],
        pathParams: ['customer', 'notificationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.notifications.list
     *
     * @desc Retrieves a list of notifications.
     *
     * @alias directory.notifications.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer The unique ID for the customer's Google account.
     * @param {string=} params.language The ISO 639-1 code of the language notifications are returned in. The default is English (en).
     * @param {integer=} params.maxResults Maximum number of notifications to return per page. The default is 100.
     * @param {string=} params.pageToken The token to specify the page of results to retrieve.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/notifications',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.notifications.patch
     *
     * @desc Updates a notification. This method supports patch semantics.
     *
     * @alias directory.notifications.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer The unique ID for the customer's Google account.
     * @param {string} params.notificationId The unique ID of the notification.
     * @param {admin(directory_v1).Notification} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/notifications/{notificationId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customer', 'notificationId'],
        pathParams: ['customer', 'notificationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.notifications.update
     *
     * @desc Updates a notification.
     *
     * @alias directory.notifications.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer The unique ID for the customer's Google account.
     * @param {string} params.notificationId The unique ID of the notification.
     * @param {admin(directory_v1).Notification} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/notifications/{notificationId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customer', 'notificationId'],
        pathParams: ['customer', 'notificationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.orgunits = {

    /**
     * directory.orgunits.delete
     *
     * @desc Remove Organization Unit
     *
     * @alias directory.orgunits.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.orgUnitPath Full path of the organization unit or its Id
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits/{orgUnitPath}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customerId', 'orgUnitPath'],
        pathParams: ['customerId', 'orgUnitPath'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.orgunits.get
     *
     * @desc Retrieve Organization Unit
     *
     * @alias directory.orgunits.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.orgUnitPath Full path of the organization unit or its Id
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits/{orgUnitPath}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId', 'orgUnitPath'],
        pathParams: ['customerId', 'orgUnitPath'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.orgunits.insert
     *
     * @desc Add Organization Unit
     *
     * @alias directory.orgunits.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {admin(directory_v1).OrgUnit} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.orgunits.list
     *
     * @desc Retrieve all Organization Units
     *
     * @alias directory.orgunits.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string=} params.orgUnitPath the URL-encoded organization unit's path or its Id
     * @param {string=} params.type Whether to return all sub-organizations or just immediate children
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.orgunits.patch
     *
     * @desc Update Organization Unit. This method supports patch semantics.
     *
     * @alias directory.orgunits.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.orgUnitPath Full path of the organization unit or its Id
     * @param {admin(directory_v1).OrgUnit} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits/{orgUnitPath}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customerId', 'orgUnitPath'],
        pathParams: ['customerId', 'orgUnitPath'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.orgunits.update
     *
     * @desc Update Organization Unit
     *
     * @alias directory.orgunits.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.orgUnitPath Full path of the organization unit or its Id
     * @param {admin(directory_v1).OrgUnit} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/orgunits/{orgUnitPath}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customerId', 'orgUnitPath'],
        pathParams: ['customerId', 'orgUnitPath'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.privileges = {

    /**
     * directory.privileges.list
     *
     * @desc Retrieves a paginated list of all privileges for a customer.
     *
     * @alias directory.privileges.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles/ALL/privileges',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.resources = {

    calendars: {

      /**
       * directory.resources.calendars.delete
       *
       * @desc Deletes a calendar resource.
       *
       * @alias directory.resources.calendars.delete
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.calendarResourceId The unique ID of the calendar resource to delete.
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars/{calendarResourceId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['customer', 'calendarResourceId'],
          pathParams: ['calendarResourceId', 'customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.resources.calendars.get
       *
       * @desc Retrieves a calendar resource.
       *
       * @alias directory.resources.calendars.get
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.calendarResourceId The unique ID of the calendar resource to retrieve.
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars/{calendarResourceId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['customer', 'calendarResourceId'],
          pathParams: ['calendarResourceId', 'customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.resources.calendars.insert
       *
       * @desc Inserts a calendar resource.
       *
       * @alias directory.resources.calendars.insert
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
       * @param {admin(directory_v1).CalendarResource} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['customer'],
          pathParams: ['customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.resources.calendars.list
       *
       * @desc Retrieves a list of calendar resources for an account.
       *
       * @alias directory.resources.calendars.list
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
       * @param {integer=} params.maxResults Maximum number of results to return.
       * @param {string=} params.pageToken Token to specify the next page in the list.
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['customer'],
          pathParams: ['customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.resources.calendars.patch
       *
       * @desc Updates a calendar resource. This method supports patch semantics.
       *
       * @alias directory.resources.calendars.patch
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.calendarResourceId The unique ID of the calendar resource to update.
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
       * @param {admin(directory_v1).CalendarResource} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars/{calendarResourceId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['customer', 'calendarResourceId'],
          pathParams: ['calendarResourceId', 'customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.resources.calendars.update
       *
       * @desc Updates a calendar resource.
       *
       * @alias directory.resources.calendars.update
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.calendarResourceId The unique ID of the calendar resource to update.
       * @param {string} params.customer The unique ID for the customer's Google account. As an account administrator, you can also use the my_customer alias to represent your account's customer ID.
       * @param {admin(directory_v1).CalendarResource} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/resources/calendars/{calendarResourceId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['customer', 'calendarResourceId'],
          pathParams: ['calendarResourceId', 'customer'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.roleAssignments = {

    /**
     * directory.roleAssignments.delete
     *
     * @desc Deletes a role assignment.
     *
     * @alias directory.roleAssignments.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleAssignmentId Immutable ID of the role assignment.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roleassignments/{roleAssignmentId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleAssignmentId'],
        pathParams: ['customer', 'roleAssignmentId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roleAssignments.get
     *
     * @desc Retrieve a role assignment.
     *
     * @alias directory.roleAssignments.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleAssignmentId Immutable ID of the role assignment.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roleassignments/{roleAssignmentId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleAssignmentId'],
        pathParams: ['customer', 'roleAssignmentId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roleAssignments.insert
     *
     * @desc Creates a role assignment.
     *
     * @alias directory.roleAssignments.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {admin(directory_v1).RoleAssignment} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roleassignments',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roleAssignments.list
     *
     * @desc Retrieves a paginated list of all roleAssignments.
     *
     * @alias directory.roleAssignments.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Token to specify the next page in the list.
     * @param {string=} params.roleId Immutable ID of a role. If included in the request, returns only role assignments containing this role ID.
     * @param {string=} params.userKey The user's primary email address, alias email address, or unique user ID. If included in the request, returns role assignments only for this user.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roleassignments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.roles = {

    /**
     * directory.roles.delete
     *
     * @desc Deletes a role.
     *
     * @alias directory.roles.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleId Immutable ID of the role.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles/{roleId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleId'],
        pathParams: ['customer', 'roleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roles.get
     *
     * @desc Retrieves a role.
     *
     * @alias directory.roles.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleId Immutable ID of the role.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles/{roleId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleId'],
        pathParams: ['customer', 'roleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roles.insert
     *
     * @desc Creates a role.
     *
     * @alias directory.roles.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {admin(directory_v1).Role} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roles.list
     *
     * @desc Retrieves a paginated list of all the roles in a domain.
     *
     * @alias directory.roles.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable id of the Google Apps account.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Token to specify the next page in the list.
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customer'],
        pathParams: ['customer'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roles.patch
     *
     * @desc Updates a role. This method supports patch semantics.
     *
     * @alias directory.roles.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleId Immutable ID of the role.
     * @param {admin(directory_v1).Role} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles/{roleId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleId'],
        pathParams: ['customer', 'roleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.roles.update
     *
     * @desc Updates a role.
     *
     * @alias directory.roles.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customer Immutable ID of the Google Apps account.
     * @param {string} params.roleId Immutable ID of the role.
     * @param {admin(directory_v1).Role} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customer}/roles/{roleId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customer', 'roleId'],
        pathParams: ['customer', 'roleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.schemas = {

    /**
     * directory.schemas.delete
     *
     * @desc Delete schema
     *
     * @alias directory.schemas.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.schemaKey Name or immutable Id of the schema
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas/{schemaKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customerId', 'schemaKey'],
        pathParams: ['customerId', 'schemaKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.schemas.get
     *
     * @desc Retrieve schema
     *
     * @alias directory.schemas.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.schemaKey Name or immutable Id of the schema
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas/{schemaKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId', 'schemaKey'],
        pathParams: ['customerId', 'schemaKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.schemas.insert
     *
     * @desc Create schema.
     *
     * @alias directory.schemas.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {admin(directory_v1).Schema} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.schemas.list
     *
     * @desc Retrieve all schemas for a customer
     *
     * @alias directory.schemas.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.schemas.patch
     *
     * @desc Update schema. This method supports patch semantics.
     *
     * @alias directory.schemas.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.schemaKey Name or immutable Id of the schema.
     * @param {admin(directory_v1).Schema} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas/{schemaKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customerId', 'schemaKey'],
        pathParams: ['customerId', 'schemaKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.schemas.update
     *
     * @desc Update schema
     *
     * @alias directory.schemas.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Immutable id of the Google Apps account
     * @param {string} params.schemaKey Name or immutable Id of the schema.
     * @param {admin(directory_v1).Schema} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/customer/{customerId}/schemas/{schemaKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customerId', 'schemaKey'],
        pathParams: ['customerId', 'schemaKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.tokens = {

    /**
     * directory.tokens.delete
     *
     * @desc Delete all access tokens issued by a user for an application.
     *
     * @alias directory.tokens.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clientId The Client ID of the application the token is issued to.
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/tokens/{clientId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['userKey', 'clientId'],
        pathParams: ['clientId', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.tokens.get
     *
     * @desc Get information about an access token issued by a user.
     *
     * @alias directory.tokens.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clientId The Client ID of the application the token is issued to.
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/tokens/{clientId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey', 'clientId'],
        pathParams: ['clientId', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.tokens.list
     *
     * @desc Returns the set of tokens specified user has issued to 3rd party applications.
     *
     * @alias directory.tokens.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/tokens',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.users = {

    /**
     * directory.users.delete
     *
     * @desc Delete user
     *
     * @alias directory.users.delete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.get
     *
     * @desc retrieve user
     *
     * @alias directory.users.get
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customFieldMask Comma-separated list of schema names. All fields from these schemas are fetched. This should only be set when projection=custom.
     * @param {string=} params.projection What subset of fields to fetch for this user.
     * @param {string} params.userKey Email or immutable Id of the user
     * @param {string=} params.viewType Whether to fetch the ADMIN_VIEW or DOMAIN_PUBLIC view of the user.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.insert
     *
     * @desc create user.
     *
     * @alias directory.users.insert
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {admin(directory_v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/users',
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
     * directory.users.list
     *
     * @desc Retrieve either deleted users or all users in a domain (paginated)
     *
     * @alias directory.users.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.customFieldMask Comma-separated list of schema names. All fields from these schemas are fetched. This should only be set when projection=custom.
     * @param {string=} params.customer Immutable id of the Google Apps account. In case of multi-domain, to fetch all users for a customer, fill this field instead of domain.
     * @param {string=} params.domain Name of the domain. Fill this field to get users from only this domain. To return all users in a multi-domain fill customer field instead.
     * @param {string=} params.event Event on which subscription is intended (if subscribing)
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100. Max allowed is 500
     * @param {string=} params.orderBy Column to use for sorting results
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.projection What subset of fields to fetch for this user.
     * @param {string=} params.query Query string search. Should be of the form "". Complete documentation is at https://developers.google.com/admin-sdk/directory/v1/guides/search-users
     * @param {string=} params.showDeleted If set to true retrieves the list of deleted users. Default is false
     * @param {string=} params.sortOrder Whether to return results in ascending or descending order.
     * @param {string=} params.viewType Whether to fetch the ADMIN_VIEW or DOMAIN_PUBLIC view of the user.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users',
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
     * directory.users.makeAdmin
     *
     * @desc change admin status of a user
     *
     * @alias directory.users.makeAdmin
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user as admin
     * @param {admin(directory_v1).UserMakeAdmin} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    makeAdmin: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/makeAdmin',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.patch
     *
     * @desc update user. This method supports patch semantics.
     *
     * @alias directory.users.patch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user. If Id, it should match with id of user object
     * @param {admin(directory_v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.undelete
     *
     * @desc Undelete a deleted user
     *
     * @alias directory.users.undelete
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey The immutable id of the user
     * @param {admin(directory_v1).UserUndelete} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    undelete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/undelete',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.update
     *
     * @desc update user
     *
     * @alias directory.users.update
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user. If Id, it should match with id of user object
     * @param {admin(directory_v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.users.watch
     *
     * @desc Watch for changes in users list
     *
     * @alias directory.users.watch
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customFieldMask Comma-separated list of schema names. All fields from these schemas are fetched. This should only be set when projection=custom.
     * @param {string=} params.customer Immutable id of the Google Apps account. In case of multi-domain, to fetch all users for a customer, fill this field instead of domain.
     * @param {string=} params.domain Name of the domain. Fill this field to get users from only this domain. To return all users in a multi-domain fill customer field instead.
     * @param {string=} params.event Event on which subscription is intended (if subscribing)
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100. Max allowed is 500
     * @param {string=} params.orderBy Column to use for sorting results
     * @param {string=} params.pageToken Token to specify next page in the list
     * @param {string=} params.projection What subset of fields to fetch for this user.
     * @param {string=} params.query Query string search. Should be of the form "". Complete documentation is at https://developers.google.com/admin-sdk/directory/v1/guides/search-users
     * @param {string=} params.showDeleted If set to true retrieves the list of deleted users. Default is false
     * @param {string=} params.sortOrder Whether to return results in ascending or descending order.
     * @param {string=} params.viewType Whether to fetch the ADMIN_VIEW or DOMAIN_PUBLIC view of the user.
     * @param {admin(directory_v1).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/users/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    aliases: {

      /**
       * directory.users.aliases.delete
       *
       * @desc Remove a alias for the user
       *
       * @alias directory.users.aliases.delete
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.alias The alias to be removed
       * @param {string} params.userKey Email or immutable Id of the user
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/aliases/{alias}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userKey', 'alias'],
          pathParams: ['alias', 'userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.aliases.insert
       *
       * @desc Add a alias for the user
       *
       * @alias directory.users.aliases.insert
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userKey Email or immutable Id of the user
       * @param {admin(directory_v1).Alias} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/aliases',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.aliases.list
       *
       * @desc List all aliases for a user
       *
       * @alias directory.users.aliases.list
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.event Event on which subscription is intended (if subscribing)
       * @param {string} params.userKey Email or immutable Id of the user
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/aliases',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.aliases.watch
       *
       * @desc Watch for changes in user aliases list
       *
       * @alias directory.users.aliases.watch
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.event Event on which subscription is intended (if subscribing)
       * @param {string} params.userKey Email or immutable Id of the user
       * @param {admin(directory_v1).Channel} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      watch: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/aliases/watch',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    photos: {

      /**
       * directory.users.photos.delete
       *
       * @desc Remove photos for the user
       *
       * @alias directory.users.photos.delete
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userKey Email or immutable Id of the user
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/photos/thumbnail',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.photos.get
       *
       * @desc Retrieve photo of a user
       *
       * @alias directory.users.photos.get
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userKey Email or immutable Id of the user
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/photos/thumbnail',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.photos.patch
       *
       * @desc Add a photo for the user. This method supports patch semantics.
       *
       * @alias directory.users.photos.patch
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userKey Email or immutable Id of the user
       * @param {admin(directory_v1).UserPhoto} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/photos/thumbnail',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * directory.users.photos.update
       *
       * @desc Add a photo for the user
       *
       * @alias directory.users.photos.update
       * @memberOf! admin(directory_v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userKey Email or immutable Id of the user
       * @param {admin(directory_v1).UserPhoto} params.resource Request body data
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
            url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/photos/thumbnail',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userKey'],
          pathParams: ['userKey'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.verificationCodes = {

    /**
     * directory.verificationCodes.generate
     *
     * @desc Generate new backup verification codes for the user.
     *
     * @alias directory.verificationCodes.generate
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/verificationCodes/generate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.verificationCodes.invalidate
     *
     * @desc Invalidate the current backup verification codes for the user.
     *
     * @alias directory.verificationCodes.invalidate
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Email or immutable Id of the user
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    invalidate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/verificationCodes/invalidate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * directory.verificationCodes.list
     *
     * @desc Returns the current set of valid backup verification codes for the specified user.
     *
     * @alias directory.verificationCodes.list
     * @memberOf! admin(directory_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userKey Identifies the user in the API request. The value can be the user's primary email address, alias email address, or unique user ID.
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
          url: 'https://www.googleapis.com/admin/directory/v1/users/{userKey}/verificationCodes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey'],
        pathParams: ['userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Alias
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} alias A alias email
 * @property {string} etag ETag of the resource.
 * @property {string} id Unique id of the group (Read-only) Unique id of the user (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} primaryEmail Group&#39;s primary email (Read-only) User&#39;s primary email (Read-only)
 */
/**
 * @typedef Aliases
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {any[]} aliases List of alias objects.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 */
/**
 * @typedef Asp
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {integer} codeId The unique ID of the ASP.
 * @property {string} creationTime The time when the ASP was created. Expressed in Unix time format.
 * @property {string} etag ETag of the ASP.
 * @property {string} kind The type of the API resource. This is always admin#directory#asp.
 * @property {string} lastTimeUsed The time when the ASP was last used. Expressed in Unix time format.
 * @property {string} name The name of the application that the user, represented by their userId, entered when the ASP was created.
 * @property {string} userKey The unique ID of the user who issued the ASP.
 */
/**
 * @typedef Asps
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Asp[]} items A list of ASP resources.
 * @property {string} kind The type of the API resource. This is always admin#directory#aspList.
 */
/**
 * @typedef CalendarResource
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etags ETag of the resource.
 * @property {string} kind The type of the resource. For calendar resources, the value is admin#directory#resources#calendars#CalendarResource.
 * @property {string} resourceDescription The brief description of the calendar resource.
 * @property {string} resourceEmail The read-only email ID for the calendar resource. Generated as part of creating a new calendar resource.
 * @property {string} resourceId The unique ID for the calendar resource.
 * @property {string} resourceName The name of the calendar resource. For example, Training Room 1A
 * @property {string} resourceType The type of the calendar resource. Used for grouping resources in the calendar user interface.
 */
/**
 * @typedef CalendarResources
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).CalendarResource[]} items The CalendarResources in this page of results.
 * @property {string} kind Identifies this as a collection of CalendarResources. This is always admin#directory#resources#calendars#calendarResourcesList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef Channel
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} address The address where notifications are delivered for this channel.
 * @property {string} expiration Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.
 * @property {string} id A UUID or similar unique string that identifies this channel.
 * @property {string} kind Identifies this as a notification channel used to watch for changes to a resource. Value: the fixed string &quot;api#channel&quot;.
 * @property {object} params Additional parameters controlling delivery channel behavior. Optional.
 * @property {boolean} payload A Boolean value to indicate whether payload is wanted. Optional.
 * @property {string} resourceId An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.
 * @property {string} resourceUri A version-specific identifier for the watched resource.
 * @property {string} token An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
 * @property {string} type The type of delivery mechanism used for this channel.
 */
/**
 * @typedef ChromeOsDevice
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {object[]} activeTimeRanges List of active time ranges (Read-only)
 * @property {string} annotatedAssetId AssetId specified during enrollment or through later annotation
 * @property {string} annotatedLocation Address or location of the device as noted by the administrator
 * @property {string} annotatedUser User of the device
 * @property {string} bootMode Chromebook boot mode (Read-only)
 * @property {string} deviceId Unique identifier of Chrome OS Device (Read-only)
 * @property {string} etag ETag of the resource.
 * @property {string} ethernetMacAddress Chromebook Mac Address on ethernet network interface (Read-only)
 * @property {string} firmwareVersion Chromebook firmware version (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} lastEnrollmentTime Date and time the device was last enrolled (Read-only)
 * @property {string} lastSync Date and time the device was last synchronized with the policy settings in the Google Apps administrator control panel (Read-only)
 * @property {string} macAddress Chromebook Mac Address on wifi network interface (Read-only)
 * @property {string} meid Mobile Equipment identifier for the 3G mobile card in the Chromebook (Read-only)
 * @property {string} model Chromebook Model (Read-only)
 * @property {string} notes Notes added by the administrator
 * @property {string} orderNumber Chromebook order number (Read-only)
 * @property {string} orgUnitPath OrgUnit of the device
 * @property {string} osVersion Chromebook Os Version (Read-only)
 * @property {string} platformVersion Chromebook platform version (Read-only)
 * @property {object[]} recentUsers List of recent device users, in descending order by last login time (Read-only)
 * @property {string} serialNumber Chromebook serial number (Read-only)
 * @property {string} status status of the device (Read-only)
 * @property {string} supportEndDate Final date the device will be supported (Read-only)
 * @property {boolean} willAutoRenew Will Chromebook auto renew after support end date (Read-only)
 */
/**
 * @typedef ChromeOsDeviceAction
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} action Action to be taken on the ChromeOs Device
 * @property {string} deprovisionReason 
 */
/**
 * @typedef ChromeOsDevices
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {admin(directory_v1).ChromeOsDevice[]} chromeosdevices List of Chrome OS Device objects.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {string} nextPageToken Token used to access next page of this result.
 */
/**
 * @typedef Customer
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} alternateEmail The customer&#39;s secondary contact email address. This email address cannot be on the same domain as the customerDomain
 * @property {string} customerCreationTime The customer&#39;s creation time (Readonly)
 * @property {string} customerDomain The customer&#39;s primary domain name string. Do not include the www prefix when creating a new customer.
 * @property {string} etag ETag of the resource.
 * @property {string} id The unique ID for the customer&#39;s Google account. (Readonly)
 * @property {string} kind Identifies the resource as a customer. Value: admin#directory#customer
 * @property {string} language The customer&#39;s ISO 639-2 language code. The default value is en-US
 * @property {string} phoneNumber The customer&#39;s contact phone number in E.164 format.
 * @property {admin(directory_v1).CustomerPostalAddress} postalAddress The customer&#39;s postal address information.
 */
/**
 * @typedef CustomerPostalAddress
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} addressLine1 A customer&#39;s physical address. The address can be composed of one to three lines.
 * @property {string} addressLine2 Address line 2 of the address.
 * @property {string} addressLine3 Address line 3 of the address.
 * @property {string} contactName The customer contact&#39;s name.
 * @property {string} countryCode This is a required property. For countryCode information see the ISO 3166 country code elements.
 * @property {string} locality Name of the locality. An example of a locality value is the city of San Francisco.
 * @property {string} organizationName The company or company division name.
 * @property {string} postalCode The postal code. A postalCode example is a postal zip code such as 10009. This is in accordance with - http://portablecontacts.net/draft-spec.html#address_element.
 * @property {string} region Name of the region. An example of a region value is NY for the state of New York.
 */
/**
 * @typedef DomainAlias
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} creationTime The creation time of the domain alias. (Read-only).
 * @property {string} domainAliasName The domain alias name.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {string} parentDomainName The parent domain name that the domain alias is associated with. This can either be a primary or secondary domain name within a customer.
 * @property {boolean} verified Indicates the verification state of a domain alias. (Read-only)
 */
/**
 * @typedef DomainAliases
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {admin(directory_v1).DomainAlias[]} domainAliases List of domain alias objects.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 */
/**
 * @typedef Domains
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} creationTime Creation time of the domain. (Read-only).
 * @property {admin(directory_v1).DomainAlias[]} domainAliases List of domain alias objects. (Read-only)
 * @property {string} domainName The domain name of the customer.
 * @property {string} etag ETag of the resource.
 * @property {boolean} isPrimary Indicates if the domain is a primary domain (Read-only).
 * @property {string} kind Kind of resource this is.
 * @property {boolean} verified Indicates the verification state of a domain. (Read-only).
 */
/**
 * @typedef Domains2
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {admin(directory_v1).Domains[]} domains List of domain objects.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 */
/**
 * @typedef Group
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {boolean} adminCreated Is the group created by admin (Read-only) *
 * @property {string[]} aliases List of aliases (Read-only)
 * @property {string} description Description of the group
 * @property {string} directMembersCount Group direct members count
 * @property {string} email Email of Group
 * @property {string} etag ETag of the resource.
 * @property {string} id Unique identifier of Group (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} name Group name
 * @property {string[]} nonEditableAliases List of non editable aliases (Read-only)
 */
/**
 * @typedef Groups
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Group[]} groups List of group objects.
 * @property {string} kind Kind of resource this is.
 * @property {string} nextPageToken Token used to access next page of this result.
 */
/**
 * @typedef Member
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} email Email of member (Read-only)
 * @property {string} etag ETag of the resource.
 * @property {string} id Unique identifier of customer member (Read-only) Unique identifier of group (Read-only) Unique identifier of member (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} role Role of member
 * @property {string} status Status of member (Immutable)
 * @property {string} type Type of member (Immutable)
 */
/**
 * @typedef Members
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {admin(directory_v1).Member[]} members List of member objects.
 * @property {string} nextPageToken Token used to access next page of this result.
 */
/**
 * @typedef MobileDevice
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {boolean} adbStatus Adb (USB debugging) enabled or disabled on device (Read-only)
 * @property {object[]} applications List of applications installed on Mobile Device
 * @property {string} basebandVersion Mobile Device Baseband version (Read-only)
 * @property {string} bootloaderVersion Mobile Device Bootloader version (Read-only)
 * @property {string} brand Mobile Device Brand (Read-only)
 * @property {string} buildNumber Mobile Device Build number (Read-only)
 * @property {string} defaultLanguage The default locale used on the Mobile Device (Read-only)
 * @property {boolean} developerOptionsStatus Developer options enabled or disabled on device (Read-only)
 * @property {string} deviceCompromisedStatus Mobile Device compromised status (Read-only)
 * @property {string} deviceId Mobile Device serial number (Read-only)
 * @property {string} devicePasswordStatus DevicePasswordStatus (Read-only)
 * @property {string[]} email List of owner user&#39;s email addresses (Read-only)
 * @property {string} encryptionStatus Mobile Device Encryption Status (Read-only)
 * @property {string} etag ETag of the resource.
 * @property {string} firstSync Date and time the device was first synchronized with the policy settings in the Google Apps administrator control panel (Read-only)
 * @property {string} hardware Mobile Device Hardware (Read-only)
 * @property {string} hardwareId Mobile Device Hardware Id (Read-only)
 * @property {string} imei Mobile Device IMEI number (Read-only)
 * @property {string} kernelVersion Mobile Device Kernel version (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} lastSync Date and time the device was last synchronized with the policy settings in the Google Apps administrator control panel (Read-only)
 * @property {boolean} managedAccountIsOnOwnerProfile Boolean indicating if this account is on owner/primary profile or not (Read-only)
 * @property {string} manufacturer Mobile Device manufacturer (Read-only)
 * @property {string} meid Mobile Device MEID number (Read-only)
 * @property {string} model Name of the model of the device
 * @property {string[]} name List of owner user&#39;s names (Read-only)
 * @property {string} networkOperator Mobile Device mobile or network operator (if available) (Read-only)
 * @property {string} os Name of the mobile operating system
 * @property {string[]} otherAccountsInfo List of accounts added on device (Read-only)
 * @property {string} privilege DMAgentPermission (Read-only)
 * @property {string} releaseVersion Mobile Device release version version (Read-only)
 * @property {string} resourceId Unique identifier of Mobile Device (Read-only)
 * @property {string} securityPatchLevel Mobile Device Security patch level (Read-only)
 * @property {string} serialNumber Mobile Device SSN or Serial Number (Read-only)
 * @property {string} status Status of the device (Read-only)
 * @property {boolean} supportsWorkProfile Work profile supported on device (Read-only)
 * @property {string} type The type of device (Read-only)
 * @property {boolean} unknownSourcesStatus Unknown sources enabled or disabled on device (Read-only)
 * @property {string} userAgent Mobile Device user agent
 * @property {string} wifiMacAddress Mobile Device WiFi MAC address (Read-only)
 */
/**
 * @typedef MobileDeviceAction
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} action Action to be taken on the Mobile Device
 */
/**
 * @typedef MobileDevices
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {admin(directory_v1).MobileDevice[]} mobiledevices List of Mobile Device objects.
 * @property {string} nextPageToken Token used to access next page of this result.
 */
/**
 * @typedef Notification
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} body Body of the notification (Read-only)
 * @property {string} etag ETag of the resource.
 * @property {string} fromAddress Address from which the notification is received (Read-only)
 * @property {boolean} isUnread Boolean indicating whether the notification is unread or not.
 * @property {string} kind The type of the resource.
 * @property {string} notificationId 
 * @property {string} sendTime Time at which notification was sent (Read-only)
 * @property {string} subject Subject of the notification (Read-only)
 */
/**
 * @typedef Notifications
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Notification[]} items List of notifications in this page.
 * @property {string} kind The type of the resource.
 * @property {string} nextPageToken Token for fetching the next page of notifications.
 * @property {integer} unreadNotificationsCount Number of unread notification for the domain.
 */
/**
 * @typedef OrgUnit
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {boolean} blockInheritance Should block inheritance
 * @property {string} description Description of OrgUnit
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {string} name Name of OrgUnit
 * @property {string} orgUnitId Id of OrgUnit
 * @property {string} orgUnitPath Path of OrgUnit
 * @property {string} parentOrgUnitId Id of parent OrgUnit
 * @property {string} parentOrgUnitPath Path of parent OrgUnit
 */
/**
 * @typedef OrgUnits
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {admin(directory_v1).OrgUnit[]} organizationUnits List of user objects.
 */
/**
 * @typedef Privilege
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {admin(directory_v1).Privilege[]} childPrivileges A list of child privileges. Privileges for a service form a tree. Each privilege can have a list of child privileges; this list is empty for a leaf privilege.
 * @property {string} etag ETag of the resource.
 * @property {boolean} isOuScopable If the privilege can be restricted to an organization unit.
 * @property {string} kind The type of the API resource. This is always admin#directory#privilege.
 * @property {string} privilegeName The name of the privilege.
 * @property {string} serviceId The obfuscated ID of the service this privilege is for.
 * @property {string} serviceName The name of the service this privilege is for.
 */
/**
 * @typedef Privileges
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Privilege[]} items A list of Privilege resources.
 * @property {string} kind The type of the API resource. This is always admin#directory#privileges.
 */
/**
 * @typedef Role
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {boolean} isSuperAdminRole Returns true if the role is a super admin role.
 * @property {boolean} isSystemRole Returns true if this is a pre-defined system role.
 * @property {string} kind The type of the API resource. This is always admin#directory#role.
 * @property {string} roleDescription A short description of the role.
 * @property {string} roleId ID of the role.
 * @property {string} roleName Name of the role.
 * @property {object[]} rolePrivileges The set of privileges that are granted to this role.
 */
/**
 * @typedef RoleAssignment
 * @memberOf! admin(directory_v1)
 * @type object
* @property {string} assignedTo The unique ID of the user this role is assigned to.
* @property {string} etag ETag of the resource.
* @property {string} kind The type of the API resource. This is always admin#directory#roleAssignment.
* @property {string} orgUnitId If the role is restricted to an organization unit, this contains the ID for the organization unit the exercise of this role is restricted to.
* @property {string} roleAssignmentId ID of this roleAssignment.
* @property {string} roleId The ID of the role that is assigned.
* @property {string} scopeType The scope in which this role is assigned. Possible values are: 
- CUSTOMER
- ORG_UNIT
*/
/**
 * @typedef RoleAssignments
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).RoleAssignment[]} items A list of RoleAssignment resources.
 * @property {string} kind The type of the API resource. This is always admin#directory#roleAssignments.
 * @property {string} nextPageToken 
 */
/**
 * @typedef Roles
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Role[]} items A list of Role resources.
 * @property {string} kind The type of the API resource. This is always admin#directory#roles.
 * @property {string} nextPageToken 
 */
/**
 * @typedef Schema
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).SchemaFieldSpec[]} fields Fields of Schema
 * @property {string} kind Kind of resource this is.
 * @property {string} schemaId Unique identifier of Schema (Read-only)
 * @property {string} schemaName Schema name
 */
/**
 * @typedef SchemaFieldSpec
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} fieldId Unique identifier of Field (Read-only)
 * @property {string} fieldName Name of the field.
 * @property {string} fieldType Type of the field.
 * @property {boolean} indexed Boolean specifying whether the field is indexed or not.
 * @property {string} kind Kind of resource this is.
 * @property {boolean} multiValued Boolean specifying whether this is a multi-valued field or not.
 * @property {object} numericIndexingSpec Indexing spec for a numeric field. By default, only exact match queries will be supported for numeric fields. Setting the numericIndexingSpec allows range queries to be supported.
 * @property {string} readAccessType Read ACLs on the field specifying who can view values of this field. Valid values are &quot;ALL_DOMAIN_USERS&quot; and &quot;ADMINS_AND_SELF&quot;.
 */
/**
 * @typedef Schemas
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {admin(directory_v1).Schema[]} schemas List of UserSchema objects.
 */
/**
 * @typedef Token
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {boolean} anonymous Whether the application is registered with Google. The value is true if the application has an anonymous Client ID.
 * @property {string} clientId The Client ID of the application the token is issued to.
 * @property {string} displayText The displayable name of the application the token is issued to.
 * @property {string} etag ETag of the resource.
 * @property {string} kind The type of the API resource. This is always admin#directory#token.
 * @property {boolean} nativeApp Whether the token is issued to an installed application. The value is true if the application is installed to a desktop or mobile device.
 * @property {string[]} scopes A list of authorization scopes the application is granted.
 * @property {string} userKey The unique ID of the user that issued the token.
 */
/**
 * @typedef Tokens
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).Token[]} items A list of Token resources.
 * @property {string} kind The type of the API resource. This is always admin#directory#tokenList.
 */
/**
 * @typedef User
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {any} addresses 
 * @property {boolean} agreedToTerms Indicates if user has agreed to terms (Read-only)
 * @property {string[]} aliases List of aliases (Read-only)
 * @property {boolean} changePasswordAtNextLogin Boolean indicating if the user should change password in next login
 * @property {string} creationTime User&#39;s Google account creation time. (Read-only)
 * @property {object} customSchemas Custom fields of the user.
 * @property {string} customerId CustomerId of User (Read-only)
 * @property {string} deletionTime 
 * @property {any} emails 
 * @property {string} etag ETag of the resource.
 * @property {any} externalIds 
 * @property {string} hashFunction Hash function name for password. Supported are MD5, SHA-1 and crypt
 * @property {string} id Unique identifier of User (Read-only)
 * @property {any} ims 
 * @property {boolean} includeInGlobalAddressList Boolean indicating if user is included in Global Address List
 * @property {boolean} ipWhitelisted Boolean indicating if ip is whitelisted
 * @property {boolean} isAdmin Boolean indicating if the user is admin (Read-only)
 * @property {boolean} isDelegatedAdmin Boolean indicating if the user is delegated admin (Read-only)
 * @property {boolean} isMailboxSetup Is mailbox setup (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} lastLoginTime User&#39;s last login time. (Read-only)
 * @property {admin(directory_v1).UserName} name User&#39;s name
 * @property {string[]} nonEditableAliases List of non editable aliases (Read-only)
 * @property {any} notes 
 * @property {string} orgUnitPath OrgUnit of User
 * @property {any} organizations 
 * @property {string} password User&#39;s password
 * @property {any} phones 
 * @property {string} primaryEmail username of User
 * @property {any} relations 
 * @property {boolean} suspended Indicates if user is suspended
 * @property {string} suspensionReason Suspension reason if user is suspended (Read-only)
 * @property {string} thumbnailPhotoEtag ETag of the user&#39;s photo (Read-only)
 * @property {string} thumbnailPhotoUrl Photo Url of the user (Read-only)
 * @property {any} websites 
 */
/**
 * @typedef UserAbout
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} contentType About entry can have a type which indicates the content type. It can either be plain or html. By default, notes contents are assumed to contain plain text.
 * @property {string} value Actual value of notes.
 */
/**
 * @typedef UserAddress
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} country Country.
 * @property {string} countryCode Country code.
 * @property {string} customType Custom type.
 * @property {string} extendedAddress Extended Address.
 * @property {string} formatted Formatted address.
 * @property {string} locality Locality.
 * @property {string} poBox Other parts of address.
 * @property {string} postalCode Postal code.
 * @property {boolean} primary If this is user&#39;s primary address. Only one entry could be marked as primary.
 * @property {string} region Region.
 * @property {boolean} sourceIsStructured User supplied address was structured. Structured addresses are NOT supported at this time. You might be able to write structured addresses, but any values will eventually be clobbered.
 * @property {string} streetAddress Street.
 * @property {string} type Each entry can have a type which indicates standard values of that entry. For example address could be of home, work etc. In addition to the standard type, an entry can have a custom type and can take any value. Such type should have the CUSTOM value as type and also have a customType value.
 */
/**
 * @typedef UserCustomProperties
 * @memberOf! admin(directory_v1)
 * @type object
 */
/**
 * @typedef UserEmail
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} address Email id of the user.
 * @property {string} customType Custom Type.
 * @property {boolean} primary If this is user&#39;s primary email. Only one entry could be marked as primary.
 * @property {string} type Each entry can have a type which indicates standard types of that entry. For example email could be of home, work etc. In addition to the standard type, an entry can have a custom type and can take any value Such types should have the CUSTOM value as type and also have a customType value.
 */
/**
 * @typedef UserExternalId
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} customType Custom type.
 * @property {string} type The type of the Id.
 * @property {string} value The value of the id.
 */
/**
 * @typedef UserIm
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} customProtocol Custom protocol.
 * @property {string} customType Custom type.
 * @property {string} im Instant messenger id.
 * @property {boolean} primary If this is user&#39;s primary im. Only one entry could be marked as primary.
 * @property {string} protocol Protocol used in the instant messenger. It should be one of the values from ImProtocolTypes map. Similar to type, it can take a CUSTOM value and specify the custom name in customProtocol field.
 * @property {string} type Each entry can have a type which indicates standard types of that entry. For example instant messengers could be of home, work etc. In addition to the standard type, an entry can have a custom type and can take any value. Such types should have the CUSTOM value as type and also have a customType value.
 */
/**
 * @typedef UserMakeAdmin
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {boolean} status Boolean indicating new admin status of the user
 */
/**
 * @typedef UserName
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} familyName Last Name
 * @property {string} fullName Full Name
 * @property {string} givenName First Name
 */
/**
 * @typedef UserOrganization
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} costCenter The cost center of the users department.
 * @property {string} customType Custom type.
 * @property {string} department Department within the organization.
 * @property {string} description Description of the organization.
 * @property {string} domain The domain to which the organization belongs to.
 * @property {string} location Location of the organization. This need not be fully qualified address.
 * @property {string} name Name of the organization
 * @property {boolean} primary If it user&#39;s primary organization.
 * @property {string} symbol Symbol of the organization.
 * @property {string} title Title (designation) of the user in the organization.
 * @property {string} type Each entry can have a type which indicates standard types of that entry. For example organization could be of school, work etc. In addition to the standard type, an entry can have a custom type and can give it any name. Such types should have the CUSTOM value as type and also have a CustomType value.
 */
/**
 * @typedef UserPhone
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} customType Custom Type.
 * @property {boolean} primary If this is user&#39;s primary phone or not.
 * @property {string} type Each entry can have a type which indicates standard types of that entry. For example phone could be of home_fax, work, mobile etc. In addition to the standard type, an entry can have a custom type and can give it any name. Such types should have the CUSTOM value as type and also have a customType value.
 * @property {string} value Phone number.
 */
/**
 * @typedef UserPhoto
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {integer} height Height in pixels of the photo
 * @property {string} id Unique identifier of User (Read-only)
 * @property {string} kind Kind of resource this is.
 * @property {string} mimeType Mime Type of the photo
 * @property {string} photoData Base64 encoded photo data
 * @property {string} primaryEmail Primary email of User (Read-only)
 * @property {integer} width Width in pixels of the photo
 */
/**
 * @typedef UserRelation
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} customType Custom Type.
 * @property {string} type The relation of the user. Some of the possible values are mother, father, sister, brother, manager, assistant, partner.
 * @property {string} value The name of the relation.
 */
/**
 * @typedef UserUndelete
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} orgUnitPath OrgUnit of User
 */
/**
 * @typedef UserWebsite
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} customType Custom Type.
 * @property {boolean} primary If this is user&#39;s primary website or not.
 * @property {string} type Each entry can have a type which indicates standard types of that entry. For example website could be of home, work, blog etc. In addition to the standard type, an entry can have a custom type and can give it any name. Such types should have the CUSTOM value as type and also have a customType value.
 * @property {string} value Website.
 */
/**
 * @typedef Users
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind Kind of resource this is.
 * @property {string} nextPageToken Token used to access next page of this result.
 * @property {string} trigger_event Event that triggered this response (only used in case of Push Response)
 * @property {admin(directory_v1).User[]} users List of user objects.
 */
/**
 * @typedef VerificationCode
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind The type of the resource. This is always admin#directory#verificationCode.
 * @property {string} userId The obfuscated unique ID of the user.
 * @property {string} verificationCode A current verification code for the user. Invalidated or used verification codes are not returned as part of the result.
 */
/**
 * @typedef VerificationCodes
 * @memberOf! admin(directory_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(directory_v1).VerificationCode[]} items A list of verification code resources.
 * @property {string} kind The type of the resource. This is always admin#directory#verificationCodesList.
 */
module.exports = Admin;
