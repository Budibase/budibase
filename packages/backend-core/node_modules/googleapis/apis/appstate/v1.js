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
 * Google App State API
 *
 * The Google App State API.
 *
 * @example
 * var google = require('googleapis');
 * var appstate = google.appstate('v1');
 *
 * @namespace appstate
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Appstate
 */
function Appstate(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.states = {

    /**
     * appstate.states.clear
     *
     * @desc Clears (sets to empty) the data for the passed key if and only if the passed version matches the currently stored version. This method results in a conflict error on version mismatch.
     *
     * @alias appstate.states.clear
     * @memberOf! appstate(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.currentDataVersion The version of the data to be cleared. Version strings are returned by the server.
     * @param {integer} params.stateKey The key for the data to be retrieved.
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
          url: 'https://www.googleapis.com/appstate/v1/states/{stateKey}/clear',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['stateKey'],
        pathParams: ['stateKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * appstate.states.delete
     *
     * @desc Deletes a key and the data associated with it. The key is removed and no longer counts against the key quota. Note that since this method is not safe in the face of concurrent modifications, it should only be used for development and testing purposes. Invoking this method in shipping code can result in data loss and data corruption.
     *
     * @alias appstate.states.delete
     * @memberOf! appstate(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.stateKey The key for the data to be retrieved.
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
          url: 'https://www.googleapis.com/appstate/v1/states/{stateKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['stateKey'],
        pathParams: ['stateKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * appstate.states.get
     *
     * @desc Retrieves the data corresponding to the passed key. If the key does not exist on the server, an HTTP 404 will be returned.
     *
     * @alias appstate.states.get
     * @memberOf! appstate(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.stateKey The key for the data to be retrieved.
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
          url: 'https://www.googleapis.com/appstate/v1/states/{stateKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['stateKey'],
        pathParams: ['stateKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * appstate.states.list
     *
     * @desc Lists all the states keys, and optionally the state data.
     *
     * @alias appstate.states.list
     * @memberOf! appstate(v1)
     *
     * @param {object=} params Parameters for request
     * @param {boolean=} params.includeData Whether to include the full data in addition to the version number
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
          url: 'https://www.googleapis.com/appstate/v1/states',
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
     * appstate.states.update
     *
     * @desc Update the data associated with the input key if and only if the passed version matches the currently stored version. This method is safe in the face of concurrent writes. Maximum per-key size is 128KB.
     *
     * @alias appstate.states.update
     * @memberOf! appstate(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.currentStateVersion The version of the app state your application is attempting to update. If this does not match the current version, this method will return a conflict error. If there is no data stored on the server for this key, the update will succeed irrespective of the value of this parameter.
     * @param {integer} params.stateKey The key for the data to be retrieved.
     * @param {appstate(v1).UpdateRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/appstate/v1/states/{stateKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['stateKey'],
        pathParams: ['stateKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef GetResponse
 * @memberOf! appstate(v1)
 * @type object
 * @property {string} currentStateVersion The current app state version.
 * @property {string} data The requested data.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string appstate#getResponse.
 * @property {integer} stateKey The key for the data.
 */
/**
 * @typedef ListResponse
 * @memberOf! appstate(v1)
 * @type object
 * @property {appstate(v1).GetResponse[]} items The app state data.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string appstate#listResponse.
 * @property {integer} maximumKeyCount The maximum number of keys allowed for this user.
 */
/**
 * @typedef UpdateRequest
 * @memberOf! appstate(v1)
 * @type object
 * @property {string} data The new app state data that your application is trying to update with.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string appstate#updateRequest.
 */
/**
 * @typedef WriteResult
 * @memberOf! appstate(v1)
 * @type object
 * @property {string} currentStateVersion The version of the data for this key on the server.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string appstate#writeResult.
 * @property {integer} stateKey The written key.
 */
module.exports = Appstate;
