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
 * var drive = google.drive('v2');
 *
 * @namespace drive
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Drive
 */
function Drive(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.about = {

    /**
     * drive.about.get
     *
     * @desc Gets the information about the current user along with Drive API settings
     *
     * @alias drive.about.get
     * @memberOf! drive(v2)
     *
     * @param {object=} params Parameters for request
     * @param {boolean=} params.includeSubscribed When calculating the number of remaining change IDs, whether to include public files the user has opened and shared files. When set to false, this counts only change IDs for owned files and any shared or public files that the user has explicitly added to a folder they own.
     * @param {string=} params.maxChangeIdCount Maximum number of remaining change IDs to count
     * @param {string=} params.startChangeId Change ID to start counting from when calculating number of remaining change IDs
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
          url: 'https://www.googleapis.com/drive/v2/about',
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

  self.apps = {

    /**
     * drive.apps.get
     *
     * @desc Gets a specific app.
     *
     * @alias drive.apps.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.appId The ID of the app.
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
          url: 'https://www.googleapis.com/drive/v2/apps/{appId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['appId'],
        pathParams: ['appId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.apps.list
     *
     * @desc Lists a user's installed apps.
     *
     * @alias drive.apps.list
     * @memberOf! drive(v2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.appFilterExtensions A comma-separated list of file extensions for open with filtering. All apps within the given app query scope which can open any of the given file extensions will be included in the response. If appFilterMimeTypes are provided as well, the result is a union of the two resulting app lists.
     * @param {string=} params.appFilterMimeTypes A comma-separated list of MIME types for open with filtering. All apps within the given app query scope which can open any of the given MIME types will be included in the response. If appFilterExtensions are provided as well, the result is a union of the two resulting app lists.
     * @param {string=} params.languageCode A language or locale code, as defined by BCP 47, with some extensions from Unicode's LDML format (http://www.unicode.org/reports/tr35/).
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
          url: 'https://www.googleapis.com/drive/v2/apps',
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
     * drive.changes.get
     *
     * @desc Gets a specific change.
     *
     * @alias drive.changes.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.changeId The ID of the change.
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
          url: 'https://www.googleapis.com/drive/v2/changes/{changeId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['changeId'],
        pathParams: ['changeId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.changes.list
     *
     * @desc Lists the changes for a user.
     *
     * @alias drive.changes.list
     * @memberOf! drive(v2)
     *
     * @param {object=} params Parameters for request
     * @param {boolean=} params.includeDeleted Whether to include deleted items.
     * @param {boolean=} params.includeSubscribed Whether to include public files the user has opened and shared files. When set to false, the list only includes owned files plus any shared or public files the user has explicitly added to a folder they own.
     * @param {integer=} params.maxResults Maximum number of changes to return.
     * @param {string=} params.pageToken Page token for changes.
     * @param {string=} params.spaces A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'.
     * @param {string=} params.startChangeId Change ID to start listing changes from.
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
          url: 'https://www.googleapis.com/drive/v2/changes',
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
     * drive.changes.watch
     *
     * @desc Subscribe to changes for a user.
     *
     * @alias drive.changes.watch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.includeDeleted Whether to include deleted items.
     * @param {boolean=} params.includeSubscribed Whether to include public files the user has opened and shared files. When set to false, the list only includes owned files plus any shared or public files the user has explicitly added to a folder they own.
     * @param {integer=} params.maxResults Maximum number of changes to return.
     * @param {string=} params.pageToken Page token for changes.
     * @param {string=} params.spaces A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'.
     * @param {string=} params.startChangeId Change ID to start listing changes from.
     * @param {drive(v2).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/changes/watch',
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

  self.channels = {

    /**
     * drive.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias drive.channels.stop
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {drive(v2).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/channels/stop',
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

  self.children = {

    /**
     * drive.children.delete
     *
     * @desc Removes a child from a folder.
     *
     * @alias drive.children.delete
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.childId The ID of the child.
     * @param {string} params.folderId The ID of the folder.
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
          url: 'https://www.googleapis.com/drive/v2/files/{folderId}/children/{childId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['folderId', 'childId'],
        pathParams: ['childId', 'folderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.children.get
     *
     * @desc Gets a specific child reference.
     *
     * @alias drive.children.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.childId The ID of the child.
     * @param {string} params.folderId The ID of the folder.
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
          url: 'https://www.googleapis.com/drive/v2/files/{folderId}/children/{childId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['folderId', 'childId'],
        pathParams: ['childId', 'folderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.children.insert
     *
     * @desc Inserts a file into a folder.
     *
     * @alias drive.children.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.folderId The ID of the folder.
     * @param {drive(v2).ChildReference} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{folderId}/children',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['folderId'],
        pathParams: ['folderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.children.list
     *
     * @desc Lists a folder's children.
     *
     * @alias drive.children.list
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.folderId The ID of the folder.
     * @param {integer=} params.maxResults Maximum number of children to return.
     * @param {string=} params.orderBy A comma-separated list of sort keys. Valid keys are 'createdDate', 'folder', 'lastViewedByMeDate', 'modifiedByMeDate', 'modifiedDate', 'quotaBytesUsed', 'recency', 'sharedWithMeDate', 'starred', and 'title'. Each key sorts ascending by default, but may be reversed with the 'desc' modifier. Example usage: ?orderBy=folder,modifiedDate desc,title. Please note that there is a current limitation for users with approximately one million files in which the requested sort order is ignored.
     * @param {string=} params.pageToken Page token for children.
     * @param {string=} params.q Query string for searching children.
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
          url: 'https://www.googleapis.com/drive/v2/files/{folderId}/children',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['folderId'],
        pathParams: ['folderId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.comments = {

    /**
     * drive.comments.delete
     *
     * @desc Deletes a comment.
     *
     * @alias drive.comments.delete
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}',
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
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted If set, this will succeed when retrieving a deleted comment, and will include any deleted replies.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}',
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
     * drive.comments.insert
     *
     * @desc Creates a new comment on the given file.
     *
     * @alias drive.comments.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments',
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
     * drive.comments.list
     *
     * @desc Lists a file's comments.
     *
     * @alias drive.comments.list
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted If set, all comments and replies, including deleted comments and replies (with content stripped) will be returned.
     * @param {integer=} params.maxResults The maximum number of discussions to include in the response, used for paging.
     * @param {string=} params.pageToken The continuation token, used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string=} params.updatedMin Only discussions that were updated after this timestamp will be returned. Formatted as an RFC 3339 timestamp.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments',
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
     * drive.comments.patch
     *
     * @desc Updates an existing comment. This method supports patch semantics.
     *
     * @alias drive.comments.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId'],
        pathParams: ['commentId', 'fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.comments.update
     *
     * @desc Updates an existing comment.
     *
     * @alias drive.comments.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}',
          method: 'PUT'
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
     * @desc Creates a copy of the specified file.
     *
     * @alias drive.files.copy
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.convert Whether to convert this file to the corresponding Google Docs format.
     * @param {string} params.fileId The ID of the file to copy.
     * @param {boolean=} params.ocr Whether to attempt OCR on .jpg, .png, .gif, or .pdf uploads.
     * @param {string=} params.ocrLanguage If ocr is true, hints at the language to use. Valid values are BCP 47 codes.
     * @param {boolean=} params.pinned Whether to pin the head revision of the new copy. A file can have a maximum of 200 pinned revisions.
     * @param {string=} params.timedTextLanguage The language of the timed text.
     * @param {string=} params.timedTextTrackName The timed text track name.
     * @param {string=} params.visibility The visibility of the new file. This parameter is only relevant when the source is not a native Google Doc and convert=false.
     * @param {drive(v2).File} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/copy',
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
     * drive.files.delete
     *
     * @desc Permanently deletes a file by ID. Skips the trash. The currently authenticated user must own the file.
     *
     * @alias drive.files.delete
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file to delete.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}',
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
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/trash',
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
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/export',
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
     * @desc Generates a set of file IDs which can be provided in insert requests.
     *
     * @alias drive.files.generateIds
     * @memberOf! drive(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of IDs to return.
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
          url: 'https://www.googleapis.com/drive/v2/files/generateIds',
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
     * @desc Gets a file's metadata by ID.
     *
     * @alias drive.files.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files.
     * @param {string} params.fileId The ID for the file in question.
     * @param {string=} params.projection This parameter is deprecated and has no function.
     * @param {string=} params.revisionId Specifies the Revision ID that should be downloaded. Ignored unless alt=media is specified.
     * @param {boolean=} params.updateViewedDate Deprecated: Use files.update with modifiedDateBehavior=noChange, updateViewedDate=true and an empty request body.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}',
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
     * drive.files.insert
     *
     * @desc Insert a new file.
     *
     * @alias drive.files.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.convert Whether to convert this file to the corresponding Google Docs format.
     * @param {boolean=} params.ocr Whether to attempt OCR on .jpg, .png, .gif, or .pdf uploads.
     * @param {string=} params.ocrLanguage If ocr is true, hints at the language to use. Valid values are BCP 47 codes.
     * @param {boolean=} params.pinned Whether to pin the head revision of the uploaded file. A file can have a maximum of 200 pinned revisions.
     * @param {string=} params.timedTextLanguage The language of the timed text.
     * @param {string=} params.timedTextTrackName The timed text track name.
     * @param {boolean=} params.useContentAsIndexableText Whether to use the content as indexable text.
     * @param {string=} params.visibility The visibility of the new file. This parameter is only relevant when convert=false.
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
          url: 'https://www.googleapis.com/drive/v2/files',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/drive/v2/files',
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.list
     *
     * @desc Lists the user's files.
     *
     * @alias drive.files.list
     * @memberOf! drive(v2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.corpus The body of items (files/documents) to which the query applies.
     * @param {integer=} params.maxResults Maximum number of files to return.
     * @param {string=} params.orderBy A comma-separated list of sort keys. Valid keys are 'createdDate', 'folder', 'lastViewedByMeDate', 'modifiedByMeDate', 'modifiedDate', 'quotaBytesUsed', 'recency', 'sharedWithMeDate', 'starred', and 'title'. Each key sorts ascending by default, but may be reversed with the 'desc' modifier. Example usage: ?orderBy=folder,modifiedDate desc,title. Please note that there is a current limitation for users with approximately one million files in which the requested sort order is ignored.
     * @param {string=} params.pageToken Page token for files.
     * @param {string=} params.projection This parameter is deprecated and has no function.
     * @param {string=} params.q Query string for searching files.
     * @param {string=} params.spaces A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'.
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
          url: 'https://www.googleapis.com/drive/v2/files',
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
     * drive.files.patch
     *
     * @desc Updates file metadata and/or content. This method supports patch semantics.
     *
     * @alias drive.files.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.addParents Comma-separated list of parent IDs to add.
     * @param {boolean=} params.convert This parameter is deprecated and has no function.
     * @param {string} params.fileId The ID of the file to update.
     * @param {string=} params.modifiedDateBehavior Determines the behavior in which modifiedDate is updated. This overrides setModifiedDate.
     * @param {boolean=} params.newRevision Whether a blob upload should create a new revision. If false, the blob data in the current head revision is replaced. If true or not set, a new blob is created as head revision, and previous unpinned revisions are preserved for a short period of time. Pinned revisions are stored indefinitely, using additional storage quota, up to a maximum of 200 revisions. For details on how revisions are retained, see the Drive Help Center.
     * @param {boolean=} params.ocr Whether to attempt OCR on .jpg, .png, .gif, or .pdf uploads.
     * @param {string=} params.ocrLanguage If ocr is true, hints at the language to use. Valid values are BCP 47 codes.
     * @param {boolean=} params.pinned Whether to pin the new revision. A file can have a maximum of 200 pinned revisions.
     * @param {string=} params.removeParents Comma-separated list of parent IDs to remove.
     * @param {boolean=} params.setModifiedDate Whether to set the modified date with the supplied modified date.
     * @param {string=} params.timedTextLanguage The language of the timed text.
     * @param {string=} params.timedTextTrackName The timed text track name.
     * @param {boolean=} params.updateViewedDate Whether to update the view date after successfully updating the file.
     * @param {boolean=} params.useContentAsIndexableText Whether to use the content as indexable text.
     * @param {drive(v2).File} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.touch
     *
     * @desc Set the file's updated time to the current server time.
     *
     * @alias drive.files.touch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file to update.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    touch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/touch',
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
     * drive.files.trash
     *
     * @desc Moves a file to the trash. The currently authenticated user must own the file.
     *
     * @alias drive.files.trash
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file to trash.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/trash',
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
     * drive.files.untrash
     *
     * @desc Restores a file from the trash.
     *
     * @alias drive.files.untrash
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file to untrash.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/untrash',
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
     * drive.files.update
     *
     * @desc Updates file metadata and/or content.
     *
     * @alias drive.files.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.addParents Comma-separated list of parent IDs to add.
     * @param {boolean=} params.convert This parameter is deprecated and has no function.
     * @param {string} params.fileId The ID of the file to update.
     * @param {string=} params.modifiedDateBehavior Determines the behavior in which modifiedDate is updated. This overrides setModifiedDate.
     * @param {boolean=} params.newRevision Whether a blob upload should create a new revision. If false, the blob data in the current head revision is replaced. If true or not set, a new blob is created as head revision, and previous unpinned revisions are preserved for a short period of time. Pinned revisions are stored indefinitely, using additional storage quota, up to a maximum of 200 revisions. For details on how revisions are retained, see the Drive Help Center.
     * @param {boolean=} params.ocr Whether to attempt OCR on .jpg, .png, .gif, or .pdf uploads.
     * @param {string=} params.ocrLanguage If ocr is true, hints at the language to use. Valid values are BCP 47 codes.
     * @param {boolean=} params.pinned Whether to pin the new revision. A file can have a maximum of 200 pinned revisions.
     * @param {string=} params.removeParents Comma-separated list of parent IDs to remove.
     * @param {boolean=} params.setModifiedDate Whether to set the modified date with the supplied modified date.
     * @param {string=} params.timedTextLanguage The language of the timed text.
     * @param {string=} params.timedTextTrackName The timed text track name.
     * @param {boolean=} params.updateViewedDate Whether to update the view date after successfully updating the file.
     * @param {boolean=} params.useContentAsIndexableText Whether to use the content as indexable text.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}',
          method: 'PUT'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/drive/v2/files/{fileId}',
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.files.watch
     *
     * @desc Subscribe to changes on a file
     *
     * @alias drive.files.watch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acknowledgeAbuse Whether the user is acknowledging the risk of downloading known malware or other abusive files.
     * @param {string} params.fileId The ID for the file in question.
     * @param {string=} params.projection This parameter is deprecated and has no function.
     * @param {string=} params.revisionId Specifies the Revision ID that should be downloaded. Ignored unless alt=media is specified.
     * @param {boolean=} params.updateViewedDate Deprecated: Use files.update with modifiedDateBehavior=noChange, updateViewedDate=true and an empty request body.
     * @param {drive(v2).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/watch',
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

  self.parents = {

    /**
     * drive.parents.delete
     *
     * @desc Removes a parent from a file.
     *
     * @alias drive.parents.delete
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.parentId The ID of the parent.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/parents/{parentId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'parentId'],
        pathParams: ['fileId', 'parentId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.parents.get
     *
     * @desc Gets a specific parent reference.
     *
     * @alias drive.parents.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.parentId The ID of the parent.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/parents/{parentId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'parentId'],
        pathParams: ['fileId', 'parentId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.parents.insert
     *
     * @desc Adds a parent folder for a file.
     *
     * @alias drive.parents.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).ParentReference} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/parents',
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
     * drive.parents.list
     *
     * @desc Lists a file's parents.
     *
     * @alias drive.parents.list
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/parents',
          method: 'GET'
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
     * drive.permissions.delete
     *
     * @desc Deletes a permission from a file.
     *
     * @alias drive.permissions.delete
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.permissionId The ID for the permission.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions/{permissionId}',
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
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.permissionId The ID for the permission.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions/{permissionId}',
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
     * drive.permissions.getIdForEmail
     *
     * @desc Returns the permission ID for an email address.
     *
     * @alias drive.permissions.getIdForEmail
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.email The email address for which to return a permission ID
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIdForEmail: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/drive/v2/permissionIds/{email}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['email'],
        pathParams: ['email'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.insert
     *
     * @desc Inserts a permission for a file.
     *
     * @alias drive.permissions.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.emailMessage A custom message to include in notification emails.
     * @param {string} params.fileId The ID for the file.
     * @param {boolean=} params.sendNotificationEmails Whether to send notification emails when sharing to users or groups. This parameter is ignored and an email is sent if the role is owner.
     * @param {drive(v2).Permission} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions',
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
     * drive.permissions.list
     *
     * @desc Lists a file's permissions.
     *
     * @alias drive.permissions.list
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions',
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
     * drive.permissions.patch
     *
     * @desc Updates a permission using patch semantics.
     *
     * @alias drive.permissions.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.permissionId The ID for the permission.
     * @param {boolean=} params.removeExpiration Whether to remove the expiration date.
     * @param {boolean=} params.transferOwnership Whether changing a role to 'owner' downgrades the current owners to writers. Does nothing if the specified role is not 'owner'.
     * @param {drive(v2).Permission} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions/{permissionId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'permissionId'],
        pathParams: ['fileId', 'permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.permissions.update
     *
     * @desc Updates a permission.
     *
     * @alias drive.permissions.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.permissionId The ID for the permission.
     * @param {boolean=} params.removeExpiration Whether to remove the expiration date.
     * @param {boolean=} params.transferOwnership Whether changing a role to 'owner' downgrades the current owners to writers. Does nothing if the specified role is not 'owner'.
     * @param {drive(v2).Permission} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions/{permissionId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['fileId', 'permissionId'],
        pathParams: ['fileId', 'permissionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.properties = {

    /**
     * drive.properties.delete
     *
     * @desc Deletes a property.
     *
     * @alias drive.properties.delete
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.propertyKey The key of the property.
     * @param {string=} params.visibility The visibility of the property.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties/{propertyKey}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['fileId', 'propertyKey'],
        pathParams: ['fileId', 'propertyKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.properties.get
     *
     * @desc Gets a property by its key.
     *
     * @alias drive.properties.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.propertyKey The key of the property.
     * @param {string=} params.visibility The visibility of the property.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties/{propertyKey}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['fileId', 'propertyKey'],
        pathParams: ['fileId', 'propertyKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.properties.insert
     *
     * @desc Adds a property to a file, or updates it if it already exists.
     *
     * @alias drive.properties.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).Property} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties',
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
     * drive.properties.list
     *
     * @desc Lists a file's properties.
     *
     * @alias drive.properties.list
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties',
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
     * drive.properties.patch
     *
     * @desc Updates a property, or adds it if it doesn't exist. This method supports patch semantics.
     *
     * @alias drive.properties.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.propertyKey The key of the property.
     * @param {string=} params.visibility The visibility of the property.
     * @param {drive(v2).Property} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties/{propertyKey}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'propertyKey'],
        pathParams: ['fileId', 'propertyKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.properties.update
     *
     * @desc Updates a property, or adds it if it doesn't exist.
     *
     * @alias drive.properties.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.propertyKey The key of the property.
     * @param {string=} params.visibility The visibility of the property.
     * @param {drive(v2).Property} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/properties/{propertyKey}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['fileId', 'propertyKey'],
        pathParams: ['fileId', 'propertyKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.realtime = {

    /**
     * drive.realtime.get
     *
     * @desc Exports the contents of the Realtime API data model associated with this file as JSON.
     *
     * @alias drive.realtime.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file that the Realtime API data model is associated with.
     * @param {integer=} params.revision The revision of the Realtime API data model to export. Revisions start at 1 (the initial empty data model) and are incremented with each change. If this parameter is excluded, the most recent data model will be returned.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/realtime',
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
     * drive.realtime.update
     *
     * @desc Overwrites the Realtime API data model associated with this file with the provided JSON data model.
     *
     * @alias drive.realtime.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.baseRevision The revision of the model to diff the uploaded model against. If set, the uploaded model is diffed against the provided revision and those differences are merged with any changes made to the model after the provided revision. If not set, the uploaded model replaces the current model on the server.
     * @param {string} params.fileId The ID of the file that the Realtime API data model is associated with.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/realtime',
          method: 'PUT'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/drive/v2/files/{fileId}/realtime',
        requiredParams: ['fileId'],
        pathParams: ['fileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.replies = {

    /**
     * drive.replies.delete
     *
     * @desc Deletes a reply.
     *
     * @alias drive.replies.delete
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies/{replyId}',
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
     * @desc Gets a reply.
     *
     * @alias drive.replies.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted If set, this will succeed when retrieving a deleted reply.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies/{replyId}',
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
     * drive.replies.insert
     *
     * @desc Creates a new reply to the given comment.
     *
     * @alias drive.replies.insert
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {drive(v2).CommentReply} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies',
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
     * drive.replies.list
     *
     * @desc Lists all of the replies to a comment.
     *
     * @alias drive.replies.list
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {boolean=} params.includeDeleted If set, all replies, including deleted replies (with content stripped) will be returned.
     * @param {integer=} params.maxResults The maximum number of replies to include in the response, used for paging.
     * @param {string=} params.pageToken The continuation token, used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies',
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
     * drive.replies.patch
     *
     * @desc Updates an existing reply. This method supports patch semantics.
     *
     * @alias drive.replies.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.replyId The ID of the reply.
     * @param {drive(v2).CommentReply} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies/{replyId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'commentId', 'replyId'],
        pathParams: ['commentId', 'fileId', 'replyId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.replies.update
     *
     * @desc Updates an existing reply.
     *
     * @alias drive.replies.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment.
     * @param {string} params.fileId The ID of the file.
     * @param {string} params.replyId The ID of the reply.
     * @param {drive(v2).CommentReply} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/comments/{commentId}/replies/{replyId}',
          method: 'PUT'
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
     * @desc Removes a revision.
     *
     * @alias drive.revisions.delete
     * @memberOf! drive(v2)
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/revisions/{revisionId}',
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
     * @desc Gets a specific revision.
     *
     * @alias drive.revisions.get
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/revisions/{revisionId}',
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
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the file.
     * @param {integer=} params.maxResults Maximum number of revisions to return.
     * @param {string=} params.pageToken Page token for revisions. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/revisions',
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
     * drive.revisions.patch
     *
     * @desc Updates a revision. This method supports patch semantics.
     *
     * @alias drive.revisions.patch
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.revisionId The ID for the revision.
     * @param {drive(v2).Revision} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/revisions/{revisionId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['fileId', 'revisionId'],
        pathParams: ['fileId', 'revisionId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * drive.revisions.update
     *
     * @desc Updates a revision.
     *
     * @alias drive.revisions.update
     * @memberOf! drive(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID for the file.
     * @param {string} params.revisionId The ID for the revision.
     * @param {drive(v2).Revision} params.resource Request body data
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
          url: 'https://www.googleapis.com/drive/v2/files/{fileId}/revisions/{revisionId}',
          method: 'PUT'
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
 * @memberOf! drive(v2)
 * @type object
* @property {object[]} additionalRoleInfo Information about supported additional roles per file type. The most specific type takes precedence.
* @property {string} domainSharingPolicy The domain sharing policy for the current user. Possible values are:  
- allowed 
- allowedWithWarning 
- incomingOnly 
- disallowed
* @property {string} etag The ETag of the item.
* @property {object[]} exportFormats The allowable export formats.
* @property {object[]} features List of additional features enabled on this account.
* @property {string[]} folderColorPalette The palette of allowable folder colors as RGB hex strings.
* @property {object[]} importFormats The allowable import formats.
* @property {boolean} isCurrentAppInstalled A boolean indicating whether the authenticated app is installed by the authenticated user.
* @property {string} kind This is always drive#about.
* @property {string} languageCode The user&#39;s language or locale code, as defined by BCP 47, with some extensions from Unicode&#39;s LDML format (http://www.unicode.org/reports/tr35/).
* @property {string} largestChangeId The largest change id.
* @property {object[]} maxUploadSizes List of max upload sizes for each file type. The most specific type takes precedence.
* @property {string} name The name of the current user.
* @property {string} permissionId The current user&#39;s ID as visible in the permissions collection.
* @property {object[]} quotaBytesByService The amount of storage quota used by different Google services.
* @property {string} quotaBytesTotal The total number of quota bytes.
* @property {string} quotaBytesUsed The number of quota bytes used by Google Drive.
* @property {string} quotaBytesUsedAggregate The number of quota bytes used by all Google apps (Drive, Picasa, etc.).
* @property {string} quotaBytesUsedInTrash The number of quota bytes used by trashed items.
* @property {string} quotaType The type of the user&#39;s storage quota. Possible values are:  
- LIMITED 
- UNLIMITED
* @property {string} remainingChangeIds The number of remaining change ids, limited to no more than 2500.
* @property {string} rootFolderId The id of the root folder.
* @property {string} selfLink A link back to this item.
* @property {drive(v2).User} user The authenticated user.
*/
/**
 * @typedef App
 * @memberOf! drive(v2)
 * @type object
 * @property {boolean} authorized Whether the app is authorized to access data on the user&#39;s Drive.
 * @property {string} createInFolderTemplate The template url to create a new file with this app in a given folder. The template will contain {folderId} to be replaced by the folder to create the new file in.
 * @property {string} createUrl The url to create a new file with this app.
 * @property {boolean} hasDriveWideScope Whether the app has drive-wide scope. An app with drive-wide scope can access all files in the user&#39;s drive.
 * @property {object[]} icons The various icons for the app.
 * @property {string} id The ID of the app.
 * @property {boolean} installed Whether the app is installed.
 * @property {string} kind This is always drive#app.
 * @property {string} longDescription A long description of the app.
 * @property {string} name The name of the app.
 * @property {string} objectType The type of object this app creates (e.g. Chart). If empty, the app name should be used instead.
 * @property {string} openUrlTemplate The template url for opening files with this app. The template will contain {ids} and/or {exportIds} to be replaced by the actual file ids. See  Open Files  for the full documentation.
 * @property {string[]} primaryFileExtensions The list of primary file extensions.
 * @property {string[]} primaryMimeTypes The list of primary mime types.
 * @property {string} productId The ID of the product listing for this app.
 * @property {string} productUrl A link to the product listing for this app.
 * @property {string[]} secondaryFileExtensions The list of secondary file extensions.
 * @property {string[]} secondaryMimeTypes The list of secondary mime types.
 * @property {string} shortDescription A short description of the app.
 * @property {boolean} supportsCreate Whether this app supports creating new objects.
 * @property {boolean} supportsImport Whether this app supports importing Google Docs.
 * @property {boolean} supportsMultiOpen Whether this app supports opening more than one file.
 * @property {boolean} supportsOfflineCreate Whether this app supports creating new files when offline.
 * @property {boolean} useByDefault Whether the app is selected as the default handler for the types it supports.
 */
/**
 * @typedef AppList
 * @memberOf! drive(v2)
 * @type object
 * @property {string[]} defaultAppIds List of app IDs that the user has specified to use by default. The list is in reverse-priority order (lowest to highest).
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).App[]} items The actual list of apps.
 * @property {string} kind This is always drive#appList.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef Change
 * @memberOf! drive(v2)
 * @type object
 * @property {boolean} deleted Whether the file has been deleted.
 * @property {drive(v2).File} file The updated state of the file. Present if the file has not been deleted.
 * @property {string} fileId The ID of the file associated with this change.
 * @property {string} id The ID of the change.
 * @property {string} kind This is always drive#change.
 * @property {string} modificationDate The time of this modification.
 * @property {string} selfLink A link back to this change.
 */
/**
 * @typedef ChangeList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).Change[]} items The actual list of changes.
 * @property {string} kind This is always drive#changeList.
 * @property {string} largestChangeId The current largest change ID.
 * @property {string} nextLink A link to the next page of changes.
 * @property {string} nextPageToken The page token for the next page of changes.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef Channel
 * @memberOf! drive(v2)
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
 * @typedef ChildList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).ChildReference[]} items The actual list of children.
 * @property {string} kind This is always drive#childList.
 * @property {string} nextLink A link to the next page of children.
 * @property {string} nextPageToken The page token for the next page of children.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef ChildReference
 * @memberOf! drive(v2)
 * @type object
 * @property {string} childLink A link to the child.
 * @property {string} id The ID of the child.
 * @property {string} kind This is always drive#childReference.
 * @property {string} selfLink A link back to this reference.
 */
/**
 * @typedef Comment
 * @memberOf! drive(v2)
 * @type object
* @property {string} anchor A region of the document represented as a JSON string. See anchor documentation for details on how to define and interpret anchor properties.
* @property {drive(v2).User} author The user who wrote this comment.
* @property {string} commentId The ID of the comment.
* @property {string} content The plain text content used to create this comment. This is not HTML safe and should only be used as a starting point to make edits to a comment&#39;s content.
* @property {object} context The context of the file which is being commented on.
* @property {string} createdDate The date when this comment was first created.
* @property {boolean} deleted Whether this comment has been deleted. If a comment has been deleted the content will be cleared and this will only represent a comment that once existed.
* @property {string} fileId The file which this comment is addressing.
* @property {string} fileTitle The title of the file which this comment is addressing.
* @property {string} htmlContent HTML formatted content for this comment.
* @property {string} kind This is always drive#comment.
* @property {string} modifiedDate The date when this comment or any of its replies were last modified.
* @property {drive(v2).CommentReply[]} replies Replies to this post.
* @property {string} selfLink A link back to this comment.
* @property {string} status The status of this comment. Status can be changed by posting a reply to a comment with the desired status.  
- &quot;open&quot; - The comment is still open. 
- &quot;resolved&quot; - The comment has been resolved by one of its replies.
*/
/**
 * @typedef CommentList
 * @memberOf! drive(v2)
 * @type object
 * @property {drive(v2).Comment[]} items List of comments.
 * @property {string} kind This is always drive#commentList.
 * @property {string} nextLink A link to the next page of comments.
 * @property {string} nextPageToken The token to use to request the next page of results.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef CommentReply
 * @memberOf! drive(v2)
 * @type object
* @property {drive(v2).User} author The user who wrote this reply.
* @property {string} content The plain text content used to create this reply. This is not HTML safe and should only be used as a starting point to make edits to a reply&#39;s content. This field is required on inserts if no verb is specified (resolve/reopen).
* @property {string} createdDate The date when this reply was first created.
* @property {boolean} deleted Whether this reply has been deleted. If a reply has been deleted the content will be cleared and this will only represent a reply that once existed.
* @property {string} htmlContent HTML formatted content for this reply.
* @property {string} kind This is always drive#commentReply.
* @property {string} modifiedDate The date when this reply was last modified.
* @property {string} replyId The ID of the reply.
* @property {string} verb The action this reply performed to the parent comment. When creating a new reply this is the action to be perform to the parent comment. Possible values are:  
- &quot;resolve&quot; - To resolve a comment. 
- &quot;reopen&quot; - To reopen (un-resolve) a comment.
*/
/**
 * @typedef CommentReplyList
 * @memberOf! drive(v2)
 * @type object
 * @property {drive(v2).CommentReply[]} items List of reply.
 * @property {string} kind This is always drive#commentReplyList.
 * @property {string} nextLink A link to the next page of replies.
 * @property {string} nextPageToken The token to use to request the next page of results.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef File
 * @memberOf! drive(v2)
 * @type object
* @property {string} alternateLink A link for opening the file in a relevant Google editor or viewer.
* @property {boolean} appDataContents Whether this file is in the Application Data folder.
* @property {boolean} canComment Whether the current user can comment on the file.
* @property {boolean} canReadRevisions Whether the current user has read access to the Revisions resource of the file.
* @property {boolean} copyable Whether the file can be copied by the current user.
* @property {string} createdDate Create time for this file (formatted RFC 3339 timestamp).
* @property {string} defaultOpenWithLink A link to open this file with the user&#39;s default app for this file. Only populated when the drive.apps.readonly scope is used.
* @property {string} description A short description of the file.
* @property {string} downloadUrl 
* @property {boolean} editable Whether the file can be edited by the current user.
* @property {string} embedLink A link for embedding the file.
* @property {string} etag ETag of the file.
* @property {boolean} explicitlyTrashed Whether this file has been explicitly trashed, as opposed to recursively trashed.
* @property {object} exportLinks Links for exporting Google Docs to specific formats.
* @property {string} fileExtension The final component of fullFileExtension with trailing text that does not appear to be part of the extension removed. This field is only populated for files with content stored in Drive; it is not populated for Google Docs or shortcut files.
* @property {string} fileSize The size of the file in bytes. This field is only populated for files with content stored in Drive; it is not populated for Google Docs or shortcut files.
* @property {string} folderColorRgb Folder color as an RGB hex string if the file is a folder. The list of supported colors is available in the folderColorPalette field of the About resource. If an unsupported color is specified, it will be changed to the closest color in the palette.
* @property {string} fullFileExtension The full file extension; extracted from the title. May contain multiple concatenated extensions, such as &quot;tar.gz&quot;. Removing an extension from the title does not clear this field; however, changing the extension on the title does update this field. This field is only populated for files with content stored in Drive; it is not populated for Google Docs or shortcut files.
* @property {boolean} hasThumbnail Whether this file has a thumbnail.
* @property {string} headRevisionId The ID of the file&#39;s head revision. This field is only populated for files with content stored in Drive; it is not populated for Google Docs or shortcut files.
* @property {string} iconLink A link to the file&#39;s icon.
* @property {string} id The ID of the file.
* @property {object} imageMediaMetadata Metadata about image media. This will only be present for image types, and its contents will depend on what can be parsed from the image content.
* @property {object} indexableText Indexable text attributes for the file (can only be written)
* @property {boolean} isAppAuthorized Whether the file was created or opened by the requesting app.
* @property {string} kind The type of file. This is always drive#file.
* @property {object} labels A group of labels for the file.
* @property {drive(v2).User} lastModifyingUser The last user to modify this file.
* @property {string} lastModifyingUserName Name of the last user to modify this file.
* @property {string} lastViewedByMeDate Last time this file was viewed by the user (formatted RFC 3339 timestamp).
* @property {string} markedViewedByMeDate Deprecated.
* @property {string} md5Checksum An MD5 checksum for the content of this file. This field is only populated for files with content stored in Drive; it is not populated for Google Docs or shortcut files.
* @property {string} mimeType The MIME type of the file. This is only mutable on update when uploading new content. This field can be left blank, and the mimetype will be determined from the uploaded content&#39;s MIME type.
* @property {string} modifiedByMeDate Last time this file was modified by the user (formatted RFC 3339 timestamp). Note that setting modifiedDate will also update the modifiedByMe date for the user which set the date.
* @property {string} modifiedDate Last time this file was modified by anyone (formatted RFC 3339 timestamp). This is only mutable on update when the setModifiedDate parameter is set.
* @property {object} openWithLinks A map of the id of each of the user&#39;s apps to a link to open this file with that app. Only populated when the drive.apps.readonly scope is used.
* @property {string} originalFilename The original filename of the uploaded content if available, or else the original value of the title field. This is only available for files with binary content in Drive.
* @property {boolean} ownedByMe Whether the file is owned by the current user.
* @property {string[]} ownerNames Name(s) of the owner(s) of this file.
* @property {drive(v2).User[]} owners The owner(s) of this file.
* @property {drive(v2).ParentReference[]} parents Collection of parent folders which contain this file.
Setting this field will put the file in all of the provided folders. On insert, if no folders are provided, the file will be placed in the default root folder.
* @property {drive(v2).Permission[]} permissions The list of permissions for users with access to this file.
* @property {drive(v2).Property[]} properties The list of properties.
* @property {string} quotaBytesUsed The number of quota bytes used by this file.
* @property {string} selfLink A link back to this file.
* @property {boolean} shareable Whether the file&#39;s sharing settings can be modified by the current user.
* @property {boolean} shared Whether the file has been shared.
* @property {string} sharedWithMeDate Time at which this file was shared with the user (formatted RFC 3339 timestamp).
* @property {drive(v2).User} sharingUser User that shared the item with the current user, if available.
* @property {string[]} spaces The list of spaces which contain the file. Supported values are &#39;drive&#39;, &#39;appDataFolder&#39; and &#39;photos&#39;.
* @property {object} thumbnail A thumbnail for the file. This will only be used if Drive cannot generate a standard thumbnail.
* @property {string} thumbnailLink A short-lived link to the file&#39;s thumbnail. Typically lasts on the order of hours. Only populated when the requesting app can access the file&#39;s content.
* @property {string} thumbnailVersion The thumbnail version for use in client-contructable thumbnail URLs or thumbnail cache invalidation.
* @property {string} title The title of this file.
* @property {drive(v2).Permission} userPermission The permissions for the authenticated user on this file.
* @property {string} version A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the requesting user.
* @property {object} videoMediaMetadata Metadata about video media. This will only be present for video types.
* @property {string} webContentLink A link for downloading the content of the file in a browser using cookie based authentication. In cases where the content is shared publicly, the content can be downloaded without any credentials.
* @property {string} webViewLink A link only available on public folders for viewing their static web assets (HTML, CSS, JS, etc) via Google Drive&#39;s Website Hosting.
* @property {boolean} writersCanShare Whether writers can share the document with other users.
*/
/**
 * @typedef FileList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).File[]} items The actual list of files.
 * @property {string} kind This is always drive#fileList.
 * @property {string} nextLink A link to the next page of files.
 * @property {string} nextPageToken The page token for the next page of files.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef GeneratedIds
 * @memberOf! drive(v2)
 * @type object
 * @property {string[]} ids The IDs generated for the requesting user in the specified space.
 * @property {string} kind This is always drive#generatedIds
 * @property {string} space The type of file that can be created with these IDs.
 */
/**
 * @typedef ParentList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).ParentReference[]} items The actual list of parents.
 * @property {string} kind This is always drive#parentList.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef ParentReference
 * @memberOf! drive(v2)
 * @type object
 * @property {string} id The ID of the parent.
 * @property {boolean} isRoot Whether or not the parent is the root folder.
 * @property {string} kind This is always drive#parentReference.
 * @property {string} parentLink A link to the parent.
 * @property {string} selfLink A link back to this reference.
 */
/**
 * @typedef Permission
 * @memberOf! drive(v2)
 * @type object
* @property {string[]} additionalRoles Additional roles for this user. Only commenter is currently allowed.
* @property {string} authKey The authkey parameter required for this permission.
* @property {string} domain The domain name of the entity this permission refers to. This is an output-only field which is present when the permission type is user, group or domain.
* @property {string} emailAddress The email address of the user or group this permission refers to. This is an output-only field which is present when the permission type is user or group.
* @property {string} etag The ETag of the permission.
* @property {string} expirationDate The time at which this permission will expire (RFC 3339 date-time).
* @property {string} id The ID of the user this permission refers to, and identical to the permissionId in the About and Files resources. When making a drive.permissions.insert request, exactly one of the id or value fields must be specified unless the permission type is anyone, in which case both id and value are ignored.
* @property {string} kind This is always drive#permission.
* @property {string} name The name for this permission.
* @property {string} photoLink A link to the profile photo, if available.
* @property {string} role The primary role for this user. Allowed values are:  
- owner 
- reader 
- writer
* @property {string} selfLink A link back to this permission.
* @property {string} type The account type. Allowed values are:  
- user 
- group 
- domain 
- anyone
* @property {string} value The email address or domain name for the entity. This is used during inserts and is not populated in responses. When making a drive.permissions.insert request, exactly one of the id or value fields must be specified unless the permission type is anyone, in which case both id and value are ignored.
* @property {boolean} withLink Whether the link is required for this permission.
*/
/**
 * @typedef PermissionId
 * @memberOf! drive(v2)
 * @type object
 * @property {string} id The permission ID.
 * @property {string} kind This is always drive#permissionId.
 */
/**
 * @typedef PermissionList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).Permission[]} items The actual list of permissions.
 * @property {string} kind This is always drive#permissionList.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef Property
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag ETag of the property.
 * @property {string} key The key of this property.
 * @property {string} kind This is always drive#property.
 * @property {string} selfLink The link back to this property.
 * @property {string} value The value of this property.
 * @property {string} visibility The visibility of this property.
 */
/**
 * @typedef PropertyList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).Property[]} items The list of properties.
 * @property {string} kind This is always drive#propertyList.
 * @property {string} selfLink The link back to this list.
 */
/**
 * @typedef Revision
 * @memberOf! drive(v2)
 * @type object
 * @property {string} downloadUrl Short term download URL for the file. This will only be populated on files with content stored in Drive.
 * @property {string} etag The ETag of the revision.
 * @property {object} exportLinks Links for exporting Google Docs to specific formats.
 * @property {string} fileSize The size of the revision in bytes. This will only be populated on files with content stored in Drive.
 * @property {string} id The ID of the revision.
 * @property {string} kind This is always drive#revision.
 * @property {drive(v2).User} lastModifyingUser The last user to modify this revision.
 * @property {string} lastModifyingUserName Name of the last user to modify this revision.
 * @property {string} md5Checksum An MD5 checksum for the content of this revision. This will only be populated on files with content stored in Drive.
 * @property {string} mimeType The MIME type of the revision.
 * @property {string} modifiedDate Last time this revision was modified (formatted RFC 3339 timestamp).
 * @property {string} originalFilename The original filename when this revision was created. This will only be populated on files with content stored in Drive.
 * @property {boolean} pinned Whether this revision is pinned to prevent automatic purging. This will only be populated and can only be modified on files with content stored in Drive which are not Google Docs. Revisions can also be pinned when they are created through the drive.files.insert/update/copy by using the pinned query parameter.
 * @property {boolean} publishAuto Whether subsequent revisions will be automatically republished. This is only populated and can only be modified for Google Docs.
 * @property {boolean} published Whether this revision is published. This is only populated and can only be modified for Google Docs.
 * @property {string} publishedLink A link to the published revision.
 * @property {boolean} publishedOutsideDomain Whether this revision is published outside the domain. This is only populated and can only be modified for Google Docs.
 * @property {string} selfLink A link back to this revision.
 */
/**
 * @typedef RevisionList
 * @memberOf! drive(v2)
 * @type object
 * @property {string} etag The ETag of the list.
 * @property {drive(v2).Revision[]} items The actual list of revisions.
 * @property {string} kind This is always drive#revisionList.
 * @property {string} nextPageToken The page token for the next page of revisions. This field will be absent if the end of the revisions list has been reached. If the token is rejected for any reason, it should be discarded and pagination should be restarted from the first page of results.
 * @property {string} selfLink A link back to this list.
 */
/**
 * @typedef User
 * @memberOf! drive(v2)
 * @type object
 * @property {string} displayName A plain text displayable name for this user.
 * @property {string} emailAddress The email address of the user.
 * @property {boolean} isAuthenticatedUser Whether this user is the same as the authenticated user for whom the request was made.
 * @property {string} kind This is always drive#user.
 * @property {string} permissionId The user&#39;s ID as visible in the permissions collection.
 * @property {object} picture The user&#39;s profile picture.
 */
module.exports = Drive;
