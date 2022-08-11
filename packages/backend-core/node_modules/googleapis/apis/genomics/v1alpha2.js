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
 * Genomics API
 *
 * Stores, processes, explores and shares genomic data.
 *
 * @example
 * var google = require('googleapis');
 * var genomics = google.genomics('v1alpha2');
 *
 * @namespace genomics
 * @type {Function}
 * @version v1alpha2
 * @variation v1alpha2
 * @param {object=} options Options for Genomics
 */
function Genomics(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.operations = {

    /**
     * genomics.operations.list
     *
     * @desc Lists operations that match the specified filter in the request.
     *
     * @alias genomics.operations.list
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation collection.
     * @param {string=} params.filter A string for filtering Operations. The following filter fields are supported: * projectId: Required. Corresponds to OperationMetadata.projectId. * createTime: The time this job was created, in seconds from the [epoch](http://en.wikipedia.org/wiki/Unix_time). Can use `>=` and/or `= 1432140000` * `projectId = my-project AND createTime >= 1432140000 AND createTime <= 1432150000 AND status = RUNNING` * `projectId = my-project AND labels.color = *` * `projectId = my-project AND labels.color = red`
     * @param {integer=} params.pageSize The maximum number of results to return. If unspecified, defaults to 256. The maximum value is 2048.
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
          url: 'https://genomics.googleapis.com/v1alpha2/{name}',
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
     * genomics.operations.get
     *
     * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @alias genomics.operations.get
     * @memberOf! genomics(v1alpha2)
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
          url: 'https://genomics.googleapis.com/v1alpha2/{name}',
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
     * genomics.operations.cancel
     *
     * @desc Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. Clients may use Operations.GetOperation or Operations.ListOperations to check whether the cancellation succeeded or the operation completed despite cancellation.
     *
     * @alias genomics.operations.cancel
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
     * @param {genomics(v1alpha2).CancelOperationRequest} params.resource Request body data
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
          url: 'https://genomics.googleapis.com/v1alpha2/{name}:cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pipelines = {

    /**
     * genomics.pipelines.create
     *
     * @desc Creates a pipeline that can be run later. Create takes a Pipeline that has all fields other than `pipelineId` populated, and then returns the same pipeline with `pipelineId` populated. This id can be used to run the pipeline. Caller must have WRITE permission to the project.
     *
     * @alias genomics.pipelines.create
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {genomics(v1alpha2).Pipeline} params.resource Request body data
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
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines',
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
     * genomics.pipelines.run
     *
     * @desc Runs a pipeline. If `pipelineId` is specified in the request, then run a saved pipeline. If `ephemeralPipeline` is specified, then run that pipeline once without saving a copy. The caller must have READ permission to the project where the pipeline is stored and WRITE permission to the project where the pipeline will be run, as VMs will be created and storage will be used.
     *
     * @alias genomics.pipelines.run
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {genomics(v1alpha2).RunPipelineRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    run: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines:run',
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
     * genomics.pipelines.get
     *
     * @desc Retrieves a pipeline based on ID. Caller must have READ permission to the project.
     *
     * @alias genomics.pipelines.get
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.pipelineId Caller must have READ access to the project in which this pipeline is defined.
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
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines/{pipelineId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['pipelineId'],
        pathParams: ['pipelineId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * genomics.pipelines.list
     *
     * @desc Lists pipelines. Caller must have READ permission to the project.
     *
     * @alias genomics.pipelines.list
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.projectId Required. The name of the project to search for pipelines. Caller must have READ access to this project.
     * @param {string=} params.namePrefix Pipelines with names that match this prefix should be returned. If unspecified, all pipelines in the project, up to `pageSize`, will be returned.
     * @param {integer=} params.pageSize Number of pipelines to return at once. Defaults to 256, and max is 2048.
     * @param {string=} params.pageToken Token to use to indicate where to start getting results. If unspecified, returns the first page of results.
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
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines',
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
     * genomics.pipelines.delete
     *
     * @desc Deletes a pipeline based on ID. Caller must have WRITE permission to the project.
     *
     * @alias genomics.pipelines.delete
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.pipelineId Caller must have WRITE access to the project in which this pipeline is defined.
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
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines/{pipelineId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['pipelineId'],
        pathParams: ['pipelineId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * genomics.pipelines.getControllerConfig
     *
     * @desc Gets controller configuration information. Should only be called by VMs created by the Pipelines Service and not by end users.
     *
     * @alias genomics.pipelines.getControllerConfig
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.operationId The operation to retrieve controller configuration for.
     * @param {string=} params.validationToken 
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getControllerConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines:getControllerConfig',
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
     * genomics.pipelines.setOperationStatus
     *
     * @desc Sets status of a given operation. Any new timestamps (as determined by description) are appended to TimestampEvents. Should only be called by VMs created by the Pipelines Service and not by end users.
     *
     * @alias genomics.pipelines.setOperationStatus
     * @memberOf! genomics(v1alpha2)
     *
     * @param {object} params Parameters for request
     * @param {genomics(v1alpha2).SetOperationStatusRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setOperationStatus: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://genomics.googleapis.com/v1alpha2/pipelines:setOperationStatus',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef ListOperationsResponse
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {genomics(v1alpha2).Operation[]} operations A list of operations that matches the specified filter in the request.
 * @property {string} nextPageToken The standard List next-page token.
 */
/**
 * @typedef Operation
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} name The server-assigned name, which is only unique within the same service that originally returns it. For example: `operations/CJHU7Oi_ChDrveSpBRjfuL-qzoWAgEw`
 * @property {object} metadata An OperationMetadata object. This will always be returned with the Operation.
 * @property {boolean} done If the value is `false`, it means the operation is still in progress. If true, the operation is completed, and either `error` or `response` is available.
 * @property {genomics(v1alpha2).Status} error The error result of the operation in case of failure or cancellation.
 * @property {object} response If importing ReadGroupSets, an ImportReadGroupSetsResponse is returned. If importing Variants, an ImportVariantsResponse is returned. For exports, an empty response is returned.
 */
/**
 * @typedef Status
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details A list of messages that carry the error details. There will be a common set of message types for APIs to use.
 */
/**
 * @typedef CancelOperationRequest
 * @memberOf! genomics(v1alpha2)
 * @type object
 */
/**
 * @typedef Empty
 * @memberOf! genomics(v1alpha2)
 * @type object
 */
/**
 * @typedef Pipeline
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} projectId Required. The project in which to create the pipeline. The caller must have WRITE access.
 * @property {string} name Required. A user specified pipeline name that does not have to be unique. This name can be used for filtering Pipelines in ListPipelines.
 * @property {string} description User-specified description.
 * @property {genomics(v1alpha2).PipelineParameter[]} inputParameters Input parameters of the pipeline.
 * @property {genomics(v1alpha2).PipelineParameter[]} outputParameters Output parameters of the pipeline.
 * @property {genomics(v1alpha2).DockerExecutor} docker Specifies the docker run information.
 * @property {genomics(v1alpha2).PipelineResources} resources Required. Specifies resource requirements for the pipeline run. Required fields: * minimumCpuCores * minimumRamGb
 * @property {string} pipelineId Unique pipeline id that is generated by the service when CreatePipeline is called. Cannot be specified in the Pipeline used in the CreatePipelineRequest, and will be populated in the response to CreatePipeline and all subsequent Get and List calls. Indicates that the service has registered this pipeline.
 */
/**
 * @typedef PipelineParameter
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} name Required. Name of the parameter - the pipeline runner uses this string as the key to the input and output maps in RunPipeline.
 * @property {string} description Human-readable description.
 * @property {string} defaultValue The default value for this parameter. Can be overridden at runtime. If `localCopy` is present, then this must be a Google Cloud Storage path beginning with `gs://`.
 * @property {genomics(v1alpha2).LocalCopy} localCopy If present, this parameter is marked for copying to and from the VM. `LocalCopy` indicates where on the VM the file should be. The value given to this parameter (either at runtime or using `defaultValue`) must be the remote path where the file should be.
 */
/**
 * @typedef LocalCopy
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} path Required. The path within the user&#39;s docker container where this input should be localized to and from, relative to the specified disk&#39;s mount point. For example: file.txt,
 * @property {string} disk Required. The name of the disk where this parameter is located. Can be the name of one of the disks specified in the Resources field, or &quot;boot&quot;, which represents the Docker instance&#39;s boot disk and has a mount point of `/`.
 */
/**
 * @typedef DockerExecutor
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} imageName Required. Image name from either Docker Hub or Google Container Registry. Users that run pipelines must have READ access to the image.
 * @property {string} cmd Required. The command or newline delimited script to run. The command string will be executed within a bash shell. If the command exits with a non-zero exit code, output parameter de-localization will be skipped and the pipeline operation&#39;s `error` field will be populated. Maximum command string length is 16384.
 */
/**
 * @typedef PipelineResources
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {integer} minimumCpuCores The minimum number of cores to use. Defaults to 1.
 * @property {boolean} preemptible Whether to use preemptible VMs. Defaults to `false`. In order to use this, must be true for both create time and run time. Cannot be true at run time if false at create time.
 * @property {number} minimumRamGb The minimum amount of RAM to use. Defaults to 3.75 (GB)
 * @property {genomics(v1alpha2).Disk[]} disks Disks to attach.
 * @property {string[]} zones List of Google Compute Engine availability zones to which resource creation will restricted. If empty, any zone may be chosen.
 * @property {integer} bootDiskSizeGb The size of the boot disk. Defaults to 10 (GB).
 * @property {boolean} noAddress Whether to assign an external IP to the instance. This is an experimental feature that may go away. Defaults to false. Corresponds to `--no_address` flag for [gcloud compute instances create] (https://cloud.google.com/sdk/gcloud/reference/compute/instances/create). In order to use this, must be true for both create time and run time. Cannot be true at run time if false at create time. If you need to ssh into a private IP VM for debugging, you can ssh to a public VM and then ssh into the private VM&#39;s Internal IP. If noAddress is set, this pipeline run may only load docker images from Google Container Registry and not Docker Hub. ** Note: To use this option, your project must be in Google Access for Private IPs Early Access Program.**
 */
/**
 * @typedef Disk
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} name Required. The name of the disk that can be used in the pipeline parameters. Must be 1 - 63 characters. The name &quot;boot&quot; is reserved for system use.
 * @property {string} type Required. The type of the disk to create.
 * @property {integer} sizeGb The size of the disk. Defaults to 500 (GB). This field is not applicable for local SSD.
 * @property {string} source The full or partial URL of the persistent disk to attach. See https://cloud.google.com/compute/docs/reference/latest/instances#resource and https://cloud.google.com/compute/docs/disks/persistent-disks#snapshots for more details.
 * @property {boolean} autoDelete Specifies whether or not to delete the disk when the pipeline completes. This field is applicable only for newly created disks. See https://cloud.google.com/compute/docs/reference/latest/instances#resource for more details. By default, `autoDelete` is `false`. `autoDelete` will be enabled if set to `true` at create time or run time.
 * @property {boolean} readOnly Specifies how a sourced-base persistent disk will be mounted. See https://cloud.google.com/compute/docs/disks/persistent-disks#use_multi_instances for more details. Can only be set at create time.
 * @property {string} mountPoint Required at create time and cannot be overridden at run time. Specifies the path in the docker container where files on this disk should be located. For example, if `mountPoint` is `/mnt/disk`, and the parameter has `localPath` `inputs/file.txt`, the docker container can access the data at `/mnt/disk/inputs/file.txt`.
 */
/**
 * @typedef RunPipelineRequest
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} pipelineId The already created pipeline to run.
 * @property {genomics(v1alpha2).Pipeline} ephemeralPipeline A new pipeline object to run once and then delete.
 * @property {genomics(v1alpha2).RunPipelineArgs} pipelineArgs The arguments to use when running this pipeline.
 */
/**
 * @typedef RunPipelineArgs
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} projectId Required. The project in which to run the pipeline. The caller must have WRITER access to all Google Cloud services and resources (e.g. Google Compute Engine) will be used.
 * @property {object} inputs Pipeline input arguments; keys are defined in the pipeline documentation. All input parameters that do not have default values must be specified. If parameters with defaults are specified here, the defaults will be overridden.
 * @property {object} outputs Pipeline output arguments; keys are defined in the pipeline documentation. All output parameters of without default values must be specified. If parameters with defaults are specified here, the defaults will be overridden.
 * @property {genomics(v1alpha2).ServiceAccount} serviceAccount The Google Cloud Service Account that will be used to access data and services. By default, the compute service account associated with `projectId` is used.
 * @property {string} clientId This field is deprecated. Use `labels` instead. Client-specified pipeline operation identifier.
 * @property {genomics(v1alpha2).PipelineResources} resources Specifies resource requirements/overrides for the pipeline run.
 * @property {genomics(v1alpha2).LoggingOptions} logging Required. Logging options. Used by the service to communicate results to the user.
 * @property {string} keepVmAliveOnFailureDuration How long to keep the VM up after a failure (for example docker command failed, copying input or output files failed, etc). While the VM is up, one can ssh into the VM to debug. Default is 0; maximum allowed value is 1 day.
 * @property {object} labels Labels to apply to this pipeline run. Labels will also be applied to compute resources (VM, disks) created by this pipeline run. When listing operations, operations can filtered by labels. Label keys may not be empty; label values may be empty. Non-empty labels must be 1-63 characters long, and comply with [RFC1035] (https://www.ietf.org/rfc/rfc1035.txt). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
 */
/**
 * @typedef ServiceAccount
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} email Email address of the service account. Defaults to `default`, which uses the compute service account associated with the project.
 * @property {string[]} scopes List of scopes to be enabled for this service account on the VM. The following scopes are automatically included: * https://www.googleapis.com/auth/compute * https://www.googleapis.com/auth/devstorage.full_control * https://www.googleapis.com/auth/genomics * https://www.googleapis.com/auth/logging.write * https://www.googleapis.com/auth/monitoring.write
 */
/**
 * @typedef LoggingOptions
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} gcsPath The location in Google Cloud Storage to which the pipeline logs will be copied. Can be specified as a fully qualified directory path, in which case logs will be output with a unique identifier as the filename in that directory, or as a fully specified path, which must end in `.log`, in which case that path will be used, and the user must ensure that logs are not overwritten. Stdout and stderr logs from the run are also generated and output as `-stdout.log` and `-stderr.log`.
 */
/**
 * @typedef ListPipelinesResponse
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {genomics(v1alpha2).Pipeline[]} pipelines The matched pipelines.
 * @property {string} nextPageToken The token to use to get the next page of results.
 */
/**
 * @typedef ControllerConfig
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} image 
 * @property {string} cmd 
 * @property {string} gcsLogPath 
 * @property {string} machineType 
 * @property {object} vars 
 * @property {object} disks 
 * @property {object} gcsSources 
 * @property {object} gcsSinks 
 */
/**
 * @typedef RepeatedString
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string[]} values 
 */
/**
 * @typedef SetOperationStatusRequest
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} operationId 
 * @property {genomics(v1alpha2).TimestampEvent[]} timestampEvents 
 * @property {string} errorCode 
 * @property {string} errorMessage 
 * @property {string} validationToken 
 */
/**
 * @typedef TimestampEvent
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} description String indicating the type of event
 * @property {string} timestamp The time this event occured.
 */
/**
 * @typedef ImportReadGroupSetsResponse
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string[]} readGroupSetIds IDs of the read group sets that were created.
 */
/**
 * @typedef ImportVariantsResponse
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string[]} callSetIds IDs of the call sets created during the import.
 */
/**
 * @typedef OperationMetadata
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} projectId The Google Cloud Project in which the job is scoped.
 * @property {string} createTime The time at which the job was submitted to the Genomics service.
 * @property {string} startTime The time at which the job began to run.
 * @property {string} endTime The time at which the job stopped running.
 * @property {object} request The original request that started the operation. Note that this will be in current version of the API. If the operation was started with v1beta2 API and a GetOperation is performed on v1 API, a v1 request will be returned.
 * @property {genomics(v1alpha2).OperationEvent[]} events Optional event messages that were generated during the job&#39;s execution. This also contains any warnings that were generated during import or export.
 * @property {string} clientId This field is deprecated. Use `labels` instead. Optionally provided by the caller when submitting the request that creates the operation.
 * @property {object} runtimeMetadata Runtime metadata on this Operation.
 * @property {object} labels Optionally provided by the caller when submitting the request that creates the operation.
 */
/**
 * @typedef OperationEvent
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} startTime Optional time of when event started.
 * @property {string} endTime Optional time of when event finished. An event can have a start time and no finish time. If an event has a finish time, there must be a start time.
 * @property {string} description Required description of event.
 */
/**
 * @typedef RuntimeMetadata
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {genomics(v1alpha2).ComputeEngine} computeEngine Execution information specific to Google Compute Engine.
 */
/**
 * @typedef ComputeEngine
 * @memberOf! genomics(v1alpha2)
 * @type object
 * @property {string} instanceName The instance on which the operation is running.
 * @property {string} zone The availability zone in which the instance resides.
 * @property {string} machineType The machine type of the instance.
 * @property {string[]} diskNames The names of the disks that were created for this pipeline.
 */
module.exports = Genomics;
