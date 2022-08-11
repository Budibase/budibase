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
 * Cloud Monitoring API
 *
 * Accesses Google Cloud Monitoring data.
 *
 * @example
 * var google = require('googleapis');
 * var cloudmonitoring = google.cloudmonitoring('v2beta2');
 *
 * @namespace cloudmonitoring
 * @type {Function}
 * @version v2beta2
 * @variation v2beta2
 * @param {object=} options Options for Cloudmonitoring
 */
function Cloudmonitoring(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.metricDescriptors = {

    /**
     * cloudmonitoring.metricDescriptors.create
     *
     * @desc Create a new metric.
     *
     * @alias cloudmonitoring.metricDescriptors.create
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project id. The value can be the numeric project ID or string-based project name.
     * @param {cloudmonitoring(v2beta2).MetricDescriptor} params.resource Request body data
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
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/metricDescriptors',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudmonitoring.metricDescriptors.delete
     *
     * @desc Delete an existing metric.
     *
     * @alias cloudmonitoring.metricDescriptors.delete
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.metric Name of the metric.
     * @param {string} params.project The project ID to which the metric belongs.
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
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/metricDescriptors/{metric}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'metric'],
        pathParams: ['metric', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudmonitoring.metricDescriptors.list
     *
     * @desc List metric descriptors that match the query. If the query is not set, then all of the metric descriptors will be returned. Large responses will be paginated, use the nextPageToken returned in the response to request subsequent pages of results by setting the pageToken query parameter to the value of the nextPageToken.
     *
     * @alias cloudmonitoring.metricDescriptors.list
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.count Maximum number of metric descriptors per page. Used for pagination. If not specified, count = 100.
     * @param {string=} params.pageToken The pagination token, which is used to page through large result sets. Set this value to the value of the nextPageToken to retrieve the next page of results.
     * @param {string} params.project The project id. The value can be the numeric project ID or string-based project name.
     * @param {string=} params.query The query used to search against existing metrics. Separate keywords with a space; the service joins all keywords with AND, meaning that all keywords must match for a metric to be returned. If this field is omitted, all metrics are returned. If an empty string is passed with this field, no metrics are returned.
     * @param {cloudmonitoring(v2beta2).ListMetricDescriptorsRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/metricDescriptors',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.timeseries = {

    /**
     * cloudmonitoring.timeseries.list
     *
     * @desc List the data points of the time series that match the metric and labels values and that have data points in the interval. Large responses are paginated; use the nextPageToken returned in the response to request subsequent pages of results by setting the pageToken query parameter to the value of the nextPageToken.
     *
     * @alias cloudmonitoring.timeseries.list
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.aggregator The aggregation function that will reduce the data points in each window to a single point. This parameter is only valid for non-cumulative metrics with a value type of INT64 or DOUBLE.
     * @param {integer=} params.count Maximum number of data points per page, which is used for pagination of results.
     * @param {string=} params.labels A collection of labels for the matching time series, which are represented as:   - key==value: key equals the value  - key=~value: key regex matches the value  - key!=value: key does not equal the value  - key!~value: key regex does not match the value  For example, to list all of the time series descriptors for the region us-central1, you could specify: label=cloud.googleapis.com%2Flocation=~us-central1.*
     * @param {string} params.metric Metric names are protocol-free URLs as listed in the Supported Metrics page. For example, compute.googleapis.com/instance/disk/read_ops_count.
     * @param {string=} params.oldest Start of the time interval (exclusive), which is expressed as an RFC 3339 timestamp. If neither oldest nor timespan is specified, the default time interval will be (youngest - 4 hours, youngest]
     * @param {string=} params.pageToken The pagination token, which is used to page through large result sets. Set this value to the value of the nextPageToken to retrieve the next page of results.
     * @param {string} params.project The project ID to which this time series belongs. The value can be the numeric project ID or string-based project name.
     * @param {string=} params.timespan Length of the time interval to query, which is an alternative way to declare the interval: (youngest - timespan, youngest]. The timespan and oldest parameters should not be used together. Units:   - s: second  - m: minute  - h: hour  - d: day  - w: week  Examples: 2s, 3m, 4w. Only one unit is allowed, for example: 2w3d is not allowed; you should use 17d instead.  If neither oldest nor timespan is specified, the default time interval will be (youngest - 4 hours, youngest].
     * @param {string=} params.window The sampling window. At most one data point will be returned for each window in the requested time interval. This parameter is only valid for non-cumulative metric types. Units:   - m: minute  - h: hour  - d: day  - w: week  Examples: 3m, 4w. Only one unit is allowed, for example: 2w3d is not allowed; you should use 17d instead.
     * @param {string} params.youngest End of the time interval (inclusive), which is expressed as an RFC 3339 timestamp.
     * @param {cloudmonitoring(v2beta2).ListTimeseriesRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/timeseries/{metric}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'metric', 'youngest'],
        pathParams: ['metric', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * cloudmonitoring.timeseries.write
     *
     * @desc Put data points to one or more time series for one or more metrics. If a time series does not exist, a new time series will be created. It is not allowed to write a time series point that is older than the existing youngest point of that time series. Points that are older than the existing youngest point of that time series will be discarded silently. Therefore, users should make sure that points of a time series are written sequentially in the order of their end time.
     *
     * @alias cloudmonitoring.timeseries.write
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project The project ID. The value can be the numeric project ID or string-based project name.
     * @param {cloudmonitoring(v2beta2).WriteTimeseriesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    write: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/timeseries:write',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.timeseriesDescriptors = {

    /**
     * cloudmonitoring.timeseriesDescriptors.list
     *
     * @desc List the descriptors of the time series that match the metric and labels values and that have data points in the interval. Large responses are paginated; use the nextPageToken returned in the response to request subsequent pages of results by setting the pageToken query parameter to the value of the nextPageToken.
     *
     * @alias cloudmonitoring.timeseriesDescriptors.list
     * @memberOf! cloudmonitoring(v2beta2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.aggregator The aggregation function that will reduce the data points in each window to a single point. This parameter is only valid for non-cumulative metrics with a value type of INT64 or DOUBLE.
     * @param {integer=} params.count Maximum number of time series descriptors per page. Used for pagination. If not specified, count = 100.
     * @param {string=} params.labels A collection of labels for the matching time series, which are represented as:   - key==value: key equals the value  - key=~value: key regex matches the value  - key!=value: key does not equal the value  - key!~value: key regex does not match the value  For example, to list all of the time series descriptors for the region us-central1, you could specify: label=cloud.googleapis.com%2Flocation=~us-central1.*
     * @param {string} params.metric Metric names are protocol-free URLs as listed in the Supported Metrics page. For example, compute.googleapis.com/instance/disk/read_ops_count.
     * @param {string=} params.oldest Start of the time interval (exclusive), which is expressed as an RFC 3339 timestamp. If neither oldest nor timespan is specified, the default time interval will be (youngest - 4 hours, youngest]
     * @param {string=} params.pageToken The pagination token, which is used to page through large result sets. Set this value to the value of the nextPageToken to retrieve the next page of results.
     * @param {string} params.project The project ID to which this time series belongs. The value can be the numeric project ID or string-based project name.
     * @param {string=} params.timespan Length of the time interval to query, which is an alternative way to declare the interval: (youngest - timespan, youngest]. The timespan and oldest parameters should not be used together. Units:   - s: second  - m: minute  - h: hour  - d: day  - w: week  Examples: 2s, 3m, 4w. Only one unit is allowed, for example: 2w3d is not allowed; you should use 17d instead.  If neither oldest nor timespan is specified, the default time interval will be (youngest - 4 hours, youngest].
     * @param {string=} params.window The sampling window. At most one data point will be returned for each window in the requested time interval. This parameter is only valid for non-cumulative metric types. Units:   - m: minute  - h: hour  - d: day  - w: week  Examples: 3m, 4w. Only one unit is allowed, for example: 2w3d is not allowed; you should use 17d instead.
     * @param {string} params.youngest End of the time interval (inclusive), which is expressed as an RFC 3339 timestamp.
     * @param {cloudmonitoring(v2beta2).ListTimeseriesDescriptorsRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/cloudmonitoring/v2beta2/projects/{project}/timeseriesDescriptors/{metric}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'metric', 'youngest'],
        pathParams: ['metric', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef DeleteMetricDescriptorResponse
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#deleteMetricDescriptorResponse&quot;.
 */
/**
 * @typedef ListMetricDescriptorsRequest
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listMetricDescriptorsRequest&quot;.
 */
/**
 * @typedef ListMetricDescriptorsResponse
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listMetricDescriptorsResponse&quot;.
 * @property {cloudmonitoring(v2beta2).MetricDescriptor[]} metrics The returned metric descriptors.
 * @property {string} nextPageToken Pagination token. If present, indicates that additional results are available for retrieval. To access the results past the pagination limit, pass this value to the pageToken query parameter.
 */
/**
 * @typedef ListTimeseriesDescriptorsRequest
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listTimeseriesDescriptorsRequest&quot;.
 */
/**
 * @typedef ListTimeseriesDescriptorsResponse
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listTimeseriesDescriptorsResponse&quot;.
 * @property {string} nextPageToken Pagination token. If present, indicates that additional results are available for retrieval. To access the results past the pagination limit, set this value to the pageToken query parameter.
 * @property {string} oldest The oldest timestamp of the interval of this query, as an RFC 3339 string.
 * @property {cloudmonitoring(v2beta2).TimeseriesDescriptor[]} timeseries The returned time series descriptors.
 * @property {string} youngest The youngest timestamp of the interval of this query, as an RFC 3339 string.
 */
/**
 * @typedef ListTimeseriesRequest
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listTimeseriesRequest&quot;.
 */
/**
 * @typedef ListTimeseriesResponse
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#listTimeseriesResponse&quot;.
 * @property {string} nextPageToken Pagination token. If present, indicates that additional results are available for retrieval. To access the results past the pagination limit, set the pageToken query parameter to this value. All of the points of a time series will be returned before returning any point of the subsequent time series.
 * @property {string} oldest The oldest timestamp of the interval of this query as an RFC 3339 string.
 * @property {cloudmonitoring(v2beta2).Timeseries[]} timeseries The returned time series.
 * @property {string} youngest The youngest timestamp of the interval of this query as an RFC 3339 string.
 */
/**
 * @typedef MetricDescriptor
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} description Description of this metric.
 * @property {cloudmonitoring(v2beta2).MetricDescriptorLabelDescriptor[]} labels Labels defined for this metric.
 * @property {string} name The name of this metric.
 * @property {string} project The project ID to which the metric belongs.
 * @property {cloudmonitoring(v2beta2).MetricDescriptorTypeDescriptor} typeDescriptor Type description for this metric.
 */
/**
 * @typedef MetricDescriptorLabelDescriptor
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} description Label description.
 * @property {string} key Label key.
 */
/**
 * @typedef MetricDescriptorTypeDescriptor
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} metricType The method of collecting data for the metric. See Metric types.
 * @property {string} valueType The data type of of individual points in the metric&#39;s time series. See Metric value types.
 */
/**
 * @typedef Point
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {boolean} boolValue The value of this data point. Either &quot;true&quot; or &quot;false&quot;.
 * @property {cloudmonitoring(v2beta2).PointDistribution} distributionValue The value of this data point as a distribution. A distribution value can contain a list of buckets and/or an underflowBucket and an overflowBucket. The values of these points can be used to create a histogram.
 * @property {number} doubleValue The value of this data point as a double-precision floating-point number.
 * @property {string} end The interval [start, end] is the time period to which the point&#39;s value applies. For gauge metrics, whose values are instantaneous measurements, this interval should be empty (start should equal end). For cumulative metrics (of which deltas and rates are special cases), the interval should be non-empty. Both start and end are RFC 3339 strings.
 * @property {string} int64Value The value of this data point as a 64-bit integer.
 * @property {string} start The interval [start, end] is the time period to which the point&#39;s value applies. For gauge metrics, whose values are instantaneous measurements, this interval should be empty (start should equal end). For cumulative metrics (of which deltas and rates are special cases), the interval should be non-empty. Both start and end are RFC 3339 strings.
 * @property {string} stringValue The value of this data point in string format.
 */
/**
 * @typedef PointDistribution
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {cloudmonitoring(v2beta2).PointDistributionBucket[]} buckets The finite buckets.
 * @property {cloudmonitoring(v2beta2).PointDistributionOverflowBucket} overflowBucket The overflow bucket.
 * @property {cloudmonitoring(v2beta2).PointDistributionUnderflowBucket} underflowBucket The underflow bucket.
 */
/**
 * @typedef PointDistributionBucket
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} count The number of events whose values are in the interval defined by this bucket.
 * @property {number} lowerBound The lower bound of the value interval of this bucket (inclusive).
 * @property {number} upperBound The upper bound of the value interval of this bucket (exclusive).
 */
/**
 * @typedef PointDistributionOverflowBucket
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} count The number of events whose values are in the interval defined by this bucket.
 * @property {number} lowerBound The lower bound of the value interval of this bucket (inclusive).
 */
/**
 * @typedef PointDistributionUnderflowBucket
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} count The number of events whose values are in the interval defined by this bucket.
 * @property {number} upperBound The upper bound of the value interval of this bucket (exclusive).
 */
/**
 * @typedef Timeseries
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {cloudmonitoring(v2beta2).Point[]} points The data points of this time series. The points are listed in order of their end timestamp, from younger to older.
 * @property {cloudmonitoring(v2beta2).TimeseriesDescriptor} timeseriesDesc The descriptor of this time series.
 */
/**
 * @typedef TimeseriesDescriptor
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {object} labels The label&#39;s name.
 * @property {string} metric The name of the metric.
 * @property {string} project The Developers Console project number to which this time series belongs.
 */
/**
 * @typedef TimeseriesDescriptorLabel
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} key The label&#39;s name.
 * @property {string} value The label&#39;s value.
 */
/**
 * @typedef TimeseriesPoint
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {cloudmonitoring(v2beta2).Point} point The data point in this time series snapshot.
 * @property {cloudmonitoring(v2beta2).TimeseriesDescriptor} timeseriesDesc The descriptor of this time series.
 */
/**
 * @typedef WriteTimeseriesRequest
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {object} commonLabels The label&#39;s name.
 * @property {cloudmonitoring(v2beta2).TimeseriesPoint[]} timeseries Provide time series specific labels and the data points for each time series. The labels in timeseries and the common_labels should form a complete list of labels that required by the metric.
 */
/**
 * @typedef WriteTimeseriesResponse
 * @memberOf! cloudmonitoring(v2beta2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;cloudmonitoring#writeTimeseriesResponse&quot;.
 */
module.exports = Cloudmonitoring;
