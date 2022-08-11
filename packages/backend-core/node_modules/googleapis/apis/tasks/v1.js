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
 * Tasks API
 *
 * Lets you manage your tasks and task lists.
 *
 * @example
 * var google = require('googleapis');
 * var tasks = google.tasks('v1');
 *
 * @namespace tasks
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Tasks
 */
function Tasks(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.tasklists = {

    /**
     * tasks.tasklists.delete
     *
     * @desc Deletes the authenticated user's specified task list.
     *
     * @alias tasks.tasklists.delete
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tasklist Task list identifier.
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists/{tasklist}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasklists.get
     *
     * @desc Returns the authenticated user's specified task list.
     *
     * @alias tasks.tasklists.get
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tasklist Task list identifier.
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists/{tasklist}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasklists.insert
     *
     * @desc Creates a new task list and adds it to the authenticated user's task lists.
     *
     * @alias tasks.tasklists.insert
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {tasks(v1).TaskList} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
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
     * tasks.tasklists.list
     *
     * @desc Returns all the authenticated user's task lists.
     *
     * @alias tasks.tasklists.list
     * @memberOf! tasks(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.maxResults Maximum number of task lists returned on one page. Optional. The default is 100.
     * @param {string=} params.pageToken Token specifying the result page to return. Optional.
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists',
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
     * tasks.tasklists.patch
     *
     * @desc Updates the authenticated user's specified task list. This method supports patch semantics.
     *
     * @alias tasks.tasklists.patch
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tasklist Task list identifier.
     * @param {tasks(v1).TaskList} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists/{tasklist}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasklists.update
     *
     * @desc Updates the authenticated user's specified task list.
     *
     * @alias tasks.tasklists.update
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tasklist Task list identifier.
     * @param {tasks(v1).TaskList} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/users/@me/lists/{tasklist}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.tasks = {

    /**
     * tasks.tasks.clear
     *
     * @desc Clears all completed tasks from the specified task list. The affected tasks will be marked as 'hidden' and no longer be returned by default when retrieving all tasks for a task list.
     *
     * @alias tasks.tasks.clear
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tasklist Task list identifier.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    clear: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/clear',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.delete
     *
     * @desc Deletes the specified task from the task list.
     *
     * @alias tasks.tasks.delete
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.task Task identifier.
     * @param {string} params.tasklist Task list identifier.
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks/{task}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tasklist', 'task'],
        pathParams: ['task', 'tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.get
     *
     * @desc Returns the specified task.
     *
     * @alias tasks.tasks.get
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.task Task identifier.
     * @param {string} params.tasklist Task list identifier.
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks/{task}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tasklist', 'task'],
        pathParams: ['task', 'tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.insert
     *
     * @desc Creates a new task on the specified task list.
     *
     * @alias tasks.tasks.insert
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.parent Parent task identifier. If the task is created at the top level, this parameter is omitted. Optional.
     * @param {string=} params.previous Previous sibling task identifier. If the task is created at the first position among its siblings, this parameter is omitted. Optional.
     * @param {string} params.tasklist Task list identifier.
     * @param {tasks(v1).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.list
     *
     * @desc Returns all tasks in the specified task list.
     *
     * @alias tasks.tasks.list
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.completedMax Upper bound for a task's completion date (as a RFC 3339 timestamp) to filter by. Optional. The default is not to filter by completion date.
     * @param {string=} params.completedMin Lower bound for a task's completion date (as a RFC 3339 timestamp) to filter by. Optional. The default is not to filter by completion date.
     * @param {string=} params.dueMax Upper bound for a task's due date (as a RFC 3339 timestamp) to filter by. Optional. The default is not to filter by due date.
     * @param {string=} params.dueMin Lower bound for a task's due date (as a RFC 3339 timestamp) to filter by. Optional. The default is not to filter by due date.
     * @param {string=} params.maxResults Maximum number of task lists returned on one page. Optional. The default is 100.
     * @param {string=} params.pageToken Token specifying the result page to return. Optional.
     * @param {boolean=} params.showCompleted Flag indicating whether completed tasks are returned in the result. Optional. The default is True.
     * @param {boolean=} params.showDeleted Flag indicating whether deleted tasks are returned in the result. Optional. The default is False.
     * @param {boolean=} params.showHidden Flag indicating whether hidden tasks are returned in the result. Optional. The default is False.
     * @param {string} params.tasklist Task list identifier.
     * @param {string=} params.updatedMin Lower bound for a task's last modification time (as a RFC 3339 timestamp) to filter by. Optional. The default is not to filter by last modification time.
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tasklist'],
        pathParams: ['tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.move
     *
     * @desc Moves the specified task to another position in the task list. This can include putting it as a child task under a new parent and/or move it to a different position among its sibling tasks.
     *
     * @alias tasks.tasks.move
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.parent New parent task identifier. If the task is moved to the top level, this parameter is omitted. Optional.
     * @param {string=} params.previous New previous sibling task identifier. If the task is moved to the first position among its siblings, this parameter is omitted. Optional.
     * @param {string} params.task Task identifier.
     * @param {string} params.tasklist Task list identifier.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    move: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks/{task}/move',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tasklist', 'task'],
        pathParams: ['task', 'tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.patch
     *
     * @desc Updates the specified task. This method supports patch semantics.
     *
     * @alias tasks.tasks.patch
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.task Task identifier.
     * @param {string} params.tasklist Task list identifier.
     * @param {tasks(v1).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks/{task}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tasklist', 'task'],
        pathParams: ['task', 'tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tasks.tasks.update
     *
     * @desc Updates the specified task.
     *
     * @alias tasks.tasks.update
     * @memberOf! tasks(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.task Task identifier.
     * @param {string} params.tasklist Task list identifier.
     * @param {tasks(v1).Task} params.resource Request body data
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
          url: 'https://www.googleapis.com/tasks/v1/lists/{tasklist}/tasks/{task}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tasklist', 'task'],
        pathParams: ['task', 'tasklist'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Task
 * @memberOf! tasks(v1)
 * @type object
 * @property {string} completed Completion date of the task (as a RFC 3339 timestamp). This field is omitted if the task has not been completed.
 * @property {boolean} deleted Flag indicating whether the task has been deleted. The default if False.
 * @property {string} due Due date of the task (as a RFC 3339 timestamp). Optional.
 * @property {string} etag ETag of the resource.
 * @property {boolean} hidden Flag indicating whether the task is hidden. This is the case if the task had been marked completed when the task list was last cleared. The default is False. This field is read-only.
 * @property {string} id Task identifier.
 * @property {string} kind Type of the resource. This is always &quot;tasks#task&quot;.
 * @property {object[]} links Collection of links. This collection is read-only.
 * @property {string} notes Notes describing the task. Optional.
 * @property {string} parent Parent task identifier. This field is omitted if it is a top-level task. This field is read-only. Use the &quot;move&quot; method to move the task under a different parent or to the top level.
 * @property {string} position String indicating the position of the task among its sibling tasks under the same parent task or at the top level. If this string is greater than another task&#39;s corresponding position string according to lexicographical ordering, the task is positioned after the other task under the same parent task (or at the top level). This field is read-only. Use the &quot;move&quot; method to move the task to another position.
 * @property {string} selfLink URL pointing to this task. Used to retrieve, update, or delete this task.
 * @property {string} status Status of the task. This is either &quot;needsAction&quot; or &quot;completed&quot;.
 * @property {string} title Title of the task.
 * @property {string} updated Last modification time of the task (as a RFC 3339 timestamp).
 */
/**
 * @typedef TaskList
 * @memberOf! tasks(v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} id Task list identifier.
 * @property {string} kind Type of the resource. This is always &quot;tasks#taskList&quot;.
 * @property {string} selfLink URL pointing to this task list. Used to retrieve, update, or delete this task list.
 * @property {string} title Title of the task list.
 * @property {string} updated Last modification time of the task list (as a RFC 3339 timestamp).
 */
/**
 * @typedef TaskLists
 * @memberOf! tasks(v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {tasks(v1).TaskList[]} items Collection of task lists.
 * @property {string} kind Type of the resource. This is always &quot;tasks#taskLists&quot;.
 * @property {string} nextPageToken Token that can be used to request the next page of this result.
 */
/**
 * @typedef Tasks
 * @memberOf! tasks(v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {tasks(v1).Task[]} items Collection of tasks.
 * @property {string} kind Type of the resource. This is always &quot;tasks#tasks&quot;.
 * @property {string} nextPageToken Token used to access the next page of this result.
 */
module.exports = Tasks;
