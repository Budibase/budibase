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
 * Google Cloud RuntimeConfig API
 *
 * Provides capabilities for dynamic configuration and coordination for applications running on Google Cloud Platform.

 *
 * @example
 * var google = require('googleapis');
 * var runtimeconfig = google.runtimeconfig('v1beta1');
 *
 * @namespace runtimeconfig
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Runtimeconfig
 */
function Runtimeconfig(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    configs: {

      /**
       * runtimeconfig.projects.configs.getIamPolicy
       *
       * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
       *
       * @alias runtimeconfig.projects.configs.getIamPolicy
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:getIamPolicy',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * runtimeconfig.projects.configs.list
       *
       * @desc Lists all the RuntimeConfig resources within project.
       *
       * @alias runtimeconfig.projects.configs.list
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Specifies the number of results to return per page. If there are fewer elements than the specified number, returns all elements.
       * @param {string} params.parent The [project ID](https://support.google.com/cloud/answer/6158840?hl=en&ref_topic=6158848) for this request, in the format `projects/[PROJECT_ID]`.
       * @param {string=} params.pageToken Specifies a page token to use. Set `pageToken` to a `nextPageToken` returned by a previous list request to get the next page of results.
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/configs',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * runtimeconfig.projects.configs.get
       *
       * @desc Gets information about a RuntimeConfig resource.
       *
       * @alias runtimeconfig.projects.configs.get
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the RuntimeConfig resource to retrieve, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
       * runtimeconfig.projects.configs.create
       *
       * @desc Creates a new RuntimeConfig resource. The configuration name must be unique within project.
       *
       * @alias runtimeconfig.projects.configs.create
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.requestId An optional but recommended unique <code>request_id</code>. If the server receives two <code>create()</code> requests  with the same <code>request_id</code>, then the second request will be ignored and the first resource created and stored in the backend is returned. Empty <code>request_id</code> fields are ignored.  It is responsibility of the client to ensure uniqueness of the <code>request_id</code> strings.  <code>request_id</code> strings are limited to 64 characters.
       * @param {string} params.parent The [project ID](https://support.google.com/cloud/answer/6158840?hl=en&ref_topic=6158848) for this request, in the format `projects/[PROJECT_ID]`.
       * @param {runtimeconfig(v1beta1).RuntimeConfig} params.resource Request body data
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/configs',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['parent'],
          pathParams: ['parent'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * runtimeconfig.projects.configs.update
       *
       * @desc Updates a RuntimeConfig resource. The configuration must exist beforehand.
       *
       * @alias runtimeconfig.projects.configs.update
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the RuntimeConfig resource to update, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
       * @param {runtimeconfig(v1beta1).RuntimeConfig} params.resource Request body data
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
       * runtimeconfig.projects.configs.setIamPolicy
       *
       * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
       *
       * @alias runtimeconfig.projects.configs.setIamPolicy
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {runtimeconfig(v1beta1).SetIamPolicyRequest} params.resource Request body data
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:setIamPolicy',
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
       * runtimeconfig.projects.configs.delete
       *
       * @desc Deletes a RuntimeConfig resource.
       *
       * @alias runtimeconfig.projects.configs.delete
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The RuntimeConfig resource to delete, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
       * runtimeconfig.projects.configs.testIamPermissions
       *
       * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
       *
       * @alias runtimeconfig.projects.configs.testIamPermissions
       * @memberOf! runtimeconfig(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {runtimeconfig(v1beta1).TestIamPermissionsRequest} params.resource Request body data
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
            url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:testIamPermissions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      variables: {

        /**
         * runtimeconfig.projects.configs.variables.watch
         *
         * @desc Watches a specific variable and waits for a change in the variable's value. When there is a change, this method returns the new value or times out.  If a variable is deleted while being watched, the `variableState` state is set to `DELETED` and the method returns the last known variable `value`.  If you set the deadline for watching to a larger value than internal timeout (60 seconds), the current variable value is returned and the `variableState` will be `VARIABLE_STATE_UNSPECIFIED`.  To learn more about creating a watcher, read the [Watching a Variable for Changes](/deployment-manager/runtime-configurator/watching-a-variable) documentation.
         *
         * @alias runtimeconfig.projects.configs.variables.watch
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the variable to watch, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
         * @param {runtimeconfig(v1beta1).WatchVariableRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        watch: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}:watch',
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
         * runtimeconfig.projects.configs.variables.list
         *
         * @desc Lists variables within given a configuration, matching any provided filters. This only lists variable names, not the values.
         *
         * @alias runtimeconfig.projects.configs.variables.list
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize Specifies the number of results to return per page. If there are fewer elements than the specified number, returns all elements.
         * @param {string=} params.filter Filters variables by matching the specified filter. For example:  `projects/example-project/config/[CONFIG_NAME]/variables/example-variable`.
         * @param {string} params.parent The path to the RuntimeConfig resource for which you want to list variables. The configuration must exist beforehand; the path must by in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
         * @param {string=} params.pageToken Specifies a page token to use. Set `pageToken` to a `nextPageToken` returned by a previous list request to get the next page of results.
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/variables',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * runtimeconfig.projects.configs.variables.get
         *
         * @desc Gets information about a single variable.
         *
         * @alias runtimeconfig.projects.configs.variables.get
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the variable to return, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]/variables/[VARIBLE_NAME]`
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
         * runtimeconfig.projects.configs.variables.create
         *
         * @desc Creates a variable within the given configuration. You cannot create a variable with a name that is a prefix of an existing variable name, or a name that has an existing variable name as a prefix.  To learn more about creating a variable, read the [Setting and Getting Data](/deployment-manager/runtime-configurator/set-and-get-variables) documentation.
         *
         * @alias runtimeconfig.projects.configs.variables.create
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.requestId An optional but recommended unique <code>request_id</code>. If the server receives two <code>create()</code> requests  with the same <code>request_id</code>, then the second request will be ignored and the first resource created and stored in the backend is returned. Empty <code>request_id</code> fields are ignored.  It is responsibility of the client to ensure uniqueness of the <code>request_id</code> strings.  <code>request_id</code> strings are limited to 64 characters.
         * @param {string} params.parent The path to the RutimeConfig resource that this variable should belong to. The configuration must exist beforehand; the path must by in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
         * @param {runtimeconfig(v1beta1).Variable} params.resource Request body data
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/variables',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * runtimeconfig.projects.configs.variables.update
         *
         * @desc Updates an existing variable with a new value.
         *
         * @alias runtimeconfig.projects.configs.variables.update
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the variable to update, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]/variables/[VARIABLE_NAME]`
         * @param {runtimeconfig(v1beta1).Variable} params.resource Request body data
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
         * runtimeconfig.projects.configs.variables.delete
         *
         * @desc Deletes a variable or multiple variables.  If you specify a variable name, then that variable is deleted. If you specify a prefix and `recursive` is true, then all variables with that prefix are deleted. You must set a `recursive` to true if you delete variables by prefix.
         *
         * @alias runtimeconfig.projects.configs.variables.delete
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {boolean=} params.recursive Set to `true` to recursively delete multiple variables with the same prefix.
         * @param {string} params.name The name of the variable to delete, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]/variables/[VARIABLE_NAME]`
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
         * runtimeconfig.projects.configs.variables.testIamPermissions
         *
         * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         *
         * @alias runtimeconfig.projects.configs.variables.testIamPermissions
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.permissions The set of permissions to check for the `resource`. Permissions with wildcards (such as '*' or 'storage.*') are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:testIamPermissions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      waiters: {

        /**
         * runtimeconfig.projects.configs.waiters.get
         *
         * @desc Gets information about a single waiter.
         *
         * @alias runtimeconfig.projects.configs.waiters.get
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The fully-qualified name of the Waiter resource object to retrieve, in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]/waiters/[WAITER_NAME]`
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
         * runtimeconfig.projects.configs.waiters.create
         *
         * @desc Creates a Waiter resource. This operation returns a long-running Operation resource which can be polled for completion. However, a waiter with the given name will exist (and can be retrieved) prior to the operation completing. If the operation fails, the failed Waiter resource will still exist and must be deleted prior to subsequent creation attempts.
         *
         * @alias runtimeconfig.projects.configs.waiters.create
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.requestId An optional but recommended unique <code>request_id</code>. If the server receives two <code>create()</code> requests  with the same <code>request_id</code>, then the second request will be ignored and the first resource created and stored in the backend is returned. Empty <code>request_id</code> fields are ignored.  It is responsibility of the client to ensure uniqueness of the <code>request_id</code> strings.  <code>request_id</code> strings are limited to 64 characters.
         * @param {string} params.parent The path to the configuration that will own the waiter. The configuration must exist beforehand; the path must by in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`.
         * @param {runtimeconfig(v1beta1).Waiter} params.resource Request body data
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/waiters',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * runtimeconfig.projects.configs.waiters.testIamPermissions
         *
         * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         *
         * @alias runtimeconfig.projects.configs.waiters.testIamPermissions
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.permissions The set of permissions to check for the `resource`. Permissions with wildcards (such as '*' or 'storage.*') are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:testIamPermissions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * runtimeconfig.projects.configs.waiters.list
         *
         * @desc List waiters within the given configuration.
         *
         * @alias runtimeconfig.projects.configs.waiters.list
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize Specifies the number of results to return per page. If there are fewer elements than the specified number, returns all elements.
         * @param {string} params.parent The path to the configuration for which you want to get a list of waiters. The configuration must exist beforehand; the path must by in the format:  `projects/[PROJECT_ID]/configs/[CONFIG_NAME]`
         * @param {string=} params.pageToken Specifies a page token to use. Set `pageToken` to a `nextPageToken` returned by a previous list request to get the next page of results.
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{parent}/waiters',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * runtimeconfig.projects.configs.waiters.delete
         *
         * @desc Deletes the waiter with the specified name.
         *
         * @alias runtimeconfig.projects.configs.waiters.delete
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The Waiter resource to delete, in the format:   `projects/[PROJECT_ID]/configs/[CONFIG_NAME]/waiters/[WAITER_NAME]`
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      operations: {

        /**
         * runtimeconfig.projects.configs.operations.get
         *
         * @desc Gets the latest state of a long-running operation.  Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @alias runtimeconfig.projects.configs.operations.get
         * @memberOf! runtimeconfig(v1beta1)
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{name}',
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
         * runtimeconfig.projects.configs.operations.testIamPermissions
         *
         * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         *
         * @alias runtimeconfig.projects.configs.operations.testIamPermissions
         * @memberOf! runtimeconfig(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.permissions The set of permissions to check for the `resource`. Permissions with wildcards (such as '*' or 'storage.*') are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
              url: 'https://runtimeconfig.googleapis.com/v1beta1/{resource}:testIamPermissions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };
}

/**
 * @typedef Status
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef Variable
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} value The binary value of the variable. The length of the value must be less
than 4096 bytes. Empty values are also accepted. The value must be
base64 encoded. Only one of `value` or `text` can be set.
* @property {string} text The string value of the variable. The length of the value must be less
than 4096 bytes. Empty values are also accepted. For example,
&lt;code&gt;text: &quot;my text value&quot;&lt;/code&gt;.
* @property {string} updateTime [Output Only] The time of the last variable update.
* @property {string} state [Ouput only] The current state of the variable. The variable state indicates
the outcome of the `variables().watch` call and is visible through the
`get` and `list` calls.
* @property {string} name The name of the variable resource, in the format:

    projects/[PROJECT_ID]/configs/[CONFIG_NAME]/variables/[VARIABLE_NAME]

The `[PROJECT_ID]` must be a valid project ID, `[CONFIG_NAME]` must be a
valid RuntimeConfig reource and `[VARIABLE_NAME]` follows Unix file system
file path naming.

The `[VARIABLE_NAME]` can contain ASCII letters, numbers, slashes and
dashes. Slashes are used as path element separators and are not part of the
`[VARIABLE_NAME]` itself, so `[VARIABLE_NAME]` must contain at least one
non-slash character. Multiple slashes are coalesced into single slash
character. Each path segment should follow RFC 1035 segment specification.
The length of a `[VARIABLE_NAME]` must be less than 256 bytes.

Once you create a variable, you cannot change the variable name.
*/
/**
 * @typedef ListConfigsResponse
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} nextPageToken This token allows you to get the next page of results for list requests.
If the number of results is larger than `pageSize`, use the `nextPageToken`
as a value for the query parameter `pageToken` in the next list request.
Subsequent list requests will have their own `nextPageToken` to continue
paging through the results
* @property {runtimeconfig(v1beta1).RuntimeConfig[]} configs A list of the configurations in the project. The order of returned
objects is arbitrary; that is, it is not ordered in any particular way.
*/
/**
 * @typedef Operation
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {runtimeconfig(v1beta1).Status} error The error result of the operation in case of failure or cancellation.
* @property {boolean} done If the value is `false`, it means the operation is still in progress.
If true, the operation is completed, and either `error` or `response` is
available.
* @property {object} metadata Service-specific metadata associated with the operation.  It typically
contains progress information and common metadata such as create time.
Some services might not provide such metadata.  Any method that returns a
long-running operation should document the metadata type, if any.
* @property {object} response The normal response of the operation in case of success.  If the original
method returns no data on success, such as `Delete`, the response is
`google.protobuf.Empty`.  If the original method is standard
`Get`/`Create`/`Update`, the response should be the resource.  For other
methods, the response should have the type `XxxResponse`, where `Xxx`
is the original method name.  For example, if the original method name
is `TakeSnapshot()`, the inferred response type is
`TakeSnapshotResponse`.
* @property {string} name The server-assigned name, which is only unique within the same service that
originally returns it. If you use the default HTTP mapping, the
`name` should have the format of `operations/some/unique/name`.
*/
/**
 * @typedef SetIamPolicyRequest
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {runtimeconfig(v1beta1).Policy} policy REQUIRED: The complete policy to be applied to the `resource`. The size of
the policy is limited to a few 10s of KB. An empty policy is a
valid policy but certain Cloud Platform services (such as Projects)
might reject them.
*/
/**
 * @typedef TestIamPermissionsResponse
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is
allowed.
*/
/**
 * @typedef Waiter
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} timeout [Required] Specifies the timeout of the waiter in seconds, beginning from
the instant that `waiters().create` method is called. If this time elapses
before the success or failure conditions are met, the waiter fails and sets
the `error` code to `DEADLINE_EXCEEDED`.
* @property {runtimeconfig(v1beta1).EndCondition} success [Required] The success condition. If this condition is met, `done` will be
set to `true` and the `error` value will remain unset. The failure condition
takes precedence over the success condition. If both conditions are met, a
failure will be indicated.
* @property {runtimeconfig(v1beta1).EndCondition} failure [Optional] The failure condition of this waiter. If this condition is met,
`done` will be set to `true` and the `error` code will be set to `ABORTED`.
The failure condition takes precedence over the success condition. If both
conditions are met, a failure will be indicated. This value is optional; if
no failure condition is set, the only failure scenario will be a timeout.
* @property {string} createTime [Output Only] The instant at which this Waiter resource was created. Adding
the value of `timeout` to this instant yields the timeout deadline for the
waiter.
* @property {string} name The name of the Waiter resource, in the format:

    projects/[PROJECT_ID]/configs/[CONFIG_NAME]/waiters/[WAITER_NAME]

The `[PROJECT_ID]` must be a valid Google Cloud project ID,
the `[CONFIG_NAME]` must be a valid RuntimeConfig resource, the
`[WAITER_NAME]` must match RFC 1035 segment specification, and the length
of `[WAITER_NAME]` must be less than 64 bytes.

After you create a Waiter resource, you cannot change the resource name.
* @property {runtimeconfig(v1beta1).Status} error [Output Only] If the waiter ended due to a failure or timeout, this value
will be set.
* @property {boolean} done [Output Only] If the value is `false`, it means the waiter is still waiting
for one of its conditions to be met.

If true, the waiter has finished. If the waiter finished due to a timeout
or failure, `error` will be set.
*/
/**
 * @typedef Policy
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {runtimeconfig(v1beta1).Binding[]} bindings Associates a list of `members` to a `role`.
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
 * @typedef RuntimeConfig
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} description An optional description of the RuntimeConfig object.
* @property {string} name The resource name of a runtime config. The name must have the format:

    projects/[PROJECT_ID]/configs/[CONFIG_NAME]

The `[PROJECT_ID]` must be a valid project ID, and `[CONFIG_NAME]` is an
arbitrary name that matches RFC 1035 segment specification. The length of
`[CONFIG_NAME]` must be less than 64 bytes.

You pick the RuntimeConfig resource name, but the server will validate that
the name adheres to this format. After you create the resource, you cannot
change the resource&#39;s name.
*/
/**
 * @typedef TestIamPermissionsRequest
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string[]} permissions The set of permissions to check for the `resource`. Permissions with
wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more
information see
[IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
*/
/**
 * @typedef ListWaitersResponse
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} nextPageToken This token allows you to get the next page of results for list requests.
If the number of results is larger than `pageSize`, use the `nextPageToken`
as a value for the query parameter `pageToken` in the next list request.
Subsequent list requests will have their own `nextPageToken` to continue
paging through the results
* @property {runtimeconfig(v1beta1).Waiter[]} waiters Found waiters in the project.
*/
/**
 * @typedef EndCondition
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
 * @property {runtimeconfig(v1beta1).Cardinality} cardinality The cardinality of the `EndCondition`.
 */
/**
 * @typedef Cardinality
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} path The root of the variable subtree to monitor. For example, `/foo`.
* @property {integer} number The number variables under the `path` that must exist to meet this
condition. Defaults to 1 if not specified.
*/
/**
 * @typedef Empty
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
 */
/**
 * @typedef WatchVariableRequest
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {string} newerThan If specified, checks the current timestamp of the variable and if the
current timestamp is newer than `newerThan` timestamp, the method returns
immediately.

If not specified or the variable has an older timestamp, the watcher waits
for a the value to change before returning.
*/
/**
 * @typedef Binding
 * @memberOf! runtimeconfig(v1beta1)
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
 * @typedef ListVariablesResponse
 * @memberOf! runtimeconfig(v1beta1)
 * @type object
* @property {runtimeconfig(v1beta1).Variable[]} variables A list of variables and their values. The order of returned variable
objects is arbitrary.
* @property {string} nextPageToken This token allows you to get the next page of results for list requests.
If the number of results is larger than `pageSize`, use the `nextPageToken`
as a value for the query parameter `pageToken` in the next list request.
Subsequent list requests will have their own `nextPageToken` to continue
paging through the results
*/
module.exports = Runtimeconfig;
