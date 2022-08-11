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
 * Google Cloud Deployment Manager API
 *
 * Declares, configures, and deploys complex solutions on Google Cloud Platform.
 *
 * @example
 * var google = require('googleapis');
 * var deploymentmanager = google.deploymentmanager('v2');
 *
 * @namespace deploymentmanager
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Deploymentmanager
 */
function Deploymentmanager(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.deployments = {

    /**
     * deploymentmanager.deployments.cancelPreview
     *
     * @desc Cancels and removes the preview currently associated with the deployment.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'cancelPreview' method:
     *
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.cancelPreview(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.cancelPreview
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.project The project ID for this request.
     * @param {deploymentmanager(v2).DeploymentsCancelPreviewRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancelPreview: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/cancelPreview',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.delete
     *
     * @desc Deletes a deployment and all of the resources in the deployment.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.delete
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.deletePolicy Sets the policy to use for deleting resources.
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.get
     *
     * @desc Gets information about a specific deployment.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.get
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias deploymentmanager.deployments.getIamPolicy
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.insert
     *
     * @desc Creates a deployment and all of the resources described by the deployment manifest.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.insert(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.insert
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.preview If set to true, creates a deployment and creates "shell" resources but does not actually instantiate these resources. This allows you to preview what your deployment looks like. After previewing a deployment, you can deploy your resources by making a request with the update() method or you can use the cancelPreview() method to cancel the preview altogether. Note that the deployment will still exist after you cancel the preview and you must separately delete this deployment if you want to remove it.
     * @param {string} params.project The project ID for this request.
     * @param {deploymentmanager(v2).Deployment} params.resource Request body data
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments',
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
     * deploymentmanager.deployments.list
     *
     * @desc Lists all deployments for a given project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
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
     *         deploymentmanager.deployments.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   deploymentmanager.deployments.list(request, recur);
     * });
     *
     * @alias deploymentmanager.deployments.list
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments',
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
     * deploymentmanager.deployments.patch
     *
     * @desc Updates a deployment and all of the resources described by the deployment manifest. This method supports patch semantics.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.patch(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.patch
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.createPolicy Sets the policy to use for creating new resources.
     * @param {string=} params.deletePolicy Sets the policy to use for deleting resources.
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {boolean=} params.preview If set to true, updates the deployment and creates and updates the "shell" resources but does not actually alter or instantiate these resources. This allows you to preview what your deployment will look like. You can use this intent to preview how an update would affect your deployment. You must provide a target.config with a configuration if this is set to true. After previewing a deployment, you can deploy your resources by making a request with the update() or you can cancelPreview() to remove the preview altogether. Note that the deployment will still exist after you cancel the preview and you must separately delete this deployment if you want to remove it.
     * @param {string} params.project The project ID for this request.
     * @param {deploymentmanager(v2).Deployment} params.resource Request body data
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias deploymentmanager.deployments.setIamPolicy
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {deploymentmanager(v2).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.stop
     *
     * @desc Stops an ongoing operation. This does not roll back any work that has already been completed, but prevents any new work from being started.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'stop' method:
     *
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.stop(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.stop
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.project The project ID for this request.
     * @param {deploymentmanager(v2).DeploymentsStopRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/stop',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias deploymentmanager.deployments.testIamPermissions
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {deploymentmanager(v2).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.deployments.update
     *
     * @desc Updates a deployment and all of the resources described by the deployment manifest.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.deployments.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.deployments.update
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.createPolicy Sets the policy to use for creating new resources.
     * @param {string=} params.deletePolicy Sets the policy to use for deleting resources.
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {boolean=} params.preview If set to true, updates the deployment and creates and updates the "shell" resources but does not actually alter or instantiate these resources. This allows you to preview what your deployment will look like. You can use this intent to preview how an update would affect your deployment. You must provide a target.config with a configuration if this is set to true. After previewing a deployment, you can deploy your resources by making a request with the update() or you can cancelPreview() to remove the preview altogether. Note that the deployment will still exist after you cancel the preview and you must separately delete this deployment if you want to remove it.
     * @param {string} params.project The project ID for this request.
     * @param {deploymentmanager(v2).Deployment} params.resource Request body data
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.manifests = {

    /**
     * deploymentmanager.manifests.get
     *
     * @desc Gets information about a specific manifest.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     // * The name of the manifest for this request.
     *     manifest: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.manifests.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.manifests.get
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.manifest The name of the manifest for this request.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/manifests/{manifest}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment', 'manifest'],
        pathParams: ['deployment', 'manifest', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.manifests.list
     *
     * @desc Lists all manifests for a given deployment.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
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
     *         deploymentmanager.manifests.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   deploymentmanager.manifests.list(request, recur);
     * });
     *
     * @alias deploymentmanager.manifests.list
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/manifests',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.operations = {

    /**
     * deploymentmanager.operations.get
     *
     * @desc Gets information about a specific operation.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the operation for this request.
     *     operation: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.operations.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.operations.get
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation The name of the operation for this request.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'operation'],
        pathParams: ['operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.operations.list
     *
     * @desc Lists all operations for a project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
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
     *         deploymentmanager.operations.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   deploymentmanager.operations.list(request, recur);
     * });
     *
     * @alias deploymentmanager.operations.list
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/operations',
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

  self.resources = {

    /**
     * deploymentmanager.resources.get
     *
     * @desc Gets information about a single resource.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
     *
     *     // * The name of the resource for this request.
     *     resource_: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   deploymentmanager.resources.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias deploymentmanager.resources.get
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string} params.project The project ID for this request.
     * @param {string} params.resource_ The name of the resource for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/resources/{resource}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment', 'resource'],
        pathParams: ['deployment', 'project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * deploymentmanager.resources.list
     *
     * @desc Lists all resources in a given deployment.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
     *     project: "",
     *
     *     // * The name of the deployment for this request.
     *     deployment: "",
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
     *         deploymentmanager.resources.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   deploymentmanager.resources.list(request, recur);
     * });
     *
     * @alias deploymentmanager.resources.list
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.deployment The name of the deployment for this request.
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/resources',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'deployment'],
        pathParams: ['deployment', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.types = {

    /**
     * deploymentmanager.types.list
     *
     * @desc Lists all resource types for Deployment Manager.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Deployment Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/deploymentmanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var deploymentmanager = google.deploymentmanager('v2');
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
     *     // * The project ID for this request.
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
     *         deploymentmanager.types.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   deploymentmanager.types.list(request, recur);
     * });
     *
     * @alias deploymentmanager.types.list
     * @memberOf! deploymentmanager(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  You can filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. Use filtering on nested fields to take advantage of labels to organize and search for results based on label values.  To filter on multiple expressions, provide each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project The project ID for this request.
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
          url: 'https://www.googleapis.com/deploymentmanager/v2/projects/{project}/global/types',
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
}

/**
 * @typedef AuditConfig
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).AuditLogConfig[]} auditLogConfigs The configuration for each type of logging
 * @property {string[]} exemptedMembers Specifies the identities that are exempted from &quot;data access&quot; audit logging for the `service` specified above. Follows the same format of Binding.members.
 * @property {string} service Specifies a service that will be enabled for audit logging. For example, `resourcemanager`, `storage`, `compute`. `allServices` is a special value that covers all services.
 */
/**
 * @typedef AuditLogConfig
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string[]} exemptedMembers Specifies the identities that are exempted from this type of logging Follows the same format of Binding.members.
 * @property {string} logType The log type that this config enables.
 */
/**
 * @typedef Binding
 * @memberOf! deploymentmanager(v2)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource. `members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google account. For example, `alice@gmail.com` or `joe@example.com`.



* `serviceAccount:{emailid}`: An email address that represents a service account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group. For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the users of that domain. For example, `google.com` or `example.com`.
* @property {string} role Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
*/
/**
 * @typedef Condition
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} iam Trusted attributes supplied by the IAM system.
 * @property {string} op An operator to apply the subject with.
 * @property {string} svc Trusted attributes discharged by the service.
 * @property {string} sys Trusted attributes supplied by any service that owns resources and uses the IAM system for access control.
 * @property {string} value DEPRECATED. Use &#39;values&#39; instead.
 * @property {string[]} values The objects of the condition. This is mutually exclusive with &#39;value&#39;.
 */
/**
 * @typedef ConfigFile
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} content The contents of the file.
 */
/**
 * @typedef Deployment
 * @memberOf! deploymentmanager(v2)
 * @type object
* @property {string} description An optional user-provided description of the deployment.
* @property {string} fingerprint Provides a fingerprint to use in requests to modify a deployment, such as update(), stop(), and cancelPreview() requests. A fingerprint is a randomly generated value that must be provided with update(), stop(), and cancelPreview() requests to perform optimistic locking. This ensures optimistic concurrency so that only one request happens at a time.

The fingerprint is initially generated by Deployment Manager and changes after every request to modify data. To get the latest fingerprint value, perform a get() request to a deployment.
* @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
* @property {string} insertTime [Output Only] Timestamp when the deployment was created, in RFC3339 text format .
* @property {deploymentmanager(v2).DeploymentLabelEntry[]} labels Map of labels; provided by the client when the resource is created or updated. Specifically: Label keys must be between 1 and 63 characters long and must conform to the following regular expression: [a-z]([-a-z0-9]*[a-z0-9])? Label values must be between 0 and 63 characters long and must conform to the regular expression ([a-z]([-a-z0-9]*[a-z0-9])?)?
* @property {string} manifest [Output Only] URL of the manifest representing the last manifest that was successfully deployed.
* @property {string} name Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression [a-z]([-a-z0-9]*[a-z0-9])? which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
* @property {deploymentmanager(v2).Operation} operation [Output Only] The Operation that most recently ran, or is currently running, on this deployment.
* @property {string} selfLink [Output Only] Self link for the deployment.
* @property {deploymentmanager(v2).TargetConfiguration} target [Input Only] The parameters that define your deployment, including the deployment configuration and relevant templates.
* @property {deploymentmanager(v2).DeploymentUpdate} update [Output Only] If Deployment Manager is currently updating or previewing an update to this deployment, the updated configuration appears here.
*/
/**
 * @typedef DeploymentLabelEntry
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} key 
 * @property {string} value 
 */
/**
 * @typedef DeploymentUpdate
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).DeploymentUpdateLabelEntry[]} labels [Output Only] Map of labels; provided by the client when the resource is created or updated. Specifically: Label keys must be between 1 and 63 characters long and must conform to the following regular expression: [a-z]([-a-z0-9]*[a-z0-9])? Label values must be between 0 and 63 characters long and must conform to the regular expression ([a-z]([-a-z0-9]*[a-z0-9])?)?
 * @property {string} manifest [Output Only] URL of the manifest representing the update configuration of this deployment.
 */
/**
 * @typedef DeploymentUpdateLabelEntry
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} key 
 * @property {string} value 
 */
/**
 * @typedef DeploymentsCancelPreviewRequest
 * @memberOf! deploymentmanager(v2)
 * @type object
* @property {string} fingerprint Specifies a fingerprint for cancelPreview() requests. A fingerprint is a randomly generated value that must be provided in cancelPreview() requests to perform optimistic locking. This ensures optimistic concurrency so that the deployment does not have conflicting requests (e.g. if someone attempts to make a new update request while another user attempts to cancel a preview, this would prevent one of the requests).

The fingerprint is initially generated by Deployment Manager and changes after every request to modify a deployment. To get the latest fingerprint value, perform a get() request on the deployment.
*/
/**
 * @typedef DeploymentsListResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).Deployment[]} deployments [Output Only] The deployments contained in this response.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 */
/**
 * @typedef DeploymentsStopRequest
 * @memberOf! deploymentmanager(v2)
 * @type object
* @property {string} fingerprint Specifies a fingerprint for stop() requests. A fingerprint is a randomly generated value that must be provided in stop() requests to perform optimistic locking. This ensures optimistic concurrency so that the deployment does not have conflicting requests (e.g. if someone attempts to make a new update request while another user attempts to stop an ongoing update request, this would prevent a collision).

The fingerprint is initially generated by Deployment Manager and changes after every request to modify a deployment. To get the latest fingerprint value, perform a get() request on the deployment.
*/
/**
 * @typedef ImportFile
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} content The contents of the file.
 * @property {string} name The name of the file.
 */
/**
 * @typedef LogConfig
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).LogConfigCounterOptions} counter Counter options.
 */
/**
 * @typedef LogConfigCounterOptions
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} field The field value to attribute.
 * @property {string} metric The metric to update.
 */
/**
 * @typedef Manifest
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).ConfigFile} config [Output Only] The YAML configuration for this manifest.
 * @property {string} expandedConfig [Output Only] The fully-expanded configuration file, including any templates and references.
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {deploymentmanager(v2).ImportFile[]} imports [Output Only] The imported files for this manifest.
 * @property {string} insertTime [Output Only] Timestamp when the manifest was created, in RFC3339 text format.
 * @property {string} layout [Output Only] The YAML layout for this manifest.
 * @property {string} name [Output Only] The name of the manifest.
 * @property {string} selfLink [Output Only] Self link for the manifest.
 */
/**
 * @typedef ManifestsListResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).Manifest[]} manifests [Output Only] Manifests contained in this list response.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 */
/**
 * @typedef Operation
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} clientOperationId [Output Only] Reserved for future use.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description [Output Only] A textual description of the operation, which is set when the operation is created.
 * @property {string} endTime [Output Only] The time that this operation was completed. This value is in RFC3339 text format.
 * @property {object} error [Output Only] If errors are generated during processing of the operation, this field will be populated.
 * @property {string} httpErrorMessage [Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as NOT FOUND.
 * @property {integer} httpErrorStatusCode [Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a 404 means the resource was not found.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested. This value is in RFC3339 text format.
 * @property {string} kind [Output Only] Type of the resource. Always compute#operation for Operation resources.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType [Output Only] The type of operation, such as insert, update, or delete, and so on.
 * @property {integer} progress [Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.
 * @property {string} region [Output Only] The URL of the region where the operation resides. Only available when performing regional operations.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server. This value is in RFC3339 text format.
 * @property {string} status [Output Only] The status of the operation, which can be one of the following: PENDING, RUNNING, or DONE.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] The unique target ID, which identifies a specific incarnation of the target resource.
 * @property {string} targetLink [Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the persistent disk that the snapshot was created from.
 * @property {string} user [Output Only] User who requested the operation, for example: user@example.com.
 * @property {object[]} warnings [Output Only] If warning messages are generated during processing of the operation, this field will be populated.
 * @property {string} zone [Output Only] The URL of the zone where the operation resides. Only available when performing per-zone operations.
 */
/**
 * @typedef OperationsListResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {deploymentmanager(v2).Operation[]} operations [Output Only] Operations contained in this list response.
 */
/**
 * @typedef Policy
 * @memberOf! deploymentmanager(v2)
 * @type object
* @property {deploymentmanager(v2).AuditConfig[]} auditConfigs Specifies audit logging configs for &quot;data access&quot;. &quot;data access&quot;: generally refers to data reads/writes and admin reads. &quot;admin activity&quot;: generally refers to admin writes.

Note: `AuditConfig` doesn&#39;t apply to &quot;admin activity&quot;, which always enables audit logging.
* @property {deploymentmanager(v2).Binding[]} bindings Associates a list of `members` to a `role`. Multiple `bindings` must not be specified for the same `role`. `bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing policy is overwritten blindly.
* @property {boolean} iamOwned 
* @property {deploymentmanager(v2).Rule[]} rules If more than one rule is specified, the rules are applied in the following manner: - All matching LOG rules are always applied. - If any DENY/DENY_WITH_LOG rule matches, permission is denied. Logging will be applied if one or more matching rule requires logging. - Otherwise, if any ALLOW/ALLOW_WITH_LOG rule matches, permission is granted. Logging will be applied if one or more matching rule requires logging. - Otherwise, if no rule applies, permission is denied.
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef Resource
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).ResourceAccessControl} accessControl The Access Control Policy set on this resource.
 * @property {string} finalProperties [Output Only] The evaluated properties of the resource with references expanded. Returned as serialized YAML.
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} insertTime [Output Only] Timestamp when the resource was created or acquired, in RFC3339 text format .
 * @property {string} manifest [Output Only] URL of the manifest representing the current configuration of this resource.
 * @property {string} name [Output Only] The name of the resource as it appears in the YAML config.
 * @property {string} properties [Output Only] The current properties of the resource before any references have been filled in. Returned as serialized YAML.
 * @property {string} type [Output Only] The type of the resource, for example compute.v1.instance, or cloudfunctions.v1beta1.function.
 * @property {deploymentmanager(v2).ResourceUpdate} update [Output Only] If Deployment Manager is currently updating or previewing an update to this resource, the updated configuration appears here.
 * @property {string} updateTime [Output Only] Timestamp when the resource was updated, in RFC3339 text format .
 * @property {string} url [Output Only] The URL of the actual resource.
 * @property {object[]} warnings [Output Only] If warning messages are generated during processing of this resource, this field will be populated.
 */
/**
 * @typedef ResourceAccessControl
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} gcpIamPolicy The GCP IAM Policy to set on the resource.
 */
/**
 * @typedef ResourceUpdate
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).ResourceAccessControl} accessControl The Access Control Policy to set on this resource after updating the resource itself.
 * @property {object} error [Output Only] If errors are generated during update of the resource, this field will be populated.
 * @property {string} finalProperties [Output Only] The expanded properties of the resource with reference values expanded. Returned as serialized YAML.
 * @property {string} intent [Output Only] The intent of the resource: PREVIEW, UPDATE, or CANCEL.
 * @property {string} manifest [Output Only] URL of the manifest representing the update configuration of this resource.
 * @property {string} properties [Output Only] The set of updated properties for this resource, before references are expanded. Returned as serialized YAML.
 * @property {string} state [Output Only] The state of the resource.
 * @property {object[]} warnings [Output Only] If warning messages are generated during processing of this resource, this field will be populated.
 */
/**
 * @typedef ResourcesListResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} nextPageToken A token used to continue a truncated list request.
 * @property {deploymentmanager(v2).Resource[]} resources Resources contained in this list response.
 */
/**
 * @typedef Rule
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} action Required
 * @property {deploymentmanager(v2).Condition[]} conditions Additional restrictions that must be met
 * @property {string} description Human-readable description of the rule.
 * @property {string[]} ins If one or more &#39;in&#39; clauses are specified, the rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is in at least one of these entries.
 * @property {deploymentmanager(v2).LogConfig[]} logConfigs The config returned to callers of tech.iam.IAM.CheckPolicy for any entries that match the LOG action.
 * @property {string[]} notIns If one or more &#39;not_in&#39; clauses are specified, the rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is in none of the entries.
 * @property {string[]} permissions A permission is a string of form &#39;..&#39; (e.g., &#39;storage.buckets.list&#39;). A value of &#39;*&#39; matches all permissions, and a verb part of &#39;*&#39; (e.g., &#39;storage.buckets.*&#39;) matches all verbs.
 */
/**
 * @typedef TargetConfiguration
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {deploymentmanager(v2).ConfigFile} config The configuration to use for this deployment.
 * @property {deploymentmanager(v2).ImportFile[]} imports Specifies any files to import for this configuration. This can be used to import templates or other files. For example, you might import a text file in order to use the file in a template.
 */
/**
 * @typedef TestPermissionsRequest
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string[]} permissions The set of permissions to check for the &#39;resource&#39;. Permissions with wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed.
 */
/**
 * @typedef TestPermissionsResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
 */
/**
 * @typedef Type
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} insertTime [Output Only] Timestamp when the type was created, in RFC3339 text format.
 * @property {string} name Name of the type.
 * @property {deploymentmanager(v2).Operation} operation [Output Only] The Operation that most recently ran, or is currently running, on this type.
 * @property {string} selfLink [Output Only] Self link for the type.
 */
/**
 * @typedef TypesListResponse
 * @memberOf! deploymentmanager(v2)
 * @type object
 * @property {string} nextPageToken A token used to continue a truncated list request.
 * @property {deploymentmanager(v2).Type[]} types [Output Only] A list of resource types supported by Deployment Manager.
 */
module.exports = Deploymentmanager;
