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
 * Admin Reports API
 *
 * Fetches reports for the administrators of Google Apps customers about the usage, collaboration, security, and risk for their users.
 *
 * @example
 * var google = require('googleapis');
 * var admin = google.admin('reports_v1');
 *
 * @namespace admin
 * @type {Function}
 * @version reports_v1
 * @variation reports_v1
 * @param {object=} options Options for Admin
 */
function Admin(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.activities = {

    /**
     * reports.activities.list
     *
     * @desc Retrieves a list of activities for a specific customer and application.
     *
     * @alias reports.activities.list
     * @memberOf! admin(reports_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.actorIpAddress IP Address of host where the event was performed. Supports both IPv4 and IPv6 addresses.
     * @param {string} params.applicationName Application name for which the events are to be retrieved.
     * @param {string=} params.customerId Represents the customer for which the data is to be fetched.
     * @param {string=} params.endTime Return events which occured at or before this time.
     * @param {string=} params.eventName Name of the event being queried.
     * @param {string=} params.filters Event parameters in the form [parameter1 name][operator][parameter1 value],[parameter2 name][operator][parameter2 value],...
     * @param {integer=} params.maxResults Number of activity records to be shown in each page.
     * @param {string=} params.pageToken Token to specify next page.
     * @param {string=} params.startTime Return events which occured at or after this time.
     * @param {string} params.userKey Represents the profile id or the user email for which the data should be filtered. When 'all' is specified as the userKey, it returns usageReports for all users.
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
          url: 'https://www.googleapis.com/admin/reports/v1/activity/users/{userKey}/applications/{applicationName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey', 'applicationName'],
        pathParams: ['applicationName', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * reports.activities.watch
     *
     * @desc Push changes to activities
     *
     * @alias reports.activities.watch
     * @memberOf! admin(reports_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.actorIpAddress IP Address of host where the event was performed. Supports both IPv4 and IPv6 addresses.
     * @param {string} params.applicationName Application name for which the events are to be retrieved.
     * @param {string=} params.customerId Represents the customer for which the data is to be fetched.
     * @param {string=} params.endTime Return events which occured at or before this time.
     * @param {string=} params.eventName Name of the event being queried.
     * @param {string=} params.filters Event parameters in the form [parameter1 name][operator][parameter1 value],[parameter2 name][operator][parameter2 value],...
     * @param {integer=} params.maxResults Number of activity records to be shown in each page.
     * @param {string=} params.pageToken Token to specify next page.
     * @param {string=} params.startTime Return events which occured at or after this time.
     * @param {string} params.userKey Represents the profile id or the user email for which the data should be filtered. When 'all' is specified as the userKey, it returns usageReports for all users.
     * @param {admin(reports_v1).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/reports/v1/activity/users/{userKey}/applications/{applicationName}/watch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['userKey', 'applicationName'],
        pathParams: ['applicationName', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.channels = {

    /**
     * admin.channels.stop
     *
     * @desc Stop watching resources through this channel
     *
     * @alias admin.channels.stop
     * @memberOf! admin(reports_v1)
     *
     * @param {object} params Parameters for request
     * @param {admin(reports_v1).Channel} params.resource Request body data
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
          url: 'https://www.googleapis.com/admin/reports/v1/admin/reports_v1/channels/stop',
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

  self.customerUsageReports = {

    /**
     * reports.customerUsageReports.get
     *
     * @desc Retrieves a report which is a collection of properties / statistics for a specific customer.
     *
     * @alias reports.customerUsageReports.get
     * @memberOf! admin(reports_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customerId Represents the customer for which the data is to be fetched.
     * @param {string} params.date Represents the date in yyyy-mm-dd format for which the data is to be fetched.
     * @param {string=} params.pageToken Token to specify next page.
     * @param {string=} params.parameters Represents the application name, parameter name pairs to fetch in csv as app_name1:param_name1, app_name2:param_name2.
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
          url: 'https://www.googleapis.com/admin/reports/v1/usage/dates/{date}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['date'],
        pathParams: ['date'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.userUsageReport = {

    /**
     * reports.userUsageReport.get
     *
     * @desc Retrieves a report which is a collection of properties / statistics for a set of users.
     *
     * @alias reports.userUsageReport.get
     * @memberOf! admin(reports_v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.customerId Represents the customer for which the data is to be fetched.
     * @param {string} params.date Represents the date in yyyy-mm-dd format for which the data is to be fetched.
     * @param {string=} params.filters Represents the set of filters including parameter operator value.
     * @param {integer=} params.maxResults Maximum number of results to return. Maximum allowed is 1000
     * @param {string=} params.pageToken Token to specify next page.
     * @param {string=} params.parameters Represents the application name, parameter name pairs to fetch in csv as app_name1:param_name1, app_name2:param_name2.
     * @param {string} params.userKey Represents the profile id or the user email for which the data should be filtered.
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
          url: 'https://www.googleapis.com/admin/reports/v1/usage/users/{userKey}/dates/{date}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userKey', 'date'],
        pathParams: ['date', 'userKey'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Activities
 * @memberOf! admin(reports_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {admin(reports_v1).Activity[]} items Each record in read response.
 * @property {string} kind Kind of list response this is.
 * @property {string} nextPageToken Token for retrieving the next page
 */
/**
 * @typedef Activity
 * @memberOf! admin(reports_v1)
 * @type object
 * @property {object} actor User doing the action.
 * @property {string} etag ETag of the entry.
 * @property {object[]} events Activity events.
 * @property {object} id Unique identifier for each activity record.
 * @property {string} ipAddress IP Address of the user doing the action.
 * @property {string} kind Kind of resource this is.
 * @property {string} ownerDomain Domain of source customer.
 */
/**
 * @typedef Channel
 * @memberOf! admin(reports_v1)
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
 * @typedef UsageReport
 * @memberOf! admin(reports_v1)
 * @type object
 * @property {string} date The date to which the record belongs.
 * @property {object} entity Information about the type of the item.
 * @property {string} etag ETag of the resource.
 * @property {string} kind The kind of object.
 * @property {object[]} parameters Parameter value pairs for various applications.
 */
/**
 * @typedef UsageReports
 * @memberOf! admin(reports_v1)
 * @type object
 * @property {string} etag ETag of the resource.
 * @property {string} kind The kind of object.
 * @property {string} nextPageToken Token for retrieving the next page
 * @property {admin(reports_v1).UsageReport[]} usageReports Various application parameter records.
 * @property {object[]} warnings Warnings if any.
 */
module.exports = Admin;
