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
 * Google Play EMM API
 *
 * Manages the deployment of apps to Android for Work users.
 *
 * @example
 * var google = require('googleapis');
 * var androidenterprise = google.androidenterprise('v1');
 *
 * @namespace androidenterprise
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Androidenterprise
 */
function Androidenterprise(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.collections = {

    /**
     * androidenterprise.collections.delete
     *
     * @desc Deletes a collection.
     *
     * @alias androidenterprise.collections.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId'],
        pathParams: ['collectionId', 'enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collections.get
     *
     * @desc Retrieves the details of a collection.
     *
     * @alias androidenterprise.collections.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId'],
        pathParams: ['collectionId', 'enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collections.insert
     *
     * @desc Creates a new collection.
     *
     * @alias androidenterprise.collections.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).Collection} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collections.list
     *
     * @desc Retrieves the IDs of all the collections for an enterprise.
     *
     * @alias androidenterprise.collections.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collections.patch
     *
     * @desc Updates a collection. This method supports patch semantics.
     *
     * @alias androidenterprise.collections.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).Collection} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId'],
        pathParams: ['collectionId', 'enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collections.update
     *
     * @desc Updates a collection.
     *
     * @alias androidenterprise.collections.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).Collection} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId'],
        pathParams: ['collectionId', 'enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.collectionviewers = {

    /**
     * androidenterprise.collectionviewers.delete
     *
     * @desc Removes the user from the list of those specifically allowed to see the collection. If the collection's visibility is set to viewersOnly then only such users will see the collection.
     *
     * @alias androidenterprise.collectionviewers.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}/users/{userId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId', 'userId'],
        pathParams: ['collectionId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collectionviewers.get
     *
     * @desc Retrieves the ID of the user if they have been specifically allowed to see the collection. If the collection's visibility is set to viewersOnly then only these users will see the collection.
     *
     * @alias androidenterprise.collectionviewers.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}/users/{userId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId', 'userId'],
        pathParams: ['collectionId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collectionviewers.list
     *
     * @desc Retrieves the IDs of the users who have been specifically allowed to see the collection. If the collection's visibility is set to viewersOnly then only these users will see the collection.
     *
     * @alias androidenterprise.collectionviewers.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId'],
        pathParams: ['collectionId', 'enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collectionviewers.patch
     *
     * @desc Adds the user to the list of those specifically allowed to see the collection. If the collection's visibility is set to viewersOnly then only such users will see the collection. This method supports patch semantics.
     *
     * @alias androidenterprise.collectionviewers.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}/users/{userId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId', 'userId'],
        pathParams: ['collectionId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.collectionviewers.update
     *
     * @desc Adds the user to the list of those specifically allowed to see the collection. If the collection's visibility is set to viewersOnly then only such users will see the collection.
     *
     * @alias androidenterprise.collectionviewers.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collectionId The ID of the collection.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/collections/{collectionId}/users/{userId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'collectionId', 'userId'],
        pathParams: ['collectionId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.devices = {

    /**
     * androidenterprise.devices.get
     *
     * @desc Retrieves the details of a device.
     *
     * @alias androidenterprise.devices.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.devices.getState
     *
     * @desc Retrieves whether a device's access to Google services is enabled or disabled. The device state takes effect only if enforcing EMM policies on Android devices is enabled in the Google Admin Console. Otherwise, the device state is ignored and all devices are allowed access to Google services. This is only supported for Google-managed users.
     *
     * @alias androidenterprise.devices.getState
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getState: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/state',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.devices.list
     *
     * @desc Retrieves the IDs of all of a user's devices.
     *
     * @alias androidenterprise.devices.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.devices.setState
     *
     * @desc Sets whether a device's access to Google services is enabled or disabled. The device state takes effect only if enforcing EMM policies on Android devices is enabled in the Google Admin Console. Otherwise, the device state is ignored and all devices are allowed access to Google services. This is only supported for Google-managed users.
     *
     * @alias androidenterprise.devices.setState
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).DeviceState} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setState: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/state',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.enterprises = {

    /**
     * androidenterprise.enterprises.acknowledgeNotificationSet
     *
     * @desc Acknowledges notifications that were received from Enterprises.PullNotificationSet to prevent subsequent calls from returning the same notifications.
     *
     * @alias androidenterprise.enterprises.acknowledgeNotificationSet
     * @memberOf! androidenterprise(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.notificationSetId The notification set ID as returned by Enterprises.PullNotificationSet. This must be provided.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    acknowledgeNotificationSet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/acknowledgeNotificationSet',
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
     * androidenterprise.enterprises.completeSignup
     *
     * @desc Completes the signup flow, by specifying the Completion token and Enterprise token. This request must not be called multiple times for a given Enterprise Token.
     *
     * @alias androidenterprise.enterprises.completeSignup
     * @memberOf! androidenterprise(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.completionToken The Completion token initially returned by GenerateSignupUrl.
     * @param {string=} params.enterpriseToken The Enterprise token appended to the Callback URL.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    completeSignup: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/completeSignup',
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
     * androidenterprise.enterprises.createWebToken
     *
     * @desc Returns a unique token to access an embeddable UI. To generate a web UI, pass the generated token into the managed Google Play javascript API. Each token may only be used to start one UI session. See the javascript API documentation for further information.
     *
     * @alias androidenterprise.enterprises.createWebToken
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).AdministratorWebTokenSpec} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createWebToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/createWebToken',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.delete
     *
     * @desc Deletes the binding between the EMM and enterprise. This is now deprecated; use this to unenroll customers that were previously enrolled with the 'insert' call, then enroll them again with the 'enroll' call.
     *
     * @alias androidenterprise.enterprises.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.enroll
     *
     * @desc Enrolls an enterprise with the calling EMM.
     *
     * @alias androidenterprise.enterprises.enroll
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.token The token provided by the enterprise to register the EMM.
     * @param {androidenterprise(v1).Enterprise} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    enroll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/enroll',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['token'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.generateSignupUrl
     *
     * @desc Generates a sign-up URL.
     *
     * @alias androidenterprise.enterprises.generateSignupUrl
     * @memberOf! androidenterprise(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.callbackUrl The callback URL to which the Admin will be redirected after successfully creating an enterprise. Before redirecting there the system will add a single query parameter to this URL named "enterpriseToken" which will contain an opaque token to be used for the CompleteSignup request. Beware that this means that the URL will be parsed, the parameter added and then a new URL formatted, i.e. there may be some minor formatting changes and, more importantly, the URL must be well-formed so that it can be parsed.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateSignupUrl: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/signupUrl',
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
     * androidenterprise.enterprises.get
     *
     * @desc Retrieves the name and domain of an enterprise.
     *
     * @alias androidenterprise.enterprises.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.getServiceAccount
     *
     * @desc Returns a service account and credentials. The service account can be bound to the enterprise by calling setAccount. The service account is unique to this enterprise and EMM, and will be deleted if the enterprise is unbound. The credentials contain private key data and are not stored server-side.  This method can only be called after calling Enterprises.Enroll or Enterprises.CompleteSignup, and before Enterprises.SetAccount; at other times it will return an error.  Subsequent calls after the first will generate a new, unique set of credentials, and invalidate the previously generated credentials.  Once the service account is bound to the enterprise, it can be managed using the serviceAccountKeys resource.
     *
     * @alias androidenterprise.enterprises.getServiceAccount
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string=} params.keyType The type of credential to return with the service account. Required.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getServiceAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccount',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.getStoreLayout
     *
     * @desc Returns the store layout for the enterprise. If the store layout has not been set, or if the store layout has no homepageId set, returns a NOT_FOUND error.
     *
     * @alias androidenterprise.enterprises.getStoreLayout
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getStoreLayout: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.insert
     *
     * @desc Establishes the binding between the EMM and an enterprise. This is now deprecated; use enroll instead.
     *
     * @alias androidenterprise.enterprises.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.token The token provided by the enterprise to register the EMM.
     * @param {androidenterprise(v1).Enterprise} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['token'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.list
     *
     * @desc Looks up an enterprise by domain name. This is only supported for enterprises created via the Google-initiated creation flow. Lookup of the id is not needed for enterprises created via the EMM-initiated flow since the EMM learns the enterprise ID in the callback specified in the Enterprises.generateSignupUrl call.
     *
     * @alias androidenterprise.enterprises.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.domain The exact primary domain name of the enterprise to look up.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['domain'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.pullNotificationSet
     *
     * @desc Pulls and returns a notification set for the enterprises associated with the service account authenticated for the request. The notification set may be empty if no notification are pending. A notification set returned needs to be acknowledged within 20 seconds by calling Enterprises​.AcknowledgeNotificationSet, unless the notification set is empty. Notifications that are not acknowledged within the 20 seconds will eventually be included again in the response to another PullNotificationSet request, and those that are never acknowledged will ultimately be deleted according to the Google Cloud Platform Pub/Sub system policy. Multiple requests might be performed concurrently to retrieve notifications, in which case the pending notifications (if any) will be split among each caller, if any are pending. If no notifications are present, an empty notification list is returned. Subsequent requests may return more notifications once they become available.
     *
     * @alias androidenterprise.enterprises.pullNotificationSet
     * @memberOf! androidenterprise(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.requestMode The request mode for pulling notifications. Specifying waitForNotifications will cause the request to block and wait until one or more notifications are present, or return an empty notification list if no notifications are present after some time. Speciying returnImmediately will cause the request to immediately return the pending notifications, or an empty list if no notifications are present. If omitted, defaults to waitForNotifications.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    pullNotificationSet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/pullNotificationSet',
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
     * androidenterprise.enterprises.sendTestPushNotification
     *
     * @desc Sends a test push notification to validate the EMM integration with the Google Cloud Pub/Sub service for this enterprise.
     *
     * @alias androidenterprise.enterprises.sendTestPushNotification
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    sendTestPushNotification: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/sendTestPushNotification',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.setAccount
     *
     * @desc Set the account that will be used to authenticate to the API as the enterprise.
     *
     * @alias androidenterprise.enterprises.setAccount
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).EnterpriseAccount} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/account',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.setStoreLayout
     *
     * @desc Sets the store layout for the enterprise. By default, storeLayoutType is set to "basic" and the basic store layout is enabled. The basic layout only contains apps approved by the admin, and that have been added to the available product set for a user (using the  setAvailableProductSet call). Apps on the page are sorted in order of their product ID value. If you create a custom store layout (by setting storeLayoutType = "custom"), the basic store layout is disabled.
     *
     * @alias androidenterprise.enterprises.setStoreLayout
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).StoreLayout} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setStoreLayout: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.enterprises.unenroll
     *
     * @desc Unenrolls an enterprise from the calling EMM.
     *
     * @alias androidenterprise.enterprises.unenroll
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    unenroll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/unenroll',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.entitlements = {

    /**
     * androidenterprise.entitlements.delete
     *
     * @desc Removes an entitlement to an app for a user and uninstalls it.
     *
     * @alias androidenterprise.entitlements.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.entitlementId The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
        pathParams: ['enterpriseId', 'entitlementId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.entitlements.get
     *
     * @desc Retrieves details of an entitlement.
     *
     * @alias androidenterprise.entitlements.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.entitlementId The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
        pathParams: ['enterpriseId', 'entitlementId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.entitlements.list
     *
     * @desc List of all entitlements for the specified user. Only the ID is set.
     *
     * @alias androidenterprise.entitlements.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.entitlements.patch
     *
     * @desc Adds or updates an entitlement to an app for a user. This method supports patch semantics.
     *
     * @alias androidenterprise.entitlements.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.entitlementId The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
     * @param {boolean=} params.install Set to true to also install the product on all the user's devices where possible. Failure to install on one or more devices will not prevent this operation from returning successfully, as long as the entitlement was successfully assigned to the user.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).Entitlement} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
        pathParams: ['enterpriseId', 'entitlementId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.entitlements.update
     *
     * @desc Adds or updates an entitlement to an app for a user.
     *
     * @alias androidenterprise.entitlements.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.entitlementId The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
     * @param {boolean=} params.install Set to true to also install the product on all the user's devices where possible. Failure to install on one or more devices will not prevent this operation from returning successfully, as long as the entitlement was successfully assigned to the user.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).Entitlement} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
        pathParams: ['enterpriseId', 'entitlementId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.grouplicenses = {

    /**
     * androidenterprise.grouplicenses.get
     *
     * @desc Retrieves details of an enterprise's group license for a product.
     *
     * @alias androidenterprise.grouplicenses.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.groupLicenseId The ID of the product the group license is for, e.g. "app:com.google.android.gm".
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses/{groupLicenseId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'groupLicenseId'],
        pathParams: ['enterpriseId', 'groupLicenseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.grouplicenses.list
     *
     * @desc Retrieves IDs of all products for which the enterprise has a group license.
     *
     * @alias androidenterprise.grouplicenses.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.grouplicenseusers = {

    /**
     * androidenterprise.grouplicenseusers.list
     *
     * @desc Retrieves the IDs of the users who have been granted entitlements under the license.
     *
     * @alias androidenterprise.grouplicenseusers.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.groupLicenseId The ID of the product the group license is for, e.g. "app:com.google.android.gm".
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses/{groupLicenseId}/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'groupLicenseId'],
        pathParams: ['enterpriseId', 'groupLicenseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.installs = {

    /**
     * androidenterprise.installs.delete
     *
     * @desc Requests to remove an app from a device. A call to get or list will still show the app as installed on the device until it is actually removed.
     *
     * @alias androidenterprise.installs.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.installId The ID of the product represented by the install, e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
        pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.installs.get
     *
     * @desc Retrieves details of an installation of an app on a device.
     *
     * @alias androidenterprise.installs.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.installId The ID of the product represented by the install, e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
        pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.installs.list
     *
     * @desc Retrieves the details of all apps installed on the specified device.
     *
     * @alias androidenterprise.installs.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.installs.patch
     *
     * @desc Requests to install the latest version of an app to a device. If the app is already installed then it is updated to the latest version if necessary. This method supports patch semantics.
     *
     * @alias androidenterprise.installs.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.installId The ID of the product represented by the install, e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).Install} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
        pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.installs.update
     *
     * @desc Requests to install the latest version of an app to a device. If the app is already installed then it is updated to the latest version if necessary.
     *
     * @alias androidenterprise.installs.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.installId The ID of the product represented by the install, e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).Install} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
        pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.managedconfigurationsfordevice = {

    /**
     * androidenterprise.managedconfigurationsfordevice.delete
     *
     * @desc Removes a per-device managed configuration for an app for the specified device.
     *
     * @alias androidenterprise.managedconfigurationsfordevice.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForDeviceId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'managedConfigurationForDeviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'managedConfigurationForDeviceId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsfordevice.get
     *
     * @desc Retrieves details of a per-device managed configuration.
     *
     * @alias androidenterprise.managedconfigurationsfordevice.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForDeviceId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'managedConfigurationForDeviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'managedConfigurationForDeviceId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsfordevice.list
     *
     * @desc Lists all the per-device managed configurations for the specified device. Only the ID is set.
     *
     * @alias androidenterprise.managedconfigurationsfordevice.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsfordevice.patch
     *
     * @desc Adds or updates a per-device managed configuration for an app for the specified device. This method supports patch semantics.
     *
     * @alias androidenterprise.managedconfigurationsfordevice.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForDeviceId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).ManagedConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'managedConfigurationForDeviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'managedConfigurationForDeviceId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsfordevice.update
     *
     * @desc Adds or updates a per-device managed configuration for an app for the specified device.
     *
     * @alias androidenterprise.managedconfigurationsfordevice.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deviceId The Android ID of the device.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForDeviceId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).ManagedConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'deviceId', 'managedConfigurationForDeviceId'],
        pathParams: ['deviceId', 'enterpriseId', 'managedConfigurationForDeviceId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.managedconfigurationsforuser = {

    /**
     * androidenterprise.managedconfigurationsforuser.delete
     *
     * @desc Removes a per-user managed configuration for an app for the specified user.
     *
     * @alias androidenterprise.managedconfigurationsforuser.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForUserId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'managedConfigurationForUserId'],
        pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsforuser.get
     *
     * @desc Retrieves details of a per-user managed configuration for an app for the specified user.
     *
     * @alias androidenterprise.managedconfigurationsforuser.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForUserId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'managedConfigurationForUserId'],
        pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsforuser.list
     *
     * @desc Lists all the per-user managed configurations for the specified user. Only the ID is set.
     *
     * @alias androidenterprise.managedconfigurationsforuser.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsforuser.patch
     *
     * @desc Adds or updates a per-user managed configuration for an app for the specified user. This method supports patch semantics.
     *
     * @alias androidenterprise.managedconfigurationsforuser.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForUserId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).ManagedConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'managedConfigurationForUserId'],
        pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.managedconfigurationsforuser.update
     *
     * @desc Adds or updates a per-user managed configuration for an app for the specified user.
     *
     * @alias androidenterprise.managedconfigurationsforuser.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.managedConfigurationForUserId The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).ManagedConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId', 'managedConfigurationForUserId'],
        pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.permissions = {

    /**
     * androidenterprise.permissions.get
     *
     * @desc Retrieves details of an Android app permission for display to an enterprise admin.
     *
     * @alias androidenterprise.permissions.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.language The BCP47 tag for the user's preferred language (e.g. "en-US", "de")
     * @param {string} params.permissionId The ID of the permission.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/permissions/{permissionId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['permissionId'],
        pathParams: ['permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.products = {

    /**
     * androidenterprise.products.approve
     *
     * @desc Approves the specified product and the relevant app permissions, if any. The maximum number of products that you can approve per enterprise customer is 1,000.  To learn how to use managed Google Play to design and create a store layout to display approved products to your users, see Store Layout Design.
     *
     * @alias androidenterprise.products.approve
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.productId The ID of the product.
     * @param {androidenterprise(v1).ProductsApproveRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    approve: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/approve',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.generateApprovalUrl
     *
     * @desc Generates a URL that can be rendered in an iframe to display the permissions (if any) of a product. An enterprise admin must view these permissions and accept them on behalf of their organization in order to approve that product.  Admins should accept the displayed permissions by interacting with a separate UI element in the EMM console, which in turn should trigger the use of this URL as the approvalUrlInfo.approvalUrl property in a Products.approve call to approve the product. This URL can only be used to display permissions for up to 1 day.
     *
     * @alias androidenterprise.products.generateApprovalUrl
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string=} params.languageCode The BCP 47 language code used for permission names and descriptions in the returned iframe, for instance "en-US".
     * @param {string} params.productId The ID of the product.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateApprovalUrl: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/generateApprovalUrl',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.get
     *
     * @desc Retrieves details of a product for display to an enterprise admin.
     *
     * @alias androidenterprise.products.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string=} params.language The BCP47 tag for the user's preferred language (e.g. "en-US", "de").
     * @param {string} params.productId The ID of the product, e.g. "app:com.google.android.gm".
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.getAppRestrictionsSchema
     *
     * @desc Retrieves the schema that defines the configurable properties for this product. All products have a schema, but this schema may be empty if no managed configurations have been defined. This schema can be used to populate a UI that allows an admin to configure the product. To apply a managed configuration based on the schema obtained using this API, see Managed Configurations through Play.
     *
     * @alias androidenterprise.products.getAppRestrictionsSchema
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string=} params.language The BCP47 tag for the user's preferred language (e.g. "en-US", "de").
     * @param {string} params.productId The ID of the product.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAppRestrictionsSchema: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/appRestrictionsSchema',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.getPermissions
     *
     * @desc Retrieves the Android app permissions required by this app.
     *
     * @alias androidenterprise.products.getPermissions
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.productId The ID of the product.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/permissions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.list
     *
     * @desc Finds approved products that match a query, or all approved products if there is no query.
     *
     * @alias androidenterprise.products.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.approved Specifies whether to search among all products (false) or among only products that have been approved (true). Only "true" is supported, and should be specified.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string=} params.language The BCP47 tag for the user's preferred language (e.g. "en-US", "de"). Results are returned in the language best matching the preferred language.
     * @param {integer=} params.maxResults Specifies the maximum number of products that can be returned per request. If not specified, uses a default value of 100, which is also the maximum retrievable within a single response.
     * @param {string=} params.query The search query as typed in the Google Play store search box. If omitted, all approved apps will be returned (using the pagination parameters), including apps that are not available in the store (e.g. unpublished apps).
     * @param {string=} params.token A pagination token is contained in a requests response when there are more products. The token can be used in a subsequent request to obtain more products, and so forth. This parameter cannot be used in the initial request.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.unapprove
     *
     * @desc Unapproves the specified product (and the relevant app permissions, if any)
     *
     * @alias androidenterprise.products.unapprove
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.productId The ID of the product.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    unapprove: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/unapprove',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.products.updatePermissions
     *
     * @desc This method has been deprecated. To programmatically approve applications, you must use the iframe mechanism via the  generateApprovalUrl and  approve methods of the Products resource. For more information, see the  Play EMM API usage requirements.  The updatePermissions method (deprecated) updates the set of Android app permissions for this app that have been accepted by the enterprise.
     *
     * @alias androidenterprise.products.updatePermissions
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.productId The ID of the product.
     * @param {androidenterprise(v1).ProductPermissions} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updatePermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/permissions',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'productId'],
        pathParams: ['enterpriseId', 'productId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.serviceaccountkeys = {

    /**
     * androidenterprise.serviceaccountkeys.delete
     *
     * @desc Removes and invalidates the specified credentials for the service account associated with this enterprise. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount.
     *
     * @alias androidenterprise.serviceaccountkeys.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.keyId The ID of the key.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys/{keyId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'keyId'],
        pathParams: ['enterpriseId', 'keyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.serviceaccountkeys.insert
     *
     * @desc Generates new credentials for the service account associated with this enterprise. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount.  Only the type of the key should be populated in the resource to be inserted.
     *
     * @alias androidenterprise.serviceaccountkeys.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).ServiceAccountKey} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.serviceaccountkeys.list
     *
     * @desc Lists all active credentials for the service account associated with this enterprise. Only the ID and key type are returned. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount.
     *
     * @alias androidenterprise.serviceaccountkeys.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.storelayoutclusters = {

    /**
     * androidenterprise.storelayoutclusters.delete
     *
     * @desc Deletes a cluster.
     *
     * @alias androidenterprise.storelayoutclusters.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clusterId The ID of the cluster.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
        pathParams: ['clusterId', 'enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutclusters.get
     *
     * @desc Retrieves details of a cluster.
     *
     * @alias androidenterprise.storelayoutclusters.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clusterId The ID of the cluster.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
        pathParams: ['clusterId', 'enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutclusters.insert
     *
     * @desc Inserts a new cluster in a page.
     *
     * @alias androidenterprise.storelayoutclusters.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
     * @param {androidenterprise(v1).StoreCluster} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutclusters.list
     *
     * @desc Retrieves the details of all clusters on the specified page.
     *
     * @alias androidenterprise.storelayoutclusters.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutclusters.patch
     *
     * @desc Updates a cluster. This method supports patch semantics.
     *
     * @alias androidenterprise.storelayoutclusters.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clusterId The ID of the cluster.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
     * @param {androidenterprise(v1).StoreCluster} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
        pathParams: ['clusterId', 'enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutclusters.update
     *
     * @desc Updates a cluster.
     *
     * @alias androidenterprise.storelayoutclusters.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clusterId The ID of the cluster.
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
     * @param {androidenterprise(v1).StoreCluster} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
        pathParams: ['clusterId', 'enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.storelayoutpages = {

    /**
     * androidenterprise.storelayoutpages.delete
     *
     * @desc Deletes a store page.
     *
     * @alias androidenterprise.storelayoutpages.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutpages.get
     *
     * @desc Retrieves details of a store page.
     *
     * @alias androidenterprise.storelayoutpages.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutpages.insert
     *
     * @desc Inserts a new store page.
     *
     * @alias androidenterprise.storelayoutpages.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).StorePage} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutpages.list
     *
     * @desc Retrieves the details of all pages in the store.
     *
     * @alias androidenterprise.storelayoutpages.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutpages.patch
     *
     * @desc Updates the content of a store page. This method supports patch semantics.
     *
     * @alias androidenterprise.storelayoutpages.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
     * @param {androidenterprise(v1).StorePage} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.storelayoutpages.update
     *
     * @desc Updates the content of a store page.
     *
     * @alias androidenterprise.storelayoutpages.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.pageId The ID of the page.
     * @param {androidenterprise(v1).StorePage} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'pageId'],
        pathParams: ['enterpriseId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.users = {

    /**
     * androidenterprise.users.delete
     *
     * @desc Deleted an EMM-managed user.
     *
     * @alias androidenterprise.users.delete
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.generateAuthenticationToken
     *
     * @desc Generates an authentication token which the device policy client can use to provision the given EMM-managed user account on a device. The generated token is single-use and expires after a few minutes.  This call only works with EMM-managed accounts.
     *
     * @alias androidenterprise.users.generateAuthenticationToken
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateAuthenticationToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/authenticationToken',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.generateToken
     *
     * @desc Generates a token (activation code) to allow this user to configure their managed account in the Android Setup Wizard. Revokes any previously generated token.  This call only works with Google managed accounts.
     *
     * @alias androidenterprise.users.generateToken
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/token',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.get
     *
     * @desc Retrieves a user's details.
     *
     * @alias androidenterprise.users.get
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.getAvailableProductSet
     *
     * @desc Retrieves the set of products a user is entitled to access.
     *
     * @alias androidenterprise.users.getAvailableProductSet
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAvailableProductSet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/availableProductSet',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.insert
     *
     * @desc Creates a new EMM-managed user.  The Users resource passed in the body of the request should include an accountIdentifier and an accountType. If a corresponding user already exists with the same account identifier, the user will be updated with the resource. In this case only the displayName field can be changed.
     *
     * @alias androidenterprise.users.insert
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {androidenterprise(v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['enterpriseId'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.list
     *
     * @desc Looks up a user by primary email address. This is only supported for Google-managed users. Lookup of the id is not needed for EMM-managed users because the id is already returned in the result of the Users.insert call.
     *
     * @alias androidenterprise.users.list
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.email The exact primary email address of the user to look up.
     * @param {string} params.enterpriseId The ID of the enterprise.
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'email'],
        pathParams: ['enterpriseId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.patch
     *
     * @desc Updates the details of an EMM-managed user.  Can be used with EMM-managed users only (not Google managed users). Pass the new details in the Users resource in the request body. Only the displayName field can be changed. Other fields must either be unset or have the currently active value. This method supports patch semantics.
     *
     * @alias androidenterprise.users.patch
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.revokeToken
     *
     * @desc Revokes a previously generated token (activation code) for the user.
     *
     * @alias androidenterprise.users.revokeToken
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    revokeToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/token',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.setAvailableProductSet
     *
     * @desc Modifies the set of products a user is entitled to access.
     *
     * @alias androidenterprise.users.setAvailableProductSet
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).ProductSet} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setAvailableProductSet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/availableProductSet',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidenterprise.users.update
     *
     * @desc Updates the details of an EMM-managed user.  Can be used with EMM-managed users only (not Google managed users). Pass the new details in the Users resource in the request body. Only the displayName field can be changed. Other fields must either be unset or have the currently active value.
     *
     * @alias androidenterprise.users.update
     * @memberOf! androidenterprise(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.enterpriseId The ID of the enterprise.
     * @param {string} params.userId The ID of the user.
     * @param {androidenterprise(v1).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['enterpriseId', 'userId'],
        pathParams: ['enterpriseId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Administrator
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} email The admin&#39;s email address.
 */
/**
 * @typedef AdministratorWebToken
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#administratorWebToken&quot;.
 * @property {string} token An opaque token to be passed to the Play front-end to generate an iframe.
 */
/**
 * @typedef AdministratorWebTokenSpec
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#administratorWebTokenSpec&quot;.
 * @property {string} parent The URI of the parent frame hosting the iframe. To prevent XSS, the iframe may not be hosted at other URIs. This URI must be https.
 * @property {string[]} permission The list of permissions the admin is granted within the iframe. The admin will only be allowed to view an iframe if they have all of the permissions associated with it. The only valid value is &quot;approveApps&quot; that will allow the admin to access the iframe in &quot;approve&quot; mode.
 */
/**
 * @typedef AppRestrictionsSchema
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#appRestrictionsSchema&quot;.
 * @property {androidenterprise(v1).AppRestrictionsSchemaRestriction[]} restrictions The set of restrictions that make up this schema.
 */
/**
 * @typedef AppRestrictionsSchemaChangeEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) for which the app restriction schema changed. This field will always be present.
 */
/**
 * @typedef AppRestrictionsSchemaRestriction
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).AppRestrictionsSchemaRestrictionRestrictionValue} defaultValue The default value of the restriction. bundle and bundleArray restrictions never have a default value.
 * @property {string} description A longer description of the restriction, giving more detail of what it affects.
 * @property {string[]} entry For choice or multiselect restrictions, the list of possible entries&#39; human-readable names.
 * @property {string[]} entryValue For choice or multiselect restrictions, the list of possible entries&#39; machine-readable values. These values should be used in the configuration, either as a single string value for a choice restriction or in a stringArray for a multiselect restriction.
 * @property {string} key The unique key that the product uses to identify the restriction, e.g. &quot;com.google.android.gm.fieldname&quot;.
 * @property {androidenterprise(v1).AppRestrictionsSchemaRestriction[]} nestedRestriction For bundle or bundleArray restrictions, the list of nested restrictions. A bundle restriction is always nested within a bundleArray restriction, and a bundleArray restriction is at most two levels deep.
 * @property {string} restrictionType The type of the restriction.
 * @property {string} title The name of the restriction.
 */
/**
 * @typedef AppRestrictionsSchemaRestrictionRestrictionValue
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} type The type of the value being provided.
 * @property {boolean} valueBool The boolean value - this will only be present if type is bool.
 * @property {integer} valueInteger The integer value - this will only be present if type is integer.
 * @property {string[]} valueMultiselect The list of string values - this will only be present if type is multiselect.
 * @property {string} valueString The string value - this will be present for types string, choice and hidden.
 */
/**
 * @typedef AppUpdateEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) that was updated. This field will always be present.
 */
/**
 * @typedef AppVersion
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {integer} versionCode Unique increasing identifier for the app version.
 * @property {string} versionString The string used in the Play store by the app developer to identify the version. The string is not necessarily unique or localized (for example, the string could be &quot;1.4&quot;).
 */
/**
 * @typedef ApprovalUrlInfo
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} approvalUrl A URL that displays a product&#39;s permissions and that can also be used to approve the product with the Products.approve call.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#approvalUrlInfo&quot;.
 */
/**
 * @typedef AuthenticationToken
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#authenticationToken&quot;.
 * @property {string} token The authentication token to be passed to the device policy client on the device where it can be used to provision the account for which this token was generated.
 */
/**
 * @typedef Collection
 * @memberOf! androidenterprise(v1)
 * @type object
* @property {string} collectionId Arbitrary unique ID, allocated by the API on creation.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#collection&quot;.
* @property {string} name A user-friendly name for the collection (should be unique), e.g. &quot;Accounting apps&quot;.
* @property {string[]} productId The IDs of the products in the collection, in the order in which they should be displayed.
* @property {string} visibility Whether this collection is visible to all users, or only to the users that have been granted access through the &quot;Collectionviewers&quot; API. With the launch of the &quot;setAvailableProductSet&quot; API, this property should always be set to &quot;viewersOnly&quot;, as the &quot;allUsers&quot; option will bypass the &quot;availableProductSet&quot; for all users within a domain.

The &quot;allUsers&quot; setting is deprecated, and will be removed.
*/
/**
 * @typedef CollectionViewersListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#collectionViewersListResponse&quot;.
 * @property {androidenterprise(v1).User[]} user A user of an enterprise.
 */
/**
 * @typedef CollectionsListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Collection[]} collection An ordered collection of products which can be made visible on the Google Play store to a selected group of users.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#collectionsListResponse&quot;.
 */
/**
 * @typedef Device
 * @memberOf! androidenterprise(v1)
 * @type object
* @property {string} androidId The Google Play Services Android ID for the device encoded as a lowercase hex string, e.g. &quot;123456789abcdef0&quot;.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#device&quot;.
* @property {string} managementType Identifies the extent to which the device is controlled by a managed Google Play EMM in various deployment configurations.

Possible values include: 
- &quot;managedDevice&quot;, a device that has the EMM&#39;s device policy controller (DPC) as the device owner, 
- &quot;managedProfile&quot;, a device that has a profile managed by the DPC (DPC is profile owner) in addition to a separate, personal profile that is unavailable to the DPC, 
- &quot;containerApp&quot;, a device running the container App. The container App is managed by the DPC, 
- &quot;unmanagedProfile&quot;, a device that has been allowed (by the domain&#39;s admin, using the Admin Console to enable the privilege) to use managed Google Play, but the profile is itself not owned by a DPC.
*/
/**
 * @typedef DeviceState
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} accountState The state of the Google account on the device. &quot;enabled&quot; indicates that the Google account on the device can be used to access Google services (including Google Play), while &quot;disabled&quot; means that it cannot. A new device is initially in the &quot;disabled&quot; state.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#deviceState&quot;.
 */
/**
 * @typedef DevicesListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Device[]} device A managed device.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#devicesListResponse&quot;.
 */
/**
 * @typedef Enterprise
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Administrator[]} administrator Admins of the enterprise. This is only supported for enterprises created via the EMM-initiated flow.
 * @property {string} id The unique ID for the enterprise.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#enterprise&quot;.
 * @property {string} name The name of the enterprise, for example, &quot;Example, Inc&quot;.
 * @property {string} primaryDomain The enterprise&#39;s primary domain, such as &quot;example.com&quot;.
 */
/**
 * @typedef EnterpriseAccount
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} accountEmail The email address of the service account.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#enterpriseAccount&quot;.
 */
/**
 * @typedef EnterprisesListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Enterprise[]} enterprise An enterprise.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#enterprisesListResponse&quot;.
 */
/**
 * @typedef EnterprisesSendTestPushNotificationResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} messageId The message ID of the test push notification that was sent.
 * @property {string} topicName The name of the Cloud Pub/Sub topic to which notifications for this enterprise&#39;s enrolled account will be sent.
 */
/**
 * @typedef Entitlement
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#entitlement&quot;.
 * @property {string} productId The ID of the product that the entitlement is for, e.g. &quot;app:com.google.android.gm&quot;.
 * @property {string} reason The reason for the entitlement, e.g. &quot;free&quot; for free apps. This is temporary, it will be replaced by the acquisition kind field of group licenses.
 */
/**
 * @typedef EntitlementsListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Entitlement[]} entitlement An entitlement of a user to a product (e.g. an app). For example, a free app that they have installed, or a paid app that they have been allocated a license to.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#entitlementsListResponse&quot;.
 */
/**
 * @typedef GroupLicense
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} acquisitionKind How this group license was acquired. &quot;bulkPurchase&quot; means that this group license object was created because the enterprise purchased licenses for this product; this is &quot;free&quot; otherwise (for free products).
 * @property {string} approval Whether the product to which this group license relates is currently approved by the enterprise, as either &quot;approved&quot; or &quot;unapproved&quot;. Products are approved when a group license is first created, but this approval may be revoked by an enterprise admin via Google Play. Unapproved products will not be visible to end users in collections and new entitlements to them should not normally be created.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#groupLicense&quot;.
 * @property {integer} numProvisioned The total number of provisioned licenses for this product. Returned by read operations, but ignored in write operations.
 * @property {integer} numPurchased The number of purchased licenses (possibly in multiple purchases). If this field is omitted then there is no limit on the number of licenses that can be provisioned (e.g. if the acquisition kind is &quot;free&quot;).
 * @property {string} productId The ID of the product that the license is for, e.g. &quot;app:com.google.android.gm&quot;.
 */
/**
 * @typedef GroupLicenseUsersListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#groupLicenseUsersListResponse&quot;.
 * @property {androidenterprise(v1).User[]} user A user of an enterprise.
 */
/**
 * @typedef GroupLicensesListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).GroupLicense[]} groupLicense A group license for a product approved for use in the enterprise.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#groupLicensesListResponse&quot;.
 */
/**
 * @typedef Install
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} installState Install state. The state &quot;installPending&quot; means that an install request has recently been made and download to the device is in progress. The state &quot;installed&quot; means that the app has been installed. This field is read-only.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#install&quot;.
 * @property {string} productId The ID of the product that the install is for, e.g. &quot;app:com.google.android.gm&quot;.
 * @property {integer} versionCode The version of the installed product. Guaranteed to be set only if the install state is &quot;installed&quot;.
 */
/**
 * @typedef InstallFailureEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} deviceId The Android ID of the device. This field will always be present.
 * @property {string} failureDetails Additional details on the failure if applicable.
 * @property {string} failureReason The reason for the installation failure. This field will always be present.
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) for which the install failure event occured. This field will always be present.
 * @property {string} userId The ID of the user. This field will always be present.
 */
/**
 * @typedef InstallsListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).Install[]} install An installation of an app for a user on a specific device. The existence of an install implies that the user must have an entitlement to the app.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#installsListResponse&quot;.
 */
/**
 * @typedef LocalizedText
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} locale The BCP47 tag for a locale. (e.g. &quot;en-US&quot;, &quot;de&quot;).
 * @property {string} text The text localized in the associated locale.
 */
/**
 * @typedef ManagedConfiguration
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#managedConfiguration&quot;.
 * @property {androidenterprise(v1).ManagedProperty[]} managedProperty The set of managed properties for this configuration.
 * @property {string} productId The ID of the product that the managed configuration is for, e.g. &quot;app:com.google.android.gm&quot;.
 */
/**
 * @typedef ManagedConfigurationsForDeviceListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#managedConfigurationsForDeviceListResponse&quot;.
 * @property {androidenterprise(v1).ManagedConfiguration[]} managedConfigurationForDevice A managed configuration for an app on a specific device.
 */
/**
 * @typedef ManagedConfigurationsForUserListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#managedConfigurationsForUserListResponse&quot;.
 * @property {androidenterprise(v1).ManagedConfiguration[]} managedConfigurationForUser A managed configuration for an app for a specific user.
 */
/**
 * @typedef ManagedProperty
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} key The unique key that identifies the property.
 * @property {boolean} valueBool The boolean value - this will only be present if type of the property is bool.
 * @property {androidenterprise(v1).ManagedPropertyBundle} valueBundle The bundle of managed properties - this will only be present if type of the property is bundle.
 * @property {androidenterprise(v1).ManagedPropertyBundle[]} valueBundleArray The list of bundles of properties - this will only be present if type of the property is bundle_array.
 * @property {integer} valueInteger The integer value - this will only be present if type of the property is integer.
 * @property {string} valueString The string value - this will only be present if type of the property is string, choice or hidden.
 * @property {string[]} valueStringArray The list of string values - this will only be present if type of the property is multiselect.
 */
/**
 * @typedef ManagedPropertyBundle
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).ManagedProperty[]} managedProperty The list of managed properties.
 */
/**
 * @typedef NewPermissionsEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string[]} approvedPermissions The set of permissions that the enterprise admin has already approved for this application. Use Permissions.Get on the EMM API to retrieve details about these permissions.
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) for which new permissions were added. This field will always be present.
 * @property {string[]} requestedPermissions The set of permissions that the app is currently requesting. Use Permissions.Get on the EMM API to retrieve details about these permissions.
 */
/**
 * @typedef Notification
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).AppRestrictionsSchemaChangeEvent} appRestrictionsSchemaChangeEvent Notifications about new app restrictions schema changes.
 * @property {androidenterprise(v1).AppUpdateEvent} appUpdateEvent Notifications about app updates.
 * @property {string} enterpriseId The ID of the enterprise for which the notification is sent. This will always be present.
 * @property {androidenterprise(v1).InstallFailureEvent} installFailureEvent Notifications about an app installation failure.
 * @property {androidenterprise(v1).NewPermissionsEvent} newPermissionsEvent Notifications about new app permissions.
 * @property {androidenterprise(v1).ProductApprovalEvent} productApprovalEvent Notifications about changes to a product&#39;s approval status.
 * @property {androidenterprise(v1).ProductAvailabilityChangeEvent} productAvailabilityChangeEvent Notifications about product availability changes.
 * @property {string} timestampMillis The time when the notification was published in milliseconds since 1970-01-01T00:00:00Z. This will always be present.
 */
/**
 * @typedef NotificationSet
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#notificationSet&quot;.
 * @property {androidenterprise(v1).Notification[]} notification The notifications received, or empty if no notifications are present.
 * @property {string} notificationSetId The notification set ID, required to mark the notification as received with the Enterprises.AcknowledgeNotification API. This will be omitted if no notifications are present.
 */
/**
 * @typedef PageInfo
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {integer} resultPerPage 
 * @property {integer} startIndex 
 * @property {integer} totalResults 
 */
/**
 * @typedef Permission
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} description A longer description of the permissions giving more details of what it affects.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#permission&quot;.
 * @property {string} name The name of the permission.
 * @property {string} permissionId An opaque string uniquely identifying the permission.
 */
/**
 * @typedef Product
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).AppVersion[]} appVersion App versions currently available for this product. The returned list contains only public versions. Alpha and beta versions are not included.
 * @property {string} authorName The name of the author of the product (e.g. the app developer).
 * @property {string} detailsUrl A link to the (consumer) Google Play details page for the product.
 * @property {string} distributionChannel How and to whom the package is made available. The value publicGoogleHosted means that the package is available through the Play store and not restricted to a specific enterprise. The value privateGoogleHosted means that the package is a private app (restricted to an enterprise) but hosted by Google. The value privateSelfHosted means that the package is a private app (restricted to an enterprise) and is privately hosted.
 * @property {string} iconUrl A link to an image that can be used as an icon for the product. This image is suitable for use at up to 512px x 512px.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#product&quot;.
 * @property {string} productId A string of the form app:&lt;package name&gt;. For example, app:com.google.android.gm represents the Gmail app.
 * @property {string} productPricing Whether this product is free, free with in-app purchases, or paid. If the pricing is unknown, this means the product is not generally available anymore (even though it might still be available to people who own it).
 * @property {boolean} requiresContainerApp Whether this app can only be installed on devices using the Android container app.
 * @property {string} smallIconUrl A link to a smaller image that can be used as an icon for the product. This image is suitable for use at up to 128px x 128px.
 * @property {string} title The name of the product.
 * @property {string} workDetailsUrl A link to the managed Google Play details page for the product, for use by an Enterprise admin.
 */
/**
 * @typedef ProductApprovalEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} approved Whether the product was approved or unapproved. This field will always be present.
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) for which the approval status has changed. This field will always be present.
 */
/**
 * @typedef ProductAvailabilityChangeEvent
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} availabilityStatus The new state of the product. This field will always be present.
 * @property {string} productId The id of the product (e.g. &quot;app:com.google.android.gm&quot;) for which the product availability changed. This field will always be present.
 */
/**
 * @typedef ProductPermission
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} permissionId An opaque string uniquely identifying the permission.
 * @property {string} state Whether the permission has been accepted or not.
 */
/**
 * @typedef ProductPermissions
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#productPermissions&quot;.
 * @property {androidenterprise(v1).ProductPermission[]} permission The permissions required by the app.
 * @property {string} productId The ID of the app that the permissions relate to, e.g. &quot;app:com.google.android.gm&quot;.
 */
/**
 * @typedef ProductSet
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#productSet&quot;.
 * @property {string[]} productId The list of product IDs making up the set of products.
 * @property {string} productSetBehavior The interpretation of this product set. &quot;unknown&quot; should never be sent and ignored if received. &quot;whitelist&quot; means that this product set constitutes a whitelist. &quot;includeAll&quot; means that all products are accessible, including products that are approved, not approved, and even products where approval has been revoked. If the value is &quot;includeAll&quot;, the value of the productId field is therefore ignored. If a value is not supplied, it is interpreted to be &quot;whitelist&quot; for backwards compatibility.
 */
/**
 * @typedef ProductsApproveRequest
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).ApprovalUrlInfo} approvalUrlInfo The approval URL that was shown to the user. Only the permissions shown to the user with that URL will be accepted, which may not be the product&#39;s entire set of permissions. For example, the URL may only display new permissions from an update after the product was approved, or not include new permissions if the product was updated since the URL was generated.
 */
/**
 * @typedef ProductsGenerateApprovalUrlResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} url A URL that can be rendered in an iframe to display the permissions (if any) of a product. This URL can be used to approve the product only once and only within 24 hours of being generated, using the Products.approve call. If the product is currently unapproved and has no permissions, this URL will point to an empty page. If the product is currently approved, a URL will only be generated if that product has added permissions since it was last approved, and the URL will only display those new permissions that have not yet been accepted.
 */
/**
 * @typedef ProductsListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#productsListResponse&quot;.
 * @property {androidenterprise(v1).PageInfo} pageInfo General pagination information.
 * @property {androidenterprise(v1).Product[]} product Information about a product (e.g. an app) in the Google Play store, for display to an enterprise admin.
 * @property {androidenterprise(v1).TokenPagination} tokenPagination Pagination information for token pagination.
 */
/**
 * @typedef ServiceAccount
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).ServiceAccountKey} key Credentials that can be used to authenticate as this ServiceAccount.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#serviceAccount&quot;.
 * @property {string} name The account name of the service account, in the form of an email address. Assigned by the server.
 */
/**
 * @typedef ServiceAccountKey
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} data The body of the private key credentials file, in string format. This is only populated when the ServiceAccountKey is created, and is not stored by Google.
 * @property {string} id An opaque, unique identifier for this ServiceAccountKey. Assigned by the server.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#serviceAccountKey&quot;.
 * @property {string} publicData Public key data for the credentials file. This is an X.509 cert. If you are using the googleCredentials key type, this is identical to the cert that can be retrieved by using the X.509 cert url inside of the credentials file.
 * @property {string} type The file format of the generated key data.
 */
/**
 * @typedef ServiceAccountKeysListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).ServiceAccountKey[]} serviceAccountKey The service account credentials.
 */
/**
 * @typedef SignupInfo
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} completionToken An opaque token that will be required, along with the Enterprise Token, for obtaining the enterprise resource from CompleteSignup.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#signupInfo&quot;.
 * @property {string} url A URL under which the Admin can sign up for an enterprise. The page pointed to cannot be rendered in an iframe.
 */
/**
 * @typedef StoreCluster
 * @memberOf! androidenterprise(v1)
 * @type object
* @property {string} id Unique ID of this cluster. Assigned by the server. Immutable once assigned.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#storeCluster&quot;.
* @property {androidenterprise(v1).LocalizedText[]} name Ordered list of localized strings giving the name of this page. The text displayed is the one that best matches the user locale, or the first entry if there is no good match. There needs to be at least one entry.
* @property {string} orderInPage String (US-ASCII only) used to determine order of this cluster within the parent page&#39;s elements. Page elements are sorted in lexicographic order of this field. Duplicated values are allowed, but ordering between elements with duplicate order is undefined.

The value of this field is never visible to a user, it is used solely for the purpose of defining an ordering. Maximum length is 256 characters.
* @property {string[]} productId List of products in the order they are displayed in the cluster. There should not be duplicates within a cluster.
*/
/**
 * @typedef StoreLayout
 * @memberOf! androidenterprise(v1)
 * @type object
* @property {string} homepageId The ID of the store page to be used as the homepage. The homepage will be used as the first page shown in the managed Google Play store.

If a homepage has not been set, the Play store shown on devices will be empty. Not specifying a homepage on a store layout effectively empties the store.

If there exists at least one page, this field must be set to the ID of a valid page.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#storeLayout&quot;.
* @property {string} storeLayoutType The store layout type. By default, this value is set to &quot;basic&quot;. If set to &quot;custom&quot;, &quot;homepageId&quot; must be specified. If set to &quot;basic&quot;, the layout will consist of all approved apps accessible by the user, split in pages of 100 each; in this case, &quot;homepageId&quot; must not be specified. The &quot;basic&quot; setting takes precedence over any existing collections setup for this enterprise (if any). Should the enterprise use collectionViewers for controlling access rights, these will still be respected.
*/
/**
 * @typedef StoreLayoutClustersListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {androidenterprise(v1).StoreCluster[]} cluster A store cluster of an enterprise.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#storeLayoutClustersListResponse&quot;.
 */
/**
 * @typedef StoreLayoutPagesListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#storeLayoutPagesListResponse&quot;.
 * @property {androidenterprise(v1).StorePage[]} page A store page of an enterprise.
 */
/**
 * @typedef StorePage
 * @memberOf! androidenterprise(v1)
 * @type object
* @property {string} id Unique ID of this page. Assigned by the server. Immutable once assigned.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#storePage&quot;.
* @property {string[]} link Ordered list of pages a user should be able to reach from this page. The pages must exist, must not be this page, and once a link is created the page linked to cannot be deleted until all links to it are removed. It is recommended that the basic pages are created first, before adding the links between pages.

No attempt is made to verify that all pages are reachable from the homepage.
* @property {androidenterprise(v1).LocalizedText[]} name Ordered list of localized strings giving the name of this page. The text displayed is the one that best matches the user locale, or the first entry if there is no good match. There needs to be at least one entry.
*/
/**
 * @typedef TokenPagination
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} nextPageToken 
 * @property {string} previousPageToken 
 */
/**
 * @typedef User
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} accountIdentifier A unique identifier you create for this user, such as &quot;user342&quot; or &quot;asset#44418&quot;. Do not use personally identifiable information (PII) for this property. Must always be set for EMM-managed users. Not set for Google-managed users.
 * @property {string} accountType The type of account that this user represents. A userAccount can be installed on multiple devices, but a deviceAccount is specific to a single device. An EMM-managed user (emmManaged) can be either type (userAccount, deviceAccount), but a Google-managed user (googleManaged) is always a userAccount.
 * @property {string} displayName The name that will appear in user interfaces. Setting this property is optional when creating EMM-managed users. If you do set this property, use something generic about the organization (such as &quot;Example, Inc.&quot;) or your name (as EMM). Not used for Google-managed user accounts.
 * @property {string} id The unique ID for the user.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#user&quot;.
 * @property {string} managementType The entity that manages the user. With googleManaged users, the source of truth is Google so EMMs have to make sure a Google Account exists for the user. With emmManaged users, the EMM is in charge.
 * @property {string} primaryEmail The user&#39;s primary email address, for example, &quot;jsmith@example.com&quot;. Will always be set for Google managed users and not set for EMM managed users.
 */
/**
 * @typedef UserToken
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#userToken&quot;.
 * @property {string} token The token (activation code) to be entered by the user. This consists of a sequence of decimal digits. Note that the leading digit may be 0.
 * @property {string} userId The unique ID for the user.
 */
/**
 * @typedef UsersListResponse
 * @memberOf! androidenterprise(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidenterprise#usersListResponse&quot;.
 * @property {androidenterprise(v1).User[]} user A user of an enterprise.
 */
module.exports = Androidenterprise;
