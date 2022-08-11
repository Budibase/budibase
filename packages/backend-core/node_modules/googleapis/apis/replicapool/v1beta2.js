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
 * Google Compute Engine Instance Group Manager API
 *
 * [Deprecated. Please use Instance Group Manager in Compute API] Provides groups of homogenous Compute Engine instances.
 *
 * @example
 * var google = require('googleapis');
 * var replicapool = google.replicapool('v1beta2');
 *
 * @namespace replicapool
 * @type {Function}
 * @version v1beta2
 * @variation v1beta2
 * @param {object=} options Options for Replicapool
 */
function Replicapool(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.instanceGroupManagers = {

    /**
     * replicapool.instanceGroupManagers.abandonInstances
     *
     * @desc Removes the specified instances from the managed instance group, and from any target pools of which they were members, without deleting the instances.
     *
     * @alias replicapool.instanceGroupManagers.abandonInstances
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManagersAbandonInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    abandonInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/abandonInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.delete
     *
     * @desc Deletes the instance group manager and all instances contained within. If you'd like to delete the manager without deleting the instances, you must first abandon the instances to remove them from the group.
     *
     * @alias replicapool.instanceGroupManagers.delete
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the Instance Group Manager resource to delete.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.deleteInstances
     *
     * @desc Deletes the specified instances. The instances are deleted, then removed from the instance group and any target pools of which they were a member. The targetSize of the instance group manager is reduced by the number of instances deleted.
     *
     * @alias replicapool.instanceGroupManagers.deleteInstances
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManagersDeleteInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/deleteInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.get
     *
     * @desc Returns the specified Instance Group Manager resource.
     *
     * @alias replicapool.instanceGroupManagers.get
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager Name of the instance resource to return.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.insert
     *
     * @desc Creates an instance group manager, as well as the instance group and the specified number of instances.
     *
     * @alias replicapool.instanceGroupManagers.insert
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The Google Developers Console project name.
     * @param {integer} params.size Number of instances that should exist.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManager} params.resource Request body data
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'size'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.list
     *
     * @desc Retrieves the list of Instance Group Manager resources contained within the specified zone.
     *
     * @alias replicapool.instanceGroupManagers.list
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Optional. Filter expression for filtering listed resources.
     * @param {integer=} params.maxResults Optional. Maximum count of results to be returned. Maximum value is 500 and default value is 500.
     * @param {string=} params.pageToken Optional. Tag returned by a previous list request truncated by maxResults. Used to continue a previous list request.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers',
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
     * replicapool.instanceGroupManagers.recreateInstances
     *
     * @desc Recreates the specified instances. The instances are deleted, then recreated using the instance group manager's current instance template.
     *
     * @alias replicapool.instanceGroupManagers.recreateInstances
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManagersRecreateInstancesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    recreateInstances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/recreateInstances',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.resize
     *
     * @desc Resizes the managed instance group up or down. If resized up, new instances are created using the current instance template. If resized down, instances are removed in the order outlined in Resizing a managed instance group.
     *
     * @alias replicapool.instanceGroupManagers.resize
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {integer} params.size Number of instances that should exist in this Instance Group Manager.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager', 'size'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.setInstanceTemplate
     *
     * @desc Sets the instance template to use when creating new instances in this group. Existing instances are not affected.
     *
     * @alias replicapool.instanceGroupManagers.setInstanceTemplate
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManagersSetInstanceTemplateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setInstanceTemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setInstanceTemplate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.instanceGroupManagers.setTargetPools
     *
     * @desc Modifies the target pools to which all new instances in this group are assigned. Existing instances in the group are not affected.
     *
     * @alias replicapool.instanceGroupManagers.setTargetPools
     * @memberOf! replicapool(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instanceGroupManager The name of the instance group manager.
     * @param {string} params.project The Google Developers Console project name.
     * @param {string} params.zone The name of the zone in which the instance group manager resides.
     * @param {replicapool(v1beta2).InstanceGroupManagersSetTargetPoolsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setTargetPools: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setTargetPools',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instanceGroupManager'],
        pathParams: ['instanceGroupManager', 'project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.zoneOperations = {

    /**
     * replicapool.zoneOperations.get
     *
     * @desc Retrieves the specified zone-specific operation resource.
     *
     * @alias replicapool.zoneOperations.get
     * @memberOf! replicapool(v1beta2)
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/operations/{operation}',
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
     * replicapool.zoneOperations.list
     *
     * @desc Retrieves the list of operation resources contained within the specified zone.
     *
     * @alias replicapool.zoneOperations.list
     * @memberOf! replicapool(v1beta2)
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
          url: 'https://www.googleapis.com/replicapool/v1beta2/projects/{project}/zones/{zone}/operations',
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
 * @typedef InstanceGroupManager
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {replicapool(v1beta2).ReplicaPoolAutoHealingPolicy[]} autoHealingPolicies The autohealing policy for this managed instance group. You can specify only one value.
 * @property {string} baseInstanceName The base instance name to use for instances in this group. The value must be a valid RFC1035 name. Supported characters are lowercase letters, numbers, and hyphens (-). Instances are named by appending a hyphen and a random four-character string to the base instance name.
 * @property {string} creationTimestamp [Output only] The time the instance group manager was created, in RFC3339 text format.
 * @property {integer} currentSize [Output only] The number of instances that currently exist and are a part of this group. This includes instances that are starting but are not yet RUNNING, and instances that are in the process of being deleted or abandoned.
 * @property {string} description An optional textual description of the instance group manager.
 * @property {string} fingerprint [Output only] Fingerprint of the instance group manager. This field is used for optimistic locking. An up-to-date fingerprint must be provided in order to modify the Instance Group Manager resource.
 * @property {string} group [Output only] The full URL of the instance group created by the manager. This group contains all of the instances being managed, and cannot contain non-managed instances.
 * @property {string} id [Output only] A server-assigned unique identifier for the resource.
 * @property {string} instanceTemplate The full URL to an instance template from which all new instances will be created.
 * @property {string} kind [Output only] The resource type. Always replicapool#instanceGroupManager.
 * @property {string} name The name of the instance group manager. Must be 1-63 characters long and comply with RFC1035. Supported characters include lowercase letters, numbers, and hyphens.
 * @property {string} selfLink [Output only] The fully qualified URL for this resource.
 * @property {string[]} targetPools The full URL of all target pools to which new instances in the group are added. Updating the target pool values does not affect existing instances.
 * @property {integer} targetSize [Output only] The number of instances that the manager is attempting to maintain. Deleting or abandoning instances affects this number, as does resizing the group.
 */
/**
 * @typedef InstanceGroupManagerList
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {replicapool(v1beta2).InstanceGroupManager[]} items A list of instance resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken A token used to continue a truncated list request (output only).
 * @property {string} selfLink Server defined URL for this resource (output only).
 */
/**
 * @typedef InstanceGroupManagersAbandonInstancesRequest
 * @memberOf! replicapool(v1beta2)
 * @type object
* @property {string[]} instances The names of one or more instances to abandon. For example:
{ &#39;instances&#39;: [ &#39;instance-c3po&#39;, &#39;instance-r2d2&#39; ] }
*/
/**
 * @typedef InstanceGroupManagersDeleteInstancesRequest
 * @memberOf! replicapool(v1beta2)
 * @type object
* @property {string[]} instances Names of instances to delete.

Example: &#39;instance-foo&#39;, &#39;instance-bar&#39;
*/
/**
 * @typedef InstanceGroupManagersRecreateInstancesRequest
 * @memberOf! replicapool(v1beta2)
 * @type object
* @property {string[]} instances The names of one or more instances to recreate. For example:
{ &#39;instances&#39;: [ &#39;instance-c3po&#39;, &#39;instance-r2d2&#39; ] }
*/
/**
 * @typedef InstanceGroupManagersSetInstanceTemplateRequest
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} instanceTemplate The full URL to an Instance Template from which all new instances will be created.
 */
/**
 * @typedef InstanceGroupManagersSetTargetPoolsRequest
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} fingerprint The current fingerprint of the Instance Group Manager resource. If this does not match the server-side fingerprint of the resource, then the request will be rejected.
 * @property {string[]} targetPools A list of fully-qualified URLs to existing Target Pool resources. New instances in the Instance Group Manager will be added to the specified target pools; existing instances are not affected.
 */
/**
 * @typedef Operation
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} clientOperationId [Output only] An optional identifier specified by the client when the mutation was initiated. Must be unique for all operation resources in the project.
 * @property {string} creationTimestamp [Output Only] The time that this operation was requested, in RFC3339 text format.
 * @property {string} endTime [Output Only] The time that this operation was completed, in RFC3339 text format.
 * @property {object} error [Output Only] If errors occurred during processing of this operation, this field will be populated.
 * @property {string} httpErrorMessage [Output only] If operation fails, the HTTP error message returned.
 * @property {integer} httpErrorStatusCode [Output only] If operation fails, the HTTP error status code returned.
 * @property {string} id [Output Only] Unique identifier for the resource, generated by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested, in RFC3339 text format.
 * @property {string} kind [Output only] Type of the resource.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType [Output only] Type of the operation. Operations include insert, update, and delete.
 * @property {integer} progress [Output only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess at when the operation will be complete. This number should be monotonically increasing as the operation progresses.
 * @property {string} region [Output Only] URL of the region where the operation resides. Only available when performing regional operations.
 * @property {string} selfLink [Output Only] Server-defined fully-qualified URL for this resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server, in RFC3339 text format.
 * @property {string} status [Output Only] Status of the operation.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] Unique target ID which identifies a particular incarnation of the target.
 * @property {string} targetLink [Output only] URL of the resource the operation is mutating.
 * @property {string} user [Output Only] User who requested the operation, for example: user@example.com.
 * @property {object[]} warnings [Output Only] If there are issues with this operation, a warning is returned.
 * @property {string} zone [Output Only] URL of the zone where the operation resides. Only available when performing per-zone operations.
 */
/**
 * @typedef OperationList
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} id Unique identifier for the resource; defined by the server (output only).
 * @property {replicapool(v1beta2).Operation[]} items The operation resources.
 * @property {string} kind Type of resource.
 * @property {string} nextPageToken A token used to continue a truncated list request (output only).
 * @property {string} selfLink Server defined URL for this resource (output only).
 */
/**
 * @typedef ReplicaPoolAutoHealingPolicy
 * @memberOf! replicapool(v1beta2)
 * @type object
 * @property {string} actionType The action to perform when an instance becomes unhealthy. Possible values are RECREATE or REBOOT. RECREATE replaces an unhealthy instance with a new instance that is based on the instance template for this managed instance group. REBOOT performs a soft reboot on an instance. If the instance cannot reboot, the instance performs a hard restart.
 * @property {string} healthCheck The URL for the HealthCheck that signals autohealing.
 */
module.exports = Replicapool;
