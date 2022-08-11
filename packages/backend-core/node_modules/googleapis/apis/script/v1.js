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
 * Google Apps Script Execution API
 *
 * Executes Google Apps Script projects.
 *
 * @example
 * var google = require('googleapis');
 * var script = google.script('v1');
 *
 * @namespace script
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Script
 */
function Script(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.scripts = {

    /**
     * script.scripts.run
     *
     * @desc Runs a function in an Apps Script project that has been deployed for use with the Apps Script Execution API. This method requires authorization with an OAuth 2.0 token that includes at least one of the scopes listed in the [Authentication](#authentication) section; script projects that do not require authorization cannot be executed through this API. To find the correct scopes to include in the authentication token, open the project in the script editor, then select **File > Project properties** and click the **Scopes** tab.
     *
     * @alias script.scripts.run
     * @memberOf! script(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.scriptId The project key of the script to be executed. To find the project key, open the project in the script editor, then select **File > Project properties**.
     * @param {script(v1).ExecutionRequest} params.resource Request body data
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
          url: 'https://script.googleapis.com/v1/scripts/{scriptId}:run',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['scriptId'],
        pathParams: ['scriptId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef ExecutionRequest
 * @memberOf! script(v1)
 * @type object
 * @property {string} function The name of the function to execute in the given script. The name does not include parentheses or parameters.
 * @property {any[]} parameters The parameters to be passed to the function being executed. The type for each parameter should match the expected type in Apps Script. Parameters cannot be Apps Script-specific objects (such as a `Document` or `Calendar`); they can only be primitive types such as a `string`, `number`, `array`, `object`, or `boolean`. Optional.
 * @property {string} sessionState This field is not used.
 * @property {boolean} devMode If `true` and the user is an owner of the script, the script runs at the most recently saved version rather than the version deployed for use with the Execution API. Optional; default is `false`.
 */
/**
 * @typedef Operation
 * @memberOf! script(v1)
 * @type object
 * @property {string} name This field is not used.
 * @property {object} metadata This field is not used.
 * @property {boolean} done This field is not used.
 * @property {script(v1).Status} error If a `run` call succeeds but the script function (or Apps Script itself) throws an exception, this field will contain a `Status` object. The `Status` object&#39;s `details` field will contain an array with a single `ExecutionError` object that provides information about the nature of the error.
 * @property {object} response If the script function returns successfully, this field will contain an `ExecutionResponse` object with the function&#39;s return value as the object&#39;s `result` field.
 */
/**
 * @typedef Status
 * @memberOf! script(v1)
 * @type object
 * @property {integer} code The status code, which should be an enum value of google.rpc.Code.
 * @property {string} message A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.
 * @property {object[]} details An array that contains a single `ExecutionError` object that provides information about the nature of the error.
 */
/**
 * @typedef ExecutionError
 * @memberOf! script(v1)
 * @type object
 * @property {script(v1).ScriptStackTraceElement[]} scriptStackTraceElements An array of objects that provide a stack trace through the script to show where the execution failed, with the deepest call first.
 * @property {string} errorMessage The error message thrown by Apps Script, usually localized into the user&#39;s language.
 * @property {string} errorType The error type, for example `TypeError` or `ReferenceError`. If the error type is unavailable, this field is not included.
 */
/**
 * @typedef ScriptStackTraceElement
 * @memberOf! script(v1)
 * @type object
 * @property {string} function The name of the function that failed.
 * @property {integer} lineNumber The line number where the script failed.
 */
/**
 * @typedef ExecutionResponse
 * @memberOf! script(v1)
 * @type object
 * @property {any} result The return value of the script function. The type will match the type returned in Apps Script. Functions called through the Execution API cannot return Apps Script-specific objects (such as a `Document` or `Calendar`); they can only return primitive types such as a `string`, `number`, `array`, `object`, or `boolean`.
 * @property {string} status 
 */
module.exports = Script;
