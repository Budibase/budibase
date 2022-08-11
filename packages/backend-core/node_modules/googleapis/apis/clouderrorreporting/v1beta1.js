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
 * Stackdriver Error Reporting API
 *
 * Stackdriver Error Reporting groups and counts similar errors from cloud services. The Stackdriver Error Reporting API provides a way to report new errors and read access to error groups and their associated errors.

 *
 * @example
 * var google = require('googleapis');
 * var clouderrorreporting = google.clouderrorreporting('v1beta1');
 *
 * @namespace clouderrorreporting
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Clouderrorreporting
 */
function Clouderrorreporting(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    /**
     * clouderrorreporting.projects.deleteEvents
     *
     * @desc Deletes all error events of a given project.
     *
     * @alias clouderrorreporting.projects.deleteEvents
     * @memberOf! clouderrorreporting(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.projectName [Required] The resource name of the Google Cloud Platform project. Written as `projects/` plus the [Google Cloud Platform project ID](https://support.google.com/cloud/answer/6158840). Example: `projects/my-project-123`.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteEvents: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://clouderrorreporting.googleapis.com/v1beta1/{projectName}/events',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['projectName'],
        pathParams: ['projectName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    events: {

      /**
       * clouderrorreporting.projects.events.list
       *
       * @desc Lists the specified events.
       *
       * @alias clouderrorreporting.projects.events.list
       * @memberOf! clouderrorreporting(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.timeRange.period Restricts the query to the specified time range.
       * @param {string=} params.serviceFilter.resourceType [Optional] The exact value to match against [`ServiceContext.resource_type`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.resource_type).
       * @param {string} params.projectName [Required] The resource name of the Google Cloud Platform project. Written as `projects/` plus the [Google Cloud Platform project ID](https://support.google.com/cloud/answer/6158840). Example: `projects/my-project-123`.
       * @param {string=} params.serviceFilter.service [Optional] The exact value to match against [`ServiceContext.service`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.service).
       * @param {string=} params.groupId [Required] The group for which events shall be returned.
       * @param {string=} params.serviceFilter.version [Optional] The exact value to match against [`ServiceContext.version`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.version).
       * @param {integer=} params.pageSize [Optional] The maximum number of results to return per response.
       * @param {string=} params.pageToken [Optional] A `next_page_token` provided by a previous response.
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
            url: 'https://clouderrorreporting.googleapis.com/v1beta1/{projectName}/events',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectName'],
          pathParams: ['projectName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * clouderrorreporting.projects.events.report
       *
       * @desc Report an individual error event.  This endpoint accepts <strong>either</strong> an OAuth token, <strong>or</strong> an <a href="https://support.google.com/cloud/answer/6158862">API key</a> for authentication. To use an API key, append it to the URL as the value of a `key` parameter. For example: <pre>POST https://clouderrorreporting.googleapis.com/v1beta1/projects/example-project/events:report?key=123ABC456</pre>
       *
       * @alias clouderrorreporting.projects.events.report
       * @memberOf! clouderrorreporting(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.projectName [Required] The resource name of the Google Cloud Platform project. Written as `projects/` plus the [Google Cloud Platform project ID](https://support.google.com/cloud/answer/6158840). Example: `projects/my-project-123`.
       * @param {clouderrorreporting(v1beta1).ReportedErrorEvent} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      report: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://clouderrorreporting.googleapis.com/v1beta1/{projectName}/events:report',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['projectName'],
          pathParams: ['projectName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    groups: {

      /**
       * clouderrorreporting.projects.groups.update
       *
       * @desc Replace the data for the specified group. Fails if the group does not exist.
       *
       * @alias clouderrorreporting.projects.groups.update
       * @memberOf! clouderrorreporting(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The group resource name. Example: <code>projects/my-project-123/groups/my-groupid</code>
       * @param {clouderrorreporting(v1beta1).ErrorGroup} params.resource Request body data
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
            url: 'https://clouderrorreporting.googleapis.com/v1beta1/{name}',
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
       * clouderrorreporting.projects.groups.get
       *
       * @desc Get the specified group.
       *
       * @alias clouderrorreporting.projects.groups.get
       * @memberOf! clouderrorreporting(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.groupName [Required] The group resource name. Written as <code>projects/<var>projectID</var>/groups/<var>group_name</var></code>. Call <a href="/error-reporting/reference/rest/v1beta1/projects.groupStats/list"> <code>groupStats.list</code></a> to return a list of groups belonging to this project.  Example: <code>projects/my-project-123/groups/my-group</code>
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
            url: 'https://clouderrorreporting.googleapis.com/v1beta1/{groupName}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['groupName'],
          pathParams: ['groupName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    groupStats: {

      /**
       * clouderrorreporting.projects.groupStats.list
       *
       * @desc Lists the specified groups.
       *
       * @alias clouderrorreporting.projects.groupStats.list
       * @memberOf! clouderrorreporting(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.alignment [Optional] The alignment of the timed counts to be returned. Default is `ALIGNMENT_EQUAL_AT_END`.
       * @param {string=} params.timeRange.period Restricts the query to the specified time range.
       * @param {string=} params.serviceFilter.resourceType [Optional] The exact value to match against [`ServiceContext.resource_type`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.resource_type).
       * @param {string} params.projectName [Required] The resource name of the Google Cloud Platform project. Written as <code>projects/</code> plus the <a href="https://support.google.com/cloud/answer/6158840">Google Cloud Platform project ID</a>.  Example: <code>projects/my-project-123</code>.
       * @param {string=} params.order [Optional] The sort order in which the results are returned. Default is `COUNT_DESC`.
       * @param {string=} params.groupId [Optional] List all <code>ErrorGroupStats</code> with these IDs.
       * @param {string=} params.serviceFilter.service [Optional] The exact value to match against [`ServiceContext.service`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.service).
       * @param {string=} params.alignmentTime [Optional] Time where the timed counts shall be aligned if rounded alignment is chosen. Default is 00:00 UTC.
       * @param {string=} params.serviceFilter.version [Optional] The exact value to match against [`ServiceContext.version`](/error-reporting/reference/rest/v1beta1/ServiceContext#FIELDS.version).
       * @param {integer=} params.pageSize [Optional] The maximum number of results to return per response. Default is 20.
       * @param {string=} params.timedCountDuration [Optional] The preferred duration for a single returned `TimedCount`. If not set, no timed counts are returned.
       * @param {string=} params.pageToken [Optional] A `next_page_token` provided by a previous response. To view additional results, pass this token along with the identical query parameters as the first request.
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
            url: 'https://clouderrorreporting.googleapis.com/v1beta1/{projectName}/groupStats',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['projectName'],
          pathParams: ['projectName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef ReportedErrorEvent
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {clouderrorreporting(v1beta1).ServiceContext} serviceContext [Required] The service context in which this error has occurred.
* @property {clouderrorreporting(v1beta1).ErrorContext} context [Optional] A description of the context in which the error occurred.
* @property {string} eventTime [Optional] Time when the event occurred.
If not provided, the time when the event was received by the
Error Reporting system will be used.
* @property {string} message [Required] A message describing the error. The message can contain an
exception stack in one of the supported programming languages and formats.
In that case, the message is parsed and detailed exception information
is returned when retrieving the error event again.
*/
/**
 * @typedef SourceLocation
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} filePath The source code filename, which can include a truncated relative
path, or a full path from a production machine.
* @property {string} functionName Human-readable name of a function or method.
The value can include optional context like the class or package name.
For example, `my.package.MyClass.method` in case of Java.
* @property {integer} lineNumber 1-based. 0 indicates that the line number is unknown.
*/
/**
 * @typedef ErrorGroupStats
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {clouderrorreporting(v1beta1).ErrorEvent} representative An arbitrary event that is chosen as representative for the whole group.
The representative event is intended to be used as a quick preview for
the whole group. Events in the group are usually sufficiently similar
to each other such that showing an arbitrary representative provides
insight into the characteristics of the group as a whole.
* @property {integer} numAffectedServices The total number of services with a non-zero error count for the given
filter criteria.
* @property {string} affectedUsersCount Approximate number of affected users in the given group that
match the filter criteria.
Users are distinguished by data in the `ErrorContext` of the
individual error events, such as their login name or their remote
IP address in case of HTTP requests.
The number of affected users can be zero even if the number of
errors is non-zero if no data was provided from which the
affected user could be deduced.
Users are counted based on data in the request
context that was provided in the error report. If more users are
implicitly affected, such as due to a crash of the whole service,
this is not reflected here.
* @property {string} count Approximate total number of events in the given group that match
the filter criteria.
* @property {string} firstSeenTime Approximate first occurrence that was ever seen for this group
and which matches the given filter criteria, ignoring the
time_range that was specified in the request.
* @property {string} lastSeenTime Approximate last occurrence that was ever seen for this group and
which matches the given filter criteria, ignoring the time_range
that was specified in the request.
* @property {clouderrorreporting(v1beta1).ErrorGroup} group Group data that is independent of the filter criteria.
* @property {clouderrorreporting(v1beta1).ServiceContext[]} affectedServices Service contexts with a non-zero error count for the given filter
criteria. This list can be truncated if multiple services are affected.
Refer to `num_affected_services` for the total count.
* @property {clouderrorreporting(v1beta1).TimedCount[]} timedCounts Approximate number of occurrences over time.
Timed counts returned by ListGroups are guaranteed to be:

- Inside the requested time interval
- Non-overlapping, and
- Ordered by ascending time.
*/
/**
 * @typedef ErrorContext
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {clouderrorreporting(v1beta1).HttpRequestContext} httpRequest The HTTP request which was processed when the error was
triggered.
* @property {clouderrorreporting(v1beta1).SourceLocation} reportLocation The location in the source code where the decision was made to
report the error, usually the place where it was logged.
For a logged exception this would be the source line where the
exception is logged, usually close to the place where it was
caught. This value is in contrast to `Exception.cause_location`,
which describes the source line where the exception was thrown.
* @property {string} user The user who caused or was affected by the crash.
This can be a user ID, an email address, or an arbitrary token that
uniquely identifies the user.
When sending an error report, leave this field empty if the user was not
logged in. In this case the
Error Reporting system will use other data, such as remote IP address, to
distinguish affected users. See `affected_users_count` in
`ErrorGroupStats`.
*/
/**
 * @typedef ServiceContext
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} resourceType Type of the MonitoredResource. List of possible values:
https://cloud.google.com/monitoring/api/resources

Value is set automatically for incoming errors and must not be set when
reporting errors.
* @property {string} service An identifier of the service, such as the name of the
executable, job, or Google App Engine service name. This field is expected
to have a low number of values that are relatively stable over time, as
opposed to `version`, which can be changed whenever new code is deployed.

Contains the service name for error reports extracted from Google
App Engine logs or `default` if the App Engine default service is used.
* @property {string} version Represents the source code version that the developer provided,
which could represent a version label or a Git SHA-1 hash, for example.
*/
/**
 * @typedef ErrorGroup
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} groupId Group IDs are unique for a given project. If the same kind of error
occurs in different service contexts, it will receive the same group ID.
* @property {string} name The group resource name.
Example: &lt;code&gt;projects/my-project-123/groups/my-groupid&lt;/code&gt;
* @property {clouderrorreporting(v1beta1).TrackingIssue[]} trackingIssues Associated tracking issues.
*/
/**
 * @typedef ReportErrorEventResponse
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
 */
/**
 * @typedef TrackingIssue
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} url A URL pointing to a related entry in an issue tracking system.
Example: https://github.com/user/project/issues/4
*/
/**
 * @typedef DeleteEventsResponse
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
 */
/**
 * @typedef ErrorEvent
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {clouderrorreporting(v1beta1).ServiceContext} serviceContext The `ServiceContext` for which this error was reported.
* @property {clouderrorreporting(v1beta1).ErrorContext} context Data about the context in which the error occurred.
* @property {string} eventTime Time when the event occurred as provided in the error report.
If the report did not contain a timestamp, the time the error was received
by the Error Reporting system is used.
* @property {string} message The stack trace that was reported or logged by the service.
*/
/**
 * @typedef ListEventsResponse
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} nextPageToken If non-empty, more results are available.
Pass this token, along with the same query parameters as the first
request, to view the next page of results.
* @property {string} timeRangeBegin The timestamp specifies the start time to which the request was restricted.
* @property {clouderrorreporting(v1beta1).ErrorEvent[]} errorEvents The error events which match the given request.
*/
/**
 * @typedef TimedCount
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
 * @property {string} startTime Start of the time period to which `count` refers (included).
 * @property {string} endTime End of the time period to which `count` refers (excluded).
 * @property {string} count Approximate number of occurrences in the given time period.
 */
/**
 * @typedef HttpRequestContext
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} method The type of HTTP request, such as `GET`, `POST`, etc.
* @property {integer} responseStatusCode The HTTP response status code for the request.
* @property {string} remoteIp The IP address from which the request originated.
This can be IPv4, IPv6, or a token which is derived from the
IP address, depending on the data that has been provided
in the error report.
* @property {string} url The URL of the request.
* @property {string} referrer The referrer information that is provided with the request.
* @property {string} userAgent The user agent information that is provided with the request.
*/
/**
 * @typedef ListGroupStatsResponse
 * @memberOf! clouderrorreporting(v1beta1)
 * @type object
* @property {string} nextPageToken If non-empty, more results are available.
Pass this token, along with the same query parameters as the first
request, to view the next page of results.
* @property {string} timeRangeBegin The timestamp specifies the start time to which the request was restricted.
The start time is set based on the requested time range. It may be adjusted
to a later time if a project has exceeded the storage quota and older data
has been deleted.
* @property {clouderrorreporting(v1beta1).ErrorGroupStats[]} errorGroupStats The error group stats which match the given request.
*/
module.exports = Clouderrorreporting;
