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
 * var dns = google.dns('v1');
 *
 * @namespace dns
 * @type {Function}
 * @version v1
 * @variation v1
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v1).Change} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}/changes',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.changeId The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}/changes/{changeId}',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}/changes',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Identifies the project addressed by this request.
     * @param {dns(v1).ManagedZone} params.resource Request body data
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}',
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
     * var dns = google.dns('v1');
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
     * @memberOf! dns(v1)
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
          url: 'https://www.googleapis.com/dns/v1/projects/{project}/managedZones/{managedZone}/rrsets',
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
 * @memberOf! dns(v1)
 * @type object
 * @property {dns(v1).ResourceRecordSet[]} additions Which ResourceRecordSets to add?
 * @property {dns(v1).ResourceRecordSet[]} deletions Which ResourceRecordSets to remove? Must match existing data exactly.
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#change&quot;.
 * @property {string} startTime The time that this operation was started by the server (output only). This is in RFC3339 text format.
 * @property {string} status Status of the operation (output only).
 */
/**
 * @typedef ChangesListResponse
 * @memberOf! dns(v1)
 * @type object
* @property {dns(v1).Change[]} changes The requested changes.
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a &quot;snapshot&quot; of collections larger than the maximum page size.
*/
/**
 * @typedef ManagedZone
 * @memberOf! dns(v1)
 * @type object
 * @property {string} creationTime The time that this resource was created on the server. This is in RFC3339 text format. Output only.
 * @property {string} description A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the managed zone&#39;s function.
 * @property {string} dnsName The DNS name of this managed zone, for instance &quot;example.com.&quot;.
 * @property {string} id Unique identifier for the resource; defined by the server (output only)
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#managedZone&quot;.
 * @property {string} name User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.
 * @property {string} nameServerSet Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users will leave this field unset.
 * @property {string[]} nameServers Delegate your managed_zone to these virtual name servers; defined by the server (output only)
 */
/**
 * @typedef ManagedZonesListResponse
 * @memberOf! dns(v1)
 * @type object
* @property {string} kind Type of resource.
* @property {dns(v1).ManagedZone[]} managedZones The managed zone resources.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
*/
/**
 * @typedef Project
 * @memberOf! dns(v1)
 * @type object
 * @property {string} id User assigned unique identifier for the resource (output only).
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#project&quot;.
 * @property {string} number Unique numeric identifier for the resource; defined by the server (output only).
 * @property {dns(v1).Quota} quota Quotas assigned to this project (output only).
 */
/**
 * @typedef Quota
 * @memberOf! dns(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#quota&quot;.
 * @property {integer} managedZones Maximum allowed number of managed zones in the project.
 * @property {integer} resourceRecordsPerRrset Maximum allowed number of ResourceRecords per ResourceRecordSet.
 * @property {integer} rrsetAdditionsPerChange Maximum allowed number of ResourceRecordSets to add per ChangesCreateRequest.
 * @property {integer} rrsetDeletionsPerChange Maximum allowed number of ResourceRecordSets to delete per ChangesCreateRequest.
 * @property {integer} rrsetsPerManagedZone Maximum allowed number of ResourceRecordSets per zone in the project.
 * @property {integer} totalRrdataSizePerChange Maximum allowed size for total rrdata in one ChangesCreateRequest in bytes.
 */
/**
 * @typedef ResourceRecordSet
 * @memberOf! dns(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dns#resourceRecordSet&quot;.
 * @property {string} name For example, www.example.com.
 * @property {string[]} rrdatas As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1).
 * @property {integer} ttl Number of seconds that this ResourceRecordSet can be cached by resolvers.
 * @property {string} type The identifier of a supported record type, for example, A, AAAA, MX, TXT, and so on.
 */
/**
 * @typedef ResourceRecordSetsListResponse
 * @memberOf! dns(v1)
 * @type object
* @property {string} kind Type of resource.
* @property {string} nextPageToken The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.

In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
* @property {dns(v1).ResourceRecordSet[]} rrsets The resource record set resources.
*/
module.exports = Dns;
