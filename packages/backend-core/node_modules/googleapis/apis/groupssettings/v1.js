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
 * Groups Settings API
 *
 * Lets you manage permission levels and related settings of a group.
 *
 * @example
 * var google = require('googleapis');
 * var groupssettings = google.groupssettings('v1');
 *
 * @namespace groupssettings
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Groupssettings
 */
function Groupssettings(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.groups = {

    /**
     * groupsSettings.groups.get
     *
     * @desc Gets one resource by id.
     *
     * @alias groupsSettings.groups.get
     * @memberOf! groupssettings(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupUniqueId The resource ID
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
          url: 'https://www.googleapis.com/groups/v1/groups/{groupUniqueId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['groupUniqueId'],
        pathParams: ['groupUniqueId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * groupsSettings.groups.patch
     *
     * @desc Updates an existing resource. This method supports patch semantics.
     *
     * @alias groupsSettings.groups.patch
     * @memberOf! groupssettings(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupUniqueId The resource ID
     * @param {groupssettings(v1).Groups} params.resource Request body data
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
          url: 'https://www.googleapis.com/groups/v1/groups/{groupUniqueId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['groupUniqueId'],
        pathParams: ['groupUniqueId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * groupsSettings.groups.update
     *
     * @desc Updates an existing resource.
     *
     * @alias groupsSettings.groups.update
     * @memberOf! groupssettings(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupUniqueId The resource ID
     * @param {groupssettings(v1).Groups} params.resource Request body data
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
          url: 'https://www.googleapis.com/groups/v1/groups/{groupUniqueId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['groupUniqueId'],
        pathParams: ['groupUniqueId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Groups
 * @memberOf! groupssettings(v1)
 * @type object
 * @property {string} allowExternalMembers Are external members allowed to join the group.
 * @property {string} allowGoogleCommunication Is google allowed to contact admins.
 * @property {string} allowWebPosting If posting from web is allowed.
 * @property {string} archiveOnly If the group is archive only
 * @property {string} customFooterText Custom footer text.
 * @property {string} customReplyTo Default email to which reply to any message should go.
 * @property {string} defaultMessageDenyNotificationText Default message deny notification message
 * @property {string} description Description of the group
 * @property {string} email Email id of the group
 * @property {string} includeCustomFooter Whether to include custom footer.
 * @property {string} includeInGlobalAddressList If this groups should be included in global address list or not.
 * @property {string} isArchived If the contents of the group are archived.
 * @property {string} kind The type of the resource.
 * @property {integer} maxMessageBytes Maximum message size allowed.
 * @property {string} membersCanPostAsTheGroup Can members post using the group email address.
 * @property {string} messageDisplayFont Default message display font. Possible values are: DEFAULT_FONT FIXED_WIDTH_FONT
 * @property {string} messageModerationLevel Moderation level for messages. Possible values are: MODERATE_ALL_MESSAGES MODERATE_NON_MEMBERS MODERATE_NEW_MEMBERS MODERATE_NONE
 * @property {string} name Name of the Group
 * @property {string} primaryLanguage Primary language for the group.
 * @property {string} replyTo Whome should the default reply to a message go to. Possible values are: REPLY_TO_CUSTOM REPLY_TO_SENDER REPLY_TO_LIST REPLY_TO_OWNER REPLY_TO_IGNORE REPLY_TO_MANAGERS
 * @property {string} sendMessageDenyNotification Should the member be notified if his message is denied by owner.
 * @property {string} showInGroupDirectory Is the group listed in groups directory
 * @property {string} spamModerationLevel Moderation level for messages detected as spam. Possible values are: ALLOW MODERATE SILENTLY_MODERATE REJECT
 * @property {string} whoCanAdd Permissions to add members. Possible values are: ALL_MANAGERS_CAN_ADD ALL_MEMBERS_CAN_ADD NONE_CAN_ADD
 * @property {string} whoCanContactOwner Permission to contact owner of the group via web UI. Possible values are: ANYONE_CAN_CONTACT ALL_IN_DOMAIN_CAN_CONTACT ALL_MEMBERS_CAN_CONTACT ALL_MANAGERS_CAN_CONTACT
 * @property {string} whoCanInvite Permissions to invite members. Possible values are: ALL_MEMBERS_CAN_INVITE ALL_MANAGERS_CAN_INVITE NONE_CAN_INVITE
 * @property {string} whoCanJoin Permissions to join the group. Possible values are: ANYONE_CAN_JOIN ALL_IN_DOMAIN_CAN_JOIN INVITED_CAN_JOIN CAN_REQUEST_TO_JOIN
 * @property {string} whoCanLeaveGroup Permission to leave the group. Possible values are: ALL_MANAGERS_CAN_LEAVE ALL_MEMBERS_CAN_LEAVE NONE_CAN_LEAVE
 * @property {string} whoCanPostMessage Permissions to post messages to the group. Possible values are: NONE_CAN_POST ALL_MANAGERS_CAN_POST ALL_MEMBERS_CAN_POST ALL_IN_DOMAIN_CAN_POST ANYONE_CAN_POST
 * @property {string} whoCanViewGroup Permissions to view group. Possible values are: ANYONE_CAN_VIEW ALL_IN_DOMAIN_CAN_VIEW ALL_MEMBERS_CAN_VIEW ALL_MANAGERS_CAN_VIEW
 * @property {string} whoCanViewMembership Permissions to view membership. Possible values are: ALL_IN_DOMAIN_CAN_VIEW ALL_MEMBERS_CAN_VIEW ALL_MANAGERS_CAN_VIEW
 */
module.exports = Groupssettings;
