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
 * Google Analytics Reporting API
 *
 * Accesses Analytics report data.
 *
 * @example
 * var google = require('googleapis');
 * var analyticsreporting = google.analyticsreporting('v4');
 *
 * @namespace analyticsreporting
 * @type {Function}
 * @version v4
 * @variation v4
 * @param {object=} options Options for Analyticsreporting
 */
function Analyticsreporting(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.reports = {

    /**
     * analyticsreporting.reports.batchGet
     *
     * @desc Returns the Analytics data.
     *
     * @alias analyticsreporting.reports.batchGet
     * @memberOf! analyticsreporting(v4)
     *
     * @param {object} params Parameters for request
     * @param {analyticsreporting(v4).GetReportsRequest} params.resource Request body data
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
          url: 'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
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
 * @typedef PivotHeader
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {integer} totalPivotGroupsCount The total number of groups for this pivot.
 * @property {analyticsreporting(v4).PivotHeaderEntry[]} pivotHeaderEntries A single pivot section header.
 */
/**
 * @typedef Metric
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} alias An alias for the metric expression is an alternate name for the
expression. The alias can be used for filtering and sorting. This field
is optional and is useful if the expression is not a single metric but
a complex expression which cannot be used in filtering and sorting.
The alias is also used in the response column header.
* @property {string} formattingType Specifies how the metric expression should be formatted, for example
`INTEGER`.
* @property {string} expression A metric expression in the request. An expression is constructed from one
or more metrics and numbers. Accepted operators include: Plus (+), Minus
(-), Negation (Unary -), Divided by (/), Multiplied by (*), Parenthesis,
Positive cardinal numbers (0-9), can include decimals and is limited to
1024 characters. Example `ga:totalRefunds/ga:users`, in most cases the
metric expression is just a single metric name like `ga:users`.
Adding mixed `MetricType` (E.g., `CURRENCY` + `PERCENTAGE`) metrics
will result in unexpected results.
*/
/**
 * @typedef ColumnHeader
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string[]} dimensions The dimension names in the response.
 * @property {analyticsreporting(v4).MetricHeader} metricHeader Metric headers for the metrics in the response.
 */
/**
 * @typedef DynamicSegment
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).SegmentDefinition} sessionSegment Session Segment to select sessions to include in the segment.
 * @property {string} name The name of the dynamic segment.
 * @property {analyticsreporting(v4).SegmentDefinition} userSegment User Segment to select users to include in the segment.
 */
/**
 * @typedef MetricHeader
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).MetricHeaderEntry[]} metricHeaderEntries Headers for the metrics in the response.
 * @property {analyticsreporting(v4).PivotHeader[]} pivotHeaders Headers for the pivots in the response.
 */
/**
 * @typedef Report
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).ColumnHeader} columnHeader The column headers.
 * @property {analyticsreporting(v4).ReportData} data Response data.
 * @property {string} nextPageToken Page token to retrieve the next page of results in the list.
 */
/**
 * @typedef SegmentFilterClause
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).SegmentDimensionFilter} dimensionFilter Dimension Filter for the segment definition.
 * @property {analyticsreporting(v4).SegmentMetricFilter} metricFilter Metric Filter for the segment definition.
 * @property {boolean} not Matches the complement (`!`) of the filter.
 */
/**
 * @typedef DimensionFilter
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} dimensionName The dimension to filter on. A DimensionFilter must contain a dimension.
* @property {string} operator How to match the dimension to the expression. The default is REGEXP.
* @property {boolean} caseSensitive Should the match be case sensitive? Default is false.
* @property {string[]} expressions Strings or regular expression to match against. Only the first value of
the list is used for comparison unless the operator is `IN_LIST`.
If `IN_LIST` operator, then the entire list is used to filter the
dimensions as explained in the description of the `IN_LIST` operator.
* @property {boolean} not Logical `NOT` operator. If this boolean is set to true, then the matching
dimension values will be excluded in the report. The default is false.
*/
/**
 * @typedef SegmentDimensionFilter
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string} maxComparisonValue Maximum comparison values for `BETWEEN` match type.
 * @property {string} dimensionName Name of the dimension for which the filter is being applied.
 * @property {boolean} caseSensitive Should the match be case sensitive, ignored for `IN_LIST` operator.
 * @property {string} operator The operator to use to match the dimension with the expressions.
 * @property {string[]} expressions The list of expressions, only the first element is used for all operators
 * @property {string} minComparisonValue Minimum comparison values for `BETWEEN` match type.
 */
/**
 * @typedef ReportRequest
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).CohortGroup} cohortGroup Cohort group associated with this request. If there is a cohort group
in the request the `ga:cohort` dimension must be present.
Every [ReportRequest](#ReportRequest) within a `batchGet` method must
contain the same `cohortGroup` definition.
* @property {analyticsreporting(v4).Dimension[]} dimensions The dimensions requested.
Requests can have a total of 7 dimensions.
* @property {analyticsreporting(v4).MetricFilterClause[]} metricFilterClauses The metric filter clauses. They are logically combined with the `AND`
operator.  Metric filters look at only the first date range and not the
comparing date range. Note that filtering on metrics occurs after the
metrics are aggregated.
* @property {boolean} hideTotals If set to true, hides the total of all metrics for all the matching rows,
for every date range. The default false and will return the totals.
* @property {boolean} includeEmptyRows If set to false, the response does not include rows if all the retrieved
metrics are equal to zero. The default is false which will exclude these
rows.
* @property {analyticsreporting(v4).DimensionFilterClause[]} dimensionFilterClauses The dimension filter clauses for filtering Dimension Values. They are
logically combined with the `AND` operator. Note that filtering occurs
before any dimensions are aggregated, so that the returned metrics
represent the total for only the relevant dimensions.
* @property {analyticsreporting(v4).Pivot[]} pivots The pivot definitions. Requests can have a maximum of 2 pivots.
* @property {analyticsreporting(v4).DateRange[]} dateRanges Date ranges in the request. The request can have a maximum of 2 date
ranges. The response will contain a set of metric values for each
combination of the dimensions for each date range in the request. So, if
there are two date ranges, there will be two set of metric values, one for
the original date range and one for the second date range.
The `reportRequest.dateRanges` field should not be specified for cohorts
or Lifetime value requests.
If a date range is not provided, the default date range is (startDate:
current date - 7 days, endDate: current date - 1 day). Every
[ReportRequest](#ReportRequest) within a `batchGet` method must
contain the same `dateRanges` definition.
* @property {analyticsreporting(v4).Segment[]} segments Segment the data returned for the request. A segment definition helps look
at a subset of the segment request. A request can contain up to four
segments. Every [ReportRequest](#ReportRequest) within a
`batchGet` method must contain the same `segments` definition. Requests
with segments must have the `ga:segment` dimension.
* @property {string} samplingLevel The desired report
[sample](https://support.google.com/analytics/answer/2637192) size.
If the the `samplingLevel` field is unspecified the `DEFAULT` sampling
level is used. Every [ReportRequest](#ReportRequest) within a
`batchGet` method must contain the same `samplingLevel` definition. See
[developer guide](/analytics/devguides/reporting/core/v4/basics#sampling)
 for details.
* @property {analyticsreporting(v4).Metric[]} metrics The metrics requested.
Requests must specify at least one metric. Requests can have a
total of 10 metrics.
* @property {integer} pageSize Page size is for paging and specifies the maximum number of returned rows.
Page size should be &gt;= 0. A query returns the default of 1,000 rows.
The Analytics Core Reporting API returns a maximum of 10,000 rows per
request, no matter how many you ask for. It can also return fewer rows
than requested, if there aren&#39;t as many dimension segments as you expect.
For instance, there are fewer than 300 possible values for `ga:country`,
so when segmenting only by country, you can&#39;t get more than 300 rows,
even if you set `pageSize` to a higher value.
* @property {analyticsreporting(v4).OrderBy[]} orderBys Sort order on output rows. To compare two rows, the elements of the
following are applied in order until a difference is found.  All date
ranges in the output get the same row order.
* @property {string} filtersExpression Dimension or metric filters that restrict the data returned for your
request. To use the `filtersExpression`, supply a dimension or metric on
which to filter, followed by the filter expression. For example, the
following expression selects `ga:browser` dimension which starts with
Firefox; `ga:browser=~^Firefox`. For more information on dimensions
and metric filters, see
[Filters reference](https://developers.google.com/analytics/devguides/reporting/core/v3/reference#filters).
* @property {boolean} hideValueRanges If set to true, hides the minimum and maximum across all matching rows.
The default is false and the value ranges are returned.
* @property {string} viewId The Analytics
[view ID](https://support.google.com/analytics/answer/1009618)
from which to retrieve data. Every [ReportRequest](#ReportRequest)
within a `batchGet` method must contain the same `viewId`.
* @property {string} pageToken A continuation token to get the next page of the results. Adding this to
the request will return the rows after the pageToken. The pageToken should
be the value returned in the nextPageToken parameter in the response to
the GetReports request.
*/
/**
 * @typedef SimpleSegment
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).OrFiltersForSegment[]} orFiltersForSegment A list of segment filters groups which are combined with logical `AND`
operator.
*/
/**
 * @typedef SegmentDefinition
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).SegmentFilter[]} segmentFilters A segment is defined by a set of segment filters which are combined
together with a logical `AND` operation.
*/
/**
 * @typedef SegmentMetricFilter
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} metricName The metric that will be filtered on. A `metricFilter` must contain a
metric name.
* @property {string} operator Specifies is the operation to perform to compare the metric. The default
is `EQUAL`.
* @property {string} comparisonValue The value to compare against. If the operator is `BETWEEN`, this value is
treated as minimum comparison value.
* @property {string} scope Scope for a metric defines the level at which that metric is defined.  The
specified metric scope must be equal to or greater than its primary scope
as defined in the data model. The primary scope is defined by if the
segment is selecting users or sessions.
* @property {string} maxComparisonValue Max comparison value is only used for `BETWEEN` operator.
*/
/**
 * @typedef ReportData
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {integer} rowCount Total number of matching rows for this query.
* @property {string[]} samplingSpaceSizes If the results are
[sampled](https://support.google.com/analytics/answer/2637192),
this returns the total number of
samples present, one entry per date range. If the results are not sampled
this field will not be defined. See
[developer guide](/analytics/devguides/reporting/core/v4/basics#sampling)
for details.
* @property {analyticsreporting(v4).DateRangeValues[]} maximums Minimum and maximum values seen over all matching rows. These are both
empty when `hideValueRanges` in the request is false, or when
rowCount is zero.
* @property {string[]} samplesReadCounts If the results are
[sampled](https://support.google.com/analytics/answer/2637192),
this returns the total number of samples read, one entry per date range.
If the results are not sampled this field will not be defined. See
[developer guide](/analytics/devguides/reporting/core/v4/basics#sampling)
for details.
* @property {analyticsreporting(v4).DateRangeValues[]} minimums Minimum and maximum values seen over all matching rows. These are both
empty when `hideValueRanges` in the request is false, or when
rowCount is zero.
* @property {analyticsreporting(v4).ReportRow[]} rows There&#39;s one ReportRow for every unique combination of dimensions.
* @property {string} dataLastRefreshed The last time the data in the report was refreshed. All the hits received
before this timestamp are included in the calculation of the report.
* @property {analyticsreporting(v4).DateRangeValues[]} totals For each requested date range, for the set of all rows that match
the query, every requested value format gets a total. The total
for a value format is computed by first totaling the metrics
mentioned in the value format and then evaluating the value
format as a scalar expression.  E.g., The &quot;totals&quot; for
`3 / (ga:sessions + 2)` we compute
`3 / ((sum of all relevant ga:sessions) + 2)`.
Totals are computed before pagination.
* @property {boolean} isDataGolden Indicates if response to this request is golden or not. Data is
golden when the exact same request will not produce any new results if
asked at a later point in time.
*/
/**
 * @typedef GetReportsRequest
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).ReportRequest[]} reportRequests Requests, each request will have a separate response.
There can be a maximum of 5 requests. All requests should have the same
`dateRanges`, `viewId`, `segments`, `samplingLevel`, and `cohortGroup`.
*/
/**
 * @typedef OrderBy
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} sortOrder The sorting order for the field.
* @property {string} orderType The order type. The default orderType is `VALUE`.
* @property {string} fieldName The field which to sort by. The default sort order is ascending. Example:
`ga:browser`.
Note, that you can only specify one field for sort here. For example,
`ga:browser, ga:city` is not valid.
*/
/**
 * @typedef Cohort
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} type Type of the cohort. The only supported type as of now is
`FIRST_VISIT_DATE`. If this field is unspecified the cohort is treated
as `FIRST_VISIT_DATE` type cohort.
* @property {analyticsreporting(v4).DateRange} dateRange This is used for `FIRST_VISIT_DATE` cohort, the cohort selects users
whose first visit date is between start date and end date defined in the
DateRange. The date ranges should be aligned for cohort requests. If the
request contains `ga:cohortNthDay` it should be exactly one day long,
if `ga:cohortNthWeek` it should be aligned to the week boundary (starting
at Sunday and ending Saturday), and for `ga:cohortNthMonth` the date range
should be aligned to the month (starting at the first and ending on the
last day of the month).
For LTV requests there are no such restrictions.
You do not need to supply a date range for the
`reportsRequest.dateRanges` field.
* @property {string} name A unique name for the cohort. If not defined name will be auto-generated
with values cohort_[1234...].
*/
/**
 * @typedef OrFiltersForSegment
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).SegmentFilterClause[]} segmentFilterClauses List of segment filters to be combined with a `OR` operator.
 */
/**
 * @typedef SequenceSegment
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {boolean} firstStepShouldMatchFirstHit If set, first step condition must match the first hit of the visitor (in
the date range).
* @property {analyticsreporting(v4).SegmentSequenceStep[]} segmentSequenceSteps The list of steps in the sequence.
*/
/**
 * @typedef SegmentFilter
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).SequenceSegment} sequenceSegment Sequence conditions consist of one or more steps, where each step is
defined by one or more dimension/metric conditions. Multiple steps can
be combined with special sequence operators.
* @property {boolean} not If true, match the complement of simple or sequence segment.
For example, to match all visits not from &quot;New York&quot;, we can define the
segment as follows:

      &quot;sessionSegment&quot;: {
        &quot;segmentFilters&quot;: [{
          &quot;simpleSegment&quot; :{
            &quot;orFiltersForSegment&quot;: [{
              &quot;segmentFilterClauses&quot;:[{
                &quot;dimensionFilter&quot;: {
                  &quot;dimensionName&quot;: &quot;ga:city&quot;,
                  &quot;expressions&quot;: [&quot;New York&quot;]
                }
              }]
            }]
          },
          &quot;not&quot;: &quot;True&quot;
        }]
      },
* @property {analyticsreporting(v4).SimpleSegment} simpleSegment A Simple segment conditions consist of one or more dimension/metric
conditions that can be combined
*/
/**
 * @typedef PivotHeaderEntry
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string[]} dimensionNames The name of the dimensions in the pivot response.
 * @property {string[]} dimensionValues The values for the dimensions in the pivot.
 * @property {analyticsreporting(v4).MetricHeaderEntry} metric The metric header for the metric in the pivot.
 */
/**
 * @typedef DimensionFilterClause
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} operator The operator for combining multiple dimension filters. If unspecified, it
is treated as an `OR`.
* @property {analyticsreporting(v4).DimensionFilter[]} filters The repeated set of filters. They are logically combined based on the
operator specified.
*/
/**
 * @typedef SegmentSequenceStep
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} matchType Specifies if the step immediately precedes or can be any time before the
next step.
* @property {analyticsreporting(v4).OrFiltersForSegment[]} orFiltersForSegment A sequence is specified with a list of Or grouped filters which are
combined with `AND` operator.
*/
/**
 * @typedef Pivot
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {analyticsreporting(v4).Dimension[]} dimensions A list of dimensions to show as pivot columns. A Pivot can have a maximum
of 4 dimensions. Pivot dimensions are part of the restriction on the
total number of dimensions allowed in the request.
* @property {analyticsreporting(v4).Metric[]} metrics The pivot metrics. Pivot metrics are part of the
restriction on total number of metrics allowed in the request.
* @property {integer} maxGroupCount Specifies the maximum number of groups to return.
The default value is 10, also the maximum value is 1,000.
* @property {analyticsreporting(v4).DimensionFilterClause[]} dimensionFilterClauses DimensionFilterClauses are logically combined with an `AND` operator: only
data that is included by all these DimensionFilterClauses contributes to
the values in this pivot region. Dimension filters can be used to restrict
the columns shown in the pivot region. For example if you have
`ga:browser` as the requested dimension in the pivot region, and you
specify key filters to restrict `ga:browser` to only &quot;IE&quot; or &quot;Firefox&quot;,
then only those two browsers would show up as columns.
* @property {integer} startGroup If k metrics were requested, then the response will contain some
data-dependent multiple of k columns in the report.  E.g., if you pivoted
on the dimension `ga:browser` then you&#39;d get k columns for &quot;Firefox&quot;, k
columns for &quot;IE&quot;, k columns for &quot;Chrome&quot;, etc. The ordering of the groups
of columns is determined by descending order of &quot;total&quot; for the first of
the k values.  Ties are broken by lexicographic ordering of the first
pivot dimension, then lexicographic ordering of the second pivot
dimension, and so on.  E.g., if the totals for the first value for
Firefox, IE, and Chrome were 8, 2, 8, respectively, the order of columns
would be Chrome, Firefox, IE.

The following let you choose which of the groups of k columns are
included in the response.
*/
/**
 * @typedef DateRangeValues
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string[]} values Each value corresponds to each Metric in the request.
 * @property {analyticsreporting(v4).PivotValueRegion[]} pivotValueRegions The values of each pivot region.
 */
/**
 * @typedef MetricFilterClause
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} operator The operator for combining multiple metric filters. If unspecified, it is
treated as an `OR`.
* @property {analyticsreporting(v4).MetricFilter[]} filters The repeated set of filters. They are logically combined based on the
operator specified.
*/
/**
 * @typedef Segment
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).DynamicSegment} dynamicSegment A dynamic segment definition in the request.
 * @property {string} segmentId The segment ID of a built-in or custom segment, for example `gaid::-3`.
 */
/**
 * @typedef DateRange
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string} startDate The start date for the query in the format `YYYY-MM-DD`.
 * @property {string} endDate The end date for the query in the format `YYYY-MM-DD`.
 */
/**
 * @typedef ReportRow
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string[]} dimensions List of requested dimensions.
 * @property {analyticsreporting(v4).DateRangeValues[]} metrics List of metrics for each requested DateRange.
 */
/**
 * @typedef CohortGroup
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {boolean} lifetimeValue Enable Life Time Value (LTV).  LTV measures lifetime value for users
acquired through different channels.
Please see:
[Cohort Analysis](https://support.google.com/analytics/answer/6074676) and
[Lifetime Value](https://support.google.com/analytics/answer/6182550)
If the value of lifetimeValue is false:

- The metric values are similar to the values in the web interface cohort
  report.
- The cohort definition date ranges must be aligned to the calendar week
  and month. i.e. while requesting `ga:cohortNthWeek` the `startDate` in
  the cohort definition should be a Sunday and the `endDate` should be the
  following Saturday, and for `ga:cohortNthMonth`, the `startDate`
  should be the 1st of the month and `endDate` should be the last day
  of the month.

When the lifetimeValue is true:

- The metric values will correspond to the values in the web interface
  LifeTime value report.
- The Lifetime Value report shows you how user value (Revenue) and
  engagement (Appviews, Goal Completions, Sessions, and Session Duration)
  grow during the 90 days after a user is acquired.
- The metrics are calculated as a cumulative average per user per the time
  increment.
- The cohort definition date ranges need not be aligned to the calendar
  week and month boundaries.
- The `viewId` must be an
  [app view ID](https://support.google.com/analytics/answer/2649553#WebVersusAppViews)
* @property {analyticsreporting(v4).Cohort[]} cohorts The definition for the cohort.
*/
/**
 * @typedef GetReportsResponse
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {analyticsreporting(v4).Report[]} reports Responses corresponding to each of the request.
 */
/**
 * @typedef MetricHeaderEntry
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string} type The type of the metric, for example `INTEGER`.
 * @property {string} name The name of the header.
 */
/**
 * @typedef MetricFilter
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string} metricName The metric that will be filtered on. A metricFilter must contain a metric
name. A metric name can be an alias earlier defined as a metric or it can
also be a metric expression.
* @property {string} operator Is the metric `EQUAL`, `LESS_THAN` or `GREATER_THAN` the
comparisonValue, the default is `EQUAL`. If the operator is
`IS_MISSING`, checks if the metric is missing and would ignore the
comparisonValue.
* @property {string} comparisonValue The value to compare against.
* @property {boolean} not Logical `NOT` operator. If this boolean is set to true, then the matching
metric values will be excluded in the report. The default is false.
*/
/**
 * @typedef Dimension
 * @memberOf! analyticsreporting(v4)
 * @type object
* @property {string[]} histogramBuckets If non-empty, we place dimension values into buckets after string to
int64. Dimension values that are not the string representation of an
integral value will be converted to zero.  The bucket values have to be in
increasing order.  Each bucket is closed on the lower end, and open on the
upper end. The &quot;first&quot; bucket includes all values less than the first
boundary, the &quot;last&quot; bucket includes all values up to infinity. Dimension
values that fall in a bucket get transformed to a new dimension value. For
example, if one gives a list of &quot;0, 1, 3, 4, 7&quot;, then we return the
following buckets:

- bucket #1: values &lt; 0, dimension value &quot;&lt;0&quot;
- bucket #2: values in [0,1), dimension value &quot;0&quot;
- bucket #3: values in [1,3), dimension value &quot;1-2&quot;
- bucket #4: values in [3,4), dimension value &quot;3&quot;
- bucket #5: values in [4,7), dimension value &quot;4-6&quot;
- bucket #6: values &gt;= 7, dimension value &quot;7+&quot;

NOTE: If you are applying histogram mutation on any dimension, and using
that dimension in sort, you will want to use the sort type
`HISTOGRAM_BUCKET` for that purpose. Without that the dimension values
will be sorted according to dictionary
(lexicographic) order. For example the ascending dictionary order is:

   &quot;&lt;50&quot;, &quot;1001+&quot;, &quot;121-1000&quot;, &quot;50-120&quot;

And the ascending `HISTOGRAM_BUCKET` order is:

   &quot;&lt;50&quot;, &quot;50-120&quot;, &quot;121-1000&quot;, &quot;1001+&quot;

The client has to explicitly request `&quot;orderType&quot;: &quot;HISTOGRAM_BUCKET&quot;`
for a histogram-mutated dimension.
* @property {string} name Name of the dimension to fetch, for example `ga:browser`.
*/
/**
 * @typedef PivotValueRegion
 * @memberOf! analyticsreporting(v4)
 * @type object
 * @property {string[]} values The values of the metrics in each of the pivot regions.
 */
module.exports = Analyticsreporting;
