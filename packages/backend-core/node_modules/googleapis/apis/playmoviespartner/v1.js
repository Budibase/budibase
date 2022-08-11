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
 * Google Play Movies Partner API
 *
 * Gets the delivery status of titles for Google Play Movies Partners.
 *
 * @example
 * var google = require('googleapis');
 * var playmoviespartner = google.playmoviespartner('v1');
 *
 * @namespace playmoviespartner
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Playmoviespartner
 */
function Playmoviespartner(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.accounts = {

    avails: {

      /**
       * playmoviespartner.accounts.avails.get
       *
       * @desc Get an Avail given its avail group id and avail id.
       *
       * @alias playmoviespartner.accounts.avails.get
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {string} params.availId REQUIRED. Avail ID.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/avails/{availId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'availId'],
          pathParams: ['accountId', 'availId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * playmoviespartner.accounts.avails.list
       *
       * @desc List Avails owned or managed by the partner. See _Authentication and Authorization rules_ and _List methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.avails.list
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {integer=} params.pageSize See _List methods rules_ for info about this field.
       * @param {string=} params.pageToken See _List methods rules_ for info about this field.
       * @param {string=} params.pphNames See _List methods rules_ for info about this field.
       * @param {string=} params.studioNames See _List methods rules_ for info about this field.
       * @param {string=} params.title Filter that matches Avails with a `title_internal_alias`, `series_title_internal_alias`, `season_title_internal_alias`, or `episode_title_internal_alias` that contains the given case-insensitive title.
       * @param {string=} params.territories Filter Avails that match (case-insensitive) any of the given country codes, using the "ISO 3166-1 alpha-2" format (examples: "US", "us", "Us").
       * @param {string=} params.altId Filter Avails that match a case-insensitive, partner-specific custom id. NOTE: this field is deprecated and will be removed on V2; `alt_ids` should be used instead.
       * @param {string=} params.videoIds Filter Avails that match any of the given `video_id`s.
       * @param {string=} params.altIds Filter Avails that match (case-insensitive) any of the given partner-specific custom ids.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/avails',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    orders: {

      /**
       * playmoviespartner.accounts.orders.get
       *
       * @desc Get an Order given its id. See _Authentication and Authorization rules_ and _Get methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.orders.get
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {string} params.orderId REQUIRED. Order ID.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/orders/{orderId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'orderId'],
          pathParams: ['accountId', 'orderId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * playmoviespartner.accounts.orders.list
       *
       * @desc List Orders owned or managed by the partner. See _Authentication and Authorization rules_ and _List methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.orders.list
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {integer=} params.pageSize See _List methods rules_ for info about this field.
       * @param {string=} params.pageToken See _List methods rules_ for info about this field.
       * @param {string=} params.pphNames See _List methods rules_ for info about this field.
       * @param {string=} params.studioNames See _List methods rules_ for info about this field.
       * @param {string=} params.name Filter that matches Orders with a `name`, `show`, `season` or `episode` that contains the given case-insensitive name.
       * @param {string=} params.status Filter Orders that match one of the given status.
       * @param {string=} params.customId Filter Orders that match a case-insensitive, partner-specific custom id.
       * @param {string=} params.videoIds Filter Orders that match any of the given `video_id`s.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/orders',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    experienceLocales: {

      /**
       * playmoviespartner.accounts.experienceLocales.get
       *
       * @desc Get an ExperienceLocale given its id. See _Authentication and Authorization rules_ and _Get methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.experienceLocales.get
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {string} params.elId REQUIRED. ExperienceLocale ID, as defined by Google.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/experienceLocales/{elId}',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId', 'elId'],
          pathParams: ['accountId', 'elId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      /**
       * playmoviespartner.accounts.experienceLocales.list
       *
       * @desc List ExperienceLocales owned or managed by the partner. See _Authentication and Authorization rules_ and _List methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.experienceLocales.list
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {integer=} params.pageSize See _List methods rules_ for info about this field.
       * @param {string=} params.pageToken See _List methods rules_ for info about this field.
       * @param {string=} params.pphNames See _List methods rules_ for info about this field.
       * @param {string=} params.studioNames See _List methods rules_ for info about this field.
       * @param {string=} params.titleLevelEidr Filter ExperienceLocales that match a given title-level EIDR.
       * @param {string=} params.editLevelEidr Filter ExperienceLocales that match a given edit-level EIDR.
       * @param {string=} params.status Filter ExperienceLocales that match one of the given status.
       * @param {string=} params.customId Filter ExperienceLocales that match a case-insensitive, partner-specific custom id.
       * @param {string=} params.altCutId Filter ExperienceLocales that match a case-insensitive, partner-specific Alternative Cut ID.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/experienceLocales',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      }
    },

    components: {

      /**
       * playmoviespartner.accounts.components.list
       *
       * @desc List Components owned or managed by the partner. See _Authentication and Authorization rules_ and _List methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.components.list
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {integer=} params.pageSize See _List methods rules_ for info about this field.
       * @param {string=} params.pageToken See _List methods rules_ for info about this field.
       * @param {string=} params.pphNames See _List methods rules_ for info about this field.
       * @param {string=} params.studioNames See _List methods rules_ for info about this field.
       * @param {string=} params.titleLevelEidr Filter Components that match a given title-level EIDR.
       * @param {string=} params.editLevelEidr Filter Components that match a given edit-level EIDR.
       * @param {string=} params.status Filter Components that match one of the given status.
       * @param {string=} params.customId Filter Components that match a case-insensitive partner-specific custom id.
       * @param {string=} params.inventoryId InventoryID available in Common Manifest.
       * @param {string=} params.presentationId PresentationID available in Common Manifest.
       * @param {string=} params.playableSequenceId PlayableSequenceID available in Common Manifest.
       * @param {string=} params.elId Experience ID, as defined by Google.
       * @param {string=} params.altCutId Filter Components that match a case-insensitive, partner-specific Alternative Cut ID.
       * @param {string=} params.filename Filter Components that match a case-insensitive substring of the physical name of the delivered file.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/components',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      type: {

        /**
         * playmoviespartner.accounts.components.type.get
         *
         * @desc Get a Component given its id.
         *
         * @alias playmoviespartner.accounts.components.type.get
         * @memberOf! playmoviespartner(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
         * @param {string} params.componentId REQUIRED. Component ID.
         * @param {string} params.type REQUIRED. Component Type.
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
              url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/components/{componentId}/type/{type}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'componentId', 'type'],
            pathParams: ['accountId', 'componentId', 'type'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    },

    storeInfos: {

      /**
       * playmoviespartner.accounts.storeInfos.list
       *
       * @desc List StoreInfos owned or managed by the partner. See _Authentication and Authorization rules_ and _List methods rules_ for more information about this method.
       *
       * @alias playmoviespartner.accounts.storeInfos.list
       * @memberOf! playmoviespartner(v1)
       *
       * @param {object} params Parameters for request
       * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
       * @param {integer=} params.pageSize See _List methods rules_ for info about this field.
       * @param {string=} params.pageToken See _List methods rules_ for info about this field.
       * @param {string=} params.pphNames See _List methods rules_ for info about this field.
       * @param {string=} params.studioNames See _List methods rules_ for info about this field.
       * @param {string=} params.videoId Filter StoreInfos that match a given `video_id`. NOTE: this field is deprecated and will be removed on V2; `video_ids` should be used instead.
       * @param {string=} params.countries Filter StoreInfos that match (case-insensitive) any of the given country codes, using the "ISO 3166-1 alpha-2" format (examples: "US", "us", "Us").
       * @param {string=} params.name Filter that matches StoreInfos with a `name` or `show_name` that contains the given case-insensitive name.
       * @param {string=} params.videoIds Filter StoreInfos that match any of the given `video_id`s.
       * @param {string=} params.mids Filter StoreInfos that match any of the given `mid`s.
       * @param {string=} params.seasonIds Filter StoreInfos that match any of the given `season_id`s.
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
            url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/storeInfos',
            method: 'GET'
          }, options),
          params: params,
          requiredParams: ['accountId'],
          pathParams: ['accountId'],
          context: self
        };

        return createAPIRequest(parameters, callback);
      },

      country: {

        /**
         * playmoviespartner.accounts.storeInfos.country.get
         *
         * @desc Get a StoreInfo given its video id and country. See _Authentication and Authorization rules_ and _Get methods rules_ for more information about this method.
         *
         * @alias playmoviespartner.accounts.storeInfos.country.get
         * @memberOf! playmoviespartner(v1)
         *
         * @param {object} params Parameters for request
         * @param {string} params.accountId REQUIRED. See _General rules_ for more information about this field.
         * @param {string} params.videoId REQUIRED. Video ID.
         * @param {string} params.country REQUIRED. Edit country.
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
              url: 'https://playmoviespartner.googleapis.com/v1/accounts/{accountId}/storeInfos/{videoId}/country/{country}',
              method: 'GET'
            }, options),
            params: params,
            requiredParams: ['accountId', 'videoId', 'country'],
            pathParams: ['accountId', 'videoId', 'country'],
            context: self
          };

          return createAPIRequest(parameters, callback);
        }
      }
    }
  };
}

/**
 * @typedef Avail
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {string} availId ID internally generated by Google to uniquely identify an Avail. Not part of EMA Specs.
 * @property {string} displayName The name of the studio that owns the Edit referred in the Avail. This is the equivalent of `studio_name` in other resources, but it follows the EMA nomenclature. Example: &quot;Google Films&quot;.
 * @property {string} storeLanguage Spoken language of the intended audience. Language shall be encoded in accordance with RFC 5646. Example: &quot;fr&quot;.
 * @property {string} territory ISO 3166-1 alpha-2 country code for the country or territory of this Avail. For Avails, we use Territory in lieu of Country to comply with EMA specifications. But please note that Territory and Country identify the same thing. Example: &quot;US&quot;.
 * @property {string} workType Work type as enumerated in EMA.
 * @property {string} seriesTitleInternalAlias Title used by involved parties to refer to this series. Only available on TV Avails. Example: &quot;Googlers, The&quot;.
 * @property {string} seasonNumber The number assigned to the season within a series. Only available on TV Avails. Example: &quot;1&quot;.
 * @property {string} episodeNumber The number assigned to the episode within a season. Only available on TV Avails. Example: &quot;3&quot;.
 * @property {string} seasonTitleInternalAlias Title used by involved parties to refer to this season. Only available on TV Avails. Example: &quot;Googlers, The&quot;.
 * @property {string} episodeTitleInternalAlias OPTIONAL.TV Only. Title used by involved parties to refer to this episode. Only available on TV Avails. Example: &quot;Coding at Google&quot;.
 * @property {string} titleInternalAlias Title used by involved parties to refer to this content. Example: &quot;Googlers, The&quot;. Only available on Movie Avails.
 * @property {string} licenseType Type of transaction.
 * @property {string} formatProfile Indicates the format profile covered by the transaction.
 * @property {string} start Start of term in YYYY-MM-DD format in the timezone of the country of the Avail. Example: &quot;2013-05-14&quot;.
 * @property {string} end End of term in YYYY-MM-DD format in the timezone of the country of the Avail. &quot;Open&quot; if no end date is available. Example: &quot;2019-02-17&quot;
 * @property {string} priceType Type of pricing that should be applied to this Avail based on how the partner classify them. Example: &quot;Tier&quot;, &quot;WSP&quot;, &quot;SRP&quot;, or &quot;Category&quot;.
 * @property {string} priceValue Value to be applied to the pricing type. Example: &quot;4&quot; or &quot;2.99&quot;
 * @property {string} contentId Title Identifier. This should be the Title Level EIDR. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-5&quot;.
 * @property {string} productId Edit Identifier. This should be the Edit Level EIDR. Example: &quot;10.2340/1489-49A2-3956-4B2D-FE16-6&quot;
 * @property {string} encodeId Manifestation Identifier. This should be the Manifestation Level EIDR. Example: &quot;10.2340/1489-49A2-3956-4B2D-FE16-7&quot;
 * @property {string} seriesAltId Other identifier referring to the series, as defined by partner. Only available on TV avails. Example: &quot;rs_googlers&quot;.
 * @property {string} seasonAltId Other identifier referring to the season, as defined by partner. Only available on TV avails. Example: &quot;rs_googlers_s1&quot;.
 * @property {string} episodeAltId Other identifier referring to the episode, as defined by partner. Only available on TV avails. Example: &quot;rs_googlers_s1_3&quot;.
 * @property {string} altId Other identifier referring to the Edit, as defined by partner. Example: &quot;GOOGLER_2006&quot;
 * @property {string} suppressionLiftDate First date an Edit could be publically announced as becoming available at a specific future date in territory of Avail. *Not* the Avail start date or pre-order start date. Format is YYYY-MM-DD. Only available for pre-orders. Example: &quot;2012-12-10&quot;
 * @property {string} releaseDate Release date of the Title in earliest released territory. Typically it is just the year, but it is free-form as per EMA spec. Examples: &quot;1979&quot;, &quot;Oct 2014&quot;
 * @property {string} ratingSystem Rating system applied to the version of title within territory of Avail. Rating systems should be formatted as per [EMA ratings spec](http://www.movielabs.com/md/ratings/) Example: &quot;MPAA&quot;
 * @property {string} ratingValue Value representing the rating. Ratings should be formatted as per http://www.movielabs.com/md/ratings/ Example: &quot;PG&quot;
 * @property {string} ratingReason Value representing the rating reason. Rating reasons should be formatted as per [EMA ratings spec](http://www.movielabs.com/md/ratings/) and comma-separated for inclusion of multiple reasons. Example: &quot;L, S, V&quot;
 * @property {boolean} captionIncluded Communicating if caption file will be delivered.
 * @property {string} captionExemption Communicating an exempt category as defined by FCC regulations. It is not required for non-US Avails. Example: &quot;1&quot;
 * @property {string} videoId Google-generated ID identifying the video linked to this Avail, once delivered. Not part of EMA Specs. Example: &#39;gtry456_xc&#39;
 * @property {string[]} pphNames Name of the post-production houses that manage the Avail. Not part of EMA Specs.
 */
/**
 * @typedef ListAvailsResponse
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {playmoviespartner(v1).Avail[]} avails List of Avails that match the request criteria.
 * @property {string} nextPageToken See _List methods rules_ for info about this field.
 * @property {integer} totalSize See _List methods rules_ for more information about this field.
 */
/**
 * @typedef Order
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {string} orderId ID internally generated by Google to uniquely identify an Order. Example: &#39;abcde12_x&#39;
 * @property {string} customId ID that can be used to externally identify an Order. This ID is provided by partners when submitting the Avails. Example: &#39;GOOGLER_2006&#39;
 * @property {string} videoId Google-generated ID identifying the video linked to this Order, once delivered. Example: &#39;gtry456_xc&#39;.
 * @property {string[]} countries Countries where the Order is available, using the &quot;ISO 3166-1 alpha-2&quot; format (example: &quot;US&quot;).
 * @property {string} type Type of the Edit linked to the Order.
 * @property {string} name Default Edit name, usually in the language of the country of origin. Example: &quot;Googlers, The&quot;.
 * @property {string} episodeName Default Episode name, usually in the language of the country of origin. Only available for TV Edits Example: &quot;Googlers, The - Pilot&quot;.
 * @property {string} seasonName Default Season name, usually in the language of the country of origin. Only available for TV Edits Example: &quot;Googlers, The - A Brave New World&quot;.
 * @property {string} showName Default Show name, usually in the language of the country of origin. Only available for TV Edits Example: &quot;Googlers, The&quot;.
 * @property {string} status High-level status of the order.
 * @property {string} statusDetail Detailed status of the order
 * @property {string} rejectionNote Field explaining why an Order has been rejected. Example: &quot;Trailer audio is 2ch mono, please re-deliver in stereo&quot;.
 * @property {string} orderedTime Timestamp when the Order was created.
 * @property {string} approvedTime Timestamp when the Order was approved.
 * @property {string} receivedTime Timestamp when the Order was fulfilled.
 * @property {string} earliestAvailStartTime Timestamp of the earliest start date of the Avails linked to this Order.
 * @property {number} priority Order priority, as defined by Google. The higher the value, the higher the priority. Example: 90
 * @property {string} legacyPriority Legacy Order priority, as defined by Google. Example: &#39;P0&#39;
 * @property {string} channelId YouTube Channel ID that should be used to fulfill the Order. Example: &quot;UCRG64darCZhb&quot;.
 * @property {string} channelName YouTube Channel Name that should be used to fulfill the Order. Example: &quot;Google_channel&quot;.
 * @property {string} studioName Name of the studio that owns the Edit ordered.
 * @property {string} pphName Name of the post-production house that manages the Edit ordered.
 * @property {string} normalizedPriority A simpler representation of the priority.
 */
/**
 * @typedef ListOrdersResponse
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {playmoviespartner(v1).Order[]} orders List of Orders that match the request criteria.
 * @property {string} nextPageToken See _List methods rules_ for info about this field.
 * @property {integer} totalSize See _List methods rules_ for more information about this field.
 */
/**
 * @typedef ExperienceLocale
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {string} elId ID internally generated by Google to uniquely identify a ExperienceLocale. Example: &#39;KRZiVjY9h7t&#39;
 * @property {string} country Country where the ExperienceLocale is available, using the &quot;ISO 3166-1 alpha-2&quot; format. Example: &quot;US&quot;.
 * @property {string} language Language of the ExperienceLocale, using the &quot;BCP 47&quot; format. Examples: &quot;en&quot;, &quot;en-US&quot;, &quot;es&quot;, &quot;es-419&quot;.
 * @property {string} videoId Video ID, as defined by Google, linked to the feature video in the ExperienceLocale. Example: &#39;gtry456_xc&#39;.
 * @property {string} trailerId Trailer ID, as defined by Google, linked to the trailer video in the ExperienceLocale. Example: &#39;gtry457_tr&#39;.
 * @property {string} titleLevelEidr Title-level EIDR ID. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-5&quot;.
 * @property {string} editLevelEidr Edit-level EIDR ID. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-6&quot;.
 * @property {string} altCutId Alternative Cut ID, sometimes available in lieu of the main Edit-level EIDR ID. This is not an EIDR ID, but a Partner-provided ID. Example: &quot;206346_79838&quot;.
 * @property {string[]} customIds List of custom IDs (defined by the partner) linked to this ExperienceLocale. Example: &quot;R86241&quot;
 * @property {string} presentationId PresentationID as defined in the EMA specs.
 * @property {string} inventoryId InventoryID as defined in the EMA specs.
 * @property {string} playableSequenceId PlayableSequenceID as defined in the EMA specs.
 * @property {string} type Type of the Edit linked to the ExperienceLocale.
 * @property {string} name Default Edit name, usually in the language of the country of origin. Example: &quot;Googlers, The&quot;.
 * @property {string} status High-level status of the ExperienceLocale.
 * @property {number} priority ExperienceLocale priority, as defined by Google. The higher the value, the higher the priority. Example: 90
 * @property {string} createdTime Timestamp when the ExperienceLocale was created.
 * @property {string} approvedTime Timestamp when the ExperienceLocale was approved.
 * @property {string} earliestAvailStartTime Timestamp of the earliest start date of the Avails linked to this ExperienceLocale.
 * @property {string} channelId YouTube Channel ID linked to the ExperienceLocale. Example: &quot;UCRG64darCZhb&quot;.
 * @property {string} studioName Name of the studio that owns the ExperienceLocale.
 * @property {string[]} pphNames Name of the post-production houses that manage the ExperienceLocale.
 * @property {string} normalizedPriority A simpler representation of the priority.
 */
/**
 * @typedef ListExperienceLocalesResponse
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {playmoviespartner(v1).ExperienceLocale[]} experienceLocales List of ExperienceLocales that match the request criteria.
 * @property {string} nextPageToken See _List methods rules_ for info about this field.
 * @property {integer} totalSize See _List methods rules_ for more information about this field.
 */
/**
 * @typedef Component
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {string} componentId ID internally generated by Google to uniquely identify the Component. Example: &#39;wteyrc_647xc&#39;
 * @property {string} type Type of the Component. Example: AUDIO_51
 * @property {string[]} elIds IDs internally generated by Google to uniquely identify the ExperienceLocales for which the Component is used. Example: &#39;KRZiVjY9h7t&#39;
 * @property {string} language Language of the component, using the &quot;BCP 47&quot; format. Examples: &quot;en&quot;, &quot;en-US&quot;, &quot;es&quot;, &quot;es-419&quot;.
 * @property {string[]} titleLevelEidrs List of Title-level EIDR IDs. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-5&quot;.
 * @property {string[]} editLevelEidrs List of Edit-level EIDR IDs. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-6&quot;.
 * @property {string[]} altCutIds List of Alternative Cut IDs, sometimes available in lieu of the main Edit-level EIDR IDs. This is not an EIDR ID, but a Partner-provided ID. Example: &quot;206346_79838&quot;.
 * @property {string[]} customIds List of custom IDs (defined by the partner) linked to the ExperienceLocale using this Component. Example: &quot;R86241&quot;
 * @property {string} componentDetailType Detail about the type of the Component.
 * @property {string} playableUnitType Type of the playable unit for which the Component is intended.
 * @property {string} status High-level status of the Component.
 * @property {string} statusDetail Detailed status of the Component
 * @property {string} rejectionNote Notes explaining why a Component has been rejected.
 * @property {string} approvedTime Timestamp when the Component was approved.
 * @property {string} name Default Edit name, usually in the language of the country of origin. Example: &quot;Googlers, The&quot;.
 * @property {string[]} processingErrors Processing errors during XML file parsing. Example: &#39;Invalid input file&#39;
 * @property {number} priority Component priority, as defined by Google. The higher the value, the higher the priority.
 * @property {string} receivedTime Timestamp when the Component was received.
 * @property {string} filename File name of the Component when delivered.
 * @property {string} studioName Name of the studio that owns the Component.
 * @property {string} pphName Name of the post-production house that manages the Component.
 * @property {string} normalizedPriority A simpler representation of the priority.
 */
/**
 * @typedef ListComponentsResponse
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {playmoviespartner(v1).Component[]} components List of Components that match the request criteria.
 * @property {string} nextPageToken See _List methods rules_ for info about this field.
 * @property {integer} totalSize See _List methods rules_ for more information about this field.
 */
/**
 * @typedef StoreInfo
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {string} videoId Google-generated ID identifying the video linked to the Edit. Example: &#39;gtry456_xc&#39;
 * @property {string} seasonId Google-generated ID identifying the season linked to the Edit. Only available for TV Edits. Example: &#39;ster23ex&#39;
 * @property {string} showId Google-generated ID identifying the show linked to the Edit. Only available for TV Edits. Example: &#39;et2hsue_x&#39;
 * @property {string} country Country where Edit is available in ISO 3166-1 alpha-2 country code. Example: &quot;US&quot;.
 * @property {string} liveTime Timestamp when the Edit went live on the Store.
 * @property {string} type Edit type, like Movie, Episode or Season.
 * @property {string} name Default Edit name, usually in the language of the country of origin. Example: &quot;Googlers, The&quot;.
 * @property {string} titleLevelEidr Title-level EIDR ID. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-5&quot;.
 * @property {string} editLevelEidr Edit-level EIDR ID. Example: &quot;10.5240/1489-49A2-3956-4B2D-FE16-6&quot;.
 * @property {string} seasonName Default Season name, usually in the language of the country of origin. Only available for TV Edits Example: &quot;Googlers, The - A Brave New World&quot;.
 * @property {string} showName Default Show name, usually in the language of the country of origin. Only available for TV Edits Example: &quot;Googlers, The&quot;.
 * @property {string} seasonNumber The number assigned to the season within a show. Only available on TV Edits. Example: &quot;1&quot;.
 * @property {string} episodeNumber The number assigned to the episode within a season. Only available on TV Edits. Example: &quot;1&quot;.
 * @property {boolean} hasSdOffer Whether the Edit has a SD offer.
 * @property {boolean} hasHdOffer Whether the Edit has a HD offer.
 * @property {boolean} hasVodOffer Whether the Edit has a VOD offer.
 * @property {boolean} hasEstOffer Whether the Edit has a EST offer.
 * @property {boolean} hasAudio51 Whether the Edit has a 5.1 channel audio track.
 * @property {string[]} audioTracks Audio tracks available for this Edit.
 * @property {string[]} subtitles Subtitles available for this Edit.
 * @property {boolean} hasInfoCards Whether the Edit has info cards.
 * @property {string} mid Knowledge Graph ID associated to this Edit, if available. This ID links the Edit to its knowledge entity, externally accessible at http://freebase.com. In the absense of Title EIDR or Edit EIDR, this ID helps link together multiple Edits across countries. Example: &#39;/m/0ffx29&#39;
 * @property {string} trailerId Google-generated ID identifying the trailer linked to the Edit. Example: &#39;bhd_4e_cx&#39;
 * @property {string} studioName Name of the studio that owns the Edit ordered.
 * @property {string[]} pphNames Name of the post-production houses that manage the Edit.
 */
/**
 * @typedef ListStoreInfosResponse
 * @memberOf! playmoviespartner(v1)
 * @type object
 * @property {playmoviespartner(v1).StoreInfo[]} storeInfos List of StoreInfos that match the request criteria.
 * @property {string} nextPageToken See &#39;List methods rules&#39; for info about this field.
 * @property {integer} totalSize See _List methods rules_ for more information about this field.
 */
module.exports = Playmoviespartner;
