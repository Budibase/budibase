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
 * Calendar API
 *
 * Manipulates events and other calendar data.
 *
 * @example
 * var google = require('googleapis');
 * var calendar = google.calendar('v3');
 *
 * @namespace calendar
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Calendar
 */
function Calendar(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.acl = {

    /**
     * calendar.acl.delete
     *
     * @desc Deletes an access control rule.
     *
     * @alias calendar.acl.delete
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.ruleId ACL rule identifier.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl/{ruleId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'ruleId'],
        pathParams: ['calendarId', 'ruleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.get
     *
     * @desc Returns an access control rule.
     *
     * @alias calendar.acl.get
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.ruleId ACL rule identifier.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl/{ruleId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'ruleId'],
        pathParams: ['calendarId', 'ruleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.insert
     *
     * @desc Creates an access control rule.
     *
     * @alias calendar.acl.insert
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {calendar(v3).AclRule} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.list
     *
     * @desc Returns the rules in the access control list for the calendar.
     *
     * @alias calendar.acl.list
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {boolean=} params.showDeleted Whether to include deleted ACLs in the result. Deleted ACLs are represented by role equal to "none". Deleted ACLs will always be included if syncToken is provided. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All entries deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.patch
     *
     * @desc Updates an access control rule. This method supports patch semantics.
     *
     * @alias calendar.acl.patch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.ruleId ACL rule identifier.
     * @param {calendar(v3).AclRule} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl/{ruleId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'ruleId'],
        pathParams: ['calendarId', 'ruleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.update
     *
     * @desc Updates an access control rule.
     *
     * @alias calendar.acl.update
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.ruleId ACL rule identifier.
     * @param {calendar(v3).AclRule} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl/{ruleId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'ruleId'],
        pathParams: ['calendarId', 'ruleId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.acl.watch
     *
     * @desc Watch for changes to ACL resources.
     *
     * @alias calendar.acl.watch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {boolean=} params.showDeleted Whether to include deleted ACLs in the result. Deleted ACLs are represented by role equal to "none". Deleted ACLs will always be included if syncToken is provided. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All entries deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
     * @param {calendar(v3).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/acl/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.calendarList = {

    /**
     * calendar.calendarList.delete
     *
     * @desc Deletes an entry on the user's calendar list.
     *
     * @alias calendar.calendarList.delete
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList/{calendarId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendarList.get
     *
     * @desc Returns an entry on the user's calendar list.
     *
     * @alias calendar.calendarList.get
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList/{calendarId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendarList.insert
     *
     * @desc Adds an entry to the user's calendar list.
     *
     * @alias calendar.calendarList.insert
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.colorRgbFormat Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False.
     * @param {calendar(v3).CalendarListEntry} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
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
     * calendar.calendarList.list
     *
     * @desc Returns entries on the user's calendar list.
     *
     * @alias calendar.calendarList.list
     * @memberOf! calendar(v3)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.minAccessRole The minimum access role for the user in the returned entries. Optional. The default is no restriction.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {boolean=} params.showDeleted Whether to include deleted calendar list entries in the result. Optional. The default is False.
     * @param {boolean=} params.showHidden Whether to show hidden entries. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If only read-only fields such as calendar properties or ACLs have changed, the entry won't be returned. All entries deleted and hidden since the previous list request will always be in the result set and it is not allowed to set showDeleted neither showHidden to False. To ensure client state consistency minAccessRole query parameter cannot be specified together with nextSyncToken. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
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
     * calendar.calendarList.patch
     *
     * @desc Updates an entry on the user's calendar list. This method supports patch semantics.
     *
     * @alias calendar.calendarList.patch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {boolean=} params.colorRgbFormat Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False.
     * @param {calendar(v3).CalendarListEntry} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList/{calendarId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendarList.update
     *
     * @desc Updates an entry on the user's calendar list.
     *
     * @alias calendar.calendarList.update
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {boolean=} params.colorRgbFormat Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False.
     * @param {calendar(v3).CalendarListEntry} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList/{calendarId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendarList.watch
     *
     * @desc Watch for changes to CalendarList resources.
     *
     * @alias calendar.calendarList.watch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.minAccessRole The minimum access role for the user in the returned entries. Optional. The default is no restriction.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {boolean=} params.showDeleted Whether to include deleted calendar list entries in the result. Optional. The default is False.
     * @param {boolean=} params.showHidden Whether to show hidden entries. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If only read-only fields such as calendar properties or ACLs have changed, the entry won't be returned. All entries deleted and hidden since the previous list request will always be in the result set and it is not allowed to set showDeleted neither showHidden to False. To ensure client state consistency minAccessRole query parameter cannot be specified together with nextSyncToken. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
     * @param {calendar(v3).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList/watch',
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

  self.calendars = {

    /**
     * calendar.calendars.clear
     *
     * @desc Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account.
     *
     * @alias calendar.calendars.clear
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    clear: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/clear',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendars.delete
     *
     * @desc Deletes a secondary calendar. Use calendars.clear for clearing all events on primary calendars.
     *
     * @alias calendar.calendars.delete
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendars.get
     *
     * @desc Returns metadata for a calendar.
     *
     * @alias calendar.calendars.get
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendars.insert
     *
     * @desc Creates a secondary calendar.
     *
     * @alias calendar.calendars.insert
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {calendar(v3).Calendar} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars',
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
     * calendar.calendars.patch
     *
     * @desc Updates metadata for a calendar. This method supports patch semantics.
     *
     * @alias calendar.calendars.patch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {calendar(v3).Calendar} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.calendars.update
     *
     * @desc Updates metadata for a calendar.
     *
     * @alias calendar.calendars.update
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {calendar(v3).Calendar} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channels = {

    /**
     * calendar.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias calendar.channels.stop
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {calendar(v3).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/channels/stop',
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

  self.colors = {

    /**
     * calendar.colors.get
     *
     * @desc Returns the color definitions for calendars and events.
     *
     * @alias calendar.colors.get
     * @memberOf! calendar(v3)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/calendar/v3/colors',
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

  self.events = {

    /**
     * calendar.events.delete
     *
     * @desc Deletes an event.
     *
     * @alias calendar.events.delete
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.eventId Event identifier.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the deletion of the event. Optional. The default is False.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.get
     *
     * @desc Returns an event.
     *
     * @alias calendar.events.get
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.eventId Event identifier.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {string=} params.timeZone Time zone used in the response. Optional. The default is the time zone of the calendar.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.import
     *
     * @desc Imports an event. This operation is used to add a private copy of an existing event to a calendar.
     *
     * @alias calendar.events.import
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {boolean=} params.supportsAttachments Whether API client performing operation supports event attachments. Optional. The default is False.
     * @param {calendar(v3).Event} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    import: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/import',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.insert
     *
     * @desc Creates an event.
     *
     * @alias calendar.events.insert
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the creation of the new event. Optional. The default is False.
     * @param {boolean=} params.supportsAttachments Whether API client performing operation supports event attachments. Optional. The default is False.
     * @param {calendar(v3).Event} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.instances
     *
     * @desc Returns instances of the specified recurring event.
     *
     * @alias calendar.events.instances
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.eventId Recurring event identifier.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {integer=} params.maxResults Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.
     * @param {string=} params.originalStart The original start time of the instance in the result. Optional.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {boolean=} params.showDeleted Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events will still be included if singleEvents is False. Optional. The default is False.
     * @param {string=} params.timeMax Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset.
     * @param {string=} params.timeMin Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset.
     * @param {string=} params.timeZone Time zone used in the response. Optional. The default is the time zone of the calendar.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    instances: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}/instances',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.list
     *
     * @desc Returns events on the specified calendar.
     *
     * @alias calendar.events.list
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string=} params.iCalUID Specifies event ID in the iCalendar format to be included in the response. Optional.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {integer=} params.maxResults Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.
     * @param {string=} params.orderBy The order of the events returned in the result. Optional. The default is an unspecified, stable order.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {string=} params.privateExtendedProperty Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.
     * @param {string=} params.q Free text search terms to find events that match these terms in any field, except for extended properties. Optional.
     * @param {string=} params.sharedExtendedProperty Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.
     * @param {boolean=} params.showDeleted Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.
     * @param {boolean=} params.showHiddenInvitations Whether to include hidden invitations in the result. Optional. The default is False.
     * @param {boolean=} params.singleEvents Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. There are several query parameters that cannot be specified together with nextSyncToken to ensure consistency of the client state.  These are:  - iCalUID  - orderBy  - privateExtendedProperty  - q  - sharedExtendedProperty  - timeMin  - timeMax  - updatedMin If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
     * @param {string=} params.timeMax Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, e.g., 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but will be ignored.
     * @param {string=} params.timeMin Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, e.g., 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but will be ignored.
     * @param {string=} params.timeZone Time zone used in the response. Optional. The default is the time zone of the calendar.
     * @param {string=} params.updatedMin Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.move
     *
     * @desc Moves an event to another calendar, i.e. changes an event's organizer.
     *
     * @alias calendar.events.move
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier of the source calendar where the event currently is on.
     * @param {string} params.destination Calendar identifier of the target calendar where the event is to be moved to.
     * @param {string} params.eventId Event identifier.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the change of the event's organizer. Optional. The default is False.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    move: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}/move',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId', 'destination'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.patch
     *
     * @desc Updates an event. This method supports patch semantics.
     *
     * @alias calendar.events.patch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.eventId Event identifier.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the event update (e.g. attendee's responses, title changes, etc.). Optional. The default is False.
     * @param {boolean=} params.supportsAttachments Whether API client performing operation supports event attachments. Optional. The default is False.
     * @param {calendar(v3).Event} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.quickAdd
     *
     * @desc Creates an event based on a simple text string.
     *
     * @alias calendar.events.quickAdd
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the creation of the event. Optional. The default is False.
     * @param {string} params.text The text describing the event to be created.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    quickAdd: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/quickAdd',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'text'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.update
     *
     * @desc Updates an event.
     *
     * @alias calendar.events.update
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string} params.eventId Event identifier.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {boolean=} params.sendNotifications Whether to send notifications about the event update (e.g. attendee's responses, title changes, etc.). Optional. The default is False.
     * @param {boolean=} params.supportsAttachments Whether API client performing operation supports event attachments. Optional. The default is False.
     * @param {calendar(v3).Event} params.resource Request body data
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
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['calendarId', 'eventId'],
        pathParams: ['calendarId', 'eventId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.events.watch
     *
     * @desc Watch for changes to Events resources.
     *
     * @alias calendar.events.watch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.alwaysIncludeEmail Whether to always include a value in the email field for the organizer, creator and attendees, even if no real email is available (i.e. a generated, non-working value will be provided). The use of this option is discouraged and should only be used by clients which cannot handle the absence of an email address value in the mentioned places. Optional. The default is False.
     * @param {string} params.calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
     * @param {string=} params.iCalUID Specifies event ID in the iCalendar format to be included in the response. Optional.
     * @param {integer=} params.maxAttendees The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
     * @param {integer=} params.maxResults Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.
     * @param {string=} params.orderBy The order of the events returned in the result. Optional. The default is an unspecified, stable order.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {string=} params.privateExtendedProperty Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.
     * @param {string=} params.q Free text search terms to find events that match these terms in any field, except for extended properties. Optional.
     * @param {string=} params.sharedExtendedProperty Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.
     * @param {boolean=} params.showDeleted Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.
     * @param {boolean=} params.showHiddenInvitations Whether to include hidden invitations in the result. Optional. The default is False.
     * @param {boolean=} params.singleEvents Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. There are several query parameters that cannot be specified together with nextSyncToken to ensure consistency of the client state.  These are:  - iCalUID  - orderBy  - privateExtendedProperty  - q  - sharedExtendedProperty  - timeMin  - timeMax  - updatedMin If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
     * @param {string=} params.timeMax Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, e.g., 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but will be ignored.
     * @param {string=} params.timeMin Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, e.g., 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but will be ignored.
     * @param {string=} params.timeZone Time zone used in the response. Optional. The default is the time zone of the calendar.
     * @param {string=} params.updatedMin Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.
     * @param {calendar(v3).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['calendarId'],
        pathParams: ['calendarId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.freebusy = {

    /**
     * calendar.freebusy.query
     *
     * @desc Returns free/busy information for a set of calendars.
     *
     * @alias calendar.freebusy.query
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {calendar(v3).FreeBusyRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    query: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/freeBusy',
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

  self.settings = {

    /**
     * calendar.settings.get
     *
     * @desc Returns a single user setting.
     *
     * @alias calendar.settings.get
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.setting The id of the user setting.
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/settings/{setting}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['setting'],
        pathParams: ['setting'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * calendar.settings.list
     *
     * @desc Returns all user settings for the authenticated user.
     *
     * @alias calendar.settings.list
     * @memberOf! calendar(v3)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
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
          url: 'https://www.googleapis.com/calendar/v3/users/me/settings',
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
     * calendar.settings.watch
     *
     * @desc Watch for changes to Settings resources.
     *
     * @alias calendar.settings.watch
     * @memberOf! calendar(v3)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
     * @param {string=} params.pageToken Token specifying which result page to return. Optional.
     * @param {string=} params.syncToken Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. Learn more about incremental synchronization. Optional. The default is to return all entries.
     * @param {calendar(v3).Channel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    watch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/calendar/v3/users/me/settings/watch',
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
 * @typedef Acl
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} etag ETag of the collection.
 * @property {calendar(v3).AclRule[]} items List of rules on the access control list.
 * @property {string} kind Type of the collection (&quot;calendar#acl&quot;).
 * @property {string} nextPageToken Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
 * @property {string} nextSyncToken Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
 */
/**
 * @typedef AclRule
 * @memberOf! calendar(v3)
 * @type object
* @property {string} etag ETag of the resource.
* @property {string} id Identifier of the ACL rule.
* @property {string} kind Type of the resource (&quot;calendar#aclRule&quot;).
* @property {string} role The role assigned to the scope. Possible values are:  
- &quot;none&quot; - Provides no access. 
- &quot;freeBusyReader&quot; - Provides read access to free/busy information. 
- &quot;reader&quot; - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. 
- &quot;writer&quot; - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. 
- &quot;owner&quot; - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
* @property {object} scope The scope of the rule.
*/
/**
 * @typedef Calendar
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} description Description of the calendar. Optional.
 * @property {string} etag ETag of the resource.
 * @property {string} id Identifier of the calendar. To retrieve IDs call the calendarList.list() method.
 * @property {string} kind Type of the resource (&quot;calendar#calendar&quot;).
 * @property {string} location Geographic location of the calendar as free-form text. Optional.
 * @property {string} summary Title of the calendar.
 * @property {string} timeZone The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. &quot;Europe/Zurich&quot;.) Optional.
 */
/**
 * @typedef CalendarList
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} etag ETag of the collection.
 * @property {calendar(v3).CalendarListEntry[]} items Calendars that are present on the user&#39;s calendar list.
 * @property {string} kind Type of the collection (&quot;calendar#calendarList&quot;).
 * @property {string} nextPageToken Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
 * @property {string} nextSyncToken Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
 */
/**
 * @typedef CalendarListEntry
 * @memberOf! calendar(v3)
 * @type object
* @property {string} accessRole The effective access role that the authenticated user has on the calendar. Read-only. Possible values are:  
- &quot;freeBusyReader&quot; - Provides read access to free/busy information. 
- &quot;reader&quot; - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. 
- &quot;writer&quot; - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. 
- &quot;owner&quot; - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
* @property {string} backgroundColor The main color of the calendar in the hexadecimal format &quot;#0088aa&quot;. This property supersedes the index-based colorId property. To set or change this property, you need to specify colorRgbFormat=true in the parameters of the insert, update and patch methods. Optional.
* @property {string} colorId The color of the calendar. This is an ID referring to an entry in the calendar section of the colors definition (see the colors endpoint). This property is superseded by the backgroundColor and foregroundColor properties and can be ignored when using these properties. Optional.
* @property {calendar(v3).EventReminder[]} defaultReminders The default reminders that the authenticated user has for this calendar.
* @property {boolean} deleted Whether this calendar list entry has been deleted from the calendar list. Read-only. Optional. The default is False.
* @property {string} description Description of the calendar. Optional. Read-only.
* @property {string} etag ETag of the resource.
* @property {string} foregroundColor The foreground color of the calendar in the hexadecimal format &quot;#ffffff&quot;. This property supersedes the index-based colorId property. To set or change this property, you need to specify colorRgbFormat=true in the parameters of the insert, update and patch methods. Optional.
* @property {boolean} hidden Whether the calendar has been hidden from the list. Optional. The default is False.
* @property {string} id Identifier of the calendar.
* @property {string} kind Type of the resource (&quot;calendar#calendarListEntry&quot;).
* @property {string} location Geographic location of the calendar as free-form text. Optional. Read-only.
* @property {object} notificationSettings The notifications that the authenticated user is receiving for this calendar.
* @property {boolean} primary Whether the calendar is the primary calendar of the authenticated user. Read-only. Optional. The default is False.
* @property {boolean} selected Whether the calendar content shows up in the calendar UI. Optional. The default is False.
* @property {string} summary Title of the calendar. Read-only.
* @property {string} summaryOverride The summary that the authenticated user has set for this calendar. Optional.
* @property {string} timeZone The time zone of the calendar. Optional. Read-only.
*/
/**
 * @typedef CalendarNotification
 * @memberOf! calendar(v3)
 * @type object
* @property {string} method The method used to deliver the notification. Possible values are:  
- &quot;email&quot; - Reminders are sent via email. 
- &quot;sms&quot; - Reminders are sent via SMS. This value is read-only and is ignored on inserts and updates. SMS reminders are only available for Google Apps for Work, Education, and Government customers.
* @property {string} type The type of notification. Possible values are:  
- &quot;eventCreation&quot; - Notification sent when a new event is put on the calendar. 
- &quot;eventChange&quot; - Notification sent when an event is changed. 
- &quot;eventCancellation&quot; - Notification sent when an event is cancelled. 
- &quot;eventResponse&quot; - Notification sent when an event is changed. 
- &quot;agenda&quot; - An agenda with the events of the day (sent out in the morning).
*/
/**
 * @typedef Channel
 * @memberOf! calendar(v3)
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
 * @typedef ColorDefinition
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} background The background color associated with this color definition.
 * @property {string} foreground The foreground color that can be used to write on top of a background with &#39;background&#39; color.
 */
/**
 * @typedef Colors
 * @memberOf! calendar(v3)
 * @type object
 * @property {object} calendar A global palette of calendar colors, mapping from the color ID to its definition. A calendarListEntry resource refers to one of these color IDs in its color field. Read-only.
 * @property {object} event A global palette of event colors, mapping from the color ID to its definition. An event resource may refer to one of these color IDs in its color field. Read-only.
 * @property {string} kind Type of the resource (&quot;calendar#colors&quot;).
 * @property {string} updated Last modification time of the color palette (as a RFC3339 timestamp). Read-only.
 */
/**
 * @typedef Error
 * @memberOf! calendar(v3)
 * @type object
* @property {string} domain Domain, or broad category, of the error.
* @property {string} reason Specific reason for the error. Some of the possible values are:  
- &quot;groupTooBig&quot; - The group of users requested is too large for a single query. 
- &quot;tooManyCalendarsRequested&quot; - The number of calendars requested is too large for a single query. 
- &quot;notFound&quot; - The requested resource was not found. 
- &quot;internalError&quot; - The API service has encountered an internal error.  Additional error types may be added in the future, so clients should gracefully handle additional error statuses not included in this list.
*/
/**
 * @typedef Event
 * @memberOf! calendar(v3)
 * @type object
* @property {boolean} anyoneCanAddSelf Whether anyone can invite themselves to the event (currently works for Google+ events only). Optional. The default is False.
* @property {calendar(v3).EventAttachment[]} attachments File attachments for the event. Currently only Google Drive attachments are supported.
In order to modify attachments the supportsAttachments request parameter should be set to true.
There can be at most 25 attachments per event,
* @property {calendar(v3).EventAttendee[]} attendees The attendees of the event. See the Events with attendees guide for more information on scheduling events with other calendar users.
* @property {boolean} attendeesOmitted Whether attendees may have been omitted from the event&#39;s representation. When retrieving an event, this may be due to a restriction specified by the maxAttendee query parameter. When updating an event, this can be used to only update the participant&#39;s response. Optional. The default is False.
* @property {string} colorId The color of the event. This is an ID referring to an entry in the event section of the colors definition (see the  colors endpoint). Optional.
* @property {string} created Creation time of the event (as a RFC3339 timestamp). Read-only.
* @property {object} creator The creator of the event. Read-only.
* @property {string} description Description of the event. Optional.
* @property {calendar(v3).EventDateTime} end The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.
* @property {boolean} endTimeUnspecified Whether the end time is actually unspecified. An end time is still provided for compatibility reasons, even if this attribute is set to True. The default is False.
* @property {string} etag ETag of the resource.
* @property {object} extendedProperties Extended properties of the event.
* @property {object} gadget A gadget that extends this event.
* @property {boolean} guestsCanInviteOthers Whether attendees other than the organizer can invite others to the event. Optional. The default is True.
* @property {boolean} guestsCanModify Whether attendees other than the organizer can modify the event. Optional. The default is False.
* @property {boolean} guestsCanSeeOtherGuests Whether attendees other than the organizer can see who the event&#39;s attendees are. Optional. The default is True.
* @property {string} hangoutLink An absolute link to the Google+ hangout associated with this event. Read-only.
* @property {string} htmlLink An absolute link to this event in the Google Calendar Web UI. Read-only.
* @property {string} iCalUID Event unique identifier as defined in RFC5545. It is used to uniquely identify events accross calendaring systems and must be supplied when importing events via the import method.
Note that the icalUID and the id are not identical and only one of them should be supplied at event creation time. One difference in their semantics is that in recurring events, all occurrences of one event have different ids while they all share the same icalUIDs.
* @property {string} id Opaque identifier of the event. When creating new single or recurring events, you can specify their IDs. Provided IDs must follow these rules:  
- characters allowed in the ID are those used in base32hex encoding, i.e. lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938 
- the length of the ID must be between 5 and 1024 characters 
- the ID must be unique per calendar  Due to the globally distributed nature of the system, we cannot guarantee that ID collisions will be detected at event creation time. To minimize the risk of collisions we recommend using an established UUID algorithm such as one described in RFC4122.
If you do not specify an ID, it will be automatically generated by the server.
Note that the icalUID and the id are not identical and only one of them should be supplied at event creation time. One difference in their semantics is that in recurring events, all occurrences of one event have different ids while they all share the same icalUIDs.
* @property {string} kind Type of the resource (&quot;calendar#event&quot;).
* @property {string} location Geographic location of the event as free-form text. Optional.
* @property {boolean} locked Whether this is a locked event copy where no changes can be made to the main event fields &quot;summary&quot;, &quot;description&quot;, &quot;location&quot;, &quot;start&quot;, &quot;end&quot; or &quot;recurrence&quot;. The default is False. Read-Only.
* @property {object} organizer The organizer of the event. If the organizer is also an attendee, this is indicated with a separate entry in attendees with the organizer field set to True. To change the organizer, use the move operation. Read-only, except when importing an event.
* @property {calendar(v3).EventDateTime} originalStartTime For an instance of a recurring event, this is the time at which this event would start according to the recurrence data in the recurring event identified by recurringEventId. Immutable.
* @property {boolean} privateCopy Whether this is a private event copy where changes are not shared with other copies on other calendars. Optional. Immutable. The default is False.
* @property {string[]} recurrence List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events.
* @property {string} recurringEventId For an instance of a recurring event, this is the id of the recurring event to which this instance belongs. Immutable.
* @property {object} reminders Information about the event&#39;s reminders for the authenticated user.
* @property {integer} sequence Sequence number as per iCalendar.
* @property {object} source Source from which the event was created. For example, a web page, an email message or any document identifiable by an URL with HTTP or HTTPS scheme. Can only be seen or modified by the creator of the event.
* @property {calendar(v3).EventDateTime} start The (inclusive) start time of the event. For a recurring event, this is the start time of the first instance.
* @property {string} status Status of the event. Optional. Possible values are:  
- &quot;confirmed&quot; - The event is confirmed. This is the default status. 
- &quot;tentative&quot; - The event is tentatively confirmed. 
- &quot;cancelled&quot; - The event is cancelled.
* @property {string} summary Title of the event.
* @property {string} transparency Whether the event blocks time on the calendar. Optional. Possible values are:  
- &quot;opaque&quot; - The event blocks time on the calendar. This is the default value. 
- &quot;transparent&quot; - The event does not block time on the calendar.
* @property {string} updated Last modification time of the event (as a RFC3339 timestamp). Read-only.
* @property {string} visibility Visibility of the event. Optional. Possible values are:  
- &quot;default&quot; - Uses the default visibility for events on the calendar. This is the default value. 
- &quot;public&quot; - The event is public and event details are visible to all readers of the calendar. 
- &quot;private&quot; - The event is private and only event attendees may view event details. 
- &quot;confidential&quot; - The event is private. This value is provided for compatibility reasons.
*/
/**
 * @typedef EventAttachment
 * @memberOf! calendar(v3)
 * @type object
* @property {string} fileId ID of the attached file. Read-only.
For Google Drive files, this is the ID of the corresponding Files resource entry in the Drive API.
* @property {string} fileUrl URL link to the attachment.
For adding Google Drive file attachments use the same format as in alternateLink property of the Files resource in the Drive API.
* @property {string} iconLink URL link to the attachment&#39;s icon. Read-only.
* @property {string} mimeType Internet media type (MIME type) of the attachment.
* @property {string} title Attachment title.
*/
/**
 * @typedef EventAttendee
 * @memberOf! calendar(v3)
 * @type object
* @property {integer} additionalGuests Number of additional guests. Optional. The default is 0.
* @property {string} comment The attendee&#39;s response comment. Optional.
* @property {string} displayName The attendee&#39;s name, if available. Optional.
* @property {string} email The attendee&#39;s email address, if available. This field must be present when adding an attendee. It must be a valid email address as per RFC5322.
* @property {string} id The attendee&#39;s Profile ID, if available. It corresponds to theid field in the People collection of the Google+ API
* @property {boolean} optional Whether this is an optional attendee. Optional. The default is False.
* @property {boolean} organizer Whether the attendee is the organizer of the event. Read-only. The default is False.
* @property {boolean} resource Whether the attendee is a resource. Read-only. The default is False.
* @property {string} responseStatus The attendee&#39;s response status. Possible values are:  
- &quot;needsAction&quot; - The attendee has not responded to the invitation. 
- &quot;declined&quot; - The attendee has declined the invitation. 
- &quot;tentative&quot; - The attendee has tentatively accepted the invitation. 
- &quot;accepted&quot; - The attendee has accepted the invitation.
* @property {boolean} self Whether this entry represents the calendar on which this copy of the event appears. Read-only. The default is False.
*/
/**
 * @typedef EventDateTime
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} date The date, in the format &quot;yyyy-mm-dd&quot;, if this is an all-day event.
 * @property {string} dateTime The time, as a combined date-time value (formatted according to RFC3339). A time zone offset is required unless a time zone is explicitly specified in timeZone.
 * @property {string} timeZone The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. &quot;Europe/Zurich&quot;.) For recurring events this field is required and specifies the time zone in which the recurrence is expanded. For single events this field is optional and indicates a custom time zone for the event start/end.
 */
/**
 * @typedef EventReminder
 * @memberOf! calendar(v3)
 * @type object
* @property {string} method The method used by this reminder. Possible values are:  
- &quot;email&quot; - Reminders are sent via email. 
- &quot;sms&quot; - Reminders are sent via SMS. These are only available for Google Apps for Work, Education, and Government customers. Requests to set SMS reminders for other account types are ignored. 
- &quot;popup&quot; - Reminders are sent via a UI popup.
* @property {integer} minutes Number of minutes before the start of the event when the reminder should trigger. Valid values are between 0 and 40320 (4 weeks in minutes).
*/
/**
 * @typedef Events
 * @memberOf! calendar(v3)
 * @type object
* @property {string} accessRole The user&#39;s access role for this calendar. Read-only. Possible values are:  
- &quot;none&quot; - The user has no access. 
- &quot;freeBusyReader&quot; - The user has read access to free/busy information. 
- &quot;reader&quot; - The user has read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. 
- &quot;writer&quot; - The user has read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. 
- &quot;owner&quot; - The user has ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
* @property {calendar(v3).EventReminder[]} defaultReminders The default reminders on the calendar for the authenticated user. These reminders apply to all events on this calendar that do not explicitly override them (i.e. do not have reminders.useDefault set to True).
* @property {string} description Description of the calendar. Read-only.
* @property {string} etag ETag of the collection.
* @property {calendar(v3).Event[]} items List of events on the calendar.
* @property {string} kind Type of the collection (&quot;calendar#events&quot;).
* @property {string} nextPageToken Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
* @property {string} nextSyncToken Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
* @property {string} summary Title of the calendar. Read-only.
* @property {string} timeZone The time zone of the calendar. Read-only.
* @property {string} updated Last modification time of the calendar (as a RFC3339 timestamp). Read-only.
*/
/**
 * @typedef FreeBusyCalendar
 * @memberOf! calendar(v3)
 * @type object
 * @property {calendar(v3).TimePeriod[]} busy List of time ranges during which this calendar should be regarded as busy.
 * @property {calendar(v3).Error[]} errors Optional error(s) (if computation for the calendar failed).
 */
/**
 * @typedef FreeBusyGroup
 * @memberOf! calendar(v3)
 * @type object
 * @property {string[]} calendars List of calendars&#39; identifiers within a group.
 * @property {calendar(v3).Error[]} errors Optional error(s) (if computation for the group failed).
 */
/**
 * @typedef FreeBusyRequest
 * @memberOf! calendar(v3)
 * @type object
 * @property {integer} calendarExpansionMax Maximal number of calendars for which FreeBusy information is to be provided. Optional.
 * @property {integer} groupExpansionMax Maximal number of calendar identifiers to be provided for a single group. Optional. An error will be returned for a group with more members than this value.
 * @property {calendar(v3).FreeBusyRequestItem[]} items List of calendars and/or groups to query.
 * @property {string} timeMax The end of the interval for the query.
 * @property {string} timeMin The start of the interval for the query.
 * @property {string} timeZone Time zone used in the response. Optional. The default is UTC.
 */
/**
 * @typedef FreeBusyRequestItem
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} id The identifier of a calendar or a group.
 */
/**
 * @typedef FreeBusyResponse
 * @memberOf! calendar(v3)
 * @type object
 * @property {object} calendars List of free/busy information for calendars.
 * @property {object} groups Expansion of groups.
 * @property {string} kind Type of the resource (&quot;calendar#freeBusy&quot;).
 * @property {string} timeMax The end of the interval.
 * @property {string} timeMin The start of the interval.
 */
/**
 * @typedef Setting
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} id The id of the user setting.
 * @property {string} kind Type of the resource (&quot;calendar#setting&quot;).
 * @property {string} value Value of the user setting. The format of the value depends on the ID of the setting. It must always be a UTF-8 string of length up to 1024 characters.
 */
/**
 * @typedef Settings
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} etag Etag of the collection.
 * @property {calendar(v3).Setting[]} items List of user settings.
 * @property {string} kind Type of the collection (&quot;calendar#settings&quot;).
 * @property {string} nextPageToken Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
 * @property {string} nextSyncToken Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
 */
/**
 * @typedef TimePeriod
 * @memberOf! calendar(v3)
 * @type object
 * @property {string} end The (exclusive) end of the time period.
 * @property {string} start The (inclusive) start of the time period.
 */
module.exports = Calendar;
