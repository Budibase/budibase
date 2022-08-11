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
 * var dataproc = google.dataproc('v1alpha1');
 *
 * @namespace dataproc
 * @type {Function}
 * @version v1alpha1
 * @variation v1alpha1
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
         * @desc Request to create a cluster in a project.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     resource: {},
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
         * @param {dataproc(v1alpha1).Cluster} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/clusters',
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
         * @desc Request to update a cluster in a project.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project the cluster belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The cluster name.
         *     clusterName: "",
         *     resource: {},
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project the cluster belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
         * @param {string} params.clusterName [Required] The cluster name.
         * @param {string=} params.updateMask [Required] Specifies the path, relative to Cluster, of the field to update. For example, to change the number of workers in a cluster to 5, the update_mask parameter would be specified as "configuration.worker_configuration.num_instances," and the PATCH request body would specify the new value, as follows: { "configuration":{ "workerConfiguration":{ "numInstances":"5" } } } Note: Currently, configuration.worker_configuration.num_instances is the only field that can be updated.
         * @param {dataproc(v1alpha1).Cluster} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
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
         * @desc Request to delete a cluster in a project.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The cluster name.
         *     clusterName: "",
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
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
         * @desc Request to get the resource representation for a cluster in a project.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The cluster name.
         *     clusterName: "",
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/clusters/{clusterName}',
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
         * @desc Request a list of all regions/{region}/clusters in a project.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the cluster belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
         * @param {string=} params.filter [Optional] A filter constraining which clusters to list. Valid filters contain label terms such as: labels.key1 = val1 AND (-labels.k2 = val2 OR labels.k3 = val3)
         * @param {integer=} params.pageSize The standard List page size.
         * @param {string=} params.pageToken The standard List page token.
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/clusters',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region'],
            pathParams: ['projectId', 'region'],
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
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     resource: {},
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
         * @param {dataproc(v1alpha1).SubmitJobRequest} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/jobs:submit',
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
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The job ID.
         *     jobId: "",
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/jobs/{jobId}',
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
         * dataproc.projects.regions.jobs.cancel
         *
         * @desc Starts a job cancellation request. To access the job resource after cancellation, call regions/{region}/jobs:list or regions/{region}/jobs:get.
         *
         * @example
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The job ID.
         *     jobId: "",
         *     resource: {},
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
         * @param {string} params.jobId [Required] The job ID.
         * @param {dataproc(v1alpha1).CancelJobRequest} params.resource Request body data
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/jobs/{jobId}:cancel',
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
         * // PRE-REQUISITES:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
         * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
         * // 3. To install the client library and Application Default Credentials library, run:
         * //    'npm install googleapis --save'
         * var google = require('googleapis');
         * var dataproc = google.dataproc('v1alpha1');
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
         *     // [Required] The ID of the Google Cloud Platform project that the job belongs to.
         *     projectId: "",
         *     // [Required] The Dataproc region in which to handle the request.
         *     region: "",
         *     // [Required] The job ID.
         *     jobId: "",
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
         * @memberOf! dataproc(v1alpha1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
         * @param {string} params.region [Required] The Dataproc region in which to handle the request.
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
              url: 'https://dataproc.googleapis.com/v1alpha1/projects/{projectId}/regions/{region}/jobs/{jobId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['projectId', 'region', 'jobId'],
            pathParams: ['projectId', 'region', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };

  self.operations = {

    /**
     * dataproc.operations.get
     *
     * @desc Gets the latest state of a long-running operation. Clients may use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @example
     * // PRE-REQUISITES:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
     * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
     * // 3. To install the client library and Application Default Credentials library, run:
     * //    'npm install googleapis --save'
     * var google = require('googleapis');
     * var dataproc = google.dataproc('v1alpha1');
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
     *     // The operation resource name.
     *     name: "",
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dataproc.operations.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dataproc.operations.get
     * @memberOf! dataproc(v1alpha1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The operation resource name.
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
          url: 'https://dataproc.googleapis.com/v1alpha1/{name}',
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
     * dataproc.operations.list
     *
     * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
     *
     * @example
     * // PRE-REQUISITES:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
     * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
     * // 3. To install the client library and Application Default Credentials library, run:
     * //    'npm install googleapis --save'
     * var google = require('googleapis');
     * var dataproc = google.dataproc('v1alpha1');
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
     *     // The operation collection name.
     *     name: "",
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
     *         dataproc.operations.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   dataproc.operations.list(request, recur);
     * });
     *
     * @alias dataproc.operations.list
     * @memberOf! dataproc(v1alpha1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The operation collection name.
     * @param {string=} params.filter [Required] A JSON object that contains filters for the list operation, in the format {"key1":"value1","key2":"value2", ..., }. Possible keys include project_id, cluster_name, and operation_state_matcher. If project_id is set, requests the list of operations that belong to the specified Google Cloud Platform project ID. This key is required. If cluster_name is set, requests the list of operations that were submitted to the specified cluster name. This key is optional. If operation_state_matcher is set, requests the list of operations that match one of the following status options: ALL, ACTIVE, or NON_ACTIVE.
     * @param {integer=} params.pageSize The standard List page size.
     * @param {string=} params.pageToken The standard List page token.
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
          url: 'https://dataproc.googleapis.com/v1alpha1/{name}',
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
     * dataproc.operations.cancel
     *
     * @desc Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients may use [Operations.GetOperation] or other methods to check whether the cancellation succeeded or the operation completed despite cancellation.
     *
     * @example
     * // PRE-REQUISITES:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
     * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
     * // 3. To install the client library and Application Default Credentials library, run:
     * //    'npm install googleapis --save'
     * var google = require('googleapis');
     * var dataproc = google.dataproc('v1alpha1');
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
     *     // The name of the operation resource to be cancelled.
     *     name: "",
     *     resource: {},
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dataproc.operations.cancel(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dataproc.operations.cancel
     * @memberOf! dataproc(v1alpha1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
     * @param {dataproc(v1alpha1).CancelOperationRequest} params.resource Request body data
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
          url: 'https://dataproc.googleapis.com/v1alpha1/{name}:cancel',
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
     * dataproc.operations.delete
     *
     * @desc Deletes a long-running operation. It indicates the client is no longer interested in the operation result. It does not cancel the operation.
     *
     * @example
     * // PRE-REQUISITES:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Dataproc API and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/dataproc_component/quotas
     * // 2. This sample uses Application Default Credentials for Auth. If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run 'gcloud beta auth application-default login'
     * // 3. To install the client library and Application Default Credentials library, run:
     * //    'npm install googleapis --save'
     * var google = require('googleapis');
     * var dataproc = google.dataproc('v1alpha1');
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
     *     // The name of the operation resource to be deleted.
     *     name: "",
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   dataproc.operations.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias dataproc.operations.delete
     * @memberOf! dataproc(v1alpha1)
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
          url: 'https://dataproc.googleapis.com/v1alpha1/{name}',
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
 * @typedef Cluster
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} projectId [Required] The Google Cloud Platform project ID that the cluster belongs to.
 * @property {string} clusterName [Required] The cluster name. Cluster names within a project must be unique. Names from deleted clusters can be reused.
 * @property {dataproc(v1alpha1).ClusterConfiguration} configuration [Required] The cluster configuration. It may differ from a user&#39;s initial configuration due to Cloud Dataproc setting of default values and updating clusters.
 * @property {object} labels [Optional] The labels to associate with this cluster. Label keys must be between 1 and 63 characters long, and must conform to the following PCRE regular expression: \p{Ll}\p{Lo}{0,62} Label values must be between 1 and 63 characters long, and must conform to the following PCRE regular expression: [\p{Ll}\p{Lo}\p{N}_-]{0,63} No more than 64 labels can be associated with a given cluster.
 * @property {dataproc(v1alpha1).ClusterStatus} status [Output-only] Cluster status.
 * @property {dataproc(v1alpha1).ClusterStatus[]} statusHistory [Output-only] Previous cluster statuses.
 * @property {string} createTime [Output-only] The timestamp of cluster creation.
 * @property {string} clusterUuid [Output-only] A cluster UUID (Unique Universal Identifier). Cloud Dataproc generates this value when it creates the cluster.
 * @property {dataproc(v1alpha1).ClusterMetrics} metrics Contains cluster daemon metrics such as HDFS and YARN stats.
 */
/**
 * @typedef ClusterConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} configurationBucket [Optional] A Google Cloud Storage staging bucket used for sharing generated SSH keys and configuration. If you do not specify a staging bucket, Cloud Dataproc will determine an appropriate Cloud Storage location (US, ASIA, or EU) for your cluster&#39;s staging bucket according to the Google Compute Engine zone where your cluster is deployed, then it will create and manage this project-level, per-location bucket for you.
 * @property {dataproc(v1alpha1).GceConfiguration} gceConfiguration [Deprecated] The Google Compute Engine configuration settings for cluster resources.
 * @property {integer} numWorkers [Deprecated] The number of worker nodes in the cluster.
 * @property {string[]} workers [Deprecated] The list of worker node names. Dataproc derives the names from cluster_name and num_workers if not set by user (recommended practice is to let Dataproc derive the name). Derived worker node name example: hadoop-w-0.
 * @property {string} masterName [Deprecated] The Master&#39;s hostname. Dataproc derives the name from cluster_name if not set by user (recommended practice is to let Dataproc derive the name). Derived master name example: hadoop-m.
 * @property {dataproc(v1alpha1).DiskConfiguration} masterDiskConfiguration [Deprecated] The configuration settings of master node disk options.
 * @property {dataproc(v1alpha1).DiskConfiguration} workerDiskConfiguration [Deprecated] The configuration settings of worker node disk options.
 * @property {dataproc(v1alpha1).GceClusterConfiguration} gceClusterConfiguration [Optional] The shared Google Compute Engine configuration settings for all instances in a cluster.
 * @property {dataproc(v1alpha1).InstanceGroupConfiguration} masterConfiguration [Optional] The Google Compute Engine configuration settings for the master instance in a cluster.
 * @property {dataproc(v1alpha1).InstanceGroupConfiguration} workerConfiguration [Optional] The Google Compute Engine configuration settings for worker instances in a cluster.
 * @property {dataproc(v1alpha1).InstanceGroupConfiguration} secondaryWorkerConfiguration [Optional] The Google Compute Engine configuration settings for additional worker instances in a cluster.
 * @property {dataproc(v1alpha1).SoftwareConfiguration} softwareConfiguration [Optional] The configuration settings for software inside the cluster.
 * @property {dataproc(v1alpha1).NodeInitializationAction[]} initializationActions [Optional] Commands to execute on each node after configuration is completed. By default, executables are run on master and all worker nodes. You can test a node&#39;s role metadata to run an executable on a master or worker node, as shown below: ROLE=$(/usr/share/google/get_metadata_value attributes/role) if [[ &quot;${ROLE}&quot; == &#39;Master&#39; ]]; then ... master specific actions ... else ... worker specific actions ... fi
 */
/**
 * @typedef GceConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} imageUri [Deprecated] The Google Compute Engine image resource used for cluster instances. Example: &quot;compute.googleapis.com/projects/debian-cloud /global/images/backports-debian-7-wheezy-v20140904&quot;.
 * @property {string} machineTypeUri [Deprecated] The Google Compute Engine machine type used for cluster instances. Example: &quot;compute.googleapis.com/projects/[project_id] /zones/us-east1-a/machineTypes/n1-standard-2&quot;.
 * @property {string} zoneUri [Deprecated] The zone where the Google Compute Engine cluster will be located. Example: &quot;compute.googleapis.com/projects/[project_id] /zones/us-east1-a&quot;.
 * @property {string} networkUri [Deprecated] The Google Compute Engine network to be used for machine communications. Inbound SSH connections are necessary to complete cluster configuration. Example &quot;compute.googleapis.com/projects/[project_id] /zones/us-east1-a/default&quot;.
 * @property {string[]} serviceAccountScopes [Deprecated] The service account scopes included in Google Compute Engine instances. Must include devstorage.full_control to enable the Google Cloud Storage connector. Example &quot;auth.googleapis.com/compute&quot; and &quot;auth.googleapis.com/devstorage.full_control&quot;.
 */
/**
 * @typedef DiskConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {integer} bootDiskSizeGb [Optional] Size in GB of the boot disk (default is 500GB).
 * @property {integer} numLocalSsds [Optional] Number of attached SSDs, from 0 to 4 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs, and HDFS data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic configuration and installed binaries.
 */
/**
 * @typedef GceClusterConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} zoneUri [Required] The zone where the Google Compute Engine cluster will be located. Example: &quot;compute.googleapis.com/projects/[project_id] /zones/us-east1-a&quot;.
 * @property {string} networkUri The Google Compute Engine network to be used for machine communications. Cannot be specified with subnetwork_uri. If neither network_uri nor subnetwork_uri is specified, the &quot;default&quot; network of the project is used, if it exists. Cannot be a &quot;Custom Subnet Network&quot; (see https://cloud.google.com/compute/docs/subnetworks for more information). Example: `compute.googleapis.com/projects/[project_id]/regions/global/default`.
 * @property {string} subnetworkUri The Google Compute Engine subnetwork to be used for machine communications. Cannot be specified with network_uri. Example: `compute.googleapis.com/projects/[project_id]/regions/us-east1/sub0`.
 * @property {boolean} internalIpOnly If true, all instances in the cluser will only have internal IP addresses. By default, clusters are not restricted to internal IP addresses, and will have ephemeral external IP addresses assigned to each instance. This restriction can only be enabled for subnetwork enabled networks, and all off-cluster dependencies must be configured to be accessible without external IP addresses.
 * @property {string[]} serviceAccountScopes The service account scopes included in Google Compute Engine instances. Must include devstorage.full_control to enable the Google Cloud Storage connector. Example &quot;auth.googleapis.com/compute&quot; and &quot;auth.googleapis.com/devstorage.full_control&quot;.
 * @property {string[]} tags The Google Compute Engine tags to add to all instances.
 * @property {object} metadata The Google Compute Engine metadata entries to add to all instances.
 */
/**
 * @typedef InstanceGroupConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {integer} numInstances The number of VM instances in the instance group. For master instance groups, must be set to 1.
 * @property {string[]} instanceNames The list of instance names. Dataproc derives the names from cluster_name, num_instances, and the instance group if not set by user (recommended practice is to let Dataproc derive the name).
 * @property {string} imageUri [Output-only] The Google Compute Engine image resource used for cluster instances. Inferred from SoftwareConfiguration.image_version. Example: &quot;compute.googleapis.com/projects/debian-cloud /global/images/backports-debian-7-wheezy-v20140904&quot;.
 * @property {string} machineTypeUri The Google Compute Engine machine type used for cluster instances. Example: &quot;compute.googleapis.com/projects/[project_id] /zones/us-east1-a/machineTypes/n1-standard-2&quot;.
 * @property {dataproc(v1alpha1).DiskConfiguration} diskConfiguration Disk option configuration settings.
 * @property {boolean} isPreemptible Specifies that this instance group contains Preemptible Instances.
 * @property {dataproc(v1alpha1).ManagedGroupConfiguration} managedGroupConfiguration [Output-only] The configuration for Google Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.
 */
/**
 * @typedef ManagedGroupConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} instanceTemplateName [Output-only] The name of Instance Template used for Managed Instance Group.
 * @property {string} instanceGroupManagerName [Output-only] The name of Instance Group Manager managing this group.
 */
/**
 * @typedef SoftwareConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} imageVersion [Optional] The version of software inside the cluster. It must match the regular expression [0-9]+\.[0-9]+. If unspecified it will default to latest version.
 * @property {object} properties [Optional] The properties to set on daemon configuration files. Property keys are specified in &quot;prefix:property&quot; format, such as &quot;core:fs.defaultFS&quot;. The following are supported prefixes and their mappings: core - core-site.xml hdfs - hdfs-site.xml mapred - mapred-site.xml yarn - yarn-site.xml hive - hive-site.xml pig - pig.properties spark - spark-defaults.conf
 */
/**
 * @typedef NodeInitializationAction
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} executableFile [Required] Google Cloud Storage URI of executable file.
 * @property {string} executionTimeout [Optional] Amount of time executable has to complete. Default is 10 minutes. Cluster creation fails with an explanatory error message (the name of the executable that caused the error and the exceeded timeout period) if the executable is not completed at end of the timeout period.
 */
/**
 * @typedef ClusterStatus
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} state The cluster&#39;s state.
 * @property {string} detail Optional details of cluster&#39;s state.
 * @property {string} stateStartTime Time when this state was entered.
 */
/**
 * @typedef ClusterMetrics
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {object} hdfsMetrics The HDFS metrics.
 * @property {object} yarnMetrics The YARN metrics.
 */
/**
 * @typedef Operation
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} name The name of the operation resource, in the format projects/[project_id]/operations/[operation_id]
 * @property {object} metadata Service-specific metadata associated with the operation.
 * @property {boolean} done Indicates if the operation is done. If true, the operation is complete and the `result` is available. If false, the operation is still in progress.
 * @property {dataproc(v1alpha1).Status} error The error result of the operation in case of failure.
 * @property {object} response The operation response. If the called method returns no data on success, the response is `google.protobuf.Empty`. If the called method is `Get`,`Create` or `Update`, the response is the resource. For all other methods, the response type is a concatenation of the method name and &quot;Response&quot;. For example, if the called method is `TakeSnapshot()`, the response type is `TakeSnapshotResponse`.
 */
/**
 * @typedef Status
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef ListClustersResponse
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {dataproc(v1alpha1).Cluster[]} clusters [Output-only] The clusters in the project.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef SubmitJobRequest
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {dataproc(v1alpha1).Job} job [Required] The job resource.
 */
/**
 * @typedef Job
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {dataproc(v1alpha1).JobReference} reference [Optional] The fully-qualified reference to the job, which can be used to obtain the equivalent REST path of the job resource. If this property is not specified when a job is created, the server generates a job_id.
 * @property {dataproc(v1alpha1).JobPlacement} placement [Required] Job information, including how, when, and where to run the job.
 * @property {dataproc(v1alpha1).HadoopJob} hadoopJob Job is a Hadoop job.
 * @property {dataproc(v1alpha1).SparkJob} sparkJob Job is a Spark job.
 * @property {dataproc(v1alpha1).PySparkJob} pysparkJob Job is a Pyspark job.
 * @property {dataproc(v1alpha1).HiveJob} hiveJob Job is a Hive job.
 * @property {dataproc(v1alpha1).PigJob} pigJob Job is a Pig job.
 * @property {dataproc(v1alpha1).SparkSqlJob} sparkSqlJob Job is a SparkSql job.
 * @property {dataproc(v1alpha1).JobStatus} status [Output-only] The job status. Additional application-specific status information may be contained in the type_job and yarn_applications fields.
 * @property {dataproc(v1alpha1).JobStatus[]} statusHistory [Output-only] The previous job status.
 * @property {dataproc(v1alpha1).YarnApplication[]} yarnApplications [Output-only] The collection of Yarn applications spun up by this job.
 * @property {string} submittedBy [Output-only] The email address of the user submitting the job. For jobs submitted on the cluster, the address is username@hostname.
 * @property {string} driverOutputUri [Output-only] A URI pointing to the location of the mixed stdout/stderr of the job&#39;s driver program—for example, gs://sysbucket123/foo-cluster/jobid-123/driver/output.
 * @property {string} driverInputResourceUri [Output-only] A URI pointing to the location of the stdin of the job&#39;s driver program, only set if the job is interactive.
 * @property {string} driverOutputResourceUri [Output-only] A URI pointing to the location of the stdout of the job&#39;s driver program.
 * @property {string} driverControlFilesUri [Output-only] If present, the location of miscellaneous control files which may be used as part of job setup and handling. If not present, control files may be placed in the same location as driver_output_uri.
 * @property {boolean} interactive [Optional] If set to true, then the driver&#39;s stdin will be kept open and driver_input_uri will be set to provide a path at which additional input can be sent to the driver.
 * @property {object} labels [Optional] The labels to associate with this job. Label keys must be between 1 and 63 characters long, and must conform to the following regular expression: \p{Ll}\p{Lo}{0,62} Label values must be between 1 and 63 characters long, and must conform to the following regular expression: [\p{Ll}\p{Lo}\p{N}_-]{0,63} No more than 64 labels can be associated with a given job.
 */
/**
 * @typedef JobReference
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} projectId [Required] The ID of the Google Cloud Platform project that the job belongs to.
 * @property {string} jobId [Required] The job ID, which must be unique within the project. The job ID is generated by the server upon job submission or provided by the user as a means to perform retries without creating duplicate jobs. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-). The maximum length is 512 characters.
 */
/**
 * @typedef JobPlacement
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} clusterName [Required] The name of the cluster where the job will be submitted.
 * @property {string} clusterUuid [Output-only] A cluster UUID generated by the Dataproc service when the job is submitted.
 */
/**
 * @typedef HadoopJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} mainJarFileUri The Hadoop Compatible Filesystem (HCFS) URI of the jar file containing the main class. Examples: gs://foo-bucket/analytics-binaries/extract-useful-metrics-mr.jar hdfs:/tmp/test-samples/custom-wordcount.jar file:///home/usr/lib/hadoop-mapreduce/hadoop-mapreduce-examples.jar
 * @property {string} mainClass The name of the driver&#39;s main class. The jar file containing the class must be in the default CLASSPATH or specified in jar_file_uris.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as -libjars or -Dfoo=bar, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} jarFileUris [Optional] Jar file URIs to add to the CLASSPATHs of the Hadoop driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS URIs of files to be copied to the working directory of Hadoop drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of Hadoop drivers and tasks. Supported file types: .jar, .tar, .tar.gz, .tgz, or .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Hadoop. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site and classes in user code.
 * @property {dataproc(v1alpha1).LoggingConfiguration} loggingConfiguration [Optional] The runtime log configuration for job execution.
 */
/**
 * @typedef LoggingConfiguration
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {object} driverLogLevels The per-package log levels for the driver. This may include &#39;root&#39; package name to configure rootLogger. Examples: com.google = FATAL, root = INFO, org.apache = DEBUG
 */
/**
 * @typedef SparkJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} mainJarFileUri The Hadoop Compatible Filesystem (HCFS) URI of the jar file that contains the main class.
 * @property {string} mainClass The name of the driver&#39;s main class. The jar file that contains the class must be in the default CLASSPATH or specified in jar_file_uris.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATHs of the Spark driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS URIs of files to be copied to the working directory of Spark drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of Spark drivers and tasks. Supported file types: .jar, .tar, .tar.gz, .tgz, and .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Spark. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
 * @property {dataproc(v1alpha1).LoggingConfiguration} loggingConfiguration [Optional] The runtime log configuration for job execution.
 */
/**
 * @typedef PySparkJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} mainPythonFileUri [Required] The Hadoop Compatible Filesystem (HCFS) URI of the main Python file to use as the driver. Must be a .py file.
 * @property {string[]} args [Optional] The arguments to pass to the driver. Do not include arguments, such as --conf, that can be set as job properties, since a collision may occur that causes an incorrect job submission.
 * @property {string[]} pythonFileUris [Optional] HCFS file URIs of Python files to pass to the PySpark framework. Supported file types: .py, .egg, and .zip.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATHs of the Python driver and tasks.
 * @property {string[]} fileUris [Optional] HCFS URIs of files to be copied to the working directory of Python drivers and distributed tasks. Useful for naively parallel tasks.
 * @property {string[]} archiveUris [Optional] HCFS URIs of archives to be extracted in the working directory of .jar, .tar, .tar.gz, .tgz, and .zip.
 * @property {object} properties [Optional] A mapping of property names to values, used to configure PySpark. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/spark/conf/spark-defaults.conf and classes in user code.
 * @property {dataproc(v1alpha1).LoggingConfiguration} loggingConfiguration [Optional] The runtime log configuration for job execution.
 */
/**
 * @typedef HiveJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains Hive queries.
 * @property {dataproc(v1alpha1).QueryList} queryList A list of queries.
 * @property {boolean} continueOnFailure [Optional] Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Hive command: &#39;SET name=&quot;value&quot;;&#39;).
 * @property {object} properties [Optional] A mapping of property names and values, used to configure Hive. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site.xml, /etc/hive/conf/hive-site.xml, and classes in user code.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATH of the Hive server and Hadoop MapReduce (MR) tasks. Can contain Hive SerDes and UDFs.
 */
/**
 * @typedef QueryList
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string[]} queries [Required] The queries to execute. You do not need to terminate a query with a semicolon. Multiple queries can be specified in one string by separating each with a semicolon. Here is an example of an Cloud Dataproc API snippet that uses a QueryList to specify a HiveJob: &quot;hiveJob&quot;: { &quot;queryList&quot;: { &quot;queries&quot;: [ &quot;query1&quot;, &quot;query2&quot;, &quot;query3;query4&quot;, ] } }
 */
/**
 * @typedef PigJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains the Pig queries.
 * @property {dataproc(v1alpha1).QueryList} queryList A list of queries.
 * @property {boolean} continueOnFailure [Optional] Whether to continue executing queries if a query fails. The default value is false. Setting to true can be useful when executing independent parallel queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Pig command: &quot;name=[value]&quot;).
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Pig. Properties that conflict with values set by the Cloud Dataproc API may be overwritten. Can include properties set in /etc/hadoop/conf/*-site.xml, /etc/pig/conf/pig.properties, and classes in user code.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to add to the CLASSPATH of the Pig Client and Hadoop MapReduce (MR) tasks. Can contain Pig UDFs.
 * @property {dataproc(v1alpha1).LoggingConfiguration} loggingConfiguration [Optional] The runtime log configuration for job execution.
 */
/**
 * @typedef SparkSqlJob
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} queryFileUri The HCFS URI of the script that contains SQL queries.
 * @property {dataproc(v1alpha1).QueryList} queryList A list of queries.
 * @property {object} scriptVariables [Optional] Mapping of query variable names to values (equivalent to the Spark SQL command: SET name=&quot;value&quot;;).
 * @property {object} properties [Optional] A mapping of property names to values, used to configure Spark SQL&#39;s SparkConf. Properties that conflict with values set by the Cloud Dataproc API may be overwritten.
 * @property {string[]} jarFileUris [Optional] HCFS URIs of jar files to be added to the Spark CLASSPATH.
 * @property {dataproc(v1alpha1).LoggingConfiguration} loggingConfiguration [Optional] The runtime log configuration for job execution.
 */
/**
 * @typedef JobStatus
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} state [Required] A state message specifying the overall job state.
 * @property {string} details [Optional] Job state details, such as an error description if the state is ERROR.
 * @property {string} insertTime The time of the job request.
 * @property {string} startTime The time when the server started the job.
 * @property {string} endTime The time when the job completed.
 * @property {string} stateStartTime [Output-only] The time when this state was entered.
 */
/**
 * @typedef YarnApplication
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} name [Required] The application name.
 * @property {string} state [Required] The application state.
 * @property {number} progress [Required] The numerical progress of the application, from 1 to 100.
 * @property {string} trackingUrl [Optional] The HTTP URL of the ApplicationMaster, HistoryServer, or TimelineServer that provides application-specific information. The URL uses the internal hostname, and requires a proxy server for resolution and, possibly, access.
 */
/**
 * @typedef ListJobsResponse
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {dataproc(v1alpha1).Job[]} jobs [Output-only] Jobs list.
 * @property {string} nextPageToken [Optional] This token is included in the response if there are more results to fetch. To fetch additional results, provide this value as the page_token in a subsequent ListJobsRequest.
 */
/**
 * @typedef ListJobsRequest
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {integer} pageSize [Optional] The number of results to return in each response.
 * @property {string} pageToken [Optional] The page token, returned by a previous call, to request the next page of results.
 * @property {string} clusterName [Optional] If set, the returned jobs list includes only jobs that were submitted to the named cluster.
 * @property {string} jobStateMatcher [Optional] Specifies enumerated categories of jobs to list.
 * @property {string} filter [Optional] A filter constraining which jobs to list. Valid filters contain job state and label terms such as: labels.key1 = val1 AND (labels.k2 = val2 OR labels.k3 = val3)
 */
/**
 * @typedef CancelJobRequest
 * @memberOf! dataproc(v1alpha1)
 * @type object
 */
/**
 * @typedef ListOperationsResponse
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {dataproc(v1alpha1).Operation[]} operations A list of operations that match the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef CancelOperationRequest
 * @memberOf! dataproc(v1alpha1)
 * @type object
 */
/**
 * @typedef Empty
 * @memberOf! dataproc(v1alpha1)
 * @type object
 */
/**
 * @typedef DiagnoseClusterResults
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} outputUri [Output-only] The Google Cloud Storage URI of the diagnostic output. The output report is a plain text file with a summary of collected diagnostics.
 */
/**
 * @typedef ClusterOperationMetadata
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} clusterName [Output-only] Name of the cluster for the operation.
 * @property {string} clusterUuid [Output-only] Cluster UUID for the operation.
 * @property {dataproc(v1alpha1).ClusterOperationStatus} status [Output-only] Current operation status.
 * @property {dataproc(v1alpha1).ClusterOperationStatus[]} statusHistory [Output-only] The previous operation status.
 * @property {string} operationType [Output-only] The operation type.
 * @property {string} description [Output-only] Short description of operation.
 * @property {object} labels [Output-only] labels associated with the operation
 */
/**
 * @typedef ClusterOperationStatus
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} state [Output-only] A message containing the operation state.
 * @property {string} innerState [Output-only] A message containing the detailed operation state.
 * @property {string} details [Output-only]A message containing any operation metadata details.
 * @property {string} stateStartTime [Output-only] The time this state was entered.
 */
/**
 * @typedef DiagnoseClusterOutputLocation
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} outputUri [Output-only] The Google Cloud Storage URI of the diagnostic output. This will be a plain text file with summary of collected diagnostics.
 */
/**
 * @typedef OperationMetadata
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} state A message containing the operation state.
 * @property {string} innerState A message containing the detailed operation state.
 * @property {string} details A message containing any operation metadata details.
 * @property {string} insertTime The time that the operation was requested.
 * @property {string} startTime The time that the operation was started by the server.
 * @property {string} endTime The time that the operation completed.
 * @property {string} clusterName Name of the cluster for the operation.
 * @property {string} clusterUuid Cluster UUId for the operation.
 * @property {dataproc(v1alpha1).OperationStatus} status [Output-only] Current operation status.
 * @property {dataproc(v1alpha1).OperationStatus[]} statusHistory [Output-only] Previous operation status.
 * @property {string} operationType [Output-only] The operation type.
 * @property {string} description [Output-only] Short description of operation.
 */
/**
 * @typedef OperationStatus
 * @memberOf! dataproc(v1alpha1)
 * @type object
 * @property {string} state A message containing the operation state.
 * @property {string} innerState A message containing the detailed operation state.
 * @property {string} details A message containing any operation metadata details.
 * @property {string} stateStartTime The time this state was entered.
 */
module.exports = Dataproc;
