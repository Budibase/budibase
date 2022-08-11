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
 * YouTube Data API
 *
 * Supports core YouTube features, such as uploading videos, creating and managing playlists, searching for content, and much more.
 *
 * @example
 * var google = require('googleapis');
 * var youtube = google.youtube('v3');
 *
 * @namespace youtube
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Youtube
 */
function Youtube(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.activities = {

    /**
     * youtube.activities.insert
     *
     * @desc Posts a bulletin for a specific channel. (The user submitting the request must be authorized to act on the channel's behalf.)  Note: Even though an activity resource can contain information about actions like a user rating a video or marking a video as a favorite, you need to use other API methods to generate those activity resources. For example, you would use the API's videos.rate() method to rate a video and the playlistItems.insert() method to mark a video as a favorite.
     *
     * @alias youtube.activities.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.
     * @param {youtube(v3).Activity} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/activities',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.activities.list
     *
     * @desc Returns a list of channel activity events that match the request criteria. For example, you can retrieve events associated with a particular channel, events associated with the user's subscriptions and Google+ friends, or the YouTube home page feed, which is customized for each user.
     *
     * @alias youtube.activities.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.channelId The channelId parameter specifies a unique YouTube channel ID. The API will then return a list of that channel's activities.
     * @param {boolean=} params.home Set this parameter's value to true to retrieve the activity feed that displays on the YouTube home page for the currently authenticated user.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine Set this parameter's value to true to retrieve a feed of the authenticated user's activities.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more activity resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in an activity resource, the snippet property contains other properties that identify the type of activity, a display title for the activity, and so forth. If you set part=snippet, the API response will also contain all of those nested properties.
     * @param {string=} params.publishedAfter The publishedAfter parameter specifies the earliest date and time that an activity could have occurred for that activity to be included in the API response. If the parameter value specifies a day, but not a time, then any activities that occurred that day will be included in the result set. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
     * @param {string=} params.publishedBefore The publishedBefore parameter specifies the date and time before which an activity must have occurred for that activity to be included in the API response. If the parameter value specifies a day, but not a time, then any activities that occurred that day will be excluded from the result set. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
     * @param {string=} params.regionCode The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. YouTube uses this value when the authorized user's previous activity on YouTube does not provide enough information to generate the activity feed.
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
          url: 'https://www.googleapis.com/youtube/v3/activities',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.captions = {

    /**
     * youtube.captions.delete
     *
     * @desc Deletes a specified caption track.
     *
     * @alias youtube.captions.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter identifies the caption track that is being deleted. The value is a caption track ID as identified by the id property in a caption resource.
     * @param {string=} params.onBehalfOf ID of the Google+ Page for the channel that the request is be on behalf of
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/captions',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.captions.download
     *
     * @desc Downloads a caption track. The caption track is returned in its original format unless the request specifies a value for the tfmt parameter and in its original language unless the request specifies a value for the tlang parameter.
     *
     * @alias youtube.captions.download
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter identifies the caption track that is being retrieved. The value is a caption track ID as identified by the id property in a caption resource.
     * @param {string=} params.onBehalfOf ID of the Google+ Page for the channel that the request is be on behalf of
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.tfmt The tfmt parameter specifies that the caption track should be returned in a specific format. If the parameter is not included in the request, the track is returned in its original format.
     * @param {string=} params.tlang The tlang parameter specifies that the API response should return a translation of the specified caption track. The parameter value is an ISO 639-1 two-letter language code that identifies the desired caption language. The translation is generated by using machine translation, such as Google Translate.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    download: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/captions/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.captions.insert
     *
     * @desc Uploads a caption track.
     *
     * @alias youtube.captions.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOf ID of the Google+ Page for the channel that the request is be on behalf of
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter specifies the caption resource parts that the API response will include. Set the parameter value to snippet.
     * @param {boolean=} params.sync The sync parameter indicates whether YouTube should automatically synchronize the caption file with the audio track of the video. If you set the value to true, YouTube will disregard any time codes that are in the uploaded caption file and generate new time codes for the captions.  You should set the sync parameter to true if you are uploading a transcript, which has no time codes, or if you suspect the time codes in your file are incorrect and want YouTube to try to fix them.
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
          url: 'https://www.googleapis.com/youtube/v3/captions',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/captions',
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.captions.list
     *
     * @desc Returns a list of caption tracks that are associated with a specified video. Note that the API response does not contain the actual captions and that the captions.download method provides the ability to retrieve a caption track.
     *
     * @alias youtube.captions.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.id The id parameter specifies a comma-separated list of IDs that identify the caption resources that should be retrieved. Each ID must identify a caption track associated with the specified video.
     * @param {string=} params.onBehalfOf ID of the Google+ Page for the channel that the request is on behalf of.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more caption resource parts that the API response will include. The part names that you can include in the parameter value are id and snippet.
     * @param {string} params.videoId The videoId parameter specifies the YouTube video ID of the video for which the API should return caption tracks.
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
          url: 'https://www.googleapis.com/youtube/v3/captions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part', 'videoId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.captions.update
     *
     * @desc Updates a caption track. When updating a caption track, you can change the track's draft status, upload a new caption file for the track, or both.
     *
     * @alias youtube.captions.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOf ID of the Google+ Page for the channel that the request is be on behalf of
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include. Set the property value to snippet if you are updating the track's draft status. Otherwise, set the property value to id.
     * @param {boolean=} params.sync Note: The API server only processes the parameter value if the request contains an updated caption file.  The sync parameter indicates whether YouTube should automatically synchronize the caption file with the audio track of the video. If you set the value to true, YouTube will automatically synchronize the caption track with the audio track.
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
          url: 'https://www.googleapis.com/youtube/v3/captions',
          method: 'PUT'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/captions',
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channelBanners = {

    /**
     * youtube.channelBanners.insert
     *
     * @desc Uploads a channel banner image to YouTube. This method represents the first two steps in a three-step process to update the banner image for a channel:  - Call the channelBanners.insert method to upload the binary image data to YouTube. The image must have a 16:9 aspect ratio and be at least 2120x1192 pixels. - Extract the url property's value from the response that the API returns for step 1. - Call the channels.update method to update the channel's branding settings. Set the brandingSettings.image.bannerExternalUrl property's value to the URL obtained in step 2.
     *
     * @alias youtube.channelBanners.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/channelBanners/insert',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/channelBanners/insert',
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channelSections = {

    /**
     * youtube.channelSections.delete
     *
     * @desc Deletes a channelSection.
     *
     * @alias youtube.channelSections.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube channelSection ID for the resource that is being deleted. In a channelSection resource, the id property specifies the YouTube channelSection ID.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/channelSections',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.channelSections.insert
     *
     * @desc Adds a channelSection for the authenticated user's channel.
     *
     * @alias youtube.channelSections.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part names that you can include in the parameter value are snippet and contentDetails.
     * @param {youtube(v3).ChannelSection} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/channelSections',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.channelSections.list
     *
     * @desc Returns channelSection resources that match the API request criteria.
     *
     * @alias youtube.channelSections.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.channelId The channelId parameter specifies a YouTube channel ID. The API will only return that channel's channelSections.
     * @param {string=} params.hl The hl parameter indicates that the snippet.localized property values in the returned channelSection resources should be in the specified language if localized values for that language are available. For example, if the API request specifies hl=de, the snippet.localized properties in the API response will contain German titles if German titles are available. Channel owners can provide localized channel section titles using either the channelSections.insert or channelSections.update method.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube channelSection ID(s) for the resource(s) that are being retrieved. In a channelSection resource, the id property specifies the YouTube channelSection ID.
     * @param {boolean=} params.mine Set this parameter's value to true to retrieve a feed of the authenticated user's channelSections.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more channelSection resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, and contentDetails.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a channelSection resource, the snippet property contains other properties, such as a display title for the channelSection. If you set part=snippet, the API response will also contain all of those nested properties.
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
          url: 'https://www.googleapis.com/youtube/v3/channelSections',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.channelSections.update
     *
     * @desc Update a channelSection.
     *
     * @alias youtube.channelSections.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part names that you can include in the parameter value are snippet and contentDetails.
     * @param {youtube(v3).ChannelSection} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/channelSections',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channels = {

    /**
     * youtube.channels.list
     *
     * @desc Returns a collection of zero or more channel resources that match the request criteria.
     *
     * @alias youtube.channels.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.categoryId The categoryId parameter specifies a YouTube guide category, thereby requesting YouTube channels associated with that category.
     * @param {string=} params.forUsername The forUsername parameter specifies a YouTube username, thereby requesting the channel associated with that username.
     * @param {string=} params.hl The hl parameter should be used for filter out the properties that are not in the given language. Used for the brandingSettings part.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube channel ID(s) for the resource(s) that are being retrieved. In a channel resource, the id property specifies the channel's YouTube channel ID.
     * @param {boolean=} params.managedByMe Note: This parameter is intended exclusively for YouTube content partners.  Set this parameter's value to true to instruct the API to only return channels managed by the content owner that the onBehalfOfContentOwner parameter specifies. The user must be authenticated as a CMS account linked to the specified content owner and onBehalfOfContentOwner must be provided.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine Set this parameter's value to true to instruct the API to only return channels owned by the authenticated user.
     * @param {boolean=} params.mySubscribers Use the subscriptions.list method and its mySubscribers parameter to retrieve a list of subscribers to the authenticated user's channel.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more channel resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a channel resource, the contentDetails property contains other properties, such as the uploads properties. As such, if you set part=contentDetails, the API response will also contain all of those nested properties.
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
          url: 'https://www.googleapis.com/youtube/v3/channels',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.channels.update
     *
     * @desc Updates a channel's metadata. Note that this method currently only supports updates to the channel resource's brandingSettings and invideoPromotion objects and their child properties.
     *
     * @alias youtube.channels.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner The onBehalfOfContentOwner parameter indicates that the authenticated user is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with needs to be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The API currently only allows the parameter value to be set to either brandingSettings or invideoPromotion. (You cannot update both of those parts with a single request.)  Note that this method overrides the existing values for all of the mutable properties that are contained in any parts that the parameter value specifies.
     * @param {youtube(v3).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/channels',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.commentThreads = {

    /**
     * youtube.commentThreads.insert
     *
     * @desc Creates a new top-level comment. To add a reply to an existing comment, use the comments.insert method instead.
     *
     * @alias youtube.commentThreads.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter identifies the properties that the API response will include. Set the parameter value to snippet. The snippet part has a quota cost of 2 units.
     * @param {youtube(v3).CommentThread} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/commentThreads',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.commentThreads.list
     *
     * @desc Returns a list of comment threads that match the API request parameters.
     *
     * @alias youtube.commentThreads.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.allThreadsRelatedToChannelId The allThreadsRelatedToChannelId parameter instructs the API to return all comment threads associated with the specified channel. The response can include comments about the channel or about the channel's videos.
     * @param {string=} params.channelId The channelId parameter instructs the API to return comment threads containing comments about the specified channel. (The response will not include comments left on videos that the channel uploaded.)
     * @param {string=} params.id The id parameter specifies a comma-separated list of comment thread IDs for the resources that should be retrieved.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.moderationStatus Set this parameter to limit the returned comment threads to a particular moderation state.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.order The order parameter specifies the order in which the API response should list comment threads. Valid values are:  - time - Comment threads are ordered by time. This is the default behavior. - relevance - Comment threads are ordered by relevance.Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken property identifies the next page of the result that can be retrieved.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more commentThread resource properties that the API response will include.
     * @param {string=} params.searchTerms The searchTerms parameter instructs the API to limit the API response to only contain comments that contain the specified search terms.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.textFormat Set this parameter's value to html or plainText to instruct the API to return the comments left by users in html formatted or in plain text.
     * @param {string=} params.videoId The videoId parameter instructs the API to return comment threads associated with the specified video ID.
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
          url: 'https://www.googleapis.com/youtube/v3/commentThreads',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.commentThreads.update
     *
     * @desc Modifies the top-level comment in a comment thread.
     *
     * @alias youtube.commentThreads.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter specifies a comma-separated list of commentThread resource properties that the API response will include. You must at least include the snippet part in the parameter value since that part contains all of the properties that the API request can update.
     * @param {youtube(v3).CommentThread} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/commentThreads',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.comments = {

    /**
     * youtube.comments.delete
     *
     * @desc Deletes a comment.
     *
     * @alias youtube.comments.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the comment ID for the resource that is being deleted.
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
          url: 'https://www.googleapis.com/youtube/v3/comments',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.comments.insert
     *
     * @desc Creates a reply to an existing comment. Note: To create a top-level comment, use the commentThreads.insert method.
     *
     * @alias youtube.comments.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter identifies the properties that the API response will include. Set the parameter value to snippet. The snippet part has a quota cost of 2 units.
     * @param {youtube(v3).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/comments',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.comments.list
     *
     * @desc Returns a list of comments that match the API request parameters.
     *
     * @alias youtube.comments.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.id The id parameter specifies a comma-separated list of comment IDs for the resources that are being retrieved. In a comment resource, the id property specifies the comment's ID.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken property identifies the next page of the result that can be retrieved.  Note: This parameter is not supported for use in conjunction with the id parameter.
     * @param {string=} params.parentId The parentId parameter specifies the ID of the comment for which replies should be retrieved.  Note: YouTube currently supports replies only for top-level comments. However, replies to replies may be supported in the future.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more comment resource properties that the API response will include.
     * @param {string=} params.textFormat This parameter indicates whether the API should return comments formatted as HTML or as plain text.
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
          url: 'https://www.googleapis.com/youtube/v3/comments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.comments.markAsSpam
     *
     * @desc Expresses the caller's opinion that one or more comments should be flagged as spam.
     *
     * @alias youtube.comments.markAsSpam
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies a comma-separated list of IDs of comments that the caller believes should be classified as spam.
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
          url: 'https://www.googleapis.com/youtube/v3/comments/markAsSpam',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.comments.setModerationStatus
     *
     * @desc Sets the moderation status of one or more comments. The API request must be authorized by the owner of the channel or video associated with the comments.
     *
     * @alias youtube.comments.setModerationStatus
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.banAuthor The banAuthor parameter lets you indicate that you want to automatically reject any additional comments written by the comment's author. Set the parameter value to true to ban the author.  Note: This parameter is only valid if the moderationStatus parameter is also set to rejected.
     * @param {string} params.id The id parameter specifies a comma-separated list of IDs that identify the comments for which you are updating the moderation status.
     * @param {string} params.moderationStatus Identifies the new moderation status of the specified comments.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setModerationStatus: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/comments/setModerationStatus',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id', 'moderationStatus'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.comments.update
     *
     * @desc Modifies a comment.
     *
     * @alias youtube.comments.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter identifies the properties that the API response will include. You must at least include the snippet part in the parameter value since that part contains all of the properties that the API request can update.
     * @param {youtube(v3).Comment} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/comments',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.fanFundingEvents = {

    /**
     * youtube.fanFundingEvents.list
     *
     * @desc Lists fan funding events for a channel.
     *
     * @alias youtube.fanFundingEvents.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports. The parameter value must be a language code included in the list returned by the i18nLanguages.list method.  If localized resource details are available in that language, the resource's snippet.localized object will contain the localized values. However, if localized details are not available, the snippet.localized object will contain resource details in the resource's default language.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies the fanFundingEvent resource parts that the API response will include. Supported values are id and snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/fanFundingEvents',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.guideCategories = {

    /**
     * youtube.guideCategories.list
     *
     * @desc Returns a list of categories that can be associated with YouTube channels.
     *
     * @alias youtube.guideCategories.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter specifies the language that will be used for text values in the API response.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube channel category ID(s) for the resource(s) that are being retrieved. In a guideCategory resource, the id property specifies the YouTube channel category ID.
     * @param {string} params.part The part parameter specifies the guideCategory resource properties that the API response will include. Set the parameter value to snippet.
     * @param {string=} params.regionCode The regionCode parameter instructs the API to return the list of guide categories available in the specified country. The parameter value is an ISO 3166-1 alpha-2 country code.
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
          url: 'https://www.googleapis.com/youtube/v3/guideCategories',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.i18nLanguages = {

    /**
     * youtube.i18nLanguages.list
     *
     * @desc Returns a list of application languages that the YouTube website supports.
     *
     * @alias youtube.i18nLanguages.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter specifies the language that should be used for text values in the API response.
     * @param {string} params.part The part parameter specifies the i18nLanguage resource properties that the API response will include. Set the parameter value to snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/i18nLanguages',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.i18nRegions = {

    /**
     * youtube.i18nRegions.list
     *
     * @desc Returns a list of content regions that the YouTube website supports.
     *
     * @alias youtube.i18nRegions.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter specifies the language that should be used for text values in the API response.
     * @param {string} params.part The part parameter specifies the i18nRegion resource properties that the API response will include. Set the parameter value to snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/i18nRegions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.liveBroadcasts = {

    /**
     * youtube.liveBroadcasts.bind
     *
     * @desc Binds a YouTube broadcast to a stream or removes an existing binding between a broadcast and a stream. A broadcast can only be bound to one video stream, though a video stream may be bound to more than one broadcast.
     *
     * @alias youtube.liveBroadcasts.bind
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the unique ID of the broadcast that is being bound to a video stream.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more liveBroadcast resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, contentDetails, and status.
     * @param {string=} params.streamId The streamId parameter specifies the unique ID of the video stream that is being bound to a broadcast. If this parameter is omitted, the API will remove any existing binding between the broadcast and a video stream.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    bind: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts/bind',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id', 'part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.control
     *
     * @desc Controls the settings for a slate that can be displayed in the broadcast stream.
     *
     * @alias youtube.liveBroadcasts.control
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.displaySlate The displaySlate parameter specifies whether the slate is being enabled or disabled.
     * @param {string} params.id The id parameter specifies the YouTube live broadcast ID that uniquely identifies the broadcast in which the slate is being updated.
     * @param {string=} params.offsetTimeMs The offsetTimeMs parameter specifies a positive time offset when the specified slate change will occur. The value is measured in milliseconds from the beginning of the broadcast's monitor stream, which is the time that the testing phase for the broadcast began. Even though it is specified in milliseconds, the value is actually an approximation, and YouTube completes the requested action as closely as possible to that time.  If you do not specify a value for this parameter, then YouTube performs the action as soon as possible. See the Getting started guide for more details.  Important: You should only specify a value for this parameter if your broadcast stream is delayed.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more liveBroadcast resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, contentDetails, and status.
     * @param {string=} params.walltime The walltime parameter specifies the wall clock time at which the specified slate change will occur. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sssZ) format.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    control: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts/control',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id', 'part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.delete
     *
     * @desc Deletes a broadcast.
     *
     * @alias youtube.liveBroadcasts.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube live broadcast ID for the resource that is being deleted.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
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
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.insert
     *
     * @desc Creates a broadcast.
     *
     * @alias youtube.liveBroadcasts.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part properties that you can include in the parameter value are id, snippet, contentDetails, and status.
     * @param {youtube(v3).LiveBroadcast} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.list
     *
     * @desc Returns a list of YouTube broadcasts that match the API request parameters.
     *
     * @alias youtube.liveBroadcasts.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.broadcastStatus The broadcastStatus parameter filters the API response to only include broadcasts with the specified status.
     * @param {string=} params.broadcastType The broadcastType parameter filters the API response to only include broadcasts with the specified type. This is only compatible with the mine filter for now.
     * @param {string=} params.id The id parameter specifies a comma-separated list of YouTube broadcast IDs that identify the broadcasts being retrieved. In a liveBroadcast resource, the id property specifies the broadcast's ID.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine The mine parameter can be used to instruct the API to only return broadcasts owned by the authenticated user. Set the parameter value to true to only retrieve your own broadcasts.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more liveBroadcast resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, contentDetails, and status.
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
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.transition
     *
     * @desc Changes the status of a YouTube live broadcast and initiates any processes associated with the new status. For example, when you transition a broadcast's status to testing, YouTube starts to transmit video to that broadcast's monitor stream. Before calling this method, you should confirm that the value of the status.streamStatus property for the stream bound to your broadcast is active.
     *
     * @alias youtube.liveBroadcasts.transition
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.broadcastStatus The broadcastStatus parameter identifies the state to which the broadcast is changing. Note that to transition a broadcast to either the testing or live state, the status.streamStatus must be active for the stream that the broadcast is bound to.
     * @param {string} params.id The id parameter specifies the unique ID of the broadcast that is transitioning to another status.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more liveBroadcast resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, contentDetails, and status.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    transition: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts/transition',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['broadcastStatus', 'id', 'part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveBroadcasts.update
     *
     * @desc Updates a broadcast. For example, you could modify the broadcast settings defined in the liveBroadcast resource's contentDetails object.
     *
     * @alias youtube.liveBroadcasts.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part properties that you can include in the parameter value are id, snippet, contentDetails, and status.  Note that this method will override the existing values for all of the mutable properties that are contained in any parts that the parameter value specifies. For example, a broadcast's privacy status is defined in the status part. As such, if your request is updating a private or unlisted broadcast, and the request's part parameter value includes the status part, the broadcast's privacy setting will be updated to whatever value the request body specifies. If the request body does not specify a value, the existing privacy setting will be removed and the broadcast will revert to the default privacy setting.
     * @param {youtube(v3).LiveBroadcast} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveBroadcasts',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.liveChatBans = {

    /**
     * youtube.liveChatBans.delete
     *
     * @desc Removes a chat ban.
     *
     * @alias youtube.liveChatBans.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter identifies the chat ban to remove. The value uniquely identifies both the ban and the chat.
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/bans',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveChatBans.insert
     *
     * @desc Adds a new ban to the chat.
     *
     * @alias youtube.liveChatBans.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response returns. Set the parameter value to snippet.
     * @param {youtube(v3).LiveChatBan} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/bans',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.liveChatMessages = {

    /**
     * youtube.liveChatMessages.delete
     *
     * @desc Deletes a chat message.
     *
     * @alias youtube.liveChatMessages.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube chat message ID of the resource that is being deleted.
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveChatMessages.insert
     *
     * @desc Adds a message to a live chat.
     *
     * @alias youtube.liveChatMessages.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter serves two purposes. It identifies the properties that the write operation will set as well as the properties that the API response will include. Set the parameter value to snippet.
     * @param {youtube(v3).LiveChatMessage} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveChatMessages.list
     *
     * @desc Lists live chat messages for a specific chat.
     *
     * @alias youtube.liveChatMessages.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports. The parameter value must be a language code included in the list returned by the i18nLanguages.list method.  If localized resource details are available in that language, the resource's snippet.localized object will contain the localized values. However, if localized details are not available, the snippet.localized object will contain resource details in the resource's default language.
     * @param {string} params.liveChatId The liveChatId parameter specifies the ID of the chat whose messages will be returned.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of messages that should be returned in the result set.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken property identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies the liveChatComment resource parts that the API response will include. Supported values are id and snippet.
     * @param {integer=} params.profileImageSize The profileImageSize parameter specifies the size of the user profile pictures that should be returned in the result set. Default: 88.
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/messages',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['liveChatId', 'part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.liveChatModerators = {

    /**
     * youtube.liveChatModerators.delete
     *
     * @desc Removes a chat moderator.
     *
     * @alias youtube.liveChatModerators.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter identifies the chat moderator to remove. The value uniquely identifies both the moderator and the chat.
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/moderators',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveChatModerators.insert
     *
     * @desc Adds a new moderator for the chat.
     *
     * @alias youtube.liveChatModerators.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response returns. Set the parameter value to snippet.
     * @param {youtube(v3).LiveChatModerator} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/moderators',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveChatModerators.list
     *
     * @desc Lists moderators for a live chat.
     *
     * @alias youtube.liveChatModerators.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.liveChatId The liveChatId parameter specifies the YouTube live chat for which the API should return moderators.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies the liveChatModerator resource parts that the API response will include. Supported values are id and snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/liveChat/moderators',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['liveChatId', 'part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.liveStreams = {

    /**
     * youtube.liveStreams.delete
     *
     * @desc Deletes a video stream.
     *
     * @alias youtube.liveStreams.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube live stream ID for the resource that is being deleted.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
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
          url: 'https://www.googleapis.com/youtube/v3/liveStreams',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveStreams.insert
     *
     * @desc Creates a video stream. The stream enables you to send your video to YouTube, which can then broadcast the video to your audience.
     *
     * @alias youtube.liveStreams.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part properties that you can include in the parameter value are id, snippet, cdn, and status.
     * @param {youtube(v3).LiveStream} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveStreams',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveStreams.list
     *
     * @desc Returns a list of video streams that match the API request parameters.
     *
     * @alias youtube.liveStreams.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.id The id parameter specifies a comma-separated list of YouTube stream IDs that identify the streams being retrieved. In a liveStream resource, the id property specifies the stream's ID.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine The mine parameter can be used to instruct the API to only return streams owned by the authenticated user. Set the parameter value to true to only retrieve your own streams.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more liveStream resource properties that the API response will include. The part names that you can include in the parameter value are id, snippet, cdn, and status.
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
          url: 'https://www.googleapis.com/youtube/v3/liveStreams',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.liveStreams.update
     *
     * @desc Updates a video stream. If the properties that you want to change cannot be updated, then you need to create a new stream with the proper settings.
     *
     * @alias youtube.liveStreams.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  The part properties that you can include in the parameter value are id, snippet, cdn, and status.  Note that this method will override the existing values for all of the mutable properties that are contained in any parts that the parameter value specifies. If the request body does not specify a value for a mutable property, the existing value for that property will be removed.
     * @param {youtube(v3).LiveStream} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/liveStreams',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.playlistItems = {

    /**
     * youtube.playlistItems.delete
     *
     * @desc Deletes a playlist item.
     *
     * @alias youtube.playlistItems.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube playlist item ID for the playlist item that is being deleted. In a playlistItem resource, the id property specifies the playlist item's ID.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlistItems.insert
     *
     * @desc Adds a resource to a playlist.
     *
     * @alias youtube.playlistItems.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.
     * @param {youtube(v3).PlaylistItem} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlistItems.list
     *
     * @desc Returns a collection of playlist items that match the API request parameters. You can retrieve all of the playlist items in a specified playlist or retrieve one or more playlist items by their unique IDs.
     *
     * @alias youtube.playlistItems.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.id The id parameter specifies a comma-separated list of one or more unique playlist item IDs.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more playlistItem resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a playlistItem resource, the snippet property contains numerous fields, including the title, description, position, and resourceId properties. As such, if you set part=snippet, the API response will contain all of those properties.
     * @param {string=} params.playlistId The playlistId parameter specifies the unique ID of the playlist for which you want to retrieve playlist items. Note that even though this is an optional parameter, every request to retrieve playlist items must specify a value for either the id parameter or the playlistId parameter.
     * @param {string=} params.videoId The videoId parameter specifies that the request should return only the playlist items that contain the specified video.
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
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlistItems.update
     *
     * @desc Modifies a playlist item. For example, you could update the item's position in the playlist.
     *
     * @alias youtube.playlistItems.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  Note that this method will override the existing values for all of the mutable properties that are contained in any parts that the parameter value specifies. For example, a playlist item can specify a start time and end time, which identify the times portion of the video that should play when users watch the video in the playlist. If your request is updating a playlist item that sets these values, and the request's part parameter value includes the contentDetails part, the playlist item's start and end times will be updated to whatever value the request body specifies. If the request body does not specify values, the existing start and end times will be removed and replaced with the default settings.
     * @param {youtube(v3).PlaylistItem} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/playlistItems',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.playlists = {

    /**
     * youtube.playlists.delete
     *
     * @desc Deletes a playlist.
     *
     * @alias youtube.playlists.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube playlist ID for the playlist that is being deleted. In a playlist resource, the id property specifies the playlist's ID.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/playlists',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlists.insert
     *
     * @desc Creates a playlist.
     *
     * @alias youtube.playlists.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.
     * @param {youtube(v3).Playlist} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/playlists',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlists.list
     *
     * @desc Returns a collection of playlists that match the API request parameters. For example, you can retrieve all playlists that the authenticated user owns, or you can retrieve one or more playlists by their unique IDs.
     *
     * @alias youtube.playlists.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.channelId This value indicates that the API should only return the specified channel's playlists.
     * @param {string=} params.hl The hl parameter should be used for filter out the properties that are not in the given language. Used for the snippet part.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube playlist ID(s) for the resource(s) that are being retrieved. In a playlist resource, the id property specifies the playlist's YouTube playlist ID.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine Set this parameter's value to true to instruct the API to only return playlists owned by the authenticated user.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more playlist resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a playlist resource, the snippet property contains properties like author, title, description, tags, and timeCreated. As such, if you set part=snippet, the API response will contain all of those properties.
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
          url: 'https://www.googleapis.com/youtube/v3/playlists',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.playlists.update
     *
     * @desc Modifies a playlist. For example, you could change a playlist's title, description, or privacy status.
     *
     * @alias youtube.playlists.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  Note that this method will override the existing values for mutable properties that are contained in any parts that the request body specifies. For example, a playlist's description is contained in the snippet part, which must be included in the request body. If the request does not specify a value for the snippet.description property, the playlist's existing description will be deleted.
     * @param {youtube(v3).Playlist} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/playlists',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.search = {

    /**
     * youtube.search.list
     *
     * @desc Returns a collection of search results that match the query parameters specified in the API request. By default, a search result set identifies matching video, channel, and playlist resources, but you can also configure queries to only retrieve a specific type of resource.
     *
     * @alias youtube.search.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.channelId The channelId parameter indicates that the API response should only contain resources created by the channel
     * @param {string=} params.channelType The channelType parameter lets you restrict a search to a particular type of channel.
     * @param {string=} params.eventType The eventType parameter restricts a search to broadcast events. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {boolean=} params.forContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The forContentOwner parameter restricts the search to only retrieve resources owned by the content owner specified by the onBehalfOfContentOwner parameter. The user must be authenticated using a CMS account linked to the specified content owner and onBehalfOfContentOwner must be provided.
     * @param {boolean=} params.forDeveloper The forDeveloper parameter restricts the search to only retrieve videos uploaded via the developer's application or website. The API server uses the request's authorization credentials to identify the developer. Therefore, a developer can restrict results to videos uploaded through the developer's own app or website but not to videos uploaded through other apps or sites.
     * @param {boolean=} params.forMine The forMine parameter restricts the search to only retrieve videos owned by the authenticated user. If you set this parameter to true, then the type parameter's value must also be set to video.
     * @param {string=} params.location The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. (37.42307,-122.08427).   - The location parameter value identifies the point at the center of the area. - The locationRadius parameter specifies the maximum distance that the location associated with a video can be from that point for the video to still be included in the search results.The API returns an error if your request specifies a value for the location parameter but does not also specify a value for the locationRadius parameter.
     * @param {string=} params.locationRadius The locationRadius parameter, in conjunction with the location parameter, defines a circular geographic area.  The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include 1500m, 5km, 10000ft, and 0.75mi. The API does not support locationRadius parameter values larger than 1000 kilometers.  Note: See the definition of the location parameter for more information.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.order The order parameter specifies the method that will be used to order resources in the API response.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more search resource properties that the API response will include. Set the parameter value to snippet.
     * @param {string=} params.publishedAfter The publishedAfter parameter indicates that the API response should only contain resources created after the specified time. The value is an RFC 3339 formatted date-time value (1970-01-01T00:00:00Z).
     * @param {string=} params.publishedBefore The publishedBefore parameter indicates that the API response should only contain resources created before the specified time. The value is an RFC 3339 formatted date-time value (1970-01-01T00:00:00Z).
     * @param {string=} params.q The q parameter specifies the query term to search for.  Your request can also use the Boolean NOT (-) and OR (|) operators to exclude videos or to find videos that are associated with one of several search terms. For example, to search for videos matching either "boating" or "sailing", set the q parameter value to boating|sailing. Similarly, to search for videos matching either "boating" or "sailing" but not "fishing", set the q parameter value to boating|sailing -fishing. Note that the pipe character must be URL-escaped when it is sent in your API request. The URL-escaped value for the pipe character is %7C.
     * @param {string=} params.regionCode The regionCode parameter instructs the API to return search results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code.
     * @param {string=} params.relatedToVideoId The relatedToVideoId parameter retrieves a list of videos that are related to the video that the parameter value identifies. The parameter value must be set to a YouTube video ID and, if you are using this parameter, the type parameter must be set to video.
     * @param {string=} params.relevanceLanguage The relevanceLanguage parameter instructs the API to return search results that are most relevant to the specified language. The parameter value is typically an ISO 639-1 two-letter language code. However, you should use the values zh-Hans for simplified Chinese and zh-Hant for traditional Chinese. Please note that results in other languages will still be returned if they are highly relevant to the search query term.
     * @param {string=} params.safeSearch The safeSearch parameter indicates whether the search results should include restricted content as well as standard content.
     * @param {string=} params.topicId The topicId parameter indicates that the API response should only contain resources associated with the specified topic. The value identifies a Freebase topic ID.
     * @param {string=} params.type The type parameter restricts a search query to only retrieve a particular type of resource. The value is a comma-separated list of resource types.
     * @param {string=} params.videoCaption The videoCaption parameter indicates whether the API should filter video search results based on whether they have captions. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoCategoryId The videoCategoryId parameter filters video search results based on their category. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoDefinition The videoDefinition parameter lets you restrict a search to only include either high definition (HD) or standard definition (SD) videos. HD videos are available for playback in at least 720p, though higher resolutions, like 1080p, might also be available. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoDimension The videoDimension parameter lets you restrict a search to only retrieve 2D or 3D videos. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoDuration The videoDuration parameter filters video search results based on their duration. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoEmbeddable The videoEmbeddable parameter lets you to restrict a search to only videos that can be embedded into a webpage. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoLicense The videoLicense parameter filters search results to only include videos with a particular license. YouTube lets video uploaders choose to attach either the Creative Commons license or the standard YouTube license to each of their videos. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoSyndicated The videoSyndicated parameter lets you to restrict a search to only videos that can be played outside youtube.com. If you specify a value for this parameter, you must also set the type parameter's value to video.
     * @param {string=} params.videoType The videoType parameter lets you restrict a search to a particular type of videos. If you specify a value for this parameter, you must also set the type parameter's value to video.
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
          url: 'https://www.googleapis.com/youtube/v3/search',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sponsors = {

    /**
     * youtube.sponsors.list
     *
     * @desc Lists sponsors for a channel.
     *
     * @alias youtube.sponsors.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter The filter parameter specifies which channel sponsors to return.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies the sponsor resource parts that the API response will include. Supported values are id and snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/sponsors',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.subscriptions = {

    /**
     * youtube.subscriptions.delete
     *
     * @desc Deletes a subscription.
     *
     * @alias youtube.subscriptions.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube subscription ID for the resource that is being deleted. In a subscription resource, the id property specifies the YouTube subscription ID.
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
          url: 'https://www.googleapis.com/youtube/v3/subscriptions',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.subscriptions.insert
     *
     * @desc Adds a subscription for the authenticated user's channel.
     *
     * @alias youtube.subscriptions.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.
     * @param {youtube(v3).Subscription} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/subscriptions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.subscriptions.list
     *
     * @desc Returns subscription resources that match the API request criteria.
     *
     * @alias youtube.subscriptions.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.channelId The channelId parameter specifies a YouTube channel ID. The API will only return that channel's subscriptions.
     * @param {string=} params.forChannelId The forChannelId parameter specifies a comma-separated list of channel IDs. The API response will then only contain subscriptions matching those channels.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube subscription ID(s) for the resource(s) that are being retrieved. In a subscription resource, the id property specifies the YouTube subscription ID.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.
     * @param {boolean=} params.mine Set this parameter's value to true to retrieve a feed of the authenticated user's subscriptions.
     * @param {boolean=} params.myRecentSubscribers Set this parameter's value to true to retrieve a feed of the subscribers of the authenticated user in reverse chronological order (newest first).
     * @param {boolean=} params.mySubscribers Set this parameter's value to true to retrieve a feed of the subscribers of the authenticated user in no particular order.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string=} params.order The order parameter specifies the method that will be used to sort resources in the API response.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more subscription resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a subscription resource, the snippet property contains other properties, such as a display title for the subscription. If you set part=snippet, the API response will also contain all of those nested properties.
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
          url: 'https://www.googleapis.com/youtube/v3/subscriptions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.thumbnails = {

    /**
     * youtube.thumbnails.set
     *
     * @desc Uploads a custom video thumbnail to YouTube and sets it for a video.
     *
     * @alias youtube.thumbnails.set
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.videoId The videoId parameter specifies a YouTube video ID for which the custom video thumbnail is being provided.
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    set: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/thumbnails/set',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/thumbnails/set',
        requiredParams: ['videoId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.videoAbuseReportReasons = {

    /**
     * youtube.videoAbuseReportReasons.list
     *
     * @desc Returns a list of abuse reasons that can be used for reporting abusive videos.
     *
     * @alias youtube.videoAbuseReportReasons.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter specifies the language that should be used for text values in the API response.
     * @param {string} params.part The part parameter specifies the videoCategory resource parts that the API response will include. Supported values are id and snippet.
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
          url: 'https://www.googleapis.com/youtube/v3/videoAbuseReportReasons',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.videoCategories = {

    /**
     * youtube.videoCategories.list
     *
     * @desc Returns a list of categories that can be associated with YouTube videos.
     *
     * @alias youtube.videoCategories.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.hl The hl parameter specifies the language that should be used for text values in the API response.
     * @param {string=} params.id The id parameter specifies a comma-separated list of video category IDs for the resources that you are retrieving.
     * @param {string} params.part The part parameter specifies the videoCategory resource properties that the API response will include. Set the parameter value to snippet.
     * @param {string=} params.regionCode The regionCode parameter instructs the API to return the list of video categories available in the specified country. The parameter value is an ISO 3166-1 alpha-2 country code.
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
          url: 'https://www.googleapis.com/youtube/v3/videoCategories',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.videos = {

    /**
     * youtube.videos.delete
     *
     * @desc Deletes a YouTube video.
     *
     * @alias youtube.videos.delete
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube video ID for the resource that is being deleted. In a video resource, the id property specifies the video's ID.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
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
          url: 'https://www.googleapis.com/youtube/v3/videos',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.videos.getRating
     *
     * @desc Retrieves the ratings that the authorized user gave to a list of specified videos.
     *
     * @alias youtube.videos.getRating
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies a comma-separated list of the YouTube video ID(s) for the resource(s) for which you are retrieving rating data. In a video resource, the id property specifies the video's ID.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getRating: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/videos/getRating',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.videos.insert
     *
     * @desc Uploads a video to YouTube and optionally sets the video's metadata.
     *
     * @alias youtube.videos.insert
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.autoLevels The autoLevels parameter indicates whether YouTube should automatically enhance the video's lighting and color.
     * @param {boolean=} params.notifySubscribers The notifySubscribers parameter indicates whether YouTube should send a notification about the new video to users who subscribe to the video's channel. A parameter value of True indicates that subscribers will be notified of newly uploaded videos. However, a channel owner who is uploading many videos might prefer to set the value to False to avoid sending a notification about each new video to the channel's subscribers.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.onBehalfOfContentOwnerChannel This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwnerChannel parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the onBehalfOfContentOwner parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the onBehalfOfContentOwner parameter specifies. Finally, the channel that the onBehalfOfContentOwnerChannel parameter value specifies must be linked to the content owner that the onBehalfOfContentOwner parameter specifies.  This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and perform actions on behalf of the channel specified in the parameter value, without having to provide authentication credentials for each separate channel.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  Note that not all parts contain properties that can be set when inserting or updating a video. For example, the statistics object encapsulates statistics that YouTube calculates for a video and does not contain values that you can set or modify. If the parameter value specifies a part that does not contain mutable values, that part will still be included in the API response.
     * @param {boolean=} params.stabilize The stabilize parameter indicates whether YouTube should adjust the video to remove shaky camera motions.
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
          url: 'https://www.googleapis.com/youtube/v3/videos',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.videos.list
     *
     * @desc Returns a list of videos that match the API request parameters.
     *
     * @alias youtube.videos.list
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.chart The chart parameter identifies the chart that you want to retrieve.
     * @param {string=} params.hl The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports. The parameter value must be a language code included in the list returned by the i18nLanguages.list method.  If localized resource details are available in that language, the resource's snippet.localized object will contain the localized values. However, if localized details are not available, the snippet.localized object will contain resource details in the resource's default language.
     * @param {string=} params.id The id parameter specifies a comma-separated list of the YouTube video ID(s) for the resource(s) that are being retrieved. In a video resource, the id property specifies the video's ID.
     * @param {string=} params.locale DEPRECATED
     * @param {integer=} params.maxHeight The maxHeight parameter specifies a maximum height of the embedded player. If maxWidth is provided, maxHeight may not be reached in order to not violate the width request.
     * @param {integer=} params.maxResults The maxResults parameter specifies the maximum number of items that should be returned in the result set.  Note: This parameter is supported for use in conjunction with the myRating and chart parameters, but it is not supported for use in conjunction with the id parameter.
     * @param {integer=} params.maxWidth The maxWidth parameter specifies a maximum width of the embedded player. If maxHeight is provided, maxWidth may not be reached in order to not violate the height request.
     * @param {string=} params.myRating Set this parameter's value to like or dislike to instruct the API to only return videos liked or disliked by the authenticated user.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string=} params.pageToken The pageToken parameter identifies a specific page in the result set that should be returned. In an API response, the nextPageToken and prevPageToken properties identify other pages that could be retrieved.  Note: This parameter is supported for use in conjunction with the myRating and chart parameters, but it is not supported for use in conjunction with the id parameter.
     * @param {string} params.part The part parameter specifies a comma-separated list of one or more video resource properties that the API response will include.  If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a video resource, the snippet property contains the channelId, title, description, tags, and categoryId properties. As such, if you set part=snippet, the API response will contain all of those properties.
     * @param {string=} params.regionCode The regionCode parameter instructs the API to select a video chart available in the specified region. This parameter can only be used in conjunction with the chart parameter. The parameter value is an ISO 3166-1 alpha-2 country code.
     * @param {string=} params.videoCategoryId The videoCategoryId parameter identifies the video category for which the chart should be retrieved. This parameter can only be used in conjunction with the chart parameter. By default, charts are not restricted to a particular category.
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
          url: 'https://www.googleapis.com/youtube/v3/videos',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.videos.rate
     *
     * @desc Add a like or dislike rating to a video or remove a rating from a video.
     *
     * @alias youtube.videos.rate
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The id parameter specifies the YouTube video ID of the video that is being rated or having its rating removed.
     * @param {string} params.rating Specifies the rating to record.
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
          url: 'https://www.googleapis.com/youtube/v3/videos/rate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id', 'rating'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.videos.reportAbuse
     *
     * @desc Report abuse for a video.
     *
     * @alias youtube.videos.reportAbuse
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {youtube(v3).VideoAbuseReport} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reportAbuse: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/videos/reportAbuse',
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
     * youtube.videos.update
     *
     * @desc Updates a video's metadata.
     *
     * @alias youtube.videos.update
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The actual CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {string} params.part The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.  Note that this method will override the existing values for all of the mutable properties that are contained in any parts that the parameter value specifies. For example, a video's privacy setting is contained in the status part. As such, if your request is updating a private video, and the request's part parameter value includes the status part, the video's privacy setting will be updated to whatever value the request body specifies. If the request body does not specify a value, the existing privacy setting will be removed and the video will revert to the default privacy setting.  In addition, not all parts contain properties that can be set when inserting or updating a video. For example, the statistics object encapsulates statistics that YouTube calculates for a video and does not contain values that you can set or modify. If the parameter value specifies a part that does not contain mutable values, that part will still be included in the API response.
     * @param {youtube(v3).Video} params.resource Request body data
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
          url: 'https://www.googleapis.com/youtube/v3/videos',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['part'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.watermarks = {

    /**
     * youtube.watermarks.set
     *
     * @desc Uploads a watermark image to YouTube and sets it for a channel.
     *
     * @alias youtube.watermarks.set
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.channelId The channelId parameter specifies the YouTube channel ID for which the watermark is being provided.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param  {object} params.resource Media resource metadata
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    set: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/watermarks/set',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/youtube/v3/watermarks/set',
        requiredParams: ['channelId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * youtube.watermarks.unset
     *
     * @desc Deletes a channel's watermark image.
     *
     * @alias youtube.watermarks.unset
     * @memberOf! youtube(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.channelId The channelId parameter specifies the YouTube channel ID for which the watermark is being unset.
     * @param {string=} params.onBehalfOfContentOwner Note: This parameter is intended exclusively for YouTube content partners.  The onBehalfOfContentOwner parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    unset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/youtube/v3/watermarks/unset',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['channelId'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AccessPolicy
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} allowed The value of allowed indicates whether the access to the policy is allowed or denied by default.
 * @property {string[]} exception A list of region codes that identify countries where the default policy do not apply.
 */
/**
 * @typedef Activity
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ActivityContentDetails} contentDetails The contentDetails object contains information about the content associated with the activity. For example, if the snippet.type value is videoRated, then the contentDetails object&#39;s content identifies the rated video.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the activity.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#activity&quot;.
 * @property {youtube(v3).ActivitySnippet} snippet The snippet object contains basic details about the activity, including the activity&#39;s type and group ID.
 */
/**
 * @typedef ActivityContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ActivityContentDetailsBulletin} bulletin The bulletin object contains details about a channel bulletin post. This object is only present if the snippet.type is bulletin.
 * @property {youtube(v3).ActivityContentDetailsChannelItem} channelItem The channelItem object contains details about a resource which was added to a channel. This property is only present if the snippet.type is channelItem.
 * @property {youtube(v3).ActivityContentDetailsComment} comment The comment object contains information about a resource that received a comment. This property is only present if the snippet.type is comment.
 * @property {youtube(v3).ActivityContentDetailsFavorite} favorite The favorite object contains information about a video that was marked as a favorite video. This property is only present if the snippet.type is favorite.
 * @property {youtube(v3).ActivityContentDetailsLike} like The like object contains information about a resource that received a positive (like) rating. This property is only present if the snippet.type is like.
 * @property {youtube(v3).ActivityContentDetailsPlaylistItem} playlistItem The playlistItem object contains information about a new playlist item. This property is only present if the snippet.type is playlistItem.
 * @property {youtube(v3).ActivityContentDetailsPromotedItem} promotedItem The promotedItem object contains details about a resource which is being promoted. This property is only present if the snippet.type is promotedItem.
 * @property {youtube(v3).ActivityContentDetailsRecommendation} recommendation The recommendation object contains information about a recommended resource. This property is only present if the snippet.type is recommendation.
 * @property {youtube(v3).ActivityContentDetailsSocial} social The social object contains details about a social network post. This property is only present if the snippet.type is social.
 * @property {youtube(v3).ActivityContentDetailsSubscription} subscription The subscription object contains information about a channel that a user subscribed to. This property is only present if the snippet.type is subscription.
 * @property {youtube(v3).ActivityContentDetailsUpload} upload The upload object contains information about the uploaded video. This property is only present if the snippet.type is upload.
 */
/**
 * @typedef ActivityContentDetailsBulletin
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the resource associated with a bulletin post.
 */
/**
 * @typedef ActivityContentDetailsChannelItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the resource that was added to the channel.
 */
/**
 * @typedef ActivityContentDetailsComment
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the resource associated with the comment.
 */
/**
 * @typedef ActivityContentDetailsFavorite
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the resource that was marked as a favorite.
 */
/**
 * @typedef ActivityContentDetailsLike
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the rated resource.
 */
/**
 * @typedef ActivityContentDetailsPlaylistItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} playlistId The value that YouTube uses to uniquely identify the playlist.
 * @property {string} playlistItemId ID of the item within the playlist.
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information about the resource that was added to the playlist.
 */
/**
 * @typedef ActivityContentDetailsPromotedItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} adTag The URL the client should fetch to request a promoted item.
 * @property {string} clickTrackingUrl The URL the client should ping to indicate that the user clicked through on this promoted item.
 * @property {string} creativeViewUrl The URL the client should ping to indicate that the user was shown this promoted item.
 * @property {string} ctaType The type of call-to-action, a message to the user indicating action that can be taken.
 * @property {string} customCtaButtonText The custom call-to-action button text. If specified, it will override the default button text for the cta_type.
 * @property {string} descriptionText The text description to accompany the promoted item.
 * @property {string} destinationUrl The URL the client should direct the user to, if the user chooses to visit the advertiser&#39;s website.
 * @property {string[]} forecastingUrl The list of forecasting URLs. The client should ping all of these URLs when a promoted item is not available, to indicate that a promoted item could have been shown.
 * @property {string[]} impressionUrl The list of impression URLs. The client should ping all of these URLs to indicate that the user was shown this promoted item.
 * @property {string} videoId The ID that YouTube uses to uniquely identify the promoted video.
 */
/**
 * @typedef ActivityContentDetailsRecommendation
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} reason The reason that the resource is recommended to the user.
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the recommended resource.
 * @property {youtube(v3).ResourceId} seedResourceId The seedResourceId object contains information about the resource that caused the recommendation.
 */
/**
 * @typedef ActivityContentDetailsSocial
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} author The author of the social network post.
 * @property {string} imageUrl An image of the post&#39;s author.
 * @property {string} referenceUrl The URL of the social network post.
 * @property {youtube(v3).ResourceId} resourceId The resourceId object encapsulates information that identifies the resource associated with a social network post.
 * @property {string} type The name of the social network.
 */
/**
 * @typedef ActivityContentDetailsSubscription
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ResourceId} resourceId The resourceId object contains information that identifies the resource that the user subscribed to.
 */
/**
 * @typedef ActivityContentDetailsUpload
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} videoId The ID that YouTube uses to uniquely identify the uploaded video.
 */
/**
 * @typedef ActivityListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Activity[]} items A list of activities, or events, that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#activityListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef ActivitySnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel associated with the activity.
 * @property {string} channelTitle Channel title for the channel responsible for this activity
 * @property {string} description The description of the resource primarily associated with the activity.
 * @property {string} groupId The group ID associated with the activity. A group ID identifies user events that are associated with the same user and resource. For example, if a user rates a video and marks the same video as a favorite, the entries for those events would have the same group ID in the user&#39;s activity feed. In your user interface, you can avoid repetition by grouping events with the same groupId value.
 * @property {string} publishedAt The date and time that the video was uploaded. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the resource that is primarily associated with the activity. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The title of the resource primarily associated with the activity.
 * @property {string} type The type of activity that the resource describes.
 */
/**
 * @typedef Caption
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the caption track.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#caption&quot;.
 * @property {youtube(v3).CaptionSnippet} snippet The snippet object contains basic details about the caption.
 */
/**
 * @typedef CaptionListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Caption[]} items A list of captions that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#captionListResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef CaptionSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} audioTrackType The type of audio track associated with the caption track.
 * @property {string} failureReason The reason that YouTube failed to process the caption track. This property is only present if the state property&#39;s value is failed.
 * @property {boolean} isAutoSynced Indicates whether YouTube synchronized the caption track to the audio track in the video. The value will be true if a sync was explicitly requested when the caption track was uploaded. For example, when calling the captions.insert or captions.update methods, you can set the sync parameter to true to instruct YouTube to sync the uploaded track to the video. If the value is false, YouTube uses the time codes in the uploaded caption track to determine when to display captions.
 * @property {boolean} isCC Indicates whether the track contains closed captions for the deaf and hard of hearing. The default value is false.
 * @property {boolean} isDraft Indicates whether the caption track is a draft. If the value is true, then the track is not publicly visible. The default value is false.
 * @property {boolean} isEasyReader Indicates whether caption track is formatted for &quot;easy reader,&quot; meaning it is at a third-grade level for language learners. The default value is false.
 * @property {boolean} isLarge Indicates whether the caption track uses large text for the vision-impaired. The default value is false.
 * @property {string} language The language of the caption track. The property value is a BCP-47 language tag.
 * @property {string} lastUpdated The date and time when the caption track was last updated. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} name The name of the caption track. The name is intended to be visible to the user as an option during playback.
 * @property {string} status The caption track&#39;s status.
 * @property {string} trackKind The caption track&#39;s type.
 * @property {string} videoId The ID that YouTube uses to uniquely identify the video associated with the caption track.
 */
/**
 * @typedef CdnSettings
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} format The format of the video stream that you are sending to Youtube.
 * @property {string} frameRate The frame rate of the inbound video data.
 * @property {youtube(v3).IngestionInfo} ingestionInfo The ingestionInfo object contains information that YouTube provides that you need to transmit your RTMP or HTTP stream to YouTube.
 * @property {string} ingestionType The method or protocol used to transmit the video stream.
 * @property {string} resolution The resolution of the inbound video data.
 */
/**
 * @typedef Channel
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ChannelAuditDetails} auditDetails The auditionDetails object encapsulates channel data that is relevant for YouTube Partners during the audition process.
 * @property {youtube(v3).ChannelBrandingSettings} brandingSettings The brandingSettings object encapsulates information about the branding of the channel.
 * @property {youtube(v3).ChannelContentDetails} contentDetails The contentDetails object encapsulates information about the channel&#39;s content.
 * @property {youtube(v3).ChannelContentOwnerDetails} contentOwnerDetails The contentOwnerDetails object encapsulates channel data that is relevant for YouTube Partners linked with the channel.
 * @property {youtube(v3).ChannelConversionPings} conversionPings The conversionPings object encapsulates information about conversion pings that need to be respected by the channel.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the channel.
 * @property {youtube(v3).InvideoPromotion} invideoPromotion The invideoPromotion object encapsulates information about promotion campaign associated with the channel.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#channel&quot;.
 * @property {object} localizations Localizations for different languages
 * @property {youtube(v3).ChannelSnippet} snippet The snippet object contains basic details about the channel, such as its title, description, and thumbnail images.
 * @property {youtube(v3).ChannelStatistics} statistics The statistics object encapsulates statistics for the channel.
 * @property {youtube(v3).ChannelStatus} status The status object encapsulates information about the privacy status of the channel.
 * @property {youtube(v3).ChannelTopicDetails} topicDetails The topicDetails object encapsulates information about Freebase topics associated with the channel.
 */
/**
 * @typedef ChannelAuditDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} communityGuidelinesGoodStanding Whether or not the channel respects the community guidelines.
 * @property {boolean} contentIdClaimsGoodStanding Whether or not the channel has any unresolved claims.
 * @property {boolean} copyrightStrikesGoodStanding Whether or not the channel has any copyright strikes.
 * @property {boolean} overallGoodStanding Describes the general state of the channel. This field will always show if there are any issues whatsoever with the channel. Currently this field represents the result of the logical and operation over the community guidelines good standing, the copyright strikes good standing and the content ID claims good standing, but this may change in the future.
 */
/**
 * @typedef ChannelBannerResource
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#channelBannerResource&quot;.
 * @property {string} url The URL of this banner image.
 */
/**
 * @typedef ChannelBrandingSettings
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ChannelSettings} channel Branding properties for the channel view.
 * @property {youtube(v3).PropertyValue[]} hints Additional experimental branding properties.
 * @property {youtube(v3).ImageSettings} image Branding properties for branding images.
 * @property {youtube(v3).WatchSettings} watch Branding properties for the watch page.
 */
/**
 * @typedef ChannelContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {object} relatedPlaylists 
 */
/**
 * @typedef ChannelContentOwnerDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} contentOwner The ID of the content owner linked to the channel.
 * @property {string} timeLinked The date and time of when the channel was linked to the content owner. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 */
/**
 * @typedef ChannelConversionPing
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} context Defines the context of the ping.
 * @property {string} conversionUrl The url (without the schema) that the player shall send the ping to. It&#39;s at caller&#39;s descretion to decide which schema to use (http vs https) Example of a returned url: //googleads.g.doubleclick.net/pagead/ viewthroughconversion/962985656/?data=path%3DtHe_path%3Btype%3D cview%3Butuid%3DGISQtTNGYqaYl4sKxoVvKA&amp;labe=default The caller must append biscotti authentication (ms param in case of mobile, for example) to this ping.
 */
/**
 * @typedef ChannelConversionPings
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ChannelConversionPing[]} pings Pings that the app shall fire (authenticated by biscotti cookie). Each ping has a context, in which the app must fire the ping, and a url identifying the ping.
 */
/**
 * @typedef ChannelListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Channel[]} items A list of channels that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#channelListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef ChannelLocalization
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} description The localized strings for channel&#39;s description.
 * @property {string} title The localized strings for channel&#39;s title.
 */
/**
 * @typedef ChannelProfileDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The YouTube channel ID.
 * @property {string} channelUrl The channel&#39;s URL.
 * @property {string} displayName The channel&#39;s display name.
 * @property {string} profileImageUrl The channels&#39;s avatar URL.
 */
/**
 * @typedef ChannelSection
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).ChannelSectionContentDetails} contentDetails The contentDetails object contains details about the channel section content, such as a list of playlists or channels featured in the section.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the channel section.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#channelSection&quot;.
 * @property {object} localizations Localizations for different languages
 * @property {youtube(v3).ChannelSectionSnippet} snippet The snippet object contains basic details about the channel section, such as its type, style and title.
 * @property {youtube(v3).ChannelSectionTargeting} targeting The targeting object contains basic targeting settings about the channel section.
 */
/**
 * @typedef ChannelSectionContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} channels The channel ids for type multiple_channels.
 * @property {string[]} playlists The playlist ids for type single_playlist and multiple_playlists. For singlePlaylist, only one playlistId is allowed.
 */
/**
 * @typedef ChannelSectionListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).ChannelSection[]} items A list of ChannelSections that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#channelSectionListResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef ChannelSectionLocalization
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} title The localized strings for channel section&#39;s title.
 */
/**
 * @typedef ChannelSectionSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel that published the channel section.
 * @property {string} defaultLanguage The language of the channel section&#39;s default title and description.
 * @property {youtube(v3).ChannelSectionLocalization} localized Localized title, read-only.
 * @property {integer} position The position of the channel section in the channel.
 * @property {string} style The style of the channel section.
 * @property {string} title The channel section&#39;s title for multiple_playlists and multiple_channels.
 * @property {string} type The type of the channel section.
 */
/**
 * @typedef ChannelSectionTargeting
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} countries The country the channel section is targeting.
 * @property {string[]} languages The language the channel section is targeting.
 * @property {string[]} regions The region the channel section is targeting.
 */
/**
 * @typedef ChannelSettings
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} country The country of the channel.
 * @property {string} defaultLanguage 
 * @property {string} defaultTab Which content tab users should see when viewing the channel.
 * @property {string} description Specifies the channel description.
 * @property {string} featuredChannelsTitle Title for the featured channels tab.
 * @property {string[]} featuredChannelsUrls The list of featured channels.
 * @property {string} keywords Lists keywords associated with the channel, comma-separated.
 * @property {boolean} moderateComments Whether user-submitted comments left on the channel page need to be approved by the channel owner to be publicly visible.
 * @property {string} profileColor A prominent color that can be rendered on this channel page.
 * @property {boolean} showBrowseView Whether the tab to browse the videos should be displayed.
 * @property {boolean} showRelatedChannels Whether related channels should be proposed.
 * @property {string} title Specifies the channel title.
 * @property {string} trackingAnalyticsAccountId The ID for a Google Analytics account to track and measure traffic to the channels.
 * @property {string} unsubscribedTrailer The trailer of the channel, for users that are not subscribers.
 */
/**
 * @typedef ChannelSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} country The country of the channel.
 * @property {string} customUrl The custom url of the channel.
 * @property {string} defaultLanguage The language of the channel&#39;s default title and description.
 * @property {string} description The description of the channel.
 * @property {youtube(v3).ChannelLocalization} localized Localized title and description, read-only.
 * @property {string} publishedAt The date and time that the channel was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The channel&#39;s title.
 */
/**
 * @typedef ChannelStatistics
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} commentCount The number of comments for the channel.
 * @property {boolean} hiddenSubscriberCount Whether or not the number of subscribers is shown for this user.
 * @property {string} subscriberCount The number of subscribers that the channel has.
 * @property {string} videoCount The number of videos uploaded to the channel.
 * @property {string} viewCount The number of times the channel has been viewed.
 */
/**
 * @typedef ChannelStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} isLinked If true, then the user is linked to either a YouTube username or G+ account. Otherwise, the user doesn&#39;t have a public YouTube identity.
 * @property {string} longUploadsStatus The long uploads status of this channel. See
 * @property {string} privacyStatus Privacy status of the channel.
 */
/**
 * @typedef ChannelTopicDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} topicIds A list of Freebase topic IDs associated with the channel. You can retrieve information about each topic using the Freebase Topic API.
 */
/**
 * @typedef Comment
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the comment.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#comment&quot;.
 * @property {youtube(v3).CommentSnippet} snippet The snippet object contains basic details about the comment.
 */
/**
 * @typedef CommentListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Comment[]} items A list of comments that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#commentListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef CommentSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {any} authorChannelId The id of the author&#39;s YouTube channel, if any.
 * @property {string} authorChannelUrl Link to the author&#39;s YouTube channel, if any.
 * @property {string} authorDisplayName The name of the user who posted the comment.
 * @property {string} authorProfileImageUrl The URL for the avatar of the user who posted the comment.
 * @property {boolean} canRate Whether the current viewer can rate this comment.
 * @property {string} channelId The id of the corresponding YouTube channel. In case of a channel comment this is the channel the comment refers to. In case of a video comment it&#39;s the video&#39;s channel.
 * @property {integer} likeCount The total number of likes this comment has received.
 * @property {string} moderationStatus The comment&#39;s moderation status. Will not be set if the comments were requested through the id filter.
 * @property {string} parentId The unique id of the parent comment, only set for replies.
 * @property {string} publishedAt The date and time when the comment was orignally published. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} textDisplay The comment&#39;s text. The format is either plain text or HTML dependent on what has been requested. Even the plain text representation may differ from the text originally posted in that it may replace video links with video titles etc.
 * @property {string} textOriginal The comment&#39;s original raw text as initially posted or last updated. The original text will only be returned if it is accessible to the viewer, which is only guaranteed if the viewer is the comment&#39;s author.
 * @property {string} updatedAt The date and time when was last updated . The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} videoId The ID of the video the comment refers to, if any.
 * @property {string} viewerRating The rating the viewer has given to this comment. For the time being this will never return RATE_TYPE_DISLIKE and instead return RATE_TYPE_NONE. This may change in the future.
 */
/**
 * @typedef CommentThread
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the comment thread.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#commentThread&quot;.
 * @property {youtube(v3).CommentThreadReplies} replies The replies object contains a limited number of replies (if any) to the top level comment found in the snippet.
 * @property {youtube(v3).CommentThreadSnippet} snippet The snippet object contains basic details about the comment thread and also the top level comment.
 */
/**
 * @typedef CommentThreadListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).CommentThread[]} items A list of comment threads that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#commentThreadListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef CommentThreadReplies
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).Comment[]} comments A limited number of replies. Unless the number of replies returned equals total_reply_count in the snippet the returned replies are only a subset of the total number of replies.
 */
/**
 * @typedef CommentThreadSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} canReply Whether the current viewer of the thread can reply to it. This is viewer specific - other viewers may see a different value for this field.
 * @property {string} channelId The YouTube channel the comments in the thread refer to or the channel with the video the comments refer to. If video_id isn&#39;t set the comments refer to the channel itself.
 * @property {boolean} isPublic Whether the thread (and therefore all its comments) is visible to all YouTube users.
 * @property {youtube(v3).Comment} topLevelComment The top level comment of this thread.
 * @property {integer} totalReplyCount The total number of replies (not including the top level comment).
 * @property {string} videoId The ID of the video the comments refer to, if any. No video_id implies a channel discussion comment.
 */
/**
 * @typedef ContentRating
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} acbRating The video&#39;s Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children&#39;s television programming.
 * @property {string} agcomRating The video&#39;s rating from Italy&#39;s Autorità per le Garanzie nelle Comunicazioni (AGCOM).
 * @property {string} anatelRating The video&#39;s Anatel (Asociación Nacional de Televisión) rating for Chilean television.
 * @property {string} bbfcRating The video&#39;s British Board of Film Classification (BBFC) rating.
 * @property {string} bfvcRating The video&#39;s rating from Thailand&#39;s Board of Film and Video Censors.
 * @property {string} bmukkRating The video&#39;s rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).
 * @property {string} catvRating Rating system for Canadian TV - Canadian TV Classification System The video&#39;s rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 * @property {string} catvfrRating The video&#39;s rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the Canadian Broadcast Standards Council website.
 * @property {string} cbfcRating The video&#39;s Central Board of Film Certification (CBFC - India) rating.
 * @property {string} cccRating The video&#39;s Consejo de Calificación Cinematográfica (Chile) rating.
 * @property {string} cceRating The video&#39;s rating from Portugal&#39;s Comissão de Classificação de Espect´culos.
 * @property {string} chfilmRating The video&#39;s rating in Switzerland.
 * @property {string} chvrsRating The video&#39;s Canadian Home Video Rating System (CHVRS) rating.
 * @property {string} cicfRating The video&#39;s rating from the Commission de Contrôle des Films (Belgium).
 * @property {string} cnaRating The video&#39;s rating from Romania&#39;s CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).
 * @property {string} cncRating Rating system in France - Commission de classification cinematographique
 * @property {string} csaRating The video&#39;s rating from France&#39;s Conseil supérieur de l?audiovisuel, which rates broadcast content.
 * @property {string} cscfRating The video&#39;s rating from Luxembourg&#39;s Commission de surveillance de la classification des films (CSCF).
 * @property {string} czfilmRating The video&#39;s rating in the Czech Republic.
 * @property {string} djctqRating The video&#39;s Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.
 * @property {string[]} djctqRatingReasons Reasons that explain why the video received its DJCQT (Brazil) rating.
 * @property {string} ecbmctRating Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism
 * @property {string} eefilmRating The video&#39;s rating in Estonia.
 * @property {string} egfilmRating The video&#39;s rating in Egypt.
 * @property {string} eirinRating The video&#39;s Eirin (映倫) rating. Eirin is the Japanese rating system.
 * @property {string} fcbmRating The video&#39;s rating from Malaysia&#39;s Film Censorship Board.
 * @property {string} fcoRating The video&#39;s rating from Hong Kong&#39;s Office for Film, Newspaper and Article Administration.
 * @property {string} fmocRating This property has been deprecated. Use the contentDetails.contentRating.cncRating instead.
 * @property {string} fpbRating The video&#39;s rating from South Africa&#39;s Film and Publication Board.
 * @property {string[]} fpbRatingReasons Reasons that explain why the video received its FPB (South Africa) rating.
 * @property {string} fskRating The video&#39;s Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.
 * @property {string} grfilmRating The video&#39;s rating in Greece.
 * @property {string} icaaRating The video&#39;s Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.
 * @property {string} ifcoRating The video&#39;s Irish Film Classification Office (IFCO - Ireland) rating. See the IFCO website for more information.
 * @property {string} ilfilmRating The video&#39;s rating in Israel.
 * @property {string} incaaRating The video&#39;s INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.
 * @property {string} kfcbRating The video&#39;s rating from the Kenya Film Classification Board.
 * @property {string} kijkwijzerRating voor de Classificatie van Audiovisuele Media (Netherlands).
 * @property {string} kmrbRating The video&#39;s Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.
 * @property {string} lsfRating The video&#39;s rating from Indonesia&#39;s Lembaga Sensor Film.
 * @property {string} mccaaRating The video&#39;s rating from Malta&#39;s Film Age-Classification Board.
 * @property {string} mccypRating The video&#39;s rating from the Danish Film Institute&#39;s (Det Danske Filminstitut) Media Council for Children and Young People.
 * @property {string} mcstRating The video&#39;s rating system for Vietnam - MCST
 * @property {string} mdaRating The video&#39;s rating from Singapore&#39;s Media Development Authority (MDA) and, specifically, it&#39;s Board of Film Censors (BFC).
 * @property {string} medietilsynetRating The video&#39;s rating from Medietilsynet, the Norwegian Media Authority.
 * @property {string} mekuRating The video&#39;s rating from Finland&#39;s Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).
 * @property {string} mibacRating The video&#39;s rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).
 * @property {string} mocRating The video&#39;s Ministerio de Cultura (Colombia) rating.
 * @property {string} moctwRating The video&#39;s rating from Taiwan&#39;s Ministry of Culture (文化部).
 * @property {string} mpaaRating The video&#39;s Motion Picture Association of America (MPAA) rating.
 * @property {string} mtrcbRating The video&#39;s rating from the Movie and Television Review and Classification Board (Philippines).
 * @property {string} nbcRating The video&#39;s rating from the Maldives National Bureau of Classification.
 * @property {string} nbcplRating The video&#39;s rating in Poland.
 * @property {string} nfrcRating The video&#39;s rating from the Bulgarian National Film Center.
 * @property {string} nfvcbRating The video&#39;s rating from Nigeria&#39;s National Film and Video Censors Board.
 * @property {string} nkclvRating The video&#39;s rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).
 * @property {string} oflcRating The video&#39;s Office of Film and Literature Classification (OFLC - New Zealand) rating.
 * @property {string} pefilmRating The video&#39;s rating in Peru.
 * @property {string} rcnofRating The video&#39;s rating from the Hungarian Nemzeti Filmiroda, the Rating Committee of the National Office of Film.
 * @property {string} resorteviolenciaRating The video&#39;s rating in Venezuela.
 * @property {string} rtcRating The video&#39;s General Directorate of Radio, Television and Cinematography (Mexico) rating.
 * @property {string} rteRating The video&#39;s rating from Ireland&#39;s Raidió Teilifís Éireann.
 * @property {string} russiaRating The video&#39;s National Film Registry of the Russian Federation (MKRF - Russia) rating.
 * @property {string} skfilmRating The video&#39;s rating in Slovakia.
 * @property {string} smaisRating The video&#39;s rating in Iceland.
 * @property {string} smsaRating The video&#39;s rating from Statens medieråd (Sweden&#39;s National Media Council).
 * @property {string} tvpgRating The video&#39;s TV Parental Guidelines (TVPG) rating.
 * @property {string} ytRating A rating that YouTube uses to identify age-restricted content.
 */
/**
 * @typedef FanFundingEvent
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the fan funding event.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#fanFundingEvent&quot;.
 * @property {youtube(v3).FanFundingEventSnippet} snippet The snippet object contains basic details about the fan funding event.
 */
/**
 * @typedef FanFundingEventListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).FanFundingEvent[]} items A list of fan funding events that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#fanFundingEventListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef FanFundingEventSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} amountMicros The amount of funding in micros of fund_currency. e.g., 1 is represented
 * @property {string} channelId Channel id where the funding event occurred.
 * @property {string} commentText The text contents of the comment left by the user.
 * @property {string} createdAt The date and time when the funding occurred. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} currency The currency in which the fund was made. ISO 4217.
 * @property {string} displayString A rendered string that displays the fund amount and currency (e.g., &quot;$1.00&quot;). The string is rendered for the given language.
 * @property {youtube(v3).ChannelProfileDetails} supporterDetails Details about the supporter. Only filled if the event was made public by the user.
 */
/**
 * @typedef GeoPoint
 * @memberOf! youtube(v3)
 * @type object
 * @property {number} altitude Altitude above the reference ellipsoid, in meters.
 * @property {number} latitude Latitude in degrees.
 * @property {number} longitude Longitude in degrees.
 */
/**
 * @typedef GuideCategory
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the guide category.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#guideCategory&quot;.
 * @property {youtube(v3).GuideCategorySnippet} snippet The snippet object contains basic details about the category, such as its title.
 */
/**
 * @typedef GuideCategoryListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).GuideCategory[]} items A list of categories that can be associated with YouTube channels. In this map, the category ID is the map key, and its value is the corresponding guideCategory resource.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#guideCategoryListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef GuideCategorySnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId 
 * @property {string} title Description of the guide category.
 */
/**
 * @typedef I18nLanguage
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the i18n language.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#i18nLanguage&quot;.
 * @property {youtube(v3).I18nLanguageSnippet} snippet The snippet object contains basic details about the i18n language, such as language code and human-readable name.
 */
/**
 * @typedef I18nLanguageListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).I18nLanguage[]} items A list of supported i18n languages. In this map, the i18n language ID is the map key, and its value is the corresponding i18nLanguage resource.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#i18nLanguageListResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef I18nLanguageSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} hl A short BCP-47 code that uniquely identifies a language.
 * @property {string} name The human-readable name of the language in the language itself.
 */
/**
 * @typedef I18nRegion
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the i18n region.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#i18nRegion&quot;.
 * @property {youtube(v3).I18nRegionSnippet} snippet The snippet object contains basic details about the i18n region, such as region code and human-readable name.
 */
/**
 * @typedef I18nRegionListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).I18nRegion[]} items A list of regions where YouTube is available. In this map, the i18n region ID is the map key, and its value is the corresponding i18nRegion resource.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#i18nRegionListResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef I18nRegionSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} gl The region code as a 2-letter ISO country code.
 * @property {string} name The human-readable name of the region.
 */
/**
 * @typedef ImageSettings
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LocalizedProperty} backgroundImageUrl The URL for the background image shown on the video watch page. The image should be 1200px by 615px, with a maximum file size of 128k.
 * @property {string} bannerExternalUrl This is used only in update requests; if it&#39;s set, we use this URL to generate all of the above banner URLs.
 * @property {string} bannerImageUrl Banner image. Desktop size (1060x175).
 * @property {string} bannerMobileExtraHdImageUrl Banner image. Mobile size high resolution (1440x395).
 * @property {string} bannerMobileHdImageUrl Banner image. Mobile size high resolution (1280x360).
 * @property {string} bannerMobileImageUrl Banner image. Mobile size (640x175).
 * @property {string} bannerMobileLowImageUrl Banner image. Mobile size low resolution (320x88).
 * @property {string} bannerMobileMediumHdImageUrl Banner image. Mobile size medium/high resolution (960x263).
 * @property {string} bannerTabletExtraHdImageUrl Banner image. Tablet size extra high resolution (2560x424).
 * @property {string} bannerTabletHdImageUrl Banner image. Tablet size high resolution (2276x377).
 * @property {string} bannerTabletImageUrl Banner image. Tablet size (1707x283).
 * @property {string} bannerTabletLowImageUrl Banner image. Tablet size low resolution (1138x188).
 * @property {string} bannerTvHighImageUrl Banner image. TV size high resolution (1920x1080).
 * @property {string} bannerTvImageUrl Banner image. TV size extra high resolution (2120x1192).
 * @property {string} bannerTvLowImageUrl Banner image. TV size low resolution (854x480).
 * @property {string} bannerTvMediumImageUrl Banner image. TV size medium resolution (1280x720).
 * @property {youtube(v3).LocalizedProperty} largeBrandedBannerImageImapScript The image map script for the large banner image.
 * @property {youtube(v3).LocalizedProperty} largeBrandedBannerImageUrl The URL for the 854px by 70px image that appears below the video player in the expanded video view of the video watch page.
 * @property {youtube(v3).LocalizedProperty} smallBrandedBannerImageImapScript The image map script for the small banner image.
 * @property {youtube(v3).LocalizedProperty} smallBrandedBannerImageUrl The URL for the 640px by 70px banner image that appears below the video player in the default view of the video watch page.
 * @property {string} trackingImageUrl The URL for a 1px by 1px tracking pixel that can be used to collect statistics for views of the channel or video pages.
 * @property {string} watchIconImageUrl The URL for the image that appears above the top-left corner of the video player. This is a 25-pixel-high image with a flexible width that cannot exceed 170 pixels.
 */
/**
 * @typedef IngestionInfo
 * @memberOf! youtube(v3)
 * @type object
* @property {string} backupIngestionAddress The backup ingestion URL that you should use to stream video to YouTube. You have the option of simultaneously streaming the content that you are sending to the ingestionAddress to this URL.
* @property {string} ingestionAddress The primary ingestion URL that you should use to stream video to YouTube. You must stream video to this URL.

Depending on which application or tool you use to encode your video stream, you may need to enter the stream URL and stream name separately or you may need to concatenate them in the following format:

STREAM_URL/STREAM_NAME
* @property {string} streamName The HTTP or RTMP stream name that YouTube assigns to the video stream.
*/
/**
 * @typedef InvideoBranding
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} imageBytes 
 * @property {string} imageUrl 
 * @property {youtube(v3).InvideoPosition} position 
 * @property {string} targetChannelId 
 * @property {youtube(v3).InvideoTiming} timing 
 */
/**
 * @typedef InvideoPosition
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} cornerPosition Describes in which corner of the video the visual widget will appear.
 * @property {string} type Defines the position type.
 */
/**
 * @typedef InvideoPromotion
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).InvideoTiming} defaultTiming The default temporal position within the video where the promoted item will be displayed. Can be overriden by more specific timing in the item.
 * @property {youtube(v3).PromotedItem[]} items List of promoted items in decreasing priority.
 * @property {youtube(v3).InvideoPosition} position The spatial position within the video where the promoted item will be displayed.
 * @property {boolean} useSmartTiming Indicates whether the channel&#39;s promotional campaign uses &quot;smart timing.&quot; This feature attempts to show promotions at a point in the video when they are more likely to be clicked and less likely to disrupt the viewing experience. This feature also picks up a single promotion to show on each video.
 */
/**
 * @typedef InvideoTiming
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} durationMs Defines the duration in milliseconds for which the promotion should be displayed. If missing, the client should use the default.
 * @property {string} offsetMs Defines the time at which the promotion will appear. Depending on the value of type the value of the offsetMs field will represent a time offset from the start or from the end of the video, expressed in milliseconds.
 * @property {string} type Describes a timing type. If the value is offsetFromStart, then the offsetMs field represents an offset from the start of the video. If the value is offsetFromEnd, then the offsetMs field represents an offset from the end of the video.
 */
/**
 * @typedef LanguageTag
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} value 
 */
/**
 * @typedef LiveBroadcast
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveBroadcastContentDetails} contentDetails The contentDetails object contains information about the event&#39;s video content, such as whether the content can be shown in an embedded video player or if it will be archived and therefore available for viewing after the event has concluded.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the broadcast.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveBroadcast&quot;.
 * @property {youtube(v3).LiveBroadcastSnippet} snippet The snippet object contains basic details about the event, including its title, description, start time, and end time.
 * @property {youtube(v3).LiveBroadcastStatistics} statistics The statistics object contains info about the event&#39;s current stats. These include concurrent viewers and total chat count. Statistics can change (in either direction) during the lifetime of an event. Statistics are only returned while the event is live.
 * @property {youtube(v3).LiveBroadcastStatus} status The status object contains information about the event&#39;s status.
 * @property {youtube(v3).LiveBroadcastTopicDetails} topicDetails 
 */
/**
 * @typedef LiveBroadcastContentDetails
 * @memberOf! youtube(v3)
 * @type object
* @property {string} boundStreamId This value uniquely identifies the live stream bound to the broadcast.
* @property {string} boundStreamLastUpdateTimeMs The date and time that the live stream referenced by boundStreamId was last updated.
* @property {string} closedCaptionsType 
* @property {boolean} enableClosedCaptions This setting indicates whether HTTP POST closed captioning is enabled for this broadcast. The ingestion URL of the closed captions is returned through the liveStreams API. This is mutually exclusive with using the closed_captions_type property, and is equivalent to setting closed_captions_type to CLOSED_CAPTIONS_HTTP_POST.
* @property {boolean} enableContentEncryption This setting indicates whether YouTube should enable content encryption for the broadcast.
* @property {boolean} enableDvr This setting determines whether viewers can access DVR controls while watching the video. DVR controls enable the viewer to control the video playback experience by pausing, rewinding, or fast forwarding content. The default value for this property is true.



Important: You must set the value to true and also set the enableArchive property&#39;s value to true if you want to make playback available immediately after the broadcast ends.
* @property {boolean} enableEmbed This setting indicates whether the broadcast video can be played in an embedded player. If you choose to archive the video (using the enableArchive property), this setting will also apply to the archived video.
* @property {boolean} enableLowLatency Indicates whether this broadcast has low latency enabled.
* @property {youtube(v3).MonitorStreamInfo} monitorStream The monitorStream object contains information about the monitor stream, which the broadcaster can use to review the event content before the broadcast stream is shown publicly.
* @property {string} projection The projection format of this broadcast. This defaults to rectangular.
* @property {boolean} recordFromStart Automatically start recording after the event goes live. The default value for this property is true.



Important: You must also set the enableDvr property&#39;s value to true if you want the playback to be available immediately after the broadcast ends. If you set this property&#39;s value to true but do not also set the enableDvr property to true, there may be a delay of around one day before the archived video will be available for playback.
* @property {boolean} startWithSlate This setting indicates whether the broadcast should automatically begin with an in-stream slate when you update the broadcast&#39;s status to live. After updating the status, you then need to send a liveCuepoints.insert request that sets the cuepoint&#39;s eventState to end to remove the in-stream slate and make your broadcast stream visible to viewers.
*/
/**
 * @typedef LiveBroadcastListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).LiveBroadcast[]} items A list of broadcasts that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveBroadcastListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef LiveBroadcastSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} actualEndTime The date and time that the broadcast actually ended. This information is only available once the broadcast&#39;s state is complete. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} actualStartTime The date and time that the broadcast actually started. This information is only available once the broadcast&#39;s state is live. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel that is publishing the broadcast.
 * @property {string} description The broadcast&#39;s description. As with the title, you can set this field by modifying the broadcast resource or by setting the description field of the corresponding video resource.
 * @property {boolean} isDefaultBroadcast 
 * @property {string} liveChatId The id of the live chat for this broadcast.
 * @property {string} publishedAt The date and time that the broadcast was added to YouTube&#39;s live broadcast schedule. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} scheduledEndTime The date and time that the broadcast is scheduled to end. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} scheduledStartTime The date and time that the broadcast is scheduled to start. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the broadcast. For each nested object in this object, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The broadcast&#39;s title. Note that the broadcast represents exactly one YouTube video. You can set this field by modifying the broadcast resource or by setting the title field of the corresponding video resource.
 */
/**
 * @typedef LiveBroadcastStatistics
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} concurrentViewers The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
 * @property {string} totalChatCount The total number of live chat messages currently on the broadcast. The property and its value will be present if the broadcast is public, has the live chat feature enabled, and has at least one message. Note that this field will not be filled after the broadcast ends. So this property would not identify the number of chat messages for an archived video of a completed live broadcast.
 */
/**
 * @typedef LiveBroadcastStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} lifeCycleStatus The broadcast&#39;s status. The status can be updated using the API&#39;s liveBroadcasts.transition method.
 * @property {string} liveBroadcastPriority Priority of the live broadcast event (internal state).
 * @property {string} privacyStatus The broadcast&#39;s privacy status. Note that the broadcast represents exactly one YouTube video, so the privacy settings are identical to those supported for videos. In addition, you can set this field by modifying the broadcast resource or by setting the privacyStatus field of the corresponding video resource.
 * @property {string} recordingStatus The broadcast&#39;s recording status.
 */
/**
 * @typedef LiveBroadcastTopic
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveBroadcastTopicSnippet} snippet Information about the topic matched.
 * @property {string} type The type of the topic.
 * @property {boolean} unmatched If this flag is set it means that we have not been able to match the topic title and type provided to a known entity.
 */
/**
 * @typedef LiveBroadcastTopicDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveBroadcastTopic[]} topics 
 */
/**
 * @typedef LiveBroadcastTopicSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} name The name of the topic.
 * @property {string} releaseDate The date at which the topic was released. Filled for types: videoGame
 */
/**
 * @typedef LiveChatBan
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the ban.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveChatBan&quot;.
 * @property {youtube(v3).LiveChatBanSnippet} snippet The snippet object contains basic details about the ban.
 */
/**
 * @typedef LiveChatBanSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} banDurationSeconds The duration of a ban, only filled if the ban has type TEMPORARY.
 * @property {youtube(v3).ChannelProfileDetails} bannedUserDetails 
 * @property {string} liveChatId The chat this ban is pertinent to.
 * @property {string} type The type of ban.
 */
/**
 * @typedef LiveChatFanFundingEventDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} amountDisplayString A rendered string that displays the fund amount and currency to the user.
 * @property {string} amountMicros The amount of the fund.
 * @property {string} currency The currency in which the fund was made.
 * @property {string} userComment The comment added by the user to this fan funding event.
 */
/**
 * @typedef LiveChatMessage
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveChatMessageAuthorDetails} authorDetails The authorDetails object contains basic details about the user that posted this message.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the message.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveChatMessage&quot;.
 * @property {youtube(v3).LiveChatMessageSnippet} snippet The snippet object contains basic details about the message.
 */
/**
 * @typedef LiveChatMessageAuthorDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The YouTube channel ID.
 * @property {string} channelUrl The channel&#39;s URL.
 * @property {string} displayName The channel&#39;s display name.
 * @property {boolean} isChatModerator Whether the author is a moderator of the live chat.
 * @property {boolean} isChatOwner Whether the author is the owner of the live chat.
 * @property {boolean} isChatSponsor Whether the author is a sponsor of the live chat.
 * @property {boolean} isVerified Whether the author&#39;s identity has been verified by YouTube.
 * @property {string} profileImageUrl The channels&#39;s avatar URL.
 */
/**
 * @typedef LiveChatMessageDeletedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} deletedMessageId 
 */
/**
 * @typedef LiveChatMessageListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).LiveChatMessage[]} items A list of live chat messages.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveChatMessageListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {string} offlineAt The date and time when the underlying stream went offline. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {integer} pollingIntervalMillis The amount of time the client should wait before polling again.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef LiveChatMessageRetractedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} retractedMessageId 
 */
/**
 * @typedef LiveChatMessageSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} authorChannelId The ID of the user that authored this message, this field is not always filled. textMessageEvent - the user that wrote the message fanFundingEvent - the user that funded the broadcast newSponsorEvent - the user that just became a sponsor messageDeletedEvent - the moderator that took the action messageRetractedEvent - the author that retracted their message userBannedEvent - the moderator that took the action
 * @property {string} displayMessage Contains a string that can be displayed to the user. If this field is not present the message is silent, at the moment only messages of type TOMBSTONE and CHAT_ENDED_EVENT are silent.
 * @property {youtube(v3).LiveChatFanFundingEventDetails} fanFundingEventDetails Details about the funding event, this is only set if the type is &#39;fanFundingEvent&#39;.
 * @property {boolean} hasDisplayContent Whether the message has display content that should be displayed to users.
 * @property {string} liveChatId 
 * @property {youtube(v3).LiveChatMessageDeletedDetails} messageDeletedDetails 
 * @property {youtube(v3).LiveChatMessageRetractedDetails} messageRetractedDetails 
 * @property {youtube(v3).LiveChatPollClosedDetails} pollClosedDetails 
 * @property {youtube(v3).LiveChatPollEditedDetails} pollEditedDetails 
 * @property {youtube(v3).LiveChatPollOpenedDetails} pollOpenedDetails 
 * @property {youtube(v3).LiveChatPollVotedDetails} pollVotedDetails 
 * @property {string} publishedAt The date and time when the message was orignally published. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).LiveChatTextMessageDetails} textMessageDetails Details about the text message, this is only set if the type is &#39;textMessageEvent&#39;.
 * @property {string} type The type of message, this will always be present, it determines the contents of the message as well as which fields will be present.
 * @property {youtube(v3).LiveChatUserBannedMessageDetails} userBannedDetails 
 */
/**
 * @typedef LiveChatModerator
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the moderator.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveChatModerator&quot;.
 * @property {youtube(v3).LiveChatModeratorSnippet} snippet The snippet object contains basic details about the moderator.
 */
/**
 * @typedef LiveChatModeratorListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).LiveChatModerator[]} items A list of moderators that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveChatModeratorListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef LiveChatModeratorSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} liveChatId The ID of the live chat this moderator can act on.
 * @property {youtube(v3).ChannelProfileDetails} moderatorDetails Details about the moderator.
 */
/**
 * @typedef LiveChatPollClosedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} pollId The id of the poll that was closed.
 */
/**
 * @typedef LiveChatPollEditedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} id 
 * @property {youtube(v3).LiveChatPollItem[]} items 
 * @property {string} prompt 
 */
/**
 * @typedef LiveChatPollItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} description Plain text description of the item.
 * @property {string} itemId 
 */
/**
 * @typedef LiveChatPollOpenedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} id 
 * @property {youtube(v3).LiveChatPollItem[]} items 
 * @property {string} prompt 
 */
/**
 * @typedef LiveChatPollVotedDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} itemId The poll item the user chose.
 * @property {string} pollId The poll the user voted on.
 */
/**
 * @typedef LiveChatTextMessageDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} messageText The user&#39;s message.
 */
/**
 * @typedef LiveChatUserBannedMessageDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} banDurationSeconds The duration of the ban. This property is only present if the banType is temporary.
 * @property {string} banType The type of ban.
 * @property {youtube(v3).ChannelProfileDetails} bannedUserDetails The details of the user that was banned.
 */
/**
 * @typedef LiveStream
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).CdnSettings} cdn The cdn object defines the live stream&#39;s content delivery network (CDN) settings. These settings provide details about the manner in which you stream your content to YouTube.
 * @property {youtube(v3).LiveStreamContentDetails} contentDetails The content_details object contains information about the stream, including the closed captions ingestion URL.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the stream.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveStream&quot;.
 * @property {youtube(v3).LiveStreamSnippet} snippet The snippet object contains basic details about the stream, including its channel, title, and description.
 * @property {youtube(v3).LiveStreamStatus} status The status object contains information about live stream&#39;s status.
 */
/**
 * @typedef LiveStreamConfigurationIssue
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} description The long-form description of the issue and how to resolve it.
 * @property {string} reason The short-form reason for this issue.
 * @property {string} severity How severe this issue is to the stream.
 * @property {string} type The kind of error happening.
 */
/**
 * @typedef LiveStreamContentDetails
 * @memberOf! youtube(v3)
 * @type object
* @property {string} closedCaptionsIngestionUrl The ingestion URL where the closed captions of this stream are sent.
* @property {boolean} isReusable Indicates whether the stream is reusable, which means that it can be bound to multiple broadcasts. It is common for broadcasters to reuse the same stream for many different broadcasts if those broadcasts occur at different times.

If you set this value to false, then the stream will not be reusable, which means that it can only be bound to one broadcast. Non-reusable streams differ from reusable streams in the following ways:  
- A non-reusable stream can only be bound to one broadcast. 
- A non-reusable stream might be deleted by an automated process after the broadcast ends. 
- The  liveStreams.list method does not list non-reusable streams if you call the method and set the mine parameter to true. The only way to use that method to retrieve the resource for a non-reusable stream is to use the id parameter to identify the stream.
*/
/**
 * @typedef LiveStreamHealthStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveStreamConfigurationIssue[]} configurationIssues The configurations issues on this stream
 * @property {string} lastUpdateTimeSeconds The last time this status was updated (in seconds)
 * @property {string} status The status code of this stream
 */
/**
 * @typedef LiveStreamListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).LiveStream[]} items A list of live streams that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#liveStreamListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef LiveStreamSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel that is transmitting the stream.
 * @property {string} description The stream&#39;s description. The value cannot be longer than 10000 characters.
 * @property {boolean} isDefaultStream 
 * @property {string} publishedAt The date and time that the stream was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} title The stream&#39;s title. The value must be between 1 and 128 characters long.
 */
/**
 * @typedef LiveStreamStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).LiveStreamHealthStatus} healthStatus The health status of the stream.
 * @property {string} streamStatus 
 */
/**
 * @typedef LocalizedProperty
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} default 
 * @property {youtube(v3).LanguageTag} defaultLanguage The language of the default property.
 * @property {youtube(v3).LocalizedString[]} localized 
 */
/**
 * @typedef LocalizedString
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} language 
 * @property {string} value 
 */
/**
 * @typedef MonitorStreamInfo
 * @memberOf! youtube(v3)
 * @type object
* @property {integer} broadcastStreamDelayMs If you have set the enableMonitorStream property to true, then this property determines the length of the live broadcast delay.
* @property {string} embedHtml HTML code that embeds a player that plays the monitor stream.
* @property {boolean} enableMonitorStream This value determines whether the monitor stream is enabled for the broadcast. If the monitor stream is enabled, then YouTube will broadcast the event content on a special stream intended only for the broadcaster&#39;s consumption. The broadcaster can use the stream to review the event content and also to identify the optimal times to insert cuepoints.

You need to set this value to true if you intend to have a broadcast delay for your event.

Note: This property cannot be updated once the broadcast is in the testing or live state.
*/
/**
 * @typedef PageInfo
 * @memberOf! youtube(v3)
 * @type object
 * @property {integer} resultsPerPage The number of results included in the API response.
 * @property {integer} totalResults The total number of results in the result set.
 */
/**
 * @typedef Playlist
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).PlaylistContentDetails} contentDetails The contentDetails object contains information like video count.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the playlist.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#playlist&quot;.
 * @property {object} localizations Localizations for different languages
 * @property {youtube(v3).PlaylistPlayer} player The player object contains information that you would use to play the playlist in an embedded player.
 * @property {youtube(v3).PlaylistSnippet} snippet The snippet object contains basic details about the playlist, such as its title and description.
 * @property {youtube(v3).PlaylistStatus} status The status object contains status information for the playlist.
 */
/**
 * @typedef PlaylistContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {integer} itemCount The number of videos in the playlist.
 */
/**
 * @typedef PlaylistItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).PlaylistItemContentDetails} contentDetails The contentDetails object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the playlist item.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#playlistItem&quot;.
 * @property {youtube(v3).PlaylistItemSnippet} snippet The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
 * @property {youtube(v3).PlaylistItemStatus} status The status object contains information about the playlist item&#39;s privacy status.
 */
/**
 * @typedef PlaylistItemContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} endAt The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the video.endTime is the end of the video.
 * @property {string} note A user-generated note for this item.
 * @property {string} startAt The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is 0.
 * @property {string} videoId The ID that YouTube uses to uniquely identify a video. To retrieve the video resource, set the id query parameter to this value in your API request.
 * @property {string} videoPublishedAt The date and time that the video was published to YouTube. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 */
/**
 * @typedef PlaylistItemListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).PlaylistItem[]} items A list of playlist items that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#playlistItemListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef PlaylistItemSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
 * @property {string} channelTitle Channel title for the channel that the playlist item belongs to.
 * @property {string} description The item&#39;s description.
 * @property {string} playlistId The ID that YouTube uses to uniquely identify the playlist that the playlist item is in.
 * @property {integer} position The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
 * @property {string} publishedAt The date and time that the item was added to the playlist. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ResourceId} resourceId The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The item&#39;s title.
 */
/**
 * @typedef PlaylistItemStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} privacyStatus This resource&#39;s privacy status.
 */
/**
 * @typedef PlaylistListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Playlist[]} items A list of playlists that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#playlistListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef PlaylistLocalization
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} description The localized strings for playlist&#39;s description.
 * @property {string} title The localized strings for playlist&#39;s title.
 */
/**
 * @typedef PlaylistPlayer
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} embedHtml An &lt;iframe&gt; tag that embeds a player that will play the playlist.
 */
/**
 * @typedef PlaylistSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel that published the playlist.
 * @property {string} channelTitle The channel title of the channel that the video belongs to.
 * @property {string} defaultLanguage The language of the playlist&#39;s default title and description.
 * @property {string} description The playlist&#39;s description.
 * @property {youtube(v3).PlaylistLocalization} localized Localized title and description, read-only.
 * @property {string} publishedAt The date and time that the playlist was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string[]} tags Keyword tags associated with the playlist.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The playlist&#39;s title.
 */
/**
 * @typedef PlaylistStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} privacyStatus The playlist&#39;s privacy status.
 */
/**
 * @typedef PromotedItem
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} customMessage A custom message to display for this promotion. This field is currently ignored unless the promoted item is a website.
 * @property {youtube(v3).PromotedItemId} id Identifies the promoted item.
 * @property {boolean} promotedByContentOwner If true, the content owner&#39;s name will be used when displaying the promotion. This field can only be set when the update is made on behalf of the content owner.
 * @property {youtube(v3).InvideoTiming} timing The temporal position within the video where the promoted item will be displayed. If present, it overrides the default timing.
 */
/**
 * @typedef PromotedItemId
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} recentlyUploadedBy If type is recentUpload, this field identifies the channel from which to take the recent upload. If missing, the channel is assumed to be the same channel for which the invideoPromotion is set.
 * @property {string} type Describes the type of the promoted item.
 * @property {string} videoId If the promoted item represents a video, this field represents the unique YouTube ID identifying it. This field will be present only if type has the value video.
 * @property {string} websiteUrl If the promoted item represents a website, this field represents the url pointing to the website. This field will be present only if type has the value website.
 */
/**
 * @typedef PropertyValue
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} property A property.
 * @property {string} value The property&#39;s value.
 */
/**
 * @typedef ResourceId
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel. This property is only present if the resourceId.kind value is youtube#channel.
 * @property {string} kind The type of the API resource.
 * @property {string} playlistId The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist. This property is only present if the resourceId.kind value is youtube#playlist.
 * @property {string} videoId The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video. This property is only present if the resourceId.kind value is youtube#video.
 */
/**
 * @typedef SearchListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).SearchResult[]} items A list of results that match the search criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#searchListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {string} regionCode 
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef SearchResult
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {youtube(v3).ResourceId} id The id object contains information that can be used to uniquely identify the resource that matches the search request.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#searchResult&quot;.
 * @property {youtube(v3).SearchResultSnippet} snippet The snippet object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video&#39;s title and the description will be the video&#39;s description.
 */
/**
 * @typedef SearchResultSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.
 * @property {string} channelTitle The title of the channel that published the resource that the search result identifies.
 * @property {string} description A description of the search result.
 * @property {string} liveBroadcastContent It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it&#39;s &quot;none&quot; if there is not any upcoming/active live broadcasts.
 * @property {string} publishedAt The creation date and time of the resource that the search result identifies. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The title of the search result.
 */
/**
 * @typedef Sponsor
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube assigns to uniquely identify the sponsor.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#sponsor&quot;.
 * @property {youtube(v3).SponsorSnippet} snippet The snippet object contains basic details about the sponsor.
 */
/**
 * @typedef SponsorListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Sponsor[]} items A list of sponsors that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#sponsorListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef SponsorSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The id of the channel being sponsored.
 * @property {youtube(v3).ChannelProfileDetails} sponsorDetails Details about the sponsor.
 * @property {string} sponsorSince The date and time when the user became a sponsor. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 */
/**
 * @typedef Subscription
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).SubscriptionContentDetails} contentDetails The contentDetails object contains basic statistics about the subscription.
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the subscription.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#subscription&quot;.
 * @property {youtube(v3).SubscriptionSnippet} snippet The snippet object contains basic details about the subscription, including its title and the channel that the user subscribed to.
 * @property {youtube(v3).SubscriptionSubscriberSnippet} subscriberSnippet The subscriberSnippet object contains basic details about the sbuscriber.
 */
/**
 * @typedef SubscriptionContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} activityType The type of activity this subscription is for (only uploads, everything).
 * @property {integer} newItemCount The number of new items in the subscription since its content was last read.
 * @property {integer} totalItemCount The approximate number of items that the subscription points to.
 */
/**
 * @typedef SubscriptionListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Subscription[]} items A list of subscriptions that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#subscriptionListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef SubscriptionSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The ID that YouTube uses to uniquely identify the subscriber&#39;s channel.
 * @property {string} channelTitle Channel title for the channel that the subscription belongs to.
 * @property {string} description The subscription&#39;s details.
 * @property {string} publishedAt The date and time that the subscription was created. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {youtube(v3).ResourceId} resourceId The id object contains information about the channel that the user subscribed to.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The subscription&#39;s title.
 */
/**
 * @typedef SubscriptionSubscriberSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} channelId The channel ID of the subscriber.
 * @property {string} description The description of the subscriber.
 * @property {youtube(v3).ThumbnailDetails} thumbnails Thumbnails for this subscriber.
 * @property {string} title The title of the subscriber.
 */
/**
 * @typedef Thumbnail
 * @memberOf! youtube(v3)
 * @type object
 * @property {integer} height (Optional) Height of the thumbnail image.
 * @property {string} url The thumbnail image&#39;s URL.
 * @property {integer} width (Optional) Width of the thumbnail image.
 */
/**
 * @typedef ThumbnailDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).Thumbnail} default The default image for this resource.
 * @property {youtube(v3).Thumbnail} high The high quality image for this resource.
 * @property {youtube(v3).Thumbnail} maxres The maximum resolution quality image for this resource.
 * @property {youtube(v3).Thumbnail} medium The medium quality image for this resource.
 * @property {youtube(v3).Thumbnail} standard The standard quality image for this resource.
 */
/**
 * @typedef ThumbnailSetResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).ThumbnailDetails[]} items A list of thumbnails.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#thumbnailSetResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef TokenPagination
 * @memberOf! youtube(v3)
 * @type object
 */
/**
 * @typedef Video
 * @memberOf! youtube(v3)
 * @type object
* @property {youtube(v3).VideoAgeGating} ageGating Age restriction details related to a video. This data can only be retrieved by the video owner.
* @property {youtube(v3).VideoContentDetails} contentDetails The contentDetails object contains information about the video content, including the length of the video and its aspect ratio.
* @property {string} etag Etag of this resource.
* @property {youtube(v3).VideoFileDetails} fileDetails The fileDetails object encapsulates information about the video file that was uploaded to YouTube, including the file&#39;s resolution, duration, audio and video codecs, stream bitrates, and more. This data can only be retrieved by the video owner.
* @property {string} id The ID that YouTube uses to uniquely identify the video.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#video&quot;.
* @property {youtube(v3).VideoLiveStreamingDetails} liveStreamingDetails The liveStreamingDetails object contains metadata about a live video broadcast. The object will only be present in a video resource if the video is an upcoming, live, or completed live broadcast.
* @property {object} localizations List with all localizations.
* @property {youtube(v3).VideoMonetizationDetails} monetizationDetails The monetizationDetails object encapsulates information about the monetization status of the video.
* @property {youtube(v3).VideoPlayer} player The player object contains information that you would use to play the video in an embedded player.
* @property {youtube(v3).VideoProcessingDetails} processingDetails The processingProgress object encapsulates information about YouTube&#39;s progress in processing the uploaded video file. The properties in the object identify the current processing status and an estimate of the time remaining until YouTube finishes processing the video. This part also indicates whether different types of data or content, such as file details or thumbnail images, are available for the video.

The processingProgress object is designed to be polled so that the video uploaded can track the progress that YouTube has made in processing the uploaded video file. This data can only be retrieved by the video owner.
* @property {youtube(v3).VideoProjectDetails} projectDetails The projectDetails object contains information about the project specific video metadata.
* @property {youtube(v3).VideoRecordingDetails} recordingDetails The recordingDetails object encapsulates information about the location, date and address where the video was recorded.
* @property {youtube(v3).VideoSnippet} snippet The snippet object contains basic details about the video, such as its title, description, and category.
* @property {youtube(v3).VideoStatistics} statistics The statistics object contains statistics about the video.
* @property {youtube(v3).VideoStatus} status The status object contains information about the video&#39;s uploading, processing, and privacy statuses.
* @property {youtube(v3).VideoSuggestions} suggestions The suggestions object encapsulates suggestions that identify opportunities to improve the video quality or the metadata for the uploaded video. This data can only be retrieved by the video owner.
* @property {youtube(v3).VideoTopicDetails} topicDetails The topicDetails object encapsulates information about Freebase topics associated with the video.
*/
/**
 * @typedef VideoAbuseReport
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} comments Additional comments regarding the abuse report.
 * @property {string} language The language that the content was viewed in.
 * @property {string} reasonId The high-level, or primary, reason that the content is abusive. The value is an abuse report reason ID.
 * @property {string} secondaryReasonId The specific, or secondary, reason that this content is abusive (if available). The value is an abuse report reason ID that is a valid secondary reason for the primary reason.
 * @property {string} videoId The ID that YouTube uses to uniquely identify the video.
 */
/**
 * @typedef VideoAbuseReportReason
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID of this abuse report reason.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoAbuseReportReason&quot;.
 * @property {youtube(v3).VideoAbuseReportReasonSnippet} snippet The snippet object contains basic details about the abuse report reason.
 */
/**
 * @typedef VideoAbuseReportReasonListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).VideoAbuseReportReason[]} items A list of valid abuse reasons that are used with video.ReportAbuse.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoAbuseReportReasonListResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef VideoAbuseReportReasonSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} label The localized label belonging to this abuse report reason.
 * @property {youtube(v3).VideoAbuseReportSecondaryReason[]} secondaryReasons The secondary reasons associated with this reason, if any are available. (There might be 0 or more.)
 */
/**
 * @typedef VideoAbuseReportSecondaryReason
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} id The ID of this abuse report secondary reason.
 * @property {string} label The localized label for this abuse report secondary reason.
 */
/**
 * @typedef VideoAgeGating
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} alcoholContent Indicates whether or not the video has alcoholic beverage content. Only users of legal purchasing age in a particular country, as identified by ICAP, can view the content.
 * @property {boolean} restricted Age-restricted trailers. For redband trailers and adult-rated video-games. Only users aged 18+ can view the content. The the field is true the content is restricted to viewers aged 18+. Otherwise The field won&#39;t be present.
 * @property {string} videoGameRating Video game rating, if any.
 */
/**
 * @typedef VideoCategory
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} id The ID that YouTube uses to uniquely identify the video category.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoCategory&quot;.
 * @property {youtube(v3).VideoCategorySnippet} snippet The snippet object contains basic details about the video category, including its title.
 */
/**
 * @typedef VideoCategoryListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).VideoCategory[]} items A list of video categories that can be associated with YouTube videos. In this map, the video category ID is the map key, and its value is the corresponding videoCategory resource.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoCategoryListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef VideoCategorySnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} assignable 
 * @property {string} channelId The YouTube channel that created the video category.
 * @property {string} title The video category&#39;s title.
 */
/**
 * @typedef VideoContentDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} caption The value of captions indicates whether the video has captions or not.
 * @property {youtube(v3).ContentRating} contentRating Specifies the ratings that the video received under various rating schemes.
 * @property {youtube(v3).AccessPolicy} countryRestriction The countryRestriction object contains information about the countries where a video is (or is not) viewable.
 * @property {string} definition The value of definition indicates whether the video is available in high definition or only in standard definition.
 * @property {string} dimension The value of dimension indicates whether the video is available in 3D or in 2D.
 * @property {string} duration The length of the video. The tag value is an ISO 8601 duration in the format PT#M#S, in which the letters PT indicate that the value specifies a period of time, and the letters M and S refer to length in minutes and seconds, respectively. The # characters preceding the M and S letters are both integers that specify the number of minutes (or seconds) of the video. For example, a value of PT15M51S indicates that the video is 15 minutes and 51 seconds long.
 * @property {boolean} hasCustomThumbnail Indicates whether the video uploader has provided a custom thumbnail image for the video. This property is only visible to the video uploader.
 * @property {boolean} licensedContent The value of is_license_content indicates whether the video is licensed content.
 * @property {string} projection Specifies the projection format of the video.
 * @property {youtube(v3).VideoContentDetailsRegionRestriction} regionRestriction The regionRestriction object contains information about the countries where a video is (or is not) viewable. The object will contain either the contentDetails.regionRestriction.allowed property or the contentDetails.regionRestriction.blocked property.
 */
/**
 * @typedef VideoContentDetailsRegionRestriction
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} allowed A list of region codes that identify countries where the video is viewable. If this property is present and a country is not listed in its value, then the video is blocked from appearing in that country. If this property is present and contains an empty list, the video is blocked in all countries.
 * @property {string[]} blocked A list of region codes that identify countries where the video is blocked. If this property is present and a country is not listed in its value, then the video is viewable in that country. If this property is present and contains an empty list, the video is viewable in all countries.
 */
/**
 * @typedef VideoFileDetails
 * @memberOf! youtube(v3)
 * @type object
* @property {youtube(v3).VideoFileDetailsAudioStream[]} audioStreams A list of audio streams contained in the uploaded video file. Each item in the list contains detailed metadata about an audio stream.
* @property {string} bitrateBps The uploaded video file&#39;s combined (video and audio) bitrate in bits per second.
* @property {string} container The uploaded video file&#39;s container format.
* @property {string} creationTime The date and time when the uploaded video file was created. The value is specified in ISO 8601 format. Currently, the following ISO 8601 formats are supported:  
- Date only: YYYY-MM-DD 
- Naive time: YYYY-MM-DDTHH:MM:SS 
- Time with timezone: YYYY-MM-DDTHH:MM:SS+HH:MM
* @property {string} durationMs The length of the uploaded video in milliseconds.
* @property {string} fileName The uploaded file&#39;s name. This field is present whether a video file or another type of file was uploaded.
* @property {string} fileSize The uploaded file&#39;s size in bytes. This field is present whether a video file or another type of file was uploaded.
* @property {string} fileType The uploaded file&#39;s type as detected by YouTube&#39;s video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.
* @property {youtube(v3).VideoFileDetailsVideoStream[]} videoStreams A list of video streams contained in the uploaded video file. Each item in the list contains detailed metadata about a video stream.
*/
/**
 * @typedef VideoFileDetailsAudioStream
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} bitrateBps The audio stream&#39;s bitrate, in bits per second.
 * @property {integer} channelCount The number of audio channels that the stream contains.
 * @property {string} codec The audio codec that the stream uses.
 * @property {string} vendor A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
 */
/**
 * @typedef VideoFileDetailsVideoStream
 * @memberOf! youtube(v3)
 * @type object
 * @property {number} aspectRatio The video content&#39;s display aspect ratio, which specifies the aspect ratio in which the video should be displayed.
 * @property {string} bitrateBps The video stream&#39;s bitrate, in bits per second.
 * @property {string} codec The video codec that the stream uses.
 * @property {number} frameRateFps The video stream&#39;s frame rate, in frames per second.
 * @property {integer} heightPixels The encoded video content&#39;s height in pixels.
 * @property {string} rotation The amount that YouTube needs to rotate the original source content to properly display the video.
 * @property {string} vendor A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.
 * @property {integer} widthPixels The encoded video content&#39;s width in pixels. You can calculate the video&#39;s encoding aspect ratio as width_pixels / height_pixels.
 */
/**
 * @typedef VideoGetRatingResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).VideoRating[]} items A list of ratings that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoGetRatingResponse&quot;.
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef VideoListResponse
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} etag Etag of this resource.
 * @property {string} eventId Serialized EventId of the request which produced this response.
 * @property {youtube(v3).Video[]} items A list of videos that match the request criteria.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;youtube#videoListResponse&quot;.
 * @property {string} nextPageToken The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
 * @property {youtube(v3).PageInfo} pageInfo 
 * @property {string} prevPageToken The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
 * @property {youtube(v3).TokenPagination} tokenPagination 
 * @property {string} visitorId The visitorId identifies the visitor.
 */
/**
 * @typedef VideoLiveStreamingDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} activeLiveChatId The ID of the currently active live chat attached to this video. This field is filled only if the video is a currently live broadcast that has live chat. Once the broadcast transitions to complete this field will be removed and the live chat closed down. For persistent broadcasts that live chat id will no longer be tied to this video but rather to the new video being displayed at the persistent page.
 * @property {string} actualEndTime The time that the broadcast actually ended. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format. This value will not be available until the broadcast is over.
 * @property {string} actualStartTime The time that the broadcast actually started. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format. This value will not be available until the broadcast begins.
 * @property {string} concurrentViewers The number of viewers currently watching the broadcast. The property and its value will be present if the broadcast has current viewers and the broadcast owner has not hidden the viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers for a broadcast when the broadcast ends. So, this property would not identify the number of viewers watching an archived video of a live broadcast that already ended.
 * @property {string} scheduledEndTime The time that the broadcast is scheduled to end. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format. If the value is empty or the property is not present, then the broadcast is scheduled to continue indefinitely.
 * @property {string} scheduledStartTime The time that the broadcast is scheduled to begin. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 */
/**
 * @typedef VideoLocalization
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} description Localized version of the video&#39;s description.
 * @property {string} title Localized version of the video&#39;s title.
 */
/**
 * @typedef VideoMonetizationDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).AccessPolicy} access The value of access indicates whether the video can be monetized or not.
 */
/**
 * @typedef VideoPlayer
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} embedHeight 
 * @property {string} embedHtml An &lt;iframe&gt; tag that embeds a player that will play the video.
 * @property {string} embedWidth The embed width
 */
/**
 * @typedef VideoProcessingDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} editorSuggestionsAvailability This value indicates whether video editing suggestions, which might improve video quality or the playback experience, are available for the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
 * @property {string} fileDetailsAvailability This value indicates whether file details are available for the uploaded video. You can retrieve a video&#39;s file details by requesting the fileDetails part in your videos.list() request.
 * @property {string} processingFailureReason The reason that YouTube failed to process the video. This property will only have a value if the processingStatus property&#39;s value is failed.
 * @property {string} processingIssuesAvailability This value indicates whether the video processing engine has generated suggestions that might improve YouTube&#39;s ability to process the the video, warnings that explain video processing problems, or errors that cause video processing problems. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
 * @property {youtube(v3).VideoProcessingDetailsProcessingProgress} processingProgress The processingProgress object contains information about the progress YouTube has made in processing the video. The values are really only relevant if the video&#39;s processing status is processing.
 * @property {string} processingStatus The video&#39;s processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.
 * @property {string} tagSuggestionsAvailability This value indicates whether keyword (tag) suggestions are available for the video. Tags can be added to a video&#39;s metadata to make it easier for other users to find the video. You can retrieve these suggestions by requesting the suggestions part in your videos.list() request.
 * @property {string} thumbnailsAvailability This value indicates whether thumbnail images have been generated for the video.
 */
/**
 * @typedef VideoProcessingDetailsProcessingProgress
 * @memberOf! youtube(v3)
 * @type object
* @property {string} partsProcessed The number of parts of the video that YouTube has already processed. You can estimate the percentage of the video that YouTube has already processed by calculating:
100 * parts_processed / parts_total

Note that since the estimated number of parts could increase without a corresponding increase in the number of parts that have already been processed, it is possible that the calculated progress could periodically decrease while YouTube processes a video.
* @property {string} partsTotal An estimate of the total number of parts that need to be processed for the video. The number may be updated with more precise estimates while YouTube processes the video.
* @property {string} timeLeftMs An estimate of the amount of time, in millseconds, that YouTube needs to finish processing the video.
*/
/**
 * @typedef VideoProjectDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} tags A list of project tags associated with the video during the upload.
 */
/**
 * @typedef VideoRating
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} rating 
 * @property {string} videoId 
 */
/**
 * @typedef VideoRecordingDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {youtube(v3).GeoPoint} location The geolocation information associated with the video.
 * @property {string} locationDescription The text description of the location where the video was recorded.
 * @property {string} recordingDate The date and time when the video was recorded. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sssZ) format.
 */
/**
 * @typedef VideoSnippet
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} categoryId The YouTube video category associated with the video.
 * @property {string} channelId The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
 * @property {string} channelTitle Channel title for the channel that the video belongs to.
 * @property {string} defaultAudioLanguage The default_audio_language property specifies the language spoken in the video&#39;s default audio track.
 * @property {string} defaultLanguage The language of the videos&#39;s default snippet.
 * @property {string} description The video&#39;s description.
 * @property {string} liveBroadcastContent Indicates if the video is an upcoming/active live broadcast. Or it&#39;s &quot;none&quot; if the video is not an upcoming/active live broadcast.
 * @property {youtube(v3).VideoLocalization} localized Localized snippet selected with the hl parameter. If no such localization exists, this field is populated with the default snippet. (Read-only)
 * @property {string} publishedAt The date and time that the video was uploaded. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string[]} tags A list of keyword tags associated with the video. Tags may contain spaces.
 * @property {youtube(v3).ThumbnailDetails} thumbnails A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
 * @property {string} title The video&#39;s title.
 */
/**
 * @typedef VideoStatistics
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} commentCount The number of comments for the video.
 * @property {string} dislikeCount The number of users who have indicated that they disliked the video by giving it a negative rating.
 * @property {string} favoriteCount The number of users who currently have the video marked as a favorite video.
 * @property {string} likeCount The number of users who have indicated that they liked the video by giving it a positive rating.
 * @property {string} viewCount The number of times the video has been viewed.
 */
/**
 * @typedef VideoStatus
 * @memberOf! youtube(v3)
 * @type object
 * @property {boolean} embeddable This value indicates if the video can be embedded on another website.
 * @property {string} failureReason This value explains why a video failed to upload. This property is only present if the uploadStatus property indicates that the upload failed.
 * @property {string} license The video&#39;s license.
 * @property {string} privacyStatus The video&#39;s privacy status.
 * @property {boolean} publicStatsViewable This value indicates if the extended video statistics on the watch page can be viewed by everyone. Note that the view count, likes, etc will still be visible if this is disabled.
 * @property {string} publishAt The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
 * @property {string} rejectionReason This value explains why YouTube rejected an uploaded video. This property is only present if the uploadStatus property indicates that the upload was rejected.
 * @property {string} uploadStatus The status of the uploaded video.
 */
/**
 * @typedef VideoSuggestions
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} editorSuggestions A list of video editing operations that might improve the video quality or playback experience of the uploaded video.
 * @property {string[]} processingErrors A list of errors that will prevent YouTube from successfully processing the uploaded video video. These errors indicate that, regardless of the video&#39;s current processing status, eventually, that status will almost certainly be failed.
 * @property {string[]} processingHints A list of suggestions that may improve YouTube&#39;s ability to process the video.
 * @property {string[]} processingWarnings A list of reasons why YouTube may have difficulty transcoding the uploaded video or that might result in an erroneous transcoding. These warnings are generated before YouTube actually processes the uploaded video file. In addition, they identify issues that are unlikely to cause the video processing to fail but that might cause problems such as sync issues, video artifacts, or a missing audio track.
 * @property {youtube(v3).VideoSuggestionsTagSuggestion[]} tagSuggestions A list of keyword tags that could be added to the video&#39;s metadata to increase the likelihood that users will locate your video when searching or browsing on YouTube.
 */
/**
 * @typedef VideoSuggestionsTagSuggestion
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} categoryRestricts A set of video categories for which the tag is relevant. You can use this information to display appropriate tag suggestions based on the video category that the video uploader associates with the video. By default, tag suggestions are relevant for all categories if there are no restricts defined for the keyword.
 * @property {string} tag The keyword tag suggested for the video.
 */
/**
 * @typedef VideoTopicDetails
 * @memberOf! youtube(v3)
 * @type object
 * @property {string[]} relevantTopicIds Similar to topic_id, except that these topics are merely relevant to the video. These are topics that may be mentioned in, or appear in the video. You can retrieve information about each topic using Freebase Topic API.
 * @property {string[]} topicIds A list of Freebase topic IDs that are centrally associated with the video. These are topics that are centrally featured in the video, and it can be said that the video is mainly about each of these. You can retrieve information about each topic using the Freebase Topic API.
 */
/**
 * @typedef WatchSettings
 * @memberOf! youtube(v3)
 * @type object
 * @property {string} backgroundColor The text color for the video watch page&#39;s branded area.
 * @property {string} featuredPlaylistId An ID that uniquely identifies a playlist that displays next to the video player.
 * @property {string} textColor The background color for the video watch page&#39;s branded area.
 */
module.exports = Youtube;
