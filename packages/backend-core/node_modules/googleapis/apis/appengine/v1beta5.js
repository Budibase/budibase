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
 * Google App Engine Admin API
 *
 * Provisions and manages App Engine applications.
 *
 * @example
 * var google = require('googleapis');
 * var appengine = google.appengine('v1beta5');
 *
 * @namespace appengine
 * @type {Function}
 * @version v1beta5
 * @variation v1beta5
 * @param {object=} options Options for Appengine
 */
function Appengine(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.apps = {

    /**
     * appengine.apps.create
     *
     * @desc Creates an App Engine application for a Google Cloud Platform project. This requires a project that excludes an App Engine application. For details about creating a project without an application, see the Google Cloud Resource Manager create project topic (https://cloud.google.com/resource-manager/docs/creating-project).
     *
     * @alias appengine.apps.create
     * @memberOf! appengine(v1beta5)
     *
     * @param {object} params Parameters for request
     * @param {appengine(v1beta5).Application} params.resource Request body data
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
          url: 'https://appengine.googleapis.com/v1beta5/apps',
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
     * appengine.apps.get
     *
     * @desc Gets information about an application.
     *
     * @alias appengine.apps.get
     * @memberOf! appengine(v1beta5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.appsId Part of `name`. Name of the application to get. Example: apps/myapp.
     * @param {boolean=} params.ensureResourcesExist Certain resources associated with an application are created on-demand. Controls whether these resources should be created when performing the GET operation. If specified and any resources could not be created, the request will fail with an error code. Additionally, this parameter can cause the request to take longer to complete. Note: This parameter will be deprecated in a future version of the API.
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
          url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['appsId'],
        pathParams: ['appsId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * appengine.apps.patch
     *
     * @desc Updates the specified Application resource. You can update the following fields: auth_domain (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps#Application.FIELDS.auth_domain) default_cookie_expiration (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps#Application.FIELDS.default_cookie_expiration)
     *
     * @alias appengine.apps.patch
     * @memberOf! appengine(v1beta5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.appsId Part of `name`. Name of the Application resource to update. Example: apps/myapp.
     * @param {string=} params.mask Standard field mask for the set of fields to be updated.
     * @param {appengine(v1beta5).Application} params.resource Request body data
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
          url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['appsId'],
        pathParams: ['appsId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    operations: {

      /**
       * appengine.apps.operations.list
       *
       * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns UNIMPLEMENTED.NOTE: the name binding below allows API services to override the binding to use different resource name schemes, such as users/x/operations.
       *
       * @alias appengine.apps.operations.list
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. The name of the operation collection.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/operations',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId'],
          pathParams: ['appsId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * appengine.apps.operations.get
       *
       * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
       *
       * @alias appengine.apps.operations.get
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. The name of the operation resource.
       * @param {string} params.operationsId Part of `name`. See documentation of `appsId`.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/operations/{operationsId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId', 'operationsId'],
          pathParams: ['appsId', 'operationsId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    services: {

      /**
       * appengine.apps.services.delete
       *
       * @desc Deletes the specified service and all enclosed versions.
       *
       * @alias appengine.apps.services.delete
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default.
       * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['appsId', 'servicesId'],
          pathParams: ['appsId', 'servicesId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * appengine.apps.services.get
       *
       * @desc Gets the current configuration of the specified service.
       *
       * @alias appengine.apps.services.get
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default.
       * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId', 'servicesId'],
          pathParams: ['appsId', 'servicesId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * appengine.apps.services.list
       *
       * @desc Lists all the services in the application.
       *
       * @alias appengine.apps.services.list
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp.
       * @param {integer=} params.pageSize Maximum results to return per page.
       * @param {string=} params.pageToken Continuation token for fetching the next page of results.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId'],
          pathParams: ['appsId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * appengine.apps.services.patch
       *
       * @desc Updates the configuration of the specified service.
       *
       * @alias appengine.apps.services.patch
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. Name of the resource to update. Example: apps/myapp/services/default.
       * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
       * @param {string=} params.mask Standard field mask for the set of fields to be updated.
       * @param {boolean=} params.migrateTraffic Set to true to gradually shift traffic from one version to another single version. By default, traffic is shifted immediately. For gradual traffic migration, the target version must be located within instances that are configured for both warmup requests (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#inboundservicetype) and automatic scaling (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#automaticscaling). You must specify the shardBy (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services#shardby) field in the Service resource. Gradual traffic migration is not supported in the App Engine flexible environment. For examples, see Migrating and Splitting Traffic (https://cloud.google.com/appengine/docs/admin-api/migrating-splitting-traffic).
       * @param {appengine(v1beta5).Service} params.resource Request body data
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['appsId', 'servicesId'],
          pathParams: ['appsId', 'servicesId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      versions: {

        /**
         * appengine.apps.services.versions.create
         *
         * @desc Deploys new code and resource files to a new version.
         *
         * @alias appengine.apps.services.versions.create
         * @memberOf! appengine(v1beta5)
         *
         * @param {object} params Parameters for request
         * @param {string} params.appsId Part of `name`. Name of the resource to update. For example: "apps/myapp/services/default".
         * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
         * @param {appengine(v1beta5).Version} params.resource Request body data
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
              url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['appsId', 'servicesId'],
            pathParams: ['appsId', 'servicesId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * appengine.apps.services.versions.delete
         *
         * @desc Deletes an existing version.
         *
         * @alias appengine.apps.services.versions.delete
         * @memberOf! appengine(v1beta5)
         *
         * @param {object} params Parameters for request
         * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default/versions/v1.
         * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
         * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
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
              url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['appsId', 'servicesId', 'versionsId'],
            pathParams: ['appsId', 'servicesId', 'versionsId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * appengine.apps.services.versions.get
         *
         * @desc Gets the specified Version resource. By default, only a BASIC_VIEW will be returned. Specify the FULL_VIEW parameter to get the full resource.
         *
         * @alias appengine.apps.services.versions.get
         * @memberOf! appengine(v1beta5)
         *
         * @param {object} params Parameters for request
         * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default/versions/v1.
         * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
         * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
         * @param {string=} params.view Controls the set of fields returned in the Get response.
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
              url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['appsId', 'servicesId', 'versionsId'],
            pathParams: ['appsId', 'servicesId', 'versionsId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * appengine.apps.services.versions.list
         *
         * @desc Lists the versions of a service.
         *
         * @alias appengine.apps.services.versions.list
         * @memberOf! appengine(v1beta5)
         *
         * @param {object} params Parameters for request
         * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default.
         * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
         * @param {string=} params.view Controls the set of fields returned in the List response.
         * @param {integer=} params.pageSize Maximum results to return per page.
         * @param {string=} params.pageToken Continuation token for fetching the next page of results.
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
              url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['appsId', 'servicesId'],
            pathParams: ['appsId', 'servicesId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * appengine.apps.services.versions.patch
         *
         * @desc Updates the specified Version resource. You can specify the following fields depending on the App Engine environment and type of scaling that the version resource uses: serving_status (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#Version.FIELDS.serving_status): For Version resources that use basic scaling, manual scaling, or run in the App Engine flexible environment. instance_class (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#Version.FIELDS.instance_class): For Version resources that run in the App Engine standard environment. automatic_scaling.min_idle_instances (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#Version.FIELDS.automatic_scaling): For Version resources that use automatic scaling and run in the App Engine standard environment. automatic_scaling.max_idle_instances (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1beta5/apps.services.versions#Version.FIELDS.automatic_scaling): For Version resources that use automatic scaling and run in the App Engine standard environment.
         *
         * @alias appengine.apps.services.versions.patch
         * @memberOf! appengine(v1beta5)
         *
         * @param {object} params Parameters for request
         * @param {string} params.appsId Part of `name`. Name of the resource to update. Example: apps/myapp/services/default/versions/1.
         * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
         * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
         * @param {string=} params.mask Standard field mask for the set of fields to be updated.
         * @param {appengine(v1beta5).Version} params.resource Request body data
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
              url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}',
              method: 'PATCH'
            }, options),
            params: params,
            requiredParams: ['appsId', 'servicesId', 'versionsId'],
            pathParams: ['appsId', 'servicesId', 'versionsId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        instances: {

          /**
           * appengine.apps.services.versions.instances.delete
           *
           * @desc Stops a running instance.
           *
           * @alias appengine.apps.services.versions.instances.delete
           * @memberOf! appengine(v1beta5)
           *
           * @param {object} params Parameters for request
           * @param {string} params.appsId Part of `name`. Name of the resource requested. For example: "apps/myapp/services/default/versions/v1/instances/instance-1".
           * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
           * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
           * @param {string} params.instancesId Part of `name`. See documentation of `appsId`.
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
                url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}/instances/{instancesId}',
                method: 'DELETE'
              }, options),
              params: params,
              requiredParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              pathParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * appengine.apps.services.versions.instances.get
           *
           * @desc Gets instance information.
           *
           * @alias appengine.apps.services.versions.instances.get
           * @memberOf! appengine(v1beta5)
           *
           * @param {object} params Parameters for request
           * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default/versions/v1/instances/instance-1.
           * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
           * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
           * @param {string} params.instancesId Part of `name`. See documentation of `appsId`.
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
                url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}/instances/{instancesId}',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              pathParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * appengine.apps.services.versions.instances.list
           *
           * @desc Lists the instances of a version.
           *
           * @alias appengine.apps.services.versions.instances.list
           * @memberOf! appengine(v1beta5)
           *
           * @param {object} params Parameters for request
           * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default/versions/v1.
           * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
           * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
           * @param {integer=} params.pageSize Maximum results to return per page.
           * @param {string=} params.pageToken Continuation token for fetching the next page of results.
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
                url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}/instances',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['appsId', 'servicesId', 'versionsId'],
              pathParams: ['appsId', 'servicesId', 'versionsId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * appengine.apps.services.versions.instances.debug
           *
           * @desc Enables debugging on a VM instance. This allows you to use the SSH command to connect to the virtual machine where the instance lives. While in "debug mode", the instance continues to serve live traffic. You should delete the instance when you are done debugging and then allow the system to take over and determine if another instance should be started.Only applicable for instances in App Engine flexible environment.
           *
           * @alias appengine.apps.services.versions.instances.debug
           * @memberOf! appengine(v1beta5)
           *
           * @param {object} params Parameters for request
           * @param {string} params.appsId Part of `name`. Name of the resource requested. Example: apps/myapp/services/default/versions/v1/instances/instance-1.
           * @param {string} params.servicesId Part of `name`. See documentation of `appsId`.
           * @param {string} params.versionsId Part of `name`. See documentation of `appsId`.
           * @param {string} params.instancesId Part of `name`. See documentation of `appsId`.
           * @param {appengine(v1beta5).DebugInstanceRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          debug: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/services/{servicesId}/versions/{versionsId}/instances/{instancesId}:debug',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              pathParams: ['appsId', 'servicesId', 'versionsId', 'instancesId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          }
        }
      }
    },

    locations: {

      /**
       * appengine.apps.locations.list
       *
       * @desc Lists information about the supported locations for this service.
       *
       * @alias appengine.apps.locations.list
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. The resource that owns the locations collection, if applicable.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/locations',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId'],
          pathParams: ['appsId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * appengine.apps.locations.get
       *
       * @desc Get information about a location.
       *
       * @alias appengine.apps.locations.get
       * @memberOf! appengine(v1beta5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.appsId Part of `name`. Resource name for the location.
       * @param {string} params.locationsId Part of `name`. See documentation of `appsId`.
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
            url: 'https://appengine.googleapis.com/v1beta5/apps/{appsId}/locations/{locationsId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['appsId', 'locationsId'],
          pathParams: ['appsId', 'locationsId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef ListOperationsResponse
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {appengine(v1beta5).Operation[]} operations A list of operations that matches the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef Operation
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the name should have the format of operations/some/unique/name.
 * @property {object} metadata Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.
 * @property {boolean} done If the value is false, it means the operation is still in progress. If true, the operation is completed, and either error or response is available.
 * @property {appengine(v1beta5).Status} error The error result of the operation in case of failure or cancellation.
 * @property {object} response The normal response of the operation in case of success. If the original method returns no data on success, such as Delete, the response is google.protobuf.Empty. If the original method is standard Get/Create/Update, the response should be the resource. For other methods, the response should have the type XxxResponse, where Xxx is the original method name. For example, if the original method name is TakeSnapshot(), the inferred response type is TakeSnapshotResponse.
 */
/**
 * @typedef Status
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef Application
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Full path to the Application resource in the API. Example: apps/myapp.@OutputOnly
 * @property {string} id Identifier of the Application resource. This identifier is equivalent to the project ID of the Google Cloud Platform project where you want to deploy your application. Example: myapp.
 * @property {appengine(v1beta5).UrlDispatchRule[]} dispatchRules HTTP path dispatch rules for requests to the application that do not explicitly target a service or version. Rules are order-dependent.@OutputOnly
 * @property {string} authDomain Google Apps authentication domain that controls which users can access this application.Defaults to open access for any Google Account.
 * @property {string} location Location from which this application will be run. Application instances will run out of data centers in the chosen location, which is also where all of the application&#39;s end user content is stored.Defaults to us-central.Options are:us-central - Central USeurope-west - Western Europeus-east1 - Eastern US
 * @property {string} codeBucket A Google Cloud Storage bucket that can be used for storing files associated with this application. This bucket is associated with the application and can be used by the gcloud deployment commands.@OutputOnly
 * @property {string} defaultCookieExpiration Cookie expiration policy for this application.
 * @property {string} defaultHostname Hostname used to reach the application, as resolved by App Engine.@OutputOnly
 * @property {string} defaultBucket A Google Cloud Storage bucket that can be used by the application to store content.@OutputOnly
 */
/**
 * @typedef UrlDispatchRule
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} domain Domain name to match against. The wildcard &quot;*&quot; is supported if specified before a period: &quot;*.&quot;.Defaults to matching all domains: &quot;*&quot;.
 * @property {string} path Pathname within the host. Must start with a &quot;/&quot;. A single &quot;*&quot; can be included at the end of the path. The sum of the lengths of the domain and path may not exceed 100 characters.
 * @property {string} service Resource id of a service in this application that should serve the matched request. The service must already exist. Example: default.
 */
/**
 * @typedef Version
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Full path to the Version resource in the API. Example: apps/myapp/services/default/versions/v1.@OutputOnly
 * @property {string} id Relative name of the version within the module. Example: v1. Version names can contain only lowercase letters, numbers, or hyphens. Reserved names: &quot;default&quot;, &quot;latest&quot;, and any name with the prefix &quot;ah-&quot;.
 * @property {appengine(v1beta5).AutomaticScaling} automaticScaling Automatic scaling is based on request rate, response latencies, and other application metrics.
 * @property {appengine(v1beta5).BasicScaling} basicScaling A service with basic scaling will create an instance when the application receives a request. The instance will be turned down when the app becomes idle. Basic scaling is ideal for work that is intermittent or driven by user activity.
 * @property {appengine(v1beta5).ManualScaling} manualScaling A service with manual scaling runs continuously, allowing you to perform complex initialization and rely on the state of its memory over time.
 * @property {string[]} inboundServices Before an application can receive email or XMPP messages, the application must be configured to enable the service.
 * @property {string} instanceClass Instance class that is used to run this version. Valid values are: AutomaticScaling: F1, F2, F4, F4_1G ManualScaling or BasicScaling: B1, B2, B4, B8, B4_1GDefaults to F1 for AutomaticScaling and B1 for ManualScaling or BasicScaling.
 * @property {appengine(v1beta5).Network} network Extra network settings. Only applicable for VM runtimes.
 * @property {appengine(v1beta5).Resources} resources Machine resources for this version. Only applicable for VM runtimes.
 * @property {string} runtime Desired runtime. Example: python27.
 * @property {boolean} threadsafe Whether multiple requests can be dispatched to this version at once.
 * @property {boolean} vm Whether to deploy this version in a container on a virtual machine.
 * @property {object} betaSettings Metadata settings that are supplied to this version to enable beta runtime features.
 * @property {string} env App Engine execution environment to use for this version.Defaults to 1.
 * @property {string} servingStatus Current serving status of this version. Only the versions with a SERVING status create instances and can be billed.SERVING_STATUS_UNSPECIFIED is an invalid value. Defaults to SERVING.
 * @property {string} deployer Email address of the user who created this version.@OutputOnly
 * @property {string} creationTime Time that this version was created.@OutputOnly
 * @property {string} diskUsageBytes Total size of version files hosted on App Engine disk in bytes.@OutputOnly
 * @property {appengine(v1beta5).UrlMap[]} handlers An ordered list of URL-matching patterns that should be applied to incoming requests. The first matching URL handles the request and other request handlers are not attempted.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).ErrorHandler[]} errorHandlers Custom static error pages. Limited to 10KB per page.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).Library[]} libraries Configuration for third-party Python runtime libraries required by the application.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).ApiConfigHandler} apiConfig Serving configuration for Google Cloud Endpoints (https://cloud.google.com/appengine/docs/python/endpoints/).Only returned in GET requests if view=FULL is set.
 * @property {object} envVariables Environment variables made available to the application.Only returned in GET requests if view=FULL is set.
 * @property {string} defaultExpiration Duration that static files should be cached by web proxies and browsers. Only applicable if the corresponding StaticFilesHandler (https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions#staticfileshandler) does not specify its own expiration time.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).HealthCheck} healthCheck Configures health checking for VM instances. Unhealthy instances are be stopped and replaced with new instances. Only applicable for VM runtimes.Only returned in GET requests if view=FULL is set.
 * @property {string} nobuildFilesRegex Files that match this pattern will not be built into this version. Only applicable for Go runtimes.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).Deployment} deployment Code and application artifacts that make up this version.Only returned in GET requests if view=FULL is set.
 * @property {appengine(v1beta5).EndpointsApiService} endpointsApiService Cloud Endpoints configuration.If endpoints_api_service is set, the Cloud Endpoints Extensible Service Proxy will be provided to serve the API implemented by the app.
 */
/**
 * @typedef AutomaticScaling
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} coolDownPeriod Amount of time that the Autoscaler (https://cloud.google.com/compute/docs/autoscaler/) should wait between changes to the number of virtual machines. Only applicable for VM runtimes.
 * @property {appengine(v1beta5).CpuUtilization} cpuUtilization Target scaling by CPU usage.
 * @property {integer} maxConcurrentRequests Number of concurrent requests an automatic scaling instance can accept before the scheduler spawns a new instance.Defaults to a runtime-specific value.
 * @property {integer} maxIdleInstances Maximum number of idle instances that should be maintained for this version.
 * @property {integer} maxTotalInstances Maximum number of instances that should be started to handle requests.
 * @property {string} maxPendingLatency Maximum amount of time that a request should wait in the pending queue before starting a new instance to handle it.
 * @property {integer} minIdleInstances Minimum number of idle instances that should be maintained for this version. Only applicable for the default version of a module.
 * @property {integer} minTotalInstances Minimum number of instances that should be maintained for this version.
 * @property {string} minPendingLatency Minimum amount of time a request should wait in the pending queue before starting a new instance to handle it.
 * @property {appengine(v1beta5).RequestUtilization} requestUtilization Target scaling by request utilization.
 * @property {appengine(v1beta5).DiskUtilization} diskUtilization Target scaling by disk usage.
 * @property {appengine(v1beta5).NetworkUtilization} networkUtilization Target scaling by network usage.
 */
/**
 * @typedef CpuUtilization
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} aggregationWindowLength Period of time over which CPU utilization is calculated.
 * @property {number} targetUtilization Target CPU utilization ratio to maintain when scaling. Must be between 0 and 1.
 */
/**
 * @typedef RequestUtilization
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {integer} targetRequestCountPerSec Target requests per second.
 * @property {integer} targetConcurrentRequests Target number of concurrent requests.
 */
/**
 * @typedef DiskUtilization
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {integer} targetWriteBytesPerSec Target bytes written per second.
 * @property {integer} targetWriteOpsPerSec Target ops written per second.
 * @property {integer} targetReadBytesPerSec Target bytes read per second.
 * @property {integer} targetReadOpsPerSec Target ops read per second.
 */
/**
 * @typedef NetworkUtilization
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {integer} targetSentBytesPerSec Target bytes sent per second.
 * @property {integer} targetSentPacketsPerSec Target packets sent per second.
 * @property {integer} targetReceivedBytesPerSec Target bytes received per second.
 * @property {integer} targetReceivedPacketsPerSec Target packets received per second.
 */
/**
 * @typedef BasicScaling
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} idleTimeout Duration of time after the last request that an instance must wait before the instance is shut down.
 * @property {integer} maxInstances Maximum number of instances to create for this version.
 */
/**
 * @typedef ManualScaling
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {integer} instances Number of instances to assign to the service at the start. This number can later be altered by using the Modules API (https://cloud.google.com/appengine/docs/python/modules/functions) set_num_instances() function.
 */
/**
 * @typedef Network
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string[]} forwardedPorts List of ports, or port pairs, to forward from the virtual machine to the application container.
 * @property {string} instanceTag Tag to apply to the VM instance during creation.
 * @property {string} name Google Cloud Platform network where the virtual machines are created. Specify the short name, not the resource path.Defaults to default.
 * @property {string} subnetworkName Google Cloud Platform sub-network where the virtual machines are created. Specify the short name, not the resource path.If a subnetwork name is specified, a network name will also be required unless it is for the default network. If the network the VM instance is being created in is a Legacy network, then the IP address is allocated from the IPv4Range. If the network the VM instance is being created in is an auto Subnet Mode Network, then only network name should be specified (not the subnetwork_name) and the IP address is created from the IPCidrRange of the subnetwork that exists in that zone for that network. If the network the VM instance is being created in is a custom Subnet Mode Network, then the subnetwork_name must be specified and the IP address is created from the IPCidrRange of the subnetwork.If specified, the subnetwork must exist in the same region as the Flex app.
 */
/**
 * @typedef Resources
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {number} cpu Number of CPU cores needed.
 * @property {number} diskGb Disk size (GB) needed.
 * @property {number} memoryGb Memory (GB) needed.
 * @property {appengine(v1beta5).Volume[]} volumes Volumes mounted within the app container.
 */
/**
 * @typedef Volume
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Unique name for the volume.
 * @property {string} volumeType Underlying volume type, e.g. &#39;tmpfs&#39;.
 * @property {number} sizeGb Volume size in gigabytes.
 */
/**
 * @typedef UrlMap
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} urlRegex A URL prefix. Uses regular expression syntax, which means regexp special characters must be escaped, but should not contain groupings. All URLs that begin with this prefix are handled by this handler, using the portion of the URL after the prefix as part of the file path.
 * @property {appengine(v1beta5).StaticFilesHandler} staticFiles Returns the contents of a file, such as an image, as the response.
 * @property {appengine(v1beta5).ScriptHandler} script Executes a script to handle the request that matches this URL pattern.
 * @property {appengine(v1beta5).ApiEndpointHandler} apiEndpoint Uses API Endpoints to handle requests.
 * @property {string} securityLevel Security (HTTPS) enforcement for this URL.
 * @property {string} login Level of login required to access this resource.
 * @property {string} authFailAction Action to take when users access resources that require authentication. Defaults to redirect.
 * @property {string} redirectHttpResponseCode 30x code to use when performing redirects for the secure field. Defaults to 302.
 */
/**
 * @typedef StaticFilesHandler
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} path Path to the static files matched by the URL pattern, from the application root directory. The path can refer to text matched in groupings in the URL pattern.
 * @property {string} uploadPathRegex Regular expression that matches the file paths for all files that should be referenced by this handler.
 * @property {object} httpHeaders HTTP headers to use for all responses from these URLs.
 * @property {string} mimeType MIME type used to serve all files served by this handler. Defaults to file-specific MIME types, which are derived from each file&#39;s filename extension.
 * @property {string} expiration Time a static file served by this handler should be cached.
 * @property {boolean} requireMatchingFile Whether this handler should match the request if the file referenced by the handler does not exist.
 * @property {boolean} applicationReadable Whether files should also be uploaded as code data. By default, files declared in static file handlers are uploaded as static data and are only served to end users; they cannot be read by the application. If enabled, uploads are charged against both your code and static data storage resource quotas.
 */
/**
 * @typedef ScriptHandler
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} scriptPath Path to the script from the application root directory.
 */
/**
 * @typedef ApiEndpointHandler
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} scriptPath Path to the script from the application root directory.
 */
/**
 * @typedef ErrorHandler
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} errorCode Error condition this handler applies to.
 * @property {string} staticFile Static file content to be served for this error.
 * @property {string} mimeType MIME type of file. Defaults to text/html.
 */
/**
 * @typedef Library
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Name of the library. Example: &quot;django&quot;.
 * @property {string} version Version of the library to select, or &quot;latest&quot;.
 */
/**
 * @typedef ApiConfigHandler
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} authFailAction Action to take when users access resources that require authentication. Defaults to redirect.
 * @property {string} login Level of login required to access this resource. Defaults to optional.
 * @property {string} script Path to the script from the application root directory.
 * @property {string} securityLevel Security (HTTPS) enforcement for this URL.
 * @property {string} url URL to serve the endpoint at.
 */
/**
 * @typedef HealthCheck
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {boolean} disableHealthCheck Whether to explicitly disable health checks for this instance.
 * @property {string} host Host header to send when performing an HTTP health check. Example: &quot;myapp.appspot.com&quot;
 * @property {integer} healthyThreshold Number of consecutive successful health checks required before receiving traffic.
 * @property {integer} unhealthyThreshold Number of consecutive failed health checks required before removing traffic.
 * @property {integer} restartThreshold Number of consecutive failed health checks required before an instance is restarted.
 * @property {string} checkInterval Interval between health checks.
 * @property {string} timeout Time before the health check is considered failed.
 */
/**
 * @typedef Deployment
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {object} files Manifest of the files stored in Google Cloud Storage that are included as part of this version. All files must be readable using the credentials supplied with this call.
 * @property {appengine(v1beta5).ContainerInfo} container A Docker image that App Engine uses the run the version. Only applicable for instances in App Engine flexible environment.
 * @property {appengine(v1beta5).SourceReference[]} sourceReferences Origin of the source code for this deployment. There can be more than one source reference per version if source code is distributed among multiple repositories.
 */
/**
 * @typedef FileInfo
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} sourceUrl URL source to use to fetch this file. Must be a URL to a resource in Google Cloud Storage in the form &#39;http(s)://storage.googleapis.com//&#39;.
 * @property {string} sha1Sum The SHA1 hash of the file, in hex.
 * @property {string} mimeType The MIME type of the file.Defaults to the value from Google Cloud Storage.
 */
/**
 * @typedef ContainerInfo
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} image URI to the hosted container image in a Docker repository. The URI must be fully qualified and include a tag or digest. Examples: &quot;gcr.io/my-project/image:tag&quot; or &quot;gcr.io/my-project/image@digest&quot;
 */
/**
 * @typedef SourceReference
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} repository URI string identifying the repository. Example: &quot;https://source.developers.google.com/p/app-123/r/default&quot;
 * @property {string} revisionId The canonical, persistent identifier of the deployed revision. Aliases that include tags or branch names are not allowed. Example (git): &quot;2198322f89e0bb2e25021667c2ed489d1fd34e6b&quot;
 */
/**
 * @typedef EndpointsApiService
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Endpoints service name which is the name of the &quot;service&quot; resource in the Service Management API. For example &quot;myapi.endpoints.myproject.cloud.goog&quot;
 * @property {string} configId Endpoints service configuration id as specified by the Service Management API. For example &quot;2016-09-19r1&quot;
 */
/**
 * @typedef ListVersionsResponse
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {appengine(v1beta5).Version[]} versions The versions belonging to the requested service.
 * @property {string} nextPageToken Continuation token for fetching the next page of results.
 */
/**
 * @typedef Service
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Full path to the Service resource in the API. Example: apps/myapp/services/default.@OutputOnly
 * @property {string} id Relative name of the service within the application. Example: default.@OutputOnly
 * @property {appengine(v1beta5).TrafficSplit} split Mapping that defines fractional HTTP traffic diversion to different versions within the service.
 */
/**
 * @typedef TrafficSplit
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} shardBy Mechanism used to determine which version a request is sent to. The traffic selection algorithm will be stable for either type until allocations are changed.
 * @property {object} allocations Mapping from version IDs within the service to fractional (0.000, 1] allocations of traffic for that version. Each version can be specified only once, but some versions in the service may not have any traffic allocation. Services that have traffic allocated cannot be deleted until either the service is deleted or their traffic allocation is removed. Allocations must sum to 1. Up to two decimal place precision is supported for IP-based splits and up to three decimal places is supported for cookie-based splits.
 */
/**
 * @typedef ListServicesResponse
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {appengine(v1beta5).Service[]} services The services belonging to the requested application.
 * @property {string} nextPageToken Continuation token for fetching the next page of results.
 */
/**
 * @typedef Instance
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Full path to the Instance resource in the API. Example: apps/myapp/services/default/versions/v1/instances/instance-1.@OutputOnly
 * @property {string} id Relative name of the instance within the version. Example: instance-1.@OutputOnly
 * @property {string} appEngineRelease App Engine release this instance is running on.@OutputOnly
 * @property {string} availability Availability of the instance.@OutputOnly
 * @property {string} vmName Name of the virtual machine where this instance lives. Only applicable for instances in App Engine flexible environment.@OutputOnly
 * @property {string} vmZoneName Zone where the virtual machine is located. Only applicable for instances in App Engine flexible environment.@OutputOnly
 * @property {string} vmId Virtual machine ID of this instance. Only applicable for instances in App Engine flexible environment.@OutputOnly
 * @property {string} startTimestamp Time that this instance was started.@OutputOnly
 * @property {integer} requests Number of requests since this instance was started.@OutputOnly
 * @property {integer} errors Number of errors since this instance was started.@OutputOnly
 * @property {number} qps Average queries per second (QPS) over the last minute.@OutputOnly
 * @property {integer} averageLatency Average latency (ms) over the last minute.@OutputOnly
 * @property {string} memoryUsage Total memory in use (bytes).@OutputOnly
 * @property {string} vmStatus Status of the virtual machine where this instance lives. Only applicable for instances in App Engine flexible environment.@OutputOnly
 * @property {boolean} vmUnlocked Whether this instance is in debug mode. Only applicable for instances in App Engine flexible environment.@OutputOnly
 * @property {string} vmIp The IP address of this instance. Only applicable for instances in App Engine flexible environment.@OutputOnly
 */
/**
 * @typedef ListInstancesResponse
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {appengine(v1beta5).Instance[]} instances The instances belonging to the requested version.
 * @property {string} nextPageToken Continuation token for fetching the next page of results.
 */
/**
 * @typedef DebugInstanceRequest
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} sshKey Public SSH key to add to the instance. Examples: [USERNAME]:ssh-rsa [KEY_VALUE] [USERNAME] [USERNAME]:ssh-rsa [KEY_VALUE] google-ssh {&quot;userName&quot;:&quot;[USERNAME]&quot;,&quot;expireOn&quot;:&quot;[EXPIRE_TIME]&quot;}For more information, see Adding and Removing SSH Keys (https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys).
 */
/**
 * @typedef ListLocationsResponse
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {appengine(v1beta5).Location[]} locations A list of locations that matches the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef Location
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} name Resource name for the location, which may vary between implementations. For example: &quot;projects/example-project/locations/us-east1&quot;
 * @property {string} locationId The canonical id for this location. For example: &quot;us-east1&quot;.
 * @property {object} labels Cross-service attributes for the location. For example {&quot;cloud.googleapis.com/region&quot;: &quot;us-east1&quot;}
 * @property {object} metadata Service-specific metadata. For example the available capacity at the given location.
 */
/**
 * @typedef OperationMetadataExperimental
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} method API method that initiated this operation. Example: google.appengine.experimental.CustomDomains.CreateCustomDomain.@OutputOnly
 * @property {string} insertTime Time that this operation was created.@OutputOnly
 * @property {string} endTime Time that this operation completed.@OutputOnly
 * @property {string} user User who requested this operation.@OutputOnly
 * @property {string} target Name of the resource that this operation is acting on. Example: apps/myapp/customDomains/example.com.@OutputOnly
 */
/**
 * @typedef OperationMetadata
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} operationType Type of this operation. Deprecated, use method field instead. Example: &quot;create_version&quot;.@OutputOnly
 * @property {string} insertTime Timestamp that this operation was created.@OutputOnly
 * @property {string} endTime Timestamp that this operation completed.@OutputOnly
 * @property {string} user User who requested this operation.@OutputOnly
 * @property {string} target Name of the resource that this operation is acting on. Example: apps/myapp/modules/default.@OutputOnly
 * @property {string} method API method that initiated this operation. Example: google.appengine.v1beta4.Version.CreateVersion.@OutputOnly
 */
/**
 * @typedef OperationMetadataV1Beta5
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} method API method name that initiated this operation. Example: google.appengine.v1beta5.Version.CreateVersion.@OutputOnly
 * @property {string} insertTime Timestamp that this operation was created.@OutputOnly
 * @property {string} endTime Timestamp that this operation completed.@OutputOnly
 * @property {string} user User who requested this operation.@OutputOnly
 * @property {string} target Name of the resource that this operation is acting on. Example: apps/myapp/services/default.@OutputOnly
 */
/**
 * @typedef OperationMetadataV1
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {string} method API method that initiated this operation. Example: google.appengine.v1.Versions.CreateVersion.@OutputOnly
 * @property {string} insertTime Time that this operation was created.@OutputOnly
 * @property {string} endTime Time that this operation completed.@OutputOnly
 * @property {string} user User who requested this operation.@OutputOnly
 * @property {string} target Name of the resource that this operation is acting on. Example: apps/myapp/services/default.@OutputOnly
 * @property {string} ephemeralMessage Ephemeral message that may change every time the operation is polled. @OutputOnly
 * @property {string[]} warning Durable messages that persist on every operation poll. @OutputOnly
 */
/**
 * @typedef LocationMetadata
 * @memberOf! appengine(v1beta5)
 * @type object
 * @property {boolean} standardEnvironmentAvailable App Engine Standard Environment is available in the given location.@OutputOnly
 * @property {boolean} flexibleEnvironmentAvailable App Engine Flexible Environment is available in the given location.@OutputOnly
 */
module.exports = Appengine;
