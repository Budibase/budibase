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
 * Google Play Game Services Management API
 *
 * The Management API for Google Play Game Services.
 *
 * @example
 * var google = require('googleapis');
 * var gamesManagement = google.gamesManagement('v1management');
 *
 * @namespace gamesManagement
 * @type {Function}
 * @version v1management
 * @variation v1management
 * @param {object=} options Options for Gamesmanagement
 */
function Gamesmanagement(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.achievements = {

    /**
     * gamesManagement.achievements.reset
     *
     * @desc Resets the achievement with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.achievements.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/achievements/{achievementId}/reset',
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
     * gamesManagement.achievements.resetAll
     *
     * @desc Resets all achievements for the currently authenticated player for your application. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.achievements.resetAll
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/achievements/reset',
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
     * gamesManagement.achievements.resetAllForAllPlayers
     *
     * @desc Resets all draft achievements for all players. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.achievements.resetAllForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAllForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/achievements/resetAllForAllPlayers',
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
     * gamesManagement.achievements.resetForAllPlayers
     *
     * @desc Resets the achievement with the given ID for all players. This method is only available to user accounts for your developer console. Only draft achievements can be reset.
     *
     * @alias gamesManagement.achievements.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.achievementId The ID of the achievement used by this method.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/achievements/{achievementId}/resetForAllPlayers',
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
     * gamesManagement.achievements.resetMultipleForAllPlayers
     *
     * @desc Resets achievements with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft achievements may be reset.
     *
     * @alias gamesManagement.achievements.resetMultipleForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {gamesManagement(v1management).AchievementResetMultipleForAllRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetMultipleForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/achievements/resetMultipleForAllPlayers',
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
     * gamesManagement.applications.listHidden
     *
     * @desc Get the list of players hidden from the given application. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.applications.listHidden
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {integer=} params.maxResults The maximum number of player resources to return in the response, used for paging. For any response, the actual number of player resources returned may be less than the specified maxResults.
     * @param {string=} params.pageToken The token returned by the previous request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    listHidden: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/applications/{applicationId}/players/hidden',
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
     * gamesManagement.events.reset
     *
     * @desc Resets all player progress on the event with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application. All quests for this player that use the event will also be reset.
     *
     * @alias gamesManagement.events.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.eventId The ID of the event.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/events/{eventId}/reset',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['eventId'],
        pathParams: ['eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesManagement.events.resetAll
     *
     * @desc Resets all player progress on all events for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application. All quests for this player will also be reset.
     *
     * @alias gamesManagement.events.resetAll
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/events/reset',
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
     * gamesManagement.events.resetAllForAllPlayers
     *
     * @desc Resets all draft events for all players. This method is only available to user accounts for your developer console. All quests that use any of these events will also be reset.
     *
     * @alias gamesManagement.events.resetAllForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAllForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/events/resetAllForAllPlayers',
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
     * gamesManagement.events.resetForAllPlayers
     *
     * @desc Resets the event with the given ID for all players. This method is only available to user accounts for your developer console. Only draft events can be reset. All quests that use the event will also be reset.
     *
     * @alias gamesManagement.events.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.eventId The ID of the event.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/events/{eventId}/resetForAllPlayers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['eventId'],
        pathParams: ['eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesManagement.events.resetMultipleForAllPlayers
     *
     * @desc Resets events with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft events may be reset. All quests that use any of the events will also be reset.
     *
     * @alias gamesManagement.events.resetMultipleForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {gamesManagement(v1management).EventsResetMultipleForAllRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetMultipleForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/events/resetMultipleForAllPlayers',
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

  self.players = {

    /**
     * gamesManagement.players.hide
     *
     * @desc Hide the given player's leaderboard scores from the given application. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.players.hide
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    hide: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/applications/{applicationId}/players/hidden/{playerId}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['applicationId', 'playerId'],
        pathParams: ['applicationId', 'playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesManagement.players.unhide
     *
     * @desc Unhide the given player's leaderboard scores from the given application. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.players.unhide
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.applicationId The application ID from the Google Play developer console.
     * @param {string} params.playerId A player ID. A value of me may be used in place of the authenticated player's ID.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    unhide: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/applications/{applicationId}/players/hidden/{playerId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['applicationId', 'playerId'],
        pathParams: ['applicationId', 'playerId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.quests = {

    /**
     * gamesManagement.quests.reset
     *
     * @desc Resets all player progress on the quest with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.quests.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.questId The ID of the quest.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/quests/{questId}/reset',
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
     * gamesManagement.quests.resetAll
     *
     * @desc Resets all player progress on all quests for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.quests.resetAll
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/quests/reset',
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
     * gamesManagement.quests.resetAllForAllPlayers
     *
     * @desc Resets all draft quests for all players. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.quests.resetAllForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAllForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/quests/resetAllForAllPlayers',
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
     * gamesManagement.quests.resetForAllPlayers
     *
     * @desc Resets all player progress on the quest with the given ID for all players. This method is only available to user accounts for your developer console. Only draft quests can be reset.
     *
     * @alias gamesManagement.quests.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.questId The ID of the quest.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/quests/{questId}/resetForAllPlayers',
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
     * gamesManagement.quests.resetMultipleForAllPlayers
     *
     * @desc Resets quests with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft quests may be reset.
     *
     * @alias gamesManagement.quests.resetMultipleForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {gamesManagement(v1management).QuestsResetMultipleForAllRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetMultipleForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/quests/resetMultipleForAllPlayers',
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

  self.rooms = {

    /**
     * gamesManagement.rooms.reset
     *
     * @desc Reset all rooms for the currently authenticated player for your application. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.rooms.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/rooms/reset',
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
     * gamesManagement.rooms.resetForAllPlayers
     *
     * @desc Deletes rooms where the only room participants are from whitelisted tester accounts for your application. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.rooms.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/rooms/resetForAllPlayers',
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

  self.scores = {

    /**
     * gamesManagement.scores.reset
     *
     * @desc Resets scores for the leaderboard with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.scores.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/leaderboards/{leaderboardId}/scores/reset',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesManagement.scores.resetAll
     *
     * @desc Resets all scores for all leaderboards for the currently authenticated players. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.scores.resetAll
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAll: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/scores/reset',
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
     * gamesManagement.scores.resetAllForAllPlayers
     *
     * @desc Resets scores for all draft leaderboards for all players. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.scores.resetAllForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetAllForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/scores/resetAllForAllPlayers',
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
     * gamesManagement.scores.resetForAllPlayers
     *
     * @desc Resets scores for the leaderboard with the given ID for all players. This method is only available to user accounts for your developer console. Only draft leaderboards can be reset.
     *
     * @alias gamesManagement.scores.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {string} params.leaderboardId The ID of the leaderboard.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/leaderboards/{leaderboardId}/scores/resetForAllPlayers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['leaderboardId'],
        pathParams: ['leaderboardId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * gamesManagement.scores.resetMultipleForAllPlayers
     *
     * @desc Resets scores for the leaderboards with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft leaderboards may be reset.
     *
     * @alias gamesManagement.scores.resetMultipleForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object} params Parameters for request
     * @param {gamesManagement(v1management).ScoresResetMultipleForAllRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetMultipleForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/scores/resetMultipleForAllPlayers',
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

  self.turnBasedMatches = {

    /**
     * gamesManagement.turnBasedMatches.reset
     *
     * @desc Reset all turn-based match data for a user. This method is only accessible to whitelisted tester accounts for your application.
     *
     * @alias gamesManagement.turnBasedMatches.reset
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reset: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/turnbasedmatches/reset',
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
     * gamesManagement.turnBasedMatches.resetForAllPlayers
     *
     * @desc Deletes turn-based matches where the only match participants are from whitelisted tester accounts for your application. This method is only available to user accounts for your developer console.
     *
     * @alias gamesManagement.turnBasedMatches.resetForAllPlayers
     * @memberOf! gamesManagement(v1management)
     *
     * @param {object=} params Parameters for request
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetForAllPlayers: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/games/v1management/turnbasedmatches/resetForAllPlayers',
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
}

/**
 * @typedef AchievementResetAllResponse
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#achievementResetAllResponse.
 * @property {gamesManagement(v1management).AchievementResetResponse[]} results The achievement reset results.
 */
/**
 * @typedef AchievementResetMultipleForAllRequest
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string[]} achievement_ids The IDs of achievements to reset.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#achievementResetMultipleForAllRequest.
 */
/**
 * @typedef AchievementResetResponse
 * @memberOf! gamesManagement(v1management)
 * @type object
* @property {string} currentState The current state of the achievement. This is the same as the initial state of the achievement.
Possible values are:  
- &quot;HIDDEN&quot;- Achievement is hidden. 
- &quot;REVEALED&quot; - Achievement is revealed. 
- &quot;UNLOCKED&quot; - Achievement is unlocked.
* @property {string} definitionId The ID of an achievement for which player state has been updated.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#achievementResetResponse.
* @property {boolean} updateOccurred Flag to indicate if the requested update actually occurred.
*/
/**
 * @typedef EventsResetMultipleForAllRequest
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string[]} event_ids The IDs of events to reset.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#eventsResetMultipleForAllRequest.
 */
/**
 * @typedef GamesPlayedResource
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {boolean} autoMatched True if the player was auto-matched with the currently authenticated user.
 * @property {string} timeMillis The last time the player played the game in milliseconds since the epoch in UTC.
 */
/**
 * @typedef GamesPlayerExperienceInfoResource
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} currentExperiencePoints The current number of experience points for the player.
 * @property {gamesManagement(v1management).GamesPlayerLevelResource} currentLevel The current level of the player.
 * @property {string} lastLevelUpTimestampMillis The timestamp when the player was leveled up, in millis since Unix epoch UTC.
 * @property {gamesManagement(v1management).GamesPlayerLevelResource} nextLevel The next level of the player. If the current level is the maximum level, this should be same as the current level.
 */
/**
 * @typedef GamesPlayerLevelResource
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {integer} level The level for the user.
 * @property {string} maxExperiencePoints The maximum experience points for this level.
 * @property {string} minExperiencePoints The minimum experience points for this level.
 */
/**
 * @typedef HiddenPlayer
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} hiddenTimeMillis The time this player was hidden.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#hiddenPlayer.
 * @property {gamesManagement(v1management).Player} player The player information.
 */
/**
 * @typedef HiddenPlayerList
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {gamesManagement(v1management).HiddenPlayer[]} items The players.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#hiddenPlayerList.
 * @property {string} nextPageToken The pagination token for the next page of results.
 */
/**
 * @typedef Player
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} avatarImageUrl The base URL for the image that represents the player.
 * @property {string} bannerUrlLandscape The url to the landscape mode player banner image.
 * @property {string} bannerUrlPortrait The url to the portrait mode player banner image.
 * @property {string} displayName The name to display for the player.
 * @property {gamesManagement(v1management).GamesPlayerExperienceInfoResource} experienceInfo An object to represent Play Game experience information for the player.
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#player.
 * @property {gamesManagement(v1management).GamesPlayedResource} lastPlayedWith Details about the last time this player played a multiplayer game with the currently authenticated player. Populated for PLAYED_WITH player collection members.
 * @property {object} name An object representation of the individual components of the player&#39;s name. For some players, these fields may not be present.
 * @property {string} originalPlayerId The player ID that was used for this player the first time they signed into the game in question. This is only populated for calls to player.get for the requesting player, only if the player ID has subsequently changed, and only to clients that support remapping player IDs.
 * @property {string} playerId The ID of the player.
 * @property {gamesManagement(v1management).ProfileSettings} profileSettings The player&#39;s profile settings. Controls whether or not the player&#39;s profile is visible to other players.
 * @property {string} title The player&#39;s title rewarded for their game activities.
 */
/**
 * @typedef PlayerScoreResetAllResponse
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#playerScoreResetResponse.
 * @property {gamesManagement(v1management).PlayerScoreResetResponse[]} results The leaderboard reset results.
 */
/**
 * @typedef PlayerScoreResetResponse
 * @memberOf! gamesManagement(v1management)
 * @type object
* @property {string} definitionId The ID of an leaderboard for which player state has been updated.
* @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#playerScoreResetResponse.
* @property {string[]} resetScoreTimeSpans The time spans of the updated score.
Possible values are:  
- &quot;ALL_TIME&quot; - The score is an all-time score. 
- &quot;WEEKLY&quot; - The score is a weekly score. 
- &quot;DAILY&quot; - The score is a daily score.
*/
/**
 * @typedef ProfileSettings
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#profileSettings.
 * @property {boolean} profileVisible The player&#39;s current profile visibility. This field is visible to both 1P and 3P APIs.
 */
/**
 * @typedef QuestsResetMultipleForAllRequest
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#questsResetMultipleForAllRequest.
 * @property {string[]} quest_ids The IDs of quests to reset.
 */
/**
 * @typedef ScoresResetMultipleForAllRequest
 * @memberOf! gamesManagement(v1management)
 * @type object
 * @property {string} kind Uniquely identifies the type of this resource. Value is always the fixed string gamesManagement#scoresResetMultipleForAllRequest.
 * @property {string[]} leaderboard_ids The IDs of leaderboards to reset.
 */
module.exports = Gamesmanagement;
