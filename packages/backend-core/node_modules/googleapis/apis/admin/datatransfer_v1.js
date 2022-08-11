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
 * Admin Data Transfer API
 *
 * Transfers user data from one user to another.
 *
 * @example
 * var google = require('googleapis');
 * var admin = google.admin('datatransfer_v1');
 *
 * @namespace admin
 * @type {Function}
 * @version datatransfer_v1
 * @variation datatransfer_v1
 * @param {object=} options Options for Admin
 */
function Admin(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.applications = {

    /**
     * datatransfer.applications.get
     *
     * @desc Retrieves information about an application for the given application ID.
     *
     * @alias datatransfer.applications.get
     * @memberOf! admin(datatransfer_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId ID of the application resource to be retrieved.
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
          url: 'https://www.googleapis.com/admin/datatransfer/v1/applications/{applicationId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datatransfer.applications.list
     *
     * @desc Lists the applications available for data transfer for a customer.
     *
     * @alias datatransfer.applications.list
     * @memberOf! admin(datatransfer_v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.customerId Immutable ID of the Google Apps account.
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100.
     * @param {string=} params.pageToken Token to specify next page in the list.
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
          url: 'https://www.googleapis.com/admin/datatransfer/v1/applications',
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

  self.transfers = {

    /**
     * datatransfer.transfers.get
     *
     * @desc Retrieves a data transfer request by its resource ID.
     *
     * @alias datatransfer.transfers.get
     * @memberOf! admin(datatransfer_v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.dataTransferId ID of the resource to be retrieved. This is returned in the response from the insert method.
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
          url: 'https://www.googleapis.com/admin/datatransfer/v1/transfers/{dataTransferId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['dataTransferId'],
        pathParams: ['dataTransferId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * datatransfer.transfers.insert
     *
     * @desc Inserts a data transfer request.
     *
     * @alias datatransfer.transfers.insert
     * @memberOf! admin(datatransfer_v1)
     *
     * @param {object} params Parameters for request
     * @param {admin(datatransfer_v1).DataTransfer} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/datatransfer/v1/transfers',
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
     * datatransfer.transfers.list
     *
     * @desc Lists the transfers for a customer by source user, destination user, or status.
     *
     * @alias datatransfer.transfers.list
     * @memberOf! admin(datatransfer_v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.customerId Immutable ID of the Google Apps account.
     * @param {integer=} params.maxResults Maximum number of results to return. Default is 100.
     * @param {string=} params.newOwnerUserId Destination user's profile ID.
     * @param {string=} params.oldOwnerUserId Source user's profile ID.
     * @param {string=} params.pageToken Token to specify the next page in the list.
     * @param {string=} params.status Status of the transfer.
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
          url: 'https://www.googleapis.com/admin/datatransfer/v1/transfers',
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
 * @typedef Application
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {string} etag Etag of the resource.
 * @property {string} id The application&#39;s ID.
 * @property {string} kind Identifies the resource as a DataTransfer Application Resource.
 * @property {string} name The application&#39;s name.
 * @property {admin(datatransfer_v1).ApplicationTransferParam[]} transferParams The list of all possible transfer parameters for this application. These parameters can be used to select the data of the user in this application to be transfered.
 */
/**
 * @typedef ApplicationDataTransfer
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {string} applicationId The application&#39;s ID.
 * @property {admin(datatransfer_v1).ApplicationTransferParam[]} applicationTransferParams The transfer parameters for the application. These parameters are used to select the data which will get transfered in context of this application.
 * @property {string} applicationTransferStatus Current status of transfer for this application. (Read-only)
 */
/**
 * @typedef ApplicationTransferParam
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {string} key The type of the transfer parameter. eg: &#39;PRIVACY_LEVEL&#39;
 * @property {string[]} value The value of the coressponding transfer parameter. eg: &#39;PRIVATE&#39; or &#39;SHARED&#39;
 */
/**
 * @typedef ApplicationsListResponse
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {admin(datatransfer_v1).Application[]} applications List of applications that support data transfer and are also installed for the customer.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Identifies the resource as a collection of Applications.
 * @property {string} nextPageToken Continuation token which will be used to specify next page in list API.
 */
/**
 * @typedef DataTransfer
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {admin(datatransfer_v1).ApplicationDataTransfer[]} applicationDataTransfers List of per application data transfer resources. It contains data transfer details of the applications associated with this transfer resource. Note that this list is also used to specify the applications for which data transfer has to be done at the time of the transfer resource creation.
 * @property {string} etag ETag of the resource.
 * @property {string} id The transfer&#39;s ID (Read-only).
 * @property {string} kind Identifies the resource as a DataTransfer request.
 * @property {string} newOwnerUserId ID of the user to whom the data is being transfered.
 * @property {string} oldOwnerUserId ID of the user whose data is being transfered.
 * @property {string} overallTransferStatusCode Overall transfer status (Read-only).
 * @property {string} requestTime The time at which the data transfer was requested (Read-only).
 */
/**
 * @typedef DataTransfersListResponse
 * @memberOf! admin(datatransfer_v1)
 * @type object
 * @property {admin(datatransfer_v1).DataTransfer[]} dataTransfers List of data transfer requests.
 * @property {string} etag ETag of the resource.
 * @property {string} kind Identifies the resource as a collection of data transfer requests.
 * @property {string} nextPageToken Continuation token which will be used to specify next page in list API.
 */
module.exports = Admin;
