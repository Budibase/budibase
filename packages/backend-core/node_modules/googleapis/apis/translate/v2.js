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
 * Translate API
 *
 * Translates text from one language to another.
 *
 * @example
 * var google = require('googleapis');
 * var translate = google.translate('v2');
 *
 * @namespace translate
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Translate
 */
function Translate(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.detections = {

    /**
     * language.detections.list
     *
     * @desc Detect the language of text.
     *
     * @alias language.detections.list
     * @memberOf! translate(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.q The text to detect
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
          url: 'https://www.googleapis.com/language/translate/v2/detect',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['q'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.languages = {

    /**
     * language.languages.list
     *
     * @desc List the source/target languages supported by the API
     *
     * @alias language.languages.list
     * @memberOf! translate(v2)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.target the language and collation in which the localized results should be returned
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
          url: 'https://www.googleapis.com/language/translate/v2/languages',
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

  self.translations = {

    /**
     * language.translations.list
     *
     * @desc Returns text translations from one language to another.
     *
     * @alias language.translations.list
     * @memberOf! translate(v2)
     *
     * @param {object} params Parameters for request
     * @param {string=} params.cid The customization id for translate
     * @param {string=} params.format The format of the text
     * @param {string} params.q The text to translate
     * @param {string=} params.source The source language of the text
     * @param {string} params.target The target language into which the text should be translated
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
          url: 'https://www.googleapis.com/language/translate/v2',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['q', 'target'],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef DetectionsListResponse
 * @memberOf! translate(v2)
 * @type object
 * @property {translate(v2).DetectionsResource[]} detections A detections contains detection results of several text
 */
/**
 * @typedef DetectionsResource
 * @memberOf! translate(v2)
 * @type array
 */
/**
 * @typedef LanguagesListResponse
 * @memberOf! translate(v2)
 * @type object
 * @property {translate(v2).LanguagesResource[]} languages List of source/target languages supported by the translation API. If target parameter is unspecified, the list is sorted by the ASCII code point order of the language code. If target parameter is specified, the list is sorted by the collation order of the language name in the target language.
 */
/**
 * @typedef LanguagesResource
 * @memberOf! translate(v2)
 * @type object
 * @property {string} language The language code.
 * @property {string} name The localized name of the language if target parameter is given.
 */
/**
 * @typedef TranslationsListResponse
 * @memberOf! translate(v2)
 * @type object
 * @property {translate(v2).TranslationsResource[]} translations Translations contains list of translation results of given text
 */
/**
 * @typedef TranslationsResource
 * @memberOf! translate(v2)
 * @type object
 * @property {string} detectedSourceLanguage Detected source language if source parameter is unspecified.
 * @property {string} translatedText The translation.
 */
module.exports = Translate;
