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
 * Google Play Developer API
 *
 * Lets Android application developers access their Google Play accounts.
 *
 * @example
 * var google = require('googleapis');
 * var androidpublisher = google.androidpublisher('v2');
 *
 * @namespace androidpublisher
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Androidpublisher
 */
function Androidpublisher(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.edits = {

    /**
     * androidpublisher.edits.commit
     *
     * @desc Commits/applies the changes made in this edit back to the app.
     *
     * @alias androidpublisher.edits.commit
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.editId Unique identifier for this edit.
     * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    commit: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}:commit',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName', 'editId'],
        pathParams: ['editId', 'packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.edits.delete
     *
     * @desc Deletes an edit for an app. Creating a new edit will automatically delete any of your previous edits so this method need only be called if you want to preemptively abandon an edit.
     *
     * @alias androidpublisher.edits.delete
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.editId Unique identifier for this edit.
     * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['packageName', 'editId'],
        pathParams: ['editId', 'packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.edits.get
     *
     * @desc Returns information about the edit specified. Calls will fail if the edit is no long active (e.g. has been deleted, superseded or expired).
     *
     * @alias androidpublisher.edits.get
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.editId Unique identifier for this edit.
     * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName', 'editId'],
        pathParams: ['editId', 'packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.edits.insert
     *
     * @desc Creates a new edit for an app, populated with the app's current state.
     *
     * @alias androidpublisher.edits.insert
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
     * @param {androidpublisher(v2).AppEdit} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName'],
        pathParams: ['packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.edits.validate
     *
     * @desc Checks that the edit can be successfully committed. The edit's changes are not applied to the live app.
     *
     * @alias androidpublisher.edits.validate
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.editId Unique identifier for this edit.
     * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    validate: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}:validate',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName', 'editId'],
        pathParams: ['editId', 'packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    apklistings: {

      /**
       * androidpublisher.edits.apklistings.delete
       *
       * @desc Deletes the APK-specific localized listing for a specified APK and language code.
       *
       * @alias androidpublisher.edits.apklistings.delete
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the APK-specific localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings/{language}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'language'],
          pathParams: ['apkVersionCode', 'editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apklistings.deleteall
       *
       * @desc Deletes all the APK-specific localized listings for a specified APK.
       *
       * @alias androidpublisher.edits.apklistings.deleteall
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      deleteall: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode'],
          pathParams: ['apkVersionCode', 'editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apklistings.get
       *
       * @desc Fetches the APK-specific localized listing for a specified APK and language code.
       *
       * @alias androidpublisher.edits.apklistings.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the APK-specific localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings/{language}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'language'],
          pathParams: ['apkVersionCode', 'editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apklistings.list
       *
       * @desc Lists all the APK-specific localized listings for a specified APK.
       *
       * @alias androidpublisher.edits.apklistings.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode'],
          pathParams: ['apkVersionCode', 'editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apklistings.patch
       *
       * @desc Updates or creates the APK-specific localized listing for a specified APK and language code. This method supports patch semantics.
       *
       * @alias androidpublisher.edits.apklistings.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the APK-specific localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).ApkListing} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings/{language}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'language'],
          pathParams: ['apkVersionCode', 'editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apklistings.update
       *
       * @desc Updates or creates the APK-specific localized listing for a specified APK and language code.
       *
       * @alias androidpublisher.edits.apklistings.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The APK version code whose APK-specific listings should be read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the APK-specific localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).ApkListing} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/listings/{language}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'language'],
          pathParams: ['apkVersionCode', 'editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    apks: {

      /**
       * androidpublisher.edits.apks.addexternallyhosted
       *
       * @desc Creates a new APK without uploading the APK itself to Google Play, instead hosting the APK at a specified URL. This function is only available to enterprises using Google Play for Work whose application is configured to restrict distribution to the enterprise domain.
       *
       * @alias androidpublisher.edits.apks.addexternallyhosted
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).ApksAddExternallyHostedRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      addexternallyhosted: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/externallyHosted',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apks.list
       *
       * 
       *
       * @alias androidpublisher.edits.apks.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.apks.upload
       *
       * 
       *
       * @alias androidpublisher.edits.apks.upload
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      upload: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks',
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    deobfuscationfiles: {

      /**
       * androidpublisher.edits.deobfuscationfiles.upload
       *
       * @desc Uploads the deobfuscation file of the specified APK. If a deobfuscation file already exists, it will be replaced.
       *
       * @alias androidpublisher.edits.deobfuscationfiles.upload
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The version code of the APK whose deobfuscation file is being uploaded.
       * @param {string} params.deobfuscationFileType 
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier of the Android app for which the deobfuscatiuon files are being uploaded; for example, "com.spiffygame".
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      upload: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/deobfuscationFiles/{deobfuscationFileType}',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/deobfuscationFiles/{deobfuscationFileType}',
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'deobfuscationFileType'],
          pathParams: ['apkVersionCode', 'deobfuscationFileType', 'editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    details: {

      /**
       * androidpublisher.edits.details.get
       *
       * @desc Fetches app details for this edit. This includes the default language and developer support contact information.
       *
       * @alias androidpublisher.edits.details.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/details',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.details.patch
       *
       * @desc Updates app details for this edit. This method supports patch semantics.
       *
       * @alias androidpublisher.edits.details.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).AppDetails} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/details',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.details.update
       *
       * @desc Updates app details for this edit.
       *
       * @alias androidpublisher.edits.details.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).AppDetails} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/details',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    expansionfiles: {

      /**
       * androidpublisher.edits.expansionfiles.get
       *
       * @desc Fetches the Expansion File configuration for the APK specified.
       *
       * @alias androidpublisher.edits.expansionfiles.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The version code of the APK whose Expansion File configuration is being read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.expansionFileType 
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/expansionFiles/{expansionFileType}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'expansionFileType'],
          pathParams: ['apkVersionCode', 'editId', 'expansionFileType', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.expansionfiles.patch
       *
       * @desc Updates the APK's Expansion File configuration to reference another APK's Expansion Files. To add a new Expansion File use the Upload method. This method supports patch semantics.
       *
       * @alias androidpublisher.edits.expansionfiles.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The version code of the APK whose Expansion File configuration is being read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.expansionFileType 
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).ExpansionFile} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/expansionFiles/{expansionFileType}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'expansionFileType'],
          pathParams: ['apkVersionCode', 'editId', 'expansionFileType', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.expansionfiles.update
       *
       * @desc Updates the APK's Expansion File configuration to reference another APK's Expansion Files. To add a new Expansion File use the Upload method.
       *
       * @alias androidpublisher.edits.expansionfiles.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The version code of the APK whose Expansion File configuration is being read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.expansionFileType 
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).ExpansionFile} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/expansionFiles/{expansionFileType}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'expansionFileType'],
          pathParams: ['apkVersionCode', 'editId', 'expansionFileType', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.expansionfiles.upload
       *
       * @desc Uploads and attaches a new Expansion File to the APK specified.
       *
       * @alias androidpublisher.edits.expansionfiles.upload
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {integer} params.apkVersionCode The version code of the APK whose Expansion File configuration is being read or modified.
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.expansionFileType 
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      upload: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/expansionFiles/{expansionFileType}',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/androidpublisher/v2/applications/{packageName}/edits/{editId}/apks/{apkVersionCode}/expansionFiles/{expansionFileType}',
          requiredParams: ['packageName', 'editId', 'apkVersionCode', 'expansionFileType'],
          pathParams: ['apkVersionCode', 'editId', 'expansionFileType', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    images: {

      /**
       * androidpublisher.edits.images.delete
       *
       * @desc Deletes the image (specified by id) from the edit.
       *
       * @alias androidpublisher.edits.images.delete
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.imageId Unique identifier an image within the set of images attached to this edit.
       * @param {string} params.imageType 
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing whose images are to read or modified. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}/{imageType}/{imageId}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language', 'imageType', 'imageId'],
          pathParams: ['editId', 'imageId', 'imageType', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.images.deleteall
       *
       * @desc Deletes all images for the specified language and image type.
       *
       * @alias androidpublisher.edits.images.deleteall
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.imageType 
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing whose images are to read or modified. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      deleteall: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}/{imageType}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language', 'imageType'],
          pathParams: ['editId', 'imageType', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.images.list
       *
       * @desc Lists all images for the specified language and image type.
       *
       * @alias androidpublisher.edits.images.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.imageType 
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing whose images are to read or modified. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}/{imageType}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language', 'imageType'],
          pathParams: ['editId', 'imageType', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.images.upload
       *
       * @desc Uploads a new image and adds it to the list of images for the specified language and image type.
       *
       * @alias androidpublisher.edits.images.upload
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.imageType 
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing whose images are to read or modified. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} params.media Media object
       * @param {string} params.media.mimeType Media mime-type
       * @param {string|object} params.media.body Media body contents
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      upload: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}/{imageType}',
            method: 'POST'
          }, options),
          params: params,
          mediaUrl: 'https://www.googleapis.com/upload/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}/{imageType}',
          requiredParams: ['packageName', 'editId', 'language', 'imageType'],
          pathParams: ['editId', 'imageType', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    listings: {

      /**
       * androidpublisher.edits.listings.delete
       *
       * @desc Deletes the specified localized store listing from an edit.
       *
       * @alias androidpublisher.edits.listings.delete
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language'],
          pathParams: ['editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.listings.deleteall
       *
       * @desc Deletes all localized listings from an edit.
       *
       * @alias androidpublisher.edits.listings.deleteall
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      deleteall: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings',
            method: 'DELETE'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.listings.get
       *
       * @desc Fetches information about a localized store listing.
       *
       * @alias androidpublisher.edits.listings.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language'],
          pathParams: ['editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.listings.list
       *
       * @desc Returns all of the localized store listings attached to this edit.
       *
       * @alias androidpublisher.edits.listings.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.listings.patch
       *
       * @desc Creates or updates a localized store listing. This method supports patch semantics.
       *
       * @alias androidpublisher.edits.listings.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).Listing} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language'],
          pathParams: ['editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.listings.update
       *
       * @desc Creates or updates a localized store listing.
       *
       * @alias androidpublisher.edits.listings.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.language The language code (a BCP-47 language tag) of the localized listing to read or modify. For example, to select Austrian German, pass "de-AT".
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {androidpublisher(v2).Listing} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/listings/{language}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'language'],
          pathParams: ['editId', 'language', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    testers: {

      /**
       * androidpublisher.edits.testers.get
       *
       * 
       *
       * @alias androidpublisher.edits.testers.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track 
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/testers/{track}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.testers.patch
       *
       * 
       *
       * @alias androidpublisher.edits.testers.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track 
       * @param {androidpublisher(v2).Testers} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/testers/{track}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.testers.update
       *
       * 
       *
       * @alias androidpublisher.edits.testers.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track 
       * @param {androidpublisher(v2).Testers} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/testers/{track}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    tracks: {

      /**
       * androidpublisher.edits.tracks.get
       *
       * @desc Fetches the track configuration for the specified track type. Includes the APK version codes that are in this track.
       *
       * @alias androidpublisher.edits.tracks.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track The track type to read or modify.
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/tracks/{track}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.tracks.list
       *
       * @desc Lists all the track configurations for this edit.
       *
       * @alias androidpublisher.edits.tracks.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/tracks',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId'],
          pathParams: ['editId', 'packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.tracks.patch
       *
       * @desc Updates the track configuration for the specified track type. When halted, the rollout track cannot be updated without adding new APKs, and adding new APKs will cause it to resume. This method supports patch semantics.
       *
       * @alias androidpublisher.edits.tracks.patch
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track The track type to read or modify.
       * @param {androidpublisher(v2).Track} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/tracks/{track}',
            method: 'PATCH'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.edits.tracks.update
       *
       * @desc Updates the track configuration for the specified track type. When halted, the rollout track cannot be updated without adding new APKs, and adding new APKs will cause it to resume.
       *
       * @alias androidpublisher.edits.tracks.update
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.editId Unique identifier for this edit.
       * @param {string} params.packageName Unique identifier for the Android app that is being updated; for example, "com.spiffygame".
       * @param {string} params.track The track type to read or modify.
       * @param {androidpublisher(v2).Track} params.resource Request body data
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/edits/{editId}/tracks/{track}',
            method: 'PUT'
          }, options),
          params: params,
          requiredParams: ['packageName', 'editId', 'track'],
          pathParams: ['editId', 'packageName', 'track'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.entitlements = {

    /**
     * androidpublisher.entitlements.list
     *
     * @desc Lists the user's current inapp item or subscription entitlements
     *
     * @alias androidpublisher.entitlements.list
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {string} params.packageName The package name of the application the inapp product was sold in (for example, 'com.some.thing').
     * @param {string=} params.productId The product id of the inapp product (for example, 'sku1'). This can be used to restrict the result set.
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/entitlements',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName'],
        pathParams: ['packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.inappproducts = {

    /**
     * androidpublisher.inappproducts.batch
     *
     * 
     *
     * @alias androidpublisher.inappproducts.batch
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {androidpublisher(v2).InappproductsBatchRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    batch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/inappproducts/batch',
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
     * androidpublisher.inappproducts.delete
     *
     * @desc Delete an in-app product for an app.
     *
     * @alias androidpublisher.inappproducts.delete
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName Unique identifier for the Android app with the in-app product; for example, "com.spiffygame".
     * @param {string} params.sku Unique identifier for the in-app product.
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts/{sku}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['packageName', 'sku'],
        pathParams: ['packageName', 'sku'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.inappproducts.get
     *
     * @desc Returns information about the in-app product specified.
     *
     * @alias androidpublisher.inappproducts.get
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName 
     * @param {string} params.sku Unique identifier for the in-app product.
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts/{sku}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName', 'sku'],
        pathParams: ['packageName', 'sku'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.inappproducts.insert
     *
     * @desc Creates a new in-app product for an app.
     *
     * @alias androidpublisher.inappproducts.insert
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.autoConvertMissingPrices If true the prices for all regions targeted by the parent app that don't have a price specified for this in-app product will be auto converted to the target currency based on the default price. Defaults to false.
     * @param {string} params.packageName Unique identifier for the Android app; for example, "com.spiffygame".
     * @param {androidpublisher(v2).InAppProduct} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName'],
        pathParams: ['packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.inappproducts.list
     *
     * @desc List all the in-app products for an Android app, both subscriptions and managed in-app products..
     *
     * @alias androidpublisher.inappproducts.list
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {string} params.packageName Unique identifier for the Android app with in-app products; for example, "com.spiffygame".
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName'],
        pathParams: ['packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.inappproducts.patch
     *
     * @desc Updates the details of an in-app product. This method supports patch semantics.
     *
     * @alias androidpublisher.inappproducts.patch
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.autoConvertMissingPrices If true the prices for all regions targeted by the parent app that don't have a price specified for this in-app product will be auto converted to the target currency based on the default price. Defaults to false.
     * @param {string} params.packageName Unique identifier for the Android app with the in-app product; for example, "com.spiffygame".
     * @param {string} params.sku Unique identifier for the in-app product.
     * @param {androidpublisher(v2).InAppProduct} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts/{sku}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['packageName', 'sku'],
        pathParams: ['packageName', 'sku'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.inappproducts.update
     *
     * @desc Updates the details of an in-app product.
     *
     * @alias androidpublisher.inappproducts.update
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.autoConvertMissingPrices If true the prices for all regions targeted by the parent app that don't have a price specified for this in-app product will be auto converted to the target currency based on the default price. Defaults to false.
     * @param {string} params.packageName Unique identifier for the Android app with the in-app product; for example, "com.spiffygame".
     * @param {string} params.sku Unique identifier for the in-app product.
     * @param {androidpublisher(v2).InAppProduct} params.resource Request body data
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/inappproducts/{sku}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['packageName', 'sku'],
        pathParams: ['packageName', 'sku'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.purchases = {

    products: {

      /**
       * androidpublisher.purchases.products.get
       *
       * @desc Checks the purchase and consumption status of an inapp item.
       *
       * @alias androidpublisher.purchases.products.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application the inapp product was sold in (for example, 'com.some.thing').
       * @param {string} params.productId The inapp product SKU (for example, 'com.some.thing.inapp1').
       * @param {string} params.token The token provided to the user's device when the inapp product was purchased.
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/products/{productId}/tokens/{token}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'productId', 'token'],
          pathParams: ['packageName', 'productId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    subscriptions: {

      /**
       * androidpublisher.purchases.subscriptions.cancel
       *
       * @desc Cancels a user's subscription purchase. The subscription remains valid until its expiration time.
       *
       * @alias androidpublisher.purchases.subscriptions.cancel
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
       * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
       * @param {string} params.token The token provided to the user's device when the subscription was purchased.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      cancel: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}:cancel',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['packageName', 'subscriptionId', 'token'],
          pathParams: ['packageName', 'subscriptionId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.purchases.subscriptions.defer
       *
       * @desc Defers a user's subscription purchase until a specified future expiration time.
       *
       * @alias androidpublisher.purchases.subscriptions.defer
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
       * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
       * @param {string} params.token The token provided to the user's device when the subscription was purchased.
       * @param {androidpublisher(v2).SubscriptionPurchasesDeferRequest} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      defer: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}:defer',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['packageName', 'subscriptionId', 'token'],
          pathParams: ['packageName', 'subscriptionId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.purchases.subscriptions.get
       *
       * @desc Checks whether a user's subscription purchase is valid and returns its expiry time.
       *
       * @alias androidpublisher.purchases.subscriptions.get
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
       * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
       * @param {string} params.token The token provided to the user's device when the subscription was purchased.
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName', 'subscriptionId', 'token'],
          pathParams: ['packageName', 'subscriptionId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.purchases.subscriptions.refund
       *
       * @desc Refunds a user's subscription purchase, but the subscription remains valid until its expiration time and it will continue to recur.
       *
       * @alias androidpublisher.purchases.subscriptions.refund
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
       * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
       * @param {string} params.token The token provided to the user's device when the subscription was purchased.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      refund: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}:refund',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['packageName', 'subscriptionId', 'token'],
          pathParams: ['packageName', 'subscriptionId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * androidpublisher.purchases.subscriptions.revoke
       *
       * @desc Refunds and immediately revokes a user's subscription purchase. Access to the subscription will be terminated immediately and it will stop recurring.
       *
       * @alias androidpublisher.purchases.subscriptions.revoke
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string} params.packageName The package name of the application for which this subscription was purchased (for example, 'com.some.thing').
       * @param {string} params.subscriptionId The purchased subscription ID (for example, 'monthly001').
       * @param {string} params.token The token provided to the user's device when the subscription was purchased.
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      revoke: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/subscriptions/{subscriptionId}/tokens/{token}:revoke',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['packageName', 'subscriptionId', 'token'],
          pathParams: ['packageName', 'subscriptionId', 'token'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    voidedpurchases: {

      /**
       * androidpublisher.purchases.voidedpurchases.list
       *
       * @desc Lists the purchases that were cancelled, refunded or charged-back.
       *
       * @alias androidpublisher.purchases.voidedpurchases.list
       * @memberOf! androidpublisher(v2)
       *
       * @param {object} params Parameters for request
       * @param {string=} params.endTime The end time of list window, in milliseconds since the epoch (Jan 1, 1970). If not specified, default to current time, which is also the latest accepted end time. This parameter will be ignored if pagination token is set.
       * @param {integer=} params.maxResults 
       * @param {string} params.packageName The package name of the application for which voided purchases need to be returned (for example, 'com.some.thing').
       * @param {integer=} params.startIndex 
       * @param {string=} params.startTime The start time of list window, in milliseconds since the epoch (Jan 1, 1970). If not specified, default to current time - 30 days, which is also the earlies accepted start time. This parameter will be ignored if pagination token is set.
       * @param {string=} params.token 
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
            url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/purchases/voidedpurchases',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['packageName'],
          pathParams: ['packageName'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.reviews = {

    /**
     * androidpublisher.reviews.get
     *
     * @desc Returns a single review.
     *
     * @alias androidpublisher.reviews.get
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName Unique identifier for the Android app for which we want reviews; for example, "com.spiffygame".
     * @param {string} params.reviewId 
     * @param {string=} params.translationLanguage 
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/reviews/{reviewId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName', 'reviewId'],
        pathParams: ['packageName', 'reviewId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.reviews.list
     *
     * @desc Returns a list of reviews.
     *
     * @alias androidpublisher.reviews.list
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {string} params.packageName Unique identifier for the Android app for which we want reviews; for example, "com.spiffygame".
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
     * @param {string=} params.translationLanguage 
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
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/reviews',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['packageName'],
        pathParams: ['packageName'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * androidpublisher.reviews.reply
     *
     * @desc Reply to a single review, or update an existing reply.
     *
     * @alias androidpublisher.reviews.reply
     * @memberOf! androidpublisher(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.packageName Unique identifier for the Android app for which we want reviews; for example, "com.spiffygame".
     * @param {string} params.reviewId 
     * @param {androidpublisher(v2).ReviewsReplyRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    reply: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/androidpublisher/v2/applications/{packageName}/reviews/{reviewId}:reply',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['packageName', 'reviewId'],
        pathParams: ['packageName', 'reviewId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Apk
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).ApkBinary} binary Information about the binary payload of this APK.
 * @property {integer} versionCode The version code of the APK, as specified in the APK&#39;s manifest file.
 */
/**
 * @typedef ApkBinary
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} sha1 A sha1 hash of the APK payload, encoded as a hex string and matching the output of the sha1sum command.
 */
/**
 * @typedef ApkListing
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} language The language code, in BCP 47 format (eg &quot;en-US&quot;).
 * @property {string} recentChanges Describe what&#39;s new in your APK.
 */
/**
 * @typedef ApkListingsListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#apkListingsListResponse&quot;.
 * @property {androidpublisher(v2).ApkListing[]} listings 
 */
/**
 * @typedef ApksAddExternallyHostedRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).ExternallyHostedApk} externallyHostedApk The definition of the externally-hosted APK and where it is located.
 */
/**
 * @typedef ApksAddExternallyHostedResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).ExternallyHostedApk} externallyHostedApk The definition of the externally-hosted APK and where it is located.
 */
/**
 * @typedef ApksListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Apk[]} apks 
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#apksListResponse&quot;.
 */
/**
 * @typedef AppDetails
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} contactEmail The user-visible support email for this app.
 * @property {string} contactPhone The user-visible support telephone number for this app.
 * @property {string} contactWebsite The user-visible website for this app.
 * @property {string} defaultLanguage Default language code, in BCP 47 format (eg &quot;en-US&quot;).
 */
/**
 * @typedef AppEdit
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} expiryTimeSeconds The time at which the edit will expire and will be no longer valid for use in any subsequent API calls (encoded as seconds since the Epoch).
 * @property {string} id The ID of the edit that can be used in subsequent API calls.
 */
/**
 * @typedef Comment
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).DeveloperComment} developerComment A comment from a developer.
 * @property {androidpublisher(v2).UserComment} userComment A comment from a user.
 */
/**
 * @typedef DeobfuscationFile
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} symbolType The type of the deobfuscation file.
 */
/**
 * @typedef DeobfuscationFilesUploadResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).DeobfuscationFile} deobfuscationFile 
 */
/**
 * @typedef DeveloperComment
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Timestamp} lastModified The last time at which this comment was updated.
 * @property {string} text The content of the comment, i.e. reply body.
 */
/**
 * @typedef DeviceMetadata
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} cpuMake Device CPU make e.g. &quot;Qualcomm&quot;
 * @property {string} cpuModel Device CPU model e.g. &quot;MSM8974&quot;
 * @property {string} deviceClass Device class (e.g. tablet)
 * @property {integer} glEsVersion OpenGL version
 * @property {string} manufacturer Device manufacturer (e.g. Motorola)
 * @property {string} nativePlatform Comma separated list of native platforms (e.g. &quot;arm&quot;, &quot;arm7&quot;)
 * @property {string} productName Device model name (e.g. Droid)
 * @property {integer} ramMb Device RAM in Megabytes e.g. &quot;2048&quot;
 * @property {integer} screenDensityDpi Screen density in DPI
 * @property {integer} screenHeightPx Screen height in pixels
 * @property {integer} screenWidthPx Screen width in pixels
 */
/**
 * @typedef Entitlement
 * @memberOf! androidpublisher(v2)
 * @type object
* @property {string} kind This kind represents an entitlement object in the androidpublisher service.
* @property {string} productId The SKU of the product.
* @property {string} productType The type of the inapp product. Possible values are:  
- In-app item: &quot;inapp&quot; 
- Subscription: &quot;subs&quot;
* @property {string} token The token which can be verified using the subscriptions or products API.
*/
/**
 * @typedef EntitlementsListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).PageInfo} pageInfo 
 * @property {androidpublisher(v2).Entitlement[]} resources 
 * @property {androidpublisher(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef ExpansionFile
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} fileSize If set this field indicates that this APK has an Expansion File uploaded to it: this APK does not reference another APK&#39;s Expansion File. The field&#39;s value is the size of the uploaded Expansion File in bytes.
 * @property {integer} referencesVersion If set this APK&#39;s Expansion File references another APK&#39;s Expansion File. The file_size field will not be set.
 */
/**
 * @typedef ExpansionFilesUploadResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).ExpansionFile} expansionFile 
 */
/**
 * @typedef ExternallyHostedApk
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} applicationLabel The application label.
 * @property {string[]} certificateBase64s A certificate (or array of certificates if a certificate-chain is used) used to signed this APK, represented as a base64 encoded byte array.
 * @property {string} externallyHostedUrl The URL at which the APK is hosted. This must be an https URL.
 * @property {string} fileSha1Base64 The SHA1 checksum of this APK, represented as a base64 encoded byte array.
 * @property {string} fileSha256Base64 The SHA256 checksum of this APK, represented as a base64 encoded byte array.
 * @property {string} fileSize The file size in bytes of this APK.
 * @property {string} iconBase64 The icon image from the APK, as a base64 encoded byte array.
 * @property {integer} maximumSdk The maximum SDK supported by this APK (optional).
 * @property {integer} minimumSdk The minimum SDK targeted by this APK.
 * @property {string[]} nativeCodes The native code environments supported by this APK (optional).
 * @property {string} packageName The package name.
 * @property {string[]} usesFeatures The features required by this APK (optional).
 * @property {androidpublisher(v2).ExternallyHostedApkUsesPermission[]} usesPermissions The permissions requested by this APK.
 * @property {integer} versionCode The version code of this APK.
 * @property {string} versionName The version name of this APK.
 */
/**
 * @typedef ExternallyHostedApkUsesPermission
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} maxSdkVersion Optionally, the maximum SDK version for which the permission is required.
 * @property {string} name The name of the permission requested.
 */
/**
 * @typedef Image
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} id A unique id representing this image.
 * @property {string} sha1 A sha1 hash of the image that was uploaded.
 * @property {string} url A URL that will serve a preview of the image.
 */
/**
 * @typedef ImagesDeleteAllResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Image[]} deleted 
 */
/**
 * @typedef ImagesListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Image[]} images 
 */
/**
 * @typedef ImagesUploadResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Image} image 
 */
/**
 * @typedef InAppProduct
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} defaultLanguage The default language of the localized data, as defined by BCP 47. e.g. &quot;en-US&quot;, &quot;en-GB&quot;.
 * @property {androidpublisher(v2).Price} defaultPrice Default price cannot be zero. In-app products can never be free. Default price is always in the developer&#39;s Checkout merchant currency.
 * @property {object} listings List of localized title and description data.
 * @property {string} packageName The package name of the parent app.
 * @property {object} prices Prices per buyer region. None of these prices should be zero. In-app products can never be free.
 * @property {string} purchaseType Purchase type enum value. Unmodifiable after creation.
 * @property {androidpublisher(v2).Season} season Definition of a season for a seasonal subscription. Can be defined only for yearly subscriptions.
 * @property {string} sku The stock-keeping-unit (SKU) of the product, unique within an app.
 * @property {string} status 
 * @property {string} subscriptionPeriod Subscription period, specified in ISO 8601 format. Acceptable values are &quot;P1W&quot; (one week), &quot;P1M&quot; (one month), &quot;P3M&quot; (three months), &quot;P6M&quot; (six months), and &quot;P1Y&quot; (one year).
 * @property {string} trialPeriod Trial period, specified in ISO 8601 format. Acceptable values are anything between &quot;P7D&quot; (seven days) and &quot;P999D&quot; (999 days). Seasonal subscriptions cannot have a trial period.
 */
/**
 * @typedef InAppProductListing
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} description 
 * @property {string} title 
 */
/**
 * @typedef InappproductsBatchRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InappproductsBatchRequestEntry[]} entrys 
 */
/**
 * @typedef InappproductsBatchRequestEntry
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} batchId 
 * @property {androidpublisher(v2).InappproductsInsertRequest} inappproductsinsertrequest 
 * @property {androidpublisher(v2).InappproductsUpdateRequest} inappproductsupdaterequest 
 * @property {string} methodName 
 */
/**
 * @typedef InappproductsBatchResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InappproductsBatchResponseEntry[]} entrys 
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#inappproductsBatchResponse&quot;.
 */
/**
 * @typedef InappproductsBatchResponseEntry
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} batchId 
 * @property {androidpublisher(v2).InappproductsInsertResponse} inappproductsinsertresponse 
 * @property {androidpublisher(v2).InappproductsUpdateResponse} inappproductsupdateresponse 
 */
/**
 * @typedef InappproductsInsertRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InAppProduct} inappproduct 
 */
/**
 * @typedef InappproductsInsertResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InAppProduct} inappproduct 
 */
/**
 * @typedef InappproductsListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InAppProduct[]} inappproduct 
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#inappproductsListResponse&quot;.
 * @property {androidpublisher(v2).PageInfo} pageInfo 
 * @property {androidpublisher(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef InappproductsUpdateRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InAppProduct} inappproduct 
 */
/**
 * @typedef InappproductsUpdateResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).InAppProduct} inappproduct 
 */
/**
 * @typedef Listing
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} fullDescription Full description of the app; this may be up to 4000 characters in length.
 * @property {string} language Language localization code (for example, &quot;de-AT&quot; for Austrian German).
 * @property {string} shortDescription Short description of the app (previously known as promo text); this may be up to 80 characters in length.
 * @property {string} title App&#39;s localized title.
 * @property {string} video URL of a promotional YouTube video for the app.
 */
/**
 * @typedef ListingsListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#listingsListResponse&quot;.
 * @property {androidpublisher(v2).Listing[]} listings 
 */
/**
 * @typedef MonthDay
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} day Day of a month, value in [1, 31] range. Valid range depends on the specified month.
 * @property {integer} month Month of a year. e.g. 1 = JAN, 2 = FEB etc.
 */
/**
 * @typedef PageInfo
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} resultPerPage 
 * @property {integer} startIndex 
 * @property {integer} totalResults 
 */
/**
 * @typedef Price
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} currency 3 letter Currency code, as defined by ISO 4217.
 * @property {string} priceMicros The price in millionths of the currency base unit represented as a string.
 */
/**
 * @typedef ProductPurchase
 * @memberOf! androidpublisher(v2)
 * @type object
* @property {integer} consumptionState The consumption state of the inapp product. Possible values are:  
- Yet to be consumed 
- Consumed
* @property {string} developerPayload A developer-specified string that contains supplemental information about an order.
* @property {string} kind This kind represents an inappPurchase object in the androidpublisher service.
* @property {integer} purchaseState The purchase state of the order. Possible values are:  
- Purchased 
- Cancelled
* @property {string} purchaseTimeMillis The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
*/
/**
 * @typedef Prorate
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Price} defaultPrice Default price cannot be zero and must be less than the full subscription price. Default price is always in the developer&#39;s Checkout merchant currency. Targeted countries have their prices set automatically based on the default_price.
 * @property {androidpublisher(v2).MonthDay} start Defines the first day on which the price takes effect.
 */
/**
 * @typedef Review
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} authorName The name of the user who wrote the review.
 * @property {androidpublisher(v2).Comment[]} comments A repeated field containing comments for the review.
 * @property {string} reviewId Unique identifier for this review.
 */
/**
 * @typedef ReviewReplyResult
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).Timestamp} lastEdited The time at which the reply took effect.
 * @property {string} replyText The reply text that was applied.
 */
/**
 * @typedef ReviewsListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).PageInfo} pageInfo 
 * @property {androidpublisher(v2).Review[]} reviews 
 * @property {androidpublisher(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef ReviewsReplyRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} replyText The text to set as the reply. Replies of more than approximately 350 characters will be rejected. HTML tags will be stripped.
 */
/**
 * @typedef ReviewsReplyResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).ReviewReplyResult} result 
 */
/**
 * @typedef Season
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).MonthDay} end Inclusive end date of the recurrence period.
 * @property {androidpublisher(v2).Prorate[]} prorations Optionally present list of prorations for the season. Each proration is a one-off discounted entry into a subscription. Each proration contains the first date on which the discount is available and the new pricing information.
 * @property {androidpublisher(v2).MonthDay} start Inclusive start date of the recurrence period.
 */
/**
 * @typedef SubscriptionDeferralInfo
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} desiredExpiryTimeMillis The desired next expiry time to assign to the subscription, in milliseconds since the Epoch. The given time must be later/greater than the current expiry time for the subscription.
 * @property {string} expectedExpiryTimeMillis The expected expiry time for the subscription. If the current expiry time for the subscription is not the value specified here, the deferral will not occur.
 */
/**
 * @typedef SubscriptionPurchase
 * @memberOf! androidpublisher(v2)
 * @type object
* @property {boolean} autoRenewing Whether the subscription will automatically be renewed when it reaches its current expiry time.
* @property {integer} cancelReason The reason why a subscription was cancelled or is not auto-renewing. Possible values are:  
- User cancelled the subscription 
- Subscription was cancelled by the system, for example because of a billing problem
* @property {string} countryCode ISO 3166-1 alpha-2 billing country/region code of the user at the time the subscription was granted.
* @property {string} developerPayload A developer-specified string that contains supplemental information about an order.
* @property {string} expiryTimeMillis Time at which the subscription will expire, in milliseconds since the Epoch.
* @property {string} kind This kind represents a subscriptionPurchase object in the androidpublisher service.
* @property {integer} paymentState The payment state of the subscription. Possible values are:  
- Payment pending 
- Payment received
* @property {string} priceAmountMicros Price of the subscription, not including tax. Price is expressed in micro-units, where 1,000,000 micro-units represents one unit of the currency. For example, if the subscription price is €1.99, price_amount_micros is 1990000.
* @property {string} priceCurrencyCode ISO 4217 currency code for the subscription price. For example, if the price is specified in British pounds sterling, price_currency_code is &quot;GBP&quot;.
* @property {string} startTimeMillis Time at which the subscription was granted, in milliseconds since the Epoch.
*/
/**
 * @typedef SubscriptionPurchasesDeferRequest
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).SubscriptionDeferralInfo} deferralInfo The information about the new desired expiry time for the subscription.
 */
/**
 * @typedef SubscriptionPurchasesDeferResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} newExpiryTimeMillis The new expiry time for the subscription in milliseconds since the Epoch.
 */
/**
 * @typedef Testers
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string[]} googleGroups 
 * @property {string[]} googlePlusCommunities 
 */
/**
 * @typedef Timestamp
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} nanos 
 * @property {string} seconds 
 */
/**
 * @typedef TokenPagination
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} nextPageToken 
 * @property {string} previousPageToken 
 */
/**
 * @typedef Track
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} track 
 * @property {number} userFraction 
 * @property {integer[]} versionCodes 
 */
/**
 * @typedef TracksListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;androidpublisher#tracksListResponse&quot;.
 * @property {androidpublisher(v2).Track[]} tracks 
 */
/**
 * @typedef UserComment
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {integer} androidOsVersion Integer Android SDK version of the user&#39;s device at the time the review was written, e.g. 23 is Marshmallow. May be absent.
 * @property {integer} appVersionCode Integer version code of the app as installed at the time the review was written. May be absent.
 * @property {string} appVersionName String version name of the app as installed at the time the review was written. May be absent.
 * @property {string} device Codename for the reviewer&#39;s device, e.g. klte, flounder. May be absent.
 * @property {androidpublisher(v2).DeviceMetadata} deviceMetadata Some information about the characteristics of the user&#39;s device
 * @property {androidpublisher(v2).Timestamp} lastModified The last time at which this comment was updated.
 * @property {string} originalText Untranslated text of the review, in the case where the review has been translated. If the review has not been translated this is left blank.
 * @property {string} reviewerLanguage Language code for the reviewer. This is taken from the device settings so is not guaranteed to match the language the review is written in. May be absent.
 * @property {integer} starRating The star rating associated with the review, from 1 to 5.
 * @property {string} text The content of the comment, i.e. review body. In some cases users have been able to write a review with separate title and body; in those cases the title and body are concatenated and separated by a tab character.
 * @property {integer} thumbsDownCount Number of users who have given this review a thumbs down
 * @property {integer} thumbsUpCount Number of users who have given this review a thumbs up
 */
/**
 * @typedef VoidedPurchase
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {string} kind This kind represents a voided purchase object in the androidpublisher service.
 * @property {string} purchaseTimeMillis The time the purchase was made, in milliseconds since the epoch (Jan 1, 1970).
 * @property {string} purchaseToken The token that was generated when a purchase was made and uniquely identifies a purchase.
 * @property {string} voidedTimeMillis The time when the purchase was cancelled/refunded/chargeback, in milliseconds since the epoch (Jan 1, 1970).
 */
/**
 * @typedef VoidedPurchasesListResponse
 * @memberOf! androidpublisher(v2)
 * @type object
 * @property {androidpublisher(v2).PageInfo} pageInfo 
 * @property {androidpublisher(v2).TokenPagination} tokenPagination 
 * @property {androidpublisher(v2).VoidedPurchase[]} voidedPurchases 
 */
module.exports = Androidpublisher;
