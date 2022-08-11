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
 * Tag Manager API
 *
 * Accesses Tag Manager accounts and containers.
 *
 * @example
 * var google = require('googleapis');
 * var tagmanager = google.tagmanager('v1');
 *
 * @namespace tagmanager
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Tagmanager
 */
function Tagmanager(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    /**
     * tagmanager.accounts.get
     *
     * @desc Gets a GTM Account.
     *
     * @alias tagmanager.accounts.get
     * @memberOf! tagmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The GTM Account ID.
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
          url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['accountId'],
        pathParams: ['accountId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * tagmanager.accounts.list
     *
     * @desc Lists all GTM Accounts that a user has access to.
     *
     * @alias tagmanager.accounts.list
     * @memberOf! tagmanager(v1)
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
          url: 'https://www.googleapis.com/tagmanager/v1/accounts',
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
     * tagmanager.accounts.update
     *
     * @desc Updates a GTM Account.
     *
     * @alias tagmanager.accounts.update
     * @memberOf! tagmanager(v1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.accountId The GTM Account ID.
     * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the account in storage.
     * @param {tagmanager(v1).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['accountId'],
        pathParams: ['accountId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    containers: {

      /**
       * tagmanager.accounts.containers.create
       *
       * @desc Creates a Container.
       *
       * @alias tagmanager.accounts.containers.create
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {tagmanager(v1).Container} params.resource Request body data
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.containers.delete
       *
       * @desc Deletes a Container.
       *
       * @alias tagmanager.accounts.containers.delete
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.containerId The GTM Container ID.
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'containerId'],
          pathParams: ['accountId', 'containerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.containers.get
       *
       * @desc Gets a Container.
       *
       * @alias tagmanager.accounts.containers.get
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.containerId The GTM Container ID.
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'containerId'],
          pathParams: ['accountId', 'containerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.containers.list
       *
       * @desc Lists all Containers that belongs to a GTM Account.
       *
       * @alias tagmanager.accounts.containers.list
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.containers.update
       *
       * @desc Updates a Container.
       *
       * @alias tagmanager.accounts.containers.update
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.containerId The GTM Container ID.
       * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the container in storage.
       * @param {tagmanager(v1).Container} params.resource Request body data
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'containerId'],
          pathParams: ['accountId', 'containerId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      environments: {

        /**
         * tagmanager.accounts.containers.environments.create
         *
         * @desc Creates a GTM Environment.
         *
         * @alias tagmanager.accounts.containers.environments.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).Environment} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.environments.delete
         *
         * @desc Deletes a GTM Environment.
         *
         * @alias tagmanager.accounts.containers.environments.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.environmentId The GTM Environment ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'environmentId'],
            pathParams: ['accountId', 'containerId', 'environmentId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.environments.get
         *
         * @desc Gets a GTM Environment.
         *
         * @alias tagmanager.accounts.containers.environments.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.environmentId The GTM Environment ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'environmentId'],
            pathParams: ['accountId', 'containerId', 'environmentId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.environments.list
         *
         * @desc Lists all GTM Environments of a GTM Container.
         *
         * @alias tagmanager.accounts.containers.environments.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.environments.patch
         *
         * @desc Updates a GTM Environment. This method supports patch semantics.
         *
         * @alias tagmanager.accounts.containers.environments.patch
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.environmentId The GTM Environment ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the environment in storage.
         * @param {tagmanager(v1).Environment} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}',
              method: 'PATCH'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'environmentId'],
            pathParams: ['accountId', 'containerId', 'environmentId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.environments.update
         *
         * @desc Updates a GTM Environment.
         *
         * @alias tagmanager.accounts.containers.environments.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.environmentId The GTM Environment ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the environment in storage.
         * @param {tagmanager(v1).Environment} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'environmentId'],
            pathParams: ['accountId', 'containerId', 'environmentId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      folders: {

        /**
         * tagmanager.accounts.containers.folders.create
         *
         * @desc Creates a GTM Folder.
         *
         * @alias tagmanager.accounts.containers.folders.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).Folder} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.folders.delete
         *
         * @desc Deletes a GTM Folder.
         *
         * @alias tagmanager.accounts.containers.folders.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.folderId The GTM Folder ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'folderId'],
            pathParams: ['accountId', 'containerId', 'folderId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.folders.get
         *
         * @desc Gets a GTM Folder.
         *
         * @alias tagmanager.accounts.containers.folders.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.folderId The GTM Folder ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'folderId'],
            pathParams: ['accountId', 'containerId', 'folderId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.folders.list
         *
         * @desc Lists all GTM Folders of a Container.
         *
         * @alias tagmanager.accounts.containers.folders.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.folders.update
         *
         * @desc Updates a GTM Folder.
         *
         * @alias tagmanager.accounts.containers.folders.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the folder in storage.
         * @param {string} params.folderId The GTM Folder ID.
         * @param {tagmanager(v1).Folder} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'folderId'],
            pathParams: ['accountId', 'containerId', 'folderId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        entities: {

          /**
           * tagmanager.accounts.containers.folders.entities.list
           *
           * @desc List all entities in a GTM Folder.
           *
           * @alias tagmanager.accounts.containers.folders.entities.list
           * @memberOf! tagmanager(v1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.accountId The GTM Account ID.
           * @param {string} params.containerId The GTM Container ID.
           * @param {string} params.folderId The GTM Folder ID.
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
                url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}/entities',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['accountId', 'containerId', 'folderId'],
              pathParams: ['accountId', 'containerId', 'folderId'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          }
        }
      },

      move_folders: {

        /**
         * tagmanager.accounts.containers.move_folders.update
         *
         * @desc Moves entities to a GTM Folder.
         *
         * @alias tagmanager.accounts.containers.move_folders.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.folderId The GTM Folder ID.
         * @param {string=} params.tagId The tags to be moved to the folder.
         * @param {string=} params.triggerId The triggers to be moved to the folder.
         * @param {string=} params.variableId The variables to be moved to the folder.
         * @param {tagmanager(v1).Folder} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/move_folders/{folderId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'folderId'],
            pathParams: ['accountId', 'containerId', 'folderId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      reauthorize_environments: {

        /**
         * tagmanager.accounts.containers.reauthorize_environments.update
         *
         * @desc Re-generates the authorization code for a GTM Environment.
         *
         * @alias tagmanager.accounts.containers.reauthorize_environments.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.environmentId The GTM Environment ID.
         * @param {tagmanager(v1).Environment} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/reauthorize_environments/{environmentId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'environmentId'],
            pathParams: ['accountId', 'containerId', 'environmentId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      tags: {

        /**
         * tagmanager.accounts.containers.tags.create
         *
         * @desc Creates a GTM Tag.
         *
         * @alias tagmanager.accounts.containers.tags.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).Tag} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.tags.delete
         *
         * @desc Deletes a GTM Tag.
         *
         * @alias tagmanager.accounts.containers.tags.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.tagId The GTM Tag ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'tagId'],
            pathParams: ['accountId', 'containerId', 'tagId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.tags.get
         *
         * @desc Gets a GTM Tag.
         *
         * @alias tagmanager.accounts.containers.tags.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.tagId The GTM Tag ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'tagId'],
            pathParams: ['accountId', 'containerId', 'tagId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.tags.list
         *
         * @desc Lists all GTM Tags of a Container.
         *
         * @alias tagmanager.accounts.containers.tags.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.tags.update
         *
         * @desc Updates a GTM Tag.
         *
         * @alias tagmanager.accounts.containers.tags.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the tag in storage.
         * @param {string} params.tagId The GTM Tag ID.
         * @param {tagmanager(v1).Tag} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'tagId'],
            pathParams: ['accountId', 'containerId', 'tagId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      triggers: {

        /**
         * tagmanager.accounts.containers.triggers.create
         *
         * @desc Creates a GTM Trigger.
         *
         * @alias tagmanager.accounts.containers.triggers.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).Trigger} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.triggers.delete
         *
         * @desc Deletes a GTM Trigger.
         *
         * @alias tagmanager.accounts.containers.triggers.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.triggerId The GTM Trigger ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'triggerId'],
            pathParams: ['accountId', 'containerId', 'triggerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.triggers.get
         *
         * @desc Gets a GTM Trigger.
         *
         * @alias tagmanager.accounts.containers.triggers.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.triggerId The GTM Trigger ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'triggerId'],
            pathParams: ['accountId', 'containerId', 'triggerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.triggers.list
         *
         * @desc Lists all GTM Triggers of a Container.
         *
         * @alias tagmanager.accounts.containers.triggers.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.triggers.update
         *
         * @desc Updates a GTM Trigger.
         *
         * @alias tagmanager.accounts.containers.triggers.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the trigger in storage.
         * @param {string} params.triggerId The GTM Trigger ID.
         * @param {tagmanager(v1).Trigger} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'triggerId'],
            pathParams: ['accountId', 'containerId', 'triggerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      variables: {

        /**
         * tagmanager.accounts.containers.variables.create
         *
         * @desc Creates a GTM Variable.
         *
         * @alias tagmanager.accounts.containers.variables.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).Variable} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.variables.delete
         *
         * @desc Deletes a GTM Variable.
         *
         * @alias tagmanager.accounts.containers.variables.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.variableId The GTM Variable ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'variableId'],
            pathParams: ['accountId', 'containerId', 'variableId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.variables.get
         *
         * @desc Gets a GTM Variable.
         *
         * @alias tagmanager.accounts.containers.variables.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.variableId The GTM Variable ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'variableId'],
            pathParams: ['accountId', 'containerId', 'variableId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.variables.list
         *
         * @desc Lists all GTM Variables of a Container.
         *
         * @alias tagmanager.accounts.containers.variables.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.variables.update
         *
         * @desc Updates a GTM Variable.
         *
         * @alias tagmanager.accounts.containers.variables.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the variable in storage.
         * @param {string} params.variableId The GTM Variable ID.
         * @param {tagmanager(v1).Variable} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'variableId'],
            pathParams: ['accountId', 'containerId', 'variableId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      },

      versions: {

        /**
         * tagmanager.accounts.containers.versions.create
         *
         * @desc Creates a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.create
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {tagmanager(v1).CreateContainerVersionRequestVersionOptions} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.delete
         *
         * @desc Deletes a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.delete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}',
              method: 'DELETE'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.get
         *
         * @desc Gets a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.get
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID. Specify published to retrieve the currently published version.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.list
         *
         * @desc Lists all Container Versions of a GTM Container.
         *
         * @alias tagmanager.accounts.containers.versions.list
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {boolean=} params.headers Retrieve headers only when true.
         * @param {boolean=} params.includeDeleted Also retrieve deleted (archived) versions when true.
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId'],
            pathParams: ['accountId', 'containerId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.publish
         *
         * @desc Publishes a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.publish
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the container version in storage.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        publish: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/publish',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.restore
         *
         * @desc Restores a Container Version. This will overwrite the container's current configuration (including its variables, triggers and tags). The operation will not have any effect on the version that is being served (i.e. the published version).
         *
         * @alias tagmanager.accounts.containers.versions.restore
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        restore: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/restore',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.undelete
         *
         * @desc Undeletes a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.undelete
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        undelete: function (params, options, callback) {
          if (typeof options === 'function') {
            callback = options;
            options = {};
          }
          options || (options = {});

          var parameters = {
            options: utils.extend({
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/undelete',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * tagmanager.accounts.containers.versions.update
         *
         * @desc Updates a Container Version.
         *
         * @alias tagmanager.accounts.containers.versions.update
         * @memberOf! tagmanager(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId The GTM Account ID.
         * @param {string} params.containerId The GTM Container ID.
         * @param {string} params.containerVersionId The GTM Container Version ID.
         * @param {string=} params.fingerprint When provided, this fingerprint must match the fingerprint of the container version in storage.
         * @param {tagmanager(v1).ContainerVersion} params.resource Request body data
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
              url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}',
              method: 'PUT'
            }, options),
            params: params,
            requiredParams: ['accountId', 'containerId', 'containerVersionId'],
            pathParams: ['accountId', 'containerId', 'containerVersionId'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    permissions: {

      /**
       * tagmanager.accounts.permissions.create
       *
       * @desc Creates a user's Account & Container Permissions.
       *
       * @alias tagmanager.accounts.permissions.create
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {tagmanager(v1).UserAccess} params.resource Request body data
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/permissions',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.permissions.delete
       *
       * @desc Removes a user from the account, revoking access to it and all of its containers.
       *
       * @alias tagmanager.accounts.permissions.delete
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.permissionId The GTM User ID.
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['accountId', 'permissionId'],
          pathParams: ['accountId', 'permissionId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.permissions.get
       *
       * @desc Gets a user's Account & Container Permissions.
       *
       * @alias tagmanager.accounts.permissions.get
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.permissionId The GTM User ID.
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'permissionId'],
          pathParams: ['accountId', 'permissionId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.permissions.list
       *
       * @desc List all users that have access to the account along with Account and Container Permissions granted to each of them.
       *
       * @alias tagmanager.accounts.permissions.list
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID. @required tagmanager.accounts.permissions.list
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/permissions',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * tagmanager.accounts.permissions.update
       *
       * @desc Updates a user's Account & Container Permissions.
       *
       * @alias tagmanager.accounts.permissions.update
       * @memberOf! tagmanager(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId The GTM Account ID.
       * @param {string} params.permissionId The GTM User ID.
       * @param {tagmanager(v1).UserAccess} params.resource Request body data
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
            url: 'https://www.googleapis.com/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['accountId', 'permissionId'],
          pathParams: ['accountId', 'permissionId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };
}

/**
 * @typedef Account
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId The Account ID uniquely identifies the GTM Account.
 * @property {string} fingerprint The fingerprint of the GTM Account as computed at storage time. This value is recomputed whenever the account is modified.
 * @property {string} name Account display name.
 * @property {boolean} shareData Whether the account shares data anonymously with Google and others.
 */
/**
 * @typedef AccountAccess
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string[]} permission List of Account permissions. Valid account permissions are read and manage.
 */
/**
 * @typedef Condition
 * @memberOf! tagmanager(v1)
 * @type object
* @property {tagmanager(v1).Parameter[]} parameter A list of named parameters (key/value), depending on the condition&#39;s type. Notes: 
- For binary operators, include parameters named arg0 and arg1 for specifying the left and right operands, respectively. 
- At this time, the left operand (arg0) must be a reference to a variable. 
- For case-insensitive Regex matching, include a boolean parameter named ignore_case that is set to true. If not specified or set to any other value, the matching will be case sensitive. 
- To negate an operator, include a boolean parameter named negate boolean parameter that is set to true.
* @property {string} type The type of operator for this condition.
*/
/**
 * @typedef Container
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} containerId The Container ID uniquely identifies the GTM Container.
 * @property {string[]} domainName Optional list of domain names associated with the Container.
 * @property {string[]} enabledBuiltInVariable List of enabled built-in variables. Valid values include: pageUrl, pageHostname, pagePath, referrer, event, clickElement, clickClasses, clickId, clickTarget, clickUrl, clickText, formElement, formClasses, formId, formTarget, formUrl, formText, errorMessage, errorUrl, errorLine, newHistoryFragment, oldHistoryFragment, newHistoryState, oldHistoryState, historySource, containerVersion, debugMode, randomNumber, containerId.
 * @property {string} fingerprint The fingerprint of the GTM Container as computed at storage time. This value is recomputed whenever the account is modified.
 * @property {string} name Container display name.
 * @property {string} notes Container Notes.
 * @property {string} publicId Container Public ID.
 * @property {string} timeZoneCountryId Container Country ID.
 * @property {string} timeZoneId Container Time Zone ID.
 * @property {string[]} usageContext List of Usage Contexts for the Container. Valid values include: web, android, ios.
 */
/**
 * @typedef ContainerAccess
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} containerId GTM Container ID.
 * @property {string[]} permission List of Container permissions. Valid container permissions are: read, edit, delete, publish.
 */
/**
 * @typedef ContainerVersion
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {tagmanager(v1).Container} container The container that this version was taken from.
 * @property {string} containerId GTM Container ID.
 * @property {string} containerVersionId The Container Version ID uniquely identifies the GTM Container Version.
 * @property {boolean} deleted A value of true indicates this container version has been deleted.
 * @property {string} fingerprint The fingerprint of the GTM Container Version as computed at storage time. This value is recomputed whenever the container version is modified.
 * @property {tagmanager(v1).Folder[]} folder The folders in the container that this version was taken from.
 * @property {tagmanager(v1).Macro[]} macro The macros in the container that this version was taken from.
 * @property {string} name Container version display name.
 * @property {string} notes User notes on how to apply this container version in the container.
 * @property {tagmanager(v1).Rule[]} rule The rules in the container that this version was taken from.
 * @property {tagmanager(v1).Tag[]} tag The tags in the container that this version was taken from.
 * @property {tagmanager(v1).Trigger[]} trigger The triggers in the container that this version was taken from.
 * @property {tagmanager(v1).Variable[]} variable The variables in the container that this version was taken from.
 */
/**
 * @typedef ContainerVersionHeader
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} containerId GTM Container ID.
 * @property {string} containerVersionId The Container Version ID uniquely identifies the GTM Container Version.
 * @property {boolean} deleted A value of true indicates this container version has been deleted.
 * @property {string} name Container version display name.
 * @property {string} numMacros Number of macros in the container version.
 * @property {string} numRules Number of rules in the container version.
 * @property {string} numTags Number of tags in the container version.
 * @property {string} numTriggers Number of triggers in the container version.
 * @property {string} numVariables Number of variables in the container version.
 */
/**
 * @typedef CreateContainerVersionRequestVersionOptions
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} name The name of the container version to be created.
 * @property {string} notes The notes of the container version to be created.
 * @property {boolean} quickPreview The creation of this version may be for quick preview and shouldn&#39;t be saved.
 */
/**
 * @typedef CreateContainerVersionResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {boolean} compilerError Compiler errors or not.
 * @property {tagmanager(v1).ContainerVersion} containerVersion The container version created.
 */
/**
 * @typedef Environment
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} authorizationCode The environment authorization code.
 * @property {string} authorizationTimestampMs The last update time-stamp for the authorization code.
 * @property {string} containerId GTM Container ID.
 * @property {string} containerVersionId 
 * @property {string} description The environment description. Can be set or changed only on USER type environments.
 * @property {boolean} enableDebug Whether or not to enable debug by default on for the environment.
 * @property {string} environmentId GTM Environment ID uniquely identifies the GTM Environment.
 * @property {string} fingerprint The fingerprint of the GTM environment as computed at storage time. This value is recomputed whenever the environment is modified.
 * @property {string} name The environment display name. Can be set or changed only on USER type environments.
 * @property {string} type The type of this environment.
 * @property {string} url Default preview page url for the environment.
 */
/**
 * @typedef Folder
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} containerId GTM Container ID.
 * @property {string} fingerprint The fingerprint of the GTM Folder as computed at storage time. This value is recomputed whenever the folder is modified.
 * @property {string} folderId The Folder ID uniquely identifies the GTM Folder.
 * @property {string} name Folder display name.
 */
/**
 * @typedef FolderEntities
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Tag[]} tag The list of tags inside the folder.
 * @property {tagmanager(v1).Trigger[]} trigger The list of triggers inside the folder.
 * @property {tagmanager(v1).Variable[]} variable The list of variables inside the folder.
 */
/**
 * @typedef ListAccountUsersResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).UserAccess[]} userAccess All GTM AccountUsers of a GTM Account.
 */
/**
 * @typedef ListAccountsResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Account[]} accounts List of GTM Accounts that a user has access to.
 */
/**
 * @typedef ListContainerVersionsResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).ContainerVersion[]} containerVersion All versions of a GTM Container.
 * @property {tagmanager(v1).ContainerVersionHeader[]} containerVersionHeader All container version headers of a GTM Container.
 */
/**
 * @typedef ListContainersResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Container[]} containers All Containers of a GTM Account.
 */
/**
 * @typedef ListEnvironmentsResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Environment[]} environments All Environments of a GTM Container.
 */
/**
 * @typedef ListFoldersResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Folder[]} folders All GTM Folders of a GTM Container.
 */
/**
 * @typedef ListTagsResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Tag[]} tags All GTM Tags of a GTM Container.
 */
/**
 * @typedef ListTriggersResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Trigger[]} triggers All GTM Triggers of a GTM Container.
 */
/**
 * @typedef ListVariablesResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).Variable[]} variables All GTM Variables of a GTM Container.
 */
/**
 * @typedef Macro
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} containerId GTM Container ID.
 * @property {string[]} disablingRuleId For mobile containers only: A list of rule IDs for disabling conditional macros; the macro is enabled if one of the enabling rules is true while all the disabling rules are false. Treated as an unordered set.
 * @property {string[]} enablingRuleId For mobile containers only: A list of rule IDs for enabling conditional macros; the macro is enabled if one of the enabling rules is true while all the disabling rules are false. Treated as an unordered set.
 * @property {string} fingerprint The fingerprint of the GTM Macro as computed at storage time. This value is recomputed whenever the macro is modified.
 * @property {string} macroId The Macro ID uniquely identifies the GTM Macro.
 * @property {string} name Macro display name.
 * @property {string} notes User notes on how to apply this macro in the container.
 * @property {tagmanager(v1).Parameter[]} parameter The macro&#39;s parameters.
 * @property {string} parentFolderId Parent folder id.
 * @property {string} scheduleEndMs The end timestamp in milliseconds to schedule a macro.
 * @property {string} scheduleStartMs The start timestamp in milliseconds to schedule a macro.
 * @property {string} type GTM Macro Type.
 */
/**
 * @typedef Parameter
 * @memberOf! tagmanager(v1)
 * @type object
* @property {string} key The named key that uniquely identifies a parameter. Required for top-level parameters, as well as map values. Ignored for list values.
* @property {tagmanager(v1).Parameter[]} list This list parameter&#39;s parameters (keys will be ignored).
* @property {tagmanager(v1).Parameter[]} map This map parameter&#39;s parameters (must have keys; keys must be unique).
* @property {string} type The parameter type. Valid values are: 
- boolean: The value represents a boolean, represented as &#39;true&#39; or &#39;false&#39; 
- integer: The value represents a 64-bit signed integer value, in base 10 
- list: A list of parameters should be specified 
- map: A map of parameters should be specified 
- template: The value represents any text; this can include variable references (even variable references that might return non-string types)
* @property {string} value A parameter&#39;s value (may contain variable references such as &quot;{{myVariable}}&quot;) as appropriate to the specified type.
*/
/**
 * @typedef PublishContainerVersionResponse
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {boolean} compilerError Compiler errors or not.
 * @property {tagmanager(v1).ContainerVersion} containerVersion The container version created.
 */
/**
 * @typedef Rule
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {tagmanager(v1).Condition[]} condition The list of conditions that make up this rule (implicit AND between them).
 * @property {string} containerId GTM Container ID.
 * @property {string} fingerprint The fingerprint of the GTM Rule as computed at storage time. This value is recomputed whenever the rule is modified.
 * @property {string} name Rule display name.
 * @property {string} notes User notes on how to apply this rule in the container.
 * @property {string} ruleId The Rule ID uniquely identifies the GTM Rule.
 */
/**
 * @typedef SetupTag
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {boolean} stopOnSetupFailure If true, fire the main tag if and only if the setup tag fires successfully. If false, fire the main tag regardless of setup tag firing status.
 * @property {string} tagName The name of the setup tag.
 */
/**
 * @typedef Tag
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string[]} blockingRuleId Blocking rule IDs. If any of the listed rules evaluate to true, the tag will not fire.
 * @property {string[]} blockingTriggerId Blocking trigger IDs. If any of the listed triggers evaluate to true, the tag will not fire.
 * @property {string} containerId GTM Container ID.
 * @property {string} fingerprint The fingerprint of the GTM Tag as computed at storage time. This value is recomputed whenever the tag is modified.
 * @property {string[]} firingRuleId Firing rule IDs. A tag will fire when any of the listed rules are true and all of its blockingRuleIds (if any specified) are false.
 * @property {string[]} firingTriggerId Firing trigger IDs. A tag will fire when any of the listed triggers are true and all of its blockingTriggerIds (if any specified) are false.
 * @property {boolean} liveOnly If set to true, this tag will only fire in the live environment (e.g. not in preview or debug mode).
 * @property {string} name Tag display name.
 * @property {string} notes User notes on how to apply this tag in the container.
 * @property {tagmanager(v1).Parameter[]} parameter The tag&#39;s parameters.
 * @property {string} parentFolderId Parent folder id.
 * @property {tagmanager(v1).Parameter} priority User defined numeric priority of the tag. Tags are fired asynchronously in order of priority. Tags with higher numeric value fire first. A tag&#39;s priority can be a positive or negative value. The default value is 0.
 * @property {string} scheduleEndMs The end timestamp in milliseconds to schedule a tag.
 * @property {string} scheduleStartMs The start timestamp in milliseconds to schedule a tag.
 * @property {tagmanager(v1).SetupTag[]} setupTag The list of setup tags. Currently we only allow one.
 * @property {string} tagFiringOption Option to fire this tag.
 * @property {string} tagId The Tag ID uniquely identifies the GTM Tag.
 * @property {tagmanager(v1).TeardownTag[]} teardownTag The list of teardown tags. Currently we only allow one.
 * @property {string} type GTM Tag Type.
 */
/**
 * @typedef TeardownTag
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {boolean} stopTeardownOnFailure If true, fire the teardown tag if and only if the main tag fires successfully. If false, fire the teardown tag regardless of main tag firing status.
 * @property {string} tagName The name of the teardown tag.
 */
/**
 * @typedef Trigger
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {tagmanager(v1).Condition[]} autoEventFilter Used in the case of auto event tracking.
 * @property {tagmanager(v1).Parameter} checkValidation Whether or not we should only fire tags if the form submit or link click event is not cancelled by some other event handler (e.g. because of validation). Only valid for Form Submission and Link Click triggers.
 * @property {string} containerId GTM Container ID.
 * @property {tagmanager(v1).Condition[]} customEventFilter Used in the case of custom event, which is fired iff all Conditions are true.
 * @property {tagmanager(v1).Parameter} enableAllVideos Reloads the videos in the page that don&#39;t already have the YT API enabled. If false, only capture events from videos that already have the API enabled. Only valid for YouTube triggers.
 * @property {tagmanager(v1).Parameter} eventName Name of the GTM event that is fired. Only valid for Timer triggers.
 * @property {tagmanager(v1).Condition[]} filter The trigger will only fire iff all Conditions are true.
 * @property {string} fingerprint The fingerprint of the GTM Trigger as computed at storage time. This value is recomputed whenever the trigger is modified.
 * @property {tagmanager(v1).Parameter} interval Time between triggering recurring Timer Events (in milliseconds). Only valid for Timer triggers.
 * @property {tagmanager(v1).Parameter} limit Limit of the number of GTM events this Timer Trigger will fire. If no limit is set, we will continue to fire GTM events until the user leaves the page. Only valid for Timer triggers.
 * @property {string} name Trigger display name.
 * @property {string} parentFolderId Parent folder id.
 * @property {string} triggerId The Trigger ID uniquely identifies the GTM Trigger.
 * @property {string} type Defines the data layer event that causes this trigger.
 * @property {tagmanager(v1).Parameter} uniqueTriggerId Globally unique id of the trigger that auto-generates this (a Form Submit, Link Click or Timer listener) if any. Used to make incompatible auto-events work together with trigger filtering based on trigger ids. This value is populated during output generation since the tags implied by triggers don&#39;t exist until then. Only valid for Form Submit, Link Click and Timer triggers.
 * @property {tagmanager(v1).Parameter} videoPercentageList List of integer percentage values. The trigger will fire as each percentage is reached in any instrumented videos. Only valid for YouTube triggers.
 * @property {tagmanager(v1).Parameter} waitForTags Whether or not we should delay the form submissions or link opening until all of the tags have fired (by preventing the default action and later simulating the default action). Only valid for Form Submission and Link Click triggers.
 * @property {tagmanager(v1).Parameter} waitForTagsTimeout How long to wait (in milliseconds) for tags to fire when &#39;waits_for_tags&#39; above evaluates to true. Only valid for Form Submission and Link Click triggers.
 */
/**
 * @typedef UserAccess
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {tagmanager(v1).AccountAccess} accountAccess GTM Account access permissions.
 * @property {string} accountId GTM Account ID.
 * @property {tagmanager(v1).ContainerAccess[]} containerAccess GTM Container access permissions.
 * @property {string} emailAddress User&#39;s email address.
 * @property {string} permissionId Account Permission ID.
 */
/**
 * @typedef Variable
 * @memberOf! tagmanager(v1)
 * @type object
 * @property {string} accountId GTM Account ID.
 * @property {string} containerId GTM Container ID.
 * @property {string[]} disablingTriggerId For mobile containers only: A list of trigger IDs for disabling conditional variables; the variable is enabled if one of the enabling trigger is true while all the disabling trigger are false. Treated as an unordered set.
 * @property {string[]} enablingTriggerId For mobile containers only: A list of trigger IDs for enabling conditional variables; the variable is enabled if one of the enabling triggers is true while all the disabling triggers are false. Treated as an unordered set.
 * @property {string} fingerprint The fingerprint of the GTM Variable as computed at storage time. This value is recomputed whenever the variable is modified.
 * @property {string} name Variable display name.
 * @property {string} notes User notes on how to apply this variable in the container.
 * @property {tagmanager(v1).Parameter[]} parameter The variable&#39;s parameters.
 * @property {string} parentFolderId Parent folder id.
 * @property {string} scheduleEndMs The end timestamp in milliseconds to schedule a variable.
 * @property {string} scheduleStartMs The start timestamp in milliseconds to schedule a variable.
 * @property {string} type GTM Variable Type.
 * @property {string} variableId The Variable ID uniquely identifies the GTM Variable.
 */
module.exports = Tagmanager;
