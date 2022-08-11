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
 * URL Shortener API
 *
 * Lets you create, inspect, and manage goo.gl short URLs
 *
 * @example
 * var google = require('googleapis');
 * var urlshortener = google.urlshortener('v1');
 *
 * @namespace urlshortener
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Urlshortener
 */
function Urlshortener(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.url = {

    /**
     * urlshortener.url.get
     *
     * @desc Expands a short URL or gets creation time and analytics.
     *
     * @alias urlshortener.url.get
     * @memberOf! urlshortener(v1)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.projection Additional information to return.
     * @param {string} params.shortUrl The short URL, including the protocol.
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
          url: 'https://www.googleapis.com/urlshortener/v1/url',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['shortUrl'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * urlshortener.url.insert
     *
     * @desc Creates a new short URL.
     *
     * @alias urlshortener.url.insert
     * @memberOf! urlshortener(v1)
     *
     * @param {object} params Parameters for request
     * @param {urlshortener(v1).Url} params.resource Request body data
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
          url: 'https://www.googleapis.com/urlshortener/v1/url',
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
     * urlshortener.url.list
     *
     * @desc Retrieves a list of URLs shortened by a user.
     *
     * @alias urlshortener.url.list
     * @memberOf! urlshortener(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.projection Additional information to return.
     * @param {string=} params.start-token Token for requesting successive pages of results.
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
          url: 'https://www.googleapis.com/urlshortener/v1/url/history',
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
 * @typedef AnalyticsSnapshot
 * @memberOf! urlshortener(v1)
 * @type object
 * @property {urlshortener(v1).StringCount[]} browsers Top browsers, e.g. &quot;Chrome&quot;; sorted by (descending) click counts. Only present if this data is available.
 * @property {urlshortener(v1).StringCount[]} countries Top countries (expressed as country codes), e.g. &quot;US&quot; or &quot;DE&quot;; sorted by (descending) click counts. Only present if this data is available.
 * @property {string} longUrlClicks Number of clicks on all goo.gl short URLs pointing to this long URL.
 * @property {urlshortener(v1).StringCount[]} platforms Top platforms or OSes, e.g. &quot;Windows&quot;; sorted by (descending) click counts. Only present if this data is available.
 * @property {urlshortener(v1).StringCount[]} referrers Top referring hosts, e.g. &quot;www.google.com&quot;; sorted by (descending) click counts. Only present if this data is available.
 * @property {string} shortUrlClicks Number of clicks on this short URL.
 */
/**
 * @typedef AnalyticsSummary
 * @memberOf! urlshortener(v1)
 * @type object
 * @property {urlshortener(v1).AnalyticsSnapshot} allTime Click analytics over all time.
 * @property {urlshortener(v1).AnalyticsSnapshot} day Click analytics over the last day.
 * @property {urlshortener(v1).AnalyticsSnapshot} month Click analytics over the last month.
 * @property {urlshortener(v1).AnalyticsSnapshot} twoHours Click analytics over the last two hours.
 * @property {urlshortener(v1).AnalyticsSnapshot} week Click analytics over the last week.
 */
/**
 * @typedef StringCount
 * @memberOf! urlshortener(v1)
 * @type object
 * @property {string} count Number of clicks for this top entry, e.g. for this particular country or browser.
 * @property {string} id Label assigned to this top entry, e.g. &quot;US&quot; or &quot;Chrome&quot;.
 */
/**
 * @typedef Url
 * @memberOf! urlshortener(v1)
 * @type object
 * @property {urlshortener(v1).AnalyticsSummary} analytics A summary of the click analytics for the short and long URL. Might not be present if not requested or currently unavailable.
 * @property {string} created Time the short URL was created; ISO 8601 representation using the yyyy-MM-dd&#39;T&#39;HH:mm:ss.SSSZZ format, e.g. &quot;2010-10-14T19:01:24.944+00:00&quot;.
 * @property {string} id Short URL, e.g. &quot;http://goo.gl/l6MS&quot;.
 * @property {string} kind The fixed string &quot;urlshortener#url&quot;.
 * @property {string} longUrl Long URL, e.g. &quot;http://www.google.com/&quot;. Might not be present if the status is &quot;REMOVED&quot;.
 * @property {string} status Status of the target URL. Possible values: &quot;OK&quot;, &quot;MALWARE&quot;, &quot;PHISHING&quot;, or &quot;REMOVED&quot;. A URL might be marked &quot;REMOVED&quot; if it was flagged as spam, for example.
 */
/**
 * @typedef UrlHistory
 * @memberOf! urlshortener(v1)
 * @type object
 * @property {urlshortener(v1).Url[]} items A list of URL resources.
 * @property {integer} itemsPerPage Number of items returned with each full &quot;page&quot; of results. Note that the last page could have fewer items than the &quot;itemsPerPage&quot; value.
 * @property {string} kind The fixed string &quot;urlshortener#urlHistory&quot;.
 * @property {string} nextPageToken A token to provide to get the next page of results.
 * @property {integer} totalItems Total number of short URLs associated with this user (may be approximate).
 */
module.exports = Urlshortener;
