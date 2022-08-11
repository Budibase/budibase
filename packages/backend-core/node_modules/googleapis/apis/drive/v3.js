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
 * Drive API
 *
 * Manages files in Drive including uploading, downloading, searching, detecting changes, and updating sharing permissions.
 *
 * @example
 * var google = require('googleapis');
 * var drive = google.drive('v3');
 *
 * @namespace drive
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Drive
 */
function Drive(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.about = {

    /**
     * drive.about.get
     *
     * @desc Gets information about the user, the user's Drive, and system capabilities.
     *
     * @alias drive.about.get
     * @memberOf! drive(v3)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/drive/v3/about',
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

  self.changes = {

    /**
     * drive.changes.getStartPageToken
     *
     * @desc Gets the starting pageToken for listing future changes.
     *
     * @alias drive.changes.getStartPageToken
     * @memberOf! drive(v3)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getStartPageToken: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v3/changes/startPageToken',
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
     * drive.changes.list
     *
     * @desc Lists changes for a user.
     *
     * @alias drive.changes.list
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.includeRemoved Whether to include changes indicating that items have left the view of the changes list, for example by deletion or lost access.
     * @param {integer=} params.pageSize The maximum number of changes to return per page.
     * @param {string} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.
     * @param {boolean=} params.restrictToMyDrive Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.
     * @param {string=} params.spaces A comma-separated list of spaces to query within the user corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
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
          url: 'https://www.googleapis.com/drive/v3/changes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['pageToken'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.changes.watch
     *
     * @desc Subscribes to changes for a user.
     *
     * @alias drive.changes.watch
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.includeRemoved Whether to include changes indicating that items have left the view of the changes list, for example by deletion or lost access.
     * @param {integer=} params.pageSize The maximum number of changes to return per page.
     * @param {string} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response or to the response from the getStartPageToken method.
     * @param {boolean=} params.restrictToMyDrive Whether to restrict the results to changes inside the My Drive hierarchy. This omits changes to files such as those in the Application Data folder or shared files which have not been added to My Drive.
     * @param {string=} params.spaces A comma-separated list of spaces to query within the user corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
     * @param {drive(v3).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/changes/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['pageToken'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channels = {

    /**
     * drive.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias drive.channels.stop
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {drive(v3).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/channels/stop',
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

  self.comments = {

    /**
     * drive.comments.create
     *
     * @desc Creates a new comment on a file.
     *
     * @alias drive.comments.create
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v3).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.comments.delete
     *
     * @desc Deletes a comment.
     *
     * @alias drive.comments.delete
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.comments.get
     *
     * @desc Gets a comment by ID.
     *
     * @alias drive.comments.get
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted Whether to return deleted comments. Deleted comments will not include their original content.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.comments.list
     *
     * @desc Lists a file's comments.
     *
     * @alias drive.comments.list
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted Whether to include deleted comments. Deleted comments will not include their original content.
     * @param {integer=} params.pageSize The maximum number of comments to return per page.
     * @param {string=} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
     * @param {string=} params.startModifiedTime The minimum value of 'modifiedTime' for the result comments (RFC 3339 date-time).
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.comments.update
     *
     * @desc Updates a comment with patch semantics.
     *
     * @alias drive.comments.update
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v3).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.files = {

    /**
     * drive.files.copy
     *
     * @desc Creates a copy of a file and applies any requested updates with patch semantics.
     *
     * @alias drive.files.copy
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.ignoreDefaultVisibility Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.
     * @param {boolean=} params.keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
     * @param {string=} params.ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
     * @param {drive(v3).File} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    copy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/copy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.create
     *
     * @desc Creates a new file.
     *
     * @alias drive.files.create
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.ignoreDefaultVisibility Whether to ignore the domain's default visibility settings for the created file. Domain administrators can choose to make all uploaded files visible to the domain by default; this parameter bypasses that behavior for the request. Permissions are still inherited from parent folders.
     * @param {boolean=} params.keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
     * @param {string=} params.ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
     * @param {boolean=} params.useContentAsIndexableText Whether to use the uploaded content as indexable text.
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
          url: 'https://www.googleapis.com/drive/v3/files',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/drive/v3/files',
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.delete
     *
     * @desc Permanently deletes a file owned by the user without moving it to the trash. If the target is a folder, all descendants owned by the user are also deleted.
     *
     * @alias drive.files.delete
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.emptyTrash
     *
     * @desc Permanently deletes all of the user's trashed files.
     *
     * @alias drive.files.emptyTrash
     * @memberOf! drive(v3)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    emptyTrash: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v3/files/trash',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.export
     *
     * @desc Exports a Google Doc to the requested MIME type and returns the exported content.
     *
     * @alias drive.files.export
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.mimeType The MIME type of the format requested for this export.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    export: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/export',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'mimeType'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.generateIds
     *
     * @desc Generates a set of file IDs which can be provided in create requests.
     *
     * @alias drive.files.generateIds
     * @memberOf! drive(v3)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.count The number of IDs to return.
     * @param {string=} params.space The space in which the IDs can be used to create new files. Supported values are 'drive' and 'appDataFolder'.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generateIds: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v3/files/generateIds',
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
     * drive.files.get
     *
     * @desc Gets a file's metadata or content by ID.
     *
     * @alias drive.files.get
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
     * @param {string} params.fileId The ID of the file.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.list
     *
     * @desc Lists or searches files.
     *
     * @alias drive.files.list
     * @memberOf! drive(v3)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.corpus The source of files to list.
     * @param {string=} params.orderBy A comma-separated list of sort keys. Valid keys are 'createdTime', 'folder', 'modifiedByMeTime', 'modifiedTime', 'name', 'quotaBytesUsed', 'recency', 'sharedWithMeTime', 'starred', and 'viewedByMeTime'. Each key sorts ascending by default, but may be reversed with the 'desc' modifier. Example usage: ?orderBy=folder,modifiedTime desc,name. Please note that there is a current limitation for users with approximately one million files in which the requested sort order is ignored.
     * @param {integer=} params.pageSize The maximum number of files to return per page.
     * @param {string=} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
     * @param {string=} params.q A query for filtering the file results. See the "Search for Files" guide for supported syntax.
     * @param {string=} params.spaces A comma-separated list of spaces to query within the corpus. Supported values are 'drive', 'appDataFolder' and 'photos'.
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
          url: 'https://www.googleapis.com/drive/v3/files',
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
     * drive.files.update
     *
     * @desc Updates a file's metadata and/or content with patch semantics.
     *
     * @alias drive.files.update
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.addParents A comma-separated list of parent IDs to add.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.keepRevisionForever Whether to set the 'keepForever' field in the new head revision. This is only applicable to files with binary content in Drive.
     * @param {string=} params.ocrLanguage A language hint for OCR processing during image import (ISO 639-1 code).
     * @param {string=} params.removeParents A comma-separated list of parent IDs to remove.
     * @param {boolean=} params.useContentAsIndexableText Whether to use the uploaded content as indexable text.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}',
          method: 'PATCH'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/drive/v3/files/{fileId}',
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.watch
     *
     * @desc Subscribes to changes to a file
     *
     * @alias drive.files.watch
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v3).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.permissions = {

    /**
     * drive.permissions.create
     *
     * @desc Creates a permission for a file.
     *
     * @alias drive.permissions.create
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.emailMessage A custom message to include in the notification email.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.sendNotificationEmail Whether to send a notification email when sharing to users or groups. This defaults to true for users and groups, and is not allowed for other requests. It must not be disabled for ownership transfers.
     * @param {boolean=} params.transferOwnership Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect.
     * @param {drive(v3).Permission} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.delete
     *
     * @desc Deletes a permission.
     *
     * @alias drive.permissions.delete
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.permissionId The ID of the permission.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'permissionId'],
        pathParams: ['fileId', 'permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.get
     *
     * @desc Gets a permission by ID.
     *
     * @alias drive.permissions.get
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.permissionId The ID of the permission.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'permissionId'],
        pathParams: ['fileId', 'permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.list
     *
     * @desc Lists a file's permissions.
     *
     * @alias drive.permissions.list
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.update
     *
     * @desc Updates a permission with patch semantics.
     *
     * @alias drive.permissions.update
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.permissionId The ID of the permission.
     * @param {boolean=} params.removeExpiration Whether to remove the expiration date.
     * @param {boolean=} params.transferOwnership Whether to transfer ownership to the specified user and downgrade the current owner to a writer. This parameter is required as an acknowledgement of the side effect.
     * @param {drive(v3).Permission} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'permissionId'],
        pathParams: ['fileId', 'permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.replies = {

    /**
     * drive.replies.create
     *
     * @desc Creates a new reply to a comment.
     *
     * @alias drive.replies.create
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v3).Reply} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.replies.delete
     *
     * @desc Deletes a reply.
     *
     * @alias drive.replies.delete
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.replyId The ID of the reply.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies/{replyId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId', 'replyId'],
        pathParams: ['commentId', 'fileId', 'replyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.replies.get
     *
     * @desc Gets a reply by ID.
     *
     * @alias drive.replies.get
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted Whether to return deleted replies. Deleted replies will not include their original content.
     * @param {string} params.replyId The ID of the reply.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies/{replyId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId', 'replyId'],
        pathParams: ['commentId', 'fileId', 'replyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.replies.list
     *
     * @desc Lists a comment's replies.
     *
     * @alias drive.replies.list
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted Whether to include deleted replies. Deleted replies will not include their original content.
     * @param {integer=} params.pageSize The maximum number of replies to return per page.
     * @param {string=} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.replies.update
     *
     * @desc Updates a reply with patch semantics.
     *
     * @alias drive.replies.update
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.replyId The ID of the reply.
     * @param {drive(v3).Reply} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies/{replyId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId', 'replyId'],
        pathParams: ['commentId', 'fileId', 'replyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.revisions = {

    /**
     * drive.revisions.delete
     *
     * @desc Permanently deletes a revision. This method is only applicable to files with binary content in Drive.
     *
     * @alias drive.revisions.delete
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.revisionId The ID of the revision.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'revisionId'],
        pathParams: ['fileId', 'revisionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.revisions.get
     *
     * @desc Gets a revision's metadata or content by ID.
     *
     * @alias drive.revisions.get
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files. This is only applicable when alt=media.
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.revisionId The ID of the revision.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'revisionId'],
        pathParams: ['fileId', 'revisionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.revisions.list
     *
     * @desc Lists a file's revisions.
     *
     * @alias drive.revisions.list
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {integer=} params.pageSize The maximum number of revisions to return per page.
     * @param {string=} params.pageToken The token for continuing a previous list request on the next page. This should be set to the value of 'nextPageToken' from the previous response.
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.revisions.update
     *
     * @desc Updates a revision with patch semantics.
     *
     * @alias drive.revisions.update
     * @memberOf! drive(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.revisionId The ID of the revision.
     * @param {drive(v3).Revision} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'revisionId'],
        pathParams: ['fileId', 'revisionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef About
 * @memberOf! drive(v3)
 * @type object
 * @property {boolean} appInstalled Whether the user has installed the requesting app.
 * @property {object} exportFormats A map of source MIME type to possible targets for all supported exports.
 * @property {string[]} folderColorPalette The currently supported folder colors as RGB hex strings.
 * @property {object} importFormats A map of source MIME type to possible targets for all supported imports.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#about&quot;.
 * @property {object} maxImportSizes A map of maximum import sizes by MIME type, in bytes.
 * @property {string} maxUploadSize The maximum upload size in bytes.
 * @property {object} storageQuota The user&#39;s storage quota limits and usage. All fields are measured in bytes.
 * @property {drive(v3).User} user The authenticated user.
 */
/**
 * @typedef Change
 * @memberOf! drive(v3)
 * @type object
 * @property {drive(v3).File} file The updated state of the file. Present if the file has not been removed.
 * @property {string} fileId The ID of the file which has changed.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#change&quot;.
 * @property {boolean} removed Whether the file has been removed from the view of the changes list, for example by deletion or lost access.
 * @property {string} time The time of this change (RFC 3339 date-time).
 */
/**
 * @typedef ChangeList
 * @memberOf! drive(v3)
 * @type object
 * @property {drive(v3).Change[]} changes The page of changes.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#changeList&quot;.
 * @property {string} newStartPageToken The starting page token for future changes. This will be present only if the end of the current changes list has been reached.
 * @property {string} nextPageToken The page token for the next page of changes. This will be absent if the end of the current changes list has been reached.
 */
/**
 * @typedef Channel
 * @memberOf! drive(v3)
 * @type object
 * @property {string} address The address where notifications are delivered for this channel.
 * @property {string} expiration Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.
 * @property {string} id A UUID or similar unique string that identifies this channel.
 * @property {string} kind Identifies this as a notification channel used to watch for changes to a resource. Value: the fixed string &quot;api#channel&quot;.
 * @property {object} params Additional parameters controlling delivery channel behavior. Optional.
 * @property {boolean} payload A Boolean value to indicate whether payload is wanted. Optional.
 * @property {string} resourceId An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.
 * @property {string} resourceUri A version-specific identifier for the watched resource.
 * @property {string} token An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
 * @property {string} type The type of delivery mechanism used for this channel.
 */
/**
 * @typedef Comment
 * @memberOf! drive(v3)
 * @type object
 * @property {string} anchor A region of the document represented as a JSON string. See anchor documentation for details on how to define and interpret anchor properties.
 * @property {drive(v3).User} author The user who created the comment.
 * @property {string} content The plain text content of the comment. This field is used for setting the content, while htmlContent should be displayed.
 * @property {string} createdTime The time at which the comment was created (RFC 3339 date-time).
 * @property {boolean} deleted Whether the comment has been deleted. A deleted comment has no content.
 * @property {string} htmlContent The content of the comment with HTML formatting.
 * @property {string} id The ID of the comment.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#comment&quot;.
 * @property {string} modifiedTime The last time the comment or any of its replies was modified (RFC 3339 date-time).
 * @property {object} quotedFileContent The file content to which the comment refers, typically within the anchor region. For a text file, for example, this would be the text at the location of the comment.
 * @property {drive(v3).Reply[]} replies The full list of replies to the comment in chronological order.
 * @property {boolean} resolved Whether the comment has been resolved by one of its replies.
 */
/**
 * @typedef CommentList
 * @memberOf! drive(v3)
 * @type object
 * @property {drive(v3).Comment[]} comments The page of comments.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#commentList&quot;.
 * @property {string} nextPageToken The page token for the next page of comments. This will be absent if the end of the comments list has been reached.
 */
/**
 * @typedef File
 * @memberOf! drive(v3)
 * @type object
* @property {object} appProperties A collection of arbitrary key-value pairs which are private to the requesting app.
Entries with null values are cleared in update and copy requests.
* @property {object} capabilities Capabilities the current user has on the file.
* @property {object} contentHints Additional information about the content of the file. These fields are never populated in responses.
* @property {string} createdTime The time at which the file was created (RFC 3339 date-time).
* @property {string} description A short description of the file.
* @property {boolean} explicitlyTrashed Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.
* @property {string} fileExtension The final component of fullFileExtension. This is only available for files with binary content in Drive.
* @property {string} folderColorRgb The color for a folder as an RGB hex string. The supported colors are published in the folderColorPalette field of the About resource.
If an unsupported color is specified, the closest color in the palette will be used instead.
* @property {string} fullFileExtension The full file extension extracted from the name field. May contain multiple concatenated extensions, such as &quot;tar.gz&quot;. This is only available for files with binary content in Drive.
This is automatically updated when the name field changes, however it is not cleared if the new name does not contain a valid extension.
* @property {boolean} hasThumbnail Whether this file has a thumbnail.
* @property {string} headRevisionId The ID of the file&#39;s head revision. This is currently only available for files with binary content in Drive.
* @property {string} iconLink A static, unauthenticated link to the file&#39;s icon.
* @property {string} id The ID of the file.
* @property {object} imageMediaMetadata Additional metadata about image media, if available.
* @property {boolean} isAppAuthorized Whether the file was created or opened by the requesting app.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#file&quot;.
* @property {drive(v3).User} lastModifyingUser The last user to modify the file.
* @property {string} md5Checksum The MD5 checksum for the content of the file. This is only applicable to files with binary content in Drive.
* @property {string} mimeType The MIME type of the file.
Drive will attempt to automatically detect an appropriate value from uploaded content if no value is provided. The value cannot be changed unless a new revision is uploaded.
If a file is created with a Google Doc MIME type, the uploaded content will be imported if possible. The supported import formats are published in the About resource.
* @property {boolean} modifiedByMe Whether the file has been modified by this user.
* @property {string} modifiedByMeTime The last time the file was modified by the user (RFC 3339 date-time).
* @property {string} modifiedTime The last time the file was modified by anyone (RFC 3339 date-time).
Note that setting modifiedTime will also update modifiedByMeTime for the user.
* @property {string} name The name of the file. This is not necessarily unique within a folder.
* @property {string} originalFilename The original filename of the uploaded content if available, or else the original value of the name field. This is only available for files with binary content in Drive.
* @property {boolean} ownedByMe Whether the user owns the file.
* @property {drive(v3).User[]} owners The owners of the file. Currently, only certain legacy files may have more than one owner.
* @property {string[]} parents The IDs of the parent folders which contain the file.
If not specified as part of a create request, the file will be placed directly in the My Drive folder. Update requests must use the addParents and removeParents parameters to modify the values.
* @property {drive(v3).Permission[]} permissions The full list of permissions for the file. This is only available if the requesting user can share the file.
* @property {object} properties A collection of arbitrary key-value pairs which are visible to all apps.
Entries with null values are cleared in update and copy requests.
* @property {string} quotaBytesUsed The number of storage quota bytes used by the file. This includes the head revision as well as previous revisions with keepForever enabled.
* @property {boolean} shared Whether the file has been shared.
* @property {string} sharedWithMeTime The time at which the file was shared with the user, if applicable (RFC 3339 date-time).
* @property {drive(v3).User} sharingUser The user who shared the file with the requesting user, if applicable.
* @property {string} size The size of the file&#39;s content in bytes. This is only applicable to files with binary content in Drive.
* @property {string[]} spaces The list of spaces which contain the file. The currently supported values are &#39;drive&#39;, &#39;appDataFolder&#39; and &#39;photos&#39;.
* @property {boolean} starred Whether the user has starred the file.
* @property {string} thumbnailLink A short-lived link to the file&#39;s thumbnail, if available. Typically lasts on the order of hours. Only populated when the requesting app can access the file&#39;s content.
* @property {string} thumbnailVersion The thumbnail version for use in client-contructable thumbnail URLs or thumbnail cache invalidation.
* @property {boolean} trashed Whether the file has been trashed, either explicitly or from a trashed parent folder. Only the owner may trash a file, and other users cannot see files in the owner&#39;s trash.
* @property {string} version A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the user.
* @property {object} videoMediaMetadata Additional metadata about video media. This may not be available immediately upon upload.
* @property {boolean} viewedByMe Whether the file has been viewed by this user.
* @property {string} viewedByMeTime The last time the file was viewed by the user (RFC 3339 date-time).
* @property {boolean} viewersCanCopyContent Whether users with only reader or commenter permission can copy the file&#39;s content. This affects copy, download, and print operations.
* @property {string} webContentLink A link for downloading the content of the file in a browser. This is only available for files with binary content in Drive.
* @property {string} webViewLink A link for opening the file in a relevant Google editor or viewer in a browser.
* @property {boolean} writersCanShare Whether users with only writer permission can modify the file&#39;s permissions.
*/
/**
 * @typedef FileList
 * @memberOf! drive(v3)
 * @type object
 * @property {drive(v3).File[]} files The page of files.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#fileList&quot;.
 * @property {string} nextPageToken The page token for the next page of files. This will be absent if the end of the files list has been reached.
 */
/**
 * @typedef GeneratedIds
 * @memberOf! drive(v3)
 * @type object
 * @property {string[]} ids The IDs generated for the requesting user in the specified space.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#generatedIds&quot;.
 * @property {string} space The type of file that can be created with these IDs.
 */
/**
 * @typedef Permission
 * @memberOf! drive(v3)
 * @type object
* @property {boolean} allowFileDiscovery Whether the permission allows the file to be discovered through search. This is only applicable for permissions of type domain or anyone.
* @property {string} displayName A displayable name for users, groups or domains.
* @property {string} domain The domain to which this permission refers.
* @property {string} emailAddress The email address of the user or group to which this permission refers.
* @property {string} expirationTime The time at which this permission will expire (RFC 3339 date-time).
* @property {string} id The ID of this permission. This is a unique identifier for the grantee, and is published in User resources as permissionId.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#permission&quot;.
* @property {string} photoLink A link to the user&#39;s profile photo, if available.
* @property {string} role The role granted by this permission. Valid values are:  
- owner 
- writer 
- commenter 
- reader
* @property {string} type The type of the grantee. Valid values are:  
- user 
- group 
- domain 
- anyone
*/
/**
 * @typedef PermissionList
 * @memberOf! drive(v3)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#permissionList&quot;.
 * @property {drive(v3).Permission[]} permissions The full list of permissions.
 */
/**
 * @typedef Reply
 * @memberOf! drive(v3)
 * @type object
* @property {string} action The action the reply performed to the parent comment. Valid values are:  
- resolve 
- reopen
* @property {drive(v3).User} author The user who created the reply.
* @property {string} content The plain text content of the reply. This field is used for setting the content, while htmlContent should be displayed. This is required on creates if no action is specified.
* @property {string} createdTime The time at which the reply was created (RFC 3339 date-time).
* @property {boolean} deleted Whether the reply has been deleted. A deleted reply has no content.
* @property {string} htmlContent The content of the reply with HTML formatting.
* @property {string} id The ID of the reply.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#reply&quot;.
* @property {string} modifiedTime The last time the reply was modified (RFC 3339 date-time).
*/
/**
 * @typedef ReplyList
 * @memberOf! drive(v3)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#replyList&quot;.
 * @property {string} nextPageToken The page token for the next page of replies. This will be absent if the end of the replies list has been reached.
 * @property {drive(v3).Reply[]} replies The page of replies.
 */
/**
 * @typedef Revision
 * @memberOf! drive(v3)
 * @type object
* @property {string} id The ID of the revision.
* @property {boolean} keepForever Whether to keep this revision forever, even if it is no longer the head revision. If not set, the revision will be automatically purged 30 days after newer content is uploaded. This can be set on a maximum of 200 revisions for a file.
This field is only applicable to files with binary content in Drive.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#revision&quot;.
* @property {drive(v3).User} lastModifyingUser The last user to modify this revision.
* @property {string} md5Checksum The MD5 checksum of the revision&#39;s content. This is only applicable to files with binary content in Drive.
* @property {string} mimeType The MIME type of the revision.
* @property {string} modifiedTime The last time the revision was modified (RFC 3339 date-time).
* @property {string} originalFilename The original filename used to create this revision. This is only applicable to files with binary content in Drive.
* @property {boolean} publishAuto Whether subsequent revisions will be automatically republished. This is only applicable to Google Docs.
* @property {boolean} published Whether this revision is published. This is only applicable to Google Docs.
* @property {boolean} publishedOutsideDomain Whether this revision is published outside the domain. This is only applicable to Google Docs.
* @property {string} size The size of the revision&#39;s content in bytes. This is only applicable to files with binary content in Drive.
*/
/**
 * @typedef RevisionList
 * @memberOf! drive(v3)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#revisionList&quot;.
 * @property {string} nextPageToken The page token for the next page of revisions. This will be absent if the end of the revisions list has been reached.
 * @property {drive(v3).Revision[]} revisions The full list of revisions.
 */
/**
 * @typedef StartPageToken
 * @memberOf! drive(v3)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#startPageToken&quot;.
 * @property {string} startPageToken The starting page token for listing changes.
 */
/**
 * @typedef User
 * @memberOf! drive(v3)
 * @type object
 * @property {string} displayName A plain text displayable name for this user.
 * @property {string} emailAddress The email address of the user. This may not be present in certain contexts if the user has not made their email address visible to the requester.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;drive#user&quot;.
 * @property {boolean} me Whether this user is the requesting user.
 * @property {string} permissionId The user&#39;s ID as visible in Permission resources.
 * @property {string} photoLink A link to the user&#39;s profile photo, if available.
 */
module.exports = Drive;
