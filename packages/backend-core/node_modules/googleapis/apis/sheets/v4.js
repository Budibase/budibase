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
 * Google Sheets API
 *
 * Reads and writes Google Sheets.
 *
 * @example
 * var google = require('googleapis');
 * var sheets = google.sheets('v4');
 *
 * @namespace sheets
 * @type {Function}
 * @version v4
 * @variation v4
 * @param {object=} options Options for Sheets
 */
function Sheets(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.spreadsheets = {

    /**
     * sheets.spreadsheets.create
     *
     * @desc Creates a spreadsheet, returning the newly created spreadsheet.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Sheets API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/sheets
     * // 2. Install the Node.js client library by running
     * //    `npm install googleapis --save`
     *
     * var google = require('googleapis');
     * var sheets = google.sheets('v4');
     *
     * authorize(function(authClient) {
     *   var request = {
     *     resource: {
     *       // TODO: Add desired properties of the request body.
     *     },
     *
     *     auth: authClient
     *   };
     *
     *   sheets.spreadsheets.create(request, function(err, response) {
     *     if (err) {
     *       console.log(err);
     *       return;
     *     }
     *
     *     // TODO: Change code below to process the `response` object:
     *     console.log(JSON.stringify(response, null, 2));
     *   });
     * });
     *
     * function authorize(callback) {
     *   // TODO: Change placeholder below to generate authentication credentials. See:
     *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
     *   //
     *   // Authorize using one of the following scopes:
     *   //    https://www.googleapis.com/auth/drive
     *   //    https://www.googleapis.com/auth/spreadsheets
     *   var authClient = null;
     *
     *   if (authClient == null) {
     *     console.log('authentication failed');
     *     return;
     *   }
     *   callback(authClient);
     * }
     *
     * @alias sheets.spreadsheets.create
     * @memberOf! sheets(v4)
     *
     * @param {object} params Parameters for request
     * @param {sheets(v4).Spreadsheet} params.resource Request body data
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
          url: 'https://sheets.googleapis.com/v4/spreadsheets',
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
     * sheets.spreadsheets.get
     *
     * @desc Returns the spreadsheet at the given ID. The caller must specify the spreadsheet ID.  By default, data within grids will not be returned. You can include grid data one of two ways:  * Specify a field mask listing your desired fields using the `fields` URL parameter in HTTP  * Set the includeGridData URL parameter to true.  If a field mask is set, the `includeGridData` parameter is ignored  For large spreadsheets, it is recommended to retrieve only the specific fields of the spreadsheet that you want.  To retrieve only subsets of the spreadsheet, use the ranges URL parameter. Multiple ranges can be specified.  Limiting the range will return only the portions of the spreadsheet that intersect the requested ranges. Ranges are specified using A1 notation.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Sheets API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/sheets
     * // 2. Install the Node.js client library by running
     * //    `npm install googleapis --save`
     *
     * var google = require('googleapis');
     * var sheets = google.sheets('v4');
     *
     * authorize(function(authClient) {
     *   var request = {
     *     // The spreadsheet to request.
     *     spreadsheetId: '',  // TODO: Update placeholder value.
     *
     *     auth: authClient
     *   };
     *
     *   sheets.spreadsheets.get(request, function(err, response) {
     *     if (err) {
     *       console.log(err);
     *       return;
     *     }
     *
     *     // TODO: Change code below to process the `response` object:
     *     console.log(JSON.stringify(response, null, 2));
     *   });
     * });
     *
     * function authorize(callback) {
     *   // TODO: Change placeholder below to generate authentication credentials. See:
     *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
     *   //
     *   // Authorize using one of the following scopes:
     *   //    https://www.googleapis.com/auth/drive
     *   //    https://www.googleapis.com/auth/drive.readonly
     *   //    https://www.googleapis.com/auth/spreadsheets
     *   //    https://www.googleapis.com/auth/spreadsheets.readonly
     *   var authClient = null;
     *
     *   if (authClient == null) {
     *     console.log('authentication failed');
     *     return;
     *   }
     *   callback(authClient);
     * }
     *
     * @alias sheets.spreadsheets.get
     * @memberOf! sheets(v4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.spreadsheetId The spreadsheet to request.
     * @param {string=} params.ranges The ranges to retrieve from the spreadsheet.
     * @param {boolean=} params.includeGridData True if grid data should be returned. This parameter is ignored if a field mask was set in the request.
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
          url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['spreadsheetId'],
        pathParams: ['spreadsheetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sheets.spreadsheets.batchUpdate
     *
     * @desc Applies one or more updates to the spreadsheet.  Each request is validated before being applied. If any request is not valid then the entire request will fail and nothing will be applied.  Some requests have replies to give you some information about how they are applied. The replies will mirror the requests.  For example, if you applied 4 updates and the 3rd one had a reply, then the response will have 2 empty replies, the actual reply, and another empty reply, in that order.  Due to the collaborative nature of spreadsheets, it is not guaranteed that the spreadsheet will reflect exactly your changes after this completes, however it is guaranteed that the updates in the request will be applied together atomically. Your changes may be altered with respect to collaborator changes. If there are no collaborators, the spreadsheet should reflect your changes.
     *
     * @example
     * // BEFORE RUNNING:
     * // ---------------
     * // 1. If not already done, enable the Google Sheets API
     * //    and check the quota for your project at
     * //    https://console.developers.google.com/apis/api/sheets
     * // 2. Install the Node.js client library by running
     * //    `npm install googleapis --save`
     *
     * var google = require('googleapis');
     * var sheets = google.sheets('v4');
     *
     * authorize(function(authClient) {
     *   var request = {
     *     // The spreadsheet to apply the updates to.
     *     spreadsheetId: '',  // TODO: Update placeholder value.
     *
     *     resource: {
     *       // TODO: Add desired properties of the request body.
     *     },
     *
     *     auth: authClient
     *   };
     *
     *   sheets.spreadsheets.batchUpdate(request, function(err, response) {
     *     if (err) {
     *       console.log(err);
     *       return;
     *     }
     *
     *     // TODO: Change code below to process the `response` object:
     *     console.log(JSON.stringify(response, null, 2));
     *   });
     * });
     *
     * function authorize(callback) {
     *   // TODO: Change placeholder below to generate authentication credentials. See:
     *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
     *   //
     *   // Authorize using one of the following scopes:
     *   //    https://www.googleapis.com/auth/drive
     *   //    https://www.googleapis.com/auth/spreadsheets
     *   var authClient = null;
     *
     *   if (authClient == null) {
     *     console.log('authentication failed');
     *     return;
     *   }
     *   callback(authClient);
     * }
     *
     * @alias sheets.spreadsheets.batchUpdate
     * @memberOf! sheets(v4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.spreadsheetId The spreadsheet to apply the updates to.
     * @param {sheets(v4).BatchUpdateSpreadsheetRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    batchUpdate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}:batchUpdate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['spreadsheetId'],
        pathParams: ['spreadsheetId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    values: {

      /**
       * sheets.spreadsheets.values.clear
       *
       * @desc Clears values from a spreadsheet. The caller must specify the spreadsheet ID and range. Only values are cleared -- all other properties of the cell (such as formatting, data validation, etc..) are kept.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to update.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     // The A1 notation of the values to clear.
       *     range: '',  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.clear(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.clear
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.spreadsheetId The ID of the spreadsheet to update.
       * @param {string} params.range The A1 notation of the values to clear.
       * @param {sheets(v4).ClearValuesRequest} params.resource Request body data
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
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:clear',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId', 'range'],
          pathParams: ['spreadsheetId', 'range'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.batchGet
       *
       * @desc Returns one or more ranges of values from a spreadsheet. The caller must specify the spreadsheet ID and one or more ranges.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to retrieve data from.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.batchGet(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/drive.readonly
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   //    https://www.googleapis.com/auth/spreadsheets.readonly
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.batchGet
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.spreadsheetId The ID of the spreadsheet to retrieve data from.
       * @param {string=} params.ranges The A1 notation of the values to retrieve.
       * @param {string=} params.valueRenderOption How values should be represented in the output. The default render option is ValueRenderOption.FORMATTED_VALUE.
       * @param {string=} params.dateTimeRenderOption How dates, times, and durations should be represented in the output. This is ignored if value_render_option is FORMATTED_VALUE. The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
       * @param {string=} params.majorDimension The major dimension that results should use.  For example, if the spreadsheet data is: `A1=1,B1=2,A2=3,B2=4`, then requesting `range=A1:B2,majorDimension=ROWS` will return `[[1,2],[3,4]]`, whereas requesting `range=A1:B2,majorDimension=COLUMNS` will return `[[1,3],[2,4]]`.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchGet: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values:batchGet',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId'],
          pathParams: ['spreadsheetId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.batchUpdate
       *
       * @desc Sets values in one or more ranges of a spreadsheet. The caller must specify the spreadsheet ID, a valueInputOption, and one or more ValueRanges.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to update.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.batchUpdate(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.batchUpdate
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.spreadsheetId The ID of the spreadsheet to update.
       * @param {sheets(v4).BatchUpdateValuesRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchUpdate: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values:batchUpdate',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId'],
          pathParams: ['spreadsheetId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.get
       *
       * @desc Returns a range of values from a spreadsheet. The caller must specify the spreadsheet ID and a range.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to retrieve data from.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     // The A1 notation of the values to retrieve.
       *     range: '',  // TODO: Update placeholder value.
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.get(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/drive.readonly
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   //    https://www.googleapis.com/auth/spreadsheets.readonly
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.get
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.spreadsheetId The ID of the spreadsheet to retrieve data from.
       * @param {string=} params.valueRenderOption How values should be represented in the output. The default render option is ValueRenderOption.FORMATTED_VALUE.
       * @param {string=} params.dateTimeRenderOption How dates, times, and durations should be represented in the output. This is ignored if value_render_option is FORMATTED_VALUE. The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
       * @param {string} params.range The A1 notation of the values to retrieve.
       * @param {string=} params.majorDimension The major dimension that results should use.  For example, if the spreadsheet data is: `A1=1,B1=2,A2=3,B2=4`, then requesting `range=A1:B2,majorDimension=ROWS` will return `[[1,2],[3,4]]`, whereas requesting `range=A1:B2,majorDimension=COLUMNS` will return `[[1,3],[2,4]]`.
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
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId', 'range'],
          pathParams: ['spreadsheetId', 'range'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.append
       *
       * @desc Appends values to a spreadsheet. The input range is used to search for existing data and find a "table" within that range. Values will be appended to the next row of the table, starting with the first column of the table. See the [guide](/sheets/guides/values#appending_values) and [sample code](/sheets/samples/writing#append_values) for specific details of how tables are detected and data is appended.  The caller must specify the spreadsheet ID, range, and a valueInputOption.  The `valueInputOption` only controls how the input data will be added to the sheet (column-wise or row-wise), it does not influence what cell the data starts being written to.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to update.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     // The A1 notation of a range to search for a logical table of data.
       *     // Values will be appended after the last row of the table.
       *     range: '',  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.append(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.append
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.responseValueRenderOption Determines how values in the response should be rendered. The default render option is ValueRenderOption.FORMATTED_VALUE.
       * @param {string=} params.valueInputOption How the input data should be interpreted.
       * @param {string=} params.responseDateTimeRenderOption Determines how dates, times, and durations in the response should be rendered. This is ignored if response_value_render_option is FORMATTED_VALUE. The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
       * @param {boolean=} params.includeValuesInResponse Determines if the update response should include the values of the cells that were appended. By default, responses do not include the updated values.
       * @param {string} params.spreadsheetId The ID of the spreadsheet to update.
       * @param {string} params.range The A1 notation of a range to search for a logical table of data. Values will be appended after the last row of the table.
       * @param {string=} params.insertDataOption How the input data should be inserted.
       * @param {sheets(v4).ValueRange} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      append: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId', 'range'],
          pathParams: ['spreadsheetId', 'range'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.update
       *
       * @desc Sets values in a range of a spreadsheet. The caller must specify the spreadsheet ID, range, and a valueInputOption.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to update.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     // The A1 notation of the values to update.
       *     range: '',  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.update(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.update
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.responseValueRenderOption Determines how values in the response should be rendered. The default render option is ValueRenderOption.FORMATTED_VALUE.
       * @param {string=} params.valueInputOption How the input data should be interpreted.
       * @param {string=} params.responseDateTimeRenderOption Determines how dates, times, and durations in the response should be rendered. This is ignored if response_value_render_option is FORMATTED_VALUE. The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
       * @param {boolean=} params.includeValuesInResponse Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. If the range to write was larger than than the range actually written, the response will include all values in the requested range (excluding trailing empty rows and columns).
       * @param {string} params.spreadsheetId The ID of the spreadsheet to update.
       * @param {string} params.range The A1 notation of the values to update.
       * @param {sheets(v4).ValueRange} params.resource Request body data
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
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId', 'range'],
          pathParams: ['spreadsheetId', 'range'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * sheets.spreadsheets.values.batchClear
       *
       * @desc Clears one or more ranges of values from a spreadsheet. The caller must specify the spreadsheet ID and one or more ranges. Only values are cleared -- all other properties of the cell (such as formatting, data validation, etc..) are kept.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet to update.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.values.batchClear(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.values.batchClear
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {string} params.spreadsheetId The ID of the spreadsheet to update.
       * @param {sheets(v4).BatchClearValuesRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchClear: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values:batchClear',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId'],
          pathParams: ['spreadsheetId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    sheets: {

      /**
       * sheets.spreadsheets.sheets.copyTo
       *
       * @desc Copies a single sheet from a spreadsheet to another spreadsheet. Returns the properties of the newly created sheet.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Sheets API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/sheets
       * // 2. Install the Node.js client library by running
       * //    `npm install googleapis --save`
       *
       * var google = require('googleapis');
       * var sheets = google.sheets('v4');
       *
       * authorize(function(authClient) {
       *   var request = {
       *     // The ID of the spreadsheet containing the sheet to copy.
       *     spreadsheetId: '',  // TODO: Update placeholder value.
       *
       *     // The ID of the sheet to copy.
       *     sheetId: 0,  // TODO: Update placeholder value.
       *
       *     resource: {
       *       // TODO: Add desired properties of the request body.
       *     },
       *
       *     auth: authClient
       *   };
       *
       *   sheets.spreadsheets.sheets.copyTo(request, function(err, response) {
       *     if (err) {
       *       console.log(err);
       *       return;
       *     }
       *
       *     // TODO: Change code below to process the `response` object:
       *     console.log(JSON.stringify(response, null, 2));
       *   });
       * });
       *
       * function authorize(callback) {
       *   // TODO: Change placeholder below to generate authentication credentials. See:
       *   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample,
       *   //
       *   // Authorize using one of the following scopes:
       *   //    https://www.googleapis.com/auth/drive
       *   //    https://www.googleapis.com/auth/spreadsheets
       *   var authClient = null;
       *
       *   if (authClient == null) {
       *     console.log('authentication failed');
       *     return;
       *   }
       *   callback(authClient);
       * }
       *
       * @alias sheets.spreadsheets.sheets.copyTo
       * @memberOf! sheets(v4)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.sheetId The ID of the sheet to copy.
       * @param {string} params.spreadsheetId The ID of the spreadsheet containing the sheet to copy.
       * @param {sheets(v4).CopySheetToAnotherSpreadsheetRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      copyTo: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/sheets/{sheetId}:copyTo',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['spreadsheetId', 'sheetId'],
          pathParams: ['sheetId', 'spreadsheetId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef AddNamedRangeResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).NamedRange} namedRange The named range to add.
 */
/**
 * @typedef UpdateProtectedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ProtectedRange} protectedRange The protected range to update with the new properties.
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `protectedRange` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
*/
/**
 * @typedef Padding
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} right The right padding of the cell.
 * @property {integer} left The left padding of the cell.
 * @property {integer} top The top padding of the cell.
 * @property {integer} bottom The bottom padding of the cell.
 */
/**
 * @typedef MergeCellsRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} mergeType How the cells should be merged.
 * @property {sheets(v4).GridRange} range The range of cells to merge.
 */
/**
 * @typedef AddSheetResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).SheetProperties} properties The properties of the newly added sheet.
 */
/**
 * @typedef PivotGroupValueMetadata
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ExtendedValue} value The calculated value the metadata corresponds to.
(Note that formulaValue is not valid,
 because the values will be calculated.)
* @property {boolean} collapsed True if the data corresponding to the value is collapsed.
*/
/**
 * @typedef UpdateEmbeddedObjectPositionResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).EmbeddedObjectPosition} position The new position of the embedded object.
 */
/**
 * @typedef ClearValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {string} clearedRange The range (in A1 notation) that was cleared.
(If the request was for an unbounded range or a ranger larger
 than the bounds of the sheet, this will be the actual range
 that was cleared, bounded to the sheet&#39;s limits.)
*/
/**
 * @typedef UpdateConditionalFormatRuleRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} sheetId The sheet of the rule to move.  Required if new_index is set,
unused otherwise.
* @property {sheets(v4).ConditionalFormatRule} rule The rule that should replace the rule at the given index.
* @property {integer} index The zero-based index of the rule that should be replaced or moved.
* @property {integer} newIndex The zero-based new index the rule should end up at.
*/
/**
 * @typedef TextFormat
 * @memberOf! sheets(v4)
 * @type object
 * @property {boolean} bold True if the text is bold.
 * @property {boolean} italic True if the text is italicized.
 * @property {sheets(v4).Color} foregroundColor The foreground color of the text.
 * @property {string} fontFamily The font family.
 * @property {boolean} strikethrough True if the text has a strikethrough.
 * @property {integer} fontSize The size of the font.
 * @property {boolean} underline True if the text is underlined.
 */
/**
 * @typedef UpdateChartSpecRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} chartId The ID of the chart to update.
 * @property {sheets(v4).ChartSpec} spec The specification to apply to the chart.
 */
/**
 * @typedef GridCoordinate
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet this coordinate is on.
 * @property {integer} rowIndex The row index of the coordinate.
 * @property {integer} columnIndex The column index of the coordinate.
 */
/**
 * @typedef DeleteFilterViewRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} filterId The ID of the filter to delete.
 */
/**
 * @typedef BatchUpdateValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} totalUpdatedSheets The total number of sheets where at least one cell in the sheet was
updated.
* @property {integer} totalUpdatedColumns The total number of columns where at least one cell in the column was
updated.
* @property {sheets(v4).UpdateValuesResponse[]} responses One UpdateValuesResponse per requested range, in the same order as
the requests appeared.
* @property {integer} totalUpdatedCells The total number of cells updated.
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {integer} totalUpdatedRows The total number of rows where at least one cell in the row was updated.
*/
/**
 * @typedef UpdateNamedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `namedRange` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).NamedRange} namedRange The named range to update with the new properties.
*/
/**
 * @typedef UpdateValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} updatedColumns The number of columns where at least one cell in the column was updated.
* @property {integer} updatedCells The number of cells updated.
* @property {sheets(v4).ValueRange} updatedData The values of the cells after updates were applied.
This is only included if the request&#39;s `includeValuesInResponse` field
was `true`.
* @property {string} updatedRange The range (in A1 notation) that updates were applied to.
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {integer} updatedRows The number of rows where at least one cell in the row was updated.
*/
/**
 * @typedef SpreadsheetProperties
 * @memberOf! sheets(v4)
 * @type object
* @property {string} timeZone The time zone of the spreadsheet, in CLDR format such as
`America/New_York`. If the time zone isn&#39;t recognized, this may
be a custom time zone such as `GMT-07:00`.
* @property {string} autoRecalc The amount of time to wait before volatile functions are recalculated.
* @property {string} locale The locale of the spreadsheet in one of the following formats:

* an ISO 639-1 language code such as `en`

* an ISO 639-2 language code such as `fil`, if no 639-1 code exists

* a combination of the ISO language code and country code, such as `en_US`

Note: when updating this field, not all locales/languages are supported.
* @property {string} title The title of the spreadsheet.
* @property {sheets(v4).CellFormat} defaultFormat The default format of all cells in the spreadsheet.
CellData.effectiveFormat will not be set if the
cell&#39;s format is equal to this default format.
This field is read-only.
*/
/**
 * @typedef CellData
 * @memberOf! sheets(v4)
 * @type object
* @property {string} hyperlink A hyperlink this cell points to, if any.
This field is read-only.  (To set it, use a `=HYPERLINK` formula.)
* @property {sheets(v4).CellFormat} effectiveFormat The effective format being used by the cell.
This includes the results of applying any conditional formatting and,
if the cell contains a formula, the computed number format.
If the effective format is the default format, effective format will
not be written.
This field is read-only.
* @property {string} note Any note on the cell.
* @property {string} formattedValue The formatted value of the cell.
This is the value as it&#39;s shown to the user.
This field is read-only.
* @property {sheets(v4).ExtendedValue} userEnteredValue The value the user entered in the cell. e.g, `1234`, `&#39;Hello&#39;`, or `=NOW()`
Note: Dates, Times and DateTimes are represented as doubles in
serial number format.
* @property {sheets(v4).DataValidationRule} dataValidation A data validation rule on the cell, if any.

When writing, the new data validation rule will overwrite any prior rule.
* @property {sheets(v4).CellFormat} userEnteredFormat The format the user entered for the cell.

When writing, the new format will be merged with the existing format.
* @property {sheets(v4).PivotTable} pivotTable A pivot table anchored at this cell. The size of pivot table itself
is computed dynamically based on its data, grouping, filters, values,
etc. Only the top-left cell of the pivot table contains the pivot table
definition. The other cells will contain the calculated values of the
results of the pivot in their effective_value fields.
* @property {sheets(v4).TextFormatRun[]} textFormatRuns Runs of rich text applied to subsections of the cell.  Runs are only valid
on user entered strings, not formulas, bools, or numbers.
Runs start at specific indexes in the text and continue until the next
run. Properties of a run will continue unless explicitly changed
in a subsequent run (and properties of the first run will continue
the properties of the cell unless explicitly changed).

When writing, the new runs will overwrite any prior runs.  When writing a
new user_entered_value, previous runs will be erased.
* @property {sheets(v4).ExtendedValue} effectiveValue The effective value of the cell. For cells with formulas, this will be
the calculated value.  For cells with literals, this will be
the same as the user_entered_value.
This field is read-only.
*/
/**
 * @typedef UnmergeCellsRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange} range The range within which all cells should be unmerged.
If the range spans multiple merges, all will be unmerged.
The range must not partially span any merge.
*/
/**
 * @typedef TextToColumnsRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange} source The source data range.  This must span exactly one column.
* @property {string} delimiter The delimiter to use. Used only if delimiterType is
CUSTOM.
* @property {string} delimiterType The delimiter type to use.
*/
/**
 * @typedef AddProtectedRangeResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).ProtectedRange} protectedRange The newly added protected range.
 */
/**
 * @typedef BooleanCondition
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ConditionValue[]} values The values of the condition. The number of supported values depends
on the condition type.  Some support zero values,
others one or two values,
and ConditionType.ONE_OF_LIST supports an arbitrary number of values.
* @property {string} type The type of condition.
*/
/**
 * @typedef DeleteProtectedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} protectedRangeId The ID of the protected range to delete.
 */
/**
 * @typedef BasicChartDomain
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ChartData} domain The data of the domain. For example, if charting stock prices over time,
this is the data representing the dates.
*/
/**
 * @typedef DimensionRange
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet this span is on.
 * @property {integer} endIndex The end (exclusive) of the span, or not set if unbounded.
 * @property {integer} startIndex The start (inclusive) of the span, or not set if unbounded.
 * @property {string} dimension The dimension of the span.
 */
/**
 * @typedef Response
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).UpdateEmbeddedObjectPositionResponse} updateEmbeddedObjectPosition A reply from updating an embedded object&#39;s position.
 * @property {sheets(v4).AddFilterViewResponse} addFilterView A reply from adding a filter view.
 * @property {sheets(v4).AddSheetResponse} addSheet A reply from adding a sheet.
 * @property {sheets(v4).FindReplaceResponse} findReplace A reply from doing a find/replace.
 * @property {sheets(v4).AddProtectedRangeResponse} addProtectedRange A reply from adding a protected range.
 * @property {sheets(v4).UpdateConditionalFormatRuleResponse} updateConditionalFormatRule A reply from updating a conditional format rule.
 * @property {sheets(v4).AddChartResponse} addChart A reply from adding a chart.
 * @property {sheets(v4).DeleteConditionalFormatRuleResponse} deleteConditionalFormatRule A reply from deleting a conditional format rule.
 * @property {sheets(v4).AddBandingResponse} addBanding A reply from adding a banded range.
 * @property {sheets(v4).DuplicateSheetResponse} duplicateSheet A reply from duplicating a sheet.
 * @property {sheets(v4).DuplicateFilterViewResponse} duplicateFilterView A reply from duplicating a filter view.
 * @property {sheets(v4).AddNamedRangeResponse} addNamedRange A reply from adding a named range.
 */
/**
 * @typedef AddConditionalFormatRuleRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).ConditionalFormatRule} rule The rule to add.
 * @property {integer} index The zero-based index where the rule should be inserted.
 */
/**
 * @typedef FilterView
 * @memberOf! sheets(v4)
 * @type object
* @property {string} title The name of the filter view.
* @property {string} namedRangeId The named range this filter view is backed by, if any.

When writing, only one of range or named_range_id
may be set.
* @property {sheets(v4).SortSpec[]} sortSpecs The sort order per column. Later specifications are used when values
are equal in the earlier specifications.
* @property {sheets(v4).GridRange} range The range this filter view covers.

When writing, only one of range or named_range_id
may be set.
* @property {object} criteria The criteria for showing/hiding values per column.
The map&#39;s key is the column index, and the value is the criteria for
that column.
* @property {integer} filterViewId The ID of the filter view.
*/
/**
 * @typedef SortRangeRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange} range The range to sort.
* @property {sheets(v4).SortSpec[]} sortSpecs The sort order per column. Later specifications are used when values
are equal in the earlier specifications.
*/
/**
 * @typedef AddBandingResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).BandedRange} bandedRange The banded range that was added.
 */
/**
 * @typedef TextFormatRun
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} startIndex The character index where this run starts.
 * @property {sheets(v4).TextFormat} format The format of this run.  Absent values inherit the cell&#39;s format.
 */
/**
 * @typedef UpdateFilterViewRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).FilterView} filter The new properties of the filter view.
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `filter` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
*/
/**
 * @typedef UpdateConditionalFormatRuleResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} oldIndex The old index of the rule. Not set if a rule was replaced
(because it is the same as new_index).
* @property {sheets(v4).ConditionalFormatRule} newRule The new rule that replaced the old rule (if replacing),
or the rule that was moved (if moved)
* @property {sheets(v4).ConditionalFormatRule} oldRule The old (deleted) rule. Not set if a rule was moved
(because it is the same as new_rule).
* @property {integer} newIndex The index of the new rule.
*/
/**
 * @typedef FilterCriteria
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).BooleanCondition} condition A condition that must be true for values to be shown.
(This does not override hiddenValues -- if a value is listed there,
 it will still be hidden.)
* @property {string[]} hiddenValues Values that should be hidden.
*/
/**
 * @typedef DeleteDimensionRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).DimensionRange} range The dimensions to delete from the sheet.
 */
/**
 * @typedef PivotTable
 * @memberOf! sheets(v4)
 * @type object
* @property {string} valueLayout Whether values should be listed horizontally (as columns)
or vertically (as rows).
* @property {sheets(v4).PivotGroup[]} columns Each column grouping in the pivot table.
* @property {sheets(v4).GridRange} source The range the pivot table is reading data from.
* @property {sheets(v4).PivotGroup[]} rows Each row grouping in the pivot table.
* @property {sheets(v4).PivotValue[]} values A list of values to include in the pivot table.
* @property {object} criteria An optional mapping of filters per source column offset.

The filters will be applied before aggregating data into the pivot table.
The map&#39;s key is the column offset of the source range that you want to
filter, and the value is the criteria for that column.

For example, if the source was `C10:E15`, a key of `0` will have the filter
for column `C`, whereas the key `1` is for column `D`.
*/
/**
 * @typedef DataValidationRule
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).BooleanCondition} condition The condition that data in the cell must match.
* @property {string} inputMessage A message to show the user when adding data to the cell.
* @property {boolean} showCustomUi True if the UI should be customized based on the kind of condition.
If true, &quot;List&quot; conditions will show a dropdown.
* @property {boolean} strict True if invalid data should be rejected.
*/
/**
 * @typedef UpdateSpreadsheetPropertiesRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root &#39;properties&#39; is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).SpreadsheetProperties} properties The properties to update.
*/
/**
 * @typedef ChartSourceRange
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange[]} sources The ranges of data for a series or domain.
Exactly one dimension must have a length of 1,
and all sources in the list must have the same dimension
with length 1.
The domain (if it exists) &amp; all series must have the same number
of source ranges. If using more than one source range, then the source
range at a given offset must be contiguous across the domain and series.

For example, these are valid configurations:

    domain sources: A1:A5
    series1 sources: B1:B5
    series2 sources: D6:D10

    domain sources: A1:A5, C10:C12
    series1 sources: B1:B5, D10:D12
    series2 sources: C1:C5, E10:E12
*/
/**
 * @typedef BatchUpdateValuesRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} valueInputOption How the input data should be interpreted.
* @property {sheets(v4).ValueRange[]} data The new values to apply to the spreadsheet.
* @property {string} responseValueRenderOption Determines how values in the response should be rendered.
The default render option is ValueRenderOption.FORMATTED_VALUE.
* @property {string} responseDateTimeRenderOption Determines how dates, times, and durations in the response should be
rendered. This is ignored if response_value_render_option is
FORMATTED_VALUE.
The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
* @property {boolean} includeValuesInResponse Determines if the update response should include the values
of the cells that were updated. By default, responses
do not include the updated values. The `updatedData` field within
each of the BatchUpdateValuesResponse.responses will contain
the updated values. If the range to write was larger than than the range
actually written, the response will include all values in the requested
range (excluding trailing empty rows and columns).
*/
/**
 * @typedef ClearBasicFilterRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet ID on which the basic filter should be cleared.
 */
/**
 * @typedef BatchClearValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {string[]} clearedRanges The ranges that were cleared, in A1 notation.
(If the requests were for an unbounded range or a ranger larger
 than the bounds of the sheet, this will be the actual ranges
 that were cleared, bounded to the sheet&#39;s limits.)
*/
/**
 * @typedef ConditionalFormatRule
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GradientRule} gradientRule The formatting will vary based on the gradients in the rule.
* @property {sheets(v4).BooleanRule} booleanRule The formatting is either &quot;on&quot; or &quot;off&quot; according to the rule.
* @property {sheets(v4).GridRange[]} ranges The ranges that will be formatted if the condition is true.
All the ranges must be on the same grid.
*/
/**
 * @typedef UpdateBordersRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).Border} right The border to put at the right of the range.
 * @property {sheets(v4).Border} innerVertical The vertical border to put within the range.
 * @property {sheets(v4).Border} top The border to put at the top of the range.
 * @property {sheets(v4).Border} innerHorizontal The horizontal border to put within the range.
 * @property {sheets(v4).GridRange} range The range whose borders should be updated.
 * @property {sheets(v4).Border} bottom The border to put at the bottom of the range.
 * @property {sheets(v4).Border} left The border to put at the left of the range.
 */
/**
 * @typedef PivotFilterCriteria
 * @memberOf! sheets(v4)
 * @type object
 * @property {string[]} visibleValues Values that should be included.  Values not listed here are excluded.
 */
/**
 * @typedef Borders
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).Border} left The left border of the cell.
 * @property {sheets(v4).Border} right The right border of the cell.
 * @property {sheets(v4).Border} top The top border of the cell.
 * @property {sheets(v4).Border} bottom The bottom border of the cell.
 */
/**
 * @typedef EmbeddedChart
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} chartId The ID of the chart.
 * @property {sheets(v4).EmbeddedObjectPosition} position The position of the chart.
 * @property {sheets(v4).ChartSpec} spec The specification of the chart.
 */
/**
 * @typedef Color
 * @memberOf! sheets(v4)
 * @type object
* @property {number} green The amount of green in the color as a value in the interval [0, 1].
* @property {number} blue The amount of blue in the color as a value in the interval [0, 1].
* @property {number} red The amount of red in the color as a value in the interval [0, 1].
* @property {number} alpha The fraction of this color that should be applied to the pixel. That is,
the final pixel color is defined by the equation:

  pixel color = alpha * (this color) + (1.0 - alpha) * (background color)

This means that a value of 1.0 corresponds to a solid color, whereas
a value of 0.0 corresponds to a completely transparent color. This
uses a wrapper message rather than a simple float scalar so that it is
possible to distinguish between a default value and the value being unset.
If omitted, this color object is to be rendered as a solid color
(as if the alpha value had been explicitly given with a value of 1.0).
*/
/**
 * @typedef AddSheetRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).SheetProperties} properties The properties the new sheet should have.
All properties are optional.
The sheetId field is optional; if one is not
set, an id will be randomly generated. (It is an error to specify the ID
of a sheet that already exists.)
*/
/**
 * @typedef AddProtectedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ProtectedRange} protectedRange The protected range to be added. The
protectedRangeId field is optional; if
one is not set, an id will be randomly generated. (It is an error to
specify the ID of a range that already exists.)
*/
/**
 * @typedef ValueRange
 * @memberOf! sheets(v4)
 * @type object
* @property {array[]} values The data that was read or to be written.  This is an array of arrays,
the outer array representing all the data and each inner array
representing a major dimension. Each item in the inner array
corresponds with one cell.

For output, empty trailing rows and columns will not be included.

For input, supported value types are: bool, string, and double.
Null values will be skipped.
To set a cell to an empty value, set the string value to an empty string.
* @property {string} range The range the values cover, in A1 notation.
For output, this range indicates the entire requested range,
even though the values will exclude trailing rows and columns.
When appending values, this field represents the range to search for a
table, after which values will be appended.
* @property {string} majorDimension The major dimension of the values.

For output, if the spreadsheet data is: `A1=1,B1=2,A2=3,B2=4`,
then requesting `range=A1:B2,majorDimension=ROWS` will return
`[[1,2],[3,4]]`,
whereas requesting `range=A1:B2,majorDimension=COLUMNS` will return
`[[1,3],[2,4]]`.

For input, with `range=A1:B2,majorDimension=ROWS` then `[[1,2],[3,4]]`
will set `A1=1,B1=2,A2=3,B2=4`. With `range=A1:B2,majorDimension=COLUMNS`
then `[[1,2],[3,4]]` will set `A1=1,B1=3,A2=2,B2=4`.

When writing, if this field is not set, it defaults to ROWS.
*/
/**
 * @typedef FindReplaceResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} valuesChanged The number of non-formula cells changed.
* @property {integer} rowsChanged The number of rows changed.
* @property {integer} occurrencesChanged The number of occurrences (possibly multiple within a cell) changed.
For example, if replacing `&quot;e&quot;` with `&quot;o&quot;` in `&quot;Google Sheets&quot;`, this would
be `&quot;3&quot;` because `&quot;Google Sheets&quot;` -&gt; `&quot;Googlo Shoots&quot;`.
* @property {integer} formulasChanged The number of formula cells changed.
* @property {integer} sheetsChanged The number of sheets changed.
*/
/**
 * @typedef AppendValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {string} tableRange The range (in A1 notation) of the table that values are being appended to
(before the values were appended).
Empty if no table was found.
* @property {sheets(v4).UpdateValuesResponse} updates Information about the updates that were applied.
*/
/**
 * @typedef CellFormat
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} horizontalAlignment The horizontal alignment of the value in the cell.
 * @property {string} hyperlinkDisplayType How a hyperlink, if it exists, should be displayed in the cell.
 * @property {sheets(v4).Borders} borders The borders of the cell.
 * @property {string} textDirection The direction of the text in the cell.
 * @property {sheets(v4).TextFormat} textFormat The format of the text in the cell (unless overridden by a format run).
 * @property {sheets(v4).Padding} padding The padding of the cell.
 * @property {sheets(v4).NumberFormat} numberFormat A format describing how number values should be represented to the user.
 * @property {string} wrapStrategy The wrap strategy for the value in the cell.
 * @property {sheets(v4).Color} backgroundColor The background color of the cell.
 * @property {string} verticalAlignment The vertical alignment of the value in the cell.
 */
/**
 * @typedef MoveDimensionRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).DimensionRange} source The source dimensions to move.
* @property {integer} destinationIndex The zero-based start index of where to move the source data to,
based on the coordinates *before* the source data is removed
from the grid.  Existing data will be shifted down or right
(depending on the dimension) to make room for the moved dimensions.
The source dimensions are removed from the grid, so the
the data may end up in a different index than specified.

For example, given `A1..A5` of `0, 1, 2, 3, 4` and wanting to move
`&quot;1&quot;` and `&quot;2&quot;` to between `&quot;3&quot;` and `&quot;4&quot;`, the source would be
`ROWS [1..3)`,and the destination index would be `&quot;4&quot;`
(the zero-based index of row 5).
The end result would be `A1..A5` of `0, 3, 1, 2, 4`.
*/
/**
 * @typedef BasicChartAxis
 * @memberOf! sheets(v4)
 * @type object
* @property {string} position The position of this axis.
* @property {string} title The title of this axis. If set, this overrides any title inferred
from headers of the data.
* @property {sheets(v4).TextFormat} format The format of the title.
Only valid if the axis is not associated with the domain.
*/
/**
 * @typedef PivotGroupSortValueBucket
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ExtendedValue[]} buckets Determines the bucket from which values are chosen to sort.

For example, in a pivot table with one row group &amp; two column groups,
the row group can list up to two values. The first value corresponds
to a value within the first column group, and the second value
corresponds to a value in the second column group.  If no values
are listed, this would indicate that the row should be sorted according
to the &quot;Grand Total&quot; over the column groups. If a single value is listed,
this would correspond to using the &quot;Total&quot; of that bucket.
* @property {integer} valuesIndex The offset in the PivotTable.values list which the values in this
grouping should be sorted by.
*/
/**
 * @typedef DimensionProperties
 * @memberOf! sheets(v4)
 * @type object
* @property {boolean} hiddenByUser True if this dimension is explicitly hidden.
* @property {integer} pixelSize The height (if a row) or width (if a column) of the dimension in pixels.
* @property {boolean} hiddenByFilter True if this dimension is being filtered.
This field is read-only.
*/
/**
 * @typedef EmbeddedObjectPosition
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} sheetId The sheet this is on. Set only if the embedded object
is on its own sheet. Must be non-negative.
* @property {sheets(v4).OverlayPosition} overlayPosition The position at which the object is overlaid on top of a grid.
* @property {boolean} newSheet If true, the embedded object will be put on a new sheet whose ID
is chosen for you. Used only when writing.
*/
/**
 * @typedef InterpolationPoint
 * @memberOf! sheets(v4)
 * @type object
* @property {string} value The value this interpolation point uses.  May be a formula.
Unused if type is MIN or
MAX.
* @property {sheets(v4).Color} color The color this interpolation point should use.
* @property {string} type How the value should be interpreted.
*/
/**
 * @typedef ErrorValue
 * @memberOf! sheets(v4)
 * @type object
* @property {string} type The type of error.
* @property {string} message A message with more information about the error
(in the spreadsheet&#39;s locale).
*/
/**
 * @typedef DuplicateFilterViewRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} filterId The ID of the filter being duplicated.
 */
/**
 * @typedef BatchUpdateSpreadsheetRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {boolean} includeSpreadsheetInResponse Determines if the update response should include the spreadsheet
resource.
* @property {sheets(v4).Request[]} requests A list of updates to apply to the spreadsheet.
* @property {string[]} responseRanges Limits the ranges included in the response spreadsheet.
Meaningful only if include_spreadsheet_response is &#39;true&#39;.
* @property {boolean} responseIncludeGridData True if grid data should be returned. Meaningful only if
if include_spreadsheet_response is &#39;true&#39;.
This parameter is ignored if a field mask was set in the request.
*/
/**
 * @typedef SheetProperties
 * @memberOf! sheets(v4)
 * @type object
* @property {string} title The name of the sheet.
* @property {integer} index The index of the sheet within the spreadsheet.
When adding or updating sheet properties, if this field
is excluded then the sheet will be added or moved to the end
of the sheet list. When updating sheet indices or inserting
sheets, movement is considered in &quot;before the move&quot; indexes.
For example, if there were 3 sheets (S1, S2, S3) in order to
move S1 ahead of S2 the index would have to be set to 2. A sheet
index update request will be ignored if the requested index is
identical to the sheets current index or if the requested new
index is equal to the current sheet index + 1.
* @property {boolean} hidden True if the sheet is hidden in the UI, false if it&#39;s visible.
* @property {sheets(v4).GridProperties} gridProperties Additional properties of the sheet if this sheet is a grid.
(If the sheet is an object sheet, containing a chart or image, then
this field will be absent.)
When writing it is an error to set any grid properties on non-grid sheets.
* @property {integer} sheetId The ID of the sheet. Must be non-negative.
This field cannot be changed once set.
* @property {boolean} rightToLeft True if the sheet is an RTL sheet instead of an LTR sheet.
* @property {sheets(v4).Color} tabColor The color of the tab in the UI.
* @property {string} sheetType The type of sheet. Defaults to GRID.
This field cannot be changed once set.
*/
/**
 * @typedef ClearValuesRequest
 * @memberOf! sheets(v4)
 * @type object
 */
/**
 * @typedef ProtectedRange
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange[]} unprotectedRanges The list of unprotected ranges within a protected sheet.
Unprotected ranges are only supported on protected sheets.
* @property {string} description The description of this protected range.
* @property {string} namedRangeId The named range this protected range is backed by, if any.

When writing, only one of range or named_range_id
may be set.
* @property {boolean} requestingUserCanEdit True if the user who requested this protected range can edit the
protected area.
This field is read-only.
* @property {sheets(v4).Editors} editors The users and groups with edit access to the protected range.
This field is only visible to users with edit access to the protected
range and the document.
Editors are not supported with warning_only protection.
* @property {integer} protectedRangeId The ID of the protected range.
This field is read-only.
* @property {boolean} warningOnly True if this protected range will show a warning when editing.
Warning-based protection means that every user can edit data in the
protected range, except editing will prompt a warning asking the user
to confirm the edit.

When writing: if this field is true, then editors is ignored.
Additionally, if this field is changed from true to false and the
`editors` field is not set (nor included in the field mask), then
the editors will be set to all the editors in the document.
* @property {sheets(v4).GridRange} range The range that is being protected.
The range may be fully unbounded, in which case this is considered
a protected sheet.

When writing, only one of range or named_range_id
may be set.
*/
/**
 * @typedef DeleteConditionalFormatRuleRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet the rule is being deleted from.
 * @property {integer} index The zero-based index of the rule to be deleted.
 */
/**
 * @typedef ChartSpec
 * @memberOf! sheets(v4)
 * @type object
* @property {string} hiddenDimensionStrategy Determines how the charts will use hidden rows or columns.
* @property {sheets(v4).BasicChartSpec} basicChart A basic chart specification, can be one of many kinds of charts.
See BasicChartType for the list of all
charts this supports.
* @property {string} title The title of the chart.
* @property {sheets(v4).PieChartSpec} pieChart A pie chart specification.
*/
/**
 * @typedef SourceAndDestination
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).GridRange} source The location of the data to use as the source of the autofill.
* @property {integer} fillLength The number of rows or columns that data should be filled into.
Positive numbers expand beyond the last row or last column
of the source.  Negative numbers expand before the first row
or first column of the source.
* @property {string} dimension The dimension that data should be filled into.
*/
/**
 * @typedef ConditionValue
 * @memberOf! sheets(v4)
 * @type object
* @property {string} relativeDate A relative date (based on the current date).
Valid only if the type is
DATE_BEFORE,
DATE_AFTER,
DATE_ON_OR_BEFORE or
DATE_ON_OR_AFTER.

Relative dates are not supported in data validation.
They are supported only in conditional formatting and
conditional filters.
* @property {string} userEnteredValue A value the condition is based on.
The value will be parsed as if the user typed into a cell.
Formulas are supported (and must begin with an `=`).
*/
/**
 * @typedef PasteDataRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} data The data to insert.
 * @property {sheets(v4).GridCoordinate} coordinate The coordinate at which the data should start being inserted.
 * @property {string} delimiter The delimiter in the data.
 * @property {string} type How the data should be pasted.
 * @property {boolean} html True if the data is HTML.
 */
/**
 * @typedef FindReplaceRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} find The value to search.
* @property {string} replacement The value to use as the replacement.
* @property {boolean} searchByRegex True if the find value is a regex.
The regular expression and replacement should follow Java regex rules
at https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html.
The replacement string is allowed to refer to capturing groups.
For example, if one cell has the contents `&quot;Google Sheets&quot;` and another
has `&quot;Google Docs&quot;`, then searching for `&quot;o.* (.*)&quot;` with a replacement of
`&quot;$1 Rocks&quot;` would change the contents of the cells to
`&quot;GSheets Rocks&quot;` and `&quot;GDocs Rocks&quot;` respectively.
* @property {integer} sheetId The sheet to find/replace over.
* @property {boolean} allSheets True to find/replace over all sheets.
* @property {boolean} matchCase True if the search is case sensitive.
* @property {boolean} includeFormulas True if the search should include cells with formulas.
False to skip cells with formulas.
* @property {sheets(v4).GridRange} range The range to find/replace over.
* @property {boolean} matchEntireCell True if the find value should match the entire cell.
*/
/**
 * @typedef SortSpec
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} sortOrder The order data should be sorted.
 * @property {integer} dimensionIndex The dimension the sort should be applied to.
 */
/**
 * @typedef CopySheetToAnotherSpreadsheetRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} destinationSpreadsheetId The ID of the spreadsheet to copy the sheet to.
 */
/**
 * @typedef NumberFormat
 * @memberOf! sheets(v4)
 * @type object
* @property {string} pattern Pattern string used for formatting.  If not set, a default pattern based on
the user&#39;s locale will be used if necessary for the given type.
See the [Date and Number Formats guide](/sheets/guides/formats) for more
information about the supported patterns.
* @property {string} type The type of the number format.
When writing, this field must be set.
*/
/**
 * @typedef BatchClearValuesRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {string[]} ranges The ranges to clear, in A1 notation.
 */
/**
 * @typedef UpdateDimensionPropertiesRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `properties` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).DimensionRange} range The rows or columns to update.
* @property {sheets(v4).DimensionProperties} properties Properties to update.
*/
/**
 * @typedef Editors
 * @memberOf! sheets(v4)
 * @type object
* @property {string[]} users The email addresses of users with edit access to the protected range.
* @property {string[]} groups The email addresses of groups with edit access to the protected range.
* @property {boolean} domainUsersCanEdit True if anyone in the document&#39;s domain has edit access to the protected
range.  Domain protection is only supported on documents within a domain.
*/
/**
 * @typedef Spreadsheet
 * @memberOf! sheets(v4)
 * @type object
* @property {string} spreadsheetId The ID of the spreadsheet.
This field is read-only.
* @property {sheets(v4).SpreadsheetProperties} properties Overall properties of a spreadsheet.
* @property {string} spreadsheetUrl The url of the spreadsheet.
This field is read-only.
* @property {sheets(v4).Sheet[]} sheets The sheets that are part of a spreadsheet.
* @property {sheets(v4).NamedRange[]} namedRanges The named ranges defined in a spreadsheet.
*/
/**
 * @typedef GridData
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).DimensionProperties[]} columnMetadata Metadata about the requested columns in the grid, starting with the column
in start_column.
* @property {sheets(v4).RowData[]} rowData The data in the grid, one entry per row,
starting with the row in startRow.
The values in RowData will correspond to columns starting
at start_column.
* @property {integer} startRow The first row this GridData refers to, zero-based.
* @property {sheets(v4).DimensionProperties[]} rowMetadata Metadata about the requested rows in the grid, starting with the row
in start_row.
* @property {integer} startColumn The first column this GridData refers to, zero-based.
*/
/**
 * @typedef PivotValue
 * @memberOf! sheets(v4)
 * @type object
* @property {string} formula A custom formula to calculate the value.  The formula must start
with an `=` character.
* @property {integer} sourceColumnOffset The column offset of the source range that this value reads from.

For example, if the source was `C10:E15`, a `sourceColumnOffset` of `0`
means this value refers to column `C`, whereas the offset `1` would
refer to column `D`.
* @property {string} summarizeFunction A function to summarize the value.
If formula is set, the only supported values are
SUM and
CUSTOM.
If sourceColumnOffset is set, then `CUSTOM`
is not supported.
* @property {string} name A name to use for the value. This is only used if formula was set.
Otherwise, the column name is used.
*/
/**
 * @typedef DeleteBandingRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} bandedRangeId The ID of the banded range to delete.
 */
/**
 * @typedef BasicFilter
 * @memberOf! sheets(v4)
 * @type object
* @property {object} criteria The criteria for showing/hiding values per column.
The map&#39;s key is the column index, and the value is the criteria for
that column.
* @property {sheets(v4).GridRange} range The range the filter covers.
* @property {sheets(v4).SortSpec[]} sortSpecs The sort order per column. Later specifications are used when values
are equal in the earlier specifications.
*/
/**
 * @typedef DuplicateSheetRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} sourceSheetId The sheet to duplicate.
* @property {integer} newSheetId If set, the ID of the new sheet. If not set, an ID is chosen.
If set, the ID must not conflict with any existing sheet ID.
If set, it must be non-negative.
* @property {integer} insertSheetIndex The zero-based index where the new sheet should be inserted.
The index of all sheets after this are incremented.
* @property {string} newSheetName The name of the new sheet.  If empty, a new name is chosen for you.
*/
/**
 * @typedef AddFilterViewResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).FilterView} filter The newly added filter view.
 */
/**
 * @typedef DuplicateSheetResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).SheetProperties} properties The properties of the duplicate sheet.
 */
/**
 * @typedef Border
 * @memberOf! sheets(v4)
 * @type object
* @property {string} style The style of the border.
* @property {integer} width The width of the border, in pixels.
Deprecated; the width is determined by the &quot;style&quot; field.
* @property {sheets(v4).Color} color The color of the border.
*/
/**
 * @typedef AddNamedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).NamedRange} namedRange The named range to add. The namedRangeId
field is optional; if one is not set, an id will be randomly generated. (It
is an error to specify the ID of a range that already exists.)
*/
/**
 * @typedef AddChartResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).EmbeddedChart} chart The newly added chart.
 */
/**
 * @typedef AddBandingRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).BandedRange} bandedRange The banded range to add. The bandedRangeId
field is optional; if one is not set, an id will be randomly generated. (It
is an error to specify the ID of a range that already exists.)
*/
/**
 * @typedef AppendCellsRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} sheetId The sheet ID to append the data to.
* @property {sheets(v4).RowData[]} rows The data to append.
* @property {string} fields The fields of CellData that should be updated.
At least one field must be specified.
The root is the CellData; &#39;row.values.&#39; should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
*/
/**
 * @typedef RowData
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).CellData[]} values The values in the row, one per column.
 */
/**
 * @typedef BasicChartSeries
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ChartData} series The data being visualized in this chart series.
* @property {string} targetAxis The minor axis that will specify the range of values for this series.
For example, if charting stocks over time, the &quot;Volume&quot; series
may want to be pinned to the right with the prices pinned to the left,
because the scale of trading volume is different than the scale of
prices.
It is an error to specify an axis that isn&#39;t a valid minor axis
for the chart&#39;s type.
* @property {string} type The type of this series. Valid only if the
chartType is
COMBO.
Different types will change the way the series is visualized.
Only LINE, AREA,
and COLUMN are supported.
*/
/**
 * @typedef RepeatCellRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).CellData} cell The data to write.
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `cell` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).GridRange} range The range to repeat the cell in.
*/
/**
 * @typedef BasicChartSpec
 * @memberOf! sheets(v4)
 * @type object
* @property {string} chartType The type of the chart.
* @property {sheets(v4).BasicChartDomain[]} domains The domain of data this is charting.
Only a single domain is currently supported.
* @property {integer} headerCount The number of rows or columns in the data that are &quot;headers&quot;.
If not set, Google Sheets will guess how many rows are headers based
on the data.

(Note that BasicChartAxis.title may override the axis title
 inferred from the header values.)
* @property {sheets(v4).BasicChartSeries[]} series The data this chart is visualizing.
* @property {string} legendPosition The position of the chart legend.
* @property {sheets(v4).BasicChartAxis[]} axis The axis on the chart.
*/
/**
 * @typedef NamedRange
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} namedRangeId The ID of the named range.
 * @property {sheets(v4).GridRange} range The range this represents.
 * @property {string} name The name of the named range.
 */
/**
 * @typedef UpdateEmbeddedObjectPositionRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).EmbeddedObjectPosition} newPosition An explicit position to move the embedded object to.
If newPosition.sheetId is set,
a new sheet with that ID will be created.
If newPosition.newSheet is set to true,
a new sheet will be created with an ID that will be chosen for you.
* @property {integer} objectId The ID of the object to moved.
* @property {string} fields The fields of OverlayPosition
that should be updated when setting a new position. Used only if
newPosition.overlayPosition
is set, in which case at least one field must
be specified.  The root `newPosition.overlayPosition` is implied and
should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
*/
/**
 * @typedef SetBasicFilterRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).BasicFilter} filter The filter to set.
 */
/**
 * @typedef AutoResizeDimensionsRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).DimensionRange} dimensions The dimensions to automatically resize.
Only COLUMNS are supported.
*/
/**
 * @typedef DuplicateFilterViewResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).FilterView} filter The newly created filter.
 */
/**
 * @typedef BandingProperties
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).Color} footerColor The color of the last row or column. If this field is not set, the last
row or column will be filled with either first_band_color or
second_band_color, depending on the color of the previous row or
column.
* @property {sheets(v4).Color} headerColor The color of the first row or column. If this field is set, the first
row or column will be filled with this color and the colors will
alternate between first_band_color and second_band_color starting
from the second row or column. Otherwise, the first row or column will be
filled with first_band_color and the colors will proceed to alternate
as they normally would.
* @property {sheets(v4).Color} secondBandColor The second color that is alternating. (Required)
* @property {sheets(v4).Color} firstBandColor The first color that is alternating. (Required)
*/
/**
 * @typedef PivotGroup
 * @memberOf! sheets(v4)
 * @type object
* @property {string} sortOrder The order the values in this group should be sorted.
* @property {integer} sourceColumnOffset The column offset of the source range that this grouping is based on.

For example, if the source was `C10:E15`, a `sourceColumnOffset` of `0`
means this group refers to column `C`, whereas the offset `1` would refer
to column `D`.
* @property {boolean} showTotals True if the pivot table should include the totals for this grouping.
* @property {sheets(v4).PivotGroupSortValueBucket} valueBucket The bucket of the opposite pivot group to sort by.
If not specified, sorting is alphabetical by this group&#39;s values.
* @property {sheets(v4).PivotGroupValueMetadata[]} valueMetadata Metadata about values in the grouping.
*/
/**
 * @typedef GridRange
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet this range is on.
 * @property {integer} startColumnIndex The start column (inclusive) of the range, or not set if unbounded.
 * @property {integer} startRowIndex The start row (inclusive) of the range, or not set if unbounded.
 * @property {integer} endRowIndex The end row (exclusive) of the range, or not set if unbounded.
 * @property {integer} endColumnIndex The end column (exclusive) of the range, or not set if unbounded.
 */
/**
 * @typedef DeleteSheetRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The ID of the sheet to delete.
 */
/**
 * @typedef UpdateBandingRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).BandedRange} bandedRange The banded range to update with the new properties.
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `bandedRange` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
*/
/**
 * @typedef ChartData
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).ChartSourceRange} sourceRange The source ranges of the data.
 */
/**
 * @typedef Sheet
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).SheetProperties} properties The properties of the sheet.
* @property {sheets(v4).EmbeddedChart[]} charts The specifications of every chart on this sheet.
* @property {sheets(v4).FilterView[]} filterViews The filter views in this sheet.
* @property {sheets(v4).ConditionalFormatRule[]} conditionalFormats The conditional format rules in this sheet.
* @property {sheets(v4).ProtectedRange[]} protectedRanges The protected ranges in this sheet.
* @property {sheets(v4).BasicFilter} basicFilter The filter on this sheet, if any.
* @property {sheets(v4).GridRange[]} merges The ranges that are merged together.
* @property {sheets(v4).GridData[]} data Data in the grid, if this is a grid sheet.
The number of GridData objects returned is dependent on the number of
ranges requested on this sheet. For example, if this is representing
`Sheet1`, and the spreadsheet was requested with ranges
`Sheet1!A1:C10` and `Sheet1!D15:E20`, then the first GridData will have a
startRow/startColumn of `0`,
while the second one will have `startRow 14` (zero-based row 15),
and `startColumn 3` (zero-based column D).
* @property {sheets(v4).BandedRange[]} bandedRanges The banded (i.e. alternating colors) ranges on this sheet.
*/
/**
 * @typedef CopyPasteRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} pasteType What kind of data to paste.
* @property {string} pasteOrientation How that data should be oriented when pasting.
* @property {sheets(v4).GridRange} source The source range to copy.
* @property {sheets(v4).GridRange} destination The location to paste to. If the range covers a span that&#39;s
a multiple of the source&#39;s height or width, then the
data will be repeated to fill in the destination range.
If the range is smaller than the source range, the entire
source data will still be copied (beyond the end of the destination range).
*/
/**
 * @typedef UpdateCellsRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).RowData[]} rows The data to write.
* @property {string} fields The fields of CellData that should be updated.
At least one field must be specified.
The root is the CellData; &#39;row.values.&#39; should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).GridCoordinate} start The coordinate to start writing data at.
Any number of rows and columns (including a different number of
columns per row) may be written.
* @property {sheets(v4).GridRange} range The range to write data to.

If the data in rows does not cover the entire requested range,
the fields matching those set in fields will be cleared.
*/
/**
 * @typedef ExtendedValue
 * @memberOf! sheets(v4)
 * @type object
* @property {string} formulaValue Represents a formula.
* @property {sheets(v4).ErrorValue} errorValue Represents an error.
This field is read-only.
* @property {boolean} boolValue Represents a boolean value.
* @property {number} numberValue Represents a double value.
Note: Dates, Times and DateTimes are represented as doubles in
&quot;serial number&quot; format.
* @property {string} stringValue Represents a string value.
Leading single quotes are not included. For example, if the user typed
`&#39;123` into the UI, this would be represented as a `stringValue` of
`&quot;123&quot;`.
*/
/**
 * @typedef BatchUpdateSpreadsheetResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {string} spreadsheetId The spreadsheet the updates were applied to.
* @property {sheets(v4).Spreadsheet} updatedSpreadsheet The spreadsheet after updates were applied. This is only set if
[BatchUpdateSpreadsheetRequest.include_spreadsheet_in_response] is `true`.
* @property {sheets(v4).Response[]} replies The reply of the updates.  This maps 1:1 with the updates, although
replies to some requests may be empty.
*/
/**
 * @typedef GradientRule
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).InterpolationPoint} maxpoint The final interpolation point.
 * @property {sheets(v4).InterpolationPoint} midpoint An optional midway interpolation point.
 * @property {sheets(v4).InterpolationPoint} minpoint The starting interpolation point.
 */
/**
 * @typedef CutPasteRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} pasteType What kind of data to paste.  All the source data will be cut, regardless
of what is pasted.
* @property {sheets(v4).GridRange} source The source data to cut.
* @property {sheets(v4).GridCoordinate} destination The top-left coordinate where the data should be pasted.
*/
/**
 * @typedef OverlayPosition
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} widthPixels The width of the object, in pixels. Defaults to 600.
* @property {sheets(v4).GridCoordinate} anchorCell The cell the object is anchored to.
* @property {integer} offsetXPixels The horizontal offset, in pixels, that the object is offset
from the anchor cell.
* @property {integer} heightPixels The height of the object, in pixels. Defaults to 371.
* @property {integer} offsetYPixels The vertical offset, in pixels, that the object is offset
from the anchor cell.
*/
/**
 * @typedef AutoFillRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {boolean} useAlternateSeries True if we should generate data with the &quot;alternate&quot; series.
This differs based on the type and amount of source data.
* @property {sheets(v4).GridRange} range The range to autofill. This will examine the range and detect
the location that has data and automatically fill that data
in to the rest of the range.
* @property {sheets(v4).SourceAndDestination} sourceAndDestination The source and destination areas to autofill.
This explicitly lists the source of the autofill and where to
extend that data.
*/
/**
 * @typedef PieChartSpec
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} legendPosition Where the legend of the pie chart should be drawn.
 * @property {sheets(v4).ChartData} series The data that covers the one and only series of the pie chart.
 * @property {number} pieHole The size of the hole in the pie chart.
 * @property {boolean} threeDimensional True if the pie is three dimensional.
 * @property {sheets(v4).ChartData} domain The data that covers the domain of the pie chart.
 */
/**
 * @typedef UpdateSheetPropertiesRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {string} fields The fields that should be updated.  At least one field must be specified.
The root `properties` is implied and should not be specified.
A single `&quot;*&quot;` can be used as short-hand for listing every field.
* @property {sheets(v4).SheetProperties} properties The properties to update.
*/
/**
 * @typedef BooleanRule
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).BooleanCondition} condition The condition of the rule. If the condition evaluates to true,
the format will be applied.
* @property {sheets(v4).CellFormat} format The format to apply.
Conditional formatting can only apply a subset of formatting:
bold, italic,
strikethrough,
foreground color &amp;
background color.
*/
/**
 * @typedef AppendDimensionRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} sheetId The sheet to append rows or columns to.
 * @property {integer} length The number of rows or columns to append.
 * @property {string} dimension Whether rows or columns should be appended.
 */
/**
 * @typedef AddFilterViewRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).FilterView} filter The filter to add. The filterViewId
field is optional; if one is not set, an id will be randomly generated. (It
is an error to specify the ID of a filter that already exists.)
*/
/**
 * @typedef GridProperties
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} rowCount The number of rows in the grid.
 * @property {integer} columnCount The number of columns in the grid.
 * @property {integer} frozenRowCount The number of rows that are frozen in the grid.
 * @property {integer} frozenColumnCount The number of columns that are frozen in the grid.
 * @property {boolean} hideGridlines True if the grid isn&#39;t showing gridlines in the UI.
 */
/**
 * @typedef DeleteNamedRangeRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {string} namedRangeId The ID of the named range to delete.
 */
/**
 * @typedef AddChartRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).EmbeddedChart} chart The chart that should be added to the spreadsheet, including the position
where it should be placed. The chartId
field is optional; if one is not set, an id will be randomly generated. (It
is an error to specify the ID of a chart that already exists.)
*/
/**
 * @typedef SetDataValidationRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).DataValidationRule} rule The data validation rule to set on each cell in the range,
or empty to clear the data validation in the range.
* @property {sheets(v4).GridRange} range The range the data validation rule should apply to.
*/
/**
 * @typedef Request
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).UpdateEmbeddedObjectPositionRequest} updateEmbeddedObjectPosition Updates an embedded object&#39;s (e.g. chart, image) position.
* @property {sheets(v4).DeleteNamedRangeRequest} deleteNamedRange Deletes a named range.
* @property {sheets(v4).UpdateNamedRangeRequest} updateNamedRange Updates a named range.
* @property {sheets(v4).AddFilterViewRequest} addFilterView Adds a filter view.
* @property {sheets(v4).UpdateSpreadsheetPropertiesRequest} updateSpreadsheetProperties Updates the spreadsheet&#39;s properties.
* @property {sheets(v4).AppendDimensionRequest} appendDimension Appends dimensions to the end of a sheet.
* @property {sheets(v4).UnmergeCellsRequest} unmergeCells Unmerges merged cells.
* @property {sheets(v4).UpdateProtectedRangeRequest} updateProtectedRange Updates a protected range.
* @property {sheets(v4).DeleteFilterViewRequest} deleteFilterView Deletes a filter view from a sheet.
* @property {sheets(v4).ClearBasicFilterRequest} clearBasicFilter Clears the basic filter on a sheet.
* @property {sheets(v4).SortRangeRequest} sortRange Sorts data in a range.
* @property {sheets(v4).RepeatCellRequest} repeatCell Repeats a single cell across a range.
* @property {sheets(v4).SetDataValidationRequest} setDataValidation Sets data validation for one or more cells.
* @property {sheets(v4).UpdateCellsRequest} updateCells Updates many cells at once.
* @property {sheets(v4).AddSheetRequest} addSheet Adds a sheet.
* @property {sheets(v4).UpdateFilterViewRequest} updateFilterView Updates the properties of a filter view.
* @property {sheets(v4).UpdateSheetPropertiesRequest} updateSheetProperties Updates a sheet&#39;s properties.
* @property {sheets(v4).UpdateDimensionPropertiesRequest} updateDimensionProperties Updates dimensions&#39; properties.
* @property {sheets(v4).DeleteSheetRequest} deleteSheet Deletes a sheet.
* @property {sheets(v4).FindReplaceRequest} findReplace Finds and replaces occurrences of some text with other text.
* @property {sheets(v4).AddProtectedRangeRequest} addProtectedRange Adds a protected range.
* @property {sheets(v4).DeleteProtectedRangeRequest} deleteProtectedRange Deletes a protected range.
* @property {sheets(v4).UpdateConditionalFormatRuleRequest} updateConditionalFormatRule Updates an existing conditional format rule.
* @property {sheets(v4).SetBasicFilterRequest} setBasicFilter Sets the basic filter on a sheet.
* @property {sheets(v4).MergeCellsRequest} mergeCells Merges cells together.
* @property {sheets(v4).UpdateBandingRequest} updateBanding Updates a banded range
* @property {sheets(v4).AddChartRequest} addChart Adds a chart.
* @property {sheets(v4).DeleteConditionalFormatRuleRequest} deleteConditionalFormatRule Deletes an existing conditional format rule.
* @property {sheets(v4).AddBandingRequest} addBanding Adds a new banded range
* @property {sheets(v4).DeleteBandingRequest} deleteBanding Removes a banded range
* @property {sheets(v4).UpdateChartSpecRequest} updateChartSpec Updates a chart&#39;s specifications.
* @property {sheets(v4).DeleteDimensionRequest} deleteDimension Deletes rows or columns in a sheet.
* @property {sheets(v4).DeleteEmbeddedObjectRequest} deleteEmbeddedObject Deletes an embedded object (e.g, chart, image) in a sheet.
* @property {sheets(v4).PasteDataRequest} pasteData Pastes data (HTML or delimited) into a sheet.
* @property {sheets(v4).AddConditionalFormatRuleRequest} addConditionalFormatRule Adds a new conditional format rule.
* @property {sheets(v4).UpdateBordersRequest} updateBorders Updates the borders in a range of cells.
* @property {sheets(v4).AutoResizeDimensionsRequest} autoResizeDimensions Automatically resizes one or more dimensions based on the contents
of the cells in that dimension.
* @property {sheets(v4).DuplicateSheetRequest} duplicateSheet Duplicates a sheet.
* @property {sheets(v4).DuplicateFilterViewRequest} duplicateFilterView Duplicates a filter view.
* @property {sheets(v4).CutPasteRequest} cutPaste Cuts data from one area and pastes it to another.
* @property {sheets(v4).AppendCellsRequest} appendCells Appends cells after the last row with data in a sheet.
* @property {sheets(v4).AddNamedRangeRequest} addNamedRange Adds a named range.
* @property {sheets(v4).AutoFillRequest} autoFill Automatically fills in more data based on existing data.
* @property {sheets(v4).MoveDimensionRequest} moveDimension Moves rows or columns to another location in a sheet.
* @property {sheets(v4).TextToColumnsRequest} textToColumns Converts a column of text into many columns of text.
* @property {sheets(v4).InsertDimensionRequest} insertDimension Inserts new rows or columns in a sheet.
* @property {sheets(v4).CopyPasteRequest} copyPaste Copies data from one area and pastes it to another.
*/
/**
 * @typedef BatchGetValuesResponse
 * @memberOf! sheets(v4)
 * @type object
* @property {sheets(v4).ValueRange[]} valueRanges The requested values. The order of the ValueRanges is the same as the
order of the requested ranges.
* @property {string} spreadsheetId The ID of the spreadsheet the data was retrieved from.
*/
/**
 * @typedef InsertDimensionRequest
 * @memberOf! sheets(v4)
 * @type object
* @property {boolean} inheritFromBefore Whether dimension properties should be extended from the dimensions
before or after the newly inserted dimensions.
True to inherit from the dimensions before (in which case the start
index must be greater than 0), and false to inherit from the dimensions
after.

For example, if row index 0 has red background and row index 1
has a green background, then inserting 2 rows at index 1 can inherit
either the green or red background.  If `inheritFromBefore` is true,
the two new rows will be red (because the row before the insertion point
was red), whereas if `inheritFromBefore` is false, the two new rows will
be green (because the row after the insertion point was green).
* @property {sheets(v4).DimensionRange} range The dimensions to insert.  Both the start and end indexes must be bounded.
*/
/**
 * @typedef DeleteEmbeddedObjectRequest
 * @memberOf! sheets(v4)
 * @type object
 * @property {integer} objectId The ID of the embedded object to delete.
 */
/**
 * @typedef BandedRange
 * @memberOf! sheets(v4)
 * @type object
* @property {integer} bandedRangeId The id of the banded range.
* @property {sheets(v4).BandingProperties} rowProperties Properties for row bands. These properties will be applied on a row-by-row
basis throughout all the rows in the range. At least one of
row_properties or column_properties must be specified.
* @property {sheets(v4).BandingProperties} columnProperties Properties for column bands. These properties will be applied on a column-
by-column basis throughout all the columns in the range. At least one of
row_properties or column_properties must be specified.
* @property {sheets(v4).GridRange} range The range over which these properties are applied.
*/
/**
 * @typedef DeleteConditionalFormatRuleResponse
 * @memberOf! sheets(v4)
 * @type object
 * @property {sheets(v4).ConditionalFormatRule} rule The rule that was deleted.
 */
module.exports = Sheets;
