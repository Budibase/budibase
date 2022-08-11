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
 * DoubleClick Search API
 *
 * Reports and modifies your advertising data in DoubleClick Search (for example, campaigns, ad groups, keywords, and conversions).
 *
 * @example
 * var google = require('googleapis');
 * var doubleclicksearch = google.doubleclicksearch('v2');
 *
 * @namespace doubleclicksearch
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Doubleclicksearch
 */
function Doubleclicksearch(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.conversion = {

    /**
     * doubleclicksearch.conversion.get
     *
     * @desc Retrieves a list of conversions from a DoubleClick Search engine account.
     *
     * @alias doubleclicksearch.conversion.get
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.adGroupId Numeric ID of the ad group.
     * @param {string=} params.adId Numeric ID of the ad.
     * @param {string} params.advertiserId Numeric ID of the advertiser.
     * @param {string} params.agencyId Numeric ID of the agency.
     * @param {string=} params.campaignId Numeric ID of the campaign.
     * @param {string=} params.criterionId Numeric ID of the criterion.
     * @param {integer} params.endDate Last date (inclusive) on which to retrieve conversions. Format is yyyymmdd.
     * @param {string} params.engineAccountId Numeric ID of the engine account.
     * @param {integer} params.rowCount The number of conversions to return per call.
     * @param {integer} params.startDate First date (inclusive) on which to retrieve conversions. Format is yyyymmdd.
     * @param {integer} params.startRow The 0-based starting index for retrieving conversions results.
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/agency/{agencyId}/advertiser/{advertiserId}/engine/{engineAccountId}/conversion',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['agencyId', 'advertiserId', 'engineAccountId', 'endDate', 'rowCount', 'startDate', 'startRow'],
        pathParams: ['advertiserId', 'agencyId', 'engineAccountId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclicksearch.conversion.insert
     *
     * @desc Inserts a batch of new conversions into DoubleClick Search.
     *
     * @alias doubleclicksearch.conversion.insert
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {doubleclicksearch(v2).ConversionList} params.resource Request body data
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/conversion',
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
     * doubleclicksearch.conversion.patch
     *
     * @desc Updates a batch of conversions in DoubleClick Search. This method supports patch semantics.
     *
     * @alias doubleclicksearch.conversion.patch
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.advertiserId Numeric ID of the advertiser.
     * @param {string} params.agencyId Numeric ID of the agency.
     * @param {integer} params.endDate Last date (inclusive) on which to retrieve conversions. Format is yyyymmdd.
     * @param {string} params.engineAccountId Numeric ID of the engine account.
     * @param {integer} params.rowCount The number of conversions to return per call.
     * @param {integer} params.startDate First date (inclusive) on which to retrieve conversions. Format is yyyymmdd.
     * @param {integer} params.startRow The 0-based starting index for retrieving conversions results.
     * @param {doubleclicksearch(v2).ConversionList} params.resource Request body data
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/conversion',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['advertiserId', 'agencyId', 'endDate', 'engineAccountId', 'rowCount', 'startDate', 'startRow'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclicksearch.conversion.update
     *
     * @desc Updates a batch of conversions in DoubleClick Search.
     *
     * @alias doubleclicksearch.conversion.update
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {doubleclicksearch(v2).ConversionList} params.resource Request body data
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/conversion',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclicksearch.conversion.updateAvailability
     *
     * @desc Updates the availabilities of a batch of floodlight activities in DoubleClick Search.
     *
     * @alias doubleclicksearch.conversion.updateAvailability
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {doubleclicksearch(v2).UpdateAvailabilityRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateAvailability: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclicksearch/v2/conversion/updateAvailability',
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

  self.reports = {

    /**
     * doubleclicksearch.reports.generate
     *
     * @desc Generates and returns a report immediately.
     *
     * @alias doubleclicksearch.reports.generate
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {doubleclicksearch(v2).ReportRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclicksearch/v2/reports/generate',
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
     * doubleclicksearch.reports.get
     *
     * @desc Polls for the status of a report request.
     *
     * @alias doubleclicksearch.reports.get
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.reportId ID of the report request being polled.
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/reports/{reportId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['reportId'],
        pathParams: ['reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclicksearch.reports.getFile
     *
     * @desc Downloads a report file encoded in UTF-8.
     *
     * @alias doubleclicksearch.reports.getFile
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer} params.reportFragment The index of the report fragment to download.
     * @param {string} params.reportId ID of the report.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getFile: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclicksearch/v2/reports/{reportId}/files/{reportFragment}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['reportId', 'reportFragment'],
        pathParams: ['reportFragment', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * doubleclicksearch.reports.request
     *
     * @desc Inserts a report request into the reporting system.
     *
     * @alias doubleclicksearch.reports.request
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {doubleclicksearch(v2).ReportRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    request: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/doubleclicksearch/v2/reports',
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

  self.savedColumns = {

    /**
     * doubleclicksearch.savedColumns.list
     *
     * @desc Retrieve the list of saved columns for a specified advertiser.
     *
     * @alias doubleclicksearch.savedColumns.list
     * @memberOf! doubleclicksearch(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.advertiserId DS ID of the advertiser.
     * @param {string} params.agencyId DS ID of the agency.
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
          url: 'https://www.googleapis.com/doubleclicksearch/v2/agency/{agencyId}/advertiser/{advertiserId}/savedcolumns',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['agencyId', 'advertiserId'],
        pathParams: ['advertiserId', 'agencyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Availability
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {string} advertiserId DS advertiser ID.
 * @property {string} agencyId DS agency ID.
 * @property {string} availabilityTimestamp The time by which all conversions have been uploaded, in epoch millis UTC.
 * @property {string} segmentationId The numeric segmentation identifier (for example, DoubleClick Search Floodlight activity ID).
 * @property {string} segmentationName The friendly segmentation identifier (for example, DoubleClick Search Floodlight activity name).
 * @property {string} segmentationType The segmentation type that this availability is for (its default value is FLOODLIGHT).
 */
/**
 * @typedef Conversion
 * @memberOf! doubleclicksearch(v2)
 * @type object
* @property {string} adGroupId DS ad group ID.
* @property {string} adId DS ad ID.
* @property {string} advertiserId DS advertiser ID.
* @property {string} agencyId DS agency ID.
* @property {string} attributionModel Available to advertisers only after contacting DoubleClick Search customer support.
* @property {string} campaignId DS campaign ID.
* @property {string} channel Sales channel for the product. Acceptable values are:  
- &quot;local&quot;: a physical store 
- &quot;online&quot;: an online store
* @property {string} clickId DS click ID for the conversion.
* @property {string} conversionId For offline conversions, this is an ID that advertisers are required to provide. Advertisers can specify any ID that is meaningful to them. For online conversions, DS copies the dsConversionId or floodlightOrderId into this property depending on the advertiser&#39;s Floodlight instructions.
* @property {string} conversionModifiedTimestamp The time at which the conversion was last modified, in epoch millis UTC.
* @property {string} conversionTimestamp The time at which the conversion took place, in epoch millis UTC.
* @property {string} countMillis Available to advertisers only after contacting DoubleClick Search customer support.
* @property {string} criterionId DS criterion (keyword) ID.
* @property {string} currencyCode The currency code for the conversion&#39;s revenue. Should be in ISO 4217 alphabetic (3-char) format.
* @property {doubleclicksearch(v2).CustomDimension[]} customDimension Custom dimensions for the conversion, which can be used to filter data in a report.
* @property {doubleclicksearch(v2).CustomMetric[]} customMetric Custom metrics for the conversion.
* @property {string} deviceType The type of device on which the conversion occurred.
* @property {string} dsConversionId ID that DoubleClick Search generates for each conversion.
* @property {string} engineAccountId DS engine account ID.
* @property {string} floodlightOrderId The Floodlight order ID provided by the advertiser for the conversion.
* @property {string} inventoryAccountId ID that DS generates and uses to uniquely identify the inventory account that contains the product.
* @property {string} productCountry The country registered for the Merchant Center feed that contains the product. Use an ISO 3166 code to specify a country.
* @property {string} productGroupId DS product group ID.
* @property {string} productId The product ID (SKU).
* @property {string} productLanguage The language registered for the Merchant Center feed that contains the product. Use an ISO 639 code to specify a language.
* @property {string} quantityMillis The quantity of this conversion, in millis.
* @property {string} revenueMicros The revenue amount of this TRANSACTION conversion, in micros (value multiplied by 1000000, no decimal). For example, to specify a revenue value of &quot;10&quot; enter &quot;10000000&quot; (10 million) in your request.
* @property {string} segmentationId The numeric segmentation identifier (for example, DoubleClick Search Floodlight activity ID).
* @property {string} segmentationName The friendly segmentation identifier (for example, DoubleClick Search Floodlight activity name).
* @property {string} segmentationType The segmentation type of this conversion (for example, FLOODLIGHT).
* @property {string} state The state of the conversion, that is, either ACTIVE or REMOVED. Note: state DELETED is deprecated.
* @property {string} storeId The ID of the local store for which the product was advertised. Applicable only when the channel is &quot;local&quot;.
* @property {string} type The type of the conversion, that is, either ACTION or TRANSACTION. An ACTION conversion is an action by the user that has no monetarily quantifiable value, while a TRANSACTION conversion is an action that does have a monetarily quantifiable value. Examples are email list signups (ACTION) versus ecommerce purchases (TRANSACTION).
*/
/**
 * @typedef ConversionList
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {doubleclicksearch(v2).Conversion[]} conversion The conversions being requested.
 * @property {string} kind Identifies this as a ConversionList resource. Value: the fixed string doubleclicksearch#conversionList.
 */
/**
 * @typedef CustomDimension
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {string} name Custom dimension name.
 * @property {string} value Custom dimension value.
 */
/**
 * @typedef CustomMetric
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {string} name Custom metric name.
 * @property {number} value Custom metric numeric value.
 */
/**
 * @typedef Report
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {object[]} files Asynchronous report only. Contains a list of generated report files once the report has succesfully completed.
 * @property {string} id Asynchronous report only. Id of the report.
 * @property {boolean} isReportReady Asynchronous report only. True if and only if the report has completed successfully and the report files are ready to be downloaded.
 * @property {string} kind Identifies this as a Report resource. Value: the fixed string doubleclicksearch#report.
 * @property {doubleclicksearch(v2).ReportRequest} request The request that created the report. Optional fields not specified in the original request are filled with default values.
 * @property {integer} rowCount The number of report rows generated by the report, not including headers.
 * @property {doubleclicksearch(v2).ReportRow[]} rows Synchronous report only. Generated report rows.
 * @property {string} statisticsCurrencyCode The currency code of all monetary values produced in the report, including values that are set by users (e.g., keyword bid settings) and metrics (e.g., cost and revenue). The currency code of a report is determined by the statisticsCurrency field of the report request.
 * @property {string} statisticsTimeZone If all statistics of the report are sourced from the same time zone, this would be it. Otherwise the field is unset.
 */
/**
 * @typedef ReportApiColumnSpec
 * @memberOf! doubleclicksearch(v2)
 * @type object
* @property {string} columnName Name of a DoubleClick Search column to include in the report.
* @property {string} customDimensionName Segments a report by a custom dimension. The report must be scoped to an advertiser or lower, and the custom dimension must already be set up in DoubleClick Search. The custom dimension name, which appears in DoubleClick Search, is case sensitive.
If used in a conversion report, returns the value of the specified custom dimension for the given conversion, if set. This column does not segment the conversion report.
* @property {string} customMetricName Name of a custom metric to include in the report. The report must be scoped to an advertiser or lower, and the custom metric must already be set up in DoubleClick Search. The custom metric name, which appears in DoubleClick Search, is case sensitive.
* @property {string} endDate Inclusive day in YYYY-MM-DD format. When provided, this overrides the overall time range of the report for this column only. Must be provided together with startDate.
* @property {boolean} groupByColumn Synchronous report only. Set to true to group by this column. Defaults to false.
* @property {string} headerText Text used to identify this column in the report output; defaults to columnName or savedColumnName when not specified. This can be used to prevent collisions between DoubleClick Search columns and saved columns with the same name.
* @property {string} platformSource The platform that is used to provide data for the custom dimension. Acceptable values are &quot;floodlight&quot;.
* @property {string} productReportPerspective Returns metrics only for a specific type of product activity. Accepted values are:  
- &quot;sold&quot;: returns metrics only for products that were sold 
- &quot;advertised&quot;: returns metrics only for products that were advertised in a Shopping campaign, and that might or might not have been sold
* @property {string} savedColumnName Name of a saved column to include in the report. The report must be scoped at advertiser or lower, and this saved column must already be created in the DoubleClick Search UI.
* @property {string} startDate Inclusive date in YYYY-MM-DD format. When provided, this overrides the overall time range of the report for this column only. Must be provided together with endDate.
*/
/**
 * @typedef ReportRequest
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {doubleclicksearch(v2).ReportApiColumnSpec[]} columns The columns to include in the report. This includes both DoubleClick Search columns and saved columns. For DoubleClick Search columns, only the columnName parameter is required. For saved columns only the savedColumnName parameter is required. Both columnName and savedColumnName cannot be set in the same stanza.
 * @property {string} downloadFormat Format that the report should be returned in. Currently csv or tsv is supported.
 * @property {object[]} filters A list of filters to be applied to the report.
 * @property {boolean} includeDeletedEntities Determines if removed entities should be included in the report. Defaults to false. Deprecated, please use includeRemovedEntities instead.
 * @property {boolean} includeRemovedEntities Determines if removed entities should be included in the report. Defaults to false.
 * @property {integer} maxRowsPerFile Asynchronous report only. The maximum number of rows per report file. A large report is split into many files based on this field. Acceptable values are 1000000 to 100000000, inclusive.
 * @property {object[]} orderBy Synchronous report only. A list of columns and directions defining sorting to be performed on the report rows.
 * @property {object} reportScope The reportScope is a set of IDs that are used to determine which subset of entities will be returned in the report. The full lineage of IDs from the lowest scoped level desired up through agency is required.
 * @property {string} reportType Determines the type of rows that are returned in the report. For example, if you specify reportType: keyword, each row in the report will contain data about a keyword. See the Types of Reports reference for the columns that are available for each type.
 * @property {integer} rowCount Synchronous report only. The maxinum number of rows to return; additional rows are dropped. Acceptable values are 0 to 10000, inclusive. Defaults to 10000.
 * @property {integer} startRow Synchronous report only. Zero-based index of the first row to return. Acceptable values are 0 to 50000, inclusive. Defaults to 0.
 * @property {string} statisticsCurrency Specifies the currency in which monetary will be returned. Possible values are: usd, agency (valid if the report is scoped to agency or lower), advertiser (valid if the report is scoped to * advertiser or lower), or account (valid if the report is scoped to engine account or lower).
 * @property {object} timeRange If metrics are requested in a report, this argument will be used to restrict the metrics to a specific time range.
 * @property {boolean} verifySingleTimeZone If true, the report would only be created if all the requested stat data are sourced from a single timezone. Defaults to false.
 */
/**
 * @typedef ReportRow
 * @memberOf! doubleclicksearch(v2)
 * @type object
 */
/**
 * @typedef SavedColumn
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {string} kind Identifies this as a SavedColumn resource. Value: the fixed string doubleclicksearch#savedColumn.
 * @property {string} savedColumnName The name of the saved column.
 * @property {string} type The type of data this saved column will produce.
 */
/**
 * @typedef SavedColumnList
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {doubleclicksearch(v2).SavedColumn[]} items The saved columns being requested.
 * @property {string} kind Identifies this as a SavedColumnList resource. Value: the fixed string doubleclicksearch#savedColumnList.
 */
/**
 * @typedef UpdateAvailabilityRequest
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {doubleclicksearch(v2).Availability[]} availabilities The availabilities being requested.
 */
/**
 * @typedef UpdateAvailabilityResponse
 * @memberOf! doubleclicksearch(v2)
 * @type object
 * @property {doubleclicksearch(v2).Availability[]} availabilities The availabilities being returned.
 */
module.exports = Doubleclicksearch;
