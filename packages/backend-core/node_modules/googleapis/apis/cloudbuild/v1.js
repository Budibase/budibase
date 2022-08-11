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
 * Google Cloud Container Builder API
 *
 * Builds container images in the cloud.
 *
 * @example
 * var google = require('googleapis');
 * var cloudbuild = google.cloudbuild('v1');
 *
 * @namespace cloudbuild
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Cloudbuild
 */
function Cloudbuild(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    triggers: {

      /**
       * cloudbuild.projects.triggers.create
       *
       * @desc Creates a new BuildTrigger.  This API is experimental.
       *
       * @alias cloudbuild.projects.triggers.create
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project for which to configure automatic builds.
       * @param {cloudbuild(v1).BuildTrigger} params.resource Request body data
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/triggers',
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
       * cloudbuild.projects.triggers.get
       *
       * @desc Gets information about a BuildTrigger.  This API is experimental.
       *
       * @alias cloudbuild.projects.triggers.get
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project that owns the trigger.
       * @param {string} params.triggerId ID of the BuildTrigger to get.
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/triggers/{triggerId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectId', 'triggerId'],
          pathParams: ['projectId', 'triggerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * cloudbuild.projects.triggers.list
       *
       * @desc Lists existing BuildTrigger.  This API is experimental.
       *
       * @alias cloudbuild.projects.triggers.list
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project for which to list BuildTriggers.
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/triggers',
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
       * cloudbuild.projects.triggers.delete
       *
       * @desc Deletes an BuildTrigger by its project ID and trigger ID.  This API is experimental.
       *
       * @alias cloudbuild.projects.triggers.delete
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project that owns the trigger.
       * @param {string} params.triggerId ID of the BuildTrigger to delete.
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/triggers/{triggerId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['projectId', 'triggerId'],
          pathParams: ['projectId', 'triggerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * cloudbuild.projects.triggers.patch
       *
       * @desc Updates an BuildTrigger by its project ID and trigger ID.  This API is experimental.
       *
       * @alias cloudbuild.projects.triggers.patch
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project that owns the trigger.
       * @param {string} params.triggerId ID of the BuildTrigger to update.
       * @param {cloudbuild(v1).BuildTrigger} params.resource Request body data
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/triggers/{triggerId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['projectId', 'triggerId'],
          pathParams: ['projectId', 'triggerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    builds: {

      /**
       * cloudbuild.projects.builds.create
       *
       * @desc Starts a build with the specified configuration.  The long-running Operation returned by this method will include the ID of the build, which can be passed to GetBuild to determine its status (e.g., success or failure).
       *
       * @alias cloudbuild.projects.builds.create
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project.
       * @param {cloudbuild(v1).Build} params.resource Request body data
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/builds',
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
       * cloudbuild.projects.builds.get
       *
       * @desc Returns information about a previously requested build.  The Build that is returned includes its status (e.g., success or failure, or in-progress), and timing information.
       *
       * @alias cloudbuild.projects.builds.get
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project.
       * @param {string} params.id ID of the build.
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/builds/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectId', 'id'],
          pathParams: ['projectId', 'id'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * cloudbuild.projects.builds.list
       *
       * @desc Lists previously requested builds.  Previously requested builds may still be in-progress, or may have finished successfully or unsuccessfully.
       *
       * @alias cloudbuild.projects.builds.list
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Number of results to return in the list.
       * @param {string=} params.filter The raw filter text to constrain the results.
       * @param {string} params.projectId ID of the project.
       * @param {string=} params.pageToken Token to provide to skip to a particular spot in the list.
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/builds',
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
       * cloudbuild.projects.builds.cancel
       *
       * @desc Cancels a requested build in progress.
       *
       * @alias cloudbuild.projects.builds.cancel
       * @memberOf! cloudbuild(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectId ID of the project.
       * @param {string} params.id ID of the build.
       * @param {cloudbuild(v1).CancelBuildRequest} params.resource Request body data
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
            url: 'https://cloudbuild.googleapis.com/v1/projects/{projectId}/builds/{id}:cancel',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['projectId', 'id'],
          pathParams: ['projectId', 'id'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.operations = {

    /**
     * cloudbuild.operations.get
     *
     * @desc Gets the latest state of a long-running operation.  Clients can use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @alias cloudbuild.operations.get
     * @memberOf! cloudbuild(v1)
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
          url: 'https://cloudbuild.googleapis.com/v1/{name}',
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
     * cloudbuild.operations.list
     *
     * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.  NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
     *
     * @alias cloudbuild.operations.list
     * @memberOf! cloudbuild(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize The standard list page size.
     * @param {string=} params.filter The standard list filter.
     * @param {string} params.name The name of the operation collection.
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
          url: 'https://cloudbuild.googleapis.com/v1/{name}',
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
     * cloudbuild.operations.cancel
     *
     * @desc Starts asynchronous cancellation on a long-running operation.  The server makes a best effort to cancel the operation, but success is not guaranteed.  If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.  Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
     *
     * @alias cloudbuild.operations.cancel
     * @memberOf! cloudbuild(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
     * @param {cloudbuild(v1).CancelOperationRequest} params.resource Request body data
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
          url: 'https://cloudbuild.googleapis.com/v1/{name}:cancel',
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
}

/**
 * @typedef Status
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef BuildOperationMetadata
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {cloudbuild(v1).Build} build The build that the operation is tracking.
 */
/**
 * @typedef Source
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {cloudbuild(v1).StorageSource} storageSource If provided, get the source from this location in in Google Cloud
Storage.
* @property {cloudbuild(v1).RepoSource} repoSource If provided, get source from this location in a Cloud Repo.
*/
/**
 * @typedef SourceProvenance
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {cloudbuild(v1).RepoSource} resolvedRepoSource A copy of the build&#39;s source.repo_source, if exists, with any
revisions resolved.
* @property {cloudbuild(v1).StorageSource} resolvedStorageSource A copy of the build&#39;s source.storage_source, if exists, with any
generations resolved.
* @property {object} fileHashes Hash(es) of the build source, which can be used to verify that the original
source integrity was maintained in the build. Note that FileHashes will
only be populated if BuildOptions has requested a SourceProvenanceHash.

The keys to this map are file paths used as build source and the values
contain the hash values for those files.

If the build source came in a single package such as a gzipped tarfile
(.tar.gz), the FileHash will be for the single path to that file.
@OutputOnly
*/
/**
 * @typedef Operation
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {cloudbuild(v1).Status} error The error result of the operation in case of failure or cancellation.
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
 * @typedef BuildTrigger
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} id Unique identifier of the trigger.

@OutputOnly
* @property {string} description Human-readable description of this trigger.
* @property {cloudbuild(v1).RepoSource} triggerTemplate Template describing the types of source changes to trigger a build.

Branch and tag names in trigger templates are interpreted as regular
expressions. Any branch or tag change that matches that regular expression
will trigger a build.
* @property {boolean} disabled If true, the trigger will never result in a build.
* @property {string} createTime Time when the trigger was created.

@OutputOnly
* @property {string} filename Path, from the source root, to a file whose contents is used for the
template.
* @property {cloudbuild(v1).Build} build Contents of the build template.
*/
/**
 * @typedef BuiltImage
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} digest Docker Registry 2.0 digest.
* @property {string} name Name used to push the container image to Google Container Registry, as
presented to `docker push`.
*/
/**
 * @typedef Hash
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {string} value The hash value.
 * @property {string} type The type of hash that was performed.
 */
/**
 * @typedef CancelOperationRequest
 * @memberOf! cloudbuild(v1)
 * @type object
 */
/**
 * @typedef StorageSource
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} bucket Google Cloud Storage bucket containing source (see
[Bucket Name
Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).
* @property {string} generation Google Cloud Storage generation for the object. If the generation is
omitted, the latest generation will be used.
* @property {string} object Google Cloud Storage object containing source.

This object must be a gzipped archive file (.tar.gz) containing source to
build.
*/
/**
 * @typedef Results
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {cloudbuild(v1).BuiltImage[]} images Images that were built as a part of the build.
 * @property {string[]} buildStepImages List of build step digests, in order corresponding to build step indices.
 */
/**
 * @typedef Build
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} id Unique identifier of the build.
@OutputOnly
* @property {cloudbuild(v1).SourceProvenance} sourceProvenance A permanent fixed identifier for source.
@OutputOnly
* @property {cloudbuild(v1).Results} results Results of the build.
@OutputOnly
* @property {string} status Status of the build.
@OutputOnly
* @property {cloudbuild(v1).BuildOptions} options Special options for this build.
* @property {string} finishTime Time at which execution of the build was finished.

The difference between finish_time and start_time is the duration of the
build&#39;s execution.
@OutputOnly
* @property {string} timeout Amount of time that this build should be allowed to run, to second
granularity. If this amount of time elapses, work on the build will cease
and the build status will be TIMEOUT.

Default time is ten minutes.
* @property {cloudbuild(v1).BuildStep[]} steps Describes the operations to be performed on the workspace.
* @property {cloudbuild(v1).Source} source Describes where to find the source files to build.
* @property {string} createTime Time at which the request to create the build was received.
@OutputOnly
* @property {string} logUrl URL to logs for this build in Google Cloud Logging.
@OutputOnly
* @property {string} statusDetail Customer-readable message about the current status.
@OutputOnly
* @property {string[]} images A list of images to be pushed upon the successful completion of all build
steps.

The images will be pushed using the builder service account&#39;s credentials.

The digests of the pushed images will be stored in the Build resource&#39;s
results field.

If any of the images fail to be pushed, the build is marked FAILURE.
* @property {string} startTime Time at which execution of the build was started.
@OutputOnly
* @property {string} buildTriggerId The ID of the BuildTrigger that triggered this build, if it was
triggered automatically.
@OutputOnly
* @property {string} logsBucket Google Cloud Storage bucket where logs should be written (see
[Bucket Name
Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).
Logs file names will be of the format `${logs_bucket}/log-${build_id}.txt`.
* @property {string} projectId ID of the project.
@OutputOnly.
*/
/**
 * @typedef ListBuildTriggersResponse
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {cloudbuild(v1).BuildTrigger[]} triggers BuildTriggers for the project, sorted by create_time descending.
 */
/**
 * @typedef CancelBuildRequest
 * @memberOf! cloudbuild(v1)
 * @type object
 */
/**
 * @typedef ListOperationsResponse
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {string} nextPageToken The standard List next-page token.
 * @property {cloudbuild(v1).Operation[]} operations A list of operations that matches the specified filter in the request.
 */
/**
 * @typedef FileHashes
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {cloudbuild(v1).Hash[]} fileHash Collection of file hashes.
 */
/**
 * @typedef RepoSource
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} repoName Name of the repo. If omitted, the name &quot;default&quot; is assumed.
* @property {string} tagName Name of the tag to build.
* @property {string} projectId ID of the project that owns the repo. If omitted, the project ID requesting
the build is assumed.
* @property {string} branchName Name of the branch to build.
* @property {string} commitSha Explicit commit SHA to build.
*/
/**
 * @typedef BuildStep
 * @memberOf! cloudbuild(v1)
 * @type object
* @property {string} id Optional unique identifier for this build step, used in wait_for to
reference this build step as a dependency.
* @property {string[]} env A list of environment variable definitions to be used when running a step.

The elements are of the form &quot;KEY=VALUE&quot; for the environment variable &quot;KEY&quot;
being given the value &quot;VALUE&quot;.
* @property {string[]} waitFor The ID(s) of the step(s) that this build step depends on.
This build step will not start until all the build steps in wait_for
have completed successfully. If wait_for is empty, this build step will
start when all previous build steps in the Build.Steps list have completed
successfully.
* @property {string[]} args A list of arguments that will be presented to the step when it is started.

If the image used to run the step&#39;s container has an entrypoint, these args
will be used as arguments to that entrypoint. If the image does not define
an entrypoint, the first element in args will be used as the entrypoint,
and the remainder will be used as arguments.
* @property {string} entrypoint Optional entrypoint to be used instead of the build step image&#39;s default
If unset, the image&#39;s default will be used.
* @property {string} name The name of the container image that will run this particular build step.

If the image is already available in the host&#39;s Docker daemon&#39;s cache, it
will be run directly. If not, the host will attempt to pull the image
first, using the builder service account&#39;s credentials if necessary.

The Docker daemon&#39;s cache will already have the latest versions of all of
the officially supported build steps
(https://github.com/GoogleCloudPlatform/cloud-builders). The Docker daemon
will also have cached many of the layers for some popular images, like
&quot;ubuntu&quot;, &quot;debian&quot;, but they will be refreshed at the time you attempt to
use them.

If you built an image in a previous build step, it will be stored in the
host&#39;s Docker daemon&#39;s cache and is available to use as the name for a
later build step.
* @property {string} dir Working directory (relative to project source root) to use when running
this operation&#39;s container.
*/
/**
 * @typedef Empty
 * @memberOf! cloudbuild(v1)
 * @type object
 */
/**
 * @typedef BuildOptions
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {string[]} sourceProvenanceHash Requested hash for SourceProvenance.
 * @property {string} requestedVerifyOption Requested verifiability options.
 */
/**
 * @typedef ListBuildsResponse
 * @memberOf! cloudbuild(v1)
 * @type object
 * @property {string} nextPageToken Token to receive the next page of results.
 * @property {cloudbuild(v1).Build[]} builds Builds will be sorted by create_time, descending.
 */
module.exports = Cloudbuild;
