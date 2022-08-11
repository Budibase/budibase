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
 * Google Cloud RuntimeConfig API
 *
 * Provides capabilities for dynamic configuration and coordination for applications running on Google Cloud Platform.

 *
 * @example
 * var google = require('googleapis');
 * var runtimeconfig = google.runtimeconfig('v1');
 *
 * @namespace runtimeconfig
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Runtimeconfig
 */
function Runtimeconfig(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.operations = {

    /**
     * runtimeconfig.operations.list
     *
     * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.  NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
     *
     * @alias runtimeconfig.operations.list
     * @memberOf! runtimeconfig(v1)
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
          url: 'https://runtimeconfig.googleapis.com/v1/{name}',
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
     * runtimeconfig.operations.delete
     *
     * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
     *
     * @alias runtimeconfig.operations.delete
     * @memberOf! runtimeconfig(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be deleted.
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
          url: 'https://runtimeconfig.googleapis.com/v1/{name}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * runtimeconfig.operations.cancel
     *
     * @desc Starts asynchronous cancellation on a long-running operation.  The server makes a best effort to cancel the operation, but success is not guaranteed.  If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.  Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
     *
     * @alias runtimeconfig.operations.cancel
     * @memberOf! runtimeconfig(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
     * @param {runtimeconfig(v1).CancelOperationRequest} params.resource Request body data
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
          url: 'https://runtimeconfig.googleapis.com/v1/{name}:cancel',
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
 * @typedef ListOperationsResponse
 * @memberOf! runtimeconfig(v1)
 * @type object
 * @property {string} nextPageToken The standard List next-page token.
 * @property {runtimeconfig(v1).Operation[]} operations A list of operations that matches the specified filter in the request.
 */
/**
 * @typedef Empty
 * @memberOf! runtimeconfig(v1)
 * @type object
 */
/**
 * @typedef Status
 * @memberOf! runtimeconfig(v1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef Operation
 * @memberOf! runtimeconfig(v1)
 * @type object
* @property {runtimeconfig(v1).Status} error The error result of the operation in case of failure or cancellation.
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
 * @typedef CancelOperationRequest
 * @memberOf! runtimeconfig(v1)
 * @type object
 */
module.exports = Runtimeconfig;
