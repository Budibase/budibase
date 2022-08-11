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
 * Google Classroom API
 *
 * Manages classes, rosters, and invitations in Google Classroom.
 *
 * @example
 * var google = require('googleapis');
 * var classroom = google.classroom('v1');
 *
 * @namespace classroom
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Classroom
 */
function Classroom(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.courses = {

    /**
     * classroom.courses.create
     *
     * @desc Creates a course. The user specified in `ownerId` is the owner of the created course and added as a teacher. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create courses or for access errors. * `NOT_FOUND` if the primary teacher is not a valid user. * `FAILED_PRECONDITION` if the course owner's account is disabled or for the following request errors: * UserGroupsMembershipLimitReached * `ALREADY_EXISTS` if an alias was specified in the `id` and already exists.
     *
     * @alias classroom.courses.create
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {classroom(v1).Course} params.resource Request body data
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
          url: 'https://classroom.googleapis.com/v1/courses',
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
     * classroom.courses.get
     *
     * @desc Returns a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID.
     *
     * @alias classroom.courses.get
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the course to return. This identifier can be either the Classroom-assigned identifier or an alias.
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
          url: 'https://classroom.googleapis.com/v1/courses/{id}',
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
     * classroom.courses.update
     *
     * @desc Updates a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID. * `FAILED_PRECONDITION` for the following request errors: * CourseNotModifiable
     *
     * @alias classroom.courses.update
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the course to update. This identifier can be either the Classroom-assigned identifier or an alias.
     * @param {classroom(v1).Course} params.resource Request body data
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
          url: 'https://classroom.googleapis.com/v1/courses/{id}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * classroom.courses.patch
     *
     * @desc Updates one or more fields in a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID. * `INVALID_ARGUMENT` if invalid fields are specified in the update mask or if no update mask is supplied. * `FAILED_PRECONDITION` for the following request errors: * CourseNotModifiable
     *
     * @alias classroom.courses.patch
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the course to update. This identifier can be either the Classroom-assigned identifier or an alias.
     * @param {string=} params.updateMask Mask that identifies which fields on the course to update. This field is required to do an update. The update will fail if invalid fields are specified. The following fields are valid: * `name` * `section` * `descriptionHeading` * `description` * `room` * `courseState` When set in a query parameter, this field should be specified as `updateMask=,,...`
     * @param {classroom(v1).Course} params.resource Request body data
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
          url: 'https://classroom.googleapis.com/v1/courses/{id}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * classroom.courses.delete
     *
     * @desc Deletes a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID.
     *
     * @alias classroom.courses.delete
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the course to delete. This identifier can be either the Classroom-assigned identifier or an alias.
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
          url: 'https://classroom.googleapis.com/v1/courses/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * classroom.courses.list
     *
     * @desc Returns a list of courses that the requesting user is permitted to view, restricted to those that match the request. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the query argument is malformed. * `NOT_FOUND` if any users specified in the query arguments do not exist.
     *
     * @alias classroom.courses.list
     * @memberOf! classroom(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.studentId Restricts returned courses to those having a student with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
     * @param {string=} params.teacherId Restricts returned courses to those having a teacher with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
     * @param {string=} params.courseStates Restricts returned courses to those in one of the specified states
     * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
     * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
          url: 'https://classroom.googleapis.com/v1/courses',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    aliases: {

      /**
       * classroom.courses.aliases.create
       *
       * @desc Creates an alias for a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create the alias or for access errors. * `NOT_FOUND` if the course does not exist. * `ALREADY_EXISTS` if the alias already exists.
       *
       * @alias classroom.courses.aliases.create
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course to alias. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {classroom(v1).CourseAlias} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/aliases',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.aliases.delete
       *
       * @desc Deletes an alias of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to remove the alias or for access errors. * `NOT_FOUND` if the alias does not exist.
       *
       * @alias classroom.courses.aliases.delete
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course whose alias should be deleted. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.alias Alias to delete. This may not be the Classroom-assigned identifier.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/aliases/{alias}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['courseId', 'alias'],
          pathParams: ['courseId', 'alias'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.aliases.list
       *
       * @desc Returns a list of aliases for a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the course or for access errors. * `NOT_FOUND` if the course does not exist.
       *
       * @alias classroom.courses.aliases.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId The identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/aliases',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    teachers: {

      /**
       * classroom.courses.teachers.create
       *
       * @desc Creates a teacher of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create teachers in this course or for access errors. * `NOT_FOUND` if the requested course ID does not exist. * `FAILED_PRECONDITION` if the requested user's account is disabled, for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * CourseTeacherLimitReached * UserGroupsMembershipLimitReached * `ALREADY_EXISTS` if the user is already a teacher or student in the course.
       *
       * @alias classroom.courses.teachers.create
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {classroom(v1).Teacher} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/teachers',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.teachers.get
       *
       * @desc Returns a teacher of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view teachers of this course or for access errors. * `NOT_FOUND` if no teacher of this course has the requested ID or if the course does not exist.
       *
       * @alias classroom.courses.teachers.get
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.userId Identifier of the teacher to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/teachers/{userId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId', 'userId'],
          pathParams: ['courseId', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.teachers.delete
       *
       * @desc Deletes a teacher of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete teachers of this course or for access errors. * `NOT_FOUND` if no teacher of this course has the requested ID or if the course does not exist. * `FAILED_PRECONDITION` if the requested ID belongs to the primary teacher of this course.
       *
       * @alias classroom.courses.teachers.delete
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.userId Identifier of the teacher to delete. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/teachers/{userId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['courseId', 'userId'],
          pathParams: ['courseId', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.teachers.list
       *
       * @desc Returns a list of teachers of this course that the requester is permitted to view. This method returns the following error codes: * `NOT_FOUND` if the course does not exist. * `PERMISSION_DENIED` for access errors.
       *
       * @alias classroom.courses.teachers.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {integer=} params.pageSize Maximum number of items to return. Zero means no maximum. The server may return fewer than the specified number of results.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/teachers',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    students: {

      /**
       * classroom.courses.students.create
       *
       * @desc Adds a user as a student of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create students in this course or for access errors. * `NOT_FOUND` if the requested course ID does not exist. * `FAILED_PRECONDITION` if the requested user's account is disabled, for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * UserGroupsMembershipLimitReached * `ALREADY_EXISTS` if the user is already a student or teacher in the course.
       *
       * @alias classroom.courses.students.create
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course to create the student in. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string=} params.enrollmentCode Enrollment code of the course to create the student in. This code is required if userId corresponds to the requesting user; it may be omitted if the requesting user has administrative permissions to create students for any user.
       * @param {classroom(v1).Student} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/students',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.students.get
       *
       * @desc Returns a student of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view students of this course or for access errors. * `NOT_FOUND` if no student of this course has the requested ID or if the course does not exist.
       *
       * @alias classroom.courses.students.get
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.userId Identifier of the student to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/students/{userId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId', 'userId'],
          pathParams: ['courseId', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.students.delete
       *
       * @desc Deletes a student of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete students of this course or for access errors. * `NOT_FOUND` if no student of this course has the requested ID or if the course does not exist.
       *
       * @alias classroom.courses.students.delete
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.userId Identifier of the student to delete. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/students/{userId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['courseId', 'userId'],
          pathParams: ['courseId', 'userId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.students.list
       *
       * @desc Returns a list of students of this course that the requester is permitted to view. This method returns the following error codes: * `NOT_FOUND` if the course does not exist. * `PERMISSION_DENIED` for access errors.
       *
       * @alias classroom.courses.students.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {integer=} params.pageSize Maximum number of items to return. Zero means no maximum. The server may return fewer than the specified number of results.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/students',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    courseWork: {

      /**
       * classroom.courses.courseWork.create
       *
       * @desc Creates course work. The resulting course work (and corresponding student submissions) are associated with the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to make the request. Classroom API requests to modify course work and student submissions must be made with an OAuth client ID from the associated Developer Console project. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, create course work in the requested course, share a Drive attachment, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist. * `FAILED_PRECONDITION` for the following request error: * AttachmentNotVisible
       *
       * @alias classroom.courses.courseWork.create
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {classroom(v1).CourseWork} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.courseWork.patch
       *
       * @desc Updates one or more fields of a course work. See google.classroom.v1.CourseWork for details of which fields may be updated and who may change them. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work, if the user is not permitted to make the requested modification to the student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `FAILED_PRECONDITION` if the requested course work has already been deleted. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
       *
       * @alias classroom.courses.courseWork.patch
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.id Identifier of the course work.
       * @param {string=} params.updateMask Mask that identifies which fields on the course work to update. This field is required to do an update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the CourseWork object. If a field that does not support empty values is included in the update mask and not set in the CourseWork object, an `INVALID_ARGUMENT` error will be returned. The following fields may be specified by teachers: * `title` * `description` * `state` * `due_date` * `due_time` * `max_points` * `submission_modification_mode`
       * @param {classroom(v1).CourseWork} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{id}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['courseId', 'id'],
          pathParams: ['courseId', 'id'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.courseWork.delete
       *
       * @desc Deletes a course work. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work, if the requesting user is not permitted to delete the requested course or for access errors. * `FAILED_PRECONDITION` if the requested course work has already been deleted. * `NOT_FOUND` if no course exists with the requested ID.
       *
       * @alias classroom.courses.courseWork.delete
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.id Identifier of the course work to delete. This identifier is a Classroom-assigned identifier.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{id}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['courseId', 'id'],
          pathParams: ['courseId', 'id'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.courseWork.get
       *
       * @desc Returns course work. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work does not exist.
       *
       * @alias classroom.courses.courseWork.get
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string} params.id Identifier of the course work.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{id}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId', 'id'],
          pathParams: ['courseId', 'id'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.courses.courseWork.list
       *
       * @desc Returns a list of course work that the requester is permitted to view. Course students may only view `PUBLISHED` course work. Course teachers and domain administrators may view all course work. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.
       *
       * @alias classroom.courses.courseWork.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
       * @param {string=} params.courseWorkStates Restriction on the work status to return. Only courseWork that matches is returned. If unspecified, items with a work status of `PUBLISHED` is returned.
       * @param {string=} params.orderBy Optional sort ordering for results. A comma-separated list of fields with an optional sort direction keyword. Supported fields are `updateTime` and `dueDate`. Supported direction keywords are `asc` and `desc`. If not specified, `updateTime desc` is the default behavior. Examples: `dueDate asc,updateTime desc`, `updateTime,dueDate desc`
       * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
            url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['courseId'],
          pathParams: ['courseId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      studentSubmissions: {

        /**
         * classroom.courses.courseWork.studentSubmissions.get
         *
         * @desc Returns a student submission. * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, course work, or student submission or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.get
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
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
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.patch
         *
         * @desc Updates one or more fields of a student submission. See google.classroom.v1.StudentSubmission for details of which fields may be updated and who may change them. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work, if the user is not permitted to make the requested modification to the student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.patch
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
         * @param {string=} params.updateMask Mask that identifies which fields on the student submission to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields may be specified by teachers: * `draft_grade` * `assigned_grade`
         * @param {classroom(v1).StudentSubmission} params.resource Request body data
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
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}',
              method: 'PATCH'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.list
         *
         * @desc Returns a list of student submissions that the requester is permitted to view, factoring in the OAuth scopes of the request. `-` may be specified as the `course_work_id` to include student submissions for multiple course work items. Course students may only view their own work. Course teachers and domain administrators may view all student submissions. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.list
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifer of the student work to request. This may be set to the string literal `"-"` to request student work for all course work in the specified course.
         * @param {string=} params.userId Optional argument to restrict returned student work to those owned by the student with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
         * @param {string=} params.states Requested submission states. If specified, returned student submissions match one of the specified submission states.
         * @param {string=} params.late Requested lateness value. If specified, returned student submissions are restricted by the requested value. If unspecified, submissions are returned regardless of `late` value.
         * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
         * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId'],
            pathParams: ['courseId', 'courseWorkId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.turnIn
         *
         * @desc Turns in a student submission. Turning in a student submission transfers ownership of attached Drive files to the teacher and may also update the submission state. This may only be called by the student that owns the specified student submission. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, turn in the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.turnIn
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
         * @param {classroom(v1).TurnInStudentSubmissionRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        turnIn: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:turnIn',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.reclaim
         *
         * @desc Reclaims a student submission on behalf of the student that owns it. Reclaiming a student submission transfers ownership of attached Drive files to the student and update the submission state. Only the student that owns the requested student submission may call this method, and only for a student submission that has been turned in. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, unsubmit the requested student submission, or for access errors. * `FAILED_PRECONDITION` if the student submission has not been turned in. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.reclaim
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
         * @param {classroom(v1).ReclaimStudentSubmissionRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        reclaim: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:reclaim',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.return
         *
         * @desc Returns a student submission. Returning a student submission transfers ownership of attached Drive files to the student and may also update the submission state. Unlike the Classroom application, returning a student submission does not set assignedGrade to the draftGrade value. Only a teacher of the course that contains the requested student submission may call this method. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, return the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.return
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
         * @param {classroom(v1).ReturnStudentSubmissionRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        return: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:return',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * classroom.courses.courseWork.studentSubmissions.modifyAttachments
         *
         * @desc Modifies attachments of student submission. Attachments may only be added to student submissions belonging to course work objects with a `workType` of `ASSIGNMENT`. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, if the user is not permitted to modify attachments on the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.
         *
         * @alias classroom.courses.courseWork.studentSubmissions.modifyAttachments
         * @memberOf! classroom(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.courseId Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.
         * @param {string} params.courseWorkId Identifier of the course work.
         * @param {string} params.id Identifier of the student submission.
         * @param {classroom(v1).ModifyAttachmentsRequest} params.resource Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        modifyAttachments: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:modifyAttachments',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['courseId', 'courseWorkId', 'id'],
            pathParams: ['courseId', 'courseWorkId', 'id'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };

  self.userProfiles = {

    /**
     * classroom.userProfiles.get
     *
     * @desc Returns a user profile. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access this user profile, if no profile exists with the requested ID, or for access errors.
     *
     * @alias classroom.userProfiles.get
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.userId Identifier of the profile to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
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
          url: 'https://classroom.googleapis.com/v1/userProfiles/{userId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['userId'],
        pathParams: ['userId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    guardianInvitations: {

      /**
       * classroom.userProfiles.guardianInvitations.list
       *
       * @desc Returns a list of guardian invitations that the requesting user is permitted to view, filtered by the parameters provided. This method returns the following error codes: * `PERMISSION_DENIED` if a `student_id` is specified, and the requesting user is not permitted to view guardian invitations for that student, if `"-"` is specified as the `student_id` and the user is not a domain administrator, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). May also be returned if an invalid `page_token` or `state` is provided. * `NOT_FOUND` if a `student_id` is specified, and its format can be recognized, but Classroom has no record of that student.
       *
       * @alias classroom.userProfiles.guardianInvitations.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId The ID of the student whose guardian invitations are to be returned. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user * the string literal `"-"`, indicating that results should be returned for all students that the requesting user is permitted to view guardian invitations.
       * @param {string=} params.invitedEmailAddress If specified, only results with the specified `invited_email_address` will be returned.
       * @param {string=} params.states If specified, only results with the specified `state` values will be returned. Otherwise, results with a `state` of `PENDING` will be returned.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
       * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardianInvitations',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['studentId'],
          pathParams: ['studentId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.userProfiles.guardianInvitations.get
       *
       * @desc Returns a specific guardian invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view guardian invitations for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). * `NOT_FOUND` if Classroom cannot find any record of the given student or `invitation_id`. May also be returned if the student exists, but the requesting user does not have access to see that student.
       *
       * @alias classroom.userProfiles.guardianInvitations.get
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId The ID of the student whose guardian invitation is being requested.
       * @param {string} params.invitationId The `id` field of the `GuardianInvitation` being requested.
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardianInvitations/{invitationId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['studentId', 'invitationId'],
          pathParams: ['studentId', 'invitationId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.userProfiles.guardianInvitations.create
       *
       * @desc Creates a guardian invitation, and sends an email to the guardian asking them to confirm that they are the student's guardian. Once the guardian accepts the invitation, their `state` will change to `COMPLETED` and they will start receiving guardian notifications. A `Guardian` resource will also be created to represent the active guardian. The request object must have the `student_id` and `invited_email_address` fields set. Failing to set these fields, or setting any other fields in the request, will result in an error. This method returns the following error codes: * `PERMISSION_DENIED` if the current user does not have permission to manage guardians, if the guardian in question has already rejected too many requests for that student, if guardians are not enabled for the domain in question, or for other access errors. * `RESOURCE_EXHAUSTED` if the student or guardian has exceeded the guardian link limit. * `INVALID_ARGUMENT` if the guardian email address is not valid (for example, if it is too long), or if the format of the student ID provided cannot be recognized (it is not an email address, nor a `user_id` from this API). This error will also be returned if read-only fields are set, or if the `state` field is set to to a value other than `PENDING`. * `NOT_FOUND` if the student ID provided is a valid student ID, but Classroom has no record of that student. * `ALREADY_EXISTS` if there is already a pending guardian invitation for the student and `invited_email_address` provided, or if the provided `invited_email_address` matches the Google account of an existing `Guardian` for this user.
       *
       * @alias classroom.userProfiles.guardianInvitations.create
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId ID of the student (in standard format)
       * @param {classroom(v1).GuardianInvitation} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardianInvitations',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['studentId'],
          pathParams: ['studentId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.userProfiles.guardianInvitations.patch
       *
       * @desc Modifies a guardian invitation. Currently, the only valid modification is to change the `state` from `PENDING` to `COMPLETE`. This has the effect of withdrawing the invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the current user does not have permission to manage guardians, if guardians are not enabled for the domain in question or for other access errors. * `FAILED_PRECONDITION` if the guardian link is not in the `PENDING` state. * `INVALID_ARGUMENT` if the format of the student ID provided cannot be recognized (it is not an email address, nor a `user_id` from this API), or if the passed `GuardianInvitation` has a `state` other than `COMPLETE`, or if it modifies fields other than `state`. * `NOT_FOUND` if the student ID provided is a valid student ID, but Classroom has no record of that student, or if the `id` field does not refer to a guardian invitation known to Classroom.
       *
       * @alias classroom.userProfiles.guardianInvitations.patch
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId The ID of the student whose guardian invitation is to be modified.
       * @param {string} params.invitationId The `id` field of the `GuardianInvitation` to be modified.
       * @param {string=} params.updateMask Mask that identifies which fields on the course to update. This field is required to do an update. The update will fail if invalid fields are specified. The following fields are valid: * `state` When set in a query parameter, this field should be specified as `updateMask=,,...`
       * @param {classroom(v1).GuardianInvitation} params.resource Request body data
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardianInvitations/{invitationId}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['studentId', 'invitationId'],
          pathParams: ['studentId', 'invitationId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    guardians: {

      /**
       * classroom.userProfiles.guardians.list
       *
       * @desc Returns a list of guardians that the requesting user is permitted to view, restricted to those that match the request. To list guardians for any student that the requesting user may view guardians for, use the literal character `-` for the student ID. This method returns the following error codes: * `PERMISSION_DENIED` if a `student_id` is specified, and the requesting user is not permitted to view guardian information for that student, if `"-"` is specified as the `student_id` and the user is not a domain administrator, if guardians are not enabled for the domain in question, if the `invited_email_address` filter is set by a user who is not a domain administrator, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). May also be returned if an invalid `page_token` is provided. * `NOT_FOUND` if a `student_id` is specified, and its format can be recognized, but Classroom has no record of that student.
       *
       * @alias classroom.userProfiles.guardians.list
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId Filter results by the student who the guardian is linked to. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user * the string literal `"-"`, indicating that results should be returned for all students that the requesting user has access to view.
       * @param {string=} params.invitedEmailAddress Filter results by the email address that the original invitation was sent to, resulting in this guardian link. This filter can only be used by domain administrators.
       * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
       * @param {integer=} params.pageSize Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardians',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['studentId'],
          pathParams: ['studentId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.userProfiles.guardians.get
       *
       * @desc Returns a specific guardian. This method returns the following error codes: * `PERMISSION_DENIED` if no user that matches the provided `student_id` is visible to the requesting user, if the requesting user is not permitted to view guardian information for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). * `NOT_FOUND` if the requesting user is permitted to view guardians for the requested `student_id`, but no `Guardian` record exists for that student that matches the provided `guardian_id`.
       *
       * @alias classroom.userProfiles.guardians.get
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId The student whose guardian is being requested. One of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
       * @param {string} params.guardianId The `id` field from a `Guardian`.
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardians/{guardianId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['studentId', 'guardianId'],
          pathParams: ['studentId', 'guardianId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * classroom.userProfiles.guardians.delete
       *
       * @desc Deletes a guardian. The guardian will no longer receive guardian notifications and the guardian will no longer be accessible via the API. This method returns the following error codes: * `PERMISSION_DENIED` if no user that matches the provided `student_id` is visible to the requesting user, if the requesting user is not permitted to manage guardians for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API). * `NOT_FOUND` if the requesting user is permitted to modify guardians for the requested `student_id`, but no `Guardian` record exists for that student with the provided `guardian_id`.
       *
       * @alias classroom.userProfiles.guardians.delete
       * @memberOf! classroom(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.studentId The student whose guardian is to be deleted. One of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
       * @param {string} params.guardianId The `id` field from a `Guardian`.
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
            url: 'https://classroom.googleapis.com/v1/userProfiles/{studentId}/guardians/{guardianId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['studentId', 'guardianId'],
          pathParams: ['studentId', 'guardianId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.invitations = {

    /**
     * classroom.invitations.create
     *
     * @desc Creates an invitation. Only one invitation for a user and course may exist at a time. Delete and re-create an invitation to make changes. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create invitations for this course or for access errors. * `NOT_FOUND` if the course or the user does not exist. * `FAILED_PRECONDITION` if the requested user's account is disabled or if the user already has this role or a role with greater permissions. * `ALREADY_EXISTS` if an invitation for the specified user and course already exists.
     *
     * @alias classroom.invitations.create
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {classroom(v1).Invitation} params.resource Request body data
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
          url: 'https://classroom.googleapis.com/v1/invitations',
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
     * classroom.invitations.get
     *
     * @desc Returns an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view the requested invitation or for access errors. * `NOT_FOUND` if no invitation exists with the requested ID.
     *
     * @alias classroom.invitations.get
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the invitation to return.
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
          url: 'https://classroom.googleapis.com/v1/invitations/{id}',
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
     * classroom.invitations.delete
     *
     * @desc Deletes an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested invitation or for access errors. * `NOT_FOUND` if no invitation exists with the requested ID.
     *
     * @alias classroom.invitations.delete
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the invitation to delete.
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
          url: 'https://classroom.googleapis.com/v1/invitations/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * classroom.invitations.list
     *
     * @desc Returns a list of invitations that the requesting user is permitted to view, restricted to those that match the list request. *Note:* At least one of `user_id` or `course_id` must be supplied. Both fields can be supplied. This method returns the following error codes: * `PERMISSION_DENIED` for access errors.
     *
     * @alias classroom.invitations.list
     * @memberOf! classroom(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.userId Restricts returned invitations to those for a specific user. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user
     * @param {string=} params.courseId Restricts returned invitations to those for a course with the specified identifier.
     * @param {integer=} params.pageSize Maximum number of items to return. Zero means no maximum. The server may return fewer than the specified number of results.
     * @param {string=} params.pageToken nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.
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
          url: 'https://classroom.googleapis.com/v1/invitations',
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
     * classroom.invitations.accept
     *
     * @desc Accepts an invitation, removing it and adding the invited user to the teachers or students (as appropriate) of the specified course. Only the invited user may accept an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to accept the requested invitation or for access errors. * `FAILED_PRECONDITION` for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * CourseTeacherLimitReached * UserGroupsMembershipLimitReached * `NOT_FOUND` if no invitation exists with the requested ID.
     *
     * @alias classroom.invitations.accept
     * @memberOf! classroom(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Identifier of the invitation to accept.
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
          url: 'https://classroom.googleapis.com/v1/invitations/{id}:accept',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['id'],
        pathParams: ['id'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Course
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id Identifier for this course assigned by Classroom. When creating a course, you may optionally set this identifier to an alias string in the request to create a corresponding alias. The `id` is still assigned by Classroom and cannot be updated after the course is created. Specifying this field in a course update mask results in an error.
 * @property {string} name Name of the course. For example, &quot;10th Grade Biology&quot;. The name is required. It must be between 1 and 750 characters and a valid UTF-8 string.
 * @property {string} section Section of the course. For example, &quot;Period 2&quot;. If set, this field must be a valid UTF-8 string and no longer than 2800 characters.
 * @property {string} descriptionHeading Optional heading for the description. For example, &quot;Welcome to 10th Grade Biology.&quot; If set, this field must be a valid UTF-8 string and no longer than 3600 characters.
 * @property {string} description Optional description. For example, &quot;We&#39;ll be learning about the structure of living creatures from a combination of textbooks, guest lectures, and lab work. Expect to be excited!&quot; If set, this field must be a valid UTF-8 string and no longer than 30,000 characters.
 * @property {string} room Optional room location. For example, &quot;301&quot;. If set, this field must be a valid UTF-8 string and no longer than 650 characters.
 * @property {string} ownerId The identifier of the owner of a course. When specified as a parameter of a create course request, this field is required. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `&quot;me&quot;`, indicating the requesting user This must be set in a create request. Specifying this field in a course update mask results in an `INVALID_ARGUMENT` error.
 * @property {string} creationTime Creation time of the course. Specifying this field in a course update mask results in an error. Read-only.
 * @property {string} updateTime Time of the most recent update to this course. Specifying this field in a course update mask results in an error. Read-only.
 * @property {string} enrollmentCode Enrollment code to use when joining this course. Specifying this field in a course update mask results in an error. Read-only.
 * @property {string} courseState State of the course. If unspecified, the default state is `PROVISIONED`.
 * @property {string} alternateLink Absolute link to this course in the Classroom web UI. Read-only.
 * @property {string} teacherGroupEmail The email address of a Google group containing all teachers of the course. This group does not accept email and can only be used for permissions. Read-only.
 * @property {string} courseGroupEmail The email address of a Google group containing all members of the course. This group does not accept email and can only be used for permissions. Read-only.
 * @property {classroom(v1).DriveFolder} teacherFolder Information about a Drive Folder that is shared with all teachers of the course. This field will only be set for teachers of the course and domain administrators. Read-only.
 * @property {classroom(v1).CourseMaterialSet[]} courseMaterialSets Sets of materials that appear on the &quot;about&quot; page of this course. Read-only.
 * @property {boolean} guardiansEnabled Whether or not guardian notifications are enabled for this course. Read-only.
 */
/**
 * @typedef DriveFolder
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id Drive API resource ID.
 * @property {string} title Title of the Drive folder. Read-only.
 * @property {string} alternateLink URL that can be used to access the Drive folder. Read-only.
 */
/**
 * @typedef CourseMaterialSet
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} title Title for this set.
 * @property {classroom(v1).CourseMaterial[]} materials Materials attached to this set.
 */
/**
 * @typedef CourseMaterial
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).DriveFile} driveFile Google Drive file attachment.
 * @property {classroom(v1).YouTubeVideo} youTubeVideo Youtube video attachment.
 * @property {classroom(v1).Link} link Link atatchment.
 * @property {classroom(v1).Form} form Google Forms attachment.
 */
/**
 * @typedef DriveFile
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id Drive API resource ID.
 * @property {string} title Title of the Drive item. Read-only.
 * @property {string} alternateLink URL that can be used to access the Drive item. Read-only.
 * @property {string} thumbnailUrl URL of a thumbnail image of the Drive item. Read-only.
 */
/**
 * @typedef YouTubeVideo
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id YouTube API resource ID.
 * @property {string} title Title of the YouTube video. Read-only.
 * @property {string} alternateLink URL that can be used to view the YouTube video. Read-only.
 * @property {string} thumbnailUrl URL of a thumbnail image of the YouTube video. Read-only.
 */
/**
 * @typedef Link
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} url URL to link to. This must be a valid UTF-8 string containing between 1 and 2024 characters.
 * @property {string} title Title of the target of the URL. Read-only.
 * @property {string} thumbnailUrl URL of a thumbnail image of the target URL. Read-only.
 */
/**
 * @typedef Form
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} formUrl URL of the form.
 * @property {string} responseUrl URL of the form responses document. Only set if respsonses have been recorded and only when the requesting user is an editor of the form. Read-only.
 * @property {string} title Title of the Form. Read-only.
 * @property {string} thumbnailUrl URL of a thumbnail image of the Form. Read-only.
 */
/**
 * @typedef Empty
 * @memberOf! classroom(v1)
 * @type object
 */
/**
 * @typedef ListCoursesResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Course[]} courses Courses that match the list request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef CourseAlias
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} alias Alias string. The format of the string indicates the desired alias scoping. * `d:` indicates a domain-scoped alias. Example: `d:math_101` * `p:` indicates a project-scoped alias. Example: `p:abc123` This field has a maximum length of 256 characters.
 */
/**
 * @typedef ListCourseAliasesResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).CourseAlias[]} aliases The course aliases.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef ListGuardianInvitationsResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).GuardianInvitation[]} guardianInvitations Guardian invitations that matched the list request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef GuardianInvitation
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} studentId ID of the student (in standard format)
 * @property {string} invitationId Unique identifier for this invitation. Read-only.
 * @property {string} invitedEmailAddress Email address that the invitation was sent to. This field is only visible to domain administrators.
 * @property {string} state The state that this invitation is in.
 * @property {string} creationTime The time that this invitation was created. Read-only.
 */
/**
 * @typedef UserProfile
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id Identifier of the user. Read-only.
 * @property {classroom(v1).Name} name Name of the user. Read-only.
 * @property {string} emailAddress Email address of the user. Read-only.
 * @property {string} photoUrl URL of user&#39;s profile photo. Read-only.
 * @property {classroom(v1).GlobalPermission[]} permissions Global permissions of the user. Read-only.
 */
/**
 * @typedef Name
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} givenName The user&#39;s first name. Read-only.
 * @property {string} familyName The user&#39;s last name. Read-only.
 * @property {string} fullName The user&#39;s full name formed by concatenating the first and last name values. Read-only.
 */
/**
 * @typedef GlobalPermission
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} permission Permission value.
 */
/**
 * @typedef Teacher
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} courseId Identifier of the course. Read-only.
 * @property {string} userId Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `&quot;me&quot;`, indicating the requesting user
 * @property {classroom(v1).UserProfile} profile Global user information for the teacher. Read-only.
 */
/**
 * @typedef ListTeachersResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Teacher[]} teachers Teachers who match the list request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef Student
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} courseId Identifier of the course. Read-only.
 * @property {string} userId Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `&quot;me&quot;`, indicating the requesting user
 * @property {classroom(v1).UserProfile} profile Global user information for the student. Read-only.
 * @property {classroom(v1).DriveFolder} studentWorkFolder Information about a Drive Folder for this student&#39;s work in this course. Only visible to the student and domain administrators. Read-only.
 */
/**
 * @typedef ListStudentsResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Student[]} students Students who match the list request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef ListGuardiansResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Guardian[]} guardians Guardians on this page of results that met the criteria specified in the request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef Guardian
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} studentId Identifier for the student to whom the guardian relationship applies.
 * @property {string} guardianId Identifier for the guardian.
 * @property {classroom(v1).UserProfile} guardianProfile User profile for the guardian.
 * @property {string} invitedEmailAddress The email address to which the initial guardian invitation was sent. This field is only visible to domain administrators.
 */
/**
 * @typedef Invitation
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} id Identifier assigned by Classroom. Read-only.
 * @property {string} userId Identifier of the invited user. When specified as a parameter of a request, this identifier can be set to one of the following: * the numeric identifier for the user * the email address of the user * the string literal `&quot;me&quot;`, indicating the requesting user
 * @property {string} courseId Identifier of the course to invite the user to.
 * @property {string} role Role to invite the user to have. Must not be `COURSE_ROLE_UNSPECIFIED`.
 */
/**
 * @typedef ListInvitationsResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Invitation[]} invitations Invitations that match the list request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef CourseWork
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} courseId Identifier of the course. Read-only.
 * @property {string} id Classroom-assigned identifier of this course work, unique per course. Read-only.
 * @property {string} title Title of this course work. The title must be a valid UTF-8 string containing between 1 and 3000 characters.
 * @property {string} description Optional description of this course work. If set, the description must be a valid UTF-8 string containing no more than 30,000 characters.
 * @property {classroom(v1).Material[]} materials Additional materials. CourseWork must have no more than 20 material items.
 * @property {string} state Status of this course work. If unspecified, the default state is `DRAFT`.
 * @property {string} alternateLink Absolute link to this course work in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.
 * @property {string} creationTime Timestamp when this course work was created. Read-only.
 * @property {string} updateTime Timestamp of the most recent change to this course work. Read-only.
 * @property {classroom(v1).Date} dueDate Optional date, in UTC, that submissions for this this course work are due. This must be specified if `due_time` is specified.
 * @property {classroom(v1).TimeOfDay} dueTime Optional time of day, in UTC, that submissions for this this course work are due. This must be specified if `due_date` is specified.
 * @property {number} maxPoints Maximum grade for this course work. If zero or unspecified, this assignment is considered ungraded. This must be a non-negative integer value.
 * @property {string} workType Type of this course work. The type is set when the course work is created and cannot be changed.
 * @property {boolean} associatedWithDeveloper Whether this course work item is associated with the Developer Console project making the request. See google.classroom.Work.CreateCourseWork for more details. Read-only.
 * @property {string} submissionModificationMode Setting to determine when students are allowed to modify submissions. If unspecified, the default value is `MODIFIABLE_UNTIL_TURNED_IN`.
 * @property {classroom(v1).Assignment} assignment Assignment details. This is populated only when `work_type` is `ASSIGNMENT`. Read-only.
 * @property {classroom(v1).MultipleChoiceQuestion} multipleChoiceQuestion Multiple choice question details. For read operations, this field is populated only when `work_type` is `MULTIPLE_CHOICE_QUESTION`. For write operations, this field must be specified when creating course work with a `work_type` of `MULTIPLE_CHOICE_QUESTION`, and it must not be set otherwise.
 */
/**
 * @typedef Material
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).SharedDriveFile} driveFile Google Drive file material.
 * @property {classroom(v1).YouTubeVideo} youtubeVideo YouTube video material.
 * @property {classroom(v1).Link} link Link material. On creation, will be upgraded to a more appropriate type if possible, and this will be reflected in the response.
 * @property {classroom(v1).Form} form Google Forms material.
 */
/**
 * @typedef SharedDriveFile
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).DriveFile} driveFile Drive file details.
 * @property {string} shareMode Mechanism by which students access the Drive item.
 */
/**
 * @typedef Date
 * @memberOf! classroom(v1)
 * @type object
 * @property {integer} year Year of date. Must be from 1 to 9999, or 0 if specifying a date without a year.
 * @property {integer} month Month of year. Must be from 1 to 12.
 * @property {integer} day Day of month. Must be from 1 to 31 and valid for the year and month, or 0 if specifying a year/month where the day is not significant.
 */
/**
 * @typedef TimeOfDay
 * @memberOf! classroom(v1)
 * @type object
 * @property {integer} hours Hours of day in 24 hour format. Should be from 0 to 23. An API may choose to allow the value &quot;24:00:00&quot; for scenarios like business closing time.
 * @property {integer} minutes Minutes of hour of day. Must be from 0 to 59.
 * @property {integer} seconds Seconds of minutes of the time. Must normally be from 0 to 59. An API may allow the value 60 if it allows leap-seconds.
 * @property {integer} nanos Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999.
 */
/**
 * @typedef Assignment
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).DriveFolder} studentWorkFolder Drive folder where attachments from student submissions are placed. This is only populated for course teachers.
 */
/**
 * @typedef MultipleChoiceQuestion
 * @memberOf! classroom(v1)
 * @type object
 * @property {string[]} choices Possible choices.
 */
/**
 * @typedef ListCourseWorkResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).CourseWork[]} courseWork Course work items that match the request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef StudentSubmission
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} courseId Identifier of the course. Read-only.
 * @property {string} courseWorkId Identifier for the course work this corresponds to. Read-only.
 * @property {string} id Classroom-assigned Identifier for the student submission. This is unique among submissions for the relevant course work. Read-only.
 * @property {string} userId Identifier for the student that owns this submission. Read-only.
 * @property {string} creationTime Creation time of this submission. This may be unset if the student has not accessed this item. Read-only.
 * @property {string} updateTime Last update time of this submission. This may be unset if the student has not accessed this item. Read-only.
 * @property {string} state State of this submission. Read-only.
 * @property {boolean} late Whether this submission is late. Read-only.
 * @property {number} draftGrade Optional pending grade. If unset, no grade was set. This must be a non-negative integer value. This is only visible to and modifiable by course teachers.
 * @property {number} assignedGrade Optional grade. If unset, no grade was set. This must be a non-negative integer value. This may be modified only by course teachers.
 * @property {string} alternateLink Absolute link to the submission in the Classroom web UI. Read-only.
 * @property {string} courseWorkType Type of course work this submission is for. Read-only.
 * @property {boolean} associatedWithDeveloper Whether this student submission is associated with the Developer Console project making the request. See google.classroom.Work.CreateCourseWork for more details. Read-only.
 * @property {classroom(v1).AssignmentSubmission} assignmentSubmission Submission content when course_work_type is ASSIGNMENT .
 * @property {classroom(v1).ShortAnswerSubmission} shortAnswerSubmission Submission content when course_work_type is SHORT_ANSWER_QUESTION.
 * @property {classroom(v1).MultipleChoiceSubmission} multipleChoiceSubmission Submission content when course_work_type is MULTIPLE_CHOICE_QUESTION.
 */
/**
 * @typedef AssignmentSubmission
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Attachment[]} attachments Attachments added by the student. Drive files that correspond to materials with a share mode of STUDENT_COPY may not exist yet if the student has not accessed the assignment in Classroom. Some attachment metadata is only populated if the requesting user has permission to access it. Identifier and alternate_link fields are always available, but others (e.g. title) may not be.
 */
/**
 * @typedef Attachment
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).DriveFile} driveFile Google Drive file attachment.
 * @property {classroom(v1).YouTubeVideo} youTubeVideo Youtube video attachment.
 * @property {classroom(v1).Link} link Link attachment.
 * @property {classroom(v1).Form} form Google Forms attachment.
 */
/**
 * @typedef ShortAnswerSubmission
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} answer Student response to a short-answer question.
 */
/**
 * @typedef MultipleChoiceSubmission
 * @memberOf! classroom(v1)
 * @type object
 * @property {string} answer Student&#39;s select choice.
 */
/**
 * @typedef ListStudentSubmissionsResponse
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).StudentSubmission[]} studentSubmissions Student work that matches the request.
 * @property {string} nextPageToken Token identifying the next page of results to return. If empty, no further results are available.
 */
/**
 * @typedef TurnInStudentSubmissionRequest
 * @memberOf! classroom(v1)
 * @type object
 */
/**
 * @typedef ReclaimStudentSubmissionRequest
 * @memberOf! classroom(v1)
 * @type object
 */
/**
 * @typedef ReturnStudentSubmissionRequest
 * @memberOf! classroom(v1)
 * @type object
 */
/**
 * @typedef ModifyAttachmentsRequest
 * @memberOf! classroom(v1)
 * @type object
 * @property {classroom(v1).Attachment[]} addAttachments Attachments to add. A student submission may not have more than 20 attachments. Form attachments are not supported.
 */
module.exports = Classroom;
