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
 * Google Cloud KMS API
 *
 * 
 *
 * @example
 * var google = require('googleapis');
 * var cloudkms = google.cloudkms('v1beta1');
 *
 * @namespace cloudkms
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Cloudkms
 */
function Cloudkms(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.projects = {

    locations: {

      /**
       * cloudkms.projects.locations.get
       *
       * @desc Get information about a location.
       *
       * @alias cloudkms.projects.locations.get
       * @memberOf! cloudkms(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.name Resource name for the location.
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
            url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * cloudkms.projects.locations.list
       *
       * @desc Lists information about the supported locations for this service.
       *
       * @alias cloudkms.projects.locations.list
       * @memberOf! cloudkms(v1beta1)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.pageSize The standard list page size.
       * @param {string=} params.filter The standard list filter.
       * @param {string} params.name The resource that owns the locations collection, if applicable.
       * @param {string=} params.pageToken The standard list page token.
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
            url: 'https://cloudkms.googleapis.com/v1beta1/{name}/locations',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['name'],
          pathParams: ['name'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      keyRings: {

        /**
         * cloudkms.projects.locations.keyRings.getIamPolicy
         *
         * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         *
         * @alias cloudkms.projects.locations.keyRings.getIamPolicy
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:getIamPolicy',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * cloudkms.projects.locations.keyRings.list
         *
         * @desc Lists KeyRings.
         *
         * @alias cloudkms.projects.locations.keyRings.list
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.pageSize Optional limit on the number of KeyRings to include in the response.  Further KeyRings can subsequently be obtained by including the ListKeyRingsResponse.next_page_token in a subsequent request.  If unspecified, the server will pick an appropriate default.
         * @param {string} params.parent Required. The resource name of the location associated with the KeyRings, in the format `projects/x/locations/x`.
         * @param {string=} params.pageToken Optional pagination token, returned earlier via ListKeyRingsResponse.next_page_token.
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/keyRings',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * cloudkms.projects.locations.keyRings.get
         *
         * @desc Returns metadata for a given KeyRing.
         *
         * @alias cloudkms.projects.locations.keyRings.get
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the KeyRing to get.
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['name'],
            pathParams: ['name'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * cloudkms.projects.locations.keyRings.create
         *
         * @desc Create a new KeyRing in a given Project and Location.
         *
         * @alias cloudkms.projects.locations.keyRings.create
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string=} params.keyRingId Required. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`
         * @param {string} params.parent Required. The resource name of the location associated with the KeyRings, in the format `projects/x/locations/x`.
         * @param {cloudkms(v1beta1).KeyRing} params.resource Request body data
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/keyRings',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['parent'],
            pathParams: ['parent'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * cloudkms.projects.locations.keyRings.setIamPolicy
         *
         * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
         *
         * @alias cloudkms.projects.locations.keyRings.setIamPolicy
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
         * @param {cloudkms(v1beta1).SetIamPolicyRequest} params.resource Request body data
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:setIamPolicy',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        /**
         * cloudkms.projects.locations.keyRings.testIamPermissions
         *
         * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         *
         * @alias cloudkms.projects.locations.keyRings.testIamPermissions
         * @memberOf! cloudkms(v1beta1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
         * @param {cloudkms(v1beta1).TestIamPermissionsRequest} params.resource Request body data
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
              url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:testIamPermissions',
              method: 'POST'
            }, options),
            params: params,
            requiredParams: ['resource'],
            pathParams: ['resource'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        },

        cryptoKeys: {

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.updatePrimaryVersion
           *
           * @desc Update the version of a CryptoKey that will be used in Encrypt
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.updatePrimaryVersion
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.name The resource name of the CryptoKey to update.
           * @param {cloudkms(v1beta1).UpdateCryptoKeyPrimaryVersionRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          updatePrimaryVersion: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://cloudkms.googleapis.com/v1beta1/{name}:updatePrimaryVersion',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['name'],
              pathParams: ['name'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.decrypt
           *
           * @desc Decrypt data that was protected by Encrypt.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.decrypt
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.name Required. The resource name of the CryptoKey to use for decryption. The server will choose the appropriate version.
           * @param {cloudkms(v1beta1).DecryptRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          decrypt: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://cloudkms.googleapis.com/v1beta1/{name}:decrypt',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['name'],
              pathParams: ['name'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.getIamPolicy
           *
           * @desc Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.getIamPolicy
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.resource_ REQUIRED: The resource for which the policy is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:getIamPolicy',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['resource'],
              pathParams: ['resource'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.list
           *
           * @desc Lists CryptoKeys.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.list
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {integer=} params.pageSize Optional limit on the number of CryptoKeys to include in the response.  Further CryptoKeys can subsequently be obtained by including the ListCryptoKeysResponse.next_page_token in a subsequent request.  If unspecified, the server will pick an appropriate default.
           * @param {string} params.parent Required. The resource name of the KeyRing to list, in the format `projects/x/locations/x/keyRings/x`.
           * @param {string=} params.pageToken Optional pagination token, returned earlier via ListCryptoKeysResponse.next_page_token.
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/cryptoKeys',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['parent'],
              pathParams: ['parent'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.get
           *
           * @desc Returns metadata for a given CryptoKey, as well as its primary CryptoKeyVersion.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.get
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.name The name of the CryptoKey to get.
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
                method: 'GET'
              }, options),
              params: params,
              requiredParams: ['name'],
              pathParams: ['name'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.create
           *
           * @desc Create a new CryptoKey within a KeyRing.  CryptoKey.purpose is required.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.create
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string=} params.cryptoKeyId Required. It must be unique within a KeyRing and match the regular expression `[a-zA-Z0-9_-]{1,63}`
           * @param {string} params.parent Required. The name of the KeyRing associated with the CryptoKeys.
           * @param {cloudkms(v1beta1).CryptoKey} params.resource Request body data
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/cryptoKeys',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['parent'],
              pathParams: ['parent'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.encrypt
           *
           * @desc Encrypt data, so that it can only be recovered by a call to Decrypt.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.encrypt
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.name Required. The resource name of the CryptoKey or CryptoKeyVersion to use for encryption.  If a CryptoKey is specified, the server will use its primary version.
           * @param {cloudkms(v1beta1).EncryptRequest} params.resource Request body data
           * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
           * @param {callback} callback The callback that handles the response.
           * @return {object} Request object
           */
          encrypt: function (params, options, callback) {
            if (typeof options === 'function') {
              callback = options;
              options = {};
            }
            options || (options = {});

            var parameters = {
              options: utils.extend({
                url: 'https://cloudkms.googleapis.com/v1beta1/{name}:encrypt',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['name'],
              pathParams: ['name'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.patch
           *
           * @desc Update a CryptoKey.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.patch
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string=} params.updateMask Required list of fields to be updated in this request.
           * @param {string} params.name Output only. The resource name for this CryptoKey in the format `projects/x/locations/x/keyRings/x/cryptoKeys/x`.
           * @param {cloudkms(v1beta1).CryptoKey} params.resource Request body data
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
                method: 'PATCH'
              }, options),
              params: params,
              requiredParams: ['name'],
              pathParams: ['name'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.setIamPolicy
           *
           * @desc Sets the access control policy on the specified resource. Replaces any existing policy.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.setIamPolicy
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.resource_ REQUIRED: The resource for which the policy is being specified. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
           * @param {cloudkms(v1beta1).SetIamPolicyRequest} params.resource Request body data
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:setIamPolicy',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['resource'],
              pathParams: ['resource'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          /**
           * cloudkms.projects.locations.keyRings.cryptoKeys.testIamPermissions
           *
           * @desc Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
           *
           * @alias cloudkms.projects.locations.keyRings.cryptoKeys.testIamPermissions
           * @memberOf! cloudkms(v1beta1)
           *
           * @param {object} params Parameters for request
           * @param {string} params.resource_ REQUIRED: The resource for which the policy detail is being requested. `resource` is usually specified as a path. For example, a Project resource is specified as `projects/{project}`.
           * @param {cloudkms(v1beta1).TestIamPermissionsRequest} params.resource Request body data
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
                url: 'https://cloudkms.googleapis.com/v1beta1/{resource}:testIamPermissions',
                method: 'POST'
              }, options),
              params: params,
              requiredParams: ['resource'],
              pathParams: ['resource'],
              context: self
            };

            return createAPIRequest(parameters, callback);
          },

          cryptoKeyVersions: {

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.restore
             *
             * @desc Restore a CryptoKeyVersion in the DESTROY_SCHEDULED, state.  Upon restoration of the CryptoKeyVersion, state will be set to DISABLED, and destroy_time will be cleared.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.restore
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {string} params.name The resource name of the CryptoKeyVersion to restore.
             * @param {cloudkms(v1beta1).RestoreCryptoKeyVersionRequest} params.resource Request body data
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
                  url: 'https://cloudkms.googleapis.com/v1beta1/{name}:restore',
                  method: 'POST'
                }, options),
                params: params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            },

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.list
             *
             * @desc Lists CryptoKeyVersions.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.list
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {integer=} params.pageSize Optional limit on the number of CryptoKeyVersions to include in the response. Further CryptoKeyVersions can subsequently be obtained by including the ListCryptoKeyVersionsResponse.next_page_token in a subsequent request. If unspecified, the server will pick an appropriate default.
             * @param {string} params.parent Required. The resource name of the CryptoKey to list, in the format `projects/x/locations/x/keyRings/x/cryptoKeys/x`.
             * @param {string=} params.pageToken Optional pagination token, returned earlier via ListCryptoKeyVersionsResponse.next_page_token.
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
                  url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/cryptoKeyVersions',
                  method: 'GET'
                }, options),
                params: params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            },

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.get
             *
             * @desc Returns metadata for a given CryptoKeyVersion.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.get
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {string} params.name The name of the CryptoKeyVersion to get.
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
                  url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
                  method: 'GET'
                }, options),
                params: params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            },

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.create
             *
             * @desc Create a new CryptoKeyVersion in a CryptoKey.  The server will assign the next sequential id. If unset, state will be set to ENABLED.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.create
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {string} params.parent Required. The name of the CryptoKey associated with the CryptoKeyVersions.
             * @param {cloudkms(v1beta1).CryptoKeyVersion} params.resource Request body data
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
                  url: 'https://cloudkms.googleapis.com/v1beta1/{parent}/cryptoKeyVersions',
                  method: 'POST'
                }, options),
                params: params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            },

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.destroy
             *
             * @desc Schedule a CryptoKeyVersion for destruction.  Upon calling this method, CryptoKeyVersion.state will be set to DESTROY_SCHEDULED and destroy_time will be set to a time 24 hours in the future, at which point the state will be changed to DESTROYED, and the key material will be irrevocably destroyed.  Before the destroy_time is reached, RestoreCryptoKeyVersion may be called to reverse the process.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.destroy
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {string} params.name The resource name of the CryptoKeyVersion to destroy.
             * @param {cloudkms(v1beta1).DestroyCryptoKeyVersionRequest} params.resource Request body data
             * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
             * @param {callback} callback The callback that handles the response.
             * @return {object} Request object
             */
            destroy: function (params, options, callback) {
              if (typeof options === 'function') {
                callback = options;
                options = {};
              }
              options || (options = {});

              var parameters = {
                options: utils.extend({
                  url: 'https://cloudkms.googleapis.com/v1beta1/{name}:destroy',
                  method: 'POST'
                }, options),
                params: params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            },

            /**
             * cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.patch
             *
             * @desc Update a CryptoKeyVersion's metadata.  state may be changed between ENABLED and DISABLED using this method. See DestroyCryptoKeyVersion and RestoreCryptoKeyVersion to move between other states.
             *
             * @alias cloudkms.projects.locations.keyRings.cryptoKeys.cryptoKeyVersions.patch
             * @memberOf! cloudkms(v1beta1)
             *
             * @param {object} params Parameters for request
             * @param {string=} params.updateMask Required list of fields to be updated in this request.
             * @param {string} params.name Output only. The resource name for this CryptoKeyVersion in the format `projects/x/locations/x/keyRings/x/cryptoKeys/x/cryptoKeyVersions/x`.
             * @param {cloudkms(v1beta1).CryptoKeyVersion} params.resource Request body data
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
                  url: 'https://cloudkms.googleapis.com/v1beta1/{name}',
                  method: 'PATCH'
                }, options),
                params: params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: self
              };

              return createAPIRequest(parameters, callback);
            }
          }
        }
      }
    }
  };
}

/**
 * @typedef CloudAuditOptions
 * @memberOf! cloudkms(v1beta1)
 * @type object
 */
/**
 * @typedef RestoreCryptoKeyVersionRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
 */
/**
 * @typedef ListCryptoKeyVersionsResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {cloudkms(v1beta1).CryptoKeyVersion[]} cryptoKeyVersions The list of CryptoKeyVersions.
* @property {string} nextPageToken A token to retrieve next page of results. Pass this value in
ListCryptoKeyVersionsRequest.page_token to retrieve the next page of
results.
* @property {integer} totalSize The total number of CryptoKeyVersions that matched the
query.
*/
/**
 * @typedef Condition
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} sys Trusted attributes supplied by any service that owns resources and uses
the IAM system for access control.
* @property {string[]} values The objects of the condition. This is mutually exclusive with &#39;value&#39;.
* @property {string} iam Trusted attributes supplied by the IAM system.
* @property {string} op An operator to apply the subject with.
* @property {string} value DEPRECATED. Use &#39;values&#39; instead.
* @property {string} svc Trusted attributes discharged by the service.
*/
/**
 * @typedef DestroyCryptoKeyVersionRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
 */
/**
 * @typedef SetIamPolicyRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} updateMask OPTIONAL: A FieldMask specifying which fields of the policy to modify. Only
the fields in the mask will be modified. If no mask is provided, a default
mask is used:
paths: &quot;bindings, etag&quot;
This field is only used by Cloud IAM.
* @property {cloudkms(v1beta1).Policy} policy REQUIRED: The complete policy to be applied to the `resource`. The size of
the policy is limited to a few 10s of KB. An empty policy is a
valid policy but certain Cloud Platform services (such as Projects)
might reject them.
*/
/**
 * @typedef TestIamPermissionsResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string[]} permissions A subset of `TestPermissionsRequest.permissions` that the caller is
allowed.
*/
/**
 * @typedef ListLocationsResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {string} nextPageToken The standard List next-page token.
 * @property {cloudkms(v1beta1).Location[]} locations A list of locations that matches the specified filter in the request.
 */
/**
 * @typedef DecryptResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {string} plaintext The decrypted data originally supplied in EncryptRequest.plaintext.
 */
/**
 * @typedef Policy
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {cloudkms(v1beta1).AuditConfig[]} auditConfigs Specifies audit logging configs for &quot;data access&quot;.
&quot;data access&quot;: generally refers to data reads/writes and admin reads.
&quot;admin activity&quot;: generally refers to admin writes.

Note: `AuditConfig` doesn&#39;t apply to &quot;admin activity&quot;, which always
enables audit logging.
* @property {cloudkms(v1beta1).Rule[]} rules If more than one rule is specified, the rules are applied in the following
manner:
- All matching LOG rules are always applied.
- If any DENY/DENY_WITH_LOG rule matches, permission is denied.
  Logging will be applied if one or more matching rule requires logging.
- Otherwise, if any ALLOW/ALLOW_WITH_LOG rule matches, permission is
  granted.
  Logging will be applied if one or more matching rule requires logging.
- Otherwise, if no rule applies, permission is denied.
* @property {cloudkms(v1beta1).Binding[]} bindings Associates a list of `members` to a `role`.
Multiple `bindings` must not be specified for the same `role`.
`bindings` with no members will result in an error.
* @property {string} etag `etag` is used for optimistic concurrency control as a way to help
prevent simultaneous updates of a policy from overwriting each other.
It is strongly suggested that systems make use of the `etag` in the
read-modify-write cycle to perform policy updates in order to avoid race
conditions: An `etag` is returned in the response to `getIamPolicy`, and
systems are expected to put that etag in the request to `setIamPolicy` to
ensure that their change will be applied to the same version of the policy.

If no `etag` is provided in the call to `setIamPolicy`, then the existing
policy is overwritten blindly.
* @property {boolean} iamOwned 
* @property {integer} version Version of the `Policy`. The default version is 0.
*/
/**
 * @typedef DataAccessOptions
 * @memberOf! cloudkms(v1beta1)
 * @type object
 */
/**
 * @typedef TestIamPermissionsRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string[]} permissions The set of permissions to check for the `resource`. Permissions with
wildcards (such as &#39;*&#39; or &#39;storage.*&#39;) are not allowed. For more
information see
[IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
*/
/**
 * @typedef Location
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {object} labels Cross-service attributes for the location. For example

    {&quot;cloud.googleapis.com/region&quot;: &quot;us-east1&quot;}
* @property {object} metadata Service-specific metadata. For example the available capacity at the given
location.
* @property {string} name Resource name for the location, which may vary between implementations.
For example: `&quot;projects/example-project/locations/us-east1&quot;`
* @property {string} locationId The canonical id for this location. For example: `&quot;us-east1&quot;`.
*/
/**
 * @typedef LogConfig
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {cloudkms(v1beta1).DataAccessOptions} dataAccess Data access options.
 * @property {cloudkms(v1beta1).CounterOptions} counter Counter options.
 * @property {cloudkms(v1beta1).CloudAuditOptions} cloudAudit Cloud audit options.
 */
/**
 * @typedef AuditConfig
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} service Specifies a service that will be enabled for audit logging.
For example, `resourcemanager`, `storage`, `compute`.
`allServices` is a special value that covers all services.
* @property {cloudkms(v1beta1).AuditLogConfig[]} auditLogConfigs The configuration for each type of logging
Next ID: 4
* @property {string[]} exemptedMembers Specifies the identities that are exempted from &quot;data access&quot; audit
logging for the `service` specified above.
Follows the same format of Binding.members.
*/
/**
 * @typedef AuditLogConfig
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} logType The log type that this config enables.
* @property {string[]} exemptedMembers Specifies the identities that are exempted from this type of logging
Follows the same format of Binding.members.
*/
/**
 * @typedef KeyRing
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} createTime Output only. The time at which this KeyRing was created.
* @property {string} name Output only. The resource name for the KeyRing in the format
`projects/x/locations/x/keyRings/x.
*/
/**
 * @typedef ListKeyRingsResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} nextPageToken A token to retrieve next page of results. Pass this value in
ListKeyRingsRequest.page_token to retrieve the next page of results.
* @property {integer} totalSize The total number of KeyRings that matched the query.
* @property {cloudkms(v1beta1).KeyRing[]} keyRings The list of KeyRings.
*/
/**
 * @typedef CryptoKeyVersion
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} destroyTime Output only. The time this CryptoKeyVersion&#39;s key material is scheduled
for destruction. Only present if state is
DESTROY_SCHEDULED.
* @property {string} state The current state of the CryptoKeyVersion.
* @property {string} destroyEventTime Output only. The time this CryptoKeyVersion&#39;s key material was
destroyed. Only present if state is
DESTROYED.
* @property {string} createTime Output only. The time at which this CryptoKeyVersion was created.
* @property {string} name Output only. The resource name for this CryptoKeyVersion in the format
`projects/x/locations/x/keyRings/x/cryptoKeys/x/cryptoKeyVersions/x.
*/
/**
 * @typedef CryptoKey
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} nextRotationTime At next_rotation_time, the Key Management Service will automatically:

1. Create a new version of this CryptoKey.
2. Mark the new version as primary.

Key rotations performed manually via
CreateCryptoKeyVersion and
UpdateCryptoKeyPrimaryVersion
do not affect next_rotation_time.
* @property {cloudkms(v1beta1).CryptoKeyVersion} primary Output only. A copy of the &quot;primary&quot; CryptoKeyVersion that will be used
by Encrypt when this CryptoKey is given
in EncryptRequest.name.

The CryptoKey&#39;s primary version can be updated via
UpdateCryptoKeyPrimaryVersion.
* @property {string} purpose The immutable purpose of this CryptoKey. Currently, the only acceptable
purpose is ENCRYPT_DECRYPT.
* @property {string} createTime Output only. The time at which this CryptoKey was created.
* @property {string} name Output only. The resource name for this CryptoKey in the format
`projects/x/locations/x/keyRings/x/cryptoKeys/x.
* @property {string} rotationPeriod next_rotation_time will be advanced by this period when the service
automatically rotates a key. Must be at least one day.

If rotation_period is set, next_rotation_time must also be set.
*/
/**
 * @typedef UpdateCryptoKeyPrimaryVersionRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {string} cryptoKeyVersionId The id of the child CryptoKeyVersion to use as primary.
 */
/**
 * @typedef Rule
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} description Human-readable description of the rule.
* @property {string[]} in If one or more &#39;in&#39; clauses are specified, the rule matches if
the PRINCIPAL/AUTHORITY_SELECTOR is in at least one of these entries.
* @property {string} action Required
* @property {cloudkms(v1beta1).Condition[]} conditions Additional restrictions that must be met
* @property {string[]} notIn If one or more &#39;not_in&#39; clauses are specified, the rule matches
if the PRINCIPAL/AUTHORITY_SELECTOR is in none of the entries.
The format for in and not_in entries is the same as for members in a
Binding (see google/iam/v1/policy.proto).
* @property {cloudkms(v1beta1).LogConfig[]} logConfig The config returned to callers of tech.iam.IAM.CheckPolicy for any entries
that match the LOG action.
* @property {string[]} permissions A permission is a string of form &#39;&lt;service&gt;.&lt;resource type&gt;.&lt;verb&gt;&#39;
(e.g., &#39;storage.buckets.list&#39;). A value of &#39;*&#39; matches all permissions,
and a verb part of &#39;*&#39; (e.g., &#39;storage.buckets.*&#39;) matches all verbs.
*/
/**
 * @typedef Binding
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string[]} members Specifies the identities requesting access for a Cloud Platform resource.
`members` can have the following values:

* `allUsers`: A special identifier that represents anyone who is
   on the internet; with or without a Google account.

* `allAuthenticatedUsers`: A special identifier that represents anyone
   who is authenticated with a Google account or a service account.

* `user:{emailid}`: An email address that represents a specific Google
   account. For example, `alice@gmail.com` or `joe@example.com`.


* `serviceAccount:{emailid}`: An email address that represents a service
   account. For example, `my-other-app@appspot.gserviceaccount.com`.

* `group:{emailid}`: An email address that represents a Google group.
   For example, `admins@example.com`.

* `domain:{domain}`: A Google Apps domain name that represents all the
   users of that domain. For example, `google.com` or `example.com`.


* @property {string} role Role that is assigned to `members`.
For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
Required
*/
/**
 * @typedef ListCryptoKeysResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {cloudkms(v1beta1).CryptoKey[]} cryptoKeys The list of CryptoKeys.
* @property {string} nextPageToken A token to retrieve next page of results. Pass this value in
ListCryptoKeysRequest.page_token to retrieve the next page of results.
* @property {integer} totalSize The total number of CryptoKeys that matched the query.
*/
/**
 * @typedef EncryptResponse
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {string} ciphertext The encrypted data.
 * @property {string} name The resource name of the CryptoKeyVersion used in encryption.
 */
/**
 * @typedef DecryptRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} additionalAuthenticatedData Optional data that must match the data originally supplied in
EncryptRequest.additional_authenticated_data.
* @property {string} ciphertext Required. The encrypted data originally returned in
EncryptResponse.ciphertext.
*/
/**
 * @typedef CounterOptions
 * @memberOf! cloudkms(v1beta1)
 * @type object
 * @property {string} metric The metric to update.
 * @property {string} field The field value to attribute.
 */
/**
 * @typedef EncryptRequest
 * @memberOf! cloudkms(v1beta1)
 * @type object
* @property {string} plaintext Required. The data to encrypt. Must be no larger than 64KiB.
* @property {string} additionalAuthenticatedData Optional data that, if specified, must also be provided during decryption
through DecryptRequest.additional_authenticated_data.  Must be no
larger than 64KiB.
*/
module.exports = Cloudkms;
