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
 * Ad Exchange Buyer API II
 *
 * Accesses the latest features for managing Ad Exchange accounts, Real-Time Bidding configurations and auction metrics, and Marketplace programmatic deals.
 *
 * @example
 * var google = require('googleapis');
 * var adexchangebuyer2 = google.adexchangebuyer2('v2beta1');
 *
 * @namespace adexchangebuyer2
 * @type {Function}
 * @version v2beta1
 * @variation v2beta1
 * @param {object=} options Options for Adexchangebuyer2
 */
function Adexchangebuyer2(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    clients: {

      /**
       * adexchangebuyer2.accounts.clients.update
       *
       * @desc Updates an existing client buyer.
       *
       * @alias adexchangebuyer2.accounts.clients.update
       * @memberOf! adexchangebuyer2(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.clientAccountId Unique numerical account ID of the client to update. (required)
       * @param {string} params.accountId Unique numerical account ID for the buyer of which the client buyer is a customer; the sponsor buyer to update a client for. (required)
       * @param {adexchangebuyer2(v2beta1).Client} params.resource Request body data
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
            url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'clientAccountId'],
          pathParams: ['clientAccountId', 'accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adexchangebuyer2.accounts.clients.get
       *
       * @desc Gets a client buyer with a given client account ID.
       *
       * @alias adexchangebuyer2.accounts.clients.get
       * @memberOf! adexchangebuyer2(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.clientAccountId Numerical account ID of the client buyer to retrieve. (required)
       * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
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
            url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'clientAccountId'],
          pathParams: ['clientAccountId', 'accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * adexchangebuyer2.accounts.clients.create
       *
       * @desc Creates a new client buyer.
       *
       * @alias adexchangebuyer2.accounts.clients.create
       * @memberOf! adexchangebuyer2(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId Unique numerical account ID for the buyer of which the client buyer is a customer; the sponsor buyer to create a client for. (required)
       * @param {adexchangebuyer2(v2beta1).Client} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      create: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients',
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
       * adexchangebuyer2.accounts.clients.list
       *
       * @desc Lists all the clients for the current sponsor buyer.
       *
       * @alias adexchangebuyer2.accounts.clients.list
       * @memberOf! adexchangebuyer2(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Requested page size. The server may return fewer clients than requested. If unspecified, the server will pick an appropriate default.
       * @param {string} params.accountId Unique numerical account ID of the sponsor buyer to list the clients for.
       * @param {string=} params.pageToken A token identifying a page of results the server should return. Typically, this is the value of ListClientsResponse.nextPageToken returned from the previous call to the accounts.clients.list method.
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
            url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      users: {

        /**
         * adexchangebuyer2.accounts.clients.users.update
         *
         * @desc Updates an existing client user. Only the user status can be changed on update.
         *
         * @alias adexchangebuyer2.accounts.clients.users.update
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId Numerical account ID of the client buyer that the user to be retrieved is associated with. (required)
         * @param {string} params.userId Numerical identifier of the user to retrieve. (required)
         * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
         * @param {adexchangebuyer2(v2beta1).ClientUser} params.resource Request body data
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
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users/{userId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId', 'userId'],
            pathParams: ['clientAccountId', 'userId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * adexchangebuyer2.accounts.clients.users.get
         *
         * @desc Retrieves an existing client user.
         *
         * @alias adexchangebuyer2.accounts.clients.users.get
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId Numerical account ID of the client buyer that the user to be retrieved is associated with. (required)
         * @param {string} params.userId Numerical identifier of the user to retrieve. (required)
         * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
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
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users/{userId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId', 'userId'],
            pathParams: ['clientAccountId', 'userId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * adexchangebuyer2.accounts.clients.users.list
         *
         * @desc Lists all the known client users for a specified sponsor buyer account ID.
         *
         * @alias adexchangebuyer2.accounts.clients.users.list
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId The account ID of the client buyer to list users for. (required) You must specify either a string representation of a numerical account identifier or the `-` character to list all the client users for all the clients of a given sponsor buyer.
         * @param {integer=} params.pageSize Requested page size. The server may return fewer clients than requested. If unspecified, the server will pick an appropriate default.
         * @param {string} params.accountId Numerical account ID of the sponsor buyer of the client to list users for. (required)
         * @param {string=} params.pageToken A token identifying a page of results the server should return. Typically, this is the value of ListClientUsersResponse.nextPageToken returned from the previous call to the accounts.clients.users.list method.
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
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId'],
            pathParams: ['clientAccountId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      invitations: {

        /**
         * adexchangebuyer2.accounts.clients.invitations.create
         *
         * @desc Creates and sends out an email invitation to access an Ad Exchange client buyer account.
         *
         * @alias adexchangebuyer2.accounts.clients.invitations.create
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId Numerical account ID of the client buyer that the user should be associated with. (required)
         * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
         * @param {adexchangebuyer2(v2beta1).ClientUserInvitation} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId'],
            pathParams: ['clientAccountId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * adexchangebuyer2.accounts.clients.invitations.get
         *
         * @desc Retrieves an existing client user invitation.
         *
         * @alias adexchangebuyer2.accounts.clients.invitations.get
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId Numerical account ID of the client buyer that the user invitation to be retrieved is associated with. (required)
         * @param {string} params.invitationId Numerical identifier of the user invitation to retrieve. (required)
         * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
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
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations/{invitationId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId', 'invitationId'],
            pathParams: ['clientAccountId', 'invitationId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * adexchangebuyer2.accounts.clients.invitations.list
         *
         * @desc Lists all the client users invitations for a client with a given account ID.
         *
         * @alias adexchangebuyer2.accounts.clients.invitations.list
         * @memberOf! adexchangebuyer2(v2beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.clientAccountId Numerical account ID of the client buyer to list invitations for. (required) You must either specify a string representation of a numerical account identifier or the `-` character to list all the invitations for all the clients of a given sponsor buyer.
         * @param {integer=} params.pageSize Requested page size. Server may return fewer clients than requested. If unspecified, server will pick an appropriate default.
         * @param {string} params.accountId Numerical account ID of the client's sponsor buyer. (required)
         * @param {string=} params.pageToken A token identifying a page of results the server should return. Typically, this is the value of ListClientUserInvitationsResponse.nextPageToken returned from the previous call to the clients.invitations.list method.
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
              url: 'https://adexchangebuyer.googleapis.com/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'clientAccountId'],
            pathParams: ['clientAccountId', 'accountId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };
}

/**
 * @typedef ClientUser
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {string} email User&#39;s email address. The value of this field
is ignored in an update operation.
* @property {string} clientAccountId Numerical account ID of the client buyer
with which the user is associated; the
buyer must be a client of the current sponsor buyer.
The value of this field is ignored in an update operation.
* @property {string} status The status of the client user.
* @property {string} userId The unique numerical ID of the client user
that has accepted an invitation.
The value of this field is ignored in an update operation.
*/
/**
 * @typedef ClientUserInvitation
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {string} email The email address to which the invitation is sent. Email
addresses should be unique among all client users under each sponsor
buyer.
* @property {string} clientAccountId Numerical account ID of the client buyer
that the invited user is associated with.
The value of this field is ignored in create operations.
* @property {string} invitationId The unique numerical ID of the invitation that is sent to the user.
The value of this field is ignored in create operations.
*/
/**
 * @typedef ListClientUserInvitationsResponse
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {string} nextPageToken A token to retrieve the next page of results.
Pass this value in the
ListClientUserInvitationsRequest.pageToken
field in the subsequent call to the
clients.invitations.list
method to retrieve the next
page of results.
* @property {adexchangebuyer2(v2beta1).ClientUserInvitation[]} invitations The returned list of client users.
*/
/**
 * @typedef ListClientUsersResponse
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {adexchangebuyer2(v2beta1).ClientUser[]} users The returned list of client users.
* @property {string} nextPageToken A token to retrieve the next page of results.
Pass this value in the
ListClientUsersRequest.pageToken
field in the subsequent call to the
clients.invitations.list
method to retrieve the next
page of results.
*/
/**
 * @typedef Client
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {boolean} visibleToSeller Whether the client buyer will be visible to sellers.
* @property {string} status The status of the client buyer.
* @property {string} entityType The type of the client entity: `ADVERTISER`, `BRAND`, or `AGENCY`.
* @property {string} role The role which is assigned to the client buyer. Each role implies a set of
permissions granted to the client. Must be one of `CLIENT_DEAL_VIEWER`,
`CLIENT_DEAL_NEGOTIATOR` or `CLIENT_DEAL_APPROVER`.
* @property {string} clientName Name used to represent this client to publishers.
You may have multiple clients that map to the same entity,
but for each client the combination of `clientName` and entity
must be unique.
You can specify this field as empty.
* @property {string} clientAccountId The globally-unique numerical ID of the client.
The value of this field is ignored in create and update operations.
* @property {string} entityId Numerical identifier of the client entity.
The entity can be an advertiser, a brand, or an agency.
This identifier is unique among all the entities with the same type.

A list of all known advertisers with their identifiers is available in the
[advertisers.txt](https://storage.googleapis.com/adx-rtb-dictionaries/advertisers.txt)
file.

A list of all known brands with their identifiers is available in the
[brands.txt](https://storage.googleapis.com/adx-rtb-dictionaries/brands.txt)
file.

A list of all known agencies with their identifiers is available in the
[agencies.txt](https://storage.googleapis.com/adx-rtb-dictionaries/agencies.txt)
file.
* @property {string} entityName The name of the entity. This field is automatically fetched based on
the type and ID.
The value of this field is ignored in create and update operations.
*/
/**
 * @typedef ListClientsResponse
 * @memberOf! adexchangebuyer2(v2beta1)
 * @type object
* @property {string} nextPageToken A token to retrieve the next page of results.
Pass this value in the
ListClientsRequest.pageToken
field in the subsequent call to the
accounts.clients.list method
to retrieve the next page of results.
* @property {adexchangebuyer2(v2beta1).Client[]} clients The returned list of clients.
*/
module.exports = Adexchangebuyer2;
