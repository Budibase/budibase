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
 * Google Compute Engine Instance Group Updater API
 *
 * [Deprecated. Please use compute.instanceGroupManagers.update method. replicapoolupdater API will be disabled after December 30th, 2016] Updates groups of Compute Engine instances.
 *
 * @example
 * var google = require('googleapis');
 * var replicapoolupdater = google.replicapoolupdater('v1beta1');
 *
 * @namespace replicapoolupdater
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Replicapoolupdater
 */
function Replicapoolupdater(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.rollingUpdates = {

    /**
     * replicapoolupdater.rollingUpdates.cancel
     *
     * @desc Cancels an update. The update must be PAUSED before it can be cancelled. This has no effect if the update is already CANCELLED.
     *
     * @alias replicapoolupdater.rollingUpdates.cancel
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}/cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.get
     *
     * @desc Returns information about an update.
     *
     * @alias replicapoolupdater.rollingUpdates.get
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.insert
     *
     * @desc Inserts and starts a new update.
     *
     * @alias replicapoolupdater.rollingUpdates.insert
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the update's target resides.
     * @param {replicapoolupdater(v1beta1).RollingUpdate} params.resource Request body data
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.list
     *
     * @desc Lists recent updates for a given managed instance group, in reverse chronological order and paginated format.
     *
     * @alias replicapoolupdater.rollingUpdates.list
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Optional. Filter expression for filtering listed resources.
     * @param {integer=} params.maxResults Optional. Maximum count of results to be returned. Maximum value is 500 and default value is 500.
     * @param {string=} params.pageToken Optional. Tag returned by a previous list request truncated by maxResults. Used to continue a previous list request.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the update's target resides.
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.listInstanceUpdates
     *
     * @desc Lists the current status for each instance within a given update.
     *
     * @alias replicapoolupdater.rollingUpdates.listInstanceUpdates
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Optional. Filter expression for filtering listed resources.
     * @param {integer=} params.maxResults Optional. Maximum count of results to be returned. Maximum value is 500 and default value is 500.
     * @param {string=} params.pageToken Optional. Tag returned by a previous list request truncated by maxResults. Used to continue a previous list request.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listInstanceUpdates: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}/instanceUpdates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.pause
     *
     * @desc Pauses the update in state from ROLLING_FORWARD or ROLLING_BACK. Has no effect if invoked when the state of the update is PAUSED.
     *
     * @alias replicapoolupdater.rollingUpdates.pause
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    pause: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}/pause',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.resume
     *
     * @desc Continues an update in PAUSED state. Has no effect if invoked when the state of the update is ROLLED_OUT.
     *
     * @alias replicapoolupdater.rollingUpdates.resume
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resume: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}/resume',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.rollingUpdates.rollback
     *
     * @desc Rolls back the update in state from ROLLING_FORWARD or PAUSED. Has no effect if invoked when the state of the update is ROLLED_BACK.
     *
     * @alias replicapoolupdater.rollingUpdates.rollback
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.rollingUpdate The name of the update.
     * @param {string} params.zone The name of the zone in which the update's target resides.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    rollback: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/rollingUpdates/{rollingUpdate}/rollback',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'rollingUpdate'],
        pathParams: ['project', 'rollingUpdate', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.zoneOperations = {

    /**
     * replicapoolupdater.zoneOperations.get
     *
     * @desc Retrieves the specified zone-specific operation resource.
     *
     * @alias replicapoolupdater.zoneOperations.get
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the operation resource to return.
     * @param {string} params.project Name of the project scoping this request.
     * @param {string} params.zone Name of the zone scoping this request.
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'operation'],
        pathParams: ['operation', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapoolupdater.zoneOperations.list
     *
     * @desc Retrieves the list of Operation resources contained within the specified zone.
     *
     * @alias replicapoolupdater.zoneOperations.list
     * @memberOf! replicapoolupdater(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Optional. Filter expression for filtering listed resources.
     * @param {integer=} params.maxResults Optional. Maximum count of results to be returned. Maximum value is 500 and default value is 500.
     * @param {string=} params.pageToken Optional. Tag returned by a previous list request truncated by maxResults. Used to continue a previous list request.
     * @param {string} params.project Name of the project scoping this request.
     * @param {string} params.zone Name of the zone scoping this request.
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
          url: 'https://www.googleapis.com/replicapoolupdater/v1beta1/projects/{project}/zones/{zone}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef InstanceUpdate
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
* @property {object} error Errors that occurred during the instance update.
* @property {string} instance Fully-qualified URL of the instance being updated.
* @property {string} status Status of the instance update. Possible values are:  
- &quot;PENDING&quot;: The instance update is pending execution. 
- &quot;ROLLING_FORWARD&quot;: The instance update is going forward. 
- &quot;ROLLING_BACK&quot;: The instance update is being rolled back. 
- &quot;PAUSED&quot;: The instance update is temporarily paused (inactive). 
- &quot;ROLLED_OUT&quot;: The instance update is finished, the instance is running the new template. 
- &quot;ROLLED_BACK&quot;: The instance update is finished, the instance has been reverted to the previous template. 
- &quot;CANCELLED&quot;: The instance update is paused and no longer can be resumed, undefined in which template the instance is running.
*/
/**
 * @typedef InstanceUpdateList
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
 * @property {replicapoolupdater(v1beta1).InstanceUpdate[]} items Collection of requested instance updates.
 * @property {string} kind [Output Only] Type of the resource.
 * @property {string} nextPageToken A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] The fully qualified URL for the resource.
 */
/**
 * @typedef Operation
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
 * @property {string} clientOperationId 
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} endTime 
 * @property {object} error [Output Only] If errors occurred during processing of this operation, this field will be populated.
 * @property {string} httpErrorMessage 
 * @property {integer} httpErrorStatusCode 
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested. This is in RFC 3339 format.
 * @property {string} kind [Output Only] Type of the resource. Always replicapoolupdater#operation for Operation resources.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType 
 * @property {integer} progress 
 * @property {string} region [Output Only] URL of the region where the operation resides.
 * @property {string} selfLink [Output Only] The fully qualified URL for the resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server. This is in RFC 3339 format.
 * @property {string} status [Output Only] Status of the operation. Can be one of the following: &quot;PENDING&quot;, &quot;RUNNING&quot;, or &quot;DONE&quot;.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] Unique target id which identifies a particular incarnation of the target.
 * @property {string} targetLink [Output Only] URL of the resource the operation is mutating.
 * @property {string} user 
 * @property {object[]} warnings 
 * @property {string} zone [Output Only] URL of the zone where the operation resides.
 */
/**
 * @typedef OperationList
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {replicapoolupdater(v1beta1).Operation[]} items [Output Only] The Operation resources.
 * @property {string} kind [Output Only] Type of resource. Always replicapoolupdater#operationList for OperationList resources.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncate.
 * @property {string} selfLink [Output Only] The fully qualified URL for the resource.
 */
/**
 * @typedef RollingUpdate
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
* @property {string} actionType Specifies the action to take for each instance within the instance group. This can be RECREATE which will recreate each instance and is only available for managed instance groups. It can also be REBOOT which performs a soft reboot for each instance and is only available for regular (non-managed) instance groups.
* @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
* @property {string} description An optional textual description of the resource; provided by the client when the resource is created.
* @property {object} error [Output Only] Errors that occurred during the rolling update.
* @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
* @property {string} instanceGroup Fully-qualified URL of an instance group being updated. Exactly one of instanceGroupManager and instanceGroup must be set.
* @property {string} instanceGroupManager Fully-qualified URL of an instance group manager being updated. Exactly one of instanceGroupManager and instanceGroup must be set.
* @property {string} instanceTemplate Fully-qualified URL of an instance template to apply.
* @property {string} kind [Output Only] Type of the resource.
* @property {string} oldInstanceTemplate Fully-qualified URL of the instance template encountered while starting the update.
* @property {object} policy Parameters of the update process.
* @property {integer} progress [Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess at when the update will be complete. This number should be monotonically increasing as the update progresses.
* @property {string} selfLink [Output Only] The fully qualified URL for the resource.
* @property {string} status [Output Only] Status of the update. Possible values are:  
- &quot;ROLLING_FORWARD&quot;: The update is going forward. 
- &quot;ROLLING_BACK&quot;: The update is being rolled back. 
- &quot;PAUSED&quot;: The update is temporarily paused (inactive). 
- &quot;ROLLED_OUT&quot;: The update is finished, all instances have been updated successfully. 
- &quot;ROLLED_BACK&quot;: The update is finished, all instances have been reverted to the previous template. 
- &quot;CANCELLED&quot;: The update is paused and no longer can be resumed, undefined how many instances are running in which template.
* @property {string} statusMessage [Output Only] An optional textual description of the current status of the update.
* @property {string} user [Output Only] User who requested the update, for example: user@example.com.
*/
/**
 * @typedef RollingUpdateList
 * @memberOf! replicapoolupdater(v1beta1)
 * @type object
 * @property {replicapoolupdater(v1beta1).RollingUpdate[]} items Collection of requested updates.
 * @property {string} kind [Output Only] Type of the resource.
 * @property {string} nextPageToken A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] The fully qualified URL for the resource.
 */
module.exports = Replicapoolupdater;
