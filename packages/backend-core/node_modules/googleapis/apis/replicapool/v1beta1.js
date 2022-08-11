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
 * Replica Pool API
 *
 * The Replica Pool API allows users to declaratively provision and manage groups of Google Compute Engine instances based on a common template.
 *
 * @example
 * var google = require('googleapis');
 * var replicapool = google.replicapool('v1beta1');
 *
 * @namespace replicapool
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Replicapool
 */
function Replicapool(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.pools = {

    /**
     * replicapool.pools.delete
     *
     * @desc Deletes a replica pool.
     *
     * @alias replicapool.pools.delete
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The name of the replica pool for this request.
     * @param {string} params.projectName The project ID for this replica pool.
     * @param {string} params.zone The zone for this replica pool.
     * @param {replicapool(v1beta1).PoolsDeleteRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName'],
        pathParams: ['poolName', 'projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.pools.get
     *
     * @desc Gets information about a single replica pool.
     *
     * @alias replicapool.pools.get
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The name of the replica pool for this request.
     * @param {string} params.projectName The project ID for this replica pool.
     * @param {string} params.zone The zone for this replica pool.
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName'],
        pathParams: ['poolName', 'projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.pools.insert
     *
     * @desc Inserts a new replica pool.
     *
     * @alias replicapool.pools.insert
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName The project ID for this replica pool.
     * @param {string} params.zone The zone for this replica pool.
     * @param {replicapool(v1beta1).Pool} params.resource Request body data
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone'],
        pathParams: ['projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.pools.list
     *
     * @desc List all replica pools.
     *
     * @alias replicapool.pools.list
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 100, inclusive. (Default: 50)
     * @param {string=} params.pageToken Set this to the nextPageToken value returned by a previous list request to obtain the next page of results from the previous list request.
     * @param {string} params.projectName The project ID for this request.
     * @param {string} params.zone The zone for this replica pool.
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone'],
        pathParams: ['projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.pools.resize
     *
     * @desc Resize a pool. This is an asynchronous operation, and multiple overlapping resize requests can be made. Replica Pools will use the information from the last resize request.
     *
     * @alias replicapool.pools.resize
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.numReplicas The desired number of replicas to resize to. If this number is larger than the existing number of replicas, new replicas will be added. If the number is smaller, then existing replicas will be deleted.
     * @param {string} params.poolName The name of the replica pool for this request.
     * @param {string} params.projectName The project ID for this replica pool.
     * @param {string} params.zone The zone for this replica pool.
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/resize',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName'],
        pathParams: ['poolName', 'projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.pools.updatetemplate
     *
     * @desc Update the template used by the pool.
     *
     * @alias replicapool.pools.updatetemplate
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The name of the replica pool for this request.
     * @param {string} params.projectName The project ID for this replica pool.
     * @param {string} params.zone The zone for this replica pool.
     * @param {replicapool(v1beta1).Template} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updatetemplate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/updateTemplate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName'],
        pathParams: ['poolName', 'projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.replicas = {

    /**
     * replicapool.replicas.delete
     *
     * @desc Deletes a replica from the pool.
     *
     * @alias replicapool.replicas.delete
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The replica pool name for this request.
     * @param {string} params.projectName The project ID for this request.
     * @param {string} params.replicaName The name of the replica for this request.
     * @param {string} params.zone The zone where the replica lives.
     * @param {replicapool(v1beta1).ReplicasDeleteRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/replicas/{replicaName}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName', 'replicaName'],
        pathParams: ['poolName', 'projectName', 'replicaName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.replicas.get
     *
     * @desc Gets information about a specific replica.
     *
     * @alias replicapool.replicas.get
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The replica pool name for this request.
     * @param {string} params.projectName The project ID for this request.
     * @param {string} params.replicaName The name of the replica for this request.
     * @param {string} params.zone The zone where the replica lives.
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/replicas/{replicaName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName', 'replicaName'],
        pathParams: ['poolName', 'projectName', 'replicaName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.replicas.list
     *
     * @desc Lists all replicas in a pool.
     *
     * @alias replicapool.replicas.list
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum count of results to be returned. Acceptable values are 0 to 100, inclusive. (Default: 50)
     * @param {string=} params.pageToken Set this to the nextPageToken value returned by a previous list request to obtain the next page of results from the previous list request.
     * @param {string} params.poolName The replica pool name for this request.
     * @param {string} params.projectName The project ID for this request.
     * @param {string} params.zone The zone where the replica pool lives.
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
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/replicas',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName'],
        pathParams: ['poolName', 'projectName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * replicapool.replicas.restart
     *
     * @desc Restarts a replica in a pool.
     *
     * @alias replicapool.replicas.restart
     * @memberOf! replicapool(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.poolName The replica pool name for this request.
     * @param {string} params.projectName The project ID for this request.
     * @param {string} params.replicaName The name of the replica for this request.
     * @param {string} params.zone The zone where the replica lives.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    restart: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/replicapool/v1beta1/projects/{projectName}/zones/{zone}/pools/{poolName}/replicas/{replicaName}/restart',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['projectName', 'zone', 'poolName', 'replicaName'],
        pathParams: ['poolName', 'projectName', 'replicaName', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AccessConfig
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} name Name of this access configuration.
 * @property {string} natIp An external IP address associated with this instance.
 * @property {string} type Type of this access configuration file. Currently only ONE_TO_ONE_NAT is supported.
 */
/**
 * @typedef Action
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string[]} commands A list of commands to run, one per line. If any command fails, the whole action is considered a failure and no further actions are run. This also marks the virtual machine or replica as a failure.
 * @property {replicapool(v1beta1).EnvVariable[]} envVariables A list of environment variables to use for the commands in this action.
 * @property {integer} timeoutMilliSeconds If an action&#39;s commands on a particular replica do not finish in the specified timeoutMilliSeconds, the replica is considered to be in a FAILING state. No efforts are made to stop any processes that were spawned or created as the result of running the action&#39;s commands. The default is the max allowed value, 1 hour (i.e. 3600000 milliseconds).
 */
/**
 * @typedef DiskAttachment
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} deviceName The device name of this disk.
 * @property {integer} index A zero-based index to assign to this disk, where 0 is reserved for the boot disk. If not specified, this is assigned by the server.
 */
/**
 * @typedef EnvVariable
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {boolean} hidden Deprecated, do not use.
 * @property {string} name The name of the environment variable.
 * @property {string} value The value of the variable.
 */
/**
 * @typedef ExistingDisk
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {replicapool(v1beta1).DiskAttachment} attachment How the disk will be attached to the Replica.
 * @property {string} source The name of the Persistent Disk resource. The Persistent Disk resource must be in the same zone as the Pool.
 */
/**
 * @typedef HealthCheck
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {integer} checkIntervalSec How often (in seconds) to make HTTP requests for this healthcheck. The default value is 5 seconds.
 * @property {string} description The description for this health check.
 * @property {integer} healthyThreshold The number of consecutive health check requests that need to succeed before the replica is considered healthy again. The default value is 2.
 * @property {string} host The value of the host header in the HTTP health check request. If left empty (default value), the localhost IP 127.0.0.1 will be used.
 * @property {string} name The name of this health check.
 * @property {string} path The localhost request path to send this health check, in the format /path/to/use. For example, /healthcheck.
 * @property {integer} port The TCP port for the health check requests.
 * @property {integer} timeoutSec How long (in seconds) to wait before a timeout failure for this healthcheck. The default value is 5 seconds.
 * @property {integer} unhealthyThreshold The number of consecutive health check requests that need to fail in order to consider the replica unhealthy. The default value is 2.
 */
/**
 * @typedef Label
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} key The key for this label.
 * @property {string} value The value of this label.
 */
/**
 * @typedef Metadata
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} fingerPrint The fingerprint of the metadata. Required for updating the metadata entries for this instance.
 * @property {replicapool(v1beta1).MetadataItem[]} items A list of metadata items.
 */
/**
 * @typedef MetadataItem
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} key A metadata key.
 * @property {string} value A metadata value.
 */
/**
 * @typedef NetworkInterface
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {replicapool(v1beta1).AccessConfig[]} accessConfigs An array of configurations for this interface. This specifies how this interface is configured to interact with other network services.
 * @property {string} network Name the Network resource to which this interface applies.
 * @property {string} networkIp An optional IPV4 internal network address to assign to the instance for this network interface.
 */
/**
 * @typedef NewDisk
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {replicapool(v1beta1).DiskAttachment} attachment How the disk will be attached to the Replica.
 * @property {boolean} autoDelete If true, then this disk will be deleted when the instance is deleted. The default value is true.
 * @property {boolean} boot If true, indicates that this is the root persistent disk.
 * @property {replicapool(v1beta1).NewDiskInitializeParams} initializeParams Create the new disk using these parameters. The name of the disk will be &lt;instance_name&gt;-&lt;four_random_charactersgt;.
 */
/**
 * @typedef NewDiskInitializeParams
 * @memberOf! replicapool(v1beta1)
 * @type object
* @property {string} diskSizeGb The size of the created disk in gigabytes.
* @property {string} diskType Name of the disk type resource describing which disk type to use to create the disk. For example &#39;pd-ssd&#39; or &#39;pd-standard&#39;. Default is &#39;pd-standard&#39;
* @property {string} sourceImage The name or fully-qualified URL of a source image to use to create this disk. If you provide a name of the source image, Replica Pool will look for an image with that name in your project. If you are specifying an image provided by Compute Engine, you will need to provide the full URL with the correct project, such as:
http://www.googleapis.com/compute/v1/projects/debian-cloud/ global/images/debian-wheezy-7-vYYYYMMDD
*/
/**
 * @typedef Pool
 * @memberOf! replicapool(v1beta1)
 * @type object
* @property {boolean} autoRestart Whether replicas in this pool should be restarted if they experience a failure. The default value is true.
* @property {string} baseInstanceName The base instance name to use for the replicas in this pool. This must match the regex [a-z]([-a-z0-9]*[a-z0-9])?. If specified, the instances in this replica pool will be named in the format &lt;base-instance-name&gt;-&lt;ID&gt;. The &lt;ID&gt; postfix will be a four character alphanumeric identifier generated by the service.

If this is not specified by the user, a random base instance name is generated by the service.
* @property {integer} currentNumReplicas [Output Only] The current number of replicas in the pool.
* @property {string} description An optional description of the replica pool.
* @property {replicapool(v1beta1).HealthCheck[]} healthChecks Deprecated. Please use template[].healthChecks instead.
* @property {integer} initialNumReplicas The initial number of replicas this pool should have. You must provide a value greater than or equal to 0.
* @property {replicapool(v1beta1).Label[]} labels A list of labels to attach to this replica pool and all created virtual machines in this replica pool.
* @property {string} name The name of the replica pool. Must follow the regex [a-z]([-a-z0-9]*[a-z0-9])? and be 1-28 characters long.
* @property {integer} numReplicas Deprecated! Use initial_num_replicas instead.
* @property {string[]} resourceViews The list of resource views that should be updated with all the replicas that are managed by this pool.
* @property {string} selfLink [Output Only] A self-link to the replica pool.
* @property {string} targetPool Deprecated, please use target_pools instead.
* @property {string[]} targetPools A list of target pools to update with the replicas that are managed by this pool. If specified, the replicas in this replica pool will be added to the specified target pools for load balancing purposes. The replica pool must live in the same region as the specified target pools. These values must be the target pool resource names, and not fully qualified URLs.
* @property {replicapool(v1beta1).Template} template The template to use when creating replicas in this pool. This template is used during initial instance creation of the pool, when growing the pool in size, or when a replica restarts.
* @property {string} type Deprecated! Do not set.
*/
/**
 * @typedef PoolsDeleteRequest
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string[]} abandonInstances If there are instances you would like to keep, you can specify them here. These instances won&#39;t be deleted, but the associated replica objects will be removed.
 */
/**
 * @typedef PoolsListResponse
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} nextPageToken 
 * @property {replicapool(v1beta1).Pool[]} resources 
 */
/**
 * @typedef Replica
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} name [Output Only] The name of the Replica object.
 * @property {string} selfLink [Output Only] The self-link of the Replica.
 * @property {replicapool(v1beta1).ReplicaStatus} status [Output Only] Last known status of the Replica.
 */
/**
 * @typedef ReplicaStatus
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} details [Output Only] Human-readable details about the current state of the replica
 * @property {string} state [Output Only] The state of the Replica.
 * @property {string} templateVersion [Output Only] The template used to build the replica.
 * @property {string} vmLink [Output Only] Link to the virtual machine that this Replica represents.
 * @property {string} vmStartTime [Output Only] The time that this Replica got to the RUNNING state, in RFC 3339 format. If the start time is unknown, UNKNOWN is returned.
 */
/**
 * @typedef ReplicasDeleteRequest
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {boolean} abandonInstance Whether the instance resource represented by this replica should be deleted or abandoned. If abandoned, the replica will be deleted but the virtual machine instance will remain. By default, this is set to false and the instance will be deleted along with the replica.
 */
/**
 * @typedef ReplicasListResponse
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} nextPageToken 
 * @property {replicapool(v1beta1).Replica[]} resources 
 */
/**
 * @typedef ServiceAccount
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} email The service account email address, for example: 123845678986@project.gserviceaccount.com
 * @property {string[]} scopes The list of OAuth2 scopes to obtain for the service account, for example: https://www.googleapis.com/auth/devstorage.full_control
 */
/**
 * @typedef Tag
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} fingerPrint The fingerprint of the tag. Required for updating the list of tags.
 * @property {string[]} items Items contained in this tag.
 */
/**
 * @typedef Template
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {replicapool(v1beta1).Action} action An action to run during initialization of your replicas. An action is run as shell commands which are executed one after the other in the same bash shell, so any state established by one command is inherited by later commands.
 * @property {replicapool(v1beta1).HealthCheck[]} healthChecks A list of HTTP Health Checks to configure for this replica pool and all virtual machines in this replica pool.
 * @property {string} version A free-form string describing the version of this template. You can provide any versioning string you would like. For example, version1 or template-v1.
 * @property {replicapool(v1beta1).VmParams} vmParams The virtual machine parameters to use for creating replicas. You can define settings such as the machine type and the image of replicas in this pool. This is required if replica type is SMART_VM.
 */
/**
 * @typedef VmParams
 * @memberOf! replicapool(v1beta1)
 * @type object
 * @property {string} baseInstanceName Deprecated. Please use baseInstanceName instead.
 * @property {boolean} canIpForward Enables IP Forwarding, which allows this instance to receive packets destined for a different IP address, and send packets with a different source IP. See IP Forwarding for more information.
 * @property {string} description An optional textual description of the instance.
 * @property {replicapool(v1beta1).ExistingDisk[]} disksToAttach A list of existing Persistent Disk resources to attach to each replica in the pool. Each disk will be attached in read-only mode to every replica.
 * @property {replicapool(v1beta1).NewDisk[]} disksToCreate A list of Disk resources to create and attach to each Replica in the Pool. Currently, you can only define one disk and it must be a root persistent disk. Note that Replica Pool will create a root persistent disk for each replica.
 * @property {string} machineType The machine type for this instance. The resource name (e.g. n1-standard-1).
 * @property {replicapool(v1beta1).Metadata} metadata The metadata key/value pairs assigned to this instance.
 * @property {replicapool(v1beta1).NetworkInterface[]} networkInterfaces A list of network interfaces for the instance. Currently only one interface is supported by Google Compute Engine, ONE_TO_ONE_NAT.
 * @property {string} onHostMaintenance 
 * @property {replicapool(v1beta1).ServiceAccount[]} serviceAccounts A list of Service Accounts to enable for this instance.
 * @property {replicapool(v1beta1).Tag} tags A list of tags to apply to the Google Compute Engine instance to identify resources.
 */
module.exports = Replicapool;
