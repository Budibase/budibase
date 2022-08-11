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
 * var blogger = google.blogger('v2');
 *
 * @namespace blogger
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Blogger
 */
function Blogger(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.blogs = {

    /**
     * blogger.blogs.get
     *
     * @desc Gets one blog by id.
     *
     * @alias blogger.blogs.get
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId The ID of the blog to get.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}',
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

  self.comments = {

    /**
     * blogger.comments.get
     *
     * @desc Gets one comment by id.
     *
     * @alias blogger.comments.get
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to containing the comment.
     * @param {string} params.commentId The ID of the comment to get.
     * @param {string} params.postId ID of the post to fetch posts from.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/posts/{postId}/comments/{commentId}',
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
     * @desc Retrieves the comments for a blog, possibly filtered.
     *
     * @alias blogger.comments.list
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch comments from.
     * @param {boolean=} params.fetchBodies Whether the body content of the comments is included.
     * @param {integer=} params.maxResults Maximum number of comments to include in the result.
     * @param {string=} params.pageToken Continuation token if request is paged.
     * @param {string} params.postId ID of the post to fetch posts from.
     * @param {string=} params.startDate Earliest date of comment to fetch, a date-time with RFC 3339 formatting.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/posts/{postId}/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['blogId', 'postId'],
        pathParams: ['blogId', 'postId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pages = {

    /**
     * blogger.pages.get
     *
     * @desc Gets one blog page by id.
     *
     * @alias blogger.pages.get
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog containing the page.
     * @param {string} params.pageId The ID of the page to get.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/pages/{pageId}',
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
     * blogger.pages.list
     *
     * @desc Retrieves pages for a blog, possibly filtered.
     *
     * @alias blogger.pages.list
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch pages from.
     * @param {boolean=} params.fetchBodies Whether to retrieve the Page bodies.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/pages',
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

  self.posts = {

    /**
     * blogger.posts.get
     *
     * @desc Get a post by id.
     *
     * @alias blogger.posts.get
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch the post from.
     * @param {string} params.postId The ID of the post
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/posts/{postId}',
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
     * blogger.posts.list
     *
     * @desc Retrieves a list of posts, possibly filtered.
     *
     * @alias blogger.posts.list
     * @memberOf! blogger(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.blogId ID of the blog to fetch posts from.
     * @param {boolean=} params.fetchBodies Whether the body content of posts is included.
     * @param {integer=} params.maxResults Maximum number of posts to fetch.
     * @param {string=} params.pageToken Continuation token if the request is paged.
     * @param {string=} params.startDate Earliest post date to fetch, a date-time with RFC 3339 formatting.
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
          url: 'https://www.googleapis.com/blogger/v2/blogs/{blogId}/posts',
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

  self.users = {

    /**
     * blogger.users.get
     *
     * @desc Gets one user by id.
     *
     * @alias blogger.users.get
     * @memberOf! blogger(v2)
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
          url: 'https://www.googleapis.com/blogger/v2/users/{userId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    blogs: {

      /**
       * blogger.users.blogs.list
       *
       * @desc Retrieves a list of blogs, possibly filtered.
       *
       * @alias blogger.users.blogs.list
       * @memberOf! blogger(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.userId ID of the user whose blogs are to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
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
            url: 'https://www.googleapis.com/blogger/v2/users/{userId}/blogs',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['userId'],
          pathParams: ['userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Blog
 * @memberOf! blogger(v2)
 * @type object
 * @property {string} description The description of this blog. This is displayed underneath the title.
 * @property {string} id The identifier for this resource.
 * @property {string} kind The kind of this entry. Always blogger#blog
 * @property {object} locale The locale this Blog is set to.
 * @property {string} name The name of this blog. This is displayed as the title.
 * @property {object} pages The container of pages in this blog.
 * @property {object} posts The container of posts in this blog.
 * @property {string} published RFC 3339 date-time when this blog was published.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} updated RFC 3339 date-time when this blog was last updated.
 * @property {string} url The URL where this blog is published.
 */
/**
 * @typedef BlogList
 * @memberOf! blogger(v2)
 * @type object
 * @property {blogger(v2).Blog[]} items The list of Blogs this user has Authorship or Admin rights over.
 * @property {string} kind The kind of this entity. Always blogger#blogList
 */
/**
 * @typedef Comment
 * @memberOf! blogger(v2)
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
 * @property {string} updated RFC 3339 date-time when this comment was last updated.
 */
/**
 * @typedef CommentList
 * @memberOf! blogger(v2)
 * @type object
 * @property {blogger(v2).Comment[]} items The List of Comments for a Post.
 * @property {string} kind The kind of this entry. Always blogger#commentList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 * @property {string} prevPageToken Pagination token to fetch the previous page, if one exists.
 */
/**
 * @typedef Page
 * @memberOf! blogger(v2)
 * @type object
 * @property {object} author The author of this Page.
 * @property {object} blog Data about the blog containing this Page.
 * @property {string} content The body content of this Page, in HTML.
 * @property {string} id The identifier for this resource.
 * @property {string} kind The kind of this entity. Always blogger#page
 * @property {string} published RFC 3339 date-time when this Page was published.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} title The title of this entity. This is the name displayed in the Admin user interface.
 * @property {string} updated RFC 3339 date-time when this Page was last updated.
 * @property {string} url The URL that this Page is displayed at.
 */
/**
 * @typedef PageList
 * @memberOf! blogger(v2)
 * @type object
 * @property {blogger(v2).Page[]} items The list of Pages for a Blog.
 * @property {string} kind The kind of this entity. Always blogger#pageList
 */
/**
 * @typedef Post
 * @memberOf! blogger(v2)
 * @type object
 * @property {object} author The author of this Post.
 * @property {object} blog Data about the blog containing this Post.
 * @property {string} content The content of the Post. May contain HTML markup.
 * @property {string} id The identifier of this Post.
 * @property {string} kind The kind of this entity. Always blogger#post
 * @property {string[]} labels The list of labels this Post was tagged with.
 * @property {string} published RFC 3339 date-time when this Post was published.
 * @property {object} replies The container of comments on this Post.
 * @property {string} selfLink The API REST URL to fetch this resource from.
 * @property {string} title The title of the Post.
 * @property {string} updated RFC 3339 date-time when this Post was last updated.
 * @property {string} url The URL where this Post is displayed.
 */
/**
 * @typedef PostList
 * @memberOf! blogger(v2)
 * @type object
 * @property {blogger(v2).Post[]} items The list of Posts for this Blog.
 * @property {string} kind The kind of this entity. Always blogger#postList
 * @property {string} nextPageToken Pagination token to fetch the next page, if one exists.
 * @property {string} prevPageToken Pagination token to fetch the previous page, if one exists.
 */
/**
 * @typedef User
 * @memberOf! blogger(v2)
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
