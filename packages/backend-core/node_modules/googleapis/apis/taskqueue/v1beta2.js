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
 * TaskQueue API
 *
 * Accesses a Google App Engine Pull Task Queue over REST.
 *
 * @example
 * var google = require('googleapis');
 * var taskqueue = google.taskqueue('v1beta2');
 *
 * @namespace taskqueue
 * @type {Function}
 * @version v1beta2
 * @variation v1beta2
 * @param {object=} options Options for Taskqueue
 */
function Taskqueue(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.taskqueues = {

    /**
     * taskqueue.taskqueues.get
     *
     * @desc Get detailed information about a TaskQueue.
     *
     * @alias taskqueue.taskqueues.get
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.getStats Whether to get stats. Optional.
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.taskqueue The id of the taskqueue to get the properties of.
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue'],
        pathParams: ['project', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.tasks = {

    /**
     * taskqueue.tasks.delete
     *
     * @desc Delete a task from a TaskQueue.
     *
     * @alias taskqueue.tasks.delete
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.task The id of the task to delete.
     * @param {string} params.taskqueue The taskqueue to delete a task from.
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks/{task}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue', 'task'],
        pathParams: ['project', 'task', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.get
     *
     * @desc Get a particular task from a TaskQueue.
     *
     * @alias taskqueue.tasks.get
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.task The task to get properties of.
     * @param {string} params.taskqueue The taskqueue in which the task belongs.
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks/{task}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue', 'task'],
        pathParams: ['project', 'task', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.insert
     *
     * @desc Insert a new task in a TaskQueue
     *
     * @alias taskqueue.tasks.insert
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project under which the queue lies
     * @param {string} params.taskqueue The taskqueue to insert the task into
     * @param {taskqueue(v1beta2).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue'],
        pathParams: ['project', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.lease
     *
     * @desc Lease 1 or more tasks from a TaskQueue.
     *
     * @alias taskqueue.tasks.lease
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.groupByTag When true, all returned tasks will have the same tag
     * @param {integer} params.leaseSecs The lease in seconds.
     * @param {integer} params.numTasks The number of tasks to lease.
     * @param {string} params.project The project under which the queue lies.
     * @param {string=} params.tag The tag allowed for tasks in the response. Must only be specified if group_by_tag is true. If group_by_tag is true and tag is not specified the tag will be that of the oldest task by eta, i.e. the first available tag
     * @param {string} params.taskqueue The taskqueue to lease a task from.
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks/lease',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue', 'numTasks', 'leaseSecs'],
        pathParams: ['project', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.list
     *
     * @desc List Tasks in a TaskQueue
     *
     * @alias taskqueue.tasks.list
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.taskqueue The id of the taskqueue to list tasks from.
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue'],
        pathParams: ['project', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.patch
     *
     * @desc Update tasks that are leased out of a TaskQueue. This method supports patch semantics.
     *
     * @alias taskqueue.tasks.patch
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.newLeaseSeconds The new lease in seconds.
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.task 
     * @param {string} params.taskqueue 
     * @param {taskqueue(v1beta2).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks/{task}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue', 'task', 'newLeaseSeconds'],
        pathParams: ['project', 'task', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * taskqueue.tasks.update
     *
     * @desc Update tasks that are leased out of a TaskQueue.
     *
     * @alias taskqueue.tasks.update
     * @memberOf! taskqueue(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.newLeaseSeconds The new lease in seconds.
     * @param {string} params.project The project under which the queue lies.
     * @param {string} params.task 
     * @param {string} params.taskqueue 
     * @param {taskqueue(v1beta2).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/taskqueue/v1beta2/projects/{project}/taskqueues/{taskqueue}/tasks/{task}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'taskqueue', 'task', 'newLeaseSeconds'],
        pathParams: ['project', 'task', 'taskqueue'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Task
 * @memberOf! taskqueue(v1beta2)
 * @type object
 * @property {string} enqueueTimestamp Time (in seconds since the epoch) at which the task was enqueued.
 * @property {string} id Name of the task.
 * @property {string} kind The kind of object returned, in this case set to task.
 * @property {string} leaseTimestamp Time (in seconds since the epoch) at which the task lease will expire. This value is 0 if the task isnt currently leased out to a worker.
 * @property {string} payloadBase64 A bag of bytes which is the task payload. The payload on the JSON side is always Base64 encoded.
 * @property {string} queueName Name of the queue that the task is in.
 * @property {integer} retry_count The number of leases applied to this task.
 * @property {string} tag Tag for the task, could be used later to lease tasks grouped by a specific tag.
 */
/**
 * @typedef TaskQueue
 * @memberOf! taskqueue(v1beta2)
 * @type object
 * @property {object} acl ACLs that are applicable to this TaskQueue object.
 * @property {string} id Name of the taskqueue.
 * @property {string} kind The kind of REST object returned, in this case taskqueue.
 * @property {integer} maxLeases The number of times we should lease out tasks before giving up on them. If unset we lease them out forever until a worker deletes the task.
 * @property {object} stats Statistics for the TaskQueue object in question.
 */
/**
 * @typedef Tasks
 * @memberOf! taskqueue(v1beta2)
 * @type object
 * @property {taskqueue(v1beta2).Task[]} items The actual list of tasks returned as a result of the lease operation.
 * @property {string} kind The kind of object returned, a list of tasks.
 */
/**
 * @typedef Tasks2
 * @memberOf! taskqueue(v1beta2)
 * @type object
 * @property {taskqueue(v1beta2).Task[]} items The actual list of tasks currently active in the TaskQueue.
 * @property {string} kind The kind of object returned, a list of tasks.
 */
module.exports = Taskqueue;
