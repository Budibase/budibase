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
 * Google Play Game Services Publishing API
 *
 * The Publishing API for Google Play Game Services.
 *
 * @example
 * var google = require('googleapis');
 * var gamesConfiguration = google.gamesConfiguration('v1configuration');
 *
 * @namespace gamesConfiguration
 * @type {Function}
 * @version v1configuration
 * @variation v1configuration
 * @param {object=} options Options for Gamesconfiguration
 */
function Gamesconfiguration(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.achievementConfigurations = {

    /**
     * gamesConfiguration.achievementConfigurations.delete
     *
     * @desc Delete the achievement configuration with the given ID.
     *
     * @alias gamesConfiguration.achievementConfigurations.delete
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
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
          url: 'https://www.googleapis.com/games/v1configuration/achievements/{achievementId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.achievementConfigurations.get
     *
     * @desc Retrieves the metadata of the achievement configuration with the given ID.
     *
     * @alias gamesConfiguration.achievementConfigurations.get
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
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
          url: 'https://www.googleapis.com/games/v1configuration/achievements/{achievementId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.achievementConfigurations.insert
     *
     * @desc Insert a new achievement configuration in this application.
     *
     * @alias gamesConfiguration.achievementConfigurations.insert
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {gamesConfiguration(v1configuration).AchievementConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/applications/{applicationId}/achievements',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.achievementConfigurations.list
     *
     * @desc Returns a list of the achievement configurations in this application.
     *
     * @alias gamesConfiguration.achievementConfigurations.list
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {integer=} params.maxResults The maximum number of resource configurations to return in the response, used for paging. For any response, the actual number of resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/games/v1configuration/applications/{applicationId}/achievements',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.achievementConfigurations.patch
     *
     * @desc Update the metadata of the achievement configuration with the given ID. This method supports patch semantics.
     *
     * @alias gamesConfiguration.achievementConfigurations.patch
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {gamesConfiguration(v1configuration).AchievementConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/achievements/{achievementId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.achievementConfigurations.update
     *
     * @desc Update the metadata of the achievement configuration with the given ID.
     *
     * @alias gamesConfiguration.achievementConfigurations.update
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {gamesConfiguration(v1configuration).AchievementConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/achievements/{achievementId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.imageConfigurations = {

    /**
     * gamesConfiguration.imageConfigurations.upload
     *
     * @desc Uploads an image for a resource with the given ID and image type.
     *
     * @alias gamesConfiguration.imageConfigurations.upload
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.imageType Selects which image in a resource for this method.
     * @param {string} params.resourceId The ID of the resource used by this method.
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    upload: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1configuration/images/{resourceId}/imageType/{imageType}',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/games/v1configuration/images/{resourceId}/imageType/{imageType}',
        requiredParams: ['resourceId', 'imageType'],
        pathParams: ['imageType', 'resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.leaderboardConfigurations = {

    /**
     * gamesConfiguration.leaderboardConfigurations.delete
     *
     * @desc Delete the leaderboard configuration with the given ID.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.delete
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
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
          url: 'https://www.googleapis.com/games/v1configuration/leaderboards/{leaderboardId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.leaderboardConfigurations.get
     *
     * @desc Retrieves the metadata of the leaderboard configuration with the given ID.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.get
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
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
          url: 'https://www.googleapis.com/games/v1configuration/leaderboards/{leaderboardId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.leaderboardConfigurations.insert
     *
     * @desc Insert a new leaderboard configuration in this application.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.insert
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {gamesConfiguration(v1configuration).LeaderboardConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/applications/{applicationId}/leaderboards',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.leaderboardConfigurations.list
     *
     * @desc Returns a list of the leaderboard configurations in this application.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.list
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {integer=} params.maxResults The maximum number of resource configurations to return in the response, used for paging. For any response, the actual number of resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
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
          url: 'https://www.googleapis.com/games/v1configuration/applications/{applicationId}/leaderboards',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.leaderboardConfigurations.patch
     *
     * @desc Update the metadata of the leaderboard configuration with the given ID. This method supports patch semantics.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.patch
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {gamesConfiguration(v1configuration).LeaderboardConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/leaderboards/{leaderboardId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesConfiguration.leaderboardConfigurations.update
     *
     * @desc Update the metadata of the leaderboard configuration with the given ID.
     *
     * @alias gamesConfiguration.leaderboardConfigurations.update
     * @memberOf! gamesConfiguration(v1configuration)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {gamesConfiguration(v1configuration).LeaderboardConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1configuration/leaderboards/{leaderboardId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AchievementConfiguration
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
* @property {string} achievementType The type of the achievement.
Possible values are:  
- &quot;STANDARD&quot; - Achievement is either locked or unlocked. 
- &quot;INCREMENTAL&quot; - Achievement is incremental.
* @property {gamesConfiguration(v1configuration).AchievementConfigurationDetail} draft The draft data of the achievement.
* @property {string} id The ID of the achievement.
* @property {string} initialState The initial state of the achievement.
Possible values are:  
- &quot;HIDDEN&quot; - Achievement is hidden. 
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#achievementConfiguration.
* @property {gamesConfiguration(v1configuration).AchievementConfigurationDetail} published The read-only published data of the achievement.
* @property {integer} stepsToUnlock Steps to unlock. Only applicable to incremental achievements.
* @property {string} token The token for this resource.
*/
/**
 * @typedef AchievementConfigurationDetail
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} description Localized strings for the achievement description.
 * @property {string} iconUrl The icon url of this achievement. Writes to this field are ignored.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#achievementConfigurationDetail.
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} name Localized strings for the achievement name.
 * @property {integer} pointValue Point value for the achievement.
 * @property {integer} sortRank The sort rank of this achievement. Writes to this field are ignored.
 */
/**
 * @typedef AchievementConfigurationListResponse
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {gamesConfiguration(v1configuration).AchievementConfiguration[]} items The achievement configurations.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementConfigurationListResponse.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef GamesNumberAffixConfiguration
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} few When the language requires special treatment of &quot;small&quot; numbers (as with 2, 3, and 4 in Czech; or numbers ending 2, 3, or 4 but not 12, 13, or 14 in Polish).
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} many When the language requires special treatment of &quot;large&quot; numbers (as with numbers ending 11-99 in Maltese).
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} one When the language requires special treatment of numbers like one (as with the number 1 in English and most other languages; in Russian, any number ending in 1 but not ending in 11 is in this class).
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} other When the language does not require special treatment of the given quantity (as with all numbers in Chinese, or 42 in English).
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} two When the language requires special treatment of numbers like two (as with 2 in Welsh, or 102 in Slovenian).
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} zero When the language requires special treatment of the number 0 (as in Arabic).
 */
/**
 * @typedef GamesNumberFormatConfiguration
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
* @property {string} currencyCode The curreny code string. Only used for CURRENCY format type.
* @property {integer} numDecimalPlaces The number of decimal places for number. Only used for NUMERIC format type.
* @property {string} numberFormatType The formatting for the number.
Possible values are:  
- &quot;NUMERIC&quot; - Numbers are formatted to have no digits or a fixed number of digits after the decimal point according to locale. An optional custom unit can be added.
- &quot;TIME_DURATION&quot; - Numbers are formatted to hours, minutes and seconds.
- &quot;CURRENCY&quot; - Numbers are formatted to currency according to locale.
* @property {gamesConfiguration(v1configuration).GamesNumberAffixConfiguration} suffix An optional suffix for the NUMERIC format type. These strings follow the same  plural rules as all Android string resources.
*/
/**
 * @typedef ImageConfiguration
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {string} imageType The image type for the image.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#imageConfiguration.
 * @property {string} resourceId The resource ID of resource which the image belongs to.
 * @property {string} url The url for this image.
 */
/**
 * @typedef LeaderboardConfiguration
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
* @property {gamesConfiguration(v1configuration).LeaderboardConfigurationDetail} draft The draft data of the leaderboard.
* @property {string} id The ID of the leaderboard.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#leaderboardConfiguration.
* @property {gamesConfiguration(v1configuration).LeaderboardConfigurationDetail} published The read-only published data of the leaderboard.
* @property {string} scoreMax Maximum score that can be posted to this leaderboard.
* @property {string} scoreMin Minimum score that can be posted to this leaderboard.
* @property {string} scoreOrder The type of the leaderboard.
Possible values are:  
- &quot;LARGER_IS_BETTER&quot; - Larger scores posted are ranked higher. 
- &quot;SMALLER_IS_BETTER&quot; - Smaller scores posted are ranked higher.
* @property {string} token The token for this resource.
*/
/**
 * @typedef LeaderboardConfigurationDetail
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {string} iconUrl The icon url of this leaderboard. Writes to this field are ignored.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#leaderboardConfigurationDetail.
 * @property {gamesConfiguration(v1configuration).LocalizedStringBundle} name Localized strings for the leaderboard name.
 * @property {gamesConfiguration(v1configuration).GamesNumberFormatConfiguration} scoreFormat The score formatting for the leaderboard.
 * @property {integer} sortRank The sort rank of this leaderboard. Writes to this field are ignored.
 */
/**
 * @typedef LeaderboardConfigurationListResponse
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {gamesConfiguration(v1configuration).LeaderboardConfiguration[]} items The leaderboard configurations.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboardConfigurationListResponse.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef LocalizedString
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#localizedString.
 * @property {string} locale The locale string.
 * @property {string} value The string value.
 */
/**
 * @typedef LocalizedStringBundle
 * @memberOf! gamesConfiguration(v1configuration)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesConfiguration#localizedStringBundle.
 * @property {gamesConfiguration(v1configuration).LocalizedString[]} translations The locale strings.
 */
module.exports = Gamesconfiguration;
