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
 * DCM/DFA Reporting And Trafficking API
 *
 * Manages your DoubleClick Campaign Manager ad campaigns and reports.
 *
 * @example
 * var google = require('googleapis');
 * var dfareporting = google.dfareporting('v2.5');
 *
 * @namespace dfareporting
 * @type {Function}
 * @version v2.5
 * @variation v2.5
 * @param {object=} options Options for Dfareporting
 */
function Dfareporting(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accountActiveAdSummaries = {

    /**
     * dfareporting.accountActiveAdSummaries.get
     *
     * @desc Gets the account's active ad summary by account ID.
     *
     * @alias dfareporting.accountActiveAdSummaries.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.summaryAccountId Account ID.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountActiveAdSummaries/{summaryAccountId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'summaryAccountId'],
        pathParams: ['profileId', 'summaryAccountId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accountPermissionGroups = {

    /**
     * dfareporting.accountPermissionGroups.get
     *
     * @desc Gets one account permission group by ID.
     *
     * @alias dfareporting.accountPermissionGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Account permission group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountPermissionGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountPermissionGroups.list
     *
     * @desc Retrieves the list of account permission groups.
     *
     * @alias dfareporting.accountPermissionGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountPermissionGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accountPermissions = {

    /**
     * dfareporting.accountPermissions.get
     *
     * @desc Gets one account permission by ID.
     *
     * @alias dfareporting.accountPermissions.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Account permission ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountPermissions/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountPermissions.list
     *
     * @desc Retrieves the list of account permissions.
     *
     * @alias dfareporting.accountPermissions.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountPermissions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accountUserProfiles = {

    /**
     * dfareporting.accountUserProfiles.get
     *
     * @desc Gets one account user profile by ID.
     *
     * @alias dfareporting.accountUserProfiles.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User profile ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountUserProfiles/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountUserProfiles.insert
     *
     * @desc Inserts a new account user profile.
     *
     * @alias dfareporting.accountUserProfiles.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AccountUserProfile} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountUserProfiles',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountUserProfiles.list
     *
     * @desc Retrieves a list of account user profiles, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.accountUserProfiles.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active user profiles.
     * @param {string=} params.ids Select only user profiles with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name, ID or email. Wildcards (*) are allowed. For example, "user profile*2015" will return objects with names like "user profile June 2015", "user profile April 2015", or simply "user profile 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "user profile" will match objects with name "my user profile", "user profile 2015", or simply "user profile".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.subaccountId Select only user profiles with the specified subaccount ID.
     * @param {string=} params.userRoleId Select only user profiles with the specified user role ID.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountUserProfiles',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountUserProfiles.patch
     *
     * @desc Updates an existing account user profile. This method supports patch semantics.
     *
     * @alias dfareporting.accountUserProfiles.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User profile ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AccountUserProfile} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountUserProfiles',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accountUserProfiles.update
     *
     * @desc Updates an existing account user profile.
     *
     * @alias dfareporting.accountUserProfiles.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AccountUserProfile} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accountUserProfiles',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.accounts = {

    /**
     * dfareporting.accounts.get
     *
     * @desc Gets one account by ID.
     *
     * @alias dfareporting.accounts.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Account ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accounts/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accounts.list
     *
     * @desc Retrieves the list of accounts, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.accounts.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active accounts. Don't set this field to select both active and non-active accounts.
     * @param {string=} params.ids Select only accounts with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "account*2015" will return objects with names like "account June 2015", "account April 2015", or simply "account 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "account" will match objects with name "my account", "account 2015", or simply "account".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accounts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accounts.patch
     *
     * @desc Updates an existing account. This method supports patch semantics.
     *
     * @alias dfareporting.accounts.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Account ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accounts',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.accounts.update
     *
     * @desc Updates an existing account.
     *
     * @alias dfareporting.accounts.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Account} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/accounts',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.ads = {

    /**
     * dfareporting.ads.get
     *
     * @desc Gets one ad by ID.
     *
     * @alias dfareporting.ads.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Ad ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/ads/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.ads.insert
     *
     * @desc Inserts a new ad.
     *
     * @alias dfareporting.ads.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Ad} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/ads',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.ads.list
     *
     * @desc Retrieves a list of ads, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.ads.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active ads.
     * @param {string=} params.advertiserId Select only ads with this advertiser ID.
     * @param {boolean=} params.archived Select only archived ads.
     * @param {string=} params.audienceSegmentIds Select only ads with these audience segment IDs.
     * @param {string=} params.campaignIds Select only ads with these campaign IDs.
     * @param {string=} params.compatibility Select default ads with the specified compatibility. Applicable when type is AD_SERVING_DEFAULT_AD. DISPLAY and DISPLAY_INTERSTITIAL refer to rendering either on desktop or on mobile devices for regular or interstitial ads, respectively. APP and APP_INTERSTITIAL are for rendering in mobile apps. IN_STREAM_VIDEO refers to rendering an in-stream video ads developed with the VAST standard.
     * @param {string=} params.creativeIds Select only ads with these creative IDs assigned.
     * @param {string=} params.creativeOptimizationConfigurationIds Select only ads with these creative optimization configuration IDs.
     * @param {string=} params.creativeType Select only ads with the specified creativeType.
     * @param {boolean=} params.dynamicClickTracker Select only dynamic click trackers. Applicable when type is AD_SERVING_CLICK_TRACKER. If true, select dynamic click trackers. If false, select static click trackers. Leave unset to select both.
     * @param {string=} params.ids Select only ads with these IDs.
     * @param {string=} params.landingPageIds Select only ads with these landing page IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.overriddenEventTagId Select only ads with this event tag override ID.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string=} params.placementIds Select only ads with these placement IDs assigned.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.remarketingListIds Select only ads whose list targeting expression use these remarketing list IDs.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "ad*2015" will return objects with names like "ad June 2015", "ad April 2015", or simply "ad 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "ad" will match objects with name "my ad", "ad 2015", or simply "ad".
     * @param {string=} params.sizeIds Select only ads with these size IDs.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {boolean=} params.sslCompliant Select only ads that are SSL-compliant.
     * @param {boolean=} params.sslRequired Select only ads that require SSL.
     * @param {string=} params.type Select only ads with these types.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/ads',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.ads.patch
     *
     * @desc Updates an existing ad. This method supports patch semantics.
     *
     * @alias dfareporting.ads.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Ad ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Ad} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/ads',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.ads.update
     *
     * @desc Updates an existing ad.
     *
     * @alias dfareporting.ads.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Ad} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/ads',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.advertiserGroups = {

    /**
     * dfareporting.advertiserGroups.delete
     *
     * @desc Deletes an existing advertiser group.
     *
     * @alias dfareporting.advertiserGroups.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Advertiser group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertiserGroups.get
     *
     * @desc Gets one advertiser group by ID.
     *
     * @alias dfareporting.advertiserGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Advertiser group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertiserGroups.insert
     *
     * @desc Inserts a new advertiser group.
     *
     * @alias dfareporting.advertiserGroups.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AdvertiserGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertiserGroups.list
     *
     * @desc Retrieves a list of advertiser groups, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.advertiserGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only advertiser groups with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "advertiser*2015" will return objects with names like "advertiser group June 2015", "advertiser group April 2015", or simply "advertiser group 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "advertisergroup" will match objects with name "my advertisergroup", "advertisergroup 2015", or simply "advertisergroup".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertiserGroups.patch
     *
     * @desc Updates an existing advertiser group. This method supports patch semantics.
     *
     * @alias dfareporting.advertiserGroups.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Advertiser group ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AdvertiserGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertiserGroups.update
     *
     * @desc Updates an existing advertiser group.
     *
     * @alias dfareporting.advertiserGroups.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).AdvertiserGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertiserGroups',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.advertisers = {

    /**
     * dfareporting.advertisers.get
     *
     * @desc Gets one advertiser by ID.
     *
     * @alias dfareporting.advertisers.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Advertiser ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertisers/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertisers.insert
     *
     * @desc Inserts a new advertiser.
     *
     * @alias dfareporting.advertisers.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Advertiser} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertisers',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertisers.list
     *
     * @desc Retrieves a list of advertisers, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.advertisers.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserGroupIds Select only advertisers with these advertiser group IDs.
     * @param {string=} params.floodlightConfigurationIds Select only advertisers with these floodlight configuration IDs.
     * @param {string=} params.ids Select only advertisers with these IDs.
     * @param {boolean=} params.includeAdvertisersWithoutGroupsOnly Select only advertisers which do not belong to any advertiser group.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {boolean=} params.onlyParent Select only advertisers which use another advertiser's floodlight configuration.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "advertiser*2015" will return objects with names like "advertiser June 2015", "advertiser April 2015", or simply "advertiser 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "advertiser" will match objects with name "my advertiser", "advertiser 2015", or simply "advertiser".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.status Select only advertisers with the specified status.
     * @param {string=} params.subaccountId Select only advertisers with these subaccount IDs.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertisers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertisers.patch
     *
     * @desc Updates an existing advertiser. This method supports patch semantics.
     *
     * @alias dfareporting.advertisers.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Advertiser ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Advertiser} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertisers',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.advertisers.update
     *
     * @desc Updates an existing advertiser.
     *
     * @alias dfareporting.advertisers.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Advertiser} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/advertisers',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.browsers = {

    /**
     * dfareporting.browsers.list
     *
     * @desc Retrieves a list of browsers.
     *
     * @alias dfareporting.browsers.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/browsers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.campaignCreativeAssociations = {

    /**
     * dfareporting.campaignCreativeAssociations.insert
     *
     * @desc Associates a creative with the specified campaign. This method creates a default ad with dimensions matching the creative in the campaign if such a default ad does not exist already.
     *
     * @alias dfareporting.campaignCreativeAssociations.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Campaign ID in this association.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CampaignCreativeAssociation} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/campaignCreativeAssociations',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.campaignCreativeAssociations.list
     *
     * @desc Retrieves the list of creative IDs associated with the specified campaign. This method supports paging.
     *
     * @alias dfareporting.campaignCreativeAssociations.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Campaign ID in this association.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/campaignCreativeAssociations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.campaigns = {

    /**
     * dfareporting.campaigns.get
     *
     * @desc Gets one campaign by ID.
     *
     * @alias dfareporting.campaigns.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Campaign ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.campaigns.insert
     *
     * @desc Inserts a new campaign.
     *
     * @alias dfareporting.campaigns.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.defaultLandingPageName Default landing page name for this new campaign. Must be less than 256 characters long.
     * @param {string} params.defaultLandingPageUrl Default landing page URL for this new campaign.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Campaign} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId', 'defaultLandingPageName', 'defaultLandingPageUrl'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.campaigns.list
     *
     * @desc Retrieves a list of campaigns, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.campaigns.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserGroupIds Select only campaigns whose advertisers belong to these advertiser groups.
     * @param {string=} params.advertiserIds Select only campaigns that belong to these advertisers.
     * @param {boolean=} params.archived Select only archived campaigns. Don't set this field to select both archived and non-archived campaigns.
     * @param {boolean=} params.atLeastOneOptimizationActivity Select only campaigns that have at least one optimization activity.
     * @param {string=} params.excludedIds Exclude campaigns with these IDs.
     * @param {string=} params.ids Select only campaigns with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.overriddenEventTagId Select only campaigns that have overridden this event tag ID.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for campaigns by name or ID. Wildcards (*) are allowed. For example, "campaign*2015" will return campaigns with names like "campaign June 2015", "campaign April 2015", or simply "campaign 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "campaign" will match campaigns with name "my campaign", "campaign 2015", or simply "campaign".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.subaccountId Select only campaigns that belong to this subaccount.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.campaigns.patch
     *
     * @desc Updates an existing campaign. This method supports patch semantics.
     *
     * @alias dfareporting.campaigns.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Campaign ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Campaign} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.campaigns.update
     *
     * @desc Updates an existing campaign.
     *
     * @alias dfareporting.campaigns.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Campaign} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.changeLogs = {

    /**
     * dfareporting.changeLogs.get
     *
     * @desc Gets one change log by ID.
     *
     * @alias dfareporting.changeLogs.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Change log ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/changeLogs/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.changeLogs.list
     *
     * @desc Retrieves a list of change logs. This method supports paging.
     *
     * @alias dfareporting.changeLogs.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.action Select only change logs with the specified action.
     * @param {string=} params.ids Select only change logs with these IDs.
     * @param {string=} params.maxChangeTime Select only change logs whose change time is before the specified maxChangeTime.The time should be formatted as an RFC3339 date/time string. For example, for 10:54 PM on July 18th, 2015, in the America/New York time zone, the format is "2015-07-18T22:54:00-04:00". In other words, the year, month, day, the letter T, the hour (24-hour clock system), minute, second, and then the time zone offset.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.minChangeTime Select only change logs whose change time is before the specified minChangeTime.The time should be formatted as an RFC3339 date/time string. For example, for 10:54 PM on July 18th, 2015, in the America/New York time zone, the format is "2015-07-18T22:54:00-04:00". In other words, the year, month, day, the letter T, the hour (24-hour clock system), minute, second, and then the time zone offset.
     * @param {string=} params.objectIds Select only change logs with these object IDs.
     * @param {string=} params.objectType Select only change logs with the specified object type.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Select only change logs whose object ID, user name, old or new values match the search string.
     * @param {string=} params.userProfileIds Select only change logs with these user profile IDs.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/changeLogs',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.cities = {

    /**
     * dfareporting.cities.list
     *
     * @desc Retrieves a list of cities, possibly filtered.
     *
     * @alias dfareporting.cities.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.countryDartIds Select only cities from these countries.
     * @param {string=} params.dartIds Select only cities with these DART IDs.
     * @param {string=} params.namePrefix Select only cities with names starting with this prefix.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.regionDartIds Select only cities from these regions.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/cities',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.connectionTypes = {

    /**
     * dfareporting.connectionTypes.get
     *
     * @desc Gets one connection type by ID.
     *
     * @alias dfareporting.connectionTypes.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Connection type ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/connectionTypes/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.connectionTypes.list
     *
     * @desc Retrieves a list of connection types.
     *
     * @alias dfareporting.connectionTypes.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/connectionTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.contentCategories = {

    /**
     * dfareporting.contentCategories.delete
     *
     * @desc Deletes an existing content category.
     *
     * @alias dfareporting.contentCategories.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Content category ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.contentCategories.get
     *
     * @desc Gets one content category by ID.
     *
     * @alias dfareporting.contentCategories.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Content category ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.contentCategories.insert
     *
     * @desc Inserts a new content category.
     *
     * @alias dfareporting.contentCategories.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).ContentCategory} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.contentCategories.list
     *
     * @desc Retrieves a list of content categories, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.contentCategories.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only content categories with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "contentcategory*2015" will return objects with names like "contentcategory June 2015", "contentcategory April 2015", or simply "contentcategory 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "contentcategory" will match objects with name "my contentcategory", "contentcategory 2015", or simply "contentcategory".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.contentCategories.patch
     *
     * @desc Updates an existing content category. This method supports patch semantics.
     *
     * @alias dfareporting.contentCategories.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Content category ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).ContentCategory} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.contentCategories.update
     *
     * @desc Updates an existing content category.
     *
     * @alias dfareporting.contentCategories.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).ContentCategory} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/contentCategories',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.conversions = {

    /**
     * dfareporting.conversions.batchinsert
     *
     * @desc Inserts conversions.
     *
     * @alias dfareporting.conversions.batchinsert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).ConversionsBatchInsertRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    batchinsert: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/conversions/batchinsert',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.countries = {

    /**
     * dfareporting.countries.get
     *
     * @desc Gets one country by ID.
     *
     * @alias dfareporting.countries.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.dartId Country DART ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/countries/{dartId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'dartId'],
        pathParams: ['dartId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.countries.list
     *
     * @desc Retrieves a list of countries.
     *
     * @alias dfareporting.countries.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/countries',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creativeAssets = {

    /**
     * dfareporting.creativeAssets.insert
     *
     * @desc Inserts a new creative asset.
     *
     * @alias dfareporting.creativeAssets.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.advertiserId Advertiser ID of this creative. This is a required field.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param  {object} params.resource Media resource metadata
     * @param {object} params.media Media object
     * @param {string} params.media.mimeType Media mime-type
     * @param {string|object} params.media.body Media body contents
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeAssets/{advertiserId}/creativeAssets',
          method: 'POST'
        }, options),
        params: params,
        mediaUrl: 'https://www.googleapis.com/upload/dfareporting/v2.5/userprofiles/{profileId}/creativeAssets/{advertiserId}/creativeAssets',
        requiredParams: ['profileId', 'advertiserId'],
        pathParams: ['advertiserId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creativeFieldValues = {

    /**
     * dfareporting.creativeFieldValues.delete
     *
     * @desc Deletes an existing creative field value.
     *
     * @alias dfareporting.creativeFieldValues.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string} params.id Creative Field Value ID
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId', 'id'],
        pathParams: ['creativeFieldId', 'id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFieldValues.get
     *
     * @desc Gets one creative field value by ID.
     *
     * @alias dfareporting.creativeFieldValues.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string} params.id Creative Field Value ID
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId', 'id'],
        pathParams: ['creativeFieldId', 'id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFieldValues.insert
     *
     * @desc Inserts a new creative field value.
     *
     * @alias dfareporting.creativeFieldValues.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeFieldValue} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId'],
        pathParams: ['creativeFieldId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFieldValues.list
     *
     * @desc Retrieves a list of creative field values, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.creativeFieldValues.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string=} params.ids Select only creative field values with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for creative field values by their values. Wildcards (e.g. *) are not allowed.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId'],
        pathParams: ['creativeFieldId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFieldValues.patch
     *
     * @desc Updates an existing creative field value. This method supports patch semantics.
     *
     * @alias dfareporting.creativeFieldValues.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string} params.id Creative Field Value ID
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeFieldValue} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId', 'id'],
        pathParams: ['creativeFieldId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFieldValues.update
     *
     * @desc Updates an existing creative field value.
     *
     * @alias dfareporting.creativeFieldValues.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.creativeFieldId Creative field ID for this creative field value.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeFieldValue} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{creativeFieldId}/creativeFieldValues',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId', 'creativeFieldId'],
        pathParams: ['creativeFieldId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creativeFields = {

    /**
     * dfareporting.creativeFields.delete
     *
     * @desc Deletes an existing creative field.
     *
     * @alias dfareporting.creativeFields.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative Field ID
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFields.get
     *
     * @desc Gets one creative field by ID.
     *
     * @alias dfareporting.creativeFields.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative Field ID
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFields.insert
     *
     * @desc Inserts a new creative field.
     *
     * @alias dfareporting.creativeFields.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeField} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFields.list
     *
     * @desc Retrieves a list of creative fields, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.creativeFields.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserIds Select only creative fields that belong to these advertisers.
     * @param {string=} params.ids Select only creative fields with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for creative fields by name or ID. Wildcards (*) are allowed. For example, "creativefield*2015" will return creative fields with names like "creativefield June 2015", "creativefield April 2015", or simply "creativefield 2015". Most of the searches also add wild-cards implicitly at the start and the end of the search string. For example, a search string of "creativefield" will match creative fields with the name "my creativefield", "creativefield 2015", or simply "creativefield".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFields.patch
     *
     * @desc Updates an existing creative field. This method supports patch semantics.
     *
     * @alias dfareporting.creativeFields.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative Field ID
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeField} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeFields.update
     *
     * @desc Updates an existing creative field.
     *
     * @alias dfareporting.creativeFields.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeField} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeFields',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creativeGroups = {

    /**
     * dfareporting.creativeGroups.get
     *
     * @desc Gets one creative group by ID.
     *
     * @alias dfareporting.creativeGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeGroups.insert
     *
     * @desc Inserts a new creative group.
     *
     * @alias dfareporting.creativeGroups.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeGroups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeGroups.list
     *
     * @desc Retrieves a list of creative groups, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.creativeGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserIds Select only creative groups that belong to these advertisers.
     * @param {integer=} params.groupNumber Select only creative groups that belong to this subgroup.
     * @param {string=} params.ids Select only creative groups with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for creative groups by name or ID. Wildcards (*) are allowed. For example, "creativegroup*2015" will return creative groups with names like "creativegroup June 2015", "creativegroup April 2015", or simply "creativegroup 2015". Most of the searches also add wild-cards implicitly at the start and the end of the search string. For example, a search string of "creativegroup" will match creative groups with the name "my creativegroup", "creativegroup 2015", or simply "creativegroup".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeGroups.patch
     *
     * @desc Updates an existing creative group. This method supports patch semantics.
     *
     * @alias dfareporting.creativeGroups.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative group ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeGroups',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creativeGroups.update
     *
     * @desc Updates an existing creative group.
     *
     * @alias dfareporting.creativeGroups.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).CreativeGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creativeGroups',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.creatives = {

    /**
     * dfareporting.creatives.get
     *
     * @desc Gets one creative by ID.
     *
     * @alias dfareporting.creatives.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creatives/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creatives.insert
     *
     * @desc Inserts a new creative.
     *
     * @alias dfareporting.creatives.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creatives',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creatives.list
     *
     * @desc Retrieves a list of creatives, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.creatives.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active creatives. Leave blank to select active and inactive creatives.
     * @param {string=} params.advertiserId Select only creatives with this advertiser ID.
     * @param {boolean=} params.archived Select only archived creatives. Leave blank to select archived and unarchived creatives.
     * @param {string=} params.campaignId Select only creatives with this campaign ID.
     * @param {string=} params.companionCreativeIds Select only in-stream video creatives with these companion IDs.
     * @param {string=} params.creativeFieldIds Select only creatives with these creative field IDs.
     * @param {string=} params.ids Select only creatives with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.renderingIds Select only creatives with these rendering IDs.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "creative*2015" will return objects with names like "creative June 2015", "creative April 2015", or simply "creative 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "creative" will match objects with name "my creative", "creative 2015", or simply "creative".
     * @param {string=} params.sizeIds Select only creatives with these size IDs.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.studioCreativeId Select only creatives corresponding to this Studio creative ID.
     * @param {string=} params.types Select only creatives with these creative types.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creatives',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creatives.patch
     *
     * @desc Updates an existing creative. This method supports patch semantics.
     *
     * @alias dfareporting.creatives.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Creative ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creatives',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.creatives.update
     *
     * @desc Updates an existing creative.
     *
     * @alias dfareporting.creatives.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Creative} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/creatives',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.dimensionValues = {

    /**
     * dfareporting.dimensionValues.query
     *
     * @desc Retrieves list of report dimension values for a list of filters.
     *
     * @alias dfareporting.dimensionValues.query
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken The value of the nextToken from the previous result page.
     * @param {string} params.profileId The DFA user profile ID.
     * @param {dfareporting(v2.5).DimensionValueRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    query: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/dimensionvalues/query',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.directorySiteContacts = {

    /**
     * dfareporting.directorySiteContacts.get
     *
     * @desc Gets one directory site contact by ID.
     *
     * @alias dfareporting.directorySiteContacts.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Directory site contact ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/directorySiteContacts/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.directorySiteContacts.list
     *
     * @desc Retrieves a list of directory site contacts, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.directorySiteContacts.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.directorySiteIds Select only directory site contacts with these directory site IDs. This is a required field.
     * @param {string=} params.ids Select only directory site contacts with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name, ID or email. Wildcards (*) are allowed. For example, "directory site contact*2015" will return objects with names like "directory site contact June 2015", "directory site contact April 2015", or simply "directory site contact 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "directory site contact" will match objects with name "my directory site contact", "directory site contact 2015", or simply "directory site contact".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/directorySiteContacts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.directorySites = {

    /**
     * dfareporting.directorySites.get
     *
     * @desc Gets one directory site by ID.
     *
     * @alias dfareporting.directorySites.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Directory site ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/directorySites/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.directorySites.insert
     *
     * @desc Inserts a new directory site.
     *
     * @alias dfareporting.directorySites.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).DirectorySite} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/directorySites',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.directorySites.list
     *
     * @desc Retrieves a list of directory sites, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.directorySites.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acceptsInStreamVideoPlacements This search filter is no longer supported and will have no effect on the results returned.
     * @param {boolean=} params.acceptsInterstitialPlacements This search filter is no longer supported and will have no effect on the results returned.
     * @param {boolean=} params.acceptsPublisherPaidPlacements Select only directory sites that accept publisher paid placements. This field can be left blank.
     * @param {boolean=} params.active Select only active directory sites. Leave blank to retrieve both active and inactive directory sites.
     * @param {string=} params.countryId Select only directory sites with this country ID.
     * @param {string=} params.dfp_network_code Select only directory sites with this DFP network code.
     * @param {string=} params.ids Select only directory sites with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string=} params.parentId Select only directory sites with this parent ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name, ID or URL. Wildcards (*) are allowed. For example, "directory site*2015" will return objects with names like "directory site June 2015", "directory site April 2015", or simply "directory site 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "directory site" will match objects with name "my directory site", "directory site 2015" or simply, "directory site".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/directorySites',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.dynamicTargetingKeys = {

    /**
     * dfareporting.dynamicTargetingKeys.delete
     *
     * @desc Deletes an existing dynamic targeting key.
     *
     * @alias dfareporting.dynamicTargetingKeys.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name Name of this dynamic targeting key. This is a required field. Must be less than 256 characters long and cannot contain commas. All characters are converted to lowercase.
     * @param {string} params.objectId ID of the object of this dynamic targeting key. This is a required field.
     * @param {string} params.objectType Type of the object of this dynamic targeting key. This is a required field.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/dynamicTargetingKeys/{objectId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'objectId', 'name', 'objectType'],
        pathParams: ['objectId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.dynamicTargetingKeys.insert
     *
     * @desc Inserts a new dynamic targeting key. Keys must be created at the advertiser level before being assigned to the advertiser's ads, creatives, or placements. There is a maximum of 1000 keys per advertiser, out of which a maximum of 20 keys can be assigned per ad, creative, or placement.
     *
     * @alias dfareporting.dynamicTargetingKeys.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).DynamicTargetingKey} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/dynamicTargetingKeys',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.dynamicTargetingKeys.list
     *
     * @desc Retrieves a list of dynamic targeting keys.
     *
     * @alias dfareporting.dynamicTargetingKeys.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserId Select only dynamic targeting keys whose object has this advertiser ID.
     * @param {string=} params.names Select only dynamic targeting keys exactly matching these names.
     * @param {string=} params.objectId Select only dynamic targeting keys with this object ID.
     * @param {string=} params.objectType Select only dynamic targeting keys with this object type.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/dynamicTargetingKeys',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.eventTags = {

    /**
     * dfareporting.eventTags.delete
     *
     * @desc Deletes an existing event tag.
     *
     * @alias dfareporting.eventTags.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Event tag ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.eventTags.get
     *
     * @desc Gets one event tag by ID.
     *
     * @alias dfareporting.eventTags.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Event tag ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.eventTags.insert
     *
     * @desc Inserts a new event tag.
     *
     * @alias dfareporting.eventTags.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).EventTag} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.eventTags.list
     *
     * @desc Retrieves a list of event tags, possibly filtered.
     *
     * @alias dfareporting.eventTags.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.adId Select only event tags that belong to this ad.
     * @param {string=} params.advertiserId Select only event tags that belong to this advertiser.
     * @param {string=} params.campaignId Select only event tags that belong to this campaign.
     * @param {boolean=} params.definitionsOnly Examine only the specified campaign or advertiser's event tags for matching selector criteria. When set to false, the parent advertiser and parent campaign of the specified ad or campaign is examined as well. In addition, when set to false, the status field is examined as well, along with the enabledByDefault field. This parameter can not be set to true when adId is specified as ads do not define their own even tags.
     * @param {boolean=} params.enabled Select only enabled event tags. What is considered enabled or disabled depends on the definitionsOnly parameter. When definitionsOnly is set to true, only the specified advertiser or campaign's event tags' enabledByDefault field is examined. When definitionsOnly is set to false, the specified ad or specified campaign's parent advertiser's or parent campaign's event tags' enabledByDefault and status fields are examined as well.
     * @param {string=} params.eventTagTypes Select only event tags with the specified event tag types. Event tag types can be used to specify whether to use a third-party pixel, a third-party JavaScript URL, or a third-party click-through URL for either impression or click tracking.
     * @param {string=} params.ids Select only event tags with these IDs.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "eventtag*2015" will return objects with names like "eventtag June 2015", "eventtag April 2015", or simply "eventtag 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "eventtag" will match objects with name "my eventtag", "eventtag 2015", or simply "eventtag".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.eventTags.patch
     *
     * @desc Updates an existing event tag. This method supports patch semantics.
     *
     * @alias dfareporting.eventTags.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Event tag ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).EventTag} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.eventTags.update
     *
     * @desc Updates an existing event tag.
     *
     * @alias dfareporting.eventTags.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).EventTag} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/eventTags',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.files = {

    /**
     * dfareporting.files.get
     *
     * @desc Retrieves a report file by its report ID and file ID.
     *
     * @alias dfareporting.files.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.fileId The ID of the report file.
     * @param {string} params.reportId The ID of the report.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/reports/{reportId}/files/{fileId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['reportId', 'fileId'],
        pathParams: ['fileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.files.list
     *
     * @desc Lists files for a user profile.
     *
     * @alias dfareporting.files.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken The value of the nextToken from the previous result page.
     * @param {string} params.profileId The DFA profile ID.
     * @param {string=} params.scope The scope that defines which results are returned, default is 'MINE'.
     * @param {string=} params.sortField The field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is 'DESCENDING'.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/files',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.floodlightActivities = {

    /**
     * dfareporting.floodlightActivities.delete
     *
     * @desc Deletes an existing floodlight activity.
     *
     * @alias dfareporting.floodlightActivities.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight activity ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.generatetag
     *
     * @desc Generates a tag for a floodlight activity.
     *
     * @alias dfareporting.floodlightActivities.generatetag
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.floodlightActivityId Floodlight activity ID for which we want to generate a tag.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generatetag: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities/generatetag',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.get
     *
     * @desc Gets one floodlight activity by ID.
     *
     * @alias dfareporting.floodlightActivities.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight activity ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.insert
     *
     * @desc Inserts a new floodlight activity.
     *
     * @alias dfareporting.floodlightActivities.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivity} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.list
     *
     * @desc Retrieves a list of floodlight activities, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.floodlightActivities.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserId Select only floodlight activities for the specified advertiser ID. Must specify either ids, advertiserId, or floodlightConfigurationId for a non-empty result.
     * @param {string=} params.floodlightActivityGroupIds Select only floodlight activities with the specified floodlight activity group IDs.
     * @param {string=} params.floodlightActivityGroupName Select only floodlight activities with the specified floodlight activity group name.
     * @param {string=} params.floodlightActivityGroupTagString Select only floodlight activities with the specified floodlight activity group tag string.
     * @param {string=} params.floodlightActivityGroupType Select only floodlight activities with the specified floodlight activity group type.
     * @param {string=} params.floodlightConfigurationId Select only floodlight activities for the specified floodlight configuration ID. Must specify either ids, advertiserId, or floodlightConfigurationId for a non-empty result.
     * @param {string=} params.ids Select only floodlight activities with the specified IDs. Must specify either ids, advertiserId, or floodlightConfigurationId for a non-empty result.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "floodlightactivity*2015" will return objects with names like "floodlightactivity June 2015", "floodlightactivity April 2015", or simply "floodlightactivity 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "floodlightactivity" will match objects with name "my floodlightactivity activity", "floodlightactivity 2015", or simply "floodlightactivity".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.tagString Select only floodlight activities with the specified tag string.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.patch
     *
     * @desc Updates an existing floodlight activity. This method supports patch semantics.
     *
     * @alias dfareporting.floodlightActivities.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight activity ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivity} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivities.update
     *
     * @desc Updates an existing floodlight activity.
     *
     * @alias dfareporting.floodlightActivities.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivity} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivities',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.floodlightActivityGroups = {

    /**
     * dfareporting.floodlightActivityGroups.get
     *
     * @desc Gets one floodlight activity group by ID.
     *
     * @alias dfareporting.floodlightActivityGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight activity Group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivityGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivityGroups.insert
     *
     * @desc Inserts a new floodlight activity group.
     *
     * @alias dfareporting.floodlightActivityGroups.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivityGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivityGroups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivityGroups.list
     *
     * @desc Retrieves a list of floodlight activity groups, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.floodlightActivityGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserId Select only floodlight activity groups with the specified advertiser ID. Must specify either advertiserId or floodlightConfigurationId for a non-empty result.
     * @param {string=} params.floodlightConfigurationId Select only floodlight activity groups with the specified floodlight configuration ID. Must specify either advertiserId, or floodlightConfigurationId for a non-empty result.
     * @param {string=} params.ids Select only floodlight activity groups with the specified IDs. Must specify either advertiserId or floodlightConfigurationId for a non-empty result.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "floodlightactivitygroup*2015" will return objects with names like "floodlightactivitygroup June 2015", "floodlightactivitygroup April 2015", or simply "floodlightactivitygroup 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "floodlightactivitygroup" will match objects with name "my floodlightactivitygroup activity", "floodlightactivitygroup 2015", or simply "floodlightactivitygroup".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.type Select only floodlight activity groups with the specified floodlight activity group type.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivityGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivityGroups.patch
     *
     * @desc Updates an existing floodlight activity group. This method supports patch semantics.
     *
     * @alias dfareporting.floodlightActivityGroups.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight activity Group ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivityGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivityGroups',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightActivityGroups.update
     *
     * @desc Updates an existing floodlight activity group.
     *
     * @alias dfareporting.floodlightActivityGroups.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightActivityGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightActivityGroups',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.floodlightConfigurations = {

    /**
     * dfareporting.floodlightConfigurations.get
     *
     * @desc Gets one floodlight configuration by ID.
     *
     * @alias dfareporting.floodlightConfigurations.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight configuration ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightConfigurations/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightConfigurations.list
     *
     * @desc Retrieves a list of floodlight configurations, possibly filtered.
     *
     * @alias dfareporting.floodlightConfigurations.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Set of IDs of floodlight configurations to retrieve. Required field; otherwise an empty list will be returned.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightConfigurations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightConfigurations.patch
     *
     * @desc Updates an existing floodlight configuration. This method supports patch semantics.
     *
     * @alias dfareporting.floodlightConfigurations.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Floodlight configuration ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightConfigurations',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.floodlightConfigurations.update
     *
     * @desc Updates an existing floodlight configuration.
     *
     * @alias dfareporting.floodlightConfigurations.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).FloodlightConfiguration} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/floodlightConfigurations',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.inventoryItems = {

    /**
     * dfareporting.inventoryItems.get
     *
     * @desc Gets one inventory item by ID.
     *
     * @alias dfareporting.inventoryItems.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Inventory item ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for order documents.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/inventoryItems/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId', 'id'],
        pathParams: ['id', 'profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.inventoryItems.list
     *
     * @desc Retrieves a list of inventory items, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.inventoryItems.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only inventory items with these IDs.
     * @param {boolean=} params.inPlan Select only inventory items that are in plan.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.orderId Select only inventory items that belong to specified orders.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for order documents.
     * @param {string=} params.siteId Select only inventory items that are associated with these sites.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.type Select only inventory items with this type.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/inventoryItems',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId'],
        pathParams: ['profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.landingPages = {

    /**
     * dfareporting.landingPages.delete
     *
     * @desc Deletes an existing campaign landing page.
     *
     * @alias dfareporting.landingPages.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.id Landing page ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId', 'id'],
        pathParams: ['campaignId', 'id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.landingPages.get
     *
     * @desc Gets one campaign landing page by ID.
     *
     * @alias dfareporting.landingPages.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.id Landing page ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId', 'id'],
        pathParams: ['campaignId', 'id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.landingPages.insert
     *
     * @desc Inserts a new landing page for the specified campaign.
     *
     * @alias dfareporting.landingPages.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).LandingPage} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.landingPages.list
     *
     * @desc Retrieves the list of landing pages for the specified campaign.
     *
     * @alias dfareporting.landingPages.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.landingPages.patch
     *
     * @desc Updates an existing campaign landing page. This method supports patch semantics.
     *
     * @alias dfareporting.landingPages.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.id Landing page ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).LandingPage} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId', 'id'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.landingPages.update
     *
     * @desc Updates an existing campaign landing page.
     *
     * @alias dfareporting.landingPages.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.campaignId Landing page campaign ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).LandingPage} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/campaigns/{campaignId}/landingPages',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId', 'campaignId'],
        pathParams: ['campaignId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.metros = {

    /**
     * dfareporting.metros.list
     *
     * @desc Retrieves a list of metros.
     *
     * @alias dfareporting.metros.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/metros',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.mobileCarriers = {

    /**
     * dfareporting.mobileCarriers.get
     *
     * @desc Gets one mobile carrier by ID.
     *
     * @alias dfareporting.mobileCarriers.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Mobile carrier ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/mobileCarriers/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.mobileCarriers.list
     *
     * @desc Retrieves a list of mobile carriers.
     *
     * @alias dfareporting.mobileCarriers.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/mobileCarriers',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.operatingSystemVersions = {

    /**
     * dfareporting.operatingSystemVersions.get
     *
     * @desc Gets one operating system version by ID.
     *
     * @alias dfareporting.operatingSystemVersions.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Operating system version ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/operatingSystemVersions/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.operatingSystemVersions.list
     *
     * @desc Retrieves a list of operating system versions.
     *
     * @alias dfareporting.operatingSystemVersions.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/operatingSystemVersions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.operatingSystems = {

    /**
     * dfareporting.operatingSystems.get
     *
     * @desc Gets one operating system by DART ID.
     *
     * @alias dfareporting.operatingSystems.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.dartId Operating system DART ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/operatingSystems/{dartId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'dartId'],
        pathParams: ['dartId', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.operatingSystems.list
     *
     * @desc Retrieves a list of operating systems.
     *
     * @alias dfareporting.operatingSystems.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/operatingSystems',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.orderDocuments = {

    /**
     * dfareporting.orderDocuments.get
     *
     * @desc Gets one order document by ID.
     *
     * @alias dfareporting.orderDocuments.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Order document ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for order documents.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/orderDocuments/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId', 'id'],
        pathParams: ['id', 'profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.orderDocuments.list
     *
     * @desc Retrieves a list of order documents, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.orderDocuments.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.approved Select only order documents that have been approved by at least one user.
     * @param {string=} params.ids Select only order documents with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.orderId Select only order documents for specified orders.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for order documents.
     * @param {string=} params.searchString Allows searching for order documents by name or ID. Wildcards (*) are allowed. For example, "orderdocument*2015" will return order documents with names like "orderdocument June 2015", "orderdocument April 2015", or simply "orderdocument 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "orderdocument" will match order documents with name "my orderdocument", "orderdocument 2015", or simply "orderdocument".
     * @param {string=} params.siteId Select only order documents that are associated with these sites.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/orderDocuments',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId'],
        pathParams: ['profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.orders = {

    /**
     * dfareporting.orders.get
     *
     * @desc Gets one order by ID.
     *
     * @alias dfareporting.orders.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Order ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for orders.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/orders/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId', 'id'],
        pathParams: ['id', 'profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.orders.list
     *
     * @desc Retrieves a list of orders, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.orders.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only orders with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.projectId Project ID for orders.
     * @param {string=} params.searchString Allows searching for orders by name or ID. Wildcards (*) are allowed. For example, "order*2015" will return orders with names like "order June 2015", "order April 2015", or simply "order 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "order" will match orders with name "my order", "order 2015", or simply "order".
     * @param {string=} params.siteId Select only orders that are associated with these site IDs.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{projectId}/orders',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'projectId'],
        pathParams: ['profileId', 'projectId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.placementGroups = {

    /**
     * dfareporting.placementGroups.get
     *
     * @desc Gets one placement group by ID.
     *
     * @alias dfareporting.placementGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementGroups.insert
     *
     * @desc Inserts a new placement group.
     *
     * @alias dfareporting.placementGroups.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementGroups',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementGroups.list
     *
     * @desc Retrieves a list of placement groups, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.placementGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserIds Select only placement groups that belong to these advertisers.
     * @param {boolean=} params.archived Select only archived placements. Don't set this field to select both archived and non-archived placements.
     * @param {string=} params.campaignIds Select only placement groups that belong to these campaigns.
     * @param {string=} params.contentCategoryIds Select only placement groups that are associated with these content categories.
     * @param {string=} params.directorySiteIds Select only placement groups that are associated with these directory sites.
     * @param {string=} params.ids Select only placement groups with these IDs.
     * @param {string=} params.maxEndDate Select only placements or placement groups whose end date is on or before the specified maxEndDate. The date should be formatted as "yyyy-MM-dd".
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.maxStartDate Select only placements or placement groups whose start date is on or before the specified maxStartDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.minEndDate Select only placements or placement groups whose end date is on or after the specified minEndDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.minStartDate Select only placements or placement groups whose start date is on or after the specified minStartDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string=} params.placementGroupType Select only placement groups belonging with this group type. A package is a simple group of placements that acts as a single pricing point for a group of tags. A roadblock is a group of placements that not only acts as a single pricing point but also assumes that all the tags in it will be served at the same time. A roadblock requires one of its assigned placements to be marked as primary for reporting.
     * @param {string=} params.placementStrategyIds Select only placement groups that are associated with these placement strategies.
     * @param {string=} params.pricingTypes Select only placement groups with these pricing types.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for placement groups by name or ID. Wildcards (*) are allowed. For example, "placement*2015" will return placement groups with names like "placement group June 2015", "placement group May 2015", or simply "placements 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "placementgroup" will match placement groups with name "my placementgroup", "placementgroup 2015", or simply "placementgroup".
     * @param {string=} params.siteIds Select only placement groups that are associated with these sites.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementGroups.patch
     *
     * @desc Updates an existing placement group. This method supports patch semantics.
     *
     * @alias dfareporting.placementGroups.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement group ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementGroups',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementGroups.update
     *
     * @desc Updates an existing placement group.
     *
     * @alias dfareporting.placementGroups.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementGroup} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementGroups',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.placementStrategies = {

    /**
     * dfareporting.placementStrategies.delete
     *
     * @desc Deletes an existing placement strategy.
     *
     * @alias dfareporting.placementStrategies.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement strategy ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementStrategies.get
     *
     * @desc Gets one placement strategy by ID.
     *
     * @alias dfareporting.placementStrategies.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement strategy ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementStrategies.insert
     *
     * @desc Inserts a new placement strategy.
     *
     * @alias dfareporting.placementStrategies.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementStrategy} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementStrategies.list
     *
     * @desc Retrieves a list of placement strategies, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.placementStrategies.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only placement strategies with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "placementstrategy*2015" will return objects with names like "placementstrategy June 2015", "placementstrategy April 2015", or simply "placementstrategy 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "placementstrategy" will match objects with name "my placementstrategy", "placementstrategy 2015", or simply "placementstrategy".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementStrategies.patch
     *
     * @desc Updates an existing placement strategy. This method supports patch semantics.
     *
     * @alias dfareporting.placementStrategies.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement strategy ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementStrategy} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placementStrategies.update
     *
     * @desc Updates an existing placement strategy.
     *
     * @alias dfareporting.placementStrategies.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).PlacementStrategy} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placementStrategies',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.placements = {

    /**
     * dfareporting.placements.generatetags
     *
     * @desc Generates tags for a placement.
     *
     * @alias dfareporting.placements.generatetags
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.campaignId Generate placements belonging to this campaign. This is a required field.
     * @param {string=} params.placementIds Generate tags for these placements.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.tagFormats Tag formats to generate for these placements.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    generatetags: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements/generatetags',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placements.get
     *
     * @desc Gets one placement by ID.
     *
     * @alias dfareporting.placements.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placements.insert
     *
     * @desc Inserts a new placement.
     *
     * @alias dfareporting.placements.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Placement} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placements.list
     *
     * @desc Retrieves a list of placements, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.placements.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserIds Select only placements that belong to these advertisers.
     * @param {boolean=} params.archived Select only archived placements. Don't set this field to select both archived and non-archived placements.
     * @param {string=} params.campaignIds Select only placements that belong to these campaigns.
     * @param {string=} params.compatibilities Select only placements that are associated with these compatibilities. DISPLAY and DISPLAY_INTERSTITIAL refer to rendering either on desktop or on mobile devices for regular or interstitial ads respectively. APP and APP_INTERSTITIAL are for rendering in mobile apps. IN_STREAM_VIDEO refers to rendering in in-stream video ads developed with the VAST standard.
     * @param {string=} params.contentCategoryIds Select only placements that are associated with these content categories.
     * @param {string=} params.directorySiteIds Select only placements that are associated with these directory sites.
     * @param {string=} params.groupIds Select only placements that belong to these placement groups.
     * @param {string=} params.ids Select only placements with these IDs.
     * @param {string=} params.maxEndDate Select only placements or placement groups whose end date is on or before the specified maxEndDate. The date should be formatted as "yyyy-MM-dd".
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.maxStartDate Select only placements or placement groups whose start date is on or before the specified maxStartDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.minEndDate Select only placements or placement groups whose end date is on or after the specified minEndDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.minStartDate Select only placements or placement groups whose start date is on or after the specified minStartDate. The date should be formatted as "yyyy-MM-dd".
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string=} params.paymentSource Select only placements with this payment source.
     * @param {string=} params.placementStrategyIds Select only placements that are associated with these placement strategies.
     * @param {string=} params.pricingTypes Select only placements with these pricing types.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for placements by name or ID. Wildcards (*) are allowed. For example, "placement*2015" will return placements with names like "placement June 2015", "placement May 2015", or simply "placements 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "placement" will match placements with name "my placement", "placement 2015", or simply "placement".
     * @param {string=} params.siteIds Select only placements that are associated with these sites.
     * @param {string=} params.sizeIds Select only placements that are associated with these sizes.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placements.patch
     *
     * @desc Updates an existing placement. This method supports patch semantics.
     *
     * @alias dfareporting.placements.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Placement ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Placement} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.placements.update
     *
     * @desc Updates an existing placement.
     *
     * @alias dfareporting.placements.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Placement} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/placements',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.platformTypes = {

    /**
     * dfareporting.platformTypes.get
     *
     * @desc Gets one platform type by ID.
     *
     * @alias dfareporting.platformTypes.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Platform type ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/platformTypes/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.platformTypes.list
     *
     * @desc Retrieves a list of platform types.
     *
     * @alias dfareporting.platformTypes.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/platformTypes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.postalCodes = {

    /**
     * dfareporting.postalCodes.get
     *
     * @desc Gets one postal code by ID.
     *
     * @alias dfareporting.postalCodes.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.code Postal code ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/postalCodes/{code}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'code'],
        pathParams: ['code', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.postalCodes.list
     *
     * @desc Retrieves a list of postal codes.
     *
     * @alias dfareporting.postalCodes.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/postalCodes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.projects = {

    /**
     * dfareporting.projects.get
     *
     * @desc Gets one project by ID.
     *
     * @alias dfareporting.projects.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Project ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.projects.list
     *
     * @desc Retrieves a list of projects, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.projects.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.advertiserIds Select only projects with these advertiser IDs.
     * @param {string=} params.ids Select only projects with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for projects by name or ID. Wildcards (*) are allowed. For example, "project*2015" will return projects with names like "project June 2015", "project April 2015", or simply "project 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "project" will match projects with name "my project", "project 2015", or simply "project".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/projects',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.regions = {

    /**
     * dfareporting.regions.list
     *
     * @desc Retrieves a list of regions.
     *
     * @alias dfareporting.regions.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/regions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.remarketingListShares = {

    /**
     * dfareporting.remarketingListShares.get
     *
     * @desc Gets one remarketing list share by remarketing list ID.
     *
     * @alias dfareporting.remarketingListShares.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.remarketingListId Remarketing list ID.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingListShares/{remarketingListId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'remarketingListId'],
        pathParams: ['profileId', 'remarketingListId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingListShares.patch
     *
     * @desc Updates an existing remarketing list share. This method supports patch semantics.
     *
     * @alias dfareporting.remarketingListShares.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string} params.remarketingListId Remarketing list ID.
     * @param {dfareporting(v2.5).RemarketingListShare} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingListShares',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'remarketingListId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingListShares.update
     *
     * @desc Updates an existing remarketing list share.
     *
     * @alias dfareporting.remarketingListShares.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).RemarketingListShare} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingListShares',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.remarketingLists = {

    /**
     * dfareporting.remarketingLists.get
     *
     * @desc Gets one remarketing list by ID.
     *
     * @alias dfareporting.remarketingLists.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Remarketing list ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingLists/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingLists.insert
     *
     * @desc Inserts a new remarketing list.
     *
     * @alias dfareporting.remarketingLists.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).RemarketingList} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingLists',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingLists.list
     *
     * @desc Retrieves a list of remarketing lists, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.remarketingLists.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active or only inactive remarketing lists.
     * @param {string} params.advertiserId Select only remarketing lists owned by this advertiser.
     * @param {string=} params.floodlightActivityId Select only remarketing lists that have this floodlight activity ID.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.name Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "remarketing list*2015" will return objects with names like "remarketing list June 2015", "remarketing list April 2015", or simply "remarketing list 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "remarketing list" will match objects with name "my remarketing list", "remarketing list 2015", or simply "remarketing list".
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingLists',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'advertiserId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingLists.patch
     *
     * @desc Updates an existing remarketing list. This method supports patch semantics.
     *
     * @alias dfareporting.remarketingLists.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Remarketing list ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).RemarketingList} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingLists',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.remarketingLists.update
     *
     * @desc Updates an existing remarketing list.
     *
     * @alias dfareporting.remarketingLists.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).RemarketingList} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/remarketingLists',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.reports = {

    /**
     * dfareporting.reports.delete
     *
     * @desc Deletes a report by its ID.
     *
     * @alias dfareporting.reports.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA user profile ID.
     * @param {string} params.reportId The ID of the report.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'reportId'],
        pathParams: ['profileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.get
     *
     * @desc Retrieves a report by its ID.
     *
     * @alias dfareporting.reports.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA user profile ID.
     * @param {string} params.reportId The ID of the report.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'reportId'],
        pathParams: ['profileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.insert
     *
     * @desc Creates a report.
     *
     * @alias dfareporting.reports.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA user profile ID.
     * @param {dfareporting(v2.5).Report} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.list
     *
     * @desc Retrieves list of reports.
     *
     * @alias dfareporting.reports.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken The value of the nextToken from the previous result page.
     * @param {string} params.profileId The DFA user profile ID.
     * @param {string=} params.scope The scope that defines which results are returned, default is 'MINE'.
     * @param {string=} params.sortField The field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is 'DESCENDING'.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.patch
     *
     * @desc Updates a report. This method supports patch semantics.
     *
     * @alias dfareporting.reports.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA user profile ID.
     * @param {string} params.reportId The ID of the report.
     * @param {dfareporting(v2.5).Report} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'reportId'],
        pathParams: ['profileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.run
     *
     * @desc Runs a report.
     *
     * @alias dfareporting.reports.run
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA profile ID.
     * @param {string} params.reportId The ID of the report.
     * @param {boolean=} params.synchronous If set and true, tries to run the report synchronously.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    run: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}/run',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId', 'reportId'],
        pathParams: ['profileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.reports.update
     *
     * @desc Updates a report.
     *
     * @alias dfareporting.reports.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The DFA user profile ID.
     * @param {string} params.reportId The ID of the report.
     * @param {dfareporting(v2.5).Report} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId', 'reportId'],
        pathParams: ['profileId', 'reportId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    compatibleFields: {

      /**
       * dfareporting.reports.compatibleFields.query
       *
       * @desc Returns the fields that are compatible to be selected in the respective sections of a report criteria, given the fields already selected in the input report and user permissions.
       *
       * @alias dfareporting.reports.compatibleFields.query
       * @memberOf! dfareporting(v2.5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.profileId The DFA user profile ID.
       * @param {dfareporting(v2.5).Report} params.resource Request body data
       * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
       * @param {callback} callback The callback that handles the response.
       * @return {object} Request object
       */
      query: function (params, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});

        var parameters = {
          options: utils.extend({
            url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/compatiblefields/query',
            method: 'POST'
          }, options),
          params: params,
          requiredParams: ['profileId'],
          pathParams: ['profileId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    files: {

      /**
       * dfareporting.reports.files.get
       *
       * @desc Retrieves a report file.
       *
       * @alias dfareporting.reports.files.get
       * @memberOf! dfareporting(v2.5)
       *
       * @param {object} params Parameters for request
       * @param {string} params.fileId The ID of the report file.
       * @param {string} params.profileId The DFA profile ID.
       * @param {string} params.reportId The ID of the report.
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
            url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}/files/{fileId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['profileId', 'reportId', 'fileId'],
          pathParams: ['fileId', 'profileId', 'reportId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * dfareporting.reports.files.list
       *
       * @desc Lists files for a report.
       *
       * @alias dfareporting.reports.files.list
       * @memberOf! dfareporting(v2.5)
       *
       * @param {object} params Parameters for request
       * @param {integer=} params.maxResults Maximum number of results to return.
       * @param {string=} params.pageToken The value of the nextToken from the previous result page.
       * @param {string} params.profileId The DFA profile ID.
       * @param {string} params.reportId The ID of the parent report.
       * @param {string=} params.sortField The field by which to sort the list.
       * @param {string=} params.sortOrder Order of sorted results, default is 'DESCENDING'.
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
            url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/reports/{reportId}/files',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['profileId', 'reportId'],
          pathParams: ['profileId', 'reportId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    }
  };

  self.sites = {

    /**
     * dfareporting.sites.get
     *
     * @desc Gets one site by ID.
     *
     * @alias dfareporting.sites.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Site ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sites/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sites.insert
     *
     * @desc Inserts a new site.
     *
     * @alias dfareporting.sites.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Site} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sites',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sites.list
     *
     * @desc Retrieves a list of sites, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.sites.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.acceptsInStreamVideoPlacements This search filter is no longer supported and will have no effect on the results returned.
     * @param {boolean=} params.acceptsInterstitialPlacements This search filter is no longer supported and will have no effect on the results returned.
     * @param {boolean=} params.acceptsPublisherPaidPlacements Select only sites that accept publisher paid placements.
     * @param {boolean=} params.adWordsSite Select only AdWords sites.
     * @param {boolean=} params.approved Select only approved sites.
     * @param {string=} params.campaignIds Select only sites with these campaign IDs.
     * @param {string=} params.directorySiteIds Select only sites with these directory site IDs.
     * @param {string=} params.ids Select only sites with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name, ID or keyName. Wildcards (*) are allowed. For example, "site*2015" will return objects with names like "site June 2015", "site April 2015", or simply "site 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "site" will match objects with name "my site", "site 2015", or simply "site".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.subaccountId Select only sites with this subaccount ID.
     * @param {boolean=} params.unmappedSite Select only sites that have not been mapped to a directory site.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sites',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sites.patch
     *
     * @desc Updates an existing site. This method supports patch semantics.
     *
     * @alias dfareporting.sites.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Site ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Site} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sites',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sites.update
     *
     * @desc Updates an existing site.
     *
     * @alias dfareporting.sites.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Site} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sites',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sizes = {

    /**
     * dfareporting.sizes.get
     *
     * @desc Gets one size by ID.
     *
     * @alias dfareporting.sizes.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Size ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sizes/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sizes.insert
     *
     * @desc Inserts a new size.
     *
     * @alias dfareporting.sizes.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Size} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sizes',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.sizes.list
     *
     * @desc Retrieves a list of sizes, possibly filtered.
     *
     * @alias dfareporting.sizes.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.height Select only sizes with this height.
     * @param {boolean=} params.iabStandard Select only IAB standard sizes.
     * @param {string=} params.ids Select only sizes with these IDs.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {integer=} params.width Select only sizes with this width.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/sizes',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.subaccounts = {

    /**
     * dfareporting.subaccounts.get
     *
     * @desc Gets one subaccount by ID.
     *
     * @alias dfareporting.subaccounts.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Subaccount ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/subaccounts/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.subaccounts.insert
     *
     * @desc Inserts a new subaccount.
     *
     * @alias dfareporting.subaccounts.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Subaccount} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/subaccounts',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.subaccounts.list
     *
     * @desc Gets a list of subaccounts, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.subaccounts.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only subaccounts with these IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "subaccount*2015" will return objects with names like "subaccount June 2015", "subaccount April 2015", or simply "subaccount 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "subaccount" will match objects with name "my subaccount", "subaccount 2015", or simply "subaccount".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/subaccounts',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.subaccounts.patch
     *
     * @desc Updates an existing subaccount. This method supports patch semantics.
     *
     * @alias dfareporting.subaccounts.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Subaccount ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Subaccount} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/subaccounts',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.subaccounts.update
     *
     * @desc Updates an existing subaccount.
     *
     * @alias dfareporting.subaccounts.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).Subaccount} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/subaccounts',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.targetableRemarketingLists = {

    /**
     * dfareporting.targetableRemarketingLists.get
     *
     * @desc Gets one remarketing list by ID.
     *
     * @alias dfareporting.targetableRemarketingLists.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id Remarketing list ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/targetableRemarketingLists/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.targetableRemarketingLists.list
     *
     * @desc Retrieves a list of targetable remarketing lists, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.targetableRemarketingLists.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.active Select only active or only inactive targetable remarketing lists.
     * @param {string} params.advertiserId Select only targetable remarketing lists targetable by these advertisers.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.name Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "remarketing list*2015" will return objects with names like "remarketing list June 2015", "remarketing list April 2015", or simply "remarketing list 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "remarketing list" will match objects with name "my remarketing list", "remarketing list 2015", or simply "remarketing list".
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/targetableRemarketingLists',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'advertiserId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.userProfiles = {

    /**
     * dfareporting.userProfiles.get
     *
     * @desc Gets one user profile by ID.
     *
     * @alias dfareporting.userProfiles.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId The user profile ID.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userProfiles.list
     *
     * @desc Retrieves list of user profiles for a user.
     *
     * @alias dfareporting.userProfiles.list
     * @memberOf! dfareporting(v2.5)
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles',
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

  self.userRolePermissionGroups = {

    /**
     * dfareporting.userRolePermissionGroups.get
     *
     * @desc Gets one user role permission group by ID.
     *
     * @alias dfareporting.userRolePermissionGroups.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User role permission group ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRolePermissionGroups/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRolePermissionGroups.list
     *
     * @desc Gets a list of all supported user role permission groups.
     *
     * @alias dfareporting.userRolePermissionGroups.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRolePermissionGroups',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.userRolePermissions = {

    /**
     * dfareporting.userRolePermissions.get
     *
     * @desc Gets one user role permission by ID.
     *
     * @alias dfareporting.userRolePermissions.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User role permission ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRolePermissions/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRolePermissions.list
     *
     * @desc Gets a list of user role permissions, possibly filtered.
     *
     * @alias dfareporting.userRolePermissions.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.ids Select only user role permissions with these IDs.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRolePermissions',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.userRoles = {

    /**
     * dfareporting.userRoles.delete
     *
     * @desc Deletes an existing user role.
     *
     * @alias dfareporting.userRoles.delete
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User role ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles/{id}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRoles.get
     *
     * @desc Gets one user role by ID.
     *
     * @alias dfareporting.userRoles.get
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User role ID.
     * @param {string} params.profileId User profile ID associated with this request.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles/{id}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['id', 'profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRoles.insert
     *
     * @desc Inserts a new user role.
     *
     * @alias dfareporting.userRoles.insert
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).UserRole} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRoles.list
     *
     * @desc Retrieves a list of user roles, possibly filtered. This method supports paging.
     *
     * @alias dfareporting.userRoles.list
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.accountUserRoleOnly Select only account level user roles not associated with any specific subaccount.
     * @param {string=} params.ids Select only user roles with the specified IDs.
     * @param {integer=} params.maxResults Maximum number of results to return.
     * @param {string=} params.pageToken Value of the nextPageToken from the previous result page.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {string=} params.searchString Allows searching for objects by name or ID. Wildcards (*) are allowed. For example, "userrole*2015" will return objects with names like "userrole June 2015", "userrole April 2015", or simply "userrole 2015". Most of the searches also add wildcards implicitly at the start and the end of the search string. For example, a search string of "userrole" will match objects with name "my userrole", "userrole 2015", or simply "userrole".
     * @param {string=} params.sortField Field by which to sort the list.
     * @param {string=} params.sortOrder Order of sorted results, default is ASCENDING.
     * @param {string=} params.subaccountId Select only user roles that belong to this subaccount.
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRoles.patch
     *
     * @desc Updates an existing user role. This method supports patch semantics.
     *
     * @alias dfareporting.userRoles.patch
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.id User role ID.
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).UserRole} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles',
          method: 'PATCH'
        }, options),
        params: params,
        requiredParams: ['profileId', 'id'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * dfareporting.userRoles.update
     *
     * @desc Updates an existing user role.
     *
     * @alias dfareporting.userRoles.update
     * @memberOf! dfareporting(v2.5)
     *
     * @param {object} params Parameters for request
     * @param {string} params.profileId User profile ID associated with this request.
     * @param {dfareporting(v2.5).UserRole} params.resource Request body data
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
          url: 'https://www.googleapis.com/dfareporting/v2.5/userprofiles/{profileId}/userRoles',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['profileId'],
        pathParams: ['profileId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef Account
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string[]} accountPermissionIds Account permissions assigned to this account.
* @property {string} accountProfile Profile for this account. This is a read-only field that can be left blank.
* @property {boolean} active Whether this account is active.
* @property {string} activeAdsLimitTier Maximum number of active ads allowed for this account.
* @property {boolean} activeViewOptOut Whether to serve creatives with Active View tags. If disabled, viewability data will not be available for any impressions.
* @property {string[]} availablePermissionIds User role permissions available to the user roles of this account.
* @property {boolean} comscoreVceEnabled Whether campaigns created in this account will be enabled for comScore vCE by default.
* @property {string} countryId ID of the country associated with this account.
* @property {string} currencyId ID of currency associated with this account. This is a required field.
Acceptable values are: 
- &quot;1&quot; for USD 
- &quot;2&quot; for GBP 
- &quot;3&quot; for ESP 
- &quot;4&quot; for SEK 
- &quot;5&quot; for CAD 
- &quot;6&quot; for JPY 
- &quot;7&quot; for DEM 
- &quot;8&quot; for AUD 
- &quot;9&quot; for FRF 
- &quot;10&quot; for ITL 
- &quot;11&quot; for DKK 
- &quot;12&quot; for NOK 
- &quot;13&quot; for FIM 
- &quot;14&quot; for ZAR 
- &quot;15&quot; for IEP 
- &quot;16&quot; for NLG 
- &quot;17&quot; for EUR 
- &quot;18&quot; for KRW 
- &quot;19&quot; for TWD 
- &quot;20&quot; for SGD 
- &quot;21&quot; for CNY 
- &quot;22&quot; for HKD 
- &quot;23&quot; for NZD 
- &quot;24&quot; for MYR 
- &quot;25&quot; for BRL 
- &quot;26&quot; for PTE 
- &quot;27&quot; for MXP 
- &quot;28&quot; for CLP 
- &quot;29&quot; for TRY 
- &quot;30&quot; for ARS 
- &quot;31&quot; for PEN 
- &quot;32&quot; for ILS 
- &quot;33&quot; for CHF 
- &quot;34&quot; for VEF 
- &quot;35&quot; for COP 
- &quot;36&quot; for GTQ 
- &quot;37&quot; for PLN 
- &quot;39&quot; for INR 
- &quot;40&quot; for THB 
- &quot;41&quot; for IDR 
- &quot;42&quot; for CZK 
- &quot;43&quot; for RON 
- &quot;44&quot; for HUF 
- &quot;45&quot; for RUB 
- &quot;46&quot; for AED 
- &quot;47&quot; for BGN 
- &quot;48&quot; for HRK
* @property {string} defaultCreativeSizeId Default placement dimensions for this account.
* @property {string} description Description of this account.
* @property {string} id ID of this account. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#account&quot;.
* @property {string} locale Locale of this account.
Acceptable values are: 
- &quot;cs&quot; (Czech) 
- &quot;de&quot; (German) 
- &quot;en&quot; (English) 
- &quot;en-GB&quot; (English United Kingdom) 
- &quot;es&quot; (Spanish) 
- &quot;fr&quot; (French) 
- &quot;it&quot; (Italian) 
- &quot;ja&quot; (Japanese) 
- &quot;ko&quot; (Korean) 
- &quot;pl&quot; (Polish) 
- &quot;pt-BR&quot; (Portuguese Brazil) 
- &quot;ru&quot; (Russian) 
- &quot;sv&quot; (Swedish) 
- &quot;tr&quot; (Turkish) 
- &quot;zh-CN&quot; (Chinese Simplified) 
- &quot;zh-TW&quot; (Chinese Traditional)
* @property {string} maximumImageSize Maximum image size allowed for this account.
* @property {string} name Name of this account. This is a required field, and must be less than 128 characters long and be globally unique.
* @property {boolean} nielsenOcrEnabled Whether campaigns created in this account will be enabled for Nielsen OCR reach ratings by default.
* @property {dfareporting(v2.5).ReportsConfiguration} reportsConfiguration Reporting configuration of this account.
* @property {string} teaserSizeLimit File size limit in kilobytes of Rich Media teaser creatives. Must be between 1 and 10240.
*/
/**
 * @typedef AccountActiveAdSummary
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId ID of the account.
 * @property {string} activeAds Ads that have been activated for the account
 * @property {string} activeAdsLimitTier Maximum number of active ads allowed for the account.
 * @property {string} availableAds Ads that can be activated for the account.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountActiveAdSummary&quot;.
 */
/**
 * @typedef AccountPermission
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string[]} accountProfiles Account profiles associated with this account permission.

Possible values are:
- &quot;ACCOUNT_PROFILE_BASIC&quot;
- &quot;ACCOUNT_PROFILE_STANDARD&quot;
* @property {string} id ID of this account permission.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountPermission&quot;.
* @property {string} level Administrative level required to enable this account permission.
* @property {string} name Name of this account permission.
* @property {string} permissionGroupId Permission group of this account permission.
*/
/**
 * @typedef AccountPermissionGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this account permission group.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountPermissionGroup&quot;.
 * @property {string} name Name of this account permission group.
 */
/**
 * @typedef AccountPermissionGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).AccountPermissionGroup[]} accountPermissionGroups Account permission group collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountPermissionGroupsListResponse&quot;.
 */
/**
 * @typedef AccountPermissionsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).AccountPermission[]} accountPermissions Account permission collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountPermissionsListResponse&quot;.
 */
/**
 * @typedef AccountUserProfile
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of the user profile. This is a read-only field that can be left blank.
* @property {boolean} active Whether this user profile is active. This defaults to false, and must be set true on insert for the user profile to be usable.
* @property {dfareporting(v2.5).ObjectFilter} advertiserFilter Filter that describes which advertisers are visible to the user profile.
* @property {dfareporting(v2.5).ObjectFilter} campaignFilter Filter that describes which campaigns are visible to the user profile.
* @property {string} comments Comments for this user profile.
* @property {string} email Email of the user profile. The email addresss must be linked to a Google Account. This field is required on insertion and is read-only after insertion.
* @property {string} id ID of the user profile. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountUserProfile&quot;.
* @property {string} locale Locale of the user profile. This is a required field.
Acceptable values are:  
- &quot;cs&quot; (Czech) 
- &quot;de&quot; (German) 
- &quot;en&quot; (English) 
- &quot;en-GB&quot; (English United Kingdom) 
- &quot;es&quot; (Spanish) 
- &quot;fr&quot; (French) 
- &quot;it&quot; (Italian) 
- &quot;ja&quot; (Japanese) 
- &quot;ko&quot; (Korean) 
- &quot;pl&quot; (Polish) 
- &quot;pt-BR&quot; (Portuguese Brazil)
- &quot;ru&quot; (Russian) 
- &quot;sv&quot; (Swedish) 
- &quot;tr&quot; (Turkish) 
- &quot;zh-CN&quot; (Chinese Simplified) 
- &quot;zh-TW&quot; (Chinese Traditional)
* @property {string} name Name of the user profile. This is a required field. Must be less than 64 characters long, must be globally unique, and cannot contain whitespace or any of the following characters: &quot;&amp;;&quot;#%,&quot;.
* @property {dfareporting(v2.5).ObjectFilter} siteFilter Filter that describes which sites are visible to the user profile.
* @property {string} subaccountId Subaccount ID of the user profile. This is a read-only field that can be left blank.
* @property {string} traffickerType Trafficker type of this user profile.
* @property {string} userAccessType User type of the user profile. This is a read-only field that can be left blank.
* @property {dfareporting(v2.5).ObjectFilter} userRoleFilter Filter that describes which user roles are visible to the user profile.
* @property {string} userRoleId User role ID of the user profile. This is a required field.
*/
/**
 * @typedef AccountUserProfilesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).AccountUserProfile[]} accountUserProfiles Account user profile collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountUserProfilesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef AccountsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Account[]} accounts Account collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#accountsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef Activities
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DimensionValue[]} filters List of activity filters. The dimension values need to be all either of type &quot;dfa:activity&quot; or &quot;dfa:activityGroup&quot;.
 * @property {string} kind The kind of resource this is, in this case dfareporting#activities.
 * @property {string[]} metricNames List of names of floodlight activity metrics.
 */
/**
 * @typedef Ad
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this ad. This is a read-only field that can be left blank.
 * @property {boolean} active Whether this ad is active. When true, archived must be false.
 * @property {string} advertiserId Advertiser ID of this ad. This is a required field on insertion.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {boolean} archived Whether this ad is archived. When true, active must be false.
 * @property {string} audienceSegmentId Audience segment ID that is being targeted for this ad. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {string} campaignId Campaign ID of this ad. This is a required field on insertion.
 * @property {dfareporting(v2.5).DimensionValue} campaignIdDimensionValue Dimension value for the ID of the campaign. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).ClickThroughUrl} clickThroughUrl Click-through URL for this ad. This is a required field on insertion. Applicable when type is AD_SERVING_CLICK_TRACKER.
 * @property {dfareporting(v2.5).ClickThroughUrlSuffixProperties} clickThroughUrlSuffixProperties Click-through URL suffix properties for this ad. Applies to the URL in the ad or (if overriding ad properties) the URL in the creative.
 * @property {string} comments Comments for this ad.
 * @property {string} compatibility Compatibility of this ad. Applicable when type is AD_SERVING_DEFAULT_AD. DISPLAY and DISPLAY_INTERSTITIAL refer to either rendering on desktop or on mobile devices or in mobile apps for regular or interstitial ads, respectively. APP and APP_INTERSTITIAL are only used for existing default ads. New mobile placements must be assigned DISPLAY or DISPLAY_INTERSTITIAL and default ads created for those placements will be limited to those compatibility types. IN_STREAM_VIDEO refers to rendering in-stream video ads developed with the VAST standard.
 * @property {dfareporting(v2.5).LastModifiedInfo} createInfo Information about the creation of this ad. This is a read-only field.
 * @property {dfareporting(v2.5).CreativeGroupAssignment[]} creativeGroupAssignments Creative group assignments for this ad. Applicable when type is AD_SERVING_CLICK_TRACKER. Only one assignment per creative group number is allowed for a maximum of two assignments.
 * @property {dfareporting(v2.5).CreativeRotation} creativeRotation Creative rotation for this ad. Applicable when type is AD_SERVING_DEFAULT_AD, AD_SERVING_STANDARD_AD, or AD_SERVING_TRACKING. When type is AD_SERVING_DEFAULT_AD, this field should have exactly one creativeAssignment.
 * @property {dfareporting(v2.5).DayPartTargeting} dayPartTargeting Time and day targeting information for this ad. This field must be left blank if the ad is using a targeting template. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {dfareporting(v2.5).DefaultClickThroughEventTagProperties} defaultClickThroughEventTagProperties Default click-through event tag properties for this ad.
 * @property {dfareporting(v2.5).DeliverySchedule} deliverySchedule Delivery schedule information for this ad. Applicable when type is AD_SERVING_STANDARD_AD or AD_SERVING_TRACKING. This field along with subfields priority and impressionRatio are required on insertion when type is AD_SERVING_STANDARD_AD.
 * @property {boolean} dynamicClickTracker Whether this ad is a dynamic click tracker. Applicable when type is AD_SERVING_CLICK_TRACKER. This is a required field on insert, and is read-only after insert.
 * @property {string} endTime Date and time that this ad should stop serving. Must be later than the start time. This is a required field on insertion.
 * @property {dfareporting(v2.5).EventTagOverride[]} eventTagOverrides Event tag overrides for this ad.
 * @property {dfareporting(v2.5).GeoTargeting} geoTargeting Geographical targeting information for this ad. This field must be left blank if the ad is using a targeting template. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {string} id ID of this ad. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this ad. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).KeyValueTargetingExpression} keyValueTargetingExpression Key-value targeting information for this ad. This field must be left blank if the ad is using a targeting template. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#ad&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this ad. This is a read-only field.
 * @property {string} name Name of this ad. This is a required field and must be less than 256 characters long.
 * @property {dfareporting(v2.5).PlacementAssignment[]} placementAssignments Placement assignments for this ad.
 * @property {dfareporting(v2.5).ListTargetingExpression} remarketingListExpression Remarketing list targeting expression for this ad. This field must be left blank if the ad is using a targeting template. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {dfareporting(v2.5).Size} size Size of this ad. Applicable when type is AD_SERVING_DEFAULT_AD.
 * @property {boolean} sslCompliant Whether this ad is ssl compliant. This is a read-only field that is auto-generated when the ad is inserted or updated.
 * @property {boolean} sslRequired Whether this ad requires ssl. This is a read-only field that is auto-generated when the ad is inserted or updated.
 * @property {string} startTime Date and time that this ad should start serving. If creating an ad, this field must be a time in the future. This is a required field on insertion.
 * @property {string} subaccountId Subaccount ID of this ad. This is a read-only field that can be left blank.
 * @property {dfareporting(v2.5).TechnologyTargeting} technologyTargeting Technology platform targeting information for this ad. This field must be left blank if the ad is using a targeting template. Applicable when type is AD_SERVING_STANDARD_AD.
 * @property {string} type Type of ad. This is a required field on insertion. Note that default ads (AD_SERVING_DEFAULT_AD) cannot be created directly (see Creative resource).
 */
/**
 * @typedef AdSlot
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} comment Comment for this ad slot.
 * @property {string} compatibility Ad slot compatibility. DISPLAY and DISPLAY_INTERSTITIAL refer to rendering either on desktop, mobile devices or in mobile apps for regular or interstitial ads respectively. APP and APP_INTERSTITIAL are for rendering in mobile apps. IN_STREAM_VIDEO refers to rendering in in-stream video ads developed with the VAST standard.
 * @property {string} height Height of this ad slot.
 * @property {string} linkedPlacementId ID of the placement from an external platform that is linked to this ad slot.
 * @property {string} name Name of this ad slot.
 * @property {string} paymentSourceType Payment source type of this ad slot.
 * @property {boolean} primary Primary ad slot of a roadblock inventory item.
 * @property {string} width Width of this ad slot.
 */
/**
 * @typedef AdsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Ad[]} ads Ad collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#adsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef Advertiser
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this advertiser.This is a read-only field that can be left blank.
* @property {string} advertiserGroupId ID of the advertiser group this advertiser belongs to. You can group advertisers for reporting purposes, allowing you to see aggregated information for all advertisers in each group.
* @property {string} clickThroughUrlSuffix Suffix added to click-through URL of ad creative associations under this advertiser. Must be less than 129 characters long.
* @property {string} defaultClickThroughEventTagId ID of the click-through event tag to apply by default to the landing pages of this advertiser&#39;s campaigns.
* @property {string} defaultEmail Default email address used in sender field for tag emails.
* @property {string} floodlightConfigurationId Floodlight configuration ID of this advertiser. The floodlight configuration ID will be created automatically, so on insert this field should be left blank. This field can be set to another advertiser&#39;s floodlight configuration ID in order to share that advertiser&#39;s floodlight configuration with this advertiser, so long as: 
- This advertiser&#39;s original floodlight configuration is not already associated with floodlight activities or floodlight activity groups. 
- This advertiser&#39;s original floodlight configuration is not already shared with another advertiser.
* @property {dfareporting(v2.5).DimensionValue} floodlightConfigurationIdDimensionValue Dimension value for the ID of the floodlight configuration. This is a read-only, auto-generated field.
* @property {string} id ID of this advertiser. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this advertiser. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#advertiser&quot;.
* @property {string} name Name of this advertiser. This is a required field and must be less than 256 characters long and unique among advertisers of the same account.
* @property {string} originalFloodlightConfigurationId Original floodlight configuration before any sharing occurred. Set the floodlightConfigurationId of this advertiser to originalFloodlightConfigurationId to unshare the advertiser&#39;s current floodlight configuration. You cannot unshare an advertiser&#39;s floodlight configuration if the shared configuration has activities associated with any campaign or placement.
* @property {string} status Status of this advertiser.
* @property {string} subaccountId Subaccount ID of this advertiser.This is a read-only field that can be left blank.
* @property {boolean} suspended Suspension status of this advertiser.
*/
/**
 * @typedef AdvertiserGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this advertiser group. This is a read-only field that can be left blank.
 * @property {string} id ID of this advertiser group. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#advertiserGroup&quot;.
 * @property {string} name Name of this advertiser group. This is a required field and must be less than 256 characters long and unique among advertiser groups of the same account.
 */
/**
 * @typedef AdvertiserGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).AdvertiserGroup[]} advertiserGroups Advertiser group collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#advertiserGroupsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef AdvertisersListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Advertiser[]} advertisers Advertiser collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#advertisersListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef AudienceSegment
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {integer} allocation Weight allocated to this segment. Must be between 1 and 1000. The weight assigned will be understood in proportion to the weights assigned to other segments in the same segment group.
 * @property {string} id ID of this audience segment. This is a read-only, auto-generated field.
 * @property {string} name Name of this audience segment. This is a required field and must be less than 65 characters long.
 */
/**
 * @typedef AudienceSegmentGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).AudienceSegment[]} audienceSegments Audience segments assigned to this group. The number of segments must be between 2 and 100.
 * @property {string} id ID of this audience segment group. This is a read-only, auto-generated field.
 * @property {string} name Name of this audience segment group. This is a required field and must be less than 65 characters long.
 */
/**
 * @typedef Browser
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} browserVersionId ID referring to this grouping of browser and version numbers. This is the ID used for targeting.
 * @property {string} dartId DART ID of this browser. This is the ID used when generating reports.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#browser&quot;.
 * @property {string} majorVersion Major version number (leftmost number) of this browser. For example, for Chrome 5.0.376.86 beta, this field should be set to 5. An asterisk (*) may be used to target any version number, and a question mark (?) may be used to target cases where the version number cannot be identified. For example, Chrome *.* targets any version of Chrome: 1.2, 2.5, 3.5, and so on. Chrome 3.* targets Chrome 3.1, 3.5, but not 4.0. Firefox ?.? targets cases where the ad server knows the browser is Firefox but can&#39;t tell which version it is.
 * @property {string} minorVersion Minor version number (number after first dot on left) of this browser. For example, for Chrome 5.0.375.86 beta, this field should be set to 0. An asterisk (*) may be used to target any version number, and a question mark (?) may be used to target cases where the version number cannot be identified. For example, Chrome *.* targets any version of Chrome: 1.2, 2.5, 3.5, and so on. Chrome 3.* targets Chrome 3.1, 3.5, but not 4.0. Firefox ?.? targets cases where the ad server knows the browser is Firefox but can&#39;t tell which version it is.
 * @property {string} name Name of this browser.
 */
/**
 * @typedef BrowsersListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Browser[]} browsers Browser collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#browsersListResponse&quot;.
 */
/**
 * @typedef Campaign
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this campaign. This is a read-only field that can be left blank.
 * @property {dfareporting(v2.5).CreativeOptimizationConfiguration[]} additionalCreativeOptimizationConfigurations Additional creative optimization configurations for the campaign.
 * @property {string} advertiserGroupId Advertiser group ID of the associated advertiser.
 * @property {string} advertiserId Advertiser ID of this campaign. This is a required field.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the advertiser ID of this campaign. This is a read-only, auto-generated field.
 * @property {boolean} archived Whether this campaign has been archived.
 * @property {dfareporting(v2.5).AudienceSegmentGroup[]} audienceSegmentGroups Audience segment groups assigned to this campaign. Cannot have more than 300 segment groups.
 * @property {string} billingInvoiceCode Billing invoice code included in the DCM client billing invoices associated with the campaign.
 * @property {dfareporting(v2.5).ClickThroughUrlSuffixProperties} clickThroughUrlSuffixProperties Click-through URL suffix override properties for this campaign.
 * @property {string} comment Arbitrary comments about this campaign. Must be less than 256 characters long.
 * @property {boolean} comscoreVceEnabled Whether comScore vCE reports are enabled for this campaign.
 * @property {dfareporting(v2.5).LastModifiedInfo} createInfo Information about the creation of this campaign. This is a read-only field.
 * @property {string[]} creativeGroupIds List of creative group IDs that are assigned to the campaign.
 * @property {dfareporting(v2.5).CreativeOptimizationConfiguration} creativeOptimizationConfiguration Creative optimization configuration for the campaign.
 * @property {dfareporting(v2.5).DefaultClickThroughEventTagProperties} defaultClickThroughEventTagProperties Click-through event tag ID override properties for this campaign.
 * @property {string} endDate Date on which the campaign will stop running. On insert, the end date must be today or a future date. The end date must be later than or be the same as the start date. If, for example, you set 6/25/2015 as both the start and end dates, the effective campaign run date is just that day only, 6/25/2015. The hours, minutes, and seconds of the end date should not be set, as doing so will result in an error. This is a required field.
 * @property {dfareporting(v2.5).EventTagOverride[]} eventTagOverrides Overrides that can be used to activate or deactivate advertiser event tags.
 * @property {string} externalId External ID for this campaign.
 * @property {string} id ID of this campaign. This is a read-only auto-generated field.
 * @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this campaign. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#campaign&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this campaign. This is a read-only field.
 * @property {dfareporting(v2.5).LookbackConfiguration} lookbackConfiguration Lookback window settings for the campaign.
 * @property {string} name Name of this campaign. This is a required field and must be less than 256 characters long and unique among campaigns of the same advertiser.
 * @property {boolean} nielsenOcrEnabled Whether Nielsen reports are enabled for this campaign.
 * @property {string} startDate Date on which the campaign starts running. The start date can be any date. The hours, minutes, and seconds of the start date should not be set, as doing so will result in an error. This is a required field.
 * @property {string} subaccountId Subaccount ID of this campaign. This is a read-only field that can be left blank.
 * @property {string[]} traffickerEmails Campaign trafficker contact emails.
 */
/**
 * @typedef CampaignCreativeAssociation
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} creativeId ID of the creative associated with the campaign. This is a required field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#campaignCreativeAssociation&quot;.
 */
/**
 * @typedef CampaignCreativeAssociationsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CampaignCreativeAssociation[]} campaignCreativeAssociations Campaign creative association collection
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#campaignCreativeAssociationsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CampaignsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Campaign[]} campaigns Campaign collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#campaignsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef ChangeLog
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of the modified object.
 * @property {string} action Action which caused the change.
 * @property {string} changeTime Time when the object was modified.
 * @property {string} fieldName Field name of the object which changed.
 * @property {string} id ID of this change log.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#changeLog&quot;.
 * @property {string} newValue New value of the object field.
 * @property {string} objectId ID of the object of this change log. The object could be a campaign, placement, ad, or other type.
 * @property {string} objectType Object type of the change log.
 * @property {string} oldValue Old value of the object field.
 * @property {string} subaccountId Subaccount ID of the modified object.
 * @property {string} transactionId Transaction ID of this change log. When a single API call results in many changes, each change will have a separate ID in the change log but will share the same transactionId.
 * @property {string} userProfileId ID of the user who modified the object.
 * @property {string} userProfileName User profile name of the user who modified the object.
 */
/**
 * @typedef ChangeLogsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).ChangeLog[]} changeLogs Change log collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#changeLogsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CitiesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).City[]} cities City collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#citiesListResponse&quot;.
 */
/**
 * @typedef City
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} countryCode Country code of the country to which this city belongs.
 * @property {string} countryDartId DART ID of the country to which this city belongs.
 * @property {string} dartId DART ID of this city. This is the ID used for targeting and generating reports.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#city&quot;.
 * @property {string} metroCode Metro region code of the metro region (DMA) to which this city belongs.
 * @property {string} metroDmaId ID of the metro region (DMA) to which this city belongs.
 * @property {string} name Name of this city.
 * @property {string} regionCode Region code of the region to which this city belongs.
 * @property {string} regionDartId DART ID of the region to which this city belongs.
 */
/**
 * @typedef ClickTag
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} eventName Advertiser event name associated with the click tag. This field is used by DISPLAY_IMAGE_GALLERY and HTML5_BANNER creatives. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
 * @property {string} name Parameter name for the specified click tag. For DISPLAY_IMAGE_GALLERY creative assets, this field must match the value of the creative asset&#39;s creativeAssetId.name field.
 * @property {string} value Parameter value for the specified click tag. This field contains a click-through url.
 */
/**
 * @typedef ClickThroughUrl
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} computedClickThroughUrl Read-only convenience field representing the actual URL that will be used for this click-through. The URL is computed as follows: 
- If defaultLandingPage is enabled then the campaign&#39;s default landing page URL is assigned to this field.
- If defaultLandingPage is not enabled and a landingPageId is specified then that landing page&#39;s URL is assigned to this field.
- If neither of the above cases apply, then the customClickThroughUrl is assigned to this field.
* @property {string} customClickThroughUrl Custom click-through URL. Applicable if the defaultLandingPage field is set to false and the landingPageId field is left unset.
* @property {boolean} defaultLandingPage Whether the campaign default landing page is used.
* @property {string} landingPageId ID of the landing page for the click-through URL. Applicable if the defaultLandingPage field is set to false.
*/
/**
 * @typedef ClickThroughUrlSuffixProperties
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} clickThroughUrlSuffix Click-through URL suffix to apply to all ads in this entity&#39;s scope. Must be less than 128 characters long.
 * @property {boolean} overrideInheritedSuffix Whether this entity should override the inherited click-through URL suffix with its own defined value.
 */
/**
 * @typedef CompanionClickThroughOverride
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).ClickThroughUrl} clickThroughUrl Click-through URL of this companion click-through override.
 * @property {string} creativeId ID of the creative for this companion click-through override.
 */
/**
 * @typedef CompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CrossDimensionReachReportCompatibleFields} crossDimensionReachReportCompatibleFields Contains items that are compatible to be selected for a report of type &quot;CROSS_DIMENSION_REACH&quot;.
 * @property {dfareporting(v2.5).FloodlightReportCompatibleFields} floodlightReportCompatibleFields Contains items that are compatible to be selected for a report of type &quot;FLOODLIGHT&quot;.
 * @property {string} kind The kind of resource this is, in this case dfareporting#compatibleFields.
 * @property {dfareporting(v2.5).PathToConversionReportCompatibleFields} pathToConversionReportCompatibleFields Contains items that are compatible to be selected for a report of type &quot;PATH_TO_CONVERSION&quot;.
 * @property {dfareporting(v2.5).ReachReportCompatibleFields} reachReportCompatibleFields Contains items that are compatible to be selected for a report of type &quot;REACH&quot;.
 * @property {dfareporting(v2.5).ReportCompatibleFields} reportCompatibleFields Contains items that are compatible to be selected for a report of type &quot;STANDARD&quot;.
 */
/**
 * @typedef ConnectionType
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this connection type.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#connectionType&quot;.
 * @property {string} name Name of this connection type.
 */
/**
 * @typedef ConnectionTypesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).ConnectionType[]} connectionTypes Collection of connection types such as broadband and mobile.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#connectionTypesListResponse&quot;.
 */
/**
 * @typedef ContentCategoriesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).ContentCategory[]} contentCategories Content category collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#contentCategoriesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef ContentCategory
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this content category. This is a read-only field that can be left blank.
 * @property {string} id ID of this content category. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#contentCategory&quot;.
 * @property {string} name Name of this content category. This is a required field and must be less than 256 characters long and unique among content categories of the same account.
 */
/**
 * @typedef Conversion
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} childDirectedTreatment Whether the conversion was directed toward children.
 * @property {dfareporting(v2.5).CustomFloodlightVariable[]} customVariables Custom floodlight variables.
 * @property {string} encryptedUserId The alphanumeric encrypted user ID. When set, encryptionInfo should also be specified. This field is mutually exclusive with encryptedUserIdCandidates[] and mobileDeviceId. This or encryptedUserIdCandidates[] or mobileDeviceId is a required field.
 * @property {string} floodlightActivityId Floodlight Activity ID of this conversion. This is a required field.
 * @property {string} floodlightConfigurationId Floodlight Configuration ID of this conversion. This is a required field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#conversion&quot;.
 * @property {boolean} limitAdTracking Whether Limit Ad Tracking is enabled. When set to true, the conversion will be used for reporting but not targeting. This will prevent remarketing.
 * @property {string} mobileDeviceId The mobile device ID. This field is mutually exclusive with encryptedUserId and encryptedUserIdCandidates[]. This or encryptedUserId or encryptedUserIdCandidates[] is a required field.
 * @property {string} ordinal The ordinal of the conversion. Use this field to control how conversions of the same user and day are de-duplicated. This is a required field.
 * @property {string} quantity The quantity of the conversion.
 * @property {string} timestampMicros The timestamp of conversion, in Unix epoch micros. This is a required field.
 * @property {number} value The value of the conversion.
 */
/**
 * @typedef ConversionError
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} code The error code.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#conversionError&quot;.
 * @property {string} message A description of the error.
 */
/**
 * @typedef ConversionStatus
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Conversion} conversion The original conversion that was inserted or updated.
 * @property {dfareporting(v2.5).ConversionError[]} errors A list of errors related to this conversion.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#conversionStatus&quot;.
 */
/**
 * @typedef ConversionsBatchInsertRequest
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Conversion[]} conversions The set of conversions to insert.
 * @property {dfareporting(v2.5).EncryptionInfo} encryptionInfo Describes how encryptedUserId is encrypted. This is a required field if encryptedUserId is used.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#conversionsBatchInsertRequest&quot;.
 */
/**
 * @typedef ConversionsBatchInsertResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} hasFailures Indicates that some or all conversions failed to insert.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#conversionsBatchInsertResponse&quot;.
 * @property {dfareporting(v2.5).ConversionStatus[]} status The status of each conversion&#39;s insertion status. The status is returned in the same order that conversions are inserted.
 */
/**
 * @typedef CountriesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Country[]} countries Country collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#countriesListResponse&quot;.
 */
/**
 * @typedef Country
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} countryCode Country code.
 * @property {string} dartId DART ID of this country. This is the ID used for targeting and generating reports.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#country&quot;.
 * @property {string} name Name of this country.
 * @property {boolean} sslEnabled Whether ad serving supports secure servers in this country.
 */
/**
 * @typedef Creative
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this creative. This field, if left unset, will be auto-generated for both insert and update operations. Applicable to all creative types.
* @property {boolean} active Whether the creative is active. Applicable to all creative types.
* @property {string} adParameters Ad parameters user for VPAID creative. This is a read-only field. Applicable to the following creative types: all VPAID.
* @property {string[]} adTagKeys Keywords for a Rich Media creative. Keywords let you customize the creative settings of a Rich Media ad running on your site without having to contact the advertiser. You can use keywords to dynamically change the look or functionality of a creative. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} advertiserId Advertiser ID of this creative. This is a required field. Applicable to all creative types.
* @property {boolean} allowScriptAccess Whether script access is allowed for this creative. This is a read-only and deprecated field which will automatically be set to true on update. Applicable to the following creative types: FLASH_INPAGE.
* @property {boolean} archived Whether the creative is archived. Applicable to all creative types.
* @property {string} artworkType Type of artwork used for the creative. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} authoringSource Source application where creative was authored. Presently, only DBM authored creatives will have this field set. Applicable to all creative types.
* @property {string} authoringTool Authoring tool for HTML5 banner creatives. This is a read-only field. Applicable to the following creative types: HTML5_BANNER.
* @property {boolean} auto_advance_images Whether images are automatically advanced for image gallery creatives. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY.
* @property {string} backgroundColor The 6-character HTML color code, beginning with #, for the background of the window area where the Flash file is displayed. Default is white. Applicable to the following creative types: FLASH_INPAGE.
* @property {string} backupImageClickThroughUrl Click-through URL for backup image. Applicable to the following creative types: FLASH_INPAGE and HTML5_BANNER. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {string[]} backupImageFeatures List of feature dependencies that will cause a backup image to be served if the browser that serves the ad does not support them. Feature dependencies are features that a browser must be able to support in order to render your HTML5 creative asset correctly. This field is initially auto-generated to contain all features detected by DCM for all the assets of this creative and can then be modified by the client. To reset this field, copy over all the creativeAssets&#39; detected features. Applicable to the following creative types: HTML5_BANNER. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {string} backupImageReportingLabel Reporting label used for HTML5 banner backup image. Applicable to the following creative types: DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {dfareporting(v2.5).TargetWindow} backupImageTargetWindow Target window for backup image. Applicable to the following creative types: FLASH_INPAGE and HTML5_BANNER. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {dfareporting(v2.5).ClickTag[]} clickTags Click tags of the creative. For DISPLAY, FLASH_INPAGE, and HTML5_BANNER creatives, this is a subset of detected click tags for the assets associated with this creative. After creating a flash asset, detected click tags will be returned in the creativeAssetMetadata. When inserting the creative, populate the creative clickTags field using the creativeAssetMetadata.clickTags field. For DISPLAY_IMAGE_GALLERY creatives, there should be exactly one entry in this list for each image creative asset. A click tag is matched with a corresponding creative asset by matching the clickTag.name field with the creativeAsset.assetIdentifier.name field. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY, FLASH_INPAGE, HTML5_BANNER. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {string} commercialId Industry standard ID assigned to creative for reach and frequency. Applicable to the following creative types: all INSTREAM_VIDEO and all VPAID.
* @property {string[]} companionCreatives List of companion creatives assigned to an in-Stream videocreative. Acceptable values include IDs of existing flash and image creatives. Applicable to the following creative types: all INSTREAM_VIDEO and all VPAID.
* @property {string[]} compatibility Compatibilities associated with this creative. This is a read-only field. DISPLAY and DISPLAY_INTERSTITIAL refer to rendering either on desktop or on mobile devices or in mobile apps for regular or interstitial ads, respectively. APP and APP_INTERSTITIAL are for rendering in mobile apps. Only pre-existing creatives may have these compatibilities since new creatives will either be assigned DISPLAY or DISPLAY_INTERSTITIAL instead. IN_STREAM_VIDEO refers to rendering in in-stream video ads developed with the VAST standard. Applicable to all creative types.

Acceptable values are:
- &quot;APP&quot;
- &quot;APP_INTERSTITIAL&quot;
- &quot;IN_STREAM_VIDEO&quot;
- &quot;DISPLAY&quot;
- &quot;DISPLAY_INTERSTITIAL&quot;
* @property {boolean} convertFlashToHtml5 Whether Flash assets associated with the creative need to be automatically converted to HTML5. This flag is enabled by default and users can choose to disable it if they don&#39;t want the system to generate and use HTML5 asset for this creative. Applicable to the following creative type: FLASH_INPAGE. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {dfareporting(v2.5).CreativeCustomEvent[]} counterCustomEvents List of counter events configured for the creative. For DISPLAY_IMAGE_GALLERY creatives, these are read-only and auto-generated from clickTags. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY, all RICH_MEDIA, and all VPAID.
* @property {dfareporting(v2.5).CreativeAsset[]} creativeAssets Assets associated with a creative. Applicable to all but the following creative types: INTERNAL_REDIRECT, INTERSTITIAL_INTERNAL_REDIRECT, and REDIRECT
* @property {dfareporting(v2.5).CreativeFieldAssignment[]} creativeFieldAssignments Creative field assignments for this creative. Applicable to all creative types.
* @property {string[]} customKeyValues Custom key-values for a Rich Media creative. Key-values let you customize the creative settings of a Rich Media ad running on your site without having to contact the advertiser. You can use key-values to dynamically change the look or functionality of a creative. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {dfareporting(v2.5).CreativeCustomEvent[]} exitCustomEvents List of exit events configured for the creative. For DISPLAY and DISPLAY_IMAGE_GALLERY creatives, these are read-only and auto-generated from clickTags, For DISPLAY, an event is also created from the backupImageReportingLabel. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY, all RICH_MEDIA, and all VPAID. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {dfareporting(v2.5).FsCommand} fsCommand OpenWindow FSCommand of this creative. This lets the SWF file communicate with either Flash Player or the program hosting Flash Player, such as a web browser. This is only triggered if allowScriptAccess field is true. Applicable to the following creative types: FLASH_INPAGE.
* @property {string} htmlCode HTML code for the creative. This is a required field when applicable. This field is ignored if htmlCodeLocked is false. Applicable to the following creative types: all CUSTOM, FLASH_INPAGE, and HTML5_BANNER, and all RICH_MEDIA.
* @property {boolean} htmlCodeLocked Whether HTML code is DCM-generated or manually entered. Set to true to ignore changes to htmlCode. Applicable to the following creative types: FLASH_INPAGE and HTML5_BANNER.
* @property {string} id ID of this creative. This is a read-only, auto-generated field. Applicable to all creative types.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this creative. This is a read-only field. Applicable to all creative types.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creative&quot;.
* @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Creative last modification information. This is a read-only field. Applicable to all creative types.
* @property {string} latestTraffickedCreativeId Latest Studio trafficked creative ID associated with rich media and VPAID creatives. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} name Name of the creative. This is a required field and must be less than 256 characters long. Applicable to all creative types.
* @property {string} overrideCss Override CSS value for rich media creatives. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} redirectUrl URL of hosted image or hosted video or another ad tag. For INSTREAM_VIDEO_REDIRECT creatives this is the in-stream video redirect URL. The standard for a VAST (Video Ad Serving Template) ad response allows for a redirect link to another VAST 2.0 or 3.0 call. This is a required field when applicable. Applicable to the following creative types: DISPLAY_REDIRECT, INTERNAL_REDIRECT, INTERSTITIAL_INTERNAL_REDIRECT, and INSTREAM_VIDEO_REDIRECT
* @property {string} renderingId ID of current rendering version. This is a read-only field. Applicable to all creative types.
* @property {dfareporting(v2.5).DimensionValue} renderingIdDimensionValue Dimension value for the rendering ID of this creative. This is a read-only field. Applicable to all creative types.
* @property {string} requiredFlashPluginVersion The minimum required Flash plugin version for this creative. For example, 11.2.202.235. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {integer} requiredFlashVersion The internal Flash version for this creative as calculated by DoubleClick Studio. This is a read-only field. Applicable to the following creative types: FLASH_INPAGE all RICH_MEDIA, and all VPAID. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {dfareporting(v2.5).Size} size Size associated with this creative. When inserting or updating a creative either the size ID field or size width and height fields can be used. This is a required field when applicable; however for IMAGE, FLASH_INPAGE creatives, and for DISPLAY creatives with a primary asset of type HTML_IMAGE, if left blank, this field will be automatically set using the actual size of the associated image assets. Applicable to the following creative types: DISPLAY, DISPLAY_IMAGE_GALLERY, FLASH_INPAGE, HTML5_BANNER, IMAGE, and all RICH_MEDIA.
* @property {boolean} skippable Whether the user can choose to skip the creative. Applicable to the following creative types: all INSTREAM_VIDEO and all VPAID.
* @property {boolean} sslCompliant Whether the creative is SSL-compliant. This is a read-only field. Applicable to all creative types.
* @property {boolean} sslOverride Whether creative should be treated as SSL compliant even if the system scan shows it&#39;s not. Applicable to all creative types.
* @property {string} studioAdvertiserId Studio advertiser ID associated with rich media and VPAID creatives. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} studioCreativeId Studio creative ID associated with rich media and VPAID creatives. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} studioTraffickedCreativeId Studio trafficked creative ID associated with rich media and VPAID creatives. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} subaccountId Subaccount ID of this creative. This field, if left unset, will be auto-generated for both insert and update operations. Applicable to all creative types.
* @property {string} thirdPartyBackupImageImpressionsUrl Third-party URL used to record backup image impressions. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} thirdPartyRichMediaImpressionsUrl Third-party URL used to record rich media impressions. Applicable to the following creative types: all RICH_MEDIA.
* @property {dfareporting(v2.5).ThirdPartyTrackingUrl[]} thirdPartyUrls Third-party URLs for tracking in-stream video creative events. Applicable to the following creative types: all INSTREAM_VIDEO and all VPAID.
* @property {dfareporting(v2.5).CreativeCustomEvent[]} timerCustomEvents List of timer events configured for the creative. For DISPLAY_IMAGE_GALLERY creatives, these are read-only and auto-generated from clickTags. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY, all RICH_MEDIA, and all VPAID. Applicable to DISPLAY when the primary asset is not HTML_IMAGE.
* @property {string} totalFileSize Combined size of all creative assets. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA, and all VPAID.
* @property {string} type Type of this creative.This is a required field. Applicable to all creative types.
* @property {integer} version The version number helps you keep track of multiple versions of your creative in your reports. The version number will always be auto-generated during insert operations to start at 1. For tracking creatives the version cannot be incremented and will always remain at 1. For all other creative types the version can be incremented only by 1 during update operations. In addition, the version will be automatically incremented by 1 when undergoing Rich Media creative merging. Applicable to all creative types.
* @property {string} videoDescription Description of the video ad. Applicable to the following creative types: all INSTREAM_VIDEO and all VPAID.
* @property {number} videoDuration Creative video duration in seconds. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO, all RICH_MEDIA, and all VPAID.
*/
/**
 * @typedef CreativeAsset
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {boolean} actionScript3 Whether ActionScript3 is enabled for the flash asset. This is a read-only field. Applicable to the following creative type: FLASH_INPAGE. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {boolean} active Whether the video asset is active. This is a read-only field for VPAID_NON_LINEAR_VIDEO assets. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {string} alignment Possible alignments for an asset. This is a read-only field. Applicable to the following creative types: RICH_MEDIA_DISPLAY_MULTI_FLOATING_INTERSTITIAL.
* @property {string} artworkType Artwork type of rich media creative. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.
* @property {dfareporting(v2.5).CreativeAssetId} assetIdentifier Identifier of this asset. This is the same identifier returned during creative asset insert operation. This is a required field. Applicable to all but the following creative types: all REDIRECT and TRACKING_TEXT.
* @property {dfareporting(v2.5).CreativeCustomEvent} backupImageExit Exit event configured for the backup image. Applicable to the following creative types: all RICH_MEDIA.
* @property {integer} bitRate Detected bit-rate for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {string} childAssetType Rich media child asset type. This is a read-only field. Applicable to the following creative types: all VPAID.
* @property {dfareporting(v2.5).Size} collapsedSize Size of an asset when collapsed. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA and all VPAID. Additionally, applicable to assets whose displayType is ASSET_DISPLAY_TYPE_EXPANDING or ASSET_DISPLAY_TYPE_PEEL_DOWN.
* @property {integer} customStartTimeValue Custom start time in seconds for making the asset visible. Applicable to the following creative types: all RICH_MEDIA.
* @property {string[]} detectedFeatures List of feature dependencies for the creative asset that are detected by DCM. Feature dependencies are features that a browser must be able to support in order to render your HTML5 creative correctly. This is a read-only, auto-generated field. Applicable to the following creative types: HTML5_BANNER. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {string} displayType Type of rich media asset. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.
* @property {integer} duration Duration in seconds for which an asset will be displayed. Applicable to the following creative types: INSTREAM_VIDEO and VPAID_LINEAR_VIDEO.
* @property {string} durationType Duration type for which an asset will be displayed. Applicable to the following creative types: all RICH_MEDIA.
* @property {dfareporting(v2.5).Size} expandedDimension Detected expanded dimension for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {string} fileSize File size associated with this creative asset. This is a read-only field. Applicable to all but the following creative types: all REDIRECT and TRACKING_TEXT.
* @property {integer} flashVersion Flash version of the asset. This is a read-only field. Applicable to the following creative types: FLASH_INPAGE, all RICH_MEDIA, and all VPAID. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {boolean} hideFlashObjects Whether to hide Flash objects flag for an asset. Applicable to the following creative types: all RICH_MEDIA.
* @property {boolean} hideSelectionBoxes Whether to hide selection boxes flag for an asset. Applicable to the following creative types: all RICH_MEDIA.
* @property {boolean} horizontallyLocked Whether the asset is horizontally locked. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} id Numeric ID of this creative asset. This is a required field and should not be modified. Applicable to all but the following creative types: all REDIRECT and TRACKING_TEXT.
* @property {string} mimeType Detected MIME type for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {dfareporting(v2.5).OffsetPosition} offset Offset position for an asset in collapsed mode. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA and all VPAID. Additionally, only applicable to assets whose displayType is ASSET_DISPLAY_TYPE_EXPANDING or ASSET_DISPLAY_TYPE_PEEL_DOWN.
* @property {boolean} originalBackup Whether the backup asset is original or changed by the user in DCM. Applicable to the following creative types: all RICH_MEDIA.
* @property {dfareporting(v2.5).OffsetPosition} position Offset position for an asset. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} positionLeftUnit Offset left unit for an asset. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} positionTopUnit Offset top unit for an asset. This is a read-only field if the asset displayType is ASSET_DISPLAY_TYPE_OVERLAY. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} progressiveServingUrl Progressive URL for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {boolean} pushdown Whether the asset pushes down other content. Applicable to the following creative types: all RICH_MEDIA. Additionally, only applicable when the asset offsets are 0, the collapsedSize.width matches size.width, and the collapsedSize.height is less than size.height.
* @property {number} pushdownDuration Pushdown duration in seconds for an asset. Must be between 0 and 9.99. Applicable to the following creative types: all RICH_MEDIA.Additionally, only applicable when the asset pushdown field is true, the offsets are 0, the collapsedSize.width matches size.width, and the collapsedSize.height is less than size.height.
* @property {string} role Role of the asset in relation to creative. Applicable to all but the following creative types: all REDIRECT and TRACKING_TEXT. This is a required field.
PRIMARY applies to DISPLAY, FLASH_INPAGE, HTML5_BANNER, IMAGE, DISPLAY_IMAGE_GALLERY, all RICH_MEDIA (which may contain multiple primary assets), and all VPAID creatives.
BACKUP_IMAGE applies to FLASH_INPAGE, HTML5_BANNER, all RICH_MEDIA, and all VPAID creatives. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
ADDITIONAL_IMAGE and ADDITIONAL_FLASH apply to FLASH_INPAGE creatives.
OTHER refers to assets from sources other than DCM, such as Studio uploaded assets, applicable to all RICH_MEDIA and all VPAID creatives.
PARENT_VIDEO refers to videos uploaded by the user in DCM and is applicable to INSTREAM_VIDEO and VPAID_LINEAR_VIDEO creatives.
TRANSCODED_VIDEO refers to videos transcoded by DCM from PARENT_VIDEO assets and is applicable to INSTREAM_VIDEO and VPAID_LINEAR_VIDEO creatives.
ALTERNATE_VIDEO refers to the DCM representation of child asset videos from Studio, and is applicable to VPAID_LINEAR_VIDEO creatives. These cannot be added or removed within DCM.
For VPAID_LINEAR_VIDEO creatives, PARENT_VIDEO, TRANSCODED_VIDEO and ALTERNATE_VIDEO assets that are marked active serve as backup in case the VPAID creative cannot be served. Only PARENT_VIDEO assets can be added or removed for an INSTREAM_VIDEO or VPAID_LINEAR_VIDEO creative.
* @property {dfareporting(v2.5).Size} size Size associated with this creative asset. This is a required field when applicable; however for IMAGE and FLASH_INPAGE, creatives if left blank, this field will be automatically set using the actual size of the associated image asset. Applicable to the following creative types: DISPLAY_IMAGE_GALLERY, FLASH_INPAGE, HTML5_BANNER, IMAGE, and all RICH_MEDIA. Applicable to DISPLAY when the primary asset type is not HTML_IMAGE.
* @property {boolean} sslCompliant Whether the asset is SSL-compliant. This is a read-only field. Applicable to all but the following creative types: all REDIRECT and TRACKING_TEXT.
* @property {string} startTimeType Initial wait time type before making the asset visible. Applicable to the following creative types: all RICH_MEDIA.
* @property {string} streamingServingUrl Streaming URL for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {boolean} transparency Whether the asset is transparent. Applicable to the following creative types: all RICH_MEDIA. Additionally, only applicable to HTML5 assets.
* @property {boolean} verticallyLocked Whether the asset is vertically locked. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.
* @property {number} videoDuration Detected video duration for video asset. This is a read-only field. Applicable to the following creative types: INSTREAM_VIDEO and all VPAID.
* @property {string} windowMode Window mode options for flash assets. Applicable to the following creative types: FLASH_INPAGE, RICH_MEDIA_DISPLAY_EXPANDING, RICH_MEDIA_IM_EXPAND, RICH_MEDIA_DISPLAY_BANNER, and RICH_MEDIA_INPAGE_FLOATING.
* @property {integer} zIndex zIndex value of an asset. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA.Additionally, only applicable to assets whose displayType is NOT one of the following types: ASSET_DISPLAY_TYPE_INPAGE or ASSET_DISPLAY_TYPE_OVERLAY.
* @property {string} zipFilename File name of zip file. This is a read-only field. Applicable to the following creative types: HTML5_BANNER.
* @property {string} zipFilesize Size of zip file. This is a read-only field. Applicable to the following creative types: HTML5_BANNER.
*/
/**
 * @typedef CreativeAssetId
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} name Name of the creative asset. This is a required field while inserting an asset. After insertion, this assetIdentifier is used to identify the uploaded asset. Characters in the name must be alphanumeric or one of the following: &quot;.-_ &quot;. Spaces are allowed.
 * @property {string} type Type of asset to upload. This is a required field. IMAGE is solely used for IMAGE creatives. Other image assets should use HTML_IMAGE.
 */
/**
 * @typedef CreativeAssetMetadata
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {dfareporting(v2.5).CreativeAssetId} assetIdentifier ID of the creative asset. This is a required field.
* @property {dfareporting(v2.5).ClickTag[]} clickTags List of detected click tags for assets. This is a read-only auto-generated field.
* @property {string[]} detectedFeatures List of feature dependencies for the creative asset that are detected by DCM. Feature dependencies are features that a browser must be able to support in order to render your HTML5 creative correctly. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeAssetMetadata&quot;.
* @property {string[]} warnedValidationRules Rules validated during code generation that generated a warning. This is a read-only, auto-generated field.

Possible values are:
- &quot;ADMOB_REFERENCED&quot;
- &quot;ASSET_FORMAT_UNSUPPORTED_DCM&quot;
- &quot;ASSET_INVALID&quot;
- &quot;CLICK_TAG_HARD_CODED&quot;
- &quot;CLICK_TAG_INVALID&quot;
- &quot;CLICK_TAG_IN_GWD&quot;
- &quot;CLICK_TAG_MISSING&quot;
- &quot;CLICK_TAG_MORE_THAN_ONE&quot;
- &quot;CLICK_TAG_NON_TOP_LEVEL&quot;
- &quot;COMPONENT_UNSUPPORTED_DCM&quot;
- &quot;ENABLER_UNSUPPORTED_METHOD_DCM&quot;
- &quot;EXTERNAL_FILE_REFERENCED&quot;
- &quot;FILE_DETAIL_EMPTY&quot;
- &quot;FILE_TYPE_INVALID&quot;
- &quot;GWD_PROPERTIES_INVALID&quot;
- &quot;HTML5_FEATURE_UNSUPPORTED&quot;
- &quot;LINKED_FILE_NOT_FOUND&quot;
- &quot;MAX_FLASH_VERSION_11&quot;
- &quot;MRAID_REFERENCED&quot;
- &quot;NOT_SSL_COMPLIANT&quot;
- &quot;ORPHANED_ASSET&quot;
- &quot;PRIMARY_HTML_MISSING&quot;
- &quot;SVG_INVALID&quot;
- &quot;ZIP_INVALID&quot;
*/
/**
 * @typedef CreativeAssignment
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {boolean} active Whether this creative assignment is active. When true, the creative will be included in the ad&#39;s rotation.
* @property {boolean} applyEventTags Whether applicable event tags should fire when this creative assignment is rendered. If this value is unset when the ad is inserted or updated, it will default to true for all creative types EXCEPT for INTERNAL_REDIRECT, INTERSTITIAL_INTERNAL_REDIRECT, and INSTREAM_VIDEO.
* @property {dfareporting(v2.5).ClickThroughUrl} clickThroughUrl Click-through URL of the creative assignment.
* @property {dfareporting(v2.5).CompanionClickThroughOverride[]} companionCreativeOverrides Companion creative overrides for this creative assignment. Applicable to video ads.
* @property {dfareporting(v2.5).CreativeGroupAssignment[]} creativeGroupAssignments Creative group assignments for this creative assignment. Only one assignment per creative group number is allowed for a maximum of two assignments.
* @property {string} creativeId ID of the creative to be assigned. This is a required field.
* @property {dfareporting(v2.5).DimensionValue} creativeIdDimensionValue Dimension value for the ID of the creative. This is a read-only, auto-generated field.
* @property {string} endTime Date and time that the assigned creative should stop serving. Must be later than the start time.
* @property {dfareporting(v2.5).RichMediaExitOverride[]} richMediaExitOverrides Rich media exit overrides for this creative assignment.
Applicable when the creative type is any of the following: 
- RICH_MEDIA_INPAGE
- RICH_MEDIA_INPAGE_FLOATING
- RICH_MEDIA_IM_EXPAND
- RICH_MEDIA_EXPANDING
- RICH_MEDIA_INTERSTITIAL_FLOAT
- RICH_MEDIA_MOBILE_IN_APP
- RICH_MEDIA_MULTI_FLOATING
- RICH_MEDIA_PEEL_DOWN
- ADVANCED_BANNER
- VPAID_LINEAR
- VPAID_NON_LINEAR
* @property {integer} sequence Sequence number of the creative assignment, applicable when the rotation type is CREATIVE_ROTATION_TYPE_SEQUENTIAL.
* @property {boolean} sslCompliant Whether the creative to be assigned is SSL-compliant. This is a read-only field that is auto-generated when the ad is inserted or updated.
* @property {string} startTime Date and time that the assigned creative should start serving.
* @property {integer} weight Weight of the creative assignment, applicable when the rotation type is CREATIVE_ROTATION_TYPE_RANDOM.
*/
/**
 * @typedef CreativeCustomEvent
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} advertiserCustomEventId Unique ID of this event used by DDM Reporting and Data Transfer. This is a read-only field.
 * @property {string} advertiserCustomEventName User-entered name for the event.
 * @property {string} advertiserCustomEventType Type of the event. This is a read-only field.
 * @property {string} artworkLabel Artwork label column, used to link events in DCM back to events in Studio. This is a required field and should not be modified after insertion.
 * @property {string} artworkType Artwork type used by the creative.This is a read-only field.
 * @property {string} exitUrl Exit URL of the event. This field is used only for exit events.
 * @property {string} id ID of this event. This is a required field and should not be modified after insertion.
 * @property {dfareporting(v2.5).PopupWindowProperties} popupWindowProperties Properties for rich media popup windows. This field is used only for exit events.
 * @property {string} targetType Target type used by the event.
 * @property {string} videoReportingId Video reporting ID, used to differentiate multiple videos in a single creative. This is a read-only field.
 */
/**
 * @typedef CreativeField
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this creative field. This is a read-only field that can be left blank.
 * @property {string} advertiserId Advertiser ID of this creative field. This is a required field on insertion.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {string} id ID of this creative field. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeField&quot;.
 * @property {string} name Name of this creative field. This is a required field and must be less than 256 characters long and unique among creative fields of the same advertiser.
 * @property {string} subaccountId Subaccount ID of this creative field. This is a read-only field that can be left blank.
 */
/**
 * @typedef CreativeFieldAssignment
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} creativeFieldId ID of the creative field.
 * @property {string} creativeFieldValueId ID of the creative field value.
 */
/**
 * @typedef CreativeFieldValue
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this creative field value. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeFieldValue&quot;.
 * @property {string} value Value of this creative field value. It needs to be less than 256 characters in length and unique per creative field.
 */
/**
 * @typedef CreativeFieldValuesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CreativeFieldValue[]} creativeFieldValues Creative field value collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeFieldValuesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CreativeFieldsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CreativeField[]} creativeFields Creative field collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeFieldsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CreativeGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this creative group. This is a read-only field that can be left blank.
* @property {string} advertiserId Advertiser ID of this creative group. This is a required field on insertion.
* @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
* @property {integer} groupNumber Subgroup of the creative group. Assign your creative groups to one of the following subgroups in order to filter or manage them more easily. This field is required on insertion and is read-only after insertion.
Acceptable values are: 
- 1
- 2
* @property {string} id ID of this creative group. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeGroup&quot;.
* @property {string} name Name of this creative group. This is a required field and must be less than 256 characters long and unique among creative groups of the same advertiser.
* @property {string} subaccountId Subaccount ID of this creative group. This is a read-only field that can be left blank.
*/
/**
 * @typedef CreativeGroupAssignment
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} creativeGroupId ID of the creative group to be assigned.
 * @property {string} creativeGroupNumber Creative group number of the creative group assignment.
 */
/**
 * @typedef CreativeGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CreativeGroup[]} creativeGroups Creative group collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativeGroupsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CreativeOptimizationConfiguration
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this creative optimization config. This field is auto-generated when the campaign is inserted or updated. It can be null for existing campaigns.
 * @property {string} name Name of this creative optimization config. This is a required field and must be less than 129 characters long.
 * @property {dfareporting(v2.5).OptimizationActivity[]} optimizationActivitys List of optimization activities associated with this configuration.
 * @property {string} optimizationModel Optimization model for this configuration.
 */
/**
 * @typedef CreativeRotation
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).CreativeAssignment[]} creativeAssignments Creative assignments in this creative rotation.
 * @property {string} creativeOptimizationConfigurationId Creative optimization configuration that is used by this ad. It should refer to one of the existing optimization configurations in the ad&#39;s campaign. If it is unset or set to 0, then the campaign&#39;s default optimization configuration will be used for this ad.
 * @property {string} type Type of creative rotation. Can be used to specify whether to use sequential or random rotation.
 * @property {string} weightCalculationStrategy Strategy for calculating weights. Used with CREATIVE_ROTATION_TYPE_RANDOM.
 */
/**
 * @typedef CreativeSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} iFrameFooter Header text for iFrames for this site. Must be less than or equal to 2000 characters long.
 * @property {string} iFrameHeader Header text for iFrames for this site. Must be less than or equal to 2000 characters long.
 */
/**
 * @typedef CreativesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Creative[]} creatives Creative collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#creativesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef CrossDimensionReachReportCompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Dimension[]} breakdown Dimensions which are compatible to be selected in the &quot;breakdown&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} dimensionFilters Dimensions which are compatible to be selected in the &quot;dimensionFilters&quot; section of the report.
 * @property {string} kind The kind of resource this is, in this case dfareporting#crossDimensionReachReportCompatibleFields.
 * @property {dfareporting(v2.5).Metric[]} metrics Metrics which are compatible to be selected in the &quot;metricNames&quot; section of the report.
 * @property {dfareporting(v2.5).Metric[]} overlapMetrics Metrics which are compatible to be selected in the &quot;overlapMetricNames&quot; section of the report.
 */
/**
 * @typedef CustomFloodlightVariable
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#customFloodlightVariable&quot;.
 * @property {string} type The type of custom floodlight variable to supply a value for. These map to the &quot;u[1-20]=&quot; in the tags.
 * @property {string} value The value of the custom floodlight variable. The length of string must not exceed 50 characters.
 */
/**
 * @typedef CustomRichMediaEvents
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DimensionValue[]} filteredEventIds List of custom rich media event IDs. Dimension values must be all of type dfa:richMediaEventTypeIdAndName.
 * @property {string} kind The kind of resource this is, in this case dfareporting#customRichMediaEvents.
 */
/**
 * @typedef DateRange
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} endDate The end date of the date range, inclusive. A string of the format: &quot;yyyy-MM-dd&quot;.
 * @property {string} kind The kind of resource this is, in this case dfareporting#dateRange.
 * @property {string} relativeDateRange The date range relative to the date of when the report is run.
 * @property {string} startDate The start date of the date range, inclusive. A string of the format: &quot;yyyy-MM-dd&quot;.
 */
/**
 * @typedef DayPartTargeting
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string[]} daysOfWeek Days of the week when the ad will serve.

Acceptable values are:
- &quot;SUNDAY&quot;
- &quot;MONDAY&quot;
- &quot;TUESDAY&quot;
- &quot;WEDNESDAY&quot;
- &quot;THURSDAY&quot;
- &quot;FRIDAY&quot;
- &quot;SATURDAY&quot;
* @property {integer[]} hoursOfDay Hours of the day when the ad will serve. Must be an integer between 0 and 23 (inclusive), where 0 is midnight to 1 AM, and 23 is 11 PM to midnight. Can be specified with days of week, in which case the ad would serve during these hours on the specified days. For example, if Monday, Wednesday, Friday are the days of week specified and 9-10am, 3-5pm (hours 9, 15, and 16) is specified, the ad would serve Monday, Wednesdays, and Fridays at 9-10am and 3-5pm.
* @property {boolean} userLocalTime Whether or not to use the user&#39;s local time. If false, the America/New York time zone applies.
*/
/**
 * @typedef DefaultClickThroughEventTagProperties
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} defaultClickThroughEventTagId ID of the click-through event tag to apply to all ads in this entity&#39;s scope.
 * @property {boolean} overrideInheritedEventTag Whether this entity should override the inherited default click-through event tag with its own defined value.
 */
/**
 * @typedef DeliverySchedule
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).FrequencyCap} frequencyCap Limit on the number of times an individual user can be served the ad within a specified period of time.
 * @property {boolean} hardCutoff Whether or not hard cutoff is enabled. If true, the ad will not serve after the end date and time. Otherwise the ad will continue to be served until it has reached its delivery goals.
 * @property {string} impressionRatio Impression ratio for this ad. This ratio determines how often each ad is served relative to the others. For example, if ad A has an impression ratio of 1 and ad B has an impression ratio of 3, then DCM will serve ad B three times as often as ad A. Must be between 1 and 10.
 * @property {string} priority Serving priority of an ad, with respect to other ads. The lower the priority number, the greater the priority with which it is served.
 */
/**
 * @typedef DfpSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dfp_network_code DFP network code for this directory site.
 * @property {string} dfp_network_name DFP network name for this directory site.
 * @property {boolean} programmaticPlacementAccepted Whether this directory site accepts programmatic placements.
 * @property {boolean} pubPaidPlacementAccepted Whether this directory site accepts publisher-paid tags.
 * @property {boolean} publisherPortalOnly Whether this directory site is available only via DoubleClick Publisher Portal.
 */
/**
 * @typedef Dimension
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind The kind of resource this is, in this case dfareporting#dimension.
 * @property {string} name The dimension name, e.g. dfa:advertiser
 */
/**
 * @typedef DimensionFilter
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dimensionName The name of the dimension to filter.
 * @property {string} kind The kind of resource this is, in this case dfareporting#dimensionFilter.
 * @property {string} value The value of the dimension to filter.
 */
/**
 * @typedef DimensionValue
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dimensionName The name of the dimension.
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {string} id The ID associated with the value if available.
 * @property {string} kind The kind of resource this is, in this case dfareporting#dimensionValue.
 * @property {string} matchType Determines how the &#39;value&#39; field is matched when filtering. If not specified, defaults to EXACT. If set to WILDCARD_EXPRESSION, &#39;*&#39; is allowed as a placeholder for variable length character sequences, and it can be escaped with a backslash. Note, only paid search dimensions (&#39;dfa:paidSearch*&#39;) allow a matchType other than EXACT.
 * @property {string} value The value of the dimension.
 */
/**
 * @typedef DimensionValueList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {dfareporting(v2.5).DimensionValue[]} items The dimension values returned in this response.
 * @property {string} kind The kind of list this is, in this case dfareporting#dimensionValueList.
 * @property {string} nextPageToken Continuation token used to page through dimension values. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; to the value of this field. The page token is only valid for a limited amount of time and should not be persisted.
 */
/**
 * @typedef DimensionValueRequest
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dimensionName The name of the dimension for which values should be requested.
 * @property {string} endDate The end date of the date range for which to retrieve dimension values. A string of the format &quot;yyyy-MM-dd&quot;.
 * @property {dfareporting(v2.5).DimensionFilter[]} filters The list of filters by which to filter values. The filters are ANDed.
 * @property {string} kind The kind of request this is, in this case dfareporting#dimensionValueRequest.
 * @property {string} startDate The start date of the date range for which to retrieve dimension values. A string of the format &quot;yyyy-MM-dd&quot;.
 */
/**
 * @typedef DirectorySite
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {boolean} active Whether this directory site is active.
* @property {dfareporting(v2.5).DirectorySiteContactAssignment[]} contactAssignments Directory site contacts.
* @property {string} countryId Country ID of this directory site.
* @property {string} currencyId Currency ID of this directory site.
Possible values are: 
- &quot;1&quot; for USD 
- &quot;2&quot; for GBP 
- &quot;3&quot; for ESP 
- &quot;4&quot; for SEK 
- &quot;5&quot; for CAD 
- &quot;6&quot; for JPY 
- &quot;7&quot; for DEM 
- &quot;8&quot; for AUD 
- &quot;9&quot; for FRF 
- &quot;10&quot; for ITL 
- &quot;11&quot; for DKK 
- &quot;12&quot; for NOK 
- &quot;13&quot; for FIM 
- &quot;14&quot; for ZAR 
- &quot;15&quot; for IEP 
- &quot;16&quot; for NLG 
- &quot;17&quot; for EUR 
- &quot;18&quot; for KRW 
- &quot;19&quot; for TWD 
- &quot;20&quot; for SGD 
- &quot;21&quot; for CNY 
- &quot;22&quot; for HKD 
- &quot;23&quot; for NZD 
- &quot;24&quot; for MYR 
- &quot;25&quot; for BRL 
- &quot;26&quot; for PTE 
- &quot;27&quot; for MXP 
- &quot;28&quot; for CLP 
- &quot;29&quot; for TRY 
- &quot;30&quot; for ARS 
- &quot;31&quot; for PEN 
- &quot;32&quot; for ILS 
- &quot;33&quot; for CHF 
- &quot;34&quot; for VEF 
- &quot;35&quot; for COP 
- &quot;36&quot; for GTQ 
- &quot;37&quot; for PLN 
- &quot;39&quot; for INR 
- &quot;40&quot; for THB 
- &quot;41&quot; for IDR 
- &quot;42&quot; for CZK 
- &quot;43&quot; for RON 
- &quot;44&quot; for HUF 
- &quot;45&quot; for RUB 
- &quot;46&quot; for AED 
- &quot;47&quot; for BGN 
- &quot;48&quot; for HRK
* @property {string} description Description of this directory site.
* @property {string} id ID of this directory site. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this directory site. This is a read-only, auto-generated field.
* @property {string[]} inpageTagFormats Tag types for regular placements.

Acceptable values are:
- &quot;STANDARD&quot;
- &quot;IFRAME_JAVASCRIPT_INPAGE&quot;
- &quot;INTERNAL_REDIRECT_INPAGE&quot;
- &quot;JAVASCRIPT_INPAGE&quot;
* @property {string[]} interstitialTagFormats Tag types for interstitial placements.

Acceptable values are:
- &quot;IFRAME_JAVASCRIPT_INTERSTITIAL&quot;
- &quot;INTERNAL_REDIRECT_INTERSTITIAL&quot;
- &quot;JAVASCRIPT_INTERSTITIAL&quot;
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#directorySite&quot;.
* @property {string} name Name of this directory site.
* @property {string} parentId Parent directory site ID.
* @property {dfareporting(v2.5).DirectorySiteSettings} settings Directory site settings.
* @property {string} url URL of this directory site.
*/
/**
 * @typedef DirectorySiteContact
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} address Address of this directory site contact.
 * @property {string} email Email address of this directory site contact.
 * @property {string} firstName First name of this directory site contact.
 * @property {string} id ID of this directory site contact. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#directorySiteContact&quot;.
 * @property {string} lastName Last name of this directory site contact.
 * @property {string} phone Phone number of this directory site contact.
 * @property {string} role Directory site contact role.
 * @property {string} title Title or designation of this directory site contact.
 * @property {string} type Directory site contact type.
 */
/**
 * @typedef DirectorySiteContactAssignment
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} contactId ID of this directory site contact. This is a read-only, auto-generated field.
 * @property {string} visibility Visibility of this directory site contact assignment. When set to PUBLIC this contact assignment is visible to all account and agency users; when set to PRIVATE it is visible only to the site.
 */
/**
 * @typedef DirectorySiteContactsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DirectorySiteContact[]} directorySiteContacts Directory site contact collection
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#directorySiteContactsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef DirectorySiteSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} activeViewOptOut Whether this directory site has disabled active view creatives.
 * @property {dfareporting(v2.5).DfpSettings} dfp_settings Directory site DFP settings.
 * @property {boolean} instream_video_placement_accepted Whether this site accepts in-stream video ads.
 * @property {boolean} interstitialPlacementAccepted Whether this site accepts interstitial ads.
 * @property {boolean} nielsenOcrOptOut Whether this directory site has disabled Nielsen OCR reach ratings.
 * @property {boolean} verificationTagOptOut Whether this directory site has disabled generation of Verification ins tags.
 * @property {boolean} videoActiveViewOptOut Whether this directory site has disabled active view for in-stream video creatives.
 */
/**
 * @typedef DirectorySitesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DirectorySite[]} directorySites Directory site collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#directorySitesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef DynamicTargetingKey
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#dynamicTargetingKey&quot;.
 * @property {string} name Name of this dynamic targeting key. This is a required field. Must be less than 256 characters long and cannot contain commas. All characters are converted to lowercase.
 * @property {string} objectId ID of the object of this dynamic targeting key. This is a required field.
 * @property {string} objectType Type of the object of this dynamic targeting key. This is a required field.
 */
/**
 * @typedef DynamicTargetingKeysListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DynamicTargetingKey[]} dynamicTargetingKeys Dynamic targeting key collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#dynamicTargetingKeysListResponse&quot;.
 */
/**
 * @typedef EncryptionInfo
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} encryptionEntityId The encryption entity ID. This should match the encryption configuration for ad serving or Data Transfer.
 * @property {string} encryptionEntityType The encryption entity type. This should match the encryption configuration for ad serving or Data Transfer.
 * @property {string} encryptionSource Describes whether the encrypted cookie was received from ad serving (the %m macro) or from Data Transfer.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#encryptionInfo&quot;.
 */
/**
 * @typedef EventTag
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this event tag. This is a read-only field that can be left blank.
 * @property {string} advertiserId Advertiser ID of this event tag. This field or the campaignId field is required on insertion.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {string} campaignId Campaign ID of this event tag. This field or the advertiserId field is required on insertion.
 * @property {dfareporting(v2.5).DimensionValue} campaignIdDimensionValue Dimension value for the ID of the campaign. This is a read-only, auto-generated field.
 * @property {boolean} enabledByDefault Whether this event tag should be automatically enabled for all of the advertiser&#39;s campaigns and ads.
 * @property {boolean} excludeFromAdxRequests Whether to remove this event tag from ads that are trafficked through DoubleClick Bid Manager to Ad Exchange. This may be useful if the event tag uses a pixel that is unapproved for Ad Exchange bids on one or more networks, such as the Google Display Network.
 * @property {string} id ID of this event tag. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#eventTag&quot;.
 * @property {string} name Name of this event tag. This is a required field and must be less than 256 characters long.
 * @property {string} siteFilterType Site filter type for this event tag. If no type is specified then the event tag will be applied to all sites.
 * @property {string[]} siteIds Filter list of site IDs associated with this event tag. The siteFilterType determines whether this is a whitelist or blacklist filter.
 * @property {boolean} sslCompliant Whether this tag is SSL-compliant or not. This is a read-only field.
 * @property {string} status Status of this event tag. Must be ENABLED for this event tag to fire. This is a required field.
 * @property {string} subaccountId Subaccount ID of this event tag. This is a read-only field that can be left blank.
 * @property {string} type Event tag type. Can be used to specify whether to use a third-party pixel, a third-party JavaScript URL, or a third-party click-through URL for either impression or click tracking. This is a required field.
 * @property {string} url Payload URL for this event tag. The URL on a click-through event tag should have a landing page URL appended to the end of it. This field is required on insertion.
 * @property {integer} urlEscapeLevels Number of times the landing page URL should be URL-escaped before being appended to the click-through event tag URL. Only applies to click-through event tags as specified by the event tag type.
 */
/**
 * @typedef EventTagOverride
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} enabled Whether this override is enabled.
 * @property {string} id ID of this event tag override. This is a read-only, auto-generated field.
 */
/**
 * @typedef EventTagsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).EventTag[]} eventTags Event tag collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#eventTagsListResponse&quot;.
 */
/**
 * @typedef File
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).DateRange} dateRange The date range for which the file has report data. The date range will always be the absolute date range for which the report is run.
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {string} fileName The filename of the file.
 * @property {string} format The output format of the report. Only available once the file is available.
 * @property {string} id The unique ID of this report file.
 * @property {string} kind The kind of resource this is, in this case dfareporting#file.
 * @property {string} lastModifiedTime The timestamp in milliseconds since epoch when this file was last modified.
 * @property {string} reportId The ID of the report this file was generated from.
 * @property {string} status The status of the report file.
 * @property {object} urls The URLs where the completed report file can be downloaded.
 */
/**
 * @typedef FileList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {dfareporting(v2.5).File[]} items The files returned in this response.
 * @property {string} kind The kind of list this is, in this case dfareporting#fileList.
 * @property {string} nextPageToken Continuation token used to page through files. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; to the value of this field. The page token is only valid for a limited amount of time and should not be persisted.
 */
/**
 * @typedef Flight
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} endDate Inventory item flight end date.
 * @property {string} rateOrCost Rate or cost of this flight.
 * @property {string} startDate Inventory item flight start date.
 * @property {string} units Units of this flight.
 */
/**
 * @typedef FloodlightActivitiesGenerateTagResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} floodlightActivityTag Generated tag for this floodlight activity.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightActivitiesGenerateTagResponse&quot;.
 */
/**
 * @typedef FloodlightActivitiesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).FloodlightActivity[]} floodlightActivities Floodlight activity collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightActivitiesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef FloodlightActivity
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this floodlight activity. This is a read-only field that can be left blank.
* @property {string} advertiserId Advertiser ID of this floodlight activity. If this field is left blank, the value will be copied over either from the activity group&#39;s advertiser or the existing activity&#39;s advertiser.
* @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
* @property {string} cacheBustingType Code type used for cache busting in the generated tag.
* @property {string} countingMethod Counting method for conversions for this floodlight activity. This is a required field.
* @property {dfareporting(v2.5).FloodlightActivityDynamicTag[]} defaultTags Dynamic floodlight tags.
* @property {string} expectedUrl URL where this tag will be deployed. If specified, must be less than 256 characters long.
* @property {string} floodlightActivityGroupId Floodlight activity group ID of this floodlight activity. This is a required field.
* @property {string} floodlightActivityGroupName Name of the associated floodlight activity group. This is a read-only field.
* @property {string} floodlightActivityGroupTagString Tag string of the associated floodlight activity group. This is a read-only field.
* @property {string} floodlightActivityGroupType Type of the associated floodlight activity group. This is a read-only field.
* @property {string} floodlightConfigurationId Floodlight configuration ID of this floodlight activity. If this field is left blank, the value will be copied over either from the activity group&#39;s floodlight configuration or from the existing activity&#39;s floodlight configuration.
* @property {dfareporting(v2.5).DimensionValue} floodlightConfigurationIdDimensionValue Dimension value for the ID of the floodlight configuration. This is a read-only, auto-generated field.
* @property {boolean} hidden Whether this activity is archived.
* @property {string} id ID of this floodlight activity. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this floodlight activity. This is a read-only, auto-generated field.
* @property {boolean} imageTagEnabled Whether the image tag is enabled for this activity.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightActivity&quot;.
* @property {string} name Name of this floodlight activity. This is a required field. Must be less than 129 characters long and cannot contain quotes.
* @property {string} notes General notes or implementation instructions for the tag.
* @property {dfareporting(v2.5).FloodlightActivityPublisherDynamicTag[]} publisherTags Publisher dynamic floodlight tags.
* @property {boolean} secure Whether this tag should use SSL.
* @property {boolean} sslCompliant Whether the floodlight activity is SSL-compliant. This is a read-only field, its value detected by the system from the floodlight tags.
* @property {boolean} sslRequired Whether this floodlight activity must be SSL-compliant.
* @property {string} subaccountId Subaccount ID of this floodlight activity. This is a read-only field that can be left blank.
* @property {string} tagFormat Tag format type for the floodlight activity. If left blank, the tag format will default to HTML.
* @property {string} tagString Value of the cat= paramter in the floodlight tag, which the ad servers use to identify the activity. This is optional: if empty, a new tag string will be generated for you. This string must be 1 to 8 characters long, with valid characters being [a-z][A-Z][0-9][-][ _ ]. This tag string must also be unique among activities of the same activity group. This field is read-only after insertion.
* @property {string[]} userDefinedVariableTypes List of the user-defined variables used by this conversion tag. These map to the &quot;u[1-20]=&quot; in the tags. Each of these can have a user defined type.
Acceptable values are:
- &quot;U1&quot;
- &quot;U2&quot;
- &quot;U3&quot;
- &quot;U4&quot;
- &quot;U5&quot;
- &quot;U6&quot;
- &quot;U7&quot;
- &quot;U8&quot;
- &quot;U9&quot;
- &quot;U10&quot;
- &quot;U11&quot;
- &quot;U12&quot;
- &quot;U13&quot;
- &quot;U14&quot;
- &quot;U15&quot;
- &quot;U16&quot;
- &quot;U17&quot;
- &quot;U18&quot;
- &quot;U19&quot;
- &quot;U20&quot;
*/
/**
 * @typedef FloodlightActivityDynamicTag
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this dynamic tag. This is a read-only, auto-generated field.
 * @property {string} name Name of this tag.
 * @property {string} tag Tag code.
 */
/**
 * @typedef FloodlightActivityGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this floodlight activity group. This is a read-only field that can be left blank.
 * @property {string} advertiserId Advertiser ID of this floodlight activity group. If this field is left blank, the value will be copied over either from the floodlight configuration&#39;s advertiser or from the existing activity group&#39;s advertiser.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {string} floodlightConfigurationId Floodlight configuration ID of this floodlight activity group. This is a required field.
 * @property {dfareporting(v2.5).DimensionValue} floodlightConfigurationIdDimensionValue Dimension value for the ID of the floodlight configuration. This is a read-only, auto-generated field.
 * @property {string} id ID of this floodlight activity group. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this floodlight activity group. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightActivityGroup&quot;.
 * @property {string} name Name of this floodlight activity group. This is a required field. Must be less than 65 characters long and cannot contain quotes.
 * @property {string} subaccountId Subaccount ID of this floodlight activity group. This is a read-only field that can be left blank.
 * @property {string} tagString Value of the type= parameter in the floodlight tag, which the ad servers use to identify the activity group that the activity belongs to. This is optional: if empty, a new tag string will be generated for you. This string must be 1 to 8 characters long, with valid characters being [a-z][A-Z][0-9][-][ _ ]. This tag string must also be unique among activity groups of the same floodlight configuration. This field is read-only after insertion.
 * @property {string} type Type of the floodlight activity group. This is a required field that is read-only after insertion.
 */
/**
 * @typedef FloodlightActivityGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).FloodlightActivityGroup[]} floodlightActivityGroups Floodlight activity group collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightActivityGroupsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef FloodlightActivityPublisherDynamicTag
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} clickThrough Whether this tag is applicable only for click-throughs.
 * @property {string} directorySiteId Directory site ID of this dynamic tag. This is a write-only field that can be used as an alternative to the siteId field. When this resource is retrieved, only the siteId field will be populated.
 * @property {dfareporting(v2.5).FloodlightActivityDynamicTag} dynamicTag Dynamic floodlight tag.
 * @property {string} siteId Site ID of this dynamic tag.
 * @property {dfareporting(v2.5).DimensionValue} siteIdDimensionValue Dimension value for the ID of the site. This is a read-only, auto-generated field.
 * @property {boolean} viewThrough Whether this tag is applicable only for view-throughs.
 */
/**
 * @typedef FloodlightConfiguration
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this floodlight configuration. This is a read-only field that can be left blank.
* @property {string} advertiserId Advertiser ID of the parent advertiser of this floodlight configuration.
* @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
* @property {boolean} analyticsDataSharingEnabled Whether advertiser data is shared with Google Analytics.
* @property {boolean} exposureToConversionEnabled Whether the exposure-to-conversion report is enabled. This report shows detailed pathway information on up to 10 of the most recent ad exposures seen by a user before converting.
* @property {string} firstDayOfWeek Day that will be counted as the first day of the week in reports. This is a required field.
* @property {string} id ID of this floodlight configuration. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this floodlight configuration. This is a read-only, auto-generated field.
* @property {boolean} inAppAttributionTrackingEnabled Whether in-app attribution tracking is enabled.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightConfiguration&quot;.
* @property {dfareporting(v2.5).LookbackConfiguration} lookbackConfiguration Lookback window settings for this floodlight configuration.
* @property {string} naturalSearchConversionAttributionOption Types of attribution options for natural search conversions.
* @property {dfareporting(v2.5).OmnitureSettings} omnitureSettings Settings for DCM Omniture integration.
* @property {string[]} standardVariableTypes List of standard variables enabled for this configuration.

Acceptable values are:
- &quot;ORD&quot;
- &quot;NUM&quot;
* @property {string} subaccountId Subaccount ID of this floodlight configuration. This is a read-only field that can be left blank.
* @property {dfareporting(v2.5).TagSettings} tagSettings Configuration settings for dynamic and image floodlight tags.
* @property {dfareporting(v2.5).ThirdPartyAuthenticationToken[]} thirdPartyAuthenticationTokens List of third-party authentication tokens enabled for this configuration.
* @property {dfareporting(v2.5).UserDefinedVariableConfiguration[]} userDefinedVariableConfigurations List of user defined variables enabled for this configuration.
*/
/**
 * @typedef FloodlightConfigurationsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).FloodlightConfiguration[]} floodlightConfigurations Floodlight configuration collection.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#floodlightConfigurationsListResponse&quot;.
 */
/**
 * @typedef FloodlightReportCompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Dimension[]} dimensionFilters Dimensions which are compatible to be selected in the &quot;dimensionFilters&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} dimensions Dimensions which are compatible to be selected in the &quot;dimensions&quot; section of the report.
 * @property {string} kind The kind of resource this is, in this case dfareporting#floodlightReportCompatibleFields.
 * @property {dfareporting(v2.5).Metric[]} metrics Metrics which are compatible to be selected in the &quot;metricNames&quot; section of the report.
 */
/**
 * @typedef FrequencyCap
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} duration Duration of time, in seconds, for this frequency cap. The maximum duration is 90 days in seconds, or 7,776,000.
 * @property {string} impressions Number of times an individual user can be served the ad within the specified duration. The maximum allowed is 15.
 */
/**
 * @typedef FsCommand
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {integer} left Distance from the left of the browser.Applicable when positionOption is DISTANCE_FROM_TOP_LEFT_CORNER.
 * @property {string} positionOption Position in the browser where the window will open.
 * @property {integer} top Distance from the top of the browser. Applicable when positionOption is DISTANCE_FROM_TOP_LEFT_CORNER.
 * @property {integer} windowHeight Height of the window.
 * @property {integer} windowWidth Width of the window.
 */
/**
 * @typedef GeoTargeting
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).City[]} cities Cities to be targeted. For each city only dartId is required. The other fields are populated automatically when the ad is inserted or updated. If targeting a city, do not target or exclude the country of the city, and do not target the metro or region of the city.
 * @property {dfareporting(v2.5).Country[]} countries Countries to be targeted or excluded from targeting, depending on the setting of the excludeCountries field. For each country only dartId is required. The other fields are populated automatically when the ad is inserted or updated. If targeting or excluding a country, do not target regions, cities, metros, or postal codes in the same country.
 * @property {boolean} excludeCountries Whether or not to exclude the countries in the countries field from targeting. If false, the countries field refers to countries which will be targeted by the ad.
 * @property {dfareporting(v2.5).Metro[]} metros Metros to be targeted. For each metro only dmaId is required. The other fields are populated automatically when the ad is inserted or updated. If targeting a metro, do not target or exclude the country of the metro.
 * @property {dfareporting(v2.5).PostalCode[]} postalCodes Postal codes to be targeted. For each postal code only id is required. The other fields are populated automatically when the ad is inserted or updated. If targeting a postal code, do not target or exclude the country of the postal code.
 * @property {dfareporting(v2.5).Region[]} regions Regions to be targeted. For each region only dartId is required. The other fields are populated automatically when the ad is inserted or updated. If targeting a region, do not target or exclude the country of the region.
 */
/**
 * @typedef InventoryItem
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this inventory item.
 * @property {dfareporting(v2.5).AdSlot[]} adSlots Ad slots of this inventory item. If this inventory item represents a standalone placement, there will be exactly one ad slot. If this inventory item represents a placement group, there will be more than one ad slot, each representing one child placement in that placement group.
 * @property {string} advertiserId Advertiser ID of this inventory item.
 * @property {string} contentCategoryId Content category ID of this inventory item.
 * @property {string} estimatedClickThroughRate Estimated click-through rate of this inventory item.
 * @property {string} estimatedConversionRate Estimated conversion rate of this inventory item.
 * @property {string} id ID of this inventory item.
 * @property {boolean} inPlan Whether this inventory item is in plan.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#inventoryItem&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this inventory item.
 * @property {string} name Name of this inventory item. For standalone inventory items, this is the same name as that of its only ad slot. For group inventory items, this can differ from the name of any of its ad slots.
 * @property {string} negotiationChannelId Negotiation channel ID of this inventory item.
 * @property {string} orderId Order ID of this inventory item.
 * @property {string} placementStrategyId Placement strategy ID of this inventory item.
 * @property {dfareporting(v2.5).Pricing} pricing Pricing of this inventory item.
 * @property {string} projectId Project ID of this inventory item.
 * @property {string} rfpId RFP ID of this inventory item.
 * @property {string} siteId ID of the site this inventory item is associated with.
 * @property {string} subaccountId Subaccount ID of this inventory item.
 * @property {string} type Type of inventory item.
 */
/**
 * @typedef InventoryItemsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).InventoryItem[]} inventoryItems Inventory item collection
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#inventoryItemsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 */
/**
 * @typedef KeyValueTargetingExpression
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} expression Keyword expression being targeted by the ad.
 */
/**
 * @typedef LandingPage
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} default Whether or not this landing page will be assigned to any ads or creatives that do not have a landing page assigned explicitly. Only one default landing page is allowed per campaign.
 * @property {string} id ID of this landing page. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#landingPage&quot;.
 * @property {string} name Name of this landing page. This is a required field. It must be less than 256 characters long, and must be unique among landing pages of the same campaign.
 * @property {string} url URL of this landing page. This is a required field.
 */
/**
 * @typedef LandingPagesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#landingPagesListResponse&quot;.
 * @property {dfareporting(v2.5).LandingPage[]} landingPages Landing page collection
 */
/**
 * @typedef LastModifiedInfo
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} time Timestamp of the last change in milliseconds since epoch.
 */
/**
 * @typedef ListPopulationClause
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).ListPopulationTerm[]} terms Terms of this list population clause. Each clause is made up of list population terms representing constraints and are joined by ORs.
 */
/**
 * @typedef ListPopulationRule
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} floodlightActivityId Floodlight activity ID associated with this rule. This field can be left blank.
 * @property {string} floodlightActivityName Name of floodlight activity associated with this rule. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).ListPopulationClause[]} listPopulationClauses Clauses that make up this list population rule. Clauses are joined by ANDs, and the clauses themselves are made up of list population terms which are joined by ORs.
 */
/**
 * @typedef ListPopulationTerm
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} contains Will be true if the term should check if the user is in the list and false if the term should check if the user is not in the list. This field is only relevant when type is set to LIST_MEMBERSHIP_TERM. False by default.
 * @property {boolean} negation Whether to negate the comparison result of this term during rule evaluation. This field is only relevant when type is left unset or set to CUSTOM_VARIABLE_TERM or REFERRER_TERM.
 * @property {string} operator Comparison operator of this term. This field is only relevant when type is left unset or set to CUSTOM_VARIABLE_TERM or REFERRER_TERM.
 * @property {string} remarketingListId ID of the list in question. This field is only relevant when type is set to LIST_MEMBERSHIP_TERM.
 * @property {string} type List population term type determines the applicable fields in this object. If left unset or set to CUSTOM_VARIABLE_TERM, then variableName, variableFriendlyName, operator, value, and negation are applicable. If set to LIST_MEMBERSHIP_TERM then remarketingListId and contains are applicable. If set to REFERRER_TERM then operator, value, and negation are applicable.
 * @property {string} value Literal to compare the variable to. This field is only relevant when type is left unset or set to CUSTOM_VARIABLE_TERM or REFERRER_TERM.
 * @property {string} variableFriendlyName Friendly name of this term&#39;s variable. This is a read-only, auto-generated field. This field is only relevant when type is left unset or set to CUSTOM_VARIABLE_TERM.
 * @property {string} variableName Name of the variable (U1, U2, etc.) being compared in this term. This field is only relevant when type is set to null, CUSTOM_VARIABLE_TERM or REFERRER_TERM.
 */
/**
 * @typedef ListTargetingExpression
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} expression Expression describing which lists are being targeted by the ad.
 */
/**
 * @typedef LookbackConfiguration
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {integer} clickDuration Lookback window, in days, from the last time a given user clicked on one of your ads. If you enter 0, clicks will not be considered as triggering events for floodlight tracking. If you leave this field blank, the default value for your account will be used.
 * @property {integer} postImpressionActivitiesDuration Lookback window, in days, from the last time a given user viewed one of your ads. If you enter 0, impressions will not be considered as triggering events for floodlight tracking. If you leave this field blank, the default value for your account will be used.
 */
/**
 * @typedef Metric
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind The kind of resource this is, in this case dfareporting#metric.
 * @property {string} name The metric name, e.g. dfa:impressions
 */
/**
 * @typedef Metro
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} countryCode Country code of the country to which this metro region belongs.
 * @property {string} countryDartId DART ID of the country to which this metro region belongs.
 * @property {string} dartId DART ID of this metro region.
 * @property {string} dmaId DMA ID of this metro region. This is the ID used for targeting and generating reports, and is equivalent to metro_code.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#metro&quot;.
 * @property {string} metroCode Metro code of this metro region. This is equivalent to dma_id.
 * @property {string} name Name of this metro region.
 */
/**
 * @typedef MetrosListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#metrosListResponse&quot;.
 * @property {dfareporting(v2.5).Metro[]} metros Metro collection.
 */
/**
 * @typedef MobileCarrier
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} countryCode Country code of the country to which this mobile carrier belongs.
 * @property {string} countryDartId DART ID of the country to which this mobile carrier belongs.
 * @property {string} id ID of this mobile carrier.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#mobileCarrier&quot;.
 * @property {string} name Name of this mobile carrier.
 */
/**
 * @typedef MobileCarriersListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#mobileCarriersListResponse&quot;.
 * @property {dfareporting(v2.5).MobileCarrier[]} mobileCarriers Mobile carrier collection.
 */
/**
 * @typedef ObjectFilter
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#objectFilter&quot;.
 * @property {string[]} objectIds Applicable when status is ASSIGNED. The user has access to objects with these object IDs.
 * @property {string} status Status of the filter. NONE means the user has access to none of the objects. ALL means the user has access to all objects. ASSIGNED means the user has access to the objects with IDs in the objectIds list.
 */
/**
 * @typedef OffsetPosition
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {integer} left Offset distance from left side of an asset or a window.
 * @property {integer} top Offset distance from top side of an asset or a window.
 */
/**
 * @typedef OmnitureSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} omnitureCostDataEnabled Whether placement cost data will be sent to Omniture. This property can be enabled only if omnitureIntegrationEnabled is true.
 * @property {boolean} omnitureIntegrationEnabled Whether Omniture integration is enabled. This property can be enabled only when the &quot;Advanced Ad Serving&quot; account setting is enabled.
 */
/**
 * @typedef OperatingSystem
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dartId DART ID of this operating system. This is the ID used for targeting.
 * @property {boolean} desktop Whether this operating system is for desktop.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#operatingSystem&quot;.
 * @property {boolean} mobile Whether this operating system is for mobile.
 * @property {string} name Name of this operating system.
 */
/**
 * @typedef OperatingSystemVersion
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this operating system version.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#operatingSystemVersion&quot;.
 * @property {string} majorVersion Major version (leftmost number) of this operating system version.
 * @property {string} minorVersion Minor version (number after the first dot) of this operating system version.
 * @property {string} name Name of this operating system version.
 * @property {dfareporting(v2.5).OperatingSystem} operatingSystem Operating system of this operating system version.
 */
/**
 * @typedef OperatingSystemVersionsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#operatingSystemVersionsListResponse&quot;.
 * @property {dfareporting(v2.5).OperatingSystemVersion[]} operatingSystemVersions Operating system version collection.
 */
/**
 * @typedef OperatingSystemsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#operatingSystemsListResponse&quot;.
 * @property {dfareporting(v2.5).OperatingSystem[]} operatingSystems Operating system collection.
 */
/**
 * @typedef OptimizationActivity
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} floodlightActivityId Floodlight activity ID of this optimization activity. This is a required field.
 * @property {dfareporting(v2.5).DimensionValue} floodlightActivityIdDimensionValue Dimension value for the ID of the floodlight activity. This is a read-only, auto-generated field.
 * @property {integer} weight Weight associated with this optimization. Must be greater than 1. The weight assigned will be understood in proportion to the weights assigned to the other optimization activities.
 */
/**
 * @typedef Order
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this order.
 * @property {string} advertiserId Advertiser ID of this order.
 * @property {string[]} approverUserProfileIds IDs for users that have to approve documents created for this order.
 * @property {string} buyerInvoiceId Buyer invoice ID associated with this order.
 * @property {string} buyerOrganizationName Name of the buyer organization.
 * @property {string} comments Comments in this order.
 * @property {dfareporting(v2.5).OrderContact[]} contacts Contacts for this order.
 * @property {string} id ID of this order. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#order&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this order.
 * @property {string} name Name of this order.
 * @property {string} notes Notes of this order.
 * @property {string} planningTermId ID of the terms and conditions template used in this order.
 * @property {string} projectId Project ID of this order.
 * @property {string} sellerOrderId Seller order ID associated with this order.
 * @property {string} sellerOrganizationName Name of the seller organization.
 * @property {string[]} siteId Site IDs this order is associated with.
 * @property {string[]} siteNames Free-form site names this order is associated with.
 * @property {string} subaccountId Subaccount ID of this order.
 * @property {string} termsAndConditions Terms and conditions of this order.
 */
/**
 * @typedef OrderContact
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} contactInfo Free-form information about this contact. It could be any information related to this contact in addition to type, title, name, and signature user profile ID.
 * @property {string} contactName Name of this contact.
 * @property {string} contactTitle Title of this contact.
 * @property {string} contactType Type of this contact.
 * @property {string} signatureUserProfileId ID of the user profile containing the signature that will be embedded into order documents.
 */
/**
 * @typedef OrderDocument
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this order document.
 * @property {string} advertiserId Advertiser ID of this order document.
 * @property {string} amendedOrderDocumentId The amended order document ID of this order document. An order document can be created by optionally amending another order document so that the change history can be preserved.
 * @property {string[]} approvedByUserProfileIds IDs of users who have approved this order document.
 * @property {boolean} cancelled Whether this order document is cancelled.
 * @property {dfareporting(v2.5).LastModifiedInfo} createdInfo Information about the creation of this order document.
 * @property {string} effectiveDate Effective date of this order document.
 * @property {string} id ID of this order document.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#orderDocument&quot;.
 * @property {string[]} lastSentRecipients List of email addresses that received the last sent document.
 * @property {string} lastSentTime Timestamp of the last email sent with this order document.
 * @property {string} orderId ID of the order from which this order document is created.
 * @property {string} projectId Project ID of this order document.
 * @property {boolean} signed Whether this order document has been signed.
 * @property {string} subaccountId Subaccount ID of this order document.
 * @property {string} title Title of this order document.
 * @property {string} type Type of this order document
 */
/**
 * @typedef OrderDocumentsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#orderDocumentsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).OrderDocument[]} orderDocuments Order document collection
 */
/**
 * @typedef OrdersListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#ordersListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).Order[]} orders Order collection.
 */
/**
 * @typedef PathToConversionReportCompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Dimension[]} conversionDimensions Conversion dimensions which are compatible to be selected in the &quot;conversionDimensions&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} customFloodlightVariables Custom floodlight variables which are compatible to be selected in the &quot;customFloodlightVariables&quot; section of the report.
 * @property {string} kind The kind of resource this is, in this case dfareporting#pathToConversionReportCompatibleFields.
 * @property {dfareporting(v2.5).Metric[]} metrics Metrics which are compatible to be selected in the &quot;metricNames&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} perInteractionDimensions Per-interaction dimensions which are compatible to be selected in the &quot;perInteractionDimensions&quot; section of the report.
 */
/**
 * @typedef Placement
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {string} accountId Account ID of this placement. This field can be left blank.
* @property {string} advertiserId Advertiser ID of this placement. This field can be left blank.
* @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
* @property {boolean} archived Whether this placement is archived.
* @property {string} campaignId Campaign ID of this placement. This field is a required field on insertion.
* @property {dfareporting(v2.5).DimensionValue} campaignIdDimensionValue Dimension value for the ID of the campaign. This is a read-only, auto-generated field.
* @property {string} comment Comments for this placement.
* @property {string} compatibility Placement compatibility. DISPLAY and DISPLAY_INTERSTITIAL refer to rendering on desktop, on mobile devices or in mobile apps for regular or interstitial ads respectively. APP and APP_INTERSTITIAL are no longer allowed for new placement insertions. Instead, use DISPLAY or DISPLAY_INTERSTITIAL. IN_STREAM_VIDEO refers to rendering in in-stream video ads developed with the VAST standard. This field is required on insertion.
* @property {string} contentCategoryId ID of the content category assigned to this placement.
* @property {dfareporting(v2.5).LastModifiedInfo} createInfo Information about the creation of this placement. This is a read-only field.
* @property {string} directorySiteId Directory site ID of this placement. On insert, you must set either this field or the siteId field to specify the site associated with this placement. This is a required field that is read-only after insertion.
* @property {dfareporting(v2.5).DimensionValue} directorySiteIdDimensionValue Dimension value for the ID of the directory site. This is a read-only, auto-generated field.
* @property {string} externalId External ID for this placement.
* @property {string} id ID of this placement. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this placement. This is a read-only, auto-generated field.
* @property {string} keyName Key name of this placement. This is a read-only, auto-generated field.
* @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placement&quot;.
* @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this placement. This is a read-only field.
* @property {dfareporting(v2.5).LookbackConfiguration} lookbackConfiguration Lookback window settings for this placement.
* @property {string} name Name of this placement.This is a required field and must be less than 256 characters long.
* @property {boolean} paymentApproved Whether payment was approved for this placement. This is a read-only field relevant only to publisher-paid placements.
* @property {string} paymentSource Payment source for this placement. This is a required field that is read-only after insertion.
* @property {string} placementGroupId ID of this placement&#39;s group, if applicable.
* @property {dfareporting(v2.5).DimensionValue} placementGroupIdDimensionValue Dimension value for the ID of the placement group. This is a read-only, auto-generated field.
* @property {string} placementStrategyId ID of the placement strategy assigned to this placement.
* @property {dfareporting(v2.5).PricingSchedule} pricingSchedule Pricing schedule of this placement. This field is required on insertion, specifically subfields startDate, endDate and pricingType.
* @property {boolean} primary Whether this placement is the primary placement of a roadblock (placement group). You cannot change this field from true to false. Setting this field to true will automatically set the primary field on the original primary placement of the roadblock to false, and it will automatically set the roadblock&#39;s primaryPlacementId field to the ID of this placement.
* @property {dfareporting(v2.5).LastModifiedInfo} publisherUpdateInfo Information about the last publisher update. This is a read-only field.
* @property {string} siteId Site ID associated with this placement. On insert, you must set either this field or the directorySiteId field to specify the site associated with this placement. This is a required field that is read-only after insertion.
* @property {dfareporting(v2.5).DimensionValue} siteIdDimensionValue Dimension value for the ID of the site. This is a read-only, auto-generated field.
* @property {dfareporting(v2.5).Size} size Size associated with this placement. When inserting or updating a placement, only the size ID field is used. This field is required on insertion.
* @property {boolean} sslRequired Whether creatives assigned to this placement must be SSL-compliant.
* @property {string} status Third-party placement status.
* @property {string} subaccountId Subaccount ID of this placement. This field can be left blank.
* @property {string[]} tagFormats Tag formats to generate for this placement. This field is required on insertion.
Acceptable values are:
- &quot;PLACEMENT_TAG_STANDARD&quot;
- &quot;PLACEMENT_TAG_IFRAME_JAVASCRIPT&quot;
- &quot;PLACEMENT_TAG_IFRAME_ILAYER&quot;
- &quot;PLACEMENT_TAG_INTERNAL_REDIRECT&quot;
- &quot;PLACEMENT_TAG_JAVASCRIPT&quot;
- &quot;PLACEMENT_TAG_INTERSTITIAL_IFRAME_JAVASCRIPT&quot;
- &quot;PLACEMENT_TAG_INTERSTITIAL_INTERNAL_REDIRECT&quot;
- &quot;PLACEMENT_TAG_INTERSTITIAL_JAVASCRIPT&quot;
- &quot;PLACEMENT_TAG_CLICK_COMMANDS&quot;
- &quot;PLACEMENT_TAG_INSTREAM_VIDEO_PREFETCH&quot;
- &quot;PLACEMENT_TAG_TRACKING&quot;
- &quot;PLACEMENT_TAG_TRACKING_IFRAME&quot;
- &quot;PLACEMENT_TAG_TRACKING_JAVASCRIPT&quot;
* @property {dfareporting(v2.5).TagSetting} tagSetting Tag settings for this placement.
*/
/**
 * @typedef PlacementAssignment
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} active Whether this placement assignment is active. When true, the placement will be included in the ad&#39;s rotation.
 * @property {string} placementId ID of the placement to be assigned. This is a required field.
 * @property {dfareporting(v2.5).DimensionValue} placementIdDimensionValue Dimension value for the ID of the placement. This is a read-only, auto-generated field.
 * @property {boolean} sslRequired Whether the placement to be assigned requires SSL. This is a read-only field that is auto-generated when the ad is inserted or updated.
 */
/**
 * @typedef PlacementGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this placement group. This is a read-only field that can be left blank.
 * @property {string} advertiserId Advertiser ID of this placement group. This is a required field on insertion.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {boolean} archived Whether this placement group is archived.
 * @property {string} campaignId Campaign ID of this placement group. This field is required on insertion.
 * @property {dfareporting(v2.5).DimensionValue} campaignIdDimensionValue Dimension value for the ID of the campaign. This is a read-only, auto-generated field.
 * @property {string[]} childPlacementIds IDs of placements which are assigned to this placement group. This is a read-only, auto-generated field.
 * @property {string} comment Comments for this placement group.
 * @property {string} contentCategoryId ID of the content category assigned to this placement group.
 * @property {dfareporting(v2.5).LastModifiedInfo} createInfo Information about the creation of this placement group. This is a read-only field.
 * @property {string} directorySiteId Directory site ID associated with this placement group. On insert, you must set either this field or the site_id field to specify the site associated with this placement group. This is a required field that is read-only after insertion.
 * @property {dfareporting(v2.5).DimensionValue} directorySiteIdDimensionValue Dimension value for the ID of the directory site. This is a read-only, auto-generated field.
 * @property {string} externalId External ID for this placement.
 * @property {string} id ID of this placement group. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this placement group. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementGroup&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this placement group. This is a read-only field.
 * @property {string} name Name of this placement group. This is a required field and must be less than 256 characters long.
 * @property {string} placementGroupType Type of this placement group. A package is a simple group of placements that acts as a single pricing point for a group of tags. A roadblock is a group of placements that not only acts as a single pricing point, but also assumes that all the tags in it will be served at the same time. A roadblock requires one of its assigned placements to be marked as primary for reporting. This field is required on insertion.
 * @property {string} placementStrategyId ID of the placement strategy assigned to this placement group.
 * @property {dfareporting(v2.5).PricingSchedule} pricingSchedule Pricing schedule of this placement group. This field is required on insertion.
 * @property {string} primaryPlacementId ID of the primary placement, used to calculate the media cost of a roadblock (placement group). Modifying this field will automatically modify the primary field on all affected roadblock child placements.
 * @property {dfareporting(v2.5).DimensionValue} primaryPlacementIdDimensionValue Dimension value for the ID of the primary placement. This is a read-only, auto-generated field.
 * @property {string} siteId Site ID associated with this placement group. On insert, you must set either this field or the directorySiteId field to specify the site associated with this placement group. This is a required field that is read-only after insertion.
 * @property {dfareporting(v2.5).DimensionValue} siteIdDimensionValue Dimension value for the ID of the site. This is a read-only, auto-generated field.
 * @property {string} subaccountId Subaccount ID of this placement group. This is a read-only field that can be left blank.
 */
/**
 * @typedef PlacementGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementGroupsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).PlacementGroup[]} placementGroups Placement group collection.
 */
/**
 * @typedef PlacementStrategiesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementStrategiesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).PlacementStrategy[]} placementStrategies Placement strategy collection.
 */
/**
 * @typedef PlacementStrategy
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this placement strategy.This is a read-only field that can be left blank.
 * @property {string} id ID of this placement strategy. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementStrategy&quot;.
 * @property {string} name Name of this placement strategy. This is a required field. It must be less than 256 characters long and unique among placement strategies of the same account.
 */
/**
 * @typedef PlacementTag
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} placementId Placement ID
 * @property {dfareporting(v2.5).TagData[]} tagDatas Tags generated for this placement.
 */
/**
 * @typedef PlacementsGenerateTagsResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementsGenerateTagsResponse&quot;.
 * @property {dfareporting(v2.5).PlacementTag[]} placementTags Set of generated tags for the specified placements.
 */
/**
 * @typedef PlacementsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#placementsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).Placement[]} placements Placement collection.
 */
/**
 * @typedef PlatformType
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this platform type.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#platformType&quot;.
 * @property {string} name Name of this platform type.
 */
/**
 * @typedef PlatformTypesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#platformTypesListResponse&quot;.
 * @property {dfareporting(v2.5).PlatformType[]} platformTypes Platform type collection.
 */
/**
 * @typedef PopupWindowProperties
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Size} dimension Popup dimension for a creative. This is a read-only field. Applicable to the following creative types: all RICH_MEDIA and all VPAID
 * @property {dfareporting(v2.5).OffsetPosition} offset Upper-left corner coordinates of the popup window. Applicable if positionType is COORDINATES.
 * @property {string} positionType Popup window position either centered or at specific coordinate.
 * @property {boolean} showAddressBar Whether to display the browser address bar.
 * @property {boolean} showMenuBar Whether to display the browser menu bar.
 * @property {boolean} showScrollBar Whether to display the browser scroll bar.
 * @property {boolean} showStatusBar Whether to display the browser status bar.
 * @property {boolean} showToolBar Whether to display the browser tool bar.
 * @property {string} title Title of popup window.
 */
/**
 * @typedef PostalCode
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} code Postal code. This is equivalent to the id field.
 * @property {string} countryCode Country code of the country to which this postal code belongs.
 * @property {string} countryDartId DART ID of the country to which this postal code belongs.
 * @property {string} id ID of this postal code.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#postalCode&quot;.
 */
/**
 * @typedef PostalCodesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#postalCodesListResponse&quot;.
 * @property {dfareporting(v2.5).PostalCode[]} postalCodes Postal code collection.
 */
/**
 * @typedef Pricing
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} capCostType Cap cost type of this inventory item.
 * @property {string} endDate End date of this inventory item.
 * @property {dfareporting(v2.5).Flight[]} flights Flights of this inventory item. A flight (a.k.a. pricing period) represents the inventory item pricing information for a specific period of time.
 * @property {string} groupType Group type of this inventory item if it represents a placement group. Is null otherwise. There are two type of placement groups: PLANNING_PLACEMENT_GROUP_TYPE_PACKAGE is a simple group of inventory items that acts as a single pricing point for a group of tags. PLANNING_PLACEMENT_GROUP_TYPE_ROADBLOCK is a group of inventory items that not only acts as a single pricing point, but also assumes that all the tags in it will be served at the same time. A roadblock requires one of its assigned inventory items to be marked as primary.
 * @property {string} pricingType Pricing type of this inventory item.
 * @property {string} startDate Start date of this inventory item.
 */
/**
 * @typedef PricingSchedule
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} capCostOption Placement cap cost option.
 * @property {boolean} disregardOverdelivery Whether cap costs are ignored by ad serving.
 * @property {string} endDate Placement end date. This date must be later than, or the same day as, the placement start date, but not later than the campaign end date. If, for example, you set 6/25/2015 as both the start and end dates, the effective placement date is just that day only, 6/25/2015. The hours, minutes, and seconds of the end date should not be set, as doing so will result in an error. This field is required on insertion.
 * @property {boolean} flighted Whether this placement is flighted. If true, pricing periods will be computed automatically.
 * @property {string} floodlightActivityId Floodlight activity ID associated with this placement. This field should be set when placement pricing type is set to PRICING_TYPE_CPA.
 * @property {dfareporting(v2.5).PricingSchedulePricingPeriod[]} pricingPeriods Pricing periods for this placement.
 * @property {string} pricingType Placement pricing type. This field is required on insertion.
 * @property {string} startDate Placement start date. This date must be later than, or the same day as, the campaign start date. The hours, minutes, and seconds of the start date should not be set, as doing so will result in an error. This field is required on insertion.
 * @property {string} testingStartDate Testing start date of this placement. The hours, minutes, and seconds of the start date should not be set, as doing so will result in an error.
 */
/**
 * @typedef PricingSchedulePricingPeriod
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} endDate Pricing period end date. This date must be later than, or the same day as, the pricing period start date, but not later than the placement end date. The period end date can be the same date as the period start date. If, for example, you set 6/25/2015 as both the start and end dates, the effective pricing period date is just that day only, 6/25/2015. The hours, minutes, and seconds of the end date should not be set, as doing so will result in an error.
 * @property {string} pricingComment Comments for this pricing period.
 * @property {string} rateOrCostNanos Rate or cost of this pricing period.
 * @property {string} startDate Pricing period start date. This date must be later than, or the same day as, the placement start date. The hours, minutes, and seconds of the start date should not be set, as doing so will result in an error.
 * @property {string} units Units of this pricing period.
 */
/**
 * @typedef Project
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this project.
 * @property {string} advertiserId Advertiser ID of this project.
 * @property {string} audienceAgeGroup Audience age group of this project.
 * @property {string} audienceGender Audience gender of this project.
 * @property {string} budget Budget of this project in the currency specified by the current account. The value stored in this field represents only the non-fractional amount. For example, for USD, the smallest value that can be represented by this field is 1 US dollar.
 * @property {string} clientBillingCode Client billing code of this project.
 * @property {string} clientName Name of the project client.
 * @property {string} endDate End date of the project.
 * @property {string} id ID of this project. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#project&quot;.
 * @property {dfareporting(v2.5).LastModifiedInfo} lastModifiedInfo Information about the most recent modification of this project.
 * @property {string} name Name of this project.
 * @property {string} overview Overview of this project.
 * @property {string} startDate Start date of the project.
 * @property {string} subaccountId Subaccount ID of this project.
 * @property {string} targetClicks Number of clicks that the advertiser is targeting.
 * @property {string} targetConversions Number of conversions that the advertiser is targeting.
 * @property {string} targetCpaNanos CPA that the advertiser is targeting.
 * @property {string} targetCpcNanos CPC that the advertiser is targeting.
 * @property {string} targetCpmNanos CPM that the advertiser is targeting.
 * @property {string} targetImpressions Number of impressions that the advertiser is targeting.
 */
/**
 * @typedef ProjectsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#projectsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).Project[]} projects Project collection.
 */
/**
 * @typedef ReachReportCompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Dimension[]} dimensionFilters Dimensions which are compatible to be selected in the &quot;dimensionFilters&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} dimensions Dimensions which are compatible to be selected in the &quot;dimensions&quot; section of the report.
 * @property {string} kind The kind of resource this is, in this case dfareporting#reachReportCompatibleFields.
 * @property {dfareporting(v2.5).Metric[]} metrics Metrics which are compatible to be selected in the &quot;metricNames&quot; section of the report.
 * @property {dfareporting(v2.5).Metric[]} pivotedActivityMetrics Metrics which are compatible to be selected as activity metrics to pivot on in the &quot;activities&quot; section of the report.
 * @property {dfareporting(v2.5).Metric[]} reachByFrequencyMetrics Metrics which are compatible to be selected in the &quot;reachByFrequencyMetricNames&quot; section of the report.
 */
/**
 * @typedef Recipient
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} deliveryType The delivery type for the recipient.
 * @property {string} email The email address of the recipient.
 * @property {string} kind The kind of resource this is, in this case dfareporting#recipient.
 */
/**
 * @typedef Region
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} countryCode Country code of the country to which this region belongs.
 * @property {string} countryDartId DART ID of the country to which this region belongs.
 * @property {string} dartId DART ID of this region.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#region&quot;.
 * @property {string} name Name of this region.
 * @property {string} regionCode Region code.
 */
/**
 * @typedef RegionsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#regionsListResponse&quot;.
 * @property {dfareporting(v2.5).Region[]} regions Region collection.
 */
/**
 * @typedef RemarketingList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this remarketing list. This is a read-only, auto-generated field that is only returned in GET requests.
 * @property {boolean} active Whether this remarketing list is active.
 * @property {string} advertiserId Dimension value for the advertiser ID that owns this remarketing list. This is a required field.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser. This is a read-only, auto-generated field.
 * @property {string} description Remarketing list description.
 * @property {string} id Remarketing list ID. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#remarketingList&quot;.
 * @property {string} lifeSpan Number of days that a user should remain in the remarketing list without an impression.
 * @property {dfareporting(v2.5).ListPopulationRule} listPopulationRule Rule used to populate the remarketing list with users.
 * @property {string} listSize Number of users currently in the list. This is a read-only field.
 * @property {string} listSource Product from which this remarketing list was originated.
 * @property {string} name Name of the remarketing list. This is a required field. Must be no greater than 128 characters long.
 * @property {string} subaccountId Subaccount ID of this remarketing list. This is a read-only, auto-generated field that is only returned in GET requests.
 */
/**
 * @typedef RemarketingListShare
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#remarketingListShare&quot;.
 * @property {string} remarketingListId Remarketing list ID. This is a read-only, auto-generated field.
 * @property {string[]} sharedAccountIds Accounts that the remarketing list is shared with.
 * @property {string[]} sharedAdvertiserIds Advertisers that the remarketing list is shared with.
 */
/**
 * @typedef RemarketingListsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#remarketingListsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).RemarketingList[]} remarketingLists Remarketing list collection.
 */
/**
 * @typedef Report
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId The account ID to which this report belongs.
 * @property {object} criteria The report criteria for a report of type &quot;STANDARD&quot;.
 * @property {object} crossDimensionReachCriteria The report criteria for a report of type &quot;CROSS_DIMENSION_REACH&quot;.
 * @property {object} delivery The report&#39;s email delivery settings.
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {string} fileName The filename used when generating report files for this report.
 * @property {object} floodlightCriteria The report criteria for a report of type &quot;FLOODLIGHT&quot;.
 * @property {string} format The output format of the report. If not specified, default format is &quot;CSV&quot;. Note that the actual format in the completed report file might differ if for instance the report&#39;s size exceeds the format&#39;s capabilities. &quot;CSV&quot; will then be the fallback format.
 * @property {string} id The unique ID identifying this report resource.
 * @property {string} kind The kind of resource this is, in this case dfareporting#report.
 * @property {string} lastModifiedTime The timestamp (in milliseconds since epoch) of when this report was last modified.
 * @property {string} name The name of the report.
 * @property {string} ownerProfileId The user profile id of the owner of this report.
 * @property {object} pathToConversionCriteria The report criteria for a report of type &quot;PATH_TO_CONVERSION&quot;.
 * @property {object} reachCriteria The report criteria for a report of type &quot;REACH&quot;.
 * @property {object} schedule The report&#39;s schedule. Can only be set if the report&#39;s &#39;dateRange&#39; is a relative date range and the relative date range is not &quot;TODAY&quot;.
 * @property {string} subAccountId The subaccount ID to which this report belongs if applicable.
 * @property {string} type The type of the report.
 */
/**
 * @typedef ReportCompatibleFields
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Dimension[]} dimensionFilters Dimensions which are compatible to be selected in the &quot;dimensionFilters&quot; section of the report.
 * @property {dfareporting(v2.5).Dimension[]} dimensions Dimensions which are compatible to be selected in the &quot;dimensions&quot; section of the report.
 * @property {string} kind The kind of resource this is, in this case dfareporting#reportCompatibleFields.
 * @property {dfareporting(v2.5).Metric[]} metrics Metrics which are compatible to be selected in the &quot;metricNames&quot; section of the report.
 * @property {dfareporting(v2.5).Metric[]} pivotedActivityMetrics Metrics which are compatible to be selected as activity metrics to pivot on in the &quot;activities&quot; section of the report.
 */
/**
 * @typedef ReportList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {dfareporting(v2.5).Report[]} items The reports returned in this response.
 * @property {string} kind The kind of list this is, in this case dfareporting#reportList.
 * @property {string} nextPageToken Continuation token used to page through reports. To retrieve the next page of results, set the next request&#39;s &quot;pageToken&quot; to the value of this field. The page token is only valid for a limited amount of time and should not be persisted.
 */
/**
 * @typedef ReportsConfiguration
 * @memberOf! dfareporting(v2.5)
 * @type object
* @property {boolean} exposureToConversionEnabled Whether the exposure to conversion report is enabled. This report shows detailed pathway information on up to 10 of the most recent ad exposures seen by a user before converting.
* @property {dfareporting(v2.5).LookbackConfiguration} lookbackConfiguration Default lookback windows for new advertisers in this account.
* @property {string} reportGenerationTimeZoneId Report generation time zone ID of this account. This is a required field that can only be changed by a superuser.
Acceptable values are:

- &quot;1&quot; for &quot;America/New_York&quot; 
- &quot;2&quot; for &quot;Europe/London&quot; 
- &quot;3&quot; for &quot;Europe/Paris&quot; 
- &quot;4&quot; for &quot;Africa/Johannesburg&quot; 
- &quot;5&quot; for &quot;Asia/Jerusalem&quot; 
- &quot;6&quot; for &quot;Asia/Shanghai&quot; 
- &quot;7&quot; for &quot;Asia/Hong_Kong&quot; 
- &quot;8&quot; for &quot;Asia/Tokyo&quot; 
- &quot;9&quot; for &quot;Australia/Sydney&quot; 
- &quot;10&quot; for &quot;Asia/Dubai&quot; 
- &quot;11&quot; for &quot;America/Los_Angeles&quot; 
- &quot;12&quot; for &quot;Pacific/Auckland&quot; 
- &quot;13&quot; for &quot;America/Sao_Paulo&quot;
*/
/**
 * @typedef RichMediaExitOverride
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} customExitUrl Click-through URL to override the default exit URL. Applicable if the useCustomExitUrl field is set to true.
 * @property {string} exitId ID for the override to refer to a specific exit in the creative.
 * @property {boolean} useCustomExitUrl Whether to use the custom exit URL.
 */
/**
 * @typedef Site
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this site. This is a read-only field that can be left blank.
 * @property {boolean} approved Whether this site is approved.
 * @property {string} directorySiteId Directory site associated with this site. This is a required field that is read-only after insertion.
 * @property {dfareporting(v2.5).DimensionValue} directorySiteIdDimensionValue Dimension value for the ID of the directory site. This is a read-only, auto-generated field.
 * @property {string} id ID of this site. This is a read-only, auto-generated field.
 * @property {dfareporting(v2.5).DimensionValue} idDimensionValue Dimension value for the ID of this site. This is a read-only, auto-generated field.
 * @property {string} keyName Key name of this site. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#site&quot;.
 * @property {string} name Name of this site.This is a required field. Must be less than 128 characters long. If this site is under a subaccount, the name must be unique among sites of the same subaccount. Otherwise, this site is a top-level site, and the name must be unique among top-level sites of the same account.
 * @property {dfareporting(v2.5).SiteContact[]} siteContacts Site contacts.
 * @property {dfareporting(v2.5).SiteSettings} siteSettings Site-wide settings.
 * @property {string} subaccountId Subaccount ID of this site. This is a read-only field that can be left blank.
 */
/**
 * @typedef SiteContact
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} address Address of this site contact.
 * @property {string} contactType Site contact type.
 * @property {string} email Email address of this site contact. This is a required field.
 * @property {string} firstName First name of this site contact.
 * @property {string} id ID of this site contact. This is a read-only, auto-generated field.
 * @property {string} lastName Last name of this site contact.
 * @property {string} phone Primary phone number of this site contact.
 * @property {string} title Title or designation of this site contact.
 */
/**
 * @typedef SiteSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} activeViewOptOut Whether active view creatives are disabled for this site.
 * @property {dfareporting(v2.5).CreativeSettings} creativeSettings Site-wide creative settings.
 * @property {boolean} disableBrandSafeAds Whether brand safe ads are disabled for this site.
 * @property {boolean} disableNewCookie Whether new cookies are disabled for this site.
 * @property {dfareporting(v2.5).LookbackConfiguration} lookbackConfiguration Lookback window settings for this site.
 * @property {dfareporting(v2.5).TagSetting} tagSetting Configuration settings for dynamic and image floodlight tags.
 * @property {boolean} videoActiveViewOptOut Whether Verification and ActiveView are disabled for in-stream video creatives on this site. The same setting videoActiveViewOptOut exists on the directory site level -- the opt out occurs if either of these settings are true. These settings are distinct from DirectorySites.settings.activeViewOptOut or Sites.siteSettings.activeViewOptOut which only apply to display ads. However, Accounts.activeViewOptOut opts out both video traffic, as well as display ads, from Verification and ActiveView.
 */
/**
 * @typedef SitesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#sitesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).Site[]} sites Site collection.
 */
/**
 * @typedef Size
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {integer} height Height of this size.
 * @property {boolean} iab IAB standard size. This is a read-only, auto-generated field.
 * @property {string} id ID of this size. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#size&quot;.
 * @property {integer} width Width of this size.
 */
/**
 * @typedef SizesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#sizesListResponse&quot;.
 * @property {dfareporting(v2.5).Size[]} sizes Size collection.
 */
/**
 * @typedef SortedDimension
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind The kind of resource this is, in this case dfareporting#sortedDimension.
 * @property {string} name The name of the dimension.
 * @property {string} sortOrder An optional sort order for the dimension column.
 */
/**
 * @typedef Subaccount
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId ID of the account that contains this subaccount. This is a read-only field that can be left blank.
 * @property {string[]} availablePermissionIds IDs of the available user role permissions for this subaccount.
 * @property {string} id ID of this subaccount. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#subaccount&quot;.
 * @property {string} name Name of this subaccount. This is a required field. Must be less than 128 characters long and be unique among subaccounts of the same account.
 */
/**
 * @typedef SubaccountsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#subaccountsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).Subaccount[]} subaccounts Subaccount collection.
 */
/**
 * @typedef TagData
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} adId Ad associated with this placement tag.
 * @property {string} clickTag Tag string to record a click.
 * @property {string} creativeId Creative associated with this placement tag.
 * @property {string} format TagData tag format of this tag.
 * @property {string} impressionTag Tag string for serving an ad.
 */
/**
 * @typedef TagSetting
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} additionalKeyValues Additional key-values to be included in tags. Each key-value pair must be of the form key=value, and pairs must be separated by a semicolon (;). Keys and values must not contain commas. For example, id=2;color=red is a valid value for this field.
 * @property {boolean} includeClickThroughUrls Whether static landing page URLs should be included in the tags. This setting applies only to placements.
 * @property {boolean} includeClickTracking Whether click-tracking string should be included in the tags.
 * @property {string} keywordOption Option specifying how keywords are embedded in ad tags. This setting can be used to specify whether keyword placeholders are inserted in placement tags for this site. Publishers can then add keywords to those placeholders.
 */
/**
 * @typedef TagSettings
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {boolean} dynamicTagEnabled Whether dynamic floodlight tags are enabled.
 * @property {boolean} imageTagEnabled Whether image tags are enabled.
 */
/**
 * @typedef TargetWindow
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} customHtml User-entered value.
 * @property {string} targetWindowOption Type of browser window for which the backup image of the flash creative can be displayed.
 */
/**
 * @typedef TargetableRemarketingList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this remarketing list. This is a read-only, auto-generated field that is only returned in GET requests.
 * @property {boolean} active Whether this targetable remarketing list is active.
 * @property {string} advertiserId Dimension value for the advertiser ID that owns this targetable remarketing list.
 * @property {dfareporting(v2.5).DimensionValue} advertiserIdDimensionValue Dimension value for the ID of the advertiser.
 * @property {string} description Targetable remarketing list description.
 * @property {string} id Targetable remarketing list ID.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#targetableRemarketingList&quot;.
 * @property {string} lifeSpan Number of days that a user should remain in the targetable remarketing list without an impression.
 * @property {string} listSize Number of users currently in the list. This is a read-only field.
 * @property {string} listSource Product from which this targetable remarketing list was originated.
 * @property {string} name Name of the targetable remarketing list. Is no greater than 128 characters long.
 * @property {string} subaccountId Subaccount ID of this remarketing list. This is a read-only, auto-generated field that is only returned in GET requests.
 */
/**
 * @typedef TargetableRemarketingListsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#targetableRemarketingListsListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).TargetableRemarketingList[]} targetableRemarketingLists Targetable remarketing list collection.
 */
/**
 * @typedef TechnologyTargeting
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {dfareporting(v2.5).Browser[]} browsers Browsers that this ad targets. For each browser either set browserVersionId or dartId along with the version numbers. If both are specified, only browserVersionId will be used. The other fields are populated automatically when the ad is inserted or updated.
 * @property {dfareporting(v2.5).ConnectionType[]} connectionTypes Connection types that this ad targets. For each connection type only id is required. The other fields are populated automatically when the ad is inserted or updated.
 * @property {dfareporting(v2.5).MobileCarrier[]} mobileCarriers Mobile carriers that this ad targets. For each mobile carrier only id is required, and the other fields are populated automatically when the ad is inserted or updated. If targeting a mobile carrier, do not set targeting for any zip codes.
 * @property {dfareporting(v2.5).OperatingSystemVersion[]} operatingSystemVersions Operating system versions that this ad targets. To target all versions, use operatingSystems. For each operating system version, only id is required. The other fields are populated automatically when the ad is inserted or updated. If targeting an operating system version, do not set targeting for the corresponding operating system in operatingSystems.
 * @property {dfareporting(v2.5).OperatingSystem[]} operatingSystems Operating systems that this ad targets. To target specific versions, use operatingSystemVersions. For each operating system only dartId is required. The other fields are populated automatically when the ad is inserted or updated. If targeting an operating system, do not set targeting for operating system versions for the same operating system.
 * @property {dfareporting(v2.5).PlatformType[]} platformTypes Platform types that this ad targets. For example, desktop, mobile, or tablet. For each platform type, only id is required, and the other fields are populated automatically when the ad is inserted or updated.
 */
/**
 * @typedef ThirdPartyAuthenticationToken
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} name Name of the third-party authentication token.
 * @property {string} value Value of the third-party authentication token. This is a read-only, auto-generated field.
 */
/**
 * @typedef ThirdPartyTrackingUrl
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} thirdPartyUrlType Third-party URL type for in-stream video creatives.
 * @property {string} url URL for the specified third-party URL type.
 */
/**
 * @typedef UserDefinedVariableConfiguration
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} dataType Data type for the variable. This is a required field.
 * @property {string} reportName User-friendly name for the variable which will appear in reports. This is a required field, must be less than 64 characters long, and cannot contain the following characters: &quot;&quot;&lt;&gt;&quot;.
 * @property {string} variableType Variable name in the tag. This is a required field.
 */
/**
 * @typedef UserProfile
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId The account ID to which this profile belongs.
 * @property {string} accountName The account name this profile belongs to.
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {string} kind The kind of resource this is, in this case dfareporting#userProfile.
 * @property {string} profileId The unique ID of the user profile.
 * @property {string} subAccountId The sub account ID this profile belongs to if applicable.
 * @property {string} subAccountName The sub account name this profile belongs to if applicable.
 * @property {string} userName The user name.
 */
/**
 * @typedef UserProfileList
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} etag The eTag of this response for caching purposes.
 * @property {dfareporting(v2.5).UserProfile[]} items The user profiles returned in this response.
 * @property {string} kind The kind of list this is, in this case dfareporting#userProfileList.
 */
/**
 * @typedef UserRole
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} accountId Account ID of this user role. This is a read-only field that can be left blank.
 * @property {boolean} defaultUserRole Whether this is a default user role. Default user roles are created by the system for the account/subaccount and cannot be modified or deleted. Each default user role comes with a basic set of preassigned permissions.
 * @property {string} id ID of this user role. This is a read-only, auto-generated field.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRole&quot;.
 * @property {string} name Name of this user role. This is a required field. Must be less than 256 characters long. If this user role is under a subaccount, the name must be unique among sites of the same subaccount. Otherwise, this user role is a top-level user role, and the name must be unique among top-level user roles of the same account.
 * @property {string} parentUserRoleId ID of the user role that this user role is based on or copied from. This is a required field.
 * @property {dfareporting(v2.5).UserRolePermission[]} permissions List of permissions associated with this user role.
 * @property {string} subaccountId Subaccount ID of this user role. This is a read-only field that can be left blank.
 */
/**
 * @typedef UserRolePermission
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} availability Levels of availability for a user role permission.
 * @property {string} id ID of this user role permission.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRolePermission&quot;.
 * @property {string} name Name of this user role permission.
 * @property {string} permissionGroupId ID of the permission group that this user role permission belongs to.
 */
/**
 * @typedef UserRolePermissionGroup
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} id ID of this user role permission.
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRolePermissionGroup&quot;.
 * @property {string} name Name of this user role permission group.
 */
/**
 * @typedef UserRolePermissionGroupsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRolePermissionGroupsListResponse&quot;.
 * @property {dfareporting(v2.5).UserRolePermissionGroup[]} userRolePermissionGroups User role permission group collection.
 */
/**
 * @typedef UserRolePermissionsListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRolePermissionsListResponse&quot;.
 * @property {dfareporting(v2.5).UserRolePermission[]} userRolePermissions User role permission collection.
 */
/**
 * @typedef UserRolesListResponse
 * @memberOf! dfareporting(v2.5)
 * @type object
 * @property {string} kind Identifies what kind of resource this is. Value: the fixed string &quot;dfareporting#userRolesListResponse&quot;.
 * @property {string} nextPageToken Pagination token to be used for the next list operation.
 * @property {dfareporting(v2.5).UserRole[]} userRoles User role collection.
 */
module.exports = Dfareporting;
