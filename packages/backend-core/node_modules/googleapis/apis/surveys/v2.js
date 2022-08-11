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
 * Surveys API
 *
 * Creates and conducts surveys, lists the surveys that an authenticated user owns, and retrieves survey results and information about specified surveys.
 *
 * @example
 * var google = require('googleapis');
 * var surveys = google.surveys('v2');
 *
 * @namespace surveys
 * @type {Function}
 * @version v2
 * @variation v2
 * @param {object=} options Options for Surveys
 */
function Surveys(options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

  self.mobileapppanels = {

    /**
     * surveys.mobileapppanels.get
     *
     * @desc Retrieves a MobileAppPanel that is available to the authenticated user.
     *
     * @alias surveys.mobileapppanels.get
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.panelId External URL ID for the panel.
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
          url: 'https://www.googleapis.com/surveys/v2/mobileAppPanels/{panelId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['panelId'],
        pathParams: ['panelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * surveys.mobileapppanels.list
     *
     * @desc Lists the MobileAppPanels available to the authenticated user.
     *
     * @alias surveys.mobileapppanels.list
     * @memberOf! surveys(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/surveys/v2/mobileAppPanels',
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
     * surveys.mobileapppanels.update
     *
     * @desc Updates a MobileAppPanel. Currently the only property that can be updated is the owners property.
     *
     * @alias surveys.mobileapppanels.update
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.panelId External URL ID for the panel.
     * @param {surveys(v2).MobileAppPanel} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/surveys/v2/mobileAppPanels/{panelId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['panelId'],
        pathParams: ['panelId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.results = {

    /**
     * surveys.results.get
     *
     * @desc Retrieves any survey results that have been produced so far. Results are formatted as an Excel file. You must add "?alt=media" to the URL as an argument to get results.
     *
     * @alias surveys.results.get
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
     * @param {surveys(v2).ResultsGetRequest} params.resource Request body data
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
          url: 'https://www.googleapis.com/surveys/v2/surveys/{surveyUrlId}/results',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };

  self.surveys = {

    /**
     * surveys.surveys.delete
     *
     * @desc Removes a survey from view in all user GET requests.
     *
     * @alias surveys.surveys.delete
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
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
          url: 'https://www.googleapis.com/surveys/v2/surveys/{surveyUrlId}',
          method: 'DELETE'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * surveys.surveys.get
     *
     * @desc Retrieves information about the specified survey.
     *
     * @alias surveys.surveys.get
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
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
          url: 'https://www.googleapis.com/surveys/v2/surveys/{surveyUrlId}',
          method: 'GET'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * surveys.surveys.insert
     *
     * @desc Creates a survey.
     *
     * @alias surveys.surveys.insert
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {surveys(v2).Survey} params.resource Request body data
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
          url: 'https://www.googleapis.com/surveys/v2/surveys',
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
     * surveys.surveys.list
     *
     * @desc Lists the surveys owned by the authenticated user.
     *
     * @alias surveys.surveys.list
     * @memberOf! surveys(v2)
     *
     * @param {object=} params Parameters for request
     * @param {integer=} params.maxResults 
     * @param {integer=} params.startIndex 
     * @param {string=} params.token 
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
          url: 'https://www.googleapis.com/surveys/v2/surveys',
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
     * surveys.surveys.start
     *
     * @desc Begins running a survey.
     *
     * @alias surveys.surveys.start
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resourceId 
     * @param {surveys(v2).SurveysStartRequest} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    start: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/surveys/v2/surveys/{resourceId}/start',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resourceId'],
        pathParams: ['resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * surveys.surveys.stop
     *
     * @desc Stops a running survey.
     *
     * @alias surveys.surveys.stop
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.resourceId 
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    stop: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/surveys/v2/surveys/{resourceId}/stop',
          method: 'POST'
        }, options),
        params: params,
        requiredParams: ['resourceId'],
        pathParams: ['resourceId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    },

    /**
     * surveys.surveys.update
     *
     * @desc Updates a survey. Currently the only property that can be updated is the owners property.
     *
     * @alias surveys.surveys.update
     * @memberOf! surveys(v2)
     *
     * @param {object} params Parameters for request
     * @param {string} params.surveyUrlId External URL ID for the survey.
     * @param {surveys(v2).Survey} params.resource Request body data
     * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
     * @param {callback} callback The callback that handles the response.
     * @return {object} Request object
     */
    update: function (params, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options || (options = {});

      var parameters = {
        options: utils.extend({
          url: 'https://www.googleapis.com/surveys/v2/surveys/{surveyUrlId}',
          method: 'PUT'
        }, options),
        params: params,
        requiredParams: ['surveyUrlId'],
        pathParams: ['surveyUrlId'],
        context: self
      };

      return createAPIRequest(parameters, callback);
    }

  };
}

/**
 * @typedef FieldMask
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).FieldMask[]} fields 
 * @property {integer} id 
 */
/**
 * @typedef MobileAppPanel
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} country Country code for the country of the users that the panel contains. Uses standard ISO 3166-1 2-character language codes. For instance, &#39;US&#39; for the United States, and &#39;GB&#39; for the United Kingdom. Any survey created targeting this panel must also target the corresponding country.
 * @property {boolean} isPublicPanel Whether or not the panel is accessible to all API users.
 * @property {string} language Language code that the panel can target. For instance, &#39;en-US&#39;. Uses standard BCP47 language codes. See specification. Any survey created targeting this panel must also target the corresponding language.
 * @property {string} mobileAppPanelId Unique panel ID string. This corresponds to the mobile_app_panel_id used in Survey Insert requests.
 * @property {string} name Human readable name of the audience panel.
 * @property {string[]} owners List of email addresses for users who can target members of this panel. Must contain at least the address of the user making the API call for panels that are not public. This field will be empty for public panels.
 */
/**
 * @typedef MobileAppPanelsListResponse
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).PageInfo} pageInfo 
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {surveys(v2).MobileAppPanel[]} resources An individual predefined panel of Opinion Rewards mobile users.
 * @property {surveys(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef PageInfo
 * @memberOf! surveys(v2)
 * @type object
 * @property {integer} resultPerPage 
 * @property {integer} startIndex 
 * @property {integer} totalResults 
 */
/**
 * @typedef ResultsGetRequest
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).ResultsMask} resultMask 
 */
/**
 * @typedef ResultsMask
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).FieldMask[]} fields 
 * @property {string} projection 
 */
/**
 * @typedef Survey
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).SurveyAudience} audience Targeting-criteria message containing demographic information
 * @property {surveys(v2).SurveyCost} cost Cost to run the survey and collect the necessary number of responses.
 * @property {string} customerData Additional information to store on behalf of the API consumer and associate with this question. This binary blob is treated as opaque. This field is limited to 64K bytes.
 * @property {string} description Text description of the survey.
 * @property {string[]} owners List of email addresses for survey owners. Must contain at least the address of the user making the API call.
 * @property {surveys(v2).SurveyQuestion[]} questions List of questions defining the survey.
 * @property {surveys(v2).SurveyRejection} rejectionReason Reason for the survey being rejected. Only present if the survey state is rejected.
 * @property {string} state State that the survey is in.
 * @property {string} surveyUrlId Unique survey ID, that is viewable in the URL of the Survey Creator UI
 * @property {string} title Optional name that will be given to the survey.
 * @property {integer} wantedResponseCount Number of responses desired for the survey.
 */
/**
 * @typedef SurveyAudience
 * @memberOf! surveys(v2)
 * @type object
 * @property {string[]} ages Optional list of age buckets to target. Supported age buckets are: [&#39;18-24&#39;, &#39;25-34&#39;, &#39;35-44&#39;, &#39;45-54&#39;, &#39;55-64&#39;, &#39;65+&#39;]
 * @property {string} country Required country code that surveys should be targeted to. Accepts standard ISO 3166-1 2 character language codes. For instance, &#39;US&#39; for the United States, and &#39;GB&#39; for the United Kingdom.
 * @property {string} countrySubdivision Country subdivision (states/provinces/etc) that surveys should be targeted to. For all countries except GB, ISO-3166-2 subdivision code is required (eg. &#39;US-OH&#39; for Ohio, United States). For GB, NUTS 1 statistical region codes for the United Kingdom is required (eg. &#39;UK-UKC&#39; for North East England).
 * @property {string} gender Optional gender to target.
 * @property {string[]} languages Language code that surveys should be targeted to. For instance, &#39;en-US&#39;. Surveys may target bilingual users by specifying a list of language codes (for example, &#39;de&#39; and &#39;en-US&#39;). In that case, all languages will be used for targeting users but the survey content (which is displayed) must match the first language listed. Accepts standard BCP47 language codes. See specification.
 * @property {string} mobileAppPanelId Key for predefined panel that causes survey to be sent to a predefined set of Opinion Rewards App users. You must set PopulationSource to ANDROID_APP_PANEL to use this field.
 * @property {string} populationSource Online population source where the respondents are sampled from.
 */
/**
 * @typedef SurveyCost
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} costPerResponseNanos Cost per survey response in nano units of the given currency. To get the total cost for a survey, multiply this value by wanted_response_count.
 * @property {string} currencyCode Currency code that the cost is given in.
 * @property {string} maxCostPerResponseNanos Threshold to start a survey automatically if the quoted price is at most this value. When a survey has a Screener (threshold) question, it must go through an incidence pricing test to determine the final cost per response. Typically you will have to make a followup call to start the survey giving the final computed cost per response. If the survey has no threshold_answers, setting this property will return an error. By specifying this property, you indicate the max price per response you are willing to pay in advance of the incidence test. If the price turns out to be lower than the specified value, the survey will begin immediately and you will be charged at the rate determined by the incidence pricing test. If the price turns out to be greater than the specified value the survey will not be started and you will instead be notified what price was determined by the incidence test. At that point, you must raise the value of this property to be greater than or equal to that cost before attempting to start the survey again. This will immediately start the survey as long the incidence test was run within the last 21 days.
 * @property {string} nanos Cost of survey in nano units of the given currency. DEPRECATED in favor of cost_per_response_nanos
 */
/**
 * @typedef SurveyQuestion
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} answerOrder The randomization option for multiple choice and multi-select questions. If not specified, this option defaults to randomize.
 * @property {string[]} answers Required list of answer options for a question.
 * @property {boolean} hasOther Option to allow open-ended text box for Single Answer and Multiple Answer question types. This can be used with SINGLE_ANSWER, SINGLE_ANSWER_WITH_IMAGE, MULTIPLE_ANSWERS, and MULTIPLE_ANSWERS_WITH_IMAGE question types.
 * @property {string} highValueLabel For rating questions, the text for the higher end of the scale, such as &#39;Best&#39;. For numeric questions, a string representing a floating-point that is the maximum allowed number for a response.
 * @property {surveys(v2).SurveyQuestionImage[]} images 
 * @property {boolean} lastAnswerPositionPinned Currently only support pinning an answer option to the last position.
 * @property {string} lowValueLabel For rating questions, the text for the lower end of the scale, such as &#39;Worst&#39;. For numeric questions, a string representing a floating-point that is the minimum allowed number for a response.
 * @property {boolean} mustPickSuggestion Option to force the user to pick one of the open text suggestions. This requires that suggestions are provided for this question.
 * @property {string} numStars Number of stars to use for ratings questions.
 * @property {string} openTextPlaceholder Placeholder text for an open text question.
 * @property {string[]} openTextSuggestions A list of suggested answers for open text question auto-complete. This is only valid if single_line_response is true.
 * @property {string} question Required question text shown to the respondent.
 * @property {string} sentimentText Used by the Rating Scale with Text question type. This text goes along with the question field that is presented to the respondent, and is the actual text that the respondent is asked to rate.
 * @property {boolean} singleLineResponse Option to allow multiple line open text responses instead of a single line response. Note that we don&#39;t show auto-complete suggestions with multiple line responses.
 * @property {string[]} thresholdAnswers The threshold/screener answer options, which will screen a user into the rest of the survey. These will be a subset of the answer option strings.
 * @property {string} type Required field defining the question type. For details about configuring different type of questions, consult the question configuration guide.
 * @property {string} unitOfMeasurementLabel Optional unit of measurement for display (for example: hours, people, miles).
 * @property {string} videoId The YouTube video ID to be show in video questions.
 */
/**
 * @typedef SurveyQuestionImage
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} altText The alt text property used in image tags is required for all images.
 * @property {string} data Inline jpeg, gif, tiff, bmp, or png image raw bytes for an image question types.
 * @property {string} url The read-only URL for the hosted images.
 */
/**
 * @typedef SurveyRejection
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} explanation A human-readable explanation of what was wrong with the survey.
 * @property {string} type Which category of rejection this was. See the  Google Surveys Help Center for additional details on each category.
 */
/**
 * @typedef SurveyResults
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} status Human readable string describing the status of the request.
 * @property {string} surveyUrlId External survey ID as viewable by survey owners in the editor view.
 */
/**
 * @typedef SurveysDeleteResponse
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 */
/**
 * @typedef SurveysListResponse
 * @memberOf! surveys(v2)
 * @type object
 * @property {surveys(v2).PageInfo} pageInfo 
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {surveys(v2).Survey[]} resources An individual survey resource.
 * @property {surveys(v2).TokenPagination} tokenPagination 
 */
/**
 * @typedef SurveysStartRequest
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} maxCostPerResponseNanos Threshold to start a survey automically if the quoted prices is less than or equal to this value. See Survey.Cost for more details.
 */
/**
 * @typedef SurveysStartResponse
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {surveys(v2).Survey} resource Survey object containing the specification of the started Survey.
 */
/**
 * @typedef SurveysStopResponse
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} requestId Unique request ID used for logging and debugging. Please include in any error reporting or troubleshooting requests.
 * @property {surveys(v2).Survey} resource Survey object containing the specification of the stopped Survey.
 */
/**
 * @typedef TokenPagination
 * @memberOf! surveys(v2)
 * @type object
 * @property {string} nextPageToken 
 * @property {string} previousPageToken 
 */
module.exports = Surveys;
