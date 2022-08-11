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
 * Google+ Domains API
 *
 * Builds on top of the Google+ platform for Google Apps Domains.
 *
 * @example
 * var google = require('googleapis');
 * var plusDomains = google.plusDomains('v1');
 *
 * @namespace plusDomains
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Plusdomains
 */
function Plusdomains(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.activities = {

    /**
     * plusDomains.activities.get
     *
     * @desc Get an activity.
     *
     * @alias plusDomains.activities.get
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.activityId The ID of the activity to get.
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
          url: 'https://www.googleapis.com/plusDomains/v1/activities/{activityId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['activityId'],
        pathParams: ['activityId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.activities.insert
     *
     * @desc Create a new activity for the authenticated user.
     *
     * @alias plusDomains.activities.insert
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.preview If "true", extract the potential media attachments for a URL. The response will include all possible attachments for a URL, including video, photos, and articles based on the content of the page.
     * @param {string} params.userId The ID of the user to create the activity on behalf of. Its value should be "me", to indicate the authenticated user.
     * @param {plusDomains(v1).Activity} params.resource Request body data
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/activities',
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
     * plusDomains.activities.list
     *
     * @desc List all of the activities in the specified collection for a particular user.
     *
     * @alias plusDomains.activities.list
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection The collection of activities to list.
     * @param {integer=} params.maxResults The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string} params.userId The ID of the user to get activities for. The special value "me" can be used to indicate the authenticated user.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/activities/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'collection'],
        pathParams: ['collection', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.audiences = {

    /**
     * plusDomains.audiences.list
     *
     * @desc List all of the audiences to which a user can share.
     *
     * @alias plusDomains.audiences.list
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of circles to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string} params.userId The ID of the user to get audiences for. The special value "me" can be used to indicate the authenticated user.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/audiences',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.circles = {

    /**
     * plusDomains.circles.addPeople
     *
     * @desc Add a person to a circle. Google+ limits certain circle operations, including the number of circle adds. Learn More.
     *
     * @alias plusDomains.circles.addPeople
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to add the person to.
     * @param {string=} params.email Email of the people to add to the circle. Optional, can be repeated.
     * @param {string=} params.userId IDs of the people to add to the circle. Optional, can be repeated.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addPeople: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}/people',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.circles.get
     *
     * @desc Get a circle.
     *
     * @alias plusDomains.circles.get
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to get.
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
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.circles.insert
     *
     * @desc Create a new circle for the authenticated user.
     *
     * @alias plusDomains.circles.insert
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The ID of the user to create the circle on behalf of. The value "me" can be used to indicate the authenticated user.
     * @param {plusDomains(v1).Circle} params.resource Request body data
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/circles',
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
     * plusDomains.circles.list
     *
     * @desc List all of the circles for a user.
     *
     * @alias plusDomains.circles.list
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of circles to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string} params.userId The ID of the user to get circles for. The special value "me" can be used to indicate the authenticated user.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/circles',
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
     * plusDomains.circles.patch
     *
     * @desc Update a circle's description. This method supports patch semantics.
     *
     * @alias plusDomains.circles.patch
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to update.
     * @param {plusDomains(v1).Circle} params.resource Request body data
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
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.circles.remove
     *
     * @desc Delete a circle.
     *
     * @alias plusDomains.circles.remove
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to delete.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    remove: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.circles.removePeople
     *
     * @desc Remove a person from a circle.
     *
     * @alias plusDomains.circles.removePeople
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to remove the person from.
     * @param {string=} params.email Email of the people to add to the circle. Optional, can be repeated.
     * @param {string=} params.userId IDs of the people to remove from the circle. Optional, can be repeated.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removePeople: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}/people',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.circles.update
     *
     * @desc Update a circle's description.
     *
     * @alias plusDomains.circles.update
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to update.
     * @param {plusDomains(v1).Circle} params.resource Request body data
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
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.comments = {

    /**
     * plusDomains.comments.get
     *
     * @desc Get a comment.
     *
     * @alias plusDomains.comments.get
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.commentId The ID of the comment to get.
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
          url: 'https://www.googleapis.com/plusDomains/v1/comments/{commentId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['commentId'],
        pathParams: ['commentId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.comments.insert
     *
     * @desc Create a new comment in reply to an activity.
     *
     * @alias plusDomains.comments.insert
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.activityId The ID of the activity to reply to.
     * @param {plusDomains(v1).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/plusDomains/v1/activities/{activityId}/comments',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['activityId'],
        pathParams: ['activityId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.comments.list
     *
     * @desc List all of the comments for an activity.
     *
     * @alias plusDomains.comments.list
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.activityId The ID of the activity to get comments for.
     * @param {integer=} params.maxResults The maximum number of comments to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string=} params.sortOrder The order in which to sort the list of comments.
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
          url: 'https://www.googleapis.com/plusDomains/v1/activities/{activityId}/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['activityId'],
        pathParams: ['activityId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.media = {

    /**
     * plusDomains.media.insert
     *
     * @desc Add a new media item to an album. The current upload size limitations are 36MB for a photo and 1GB for a video. Uploads do not count against quota if photos are less than 2048 pixels on their longest side or videos are less than 15 minutes in length.
     *
     * @alias plusDomains.media.insert
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection 
     * @param {string} params.userId The ID of the user to create the activity on behalf of.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/media/{collection}',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/plusDomains/v1/people/{userId}/media/{collection}',
        requiredParams: ['userId', 'collection'],
        pathParams: ['collection', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.people = {

    /**
     * plusDomains.people.get
     *
     * @desc Get a person's profile.
     *
     * @alias plusDomains.people.get
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The ID of the person to get the profile for. The special value "me" can be used to indicate the authenticated user.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}',
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
     * plusDomains.people.list
     *
     * @desc List all of the people in the specified collection.
     *
     * @alias plusDomains.people.list
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection The collection of people to list.
     * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.orderBy The order to return people in.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {string} params.userId Get the collection of people for the person identified. Use "me" to indicate the authenticated user.
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
          url: 'https://www.googleapis.com/plusDomains/v1/people/{userId}/people/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'collection'],
        pathParams: ['collection', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.people.listByActivity
     *
     * @desc List all of the people in the specified collection for a particular activity.
     *
     * @alias plusDomains.people.listByActivity
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.activityId The ID of the activity to get the list of people for.
     * @param {string} params.collection The collection of people to list.
     * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listByActivity: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/plusDomains/v1/activities/{activityId}/people/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['activityId', 'collection'],
        pathParams: ['activityId', 'collection'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * plusDomains.people.listByCircle
     *
     * @desc List all of the people who are members of a circle.
     *
     * @alias plusDomains.people.listByCircle
     * @memberOf! plusDomains(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.circleId The ID of the circle to get the members of.
     * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listByCircle: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/plusDomains/v1/circles/{circleId}/people',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['circleId'],
        pathParams: ['circleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Acl
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} description Description of the access granted, suitable for display.
 * @property {boolean} domainRestricted Whether access is restricted to the domain.
 * @property {plusDomains(v1).PlusDomainsAclentryResource[]} items The list of access entries.
 * @property {string} kind Identifies this resource as a collection of access controls. Value: &quot;plus#acl&quot;.
 */
/**
 * @typedef Activity
 * @memberOf! plusDomains(v1)
 * @type object
* @property {plusDomains(v1).Acl} access Identifies who has access to see this activity.
* @property {object} actor The person who performed this activity.
* @property {string} address Street address where this activity occurred.
* @property {string} annotation Additional content added by the person who shared this activity, applicable only when resharing an activity.
* @property {string} crosspostSource If this activity is a crosspost from another system, this property specifies the ID of the original activity.
* @property {string} etag ETag of this response for caching purposes.
* @property {string} geocode Latitude and longitude where this activity occurred. Format is latitude followed by longitude, space separated.
* @property {string} id The ID of this activity.
* @property {string} kind Identifies this resource as an activity. Value: &quot;plus#activity&quot;.
* @property {plusDomains(v1).Place} location The location where this activity occurred.
* @property {object} object The object of this activity.
* @property {string} placeId ID of the place where this activity occurred.
* @property {string} placeName Name of the place where this activity occurred.
* @property {object} provider The service provider that initially published this activity.
* @property {string} published The time at which this activity was initially published. Formatted as an RFC 3339 timestamp.
* @property {string} radius Radius, in meters, of the region where this activity occurred, centered at the latitude and longitude identified in geocode.
* @property {string} title Title of this activity.
* @property {string} updated The time at which this activity was last updated. Formatted as an RFC 3339 timestamp.
* @property {string} url The link to this activity.
* @property {string} verb This activity&#39;s verb, which indicates the action that was performed. Possible values include, but are not limited to, the following values:  
- &quot;post&quot; - Publish content to the stream. 
- &quot;share&quot; - Reshare an activity.
*/
/**
 * @typedef ActivityFeed
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {string} id The ID of this collection of activities. Deprecated.
 * @property {plusDomains(v1).Activity[]} items The activities in this page of results.
 * @property {string} kind Identifies this resource as a collection of activities. Value: &quot;plus#activityFeed&quot;.
 * @property {string} nextLink Link to the next page of activities.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} selfLink Link to this activity resource.
 * @property {string} title The title of this collection of activities, which is a truncated portion of the content.
 * @property {string} updated The time at which this collection of activities was last updated. Formatted as an RFC 3339 timestamp.
 */
/**
 * @typedef Audience
 * @memberOf! plusDomains(v1)
 * @type object
* @property {string} etag ETag of this response for caching purposes.
* @property {plusDomains(v1).PlusDomainsAclentryResource} item The access control list entry.
* @property {string} kind Identifies this resource as an audience. Value: &quot;plus#audience&quot;.
* @property {integer} memberCount The number of people in this circle. This only applies if entity_type is CIRCLE.
* @property {string} visibility The circle members&#39; visibility as chosen by the owner of the circle. This only applies for items with &quot;item.type&quot; equals &quot;circle&quot;. Possible values are:  
- &quot;public&quot; - Members are visible to the public. 
- &quot;limited&quot; - Members are visible to a limited audience. 
- &quot;private&quot; - Members are visible to the owner only.
*/
/**
 * @typedef AudiencesFeed
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {plusDomains(v1).Audience[]} items The audiences in this result.
 * @property {string} kind Identifies this resource as a collection of audiences. Value: &quot;plus#audienceFeed&quot;.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {integer} totalItems The total number of ACL entries. The number of entries in this response may be smaller due to paging.
 */
/**
 * @typedef Circle
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} description The description of this circle.
 * @property {string} displayName The circle name.
 * @property {string} etag ETag of this response for caching purposes.
 * @property {string} id The ID of the circle.
 * @property {string} kind Identifies this resource as a circle. Value: &quot;plus#circle&quot;.
 * @property {object} people The people in this circle.
 * @property {string} selfLink Link to this circle resource
 */
/**
 * @typedef CircleFeed
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {plusDomains(v1).Circle[]} items The circles in this page of results.
 * @property {string} kind Identifies this resource as a collection of circles. Value: &quot;plus#circleFeed&quot;.
 * @property {string} nextLink Link to the next page of circles.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} selfLink Link to this page of circles.
 * @property {string} title The title of this list of resources.
 * @property {integer} totalItems The total number of circles. The number of circles in this response may be smaller due to paging.
 */
/**
 * @typedef Comment
 * @memberOf! plusDomains(v1)
 * @type object
* @property {object} actor The person who posted this comment.
* @property {string} etag ETag of this response for caching purposes.
* @property {string} id The ID of this comment.
* @property {object[]} inReplyTo The activity this comment replied to.
* @property {string} kind Identifies this resource as a comment. Value: &quot;plus#comment&quot;.
* @property {object} object The object of this comment.
* @property {object} plusoners People who +1&#39;d this comment.
* @property {string} published The time at which this comment was initially published. Formatted as an RFC 3339 timestamp.
* @property {string} selfLink Link to this comment resource.
* @property {string} updated The time at which this comment was last updated. Formatted as an RFC 3339 timestamp.
* @property {string} verb This comment&#39;s verb, indicating what action was performed. Possible values are:  
- &quot;post&quot; - Publish content to the stream.
*/
/**
 * @typedef CommentFeed
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {string} id The ID of this collection of comments.
 * @property {plusDomains(v1).Comment[]} items The comments in this page of results.
 * @property {string} kind Identifies this resource as a collection of comments. Value: &quot;plus#commentFeed&quot;.
 * @property {string} nextLink Link to the next page of activities.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} title The title of this collection of comments.
 * @property {string} updated The time at which this collection of comments was last updated. Formatted as an RFC 3339 timestamp.
 */
/**
 * @typedef Media
 * @memberOf! plusDomains(v1)
 * @type object
* @property {object} author The person who uploaded this media.
* @property {string} displayName The display name for this media.
* @property {string} etag ETag of this response for caching purposes.
* @property {object} exif Exif information of the media item.
* @property {integer} height The height in pixels of the original image.
* @property {string} id ID of this media, which is generated by the API.
* @property {string} kind The type of resource.
* @property {string} mediaCreatedTime The time at which this media was originally created in UTC. Formatted as an RFC 3339 timestamp that matches this example: 2010-11-25T14:30:27.655Z
* @property {string} mediaUrl The URL of this photo or video&#39;s still image.
* @property {string} published The time at which this media was uploaded. Formatted as an RFC 3339 timestamp.
* @property {string} sizeBytes The size in bytes of this video.
* @property {plusDomains(v1).Videostream[]} streams The list of video streams for this video. There might be several different streams available for a single video, either Flash or MPEG, of various sizes
* @property {string} summary A description, or caption, for this media.
* @property {string} updated The time at which this media was last updated. This includes changes to media metadata. Formatted as an RFC 3339 timestamp.
* @property {string} url The URL for the page that hosts this media.
* @property {string} videoDuration The duration in milliseconds of this video.
* @property {string} videoStatus The encoding status of this video. Possible values are:  
- &quot;UPLOADING&quot; - Not all the video bytes have been received. 
- &quot;PENDING&quot; - Video not yet processed. 
- &quot;FAILED&quot; - Video processing failed. 
- &quot;READY&quot; - A single video stream is playable. 
- &quot;FINAL&quot; - All video streams are playable.
* @property {integer} width The width in pixels of the original image.
*/
/**
 * @typedef PeopleFeed
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {plusDomains(v1).Person[]} items The people in this page of results. Each item includes the id, displayName, image, and url for the person. To retrieve additional profile data, see the people.get method.
 * @property {string} kind Identifies this resource as a collection of people. Value: &quot;plus#peopleFeed&quot;.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} selfLink Link to this resource.
 * @property {string} title The title of this collection of people.
 * @property {integer} totalItems The total number of people available in this list. The number of people in a response might be smaller due to paging. This might not be set for all collections.
 */
/**
 * @typedef Person
 * @memberOf! plusDomains(v1)
 * @type object
* @property {string} aboutMe A short biography for this person.
* @property {string} birthday The person&#39;s date of birth, represented as YYYY-MM-DD.
* @property {string} braggingRights The &quot;bragging rights&quot; line of this person.
* @property {integer} circledByCount For followers who are visible, the number of people who have added this person or page to a circle.
* @property {object} cover The cover photo content.
* @property {string} currentLocation (this field is not currently used)
* @property {string} displayName The name of this person, which is suitable for display.
* @property {string} domain The hosted domain name for the user&#39;s Google Apps account. For instance, example.com. The plus.profile.emails.read or email scope is needed to get this domain name.
* @property {object[]} emails A list of email addresses that this person has, including their Google account email address, and the public verified email addresses on their Google+ profile. The plus.profile.emails.read scope is needed to retrieve these email addresses, or the email scope can be used to retrieve just the Google account email address.
* @property {string} etag ETag of this response for caching purposes.
* @property {string} gender The person&#39;s gender. Possible values include, but are not limited to, the following values:  
- &quot;male&quot; - Male gender. 
- &quot;female&quot; - Female gender. 
- &quot;other&quot; - Other.
* @property {string} id The ID of this person.
* @property {object} image The representation of the person&#39;s profile photo.
* @property {boolean} isPlusUser Whether this user has signed up for Google+.
* @property {string} kind Identifies this resource as a person. Value: &quot;plus#person&quot;.
* @property {object} name An object representation of the individual components of a person&#39;s name.
* @property {string} nickname The nickname of this person.
* @property {string} objectType Type of person within Google+. Possible values include, but are not limited to, the following values:  
- &quot;person&quot; - represents an actual person. 
- &quot;page&quot; - represents a page.
* @property {string} occupation The occupation of this person.
* @property {object[]} organizations A list of current or past organizations with which this person is associated.
* @property {object[]} placesLived A list of places where this person has lived.
* @property {integer} plusOneCount If a Google+ Page, the number of people who have +1&#39;d this page.
* @property {string} relationshipStatus The person&#39;s relationship status. Possible values include, but are not limited to, the following values:  
- &quot;single&quot; - Person is single. 
- &quot;in_a_relationship&quot; - Person is in a relationship. 
- &quot;engaged&quot; - Person is engaged. 
- &quot;married&quot; - Person is married. 
- &quot;its_complicated&quot; - The relationship is complicated. 
- &quot;open_relationship&quot; - Person is in an open relationship. 
- &quot;widowed&quot; - Person is widowed. 
- &quot;in_domestic_partnership&quot; - Person is in a domestic partnership. 
- &quot;in_civil_union&quot; - Person is in a civil union.
* @property {string} skills The person&#39;s skills.
* @property {string} tagline The brief description (tagline) of this person.
* @property {string} url The URL of this person&#39;s profile.
* @property {object[]} urls A list of URLs for this person.
* @property {boolean} verified Whether the person or Google+ Page has been verified.
*/
/**
 * @typedef Place
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {object} address The physical address of the place.
 * @property {string} displayName The display name of the place.
 * @property {string} id The id of the place.
 * @property {string} kind Identifies this resource as a place. Value: &quot;plus#place&quot;.
 * @property {object} position The position of the place.
 */
/**
 * @typedef PlusDomainsAclentryResource
 * @memberOf! plusDomains(v1)
 * @type object
* @property {string} displayName A descriptive name for this entry. Suitable for display.
* @property {string} id The ID of the entry. For entries of type &quot;person&quot; or &quot;circle&quot;, this is the ID of the resource. For other types, this property is not set.
* @property {string} type The type of entry describing to whom access is granted. Possible values are:  
- &quot;person&quot; - Access to an individual. 
- &quot;circle&quot; - Access to members of a circle. 
- &quot;myCircles&quot; - Access to members of all the person&#39;s circles. 
- &quot;extendedCircles&quot; - Access to members of all the person&#39;s circles, plus all of the people in their circles. 
- &quot;domain&quot; - Access to members of the person&#39;s Google Apps domain. 
- &quot;public&quot; - Access to anyone on the web.
*/
/**
 * @typedef Videostream
 * @memberOf! plusDomains(v1)
 * @type object
 * @property {integer} height The height, in pixels, of the video resource.
 * @property {string} type MIME type of the video stream.
 * @property {string} url URL of the video stream.
 * @property {integer} width The width, in pixels, of the video resource.
 */
module.exports = Plusdomains;
