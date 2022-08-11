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
 * PageSpeed Insights API
 *
 * Analyzes the performance of a web page and provides tailored suggestions to make that page faster.
 *
 * @example
 * var google = require('googleapis');
 * var pagespeedonline = google.pagespeedonline('v2');
 *
 * @namespace pagespeedonline
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Pagespeedonline
 */
function Pagespeedonline(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.pagespeedapi = {

    /**
     * pagespeedonline.pagespeedapi.runpagespeed
     *
     * @desc Runs PageSpeed analysis on the page at the specified URL, and returns PageSpeed scores, a list of suggestions to make that page faster, and other information.
     *
     * @alias pagespeedonline.pagespeedapi.runpagespeed
     * @memberOf! pagespeedonline(v2)
     *
     * @param {object} params Parameters for request
     * @param {boolean=} params.filter_third_party_resources Indicates if third party resources should be filtered out before PageSpeed analysis.
     * @param {string=} params.locale The locale used to localize formatted results
     * @param {string=} params.rule A PageSpeed rule to run; if none are given, all rules are run
     * @param {boolean=} params.screenshot Indicates if binary data containing a screenshot should be included
     * @param {string=} params.strategy The analysis strategy to use
     * @param {string} params.url The URL to fetch and analyze
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    runpagespeed: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['url'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef PagespeedApiFormatStringV2
 * @memberOf! pagespeedonline(v2)
 * @type object
 * @property {object[]} args List of arguments for the format string.
 * @property {string} format A localized format string with {{FOO}} placeholders, where &#39;FOO&#39; is the key of the argument whose value should be substituted. For HYPERLINK arguments, the format string will instead contain {{BEGIN_FOO}} and {{END_FOO}} for the argument with key &#39;FOO&#39;.
 */
/**
 * @typedef PagespeedApiImageV2
 * @memberOf! pagespeedonline(v2)
 * @type object
 * @property {string} data Image data base64 encoded.
 * @property {integer} height Height of screenshot in pixels.
 * @property {string} key Unique string key, if any, identifying this image.
 * @property {string} mime_type Mime type of image data (e.g. &quot;image/jpeg&quot;).
 * @property {object} page_rect The region of the page that is captured by this image, with dimensions measured in CSS pixels.
 * @property {integer} width Width of screenshot in pixels.
 */
/**
 * @typedef Result
 * @memberOf! pagespeedonline(v2)
 * @type object
 * @property {object} formattedResults Localized PageSpeed results. Contains a ruleResults entry for each PageSpeed rule instantiated and run by the server.
 * @property {string} id Canonicalized and final URL for the document, after following page redirects (if any).
 * @property {string[]} invalidRules List of rules that were specified in the request, but which the server did not know how to instantiate.
 * @property {string} kind Kind of result.
 * @property {object} pageStats Summary statistics for the page, such as number of JavaScript bytes, number of HTML bytes, etc.
 * @property {integer} responseCode Response code for the document. 200 indicates a normal page load. 4xx/5xx indicates an error.
 * @property {object} ruleGroups A map with one entry for each rule group in these results.
 * @property {pagespeedonline(v2).PagespeedApiImageV2} screenshot Base64-encoded screenshot of the page that was analyzed.
 * @property {string} title Title of the page, as displayed in the browser&#39;s title bar.
 * @property {object} version The version of PageSpeed used to generate these results.
 */
module.exports = Pagespeedonline;
