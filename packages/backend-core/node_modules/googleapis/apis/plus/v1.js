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
 * Google+ API
 *
 * Builds on top of the Google+ platform.
 *
 * @example
 * var google = require('googleapis');
 * var plus = google.plus('v1');
 *
 * @namespace plus
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Plus
 */
function Plus(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.activities = {

    /**
     * plus.activities.get
     *
     * @desc Get an activity.
     *
     * @alias plus.activities.get
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/activities/{activityId}',
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
     * plus.activities.list
     *
     * @desc List all of the activities in the specified collection for a particular user.
     *
     * @alias plus.activities.list
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/people/{userId}/activities/{collection}',
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
     * plus.activities.search
     *
     * @desc Search public activities.
     *
     * @alias plus.activities.search
     * @memberOf! plus(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.language Specify the preferred language to search with. See search language codes for available values.
     * @param {integer=} params.maxResults The maximum number of activities to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.orderBy Specifies how to order search results.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
     * @param {string} params.query Full-text search query string.
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
          url: 'https://www.googleapis.com/plus/v1/activities',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['query'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.comments = {

    /**
     * plus.comments.get
     *
     * @desc Get a comment.
     *
     * @alias plus.comments.get
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/comments/{commentId}',
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
     * plus.comments.list
     *
     * @desc List all of the comments for an activity.
     *
     * @alias plus.comments.list
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/activities/{activityId}/comments',
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

  self.people = {

    /**
     * plus.people.get
     *
     * @desc Get a person's profile. If your app uses scope https://www.googleapis.com/auth/plus.login, this method is guaranteed to return ageRange and language.
     *
     * @alias plus.people.get
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/people/{userId}',
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
     * plus.people.list
     *
     * @desc List all of the people in the specified collection.
     *
     * @alias plus.people.list
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/people/{userId}/people/{collection}',
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
     * plus.people.listByActivity
     *
     * @desc List all of the people in the specified collection for a particular activity.
     *
     * @alias plus.people.listByActivity
     * @memberOf! plus(v1)
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
          url: 'https://www.googleapis.com/plus/v1/activities/{activityId}/people/{collection}',
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
     * plus.people.search
     *
     * @desc Search all public profiles.
     *
     * @alias plus.people.search
     * @memberOf! plus(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.language Specify the preferred language to search with. See search language codes for available values.
     * @param {integer=} params.maxResults The maximum number of people to include in the response, which is used for paging. For any response, the actual number returned might be less than the specified maxResults.
     * @param {string=} params.pageToken The continuation token, which is used to page through large result sets. To get the next page of results, set this parameter to the value of "nextPageToken" from the previous response. This token can be of any length.
     * @param {string} params.query Specify a query string for full text search of public text in all profiles.
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
          url: 'https://www.googleapis.com/plus/v1/people',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['query'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Acl
 * @memberOf! plus(v1)
 * @type object
 * @property {string} description Description of the access granted, suitable for display.
 * @property {plus(v1).PlusAclentryResource[]} items The list of access entries.
 * @property {string} kind Identifies this resource as a collection of access controls. Value: &quot;plus#acl&quot;.
 */
/**
 * @typedef Activity
 * @memberOf! plus(v1)
 * @type object
* @property {plus(v1).Acl} access Identifies who has access to see this activity.
* @property {object} actor The person who performed this activity.
* @property {string} address Street address where this activity occurred.
* @property {string} annotation Additional content added by the person who shared this activity, applicable only when resharing an activity.
* @property {string} crosspostSource If this activity is a crosspost from another system, this property specifies the ID of the original activity.
* @property {string} etag ETag of this response for caching purposes.
* @property {string} geocode Latitude and longitude where this activity occurred. Format is latitude followed by longitude, space separated.
* @property {string} id The ID of this activity.
* @property {string} kind Identifies this resource as an activity. Value: &quot;plus#activity&quot;.
* @property {plus(v1).Place} location The location where this activity occurred.
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
 * @memberOf! plus(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {string} id The ID of this collection of activities. Deprecated.
 * @property {plus(v1).Activity[]} items The activities in this page of results.
 * @property {string} kind Identifies this resource as a collection of activities. Value: &quot;plus#activityFeed&quot;.
 * @property {string} nextLink Link to the next page of activities.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} selfLink Link to this activity resource.
 * @property {string} title The title of this collection of activities, which is a truncated portion of the content.
 * @property {string} updated The time at which this collection of activities was last updated. Formatted as an RFC 3339 timestamp.
 */
/**
 * @typedef Comment
 * @memberOf! plus(v1)
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
 * @memberOf! plus(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {string} id The ID of this collection of comments.
 * @property {plus(v1).Comment[]} items The comments in this page of results.
 * @property {string} kind Identifies this resource as a collection of comments. Value: &quot;plus#commentFeed&quot;.
 * @property {string} nextLink Link to the next page of activities.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} title The title of this collection of comments.
 * @property {string} updated The time at which this collection of comments was last updated. Formatted as an RFC 3339 timestamp.
 */
/**
 * @typedef PeopleFeed
 * @memberOf! plus(v1)
 * @type object
 * @property {string} etag ETag of this response for caching purposes.
 * @property {plus(v1).Person[]} items The people in this page of results. Each item includes the id, displayName, image, and url for the person. To retrieve additional profile data, see the people.get method.
 * @property {string} kind Identifies this resource as a collection of people. Value: &quot;plus#peopleFeed&quot;.
 * @property {string} nextPageToken The continuation token, which is used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 * @property {string} selfLink Link to this resource.
 * @property {string} title The title of this collection of people.
 * @property {integer} totalItems The total number of people available in this list. The number of people in a response might be smaller due to paging. This might not be set for all collections.
 */
/**
 * @typedef Person
 * @memberOf! plus(v1)
 * @type object
* @property {string} aboutMe A short biography for this person.
* @property {object} ageRange The age range of the person. Valid ranges are 17 or younger, 18 to 20, and 21 or older. Age is determined from the user&#39;s birthday using Western age reckoning.
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
* @property {string} language The user&#39;s preferred language for rendering.
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
 * @memberOf! plus(v1)
 * @type object
 * @property {object} address The physical address of the place.
 * @property {string} displayName The display name of the place.
 * @property {string} id The id of the place.
 * @property {string} kind Identifies this resource as a place. Value: &quot;plus#place&quot;.
 * @property {object} position The position of the place.
 */
/**
 * @typedef PlusAclentryResource
 * @memberOf! plus(v1)
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
module.exports = Plus;
