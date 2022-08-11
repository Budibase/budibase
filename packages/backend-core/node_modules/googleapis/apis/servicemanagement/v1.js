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
 * Google Service Management API
 *
 * Google Service Management allows service producers to publish their services on Google Cloud Platform so that they can be discovered and used by service consumers.
 *
 * @example
 * var google = require('googleapis');
 * var servicemanagement = google.servicemanagement('v1');
 *
 * @namespace servicemanagement
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Servicemanagement
 */
function Servicemanagement(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.operations = {

    /**
     * servicemanagement.operations.get
     *
     * @desc Gets the latest state of a long-running operation.  Clients can use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @alias servicemanagement.operations.get
     * @memberOf! servicemanagement(v1)
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
          url: 'https://servicemanagement.googleapis.com/v1/{name}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.services = {

    /**
     * servicemanagement.services.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
     *
     * @alias servicemanagement.services.getIamPolicy
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {servicemanagement(v1).GetIamPolicyRequest} params.resource Request body data
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
          url: 'https://servicemanagement.googleapis.com/v1/{resource}:getIamPolicy',
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
     * servicemanagement.services.disable
     *
     * @desc Disable a managed service for a project.  Operation<response: DisableServiceResponse>
     *
     * @alias servicemanagement.services.disable
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName Name of the service to disable. Specifying an unknown service name will cause the request to fail.
     * @param {servicemanagement(v1).DisableServiceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    disable: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}:disable',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.generateConfigReport
     *
     * @desc Generates and returns a report (errors, warnings and changes from existing configurations) associated with GenerateConfigReportRequest.new_value  If GenerateConfigReportRequest.old_value is specified, GenerateConfigReportRequest will contain a single ChangeReport based on the comparison between GenerateConfigReportRequest.new_value and GenerateConfigReportRequest.old_value. If GenerateConfigReportRequest.old_value is not specified, this method will compare GenerateConfigReportRequest.new_value with the last pushed service configuration.
     *
     * @alias servicemanagement.services.generateConfigReport
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {servicemanagement(v1).GenerateConfigReportRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateConfigReport: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://servicemanagement.googleapis.com/v1/services:generateConfigReport',
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
     * servicemanagement.services.getConfig
     *
     * @desc Gets a service configuration (version) for a managed service.
     *
     * @alias servicemanagement.services.getConfig
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.configId The id of the service configuration resource.
     * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/config',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.undelete
     *
     * @desc Revives a previously deleted managed service. The method restores the service using the configuration at the time the service was deleted. The target service must exist and must have been deleted within the last 30 days.  Operation<response: UndeleteServiceResponse>
     *
     * @alias servicemanagement.services.undelete
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName The name of the service. See the [overview](/service-management/overview) for naming requirements. For example: `example.googleapis.com`.
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
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}:undelete',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.get
     *
     * @desc Gets a managed service. Authentication is required unless the service is public.
     *
     * @alias servicemanagement.services.get
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName The name of the service.  See the `ServiceManager` overview for naming requirements.  For example: `example.googleapis.com`.
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
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.list
     *
     * @desc Lists managed services.  If called without any authentication, it returns only the public services. If called with authentication, it returns all services that the caller has "servicemanagement.services.get" permission for.  **BETA:** If the caller specifies the `consumer_id`, it returns only the services enabled on the consumer. The `consumer_id` must have the format of "project:{PROJECT-ID}".
     *
     * @alias servicemanagement.services.list
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize Requested size of the next page of data.
     * @param {string=} params.producerProjectId Include services produced by the specified project.
     * @param {string=} params.pageToken Token identifying which result to start with; returned by a previous list call.
     * @param {string=} params.consumerId Include services consumed by the specified consumer.  The Google Service Management implementation accepts the following forms: - project:<project_id>
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
          url: 'https://servicemanagement.googleapis.com/v1/services',
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
     * servicemanagement.services.create
     *
     * @desc Creates a new managed service. Please note one producer project can own no more than 20 services.  Operation<response: ManagedService>
     *
     * @alias servicemanagement.services.create
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {servicemanagement(v1).ManagedService} params.resource Request body data
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
          url: 'https://servicemanagement.googleapis.com/v1/services',
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
     * servicemanagement.services.enable
     *
     * @desc Enable a managed service for a project with default setting.  Operation<response: EnableServiceResponse>  google.rpc.Status errors may contain a google.rpc.PreconditionFailure error detail.
     *
     * @alias servicemanagement.services.enable
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName Name of the service to enable. Specifying an unknown service name will cause the request to fail.
     * @param {servicemanagement(v1).EnableServiceRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    enable: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}:enable',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias servicemanagement.services.setIamPolicy
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {servicemanagement(v1).SetIamPolicyRequest} params.resource Request body data
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
          url: 'https://servicemanagement.googleapis.com/v1/{resource}:setIamPolicy',
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
     * servicemanagement.services.delete
     *
     * @desc Deletes a managed service. This method will change the service to the `Soft-Delete` state for 30 days. Within this period, service producers may call UndeleteService to restore the service. After 30 days, the service will be permanently deleted.  Operation<response: google.protobuf.Empty>
     *
     * @alias servicemanagement.services.delete
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
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
          url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicemanagement.services.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
     *
     * @alias servicemanagement.services.testIamPermissions
     * @memberOf! servicemanagement(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
     * @param {servicemanagement(v1).TestIamPermissionsRequest} params.resource Request body data
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
          url: 'https://servicemanagement.googleapis.com/v1/{resource}:testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resource'],
        pathParams: ['resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    rollouts: {

      /**
       * servicemanagement.services.rollouts.get
       *
       * @desc Gets a service configuration rollout.
       *
       * @alias servicemanagement.services.rollouts.get
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.rolloutId The id of the rollout resource.
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/rollouts/{rolloutId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['serviceName', 'rolloutId'],
          pathParams: ['rolloutId', 'serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * servicemanagement.services.rollouts.create
       *
       * @desc Creates a new service configuration rollout. Based on rollout, the Google Service Management will roll out the service configurations to different backend services. For example, the logging configuration will be pushed to Google Cloud Logging.  Please note that any previous pending and running Rollouts and associated Operations will be automatically cancelled so that the latest Rollout will not be blocked by previous Rollouts.  Operation<response: Rollout>
       *
       * @alias servicemanagement.services.rollouts.create
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
       * @param {servicemanagement(v1).Rollout} params.resource Request body data
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/rollouts',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['serviceName'],
          pathParams: ['serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * servicemanagement.services.rollouts.list
       *
       * @desc Lists the history of the service configuration rollouts for a managed service, from the newest to the oldest.
       *
       * @alias servicemanagement.services.rollouts.list
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize The max number of items to include in the response list.
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
       * @param {string=} params.pageToken The token of the page to retrieve.
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/rollouts',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['serviceName'],
          pathParams: ['serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    configs: {

      /**
       * servicemanagement.services.configs.submit
       *
       * @desc Creates a new service configuration (version) for a managed service based on user-supplied configuration source files (for example: OpenAPI Specification). This method stores the source configurations as well as the generated service configuration. To rollout the service configuration to other services, please call CreateServiceRollout.  Operation<response: SubmitConfigSourceResponse>
       *
       * @alias servicemanagement.services.configs.submit
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
       * @param {servicemanagement(v1).SubmitConfigSourceRequest} params.resource Request body data
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/configs:submit',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['serviceName'],
          pathParams: ['serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * servicemanagement.services.configs.get
       *
       * @desc Gets a service configuration (version) for a managed service.
       *
       * @alias servicemanagement.services.configs.get
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.configId The id of the service configuration resource.
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/configs/{configId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['serviceName', 'configId'],
          pathParams: ['configId', 'serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * servicemanagement.services.configs.create
       *
       * @desc Creates a new service configuration (version) for a managed service. This method only stores the service configuration. To roll out the service configuration to backend systems please call CreateServiceRollout.
       *
       * @alias servicemanagement.services.configs.create
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
       * @param {servicemanagement(v1).Service} params.resource Request body data
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/configs',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['serviceName'],
          pathParams: ['serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * servicemanagement.services.configs.list
       *
       * @desc Lists the history of the service configuration for a managed service, from the newest to the oldest.
       *
       * @alias servicemanagement.services.configs.list
       * @memberOf! servicemanagement(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize The max number of items to include in the response list.
       * @param {string} params.serviceName The name of the service.  See the [overview](/service-management/overview) for naming requirements.  For example: `example.googleapis.com`.
       * @param {string=} params.pageToken The token of the page to retrieve.
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
            url: 'https://servicemanagement.googleapis.com/v1/services/{serviceName}/configs',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['serviceName'],
          pathParams: ['serviceName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Api
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).Method[]} methods The methods of this api, in unspecified order.
* @property {servicemanagement(v1).Option[]} options Any metadata attached to the API.
* @property {servicemanagement(v1).SourceContext} sourceContext Source context for the protocol buffer service represented by this
message.
* @property {string} name The fully qualified name of this api, including package name
followed by the api&#39;s simple name.
* @property {string} syntax The source syntax of the service.
* @property {string} version A version string for this api. If specified, must have the form
`major-version.minor-version`, as in `1.10`. If the minor version
is omitted, it defaults to zero. If the entire version field is
empty, the major version is derived from the package name, as
outlined below. If the field is not empty, the version in the
package name will be verified to be consistent with what is
provided here.

The versioning schema uses [semantic
versioning](http://semver.org) where the major version number
indicates a breaking change and the minor version an additive,
non-breaking change. Both version numbers are signals to users
what to expect from different versions, and should be carefully
chosen based on the product plan.

The major version is also reflected in the package name of the
API, which must end in `v&lt;major-version&gt;`, as in
`google.feature.v1`. For major versions 0 and 1, the suffix can
be omitted. Zero major versions must only be used for
experimental, none-GA apis.

* @property {servicemanagement(v1).Mixin[]} mixins Included APIs. See Mixin.
*/
/**
 * @typedef SystemParameterRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).SystemParameter[]} parameters Define parameters. Multiple names may be defined for a parameter.
For a given method call, only one of them should be used. If multiple
names are used the behavior is implementation-dependent.
If none of the specified names are present the behavior is
parameter-dependent.
* @property {string} selector Selects the methods to which this rule applies. Use &#39;*&#39; to indicate all
methods in all APIs.

Refer to selector for syntax details.
*/
/**
 * @typedef Diagnostic
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} location File name and line number of the error or warning.
 * @property {string} kind The kind of diagnostic information provided.
 * @property {string} message Message describing the error or warning.
 */
/**
 * @typedef ChangeReport
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).ConfigChange[]} configChanges List of changes between two service configurations.
The changes will be alphabetically sorted based on the identifier
of each change.
A ConfigChange identifier is a dot separated path to the configuration.
Example: visibility.rules[selector=&#39;LibraryService.CreateBook&#39;].restriction
*/
/**
 * @typedef MonitoredResourceDescriptor
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} displayName Optional. A concise name for the monitored resource type that might be
displayed in user interfaces. It should be a Title Cased Noun Phrase,
without any article or other determiners. For example,
`&quot;Google Cloud SQL Database&quot;`.
* @property {string} description Optional. A detailed description of the monitored resource type that might
be used in documentation.
* @property {servicemanagement(v1).LabelDescriptor[]} labels Required. A set of labels used to describe instances of this monitored
resource type. For example, an individual Google Cloud SQL database is
identified by values for the labels `&quot;database_id&quot;` and `&quot;zone&quot;`.
* @property {string} type Required. The monitored resource type. For example, the type
`&quot;cloudsql_database&quot;` represents databases in Google Cloud SQL.
The maximum length of this value is 256 characters.
* @property {string} name Optional. The resource name of the monitored resource descriptor:
`&quot;projects/{project_id}/monitoredResourceDescriptors/{type}&quot;` where
{type} is the value of the `type` field in this object and
{project_id} is a project ID that provides API-specific context for
accessing the type.  APIs that do not use project information can use the
resource name format `&quot;monitoredResourceDescriptors/{type}&quot;`.
*/
/**
 * @typedef LogConfig
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {servicemanagement(v1).DataAccessOptions} dataAccess Data access options.
 * @property {servicemanagement(v1).CounterOptions} counter Counter options.
 * @property {servicemanagement(v1).CloudAuditOptions} cloudAudit Cloud audit options.
 */
/**
 * @typedef Mixin
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} root If non-empty specifies a path under which inherited HTTP paths
are rooted.
* @property {string} name The fully qualified name of the API which is included.
*/
/**
 * @typedef Service
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} id A unique ID for a specific instance of this message, typically assigned
by the client for tracking purpose. If empty, the server may choose to
generate one instead.
* @property {servicemanagement(v1).Enum[]} enums A list of all enum types included in this API service.  Enums
referenced directly or indirectly by the `apis` are automatically
included.  Enums which are not referenced but shall be included
should be listed here by name. Example:

    enums:
    - name: google.someapi.v1.SomeEnum
* @property {servicemanagement(v1).Usage} usage Configuration controlling usage of this service.
* @property {servicemanagement(v1).Control} control Configuration for the service control plane.
* @property {string} title The product title associated with this service.
* @property {servicemanagement(v1).Http} http HTTP configuration.
* @property {servicemanagement(v1).Type[]} systemTypes A list of all proto message types included in this API service.
It serves similar purpose as [google.api.Service.types], except that
these types are not needed by user-defined APIs. Therefore, they will not
show up in the generated discovery doc. This field should only be used
to define system APIs in ESF.
* @property {integer} configVersion The version of the service configuration. The config version may
influence interpretation of the configuration, for example, to
determine defaults. This is documented together with applicable
options. The current default for the config version itself is `3`.
* @property {servicemanagement(v1).Backend} backend API backend configuration.
* @property {servicemanagement(v1).Monitoring} monitoring Monitoring configuration.
* @property {servicemanagement(v1).Visibility} visibility API visibility configuration.
* @property {servicemanagement(v1).Logging} logging Logging configuration.
* @property {servicemanagement(v1).CustomError} customError Custom error configuration.
* @property {servicemanagement(v1).Context} context Context configuration.
* @property {servicemanagement(v1).Api[]} apis A list of API interfaces exported by this service. Only the `name` field
of the google.protobuf.Api needs to be provided by the configuration
author, as the remaining fields will be derived from the IDL during the
normalization process. It is an error to specify an API interface here
which cannot be resolved against the associated IDL files.
* @property {servicemanagement(v1).MetricDescriptor[]} metrics Defines the metrics used by this service.
* @property {servicemanagement(v1).SystemParameters} systemParameters System parameter configuration.
* @property {servicemanagement(v1).Endpoint[]} endpoints Configuration for network endpoints.  If this is empty, then an endpoint
with the same name as the service is automatically generated to service all
defined APIs.
* @property {string} name The DNS address at which this service is available,
e.g. `calendar.googleapis.com`.
* @property {string} producerProjectId The id of the Google developer project that owns the service.
Members of this project can manage the service configuration,
manage consumption of the service, etc.
* @property {servicemanagement(v1).Documentation} documentation Additional API documentation.
* @property {servicemanagement(v1).MonitoredResourceDescriptor[]} monitoredResources Defines the monitored resources used by this service. This is required
by the Service.monitoring and Service.logging configurations.
* @property {servicemanagement(v1).Type[]} types A list of all proto message types included in this API service.
Types referenced directly or indirectly by the `apis` are
automatically included.  Messages which are not referenced but
shall be included, such as types used by the `google.protobuf.Any` type,
should be listed here by name. Example:

    types:
    - name: google.protobuf.Int32
* @property {servicemanagement(v1).LogDescriptor[]} logs Defines the logs used by this service.
* @property {servicemanagement(v1).Authentication} authentication Auth configuration.
*/
/**
 * @typedef SubmitConfigSourceResponse
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {servicemanagement(v1).Service} serviceConfig The generated service configuration.
 */
/**
 * @typedef Documentation
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} overview Declares a single overview page. For example:
&lt;pre&gt;&lt;code&gt;documentation:
  summary: ...
  overview: &amp;#40;== include overview.md ==&amp;#41;
&lt;/code&gt;&lt;/pre&gt;
This is a shortcut for the following declaration (using pages style):
&lt;pre&gt;&lt;code&gt;documentation:
  summary: ...
  pages:
  - name: Overview
    content: &amp;#40;== include overview.md ==&amp;#41;
&lt;/code&gt;&lt;/pre&gt;
Note: you cannot specify both `overview` field and `pages` field.
* @property {string} documentationRootUrl The URL to the root of documentation.
* @property {servicemanagement(v1).Page[]} pages The top level pages for the documentation set.
* @property {string} summary A short summary of what the service does. Can only be provided by
plain text.
* @property {servicemanagement(v1).DocumentationRule[]} rules A list of documentation rules that apply to individual API elements.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef Policy
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).AuditConfig[]} auditConfigs Specifies audit logging configs for &quot;data access&quot;.
&quot;data access&quot;: generally refers to data reads/writes and admin reads.
&quot;admin activity&quot;: generally refers to admin writes.

Note: `AuditConfig` doesn&#39;t apply to &quot;admin activity&quot;, which always
enables audit logging.
* @property {servicemanagement(v1).Rule[]} rules If more than one rule is specified, the rules are applied in the following
manner:
- All matching LOG rules are always applied.
- If any DENY/DENY_WITH_LOG rule matches, permission is denied.
  Logging will be applied if one or more matching rule requires logging.
- Otherwise, if any ALLOW/ALLOW_WITH_LOG rule matches, permission is
  granted.
  Logging will be applied if one or more matching rule requires logging.
- Otherwise, if no rule applies, permission is denied.
* @property {servicemanagement(v1).Binding[]} bindings Associates a list of `members` to a `role`.
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
* @property {boolean} iamOwned 
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef OAuthRequirements
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} canonicalScopes The list of publicly documented OAuth scopes that are allowed access. An
OAuth token containing any of these scopes will be accepted.

Example:

     canonical_scopes: https://www.googleapis.com/auth/calendar,
                       https://www.googleapis.com/auth/calendar.read
*/
/**
 * @typedef ListServicesResponse
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} nextPageToken Token that can be passed to `ListServices` to resume a paginated query.
 * @property {servicemanagement(v1).ManagedService[]} services The returned services will only have the name field set.
 */
/**
 * @typedef Step
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} description The short description of the step.
 * @property {string} status The status code.
 */
/**
 * @typedef Context
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).ContextRule[]} rules A list of RPC context rules that apply to individual API methods.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef Monitoring
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).MonitoringDestination[]} producerDestinations Monitoring configurations for sending metrics to the producer project.
There can be multiple producer destinations, each one must have a
different monitored resource type. A metric can be used in at most
one producer destination.
* @property {servicemanagement(v1).MonitoringDestination[]} consumerDestinations Monitoring configurations for sending metrics to the consumer project.
There can be multiple consumer destinations, each one must have a
different monitored resource type. A metric can be used in at most
one consumer destination.
*/
/**
 * @typedef ManagedService
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} producerProjectId ID of the project that produces and owns this service.
* @property {string} serviceName The name of the service. See the [overview](/service-management/overview)
for naming requirements.
*/
/**
 * @typedef ConfigFile
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} filePath The file name of the configuration file (full or relative path).
 * @property {string} fileType The type of configuration file this represents.
 * @property {string} fileContents The bytes that constitute the file.
 */
/**
 * @typedef ListServiceConfigsResponse
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} nextPageToken The token of the next page of results.
 * @property {servicemanagement(v1).Service[]} serviceConfigs The list of service configuration resources.
 */
/**
 * @typedef TrafficPercentStrategy
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {object} percentages Maps service configuration IDs to their corresponding traffic percentage.
Key is the service configuration ID, Value is the traffic percentage
which must be greater than 0.0 and the sum must equal to 100.0.
*/
/**
 * @typedef GenerateConfigReportRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {object} oldConfig Service configuration against which the comparison will be done.
For this version of API, the supported types are
google.api.servicemanagement.v1.ConfigRef,
google.api.servicemanagement.v1.ConfigSource,
and google.api.Service
* @property {object} newConfig Service configuration for which we want to generate the report.
For this version of API, the supported types are
google.api.servicemanagement.v1.ConfigRef,
google.api.servicemanagement.v1.ConfigSource,
and google.api.Service
*/
/**
 * @typedef GetIamPolicyRequest
 * @memberOf! servicemanagement(v1)
 * @type object
 */
/**
 * @typedef LoggingDestination
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} monitoredResource The monitored resource type. The type must be defined in the
Service.monitored_resources section.
* @property {string[]} logs Names of the logs to be sent to this destination. Each name must
be defined in the Service.logs section. If the log name is
not a domain scoped name, it will be automatically prefixed with
the service name followed by &quot;/&quot;.
*/
/**
 * @typedef Authentication
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).AuthProvider[]} providers Defines a set of authentication providers that a service supports.
* @property {servicemanagement(v1).AuthenticationRule[]} rules A list of authentication rules that apply to individual API methods.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef Type
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string[]} oneofs The list of types appearing in `oneof` definitions in this type.
 * @property {servicemanagement(v1).Option[]} options The protocol buffer options.
 * @property {servicemanagement(v1).SourceContext} sourceContext The source context.
 * @property {servicemanagement(v1).Field[]} fields The list of fields.
 * @property {string} name The fully qualified message name.
 * @property {string} syntax The source syntax.
 */
/**
 * @typedef Backend
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).BackendRule[]} rules A list of API backend rules that apply to individual API methods.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef AuditConfig
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} service Specifies a service that will be enabled for audit logging.
For example, `resourcemanager`, `storage`, `compute`.
`allServices` is a special value that covers all services.
* @property {servicemanagement(v1).AuditLogConfig[]} auditLogConfigs The configuration for each type of logging
Next ID: 4
* @property {string[]} exemptedMembers Specifies the identities that are exempted from &quot;data access&quot; audit
logging for the `service` specified above.
Follows the same format of Binding.members.
*/
/**
 * @typedef ListServiceRolloutsResponse
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {servicemanagement(v1).Rollout[]} rollouts The list of rollout resources.
 * @property {string} nextPageToken The token of the next page of results.
 */
/**
 * @typedef Rollout
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} createdBy The user who created the Rollout. Readonly.
* @property {servicemanagement(v1).TrafficPercentStrategy} trafficPercentStrategy Google Service Control selects service configurations based on
traffic percentage.
* @property {string} status The status of this rollout. Readonly. In case of a failed rollout,
the system will automatically rollback to the current Rollout
version. Readonly.
* @property {servicemanagement(v1).DeleteServiceStrategy} deleteServiceStrategy The strategy associated with a rollout to delete a `ManagedService`.
Readonly.
* @property {string} createTime Creation time of the rollout. Readonly.
* @property {string} serviceName The name of the service associated with this Rollout.
* @property {string} rolloutId Optional unique identifier of this Rollout. Only lower case letters, digits
 and &#39;-&#39; are allowed.

If not specified by client, the server will generate one. The generated id
will have the form of &lt;date&gt;&lt;revision number&gt;, where &quot;date&quot; is the create
date in ISO 8601 format.  &quot;revision number&quot; is a monotonically increasing
positive number that is reset every day for each service.
An example of the generated rollout_id is &#39;2016-02-16r1&#39;
*/
/**
 * @typedef ConfigSource
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).ConfigFile[]} files Set of source configuration files that are used to generate a service
configuration (`google.api.Service`).
* @property {string} id A unique ID for a specific instance of this message, typically assigned
by the client for tracking purpose. If empty, the server may choose to
generate one instead.
*/
/**
 * @typedef Method
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {boolean} requestStreaming If true, the request is streamed.
 * @property {servicemanagement(v1).Option[]} options Any metadata attached to the method.
 * @property {string} requestTypeUrl A URL of the input message type.
 * @property {string} name The simple name of this method.
 * @property {string} syntax The source syntax of this method.
 * @property {string} responseTypeUrl The URL of the output message type.
 * @property {boolean} responseStreaming If true, the response is streamed.
 */
/**
 * @typedef Operation
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).Status} error The error result of the operation in case of failure or cancellation.
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
 * @typedef Rule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} description Human-readable description of the rule.
* @property {string[]} in If one or more &#39;in&#39; clauses are specified, the rule matches if
the PRINCIPAL/AUTHORITY_SELECTOR is in at least one of these entries.
* @property {string} action Required
* @property {servicemanagement(v1).Condition[]} conditions Additional restrictions that must be met
* @property {string[]} notIn If one or more &#39;not_in&#39; clauses are specified, the rule matches
if the PRINCIPAL/AUTHORITY_SELECTOR is in none of the entries.
The format for in and not_in entries is the same as for members in a
Binding (see google/iam/v1/policy.proto).
* @property {servicemanagement(v1).LogConfig[]} logConfig The config returned to callers of tech.iam.IAM.CheckPolicy for any entries
that match the LOG action.
* @property {string[]} permissions A permission is a string of form &#39;&lt;service&gt;.&lt;resource type&gt;.&lt;verb&gt;&#39;
(e.g., &#39;storage.buckets.list&#39;). A value of &#39;*&#39; matches all permissions,
and a verb part of &#39;*&#39; (e.g., &#39;storage.buckets.*&#39;) matches all verbs.
*/
/**
 * @typedef MetricDescriptor
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} description A detailed description of the metric, which can be used in documentation.
* @property {string} unit The unit in which the metric value is reported. It is only applicable
if the `value_type` is `INT64`, `DOUBLE`, or `DISTRIBUTION`. The
supported units are a subset of [The Unified Code for Units of
Measure](http://unitsofmeasure.org/ucum.html) standard:

**Basic units (UNIT)**

* `bit`   bit
* `By`    byte
* `s`     second
* `min`   minute
* `h`     hour
* `d`     day

**Prefixes (PREFIX)**

* `k`     kilo    (10**3)
* `M`     mega    (10**6)
* `G`     giga    (10**9)
* `T`     tera    (10**12)
* `P`     peta    (10**15)
* `E`     exa     (10**18)
* `Z`     zetta   (10**21)
* `Y`     yotta   (10**24)
* `m`     milli   (10**-3)
* `u`     micro   (10**-6)
* `n`     nano    (10**-9)
* `p`     pico    (10**-12)
* `f`     femto   (10**-15)
* `a`     atto    (10**-18)
* `z`     zepto   (10**-21)
* `y`     yocto   (10**-24)
* `Ki`    kibi    (2**10)
* `Mi`    mebi    (2**20)
* `Gi`    gibi    (2**30)
* `Ti`    tebi    (2**40)

**Grammar**

The grammar includes the dimensionless unit `1`, such as `1/s`.

The grammar also includes these connectors:

* `/`    division (as an infix operator, e.g. `1/s`).
* `.`    multiplication (as an infix operator, e.g. `GBy.d`)

The grammar for a unit is as follows:

    Expression = Component { &quot;.&quot; Component } { &quot;/&quot; Component } ;

    Component = [ PREFIX ] UNIT [ Annotation ]
              | Annotation
              | &quot;1&quot;
              ;

    Annotation = &quot;{&quot; NAME &quot;}&quot; ;

Notes:

* `Annotation` is just a comment if it follows a `UNIT` and is
   equivalent to `1` if it is used alone. For examples,
   `{requests}/s == 1/s`, `By{transmitted}/s == By/s`.
* `NAME` is a sequence of non-blank printable ASCII characters not
   containing &#39;{&#39; or &#39;}&#39;.
* @property {servicemanagement(v1).LabelDescriptor[]} labels The set of labels that can be used to describe a specific
instance of this metric type. For example, the
`appengine.googleapis.com/http/server/response_latencies` metric
type has a label for the HTTP response code, `response_code`, so
you can look at latencies for successful responses or just
for responses that failed.
* @property {string} metricKind Whether the metric records instantaneous values, changes to a value, etc.
Some combinations of `metric_kind` and `value_type` might not be supported.
* @property {string} valueType Whether the measurement is an integer, a floating-point number, etc.
Some combinations of `metric_kind` and `value_type` might not be supported.
* @property {string} displayName A concise name for the metric, which can be displayed in user interfaces.
Use sentence case without an ending period, for example &quot;Request count&quot;.
* @property {string} name The resource name of the metric descriptor. Depending on the
implementation, the name typically includes: (1) the parent resource name
that defines the scope of the metric type or of its data; and (2) the
metric&#39;s URL-encoded type, which also appears in the `type` field of this
descriptor. For example, following is the resource name of a custom
metric within the GCP project `my-project-id`:

    &quot;projects/my-project-id/metricDescriptors/custom.googleapis.com%2Finvoice%2Fpaid%2Famount&quot;
* @property {string} type The metric type, including its DNS name prefix. The type is not
URL-encoded.  All user-defined custom metric types have the DNS name
`custom.googleapis.com`.  Metric types should use a natural hierarchical
grouping. For example:

    &quot;custom.googleapis.com/invoice/paid/amount&quot;
    &quot;appengine.googleapis.com/http/server/response_latencies&quot;
*/
/**
 * @typedef EnableServiceRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} consumerId The identity of consumer resource which service enablement will be
applied to.

The Google Service Management implementation accepts the following
forms:
- &quot;project:&lt;project_id&gt;&quot;

Note: this is made compatible with
google.api.servicecontrol.v1.Operation.consumer_id.
*/
/**
 * @typedef DocumentationRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} description Description of the selected API(s).
* @property {string} deprecationDescription Deprecation description of the selected element(s). It can be provided if an
element is marked as `deprecated`.
* @property {string} selector The selector is a comma-separated list of patterns. Each pattern is a
qualified name of the element which may end in &quot;*&quot;, indicating a wildcard.
Wildcards are only allowed at the end and for a whole component of the
qualified name, i.e. &quot;foo.*&quot; is ok, but not &quot;foo.b*&quot; or &quot;foo.*.bar&quot;. To
specify a default for all applicable elements, the whole pattern &quot;*&quot;
is used.
*/
/**
 * @typedef SetIamPolicyRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} updateMask OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only
the fields in the mask will be modified. If no mask is provided, a default
mask is used:
paths: &quot;bindings, etag&quot;
This field is only used by Cloud IAM.
* @property {servicemanagement(v1).Policy} policy REQUIRED: The complete policy to be applied to the `resource`. The size of
the policy is limited to a few 10s of KB. An empty policy is a
valid policy but certain Cloud Platform services (such as Projects)
might reject them.
*/
/**
 * @typedef CounterOptions
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} metric The metric to update.
 * @property {string} field The field value to attribute.
 */
/**
 * @typedef Condition
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} sys Trusted attributes supplied by any service that owns resources and uses
the IAM system for access control.
* @property {string[]} values The objects of the condition. This is mutually exclusive with &#39;value&#39;.
* @property {string} iam Trusted attributes supplied by the IAM system.
* @property {string} op An operator to apply the subject with.
* @property {string} value DEPRECATED. Use &#39;values&#39; instead.
* @property {string} svc Trusted attributes discharged by the service.
*/
/**
 * @typedef Status
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef Endpoint
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string[]} apis The list of APIs served by this endpoint.
* @property {boolean} allowCors Allowing
[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing), aka
cross-domain traffic, would allow the backends served from this endpoint to
receive and respond to HTTP OPTIONS requests. The response will be used by
the browser to determine whether the subsequent cross-origin request is
allowed to proceed.
* @property {string} name The canonical name of this endpoint.
* @property {string[]} aliases DEPRECATED: This field is no longer supported. Instead of using aliases,
please specify multiple google.api.Endpoint for each of the intented
alias.

Additional names that this endpoint will be hosted on.
* @property {string[]} features The list of features enabled on this endpoint.
*/
/**
 * @typedef Page
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).Page[]} subpages Subpages of this page. The order of subpages specified here will be
honored in the generated docset.
* @property {string} content The Markdown content of the page. You can use &lt;code&gt;&amp;#40;== include {path} ==&amp;#41;&lt;/code&gt;
to include content from a Markdown file.
* @property {string} name The name of the page. It will be used as an identity of the page to
generate URI of the page, text of the link to this page in navigation,
etc. The full page name (start from the root page name to this page
concatenated with `.`) can be used as reference to the page in your
documentation. For example:
&lt;pre&gt;&lt;code&gt;pages:
- name: Tutorial
  content: &amp;#40;== include tutorial.md ==&amp;#41;
  subpages:
  - name: Java
    content: &amp;#40;== include tutorial_java.md ==&amp;#41;
&lt;/code&gt;&lt;/pre&gt;
You can reference `Java` page using Markdown reference link syntax:
`Java`.
*/
/**
 * @typedef CustomErrorRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {boolean} isErrorType Mark this message as possible payload in error response.  Otherwise,
objects of this type will be filtered when they appear in error payload.
* @property {string} selector Selects messages to which this rule applies.

Refer to selector for syntax details.
*/
/**
 * @typedef Option
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {object} value The option&#39;s value packed in an Any message. If the value is a primitive,
the corresponding wrapper type defined in google/protobuf/wrappers.proto
should be used. If the value is an enum, it should be stored as an int32
value using the google.protobuf.Int32Value type.
* @property {string} name The option&#39;s name. For protobuf built-in options (options defined in
descriptor.proto), this is the short name. For example, `&quot;map_entry&quot;`.
For custom options, it should be the fully-qualified name. For example,
`&quot;google.api.http&quot;`.
*/
/**
 * @typedef HttpRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).CustomHttpPattern} custom Custom pattern is used for defining custom verbs.
* @property {string} responseBody The name of the response field whose value is mapped to the HTTP body of
response. Other response fields are ignored. This field is optional. When
not set, the response message will be used as HTTP body of response.
NOTE: the referred field must be not a repeated field and must be present
at the top-level of response message type.
* @property {servicemanagement(v1).HttpRule[]} additionalBindings Additional HTTP bindings for the selector. Nested bindings must
not contain an `additional_bindings` field themselves (that is,
the nesting may only be one level deep).
* @property {servicemanagement(v1).MediaDownload} mediaDownload Do not use this. For media support, add instead
[][google.bytestream.RestByteStream] as an API to your
configuration.
* @property {string} body The name of the request field whose value is mapped to the HTTP body, or
`*` for mapping all fields not captured by the path pattern to the HTTP
body. NOTE: the referred field must not be a repeated field and must be
present at the top-level of request message type.
* @property {string} put Used for updating a resource.
* @property {string} get Used for listing and getting information about resources.
* @property {string} selector Selects methods to which this rule applies.

Refer to selector for syntax details.
* @property {string} post Used for creating a resource.
* @property {string} patch Used for updating a resource.
* @property {string} delete Used for deleting a resource.
* @property {servicemanagement(v1).MediaUpload} mediaUpload Do not use this. For media support, add instead
[][google.bytestream.RestByteStream] as an API to your
configuration.
*/
/**
 * @typedef TestIamPermissionsRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string[]} permissions The set of permissions to check for the `resource`. Permissions with
wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more
information see
[IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
*/
/**
 * @typedef TestIamPermissionsResponse
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is
allowed.
*/
/**
 * @typedef CustomError
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string[]} types The list of custom error detail types, e.g. &#39;google.foo.v1.CustomError&#39;.
* @property {servicemanagement(v1).CustomErrorRule[]} rules The list of custom error rules that apply to individual API messages.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef MediaDownload
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {boolean} enabled Whether download is enabled.
 */
/**
 * @typedef SubmitConfigSourceRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).ConfigSource} configSource The source configuration for the service.
* @property {boolean} validateOnly Optional. If set, this will result in the generation of a
`google.api.Service` configuration based on the `ConfigSource` provided,
but the generated config and the sources will NOT be persisted.
*/
/**
 * @typedef AuthenticationRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).OAuthRequirements} oauth The requirements for OAuth credentials.
* @property {boolean} allowWithoutCredential Whether to allow requests without a credential. The credential can be
an OAuth token, Google cookies (first-party auth) or EndUserCreds.

For requests without credentials, if the service control environment is
specified, each incoming request **must** be associated with a service
consumer. This can be done by passing an API key that belongs to a consumer
project.
* @property {servicemanagement(v1).AuthRequirement[]} requirements Requirements for additional authentication providers.
* @property {string} selector Selects the methods to which this rule applies.

Refer to selector for syntax details.
*/
/**
 * @typedef Logging
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).LoggingDestination[]} producerDestinations Logging configurations for sending logs to the producer project.
There can be multiple producer destinations, each one must have a
different monitored resource type. A log can be used in at most
one producer destination.
* @property {servicemanagement(v1).LoggingDestination[]} consumerDestinations Logging configurations for sending logs to the consumer project.
There can be multiple consumer destinations, each one must have a
different monitored resource type. A log can be used in at most
one consumer destination.
*/
/**
 * @typedef SystemParameter
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} urlQueryParameter Define the URL query parameter name to use for the parameter. It is case
sensitive.
* @property {string} name Define the name of the parameter, such as &quot;api_key&quot; . It is case sensitive.
* @property {string} httpHeader Define the HTTP header name to use for the parameter. It is case
insensitive.
*/
/**
 * @typedef Enum
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} syntax The source syntax.
 * @property {servicemanagement(v1).EnumValue[]} enumvalue Enum value definitions.
 * @property {servicemanagement(v1).Option[]} options Protocol buffer options.
 * @property {servicemanagement(v1).SourceContext} sourceContext The source context.
 * @property {string} name Enum type name.
 */
/**
 * @typedef GenerateConfigReportResponse
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} serviceName Name of the service this report belongs to.
* @property {string} id ID of the service configuration this report belongs to.
* @property {servicemanagement(v1).ChangeReport[]} changeReports list of ChangeReport, each corresponding to comparison between two
service configurations.
* @property {servicemanagement(v1).Diagnostic[]} diagnostics Errors / Linter warnings associated with the service definition this
report
belongs to.
*/
/**
 * @typedef DeleteServiceStrategy
 * @memberOf! servicemanagement(v1)
 * @type object
 */
/**
 * @typedef OperationMetadata
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).Step[]} steps Detailed status information for each step. The order is undetermined.
* @property {string} startTime The start time of the operation.
* @property {string[]} resourceNames The full name of the resources that this operation is directly
associated with.
* @property {integer} progressPercentage Percentage of completion of this operation, ranging from 0 to 100.
*/
/**
 * @typedef DisableServiceRequest
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} consumerId The identity of consumer resource which service disablement will be
applied to.

The Google Service Management implementation accepts the following
forms:
- &quot;project:&lt;project_id&gt;&quot;

Note: this is made compatible with
google.api.servicecontrol.v1.Operation.consumer_id.
*/
/**
 * @typedef CustomHttpPattern
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} path The path matched by this custom verb.
 * @property {string} kind The name of this custom HTTP verb.
 */
/**
 * @typedef LogDescriptor
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).LabelDescriptor[]} labels The set of labels that are available to describe a specific log entry.
Runtime requests that contain labels not specified here are
considered invalid.
* @property {string} description A human-readable description of this log. This information appears in
the documentation and can contain details.
* @property {string} displayName The human-readable name for this log. This information appears on
the user interface and should be concise.
* @property {string} name The name of the log. It must be less than 512 characters long and can
include the following characters: upper- and lower-case alphanumeric
characters [A-Za-z0-9], and punctuation characters including
slash, underscore, hyphen, period [/_-.].
*/
/**
 * @typedef MonitoringDestination
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} monitoredResource The monitored resource type. The type must be defined in
Service.monitored_resources section.
* @property {string[]} metrics Names of the metrics to report to this monitoring destination.
Each name must be defined in Service.metrics section.
*/
/**
 * @typedef Field
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} defaultValue The string value of the default value of this field. Proto2 syntax only.
* @property {string} jsonName The field JSON name.
* @property {servicemanagement(v1).Option[]} options The protocol buffer options.
* @property {integer} oneofIndex The index of the field type in `Type.oneofs`, for message or enumeration
types. The first type has index 1; zero means the type is not in the list.
* @property {string} cardinality The field cardinality.
* @property {string} typeUrl The field type URL, without the scheme, for message or enumeration
types. Example: `&quot;type.googleapis.com/google.protobuf.Timestamp&quot;`.
* @property {string} name The field name.
* @property {boolean} packed Whether to use alternative packed wire representation.
* @property {integer} number The field number.
* @property {string} kind The field type.
*/
/**
 * @typedef Binding
 * @memberOf! servicemanagement(v1)
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
 * @typedef ConfigRef
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} name Resource name of a service config. It must have the following
format: &quot;services/{service name}/configs/{config id}&quot;.
*/
/**
 * @typedef DataAccessOptions
 * @memberOf! servicemanagement(v1)
 * @type object
 */
/**
 * @typedef AuthProvider
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} audiences The list of JWT
[audiences](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.3).
that are allowed to access. A JWT containing any of these audiences will
be accepted. When this setting is absent, only JWTs with audience
&quot;https://Service_name/API_name&quot;
will be accepted. For example, if no audiences are in the setting,
LibraryService API will only accept JWTs with the following audience
&quot;https://library-example.googleapis.com/google.example.library.v1.LibraryService&quot;.

Example:

    audiences: bookstore_android.apps.googleusercontent.com,
               bookstore_web.apps.googleusercontent.com
* @property {string} jwksUri URL of the provider&#39;s public key set to validate signature of the JWT. See
[OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata).
Optional if the key set document:
 - can be retrieved from
   [OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html
   of the issuer.
 - can be inferred from the email domain of the issuer (e.g. a Google service account).

Example: https://www.googleapis.com/oauth2/v1/certs
* @property {string} id The unique identifier of the auth provider. It will be referred to by
`AuthRequirement.provider_id`.

Example: &quot;bookstore_auth&quot;.
* @property {string} issuer Identifies the principal that issued the JWT. See
https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.1
Usually a URL or an email address.

Example: https://securetoken.google.com
Example: 1234567-compute@developer.gserviceaccount.com
*/
/**
 * @typedef VisibilityRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} restriction A comma-separated list of visibility labels that apply to the `selector`.
Any of the listed labels can be used to grant the visibility.

If a rule has multiple labels, removing one of the labels but not all of
them can break clients.

Example:

    visibility:
      rules:
      - selector: google.calendar.Calendar.EnhancedSearch
        restriction: GOOGLE_INTERNAL, TRUSTED_TESTER

Removing GOOGLE_INTERNAL from this restriction will break clients that
rely on this method and only had access to it through GOOGLE_INTERNAL.
* @property {string} selector Selects methods, messages, fields, enums, etc. to which this rule applies.

Refer to selector for syntax details.
*/
/**
 * @typedef AuditLogConfig
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} logType The log type that this config enables.
* @property {string[]} exemptedMembers Specifies the identities that are exempted from this type of logging
Follows the same format of Binding.members.
*/
/**
 * @typedef UndeleteServiceResponse
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {servicemanagement(v1).ManagedService} service Revived service resource.
 */
/**
 * @typedef UsageRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {boolean} allowUnregisteredCalls True, if the method allows unregistered calls; false otherwise.
* @property {string} selector Selects the methods to which this rule applies. Use &#39;*&#39; to indicate all
methods in all APIs.

Refer to selector for syntax details.
*/
/**
 * @typedef EnumValue
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {servicemanagement(v1).Option[]} options Protocol buffer options.
 * @property {string} name Enum value name.
 * @property {integer} number Enum value number.
 */
/**
 * @typedef MediaUpload
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {boolean} enabled Whether upload is enabled.
 */
/**
 * @typedef BackendRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} address The address of the API backend.
* @property {number} deadline The number of seconds to wait for a response from a request.  The
default depends on the deployment context.
* @property {string} selector Selects the methods to which this rule applies.

Refer to selector for syntax details.
*/
/**
 * @typedef ContextRule
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string[]} provided A list of full type names of provided contexts.
* @property {string} selector Selects the methods to which this rule applies.

Refer to selector for syntax details.
* @property {string[]} requested A list of full type names of requested contexts.
*/
/**
 * @typedef Http
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).HttpRule[]} rules A list of HTTP configuration rules that apply to individual API methods.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef Visibility
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).VisibilityRule[]} rules A list of visibility rules that apply to individual API elements.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef ConfigChange
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} newValue Value of the changed object in the new Service configuration,
in JSON format. This field will not be populated if ChangeType == REMOVED.
* @property {string} oldValue Value of the changed object in the old Service configuration,
in JSON format. This field will not be populated if ChangeType == ADDED.
* @property {string} element Object hierarchy path to the change, with levels separated by a &#39;.&#39;
character. For repeated fields, an applicable unique identifier field is
used for the index (usually selector, name, or id). For maps, the term
&#39;key&#39; is used. If the field has no unique identifier, the numeric index
is used.
Examples:
- visibility.rules[selector==&quot;google.LibraryService.CreateBook&quot;].restriction
- quota.metric_rules[selector==&quot;google&quot;].metric_costs[key==&quot;reads&quot;].value
- logging.producer_destinations[0]
* @property {string} changeType The type for this change, either ADDED, REMOVED, or MODIFIED.
* @property {servicemanagement(v1).Advice[]} advices Collection of advice provided for this change, useful for determining the
possible impact of this change.
*/
/**
 * @typedef SystemParameters
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {servicemanagement(v1).SystemParameterRule[]} rules Define system parameters.

The parameters defined here will override the default parameters
implemented by the system. If this field is missing from the service
config, default system parameters will be used. Default system parameters
and names is implementation-dependent.

Example: define api key for all methods

    system_parameters
      rules:
        - selector: &quot;*&quot;
          parameters:
            - name: api_key
              url_query_parameter: api_key


Example: define 2 api key names for a specific method.

    system_parameters
      rules:
        - selector: &quot;/ListShelves&quot;
          parameters:
            - name: api_key
              http_header: Api-Key1
            - name: api_key
              http_header: Api-Key2

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef LabelDescriptor
 * @memberOf! servicemanagement(v1)
 * @type object
 * @property {string} description A human-readable description for the label.
 * @property {string} valueType The type of data that can be assigned to the label.
 * @property {string} key The label key.
 */
/**
 * @typedef Usage
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} producerNotificationChannel The full resource name of a channel used for sending notifications to the
service producer.

Google Service Management currently only supports
[Google Cloud Pub/Sub](https://cloud.google.com/pubsub) as a notification
channel. To use Google Cloud Pub/Sub as the channel, this must be the name
of a Cloud Pub/Sub topic that uses the Cloud Pub/Sub topic name format
documented in https://cloud.google.com/pubsub/docs/overview.
* @property {string[]} requirements Requirements that must be satisfied before a consumer project can use the
service. Each requirement is of the form &lt;service.name&gt;/&lt;requirement-id&gt;;
for example &#39;serviceusage.googleapis.com/billing-enabled&#39;.
* @property {servicemanagement(v1).UsageRule[]} rules A list of usage rules that apply to individual API methods.

**NOTE:** All service configuration rules follow &quot;last one wins&quot; order.
*/
/**
 * @typedef Advice
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} description Useful description for why this advice was applied and what actions should
be taken to mitigate any implied risks.
*/
/**
 * @typedef CloudAuditOptions
 * @memberOf! servicemanagement(v1)
 * @type object
 */
/**
 * @typedef AuthRequirement
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} audiences NOTE: This will be deprecated soon, once AuthProvider.audiences is
implemented and accepted in all the runtime components.

The list of JWT
[audiences](https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32#section-4.1.3).
that are allowed to access. A JWT containing any of these audiences will
be accepted. When this setting is absent, only JWTs with audience
&quot;https://Service_name/API_name&quot;
will be accepted. For example, if no audiences are in the setting,
LibraryService API will only accept JWTs with the following audience
&quot;https://library-example.googleapis.com/google.example.library.v1.LibraryService&quot;.

Example:

    audiences: bookstore_android.apps.googleusercontent.com,
               bookstore_web.apps.googleusercontent.com
* @property {string} providerId id from authentication provider.

Example:

    provider_id: bookstore_auth
*/
/**
 * @typedef Control
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} environment The service control environment to use. If empty, no control plane
feature (like quota and billing) will be enabled.
*/
/**
 * @typedef SourceContext
 * @memberOf! servicemanagement(v1)
 * @type object
* @property {string} fileName The path-qualified name of the .proto file that contained the associated
protobuf element.  For example: `&quot;google/protobuf/source_context.proto&quot;`.
*/
module.exports = Servicemanagement;
