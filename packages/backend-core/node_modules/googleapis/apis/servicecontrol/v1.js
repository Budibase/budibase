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
 * Google Service Control API
 *
 * Google Service Control provides control plane functionality to managed services, such as logging, monitoring, and status checks.
 *
 * @example
 * var google = require('googleapis');
 * var servicecontrol = google.servicecontrol('v1');
 *
 * @namespace servicecontrol
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Servicecontrol
 */
function Servicecontrol(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.services = {

    /**
     * servicecontrol.services.check
     *
     * @desc Checks an operation with Google Service Control to decide whether the given operation should proceed. It should be called before the operation is executed.  If feasible, the client should cache the check results and reuse them for 60 seconds. In case of server errors, the client can rely on the cached results for longer time.  NOTE: the `CheckRequest` has the size limit of 1MB.  This method requires the `servicemanagement.services.check` permission on the specified service. For more information, see [Google Cloud IAM](https://cloud.google.com/iam).
     *
     * @alias servicecontrol.services.check
     * @memberOf! servicecontrol(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName The service name as specified in its service configuration. For example, `"pubsub.googleapis.com"`.  See google.api.Service for the definition of a service name.
     * @param {servicecontrol(v1).CheckRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    check: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://servicecontrol.googleapis.com/v1/services/{serviceName}:check',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * servicecontrol.services.report
     *
     * @desc Reports operation results to Google Service Control, such as logs and metrics. It should be called after an operation is completed.  If feasible, the client should aggregate reporting data for up to 5 seconds to reduce API traffic. Limiting aggregation to 5 seconds is to reduce data loss during client crashes. Clients should carefully choose the aggregation time window to avoid data loss risk more than 0.01% for business and compliance reasons.  NOTE: the `ReportRequest` has the size limit of 1MB.  This method requires the `servicemanagement.services.report` permission on the specified service. For more information, see [Google Cloud IAM](https://cloud.google.com/iam).
     *
     * @alias servicecontrol.services.report
     * @memberOf! servicecontrol(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.serviceName The service name as specified in its service configuration. For example, `"pubsub.googleapis.com"`.  See google.api.Service for the definition of a service name.
     * @param {servicecontrol(v1).ReportRequest} params.resource Request body data
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
          url: 'https://servicecontrol.googleapis.com/v1/services/{serviceName}:report',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['serviceName'],
        pathParams: ['serviceName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef CheckError
 * @memberOf! servicecontrol(v1)
 * @type object
 * @property {string} code The error code.
 * @property {string} detail Free-form text providing details on the error cause of the error.
 */
/**
 * @typedef Status
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef ReportError
 * @memberOf! servicecontrol(v1)
 * @type object
 * @property {string} operationId The Operation.operation_id value from the request.
 * @property {servicecontrol(v1).Status} status Details of the error when processing the `Operation`.
 */
/**
 * @typedef ExponentialBuckets
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {number} growthFactor The i&#39;th exponential bucket covers the interval
  [scale * growth_factor^(i-1), scale * growth_factor^i)
where i ranges from 1 to num_finite_buckets inclusive.
Must be larger than 1.0.
* @property {number} scale The i&#39;th exponential bucket covers the interval
  [scale * growth_factor^(i-1), scale * growth_factor^i)
where i ranges from 1 to num_finite_buckets inclusive.
Must be &gt; 0.
* @property {integer} numFiniteBuckets The number of finite buckets. With the underflow and overflow buckets,
the total number of buckets is `num_finite_buckets` + 2.
See comments on `bucket_options` for details.
*/
/**
 * @typedef Operation
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {string} operationName Fully qualified name of the operation. Reserved for future use.
* @property {string} operationId Identity of the operation. This must be unique within the scope of the
service that generated the operation. If the service calls
Check() and Report() on the same operation, the two calls should carry
the same id.

UUID version 4 is recommended, though not required.
In scenarios where an operation is computed from existing information
and an idempotent id is desirable for deduplication purpose, UUID version 5
is recommended. See RFC 4122 for details.
* @property {string} endTime End time of the operation.
Required when the operation is used in ServiceController.Report,
but optional when the operation is used in ServiceController.Check.
* @property {object} labels Labels describing the operation. Only the following labels are allowed:

- Labels describing monitored resources as defined in
  the service configuration.
- Default labels of metric values. When specified, labels defined in the
  metric value override these default.
- The following labels defined by Google Cloud Platform:
    - `cloud.googleapis.com/location` describing the location where the
       operation happened,
    - `servicecontrol.googleapis.com/user_agent` describing the user agent
       of the API request,
    - `servicecontrol.googleapis.com/service_agent` describing the service
       used to handle the API request (e.g. ESP),
    - `servicecontrol.googleapis.com/platform` describing the platform
       where the API is served (e.g. GAE, GCE, GKE).
* @property {string} importance DO NOT USE. This is an experimental field.
* @property {string} consumerId Identity of the consumer who is using the service.
This field should be filled in for the operations initiated by a
consumer, but not for service-initiated operations that are
not related to a specific consumer.

This can be in one of the following formats:
  project:&lt;project_id&gt;,
  project_number:&lt;project_number&gt;,
  api_key:&lt;api_key&gt;.
* @property {string} startTime Required. Start time of the operation.
* @property {servicecontrol(v1).LogEntry[]} logEntries Represents information to be logged.
* @property {servicecontrol(v1).MetricValueSet[]} metricValueSets Represents information about this operation. Each MetricValueSet
corresponds to a metric defined in the service configuration.
The data type used in the MetricValueSet must agree with
the data type specified in the metric definition.

Within a single operation, it is not allowed to have more than one
MetricValue instances that have the same metric names and identical
label value combinations. If a request has such duplicated MetricValue
instances, the entire request is rejected with
an invalid argument error.
*/
/**
 * @typedef CheckRequest
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {servicecontrol(v1).Operation} operation The operation to be checked.
* @property {string} serviceConfigId Specifies which version of service configuration should be used to process
the request.

If unspecified or no matching version can be found, the
latest one will be used.
*/
/**
 * @typedef LogEntry
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {string} textPayload The log entry payload, represented as a Unicode string (UTF-8).
* @property {object} structPayload The log entry payload, represented as a structure that
is expressed as a JSON object.
* @property {object} labels A set of user-defined (key, value) data that provides additional
information about the log entry.
* @property {string} severity The severity of the log entry. The default value is
`LogSeverity.DEFAULT`.
* @property {string} name Required. The log to which this log entry belongs. Examples: `&quot;syslog&quot;`,
`&quot;book_log&quot;`.
* @property {object} protoPayload The log entry payload, represented as a protocol buffer that is
expressed as a JSON object. You can only pass `protoPayload`
values that belong to a set of approved types.
* @property {string} timestamp The time the event described by the log entry occurred. If
omitted, defaults to operation start time.
* @property {string} insertId A unique ID for the log entry used for deduplication. If omitted,
the implementation will generate one based on operation_id.
*/
/**
 * @typedef ReportRequest
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {servicecontrol(v1).Operation[]} operations Operations to be reported.

Typically the service should report one operation per request.
Putting multiple operations into a single request is allowed, but should
be used only when multiple operations are natually available at the time
of the report.

If multiple operations are in a single request, the total request size
should be no larger than 1MB. See ReportResponse.report_errors for
partial failure behavior.
* @property {string} serviceConfigId Specifies which version of service config should be used to process the
request.

If unspecified or no matching version can be found, the
latest one will be used.
*/
/**
 * @typedef MetricValueSet
 * @memberOf! servicecontrol(v1)
 * @type object
 * @property {string} metricName The metric name defined in the service configuration.
 * @property {servicecontrol(v1).MetricValue[]} metricValues The values in this metric.
 */
/**
 * @typedef LinearBuckets
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {number} width The i&#39;th linear bucket covers the interval
  [offset + (i-1) * width, offset + i * width)
where i ranges from 1 to num_finite_buckets, inclusive.
Must be strictly positive.
* @property {number} offset The i&#39;th linear bucket covers the interval
  [offset + (i-1) * width, offset + i * width)
where i ranges from 1 to num_finite_buckets, inclusive.
* @property {integer} numFiniteBuckets The number of finite buckets. With the underflow and overflow buckets,
the total number of buckets is `num_finite_buckets` + 2.
See comments on `bucket_options` for details.
*/
/**
 * @typedef CheckResponse
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {servicecontrol(v1).CheckError[]} checkErrors Indicate the decision of the check.

If no check errors are present, the service should process the operation.
Otherwise the service should use the list of errors to determine the
appropriate action.
* @property {string} operationId The same operation_id value used in the CheckRequest.
Used for logging and diagnostics purposes.
* @property {string} serviceConfigId The actual config id used to process the request.
*/
/**
 * @typedef ReportResponse
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {servicecontrol(v1).ReportError[]} reportErrors Partial failures, one for each `Operation` in the request that failed
processing. There are three possible combinations of the RPC status:

1. The combination of a successful RPC status and an empty `report_errors`
   list indicates a complete success where all `Operations` in the
   request are processed successfully.
2. The combination of a successful RPC status and a non-empty
   `report_errors` list indicates a partial success where some
   `Operations` in the request succeeded. Each
   `Operation` that failed processing has a corresponding item
   in this list.
3. A failed RPC status indicates a general non-deterministic failure.
   When this happens, it&#39;s impossible to know which of the
   &#39;Operations&#39; in the request succeeded or failed.
* @property {string} serviceConfigId The actual config id used to process the request.
*/
/**
 * @typedef Distribution
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {string[]} bucketCounts The number of samples in each histogram bucket. `bucket_counts` are
optional. If present, they must sum to the `count` value.

The buckets are defined below in `bucket_option`. There are N buckets.
`bucket_counts[0]` is the number of samples in the underflow bucket.
`bucket_counts[1]` to `bucket_counts[N-1]` are the numbers of samples
in each of the finite buckets. And `bucket_counts[N] is the number
of samples in the overflow bucket. See the comments of `bucket_option`
below for more details.

Any suffix of trailing zeros may be omitted.
* @property {servicecontrol(v1).ExponentialBuckets} exponentialBuckets Buckets with exponentially growing width.
* @property {servicecontrol(v1).ExplicitBuckets} explicitBuckets Buckets with arbitrary user-provided width.
* @property {number} maximum The maximum of the population of values. Ignored if `count` is zero.
* @property {string} count The total number of samples in the distribution. Must be &gt;= 0.
* @property {servicecontrol(v1).LinearBuckets} linearBuckets Buckets with constant width.
* @property {number} sumOfSquaredDeviation The sum of squared deviations from the mean:
  Sum[i=1..count]((x_i - mean)^2)
where each x_i is a sample values. If `count` is zero then this field
must be zero, otherwise validation of the request fails.
* @property {number} minimum The minimum of the population of values. Ignored if `count` is zero.
* @property {number} mean The arithmetic mean of the samples in the distribution. If `count` is
zero then this field must be zero.
*/
/**
 * @typedef ExplicitBuckets
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {number[]} bounds &#39;bound&#39; is a list of strictly increasing boundaries between
buckets. Note that a list of length N-1 defines N buckets because
of fenceposting. See comments on `bucket_options` for details.

The i&#39;th finite bucket covers the interval
  [bound[i-1], bound[i])
where i ranges from 1 to bound_size() - 1. Note that there are no
finite buckets at all if &#39;bound&#39; only contains a single element; in
that special case the single bound defines the boundary between the
underflow and overflow buckets.

bucket number                   lower bound    upper bound
 i == 0 (underflow)              -inf           bound[i]
 0 &lt; i &lt; bound_size()            bound[i-1]     bound[i]
 i == bound_size() (overflow)    bound[i-1]     +inf
*/
/**
 * @typedef MetricValue
 * @memberOf! servicecontrol(v1)
 * @type object
* @property {string} stringValue A text string value.
* @property {number} doubleValue A double precision floating point value.
* @property {boolean} boolValue A boolean value.
* @property {string} endTime The end of the time period over which this metric value&#39;s measurement
applies.
* @property {object} labels The labels describing the metric value.
See comments on google.api.servicecontrol.v1.Operation.labels for
the overriding relationship.
* @property {servicecontrol(v1).Distribution} distributionValue A distribution value.
* @property {string} startTime The start of the time period over which this metric value&#39;s measurement
applies. The time period has different semantics for different metric
types (cumulative, delta, and gauge). See the metric definition
documentation in the service configuration for details.
* @property {string} int64Value A signed 64-bit integer value.
*/
module.exports = Servicecontrol;
