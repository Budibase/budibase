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
 * DoubleClick Bid Manager API
 *
 * API for viewing and managing your reports in DoubleClick Bid Manager.
 *
 * @example
 * var google = require('googleapis');
 * var doubleclickbidmanager = google.doubleclickbidmanager('v1');
 *
 * @namespace doubleclickbidmanager
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Doubleclickbidmanager
 */
function Doubleclickbidmanager(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.lineitems = {

    /**
     * doubleclickbidmanager.lineitems.downloadlineitems
     *
     * @desc Retrieves line items in CSV format.
     *
     * @alias doubleclickbidmanager.lineitems.downloadlineitems
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {doubleclickbidmanager(v1).DownloadLineItemsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    downloadlineitems: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/lineitems/downloadlineitems',
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
     * doubleclickbidmanager.lineitems.uploadlineitems
     *
     * @desc Uploads line items in CSV format.
     *
     * @alias doubleclickbidmanager.lineitems.uploadlineitems
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {doubleclickbidmanager(v1).UploadLineItemsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    uploadlineitems: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/lineitems/uploadlineitems',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.queries = {

    /**
     * doubleclickbidmanager.queries.createquery
     *
     * @desc Creates a query.
     *
     * @alias doubleclickbidmanager.queries.createquery
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {doubleclickbidmanager(v1).Query} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createquery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/query',
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
     * doubleclickbidmanager.queries.deletequery
     *
     * @desc Deletes a stored query as well as the associated stored reports.
     *
     * @alias doubleclickbidmanager.queries.deletequery
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.queryId Query ID to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deletequery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/query/{queryId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['queryId'],
        pathParams: ['queryId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclickbidmanager.queries.getquery
     *
     * @desc Retrieves a stored query.
     *
     * @alias doubleclickbidmanager.queries.getquery
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.queryId Query ID to retrieve.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getquery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/query/{queryId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['queryId'],
        pathParams: ['queryId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclickbidmanager.queries.listqueries
     *
     * @desc Retrieves stored queries.
     *
     * @alias doubleclickbidmanager.queries.listqueries
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listqueries: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/queries',
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
     * doubleclickbidmanager.queries.runquery
     *
     * @desc Runs a stored query to generate a report.
     *
     * @alias doubleclickbidmanager.queries.runquery
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.queryId Query ID to run.
     * @param {doubleclickbidmanager(v1).RunQueryRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    runquery: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/query/{queryId}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['queryId'],
        pathParams: ['queryId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.reports = {

    /**
     * doubleclickbidmanager.reports.listreports
     *
     * @desc Retrieves stored reports.
     *
     * @alias doubleclickbidmanager.reports.listreports
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.queryId Query ID with which the reports are associated.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listreports: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/queries/{queryId}/reports',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['queryId'],
        pathParams: ['queryId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sdf = {

    /**
     * doubleclickbidmanager.sdf.download
     *
     * @desc Retrieves entities in SDF format.
     *
     * @alias doubleclickbidmanager.sdf.download
     * @memberOf! doubleclickbidmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {doubleclickbidmanager(v1).DownloadRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    download: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclickbidmanager/v1/sdf/download',
          method: 'POST'
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
 * @typedef DownloadLineItemsRequest
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} fileSpec File specification (column names, types, order) in which the line items will be returned. Default to EWF.
 * @property {string[]} filterIds Ids of the specified filter type used to filter line items to fetch. If omitted, all the line items will be returned.
 * @property {string} filterType Filter type used to filter line items to fetch.
 * @property {string} format Format in which the line items will be returned. Default to CSV.
 */
/**
 * @typedef DownloadLineItemsResponse
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} lineItems Retrieved line items in CSV format. Refer to  Entity Write File Format or  Structured Data File Format for more information on file formats.
 */
/**
 * @typedef DownloadRequest
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string[]} fileTypes File types that will be returned.
 * @property {string[]} filterIds The IDs of the specified filter type. This is used to filter entities to fetch. At least one ID must be specified. Only one ID is allowed for the ADVERTISER_ID filter type. For INSERTION_ORDER_ID or LINE_ITEM_ID filter types all IDs must be from the same Advertiser.
 * @property {string} filterType Filter type used to filter line items to fetch.
 * @property {string} version SDF Version (column names, types, order) in which the entities will be returned. Default to 3.
 */
/**
 * @typedef DownloadResponse
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} adGroups Retrieved ad groups in SDF format.
 * @property {string} ads Retrieved ads in SDF format.
 * @property {string} insertionOrders Retrieved insertion orders in SDF format.
 * @property {string} lineItems Retrieved line items in SDF format.
 */
/**
 * @typedef FilterPair
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} type Filter type.
 * @property {string} value Filter value.
 */
/**
 * @typedef ListQueriesResponse
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;doubleclickbidmanager#listQueriesResponse&quot;.
 * @property {doubleclickbidmanager(v1).Query[]} queries Retrieved queries.
 */
/**
 * @typedef ListReportsResponse
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;doubleclickbidmanager#listReportsResponse&quot;.
 * @property {doubleclickbidmanager(v1).Report[]} reports Retrieved reports.
 */
/**
 * @typedef Parameters
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {doubleclickbidmanager(v1).FilterPair[]} filters Filters used to match traffic data in your report.
 * @property {string[]} groupBys Data is grouped by the filters listed in this field.
 * @property {boolean} includeInviteData Whether to include data from Invite Media.
 * @property {string[]} metrics Metrics to include as columns in your report.
 * @property {string} type Report type.
 */
/**
 * @typedef Query
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;doubleclickbidmanager#query&quot;.
 * @property {doubleclickbidmanager(v1).QueryMetadata} metadata Query metadata.
 * @property {doubleclickbidmanager(v1).Parameters} params Query parameters.
 * @property {string} queryId Query ID.
 * @property {string} reportDataEndTimeMs The ending time for the data that is shown in the report. Note, reportDataEndTimeMs is required if metadata.dataRange is CUSTOM_DATES and ignored otherwise.
 * @property {string} reportDataStartTimeMs The starting time for the data that is shown in the report. Note, reportDataStartTimeMs is required if metadata.dataRange is CUSTOM_DATES and ignored otherwise.
 * @property {doubleclickbidmanager(v1).QuerySchedule} schedule Information on how often and when to run a query.
 * @property {string} timezoneCode Canonical timezone code for report data time. Defaults to America/New_York.
 */
/**
 * @typedef QueryMetadata
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
* @property {string} dataRange Range of report data.
* @property {string} format Format of the generated report.
* @property {string} googleCloudStoragePathForLatestReport The path to the location in Google Cloud Storage where the latest report is stored.
* @property {string} googleDrivePathForLatestReport The path in Google Drive for the latest report.
* @property {string} latestReportRunTimeMs The time when the latest report started to run.
* @property {string} locale Locale of the generated reports. Valid values are cs CZECH de GERMAN en ENGLISH es SPANISH fr FRENCH it ITALIAN ja JAPANESE ko KOREAN pl POLISH pt-BR BRAZILIAN_PORTUGUESE ru RUSSIAN tr TURKISH uk UKRAINIAN zh-CN CHINA_CHINESE zh-TW TAIWAN_CHINESE

An locale string not in the list above will generate reports in English.
* @property {integer} reportCount Number of reports that have been generated for the query.
* @property {boolean} running Whether the latest report is currently running.
* @property {boolean} sendNotification Whether to send an email notification when a report is ready. Default to false.
* @property {string[]} shareEmailAddress List of email addresses which are sent email notifications when the report is finished. Separate from sendNotification.
* @property {string} title Query title. It is used to name the reports generated from this query.
*/
/**
 * @typedef QuerySchedule
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} endTimeMs Datetime to periodically run the query until.
 * @property {string} frequency How often the query is run.
 * @property {integer} nextRunMinuteOfDay Time of day at which a new report will be generated, represented as minutes past midnight. Range is 0 to 1439. Only applies to scheduled reports.
 * @property {string} nextRunTimezoneCode Canonical timezone code for report generation time. Defaults to America/New_York.
 */
/**
 * @typedef Report
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {doubleclickbidmanager(v1).ReportKey} key Key used to identify a report.
 * @property {doubleclickbidmanager(v1).ReportMetadata} metadata Report metadata.
 * @property {doubleclickbidmanager(v1).Parameters} params Report parameters.
 */
/**
 * @typedef ReportFailure
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} errorCode Error code that shows why the report was not created.
 */
/**
 * @typedef ReportKey
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} queryId Query ID.
 * @property {string} reportId Report ID.
 */
/**
 * @typedef ReportMetadata
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} googleCloudStoragePath The path to the location in Google Cloud Storage where the report is stored.
 * @property {string} reportDataEndTimeMs The ending time for the data that is shown in the report.
 * @property {string} reportDataStartTimeMs The starting time for the data that is shown in the report.
 * @property {doubleclickbidmanager(v1).ReportStatus} status Report status.
 */
/**
 * @typedef ReportStatus
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {doubleclickbidmanager(v1).ReportFailure} failure If the report failed, this records the cause.
 * @property {string} finishTimeMs The time when this report either completed successfully or failed.
 * @property {string} format The file type of the report.
 * @property {string} state The state of the report.
 */
/**
 * @typedef RowStatus
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {boolean} changed Whether the stored entity is changed as a result of upload.
 * @property {string} entityId Entity Id.
 * @property {string} entityName Entity name.
 * @property {string[]} errors Reasons why the entity can&#39;t be uploaded.
 * @property {boolean} persisted Whether the entity is persisted.
 * @property {integer} rowNumber Row number.
 */
/**
 * @typedef RunQueryRequest
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string} dataRange Report data range used to generate the report.
 * @property {string} reportDataEndTimeMs The ending time for the data that is shown in the report. Note, reportDataEndTimeMs is required if dataRange is CUSTOM_DATES and ignored otherwise.
 * @property {string} reportDataStartTimeMs The starting time for the data that is shown in the report. Note, reportDataStartTimeMs is required if dataRange is CUSTOM_DATES and ignored otherwise.
 * @property {string} timezoneCode Canonical timezone code for report data time. Defaults to America/New_York.
 */
/**
 * @typedef UploadLineItemsRequest
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {boolean} dryRun Set to true to get upload status without actually persisting the line items.
 * @property {string} format Format the line items are in. Default to CSV.
 * @property {string} lineItems Line items in CSV to upload. Refer to  Entity Write File Format for more information on file format.
 */
/**
 * @typedef UploadLineItemsResponse
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {doubleclickbidmanager(v1).UploadStatus} uploadStatus Status of upload.
 */
/**
 * @typedef UploadStatus
 * @memberOf! doubleclickbidmanager(v1)
 * @type object
 * @property {string[]} errors Reasons why upload can&#39;t be completed.
 * @property {doubleclickbidmanager(v1).RowStatus[]} rowStatus Per-row upload status.
 */
module.exports = Doubleclickbidmanager;
