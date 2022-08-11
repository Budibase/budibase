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
 * var pagespeedonline = google.pagespeedonline('v1');
 *
 * @namespace pagespeedonline
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Pagespeedonline
 */
function Pagespeedonline(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.pagespeedapi = {

    /**
     * pagespeedonline.pagespeedapi.runpagespeed
     *
     * @desc Runs PageSpeed analysis on the page at the specified URL, and returns a PageSpeed score, a list of suggestions to make that page faster, and other information.
     *
     * @alias pagespeedonline.pagespeedapi.runpagespeed
     * @memberOf! pagespeedonline(v1)
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
          url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed',
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
 * @typedef Result
 * @memberOf! pagespeedonline(v1)
 * @type object
 * @property {object} formattedResults Localized PageSpeed results. Contains a ruleResults entry for each PageSpeed rule instantiated and run by the server.
 * @property {string} id Canonicalized and final URL for the document, after following page redirects (if any).
 * @property {string[]} invalidRules List of rules that were specified in the request, but which the server did not know how to instantiate.
 * @property {string} kind Kind of result.
 * @property {object} pageStats Summary statistics for the page, such as number of JavaScript bytes, number of HTML bytes, etc.
 * @property {integer} responseCode Response code for the document. 200 indicates a normal page load. 4xx/5xx indicates an error.
 * @property {integer} score The PageSpeed Score (0-100), which indicates how much faster a page could be. A high score indicates little room for improvement, while a lower score indicates more room for improvement.
 * @property {object} screenshot Base64-encoded screenshot of the page that was analyzed.
 * @property {string} title Title of the page, as displayed in the browser&#39;s title bar.
 * @property {object} version The version of PageSpeed used to generate these results.
 */
module.exports = Pagespeedonline;
