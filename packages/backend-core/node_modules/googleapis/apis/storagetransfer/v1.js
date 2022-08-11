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
 * Google Storage Transfer API
 *
 * Transfers data from external data sources to a Google Cloud Storage bucket or between Google Cloud Storage buckets.
 *
 * @example
 * var google = require('googleapis');
 * var storagetransfer = google.storagetransfer('v1');
 *
 * @namespace storagetransfer
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Storagetransfer
 */
function Storagetransfer(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.googleServiceAccounts = {

    /**
     * storagetransfer.googleServiceAccounts.get
     *
     * @desc Returns the Google service account that is used by Storage Transfer Service to access buckets in the project where transfers run or in other projects. Each Google service account is associated with one Google Developers Console project. Users should add this service account to the Google Cloud Storage bucket ACLs to grant access to Storage Transfer Service. This service account is created and owned by Storage Transfer Service and can only be used by Storage Transfer Service.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The ID of the Google Developers Console project that the Google service account is associated
     *     //   with. Required.
     *     projectId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.googleServiceAccounts.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.googleServiceAccounts.get
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The ID of the Google Developers Console project that the Google service account is associated with. Required.
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
          url: 'https://storagetransfer.googleapis.com/v1/googleServiceAccounts/{projectId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.v1 = {

    /**
     * storagetransfer.getGoogleServiceAccount
     *
     * @desc Returns the Google service account that is used by Storage Transfer Service to access buckets in the project where transfers run or in other projects. Each Google service account is associated with one Google Developers Console project. Users should add this service account to the Google Cloud Storage bucket ACLs to grant access to Storage Transfer Service. This service account is created and owned by Storage Transfer Service and can only be used by Storage Transfer Service.
     *
     * @alias storagetransfer.getGoogleServiceAccount
     * @memberOf! storagetransfer(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.projectId The ID of the Google Developers Console project that the Google service account is associated with. Required.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getGoogleServiceAccount: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://storagetransfer.googleapis.com/v1:getGoogleServiceAccount',
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

  self.transferJobs = {

    /**
     * storagetransfer.transferJobs.create
     *
     * @desc Creates a transfer job that runs periodically.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferJobs.create(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferJobs.create
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {storagetransfer(v1).TransferJob} params.resource Request body data
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
          url: 'https://storagetransfer.googleapis.com/v1/transferJobs',
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
     * storagetransfer.transferJobs.patch
     *
     * @desc Updates a transfer job. Updating a job's transfer spec does not affect transfer operations that are running already. Updating the scheduling of a job is not allowed.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The name of job to update. Required.
     *     jobName: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferJobs.patch(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferJobs.patch
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.jobName The name of job to update. Required.
     * @param {storagetransfer(v1).UpdateTransferJobRequest} params.resource Request body data
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
          url: 'https://storagetransfer.googleapis.com/v1/{jobName}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['jobName'],
        pathParams: ['jobName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferJobs.get
     *
     * @desc Gets a transfer job.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The job to get. Required.
     *     jobName: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferJobs.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferJobs.get
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.jobName The job to get. Required.
     * @param {string=} params.projectId The ID of the Google Developers Console project that owns the job. Required.
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
          url: 'https://storagetransfer.googleapis.com/v1/{jobName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['jobName'],
        pathParams: ['jobName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferJobs.list
     *
     * @desc Lists transfer jobs.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *         storagetransfer.transferJobs.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   storagetransfer.transferJobs.list(request, recur);
     * });
     *
     * @alias storagetransfer.transferJobs.list
     * @memberOf! storagetransfer(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.filter A list of query parameters specified as JSON text in the form of {"`project_id`":"my_project_id", "`job_names`":["jobid1","jobid2",...], "`job_statuses`":["status1","status2",...]}. Since `job_names` and `job_statuses` support multiple values, their values must be specified with array notation. `project_id` is required. `job_names` and `job_statuses` are optional. The valid values for `job_statuses` are case-insensitive: `ENABLED`, `DISABLED`, and `DELETED`.
     * @param {integer=} params.pageSize The list page size. The max allowed value is 256.
     * @param {string=} params.pageToken The list page token.
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
          url: 'https://storagetransfer.googleapis.com/v1/transferJobs',
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

  self.transferOperations = {

    /**
     * storagetransfer.transferOperations.pause
     *
     * @desc Pauses a transfer operation.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'pause' method:
     *
     *     // * The name of the transfer operation. Required.
     *     name: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferOperations.pause(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferOperations.pause
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the transfer operation. Required.
     * @param {storagetransfer(v1).PauseTransferOperationRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    pause: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://storagetransfer.googleapis.com/v1/{name}:pause',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferOperations.resume
     *
     * @desc Resumes a transfer operation that is paused.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'resume' method:
     *
     *     // * The name of the transfer operation. Required.
     *     name: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferOperations.resume(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferOperations.resume
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the transfer operation. Required.
     * @param {storagetransfer(v1).ResumeTransferOperationRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resume: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://storagetransfer.googleapis.com/v1/{name}:resume',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferOperations.get
     *
     * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The name of the operation resource.
     *     name: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferOperations.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferOperations.get
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource.
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
          url: 'https://storagetransfer.googleapis.com/v1/{name}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferOperations.list
     *
     * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The value `transferOperations`.
     *     name: "",
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
     *         storagetransfer.transferOperations.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   storagetransfer.transferOperations.list(request, recur);
     * });
     *
     * @alias storagetransfer.transferOperations.list
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The value `transferOperations`.
     * @param {string=} params.filter The standard list filter.
     * @param {integer=} params.pageSize The standard list page size.
     * @param {string=} params.pageToken The standard list page token.
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
          url: 'https://storagetransfer.googleapis.com/v1/{name}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferOperations.cancel
     *
     * @desc Cancels a transfer. Use the get method to check whether the cancellation succeeded or whether the operation completed despite cancellation.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'cancel' method:
     *
     *     // * The name of the operation resource to be cancelled.
     *     name: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferOperations.cancel(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferOperations.cancel
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
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
          url: 'https://storagetransfer.googleapis.com/v1/{name}:cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storagetransfer.transferOperations.delete
     *
     * @desc This method is not supported and the server returns `UNIMPLEMENTED`.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Storage Transfer API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/storagetransfer
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var storagetransfer = google.storagetransfer('v1');
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
     *     // * The name of the operation resource to be deleted.
     *     name: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   storagetransfer.transferOperations.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias storagetransfer.transferOperations.delete
     * @memberOf! storagetransfer(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be deleted.
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
          url: 'https://storagetransfer.googleapis.com/v1/{name}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef GoogleServiceAccount
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} accountEmail Required.
 */
/**
 * @typedef TransferJob
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} name A globally unique name assigned by Storage Transfer Service when the job is created. This field should be left empty in requests to create a new transfer job; otherwise, the requests result in an `INVALID_ARGUMENT` error.
 * @property {string} description A description provided by the user for the job. Its max length is 1024 bytes when Unicode-encoded.
 * @property {string} projectId The ID of the Google Developers Console project that owns the job. Required.
 * @property {storagetransfer(v1).TransferSpec} transferSpec Transfer specification. Required.
 * @property {storagetransfer(v1).Schedule} schedule Schedule specification. Required.
 * @property {string} status Status of the job. This value MUST be specified for `CreateTransferJobRequests`. NOTE: The effect of the new job status takes place during a subsequent job run. For example, if you change the job status from `ENABLED` to `DISABLED`, and an operation spawned by the transfer is running, the status change would not affect the current operation.
 * @property {string} creationTime This field cannot be changed by user requests.
 * @property {string} lastModificationTime This field cannot be changed by user requests.
 * @property {string} deletionTime This field cannot be changed by user requests.
 */
/**
 * @typedef TransferSpec
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {storagetransfer(v1).GcsData} gcsDataSource A Google Cloud Storage data source.
 * @property {storagetransfer(v1).AwsS3Data} awsS3DataSource An AWS S3 data source.
 * @property {storagetransfer(v1).HttpData} httpDataSource An HTTP URL data source.
 * @property {storagetransfer(v1).GcsData} gcsDataSink A Google Cloud Storage data sink.
 * @property {storagetransfer(v1).ObjectConditions} objectConditions Only objects that satisfy these object conditions are included in the set of data source and data sink objects. Object conditions based on objects&#39; `lastModificationTime` do not exclude objects in a data sink.
 * @property {storagetransfer(v1).TransferOptions} transferOptions If the option `deleteObjectsUniqueInSink` is `true`, object conditions based on objects&#39; `lastModificationTime` are ignored and do not exclude objects in a data source or a data sink.
 */
/**
 * @typedef GcsData
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} bucketName Google Cloud Storage bucket name (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)). Required.
 */
/**
 * @typedef AwsS3Data
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} bucketName S3 Bucket name (see [Creating a bucket](http://docs.aws.amazon.com/AmazonS3/latest/dev/create-bucket-get-location-example.html)). Required.
 * @property {storagetransfer(v1).AwsAccessKey} awsAccessKey AWS access key used to sign the API requests to the AWS S3 bucket. Permissions on the bucket must be granted to the access ID of the AWS access key. Required.
 */
/**
 * @typedef AwsAccessKey
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} accessKeyId AWS access key ID. Required.
 * @property {string} secretAccessKey AWS secret access key. This field is not returned in RPC responses. Required.
 */
/**
 * @typedef HttpData
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} listUrl The URL that points to the file that stores the object list entries. This file must allow public access. Currently, only URLs with HTTP and HTTPS schemes are supported. Required.
 */
/**
 * @typedef ObjectConditions
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} minTimeElapsedSinceLastModification If unspecified, `minTimeElapsedSinceLastModification` takes a zero value and `maxTimeElapsedSinceLastModification` takes the maximum possible value of Duration. Objects that satisfy the object conditions must either have a `lastModificationTime` greater or equal to `NOW` - `maxTimeElapsedSinceLastModification` and less than `NOW` - `minTimeElapsedSinceLastModification`, or not have a `lastModificationTime`.
 * @property {string} maxTimeElapsedSinceLastModification `maxTimeElapsedSinceLastModification` is the complement to `minTimeElapsedSinceLastModification`.
 * @property {string[]} includePrefixes If `includePrefixes` is specified, objects that satisfy the object conditions must have names that start with one of the `includePrefixes` and that do not start with any of the `excludePrefixes`. If `includePrefixes` is not specified, all objects except those that have names starting with one of the `excludePrefixes` must satisfy the object conditions. Requirements: * Each include-prefix and exclude-prefix can contain any sequence of Unicode characters, of max length 1024 bytes when UTF8-encoded, and must not contain Carriage Return or Line Feed characters. Wildcard matching and regular expression matching are not supported. * None of the include-prefix or the exclude-prefix values can be empty, if specified. * Each include-prefix must include a distinct portion of the object namespace, i.e., no include-prefix may be a prefix of another include-prefix. * Each exclude-prefix must exclude a distinct portion of the object namespace, i.e., no exclude-prefix may be a prefix of another exclude-prefix. * If `includePrefixes` is specified, then each exclude-prefix must start with the value of a path explicitly included by `includePrefixes`. The max size of `includePrefixes` is 20.
 * @property {string[]} excludePrefixes `excludePrefixes` must follow the requirements described for `includePrefixes`. The max size of `excludePrefixes` is 20.
 */
/**
 * @typedef TransferOptions
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {boolean} overwriteObjectsAlreadyExistingInSink Whether overwriting objects that already exist in the sink is allowed.
 * @property {boolean} deleteObjectsUniqueInSink Whether objects that exist only in the sink should be deleted.
 * @property {boolean} deleteObjectsFromSourceAfterTransfer Whether objects should be deleted from the source after they are transferred to the sink.
 */
/**
 * @typedef Schedule
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {storagetransfer(v1).Date} scheduleStartDate The first day the recurring transfer is scheduled to run. Required.
 * @property {storagetransfer(v1).Date} scheduleEndDate The last day the recurring transfer will be run. If `scheduleEndDate` is the same as `scheduleStartDate`, the transfer will be executed only once.
 * @property {storagetransfer(v1).TimeOfDay} startTimeOfDay The time in UTC at which the transfer will be scheduled to start in a day. Transfers may start later than this time. If not specified, transfers are scheduled to start at midnight UTC.
 */
/**
 * @typedef Date
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {integer} year Year of date. Must be from 1 to 9,999, or 0 if specifying a date without a year.
 * @property {integer} month Month of year of date. Must be from 1 to 12.
 * @property {integer} day Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a year/month where the day is not sigificant.
 */
/**
 * @typedef TimeOfDay
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {integer} hours Hours of day in 24 hour format. Should be from 0 to 23. An API may choose to allow the value &quot;24:00:00&quot; for scenarios like business closing time.
 * @property {integer} minutes Minutes of hour of day. Must be from 0 to 59.
 * @property {integer} seconds Seconds of minutes of the time. Must normally be from 0 to 59. An API may allow the value 60 if it allows leap-seconds.
 * @property {integer} nanos Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999.
 */
/**
 * @typedef UpdateTransferJobRequest
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} projectId The ID of the Google Developers Console project that owns the job. Required.
 * @property {storagetransfer(v1).TransferJob} transferJob The job to update. Required.
 * @property {string} updateTransferJobFieldMask The field mask of the fields in `transferJob` that are to be updated in this request. Fields in `transferJob` that can be updated are: `description`, `transferSpec`, and `status`. To update the `transferSpec` of the job, a complete transfer specification has to be provided. An incomplete specification which misses any required fields will be rejected with the error `INVALID_ARGUMENT`.
 */
/**
 * @typedef ListTransferJobsResponse
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {storagetransfer(v1).TransferJob[]} transferJobs A list of transfer jobs.
 * @property {string} nextPageToken The list next page token.
 */
/**
 * @typedef PauseTransferOperationRequest
 * @memberOf! storagetransfer(v1)
 * @type object
 */
/**
 * @typedef Empty
 * @memberOf! storagetransfer(v1)
 * @type object
 */
/**
 * @typedef ResumeTransferOperationRequest
 * @memberOf! storagetransfer(v1)
 * @type object
 */
/**
 * @typedef Operation
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} name The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping above, the `name` should have the format of `operations/some/unique/name`.
 * @property {object} metadata Represents the transfer operation object.
 * @property {boolean} done If the value is `false`, it means the operation is still in progress. If true, the operation is completed and the `result` is available.
 * @property {storagetransfer(v1).Status} error The error result of the operation in case of failure.
 * @property {object} response The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
 */
/**
 * @typedef Status
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {integer} code The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef ListOperationsResponse
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {storagetransfer(v1).Operation[]} operations A list of operations that matches the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef TransferOperation
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} name A globally unique ID assigned by the system.
 * @property {string} projectId The ID of the Google Developers Console project that owns the operation. Required.
 * @property {storagetransfer(v1).TransferSpec} transferSpec Transfer specification. Required.
 * @property {string} startTime Start time of this transfer execution.
 * @property {string} endTime End time of this transfer execution.
 * @property {string} status Status of the transfer operation.
 * @property {storagetransfer(v1).TransferCounters} counters Information about the progress of the transfer operation.
 * @property {storagetransfer(v1).ErrorSummary[]} errorBreakdowns Summarizes errors encountered with sample error log entries.
 * @property {string} transferJobName The name of the transfer job that triggers this transfer operation.
 */
/**
 * @typedef TransferCounters
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} objectsFoundFromSource Objects found in the data source that are scheduled to be transferred, which will be copied, excluded based on conditions, or skipped due to failures.
 * @property {string} bytesFoundFromSource Bytes found in the data source that are scheduled to be transferred, which will be copied, excluded based on conditions, or skipped due to failures.
 * @property {string} objectsFoundOnlyFromSink Objects found only in the data sink that are scheduled to be deleted.
 * @property {string} bytesFoundOnlyFromSink Bytes found only in the data sink that are scheduled to be deleted.
 * @property {string} objectsFromSourceSkippedBySync Objects in the data source that are not transferred because they already exist in the data sink.
 * @property {string} bytesFromSourceSkippedBySync Bytes in the data source that are not transferred because they already exist in the data sink.
 * @property {string} objectsCopiedToSink Objects that are copied to the data sink.
 * @property {string} bytesCopiedToSink Bytes that are copied to the data sink.
 * @property {string} objectsDeletedFromSource Objects that are deleted from the data source.
 * @property {string} bytesDeletedFromSource Bytes that are deleted from the data source.
 * @property {string} objectsDeletedFromSink Objects that are deleted from the data sink.
 * @property {string} bytesDeletedFromSink Bytes that are deleted from the data sink.
 * @property {string} objectsFromSourceFailed Objects in the data source that failed during the transfer.
 * @property {string} bytesFromSourceFailed Bytes in the data source that failed during the transfer.
 * @property {string} objectsFailedToDeleteFromSink Objects that failed to be deleted from the data sink.
 * @property {string} bytesFailedToDeleteFromSink Bytes that failed to be deleted from the data sink.
 */
/**
 * @typedef ErrorSummary
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} errorCode Required.
 * @property {string} errorCount Count of this type of error. Required.
 * @property {storagetransfer(v1).ErrorLogEntry[]} errorLogEntries Error samples.
 */
/**
 * @typedef ErrorLogEntry
 * @memberOf! storagetransfer(v1)
 * @type object
 * @property {string} url A URL that refers to the target (a data source, a data sink, or an object) with which the error is associated. Required.
 * @property {string[]} errorDetails A list of messages that carry the error details.
 */
module.exports = Storagetransfer;
