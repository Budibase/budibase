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
 * Enterprise License Manager API
 *
 * Licensing API to view and manage license for your domain.
 *
 * @example
 * var google = require('googleapis');
 * var licensing = google.licensing('v1');
 *
 * @namespace licensing
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Licensing
 */
function Licensing(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.licenseAssignments = {

    /**
     * licensing.licenseAssignments.delete
     *
     * @desc Revoke License.
     *
     * @alias licensing.licenseAssignments.delete
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku
     * @param {string} params.userId email id or unique Id of the user
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
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/user/{userId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId', 'userId'],
        pathParams: ['productId', 'skuId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.get
     *
     * @desc Get license assignment of a particular product and sku for a user
     *
     * @alias licensing.licenseAssignments.get
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku
     * @param {string} params.userId email id or unique Id of the user
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
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/user/{userId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId', 'userId'],
        pathParams: ['productId', 'skuId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.insert
     *
     * @desc Assign License.
     *
     * @alias licensing.licenseAssignments.insert
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku
     * @param {licensing(v1).LicenseAssignmentInsert} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/user',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId'],
        pathParams: ['productId', 'skuId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.listForProduct
     *
     * @desc List license assignments for given product of the customer.
     *
     * @alias licensing.licenseAssignments.listForProduct
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId CustomerId represents the customer for whom licenseassignments are queried
     * @param {integer=} params.maxResults Maximum number of campaigns to return at one time. Must be positive. Optional. Default value is 100.
     * @param {string=} params.pageToken Token to fetch the next page.Optional. By default server will return first page
     * @param {string} params.productId Name for product
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listForProduct: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['productId', 'customerId'],
        pathParams: ['productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.listForProductAndSku
     *
     * @desc List license assignments for given product and sku of the customer.
     *
     * @alias licensing.licenseAssignments.listForProductAndSku
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.customerId CustomerId represents the customer for whom licenseassignments are queried
     * @param {integer=} params.maxResults Maximum number of campaigns to return at one time. Must be positive. Optional. Default value is 100.
     * @param {string=} params.pageToken Token to fetch the next page.Optional. By default server will return first page
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listForProductAndSku: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId', 'customerId'],
        pathParams: ['productId', 'skuId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.patch
     *
     * @desc Assign License. This method supports patch semantics.
     *
     * @alias licensing.licenseAssignments.patch
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku for which license would be revoked
     * @param {string} params.userId email id or unique Id of the user
     * @param {licensing(v1).LicenseAssignment} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/user/{userId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId', 'userId'],
        pathParams: ['productId', 'skuId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * licensing.licenseAssignments.update
     *
     * @desc Assign License.
     *
     * @alias licensing.licenseAssignments.update
     * @memberOf! licensing(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.productId Name for product
     * @param {string} params.skuId Name for sku for which license would be revoked
     * @param {string} params.userId email id or unique Id of the user
     * @param {licensing(v1).LicenseAssignment} params.resource Request body data
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
          url: 'https://www.googleapis.com/apps/licensing/v1/product/{productId}/sku/{skuId}/user/{userId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['productId', 'skuId', 'userId'],
        pathParams: ['productId', 'skuId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef LicenseAssignment
 * @memberOf! licensing(v1)
 * @type object
 * @property {string} etags ETag of the resource.
 * @property {string} kind Identifies the resource as a LicenseAssignment.
 * @property {string} productId Name of the product.
 * @property {string} selfLink Link to this page.
 * @property {string} skuId Name of the sku of the product.
 * @property {string} userId Email id of the user.
 */
/**
 * @typedef LicenseAssignmentInsert
 * @memberOf! licensing(v1)
 * @type object
 * @property {string} userId Email id of the user
 */
/**
 * @typedef LicenseAssignmentList
 * @memberOf! licensing(v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {licensing(v1).LicenseAssignment[]} items The LicenseAssignments in this page of results.
 * @property {string} kind Identifies the resource as a collection of LicenseAssignments.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
module.exports = Licensing;
