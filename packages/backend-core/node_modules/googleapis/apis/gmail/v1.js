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
 * Gmail API
 *
 * Access Gmail mailboxes including sending user email.
 *
 * @example
 * var google = require('googleapis');
 * var gmail = google.gmail('v1');
 *
 * @namespace gmail
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Gmail
 */
function Gmail(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.users = {

    /**
     * gmail.users.getProfile
     *
     * @desc Gets the current user's Gmail profile.
     *
     * @alias gmail.users.getProfile
     * @memberOf! gmail(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getProfile: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/gmail/v1/users/{userId}/profile',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gmail.users.stop
     *
     * @desc Stop receiving push notifications for the given user mailbox.
     *
     * @alias gmail.users.stop
     * @memberOf! gmail(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/gmail/v1/users/{userId}/stop',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gmail.users.watch
     *
     * @desc Set up or update a push notification watch on the given user mailbox.
     *
     * @alias gmail.users.watch
     * @memberOf! gmail(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
     * @param {gmail(v1).WatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/gmail/v1/users/{userId}/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    drafts: {

      /**
       * gmail.users.drafts.create
       *
       * @desc Creates a new draft with the DRAFT label.
       *
       * @alias gmail.users.drafts.create
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param  {object} params.resource Media resource metadata
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/drafts',
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.drafts.delete
       *
       * @desc Immediately and permanently deletes the specified draft. Does not simply trash it.
       *
       * @alias gmail.users.drafts.delete
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the draft to delete.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts/{id}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.drafts.get
       *
       * @desc Gets the specified draft.
       *
       * @alias gmail.users.drafts.get
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.format The format to return the draft in.
       * @param {string} params.id The ID of the draft to retrieve.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.drafts.list
       *
       * @desc Lists the drafts in the user's mailbox.
       *
       * @alias gmail.users.drafts.list
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.includeSpamTrash Include drafts from SPAM and TRASH in the results.
       * @param {integer=} params.maxResults Maximum number of drafts to return.
       * @param {string=} params.pageToken Page token to retrieve a specific page of results in the list.
       * @param {string=} params.q Only return draft messages matching the specified query. Supports the same query format as the Gmail search box. For example, "from:someuser@example.com rfc822msgid: is:unread".
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.drafts.send
       *
       * @desc Sends the specified, existing draft to the recipients in the To, Cc, and Bcc headers.
       *
       * @alias gmail.users.drafts.send
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param  {object} params.resource Media resource metadata
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      send: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts/send',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/drafts/send',
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.drafts.update
       *
       * @desc Replaces a draft's content.
       *
       * @alias gmail.users.drafts.update
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the draft to update.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/drafts/{id}',
            method: 'PUT'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/drafts/{id}',
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    history: {

      /**
       * gmail.users.history.list
       *
       * @desc Lists the history of all changes to the given mailbox. History results are returned in chronological order (increasing historyId).
       *
       * @alias gmail.users.history.list
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.labelId Only return messages with a label matching the ID.
       * @param {integer=} params.maxResults The maximum number of history records to return.
       * @param {string=} params.pageToken Page token to retrieve a specific page of results in the list.
       * @param {string=} params.startHistoryId Required. Returns history records after the specified startHistoryId. The supplied startHistoryId should be obtained from the historyId of a message, thread, or previous list response. History IDs increase chronologically but are not contiguous with random gaps in between valid IDs. Supplying an invalid or out of date startHistoryId typically returns an HTTP 404 error code. A historyId is typically valid for at least a week, but in some rare circumstances may be valid for only a few hours. If you receive an HTTP 404 error response, your application should perform a full sync. If you receive no nextPageToken in the response, there are no updates to retrieve and you can store the returned historyId for a future request.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/history',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    labels: {

      /**
       * gmail.users.labels.create
       *
       * @desc Creates a new label.
       *
       * @alias gmail.users.labels.create
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).Label} params.resource Request body data
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.labels.delete
       *
       * @desc Immediately and permanently deletes the specified label and removes it from any messages and threads that it is applied to.
       *
       * @alias gmail.users.labels.delete
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the label to delete.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels/{id}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.labels.get
       *
       * @desc Gets the specified label.
       *
       * @alias gmail.users.labels.get
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the label to retrieve.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.labels.list
       *
       * @desc Lists all labels in the user's mailbox.
       *
       * @alias gmail.users.labels.list
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.labels.patch
       *
       * @desc Updates the specified label. This method supports patch semantics.
       *
       * @alias gmail.users.labels.patch
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the label to update.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).Label} params.resource Request body data
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels/{id}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.labels.update
       *
       * @desc Updates the specified label.
       *
       * @alias gmail.users.labels.update
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the label to update.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).Label} params.resource Request body data
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/labels/{id}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    messages: {

      /**
       * gmail.users.messages.batchDelete
       *
       * @desc Deletes many messages by message ID. Provides no guarantees that messages were not already deleted or even existed at all.
       *
       * @alias gmail.users.messages.batchDelete
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).BatchDeleteMessagesRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchDelete: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/batchDelete',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.batchModify
       *
       * @desc Modifies the labels on the specified messages.
       *
       * @alias gmail.users.messages.batchModify
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).BatchModifyMessagesRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      batchModify: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/batchModify',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.delete
       *
       * @desc Immediately and permanently deletes the specified message. This operation cannot be undone. Prefer messages.trash instead.
       *
       * @alias gmail.users.messages.delete
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the message to delete.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{id}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.get
       *
       * @desc Gets the specified message.
       *
       * @alias gmail.users.messages.get
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.format The format to return the message in.
       * @param {string} params.id The ID of the message to retrieve.
       * @param {string=} params.metadataHeaders When given and format is METADATA, only include headers specified.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.import
       *
       * @desc Imports a message into only this user's mailbox, with standard email delivery scanning and classification similar to receiving via SMTP. Does not send a message.
       *
       * @alias gmail.users.messages.import
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.deleted Mark the email as permanently deleted (not TRASH) and only visible in Google Apps Vault to a Vault administrator. Only used for Google Apps for Work accounts.
       * @param {string=} params.internalDateSource Source for Gmail's internal date of the message.
       * @param {boolean=} params.neverMarkSpam Ignore the Gmail spam classifier decision and never mark this email as SPAM in the mailbox.
       * @param {boolean=} params.processForCalendar Process calendar invites in the email and add any extracted meetings to the Google Calendar for this user.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param  {object} params.resource Media resource metadata
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      import: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/import',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/messages/import',
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.insert
       *
       * @desc Directly inserts a message into only this user's mailbox similar to IMAP APPEND, bypassing most scanning and classification. Does not send a message.
       *
       * @alias gmail.users.messages.insert
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.deleted Mark the email as permanently deleted (not TRASH) and only visible in Google Apps Vault to a Vault administrator. Only used for Google Apps for Work accounts.
       * @param {string=} params.internalDateSource Source for Gmail's internal date of the message.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/messages',
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.list
       *
       * @desc Lists the messages in the user's mailbox.
       *
       * @alias gmail.users.messages.list
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.includeSpamTrash Include messages from SPAM and TRASH in the results.
       * @param {string=} params.labelIds Only return messages with labels that match all of the specified label IDs.
       * @param {integer=} params.maxResults Maximum number of messages to return.
       * @param {string=} params.pageToken Page token to retrieve a specific page of results in the list.
       * @param {string=} params.q Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, "from:someuser@example.com rfc822msgid: is:unread". Parameter cannot be used when accessing the api using the gmail.metadata scope.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.modify
       *
       * @desc Modifies the labels on the specified message.
       *
       * @alias gmail.users.messages.modify
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the message to modify.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).ModifyMessageRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      modify: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{id}/modify',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.send
       *
       * @desc Sends the specified message to the recipients in the To, Cc, and Bcc headers.
       *
       * @alias gmail.users.messages.send
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param  {object} params.resource Media resource metadata
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      send: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/send',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/gmail/v1/users/{userId}/messages/send',
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.trash
       *
       * @desc Moves the specified message to the trash.
       *
       * @alias gmail.users.messages.trash
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the message to Trash.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      trash: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{id}/trash',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.messages.untrash
       *
       * @desc Removes the specified message from the trash.
       *
       * @alias gmail.users.messages.untrash
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the message to remove from Trash.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      untrash: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{id}/untrash',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      attachments: {

        /**
         * gmail.users.messages.attachments.get
         *
         * @desc Gets the specified message attachment.
         *
         * @alias gmail.users.messages.attachments.get
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.id The ID of the attachment.
         * @param {string} params.messageId The ID of the message containing the attachment.
         * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/messages/{messageId}/attachments/{id}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId', 'messageId', 'id'],
            pathParams: ['id', 'messageId', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    settings: {

      /**
       * gmail.users.settings.getAutoForwarding
       *
       * @desc Gets the auto-forwarding setting for the specified account.
       *
       * @alias gmail.users.settings.getAutoForwarding
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getAutoForwarding: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/autoForwarding',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.getImap
       *
       * @desc Gets IMAP settings.
       *
       * @alias gmail.users.settings.getImap
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getImap: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/imap',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.getPop
       *
       * @desc Gets POP settings.
       *
       * @alias gmail.users.settings.getPop
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getPop: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/pop',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.getVacation
       *
       * @desc Gets vacation responder settings.
       *
       * @alias gmail.users.settings.getVacation
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      getVacation: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/vacation',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.updateAutoForwarding
       *
       * @desc Updates the auto-forwarding setting for the specified account. A verified forwarding address must be specified when auto-forwarding is enabled.
       *
       * @alias gmail.users.settings.updateAutoForwarding
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {gmail(v1).AutoForwarding} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      updateAutoForwarding: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/autoForwarding',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.updateImap
       *
       * @desc Updates IMAP settings.
       *
       * @alias gmail.users.settings.updateImap
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {gmail(v1).ImapSettings} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      updateImap: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/imap',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.updatePop
       *
       * @desc Updates POP settings.
       *
       * @alias gmail.users.settings.updatePop
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {gmail(v1).PopSettings} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      updatePop: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/pop',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.settings.updateVacation
       *
       * @desc Updates vacation responder settings.
       *
       * @alias gmail.users.settings.updateVacation
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
       * @param {gmail(v1).VacationSettings} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      updateVacation: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/vacation',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      filters: {

        /**
         * gmail.users.settings.filters.create
         *
         * @desc Creates a filter.
         *
         * @alias gmail.users.settings.filters.create
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {gmail(v1).Filter} params.resource Request body data
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/filters',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.filters.delete
         *
         * @desc Deletes a filter.
         *
         * @alias gmail.users.settings.filters.delete
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.id The ID of the filter to be deleted.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/filters/{id}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['userId', 'id'],
            pathParams: ['id', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.filters.get
         *
         * @desc Gets a filter.
         *
         * @alias gmail.users.settings.filters.get
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.id The ID of the filter to be fetched.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/filters/{id}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId', 'id'],
            pathParams: ['id', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.filters.list
         *
         * @desc Lists the message filters of a Gmail user.
         *
         * @alias gmail.users.settings.filters.list
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/filters',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      forwardingAddresses: {

        /**
         * gmail.users.settings.forwardingAddresses.create
         *
         * @desc Creates a forwarding address. If ownership verification is required, a message will be sent to the recipient and the resource's verification status will be set to pending; otherwise, the resource will be created with verification status set to accepted.
         *
         * @alias gmail.users.settings.forwardingAddresses.create
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {gmail(v1).ForwardingAddress} params.resource Request body data
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/forwardingAddresses',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.forwardingAddresses.delete
         *
         * @desc Deletes the specified forwarding address and revokes any verification that may have been required.
         *
         * @alias gmail.users.settings.forwardingAddresses.delete
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.forwardingEmail The forwarding address to be deleted.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/forwardingAddresses/{forwardingEmail}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['userId', 'forwardingEmail'],
            pathParams: ['forwardingEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.forwardingAddresses.get
         *
         * @desc Gets the specified forwarding address.
         *
         * @alias gmail.users.settings.forwardingAddresses.get
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.forwardingEmail The forwarding address to be retrieved.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/forwardingAddresses/{forwardingEmail}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId', 'forwardingEmail'],
            pathParams: ['forwardingEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.forwardingAddresses.list
         *
         * @desc Lists the forwarding addresses for the specified account.
         *
         * @alias gmail.users.settings.forwardingAddresses.list
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/forwardingAddresses',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      sendAs: {

        /**
         * gmail.users.settings.sendAs.create
         *
         * @desc Creates a custom "from" send-as alias. If an SMTP MSA is specified, Gmail will attempt to connect to the SMTP service to validate the configuration before creating the alias. If ownership verification is required for the alias, a message will be sent to the email address and the resource's verification status will be set to pending; otherwise, the resource will be created with verification status set to accepted. If a signature is provided, Gmail will sanitize the HTML before saving it with the alias.
         *
         * @alias gmail.users.settings.sendAs.create
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {gmail(v1).SendAs} params.resource Request body data
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.delete
         *
         * @desc Deletes the specified send-as alias. Revokes any verification that may have been required for using it.
         *
         * @alias gmail.users.settings.sendAs.delete
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.sendAsEmail The send-as alias to be deleted.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs/{sendAsEmail}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['userId', 'sendAsEmail'],
            pathParams: ['sendAsEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.get
         *
         * @desc Gets the specified send-as alias. Fails with an HTTP 404 error if the specified address is not a member of the collection.
         *
         * @alias gmail.users.settings.sendAs.get
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.sendAsEmail The send-as alias to be retrieved.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs/{sendAsEmail}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId', 'sendAsEmail'],
            pathParams: ['sendAsEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.list
         *
         * @desc Lists the send-as aliases for the specified account. The result includes the primary send-as address associated with the account as well as any custom "from" aliases.
         *
         * @alias gmail.users.settings.sendAs.list
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['userId'],
            pathParams: ['userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.patch
         *
         * @desc Updates a send-as alias. If a signature is provided, Gmail will sanitize the HTML before saving it with the alias. This method supports patch semantics.
         *
         * @alias gmail.users.settings.sendAs.patch
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.sendAsEmail The send-as alias to be updated.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {gmail(v1).SendAs} params.resource Request body data
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs/{sendAsEmail}',
              method: 'PATCH'
            }, options),
            params: params,
            requiredParams: ['userId', 'sendAsEmail'],
            pathParams: ['sendAsEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.update
         *
         * @desc Updates a send-as alias. If a signature is provided, Gmail will sanitize the HTML before saving it with the alias.
         *
         * @alias gmail.users.settings.sendAs.update
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.sendAsEmail The send-as alias to be updated.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {gmail(v1).SendAs} params.resource Request body data
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
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs/{sendAsEmail}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['userId', 'sendAsEmail'],
            pathParams: ['sendAsEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * gmail.users.settings.sendAs.verify
         *
         * @desc Sends a verification email to the specified send-as alias address. The verification status must be pending.
         *
         * @alias gmail.users.settings.sendAs.verify
         * @memberOf! gmail(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.sendAsEmail The send-as alias to be verified.
         * @param {string} params.userId User's email address. The special value "me" can be used to indicate the authenticated user.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        verify: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/gmail/v1/users/{userId}/settings/sendAs/{sendAsEmail}/verify',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['userId', 'sendAsEmail'],
            pathParams: ['sendAsEmail', 'userId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    threads: {

      /**
       * gmail.users.threads.delete
       *
       * @desc Immediately and permanently deletes the specified thread. This operation cannot be undone. Prefer threads.trash instead.
       *
       * @alias gmail.users.threads.delete
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id ID of the Thread to delete.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads/{id}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.threads.get
       *
       * @desc Gets the specified thread.
       *
       * @alias gmail.users.threads.get
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.format The format to return the messages in.
       * @param {string} params.id The ID of the thread to retrieve.
       * @param {string=} params.metadataHeaders When given and format is METADATA, only include headers specified.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.threads.list
       *
       * @desc Lists the threads in the user's mailbox.
       *
       * @alias gmail.users.threads.list
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.includeSpamTrash Include threads from SPAM and TRASH in the results.
       * @param {string=} params.labelIds Only return threads with labels that match all of the specified label IDs.
       * @param {integer=} params.maxResults Maximum number of threads to return.
       * @param {string=} params.pageToken Page token to retrieve a specific page of results in the list.
       * @param {string=} params.q Only return threads matching the specified query. Supports the same query format as the Gmail search box. For example, "from:someuser@example.com rfc822msgid: is:unread". Parameter cannot be used when accessing the api using the gmail.metadata scope.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
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
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.threads.modify
       *
       * @desc Modifies the labels applied to the thread. This applies to all messages in the thread.
       *
       * @alias gmail.users.threads.modify
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the thread to modify.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {gmail(v1).ModifyThreadRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      modify: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads/{id}/modify',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.threads.trash
       *
       * @desc Moves the specified thread to the trash.
       *
       * @alias gmail.users.threads.trash
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the thread to Trash.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      trash: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads/{id}/trash',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * gmail.users.threads.untrash
       *
       * @desc Removes the specified thread from the trash.
       *
       * @alias gmail.users.threads.untrash
       * @memberOf! gmail(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.id The ID of the thread to remove from Trash.
       * @param {string} params.userId The user's email address. The special value me can be used to indicate the authenticated user.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      untrash: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/gmail/v1/users/{userId}/threads/{id}/untrash',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['userId', 'id'],
          pathParams: ['id', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef AutoForwarding
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} disposition The state that a message should be left in after it has been forwarded.
 * @property {string} emailAddress Email address to which all incoming messages are forwarded. This email address must be a verified member of the forwarding addresses.
 * @property {boolean} enabled Whether all incoming mail is automatically forwarded to another address.
 */
/**
 * @typedef BatchDeleteMessagesRequest
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} ids The IDs of the messages to delete.
 */
/**
 * @typedef BatchModifyMessagesRequest
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} addLabelIds A list of label IDs to add to messages.
 * @property {string[]} ids The IDs of the messages to modify. There is a limit of 1000 ids per request.
 * @property {string[]} removeLabelIds A list of label IDs to remove from messages.
 */
/**
 * @typedef Draft
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} id The immutable ID of the draft.
 * @property {gmail(v1).Message} message The message content of the draft.
 */
/**
 * @typedef Filter
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).FilterAction} action Action that the filter performs.
 * @property {gmail(v1).FilterCriteria} criteria Matching criteria for the filter.
 * @property {string} id The server assigned ID of the filter.
 */
/**
 * @typedef FilterAction
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} addLabelIds List of labels to add to the message.
 * @property {string} forward Email address that the message should be forwarded to.
 * @property {string[]} removeLabelIds List of labels to remove from the message.
 */
/**
 * @typedef FilterCriteria
 * @memberOf! gmail(v1)
 * @type object
 * @property {boolean} excludeChats Whether the response should exclude chats.
 * @property {string} from The sender&#39;s display name or email address.
 * @property {boolean} hasAttachment Whether the message has any attachment.
 * @property {string} negatedQuery Only return messages not matching the specified query. Supports the same query format as the Gmail search box. For example, &quot;from:someuser@example.com rfc822msgid: is:unread&quot;.
 * @property {string} query Only return messages matching the specified query. Supports the same query format as the Gmail search box. For example, &quot;from:someuser@example.com rfc822msgid: is:unread&quot;.
 * @property {integer} size The size of the entire RFC822 message in bytes, including all headers and attachments.
 * @property {string} sizeComparison How the message size in bytes should be in relation to the size field.
 * @property {string} subject Case-insensitive phrase found in the message&#39;s subject. Trailing and leading whitespace are be trimmed and adjacent spaces are collapsed.
 * @property {string} to The recipient&#39;s display name or email address. Includes recipients in the &quot;to&quot;, &quot;cc&quot;, and &quot;bcc&quot; header fields. You can use simply the local part of the email address. For example, &quot;example&quot; and &quot;example@&quot; both match &quot;example@gmail.com&quot;. This field is case-insensitive.
 */
/**
 * @typedef ForwardingAddress
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} forwardingEmail An email address to which messages can be forwarded.
 * @property {string} verificationStatus Indicates whether this address has been verified and is usable for forwarding. Read-only.
 */
/**
 * @typedef History
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} id The mailbox sequence ID.
 * @property {gmail(v1).HistoryLabelAdded[]} labelsAdded Labels added to messages in this history record.
 * @property {gmail(v1).HistoryLabelRemoved[]} labelsRemoved Labels removed from messages in this history record.
 * @property {gmail(v1).Message[]} messages List of messages changed in this history record. The fields for specific change types, such as messagesAdded may duplicate messages in this field. We recommend using the specific change-type fields instead of this.
 * @property {gmail(v1).HistoryMessageAdded[]} messagesAdded Messages added to the mailbox in this history record.
 * @property {gmail(v1).HistoryMessageDeleted[]} messagesDeleted Messages deleted (not Trashed) from the mailbox in this history record.
 */
/**
 * @typedef HistoryLabelAdded
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} labelIds Label IDs added to the message.
 * @property {gmail(v1).Message} message 
 */
/**
 * @typedef HistoryLabelRemoved
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} labelIds Label IDs removed from the message.
 * @property {gmail(v1).Message} message 
 */
/**
 * @typedef HistoryMessageAdded
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Message} message 
 */
/**
 * @typedef HistoryMessageDeleted
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Message} message 
 */
/**
 * @typedef ImapSettings
 * @memberOf! gmail(v1)
 * @type object
 * @property {boolean} autoExpunge If this value is true, Gmail will immediately expunge a message when it is marked as deleted in IMAP. Otherwise, Gmail will wait for an update from the client before expunging messages marked as deleted.
 * @property {boolean} enabled Whether IMAP is enabled for the account.
 * @property {string} expungeBehavior The action that will be executed on a message when it is marked as deleted and expunged from the last visible IMAP folder.
 * @property {integer} maxFolderSize An optional limit on the number of messages that an IMAP folder may contain. Legal values are 0, 1000, 2000, 5000 or 10000. A value of zero is interpreted to mean that there is no limit.
 */
/**
 * @typedef Label
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} id The immutable ID of the label.
 * @property {string} labelListVisibility The visibility of the label in the label list in the Gmail web interface.
 * @property {string} messageListVisibility The visibility of the label in the message list in the Gmail web interface.
 * @property {integer} messagesTotal The total number of messages with the label.
 * @property {integer} messagesUnread The number of unread messages with the label.
 * @property {string} name The display name of the label.
 * @property {integer} threadsTotal The total number of threads with the label.
 * @property {integer} threadsUnread The number of unread threads with the label.
 * @property {string} type The owner type for the label. User labels are created by the user and can be modified and deleted by the user and can be applied to any message or thread. System labels are internally created and cannot be added, modified, or deleted. System labels may be able to be applied to or removed from messages and threads under some circumstances but this is not guaranteed. For example, users can apply and remove the INBOX and UNREAD labels from messages and threads, but cannot apply or remove the DRAFTS or SENT labels from messages or threads.
 */
/**
 * @typedef ListDraftsResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Draft[]} drafts List of drafts.
 * @property {string} nextPageToken Token to retrieve the next page of results in the list.
 * @property {integer} resultSizeEstimate Estimated total number of results.
 */
/**
 * @typedef ListFiltersResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Filter[]} filter List of a user&#39;s filters.
 */
/**
 * @typedef ListForwardingAddressesResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).ForwardingAddress[]} forwardingAddresses List of addresses that may be used for forwarding.
 */
/**
 * @typedef ListHistoryResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).History[]} history List of history records. Any messages contained in the response will typically only have id and threadId fields populated.
 * @property {string} historyId The ID of the mailbox&#39;s current history record.
 * @property {string} nextPageToken Page token to retrieve the next page of results in the list.
 */
/**
 * @typedef ListLabelsResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Label[]} labels List of labels.
 */
/**
 * @typedef ListMessagesResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).Message[]} messages List of messages.
 * @property {string} nextPageToken Token to retrieve the next page of results in the list.
 * @property {integer} resultSizeEstimate Estimated total number of results.
 */
/**
 * @typedef ListSendAsResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).SendAs[]} sendAs List of send-as aliases.
 */
/**
 * @typedef ListThreadsResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} nextPageToken Page token to retrieve the next page of results in the list.
 * @property {integer} resultSizeEstimate Estimated total number of results.
 * @property {gmail(v1).Thread[]} threads List of threads.
 */
/**
 * @typedef Message
 * @memberOf! gmail(v1)
 * @type object
* @property {string} historyId The ID of the last history record that modified this message.
* @property {string} id The immutable ID of the message.
* @property {string} internalDate The internal message creation timestamp (epoch ms), which determines ordering in the inbox. For normal SMTP-received email, this represents the time the message was originally accepted by Google, which is more reliable than the Date header. However, for API-migrated mail, it can be configured by client to be based on the Date header.
* @property {string[]} labelIds List of IDs of labels applied to this message.
* @property {gmail(v1).MessagePart} payload The parsed email structure in the message parts.
* @property {string} raw The entire email message in an RFC 2822 formatted and base64url encoded string. Returned in messages.get and drafts.get responses when the format=RAW parameter is supplied.
* @property {integer} sizeEstimate Estimated size in bytes of the message.
* @property {string} snippet A short part of the message text.
* @property {string} threadId The ID of the thread the message belongs to. To add a message or draft to a thread, the following criteria must be met: 
- The requested threadId must be specified on the Message or Draft.Message you supply with your request. 
- The References and In-Reply-To headers must be set in compliance with the RFC 2822 standard. 
- The Subject headers must match.
*/
/**
 * @typedef MessagePart
 * @memberOf! gmail(v1)
 * @type object
 * @property {gmail(v1).MessagePartBody} body The message part body for this part, which may be empty for container MIME message parts.
 * @property {string} filename The filename of the attachment. Only present if this message part represents an attachment.
 * @property {gmail(v1).MessagePartHeader[]} headers List of headers on this message part. For the top-level message part, representing the entire message payload, it will contain the standard RFC 2822 email headers such as To, From, and Subject.
 * @property {string} mimeType The MIME type of the message part.
 * @property {string} partId The immutable ID of the message part.
 * @property {gmail(v1).MessagePart[]} parts The child MIME message parts of this part. This only applies to container MIME message parts, for example multipart/*. For non- container MIME message part types, such as text/plain, this field is empty. For more information, see RFC 1521.
 */
/**
 * @typedef MessagePartBody
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} attachmentId When present, contains the ID of an external attachment that can be retrieved in a separate messages.attachments.get request. When not present, the entire content of the message part body is contained in the data field.
 * @property {string} data The body data of a MIME message part as a base64url encoded string. May be empty for MIME container types that have no message body or when the body data is sent as a separate attachment. An attachment ID is present if the body data is contained in a separate attachment.
 * @property {integer} size Number of bytes for the message part data (encoding notwithstanding).
 */
/**
 * @typedef MessagePartHeader
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} name The name of the header before the : separator. For example, To.
 * @property {string} value The value of the header after the : separator. For example, someuser@example.com.
 */
/**
 * @typedef ModifyMessageRequest
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} addLabelIds A list of IDs of labels to add to this message.
 * @property {string[]} removeLabelIds A list IDs of labels to remove from this message.
 */
/**
 * @typedef ModifyThreadRequest
 * @memberOf! gmail(v1)
 * @type object
 * @property {string[]} addLabelIds A list of IDs of labels to add to this thread.
 * @property {string[]} removeLabelIds A list of IDs of labels to remove from this thread.
 */
/**
 * @typedef PopSettings
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} accessWindow The range of messages which are accessible via POP.
 * @property {string} disposition The action that will be executed on a message after it has been fetched via POP.
 */
/**
 * @typedef Profile
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} emailAddress The user&#39;s email address.
 * @property {string} historyId The ID of the mailbox&#39;s current history record.
 * @property {integer} messagesTotal The total number of messages in the mailbox.
 * @property {integer} threadsTotal The total number of threads in the mailbox.
 */
/**
 * @typedef SendAs
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} displayName A name that appears in the &quot;From:&quot; header for mail sent using this alias. For custom &quot;from&quot; addresses, when this is empty, Gmail will populate the &quot;From:&quot; header with the name that is used for the primary address associated with the account.
 * @property {boolean} isDefault Whether this address is selected as the default &quot;From:&quot; address in situations such as composing a new message or sending a vacation auto-reply. Every Gmail account has exactly one default send-as address, so the only legal value that clients may write to this field is true. Changing this from false to true for an address will result in this field becoming false for the other previous default address.
 * @property {boolean} isPrimary Whether this address is the primary address used to login to the account. Every Gmail account has exactly one primary address, and it cannot be deleted from the collection of send-as aliases. This field is read-only.
 * @property {string} replyToAddress An optional email address that is included in a &quot;Reply-To:&quot; header for mail sent using this alias. If this is empty, Gmail will not generate a &quot;Reply-To:&quot; header.
 * @property {string} sendAsEmail The email address that appears in the &quot;From:&quot; header for mail sent using this alias. This is read-only for all operations except create.
 * @property {string} signature An optional HTML signature that is included in messages composed with this alias in the Gmail web UI.
 * @property {gmail(v1).SmtpMsa} smtpMsa An optional SMTP service that will be used as an outbound relay for mail sent using this alias. If this is empty, outbound mail will be sent directly from Gmail&#39;s servers to the destination SMTP service. This setting only applies to custom &quot;from&quot; aliases.
 * @property {boolean} treatAsAlias Whether Gmail should  treat this address as an alias for the user&#39;s primary email address. This setting only applies to custom &quot;from&quot; aliases.
 * @property {string} verificationStatus Indicates whether this address has been verified for use as a send-as alias. Read-only. This setting only applies to custom &quot;from&quot; aliases.
 */
/**
 * @typedef SmtpMsa
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} host The hostname of the SMTP service. Required.
 * @property {string} password The password that will be used for authentication with the SMTP service. This is a write-only field that can be specified in requests to create or update SendAs settings; it is never populated in responses.
 * @property {integer} port The port of the SMTP service. Required.
 * @property {string} securityMode The protocol that will be used to secure communication with the SMTP service. Required.
 * @property {string} username The username that will be used for authentication with the SMTP service. This is a write-only field that can be specified in requests to create or update SendAs settings; it is never populated in responses.
 */
/**
 * @typedef Thread
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} historyId The ID of the last history record that modified this thread.
 * @property {string} id The unique ID of the thread.
 * @property {gmail(v1).Message[]} messages The list of messages in the thread.
 * @property {string} snippet A short part of the message text.
 */
/**
 * @typedef VacationSettings
 * @memberOf! gmail(v1)
 * @type object
 * @property {boolean} enableAutoReply Flag that controls whether Gmail automatically replies to messages.
 * @property {string} endTime An optional end time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives before the end time. If both startTime and endTime are specified, startTime must precede endTime.
 * @property {string} responseBodyHtml Response body in HTML format. Gmail will sanitize the HTML before storing it.
 * @property {string} responseBodyPlainText Response body in plain text format.
 * @property {string} responseSubject Optional text to prepend to the subject line in vacation responses. In order to enable auto-replies, either the response subject or the response body must be nonempty.
 * @property {boolean} restrictToContacts Flag that determines whether responses are sent to recipients who are not in the user&#39;s list of contacts.
 * @property {boolean} restrictToDomain Flag that determines whether responses are sent to recipients who are outside of the user&#39;s domain. This feature is only available for Google Apps users.
 * @property {string} startTime An optional start time for sending auto-replies (epoch ms). When this is specified, Gmail will automatically reply only to messages that it receives after the start time. If both startTime and endTime are specified, startTime must precede endTime.
 */
/**
 * @typedef WatchRequest
 * @memberOf! gmail(v1)
 * @type object
* @property {string} labelFilterAction Filtering behavior of labelIds list specified.
* @property {string[]} labelIds List of label_ids to restrict notifications about. By default, if unspecified, all changes are pushed out. If specified then dictates which labels are required for a push notification to be generated.
* @property {string} topicName A fully qualified Google Cloud Pub/Sub API topic name to publish the events to. This topic name **must** already exist in Cloud Pub/Sub and you **must** have already granted gmail &quot;publish&quot; permission on it. For example, &quot;projects/my-project-identifier/topics/my-topic-name&quot; (using the Cloud Pub/Sub &quot;v1&quot; topic naming format).

Note that the &quot;my-project-identifier&quot; portion must exactly match your Google developer project id (the one executing this watch request).
*/
/**
 * @typedef WatchResponse
 * @memberOf! gmail(v1)
 * @type object
 * @property {string} expiration When Gmail will stop sending notifications for mailbox updates (epoch millis). Call watch again before this time to renew the watch.
 * @property {string} historyId The ID of the mailbox&#39;s current history record.
 */
module.exports = Gmail;
