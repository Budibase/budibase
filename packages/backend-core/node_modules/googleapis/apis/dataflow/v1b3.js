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
 * Google Dataflow API
 *
 * Develops and executes data processing patterns like ETL, batch computation, and continuous computation.
 *
 * @example
 * var google = require('googleapis');
 * var dataflow = google.dataflow('v1b3');
 *
 * @namespace dataflow
 * @type {Function}
 * @version v1b3
 * @variation v1b3
 * @param {object=} options Options for Dataflow
 */
function Dataflow(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * dataflow.projects.workerMessages
     *
     * @desc Send a worker_message to the service.
     *
     * @alias dataflow.projects.workerMessages
     * @memberOf! dataflow(v1b3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectId The project to send the WorkerMessages to.
     * @param {dataflow(v1b3).SendWorkerMessagesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    workerMessages: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/WorkerMessages',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: ['projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    jobs: {

      /**
       * dataflow.projects.jobs.create
       *
       * @desc Creates a dataflow job.
       *
       * @alias dataflow.projects.jobs.create
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId The project which owns the job.
       * @param {string=} params.view Level of information requested in response.
       * @param {string=} params.replaceJobId DEPRECATED. This field is now on the Job message.
       * @param {string=} params.location The location which contains this job.
       * @param {dataflow(v1b3).Job} params.resource Request body data
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
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs',
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
       * dataflow.projects.jobs.get
       *
       * @desc Gets the state of the specified dataflow job.
       *
       * @alias dataflow.projects.jobs.get
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId The project which owns the job.
       * @param {string} params.jobId Identifies a single job.
       * @param {string=} params.view Level of information requested in response.
       * @param {string=} params.location The location which contains this job.
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
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectId', 'jobId'],
          pathParams: ['projectId', 'jobId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * dataflow.projects.jobs.update
       *
       * @desc Updates the state of an existing dataflow job.
       *
       * @alias dataflow.projects.jobs.update
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId The project which owns the job.
       * @param {string} params.jobId Identifies a single job.
       * @param {string=} params.location The location which contains this job.
       * @param {dataflow(v1b3).Job} params.resource Request body data
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
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['projectId', 'jobId'],
          pathParams: ['projectId', 'jobId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * dataflow.projects.jobs.list
       *
       * @desc List the jobs of a project
       *
       * @alias dataflow.projects.jobs.list
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId The project which owns the jobs.
       * @param {string=} params.filter The kind of filter to use.
       * @param {string=} params.view Level of information requested in response. Default is SUMMARY.
       * @param {integer=} params.pageSize If there are many jobs, limit response to at most this many. The actual number of jobs returned will be the lesser of max_responses and an unspecified server-defined limit.
       * @param {string=} params.pageToken Set this to the 'next_page_token' field of a previous response to request additional results in a long list.
       * @param {string=} params.location The location which contains this job.
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
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs',
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
       * dataflow.projects.jobs.getMetrics
       *
       * @desc Request the job status.
       *
       * @alias dataflow.projects.jobs.getMetrics
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId A project id.
       * @param {string} params.jobId The job to get messages for.
       * @param {string=} params.startTime Return only metric data that has changed since this time. Default is to return all information about all metrics for the job.
       * @param {string=} params.location The location which contains the job specified by job_id.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getMetrics: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/metrics',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectId', 'jobId'],
          pathParams: ['projectId', 'jobId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      debug: {

        /**
         * dataflow.projects.jobs.debug.getConfig
         *
         * @desc Get encoded debug configuration for component. Not cacheable.
         *
         * @alias dataflow.projects.jobs.debug.getConfig
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project id.
         * @param {string} params.jobId The job id.
         * @param {dataflow(v1b3).GetDebugConfigRequest} params.resource Request body data
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/debug/getConfig',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'jobId'],
            pathParams: ['projectId', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.jobs.debug.sendCapture
         *
         * @desc Send encoded debug capture data for component.
         *
         * @alias dataflow.projects.jobs.debug.sendCapture
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project id.
         * @param {string} params.jobId The job id.
         * @param {dataflow(v1b3).SendDebugCaptureRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        sendCapture: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/debug/sendCapture',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'jobId'],
            pathParams: ['projectId', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      messages: {

        /**
         * dataflow.projects.jobs.messages.list
         *
         * @desc Request the job status.
         *
         * @alias dataflow.projects.jobs.messages.list
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId A project id.
         * @param {string} params.jobId The job to get messages about.
         * @param {string=} params.minimumImportance Filter to only get messages with importance >= level
         * @param {integer=} params.pageSize If specified, determines the maximum number of messages to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
         * @param {string=} params.pageToken If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
         * @param {string=} params.startTime If specified, return only messages with timestamps >= start_time. The default is the job creation time (i.e. beginning of messages).
         * @param {string=} params.endTime Return only messages with timestamps < end_time. The default is now (i.e. return up to the latest messages available).
         * @param {string=} params.location The location which contains the job specified by job_id.
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/messages',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'jobId'],
            pathParams: ['projectId', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      workItems: {

        /**
         * dataflow.projects.jobs.workItems.reportStatus
         *
         * @desc Reports the status of dataflow WorkItems leased by a worker.
         *
         * @alias dataflow.projects.jobs.workItems.reportStatus
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project which owns the WorkItem's job.
         * @param {string} params.jobId The job which the WorkItem is part of.
         * @param {dataflow(v1b3).ReportWorkItemStatusRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        reportStatus: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/workItems:reportStatus',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'jobId'],
            pathParams: ['projectId', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.jobs.workItems.lease
         *
         * @desc Leases a dataflow WorkItem to run.
         *
         * @alias dataflow.projects.jobs.workItems.lease
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId Identifies the project this worker belongs to.
         * @param {string} params.jobId Identifies the workflow job this worker belongs to.
         * @param {dataflow(v1b3).LeaseWorkItemRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        lease: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/jobs/{jobId}/workItems:lease',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'jobId'],
            pathParams: ['projectId', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    locations: {

      jobs: {

        /**
         * dataflow.projects.locations.jobs.create
         *
         * @desc Creates a dataflow job.
         *
         * @alias dataflow.projects.locations.jobs.create
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project which owns the job.
         * @param {string} params.location The location which contains this job.
         * @param {string=} params.view Level of information requested in response.
         * @param {string=} params.replaceJobId DEPRECATED. This field is now on the Job message.
         * @param {dataflow(v1b3).Job} params.resource Request body data
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['projectId', 'location'],
            pathParams: ['projectId', 'location'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.locations.jobs.get
         *
         * @desc Gets the state of the specified dataflow job.
         *
         * @alias dataflow.projects.locations.jobs.get
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project which owns the job.
         * @param {string} params.location The location which contains this job.
         * @param {string} params.jobId Identifies a single job.
         * @param {string=} params.view Level of information requested in response.
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'location', 'jobId'],
            pathParams: ['projectId', 'location', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.locations.jobs.update
         *
         * @desc Updates the state of an existing dataflow job.
         *
         * @alias dataflow.projects.locations.jobs.update
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project which owns the job.
         * @param {string} params.location The location which contains this job.
         * @param {string} params.jobId Identifies a single job.
         * @param {dataflow(v1b3).Job} params.resource Request body data
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['projectId', 'location', 'jobId'],
            pathParams: ['projectId', 'location', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.locations.jobs.list
         *
         * @desc List the jobs of a project
         *
         * @alias dataflow.projects.locations.jobs.list
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId The project which owns the jobs.
         * @param {string} params.location The location which contains this job.
         * @param {string=} params.filter The kind of filter to use.
         * @param {string=} params.view Level of information requested in response. Default is SUMMARY.
         * @param {integer=} params.pageSize If there are many jobs, limit response to at most this many. The actual number of jobs returned will be the lesser of max_responses and an unspecified server-defined limit.
         * @param {string=} params.pageToken Set this to the 'next_page_token' field of a previous response to request additional results in a long list.
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
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'location'],
            pathParams: ['projectId', 'location'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * dataflow.projects.locations.jobs.getMetrics
         *
         * @desc Request the job status.
         *
         * @alias dataflow.projects.locations.jobs.getMetrics
         * @memberOf! dataflow(v1b3)
         *
         * @param {object} params Parameters for request
         * @param {string} params.projectId A project id.
         * @param {string} params.location The location which contains the job specified by job_id.
         * @param {string} params.jobId The job to get messages for.
         * @param {string=} params.startTime Return only metric data that has changed since this time. Default is to return all information about all metrics for the job.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getMetrics: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}/metrics',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['projectId', 'location', 'jobId'],
            pathParams: ['projectId', 'location', 'jobId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        messages: {

          /**
           * dataflow.projects.locations.jobs.messages.list
           *
           * @desc Request the job status.
           *
           * @alias dataflow.projects.locations.jobs.messages.list
           * @memberOf! dataflow(v1b3)
           *
           * @param {object} params Parameters for request
           * @param {string} params.projectId A project id.
           * @param {string} params.location The location which contains the job specified by job_id.
           * @param {string} params.jobId The job to get messages about.
           * @param {string=} params.minimumImportance Filter to only get messages with importance >= level
           * @param {integer=} params.pageSize If specified, determines the maximum number of messages to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
           * @param {string=} params.pageToken If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
           * @param {string=} params.startTime If specified, return only messages with timestamps >= start_time. The default is the job creation time (i.e. beginning of messages).
           * @param {string=} params.endTime Return only messages with timestamps < end_time. The default is now (i.e. return up to the latest messages available).
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
                url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}/messages',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['projectId', 'location', 'jobId'],
              pathParams: ['projectId', 'location', 'jobId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          }
        },

        workItems: {

          /**
           * dataflow.projects.locations.jobs.workItems.reportStatus
           *
           * @desc Reports the status of dataflow WorkItems leased by a worker.
           *
           * @alias dataflow.projects.locations.jobs.workItems.reportStatus
           * @memberOf! dataflow(v1b3)
           *
           * @param {object} params Parameters for request
           * @param {string} params.projectId The project which owns the WorkItem's job.
           * @param {string} params.location The location which contains the WorkItem's job.
           * @param {string} params.jobId The job which the WorkItem is part of.
           * @param {dataflow(v1b3).ReportWorkItemStatusRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          reportStatus: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}/workItems:reportStatus',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['projectId', 'location', 'jobId'],
              pathParams: ['projectId', 'location', 'jobId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * dataflow.projects.locations.jobs.workItems.lease
           *
           * @desc Leases a dataflow WorkItem to run.
           *
           * @alias dataflow.projects.locations.jobs.workItems.lease
           * @memberOf! dataflow(v1b3)
           *
           * @param {object} params Parameters for request
           * @param {string} params.projectId Identifies the project this worker belongs to.
           * @param {string} params.location The location which contains the WorkItem's job.
           * @param {string} params.jobId Identifies the workflow job this worker belongs to.
           * @param {dataflow(v1b3).LeaseWorkItemRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          lease: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/locations/{location}/jobs/{jobId}/workItems:lease',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['projectId', 'location', 'jobId'],
              pathParams: ['projectId', 'location', 'jobId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          }
        }
      }
    },

    templates: {

      /**
       * dataflow.projects.templates.create
       *
       * @desc Creates a dataflow job from a template.
       *
       * @alias dataflow.projects.templates.create
       * @memberOf! dataflow(v1b3)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId The project which owns the job.
       * @param {dataflow(v1b3).CreateJobFromTemplateRequest} params.resource Request body data
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
            url: 'https://dataflow.googleapis.com/v1b3/projects/{projectId}/templates',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['projectId'],
          pathParams: ['projectId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef GetDebugConfigRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} workerId The worker id, i.e., VM hostname.
 * @property {string} componentId The internal component id for which debug configuration is requested.
 */
/**
 * @typedef GetDebugConfigResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} config The encoded debug configuration for the requested component.
 */
/**
 * @typedef SendDebugCaptureRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} workerId The worker id, i.e., VM hostname.
 * @property {string} componentId The internal component id for which debug information is sent.
 * @property {string} data The encoded debug information.
 */
/**
 * @typedef SendDebugCaptureResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 */
/**
 * @typedef Job
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} id The unique ID of this job. This field is set by the Dataflow service when the Job is created, and is immutable for the life of the Job.
 * @property {string} projectId The project which owns the job.
 * @property {string} name The user-specified Dataflow job name. Only one Job with a given name may exist in a project at any given time. If a caller attempts to create a Job with the same name as an already-existing Job, the attempt will return the existing Job. The name must match the regular expression [a-z]([-a-z0-9]{0,38}[a-z0-9])?
 * @property {string} type The type of dataflow job.
 * @property {dataflow(v1b3).Environment} environment Environment for the job.
 * @property {dataflow(v1b3).Step[]} steps The top-level steps that constitute the entire job.
 * @property {string} currentState The current state of the job. Jobs are created in the JOB_STATE_STOPPED state unless otherwise specified. A job in the JOB_STATE_RUNNING state may asynchronously enter a terminal state. Once a job has reached a terminal state, no further state updates may be made. This field may be mutated by the Dataflow service; callers cannot mutate it.
 * @property {string} currentStateTime The timestamp associated with the current state.
 * @property {string} requestedState The job&#39;s requested state. UpdateJob may be used to switch between the JOB_STATE_STOPPED and JOB_STATE_RUNNING states, by setting requested_state. UpdateJob may also be used to directly set a job&#39;s requested state to JOB_STATE_CANCELLED or JOB_STATE_DONE, irrevocably terminating the job if it has not already reached a terminal state.
 * @property {dataflow(v1b3).JobExecutionInfo} executionInfo Information about how the Dataflow service will actually run the job.
 * @property {string} createTime Timestamp when job was initially created. Immutable, set by the Dataflow service.
 * @property {string} replaceJobId If this job is an update of an existing job, this field will be the ID of the job it replaced. When sending a CreateJobRequest, you can update a job by specifying it here. The job named here will be stopped, and its intermediate state transferred to this job.
 * @property {object} transformNameMapping Map of transform name prefixes of the job to be replaced to the corresponding name prefixes of the new job.
 * @property {string} clientRequestId Client&#39;s unique identifier of the job, re-used by SDK across retried attempts. If this field is set, the service will ensure its uniqueness. That is, the request to create a job will fail if the service has knowledge of a previously submitted job with the same client&#39;s id and job name. The caller may, for example, use this field to ensure idempotence of job creation across retried attempts to create a job. By default, the field is empty and, in that case, the service ignores it.
 * @property {string} replacedByJobId If another job is an update of this job (and thus, this job is in JOB_STATE_UPDATED), this field will contain the ID of that job.
 * @property {string[]} tempFiles A set of files the system should be aware of that are used for temporary storage. These temporary files will be removed on job completion. No duplicates are allowed. No file patterns are supported. The supported files are: Google Cloud Storage: storage.googleapis.com/{bucket}/{object} bucket.storage.googleapis.com/{object}
 * @property {object} labels User-defined labels for this job. The labels map can contain no more than 64 entries. Entries of the labels map are UTF8 strings that comply with the following restrictions: * Keys must conform to regexp: \p{Ll}\p{Lo}{0,62} * Values must conform to regexp: [\p{Ll}\p{Lo}\p{N}_-]{0,63} * Both keys and values are additionally constrained to be &lt;= 128 bytes in size.
 * @property {string} location The location which contains this job.
 */
/**
 * @typedef Environment
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} tempStoragePrefix The prefix of the resources the system should use for temporary storage. The system will append the suffix &quot;/temp-{JOBNAME} to this resource prefix, where {JOBNAME} is the value of the job_name field. The resulting bucket and object prefix is used as the prefix of the resources used to store temporary data needed during the job execution. NOTE: This will override the value in taskrunner_settings. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket}/{object} bucket.storage.googleapis.com/{object}
 * @property {string} clusterManagerApiService The type of cluster manager API to use. If unknown or unspecified, the service will attempt to choose a reasonable default. This should be in the form of the API service name, e.g. &quot;compute.googleapis.com&quot;.
 * @property {string[]} experiments The list of experiments to enable.
 * @property {dataflow(v1b3).WorkerPool[]} workerPools Worker pools. At least one &quot;harness&quot; worker pool must be specified in order for the job to have workers.
 * @property {object} userAgent A description of the process that generated the request.
 * @property {object} version A structure describing which components and their versions of the service are required in order to run the job.
 * @property {string} dataset The dataset for the current project where various workflow related tables are stored. The supported resource type is: Google BigQuery: bigquery.googleapis.com/{dataset}
 * @property {object} sdkPipelineOptions The Dataflow SDK pipeline options specified by the user. These options are passed through the service and are used to recreate the SDK pipeline options on the worker in a language agnostic and platform independent way.
 * @property {object} internalExperiments Experimental settings.
 * @property {string} serviceAccountEmail Identity to run virtual machines as. Defaults to the default account.
 */
/**
 * @typedef WorkerPool
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} kind The kind of the worker pool; currently only &#39;harness&#39; and &#39;shuffle&#39; are supported.
 * @property {integer} numWorkers Number of Google Compute Engine workers in this pool needed to execute the job. If zero or unspecified, the service will attempt to choose a reasonable default.
 * @property {dataflow(v1b3).Package[]} packages Packages to be installed on workers.
 * @property {string} defaultPackageSet The default package set to install. This allows the service to select a default set of packages which are useful to worker harnesses written in a particular language.
 * @property {string} machineType Machine type (e.g. &quot;n1-standard-1&quot;). If empty or unspecified, the service will attempt to choose a reasonable default.
 * @property {string} teardownPolicy Sets the policy for determining when to turndown worker pool. Allowed values are: TEARDOWN_ALWAYS, TEARDOWN_ON_SUCCESS, and TEARDOWN_NEVER. TEARDOWN_ALWAYS means workers are always torn down regardless of whether the job succeeds. TEARDOWN_ON_SUCCESS means workers are torn down if the job succeeds. TEARDOWN_NEVER means the workers are never torn down. If the workers are not torn down by the service, they will continue to run and use Google Compute Engine VM resources in the user&#39;s project until they are explicitly terminated by the user. Because of this, Google recommends using the TEARDOWN_ALWAYS policy except for small, manually supervised test jobs. If unknown or unspecified, the service will attempt to choose a reasonable default.
 * @property {integer} diskSizeGb Size of root disk for VMs, in GB. If zero or unspecified, the service will attempt to choose a reasonable default.
 * @property {string} diskType Type of root disk for VMs. If empty or unspecified, the service will attempt to choose a reasonable default.
 * @property {string} diskSourceImage Fully qualified source image for disks.
 * @property {string} zone Zone to run the worker pools in. If empty or unspecified, the service will attempt to choose a reasonable default.
 * @property {dataflow(v1b3).TaskRunnerSettings} taskrunnerSettings Settings passed through to Google Compute Engine workers when using the standard Dataflow task runner. Users should ignore this field.
 * @property {string} onHostMaintenance The action to take on host maintenance, as defined by the Google Compute Engine API.
 * @property {dataflow(v1b3).Disk[]} dataDisks Data disks that are used by a VM in this workflow.
 * @property {object} metadata Metadata to set on the Google Compute Engine VMs.
 * @property {dataflow(v1b3).AutoscalingSettings} autoscalingSettings Settings for autoscaling of this WorkerPool.
 * @property {object} poolArgs Extra arguments for this worker pool.
 * @property {string} network Network to which VMs will be assigned. If empty or unspecified, the service will use the network &quot;default&quot;.
 * @property {string} subnetwork Subnetwork to which VMs will be assigned, if desired. Expected to be of the form &quot;regions/REGION/subnetworks/SUBNETWORK&quot;.
 * @property {string} workerHarnessContainerImage Docker container image that executes Dataflow worker harness, residing in Google Container Registry. Required.
 * @property {integer} numThreadsPerWorker The number of threads per worker harness. If empty or unspecified, the service will choose a number of threads (according to the number of cores on the selected machine type for batch, or 1 by convention for streaming).
 * @property {string} ipConfiguration Configuration for VM IPs.
 */
/**
 * @typedef Package
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} name The name of the package.
 * @property {string} location The resource to read the package from. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket} bucket.storage.googleapis.com/
 */
/**
 * @typedef TaskRunnerSettings
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} taskUser The UNIX user ID on the worker VM to use for tasks launched by taskrunner; e.g. &quot;root&quot;.
 * @property {string} taskGroup The UNIX group ID on the worker VM to use for tasks launched by taskrunner; e.g. &quot;wheel&quot;.
 * @property {string[]} oauthScopes OAuth2 scopes to be requested by the taskrunner in order to access the dataflow API.
 * @property {string} baseUrl The base URL for the taskrunner to use when accessing Google Cloud APIs. When workers access Google Cloud APIs, they logically do so via relative URLs. If this field is specified, it supplies the base URL to use for resolving these relative URLs. The normative algorithm used is defined by RFC 1808, &quot;Relative Uniform Resource Locators&quot;. If not specified, the default value is &quot;http://www.googleapis.com/&quot;
 * @property {string} dataflowApiVersion API version of endpoint, e.g. &quot;v1b3&quot;
 * @property {dataflow(v1b3).WorkerSettings} parallelWorkerSettings Settings to pass to the parallel worker harness.
 * @property {string} baseTaskDir Location on the worker for task-specific subdirectories.
 * @property {boolean} continueOnException Do we continue taskrunner if an exception is hit?
 * @property {boolean} logToSerialconsole Send taskrunner log into to Google Compute Engine VM serial console?
 * @property {boolean} alsologtostderr Also send taskrunner log info to stderr?
 * @property {string} logUploadLocation Indicates where to put logs. If this is not specified, the logs will not be uploaded. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket}/{object} bucket.storage.googleapis.com/{object}
 * @property {string} logDir Directory on the VM to store logs.
 * @property {string} tempStoragePrefix The prefix of the resources the taskrunner should use for temporary storage. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket}/{object} bucket.storage.googleapis.com/{object}
 * @property {string} harnessCommand Command to launch the worker harness.
 * @property {string} workflowFileName Store the workflow in this file.
 * @property {string} commandlinesFileName Store preprocessing commands in this file.
 * @property {string} vmId ID string of VM.
 * @property {string} languageHint Suggested backend language.
 * @property {string} streamingWorkerMainClass Streaming worker main class name.
 */
/**
 * @typedef WorkerSettings
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} baseUrl The base URL for accessing Google Cloud APIs. When workers access Google Cloud APIs, they logically do so via relative URLs. If this field is specified, it supplies the base URL to use for resolving these relative URLs. The normative algorithm used is defined by RFC 1808, &quot;Relative Uniform Resource Locators&quot;. If not specified, the default value is &quot;http://www.googleapis.com/&quot;
 * @property {boolean} reportingEnabled Send work progress updates to service.
 * @property {string} servicePath The Dataflow service path relative to the root URL, for example, &quot;dataflow/v1b3/projects&quot;.
 * @property {string} shuffleServicePath The Shuffle service path relative to the root URL, for example, &quot;shuffle/v1beta1&quot;.
 * @property {string} workerId ID of the worker running this pipeline.
 * @property {string} tempStoragePrefix The prefix of the resources the system should use for temporary storage. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket}/{object} bucket.storage.googleapis.com/{object}
 */
/**
 * @typedef Disk
 * @memberOf! dataflow(v1b3)
 * @type object
* @property {integer} sizeGb Size of disk in GB. If zero or unspecified, the service will attempt to choose a reasonable default.
* @property {string} diskType Disk storage type, as defined by Google Compute Engine. This must be a disk type appropriate to the project and zone in which the workers will run. If unknown or unspecified, the service will attempt to choose a reasonable default. For example, the standard persistent disk type is a resource name typically ending in &quot;pd-standard&quot;. If SSD persistent disks are available, the resource name typically ends with &quot;pd-ssd&quot;. The actual valid values are defined the Google Compute Engine API, not by the Dataflow API; consult the Google Compute Engine documentation for more information about determining the set of available disk types for a particular project and zone. Google Compute Engine Disk types are local to a particular project in a particular zone, and so the resource name will typically look something like this: compute.googleapis.com/projects/
/zones//diskTypes/pd-standard
* @property {string} mountPoint Directory in a VM where disk is mounted.
*/
/**
 * @typedef AutoscalingSettings
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} algorithm The algorithm to use for autoscaling.
 * @property {integer} maxNumWorkers The maximum number of workers to cap scaling at.
 */
/**
 * @typedef Step
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} kind The kind of step in the dataflow Job.
 * @property {string} name Name identifying the step. This must be unique for each step with respect to all other steps in the dataflow Job.
 * @property {object} properties Named properties associated with the step. Each kind of predefined step has its own required set of properties.
 */
/**
 * @typedef JobExecutionInfo
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {object} stages A mapping from each stage to the information about that stage.
 */
/**
 * @typedef JobExecutionStageInfo
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string[]} stepName The steps associated with the execution stage. Note that stages may have several steps, and that a given step might be run by more than one stage.
 */
/**
 * @typedef ListJobsResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Job[]} jobs A subset of the requested job information.
 * @property {string} nextPageToken Set if there may be more results than fit in this response.
 * @property {dataflow(v1b3).FailedLocation[]} failedLocation Zero or more messages describing locations that failed to respond.
 */
/**
 * @typedef FailedLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} name The name of the failed location.
 */
/**
 * @typedef ListJobMessagesResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).JobMessage[]} jobMessages Messages in ascending timestamp order.
 * @property {string} nextPageToken The token to obtain the next page of results if there are more.
 */
/**
 * @typedef JobMessage
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} id Identifies the message. This is automatically generated by the service; the caller should treat it as an opaque string.
 * @property {string} time The timestamp of the message.
 * @property {string} messageText The text of the message.
 * @property {string} messageImportance Importance level of the message.
 */
/**
 * @typedef JobMetrics
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} metricTime Timestamp as of which metric values are current.
 * @property {dataflow(v1b3).MetricUpdate[]} metrics All metrics for this job.
 */
/**
 * @typedef MetricUpdate
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).MetricStructuredName} name Name of the metric.
 * @property {string} kind Metric aggregation kind. The possible metric aggregation kinds are &quot;Sum&quot;, &quot;Max&quot;, &quot;Min&quot;, &quot;Mean&quot;, &quot;Set&quot;, &quot;And&quot;, and &quot;Or&quot;. The specified aggregation kind is case-insensitive. If omitted, this is not an aggregated value but instead a single metric sample value.
 * @property {boolean} cumulative True if this metric is reported as the total cumulative aggregate value accumulated since the worker started working on this WorkItem. By default this is false, indicating that this metric is reported as a delta that is not associated with any WorkItem.
 * @property {any} scalar Worker-computed aggregate value for aggregation kinds &quot;Sum&quot;, &quot;Max&quot;, &quot;Min&quot;, &quot;And&quot;, and &quot;Or&quot;. The possible value types are Long, Double, and Boolean.
 * @property {any} meanSum Worker-computed aggregate value for the &quot;Mean&quot; aggregation kind. This holds the sum of the aggregated values and is used in combination with mean_count below to obtain the actual mean aggregate value. The only possible value types are Long and Double.
 * @property {any} meanCount Worker-computed aggregate value for the &quot;Mean&quot; aggregation kind. This holds the count of the aggregated values and is used in combination with mean_sum above to obtain the actual mean aggregate value. The only possible value type is Long.
 * @property {any} set Worker-computed aggregate value for the &quot;Set&quot; aggregation kind. The only possible value type is a list of Values whose type can be Long, Double, or String, according to the metric&#39;s type. All Values in the list must be of the same type.
 * @property {any} internal Worker-computed aggregate value for internal use by the Dataflow service.
 * @property {string} updateTime Timestamp associated with the metric value. Optional when workers are reporting work progress; it will be filled in responses from the metrics API.
 */
/**
 * @typedef MetricStructuredName
 * @memberOf! dataflow(v1b3)
 * @type object
* @property {string} origin Origin (namespace) of metric name. May be blank for user-define metrics; will be &quot;dataflow&quot; for metrics defined by the Dataflow service or SDK.
* @property {string} name Worker-defined metric name.
* @property {object} context Zero or more labeled fields which identify the part of the job this metric is associated with, such as the name of a step or collection. For example, built-in counters associated with steps will have context[&#39;step&#39;] = . Counters associated with PCollections in the SDK will have context[&#39;pcollection&#39;] =
.
*/
/**
 * @typedef CreateJobFromTemplateRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} jobName The job name to use for the created job..
 * @property {string} gcsPath A path to the serialized JSON representation of the job.
 * @property {object} parameters Dynamic parameterization of the job&#39;s runtime environment.
 * @property {dataflow(v1b3).RuntimeEnvironment} environment Runtime environment for the job.
 */
/**
 * @typedef RuntimeEnvironment
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} maxWorkers The maximum number of workers to start for the job.
 * @property {string} zone The zone to start the workers in.
 * @property {string} serviceAccountEmail The service account to run the job as.
 * @property {string} tempLocation The temp location to use for the job.
 * @property {boolean} bypassTempDirValidation Bypass the safety checks for the job&#39;s temp directory. Use with caution.
 */
/**
 * @typedef ReportWorkItemStatusRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} workerId The ID of the worker reporting the WorkItem status. If this does not match the ID of the worker which the Dataflow service believes currently has the lease on the WorkItem, the report will be dropped (with an error response).
 * @property {dataflow(v1b3).WorkItemStatus[]} workItemStatuses The order is unimportant, except that the order of the WorkItemServiceState messages in the ReportWorkItemStatusResponse corresponds to the order of WorkItemStatus messages here.
 * @property {string} currentWorkerTime The current timestamp at the worker.
 * @property {string} location The location which contains the WorkItem&#39;s job.
 */
/**
 * @typedef WorkItemStatus
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} workItemId Identifies the WorkItem.
 * @property {string} reportIndex The report index. When a WorkItem is leased, the lease will contain an initial report index. When a WorkItem&#39;s status is reported to the system, the report should be sent with that report index, and the response will contain the index the worker should use for the next report. Reports received with unexpected index values will be rejected by the service. In order to preserve idempotency, the worker should not alter the contents of a report, even if the worker must submit the same report multiple times before getting back a response. The worker should not submit a subsequent report until the response for the previous report had been received from the service.
 * @property {string} requestedLeaseDuration Amount of time the worker requests for its lease.
 * @property {boolean} completed True if the WorkItem was completed (successfully or unsuccessfully).
 * @property {dataflow(v1b3).Status[]} errors Specifies errors which occurred during processing. If errors are provided, and completed = true, then the WorkItem is considered to have failed.
 * @property {dataflow(v1b3).CounterUpdate[]} counterUpdates Worker output counters for this WorkItem.
 * @property {dataflow(v1b3).MetricUpdate[]} metricUpdates DEPRECATED in favor of counter_updates.
 * @property {dataflow(v1b3).ApproximateReportedProgress} reportedProgress The worker&#39;s progress through this WorkItem.
 * @property {dataflow(v1b3).Position} stopPosition A worker may split an active map task in two parts, &quot;primary&quot; and &quot;residual&quot;, continuing to process the primary part and returning the residual part into the pool of available work. This event is called a &quot;dynamic split&quot; and is critical to the dynamic work rebalancing feature. The two obtained sub-tasks are called &quot;parts&quot; of the split. The parts, if concatenated, must represent the same input as would be read by the current task if the split did not happen. The exact way in which the original task is decomposed into the two parts is specified either as a position demarcating them (stop_position), or explicitly as two DerivedSources, if this task consumes a user-defined source type (dynamic_source_split). The &quot;current&quot; task is adjusted as a result of the split: after a task with range [A, B) sends a stop_position update at C, its range is considered to be [A, C), e.g.: * Progress should be interpreted relative to the new range, e.g. &quot;75% completed&quot; means &quot;75% of [A, C) completed&quot; * The worker should interpret proposed_stop_position relative to the new range, e.g. &quot;split at 68%&quot; should be interpreted as &quot;split at 68% of [A, C)&quot;. * If the worker chooses to split again using stop_position, only stop_positions in [A, C) will be accepted. * Etc. dynamic_source_split has similar semantics: e.g., if a task with source S splits using dynamic_source_split into {P, R} (where P and R must be together equivalent to S), then subsequent progress and proposed_stop_position should be interpreted relative to P, and in a potential subsequent dynamic_source_split into {P&#39;, R&#39;}, P&#39; and R&#39; must be together equivalent to P, etc.
 * @property {dataflow(v1b3).DynamicSourceSplit} dynamicSourceSplit See documentation of stop_position.
 * @property {dataflow(v1b3).SourceOperationResponse} sourceOperationResponse If the work item represented a SourceOperationRequest, and the work is completed, contains the result of the operation.
 * @property {dataflow(v1b3).SourceFork} sourceFork DEPRECATED in favor of dynamic_source_split.
 * @property {dataflow(v1b3).ApproximateProgress} progress DEPRECATED in favor of reported_progress.
 */
/**
 * @typedef Status
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef CounterUpdate
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).NameAndKind} nameAndKind Counter name and aggregation type.
 * @property {string} shortId The service-generated short identifier for this counter. The short_id -&gt; (name, metadata) mapping is constant for the lifetime of a job.
 * @property {dataflow(v1b3).CounterStructuredNameAndMetadata} structuredNameAndMetadata Counter structured name and metadata.
 * @property {boolean} cumulative True if this counter is reported as the total cumulative aggregate value accumulated since the worker started working on this WorkItem. By default this is false, indicating that this counter is reported as a delta.
 * @property {dataflow(v1b3).SplitInt64} integer Integer value for Sum, Max, Min.
 * @property {number} floatingPoint Floating point value for Sum, Max, Min.
 * @property {boolean} boolean Boolean value for And, Or.
 * @property {dataflow(v1b3).IntegerMean} integerMean Integer mean aggregation value for Mean.
 * @property {dataflow(v1b3).FloatingPointMean} floatingPointMean Floating point mean aggregation value for Mean.
 * @property {dataflow(v1b3).IntegerList} integerList List of integers, for Set.
 * @property {dataflow(v1b3).FloatingPointList} floatingPointList List of floating point numbers, for Set.
 * @property {dataflow(v1b3).StringList} stringList List of strings, for Set.
 * @property {any} internal Value for internally-defined counters used by the Dataflow service.
 */
/**
 * @typedef NameAndKind
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} name Name of the counter.
 * @property {string} kind Counter aggregation kind.
 */
/**
 * @typedef CounterStructuredNameAndMetadata
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).CounterStructuredName} name Structured name of the counter.
 * @property {dataflow(v1b3).CounterMetadata} metadata Metadata associated with a counter
 */
/**
 * @typedef CounterStructuredName
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} name Counter name. Not necessarily globally-unique, but unique within the context of the other fields. Required.
 * @property {string} standardOrigin One of the standard Origins defined above.
 * @property {string} otherOrigin A string containing the origin of the counter.
 * @property {string} originalStepName System generated name of the original step in the user&#39;s graph, before optimization.
 * @property {string} componentStepName Name of the optimized step being executed by the workers.
 * @property {string} executionStepName Name of the stage. An execution step contains multiple component steps.
 * @property {string} workerId ID of a particular worker.
 * @property {string} portion Portion of this counter, either key or value.
 */
/**
 * @typedef CounterMetadata
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} kind Counter aggregation kind.
 * @property {string} description Human-readable description of the counter semantics.
 * @property {string} standardUnits System defined Units, see above enum.
 * @property {string} otherUnits A string referring to the unit type.
 */
/**
 * @typedef SplitInt64
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} lowBits The low order bits: n &amp; 0xffffffff.
 * @property {integer} highBits The high order bits, including the sign: n &gt;&gt; 32.
 */
/**
 * @typedef IntegerMean
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SplitInt64} sum The sum of all values being aggregated.
 * @property {dataflow(v1b3).SplitInt64} count The number of values being aggregated.
 */
/**
 * @typedef FloatingPointMean
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {number} sum The sum of all values being aggregated.
 * @property {dataflow(v1b3).SplitInt64} count The number of values being aggregated.
 */
/**
 * @typedef IntegerList
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SplitInt64[]} elements Elements of the list.
 */
/**
 * @typedef FloatingPointList
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {number[]} elements Elements of the list.
 */
/**
 * @typedef StringList
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string[]} elements Elements of the list.
 */
/**
 * @typedef ApproximateReportedProgress
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Position} position A Position within the work to represent a progress.
 * @property {number} fractionConsumed Completion as fraction of the input consumed, from 0.0 (beginning, nothing consumed), to 1.0 (end of the input, entire input consumed).
 * @property {dataflow(v1b3).ReportedParallelism} remainingParallelism Total amount of parallelism in the input of this task that remains, (i.e. can be delegated to this task and any new tasks via dynamic splitting). Always at least 1 for non-finished work items and 0 for finished. &quot;Amount of parallelism&quot; refers to how many non-empty parts of the input can be read in parallel. This does not necessarily equal number of records. An input that can be read in parallel down to the individual records is called &quot;perfectly splittable&quot;. An example of non-perfectly parallelizable input is a block-compressed file format where a block of records has to be read as a whole, but different blocks can be read in parallel. Examples: * If we are processing record #30 (starting at 1) out of 50 in a perfectly splittable 50-record input, this value should be 21 (20 remaining + 1 current). * If we are reading through block 3 in a block-compressed file consisting of 5 blocks, this value should be 3 (since blocks 4 and 5 can be processed in parallel by new tasks via dynamic splitting and the current task remains processing block 3). * If we are reading through the last block in a block-compressed file, or reading or processing the last record in a perfectly splittable input, this value should be 1, because apart from the current task, no additional remainder can be split off.
 * @property {dataflow(v1b3).ReportedParallelism} consumedParallelism Total amount of parallelism in the portion of input of this task that has already been consumed and is no longer active. In the first two examples above (see remaining_parallelism), the value should be 29 or 2 respectively. The sum of remaining_parallelism and consumed_parallelism should equal the total amount of parallelism in this work item. If specified, must be finite.
 */
/**
 * @typedef Position
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {boolean} end Position is past all other positions. Also useful for the end position of an unbounded range.
 * @property {string} key Position is a string key, ordered lexicographically.
 * @property {string} byteOffset Position is a byte offset.
 * @property {string} recordIndex Position is a record index.
 * @property {string} shufflePosition CloudPosition is a base64 encoded BatchShufflePosition (with FIXED sharding).
 * @property {dataflow(v1b3).ConcatPosition} concatPosition CloudPosition is a concat position.
 */
/**
 * @typedef ConcatPosition
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} index Index of the inner source.
 * @property {dataflow(v1b3).Position} position Position within the inner source.
 */
/**
 * @typedef ReportedParallelism
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {boolean} isInfinite Specifies whether the parallelism is infinite. If true, &quot;value&quot; is ignored. Infinite parallelism means the service will assume that the work item can always be split into more non-empty work items by dynamic splitting. This is a work-around for lack of support for infinity by the current JSON-based Java RPC stack.
 * @property {number} value Specifies the level of parallelism in case it is finite.
 */
/**
 * @typedef DynamicSourceSplit
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).DerivedSource} primary Primary part (continued to be processed by worker). Specified relative to the previously-current source. Becomes current.
 * @property {dataflow(v1b3).DerivedSource} residual Residual part (returned to the pool of work). Specified relative to the previously-current source.
 */
/**
 * @typedef DerivedSource
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source} source Specification of the source.
 * @property {string} derivationMode What source to base the produced source on (if any).
 */
/**
 * @typedef Source
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {object} spec The source to read from, plus its parameters.
 * @property {object} codec The codec to use to decode data read from the source.
 * @property {object[]} baseSpecs While splitting, sources may specify the produced bundles as differences against another source, in order to save backend-side memory and allow bigger jobs. For details, see SourceSplitRequest. To support this use case, the full set of parameters of the source is logically obtained by taking the latest explicitly specified value of each parameter in the order: base_specs (later items win), spec (overrides anything in base_specs).
 * @property {dataflow(v1b3).SourceMetadata} metadata Optionally, metadata for this source can be supplied right away, avoiding a SourceGetMetadataOperation roundtrip (see SourceOperationRequest). This field is meaningful only in the Source objects populated by the user (e.g. when filling in a DerivedSource). Source objects supplied by the framework to the user don&#39;t have this field populated.
 * @property {boolean} doesNotNeedSplitting Setting this value to true hints to the framework that the source doesn&#39;t need splitting, and using SourceSplitRequest on it would yield SOURCE_SPLIT_OUTCOME_USE_CURRENT. E.g. a file splitter may set this to true when splitting a single file into a set of byte ranges of appropriate size, and set this to false when splitting a filepattern into individual files. However, for efficiency, a file splitter may decide to produce file subranges directly from the filepattern to avoid a splitting round-trip. See SourceSplitRequest for an overview of the splitting process. This field is meaningful only in the Source objects populated by the user (e.g. when filling in a DerivedSource). Source objects supplied by the framework to the user don&#39;t have this field populated.
 */
/**
 * @typedef SourceMetadata
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {boolean} producesSortedKeys Whether this source is known to produce key/value pairs with the (encoded) keys in lexicographically sorted order.
 * @property {boolean} infinite Specifies that the size of this source is known to be infinite (this is a streaming source).
 * @property {string} estimatedSizeBytes An estimate of the total size (in bytes) of the data that would be read from this source. This estimate is in terms of external storage size, before any decompression or other processing done by the reader.
 */
/**
 * @typedef SourceOperationResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SourceSplitResponse} split A response to a request to split a source.
 * @property {dataflow(v1b3).SourceGetMetadataResponse} getMetadata A response to a request to get metadata about a source.
 */
/**
 * @typedef SourceSplitResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} outcome Indicates whether splitting happened and produced a list of bundles. If this is USE_CURRENT_SOURCE_AS_IS, the current source should be processed &quot;as is&quot; without splitting. &quot;bundles&quot; is ignored in this case. If this is SPLITTING_HAPPENED, then &quot;bundles&quot; contains a list of bundles into which the source was split.
 * @property {dataflow(v1b3).DerivedSource[]} bundles If outcome is SPLITTING_HAPPENED, then this is a list of bundles into which the source was split. Otherwise this field is ignored. This list can be empty, which means the source represents an empty input.
 * @property {dataflow(v1b3).SourceSplitShard[]} shards DEPRECATED in favor of bundles.
 */
/**
 * @typedef SourceSplitShard
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source} source DEPRECATED
 * @property {string} derivationMode DEPRECATED
 */
/**
 * @typedef SourceGetMetadataResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SourceMetadata} metadata The computed metadata.
 */
/**
 * @typedef SourceFork
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SourceSplitShard} primary DEPRECATED
 * @property {dataflow(v1b3).SourceSplitShard} residual DEPRECATED
 * @property {dataflow(v1b3).DerivedSource} primarySource DEPRECATED
 * @property {dataflow(v1b3).DerivedSource} residualSource DEPRECATED
 */
/**
 * @typedef ApproximateProgress
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Position} position Obsolete.
 * @property {number} percentComplete Obsolete.
 * @property {string} remainingTime Obsolete.
 */
/**
 * @typedef ReportWorkItemStatusResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).WorkItemServiceState[]} workItemServiceStates A set of messages indicating the service-side state for each WorkItem whose status was reported, in the same order as the WorkItemStatus messages in the ReportWorkItemStatusRequest which resulting in this response.
 */
/**
 * @typedef WorkItemServiceState
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).ApproximateSplitRequest} splitRequest The progress point in the WorkItem where the Dataflow service suggests that the worker truncate the task.
 * @property {string} leaseExpireTime Time at which the current lease will expire.
 * @property {string} reportStatusInterval New recommended reporting interval.
 * @property {object} harnessData Other data returned by the service, specific to the particular worker harness.
 * @property {string} nextReportIndex The index value to use for the next report sent by the worker. Note: If the report call fails for whatever reason, the worker should reuse this index for subsequent report attempts.
 * @property {dataflow(v1b3).MetricShortId[]} metricShortId The short ids that workers should use in subsequent metric updates. Workers should strive to use short ids whenever possible, but it is ok to request the short_id again if a worker lost track of it (e.g. if the worker is recovering from a crash). NOTE: it is possible that the response may have short ids for a subset of the metrics.
 * @property {dataflow(v1b3).Position} suggestedStopPosition Obsolete, always empty.
 * @property {dataflow(v1b3).ApproximateProgress} suggestedStopPoint DEPRECATED in favor of split_request.
 */
/**
 * @typedef ApproximateSplitRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Position} position A Position at which to split the work item.
 * @property {number} fractionConsumed A fraction at which to split the work item, from 0.0 (beginning of the input) to 1.0 (end of the input).
 */
/**
 * @typedef MetricShortId
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} metricIndex The index of the corresponding metric in the ReportWorkItemStatusRequest. Required.
 * @property {string} shortId The service-generated short identifier for the metric.
 */
/**
 * @typedef LeaseWorkItemRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string[]} workItemTypes Filter for WorkItem type.
 * @property {string[]} workerCapabilities Worker capabilities. WorkItems might be limited to workers with specific capabilities.
 * @property {string} requestedLeaseDuration The initial lease period.
 * @property {string} currentWorkerTime The current timestamp at the worker.
 * @property {string} workerId Identifies the worker leasing work -- typically the ID of the virtual machine running the worker.
 * @property {string} location The location which contains the WorkItem&#39;s job.
 */
/**
 * @typedef LeaseWorkItemResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).WorkItem[]} workItems A list of the leased WorkItems.
 */
/**
 * @typedef WorkItem
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} id Identifies this WorkItem.
 * @property {string} projectId Identifies the cloud project this WorkItem belongs to.
 * @property {string} jobId Identifies the workflow job this WorkItem belongs to.
 * @property {dataflow(v1b3).Package[]} packages Any required packages that need to be fetched in order to execute this WorkItem.
 * @property {dataflow(v1b3).MapTask} mapTask Additional information for MapTask WorkItems.
 * @property {dataflow(v1b3).SeqMapTask} seqMapTask Additional information for SeqMapTask WorkItems.
 * @property {dataflow(v1b3).ShellTask} shellTask Additional information for ShellTask WorkItems.
 * @property {dataflow(v1b3).StreamingSetupTask} streamingSetupTask Additional information for StreamingSetupTask WorkItems.
 * @property {dataflow(v1b3).SourceOperationRequest} sourceOperationTask Additional information for source operation WorkItems.
 * @property {dataflow(v1b3).StreamingComputationTask} streamingComputationTask Additional information for StreamingComputationTask WorkItems.
 * @property {dataflow(v1b3).StreamingConfigTask} streamingConfigTask Additional information for StreamingConfigTask WorkItems.
 * @property {string} reportStatusInterval Recommended reporting interval.
 * @property {string} leaseExpireTime Time when the lease on this Work will expire.
 * @property {string} configuration Work item-specific configuration as an opaque blob.
 * @property {string} initialReportIndex The initial index to use when reporting the status of the WorkItem.
 */
/**
 * @typedef MapTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).ParallelInstruction[]} instructions The instructions in the MapTask.
 * @property {string} systemName System-defined name of this MapTask. Unique across the workflow.
 * @property {string} stageName System-defined name of the stage containing this MapTask. Unique across the workflow.
 */
/**
 * @typedef ParallelInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} systemName System-defined name of this operation. Unique across the workflow.
 * @property {string} name User-provided name of this operation.
 * @property {string} originalName System-defined name for the operation in the original workflow graph.
 * @property {dataflow(v1b3).ReadInstruction} read Additional information for Read instructions.
 * @property {dataflow(v1b3).WriteInstruction} write Additional information for Write instructions.
 * @property {dataflow(v1b3).ParDoInstruction} parDo Additional information for ParDo instructions.
 * @property {dataflow(v1b3).PartialGroupByKeyInstruction} partialGroupByKey Additional information for PartialGroupByKey instructions.
 * @property {dataflow(v1b3).FlattenInstruction} flatten Additional information for Flatten instructions.
 * @property {dataflow(v1b3).InstructionOutput[]} outputs Describes the outputs of the instruction.
 */
/**
 * @typedef ReadInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source} source The source to read from.
 */
/**
 * @typedef WriteInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).InstructionInput} input The input.
 * @property {dataflow(v1b3).Sink} sink The sink to write to.
 */
/**
 * @typedef InstructionInput
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} producerInstructionIndex The index (origin zero) of the parallel instruction that produces the output to be consumed by this input. This index is relative to the list of instructions in this input&#39;s instruction&#39;s containing MapTask.
 * @property {integer} outputNum The output index (origin zero) within the producer.
 */
/**
 * @typedef Sink
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {object} spec The sink to write to, plus its parameters.
 * @property {object} codec The codec to use to encode data written to the sink.
 */
/**
 * @typedef ParDoInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).InstructionInput} input The input.
 * @property {dataflow(v1b3).SideInputInfo[]} sideInputs Zero or more side inputs.
 * @property {object} userFn The user function to invoke.
 * @property {integer} numOutputs The number of outputs.
 * @property {dataflow(v1b3).MultiOutputInfo[]} multiOutputInfos Information about each of the outputs, if user_fn is a MultiDoFn.
 */
/**
 * @typedef SideInputInfo
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source[]} sources The source(s) to read element(s) from to get the value of this side input. If more than one source, then the elements are taken from the sources, in the specified order if order matters. At least one source is required.
 * @property {object} kind How to interpret the source element(s) as a side input value.
 * @property {string} tag The id of the tag the user code will access this side input by; this should correspond to the tag of some MultiOutputInfo.
 */
/**
 * @typedef MultiOutputInfo
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} tag The id of the tag the user code will emit to this output by; this should correspond to the tag of some SideInputInfo.
 */
/**
 * @typedef PartialGroupByKeyInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).InstructionInput} input Describes the input to the partial group-by-key instruction.
 * @property {object} inputElementCodec The codec to use for interpreting an element in the input PTable.
 * @property {object} valueCombiningFn The value combining function to invoke.
 * @property {dataflow(v1b3).SideInputInfo[]} sideInputs Zero or more side inputs.
 * @property {string} originalCombineValuesStepName If this instruction includes a combining function, this is the name of the CombineValues instruction lifted into this instruction.
 * @property {string} originalCombineValuesInputStoreName If this instruction includes a combining function this is the name of the intermediate store between the GBK and the CombineValues.
 */
/**
 * @typedef FlattenInstruction
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).InstructionInput[]} inputs Describes the inputs to the flatten instruction.
 */
/**
 * @typedef InstructionOutput
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} name The user-provided name of this output.
 * @property {string} systemName System-defined name of this output. Unique across the workflow.
 * @property {string} originalName System-defined name for this output in the original workflow graph. Outputs that do not contribute to an original instruction do not set this.
 * @property {object} codec The codec to use to encode data being written via this output.
 * @property {boolean} onlyCountKeyBytes For system-generated byte and mean byte metrics, certain instructions should only report the key size.
 * @property {boolean} onlyCountValueBytes For system-generated byte and mean byte metrics, certain instructions should only report the value size.
 */
/**
 * @typedef SeqMapTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SideInputInfo[]} inputs Information about each of the inputs.
 * @property {object} userFn The user function to invoke.
 * @property {dataflow(v1b3).SeqMapTaskOutputInfo[]} outputInfos Information about each of the outputs.
 * @property {string} name The user-provided name of the SeqDo operation.
 * @property {string} systemName System-defined name of the SeqDo operation. Unique across the workflow.
 * @property {string} stageName System-defined name of the stage containing the SeqDo operation. Unique across the workflow.
 */
/**
 * @typedef SeqMapTaskOutputInfo
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} tag The id of the TupleTag the user code will tag the output value by.
 * @property {dataflow(v1b3).Sink} sink The sink to write the output value to.
 */
/**
 * @typedef ShellTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} command The shell command to run.
 * @property {integer} exitCode Exit code for the task.
 */
/**
 * @typedef StreamingSetupTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {integer} receiveWorkPort The TCP port on which the worker should listen for messages from other streaming computation workers.
 * @property {integer} workerHarnessPort The TCP port used by the worker to communicate with the Dataflow worker harness.
 * @property {dataflow(v1b3).TopologyConfig} streamingComputationTopology The global topology of the streaming Dataflow job.
 * @property {boolean} drain The user has requested drain.
 */
/**
 * @typedef TopologyConfig
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).ComputationTopology[]} computations The computations associated with a streaming Dataflow job.
 * @property {dataflow(v1b3).DataDiskAssignment[]} dataDiskAssignments The disks assigned to a streaming Dataflow job.
 * @property {object} userStageToComputationNameMap Maps user stage names to stable computation names.
 * @property {integer} forwardingKeyBits The size (in bits) of keys that will be assigned to source messages.
 * @property {integer} persistentStateVersion Version number for persistent state.
 */
/**
 * @typedef ComputationTopology
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} systemStageName The system stage name.
 * @property {string} computationId The ID of the computation.
 * @property {string} userStageName The user stage name.
 * @property {dataflow(v1b3).KeyRangeLocation[]} keyRanges The key ranges processed by the computation.
 * @property {dataflow(v1b3).StreamLocation[]} inputs The inputs to the computation.
 * @property {dataflow(v1b3).StreamLocation[]} outputs The outputs from the computation.
 * @property {dataflow(v1b3).StateFamilyConfig[]} stateFamilies The state family values.
 */
/**
 * @typedef KeyRangeLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} start The start (inclusive) of the key range.
 * @property {string} end The end (exclusive) of the key range.
 * @property {string} deliveryEndpoint The physical location of this range assignment to be used for streaming computation cross-worker message delivery.
 * @property {string} persistentDirectory The location of the persistent state for this range, as a persistent directory in the worker local filesystem.
 * @property {string} dataDisk The name of the data disk where data for this range is stored. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example &quot;myproject-1014-104817-4c2-harness-0-disk-1&quot;.
 */
/**
 * @typedef StreamLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).StreamingStageLocation} streamingStageLocation The stream is part of another computation within the current streaming Dataflow job.
 * @property {dataflow(v1b3).PubsubLocation} pubsubLocation The stream is a pubsub stream.
 * @property {dataflow(v1b3).StreamingSideInputLocation} sideInputLocation The stream is a streaming side input.
 * @property {dataflow(v1b3).CustomSourceLocation} customSourceLocation The stream is a custom source.
 */
/**
 * @typedef StreamingStageLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} streamId Identifies the particular stream within the streaming Dataflow job.
 */
/**
 * @typedef PubsubLocation
 * @memberOf! dataflow(v1b3)
 * @type object
* @property {string} topic A pubsub topic, in the form of &quot;pubsub.googleapis.com/topics/
/&quot;
* @property {string} subscription A pubsub subscription, in the form of &quot;pubsub.googleapis.com/subscriptions/
/&quot;
* @property {string} timestampLabel If set, contains a pubsub label from which to extract record timestamps. If left empty, record timestamps will be generated upon arrival.
* @property {string} idLabel If set, contains a pubsub label from which to extract record ids. If left empty, record deduplication will be strictly best effort.
* @property {boolean} dropLateData Indicates whether the pipeline allows late-arriving data.
* @property {string} trackingSubscription If set, specifies the pubsub subscription that will be used for tracking custom time timestamps for watermark estimation.
* @property {boolean} withAttributes If true, then the client has requested to get pubsub attributes.
*/
/**
 * @typedef StreamingSideInputLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} tag Identifies the particular side input within the streaming Dataflow job.
 * @property {string} stateFamily Identifies the state family where this side input is stored.
 */
/**
 * @typedef CustomSourceLocation
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {boolean} stateful Whether this source is stateful.
 */
/**
 * @typedef StateFamilyConfig
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} stateFamily The state family value.
 * @property {boolean} isRead If true, this family corresponds to a read operation.
 */
/**
 * @typedef DataDiskAssignment
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} vmInstance VM instance name the data disks mounted to, for example &quot;myproject-1014-104817-4c2-harness-0&quot;.
 * @property {string[]} dataDisks Mounted data disks. The order is important a data disk&#39;s 0-based index in this list defines which persistent directory the disk is mounted to, for example the list of { &quot;myproject-1014-104817-4c2-harness-0-disk-0&quot; }, { &quot;myproject-1014-104817-4c2-harness-0-disk-1&quot; }.
 */
/**
 * @typedef SourceOperationRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).SourceSplitRequest} split Information about a request to split a source.
 * @property {dataflow(v1b3).SourceGetMetadataRequest} getMetadata Information about a request to get metadata about a source.
 */
/**
 * @typedef SourceSplitRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source} source Specification of the source to be split.
 * @property {dataflow(v1b3).SourceSplitOptions} options Hints for tuning the splitting process.
 */
/**
 * @typedef SourceSplitOptions
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} desiredBundleSizeBytes The source should be split into a set of bundles where the estimated size of each is approximately this many bytes.
 * @property {string} desiredShardSizeBytes DEPRECATED in favor of desired_bundle_size_bytes.
 */
/**
 * @typedef SourceGetMetadataRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).Source} source Specification of the source whose metadata should be computed.
 */
/**
 * @typedef StreamingComputationTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} taskType A type of streaming computation task.
 * @property {dataflow(v1b3).MountedDataDisk[]} dataDisks Describes the set of data disks this task should apply to.
 * @property {dataflow(v1b3).StreamingComputationRanges[]} computationRanges Contains ranges of a streaming computation this task should apply to.
 */
/**
 * @typedef MountedDataDisk
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} dataDisk The name of the data disk. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example &quot;myproject-1014-104817-4c2-harness-0-disk-1&quot;.
 */
/**
 * @typedef StreamingComputationRanges
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} computationId The ID of the computation.
 * @property {dataflow(v1b3).KeyRangeDataDiskAssignment[]} rangeAssignments Data disk assignments for ranges from this computation.
 */
/**
 * @typedef KeyRangeDataDiskAssignment
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} start The start (inclusive) of the key range.
 * @property {string} end The end (exclusive) of the key range.
 * @property {string} dataDisk The name of the data disk where data for this range is stored. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example &quot;myproject-1014-104817-4c2-harness-0-disk-1&quot;.
 */
/**
 * @typedef StreamingConfigTask
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).StreamingComputationConfig[]} streamingComputationConfigs Set of computation configuration information.
 * @property {object} userStepToStateFamilyNameMap Map from user step names to state families.
 */
/**
 * @typedef StreamingComputationConfig
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} computationId Unique identifier for this computation.
 * @property {string} systemName System defined name for this computation.
 * @property {string} stageName Stage name of this computation.
 * @property {dataflow(v1b3).ParallelInstruction[]} instructions Instructions that comprise the computation.
 */
/**
 * @typedef SendWorkerMessagesRequest
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).WorkerMessage[]} workerMessages The WorkerMessages to send.
 */
/**
 * @typedef WorkerMessage
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {object} labels Labels are used to group WorkerMessages. For example, a worker_message about a particular container might have the labels: { &quot;JOB_ID&quot;: &quot;2015-04-22&quot;, &quot;WORKER_ID&quot;: &quot;wordcount-vm-2015…&quot; &quot;CONTAINER_TYPE&quot;: &quot;worker&quot;, &quot;CONTAINER_ID&quot;: &quot;ac1234def&quot;} Label tags typically correspond to Label enum values. However, for ease of development other strings can be used as tags. LABEL_UNSPECIFIED should not be used here.
 * @property {string} time The timestamp of the worker_message.
 * @property {dataflow(v1b3).WorkerHealthReport} workerHealthReport The health of a worker.
 * @property {dataflow(v1b3).WorkerMessageCode} workerMessageCode A worker message code.
 */
/**
 * @typedef WorkerHealthReport
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {boolean} vmIsHealthy Whether the VM is healthy.
 * @property {string} vmStartupTime The time the VM was booted.
 * @property {string} reportInterval The interval at which the worker is sending health reports. The default value of 0 should be interpreted as the field is not being explicitly set by the worker.
 * @property {object[]} pods The pods running on the worker. See: http://kubernetes.io/v1.1/docs/api-reference/v1/definitions.html#_v1_pod This field is used by the worker to send the status of the indvidual containers running on each worker.
 */
/**
 * @typedef WorkerMessageCode
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} code The code is a string intended for consumption by a machine that identifies the type of message being sent. Examples: 1. &quot;HARNESS_STARTED&quot; might be used to indicate the worker harness has started. 2. &quot;GCS_DOWNLOAD_ERROR&quot; might be used to indicate an error downloading a GCS file as part of the boot process of one of the worker containers. This is a string and not an enum to make it easy to add new codes without waiting for an API change.
 * @property {object} parameters Parameters contains specific information about the code. This is a struct to allow parameters of different types. Examples: 1. For a &quot;HARNESS_STARTED&quot; message parameters might provide the name of the worker and additional data like timing information. 2. For a &quot;GCS_DOWNLOAD_ERROR&quot; parameters might contain fields listing the GCS objects being downloaded and fields containing errors. In general complex data structures should be avoided. If a worker needs to send a specific and complicated data structure then please consider defining a new proto and adding it to the data oneof in WorkerMessageResponse. Conventions: Parameters should only be used for information that isn&#39;t typically passed as a label. hostname and other worker identifiers should almost always be passed as labels since they will be included on most messages.
 */
/**
 * @typedef SendWorkerMessagesResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).WorkerMessageResponse[]} workerMessageResponses The servers response to the worker messages.
 */
/**
 * @typedef WorkerMessageResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {dataflow(v1b3).WorkerHealthReportResponse} workerHealthReportResponse The service&#39;s response to a worker&#39;s health report.
 */
/**
 * @typedef WorkerHealthReportResponse
 * @memberOf! dataflow(v1b3)
 * @type object
 * @property {string} reportInterval A positive value indicates the worker should change its reporting interval to the specified value. The default value of zero means no change in report rate is requested by the server.
 */
module.exports = Dataflow;
