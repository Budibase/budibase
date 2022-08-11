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
 * Google Apps Activity API
 *
 * Provides a historical view of activity.
 *
 * @example
 * var google = require('googleapis');
 * var appsactivity = google.appsactivity('v1');
 *
 * @namespace appsactivity
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Appsactivity
 */
function Appsactivity(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.activities = {

    /**
     * appsactivity.activities.list
     *
     * @desc Returns a list of activities visible to the current logged in user. Visible activities are determined by the visiblity settings of the object that was acted on, e.g. Drive files a user can see. An activity is a record of past events. Multiple events may be merged if they are similar. A request is scoped to activities from a given Google service using the source parameter.
     *
     * @alias appsactivity.activities.list
     * @memberOf! appsactivity(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.drive.ancestorId Identifies the Drive folder containing the items for which to return activities.
     * @param {string=} params.drive.fileId Identifies the Drive item to return activities for.
     * @param {string=} params.groupingStrategy Indicates the strategy to use when grouping singleEvents items in the associated combinedEvent object.
     * @param {integer=} params.pageSize The maximum number of events to return on a page. The response includes a continuation token if there are more events.
     * @param {string=} params.pageToken A token to retrieve a specific page of results.
     * @param {string=} params.source The Google service from which to return activities. Possible values of source are:  - drive.google.com
     * @param {string=} params.userId Indicates the user to return activity for. Use the special value me to indicate the currently authenticated user.
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
          url: 'https://www.googleapis.com/appsactivity/v1/activities',
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
}

/**
 * @typedef Activity
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {appsactivity(v1).Event} combinedEvent The fields common to all of the singleEvents that make up the Activity.
 * @property {appsactivity(v1).Event[]} singleEvents A list of all the Events that make up the Activity.
 */
/**
 * @typedef Event
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string[]} additionalEventTypes Additional event types. Some events may have multiple types when multiple actions are part of a single event. For example, creating a document, renaming it, and sharing it may be part of a single file-creation event.
 * @property {string} eventTimeMillis The time at which the event occurred formatted as Unix time in milliseconds.
 * @property {boolean} fromUserDeletion Whether this event is caused by a user being deleted.
 * @property {appsactivity(v1).Move} move Extra information for move type events, such as changes in an object&#39;s parents.
 * @property {appsactivity(v1).PermissionChange[]} permissionChanges Extra information for permissionChange type events, such as the user or group the new permission applies to.
 * @property {string} primaryEventType The main type of event that occurred.
 * @property {appsactivity(v1).Rename} rename Extra information for rename type events, such as the old and new names.
 * @property {appsactivity(v1).Target} target Information specific to the Target object modified by the event.
 * @property {appsactivity(v1).User} user Represents the user responsible for the event.
 */
/**
 * @typedef ListActivitiesResponse
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {appsactivity(v1).Activity[]} activities List of activities.
 * @property {string} nextPageToken Token for the next page of results.
 */
/**
 * @typedef Move
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {appsactivity(v1).Parent[]} addedParents The added parent(s).
 * @property {appsactivity(v1).Parent[]} removedParents The removed parent(s).
 */
/**
 * @typedef Parent
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string} id The parent&#39;s ID.
 * @property {boolean} isRoot Whether this is the root folder.
 * @property {string} title The parent&#39;s title.
 */
/**
 * @typedef Permission
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string} name The name of the user or group the permission applies to.
 * @property {string} permissionId The ID for this permission. Corresponds to the Drive API&#39;s permission ID returned as part of the Drive Permissions resource.
 * @property {string} role Indicates the Google Drive permissions role. The role determines a user&#39;s ability to read, write, or comment on the file.
 * @property {string} type Indicates how widely permissions are granted.
 * @property {appsactivity(v1).User} user The user&#39;s information if the type is USER.
 * @property {boolean} withLink Whether the permission requires a link to the file.
 */
/**
 * @typedef PermissionChange
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {appsactivity(v1).Permission[]} addedPermissions Lists all Permission objects added.
 * @property {appsactivity(v1).Permission[]} removedPermissions Lists all Permission objects removed.
 */
/**
 * @typedef Photo
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string} url The URL of the photo.
 */
/**
 * @typedef Rename
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string} newTitle The new title.
 * @property {string} oldTitle The old title.
 */
/**
 * @typedef Target
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {string} id The ID of the target. For example, in Google Drive, this is the file or folder ID.
 * @property {string} mimeType The MIME type of the target.
 * @property {string} name The name of the target. For example, in Google Drive, this is the title of the file.
 */
/**
 * @typedef User
 * @memberOf! appsactivity(v1)
 * @type object
 * @property {boolean} isDeleted A boolean which indicates whether the specified User was deleted. If true, name, photo and permission_id will be omitted.
 * @property {boolean} isMe Whether the user is the authenticated user.
 * @property {string} name The displayable name of the user.
 * @property {string} permissionId The permission ID associated with this user. Equivalent to the Drive API&#39;s permission ID for this user, returned as part of the Drive Permissions resource.
 * @property {appsactivity(v1).Photo} photo The profile photo of the user. Not present if the user has no profile photo.
 */
module.exports = Appsactivity;
