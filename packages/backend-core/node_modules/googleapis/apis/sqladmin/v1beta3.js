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
 * Cloud SQL Administration API
 *
 * Creates and configures Cloud SQL instances, which provide fully-managed MySQL databases.
 *
 * @example
 * var google = require('googleapis');
 * var sqladmin = google.sqladmin('v1beta3');
 *
 * @namespace sqladmin
 * @type {Function}
 * @version v1beta3
 * @variation v1beta3
 * @param {object=} options Options for Sqladmin
 */
function Sqladmin(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.backupRuns = {

    /**
     * sql.backupRuns.get
     *
     * @desc Retrieves information about a specified backup run for a Cloud SQL instance.
     *
     * @alias sql.backupRuns.get
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backupConfiguration Identifier for the backup configuration. This gets generated automatically when a backup configuration is created.
     * @param {string} params.dueTime The start time of the four-hour backup window. The backup can occur any time in the window. The time is in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/backupRuns/{backupConfiguration}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'backupConfiguration', 'dueTime'],
        pathParams: ['backupConfiguration', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.backupRuns.list
     *
     * @desc Lists all backup runs associated with a Cloud SQL instance.
     *
     * @alias sql.backupRuns.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backupConfiguration Identifier for the backup configuration. This gets generated automatically when a backup configuration is created.
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {integer=} params.maxResults Maximum number of backup runs per response.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/backupRuns',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'backupConfiguration'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.flags = {

    /**
     * sql.flags.list
     *
     * @desc Lists all database flags that can be set for Google Cloud SQL instances.
     *
     * @alias sql.flags.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object=} params Parameters for request
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
          url: 'https://www.googleapis.com/sql/v1beta3/flags',
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

  self.instances = {

    /**
     * sql.instances.clone
     *
     * @desc Creates a Cloud SQL instance as a clone of a source instance.
     *
     * @alias sql.instances.clone
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID of the source as well as the clone Cloud SQL instance.
     * @param {sqladmin(v1beta3).InstancesCloneRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    clone: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/clone',
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
     * sql.instances.delete
     *
     * @desc Deletes a Cloud SQL instance.
     *
     * @alias sql.instances.delete
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance to be deleted.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.export
     *
     * @desc Exports data from a Cloud SQL instance to a Google Cloud Storage bucket as a MySQL dump file.
     *
     * @alias sql.instances.export
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance to be exported.
     * @param {sqladmin(v1beta3).InstancesExportRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    export: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/export',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.get
     *
     * @desc Retrieves information about a Cloud SQL instance.
     *
     * @alias sql.instances.get
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.import
     *
     * @desc Imports data into a Cloud SQL instance from a MySQL dump file stored in a Google Cloud Storage bucket.
     *
     * @alias sql.instances.import
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta3).InstancesImportRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/import',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.insert
     *
     * @desc Creates a new Cloud SQL instance.
     *
     * @alias sql.instances.insert
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID of the project to which the newly created Cloud SQL instances should belong.
     * @param {sqladmin(v1beta3).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances',
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
     * sql.instances.list
     *
     * @desc Lists instances for a given project, in alphabetical order by instance name.
     *
     * @alias sql.instances.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults The maximum number of results to return per response.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string} params.project Project ID of the project for which to list Cloud SQL instances.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances',
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
     * sql.instances.patch
     *
     * @desc Updates the settings of a Cloud SQL instance. This method supports patch semantics.
     *
     * @alias sql.instances.patch
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta3).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.promoteReplica
     *
     * @desc Promotes the read replica instance to be a stand-alone Cloud SQL instance.
     *
     * @alias sql.instances.promoteReplica
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL read replica instance name.
     * @param {string} params.project ID of the project that contains the read replica.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    promoteReplica: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/promoteReplica',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.resetSslConfig
     *
     * @desc Deletes all client certificates and generates a new server SSL certificate for a Cloud SQL instance.
     *
     * @alias sql.instances.resetSslConfig
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    resetSslConfig: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/resetSslConfig',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.restart
     *
     * @desc Restarts a Cloud SQL instance.
     *
     * @alias sql.instances.restart
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance to be restarted.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    restart: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/restart',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.restoreBackup
     *
     * @desc Restores a backup of a Cloud SQL instance.
     *
     * @alias sql.instances.restoreBackup
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.backupConfiguration The identifier of the backup configuration. This gets generated automatically when a backup configuration is created.
     * @param {string} params.dueTime The start time of the four-hour backup window. The backup can occur any time in the window. The time is in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    restoreBackup: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/restoreBackup',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'backupConfiguration', 'dueTime'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.setRootPassword
     *
     * @desc Sets the password for the root user of the specified Cloud SQL instance.
     *
     * @alias sql.instances.setRootPassword
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta3).InstanceSetRootPasswordRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    setRootPassword: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/setRootPassword',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.instances.update
     *
     * @desc Updates the settings of a Cloud SQL instance.
     *
     * @alias sql.instances.update
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta3).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.operations = {

    /**
     * sql.operations.get
     *
     * @desc Retrieves information about a specific operation that was performed on a Cloud SQL instance.
     *
     * @alias sql.operations.get
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.operation Instance operation ID.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/operations/{operation}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'operation'],
        pathParams: ['instance', 'operation', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.operations.list
     *
     * @desc Lists all operations that have been performed on a Cloud SQL instance.
     *
     * @alias sql.operations.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {integer=} params.maxResults Maximum number of operations per response.
     * @param {string=} params.pageToken A previously-returned page token representing part of the larger set of results to view.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sslCerts = {

    /**
     * sql.sslCerts.delete
     *
     * @desc Deletes an SSL certificate from a Cloud SQL instance.
     *
     * @alias sql.sslCerts.delete
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance to be deleted.
     * @param {string} params.sha1Fingerprint Sha1 FingerPrint.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/sslCerts/{sha1Fingerprint}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'sha1Fingerprint'],
        pathParams: ['instance', 'project', 'sha1Fingerprint'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.sslCerts.get
     *
     * @desc Retrieves an SSL certificate as specified by its SHA-1 fingerprint.
     *
     * @alias sql.sslCerts.get
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {string} params.sha1Fingerprint Sha1 FingerPrint.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/sslCerts/{sha1Fingerprint}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'sha1Fingerprint'],
        pathParams: ['instance', 'project', 'sha1Fingerprint'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.sslCerts.insert
     *
     * @desc Creates an SSL certificate and returns the certificate, the associated private key, and the server certificate authority.
     *
     * @alias sql.sslCerts.insert
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project to which the newly created Cloud SQL instances should belong.
     * @param {sqladmin(v1beta3).SslCertsInsertRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/sslCerts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.sslCerts.list
     *
     * @desc Lists all of the current SSL certificates defined for a Cloud SQL instance.
     *
     * @alias sql.sslCerts.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project for which to list Cloud SQL instances.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/instances/{instance}/sslCerts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.tiers = {

    /**
     * sql.tiers.list
     *
     * @desc Lists service tiers that can be used to create Google Cloud SQL instances.
     *
     * @alias sql.tiers.list
     * @memberOf! sqladmin(v1beta3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID of the project for which to list tiers.
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
          url: 'https://www.googleapis.com/sql/v1beta3/projects/{project}/tiers',
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
}

/**
 * @typedef BackupConfiguration
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {boolean} binaryLogEnabled Whether binary log is enabled. If backup configuration is disabled, binary log must be disabled as well.
 * @property {boolean} enabled Whether this configuration is enabled.
 * @property {string} id Identifier for this configuration. This gets generated automatically when a backup configuration is created.
 * @property {string} kind This is always sql#backupConfiguration.
 * @property {string} startTime Start time for the daily backup configuration in UTC timezone in the 24 hour format - HH:MM.
 */
/**
 * @typedef BackupRun
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} backupConfiguration Backup Configuration identifier.
 * @property {string} dueTime The due time of this run in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} endTime The time the backup operation completed in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} enqueuedTime The time the run was enqueued in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {sqladmin(v1beta3).OperationError} error Information about why the backup operation failed. This is only present if the run has the FAILED status.
 * @property {string} instance Name of the database instance.
 * @property {string} kind This is always sql#backupRun.
 * @property {string} startTime The time the backup operation actually started in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} status The status of this run.
 */
/**
 * @typedef BackupRunsListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).BackupRun[]} items A list of backup runs in reverse chronological order of the enqueued time.
 * @property {string} kind This is always sql#backupRunsList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef BinLogCoordinates
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} binLogFileName Name of the binary log file for a Cloud SQL instance.
 * @property {string} binLogPosition Position (offset) within the binary log file.
 * @property {string} kind This is always sql#binLogCoordinates.
 */
/**
 * @typedef CloneContext
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).BinLogCoordinates} binLogCoordinates Binary log coordinates, if specified, indentify the position up to which the source instance should be cloned. If not specified, the source instance is cloned up to the most recent binary log coordinates.
 * @property {string} destinationInstanceName Name of the Cloud SQL instance to be created as a clone.
 * @property {string} kind This is always sql#cloneContext.
 * @property {string} sourceInstanceName Name of the Cloud SQL instance to be cloned.
 */
/**
 * @typedef DatabaseFlags
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} name The name of the flag. These flags are passed at instance startup, so include both MySQL server options and MySQL system variables. Flags should be specified with underscores, not hyphens. For more information, see Configuring MySQL Flags in the Google Cloud SQL documentation, as well as the official MySQL documentation for server options and system variables.
 * @property {string} value The value of the flag. Booleans should be set to on for true and off for false. This field must be omitted if the flag doesn&#39;t take a value.
 */
/**
 * @typedef DatabaseInstance
 * @memberOf! sqladmin(v1beta3)
 * @type object
* @property {string} connectionName Connection name of the Cloud SQL instance used in connection strings.
* @property {string} currentDiskSize The current disk usage of the instance in bytes.
* @property {string} databaseVersion The database engine type and version. Can be MYSQL_5_5 or MYSQL_5_6. Defaults to MYSQL_5_5. The databaseVersion cannot be changed after instance creation.
* @property {string} etag HTTP 1.1 Entity tag for the resource.
* @property {string} instance Name of the Cloud SQL instance. This does not include the project ID.
* @property {string} instanceType The instance type. This can be one of the following.
CLOUD_SQL_INSTANCE: Regular Cloud SQL instance.
READ_REPLICA_INSTANCE: Cloud SQL instance acting as a read-replica.
* @property {sqladmin(v1beta3).IpMapping[]} ipAddresses The assigned IP addresses for the instance.
* @property {string} ipv6Address The IPv6 address assigned to the instance.
* @property {string} kind This is always sql#instance.
* @property {string} masterInstanceName The name of the instance which will act as master in the replication setup.
* @property {string} maxDiskSize The maximum disk size of the instance in bytes.
* @property {string} project The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.
* @property {string} region The geographical region. Can be us-central, asia-east1 or europe-west1. Defaults to us-central. The region can not be changed after instance creation.
* @property {string[]} replicaNames The replicas of the instance.
* @property {sqladmin(v1beta3).SslCert} serverCaCert SSL configuration.
* @property {string} serviceAccountEmailAddress The service account email address assigned to the instance.
* @property {sqladmin(v1beta3).Settings} settings The user settings.
* @property {string} state The current serving state of the Cloud SQL instance. This can be one of the following.
RUNNABLE: The instance is running, or is ready to run when accessed.
SUSPENDED: The instance is not available, for example due to problems with billing.
PENDING_CREATE: The instance is being created.
MAINTENANCE: The instance is down for maintenance.
UNKNOWN_STATE: The state of the instance is unknown.
*/
/**
 * @typedef ExportContext
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string[]} database Databases (for example, guestbook) from which the export is made. If unspecified, all databases are exported.
 * @property {string} kind This is always sql#exportContext.
 * @property {string[]} table Tables to export, or that were exported, from the specified database. If you specify tables, specify one and only one database.
 * @property {string} uri The path to the file in Google Cloud Storage where the export will be stored, or where it was already stored. The URI is in the form gs://bucketName/fileName. If the file already exists, the operation fails. If the filename ends with .gz, the contents are compressed.
 */
/**
 * @typedef Flag
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string[]} allowedStringValues For STRING flags, a list of strings that the value can be set to.
 * @property {string[]} appliesTo The database version this flag applies to. Currently this can only be [MYSQL_5_5].
 * @property {string} kind This is always sql#flag.
 * @property {string} maxValue For INTEGER flags, the maximum allowed value.
 * @property {string} minValue For INTEGER flags, the minimum allowed value.
 * @property {string} name This is the name of the flag. Flag names always use underscores, not hyphens, e.g. max_allowed_packet
 * @property {string} type The type of the flag. Flags are typed to being BOOLEAN, STRING, INTEGER or NONE. NONE is used for flags which do not take a value, such as skip_grant_tables.
 */
/**
 * @typedef FlagsListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).Flag[]} items List of flags.
 * @property {string} kind This is always sql#flagsList.
 */
/**
 * @typedef ImportContext
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} database The database (for example, guestbook) to which the import is made. If not set, it is assumed that the database is specified in the file to be imported.
 * @property {string} kind This is always sql#importContext.
 * @property {string[]} uri A path to the MySQL dump file in Google Cloud Storage from which the import is made. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported.
 */
/**
 * @typedef InstanceOperation
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} endTime The time this operation finished in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} enqueuedTime The time this operation was enqueued in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {sqladmin(v1beta3).OperationError[]} error The error(s) encountered by this operation. Only set if the operation results in an error.
 * @property {sqladmin(v1beta3).ExportContext} exportContext The context for export operation, if applicable.
 * @property {sqladmin(v1beta3).ImportContext} importContext The context for import operation, if applicable.
 * @property {string} instance Name of the database instance.
 * @property {string} kind This is always sql#instanceOperation.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 * @property {string} operationType The type of the operation. Valid values are CREATE, DELETE, UPDATE, RESTART, IMPORT, EXPORT, BACKUP_VOLUME, RESTORE_VOLUME.
 * @property {string} startTime The time this operation actually started in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} state The state of an operation. Valid values are PENDING, RUNNING, DONE, UNKNOWN.
 * @property {string} userEmailAddress The email address of the user who initiated this operation.
 */
/**
 * @typedef InstanceSetRootPasswordRequest
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).SetRootPasswordContext} setRootPasswordContext Set Root Password Context.
 */
/**
 * @typedef InstancesCloneRequest
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).CloneContext} cloneContext Contains details about the clone operation.
 */
/**
 * @typedef InstancesCloneResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesClone.
 * @property {string} operation An unique identifier for the operation associated with the cloned instance. You can use this identifier to retrieve the Operations resource, which has information about the operation.
 */
/**
 * @typedef InstancesDeleteResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesDelete.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesExportRequest
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).ExportContext} exportContext Contains details about the export operation.
 */
/**
 * @typedef InstancesExportResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesExport.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesImportRequest
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).ImportContext} importContext Contains details about the import operation.
 */
/**
 * @typedef InstancesImportResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesImport.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesInsertResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesInsert.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).DatabaseInstance[]} items List of database instance resources.
 * @property {string} kind This is always sql#instancesList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef InstancesPromoteReplicaResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesPromoteReplica.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesResetSslConfigResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesResetSslConfig.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation. All ssl client certificates will be deleted and a new server certificate will be created. Does not take effect until the next instance restart.
 */
/**
 * @typedef InstancesRestartResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesRestart.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesRestoreBackupResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesRestoreBackup.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesSetRootPasswordResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesSetRootPassword.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef InstancesUpdateResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#instancesUpdate.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve information about the operation.
 */
/**
 * @typedef IpConfiguration
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string[]} authorizedNetworks The list of external networks that are allowed to connect to the instance using the IP. In CIDR notation, also known as &#39;slash&#39; notation (e.g. 192.168.100.0/24).
 * @property {boolean} enabled Whether the instance should be assigned an IP address or not.
 * @property {string} kind This is always sql#ipConfiguration.
 * @property {boolean} requireSsl Whether the mysqld should default to &#39;REQUIRE X509&#39; for users connecting over IP.
 */
/**
 * @typedef IpMapping
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} ipAddress The IP address assigned.
 * @property {string} timeToRetire The due time for this IP to be retired in RFC 3339 format, for example 2012-11-15T16:19:00.094Z. This field is only available when the IP is scheduled to be retired.
 */
/**
 * @typedef LocationPreference
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} followGaeApplication The App Engine application to follow, it must be in the same region as the Cloud SQL instance.
 * @property {string} kind This is always sql#locationPreference.
 * @property {string} zone The preferred Compute Engine zone (e.g. us-centra1-a, us-central1-b, etc.).
 */
/**
 * @typedef OperationError
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} code Identifies the specific error that occurred.
 * @property {string} kind This is always sql#operationError.
 */
/**
 * @typedef OperationsListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).InstanceOperation[]} items List of operation resources.
 * @property {string} kind This is always sql#operationsList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef SetRootPasswordContext
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#setRootUserContext.
 * @property {string} password The password for the root user.
 */
/**
 * @typedef Settings
 * @memberOf! sqladmin(v1beta3)
 * @type object
* @property {string} activationPolicy The activation policy for this instance. This specifies when the instance should be activated and is applicable only when the instance state is RUNNABLE. This can be one of the following.
ALWAYS: The instance should always be active.
NEVER: The instance should never be activated.
ON_DEMAND: The instance is activated upon receiving requests.
* @property {string[]} authorizedGaeApplications The App Engine app IDs that can access this instance.
* @property {sqladmin(v1beta3).BackupConfiguration[]} backupConfiguration The daily backup configuration for the instance.
* @property {sqladmin(v1beta3).DatabaseFlags[]} databaseFlags The database flags passed to the instance at startup.
* @property {boolean} databaseReplicationEnabled Configuration specific to read replica instance. Indicates whether replication is enabled or not.
* @property {sqladmin(v1beta3).IpConfiguration} ipConfiguration The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance.
* @property {string} kind This is always sql#settings.
* @property {sqladmin(v1beta3).LocationPreference} locationPreference The location preference settings. This allows the instance to be located as near as possible to either an App Engine app or GCE zone for better performance.
* @property {string} pricingPlan The pricing plan for this instance. This can be either PER_USE or PACKAGE.
* @property {string} replicationType The type of replication this instance uses. This can be either ASYNCHRONOUS or SYNCHRONOUS.
* @property {string} settingsVersion The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.
* @property {string} tier The tier of service for this instance, for example D1, D2. For more information, see pricing.
*/
/**
 * @typedef SslCert
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} cert PEM representation.
 * @property {string} certSerialNumber Serial number, as extracted from the certificate.
 * @property {string} commonName User supplied name. Constrained to [a-zA-Z.-_ ]+.
 * @property {string} createTime Time when the certificate was created.
 * @property {string} expirationTime Time when the certificate expires.
 * @property {string} instance Name of the database instance.
 * @property {string} kind This is always sql#sslCert.
 * @property {string} sha1Fingerprint Sha1 Fingerprint.
 */
/**
 * @typedef SslCertDetail
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).SslCert} certInfo The public information about the cert.
 * @property {string} certPrivateKey The private key for the client cert, in pem format. Keep private in order to protect your security.
 */
/**
 * @typedef SslCertsDeleteResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} kind This is always sql#sslCertsDelete.
 * @property {string} operation An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
/**
 * @typedef SslCertsInsertRequest
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} commonName User supplied name. Must be a distinct name from the other certificates for this instance. New certificates will not be usable until the instance is restarted.
 */
/**
 * @typedef SslCertsInsertResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).SslCertDetail} clientCert The new client certificate and private key. The new certificate will not work until the instance is restarted.
 * @property {string} kind This is always sql#sslCertsInsert.
 * @property {sqladmin(v1beta3).SslCert} serverCaCert The server Certificate Authority&#39;s certificate. If this is missing you can force a new one to be generated by calling resetSslConfig method on instances resource..
 */
/**
 * @typedef SslCertsListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).SslCert[]} items List of client certificates for the instance.
 * @property {string} kind This is always sql#sslCertsList.
 */
/**
 * @typedef Tier
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {string} DiskQuota The maximum disk size of this tier in bytes.
 * @property {string} RAM The maximum RAM usage of this tier in bytes.
 * @property {string} kind This is always sql#tier.
 * @property {string[]} region The applicable regions for this tier.
 * @property {string} tier An identifier for the service tier, for example D1, D2 etc. For related information, see Pricing.
 */
/**
 * @typedef TiersListResponse
 * @memberOf! sqladmin(v1beta3)
 * @type object
 * @property {sqladmin(v1beta3).Tier[]} items List of tiers.
 * @property {string} kind This is always sql#tiersList.
 */
module.exports = Sqladmin;
