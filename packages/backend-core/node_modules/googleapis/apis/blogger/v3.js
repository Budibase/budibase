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
 * Blogger API
 *
 * API for access to the data within Blogger.
 *
 * @example
 * var google = require('googleapis');
 * var blogger = google.blogger('v3');
 *
 * @namespace blogger
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Blogger
 */
function Blogger(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.blogUserInfos = {

    /**
     * blogger.blogUserInfos.get
     *
     * @desc Gets one blog and user info pair by blogId and userId.
     *
     * @alias blogger.blogUserInfos.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog to get.
     * @param {integer=} params.maxPosts Maximum number of posts to pull back with the blog.
     * @param {string} params.userId ID of the user whose blogs are to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
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
          url: 'https://www.googleapis.com/blogger/v3/users/{userId}/blogs/{blogId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'blogId'],
        pathParams: ['blogId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.blogs = {

    /**
     * blogger.blogs.get
     *
     * @desc Gets one blog by ID.
     *
     * @alias blogger.blogs.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog to get.
     * @param {integer=} params.maxPosts Maximum number of posts to pull back with the blog.
     * @param {string=} params.view Access level with which to view the blog. Note that some fields require elevated access.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.blogs.getByUrl
     *
     * @desc Retrieve a Blog by URL.
     *
     * @alias blogger.blogs.getByUrl
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.url The URL of the blog to retrieve.
     * @param {string=} params.view Access level with which to view the blog. Note that some fields require elevated access.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getByUrl: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/byurl',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['url'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.blogs.listByUser
     *
     * @desc Retrieves a list of blogs, possibly filtered.
     *
     * @alias blogger.blogs.listByUser
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.fetchUserInfo Whether the response is a list of blogs with per-user information instead of just blogs.
     * @param {string=} params.role User access types for blogs to include in the results, e.g. AUTHOR will return blogs where the user has author level access. If no roles are specified, defaults to ADMIN and AUTHOR roles.
     * @param {string=} params.status Blog statuses to include in the result (default: Live blogs only). Note that ADMIN access is required to view deleted blogs.
     * @param {string} params.userId ID of the user whose blogs are to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
     * @param {string=} params.view Access level with which to view the blogs. Note that some fields require elevated access.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listByUser: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/users/{userId}/blogs',
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

  self.comments = {

    /**
     * blogger.comments.approve
     *
     * @desc Marks a comment as not spam.
     *
     * @alias blogger.comments.approve
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.commentId The ID of the comment to mark as not spam.
     * @param {string} params.postId The ID of the Post.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    approve: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/approve',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId', 'commentId'],
        pathParams: ['blogId', 'commentId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.delete
     *
     * @desc Delete a comment by ID.
     *
     * @alias blogger.comments.delete
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.commentId The ID of the comment to delete.
     * @param {string} params.postId The ID of the Post.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId', 'commentId'],
        pathParams: ['blogId', 'commentId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.get
     *
     * @desc Gets one comment by ID.
     *
     * @alias blogger.comments.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to containing the comment.
     * @param {string} params.commentId The ID of the comment to get.
     * @param {string} params.postId ID of the post to fetch posts from.
     * @param {string=} params.view Access level for the requested comment (default: READER). Note that some comments will require elevated permissions, for example comments where the parent posts which is in a draft state, or comments that are pending moderation.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId', 'commentId'],
        pathParams: ['blogId', 'commentId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.list
     *
     * @desc Retrieves the comments for a post, possibly filtered.
     *
     * @alias blogger.comments.list
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch comments from.
     * @param {string=} params.endDate Latest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @param {boolean=} params.fetchBodies Whether the body content of the comments is included.
     * @param {integer=} params.maxResults Maximum number of comments to include in the result.
     * @param {string=} params.pageToken Continuation token if request is paged.
     * @param {string} params.postId ID of the post to fetch posts from.
     * @param {string=} params.startDate Earliest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @param {string=} params.status 
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require elevated access.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.listByBlog
     *
     * @desc Retrieves the comments for a blog, across all posts, possibly filtered.
     *
     * @alias blogger.comments.listByBlog
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch comments from.
     * @param {string=} params.endDate Latest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @param {boolean=} params.fetchBodies Whether the body content of the comments is included.
     * @param {integer=} params.maxResults Maximum number of comments to include in the result.
     * @param {string=} params.pageToken Continuation token if request is paged.
     * @param {string=} params.startDate Earliest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @param {string=} params.status 
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listByBlog: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.markAsSpam
     *
     * @desc Marks a comment as spam.
     *
     * @alias blogger.comments.markAsSpam
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.commentId The ID of the comment to mark as spam.
     * @param {string} params.postId The ID of the Post.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    markAsSpam: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/spam',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId', 'commentId'],
        pathParams: ['blogId', 'commentId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.comments.removeContent
     *
     * @desc Removes the content of a comment.
     *
     * @alias blogger.comments.removeContent
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.commentId The ID of the comment to delete content from.
     * @param {string} params.postId The ID of the Post.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeContent: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/removecontent',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId', 'commentId'],
        pathParams: ['blogId', 'commentId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pageViews = {

    /**
     * blogger.pageViews.get
     *
     * @desc Retrieve pageview stats for a Blog.
     *
     * @alias blogger.pageViews.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog to get.
     * @param {string=} params.range 
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pageviews',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pages = {

    /**
     * blogger.pages.delete
     *
     * @desc Delete a page by ID.
     *
     * @alias blogger.pages.delete
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.pageId The ID of the Page.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.get
     *
     * @desc Gets one blog page by ID.
     *
     * @alias blogger.pages.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog containing the page.
     * @param {string} params.pageId The ID of the page to get.
     * @param {string=} params.view 
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.insert
     *
     * @desc Add a page.
     *
     * @alias blogger.pages.insert
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to add the page to.
     * @param {boolean=} params.isDraft Whether to create the page as a draft (default: false).
     * @param {blogger(v3).Page} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.list
     *
     * @desc Retrieves the pages for a blog, optionally including non-LIVE statuses.
     *
     * @alias blogger.pages.list
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch Pages from.
     * @param {boolean=} params.fetchBodies Whether to retrieve the Page bodies.
     * @param {integer=} params.maxResults Maximum number of Pages to fetch.
     * @param {string=} params.pageToken Continuation token if the request is paged.
     * @param {string=} params.status 
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require elevated access.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.patch
     *
     * @desc Update a page. This method supports patch semantics.
     *
     * @alias blogger.pages.patch
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.pageId The ID of the Page.
     * @param {boolean=} params.publish Whether a publish action should be performed when the page is updated (default: false).
     * @param {boolean=} params.revert Whether a revert action should be performed when the page is updated (default: false).
     * @param {blogger(v3).Page} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.publish
     *
     * @desc Publishes a draft page.
     *
     * @alias blogger.pages.publish
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog.
     * @param {string} params.pageId The ID of the page.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}/publish',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.revert
     *
     * @desc Revert a published or scheduled page to draft state.
     *
     * @alias blogger.pages.revert
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog.
     * @param {string} params.pageId The ID of the page.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    revert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}/revert',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.pages.update
     *
     * @desc Update a page.
     *
     * @alias blogger.pages.update
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.pageId The ID of the Page.
     * @param {boolean=} params.publish Whether a publish action should be performed when the page is updated (default: false).
     * @param {boolean=} params.revert Whether a revert action should be performed when the page is updated (default: false).
     * @param {blogger(v3).Page} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/pages/{pageId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['blogId', 'pageId'],
        pathParams: ['blogId', 'pageId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.postUserInfos = {

    /**
     * blogger.postUserInfos.get
     *
     * @desc Gets one post and user info pair, by post ID and user ID. The post user info contains per-user information about the post, such as access rights, specific to the user.
     *
     * @alias blogger.postUserInfos.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog.
     * @param {integer=} params.maxComments Maximum number of comments to pull back on a post.
     * @param {string} params.postId The ID of the post to get.
     * @param {string} params.userId ID of the user for the per-user information to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
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
          url: 'https://www.googleapis.com/blogger/v3/users/{userId}/blogs/{blogId}/posts/{postId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'blogId', 'postId'],
        pathParams: ['blogId', 'postId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.postUserInfos.list
     *
     * @desc Retrieves a list of post and post user info pairs, possibly filtered. The post user info contains per-user information about the post, such as access rights, specific to the user.
     *
     * @alias blogger.postUserInfos.list
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch posts from.
     * @param {string=} params.endDate Latest post date to fetch, a date-time with RFC 3339 formatting.
     * @param {boolean=} params.fetchBodies Whether the body content of posts is included. Default is false.
     * @param {string=} params.labels Comma-separated list of labels to search for.
     * @param {integer=} params.maxResults Maximum number of posts to fetch.
     * @param {string=} params.orderBy Sort order applied to search results. Default is published.
     * @param {string=} params.pageToken Continuation token if the request is paged.
     * @param {string=} params.startDate Earliest post date to fetch, a date-time with RFC 3339 formatting.
     * @param {string=} params.status 
     * @param {string} params.userId ID of the user for the per-user information to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require elevated access.
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
          url: 'https://www.googleapis.com/blogger/v3/users/{userId}/blogs/{blogId}/posts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId', 'blogId'],
        pathParams: ['blogId', 'userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.posts = {

    /**
     * blogger.posts.delete
     *
     * @desc Delete a post by ID.
     *
     * @alias blogger.posts.delete
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.postId The ID of the Post.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.get
     *
     * @desc Get a post by ID.
     *
     * @alias blogger.posts.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch the post from.
     * @param {boolean=} params.fetchBody Whether the body content of the post is included (default: true). This should be set to false when the post bodies are not required, to help minimize traffic.
     * @param {boolean=} params.fetchImages Whether image URL metadata for each post is included (default: false).
     * @param {integer=} params.maxComments Maximum number of comments to pull back on a post.
     * @param {string} params.postId The ID of the post
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require elevated access.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.getByPath
     *
     * @desc Retrieve a Post by Path.
     *
     * @alias blogger.posts.getByPath
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch the post from.
     * @param {integer=} params.maxComments Maximum number of comments to pull back on a post.
     * @param {string} params.path Path of the Post to retrieve.
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require elevated access.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getByPath: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/bypath',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'path'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.insert
     *
     * @desc Add a post.
     *
     * @alias blogger.posts.insert
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to add the post to.
     * @param {boolean=} params.fetchBody Whether the body content of the post is included with the result (default: true).
     * @param {boolean=} params.fetchImages Whether image URL metadata for each post is included in the returned result (default: false).
     * @param {boolean=} params.isDraft Whether to create the post as a draft (default: false).
     * @param {blogger(v3).Post} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.list
     *
     * @desc Retrieves a list of posts, possibly filtered.
     *
     * @alias blogger.posts.list
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch posts from.
     * @param {string=} params.endDate Latest post date to fetch, a date-time with RFC 3339 formatting.
     * @param {boolean=} params.fetchBodies Whether the body content of posts is included (default: true). This should be set to false when the post bodies are not required, to help minimize traffic.
     * @param {boolean=} params.fetchImages Whether image URL metadata for each post is included.
     * @param {string=} params.labels Comma-separated list of labels to search for.
     * @param {integer=} params.maxResults Maximum number of posts to fetch.
     * @param {string=} params.orderBy Sort search results
     * @param {string=} params.pageToken Continuation token if the request is paged.
     * @param {string=} params.startDate Earliest post date to fetch, a date-time with RFC 3339 formatting.
     * @param {string=} params.status Statuses to include in the results.
     * @param {string=} params.view Access level with which to view the returned result. Note that some fields require escalated access.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.patch
     *
     * @desc Update a post. This method supports patch semantics.
     *
     * @alias blogger.posts.patch
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {boolean=} params.fetchBody Whether the body content of the post is included with the result (default: true).
     * @param {boolean=} params.fetchImages Whether image URL metadata for each post is included in the returned result (default: false).
     * @param {integer=} params.maxComments Maximum number of comments to retrieve with the returned post.
     * @param {string} params.postId The ID of the Post.
     * @param {boolean=} params.publish Whether a publish action should be performed when the post is updated (default: false).
     * @param {boolean=} params.revert Whether a revert action should be performed when the post is updated (default: false).
     * @param {blogger(v3).Post} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.publish
     *
     * @desc Publishes a draft post, optionally at the specific time of the given publishDate parameter.
     *
     * @alias blogger.posts.publish
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.postId The ID of the Post.
     * @param {string=} params.publishDate Optional date and time to schedule the publishing of the Blog. If no publishDate parameter is given, the post is either published at the a previously saved schedule date (if present), or the current time. If a future date is given, the post will be scheduled to be published.
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/publish',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.revert
     *
     * @desc Revert a published or scheduled post to draft state.
     *
     * @alias blogger.posts.revert
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {string} params.postId The ID of the Post.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    revert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}/revert',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.search
     *
     * @desc Search for a post.
     *
     * @alias blogger.posts.search
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch the post from.
     * @param {boolean=} params.fetchBodies Whether the body content of posts is included (default: true). This should be set to false when the post bodies are not required, to help minimize traffic.
     * @param {string=} params.orderBy Sort search results
     * @param {string} params.q Query terms to search this blog for matching posts.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/search',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'q'],
        pathParams: ['blogId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * blogger.posts.update
     *
     * @desc Update a post.
     *
     * @alias blogger.posts.update
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the Blog.
     * @param {boolean=} params.fetchBody Whether the body content of the post is included with the result (default: true).
     * @param {boolean=} params.fetchImages Whether image URL metadata for each post is included in the returned result (default: false).
     * @param {integer=} params.maxComments Maximum number of comments to retrieve with the returned post.
     * @param {string} params.postId The ID of the Post.
     * @param {boolean=} params.publish Whether a publish action should be performed when the post is updated (default: false).
     * @param {boolean=} params.revert Whether a revert action should be performed when the post is updated (default: false).
     * @param {blogger(v3).Post} params.resource Request body data
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
          url: 'https://www.googleapis.com/blogger/v3/blogs/{blogId}/posts/{postId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.users = {

    /**
     * blogger.users.get
     *
     * @desc Gets one user by ID.
     *
     * @alias blogger.users.get
     * @memberOf! blogger(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId The ID of the user to get.
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
          url: 'https://www.googleapis.com/blogger/v3/users/{userId}',
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
}

/**
 * @typedef Blog
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} customMetaData The JSON custom meta-data for the Blog
 * @property {string} description The description of this blog. This is displayed underneath the title.
 * @property {string} id The identifier for this resource.
 * @property {string} kind The kind of this entry. Always blogger#blog
 * @property {object} locale The locale this Blog is set to.
 * @property {string} name The name of this blog. This is displayed as the title.
 * @property {object} pages The container of pages in this blog.
 * @property {object} posts The container of posts in this blog.
 * @property {string} published RFC 3339 date-time when this blog was published.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} status The status of the blog.
 * @property {string} updated RFC 3339 date-time when this blog was last updated.
 * @property {string} url The URL where this blog is published.
 */
/**
 * @typedef BlogList
 * @memberOf! blogger(v3)
 * @type object
 * @property {blogger(v3).BlogUserInfo[]} blogUserInfos Admin level list of blog per-user information
 * @property {blogger(v3).Blog[]} items The list of Blogs this user has Authorship or Admin rights over.
 * @property {string} kind The kind of this entity. Always blogger#blogList
 */
/**
 * @typedef BlogPerUserInfo
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} blogId ID of the Blog resource
 * @property {boolean} hasAdminAccess True if the user has Admin level access to the blog.
 * @property {string} kind The kind of this entity. Always blogger#blogPerUserInfo
 * @property {string} photosAlbumKey The Photo Album Key for the user when adding photos to the blog
 * @property {string} role Access permissions that the user has for the blog (ADMIN, AUTHOR, or READER).
 * @property {string} userId ID of the User
 */
/**
 * @typedef BlogUserInfo
 * @memberOf! blogger(v3)
 * @type object
 * @property {blogger(v3).Blog} blog The Blog resource.
 * @property {blogger(v3).BlogPerUserInfo} blog_user_info Information about a User for the Blog.
 * @property {string} kind The kind of this entity. Always blogger#blogUserInfo
 */
/**
 * @typedef Comment
 * @memberOf! blogger(v3)
 * @type object
 * @property {object} author The author of this Comment.
 * @property {object} blog Data about the blog containing this comment.
 * @property {string} content The actual content of the comment. May include HTML markup.
 * @property {string} id The identifier for this resource.
 * @property {object} inReplyTo Data about the comment this is in reply to.
 * @property {string} kind The kind of this entry. Always blogger#comment
 * @property {object} post Data about the post containing this comment.
 * @property {string} published RFC 3339 date-time when this comment was published.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} status The status of the comment (only populated for admin users)
 * @property {string} updated RFC 3339 date-time when this comment was last updated.
 */
/**
 * @typedef CommentList
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} etag Etag of the response.
 * @property {blogger(v3).Comment[]} items The List of Comments for a Post.
 * @property {string} kind The kind of this entry. Always blogger#commentList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 * @property {string} prevPageToken Pagination token to fetch the previous page, if one exists.
 */
/**
 * @typedef Page
 * @memberOf! blogger(v3)
 * @type object
 * @property {object} author The author of this Page.
 * @property {object} blog Data about the blog containing this Page.
 * @property {string} content The body content of this Page, in HTML.
 * @property {string} etag Etag of the resource.
 * @property {string} id The identifier for this resource.
 * @property {string} kind The kind of this entity. Always blogger#page
 * @property {string} published RFC 3339 date-time when this Page was published.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} status The status of the page for admin resources (either LIVE or DRAFT).
 * @property {string} title The title of this entity. This is the name displayed in the Admin user interface.
 * @property {string} updated RFC 3339 date-time when this Page was last updated.
 * @property {string} url The URL that this Page is displayed at.
 */
/**
 * @typedef PageList
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} etag Etag of the response.
 * @property {blogger(v3).Page[]} items The list of Pages for a Blog.
 * @property {string} kind The kind of this entity. Always blogger#pageList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 */
/**
 * @typedef Pageviews
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} blogId Blog Id
 * @property {object[]} counts The container of posts in this blog.
 * @property {string} kind The kind of this entry. Always blogger#page_views
 */
/**
 * @typedef Post
 * @memberOf! blogger(v3)
 * @type object
 * @property {object} author The author of this Post.
 * @property {object} blog Data about the blog containing this Post.
 * @property {string} content The content of the Post. May contain HTML markup.
 * @property {string} customMetaData The JSON meta-data for the Post.
 * @property {string} etag Etag of the resource.
 * @property {string} id The identifier of this Post.
 * @property {object[]} images Display image for the Post.
 * @property {string} kind The kind of this entity. Always blogger#post
 * @property {string[]} labels The list of labels this Post was tagged with.
 * @property {object} location The location for geotagged posts.
 * @property {string} published RFC 3339 date-time when this Post was published.
 * @property {string} readerComments Comment control and display setting for readers of this post.
 * @property {object} replies The container of comments on this Post.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} status Status of the post. Only set for admin-level requests
 * @property {string} title The title of the Post.
 * @property {string} titleLink The title link URL, similar to atom&#39;s related link.
 * @property {string} updated RFC 3339 date-time when this Post was last updated.
 * @property {string} url The URL where this Post is displayed.
 */
/**
 * @typedef PostList
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} etag Etag of the response.
 * @property {blogger(v3).Post[]} items The list of Posts for this Blog.
 * @property {string} kind The kind of this entity. Always blogger#postList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 */
/**
 * @typedef PostPerUserInfo
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} blogId ID of the Blog that the post resource belongs to.
 * @property {boolean} hasEditAccess True if the user has Author level access to the post.
 * @property {string} kind The kind of this entity. Always blogger#postPerUserInfo
 * @property {string} postId ID of the Post resource.
 * @property {string} userId ID of the User.
 */
/**
 * @typedef PostUserInfo
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} kind The kind of this entity. Always blogger#postUserInfo
 * @property {blogger(v3).Post} post The Post resource.
 * @property {blogger(v3).PostPerUserInfo} post_user_info Information about a User for the Post.
 */
/**
 * @typedef PostUserInfosList
 * @memberOf! blogger(v3)
 * @type object
 * @property {blogger(v3).PostUserInfo[]} items The list of Posts with User information for the post, for this Blog.
 * @property {string} kind The kind of this entity. Always blogger#postList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 */
/**
 * @typedef User
 * @memberOf! blogger(v3)
 * @type object
 * @property {string} about Profile summary information.
 * @property {object} blogs The container of blogs for this user.
 * @property {string} created The timestamp of when this profile was created, in seconds since epoch.
 * @property {string} displayName The display name.
 * @property {string} id The identifier for this User.
 * @property {string} kind The kind of this entity. Always blogger#user
 * @property {object} locale This user&#39;s locale
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} url The user&#39;s profile page.
 */
module.exports = Blogger;
