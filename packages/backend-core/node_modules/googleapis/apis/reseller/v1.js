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
 * Enterprise Apps Reseller API
 *
 * Creates and manages your customers and their subscriptions.
 *
 * @example
 * var google = require('googleapis');
 * var reseller = google.reseller('v1');
 *
 * @namespace reseller
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Reseller
 */
function Reseller(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.customers = {

    /**
     * reseller.customers.get
     *
     * @desc Gets a customer resource if one exists and is owned by the reseller.
     *
     * @alias reseller.customers.get
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}',
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
     * reseller.customers.insert
     *
     * @desc Creates a customer resource if one does not already exist.
     *
     * @alias reseller.customers.insert
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customerAuthToken An auth token needed for inserting a customer for which domain already exists. Can be generated at https://admin.google.com/TransferToken. Optional.
     * @param {reseller(v1).Customer} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers',
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
     * reseller.customers.patch
     *
     * @desc Update a customer resource if one it exists and is owned by the reseller. This method supports patch semantics.
     *
     * @alias reseller.customers.patch
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {reseller(v1).Customer} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.customers.update
     *
     * @desc Update a customer resource if one it exists and is owned by the reseller.
     *
     * @alias reseller.customers.update
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {reseller(v1).Customer} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['customerId'],
        pathParams: ['customerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.subscriptions = {

    /**
     * reseller.subscriptions.activate
     *
     * @desc Activates a subscription previously suspended by the reseller
     *
     * @alias reseller.subscriptions.activate
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    activate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/activate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.changePlan
     *
     * @desc Changes the plan of a subscription
     *
     * @alias reseller.subscriptions.changePlan
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {reseller(v1).ChangePlanRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    changePlan: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changePlan',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.changeRenewalSettings
     *
     * @desc Changes the renewal settings of a subscription
     *
     * @alias reseller.subscriptions.changeRenewalSettings
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {reseller(v1).RenewalSettings} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    changeRenewalSettings: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changeRenewalSettings',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.changeSeats
     *
     * @desc Changes the seats configuration of a subscription
     *
     * @alias reseller.subscriptions.changeSeats
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {reseller(v1).Seats} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    changeSeats: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changeSeats',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.delete
     *
     * @desc Cancels/Downgrades a subscription.
     *
     * @alias reseller.subscriptions.delete
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.deletionType Whether the subscription is to be fully cancelled or downgraded
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId', 'deletionType'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.get
     *
     * @desc Gets a subscription of the customer.
     *
     * @alias reseller.subscriptions.get
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.insert
     *
     * @desc Creates/Transfers a subscription for the customer.
     *
     * @alias reseller.subscriptions.insert
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customerAuthToken An auth token needed for transferring a subscription. Can be generated at https://www.google.com/a/cpanel/customer-domain/TransferToken. Optional.
     * @param {string} params.customerId Id of the Customer
     * @param {reseller(v1).Subscription} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions',
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
     * reseller.subscriptions.list
     *
     * @desc Lists subscriptions of a reseller, optionally filtered by a customer name prefix.
     *
     * @alias reseller.subscriptions.list
     * @memberOf! reseller(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.customerAuthToken An auth token needed if the customer is not a resold customer of this reseller. Can be generated at https://www.google.com/a/cpanel/customer-domain/TransferToken.Optional.
     * @param {string=} params.customerId Id of the Customer
     * @param {string=} params.customerNamePrefix Prefix of the customer's domain name by which the subscriptions should be filtered. Optional
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Token to specify next page in the list
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
          url: 'https://www.googleapis.com/apps/reseller/v1/subscriptions',
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
     * reseller.subscriptions.startPaidService
     *
     * @desc Starts paid service of a trial subscription
     *
     * @alias reseller.subscriptions.startPaidService
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    startPaidService: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/startPaidService',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reseller.subscriptions.suspend
     *
     * @desc Suspends an active subscription
     *
     * @alias reseller.subscriptions.suspend
     * @memberOf! reseller(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId Id of the Customer
     * @param {string} params.subscriptionId Id of the subscription, which is unique for a customer
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    suspend: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/suspend',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['customerId', 'subscriptionId'],
        pathParams: ['customerId', 'subscriptionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Address
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} addressLine1 Address line 1 of the address.
 * @property {string} addressLine2 Address line 2 of the address.
 * @property {string} addressLine3 Address line 3 of the address.
 * @property {string} contactName Name of the contact person.
 * @property {string} countryCode ISO 3166 country code.
 * @property {string} kind Identifies the resource as a customer address.
 * @property {string} locality Name of the locality. This is in accordance with - http://portablecontacts.net/draft-spec.html#address_element.
 * @property {string} organizationName Name of the organization.
 * @property {string} postalCode The postal code. This is in accordance with - http://portablecontacts.net/draft-spec.html#address_element.
 * @property {string} region Name of the region. This is in accordance with - http://portablecontacts.net/draft-spec.html#address_element.
 */
/**
 * @typedef ChangePlanRequest
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} dealCode External name of the deal code applicable for the subscription. This field is optional. If missing, the deal price plan won&#39;t be used.
 * @property {string} kind Identifies the resource as a subscription change plan request.
 * @property {string} planName Name of the plan to change to.
 * @property {string} purchaseOrderId Purchase order id for your order tracking purposes.
 * @property {reseller(v1).Seats} seats Number/Limit of seats in the new plan.
 */
/**
 * @typedef Customer
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} alternateEmail The alternate email of the customer.
 * @property {string} customerDomain The domain name of the customer.
 * @property {boolean} customerDomainVerified Whether the customer&#39;s primary domain has been verified.
 * @property {string} customerId The id of the customer.
 * @property {string} kind Identifies the resource as a customer.
 * @property {string} phoneNumber The phone number of the customer.
 * @property {reseller(v1).Address} postalAddress The postal address of the customer.
 * @property {string} resourceUiUrl Ui url for customer resource.
 */
/**
 * @typedef RenewalSettings
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} kind Identifies the resource as a subscription renewal setting.
 * @property {string} renewalType Subscription renewal type.
 */
/**
 * @typedef Seats
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} kind Identifies the resource as a subscription change plan request.
 * @property {integer} licensedNumberOfSeats Read-only field containing the current number of licensed seats for FLEXIBLE Google-Apps subscriptions and secondary subscriptions such as Google-Vault and Drive-storage.
 * @property {integer} maximumNumberOfSeats Maximum number of seats that can be purchased. This needs to be provided only for a non-commitment plan. For a commitment plan it is decided by the contract.
 * @property {integer} numberOfSeats Number of seats to purchase. This is applicable only for a commitment plan.
 */
/**
 * @typedef Subscription
 * @memberOf! reseller(v1)
 * @type object
* @property {string} billingMethod Billing method of this subscription.
* @property {string} creationTime Creation time of this subscription in milliseconds since Unix epoch.
* @property {string} customerDomain Primary domain name of the customer
* @property {string} customerId The id of the customer to whom the subscription belongs.
* @property {string} dealCode External name of the deal, if this subscription was provisioned under one. Otherwise this field will be empty.
* @property {string} kind Identifies the resource as a Subscription.
* @property {object} plan Plan details of the subscription
* @property {string} purchaseOrderId Purchase order id for your order tracking purposes.
* @property {reseller(v1).RenewalSettings} renewalSettings Renewal settings of the subscription.
* @property {string} resourceUiUrl Ui url for subscription resource.
* @property {reseller(v1).Seats} seats Number/Limit of seats in the new plan.
* @property {string} skuId Name of the sku for which this subscription is purchased.
* @property {string} status Status of the subscription.
* @property {string} subscriptionId The id of the subscription.
* @property {string[]} suspensionReasons Read-only field containing an enumerable of all the current suspension reasons for a subscription. It is possible for a subscription to have many concurrent, overlapping suspension reasons. A subscription&#39;s STATUS is SUSPENDED until all pending suspensions are removed. Possible options include:  
- PENDING_TOS_ACCEPTANCE - The customer has not logged in and accepted the Google Apps Resold Terms of Services.  
- RENEWAL_WITH_TYPE_CANCEL - The customer&#39;s commitment ended and their service was cancelled at the end of their term.  
- RESELLER_INITIATED - A manual suspension invoked by a Reseller.  
- TRIAL_ENDED - The customer&#39;s trial expired without a plan selected.  
- OTHER - The customer is suspended for an internal Google reason (e.g. abuse or otherwise).
* @property {object} transferInfo Transfer related information for the subscription.
* @property {object} trialSettings Trial Settings of the subscription.
*/
/**
 * @typedef Subscriptions
 * @memberOf! reseller(v1)
 * @type object
 * @property {string} kind Identifies the resource as a collection of subscriptions.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {reseller(v1).Subscription[]} subscriptions The subscriptions in this page of results.
 */
module.exports = Reseller;
