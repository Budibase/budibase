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
 * Google Cloud Dataproc API
 *
 * An API for managing Hadoop-based clusters and jobs on Google Cloud Platform.
 *
 * @example
 * var google = require('googleapis');
 * var dataproc = google.dataproc('v1');
 *
 * @namespace dataproc
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Dataproc
 */
function Dataproc(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    regions: {

      clusters: {

        /**
         * dataproc.projects.regions.clusters.create
         *
         * @desc Creates a cluster in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     resource: {},
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.clusters.create(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.clusters.create
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {dataproc(v1).Cluster} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region'],
            pathParams: ['projectId', 'region'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.clusters.patch
         *
         * @desc Updates a cluster in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The cluster name.
         *     clusterName: "",
         *
         *     resource: {},
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.clusters.patch(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.clusters.patch
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.clusterName [Required] The cluster name.
         * @param {string=} params.updateMask [Required] Specifies the path, relative to Cluster, of the field to update. For example, to change the number of workers in a cluster to 5, the update_mask parameter would be specified as config.worker_config.num_instances, and the `PATCH` request body would specify the new value, as follows: { "config":{ "workerConfig":{ "numInstances":"5" } } } Similarly, to change the number of preemptible workers in a cluster to 5, the update_mask parameter would be config.secondary_worker_config.num_instances, and the `PATCH` request body would be set as follows: { "config":{ "secondaryWorkerConfig":{ "numInstances":"5" } } } Note: Currently, config.worker_config.num_instances and config.secondary_worker_config.num_instances are the only fields that can be updated.
         * @param {dataproc(v1).Cluster} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
              method: 'PATCH'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'clusterName'],
            pathParams: ['projectId', 'region', 'clusterName'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.clusters.delete
         *
         * @desc Deletes a cluster in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The cluster name.
         *     clusterName: "",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.clusters.delete(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.clusters.delete
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.clusterName [Required] The cluster name.
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'clusterName'],
            pathParams: ['projectId', 'region', 'clusterName'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.clusters.get
         *
         * @desc Gets the resource representation for a cluster in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The cluster name.
         *     clusterName: "",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.clusters.get(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.clusters.get
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.clusterName [Required] The cluster name.
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'clusterName'],
            pathParams: ['projectId', 'region', 'clusterName'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.clusters.list
         *
         * @desc Lists all regions/{region}/clusters in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
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
         *         dataproc.projects.regions.clusters.list(request, recur);
         *       }
         *     }
         *   };
         *
         *   dataproc.projects.regions.clusters.list(request, recur);
         * });
         *
         * @alias dataproc.projects.regions.clusters.list
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string=} params.filter [Optional] A filter constraining the clusters to list. Filters are case-sensitive and have the following syntax: field:value [field:value] ... or field = value [AND [field = value]] ... where **field** is one of `status.state`, `clusterName`, or `labels.[KEY]`, and `[KEY]` is a label key. **value** can be `*` to match all values. `status.state` can be one of the following: `ACTIVE`, `INACTIVE`, `CREATING`, `RUNNING`, `ERROR`, `DELETING`, or `UPDATING`. `ACTIVE` contains the `CREATING`, `UPDATING`, and `RUNNING` states. `INACTIVE` contains the `DELETING` and `ERROR` states. `clusterName` is the name of the cluster provided at creation time. Only the logical `AND` operator is supported; space-separated items are treated as having an implicit `AND` operator. Example valid filters are: status.state:ACTIVE clusterName:mycluster labels.env:staging \ labels.starred:* and status.state = ACTIVE AND clusterName = mycluster \ AND labels.env = staging AND labels.starred = *
         * @param {integer=} params.pageSize [Optional] The standard List page size.
         * @param {string=} params.pageToken [Optional] The standard List page token.
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region'],
            pathParams: ['projectId', 'region'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.clusters.diagnose
         *
         * @desc Gets cluster diagnostic information. After the operation completes, the Operation.response field contains `DiagnoseClusterOutputLocation`.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // TODO: Change placeholders below to appropriate parameter values for the 'diagnose' method:
         *
         *     // * [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The cluster name.
         *     clusterName: "",
         *
         *     resource: {},
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.clusters.diagnose(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.clusters.diagnose
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.clusterName [Required] The cluster name.
         * @param {dataproc(v1).DiagnoseClusterRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        diagnose: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/clusters/{clusterName}:diagnose',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'clusterName'],
            pathParams: ['projectId', 'region', 'clusterName'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      jobs: {

        /**
         * dataproc.projects.regions.jobs.submit
         *
         * @desc Submits a job to a cluster.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // TODO: Change placeholders below to appropriate parameter values for the 'submit' method:
         *
         *     // * [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     resource: {},
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.jobs.submit(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.jobs.submit
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {dataproc(v1).SubmitJobRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        submit: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/jobs:submit',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region'],
            pathParams: ['projectId', 'region'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.jobs.get
         *
         * @desc Gets the resource representation for a job in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The job ID.
         *     jobId: "",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.jobs.get(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.jobs.get
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.jobId [Required] The job ID.
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/jobs/{jobId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'jobId'],
            pathParams: ['projectId', 'region', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.jobs.list
         *
         * @desc Lists regions/{region}/jobs in a project.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
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
         *         dataproc.projects.regions.jobs.list(request, recur);
         *       }
         *     }
         *   };
         *
         *   dataproc.projects.regions.jobs.list(request, recur);
         * });
         *
         * @alias dataproc.projects.regions.jobs.list
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {integer=} params.pageSize [Optional] The number of results to return in each response.
         * @param {string=} params.pageToken [Optional] The page token, returned by a previous call, to request the next page of results.
         * @param {string=} params.clusterName [Optional] If set, the returned jobs list includes only jobs that were submitted to the named cluster.
         * @param {string=} params.jobStateMatcher [Optional] Specifies enumerated categories of jobs to list (default = match ALL jobs).
         * @param {string=} params.filter [Optional] A filter constraining the jobs to list. Filters are case-sensitive and have the following syntax: field:value] ... or [field = value] AND [field [= value]] ... where **field** is `status.state` or `labels.[KEY]`, and `[KEY]` is a label key. **value** can be `*` to match all values. `status.state` can be either `ACTIVE` or `INACTIVE`. Only the logical `AND` operator is supported; space-separated items are treated as having an implicit `AND` operator. Example valid filters are: status.state:ACTIVE labels.env:staging labels.starred:* and status.state = ACTIVE AND labels.env = staging AND labels.starred = *
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/jobs',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region'],
            pathParams: ['projectId', 'region'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.jobs.cancel
         *
         * @desc Starts a job cancellation request. To access the job resource after cancellation, call [regions/{region}/jobs.list](/dataproc/reference/rest/v1/projects.regions.jobs/list) or [regions/{region}/jobs.get](/dataproc/reference/rest/v1/projects.regions.jobs/get).
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The job ID.
         *     jobId: "",
         *
         *     resource: {},
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.jobs.cancel(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.jobs.cancel
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.jobId [Required] The job ID.
         * @param {dataproc(v1).CancelJobRequest} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/jobs/{jobId}:cancel',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'jobId'],
            pathParams: ['projectId', 'region', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.jobs.delete
         *
         * @desc Deletes the job from the project. If the job is active, the delete fails, and the response returns `FAILED_PRECONDITION`.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *
         *     // * [Required] The Cloud Dataproc region in which to handle the request.
         *     region: "",
         *
         *     // * [Required] The job ID.
         *     jobId: "",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.jobs.delete(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.jobs.delete
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Cloud Dataproc region in which to handle the request.
         * @param {string} params.jobId [Required] The job ID.
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
              url: 'https://dataproc.googleapis.com/v1/projects/{projectId}/regions/{region}/jobs/{jobId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'jobId'],
            pathParams: ['projectId', 'region', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      operations: {

        /**
         * dataproc.projects.regions.operations.list
         *
         * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     // * The name of the operation collection.
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
         *         dataproc.projects.regions.operations.list(request, recur);
         *       }
         *     }
         *   };
         *
         *   dataproc.projects.regions.operations.list(request, recur);
         * });
         *
         * @alias dataproc.projects.regions.operations.list
         * @memberOf! dataproc(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation collection.
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
              url: 'https://dataproc.googleapis.com/v1/{name}',
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
         * dataproc.projects.regions.operations.get
         *
         * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     name: "projects/{MY-PROJECT}/regions/{MY-REGION}/operations/{MY-OPERATION}",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.operations.get(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.operations.get
         * @memberOf! dataproc(v1)
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
              url: 'https://dataproc.googleapis.com/v1/{name}',
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
         * dataproc.projects.regions.operations.delete
         *
         * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     name: "projects/{MY-PROJECT}/regions/{MY-REGION}/operations/{MY-OPERATION}",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.operations.delete(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.operations.delete
         * @memberOf! dataproc(v1)
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
              url: 'https://dataproc.googleapis.com/v1/{name}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataproc.projects.regions.operations.cancel
         *
         * @desc Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1');
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
         *     name: "projects/{MY-PROJECT}/regions/{MY-REGION}/operations/{MY-OPERATION}",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *   dataproc.projects.regions.operations.cancel(request, function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *     }
         *   });
         * });
         *
         * @alias dataproc.projects.regions.operations.cancel
         * @memberOf! dataproc(v1)
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
              url: 'https://dataproc.googleapis.com/v1/{name}:cancel',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };
}

/**
 * @typedef Cluster
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} projectId [Required] The Google Cloud Platform project ID that the cluster belongs to.
 * @property {string} clusterName [Required] The cluster name. Cluster names within a project must be unique. Names of deleted clusters can be reused.
 * @property {dataproc(v1).ClusterConfig} config [Required] The cluster config. Note that Cloud Dataproc may set default values, and values may change when clusters are updated.
 * @property {object} labels [Optional] The labels to associate with this cluster. Label **keys** must contain 1 to 63 characters, and must conform to [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). Label **values** may be empty, but, if present, must contain 1 to 63 characters, and must conform to [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a cluster.
 * @property {dataproc(v1).ClusterStatus} status [Output-only] Cluster status.
 * @property {dataproc(v1).ClusterStatus[]} statusHistory [Output-only] The previous cluster status.
 * @property {string} clusterUuid [Output-only] A cluster UUID (Unique Universal Identifier). Cloud Dataproc generates this value when it creates the cluster.
 * @property {dataproc(v1).ClusterMetrics} metrics Contains cluster daemon metrics such as HDFS and YARN stats. **Beta Feature**: This report is available for testing purposes only. It may be changed before final release.
 */
/**
 * @typedef ClusterConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} configBucket [Optional] A Google Cloud Storage staging bucket used for sharing generated SSH keys and config. If you do not specify a staging bucket, Cloud Dataproc will determine an appropriate Cloud Storage location (US, ASIA, or EU) for your cluster&#39;s staging bucket according to the Google Compute Engine zone where your cluster is deployed, and then it will create and manage this project-level, per-location bucket for you.
 * @property {dataproc(v1).GceClusterConfig} gceClusterConfig [Required] The shared Google Compute Engine config settings for all instances in a cluster.
 * @property {dataproc(v1).InstanceGroupConfig} masterConfig [Optional] The Google Compute Engine config settings for the master instance in a cluster.
 * @property {dataproc(v1).InstanceGroupConfig} workerConfig [Optional] The Google Compute Engine config settings for worker instances in a cluster.
 * @property {dataproc(v1).InstanceGroupConfig} secondaryWorkerConfig [Optional] The Google Compute Engine config settings for additional worker instances in a cluster.
 * @property {dataproc(v1).SoftwareConfig} softwareConfig [Optional] The config settings for software inside the cluster.
 * @property {dataproc(v1).NodeInitializationAction[]} initializationActions [Optional] Commands to execute on each node after config is completed. By default, executables are run on master and all worker nodes. You can test a node&#39;s role metadata to run an executable on a master or worker node, as shown below using `curl` (you can also use `wget`): ROLE=$(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/dataproc-role) if [[ &quot;${ROLE}&quot; == &#39;Master&#39; ]]; then ... master specific actions ... else ... worker specific actions ... fi
 */
/**
 * @typedef GceClusterConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} zoneUri [Required] The zone where the Google Compute Engine cluster will be located. Example: `https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]`.
 * @property {string} networkUri [Optional] The Google Compute Engine network to be used for machine communications. Cannot be specified with subnetwork_uri. If neither `network_uri` nor `subnetwork_uri` is specified, the &quot;default&quot; network of the project is used, if it exists. Cannot be a &quot;Custom Subnet Network&quot; (see [Using Subnetworks](/compute/docs/subnetworks) for more information). Example: `https://www.googleapis.com/compute/v1/projects/[project_id]/regions/global/default`.
 * @property {string} subnetworkUri [Optional] The Google Compute Engine subnetwork to be used for machine communications. Cannot be specified with network_uri. Example: `https://www.googleapis.com/compute/v1/projects/[project_id]/regions/us-east1/sub0`.
 * @property {boolean} internalIpOnly [Optional] If true, all instances in the cluster will only have internal IP addresses. By default, clusters are not restricted to internal IP addresses, and will have ephemeral external IP addresses assigned to each instance. This `internal_ip_only` restriction can only be enabled for subnetwork enabled networks, and all off-cluster dependencies must be configured to be accessible without external IP addresses.
 * @property {string[]} serviceAccountScopes [Optional] The URIs of service account scopes to be included in Google Compute Engine instances. The following base set of scopes is always included: * https://www.googleapis.com/auth/cloud.useraccounts.readonly * https://www.googleapis.com/auth/devstorage.read_write * https://www.googleapis.com/auth/logging.write If no scopes are specified, the following defaults are also provided: * https://www.googleapis.com/auth/bigquery * https://www.googleapis.com/auth/bigtable.admin.table * https://www.googleapis.com/auth/bigtable.data * https://www.googleapis.com/auth/devstorage.full_control
 * @property {string[]} tags The Google Compute Engine tags to add to all instances (see [Tagging instances](/compute/docs/label-or-tag-resources#tags)).
 * @property {object} metadata The Google Compute Engine metadata entries to add to all instances (see [Project and instance metadata](https://cloud.google.com/compute/docs/storing-retrieving-metadata#project_and_instance_metadata)).
 */
/**
 * @typedef InstanceGroupConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {integer} numInstances [Required] The number of VM instances in the instance group. For master instance groups, must be set to 1.
 * @property {string[]} instanceNames [Optional] The list of instance names. Cloud Dataproc derives the names from `cluster_name`, `num_instances`, and the instance group if not set by user (recommended practice is to let Cloud Dataproc derive the name).
 * @property {string} imageUri [Output-only] The Google Compute Engine image resource used for cluster instances. Inferred from `SoftwareConfig.image_version`.
 * @property {string} machineTypeUri [Required] The Google Compute Engine machine type used for cluster instances. Example: `https://www.googleapis.com/compute/v1/projects/[project_id]/zones/us-east1-a/machineTypes/n1-standard-2`.
 * @property {dataproc(v1).DiskConfig} diskConfig [Optional] Disk option config settings.
 * @property {boolean} isPreemptible [Optional] Specifies that this instance group contains preemptible instances.
 * @property {dataproc(v1).ManagedGroupConfig} managedGroupConfig [Output-only] The config for Google Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.
 */
/**
 * @typedef DiskConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {integer} bootDiskSizeGb [Optional] Size in GB of the boot disk (default is 500GB).
 * @property {integer} numLocalSsds [Optional] Number of attached SSDs, from 0 to 4 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and [HDFS](https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.
 */
/**
 * @typedef ManagedGroupConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} instanceTemplateName [Output-only] The name of the Instance Template used for the Managed Instance Group.
 * @property {string} instanceGroupManagerName [Output-only] The name of the Instance Group Manager for this group.
 */
/**
 * @typedef SoftwareConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} imageVersion [Optional] The version of software inside the cluster. It must match the regular expression `[0-9]+\.[0-9]+`. If unspecified, it defaults to the latest version (see [Cloud Dataproc Versioning](/dataproc/versioning)).
 * @property {object} properties [Optional] The properties to set on daemon config files. Property keys are specified in `prefix:property` format, such as `core:fs.defaultFS`. The following are supported prefixes and their mappings: * core: `core-site.xml` * hdfs: `hdfs-site.xml` * mapred: `mapred-site.xml` * yarn: `yarn-site.xml` * hive: `hive-site.xml` * pig: `pig.properties` * spark: `spark-defaults.conf`
 */
/**
 * @typedef NodeInitializationAction
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} executableFile [Required] Google Cloud Storage URI of executable file.
 * @property {string} executionTimeout [Optional] Amount of time executable has to complete. Default is 10 minutes. Cluster creation fails with an explanatory error message (the name of the executable that caused the error and the exceeded timeout period) if the executable is not completed at end of the timeout period.
 */
/**
 * @typedef ClusterStatus
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} state [Output-only] The cluster&#39;s state.
 * @property {string} detail [Output-only] Optional details of cluster&#39;s state.
 * @property {string} stateStartTime [Output-only] Time when this state was entered.
 */
/**
 * @typedef ClusterMetrics
 * @memberOf! dataproc(v1)
 * @type object
 * @property {object} hdfsMetrics The HDFS metrics.
 * @property {object} yarnMetrics The YARN metrics.
 */
/**
 * @typedef Operation
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} name The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should have the format of `operations/some/unique/name`.
 * @property {object} metadata Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
 * @property {boolean} done If the value is `false`, it means the operation is still in progress. If true, the operation is completed, and either `error` or `response` is available.
 * @property {dataproc(v1).Status} error The error result of the operation in case of failure or cancellation.
 * @property {object} response The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
 */
/**
 * @typedef Status
 * @memberOf! dataproc(v1)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef ListClustersResponse
 * @memberOf! dataproc(v1)
 * @type object
 * @property {dataproc(v1).Cluster[]} clusters [Output-only] The clusters in the project.
 * @property {string} nextPageToken [Output-only] This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the `page_token` in a subsequent ListClustersRequest.
 */
/**
 * @typedef DiagnoseClusterRequest
 * @memberOf! dataproc(v1)
 * @type object
 */
/**
 * @typedef SubmitJobRequest
 * @memberOf! dataproc(v1)
 * @type object
 * @property {dataproc(v1).Job} job [Required] The job resource.
 */
/**
 * @typedef Job
 * @memberOf! dataproc(v1)
 * @type object
 * @property {dataproc(v1).JobReference} reference [Optional] The fully qualified reference to the job, which can be used to obtain the equivalent REST path of the job resource. If this property is not specified when a job is created, the server generates a job_id.
 * @property {dataproc(v1).JobPlacement} placement [Required] Job information, including how, when, and where to run the job.
 * @property {dataproc(v1).HadoopJob} hadoopJob Job is a Hadoop job.
 * @property {dataproc(v1).SparkJob} sparkJob Job is a Spark job.
 * @property {dataproc(v1).PySparkJob} pysparkJob Job is a Pyspark job.
 * @property {dataproc(v1).HiveJob} hiveJob Job is a Hive job.
 * @property {dataproc(v1).PigJob} pigJob Job is a Pig job.
 * @property {dataproc(v1).SparkSqlJob} sparkSqlJob Job is a SparkSql job.
 * @property {dataproc(v1).JobStatus} status [Output-only] The job status. Additional application-specific status information may be contained in the type_job and yarn_applications fields.
 * @property {dataproc(v1).JobStatus[]} statusHistory [Output-only] The previous job status.
 * @property {dataproc(v1).YarnApplication[]} yarnApplications [Output-only] The collection of YARN applications spun up by this job. **Beta** Feature: This report is available for testing purposes only. It may be changed before final release.
 * @property {string} driverOutputResourceUri [Output-only] A URI pointing to the location of the stdout of the job&#39;s driver program.
 * @property {string} driverControlFilesUri [Output-only] If present, the location of miscellaneous control files which may be used as part of job setup and handling. If not present, control files may be placed in the same location as `driver_output_uri`.
 * @property {object} labels [Optional] The labels to associate with this job. Label **keys** must contain 1 to 63 characters, and must conform to [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). Label **values** may be empty, but, if present, must contain 1 to 63 characters, and must conform to [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a job.
 */
/**
 * @typedef JobReference
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
 * @property {string} jobId [Optional] The job ID, which must be unique within the project. The job ID is generated by the server upon job submission or provided by the user as a means to perform retries without creating duplicate jobs. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or hyphens (-). The maximum length is 512 characters.
 */
/**
 * @typedef JobPlacement
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} clusterName [Required] The name of the cluster where the job will be submitted.
 * @property {string} clusterUuid [Output-only] A cluster UUID generated by the Cloud Dataproc service when the job is submitted.
 */
/**
 * @typedef HadoopJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} mainJarFileUri The HCFS URI of the jar file containing the main class. Examples: &#39;gs://foo-bucket/analytics-binaries/extract-useful-metrics-mr.jar&#39; &#39;hdfs:/tmp/test-samples/custom-wordcount.jar&#39; &#39;file:///home/usr/lib/hadoop-mapreduce/hadoop-mapreduce-examples.jar&#39;
 * @property {string} mainClass The name of the driver&#39;s main class. The jar file containing the class must be in the default CLASSPATH or specified in `jar_file_uris`.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as `-libjars` or `-Dfoo=bar`, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} jarFileUris [Optional] Jar file URIs to add to the CLASSPATHs of the Hadoop driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS (Hadoop Compatible Filesystem) URIs of files to be copied to the working directory of Hadoop drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of Hadoop drivers and tasks. Supported file types: .jar, .tar, .tar.gz, .tgz, or .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Hadoop. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site and classes in user code.
 * @property {dataproc(v1).LoggingConfig} loggingConfig [Optional] The runtime log config for job execution.
 */
/**
 * @typedef LoggingConfig
 * @memberOf! dataproc(v1)
 * @type object
 * @property {object} driverLogLevels The per-package log levels for the driver. This may include &quot;root&quot; package name to configure rootLogger. Examples: &#39;com.google = FATAL&#39;, &#39;root = INFO&#39;, &#39;org.apache = DEBUG&#39;
 */
/**
 * @typedef SparkJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} mainJarFileUri The HCFS URI of the jar file that contains the main class.
 * @property {string} mainClass The name of the driver&#39;s main class. The jar file that contains the class must be in the default CLASSPATH or specified in `jar_file_uris`.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as `--conf`, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATHs of the Spark driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS URIs of files to be copied to the working directory of Spark drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of Spark drivers and tasks. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Spark. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
 * @property {dataproc(v1).LoggingConfig} loggingConfig [Optional] The runtime log config for job execution.
 */
/**
 * @typedef PySparkJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} mainPythonFileUri [Required] The HCFS URI of the main Python file to use as the driver. Must be a .py file.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as `--conf`, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} pythonFileUris [Optional] HCFS file URIs of Python files to pass to the PySpark framework. Supported file types: .py, .egg, and .zip.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATHs of the Python driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS URIs of files to be copied to the working directory of Python drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of .jar, .tar, .tar.gz, .tgz, and .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure PySpark. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
 * @property {dataproc(v1).LoggingConfig} loggingConfig [Optional] The runtime log config for job execution.
 */
/**
 * @typedef HiveJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains Hive queries.
 * @property {dataproc(v1).QueryList} queryList A list of queries.
 * @property {boolean} continueOnFailure [Optional] Whether to continue executing queries if a query fails. The default value is `false`. Setting to `true` can be useful when executing independent parallel queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Hive command: `SET name=&quot;value&quot;;`).
 * @property {object} properties [Optional] A mapping of property names and values, used to configure Hive. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site.xml, /etc/hive/conf/hive-site.xml, and classes in user code.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATH of the Hive server and Hadoop MapReduce (MR) tasks. Can contain Hive SerDes and UDFs.
 */
/**
 * @typedef QueryList
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string[]} queries [Required] The queries to execute. You do not need to terminate a query with a semicolon. Multiple queries can be specified in one string by separating each with a semicolon. Here is an example of an Cloud Dataproc API snippet that uses a QueryList to specify a HiveJob: &quot;hiveJob&quot;: { &quot;queryList&quot;: { &quot;queries&quot;: [ &quot;query1&quot;, &quot;query2&quot;, &quot;query3;query4&quot;, ] } }
 */
/**
 * @typedef PigJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains the Pig queries.
 * @property {dataproc(v1).QueryList} queryList A list of queries.
 * @property {boolean} continueOnFailure [Optional] Whether to continue executing queries if a query fails. The default value is `false`. Setting to `true` can be useful when executing independent parallel queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Pig command: `name=[value]`).
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Pig. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site.xml, /etc/pig/conf/pig.properties, and classes in user code.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATH of the Pig Client and Hadoop MapReduce (MR) tasks. Can contain Pig UDFs.
 * @property {dataproc(v1).LoggingConfig} loggingConfig [Optional] The runtime log config for job execution.
 */
/**
 * @typedef SparkSqlJob
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains SQL queries.
 * @property {dataproc(v1).QueryList} queryList A list of queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Spark SQL command: SET `name=&quot;value&quot;;`).
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Spark SQL&#39;s SparkConf. Properties that conflict with values set by the Cloud Dataproc API may be overwritten.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to be added to the Spark CLASSPATH.
 * @property {dataproc(v1).LoggingConfig} loggingConfig [Optional] The runtime log config for job execution.
 */
/**
 * @typedef JobStatus
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} state [Output-only] A state message specifying the overall job state.
 * @property {string} details [Output-only] Optional job state details, such as an error description if the state is ERROR.
 * @property {string} stateStartTime [Output-only] The time when this state was entered.
 */
/**
 * @typedef YarnApplication
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} name [Required] The application name.
 * @property {string} state [Required] The application state.
 * @property {number} progress [Required] The numerical progress of the application, from 1 to 100.
 * @property {string} trackingUrl [Optional] The HTTP URL of the ApplicationMaster, HistoryServer, or TimelineServer that provides application-specific information. The URL uses the internal hostname, and requires a proxy server for resolution and, possibly, access.
 */
/**
 * @typedef ListJobsResponse
 * @memberOf! dataproc(v1)
 * @type object
 * @property {dataproc(v1).Job[]} jobs [Output-only] Jobs list.
 * @property {string} nextPageToken [Optional] This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the `page_token` in a subsequent ListJobsRequest.
 */
/**
 * @typedef CancelJobRequest
 * @memberOf! dataproc(v1)
 * @type object
 */
/**
 * @typedef Empty
 * @memberOf! dataproc(v1)
 * @type object
 */
/**
 * @typedef ListOperationsResponse
 * @memberOf! dataproc(v1)
 * @type object
 * @property {dataproc(v1).Operation[]} operations A list of operations that matches the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef DiagnoseClusterResults
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} outputUri [Output-only] The Google Cloud Storage URI of the diagnostic output. The output report is a plain text file with a summary of collected diagnostics.
 */
/**
 * @typedef ClusterOperationMetadata
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} clusterName [Output-only] Name of the cluster for the operation.
 * @property {string} clusterUuid [Output-only] Cluster UUID for the operation.
 * @property {dataproc(v1).ClusterOperationStatus} status [Output-only] Current operation status.
 * @property {dataproc(v1).ClusterOperationStatus[]} statusHistory [Output-only] The previous operation status.
 * @property {string} operationType [Output-only] The operation type.
 * @property {string} description [Output-only] Short description of operation.
 * @property {object} labels [Output-only] labels associated with the operation
 */
/**
 * @typedef ClusterOperationStatus
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} state [Output-only] A message containing the operation state.
 * @property {string} innerState [Output-only] A message containing the detailed operation state.
 * @property {string} details [Output-only]A message containing any operation metadata details.
 * @property {string} stateStartTime [Output-only] The time this state was entered.
 */
/**
 * @typedef DiagnoseClusterOutputLocation
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} outputUri [Output-only] The Google Cloud Storage URI of the diagnostic output. This will be a plain text file with summary of collected diagnostics.
 */
/**
 * @typedef OperationMetadata
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} state A message containing the operation state.
 * @property {string} innerState A message containing the detailed operation state.
 * @property {string} details A message containing any operation metadata details.
 * @property {string} insertTime The time that the operation was requested.
 * @property {string} startTime The time that the operation was started by the server.
 * @property {string} endTime The time that the operation completed.
 * @property {string} clusterName Name of the cluster for the operation.
 * @property {string} clusterUuid Cluster UUId for the operation.
 * @property {dataproc(v1).OperationStatus} status [Output-only] Current operation status.
 * @property {dataproc(v1).OperationStatus[]} statusHistory [Output-only] Previous operation status.
 * @property {string} operationType [Output-only] The operation type.
 * @property {string} description [Output-only] Short description of operation.
 */
/**
 * @typedef OperationStatus
 * @memberOf! dataproc(v1)
 * @type object
 * @property {string} state A message containing the operation state.
 * @property {string} innerState A message containing the detailed operation state.
 * @property {string} details A message containing any operation metadata details.
 * @property {string} stateStartTime The time this state was entered.
 */
module.exports = Dataproc;
