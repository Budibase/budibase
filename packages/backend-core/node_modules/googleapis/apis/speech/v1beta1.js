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
 * Google Cloud Speech API
 *
 * Google Cloud Speech API.
 *
 * @example
 * var google = require('googleapis');
 * var speech = google.speech('v1beta1');
 *
 * @namespace speech
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Speech
 */
function Speech(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.operations = {

    /**
     * speech.operations.get
     *
     * @desc Gets the latest state of a long-running operation.  Clients can use this method to poll the operation result at intervals as recommended by the API service.
     *
     * @alias speech.operations.get
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource.
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
          url: 'https://speech.googleapis.com/v1beta1/operations/{name}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * speech.operations.list
     *
     * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.  NOTE: the `name` binding below allows API services to override the binding to use different resource name schemes, such as `users/x/operations`.
     *
     * @alias speech.operations.list
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {integer=} params.pageSize The standard list page size.
     * @param {string=} params.filter The standard list filter.
     * @param {string=} params.name The name of the operation collection.
     * @param {string=} params.pageToken The standard list page token.
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
          url: 'https://speech.googleapis.com/v1beta1/operations',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: [],
        pathParams: [],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * speech.operations.delete
     *
     * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
     *
     * @alias speech.operations.delete
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be deleted.
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
          url: 'https://speech.googleapis.com/v1beta1/operations/{name}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * speech.operations.cancel
     *
     * @desc Starts asynchronous cancellation on a long-running operation.  The server makes a best effort to cancel the operation, but success is not guaranteed.  If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.  Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
     *
     * @alias speech.operations.cancel
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {string} params.name The name of the operation resource to be cancelled.
     * @param {speech(v1beta1).CancelOperationRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    cancel: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://speech.googleapis.com/v1beta1/operations/{name}:cancel',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['name'],
        pathParams: ['name'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.speech = {

    /**
     * speech.speech.syncrecognize
     *
     * @desc Performs synchronous speech recognition: receive results after all audio has been sent and processed.
     *
     * @alias speech.speech.syncrecognize
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {speech(v1beta1).SyncRecognizeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    syncrecognize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://speech.googleapis.com/v1beta1/speech:syncrecognize',
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
     * speech.speech.asyncrecognize
     *
     * @desc Performs asynchronous speech recognition: receive results via the [google.longrunning.Operations] (/speech/reference/rest/v1beta1/operations#Operation) interface. Returns either an `Operation.error` or an `Operation.response` which contains an `AsyncRecognizeResponse` message.
     *
     * @alias speech.speech.asyncrecognize
     * @memberOf! speech(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {speech(v1beta1).AsyncRecognizeRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    asyncrecognize: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://speech.googleapis.com/v1beta1/speech:asyncrecognize',
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
}

/**
 * @typedef Status
 * @memberOf! speech(v1beta1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef RecognitionAudio
 * @memberOf! speech(v1beta1)
 * @type object
* @property {string} content The audio data bytes encoded as specified in
`RecognitionConfig`. Note: as with all bytes fields, protobuffers use a
pure binary representation, whereas JSON representations use base64.
* @property {string} uri URI that points to a file that contains audio data bytes as specified in
`RecognitionConfig`. Currently, only Google Cloud Storage URIs are
supported, which must be specified in the following format:
`gs://bucket_name/object_name` (other URI formats return
google.rpc.Code.INVALID_ARGUMENT). For more information, see
[Request URIs](https://cloud.google.com/storage/docs/reference-uris).
*/
/**
 * @typedef Operation
 * @memberOf! speech(v1beta1)
 * @type object
* @property {speech(v1beta1).Status} error The error result of the operation in case of failure or cancellation.
* @property {boolean} done If the value is `false`, it means the operation is still in progress.
If true, the operation is completed, and either `error` or `response` is
available.
* @property {object} metadata Service-specific metadata associated with the operation.  It typically
contains progress information and common metadata such as create time.
Some services might not provide such metadata.  Any method that returns a
long-running operation should document the metadata type, if any.
* @property {object} response The normal response of the operation in case of success.  If the original
method returns no data on success, such as `Delete`, the response is
`google.protobuf.Empty`.  If the original method is standard
`Get`/`Create`/`Update`, the response should be the resource.  For other
methods, the response should have the type `XxxResponse`, where `Xxx`
is the original method name.  For example, if the original method name
is `TakeSnapshot()`, the inferred response type is
`TakeSnapshotResponse`.
* @property {string} name The server-assigned name, which is only unique within the same service that
originally returns it. If you use the default HTTP mapping, the
`name` should have the format of `operations/some/unique/name`.
*/
/**
 * @typedef SpeechRecognitionAlternative
 * @memberOf! speech(v1beta1)
 * @type object
* @property {string} transcript [Output-only] Transcript text representing the words that the user spoke.
* @property {number} confidence [Output-only] The confidence estimate between 0.0 and 1.0. A higher number
means the system is more confident that the recognition is correct.
This field is typically provided only for the top hypothesis, and only for
`is_final=true` results.
The default of 0.0 is a sentinel value indicating confidence was not set.
*/
/**
 * @typedef CancelOperationRequest
 * @memberOf! speech(v1beta1)
 * @type object
 */
/**
 * @typedef RecognitionConfig
 * @memberOf! speech(v1beta1)
 * @type object
* @property {integer} maxAlternatives [Optional] Maximum number of recognition hypotheses to be returned.
Specifically, the maximum number of `SpeechRecognitionAlternative` messages
within each `SpeechRecognitionResult`.
The server may return fewer than `max_alternatives`.
Valid values are `0`-`30`. A value of `0` or `1` will return a maximum of
`1`. If omitted, defaults to `1`.
* @property {string} languageCode [Optional] The language of the supplied audio as a BCP-47 language tag.
Example: &quot;en-GB&quot;  https://www.rfc-editor.org/rfc/bcp/bcp47.txt
If omitted, defaults to &quot;en-US&quot;. See
[Language Support](https://cloud.google.com/speech/docs/languages)
for a list of the currently supported language codes.
* @property {speech(v1beta1).SpeechContext} speechContext [Optional] A means to provide context to assist the speech recognition.
* @property {string} encoding [Required] Encoding of audio data sent in all `RecognitionAudio` messages.
* @property {boolean} profanityFilter [Optional] If set to `true`, the server will attempt to filter out
profanities, replacing all but the initial character in each filtered word
with asterisks, e.g. &quot;f***&quot;. If set to `false` or omitted, profanities
won&#39;t be filtered out.
* @property {integer} sampleRate [Required] Sample rate in Hertz of the audio data sent in all
`RecognitionAudio` messages. Valid values are: 8000-48000.
16000 is optimal. For best results, set the sampling rate of the audio
source to 16000 Hz. If that&#39;s not possible, use the native sample rate of
the audio source (instead of re-sampling).
*/
/**
 * @typedef SyncRecognizeRequest
 * @memberOf! speech(v1beta1)
 * @type object
* @property {speech(v1beta1).RecognitionAudio} audio [Required] The audio data to be recognized.
* @property {speech(v1beta1).RecognitionConfig} config [Required] The `config` message provides information to the recognizer
that specifies how to process the request.
*/
/**
 * @typedef SpeechRecognitionResult
 * @memberOf! speech(v1beta1)
 * @type object
* @property {speech(v1beta1).SpeechRecognitionAlternative[]} alternatives [Output-only] May contain one or more recognition hypotheses (up to the
maximum specified in `max_alternatives`).
*/
/**
 * @typedef ListOperationsResponse
 * @memberOf! speech(v1beta1)
 * @type object
 * @property {string} nextPageToken The standard List next-page token.
 * @property {speech(v1beta1).Operation[]} operations A list of operations that matches the specified filter in the request.
 */
/**
 * @typedef Empty
 * @memberOf! speech(v1beta1)
 * @type object
 */
/**
 * @typedef SyncRecognizeResponse
 * @memberOf! speech(v1beta1)
 * @type object
* @property {speech(v1beta1).SpeechRecognitionResult[]} results [Output-only] Sequential list of transcription results corresponding to
sequential portions of audio.
*/
/**
 * @typedef SpeechContext
 * @memberOf! speech(v1beta1)
 * @type object
* @property {string[]} phrases [Optional] A list of strings containing words and phrases &quot;hints&quot; so that
the speech recognition is more likely to recognize them. This can be used
to improve the accuracy for specific words and phrases, for example, if
specific commands are typically spoken by the user. This can also be used
to add additional words to the vocabulary of the recognizer. See
[usage limits](https://cloud.google.com/speech/limits#content).
*/
/**
 * @typedef AsyncRecognizeRequest
 * @memberOf! speech(v1beta1)
 * @type object
* @property {speech(v1beta1).RecognitionAudio} audio [Required] The audio data to be recognized.
* @property {speech(v1beta1).RecognitionConfig} config [Required] The `config` message provides information to the recognizer
that specifies how to process the request.
*/
module.exports = Speech;
