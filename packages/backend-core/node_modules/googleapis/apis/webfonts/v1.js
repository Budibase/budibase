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
 * Google Fonts Developer API
 *
 * Accesses the metadata for all families served by Google Fonts, providing a list of families currently available (including available styles and a list of supported script subsets).
 *
 * @example
 * var google = require('googleapis');
 * var webfonts = google.webfonts('v1');
 *
 * @namespace webfonts
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Webfonts
 */
function Webfonts(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.webfonts = {

    /**
     * webfonts.webfonts.list
     *
     * @desc Retrieves the list of fonts currently served by the Google Fonts Developer API
     *
     * @alias webfonts.webfonts.list
     * @memberOf! webfonts(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.sort Enables sorting of the list
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
          url: 'https://www.googleapis.com/webfonts/v1/webfonts',
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
 * @typedef Webfont
 * @memberOf! webfonts(v1)
 * @type object
 * @property {string} category The category of the font.
 * @property {string} family The name of the font.
 * @property {object} files The font files (with all supported scripts) for each one of the available variants, as a key : value map.
 * @property {string} kind This kind represents a webfont object in the webfonts service.
 * @property {string} lastModified The date (format &quot;yyyy-MM-dd&quot;) the font was modified for the last time.
 * @property {string[]} subsets The scripts supported by the font.
 * @property {string[]} variants The available variants for the font.
 * @property {string} version The font version.
 */
/**
 * @typedef WebfontList
 * @memberOf! webfonts(v1)
 * @type object
 * @property {webfonts(v1).Webfont[]} items The list of fonts currently served by the Google Fonts API.
 * @property {string} kind This kind represents a list of webfont objects in the webfonts service.
 */
module.exports = Webfonts;
