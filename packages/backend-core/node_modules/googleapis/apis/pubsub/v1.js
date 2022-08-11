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
 * var pubsub = google.pubsub('v1');
 *
 * @namespace pubsub
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Pubsub
 */
function Pubsub(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    subscriptions: {

      /**
       * pubsub.projects.subscriptions.modifyPushConfig
       *
       * @desc Modifies the `PushConfig` for a specified subscription.  This may be used to change a push subscription to a pull one (signified by an empty `PushConfig`) or vice versa, or change the endpoint URL and other attributes of a push subscription. Messages will accumulate for delivery continuously through the call regardless of changes to the `PushConfig`.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'modifyPushConfig' method:
       *
       *     // * The name of the subscription.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.modifyPushConfig(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.modifyPushConfig
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.
       * @param {pubsub(v1).ModifyPushConfigRequest} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}:modifyPushConfig',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['subscription'],
          pathParams: ['subscription'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.getIamPolicy
       *
       * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'getIamPolicy' method:
       *
       *     // * REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as
       *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
       *     //   in this value is resource specific and is specified in the `getIamPolicy` documentation.
       *     resource_: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.getIamPolicy(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.getIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:getIamPolicy',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.pull
       *
       * @desc Pulls messages from the server. Returns an empty list if there are no messages available in the backlog. The server may return `UNAVAILABLE` if there are too many concurrent pull requests pending for the given subscription.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'pull' method:
       *
       *     // * The subscription from which messages should be pulled.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.pull(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.pull
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The subscription from which messages should be pulled. Format is `projects/{project}/subscriptions/{sub}`.
       * @param {pubsub(v1).PullRequest} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}:pull',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['subscription'],
          pathParams: ['subscription'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.list
       *
       * @desc Lists matching subscriptions.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
       *
       *     // * The name of the cloud project that subscriptions belong to.
       *     project: "projects/{MY-PROJECT}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *
       *   var recur = function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *       if (result.nextPageToken) {
       *         request.pageToken = result.nextPageToken;
       *         pubsub.projects.subscriptions.list(request, recur);
       *       }
       *     }
       *   };
       *
       *   pubsub.projects.subscriptions.list(request, recur);
       * });
       *
       * @alias pubsub.projects.subscriptions.list
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Maximum number of subscriptions to return.
       * @param {string} params.project The name of the cloud project that subscriptions belong to. Format is `projects/{project}`.
       * @param {string=} params.pageToken The value returned by the last `ListSubscriptionsResponse`; indicates that this is a continuation of a prior `ListSubscriptions` call, and that the system should return the next page of data.
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
            url: 'https://pubsub.googleapis.com/v1/{project}/subscriptions',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['project'],
          pathParams: ['project'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.get
       *
       * @desc Gets the configuration details of a subscription.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
       *
       *     // * The name of the subscription to get.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.get(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.get
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The name of the subscription to get. Format is `projects/{project}/subscriptions/{sub}`.
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}',
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
       * pubsub.projects.subscriptions.create
       *
       * @desc Creates a subscription to a given topic. If the subscription already exists, returns `ALREADY_EXISTS`. If the corresponding topic doesn't exist, returns `NOT_FOUND`.  If the name is not provided in the request, the server will assign a random name for this subscription on the same project as the topic, conforming to the [resource name format](https://cloud.google.com/pubsub/docs/overview#names). The generated name is populated in the returned Subscription object. Note that for REST API requests, you must specify a name in the request.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'create' method:
       *
       *     // * The name of the subscription. It must have the format
       *     //   `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter,
       *     //   and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods
       *     //   (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in
       *     //   length, and it must not start with `"goog"`.
       *     name: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.create(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.create
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the subscription. It must have the format `"projects/{project}/subscriptions/{subscription}"`. `{subscription}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.
       * @param {pubsub(v1).Subscription} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{name}',
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
       * pubsub.projects.subscriptions.modifyAckDeadline
       *
       * @desc Modifies the ack deadline for a specific message. This method is useful to indicate that more time is needed to process a message by the subscriber, or to make the message available for redelivery if the processing was interrupted. Note that this does not modify the subscription-level `ackDeadlineSeconds` used for subsequent messages.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'modifyAckDeadline' method:
       *
       *     // * The name of the subscription.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.modifyAckDeadline(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.modifyAckDeadline
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The name of the subscription. Format is `projects/{project}/subscriptions/{sub}`.
       * @param {pubsub(v1).ModifyAckDeadlineRequest} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}:modifyAckDeadline',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['subscription'],
          pathParams: ['subscription'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.setIamPolicy
       *
       * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'setIamPolicy' method:
       *
       *     // * REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as
       *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
       *     //   in this value is resource specific and is specified in the `setIamPolicy` documentation.
       *     resource_: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.setIamPolicy(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.setIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).SetIamPolicyRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      setIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:setIamPolicy',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.delete
       *
       * @desc Deletes an existing subscription. All messages retained in the subscription are immediately dropped. Calls to `Pull` after deletion will return `NOT_FOUND`. After a subscription is deleted, a new one may be created with the same name, but the new one has no association with the old subscription or its topic unless the same topic is specified.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'delete' method:
       *
       *     // * The subscription to delete.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.delete
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The subscription to delete. Format is `projects/{project}/subscriptions/{sub}`.
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}',
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
       * pubsub.projects.subscriptions.testIamPermissions
       *
       * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'testIamPermissions' method:
       *
       *     // * REQUIRED: The resource for which the policy detail is being requested. `resource` is usually
       *     //   specified as a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the
       *     //   path specified in this value is resource specific and is specified in the `testIamPermissions`
       *     //   documentation.
       *     resource_: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.testIamPermissions(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.testIamPermissions
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).TestIamPermissionsRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      testIamPermissions: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:testIamPermissions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.subscriptions.acknowledge
       *
       * @desc Acknowledges the messages associated with the `ack_ids` in the `AcknowledgeRequest`. The Pub/Sub system can remove the relevant messages from the subscription.  Acknowledging a message whose ack deadline has expired may succeed, but such a message may be redelivered later. Acknowledging a message more than once will not result in an error.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'acknowledge' method:
       *
       *     // * The subscription whose message is being acknowledged.
       *     subscription: "projects/{MY-PROJECT}/subscriptions/{MY-SUBSCRIPTION}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.subscriptions.acknowledge(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.subscriptions.acknowledge
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.subscription The subscription whose message is being acknowledged. Format is `projects/{project}/subscriptions/{sub}`.
       * @param {pubsub(v1).AcknowledgeRequest} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{subscription}:acknowledge',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['subscription'],
          pathParams: ['subscription'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    topics: {

      /**
       * pubsub.projects.topics.getIamPolicy
       *
       * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'getIamPolicy' method:
       *
       *     // * REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as
       *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
       *     //   in this value is resource specific and is specified in the `getIamPolicy` documentation.
       *     resource_: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.getIamPolicy(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.getIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:getIamPolicy',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.topics.publish
       *
       * @desc Adds one or more messages to the topic. Returns `NOT_FOUND` if the topic does not exist. The message payload must not be empty; it must contain  either a non-empty data field, or at least one attribute.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'publish' method:
       *
       *     // * The messages in the request will be published on this topic.
       *     topic: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.publish(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.publish
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.topic The messages in the request will be published on this topic. Format is `projects/{project}/topics/{topic}`.
       * @param {pubsub(v1).PublishRequest} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{topic}:publish',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['topic'],
          pathParams: ['topic'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.topics.list
       *
       * @desc Lists matching topics.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
       *
       *     // * The name of the cloud project that topics belong to.
       *     project: "projects/{MY-PROJECT}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *
       *   var recur = function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *       if (result.nextPageToken) {
       *         request.pageToken = result.nextPageToken;
       *         pubsub.projects.topics.list(request, recur);
       *       }
       *     }
       *   };
       *
       *   pubsub.projects.topics.list(request, recur);
       * });
       *
       * @alias pubsub.projects.topics.list
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize Maximum number of topics to return.
       * @param {string} params.project The name of the cloud project that topics belong to. Format is `projects/{project}`.
       * @param {string=} params.pageToken The value returned by the last `ListTopicsResponse`; indicates that this is a continuation of a prior `ListTopics` call, and that the system should return the next page of data.
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
            url: 'https://pubsub.googleapis.com/v1/{project}/topics',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['project'],
          pathParams: ['project'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.topics.get
       *
       * @desc Gets the configuration of a topic.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'get' method:
       *
       *     // * The name of the topic to get.
       *     topic: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.get(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.get
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.topic The name of the topic to get. Format is `projects/{project}/topics/{topic}`.
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
            url: 'https://pubsub.googleapis.com/v1/{topic}',
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
       * pubsub.projects.topics.create
       *
       * @desc Creates the given topic with the given name.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'create' method:
       *
       *     // * The name of the topic. It must have the format `"projects/{project}/topics/{topic}"`. `{topic}`
       *     //   must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`),
       *     //   underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be
       *     //   between 3 and 255 characters in length, and it must not start with `"goog"`.
       *     name: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.create(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.create
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name The name of the topic. It must have the format `"projects/{project}/topics/{topic}"`. `{topic}` must start with a letter, and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters in length, and it must not start with `"goog"`.
       * @param {pubsub(v1).Topic} params.resource Request body data
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
            url: 'https://pubsub.googleapis.com/v1/{name}',
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
       * pubsub.projects.topics.setIamPolicy
       *
       * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'setIamPolicy' method:
       *
       *     // * REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as
       *     //   a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the path specified
       *     //   in this value is resource specific and is specified in the `setIamPolicy` documentation.
       *     resource_: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.setIamPolicy(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.setIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).SetIamPolicyRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      setIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:setIamPolicy',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.topics.delete
       *
       * @desc Deletes the topic with the given name. Returns `NOT_FOUND` if the topic does not exist. After a topic is deleted, a new topic may be created with the same name; this is an entirely new topic with none of the old configuration or subscriptions. Existing subscriptions to this topic are not deleted, but their `topic` field is set to `_deleted-topic_`.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'delete' method:
       *
       *     // * Name of the topic to delete.
       *     topic: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.delete(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.delete
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.topic Name of the topic to delete. Format is `projects/{project}/topics/{topic}`.
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
            url: 'https://pubsub.googleapis.com/v1/{topic}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['topic'],
          pathParams: ['topic'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.topics.testIamPermissions
       *
       * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
       *
       * @example
       * // BEFORE RUNNING:
       * // ---------------
       * // 1. If not already done, enable the Google Cloud Pub/Sub API
       * //    and check the quota for your project at
       * //    https://console.developers.google.com/apis/api/pubsub
       * // 2. This sample uses Application Default Credentials for authentication.
       * //    If not already done, install the gcloud CLI from
       * //    https://cloud.google.com/sdk/ and run
       * //    'gcloud beta auth application-default login'
       * // 3. Install the Node.js client library and Application Default Credentials
       * //    library by running 'npm install googleapis --save'
       * var google = require('googleapis');
       * var pubsub = google.pubsub('v1');
       *
       * google.auth.getApplicationDefault(function(err, authClient) {
       *   if (err) {
       *     console.log('Authentication failed because of ', err);
       *     return;
       *   }
       *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
       *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
       *     authClient = authClient.createScoped(scopes);
       *   }
       *
       *   var request = {
       *     // TODO: Change placeholders below to appropriate parameter values for the 'testIamPermissions' method:
       *
       *     // * REQUIRED: The resource for which the policy detail is being requested. `resource` is usually
       *     //   specified as a path, such as `projects/<project>/zones/<zone>/disks/<disk>`. The format for the
       *     //   path specified in this value is resource specific and is specified in the `testIamPermissions`
       *     //   documentation.
       *     resource_: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
       *
       *     resource: {},
       *
       *     // Auth client
       *     auth: authClient
       *   };
       *
       *   pubsub.projects.topics.testIamPermissions(request, function(err, result) {
       *     if (err) {
       *       console.log(err);
       *     } else {
       *       console.log(result);
       *     }
       *   });
       * });
       *
       * @alias pubsub.projects.topics.testIamPermissions
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).TestIamPermissionsRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      testIamPermissions: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:testIamPermissions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      subscriptions: {

        /**
         * pubsub.projects.topics.subscriptions.list
         *
         * @desc Lists the name of the subscriptions for this topic.
         *
         * @example
         * // BEFORE RUNNING:
         * // ---------------
         * // 1. If not already done, enable the Google Cloud Pub/Sub API
         * //    and check the quota for your project at
         * //    https://console.developers.google.com/apis/api/pubsub
         * // 2. This sample uses Application Default Credentials for authentication.
         * //    If not already done, install the gcloud CLI from
         * //    https://cloud.google.com/sdk/ and run
         * //    'gcloud beta auth application-default login'
         * // 3. Install the Node.js client library and Application Default Credentials
         * //    library by running 'npm install googleapis --save'
         * var google = require('googleapis');
         * var pubsub = google.pubsub('v1');
         *
         * google.auth.getApplicationDefault(function(err, authClient) {
         *   if (err) {
         *     console.log('Authentication failed because of ', err);
         *     return;
         *   }
         *   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
         *     var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
         *     authClient = authClient.createScoped(scopes);
         *   }
         *
         *   var request = {
         *     // TODO: Change placeholders below to appropriate parameter values for the 'list' method:
         *
         *     // * The name of the topic that subscriptions are attached to.
         *     topic: "projects/{MY-PROJECT}/topics/{MY-TOPIC}",
         *
         *     // Auth client
         *     auth: authClient
         *   };
         *
         *
         *   var recur = function(err, result) {
         *     if (err) {
         *       console.log(err);
         *     } else {
         *       console.log(result);
         *       if (result.nextPageToken) {
         *         request.pageToken = result.nextPageToken;
         *         pubsub.projects.topics.subscriptions.list(request, recur);
         *       }
         *     }
         *   };
         *
         *   pubsub.projects.topics.subscriptions.list(request, recur);
         * });
         *
         * @alias pubsub.projects.topics.subscriptions.list
         * @memberOf! pubsub(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.topic The name of the topic that subscriptions are attached to. Format is `projects/{project}/topics/{topic}`.
         * @param {integer=} params.pageSize Maximum number of subscription names to return.
         * @param {string=} params.pageToken The value returned by the last `ListTopicSubscriptionsResponse`; indicates that this is a continuation of a prior `ListTopicSubscriptions` call, and that the system should return the next page of data.
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
              url: 'https://pubsub.googleapis.com/v1/{topic}/subscriptions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['topic'],
            pathParams: ['topic'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    snapshots: {

      /**
       * pubsub.projects.snapshots.testIamPermissions
       *
       * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
       *
       * @alias pubsub.projects.snapshots.testIamPermissions
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).TestIamPermissionsRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      testIamPermissions: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:testIamPermissions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.snapshots.setIamPolicy
       *
       * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
       *
       * @alias pubsub.projects.snapshots.setIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {pubsub(v1).SetIamPolicyRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      setIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:setIamPolicy',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * pubsub.projects.snapshots.getIamPolicy
       *
       * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
       *
       * @alias pubsub.projects.snapshots.getIamPolicy
       * @memberOf! pubsub(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getIamPolicy: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://pubsub.googleapis.com/v1/{resource}:getIamPolicy',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['resource'],
          pathParams: ['resource'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Topic
 * @memberOf! pubsub(v1)
 * @type object
* @property {string} name The name of the topic. It must have the format
`&quot;projects/{project}/topics/{topic}&quot;`. `{topic}` must start with a letter,
and contain only letters (`[A-Za-z]`), numbers (`[0-9]`), dashes (`-`),
underscores (`_`), periods (`.`), tildes (`~`), plus (`+`) or percent
signs (`%`). It must be between 3 and 255 characters in length, and it
must not start with `&quot;goog&quot;`.
*/
/**
 * @typedef SetIamPolicyRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).Policy} policy REQUIRED: The complete policy to be applied to the `resource`. The size of
the policy is limited to a few 10s of KB. An empty policy is a
valid policy but certain Cloud Platform services (such as Projects)
might reject them.
*/
/**
 * @typedef ReceivedMessage
 * @memberOf! pubsub(v1)
 * @type object
 * @property {string} ackId This ID can be used to acknowledge the received message.
 * @property {pubsub(v1).PubsubMessage} message The message.
 */
/**
 * @typedef PublishRequest
 * @memberOf! pubsub(v1)
 * @type object
 * @property {pubsub(v1).PubsubMessage[]} messages The messages to publish.
 */
/**
 * @typedef TestIamPermissionsResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is
allowed.
*/
/**
 * @typedef PublishResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} messageIds The server-assigned ID of each published message, in the same order as
the messages in the request. IDs are guaranteed to be unique within
the topic.
*/
/**
 * @typedef ListSubscriptionsResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).Subscription[]} subscriptions The subscriptions that match the request.
* @property {string} nextPageToken If not empty, indicates that there may be more subscriptions that match
the request; this value should be passed in a new
`ListSubscriptionsRequest` to get more subscriptions.
*/
/**
 * @typedef Policy
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).Binding[]} bindings Associates a list of `members` to a `role`.
Multiple `bindings` must not be specified for the same `role`.
`bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help
prevent simultaneous updates of a policy from overwriting each other.
It is strongly suggested that systems make use of the `etag` in the
read-modify-write cycle to perform policy updates in order to avoid race
conditions: An `etag` is returned in the response to `getIamPolicy`, and
systems are expected to put that etag in the request to `setIamPolicy` to
ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing
policy is overwritten blindly.
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef ListTopicSubscriptionsResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} subscriptions The names of the subscriptions that match the request.
* @property {string} nextPageToken If not empty, indicates that there may be more subscriptions that match
the request; this value should be passed in a new
`ListTopicSubscriptionsRequest` to get more subscriptions.
*/
/**
 * @typedef Subscription
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).PushConfig} pushConfig If push delivery is used with this subscription, this field is
used to configure it. An empty `pushConfig` signifies that the subscriber
will pull and ack messages using API methods.
* @property {string} topic The name of the topic from which this subscription is receiving messages.
Format is `projects/{project}/topics/{topic}`.
The value of this field will be `_deleted-topic_` if the topic has been
deleted.
* @property {integer} ackDeadlineSeconds This value is the maximum time after a subscriber receives a message
before the subscriber should acknowledge the message. After message
delivery but before the ack deadline expires and before the message is
acknowledged, it is an outstanding message and will not be delivered
again during that time (on a best-effort basis).

For pull subscriptions, this value is used as the initial value for the ack
deadline. To override this value for a given message, call
`ModifyAckDeadline` with the corresponding `ack_id` if using
pull.
The minimum custom deadline you can specify is 10 seconds.
The maximum custom deadline you can specify is 600 seconds (10 minutes).
If this parameter is 0, a default value of 10 seconds is used.

For push delivery, this value is also used to set the request timeout for
the call to the push endpoint.

If the subscriber never acknowledges the message, the Pub/Sub
system will eventually redeliver the message.
* @property {string} name The name of the subscription. It must have the format
`&quot;projects/{project}/subscriptions/{subscription}&quot;`. `{subscription}` must
start with a letter, and contain only letters (`[A-Za-z]`), numbers
(`[0-9]`), dashes (`-`), underscores (`_`), periods (`.`), tildes (`~`),
plus (`+`) or percent signs (`%`). It must be between 3 and 255 characters
in length, and it must not start with `&quot;goog&quot;`.
*/
/**
 * @typedef ModifyAckDeadlineRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {integer} ackDeadlineSeconds The new ack deadline with respect to the time this request was sent to
the Pub/Sub system. For example, if the value is 10, the new
ack deadline will expire 10 seconds after the `ModifyAckDeadline` call
was made. Specifying zero may immediately make the message available for
another pull request.
The minimum deadline you can specify is 0 seconds.
The maximum deadline you can specify is 600 seconds (10 minutes).
* @property {string[]} ackIds List of acknowledgment IDs.
*/
/**
 * @typedef TestIamPermissionsRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} permissions The set of permissions to check for the `resource`. Permissions with
wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more
information see
[IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
*/
/**
 * @typedef PushConfig
 * @memberOf! pubsub(v1)
 * @type object
* @property {object} attributes Endpoint configuration attributes.

Every endpoint has a set of API supported attributes that can be used to
control different aspects of the message delivery.

The currently supported attribute is `x-goog-version`, which you can
use to change the format of the push message. This attribute
indicates the version of the data expected by the endpoint. This
controls the shape of the envelope (i.e. its fields and metadata).
The endpoint version is based on the version of the Pub/Sub
API.

If not present during the `CreateSubscription` call, it will default to
the version of the API used to make such call. If not present during a
`ModifyPushConfig` call, its value will not be changed. `GetSubscription`
calls will always return a valid version, even if the subscription was
created without this attribute.

The possible values for this attribute are:

* `v1beta1`: uses the push format defined in the v1beta1 Pub/Sub API.
* `v1` or `v1beta2`: uses the push format defined in the v1 Pub/Sub API.
* @property {string} pushEndpoint A URL locating the endpoint to which messages should be pushed.
For example, a Webhook endpoint might use &quot;https://example.com/push&quot;.
*/
/**
 * @typedef PullRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {boolean} returnImmediately If this field set to true, the system will respond immediately even if
it there are no messages available to return in the `Pull` response.
Otherwise, the system may wait (for a bounded amount of time) until at
least one message is available, rather than returning no messages. The
client may cancel the request if it does not wish to wait any longer for
the response.
* @property {integer} maxMessages The maximum number of messages returned for this request. The Pub/Sub
system may return fewer than the number specified.
*/
/**
 * @typedef ModifyPushConfigRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).PushConfig} pushConfig The push configuration for future deliveries.

An empty `pushConfig` indicates that the Pub/Sub system should
stop pushing messages from the given subscription and allow
messages to be pulled and acknowledged - effectively pausing
the subscription if `Pull` is not called.
*/
/**
 * @typedef PullResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {pubsub(v1).ReceivedMessage[]} receivedMessages Received Pub/Sub messages. The Pub/Sub system will return zero messages if
there are no more available in the backlog. The Pub/Sub system may return
fewer than the `maxMessages` requested even if there are more messages
available in the backlog.
*/
/**
 * @typedef PubsubMessage
 * @memberOf! pubsub(v1)
 * @type object
* @property {string} data The message payload.
* @property {object} attributes Optional attributes for this message.
* @property {string} messageId ID of this message, assigned by the server when the message is published.
Guaranteed to be unique within the topic. This value may be read by a
subscriber that receives a `PubsubMessage` via a `Pull` call or a push
delivery. It must not be populated by the publisher in a `Publish` call.
* @property {string} publishTime The time at which the message was published, populated by the server when
it receives the `Publish` call. It must not be populated by the
publisher in a `Publish` call.
*/
/**
 * @typedef AcknowledgeRequest
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} ackIds The acknowledgment ID for the messages being acknowledged that was returned
by the Pub/Sub system in the `Pull` response. Must not be empty.
*/
/**
 * @typedef Empty
 * @memberOf! pubsub(v1)
 * @type object
 */
/**
 * @typedef ListTopicsResponse
 * @memberOf! pubsub(v1)
 * @type object
* @property {string} nextPageToken If not empty, indicates that there may be more topics that match the
request; this value should be passed in a new `ListTopicsRequest`.
* @property {pubsub(v1).Topic[]} topics The resulting topics.
*/
/**
 * @typedef Binding
 * @memberOf! pubsub(v1)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource.
`members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is
   on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone
   who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google
   account. For example, `alice@gmail.com` or `joe@example.com`.


* `serviceAccount:{emailid}`: An email address that represents a service
   account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group.
   For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the
   users of that domain. For example, `google.com` or `example.com`.


* @property {string} role Role that is assigned to `members`.
For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
Required
*/
module.exports = Pubsub;
