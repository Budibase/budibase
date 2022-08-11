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
 * Google Cloud Resource Manager API
 *
 * The Google Cloud Resource Manager API provides methods for creating, reading, and updating project metadata.
 *
 * @example
 * var google = require('googleapis');
 * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
 *
 * @namespace cloudresourcemanager
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Cloudresourcemanager
 */
function Cloudresourcemanager(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * cloudresourcemanager.projects.getAncestry
     *
     * @desc Gets a list of ancestors in the resource hierarchy for the Project identified by the specified `project_id` (for example, `my-project-123`).  The caller must have read permissions for this Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'getAncestry' method:
     *
     *     // * The Project ID (for example, `my-project-123`). Required.
     *     projectId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.getAncestry(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.getAncestry
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The Project ID (for example, `my-project-123`).  Required.
     * @param {cloudresourcemanager(v1beta1).GetAncestryRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAncestry: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{projectId}:getAncestry',
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
     * cloudresourcemanager.projects.getIamPolicy
     *
     * @desc Returns the IAM access control policy for the specified Project. Permission is denied if the policy or the resource does not exist.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'getIamPolicy' method:
     *
     *     // * REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as
     *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
     *     //   in this value is resource specific and is specified in the `getIamPolicy` documentation.
     *     resource_: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.getIamPolicy(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.getIamPolicy
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).GetIamPolicyRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{resource}:getIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.projects.undelete
     *
     * @desc Restores the Project identified by the specified `project_id` (for example, `my-project-123`). You can only use this method for a Project that has a lifecycle state of DELETE_REQUESTED. After deletion starts, the Project cannot be restored.  The caller must have modify permissions for this Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'undelete' method:
     *
     *     // * The project ID (for example, `foo-bar-123`). Required.
     *     projectId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.undelete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.undelete
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The project ID (for example, `foo-bar-123`).  Required.
     * @param {cloudresourcemanager(v1beta1).UndeleteProjectRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    undelete: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{projectId}:undelete',
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
     * cloudresourcemanager.projects.list
     *
     * @desc Lists Projects that are visible to the user and satisfy the specified filter. This method returns Projects in an unspecified order. New Projects do not necessarily appear at the end of the list.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *         cloudresourcemanager.projects.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   cloudresourcemanager.projects.list(request, recur);
     * });
     *
     * @alias cloudresourcemanager.projects.list
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize The maximum number of Projects to return in the response. The server can return fewer Projects than requested. If unspecified, server picks an appropriate default.  Optional.
     * @param {string=} params.filter An expression for filtering the results of the request.  Filter rules are case insensitive. The fields eligible for filtering are:  + `name` + `id` + <code>labels.<em>key</em></code> where *key* is the name of a label  Some examples of using labels as filters:  |Filter|Description| |------|-----------| |name:*|The project has a name.| |name:Howl|The project's name is `Howl` or `howl`.| |name:HOWL|Equivalent to above.| |NAME:howl|Equivalent to above.| |labels.color:*|The project has the label `color`.| |labels.color:red|The project's label `color` has the value `red`.| |labels.color:red&nbsp;label.size:big|The project's label `color` has the value `red` and its label `size` has the value `big`.  Optional.
     * @param {string=} params.pageToken A pagination token returned from a previous call to ListProjects that indicates from where listing should continue.  Optional.
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.projects.get
     *
     * @desc Retrieves the Project identified by the specified `project_id` (for example, `my-project-123`).  The caller must have read permissions for this Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // * The Project ID (for example, `my-project-123`). Required.
     *     projectId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.get
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The Project ID (for example, `my-project-123`).  Required.
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{projectId}',
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
     * cloudresourcemanager.projects.update
     *
     * @desc Updates the attributes of the Project identified by the specified `project_id` (for example, `my-project-123`).  The caller must have modify permissions for this Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // * The project ID (for example, `my-project-123`). Required.
     *     projectId: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.update
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The project ID (for example, `my-project-123`).  Required.
     * @param {cloudresourcemanager(v1beta1).Project} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{projectId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.projects.create
     *
     * @desc Creates a Project resource.  Initially, the Project resource is owned by its creator exclusively. The creator can later grant permission to others to read or update the Project.  Several APIs are activated automatically for the Project, including Google Cloud Storage.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *   cloudresourcemanager.projects.create(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.create
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.useLegacyStack A safety hatch to opt out of the new reliable project creation process.
     * @param {cloudresourcemanager(v1beta1).Project} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects',
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
     * cloudresourcemanager.projects.setIamPolicy
     *
     * @desc Sets the IAM access control policy for the specified Project. Replaces any existing policy.  The following constraints apply when using `setIamPolicy()`:  + Project does not support `allUsers` and `allAuthenticatedUsers` as `members` in a `Binding` of a `Policy`.  + The owner role can be granted only to `user` and `serviceAccount`.  + Service accounts can be made owners of a project directly without any restrictions. However, to be added as an owner, a user must be invited via Cloud Platform console and must accept the invitation.  + A user cannot be granted the owner role using `setIamPolicy()`. The user must be granted the owner role using the Cloud Platform Console and must explicitly accept the invitation.  + Invitations to grant the owner role cannot be sent using `setIamPolicy()`; they must be sent only using the Cloud Platform Console.  + Membership changes that leave the project without any owners that have accepted the Terms of Service (ToS) will be rejected.  + There must be at least one owner who has accepted the Terms of Service (ToS) agreement in the policy. Calling `setIamPolicy()` to to remove the last ToS-accepted owner from the policy will fail. This restriction also applies to legacy projects that no longer have owners who have accepted the ToS. Edits to IAM policies will be rejected until the lack of a ToS-accepting owner is rectified.  + Calling this method requires enabling the App Engine Admin API.  Note: Removing service accounts from policies or changing their roles can render services completely inoperable. It is important to understand how the service account is being used before removing or updating its roles.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'setIamPolicy' method:
     *
     *     // * REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as
     *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
     *     //   in this value is resource specific and is specified in the `setIamPolicy` documentation.
     *     resource_: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.setIamPolicy(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.setIamPolicy
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).SetIamPolicyRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{resource}:setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.projects.delete
     *
     * @desc Marks the Project identified by the specified `project_id` (for example, `my-project-123`) for deletion. This method will only affect the Project if the following criteria are met:  + The Project does not have a billing account associated with it. + The Project has a lifecycle state of ACTIVE.  This method changes the Project's lifecycle state from ACTIVE to DELETE_REQUESTED. The deletion starts at an unspecified time, at which point the project is no longer accessible.  Until the deletion completes, you can check the lifecycle state checked by retrieving the Project with GetProject, and the Project remains visible to ListProjects. However, you cannot update the project.  After the deletion completes, the Project is not retrievable by the  GetProject and ListProjects methods.  The caller must have modify permissions for this Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // * The Project ID (for example, `foo-bar-123`). Required.
     *     projectId: "",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.delete(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.delete
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The Project ID (for example, `foo-bar-123`).  Required.
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{projectId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.projects.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified Project.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'testIamPermissions' method:
     *
     *     // * REQUIRED: The resource for which the policy detail is being requested. `resource` is usually
     *     //   specified as a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the
     *     //   path specified in this value is resource specific and is specified in the `testIamPermissions`
     *     //   documentation.
     *     resource_: "",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.projects.testIamPermissions(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.projects.testIamPermissions
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).TestIamPermissionsRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/projects/{resource}:testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.organizations = {

    /**
     * cloudresourcemanager.organizations.getIamPolicy
     *
     * @desc Gets the access control policy for an Organization resource. May be empty if no such policy or resource exists. The `resource` field should be the organization's resource name, e.g. "organizations/123".
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'getIamPolicy' method:
     *
     *     // * REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as
     *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
     *     //   in this value is resource specific and is specified in the `getIamPolicy` documentation.
     *     resource_: "organizations/{MY-ORGANIZATION}",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.organizations.getIamPolicy(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.organizations.getIamPolicy
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).GetIamPolicyRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/{resource}:getIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.organizations.list
     *
     * @desc Lists Organization resources that are visible to the user and satisfy the specified filter. This method returns Organizations in an unspecified order. New Organizations do not necessarily appear at the end of the list.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *         cloudresourcemanager.organizations.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   cloudresourcemanager.organizations.list(request, recur);
     * });
     *
     * @alias cloudresourcemanager.organizations.list
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize The maximum number of Organizations to return in the response. This field is optional.
     * @param {string=} params.filter An optional query string used to filter the Organizations to return in the response. Filter rules are case-insensitive.   Organizations may be filtered by `owner.directoryCustomerId` or by `domain`, where the domain is a Google for Work domain, for example:  |Filter|Description| |------|-----------| |owner.directorycustomerid:123456789|Organizations with `owner.directory_customer_id` equal to `123456789`.| |domain:google.com|Organizations corresponding to the domain `google.com`.|  This field is optional.
     * @param {string=} params.pageToken A pagination token returned from a previous call to `ListOrganizations` that indicates from where listing should continue. This field is optional.
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/organizations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.organizations.get
     *
     * @desc Fetches an Organization resource identified by the specified resource name.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // * The resource name of the Organization to fetch. Its format is "organizations/[organization_id]".
     *     //   For example, "organizations/1234".
     *     name: "organizations/{MY-ORGANIZATION}",
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.organizations.get(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.organizations.get
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The resource name of the Organization to fetch, e.g. "organizations/1234".
     * @param {string=} params.organizationId The id of the Organization resource to fetch. This field is deprecated and will be removed in v1. Use name instead.
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/{name}',
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
     * cloudresourcemanager.organizations.update
     *
     * @desc Updates an Organization resource identified by the specified resource name.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // * Output Only. The resource name of the organization. This is the organization's relative path in
     *     //   the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".
     *     name: "organizations/{MY-ORGANIZATION}",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.organizations.update(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.organizations.update
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name Output Only. The resource name of the organization. This is the organization's relative path in the API. Its format is "organizations/[organization_id]". For example, "organizations/1234".
     * @param {cloudresourcemanager(v1beta1).Organization} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/{name}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.organizations.setIamPolicy
     *
     * @desc Sets the access control policy on an Organization resource. Replaces any existing policy. The `resource` field should be the organization's resource name, e.g. "organizations/123".
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'setIamPolicy' method:
     *
     *     // * REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as
     *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
     *     //   in this value is resource specific and is specified in the `setIamPolicy` documentation.
     *     resource_: "organizations/{MY-ORGANIZATION}",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.organizations.setIamPolicy(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.organizations.setIamPolicy
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).SetIamPolicyRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/{resource}:setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudresourcemanager.organizations.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified Organization. The `resource` field should be the organization's resource name, e.g. "organizations/123".
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Resource Manager API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/cloudresourcemanager
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var cloudresourcemanager = google.cloudresourcemanager('v1beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'testIamPermissions' method:
     *
     *     // * REQUIRED: The resource for which the policy detail is being requested. `resource` is usually
     *     //   specified as a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the
     *     //   path specified in this value is resource specific and is specified in the `testIamPermissions`
     *     //   documentation.
     *     resource_: "organizations/{MY-ORGANIZATION}",
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   cloudresourcemanager.organizations.testIamPermissions(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias cloudresourcemanager.organizations.testIamPermissions
     * @memberOf! cloudresourcemanager(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {cloudresourcemanager(v1beta1).TestIamPermissionsRequest} params.resource Request body data
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
          url: 'https://cloudresourcemanager.googleapis.com/v1beta1/{resource}:testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef FolderOperationError
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 * @property {string} errorMessageId The type of operation error experienced.
 */
/**
 * @typedef ListProjectsResponse
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).Project[]} projects The list of Projects that matched the list filter. This list can
be paginated.
* @property {string} nextPageToken Pagination token.

If the result set is too large to fit in a single response, this token
is returned. It encodes the position of the current result cursor.
Feeding this value into a new list request with the `page_token` parameter
gives the next page of the results.

When `next_page_token` is not filled in, there is no next page and
the list returned is the last page in the result set.

Pagination tokens have a limited lifetime.
*/
/**
 * @typedef UndeleteProjectRequest
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 */
/**
 * @typedef FolderOperation
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string} displayName The display name of the folder.
* @property {string} sourceParent The resource name of the folder&#39;s parent.
Only applicable when the operation_type is MOVE.
* @property {string} destinationParent The resource name of the folder or organization we are either creating
the folder under or moving the folder to.
* @property {string} operationType The type of this operation.
*/
/**
 * @typedef GetIamPolicyRequest
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 */
/**
 * @typedef SetIamPolicyRequest
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).Policy} policy REQUIRED: The complete policy to be applied to the `resource`. The size of
the policy is limited to a few 10s of KB. An empty policy is a
valid policy but certain Cloud Platform services (such as Projects)
might reject them.
*/
/**
 * @typedef TestIamPermissionsResponse
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is
allowed.
*/
/**
 * @typedef Organization
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string} lifecycleState The organization&#39;s current lifecycle state. Assigned by the server.
@OutputOnly
* @property {string} displayName A friendly string to be used to refer to the Organization in the UI.
Assigned by the server, set to the firm name of the Google For Work
customer that owns this organization.
@OutputOnly
* @property {string} organizationId An immutable id for the Organization that is assigned on creation. This
should be omitted when creating a new Organization.
This field is read-only.
This field is deprecated and will be removed in v1. Use name instead.
* @property {string} name Output Only. The resource name of the organization. This is the
organization&#39;s relative path in the API. Its format is
&quot;organizations/[organization_id]&quot;. For example, &quot;organizations/1234&quot;.
* @property {string} creationTime Timestamp when the Organization was created. Assigned by the server.
@OutputOnly
* @property {cloudresourcemanager(v1beta1).OrganizationOwner} owner The owner of this Organization. The owner should be specified on
creation. Once set, it cannot be changed.
This field is required.
*/
/**
 * @typedef Policy
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).Binding[]} bindings Associates a list of `members` to a `role`.
Multiple `bindings` must not be specified for the same `role`.
`bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help
prevent simultaneous updates of a policy from overwriting each other.
It is strongly suggested that systems make use of the `etag` in the
read-modify-write cycle to perform policy updates in order to avoid race
conditions: An `etag` is returned in the response to `getIamPolicy`, and
systems are expected to put that etag in the request to `setIamPolicy` to
ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing
policy is overwritten blindly.
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef ProjectCreationStatus
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {boolean} ready True if the project creation process is complete.
* @property {boolean} gettable True if the project can be retrieved using GetProject. No other operations
on the project are guaranteed to work until the project creation is
complete.
* @property {string} createTime Creation time of the project creation workflow.
*/
/**
 * @typedef TestIamPermissionsRequest
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string[]} permissions The set of permissions to check for the `resource`. Permissions with
wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more
information see
[IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
*/
/**
 * @typedef ListOrganizationsResponse
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).Organization[]} organizations The list of Organizations that matched the list query, possibly paginated.
* @property {string} nextPageToken A pagination token to be used to retrieve the next page of results. If the
result is too large to fit within the page size specified in the request,
this field will be set with a token that can be used to fetch the next page
of results. If this field is empty, it indicates that this response
contains the last page of results.
*/
/**
 * @typedef GetAncestryRequest
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 */
/**
 * @typedef GetAncestryResponse
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).Ancestor[]} ancestor Ancestors are ordered from bottom to top of the resource hierarchy. The
first ancestor is the project itself, followed by the project&#39;s parent,
etc.
*/
/**
 * @typedef Empty
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 */
/**
 * @typedef Ancestor
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 * @property {cloudresourcemanager(v1beta1).ResourceId} resourceId Resource id of the ancestor.
 */
/**
 * @typedef ResourceId
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string} type Required field representing the resource type this id is for.
At present, the valid types are &quot;project&quot; and &quot;organization&quot;.
* @property {string} id Required field for the type-specific id. This should correspond to the id
used in the type-specific API&#39;s.
*/
/**
 * @typedef Project
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {cloudresourcemanager(v1beta1).ResourceId} parent An optional reference to a parent Resource.

The only supported parent type is &quot;organization&quot;. Once set, the parent
cannot be modified. The `parent` can be set on creation or using the
`UpdateProject` method; the end user must have the
`resourcemanager.projects.create` permission on the parent.

Read-write.
* @property {object} labels The labels associated with this Project.

Label keys must be between 1 and 63 characters long and must conform
to the following regular expression: \[a-z\](\[-a-z0-9\]*\[a-z0-9\])?.

Label values must be between 0 and 63 characters long and must conform
to the regular expression (\[a-z\](\[-a-z0-9\]*\[a-z0-9\])?)?.

No more than 256 labels can be associated with a given resource.

Clients should store labels in a representation such as JSON that does not
depend on specific characters being disallowed.

Example: &lt;code&gt;&quot;environment&quot; : &quot;dev&quot;&lt;/code&gt;

Read-write.
* @property {string} lifecycleState The Project lifecycle state.

Read-only.
* @property {string} createTime Creation time.

Read-only.
* @property {string} name The user-assigned display name of the Project.
It must be 4 to 30 characters.
Allowed characters are: lowercase and uppercase letters, numbers,
hyphen, single-quote, double-quote, space, and exclamation point.

Example: &lt;code&gt;My Project&lt;/code&gt;

Read-write.
* @property {string} projectNumber The number uniquely identifying the project.

Example: &lt;code&gt;415104041262&lt;/code&gt;

Read-only.
* @property {string} projectId The unique, user-assigned ID of the Project.
It must be 6 to 30 lowercase letters, digits, or hyphens.
It must start with a letter.
Trailing hyphens are prohibited.

Example: &lt;code&gt;tokyo-rain-123&lt;/code&gt;

Read-only after creation.
*/
/**
 * @typedef Binding
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource.
`members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is
   on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone
   who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google
   account. For example, `alice@gmail.com` or `joe@example.com`.


* `serviceAccount:{emailid}`: An email address that represents a service
   account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group.
   For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the
   users of that domain. For example, `google.com` or `example.com`.


* @property {string} role Role that is assigned to `members`.
For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
Required
*/
/**
 * @typedef OrganizationOwner
 * @memberOf! cloudresourcemanager(v1beta1)
 * @type object
 * @property {string} directoryCustomerId The Google for Work customer id used in the Directory API.
 */
module.exports = Cloudresourcemanager;
