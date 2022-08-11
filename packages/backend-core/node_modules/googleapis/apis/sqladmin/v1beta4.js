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
 * var sqladmin = google.sqladmin('v1beta4');
 *
 * @namespace sqladmin
 * @type {Function}
 * @version v1beta4
 * @variation v1beta4
 * @param {object=} options Options for Sqladmin
 */
function Sqladmin(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.backupRuns = {

    /**
     * sql.backupRuns.delete
     *
     * @desc Deletes the backup taken by a backup run.
     *
     * @alias sql.backupRuns.delete
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of the Backup Run to delete. To find a Backup Run ID, use the list method.
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/backupRuns/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'id'],
        pathParams: ['id', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.backupRuns.get
     *
     * @desc Retrieves a resource containing information about a backup run.
     *
     * @alias sql.backupRuns.get
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id The ID of this Backup Run.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/backupRuns/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'id'],
        pathParams: ['id', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.backupRuns.insert
     *
     * @desc Creates a new backup run on demand. This method is applicable only to Second Generation instances.
     *
     * @alias sql.backupRuns.insert
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).BackupRun} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/backupRuns',
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
     * sql.backupRuns.list
     *
     * @desc Lists all backup runs associated with a given instance and configuration in the reverse chronological order of the enqueued time.
     *
     * @alias sql.backupRuns.list
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/backupRuns',
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

  self.databases = {

    /**
     * sql.databases.delete
     *
     * @desc Deletes a database from a Cloud SQL instance.
     *
     * @alias sql.databases.delete
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.database Name of the database to be deleted in the instance.
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases/{database}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'database'],
        pathParams: ['database', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.databases.get
     *
     * @desc Retrieves a resource containing information about a database inside a Cloud SQL instance.
     *
     * @alias sql.databases.get
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.database Name of the database in the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases/{database}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'database'],
        pathParams: ['database', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.databases.insert
     *
     * @desc Inserts a resource containing information about a database inside a Cloud SQL instance.
     *
     * @alias sql.databases.insert
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).Database} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases',
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
     * sql.databases.list
     *
     * @desc Lists databases in the specified Cloud SQL instance.
     *
     * @alias sql.databases.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases',
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
     * sql.databases.patch
     *
     * @desc Updates a resource containing information about a database inside a Cloud SQL instance. This method supports patch semantics.
     *
     * @alias sql.databases.patch
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.database Name of the database to be updated in the instance.
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).Database} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases/{database}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'database'],
        pathParams: ['database', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.databases.update
     *
     * @desc Updates a resource containing information about a database inside a Cloud SQL instance.
     *
     * @alias sql.databases.update
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.database Name of the database to be updated in the instance.
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).Database} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/databases/{database}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'database'],
        pathParams: ['database', 'instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.flags = {

    /**
     * sql.flags.list
     *
     * @desc List all available database flags for Google Cloud SQL instances.
     *
     * @alias sql.flags.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/flags',
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
     * @desc Creates a Cloud SQL instance as a clone of the source instance. The API is not ready for Second Generation instances yet.
     *
     * @alias sql.instances.clone
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance The ID of the Cloud SQL instance to be cloned (source). This does not include the project ID.
     * @param {string} params.project Project ID of the source as well as the clone Cloud SQL instance.
     * @param {sqladmin(v1beta4).InstancesCloneRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/clone',
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
     * sql.instances.delete
     *
     * @desc Deletes a Cloud SQL instance.
     *
     * @alias sql.instances.delete
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}',
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
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance to be exported.
     * @param {sqladmin(v1beta4).InstancesExportRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/export',
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
     * sql.instances.failover
     *
     * @desc Failover the instance to its failover replica instance.
     *
     * @alias sql.instances.failover
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project ID of the project that contains the read replica.
     * @param {sqladmin(v1beta4).InstancesFailoverRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    failover: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/failover',
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
     * @desc Retrieves a resource containing information about a Cloud SQL instance.
     *
     * @alias sql.instances.get
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}',
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
     * @desc Imports data into a Cloud SQL instance from a MySQL dump file in Google Cloud Storage.
     *
     * @alias sql.instances.import
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).InstancesImportRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/import',
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
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.project Project ID of the project to which the newly created Cloud SQL instances should belong.
     * @param {sqladmin(v1beta4).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances',
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
     * @desc Lists instances under a given project in the alphabetical order of the instance name.
     *
     * @alias sql.instances.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances',
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
     * @desc Updates settings of a Cloud SQL instance. Caution: This is not a partial update, so you must include values for all the settings that you want to retain. For partial updates, use patch.. This method supports patch semantics.
     *
     * @alias sql.instances.patch
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}',
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
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/promoteReplica',
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
     * @desc Deletes all client certificates and generates a new server SSL certificate for the instance. The changes will not take effect until the instance is restarted. Existing instances without a server certificate will need to call this once to set a server certificate.
     *
     * @alias sql.instances.resetSslConfig
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/resetSslConfig',
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
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/restart',
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
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).InstancesRestoreBackupRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/restoreBackup',
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
     * sql.instances.startReplica
     *
     * @desc Starts the replication in the read replica instance.
     *
     * @alias sql.instances.startReplica
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL read replica instance name.
     * @param {string} params.project ID of the project that contains the read replica.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    startReplica: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/startReplica',
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
     * sql.instances.stopReplica
     *
     * @desc Stops the replication in the read replica instance.
     *
     * @alias sql.instances.stopReplica
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL read replica instance name.
     * @param {string} params.project ID of the project that contains the read replica.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stopReplica: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/stopReplica',
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
     * sql.instances.truncateLog
     *
     * @desc Truncate MySQL general and slow query log tables
     *
     * @alias sql.instances.truncateLog
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the Cloud SQL project.
     * @param {sqladmin(v1beta4).InstancesTruncateLogRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    truncateLog: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/truncateLog',
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
     * @desc Updates settings of a Cloud SQL instance. Caution: This is not a partial update, so you must include values for all the settings that you want to retain. For partial updates, use patch.
     *
     * @alias sql.instances.update
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).DatabaseInstance} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}',
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
     * @desc Retrieves an instance operation that has been performed on an instance.
     *
     * @alias sql.operations.get
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/operations/{operation}',
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
     * sql.operations.list
     *
     * @desc Lists all instance operations that have been performed on the given Cloud SQL instance in the reverse chronological order of the start time.
     *
     * @alias sql.operations.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['project', 'instance'],
        pathParams: ['project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sslCerts = {

    /**
     * sql.sslCerts.createEphemeral
     *
     * @desc Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.
     *
     * @alias sql.sslCerts.createEphemeral
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the Cloud SQL project.
     * @param {sqladmin(v1beta4).SslCertsCreateEphemeralRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    createEphemeral: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/createEphemeral',
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
     * sql.sslCerts.delete
     *
     * @desc Deletes the SSL certificate. The change will not take effect until the instance is restarted.
     *
     * @alias sql.sslCerts.delete
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/sslCerts/{sha1Fingerprint}',
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
     * @desc Retrieves a particular SSL certificate. Does not include the private key (required for usage). The private key must be saved from the response to initial creation.
     *
     * @alias sql.sslCerts.get
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/sslCerts/{sha1Fingerprint}',
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
     * @desc Creates an SSL certificate and returns it along with the private key and server certificate authority. The new certificate will not be usable until the instance is restarted.
     *
     * @alias sql.sslCerts.insert
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Cloud SQL instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project to which the newly created Cloud SQL instances should belong.
     * @param {sqladmin(v1beta4).SslCertsInsertRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/sslCerts',
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
     * @desc Lists all of the current SSL certificates for the instance.
     *
     * @alias sql.sslCerts.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/sslCerts',
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
     * @desc Lists all available service tiers for Google Cloud SQL, for example D1, D2. For related information, see Pricing.
     *
     * @alias sql.tiers.list
     * @memberOf! sqladmin(v1beta4)
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/tiers',
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

  self.users = {

    /**
     * sql.users.delete
     *
     * @desc Deletes a user from a Cloud SQL instance.
     *
     * @alias sql.users.delete
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.host Host of the user in the instance.
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.name Name of the user in the instance.
     * @param {string} params.project Project ID of the project that contains the instance.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/users',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'host', 'name'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * sql.users.insert
     *
     * @desc Creates a new user in a Cloud SQL instance.
     *
     * @alias sql.users.insert
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/users',
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
     * sql.users.list
     *
     * @desc Lists users in the specified Cloud SQL instance.
     *
     * @alias sql.users.list
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.instance Database instance ID. This does not include the project ID.
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/users',
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
     * sql.users.update
     *
     * @desc Updates an existing user in a Cloud SQL instance.
     *
     * @alias sql.users.update
     * @memberOf! sqladmin(v1beta4)
     *
     * @param {object} params Parameters for request
     * @param {string} params.host Host of the user in the instance.
     * @param {string} params.instance Database instance ID. This does not include the project ID.
     * @param {string} params.name Name of the user in the instance.
     * @param {string} params.project Project ID of the project that contains the instance.
     * @param {sqladmin(v1beta4).User} params.resource Request body data
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
          url: 'https://www.googleapis.com/sql/v1beta4/projects/{project}/instances/{instance}/users',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['project', 'instance', 'host', 'name'],
        pathParams: ['instance', 'project'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef AclEntry
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} expirationTime The time when this access control entry expires in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} kind This is always sql#aclEntry.
 * @property {string} name An optional label to identify this entry.
 * @property {string} value The whitelisted value for the access control list.
 */
/**
 * @typedef BackupConfiguration
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {boolean} binaryLogEnabled Whether binary log is enabled. If backup configuration is disabled, binary log must be disabled as well.
 * @property {boolean} enabled Whether this configuration is enabled.
 * @property {string} kind This is always sql#backupConfiguration.
 * @property {string} startTime Start time for the daily backup configuration in UTC timezone in the 24 hour format - HH:MM.
 */
/**
 * @typedef BackupRun
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} description The description of this run, only applicable to on-demand backups.
 * @property {string} endTime The time the backup operation completed in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} enqueuedTime The time the run was enqueued in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {sqladmin(v1beta4).OperationError} error Information about why the backup operation failed. This is only present if the run has the FAILED status.
 * @property {string} id A unique identifier for this backup run. Note that this is unique only within the scope of a particular Cloud SQL instance.
 * @property {string} instance Name of the database instance.
 * @property {string} kind This is always sql#backupRun.
 * @property {string} selfLink The URI of this resource.
 * @property {string} startTime The time the backup operation actually started in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} status The status of this run.
 * @property {string} type The type of this run; can be either &quot;AUTOMATED&quot; or &quot;ON_DEMAND&quot;.
 * @property {string} windowStartTime The start time of the backup window during which this the backup was attempted in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 */
/**
 * @typedef BackupRunsListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).BackupRun[]} items A list of backup runs in reverse chronological order of the enqueued time.
 * @property {string} kind This is always sql#backupRunsList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef BinLogCoordinates
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} binLogFileName Name of the binary log file for a Cloud SQL instance.
 * @property {string} binLogPosition Position (offset) within the binary log file.
 * @property {string} kind This is always sql#binLogCoordinates.
 */
/**
 * @typedef CloneContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).BinLogCoordinates} binLogCoordinates Binary log coordinates, if specified, indentify the the position up to which the source instance should be cloned. If not specified, the source instance is cloned up to the most recent binary log coordintes.
 * @property {string} destinationInstanceName Name of the Cloud SQL instance to be created as a clone.
 * @property {string} kind This is always sql#cloneContext.
 */
/**
 * @typedef Database
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} charset The MySQL charset value.
 * @property {string} collation The MySQL collation value.
 * @property {string} etag HTTP 1.1 Entity tag for the resource.
 * @property {string} instance The name of the Cloud SQL instance. This does not include the project ID.
 * @property {string} kind This is always sql#database.
 * @property {string} name The name of the database in the Cloud SQL instance. This does not include the project ID or instance name.
 * @property {string} project The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable.
 * @property {string} selfLink The URI of this resource.
 */
/**
 * @typedef DatabaseFlags
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} name The name of the flag. These flags are passed at instance startup, so include both MySQL server options and MySQL system variables. Flags should be specified with underscores, not hyphens. For more information, see Configuring MySQL Flags in the Google Cloud SQL documentation, as well as the official MySQL documentation for server options and system variables.
 * @property {string} value The value of the flag. Booleans should be set to on for true and off for false. This field must be omitted if the flag doesn&#39;t take a value.
 */
/**
 * @typedef DatabaseInstance
 * @memberOf! sqladmin(v1beta4)
 * @type object
* @property {string} backendType FIRST_GEN: Basic Cloud SQL instance that runs in a Google-managed container.
SECOND_GEN: A newer Cloud SQL backend that runs in a Compute Engine VM.
EXTERNAL: A MySQL server that is not managed by Google.
* @property {string} connectionName Connection name of the Cloud SQL instance used in connection strings.
* @property {string} currentDiskSize The current disk usage of the instance in bytes. This property has been deprecated. Users should use the &quot;cloudsql.googleapis.com/database/disk/bytes_used&quot; metric in Cloud Monitoring API instead. Please see https://groups.google.com/d/msg/google-cloud-sql-announce/I_7-F9EBhT0/BtvFtdFeAgAJ for details.
* @property {string} databaseVersion The database engine type and version. The databaseVersion can not be changed after instance creation. Can be MYSQL_5_5, MYSQL_5_6 or MYSQL_5_7. Defaults to MYSQL_5_6. MYSQL_5_7 is applicable only to Second Generation instances.
* @property {string} etag HTTP 1.1 Entity tag for the resource.
* @property {object} failoverReplica The name and status of the failover replica. This property is applicable only to Second Generation instances.
* @property {string} instanceType The instance type. This can be one of the following.
CLOUD_SQL_INSTANCE: A Cloud SQL instance that is not replicating from a master.
ON_PREMISES_INSTANCE: An instance running on the customer&#39;s premises.
READ_REPLICA_INSTANCE: A Cloud SQL instance configured as a read-replica.
* @property {sqladmin(v1beta4).IpMapping[]} ipAddresses The assigned IP addresses for the instance.
* @property {string} ipv6Address The IPv6 address assigned to the instance. This property is applicable only to First Generation instances.
* @property {string} kind This is always sql#instance.
* @property {string} masterInstanceName The name of the instance which will act as master in the replication setup.
* @property {string} maxDiskSize The maximum disk size of the instance in bytes.
* @property {string} name Name of the Cloud SQL instance. This does not include the project ID.
* @property {sqladmin(v1beta4).OnPremisesConfiguration} onPremisesConfiguration Configuration specific to on-premises instances.
* @property {string} project The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.
* @property {string} region The geographical region. Can be us-central (FIRST_GEN instances only), us-central1 (SECOND_GEN instances only), asia-east1 or europe-west1. Defaults to us-central or us-central1 depending on the instance type (First Generation or Second Generation). The region can not be changed after instance creation.
* @property {sqladmin(v1beta4).ReplicaConfiguration} replicaConfiguration Configuration specific to read-replicas replicating from on-premises masters.
* @property {string[]} replicaNames The replicas of the instance.
* @property {string} selfLink The URI of this resource.
* @property {sqladmin(v1beta4).SslCert} serverCaCert SSL configuration.
* @property {string} serviceAccountEmailAddress The service account email address assigned to the instance. This property is applicable only to Second Generation instances.
* @property {sqladmin(v1beta4).Settings} settings The user settings.
* @property {string} state The current serving state of the Cloud SQL instance. This can be one of the following.
RUNNABLE: The instance is running, or is ready to run when accessed.
SUSPENDED: The instance is not available, for example due to problems with billing.
PENDING_CREATE: The instance is being created.
MAINTENANCE: The instance is down for maintenance.
FAILED: The instance creation failed.
UNKNOWN_STATE: The state of the instance is unknown.
* @property {string[]} suspensionReason If the instance state is SUSPENDED, the reason for the suspension.
*/
/**
 * @typedef DatabasesListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).Database[]} items List of database resources in the instance.
 * @property {string} kind This is always sql#databasesList.
 */
/**
 * @typedef ExportContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
* @property {object} csvExportOptions Options for exporting data as CSV.
* @property {string[]} databases Databases (for example, guestbook) from which the export is made. If fileType is SQL and no database is specified, all databases are exported. If fileType is CSV, you can optionally specify at most one database to export. If csvExportOptions.selectQuery also specifies the database, this field will be ignored.
* @property {string} fileType The file type for the specified uri.
SQL: The file contains SQL statements.
CSV: The file contains CSV data.
* @property {string} kind This is always sql#exportContext.
* @property {object} sqlExportOptions Options for exporting data as SQL statements.
* @property {string} uri The path to the file in Google Cloud Storage where the export will be stored. The URI is in the form gs://bucketName/fileName. If the file already exists, the operation fails. If fileType is SQL and the filename ends with .gz, the contents are compressed.
*/
/**
 * @typedef FailoverContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} kind This is always sql#failoverContext.
 * @property {string} settingsVersion The current settings version of this instance. Request will be rejected if this version doesn&#39;t match the current settings version.
 */
/**
 * @typedef Flag
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string[]} allowedStringValues For STRING flags, a list of strings that the value can be set to.
 * @property {string[]} appliesTo The database version this flag applies to. Can be MYSQL_5_5, MYSQL_5_6, or MYSQL_5_7. MYSQL_5_7 is applicable only to Second Generation instances.
 * @property {string} kind This is always sql#flag.
 * @property {string} maxValue For INTEGER flags, the maximum allowed value.
 * @property {string} minValue For INTEGER flags, the minimum allowed value.
 * @property {string} name This is the name of the flag. Flag names always use underscores, not hyphens, e.g. max_allowed_packet
 * @property {boolean} requiresRestart Indicates whether changing this flag will trigger a database restart. Only applicable to Second Generation instances.
 * @property {string} type The type of the flag. Flags are typed to being BOOLEAN, STRING, INTEGER or NONE. NONE is used for flags which do not take a value, such as skip_grant_tables.
 */
/**
 * @typedef FlagsListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).Flag[]} items List of flags.
 * @property {string} kind This is always sql#flagsList.
 */
/**
 * @typedef ImportContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
* @property {object} csvImportOptions Options for importing data as CSV.
* @property {string} database The database (for example, guestbook) to which the import is made. If fileType is SQL and no database is specified, it is assumed that the database is specified in the file to be imported. If fileType is CSV, it must be specified.
* @property {string} fileType The file type for the specified uri.
SQL: The file contains SQL statements.
CSV: The file contains CSV data.
* @property {string} kind This is always sql#importContext.
* @property {string} uri A path to the file in Google Cloud Storage from which the import is made. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are supported when fileType is SQL.
*/
/**
 * @typedef InstancesCloneRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).CloneContext} cloneContext Contains details about the clone operation.
 */
/**
 * @typedef InstancesExportRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).ExportContext} exportContext Contains details about the export operation.
 */
/**
 * @typedef InstancesFailoverRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).FailoverContext} failoverContext Failover Context.
 */
/**
 * @typedef InstancesImportRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).ImportContext} importContext Contains details about the import operation.
 */
/**
 * @typedef InstancesListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).DatabaseInstance[]} items List of database instance resources.
 * @property {string} kind This is always sql#instancesList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef InstancesRestoreBackupRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).RestoreBackupContext} restoreBackupContext Parameters required to perform the restore backup operation.
 */
/**
 * @typedef InstancesTruncateLogRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).TruncateLogContext} truncateLogContext Contains details about the truncate log operation.
 */
/**
 * @typedef IpConfiguration
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).AclEntry[]} authorizedNetworks The list of external networks that are allowed to connect to the instance using the IP. In CIDR notation, also known as &#39;slash&#39; notation (e.g. 192.168.100.0/24).
 * @property {boolean} ipv4Enabled Whether the instance should be assigned an IP address or not.
 * @property {boolean} requireSsl Whether the mysqld should default to &#39;REQUIRE X509&#39; for users connecting over IP.
 */
/**
 * @typedef IpMapping
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} ipAddress The IP address assigned.
 * @property {string} timeToRetire The due time for this IP to be retired in RFC 3339 format, for example 2012-11-15T16:19:00.094Z. This field is only available when the IP is scheduled to be retired.
 * @property {string} type The type of this IP address. A PRIMARY address is an address that can accept incoming connections. An OUTGOING address is the source address of connections originating from the instance, if supported.
 */
/**
 * @typedef LocationPreference
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} followGaeApplication The AppEngine application to follow, it must be in the same region as the Cloud SQL instance.
 * @property {string} kind This is always sql#locationPreference.
 * @property {string} zone The preferred Compute Engine zone (e.g. us-centra1-a, us-central1-b, etc.).
 */
/**
 * @typedef MaintenanceWindow
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {integer} day day of week (1-7), starting on Monday.
 * @property {integer} hour hour of day - 0 to 23.
 * @property {string} kind This is always sql#maintenanceWindow.
 * @property {string} updateTrack 
 */
/**
 * @typedef MySqlReplicaConfiguration
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} caCertificate PEM representation of the trusted CA&#39;s x509 certificate.
 * @property {string} clientCertificate PEM representation of the slave&#39;s x509 certificate.
 * @property {string} clientKey PEM representation of the slave&#39;s private key. The corresponsing public key is encoded in the client&#39;s certificate.
 * @property {integer} connectRetryInterval Seconds to wait between connect retries. MySQL&#39;s default is 60 seconds.
 * @property {string} dumpFilePath Path to a SQL dump file in Google Cloud Storage from which the slave instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps should have the binlog co-ordinates from which replication should begin. This can be accomplished by setting --master-data to 1 when using mysqldump.
 * @property {string} kind This is always sql#mysqlReplicaConfiguration.
 * @property {string} masterHeartbeatPeriod Interval in milliseconds between replication heartbeats.
 * @property {string} password The password for the replication connection.
 * @property {string} sslCipher A list of permissible ciphers to use for SSL encryption.
 * @property {string} username The username for the replication connection.
 * @property {boolean} verifyServerCertificate Whether or not to check the master&#39;s Common Name value in the certificate that it sends during the SSL handshake.
 */
/**
 * @typedef OnPremisesConfiguration
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} hostPort The host and port of the on-premises instance in host:port format
 * @property {string} kind This is always sql#onPremisesConfiguration.
 */
/**
 * @typedef Operation
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} endTime The time this operation finished in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {sqladmin(v1beta4).OperationErrors} error If errors occurred during processing of this operation, this field will be populated.
 * @property {sqladmin(v1beta4).ExportContext} exportContext The context for export operation, if applicable.
 * @property {sqladmin(v1beta4).ImportContext} importContext The context for import operation, if applicable.
 * @property {string} insertTime The time this operation was enqueued in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} kind This is always sql#operation.
 * @property {string} name An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 * @property {string} operationType The type of the operation. Valid values are CREATE, DELETE, UPDATE, RESTART, IMPORT, EXPORT, BACKUP_VOLUME, RESTORE_VOLUME, CREATE_USER, DELETE_USER, CREATE_DATABASE, DELETE_DATABASE .
 * @property {string} selfLink The URI of this resource.
 * @property {string} startTime The time this operation actually started in UTC timezone in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} status The status of an operation. Valid values are PENDING, RUNNING, DONE, UNKNOWN.
 * @property {string} targetId Name of the database instance related to this operation.
 * @property {string} targetLink The URI of the instance related to the operation.
 * @property {string} targetProject The project ID of the target instance related to this operation.
 * @property {string} user The email address of the user who initiated this operation.
 */
/**
 * @typedef OperationError
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} code Identifies the specific error that occurred.
 * @property {string} kind This is always sql#operationError.
 * @property {string} message Additional information about the error encountered.
 */
/**
 * @typedef OperationErrors
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).OperationError[]} errors The list of errors encountered while processing this operation.
 * @property {string} kind This is always sql#operationErrors.
 */
/**
 * @typedef OperationsListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).Operation[]} items List of operation resources.
 * @property {string} kind This is always sql#operationsList.
 * @property {string} nextPageToken The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
 */
/**
 * @typedef ReplicaConfiguration
 * @memberOf! sqladmin(v1beta4)
 * @type object
* @property {boolean} failoverTarget Specifies if the replica is the failover target. If the field is set to true the replica will be designated as a failover replica. In case the master instance fails, the replica instance will be promoted as the new master instance.
Only one replica can be specified as failover target, and the replica has to be in different zone with the master instance.
* @property {string} kind This is always sql#replicaConfiguration.
* @property {sqladmin(v1beta4).MySqlReplicaConfiguration} mysqlReplicaConfiguration MySQL specific configuration when replicating from a MySQL on-premises master. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named master.info in the data directory.
*/
/**
 * @typedef RestoreBackupContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} backupRunId The ID of the backup run to restore from.
 * @property {string} instanceId The ID of the instance that the backup was taken from.
 * @property {string} kind This is always sql#restoreBackupContext.
 */
/**
 * @typedef Settings
 * @memberOf! sqladmin(v1beta4)
 * @type object
* @property {string} activationPolicy The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. The activation policy cannot be updated together with other settings for Second Generation instances. Valid values:
ALWAYS: The instance is on; it is not deactivated by inactivity.
NEVER: The instance is off; it is not activated, even if a connection request arrives.
ON_DEMAND: The instance responds to incoming requests, and turns itself off when not in use. Instances with PER_USE pricing turn off after 15 minutes of inactivity. Instances with PER_PACKAGE pricing turn off after 12 hours of inactivity.
* @property {string[]} authorizedGaeApplications The App Engine app IDs that can access this instance. This property is only applicable to First Generation instances.
* @property {sqladmin(v1beta4).BackupConfiguration} backupConfiguration The daily backup configuration for the instance.
* @property {boolean} crashSafeReplicationEnabled Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property is only applicable to First Generation instances.
* @property {string} dataDiskSizeGb The size of data disk, in GB. The data disk size minimum is 10GB. Applies only to Second Generation instances.
* @property {string} dataDiskType The type of data disk. Only supported for Second Generation instances. The default type is PD_SSD. Applies only to Second Generation instances.
* @property {sqladmin(v1beta4).DatabaseFlags[]} databaseFlags The database flags passed to the instance at startup.
* @property {boolean} databaseReplicationEnabled Configuration specific to read replica instances. Indicates whether replication is enabled or not.
* @property {sqladmin(v1beta4).IpConfiguration} ipConfiguration The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled for Second Generation instances.
* @property {string} kind This is always sql#settings.
* @property {sqladmin(v1beta4).LocationPreference} locationPreference The location preference settings. This allows the instance to be located as near as possible to either an App Engine app or GCE zone for better performance. App Engine co-location is only applicable to First Generation instances.
* @property {sqladmin(v1beta4).MaintenanceWindow} maintenanceWindow The maintenance window for this instance. This specifies when the instance may be restarted for maintenance purposes. Applies only to Second Generation instances.
* @property {string} pricingPlan The pricing plan for this instance. This can be either PER_USE or PACKAGE. Only PER_USE is supported for Second Generation instances.
* @property {string} replicationType The type of replication this instance uses. This can be either ASYNCHRONOUS or SYNCHRONOUS. This property is only applicable to First Generation instances.
* @property {string} settingsVersion The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.
* @property {boolean} storageAutoResize Configuration to increase storage size automatically. The default value is false. Applies only to Second Generation instances.
* @property {string} tier The tier of service for this instance, for example D1, D2. For more information, see pricing.
*/
/**
 * @typedef SslCert
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} cert PEM representation.
 * @property {string} certSerialNumber Serial number, as extracted from the certificate.
 * @property {string} commonName User supplied name. Constrained to [a-zA-Z.-_ ]+.
 * @property {string} createTime The time when the certificate was created in RFC 3339 format, for example 2012-11-15T16:19:00.094Z
 * @property {string} expirationTime The time when the certificate expires in RFC 3339 format, for example 2012-11-15T16:19:00.094Z.
 * @property {string} instance Name of the database instance.
 * @property {string} kind This is always sql#sslCert.
 * @property {string} selfLink The URI of this resource.
 * @property {string} sha1Fingerprint Sha1 Fingerprint.
 */
/**
 * @typedef SslCertDetail
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).SslCert} certInfo The public information about the cert.
 * @property {string} certPrivateKey The private key for the client cert, in pem format. Keep private in order to protect your security.
 */
/**
 * @typedef SslCertsCreateEphemeralRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} public_key PEM encoded public key to include in the signed certificate.
 */
/**
 * @typedef SslCertsInsertRequest
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} commonName User supplied name. Must be a distinct name from the other certificates for this instance. New certificates will not be usable until the instance is restarted.
 */
/**
 * @typedef SslCertsInsertResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).SslCertDetail} clientCert The new client certificate and private key. The new certificate will not work until the instance is restarted for First Generation instances.
 * @property {string} kind This is always sql#sslCertsInsert.
 * @property {sqladmin(v1beta4).Operation} operation The operation to track the ssl certs insert request.
 * @property {sqladmin(v1beta4).SslCert} serverCaCert The server Certificate Authority&#39;s certificate. If this is missing you can force a new one to be generated by calling resetSslConfig method on instances resource.
 */
/**
 * @typedef SslCertsListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).SslCert[]} items List of client certificates for the instance.
 * @property {string} kind This is always sql#sslCertsList.
 */
/**
 * @typedef Tier
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} DiskQuota The maximum disk size of this tier in bytes.
 * @property {string} RAM The maximum RAM usage of this tier in bytes.
 * @property {string} kind This is always sql#tier.
 * @property {string[]} region The applicable regions for this tier.
 * @property {string} tier An identifier for the service tier, for example D1, D2 etc. For related information, see Pricing.
 */
/**
 * @typedef TiersListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).Tier[]} items List of tiers.
 * @property {string} kind This is always sql#tiersList.
 */
/**
 * @typedef TruncateLogContext
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} kind This is always sql#truncateLogContext.
 * @property {string} logType The type of log to truncate. Valid values are MYSQL_GENERAL_TABLE and MYSQL_SLOW_TABLE.
 */
/**
 * @typedef User
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {string} etag HTTP 1.1 Entity tag for the resource.
 * @property {string} host The host name from which the user can connect. For insert operations, host defaults to an empty string. For update operations, host is specified as part of the request URL. The host name cannot be updated after insertion.
 * @property {string} instance The name of the Cloud SQL instance. This does not include the project ID. Can be omitted for update since it is already specified on the URL.
 * @property {string} kind This is always sql#user.
 * @property {string} name The name of the user in the Cloud SQL instance. Can be omitted for update since it is already specified on the URL.
 * @property {string} password The password for the user.
 * @property {string} project The project ID of the project containing the Cloud SQL database. The Google apps domain is prefixed if applicable. Can be omitted for update since it is already specified on the URL.
 */
/**
 * @typedef UsersListResponse
 * @memberOf! sqladmin(v1beta4)
 * @type object
 * @property {sqladmin(v1beta4).User[]} items List of user resources in the instance.
 * @property {string} kind This is always sql#usersList.
 * @property {string} nextPageToken An identifier that uniquely identifies the operation. You can use this identifier to retrieve the Operations resource that has information about the operation.
 */
module.exports = Sqladmin;
