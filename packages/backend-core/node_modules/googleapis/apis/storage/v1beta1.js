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
 * Cloud Storage JSON API
 *
 * Lets you store and retrieve potentially-large, immutable data objects.
 *
 * @example
 * var google = require('googleapis');
 * var storage = google.storage('v1beta1');
 *
 * @namespace storage
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Storage
 */
function Storage(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.bucketAccessControls = {

    /**
     * storage.bucketAccessControls.delete
     *
     * @desc Deletes the ACL entry for the specified entity on the specified bucket.
     *
     * @alias storage.bucketAccessControls.delete
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl/{entity}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['bucket', 'entity'],
        pathParams: ['bucket', 'entity'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.bucketAccessControls.get
     *
     * @desc Returns the ACL entry for the specified entity on the specified bucket.
     *
     * @alias storage.bucketAccessControls.get
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl/{entity}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket', 'entity'],
        pathParams: ['bucket', 'entity'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.bucketAccessControls.insert
     *
     * @desc Creates a new ACL entry on the specified bucket.
     *
     * @alias storage.bucketAccessControls.insert
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {storage(v1beta1).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.bucketAccessControls.list
     *
     * @desc Retrieves ACL entries on the specified bucket.
     *
     * @alias storage.bucketAccessControls.list
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.bucketAccessControls.patch
     *
     * @desc Updates an ACL entry on the specified bucket. This method supports patch semantics.
     *
     * @alias storage.bucketAccessControls.patch
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta1).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl/{entity}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['bucket', 'entity'],
        pathParams: ['bucket', 'entity'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.bucketAccessControls.update
     *
     * @desc Updates an ACL entry on the specified bucket.
     *
     * @alias storage.bucketAccessControls.update
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta1).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/acl/{entity}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['bucket', 'entity'],
        pathParams: ['bucket', 'entity'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.buckets = {

    /**
     * storage.buckets.delete
     *
     * @desc Deletes an empty bucket.
     *
     * @alias storage.buckets.delete
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.buckets.get
     *
     * @desc Returns metadata for the specified bucket.
     *
     * @alias storage.buckets.get
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.buckets.insert
     *
     * @desc Creates a new bucket.
     *
     * @alias storage.buckets.insert
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full.
     * @param {storage(v1beta1).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b',
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
     * storage.buckets.list
     *
     * @desc Retrieves a list of buckets for a given project.
     *
     * @alias storage.buckets.list
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.max-results Maximum number of buckets to return.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string} params.projectId A valid API project identifier.
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['projectId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.buckets.patch
     *
     * @desc Updates a bucket. This method supports patch semantics.
     *
     * @alias storage.buckets.patch
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta1).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.buckets.update
     *
     * @desc Updates a bucket.
     *
     * @alias storage.buckets.update
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta1).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.objectAccessControls = {

    /**
     * storage.objectAccessControls.delete
     *
     * @desc Deletes the ACL entry for the specified entity on the specified object.
     *
     * @alias storage.objectAccessControls.delete
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string} params.object Name of the object.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl/{entity}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object', 'entity'],
        pathParams: ['bucket', 'entity', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objectAccessControls.get
     *
     * @desc Returns the ACL entry for the specified entity on the specified object.
     *
     * @alias storage.objectAccessControls.get
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string} params.object Name of the object.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl/{entity}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object', 'entity'],
        pathParams: ['bucket', 'entity', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objectAccessControls.insert
     *
     * @desc Creates a new ACL entry on the specified object.
     *
     * @alias storage.objectAccessControls.insert
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta1).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objectAccessControls.list
     *
     * @desc Retrieves ACL entries on the specified object.
     *
     * @alias storage.objectAccessControls.list
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.object Name of the object.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objectAccessControls.patch
     *
     * @desc Updates an ACL entry on the specified object. This method supports patch semantics.
     *
     * @alias storage.objectAccessControls.patch
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta1).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl/{entity}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object', 'entity'],
        pathParams: ['bucket', 'entity', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objectAccessControls.update
     *
     * @desc Updates an ACL entry on the specified object.
     *
     * @alias storage.objectAccessControls.update
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta1).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}/acl/{entity}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object', 'entity'],
        pathParams: ['bucket', 'entity', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.objects = {

    /**
     * storage.objects.delete
     *
     * @desc Deletes data blobs and associated metadata.
     *
     * @alias storage.objects.delete
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string} params.object Name of the object.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.get
     *
     * @desc Retrieves objects or their associated metadata.
     *
     * @alias storage.objects.get
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.insert
     *
     * @desc Stores new data blobs and associated metadata.
     *
     * @alias storage.objects.insert
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
     * @param {string=} params.name Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl, unless the object resource specifies the acl property, when it defaults to full.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/storage/v1beta1/b/{bucket}/o',
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.list
     *
     * @desc Retrieves a list of objects matching the criteria.
     *
     * @alias storage.objects.list
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which to look for objects.
     * @param {string=} params.delimiter Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
     * @param {integer=} params.max-results Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string=} params.prefix Filter results to objects whose names begin with this prefix.
     * @param {string=} params.projection Set of properties to return. Defaults to no_acl.
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.patch
     *
     * @desc Updates a data blob's associated metadata. This method supports patch semantics.
     *
     * @alias storage.objects.patch
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta1).Object} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.update
     *
     * @desc Updates a data blob's associated metadata.
     *
     * @alias storage.objects.update
     * @memberOf! storage(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta1).Object} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta1/b/{bucket}/o/{object}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Bucket
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).BucketAccessControl[]} acl Access controls on the bucket.
 * @property {storage(v1beta1).ObjectAccessControl[]} defaultObjectAcl Default access controls to apply to new objects when no ACL is provided.
 * @property {string} id The name of the bucket.
 * @property {string} kind The kind of item this is. For buckets, this is always storage#bucket.
 * @property {string} location The location of the bucket. Object data for objects in the bucket resides in physical storage in this location. Can be US or EU. Defaults to US.
 * @property {object} owner The owner of the bucket. This will always be the project team&#39;s owner group.
 * @property {string} projectId The project the bucket belongs to.
 * @property {string} selfLink The URI of this bucket.
 * @property {string} timeCreated Creation time of the bucket in RFC 3339 format.
 * @property {object} website The bucket&#39;s website configuration.
 */
/**
 * @typedef BucketAccessControl
 * @memberOf! storage(v1beta1)
 * @type object
* @property {string} bucket The name of the bucket.
* @property {string} domain The domain associated with the entity, if any.
* @property {string} email The email address associated with the entity, if any.
* @property {string} entity The entity holding the permission, in one of the following forms: 
- user-userId 
- user-email 
- group-groupId 
- group-email 
- domain-domain 
- allUsers 
- allAuthenticatedUsers Examples: 
- The user liz@example.com would be user-liz@example.com. 
- The group example@googlegroups.com would be group-example@googlegroups.com. 
- To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.
* @property {string} entityId The ID for the entity, if any.
* @property {string} id The ID of the access-control entry.
* @property {string} kind The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.
* @property {string} role The access permission for the entity. Can be READER, WRITER, or OWNER.
* @property {string} selfLink The link to this access-control entry.
*/
/**
 * @typedef BucketAccessControls
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).BucketAccessControl[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of bucket access control entries, this is always storage#bucketAccessControls.
 */
/**
 * @typedef Buckets
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).Bucket[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of buckets, this is always storage#buckets.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef Object
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).ObjectAccessControl[]} acl Access controls on the object.
 * @property {string} bucket The bucket containing this object.
 * @property {string} cacheControl Cache-Control directive for the object data.
 * @property {string} contentDisposition Content-Disposition of the object data.
 * @property {string} contentEncoding Content-Encoding of the object data.
 * @property {string} contentLanguage Content-Language of the object data.
 * @property {string} id The ID of the object.
 * @property {string} kind The kind of item this is. For objects, this is always storage#object.
 * @property {object} media Object media data. Provided on your behalf when uploading raw media or multipart/related with an auxiliary media part.
 * @property {object} metadata User-provided metadata, in key/value pairs.
 * @property {string} name The name of this object. Required if not specified by URL parameter.
 * @property {object} owner The owner of the object. This will always be the uploader of the object.
 * @property {string} selfLink The link to this object.
 */
/**
 * @typedef ObjectAccessControl
 * @memberOf! storage(v1beta1)
 * @type object
* @property {string} bucket The name of the bucket.
* @property {string} domain The domain associated with the entity, if any.
* @property {string} email The email address associated with the entity, if any.
* @property {string} entity The entity holding the permission, in one of the following forms: 
- user-userId 
- user-email 
- group-groupId 
- group-email 
- domain-domain 
- allUsers 
- allAuthenticatedUsers Examples: 
- The user liz@example.com would be user-liz@example.com. 
- The group example@googlegroups.com would be group-example@googlegroups.com. 
- To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.
* @property {string} entityId The ID for the entity, if any.
* @property {string} id The ID of the access-control entry.
* @property {string} kind The kind of item this is. For object access control entries, this is always storage#objectAccessControl.
* @property {string} object The name of the object.
* @property {string} role The access permission for the entity. Can be READER or OWNER.
* @property {string} selfLink The link to this access-control entry.
*/
/**
 * @typedef ObjectAccessControls
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).ObjectAccessControl[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of object access control entries, this is always storage#objectAccessControls.
 */
/**
 * @typedef Objects
 * @memberOf! storage(v1beta1)
 * @type object
 * @property {storage(v1beta1).Object[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of objects, this is always storage#objects.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string[]} prefixes The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter.
 */
module.exports = Storage;
