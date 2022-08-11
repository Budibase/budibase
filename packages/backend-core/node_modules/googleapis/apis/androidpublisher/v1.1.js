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
 * Google Play Developer API
 *
 * Lets Android application developers access their Google Play accounts.
 *
 * @example
 * var google = require('googleapis');
 * var androidpublisher = google.androidpublisher('v1.1');
 *
 * @namespace androidpublisher
 * @type {Function}
 * @version v1.1
 * @variation v1.1
 * @param {object=} options Options for Androidpublisher
 */
function Androidpublisher(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.inapppurchases = {

    /**
     * androidpublisher.inapppurchases.get
     *
     * @desc Checks the purchase and consumption status of an inapp item.
     *
     * @alias androidpublisher.inapppurchases.get
     * @memberOf! androidpublisher(v1.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName The package name of the application the inapp product was sold in (for example, 'com.some.thing').
     * @param {string} params.productId The inapp product SKU (for example, 'com.some.thing.inapp1').
     * @param {string} params.token The token provided to the user's device when the inapp product was purchased.
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
          url: 'https://www.googleapis.com/androidpublisher/v1.1/applications/{packageName}/inapp/{productId}/purchases/{token}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName', 'productId', 'token'],
        pathParams: ['packageName', 'productId', 'token'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.purchases = {

    /**
     * androidpublisher.purchases.cancel
     *
     * @desc Cancels a user's subscription purchase. The subscription remains valid until its expiration time.
     *
     * @alias androidpublisher.purchases.cancel
     * @memberOf! androidpublisher(v1.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
     * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
     * @param {string} params.token The token provided to the user's device when the subscription was purchased.
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
          url: 'https://www.googleapis.com/androidpublisher/v1.1/applications/{packageName}/subscriptions/{subscriptionId}/purchases/{token}/cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName', 'subscriptionId', 'token'],
        pathParams: ['packageName', 'subscriptionId', 'token'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.purchases.get
     *
     * @desc Checks whether a user's subscription purchase is valid and returns its expiry time.
     *
     * @alias androidpublisher.purchases.get
     * @memberOf! androidpublisher(v1.1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
     * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
     * @param {string} params.token The token provided to the user's device when the subscription was purchased.
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
          url: 'https://www.googleapis.com/androidpublisher/v1.1/applications/{packageName}/subscriptions/{subscriptionId}/purchases/{token}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName', 'subscriptionId', 'token'],
        pathParams: ['packageName', 'subscriptionId', 'token'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef InappPurchase
 * @memberOf! androidpublisher(v1.1)
 * @type object
* @property {integer} consumptionState The consumption state of the inapp product. Possible values are:  
- Yet to be consumed 
- Consumed
* @property {string} developerPayload A developer-specified string that contains supplemental information about an order.
* @property {string} kind This kind represents an inappPurchase object in the androidpublisher service.
* @property {integer} purchaseState The purchase state of the order. Possible values are:  
- Purchased 
- Cancelled
* @property {string} purchaseTime The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
*/
/**
 * @typedef SubscriptionPurchase
 * @memberOf! androidpublisher(v1.1)
 * @type object
 * @property {boolean} autoRenewing Whether the subscription will automatically be renewed when it reaches its current expiry time.
 * @property {string} initiationTimestampMsec Time at which the subscription was granted, in milliseconds since the Epoch.
 * @property {string} kind This kind represents a subscriptionPurchase object in the androidpublisher service.
 * @property {string} validUntilTimestampMsec Time at which the subscription will expire, in milliseconds since the Epoch.
 */
module.exports = Androidpublisher;
