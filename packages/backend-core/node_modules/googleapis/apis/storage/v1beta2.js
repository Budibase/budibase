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
 * var storage = google.storage('v1beta2');
 *
 * @namespace storage
 * @type {Function}
 * @version v1beta2
 * @variation v1beta2
 * @param {object=} options Options for Storage
 */
function Storage(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.bucketAccessControls = {

    /**
     * storage.bucketAccessControls.delete
     *
     * @desc Permanently deletes the ACL entry for the specified entity on the specified bucket.
     *
     * @alias storage.bucketAccessControls.delete
     * @memberOf! storage(v1beta2)
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {storage(v1beta2).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl',
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
     * @memberOf! storage(v1beta2)
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta2).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta2).BucketAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/acl/{entity}',
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
     * @desc Permanently deletes an empty bucket.
     *
     * @alias storage.buckets.delete
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project A valid API project identifier.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the bucket resource specifies acl or defaultObjectAcl properties, when it defaults to full.
     * @param {storage(v1beta2).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of buckets to return.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string} params.project A valid API project identifier.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta2).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.ifMetagenerationMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the return of the bucket metadata conditional on whether the bucket's current metageneration does not match the given value.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta2).Bucket} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}',
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

  self.channels = {

    /**
     * storage.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias storage.channels.stop
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {storage(v1beta2).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/channels/stop',
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

  self.defaultObjectAccessControls = {

    /**
     * storage.defaultObjectAccessControls.delete
     *
     * @desc Permanently deletes the default object ACL entry for the specified entity on the specified bucket.
     *
     * @alias storage.defaultObjectAccessControls.delete
     * @memberOf! storage(v1beta2)
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl/{entity}',
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
     * storage.defaultObjectAccessControls.get
     *
     * @desc Returns the default object ACL entry for the specified entity on the specified bucket.
     *
     * @alias storage.defaultObjectAccessControls.get
     * @memberOf! storage(v1beta2)
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl/{entity}',
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
     * storage.defaultObjectAccessControls.insert
     *
     * @desc Creates a new default object ACL entry on the specified bucket.
     *
     * @alias storage.defaultObjectAccessControls.insert
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl',
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
     * storage.defaultObjectAccessControls.list
     *
     * @desc Retrieves default object ACL entries on the specified bucket.
     *
     * @alias storage.defaultObjectAccessControls.list
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.ifMetagenerationMatch If present, only return default ACL listing if the bucket's current metageneration matches this value.
     * @param {string=} params.ifMetagenerationNotMatch If present, only return default ACL listing if the bucket's current metageneration does not match the given value.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl',
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
     * storage.defaultObjectAccessControls.patch
     *
     * @desc Updates a default object ACL entry on the specified bucket. This method supports patch semantics.
     *
     * @alias storage.defaultObjectAccessControls.patch
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl/{entity}',
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
     * storage.defaultObjectAccessControls.update
     *
     * @desc Updates a default object ACL entry on the specified bucket.
     *
     * @alias storage.defaultObjectAccessControls.update
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/defaultObjectAcl/{entity}',
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

  self.objectAccessControls = {

    /**
     * storage.objectAccessControls.delete
     *
     * @desc Permanently deletes the ACL entry for the specified entity on the specified object.
     *
     * @alias storage.objectAccessControls.delete
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl/{entity}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of a bucket.
     * @param {string} params.entity The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string} params.object Name of the object.
     * @param {storage(v1beta2).ObjectAccessControl} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}/acl/{entity}',
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
     * storage.objects.compose
     *
     * @desc Concatenates a list of existing objects into a new object in the same bucket.
     *
     * @alias storage.objects.compose
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.destinationBucket Name of the bucket in which to store the new object.
     * @param {string} params.destinationObject Name of the new object.
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {storage(v1beta2).ComposeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    compose: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/storage/v1beta2/b/{destinationBucket}/o/{destinationObject}/compose',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['destinationBucket', 'destinationObject'],
        pathParams: ['destinationBucket', 'destinationObject'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.copy
     *
     * @desc Copies an object to a destination in the same location. Optionally overrides metadata.
     *
     * @alias storage.objects.copy
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.destinationBucket Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
     * @param {string} params.destinationObject Name of the new object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the destination object's current generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the destination object's current generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the destination object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the destination object's current metageneration does not match the given value.
     * @param {string=} params.ifSourceGenerationMatch Makes the operation conditional on whether the source object's generation matches the given value.
     * @param {string=} params.ifSourceGenerationNotMatch Makes the operation conditional on whether the source object's generation does not match the given value.
     * @param {string=} params.ifSourceMetagenerationMatch Makes the operation conditional on whether the source object's current metageneration matches the given value.
     * @param {string=} params.ifSourceMetagenerationNotMatch Makes the operation conditional on whether the source object's current metageneration does not match the given value.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
     * @param {string} params.sourceBucket Name of the bucket in which to find the source object.
     * @param {string=} params.sourceGeneration If present, selects a specific revision of the source object (as opposed to the latest version, the default).
     * @param {string} params.sourceObject Name of the source object.
     * @param {storage(v1beta2).Object} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{sourceBucket}/o/{sourceObject}/copyTo/b/{destinationBucket}/o/{destinationObject}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['sourceBucket', 'sourceObject', 'destinationBucket', 'destinationObject'],
        pathParams: ['destinationBucket', 'destinationObject', 'sourceBucket', 'sourceObject'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.delete
     *
     * @desc Deletes data blobs and associated metadata. Deletions are permanent if versioning is not enabled for the bucket, or if the generation parameter is used.
     *
     * @alias storage.objects.delete
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string=} params.generation If present, permanently deletes a specific revision of this object (as opposed to the latest version, the default).
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which to store the new object. Overrides the provided object metadata's bucket value, if any.
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
     * @param {string=} params.name Name of the object. Required when the object metadata is not otherwise provided. Overrides the object metadata's name value, if any.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/storage/v1beta2/b/{bucket}/o',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which to look for objects.
     * @param {string=} params.delimiter Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
     * @param {integer=} params.maxResults Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string=} params.prefix Filter results to objects whose names begin with this prefix.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
     * @param {boolean=} params.versions If true, lists all versions of a file as distinct results.
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta2).Object} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}',
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
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which the object resides.
     * @param {string=} params.generation If present, selects a specific revision of this object (as opposed to the latest version, the default).
     * @param {string=} params.ifGenerationMatch Makes the operation conditional on whether the object's current generation matches the given value.
     * @param {string=} params.ifGenerationNotMatch Makes the operation conditional on whether the object's current generation does not match the given value.
     * @param {string=} params.ifMetagenerationMatch Makes the operation conditional on whether the object's current metageneration matches the given value.
     * @param {string=} params.ifMetagenerationNotMatch Makes the operation conditional on whether the object's current metageneration does not match the given value.
     * @param {string} params.object Name of the object.
     * @param {string=} params.projection Set of properties to return. Defaults to full.
     * @param {storage(v1beta2).Object} params.resource Request body data
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
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/{object}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['bucket', 'object'],
        pathParams: ['bucket', 'object'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * storage.objects.watchAll
     *
     * @desc Watch for changes on all objects in a bucket.
     *
     * @alias storage.objects.watchAll
     * @memberOf! storage(v1beta2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.bucket Name of the bucket in which to look for objects.
     * @param {string=} params.delimiter Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.
     * @param {integer=} params.maxResults Maximum number of items plus prefixes to return. As duplicate prefixes are omitted, fewer total results may be returned than requested.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string=} params.prefix Filter results to objects whose names begin with this prefix.
     * @param {string=} params.projection Set of properties to return. Defaults to noAcl.
     * @param {boolean=} params.versions If true, lists all versions of a file as distinct results.
     * @param {storage(v1beta2).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watchAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/storage/v1beta2/b/{bucket}/o/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['bucket'],
        pathParams: ['bucket'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Bucket
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).BucketAccessControl[]} acl Access controls on the bucket.
 * @property {object[]} cors The bucket&#39;s Cross-Origin Resource Sharing (CORS) configuration.
 * @property {storage(v1beta2).ObjectAccessControl[]} defaultObjectAcl Default access controls to apply to new objects when no ACL is provided.
 * @property {string} etag HTTP 1.1 Entity tag for the bucket.
 * @property {string} id The ID of the bucket.
 * @property {string} kind The kind of item this is. For buckets, this is always storage#bucket.
 * @property {object} lifecycle The bucket&#39;s lifecycle configuration. See object lifecycle management for more information.
 * @property {string} location The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Typical values are US and EU. Defaults to US. See the developer&#39;s guide for the authoritative list.
 * @property {object} logging The bucket&#39;s logging configuration, which defines the destination bucket and optional name prefix for the current bucket&#39;s logs.
 * @property {string} metageneration The metadata generation of this bucket.
 * @property {string} name The name of the bucket.
 * @property {object} owner The owner of the bucket. This is always the project team&#39;s owner group.
 * @property {string} selfLink The URI of this bucket.
 * @property {string} storageClass The bucket&#39;s storage class. This defines how objects in the bucket are stored and determines the SLA and the cost of storage. Typical values are STANDARD and DURABLE_REDUCED_AVAILABILITY. Defaults to STANDARD. See the developer&#39;s guide for the authoritative list.
 * @property {string} timeCreated Creation time of the bucket in RFC 3339 format.
 * @property {object} versioning The bucket&#39;s versioning configuration.
 * @property {object} website The bucket&#39;s website configuration.
 */
/**
 * @typedef BucketAccessControl
 * @memberOf! storage(v1beta2)
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
* @property {string} etag HTTP 1.1 Entity tag for the access-control entry.
* @property {string} id The ID of the access-control entry.
* @property {string} kind The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.
* @property {string} role The access permission for the entity. Can be READER, WRITER, or OWNER.
* @property {string} selfLink The link to this access-control entry.
*/
/**
 * @typedef BucketAccessControls
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).BucketAccessControl[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of bucket access control entries, this is always storage#bucketAccessControls.
 */
/**
 * @typedef Buckets
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).Bucket[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of buckets, this is always storage#buckets.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef Channel
 * @memberOf! storage(v1beta2)
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
 * @typedef ComposeRequest
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).Object} destination Properties of the resulting object
 * @property {string} kind The kind of item this is.
 * @property {object[]} sourceObjects The list of source objects that will be concatenated into a single object.
 */
/**
 * @typedef Object
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).ObjectAccessControl[]} acl Access controls on the object.
 * @property {string} bucket The bucket containing this object.
 * @property {string} cacheControl Cache-Control directive for the object data.
 * @property {integer} componentCount Number of underlying components that make up this object. Components are accumulated by compose operations and are limited to a count of 32.
 * @property {string} contentDisposition Content-Disposition of the object data.
 * @property {string} contentEncoding Content-Encoding of the object data.
 * @property {string} contentLanguage Content-Language of the object data.
 * @property {string} contentType Content-Type of the object data.
 * @property {string} crc32c CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64.
 * @property {string} etag HTTP 1.1 Entity tag for the object.
 * @property {string} generation The content generation of this object. Used for object versioning.
 * @property {string} id The ID of the object.
 * @property {string} kind The kind of item this is. For objects, this is always storage#object.
 * @property {string} md5Hash MD5 hash of the data; encoded using base64.
 * @property {string} mediaLink Media download link.
 * @property {object} metadata User-provided metadata, in key/value pairs.
 * @property {string} metageneration The generation of the metadata for this object at this generation. Used for metadata versioning. Has no meaning outside of the context of this generation.
 * @property {string} name The name of this object. Required if not specified by URL parameter.
 * @property {object} owner The owner of the object. This will always be the uploader of the object.
 * @property {string} selfLink The link to this object.
 * @property {string} size Content-Length of the data in bytes.
 * @property {string} storageClass Storage class of the object.
 * @property {string} timeDeleted Deletion time of the object in RFC 3339 format. Will be returned if and only if this version of the object has been deleted.
 * @property {string} updated Modification time of the object metadata in RFC 3339 format.
 */
/**
 * @typedef ObjectAccessControl
 * @memberOf! storage(v1beta2)
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
* @property {string} etag HTTP 1.1 Entity tag for the access-control entry.
* @property {string} generation The content generation of the object.
* @property {string} id The ID of the access-control entry.
* @property {string} kind The kind of item this is. For object access control entries, this is always storage#objectAccessControl.
* @property {string} object The name of the object.
* @property {string} role The access permission for the entity. Can be READER or OWNER.
* @property {string} selfLink The link to this access-control entry.
*/
/**
 * @typedef ObjectAccessControls
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {any[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of object access control entries, this is always storage#objectAccessControls.
 */
/**
 * @typedef Objects
 * @memberOf! storage(v1beta2)
 * @type object
 * @property {storage(v1beta2).Object[]} items The list of items.
 * @property {string} kind The kind of item this is. For lists of objects, this is always storage#objects.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string[]} prefixes The list of prefixes of objects matching-but-not-listed up to and including the requested delimiter.
 */
module.exports = Storage;
