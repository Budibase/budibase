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
 * Stackdriver Logging API
 *
 * Writes log entries and manages your Stackdriver Logging configuration.
 *
 * @example
 * var google = require('googleapis');
 * var logging = google.logging('v2beta1');
 *
 * @namespace logging
 * @type {Function}
 * @version v2beta1
 * @variation v2beta1
 * @param {object=} options Options for Logging
 */
function Logging(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    metrics: {

      /**
       * logging.projects.metrics.update
       *
       * @desc Creates or updates a logs-based metric.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * The resource name of the metric to update.
       *     //   Example: `"projects/my-project-id/metrics/my-metric-id"`.
       *     //   The updated metric must be provided in the request and have the
       *     //   same identifier that is specified in `metricName`.
       *     //   If the metric does not exist, it is created.
       *     metricName: "projects/{MY-PROJECT}/metrics/{MY-METRIC}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.metrics.update(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.metrics.update
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.metricName The resource name of the metric to update: "projects/[PROJECT_ID]/metrics/[METRIC_ID]" The updated metric must be provided in the request and it's name field must be the same as [METRIC_ID] If the metric does not exist in [PROJECT_ID], then a new metric is created.
       * @param {logging(v2beta1).LogMetric} params.resource Request body data
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
            url: 'https://logging.googleapis.com/v2beta1/{metricName}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['metricName'],
          pathParams: ['metricName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * logging.projects.metrics.get
       *
       * @desc Gets a logs-based metric.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * The resource name of the desired metric.
       *     //   Example: `"projects/my-project-id/metrics/my-metric-id"`.
       *     metricName: "projects/{MY-PROJECT}/metrics/{MY-METRIC}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.metrics.get(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.metrics.get
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.metricName The resource name of the desired metric: "projects/[PROJECT_ID]/metrics/[METRIC_ID]" 
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
            url: 'https://logging.googleapis.com/v2beta1/{metricName}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['metricName'],
          pathParams: ['metricName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * logging.projects.metrics.create
       *
       * @desc Creates a logs-based metric.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * The resource name of the project in which to create the metric.
       *     //   Example: `"projects/my-project-id"`.
       *     //   The new metric must be provided in the request.
       *     parent: "projects/{MY-PROJECT}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.metrics.create(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.metrics.create
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.parent The resource name of the project in which to create the metric: "projects/[PROJECT_ID]" The new metric must be provided in the request.
       * @param {logging(v2beta1).LogMetric} params.resource Request body data
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/metrics',
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
       * logging.projects.metrics.list
       *
       * @desc Lists logs-based metrics.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name containing the metrics.
       *     //   Example: `"projects/my-project-id"`.
       *     parent: "projects/{MY-PROJECT}",
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
       *         logging.projects.metrics.list(request, recur);
       *       }
       *     }
       *   };
       *
       *   logging.projects.metrics.list(request, recur);
       * });
       *
       * @alias logging.projects.metrics.list
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
       * @param {string} params.parent Required. The name of the project containing the metrics: "projects/[PROJECT_ID]" 
       * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/metrics',
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
       * logging.projects.metrics.delete
       *
       * @desc Deletes a logs-based metric.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * The resource name of the metric to delete.
       *     //   Example: `"projects/my-project-id/metrics/my-metric-id"`.
       *     metricName: "projects/{MY-PROJECT}/metrics/{MY-METRIC}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.metrics.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.metrics.delete
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.metricName The resource name of the metric to delete: "projects/[PROJECT_ID]/metrics/[METRIC_ID]" 
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
            url: 'https://logging.googleapis.com/v2beta1/{metricName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['metricName'],
          pathParams: ['metricName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    logs: {

      /**
       * logging.projects.logs.list
       *
       * @desc Lists the logs in projects or organizations. Only logs that have entries are listed.
       *
       * @alias logging.projects.logs.list
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
       * @param {string} params.parent Required. The resource name that owns the logs: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" 
       * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/logs',
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
       * logging.projects.logs.delete
       *
       * @desc Deletes all the log entries in a log. The log reappears if it receives new entries.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the log to delete.  Example:
       *     //   `"projects/my-project/logs/syslog"`.
       *     logName: "projects/{MY-PROJECT}/logs/{MY-LOG}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.logs.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.logs.delete
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.logName Required. The resource name of the log to delete: "projects/[PROJECT_ID]/logs/[LOG_ID]" "organizations/[ORGANIZATION_ID]/logs/[LOG_ID]" [LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity". For more information about log names, see LogEntry.
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
            url: 'https://logging.googleapis.com/v2beta1/{logName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['logName'],
          pathParams: ['logName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    sinks: {

      /**
       * logging.projects.sinks.update
       *
       * @desc Updates a sink. If the named sink doesn't exist, then this method is identical to sinks.create. If the named sink does exist, then this method replaces the following fields in the existing sink with values from the new sink: destination, filter, output_version_format, start_time, and end_time. The updated filter might also have a new writer_identity; see the unique_writer_identity field.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the sink to update, including the parent
       *     //   resource and the sink identifier.  If the sink does not exist, this method
       *     //   creates the sink.  Example: `"projects/my-project-id/sinks/my-sink-id"`.
       *     sinkName: "projects/{MY-PROJECT}/sinks/{MY-SINK}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.sinks.update(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.sinks.update
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.sinkName Required. The full resource name of the sink to update, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" Example: "projects/my-project-id/sinks/my-sink-id".
       * @param {boolean=} params.uniqueWriterIdentity Optional. See sinks.create for a description of this field. When updating a sink, the effect of this field on the value of writer_identity in the updated sink depends on both the old and new values of this field: If the old and new values of this field are both false or both true, then there is no change to the sink's writer_identity. If the old value was false and the new value is true, then writer_identity is changed to a unique service account. It is an error if the old value was true and the new value is false.
       * @param {logging(v2beta1).LogSink} params.resource Request body data
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
            url: 'https://logging.googleapis.com/v2beta1/{sinkName}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['sinkName'],
          pathParams: ['sinkName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * logging.projects.sinks.get
       *
       * @desc Gets a sink.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the sink to return.
       *     //   Example: `"projects/my-project-id/sinks/my-sink-id"`.
       *     sinkName: "projects/{MY-PROJECT}/sinks/{MY-SINK}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.sinks.get(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.sinks.get
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.sinkName Required. The parent resource name of the sink: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" Example: "projects/my-project-id/sinks/my-sink-id".
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
            url: 'https://logging.googleapis.com/v2beta1/{sinkName}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['sinkName'],
          pathParams: ['sinkName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * logging.projects.sinks.create
       *
       * @desc Creates a sink that exports specified log entries to a destination. The export of newly-ingested log entries begins immediately, unless the current time is outside the sink's start and end times or the sink's writer_identity is not permitted to write to the destination. A sink can export log entries only from the resource owning the sink.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource in which to create the sink.
       *     //   Example: `"projects/my-project-id"`.
       *     //   The new sink must be provided in the request.
       *     parent: "projects/{MY-PROJECT}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.sinks.create(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.sinks.create
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.uniqueWriterIdentity Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is cloud-logs@google.com, the same identity used before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a unique service account used only for exports from the new sink. For more information, see writer_identity in LogSink.
       * @param {string} params.parent Required. The resource in which to create the sink: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" Examples: "projects/my-logging-project", "organizations/123456789".
       * @param {logging(v2beta1).LogSink} params.resource Request body data
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/sinks',
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
       * logging.projects.sinks.list
       *
       * @desc Lists sinks.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The cloud resource containing the sinks.
       *     //   Example: `"projects/my-logging-project"`.
       *     parent: "projects/{MY-PROJECT}",
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
       *         logging.projects.sinks.list(request, recur);
       *       }
       *     }
       *   };
       *
       *   logging.projects.sinks.list(request, recur);
       * });
       *
       * @alias logging.projects.sinks.list
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
       * @param {string} params.parent Required. The parent resource whose sinks are to be listed. Examples: "projects/my-logging-project", "organizations/123456789".
       * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/sinks',
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
       * logging.projects.sinks.delete
       *
       * @desc Deletes a sink. If the sink has a unique writer_identity, then that service account is also deleted.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the sink to delete, including the parent
       *     //   resource and the sink identifier.  Example:
       *     //   `"projects/my-project-id/sinks/my-sink-id"`.  It is an error if the sink
       *     //   does not exist.
       *     sinkName: "projects/{MY-PROJECT}/sinks/{MY-SINK}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.projects.sinks.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.projects.sinks.delete
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.sinkName Required. The full resource name of the sink to delete, including the parent resource and the sink identifier: "projects/[PROJECT_ID]/sinks/[SINK_ID]" "organizations/[ORGANIZATION_ID]/sinks/[SINK_ID]" It is an error if the sink does not exist. Example: "projects/my-project-id/sinks/my-sink-id". It is an error if the sink does not exist.
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
            url: 'https://logging.googleapis.com/v2beta1/{sinkName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['sinkName'],
          pathParams: ['sinkName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.organizations = {

    logs: {

      /**
       * logging.organizations.logs.list
       *
       * @desc Lists the logs in projects or organizations. Only logs that have entries are listed.
       *
       * @alias logging.organizations.logs.list
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
       * @param {string} params.parent Required. The resource name that owns the logs: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" 
       * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/logs',
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
       * logging.organizations.logs.delete
       *
       * @desc Deletes all the log entries in a log. The log reappears if it receives new entries.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the log to delete.  Example:
       *     //   `"projects/my-project/logs/syslog"`.
       *     logName: "organizations/{MY-ORGANIZATION}/logs/{MY-LOG}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.organizations.logs.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.organizations.logs.delete
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.logName Required. The resource name of the log to delete: "projects/[PROJECT_ID]/logs/[LOG_ID]" "organizations/[ORGANIZATION_ID]/logs/[LOG_ID]" [LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity". For more information about log names, see LogEntry.
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
            url: 'https://logging.googleapis.com/v2beta1/{logName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['logName'],
          pathParams: ['logName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.entries = {

    /**
     * logging.entries.write
     *
     * @desc Writes log entries to Stackdriver Logging. All log entries are written by this method.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Logging API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/logging
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var logging = google.logging('v2beta1');
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
     *     // TODO: Change placeholders below to appropriate parameter values for the 'write' method:
     *
     *     resource: {},
     *
     *     // Auth client
     *     auth: authClient
     *   };
     *
     *   logging.entries.write(request, function(err, result) {
     *     if (err) {
     *       console.log(err);
     *     } else {
     *       console.log(result);
     *     }
     *   });
     * });
     *
     * @alias logging.entries.write
     * @memberOf! logging(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {logging(v2beta1).WriteLogEntriesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    write: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://logging.googleapis.com/v2beta1/entries:write',
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
     * logging.entries.list
     *
     * @desc Lists log entries. Use this method to retrieve log entries from Stackdriver Logging. For ways to export log entries, see Exporting Logs.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Logging API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/logging
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var logging = google.logging('v2beta1');
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
     *     resource: {},
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
     *         logging.entries.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   logging.entries.list(request, recur);
     * });
     *
     * @alias logging.entries.list
     * @memberOf! logging(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {logging(v2beta1).ListLogEntriesRequest} params.resource Request body data
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
          url: 'https://logging.googleapis.com/v2beta1/entries:list',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.monitoredResourceDescriptors = {

    /**
     * logging.monitoredResourceDescriptors.list
     *
     * @desc Lists the descriptors for monitored resource types used by Stackdriver Logging.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Cloud Logging API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/logging
     * // 2. This sample uses Application Default Credentials for authentication.
     * //    If not already done, install the gcloud CLI from
     * //    https://cloud.google.com/sdk/ and run
     * //    'gcloud beta auth application-default login'
     * // 3. Install the Node.js client library and Application Default Credentials
     * //    library by running 'npm install googleapis --save'
     * var google = require('googleapis');
     * var logging = google.logging('v2beta1');
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
     *         logging.monitoredResourceDescriptors.list(request, recur);
     *       }
     *     }
     *   };
     *
     *   logging.monitoredResourceDescriptors.list(request, recur);
     * });
     *
     * @alias logging.monitoredResourceDescriptors.list
     * @memberOf! logging(v2beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
     * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
          url: 'https://logging.googleapis.com/v2beta1/monitoredResourceDescriptors',
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

  self.billingAccounts = {

    logs: {

      /**
       * logging.billingAccounts.logs.list
       *
       * @desc Lists the logs in projects or organizations. Only logs that have entries are listed.
       *
       * @alias logging.billingAccounts.logs.list
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
       * @param {string} params.parent Required. The resource name that owns the logs: "projects/[PROJECT_ID]" "organizations/[ORGANIZATION_ID]" 
       * @param {string=} params.pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
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
            url: 'https://logging.googleapis.com/v2beta1/{parent}/logs',
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
       * logging.billingAccounts.logs.delete
       *
       * @desc Deletes all the log entries in a log. The log reappears if it receives new entries.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Logging API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/logging
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var logging = google.logging('v2beta1');
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
       *     // * Required. The resource name of the log to delete.  Example:
       *     //   `"projects/my-project/logs/syslog"`.
       *     logName: "billingAccounts/{MY-BILLINGACCOUNT}/logs/{MY-LOG}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   logging.billingAccounts.logs.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias logging.billingAccounts.logs.delete
       * @memberOf! logging(v2beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.logName Required. The resource name of the log to delete: "projects/[PROJECT_ID]/logs/[LOG_ID]" "organizations/[ORGANIZATION_ID]/logs/[LOG_ID]" [LOG_ID] must be URL-encoded. For example, "projects/my-project-id/logs/syslog", "organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity". For more information about log names, see LogEntry.
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
            url: 'https://logging.googleapis.com/v2beta1/{logName}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['logName'],
          pathParams: ['logName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef ListLogEntriesResponse
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {logging(v2beta1).LogEntry[]} entries A list of log entries.
 * @property {string} nextPageToken If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.If a value for next_page_token appears and the entries field is empty, it means that the search found no log entries so far but it did not have time to search all the possible log entries. Retry the method with this value for page_token to continue the search. Alternatively, consider speeding up the search by changing your filter to specify a single log name or resource type, or to narrow the time range of the search.
 */
/**
 * @typedef ListSinksResponse
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} nextPageToken If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call the same method again using the value of nextPageToken as pageToken.
 * @property {logging(v2beta1).LogSink[]} sinks A list of sinks.
 */
/**
 * @typedef SourceLocation
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} file Source file name. Depending on the runtime environment, this might be a simple name or a fully-qualified name.
 * @property {string} functionName Human-readable name of the function or method being invoked, with optional context such as the class or package name. This information is used in contexts such as the logs viewer, where a file and line number are less meaningful. The format can vary by language. For example: qual.if.ied.Class.method (Java), dir/package.func (Go), function (Python).
 * @property {string} line Line within the source file.
 */
/**
 * @typedef LogSink
 * @memberOf! logging(v2beta1)
 * @type object
* @property {string} destination Required. The export destination:
&quot;storage.googleapis.com/[GCS_BUCKET]&quot;
&quot;bigquery.googleapis.com/projects/[PROJECT_ID]/datasets/[DATASET]&quot;
&quot;pubsub.googleapis.com/projects/[PROJECT_ID]/topics/[TOPIC_ID]&quot;
The sink&#39;s writer_identity, set when the sink is created, must have permission to write to the destination or else the log entries are not exported. For more information, see Exporting Logs With Sinks.
* @property {string} filter Optional. An advanced logs filter. The only exported log entries are those that are in the resource owning the sink and that match the filter. The filter must use the log entry format specified by the output_version_format parameter. For example, in the v2 format:
logName=&quot;projects/[PROJECT_ID]/logs/[LOG_ID]&quot; AND severity&gt;=ERROR

* @property {string} endTime Optional. The time at which this sink will stop exporting log entries. Log entries are exported only if their timestamp is earlier than the end time. If this field is not supplied, there is no end time. If both a start time and an end time are provided, then the end time must be later than the start time.
* @property {string} name Required. The client-assigned sink identifier, unique within the project. Example: &quot;my-syslog-errors-to-pubsub&quot;. Sink identifiers are limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, and periods.
* @property {string} startTime Optional. The time at which this sink will begin exporting log entries. Log entries are exported only if their timestamp is not earlier than the start time. The default value of this field is the time the sink is created or updated.
* @property {string} outputVersionFormat Optional. The log entry format to use for this sink&#39;s exported log entries. The v2 format is used by default. The v1 format is deprecated and should be used only as part of a migration effort to v2. See Migration to the v2 API.
* @property {string} writerIdentity Output only. An IAM identity&amp;mdash;a service account or group&amp;mdash;under which Stackdriver Logging writes the exported log entries to the sink&#39;s destination. This field is set by sinks.create and sinks.update, based on the setting of unique_writer_identity in those methods.Until you grant this identity write-access to the destination, log entry exports from this sink will fail. For more information, see Granting access for a resource. Consult the destination service&#39;s documentation to determine the appropriate IAM roles to assign to the identity.
*/
/**
 * @typedef ListLogsResponse
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string[]} logNames A list of log names. For example, &quot;projects/my-project/syslog&quot; or &quot;organizations/123/cloudresourcemanager.googleapis.com%2Factivity&quot;.
 * @property {string} nextPageToken If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
 */
/**
 * @typedef LogMetric
 * @memberOf! logging(v2beta1)
 * @type object
* @property {string} description Optional. A description of this metric, which is used in documentation.
* @property {string} filter Required. An advanced logs filter which is used to match log entries. Example:
&quot;resource.type=gae_app AND severity&gt;=ERROR&quot;
The maximum length of the filter is 20000 characters.
* @property {string} name Required. The client-assigned metric identifier. Examples: &quot;error_count&quot;, &quot;nginx/requests&quot;.Metric identifiers are limited to 100 characters and can include only the following characters: A-Z, a-z, 0-9, and the special characters _-.,+!*&#39;,()%/. The forward-slash character (/) denotes a hierarchy of name pieces, and it cannot be the first character of the name.The metric identifier in this field must not be URL-encoded (https://en.wikipedia.org/wiki/Percent-encoding). However, when the metric identifier appears as the [METRIC_ID] part of a metric_name API parameter, then the metric identifier must be URL-encoded. Example: &quot;projects/my-project/metrics/nginx%2Frequests&quot;.
* @property {string} version Output only. The API version that created or updated this metric. The version also dictates the syntax of the filter expression. When a value for this field is missing, the default value of V2 should be assumed.
*/
/**
 * @typedef LogEntry
 * @memberOf! logging(v2beta1)
 * @type object
* @property {string} textPayload The log entry payload, represented as a Unicode string (UTF-8).
* @property {logging(v2beta1).HttpRequest} httpRequest Optional. Information about the HTTP request associated with this log entry, if applicable.
* @property {logging(v2beta1).LogEntrySourceLocation} sourceLocation Optional. Source code location information associated with the log entry, if any.
* @property {object} jsonPayload The log entry payload, represented as a structure that is expressed as a JSON object.
* @property {object} labels Optional. A set of user-defined (key, value) data that provides additional information about the log entry.
* @property {string} trace Optional. Resource name of the trace associated with the log entry, if any. If it contains a relative resource name, the name is assumed to be relative to //tracing.googleapis.com. Example: projects/my-projectid/traces/06796866738c859f2f19b7cfb3214824
* @property {string} logName Required. The resource name of the log to which this log entry belongs:
&quot;projects/[PROJECT_ID]/logs/[LOG_ID]&quot;
&quot;organizations/[ORGANIZATION_ID]/logs/[LOG_ID]&quot;
[LOG_ID] must be URL-encoded within log_name. Example: &quot;organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity&quot;. [LOG_ID] must be less than 512 characters long and can only include the following characters: upper and lower case alphanumeric characters, forward-slash, underscore, hyphen, and period.For backward compatibility, if log_name begins with a forward-slash, such as /projects/..., then the log entry is ingested as usual but the forward-slash is removed. Listing the log entry will not show the leading slash and filtering for a log name with a leading slash will never return any results.
* @property {string} severity Optional. The severity of the log entry. The default value is LogSeverity.DEFAULT.
* @property {logging(v2beta1).MonitoredResource} resource Required. The monitored resource associated with this log entry. Example: a log entry that reports a database error would be associated with the monitored resource designating the particular database that reported the error.
* @property {object} protoPayload The log entry payload, represented as a protocol buffer. Some Google Cloud Platform services use this field for their log entry payloads.
* @property {string} timestamp Optional. The time the event described by the log entry occurred. If omitted, Stackdriver Logging will use the time the log entry is received.
* @property {string} insertId Optional. A unique ID for the log entry. If you provide this field, the logging service considers other log entries in the same project with the same ID as duplicates which can be removed. If omitted, Stackdriver Logging will generate a unique ID for this log entry.
* @property {logging(v2beta1).LogEntryOperation} operation Optional. Information about an operation associated with the log entry, if applicable.
*/
/**
 * @typedef LogLine
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} time Approximate time when this log entry was made.
 * @property {string} severity Severity of this log entry.
 * @property {logging(v2beta1).SourceLocation} sourceLocation Where in the source code this log message was written.
 * @property {string} logMessage App-provided log message.
 */
/**
 * @typedef SourceReference
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} repository Optional. A URI string identifying the repository. Example: &quot;https://github.com/GoogleCloudPlatform/kubernetes.git&quot;
 * @property {string} revisionId The canonical and persistent identifier of the deployed revision. Example (git): &quot;0035781c50ec7aa23385dc841529ce8a4b70db1b&quot;
 */
/**
 * @typedef MonitoredResource
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {object} labels Required. Values for all of the labels listed in the associated monitored resource descriptor. For example, Cloud SQL databases use the labels &quot;database_id&quot; and &quot;zone&quot;.
 * @property {string} type Required. The monitored resource type. This field must match the type field of a MonitoredResourceDescriptor object. For example, the type of a Cloud SQL database is &quot;cloudsql_database&quot;.
 */
/**
 * @typedef WriteLogEntriesRequest
 * @memberOf! logging(v2beta1)
 * @type object
* @property {object} labels Optional. Default labels that are added to the labels field of all log entries in entries. If a log entry already has a label with the same key as a label in this parameter, then the log entry&#39;s label is not changed. See LogEntry.
* @property {logging(v2beta1).LogEntry[]} entries Required. The log entries to write. Values supplied for the fields log_name, resource, and labels in this entries.write request are added to those log entries that do not provide their own values for the fields.To improve throughput and to avoid exceeding the quota limit for calls to entries.write, you should write multiple log entries at once rather than calling this method for each individual log entry.
* @property {string} logName Optional. A default log resource name that is assigned to all log entries in entries that do not specify a value for log_name:
&quot;projects/[PROJECT_ID]/logs/[LOG_ID]&quot;
&quot;organizations/[ORGANIZATION_ID]/logs/[LOG_ID]&quot;
[LOG_ID] must be URL-encoded. For example, &quot;projects/my-project-id/logs/syslog&quot; or &quot;organizations/1234567890/logs/cloudresourcemanager.googleapis.com%2Factivity&quot;. For more information about log names, see LogEntry.
* @property {boolean} partialSuccess Optional. Whether valid entries should be written even if some other entries fail due to INVALID_ARGUMENT or PERMISSION_DENIED errors. If any entry is not written, the response status will be the error associated with one of the failed entries and include error details in the form of WriteLogEntriesPartialErrors.
* @property {logging(v2beta1).MonitoredResource} resource Optional. A default monitored resource object that is assigned to all log entries in entries that do not specify a value for resource. Example:
{ &quot;type&quot;: &quot;gce_instance&quot;,
  &quot;labels&quot;: {
    &quot;zone&quot;: &quot;us-central1-a&quot;, &quot;instance_id&quot;: &quot;00000000000000000000&quot; }}
See LogEntry.
*/
/**
 * @typedef LabelDescriptor
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} description A human-readable description for the label.
 * @property {string} valueType The type of data that can be assigned to the label.
 * @property {string} key The label key.
 */
/**
 * @typedef ListLogMetricsResponse
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {logging(v2beta1).LogMetric[]} metrics A list of logs-based metrics.
 * @property {string} nextPageToken If there might be more results than appear in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
 */
/**
 * @typedef MonitoredResourceDescriptor
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} displayName Optional. A concise name for the monitored resource type that might be displayed in user interfaces. It should be a Title Cased Noun Phrase, without any article or other determiners. For example, &quot;Google Cloud SQL Database&quot;.
 * @property {string} description Optional. A detailed description of the monitored resource type that might be used in documentation.
 * @property {logging(v2beta1).LabelDescriptor[]} labels Required. A set of labels used to describe instances of this monitored resource type. For example, an individual Google Cloud SQL database is identified by values for the labels &quot;database_id&quot; and &quot;zone&quot;.
 * @property {string} type Required. The monitored resource type. For example, the type &quot;cloudsql_database&quot; represents databases in Google Cloud SQL. The maximum length of this value is 256 characters.
 * @property {string} name Optional. The resource name of the monitored resource descriptor: &quot;projects/{project_id}/monitoredResourceDescriptors/{type}&quot; where {type} is the value of the type field in this object and {project_id} is a project ID that provides API-specific context for accessing the type. APIs that do not use project information can use the resource name format &quot;monitoredResourceDescriptors/{type}&quot;.
 */
/**
 * @typedef ListMonitoredResourceDescriptorsResponse
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} nextPageToken If there might be more results than those appearing in this response, then nextPageToken is included. To get the next set of results, call this method again using the value of nextPageToken as pageToken.
 * @property {logging(v2beta1).MonitoredResourceDescriptor[]} resourceDescriptors A list of resource descriptors.
 */
/**
 * @typedef LogEntryOperation
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} producer Optional. An arbitrary producer identifier. The combination of id and producer must be globally unique. Examples for producer: &quot;MyDivision.MyBigCompany.com&quot;, &quot;github.com/MyProject/MyApplication&quot;.
 * @property {boolean} last Optional. Set this to True if this is the last log entry in the operation.
 * @property {boolean} first Optional. Set this to True if this is the first log entry in the operation.
 * @property {string} id Optional. An arbitrary operation identifier. Log entries with the same identifier are assumed to be part of the same operation.
 */
/**
 * @typedef Empty
 * @memberOf! logging(v2beta1)
 * @type object
 */
/**
 * @typedef HttpRequest
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {boolean} cacheLookup Whether or not a cache lookup was attempted.
 * @property {string} responseSize The size of the HTTP response message sent back to the client, in bytes, including the response headers and the response body.
 * @property {integer} status The response code indicating the status of response. Examples: 200, 404.
 * @property {boolean} cacheValidatedWithOriginServer Whether or not the response was validated with the origin server before being served from cache. This field is only meaningful if cache_hit is True.
 * @property {string} referer The referer URL of the request, as defined in HTTP/1.1 Header Field Definitions (http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).
 * @property {boolean} cacheHit Whether or not an entity was served from cache (with or without validation).
 * @property {string} requestUrl The scheme (http, https), the host name, the path and the query portion of the URL that was requested. Example: &quot;http://example.com/some/info?color=red&quot;.
 * @property {string} latency The request processing latency on the server, from the time the request was received until the response was sent.
 * @property {string} cacheFillBytes The number of HTTP response bytes inserted into cache. Set only when a cache fill was attempted.
 * @property {string} requestMethod The request method. Examples: &quot;GET&quot;, &quot;HEAD&quot;, &quot;PUT&quot;, &quot;POST&quot;.
 * @property {string} remoteIp The IP address (IPv4 or IPv6) of the client that issued the HTTP request. Examples: &quot;192.168.1.1&quot;, &quot;FE80::0202:B3FF:FE1E:8329&quot;.
 * @property {string} serverIp The IP address (IPv4 or IPv6) of the origin server that the request was sent to.
 * @property {string} userAgent The user agent sent by the client. Example: &quot;Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; Q312461; .NET CLR 1.0.3705)&quot;.
 * @property {string} requestSize The size of the HTTP request message in bytes, including the request headers and the request body.
 */
/**
 * @typedef LogEntrySourceLocation
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} function Optional. Human-readable name of the function or method being invoked, with optional context such as the class or package name. This information may be used in contexts such as the logs viewer, where a file and line number are less meaningful. The format can vary by language. For example: qual.if.ied.Class.method (Java), dir/package.func (Go), function (Python).
 * @property {string} file Optional. Source file name. Depending on the runtime environment, this might be a simple name or a fully-qualified name.
 * @property {string} line Optional. Line within the source file. 1-based; 0 indicates no line number available.
 */
/**
 * @typedef RequestLog
 * @memberOf! logging(v2beta1)
 * @type object
 * @property {string} responseSize Size in bytes sent back to client by request.
 * @property {string} requestId Globally unique identifier for a request, which is based on the request start time. Request IDs for requests which started later will compare greater as strings than those for requests which started earlier.
 * @property {boolean} first Whether this is the first RequestLog entry for this request. If an active request has several RequestLog entries written to Stackdriver Logging, then this field will be set for one of them.
 * @property {string} method Request method. Example: &quot;GET&quot;, &quot;HEAD&quot;, &quot;PUT&quot;, &quot;POST&quot;, &quot;DELETE&quot;.
 * @property {string} versionId Version of the application that handled this request.
 * @property {integer} status HTTP response status code. Example: 200, 404.
 * @property {boolean} wasLoadingRequest Whether this was a loading request for the instance.
 * @property {string} ip Origin IP address.
 * @property {string} nickname The logged-in user who made the request.Most likely, this is the part of the user&#39;s email before the @ sign. The field value is the same for different requests from the same user, but different users can have similar names. This information is also available to the application via the App Engine Users API.This field will be populated starting with App Engine 1.9.21.
 * @property {string} taskQueueName Queue name of the request, in the case of an offline request.
 * @property {string} pendingTime Time this request spent in the pending request queue.
 * @property {integer} instanceIndex If the instance processing this request belongs to a manually scaled module, then this is the 0-based index of the instance. Otherwise, this value is -1.
 * @property {logging(v2beta1).SourceReference[]} sourceReference Source code for the application that handled this request. There can be more than one source reference per deployed application if source code is distributed among multiple repositories.
 * @property {string} moduleId Module of the application that handled this request.
 * @property {string} host Internet host and port number of the resource being requested.
 * @property {string} latency Latency of the request.
 * @property {string} urlMapEntry File or class that handled the request.
 * @property {string} endTime Time when the request finished.
 * @property {logging(v2beta1).LogLine[]} line A list of log lines emitted by the application while serving this request.
 * @property {string} megaCycles Number of CPU megacycles used to process request.
 * @property {string} appId Application that handled this request.
 * @property {string} traceId Stackdriver Trace identifier for this request.
 * @property {string} taskName Task name of the request, in the case of an offline request.
 * @property {number} cost An indication of the relative cost of serving this request.
 * @property {string} instanceId An identifier for the instance that handled the request.
 * @property {string} startTime Time when the request started.
 * @property {string} appEngineRelease App Engine release version.
 * @property {string} resource Contains the path and query portion of the URL that was requested. For example, if the URL was &quot;http://example.com/app?name=val&quot;, the resource would be &quot;/app?name=val&quot;. The fragment identifier, which is identified by the # character, is not included.
 * @property {string} httpVersion HTTP version of request. Example: &quot;HTTP/1.1&quot;.
 * @property {string} referrer Referrer URL of request.
 * @property {string} userAgent User agent that made the request.
 * @property {boolean} finished Whether this request is finished or active.
 */
/**
 * @typedef WriteLogEntriesResponse
 * @memberOf! logging(v2beta1)
 * @type object
 */
/**
 * @typedef ListLogEntriesRequest
 * @memberOf! logging(v2beta1)
 * @type object
* @property {string} filter Optional. A filter that chooses which log entries to return. See Advanced Logs Filters. Only log entries that match the filter are returned. An empty filter matches all log entries in the resources listed in resource_names. Referencing a parent resource that is not listed in resource_names will cause the filter to return no results. The maximum length of the filter is 20000 characters.
* @property {string[]} projectIds Deprecated. Use resource_names instead. One or more project identifiers or project numbers from which to retrieve log entries. Example: &quot;my-project-1A&quot;. If present, these project identifiers are converted to resource name format and added to the list of resources in resource_names.
* @property {string[]} resourceNames Required. Names of one or more resources from which to retrieve log entries:
&quot;projects/[PROJECT_ID]&quot;
&quot;organizations/[ORGANIZATION_ID]&quot;
Projects listed in the project_ids field are added to this list.
* @property {integer} pageSize Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.
* @property {string} orderBy Optional. How the results should be sorted. Presently, the only permitted values are &quot;timestamp asc&quot; (default) and &quot;timestamp desc&quot;. The first option returns entries in order of increasing values of LogEntry.timestamp (oldest first), and the second option returns entries in order of decreasing timestamps (newest first). Entries with equal timestamps are returned in order of LogEntry.insertId.
* @property {string} pageToken Optional. If present, then retrieve the next batch of results from the preceding call to this method. pageToken must be the value of nextPageToken from the previous response. The values of other method parameters should be identical to those in the previous call.
*/
module.exports = Logging;
