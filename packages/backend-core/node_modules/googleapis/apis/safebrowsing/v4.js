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
 * Safe Browsing APIs
 *
 * Enables client applications to check web resources (most commonly URLs) against Google-generated lists of unsafe web resources.
 *
 * @example
 * var google = require('googleapis');
 * var safebrowsing = google.safebrowsing('v4');
 *
 * @namespace safebrowsing
 * @type {Function}
 * @version v4
 * @variation v4
 * @param {object=} options Options for Safebrowsing
 */
function Safebrowsing(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.threatMatches = {

    /**
     * safebrowsing.threatMatches.find
     *
     * @desc Finds the threat entries that match the Safe Browsing lists.
     *
     * @alias safebrowsing.threatMatches.find
     * @memberOf! safebrowsing(v4)
     *
     * @param {object} params Parameters for request
     * @param {safebrowsing(v4).FindThreatMatchesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    find: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://safebrowsing.googleapis.com/v4/threatMatches:find',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.threatListUpdates = {

    /**
     * safebrowsing.threatListUpdates.fetch
     *
     * @desc Fetches the most recent threat list updates. A client can request updates for multiple lists at once.
     *
     * @alias safebrowsing.threatListUpdates.fetch
     * @memberOf! safebrowsing(v4)
     *
     * @param {object} params Parameters for request
     * @param {safebrowsing(v4).FetchThreatListUpdatesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    fetch: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://safebrowsing.googleapis.com/v4/threatListUpdates:fetch',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.fullHashes = {

    /**
     * safebrowsing.fullHashes.find
     *
     * @desc Finds the full hashes that match the requested hash prefixes.
     *
     * @alias safebrowsing.fullHashes.find
     * @memberOf! safebrowsing(v4)
     *
     * @param {object} params Parameters for request
     * @param {safebrowsing(v4).FindFullHashesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    find: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://safebrowsing.googleapis.com/v4/fullHashes:find',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.threatLists = {

    /**
     * safebrowsing.threatLists.list
     *
     * @desc Lists the Safe Browsing threat lists available for download.
     *
     * @alias safebrowsing.threatLists.list
     * @memberOf! safebrowsing(v4)
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
          url: 'https://safebrowsing.googleapis.com/v4/threatLists',
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
 * @typedef FindThreatMatchesRequest
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ClientInfo} client The client metadata.
 * @property {safebrowsing(v4).ThreatInfo} threatInfo The lists and entries to be checked for matches.
 */
/**
 * @typedef ClientInfo
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} clientId A client ID that (hopefully) uniquely identifies the client implementation of the Safe Browsing API.
 * @property {string} clientVersion The version of the client implementation.
 */
/**
 * @typedef ThreatInfo
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string[]} threatTypes The threat types to be checked.
 * @property {string[]} platformTypes The platform types to be checked.
 * @property {string[]} threatEntryTypes The entry types to be checked.
 * @property {safebrowsing(v4).ThreatEntry[]} threatEntries The threat entries to be checked.
 */
/**
 * @typedef ThreatEntry
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} hash A hash prefix, consisting of the most significant 4-32 bytes of a SHA256 hash. This field is in binary format.
 * @property {string} url A URL.
 * @property {string} digest The digest of an executable in SHA256 format. The API supports both binary and hex digests.
 */
/**
 * @typedef FindThreatMatchesResponse
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ThreatMatch[]} matches The threat list matches.
 */
/**
 * @typedef ThreatMatch
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} threatType The threat type matching this threat.
 * @property {string} platformType The platform type matching this threat.
 * @property {string} threatEntryType The threat entry type matching this threat.
 * @property {safebrowsing(v4).ThreatEntry} threat The threat matching this threat.
 * @property {safebrowsing(v4).ThreatEntryMetadata} threatEntryMetadata Optional metadata associated with this threat.
 * @property {string} cacheDuration The cache lifetime for the returned match. Clients must not cache this response for more than this duration to avoid false positives.
 */
/**
 * @typedef ThreatEntryMetadata
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).MetadataEntry[]} entries The metadata entries.
 */
/**
 * @typedef MetadataEntry
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} key The metadata entry key.
 * @property {string} value The metadata entry value.
 */
/**
 * @typedef FetchThreatListUpdatesRequest
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ClientInfo} client The client metadata.
 * @property {safebrowsing(v4).ListUpdateRequest[]} listUpdateRequests The requested threat list updates.
 */
/**
 * @typedef ListUpdateRequest
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} threatType The type of threat posed by entries present in the list.
 * @property {string} platformType The type of platform at risk by entries present in the list.
 * @property {string} threatEntryType The types of entries present in the list.
 * @property {string} state The current state of the client for the requested list (the encrypted client state that was received from the last successful list update).
 * @property {safebrowsing(v4).Constraints} constraints The constraints associated with this request.
 */
/**
 * @typedef Constraints
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {integer} maxUpdateEntries The maximum size in number of entries. The update will not contain more entries than this value. This should be a power of 2 between 2**10 and 2**20. If zero, no update size limit is set.
 * @property {integer} maxDatabaseEntries Sets the maximum number of entries that the client is willing to have in the local database. This should be a power of 2 between 2**10 and 2**20. If zero, no database size limit is set.
 * @property {string} region Requests the list for a specific geographic location. If not set the server may pick that value based on the user&#39;s IP address. Expects ISO 3166-1 alpha-2 format.
 * @property {string[]} supportedCompressions The compression types supported by the client.
 */
/**
 * @typedef FetchThreatListUpdatesResponse
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ListUpdateResponse[]} listUpdateResponses The list updates requested by the clients.
 * @property {string} minimumWaitDuration The minimum duration the client must wait before issuing any update request. If this field is not set clients may update as soon as they want.
 */
/**
 * @typedef ListUpdateResponse
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} threatType The threat type for which data is returned.
 * @property {string} threatEntryType The format of the threats.
 * @property {string} platformType The platform type for which data is returned.
 * @property {string} responseType The type of response. This may indicate that an action is required by the client when the response is received.
 * @property {safebrowsing(v4).ThreatEntrySet[]} additions A set of entries to add to a local threat type&#39;s list. Repeated to allow for a combination of compressed and raw data to be sent in a single response.
 * @property {safebrowsing(v4).ThreatEntrySet[]} removals A set of entries to remove from a local threat type&#39;s list. Repeated for the same reason as above.
 * @property {string} newClientState The new client state, in encrypted format. Opaque to clients.
 * @property {safebrowsing(v4).Checksum} checksum The expected SHA256 hash of the client state; that is, of the sorted list of all hashes present in the database after applying the provided update. If the client state doesn&#39;t match the expected state, the client must disregard this update and retry later.
 */
/**
 * @typedef ThreatEntrySet
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} compressionType The compression type for the entries in this set.
 * @property {safebrowsing(v4).RawHashes} rawHashes The raw SHA256-formatted entries.
 * @property {safebrowsing(v4).RawIndices} rawIndices The raw removal indices for a local list.
 * @property {safebrowsing(v4).RiceDeltaEncoding} riceHashes The encoded 4-byte prefixes of SHA256-formatted entries, using a Golomb-Rice encoding.
 * @property {safebrowsing(v4).RiceDeltaEncoding} riceIndices The encoded local, lexicographically-sorted list indices, using a Golomb-Rice encoding. Used for sending compressed removal indices.
 */
/**
 * @typedef RawHashes
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {integer} prefixSize The number of bytes for each prefix encoded below. This field can be anywhere from 4 (shortest prefix) to 32 (full SHA256 hash).
 * @property {string} rawHashes The hashes, all concatenated into one long string. Each hash has a prefix size of |prefix_size| above. Hashes are sorted in lexicographic order.
 */
/**
 * @typedef RawIndices
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {integer[]} indices The indices to remove from a lexicographically-sorted local list.
 */
/**
 * @typedef RiceDeltaEncoding
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} firstValue The offset of the first entry in the encoded data, or, if only a single integer was encoded, that single integer&#39;s value.
 * @property {integer} riceParameter The Golomb-Rice parameter, which is a number between 2 and 28. This field is missing (that is, zero) if `num_entries` is zero.
 * @property {integer} numEntries The number of entries that are delta encoded in the encoded data. If only a single integer was encoded, this will be zero and the single value will be stored in `first_value`.
 * @property {string} encodedData The encoded deltas that are encoded using the Golomb-Rice coder.
 */
/**
 * @typedef Checksum
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} sha256 The SHA256 hash of the client state; that is, of the sorted list of all hashes present in the database.
 */
/**
 * @typedef FindFullHashesRequest
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ClientInfo} client The client metadata.
 * @property {string[]} clientStates The current client states for each of the client&#39;s local threat lists.
 * @property {safebrowsing(v4).ThreatInfo} threatInfo The lists and hashes to be checked.
 */
/**
 * @typedef FindFullHashesResponse
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ThreatMatch[]} matches The full hashes that matched the requested prefixes.
 * @property {string} minimumWaitDuration The minimum duration the client must wait before issuing any find hashes request. If this field is not set, clients can issue a request as soon as they want.
 * @property {string} negativeCacheDuration For requested entities that did not match the threat list, how long to cache the response.
 */
/**
 * @typedef ListThreatListsResponse
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {safebrowsing(v4).ThreatListDescriptor[]} threatLists The lists available for download by the client.
 */
/**
 * @typedef ThreatListDescriptor
 * @memberOf! safebrowsing(v4)
 * @type object
 * @property {string} threatType The threat type posed by the list&#39;s entries.
 * @property {string} platformType The platform type targeted by the list&#39;s entries.
 * @property {string} threatEntryType The entry types contained in the list.
 */
module.exports = Safebrowsing;
