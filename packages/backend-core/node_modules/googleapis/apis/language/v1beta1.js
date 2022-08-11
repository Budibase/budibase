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
 * Google Cloud Natural Language API
 *
 * Google Cloud Natural Language API provides natural language understanding technologies to developers. Examples include sentiment analysis, entity recognition, and text annotations.
 *
 * @example
 * var google = require('googleapis');
 * var language = google.language('v1beta1');
 *
 * @namespace language
 * @type {Function}
 * @version v1beta1
 * @variation v1beta1
 * @param {object=} options Options for Language
 */
function Language(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.documents = {

    /**
     * language.documents.analyzeSentiment
     *
     * @desc Analyzes the sentiment of the provided text.
     *
     * @alias language.documents.analyzeSentiment
     * @memberOf! language(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {language(v1beta1).AnalyzeSentimentRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    analyzeSentiment: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://language.googleapis.com/v1beta1/documents:analyzeSentiment',
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
     * language.documents.analyzeSyntax
     *
     * @desc Analyzes the syntax of the text and provides sentence boundaries and tokenization along with part of speech tags, dependency trees, and other properties.
     *
     * @alias language.documents.analyzeSyntax
     * @memberOf! language(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {language(v1beta1).AnalyzeSyntaxRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    analyzeSyntax: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://language.googleapis.com/v1beta1/documents:analyzeSyntax',
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
     * language.documents.annotateText
     *
     * @desc A convenience method that provides all the features that analyzeSentiment, analyzeEntities, and analyzeSyntax provide in one call.
     *
     * @alias language.documents.annotateText
     * @memberOf! language(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {language(v1beta1).AnnotateTextRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    annotateText: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://language.googleapis.com/v1beta1/documents:annotateText',
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
     * language.documents.analyzeEntities
     *
     * @desc Finds named entities (currently finds proper names) in the text, entity types, salience, mentions for each entity, and other properties.
     *
     * @alias language.documents.analyzeEntities
     * @memberOf! language(v1beta1)
     *
     * @param {object} params Parameters for request
     * @param {language(v1beta1).AnalyzeEntitiesRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    analyzeEntities: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://language.googleapis.com/v1beta1/documents:analyzeEntities',
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
 * @typedef Document
 * @memberOf! language(v1beta1)
 * @type object
* @property {string} language The language of the document (if not specified, the language is
automatically detected). Both ISO and BCP-47 language codes are
accepted.&lt;br&gt;
**Current Language Restrictions:**

 * Only English, Spanish, and Japanese textual content are supported.
If the language (either specified by the caller or automatically detected)
is not supported by the called API method, an `INVALID_ARGUMENT` error
is returned.
* @property {string} gcsContentUri The Google Cloud Storage URI where the file content is located.
This URI must be of the form: gs://bucket_name/object_name. For more
details, see https://cloud.google.com/storage/docs/reference-uris.
NOTE: Cloud Storage object versioning is not supported.
* @property {string} type Required. If the type is not set or is `TYPE_UNSPECIFIED`,
returns an `INVALID_ARGUMENT` error.
* @property {string} content The content of the input in string format.
*/
/**
 * @typedef TextSpan
 * @memberOf! language(v1beta1)
 * @type object
* @property {integer} beginOffset The API calculates the beginning offset of the content in the original
document according to the EncodingType specified in the API request.
* @property {string} content The content of the output text.
*/
/**
 * @typedef Status
 * @memberOf! language(v1beta1)
 * @type object
* @property {integer} code The status code, which should be an enum value of google.rpc.Code.
* @property {object[]} details A list of messages that carry the error details.  There will be a
common set of message types for APIs to use.
* @property {string} message A developer-facing error message, which should be in English. Any
user-facing error message should be localized and sent in the
google.rpc.Status.details field, or localized by the client.
*/
/**
 * @typedef AnalyzeEntitiesRequest
 * @memberOf! language(v1beta1)
 * @type object
 * @property {language(v1beta1).Document} document Input document.
 * @property {string} encodingType The encoding type used by the API to calculate offsets.
 */
/**
 * @typedef EntityMention
 * @memberOf! language(v1beta1)
 * @type object
 * @property {language(v1beta1).TextSpan} text The mention text.
 * @property {string} type The type of the entity mention.
 */
/**
 * @typedef AnalyzeSentimentRequest
 * @memberOf! language(v1beta1)
 * @type object
* @property {language(v1beta1).Document} document Input document. Currently, `analyzeSentiment` only supports English text
(Document.language=&quot;EN&quot;).
* @property {string} encodingType The encoding type used by the API to calculate sentence offsets for the
sentence sentiment.
*/
/**
 * @typedef AnalyzeSentimentResponse
 * @memberOf! language(v1beta1)
 * @type object
* @property {language(v1beta1).Sentiment} documentSentiment The overall sentiment of the input document.
* @property {string} language The language of the text, which will be the same as the language specified
in the request or, if not specified, the automatically-detected language.
* @property {language(v1beta1).Sentence[]} sentences The sentiment for all the sentences in the document.
*/
/**
 * @typedef AnalyzeSyntaxRequest
 * @memberOf! language(v1beta1)
 * @type object
 * @property {language(v1beta1).Document} document Input document.
 * @property {string} encodingType The encoding type used by the API to calculate offsets.
 */
/**
 * @typedef DependencyEdge
 * @memberOf! language(v1beta1)
 * @type object
* @property {integer} headTokenIndex Represents the head of this token in the dependency tree.
This is the index of the token which has an arc going to this token.
The index is the position of the token in the array of tokens returned
by the API method. If this token is a root token, then the
`head_token_index` is its own index.
* @property {string} label The parse label for the token.
*/
/**
 * @typedef AnalyzeSyntaxResponse
 * @memberOf! language(v1beta1)
 * @type object
* @property {string} language The language of the text, which will be the same as the language specified
in the request or, if not specified, the automatically-detected language.
See Document.language field for more details.
* @property {language(v1beta1).Token[]} tokens Tokens, along with their syntactic information, in the input document.
* @property {language(v1beta1).Sentence[]} sentences Sentences in the input document.
*/
/**
 * @typedef AnnotateTextRequest
 * @memberOf! language(v1beta1)
 * @type object
 * @property {language(v1beta1).Document} document Input document.
 * @property {string} encodingType The encoding type used by the API to calculate offsets.
 * @property {language(v1beta1).Features} features The enabled features.
 */
/**
 * @typedef Sentence
 * @memberOf! language(v1beta1)
 * @type object
* @property {language(v1beta1).TextSpan} text The sentence text.
* @property {language(v1beta1).Sentiment} sentiment For calls to AnalyzeSentiment or if
AnnotateTextRequest.Features.extract_document_sentiment is set to
true, this field will contain the sentiment for the sentence.
*/
/**
 * @typedef Features
 * @memberOf! language(v1beta1)
 * @type object
 * @property {boolean} extractDocumentSentiment Extract document-level sentiment.
 * @property {boolean} extractEntities Extract entities.
 * @property {boolean} extractSyntax Extract syntax information.
 */
/**
 * @typedef PartOfSpeech
 * @memberOf! language(v1beta1)
 * @type object
 * @property {string} aspect The grammatical aspect.
 * @property {string} gender The grammatical gender.
 * @property {string} person The grammatical person.
 * @property {string} case The grammatical case.
 * @property {string} form The grammatical form.
 * @property {string} tense The grammatical tense.
 * @property {string} proper The grammatical properness.
 * @property {string} mood The grammatical mood.
 * @property {string} tag The part of speech tag.
 * @property {string} number The grammatical number.
 * @property {string} reciprocity The grammatical reciprocity.
 * @property {string} voice The grammatical voice.
 */
/**
 * @typedef AnnotateTextResponse
 * @memberOf! language(v1beta1)
 * @type object
* @property {language(v1beta1).Entity[]} entities Entities, along with their semantic information, in the input document.
Populated if the user enables
AnnotateTextRequest.Features.extract_entities.
* @property {language(v1beta1).Sentiment} documentSentiment The overall sentiment for the document. Populated if the user enables
AnnotateTextRequest.Features.extract_document_sentiment.
* @property {string} language The language of the text, which will be the same as the language specified
in the request or, if not specified, the automatically-detected language.
See Document.language field for more details.
* @property {language(v1beta1).Token[]} tokens Tokens, along with their syntactic information, in the input document.
Populated if the user enables
AnnotateTextRequest.Features.extract_syntax.
* @property {language(v1beta1).Sentence[]} sentences Sentences in the input document. Populated if the user enables
AnnotateTextRequest.Features.extract_syntax.
*/
/**
 * @typedef Entity
 * @memberOf! language(v1beta1)
 * @type object
* @property {object} metadata Metadata associated with the entity.

Currently, Wikipedia URLs and Knowledge Graph MIDs are provided, if
available. The associated keys are &quot;wikipedia_url&quot; and &quot;mid&quot;, respectively.
* @property {number} salience The salience score associated with the entity in the [0, 1.0] range.

The salience score for an entity provides information about the
importance or centrality of that entity to the entire document text.
Scores closer to 0 are less salient, while scores closer to 1.0 are highly
salient.
* @property {string} type The entity type.
* @property {language(v1beta1).EntityMention[]} mentions The mentions of this entity in the input document. The API currently
supports proper noun mentions.
* @property {string} name The representative name for the entity.
*/
/**
 * @typedef Sentiment
 * @memberOf! language(v1beta1)
 * @type object
* @property {number} score Sentiment score between -1.0 (negative sentiment) and 1.0
(positive sentiment).
* @property {number} polarity DEPRECATED FIELD - This field is being deprecated in
favor of score. Please refer to our documentation at
https://cloud.google.com/natural-language/docs for more information.
* @property {number} magnitude A non-negative number in the [0, +inf) range, which represents
the absolute magnitude of sentiment regardless of score (positive or
negative).
*/
/**
 * @typedef Token
 * @memberOf! language(v1beta1)
 * @type object
 * @property {language(v1beta1).TextSpan} text The token text.
 * @property {language(v1beta1).PartOfSpeech} partOfSpeech Parts of speech tag for this token.
 * @property {language(v1beta1).DependencyEdge} dependencyEdge Dependency tree parse for this token.
 * @property {string} lemma [Lemma](https://en.wikipedia.org/wiki/Lemma_%28morphology%29) of the token.
 */
/**
 * @typedef AnalyzeEntitiesResponse
 * @memberOf! language(v1beta1)
 * @type object
* @property {language(v1beta1).Entity[]} entities The recognized entities in the input document.
* @property {string} language The language of the text, which will be the same as the language specified
in the request or, if not specified, the automatically-detected language.
See Document.language field for more details.
*/
module.exports = Language;
