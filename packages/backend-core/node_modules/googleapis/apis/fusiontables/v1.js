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
 * Fusion Tables API
 *
 * API for working with Fusion Tables data.
 *
 * @example
 * var google = require('googleapis');
 * var fusiontables = google.fusiontables('v1');
 *
 * @namespace fusiontables
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Fusiontables
 */
function Fusiontables(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.column = {

    /**
     * fusiontables.column.delete
     *
     * @desc Deletes the column.
     *
     * @alias fusiontables.column.delete
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.columnId Name or identifier for the column being deleted.
     * @param {string} params.tableId Table from which the column is being deleted.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns/{columnId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tableId', 'columnId'],
        pathParams: ['columnId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.column.get
     *
     * @desc Retrieves a specific column by its id.
     *
     * @alias fusiontables.column.get
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.columnId Name or identifier for the column that is being requested.
     * @param {string} params.tableId Table to which the column belongs.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns/{columnId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId', 'columnId'],
        pathParams: ['columnId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.column.insert
     *
     * @desc Adds a new column to the table.
     *
     * @alias fusiontables.column.insert
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table for which a new column is being added.
     * @param {fusiontables(v1).Column} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.column.list
     *
     * @desc Retrieves a list of columns.
     *
     * @alias fusiontables.column.list
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of columns to return. Optional. Default is 5.
     * @param {string=} params.pageToken Continuation token specifying which result page to return. Optional.
     * @param {string} params.tableId Table whose columns are being listed.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.column.patch
     *
     * @desc Updates the name or type of an existing column. This method supports patch semantics.
     *
     * @alias fusiontables.column.patch
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.columnId Name or identifier for the column that is being updated.
     * @param {string} params.tableId Table for which the column is being updated.
     * @param {fusiontables(v1).Column} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns/{columnId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tableId', 'columnId'],
        pathParams: ['columnId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.column.update
     *
     * @desc Updates the name or type of an existing column.
     *
     * @alias fusiontables.column.update
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.columnId Name or identifier for the column that is being updated.
     * @param {string} params.tableId Table for which the column is being updated.
     * @param {fusiontables(v1).Column} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/columns/{columnId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tableId', 'columnId'],
        pathParams: ['columnId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.query = {

    /**
     * fusiontables.query.sql
     *
     * @desc Executes an SQL SELECT/INSERT/UPDATE/DELETE/SHOW/DESCRIBE/CREATE statement.
     *
     * @alias fusiontables.query.sql
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.hdrs Should column names be included (in the first row)?. Default is true.
     * @param {string} params.sql An SQL SELECT/SHOW/DESCRIBE/INSERT/UPDATE/DELETE/CREATE statement.
     * @param {boolean=} params.typed Should typed values be returned in the (JSON) response -- numbers for numeric values and parsed geometries for KML values? Default is true.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    sql: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/fusiontables/v1/query',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['sql'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.query.sqlGet
     *
     * @desc Executes an SQL SELECT/SHOW/DESCRIBE statement.
     *
     * @alias fusiontables.query.sqlGet
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.hdrs Should column names be included (in the first row)?. Default is true.
     * @param {string} params.sql An SQL SELECT/SHOW/DESCRIBE statement.
     * @param {boolean=} params.typed Should typed values be returned in the (JSON) response -- numbers for numeric values and parsed geometries for KML values? Default is true.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    sqlGet: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/fusiontables/v1/query',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['sql'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.style = {

    /**
     * fusiontables.style.delete
     *
     * @desc Deletes a style.
     *
     * @alias fusiontables.style.delete
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.styleId Identifier (within a table) for the style being deleted
     * @param {string} params.tableId Table from which the style is being deleted
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles/{styleId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tableId', 'styleId'],
        pathParams: ['styleId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.style.get
     *
     * @desc Gets a specific style.
     *
     * @alias fusiontables.style.get
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.styleId Identifier (integer) for a specific style in a table
     * @param {string} params.tableId Table to which the requested style belongs
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles/{styleId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId', 'styleId'],
        pathParams: ['styleId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.style.insert
     *
     * @desc Adds a new style for the table.
     *
     * @alias fusiontables.style.insert
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table for which a new style is being added
     * @param {fusiontables(v1).StyleSetting} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.style.list
     *
     * @desc Retrieves a list of styles.
     *
     * @alias fusiontables.style.list
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of styles to return. Optional. Default is 5.
     * @param {string=} params.pageToken Continuation token specifying which result page to return. Optional.
     * @param {string} params.tableId Table whose styles are being listed
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.style.patch
     *
     * @desc Updates an existing style. This method supports patch semantics.
     *
     * @alias fusiontables.style.patch
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.styleId Identifier (within a table) for the style being updated.
     * @param {string} params.tableId Table whose style is being updated.
     * @param {fusiontables(v1).StyleSetting} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles/{styleId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tableId', 'styleId'],
        pathParams: ['styleId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.style.update
     *
     * @desc Updates an existing style.
     *
     * @alias fusiontables.style.update
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.styleId Identifier (within a table) for the style being updated.
     * @param {string} params.tableId Table whose style is being updated.
     * @param {fusiontables(v1).StyleSetting} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/styles/{styleId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tableId', 'styleId'],
        pathParams: ['styleId', 'tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.table = {

    /**
     * fusiontables.table.copy
     *
     * @desc Copies a table.
     *
     * @alias fusiontables.table.copy
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.copyPresentation Whether to also copy tabs, styles, and templates. Default is false.
     * @param {string} params.tableId ID of the table that is being copied.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    copy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/copy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.delete
     *
     * @desc Deletes a table.
     *
     * @alias fusiontables.table.delete
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId ID of the table that is being deleted.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.get
     *
     * @desc Retrieves a specific table by its id.
     *
     * @alias fusiontables.table.get
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Identifier(ID) for the table being requested.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.importRows
     *
     * @desc Import more rows into a table.
     *
     * @alias fusiontables.table.importRows
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.delimiter The delimiter used to separate cell values. This can only consist of a single character. Default is ','.
     * @param {string=} params.encoding The encoding of the content. Default is UTF-8. Use 'auto-detect' if you are unsure of the encoding.
     * @param {integer=} params.endLine The index of the last line from which to start importing, exclusive. Thus, the number of imported lines is endLine - startLine. If this parameter is not provided, the file will be imported until the last line of the file. If endLine is negative, then the imported content will exclude the last endLine lines. That is, if endline is negative, no line will be imported whose index is greater than N + endLine where N is the number of lines in the file, and the number of imported lines will be N + endLine - startLine.
     * @param {boolean=} params.isStrict Whether the CSV must have the same number of values for each row. If false, rows with fewer values will be padded with empty values. Default is true.
     * @param {integer=} params.startLine The index of the first line from which to start importing, inclusive. Default is 0.
     * @param {string} params.tableId The table into which new rows are being imported.
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    importRows: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/import',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/fusiontables/v1/tables/{tableId}/import',
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.importTable
     *
     * @desc Import a new table.
     *
     * @alias fusiontables.table.importTable
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.delimiter The delimiter used to separate cell values. This can only consist of a single character. Default is ','.
     * @param {string=} params.encoding The encoding of the content. Default is UTF-8. Use 'auto-detect' if you are unsure of the encoding.
     * @param {string} params.name The name to be assigned to the new table.
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    importTable: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/fusiontables/v1/tables/import',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/fusiontables/v1/tables/import',
        requiredParams: ['name'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.insert
     *
     * @desc Creates a new table.
     *
     * @alias fusiontables.table.insert
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {fusiontables(v1).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables',
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
     * fusiontables.table.list
     *
     * @desc Retrieves a list of tables a user owns.
     *
     * @alias fusiontables.table.list
     * @memberOf! fusiontables(v1)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of styles to return. Optional. Default is 5.
     * @param {string=} params.pageToken Continuation token specifying which result page to return. Optional.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables',
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
     * fusiontables.table.patch
     *
     * @desc Updates an existing table. Unless explicitly requested, only the name, description, and attribution will be updated. This method supports patch semantics.
     *
     * @alias fusiontables.table.patch
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.replaceViewDefinition Should the view definition also be updated? The specified view definition replaces the existing one. Only a view can be updated with a new definition.
     * @param {string} params.tableId ID of the table that is being updated.
     * @param {fusiontables(v1).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.table.update
     *
     * @desc Updates an existing table. Unless explicitly requested, only the name, description, and attribution will be updated.
     *
     * @alias fusiontables.table.update
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.replaceViewDefinition Should the view definition also be updated? The specified view definition replaces the existing one. Only a view can be updated with a new definition.
     * @param {string} params.tableId ID of the table that is being updated.
     * @param {fusiontables(v1).Table} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.task = {

    /**
     * fusiontables.task.delete
     *
     * @desc Deletes the task, unless already started.
     *
     * @alias fusiontables.task.delete
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table from which the task is being deleted.
     * @param {string} params.taskId 
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/tasks/{taskId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tableId', 'taskId'],
        pathParams: ['tableId', 'taskId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.task.get
     *
     * @desc Retrieves a specific task by its id.
     *
     * @alias fusiontables.task.get
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table to which the task belongs.
     * @param {string} params.taskId 
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/tasks/{taskId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId', 'taskId'],
        pathParams: ['tableId', 'taskId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.task.list
     *
     * @desc Retrieves a list of tasks.
     *
     * @alias fusiontables.task.list
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of columns to return. Optional. Default is 5.
     * @param {string=} params.pageToken 
     * @param {integer=} params.startIndex 
     * @param {string} params.tableId Table whose tasks are being listed.
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/tasks',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.template = {

    /**
     * fusiontables.template.delete
     *
     * @desc Deletes a template
     *
     * @alias fusiontables.template.delete
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table from which the template is being deleted
     * @param {integer} params.templateId Identifier for the template which is being deleted
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates/{templateId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['tableId', 'templateId'],
        pathParams: ['tableId', 'templateId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.template.get
     *
     * @desc Retrieves a specific template by its id
     *
     * @alias fusiontables.template.get
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table to which the template belongs
     * @param {integer} params.templateId Identifier for the template that is being requested
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates/{templateId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId', 'templateId'],
        pathParams: ['tableId', 'templateId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.template.insert
     *
     * @desc Creates a new template for the table.
     *
     * @alias fusiontables.template.insert
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table for which a new template is being created
     * @param {fusiontables(v1).Template} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.template.list
     *
     * @desc Retrieves a list of templates.
     *
     * @alias fusiontables.template.list
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of templates to return. Optional. Default is 5.
     * @param {string=} params.pageToken Continuation token specifying which results page to return. Optional.
     * @param {string} params.tableId Identifier for the table whose templates are being requested
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['tableId'],
        pathParams: ['tableId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.template.patch
     *
     * @desc Updates an existing template. This method supports patch semantics.
     *
     * @alias fusiontables.template.patch
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table to which the updated template belongs
     * @param {integer} params.templateId Identifier for the template that is being updated
     * @param {fusiontables(v1).Template} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates/{templateId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['tableId', 'templateId'],
        pathParams: ['tableId', 'templateId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * fusiontables.template.update
     *
     * @desc Updates an existing template
     *
     * @alias fusiontables.template.update
     * @memberOf! fusiontables(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.tableId Table to which the updated template belongs
     * @param {integer} params.templateId Identifier for the template that is being updated
     * @param {fusiontables(v1).Template} params.resource Request body data
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
          url: 'https://www.googleapis.com/fusiontables/v1/tables/{tableId}/templates/{templateId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['tableId', 'templateId'],
        pathParams: ['tableId', 'templateId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Bucket
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} color Color of line or the interior of a polygon in #RRGGBB format.
 * @property {string} icon Icon name used for a point.
 * @property {number} max Maximum value in the selected column for a row to be styled according to the bucket color, opacity, icon, or weight.
 * @property {number} min Minimum value in the selected column for a row to be styled according to the bucket color, opacity, icon, or weight.
 * @property {number} opacity Opacity of the color: 0.0 (transparent) to 1.0 (opaque).
 * @property {integer} weight Width of a line (in pixels).
 */
/**
 * @typedef Column
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {object} baseColumn Optional identifier of the base column. If present, this column is derived from the specified base column.
 * @property {integer} columnId Identifier for the column.
 * @property {string} description Optional column description.
 * @property {string} graph_predicate Optional column predicate. Used to map table to graph data model (subject,predicate,object) See http://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#data-model
 * @property {string} kind Type name: a template for an individual column.
 * @property {string} name Required name of the column.
 * @property {string} type Required type of the column.
 */
/**
 * @typedef ColumnList
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).Column[]} items List of all requested columns.
 * @property {string} kind Type name: a list of all columns.
 * @property {string} nextPageToken Token used to access the next page of this result. No token is displayed if there are no more pages left.
 * @property {integer} totalItems Total number of columns for the table.
 */
/**
 * @typedef Geometry
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {any[]} geometries The list of geometries in this geometry collection.
 * @property {any} geometry 
 * @property {string} type Type: A collection of geometries.
 */
/**
 * @typedef Import
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} kind Type name: a template for an import request.
 * @property {string} numRowsReceived The number of rows received from the import request.
 */
/**
 * @typedef Line
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {array[]} coordinates The coordinates that define the line.
 * @property {string} type Type: A line geometry.
 */
/**
 * @typedef LineStyle
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} strokeColor Color of the line in #RRGGBB format.
 * @property {fusiontables(v1).StyleFunction} strokeColorStyler Column-value, gradient or buckets styler that is used to determine the line color and opacity.
 * @property {number} strokeOpacity Opacity of the line : 0.0 (transparent) to 1.0 (opaque).
 * @property {integer} strokeWeight Width of the line in pixels.
 * @property {fusiontables(v1).StyleFunction} strokeWeightStyler Column-value or bucket styler that is used to determine the width of the line.
 */
/**
 * @typedef Point
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {number[]} coordinates The coordinates that define the point.
 * @property {string} type Point: A point geometry.
 */
/**
 * @typedef PointStyle
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} iconName Name of the icon. Use values defined in http://www.google.com/fusiontables/DataSource?dsrcid=308519
 * @property {fusiontables(v1).StyleFunction} iconStyler Column or a bucket value from which the icon name is to be determined.
 */
/**
 * @typedef Polygon
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {array[]} coordinates The coordinates that define the polygon.
 * @property {string} type Type: A polygon geometry.
 */
/**
 * @typedef PolygonStyle
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} fillColor Color of the interior of the polygon in #RRGGBB format.
 * @property {fusiontables(v1).StyleFunction} fillColorStyler Column-value, gradient, or bucket styler that is used to determine the interior color and opacity of the polygon.
 * @property {number} fillOpacity Opacity of the interior of the polygon: 0.0 (transparent) to 1.0 (opaque).
 * @property {string} strokeColor Color of the polygon border in #RRGGBB format.
 * @property {fusiontables(v1).StyleFunction} strokeColorStyler Column-value, gradient or buckets styler that is used to determine the border color and opacity.
 * @property {number} strokeOpacity Opacity of the polygon border: 0.0 (transparent) to 1.0 (opaque).
 * @property {integer} strokeWeight Width of the polyon border in pixels.
 * @property {fusiontables(v1).StyleFunction} strokeWeightStyler Column-value or bucket styler that is used to determine the width of the polygon border.
 */
/**
 * @typedef Sqlresponse
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string[]} columns Columns in the table.
 * @property {string} kind Type name: a template for an individual table.
 * @property {array[]} rows The rows in the table. For each cell we print out whatever cell value (e.g., numeric, string) exists. Thus it is important that each cell contains only one value.
 */
/**
 * @typedef StyleFunction
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).Bucket[]} buckets Bucket function that assigns a style based on the range a column value falls into.
 * @property {string} columnName Name of the column whose value is used in the style.
 * @property {object} gradient Gradient function that interpolates a range of colors based on column value.
 * @property {string} kind Stylers can be one of three kinds: &quot;fusiontables#fromColumn&quot; if the column value is to be used as is, i.e., the column values can have colors in #RRGGBBAA format or integer line widths or icon names; &quot;fusiontables#gradient&quot; if the styling of the row is to be based on applying the gradient function on the column value; or &quot;fusiontables#buckets&quot; if the styling is to based on the bucket into which the the column value falls.
 */
/**
 * @typedef StyleSetting
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} kind Type name: an individual style setting. A StyleSetting contains the style defintions for points, lines, and polygons in a table. Since a table can have any one or all of them, a style definition can have point, line and polygon style definitions.
 * @property {fusiontables(v1).PointStyle} markerOptions Style definition for points in the table.
 * @property {string} name Optional name for the style setting.
 * @property {fusiontables(v1).PolygonStyle} polygonOptions Style definition for polygons in the table.
 * @property {fusiontables(v1).LineStyle} polylineOptions Style definition for lines in the table.
 * @property {integer} styleId Identifier for the style setting (unique only within tables).
 * @property {string} tableId Identifier for the table.
 */
/**
 * @typedef StyleSettingList
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).StyleSetting[]} items All requested style settings.
 * @property {string} kind Type name: in this case, a list of style settings.
 * @property {string} nextPageToken Token used to access the next page of this result. No token is displayed if there are no more pages left.
 * @property {integer} totalItems Total number of styles for the table.
 */
/**
 * @typedef Table
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} attribution Optional attribution assigned to the table.
 * @property {string} attributionLink Optional link for attribution.
 * @property {string[]} baseTableIds Optional base table identifier if this table is a view or merged table.
 * @property {fusiontables(v1).Column[]} columns Columns in the table.
 * @property {string} description Optional description assigned to the table.
 * @property {boolean} isExportable Variable for whether table is exportable.
 * @property {string} kind Type name: a template for an individual table.
 * @property {string} name Name assigned to a table.
 * @property {string} sql Optional sql that encodes the table definition for derived tables.
 * @property {string} tableId Encrypted unique alphanumeric identifier for the table.
 */
/**
 * @typedef TableList
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).Table[]} items List of all requested tables.
 * @property {string} kind Type name: a list of all tables.
 * @property {string} nextPageToken Token used to access the next page of this result. No token is displayed if there are no more pages left.
 */
/**
 * @typedef Task
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string} kind Type of the resource. This is always &quot;fusiontables#task&quot;.
 * @property {string} progress An indication of task progress.
 * @property {boolean} started false while the table is busy with some other task. true if this background task is currently running.
 * @property {string} taskId Identifier for the task.
 * @property {string} type Type of background task. One of  DELETE_ROWS Deletes one or more rows from the table. ADD_ROWS &quot;Adds one or more rows to a table. Includes importing data into a new table and importing more rows into an existing table. ADD_COLUMN Adds a new column to the table. CHANGE_TYPE Changes the type of a column.
 */
/**
 * @typedef TaskList
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).Task[]} items List of all requested tasks.
 * @property {string} kind Type of the resource. This is always &quot;fusiontables#taskList&quot;.
 * @property {string} nextPageToken Token used to access the next page of this result. No token is displayed if there are no more pages left.
 * @property {integer} totalItems Total number of tasks for the table.
 */
/**
 * @typedef Template
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {string[]} automaticColumnNames List of columns from which the template is to be automatically constructed. Only one of body or automaticColumns can be specified.
 * @property {string} body Body of the template. It contains HTML with {column_name} to insert values from a particular column. The body is sanitized to remove certain tags, e.g., script. Only one of body or automaticColumns can be specified.
 * @property {string} kind Type name: a template for the info window contents. The template can either include an HTML body or a list of columns from which the template is computed automatically.
 * @property {string} name Optional name assigned to a template.
 * @property {string} tableId Identifier for the table for which the template is defined.
 * @property {integer} templateId Identifier for the template, unique within the context of a particular table.
 */
/**
 * @typedef TemplateList
 * @memberOf! fusiontables(v1)
 * @type object
 * @property {fusiontables(v1).Template[]} items List of all requested templates.
 * @property {string} kind Type name: a list of all templates.
 * @property {string} nextPageToken Token used to access the next page of this result. No token is displayed if there are no more pages left.
 * @property {integer} totalItems Total number of templates for the table.
 */
module.exports = Fusiontables;
