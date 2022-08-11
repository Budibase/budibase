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
 * Google Play Game Services API
 *
 * The API for Google Play Game Services.
 *
 * @example
 * var google = require('googleapis');
 * var games = google.games('v1');
 *
 * @namespace games
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Games
 */
function Games(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.achievementDefinitions = {

    /**
     * games.achievementDefinitions.list
     *
     * @desc Lists all the achievement definitions for your application.
     *
     * @alias games.achievementDefinitions.list
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of achievement resources to return in the response, used for paging. For any response, the actual number of achievement resources returned may be less than the specified maxResults.
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
          url: 'https://www.googleapis.com/games/v1/achievements',
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

  self.achievements = {

    /**
     * games.achievements.increment
     *
     * @desc Increments the steps of the achievement with the given ID for the currently authenticated player.
     *
     * @alias games.achievements.increment
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.requestId A randomly generated numeric ID for each request specified by the caller. This number is used at the server to ensure that the request is handled correctly across retries.
     * @param {integer} params.stepsToIncrement The number of steps to increment.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    increment: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/achievements/{achievementId}/increment',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['achievementId', 'stepsToIncrement'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.achievements.list
     *
     * @desc Lists the progress for all your application's achievements for the currently authenticated player.
     *
     * @alias games.achievements.list
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of achievement resources to return in the response, used for paging. For any response, the actual number of achievement resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
     * @param {string=} params.state Tells the server to return only achievements with the specified state. If this parameter isn't specified, all achievements are returned.
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
          url: 'https://www.googleapis.com/games/v1/players/{playerId}/achievements',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId'],
        pathParams: ['playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.achievements.reveal
     *
     * @desc Sets the state of the achievement with the given ID to REVEALED for the currently authenticated player.
     *
     * @alias games.achievements.reveal
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reveal: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/achievements/{achievementId}/reveal',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.achievements.setStepsAtLeast
     *
     * @desc Sets the steps for the currently authenticated player towards unlocking an achievement. If the steps parameter is less than the current number of steps that the player already gained for the achievement, the achievement is not modified.
     *
     * @alias games.achievements.setStepsAtLeast
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {integer} params.steps The minimum value to set the steps to.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setStepsAtLeast: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/achievements/{achievementId}/setStepsAtLeast',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['achievementId', 'steps'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.achievements.unlock
     *
     * @desc Unlocks this achievement for the currently authenticated player.
     *
     * @alias games.achievements.unlock
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    unlock: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/achievements/{achievementId}/unlock',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['achievementId'],
        pathParams: ['achievementId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.achievements.updateMultiple
     *
     * @desc Updates multiple achievements for the currently authenticated player.
     *
     * @alias games.achievements.updateMultiple
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {games(v1).AchievementUpdateMultipleRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    updateMultiple: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/achievements/updateMultiple',
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

  self.applications = {

    /**
     * games.applications.get
     *
     * @desc Retrieves the metadata of the application with the given ID. If the requested application is not available for the specified platformType, the returned response will not include any instance data.
     *
     * @alias games.applications.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string=} params.platformType Restrict application details returned to the specific platform.
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
          url: 'https://www.googleapis.com/games/v1/applications/{applicationId}',
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
     * games.applications.played
     *
     * @desc Indicate that the the currently authenticated user is playing your application.
     *
     * @alias games.applications.played
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    played: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/applications/played',
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
     * games.applications.verify
     *
     * @desc Verifies the auth token provided with this request is for the application with the specified ID, and returns the ID of the player it was granted for.
     *
     * @alias games.applications.verify
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    verify: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/applications/{applicationId}/verify',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['applicationId'],
        pathParams: ['applicationId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.events = {

    /**
     * games.events.listByPlayer
     *
     * @desc Returns a list showing the current progress on events in this application for the currently authenticated user.
     *
     * @alias games.events.listByPlayer
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of events to return in the response, used for paging. For any response, the actual number of events to return may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listByPlayer: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/events',
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
     * games.events.listDefinitions
     *
     * @desc Returns a list of the event definitions in this application.
     *
     * @alias games.events.listDefinitions
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of event definitions to return in the response, used for paging. For any response, the actual number of event definitions to return may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listDefinitions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/eventDefinitions',
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
     * games.events.record
     *
     * @desc Records a batch of changes to the number of times events have occurred for the currently authenticated user of this application.
     *
     * @alias games.events.record
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {games(v1).EventRecordRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    record: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/events',
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

  self.leaderboards = {

    /**
     * games.leaderboards.get
     *
     * @desc Retrieves the metadata of the leaderboard with the given ID.
     *
     * @alias games.leaderboards.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
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
          url: 'https://www.googleapis.com/games/v1/leaderboards/{leaderboardId}',
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
     * games.leaderboards.list
     *
     * @desc Lists all the leaderboard metadata for your application.
     *
     * @alias games.leaderboards.list
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of leaderboards to return in the response. For any response, the actual number of leaderboards returned may be less than the specified maxResults.
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
          url: 'https://www.googleapis.com/games/v1/leaderboards',
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

  self.metagame = {

    /**
     * games.metagame.getMetagameConfig
     *
     * @desc Return the metagame configuration data for the calling application.
     *
     * @alias games.metagame.getMetagameConfig
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getMetagameConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/metagameConfig',
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
     * games.metagame.listCategoriesByPlayer
     *
     * @desc List play data aggregated per category for the player corresponding to playerId.
     *
     * @alias games.metagame.listCategoriesByPlayer
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection The collection of categories for which data will be returned.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of category resources to return in the response, used for paging. For any response, the actual number of category resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listCategoriesByPlayer: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/players/{playerId}/categories/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId', 'collection'],
        pathParams: ['collection', 'playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.players = {

    /**
     * games.players.get
     *
     * @desc Retrieves the Player resource with the given ID. To retrieve the player for the currently authenticated user, set playerId to me.
     *
     * @alias games.players.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
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
          url: 'https://www.googleapis.com/games/v1/players/{playerId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId'],
        pathParams: ['playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.players.list
     *
     * @desc Get the collection of players for the currently authenticated user.
     *
     * @alias games.players.list
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection Collection of players being retrieved
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of player resources to return in the response, used for paging. For any response, the actual number of player resources returned may be less than the specified maxResults.
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
          url: 'https://www.googleapis.com/games/v1/players/me/players/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['collection'],
        pathParams: ['collection'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.pushtokens = {

    /**
     * games.pushtokens.remove
     *
     * @desc Removes a push token for the current user and application. Removing a non-existent push token will report success.
     *
     * @alias games.pushtokens.remove
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {games(v1).PushTokenId} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1/pushtokens/remove',
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
     * games.pushtokens.update
     *
     * @desc Registers a push token for the current user and application.
     *
     * @alias games.pushtokens.update
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {games(v1).PushToken} params.resource Request body data
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
          url: 'https://www.googleapis.com/games/v1/pushtokens',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.questMilestones = {

    /**
     * games.questMilestones.claim
     *
     * @desc Report that a reward for the milestone corresponding to milestoneId for the quest corresponding to questId has been claimed by the currently authorized user.
     *
     * @alias games.questMilestones.claim
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string} params.milestoneId The ID of the milestone.
     * @param {string} params.questId The ID of the quest.
     * @param {string} params.requestId A numeric ID to ensure that the request is handled correctly across retries. Your client application must generate this ID randomly.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    claim: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/quests/{questId}/milestones/{milestoneId}/claim',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['questId', 'milestoneId', 'requestId'],
        pathParams: ['milestoneId', 'questId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.quests = {

    /**
     * games.quests.accept
     *
     * @desc Indicates that the currently authorized user will participate in the quest.
     *
     * @alias games.quests.accept
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.questId The ID of the quest.
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
          url: 'https://www.googleapis.com/games/v1/quests/{questId}/accept',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['questId'],
        pathParams: ['questId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.quests.list
     *
     * @desc Get a list of quests for your application and the currently authenticated player.
     *
     * @alias games.quests.list
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of quest resources to return in the response, used for paging. For any response, the actual number of quest resources returned may be less than the specified maxResults. Acceptable values are 1 to 50, inclusive. (Default: 50).
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
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
          url: 'https://www.googleapis.com/games/v1/players/{playerId}/quests',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId'],
        pathParams: ['playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.revisions = {

    /**
     * games.revisions.check
     *
     * @desc Checks whether the games client is out of date.
     *
     * @alias games.revisions.check
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.clientRevision The revision of the client SDK used by your application. Format: [PLATFORM_TYPE]:[VERSION_NUMBER]. Possible values of PLATFORM_TYPE are:   - "ANDROID" - Client is running the Android SDK.  - "IOS" - Client is running the iOS SDK.  - "WEB_APP" - Client is running as a Web App.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    check: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/revisions/check',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['clientRevision'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.rooms = {

    /**
     * games.rooms.create
     *
     * @desc Create a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.create
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {games(v1).RoomCreateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    create: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/rooms/create',
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
     * games.rooms.decline
     *
     * @desc Decline an invitation to join a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.decline
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.roomId The ID of the room.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    decline: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}/decline',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.rooms.dismiss
     *
     * @desc Dismiss an invitation to join a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.dismiss
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string} params.roomId The ID of the room.
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
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}/dismiss',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.rooms.get
     *
     * @desc Get the data for a room.
     *
     * @alias games.rooms.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.roomId The ID of the room.
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
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.rooms.join
     *
     * @desc Join a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.join
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.roomId The ID of the room.
     * @param {games(v1).RoomJoinRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    join: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}/join',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.rooms.leave
     *
     * @desc Leave a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.leave
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.roomId The ID of the room.
     * @param {games(v1).RoomLeaveRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    leave: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}/leave',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.rooms.list
     *
     * @desc Returns invitations to join rooms.
     *
     * @alias games.rooms.list
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of rooms to return in the response, used for paging. For any response, the actual number of rooms to return may be less than the specified maxResults.
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
          url: 'https://www.googleapis.com/games/v1/rooms',
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
     * games.rooms.reportStatus
     *
     * @desc Updates sent by a client reporting the status of peers in a room. For internal use by the Games SDK only. Calling this method directly is unsupported.
     *
     * @alias games.rooms.reportStatus
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.roomId The ID of the room.
     * @param {games(v1).RoomP2PStatuses} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reportStatus: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/rooms/{roomId}/reportstatus',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['roomId'],
        pathParams: ['roomId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.scores = {

    /**
     * games.scores.get
     *
     * @desc Get high scores, and optionally ranks, in leaderboards for the currently authenticated player. For a specific time span, leaderboardId can be set to ALL to retrieve data for all leaderboards in a given time span. NOTE: You cannot ask for 'ALL' leaderboards and 'ALL' timeSpans in the same request; only one parameter may be set to 'ALL'.
     *
     * @alias games.scores.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.includeRankType The types of ranks to return. If the parameter is omitted, no ranks will be returned.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.leaderboardId The ID of the leaderboard. Can be set to 'ALL' to retrieve data for all leaderboards for this application.
     * @param {integer=} params.maxResults The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
     * @param {string} params.timeSpan The time span for the scores and ranks you're requesting.
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
          url: 'https://www.googleapis.com/games/v1/players/{playerId}/leaderboards/{leaderboardId}/scores/{timeSpan}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId', 'leaderboardId', 'timeSpan'],
        pathParams: ['leaderboardId', 'playerId', 'timeSpan'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.scores.list
     *
     * @desc Lists the scores in a leaderboard, starting from the top.
     *
     * @alias games.scores.list
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection The collection of scores you're requesting.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {integer=} params.maxResults The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.timeSpan The time span for the scores and ranks you're requesting.
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
          url: 'https://www.googleapis.com/games/v1/leaderboards/{leaderboardId}/scores/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['leaderboardId', 'collection', 'timeSpan'],
        pathParams: ['collection', 'leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.scores.listWindow
     *
     * @desc Lists the scores in a leaderboard around (and including) a player's score.
     *
     * @alias games.scores.listWindow
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.collection The collection of scores you're requesting.
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {integer=} params.maxResults The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {integer=} params.resultsAbove The preferred number of scores to return above the player's score. More scores may be returned if the player is at the bottom of the leaderboard; fewer may be returned if the player is at the top. Must be less than or equal to maxResults.
     * @param {boolean=} params.returnTopIfAbsent True if the top scores should be returned when the player is not in the leaderboard. Defaults to true.
     * @param {string} params.timeSpan The time span for the scores and ranks you're requesting.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listWindow: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/leaderboards/{leaderboardId}/window/{collection}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['leaderboardId', 'collection', 'timeSpan'],
        pathParams: ['collection', 'leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.scores.submit
     *
     * @desc Submits a score to the specified leaderboard.
     *
     * @alias games.scores.submit
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {string} params.score The score you're submitting. The submitted score is ignored if it is worse than a previously submitted score, where worse depends on the leaderboard sort order. The meaning of the score value depends on the leaderboard format type. For fixed-point, the score represents the raw value. For time, the score represents elapsed time in milliseconds. For currency, the score represents a value in micro units.
     * @param {string=} params.scoreTag Additional information about the score you're submitting. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    submit: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/leaderboards/{leaderboardId}/scores',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['leaderboardId', 'score'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.scores.submitMultiple
     *
     * @desc Submits multiple scores to leaderboards.
     *
     * @alias games.scores.submitMultiple
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {games(v1).PlayerScoreSubmissionList} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    submitMultiple: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/leaderboards/scores',
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

  self.snapshots = {

    /**
     * games.snapshots.get
     *
     * @desc Retrieves the metadata for a given snapshot ID.
     *
     * @alias games.snapshots.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.snapshotId The ID of the snapshot.
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
          url: 'https://www.googleapis.com/games/v1/snapshots/{snapshotId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['snapshotId'],
        pathParams: ['snapshotId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.snapshots.list
     *
     * @desc Retrieves a list of snapshots created by your application for the player corresponding to the player ID.
     *
     * @alias games.snapshots.list
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxResults The maximum number of snapshot resources to return in the response, used for paging. For any response, the actual number of snapshot resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
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
          url: 'https://www.googleapis.com/games/v1/players/{playerId}/snapshots',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['playerId'],
        pathParams: ['playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.turnBasedMatches = {

    /**
     * games.turnBasedMatches.cancel
     *
     * @desc Cancel a turn-based match.
     *
     * @alias games.turnBasedMatches.cancel
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string} params.matchId The ID of the match.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancel: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/cancel',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.create
     *
     * @desc Create a turn-based match.
     *
     * @alias games.turnBasedMatches.create
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {games(v1).TurnBasedMatchCreateRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    create: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/create',
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
     * games.turnBasedMatches.decline
     *
     * @desc Decline an invitation to play a turn-based match.
     *
     * @alias games.turnBasedMatches.decline
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    decline: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/decline',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.dismiss
     *
     * @desc Dismiss a turn-based match from the match list. The match will no longer show up in the list and will not generate notifications.
     *
     * @alias games.turnBasedMatches.dismiss
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string} params.matchId The ID of the match.
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
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/dismiss',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.finish
     *
     * @desc Finish a turn-based match. Each player should make this call once, after all results are in. Only the player whose turn it is may make the first call to Finish, and can pass in the final match state.
     *
     * @alias games.turnBasedMatches.finish
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {games(v1).TurnBasedMatchResults} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    finish: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/finish',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.get
     *
     * @desc Get the data for a turn-based match.
     *
     * @alias games.turnBasedMatches.get
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {boolean=} params.includeMatchData Get match data along with metadata.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
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
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.join
     *
     * @desc Join a turn-based match.
     *
     * @alias games.turnBasedMatches.join
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    join: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/join',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.leave
     *
     * @desc Leave a turn-based match when it is not the current player's turn, without canceling the match.
     *
     * @alias games.turnBasedMatches.leave
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    leave: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/leave',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.leaveTurn
     *
     * @desc Leave a turn-based match during the current player's turn, without canceling the match.
     *
     * @alias games.turnBasedMatches.leaveTurn
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {integer} params.matchVersion The version of the match being updated.
     * @param {string=} params.pendingParticipantId The ID of another participant who should take their turn next. If not set, the match will wait for other player(s) to join via automatching; this is only valid if automatch criteria is set on the match with remaining slots for automatched players.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    leaveTurn: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/leaveTurn',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId', 'matchVersion'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.list
     *
     * @desc Returns turn-based matches the player is or was involved in.
     *
     * @alias games.turnBasedMatches.list
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {boolean=} params.includeMatchData True if match data should be returned in the response. Note that not all data will necessarily be returned if include_match_data is true; the server may decide to only return data for some of the matches to limit download size for the client. The remainder of the data for these matches will be retrievable on request.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxCompletedMatches The maximum number of completed or canceled matches to return in the response. If not set, all matches returned could be completed or canceled.
     * @param {integer=} params.maxResults The maximum number of matches to return in the response, used for paging. For any response, the actual number of matches to return may be less than the specified maxResults.
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
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches',
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
     * games.turnBasedMatches.rematch
     *
     * @desc Create a rematch of a match that was previously completed, with the same participants. This can be called by only one player on a match still in their list; the player must have called Finish first. Returns the newly created match; it will be the caller's turn.
     *
     * @alias games.turnBasedMatches.rematch
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {string=} params.requestId A randomly generated numeric ID for each request specified by the caller. This number is used at the server to ensure that the request is handled correctly across retries.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    rematch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/rematch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * games.turnBasedMatches.sync
     *
     * @desc Returns turn-based matches the player is or was involved in that changed since the last sync call, with the least recent changes coming first. Matches that should be removed from the local cache will have a status of MATCH_DELETED.
     *
     * @alias games.turnBasedMatches.sync
     * @memberOf! games(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {boolean=} params.includeMatchData True if match data should be returned in the response. Note that not all data will necessarily be returned if include_match_data is true; the server may decide to only return data for some of the matches to limit download size for the client. The remainder of the data for these matches will be retrievable on request.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {integer=} params.maxCompletedMatches The maximum number of completed or canceled matches to return in the response. If not set, all matches returned could be completed or canceled.
     * @param {integer=} params.maxResults The maximum number of matches to return in the response, used for paging. For any response, the actual number of matches to return may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    sync: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/sync',
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
     * games.turnBasedMatches.takeTurn
     *
     * @desc Commit the results of a player turn.
     *
     * @alias games.turnBasedMatches.takeTurn
     * @memberOf! games(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.consistencyToken The last-seen mutation timestamp.
     * @param {string=} params.language The preferred language to use for strings returned by this method.
     * @param {string} params.matchId The ID of the match.
     * @param {games(v1).TurnBasedMatchTurn} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    takeTurn: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1/turnbasedmatches/{matchId}/turn',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['matchId'],
        pathParams: ['matchId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AchievementDefinition
 * @memberOf! games(v1)
 * @type object
* @property {string} achievementType The type of the achievement.
Possible values are:  
- &quot;STANDARD&quot; - Achievement is either locked or unlocked. 
- &quot;INCREMENTAL&quot; - Achievement is incremental.
* @property {string} description The description of the achievement.
* @property {string} experiencePoints Experience points which will be earned when unlocking this achievement.
* @property {string} formattedTotalSteps The total steps for an incremental achievement as a string.
* @property {string} id The ID of the achievement.
* @property {string} initialState The initial state of the achievement.
Possible values are:  
- &quot;HIDDEN&quot; - Achievement is hidden. 
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {boolean} isRevealedIconUrlDefault Indicates whether the revealed icon image being returned is a default image, or is provided by the game.
* @property {boolean} isUnlockedIconUrlDefault Indicates whether the unlocked icon image being returned is a default image, or is game-provided.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementDefinition.
* @property {string} name The name of the achievement.
* @property {string} revealedIconUrl The image URL for the revealed achievement icon.
* @property {integer} totalSteps The total steps for an incremental achievement.
* @property {string} unlockedIconUrl The image URL for the unlocked achievement icon.
*/
/**
 * @typedef AchievementDefinitionsListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).AchievementDefinition[]} items The achievement definitions.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementDefinitionsListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef AchievementIncrementResponse
 * @memberOf! games(v1)
 * @type object
 * @property {integer} currentSteps The current steps recorded for this incremental achievement.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementIncrementResponse.
 * @property {boolean} newlyUnlocked Whether the current steps for the achievement has reached the number of steps required to unlock.
 */
/**
 * @typedef AchievementRevealResponse
 * @memberOf! games(v1)
 * @type object
* @property {string} currentState The current state of the achievement for which a reveal was attempted. This might be UNLOCKED if the achievement was already unlocked.
Possible values are:  
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementRevealResponse.
*/
/**
 * @typedef AchievementSetStepsAtLeastResponse
 * @memberOf! games(v1)
 * @type object
 * @property {integer} currentSteps The current steps recorded for this incremental achievement.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementSetStepsAtLeastResponse.
 * @property {boolean} newlyUnlocked Whether the the current steps for the achievement has reached the number of steps required to unlock.
 */
/**
 * @typedef AchievementUnlockResponse
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementUnlockResponse.
 * @property {boolean} newlyUnlocked Whether this achievement was newly unlocked (that is, whether the unlock request for the achievement was the first for the player).
 */
/**
 * @typedef AchievementUpdateMultipleRequest
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementUpdateMultipleRequest.
 * @property {games(v1).AchievementUpdateRequest[]} updates The individual achievement update requests.
 */
/**
 * @typedef AchievementUpdateMultipleResponse
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementUpdateListResponse.
 * @property {games(v1).AchievementUpdateResponse[]} updatedAchievements The updated state of the achievements.
 */
/**
 * @typedef AchievementUpdateRequest
 * @memberOf! games(v1)
 * @type object
* @property {string} achievementId The achievement this update is being applied to.
* @property {games(v1).GamesAchievementIncrement} incrementPayload The payload if an update of type INCREMENT was requested for the achievement.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementUpdateRequest.
* @property {games(v1).GamesAchievementSetStepsAtLeast} setStepsAtLeastPayload The payload if an update of type SET_STEPS_AT_LEAST was requested for the achievement.
* @property {string} updateType The type of update being applied.
Possible values are:  
- &quot;REVEAL&quot; - Achievement is revealed. 
- &quot;UNLOCK&quot; - Achievement is unlocked. 
- &quot;INCREMENT&quot; - Achievement is incremented. 
- &quot;SET_STEPS_AT_LEAST&quot; - Achievement progress is set to at least the passed value.
*/
/**
 * @typedef AchievementUpdateResponse
 * @memberOf! games(v1)
 * @type object
* @property {string} achievementId The achievement this update is was applied to.
* @property {string} currentState The current state of the achievement.
Possible values are:  
- &quot;HIDDEN&quot; - Achievement is hidden. 
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {integer} currentSteps The current steps recorded for this achievement if it is incremental.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#achievementUpdateResponse.
* @property {boolean} newlyUnlocked Whether this achievement was newly unlocked (that is, whether the unlock request for the achievement was the first for the player).
* @property {boolean} updateOccurred Whether the requested updates actually affected the achievement.
*/
/**
 * @typedef AggregateStats
 * @memberOf! games(v1)
 * @type object
 * @property {string} count The number of messages sent between a pair of peers.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#aggregateStats.
 * @property {string} max The maximum amount.
 * @property {string} min The minimum amount.
 * @property {string} sum The total number of bytes sent for messages between a pair of peers.
 */
/**
 * @typedef AnonymousPlayer
 * @memberOf! games(v1)
 * @type object
 * @property {string} avatarImageUrl The base URL for the image to display for the anonymous player.
 * @property {string} displayName The name to display for the anonymous player.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#anonymousPlayer.
 */
/**
 * @typedef Application
 * @memberOf! games(v1)
 * @type object
* @property {integer} achievement_count The number of achievements visible to the currently authenticated player.
* @property {games(v1).ImageAsset[]} assets The assets of the application.
* @property {string} author The author of the application.
* @property {games(v1).ApplicationCategory} category The category of the application.
* @property {string} description The description of the application.
* @property {string[]} enabledFeatures A list of features that have been enabled for the application.
Possible values are:  
- &quot;SNAPSHOTS&quot; - Snapshots has been enabled
* @property {string} id The ID of the application.
* @property {games(v1).Instance[]} instances The instances of the application.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#application.
* @property {string} lastUpdatedTimestamp The last updated timestamp of the application.
* @property {integer} leaderboard_count The number of leaderboards visible to the currently authenticated player.
* @property {string} name The name of the application.
* @property {string} themeColor A hint to the client UI for what color to use as an app-themed color. The color is given as an RGB triplet (e.g. &quot;E0E0E0&quot;).
*/
/**
 * @typedef ApplicationCategory
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#applicationCategory.
 * @property {string} primary The primary category.
 * @property {string} secondary The secondary category.
 */
/**
 * @typedef ApplicationVerifyResponse
 * @memberOf! games(v1)
 * @type object
 * @property {string} alternate_player_id An alternate ID that was once used for the player that was issued the auth token used in this request. (This field is not normally populated.)
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#applicationVerifyResponse.
 * @property {string} player_id The ID of the player that was issued the auth token used in this request.
 */
/**
 * @typedef Category
 * @memberOf! games(v1)
 * @type object
 * @property {string} category The category name.
 * @property {string} experiencePoints Experience points earned in this category.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#category.
 */
/**
 * @typedef CategoryListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Category[]} items The list of categories with usage data.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#categoryListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef EventBatchRecordFailure
 * @memberOf! games(v1)
 * @type object
* @property {string} failureCause The cause for the update failure.
Possible values are:  
- &quot;TOO_LARGE&quot;: A batch request was issued with more events than are allowed in a single batch. 
- &quot;TIME_PERIOD_EXPIRED&quot;: A batch was sent with data too far in the past to record. 
- &quot;TIME_PERIOD_SHORT&quot;: A batch was sent with a time range that was too short. 
- &quot;TIME_PERIOD_LONG&quot;: A batch was sent with a time range that was too long. 
- &quot;ALREADY_UPDATED&quot;: An attempt was made to record a batch of data which was already seen. 
- &quot;RECORD_RATE_HIGH&quot;: An attempt was made to record data faster than the server will apply updates.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventBatchRecordFailure.
* @property {games(v1).EventPeriodRange} range The time range which was rejected; empty for a request-wide failure.
*/
/**
 * @typedef EventChild
 * @memberOf! games(v1)
 * @type object
 * @property {string} childId The ID of the child event.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventChild.
 */
/**
 * @typedef EventDefinition
 * @memberOf! games(v1)
 * @type object
* @property {games(v1).EventChild[]} childEvents A list of events that are a child of this event.
* @property {string} description Description of what this event represents.
* @property {string} displayName The name to display for the event.
* @property {string} id The ID of the event.
* @property {string} imageUrl The base URL for the image that represents the event.
* @property {boolean} isDefaultImageUrl Indicates whether the icon image being returned is a default image, or is game-provided.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventDefinition.
* @property {string} visibility The visibility of event being tracked in this definition.
Possible values are:  
- &quot;REVEALED&quot;: This event should be visible to all users. 
- &quot;HIDDEN&quot;: This event should only be shown to users that have recorded this event at least once.
*/
/**
 * @typedef EventDefinitionListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).EventDefinition[]} items The event definitions.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventDefinitionListResponse.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef EventPeriodRange
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventPeriodRange.
 * @property {string} periodEndMillis The time when this update period ends, in millis, since 1970 UTC (Unix Epoch).
 * @property {string} periodStartMillis The time when this update period begins, in millis, since 1970 UTC (Unix Epoch).
 */
/**
 * @typedef EventPeriodUpdate
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventPeriodUpdate.
 * @property {games(v1).EventPeriodRange} timePeriod The time period being covered by this update.
 * @property {games(v1).EventUpdateRequest[]} updates The updates being made for this time period.
 */
/**
 * @typedef EventRecordFailure
 * @memberOf! games(v1)
 * @type object
* @property {string} eventId The ID of the event that was not updated.
* @property {string} failureCause The cause for the update failure.
Possible values are:  
- &quot;NOT_FOUND&quot; - An attempt was made to set an event that was not defined. 
- &quot;INVALID_UPDATE_VALUE&quot; - An attempt was made to increment an event by a non-positive value.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventRecordFailure.
*/
/**
 * @typedef EventRecordRequest
 * @memberOf! games(v1)
 * @type object
 * @property {string} currentTimeMillis The current time when this update was sent, in milliseconds, since 1970 UTC (Unix Epoch).
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventRecordRequest.
 * @property {string} requestId The request ID used to identify this attempt to record events.
 * @property {games(v1).EventPeriodUpdate[]} timePeriods A list of the time period updates being made in this request.
 */
/**
 * @typedef EventUpdateRequest
 * @memberOf! games(v1)
 * @type object
 * @property {string} definitionId The ID of the event being modified in this update.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventUpdateRequest.
 * @property {string} updateCount The number of times this event occurred in this time period.
 */
/**
 * @typedef EventUpdateResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).EventBatchRecordFailure[]} batchFailures Any batch-wide failures which occurred applying updates.
 * @property {games(v1).EventRecordFailure[]} eventFailures Any failures updating a particular event.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#eventUpdateResponse.
 * @property {games(v1).PlayerEvent[]} playerEvents The current status of any updated events
 */
/**
 * @typedef GamesAchievementIncrement
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#GamesAchievementIncrement.
 * @property {string} requestId The requestId associated with an increment to an achievement.
 * @property {integer} steps The number of steps to be incremented.
 */
/**
 * @typedef GamesAchievementSetStepsAtLeast
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#GamesAchievementSetStepsAtLeast.
 * @property {integer} steps The minimum number of steps for the achievement to be set to.
 */
/**
 * @typedef ImageAsset
 * @memberOf! games(v1)
 * @type object
 * @property {integer} height The height of the asset.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#imageAsset.
 * @property {string} name The name of the asset.
 * @property {string} url The URL of the asset.
 * @property {integer} width The width of the asset.
 */
/**
 * @typedef Instance
 * @memberOf! games(v1)
 * @type object
* @property {string} acquisitionUri URI which shows where a user can acquire this instance.
* @property {games(v1).InstanceAndroidDetails} androidInstance Platform dependent details for Android.
* @property {games(v1).InstanceIosDetails} iosInstance Platform dependent details for iOS.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#instance.
* @property {string} name Localized display name.
* @property {string} platformType The platform type.
Possible values are:  
- &quot;ANDROID&quot; - Instance is for Android. 
- &quot;IOS&quot; - Instance is for iOS 
- &quot;WEB_APP&quot; - Instance is for Web App.
* @property {boolean} realtimePlay Flag to show if this game instance supports realtime play.
* @property {boolean} turnBasedPlay Flag to show if this game instance supports turn based play.
* @property {games(v1).InstanceWebDetails} webInstance Platform dependent details for Web.
*/
/**
 * @typedef InstanceAndroidDetails
 * @memberOf! games(v1)
 * @type object
 * @property {boolean} enablePiracyCheck Flag indicating whether the anti-piracy check is enabled.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#instanceAndroidDetails.
 * @property {string} packageName Android package name which maps to Google Play URL.
 * @property {boolean} preferred Indicates that this instance is the default for new installations.
 */
/**
 * @typedef InstanceIosDetails
 * @memberOf! games(v1)
 * @type object
 * @property {string} bundleIdentifier Bundle identifier.
 * @property {string} itunesAppId iTunes App ID.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#instanceIosDetails.
 * @property {boolean} preferredForIpad Indicates that this instance is the default for new installations on iPad devices.
 * @property {boolean} preferredForIphone Indicates that this instance is the default for new installations on iPhone devices.
 * @property {boolean} supportIpad Flag to indicate if this instance supports iPad.
 * @property {boolean} supportIphone Flag to indicate if this instance supports iPhone.
 */
/**
 * @typedef InstanceWebDetails
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#instanceWebDetails.
 * @property {string} launchUrl Launch URL for the game.
 * @property {boolean} preferred Indicates that this instance is the default for new installations.
 */
/**
 * @typedef Leaderboard
 * @memberOf! games(v1)
 * @type object
* @property {string} iconUrl The icon for the leaderboard.
* @property {string} id The leaderboard ID.
* @property {boolean} isIconUrlDefault Indicates whether the icon image being returned is a default image, or is game-provided.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboard.
* @property {string} name The name of the leaderboard.
* @property {string} order How scores are ordered.
Possible values are:  
- &quot;LARGER_IS_BETTER&quot; - Larger values are better; scores are sorted in descending order. 
- &quot;SMALLER_IS_BETTER&quot; - Smaller values are better; scores are sorted in ascending order.
*/
/**
 * @typedef LeaderboardEntry
 * @memberOf! games(v1)
 * @type object
* @property {string} formattedScore The localized string for the numerical value of this score.
* @property {string} formattedScoreRank The localized string for the rank of this score for this leaderboard.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboardEntry.
* @property {games(v1).Player} player The player who holds this score.
* @property {string} scoreRank The rank of this score for this leaderboard.
* @property {string} scoreTag Additional information about the score. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
* @property {string} scoreValue The numerical value of this score.
* @property {string} timeSpan The time span of this high score.
Possible values are:  
- &quot;ALL_TIME&quot; - The score is an all-time high score. 
- &quot;WEEKLY&quot; - The score is a weekly high score. 
- &quot;DAILY&quot; - The score is a daily high score.
* @property {string} writeTimestampMillis The timestamp at which this score was recorded, in milliseconds since the epoch in UTC.
*/
/**
 * @typedef LeaderboardListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Leaderboard[]} items The leaderboards.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboardListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef LeaderboardScoreRank
 * @memberOf! games(v1)
 * @type object
 * @property {string} formattedNumScores The number of scores in the leaderboard as a string.
 * @property {string} formattedRank The rank in the leaderboard as a string.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboardScoreRank.
 * @property {string} numScores The number of scores in the leaderboard.
 * @property {string} rank The rank in the leaderboard.
 */
/**
 * @typedef LeaderboardScores
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).LeaderboardEntry[]} items The scores in the leaderboard.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#leaderboardScores.
 * @property {string} nextPageToken The pagination token for the next page of results.
 * @property {string} numScores The total number of scores in the leaderboard.
 * @property {games(v1).LeaderboardEntry} playerScore The score of the requesting player on the leaderboard. The player&#39;s score may appear both here and in the list of scores above. If you are viewing a public leaderboard and the player is not sharing their gameplay information publicly, the scoreRank and formattedScoreRank values will not be present.
 * @property {string} prevPageToken The pagination token for the previous page of results.
 */
/**
 * @typedef MetagameConfig
 * @memberOf! games(v1)
 * @type object
 * @property {integer} currentVersion Current version of the metagame configuration data. When this data is updated, the version number will be increased by one.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#metagameConfig.
 * @property {games(v1).PlayerLevel[]} playerLevels The list of player levels.
 */
/**
 * @typedef NetworkDiagnostics
 * @memberOf! games(v1)
 * @type object
 * @property {integer} androidNetworkSubtype The Android network subtype.
 * @property {integer} androidNetworkType The Android network type.
 * @property {integer} iosNetworkType iOS network type as defined in Reachability.h.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#networkDiagnostics.
 * @property {string} networkOperatorCode The MCC+MNC code for the client&#39;s network connection. On Android: http://developer.android.com/reference/android/telephony/TelephonyManager.html#getNetworkOperator() On iOS, see: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Reference/CTCarrier/Reference/Reference.html
 * @property {string} networkOperatorName The name of the carrier of the client&#39;s network connection. On Android: http://developer.android.com/reference/android/telephony/TelephonyManager.html#getNetworkOperatorName() On iOS: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Reference/CTCarrier/Reference/Reference.html#//apple_ref/occ/instp/CTCarrier/carrierName
 * @property {integer} registrationLatencyMillis The amount of time in milliseconds it took for the client to establish a connection with the XMPP server.
 */
/**
 * @typedef ParticipantResult
 * @memberOf! games(v1)
 * @type object
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#participantResult.
* @property {string} participantId The ID of the participant.
* @property {integer} placing The placement or ranking of the participant in the match results; a number from one to the number of participants in the match. Multiple participants may have the same placing value in case of a type.
* @property {string} result The result of the participant for this match.
Possible values are:  
- &quot;MATCH_RESULT_WIN&quot; - The participant won the match. 
- &quot;MATCH_RESULT_LOSS&quot; - The participant lost the match. 
- &quot;MATCH_RESULT_TIE&quot; - The participant tied the match. 
- &quot;MATCH_RESULT_NONE&quot; - There was no winner for the match (nobody wins or loses this kind of game.) 
- &quot;MATCH_RESULT_DISCONNECT&quot; - The participant disconnected / left during the match. 
- &quot;MATCH_RESULT_DISAGREED&quot; - Different clients reported different results for this participant.
*/
/**
 * @typedef PeerChannelDiagnostics
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).AggregateStats} bytesReceived Number of bytes received.
 * @property {games(v1).AggregateStats} bytesSent Number of bytes sent.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#peerChannelDiagnostics.
 * @property {integer} numMessagesLost Number of messages lost.
 * @property {integer} numMessagesReceived Number of messages received.
 * @property {integer} numMessagesSent Number of messages sent.
 * @property {integer} numSendFailures Number of send failures.
 * @property {games(v1).AggregateStats} roundtripLatencyMillis Roundtrip latency stats in milliseconds.
 */
/**
 * @typedef PeerSessionDiagnostics
 * @memberOf! games(v1)
 * @type object
 * @property {string} connectedTimestampMillis Connected time in milliseconds.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#peerSessionDiagnostics.
 * @property {string} participantId The participant ID of the peer.
 * @property {games(v1).PeerChannelDiagnostics} reliableChannel Reliable channel diagnostics.
 * @property {games(v1).PeerChannelDiagnostics} unreliableChannel Unreliable channel diagnostics.
 */
/**
 * @typedef Played
 * @memberOf! games(v1)
 * @type object
 * @property {boolean} autoMatched True if the player was auto-matched with the currently authenticated user.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#played.
 * @property {string} timeMillis The last time the player played the game in milliseconds since the epoch in UTC.
 */
/**
 * @typedef Player
 * @memberOf! games(v1)
 * @type object
 * @property {string} avatarImageUrl The base URL for the image that represents the player.
 * @property {string} bannerUrlLandscape The url to the landscape mode player banner image.
 * @property {string} bannerUrlPortrait The url to the portrait mode player banner image.
 * @property {string} displayName The name to display for the player.
 * @property {games(v1).PlayerExperienceInfo} experienceInfo An object to represent Play Game experience information for the player.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#player.
 * @property {games(v1).Played} lastPlayedWith Details about the last time this player played a multiplayer game with the currently authenticated player. Populated for PLAYED_WITH player collection members.
 * @property {object} name An object representation of the individual components of the player&#39;s name. For some players, these fields may not be present.
 * @property {string} originalPlayerId The player ID that was used for this player the first time they signed into the game in question. This is only populated for calls to player.get for the requesting player, only if the player ID has subsequently changed, and only to clients that support remapping player IDs.
 * @property {string} playerId The ID of the player.
 * @property {games(v1).ProfileSettings} profileSettings The player&#39;s profile settings. Controls whether or not the player&#39;s profile is visible to other players.
 * @property {string} title The player&#39;s title rewarded for their game activities.
 */
/**
 * @typedef PlayerAchievement
 * @memberOf! games(v1)
 * @type object
* @property {string} achievementState The state of the achievement.
Possible values are:  
- &quot;HIDDEN&quot; - Achievement is hidden. 
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {integer} currentSteps The current steps for an incremental achievement.
* @property {string} experiencePoints Experience points earned for the achievement. This field is absent for achievements that have not yet been unlocked and 0 for achievements that have been unlocked by testers but that are unpublished.
* @property {string} formattedCurrentStepsString The current steps for an incremental achievement as a string.
* @property {string} id The ID of the achievement.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerAchievement.
* @property {string} lastUpdatedTimestamp The timestamp of the last modification to this achievement&#39;s state.
*/
/**
 * @typedef PlayerAchievementListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).PlayerAchievement[]} items The achievements.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerAchievementListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef PlayerEvent
 * @memberOf! games(v1)
 * @type object
 * @property {string} definitionId The ID of the event definition.
 * @property {string} formattedNumEvents The current number of times this event has occurred, as a string. The formatting of this string depends on the configuration of your event in the Play Games Developer Console.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerEvent.
 * @property {string} numEvents The current number of times this event has occurred.
 * @property {string} playerId The ID of the player.
 */
/**
 * @typedef PlayerEventListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).PlayerEvent[]} items The player events.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerEventListResponse.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef PlayerExperienceInfo
 * @memberOf! games(v1)
 * @type object
 * @property {string} currentExperiencePoints The current number of experience points for the player.
 * @property {games(v1).PlayerLevel} currentLevel The current level of the player.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerExperienceInfo.
 * @property {string} lastLevelUpTimestampMillis The timestamp when the player was leveled up, in millis since Unix epoch UTC.
 * @property {games(v1).PlayerLevel} nextLevel The next level of the player. If the current level is the maximum level, this should be same as the current level.
 */
/**
 * @typedef PlayerLeaderboardScore
 * @memberOf! games(v1)
 * @type object
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerLeaderboardScore.
* @property {string} leaderboard_id The ID of the leaderboard this score is in.
* @property {games(v1).LeaderboardScoreRank} publicRank The public rank of the score in this leaderboard. This object will not be present if the user is not sharing their scores publicly.
* @property {string} scoreString The formatted value of this score.
* @property {string} scoreTag Additional information about the score. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
* @property {string} scoreValue The numerical value of this score.
* @property {games(v1).LeaderboardScoreRank} socialRank The social rank of the score in this leaderboard.
* @property {string} timeSpan The time span of this score.
Possible values are:  
- &quot;ALL_TIME&quot; - The score is an all-time score. 
- &quot;WEEKLY&quot; - The score is a weekly score. 
- &quot;DAILY&quot; - The score is a daily score.
* @property {string} writeTimestamp The timestamp at which this score was recorded, in milliseconds since the epoch in UTC.
*/
/**
 * @typedef PlayerLeaderboardScoreListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).PlayerLeaderboardScore[]} items The leaderboard scores.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerLeaderboardScoreListResponse.
 * @property {string} nextPageToken The pagination token for the next page of results.
 * @property {games(v1).Player} player The Player resources for the owner of this score.
 */
/**
 * @typedef PlayerLevel
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerLevel.
 * @property {integer} level The level for the user.
 * @property {string} maxExperiencePoints The maximum experience points for this level.
 * @property {string} minExperiencePoints The minimum experience points for this level.
 */
/**
 * @typedef PlayerListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Player[]} items The players.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef PlayerScore
 * @memberOf! games(v1)
 * @type object
* @property {string} formattedScore The formatted score for this player score.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerScore.
* @property {string} score The numerical value for this player score.
* @property {string} scoreTag Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
* @property {string} timeSpan The time span for this player score.
Possible values are:  
- &quot;ALL_TIME&quot; - The score is an all-time score. 
- &quot;WEEKLY&quot; - The score is a weekly score. 
- &quot;DAILY&quot; - The score is a daily score.
*/
/**
 * @typedef PlayerScoreListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerScoreListResponse.
 * @property {games(v1).PlayerScoreResponse[]} submittedScores The score submissions statuses.
 */
/**
 * @typedef PlayerScoreResponse
 * @memberOf! games(v1)
 * @type object
* @property {string[]} beatenScoreTimeSpans The time spans where the submitted score is better than the existing score for that time span.
Possible values are:  
- &quot;ALL_TIME&quot; - The score is an all-time score. 
- &quot;WEEKLY&quot; - The score is a weekly score. 
- &quot;DAILY&quot; - The score is a daily score.
* @property {string} formattedScore The formatted value of the submitted score.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerScoreResponse.
* @property {string} leaderboardId The leaderboard ID that this score was submitted to.
* @property {string} scoreTag Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
* @property {games(v1).PlayerScore[]} unbeatenScores The scores in time spans that have not been beaten. As an example, the submitted score may be better than the player&#39;s DAILY score, but not better than the player&#39;s scores for the WEEKLY or ALL_TIME time spans.
*/
/**
 * @typedef PlayerScoreSubmissionList
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#playerScoreSubmissionList.
 * @property {games(v1).ScoreSubmission[]} scores The score submissions.
 */
/**
 * @typedef ProfileSettings
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#profileSettings.
 * @property {boolean} profileVisible The player&#39;s current profile visibility. This field is visible to both 1P and 3P APIs.
 */
/**
 * @typedef PushToken
 * @memberOf! games(v1)
 * @type object
* @property {string} clientRevision The revision of the client SDK used by your application, in the same format that&#39;s used by revisions.check. Used to send backward compatible messages. Format: [PLATFORM_TYPE]:[VERSION_NUMBER]. Possible values of PLATFORM_TYPE are:  
- IOS - Push token is for iOS
* @property {games(v1).PushTokenId} id Unique identifier for this push token.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#pushToken.
* @property {string} language The preferred language for notifications that are sent using this token.
*/
/**
 * @typedef PushTokenId
 * @memberOf! games(v1)
 * @type object
 * @property {object} ios A push token ID for iOS devices.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#pushTokenId.
 */
/**
 * @typedef Quest
 * @memberOf! games(v1)
 * @type object
* @property {string} acceptedTimestampMillis The timestamp at which the user accepted the quest in milliseconds since the epoch in UTC. Only present if the player has accepted the quest.
* @property {string} applicationId The ID of the application this quest is part of.
* @property {string} bannerUrl The banner image URL for the quest.
* @property {string} description The description of the quest.
* @property {string} endTimestampMillis The timestamp at which the quest ceases to be active in milliseconds since the epoch in UTC.
* @property {string} iconUrl The icon image URL for the quest.
* @property {string} id The ID of the quest.
* @property {boolean} isDefaultBannerUrl Indicates whether the banner image being returned is a default image, or is game-provided.
* @property {boolean} isDefaultIconUrl Indicates whether the icon image being returned is a default image, or is game-provided.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#quest.
* @property {string} lastUpdatedTimestampMillis The timestamp at which the quest was last updated by the user in milliseconds since the epoch in UTC. Only present if the player has accepted the quest.
* @property {games(v1).QuestMilestone[]} milestones The quest milestones.
* @property {string} name The name of the quest.
* @property {string} notifyTimestampMillis The timestamp at which the user should be notified that the quest will end soon in milliseconds since the epoch in UTC.
* @property {string} startTimestampMillis The timestamp at which the quest becomes active in milliseconds since the epoch in UTC.
* @property {string} state The state of the quest.
Possible values are:  
- &quot;UPCOMING&quot;: The quest is upcoming. The user can see the quest, but cannot accept it until it is open. 
- &quot;OPEN&quot;: The quest is currently open and may be accepted at this time. 
- &quot;ACCEPTED&quot;: The user is currently participating in this quest. 
- &quot;COMPLETED&quot;: The user has completed the quest. 
- &quot;FAILED&quot;: The quest was attempted but was not completed before the deadline expired. 
- &quot;EXPIRED&quot;: The quest has expired and was not accepted. 
- &quot;DELETED&quot;: The quest should be deleted from the local database.
*/
/**
 * @typedef QuestContribution
 * @memberOf! games(v1)
 * @type object
 * @property {string} formattedValue The formatted value of the contribution as a string. Format depends on the configuration for the associated event definition in the Play Games Developer Console.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#questContribution.
 * @property {string} value The value of the contribution.
 */
/**
 * @typedef QuestCriterion
 * @memberOf! games(v1)
 * @type object
* @property {games(v1).QuestContribution} completionContribution The total number of times the associated event must be incremented for the player to complete this quest.
* @property {games(v1).QuestContribution} currentContribution The number of increments the player has made toward the completion count event increments required to complete the quest. This value will not exceed the completion contribution.
There will be no currentContribution until the player has accepted the quest.
* @property {string} eventId The ID of the event the criterion corresponds to.
* @property {games(v1).QuestContribution} initialPlayerProgress The value of the event associated with this quest at the time that the quest was accepted. This value may change if event increments that took place before the start of quest are uploaded after the quest starts.
There will be no initialPlayerProgress until the player has accepted the quest.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#questCriterion.
*/
/**
 * @typedef QuestListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Quest[]} items The quests.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#questListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results.
 */
/**
 * @typedef QuestMilestone
 * @memberOf! games(v1)
 * @type object
* @property {string} completionRewardData The completion reward data of the milestone, represented as a Base64-encoded string. This is a developer-specified binary blob with size between 0 and 2 KB before encoding.
* @property {games(v1).QuestCriterion[]} criteria The criteria of the milestone.
* @property {string} id The milestone ID.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#questMilestone.
* @property {string} state The current state of the milestone.
Possible values are:  
- &quot;COMPLETED_NOT_CLAIMED&quot; - The milestone is complete, but has not yet been claimed. 
- &quot;CLAIMED&quot; - The milestone is complete and has been claimed. 
- &quot;NOT_COMPLETED&quot; - The milestone has not yet been completed. 
- &quot;NOT_STARTED&quot; - The milestone is for a quest that has not yet been accepted.
*/
/**
 * @typedef RevisionCheckResponse
 * @memberOf! games(v1)
 * @type object
* @property {string} apiVersion The version of the API this client revision should use when calling API methods.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#revisionCheckResponse.
* @property {string} revisionStatus The result of the revision check.
Possible values are:  
- &quot;OK&quot; - The revision being used is current. 
- &quot;DEPRECATED&quot; - There is currently a newer version available, but the revision being used still works. 
- &quot;INVALID&quot; - The revision being used is not supported in any released version.
*/
/**
 * @typedef Room
 * @memberOf! games(v1)
 * @type object
* @property {string} applicationId The ID of the application being played.
* @property {games(v1).RoomAutoMatchingCriteria} autoMatchingCriteria Criteria for auto-matching players into this room.
* @property {games(v1).RoomAutoMatchStatus} autoMatchingStatus Auto-matching status for this room. Not set if the room is not currently in the auto-matching queue.
* @property {games(v1).RoomModification} creationDetails Details about the room creation.
* @property {string} description This short description is generated by our servers and worded relative to the player requesting the room. It is intended to be displayed when the room is shown in a list (that is, an invitation to a room.)
* @property {string} inviterId The ID of the participant that invited the user to the room. Not set if the user was not invited to the room.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#room.
* @property {games(v1).RoomModification} lastUpdateDetails Details about the last update to the room.
* @property {games(v1).RoomParticipant[]} participants The participants involved in the room, along with their statuses. Includes participants who have left or declined invitations.
* @property {string} roomId Globally unique ID for a room.
* @property {integer} roomStatusVersion The version of the room status: an increasing counter, used by the client to ignore out-of-order updates to room status.
* @property {string} status The status of the room.
Possible values are:  
- &quot;ROOM_INVITING&quot; - One or more players have been invited and not responded. 
- &quot;ROOM_AUTO_MATCHING&quot; - One or more slots need to be filled by auto-matching. 
- &quot;ROOM_CONNECTING&quot; - Players have joined and are connecting to each other (either before or after auto-matching). 
- &quot;ROOM_ACTIVE&quot; - All players have joined and connected to each other. 
- &quot;ROOM_DELETED&quot; - The room should no longer be shown on the client. Returned in sync calls when a player joins a room (as a tombstone), or for rooms where all joined participants have left.
* @property {integer} variant The variant / mode of the application being played; can be any integer value, or left blank.
*/
/**
 * @typedef RoomAutoMatchStatus
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomAutoMatchStatus.
 * @property {integer} waitEstimateSeconds An estimate for the amount of time (in seconds) that auto-matching is expected to take to complete.
 */
/**
 * @typedef RoomAutoMatchingCriteria
 * @memberOf! games(v1)
 * @type object
 * @property {string} exclusiveBitmask A bitmask indicating when auto-matches are valid. When ANDed with other exclusive bitmasks, the result must be zero. Can be used to support exclusive roles within a game.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomAutoMatchingCriteria.
 * @property {integer} maxAutoMatchingPlayers The maximum number of players that should be added to the room by auto-matching.
 * @property {integer} minAutoMatchingPlayers The minimum number of players that should be added to the room by auto-matching.
 */
/**
 * @typedef RoomClientAddress
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomClientAddress.
 * @property {string} xmppAddress The XMPP address of the client on the Google Games XMPP network.
 */
/**
 * @typedef RoomCreateRequest
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).RoomAutoMatchingCriteria} autoMatchingCriteria Criteria for auto-matching players into this room.
 * @property {string[]} capabilities The capabilities that this client supports for realtime communication.
 * @property {games(v1).RoomClientAddress} clientAddress Client address for the player creating the room.
 * @property {string[]} invitedPlayerIds The player IDs to invite to the room.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomCreateRequest.
 * @property {games(v1).NetworkDiagnostics} networkDiagnostics Network diagnostics for the client creating the room.
 * @property {string} requestId A randomly generated numeric ID. This number is used at the server to ensure that the request is handled correctly across retries.
 * @property {integer} variant The variant / mode of the application to be played. This can be any integer value, or left blank. You should use a small number of variants to keep the auto-matching pool as large as possible.
 */
/**
 * @typedef RoomJoinRequest
 * @memberOf! games(v1)
 * @type object
 * @property {string[]} capabilities The capabilities that this client supports for realtime communication.
 * @property {games(v1).RoomClientAddress} clientAddress Client address for the player joining the room.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomJoinRequest.
 * @property {games(v1).NetworkDiagnostics} networkDiagnostics Network diagnostics for the client joining the room.
 */
/**
 * @typedef RoomLeaveDiagnostics
 * @memberOf! games(v1)
 * @type object
 * @property {integer} androidNetworkSubtype Android network subtype. http://developer.android.com/reference/android/net/NetworkInfo.html#getSubtype()
 * @property {integer} androidNetworkType Android network type. http://developer.android.com/reference/android/net/NetworkInfo.html#getType()
 * @property {integer} iosNetworkType iOS network type as defined in Reachability.h.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomLeaveDiagnostics.
 * @property {string} networkOperatorCode The MCC+MNC code for the client&#39;s network connection. On Android: http://developer.android.com/reference/android/telephony/TelephonyManager.html#getNetworkOperator() On iOS, see: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Reference/CTCarrier/Reference/Reference.html
 * @property {string} networkOperatorName The name of the carrier of the client&#39;s network connection. On Android: http://developer.android.com/reference/android/telephony/TelephonyManager.html#getNetworkOperatorName() On iOS: https://developer.apple.com/library/ios/documentation/NetworkingInternet/Reference/CTCarrier/Reference/Reference.html#//apple_ref/occ/instp/CTCarrier/carrierName
 * @property {games(v1).PeerSessionDiagnostics[]} peerSession Diagnostics about all peer sessions.
 * @property {boolean} socketsUsed Whether or not sockets were used.
 */
/**
 * @typedef RoomLeaveRequest
 * @memberOf! games(v1)
 * @type object
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomLeaveRequest.
* @property {games(v1).RoomLeaveDiagnostics} leaveDiagnostics Diagnostics for a player leaving the room.
* @property {string} reason Reason for leaving the match.
Possible values are:  
- &quot;PLAYER_LEFT&quot; - The player chose to leave the room.. 
- &quot;GAME_LEFT&quot; - The game chose to remove the player from the room. 
- &quot;REALTIME_ABANDONED&quot; - The player switched to another application and abandoned the room. 
- &quot;REALTIME_PEER_CONNECTION_FAILURE&quot; - The client was unable to establish a connection to other peer(s). 
- &quot;REALTIME_SERVER_CONNECTION_FAILURE&quot; - The client was unable to communicate with the server. 
- &quot;REALTIME_SERVER_ERROR&quot; - The client received an error response when it tried to communicate with the server. 
- &quot;REALTIME_TIMEOUT&quot; - The client timed out while waiting for a room. 
- &quot;REALTIME_CLIENT_DISCONNECTING&quot; - The client disconnects without first calling Leave. 
- &quot;REALTIME_SIGN_OUT&quot; - The user signed out of G+ while in the room. 
- &quot;REALTIME_GAME_CRASHED&quot; - The game crashed. 
- &quot;REALTIME_ROOM_SERVICE_CRASHED&quot; - RoomAndroidService crashed. 
- &quot;REALTIME_DIFFERENT_CLIENT_ROOM_OPERATION&quot; - Another client is trying to enter a room. 
- &quot;REALTIME_SAME_CLIENT_ROOM_OPERATION&quot; - The same client is trying to enter a new room.
*/
/**
 * @typedef RoomList
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Room[]} items The rooms.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomList.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef RoomModification
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomModification.
 * @property {string} modifiedTimestampMillis The timestamp at which they modified the room, in milliseconds since the epoch in UTC.
 * @property {string} participantId The ID of the participant that modified the room.
 */
/**
 * @typedef RoomP2PStatus
 * @memberOf! games(v1)
 * @type object
* @property {integer} connectionSetupLatencyMillis The amount of time in milliseconds it took to establish connections with this peer.
* @property {string} error The error code in event of a failure.
Possible values are:  
- &quot;P2P_FAILED&quot; - The client failed to establish a P2P connection with the peer. 
- &quot;PRESENCE_FAILED&quot; - The client failed to register to receive P2P connections. 
- &quot;RELAY_SERVER_FAILED&quot; - The client received an error when trying to use the relay server to establish a P2P connection with the peer.
* @property {string} error_reason More detailed diagnostic message returned in event of a failure.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomP2PStatus.
* @property {string} participantId The ID of the participant.
* @property {string} status The status of the peer in the room.
Possible values are:  
- &quot;CONNECTION_ESTABLISHED&quot; - The client established a P2P connection with the peer. 
- &quot;CONNECTION_FAILED&quot; - The client failed to establish directed presence with the peer.
* @property {integer} unreliableRoundtripLatencyMillis The amount of time in milliseconds it took to send packets back and forth on the unreliable channel with this peer.
*/
/**
 * @typedef RoomP2PStatuses
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomP2PStatuses.
 * @property {games(v1).RoomP2PStatus[]} updates The updates for the peers.
 */
/**
 * @typedef RoomParticipant
 * @memberOf! games(v1)
 * @type object
* @property {boolean} autoMatched True if this participant was auto-matched with the requesting player.
* @property {games(v1).AnonymousPlayer} autoMatchedPlayer Information about a player that has been anonymously auto-matched against the requesting player. (Either player or autoMatchedPlayer will be set.)
* @property {string[]} capabilities The capabilities which can be used when communicating with this participant.
* @property {games(v1).RoomClientAddress} clientAddress Client address for the participant.
* @property {boolean} connected True if this participant is in the fully connected set of peers in the room.
* @property {string} id An identifier for the participant in the scope of the room. Cannot be used to identify a player across rooms or in other contexts.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomParticipant.
* @property {string} leaveReason The reason the participant left the room; populated if the participant status is PARTICIPANT_LEFT.
Possible values are:  
- &quot;PLAYER_LEFT&quot; - The player explicitly chose to leave the room. 
- &quot;GAME_LEFT&quot; - The game chose to remove the player from the room. 
- &quot;ABANDONED&quot; - The player switched to another application and abandoned the room.
- &quot;PEER_CONNECTION_FAILURE&quot; - The client was unable to establish or maintain a connection to other peer(s) in the room.
- &quot;SERVER_ERROR&quot; - The client received an error response when it tried to communicate with the server. 
- &quot;TIMEOUT&quot; - The client timed out while waiting for players to join and connect. 
- &quot;PRESENCE_FAILURE&quot; - The client&#39;s XMPP connection ended abruptly.
* @property {games(v1).Player} player Information about the player. Not populated if this player was anonymously auto-matched against the requesting player. (Either player or autoMatchedPlayer will be set.)
* @property {string} status The status of the participant with respect to the room.
Possible values are:  
- &quot;PARTICIPANT_INVITED&quot; - The participant has been invited to join the room, but has not yet responded. 
- &quot;PARTICIPANT_JOINED&quot; - The participant has joined the room (either after creating it or accepting an invitation.) 
- &quot;PARTICIPANT_DECLINED&quot; - The participant declined an invitation to join the room. 
- &quot;PARTICIPANT_LEFT&quot; - The participant joined the room and then left it.
*/
/**
 * @typedef RoomStatus
 * @memberOf! games(v1)
 * @type object
* @property {games(v1).RoomAutoMatchStatus} autoMatchingStatus Auto-matching status for this room. Not set if the room is not currently in the automatching queue.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#roomStatus.
* @property {games(v1).RoomParticipant[]} participants The participants involved in the room, along with their statuses. Includes participants who have left or declined invitations.
* @property {string} roomId Globally unique ID for a room.
* @property {string} status The status of the room.
Possible values are:  
- &quot;ROOM_INVITING&quot; - One or more players have been invited and not responded. 
- &quot;ROOM_AUTO_MATCHING&quot; - One or more slots need to be filled by auto-matching. 
- &quot;ROOM_CONNECTING&quot; - Players have joined are connecting to each other (either before or after auto-matching). 
- &quot;ROOM_ACTIVE&quot; - All players have joined and connected to each other. 
- &quot;ROOM_DELETED&quot; - All joined players have left.
* @property {integer} statusVersion The version of the status for the room: an increasing counter, used by the client to ignore out-of-order updates to room status.
*/
/**
 * @typedef ScoreSubmission
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#scoreSubmission.
 * @property {string} leaderboardId The leaderboard this score is being submitted to.
 * @property {string} score The new score being submitted.
 * @property {string} scoreTag Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
 * @property {string} signature Signature Values will contain URI-safe characters as defined by section 2.3 of RFC 3986.
 */
/**
 * @typedef Snapshot
 * @memberOf! games(v1)
 * @type object
* @property {games(v1).SnapshotImage} coverImage The cover image of this snapshot. May be absent if there is no image.
* @property {string} description The description of this snapshot.
* @property {string} driveId The ID of the file underlying this snapshot in the Drive API. Only present if the snapshot is a view on a Drive file and the file is owned by the caller.
* @property {string} durationMillis The duration associated with this snapshot, in millis.
* @property {string} id The ID of the snapshot.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#snapshot.
* @property {string} lastModifiedMillis The timestamp (in millis since Unix epoch) of the last modification to this snapshot.
* @property {string} progressValue The progress value (64-bit integer set by developer) associated with this snapshot.
* @property {string} title The title of this snapshot.
* @property {string} type The type of this snapshot.
Possible values are:  
- &quot;SAVE_GAME&quot; - A snapshot representing a save game.
* @property {string} uniqueName The unique name provided when the snapshot was created.
*/
/**
 * @typedef SnapshotImage
 * @memberOf! games(v1)
 * @type object
 * @property {integer} height The height of the image.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#snapshotImage.
 * @property {string} mime_type The MIME type of the image.
 * @property {string} url The URL of the image. This URL may be invalidated at any time and should not be cached.
 * @property {integer} width The width of the image.
 */
/**
 * @typedef SnapshotListResponse
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).Snapshot[]} items The snapshots.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#snapshotListResponse.
 * @property {string} nextPageToken Token corresponding to the next page of results. If there are no more results, the token is omitted.
 */
/**
 * @typedef TurnBasedAutoMatchingCriteria
 * @memberOf! games(v1)
 * @type object
 * @property {string} exclusiveBitmask A bitmask indicating when auto-matches are valid. When ANDed with other exclusive bitmasks, the result must be zero. Can be used to support exclusive roles within a game.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedAutoMatchingCriteria.
 * @property {integer} maxAutoMatchingPlayers The maximum number of players that should be added to the match by auto-matching.
 * @property {integer} minAutoMatchingPlayers The minimum number of players that should be added to the match by auto-matching.
 */
/**
 * @typedef TurnBasedMatch
 * @memberOf! games(v1)
 * @type object
* @property {string} applicationId The ID of the application being played.
* @property {games(v1).TurnBasedAutoMatchingCriteria} autoMatchingCriteria Criteria for auto-matching players into this match.
* @property {games(v1).TurnBasedMatchModification} creationDetails Details about the match creation.
* @property {games(v1).TurnBasedMatchData} data The data / game state for this match.
* @property {string} description This short description is generated by our servers based on turn state and is localized and worded relative to the player requesting the match. It is intended to be displayed when the match is shown in a list.
* @property {string} inviterId The ID of the participant that invited the user to the match. Not set if the user was not invited to the match.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatch.
* @property {games(v1).TurnBasedMatchModification} lastUpdateDetails Details about the last update to the match.
* @property {string} matchId Globally unique ID for a turn-based match.
* @property {integer} matchNumber The number of the match in a chain of rematches. Will be set to 1 for the first match and incremented by 1 for each rematch.
* @property {integer} matchVersion The version of this match: an increasing counter, used to avoid out-of-date updates to the match.
* @property {games(v1).TurnBasedMatchParticipant[]} participants The participants involved in the match, along with their statuses. Includes participants who have left or declined invitations.
* @property {string} pendingParticipantId The ID of the participant that is taking a turn.
* @property {games(v1).TurnBasedMatchData} previousMatchData The data / game state for the previous match; set for the first turn of rematches only.
* @property {string} rematchId The ID of a rematch of this match. Only set for completed matches that have been rematched.
* @property {games(v1).ParticipantResult[]} results The results reported for this match.
* @property {string} status The status of the match.
Possible values are:  
- &quot;MATCH_AUTO_MATCHING&quot; - One or more slots need to be filled by auto-matching; the match cannot be established until they are filled. 
- &quot;MATCH_ACTIVE&quot; - The match has started. 
- &quot;MATCH_COMPLETE&quot; - The match has finished. 
- &quot;MATCH_CANCELED&quot; - The match was canceled. 
- &quot;MATCH_EXPIRED&quot; - The match expired due to inactivity. 
- &quot;MATCH_DELETED&quot; - The match should no longer be shown on the client. Returned only for tombstones for matches when sync is called.
* @property {string} userMatchStatus The status of the current user in the match. Derived from the match type, match status, the user&#39;s participant status, and the pending participant for the match.
Possible values are:  
- &quot;USER_INVITED&quot; - The user has been invited to join the match and has not responded yet. 
- &quot;USER_AWAITING_TURN&quot; - The user is waiting for their turn. 
- &quot;USER_TURN&quot; - The user has an action to take in the match. 
- &quot;USER_MATCH_COMPLETED&quot; - The match has ended (it is completed, canceled, or expired.)
* @property {integer} variant The variant / mode of the application being played; can be any integer value, or left blank.
* @property {string} withParticipantId The ID of another participant in the match that can be used when describing the participants the user is playing with.
*/
/**
 * @typedef TurnBasedMatchCreateRequest
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).TurnBasedAutoMatchingCriteria} autoMatchingCriteria Criteria for auto-matching players into this match.
 * @property {string[]} invitedPlayerIds The player ids to invite to the match.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchCreateRequest.
 * @property {string} requestId A randomly generated numeric ID. This number is used at the server to ensure that the request is handled correctly across retries.
 * @property {integer} variant The variant / mode of the application to be played. This can be any integer value, or left blank. You should use a small number of variants to keep the auto-matching pool as large as possible.
 */
/**
 * @typedef TurnBasedMatchData
 * @memberOf! games(v1)
 * @type object
 * @property {string} data The byte representation of the data (limited to 128 kB), as a Base64-encoded string with the URL_SAFE encoding option.
 * @property {boolean} dataAvailable True if this match has data available but it wasn&#39;t returned in a list response; fetching the match individually will retrieve this data.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchData.
 */
/**
 * @typedef TurnBasedMatchDataRequest
 * @memberOf! games(v1)
 * @type object
 * @property {string} data The byte representation of the data (limited to 128 kB), as a Base64-encoded string with the URL_SAFE encoding option.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchDataRequest.
 */
/**
 * @typedef TurnBasedMatchList
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).TurnBasedMatch[]} items The matches.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchList.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef TurnBasedMatchModification
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchModification.
 * @property {string} modifiedTimestampMillis The timestamp at which they modified the match, in milliseconds since the epoch in UTC.
 * @property {string} participantId The ID of the participant that modified the match.
 */
/**
 * @typedef TurnBasedMatchParticipant
 * @memberOf! games(v1)
 * @type object
* @property {boolean} autoMatched True if this participant was auto-matched with the requesting player.
* @property {games(v1).AnonymousPlayer} autoMatchedPlayer Information about a player that has been anonymously auto-matched against the requesting player. (Either player or autoMatchedPlayer will be set.)
* @property {string} id An identifier for the participant in the scope of the match. Cannot be used to identify a player across matches or in other contexts.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchParticipant.
* @property {games(v1).Player} player Information about the player. Not populated if this player was anonymously auto-matched against the requesting player. (Either player or autoMatchedPlayer will be set.)
* @property {string} status The status of the participant with respect to the match.
Possible values are:  
- &quot;PARTICIPANT_NOT_INVITED_YET&quot; - The participant is slated to be invited to the match, but the invitation has not been sent; the invite will be sent when it becomes their turn. 
- &quot;PARTICIPANT_INVITED&quot; - The participant has been invited to join the match, but has not yet responded. 
- &quot;PARTICIPANT_JOINED&quot; - The participant has joined the match (either after creating it or accepting an invitation.) 
- &quot;PARTICIPANT_DECLINED&quot; - The participant declined an invitation to join the match. 
- &quot;PARTICIPANT_LEFT&quot; - The participant joined the match and then left it. 
- &quot;PARTICIPANT_FINISHED&quot; - The participant finished playing in the match. 
- &quot;PARTICIPANT_UNRESPONSIVE&quot; - The participant did not take their turn in the allotted time.
*/
/**
 * @typedef TurnBasedMatchRematch
 * @memberOf! games(v1)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchRematch.
 * @property {games(v1).TurnBasedMatch} previousMatch The old match that the rematch was created from; will be updated such that the rematchId field will point at the new match.
 * @property {games(v1).TurnBasedMatch} rematch The newly created match; a rematch of the old match with the same participants.
 */
/**
 * @typedef TurnBasedMatchResults
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).TurnBasedMatchDataRequest} data The final match data.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchResults.
 * @property {integer} matchVersion The version of the match being updated.
 * @property {games(v1).ParticipantResult[]} results The match results for the participants in the match.
 */
/**
 * @typedef TurnBasedMatchSync
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).TurnBasedMatch[]} items The matches.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchSync.
 * @property {boolean} moreAvailable True if there were more matches available to fetch at the time the response was generated (which were not returned due to page size limits.)
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef TurnBasedMatchTurn
 * @memberOf! games(v1)
 * @type object
 * @property {games(v1).TurnBasedMatchDataRequest} data The shared game state data after the turn is over.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string games#turnBasedMatchTurn.
 * @property {integer} matchVersion The version of this match: an increasing counter, used to avoid out-of-date updates to the match.
 * @property {string} pendingParticipantId The ID of the participant who should take their turn next. May be set to the current player&#39;s participant ID to update match state without changing the turn. If not set, the match will wait for other player(s) to join via automatching; this is only valid if automatch criteria is set on the match with remaining slots for automatched players.
 * @property {games(v1).ParticipantResult[]} results The match results for the participants in the match.
 */
module.exports = Games;
