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
 * Knowledge Graph Search API
 *
 * Knowledge Graph Search API allows developers to search the Google Knowledge Graph for entities.
 *
 * @example
 * var google = require('googleapis');
 * var kgsearch = google.kgsearch('v1');
 *
 * @namespace kgsearch
 * @type {Function}
 * @version v1
 * @variation v1
 * @param {object=} options Options for Kgsearch
 */
function Kgsearch(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.entities = {

    /**
     * kgsearch.entities.search
     *
     * @desc Searches Knowledge Graph for entities that match the constraints. A list of matched entities will be returned in response, which will be in JSON-LD format and compatible with http://schema.org
     *
     * @alias kgsearch.entities.search
     * @memberOf! kgsearch(v1)
     *
     * @param {object=} params Parameters for request
     * @param {string=} params.query The literal query string for search.
     * @param {string=} params.ids The list of entity id to be used for search instead of query string.
     * @param {string=} params.languages The list of language codes (defined in ISO 693) to run the query with, e.g. 'en'.
     * @param {string=} params.types Restricts returned entities with these types, e.g. Person (as defined in http://schema.org/Person).
     * @param {boolean=} params.indent Enables indenting of json results.
     * @param {boolean=} params.prefix Enables prefix match against names and aliases of entities
     * @param {integer=} params.limit Limits the number of entities to be returned.
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    search: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://kgsearch.googleapis.com/v1/entities:search',
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
 * @typedef SearchResponse
 * @memberOf! kgsearch(v1)
 * @type object
 * @property {any} context The local context applicable for the response. See more details at http://www.w3.org/TR/json-ld/#context-definitions.
 * @property {any} type The schema type of top-level JSON-LD object, e.g. ItemList.
 * @property {any[]} itemListElement The item list of search results.
 */
module.exports = Kgsearch;
