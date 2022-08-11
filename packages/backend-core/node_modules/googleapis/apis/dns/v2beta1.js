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
 * Google Cloud DNS API
 *
 * Configures and serves authoritative DNS records.
 *
 * @example
 * var google = require('googleapis');
 * var dns = google.dns('v2beta1');
 *
 * @namespace dns
 * @type {Function}
 * @version v2beta1
 * @variation v2beta1
 * @param {object=} options Options for Dns
 */
function Dns(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.changes = {

    /**
     * dns.changes.create
     *
     * @desc Atomically update the ResourceRecordSet collection.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'create' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.changes.create(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.changes.create
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v2beta1).Change} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/changes',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.changes.get
     *
     * @desc Fetch the representation of an existing Change.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     // * The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
     *     changeId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.changes.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.changes.get
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.changeId The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/changes/{changeId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone', 'changeId'],
        pathParams: ['changeId', 'managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.changes.list
     *
     * @desc Enumerate Changes to a ResourceRecordSet collection.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *
     *   var recur = function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *       if (result.nextPageToken) {
     *         request.pageToken = result.nextPageToken;
     *         dns.changes.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   dns.changes.list(request, recur);
     * });
     *
     * @alias dns.changes.list
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
     * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {string=} params.sortBy Sorting criterion. The only supported value is change sequence.
     * @param {string=} params.sortOrder Sorting order direction: 'ascending' or 'descending'.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/changes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.dnsKeys = {

    /**
     * dns.dnsKeys.get
     *
     * @desc Fetch the representation of an existing DnsKey.
     *
     * @alias dns.dnsKeys.get
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string=} params.digestType An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
     * @param {string} params.dnsKeyId The identifier of the requested DnsKey.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/dnsKeys/{dnsKeyId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone', 'dnsKeyId'],
        pathParams: ['dnsKeyId', 'managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.dnsKeys.list
     *
     * @desc Enumerate DnsKeys to a ResourceRecordSet collection.
     *
     * @alias dns.dnsKeys.list
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.digestType An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
     * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/dnsKeys',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.managedZoneOperations = {

    /**
     * dns.managedZoneOperations.get
     *
     * @desc Fetch the representation of an existing Operation.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request.
     *     managedZone: "",
     *
     *     // * Identifies the operation addressed by this request.
     *     operation: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZoneOperations.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZoneOperations.get
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request.
     * @param {string} params.operation Identifies the operation addressed by this request.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone', 'operation'],
        pathParams: ['managedZone', 'operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZoneOperations.list
     *
     * @desc Enumerate Operations for the given ManagedZone.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request.
     *     managedZone: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *
     *   var recur = function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *       if (result.nextPageToken) {
     *         request.pageToken = result.nextPageToken;
     *         dns.managedZoneOperations.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   dns.managedZoneOperations.list(request, recur);
     * });
     *
     * @alias dns.managedZoneOperations.list
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.managedZone Identifies the managed zone addressed by this request.
     * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
     * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {string=} params.sortBy Sorting criterion. The only supported values are START_TIME and ID.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.managedZones = {

    /**
     * dns.managedZones.create
     *
     * @desc Create a new ManagedZone.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'create' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZones.create(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZones.create
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v2beta1).ManagedZone} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZones.delete
     *
     * @desc Delete a previously created ManagedZone.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'delete' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZones.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZones.delete
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZones.get
     *
     * @desc Fetch the representation of an existing ManagedZone.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZones.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZones.get
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZones.list
     *
     * @desc Enumerate ManagedZones that have been created but not yet deleted.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *
     *   var recur = function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *       if (result.nextPageToken) {
     *         request.pageToken = result.nextPageToken;
     *         dns.managedZones.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   dns.managedZones.list(request, recur);
     * });
     *
     * @alias dns.managedZones.list
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.dnsName Restricts the list to return only zones with this domain name.
     * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
     * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZones.patch
     *
     * @desc Update an existing ManagedZone. This method supports patch semantics.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'patch' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZones.patch(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZones.patch
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v2beta1).ManagedZone} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dns.managedZones.update
     *
     * @desc Update an existing ManagedZone.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'update' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.managedZones.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.managedZones.update
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v2beta1).ManagedZone} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.projects = {

    /**
     * dns.projects.get
     *
     * @desc Fetch the representation of an existing Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dns.projects.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dns.projects.get
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
     * @param {string} params.project Identifies the project addressed by this request.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.resourceRecordSets = {

    /**
     * dns.resourceRecordSets.list
     *
     * @desc Enumerate ResourceRecordSets that have been created but not yet deleted.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud DNS API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dns
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var dns = google.dns('v2beta1');
     *
     * google.auth.getApplicationDefault(function(err, authClient) {
     *   if (err) {
     *     console.log('Authentication failed because of ', err);
     *     return;
     *   }
     *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
     *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
     *     authClient = authClient.createScoped(scopes);
     *   }
     *
     *   var request = {
     *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
     *
     *     // * Identifies the project addressed by this request.
     *     project: "",
     *
     *     // * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     *     managedZone: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *
     *   var recur = function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *       if (result.nextPageToken) {
     *         request.pageToken = result.nextPageToken;
     *         dns.resourceRecordSets.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   dns.resourceRecordSets.list(request, recur);
     * });
     *
     * @alias dns.resourceRecordSets.list
     * @memberOf! dns(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
     * @param {string=} params.name Restricts the list to return only records with this fully qualified domain name.
     * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {string=} params.type Restricts the list to return only records of this type. If present, the "name" parameter must also be present.
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
          url: 'https://www.googleapis.com/dns/v2beta1/projects/{project}/managedZones/{managedZone}/rrsets',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'managedZone'],
        pathParams: ['managedZone', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Change
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).ResourceRecordSet[]} additions Which ResourceRecordSets to add?
 * @property {dns(v2beta1).ResourceRecordSet[]} deletions Which ResourceRecordSets to remove? Must match existing data exactly.
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {boolean} isServing If the DNS queries for the zone will be served.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#change&quot;.
 * @property {string} startTime The time that this operation was started by the server (output only). This is in RFC3339 text format.
 * @property {string} status Status of the operation (output only).
 */
/**
 * @typedef ChangesListResponse
 * @memberOf! dns(v2beta1)
 * @type object
* @property {dns(v2beta1).Change[]} changes The requested changes.
* @property {dns(v2beta1).ResponseHeader} header 
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a &quot;snapshot&quot; of collections larger than the maximum page size.
*/
/**
 * @typedef DnsKey
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} algorithm String mnemonic specifying the DNSSEC algorithm of this key. Immutable after creation time.
 * @property {string} creationTime The time that this resource was created in the control plane. This is in RFC3339 text format. Output only.
 * @property {string} description A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the resource&#39;s function.
 * @property {dns(v2beta1).DnsKeyDigest[]} digests Cryptographic hashes of the DNSKEY resource record associated with this DnsKey. These digests are needed to construct a DS record that points at this DNS key. Output only.
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {boolean} isActive Active keys will be used to sign subsequent changes to the ManagedZone. Inactive keys will still be present as DNSKEY Resource Records for the use of resolvers validating existing signatures.
 * @property {integer} keyLength Length of the key in bits. Specified at creation time then immutable.
 * @property {integer} keyTag The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone&#39;s DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#dnsKey&quot;.
 * @property {string} publicKey Base64 encoded public half of this key. Output only.
 * @property {string} type One of &quot;KEY_SIGNING&quot; or &quot;ZONE_SIGNING&quot;. Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, will be used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag will be cleared and this key will be used to sign only resource record sets of other types. Immutable after creation time.
 */
/**
 * @typedef DnsKeyDigest
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} digest The base-16 encoded bytes of this digest. Suitable for use in a DS resource record.
 * @property {string} type Specifies the algorithm used to calculate this digest.
 */
/**
 * @typedef DnsKeySpec
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} algorithm String mnemonic specifying the DNSSEC algorithm of this key.
 * @property {integer} keyLength Length of the keys in bits.
 * @property {string} keyType One of &quot;KEY_SIGNING&quot; or &quot;ZONE_SIGNING&quot;. Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, will be used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag will be cleared and this key will be used to sign only resource record sets of other types.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#dnsKeySpec&quot;.
 */
/**
 * @typedef DnsKeysListResponse
 * @memberOf! dns(v2beta1)
 * @type object
* @property {dns(v2beta1).DnsKey[]} dnsKeys The requested resources.
* @property {dns(v2beta1).ResponseHeader} header 
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a &quot;snapshot&quot; of collections larger than the maximum page size.
*/
/**
 * @typedef ManagedZone
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} creationTime The time that this resource was created on the server. This is in RFC3339 text format. Output only.
 * @property {string} description A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the managed zone&#39;s function.
 * @property {string} dnsName The DNS name of this managed zone, for instance &quot;example.com.&quot;.
 * @property {dns(v2beta1).ManagedZoneDnsSecConfig} dnssecConfig DNSSEC configuration.
 * @property {string} id Unique identifier for the resource; defined by the server (output only)
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#managedZone&quot;.
 * @property {string} name User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.
 * @property {string} nameServerSet Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users will leave this field unset.
 * @property {string[]} nameServers Delegate your managed_zone to these virtual name servers; defined by the server (output only)
 */
/**
 * @typedef ManagedZoneDnsSecConfig
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).DnsKeySpec[]} defaultKeySpecs Specifies parameters that will be used for generating initial DnsKeys for this ManagedZone. Output only while state is not OFF.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#managedZoneDnsSecConfig&quot;.
 * @property {string} nonExistence Specifies the mechanism used to provide authenticated denial-of-existence responses. Output only while state is not OFF.
 * @property {string} state Specifies whether DNSSEC is enabled, and what mode it is in.
 */
/**
 * @typedef ManagedZoneOperationsListResponse
 * @memberOf! dns(v2beta1)
 * @type object
* @property {dns(v2beta1).ResponseHeader} header 
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
* @property {dns(v2beta1).Operation[]} operations The operation resources.
*/
/**
 * @typedef ManagedZonesDeleteResponse
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).ResponseHeader} header 
 */
/**
 * @typedef ManagedZonesListResponse
 * @memberOf! dns(v2beta1)
 * @type object
* @property {dns(v2beta1).ResponseHeader} header 
* @property {string} kind Type of resource.
* @property {dns(v2beta1).ManagedZone[]} managedZones The managed zone resources.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
*/
/**
 * @typedef Operation
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).OperationDnsKeyContext} dnsKeyContext Only populated if the operation targeted a DnsKey (output only).
 * @property {string} id Unique identifier for the resource. This is the client_operation_id if the client specified it when the mutation was initiated, otherwise, it is generated by the server. The name must be 1-63 characters long and match the regular expression [-a-z0-9]? (output only)
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#operation&quot;.
 * @property {string} startTime The time that this operation was started by the server. This is in RFC3339 text format (output only).
 * @property {string} status Status of the operation. Can be one of the following: &quot;PENDING&quot; or &quot;DONE&quot; (output only).
 * @property {string} type Type of the operation. Operations include insert, update, and delete (output only).
 * @property {string} user User who requested the operation, for example: user@example.com. cloud-dns-system for operations automatically done by the system. (output only)
 * @property {dns(v2beta1).OperationManagedZoneContext} zoneContext Only populated if the operation targeted a ManagedZone (output only).
 */
/**
 * @typedef OperationDnsKeyContext
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).DnsKey} newValue The post-operation DnsKey resource.
 * @property {dns(v2beta1).DnsKey} oldValue The pre-operation DnsKey resource.
 */
/**
 * @typedef OperationManagedZoneContext
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {dns(v2beta1).ManagedZone} newValue The post-operation ManagedZone resource.
 * @property {dns(v2beta1).ManagedZone} oldValue The pre-operation ManagedZone resource.
 */
/**
 * @typedef Project
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} id User assigned unique identifier for the resource (output only).
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#project&quot;.
 * @property {string} number Unique numeric identifier for the resource; defined by the server (output only).
 * @property {dns(v2beta1).Quota} quota Quotas assigned to this project (output only).
 */
/**
 * @typedef Quota
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {integer} dnsKeysPerManagedZone Maximum allowed number of DnsKeys per ManagedZone.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#quota&quot;.
 * @property {integer} managedZones Maximum allowed number of managed zones in the project.
 * @property {integer} resourceRecordsPerRrset Maximum allowed number of ResourceRecords per ResourceRecordSet.
 * @property {integer} rrsetAdditionsPerChange Maximum allowed number of ResourceRecordSets to add per ChangesCreateRequest.
 * @property {integer} rrsetDeletionsPerChange Maximum allowed number of ResourceRecordSets to delete per ChangesCreateRequest.
 * @property {integer} rrsetsPerManagedZone Maximum allowed number of ResourceRecordSets per zone in the project.
 * @property {integer} totalRrdataSizePerChange Maximum allowed size for total rrdata in one ChangesCreateRequest in bytes.
 * @property {dns(v2beta1).DnsKeySpec[]} whitelistedKeySpecs DNSSEC algorithm and key length types that can be used for DnsKeys.
 */
/**
 * @typedef ResourceRecordSet
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#resourceRecordSet&quot;.
 * @property {string} name For example, www.example.com.
 * @property {string[]} rrdatas As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1).
 * @property {string[]} signatureRrdatas As defined in RFC 4034 (section 3.2).
 * @property {integer} ttl Number of seconds that this ResourceRecordSet can be cached by resolvers.
 * @property {string} type The identifier of a supported record type, for example, A, AAAA, MX, TXT, and so on.
 */
/**
 * @typedef ResourceRecordSetsListResponse
 * @memberOf! dns(v2beta1)
 * @type object
* @property {dns(v2beta1).ResponseHeader} header 
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
* @property {dns(v2beta1).ResourceRecordSet[]} rrsets The resource record set resources.
*/
/**
 * @typedef ResponseHeader
 * @memberOf! dns(v2beta1)
 * @type object
 * @property {string} operationId For mutating operation requests that completed successfully. This is the client_operation_id if the client specified it, otherwise it is generated by the server (output only).
 */
module.exports = Dns;
