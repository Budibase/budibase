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
 * Google Cloud Pub/Sub API
 *
 * Provides reliable, many-to-many, asynchronous messaging between applications.

 *
 * @example
 * var google = require('googleapis');
 * var pubsub = google.pubsub('v1beta1a');
 *
 * @namespace pubsub
 * @type {Function}
 * @version v1beta1a
 * @variation v1beta1a
 * @param {object=} options Options for Pubsub
 */
function Pubsub(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.subscriptions = {

    /**
     * pubsub.subscriptions.modifyPushConfig
     *
     * @desc Modifies the <code>PushConfig</code> for a specified subscription. This method can be used to suspend the flow of messages to an endpoint by clearing the <code>PushConfig</code> field in the request. Messages will be accumulated for delivery even if no push configuration is defined or while the configuration is modified.
     *
     * @alias pubsub.subscriptions.modifyPushConfig
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).ModifyPushConfigRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    modifyPushConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/modifyPushConfig',
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
     * pubsub.subscriptions.pull
     *
     * @desc Pulls a single message from the server. If return_immediately is true, and no messages are available in the subscription, this method returns FAILED_PRECONDITION. The system is free to return an UNAVAILABLE error if no messages are available in a reasonable amount of time (to reduce system load).
     *
     * @alias pubsub.subscriptions.pull
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).PullRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    pull: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/pull',
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
     * pubsub.subscriptions.list
     *
     * @desc Lists matching subscriptions.
     *
     * @alias pubsub.subscriptions.list
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.query A valid label query expression.
     * @param {integer=} params.maxResults Maximum number of subscriptions to return.
     * @param {string=} params.pageToken The value obtained in the last <code>ListSubscriptionsResponse</code> for continuation.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions',
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
     * pubsub.subscriptions.get
     *
     * @desc Gets the configuration details of a subscription.
     *
     * @alias pubsub.subscriptions.get
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string} params.subscription The name of the subscription to get.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/{subscription}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['subscription'],
        pathParams: ['subscription'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * pubsub.subscriptions.pullBatch
     *
     * @desc Pulls messages from the server. Returns an empty list if there are no messages available in the backlog. The system is free to return UNAVAILABLE if there are too many pull requests outstanding for the given subscription.
     *
     * @alias pubsub.subscriptions.pullBatch
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).PullBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    pullBatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/pullBatch',
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
     * pubsub.subscriptions.create
     *
     * @desc Creates a subscription on a given topic for a given subscriber. If the subscription already exists, returns ALREADY_EXISTS. If the corresponding topic doesn't exist, returns NOT_FOUND.  If the name is not provided in the request, the server will assign a random name for this subscription on the same project as the topic.
     *
     * @alias pubsub.subscriptions.create
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).Subscription} params.resource Request body data
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
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions',
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
     * pubsub.subscriptions.modifyAckDeadline
     *
     * @desc Modifies the Ack deadline for a message received from a pull request.
     *
     * @alias pubsub.subscriptions.modifyAckDeadline
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).ModifyAckDeadlineRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    modifyAckDeadline: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/modifyAckDeadline',
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
     * pubsub.subscriptions.delete
     *
     * @desc Deletes an existing subscription. All pending messages in the subscription are immediately dropped. Calls to Pull after deletion will return NOT_FOUND.
     *
     * @alias pubsub.subscriptions.delete
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string} params.subscription The subscription to delete.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/{subscription}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['subscription'],
        pathParams: ['subscription'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * pubsub.subscriptions.acknowledge
     *
     * @desc Acknowledges a particular received message: the Pub/Sub system can remove the given message from the subscription. Acknowledging a message whose Ack deadline has expired may succeed, but the message could have been already redelivered. Acknowledging a message more than once will not result in an error. This is only used for messages received via pull.
     *
     * @alias pubsub.subscriptions.acknowledge
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).AcknowledgeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    acknowledge: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/subscriptions/acknowledge',
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

  self.topics = {

    /**
     * pubsub.topics.publish
     *
     * @desc Adds a message to the topic.  Returns NOT_FOUND if the topic does not exist.
     *
     * @alias pubsub.topics.publish
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).PublishRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    publish: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/topics/publish',
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
     * pubsub.topics.list
     *
     * @desc Lists matching topics.
     *
     * @alias pubsub.topics.list
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.query A valid label query expression.
     * @param {integer=} params.maxResults Maximum number of topics to return.
     * @param {string=} params.pageToken The value obtained in the last <code>ListTopicsResponse</code> for continuation.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/topics',
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
     * pubsub.topics.get
     *
     * @desc Gets the configuration of a topic. Since the topic only has the name attribute, this method is only useful to check the existence of a topic. If other attributes are added in the future, they will be returned here.
     *
     * @alias pubsub.topics.get
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string} params.topic The name of the topic to get.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/topics/{topic}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['topic'],
        pathParams: ['topic'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * pubsub.topics.publishBatch
     *
     * @desc Adds one or more messages to the topic. Returns NOT_FOUND if the topic does not exist.
     *
     * @alias pubsub.topics.publishBatch
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).PublishBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    publishBatch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://pubsub.googleapis.com/v1beta1a/topics/publishBatch',
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
     * pubsub.topics.create
     *
     * @desc Creates the given topic with the given name.
     *
     * @alias pubsub.topics.create
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {pubsub(v1beta1a).Topic} params.resource Request body data
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
          url: 'https://pubsub.googleapis.com/v1beta1a/topics',
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
     * pubsub.topics.delete
     *
     * @desc Deletes the topic with the given name. Returns NOT_FOUND if the topic does not exist. After a topic is deleted, a new topic may be created with the same name.
     *
     * @alias pubsub.topics.delete
     * @memberOf! pubsub(v1beta1a)
     *
     * @param {object} params Parameters for request
     * @param {string} params.topic Name of the topic to delete.
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
          url: 'https://pubsub.googleapis.com/v1beta1a/topics/{topic}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['topic'],
        pathParams: ['topic'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef PullBatchResponse
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {pubsub(v1beta1a).PullResponse[]} pullResponses Received Pub/Sub messages or status events. The Pub/Sub system will return
zero messages if there are no more messages available in the backlog. The
Pub/Sub system may return fewer than the max_events requested even if
there are more messages available in the backlog.
*/
/**
 * @typedef Topic
 * @memberOf! pubsub(v1beta1a)
 * @type object
 * @property {string} name Name of the topic.
 */
/**
 * @typedef PublishBatchResponse
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string[]} messageIds The server-assigned ID of each published message, in the same order as
the messages in the request. IDs are guaranteed to be unique within
the topic.
*/
/**
 * @typedef PublishRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
 * @property {string} topic The message in the request will be published on this topic.
 * @property {pubsub(v1beta1a).PubsubMessage} message The message to publish.
 */
/**
 * @typedef ListSubscriptionsResponse
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string} nextPageToken If not empty, indicates that there are more subscriptions that match the
request and this value should be passed to the next
&lt;code&gt;ListSubscriptionsRequest&lt;/code&gt; to continue.
* @property {pubsub(v1beta1a).Subscription[]} subscription The subscriptions that match the request.
*/
/**
 * @typedef Subscription
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {pubsub(v1beta1a).PushConfig} pushConfig If push delivery is used with this subscription, this field is
used to configure it.
* @property {string} topic The name of the topic from which this subscription is receiving messages.
* @property {integer} ackDeadlineSeconds For either push or pull delivery, the value is the maximum time after a
subscriber receives a message before the subscriber should acknowledge or
Nack the message. If the Ack deadline for a message passes without an
Ack or a Nack, the Pub/Sub system will eventually redeliver the message.
If a subscriber acknowledges after the deadline, the Pub/Sub system may
accept the Ack, but it is possible that the message has been already
delivered again. Multiple Acks to the message are allowed and will
succeed.

For push delivery, this value is used to set the request timeout for
the call to the push endpoint.

For pull delivery, this value is used as the initial value for the Ack
deadline. It may be overridden for each message using its corresponding
ack_id with &lt;code&gt;ModifyAckDeadline&lt;/code&gt;.
While a message is outstanding (i.e. it has been delivered to a pull
subscriber and the subscriber has not yet Acked or Nacked), the Pub/Sub
system will not deliver that message to another pull subscriber
(on a best-effort basis).
* @property {string} name Name of the subscription.
*/
/**
 * @typedef Label
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string} strValue A string value.
* @property {string} key The key of a label is a syntactically valid URL (as per RFC 1738) with
the &quot;scheme&quot; and initial slashes omitted and with the additional
restrictions noted below.  Each key should be globally unique.  The
&quot;host&quot; portion is called the &quot;namespace&quot; and is not necessarily
resolvable to a network endpoint.  Instead, the namespace indicates what
system or entity defines the semantics of the label.  Namespaces do not
restrict the set of objects to which a label may be associated.

Keys are defined by the following grammar:

  key          = hostname &quot;/&quot; kpath
  kpath        = ksegment *[ &quot;/&quot; ksegment ]
  ksegment     = alphadigit | *[ alphadigit | &quot;-&quot; | &quot;_&quot; | &quot;.&quot; ]

where &quot;hostname&quot; and &quot;alphadigit&quot; are defined as in RFC 1738.

Example key:
  spanner.google.com/universe
* @property {string} numValue An integer value.
*/
/**
 * @typedef ModifyAckDeadlineRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {integer} ackDeadlineSeconds The new ack deadline with respect to the time this request was sent to the
Pub/Sub system. Must be &gt;= 0. For example, if the value is 10, the new ack
deadline will expire 10 seconds after the ModifyAckDeadline call was made.
Specifying zero may immediately make the message available for another pull
request.
* @property {string} ackId The acknowledgment ID. Either this or ack_ids must be populated,
not both.
* @property {string} subscription Next Index: 5
The name of the subscription from which messages are being pulled.
* @property {string[]} ackIds List of acknowledgment IDs. Either this field or ack_id
should be populated, not both.
*/
/**
 * @typedef PushConfig
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string} pushEndpoint A URL locating the endpoint to which messages should be pushed.
For example, a Webhook endpoint might use &quot;https://example.com/push&quot;.
*/
/**
 * @typedef PullRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {boolean} returnImmediately If this is specified as true the system will respond immediately even if
it is not able to return a message in the Pull response. Otherwise the
system is allowed to wait until at least one message is available rather
than returning FAILED_PRECONDITION. The client may cancel the request if
it does not wish to wait any longer for the response.
* @property {string} subscription The subscription from which a message should be pulled.
*/
/**
 * @typedef ModifyPushConfigRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {pubsub(v1beta1a).PushConfig} pushConfig An empty &lt;code&gt;push_config&lt;/code&gt; indicates that the Pub/Sub system should
pause pushing messages from the given subscription.
* @property {string} subscription The name of the subscription.
*/
/**
 * @typedef PullResponse
 * @memberOf! pubsub(v1beta1a)
 * @type object
 * @property {pubsub(v1beta1a).PubsubEvent} pubsubEvent A pubsub message or truncation event.
 * @property {string} ackId This ID must be used to acknowledge the received event or message.
 */
/**
 * @typedef PubsubMessage
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string} data The message payload.
* @property {string} messageId ID of this message assigned by the server at publication time. Guaranteed
to be unique within the topic. This value may be read by a subscriber
that receives a PubsubMessage via a Pull call or a push delivery. It must
not be populated by a publisher in a Publish call.
* @property {string} publishTime The time at which the message was published.
The time is milliseconds since the UNIX epoch.
* @property {pubsub(v1beta1a).Label[]} label Optional list of labels for this message. Keys in this collection must
be unique.
*/
/**
 * @typedef PublishBatchRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
 * @property {string} topic The messages in the request will be published on this topic.
 * @property {pubsub(v1beta1a).PubsubMessage[]} messages The messages to publish.
 */
/**
 * @typedef AcknowledgeRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {string[]} ackId The acknowledgment ID for the message being acknowledged. This was
returned by the Pub/Sub system in the Pull response.
* @property {string} subscription The subscription whose message is being acknowledged.
*/
/**
 * @typedef Empty
 * @memberOf! pubsub(v1beta1a)
 * @type object
 */
/**
 * @typedef ListTopicsResponse
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {pubsub(v1beta1a).Topic[]} topic The resulting topics.
* @property {string} nextPageToken If not empty, indicates that there are more topics that match the request,
and this value should be passed to the next &lt;code&gt;ListTopicsRequest&lt;/code&gt;
to continue.
*/
/**
 * @typedef PubsubEvent
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {boolean} truncated Indicates that this subscription has been truncated.
* @property {boolean} deleted Indicates that this subscription has been deleted. (Note that pull
subscribers will always receive NOT_FOUND in response in their pull
request on the subscription, rather than seeing this boolean.)
* @property {string} subscription The subscription that received the event.
* @property {pubsub(v1beta1a).PubsubMessage} message A received message.
*/
/**
 * @typedef PullBatchRequest
 * @memberOf! pubsub(v1beta1a)
 * @type object
* @property {integer} maxEvents The maximum number of PubsubEvents returned for this request. The Pub/Sub
system may return fewer than the number of events specified.
* @property {boolean} returnImmediately If this is specified as true the system will respond immediately even if
it is not able to return a message in the Pull response. Otherwise the
system is allowed to wait until at least one message is available rather
than returning no messages. The client may cancel the request if it does
not wish to wait any longer for the response.
* @property {string} subscription The subscription from which messages should be pulled.
*/
module.exports = Pubsub;
