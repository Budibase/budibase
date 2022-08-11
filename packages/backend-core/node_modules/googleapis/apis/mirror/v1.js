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
 * Google Mirror API
 *
 * Interacts with Glass users via the timeline.
 *
 * @example
 * var google = require('googleapis');
 * var mirror = google.mirror('v1');
 *
 * @namespace mirror
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Mirror
 */
function Mirror(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * mirror.accounts.insert
     *
     * @desc Inserts a new account for a user
     *
     * @alias mirror.accounts.insert
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountName The name of the account to be passed to the Android Account Manager.
     * @param {string} params.accountType Account type to be passed to Android Account Manager.
     * @param {string} params.userToken The ID for the user.
     * @param {mirror(v1).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/accounts/{userToken}/{accountType}/{accountName}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userToken', 'accountType', 'accountName'],
        pathParams: ['accountName', 'accountType', 'userToken'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.contacts = {

    /**
     * mirror.contacts.delete
     *
     * @desc Deletes a contact.
     *
     * @alias mirror.contacts.delete
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the contact.
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
          url: 'https://www.googleapis.com/mirror/v1/contacts/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.contacts.get
     *
     * @desc Gets a single contact by ID.
     *
     * @alias mirror.contacts.get
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the contact.
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
          url: 'https://www.googleapis.com/mirror/v1/contacts/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.contacts.insert
     *
     * @desc Inserts a new contact.
     *
     * @alias mirror.contacts.insert
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {mirror(v1).Contact} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/contacts',
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
     * mirror.contacts.list
     *
     * @desc Retrieves a list of contacts for the authenticated user.
     *
     * @alias mirror.contacts.list
     * @memberOf! mirror(v1)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/mirror/v1/contacts',
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
     * mirror.contacts.patch
     *
     * @desc Updates a contact in place. This method supports patch semantics.
     *
     * @alias mirror.contacts.patch
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the contact.
     * @param {mirror(v1).Contact} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/contacts/{id}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.contacts.update
     *
     * @desc Updates a contact in place.
     *
     * @alias mirror.contacts.update
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the contact.
     * @param {mirror(v1).Contact} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/contacts/{id}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.locations = {

    /**
     * mirror.locations.get
     *
     * @desc Gets a single location by ID.
     *
     * @alias mirror.locations.get
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the location or latest for the last known location.
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
          url: 'https://www.googleapis.com/mirror/v1/locations/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.locations.list
     *
     * @desc Retrieves a list of locations for the user.
     *
     * @alias mirror.locations.list
     * @memberOf! mirror(v1)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/mirror/v1/locations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.settings = {

    /**
     * mirror.settings.get
     *
     * @desc Gets a single setting by ID.
     *
     * @alias mirror.settings.get
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the setting. The following IDs are valid:  - locale - The key to the user’s language/locale (BCP 47 identifier) that Glassware should use to render localized content.  - timezone - The key to the user’s current time zone region as defined in the tz database. Example: America/Los_Angeles.
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
          url: 'https://www.googleapis.com/mirror/v1/settings/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.subscriptions = {

    /**
     * mirror.subscriptions.delete
     *
     * @desc Deletes a subscription.
     *
     * @alias mirror.subscriptions.delete
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the subscription.
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
          url: 'https://www.googleapis.com/mirror/v1/subscriptions/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.subscriptions.insert
     *
     * @desc Creates a new subscription.
     *
     * @alias mirror.subscriptions.insert
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {mirror(v1).Subscription} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/subscriptions',
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
     * mirror.subscriptions.list
     *
     * @desc Retrieves a list of subscriptions for the authenticated user and service.
     *
     * @alias mirror.subscriptions.list
     * @memberOf! mirror(v1)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/mirror/v1/subscriptions',
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
     * mirror.subscriptions.update
     *
     * @desc Updates an existing subscription in place.
     *
     * @alias mirror.subscriptions.update
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the subscription.
     * @param {mirror(v1).Subscription} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/subscriptions/{id}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.timeline = {

    /**
     * mirror.timeline.delete
     *
     * @desc Deletes a timeline item.
     *
     * @alias mirror.timeline.delete
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the timeline item.
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
          url: 'https://www.googleapis.com/mirror/v1/timeline/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.timeline.get
     *
     * @desc Gets a single timeline item by ID.
     *
     * @alias mirror.timeline.get
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the timeline item.
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
          url: 'https://www.googleapis.com/mirror/v1/timeline/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.timeline.insert
     *
     * @desc Inserts a new item into the timeline.
     *
     * @alias mirror.timeline.insert
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param  {object} params.resource Media resource metadata
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
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
          url: 'https://www.googleapis.com/mirror/v1/timeline',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/mirror/v1/timeline',
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.timeline.list
     *
     * @desc Retrieves a list of timeline items for the authenticated user.
     *
     * @alias mirror.timeline.list
     * @memberOf! mirror(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.bundleId If provided, only items with the given bundleId will be returned.
     * @param {boolean=} params.includeDeleted If true, tombstone records for deleted items will be returned.
     * @param {integer=} params.maxResults The maximum number of items to include in the response, used for paging.
     * @param {string=} params.orderBy Controls the order in which timeline items are returned.
     * @param {string=} params.pageToken Token for the page of results to return.
     * @param {boolean=} params.pinnedOnly If true, only pinned items will be returned.
     * @param {string=} params.sourceItemId If provided, only items with the given sourceItemId will be returned.
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
          url: 'https://www.googleapis.com/mirror/v1/timeline',
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
     * mirror.timeline.patch
     *
     * @desc Updates a timeline item in place. This method supports patch semantics.
     *
     * @alias mirror.timeline.patch
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the timeline item.
     * @param {mirror(v1).TimelineItem} params.resource Request body data
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
          url: 'https://www.googleapis.com/mirror/v1/timeline/{id}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * mirror.timeline.update
     *
     * @desc Updates a timeline item in place.
     *
     * @alias mirror.timeline.update
     * @memberOf! mirror(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the timeline item.
     * @param  {object} params.resource Media resource metadata
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
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
          url: 'https://www.googleapis.com/mirror/v1/timeline/{id}',
          method: 'PUT'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/mirror/v1/timeline/{id}',
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    attachments: {

      /**
       * mirror.timeline.attachments.delete
       *
       * @desc Deletes an attachment from a timeline item.
       *
       * @alias mirror.timeline.attachments.delete
       * @memberOf! mirror(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.attachmentId The ID of the attachment.
       * @param {string} params.itemId The ID of the timeline item the attachment belongs to.
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
            url: 'https://www.googleapis.com/mirror/v1/timeline/{itemId}/attachments/{attachmentId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['itemId', 'attachmentId'],
          pathParams: ['attachmentId', 'itemId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * mirror.timeline.attachments.get
       *
       * @desc Retrieves an attachment on a timeline item by item ID and attachment ID.
       *
       * @alias mirror.timeline.attachments.get
       * @memberOf! mirror(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.attachmentId The ID of the attachment.
       * @param {string} params.itemId The ID of the timeline item the attachment belongs to.
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
            url: 'https://www.googleapis.com/mirror/v1/timeline/{itemId}/attachments/{attachmentId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['itemId', 'attachmentId'],
          pathParams: ['attachmentId', 'itemId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * mirror.timeline.attachments.insert
       *
       * @desc Adds a new attachment to a timeline item.
       *
       * @alias mirror.timeline.attachments.insert
       * @memberOf! mirror(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.itemId The ID of the timeline item the attachment belongs to.
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
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
            url: 'https://www.googleapis.com/mirror/v1/timeline/{itemId}/attachments',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/mirror/v1/timeline/{itemId}/attachments',
          requiredParams: ['itemId'],
          pathParams: ['itemId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * mirror.timeline.attachments.list
       *
       * @desc Returns a list of attachments for a timeline item.
       *
       * @alias mirror.timeline.attachments.list
       * @memberOf! mirror(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.itemId The ID of the timeline item whose attachments should be listed.
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
            url: 'https://www.googleapis.com/mirror/v1/timeline/{itemId}/attachments',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['itemId'],
          pathParams: ['itemId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Account
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).AuthToken[]} authTokens 
 * @property {string[]} features 
 * @property {string} password 
 * @property {mirror(v1).UserData[]} userData 
 */
/**
 * @typedef Attachment
 * @memberOf! mirror(v1)
 * @type object
 * @property {string} contentType The MIME type of the attachment.
 * @property {string} contentUrl The URL for the content.
 * @property {string} id The ID of the attachment.
 * @property {boolean} isProcessingContent Indicates that the contentUrl is not available because the attachment content is still being processed. If the caller wishes to retrieve the content, it should try again later.
 */
/**
 * @typedef AttachmentsListResponse
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).Attachment[]} items The list of attachments.
 * @property {string} kind The type of resource. This is always mirror#attachmentsList.
 */
/**
 * @typedef AuthToken
 * @memberOf! mirror(v1)
 * @type object
 * @property {string} authToken 
 * @property {string} type 
 */
/**
 * @typedef Command
 * @memberOf! mirror(v1)
 * @type object
* @property {string} type The type of operation this command corresponds to. Allowed values are:  
- TAKE_A_NOTE - Shares a timeline item with the transcription of user speech from the &quot;Take a note&quot; voice menu command.  
- POST_AN_UPDATE - Shares a timeline item with the transcription of user speech from the &quot;Post an update&quot; voice menu command.
*/
/**
 * @typedef Contact
 * @memberOf! mirror(v1)
 * @type object
* @property {mirror(v1).Command[]} acceptCommands A list of voice menu commands that a contact can handle. Glass shows up to three contacts for each voice menu command. If there are more than that, the three contacts with the highest priority are shown for that particular command.
* @property {string[]} acceptTypes A list of MIME types that a contact supports. The contact will be shown to the user if any of its acceptTypes matches any of the types of the attachments on the item. If no acceptTypes are given, the contact will be shown for all items.
* @property {string} displayName The name to display for this contact.
* @property {string} id An ID for this contact. This is generated by the application and is treated as an opaque token.
* @property {string[]} imageUrls Set of image URLs to display for a contact. Most contacts will have a single image, but a &quot;group&quot; contact may include up to 8 image URLs and they will be resized and cropped into a mosaic on the client.
* @property {string} kind The type of resource. This is always mirror#contact.
* @property {string} phoneNumber Primary phone number for the contact. This can be a fully-qualified number, with country calling code and area code, or a local number.
* @property {integer} priority Priority for the contact to determine ordering in a list of contacts. Contacts with higher priorities will be shown before ones with lower priorities.
* @property {string[]} sharingFeatures A list of sharing features that a contact can handle. Allowed values are:  
- ADD_CAPTION
* @property {string} source The ID of the application that created this contact. This is populated by the API
* @property {string} speakableName Name of this contact as it should be pronounced. If this contact&#39;s name must be spoken as part of a voice disambiguation menu, this name is used as the expected pronunciation. This is useful for contact names with unpronounceable characters or whose display spelling is otherwise not phonetic.
* @property {string} type The type for this contact. This is used for sorting in UIs. Allowed values are:  
- INDIVIDUAL - Represents a single person. This is the default. 
- GROUP - Represents more than a single person.
*/
/**
 * @typedef ContactsListResponse
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).Contact[]} items Contact list.
 * @property {string} kind The type of resource. This is always mirror#contacts.
 */
/**
 * @typedef Location
 * @memberOf! mirror(v1)
 * @type object
 * @property {number} accuracy The accuracy of the location fix in meters.
 * @property {string} address The full address of the location.
 * @property {string} displayName The name to be displayed. This may be a business name or a user-defined place, such as &quot;Home&quot;.
 * @property {string} id The ID of the location.
 * @property {string} kind The type of resource. This is always mirror#location.
 * @property {number} latitude The latitude, in degrees.
 * @property {number} longitude The longitude, in degrees.
 * @property {string} timestamp The time at which this location was captured, formatted according to RFC 3339.
 */
/**
 * @typedef LocationsListResponse
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).Location[]} items The list of locations.
 * @property {string} kind The type of resource. This is always mirror#locationsList.
 */
/**
 * @typedef MenuItem
 * @memberOf! mirror(v1)
 * @type object
* @property {string} action Controls the behavior when the user picks the menu option. Allowed values are:  
- CUSTOM - Custom action set by the service. When the user selects this menuItem, the API triggers a notification to your callbackUrl with the userActions.type set to CUSTOM and the userActions.payload set to the ID of this menu item. This is the default value. 
- Built-in actions:  
- REPLY - Initiate a reply to the timeline item using the voice recording UI. The creator attribute must be set in the timeline item for this menu to be available. 
- REPLY_ALL - Same behavior as REPLY. The original timeline item&#39;s recipients will be added to the reply item. 
- DELETE - Delete the timeline item. 
- SHARE - Share the timeline item with the available contacts. 
- READ_ALOUD - Read the timeline item&#39;s speakableText aloud; if this field is not set, read the text field; if none of those fields are set, this menu item is ignored. 
- GET_MEDIA_INPUT - Allow users to provide media payloads to Glassware from a menu item (currently, only transcribed text from voice input is supported). Subscribe to notifications when users invoke this menu item to receive the timeline item ID. Retrieve the media from the timeline item in the payload property. 
- VOICE_CALL - Initiate a phone call using the timeline item&#39;s creator.phoneNumber attribute as recipient. 
- NAVIGATE - Navigate to the timeline item&#39;s location. 
- TOGGLE_PINNED - Toggle the isPinned state of the timeline item. 
- OPEN_URI - Open the payload of the menu item in the browser. 
- PLAY_VIDEO - Open the payload of the menu item in the Glass video player. 
- SEND_MESSAGE - Initiate sending a message to the timeline item&#39;s creator:  
- If the creator.phoneNumber is set and Glass is connected to an Android phone, the message is an SMS. 
- Otherwise, if the creator.email is set, the message is an email.
* @property {string} contextual_command The ContextualMenus.Command associated with this MenuItem (e.g. READ_ALOUD). The voice label for this command will be displayed in the voice menu and the touch label will be displayed in the touch menu. Note that the default menu value&#39;s display name will be overriden if you specify this property. Values that do not correspond to a ContextualMenus.Command name will be ignored.
* @property {string} id The ID for this menu item. This is generated by the application and is treated as an opaque token.
* @property {string} payload A generic payload whose meaning changes depending on this MenuItem&#39;s action.  
- When the action is OPEN_URI, the payload is the URL of the website to view. 
- When the action is PLAY_VIDEO, the payload is the streaming URL of the video 
- When the action is GET_MEDIA_INPUT, the payload is the text transcription of a user&#39;s speech input
* @property {boolean} removeWhenSelected If set to true on a CUSTOM menu item, that item will be removed from the menu after it is selected.
* @property {mirror(v1).MenuValue[]} values For CUSTOM items, a list of values controlling the appearance of the menu item in each of its states. A value for the DEFAULT state must be provided. If the PENDING or CONFIRMED states are missing, they will not be shown.
*/
/**
 * @typedef MenuValue
 * @memberOf! mirror(v1)
 * @type object
* @property {string} displayName The name to display for the menu item. If you specify this property for a built-in menu item, the default contextual voice command for that menu item is not shown.
* @property {string} iconUrl URL of an icon to display with the menu item.
* @property {string} state The state that this value applies to. Allowed values are:  
- DEFAULT - Default value shown when displayed in the menuItems list. 
- PENDING - Value shown when the menuItem has been selected by the user but can still be cancelled. 
- CONFIRMED - Value shown when the menuItem has been selected by the user and can no longer be cancelled.
*/
/**
 * @typedef Notification
 * @memberOf! mirror(v1)
 * @type object
 * @property {string} collection The collection that generated the notification.
 * @property {string} itemId The ID of the item that generated the notification.
 * @property {string} operation The type of operation that generated the notification.
 * @property {mirror(v1).UserAction[]} userActions A list of actions taken by the user that triggered the notification.
 * @property {string} userToken The user token provided by the service when it subscribed for notifications.
 * @property {string} verifyToken The secret verify token provided by the service when it subscribed for notifications.
 */
/**
 * @typedef NotificationConfig
 * @memberOf! mirror(v1)
 * @type object
* @property {string} deliveryTime The time at which the notification should be delivered.
* @property {string} level Describes how important the notification is. Allowed values are:  
- DEFAULT - Notifications of default importance. A chime will be played to alert users.
*/
/**
 * @typedef Setting
 * @memberOf! mirror(v1)
 * @type object
* @property {string} id The setting&#39;s ID. The following IDs are valid:  
- locale - The key to the user’s language/locale (BCP 47 identifier) that Glassware should use to render localized content.  
- timezone - The key to the user’s current time zone region as defined in the tz database. Example: America/Los_Angeles.
* @property {string} kind The type of resource. This is always mirror#setting.
* @property {string} value The setting value, as a string.
*/
/**
 * @typedef Subscription
 * @memberOf! mirror(v1)
 * @type object
* @property {string} callbackUrl The URL where notifications should be delivered (must start with https://).
* @property {string} collection The collection to subscribe to. Allowed values are:  
- timeline - Changes in the timeline including insertion, deletion, and updates. 
- locations - Location updates. 
- settings - Settings updates.
* @property {string} id The ID of the subscription.
* @property {string} kind The type of resource. This is always mirror#subscription.
* @property {mirror(v1).Notification} notification Container object for notifications. This is not populated in the Subscription resource.
* @property {string[]} operation A list of operations that should be subscribed to. An empty list indicates that all operations on the collection should be subscribed to. Allowed values are:  
- UPDATE - The item has been updated. 
- INSERT - A new item has been inserted. 
- DELETE - The item has been deleted. 
- MENU_ACTION - A custom menu item has been triggered by the user.
* @property {string} updated The time at which this subscription was last modified, formatted according to RFC 3339.
* @property {string} userToken An opaque token sent to the subscriber in notifications so that it can determine the ID of the user.
* @property {string} verifyToken A secret token sent to the subscriber in notifications so that it can verify that the notification was generated by Google.
*/
/**
 * @typedef SubscriptionsListResponse
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).Subscription[]} items The list of subscriptions.
 * @property {string} kind The type of resource. This is always mirror#subscriptionsList.
 */
/**
 * @typedef TimelineItem
 * @memberOf! mirror(v1)
 * @type object
* @property {mirror(v1).Attachment[]} attachments A list of media attachments associated with this item. As a convenience, you can refer to attachments in your HTML payloads with the attachment or cid scheme. For example:  
- attachment: &lt;img src=&quot;attachment:attachment_index&quot;&gt; where attachment_index is the 0-based index of this array. 
- cid: &lt;img src=&quot;cid:attachment_id&quot;&gt; where attachment_id is the ID of the attachment.
* @property {string} bundleId The bundle ID for this item. Services can specify a bundleId to group many items together. They appear under a single top-level item on the device.
* @property {string} canonicalUrl A canonical URL pointing to the canonical/high quality version of the data represented by the timeline item.
* @property {string} created The time at which this item was created, formatted according to RFC 3339.
* @property {mirror(v1).Contact} creator The user or group that created this item.
* @property {string} displayTime The time that should be displayed when this item is viewed in the timeline, formatted according to RFC 3339. This user&#39;s timeline is sorted chronologically on display time, so this will also determine where the item is displayed in the timeline. If not set by the service, the display time defaults to the updated time.
* @property {string} etag ETag for this item.
* @property {string} html HTML content for this item. If both text and html are provided for an item, the html will be rendered in the timeline.
Allowed HTML elements - You can use these elements in your timeline cards.
 
- Headers: h1, h2, h3, h4, h5, h6 
- Images: img 
- Lists: li, ol, ul 
- HTML5 semantics: article, aside, details, figure, figcaption, footer, header, nav, section, summary, time 
- Structural: blockquote, br, div, hr, p, span 
- Style: b, big, center, em, i, u, s, small, strike, strong, style, sub, sup 
- Tables: table, tbody, td, tfoot, th, thead, tr  
Blocked HTML elements: These elements and their contents are removed from HTML payloads.
 
- Document headers: head, title 
- Embeds: audio, embed, object, source, video 
- Frames: frame, frameset 
- Scripting: applet, script  
Other elements: Any elements that aren&#39;t listed are removed, but their contents are preserved.
* @property {string} id The ID of the timeline item. This is unique within a user&#39;s timeline.
* @property {string} inReplyTo If this item was generated as a reply to another item, this field will be set to the ID of the item being replied to. This can be used to attach a reply to the appropriate conversation or post.
* @property {boolean} isBundleCover Whether this item is a bundle cover.

If an item is marked as a bundle cover, it will be the entry point to the bundle of items that have the same bundleId as that item. It will be shown only on the main timeline — not within the opened bundle.

On the main timeline, items that are shown are:  
- Items that have isBundleCover set to true  
- Items that do not have a bundleId  In a bundle sub-timeline, items that are shown are:  
- Items that have the bundleId in question AND isBundleCover set to false
* @property {boolean} isDeleted When true, indicates this item is deleted, and only the ID property is set.
* @property {boolean} isPinned When true, indicates this item is pinned, which means it&#39;s grouped alongside &quot;active&quot; items like navigation and hangouts, on the opposite side of the home screen from historical (non-pinned) timeline items. You can allow the user to toggle the value of this property with the TOGGLE_PINNED built-in menu item.
* @property {string} kind The type of resource. This is always mirror#timelineItem.
* @property {mirror(v1).Location} location The geographic location associated with this item.
* @property {mirror(v1).MenuItem[]} menuItems A list of menu items that will be presented to the user when this item is selected in the timeline.
* @property {mirror(v1).NotificationConfig} notification Controls how notifications for this item are presented on the device. If this is missing, no notification will be generated.
* @property {integer} pinScore For pinned items, this determines the order in which the item is displayed in the timeline, with a higher score appearing closer to the clock. Note: setting this field is currently not supported.
* @property {mirror(v1).Contact[]} recipients A list of users or groups that this item has been shared with.
* @property {string} selfLink A URL that can be used to retrieve this item.
* @property {string} sourceItemId Opaque string you can use to map a timeline item to data in your own service.
* @property {string} speakableText The speakable version of the content of this item. Along with the READ_ALOUD menu item, use this field to provide text that would be clearer when read aloud, or to provide extended information to what is displayed visually on Glass.

Glassware should also specify the speakableType field, which will be spoken before this text in cases where the additional context is useful, for example when the user requests that the item be read aloud following a notification.
* @property {string} speakableType A speakable description of the type of this item. This will be announced to the user prior to reading the content of the item in cases where the additional context is useful, for example when the user requests that the item be read aloud following a notification.

This should be a short, simple noun phrase such as &quot;Email&quot;, &quot;Text message&quot;, or &quot;Daily Planet News Update&quot;.

Glassware are encouraged to populate this field for every timeline item, even if the item does not contain speakableText or text so that the user can learn the type of the item without looking at the screen.
* @property {string} text Text content of this item.
* @property {string} title The title of this item.
* @property {string} updated The time at which this item was last modified, formatted according to RFC 3339.
*/
/**
 * @typedef TimelineListResponse
 * @memberOf! mirror(v1)
 * @type object
 * @property {mirror(v1).TimelineItem[]} items Items in the timeline.
 * @property {string} kind The type of resource. This is always mirror#timeline.
 * @property {string} nextPageToken The next page token. Provide this as the pageToken parameter in the request to retrieve the next page of results.
 */
/**
 * @typedef UserAction
 * @memberOf! mirror(v1)
 * @type object
* @property {string} payload An optional payload for the action.

For actions of type CUSTOM, this is the ID of the custom menu item that was selected.
* @property {string} type The type of action. The value of this can be:  
- SHARE - the user shared an item. 
- REPLY - the user replied to an item. 
- REPLY_ALL - the user replied to all recipients of an item. 
- CUSTOM - the user selected a custom menu item on the timeline item. 
- DELETE - the user deleted the item. 
- PIN - the user pinned the item. 
- UNPIN - the user unpinned the item. 
- LAUNCH - the user initiated a voice command.  In the future, additional types may be added. UserActions with unrecognized types should be ignored.
*/
/**
 * @typedef UserData
 * @memberOf! mirror(v1)
 * @type object
 * @property {string} key 
 * @property {string} value 
 */
module.exports = Mirror;
