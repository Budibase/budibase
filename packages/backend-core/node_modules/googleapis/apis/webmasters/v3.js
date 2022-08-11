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
 * Search Console API
 *
 * View Google Search Console data for your verified sites.
 *
 * @example
 * var google = require('googleapis');
 * var webmasters = google.webmasters('v3');
 *
 * @namespace webmasters
 * @type {Function}
 * @version v3
 * @variation v3
 * @param {object=} options Options for Webmasters
 */
function Webmasters(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.searchanalytics = {

    /**
     * webmasters.searchanalytics.query
     *
     * @desc Query your data with filters and parameters that you define. Returns zero or more rows grouped by the row keys that you define. You must define a date range of one or more days.  When date is one of the group by values, any days without data are omitted from the result list. If you need to know which days have data, issue a broad date range query grouped by date for any metric, and see which day rows are returned.
     *
     * @alias webmasters.searchanalytics.query
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
     * @param {webmasters(v3).SearchAnalyticsQueryRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sitemaps = {

    /**
     * webmasters.sitemaps.delete
     *
     * @desc Deletes a sitemap from this site.
     *
     * @alias webmasters.sitemaps.delete
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.feedpath The URL of the actual sitemap. For example: http://www.example.com/sitemap.xml
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'feedpath'],
        pathParams: ['feedpath', 'siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sitemaps.get
     *
     * @desc Retrieves information about a specific sitemap.
     *
     * @alias webmasters.sitemaps.get
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.feedpath The URL of the actual sitemap. For example: http://www.example.com/sitemap.xml
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'feedpath'],
        pathParams: ['feedpath', 'siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sitemaps.list
     *
     * @desc Lists the sitemaps-entries submitted for this site, or included in the sitemap index file (if sitemapIndex is specified in the request).
     *
     * @alias webmasters.sitemaps.list
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
     * @param {string=} params.sitemapIndex A URL of a site's sitemap index. For example: http://www.example.com/sitemapindex.xml
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sitemaps.submit
     *
     * @desc Submits a sitemap for a site.
     *
     * @alias webmasters.sitemaps.submit
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.feedpath The URL of the sitemap to add. For example: http://www.example.com/sitemap.xml
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    submit: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'feedpath'],
        pathParams: ['feedpath', 'siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.sites = {

    /**
     * webmasters.sites.add
     *
     * @desc Adds a site to the set of the user's sites in Search Console.
     *
     * @alias webmasters.sites.add
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.siteUrl The URL of the site to add.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    add: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sites.delete
     *
     * @desc Removes a site from the set of the user's Search Console sites.
     *
     * @alias webmasters.sites.delete
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.siteUrl The URI of the property as defined in Search Console. Examples: http://www.example.com/ or android-app://com.example/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sites.get
     *
     * @desc Retrieves information about specific site.
     *
     * @alias webmasters.sites.get
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.siteUrl The URI of the property as defined in Search Console. Examples: http://www.example.com/ or android-app://com.example/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.sites.list
     *
     * @desc Lists the user's Search Console sites.
     *
     * @alias webmasters.sites.list
     * @memberOf! webmasters(v3)
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
          url: 'https://www.googleapis.com/webmasters/v3/sites',
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

  self.urlcrawlerrorscounts = {

    /**
     * webmasters.urlcrawlerrorscounts.query
     *
     * @desc Retrieves a time series of the number of URL crawl errors per error category and platform.
     *
     * @alias webmasters.urlcrawlerrorscounts.query
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.category The crawl error category. For example: serverError. If not specified, returns results for all categories.
     * @param {boolean=} params.latestCountsOnly If true, returns only the latest crawl error counts.
     * @param {string=} params.platform The user agent type (platform) that made the request. For example: web. If not specified, returns results for all platforms.
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/urlCrawlErrorsCounts/query',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.urlcrawlerrorssamples = {

    /**
     * webmasters.urlcrawlerrorssamples.get
     *
     * @desc Retrieves details about crawl errors for a site's sample URL.
     *
     * @alias webmasters.urlcrawlerrorssamples.get
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.category The crawl error category. For example: authPermissions
     * @param {string} params.platform The user agent type (platform) that made the request. For example: web
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
     * @param {string} params.url The relative path (without the site) of the sample URL. It must be one of the URLs returned by list(). For example, for the URL https://www.example.com/pagename on the site https://www.example.com/, the url value is pagename
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/urlCrawlErrorsSamples/{url}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'url', 'category', 'platform'],
        pathParams: ['siteUrl', 'url'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.urlcrawlerrorssamples.list
     *
     * @desc Lists a site's sample URLs for the specified crawl error category and platform.
     *
     * @alias webmasters.urlcrawlerrorssamples.list
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.category The crawl error category. For example: authPermissions
     * @param {string} params.platform The user agent type (platform) that made the request. For example: web
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
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
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/urlCrawlErrorsSamples',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'category', 'platform'],
        pathParams: ['siteUrl'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * webmasters.urlcrawlerrorssamples.markAsFixed
     *
     * @desc Marks the provided site's sample URL as fixed, and removes it from the samples list.
     *
     * @alias webmasters.urlcrawlerrorssamples.markAsFixed
     * @memberOf! webmasters(v3)
     *
     * @param {object} params Parameters for request
     * @param {string} params.category The crawl error category. For example: authPermissions
     * @param {string} params.platform The user agent type (platform) that made the request. For example: web
     * @param {string} params.siteUrl The site's URL, including protocol. For example: http://www.example.com/
     * @param {string} params.url The relative path (without the site) of the sample URL. It must be one of the URLs returned by list(). For example, for the URL https://www.example.com/pagename on the site https://www.example.com/, the url value is pagename
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    markAsFixed: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/urlCrawlErrorsSamples/{url}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['siteUrl', 'url', 'category', 'platform'],
        pathParams: ['siteUrl', 'url'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef ApiDataRow
 * @memberOf! webmasters(v3)
 * @type object
 * @property {number} clicks 
 * @property {number} ctr 
 * @property {number} impressions 
 * @property {string[]} keys 
 * @property {number} position 
 */
/**
 * @typedef ApiDimensionFilter
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} dimension 
 * @property {string} expression 
 * @property {string} operator 
 */
/**
 * @typedef ApiDimensionFilterGroup
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).ApiDimensionFilter[]} filters 
 * @property {string} groupType 
 */
/**
 * @typedef SearchAnalyticsQueryRequest
 * @memberOf! webmasters(v3)
 * @type object
* @property {string} aggregationType [Optional; Default is &quot;auto&quot;] How data is aggregated. If aggregated by property, all data for the same property is aggregated; if aggregated by page, all data is aggregated by canonical URI. If you filter or group by page, choose AUTO; otherwise you can aggregate either by property or by page, depending on how you want your data calculated; see  the help documentation to learn how data is calculated differently by site versus by page.

Note: If you group or filter by page, you cannot aggregate by property.

If you specify any value other than AUTO, the aggregation type in the result will match the requested type, or if you request an invalid type, you will get an error. The API will never change your aggregation type if the requested type is invalid.
* @property {webmasters(v3).ApiDimensionFilterGroup[]} dimensionFilterGroups [Optional] Zero or more filters to apply to the dimension grouping values; for example, &#39;query contains &quot;buy&quot;&#39; to see only data where the query string contains the substring &quot;buy&quot; (not case-sensitive). You can filter by a dimension without grouping by it.
* @property {string[]} dimensions [Optional] Zero or more dimensions to group results by. Dimensions are the group-by values in the Search Analytics page. Dimensions are combined to create a unique row key for each row. Results are grouped in the order that you supply these dimensions.
* @property {string} endDate [Required] End date of the requested date range, in YYYY-MM-DD format, in PST (UTC - 8:00). Must be greater than or equal to the start date. This value is included in the range.
* @property {integer} rowLimit [Optional; Default is 1000] The maximum number of rows to return. Must be a number from 1 to 5,000 (inclusive).
* @property {string} searchType [Optional; Default is &quot;web&quot;] The search type to filter for.
* @property {string} startDate [Required] Start date of the requested date range, in YYYY-MM-DD format, in PST time (UTC - 8:00). Must be less than or equal to the end date. This value is included in the range.
* @property {integer} startRow [Optional; Default is 0] Zero-based index of the first row in the response. Must be a non-negative number.
*/
/**
 * @typedef SearchAnalyticsQueryResponse
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} responseAggregationType How the results were aggregated.
 * @property {webmasters(v3).ApiDataRow[]} rows A list of rows grouped by the key values in the order given in the query.
 */
/**
 * @typedef SitemapsListResponse
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).WmxSitemap[]} sitemap Contains detailed information about a specific URL submitted as a sitemap.
 */
/**
 * @typedef SitesListResponse
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).WmxSite[]} siteEntry Contains permission level information about a Search Console site. For more information, see Permissions in Search Console.
 */
/**
 * @typedef UrlCrawlErrorCount
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} count The error count at the given timestamp.
 * @property {string} timestamp The date and time when the crawl attempt took place, in RFC 3339 format.
 */
/**
 * @typedef UrlCrawlErrorCountsPerType
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} category The crawl error type.
 * @property {webmasters(v3).UrlCrawlErrorCount[]} entries The error count entries time series.
 * @property {string} platform The general type of Googlebot that made the request (see list of Googlebot user-agents for the user-agents used).
 */
/**
 * @typedef UrlCrawlErrorsCountsQueryResponse
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).UrlCrawlErrorCountsPerType[]} countPerTypes The time series of the number of URL crawl errors per error category and platform.
 */
/**
 * @typedef UrlCrawlErrorsSample
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} first_detected The time the error was first detected, in RFC 3339 format.
 * @property {string} last_crawled The time when the URL was last crawled, in RFC 3339 format.
 * @property {string} pageUrl The URL of an error, relative to the site.
 * @property {integer} responseCode The HTTP response code, if any.
 * @property {webmasters(v3).UrlSampleDetails} urlDetails Additional details about the URL, set only when calling get().
 */
/**
 * @typedef UrlCrawlErrorsSamplesListResponse
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).UrlCrawlErrorsSample[]} urlCrawlErrorSample Information about the sample URL and its crawl error.
 */
/**
 * @typedef UrlSampleDetails
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string[]} containingSitemaps List of sitemaps pointing at this URL.
 * @property {string[]} linkedFromUrls A sample set of URLs linking to this URL.
 */
/**
 * @typedef WmxSite
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} permissionLevel The user&#39;s permission level for the site.
 * @property {string} siteUrl The URL of the site.
 */
/**
 * @typedef WmxSitemap
 * @memberOf! webmasters(v3)
 * @type object
 * @property {webmasters(v3).WmxSitemapContent[]} contents The various content types in the sitemap.
 * @property {string} errors Number of errors in the sitemap. These are issues with the sitemap itself that need to be fixed before it can be processed correctly.
 * @property {boolean} isPending If true, the sitemap has not been processed.
 * @property {boolean} isSitemapsIndex If true, the sitemap is a collection of sitemaps.
 * @property {string} lastDownloaded Date &amp; time in which this sitemap was last downloaded. Date format is in RFC 3339 format (yyyy-mm-dd).
 * @property {string} lastSubmitted Date &amp; time in which this sitemap was submitted. Date format is in RFC 3339 format (yyyy-mm-dd).
 * @property {string} path The url of the sitemap.
 * @property {string} type The type of the sitemap. For example: rssFeed.
 * @property {string} warnings Number of warnings for the sitemap. These are generally non-critical issues with URLs in the sitemaps.
 */
/**
 * @typedef WmxSitemapContent
 * @memberOf! webmasters(v3)
 * @type object
 * @property {string} indexed The number of URLs from the sitemap that were indexed (of the content type).
 * @property {string} submitted The number of URLs in the sitemap (of the content type).
 * @property {string} type The specific type of content in this sitemap. For example: web.
 */
module.exports = Webmasters;
