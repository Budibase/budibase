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
 * Cloud User Accounts API
 *
 * Creates and manages users and groups for accessing Google Compute Engine virtual machines.
 *
 * @example
 * var google = require('googleapis');
 * var clouduseraccounts = google.clouduseraccounts('vm_alpha');
 *
 * @namespace clouduseraccounts
 * @type {Function}
 * @version vm_alpha
 * @variation vm_alpha
 * @param {object=} options Options for Clouduseraccounts
 */
function Clouduseraccounts(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.globalAccountsOperations = {

    /**
     * clouduseraccounts.globalAccountsOperations.delete
     *
     * @desc Deletes the specified operation resource.
     *
     * @alias clouduseraccounts.globalAccountsOperations.delete
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to delete.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/operations/{operation}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'operation'],
        pathParams: ['operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.globalAccountsOperations.get
     *
     * @desc Retrieves the specified operation resource.
     *
     * @alias clouduseraccounts.globalAccountsOperations.get
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.operation Name of the Operations resource to return.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'operation'],
        pathParams: ['operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.globalAccountsOperations.list
     *
     * @desc Retrieves the list of operation resources contained within the specified project.
     *
     * @alias clouduseraccounts.globalAccountsOperations.list
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  Compute Engine Beta API Only: If you use filtering in the Beta API, you can also filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. In particular, use filtering on nested fields to take advantage of instance labels to organize and filter results based on label values.  The Beta API also supports filtering on multiple expressions by providing each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.groups = {

    /**
     * clouduseraccounts.groups.addMember
     *
     * @desc Adds users to the specified group.
     *
     * @alias clouduseraccounts.groups.addMember
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupName Name of the group for this request.
     * @param {string} params.project Project ID for this request.
     * @param {clouduseraccounts(vm_alpha).GroupsAddMemberRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addMember: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{groupName}/addMember',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'groupName'],
        pathParams: ['groupName', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.delete
     *
     * @desc Deletes the specified Group resource.
     *
     * @alias clouduseraccounts.groups.delete
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupName Name of the Group resource to delete.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{groupName}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'groupName'],
        pathParams: ['groupName', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.get
     *
     * @desc Returns the specified Group resource.
     *
     * @alias clouduseraccounts.groups.get
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupName Name of the Group resource to return.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{groupName}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'groupName'],
        pathParams: ['groupName', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias clouduseraccounts.groups.getIamPolicy
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.insert
     *
     * @desc Creates a Group resource in the specified project using the data included in the request.
     *
     * @alias clouduseraccounts.groups.insert
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {clouduseraccounts(vm_alpha).Group} params.resource Request body data
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.list
     *
     * @desc Retrieves the list of groups contained within the specified project.
     *
     * @alias clouduseraccounts.groups.list
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  Compute Engine Beta API Only: If you use filtering in the Beta API, you can also filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. In particular, use filtering on nested fields to take advantage of instance labels to organize and filter results based on label values.  The Beta API also supports filtering on multiple expressions by providing each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.removeMember
     *
     * @desc Removes users from the specified group.
     *
     * @alias clouduseraccounts.groups.removeMember
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.groupName Name of the group for this request.
     * @param {string} params.project Project ID for this request.
     * @param {clouduseraccounts(vm_alpha).GroupsRemoveMemberRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removeMember: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{groupName}/removeMember',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'groupName'],
        pathParams: ['groupName', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias clouduseraccounts.groups.setIamPolicy
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {clouduseraccounts(vm_alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.groups.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias clouduseraccounts.groups.testIamPermissions
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {clouduseraccounts(vm_alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/groups/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.linux = {

    /**
     * clouduseraccounts.linux.getAuthorizedKeysView
     *
     * @desc Returns a list of authorized public keys for a specific user account.
     *
     * @alias clouduseraccounts.linux.getAuthorizedKeysView
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance The fully-qualified URL of the virtual machine requesting the view.
     * @param {boolean=} params.login Whether the view was requested as part of a user-initiated login.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.user The user account for which you want to get a list of authorized public keys.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getAuthorizedKeysView: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/zones/{zone}/authorizedKeysView/{user}',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'user', 'instance'],
        pathParams: ['project', 'user', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.linux.getLinuxAccountViews
     *
     * @desc Retrieves a list of user accounts for an instance within a specific project.
     *
     * @alias clouduseraccounts.linux.getLinuxAccountViews
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  Compute Engine Beta API Only: If you use filtering in the Beta API, you can also filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. In particular, use filtering on nested fields to take advantage of instance labels to organize and filter results based on label values.  The Beta API also supports filtering on multiple expressions by providing each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {string} params.instance The fully-qualified URL of the virtual machine requesting the views.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.zone Name of the zone for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getLinuxAccountViews: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/zones/{zone}/linuxAccountViews',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'zone', 'instance'],
        pathParams: ['project', 'zone'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.users = {

    /**
     * clouduseraccounts.users.addPublicKey
     *
     * @desc Adds a public key to the specified User resource with the data included in the request.
     *
     * @alias clouduseraccounts.users.addPublicKey
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.user Name of the user for this request.
     * @param {clouduseraccounts(vm_alpha).PublicKey} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    addPublicKey: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{user}/addPublicKey',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'user'],
        pathParams: ['project', 'user'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.delete
     *
     * @desc Deletes the specified User resource.
     *
     * @alias clouduseraccounts.users.delete
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.user Name of the user resource to delete.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{user}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'user'],
        pathParams: ['project', 'user'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.get
     *
     * @desc Returns the specified User resource.
     *
     * @alias clouduseraccounts.users.get
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.user Name of the user resource to return.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{user}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'user'],
        pathParams: ['project', 'user'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.getIamPolicy
     *
     * @desc Gets the access control policy for a resource. May be empty if no such policy or resource exists.
     *
     * @alias clouduseraccounts.users.getIamPolicy
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    getIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{resource}/getIamPolicy',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.insert
     *
     * @desc Creates a User resource in the specified project using the data included in the request.
     *
     * @alias clouduseraccounts.users.insert
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {clouduseraccounts(vm_alpha).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.list
     *
     * @desc Retrieves a list of users contained within the specified project.
     *
     * @alias clouduseraccounts.users.list
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.filter Sets a filter expression for filtering listed resources, in the form filter={expression}. Your {expression} must be in the format: field_name comparison_string literal_string.  The field_name is the name of the field you want to compare. Only atomic field types are supported (string, number, boolean). The comparison_string must be either eq (equals) or ne (not equals). The literal_string is the string value to filter to. The literal value must be valid for the type of field you are filtering by (string, number, boolean). For string fields, the literal value is interpreted as a regular expression using RE2 syntax. The literal value must match the entire field.  For example, to filter for instances that do not have a name of example-instance, you would use filter=name ne example-instance.  Compute Engine Beta API Only: If you use filtering in the Beta API, you can also filter on nested fields. For example, you could filter on instances that have set the scheduling.automaticRestart field to true. In particular, use filtering on nested fields to take advantage of instance labels to organize and filter results based on label values.  The Beta API also supports filtering on multiple expressions by providing each separate expression within parentheses. For example, (scheduling.automaticRestart eq true) (zone eq us-central1-f). Multiple expressions are treated as AND expressions, meaning that resources must match all expressions to pass the filters.
     * @param {integer=} params.maxResults The maximum number of results per page that should be returned. If the number of available results is larger than maxResults, Compute Engine returns a nextPageToken that can be used to get the next page of results in subsequent list requests.
     * @param {string=} params.orderBy Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using orderBy="creationTimestamp desc". This sorts results based on the creationTimestamp field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by name or creationTimestamp desc is supported.
     * @param {string=} params.pageToken Specifies a page token to use. Set pageToken to the nextPageToken returned by a previous list request to get the next page of results.
     * @param {string} params.project Project ID for this request.
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
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.removePublicKey
     *
     * @desc Removes the specified public key from the user.
     *
     * @alias clouduseraccounts.users.removePublicKey
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fingerprint The fingerprint of the public key to delete. Public keys are identified by their fingerprint, which is defined by RFC4716 to be the MD5 digest of the public key.
     * @param {string} params.project Project ID for this request.
     * @param {string} params.user Name of the user for this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    removePublicKey: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{user}/removePublicKey',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'user', 'fingerprint'],
        pathParams: ['project', 'user'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.setIamPolicy
     *
     * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
     *
     * @alias clouduseraccounts.users.setIamPolicy
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {clouduseraccounts(vm_alpha).Policy} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setIamPolicy: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{resource}/setIamPolicy',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * clouduseraccounts.users.testIamPermissions
     *
     * @desc Returns permissions that a caller has on the specified resource.
     *
     * @alias clouduseraccounts.users.testIamPermissions
     * @memberOf! clouduseraccounts(vm_alpha)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID for this request.
     * @param {string} params.resource_ Name of the resource for this request.
     * @param {clouduseraccounts(vm_alpha).TestPermissionsRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    testIamPermissions: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/clouduseraccounts/vm_alpha/projects/{project}/global/users/{resource}/testIamPermissions',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'resource'],
        pathParams: ['project', 'resource'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AuditConfig
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} exemptedMembers Specifies the identities that are exempted from &quot;data access&quot; audit logging for the `service` specified above. Follows the same format of Binding.members.
 * @property {string} service Specifies a service that will be enabled for &quot;data access&quot; audit logging. For example, `resourcemanager`, `storage`, `compute`. `allServices` is a special value that covers all services.
 */
/**
 * @typedef AuthorizedKeysView
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} keys [Output Only] The list of authorized public keys in SSH format.
 * @property {boolean} sudoer [Output Only] Whether the user has the ability to elevate on the instance that requested the authorized keys.
 */
/**
 * @typedef Binding
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource. `members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google account. For example, `alice@gmail.com` or `joe@example.com`.

* `serviceAccount:{emailid}`: An email address that represents a service account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group. For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the users of that domain. For example, `google.com` or `example.com`.
* @property {string} role Role that is assigned to `members`. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
*/
/**
 * @typedef Condition
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} iam Trusted attributes supplied by the IAM system.
 * @property {string} op An operator to apply the subject with.
 * @property {string} svc Trusted attributes discharged by the service.
 * @property {string} sys Trusted attributes supplied by any service that owns resources and uses the IAM system for access control.
 * @property {string} value The object of the condition. Exactly one of these must be set.
 * @property {string[]} values The objects of the condition. This is mutually exclusive with &#39;value&#39;.
 */
/**
 * @typedef Group
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional textual description of the resource; provided by the client when the resource is created.
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always clouduseraccounts#group for groups.
 * @property {string[]} members [Output Only] A list of URLs to User resources who belong to the group. Users may only be members of groups in the same project.
 * @property {string} name Name of the resource; provided by the client when the resource is created.
 * @property {string} selfLink [Output Only] Server defined URL for the resource.
 */
/**
 * @typedef GroupList
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {clouduseraccounts(vm_alpha).Group[]} items [Output Only] A list of Group resources.
 * @property {string} kind [Output Only] Type of resource. Always clouduseraccounts#groupList for lists of groups.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server defined URL for this resource.
 */
/**
 * @typedef GroupsAddMemberRequest
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} users Fully-qualified URLs of the User resources to add.
 */
/**
 * @typedef GroupsRemoveMemberRequest
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} users Fully-qualified URLs of the User resources to remove.
 */
/**
 * @typedef LinuxAccountViews
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {clouduseraccounts(vm_alpha).LinuxGroupView[]} groupViews [Output Only] A list of all groups within a project.
 * @property {string} kind [Output Only] Type of the resource. Always clouduseraccounts#linuxAccountViews for Linux resources.
 * @property {clouduseraccounts(vm_alpha).LinuxUserView[]} userViews [Output Only] A list of all users within a project.
 */
/**
 * @typedef LinuxGetAuthorizedKeysViewResponse
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {clouduseraccounts(vm_alpha).AuthorizedKeysView} resource [Output Only] A list of authorized public keys for a user.
 */
/**
 * @typedef LinuxGetLinuxAccountViewsResponse
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {clouduseraccounts(vm_alpha).LinuxAccountViews} resource [Output Only] A list of authorized user accounts and groups.
 */
/**
 * @typedef LinuxGroupView
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {integer} gid [Output Only] The Group ID.
 * @property {string} groupName [Output Only] Group name.
 * @property {string[]} members [Output Only] List of user accounts that belong to the group.
 */
/**
 * @typedef LinuxUserView
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} gecos [Output Only] The GECOS (user information) entry for this account.
 * @property {integer} gid [Output Only] User&#39;s default group ID.
 * @property {string} homeDirectory [Output Only] The path to the home directory for this account.
 * @property {string} shell [Output Only] The path to the login shell for this account.
 * @property {integer} uid [Output Only] User ID.
 * @property {string} username [Output Only] The username of the account.
 */
/**
 * @typedef LogConfig
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {clouduseraccounts(vm_alpha).LogConfigCounterOptions} counter Counter options.
 */
/**
 * @typedef LogConfigCounterOptions
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} field The field value to attribute.
 * @property {string} metric The metric to update.
 */
/**
 * @typedef Operation
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} clientOperationId [Output Only] Reserved for future use.
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description [Output Only] A textual description of the operation, which is set when the operation is created.
 * @property {string} endTime [Output Only] The time that this operation was completed. This value is in RFC3339 text format.
 * @property {object} error [Output Only] If errors are generated during processing of the operation, this field will be populated.
 * @property {string} httpErrorMessage [Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as NOT FOUND.
 * @property {integer} httpErrorStatusCode [Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a 404 means the resource was not found.
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {string} insertTime [Output Only] The time that this operation was requested. This value is in RFC3339 text format.
 * @property {string} kind [Output Only] Type of the resource. Always compute#operation for Operation resources.
 * @property {string} name [Output Only] Name of the resource.
 * @property {string} operationType [Output Only] The type of operation, such as insert, update, or delete, and so on.
 * @property {integer} progress [Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.
 * @property {string} region [Output Only] The URL of the region where the operation resides. Only available when performing regional operations.
 * @property {string} selfLink [Output Only] Server-defined URL for the resource.
 * @property {string} startTime [Output Only] The time that this operation was started by the server. This value is in RFC3339 text format.
 * @property {string} status [Output Only] The status of the operation, which can be one of the following: PENDING, RUNNING, or DONE.
 * @property {string} statusMessage [Output Only] An optional textual description of the current status of the operation.
 * @property {string} targetId [Output Only] The unique target ID, which identifies a specific incarnation of the target resource.
 * @property {string} targetLink [Output Only] The URL of the resource that the operation modifies.
 * @property {string} user [Output Only] User who requested the operation, for example: user@example.com.
 * @property {object[]} warnings [Output Only] If warning messages are generated during processing of the operation, this field will be populated.
 * @property {string} zone [Output Only] The URL of the zone where the operation resides. Only available when performing per-zone operations.
 */
/**
 * @typedef OperationList
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} id [Output Only] The unique identifier for the resource. This identifier is defined by the server.
 * @property {clouduseraccounts(vm_alpha).Operation[]} items [Output Only] A list of Operation resources.
 * @property {string} kind [Output Only] Type of resource. Always compute#operations for Operations resource.
 * @property {string} nextPageToken [Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger than maxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.
 * @property {string} selfLink [Output Only] Server-defined URL for this resource.
 */
/**
 * @typedef Policy
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
* @property {clouduseraccounts(vm_alpha).AuditConfig[]} auditConfigs Specifies audit logging configs for &quot;data access&quot;. &quot;data access&quot;: generally refers to data reads/writes and admin reads. &quot;admin activity&quot;: generally refers to admin writes.

Note: `AuditConfig` doesn&#39;t apply to &quot;admin activity&quot;, which always enables audit logging.
* @property {clouduseraccounts(vm_alpha).Binding[]} bindings Associates a list of `members` to a `role`. Multiple `bindings` must not be specified for the same `role`. `bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing policy is overwritten blindly.
* @property {boolean} iamOwned 
* @property {clouduseraccounts(vm_alpha).Rule[]} rules If more than one rule is specified, the rules are applied in the following manner: - All matching LOG rules are always applied. - If any DENY/DENY_WITH_LOG rule matches, permission is denied. Logging will be applied if one or more matching rule requires logging. - Otherwise, if any ALLOW/ALLOW_WITH_LOG rule matches, permission is granted. Logging will be applied if one or more matching rule requires logging. - Otherwise, if no rule applies, permission is denied.
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef PublicKey
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional textual description of the resource; provided by the client when the resource is created.
 * @property {string} expirationTimestamp Optional expiration timestamp. If provided, the timestamp must be in RFC3339 text format. If not provided, the public key never expires.
 * @property {string} fingerprint [Output Only] The fingerprint of the key is defined by RFC4716 to be the MD5 digest of the public key.
 * @property {string} key Public key text in SSH format, defined by RFC4253 section 6.6.
 */
/**
 * @typedef Rule
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} action Required
 * @property {clouduseraccounts(vm_alpha).Condition[]} conditions Additional restrictions that must be met
 * @property {string} description Human-readable description of the rule.
 * @property {string[]} ins The rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is in this set of entries.
 * @property {clouduseraccounts(vm_alpha).LogConfig[]} logConfigs The config returned to callers of tech.iam.IAM.CheckPolicy for any entries that match the LOG action.
 * @property {string[]} notIns The rule matches if the PRINCIPAL/AUTHORITY_SELECTOR is not in this set of entries.
 * @property {string[]} permissions A permission is a string of form &#39;..&#39; (e.g., &#39;storage.buckets.list&#39;). A value of &#39;*&#39; matches all permissions, and a verb part of &#39;*&#39; (e.g., &#39;storage.buckets.*&#39;) matches all verbs.
 */
/**
 * @typedef TestPermissionsRequest
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} permissions The set of permissions to check for the &#39;resource&#39;. Permissions with wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed.
 */
/**
 * @typedef TestPermissionsResponse
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
 */
/**
 * @typedef User
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} creationTimestamp [Output Only] Creation timestamp in RFC3339 text format.
 * @property {string} description An optional textual description of the resource; provided by the client when the resource is created.
 * @property {string[]} groups [Output Only] A list of URLs to Group resources who contain the user. Users are only members of groups in the same project.
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {string} kind [Output Only] Type of the resource. Always clouduseraccounts#user for users.
 * @property {string} name Name of the resource; provided by the client when the resource is created.
 * @property {string} owner Email address of account&#39;s owner. This account will be validated to make sure it exists. The email can belong to any domain, but it must be tied to a Google account.
 * @property {clouduseraccounts(vm_alpha).PublicKey[]} publicKeys [Output Only] Public keys that this user may use to login.
 * @property {string} selfLink [Output Only] Server defined URL for the resource.
 */
/**
 * @typedef UserList
 * @memberOf! clouduseraccounts(vm_alpha)
 * @type object
 * @property {string} id [Output Only] Unique identifier for the resource; defined by the server.
 * @property {clouduseraccounts(vm_alpha).User[]} items [Output Only] A list of User resources.
 * @property {string} kind [Output Only] Type of resource. Always clouduseraccounts#userList for lists of users.
 * @property {string} nextPageToken [Output Only] A token used to continue a truncated list request.
 * @property {string} selfLink [Output Only] Server defined URL for this resource.
 */
module.exports = Clouduseraccounts;
