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
 * Firebase Rules API
 *
 * Creates and manages rules that determine when a Firebase Rules-enabled service should permit a request.

 *
 * @example
 * var google = require('googleapis');
 * var firebaserules = google.firebaserules('v1');
 *
 * @namespace firebaserules
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Firebaserules
 */
function Firebaserules(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * firebaserules.projects.test
     *
     * @desc Test `Source` for syntactic and semantic correctness. Issues present in the rules, if any, will be returned to the caller with a description, severity, and source location.  The test method will typically be executed with a developer provided `Source`, but if regression testing is desired, this method may be executed against a `Ruleset` resource name and the `Source` will be retrieved from the persisted `Ruleset`.  The following is an example of `Source` that permits users to upload images to a bucket bearing their user id and matching the correct metadata:  _*Example*_      // Users are allowed to subscribe and unsubscribe to the blog.     service firebase.storage {       match /users/{userId}/images/{imageName} {           allow write: if userId == request.userId               && (imageName.endsWith('.png') || imageName.endsWith('.jpg'))               && resource.mimeType.startsWith('image/')       }     }
     *
     * @alias firebaserules.projects.test
     * @memberOf! firebaserules(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name Name of the project.  Format: `projects/{project_id}`
     * @param {firebaserules(v1).TestRulesetRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    test: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://firebaserules.googleapis.com/v1/{name}:test',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    rulesets: {

      /**
       * firebaserules.projects.rulesets.create
       *
       * @desc Create a `Ruleset` from `Source`.  The `Ruleset` is given a unique generated name which is returned to the caller. `Source` containing syntactic or semantics errors will result in an error response indicating the first error encountered. For a detailed view of `Source` issues, use TestRuleset.
       *
       * @alias firebaserules.projects.rulesets.create
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for Project which owns this `Ruleset`.  Format: `projects/{project_id}`
       * @param {firebaserules(v1).Ruleset} params.resource Request body data
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
            url: 'https://firebaserules.googleapis.com/v1/{name}/rulesets',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * firebaserules.projects.rulesets.get
       *
       * @desc Get a `Ruleset` by name including the full `Source` contents.
       *
       * @alias firebaserules.projects.rulesets.get
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the ruleset to get.  Format: `projects/{project_id}/rulesets/{ruleset_id}`
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
            url: 'https://firebaserules.googleapis.com/v1/{name}',
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
       * firebaserules.projects.rulesets.list
       *
       * @desc List `Ruleset` metadata only and optionally filter the results by Ruleset name.  The full `Source` contents of a `Ruleset` may be retrieved with GetRuleset.
       *
       * @alias firebaserules.projects.rulesets.list
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load less than `page_size` due to the size of the output. To traverse all of the releases, caller should iterate until the `page_token` is empty.
       * @param {string} params.name Resource name for the project.  Format: `projects/{project_id}`
       * @param {string=} params.pageToken Next page token for loading the next batch of `Ruleset` instances.
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
            url: 'https://firebaserules.googleapis.com/v1/{name}/rulesets',
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
       * firebaserules.projects.rulesets.delete
       *
       * @desc Delete a `Ruleset` by resource name.  If the `Ruleset` is referenced by a `Release` the operation will fail.
       *
       * @alias firebaserules.projects.rulesets.delete
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the ruleset to delete.  Format: `projects/{project_id}/rulesets/{ruleset_id}`
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
            url: 'https://firebaserules.googleapis.com/v1/{name}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    releases: {

      /**
       * firebaserules.projects.releases.update
       *
       * @desc Update a `Release`.  Only updates to the `ruleset_name` field will be honored. `Release` rename is not supported. To create a `Release` use the CreateRelease method instead.
       *
       * @alias firebaserules.projects.releases.update
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the `Release`.  `Release` names may be structured `app1/prod/v2` or flat `app1_prod_v2` which affords developers a great deal of flexibility in mapping the name to the style that best fits their existing development practices. For example, a name could refer to an environment, an app, a version, or some combination of three.  In the table below, for the project name `projects/foo`, the following relative release paths show how flat and structured names might be chosen to match a desired development / deployment strategy.  Use Case     | Flat Name           | Structured Name -------------|---------------------|---------------- Environments | releases/qa         | releases/qa Apps         | releases/app1_qa    | releases/app1/qa Versions     | releases/app1_v2_qa | releases/app1/v2/qa  The delimiter between the release name path elements can be almost anything and it should work equally well with the release name list filter, but in many ways the structured paths provide a clearer picture of the relationship between `Release` instances.  Format: `projects/{project_id}/releases/{release_id}`
       * @param {firebaserules(v1).Release} params.resource Request body data
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
            url: 'https://firebaserules.googleapis.com/v1/{name}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * firebaserules.projects.releases.create
       *
       * @desc Create a `Release`.  Release names should reflect the developer's deployment practices. For example, the release name may include the environment name, application name, application version, or any other name meaningful to the developer. Once a `Release` refers to a `Ruleset`, the rules can be enforced by Firebase Rules-enabled services.  More than one `Release` may be 'live' concurrently. Consider the following three `Release` names for `projects/foo` and the `Ruleset` to which they refer.  Release Name                    | Ruleset Name --------------------------------|------------- projects/foo/releases/prod      | projects/foo/rulesets/uuid123 projects/foo/releases/prod/beta | projects/foo/rulesets/uuid123 projects/foo/releases/prod/v23  | projects/foo/rulesets/uuid456  The table reflects the `Ruleset` rollout in progress. The `prod` and `prod/beta` releases refer to the same `Ruleset`. However, `prod/v23` refers to a new `Ruleset`. The `Ruleset` reference for a `Release` may be updated using the UpdateRelease method, and the custom `Release` name may be referenced by specifying the `X-Firebase-Rules-Release-Name` header.
       *
       * @alias firebaserules.projects.releases.create
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the project which owns this `Release`.  Format: `projects/{project_id}`
       * @param {firebaserules(v1).Release} params.resource Request body data
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
            url: 'https://firebaserules.googleapis.com/v1/{name}/releases',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * firebaserules.projects.releases.get
       *
       * @desc Get a `Release` by name.
       *
       * @alias firebaserules.projects.releases.get
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name of the `Release`.   Format: `projects/{project_id}/releases/{release_id}`
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
            url: 'https://firebaserules.googleapis.com/v1/{name}',
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
       * firebaserules.projects.releases.list
       *
       * @desc List the `Release` values for a project. This list may optionally be filtered by `Release` name or `Ruleset` id or both.
       *
       * @alias firebaserules.projects.releases.list
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load less than `page_size` due to the size of the output. To traverse all of the releases, caller should iterate until the `page_token` is empty.
       * @param {string=} params.filter `Release` filter. The list method supports filters with restrictions on the `Release` `name` and also on the `Ruleset` `ruleset_name`.  Example 1) A filter of 'name=prod*' might return `Release`s with names within 'projects/foo' prefixed with 'prod':  Name                          | Ruleset Name ------------------------------|------------- projects/foo/releases/prod    | projects/foo/rulesets/uuid1234 projects/foo/releases/prod/v1 | projects/foo/rulesets/uuid1234 projects/foo/releases/prod/v2 | projects/foo/rulesets/uuid8888  Example 2) A filter of `name=prod* ruleset_name=uuid1234` would return only `Release` instances for 'projects/foo' with names prefixed with 'prod' referring to the same `Ruleset` name of 'uuid1234':  Name                          | Ruleset Name ------------------------------|------------- projects/foo/releases/prod    | projects/foo/rulesets/1234 projects/foo/releases/prod/v1 | projects/foo/rulesets/1234  In the examples, the filter parameters refer to the search filters for release and ruleset names are relative to the project releases and rulesets collections. Fully qualified prefixed may also be used. e.g. `name=projects/foo/releases/prod* ruleset_name=projects/foo/rulesets/uuid1`
       * @param {string} params.name Resource name for the project.  Format: `projects/{project_id}`
       * @param {string=} params.pageToken Next page token for the next batch of `Release` instances.
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
            url: 'https://firebaserules.googleapis.com/v1/{name}/releases',
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
       * firebaserules.projects.releases.delete
       *
       * @desc Delete a `Release` by resource name.
       *
       * @alias firebaserules.projects.releases.delete
       * @memberOf! firebaserules(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the `Release` to delete.  Format: `projects/{project_id}/releases/{release_id}`
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
            url: 'https://firebaserules.googleapis.com/v1/{name}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Release
 * @memberOf! firebaserules(v1)
 * @type object
* @property {string} updateTime Time the release was updated.
@OutputOnly
* @property {string} createTime Time the release was created.
@OutputOnly
* @property {string} name Resource name for the `Release`.

`Release` names may be structured `app1/prod/v2` or flat `app1_prod_v2`
which affords developers a great deal of flexibility in mapping the name
to the style that best fits their existing development practices. For
example, a name could refer to an environment, an app, a version, or some
combination of three.

In the table below, for the project name `projects/foo`, the following
relative release paths show how flat and structured names might be chosen
to match a desired development / deployment strategy.

Use Case     | Flat Name           | Structured Name
-------------|---------------------|----------------
Environments | releases/qa         | releases/qa
Apps         | releases/app1_qa    | releases/app1/qa
Versions     | releases/app1_v2_qa | releases/app1/v2/qa

The delimiter between the release name path elements can be almost anything
and it should work equally well with the release name list filter, but in
many ways the structured paths provide a clearer picture of the
relationship between `Release` instances.

Format: `projects/{project_id}/releases/{release_id}`
* @property {string} rulesetName Name of the `Ruleset` referred to by this `Release`. The `Ruleset` must
exist the `Release` to be created.
*/
/**
 * @typedef Source
 * @memberOf! firebaserules(v1)
 * @type object
 * @property {firebaserules(v1).File[]} files `File` set constituting the `Source` bundle.
 */
/**
 * @typedef SourcePosition
 * @memberOf! firebaserules(v1)
 * @type object
 * @property {string} fileName Name of the `File`.
 * @property {integer} column First column on the source line associated with the source fragment.
 * @property {integer} line Line number of the source fragment. 1-based.
 */
/**
 * @typedef TestRulesetResponse
 * @memberOf! firebaserules(v1)
 * @type object
* @property {firebaserules(v1).Issue[]} issues Syntactic and semantic `Source` issues of varying severity. Issues of
`ERROR` severity will prevent tests from executing.
*/
/**
 * @typedef Ruleset
 * @memberOf! firebaserules(v1)
 * @type object
* @property {firebaserules(v1).Source} source `Source` for the `Ruleset`.
* @property {string} createTime Time the `Ruleset` was created.
@OutputOnly
* @property {string} name Name of the `Ruleset`. The ruleset_id is auto generated by the service.
Format: `projects/{project_id}/rulesets/{ruleset_id}`
@OutputOnly
*/
/**
 * @typedef ListReleasesResponse
 * @memberOf! firebaserules(v1)
 * @type object
* @property {string} nextPageToken The pagination token to retrieve the next page of results. If the value is
empty, no further results remain.
* @property {firebaserules(v1).Release[]} releases List of `Release` instances.
*/
/**
 * @typedef ListRulesetsResponse
 * @memberOf! firebaserules(v1)
 * @type object
* @property {firebaserules(v1).Ruleset[]} rulesets List of `Ruleset` instances.
* @property {string} nextPageToken The pagination token to retrieve the next page of results. If the value is
empty, no further results remain.
*/
/**
 * @typedef Empty
 * @memberOf! firebaserules(v1)
 * @type object
 */
/**
 * @typedef File
 * @memberOf! firebaserules(v1)
 * @type object
 * @property {string} content Textual Content.
 * @property {string} name File name.
 * @property {string} fingerprint Fingerprint (e.g. github sha) associated with the `File`.
 */
/**
 * @typedef TestRulesetRequest
 * @memberOf! firebaserules(v1)
 * @type object
 * @property {firebaserules(v1).Source} source `Source` to be checked for correctness.
 */
/**
 * @typedef Issue
 * @memberOf! firebaserules(v1)
 * @type object
 * @property {string} description Short error description.
 * @property {string} severity The severity of the issue.
 * @property {firebaserules(v1).SourcePosition} sourcePosition Position of the issue in the `Source`.
 */
module.exports = Firebaserules;
