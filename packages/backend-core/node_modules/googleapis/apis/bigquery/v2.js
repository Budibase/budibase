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
 * BigQuery API
 *
 * A data platform for customers to create, manage, share and query data.
 *
 * @example
 * var google = require('googleapis');
 * var bigquery = google.bigquery('v2');
 *
 * @namespace bigquery
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Bigquery
 */
function Bigquery(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.datasets = {

    /**
     * bigquery.datasets.delete
     *
     * @desc Deletes the dataset specified by the datasetId value. Before you can delete a dataset, you must delete all its tables, either manually or by specifying deleteContents. Immediately after deletion, you can create another dataset with the same name.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the dataset being deleted
     *     projectId: "",
     *
     *     // * Dataset ID of dataset being deleted
     *     datasetId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.datasets.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.datasets.delete
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of dataset being deleted
     * @param {boolean=} params.deleteContents If True, delete all the tables in the dataset. If False and the dataset contains tables, the request will fail. Default is False
     * @param {string} params.projectId Project ID of the dataset being deleted
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.datasets.get
     *
     * @desc Returns the dataset specified by datasetID.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the requested dataset
     *     projectId: "",
     *
     *     // * Dataset ID of the requested dataset
     *     datasetId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.datasets.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.datasets.get
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the requested dataset
     * @param {string} params.projectId Project ID of the requested dataset
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.datasets.insert
     *
     * @desc Creates a new empty dataset.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'insert' method:
     *
     *     // * Project ID of the new dataset
     *     projectId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.datasets.insert(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.datasets.insert
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId Project ID of the new dataset
     * @param {bigquery(v2).Dataset} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.datasets.list
     *
     * @desc Lists all datasets in the specified project to which you have been granted the READER dataset role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the datasets to be listed
     *     projectId: "",
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
     *         bigquery.datasets.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   bigquery.datasets.list(request, recur);
     * });
     *
     * @alias bigquery.datasets.list
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.all Whether to list all datasets, including hidden ones
     * @param {string=} params.filter An expression for filtering the results of the request by label. The syntax is "labels.<name>[:<value>]". Multiple filters can be ANDed together by connecting with a space. Example: "labels.department:receiving labels.active". See Filtering datasets using labels for details.
     * @param {integer=} params.maxResults The maximum number of results to return
     * @param {string=} params.pageToken Page token, returned by a previous call, to request the next page of results
     * @param {string} params.projectId Project ID of the datasets to be listed
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.datasets.patch
     *
     * @desc Updates information in an existing dataset. The update method replaces the entire dataset resource, whereas the patch method only replaces fields that are provided in the submitted dataset resource. This method supports patch semantics.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the dataset being updated
     *     projectId: "",
     *
     *     // * Dataset ID of the dataset being updated
     *     datasetId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.datasets.patch(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.datasets.patch
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the dataset being updated
     * @param {string} params.projectId Project ID of the dataset being updated
     * @param {bigquery(v2).Dataset} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.datasets.update
     *
     * @desc Updates information in an existing dataset. The update method replaces the entire dataset resource, whereas the patch method only replaces fields that are provided in the submitted dataset resource.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the dataset being updated
     *     projectId: "",
     *
     *     // * Dataset ID of the dataset being updated
     *     datasetId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.datasets.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.datasets.update
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the dataset being updated
     * @param {string} params.projectId Project ID of the dataset being updated
     * @param {bigquery(v2).Dataset} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.jobs = {

    /**
     * bigquery.jobs.cancel
     *
     * @desc Requests that a job be cancelled. This call will return immediately, and the client will need to poll for the job status to see if the cancel completed successfully. Cancelled jobs may still incur costs.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * [Required] Project ID of the job to cancel
     *     projectId: "",
     *
     *     // * [Required] Job ID of the job to cancel
     *     jobId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.jobs.cancel(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.jobs.cancel
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.jobId [Required] Job ID of the job to cancel
     * @param {string} params.projectId [Required] Project ID of the job to cancel
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/jobs/{jobId}/cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId', 'jobId'],
        pathParams: ['jobId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.jobs.get
     *
     * @desc Returns information about a specific job. Job information is available for a six month period after creation. Requires that you're the person who ran the job, or have the Is Owner project role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * [Required] Project ID of the requested job
     *     projectId: "",
     *
     *     // * [Required] Job ID of the requested job
     *     jobId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.jobs.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.jobs.get
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.jobId [Required] Job ID of the requested job
     * @param {string} params.projectId [Required] Project ID of the requested job
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/jobs/{jobId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'jobId'],
        pathParams: ['jobId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.jobs.getQueryResults
     *
     * @desc Retrieves the results of a query job.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'getQueryResults' method:
     *
     *     // * [Required] Project ID of the query job
     *     projectId: "",
     *
     *     // * [Required] Job ID of the query job
     *     jobId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.jobs.getQueryResults(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.jobs.getQueryResults
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.jobId [Required] Job ID of the query job
     * @param {integer=} params.maxResults Maximum number of results to read
     * @param {string=} params.pageToken Page token, returned by a previous call, to request the next page of results
     * @param {string} params.projectId [Required] Project ID of the query job
     * @param {string=} params.startIndex Zero-based index of the starting row
     * @param {integer=} params.timeoutMs How long to wait for the query to complete, in milliseconds, before returning. Default is 10 seconds. If the timeout passes before the job completes, the 'jobComplete' field in the response will be false
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getQueryResults: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/queries/{jobId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'jobId'],
        pathParams: ['jobId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.jobs.insert
     *
     * @desc Starts a new asynchronous job. Requires the Can View project role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'insert' method:
     *
     *     // * Project ID of the project that will be billed for the job
     *     projectId: "",
     *
     *     resource: {},
     *
     *     media: {
     *       // See https://github.com/google/google-api-nodejs-client#media-uploads
     *       mimeType: 'text/plain',
     *       body: 'Hello World!'
     *     },
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.jobs.insert(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.jobs.insert
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId Project ID of the project that will be billed for the job
     * @param  {object} params.resource Media resource metadata
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/jobs',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/bigquery/v2/projects/{projectId}/jobs',
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.jobs.list
     *
     * @desc Lists all jobs that you started in the specified project. Job information is available for a six month period after creation. The job list is sorted in reverse chronological order, by job creation time. Requires the Can View project role, or the Is Owner project role if you set the allUsers property.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the jobs to list
     *     projectId: "",
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
     *         bigquery.jobs.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   bigquery.jobs.list(request, recur);
     * });
     *
     * @alias bigquery.jobs.list
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.allUsers Whether to display jobs owned by all users in the project. Default false
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Page token, returned by a previous call, to request the next page of results
     * @param {string} params.projectId Project ID of the jobs to list
     * @param {string=} params.projection Restrict information returned to a set of selected fields
     * @param {string=} params.stateFilter Filter for job state
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/jobs',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.jobs.query
     *
     * @desc Runs a BigQuery SQL query synchronously and returns query results if the query completes within a specified timeout.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'query' method:
     *
     *     // * Project ID of the project billed for the query
     *     projectId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.jobs.query(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.jobs.query
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId Project ID of the project billed for the query
     * @param {bigquery(v2).QueryRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    query: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/queries',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.projects = {

    /**
     * bigquery.projects.list
     *
     * @desc Lists all projects to which you have been granted any project role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *         bigquery.projects.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   bigquery.projects.list(request, recur);
     * });
     *
     * @alias bigquery.projects.list
     * @memberOf! bigquery(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Page token, returned by a previous call, to request the next page of results
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
          url: 'https://www.googleapis.com/bigquery/v2/projects',
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

  self.tabledata = {

    /**
     * bigquery.tabledata.insertAll
     *
     * @desc Streams data into BigQuery one record at a time without needing to run a load job. Requires the WRITER dataset role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'insertAll' method:
     *
     *     // * Project ID of the destination table.
     *     projectId: "",
     *
     *     // * Dataset ID of the destination table.
     *     datasetId: "",
     *
     *     // * Table ID of the destination table.
     *     tableId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tabledata.insertAll(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tabledata.insertAll
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the destination table.
     * @param {string} params.projectId Project ID of the destination table.
     * @param {string} params.tableId Table ID of the destination table.
     * @param {bigquery(v2).TableDataInsertAllRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    insertAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}/insertAll',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tabledata.list
     *
     * @desc Retrieves table data from a specified set of rows. Requires the READER dataset role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the table to read
     *     projectId: "",
     *
     *     // * Dataset ID of the table to read
     *     datasetId: "",
     *
     *     // * Table ID of the table to read
     *     tableId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tabledata.list(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tabledata.list
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the table to read
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Page token, returned by a previous call, identifying the result set
     * @param {string} params.projectId Project ID of the table to read
     * @param {string=} params.startIndex Zero-based index of the starting row to read
     * @param {string} params.tableId Table ID of the table to read
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}/data',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.tables = {

    /**
     * bigquery.tables.delete
     *
     * @desc Deletes the table specified by tableId from the dataset. If the table contains data, all the data will be deleted.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the table to delete
     *     projectId: "",
     *
     *     // * Dataset ID of the table to delete
     *     datasetId: "",
     *
     *     // * Table ID of the table to delete
     *     tableId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tables.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tables.delete
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the table to delete
     * @param {string} params.projectId Project ID of the table to delete
     * @param {string} params.tableId Table ID of the table to delete
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tables.get
     *
     * @desc Gets the specified table resource by table ID. This method does not return the data in the table, it only returns the table resource, which describes the structure of this table.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the requested table
     *     projectId: "",
     *
     *     // * Dataset ID of the requested table
     *     datasetId: "",
     *
     *     // * Table ID of the requested table
     *     tableId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tables.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tables.get
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the requested table
     * @param {string} params.projectId Project ID of the requested table
     * @param {string} params.tableId Table ID of the requested table
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tables.insert
     *
     * @desc Creates a new, empty table in the dataset.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'insert' method:
     *
     *     // * Project ID of the new table
     *     projectId: "",
     *
     *     // * Dataset ID of the new table
     *     datasetId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tables.insert(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tables.insert
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the new table
     * @param {string} params.projectId Project ID of the new table
     * @param {bigquery(v2).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tables.list
     *
     * @desc Lists all tables in the specified dataset. Requires the READER dataset role.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the tables to list
     *     projectId: "",
     *
     *     // * Dataset ID of the tables to list
     *     datasetId: "",
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
     *         bigquery.tables.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   bigquery.tables.list(request, recur);
     * });
     *
     * @alias bigquery.tables.list
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the tables to list
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken Page token, returned by a previous call, to request the next page of results
     * @param {string} params.projectId Project ID of the tables to list
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId'],
        pathParams: ['datasetId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tables.patch
     *
     * @desc Updates information in an existing table. The update method replaces the entire table resource, whereas the patch method only replaces fields that are provided in the submitted table resource. This method supports patch semantics.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the table to update
     *     projectId: "",
     *
     *     // * Dataset ID of the table to update
     *     datasetId: "",
     *
     *     // * Table ID of the table to update
     *     tableId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tables.patch(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tables.patch
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the table to update
     * @param {string} params.projectId Project ID of the table to update
     * @param {string} params.tableId Table ID of the table to update
     * @param {bigquery(v2).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * bigquery.tables.update
     *
     * @desc Updates information in an existing table. The update method replaces the entire table resource, whereas the patch method only replaces fields that are provided in the submitted table resource.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the BigQuery API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/bigquery
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var bigquery = google.bigquery('v2');
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
     *     // * Project ID of the table to update
     *     projectId: "",
     *
     *     // * Dataset ID of the table to update
     *     datasetId: "",
     *
     *     // * Table ID of the table to update
     *     tableId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   bigquery.tables.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias bigquery.tables.update
     * @memberOf! bigquery(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.datasetId Dataset ID of the table to update
     * @param {string} params.projectId Project ID of the table to update
     * @param {string} params.tableId Table ID of the table to update
     * @param {bigquery(v2).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/bigquery/v2/projects/{projectId}/datasets/{datasetId}/tables/{tableId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['projectId', 'datasetId', 'tableId'],
        pathParams: ['datasetId', 'projectId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef BigtableColumn
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} encoding [Optional] The encoding of the values when the type is not STRING. Acceptable encoding values are: TEXT - indicates values are alphanumeric text strings. BINARY - indicates values are encoded using HBase Bytes.toBytes family of functions. &#39;encoding&#39; can also be set at the column family level. However, the setting at this level takes precedence if &#39;encoding&#39; is set at both levels.
 * @property {string} fieldName [Optional] If the qualifier is not a valid BigQuery field identifier i.e. does not match [a-zA-Z][a-zA-Z0-9_]*, a valid identifier must be provided as the column field name and is used as field name in queries.
 * @property {boolean} onlyReadLatest [Optional] If this is set, only the latest version of value in this column are exposed. &#39;onlyReadLatest&#39; can also be set at the column family level. However, the setting at this level takes precedence if &#39;onlyReadLatest&#39; is set at both levels.
 * @property {string} qualifierEncoded [Required] Qualifier of the column. Columns in the parent column family that has this exact qualifier are exposed as . field. If the qualifier is valid UTF-8 string, it can be specified in the qualifier_string field. Otherwise, a base-64 encoded value must be set to qualifier_encoded. The column field name is the same as the column qualifier. However, if the qualifier is not a valid BigQuery field identifier i.e. does not match [a-zA-Z][a-zA-Z0-9_]*, a valid identifier must be provided as field_name.
 * @property {string} qualifierString 
 * @property {string} type [Optional] The type to convert the value in cells of this column. The values are expected to be encoded using HBase Bytes.toBytes function when using the BINARY encoding value. Following BigQuery types are allowed (case-sensitive) - BYTES STRING INTEGER FLOAT BOOLEAN Default type is BYTES. &#39;type&#39; can also be set at the column family level. However, the setting at this level takes precedence if &#39;type&#39; is set at both levels.
 */
/**
 * @typedef BigtableColumnFamily
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).BigtableColumn[]} columns [Optional] Lists of columns that should be exposed as individual fields as opposed to a list of (column name, value) pairs. All columns whose qualifier matches a qualifier in this list can be accessed as .. Other columns can be accessed as a list through .Column field.
 * @property {string} encoding [Optional] The encoding of the values when the type is not STRING. Acceptable encoding values are: TEXT - indicates values are alphanumeric text strings. BINARY - indicates values are encoded using HBase Bytes.toBytes family of functions. This can be overridden for a specific column by listing that column in &#39;columns&#39; and specifying an encoding for it.
 * @property {string} familyId Identifier of the column family.
 * @property {boolean} onlyReadLatest [Optional] If this is set only the latest version of value are exposed for all columns in this column family. This can be overridden for a specific column by listing that column in &#39;columns&#39; and specifying a different setting for that column.
 * @property {string} type [Optional] The type to convert the value in cells of this column family. The values are expected to be encoded using HBase Bytes.toBytes function when using the BINARY encoding value. Following BigQuery types are allowed (case-sensitive) - BYTES STRING INTEGER FLOAT BOOLEAN Default type is BYTES. This can be overridden for a specific column by listing that column in &#39;columns&#39; and specifying a type for it.
 */
/**
 * @typedef BigtableOptions
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).BigtableColumnFamily[]} columnFamilies [Optional] List of column families to expose in the table schema along with their types. This list restricts the column families that can be referenced in queries and specifies their value types. You can use this list to do type conversions - see the &#39;type&#39; field for more details. If you leave this list empty, all column families are present in the table schema and their values are read as BYTES. During a query only the column families referenced in that query are read from Bigtable.
 * @property {boolean} ignoreUnspecifiedColumnFamilies [Optional] If field is true, then the column families that are not specified in columnFamilies list are not exposed in the table schema. Otherwise, they are read with BYTES type values. The default value is false.
 * @property {boolean} readRowkeyAsString [Optional] If field is true, then the rowkey column families will be read and converted to string. Otherwise they are read with BYTES type values and users need to manually cast them with CAST if necessary. The default value is false.
 */
/**
 * @typedef CsvOptions
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} allowJaggedRows [Optional] Indicates if BigQuery should accept rows that are missing trailing optional columns. If true, BigQuery treats missing trailing columns as null values. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false.
 * @property {boolean} allowQuotedNewlines [Optional] Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.
 * @property {string} encoding [Optional] The character encoding of the data. The supported values are UTF-8 or ISO-8859-1. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the quote and fieldDelimiter properties.
 * @property {string} fieldDelimiter [Optional] The separator for fields in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. BigQuery also supports the escape sequence &quot;\t&quot; to specify a tab separator. The default value is a comma (&#39;,&#39;).
 * @property {string} quote [Optional] The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote (&#39;&quot;&#39;). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true.
 * @property {string} skipLeadingRows [Optional] The number of rows at the top of a CSV file that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped.
 */
/**
 * @typedef Dataset
 * @memberOf! bigquery(v2)
 * @type object
 * @property {object[]} access [Optional] An array of objects that define dataset access for one or more entities. You can set this property when inserting or updating a dataset in order to control who is allowed to access the data. If unspecified at dataset creation time, BigQuery adds default dataset access for the following entities: access.specialGroup: projectReaders; access.role: READER; access.specialGroup: projectWriters; access.role: WRITER; access.specialGroup: projectOwners; access.role: OWNER; access.userByEmail: [dataset creator email]; access.role: OWNER;
 * @property {string} creationTime [Output-only] The time when this dataset was created, in milliseconds since the epoch.
 * @property {bigquery(v2).DatasetReference} datasetReference [Required] A reference that identifies the dataset.
 * @property {string} defaultTableExpirationMs [Optional] The default lifetime of all tables in the dataset, in milliseconds. The minimum value is 3600000 milliseconds (one hour). Once this property is set, all newly-created tables in the dataset will have an expirationTime property set to the creation time plus the value in this property, and changing the value will only affect new tables, not existing ones. When the expirationTime for a given table is reached, that table will be deleted automatically. If a table&#39;s expirationTime is modified or removed before the table expires, or if you provide an explicit expirationTime when creating a table, that value takes precedence over the default expiration time indicated by this property.
 * @property {string} description [Optional] A user-friendly description of the dataset.
 * @property {string} etag [Output-only] A hash of the resource.
 * @property {string} friendlyName [Optional] A descriptive name for the dataset.
 * @property {string} id [Output-only] The fully-qualified unique name of the dataset in the format projectId:datasetId. The dataset name without the project name is given in the datasetId field. When creating a new dataset, leave this field blank, and instead specify the datasetId field.
 * @property {string} kind [Output-only] The resource type.
 * @property {object} labels [Experimental] The labels associated with this dataset. You can use these to organize and group your datasets. You can set this property when inserting or updating a dataset. See Labeling Datasets for more information.
 * @property {string} lastModifiedTime [Output-only] The date when this dataset or any of its tables was last modified, in milliseconds since the epoch.
 * @property {string} location [Experimental] The geographic location where the dataset should reside. Possible values include EU and US. The default value is US.
 * @property {string} selfLink [Output-only] A URL that can be used to access the resource again. You can use this URL in Get or Update requests to the resource.
 */
/**
 * @typedef DatasetList
 * @memberOf! bigquery(v2)
 * @type object
 * @property {object[]} datasets An array of the dataset resources in the project. Each resource contains basic information. For full information about a particular dataset resource, use the Datasets: get method. This property is omitted when there are no datasets in the project.
 * @property {string} etag A hash value of the results page. You can use this property to determine if the page has changed since the last request.
 * @property {string} kind The list type. This property always returns the value &quot;bigquery#datasetList&quot;.
 * @property {string} nextPageToken A token that can be used to request the next results page. This property is omitted on the final results page.
 */
/**
 * @typedef DatasetReference
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} datasetId [Required] A unique ID for this dataset, without the project name. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.
 * @property {string} projectId [Optional] The ID of the project containing this dataset.
 */
/**
 * @typedef ErrorProto
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} debugInfo Debugging information. This property is internal to Google and should not be used.
 * @property {string} location Specifies where the error occurred, if present.
 * @property {string} message A human-readable description of the error.
 * @property {string} reason A short error code that summarizes the error.
 */
/**
 * @typedef ExplainQueryStage
 * @memberOf! bigquery(v2)
 * @type object
 * @property {number} computeRatioAvg Relative amount of time the average shard spent on CPU-bound tasks.
 * @property {number} computeRatioMax Relative amount of time the slowest shard spent on CPU-bound tasks.
 * @property {string} id Unique ID for stage within plan.
 * @property {string} name Human-readable name for stage.
 * @property {number} readRatioAvg Relative amount of time the average shard spent reading input.
 * @property {number} readRatioMax Relative amount of time the slowest shard spent reading input.
 * @property {string} recordsRead Number of records read into the stage.
 * @property {string} recordsWritten Number of records written by the stage.
 * @property {bigquery(v2).ExplainQueryStep[]} steps List of operations within the stage in dependency order (approximately chronological).
 * @property {number} waitRatioAvg Relative amount of time the average shard spent waiting to be scheduled.
 * @property {number} waitRatioMax Relative amount of time the slowest shard spent waiting to be scheduled.
 * @property {number} writeRatioAvg Relative amount of time the average shard spent on writing output.
 * @property {number} writeRatioMax Relative amount of time the slowest shard spent on writing output.
 */
/**
 * @typedef ExplainQueryStep
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} kind Machine-readable operation type.
 * @property {string[]} substeps Human-readable stage descriptions.
 */
/**
 * @typedef ExternalDataConfiguration
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} autodetect [Experimental] Try to detect schema and format options automatically. Any option specified explicitly will be honored.
 * @property {bigquery(v2).BigtableOptions} bigtableOptions [Optional] Additional options if sourceFormat is set to BIGTABLE.
 * @property {string} compression [Optional] The compression type of the data source. Possible values include GZIP and NONE. The default value is NONE. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups and Avro formats.
 * @property {bigquery(v2).CsvOptions} csvOptions Additional properties to set if sourceFormat is set to CSV.
 * @property {bigquery(v2).GoogleSheetsOptions} googleSheetsOptions [Optional] Additional options if sourceFormat is set to GOOGLE_SHEETS.
 * @property {boolean} ignoreUnknownValues [Optional] Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don&#39;t match any column names Google Cloud Bigtable: This setting is ignored. Google Cloud Datastore backups: This setting is ignored. Avro: This setting is ignored.
 * @property {integer} maxBadRecords [Optional] The maximum number of bad records that BigQuery can ignore when reading data. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups and Avro formats.
 * @property {bigquery(v2).TableSchema} schema [Optional] The schema for the data. Schema is required for CSV and JSON formats. Schema is disallowed for Google Cloud Bigtable, Cloud Datastore backups, and Avro formats.
 * @property {string} sourceFormat [Required] The data format. For CSV files, specify &quot;CSV&quot;. For Google sheets, specify &quot;GOOGLE_SHEETS&quot;. For newline-delimited JSON, specify &quot;NEWLINE_DELIMITED_JSON&quot;. For Avro files, specify &quot;AVRO&quot;. For Google Cloud Datastore backups, specify &quot;DATASTORE_BACKUP&quot;. [Experimental] For Google Cloud Bigtable, specify &quot;BIGTABLE&quot;. Please note that reading from Google Cloud Bigtable is experimental and has to be enabled for your project. Please contact Google Cloud Support to enable this for your project.
 * @property {string[]} sourceUris [Required] The fully-qualified URIs that point to your data in Google Cloud. For Google Cloud Storage URIs: Each URI can contain one &#39;*&#39; wildcard character and it must come after the &#39;bucket&#39; name. Size limits related to load jobs apply to external data sources. For Google Cloud Bigtable URIs: Exactly one URI can be specified and it has be a fully specified and valid HTTPS URL for a Google Cloud Bigtable table. For Google Cloud Datastore backups, exactly one URI can be specified, and it must end with &#39;.backup_info&#39;. Also, the &#39;*&#39; wildcard character is not allowed.
 */
/**
 * @typedef GetQueryResultsResponse
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} cacheHit Whether the query result was fetched from the query cache.
 * @property {bigquery(v2).ErrorProto[]} errors [Output-only] All errors and warnings encountered during the running of the job. Errors here do not necessarily mean that the job has completed or was unsuccessful.
 * @property {string} etag A hash of this response.
 * @property {boolean} jobComplete Whether the query has completed or not. If rows or totalRows are present, this will always be true. If this is false, totalRows will not be available.
 * @property {bigquery(v2).JobReference} jobReference Reference to the BigQuery Job that was created to run the query. This field will be present even if the original request timed out, in which case GetQueryResults can be used to read the results once the query has completed. Since this API only returns the first page of results, subsequent pages can be fetched via the same mechanism (GetQueryResults).
 * @property {string} kind The resource type of the response.
 * @property {string} numDmlAffectedRows [Output-only, Experimental] The number of rows affected by a DML statement. Present only for DML statements INSERT, UPDATE or DELETE.
 * @property {string} pageToken A token used for paging results.
 * @property {bigquery(v2).TableRow[]} rows An object with as many results as can be contained within the maximum permitted reply size. To get any additional rows, you can call GetQueryResults and specify the jobReference returned above. Present only when the query completes successfully.
 * @property {bigquery(v2).TableSchema} schema The schema of the results. Present only when the query completes successfully.
 * @property {string} totalBytesProcessed The total number of bytes processed for this query.
 * @property {string} totalRows The total number of rows in the complete query result set, which can be more than the number of rows in this single page of results. Present only when the query completes successfully.
 */
/**
 * @typedef GoogleSheetsOptions
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} skipLeadingRows [Optional] The number of rows at the top of a sheet that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows that should be skipped. When autodetect is on, behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N &gt; 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.
 */
/**
 * @typedef Job
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).JobConfiguration} configuration [Required] Describes the job configuration.
 * @property {string} etag [Output-only] A hash of this resource.
 * @property {string} id [Output-only] Opaque ID field of the job
 * @property {bigquery(v2).JobReference} jobReference [Optional] Reference describing the unique-per-user name of the job.
 * @property {string} kind [Output-only] The type of the resource.
 * @property {string} selfLink [Output-only] A URL that can be used to access this resource again.
 * @property {bigquery(v2).JobStatistics} statistics [Output-only] Information about the job, including starting time and ending time of the job.
 * @property {bigquery(v2).JobStatus} status [Output-only] The status of this job. Examine this value when polling an asynchronous job to see if the job is complete.
 * @property {string} user_email [Output-only] Email address of the user who ran the job.
 */
/**
 * @typedef JobCancelResponse
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).Job} job The final state of the job.
 * @property {string} kind The resource type of the response.
 */
/**
 * @typedef JobConfiguration
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).JobConfigurationTableCopy} copy [Pick one] Copies a table.
 * @property {boolean} dryRun [Optional] If set, don&#39;t actually run this job. A valid query will return a mostly empty response with some processing statistics, while an invalid query will return the same error it would if it wasn&#39;t a dry run. Behavior of non-query jobs is undefined.
 * @property {bigquery(v2).JobConfigurationExtract} extract [Pick one] Configures an extract job.
 * @property {object} labels [Experimental] The labels associated with this job. You can use these to organize and group your jobs. Label keys and values can be no longer than 63 characters, can only contain letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and must be unique within a dataset. Both keys and values are additionally constrained to be &lt;= 128 bytes in size.
 * @property {bigquery(v2).JobConfigurationLoad} load [Pick one] Configures a load job.
 * @property {bigquery(v2).JobConfigurationQuery} query [Pick one] Configures a query job.
 */
/**
 * @typedef JobConfigurationExtract
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} compression [Optional] The compression type to use for exported files. Possible values include GZIP and NONE. The default value is NONE.
 * @property {string} destinationFormat [Optional] The exported file format. Possible values include CSV, NEWLINE_DELIMITED_JSON and AVRO. The default value is CSV. Tables with nested or repeated fields cannot be exported as CSV.
 * @property {string} destinationUri [Pick one] DEPRECATED: Use destinationUris instead, passing only one URI as necessary. The fully-qualified Google Cloud Storage URI where the extracted table should be written.
 * @property {string[]} destinationUris [Pick one] A list of fully-qualified Google Cloud Storage URIs where the extracted table should be written.
 * @property {string} fieldDelimiter [Optional] Delimiter to use between fields in the exported data. Default is &#39;,&#39;
 * @property {boolean} printHeader [Optional] Whether to print out a header row in the results. Default is true.
 * @property {bigquery(v2).TableReference} sourceTable [Required] A reference to the table being exported.
 */
/**
 * @typedef JobConfigurationLoad
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} allowJaggedRows [Optional] Accept rows that are missing trailing optional columns. The missing values are treated as nulls. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. Only applicable to CSV, ignored for other formats.
 * @property {boolean} allowQuotedNewlines Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.
 * @property {boolean} autodetect [Experimental] Indicates if we should automatically infer the options and schema for CSV and JSON sources.
 * @property {string} createDisposition [Optional] Specifies whether the job is allowed to create new tables. The following values are supported: CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. CREATE_NEVER: The table must already exist. If it does not, a &#39;notFound&#39; error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.
 * @property {bigquery(v2).TableReference} destinationTable [Required] The destination table to load the data into.
 * @property {string} encoding [Optional] The character encoding of the data. The supported values are UTF-8 or ISO-8859-1. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the quote and fieldDelimiter properties.
 * @property {string} fieldDelimiter [Optional] The separator for fields in a CSV file. The separator can be any ISO-8859-1 single-byte character. To use a character in the range 128-255, you must encode the character as UTF8. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. BigQuery also supports the escape sequence &quot;\t&quot; to specify a tab separator. The default value is a comma (&#39;,&#39;).
 * @property {boolean} ignoreUnknownValues [Optional] Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don&#39;t match any column names
 * @property {integer} maxBadRecords [Optional] The maximum number of bad records that BigQuery can ignore when running the job. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid.
 * @property {string} nullMarker [Optional] This string will be interpreted as a null value when it appears in a CSV file. The default value is the empty string. Please refer to the documentation for further information.
 * @property {string[]} projectionFields [Experimental] If sourceFormat is set to &quot;DATASTORE_BACKUP&quot;, indicates which entity properties to load into BigQuery from a Cloud Datastore backup. Property names are case sensitive and must be top-level properties. If no properties are specified, BigQuery loads all properties. If any named property isn&#39;t found in the Cloud Datastore backup, an invalid error is returned in the job result.
 * @property {string} quote [Optional] The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote (&#39;&quot;&#39;). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true.
 * @property {bigquery(v2).TableSchema} schema [Optional] The schema for the destination table. The schema can be omitted if the destination table already exists, or if you&#39;re loading data from Google Cloud Datastore.
 * @property {string} schemaInline [Deprecated] The inline schema. For CSV schemas, specify as &quot;Field1:Type1[,Field2:Type2]*&quot;. For example, &quot;foo:STRING, bar:INTEGER, baz:FLOAT&quot;.
 * @property {string} schemaInlineFormat [Deprecated] The format of the schemaInline property.
 * @property {string[]} schemaUpdateOptions [Experimental] Allows the schema of the desitination table to be updated as a side effect of the load job. Schema update options are supported in two cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.
 * @property {integer} skipLeadingRows [Optional] The number of rows at the top of a CSV file that BigQuery will skip when loading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped.
 * @property {string} sourceFormat [Optional] The format of the data files. For CSV files, specify &quot;CSV&quot;. For datastore backups, specify &quot;DATASTORE_BACKUP&quot;. For newline-delimited JSON, specify &quot;NEWLINE_DELIMITED_JSON&quot;. For Avro, specify &quot;AVRO&quot;. The default value is CSV.
 * @property {string[]} sourceUris [Required] The fully-qualified URIs that point to your data in Google Cloud Storage. Each URI can contain one &#39;*&#39; wildcard character and it must come after the &#39;bucket&#39; name.
 * @property {string} writeDisposition [Optional] Specifies the action that occurs if the destination table already exists. The following values are supported: WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data. WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. WRITE_EMPTY: If the table already exists and contains data, a &#39;duplicate&#39; error is returned in the job result. The default value is WRITE_APPEND. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.
 */
/**
 * @typedef JobConfigurationQuery
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} allowLargeResults If true, allows the query to produce arbitrarily large result tables at a slight cost in performance. Requires destinationTable to be set.
 * @property {string} createDisposition [Optional] Specifies whether the job is allowed to create new tables. The following values are supported: CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. CREATE_NEVER: The table must already exist. If it does not, a &#39;notFound&#39; error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.
 * @property {bigquery(v2).DatasetReference} defaultDataset [Optional] Specifies the default dataset to use for unqualified table names in the query.
 * @property {bigquery(v2).TableReference} destinationTable [Optional] Describes the table where the query results should be stored. If not present, a new table will be created to store the results.
 * @property {boolean} flattenResults [Optional] Flattens all nested and repeated fields in the query results. The default value is true. allowLargeResults must be true if this is set to false.
 * @property {integer} maximumBillingTier [Optional] Limits the billing tier for this job. Queries that have resource usage beyond this tier will fail (without incurring a charge). If unspecified, this will be set to your project default.
 * @property {string} maximumBytesBilled [Optional] Limits the bytes billed for this job. Queries that will have bytes billed beyond this limit will fail (without incurring a charge). If unspecified, this will be set to your project default.
 * @property {string} parameterMode [Experimental] Standard SQL only. Whether to use positional (?) or named (@myparam) query parameters in this query.
 * @property {boolean} preserveNulls [Deprecated] This property is deprecated.
 * @property {string} priority [Optional] Specifies a priority for the query. Possible values include INTERACTIVE and BATCH. The default value is INTERACTIVE.
 * @property {string} query [Required] BigQuery SQL query to execute.
 * @property {bigquery(v2).QueryParameter[]} queryParameters Query parameters for standard SQL queries.
 * @property {string[]} schemaUpdateOptions [Experimental] Allows the schema of the destination table to be updated as a side effect of the query job. Schema update options are supported in two cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.
 * @property {object} tableDefinitions [Optional] If querying an external data source outside of BigQuery, describes the data format, location and other properties of the data source. By defining these properties, the data source can then be queried as if it were a standard BigQuery table.
 * @property {boolean} useLegacySql Specifies whether to use BigQuery&#39;s legacy SQL dialect for this query. The default value is true. If set to false, the query will use BigQuery&#39;s standard SQL: https://cloud.google.com/bigquery/sql-reference/ When useLegacySql is set to false, the values of allowLargeResults and flattenResults are ignored; query will be run as if allowLargeResults is true and flattenResults is false.
 * @property {boolean} useQueryCache [Optional] Whether to look for the result in the query cache. The query cache is a best-effort cache that will be flushed whenever tables in the query are modified. Moreover, the query cache is only available when a query does not have a destination table specified. The default value is true.
 * @property {bigquery(v2).UserDefinedFunctionResource[]} userDefinedFunctionResources [Experimental] Describes user-defined function resources used in the query.
 * @property {string} writeDisposition [Optional] Specifies the action that occurs if the destination table already exists. The following values are supported: WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data. WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. WRITE_EMPTY: If the table already exists and contains data, a &#39;duplicate&#39; error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.
 */
/**
 * @typedef JobConfigurationTableCopy
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} createDisposition [Optional] Specifies whether the job is allowed to create new tables. The following values are supported: CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. CREATE_NEVER: The table must already exist. If it does not, a &#39;notFound&#39; error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.
 * @property {bigquery(v2).TableReference} destinationTable [Required] The destination table
 * @property {bigquery(v2).TableReference} sourceTable [Pick one] Source table to copy.
 * @property {bigquery(v2).TableReference[]} sourceTables [Pick one] Source tables to copy.
 * @property {string} writeDisposition [Optional] Specifies the action that occurs if the destination table already exists. The following values are supported: WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data. WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. WRITE_EMPTY: If the table already exists and contains data, a &#39;duplicate&#39; error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.
 */
/**
 * @typedef JobList
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} etag A hash of this page of results.
 * @property {object[]} jobs List of jobs that were requested.
 * @property {string} kind The resource type of the response.
 * @property {string} nextPageToken A token to request the next page of results.
 */
/**
 * @typedef JobReference
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} jobId [Required] The ID of the job. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-). The maximum length is 1,024 characters.
 * @property {string} projectId [Required] The ID of the project containing this job.
 */
/**
 * @typedef JobStatistics
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} creationTime [Output-only] Creation time of this job, in milliseconds since the epoch. This field will be present on all jobs.
 * @property {string} endTime [Output-only] End time of this job, in milliseconds since the epoch. This field will be present whenever a job is in the DONE state.
 * @property {bigquery(v2).JobStatistics4} extract [Output-only] Statistics for an extract job.
 * @property {bigquery(v2).JobStatistics3} load [Output-only] Statistics for a load job.
 * @property {bigquery(v2).JobStatistics2} query [Output-only] Statistics for a query job.
 * @property {string} startTime [Output-only] Start time of this job, in milliseconds since the epoch. This field will be present when the job transitions from the PENDING state to either RUNNING or DONE.
 * @property {string} totalBytesProcessed [Output-only] [Deprecated] Use the bytes processed in the query statistics instead.
 */
/**
 * @typedef JobStatistics2
 * @memberOf! bigquery(v2)
 * @type object
 * @property {integer} billingTier [Output-only] Billing tier for the job.
 * @property {boolean} cacheHit [Output-only] Whether the query result was fetched from the query cache.
 * @property {string} numDmlAffectedRows [Output-only, Experimental] The number of rows affected by a DML statement. Present only for DML statements INSERT, UPDATE or DELETE.
 * @property {bigquery(v2).ExplainQueryStage[]} queryPlan [Output-only, Experimental] Describes execution plan for the query.
 * @property {bigquery(v2).TableReference[]} referencedTables [Output-only, Experimental] Referenced tables for the job. Queries that reference more than 50 tables will not have a complete list.
 * @property {bigquery(v2).TableSchema} schema [Output-only, Experimental] The schema of the results. Present only for successful dry run of non-legacy SQL queries.
 * @property {string} statementType [Output-only, Experimental] The type of query statement, if valid.
 * @property {string} totalBytesBilled [Output-only] Total bytes billed for the job.
 * @property {string} totalBytesProcessed [Output-only] Total bytes processed for the job.
 * @property {bigquery(v2).QueryParameter[]} undeclaredQueryParameters [Output-only, Experimental] Standard SQL only: list of undeclared query parameters detected during a dry run validation.
 */
/**
 * @typedef JobStatistics3
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} inputFileBytes [Output-only] Number of bytes of source data in a load job.
 * @property {string} inputFiles [Output-only] Number of source files in a load job.
 * @property {string} outputBytes [Output-only] Size of the loaded data in bytes. Note that while a load job is in the running state, this value may change.
 * @property {string} outputRows [Output-only] Number of rows imported in a load job. Note that while an import job is in the running state, this value may change.
 */
/**
 * @typedef JobStatistics4
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string[]} destinationUriFileCounts [Output-only] Number of files per destination URI or URI pattern specified in the extract configuration. These values will be in the same order as the URIs specified in the &#39;destinationUris&#39; field.
 */
/**
 * @typedef JobStatus
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).ErrorProto} errorResult [Output-only] Final error result of the job. If present, indicates that the job has completed and was unsuccessful.
 * @property {bigquery(v2).ErrorProto[]} errors [Output-only] All errors encountered during the running of the job. Errors here do not necessarily mean that the job has completed or was unsuccessful.
 * @property {string} state [Output-only] Running state of the job.
 */
/**
 * @typedef JsonObject
 * @memberOf! bigquery(v2)
 * @type object
 */
/**
 * @typedef JsonValue
 * @memberOf! bigquery(v2)
 * @type any
 */
/**
 * @typedef ProjectList
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} etag A hash of the page of results
 * @property {string} kind The type of list.
 * @property {string} nextPageToken A token to request the next page of results.
 * @property {object[]} projects Projects to which you have at least READ access.
 * @property {integer} totalItems The total number of projects in the list.
 */
/**
 * @typedef ProjectReference
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} projectId [Required] ID of the project. Can be either the numeric ID or the assigned ID of the project.
 */
/**
 * @typedef QueryParameter
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} name [Optional] If unset, this is a positional parameter. Otherwise, should be unique within a query.
 * @property {bigquery(v2).QueryParameterType} parameterType [Required] The type of this parameter.
 * @property {bigquery(v2).QueryParameterValue} parameterValue [Required] The value of this parameter.
 */
/**
 * @typedef QueryParameterType
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).QueryParameterType} arrayType [Optional] The type of the array&#39;s elements, if this is an array.
 * @property {object[]} structTypes [Optional] The types of the fields of this struct, in order, if this is a struct.
 * @property {string} type [Required] The top level type of this field.
 */
/**
 * @typedef QueryParameterValue
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).QueryParameterValue[]} arrayValues [Optional] The array values, if this is an array type.
 * @property {object} structValues [Optional] The struct field values, in order of the struct type&#39;s declaration.
 * @property {string} value [Optional] The value of this value, if a simple scalar type.
 */
/**
 * @typedef QueryRequest
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).DatasetReference} defaultDataset [Optional] Specifies the default datasetId and projectId to assume for any unqualified table names in the query. If not set, all table names in the query string must be qualified in the format &#39;datasetId.tableId&#39;.
 * @property {boolean} dryRun [Optional] If set to true, BigQuery doesn&#39;t run the job. Instead, if the query is valid, BigQuery returns statistics about the job such as how many bytes would be processed. If the query is invalid, an error returns. The default value is false.
 * @property {string} kind The resource type of the request.
 * @property {integer} maxResults [Optional] The maximum number of rows of data to return per page of results. Setting this flag to a small value such as 1000 and then paging through results might improve reliability when the query result set is large. In addition to this limit, responses are also limited to 10 MB. By default, there is no maximum row count, and only the byte limit applies.
 * @property {string} parameterMode [Experimental] Standard SQL only. Whether to use positional (?) or named (@myparam) query parameters in this query.
 * @property {boolean} preserveNulls [Deprecated] This property is deprecated.
 * @property {string} query [Required] A query string, following the BigQuery query syntax, of the query to execute. Example: &quot;SELECT count(f1) FROM [myProjectId:myDatasetId.myTableId]&quot;.
 * @property {bigquery(v2).QueryParameter[]} queryParameters [Experimental] Query parameters for Standard SQL queries.
 * @property {integer} timeoutMs [Optional] How long to wait for the query to complete, in milliseconds, before the request times out and returns. Note that this is only a timeout for the request, not the query. If the query takes longer to run than the timeout value, the call returns without any results and with the &#39;jobComplete&#39; flag set to false. You can call GetQueryResults() to wait for the query to complete and read the results. The default value is 10000 milliseconds (10 seconds).
 * @property {boolean} useLegacySql Specifies whether to use BigQuery&#39;s legacy SQL dialect for this query. The default value is true. If set to false, the query will use BigQuery&#39;s standard SQL: https://cloud.google.com/bigquery/sql-reference/ When useLegacySql is set to false, the values of allowLargeResults and flattenResults are ignored; query will be run as if allowLargeResults is true and flattenResults is false.
 * @property {boolean} useQueryCache [Optional] Whether to look for the result in the query cache. The query cache is a best-effort cache that will be flushed whenever tables in the query are modified. The default value is true.
 */
/**
 * @typedef QueryResponse
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} cacheHit Whether the query result was fetched from the query cache.
 * @property {bigquery(v2).ErrorProto[]} errors [Output-only] All errors and warnings encountered during the running of the job. Errors here do not necessarily mean that the job has completed or was unsuccessful.
 * @property {boolean} jobComplete Whether the query has completed or not. If rows or totalRows are present, this will always be true. If this is false, totalRows will not be available.
 * @property {bigquery(v2).JobReference} jobReference Reference to the Job that was created to run the query. This field will be present even if the original request timed out, in which case GetQueryResults can be used to read the results once the query has completed. Since this API only returns the first page of results, subsequent pages can be fetched via the same mechanism (GetQueryResults).
 * @property {string} kind The resource type.
 * @property {string} numDmlAffectedRows [Output-only, Experimental] The number of rows affected by a DML statement. Present only for DML statements INSERT, UPDATE or DELETE.
 * @property {string} pageToken A token used for paging results.
 * @property {bigquery(v2).TableRow[]} rows An object with as many results as can be contained within the maximum permitted reply size. To get any additional rows, you can call GetQueryResults and specify the jobReference returned above.
 * @property {bigquery(v2).TableSchema} schema The schema of the results. Present only when the query completes successfully.
 * @property {string} totalBytesProcessed The total number of bytes processed for this query. If this query was a dry run, this is the number of bytes that would be processed if the query were run.
 * @property {string} totalRows The total number of rows in the complete query result set, which can be more than the number of rows in this single page of results.
 */
/**
 * @typedef Streamingbuffer
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} estimatedBytes [Output-only] A lower-bound estimate of the number of bytes currently in the streaming buffer.
 * @property {string} estimatedRows [Output-only] A lower-bound estimate of the number of rows currently in the streaming buffer.
 * @property {string} oldestEntryTime [Output-only] Contains the timestamp of the oldest entry in the streaming buffer, in milliseconds since the epoch, if the streaming buffer is available.
 */
/**
 * @typedef Table
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} creationTime [Output-only] The time when this table was created, in milliseconds since the epoch.
 * @property {string} description [Optional] A user-friendly description of this table.
 * @property {string} etag [Output-only] A hash of this resource.
 * @property {string} expirationTime [Optional] The time when this table expires, in milliseconds since the epoch. If not present, the table will persist indefinitely. Expired tables will be deleted and their storage reclaimed.
 * @property {bigquery(v2).ExternalDataConfiguration} externalDataConfiguration [Optional] Describes the data format, location, and other properties of a table stored outside of BigQuery. By defining these properties, the data source can then be queried as if it were a standard BigQuery table.
 * @property {string} friendlyName [Optional] A descriptive name for this table.
 * @property {string} id [Output-only] An opaque ID uniquely identifying the table.
 * @property {string} kind [Output-only] The type of the resource.
 * @property {object} labels [Experimental] The labels associated with this table. You can use these to organize and group your tables. Label keys and values can be no longer than 63 characters, can only contain letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and must be unique within a dataset. Both keys and values are additionally constrained to be &lt;= 128 bytes in size.
 * @property {string} lastModifiedTime [Output-only] The time when this table was last modified, in milliseconds since the epoch.
 * @property {string} location [Output-only] The geographic location where the table resides. This value is inherited from the dataset.
 * @property {string} numBytes [Output-only] The size of this table in bytes, excluding any data in the streaming buffer.
 * @property {string} numLongTermBytes [Output-only] The number of bytes in the table that are considered &quot;long-term storage&quot;.
 * @property {string} numRows [Output-only] The number of rows of data in this table, excluding any data in the streaming buffer.
 * @property {bigquery(v2).TableSchema} schema [Optional] Describes the schema of this table.
 * @property {string} selfLink [Output-only] A URL that can be used to access this resource again.
 * @property {bigquery(v2).Streamingbuffer} streamingBuffer [Output-only] Contains information regarding this table&#39;s streaming buffer, if one is present. This field will be absent if the table is not being streamed to or if there is no data in the streaming buffer.
 * @property {bigquery(v2).TableReference} tableReference [Required] Reference describing the ID of this table.
 * @property {bigquery(v2).TimePartitioning} timePartitioning [Experimental] If specified, configures time-based partitioning for this table.
 * @property {string} type [Output-only] Describes the table type. The following values are supported: TABLE: A normal BigQuery table. VIEW: A virtual table defined by a SQL query. EXTERNAL: A table that references data stored in an external storage system, such as Google Cloud Storage. The default value is TABLE.
 * @property {bigquery(v2).ViewDefinition} view [Optional] The view definition.
 */
/**
 * @typedef TableCell
 * @memberOf! bigquery(v2)
 * @type object
 * @property {any} v 
 */
/**
 * @typedef TableDataInsertAllRequest
 * @memberOf! bigquery(v2)
 * @type object
 * @property {boolean} ignoreUnknownValues [Optional] Accept rows that contain values that do not match the schema. The unknown values are ignored. Default is false, which treats unknown values as errors.
 * @property {string} kind The resource type of the response.
 * @property {object[]} rows The rows to insert.
 * @property {boolean} skipInvalidRows [Optional] Insert all valid rows of a request, even if invalid rows exist. The default value is false, which causes the entire request to fail if any invalid rows exist.
 * @property {string} templateSuffix [Experimental] If specified, treats the destination table as a base template, and inserts the rows into an instance table named &quot;{destination}{templateSuffix}&quot;. BigQuery will manage creation of the instance table, using the schema of the base template table. See https://cloud.google.com/bigquery/streaming-data-into-bigquery#template-tables for considerations when working with templates tables.
 */
/**
 * @typedef TableDataInsertAllResponse
 * @memberOf! bigquery(v2)
 * @type object
 * @property {object[]} insertErrors An array of errors for rows that were not inserted.
 * @property {string} kind The resource type of the response.
 */
/**
 * @typedef TableDataList
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} etag A hash of this page of results.
 * @property {string} kind The resource type of the response.
 * @property {string} pageToken A token used for paging results. Providing this token instead of the startIndex parameter can help you retrieve stable results when an underlying table is changing.
 * @property {bigquery(v2).TableRow[]} rows Rows of results.
 * @property {string} totalRows The total number of rows in the complete table.
 */
/**
 * @typedef TableFieldSchema
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} description [Optional] The field description. The maximum length is 16K characters.
 * @property {bigquery(v2).TableFieldSchema[]} fields [Optional] Describes the nested schema fields if the type property is set to RECORD.
 * @property {string} mode [Optional] The field mode. Possible values include NULLABLE, REQUIRED and REPEATED. The default value is NULLABLE.
 * @property {string} name [Required] The field name. The name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and must start with a letter or underscore. The maximum length is 128 characters.
 * @property {string} type [Required] The field data type. Possible values include STRING, BYTES, INTEGER, INT64 (same as INTEGER), FLOAT, FLOAT64 (same as FLOAT), BOOLEAN, BOOL (same as BOOLEAN), TIMESTAMP, DATE, TIME, DATETIME, RECORD (where RECORD indicates that the field contains a nested schema) or STRUCT (same as RECORD).
 */
/**
 * @typedef TableList
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} etag A hash of this page of results.
 * @property {string} kind The type of list.
 * @property {string} nextPageToken A token to request the next page of results.
 * @property {object[]} tables Tables in the requested dataset.
 * @property {integer} totalItems The total number of tables in the dataset.
 */
/**
 * @typedef TableReference
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} datasetId [Required] The ID of the dataset containing this table.
 * @property {string} projectId [Required] The ID of the project containing this table.
 * @property {string} tableId [Required] The ID of the table. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.
 */
/**
 * @typedef TableRow
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).TableCell[]} f Represents a single row in the result set, consisting of one or more fields.
 */
/**
 * @typedef TableSchema
 * @memberOf! bigquery(v2)
 * @type object
 * @property {bigquery(v2).TableFieldSchema[]} fields Describes the fields in a table.
 */
/**
 * @typedef TimePartitioning
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} expirationMs [Optional] Number of milliseconds for which to keep the storage for a partition.
 * @property {string} type [Required] The only type supported is DAY, which will generate one partition per day based on data loading time.
 */
/**
 * @typedef UserDefinedFunctionResource
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} inlineCode [Pick one] An inline resource that contains code for a user-defined function (UDF). Providing a inline code resource is equivalent to providing a URI for a file containing the same code.
 * @property {string} resourceUri [Pick one] A code resource to load from a Google Cloud Storage URI (gs://bucket/path).
 */
/**
 * @typedef ViewDefinition
 * @memberOf! bigquery(v2)
 * @type object
 * @property {string} query [Required] A query that BigQuery executes when the view is referenced.
 * @property {boolean} useLegacySql Specifies whether to use BigQuery&#39;s legacy SQL for this view. The default value is true. If set to false, the view will use BigQuery&#39;s standard SQL: https://cloud.google.com/bigquery/sql-reference/ Queries and views that reference this view must use the same flag value.
 * @property {bigquery(v2).UserDefinedFunctionResource[]} userDefinedFunctionResources [Experimental] Describes user-defined function resources used in the query.
 */
module.exports = Bigquery;
