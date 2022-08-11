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
 * Books API
 *
 * Searches for books and manages your Google Books library.
 *
 * @example
 * var google = require('googleapis');
 * var books = google.books('v1');
 *
 * @namespace books
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Books
 */
function Books(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.bookshelves = {

    /**
     * books.bookshelves.get
     *
     * @desc Retrieves metadata for a specific bookshelf for the specified user.
     *
     * @alias books.bookshelves.get
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.shelf ID of bookshelf to retrieve.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {string} params.userId ID of user for whom to retrieve bookshelves.
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
          url: 'https://www.googleapis.com/books/v1/users/{userId}/bookshelves/{shelf}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'shelf'],
        pathParams: ['shelf', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.bookshelves.list
     *
     * @desc Retrieves a list of public bookshelves for the specified user.
     *
     * @alias books.bookshelves.list
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.source String to identify the originator of this request.
     * @param {string} params.userId ID of user for whom to retrieve bookshelves.
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
          url: 'https://www.googleapis.com/books/v1/users/{userId}/bookshelves',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    volumes: {

      /**
       * books.bookshelves.volumes.list
       *
       * @desc Retrieves volumes in a specific bookshelf for the specified user.
       *
       * @alias books.bookshelves.volumes.list
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.maxResults Maximum number of results to return
       * @param {string} params.shelf ID of bookshelf to retrieve volumes.
       * @param {boolean=} params.showPreorders Set to true to show pre-ordered books. Defaults to false.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {integer=} params.startIndex Index of the first element to return (starts at 0)
       * @param {string} params.userId ID of user for whom to retrieve bookshelf volumes.
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
            url: 'https://www.googleapis.com/books/v1/users/{userId}/bookshelves/{shelf}/volumes',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId', 'shelf'],
          pathParams: ['shelf', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.cloudloading = {

    /**
     * books.cloudloading.addBook
     *
     * 
     *
     * @alias books.cloudloading.addBook
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.drive_document_id A drive document id. The upload_client_token must not be set.
     * @param {string=} params.mime_type The document MIME type. It can be set only if the drive_document_id is set.
     * @param {string=} params.name The document name. It can be set only if the drive_document_id is set.
     * @param {string=} params.upload_client_token 
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addBook: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/cloudloading/addBook',
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
     * books.cloudloading.deleteBook
     *
     * @desc Remove the book and its contents
     *
     * @alias books.cloudloading.deleteBook
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.volumeId The id of the book to be removed.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    deleteBook: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/cloudloading/deleteBook',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['volumeId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.cloudloading.updateBook
     *
     * 
     *
     * @alias books.cloudloading.updateBook
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {books(v1).BooksCloudloadingResource} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateBook: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/cloudloading/updateBook',
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

  self.dictionary = {

    /**
     * books.dictionary.listOfflineMetadata
     *
     * @desc Returns a list of offline dictionary metadata available
     *
     * @alias books.dictionary.listOfflineMetadata
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.cpksver The device/version ID from which to request the data.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listOfflineMetadata: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/dictionary/listOfflineMetadata',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['cpksver'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.layers = {

    /**
     * books.layers.get
     *
     * @desc Gets the layer summary for a volume.
     *
     * @alias books.layers.get
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.contentVersion The content version for the requested volume.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {string} params.summaryId The ID for the layer to get the summary for.
     * @param {string} params.volumeId The volume to retrieve layers for.
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
          url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layersummary/{summaryId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['volumeId', 'summaryId'],
        pathParams: ['summaryId', 'volumeId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.layers.list
     *
     * @desc List the layer summaries for a volume.
     *
     * @alias books.layers.list
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.contentVersion The content version for the requested volume.
     * @param {integer=} params.maxResults Maximum number of results to return
     * @param {string=} params.pageToken The value of the nextToken from the previous page.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {string} params.volumeId The volume to retrieve layers for.
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
          url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layersummary',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['volumeId'],
        pathParams: ['volumeId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    annotationData: {

      /**
       * books.layers.annotationData.get
       *
       * @desc Gets the annotation data.
       *
       * @alias books.layers.annotationData.get
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {boolean=} params.allowWebDefinitions For the dictionary layer. Whether or not to allow web definitions.
       * @param {string} params.annotationDataId The ID of the annotation data to retrieve.
       * @param {string} params.contentVersion The content version for the volume you are trying to retrieve.
       * @param {integer=} params.h The requested pixel height for any images. If height is provided width must also be provided.
       * @param {string} params.layerId The ID for the layer to get the annotations.
       * @param {string=} params.locale The locale information for the data. ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'.
       * @param {integer=} params.scale The requested scale for the image.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId The volume to retrieve annotations for.
       * @param {integer=} params.w The requested pixel width for any images. If width is provided height must also be provided.
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
            url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layers/{layerId}/data/{annotationDataId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId', 'layerId', 'annotationDataId', 'contentVersion'],
          pathParams: ['annotationDataId', 'layerId', 'volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.layers.annotationData.list
       *
       * @desc Gets the annotation data for a volume and layer.
       *
       * @alias books.layers.annotationData.list
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.annotationDataId The list of Annotation Data Ids to retrieve. Pagination is ignored if this is set.
       * @param {string} params.contentVersion The content version for the requested volume.
       * @param {integer=} params.h The requested pixel height for any images. If height is provided width must also be provided.
       * @param {string} params.layerId The ID for the layer to get the annotation data.
       * @param {string=} params.locale The locale information for the data. ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'.
       * @param {integer=} params.maxResults Maximum number of results to return
       * @param {string=} params.pageToken The value of the nextToken from the previous page.
       * @param {integer=} params.scale The requested scale for the image.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string=} params.updatedMax RFC 3339 timestamp to restrict to items updated prior to this timestamp (exclusive).
       * @param {string=} params.updatedMin RFC 3339 timestamp to restrict to items updated since this timestamp (inclusive).
       * @param {string} params.volumeId The volume to retrieve annotation data for.
       * @param {integer=} params.w The requested pixel width for any images. If width is provided height must also be provided.
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
            url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layers/{layerId}/data',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId', 'layerId', 'contentVersion'],
          pathParams: ['layerId', 'volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    volumeAnnotations: {

      /**
       * books.layers.volumeAnnotations.get
       *
       * @desc Gets the volume annotation.
       *
       * @alias books.layers.volumeAnnotations.get
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.annotationId The ID of the volume annotation to retrieve.
       * @param {string} params.layerId The ID for the layer to get the annotations.
       * @param {string=} params.locale The locale information for the data. ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId The volume to retrieve annotations for.
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
            url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layers/{layerId}/annotations/{annotationId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId', 'layerId', 'annotationId'],
          pathParams: ['annotationId', 'layerId', 'volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.layers.volumeAnnotations.list
       *
       * @desc Gets the volume annotations for a volume and layer.
       *
       * @alias books.layers.volumeAnnotations.list
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.contentVersion The content version for the requested volume.
       * @param {string=} params.endOffset The end offset to end retrieving data from.
       * @param {string=} params.endPosition The end position to end retrieving data from.
       * @param {string} params.layerId The ID for the layer to get the annotations.
       * @param {string=} params.locale The locale information for the data. ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'.
       * @param {integer=} params.maxResults Maximum number of results to return
       * @param {string=} params.pageToken The value of the nextToken from the previous page.
       * @param {boolean=} params.showDeleted Set to true to return deleted annotations. updatedMin must be in the request to use this. Defaults to false.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string=} params.startOffset The start offset to start retrieving data from.
       * @param {string=} params.startPosition The start position to start retrieving data from.
       * @param {string=} params.updatedMax RFC 3339 timestamp to restrict to items updated prior to this timestamp (exclusive).
       * @param {string=} params.updatedMin RFC 3339 timestamp to restrict to items updated since this timestamp (inclusive).
       * @param {string=} params.volumeAnnotationsVersion The version of the volume annotations that you are requesting.
       * @param {string} params.volumeId The volume to retrieve annotations for.
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
            url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/layers/{layerId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId', 'layerId', 'contentVersion'],
          pathParams: ['layerId', 'volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.myconfig = {

    /**
     * books.myconfig.getUserSettings
     *
     * @desc Gets the current settings for the user.
     *
     * @alias books.myconfig.getUserSettings
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getUserSettings: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/myconfig/getUserSettings',
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
     * books.myconfig.releaseDownloadAccess
     *
     * @desc Release downloaded content access restriction.
     *
     * @alias books.myconfig.releaseDownloadAccess
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.cpksver The device/version ID from which to release the restriction.
     * @param {string=} params.locale ISO-639-1, ISO-3166-1 codes for message localization, i.e. en_US.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {string} params.volumeIds The volume(s) to release restrictions for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    releaseDownloadAccess: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/myconfig/releaseDownloadAccess',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['volumeIds', 'cpksver'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.myconfig.requestAccess
     *
     * @desc Request concurrent and download access restrictions.
     *
     * @alias books.myconfig.requestAccess
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.cpksver The device/version ID from which to request the restrictions.
     * @param {string=} params.licenseTypes The type of access license to request. If not specified, the default is BOTH.
     * @param {string=} params.locale ISO-639-1, ISO-3166-1 codes for message localization, i.e. en_US.
     * @param {string} params.nonce The client nonce value.
     * @param {string} params.source String to identify the originator of this request.
     * @param {string} params.volumeId The volume to request concurrent/download restrictions for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    requestAccess: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/myconfig/requestAccess',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['source', 'volumeId', 'nonce', 'cpksver'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.myconfig.syncVolumeLicenses
     *
     * @desc Request downloaded content access for specified volumes on the My eBooks shelf.
     *
     * @alias books.myconfig.syncVolumeLicenses
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.cpksver The device/version ID from which to release the restriction.
     * @param {string=} params.features List of features supported by the client, i.e., 'RENTALS'
     * @param {boolean=} params.includeNonComicsSeries Set to true to include non-comics series. Defaults to false.
     * @param {string=} params.locale ISO-639-1, ISO-3166-1 codes for message localization, i.e. en_US.
     * @param {string} params.nonce The client nonce value.
     * @param {boolean=} params.showPreorders Set to true to show pre-ordered books. Defaults to false.
     * @param {string} params.source String to identify the originator of this request.
     * @param {string=} params.volumeIds The volume(s) to request download restrictions for.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    syncVolumeLicenses: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/myconfig/syncVolumeLicenses',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['source', 'nonce', 'cpksver'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.myconfig.updateUserSettings
     *
     * @desc Sets the settings for the user. If a sub-object is specified, it will overwrite the existing sub-object stored in the server. Unspecified sub-objects will retain the existing value.
     *
     * @alias books.myconfig.updateUserSettings
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {books(v1).Usersettings} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateUserSettings: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/myconfig/updateUserSettings',
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

  self.mylibrary = {

    annotations: {

      /**
       * books.mylibrary.annotations.delete
       *
       * @desc Deletes an annotation.
       *
       * @alias books.mylibrary.annotations.delete
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.annotationId The ID for the annotation to delete.
       * @param {string=} params.source String to identify the originator of this request.
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/annotations/{annotationId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['annotationId'],
          pathParams: ['annotationId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.annotations.insert
       *
       * @desc Inserts a new annotation.
       *
       * @alias books.mylibrary.annotations.insert
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.country ISO-3166-1 code to override the IP-based location.
       * @param {boolean=} params.showOnlySummaryInResponse Requests that only the summary of the specified layer be provided in the response.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {books(v1).Annotation} params.resource Request body data
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/annotations',
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
       * books.mylibrary.annotations.list
       *
       * @desc Retrieves a list of annotations, possibly filtered.
       *
       * @alias books.mylibrary.annotations.list
       * @memberOf! books(v1)
       *
       * @param {object=} params Parameters for request
       * @param {string=} params.contentVersion The content version for the requested volume.
       * @param {string=} params.layerId The layer ID to limit annotation by.
       * @param {string=} params.layerIds The layer ID(s) to limit annotation by.
       * @param {integer=} params.maxResults Maximum number of results to return
       * @param {string=} params.pageToken The value of the nextToken from the previous page.
       * @param {boolean=} params.showDeleted Set to true to return deleted annotations. updatedMin must be in the request to use this. Defaults to false.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string=} params.updatedMax RFC 3339 timestamp to restrict to items updated prior to this timestamp (exclusive).
       * @param {string=} params.updatedMin RFC 3339 timestamp to restrict to items updated since this timestamp (inclusive).
       * @param {string=} params.volumeId The volume to restrict annotations to.
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/annotations',
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
       * books.mylibrary.annotations.summary
       *
       * @desc Gets the summary of specified layers.
       *
       * @alias books.mylibrary.annotations.summary
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.layerIds Array of layer IDs to get the summary for.
       * @param {string} params.volumeId Volume id to get the summary for.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      summary: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/annotations/summary',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['layerIds', 'volumeId'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.annotations.update
       *
       * @desc Updates an existing annotation.
       *
       * @alias books.mylibrary.annotations.update
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.annotationId The ID for the annotation to update.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {books(v1).Annotation} params.resource Request body data
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/annotations/{annotationId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['annotationId'],
          pathParams: ['annotationId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    bookshelves: {

      /**
       * books.mylibrary.bookshelves.addVolume
       *
       * @desc Adds a volume to a bookshelf.
       *
       * @alias books.mylibrary.bookshelves.addVolume
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.reason The reason for which the book is added to the library.
       * @param {string} params.shelf ID of bookshelf to which to add a volume.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of volume to add.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      addVolume: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}/addVolume',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['shelf', 'volumeId'],
          pathParams: ['shelf'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.bookshelves.clearVolumes
       *
       * @desc Clears all volumes from a bookshelf.
       *
       * @alias books.mylibrary.bookshelves.clearVolumes
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.shelf ID of bookshelf from which to remove a volume.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      clearVolumes: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}/clearVolumes',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['shelf'],
          pathParams: ['shelf'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.bookshelves.get
       *
       * @desc Retrieves metadata for a specific bookshelf belonging to the authenticated user.
       *
       * @alias books.mylibrary.bookshelves.get
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.shelf ID of bookshelf to retrieve.
       * @param {string=} params.source String to identify the originator of this request.
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['shelf'],
          pathParams: ['shelf'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.bookshelves.list
       *
       * @desc Retrieves a list of bookshelves belonging to the authenticated user.
       *
       * @alias books.mylibrary.bookshelves.list
       * @memberOf! books(v1)
       *
       * @param {object=} params Parameters for request
       * @param {string=} params.source String to identify the originator of this request.
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves',
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
       * books.mylibrary.bookshelves.moveVolume
       *
       * @desc Moves a volume within a bookshelf.
       *
       * @alias books.mylibrary.bookshelves.moveVolume
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.shelf ID of bookshelf with the volume.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of volume to move.
       * @param {integer} params.volumePosition Position on shelf to move the item (0 puts the item before the current first item, 1 puts it between the first and the second and so on.)
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      moveVolume: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}/moveVolume',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['shelf', 'volumeId', 'volumePosition'],
          pathParams: ['shelf'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.bookshelves.removeVolume
       *
       * @desc Removes a volume from a bookshelf.
       *
       * @alias books.mylibrary.bookshelves.removeVolume
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.reason The reason for which the book is removed from the library.
       * @param {string} params.shelf ID of bookshelf from which to remove a volume.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of volume to remove.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      removeVolume: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}/removeVolume',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['shelf', 'volumeId'],
          pathParams: ['shelf'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      volumes: {

        /**
         * books.mylibrary.bookshelves.volumes.list
         *
         * @desc Gets volume information for volumes on a bookshelf.
         *
         * @alias books.mylibrary.bookshelves.volumes.list
         * @memberOf! books(v1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.country ISO-3166-1 code to override the IP-based location.
         * @param {integer=} params.maxResults Maximum number of results to return
         * @param {string=} params.projection Restrict information returned to a set of selected fields.
         * @param {string=} params.q Full-text search query string in this bookshelf.
         * @param {string} params.shelf The bookshelf ID or name retrieve volumes for.
         * @param {boolean=} params.showPreorders Set to true to show pre-ordered books. Defaults to false.
         * @param {string=} params.source String to identify the originator of this request.
         * @param {integer=} params.startIndex Index of the first element to return (starts at 0)
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
              url: 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelf}/volumes',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['shelf'],
            pathParams: ['shelf'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    readingpositions: {

      /**
       * books.mylibrary.readingpositions.get
       *
       * @desc Retrieves my reading position information for a volume.
       *
       * @alias books.mylibrary.readingpositions.get
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.contentVersion Volume content version for which this reading position is requested.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of volume for which to retrieve a reading position.
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
            url: 'https://www.googleapis.com/books/v1/mylibrary/readingpositions/{volumeId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId'],
          pathParams: ['volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * books.mylibrary.readingpositions.setPosition
       *
       * @desc Sets my reading position information for a volume.
       *
       * @alias books.mylibrary.readingpositions.setPosition
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.action Action that caused this reading position to be set.
       * @param {string=} params.contentVersion Volume content version for which this reading position applies.
       * @param {string=} params.deviceCookie Random persistent device cookie optional on set position.
       * @param {string} params.position Position string for the new volume reading position.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.timestamp RFC 3339 UTC format timestamp associated with this reading position.
       * @param {string} params.volumeId ID of volume for which to update the reading position.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      setPosition: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/mylibrary/readingpositions/{volumeId}/setPosition',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['volumeId', 'timestamp', 'position'],
          pathParams: ['volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.notification = {

    /**
     * books.notification.get
     *
     * @desc Returns notification details for a given notification id.
     *
     * @alias books.notification.get
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating notification title and body.
     * @param {string} params.notification_id String to identify the notification.
     * @param {string=} params.source String to identify the originator of this request.
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
          url: 'https://www.googleapis.com/books/v1/notification/get',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['notification_id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.onboarding = {

    /**
     * books.onboarding.listCategories
     *
     * @desc List categories for onboarding experience.
     *
     * @alias books.onboarding.listCategories
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Default is en-US if unset.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listCategories: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/onboarding/listCategories',
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
     * books.onboarding.listCategoryVolumes
     *
     * @desc List available volumes under categories for onboarding experience.
     *
     * @alias books.onboarding.listCategoryVolumes
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.categoryId List of category ids requested.
     * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Default is en-US if unset.
     * @param {string=} params.maxAllowedMaturityRating The maximum allowed maturity rating of returned volumes. Books with a higher maturity rating are filtered out.
     * @param {integer=} params.pageSize Number of maximum results per page to be included in the response.
     * @param {string=} params.pageToken The value of the nextToken from the previous page.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listCategoryVolumes: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/onboarding/listCategoryVolumes',
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

  self.personalizedstream = {

    /**
     * books.personalizedstream.get
     *
     * @desc Returns a stream of personalized book clusters
     *
     * @alias books.personalizedstream.get
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating recommendations.
     * @param {string=} params.maxAllowedMaturityRating The maximum allowed maturity rating of returned recommendations. Books with a higher maturity rating are filtered out.
     * @param {string=} params.source String to identify the originator of this request.
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
          url: 'https://www.googleapis.com/books/v1/personalizedstream/get',
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

  self.promooffer = {

    /**
     * books.promooffer.accept
     *
     * 
     *
     * @alias books.promooffer.accept
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.androidId device android_id
     * @param {string=} params.device device device
     * @param {string=} params.manufacturer device manufacturer
     * @param {string=} params.model device model
     * @param {string=} params.offerId 
     * @param {string=} params.product device product
     * @param {string=} params.serial device serial
     * @param {string=} params.volumeId Volume id to exercise the offer
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    accept: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/promooffer/accept',
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
     * books.promooffer.dismiss
     *
     * 
     *
     * @alias books.promooffer.dismiss
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.androidId device android_id
     * @param {string=} params.device device device
     * @param {string=} params.manufacturer device manufacturer
     * @param {string=} params.model device model
     * @param {string=} params.offerId Offer to dimiss
     * @param {string=} params.product device product
     * @param {string=} params.serial device serial
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    dismiss: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/books/v1/promooffer/dismiss',
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
     * books.promooffer.get
     *
     * @desc Returns a list of promo offers available to the user
     *
     * @alias books.promooffer.get
     * @memberOf! books(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.androidId device android_id
     * @param {string=} params.device device device
     * @param {string=} params.manufacturer device manufacturer
     * @param {string=} params.model device model
     * @param {string=} params.product device product
     * @param {string=} params.serial device serial
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
          url: 'https://www.googleapis.com/books/v1/promooffer/get',
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

  self.series = {

    /**
     * books.series.get
     *
     * @desc Returns Series metadata for the given series ids.
     *
     * @alias books.series.get
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.series_id String that identifies the series
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
          url: 'https://www.googleapis.com/books/v1/series/get',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['series_id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    membership: {

      /**
       * books.series.membership.get
       *
       * @desc Returns Series membership data given the series id.
       *
       * @alias books.series.membership.get
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.page_size Number of maximum results per page to be included in the response.
       * @param {string=} params.page_token The value of the nextToken from the previous page.
       * @param {string} params.series_id String that identifies the series
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
            url: 'https://www.googleapis.com/books/v1/series/membership/get',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['series_id'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.volumes = {

    /**
     * books.volumes.get
     *
     * @desc Gets volume information for a single volume.
     *
     * @alias books.volumes.get
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.country ISO-3166-1 code to override the IP-based location.
     * @param {boolean=} params.includeNonComicsSeries Set to true to include non-comics series. Defaults to false.
     * @param {string=} params.partner Brand results for partner ID.
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {boolean=} params.user_library_consistent_read 
     * @param {string} params.volumeId ID of volume to retrieve.
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
          url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['volumeId'],
        pathParams: ['volumeId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * books.volumes.list
     *
     * @desc Performs a book search.
     *
     * @alias books.volumes.list
     * @memberOf! books(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.download Restrict to volumes by download availability.
     * @param {string=} params.filter Filter search results.
     * @param {string=} params.langRestrict Restrict results to books with this language code.
     * @param {string=} params.libraryRestrict Restrict search to this user's library.
     * @param {string=} params.maxAllowedMaturityRating The maximum allowed maturity rating of returned recommendations. Books with a higher maturity rating are filtered out.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.orderBy Sort search results.
     * @param {string=} params.partner Restrict and brand results for partner ID.
     * @param {string=} params.printType Restrict to books or magazines.
     * @param {string=} params.projection Restrict information returned to a set of selected fields.
     * @param {string} params.q Full-text search query string.
     * @param {boolean=} params.showPreorders Set to true to show books available for preorder. Defaults to false.
     * @param {string=} params.source String to identify the originator of this request.
     * @param {integer=} params.startIndex Index of the first result to return (starts at 0)
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
          url: 'https://www.googleapis.com/books/v1/volumes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['q'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    associated: {

      /**
       * books.volumes.associated.list
       *
       * @desc Return a list of associated books.
       *
       * @alias books.volumes.associated.list
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.association Association type.
       * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating recommendations.
       * @param {string=} params.maxAllowedMaturityRating The maximum allowed maturity rating of returned recommendations. Books with a higher maturity rating are filtered out.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of the source volume.
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
            url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}/associated',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['volumeId'],
          pathParams: ['volumeId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    mybooks: {

      /**
       * books.volumes.mybooks.list
       *
       * @desc Return a list of books in My Library.
       *
       * @alias books.volumes.mybooks.list
       * @memberOf! books(v1)
       *
       * @param {object=} params Parameters for request
       * @param {string=} params.acquireMethod How the book was acquired
       * @param {string=} params.country ISO-3166-1 code to override the IP-based location.
       * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex:'en_US'. Used for generating recommendations.
       * @param {integer=} params.maxResults Maximum number of results to return.
       * @param {string=} params.processingState The processing state of the user uploaded volumes to be returned. Applicable only if the UPLOADED is specified in the acquireMethod.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {integer=} params.startIndex Index of the first result to return (starts at 0)
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
            url: 'https://www.googleapis.com/books/v1/volumes/mybooks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    recommended: {

      /**
       * books.volumes.recommended.list
       *
       * @desc Return a list of recommended books for the current user.
       *
       * @alias books.volumes.recommended.list
       * @memberOf! books(v1)
       *
       * @param {object=} params Parameters for request
       * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating recommendations.
       * @param {string=} params.maxAllowedMaturityRating The maximum allowed maturity rating of returned recommendations. Books with a higher maturity rating are filtered out.
       * @param {string=} params.source String to identify the originator of this request.
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
            url: 'https://www.googleapis.com/books/v1/volumes/recommended',
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
       * books.volumes.recommended.rate
       *
       * @desc Rate a recommended book for the current user.
       *
       * @alias books.volumes.recommended.rate
       * @memberOf! books(v1)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating recommendations.
       * @param {string} params.rating Rating to be given to the volume.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {string} params.volumeId ID of the source volume.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      rate: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/books/v1/volumes/recommended/rate',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['rating', 'volumeId'],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    useruploaded: {

      /**
       * books.volumes.useruploaded.list
       *
       * @desc Return a list of books uploaded by the current user.
       *
       * @alias books.volumes.useruploaded.list
       * @memberOf! books(v1)
       *
       * @param {object=} params Parameters for request
       * @param {string=} params.locale ISO-639-1 language and ISO-3166-1 country code. Ex: 'en_US'. Used for generating recommendations.
       * @param {integer=} params.maxResults Maximum number of results to return.
       * @param {string=} params.processingState The processing state of the user uploaded volumes to be returned.
       * @param {string=} params.source String to identify the originator of this request.
       * @param {integer=} params.startIndex Index of the first result to return (starts at 0)
       * @param {string=} params.volumeId The ids of the volumes to be returned. If not specified all that match the processingState are returned.
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
            url: 'https://www.googleapis.com/books/v1/volumes/useruploaded',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: [],
          pathParams: [],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Annotation
 * @memberOf! books(v1)
 * @type object
 * @property {string} afterSelectedText Anchor text after excerpt. For requests, if the user bookmarked a screen that has no flowing text on it, then this field should be empty.
 * @property {string} beforeSelectedText Anchor text before excerpt. For requests, if the user bookmarked a screen that has no flowing text on it, then this field should be empty.
 * @property {object} clientVersionRanges Selection ranges sent from the client.
 * @property {string} created Timestamp for the created time of this annotation.
 * @property {object} currentVersionRanges Selection ranges for the most recent content version.
 * @property {string} data User-created data for this annotation.
 * @property {boolean} deleted Indicates that this annotation is deleted.
 * @property {string} highlightStyle The highlight style for this annotation.
 * @property {string} id Id of this annotation, in the form of a GUID.
 * @property {string} kind Resource type.
 * @property {string} layerId The layer this annotation is for.
 * @property {object} layerSummary 
 * @property {string[]} pageIds Pages that this annotation spans.
 * @property {string} selectedText Excerpt from the volume.
 * @property {string} selfLink URL to this resource.
 * @property {string} updated Timestamp for the last time this annotation was modified.
 * @property {string} volumeId The volume that this annotation belongs to.
 */
/**
 * @typedef Annotationdata
 * @memberOf! books(v1)
 * @type object
 * @property {string} annotationType The type of annotation this data is for.
 * @property {any} data 
 * @property {string} encoded_data Base64 encoded data for this annotation data.
 * @property {string} id Unique id for this annotation data.
 * @property {string} kind Resource Type
 * @property {string} layerId The Layer id for this data. *
 * @property {string} selfLink URL for this resource. *
 * @property {string} updated Timestamp for the last time this data was updated. (RFC 3339 UTC date-time format).
 * @property {string} volumeId The volume id for this data. *
 */
/**
 * @typedef Annotations
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Annotation[]} items A list of annotations.
 * @property {string} kind Resource type.
 * @property {string} nextPageToken Token to pass in for pagination for the next page. This will not be present if this request does not have more results.
 * @property {integer} totalItems Total number of annotations found. This may be greater than the number of notes returned in this response if results have been paginated.
 */
/**
 * @typedef AnnotationsSummary
 * @memberOf! books(v1)
 * @type object
 * @property {string} kind 
 * @property {object[]} layers 
 */
/**
 * @typedef Annotationsdata
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Annotationdata[]} items A list of Annotation Data.
 * @property {string} kind Resource type
 * @property {string} nextPageToken Token to pass in for pagination for the next page. This will not be present if this request does not have more results.
 * @property {integer} totalItems The total number of volume annotations found.
 */
/**
 * @typedef BooksAnnotationsRange
 * @memberOf! books(v1)
 * @type object
 * @property {string} endOffset The offset from the ending position.
 * @property {string} endPosition The ending position for the range.
 * @property {string} startOffset The offset from the starting position.
 * @property {string} startPosition The starting position for the range.
 */
/**
 * @typedef BooksCloudloadingResource
 * @memberOf! books(v1)
 * @type object
 * @property {string} author 
 * @property {string} processingState 
 * @property {string} title 
 * @property {string} volumeId 
 */
/**
 * @typedef BooksVolumesRecommendedRateResponse
 * @memberOf! books(v1)
 * @type object
 * @property {string} consistency_token 
 */
/**
 * @typedef Bookshelf
 * @memberOf! books(v1)
 * @type object
 * @property {string} access Whether this bookshelf is PUBLIC or PRIVATE.
 * @property {string} created Created time for this bookshelf (formatted UTC timestamp with millisecond resolution).
 * @property {string} description Description of this bookshelf.
 * @property {integer} id Id of this bookshelf, only unique by user.
 * @property {string} kind Resource type for bookshelf metadata.
 * @property {string} selfLink URL to this resource.
 * @property {string} title Title of this bookshelf.
 * @property {string} updated Last modified time of this bookshelf (formatted UTC timestamp with millisecond resolution).
 * @property {integer} volumeCount Number of volumes in this bookshelf.
 * @property {string} volumesLastUpdated Last time a volume was added or removed from this bookshelf (formatted UTC timestamp with millisecond resolution).
 */
/**
 * @typedef Bookshelves
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Bookshelf[]} items A list of bookshelves.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Category
 * @memberOf! books(v1)
 * @type object
 * @property {object[]} items A list of onboarding categories.
 * @property {string} kind Resource type.
 */
/**
 * @typedef ConcurrentAccessRestriction
 * @memberOf! books(v1)
 * @type object
 * @property {boolean} deviceAllowed Whether access is granted for this (user, device, volume).
 * @property {string} kind Resource type.
 * @property {integer} maxConcurrentDevices The maximum number of concurrent access licenses for this volume.
 * @property {string} message Error/warning message.
 * @property {string} nonce Client nonce for verification. Download access and client-validation only.
 * @property {string} reasonCode Error/warning reason code.
 * @property {boolean} restricted Whether this volume has any concurrent access restrictions.
 * @property {string} signature Response signature.
 * @property {string} source Client app identifier for verification. Download access and client-validation only.
 * @property {integer} timeWindowSeconds Time in seconds for license auto-expiration.
 * @property {string} volumeId Identifies the volume for which this entry applies.
 */
/**
 * @typedef Dictlayerdata
 * @memberOf! books(v1)
 * @type object
 * @property {object} common 
 * @property {object} dict 
 * @property {string} kind 
 */
/**
 * @typedef Discoveryclusters
 * @memberOf! books(v1)
 * @type object
 * @property {object[]} clusters 
 * @property {string} kind Resorce type.
 * @property {integer} totalClusters 
 */
/**
 * @typedef DownloadAccessRestriction
 * @memberOf! books(v1)
 * @type object
 * @property {boolean} deviceAllowed If restricted, whether access is granted for this (user, device, volume).
 * @property {integer} downloadsAcquired If restricted, the number of content download licenses already acquired (including the requesting client, if licensed).
 * @property {boolean} justAcquired If deviceAllowed, whether access was just acquired with this request.
 * @property {string} kind Resource type.
 * @property {integer} maxDownloadDevices If restricted, the maximum number of content download licenses for this volume.
 * @property {string} message Error/warning message.
 * @property {string} nonce Client nonce for verification. Download access and client-validation only.
 * @property {string} reasonCode Error/warning reason code. Additional codes may be added in the future. 0 OK 100 ACCESS_DENIED_PUBLISHER_LIMIT 101 ACCESS_DENIED_LIMIT 200 WARNING_USED_LAST_ACCESS
 * @property {boolean} restricted Whether this volume has any download access restrictions.
 * @property {string} signature Response signature.
 * @property {string} source Client app identifier for verification. Download access and client-validation only.
 * @property {string} volumeId Identifies the volume for which this entry applies.
 */
/**
 * @typedef DownloadAccesses
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).DownloadAccessRestriction[]} downloadAccessList A list of download access responses.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Geolayerdata
 * @memberOf! books(v1)
 * @type object
 * @property {object} common 
 * @property {object} geo 
 * @property {string} kind 
 */
/**
 * @typedef Layersummaries
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Layersummary[]} items A list of layer summary items.
 * @property {string} kind Resource type.
 * @property {integer} totalItems The total number of layer summaries found.
 */
/**
 * @typedef Layersummary
 * @memberOf! books(v1)
 * @type object
 * @property {integer} annotationCount The number of annotations for this layer.
 * @property {string[]} annotationTypes The list of annotation types contained for this layer.
 * @property {string} annotationsDataLink Link to get data for this annotation.
 * @property {string} annotationsLink The link to get the annotations for this layer.
 * @property {string} contentVersion The content version this resource is for.
 * @property {integer} dataCount The number of data items for this layer.
 * @property {string} id Unique id of this layer summary.
 * @property {string} kind Resource Type
 * @property {string} layerId The layer id for this summary.
 * @property {string} selfLink URL to this resource.
 * @property {string} updated Timestamp for the last time an item in this layer was updated. (RFC 3339 UTC date-time format).
 * @property {string} volumeAnnotationsVersion The current version of this layer&#39;s volume annotations. Note that this version applies only to the data in the books.layers.volumeAnnotations.* responses. The actual annotation data is versioned separately.
 * @property {string} volumeId The volume id this resource is for.
 */
/**
 * @typedef Metadata
 * @memberOf! books(v1)
 * @type object
 * @property {object[]} items A list of offline dictionary metadata.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Notification
 * @memberOf! books(v1)
 * @type object
 * @property {string} body 
 * @property {string[]} crmExperimentIds The list of crm experiment ids.
 * @property {string} doc_id 
 * @property {string} doc_type 
 * @property {boolean} dont_show_notification 
 * @property {string} iconUrl 
 * @property {string} kind Resource type.
 * @property {string} notificationGroup 
 * @property {string} notification_type 
 * @property {string} pcampaign_id 
 * @property {string} reason 
 * @property {boolean} show_notification_settings_action 
 * @property {string} targetUrl 
 * @property {string} title 
 */
/**
 * @typedef Offers
 * @memberOf! books(v1)
 * @type object
 * @property {object[]} items A list of offers.
 * @property {string} kind Resource type.
 */
/**
 * @typedef ReadingPosition
 * @memberOf! books(v1)
 * @type object
 * @property {string} epubCfiPosition Position in an EPUB as a CFI.
 * @property {string} gbImagePosition Position in a volume for image-based content.
 * @property {string} gbTextPosition Position in a volume for text-based content.
 * @property {string} kind Resource type for a reading position.
 * @property {string} pdfPosition Position in a PDF file.
 * @property {string} updated Timestamp when this reading position was last updated (formatted UTC timestamp with millisecond resolution).
 * @property {string} volumeId Volume id associated with this reading position.
 */
/**
 * @typedef RequestAccess
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).ConcurrentAccessRestriction} concurrentAccess A concurrent access response.
 * @property {books(v1).DownloadAccessRestriction} downloadAccess A download access response.
 * @property {string} kind Resource type.
 */
/**
 * @typedef Review
 * @memberOf! books(v1)
 * @type object
 * @property {object} author Author of this review.
 * @property {string} content Review text.
 * @property {string} date Date of this review.
 * @property {string} fullTextUrl URL for the full review text, for reviews gathered from the web.
 * @property {string} kind Resource type for a review.
 * @property {string} rating Star rating for this review. Possible values are ONE, TWO, THREE, FOUR, FIVE or NOT_RATED.
 * @property {object} source Information regarding the source of this review, when the review is not from a Google Books user.
 * @property {string} title Title for this review.
 * @property {string} type Source type for this review. Possible values are EDITORIAL, WEB_USER or GOOGLE_USER.
 * @property {string} volumeId Volume that this review is for.
 */
/**
 * @typedef Series
 * @memberOf! books(v1)
 * @type object
 * @property {string} kind Resource type.
 * @property {object[]} series 
 */
/**
 * @typedef Seriesmembership
 * @memberOf! books(v1)
 * @type object
 * @property {string} kind Resorce type.
 * @property {books(v1).Volume[]} member 
 * @property {string} nextPageToken 
 */
/**
 * @typedef Usersettings
 * @memberOf! books(v1)
 * @type object
 * @property {string} kind Resource type.
 * @property {object} notesExport User settings in sub-objects, each for different purposes.
 * @property {object} notification 
 */
/**
 * @typedef Volume
 * @memberOf! books(v1)
 * @type object
 * @property {object} accessInfo Any information about a volume related to reading or obtaining that volume text. This information can depend on country (books may be public domain in one country but not in another, e.g.).
 * @property {string} etag Opaque identifier for a specific version of a volume resource. (In LITE projection)
 * @property {string} id Unique identifier for a volume. (In LITE projection.)
 * @property {string} kind Resource type for a volume. (In LITE projection.)
 * @property {object} layerInfo What layers exist in this volume and high level information about them.
 * @property {object} recommendedInfo Recommendation related information for this volume.
 * @property {object} saleInfo Any information about a volume related to the eBookstore and/or purchaseability. This information can depend on the country where the request originates from (i.e. books may not be for sale in certain countries).
 * @property {object} searchInfo Search result information related to this volume.
 * @property {string} selfLink URL to this resource. (In LITE projection.)
 * @property {object} userInfo User specific information related to this volume. (e.g. page this user last read or whether they purchased this book)
 * @property {object} volumeInfo General volume information.
 */
/**
 * @typedef Volume2
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Volume[]} items A list of volumes.
 * @property {string} kind Resource type.
 * @property {string} nextPageToken 
 */
/**
 * @typedef Volumeannotation
 * @memberOf! books(v1)
 * @type object
 * @property {string} annotationDataId The annotation data id for this volume annotation.
 * @property {string} annotationDataLink Link to get data for this annotation.
 * @property {string} annotationType The type of annotation this is.
 * @property {object} contentRanges The content ranges to identify the selected text.
 * @property {string} data Data for this annotation.
 * @property {boolean} deleted Indicates that this annotation is deleted.
 * @property {string} id Unique id of this volume annotation.
 * @property {string} kind Resource Type
 * @property {string} layerId The Layer this annotation is for.
 * @property {string[]} pageIds Pages the annotation spans.
 * @property {string} selectedText Excerpt from the volume.
 * @property {string} selfLink URL to this resource.
 * @property {string} updated Timestamp for the last time this anntoation was updated. (RFC 3339 UTC date-time format).
 * @property {string} volumeId The Volume this annotation is for.
 */
/**
 * @typedef Volumeannotations
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Volumeannotation[]} items A list of volume annotations.
 * @property {string} kind Resource type
 * @property {string} nextPageToken Token to pass in for pagination for the next page. This will not be present if this request does not have more results.
 * @property {integer} totalItems The total number of volume annotations found.
 * @property {string} version The version string for all of the volume annotations in this layer (not just the ones in this response). Note: the version string doesn&#39;t apply to the annotation data, just the information in this response (e.g. the location of annotations in the book).
 */
/**
 * @typedef Volumes
 * @memberOf! books(v1)
 * @type object
 * @property {books(v1).Volume[]} items A list of volumes.
 * @property {string} kind Resource type.
 * @property {integer} totalItems Total number of volumes found. This might be greater than the number of volumes returned in this response if results have been paginated.
 */
/**
 * @typedef Volumeseriesinfo
 * @memberOf! books(v1)
 * @type object
 * @property {string} bookDisplayNumber The display number string. This should be used only for display purposes and the actual sequence should be inferred from the below orderNumber.
 * @property {string} kind Resource type.
 * @property {string} shortSeriesBookTitle Short book title in the context of the series.
 * @property {object[]} volumeSeries 
 */
module.exports = Books;
